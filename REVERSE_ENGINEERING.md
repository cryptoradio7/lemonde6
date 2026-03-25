# REVERSE ENGINEERING — www.lemonde.fr

> Analyse effectuée le 2026-03-25. Source : connaissance approfondie du site de référence.
> Note : Playwright non disponible dans cet environnement. Analyse basée sur connaissance du site.

---

## A. INVENTAIRE COMPOSANTS PAR ZONE

### Header

#### Top Bar (bandeau supérieur)
- Fond blanc, bordure grise en bas
- **Gauche** : Date du jour (format "mercredi 25 mars 2026") + liens édition abonnés
- **Centre** : Logo Le Monde (typographie serif noir, ~40px, cliquable → accueil)
- **Droite** : Boutons "Se connecter" + "S'abonner" (bouton bleu foncé), icône loupe

#### Navigation principale
- Bandeau gris clair ou blanc, liens horizontaux
- Rubriques : **International | Politique | Société | Les Décodeurs | Sport | Sciences | Planète | Culture | Pixels | Economie | Idées | Campus**
- Style : texte sans-serif 14px, espacement généreux, hover soulignement
- Icône hamburger (menu mobile) + icône loupe recherche

#### Ticker / Breaking news
- Bandeau rouge ou jaune en haut si alerte breaking news
- Texte défilant avec badge coloré : **ALERTE**, **LIVE EN COURS**, **DIRECT**

---

### Page Accueil — Structure principale

#### Hero Section (above the fold)
```
┌──────────────────────────────────────┬─────────────────┐
│  ARTICLE PRINCIPAL (UNE)             │  SIDEBAR        │
│  ┌────────────────────────────────┐  │  Article 2      │
│  │   IMAGE PRINCIPALE             │  │  [img] Titre    │
│  │   aspect ratio 16:9            │  │  Rubrique • Date│
│  │   overlay gradient bas         │  │ ─────────────── │
│  │   BADGE RUBRIQUE (rouge/bleu)  │  │  Article 3      │
│  └────────────────────────────────┘  │  [img] Titre    │
│  TITRE 32-36px serif bold            │  Rubrique • Date│
│  Chapeau 16px serif italic           │ ─────────────── │
│  Auteur · Date · Temps lecture       │  Article 4      │
│  Largeur : ~65%                      │  Largeur : ~35% │
└──────────────────────────────────────┴─────────────────┘
```

#### Section "Les plus récents" / "À la une"
- Grille 3 colonnes, cartes articles
- Chaque carte : image (aspect 16:9) + badge rubrique + titre (2 lignes max) + auteur + date

#### Sections par rubrique
- Titre de section (ex: **INTERNATIONAL**) avec lien "Voir tout →"
- 4 articles en ligne horizontale
- Premier article : grande image + titre long
- Articles 2-4 : petit format, titre uniquement ou image petite

