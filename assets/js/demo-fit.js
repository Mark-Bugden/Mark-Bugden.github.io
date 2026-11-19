// Where the demo starts on its project page. site.css subtracts it from the window's height to give
// --dk-fit-height, the height a demo that sizes itself to the window fits in, so the whole demo is on
// screen when the page opens. It runs inline right after the embed, before the demo's script mounts,
// and again when a resize or the web fonts change what sits above the demo. Keep "<" out of it, as in
// theme.js.
(function () {
  var embed = document.currentScript.previousElementSibling;
  function measure() {
    embed.style.setProperty('--demo-top', Math.round(embed.getBoundingClientRect().top + window.scrollY) + 'px');
  }
  measure();
  window.addEventListener('resize', measure);
  if (document.fonts) document.fonts.ready.then(measure);
})();
