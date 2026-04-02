/**
 * gallery.js — Galerie magazine éditorial paginée + lightbox
 */

import { debounce } from '../utils/helpers.js';

/* Labels affichés dans l'overlay hover */
const CATEGORY_LABELS = {
  mariages:  'Mariages',
  buffets:   'Buffets',
  desserts:  'Desserts',
  cocktails: 'Cocktails',
  brunchs:   'Brunchs',
  equipe:    'Équipe',
};

/* Compositions de pages qui alternent (desktop uniquement) */
const COMPOSITIONS = ['a', 'b', 'c'];

export function initGallery() {
  const grid       = document.getElementById('galerie-grid');
  const pagNav     = document.getElementById('galerie-pagination');
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!grid) return;

  // ── 1. Collecte des données depuis les figures HTML ──────────────
  const allPhotos = Array.from(grid.querySelectorAll('.galerie-item')).map((fig, i) => {
    const img = fig.querySelector('.galerie-img');
    const cap = fig.querySelector('figcaption');
    return {
      src:      img?.getAttribute('src') || '',
      alt:      img?.getAttribute('alt') || '',
      category: fig.dataset.category || '',
      caption:  cap?.textContent?.trim() || '',
      index:    i,
    };
  });

  // Vider le conteneur : les figures HTML servaient de source de données
  grid.innerHTML = '';

  // ── 2. État ──────────────────────────────────────────────────────
  let filteredPhotos  = [...allPhotos];
  let currentPage     = 0;
  let currentFilter   = 'all';
  let isAnimating     = false;
  let lastPerPage     = calcPerPage();

  function calcPerPage() {
    if (window.innerWidth < 768)  return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  function totalPages() {
    return Math.ceil(filteredPhotos.length / calcPerPage());
  }

  // ── 3. Rendu d'une page ──────────────────────────────────────────
  function renderPage(animate = true) {
    if (isAnimating && animate) return;

    const perPage  = calcPerPage();
    const start    = currentPage * perPage;
    const slice    = filteredPhotos.slice(start, start + perPage);

    /* Sélection de la composition */
    let compKey;
    if (perPage === 1) {
      compKey = 'one';
    } else if (perPage === 2) {
      compKey = 'two';
    } else {
      compKey = COMPOSITIONS[currentPage % COMPOSITIONS.length];
    }

    const doAnimate = animate && grid.children.length > 0;

    function applyContent() {
      grid.className = `galerie-magazine comp-${compKey}`;
      grid.innerHTML = '';

      if (slice.length === 0) {
        grid.innerHTML = '<p class="galerie-empty">Aucune photo dans cette catégorie.</p>';
        renderPagination();
        return;
      }

      slice.forEach((photo, localIdx) => {
        /* Index global dans la liste filtrée pour la lightbox */
        const globalIdx = start + localIdx;

        const fig = document.createElement('figure');
        fig.className = 'mag-item';
        fig.setAttribute('tabindex', '0');
        fig.setAttribute('role', 'button');
        fig.setAttribute('aria-label', photo.caption || photo.alt);

        fig.innerHTML = `
          <div class="mag-item__img-wrap">
            <div class="mag-item__placeholder"></div>
            <img
              src="${photo.src}"
              alt="${photo.alt}"
              loading="lazy"
              class="mag-item__img"
            >
          </div>
          <div class="mag-item__overlay">
            <span class="mag-item__label">${CATEGORY_LABELS[photo.category] || photo.category}</span>
            <span class="mag-item__zoom"><i class="fa-solid fa-magnifying-glass-plus" aria-hidden="true"></i></span>
          </div>
          <figcaption class="sr-only">${photo.caption}</figcaption>
        `;

        fig.addEventListener('click', () => openLightbox(globalIdx));
        fig.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(globalIdx); }
        });

        grid.appendChild(fig);
      });

      renderPagination();
    }

    if (doAnimate) {
      isAnimating = true;
      grid.style.transition = 'opacity .3s ease, transform .3s ease';
      grid.style.opacity    = '0';
      grid.style.transform  = 'translateY(10px)';

      setTimeout(() => {
        applyContent();
        requestAnimationFrame(() => requestAnimationFrame(() => {
          grid.style.opacity   = '1';
          grid.style.transform = 'translateY(0)';
          setTimeout(() => { isAnimating = false; }, 400);
        }));
      }, 300);
    } else {
      /* Rendu initial sans animation */
      grid.style.opacity   = '1';
      grid.style.transform = 'translateY(0)';
      applyContent();
    }
  }

  // ── 4. Pagination ────────────────────────────────────────────────
  function renderPagination() {
    if (!pagNav) return;
    const total = totalPages();

    if (total <= 1) { pagNav.innerHTML = ''; return; }

    const curr = String(currentPage + 1).padStart(2, '0');
    const tot  = String(total).padStart(2, '0');

    pagNav.innerHTML = `
      <button class="pag-arrow pag-prev" aria-label="Page précédente" ${currentPage === 0 ? 'disabled' : ''}>
        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
      </button>
      <span class="pag-counter">
        <span class="pag-current">${curr}</span>
        <span class="pag-sep">/</span>
        <span class="pag-total">${tot}</span>
      </span>
      <button class="pag-arrow pag-next" aria-label="Page suivante" ${currentPage >= total - 1 ? 'disabled' : ''}>
        <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </button>
    `;

    pagNav.querySelector('.pag-prev')?.addEventListener('click', () => {
      if (currentPage > 0) { currentPage--; renderPage(); }
    });
    pagNav.querySelector('.pag-next')?.addEventListener('click', () => {
      if (currentPage < totalPages() - 1) { currentPage++; renderPage(); }
    });
  }

  // ── 5. Filtres ───────────────────────────────────────────────────
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;

      filterBtns.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', String(b === btn));
      });

      filteredPhotos = currentFilter === 'all'
        ? [...allPhotos]
        : allPhotos.filter(p => p.category === currentFilter);

      currentPage = 0;
      renderPage();
    });
  });

  // ── 6. Lightbox ──────────────────────────────────────────────────
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightbox-img');
  const lbCapt   = document.getElementById('lightbox-caption');
  const lbClose  = document.getElementById('lightbox-close');
  const lbPrev   = document.getElementById('lightbox-prev');
  const lbNext   = document.getElementById('lightbox-next');
  if (!lightbox || !lbImg) return;

  lightbox.style.opacity    = '0';
  lightbox.style.transition = 'opacity .3s ease';

  let lbIndex = 0;

  function showLightboxItem(index) {
    const photo = filteredPhotos[index];
    if (!photo) return;
    lbImg.src = photo.src;
    lbImg.alt = photo.alt;
    if (lbCapt) lbCapt.textContent = photo.caption;
  }

  function openLightbox(index) {
    lbIndex = index;
    showLightboxItem(lbIndex);
    lightbox.style.display = 'flex';
    requestAnimationFrame(() => { lightbox.style.opacity = '1'; });
    document.body.style.overflow = 'hidden';
    lbClose?.focus();
  }

  function closeLightbox() {
    lightbox.style.opacity = '0';
    setTimeout(() => { lightbox.style.display = 'none'; document.body.style.overflow = ''; }, 300);
  }

  const goNext = () => { lbIndex = (lbIndex + 1) % filteredPhotos.length; showLightboxItem(lbIndex); };
  const goPrev = () => { lbIndex = (lbIndex - 1 + filteredPhotos.length) % filteredPhotos.length; showLightboxItem(lbIndex); };

  lbClose?.addEventListener('click', closeLightbox);
  lbPrev?.addEventListener('click',  goPrev);
  lbNext?.addEventListener('click',  goNext);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.style.display || lightbox.style.display === 'none') return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft')  goPrev();
  });

  /* Swipe tactile dans la lightbox */
  let lbTouchX = 0;
  lightbox.addEventListener('touchstart', e => { lbTouchX = e.changedTouches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend',   e => {
    const delta = e.changedTouches[0].clientX - lbTouchX;
    if (Math.abs(delta) > 50) { delta < 0 ? goNext() : goPrev(); }
  }, { passive: true });

  // ── 7. Swipe tactile sur la galerie (mobile) ─────────────────────
  let gTouchX = 0;
  grid.addEventListener('touchstart', e => { gTouchX = e.changedTouches[0].clientX; }, { passive: true });
  grid.addEventListener('touchend', e => {
    const delta = e.changedTouches[0].clientX - gTouchX;
    if (Math.abs(delta) > 60) {
      const total = totalPages();
      if (delta < 0 && currentPage < total - 1) { currentPage++; renderPage(); }
      if (delta > 0 && currentPage > 0)          { currentPage--; renderPage(); }
    }
  }, { passive: true });

  // ── 8. Recalcul au resize ────────────────────────────────────────
  window.addEventListener('resize', debounce(() => {
    const newPerPage = calcPerPage();
    if (newPerPage !== lastPerPage) {
      lastPerPage = newPerPage;
      currentPage = 0;
      renderPage(false);
    }
  }, 200));

  // ── Rendu initial ────────────────────────────────────────────────
  renderPage(false);
}

// ── Fallback images (prestation, histoire) ─────────────────────────────────
export function initImageFallbacks() {
  document.querySelectorAll('.prestation-img, .histoire-img').forEach(img => {
    img.addEventListener('error', function () {
      this.style.display = 'none';
      const fallback = this.nextElementSibling;
      if (fallback?.classList.contains('prestation-img-fallback') ||
          fallback?.classList.contains('histoire-img-fallback')) {
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
