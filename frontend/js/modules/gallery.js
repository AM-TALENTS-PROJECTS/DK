/**
 * gallery.js — Galerie masonry filtrable + lightbox clavier/tactile
 */

export function initGallery() {
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.galerie-item');
  if (!filterBtns.length || !galleryItems.length) return;

  // ── Filtres ────────────────────────────────────────────────────────────────
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', String(b === btn));
      });

      galleryItems.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        if (show) {
          item.style.opacity = '0';
          item.classList.remove('hidden');
          requestAnimationFrame(() => requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transition = 'opacity .4s ease';
          }));
        } else {
          item.style.opacity = '0';
          setTimeout(() => item.classList.add('hidden'), 400);
        }
      });
    });
  });

  // ── Lightbox ───────────────────────────────────────────────────────────────
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightbox-img');
  const lbCapt   = document.getElementById('lightbox-caption');
  const lbClose  = document.getElementById('lightbox-close');
  const lbPrev   = document.getElementById('lightbox-prev');
  const lbNext   = document.getElementById('lightbox-next');
  if (!lightbox || !lbImg) return;

  lightbox.style.opacity    = '0';
  lightbox.style.transition = 'opacity .3s ease';

  let visibleItems = [];
  let lbIndex = 0;

  function visItems() {
    return Array.from(galleryItems).filter(i => !i.classList.contains('hidden'));
  }

  function showItem(index) {
    const item = visibleItems[index];
    if (!item) return;
    const img  = item.querySelector('.galerie-img');
    const capt = item.querySelector('figcaption');
    lbImg.src = img?.src || '';
    lbImg.alt = img?.alt || '';
    if (lbCapt) lbCapt.textContent = capt?.textContent || '';
  }

  function open(index) {
    visibleItems = visItems();
    lbIndex = index;
    showItem(lbIndex);
    lightbox.style.display = 'flex';
    requestAnimationFrame(() => { lightbox.style.opacity = '1'; });
    document.body.style.overflow = 'hidden';
    lbClose?.focus();
  }

  function close() {
    lightbox.style.opacity = '0';
    setTimeout(() => { lightbox.style.display = 'none'; document.body.style.overflow = ''; }, 300);
  }

  const goNext = () => { lbIndex = (lbIndex + 1) % visibleItems.length; showItem(lbIndex); };
  const goPrev = () => { lbIndex = (lbIndex - 1 + visibleItems.length) % visibleItems.length; showItem(lbIndex); };

  galleryItems.forEach((item, idx) => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('click', () => open(idx));
    item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(idx); } });
  });

  lbClose?.addEventListener('click', close);
  lbPrev?.addEventListener('click',  goPrev);
  lbNext?.addEventListener('click',  goNext);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', e => {
    if (lightbox.style.display === 'none') return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft')  goPrev();
  });

  // Swipe tactile
  let touchX = 0;
  lightbox.addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend',   e => {
    const delta = e.changedTouches[0].clientX - touchX;
    if (Math.abs(delta) > 50) { delta < 0 ? goNext() : goPrev(); }
  }, { passive: true });
}

// ── Fallback images ────────────────────────────────────────────────────────────

export function initImageFallbacks() {
  document.querySelectorAll('.prestation-img, .histoire-img, .galerie-img').forEach(img => {
    img.addEventListener('error', function () {
      this.style.display = 'none';
      const fallback = this.nextElementSibling;
      if (fallback?.classList.contains('prestation-img-fallback') ||
          fallback?.classList.contains('histoire-img-fallback') ||
          fallback?.classList.contains('galerie-img-placeholder')) {
        fallback.style.display = 'block';
      }
    });
  });

  const heroImg      = document.querySelector('.hero-img');
  const heroFallback = document.querySelector('.hero-bg-fallback');
  if (heroImg && heroFallback) {
    heroImg.addEventListener('error', () => { heroImg.style.display = 'none'; });
    heroImg.addEventListener('load',  () => { heroFallback.style.display = 'none'; });
  }
}
