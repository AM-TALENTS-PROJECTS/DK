# CLAUDE.md — Diamanté K Site Vitrine

> **RÈGLE ABSOLUE** : Lire ce fichier en entier avant d'écrire la moindre ligne de code.
> Mettre à jour le journal des sessions après chaque modification significative.

---

## Projet

Site vitrine premium pour **Diamanté K**, traiteur kasher événementiel haut de gamme à Marseille.

**Stack** : HTML/CSS/JS vanilla (frontend) + NestJS TypeScript (backend)
**URL production** : https://www.diamantektraiteur.com
**Dirigeant** : Jérémy Ayache — 192 Rue du Rouet, 13008 Marseille

---

## Architecture

```
diamantek/
├── src/                        # Serveur NestJS
│   ├── main.ts                 # Point d'entrée Nest + middlewares sécurité
│   ├── app.module.ts           # Module principal
│   ├── site/
│   │   └── site.controller.ts  # Routes pages HTML
│   ├── contact/
│   │   ├── contact.controller.ts  # GET /api/csrf-token + POST /api/contact
│   │   ├── contact.service.ts     # CSRF, rate limiting, validation
│   │   └── contact.types.ts
│   ├── email/
│   │   └── email.service.ts    # Envoi SMTP via nodemailer
│   └── types/
│       └── express-session.d.ts
│
├── frontend/                   # Fichiers statiques servis par NestJS
│   ├── index.html              # Accueil : Hero + Chiffres + Aperçu prestations + Badge avis
│   ├── notre-histoire.html     # Histoire Jérémie Ayache + Certification Casher
│   ├── nos-prestations.html    # 6 cartes prestations détaillées + CTA devis
│   ├── galerie.html            # Galerie paginée + filtres + Lieux d'Exception + lightbox
│   ├── avis.html               # 8 avis Google + carousel + CTA Google
│   ├── contact.html            # Formulaire devis EmailJS + coordonnées
│   ├── mentions-legales.html
│   ├── politique-confidentialite.html
│   ├── cgv.html
│   ├── css/
│   │   ├── main.css            # Variables, reset, utilitaires, animations
│   │   └── components/
│   │       ├── header.css      # Navigation sticky + mobile
│   │       ├── hero.css        # Section hero + scroll indicator
│   │       ├── sections.css    # Chiffres, prestations, histoire, partenaires, contact
│   │       ├── carousel.css    # Carousel avis Google
│   │       ├── gallery.css     # Galerie masonry + lightbox
│   │       └── footer.css      # Footer + responsive global
│   │   └── pages/
│   │       ├── legal.css       # Pages légales
│   │       └── inner.css       # Pages internes (page-hero, page-cta, avis-teaser)
│   ├── js/
│   │   ├── main.js             # Orchestration — importe tous les modules
│   │   ├── modules/
│   │   │   ├── animations.js   # Loading, scroll reveal, compteurs, parallax, cursor
│   │   │   ├── navigation.js   # Nav sticky, burger mobile, back-to-top
│   │   │   ├── carousel.js     # Carousel avis (swipe, autoplay, dots)
│   │   │   ├── gallery.js      # Filtre galerie + lightbox
│   │   │   └── contact.js      # Formulaire — CSRF, validation, POST /api/contact
│   │   └── utils/
│   │       └── helpers.js      # debounce(), fonctions pures réutilisables
│   └── assets/
│       ├── logo.png
│       └── photos/             # Photos placées par le client
│
├── sitemap.xml                 # Servi à /sitemap.xml par NestJS
├── robots.txt                  # Servi à /robots.txt par NestJS
├── .env                        # JAMAIS committé — voir .env.example
├── .env.example                # Template vide committé
├── .gitignore
├── package.json
├── tsconfig.json
├── nest-cli.json
├── README.md
└── CLAUDE.md
```

---

## Identité Visuelle — NE JAMAIS MODIFIER

| Élément | Valeur |
|---|---|
| Noir principal | `#080808` |
| Or | `#c9a96e` |
| Or clair | `#e0c48c` |
| Or foncé | `#a8854d` |
| Blanc cassé | `#f5f0e8` |
| Gris | `#666666` |
| Font titres | **Cormorant Garamond** (serif, élégant) |
| Font corps | **Montserrat** (ultra-light 200–400) |
| Tone | Luxe, premium, éditorial — jamais cheap |

Les variables CSS sont dans `frontend/css/main.css` section `:root`.

---

## Règles de Code

- **CSS** : nommage BEM pour les nouveaux composants (`.bloc__element--modifier`)
- **JS** : ES6 modules (`import`/`export`), pas de jQuery, pas de bibliothèque tierce
- **HTML** : zéro style ou script inline — tout dans les fichiers dédiés
- **Pas de framework CSS** : pas de Bootstrap, Tailwind, Foundation…
- **Commentaires** : en français
- **Indentation** : 2 espaces
- **Quotes** : simples en JS, doubles en HTML/CSS
- **Nommage fichiers** : kebab-case

