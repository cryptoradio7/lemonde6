# SPECS FONCTIONNELLES — lemonde6

Site d'information grand public inspiré de www.lemonde.fr
Version MVP — Production
Référence : [REVERSE_ENGINEERING.md](./REVERSE_ENGINEERING.md)

---

## Stories MVP

### Story #1 — Page d'accueil : Hero + grilles d'articles

**En tant que** visiteur anonyme
**Je veux** voir une page d'accueil avec les articles les plus récents et mis en avant
**Pour** trouver rapidement l'information du moment

**Critères d'acceptation :**
- [ ] L'article `featured=true` le plus récent est affiché en hero (grande image, titre, chapeau, auteur, date)
- [ ] 3-4 articles récents s'affichent en sidebar à droite du hero
- [ ] Une grille 4 colonnes affiche les 8 articles les plus récents sous le hero
- [ ] Des sections par rubrique affichent 4 articles chacune (Politique, International, Économie, etc.)
- [ ] Les badges (ANALYSE, REPORTAGE, ENQUÊTE) s'affichent sur les cartes
- [ ] La page est responsive (4 col desktop → 2 col tablette → 1 col mobile)
- [ ] La page se charge en SSR (HTML rendu côté serveur pour SEO)

**Edge cases :**
- Si aucun article `featured` → afficher le plus récent en hero
- Si moins de 4 articles dans une rubrique → afficher ce qui existe sans erreur
- Si aucun article → page vide avec message "Aucun article disponible"

**Complexité :** L
**Dépendances :** Aucune (DB seed obligatoire)

---

### Story #2 — Page détail article

**En tant que** lecteur
**Je veux** lire un article complet avec tous ses détails
**Pour** m'informer sur un sujet en profondeur

**Critères d'acceptation :**
- [ ] La page affiche : titre, chapeau (excerpt), auteur (lien vers sa page), date, badge rubrique
- [ ] L'image principale s'affiche pleine largeur avec légende et crédit photographe
- [ ] Le contenu complet est rendu en HTML (paragraphes, intertitres, citations, images)
- [ ] Le fil d'ariane s'affiche : Accueil > Rubrique > Titre article
- [ ] Le temps de lecture est calculé et affiché ("5 min de lecture")
- [ ] Le compteur de vues est incrémenté à chaque visite
- [ ] Les boutons de partage social s'affichent (Facebook, Twitter/X, WhatsApp, LinkedIn, copier lien)
- [ ] 3 articles de la même rubrique s'affichent en "Articles recommandés" en bas
- [ ] Les balises meta SEO sont présentes (title, description, og:image, og:title, etc.)
- [ ] La page est rendue en SSR

**Edge cases :**
- Si l'article n'existe pas → redirection 404 avec page d'erreur stylée
- Si `status=draft` → 404 pour les non-admins
- Si pas d'image principale → placeholder ou layout sans image

**Complexité :** M
**Dépendances :** Story #1

---

### Story #3 — Navigation par catégorie/rubrique

**En tant que** lecteur
**Je veux** filtrer les articles par rubrique (Politique, International, Économie, etc.)
**Pour** lire uniquement les sujets qui m'intéressent

**Critères d'acceptation :**
- [ ] La navigation principale liste toutes les rubriques actives horizontalement
- [ ] Cliquer sur une rubrique ouvre la page `/categories/[slug]`
- [ ] La page rubrique affiche le nom, description et tous les articles de cette rubrique
- [ ] Les articles sont paginés (20 par page, bouton "Voir plus" ou pagination)
- [ ] L'article le plus récent s'affiche en format héro (grande image)
- [ ] Les rubriques sont disponibles dans le footer

**Edge cases :**
- Si la rubrique n'existe pas → 404
- Si la rubrique n'a aucun article → message "Aucun article dans cette rubrique"

**Complexité :** M
**Dépendances :** Story #1

---

### Story #4 — Recherche full-text

