/**
 * helpers.js — Fonctions utilitaires pures
 * Aucune dépendance externe, aucun accès au DOM.
 */

/**
 * Limite les appels d'une fonction à une fois par intervalle.
 * @param {Function} fn
 * @param {number} delay — ms
 */
export function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Retourne l'IP du client depuis les headers (usage côté serveur uniquement).
 * Côté client, utilisé pour construire des identifiants de session.
 */
export function noop() {}

/**
 * Easing easeOutQuart — utilisé pour les compteurs animés.
 * @param {number} t — progression 0→1
 */
export function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

/**
 * Formate un nombre avec séparateur de milliers (locale fr).
 * @param {number} n
 */
export function formatNumber(n) {
  return n.toLocaleString('fr-FR');
}
