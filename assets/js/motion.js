/* ==========================================================================
   MOTION.JS — Framer-style premium motion layer (loaded on every page)
   - Lenis smooth scroll wired to GSAP ScrollTrigger
   - data-reveal / data-delay / data-stagger reveals (wrapped / IO driven)
   - data-split word-by-word headline reveal
   - data-count number count-up (prefix/suffix/decimals, once in view)
   - data-marquee infinite loop (dupes the group, hover pauses)
   - scroll progress bar (nav itself stays transparent at all scrolls, per
     the framer.com measurement — no glass, no blur, no border)
   - honors prefers-reduced-motion everywhere
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia ? window.matchMedia('(hover: hover) and (pointer: fine)').matches : false;
  var hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  var lenis = null;

  /* Mark active so the 2s "reveal-all" failsafe stays inert. */
  root.classList.add('motion-ready');

  /* ----------------------------- utilities ------------------------------ */
  function observeOnce(el, cb) {
    if (rm || typeof IntersectionObserver === 'undefined') { cb(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { io.unobserve(en.target); cb(); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
  }

  function inViewport(el, pad) {
    var r = el.getBoundingClientRect();
    var p = pad || 0.95;
    return r.top < (window.innerHeight * p) && r.bottom > 0;
  }

  /* --------------------- Lenis smooth scroll + ScrollTrigger ------------ */
  function initLenis() {
    if (rm || typeof Lenis === 'undefined') return;
    lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      anchors: true,
      autoRaf: !hasGSAP
    });
    if (hasGSAP) {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
    /* Hero parallax (scrubbed, transform+opacity only). */
    gsap && !rm && (function () {
      if (typeof gsap === 'undefined') return;
      gsap.to('.hero-title', { scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }, y: -44, opacity: 0.7 });
      gsap.to('.hero-visual', { scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 }, y: -70 });
      gsap.to('.page-hero-content', { scrollTrigger: { trigger: '.page-hero', start: 'top top', end: 'bottom top', scrub: 1 }, y: -28, opacity: 0.6 });
    })();
  }

  /* ------------------------- scroll chrome ------------------------------ */
  var progressEl = null;
  var navEl = document.querySelector('.navbar');

  function updateChrome() {
    var y = window.scrollY || 0;
    var max = Math.max(root.scrollHeight - window.innerHeight, 1);
    var p = Math.min(y / max, 1);
    if (progressEl) progressEl.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    if (navEl) navEl.classList.toggle('scrolled', y > 40);
  }

  function initChrome() {
    if (!rm) {
      progressEl = document.createElement('div');
      progressEl.id = 'motion-progress';
      progressEl.setAttribute('aria-hidden', 'true');
      document.body.appendChild(progressEl);
    }
    if (lenis) lenis.on('scroll', updateChrome);
    window.addEventListener('scroll', updateChrome, { passive: true });
    /* IntersectionObserver knows all — reflect instant state. */
    if (typeof IntersectionObserver !== 'undefined') {
      observeOnce(document.body, updateChrome);
    } else {
      updateChrome();
    }
  }

  /* ---------------------- reveal system [data-reveal] ------------------- */
  function initReveals() {
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
    if (!els.length) return;

    els.forEach(function (el) {
      var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
      var parent = el.parentElement;
      var stagger = parent && parent.getAttribute ? parent.getAttribute('data-stagger') : null;
      if (stagger) {
        var siblings = Array.prototype.filter.call(parent.children, function (c) {
          return c.hasAttribute('data-reveal');
        });
        delay = Math.max(0, siblings.indexOf(el)) * parseFloat(stagger) * 1000;
      }
      el.style.transitionDelay = delay + 'ms';
      observeOnce(el, function () { reveal(el); });
    });

    /* Belt-and-braces: IO can miss targets inside content-visibility skip
       sections during fast scrolls, so a passive scroll pass always runs as
       well (it only reveals, never hides). */
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        els.forEach(function (el) {
          if (!el.classList.contains('rv-in') && inViewport(el)) reveal(el);
        });
      });
    }, { passive: true });
    if (typeof IntersectionObserver === 'undefined') {
      setTimeout(function () { els.forEach(function (el) { reveal(el); }); }, 1200);
    }
  }

  function reveal(el) {
    if (!el.classList.contains('rv-in')) el.classList.add('rv-in');
  }

  /* ------------------------ split text [data-split] --------------------- */
  function initSplit() {
    var targets = Array.prototype.slice.call(document.querySelectorAll('[data-split]'));
    if (!targets.length) return;

    targets.forEach(function (el) {
      if (el._split) return;
      el._split = true;
      if (!rm) {
        wrapWords(el);
        el.classList.add('is-split');
      }
      observeOnce(el, function () { el.classList.add('split-in'); });
    });

    if (typeof IntersectionObserver === 'undefined') {
      window.addEventListener('scroll', function () {
        targets.forEach(function (el) {
          if (!el.classList.contains('split-in') && inViewport(el)) el.classList.add('split-in');
        });
      }, { passive: true });
    }
  }

  function wrapWords(node) {
    Array.prototype.slice.call(node.childNodes).forEach(function (child) {
      if (child.nodeType === 3) {
        var text = child.textContent;
        if (!text || !text.trim()) return;
        var frag = document.createDocumentFragment();
        text.split(/[\s]+/).forEach(function (word) {
          if (!word) return;
          var outer = document.createElement('span');
          outer.className = 'sw';
          var inner = document.createElement('span');
          inner.className = 'sw-inner';
          inner.textContent = word;
          outer.appendChild(inner);
          frag.appendChild(outer);
          frag.appendChild(document.createTextNode('\u0020'));
        });
        frag.removeChild(frag.lastChild);
        child.parentNode.replaceChild(frag, child);
      } else if (child.nodeType === 1 && child.classList && !child.classList.contains('sw')) {
        wrapWords(child);
      }
    });
  }

  /* ------------------------- count-up [data-count] ---------------------- */
  function initCountUp() {
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
    var started = [];
    if (!els.length) return;

    function format(el, value) {
      var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      if (!isFinite(value)) value = 0;
      var s = value.toFixed(dec);
      var parts = s.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return prefix + parts.join('.') + suffix;
    }

    els.forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      if (!rm && isFinite(target)) {
        var duration = 1600;
        var begin = null;
        var done = false;
        function start() {
          if (done) return;
          done = true;
          el.textContent = format(el, 0);
          function tick(now) {
            if (begin === null) begin = now;
            var p = Math.min((now - begin) / duration, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = format(el, target * eased);
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
        started.push({ el: el, start: start });
        observeOnce(el, start);
      } else {
        el.textContent = format(el, isFinite(target) ? target : 0);
      }
    });

    if (typeof IntersectionObserver === 'undefined') {
      window.addEventListener('scroll', function () {
        started.forEach(function (s) {
          if (!s.el.getAttribute('data-counted') && inViewport(s.el)) {
            s.el.setAttribute('data-counted', '1');
            s.start();
          }
        });
      }, { passive: true });
    }
  }

  /* ------------------------------ marquee ------------------------------- */
  function initMarquee() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-marquee]'), function (m) {
      var track = m.querySelector(':scope > .marquee-track');
      if (!track) return;
      /* If the HTML already ships two groups (no-JS fallback), leave it alone. */
      var groups = track.querySelectorAll(':scope > .marquee-group');
      if (groups.length >= 2 || m._marq) return;
      m._marq = true;
      var clone = groups[0].cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  }

  /* --------------------------- cursor spotlight ------------------------- */
  function initSpotlight() {
    /* Intentionally disabled. framer.com has no mouse-tracked --mx/--my
       spotlight on cards, so per the measured recipe we ship none. */
  }

  /* ------------------------- magnetic hover -------------------------- */
  function initMagnetic() {
    /* Intentionally disabled. framer.com buttons do not move on hover, so
       per the measured recipe (hover identical to resting) we ship none. */
  }

  /* ------------------------------- init -------------------------------- */
  function init() {
    initLenis();
    initReveals();
    initSplit();
    initCountUp();
    initMarquee();
    initSpotlight();
    initMagnetic();
    initChrome();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();