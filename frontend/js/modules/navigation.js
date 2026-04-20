/**
 * navigation.js — Nav sticky, menu mobile burger, back-to-top,
 *                 smooth scroll, accessibilité clavier
 */

// ── Navigation sticky + active link ──────────────────────────────────────────

export function initNavigation() {
  const header = document.getElementById('header');
  const burger = document.getElementById('nav-burger');
  const menu   = document.getElementById('nav-menu');
  const links  = document.querySelectorAll('.nav-link');
  if (!header) return;

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveLink();
    updateBackToTop();
  }

  function updateActiveLink() {
    let current = '';
    document.querySelectorAll('section[id]').forEach(section => {
      if (section.getBoundingClientRect().top <= 100) current = section.id;
    });
    links.forEach(link => {
      const href = link.getAttribute('href')?.replace('#', '');
      link.classList.toggle('active', href === current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menu mobile — overlay hors du header (#mobile-menu, pas #nav-menu)
  const mobileMenu = document.getElementById('mobile-menu');
  if (burger && mobileMenu) {
    const closeMenu = () => {
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Ouvrir le menu');
      document.body.style.overflow = '';
    };

    const openMenu = () => {
      mobileMenu.classList.add('open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      burger.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Fermer le menu');
      document.body.style.overflow = 'hidden';
      /* Focus sur le premier lien pour l'accessibilité clavier */
      mobileMenu.querySelector('.mobile-menu__link')?.focus();
    };

    burger.addEventListener('click', () => {
      mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
    });

    /* Fermeture au clic sur un lien */
    mobileMenu.querySelectorAll('.mobile-menu__link, .mobile-menu__tel').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    /* Fermeture clic en dehors */
    mobileMenu.addEventListener('click', e => {
      if (e.target === mobileMenu) closeMenu();
    });

    /* Fermeture touche Échap */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMenu();
        burger.focus();
      }
    });
  }
}

// ── Back to top ───────────────────────────────────────────────────────────────

export function updateBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (btn) btn.classList.toggle('visible', window.scrollY > 400);
}

export function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── Smooth scroll ancres ──────────────────────────────────────────────────────

export function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href   = anchor.getAttribute('href');
      if (href === '#' || href === '#!') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const headerH = document.getElementById('header')?.offsetHeight || 80;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - headerH, behavior: 'smooth' });
    });
  });
}

// ── Accessibilité : distinguer navigation clavier/souris ──────────────────────

export function initA11y() {
  document.addEventListener('mousedown', () => document.documentElement.classList.add('using-mouse'));
  document.addEventListener('keydown', e => {
    if (e.key === 'Tab') document.documentElement.classList.remove('using-mouse');
  });
}

// ── Année footer ──────────────────────────────────────────────────────────────

export function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}
