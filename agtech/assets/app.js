var store = {
  get: function (k, fallback) {
    try {
      var v = localStorage.getItem('agtech:' + k);
      return v === null ? fallback : JSON.parse(v);
    } catch (e) { return fallback; }
  },
  set: function (k, v) {
    try { localStorage.setItem('agtech:' + k, JSON.stringify(v)); } catch (e) {}
  }
};

function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function bindSaved(root) {
  (root || document).querySelectorAll('[data-save]').forEach(function (el) {
    var key = 'field:' + el.dataset.save;
    var saved = store.get(key, null);
    if (el.type === 'checkbox') {
      if (saved !== null) el.checked = saved;
      el.addEventListener('change', function () { store.set(key, el.checked); });
    } else {
      if (saved !== null) el.value = saved;
      el.addEventListener('input', function () { store.set(key, el.value); });
      el.addEventListener('change', function () { store.set(key, el.value); });
    }
  });
}

document.addEventListener('DOMContentLoaded', function () { bindSaved(); });
