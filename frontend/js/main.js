/**
 * main.js — Orchestration ES6 modules
 * Point d'entrée unique — importe et initialise tous les modules.
 *
 * Chargé avec <script type="module" src="js/main.js"></script>
 */

import { initLoadingScreen, initScrollReveal, initCounters, initParallax, initScrollIndicator, initCardHover } from './modules/animations.js';
import { initNavigation, initBackToTop, initSmoothScroll, initA11y, initFooterYear } from './modules/navigation.js';
import { initAvisCarousel } from './modules/carousel.js';
import { initGallery, initImageFallbacks } from './modules/gallery.js';
import { initContactForm } from './modules/contact.js';

// Démarrer le loading screen immédiatement (avant DOMContentLoaded)
initLoadingScreen();

document.addEventListener('DOMContentLoaded', () => {
  initA11y();
  initNavigation();
  initBackToTop();
  initSmoothScroll();
  initFooterYear();
  initScrollReveal();
  initCounters();
  initParallax();
  initScrollIndicator();
  initCardHover();
  initAvisCarousel();
  initGallery();
  initImageFallbacks();
  initContactForm();

  // Branding console
  console.log(
    '%c Diamanté K %c — Traiteur Casher Marseille ',
    'background:#c9a96e;color:#080808;font-weight:bold;padding:4px 0;font-size:14px;',
    'background:#080808;color:#c9a96e;padding:4px 6px;font-size:14px;'
  );
  console.log('%c✦ La Gastronomie d\'Excellence', 'color:#c9a96e;font-style:italic;');
});
