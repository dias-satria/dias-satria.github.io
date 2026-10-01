(function () {
  var scores = store.get('radar:scores', {});
  var updated = store.get('radar:updated', null);
  var total = 0, count = 0;
  DIMS.forEach(function (d) { if (scores[d.code]) { total += scores[d.code]; count += 1; } });

  var lvl = null;
  if (count === 10) LEVELS.forEach(function (l) { if (total >= l.min && total <= l.max) lvl = l; });

  if (count > 0) {
    document.getElementById('radar-total').textContent = total;
    document.getElementById('radar-level').textContent = lvl ? lvl.name : 'belum lengkap (' + count + '/10)';
    var prio = DIMS.filter(function (d) { return scores[d.code]; })
      .sort(function (a, b) { return scores[a.code] - scores[b.code]; })
      .slice(0, 3)
      .map(function (d) { return d.code + ' ' + d.name; });
    var prioEl = document.getElementById('radar-prio');
    prioEl.textContent = 'Prioritas: ' + prio.join(' · ');
    prioEl.hidden = false;
  }
  if (updated) {
    document.getElementById('radar-date').textContent = new Date(updated).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  var status = document.getElementById('radar-status');
  if (count < 10) {
    status.textContent = count ? 'Berjalan' : 'Belum';
    status.style.background = count ? '#FBEBD3' : 'transparent';
    status.style.color = count ? '#7A4508' : '#4A5A52';
  }

  var boxes = document.querySelectorAll('[data-gate] input[type="checkbox"]');
  function updateGate() {
    var checked = Array.prototype.filter.call(boxes, function (b) { return b.checked; }).length;
    document.getElementById('gate-count').textContent = checked;
    document.getElementById('gate-bar').style.width = (checked / boxes.length) * 100 + '%';
  }
  boxes.forEach(function (b) { b.addEventListener('change', updateGate); });
  document.addEventListener('DOMContentLoaded', updateGate);
})();