**En tant que** lecteur
**Je veux** rechercher des articles par mots-clés
**Pour** trouver des informations sur un sujet précis

**Critères d'acceptation :**
- [ ] Une barre de recherche est accessible depuis le header (icône loupe)
- [ ] La recherche porte sur les titres ET les contenus des articles
- [ ] Les résultats s'affichent sur `/search?q=terme`
- [ ] Le nombre de résultats est affiché ("1 243 résultats pour 'ukraine'")
- [ ] Chaque résultat affiche : titre, excerpt (avec terme surligné si possible), rubrique, date
- [ ] Les résultats sont triés par pertinence/date
- [ ] Si aucun résultat → message "Aucun article trouvé pour [terme]"
- [ ] La recherche fonctionne avec au moins 2 caractères

**Edge cases :**
- Recherche vide → focus sur le champ, pas de requête
- Caractères spéciaux dans la recherche → nettoyés/échappés
- Termes très courts (1 char) → message "Saisir au moins 2 caractères"

**Complexité :** M
**Dépendances :** Aucune

---

### Story #5 — Inscription utilisateur

**En tant que** visiteur anonyme
**Je veux** créer un compte avec mon email et un mot de passe
**Pour** accéder aux fonctionnalités réservées aux membres (commentaires futurs, newsletters personnalisées)

**Critères d'acceptation :**
- [ ] Formulaire d'inscription avec : prénom/nom, email, mot de passe, confirmation mot de passe
- [ ] Validation client et serveur : email valide, MDP min 8 chars, MDP identiques
- [ ] Le mot de passe est haché avec bcrypt avant stockage
- [ ] Email unique : erreur si email déjà utilisé
- [ ] Après inscription réussie → connexion automatique et redirection vers l'accueil
- [ ] Page accessible sur `/auth/register`

**Edge cases :**
- Email déjà utilisé → message "Cet email est déjà utilisé"
- MDP trop faible → message d'erreur détaillé
- Formulaire soumis plusieurs fois → désactiver le bouton pendant l'envoi

**Complexité :** M
**Dépendances :** Aucune

---

### Story #6 — Connexion / Déconnexion

**En tant que** utilisateur inscrit
**Je veux** me connecter et déconnecter de mon compte
**Pour** accéder aux fonctionnalités membres et sécuriser mon accès

**Critères d'acceptation :**
- [ ] Formulaire de connexion avec email + mot de passe sur `/auth/login`
- [ ] NextAuth.js gère la session JWT
- [ ] Après connexion → redirection vers la page précédente ou l'accueil
- [ ] Le header affiche le nom de l'utilisateur + avatar si connecté
- [ ] Bouton "Se déconnecter" visible dans le menu profil
- [ ] Session persistante 30 jours (remember me implicite)
- [ ] Pages admin protégées → redirection vers login si non connecté

