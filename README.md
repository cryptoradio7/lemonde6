# lemonde6

Site d'information grand public inspiré de [Le Monde](https://www.lemonde.fr) — articles de presse, catégories thématiques, moteur de recherche, espace utilisateur et interface d'administration.

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 14 (App Router) |
| Langage | TypeScript |
| Style | Tailwind CSS |
| ORM | Prisma |
| Base de données | SQLite (dev) / PostgreSQL (prod) |
| Authentification | NextAuth.js v5 (beta) |
| Deploy | Vercel |

## Fonctionnalités

- **Page d'accueil** — articles vedette, breaking news, catégories
- **Recherche full-text** — recherche dans titres et contenus
- **Page article** — contenu complet, auteur, date, catégorie, partage social
- **Authentification** — inscription/connexion email + password (JWT)
- **Newsletter** — abonnement email, désinscription (RGPD)
- **Partage réseaux sociaux** — Facebook, Twitter/X, WhatsApp, LinkedIn
- **SEO** — meta tags, Open Graph, sitemap.xml, robots.txt, SSR
- **Interface admin** — CRUD articles, gestion utilisateurs et catégories

## Installation locale

### Prérequis

- Node.js 20+
- npm 10+
- Git

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/cryptoradio7/lemonde6.git
cd lemonde6

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos valeurs (voir section Variables d'environnement)

# 4. Initialiser la base de données
npx prisma migrate dev --name init

# 5. Peupler la base de données avec des données de démo
npm run seed

# 6. Lancer le serveur de développement
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

Créer un fichier `.env.local` à la racine du projet :

```env
# Base de données SQLite (développement)
DATABASE_URL="file:./prisma/dev.db"

# Secret NextAuth.js — générer avec : openssl rand -base64 32
NEXTAUTH_SECRET="votre-secret-aleatoire-ici"

# URL de base de l'application
NEXTAUTH_URL="http://localhost:3000"
```

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL de connexion Prisma | `file:./prisma/dev.db` |
| `NEXTAUTH_SECRET` | Clé secrète JWT NextAuth (min. 32 chars) | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL publique de l'application | `http://localhost:3000` |

### Production (Vercel + PostgreSQL)

```env
DATABASE_URL="postgresql://user:password@host:5432/lemonde6"
NEXTAUTH_SECRET="secret-production-genere"
NEXTAUTH_URL="https://lemonde6.vercel.app"
```

## Scripts disponibles

```bash
npm run dev       # Serveur de développement (http://localhost:3000)
npm run build     # Build de production
npm run start     # Serveur de production
npm run lint      # Vérification ESLint
npm run seed      # Peuplement base de données
```

## Structure des fichiers principaux

```
lemonde6/
├── .github/
│   └── workflows/
│       └── ci.yml              # CI/CD GitHub Actions
├── prisma/
│   ├── schema.prisma           # Modèles de données (Article, Category, User, Newsletter)
│   ├── seed.ts                 # Script de peuplement base de données
│   └── dev.db                  # Base SQLite locale (ignorée par git)
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Layout racine
│   │   ├── page.tsx            # Page d'accueil
│   │   ├── admin/              # Interface d'administration
│   │   ├── api/                # Routes API
│   │   │   ├── articles/       # CRUD articles
│   │   │   ├── auth/           # Authentification NextAuth
│   │   │   ├── categories/     # CRUD catégories
│   │   │   ├── newsletter/     # Gestion newsletter
│   │   │   └── search/         # Recherche full-text
│   │   ├── article/            # Pages articles
│   │   ├── auteur/             # Pages auteurs
│   │   ├── auth/               # Pages connexion/inscription
│   │   ├── categories/         # Pages catégories
│   │   ├── les-plus-lus/       # Articles les plus lus
│   │   ├── search/             # Page de recherche
│   │   ├── robots.ts           # Génération robots.txt
│   │   └── sitemap.ts          # Génération sitemap.xml
│   ├── components/             # Composants React réutilisables
│   ├── lib/
│   │   ├── auth.ts             # Configuration NextAuth.js
│   │   ├── prisma.ts           # Client Prisma (singleton)
│   │   └── utils.ts            # Fonctions utilitaires
│   └── types/                  # Types TypeScript
├── next.config.js              # Configuration Next.js
├── tailwind.config.ts          # Configuration Tailwind CSS
├── tsconfig.json               # Configuration TypeScript
└── package.json
```

## Modèles de données

```prisma
model Article {
  id           Int      # Identifiant unique
  title        String   # Titre de l'article
  slug         String   # URL slug (unique)
  excerpt      String   # Résumé court
  content      String   # Contenu complet
  image        String?  # URL image principale
  badge        String?  # Badge (ex: "EXCLUSIF")
  featured     Boolean  # Article vedette
  status       String   # "published" | "draft"
  views        Int      # Nombre de vues
  readingTime  Int      # Temps de lecture estimé (minutes)
  category     Category # Catégorie associée
  author       User     # Auteur
}

model Category { id, name, slug, description, color, active }
model User     { id, email, password, name, bio, avatar, role }
model Newsletter { id, email, subscribed, token }
```

## URLs importantes

| Ressource | URL |
|-----------|-----|
| Dépôt GitHub | https://github.com/cryptoradio7/lemonde6 |
| Demo Vercel | https://lemonde6.vercel.app |
| Documentation Next.js | https://nextjs.org/docs |
| Documentation Prisma | https://www.prisma.io/docs |
| Documentation NextAuth.js | https://authjs.dev |

## Licence

Projet privé — tous droits réservés.
