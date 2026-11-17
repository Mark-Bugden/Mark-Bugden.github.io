// Theme: dark by default, light when the OS prefers it, unless the visitor has picked one with the
// header button. This runs inline in <head>, so a saved choice applies before the first paint. Demos
// follow <html data-theme> too.
// Keep "<" out of this file: minified, "a<b" looks like a tag to the link checker's HTML tokenizer,
// which then stops reading the page.
(function () {
  var root = document.documentElement;
  var key = 'theme';
  var light = window.matchMedia('(prefers-color-scheme: light)');

  try {
    var saved = localStorage.getItem(key);
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  } catch (e) { /* storage blocked: follow the OS */ }
  root.classList.add('js');

  function isDark() {
    var theme = root.getAttribute('data-theme');
    return theme ? theme === 'dark' : !light.matches;
  }

  function sync() {
    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      button.setAttribute('aria-pressed', String(isDark()));
    });
  }

  document.addEventListener('DOMContentLoaded', sync);
  if (light.addEventListener) light.addEventListener('change', sync);

  document.addEventListener('click', function (event) {
    var button = event.target.closest && event.target.closest('[data-theme-toggle]');
    if (!button) return;
    var next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem(key, next); } catch (e) { /* the choice lasts for this page only */ }
    sync();
  });
})();
