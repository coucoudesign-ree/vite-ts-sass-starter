<?php
/*
Template Name: Design Check
*/
get_header(); 
?>

<header class="l-section">
  <div class="l-container">
    <h1 id="demoH1">Design Check</h1>
    <p>このページは WordPress 上で Vite ビルド（Sass/TS）の挙動を確認するためのページです。</p>
    
    <div class="c-panel" id="meter">
      <div class="c-panel__row">
        <div class="c-panel__pill">viewport width: <strong id="vw">-</strong></div>
        <div class="c-panel__pill">h1 font-size (computed): <strong id="h1fs">-</strong></div>
        <div class="c-panel__pill">section padding-block: <strong id="sectionPb">-</strong></div>
        <div class="c-panel__pill">grid gap: <strong id="gridGap">-</strong></div>
      </div>
      <div class="c-panel__row" style="margin-top:8px;">
        <div class="c-panel__pill" style="flex:1;">h1 clamp式: <code id="h1Rule">-</code></div>
      </div>
      <div class="c-panel__row" style="margin-top:8px;">
        <div class="c-panel__pill" style="flex:1;">h1 clamp 再計算(px): <strong id="h1Eval">-</strong> <span id="h1Zone" style="opacity:.7;margin-left:8px;"></span></div>
      </div>
    </div>
  </div>
</header>

<main class="l-section">
  <div class="l-container">
    <h2>カードグリッド（fluid ガター）</h2>
    <div class="u-card-grid" id="grid">
      <article class="c-card"><h3>Card 1</h3><p>内容A</p></article>
      <article class="c-card"><h3>Card 2</h3><p>内容B</p></article>
      <article class="c-card"><h3>Card 3</h3><p>内容C</p></article>
      <article class="c-card"><h3>Card 4</h3><p>内容D</p></article>
      <article class="c-card"><h3>Card 5</h3><p>内容E</p></article>
      <article class="c-card"><h3>Card 6</h3><p>内容F</p></article>
    </div>
    
    <h2>余白とレイアウトのfluidデモ</h2>
    <div class="l-section">
      <div class="l-container u-card-grid">
        <div class="c-demo-box">このセクションの上下paddingは<br><code>space-fluid(sm, xl)</code></div>
        <div class="c-demo-box">グリッドgapは<br><code>fluid-size(12, 32)</code></div>
        <div class="c-demo-box">h1は<br><code>fluid-clamp(20, 90)</code> などでテスト可</div>
      </div>
    </div>
    
    <h2>トークン値（CSS変数から取得）</h2>
    <div class="c-panel">
      <table id="tokenTable">
        <thead>
          <tr><th>カテゴリ</th><th>キー</th><th>値</th><th>CSS Var</th></tr>
        </thead>
        <tbody></tbody>
      </table>
      <p>※ 値は <code>base/_root-vars.scss</code> が出力した CSS変数から取得しています。</p>
    </div>
  </div>
</main>

<div class="l-bpbar" id="bpBar">
  <span class="l-bpbar__item" data-min="0" data-max="575">xs</span>
  <span class="l-bpbar__item" data-min="576" data-max="767">sm</span>
  <span class="l-bpbar__item" data-min="768" data-max="1023">md</span>
  <span class="l-bpbar__item" data-min="1024" data-max="1279">lg</span>
  <span class="l-bpbar__item" data-min="1280" data-max="1535">xl</span>
  <span class="l-bpbar__item" data-min="1536" data-max="9999">2xl</span>
</div>

<script>
  /**
   * Design Check 専用ロジック
   * WordPress テンプレートとして統合するため、インラインスクリプトとして維持します。
   */
  const qs = (s)=>document.querySelector(s);
  
  function cssVar(name){
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function renderExtraFluidDebug(){
    const table = document.querySelector("#tokenTable tbody");
    const vars = ["--demo-h1-clamp","--demo-h2-clamp","--demo-p-clamp","--demo-section-padding","--demo-card-gap","--demo-container-width"];
    vars.forEach(name => {
      const val = cssVar(name);
      if (val) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>fluid-debug</td><td>${name.replace("--demo-", "")}</td><td>${val}</td><td><code>${name}</code></td>`;
        table.appendChild(tr);
      }
    });
  }

  function parseClamp(clampText, baseFont=16){
    if(!clampText) return null;
    const cleaned = clampText.replace(/\s+/g,'');
    const m = cleaned.match(/^clamp\(([^,]+),([^,]+),(.+)\)$/i);
    if(!m) return null;
    const [_, minStr, prefStr, maxStr] = m;
    const toPx = (str)=>{
      if(str.endsWith('px')) return parseFloat(str);
      if(str.endsWith('rem')) return parseFloat(str)*baseFont;
      return parseFloat(str);
    };
    const minPx = toPx(minStr);
    const maxPx = toPx(maxStr);
    const vwMatch = prefStr.match(/\(100vw-(\d+(?:\.\d+)?)px\)\/\((\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)\)/i);
    const minVW = vwMatch ? parseFloat(vwMatch[1]) : 375;
    const maxVW = vwMatch ? parseFloat(vwMatch[2]) : 1440;
    return { minPx, maxPx, minVW, maxVW, preferred: prefStr };
  }

  function evalClampPx(model, vw){
    const {minPx, maxPx, minVW, maxVW} = model;
    if(vw <= minVW) return { px:minPx, zone:'min' };
    if(vw >= maxVW) return { px:maxPx, zone:'max' };
    const ratio = (vw - minVW) / (maxVW - minVW);
    const px = minPx + (maxPx - minPx) * ratio;
    return { px, zone:'between' };
  }

  function refreshMeter(){
    const h1 = qs('#demoH1');
    const grid = qs('#grid');
    const sec = qs('header.l-section');
    
    if(!h1 || !grid || !sec) return;

    qs('#vw').textContent = `${Math.round(window.innerWidth)}px`;
    qs('#h1fs').textContent = getComputedStyle(h1).fontSize;
    qs('#sectionPb').textContent = getComputedStyle(sec).paddingBlockStart;
    qs('#gridGap').textContent = getComputedStyle(grid).gap;
    
    const txt = cssVar('--demo-h1-clamp');
    qs('#h1Rule').textContent = txt || '-';
    
    if(txt){
      const model = parseClamp(txt, 16);
      if(model){
        const { px, zone } = evalClampPx(model, window.innerWidth);
        qs('#h1Eval').textContent = `${px.toFixed(2)}px`;
        qs('#h1Zone').textContent = `zone: ${zone}`;
      }
    }
  }

  function renderTokens(){
    const tbody = qs('#tokenTable tbody'); if(!tbody) return;
    tbody.innerHTML = '';
    ['xs','sm','base','md','lg','xl','2xl','3xl','4xl'].forEach(k=> addRow('font', k, cssVar(`--font-${k}`), `--font-${k}`));
    ['xs','sm','md','lg','xl','2xl'].forEach(k=> addRow('space', k, cssVar(`--space-${k}`), `--space-${k}`));
  }

  function addRow(cat, key, value, varName){
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${cat}</td><td>${key}</td><td>${value||'-'}</td><td><code>${varName}</code></td>`;
    qs('#tokenTable tbody').appendChild(tr);
  }

  window.addEventListener('resize', ()=>{ refreshMeter(); });
  window.addEventListener('load', ()=>{ refreshMeter(); renderTokens(); renderExtraFluidDebug(); });
</script>

<?php get_footer(); ?>