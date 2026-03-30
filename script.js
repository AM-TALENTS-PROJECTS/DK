/* ═══════════════════════════════════════════════════════════════════
   DIAMANTÉ K — TRAITEUR KASHER MARSEILLE
   script.js — Animations, interactions, UX premium
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────────────
   1. LOADING SCREEN
──────────────────────────────────────────── */
(function initLoadingScreen() {
  const screen = document.getElementById('loading-screen');
  const bar    = document.getElementById('loading-bar');
  if (!screen || !bar) return;

  let progress = 0;
  const interval = setInterval(() => {
    // Fast start, slow middle, fast finish
    const increment = progress < 50 ? 4 : progress < 80 ? 1.5 : 3;
    progress = Math.min(100, progress + increment);
    bar.style.width = progress + '%';

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        screen.classList.add('hidden');
        // Trigger hero animations once loaded
        document.querySelectorAll('.hero .reveal-up').forEach(el => {
          el.classList.add('visible');
        });
        document.querySelector('.hero')?.classList.add('loaded');
      }, 300);
    }
  }, 28);

  // Safety net: hide after 3s regardless
  setTimeout(() => {
    screen.classList.add('hidden');
    document.querySelectorAll('.hero .reveal-up').forEach(el => el.classList.add('visible'));
    document.querySelector('.hero')?.classList.add('loaded');
  }, 3000);
})();

/* ────────────────────────────────────────────
   2. CUSTOM CURSOR
──────────────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  if (window.matchMedia('(max-width: 768px)').matches) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let raf;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    raf = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Grow ring on interactive elements
  document.querySelectorAll('a, button, .prestation-card, .galerie-item, .avis-card, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
})();

/* ────────────────────────────────────────────
   3. NAVIGATION — SCROLL & MOBILE
──────────────────────────────────────────── */
(function initNavigation() {
  const header = document.getElementById('header');
  const burger = document.getElementById('nav-burger');
  const menu   = document.getElementById('nav-menu');
  const links  = document.querySelectorAll('.nav-link');
  if (!header) return;

  // Scrolled state
  function onScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveLink();
    updateBackToTop();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile burger
  if (burger && menu) {
    burger.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', isOpen.toString());
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (menu.classList.contains('open') &&
          !menu.contains(e.target) && !burger.contains(e.target)) {
        menu.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // Active link on scroll (Intersection Observer based)
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= 100) current = section.id;
    });
    links.forEach(link => {
      const href = link.getAttribute('href')?.replace('#', '');
      link.classList.toggle('active', href === current);
    });
  }
})();

/* ────────────────────────────────────────────
   4. BACK TO TOP
──────────────────────────────────────────── */
function updateBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  btn.classList.toggle('visible', window.scrollY > 400);
}

