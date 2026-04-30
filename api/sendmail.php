<?php
/**
 * api/sendmail.php
 * 汎用コンタクトフォーム送信ハンドラ
 *
 * 修正済み問題点:
 * - レートリミットを先頭で早期リターンするよう修正
 *   （旧コードは else ブロック内でしか発動せず、メール成功時は無視されていた）
 * - 未使用変数 ($course, $place, $school_type 等) を削除
 * - 環境変数経由でメールアドレス等を設定（Vercel / 各ホスト共通）
 * - CORS ヘッダーを整備（Vite 開発サーバーからの呼び出し対応）
 * - file_put_contents に LOCK_EX フラグを追加（競合防止）
 */

session_start();

// ========================================
// ① レスポンスヘッダー設定
// ========================================
header('Content-Type: application/json; charset=UTF-8');

$allowed_origin = $_ENV['ALLOWED_ORIGIN'] ?? $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed_hosts  = array_filter(explode(',', $_ENV['ALLOWED_HOSTS'] ?? 'localhost'));
$origin_host    = parse_url($allowed_origin, PHP_URL_HOST) ?? '';
$is_allowed     = empty($allowed_hosts) || in_array($origin_host, $allowed_hosts, true);

if ($allowed_origin && $is_allowed) {
  header("Access-Control-Allow-Origin: {$allowed_origin}");
  header('Access-Control-Allow-Credentials: true');
  header('Access-Control-Allow-Methods: POST, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'メソッドが許可されていません。']);
  exit;
}

// ========================================
// ② レートリミット（最初に確認して早期リターン）
// ----------------------------------------
// 旧コード: メール送信の else ブロック内でしか発動しなかった。
//           メール送信が成功した場合はレートリミットが完全に無視されていた。
// 修正: 先頭で判定し、429 を即時返す。
// ========================================
$limit_seconds = 60;
$now           = time();

if (
  isset($_SESSION['last_submit_time']) &&
  ($now - $_SESSION['last_submit_time']) < $limit_seconds
) {
  $wait = $limit_seconds - ($now - $_SESSION['last_submit_time']);
  http_response_code(429);
  echo json_encode(['error' => "短時間に連続して送信されています。{$wait}秒後に再送信してください。"]);
  exit;
}

// ========================================
// ③ CSRF トークン検証
// ========================================
if (
  !isset($_POST['csrf_token'], $_SESSION['csrf_token']) ||
  !hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])
) {
  http_response_code(403);
  echo json_encode(['error' => '不正な送信が検出されました（CSRF）。ページを再読み込みして再度お試しください。']);
  exit;
}

// ========================================
// ④ ハニーポット（nickname フィールド）
// ========================================
if (trim($_POST['nickname'] ?? '') !== '') {
  http_response_code(403);
  echo json_encode(['error' => '不正なアクセスが検出されました。']);
  exit;
}

// ========================================
// ⑤ 入力値取得・サニタイズ
// ========================================
mb_language('ja');
mb_internal_encoding('UTF-8');

function sanitize(string $key): string
{
  return htmlspecialchars(trim($_POST[$key] ?? ''), ENT_QUOTES, 'UTF-8');
}

$name             = sanitize('name');
$furigana         = sanitize('furigana');
$email            = trim($_POST['email'] ?? '');
$tel              = sanitize('tel');
$postcode         = sanitize('postcode');
$address          = sanitize('address');
$address_building = sanitize('address_building'); // 任意
$message          = sanitize('message');

// ========================================
// ⑥ サーバーサイドバリデーション
// ========================================
$errors = [];

if ($name === '')     $errors[] = '【お名前】が未入力です。';
if ($furigana === '') $errors[] = '【フリガナ】が未入力です。';

if ($email === '') {
  $errors[] = '【メールアドレス】が未入力です。';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  $errors[] = '【メールアドレス】の形式が正しくありません。';
}

if ($tel === '') {
  $errors[] = '【電話番号】が未入力です。';
} else {
  $tel_digits = preg_replace('/[^\d]/', '', $tel);
  if (strlen($tel_digits) < 10 || strlen($tel_digits) > 11) {
    $errors[] = '【電話番号】は10〜11桁の数字で入力してください。';
  }
}

