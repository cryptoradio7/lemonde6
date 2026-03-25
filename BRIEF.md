# BRIEF.md — Projet lemonde6

## Identite projet

- **Nom** : lemonde6
- **Type** : Site web d'information / presse en ligne
- **Client** : CryptoQuant (chat_id: 6359703425)
- **Repo** : github.com/cryptoradio7/lemonde6
- **Repertoire de travail** : /tmp/lemonde6
- **Deadline** : ASAP
- **Niveau qualite** : Production
- **Mode** : Autonome (brief seul valide par l'utilisateur)

## Description

Site d'information grand public inspire de www.lemonde.fr — articles de presse, categories thematiques, moteur de recherche, espace utilisateur.

## Reference visuelle

- **URL** : https://www.lemonde.fr
- Reverse engineering obligatoire (Playwright MCP)

## Utilisateurs cibles

Grand public

## Environnement

Web / Navigateur (SSR recommande pour SEO)

## MVP — Fonctionnalites prioritaires

1. **Page d'accueil** — articles vedette, breaking news, categories
2. **Recherche full-text** — recherche dans les titres et contenus d'articles
3. **Page detail article** — contenu complet, auteur, date, categorie, partage social
4. **Authentification utilisateur** — inscription/connexion (email + password, JWT)
5. **Newsletter** — abonnement email, gestion desabonnement (RGPD)
6. **Partage reseaux sociaux** — Facebook, Twitter/X, WhatsApp, LinkedIn
7. **SEO** — balises meta, Open Graph, sitemap.xml, robots.txt, SSR
8. **Interface admin** — gestion des articles (CRUD), gestion utilisateurs, gestion categories

## Contraintes techniques

- Aucune contrainte imposee
- Stack recommandee : Next.js 14 (App Router), Tailwind CSS, Prisma, PostgreSQL ou SQLite
- Auth : NextAuth.js + JWT
- Deploy : Vercel

## Besoins non fonctionnels

- SEO : Oui (SSR obligatoire)
- RGPD : Oui (bandeau cookies, desabonnement newsletter)
- Analytics : Plausible (ou intregre simple)
- Responsive : Oui (mobile-first)
- Accessibilite : WCAG AA
- Performance : Core Web Vitals optimises

## Donnees

- Base de donnees avec seed realiste (minimum 30 articles, 5 categories, 3 auteurs)
- JAMAIS de donnees hardcodees dans le code

## Gates

- Mode AUTONOME : seul le brief est valide par l'utilisateur
- L'equipe livre sans demander d'autorisation intermediaire
- Communication Telegram : lancement + livraison + blocker uniquement