(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ────────────────────────────────────────────
   5. SCROLL REVEAL (Intersection Observer)
──────────────────────────────────────────── */
(function initScrollReveal() {
  const items = document.querySelectorAll('.scroll-reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  items.forEach(item => observer.observe(item));
})();

/* ────────────────────────────────────────────
   6. COUNTER ANIMATION
──────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.chiffre-number[data-count]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target   = parseInt(el.dataset.count, 10);
    const prefix   = el.dataset.prefix || '';
    const suffix   = el.dataset.suffix || '';
    const duration = 1800;
    const startTime = performance.now();

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function update(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutQuart(progress);
      const current  = Math.floor(eased * target);

      // Format with spaces for thousands
      const formatted = current >= 1000
        ? current.toLocaleString('fr-FR').replace(/\s/g, ' ')
        : current.toString();

      el.textContent = prefix + formatted + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        const finalFormatted = target >= 1000
          ? target.toLocaleString('fr-FR').replace(/\s/g, ' ')
          : target.toString();
        el.textContent = prefix + finalFormatted + suffix;
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
})();

/* ────────────────────────────────────────────
   7. GOOGLE AVIS CAROUSEL
──────────────────────────────────────────── */
(function initAvisCarousel() {
  const carousel = document.getElementById('avis-carousel');
  const prevBtn  = document.getElementById('avis-prev');
  const nextBtn  = document.getElementById('avis-next');
  const dotsWrap = document.getElementById('avis-dots');
  if (!carousel) return;

  const cards = Array.from(carousel.querySelectorAll('.avis-card'));
  if (!cards.length) return;

  // Determine cards visible per slide based on viewport
  function getVisible() {
    if (window.innerWidth < 768)  return 1;
    if (window.innerWidth < 1200) return 2;
    return 3;
  }

  let current  = 0;
  let visCount = getVisible();
  let maxSlide = Math.max(0, cards.length - visCount);
  let autoplay;

  // Build dots
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

    // Calculate card width including gap
    const cardWidth = cards[0].offsetWidth;
    const gap = 20;
    const offset = current * (cardWidth + gap);
    carousel.style.transform = `translateX(-${offset}px)`;

    // Update dots
    dotsWrap?.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });

    // Update cards visibility for accessibility
    cards.forEach((card, i) => {
      const isVisible = i >= current && i < current + visCount;
      card.setAttribute('aria-hidden', (!isVisible).toString());
    });
  }

  function next() {
    goTo(current >= maxSlide ? 0 : current + 1);
  }

  function prev() {
    goTo(current <= 0 ? maxSlide : current - 1);
  }

  // Auto-resize
  function onResize() {
    visCount = getVisible();
    maxSlide = Math.max(0, cards.length - visCount);
    current  = Math.min(current, maxSlide);
    buildDots();
    goTo(current);
  }

  prevBtn?.addEventListener('click', () => { prev(); resetAutoplay(); });
  nextBtn?.addEventListener('click', () => { next(); resetAutoplay(); });

  function startAutoplay() {
    autoplay = setInterval(next, 4800);
  }

  function resetAutoplay() {
    clearInterval(autoplay);
    startAutoplay();
  }

  // Pause on hover
  carousel.addEventListener('mouseenter', () => clearInterval(autoplay));
  carousel.addEventListener('mouseleave', startAutoplay);

  // Touch/swipe support
  let touchStartX = 0;
  carousel.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  carousel.addEventListener('touchend', e => {
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > 50) {
      deltaX < 0 ? next() : prev();
      resetAutoplay();
    }
  }, { passive: true });

  // Init
  carousel.style.display = 'flex';
  carousel.style.overflow = 'visible';
  carousel.style.transition = 'transform .55s cubic-bezier(.16,1,.3,1)';
  carousel.style.willChange = 'transform';
  buildDots();
  goTo(0);
  startAutoplay();

  window.addEventListener('resize', debounce(onResize, 250));
})();

/* ────────────────────────────────────────────
   8. GALLERY FILTER + LIGHTBOX
──────────────────────────────────────────── */
(function initGallery() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.galerie-item');
  if (!filterBtns.length || !galleryItems.length) return;

  // Filter
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterBtns.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', (b === btn).toString());
      });

      // Filter items with animation
      galleryItems.forEach(item => {
        const category = item.dataset.category;
        const show = filter === 'all' || category === filter;
        if (show) {
          item.style.opacity = '0';
          item.classList.remove('hidden');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transition = 'opacity .4s ease';
            });
          });
        } else {
          item.style.opacity = '0';
          setTimeout(() => item.classList.add('hidden'), 400);
        }
      });
    });
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightbox-img');
  const lbCapt   = document.getElementById('lightbox-caption');
  const lbClose  = document.getElementById('lightbox-close');
  const lbPrev   = document.getElementById('lightbox-prev');
  const lbNext   = document.getElementById('lightbox-next');
  if (!lightbox || !lbImg) return;

  let visibleItems = [];
  let lbIndex = 0;

  function openLightbox(index) {
    visibleItems = Array.from(galleryItems).filter(i => !i.classList.contains('hidden'));
    lbIndex = index;
    showLbItem(lbIndex);
    lightbox.style.display = 'flex';
    requestAnimationFrame(() => lightbox.style.opacity = '1');
    document.body.style.overflow = 'hidden';
    lbClose?.focus();
  }

  function closeLightbox() {
    lightbox.style.opacity = '0';
    setTimeout(() => {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  }

  function showLbItem(index) {
    const item = visibleItems[index];
    if (!item) return;
    const img  = item.querySelector('.galerie-img');
    const capt = item.querySelector('figcaption');
    if (img) {
      lbImg.src = img.src || img.dataset.src || '';
      lbImg.alt = img.alt || '';
    }
    if (lbCapt) lbCapt.textContent = capt ? capt.textContent : '';
  }

  function lbGoNext() {
    lbIndex = (lbIndex + 1) % visibleItems.length;
    showLbItem(lbIndex);
  }

  function lbGoPrev() {
    lbIndex = (lbIndex - 1 + visibleItems.length) % visibleItems.length;
    showLbItem(lbIndex);
  }

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => openLightbox(idx));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(idx);
      }
    });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
  });

  lbClose?.addEventListener('click', closeLightbox);
  lbPrev?.addEventListener('click',  lbGoPrev);
  lbNext?.addEventListener('click',  lbGoNext);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (lightbox.style.display === 'none') return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowRight') lbGoNext();
    if (e.key === 'ArrowLeft')  lbGoPrev();
  });

  // Swipe on lightbox
  let lbTouchX = 0;
  lightbox.addEventListener('touchstart', e => {
    lbTouchX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', e => {
    const delta = e.changedTouches[0].clientX - lbTouchX;
    if (Math.abs(delta) > 50) {
      delta < 0 ? lbGoNext() : lbGoPrev();
    }
  }, { passive: true });

  // Init lightbox styles
  lightbox.style.opacity = '0';
  lightbox.style.transition = 'opacity .3s ease';
})();

