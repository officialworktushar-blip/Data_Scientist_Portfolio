/* ==========================================================================
   IMPACT ACROSS INDUSTRIES — horizontal scroller controls (index.html)
   --------------------------------------------------------------------------
   - scroll-snap x mandatory row (CSS) with:
     * drag-to-scroll (pointer events; snap re-enabled on release, link
       clicks suppressed after an actual drag)
     * wheel/trackpad: vertical wheel over the row translates to horizontal
       scroll only while the row can still move that way
     * left/right arrow buttons (scrollBy one viewport of cards)
     * thin progress bar fed from scrollLeft / (scrollWidth - clientWidth)
   - Honors prefers-reduced-motion (instant scroll, no smoothing).
   ========================================================================== */
(function () {
  'use strict';
  var track = document.getElementById('ig-track');
  if (!track) return;

  var rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var prev = document.querySelector('.ig-prev');
  var next = document.querySelector('.ig-next');
  var fill = document.querySelector('.ig-progress-fill');
  var BEHAVE = rm ? 'auto' : 'smooth';

  function updateProgress() {
    var max = track.scrollWidth - track.clientWidth;
    var p = max > 0 ? (track.scrollLeft / max) * 100 : 0;
    if (fill) fill.style.setProperty('--ig-progress', p.toFixed(2) + '%');
    if (prev) prev.disabled = track.scrollLeft <= 2;
    if (next) next.disabled = track.scrollLeft >= max - 2;
  }

  function step(dir) {
    var card = track.querySelector('.ig-card');
    var stepPx = card ? card.getBoundingClientRect().width + 24 : track.clientWidth;
    track.scrollBy({ left: dir * stepPx, behavior: BEHAVE });
    updateProgress();
  }
  if (prev) prev.addEventListener('click', function () { step(-1); });
  if (next) next.addEventListener('click', function () { step(1); });

  /* Wheel → horizontal (only when the row can still move in that direction) */
  track.addEventListener('wheel', function (ev) {
    if (Math.abs(ev.deltaX) > Math.abs(ev.deltaY)) return; /* native horizontal */
    var canPrev = ev.deltaY < 0 && track.scrollLeft > 0;
    var canNext = ev.deltaY > 0 && track.scrollLeft < track.scrollWidth - track.clientWidth - 1;
    if (canPrev || canNext) {
      ev.preventDefault();
      track.scrollLeft += ev.deltaY;
      updateProgress();
    }
  }, { passive: false });

  /* Drag-to-scroll (desktop: mouse). Touch devices pan + snap natively via
     touch-action: manipulation — no pointer hijack needed, and Pointer Events
     get pointercancel'd by Chrome as soon a captured pointer scrolls this
     scroll-snap container. */
  var drag = { active: false, x0: 0, sL0: 0, moved: false };
  track.addEventListener('mousedown', function (ev) {
    drag.active = true;
    drag.x0 = ev.clientX;
    drag.sL0 = track.scrollLeft;
    drag.moved = false;
    track.classList.add('dragging');
    if (ev.cancelable) ev.preventDefault();
  });
  window.addEventListener('mousemove', function (ev) {
    if (!drag.active) return;
    var dx = ev.clientX - drag.x0;
    if (Math.abs(dx) > 4) drag.moved = true;
    track.scrollLeft = drag.sL0 - dx;
    updateProgress();
  });
  window.addEventListener('mouseup', function () {
    if (!drag.active) return;
    drag.active = false;
    track.classList.remove('dragging');
    updateProgress(); /* snap re-enables and may settle; keep the bar honest */
  });

  /* Don't follow the link when the pointer actually dragged the row */
  track.addEventListener('click', function (ev) {
    if (drag.moved) {
      ev.preventDefault();
      drag.moved = false;
    }
  }, true);

  var onTick = function () { updateProgress(); };
  track.addEventListener('scroll', onTick, { passive: true });
  window.addEventListener('resize', onTick);
  updateProgress();
})();