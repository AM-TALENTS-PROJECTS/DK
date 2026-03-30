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

  // Menu burger mobile
  if (burger && menu) {
    const closeMenu = () => {
      menu.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    burger.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    menu.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('click', e => {
      if (menu.classList.contains('open') && !menu.contains(e.target) && !burger.contains(e.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
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
