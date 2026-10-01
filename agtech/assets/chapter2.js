(function () {
  var $ = function (id) { return document.getElementById(id); };
  var uid = function () { return Math.random().toString(36).slice(2, 9); };
  var num = function (v) { var n = parseFloat(String(v || '').replace(',', '.')); return isNaN(n) ? null : n; };
  var filled = function (v) { return String(v || '').trim().length > 0; };
  var or = function (v, ph) {
    if (!filled(v)) return ph;
    var s = String(v).trim().replace(/[.!?]+$/, '');
    return /^[A-Z][a-z]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s;
  };

  var TEMPLATES = {
    'jobs': function () { return { sit: '', mot: '', out: '', type: 'Fungsional', hire: '', ev: false, star: false }; },
    'proto': function () { return { asm: '', fid: 'Rendah', n: '', res: 'Belum diuji', learn: '' }; },
    'feats': function () { return { t: '', m: 'Wajib' }; },
    'exps': function () { return { ch: '', type: 'Waitlist', target: num(S.mvp.threshold) === null ? '' : String(num(S.mvp.threshold)), reach: '', act: '' }; },
    'vpc.jobs': function () { return { id: uid(), t: '', star: false }; },
    'vpc.pains': function () { return { id: uid(), t: '', star: false }; },
    'vpc.gains': function () { return { id: uid(), t: '', star: false }; },
    'vpc.products': function () { return { id: uid(), t: '' }; },
    'vpc.relievers': function () { return { id: uid(), t: '', to: '' }; },
    'vpc.creators': function () { return { id: uid(), t: '', to: '' }; }
  };

  var S = store.get('c2', null) || {};
  var defaults = {
    uvp: {}, jobs: [TEMPLATES.jobs()], doi: { target: '', who: '', where: '', attrs: {} },
    proto: [TEMPLATES.proto()], mvp: { type: '' }, feats: [TEMPLATES.feats()], exps: null, canvas: {},
    vpc: { jobs: [], pains: [], gains: [], products: [], relievers: [], creators: [] }
  };
  Object.keys(defaults).forEach(function (k) { if (S[k] === undefined) S[k] = defaults[k]; });
  ['jobs', 'pains', 'gains', 'products', 'relievers', 'creators'].forEach(function (k) { S.vpc[k] = S.vpc[k] || []; });
  S.doi.attrs = S.doi.attrs || {};
  if (!S.exps) S.exps = [TEMPLATES.exps()];

  function save() { store.set('c2', S); }
  function get(path) {
    return path.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, S);
  }
  function set(path, v) {
    var ks = path.split('.'), o = S;
    for (var i = 0; i < ks.length - 1; i++) { if (o[ks[i]] == null) o[ks[i]] = {}; o = o[ks[i]]; }
    o[ks[ks.length - 1]] = v;
  }

  // Field builders
  function inp(path, ph, extra) {
    return '<input class="field" data-bind="' + path + '" value="' + esc(get(path) || '') + '" placeholder="' + esc(ph || '') + '"' + (extra || '') + '>';
  }
  function area(path, ph, rows) {
    return '<textarea class="field" rows="' + (rows || 2) + '" data-bind="' + path + '" placeholder="' + esc(ph || '') + '" style="resize: vertical">' + esc(get(path) || '') + '</textarea>';
  }
  function sel(path, opts, label) {
    var v = get(path);
    return '<select class="k-select" data-bind="' + path + '" aria-label="' + esc(label) + '">' + opts.map(function (o) {
      var val = typeof o === 'string' ? o : o[0], text = typeof o === 'string' ? o : o[1];
      return '<option value="' + esc(val) + '"' + (val === v ? ' selected' : '') + '>' + esc(text) + '</option>';
    }).join('') + '</select>';
  }
  function lbl(path) {
    var ev = !!get(path);
    return '<button type="button" class="lbl" data-toggle="' + path + '" data-ev="' + ev + '" aria-label="Label ' + (ev ? 'evidence' : 'assumption') + ', klik untuk mengubah">' + (ev ? 'EVIDENCE' : 'ASSUMPTION') + '</button>';
  }
  function star(path, text) {
    return '<button type="button" class="star" data-toggle="' + path + '" aria-pressed="' + !!get(path) + '">★ ' + (text || 'Prioritas') + '</button>';
  }
  function del(path, label) {
    return '<button type="button" class="x" data-del="' + path + '" aria-label="' + esc(label) + '">×</button>';
  }

  // B · Jobs
  function jobSentence(j) {
    return 'Ketika ' + or(j.sit, '[situasi]') + ', saya ingin ' + or(j.mot, '[motivasi]') + ', sehingga ' + or(j.out, '[hasil yang diharapkan]') + '.';
  }
  function renderJobs() {
    $('jobs').innerHTML = S.jobs.length ? S.jobs.map(function (j, i) {
      var p = 'jobs.' + i;
      return '<div class="k-row">' +
        '<div class="k-form">' +
        '<label class="k-f">Ketika…' + inp(p + '.sit', 'situasi spesifik') + '</label>' +
        '<label class="k-f">Saya ingin…' + inp(p + '.mot', 'motivasi / kemajuan') + '</label>' +
        '<label class="k-f">Sehingga…' + inp(p + '.out', 'hasil yang diharapkan') + '</label>' +
        '<label class="k-f">Solusi yang “disewa” sekarang' + inp(p + '.hire', 'Mis. tanya tetangga, tebak-tebakan') + '</label>' +
        '</div>' +
        '<div class="k-preview" id="job-prev-' + i + '"></div>' +
        '<div class="k-row-tools">' + sel(p + '.type', ['Fungsional', 'Emosional', 'Sosial'], 'Dimensi job') + lbl(p + '.ev') + star(p + '.star', 'Job utama') +
        (S.jobs.length > 1 ? del('jobs.' + i, 'Hapus job story ' + (i + 1)) : '') + '</div>' +
        '</div>';
    }).join('') : '<p class="k-empty">Belum ada job story.</p>';
  }

  // C · VPC
  var VPC_CUST = [['jobs', 'Customer Jobs', 'Pekerjaan yang ingin diselesaikan'], ['pains', 'Pains', 'Hambatan, risiko, kerugian'], ['gains', 'Gains', 'Hasil dan manfaat yang diharapkan']];
  function vpcItems(key, withStar, linkTo) {
    var list = S.vpc[key];
    return list.map(function (it, i) {
      var p = 'vpc.' + key + '.' + i;
      var link = '';
      if (linkTo) {
        var targets = S.vpc[linkTo].filter(function (x) { return filled(x.t); });
        link = sel(p + '.to', [['', linkTo === 'pains' ? '— mengatasi pain apa? —' : '— menciptakan gain apa? —']].concat(targets.map(function (x) { return [x.id, (x.star ? '★ ' : '') + x.t]; })), 'Terhubung ke');
        link = link.replace('class="k-select"', 'class="k-select" style="flex: 1 1 100%; font-size: 13px; min-height: 36px"');
      }
      return '<div class="k-item"><input data-bind="' + p + '.t" value="' + esc(it.t) + '" placeholder="Tulis…" aria-label="' + esc(key) + ' ' + (i + 1) + '">' +
        (withStar ? star(p + '.star', '') : '') + del(p, 'Hapus') + link + '</div>';
    }).join('');
  }
  function vpcBox(key, title, hint, withStar, linkTo) {
    return '<div class="k-box"><h5>' + esc(title.toUpperCase()) + '<span>' + S.vpc[key].filter(function (x) { return filled(x.t); }).length + '</span></h5>' +
      '<small style="font-size: 12px; color: #4A5A52">' + esc(hint) + '</small>' + vpcItems(key, withStar, linkTo) +
      '<button type="button" class="k-add" data-add="vpc.' + key + '" style="min-height: 36px; font-size: 13px; text-align: left">+ Tambah</button></div>';
  }
  function renderVpcCust() {
    $('vpc-cust').innerHTML = VPC_CUST.map(function (c) { return vpcBox(c[0], c[1], c[2], true); }).join('');
  }
  function renderVpcVal() {
    $('vpc-val').innerHTML = vpcBox('products', 'Products & Services', 'Apa yang Anda tawarkan', false) +
      vpcBox('relievers', 'Pain Relievers', 'Bagaimana solusi mengurangi pain', false, 'pains') +
      vpcBox('creators', 'Gain Creators', 'Bagaimana solusi menciptakan gain', false, 'gains');
  }

  // D · DoI
  var GROUPS = [
    { id: 'inn', name: 'Innovators', pct: '2,5%', desc: 'Pencoba pertama, toleran risiko', z: [-3, -2] },
    { id: 'early', name: 'Early Adopters', pct: '13,5%', desc: 'Pemimpin opini, dipercaya tetangga', z: [-2, -1] },
    { id: 'em', name: 'Early Majority', pct: '34%', desc: 'Menunggu bukti dari tetangga', z: [-1, 0] },
    { id: 'lm', name: 'Late Majority', pct: '34%', desc: 'Ikut setelah jadi kebiasaan umum', z: [0, 1] },
    { id: 'lag', name: 'Laggards', pct: '16%', desc: 'Bertahan dengan cara lama', z: [1, 3] }
  ];
  var ATTRS = [
    { id: 'adv', name: 'Keunggulan relatif', q: 'Seberapa jelas solusi lebih menguntungkan dibanding cara sekarang?' },
    { id: 'compat', name: 'Kesesuaian', q: 'Seberapa cocok dengan kebiasaan, nilai, dan alat yang sudah dipakai?' },
    { id: 'simple', name: 'Kemudahan', q: 'Seberapa mudah dipahami tanpa pelatihan panjang? (kebalikan dari kerumitan)' },
    { id: 'trial', name: 'Bisa dicoba', q: 'Seberapa mudah dicoba dalam skala kecil sebelum berkomitmen penuh?' },
    { id: 'observe', name: 'Hasil terlihat', q: 'Seberapa mudah hasilnya dilihat petani lain?' }
  ];
  function renderDoi() {
    var W = 600, H = 200, base = 186;
    var X = function (z) { return ((z + 3) / 6) * W; };
    var Y = function (z) { return base - Math.exp(-z * z / 2) * 166; };
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '">' + GROUPS.map(function (g, i) {
      var on = S.doi.target === g.id, d = 'M' + X(g.z[0]).toFixed(1) + ',' + base;
      for (var z = g.z[0]; z <= g.z[1] + 1e-9; z += 0.05) d += ' L' + X(z).toFixed(1) + ',' + Y(z).toFixed(1);
      d += ' L' + X(g.z[1]).toFixed(1) + ',' + base + ' Z';
      var cx = X((g.z[0] + g.z[1]) / 2);
      return '<path d="' + d + '" data-set="doi.target" data-val="' + g.id + '" fill="' + (on ? '#1F4D36' : (i % 2 ? '#D7E4DA' : '#C3D4C8')) + '" stroke="#FFFFFF" stroke-width="2"></path>' +
        '<text x="' + cx.toFixed(1) + '" y="' + (base - 10) + '" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="' + (i === 0 ? 11 : 13) + '" font-weight="600" fill="' + (on ? '#FFFFFF' : '#10261E') + '" pointer-events="none">' + g.pct + '</text>';
    }).join('') + '<line x1="0" y1="' + base + '" x2="' + W + '" y2="' + base + '" stroke="#10261E" stroke-width="1.5"></line></svg>';
    $('doi-curve').innerHTML = svg;
    $('doi-opts').innerHTML = GROUPS.map(function (g) {
      return '<button type="button" class="k-opt" data-set="doi.target" data-val="' + g.id + '" aria-pressed="' + (S.doi.target === g.id) + '"><strong>' + g.name + '</strong><span>' + g.pct + ' · ' + g.desc + '</span></button>';
    }).join('');
    $('doi-attrs').innerHTML = ATTRS.map(function (a) {
      var v = S.doi.attrs[a.id] || 0;
      return '<div class="k-attr"><div><strong>' + a.name + '</strong><p>' + a.q + '</p></div><div class="k-seg" role="group" aria-label="Skor ' + a.name + '">' +
        [1, 2, 3, 4, 5].map(function (n) {
          return '<button type="button" data-set="doi.attrs.' + a.id + '" data-val="' + n + '" data-num="1" aria-pressed="' + (v === n) + '" aria-label="' + a.name + ' skor ' + n + '">' + n + '</button>';
        }).join('') + '</div></div>';
    }).join('');
  }

  // E · Prototype
  function renderProto() {
    $('proto').innerHTML = S.proto.map(function (r, i) {
      var p = 'proto.' + i;
      return '<div class="k-row"><div class="k-form">' +
        '<label class="k-f wide">Asumsi yang diuji' + inp(p + '.asm', 'Mis. petambak mau membaca peringatan di WhatsApp pukul 02.00') + '</label>' +
        '<label class="k-f">Fidelity' + sel(p + '.fid', [['Rendah', 'Rendah — sketsa / kertas / peran'], ['Menengah', 'Menengah — mockup klik / video'], ['Tinggi', 'Tinggi — fungsional terbatas']], 'Fidelity') + '</label>' +
        '<label class="k-f">Jumlah penguji' + inp(p + '.n', 'Mis. 5', ' inputmode="numeric"') + '</label>' +
        '<label class="k-f">Hasil' + sel(p + '.res', ['Belum diuji', 'Terbukti', 'Terbantah', 'Belum jelas'], 'Hasil') + '</label>' +
        '<label class="k-f wide">Pembelajaran' + area(p + '.learn', 'Apa yang dilakukan penguji — bukan apa yang mereka katakan') + '</label>' +
        '</div>' + (S.proto.length > 1 ? '<div class="k-row-tools"><button type="button" class="row-remove" data-del="' + p + '">Hapus uji ini</button></div>' : '') + '</div>';
    }).join('');
  }

  // F · MVP
  var TYPES = [
    { id: 'concierge', name: 'Concierge', desc: 'Layanan dikerjakan manual, langsung bersama pengguna' },
    { id: 'woz', name: 'Wizard of Oz', desc: 'Tampak otomatis, di belakang dikerjakan manusia' },
    { id: 'landing', name: 'Landing page', desc: 'Halaman penawaran + tombol daftar atau pesan' },
    { id: 'piecemeal', name: 'Piecemeal', desc: 'Rangkai WhatsApp, Google Form, spreadsheet' },
    { id: 'single', name: 'Single-feature', desc: 'Satu fitur inti saja, sisanya belum ada' }
  ];
  function renderMvpTypes() {
    $('mvp-types').innerHTML = TYPES.map(function (t) {
      return '<button type="button" class="k-opt" data-set="mvp.type" data-val="' + t.id + '" aria-pressed="' + (S.mvp.type === t.id) + '"><strong>' + t.name + '</strong><span>' + t.desc + '</span></button>';
    }).join('');
  }
  var MOSCOW = ['Wajib', 'Sebaiknya', 'Bisa nanti', 'Tidak sekarang'];
  function renderFeats() {
    $('feats').innerHTML = S.feats.map(function (f, i) {
      var p = 'feats.' + i;
      return '<div class="k-row" style="grid-template-columns: minmax(0, 1fr) auto auto; align-items: center">' +
        '<label><span class="sr-only">Fitur ' + (i + 1) + '</span>' + inp(p + '.t', 'Nama fitur') + '</label>' +
        sel(p + '.m', MOSCOW, 'Prioritas fitur') + (S.feats.length > 1 ? del(p, 'Hapus fitur') : '<span></span>') + '</div>';
    }).join('');
  }

  // G · Experiments
  function renderExps() {
    $('exps').innerHTML = S.exps.map(function (r, i) {
      var p = 'exps.' + i;
      return '<div class="k-row"><div class="k-form" style="grid-template-columns: repeat(auto-fit, minmax(min(100%, 150px), 1fr))">' +
        '<label class="k-f">Kanal' + inp(p + '.ch', 'Mis. grup WA kelompok tani') + '</label>' +
        '<label class="k-f">Jenis' + sel(p + '.type', ['Sign-up', 'Waitlist', 'Pre-order'], 'Jenis komitmen') + '</label>' +
        '<label class="k-f">Target konversi (%)' + inp(p + '.target', 'Mis. 15', ' inputmode="decimal"') + '</label>' +
        '<label class="k-f">Jangkauan / pengunjung' + inp(p + '.reach', 'Mis. 120', ' inputmode="numeric"') + '</label>' +
        '<label class="k-f">Yang berkomitmen' + inp(p + '.act', 'Mis. 18', ' inputmode="numeric"') + '</label>' +
        '</div><div class="k-row-tools"><span class="k-flag" id="exp-res-' + i + '"></span>' +
        (S.exps.length > 1 ? '<button type="button" class="row-remove" data-del="' + p + '">Hapus</button>' : '') + '</div></div>';
    }).join('');
  }

  // H · Canvas
  var CELLS = [
    { id: 'problem', name: 'Problem', hint: 'Top 3 masalah', cls: 'c-problem', extra: ['alt', 'Existing alternatives'] },
    { id: 'solution', name: 'Solution', hint: 'Top 3 fitur', cls: 'c-solution' },
    { id: 'metrics', name: 'Key Metrics', hint: 'Angka kunci yang diukur', cls: 'c-metrics' },
    { id: 'uvp', name: 'Unique Value Proposition', hint: 'Satu kalimat yang jelas', cls: 'c-uvp uvp', extra: ['concept', 'High-level concept'] },
    { id: 'unfair', name: 'Unfair Advantage', hint: 'Tidak mudah ditiru atau dibeli', cls: 'c-unfair' },
    { id: 'channels', name: 'Channels', hint: 'Jalur menuju pelanggan', cls: 'c-channels' },
    { id: 'segments', name: 'Customer Segments', hint: 'Target pelanggan', cls: 'c-segments', extra: ['early', 'Early adopters'] },
    { id: 'cost', name: 'Cost Structure', hint: 'Biaya utama', cls: 'c-cost' },
    { id: 'revenue', name: 'Revenue Streams', hint: 'Sumber pendapatan & siapa yang membayar', cls: 'c-revenue' }
  ];
  function renderCanvas() {
    $('canvas').innerHTML = CELLS.map(function (c) {
      var p = 'canvas.' + c.id;
      return '<div class="k-cell ' + c.cls + '"><h5>' + c.name + lbl(p + '.ev') + '</h5><small>' + c.hint + '</small>' +
        '<label><span class="sr-only">' + c.name + '</span><textarea data-bind="' + p + '.t" rows="3">' + esc(get(p + '.t') || '') + '</textarea></label>' +
        (c.extra ? '<small>' + c.extra[1] + '</small><label><span class="sr-only">' + c.extra[1] + '</span><textarea data-bind="canvas.' + c.extra[0] + '.t" rows="2">' + esc(get('canvas.' + c.extra[0] + '.t') || '') + '</textarea></label>' : '') +
        '</div>';
    }).join('');
  }

  var RENDER = {
    jobs: renderJobs, proto: renderProto, feats: renderFeats, exps: renderExps, canvas: renderCanvas,
    vpc: function () { renderVpcCust(); renderVpcVal(); }, doi: renderDoi, mvp: renderMvpTypes
  };

  // Derived state
  function pains() { return S.vpc.pains.filter(function (x) { return filled(x.t); }); }
  function linked(list) {
    return S.vpc[list].map(function (r) { return r.to; }).filter(Boolean);
  }
  function wajib() { return S.feats.filter(function (f) { return filled(f.t) && f.m === 'Wajib'; }); }
  function expResult(r) {
    var reach = num(r.reach), act = num(r.act), target = num(r.target);
    if (!reach || act === null) return null;
    var conv = act / reach * 100;
    return { conv: conv, target: target, met: target !== null && conv >= target };
  }
  function canvasFilled() { return CELLS.filter(function (c) { return filled(get('canvas.' + c.id + '.t')); }); }

  function refresh() {
    var u = S.uvp;
    // A
    $('uvp-statement').textContent = 'Untuk ' + or(u.seg, '[segmen]') + ' yang ' + or(u.problem, '[masalah]') + ', ' + (filled(u.product) ? u.product.trim() : '[produk]') +
      ' membantu ' + or(u.result, '[hasil akhir]') + ' ' + or(u.time, '[ukuran / waktu]') + (filled(u.objection) ? ', ' + or(u.objection, '') : '') +
      '. Tidak seperti ' + or(u.alt, '[alternatif saat ini]') + ', ' + or(u.diff, '[pembeda utama]') + '.';
    var hw = filled(u.headline) ? u.headline.trim().split(/\s+/).length : 0;
    var jargon = (u.headline || '').match(/\b(iot|ai|artificial intelligence|machine learning|blockchain|sensor|platform|big data|algoritma)\b/i);
    $('uvp-hint').textContent = !hw ? '' : hw + ' kata' + (hw > 12 ? ' — coba padatkan.' : ' ✓') + (jargon ? ' · Mengandung istilah teknis “' + jargon[0] + '” — ganti dengan hasil yang dirasakan pengguna.' : '');
    $('uvp-hint').style.color = hw > 12 || jargon ? '#7A4508' : '#1F4D36';

    // B
    S.jobs.forEach(function (j, i) { var el = $('job-prev-' + i); if (el) el.textContent = jobSentence(j); });
    var jf = S.jobs.filter(function (j) { return filled(j.sit) || filled(j.mot); });
    $('jobs-sum').textContent = jf.length + ' job · ' + jf.filter(function (j) { return j.ev; }).length + ' evidence · ' + jf.filter(function (j) { return j.star; }).length + ' job utama';

    // C
    var P = pains(), L = linked('relievers');
    var hit = P.filter(function (p) { return L.indexOf(p.id) >= 0; });
    var starP = P.filter(function (p) { return p.star; });
    var starHit = starP.filter(function (p) { return L.indexOf(p.id) >= 0; });
    $('fit-text').textContent = P.length ? hit.length + ' dari ' + P.length + ' pain tersentuh · ★ ' + starHit.length + '/' + starP.length + ' prioritas' : 'Tambahkan pain di Customer Profile';
    $('fit-bar').style.width = (P.length ? hit.length / P.length * 100 : 0) + '%';
    var flags = [];
    var loose = S.vpc.relievers.filter(function (r) { return filled(r.t) && !r.to; }).length;
    if (loose) flags.push(['bad', loose + ' pain reliever belum dihubungkan ke pain mana pun.']);
    var missing = starP.filter(function (p) { return L.indexOf(p.id) < 0; });
    if (missing.length) flags.push(['bad', 'Pain prioritas belum tersentuh: ' + missing.map(function (p) { return p.t; }).join('; ')]);
    if (starP.length && !missing.length) flags.push(['good', 'Semua pain prioritas sudah punya pain reliever.']);
    if (P.length && !starP.length) flags.push(['bad', 'Tandai ★ pain yang paling penting bagi pelanggan.']);
    $('fit-flags').innerHTML = flags.map(function (f) { return '<span class="k-flag ' + f[0] + '">' + esc(f[1]) + '</span>'; }).join('');

    // D
    var g = GROUPS.filter(function (x) { return x.id === S.doi.target; })[0];
    $('doi-target-text').textContent = g ? 'Target: ' + g.name : 'Pilih satu kelompok';
    var flag = '';
    if (g && g.id === 'early') flag = '<span class="k-flag good">Tepat: early adopter dipercaya tetangganya dan menjadi jembatan ke mayoritas.</span>';
    else if (g && g.id === 'inn') flag = '<span class="k-flag bad">Innovators cepat mencoba, tetapi jumlahnya kecil dan jarang ditiru tetangga. Pastikan ada jalur ke early adopter.</span>';
    else if (g) flag = '<span class="k-flag bad">Mayoritas biasanya menunggu bukti dari orang lain — memulai dari sini cenderung lambat dan mahal untuk divalidasi.</span>';
    $('doi-flag').innerHTML = flag;
    var scored = ATTRS.filter(function (a) { return S.doi.attrs[a.id]; });
    var total = scored.reduce(function (s, a) { return s + S.doi.attrs[a.id]; }, 0);
    $('doi-attr-sum').textContent = scored.length ? total + ' / ' + scored.length * 5 + ' (' + scored.length + '/5 dinilai)' : 'Skor 1 (lemah) – 5 (kuat)';
    if (scored.length) {
      var weak = scored.slice().sort(function (a, b) { return S.doi.attrs[a.id] - S.doi.attrs[b.id]; })[0];
      $('doi-weak').innerHTML = 'Atribut terlemah: <strong>' + weak.name + ' (' + S.doi.attrs[weak.id] + ')</strong> — hambatan adopsi pertama yang perlu diatasi lewat MVP.';
    } else {
      $('doi-weak').textContent = 'Nilai dari sudut pandang early adopter Anda, bukan dari sudut pandang tim.';
    }

    // E
    var pr = S.proto.filter(function (r) { return filled(r.asm); });
    var count = function (res) { return pr.filter(function (r) { return r.res === res; }).length; };
    $('proto-sum').textContent = pr.length + ' uji · ' + count('Terbukti') + ' terbukti · ' + count('Terbantah') + ' terbantah';

    // F
    var m = S.mvp;
    $('mvp-hyp').textContent = 'Kami percaya ' + or(m.seg, '[segmen]') + ' akan ' + or(m.action, '[tindakan terukur]') + '. Hipotesis terbukti jika ' +
      or(m.metric, '[ukuran]') + ' mencapai minimal ' + or(m.threshold, '[ambang]') + ' dalam ' + or(m.time, '[waktu]') + '.';
    var t = TYPES.filter(function (x) { return x.id === m.type; })[0];
    $('mvp-type-text').textContent = t ? 'Dipilih: ' + t.name : 'Pilih satu';
    var ff = S.feats.filter(function (f) { return filled(f.t); });
    $('feat-sum').textContent = MOSCOW.map(function (k) { return ff.filter(function (f) { return f.m === k; }).length + ' ' + k.toLowerCase(); }).join(' · ');
    var w = wajib().length;
    $('feat-flag').innerHTML = w > 3 ? '<span class="k-flag bad">' + w + ' fitur wajib — risiko over-engineering. Mana yang benar-benar diperlukan untuk menguji hipotesis?</span>'
      : w ? '<span class="k-flag good">' + w + ' fitur wajib — cukup fokus.</span>' : '';

    // G
    var signups = 0, preorders = 0, best = null, metCount = 0, measured = 0;
    S.exps.forEach(function (r, i) {
      var res = expResult(r), el = $('exp-res-' + i);
      if (res) {
        measured++;
        if (r.type === 'Pre-order') preorders += num(r.act) || 0; else signups += num(r.act) || 0;
        if (best === null || res.conv > best) best = res.conv;
        if (res.met) metCount++;
      }
      if (!el) return;
      if (!res) { el.className = 'k-flag'; el.textContent = 'Isi jangkauan dan jumlah komitmen untuk menghitung konversi.'; el.style.color = '#4A5A52'; return; }
      el.style.color = '';
      el.className = 'k-flag ' + (res.target === null ? '' : res.met ? 'good' : 'bad');
      el.textContent = 'Konversi ' + res.conv.toFixed(1).replace('.', ',') + '%' +
        (res.target === null ? ' · tetapkan target sebelum eksperimen' : res.met ? ' · ✓ mencapai target ' + res.target + '%' : ' · di bawah target ' + res.target + '%');
    });
    $('exp-stats').innerHTML = '<div><strong>' + signups + '</strong><span>sign-up / waitlist</span></div><div><strong>' + preorders + '</strong><span>pre-order</span></div>' +
      '<div><strong>' + (best === null ? '–' : best.toFixed(1).replace('.', ',') + '%') + '</strong><span>konversi terbaik</span></div><div><strong>' + metCount + '/' + measured + '</strong><span>eksperimen capai target</span></div>';

    // H
    var cf = canvasFilled();
    $('canvas-filled').textContent = cf.length;
    $('canvas-ev').textContent = CELLS.filter(function (c) { return get('canvas.' + c.id + '.ev'); }).length;

    // Gate hints
    var mainJob = S.jobs.some(function (j) { return j.star && (filled(j.sit) || filled(j.mot)); });
    var hyp = filled(m.seg) && filled(m.action) && filled(m.metric) && filled(m.threshold);
    var hints = [
      [filled(u.headline) && mainJob, (filled(u.headline) ? 'Headline UVP ✓' : 'Headline UVP belum ditulis') + ' · ' + (mainJob ? 'job utama ★ ✓' : 'belum ada job utama ★')],
      [starP.length > 0 && !missing.length, starP.length ? starHit.length + '/' + starP.length + ' pain prioritas tersentuh' : 'Belum ada pain prioritas ★'],
      [(S.doi.target === 'early' || S.doi.target === 'inn') && filled(S.doi.who), (g ? 'Target: ' + g.name : 'Target belum dipilih') + ' · ' + (filled(S.doi.who) ? 'ciri early adopter ✓' : 'ciri early adopter belum diisi')],
      [hyp && !!m.type && w >= 1 && w <= 3, (hyp ? 'Hipotesis ✓' : 'Hipotesis belum lengkap') + ' · ' + (t ? t.name : 'bentuk MVP belum dipilih') + ' · ' + w + ' fitur wajib'],
      [metCount > 0, measured ? metCount + ' dari ' + measured + ' eksperimen mencapai target' : 'Belum ada eksperimen terukur'],
      [cf.length === 9, cf.length + '/9 kotak terisi · ' + $('canvas-ev').textContent + ' berlabel evidence']
    ];
    hints.forEach(function (h, i) {
      var el = $('gate-hint-' + i);
      el.className = h[0] ? 'ok' : 'no';
      el.textContent = (h[0] ? '✓ ' : '○ ') + h[1];
    });
  }

  // Gate (rendered once so saved checkbox state binds via app.js)
  var GATE = [
    ['UVP satu kalimat dan job utama pelanggan teridentifikasi dari wawancara', 'A · B'],
    ['Setiap pain prioritas di Value Proposition Canvas punya pain reliever', 'C'],
    ['Early adopter spesifik — bisa disebut nama dan cara menghubunginya', 'D'],
    ['MVP hanya memuat fitur yang diperlukan untuk menguji hipotesis', 'E · F'],
    ['Sign-up / waitlist / pre-order mencapai target yang ditetapkan sebelum eksperimen', 'G'],
    ['Lean Canvas V1 lengkap dengan label Evidence / Assumption', 'H']
  ];
  $('gate-items').innerHTML = GATE.map(function (g, i) {
    return '<label class="k-gate-item"><input type="checkbox" data-save="chapter2gate:' + (i + 1) + '"><span><span style="display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap"><span>' + g[0] + '</span><span style="font-size: 13px; color: #4A5A52">Bagian ' + g[1] + '</span></span><small id="gate-hint-' + i + '"></small></span></label>';
  }).join('');
  function gateCount() {
    var n = document.querySelectorAll('#gate-items input:checked').length;
    $('gate-count').textContent = n;
    store.set('c2:gate', n);
  }
  $('gate-items').addEventListener('change', gateCount);

  // Soft lock from Gate 1
  var g1 = [1, 2, 3, 4, 5].filter(function (i) { return store.get('field:dashboard:' + i, false) === true; }).length;
  if (g1 < 5) {
    $('lock').hidden = false;
    $('lock-text').textContent = 'Milestone Gate 1 baru ' + g1 + '/5 tercentang. Anda tetap bisa mempelajari Chapter 2, tetapi tuntaskan Gate 1 sebelum menjalankan eksperimen.';
  }

  // Reference from Chapter 1
  var rcRoot = store.get('rc:root', ''), rcProblem = store.get('rc:problem', '');
  if (filled(rcRoot) || filled(rcProblem)) {
    $('a-ref').hidden = false;
    $('a-ref').innerHTML = '<b>DARI CHAPTER 1 · BAGIAN C</b>' + (filled(rcProblem) ? '<span><strong>Masalah:</strong> ' + esc(rcProblem) + '</span>' : '') +
      (filled(rcRoot) ? '<span><strong>Akar penyebab:</strong> ' + esc(rcRoot) + '</span><button type="button" class="k-add" id="use-root" style="min-height: 36px; text-align: left">Pakai akar penyebab sebagai “Masalah” di UVP</button>' : '');
    var useRoot = $('use-root');
    if (useRoot) useRoot.addEventListener('click', function () {
      S.uvp.problem = rcRoot;
      document.querySelector('[data-bind="uvp.problem"]').value = rcRoot;
      save(); refresh();
    });
  }

  // Events
  function rootOf(path) { return path.split('.')[0]; }
  function onBind(e) {
    var el = e.target.closest('[data-bind]');
    if (!el) return;
    var path = el.dataset.bind;
    set(path, el.value);
    save();
    if (/^vpc\.(pains|gains)\./.test(path)) renderVpcVal();
    if (/^vpc\.(relievers|creators)\.\d+\.to$/.test(path) || /^feats\.\d+\.m$/.test(path)) RENDER[rootOf(path)]();
    refresh();
  }
  document.addEventListener('input', onBind);
  document.addEventListener('change', onBind);

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-toggle],[data-add],[data-del],[data-set]');
    if (!t) return;
    if (t.dataset.toggle) {
      set(t.dataset.toggle, !get(t.dataset.toggle));
      RENDER[rootOf(t.dataset.toggle)]();
    } else if (t.dataset.add) {
      var list = get(t.dataset.add);
      list.push(TEMPLATES[t.dataset.add]());
      RENDER[rootOf(t.dataset.add)]();
      var fields = document.querySelectorAll('[data-bind^="' + t.dataset.add + '.' + (list.length - 1) + '."]');
      if (fields.length) fields[0].focus();
    } else if (t.dataset.del) {
      var parts = t.dataset.del.split('.'), idx = Number(parts.pop());
      var arr = get(parts.join('.'));
      var removed = arr.splice(idx, 1)[0];
      if (parts.join('.') === 'vpc.pains' || parts.join('.') === 'vpc.gains') {
        ['relievers', 'creators'].forEach(function (k) { S.vpc[k].forEach(function (r) { if (r.to === removed.id) r.to = ''; }); });
      }
      RENDER[rootOf(t.dataset.del)]();
    } else if (t.dataset.set) {
      var v = t.dataset.num ? Number(t.dataset.val) : t.dataset.val;
      set(t.dataset.set, get(t.dataset.set) === v ? (t.dataset.num ? 0 : '') : v);
      RENDER[rootOf(t.dataset.set)]();
    }
    save();
    refresh();
  });

  $('vpc-import').addEventListener('click', function () {
    var existing = S.vpc.jobs.map(function (j) { return j.t; });
    var added = 0;
    S.jobs.forEach(function (j) {
      if (!filled(j.sit) && !filled(j.mot)) return;
      var text = jobSentence(j);
      if (existing.indexOf(text) >= 0) return;
      S.vpc.jobs.push({ id: uid(), t: text, star: !!j.star });
      added++;
    });
    renderVpcCust();
    save(); refresh();
    this.textContent = added ? added + ' job diimpor ✓' : 'Tidak ada job baru untuk diimpor';
  });

  $('canvas-fill').addEventListener('click', function () {
    var channels = S.exps.map(function (r) { return (r.ch || '').trim(); }).filter(Boolean)
      .filter(function (c, i, a) { return a.indexOf(c) === i; });
    var sources = {
      problem: [rcProblem, rcRoot].filter(filled).join('\n'),
      alt: S.uvp.alt,
      solution: wajib().map(function (f) { return '• ' + f.t.trim(); }).join('\n'),
      metrics: filled(S.mvp.metric) ? S.mvp.metric + (filled(S.mvp.threshold) ? ' (target ≥ ' + S.mvp.threshold + ')' : '') : '',
      uvp: S.uvp.headline,
      concept: S.uvp.pitch,
      channels: channels.join(', '),
      segments: S.uvp.seg,
      early: S.doi.who
    };
    var n = 0;
    Object.keys(sources).forEach(function (k) {
      if (filled(sources[k]) && !filled(get('canvas.' + k + '.t'))) { set('canvas.' + k + '.t', sources[k].trim()); n++; }
    });
    renderCanvas();
    save(); refresh();
    this.textContent = n ? n + ' kotak diisi — periksa dan beri label' : 'Tidak ada kotak kosong yang bisa diisi otomatis';
  });

  // Section nav highlight
  var links = {};
  document.querySelectorAll('#secnav a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].removeAttribute('aria-current'); });
        if (links[en.target.id]) links[en.target.id].setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    Object.keys(links).forEach(function (id) { var s = $(id); if (s) io.observe(s); });
  }

  // Initial render
  document.querySelectorAll('[data-bind]').forEach(function (el) { el.value = get(el.dataset.bind) || ''; });
  Object.keys(RENDER).forEach(function (k) { RENDER[k](); });
  refresh();
  document.addEventListener('DOMContentLoaded', gateCount);
})();
