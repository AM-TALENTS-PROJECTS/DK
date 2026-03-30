export type ContactPayload = {
  nom?: unknown;
  email?: unknown;
  telephone?: unknown;
  type_evenement?: unknown;
  date_evenement?: unknown;
  nombre_convives?: unknown;
  message?: unknown;
  _gotcha?: unknown;
  website?: unknown;
};

export type ContactFields = {
  nom: string;
  email: string;
  telephone: string;
  type_evenement: string;
  date_evenement: string;
  nombre_convives: string;
  message: string;
};

export type ValidationResult =
  | { valid: true; fields: ContactFields }
  | { valid: false; errors: Record<string, string>; isBot?: boolean };
