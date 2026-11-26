// Page transitions (site.css opts in): the link the visitor followed grows into the next page's
// title. As the old page is captured, the followed pill or header link takes the name page-title
// from that page's own title. On the way back to the home page, the pill of the section just left
// takes the name, so the title shrinks back into it. Where there is no transition (an older browser,
// or prefers-reduced-motion), pageswap and pagereveal come without a viewTransition, and this does
// nothing.
// This runs inline in head, so it is listening before the new page's first frame. Keep "<" out of
// it, as in theme.js.
(function () {
  var named = [];
  var followed = null;

  function name(el, value) {
    el.style.viewTransitionName = value;
    named.push(el);
  }
  function reset() {
    named.forEach(function (el) { el.style.viewTransitionName = ''; });
    named = [];
  }

  document.addEventListener('click', function (event) {
    followed = event.target.closest ? event.target.closest('a[href]') : null;
  }, true);

  // What grows into the next page's title: the pill, for a click anywhere in its cell; or the pill
  // or header link itself.
  function source(link) {
    if (!link) return null;
    var cell = (link.getAttribute('class') || '').match(/phase__cell--(\w+)/);
    if (cell) return document.querySelector('.phase__pill--' + cell[1]);
    if (link.matches('.phase__pill, .site-nav a')) return link;
    return null;
  }

  window.addEventListener('pageswap', function (event) {
    reset();
    var el = event.viewTransition && source(followed);
    followed = null;
    if (!el) return;
    var title = document.querySelector('.page-header h1');
    if (title) name(title, 'none');
    name(el, 'page-title');
  });

  window.addEventListener('pagereveal', function (event) {
    reset();
    var from = event.viewTransition && window.navigation && navigation.activation && navigation.activation.from;
    if (!from) return;
    var path = new URL(from.url).pathname;
    document.querySelectorAll('.phase__pill').forEach(function (pill) {
      if (pill.pathname === path) name(pill, 'page-title');
    });
  });
})();
