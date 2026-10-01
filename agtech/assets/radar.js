(function () {
  var scores = store.get('radar:scores', {});
  var evidence = store.get('radar:evidence', {});

  function save() {
    store.set('radar:scores', scores);
    store.set('radar:updated', new Date().toISOString());
  }

  function renderDims() {
    document.getElementById('dims').innerHTML = DIMS.map(function (d) {
      return '<article data-code="' + d.code + '" style="background: #FFFFFF; border: 1px solid #D5DBD3; border-radius: 18px; padding: 24px; display: flex; flex-direction: column; gap: 14px">' +
        '<div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap">' +
        '<span style="font-family: \'IBM Plex Mono\', monospace; font-weight: 600; font-size: 13px; background: #E3EDE4; color: #1F4D36; padding: 4px 10px; border-radius: 8px">' + d.code + '</span>' +
        '<h2 style="margin: 0; font-family: \'Bricolage Grotesque\', sans-serif; font-weight: 700; font-size: 21px; flex: 1 1 200px">' + esc(d.name) + '</h2>' +
        '<span class="low-badge" hidden style="font-size: 12px; font-weight: 600; background: #FBEBD3; color: #7A4508; padding: 4px 10px; border-radius: 999px">Kandidat prioritas</span>' +
        '</div>' +
        '<p style="margin: 0; color: #3B4A43">' + esc(d.q) + '</p>' +
        '<div role="group" aria-label="Pilih skor ' + d.code + '" style="display: flex; flex-wrap: wrap; gap: 8px">' +
        [1, 2, 3, 4, 5].map(function (n) {
          return '<div style="flex: 1 1 96px; display: flex"><button type="button" class="score-btn" data-n="' + n + '" aria-pressed="false" aria-label="' + d.code + ' skor ' + n + ', ' + LV[n - 1] + '">' +
            '<span class="n">' + n + '</span><span class="l">' + LV[n - 1] + '</span></button></div>';
        }).join('') +
        '</div>' +
        '<div style="background: #F5F6F1; border-radius: 12px; padding: 14px 16px; display: flex; flex-direction: column; gap: 4px">' +
        '<span class="score-text" style="font-size: 12px; font-weight: 600; letter-spacing: 0.05em; color: #4A5A52"></span>' +
        '<span class="desc" style="font-size: 15px"></span>' +
        '</div>' +
        '<label style="display: flex; flex-direction: column; gap: 6px; font-size: 14px; font-weight: 600">Bukti konkret' +
        '<textarea class="evidence" rows="2" placeholder="Mis. hasil wawancara, data pilot, dokumen kesepakatan…" style="font: inherit; font-weight: 400; font-size: 15px; border: 1px solid #C3CCC4; border-radius: 10px; padding: 10px 12px; resize: vertical; background: #FFFFFF; color: #10261E">' + esc(evidence[d.code] || '') + '</textarea>' +
        '</label>' +
        '</article>';
    }).join('');
  }

  function update() {
    DIMS.forEach(function (d) {
      var v = scores[d.code] || 0;
      var card = document.querySelector('article[data-code="' + d.code + '"]');
      card.querySelectorAll('.score-btn').forEach(function (b) {
        b.setAttribute('aria-pressed', String(Number(b.dataset.n) === v));
      });
      card.querySelector('.low-badge').hidden = !(v > 0 && v <= 2);
      card.querySelector('.score-text').textContent = v ? 'SKOR ' + v + ' · ' + LV[v - 1].toUpperCase() : 'BELUM DINILAI';
      card.querySelector('.desc').textContent = v ? d.d[v - 1] : 'Pilih skor 1–5 yang paling akurat menggambarkan kondisi saat ini.';
    });

    var total = 0, count = 0;
    DIMS.forEach(function (d) { if (scores[d.code]) { total += scores[d.code]; count += 1; } });
    var lvl = null;
    if (count === 10) LEVELS.forEach(function (l) { if (total >= l.min && total <= l.max) lvl = l; });

    document.getElementById('total').textContent = total;
    document.getElementById('count-text').textContent = count + ' dari 10 dimensi sudah dinilai';
    document.getElementById('level-name').textContent = lvl ? lvl.name : '—';
    document.getElementById('level-act').textContent = lvl ? lvl.act : 'Lengkapi kesepuluh dimensi untuk melihat level kesiapan komersial.';

    document.getElementById('bars').innerHTML = DIMS.map(function (d) {
      var v = scores[d.code] || 0;
      return '<div style="display: grid; grid-template-columns: 34px minmax(0, 1fr) 16px; gap: 10px; align-items: center; font-family: \'IBM Plex Mono\', monospace; font-size: 12px">' +
        '<span style="color: #C3D4C8">' + d.code + '</span>' +
        '<div style="height: 10px; background: #233D31; border-radius: 5px; overflow: hidden"><div style="height: 10px; border-radius: 5px; background: #6FB386; width: ' + (v * 20) + '%; transition: width .2s"></div></div>' +
        '<span style="color: #F5F6F1; text-align: right">' + (v || '–') + '</span></div>';
    }).join('');

    var prio = DIMS.filter(function (d) { return scores[d.code]; })
      .map(function (d) { return { code: d.code, name: d.name, v: scores[d.code] }; })
      .sort(function (a, b) { return a.v - b.v; })
      .slice(0, 3);
    document.getElementById('no-prio').hidden = prio.length > 0;
    document.getElementById('prio').innerHTML = prio.map(function (p) {
      return '<li style="display: flex; justify-content: space-between; gap: 12px; background: #FBEBD3; color: #4A2A05; border-radius: 10px; padding: 10px 12px; font-size: 14px"><span><strong style="font-weight: 600">' + p.code + '</strong> · ' + esc(p.name) + '</span><span style="font-family: \'IBM Plex Mono\', monospace; font-weight: 600">' + p.v + '</span></li>';
    }).join('');

    document.getElementById('levels').innerHTML = LEVELS.map(function (l) {
      var on = !!lvl && lvl.name === l.name;
      return on
        ? '<div style="display: grid; grid-template-columns: 56px minmax(0, 1fr); gap: 10px; background: #1F4D36; color: #FFFFFF; border-radius: 10px; padding: 10px 12px; font-size: 13px"><span style="font-family: \'IBM Plex Mono\', monospace; font-weight: 600">' + l.min + '–' + l.max + '</span><span><strong style="font-weight: 600">' + l.name + '</strong> — ' + esc(l.act) + '</span></div>'
        : '<div style="display: grid; grid-template-columns: 56px minmax(0, 1fr); gap: 10px; border-radius: 10px; padding: 10px 12px; font-size: 13px; color: #3B4A43"><span style="font-family: \'IBM Plex Mono\', monospace; font-weight: 600">' + l.min + '–' + l.max + '</span><span><strong style="font-weight: 600; color: #10261E">' + l.name + '</strong> — ' + esc(l.act) + '</span></div>';
    }).join('');
  }

  renderDims();
  update();

  var dimsEl = document.getElementById('dims');
  dimsEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.score-btn');
    if (!btn) return;
    scores[btn.closest('article').dataset.code] = Number(btn.dataset.n);
    save();
    update();
  });
  dimsEl.addEventListener('input', function (e) {
    if (!e.target.classList.contains('evidence')) return;
    evidence[e.target.closest('article').dataset.code] = e.target.value;
    store.set('radar:evidence', evidence);
  });

  document.getElementById('reset').addEventListener('click', function () {
    if (!confirm('Kosongkan semua skor Radar?')) return;
    scores = {};
    save();
    update();
  });
})();
