/* Pop-up de aviso ao abrir o painel: "não é uma ferramenta oficial".
   Aparece uma vez por sessão do navegador (volta ao abrir o link de novo depois de fechar o navegador). */
(function () {
  var K = 'rs_aviso_ok';
  try { if (sessionStorage.getItem(K)) return; } catch (e) {}
  var css = [
    '.av-fundo{position:fixed;inset:0;z-index:9999;background:rgba(8,14,20,.72);display:grid;place-items:center;',
    'padding:max(16px,env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) max(16px,env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px));overflow:auto}',
    '.av-caixa{--av:#c2364b;width:min(560px,100%);background:var(--panel,#fff);color:var(--fg,#0b1c2c);border:3px solid var(--av);border-top-width:12px;',
    'border-radius:16px;padding:22px 20px 18px;display:grid;gap:12px;box-shadow:0 20px 60px rgba(0,0,0,.45);font-size:16px;line-height:1.5}',
    '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .av-caixa{--av:#e2566a}}:root[data-theme="dark"] .av-caixa{--av:#e2566a}',
    '.av-tit{margin:0;color:var(--av);font-weight:900;font-size:clamp(22px,6vw,30px);line-height:1.15;letter-spacing:.01em;text-transform:uppercase;text-wrap:balance}',
    '.av-caixa p{margin:0}',
    '.av-tel{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px}',
    '.av-tel div{border:1px solid var(--line,#dfe4ea);border-radius:10px;padding:8px 10px;background:var(--fill,#f4f6f8)}',
    '.av-tel b{display:block;font-size:20px;white-space:nowrap;color:var(--fg,#0b1c2c)}',
    '.av-tel span{font-size:13px;color:var(--muted,#53606c)}',
    '.av-ok{font:inherit;font-weight:800;font-size:17px;border:0;border-radius:12px;padding:14px 16px;background:var(--av);color:#fff;cursor:pointer;min-height:48px}',
    '.av-ok:focus-visible{outline:3px solid var(--fg,#0b1c2c);outline-offset:3px}'
  ].join('');
  function abrir() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var f = document.createElement('div'); f.className = 'av-fundo';
    f.innerHTML = '<div class="av-caixa" role="alertdialog" aria-modal="true" aria-labelledby="av-t" aria-describedby="av-d">' +
      '<p class="av-tit" id="av-t">Atenção: não é uma ferramenta oficial</p>' +
      '<div id="av-d" style="display:grid;gap:10px">' +
      '<p>Este é um painel informativo, feito de forma voluntária. Os estágios (rio normal, subindo, alto e muito alto) são regras tiradas das cheias passadas, com os dados disponíveis: ele cruza o nível dos rios com a chuva que já caiu e com os níveis que a Defesa Civil usa como referência. <strong>Regra pode errar.</strong></p>' +
      '<p><strong>Em caso de risco, siga sempre a Defesa Civil de Sabará.</strong> Se tocar sirene ou a Defesa Civil mandar sair, saia na hora.</p>' +
      '<div class="av-tel"><div><b>199</b><span>Defesa Civil, 24 horas</span></div><div><b>(31) 3672-7722</b><span>Defesa Civil de Sabará</span></div><div><b>193</b><span>Corpo de Bombeiros</span></div><div><b>40199</b><span>SMS com seu CEP para receber alertas oficiais</span></div></div>' +
      '</div><button type="button" class="av-ok">Entendi</button></div>';
    document.body.appendChild(f);
    var prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    var b = f.querySelector('.av-ok'); b.focus();
    function fechar() { try { sessionStorage.setItem(K, '1'); } catch (e) {} document.body.style.overflow = prev; f.remove(); }
    b.addEventListener('click', fechar);
    f.addEventListener('keydown', function (e) { if (e.key === 'Escape') fechar(); if (e.key === 'Tab') { e.preventDefault(); b.focus(); } });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', abrir); else abrir();
})();
