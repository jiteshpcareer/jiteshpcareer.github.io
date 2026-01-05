// Basic interactions: theme toggle, typing effect, smooth scroll, modal, progress animation
(function () {
  // --- Utilities ---
  const qs = (s) => document.querySelector(s);
  const qsa = (s) => document.querySelectorAll(s);

  // --- Theme toggle with persistence ---
  const root = document.documentElement;
  const THEME_KEY = 'theme-preference';
  const themeBtn = qs('#theme-toggle');
  const themeIcon = qs('#theme-icon');

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      themeIcon.textContent = '☀️';
    } else {
      root.removeAttribute('data-theme');
      themeIcon.textContent = '🌙';
    }
  }

  // load saved or prefer-color-scheme
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) applyTheme(savedTheme);
  else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  themeBtn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  // --- Typing effect (simple) ---
  const typedEl = qs('#typed');
  const typedText = ['Data Analyst', 'SQL & Power BI Enthusiast', 'Cloud Explorer'];
  let tIndex = 0, charIndex = 0, isDeleting = false;

  function typeLoop() {
    const txt = typedText[tIndex];
    typedEl.textContent = isDeleting ? txt.substring(0, charIndex--) : txt.substring(0, ++charIndex);
    if (!isDeleting && charIndex === txt.length) {
      isDeleting = true;
      setTimeout(typeLoop, 900);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      tIndex = (tIndex + 1) % typedText.length;
      setTimeout(typeLoop, 300);
    } else {
      setTimeout(typeLoop, isDeleting ? 40 : 80);
    }
  }
  typeLoop();

  // --- Smooth scroll for nav links ---
  qsa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Modal for project details ---
  const modal = qs('#project-modal');
  const modalContent = qs('#modal-content');
  const modalClose = qs('#modal-close');

  // project details data (simple map). You can expand these with images & links.
  const projectData = {
    1: {
      title: 'Learning Compass',
      body: `<p>Comprehensive platform to help migrant families navigate the Victorian education system. Data architecture (MySQL), ETL pipelines, and interactive visualisations.</p>
             <p><strong>Tech:</strong> MySQL, AWS Amplify, ReactJS, Python (ETL)</p>`
    },
    2: {
      title: 'Retail Operations Dashboard',
      body: `<p>Power BI dashboards to monitor KPIs, sales trends and inventory — helped improve operations by ~15%.</p>
             <p><strong>Tech:</strong> Power BI, SQL Server</p>`
    },
    3: {
      title: 'Healthcare Data Integration',
      body: `<p>ETL and SQL solutions to integrate EMR datasets across providers. Improved data integrity and reporting reliability.</p>
             <p><strong>Tech:</strong> SQL, ETL Pipelines</p>`
    }
  };

  qsa('.open-project').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-project');
      const data = projectData[id];
      if (!data) return;
      modalContent.innerHTML = `<h3>${data.title}</h3>${data.body}<p style="margin-top:1rem"><a href="https://github.com/jiteshpurohit" target="_blank" rel="noreferrer">View repository</a></p>`;
      modal.setAttribute('aria-hidden', 'false');
    });
  });
  modalClose.addEventListener('click', () => modal.setAttribute('aria-hidden', 'true'));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.setAttribute('aria-hidden', 'true'); });

  // --- Progress bars animate on scroll ---
  const progressEls = qsa('.progress span');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const value = el.getAttribute('data-progress') || '60';
          el.style.width = value + '%';
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.35 });
    progressEls.forEach(p => obs.observe(p));
  } else {
    // fallback
    progressEls.forEach(p => p.style.width = (p.getAttribute('data-progress') || '60') + '%');
  }

  // --- Contact form handler (mailto fallback) ---
  window.handleContact = function (ev) {
    ev.preventDefault();
    const form = ev.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !email || !message) return alert('Please fill all fields');

    const subject = encodeURIComponent(`Website message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    // mailto fallback
    window.location.href = `mailto:jiteshpurohitcareer@gmail.com?subject=${subject}&body=${body}`;
  };

  // set footer year
  qs('#year').textContent = new Date().getFullYear();

})();
