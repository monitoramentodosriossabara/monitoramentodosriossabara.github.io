/* Tabelas responsivas: no celular, cada linha vira um card, com o título de cada
   coluna em negrito e o valor na frente. Tabelas com data-sel="1" ganham uma
   caixa de seleção no celular para mostrar uma linha por vez. */
(function () {
  var MQ = '(max-width: 640px)';
  var css = [
    '@media ' + MQ + '{',
    'table.rt{min-width:0!important;width:100%;border:0;font-size:14px}',
    'table.rt thead{display:none}',
    'table.rt,table.rt tbody,table.rt tr,table.rt td{display:block;width:100%}',
    'table.rt tr{border:1px solid var(--line);border-radius:10px;padding:2px 12px;margin:0 0 10px;background:var(--panel,var(--bg))}',
    'table.rt td{display:grid;grid-template-columns:minmax(0,40%) minmax(0,1fr);column-gap:12px;align-items:start;text-align:left!important;white-space:normal!important;overflow-wrap:anywhere;padding:8px 0;border:0;border-bottom:1px solid var(--grid,var(--line))}',
    'table.rt td:last-child{border-bottom:0}',
    'table.rt td::before{content:attr(data-l);font-weight:700;color:var(--fg);font-family:var(--f-body,inherit);font-size:14px;line-height:1.35;white-space:normal}',
    'table.rt td.n{color:var(--fg)}',
    'table.rt td[data-l=""],table.rt td.rt-t,table.rt tr.rt-grp td{display:block}',
    'table.rt td[data-l=""]::before{content:none}',
    'table.rt td.rt-t{padding:10px 0 8px;font-weight:700;font-size:15.5px;font-family:var(--f-body,inherit);color:var(--fg)}',
    'table.rt td.rt-t:empty{display:none}',
    'table.rt td.rt-t::before{content:none}',
    'table.rt tr.rt-grp{border:0;background:none;padding:0;margin:14px 0 6px}',
    'table.rt tr.rt-grp td{border:0;padding:0;font-weight:700;font-size:15px}',
    'table.rt tr.rt-grp td::before{content:none}',
    'table.rt tr.rt-off{display:none}',
    '.tbl:has(> table.rt),div:has(> table.rt){overflow:visible!important}',
    '.rt-selw{display:grid;gap:4px;margin:0 0 10px}',
    '.rt-selw label{font-weight:700;font-size:14px}',
    '.rt-selw select{font:inherit;font-size:15px;padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:var(--panel,var(--bg));color:var(--fg);max-width:100%}',
    '}',
    '@media not ' + MQ + '{.rt-selw{display:none}table.rt tr.rt-off{display:table-row}}'
  ].join('\n');
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  var mq = window.matchMedia(MQ);

  function cabecalhos(t) {
    var ths = t.querySelectorAll('thead th');
    if (!ths.length) {
      var r0 = t.querySelector('tr');
      if (r0 && r0.querySelector('th') && !r0.querySelector('td')) ths = r0.querySelectorAll('th');
    }
    return Array.prototype.map.call(ths, function (th) { return th.textContent.replace(/\s+/g, ' ').trim(); });
  }

  function linhas(t) {
    return Array.prototype.filter.call(t.querySelectorAll('tr'), function (tr) {
      return tr.querySelector('td') && !tr.closest('thead');
    });
  }

  function preparar(t) {
    var hs = cabecalhos(t);
    if (!hs.length) return;
    t.classList.add('rt');
    linhas(t).forEach(function (tr) {
      var cells = tr.children, i = 0, primeira = true;
      if (cells.length === 1 && (+cells[0].colSpan || 1) > 1) { tr.classList.add('rt-grp'); return; }
      Array.prototype.forEach.call(cells, function (td) {
        var cs = +td.colSpan || 1;
        if (primeira) { td.classList.add('rt-t'); primeira = false; }
        else {
          if (!td.hasAttribute('data-l')) td.setAttribute('data-l', cs > 1 ? '' : (hs[i] || ''));
          if (!(td.childNodes.length === 1 && td.firstChild.nodeType === 1 && td.firstChild.classList.contains('rt-v'))) {
            var sp = document.createElement('span'); sp.className = 'rt-v';
            while (td.firstChild) sp.appendChild(td.firstChild);
            td.appendChild(sp);
          }
        }
        i += cs;
      });
    });
    if (t.dataset.sel === '1') seletor(t, hs);
  }

  function seletor(t, hs) {
    var rows = linhas(t).filter(function (tr) { return !tr.classList.contains('rt-grp'); });
    if (rows.length < 2) return;
    var w = t.previousElementSibling && t.previousElementSibling.classList.contains('rt-selw') ? t.previousElementSibling : null;
    var host = t.parentElement;
    if (!w) {
      w = document.createElement('div'); w.className = 'rt-selw';
      var id = 'rtsel' + Math.random().toString(36).slice(2, 7);
      w.innerHTML = '<label for="' + id + '">Escolha: ' + (hs[0] || '').toLowerCase() + '</label><select id="' + id + '"></select>';
      host.insertBefore(w, t);
    }
    var sel = w.querySelector('select'), atual = +sel.value || 0;
    sel.innerHTML = rows.map(function (tr, k) {
      var tx = tr.children[0].textContent.replace(/\s+/g, ' ').trim();
      if (tx.length > 60) tx = tx.slice(0, 57) + '…';
      return '<option value="' + k + '">' + tx.replace(/</g, '&lt;') + '</option>';
    }).join('');
    if (atual >= rows.length) atual = 0;
    sel.value = String(atual);
    function mostrar() { var v = +sel.value; rows.forEach(function (tr, k) { tr.classList.toggle('rt-off', k !== v); }); }
    sel.onchange = mostrar; mostrar();
  }

  var pend = false;
  function rodar() {
    pend = false;
    document.querySelectorAll('table').forEach(function (t) {
      if (t.dataset.rtSig === String(t.rows.length) + ':' + (t.tBodies[0] ? t.tBodies[0].innerHTML.length : 0)) return;
      preparar(t);
      t.dataset.rtSig = String(t.rows.length) + ':' + (t.tBodies[0] ? t.tBodies[0].innerHTML.length : 0);
    });
  }
  function agendar() { if (!pend) { pend = true; requestAnimationFrame(rodar); } }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', rodar); else rodar();
  new MutationObserver(function (ms) {
    for (var k = 0; k < ms.length; k++) {
      var n = ms[k].target;
      if (n.closest && n.closest('table') || (n.querySelector && n.querySelector('table'))) { agendar(); return; }
    }
  }).observe(document.body, { childList: true, subtree: true });
  if (mq.addEventListener) mq.addEventListener('change', agendar);
})();