#### À la une éditoriale (bloc spécial)
- Mise en avant d'un dossier ou série
- Fond coloré (gris, bleu marine selon l'importance)
- Titre editorial + chapeau + CTA "Lire le dossier"

#### Footer
```
┌────────────────────────────────────────────────────────┐
│  Newsletter : "Recevez nos newsletters"  [email] [OK]  │
├────────┬────────┬─────────────┬────────────┬───────────┤
│ Le Monde│Rubriques│ Services   │  Légal     │  Réseaux  │
│ Qui ?   │ Politique│ Abonnements│ Mentions   │ Facebook  │
│ Contact │ Société │ Newsletters │ CGU        │ Twitter/X │
│ Publicité│ Monde  │ Applications│ RGPD       │ Instagram │
│         │ Économie│ Archives    │ Cookies    │ YouTube   │
└────────┴────────┴─────────────┴────────────┴───────────┘
│  © Le Monde 2026 · Tous droits réservés                │
└────────────────────────────────────────────────────────┘
```

---

### Page Article — Composants

#### Fil d'Ariane (Breadcrumb)
```
Accueil > Politique > Titre court article
```
- Liens cliquables, séparateur ">"
- Dernier élément non cliquable (page courante)

#### En-tête article
```
┌────────────────────────────────────────────────────────┐
│  [BADGE RUBRIQUE]  •  [Sous-rubrique optionnelle]      │
│                                                        │
│  TITRE DE L'ARTICLE — LONG ET COMPLET                  │
│  (font: serif, 28-36px, bold, line-height: 1.3)        │
│                                                        │
│  Chapeau de l'article, texte introductif en italique   │
│  (16-18px, serif, gris foncé)                          │
│                                                        │
│  Par [Prénom Nom auteur] (lien)  ·  25 mars 2026       │
│  Temps de lecture : 5 min                              │
└────────────────────────────────────────────────────────┘
```

#### Image principale
- Pleine largeur (100% du container article)
- Légende sous l'image : texte gris 13px
- Crédit photographe : "REUTERS / NOM PHOTOGRAPHE"

#### Corps de l'article
- Largeur max ~700px, centré
- Paragraphes : serif 18px, line-height 1.7, couleur #333
- Intertitres : bold 22px
- Citations (blockquote) : fond gris clair, bordure gauche bleue, italic
- Listes : puces classiques
- Liens : couleur bleue, soulignés

#### Barre partage social (sticky ou en bas)
```
[Partager sur Facebook] [Twitter/X] [WhatsApp] [LinkedIn] [Copier le lien]
```
- Icônes + texte ou icônes seules selon la résolution
- Position : en haut sous le titre OU sticky à gauche (desktop)

#### Bloc "Pour aller plus loin" (fin d'article)
- 3-4 articles recommandés dans la même rubrique
- Format carte horizontale (image gauche + titre droite)

#### Section commentaires
- Réservée aux abonnés → hors scope pour lemonde6

---

### Badges et Labels

| Badge | Couleur | Condition d'affichage |
|-------|---------|----------------------|
| `ALERTE` | Rouge vif | Breaking news urgent |
| `LIVE` | Rouge animé | Événement en direct |
| `DIRECT` | Rouge | Couverture temps réel |
| `ANALYSE` | Bleu gris | Article d'analyse |
| `REPORTAGE` | Gris | Grand reportage |
| `ENQUÊTE` | Marron | Investigation |
| `CHRONIQUE` | Vert | Opinion régulière |
| `VIDÉO` | Noir | Contenu vidéo |
| `PODCAST` | Violet | Contenu audio |

---

### Page Recherche

```
┌────────────────────────────────────────────────────────┐
│  🔍  [         Saisir votre recherche         ] [OK]   │
│  Résultats pour "ukraine" — 1 243 articles             │
├────────────────────────────────────────────────────────┤
│  Filtres : Pertinence ▼ | Date ▼ | Rubrique ▼          │
├────────────────────────────────────────────────────────┤
│  Article 1                                              │
│  Titre de l'article avec le terme surligné             │
│  Chapeau court · Rubrique · 24 mars 2026               │
├────────────────────────────────────────────────────────┤
│  Article 2 ...                                         │
│  [Charger plus de résultats]                           │
└────────────────────────────────────────────────────────┘
```

---

### Page Catégorie / Rubrique

```
┌────────────────────────────────────────────────────────┐
│  POLITIQUE                                             │
│  Les dernières actualités politiques françaises         │
├────────────────────┬───────────────────────────────────┤
│  Article principal │  Articles secondaires             │
│  (grande image)    │  Liste compacte (titre + date)    │
├────────────────────┴───────────────────────────────────┤
│  Grille articles récents (3 colonnes)                  │
└────────────────────────────────────────────────────────┘
```

---

## B. INVENTAIRE FEATURES OBSERVABLES

| Feature | Statut | Notes |
|---------|--------|-------|
| Navigation par rubriques | ✅ In scope | Menu horizontal |
| Recherche full-text | ✅ In scope | Avec filtres |
| Page détail article | ✅ In scope | SSR, SEO |
| Badges de type article | ✅ In scope | Enum dans DB |
| Partage réseaux sociaux | ✅ In scope | 5 réseaux |
| Newsletter footer + article | ✅ In scope | RGPD |
| Authentification | ✅ In scope | Email + password |
| Interface admin | ✅ In scope | CRUD articles |
| Page auteur | ✅ In scope | Bio + articles |
| Fil d'Ariane | ✅ In scope | Breadcrumb |
| Articles recommandés | ✅ In scope | Même rubrique |
| Temps de lecture | ✅ In scope | Calculé auto |
| Articles "Les plus lus" | ✅ In scope | Compteur views |
| SEO (meta, OG, sitemap) | ✅ In scope | Next.js SSR |
| Pagination / "Voir plus" | ✅ In scope | Load more |
| Paywall abonnement | ❌ Hors scope | Trop complexe |
| Commentaires abonnés | ❌ Hors scope | Modération complexe |
| Live/Direct temps réel | ❌ Hors scope | WebSocket requis |
| Applications mobiles | ❌ Hors scope | Web uniquement |

---

## C. MODÈLE DE DONNÉES DÉDUIT

### Article
```
- id: cuid
- title: string (~120 chars)
- slug: string (unique, SEO)
- excerpt: string (~200 chars, chapeau)
- content: text (HTML riche, ~2000+ mots)
- imageUrl: string (URL image principale)
- imageCaption: string (légende)
- imageCredit: string (crédit photographe)
- status: enum [draft, published, archived]
- badge: enum [normal, analyse, reportage, enquete, chronique, video, podcast]
- featured: boolean (mis en avant UNE)
- readingTime: int (minutes, calculé)
- views: int (compteur lectures)
- publishedAt: datetime
- authorId: FK → Author
- categoryId: FK → Category
- tags: many-to-many → Tag
```

### Category (Rubrique)
```
- id: cuid
- name: string (ex: "Politique")
- slug: string (ex: "politique")
- description: string
- color: string (hex, pour les badges)
- parentId: FK → Category (sous-rubriques)
```

### Author
```
- id: cuid
- name: string
- bio: string
- avatar: string (URL photo)
- email: string
- articles: one-to-many
```

### Tag
```
- id: cuid
- name: string
- slug: string
- articles: many-to-many
```

### User
```
- id: cuid
- email: string (unique)
- name: string
- password: string (bcrypt)
- role: enum [reader, journalist, admin]
- image: string
```

### NewsletterSubscriber
```
- id: cuid
- email: string (unique)
- confirmedAt: datetime (double opt-in)
- unsubscribedAt: datetime
- token: string (pour désabonnement)
```

---

## D. LAYOUT EXACT PAR PAGE

### Accueil — Grille articles (section rubriques)
```
┌────────────┬────────────┬────────────┬────────────┐
│  Article 1 │  Article 2 │  Article 3 │  Article 4 │
│  Image     │  Image     │  Image     │  Image     │
│  16:9      │  16:9      │  16:9      │  16:9      │
│  Rubrique  │  Rubrique  │  Rubrique  │  Rubrique  │
│  Titre     │  Titre     │  Titre     │  Titre     │
│  2 lignes  │  2 lignes  │  2 lignes  │  2 lignes  │
│  Auteur    │  Auteur    │  Auteur    │  Auteur    │
│  Date      │  Date      │  Date      │  Date      │
└────────────┴────────────┴────────────┴────────────┘
```
- Desktop : 4 colonnes
- Tablet : 2 colonnes
- Mobile : 1 colonne

### Article — Layout desktop
```
┌─────────────────────────────────────┬──────────────┐
│  ARTICLE (max-width: 700px)         │  SIDEBAR     │
│  Breadcrumb                         │  Les + lus   │
│  Badge · Titre · Chapeau · Meta     │  Newsletter  │
│  Image principale                   │  Pubs        │
│  Corps du texte                     │              │
│  Tags                               │              │
│  Partage social                     │              │
│  Articles recommandés               │              │
│  Largeur : ~70%                     │  ~30%        │
└─────────────────────────────────────┴──────────────┘
```

---

## E. RÈGLES DE GESTION VISIBLES

| Règle | Comportement |
|-------|--------------|
| Ordre des articles (accueil) | Par date de publication DESC, `featured=true` en UNE |
| Format date | "25 mars 2026 à 09h30" (FR), relative si < 24h ("Il y a 2h") |
| Troncature titres cartes | 2 lignes (line-clamp: 2), ellipsis |
| Troncature excerpt | 3 lignes sur les cartes |
| Hover sur carte article | Image : légère transformation scale(1.03), titre : soulignement |
| Badge LIVE | Clignotant (animation CSS pulse) |
| "Les plus lus" | Triés par `views` DESC sur les 7 derniers jours |
| Temps de lecture | `Math.ceil(wordCount / 200)` minutes |
| Slug article | Généré depuis le titre (slugify), unique |

---

## F. FEATURES IN SCOPE vs HORS SCOPE

### ✅ In Scope (à implémenter)
1. Page d'accueil avec hero, grille, sections rubriques
2. Page article avec tous les composants
3. Navigation rubriques
4. Recherche full-text (SQLite FTS ou LIKE)
5. Authentification (email/password)
6. Newsletter subscribe/unsubscribe
7. Partage social (5 réseaux)
8. SEO complet (meta, OG, sitemap, robots)
9. Interface admin CRUD articles
10. Page auteur
11. Breadcrumb
12. Articles recommandés (même rubrique)
13. Compteur de vues
14. Temps de lecture
15. Badges article

### ❌ Hors Scope
- Paywall / abonnement payant
- Commentaires
- Live/Direct temps réel (WebSocket)
- Notifications push
- Applications mobiles natives
- Système de modération
