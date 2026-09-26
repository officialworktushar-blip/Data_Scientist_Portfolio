/* ------------------------------------------------------------------ *
 *  sections.js — renders the config-driven sections defined in
 *  content.js into <section data-section="..."> mount points and wires
 *  their scroll-driven behavior.
 *
 *  IMPORTANT: must load BEFORE assets/js/motion.js so that injected
 *  [data-reveal] / [data-count] / [data-marquee] elements are picked
 *  up by motion.js init at load time.
 * ------------------------------------------------------------------ */
(function () {
  'use strict';

  var SITE = window.SITE;
  if (!SITE) return;

  var root = document.documentElement;
  var rm = root.classList.contains('reduce-motion');
  var hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  var wide = window.matchMedia && window.matchMedia('(min-width: 768px)').matches;
  if (hasGSAP) window.gsap.registerPlugin(window.ScrollTrigger);

  var text = {
    badge: 'section-badge',
    title: 'section-title',
    desc: 'section-desc'
  };

  function headerHtml(cfg) {
    return '<div class="section-header" data-reveal="up">'
      + '<div class="' + text.badge + '">' + cfg.badge + '</div>'
      + '<h2 class="' + text.title + '">' + cfg.title + '</h2>'
      + '<p class="' + text.desc + '">' + cfg.desc + '</p></div>';
  }

  /* Format a number exactly like motion.js count-up so count-ok matches. */
  function numFmt(value, decimals, prefix, suffix) {
    var n = Number(value);
    if (!isFinite(n)) n = 0;
    var s = n.toFixed(decimals || 0);
    var parts = s.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (prefix || '') + parts.join('.') + (suffix || '');
  }

  /* ------------------------------ timeline ----------------------------- */
  function renderTimeline(mount) {
    var t = SITE.timeline;
    var eras = [];
    for (var i = 0; i < t.eras.length; i++) {
      var e = t.eras[i];
      eras.push(
        '<article class="js-era" role="listitem">'
          + '<div class="js-era-left"><span class="js-era-year">' + e.year + '</span>'
          + '<span class="js-era-role">' + e.role + '</span></div>'
          + '<div class="js-era-dot" aria-hidden="true"></div>'
          + '<div class="js-era-right">'
          + '<span class="js-era-kicker">What I built</span>'
          + '<p class="js-era-built">' + e.built + '</p>'
          + '<span class="js-era-kicker">Impact</span>'
          + '<p class="js-era-impact">' + e.impact + '</p>'
          + '<div class="js-era-metric"><span class="js-era-metric-val">' + e.metric + '</span>'
          + '<span class="js-era-metric-label">' + e.metricLabel + '</span></div>'
          + '</div></article>'
      );
    }
    mount.innerHTML = '<div class="section-container">' + headerHtml(t)
      + '<div class="js-timeline" role="list">'
      + '<div class="js-timeline-rail" aria-hidden="true"><div class="js-timeline-fill"></div></div>'
      + '<div class="js-timeline-stage">' + eras.join('') + '</div>'
      + '</div></div>';

    if (rm || !hasGSAP || !wide) return;

    var timeline = mount.querySelector('.js-timeline');
    var stage = mount.querySelector('.js-timeline-stage');
    var fill = mount.querySelector('.js-timeline-fill');
    var eraEls = Array.prototype.slice.call(mount.querySelectorAll('.js-era'));

    timeline.classList.add('sg-pinned');
    var tl = window.gsap.timeline({
      scrollTrigger: {
        trigger: timeline,
        start: 'top top',
        end: '+=700%',
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });
    tl.fromTo(fill, { scaleY: 0 }, { scaleY: 1, ease: 'none', duration: 1 }, 0);
    window.gsap.set(eraEls, { opacity: 0, y: 28 });
    window.gsap.set(eraEls[0], { opacity: 1, y: 0 });
    for (var j = 1; j < eraEls.length; j++) {
      var at = j / eraEls.length;
      tl.to(eraEls[j], { opacity: 1, y: 0, duration: 0.22 }, at);
      tl.to(eraEls[j - 1], { opacity: 0, y: -24, duration: 0.22 }, Math.min(at + 0.12, 1));
    }
  }

  /* ------------------------------- process ----------------------------- */
  function renderProcess(mount) {
    var p = SITE.process;
    var steps = [];
    for (var i = 0; i < p.steps.length; i++) {
      var s = p.steps[i];
      steps.push(
        '<li class="js-process-step" data-reveal="up">'
          + '<span class="js-step-num">' + s.num + '</span>'
          + '<div class="js-step-body"><h3>' + s.title + '</h3><p>' + s.desc + '</p></div>'
          + '</li>'
      );
    }
    mount.innerHTML = '<div class="section-container">' + headerHtml(p)
      + '<div class="js-process">'
      + '<div class="js-process-rail" aria-hidden="true"><div class="js-process-fill"></div></div>'
      + '<ol class="js-process-steps">' + steps.join('') + '</ol>'
      + '</div></div>';

    if (rm || !hasGSAP) return;
    var fill = mount.querySelector('.js-process-fill');
    var proc = mount.querySelector('.js-process');
    window.gsap.set(fill, { scaleY: 0, transformOrigin: 'top center' });
    window.gsap.to(fill, {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: proc, start: 'top 78%', end: 'bottom 55%', scrub: 0.6 }
    });
  }

  /* ------------------------------ projects ------------------------------ */
  function lineChart(id, data, color) {
    var min = Math.min.apply(null, data), max = Math.max.apply(null, data);
    var range = (max - min) || 1;
    var pts = [];
    for (var i = 0; i < data.length; i++) {
      var x = 6 + (i / (data.length - 1)) * 148;
      var y = 48 - ((data[i] - min) / range) * 40 + 4;
      pts.push(x.toFixed(1) + ',' + y.toFixed(1));
    }
    var line = pts.map(function (p, idx) {
      return (idx === 0 ? 'M' : 'L') + p;
    }).join(' ');
    var area = 'M6,52 L6,' + pts[0].split(',')[1]
      + ' ' + pts.map(function (p, idx) { return (idx === 0 ? 'L' : 'L') + p; }).join(' ')
      + ' L' + pts[pts.length - 1].split(',')[0] + ',52 Z';
    var last = pts[pts.length - 1].split(',');
    return '<svg class="js-chart js-chart-line" viewBox="0 0 160 56" aria-hidden="true">'
      + '<defs><linearGradient id="ln-' + id + '" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0%" stop-color="' + color + '" stop-opacity="0.35"/>'
      + '<stop offset="100%" stop-color="' + color + '" stop-opacity="0"/>'
      + '</linearGradient></defs>'
      + '<path d="' + area + '" fill="url(#ln-' + id + ')"/>'
      + '<path d="' + line + '" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
      + '<circle cx="' + last[0] + '" cy="' + last[1] + '" r="3" fill="' + color + '"/></svg>';
  }

  function barsChart(id, data, color) {
    var max = Math.max.apply(null, data) || 1;
    var slot = 150 / data.length;
    var w = slot * 0.6;
    var bars = [];
    for (var i = 0; i < data.length; i++) {
      var x = 5 + slot * i + (slot - w) / 2;
      var h = (data[i] / max) * 42 + 2;
      var y = 52 - h;
      bars.push('<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + w.toFixed(1)
        + '" height="' + h.toFixed(1) + '" rx="1.5" fill="' + color + '" opacity="0.85"/>');
    }
    return '<svg class="js-chart js-chart-bars" viewBox="0 0 160 56" aria-hidden="true">'
      + bars.join('') + '</svg>';
  }

  function renderStack(mount) {
    var p = SITE.projects;
    var cards = [];
    for (var i = 0; i < p.items.length; i++) {
      var it = p.items[i];
      var m = it.metric;
      var final = numFmt(m.value, m.decimals, m.prefix, m.suffix);
      var attrs = ' data-count="' + m.value + '"'
        + (m.decimals ? ' data-decimals="' + m.decimals + '"' : '')
        + (m.prefix ? ' data-prefix="' + m.prefix + '"' : '')
        + (m.suffix ? ' data-suffix="' + m.suffix + '"' : '');
      var chart = it.chart.type === 'bars'
        ? barsChart(it.id, it.chart.data, it.chart.color)
        : lineChart(it.id, it.chart.data, it.chart.color);
      var chips = [];
      for (var c = 0; c < it.chips.length; c++) chips.push('<span>' + it.chips[c] + '</span>');
      cards.push(
        '<article class="js-stack-card" data-project="' + it.id + '">'
          + '<div class="js-stack-top">'
          + '<span class="js-stack-cat"><i class="' + it.icon + '" aria-hidden="true"></i> ' + it.category + '</span>'
          + '<h3>' + it.title + '</h3>'
          + '<p class="js-stack-problem"><strong>Problem.</strong> ' + it.problem + '</p>'
          + '</div>'
          + '<div class="js-stack-grid">'
          + '<div class="js-stack-block"><h4>Approach</h4><p>' + it.approach + '</p></div>'
          + '<div class="js-stack-block"><h4>Result</h4><p>' + it.result + '</p></div>'
          + '</div>'
          + '<div class="js-stack-foot">'
          + '<div class="js-stack-chart">' + chart
          + '<div class="js-stack-metric"><span class="js-metric-val" ' + attrs + '>' + final + '</span>'
          + '<span class="js-metric-label">' + m.label + '</span></div></div>'
          + '<div class="js-stack-chips">' + chips.join('') + '</div>'
          + '</div>'
          + '<a class="js-stack-link" href="' + it.href + '">View case study <i class="fas fa-arrow-right" aria-hidden="true"></i></a>'
          + '</article>'
      );
    }
    mount.innerHTML = '<div class="section-container">' + headerHtml(p)
      + '<div class="js-stack">' + cards.join('') + '</div>'
      + '<div class="section-cta" data-reveal="up"><a href="projects.html" class="btn-outline btn-lg">'
      + p.cta + ' <i class="fas fa-arrow-right" aria-hidden="true"></i></a></div></div>';
  }

  /* ------------------------------ insights ------------------------------ */
  function renderInsights(mount) {
    var ins = SITE.insights;
    var items = [];
    for (var i = 0; i < ins.items.length; i++) {
      var it = ins.items[i];
      items.push(
        '<a class="js-insight-card" data-reveal="up" href="' + it.href + '" aria-label="' + it.title + '">'
          + '<span class="js-insight-tag">' + it.tag + '</span>'
          + '<h3>' + it.title + '</h3>'
          + '<div class="js-insight-meta"><span>' + it.date + '</span><span aria-hidden="true">·</span><span>' + it.read + '</span></div>'
          + '</a>'
      );
    }
    mount.innerHTML = '<div class="section-container">' + headerHtml(ins) + '<div class="js-insights-grid">' + items.join('') + '</div></div>';
  }

  /* ---------------------------- testimonials ---------------------------- */
  function testiCard(t) {
    return '<article class="testi-card">'
      + '<div class="js-testi-stars" aria-hidden="true">' + SITE.testimonials.stars + '</div>'
      + '<p class="js-testi-text">"' + t.text + '"</p>'
      + '<div class="js-testi-author">'
      + '<div class="author-avatar">' + t.initials + '</div>'
      + '<div class="author-info"><strong>' + t.name + '</strong><span>' + t.role + '</span></div>'
      + '</div></article>';
  }

  function renderTestimonials(mount) {
    var ts = SITE.testimonials;
    var rowA = [], rowB = [];
    for (var i = 0; i < ts.rowA.length; i++) rowA.push(testiCard(ts.rowA[i]));
    for (var j = 0; j < ts.rowB.length; j++) rowB.push(testiCard(ts.rowB[j]));
    mount.innerHTML = '<div class="section-container">' + headerHtml(ts)
      + '<div class="js-testi-rows">'
      + '<div class="marquee testi-row" data-marquee aria-label="Client testimonials"><div class="marquee-track"><div class="marquee-group">'
      + rowA.join('') + '</div></div></div>'
      + '<div class="marquee marquee--reverse testi-row" data-marquee aria-label="More client testimonials"><div class="marquee-track"><div class="marquee-group">'
      + rowB.join('') + '</div></div></div>'
      + '</div></div>';
  }

  /* ----------------------------- engagements ---------------------------- */
  function renderEngagements(mount) {
    var eg = SITE.engagements;
    var cards = [];
    for (var i = 0; i < eg.items.length; i++) {
      var it = eg.items[i];
      var pts = [];
      for (var p = 0; p < it.points.length; p++) pts.push('<li><i class="fas fa-check" aria-hidden="true"></i>' + it.points[p] + '</li>');
      cards.push(
        '<article class="js-eng-card" data-reveal="up">'
          + '<div class="js-eng-icon"><i class="' + it.icon + '" aria-hidden="true"></i></div>'
          + '<h3>' + it.title + '</h3>'
          + '<p class="js-eng-desc">' + it.desc + '</p>'
          + '<ul class="js-eng-points">' + pts.join('') + '</ul>'
          + '<a class="js-eng-cta" href="contact.html">' + it.cta + ' <i class="fas fa-arrow-right" aria-hidden="true"></i></a>'
          + '</article>'
      );
    }
    mount.innerHTML = '<div class="section-container">' + headerHtml(eg) + '<div class="js-eng-grid">' + cards.join('') + '</div></div>';
  }

  /* -------------------------------- FAQ --------------------------------- */
  function renderFaq(mount) {
    var f = SITE.faq;
    var items = [];
    for (var i = 0; i < f.items.length; i++) {
      var it = f.items[i];
      items.push(
        '<div class="js-faq-item" data-reveal="up">'
          + '<button class="js-faq-q" aria-expanded="false">'
          + '<span>' + it.q + '</span><i class="fas fa-plus js-faq-icon" aria-hidden="true"></i></button>'
          + '<div class="js-faq-answer"><div class="js-faq-inner"><p>' + it.a + '</p></div></div>'
          + '</div>'
      );
    }
    mount.innerHTML = '<div class="section-container">' + headerHtml(f) + '<div class="js-faq-list">' + items.join('') + '</div></div>';

    var list = mount.querySelector('.js-faq-list');
    list.addEventListener('click', function (ev) {
      var btn = ev.target.closest ? ev.target.closest('.js-faq-q') : null;
      if (!btn || !mount.contains(btn)) return;
      var item = btn.parentNode;
      var open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ------------------------------- CTA ---------------------------------- */
  function renderCta(mount) {
    var c = SITE.cta;
    mount.innerHTML = ''
      + '<div class="js-mesh" aria-hidden="true">'
      + '<span class="js-mesh-blob js-mesh-b1"></span>'
      + '<span class="js-mesh-blob js-mesh-b2"></span>'
      + '<span class="js-mesh-blob js-mesh-b3"></span>'
      + '</div>'
      + '<div class="section-container">'
      + '<div class="js-cta-content" data-reveal="fade">'
      + '<h2>' + c.title + '</h2>'
      + '<p class="js-cta-desc">' + c.desc + '</p>'
      + '<div class="js-cta-actions">'
      + '<a href="' + c.primary.href + '" class="btn-primary btn-lg js-cta-primary">' + c.primary.label + '</a>'
      + '<a href="' + c.secondary.href + '" class="btn-outline-white btn-lg">' + c.secondary.label + '</a>'
      + '</div>'
      + '<p class="js-cta-note">' + c.note + '</p>'
      + '</div></div>';
  }

  /* --------------------- About: animated stat counters ------------------ */
  function renderAboutStats(mount) {
    var s = SITE.aboutStats;
    var stats = [];
    for (var i = 0; i < s.stats.length; i++) {
      var st = s.stats[i];
      var attrs = ' data-count="' + st.value + '"'
        + (st.decimals ? ' data-decimals="' + st.decimals + '"' : '')
        + (st.prefix ? ' data-prefix="' + st.prefix + '"' : '')
        + (st.suffix ? ' data-suffix="' + st.suffix + '"' : '');
      stats.push(
        '<div class="jsf-stat" data-reveal="up">'
          + '<span class="jsf-stat-val" ' + attrs + '>' + numFmt(st.value, st.decimals, st.prefix, st.suffix) + '</span>'
          + '<span class="jsf-stat-label">' + st.label + '</span>'
          + '</div>'
      );
    }
    mount.innerHTML = '<div class="section-container">' + headerHtml(s)
      + '<div class="jsf-stats-grid">' + stats.join('') + '</div></div>';
  }

  /* ------------------- About: education + certifications ----------------- */
  function renderAcademics(mount) {
    var a = SITE.academics;
    var edu = [];
    for (var i = 0; i < a.education.length; i++) {
      var e = a.education[i];
      edu.push(
        '<article class="jsf-edu-card" data-reveal="up">'
          + '<div class="jsf-edu-icon"><i class="' + e.icon + '" aria-hidden="true"></i></div>'
          + '<div class="jsf-edu-body"><h3>' + e.degree + '</h3>'
          + '<span class="jsf-edu-school">' + e.school + '</span>'
          + '<span class="jsf-edu-years">' + e.years + '</span>'
          + '<p>' + e.note + '</p></div>'
          + '</article>'
      );
    }
    var certs = [];
    for (var c = 0; c < a.certifications.length; c++) {
      certs.push('<li><i class="fas fa-certificate" aria-hidden="true"></i>' + a.certifications[c] + '</li>');
    }
    mount.innerHTML = '<div class="section-container">' + headerHtml(a)
      + '<div class="jsf-academics">'
      + '<div class="jsf-edu-grid">' + edu.join('') + '</div>'
      + '<div class="jsf-cert-block" data-reveal="up">'
      + '<h3 class="jsf-cert-title">Certifications</h3>'
      + '<ul class="jsf-cert-list">' + certs.join('') + '</ul>'
      + '</div></div></div>';
  }

  /* ----------------------- About: values / principles -------------------- */
  function renderValues(mount) {
    var v = SITE.values;
    var cards = [];
    for (var i = 0; i < v.items.length; i++) {
      var it = v.items[i];
      cards.push(
        '<article class="jsf-value-card" data-reveal="up">'
          + '<div class="jsf-value-icon"><i class="' + it.icon + '" aria-hidden="true"></i></div>'
          + '<h3>' + it.title + '</h3>'
          + '<p>' + it.text + '</p>'
          + '</article>'
      );
    }
    mount.innerHTML = '<div class="section-container">' + headerHtml(v)
      + '<div class="jsf-values-grid">' + cards.join('') + '</div></div>';
  }

  /* ------------------ Projects: filter grid + case modal ----------------- */
  function renderPortfolio(mount) {
    var p = SITE.portfolio;
    var btns = ['<button class="jsf-filter-btn active" type="button" data-key="all">All</button>'];
    for (var f = 0; f < p.filters.length; f++) {
      btns.push('<button class="jsf-filter-btn" type="button" data-key="' + p.filters[f].key + '">' + p.filters[f].label + '</button>');
    }
    var cards = [];
    for (var i = 0; i < p.projects.length; i++) {
      var pr = p.projects[i];
      var tech = [];
      for (var t = 0; t < pr.tech.length; t++) tech.push('<span>' + pr.tech[t] + '</span>');
      var metrics = [];
      for (var m = 0; m < pr.metrics.length; m++) metrics.push('<span class="jsf-pf-metric"><i class="fas fa-chart-line" aria-hidden="true"></i> ' + pr.metrics[m].value + '</span>');
      cards.push(
        '<article class="jsf-pf-card" data-filter="' + pr.filter + '" data-id="' + pr.id + '" data-reveal="up" tabindex="0"'
          + ' style="--pf-grad:' + pr.gradient + '"'
          + ' aria-label="Open case study: ' + pr.title + '">'
          + '<div class="jsf-pf-visual"><i class="' + pr.icon + '" aria-hidden="true"></i>'
          + '<span class="jsf-pf-cat">' + pr.category + '</span></div>'
          + '<div class="jsf-pf-body"><h3>' + pr.title + '</h3>'
          + '<p>' + pr.blurb + '</p>'
          + '<div class="jsf-pf-metrics">' + metrics.join('') + '</div>'
          + '<div class="jsf-pf-tech">' + tech.join('') + '</div>'
          + '<span class="jsf-pf-open">View Case Study <i class="fas fa-arrow-right" aria-hidden="true"></i></span>'
          + '</div></article>'
      );
    }
    mount.innerHTML = '<div class="section-container">' + headerHtml(p)
      + '<div class="jsf-filter-bar">' + btns.join('') + '</div>'
      + '<div class="jsf-pf-grid">' + cards.join('') + '</div></div>';

    var filterBar = mount.querySelector('.jsf-filter-bar');
    var grid = mount.querySelector('.jsf-pf-grid');
    filterBar.addEventListener('click', function (ev) {
      var btn = ev.target.closest ? ev.target.closest('.jsf-filter-btn') : null;
      if (!btn) return;
      var key = btn.getAttribute('data-key');
      var btns2 = filterBar.querySelectorAll('.jsf-filter-btn');
      for (var b = 0; b < btns2.length; b++) btns2[b].classList.toggle('active', btns2[b] === btn);
      var cards2 = grid.querySelectorAll('.jsf-pf-card');
      for (var c2 = 0; c2 < cards2.length; c2++) {
        var show = key === 'all' || cards2[c2].getAttribute('data-filter') === key;
        if (show) {
          cards2[c2].classList.remove('jsf-pf-hide');
          cards2[c2].classList.remove('jsf-pf-show');
          void cards2[c2].offsetWidth;
          cards2[c2].classList.add('jsf-pf-show');
        } else {
          cards2[c2].classList.remove('jsf-pf-show');
          cards2[c2].classList.add('jsf-pf-hide');
        }
      }
    });

    var sel = mount.querySelector('.jsf-pf-grid');
    sel.addEventListener('click', function (ev) {
      var card = ev.target.closest ? ev.target.closest('.jsf-pf-card') : null;
      if (card && !card.classList.contains('jsf-pf-hide')) openModal(card.getAttribute('data-id'));
    });
    sel.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' || ev.key === ' ') {
        var card = ev.target.closest ? ev.target.closest('.jsf-pf-card') : null;
        if (card && !card.classList.contains('jsf-pf-hide')) { ev.preventDefault(); openModal(card.getAttribute('data-id')); }
      }
    });

    /* Deep links: projects.html#pX (gallery cards & elsewhere) open the
       matching case-study modal. */
    var openFromHash = function () {
      var id = (window.location.hash || '').replace(/^#/, '');
      if (!/^p\d+$/.test(id)) return;
      var found = false;
      for (var ha = 0; ha < p.projects.length; ha++) {
        if (p.projects[ha].id === id) { found = true; break; }
      }
      if (found) openModal(id);
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
  }

  function pfModalHtml(pr) {
    var chips = [];
    for (var t = 0; t < pr.tech.length; t++) chips.push('<span>' + pr.tech[t] + '</span>');
    var metrics = [];
    for (var m = 0; m < pr.metrics.length; m++) metrics.push('<span class="jsf-modal-metric"><i class="fas fa-chart-line" aria-hidden="true"></i> ' + pr.metrics[m].value + '</span>');
    return ''
      + '<div class="jsf-modal" id="jsf-modal" role="dialog" aria-modal="true" aria-label="' + pr.title + ' case study" aria-hidden="true">'
      + '<button class="jsf-modal-backdrop" type="button" aria-label="Close case study"></button>'
      + '<div class="jsf-modal-panel" style="--pf-grad:' + pr.gradient + '">'
      + '<button class="jsf-modal-close" type="button" aria-label="Close"><i class="fas fa-times" aria-hidden="true"></i></button>'
      + '<span class="jsf-pf-cat">' + pr.category + '</span>'
      + '<h2>' + pr.title + '</h2>'
      + '<p class="jsf-modal-blurb">' + pr.blurb + '</p>'
      + '<div class="jsf-modal-metrics">' + metrics.join('') + '</div>'
      + '<div class="jsf-modal-slice"><h3><i class="fas fa-bolt" aria-hidden="true"></i> The Problem</h3><p>' + pr.case.problem + '</p></div>'
      + '<div class="jsf-modal-slice"><h3><i class="fas fa-database" aria-hidden="true"></i> The Data</h3><p>' + pr.case.data + '</p></div>'
      + '<div class="jsf-modal-slice"><h3><i class="fas fa-compass" aria-hidden="true"></i> The Approach</h3><p>' + pr.case.approach + '</p></div>'
      + '<div class="jsf-modal-slice"><h3><i class="fas fa-rocket" aria-hidden="true"></i> The Results</h3><p>' + pr.case.results + '</p></div>'
      + '<div class="jsf-modal-stack"><span class="jsf-modal-stack-label">Stack</span><div>' + chips.join('') + '</div></div>'
      + '</div></div>';
  }

  function openModal(id) {
    var opener = document.activeElement;
    var p = SITE.portfolio;
    var pr = null;
    for (var i = 0; i < p.projects.length; i++) if (p.projects[i].id === id) { pr = p.projects[i]; break; }
    if (!pr) return;
    var old = document.getElementById('jsf-modal');
    if (old) old.remove();
    document.body.insertAdjacentHTML('beforeend', pfModalHtml(pr));
    var modal = document.getElementById('jsf-modal');
    modal.classList.add('jsf-modal-open');
    modal.setAttribute('aria-hidden', 'false');
    var close = modal.querySelector('.jsf-modal-close');
    var backdrop = modal.querySelector('.jsf-modal-backdrop');
    close.focus();
    var tidy = function () {
      modal.classList.remove('jsf-modal-open');
      modal.setAttribute('aria-hidden', 'true');
      document.removeEventListener('keydown', onKey);
      setTimeout(function () { if (modal.parentNode) modal.parentNode.removeChild(modal); if (opener && opener.focus) opener.focus(); }, 260);
    };
    var onKey = function (ev) { if (ev.key === 'Escape' && modal.parentNode) tidy(); };
    document.addEventListener('keydown', onKey);
    close.addEventListener('click', tidy);
    backdrop.addEventListener('click', tidy);
  }

  /* ---------------- Skills: radar + fill-on-scroll bars ------------------ */
  function renderRadarSvg(axes) {
    var n = axes.length;
    var cx = 130, cy = 130, R = 88;
    var angle = (Math.PI * 2) / n;
    var pt = function (i, r) {
      var a = -Math.PI / 2 + i * angle;
      return (cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1);
    };
    var rings = '';
    for (var L = 1; L <= 5; L++) {
      var rr = (R * L) / 5;
      var pts = [];
      for (var i2 = 0; i2 < n; i2++) pts.push(pt(i2, rr));
      rings += '<polygon points="' + pts.join(' ') + '" class="jsf-radar-ring"/>';
    }
    var spokes = '';
    for (var i4 = 0; i4 < n; i4++) spokes += '<line x1="130" y1="130" x2="' + pt(i4, R).split(',')[0] + '" y2="' + pt(i4, R).split(',')[1] + '" class="jsf-radar-spoke"/>';
    var poly = [];
    for (var i5 = 0; i5 < n; i5++) poly.push(pt(i5, (R * axes[i5].value) / 100));
    var labels = '';
    for (var i6 = 0; i6 < n; i6++) {
      var l = pt(i6, R + 24).split(',');
      labels += '<text x="' + l[0] + '" y="' + l[1] + '" text-anchor="middle" dominant-baseline="middle" class="jsf-radar-label">' + axes[i6].label + '</text>';
    }
    var sum = axes.slice().sort(function (a, b) { return b.value - a.value; });
    var summary = sum.map(function (a, i) {
      return (i === 0 ? ' Strongest in ' : ' Then ') + a.label + ' at ' + a.value + '%';
    }).join('.');
    return '<svg class="jsf-radar-svg" viewBox="0 0 260 260" role="img" aria-label="Expertise radar chart.' + summary + '.' + '" data-radar="' + n + '">'
      + rings + spokes
      + '<polygon points="' + poly.join(' ') + '" class="jsf-radar-polygon"/>'
      + labels + '</svg>';
  }

  function renderSkills(mount) {
    var r = SITE.radar;
    var groups = [];
    for (var g = 0; g < SITE.skillGroups.length; g++) {
      var grp = SITE.skillGroups[g];
      var bars = [];
      for (var s = 0; s < grp.skills.length; s++) {
        var sk = grp.skills[s];
        bars.push(
          '<div class="jsf-skill-item">'
            + '<div class="jsf-skill-head"><span>' + sk.name + '</span><span class="jsf-skill-pct">' + sk.pct + '%</span></div>'
            + '<div class="jsf-skill-track"><div class="jsf-skill-fill" style="--jsf-pct:' + sk.pct + '%"></div></div>'
            + '</div>'
        );
      }
      groups.push('<div class="jsf-skill-group"><h3 class="jsf-skill-group-title">' + grp.group + '</h3>' + bars.join('') + '</div>');
    }
    mount.innerHTML = '<div class="section-container">' + headerHtml(r)
      + '<div class="jsf-skills">'
      + '<div class="jsf-radar" data-reveal="up">' + renderRadarSvg(r.axes) + '</div>'
      + '<div class="jsf-skill-groups">' + groups.join('') + '</div>'
      + '</div></div>';

    var groupsEl = mount.querySelectorAll('.jsf-skill-group');
    var startFill = function (el) { el.classList.add('inview'); };
    if (typeof IntersectionObserver !== 'undefined') {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { startFill(en.target); io.unobserve(en.target); } });
      }, { threshold: 0.25 });
      Array.prototype.forEach.call(groupsEl, function (el) { io.observe(el); });
    } else {
      Array.prototype.forEach.call(groupsEl, startFill);
    }
    if (rm) Array.prototype.forEach.call(groupsEl, startFill);
  }

  /* -------------------- Skills: tool constellation ---------------------- */
  function renderConstellation(mount) {
    var c = SITE.constellation;
    var cx = 280, cy = 280, base = 96;
    var slot = (Math.PI * 2) / c.groups.length;
    var nodes = [];
    var groups = [];
    for (var g = 0; g < c.groups.length; g++) {
      var grp = c.groups[g];
      var ang = -Math.PI / 2 + g * slot;
      var hx = cx + base * Math.cos(ang);
      var hy = cy + base * Math.sin(ang);
      var ring = 34 + grp.tools.length * 8;
      nodes.push('<line class="jsf-con-link" x1="' + hx.toFixed(1) + '" y1="' + hy.toFixed(1) + '" x2="' + cx.toFixed(1) + '" y2="' + cy.toFixed(1) + '"/>');
      nodes.push('<g class="jsf-con-hub"><circle cx="' + hx.toFixed(1) + '" cy="' + hy.toFixed(1) + '" r="' + ring + '"/></g>');
      var chips = [];
      for (var c2 = 0; c2 < grp.tools.length; c2++) chips.push('<span>' + grp.tools[c2] + '</span>');
      groups.push(
        '<div class="jsf-con-group" data-reveal="up">'
          + '<div class="jsf-con-group-head"><i class="' + grp.icon + '" aria-hidden="true"></i><h3>' + grp.label + '</h3></div>'
          + '<div class="jsf-con-chips">' + chips.join('') + '</div>'
          + '</div>'
      );
    }
    var groupCount = c.groups.length;
    var toolCount = 0;
    for (var g2 = 0; g2 < c.groups.length; g2++) toolCount += c.groups[g2].tools.length;
    var conSummary = c.groups.map(function (g) { return g.label + ' (' + g.tools.length + ' tools)'; }).join(', ');
    mount.innerHTML = '<div class="section-container">' + headerHtml(c)
      + '<div class="jsf-constellation">'
      + '<div class="jsf-con-map" data-reveal="fade" data-hubs="' + groupCount + '" data-tools="' + toolCount + '">'
      + '<svg class="jsf-con-svg" viewBox="0 0 560 560" role="img" aria-label="Technology constellation by category: ' + conSummary + '. Tool proficiencies are listed below.">'
      + '<circle class="jsf-con-core" cx="280" cy="280" r="34"/>'
      + '<text class="jsf-con-core-label" x="280" y="284" text-anchor="middle">DS</text>'
      + nodes.join('')
      + '</svg>'
      + '<div class="jsf-con-ring-label" aria-hidden="true">' + groupCount + ' categories orbit the core</div>'
      + '</div>'
      + '<div class="jsf-con-groups">' + groups.join('') + '</div>'
      + '</div></div>';
  }

  /* -------------------- Contact: form with validation -------------------- */
  function renderContact(mount) {
    var c = SITE.contact;
    var info = [];
    for (var i = 0; i < c.info.length; i++) {
      var it = c.info[i];
      var cls = 'jsf-contact-card' + (it.href ? '' : ' jsf-contact-card--static');
      info.push(
        (it.href
          ? '<a href="' + it.href + '" class="' + cls + '">'
          : '<div class="' + cls + '">')
          + '<div class="jsf-contact-icon"><i class="' + it.icon + '" aria-hidden="true"></i></div>'
          + '<div class="jsf-contact-text"><strong>' + it.label + '</strong><span>' + it.value + '</span></div>'
          + (it.href ? '</a>' : '</div>')
      );
    }
    var types = [];
    for (var t2 = 0; t2 < c.form.projectTypes.length; t2++) types.push('<option>' + c.form.projectTypes[t2] + '</option>');
    var budgets = [];
    for (var b2 = 0; b2 < c.form.budgets.length; b2++) budgets.push('<option>' + c.form.budgets[b2] + '</option>');
    mount.innerHTML = '<div class="section-container">' + headerHtml(c)
      + '<div class="jsf-contact-grid">'
      + '<div class="jsf-contact-aside" data-reveal="up">'
      + '<p class="jsf-contact-intro">' + c.intro + '</p>'
      + '<div class="jsf-contact-cards">' + info.join('') + '</div>'
      + '<div class="social-links jsf-contact-socials" data-role="socials"></div>'
      + '</div>'
      + '<div class="jsf-contact-form-wrap" data-reveal="up">'
      + '<div class="jsf-form-title">' + c.form.title + '</div>'
      + '<form class="jsf-contact-form" novalidate>'
      + '<div class="jsf-form-row">'
      + '<div class="jsf-form-group"><label for="jsf-name">Your Name *</label>'
      + '<input type="text" id="jsf-name" name="name" placeholder="John Smith" required/></div>'
      + '<div class="jsf-form-group"><label for="jsf-email">Email Address *</label>'
      + '<input type="email" id="jsf-email" name="email" placeholder="john@company.com" required/></div>'
      + '</div>'
      + '<div class="jsf-form-group"><label for="jsf-type">Type of Engagement *</label>'
      + '<select id="jsf-type" name="projectType" required><option value="">Select an option...</option>' + types.join('') + '</select></div>'
      + '<div class="jsf-form-group"><label for="jsf-budget">Estimated Budget (USD)</label>'
      + '<select id="jsf-budget" name="budget">' + budgets.join('') + '</select></div>'
      + '<div class="jsf-form-group"><label for="jsf-message">Tell Me About Your Project *</label>'
      + '<textarea id="jsf-message" name="message" rows="5" placeholder="Describe your data challenge, goals, timeline..." required></textarea></div>'
      + '<button type="submit" class="btn-primary jsf-form-submit"><i class="fas fa-paper-plane" aria-hidden="true"></i> ' + c.form.submitLabel + '</button>'
      + '</form>'
      + '<div class="jsf-form-success" role="status" hidden>'
      + '<i class="fas fa-check-circle" aria-hidden="true"></i>'
      + '<h3>' + c.form.successTitle + '</h3>'
      + '<p>' + c.form.successText + '</p>'
      + '</div>'
      + '</div></div></div>';

    renderSocialsInto(mount.querySelector('[data-role="socials"]'));

    var form = mount.querySelector('.jsf-contact-form');
    var success = mount.querySelector('.jsf-form-success');
    var endpoint = SITE.site.formspreeEndpoint
      || (window.__FORMSPREE_ID__ ? 'https://formspree.io/f/' + window.__FORMSPREE_ID__ : '')
      || (document.querySelector('meta[name="formspree-endpoint"]') || {}).content || '';

    var validators = {
      name: function (v) { return v.trim().length >= 2; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
      projectType: function (v) { return v !== ''; },
      message: function (v) { return v.trim().length >= 10; }
    };

    var mark = function (el, bad) {
      var group = el.closest('.jsf-form-group');
      if (!group) return;
      group.classList.toggle('jsf-invalid', bad);
    };
    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      el.addEventListener('input', function () { mark(el, false); });
      el.addEventListener('change', function () { mark(el, false); });
    });

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var fields = {
        name: form.querySelector('#jsf-name'),
        email: form.querySelector('#jsf-email'),
        projectType: form.querySelector('#jsf-type'),
        message: form.querySelector('#jsf-message')
      };
      var ok = true;
      Object.keys(fields).forEach(function (k) {
        var bad = !validators[k](fields[k].value);
        mark(fields[k], bad);
        if (bad) ok = false;
      });
      if (!ok) return;

      var data = {
        name: fields.name.value.trim(),
        email: fields.email.value.trim(),
        projectType: fields.projectType.value,
        budget: form.querySelector('#jsf-budget').value,
        message: fields.message.value.trim()
      };

      if (endpoint) {
        var fd = new FormData();
        fd.append('name', data.name);
        fd.append('email', data.email);
        fd.append('projectType', data.projectType);
        fd.append('budget', data.budget);
        fd.append('message', data.message);
        fetch(endpoint, { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } })
          .then(function (r) {
            success.classList.add('jsf-success-show');
            success.hidden = false;
            form.reset();
            rmOrHideForm(form);
          })
          .catch(function () { showSimulated(success, form); });
      } else {
        showSimulated(success, form);
      }
    });

    var showSimulated = function (s, f) {
      s.classList.add('jsf-success-show');
      s.hidden = false;
      rmOrHideForm(f);
    };
    var rmOrHideForm = function (f) { f.style.display = 'none'; };
  }

  /* ------------------- socials (footer + contact) ------------------------ */
  function renderSocialsInto(el) {
    var s = SITE.site.socials;
    var out = [];
    for (var i = 0; i < s.length; i++) {
      out.push('<a class="social-link" href="' + s[i].url + '" aria-label="' + s[i].name + '"'
        + (s[i].url.indexOf('mailto:') !== 0 ? ' target="_blank" rel="noopener noreferrer"' : '')
        + '><i class="' + s[i].icon + '" aria-hidden="true"></i></a>');
    }
    el.innerHTML = out.join('');
  }

  function renderSocials(mount) {
    renderSocialsInto(mount);
  }

  /* ------------------------------ dispatch ------------------------------ */
  var renderers = {
    timeline: renderTimeline,
    process: renderProcess,
    stack: renderStack,
    insights: renderInsights,
    testimonials: renderTestimonials,
    engagements: renderEngagements,
    faq: renderFaq,
    cta: renderCta,
    'about-stats': renderAboutStats,
    'about-edu': renderAcademics,
    'about-values': renderValues,
    projects: renderPortfolio,
    skills: renderSkills,
    constellation: renderConstellation,
    contact: renderContact,
    socials: renderSocials
  };

  var mounts = Array.prototype.slice.call(document.querySelectorAll('[data-section]'));
  var rendered = false;
  mounts.forEach(function (mount) {
    var key = mount.getAttribute('data-section');
    if (renderers[key]) { renderers[key](mount); rendered = true; }
  });

  if (rendered && hasGSAP) {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { window.ScrollTrigger.refresh(); });
    }
    window.addEventListener('load', function () { window.ScrollTrigger.refresh(); });
  }
})();