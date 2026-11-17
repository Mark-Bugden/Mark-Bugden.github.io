// Theme: dark, whatever the OS prefers, unless the visitor has picked light with the header button.
// This runs inline in <head>, so a saved choice applies before the first paint. It always sets
// <html data-theme>, which demos follow too, and keeps the color-scheme and theme-color metas in step,
// so the browser's own surfaces match the page.
// Keep "<" out of this file: minified, "a<b" looks like a tag to the link checker's HTML tokenizer,
// which then stops reading the page.
(function () {
  var root = document.documentElement;
  var key = 'theme';
  var backgrounds = { dark: '#0A0E14', light: '#F5F6F8' };

  function meta(name, content) {
    var tag = document.querySelector('meta[name="' + name + '"]');
    if (tag) tag.setAttribute('content', content);
  }

  function set(theme) {
    root.setAttribute('data-theme', theme);
    meta('color-scheme', theme);
    meta('theme-color', backgrounds[theme]);
    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      button.setAttribute('aria-pressed', String(theme === 'dark'));
    });
  }

  var saved = null;
  try { saved = localStorage.getItem(key); } catch (e) { /* storage blocked: stay dark */ }
  set(saved === 'light' ? 'light' : 'dark');
  root.classList.add('js');

  // The header button is not parsed yet when this first runs.
  document.addEventListener('DOMContentLoaded', function () { set(root.getAttribute('data-theme')); });

  document.addEventListener('click', function (event) {
    var button = event.target.closest && event.target.closest('[data-theme-toggle]');
    if (!button) return;
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    set(next);
    try { localStorage.setItem(key, next); } catch (e) { /* the choice lasts for this page only */ }
  });
})();
