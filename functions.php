<?php
/**
 * Viteとの連携設定
 */

function my_theme_enqueue_vite() {
    // 開発環境かどうかを判定（Viteのデバッグ用フラグなど）
    // Local WP環境で npm run dev を動かしている前提
    $is_dev = true; // あとで自動判定に切り替えますが、今は強制的にtrue

    if ($is_dev) {
        // 開発環境：ViteのクライアントとメインJS/CSSを読み込む
        wp_enqueue_script('vite-client', 'http://localhost:5174/@vite/client', [], null, true);
        wp_enqueue_script('main-js', 'http://localhost:5174/src/ts/components/index.ts', [], null, true);
    } else {
        // 本番環境：ビルドされたファイルを読み込む
        wp_enqueue_style('main-style', get_template_directory_uri() . '/dist/assets/style.css', [], '1.0.0');
        wp_enqueue_script('main-js', get_template_directory_uri() . '/dist/assets/main.js', [], '1.0.0', true);
    }
}
add_action('wp_enqueue_scripts', 'my_theme_enqueue_vite');

// 読み込むJSに type="module" を付与する設定
add_filter('script_loader_tag', function($tag, $handle, $src) {
    if (in_array($handle, ['vite-client', 'main-js'])) {
        return '<script type="module" src="' . esc_url($src) . '" id="' . esc_attr($handle) . '-js"></script>';
    }
    return $tag;
}, 10, 3);