/* ────────────────────────────────────────────
   9. CONTACT FORM (Formspree)
──────────────────────────────────────────── */
(function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const error   = document.getElementById('form-error');
  const submit  = document.getElementById('submit-btn');
  if (!form) return;

  // Set min date to today
  const dateInput = document.getElementById('date-event');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Simple validation
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#ff6b6b';
        valid = false;
        setTimeout(() => field.style.borderColor = '', 3000);
      }
    });

    if (!valid) {
      // Scroll to first error
      form.querySelector('[required]:placeholder-shown')?.scrollIntoView({
        behavior: 'smooth', block: 'center'
      });
      return;
    }

    // Check if Formspree ID has been configured
    const action = form.action;
    if (action.includes('YOUR_FORM_ID')) {
      // Dev mode: show success without actual sending
      if (success) {
        success.style.display = 'flex';
        success.textContent = '✓ (Mode démonstration — configurez votre ID Formspree pour activer l\'envoi réel)';
      }
      form.reset();
      return;
    }

    // Loading state
    submit.classList.add('loading');
    submit.disabled = true;
    if (success) success.style.display = 'none';
    if (error)   error.style.display   = 'none';

    try {
      const formData = new FormData(form);
      const response = await fetch(action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        if (success) success.style.display = 'flex';
        form.reset();
        // Track conversion (Google Analytics)
        if (typeof gtag === 'function') {
          gtag('event', 'form_submit', {
            event_category: 'Contact',
            event_label: 'Devis Diamanté K'
          });
        }
      } else {
        const data = await response.json();
        if (data.errors) {
          if (error) {
            error.style.display = 'flex';
            error.textContent = data.errors.map(e => e.message).join(', ');
          }
        } else {
          if (error) error.style.display = 'flex';
        }
      }
    } catch (err) {
      if (error) error.style.display = 'flex';
    } finally {
      submit.classList.remove('loading');
      submit.disabled = false;
    }
  });

  // Remove error highlight on input
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.style.borderColor = '';
    });
  });
})();

