import { Injectable } from '@nestjs/common';
import crypto from 'crypto';
import sanitizeHtml from 'sanitize-html';
import { ContactFields, ContactPayload, ValidationResult } from './contact.types';

const ALLOWED_EVENT_TYPES = new Set([
  'Mariage',
  'Bar Mitsva',
  'Bat Mitsva',
  'Brith',
  'Shabbat',
  'Fête Juive',
  "Événement d'entreprise",
  'Cocktail / Soirée',
  'Brunch',
  'Autre',
]);

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

@Injectable()
export class ContactService {
  private readonly contactAttempts = new Map<string, number[]>();

  generateCsrfToken(currentToken?: string): string {
    return currentToken ?? crypto.randomBytes(32).toString('hex');
  }

  isValidCsrfToken(tokenHeader: string, tokenSession: string): boolean {
    if (!tokenHeader || !tokenSession) {
      return false;
    }

    const headerBuffer = Buffer.from(tokenHeader);
    const sessionBuffer = Buffer.from(tokenSession);

    if (headerBuffer.length !== sessionBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(headerBuffer, sessionBuffer);
  }

  validateContactPayload(payload: ContactPayload): ValidationResult {
    if (payload._gotcha || payload.website) {
      return { valid: false, errors: { _bot: 'true' }, isBot: true };
    }

    const errors: Record<string, string> = {};
    const clean: ContactFields = {
      nom: '',
      email: '',
      telephone: '',
      type_evenement: '',
      date_evenement: '',
      nombre_convives: '',
      message: '',
    };

    const nom = this.sanitizeText(payload.nom);
    if (!nom) {
      errors.nom = 'Le nom est obligatoire.';
    } else if (nom.length < 2) {
      errors.nom = 'Le nom doit contenir au moins 2 caractères.';
    } else if (nom.length > 100) {
      errors.nom = 'Le nom ne peut pas dépasser 100 caractères.';
    } else {
      clean.nom = nom;
    }

    const email = this.sanitizeText(payload.email);
    if (!email) {
      errors.email = "L'email est obligatoire.";
    } else if (!EMAIL_REGEX.test(email)) {
      errors.email = "Format d'email invalide.";
    } else if (email.length > 254) {
      errors.email = 'Email trop long.';
    } else {
      clean.email = email.toLowerCase();
    }

    const telephone = this.sanitizeText(payload.telephone);
    if (telephone) {
      const telDigits = telephone.replace(/[\s.\-()]+/g, '');
      if (!/^\+?[\d]{7,15}$/.test(telDigits)) {
        errors.telephone = 'Numéro de téléphone invalide.';
      } else if (telephone.length > 20) {
        errors.telephone = 'Numéro de téléphone trop long.';
      } else {
        clean.telephone = telephone;
      }
    }

    const typeEvenement = this.sanitizeText(payload.type_evenement);
    if (!typeEvenement) {
      errors.type_evenement = "Le type d'événement est obligatoire.";
    } else if (!ALLOWED_EVENT_TYPES.has(typeEvenement)) {
      errors.type_evenement = "Type d'événement non reconnu.";
    } else {
      clean.type_evenement = typeEvenement;
    }

    const dateEvenement = this.sanitizeText(payload.date_evenement);
    if (dateEvenement) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateEvenement)) {
        errors.date_evenement = 'Format de date invalide (AAAA-MM-JJ attendu).';
      } else {
        clean.date_evenement = dateEvenement;
      }
    }

    const nombreConvives = this.sanitizeText(payload.nombre_convives);
    if (!nombreConvives) {
      errors.nombre_convives = 'Le nombre de convives est obligatoire.';
    } else {
      const n = Number.parseInt(nombreConvives, 10);
      if (Number.isNaN(n)) {
        errors.nombre_convives = 'Valeur numérique attendue.';
      } else if (n < 1) {
        errors.nombre_convives = 'Le nombre de convives doit être positif.';
      } else if (n > 10000) {
        errors.nombre_convives = 'Valeur trop élevée.';
      } else {
        clean.nombre_convives = String(n);
      }
    }

    const message = this.sanitizeText(payload.message);
    if (message.length > 2000) {
      errors.message = 'Le message ne peut pas dépasser 2000 caractères.';
    } else {
      clean.message = message;
    }

    if (Object.keys(errors).length > 0) {
      return { valid: false, errors };
    }

    return { valid: true, fields: clean };
  }

  isRateLimited(ip: string, max: number, windowMs: number): boolean {
    const now = Date.now();
    const attempts = this.contactAttempts.get(ip) ?? [];
    const recentAttempts = attempts.filter((timestamp) => now - timestamp < windowMs);

    if (recentAttempts.length >= max) {
      this.contactAttempts.set(ip, recentAttempts);
      return true;
    }

    recentAttempts.push(now);
    this.contactAttempts.set(ip, recentAttempts);
    return false;
  }

  private sanitizeText(value: unknown): string {
    if (typeof value !== 'string') {
      return '';
    }

    return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim();
  }
}
