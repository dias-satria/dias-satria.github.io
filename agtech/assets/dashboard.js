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

  var rc = store.get('rc:progress', null);
  if (rc && rc.done > 0) {
    var rcStatus = document.getElementById('rc-status');
    var rcDone = rc.done === rc.total;
    rcStatus.textContent = rcDone ? 'Siap gate' : 'Berjalan · ' + rc.done + '/' + rc.total;
    rcStatus.style.cssText = 'font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 999px; background: ' + (rcDone ? '#E3EDE4' : '#FBEBD3') + '; color: ' + (rcDone ? '#1F4D36' : '#7A4508');
  }

  var boxes =document.querySelectorAll('[data-gate] input[type="checkbox"]');
  function updateGate() {
    var checked = Array.prototype.filter.call(boxes, function (b) { return b.checked; }).length;
    document.getElementById('gate-count').textContent = checked;
    document.getElementById('gate-bar').style.width = (checked / boxes.length) * 100 + '%';

    var open = checked === boxes.length;
    var g2 = store.get('c2:gate', 0);
    var card = document.getElementById('gate2-card');
    document.getElementById('gate-step').textContent = 'Gerbang ' + (open ? 2 : 1) + ' dari 5';
    document.getElementById('ch2-state').innerHTML = open
      ? '<span style="font-family: \'IBM Plex Mono\', monospace; font-size: 12px; color: #F0C27A">TERBUKA</span>'
      : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-label="Terkunci"><rect x="4" y="11" width="16" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>';
    document.getElementById('gate2-label').textContent = open ? 'GATE 2 · ' + (g2 ? g2 + '/6 TERCENTANG' : 'TERBUKA') : 'GATE 2 · TERKUNCI';
    card.style.border = open ? '1.5px solid #1F4D36' : '1px dashed #B9C3BB';
    card.style.background = open ? '#FFFFFF' : '#F5F6F1';
    document.getElementById('gate2-meter').hidden = !open;
    document.getElementById('gate2-bar').style.width = (g2 / 6) * 100 + '%';
  }
  boxes.forEach(function (b) { b.addEventListener('change', updateGate); });
  document.addEventListener('DOMContentLoaded', updateGate);
})();
