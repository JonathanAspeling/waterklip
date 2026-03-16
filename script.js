/* ============================================================
   WATERKLIP — SCRIPT.JS
   Handles: navigation scroll state, mobile menu, scroll
   reveal animations, particle generation, contact form.
   ============================================================ */

/* ---------- NAV SCROLL STATE ---------- */
(function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  function updateNav() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav(); // run on load in case of refresh mid-page
})();


/* ---------- MOBILE HAMBURGER MENU ---------- */
(function initMobileMenu() {
  const hamburger = document.querySelector('.nav-hamburger');
  const drawer    = document.querySelector('.nav-drawer');
  const overlay   = document.querySelector('.nav-overlay');

  if (!hamburger || !drawer || !overlay) return;

  function openMenu() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    if (hamburger.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  // Close on drawer link click
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
})();


/* ---------- SCROLL REVEAL ---------- */
(function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once revealed, no need to observe further
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => observer.observe(el));
})();


/* ---------- HERO PARTICLES ---------- */
(function initParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;

  // Reduce particles on mobile for performance
  const count = window.innerWidth < 600 ? 10 : 22;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    const size   = Math.random() * 18 + 4;   // 4–22px
    const left   = Math.random() * 100;       // 0–100%
    const delay  = Math.random() * 12;        // 0–12s delay
    const dur    = Math.random() * 12 + 8;    // 8–20s duration
    const opacity = Math.random() * 0.25 + 0.05;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: ${Math.random() * 20}%;
      animation-delay: -${delay}s;
      animation-duration: ${dur}s;
      opacity: ${opacity};
      background: rgba(255,255,255,${opacity * 2});
    `;

    container.appendChild(p);
  }
})();


/* ---------- COUNTER ANIMATION (STATS BAR) ---------- */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el     = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const dur    = 1800;  // ms
        const step   = 16;    // ~60fps frame
        const steps  = dur / step;
        let current  = 0;

        const ticker = setInterval(() => {
          current += target / steps;
          if (current >= target) {
            current = target;
            clearInterval(ticker);
          }
          el.textContent = Math.floor(current).toLocaleString('af-ZA') + suffix;
        }, step);

        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
})();


/* ---------- CONTACT FORM ---------- */
(function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Simple client-side validation
    const name    = form.querySelector('[name="naam"]');
    const email   = form.querySelector('[name="epos"]');
    const message = form.querySelector('[name="boodskap"]');

    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
      // Shake the submit button as feedback
      const btn = form.querySelector('.btn-submit');
      btn.style.animation = 'none';
      btn.offsetHeight; // reflow
      btn.style.animation = 'shake 0.4s ease';
      return;
    }

    // Simulate sending (in production, wire up to a form backend / email service)
    const submitBtn = form.querySelector('.btn-submit');
    submitBtn.textContent = 'Besig...';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      if (success) {
        success.style.display = 'block';
      }
    }, 1000);
  });
})();


/* ---------- SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80; // nav height
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ---------- SHAKE KEYFRAME (injected at runtime) ---------- */
(function addShakeKeyframe() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-6px); }
      40%       { transform: translateX(6px); }
      60%       { transform: translateX(-4px); }
      80%       { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(style);
})();
