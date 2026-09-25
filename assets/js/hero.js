/* ==========================================================================
   HERO.JS — Premium hero layer (index.html only)
   - Canvas constellation: ~60 drifting nodes + edges, gentle mouse repulsion.
     Pauses when the hero leaves the viewport or the tab is hidden; draws a
     single static frame under prefers-reduced-motion.
   - Rotating headline word: crossfades through [data-words] every 3s. A
     fixed min-width keeps the headline from reflowing (no layout shift).
     Static (first word) under reduced motion.
   - Terminal card: types a Python training session, then loops. Static full
     text under reduced motion.
   - Floating badges: gentle parallax with per-badge depth. Disabled under
     reduced motion and on touch devices.
   ========================================================================== */
(function () {
  'use strict';

  if (!document.documentElement.classList.contains('js')) return;

  var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hero = document.getElementById('hero');
  if (!hero) return;

  /* ============================ 1. Constellation ========================= */
  function initCanvas() {
    var canvas = document.getElementById('hero-canvas');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var w = 0, h = 0, nodes = [], raf = null;
    var running = true;
    var mouse = { x: -9999, y: -9999, in: false };
    var N_MAX = 60;

    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var r = hero.getBoundingClientRect();
      w = Math.max(r.width, 320);
      h = Math.max(r.height, 480);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn() {
      var n = Math.max(26, Math.min(N_MAX, Math.round(w * h / 18000)));
      nodes = [];
      for (var i = 0; i < n; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.34,
          vy: (Math.random() - 0.5) * 0.34,
          r: 1.2 + Math.random() * 1.6,
          indigo: Math.random() < 0.68,
          tw: Math.random() * Math.PI * 2
        });
      }
    }

    function step() {
      var i, d2, d, f, sp;
      for (i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.tw += 0.012;
        n.vx += Math.sin(n.tw) * 0.0045;
        n.vy += Math.cos(n.tw * 1.3) * 0.0045;
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -24) n.x = w + 24; else if (n.x > w + 24) n.x = -24;
        if (n.y < -24) n.y = h + 24; else if (n.y > h + 24) n.y = -24;
        if (mouse.in) {
          var dx = n.x - mouse.x, dy = n.y - mouse.y;
          d2 = dx * dx + dy * dy;
          if (d2 < 19600 && d2 > 0.5) {
            d = Math.sqrt(d2);
            f = (1 - d / 140) * 0.04;
            n.vx += (dx / d) * f;
            n.vy += (dy / d) * f;
          }
        }
        sp = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (sp > 1.1) { n.vx = n.vx / sp * 1.1; n.vy = n.vy / sp * 1.1; }
      }
    }

    function draw() {
      var i, j;
      ctx.clearRect(0, 0, w, h);
      for (i = 0; i < nodes.length; i++) {
        for (j = i + 1; j < nodes.length; j++) {
          var a = nodes[i], b = nodes[j];
          var dx = a.x - b.x, dy = a.y - b.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < 16900) {
            ctx.strokeStyle = (a.indigo === b.indigo) ? '#3B82F6' : '#60A5FA';
            ctx.globalAlpha = (1 - Math.sqrt(d2) / 130) * 0.22;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      for (i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        var col = n.indigo ? '59, 130, 246' : '96, 165, 250';
        var glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
        glow.addColorStop(0, 'rgba(' + col + ', 0.5)');
        glow.addColorStop(1, 'rgba(' + col + ', 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 5, 0, 6.2832);
        ctx.fill();
        ctx.fillStyle = 'rgba(' + col + ', 0.9)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, 6.2832);
        ctx.fill();
      }
    }

    function frame() {
      if (running && !document.hidden) { step(); draw(); }
      raf = requestAnimationFrame(frame);
    }

    size();
    spawn();

    if (rm) {
      draw();
      return;
    }

    if (typeof IntersectionObserver !== 'undefined') {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { running = en.isIntersecting; });
      }, { threshold: 0.05 }).observe(hero);
    }
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.in = true;
    }, { passive: true });
    hero.addEventListener('pointerleave', function () { mouse.in = false; }, { passive: true });
    window.addEventListener('resize', function () {
      size();
      if (!running) draw();
    }, { passive: true });
    /* hero height can change when the webfonts finish loading; keep the
       canvas glued to it so nothing spills past the section */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        if (!document.hidden) { size(); draw(); }
      }).catch(function () {});
    }

    raf = requestAnimationFrame(frame);
  }

  /* ========================= 2. Rotating headline word ================== */
  function initRotate() {
    var el = hero.querySelector('.rotate-word');
    if (!el) return;
    var words;
    try { words = el.getAttribute('data-words').split('|'); } catch (e) { return; }
    if (!words || words.length < 2) return;
    if (rm) return; /* reduced motion keeps the initial word */

    var inner = el.querySelector('.sw-inner') || el;
    var sw = el.querySelector('.sw') || el;
    var longest = words.slice().sort(function (a, b) { return b.length - a.length; })[0];

    function measure() {
      var cs = getComputedStyle(inner);
      var probe = document.createElement('span');
      probe.textContent = longest;
      probe.style.cssText = [
        'position:absolute;visibility:hidden;white-space:nowrap;',
        'font-family:' + cs.fontFamily + ';',
        'font-size:' + cs.fontSize + ';',
        'font-weight:' + cs.fontWeight + ';',
        'letter-spacing:' + cs.letterSpacing
      ].join('');
      document.body.appendChild(probe);
      var wpx = probe.getBoundingClientRect().width;
      document.body.removeChild(probe);
      sw.style.minWidth = Math.ceil(wpx) + 'px';
    }
    measure();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { if (!document.hidden) measure(); }).catch(function () {});
    }

    var idx = 0;
    function swap() {
      if (document.hidden || !el.offsetParent) return;
      idx = (idx + 1) % words.length;
      var next = words[idx];
      el.classList.add('is-swapping');
      setTimeout(function () {
        inner.textContent = next;
        el.classList.remove('is-swapping');
      }, 280);
    }

    var visible = false;
    if (typeof IntersectionObserver !== 'undefined') {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          visible = en.isIntersecting;
          el.setAttribute('aria-label', words.join('/'));
        });
      }, { threshold: 0.3 }).observe(el);
    } else {
      visible = true;
    }
    /* wait for the split reveal to finish, then start rotating */
    setTimeout(function () {
      setInterval(function () { if (visible && !document.hidden) swap(); }, 3000);
    }, 1600);
  }

  /* ============================== 3. Terminal ============================ */
  function initTerminal() {
    var pre = document.getElementById('terminal-content');
    if (!pre) return;
    var SCRIPT = [
      { cls: 'tl-cmd', txt: '$ python train.py', cmd: true },
      { cls: 'tl-cmd', txt: '>>> model.fit(X_train, y_train)', cmd: true },
      { cls: 'tl-out', txt: 'AUC: 0.94  [████████░░] 96.2%' },
      { cls: 'tl-out', txt: 'model saved → s3://models/churn-v3' },
      { cls: 'tl-ok', txt: '✓ deployed to production' }
    ];

    function line(text, cls) {
      var d = document.createElement('div');
      d.className = cls;
      d.textContent = text;
      return d;
    }
    function cursor() {
      var c = document.createElement('span');
      c.className = 'term-cursor';
      c.setAttribute('aria-hidden', 'true');
      c.textContent = '\u258D';
      return c;
    }

    if (rm) {
      /* the markup already ships the full static transcript + cursor */
      return;
    }

    var token = 0;
    var active = false;
    function delay(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
    function typeInto(el, text, t) {
      return new Promise(function (res) {
        var pos = 0;
        (function tick() {
          if (t !== token) { res(); return; }
          pos++;
          el.textContent = text.slice(0, pos) + '\u258D';
          if (pos < text.length) setTimeout(tick, 24 + Math.random() * 26);
          else { el.textContent = text; res(); }
        })();
      });
    }

    async function run(t) {
      while (t === token) {
        pre.innerHTML = '';
        for (var i = 0; i < SCRIPT.length; i++) {
          if (t !== token) return;
          var L = SCRIPT[i];
          var d = line('', L.cls);
          pre.appendChild(d);
          if (L.cmd) {
            await typeInto(d, L.txt, t);
            if (t !== token) return;
            await delay(380);
          } else {
            d.textContent = L.txt;
            await delay(160);
          }
          if (t !== token) return;
        }
        pre.appendChild(cursor());
        window.__termRuns = (window.__termRuns || 0) + 1;
        await delay(2600);
        if (t !== token) return;
        pre.querySelector('.term-cursor') && pre.removeChild(pre.querySelector('.term-cursor'));
      }
    }

    if (typeof IntersectionObserver !== 'undefined') {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && !active) { active = true; run(++token); }
          else if (!en.isIntersecting) { token++; active = false; }
        });
      }, { threshold: 0.2 }).observe(pre);
    } else {
      active = true;
      run(++token);
    }
  }

  /* ========================= 4. Badge parallax =========================== */
  function initParallax() {
    if (rm) return;
    var wraps = Array.prototype.slice.call(hero.querySelectorAll('.badge-pos'));
    if (!wraps.length) return;

    var moveRaf = null;
    function onMove(e) {
      if (moveRaf) return;
      var r = hero.getBoundingClientRect();
      var nx = (e.clientX - r.left) / r.width - 0.5;
      var ny = (e.clientY - r.top) / r.height - 0.5;
      moveRaf = requestAnimationFrame(function () {
        wraps.forEach(function (wd) {
          var d = parseFloat(wd.getAttribute('data-depth') || '1');
          wd.style.transform = 'translate(' + (nx * 34 * d).toFixed(1) + 'px, ' + (ny * 22 * d).toFixed(1) + 'px)';
        });
        moveRaf = null;
      });
    }
    function onLeave() {
      if (moveRaf) { cancelAnimationFrame(moveRaf); moveRaf = null; }
      wraps.forEach(function (wd) { wd.style.transform = ''; });
    }
    hero.addEventListener('pointermove', onMove, { passive: true });
    hero.addEventListener('pointerleave', onLeave, { passive: true });
  }

  /* ================================ init ================================ */
  initCanvas();
  initRotate();
  initTerminal();
  initParallax();
})();