/* ================================================
   PARTICLE CANVAS ANIMATION
   ================================================ */
(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Respect prefers-reduced-motion: render one static frame, no animation loop.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W, H, particles = [], mouse = { x: -999, y: -999 };
  const COUNT = reduceMotion ? 40 : 42;
  const COLORS = ['#3B82F6', '#60A5FA', '#2563EB'];
  const LINK_DIST = 120;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rnd(min, max) { return Math.random() * (max - min) + min; }

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function () {
    this.x = rnd(0, W);
    this.y = rnd(0, H);
    this.r = rnd(1, 2.5);
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.alpha = rnd(0.1, 0.4);
    this.vx = rnd(-0.3, 0.3);
    this.vy = rnd(-0.3, 0.3);
    this.life = rnd(200, 600);
    this.maxLife = this.life;
  };
  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    if (this.life <= 0 || this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    // mouse repel
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const d2 = dx * dx + dy * dy;
    if (d2 < 6400 && d2 > 0) {
      const inv = 1 / Math.sqrt(d2);
      this.x += dx * inv * 1.5;
      this.y += dy * inv * 1.5;
    }
  };
  Particle.prototype.draw = function () {
    const progress = this.life / this.maxLife;
    ctx.save();
    ctx.globalAlpha = this.alpha * Math.min(progress * 3, 1);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  function drawLines() {
    ctx.save();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = '#3B82F6';
    const n = particles.length;
    for (let i = 0; i < n; i++) {
      const px = particles[i].x;
      const py = particles[i].y;
      for (let j = i + 1; j < n; j++) {
        const dx = px - particles[j].x;
        const dy = py - particles[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < LINK_DIST * LINK_DIST) {
          const d = Math.sqrt(d2);
          ctx.globalAlpha = (1 - d / LINK_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < COUNT; i++) {
      particles.push(new Particle());
    }
  }

  let rafId = null;
  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    particles.forEach(p => { p.update(); p.draw(); });
    if (!reduceMotion && !document.hidden) rafId = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  document.addEventListener('visibilitychange', () => {
    if (reduceMotion) return;
    cancelAnimationFrame(rafId);
    if (!document.hidden) rafId = requestAnimationFrame(loop);
  });

  init();
  loop();
})();