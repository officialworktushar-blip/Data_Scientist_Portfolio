/* ==========================================================================
   HERO GALLERY — scattered "photo pile" of featured project cards
   (index.html, at the top of the Featured Projects area).
   --------------------------------------------------------------------------
   - Renders up to 8 cards from SITE.portfolio.projects (single source of
     truth, same data as projects.html).
   - GSAP staggered fade + scale + rotate on first scroll into view.
   - Cursor parallax: each card translates by (cursor offset * its --depth),
     so front cards (higher depth) move slightly more. Max ~11px, subtle.
     Disabled on <=900px and for prefers-reduced-motion.
   - Hover lift / straighten / accent glow is pure CSS (gallery.css).
   - Every card links to projects.html#<id>, which auto-opens the project's
     case-study modal (wired in sections.js).
   // TODO: replace the gradient/mock-chart thumbnails with real project
   // screenshots — set `shot: 'assets/projects/<id>.png'` on a project in
   // content.js and gallery.js will render an <img> instead of the mockup.
   ========================================================================== */
(function () {
  'use strict';

  var rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mqDesktop = window.matchMedia ? window.matchMedia('(min-width: 901px)') : null;
  var stage = document.getElementById('gallery-stage');
  if (!stage) return;
  if (!window.SITE || !SITE.portfolio || !SITE.portfolio.projects) return;

  var proj = SITE.portfolio.projects;

  /* Layout recipe per slot: size class, left/top (%), tilt (deg), z-index,
     parallax depth multiplier (front = higher). Mirrors a casual photo pile:
     fronts overlap backs, all slightly rotated. */
  var RECIPE = [
    { i: 0, s: 'gl-a', l: 4,  t: 5,  r: -3, z: 6, d: 1.6 }, /* p1 front-left   */
    { i: 4, s: 'gl-b', l: 22, t: 8,  r: 6,  z: 3, d: 1.0 }, /* p5 upper         */
    { i: 2, s: 'gl-c', l: 62, t: 5,  r: -6, z: 5, d: 1.4 }, /* p3 upper-right   */
    { i: 3, s: 'gl-d', l: 30, t: 40, r: 2,  z: 2, d: 0.8 }, /* p4 mid-wide      */
    { i: 1, s: 'gl-b', l: 62, t: 42, r: 5,  z: 4, d: 1.1 }, /* p2 mid-right     */
    { i: 6, s: 'gl-c', l: 47, t: 4,  r: -4, z: 3, d: 1.1 }, /* p6 top-middle    */
    { i: 5, s: 'gl-b', l: 8,  t: 46, r: 3,  z: 1, d: 0.7 }, /* p7 back-bottom   */
    { i: 7, s: 'gl-c', l: 44, t: 52, r: -5, z: 2, d: 0.9 }  /* p8 bottom        */
  ];

  var cards = [];
  var i;

  for (i = 0; i < RECIPE.length; i++) {
    var slot = RECIPE[i];
    var pr = proj[slot.i];
    if (!pr) continue;
    var metric = pr.metrics && pr.metrics[0] ? pr.metrics[0].value : '';
    var shot = pr.shot || ''; // TODO: real screenshots — see header comment

    var a = document.createElement('a');
    a.className = 'gallery-card ' + slot.s;
    a.href = 'projects.html#' + pr.id;
    a.setAttribute('aria-label', pr.title + ' — case study');
    a.setAttribute('data-depth', String(slot.d));
    a.style.cssText = 'left:' + slot.l + '%;top:' + slot.t + '%;'
      + '--tilt:' + slot.r + 'deg;--depth:' + slot.d + ';--z:' + slot.z + ';'
      + '--thumb-grad:' + (pr.gradient || 'linear-gradient(135deg,#12121c,#0c0c12)');

    var glow = document.createElement('span');
    glow.className = 'gallery-glow';
    glow.setAttribute('aria-hidden', 'true');
    a.appendChild(glow);

    var thumb = document.createElement('span');
    thumb.className = 'gallery-thumb';
    thumb.innerHTML = mockupHtml(pr, shot);
    a.appendChild(thumb);

    var ov = document.createElement('span');
    ov.className = 'gallery-overlay';
    ov.innerHTML = '<span class="gallery-cat">' + pr.category + '</span>'
      + '<span class="gallery-name">' + pr.title + '</span>'
      + (metric ? '<span class="gallery-metric"><i class="fas fa-chart-line" aria-hidden="true"></i> ' + metric + '</span>' : '');
    a.appendChild(ov);

    stage.appendChild(a);
    cards.push({ el: a, tilt: slot.r });
  }

  /* Placeholder mock-chart thumbnail (falls back to <img> when `pr.shot`). */
  function mockupHtml(pr, shot) {
    if (shot) {
      return '<img class="gallery-shot" src="' + shot + '" alt="' + pr.title + ' screenshot" loading="lazy">';
    }
    var bars = '';
    var heights = [40, 62, 50, 78, 66, 92, 100];
    for (var b = 0; b < heights.length; b++) {
      bars += '<span class="gallery-bar" style="height:' + heights[b] + '%"></span>';
    }
    return '<span class="gallery-mock">'
      + '<span class="gallery-mock-top"><i class="' + pr.icon + '" aria-hidden="true"></i>'
      + '<span class="gallery-mock-pill">' + pr.category.split(' / ')[0] + '</span></span>'
      + '<span class="gallery-mock-chart" aria-hidden="true">' + bars + '</span>'
      + '<span class="gallery-mock-caption">' + pr.title + ' — mock</span>'
      + '</span>';
  }

  /* ------------ cursor parallax (desktop + no reduced motion) ------------ */
  var RATIO = 7; /* px per unit offset — max front card: 1.6 * 7 = 11.2px */
  function bindParallax() {
    if (rm) return;
    if (!stage._parBound) {
      stage.addEventListener('mousemove', function (ev) {
        var r = stage.getBoundingClientRect();
        if (!r.width || !r.height) return;
        var nx = ((ev.clientX - r.left) / r.width - 0.5) * 2;
        var ny = ((ev.clientY - r.top) / r.height - 0.5) * 2;
        stage.style.setProperty('--parx', (nx * RATIO).toFixed(2) + 'px');
        stage.style.setProperty('--pary', (ny * RATIO).toFixed(2) + 'px');
      });
      stage.addEventListener('mouseleave', function () {
        stage.style.setProperty('--parx', '0px');
        stage.style.setProperty('--pary', '0px');
      });
      stage._parBound = true;
    }
    /* only run on desktop widths */
    stage.style.setProperty('--parx', '0px');
    stage.style.setProperty('--pary', '0px');
  }
  bindParallax();
  if (mqDesktop && mqDesktop.addEventListener) {
    mqDesktop.addEventListener('change', bindParallax);
  }

  /* --------- GSAP staggered entry (fade + scale + rotate to tilt) ------- */
  function play() {
    if (!window.gsap || !cards.length) return;
    var n = cards.length;
    var els = cards.map(function (c) { return c.el; });
    var tl = window.gsap.timeline();
    tl.fromTo(els,
      { opacity: 0, scale: 0.62, rotate: 0 },
      {
        opacity: 1,
        scale: 1,
        rotate: function (idx) { return cards[idx].tilt; },
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.07
      });
    tl.eventCallback('onComplete', function () {
      /* Hand the transform back to the CSS var-based recipe (parallax +
         hover) so nothing stays inline. */
      window.gsap.set(els, { clearProps: 'transform,opacity' });
    });
  }

  if (rm) {
    /* reduced motion: instant, static grid — CSS already handles layout */
  } else if (window.ScrollTrigger) {
    ScrollTrigger.create({ trigger: stage, start: 'top 82%', once: true, onEnter: play });
  } else {
    play();
  }
})();