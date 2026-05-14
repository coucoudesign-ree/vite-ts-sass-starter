<?php
/**
 * api/csrf-token.php
 * CSRFトークン発行エンドポイント
 * GET リクエストで JSON を返す
 */

session_start();

header('Content-Type: application/json; charset=UTF-8');

// CORS（開発環境用。本番では ALLOWED_ORIGIN 環境変数で制限する）
$allowed_origin = $_ENV['ALLOWED_ORIGIN'] ?? 'https://vite-ts-sass-starter.vercel.app';
$allowed_hosts = array_filter(explode(',', $_ENV['ALLOWED_HOSTS'] ?? 'localhost'));
$origin_host = parse_url($allowed_origin, PHP_URL_HOST) ?? '';
$is_allowed = empty($allowed_hosts) || in_array($origin_host, $allowed_hosts, true);

if ($allowed_origin && $is_allowed) {
  header("Access-Control-Allow-Origin: {$allowed_origin}");
  header('Access-Control-Allow-Credentials: true');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  header('Access-Control-Allow-Methods: GET, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type');
  http_response_code(204);
  exit;
}

if (!isset($_SESSION['csrf_token'])) {
  $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

echo json_encode(['token' => $_SESSION['csrf_token']]);
