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

/* ---- Navbar Scroll (handled by assets/js/motion.js) ---- */

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

/* ---- Scroll-Reveal + Counters handled by assets/js/motion.js ---- */

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
