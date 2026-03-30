/**
 * contact.js — Formulaire de devis
 * Récupère le token CSRF, valide, soumet en JSON vers /api/contact.
 */

export function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const error   = document.getElementById('form-error');
  const submit  = document.getElementById('submit-btn');
  if (!form) return;

  // Date minimum = aujourd'hui
  const dateInput = document.getElementById('date-event');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

  // Récupérer le CSRF token au chargement
  let csrfToken = '';
  fetchCsrfToken().then(t => { csrfToken = t; });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Validation HTML5 côté client (complémentaire, pas suffisante)
    if (!validateRequired()) return;

    // Mode démo si l'action contient encore le placeholder
    if (form.action.includes('YOUR_FORM_ID')) {
      showSuccess('(Démo — configurez /api/contact dans le backend serveur)');
      form.reset();
      return;
    }

    setLoading(true);
    hideMessages();

    // Renouveler le token si expiré
    if (!csrfToken) csrfToken = await fetchCsrfToken();

    const body = buildPayload();

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        showSuccess(data.message || 'Votre demande a bien été envoyée. Nous vous répondons sous 24h.');
        form.reset();
        csrfToken = '';      // token consommé — sera renouvelé à la prochaine soumission
        trackConversion();
      } else if (res.status === 422 && data.fields) {
        highlightFields(data.fields);
        showError('Veuillez corriger les champs indiqués.');
      } else {
        showError(data.error || 'Une erreur technique est survenue. Contactez-nous directement par téléphone.');
      }
    } catch {
      showError('Impossible d\'envoyer votre demande. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  });

  // Effacer le rouge sur saisie
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => { field.style.borderColor = ''; });
  });
}

// ── Utilitaires privés ────────────────────────────────────────────────────────

async function fetchCsrfToken() {
  try {
    const res  = await fetch('/api/csrf-token', { credentials: 'same-origin' });
    const data = await res.json();
    return data.csrf_token || '';
  } catch {
    return '';
  }
}

function buildPayload() {
  const form = document.getElementById('contact-form');
  const fd   = new FormData(form);
  const obj  = {};
  for (const [k, v] of fd.entries()) obj[k] = v;
  return obj;
}

function validateRequired() {
  const form = document.getElementById('contact-form');
  let valid  = true;
  form.querySelectorAll('[required]').forEach(field => {
    if (!field.value.trim()) {
      field.style.borderColor = '#ff6b6b';
      valid = false;
    }
  });
  if (!valid) {
    form.querySelector('[required]:not([value])') ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  return valid;
}

function highlightFields(fields) {
  const form = document.getElementById('contact-form');
  Object.keys(fields).forEach(name => {
    const el = form.querySelector(`[name="${name}"]`);
    if (el) el.style.borderColor = '#ff6b6b';
  });
}

function setLoading(on) {
  const submit = document.getElementById('submit-btn');
  if (!submit) return;
  submit.classList.toggle('loading', on);
  submit.disabled = on;
}

function showSuccess(msg) {
  const el = document.getElementById('form-success');
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'flex';
}

function showError(msg) {
  const el = document.getElementById('form-error');
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'flex';
}

function hideMessages() {
  const s = document.getElementById('form-success');
  const e = document.getElementById('form-error');
  if (s) s.style.display = 'none';
  if (e) e.style.display = 'none';
}

function trackConversion() {
  if (typeof gtag === 'function') {
    gtag('event', 'form_submit', { event_category: 'Contact', event_label: 'Devis Diamanté K' });
  }
}