---

## SEO — Toujours préserver

- Balises `<title>` et `<meta name="description">` uniques sur chaque page
- Schema.org JSON-LD dans `<head>` de `index.html` (FoodEstablishment)
- `alt` descriptif sur toutes les images
- Structure H1→H2→H3 respectée (un seul H1 par page)
- `sitemap.xml` et `robots.txt` accessibles à la racine du site
- Pas de contenu dupliqué entre les pages

---

## Sécurité — Ne jamais compromettre

1. **Jamais de credentials en dur** — uniquement via `process.env` / `.env`
2. **CSRF** : token généré côté serveur, validé sur chaque POST
3. **Validation serveur** : longueur, format, sanitisation `sanitize-html` avant traitement
4. **Rate limiting** : 10/min sur `/api/contact` (par IP)
5. **Headers HTTP** : `helmet` + CSP strict en production
6. **Pas de stack trace** exposée en production (`NODE_ENV=production`)
7. **HTTPS uniquement** en production (redirection auto via proxy headers)
8. **Logs** : ne jamais logger les données personnelles (email, tel, nom)

---

## Contenu Client — NE PAS MODIFIER SANS INSTRUCTION EXPLICITE

- Coordonnées : 06.13.48.01.16 / 04.88.10.61.19 / diamantek.traiteur@gmail.com
- Adresse : 192 Rue du Rouet, 13008 Marseille
- Avis Google : **4,9/5 — 132 avis** (mettre à jour uniquement sur demande)
- Texte section histoire : Jérémy Ayache, +10 ans, +1000 événements
- Descriptions des prestations (6 cartes)
- Références clients : supprimées du site (retirées sur demande client)
- Certifications : Halavi & Bassari

---

## Ce que Claude NE doit PAS faire

- ❌ Modifier le design ou la palette de couleurs sans instruction explicite
- ❌ Supprimer ou réécrire les balises SEO (meta, Schema.org, sitemap)
- ❌ Ajouter des bibliothèques frontend (jQuery, Bootstrap, Vue, React…)
- ❌ Committer `.env` ou tout fichier contenant des secrets
- ❌ Changer les coordonnées client sans instruction
- ❌ Exposer des données sensibles dans les logs ou les réponses API
- ❌ Utiliser `eval()`, `innerHTML` avec contenu non sanitisé
- ❌ Supprimer le CSRF ou le rate limiting

---

