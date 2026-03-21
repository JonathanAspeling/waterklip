/* ============================================================
   WATERKLIP — SCRIPT.JS
   Handles: navigation scroll state, mobile menu, scroll
   reveal animations, water drop ripple effect, contact form.
   ============================================================ */

/* ---------- HERO VIDEO AUTOPLAY ---------- */
(function initHeroVideo() {
  document.querySelectorAll('.hero-video').forEach(function(video) {
    video.playbackRate = 0.5;
    video.play().catch(function() {});
  });
})();


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


/* ---------- WATER DROP RIPPLE ---------- */
/*
 * The CSS handles all the visuals via keyframe animations.
 * This JS block does one thing: synchronises the animation-delay
 * on the drop and all ring/splash elements so they share the same
 * 4-second clock, and respects prefers-reduced-motion.
 *
 * The full timing sequence within each 4 s loop:
 *   0.00 s  drop fades in above surface
 *   ~2.60 s drop impacts surface  (65% × 4 s)
 *   ~2.60 s rings + splashes fire
 *   ~3.60 s rings fully faded — pause
 *   4.00 s  loop
 */
(function initRipple() {
  const canvas = document.querySelector('.hero-ripple-canvas');
  if (!canvas) return;

  // Respect user preference for reduced motion — pause all animations
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function applyMotionPreference() {
    const els = canvas.querySelectorAll(
      '.ripple-drop, .ripple-ring, .ripple-splash'
    );
    els.forEach(el => {
      el.style.animationPlayState = mediaQuery.matches ? 'paused' : 'running';
    });
  }

  mediaQuery.addEventListener('change', applyMotionPreference);
  applyMotionPreference();
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