/* ────────────────────────────────────────────
   10. PARALLAX HERO
──────────────────────────────────────────── */
(function initParallax() {
  const heroImg = document.querySelector('.hero-img');
  if (!heroImg) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let lastY = 0;
  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;
    const heroH   = document.querySelector('.hero')?.offsetHeight || window.innerHeight;
    if (scrollY < heroH) {
      const offset = scrollY * 0.35;
      heroImg.style.transform = `scale(1) translateY(${offset}px)`;
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    lastY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
})();

/* ────────────────────────────────────────────
   11. SMOOTH SCROLL FOR ANCHOR LINKS
──────────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href   = anchor.getAttribute('href');
      if (href === '#' || href === '#!') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      const headerH = document.getElementById('header')?.offsetHeight || 80;
      const targetY = target.getBoundingClientRect().top + window.scrollY - headerH;

      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });
})();

/* ────────────────────────────────────────────
   12. IMAGE FALLBACK (show fallback div when img fails)
──────────────────────────────────────────── */
(function initImageFallbacks() {
  document.querySelectorAll('.prestation-img, .histoire-img, .galerie-img').forEach(img => {
    img.addEventListener('error', function() {
      this.style.display = 'none';
      const fallback = this.nextElementSibling;
      if (fallback && (fallback.classList.contains('prestation-img-fallback') ||
                       fallback.classList.contains('histoire-img-fallback') ||
                       fallback.classList.contains('galerie-img-placeholder'))) {
        fallback.style.display = 'block';
      }
    });
  });
})();

/* ────────────────────────────────────────────
   13. FOOTER YEAR AUTO-UPDATE
──────────────────────────────────────────── */
(function updateFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ────────────────────────────────────────────
   14. HERO IMAGE FALLBACK CHECK
──────────────────────────────────────────── */
(function checkHeroImg() {
  const img = document.querySelector('.hero-img');
  const fallback = document.querySelector('.hero-bg-fallback');
  if (!img || !fallback) return;
  img.addEventListener('error', () => {
    img.style.display = 'none';
    fallback.style.display = 'block';
  });
  img.addEventListener('load', () => {
    fallback.style.display = 'none';
  });
  // Check if src is empty or already broken
  if (!img.src || img.complete && img.naturalHeight === 0) {
    img.style.display = 'none';
  }
})();

/* ────────────────────────────────────────────
   15. UTILITY: DEBOUNCE
──────────────────────────────────────────── */
function debounce(fn, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* ────────────────────────────────────────────
   16. HERO SCROLL BEHAVIOR (hide scroll indicator)
──────────────────────────────────────────── */
(function initHeroScroll() {
  const indicator = document.querySelector('.scroll-indicator');
  if (!indicator) return;
  window.addEventListener('scroll', () => {
    indicator.style.opacity = window.scrollY > 100 ? '0' : '1';
    indicator.style.transition = 'opacity .4s ease';
  }, { passive: true });
})();

/* ────────────────────────────────────────────
   17. PRESTATION CARD IMAGE LAZY PARALLAX
──────────────────────────────────────────── */
(function initCardHoverEffect() {
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
})();

/* ────────────────────────────────────────────
   18. INTERSECTION OBSERVER — Section transitions
──────────────────────────────────────────── */
(function initSectionObserver() {
  const sections = document.querySelectorAll('section');
  if (!sections.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.setAttribute('data-visible', 'true');
      }
    });
  }, { threshold: 0.05 });

  sections.forEach(s => observer.observe(s));
})();

/* ────────────────────────────────────────────
   19. LAZY LOADING IMAGES (native + custom)
──────────────────────────────────────────── */
(function initLazyImages() {
  // Images with data-src for manual lazy load
  const lazyImgs = document.querySelectorAll('img[data-src]');
  if (!lazyImgs.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px 0px' });

  lazyImgs.forEach(img => observer.observe(img));
})();

/* ────────────────────────────────────────────
   20. KEYBOARD NAVIGATION ACCESSIBILITY
──────────────────────────────────────────── */
(function initA11y() {
  // Show focus rings only on keyboard navigation
  document.addEventListener('mousedown', () => {
    document.documentElement.classList.add('using-mouse');
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
      document.documentElement.classList.remove('using-mouse');
    }
  });

  // Escape key closes mobile menu
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const menu   = document.getElementById('nav-menu');
      const burger = document.getElementById('nav-burger');
      if (menu?.classList.contains('open')) {
        menu.classList.remove('open');
        burger?.classList.remove('open');
        burger?.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        burger?.focus();
      }
    }
  });
})();

/* ────────────────────────────────────────────
   CONSOLE BRANDING
──────────────────────────────────────────── */
console.log(
  '%c Diamanté K %c — Traiteur Kasher Marseille ',
  'background:#c9a96e; color:#080808; font-weight:bold; padding:4px 0; font-size:14px;',
  'background:#080808; color:#c9a96e; padding:4px 6px; font-size:14px;'
);
console.log('%c✦ La Gastronomie d\'Excellence', 'color:#c9a96e; font-style:italic;');
