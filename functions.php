<?php
/**
 * Vite + WordPress 連携：自動モード判定版
 */

function my_theme_enqueue_vite() {
    // 1. Viteサーバーが起動しているかチェック（5174番ポート）
    $is_dev = false;
    $vite_server = 'http://localhost:5174';

    // 開発用ドメイン（.localなど）の場合のみ、Viteの起動チェックを行う
    if (strpos($_SERVER['HTTP_HOST'], '.local') !== false) {
        $handle = @curl_init($vite_server);
        curl_setopt($handle, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($handle, CURLOPT_NOBODY, TRUE);
        curl_setopt($handle, CURLOPT_TIMEOUT, 1); // 1秒だけ待つ
        $response = curl_exec($handle);
        if ($response !== FALSE) {
            $is_dev = true;
        }
        curl_close($handle);
    }

    if ($is_dev) {
        // 【開発モード】Viteサーバーから直接読み込む
        wp_enqueue_script('vite-client', $vite_server . '/@vite/client', [], null, true);
        wp_enqueue_script('main-js', $vite_server . '/src/ts/components/index.ts', [], null, true);
        wp_enqueue_style('vite-style', $vite_server . '/src/scss/style.scss', [], null);
    } else {
        // 【本番モード】ビルドされた dist フォルダ内のファイルを読み込む
        // ※ npm run build を実行した後に有効になります
        wp_enqueue_style('main-style', get_template_directory_uri() . '/dist/assets/style.css', [], '1.0.0');
        wp_enqueue_script('main-js', get_template_directory_uri() . '/dist/assets/main.js', [], '1.0.0', true);
    }
}
add_action('wp_enqueue_scripts', 'my_theme_enqueue_vite');

// JSに type="module" を付与する（Viteを動かすために必須）
add_filter('script_loader_tag', function($tag, $handle, $src) {
    if (in_array($handle, ['vite-client', 'main-js'])) {
        return '<script type="module" src="' . esc_url($src) . '" id="' . esc_attr($handle) . '-js"></script>';
    }
    return $tag;
}, 10, 3);