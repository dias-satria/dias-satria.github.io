(function () {
  var CATS = [
    { id: 'manusia', name: 'Manusia', hint: 'Petani, buruh, penyuluh, keterampilan' },
    { id: 'metode', name: 'Metode', hint: 'Praktik budidaya, jadwal, SOP' },
    { id: 'alat', name: 'Alat & Teknologi', hint: 'Mesin, sensor, aplikasi' },
    { id: 'input', name: 'Input', hint: 'Benih, bibit, pakan, pupuk, obat' },
    { id: 'lingkungan', name: 'Lingkungan', hint: 'Cuaca, air, tanah, hama & penyakit' },
    { id: 'pasar', name: 'Pasar & Modal', hint: 'Harga, tengkulak, pembiayaan' }
  ];
  var MIN_WHYS = 5, MAX_WHYS = 7;

  var problem = store.get('rc:problem', '');
  var fish = store.get('rc:fish', {});
  var whys = store.get('rc:whys', null) || [];
  while (whys.length < MIN_WHYS) whys.push({ a: '', ev: false });
  var root = store.get('rc:root', '');
  var tests = store.get('rc:tests', [{ who: '', verdict: '—', note: '' }]);
  CATS.forEach(function (c) { fish[c.id] = fish[c.id] || []; });

  var $ = function (id) { return document.getElementById(id); };
  var problemEl = $('rc-problem'), rootEl = $('rc-root');
  problemEl.value = problem;
  rootEl.value = root;

  function lbl(ev) {
    return '<button type="button" class="lbl" data-act="ev" data-ev="' + ev + '" aria-label="Label: ' + (ev ? 'evidence' : 'assumption') + ', klik untuk mengubah">' + (ev ? 'EVIDENCE' : 'ASSUMPTION') + '</button>';
  }

  // Fishbone
  function renderFish() {
    var head = '<div class="fb-head"><span>MASALAH</span><p id="fb-problem"></p></div>';
    var bones = CATS.map(function (c, i) {
      var items = fish[c.id];
      return '<div class="fb-bone ' + (i < 3 ? 'top' : 'bottom') + '" data-cat="' + c.id + '" style="grid-column: ' + (i % 3 + 1) + '">' +
        '<h4>' + esc(c.name) + '<span>' + items.length + '</span></h4>' +
        '<span class="hint">' + esc(c.hint) + '</span>' +
        '<ul class="cause-list">' + items.map(function (it, j) {
          return '<li class="cause" data-j="' + j + '"><span class="cause-text">' + esc(it.t) + '</span>' + lbl(it.ev) +
            '<button type="button" class="star" data-act="star" aria-pressed="' + it.star + '">★ Prioritas</button>' +
            '<button type="button" class="x" data-act="del" aria-label="Hapus penyebab">×</button></li>';
        }).join('') + '</ul>' +
        '<form class="fb-add"><label class="sr-only" for="add-' + c.id + '">Tambah penyebab ' + esc(c.name) + '</label>' +
        '<input id="add-' + c.id + '" type="text" placeholder="Tambah penyebab…" autocomplete="off"><button type="submit" aria-label="Tambah">+</button></form>' +
        '</div>';
    }).join('');
    $('fishbone').innerHTML = bones + '<div class="fb-spine" aria-hidden="true"></div>' + head;
    updateProblemText();
    updateFishStats();
    renderSeeds();
  }

  function allCauses() {
    return CATS.reduce(function (all, c) { return all.concat(fish[c.id]); }, []);
  }

  function updateFishStats() {
    var all = allCauses();
    $('fb-count').textContent = all.length;
    $('fb-ev').textContent = all.filter(function (x) { return x.ev; }).length;
    $('fb-star').textContent = all.filter(function (x) { return x.star; }).length;
  }

  function updateProblemText() {
    var p = $('fb-problem');
    if (p) p.textContent = problem.trim() || 'Tulis pernyataan masalah di atas.';
  }

  $('fishbone').addEventListener('submit', function (e) {
    e.preventDefault();
    var bone = e.target.closest('[data-cat]');
    var input = e.target.querySelector('input');
    var t = input.value.trim();
    if (!t) return;
    fish[bone.dataset.cat].push({ t: t, ev: false, star: false });
    store.set('rc:fish', fish);
    renderFish();
    $('add-' + bone.dataset.cat).focus();
    refresh();
  });

  $('fishbone').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-act]');
    if (!btn) return;
    var cat = btn.closest('[data-cat]').dataset.cat;
    var j = Number(btn.closest('[data-j]').dataset.j);
    var it = fish[cat][j];
    if (btn.dataset.act === 'ev') it.ev = !it.ev;
    if (btn.dataset.act === 'star') it.star = !it.star;
    if (btn.dataset.act === 'del') fish[cat].splice(j, 1);
    store.set('rc:fish', fish);
    renderFish();
    refresh();
  });

  // 5 Whys
  function whyQuestion(i) {
    var prev = i === 0 ? problem.trim() : whys[i - 1].a.trim();
    if (!prev) return i === 0 ? 'Mengapa masalah ini terjadi?' : 'Mengapa hal di atas terjadi?';
    prev = prev.replace(/[.!?]+$/, '');
    if (/^[A-Z][a-z]/.test(prev)) prev = prev.charAt(0).toLowerCase() + prev.slice(1);
    return 'Mengapa <strong>' + esc(prev) + '</strong>?';
  }

  function renderWhys() {
    $('whys').innerHTML = whys.map(function (w, i) {
      return '<li class="why" data-i="' + i + '"><span class="why-n">MENGAPA ' + (i + 1) + '</span>' +
        '<div class="why-body"><span class="why-q" id="why-q-' + i + '">' + whyQuestion(i) + '</span>' +
        '<label class="sr-only" for="why-' + i + '">Jawaban mengapa ' + (i + 1) + '</label>' +
        '<textarea id="why-' + i + '" class="field" rows="2" placeholder="Karena…" style="resize: vertical">' + esc(w.a) + '</textarea>' +
        '<div class="why-tools">' + lbl(w.ev) +
        (i >= MIN_WHYS ? '<button type="button" class="x" data-act="del" aria-label="Hapus mengapa ' + (i + 1) + '">×</button>' : '') +
        '</div></div></li>';
    }).join('');
    $('add-why').hidden = whys.length >= MAX_WHYS;
  }

  function renderSeeds() {
    var starred = allCauses().filter(function (x) { return x.star; });
    var box = $('why-seed');
    box.hidden = starred.length === 0;
    box.innerHTML = '<span style="font-size: 13px; font-weight: 600; color: #4A5A52">Mulai dari penyebab prioritas:</span>' +
      starred.map(function (x) { return '<button type="button" class="seed" data-seed="' + esc(x.t) + '">★ ' + esc(x.t) + '</button>'; }).join('');
  }

  $('why-seed').addEventListener('click', function (e) {
    var b = e.target.closest('[data-seed]');
    if (!b) return;
    if (whys[0].a.trim() && !confirm('Ganti jawaban “Mengapa 1” dengan penyebab ini?')) return;
    var cause = allCauses().filter(function (x) { return x.t === b.dataset.seed; })[0];
    whys[0] = { a: b.dataset.seed, ev: cause ? cause.ev : false };
    store.set('rc:whys', whys);
    renderWhys();
    $('why-1').focus();
    refresh();
  });

  $('whys').addEventListener('input', function (e) {
    var i = Number(e.target.closest('[data-i]').dataset.i);
    whys[i].a = e.target.value;
    store.set('rc:whys', whys);
    if (i + 1 < whys.length) $('why-q-' + (i + 1)).innerHTML = whyQuestion(i + 1);
    refresh();
  });

  $('whys').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-act]');
    if (!btn) return;
    var i = Number(btn.closest('[data-i]').dataset.i);
    if (btn.dataset.act === 'ev') {
      whys[i].ev = !whys[i].ev;
      btn.dataset.ev = String(whys[i].ev);
      btn.textContent = whys[i].ev ? 'EVIDENCE' : 'ASSUMPTION';
    }
    if (btn.dataset.act === 'del') {
      whys.splice(i, 1);
      renderWhys();
    }
    store.set('rc:whys', whys);
    refresh();
  });

  $('add-why').addEventListener('click', function () {
    whys.push({ a: '', ev: false });
    store.set('rc:whys', whys);
    renderWhys();
    $('why-' + (whys.length - 1)).focus();
  });

  // Tests
  function renderTests() {
    $('tests').innerHTML = tests.map(function (r, i) {
      var opts = ['—', 'Setuju', 'Sebagian', 'Tidak setuju'].map(function (o) {
        return '<option' + (o === r.verdict ? ' selected' : '') + '>' + o + '</option>';
      }).join('');
      return '<div class="table-row" data-i="' + i + '" style="display: grid; grid-template-columns: minmax(0, 1fr) 150px minmax(0, 2fr); border-top: 1px solid #E1E5DE; align-items: start">' +
        '<label style="padding: 10px 20px"><span class="sr-only">Narasumber</span><input class="field" data-f="who" type="text" placeholder="[Inisial, peran]" value="' + esc(r.who) + '"></label>' +
        '<label style="padding: 10px 8px"><span class="sr-only">Reaksi</span><select class="field" data-f="verdict" style="font-size: 14px; padding: 10px 6px">' + opts + '</select></label>' +
        '<div style="padding: 10px 20px; display: flex; flex-direction: column; align-items: flex-start; gap: 2px"><label style="width: 100%"><span class="sr-only">Catatan</span><input class="field" data-f="note" type="text" placeholder="Kutipan asli atau koreksi dari narasumber" value="' + esc(r.note) + '"></label>' +
        (tests.length > 1 ? '<button type="button" class="row-remove" data-remove>Hapus</button>' : '') + '</div></div>';
    }).join('');
  }

  function onTestEdit(e) {
    var f = e.target.dataset.f;
    if (!f) return;
    tests[Number(e.target.closest('[data-i]').dataset.i)][f] = e.target.value;
    store.set('rc:tests', tests);
    refresh();
  }
  $('tests').addEventListener('input', onTestEdit);
  $('tests').addEventListener('change', onTestEdit);
  $('tests').addEventListener('click', function (e) {
    if (!e.target.hasAttribute('data-remove')) return;
    tests.splice(Number(e.target.closest('[data-i]').dataset.i), 1);
    store.set('rc:tests', tests);
    renderTests();
    refresh();
  });
  $('add-test').addEventListener('click', function () {
    tests.push({ who: '', verdict: '—', note: '' });
    store.set('rc:tests', tests);
    renderTests();
    var rows = $('tests').querySelectorAll('[data-i]');
    rows[rows.length - 1].querySelector('input').focus();
  });

  // Problem & root
  problemEl.addEventListener('input', function () {
    problem = problemEl.value;
    store.set('rc:problem', problem);
    updateProblemText();
    $('why-q-0').innerHTML = whyQuestion(0);
    refresh();
  });
  rootEl.addEventListener('input', function () {
    root = rootEl.value;
    store.set('rc:root', root);
    refresh();
  });

  function words(s) { return s.trim() ? s.trim().split(/\s+/).length : 0; }
  function sentences(s) { return s.trim() ? s.trim().split(/[.!?]+(?:\s+|$)/).filter(Boolean).length : 0; }

  function refresh() {
    var w = words(root), sCount = sentences(root);
    var hint = $('root-hint');
    if (!w) hint.textContent = 'Ideal: satu kalimat, tidak lebih dari 25 kata, tanpa menyebut produk Anda.';
    else if (sCount > 1) hint.textContent = w + ' kata · ' + sCount + ' kalimat — padatkan menjadi satu kalimat.';
    else if (w > 25) hint.textContent = w + ' kata — coba padatkan hingga ≤ 25 kata.';
    else hint.textContent = w + ' kata · satu kalimat ✓';

    var filled = whys.filter(function (x) { return x.a.trim(); });
    var evCount = filled.filter(function (x) { return x.ev; }).length;
    var tested = tests.filter(function (t) { return t.who.trim() && t.verdict !== '—'; });
    var supportive = tested.filter(function (t) { return t.verdict === 'Setuju' || t.verdict === 'Sebagian'; });
    var agree = tested.filter(function (t) { return t.verdict === 'Setuju'; }).length;
    $('test-count').textContent = tested.length;
    $('test-agree').textContent = agree;

    var checks = [
      [problem.trim().length > 0, 'Pernyataan masalah tertulis sebagai fakta'],
      [allCauses().some(function (x) { return x.star; }), 'Fishbone terisi dan ada penyebab prioritas (★)'],
      [filled.length >= 3, 'Rantai “mengapa” terisi minimal 3 tingkat (' + filled.length + ' terisi)'],
      [filled.length > 0 && evCount * 2 >= filled.length, 'Mayoritas jawaban “mengapa” berlabel EVIDENCE (' + evCount + '/' + filled.length + ')'],
      [w > 0 && w <= 25 && sCount === 1, 'Akar penyebab ditulis dalam satu kalimat'],
      [tested.length >= 2 && supportive.length * 2 > tested.length, 'Diuji ke ≥ 2 narasumber baru dan mayoritas mengonfirmasi']
    ];
    $('readiness').innerHTML = checks.map(function (c) {
      return '<li class="check' + (c[0] ? ' ok' : '') + '"><b aria-hidden="true">' + (c[0] ? '✓' : '○') + '</b><span>' + esc(c[1]) + '<span class="sr-only">' + (c[0] ? ' — terpenuhi' : ' — belum') + '</span></span></li>';
    }).join('');

    var done = checks.filter(function (c) { return c[0]; }).length;
    store.set('rc:progress', { done: done, total: checks.length });
  }

  renderFish();
  renderWhys();
  renderTests();
  refresh();
})();
