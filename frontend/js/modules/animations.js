/**
 * animations.js — Loading screen, scroll reveal, compteurs,
 *                 parallax hero, curseur personnalisé
 */
import { easeOutQuart, formatNumber, debounce } from '../utils/helpers.js';

// ── Loading screen ────────────────────────────────────────────────────────────

export function initLoadingScreen() {
  const screen = document.getElementById('loading-screen');
  const bar    = document.getElementById('loading-bar');
  if (!screen || !bar) return;

  let progress = 0;
  const interval = setInterval(() => {
    const increment = progress < 50 ? 4 : progress < 80 ? 1.5 : 3;
    progress = Math.min(100, progress + increment);
    bar.style.width = progress + '%';

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        screen.classList.add('hidden');
        document.querySelectorAll('.hero .reveal-up').forEach(el => el.classList.add('visible'));
        document.querySelector('.hero')?.classList.add('loaded');
      }, 300);
    }
  }, 28);

  // Garde-fou : masquer après 3s même si les ressources n'ont pas chargé
  setTimeout(() => {
    clearInterval(interval);
    screen.classList.add('hidden');
    document.querySelectorAll('.hero .reveal-up').forEach(el => el.classList.add('visible'));
    document.querySelector('.hero')?.classList.add('loaded');
  }, 3000);
}

// ── Curseur personnalisé ──────────────────────────────────────────────────────


// ── Scroll reveal (Intersection Observer) ────────────────────────────────────

export function initScrollReveal() {
  const items = document.querySelectorAll('.scroll-reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(item => observer.observe(item));
}

// ── Compteurs animés ──────────────────────────────────────────────────────────

export function initCounters() {
  const counters = document.querySelectorAll('.chiffre-number[data-count]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target   = parseInt(el.dataset.count, 10);
    const prefix   = el.dataset.prefix || '';
    const suffix   = el.dataset.suffix || '';
    const duration = 1800;
    const startTime = performance.now();

    function update(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const current  = Math.floor(easeOutQuart(progress) * target);
      el.textContent = prefix + (current >= 1000 ? formatNumber(current) : current) + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + (target >= 1000 ? formatNumber(target) : target) + suffix;
      }
    }
    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

// ── Parallax hero ─────────────────────────────────────────────────────────────

export function initParallax() {
  const heroImg = document.querySelector('.hero-img');
  if (!heroImg) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  const heroH = document.querySelector('.hero')?.offsetHeight || window.innerHeight;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      if (window.scrollY < heroH) {
        heroImg.style.transform = `scale(1) translateY(${window.scrollY * 0.35}px)`;
      }
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
}

// ── Indicateur de scroll hero ─────────────────────────────────────────────────

export function initScrollIndicator() {
  const indicator = document.querySelector('.scroll-indicator');
  if (!indicator) return;
  window.addEventListener('scroll', () => {
    indicator.style.opacity = window.scrollY > 100 ? '0' : '1';
    indicator.style.transition = 'opacity .4s ease';
  }, { passive: true });
}

// ── Effet 3D hover cartes prestation ─────────────────────────────────────────

export function initCardHover() {
  if (window.matchMedia('(max-width: 768px)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.prestation-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
      card.style.transition = 'transform .5s cubic-bezier(.25,.46,.45,.94)';
    });
  });
}
