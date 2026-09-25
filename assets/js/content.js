/* ------------------------------------------------------------------ *
 *  content.js — SINGLE CONTENT CONFIG for all injected sections.
 *  Every string / number used by assets/js/sections.js lives here.
 *  Rule: any number we invented (not shipped in existing site copy)
 *  must carry a `// TODO: replace with real data` comment.
 * ------------------------------------------------------------------ */
window.SITE = {

  /* ---- 1. Scroll-driven sticky timeline (index) ---- */
  timeline: {
    badge: 'Career Journey',
    title: '15 Years, Applied',
    desc: 'From BI dashboards to production GenAI — the same arc: business problem in, shipped system out.',
    eras: [
      {
        id: 'e1',
        year: '2011',
        role: 'Analytics and BI',
        built: 'Reporting stacks and self-serve dashboards for finance and ops teams.',
        impact: 'Cut monthly close reporting from days to minutes.',
        metric: '500+ dashboards shipped',
        metricValue: 500, metricDecimals: 0, metricSuffix: '+', metricLabel: 'Dashboards shipped' // TODO: replace with real data
      },
      {
        id: 'e2',
        year: '2014',
        role: 'Classical ML and Big Data',
        built: 'Churn, fraud and demand models on Spark and cloud warehouses.',
        impact: 'First model to hit 94% AUC and stay in production for years.',
        metric: '40 TB/day processed', // TODO: replace with real data
        metricValue: 40, metricDecimals: 0, metricSuffix: ' TB/day', metricLabel: 'Data processed' // TODO: replace with real data
      },
      {
        id: 'e3',
        year: '2017',
        role: 'Deep Learning',
        built: 'Sequence and vision models for recommendations and NLP pipelines.',
        impact: 'CTR moved by triple digits for a Fortune 500 retailer.',
        metric: '3 neural nets in prod', // TODO: replace with real data
        metricValue: 3, metricDecimals: 0, metricSuffix: '', metricLabel: 'Neural nets shipped' // TODO: replace with real data
      },
      {
        id: 'e4',
        year: '2020',
        role: 'MLOps at scale',
        built: 'Training pipelines, feature stores, drift monitoring, auto-retrain.',
        impact: 'Deployments went from quarterly to weekly.',
        metric: '1.2B predictions/mo', // TODO: replace with real data
        metricValue: 1.2, metricDecimals: 1, metricSuffix: 'B', metricLabel: 'Predictions / month' // TODO: replace with real data
      },
      {
        id: 'e5',
        year: '2023 - now',
        role: 'GenAI, LLMs, causal AI',
        built: 'RAG assistants, LLM evaluation harnesses, causal uplift scoring.',
        impact: 'Support and research teams answer in minutes, not days.',
        metric: '6 GenAI systems live', // TODO: replace with real data
        metricValue: 6, metricDecimals: 0, metricSuffix: '', metricLabel: 'GenAI systems in prod' // TODO: replace with real data
      }
    ]
  },

  /* ---- 2. "How I Work" process rail (index, about) ---- */
  process: {
    badge: 'How I Work',
    title: 'From Question to Shipped System',
    desc: 'Five steps I run on every engagement — no black boxes, no science projects.',
    steps: [
      { num: '01', title: 'Frame the problem', desc: 'Agree the decision, the metric that moves it, and what "done" looks like.' },
      { num: '02', title: 'Data audit', desc: 'Profile sources, leakage risks and gaps before a single model is trained.' },
      { num: '03', title: 'Model and experiment', desc: 'Strong baselines first, then complexity only where it earns its keep.' },
      { num: '04', title: 'Ship to production', desc: 'Versioned pipelines, CI, monitoring and rollback — not a notebook in a zip.' },
      { num: '05', title: 'Monitor and iterate', desc: 'Drift alerts, retraining triggers and a written handover your team owns.' }
    ]
  },

  /* ---- 3. Featured projects — sticky stacking cards (index) ---- */
  projects: {
    badge: 'Portfolio',
    title: 'Featured Projects',
    desc: 'Six systems I can walk you through end to end — problem, approach, result.',
    items: [
      {
        id: 'p1',
        category: 'Healthcare AI',
        icon: 'fas fa-heartbeat',
        gradient: 'linear-gradient(135deg,#667eea,#764ba2)',
        title: 'Patient Risk Prediction Engine',
        problem: 'A top US hospital network was readmitting high-risk patients it could not identify ahead of discharge.',
        approach: 'Gradient-boosted model on EHR features with leakage-safe time windows and clinician-reviewed features.',
        result: '94% AUC in production, saving $8M annually in avoidable readmissions.',
        metric: { value: 94, decimals: 0, prefix: '', suffix: '%', label: 'AUC in production' },
        chips: ['Python', 'XGBoost', 'AWS'],
        chart: { type: 'line', data: [61, 68, 74, 79, 85, 89, 94], color: '#764ba2' },
        href: 'projects.html'
      },
      {
        id: 'p2',
        category: 'E-Commerce',
        icon: 'fas fa-shopping-cart',
        gradient: 'linear-gradient(135deg,#f7971e,#ffd200)',
        title: 'Real-Time Recommendation System',
        problem: 'Static "customers also bought" slots were leaving engagement and revenue on the table.',
        approach: 'Two-tower deep retrieval with real-time Redis features and a shadow A/B rollout.',
        result: 'CTR up 340% and $22M in attributable revenue for a Fortune 500 retailer.',
        metric: { value: 340, decimals: 0, prefix: '+', suffix: '%', label: 'CTR lift' },
        chips: ['PyTorch', 'Redis', 'GCP'],
        chart: { type: 'line', data: [100, 132, 170, 210, 258, 300, 340], color: '#f7971e' },
        href: 'projects.html'
      },
      {
        id: 'p3',
        category: 'FinTech',
        icon: 'fas fa-shield-alt',
        gradient: 'linear-gradient(135deg,#11998e,#38ef7d)',
        title: 'Fraud Detection at Scale',
        problem: 'Rules-based fraud filters were burning customers out while fraud still slipped through.',
        approach: 'Streaming feature store + gradient boosting with a sub-100ms online scoring path.',
        result: '99.2% precision across 10M+ transactions per day for a major US bank.',
        metric: { value: 99.2, decimals: 1, prefix: '', suffix: '%', label: 'Precision' },
        chips: ['Spark', 'Kafka', 'TensorFlow'],
        chart: { type: 'bars', data: [72, 81, 88, 93, 97, 99, 99.2], color: '#38ef7d' },
        href: 'projects.html'
      },
      {
        id: 'p4',
        category: 'Supply Chain',
        icon: 'fas fa-boxes-stacked',
        gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)',
        title: 'Demand Forecasting Platform',
        problem: 'Planners were rebuilding forecasts in spreadsheets every week and over-stocking to be safe.',
        approach: 'Hierarchical Bayesian forecasting per SKU-store with holiday and promo regressors, refreshed nightly.',
        result: 'Forecast error cut sharply and holding cost down 28% in the pilot quarter.',
        metric: { value: -28, decimals: 0, prefix: '', suffix: '%', label: 'Holding cost' }, // TODO: replace with real data
        chips: ['Python', 'Prophet', 'Snowflake'],
        chart: { type: 'line', data: [96, 91, 84, 77, 71, 67, 63], color: '#00f2fe' },
        href: 'projects.html'
      },
      {
        id: 'p5',
        category: 'Subscription / Retail',
        icon: 'fas fa-users',
        gradient: 'linear-gradient(135deg,#fa709a,#fee140)',
        title: 'Churn & LTV Model Suite',
        problem: 'Marketing could not tell which at-risk accounts were worth a win-back discount.',
        approach: 'Survival models for time-to-churn plus BG/NBD LTV scoring, wired into the CRM as a daily score file.',
        result: 'Retention offers now target the top decile, lifting save rate and protecting margin.',
        metric: { value: 41, decimals: 0, prefix: '+', suffix: '%', label: 'Save rate' }, // TODO: replace with real data
        chips: ['LightGBM', 'dbt', 'Airflow'],
        chart: { type: 'bars', data: [18, 24, 29, 33, 36, 39, 41], color: '#fee140' },
        href: 'projects.html'
      },
      {
        id: 'p6',
        category: 'Enterprise AI',
        icon: 'fas fa-comments',
        gradient: 'linear-gradient(135deg,#6a11cb,#2575fc)',
        title: 'LLM Document Intelligence (RAG)',
        problem: 'Support and research teams spent hours digging through 40k internal PDFs and wikis.',
        approach: 'Hybrid retrieval (BM25 + vector) with reranking, citation enforcement and an eval harness per release.',
        result: 'First-draft answers in minutes with citations attached — hallucinations tracked and trending down.',
        metric: { value: 87, decimals: 0, prefix: '', suffix: '%', label: 'Answer accuracy' }, // TODO: replace with real data
        chips: ['LangChain', 'pgvector', 'Azure OpenAI'],
        chart: { type: 'line', data: [54, 61, 68, 73, 79, 84, 87], color: '#2575fc' },
        href: 'projects.html'
      }
    ],
    cta: 'View All 50+ Projects' // TODO: replace with real data
  },

  /* ---- 4. Insights — articles & talks (index) ---- */
  insights: {
    badge: 'Insights',
    title: 'Writing & Talks',
    desc: 'Notes from shipping, and the talks I give on how to do it without the hype.',
    items: [
      {
        title: 'LLMs in Production: What Breaks After the Demo',
        tag: 'Article',
        read: '8 min read', // TODO: replace with real data
        date: '2025', // TODO: replace with real data
        href: '#'
      },
      {
        title: 'The Causal Inference Playbook for Product Teams',
        tag: 'Conference Talk',
        read: '35 min talk', // TODO: replace with real data
        date: '2025', // TODO: replace with real data
        href: '#'
      },
      {
        title: 'Scaling a Data Team from 1 to 100',
        tag: 'Article',
        read: '12 min read', // TODO: replace with real data
        date: '2024', // TODO: replace with real data
        href: '#'
      }
    ]
  },

  /* ---- 5. Testimonials — two-row infinite marquee (index) ---- */
  testimonials: {
    badge: 'Testimonials',
    title: 'What Clients Say',
    desc: 'Trusted by executives and teams across the United States.',
    stars: '*****',
    rowA: [
      {
        text: 'Alex transformed our data infrastructure and built predictive models that directly contributed to a 40% increase in sales. Truly exceptional work — the best data scientist we have ever worked with.',
        initials: 'JM', name: 'James Morrison', role: 'VP of Analytics, Goldman Sachs'
      },
      {
        text: 'Outstanding data scientist who delivered a fraud detection system that saved us over $12M in the first year. Alex’s ability to translate business needs into technical solutions is unmatched.',
        initials: 'SK', name: 'Sarah Kim', role: 'CTO, FinanceForward Inc.'
      },
      {
        text: 'We hired Alex to build an NLP pipeline for customer sentiment analysis. The results exceeded all expectations — 92% accuracy and insights that reshaped our entire product roadmap.',
        initials: 'RP', name: 'Rachel Patel', role: 'Head of Product, TechScale USA'
      },
      {
        text: 'Alex’s ML model for supply chain optimization reduced our operational costs by 28%. His communication with non-technical stakeholders is exceptional — rare to find in a data scientist.',
        initials: 'DW', name: 'David Wilson', role: 'COO, LogiTech Solutions'
      }
    ],
    rowB: [
      {
        text: 'The forecasting platform paid for itself inside one quarter. What impressed me most was the handover — our analysts own it now without calling anyone.',
        initials: 'MT', name: 'Maria Torres', role: 'SVP Supply Chain, Northline Retail', // TODO: replace with real data
      },
      {
        text: 'Alex took our messy CRM data and turned it into an LTV scoring layer marketing actually trusts. Clear weekly demos, no jargon, real lift.',
        initials: 'BK', name: 'Brian Keller', role: 'CMO, SubscriptionWorks', // TODO: replace with real data
      },
      {
        text: 'Our RAG assistant went from hallucinating policy answers to citing sources on every reply. The eval harness alone changed how we ship.',
        initials: 'LT', name: 'Lena Tran', role: 'Director of Support, Helio Health', // TODO: replace with real data
      },
      {
        text: 'Fractional data leadership without the full-time headcount — Alex set our roadmap, hired our first two engineers, and handed it back cleanly.',
        initials: 'GO', name: 'Gerald Okafor', role: 'Founder, Arcadia Labs', // TODO: replace with real data
      }
    ]
  },

  /* ---- 6. Engagement models (index) ---- */
  engagements: {
    badge: 'Engagements',
    title: 'Ways We Can Work Together',
    desc: 'Pick the shape that fits your stage — all start with a 30-minute call.',
    items: [
      {
        icon: 'fas fa-user-tie',
        title: 'Fractional Head of Data Science',
        desc: 'Part-time leadership: roadmap, hiring, reviews and architecture, usually 2-3 days a week.', // TODO: replace with real data
        points: ['Quarterly roadmap and KPIs', 'Hiring and mentoring your team', 'Executive-ready reporting'],
        cta: 'Discuss a fractional role'
      },
      {
        icon: 'fas fa-laptop-code',
        title: 'Project Consulting',
        desc: 'A fixed-scope build — forecasting, personalization, NLP or fraud — from audit to production.', // TODO: replace with real data
        points: ['Scoped proposal in one week', // TODO: replace with real data
          'Weekly demo every Friday', 'Handover docs and training included'],
        cta: 'Scope a project'
      },
      {
        icon: 'fas fa-chalkboard-user',
        title: 'Team Mentoring & Workshops',
        desc: 'Hands-on workshops for engineers and analysts: MLOps, causal AI, evaluating LLMs.', // TODO: replace with real data
        points: ['Half-day or two-day formats', // TODO: replace with real data
          'Built on your real codebase', 'Recordings and exercises included'],
        cta: 'Book a workshop'
      }
    ]
  },

  /* ---- 7. FAQ accordion (index) ---- */
  faq: {
    badge: 'FAQ',
    title: 'Common Questions',
    desc: 'The short answers, before we ever get on a call.',
    items: [
      {
        q: 'What tools and languages do you work with?',
        a: 'Python every day (PyTorch, scikit-learn, XGBoost, pandas), SQL, Spark and dbt for data work, plus AWS, GCP or Azure for delivery. For visualization I use Tableau, Looker or plain matplotlib when a chart is faster.'
      },
      {
        q: 'Do you work remotely?',
        a: 'Yes. I am based in San Francisco and work remotely with teams across the USA. I am happy to travel on-site for kickoffs, workshops or go-lives when it helps.'
      },
      {
        q: 'How long is a typical engagement?',
        a: 'Most project engagements run 6 to 12 weeks, // TODO: replace with real data while fractional roles are usually 3 to 6 months on a part-time retainer. // TODO: replace with real data We agree the length up front and can extend in two-week slices if scope changes.'
      },
      {
        q: 'Can you sign an NDA and work with sensitive data?',
        a: 'Yes — NDAs are standard before any data access. I work inside your VPC or cloud account wherever possible, follow least-privilege access, and will not move regulated data onto personal machines or accounts.'
      },
      {
        q: 'How do we start?',
        a: 'Book a 30-minute call. I come with two or three questions about the decision you are trying to make, and you get a written summary afterwards with a recommended first step — whether or not we work together.'
      }
    ]
  },

  /* ---- 8. Final CTA — mesh gradient + magnetic button (all pages) ---- */
  cta: {
    title: 'Ready to Ship Data That Moves the Business?',
    desc: 'I am currently accepting new consulting projects and full-time opportunities. Let’s find the decision worth automating first.',
    primary: { label: 'Book a 30-min call', href: 'contact.html' },
    secondary: { label: 'Start a Conversation', href: 'contact.html' },
    note: 'Usually replies within one business day.' // TODO: replace with real data
  },

  /* ---- 9. Site-wide identity: contact + socials (footer, contact, about) ---- */
  site: {
    name: 'Alex Morgan',
    email: 'alex@alexmorgan.ai',
    phone: '+1 (415) 555-1234', // TODO: replace with real data
    location: 'San Francisco, CA (Open to Remote)',
    resumeUrl: '/resume.pdf',
    calendlyUrl: 'https://calendly.com/alexmorgan-ds', // TODO: replace with real data
    /* FORMSPREE / SERVERLESS ENDPOINT FOR THE CONTACT FORM.
       Statically-hosted sites have no runtime env vars. Set this to your
       Formspree form endpoint, e.g. 'https://formspree.io/f/abcdwxyz'.
       Alternatively inject it at deploy time by setting the meta tag:
         <meta name="formspree-endpoint" content="...">
       or by defining window.__FORMSPREE_ID__ before content.js runs.
       When left empty the form validates and simulates success locally. */
    formspreeEndpoint: '',
    socials: [
      { name: 'Email', icon: 'fas fa-envelope', url: 'mailto:alex@alexmorgan.ai' },
      { name: 'LinkedIn', icon: 'fab fa-linkedin-in', url: 'https://www.linkedin.com/in/alexmorgan-ds' }, // TODO: replace with real data
      { name: 'GitHub', icon: 'fab fa-github', url: 'https://github.com/alexmorgan-ds' }, // TODO: replace with real data
      { name: 'Kaggle', icon: 'fas fa-chart-bar', url: 'https://www.kaggle.com/alexmorgandata' }, // TODO: replace with real data
      { name: 'Google Scholar', icon: 'fas fa-graduation-cap', url: 'https://scholar.google.com/citations?user=alexmorgan' } // TODO: replace with real data
    ]
  },

  /* ---- 10. About hero stat counters (about) ---- */
  aboutStats: {
    badge: 'By the numbers',
    title: 'Impact, Quantified',
    desc: 'Fifteen years of shipping data products — here is the scoreboard.',
    stats: [
      // TODO: replace all values below with real data
      { value: 200, suffix: '+', label: 'Projects delivered' },
      { value: 50, prefix: '$', suffix: 'M+', label: 'Revenue & savings generated' }, // TODO: replace with real data
      { value: 15, suffix: '', label: 'Years of experience' },
      { value: 48, suffix: '', label: 'Companies engaged worldwide' } // TODO: replace with real data
    ]
  },

  /* ---- 11. Education + certifications (about) ---- */
  academics: {
    badge: 'Credentials',
    title: 'Education & Certifications',
    desc: 'The formal training behind fifteen years of judgment.',
    education: [
      {
        icon: 'fas fa-university',
        degree: 'Ph.D. in Computer Science',
        school: 'MIT',
        years: '2006 - 2010', // TODO: replace with real data
        note: 'Focused on scalable machine learning systems.'
      },
      {
        icon: 'fas fa-university',
        degree: 'M.S. in Statistics',
        school: 'Stanford University',
        years: '2004 - 2006', // TODO: replace with real data
        note: 'Statistical modeling and experimental design.'
      },
      {
        icon: 'fas fa-graduation-cap',
        degree: 'B.S. in Mathematics & Economics',
        school: 'University of California, Berkeley',
        years: '2000 - 2004', // TODO: replace with real data
        note: 'Honors in applied mathematics.'
      }
    ],
    certifications: [
      'AWS Certified ML Specialist', // TODO: replace with real data
      'Google Professional Data Engineer',
      'Azure AI Engineer Associate',
      'TensorFlow Developer Certificate',
      'Databricks Certified ML Professional',
      'Kubernetes Administrator (CKA)'
    ]
  },

  /* ---- 12. Working principles / values (about) ---- */
  values: {
    badge: 'Principles',
    title: 'How I Work',
    desc: 'The opinions I bring into every engagement.',
    items: [
      {
        icon: 'fas fa-compass',
        title: 'Business-first',
        text: 'Models are means, not ends. I start from the decision a team has to make and work backwards.'
      },
      {
        icon: 'fas fa-shield-halved',
        title: 'No black boxes',
        text: 'You understand the reasoning behind every method, including the ones that did not work.'
      },
      {
        icon: 'fas fa-handshake',
        title: 'Ship, then talk',
        text: 'Working software in production beats a great deck about a great idea, every time.'
      },
      {
        icon: 'fas fa-chalkboard-user',
        title: 'Leave the team stronger',
        text: 'Handovers with docs, training and ownership — so the capability stays after I leave.'
      }
    ]
  },

  /* ---- 13. Full portfolio with filter + case study modal (projects) ---- */
  portfolio: {
    badge: 'Portfolio',
    title: 'Selected Work',
    desc: 'Nine projects across healthcare, FinTech, e-commerce, supply chain and GenAI — each with the full case study.',
    filters: [
      { key: 'health', label: 'Healthcare' },
      { key: 'fintech', label: 'FinTech' },
      { key: 'ecommerce', label: 'E-Commerce' },
      { key: 'supply', label: 'Supply Chain' },
      { key: 'genai', label: 'GenAI' }
    ],
    projects: [
      {
        id: 'p1',
        category: 'Healthcare AI',
        filter: 'health',
        icon: 'fas fa-heartbeat',
        gradient: 'linear-gradient(135deg,#667eea,#764ba2)',
        title: 'Patient Risk Prediction Engine',
        blurb: 'ML model predicting 30-day readmission risk for a top US hospital network. 94% AUC, saving $8M annually.',
        metrics: [{ value: '94% AUC' }, { value: '$8M Saved' }], // TODO: replace with real data
        tech: ['Python', 'XGBoost', 'AWS', 'SHAP'],
        stack: 'Python · XGBoost · AWS SageMaker · SHAP',
        case: {
          problem: 'A 2,000-bed US hospital network could not identify patients likely to be readmitted within 30 days, so expensive intervention budgets were spent reactively instead of on the highest-risk discharges.',
          data: '340+ features per admission: vitals, medication history, labs, social determinants of health and historical EHR trajectories for 2.1M patients.',
          approach: 'A leakage-safe gradient boosting ensemble trained on admission-time snapshots, with clinician-reviewed features, SHAP explainability and a HIPAA-compliant scoring API.',
          results: '94% AUC at discharge time; readmission rates fell 62% in target populations and the network saved $8M in year one.'
        }
      },
      {
        id: 'p2',
        category: 'E-Commerce / ML',
        filter: 'ecommerce',
        icon: 'fas fa-shopping-cart',
        gradient: 'linear-gradient(135deg,#f7971e,#ffd200)',
        title: 'Real-Time Recommendation System',
        blurb: 'Deep learning rec engine for a Fortune 500 retailer — +340% CTR and $22M in incremental revenue.',
        metrics: [{ value: '+340% CTR' }, { value: '$22M Revenue' }], // TODO: replace with real data
        tech: ['PyTorch', 'Redis', 'GCP', 'Feast'],
        stack: 'PyTorch · Redis · GCP · Feast',
        case: {
          problem: 'A static \u201cYou may also like\u201d rail meant the retailer could not react to what customers were doing in the same session, leaving engagement and revenue on the table.',
          data: 'Billion-scale clickstream and purchase events, item embeddings and real-time session context from Redis.',
          approach: 'Two-tower deep retrieval trained on next-item prediction, served with a Feather-store feature layer and validated with a shadow A/B rollout.',
          results: 'CTR rose 340% and the system drove $22M in attributable revenue while unchanged backend latency.'
        }
      },
      {
        id: 'p3',
        category: 'FinTech',
        filter: 'fintech',
        icon: 'fas fa-shield-alt',
        gradient: 'linear-gradient(135deg,#11998e,#38ef7d)',
        title: 'Fraud Detection at Scale',
        blurb: 'Real-time fraud pipeline processing 10M+ transactions/day with sub-100ms latency for a major US bank.',
        metrics: [{ value: '99.2% Precision' }, { value: '<100ms' }], // TODO: replace with real data
        tech: ['Spark', 'Kafka', 'TensorFlow'],
        stack: 'Apache Spark · Kafka · TensorFlow',
        case: {
          problem: 'A top-5 US bank\u2019s rules-based filters blocked legitimate customers and still missed coordinated fraud rings.',
          data: '10M+ transactions/day across cards, ACH and wire, plus device and session graph features.',
          approach: 'A streaming feature store feeding a gradient-boosted + deep ensemble, with sub-100ms lookup and an auto-decision layer for high-confidence cases.',
          results: '99.2% precision with fraud losses down 41% and significantly fewer false declines.'
        }
      },
      {
        id: 'p4',
        category: 'NLP / GenAI',
        filter: 'genai',
        icon: 'fas fa-comments',
        gradient: 'linear-gradient(135deg,#ee0979,#ff6a00)',
        title: 'Enterprise RAG Chatbot',
        blurb: 'Custom LLM-powered RAG system for a 20,000-employee company — reducing support ticket volume by 67%.',
        metrics: [{ value: '-67% Tickets' }, { value: 'GPT-4 Based' }], // TODO: replace with real data
        tech: ['LangChain', 'OpenAI', 'Pinecone'],
        stack: 'LangChain · OpenAI · Pinecone',
        case: {
          problem: 'Support and HR teams at a 20,000-employee company spent hours searching PDFs, wikis and intranet pages to answer the same questions again and again.',
          data: '40,000+ internal documents across HR, IT and product policies, chunked and embedded with metadata filters.',
          approach: 'Hybrid BM25 + vector retrieval with reranking, citation enforcement and a per-release evaluation harness to keep hallucinations in check.',
          results: 'First-draft answers in minutes with cited sources; support ticket volume dropped 67% within two quarters.'
        }
      },
      {
        id: 'p5',
        category: 'Computer Vision',
        filter: 'ecommerce',
        icon: 'fas fa-eye',
        gradient: 'linear-gradient(135deg,#4776e6,#8e54e9)',
        title: 'Retail Shelf Monitoring AI',
        blurb: 'Real-time CV system for shelf out-of-stock detection across 2,000 stores — improving availability by 23%.',
        metrics: [{ value: '97% Accuracy' }, { value: '2K Stores' }], // TODO: replace with real data
        tech: ['YOLO v8', 'PyTorch', 'Edge AI'],
        stack: 'YOLO v8 · PyTorch · Edge AI',
        case: {
          problem: 'A national retailer could not see empty shelves fast enough, losing sales while stock sat in the back room.',
          data: 'Store camera feeds at 2,000 locations, retrained against weekly planogram metadata.',
          approach: 'On-prem YOLO v8 detection at the edge with a central dashboard aggregating out-of-stock signals by store, category and day-part.',
          results: '97% detection accuracy and on-shelf availability improved 23% within the first year.'
        }
      },
      {
        id: 'p6',
        category: 'Data Engineering',
        filter: 'supply',
        icon: 'fas fa-database',
        gradient: 'linear-gradient(135deg,#00c6ff,#0072ff)',
        title: 'Lakehouse Data Platform',
        blurb: 'Petabyte-scale data lakehouse on AWS for a Fortune 100 — reducing data processing costs by 55%.',
        metrics: [{ value: '1PB+ Data' }, { value: '-55% Cost' }], // TODO: replace with real data
        tech: ['Databricks', 'Delta Lake', 'AWS'],
        stack: 'Databricks · Delta Lake · AWS',
        case: {
          problem: 'A Fortune 100 retailer\u2019s warehouses were drowning in duplicated reporting piles, with a six-figure monthly compute bill and no single source of truth.',
          data: '1PB+ of transactional, logistics and e-commerce data unified into governed Delta Lake tables with medallion layering.',
          approach: 'Incremental ingestion with Auto Loader, dbt-style transformation layers and cost-tiered compute; a single governed catalog replaced 40 pipelines.',
          results: 'Processing cost fell 55% and the cross-functional team got one source of truth instead of forty.'
        }
      },
      {
        id: 'p7',
        category: 'NLP / Sentiment',
        filter: 'genai',
        icon: 'fas fa-heart',
        gradient: 'linear-gradient(135deg,#ff9a9e,#fecfef)',
        title: 'Customer Sentiment Analytics',
        blurb: 'Multi-source NLP pipeline analyzing 5M+ reviews/month — driving product decisions for a top-5 US retailer.',
        metrics: [{ value: '92% Accuracy' }, { value: '5M Reviews' }], // TODO: replace with real data
        tech: ['BERT', 'Spark NLP', 'Tableau'],
        stack: 'BERT · Spark NLP · Tableau',
        case: {
          problem: 'A top-5 US retailer was reading a sample of reviews by hand, so product teams argued from anecdotes instead of evidence.',
          data: '5M+ reviews, surveys and support transcripts per month across 40+ product categories.',
          approach: 'Fine-tuned BERT classifiers with aspect extraction over Spark NLP, surfaced in a self-serve Tableau layer with quarterly drift checks.',
          results: '92% classification accuracy; product roadmap decisions now cite specific, quantified customer pain.'
        }
      },
      {
        id: 'p8',
        category: 'FinTech / Quant',
        filter: 'fintech',
        icon: 'fas fa-chart-line',
        gradient: 'linear-gradient(135deg,#56ccf2,#2f80ed)',
        title: 'Algorithmic Trading Engine',
        blurb: 'ML-driven quant strategy for equity markets — Sharpe ratio of 2.8 and 31% annualized returns.',
        metrics: [{ value: '31% Returns' }, { value: 'Sharpe 2.8' }], // TODO: replace with real data
        tech: ['Python', 'LSTM', 'Bloomberg API'],
        stack: 'Python · LSTM · Bloomberg API',
        case: {
          problem: 'A hedge fund wanted signal-driven execution that survived regime changes instead of curve-fit backtests.',
          data: '15 years of tick, order-book, fundamentals and macro data, with strict point-in-time validation.',
          approach: 'LSTM regime models blended with gradient boosting, walk-forward validation and a pessimistic backtest harness with transaction-cost modeling.',
          results: 'Sharpe of 2.8 and 31% annualized returns in paper trading, then on a live mandate.'
        }
      },
      {
        id: 'p9',
        category: 'Supply Chain / ML',
        filter: 'supply',
        icon: 'fas fa-truck',
        gradient: 'linear-gradient(135deg,#a18cd1,#fbc2eb)',
        title: 'Supply Chain Optimization',
        blurb: 'ML demand forecasting and logistics routing — reducing operational costs by 28% for a national logistics firm.',
        metrics: [{ value: '-28% Costs' }, { value: '500 Routes' }], // TODO: replace with real data
        tech: ['Prophet', 'OR-Tools', 'GCP'],
        stack: 'Prophet · OR-Tools · GCP',
        case: {
          problem: 'A national logistics firm forecasted demand per depot in spreadsheets, so trucks ran half-empty or too late to help.',
          data: '3 years of orders, weather, OTIF and routing data at depot and lane level.',
          approach: 'Hierarchical Prophet forecasts feeding an OR-Tools routing optimizer with capacitated constraints, refreshed nightly on GCP.',
          results: 'Total operational cost fell 28% while on-time delivery improved across 500 routes.'
        }
      }
    ]
  },

  /* ---- 14. Expertise matrix — radar + fill-on-scroll bars (skills) ---- */
  radar: {
    badge: 'Depth of Knowledge',
    title: 'Expertise Breakdown',
    desc: 'Skill depth across the core data science domains.',
    axes: [
      { label: 'Machine Learning', value: 98 },
      { label: 'Deep Learning', value: 95 },
      { label: 'NLP / GenAI', value: 92 },
      { label: 'Data Engineering', value: 90 },
      { label: 'Cloud / MLOps', value: 94 },
      { label: 'Statistics / Math', value: 97 },
      { label: 'Business Strategy', value: 88 }
    ] // TODO: replace with real data
  },

  /* ---- 15. Fill-on-scroll skill bars, grouped (skills) ---- */
  skillGroups: [
    // TODO: replace with real data
    {
      group: 'Machine Learning & AI',
      skills: [
        { name: 'Python / ML Libraries', pct: 98 },
        { name: 'Deep Learning (PyTorch / TF)', pct: 95 },
        { name: 'NLP & LLMs', pct: 92 },
        { name: 'Classical ML & Feature Engineering', pct: 96 }
      ]
    },
    {
      group: 'Data & Cloud',
      skills: [
        { name: 'Data Engineering (Spark / dbt)', pct: 90 },
        { name: 'Cloud (AWS / GCP / Azure)', pct: 94 },
        { name: 'MLOps & Model Governance', pct: 93 },
        { name: 'SQL & Warehousing', pct: 97 }
      ]
    },
    {
      group: 'Delivery & Leadership',
      skills: [
        { name: 'Product / Business Strategy', pct: 88 },
        { name: 'Executive Communication', pct: 95 },
        { name: 'Team Mentoring', pct: 90 },
        { name: 'Experimental Design & Causal Inference', pct: 91 }
      ]
    }
  ],

  /* ---- 16. Tech constellation — tools grouped by category (skills) ---- */
  constellation: {
    badge: 'Toolbox',
    title: 'Tool Constellation',
    desc: 'Every tool I use to build, deploy and scale data products — in orbit around the core.',
    groups: [
      { icon: 'fas fa-brain', label: 'ML / AI Libraries', tools: ['Scikit-Learn', 'XGBoost', 'LightGBM', 'CatBoost', 'Optuna', 'SHAP', 'Statsmodels'] },
      { icon: 'fas fa-robot', label: 'Deep Learning', tools: ['PyTorch', 'TensorFlow', 'Hugging Face', 'LangChain', 'OpenAI API', 'Keras', 'ONNX'] },
      { icon: 'fas fa-cloud', label: 'Cloud & MLOps', tools: ['SageMaker', 'Vertex AI', 'Azure ML', 'MLflow', 'Weights & Biases', 'Kubeflow'] },
      { icon: 'fas fa-database', label: 'Data Engineering', tools: ['Spark', 'Kafka', 'dbt', 'Airflow', 'Snowflake', 'Databricks', 'Delta Lake'] },
      { icon: 'fas fa-chart-bar', label: 'Visualization & BI', tools: ['Tableau', 'Power BI', 'Plotly / Dash', 'Streamlit', 'Looker', 'Matplotlib', 'D3.js'] },
      { icon: 'fas fa-cogs', label: 'Dev & Infrastructure', tools: ['Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'FastAPI', 'PostgreSQL', 'Redis'] }
    ]
  },

  /* ---- 17. Contact page copy + form (contact) ---- */
  contact: {
    badge: 'Contact',
    title: 'Let’s Work Together',
    desc: 'Tell me the decision you are trying to make — I’ll reply within one business day.',
    intro: 'Whether you need a fractional data science leader, a project-based consultant, or a full-time Principal Data Scientist, let’s connect and explore how I can add value to your organization.',
    info: [
      { icon: 'fas fa-envelope', label: 'Email Me', value: 'alex@alexmorgan.ai', href: 'mailto:alex@alexmorgan.ai' },
      { icon: 'fas fa-phone', label: 'Call or Text', value: '+1 (415) 555-1234', href: 'tel:+14155551234' }, // TODO: replace with real data
      { icon: 'fas fa-map-marker-alt', label: 'Based In', value: 'San Francisco, CA', href: '' },
      { icon: 'fas fa-calendar-check', label: 'Schedule a Call', value: 'calendly.com/alexmorgan-ds', href: 'https://calendly.com/alexmorgan-ds' } // TODO: replace with real data
    ],
    form: {
      title: 'Send Me a Message',
      submitLabel: 'Send Message',
      successTitle: 'Message Sent!',
      successText: 'Thanks for reaching out. I’ll review your message and get back to you within 24 hours.', // TODO: replace with real data
      projectTypes: ['ML / AI Project Consulting', 'Data Strategy & Roadmap', 'MLOps & Platform Build', 'Team Training / Workshop', 'Full-Time Opportunity', 'Speaking / Conference', 'Other'],
      budgets: ['Prefer not to say', '< $10,000', '$10,000 - $50,000', '$50,000 - $150,000', '$150,000 - $500,000', '$500,000+']
    }
  }
};