**Edge cases :**
- Credentials incorrects → message "Email ou mot de passe incorrect" (sans préciser lequel)
- Compte inexistant → même message (pas d'énumération des comptes)
- Token JWT expiré → déconnexion silencieuse + redirection login

**Complexité :** M
**Dépendances :** Story #5

---

### Story #7 — Newsletter : abonnement et désabonnement (RGPD)

**En tant que** visiteur ou utilisateur
**Je veux** m'abonner à la newsletter et pouvoir me désabonner facilement
**Pour** recevoir les actualités par email tout en respectant mes droits RGPD

**Critères d'acceptation :**
- [ ] Formulaire email dans le footer (et optionnellement dans les articles)
- [ ] Validation email côté serveur
- [ ] Email de confirmation envoyé (double opt-in)
- [ ] Lien de désabonnement dans chaque email (token unique)
- [ ] `/api/newsletter/unsubscribe?token=xxx` → désabonnement confirmé avec page de confirmation
- [ ] Pas de double inscription possible (message "Vous êtes déjà abonné")
- [ ] Données RGPD : mention légale visible au moment de l'inscription

**Edge cases :**
- Token désabonnement invalide/expiré → message d'erreur explicatif
- Email invalide → erreur de validation immédiate
- Tentative de réinscription après désabonnement → réinscription autorisée

**Complexité :** M
**Dépendances :** Aucune (SMTP configuré)

---

### Story #8 — Partage réseaux sociaux

**En tant que** lecteur
**Je veux** partager un article sur mes réseaux sociaux en un clic
**Pour** diffuser des informations intéressantes à mes contacts

**Critères d'acceptation :**
- [ ] Boutons de partage sur la page article : Facebook, Twitter/X, WhatsApp, LinkedIn
- [ ] Bouton "Copier le lien" avec feedback visuel (tooltip "Copié !")
- [ ] URLs de partage incluent le titre et l'URL de l'article dans les paramètres
- [ ] Les boutons s'ouvrent dans une nouvelle fenêtre/onglet (target="_blank")
- [ ] Sur mobile, l'API Web Share native est utilisée si disponible
- [ ] Les balises Open Graph sont présentes pour que le partage génère une carte visuelle

**Edge cases :**
- API Web Share non supportée → fallback vers les boutons classiques
- Titre très long → tronqué à 100 chars dans l'URL de partage Twitter

**Complexité :** S
**Dépendances :** Story #2

---

### Story #9 — SEO : meta tags, Open Graph, sitemap, robots

**En tant que** équipe editoriale
**Je veux** que le site soit parfaitement indexé par Google et partageable
**Pour** maximiser la visibilité des articles en ligne

**Critères d'acceptation :**
- [ ] Chaque page article a des balises `<title>` et `<meta description>` uniques
- [ ] Balises Open Graph présentes : og:title, og:description, og:image, og:url, og:type
- [ ] Balises Twitter Card : twitter:card, twitter:title, twitter:image
- [ ] `sitemap.xml` généré automatiquement (next-sitemap) avec toutes les URLs d'articles
- [ ] `robots.txt` présent et correctement configuré
- [ ] Les URLs d'articles sont en format `/articles/[slug]` (human-readable)
- [ ] Toutes les pages utilisent SSR (HTML pré-rendu, pas SPA)
- [ ] Balise `<link rel="canonical">` présente sur chaque article

**Edge cases :**
- Article sans image → og:image utilise une image par défaut du site
- Slug dupliqué → interdiction à la création, slugify automatique

**Complexité :** S
**Dépendances :** Story #2

---

### Story #10 — Interface admin : CRUD articles

**En tant que** administrateur
**Je veux** créer, modifier, publier et supprimer des articles
**Pour** gérer le contenu éditorial du site

**Critères d'acceptation :**
- [ ] Section admin accessible sur `/admin` (rôle "admin" requis)
- [ ] Liste des articles avec colonnes : titre, rubrique, auteur, statut, date, actions
- [ ] Formulaire de création/modification : titre, slug (auto), excerpt, contenu (textarea riche), image URL, rubrique, auteur, tags, statut, featured
- [ ] Champ `status` avec valeurs : draft, published, archived
- [ ] Checkbox `featured` pour mettre en UNE
- [ ] Suppression avec confirmation ("Êtes-vous sûr ?")
- [ ] Le slug est généré automatiquement depuis le titre mais éditable
- [ ] Dashboard admin affiche : nb articles publiés, nb brouillons, nb utilisateurs, nb abonnés newsletter

**Edge cases :**
- Slug en double → erreur explicite, proposer une alternative
- Contenu vide → validation côté serveur
- Tentative d'accès admin sans droits → 403

**Complexité :** L
**Dépendances :** Story #6

---

### Story #11 — Interface admin : gestion catégories

**En tant que** administrateur
**Je veux** créer et gérer les rubriques/catégories
**Pour** organiser le contenu éditorial

**Critères d'acceptation :**
- [ ] Liste des catégories avec : nom, slug, couleur, nb articles
- [ ] Formulaire création/modification : nom, slug (auto), description, couleur (color picker)
- [ ] Suppression d'une catégorie vide (avec confirmation)
- [ ] Impossible de supprimer une catégorie ayant des articles (message d'erreur)
- [ ] L'ordre des catégories dans la nav peut être réorganisé (drag ou ordre manuel)

**Edge cases :**
- Nom de catégorie déjà utilisé → erreur de validation
- Catégorie avec articles → suppression bloquée avec message explicatif

**Complexité :** M
**Dépendances :** Story #10

---

### Story #12 — Page auteur

**En tant que** lecteur
**Je veux** voir la page d'un auteur avec sa biographie et ses articles
**Pour** suivre les journalistes qui m'intéressent

**Critères d'acceptation :**
- [ ] Page accessible sur `/auteurs/[slug]`
- [ ] Affiche : photo, nom, bio, email (optionnel)
- [ ] Liste de tous les articles publiés par cet auteur
- [ ] Articles paginés (10 par page)
- [ ] Le nom de l'auteur sur les cartes et pages articles est un lien vers sa page

**Edge cases :**
- Auteur sans photo → avatar par défaut (initiales)
- Auteur sans articles publiés → message "Pas encore d'articles publiés"

**Complexité :** S
**Dépendances :** Story #2

---

### Story #13 — Articles "Les plus lus"

**En tant que** lecteur
**Je veux** voir les articles les plus populaires
**Pour** découvrir le contenu le plus lu du moment

**Critères d'acceptation :**
- [ ] Section "Les plus lus" visible sur la page d'accueil et en sidebar des pages articles
- [ ] Affiche les 5 articles avec le plus de vues sur les 7 derniers jours
- [ ] Format liste numérotée (1, 2, 3, 4, 5) avec titre et vues
- [ ] Mise à jour du compteur à chaque visite d'article

**Edge cases :**
- Moins de 5 articles avec vues → afficher ce qui existe

**Complexité :** S
**Dépendances :** Story #2

---

### Story #14 — Seed des données de démonstration

**En tant que** développeur / testeur
**Je veux** une base de données pré-remplie avec des données réalistes
**Pour** tester toutes les fonctionnalités sans créer les données manuellement

**Critères d'acceptation :**
- [ ] Script `prisma/seed.ts` qui crée : 8 catégories, 10 auteurs, 30+ articles publiés, 3 articles featured, des tags variés, un compte admin (admin@lemonde6.fr / admin123)
- [ ] Les articles ont des dates variées (récents et anciens)
- [ ] Les articles couvrent toutes les rubriques
- [ ] Badges variés parmi les articles (analyse, reportage, enquête, normal)
- [ ] `npm run seed` exécute le script sans erreur

**Edge cases :**
- Seed lancé 2 fois → upsert (pas de doublons)

**Complexité :** M
**Dépendances :** Aucune

---

## Récapitulatif

| # | Story | Complexité | Priorité |
|---|-------|------------|---------|
| 1 | Page d'accueil | L | MVP P1 |
| 2 | Page détail article | M | MVP P1 |
| 3 | Navigation catégorie | M | MVP P1 |
| 4 | Recherche full-text | M | MVP P1 |
| 5 | Inscription | M | MVP P1 |
| 6 | Connexion/déconnexion | M | MVP P1 |
| 7 | Newsletter RGPD | M | MVP P2 |
| 8 | Partage social | S | MVP P2 |
| 9 | SEO complet | S | MVP P1 |
| 10 | Admin CRUD articles | L | MVP P2 |
| 11 | Admin catégories | M | MVP P2 |
| 12 | Page auteur | S | MVP P2 |
| 13 | Articles les plus lus | S | MVP P3 |
| 14 | Seed données démo | M | MVP P1 |

**Total : 14 stories | 5S + 7M + 2L**
