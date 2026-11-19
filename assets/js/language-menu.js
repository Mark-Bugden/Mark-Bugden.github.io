// The header's language menu is a <details>, so it opens and shuts without script. This closes it the
// way a menu should close: on a click or tap outside it, on Escape (focus goes back to its button),
// when focus moves out of it, and before the page is cached, so going back to it doesn't find it open.
// This runs inline in head and listens on the document, so the menu needn't be parsed yet. Keep "<"
// out of this file, as in theme.js.
(function () {
  function openMenus() { return document.querySelectorAll('[data-lang-menu][open]'); }

  // pointerdown, not click: a tap on plain text sends no click on phones.
  document.addEventListener('pointerdown', function (event) {
    openMenus().forEach(function (menu) {
      if (!menu.contains(event.target)) menu.open = false;
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    openMenus().forEach(function (menu) {
      var focused = menu.contains(document.activeElement);
      menu.open = false;
      if (focused) menu.querySelector('summary').focus();
    });
  });

  // A click on something that takes no focus leaves relatedTarget empty; pointerdown has those.
  document.addEventListener('focusout', function (event) {
    var menu = event.target.closest && event.target.closest('[data-lang-menu][open]');
    if (menu && event.relatedTarget && !menu.contains(event.relatedTarget)) menu.open = false;
  });

  window.addEventListener('pagehide', function () {
    openMenus().forEach(function (menu) { menu.open = false; });
  });
})();
