/* ==========================================================================
   ABOUT SPOTLIGHT — tab switching for the neon "About / Trusted By" card.
   Pills at top-left swap the middle pane (Overview | Experience | Certs)
   with a CSS crossfade + slide. Guarded to only run on the matching card.
   ========================================================================== */
(function () {
  'use strict';
  var tabs = document.querySelectorAll('.spot-tab');
  var panes = document.querySelectorAll('.spot-pane');
  if (!tabs.length || !panes.length) return;

  function activate(key) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-spot-tab') === key;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    panes.forEach(function (p) {
      p.classList.toggle('is-active', p.getAttribute('data-spot-pane') === key);
      if (p.getAttribute('data-spot-pane') === key) {
        p.removeAttribute('aria-hidden');
      } else {
        p.setAttribute('aria-hidden', 'true');
      }
    });
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      activate(t.getAttribute('data-spot-tab'));
    });
  });
})();