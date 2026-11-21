// The Demo and More info tabs on a project page. Without this script they are links to the two
// panels, which stack, demo first. With it, one panel shows at a time: the demo, unless the URL's
// fragment is #more-info or names something inside it, such as one of the write-up's questions, which
// then opens too. A tab click adds a history entry, so Back returns to the other tab. The other panel is hidden "until-found", so
// find in page still searches it and opens its tab. Arrow keys move between the tabs, as in the ARIA
// tabs pattern.
// This runs inline at the end of the article, before the demo's script mounts. Keep "<" out of it, as
// in theme.js.
(function () {
  var project = document.currentScript.closest('.project');
  var list = project.querySelector('.project__tabs ul');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('a'));
  var panels = tabs.map(function (tab) { return document.getElementById(tab.hash.slice(1)); });

  list.setAttribute('role', 'tablist');
  tabs.forEach(function (tab, i) {
    tab.parentNode.setAttribute('role', 'presentation');
    tab.setAttribute('role', 'tab');
    tab.id = 'tab-' + panels[i].id;
    tab.setAttribute('aria-controls', panels[i].id);
    panels[i].setAttribute('role', 'tabpanel');
    panels[i].setAttribute('aria-labelledby', tab.id);
  });
  project.classList.add('project--tabbed');

  function select(index) {
    tabs.forEach(function (tab, i) {
      var selected = i === index;
      tab.setAttribute('aria-selected', selected);
      tab.tabIndex = selected ? 0 : -1;
      panels[i].hidden = selected ? false : 'until-found';
    });
    // So that demo-fit.js measures where the demo starts again, now that it may be showing.
    window.dispatchEvent(new Event('resize'));
  }

  // Shows the fragment's target: selects the tab whose panel holds it, or else the demo, and opens the
  // question it is, or is in.
  function reveal() {
    var id = decodeURIComponent(location.hash.slice(1));
    var target = id && document.getElementById(id);
    var question = target && target.closest('details');
    if (question) question.open = true;
    select(Math.max(0, panels.findIndex(function (panel) { return target && panel.contains(target); })));
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function (event) {
      event.preventDefault();
      if (tab.getAttribute('aria-selected') === 'true') return;
      // The demo, the first tab, is the page's own URL, with no fragment.
      history.pushState(null, '', i ? tab.hash : location.pathname + location.search);
      select(i);
    });
    tab.addEventListener('keydown', function (event) {
      var step = { ArrowLeft: -1, ArrowRight: 1, Home: -i, End: tabs.length - 1 - i }[event.key];
      if (step === undefined) return;
      event.preventDefault();
      var next = tabs[(i + step + tabs.length) % tabs.length];
      next.focus();
      next.click();
    });
  });

  panels.forEach(function (panel, i) {
    panel.addEventListener('beforematch', function () { select(i); });
  });
  // Back and Forward between the tabs, and links to a fragment, such as a question's.
  window.addEventListener('popstate', reveal);
  reveal();
})();
