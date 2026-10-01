(function () {
  var SIGNALS = ['Waktu', 'Uang', 'Pengenalan'];
  var questions = store.get('mt:questions', [{ q: '', v: '—', fix: '' }]);
  var logs = store.get('mt:logs', [{ who: '', fact: '', signals: [] }]);

  function removeBtn(label) {
    return '<button type="button" class="row-remove" data-remove aria-label="' + label + '">Hapus</button>';
  }

  function renderQuestions() {
    document.getElementById('q-rows').innerHTML = questions.map(function (r, i) {
      var opts = ['—', 'Ya', 'Tidak'].map(function (o) {
        return '<option' + (o === r.v ? ' selected' : '') + '>' + o + '</option>';
      }).join('');
      return '<div class="table-row" data-i="' + i + '" style="display: grid; grid-template-columns: minmax(0, 2fr) 110px minmax(0, 2fr); border-top: 1px solid #E1E5DE; align-items: center">' +
        '<label style="padding: 10px 20px"><span class="sr-only">Pertanyaan ' + (i + 1) + '</span><input class="field" data-f="q" type="text" placeholder="Tulis pertanyaan…" value="' + esc(r.q) + '"></label>' +
        '<label style="padding: 10px 8px"><span class="sr-only">Melanggar aturan?</span><select class="field" data-f="v" style="font-size: 14px; padding: 10px 6px">' + opts + '</select></label>' +
        '<div style="padding: 10px 20px; display: flex; flex-direction: column; align-items: flex-start; gap: 2px"><label style="width: 100%"><span class="sr-only">Versi perbaikan</span><input class="field" data-f="fix" type="text" placeholder="Versi perbaikan…" value="' + esc(r.fix) + '"></label>' +
        (questions.length > 1 ? removeBtn('Hapus pertanyaan ' + (i + 1)) : '') + '</div>' +
        '</div>';
    }).join('');
  }

  function renderLogs() {
    document.getElementById('log-rows').innerHTML = logs.map(function (r, i) {
      var chips = SIGNALS.map(function (s) {
        return '<button type="button" class="chip" data-signal="' + s + '" aria-pressed="' + (r.signals.indexOf(s) >= 0) + '">' + s + '</button>';
      }).join('');
      return '<div class="table-row" data-i="' + i + '" style="display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2fr) minmax(0, 1.4fr); border-top: 1px solid #E1E5DE; align-items: start">' +
        '<label style="padding: 12px 20px"><span class="sr-only">Narasumber</span><input class="field" data-f="who" type="text" placeholder="[Inisial, peran]" value="' + esc(r.who) + '"></label>' +
        '<label style="padding: 12px 20px"><span class="sr-only">Fakta konkret</span><textarea class="field" data-f="fact" rows="2" placeholder="[Kejadian spesifik + kutipan asli]" style="resize: vertical">' + esc(r.fact) + '</textarea></label>' +
        '<div style="padding: 12px 20px; display: flex; flex-direction: column; align-items: flex-start; gap: 8px"><div role="group" aria-label="Sinyal komitmen" style="display: flex; gap: 6px; flex-wrap: wrap; min-height: 44px; align-items: center">' + chips + '</div>' +
        (logs.length > 1 ? removeBtn('Hapus log ' + (i + 1)) : '') + '</div>' +
        '</div>';
    }).join('');
    updateCount();
  }

  function updateCount() {
    var filled = logs.filter(function (r) { return r.who.trim() || r.fact.trim(); }).length;
    document.getElementById('log-count').textContent = filled;
    document.getElementById('log-bar').style.width = Math.min(filled / 8, 1) * 100 + '%';
    store.set('mt:logCount', filled);
  }

  function wire(containerId, list, key, render, blank) {
    var el = document.getElementById(containerId);
    function rowIndex(t) { return Number(t.closest('[data-i]').dataset.i); }
    function onEdit(e) {
      var f = e.target.dataset.f;
      if (!f) return;
      list()[rowIndex(e.target)][f] = e.target.value;
      store.set(key, list());
      if (key === 'mt:logs') updateCount();
    }
    el.addEventListener('input', onEdit);
    el.addEventListener('change', onEdit);
    el.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-remove')) {
        list().splice(rowIndex(e.target), 1);
        store.set(key, list());
        render();
      }
      var chip = e.target.closest('[data-signal]');
      if (chip) {
        var sig = list()[rowIndex(chip)].signals;
        var at = sig.indexOf(chip.dataset.signal);
        if (at >= 0) sig.splice(at, 1); else sig.push(chip.dataset.signal);
        chip.setAttribute('aria-pressed', String(at < 0));
        store.set(key, list());
      }
    });
    return function add() {
      list().push(blank());
      store.set(key, list());
      render();
      var rows = el.querySelectorAll('[data-i]');
      rows[rows.length - 1].querySelector('input').focus();
    };
  }

  var addQ = wire('q-rows', function () { return questions; }, 'mt:questions', renderQuestions, function () { return { q: '', v: '—', fix: '' }; });
  var addLog = wire('log-rows', function () { return logs; }, 'mt:logs', renderLogs, function () { return { who: '', fact: '', signals: [] }; });
  document.getElementById('add-q').addEventListener('click', addQ);
  document.getElementById('add-log').addEventListener('click', addLog);

  renderQuestions();
  renderLogs();
})();
