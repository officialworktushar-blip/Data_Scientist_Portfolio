/* ================================================
   MAIN.JS — Shared across all pages
   ================================================ */

/* ---- Custom Cursor ---- */
(function initCursor() {
  const outer = document.querySelector('.cursor-outer');
  const inner = document.querySelector('.cursor-inner');
  if (!outer || !inner) return;

  let mx = 0, my = 0, ox = 0, oy = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    inner.style.left = mx + 'px';
    inner.style.top = my + 'px';
    inner.style.opacity = 1;
    outer.style.opacity = 1;
  });

  function lerp(a, b, t) { return a + (b - a) * t; }
  function animateCursor() {
    ox = lerp(ox, mx, 0.12);
    oy = lerp(oy, my, 0.12);
    outer.style.left = ox + 'px';
    outer.style.top = oy + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .expertise-card, .stat-card, .project-card, .testimonial-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      outer.style.transform = 'translate(-50%,-50%) scale(1.8)';
      outer.style.borderColor = 'var(--secondary)';
    });
    el.addEventListener('mouseleave', () => {
      outer.style.transform = 'translate(-50%,-50%) scale(1)';
      outer.style.borderColor = 'var(--primary)';
    });
  });
})();

/* ---- Navbar Scroll ---- */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
})();

/* ---- Hamburger Mobile Menu ---- */
(function initHamburger() {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (!btn || !links) return;
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      links.classList.remove('open');
    });
  });
})();

/* ---- Scroll-Reveal (AOS-like) ---- */
(function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  if (!els.length) return;

  function applyDelay(el) {
    const delay = el.dataset.aosDelay;
    if (delay) el.style.transitionDelay = delay + 'ms';
  }

  function checkReveal() {
    const winH = window.innerHeight;
    els.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < winH * 0.92) {
        el.classList.add('aos-animate');
      }
    });
  }

  els.forEach(applyDelay);
  window.addEventListener('scroll', checkReveal, { passive: true });
  checkReveal();
})();

/* ---- Counter Animation ---- */
(function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  let triggered = false;
  function startCounters() {
    if (triggered) return;
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;
    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      triggered = true;
      counters.forEach(c => {
        const target = +c.dataset.target;
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          c.textContent = Math.floor(current);
        }, 16);
      });
    }
  }
  window.addEventListener('scroll', startCounters, { passive: true });
  startCounters();
})();

/* ---- Active Nav Link ---- */
(function setActiveNav() {
  const links = document.querySelectorAll('.nav-link');
  const current = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === current || (current === '' && href === 'index.html'));
  });
})();

/* ---- Download Resume Stub ---- */
function downloadResume() {
  alert('Resume download will be available soon! Contact me directly for a copy.');
}
