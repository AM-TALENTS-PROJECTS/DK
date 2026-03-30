# Diamante K - Site Vitrine

Site vitrine premium pour Diamante K, traiteur kasher evenementiel haut de gamme a Marseille.

Stack: HTML/CSS/JS vanilla + NestJS (Node.js)

## Prerequis

- Node.js 20+
- npm 10+

## Installation

1. Recuperer le projet

```bash
git clone <url-du-repo>
cd diamantek
```

2. Installer les dependances

```bash
npm install
```

3. Configurer les variables d'environnement

```bash
cp .env.example .env
```

4. Lancer en developpement

```bash
npm run start:dev
```

Le site est accessible sur http://localhost:5000

## Build et production

```bash
npm run build
npm run start:prod
```

## Variables d'environnement

```env
NODE_ENV=development
PORT=5000
SESSION_SECRET=<secret long et aleatoire>

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=diamantek.traiteur@gmail.com
SMTP_PASSWORD=<mot de passe application Gmail>

CONTACT_EMAIL=diamantek.traiteur@gmail.com
FROM_EMAIL=noreply@diamantektraiteur.com
FROM_NAME=Diamante K - Site Web

RATE_LIMIT_CONTACT=10
```

## Structure du projet

```text
diamantek/
├── src/
│   ├── main.ts                 # Bootstrap NestJS
│   ├── app.module.ts           # Module principal
│   ├── site/site.controller.ts # Routes pages HTML
│   ├── contact/                # CSRF, validation, API formulaire
│   └── email/email.service.ts  # Envoi SMTP
├── frontend/                   # Fichiers statiques du site
├── sitemap.xml
├── robots.txt
├── package.json
├── .env.example
└── CLAUDE.md
```

## Routes

| Methode | Route | Description |
|---|---|---|
| GET | / | Sert frontend/index.html |
| GET | /mentions-legales | Page mentions legales |
| GET | /politique-confidentialite | Page RGPD |
| GET | /cgv | Page CGV |
| GET | /sitemap.xml | Sitemap SEO |
| GET | /robots.txt | Robots SEO |
| GET | /api/csrf-token | Retourne un token CSRF (session) |
| POST | /api/contact | Traite le formulaire de devis |

## API contact

Headers requis:

```text
Content-Type: application/json
X-CSRF-Token: <token obtenu via GET /api/csrf-token>
```

Body JSON:

```json
{
  "nom": "Sophie Martin",
  "email": "sophie@example.com",
  "telephone": "06 12 34 56 78",
  "type_evenement": "Mariage",
  "date_evenement": "2026-06-15",
  "nombre_convives": "150",
  "message": "Bonjour, nous souhaitons..."
}
```

## Deploiement (Nginx reverse proxy)

```nginx
server {
    listen 443 ssl;
    server_name www.diamantektraiteur.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
