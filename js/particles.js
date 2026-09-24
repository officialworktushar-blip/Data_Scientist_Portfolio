/* ================================================
   PARTICLE CANVAS ANIMATION
   ================================================ */
(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: -999, y: -999 };
  const COUNT = 80;
  const COLORS = ['#6C63FF', '#00D4AA', '#FF6B6B'];

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
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 80) {
      this.x += dx / dist * 1.5;
      this.y += dy / dist * 1.5;
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
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 120) * 0.12;
          ctx.strokeStyle = '#6C63FF';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < COUNT; i++) {
      const p = new Particle();
      particles.push(p);
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  init();
  loop();
})();
