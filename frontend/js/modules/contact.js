/**
 * contact.js — Formulaire de devis
 * Envoi via EmailJS (service côté client), pas de backend requis.
 */

const EMAILJS_SERVICE_ID  = 'service_h4qnz0w';
const EMAILJS_TEMPLATE_ID = '5tcaq0a';
const EMAILJS_PUBLIC_KEY  = 'dE1barNKWhgbdBjH';

export function initContactForm() {
  const form   = document.getElementById('contact-form');
  const submit = document.getElementById('submit-btn');
  if (!form) return;

  // Initialiser EmailJS
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  // Date minimum = aujourd'hui
  const dateInput = document.getElementById('date-event');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

  form.addEventListener('submit', async e => {
    e.preventDefault();

    if (!validateRequired()) return;

    hideMessages();
    setLoading(true);

    const templateParams = {
      nom:            form.querySelector('[name="nom"]').value,
      email:          form.querySelector('[name="email"]').value,
      telephone:      form.querySelector('[name="telephone"]').value,
      type_evenement: form.querySelector('[name="type_evenement"]').value,
      date:           form.querySelector('[name="date"]').value,
      convives:       form.querySelector('[name="convives"]').value,
      message:        form.querySelector('[name="message"]').value,
    };

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      showSuccess('Merci ! Votre demande a bien été envoyée. Nous vous répondons sous 24h.');
      form.reset();
      trackConversion();
    } catch (err) {
      showError('Une erreur s\'est produite. Contactez-nous directement par téléphone.');
      console.error('EmailJS error:', err);
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
    form.querySelector('[required]:invalid')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  return valid;
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
