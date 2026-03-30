/**
 * carousel.js — Carousel avis Google
 * Autoplay, navigation clavier, swipe tactile, dots.
 */
import { debounce } from '../utils/helpers.js';

export function initAvisCarousel() {
  const carousel = document.getElementById('avis-carousel');
  const prevBtn  = document.getElementById('avis-prev');
  const nextBtn  = document.getElementById('avis-next');
  const dotsWrap = document.getElementById('avis-dots');
  if (!carousel) return;

  const cards = Array.from(carousel.querySelectorAll('.avis-card'));
  if (!cards.length) return;

  const getVisible = () => window.innerWidth < 768 ? 1 : window.innerWidth < 1200 ? 2 : 3;

  let current  = 0;
  let visCount = getVisible();
  let maxSlide = Math.max(0, cards.length - visCount);
  let autoplay;

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    maxSlide = Math.max(0, cards.length - visCount);
    for (let i = 0; i <= maxSlide; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === current ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Aller à l'avis ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, maxSlide));
    const gap    = 20;
    const offset = current * (cards[0].offsetWidth + gap);
    carousel.style.transform = `translateX(-${offset}px)`;

    dotsWrap?.querySelectorAll('.carousel-dot').forEach((dot, i) =>
      dot.classList.toggle('active', i === current)
    );
    cards.forEach((card, i) =>
      card.setAttribute('aria-hidden', String(i < current || i >= current + visCount))
    );
  }

  const next = () => goTo(current >= maxSlide ? 0 : current + 1);
  const prev = () => goTo(current <= 0 ? maxSlide : current - 1);

  function startAutoplay() { autoplay = setInterval(next, 4800); }
  function resetAutoplay()  { clearInterval(autoplay); startAutoplay(); }

  prevBtn?.addEventListener('click', () => { prev(); resetAutoplay(); });
  nextBtn?.addEventListener('click', () => { next(); resetAutoplay(); });

  carousel.addEventListener('mouseenter', () => clearInterval(autoplay));
  carousel.addEventListener('mouseleave', startAutoplay);

  // Swipe tactile
  let touchStartX = 0;
  carousel.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend',   e => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) { delta < 0 ? next() : prev(); resetAutoplay(); }
  }, { passive: true });

  // Redimensionnement
  window.addEventListener('resize', debounce(() => {
    visCount = getVisible();
    current  = Math.min(current, Math.max(0, cards.length - visCount));
    buildDots();
    goTo(current);
  }, 250));

  // Init
  carousel.style.display    = 'flex';
  carousel.style.overflow   = 'visible';
  carousel.style.transition = 'transform .55s cubic-bezier(.16,1,.3,1)';
  carousel.style.willChange = 'transform';
  buildDots();
  goTo(0);
  startAutoplay();
}
