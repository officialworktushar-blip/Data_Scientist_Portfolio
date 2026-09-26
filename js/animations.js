/* ================================================
   ANIMATIONS.JS — All creative interactive effects
   ================================================ */

(function () {
  'use strict';

  /* ============================================================
     1. LOADING SCREEN
  ============================================================ */
  function initLoader() {
    // Build loader DOM
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.innerHTML = `
      <canvas id="loader-canvas" width="120" height="120"></canvas>
      <div class="loader-logo">ALEX MORGAN</div>
      <div class="loader-bar-track"><div class="loader-bar-fill" id="loader-bar"></div></div>
      <div class="loader-pct" id="loader-pct">0%</div>
    `;
    document.body.prepend(loader);

    // Draw spinning data-viz ring on canvas
    const canvas = document.getElementById('loader-canvas');
    const ctx = canvas.getContext('2d');
    let angle = 0;
    const bars = [0.9, 0.6, 0.8, 0.4, 0.95, 0.5, 0.75, 0.65];
    function drawLoaderRing() {
      ctx.clearRect(0, 0, 120, 120);
      const cx = 60, cy = 60;
      bars.forEach((val, i) => {
        const a = (i / bars.length) * Math.PI * 2 + angle;
        const innerR = 30, outerR = innerR + val * 25;
        ctx.beginPath();
        ctx.strokeStyle = `hsl(${250 + i * 15}, 80%, ${50 + val * 20}%)`;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.moveTo(cx + innerR * Math.cos(a), cy + innerR * Math.sin(a));
        ctx.lineTo(cx + outerR * Math.cos(a), cy + outerR * Math.sin(a));
        ctx.stroke();
      });
      angle += 0.04;
      if (loader && !loader.classList.contains('hide')) requestAnimationFrame(drawLoaderRing);
    }
    drawLoaderRing();

    // Animate progress bar
    const bar = document.getElementById('loader-bar');
    const pct = document.getElementById('loader-pct');
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 12 + 3;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          loader.classList.add('hide');
          setTimeout(() => loader.remove(), 700);
        }, 300);
      }
      bar.style.width = progress + '%';
      pct.textContent = Math.floor(progress) + '%';
    }, 80);
  }

  /* ============================================================
     2. SCROLL PROGRESS BAR
  ============================================================ */
  function initScrollProgress() {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    document.body.prepend(bar);
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (scrolled / total * 100) + '%';
    }, { passive: true });
  }

  /* ============================================================
     3. SPOTLIGHT CURSOR
  ============================================================ */
  function initSpotlight() {
    const spot = document.createElement('div');
    spot.id = 'spotlight';
    document.body.appendChild(spot);
    let tx = 0, ty = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    function animate() {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      spot.style.left = cx + 'px';
      spot.style.top = cy + 'px';
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ============================================================
     4. MORPHING BLOBS (Hero background)
  ============================================================ */
  function initBlobs() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    hero.style.position = 'relative';
    const wrap = document.createElement('div');
    wrap.className = 'blob-container';
    wrap.innerHTML = `
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    `;
    hero.insertBefore(wrap, hero.firstChild);
  }

  /* ============================================================
     5. MAGNETIC BUTTONS
  ============================================================ */
  function initMagneticButtons() {
    document.querySelectorAll('.btn-primary, .btn-outline, .btn-white, .nav-cta').forEach(btn => {
      btn.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        this.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      });
      btn.addEventListener('mouseleave', function () {
        this.style.transform = 'translate(0, 0)';
        this.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
        setTimeout(() => { this.style.transition = ''; }, 500);
      });
    });
  }

  /* ============================================================
     6. 3D CARD TILT on hover
  ============================================================ */
  function initTiltCards() {
    const selectors = [
      '.expertise-card', '.project-card', '.project-full-card',
      '.stat-card', '.cert-card', '.testimonial-card',
      '.tool-category', '.learning-card', '.avail-card',
      '.contact-card', '.github-stat'
    ].join(',');

    document.querySelectorAll(selectors).forEach(card => {
      card.classList.add('tilt-card');

      // Add shine element
      const shine = document.createElement('div');
      shine.className = 'tilt-shine';
      card.style.position = 'relative';
      card.appendChild(shine);

      card.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotX = (y - 0.5) * -12;
        const rotY = (x - 0.5) * 12;
        this.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;
        // Update shine position
        shine.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.1) 0%, transparent 65%)`;
        shine.style.opacity = '1';
      });
      card.addEventListener('mouseleave', function () {
        this.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
        this.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
        shine.style.opacity = '0';
        setTimeout(() => { this.style.transition = ''; }, 500);
      });
    });
  }

  /* ============================================================
     7. TEXT SCRAMBLE on Hero title
  ============================================================ */
  function initTextScramble() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
    function scramble(el, finalText, duration = 1000) {
      let frame = 0;
      const totalFrames = Math.ceil(duration / 40);
      const interval = setInterval(() => {
        el.textContent = finalText.split('').map((char, i) => {
          if (char === ' ') return ' ';
          if (frame / totalFrames > i / finalText.length) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('');
        frame++;
        if (frame >= totalFrames) {
          el.textContent = finalText;
          clearInterval(interval);
        }
      }, 40);
    }

    // Apply to hero badge after a delay
    const badge = document.querySelector('.hero-badge span:last-child');
    if (badge) {
      const orig = badge.textContent;
      setTimeout(() => scramble(badge, orig, 1200), 800);
    }
  }

  /* ============================================================
     8. TYPEWRITER EFFECT — Hero subtitle keyword
  ============================================================ */
  function initTypewriter() {
    const sub = document.querySelector('.hero-sub');
    if (!sub) return;
    // Wrap the word "insights" in a typewriter span
    const words = ['Machine Learning', 'Deep Learning', 'Generative AI', 'Predictive Analytics', 'MLOps', 'Big Data'];
    const wrap = document.createElement('span');
    wrap.innerHTML = `<span id="typewriter-wrap"></span><span class="typewriter-cursor"></span>`;

    const pArgs = sub.innerHTML;
    // Insert typewriter after first sentence ends
    if (!document.getElementById('typewriter-wrap')) {
      const p2 = sub.querySelector ? sub : sub;
      const injectTarget = document.querySelector('.hero-sub');
      if (injectTarget) {
        const tw = document.createElement('div');
        tw.style.marginTop = '8px';
        tw.style.fontSize = '16px';
        tw.style.color = 'var(--text-muted)';
        tw.innerHTML = `Specializing in: <span id="typewriter-wrap" style="color:var(--secondary);font-weight:700;"></span><span class="typewriter-cursor"></span>`;
        injectTarget.after(tw);
      }
    }

    const twEl = document.getElementById('typewriter-wrap');
    if (!twEl) return;
    let wi = 0, ci = 0, deleting = false;
    function type() {
      const word = words[wi];
      if (!deleting) {
        twEl.textContent = word.substring(0, ++ci);
        if (ci === word.length) {
          deleting = true;
          setTimeout(type, 1800);
          return;
        }
      } else {
        twEl.textContent = word.substring(0, --ci);
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
        }
      }
      setTimeout(type, deleting ? 55 : 90);
    }
    setTimeout(type, 1400);
  }

  /* ============================================================
     9. FLOATING DATA CHIPS in Hero
  ============================================================ */
  function initDataChips() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const labels = [
      'accuracy=0.97', 'n_estimators=500', 'def train_model()',
      'loss: 0.0023', 'R² = 0.94', 'epochs=100',
      'precision=0.99', 'GPU: A100', 'pd.DataFrame()',
      'SHAP values', 'AUC: 0.96', 'batch_size=32',
      'torch.cuda', 'f1_score=0.93', 'lr=0.001',
    ];
    const wrap = document.createElement('div');
    wrap.className = 'data-chips';
    hero.insertBefore(wrap, hero.firstChild);

    function spawnChip() {
      const chip = document.createElement('div');
      chip.className = 'data-chip';
      chip.textContent = labels[Math.floor(Math.random() * labels.length)];
      const left = Math.random() * 100;
      const dur = 8 + Math.random() * 10;
      chip.style.cssText = `left:${left}%;bottom:-40px;animation-duration:${dur}s;animation-delay:0s;`;
      wrap.appendChild(chip);
      setTimeout(() => chip.remove(), dur * 1000);
    }
    setInterval(spawnChip, 1200);
    spawnChip(); spawnChip(); spawnChip();
  }

  /* ============================================================
     10. ORBITING DOTS on Avatar Ring
  ============================================================ */
  function initOrbitingDots() {
    const ring = document.querySelector('.avatar-ring');
    if (!ring) return;
    const dots = [
      { cls: 'orbit-dot',   r: 140, speed: 0.015, startAngle: 0 },
      { cls: 'orbit-dot orbit-dot-2', r: 165, speed: -0.01, startAngle: Math.PI },
      { cls: 'orbit-dot orbit-dot-3', r: 188, speed: 0.008, startAngle: Math.PI / 2 },
    ];
    const elems = dots.map(d => {
      const el = document.createElement('div');
      el.className = d.cls;
      ring.appendChild(el);
      return el;
    });
    let angles = dots.map(d => d.startAngle);
    function animate() {
      dots.forEach((d, i) => {
        angles[i] += d.speed;
        const cx = 200 + d.r * Math.cos(angles[i]);
        const cy = 200 + d.r * Math.sin(angles[i]);
        elems[i].style.left = cx + 'px';
        elems[i].style.top = cy + 'px';
        elems[i].style.transform = 'translate(-50%,-50%)';
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ============================================================
     11. GLITCH on gradient-text in hero
  ============================================================ */
  function initGlitch() {
    const el = document.querySelector('.hero-title .gradient-text');
    if (!el) return;
    el.classList.add('glitch');
    el.setAttribute('data-text', el.textContent);
  }

  /* ============================================================
     12. SECTION TITLE WORD REVEAL
  ============================================================ */
  function initTitleReveal() {
    document.querySelectorAll('.section-title').forEach(title => {
      const html = title.innerHTML;
      // Wrap each word
      title.innerHTML = title.innerHTML.replace(/([^<>\s]+)/g, word => {
        return `<span class="word"><span>${word}</span></span>`;
      });

      const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed');
            // Stagger
            e.target.querySelectorAll('.word span').forEach((span, i) => {
              span.style.transitionDelay = (i * 0.06) + 's';
            });
            observer.unobserve(e.target);
          }
        });
      }, { threshold: 0.3 });
      observer.observe(title);
    });
  }

  /* ============================================================
     13. PAGE TRANSITION OVERLAY
  ============================================================ */
  function initPageTransition() {
    const overlay = document.createElement('div');
    overlay.id = 'page-transition';
    document.body.appendChild(overlay);

    // Leave animation on internal link click
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('http')) return;
      link.addEventListener('click', function (e) {
        e.preventDefault();
        overlay.className = 'enter';
        setTimeout(() => {
          window.location.href = href;
        }, 480);
      });
    });

    // Enter (leave) animation on page load
    overlay.className = 'leave';
    setTimeout(() => { overlay.className = ''; }, 600);
  }

  /* ============================================================
     14. COUNTER ENHANCED — EaseOutExpo
  ============================================================ */
  function initEnhancedCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;
    let triggered = false;

    function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }

    function animate(el, target, duration = 2200) {
      const start = performance.now();
      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutExpo(progress);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    }

    function checkStart() {
      if (triggered) return;
      const section = document.querySelector('.stats-section');
      if (!section) return;
      if (section.getBoundingClientRect().top < window.innerHeight * 0.9) {
        triggered = true;
        counters.forEach(c => animate(c, +c.dataset.target));
      }
    }
    window.addEventListener('scroll', checkStart, { passive: true });
    checkStart();
  }

  /* ============================================================
     15. MATRIX RAIN on Skills/Stats BG (subtle)
  ============================================================ */
  function initMatrixRain() {
    const section = document.querySelector('.stats-section') || document.querySelector('.radar-section');
    if (!section) return;
    section.style.position = 'relative';
    const wrap = document.createElement('div');
    wrap.className = 'matrix-canvas-wrap';
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    wrap.appendChild(canvas);
    section.insertBefore(wrap, section.firstChild);

    function resizeCanvas() {
      canvas.width = section.offsetWidth;
      canvas.height = section.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const ctx = canvas.getContext('2d');
    const chars = '01アイウエオカキクケコサシスセソタチツテト0101';
    const fontSize = 14;
    let cols = Math.floor(canvas.width / fontSize);
    let drops = Array(cols).fill(1);

    setInterval(() => {
      cols = Math.floor(canvas.width / fontSize);
      if (drops.length !== cols) drops = Array(cols).fill(1);
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0099FF';
      ctx.font = fontSize + 'px monospace';
      drops.forEach((y, x) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, x * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[x] = 0;
        drops[x]++;
      });
    }, 55);
  }

  /* ============================================================
     16. SKILL BAR PARTICLE BURST on complete
  ============================================================ */
  function initSkillBarBurst() {
    document.querySelectorAll('.skill-bar-fill').forEach(bar => {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const pct = bar.dataset.pct;
            setTimeout(() => {
              bar.style.width = pct + '%';
              // Glow effect on bar complete
              setTimeout(() => {
                bar.style.boxShadow = '0 0 15px rgba(0,153,255,0.7)';
                setTimeout(() => { bar.style.boxShadow = ''; }, 800);
              }, 1500);
            }, 300);
            observer.unobserve(e.target);
          }
        });
      }, { threshold: 0.5 });
      observer.observe(bar);
    });
  }

  /* ============================================================
     INIT ALL
  ============================================================ */
  function init() {
    initLoader();
    initScrollProgress();
    initSpotlight();
    initBlobs();
    initMagneticButtons();
    initTiltCards();
    initTextScramble();
    initTypewriter();
    initDataChips();
    initOrbitingDots();
    initGlitch();
    initTitleReveal();
    initPageTransition();
    initEnhancedCounters();
    initMatrixRain();
    initSkillBarBurst();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
