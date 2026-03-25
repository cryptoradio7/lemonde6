#!/usr/bin/env python3
"""Lance Claude Code en sous-processus pour la Phase 3 — Développement."""
import subprocess
import sys

PROMPT = """Tu es le Développeur craftsman senior dans l'équipe AgileVizion.

CONTEXTE PROJET:
- Nom: lemonde6
- Répertoire: /tmp/lemonde6
- GitHub: cryptoradio7/lemonde6
- Stack: Next.js 14 App Router, Tailwind CSS, Prisma + SQLite, NextAuth.js v5
- Credentials: /root/.openclaw/clients/6359703425.json

ÉTAT ACTUEL:
Le projet Next.js est configuré avec:
- prisma/schema.prisma (tous les modèles: User, Article, Category, Author, Tag, Comment, NewsletterSubscriber)
- src/lib/prisma.ts et src/lib/auth.ts
- package.json (deps installées)
- .env (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL)
- REVERSE_ENGINEERING.md et SPECS_FONCTIONNELLES.md (specs complètes)

MISSION: Implémenter les stories P1 en priorité:

## Story #14 — Seed des données (FAIRE EN PREMIER)
Compléter prisma/seed.ts avec:
- 8 catégories: Politique, International, Société, Économie, Culture, Sciences, Sport, Planète
- 10 auteurs avec bio et avatar (utiliser des URLs d'avatars picsum.photos)
- 30+ articles publiés avec contenu réaliste (texte long en français), badges variés
- 3 articles featured=true pour le hero
- Des tags variés
- Compte admin: email=admin@lemonde6.fr, password=admin123 (bcrypt hash)
- UPSERT pour idempotence

Puis: npx prisma db push && npm run seed (ou npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts)

## Story #9 — SEO de base (next.config.js + layout metadata)
Dans src/app/layout.tsx, ajouter les metadata Next.js globales.
Créer next-sitemap.config.js.

## Story #1 — Page d'accueil
Créer src/app/page.tsx complet avec:
- Lecture depuis Prisma: article featured (hero), articles récents (grille 4 cols), sections par rubrique
- Composant HeroArticle (65% + sidebar 35%)
- Composant ArticleCard pour grille
- Composant SectionRubrique
- CSS Tailwind fidèle au style lemonde.fr (fond blanc, typo serif pour titres)

Créer les composants dans src/components/:
- layout/Header.tsx (nav avec toutes les rubriques, logo, bouton login)
- layout/Footer.tsx (newsletter form, liens rubriques)
- articles/HeroArticle.tsx
- articles/ArticleCard.tsx
- articles/SectionRubrique.tsx
- ui/Badge.tsx (badges ANALYSE, REPORTAGE, etc.)

## Story #2 — Page article
Créer src/app/articles/[slug]/page.tsx avec:
- generateStaticParams pour SSG ou generateMetadata pour SSR
- Tous les composants: breadcrumb, titre, chapeau, auteur, image, corps HTML, partage social, recommandés

## Story #3 — Page catégorie
Créer src/app/categories/[slug]/page.tsx

## Story #4 — Recherche
Créer src/app/search/page.tsx
Créer src/app/api/search/route.ts (recherche LIKE sur title et content)

## Story #5+6 — Auth
Compléter src/lib/auth.ts pour NextAuth.js v5
Créer src/app/(auth)/login/page.tsx
Créer src/app/(auth)/register/page.tsx
Créer src/app/api/auth/[...nextauth]/route.ts
Créer src/app/api/auth/register/route.ts

## Stories restantes (P2)
Story #7: Newsletter - src/app/api/newsletter/route.ts
Story #8: Partage social déjà dans Story #2
Story #10: Admin - src/app/admin/page.tsx + CRUD API routes
Story #11: Admin catégories
Story #12: src/app/auteurs/[slug]/page.tsx
Story #13: "Les plus lus" (composant sidebar)

## Instructions techniques:

### Imports Prisma (toujours utiliser le singleton):
```typescript
import { prisma } from '@/lib/prisma'
```

### Auth dans les Server Components (NextAuth v5):
```typescript
import { auth } from '@/lib/auth'
const session = await auth()
```

### getServerSideProps → équivalent en App Router:
```typescript
// Dans une page server component:
const articles = await prisma.article.findMany({...})
```

### Typo lemonde.fr:
- Titres: font Georgia ou serif, bold
- Corps: 18px, line-height 1.7
- Couleurs: noir #1a1a1a, gris #666, rouge #d0021b (rubriques)
- Fond: blanc pur

### Tailwind config:
Ajouter dans tailwind.config.ts:
fontFamily: { serif: ['Georgia', 'Times New Roman', 'serif'] }

### Après chaque groupe de stories, commit + push:
TOKEN=$(python3 -c "import json; print(json.load(open('/root/.openclaw/clients/6359703425.json'))['git_token'])")
git add -A
git commit -m "feat: implémentation stories X-Y (#X)"
git push https://${TOKEN}@github.com/cryptoradio7/lemonde6.git main

### Fermer les issues après implémentation:
gh issue close N --repo cryptoradio7/lemonde6 --comment "Implémenté dans le commit XXX"

### Après TOUTES les stories, mettre à jour state/project_state.json:
- phase = "phase_4_cyber"
- phase_status = "pending"
- phases.phase_3_dev.status = "done"
- Toutes les stories: status = "done"

### Commande de vérification finale:
cd /tmp/lemonde6 && npm run build

Quand tout est terminé, execute:
openclaw system event --text "Phase 3 Dev terminée: toutes les stories implémentées, build Next.js OK, prêt pour Phase 4 Cyber" --mode now
"""

result = subprocess.run(
    ['claude', '--permission-mode', 'bypassPermissions', '--print', PROMPT],
    cwd='/tmp/lemonde6',
    capture_output=False,
    text=True
)
sys.exit(result.returncode)
