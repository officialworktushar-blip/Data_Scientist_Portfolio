/* ==========================================================================
   EXPERTISE.JS — Bento "Core Expertise" cards with live SVG mini-visuals
   - All card data (titles, copy, chips, numbers) lives in CONFIG (edit here).
   - Each [data-viz] card gets its visual + text injected by this script.
   - Animations render inline SVG (no libraries) via a single rAF loop that:
       * only runs while the card is in view (IntersectionObserver),
       * pauses when the tab/document is hidden,
       * speeds up while hovered or focused,
       * renders a static final frame under prefers-reduced-motion.
   - If JS fails, the <noscript> inside each card still shows full text.
   ========================================================================== */
(function () {
  'use strict';

  if (!document.documentElement.classList.contains('js')) return;

  var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  var VB = '0 0 400 118';
  var MONO = "JetBrains Mono, monospace";
  var DISPLAY = "Inter Tight, 'Inter', sans-serif";

  var CX = '#0099FF', CY = '#00CCFF', CV = '#0055FF', CG = '#00CCFF', CA = '#00CCFF';
  var CM = '#999999', TEXT = '#FFFFFF', DARK = 'rgba(0, 0, 0, 0.55)';

  /* ============================ CONFIG (edit me) ========================== */
  var CONFIG = {
    ml: {
      title: 'Machine Learning',
      desc: 'Predictive models for real-world problems — churn, pricing, and forecast.',
      chips: ['Scikit-learn', 'XGBoost', 'LightGBM'],
      aucStart: 0.71, auc: 0.94,
      epochMs: 1500, epochs: 4, holdMs: 2400,
      features: [ { k: 'f2', v: 0.92 }, { k: 'f9', v: 0.66 }, { k: 'f4', v: 0.47 }, { k: 'f1', v: 0.30 } ]
    },
    dl: {
      title: 'Deep Learning & NLP',
      desc: 'Transformers, LLMs, and RAG systems built for production.',
      chips: ['PyTorch', 'Transformers', 'LLMs', 'RAG'],
      tokens: ['attention', 'is', 'all', 'you', 'need', 'data'],
      focus: 4,
      heads: [
        [0.25, 0.10, 0.92, 0.06, 1.0, 0.52],
        [0.88, 0.30, 0.12, 0.72, 0.42, 0.91],
        [0.55, 0.82, 0.46, 0.28, 0.61, 0.33]
      ],
      headMs: 2200,
      tpsBase: 9600, tpsJit: 1300
    },
    mlops: {
      title: 'MLOps & Cloud',
      desc: 'End-to-end pipelines, deployment, and monitoring at scale.',
      chips: ['SageMaker', 'Docker', 'Kubernetes', 'MLflow'],
      nodes: ['Data', 'Train', 'Validate', 'Deploy', 'Monitor'],
      packets: 3,
      quietMs: 3000, spikeMs: 900, retrainMs: 1700, tailMs: 800,
      sparkPts: 20
    },
    bi: {
      title: 'Business Intelligence',
      desc: 'Executive-ready dashboards that turn metrics into decisions.',
      chips: ['Tableau', 'Power BI', 'Looker'],
      drawMs: 2200,
      kpis: [
        { label: 'Revenue', value: 12.4, fmt: function (v) { return '$' + v.toFixed(1) + 'M'; } },
        { label: 'Active Users', value: 52, fmt: function (v) { return Math.round(v) + 'K'; } }
      ],
      line: [30, 44, 38, 56, 50, 62, 68, 64, 74, 80, 72, 86, 92],
      bars: [32, 52, 40, 70, 56, 88]
    },
    bigdata: {
      title: 'Big Data Engineering',
      desc: 'Distributed pipelines moving terabytes of data a day.',
      chips: ['Spark', 'Kafka', 'Airflow', 'Snowflake'],
      epsBase: 1.2, epsJit: 0.13, particles: 11
    },
    ab: {
      title: 'A/B Testing & Causal AI',
      desc: 'Rigorous experiments and causal inference that prove impact.',
      chips: ['DoWhy', 'Bayesian', 'CausalML'],
      cols: ['', 'VIEWS', 'CONV', 'RATE', 'LIFT'],
      rows: {
        A: { views: '24,000', conv: '1,034', rate: '4.31%', lift: '—' },
        B: { views: '24,000', conv: '1,212', rate: '5.05%', lift: '+17.4%' }
      },
      ciFrom: [-4, 42], ciTo: [12.5, 21.9],
      pStart: 0.310, pEnd: 0.038,
      runMs: 5200, holdMs: 2600,
      winner: 'B'
    }
  };

  var ARIA = {
    ml: 'Machine Learning demo: a scatter plot trains a classifier over four epochs; the AUC counter rises to 0.94 and feature importances fill in.',
    dl: 'Deep learning demo: attention weights between tokens highlight in turn, with a tokens-per-second readout.',
    mlops: 'MLOps demo: data packets flow through a Data to Monitor pipeline; drift occasionally triggers auto-retraining and health turns green.',
    bi: 'Business intelligence demo: a line chart draws itself, KPI tiles count up, and a bar chart grows.',
    bigdata: 'Big data demo: event records stream through a Kafka lane into a Spark cluster; events per second fluctuate.',
    ab: 'A/B testing demo: a mini table compares variants; the confidence interval narrows and a WINNER badge appears when p is below 0.05.'
  };

  /* =============================== helpers =============================== */
  function svg(tag, a, parent) {
    var n = document.createElementNS(NS, tag);
    if (a) for (var k in a) n.setAttribute(k, a[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function T(x, y, str, o, parent) {
    o = o || {};
    var a = { x: x, y: y };
    if (o.anchor) a['text-anchor'] = o.anchor;
    var n = svg('text', a, parent);
    n.setAttribute('font-size', o.size || 7);
    n.setAttribute('font-family', o.family || MONO);
    n.setAttribute('font-weight', o.weight || 600);
    n.setAttribute('letter-spacing', '0.04em');
    if (o.fill) n.setAttribute('fill', o.fill);
    if (o.op) n.setAttribute('opacity', o.op);
    n.textContent = str;
    return n;
  }
  function rr(x, y, w, h, r) {
    return 'M' + (x + r) + ',' + y + 'h' + (w - 2 * r) + 'a' + r + ',' + r + ' 0 0 1 ' + r + ',' + r +
      'v' + (h - 2 * r) + 'a' + r + ',' + r + ' 0 0 1 ' + (-r) + ',' + r +
      'h' + (2 * r - w) + 'a' + r + ',' + r + ' 0 0 1 ' + (-r) + ',' + (-r) +
      'v' + (2 * r - h) + 'a' + r + ',' + r + ' 0 0 1 ' + r + ',' + (-r) + 'z';
  }
  function easeOut(p) { return 1 - Math.pow(1 - p, 3); }
  function clamp(v) { return Math.max(0, Math.min(1, v)); }
  function mulberry(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function defsGrad(g, id, c1, c2, vert) {
    var d = svg('defs', {}, g);
    var lg = svg('linearGradient', { id: id, x1: '0', y1: '0', x2: vert ? '0' : '1', y2: vert ? '1' : '0' }, d);
    svg('stop', { offset: '0%', 'stop-color': c1 }, lg);
    svg('stop', { offset: '100%', 'stop-color': c2 }, lg);
    return lg;
  }

  /* ============================ per-visual builders ======================= */
  var BUILD = {};

  /* ---- 1. Machine Learning: scatter + morphing boundary + AUC + bars ---- */
  BUILD.ml = function (s) {
    var g = s.g, cfg = CONFIG.ml;
    defsGrad(g, 'mlg' + s.i, CX, CY);
    s.pts = [];
    var rnd = mulberry(s.i * 101 + 13);
    function cloud(cx, cy, r, c, n) {
      for (var k = 0; k < n; k++) s.pts.push({ x: cx + (rnd() * 2 - 1) * r, y: cy + (rnd() * 2 - 1) * r, c: c });
    }
    cloud(90, 30, 24, CX, 20); cloud(355, 95, 12, CX, 10);
    cloud(90, 92, 24, CY, 20); cloud(355, 28, 12, CY, 10);
    s.pts.forEach(function (p) {
      svg('circle', { cx: p.x, cy: p.y, r: 2.4, fill: p.c, opacity: 0.85 }, g);
    });
    s.bg = svg('path', { fill: 'none', stroke: CX, 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.12 }, g);
    s.bl = svg('path', { fill: 'none', stroke: 'url(#mlg' + s.i + ')', 'stroke-width': 2, 'stroke-linecap': 'round' }, g);
    s.auc = T(12, 22, '', {}, g);
    s.epoch = T(12, 36, '', {}, g);
    T(328, 22, 'feature importance', { anchor: 'middle' }, g);
    s.bars = [];
    cfg.features.forEach(function (f, i) {
      var x = 268 + i * 33;
      var lab = T(x + 10, 110, f.k, { anchor: 'middle' }, g);
      s.bars.push({ lab: lab, rect: svg('rect', { x: x, y: 104, width: 21, height: 0, rx: 3, fill: 'url(#mlg' + s.i + ')' }, g), v: f.v });
    });
    s.total = cfg.epochMs * cfg.epochs + cfg.holdMs + 900;
  };

  BUILD.ml.tick = function (s, dt) {
    var cfg = CONFIG.ml;
    s.t += dt;
    var el = s.t - s.cycleStart;
    if (s.live) { if (el >= s.total) { s.cycleStart = s.t; el = 0; } }
    else if (el > s.total) { s.cycleStart = s.t - s.total; el = s.total; }
    el = Math.min(el, s.total);

    var p = Math.min(el / cfg.epochMs, cfg.epochs);
    var frames = [
      [0.03, 34, 2], [-0.05, 60, 6], [-0.10, 72, 10], [-0.125, 77, 8], [-0.13, 78, 4]
    ];
    var k = Math.min(Math.floor(p), 3), f = p - k;
    var a = frames[k][0] + (frames[k + 1][0] - frames[k][0]) * f;
    var b = frames[k][1] + (frames[k + 1][1] - frames[k][1]) * f;
    var w = frames[k][2] + (frames[k + 1][2] - frames[k][2]) * f;
    var d = 'M';
    for (var x = 20; x <= 380; x += 12) {
      d += (x === 20 ? '' : 'L') + x + ',' + (a * x + b + w * Math.sin(x / 26)).toFixed(1);
    }
    s.bg.setAttribute('d', d);
    s.bl.setAttribute('d', d);

    var au = cfg.aucStart + (cfg.auc - cfg.aucStart) * easeOut(clamp(el / (cfg.epochMs * 3.2)));
    s.auc.textContent = 'AUC ' + au.toFixed(3);
    s.epoch.textContent = 'epoch ' + Math.min(Math.floor(p), cfg.epochs) + '/' + cfg.epochs;

    cfg.features.forEach(function (f, i) {
      var bv = s.bars[i];
      var pv = easeOut(clamp((el - i * 140) / (cfg.epochMs * 1.5)));
      var h = f.v * 52 * pv;
      bv.rect.setAttribute('y', 104 - h);
      bv.rect.setAttribute('height', h);
    });
  };

  /* ---- 2. Deep Learning: attention heatmap + tokens/sec ------------------ */
  BUILD.dl = function (s) {
    var g = s.g, cfg = CONFIG.dl;
    defsGrad(g, 'dlg' + s.i, CX, CY);
    svg('line', { x1: 20, y1: 44, x2: 380, y2: 44, stroke: 'rgba(255,255,255,0.16)', 'stroke-width': 1 }, g);
    s.toks = [];
    cfg.tokens.forEach(function (tok, i) {
      var x = 22 + i * 60;
      var pill = svg('path', { d: rr(x, 14, 56, 22, 11), fill: 'rgba(255,255,255,0.04)', stroke: 'rgba(255,255,255,0.2)', 'stroke-width': 1 }, g);
      var tx = T(x + 28, 28.5, tok, { size: 8, family: DISPLAY, anchor: 'middle', fill: TEXT }, g);
      s.toks.push({ x: x, pill: pill, tx: tx });
    });
    s.links = [];
    var fx = s.toks[cfg.focus].x + 28;
    cfg.tokens.forEach(function (_, i) {
      if (i === cfg.focus) return;
      var x0 = s.toks[i].x + 28;
      var lift = 6;
      var pt = svg('path', { fill: 'none', stroke: 'url(#dlg' + s.i + ')', 'stroke-width': 1, 'stroke-linecap': 'round' }, g);
      pt.setAttribute('d', 'M' + x0 + ',40 Q' + ((x0 + fx) / 2) + ',' + lift + ' ' + fx + ',16');
      s.links.push(pt);
    });
    s.head = T(12, 10, '', {}, g);
    s.tps = T(384, 112, '', { anchor: 'end' }, g);
  };

  BUILD.dl.tick = function (s, dt) {
    var cfg = CONFIG.dl;
    s.t += dt;
    var k = Math.floor(s.t / cfg.headMs) % cfg.heads.length;
    var w = cfg.heads[k];
    s.head.textContent = 'attention · head ' + (k + 1) + '/3';
    var li = 0;
    for (var i = 0; i < cfg.tokens.length; i++) {
      if (i === cfg.focus) continue;
      var wt = w[i];
      var pt = s.links[li++];
      pt.setAttribute('stroke-width', (0.6 + wt * 2.6).toFixed(2));
      pt.setAttribute('opacity', (0.15 + wt * 0.55).toFixed(2));
    }
    var v = cfg.tpsBase + cfg.tpsJit * Math.sin(s.t / 700);
    s.tps.textContent = (v / 1000).toFixed(1) + 'K tok/s';
  };

  /* ---- 3. MLOps: pipeline + packets + drift sparkline -------------------- */
  BUILD.mlops = function (s) {
    var g = s.g, cfg = CONFIG.mlops;
    defsGrad(g, 'mpg' + s.i, CX, CY, true);
    s.nodes = [];
    cfg.nodes.forEach(function (lab, i) {
      var x = 12 + i * 76;
      var pill = svg('path', { d: rr(x, 46, 64, 24, 12), fill: 'rgba(255,255,255,0.04)', stroke: 'rgba(255,255,255,0.22)', 'stroke-width': 1 }, g);
      T(x + 32, 61.5, lab, { size: 8, anchor: 'middle' }, g);
      s.nodes.push({ cx: x + 32 });
    });
    for (var i = 0; i < cfg.nodes.length - 1; i++) {
      svg('line', { x1: s.nodes[i].cx + 32, y1: 58, x2: s.nodes[i + 1].cx - 32, y2: 58, stroke: 'rgba(255,255,255,0.28)', 'stroke-width': 1.5 }, g);
    }
    s.packs = [];
    for (var j = 0; j < cfg.packets; j++) {
      var glow = svg('circle', { r: 7, fill: CY, opacity: 0.3 }, g);
      var core = svg('circle', { r: 2.7, fill: CY }, g);
      s.packs.push({ glow: glow, core: core, off: j * 0.33 });
    }
    s.sparkPts = [];
    for (var k = 0; k < cfg.sparkPts; k++) s.sparkPts.push(3 + Math.sin(k));
    s.spark = svg('polyline', { fill: 'none', stroke: CG, 'stroke-width': 1.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    s.status = { pill: svg('path', { d: rr(306, 8, 82, 18, 9), fill: 'rgba(76,217,99,0.10)', stroke: 'rgba(76,217,99,0.45)', 'stroke-width': 1 }, g), txt: T(347, 20, '', { anchor: 'middle', size: 8 }, g) };
    s.total = cfg.quietMs + cfg.spikeMs + cfg.retrainMs + cfg.tailMs;
  };

  BUILD.mlops.tick = function (s, dt) {
    var cfg = CONFIG.mlops;
    s.t += dt;
    var el = s.t - s.cycleStart;
    if (s.live) { if (el >= s.total) { s.cycleStart = s.t; el = 0; } }
    else if (el > s.total) { s.cycleStart = s.t - s.total; el = s.total; }
    el = Math.min(el, s.total);

    for (var q = 0; q < s.packs.length; q++) {
      var pk = s.packs[q];
      var pos = (s.t / 1100 + pk.off) % (cfg.nodes.length - 1);
      var seg = Math.min(Math.floor(pos), cfg.nodes.length - 2);
      var fr = pos - seg;
      var x = s.nodes[seg].cx + (s.nodes[seg + 1].cx - s.nodes[seg].cx) * fr;
      pk.glow.setAttribute('cx', x);
      pk.glow.setAttribute('cy', 58);
      pk.core.setAttribute('cx', x);
      pk.core.setAttribute('cy', 58);
      pk.core.setAttribute('opacity', 0.35 + 0.65 * Math.abs(Math.sin(s.t / 400 + q)));
    }

    var phase = el < cfg.quietMs ? 0 : el < cfg.quietMs + cfg.spikeMs ? 1 : el < cfg.quietMs + cfg.spikeMs + cfg.retrainMs ? 2 : 0;
    var env = 0;
    if (phase === 1) env = clamp((el - cfg.quietMs) / cfg.spikeMs);
    else if (phase === 2) env = Math.max(0, 1 - (el - cfg.quietMs - cfg.spikeMs) / cfg.retrainMs * 1.2);
    var val = 3 + 2 * Math.sin(s.t / 380) + env * 7;
    s.sparkPts.push(val);
    if (s.sparkPts.length > cfg.sparkPts) s.sparkPts.shift();
    var d = '';
    for (var i = 0; i < s.sparkPts.length; i++) {
      d += (i === 0 ? '' : ' ') + (12 + i * (244 / (cfg.sparkPts - 1))).toFixed(1) + ',' + (112 - s.sparkPts[i] * 1.1).toFixed(1);
    }
    s.spark.setAttribute('points', d);

    var stat = phase === 1 ? 'drift' : phase === 2 ? 'retrain' : 'stable';
    var green = stat === 'stable';
    var col = green ? CG : CA;
    s.status.txt.textContent = stat;
    s.status.txt.setAttribute('fill', col);
    s.status.pill.setAttribute('fill', green ? 'rgba(76,217,99,0.10)' : 'rgba(255,187,0,0.10)');
    s.status.pill.setAttribute('stroke', green ? 'rgba(76,217,99,0.45)' : 'rgba(255,187,0,0.5)');
  };

  /* ---- 4. Business Intelligence: self-drawing dashboard ------------------ */
  BUILD.bi = function (s) {
    var g = s.g, cfg = CONFIG.bi;
    defsGrad(g, 'big' + s.i, CX, CY, true);
    s.kpis = [];
    cfg.kpis.forEach(function (kpi, i) {
      var x = 16 + i * 194;
      svg('path', { d: rr(x, 12, 174, 44, 10), fill: 'rgba(255,255,255,0.03)', stroke: 'rgba(255,255,255,0.18)', 'stroke-width': 1 }, g);
      T(x + 12, 26, kpi.label, {}, g);
      s.kpis.push(T(x + 12, 46, '', { size: 15, family: DISPLAY, weight: 800, fill: TEXT }, g));
      s.kpis[i].k = kpi;
    });
    for (var gr = 0; gr < 3; gr++) {
      svg('line', { x1: 24, y1: 66 + gr * 16, x2: 244, y2: 66 + gr * 16, stroke: 'rgba(255,255,255,0.08)', 'stroke-width': 1 }, g);
    }
    s.line = svg('path', { fill: 'none', stroke: 'url(#big' + s.i + ')', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    var d = '', n = cfg.line.length;
    for (var i2 = 0; i2 < n; i2++) {
      d += (i2 === 0 ? 'M' : 'L') + (16 + i2 * (224 / (n - 1))).toFixed(1) + ',' + (114 - cfg.line[i2]).toFixed(1);
    }
    s.line.setAttribute('d', d);
    s.lineLen = s.line.getTotalLength();
    s.line.setAttribute('stroke-dasharray', s.lineLen + ' ' + s.lineLen);
    s.line.setAttribute('stroke-dashoffset', s.lineLen);
    s.dot = svg('circle', { r: 2.6, fill: CY }, g);
    s.bars = [];
    cfg.bars.forEach(function (h, i) {
      var x = 258 + i * 22;
      s.bars.push(svg('rect', { x: x, y: 112, width: 15, height: 0, rx: 3, fill: 'url(#big' + s.i + ')' }, g));
    });
  };

  BUILD.bi.tick = function (s, dt) {
    var cfg = CONFIG.bi;
    s.t += dt;
    var pv = Math.min(s.t / cfg.drawMs, 1);
    s.line.setAttribute('stroke-dashoffset', s.lineLen * (1 - easeOut(pv)));
    var n = cfg.line.length, lx = 16 + (n - 1) * (224 / (n - 1));
    var ly = 114 - cfg.line[n - 1];
    s.dot.setAttribute('cx', lx);
    s.dot.setAttribute('cy', ly + Math.sin(s.t / 260) * 1.2);
    cfg.bars.forEach(function (h, i) {
      var pv2 = easeOut(clamp((s.t - i * 140) / (cfg.drawMs * 0.8)));
      var hh = h * 0.42 * pv2;
      s.bars[i].setAttribute('y', 112 - hh);
      s.bars[i].setAttribute('height', hh);
    });
    s.kpis.forEach(function (el, i) {
      var v = el.k.value * (1 + 0.004 * Math.sin(s.t / 700 + i));
      el.textContent = el.k.fmt(v);
    });
  };

  /* ---- 5. Big Data: Kafka lane -> Spark cluster + ev/s ------------------- */
  BUILD.bigdata = function (s) {
    var g = s.g, cfg = CONFIG.bigdata;
    defsGrad(g, 'beg' + s.i, CX, CV);
    svg('path', { d: rr(16, 68, 272, 32, 8), fill: 'rgba(0,153,255,0.06)', stroke: 'rgba(255,255,255,0.2)', 'stroke-width': 1 }, g);
    T(20, 62, 'topic.events', {}, g);
    s.evs = [];
    for (var i = 0; i < cfg.particles; i++) {
      s.evs.push({
        pr: mulberry(s.i * 31 + i)(),
        sp: 0.6 + (i % 5) * 0.14,
        c: i % 2 ? CY : CX,
        y: 78 + ((i * 7) % 5) * 3.2
      });
    }
    s.evDots = s.evs.map(function (e) {
      return svg('circle', { r: 2.2, fill: e.c, opacity: 0.9 }, g);
    });
    svg('line', { x1: 290, y1: 76, x2: 300, y2: 76, stroke: 'rgba(255,255,255,0.4)', 'stroke-width': 1.5 }, g);
    svg('path', { d: 'M300,71 L307,76 L300,81 Z', fill: 'rgba(255,255,255,0.4)' }, g);
    s.spark = svg('path', { d: rr(298, 40, 86, 64, 12), fill: 'rgba(0,153,255,0.12)', stroke: 'rgba(0,153,255,0.5)', 'stroke-width': 1.2 }, g);
    T(341, 66, 'SPARK', { size: 10, anchor: 'middle', family: DISPLAY, weight: 800, fill: TEXT }, g);
    T(341, 80, 'cluster', { size: 6, anchor: 'middle' }, g);
    s.eps = T(384, 26, '', { anchor: 'end', size: 10, family: DISPLAY, weight: 800, fill: TEXT }, g);
    T(384, 40, 'events/sec', { anchor: 'end', size: 6 }, g);
  };

  BUILD.bigdata.tick = function (s, dt) {
    var cfg = CONFIG.bigdata;
    s.t += dt;
    for (var i = 0; i < s.evs.length; i++) {
      var e = s.evs[i];
      e.pr = (e.pr + dt * (e.sp / 3000)) % 1;
      s.evDots[i].setAttribute('cx', 24 + e.pr * 258);
      s.evDots[i].setAttribute('cy', e.y);
    }
    var v = cfg.epsBase + cfg.epsJit * Math.sin(s.t / 700 + 1);
    s.eps.textContent = v.toFixed(2) + 'M';
    s.spark.setAttribute('stroke', Math.sin(s.t / 400) > 0.3 ? 'rgba(0,204,255,0.8)' : 'rgba(0,153,255,0.5)');
  };

  /* ---- 6. A/B Testing: table + narrowing CI + WINNER --------------------- */
  BUILD.ab = function (s) {
    var g = s.g, cfg = CONFIG.ab;
    defsGrad(g, 'abg' + s.i, CX, CY);
    var colsX = [16, 104, 176, 246, 306];
    cfg.cols.forEach(function (c, i) {
      if (i === 0) return;
      T(colsX[i], 24, c, { size: 6.5 }, g);
    });
    s.rowA = [];
    s.rowB = [];
    T(16, 44, 'A', { size: 9, weight: 800, family: DISPLAY, fill: CX }, g);
    ['views', 'conv', 'rate', 'lift'].forEach(function (f, i) {
      s.rowA.push(T(colsX[i + 1], 44, cfg.rows.A[f], { size: 8 }, g));
    });
    T(16, 62, 'B', { size: 9, weight: 800, family: DISPLAY, fill: CY }, g);
    ['views', 'conv', 'rate', 'lift'].forEach(function (f, i) {
      s.rowB.push(T(colsX[i + 1], 62, cfg.rows.B[f], { size: 8 }, g));
    });
    s.winnerBg = svg('path', { d: rr(100, 50, 300, 20, 8), fill: 'rgba(76,217,99,0.08)', opacity: 0 }, g);
    svg('path', { d: rr(120, 84, 260, 6, 3), fill: 'rgba(255,255,255,0.18)' }, g);
    s.ci = svg('rect', { x: 120, y: 86, width: 0, height: 2, rx: 1, fill: CY }, g);
    svg('line', { x1: 120, y1: 80, x2: 120, y2: 94, stroke: 'rgba(255,255,255,0.5)', 'stroke-width': 1 }, g);
    svg('line', { x1: 380, y1: 80, x2: 380, y2: 94, stroke: 'rgba(255,255,255,0.5)', 'stroke-width': 1 }, g);
    s.pTxt = T(332, 112, '', { size: 8 }, g);
    s.pLab = T(16, 112, 'confidence interval', { size: 6.5 }, g);
    var wb = svg('g', {}, g);
    s.win = { g: wb, pill: svg('path', { d: rr(-46, -12, 92, 24, 12), fill: 'url(#abg' + s.i + ')' }, wb), txt: T(0, 4.5, 'WINNER', { size: 9, anchor: 'middle', family: DISPLAY, weight: 800, fill: '#000000' }, wb) };
    s.win.g.setAttribute('transform', 'translate(352,52) scale(0)');
    s.total = cfg.runMs + cfg.holdMs + 700;
  };

  BUILD.ab.tick = function (s, dt) {
    var cfg = CONFIG.ab;
    s.t += dt;
    var el = s.t - s.cycleStart;
    if (s.live) { if (el >= s.total) { s.cycleStart = s.t; el = 0; s.win.g.setAttribute('transform', 'translate(352,52) scale(0)'); } }
    else if (el > s.total) { s.cycleStart = s.t - s.total; el = s.total; }
    el = Math.min(el, s.total);

    var pv = easeOut(clamp(el / cfg.runMs));
    var p = cfg.pStart + (cfg.pEnd - cfg.pStart) * pv;
    var from = cfg.ciFrom[0] + (cfg.ciTo[0] - cfg.ciFrom[0]) * pv;
    var to = cfg.ciFrom[1] + (cfg.ciTo[1] - cfg.ciFrom[1]) * pv;
    var x1 = 120 + (from + 5) / 45 * 260;
    var x2 = 120 + (to + 5) / 45 * 260;
    s.ci.setAttribute('x', x1);
    s.ci.setAttribute('width', x2 - x1);

    var shown = p < 0.05;
    s.pTxt.textContent = 'p = ' + p.toFixed(3);
    s.pTxt.setAttribute('fill', shown ? CG : CA);
    s.winnerBg.setAttribute('opacity', shown ? 1 : 0);
    var scale = shown ? 1 + 0.22 * Math.exp(-Math.max(0, el - cfg.runMs * 0.96) / 220) : 0;
    s.win.g.setAttribute('transform', 'translate(352,52) scale(' + Math.max(scale, shown ? 1 : 0) + ')');
    if (shown) s.win.g.setAttribute('opacity', Math.min(Math.max(el - cfg.runMs * 0.96, 0) * 0.01, 1));
  };

  var TICK = function (key) { return BUILD[key].tick; };

  /* ================================ engine ================================ */
  var items = [];
  var raf = null, last = 0;

  function fillCard(card, cfg) {
    var ns = card.querySelector('noscript');
    if (ns) ns.parentNode.removeChild(ns);
    var t = document.createElement('h3');
    t.className = 'bento-title';
    t.textContent = cfg.title;
    var d = document.createElement('p');
    d.className = 'bento-desc';
    d.textContent = cfg.desc;
    card.appendChild(t);
    card.appendChild(d);
  }

  function frame(now) {
    var dt = Math.min(now - last, 250);
    last = now;
    if (!document.hidden) {
      for (var i = 0; i < items.length; i++) {
        var s = items[i];
        if (s.on) TICK(s.key)(s, s.hot * dt);
      }
    }
    raf = requestAnimationFrame(frame);
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-viz]'), function (card) {
    var key = card.getAttribute('data-viz');
    var cfg = CONFIG[key];
    if (!cfg) return;
    fillCard(card, cfg);

    var s = { key: key, i: (items.length + 1) % 1000, t: 0, hot: 1, on: false, live: !rm, cycleStart: 0 };
    var viz = document.createElement('div');
    viz.className = 'bento-viz';
    viz.setAttribute('role', 'img');
    viz.setAttribute('aria-label', ARIA[key]);
    var g = svg('svg', { viewBox: VB, preserveAspectRatio: 'xMidYMid meet', 'aria-hidden': 'true' }, viz);
    s.g = g;
    BUILD[key](s);

    var chips = document.createElement('div');
    chips.className = 'expertise-tags';
    cfg.chips.forEach(function (ch) {
      var sp = document.createElement('span');
      sp.textContent = ch;
      chips.appendChild(sp);
    });
    card.appendChild(viz);
    card.appendChild(chips);

    card._s = s;

    if (rm) {
      s.t = 0;
      TICK(key)(s, 1e9);
      return;
    }

    items.push(s);
    if (typeof IntersectionObserver !== 'undefined') {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var st = en.target._s;
          if (st) st.on = en.isIntersecting;
        });
      }, { threshold: 0.05 });
      io.observe(card);
    } else {
      s.on = true;
    }
    var setHot = function (v) { return function () { s.hot = v; }; };
    card.addEventListener('pointerenter', setHot(2.4));
    card.addEventListener('pointerleave', setHot(1));
    card.addEventListener('focus', setHot(2.4));
    card.addEventListener('blur', setHot(1));
  });

  if (items.length) {
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
})();