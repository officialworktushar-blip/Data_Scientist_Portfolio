/* ------------------------------------------------------------------ *
 *  page-transition.js — shared soft fade between same-origin pages.
 *  The heavy lifting is CSS (#page-transition / html.pt-* classes).
 *  Respects prefers-reduced-motion (overlay removed entirely).
 *  Load on every page AFTER assets/js/motion.js and js/main.js.
 * ------------------------------------------------------------------ */
(function () {
  'use strict';

  var overlay = document.getElementById('page-transition');
  if (!overlay) return;

  var html = document.documentElement;
  if (html.classList.contains('reduce-motion')) {
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    return;
  }

  var OUT = 250;

  html.classList.add('pt-ready');
  setTimeout(function () { html.classList.add('pt-done'); }, 40);

  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a') : null;
    if (!a) return;
    if (a.getAttribute('target') === '_blank') return;
    var href = a.getAttribute('href') || '';
    if (href.charAt(0) === '#') return;
    if (href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0 || href.indexOf('javascript:') === 0) return;
    var url = a.href;
    if (!url || url.indexOf(location.origin) !== 0) return;
    ev.preventDefault();
    if (html.classList.contains('pt-leaving')) return;
    html.classList.add('pt-leaving');
    setTimeout(function () { window.location.href = url; }, OUT);
  });
})();