## API Backend

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/` | Sert `frontend/index.html` |
| `GET` | `/notre-histoire` | Page histoire + certifications |
| `GET` | `/nos-prestations` | Page prestations détaillées |
| `GET` | `/galerie` | Page galerie + lieux d'exception |
| `GET` | `/avis` | Page avis Google |
| `GET` | `/contact` | Page contact + formulaire devis |
| `GET` | `/mentions-legales` | Page mentions légales |
| `GET` | `/politique-confidentialite` | Page RGPD |
| `GET` | `/cgv` | Page CGV |
| `GET` | `/sitemap.xml` | Sitemap SEO |
| `GET` | `/robots.txt` | Robots SEO |
| `GET` | `/api/csrf-token` | Retourne un token CSRF (session) |
| `POST` | `/api/contact` | Traite le formulaire de devis |

---

## Journal des sessions

### Session 2026-03-30 (Création initiale + Refactoring)
**Réalisé** :
- Site vitrine complet créé (HTML/CSS/JS single-page, SEO complet, Schema.org)
- Refactoring complet vers architecture modulaire :
  - CSS découpé en 7 composants + 1 fichier pages légales
  - JS découpé en 5 modules ES6 + 1 utils
  - Backend initial créé (routing, CSRF, rate limiting, SMTP, headers sécurité)
  - Pages légales créées (mentions légales, RGPD, CGV)
  - CLAUDE.md, README.md, .gitignore, .env.example

### Session 2026-03-30 (Migration backend vers NestJS)
**Réalisé** :
- Migration backend complète vers NestJS (TypeScript)
- Reproduction des routes existantes (`/`, `/mentions-legales`, `/politique-confidentialite`, `/cgv`, `/sitemap.xml`, `/robots.txt`)
- Reproduction de l'API (`GET /api/csrf-token`, `POST /api/contact`)
- Conservation des garanties sécurité : CSRF session, validation/sanitisation, rate limiting 10/min, headers HTTP renforcés, redirection HTTPS en production
- Migration SMTP vers `nodemailer`
- Mise à jour des scripts de lancement Windows, du `.env.example` et de `README.md`
- Suppression des anciens composants backend pour un déploiement 100% Node.js

### Session 2026-04-02 (Fix déploiement automatique frontend)
**Réalisé** :
- Ajout de `cpx2` en devDependency (copie cross-platform Windows/Linux)
- Script `build` mis à jour : `nest build && cpx "frontend/**/*" dist/frontend`
- Le frontend est désormais copié dans `dist/frontend/` à chaque build
- `runtime-paths.ts` gère déjà la résolution du chemin (dev = `./frontend`, prod = `dist/frontend`)
- README mis à jour avec le workflow de déploiement Git automatique
- Suppression des références clients (Mairie de Marseille, Keren Hayessod, Optical Center, La Poste, Audi) sur demande

### Session 2026-04-02 (Corrections finales contenu)
**Réalisé** :
- **Avis Google** : 6 faux avis remplacés par 8 vrais avis Google vérifiés
- **Prénom** : "Jérémy" → "Jérémie" partout (index.html, mentions-legales.html, cgv.html, politique-confidentialite.html)
- **Formulation avis** : "Quasi meilleur traiteur kasher de la région" → "Traiteur kasher parmi les mieux notés de Marseille et du Grand Sud"
- **Hébergeur** : OVH remplacé par Hostinger International Ltd. (mentions-legales.html + politique-confidentialite.html)
- **Partenaires** : "Animation & DJ" supprimé
- **Canonical tags** : déjà présents sur toutes les pages
- **Sitemap/robots.txt** : déjà sur le bon domaine (www.diamantektraiteur.com)
- **URLs Hostinger staging** : aucune trouvée dans les fichiers frontend (déjà propres)

### Session 2026-04-22 (Conversion single-page → multi-pages)
**Réalisé** :
- **Architecture multi-pages** : conversion complète de la single-page en 5 pages dédiées + homepage allégée
  - `/notre-histoire` — Histoire de Jérémie Ayache + Certification Casher (Beth Din, Halavi, Bassari)
  - `/nos-prestations` — 6 cartes prestations complètes + CTA devis
  - `/galerie` — Galerie magazine paginée (28 photos) + filtres par catégorie + Lieux d'Exception + lightbox
  - `/avis` — 8 avis Google vérifiés en carousel + CTA Google
  - `/contact` — Formulaire devis EmailJS + coordonnées complètes
- **Homepage allégée** : Hero + Chiffres clés + Aperçu 6 prestations (CTA "En savoir plus" → /nos-prestations) + Badge avis 4,9/5 → /avis
- **Nouveau CSS** : `frontend/css/pages/inner.css` (`.page-hero`, `.page-cta`, `.avis-teaser`)
- **Nouveau backend** : 5 routes NestJS ajoutées (`/notre-histoire`, `/nos-prestations`, `/galerie`, `/avis`, `/contact`)
- **Navigation** : mise à jour sur toutes les pages (7 items : Accueil, Nos Prestations, À Propos, Casher, Galerie, Avis, Contact)
- **Sitemap** : mis à jour avec les 5 nouvelles URLs (ancres supprimées, vraies pages ajoutées)
- **Pages légales** : navigation et footer mis à jour (tous les liens `/#ancre` → vraies URLs)

### Session 2026-05-06 (Restructuration complète de la homepage)
**Réalisé** :
- **Sections supprimées** : ancienne section prestations (cards avec descriptions) + ancienne section avis-teaser (badge simple)
- **Section ajoutée — Storytelling Jérémie** : photo `jeremy-ayache.jpg` à gauche, texte + certifications Halavi/Bassari à droite. Commentaire `<!-- TODO Billy : retoucher photo Jérémie -->` sur la balise `<img>`. Utilise les classes `.histoire-grid` / `.histoire-img-wrap` / `.histoire-content` existantes.
- **Section modifiée — Nos Prestations** : nouveau format galerie photo pleine largeur (grille 3×2) avec uniquement l'étiquette en overlay (Mariage, Bar Mitsva, Brunch, Cocktail Dinatoire, Événements d'Entreprise, International). Classe `.prestations-galerie` + sous-classes.
- **Section ajoutée — Zones d'intervention** : carte SVG Europe inline (fond #080808, contours or, points dorés sur Marseille, Nice, Cannes, Montpellier, Toulouse, Corse, Italie du Nord, Barcelone) à gauche + texte + liste zones à droite.
- **Section ajoutée — Certifications casher** : bloc Beth Din de Marseille + grille 2 colonnes Halavi / Bassari. Réutilise les classes `.certif-bethdin`, `.certif-grid`, `.certif-block` existantes.
- **Section ajoutée — Feed Instagram** : grille 3×2 de placeholders visuels, `id="instagram-feed"`, commentaire `<!-- TODO : configurer token Instagram Basic Display API -->`.
- **Section modifiée — Avis** : 3 avis statiques (Vincent P., Lea OR, Benjamin Perez) en grille 3 colonnes + CTA "Découvrir tous nos avis" → /avis. Remplace le badge avis-teaser.
- **CSS** : ajout de ~200 lignes dans `inner.css` pour toutes les nouvelles classes homepage.
