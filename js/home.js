/* ================================================
   HOME.JS — Home page interactions
   ================================================ */

/* ---- Testimonials Slider ---- */
(function initTestimonialSlider() {
  const track = document.getElementById('testimonial-track');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const dotsContainer = document.getElementById('slider-dots');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const total = cards.length;
  const perView = window.innerWidth < 640 ? 1 : 2;
  let current = 0;
  let maxIndex = Math.ceil(total / perView) - 1;
  let autoTimer;

  // Create dots
  for (let i = 0; i <= maxIndex; i++) {
    const dot = document.createElement('div');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }

  function getCardWidth() {
    return cards[0].getBoundingClientRect().width + 24;
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, maxIndex));
    const offset = current * getCardWidth() * perView;
    track.style.transform = `translateX(-${offset}px)`;
    dotsContainer.querySelectorAll('.slider-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn && prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn && nextBtn.addEventListener('click', () => { goTo(current + 1 > maxIndex ? 0 : current + 1); resetAuto(); });

  function autoPlay() {
    autoTimer = setInterval(() => {
      goTo(current + 1 > maxIndex ? 0 : current + 1);
    }, 5000);
  }
  function resetAuto() { clearInterval(autoTimer); autoPlay(); }
  autoPlay();

  window.addEventListener('resize', () => {
    const newPerView = window.innerWidth < 640 ? 1 : 2;
    maxIndex = Math.ceil(total / newPerView) - 1;
    current = Math.min(current, maxIndex);
    goTo(current);
  });
})();

/* ---- GSAP Hero Parallax handled by assets/js/motion.js ---- */

/* ---- Typing Effect on Hero ---- */
(function initTyping() {
  const typingEl = document.getElementById('typing-text');
  if (!typingEl) return;
  const words = ['Machine Learning', 'Deep Learning', 'Generative AI', 'MLOps', 'Big Data'];
  let wi = 0, ci = 0, deleting = false;

  function type() {
    const word = words[wi];
    if (!deleting) {
      typingEl.textContent = word.substring(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(type, 1500); return; }
    } else {
      typingEl.textContent = word.substring(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(type, deleting ? 60 : 100);
  }
  type();
})();