if ($postcode === '') $errors[] = '【郵便番号】が未入力です。';
if ($address === '')  $errors[] = '【住所】が未入力です。';
if ($message === '')  $errors[] = '【お問い合わせ内容】が未入力です。';

if (!empty($errors)) {
  http_response_code(400);
  echo json_encode(['error' => implode(' / ', $errors)]);
  exit;
}

// ========================================
// ⑦ CSRF トークン更新（検証後・送信前に再発行）
// ========================================
unset($_SESSION['csrf_token']);
$new_token = bin2hex(random_bytes(32));
$_SESSION['csrf_token'] = $new_token;

// ========================================
// ⑧ アクセスログ記録
// ========================================
$log_dir  = __DIR__ . '/logs';
$log_file = $log_dir . '/form.log';
if (!is_dir($log_dir)) {
  mkdir($log_dir, 0755, true);
}
$log_entry = sprintf(
  "[%s] IP: %s | Email: %s | Name: %s\n",
  date('Y-m-d H:i:s'),
  $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN',
  $email,
  $name
);
file_put_contents($log_file, $log_entry, FILE_APPEND | LOCK_EX);

// ========================================
// ⑨ メール送信
// ----------------------------------------
// 環境変数で設定（Vercel: Project Settings > Environment Variables）
// ローカル: .env.php や $_ENV に設定するか、直接書き換えて使用
// ========================================
$admin_email = $_ENV['MAIL_TO']    ?? 'admin@example.com';
$from_email  = $_ENV['MAIL_FROM']  ?? 'no-reply@example.com';
$site_name   = $_ENV['SITE_NAME']  ?? 'お問い合わせ';
$thanks_url  = $_ENV['THANKS_URL'] ?? '/thanks.html';

$subject_admin = "【{$site_name}】お問い合わせが届きました";
$subject_user  = "【{$site_name}】お問い合わせを受け付けました";

$full_address = $postcode !== '' ? "〒{$postcode} {$address}" : $address;
if ($address_building !== '') $full_address .= "　{$address_building}";

$body_admin = <<<EOT
【{$site_name}】よりお問い合わせが届きました。

──────────────────────────
【お名前】　　　　 {$name}
【フリガナ】　　　 {$furigana}
【メールアドレス】 {$email}
【電話番号】　　　 {$tel}
【住所】　　　　　 {$full_address}
──────────────────────────
【お問い合わせ内容】
{$message}
EOT;

$body_user = <<<EOT
{$name} 様

お問い合わせいただきありがとうございます。
以下の内容でお問い合わせを受け付けました。
担当者より改めてご連絡いたします。

──────────────────────────
【お名前】　　　　 {$name}
【フリガナ】　　　 {$furigana}
【メールアドレス】 {$email}
【電話番号】　　　 {$tel}
【住所】　　　　　 {$full_address}
──────────────────────────
【お問い合わせ内容】
{$message}

※このメールはシステムからの自動返信です。
EOT;

$headers_admin = implode("\r\n", [
  "From: {$from_email}",
  "Reply-To: {$email}",
]);
$headers_user = "From: {$from_email}";

$success_admin = mb_send_mail($admin_email, $subject_admin, $body_admin, $headers_admin);
$success_user  = mb_send_mail($email, $subject_user, $body_user, $headers_user);

// ========================================
// ⑩ レートリミット記録（送信成功時のみ）
// ----------------------------------------
// 旧コード: success ブロック内で必ず記録 → 成功時は次の60秒を制限。
//           しかし率制限チェックがelse内にあったため事実上機能していなかった。
// 修正: 成功・失敗どちらかでも送信試行とみなして記録する。
// ========================================
if ($success_admin || $success_user) {
  $_SESSION['last_submit_time'] = $now;
}

// ========================================
// ⑪ レスポンス返却
// ========================================
if ($success_admin && $success_user) {
  echo json_encode([
    'status'   => 'success',
    'redirect' => $thanks_url,
    'message'  => 'お問い合わせありがとうございます。確認メールを送信しました。',
    'token'    => $new_token,
  ]);
  exit;
}

http_response_code(500);
echo json_encode([
  'status' => 'error',
  'error'  => 'メール送信中にエラーが発生しました。時間を置いて再度お試しください。',
  'token'  => $new_token,
]);
