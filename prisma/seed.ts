import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.articleTag.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.author.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleaned existing data');

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Politique',
        slug: 'politique',
        description: 'Actualite politique francaise et internationale',
        color: '#003f8a',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Economie',
        slug: 'economie',
        description: 'Marches financiers, entreprises et conjoncture',
        color: '#1a7a3c',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Culture',
        slug: 'culture',
        description: 'Cinema, litterature, art et spectacles',
        color: '#8b1a1a',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Science',
        slug: 'science',
        description: 'Decouverte scientifiques, sante et technologie',
        color: '#1a5fa0',
      },
    }),
    prisma.category.create({
      data: {
        name: 'International',
        slug: 'international',
        description: 'Geopolitique, conflits et diplomatie mondiale',
        color: '#7a3c1a',
      },
    }),
  ]);

  console.log(`Created ${categories.length} categories`);

  const [politique, economie, culture, science, international] = categories;

  // Create authors
  const authors = await Promise.all([
    prisma.author.create({
      data: {
        name: 'Marie Dupont',
        bio: 'Journaliste politique au Monde6 depuis 2015. Specialiste des institutions europeennes.',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
    }),
    prisma.author.create({
      data: {
        name: 'Jean-Pierre Laurent',
        bio: "Correspondant international, expert en geopolitique et conflits. Ancien correspondant en zone de guerre.",
        avatar: 'https://i.pravatar.cc/150?img=3',
      },
    }),
    prisma.author.create({
      data: {
        name: 'Sophie Moreau',
        bio: 'Redactrice en chef adjointe, specialiste economie et finance. Auteure de plusieurs ouvrages sur la mondialisation.',
        avatar: 'https://i.pravatar.cc/150?img=5',
      },
    }),
  ]);

  console.log(`Created ${authors.length} authors`);

  const [marie, jeanpierre, sophie] = authors;

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'Gouvernement', slug: 'gouvernement' } }),
    prisma.tag.create({ data: { name: 'Europe', slug: 'europe' } }),
    prisma.tag.create({ data: { name: 'Inflation', slug: 'inflation' } }),
    prisma.tag.create({ data: { name: 'Ukraine', slug: 'ukraine' } }),
    prisma.tag.create({ data: { name: 'Intelligence artificielle', slug: 'intelligence-artificielle' } }),
    prisma.tag.create({ data: { name: 'Climat', slug: 'climat' } }),
    prisma.tag.create({ data: { name: 'Sante', slug: 'sante' } }),
    prisma.tag.create({ data: { name: 'Technologie', slug: 'technologie' } }),
  ]);

  console.log(`Created ${tags.length} tags`);

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  await prisma.user.create({
    data: {
      email: 'admin@lemonde6.fr',
      name: 'Administrateur',
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log('Created admin user');

  // Articles data
  const articlesData = [
    // === POLITIQUE ===
    {
      title: "Remaniement ministeriel : le Premier ministre annonce une refonte du gouvernement",
      slug: "remaniement-ministeriel-premier-ministre-annonce-refonte-gouvernement",
      excerpt: "Apres plusieurs semaines de speculations, le Premier ministre a officialise ce lundi un remaniement de grande ampleur touchant sept ministeres cles.",
      content: `Le Premier ministre a convoque une conference de presse exceptionnelle ce lundi matin pour annoncer un remaniement ministeriel d'envergure. Sept portefeuilles sont concernes par cette reorganisation qui vise, selon l'executif, a "redonner de l'elan a l'action gouvernementale".

Les changements les plus notables concernent les ministeres de l'Economie, de l'Education nationale et des Affaires etrangeres. Cette refonte intervient dans un contexte de tensions au sein de la majorite et de sondages defavorables au gouvernement.

L'opposition a immediatement reagit, qualifiant ce remaniement de "replâtrage" sans vision. Le leader du principal parti d'opposition a declare que "ces changements de personnel ne sauraient masquer l'absence de cap politique".

Les nouveaux ministres nommes devront faire face a un agenda charge : budget de l'Etat, reforme des retraites et negociations europeennes sont au programme des prochaines semaines.`,
      imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      featured: true,
      authorId: marie.id,
      categoryId: politique.id,
      tagIds: [tags[0].id, tags[1].id],
    },
    {
      title: "Elections municipales : la gauche en tete dans les grandes villes selon les premiers sondages",
      slug: "elections-municipales-gauche-en-tete-grandes-villes-premiers-sondages",
      excerpt: "A six mois des elections municipales, les instituts de sondage placent les listes de gauche en position favorable dans la plupart des grandes agglomerations francaises.",
      content: `Les premiers sondages a grande echelle realises en vue des elections municipales du printemps prochain dessinent un paysage politique contrastant avec les scrutins precedents. La gauche rassemblee apparait en tete dans huit des dix plus grandes villes du pays.

Cette dynamique s'explique en partie par la mobilisation autour des enjeux climatiques et sociaux qui cristallisent les preoccupations des electeurs urbains. Les candidats de gauche ont fait de la transition ecologique et des services publics leurs chevaux de bataille.

A droite, les etats-majors s'inquietent de cette tendance et multiplient les reunions de strategie. Plusieurs figures moderees appellent a un elargissement de l'alliance electorale, tandis que l'aile conservatrice plaide pour un retour aux fondamentaux.

Il reste cependant plusieurs mois avant le scrutin, et les campagnes sont loin d'etre terminées. Les analystes rappellent que les dynamiques peuvent evoluer rapidement, notamment en fonction des decisions prises au niveau national.`,
      imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800',
      featured: false,
      authorId: marie.id,
      categoryId: politique.id,
      tagIds: [tags[0].id],
    },
    {
      title: "Reforme constitutionnelle : le debat relance au Parlement",
      slug: "reforme-constitutionnelle-debat-relance-parlement",
      excerpt: "Le gouvernement relance les discussions sur une revision de la Constitution, notamment concernant le droit de vote a 16 ans et la prise en compte de l'environnement.",
      content: `Apres plusieurs mois de silence politique, le debat sur une eventuelle revision constitutionnelle a ete officiellement relance ce mardi a l'Assemblee nationale. Le ministre charge des Relations avec le Parlement a presente les grandes lignes d'un projet qui pourrait modifier plusieurs articles fondamentaux de la Loi fondamentale.

Parmi les points les plus debattus figurent l'abaissement de l'age du droit de vote a 16 ans, soutenu par une coalition de partis de gauche et du centre, ainsi que l'inscription explicite de la protection de l'environnement comme obligation constitutionnelle.

Les opposants a ces reformes, notamment au sein de la droite traditionnelle, estiment que modifier la Constitution sur ces sujets serait prematurer et risquerait de creeer des contentieux juridiques. "La Constitution n'est pas un programme politique", a declare l'un des chefs de file conservateurs.

Le processus est long : une revision constitutionnelle necessite soit un referendum, soit un vote du Congres a la majorite des trois cinquiemes. Les negociations s'annoncent difficiles.`,
      imageUrl: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=800',
      featured: false,
      authorId: marie.id,
      categoryId: politique.id,
      tagIds: [tags[0].id, tags[1].id],
    },
    {
      title: "Reforme des retraites : manifestation nationale, des dizaines de milliers dans les rues",
      slug: "reforme-retraites-manifestation-nationale-dizaines-milliers-rues",
      excerpt: "Des dizaines de milliers de personnes ont desfilee dans toute la France pour protester contre le projet de reforme des retraites. Les syndicats annoncent une prochaine journee d'action.",
      content: `Les principales villes de France ont ete le theatre ce jeudi de manifestations contre le projet de reforme des retraites porté par le gouvernement. Selon les syndicats, plus de 200 000 personnes ont marche, tandis que les autorites de police font état de 85 000 manifestants a l'echelle nationale.

A Paris, le cortege a relie la place de la Republique a celle de la Nation, sous haute surveillance policiere. Des incidents mineurs ont ete signales en fin de parcours, avec quelques vitrines brisees par un groupe de casseurs qui se sont infiltres dans le defile.

La reforme envisagee repousse l'age legal de depart a la retraite et modifie les regles de calcul des pensions. Le gouvernement affirme que ces mesures sont "indispensables" pour assurer la viabilite financiere du systeme sur le long terme.

Les leaders syndicaux ont ete univoques : "Nous ne laissons pas passer cette reforme injuste. Nous appelons a une nouvelle journee de mobilisation dans quinze jours si le gouvernement ne retire pas son projet."`,
      imageUrl: 'https://images.unsplash.com/photo-1569683795645-b62e50fbf103?w=800',
      featured: true,
      authorId: marie.id,
      categoryId: politique.id,
      tagIds: [tags[0].id],
    },
    {
      title: "Departementales : abstention record, les presidents sortants reconduits en majorite",
      slug: "departementales-abstention-record-presidents-sortants-reconduits",
      excerpt: "Le taux d'abstention a atteint 65% lors des elections departementales, un record historique. Les sortants ont ete largement reconduits dans leurs fonctions.",
      content: `Les elections departementales qui se sont tenues ce week-end ont confirme une tendance lourde de la politique francaise : la desaffection croissante des citoyens pour les scrutins locaux. Le taux d'abstention a atteint 65,3%, un niveau jamais observe pour ce type d'election.

Dans ce contexte de faible participation, les presidents sortants ont largement beneficie de leur notoriete locale et de leurs reseaux. Sur les 101 departements metropolitains et d'outre-mer, 87 ont reconduit leur president sortant.

Les politologues s'interrogent sur les causes de cette abstention massive. "Les citoyens ne comprennent pas bien le role des departements, qui ont vu leurs competences se chevaucher avec les regions et les communautes de communes", explique un chercheur specialise en comportement electoral.

La question du millefeuille territorial et de la simplification institutionnelle est relancee. Plusieurs voix s'elevent pour proposer une fusion departements-regions ou une refonte radicale de l'organisation territoriale.`,
      imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800',
      featured: false,
      authorId: marie.id,
      categoryId: politique.id,
      tagIds: [tags[0].id],
    },
    {
      title: "Pacte vert europeen : la France sous pression de Bruxelles sur ses objectifs climatiques",
      slug: "pacte-vert-europeen-france-sous-pression-bruxelles-objectifs-climatiques",
      excerpt: "La Commission europeenne a adresse un avertissement formal a Paris concernant ses engagements de reduction des emissions de gaz a effet de serre. La France risque des sanctions.",
      content: `La Commission europeenne a officiellement mis en demeure la France de respecter ses engagements climatiques dans le cadre du Pacte vert europeen. Paris dispose de six mois pour presenter un plan credible de reduction de ses emissions de gaz a effet de serre, sous peine de sanctions financieres pouvant atteindre plusieurs milliards d'euros.

Le document transmis par Bruxelles pointe du doigt les retards pris dans plusieurs secteurs : transports, agriculture intensive et renovation energetique des batiments. Selon les chiffres de la Commission, la France affiche un retard de 12% par rapport a sa trajectoire cible pour 2030.

Le gouvernement a reagit en promettant des mesures "ambitieuses mais pragmatiques". Le ministre de la Transition ecologique a annonce un plan d'action qui sera presente devant le Parlement dans les prochaines semaines.

Les associations environnementales, de leur cote, estiment que cette mise en demeure aurait pu etre evitee. "Cela fait des annees que nous alertons sur l'insuffisance des politiques climatiques francaises", declare le president d'une grande ONG ecologiste.`,
      imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
      featured: false,
      authorId: marie.id,
      categoryId: politique.id,
      tagIds: [tags[1].id, tags[5].id],
    },

    // === ECONOMIE ===
    {
      title: "Inflation : les prix a la consommation en legere baisse, premier signal encourageant",
      slug: "inflation-prix-consommation-legere-baisse-premier-signal-encourageant",
      excerpt: "L'INSEE a publie ses chiffres mensuels de l'inflation. La hausse des prix ralentit pour le troisieme mois consecutif, s'etablissant a 3,2% sur un an.",
      content: `L'Institut national de la statistique et des etudes economiques (INSEE) a publie ce matin ses chiffres d'inflation pour le mois ecoule. Le taux d'inflation s'etablit a 3,2% sur un an, en retrait par rapport aux 3,8% enregistres le mois precedent. C'est le troisieme mois consecutif de baisse, un signal que les economistes qualifient d'"encourageant mais insuffisant".

Les produits alimentaires restent en tete des hausses de prix avec +4,1% sur un an, mais ce chiffre est en nette amelioration par rapport au pic de +8,9% observe il y a dix-huit mois. L'energie, quant a elle, affiche desormais une quasi-stabilite apres deux annees de forte volatilite.

"La desinflation est reelle, mais nous ne sommes pas encore revenus a un regime de prix normal", commente l'economiste en chef d'une grande banque francaise. "Les menages les plus modestes continuent de souffrir de l'erosion de leur pouvoir d'achat."

La Banque de France a maintenu ses projections pour la fin de l'annee, anticipant un retour sous la barre des 2% d'ici la mi-annee prochaine. Cette perspective a contribue a detendre les marches obligataires ce matin.`,
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
      featured: true,
      authorId: sophie.id,
      categoryId: economie.id,
      tagIds: [tags[2].id],
    },
    {
      title: "CAC 40 : l'indice parisien franchit un nouveau record historique",
      slug: "cac-40-indice-parisien-franchit-nouveau-record-historique",
      excerpt: "La Bourse de Paris a atteint un niveau historique ce jeudi, portee par les bons resultats des grandes entreprises du luxe et la perspective d'une baisse des taux.",
      content: `La Bourse de Paris a inscrit un nouveau record historique ce jeudi en seance, avec le CAC 40 qui a franchi la barre symbolique dans des volumes d'echanges eleves. L'indice phare de la place parisienne a cloture en hausse de 1,8%, son plus haut niveau depuis sa creation.

Cette progression est portee par plusieurs facteurs convergents : des resultats trimestriels meilleurs que prevu dans le secteur du luxe, une perspective de baisse des taux directeurs par la Banque centrale europeenne et un signal positif venu des marches americains.

LVMH, Hermes et Kering ont particulierement contribue a cette hausse, avec des gains compris entre 3 et 5%. Le secteur bancaire a egalement ete bien oriente, profitant d'anticipations de marges plus elevees.

Les strategistes de marche mettent cependant en garde contre un exces d'optimisme. "Les valorisations sont tendues dans certains secteurs, et les risques geopolitiques et macroeconomiques restent eleves", note un analyste de grande banque d'investissement. "Il faut rester prudent."`,
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
      featured: false,
      authorId: sophie.id,
      categoryId: economie.id,
      tagIds: [tags[2].id],
    },
    {
      title: "Taux de chomage : la France atteint son niveau le plus bas depuis vingt ans",
      slug: "taux-chomage-france-atteint-niveau-plus-bas-depuis-vingt-ans",
      excerpt: "Le taux de chomage en France est tombe a 6,8% au dernier trimestre, son niveau le plus bas depuis 2004. Une evolution saluee par le gouvernement, meme si des disparites persistent.",
      content: `Les chiffres du chomage publies ce matin par la DARES (Direction de l'animation de la recherche, des etudes et des statistiques) confirment une tendance de fond : le taux de chomage en France metropolitaine a atteint 6,8% de la population active au cours du dernier trimestre, son niveau le plus bas depuis l'annee 2004.

Le gouvernement a immediatement salue ces "excellents resultats", y voyant la confirmation de l'efficacite de ses politiques d'emploi, notamment la reforme de l'apprentissage et les incitations a l'embauche dans les secteurs en tension.

Cependant, les economistes invitent a nuancer ce tableau globalement positif. Les inegalites territoriales restent marquees : certains departements du nord et du sud-ouest affichent des taux superieurs a 10%, tandis que d'autres regions sont en situation de quasi-plein emploi. De plus, le sous-emploi et le chomage de longue duree demeurent des preoccupations majeures.

Les syndicats de leur cote pointent la qualite des emplois crees. "Avoir un emploi ne signifie pas avoir un bon emploi. La progression des contrats precaires et des temps partiels subi masque une realite moins brillante", declare un responsable syndical.`,
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
      featured: false,
      authorId: sophie.id,
      categoryId: economie.id,
      tagIds: [],
    },
    {
      title: "Energie : la facture d'electricite des menages va augmenter de 8% en fevrier",
      slug: "energie-facture-electricite-menages-va-augmenter-8-fevrier",
      excerpt: "La Commission de regulation de l'energie a annonce une hausse de 8% du tarif reglemente de vente de l'electricite a partir du 1er fevrier. Une mauvaise nouvelle pour les menages.",
      content: `La Commission de regulation de l'energie (CRE) a annonce ce vendredi que le tarif reglemente de vente (TRV) de l'electricite augmentera de 8,1% le 1er fevrier prochain. Cette hausse, qui concerne quelque 23 millions de foyers, se traduira par une augmentation moyenne de 16 euros par mois sur la facture des menages.

Cette hausse s'explique principalement par la fin progressive du bouclier tarifaire mis en place pendant la crise energetique et par l'evolution des couts d'approvisionnement. EDF, principal producteur, a egalement vu ses couts de maintenance des centrales nucleaires augmenter significativement.

Les associations de consommateurs ont immediatement denonce cette hausse, rappelant que les menages souffrent deja d'un pouvoir d'achat fragilise. "Cette augmentation va toucher de plein fouet les foyers modestes et les personnes agees qui se chauffent a l'electricite", declare la presidente d'une grande association de defense des consommateurs.

Des aides sont prevues pour les menages les plus vulnerables, notamment via le cheque energie qui sera revalorise. Mais pour beaucoup de menages de classe moyenne, aucune compensation n'est prevue.`,
      imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800',
      featured: false,
      authorId: sophie.id,
      categoryId: economie.id,
      tagIds: [tags[2].id, tags[5].id],
    },
    {
      title: "Amazon ouvre son plus grand centre de distribution en France, creant 1 500 emplois",
      slug: "amazon-ouvre-plus-grand-centre-distribution-france-creant-1500-emplois",
      excerpt: "Le geant americain du e-commerce a inaugure un nouveau mega-centre logistique en Ile-de-France. Cette implantation cree 1 500 emplois directs mais suscite des controverses.",
      content: `Amazon a inaugure ce mardi son plus grand centre de distribution en France, un batiment de 185 000 metres carres situe en grande couronne parisienne. L'installation, dotee de la derniere generation de robots logistiques, emploiera 1 500 personnes directement, avec 500 embauches supplementaires prevues d'ici deux ans.

La ceremony a ete presidee par un secretaire d'Etat charge du numerique, qui a salue "un investissement majeur pour l'emploi local" dans une zone qui connait un chomage superieur a la moyenne nationale.

Mais l'implantation ne fait pas l'unanimite. Des organisations syndicales et des associations de commercants locaux ont manifeste a l'entree du site, denoncant les conditions de travail au sein des entrepots Amazon et l'impact sur le petit commerce de proximite. Des elus locaux de gauche ont egalement proteste contre les exonerations fiscales accordees a l'entreprise.

Amazon, de son cote, met en avant ses salaires "au-dessus du SMIC", ses formations internes et ses engagements en matiere de neutralite carbone. "Nous sommes un employeur responsable et nous avons un impact positif sur les economies locales", a declare la directrice des operations France.`,
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
      featured: false,
      authorId: sophie.id,
      categoryId: economie.id,
      tagIds: [tags[7].id],
    },
    {
      title: "Budget 2025 : le Parlement adopte un plan d'economies de 30 milliards d'euros",
      slug: "budget-2025-parlement-adopte-plan-economies-30-milliards",
      excerpt: "Apres des semaines de negociations tendues, le budget de l'Etat pour 2025 a ete adopte par l'Assemblee nationale. Il prevoit un effort d'economies sans precedent pour reduire le deficit.",
      content: `L'Assemblee nationale a adopte ce soir en session extraordinaire le budget de l'Etat pour l'annee 2025. Le texte, qui prevoit 30 milliards d'euros d'economies par rapport a la trajectoire precedente, a ete adopte par 289 voix contre 261, avec le soutien d'une majorite de circonstance.

Ce budget est le plus contraignant depuis la crise de 2010. Il prevoit notamment un gel partiel des aides sociales, une reduction des effectifs dans plusieurs ministeres non-prioritaires et une hausse ciblée de certains impots sur les hauts revenus et les grandes entreprises.

Le ministre des Finances a presente ce vote comme "un acte de responsabilite budgetaire indispensable" pour ramener le deficit public sous la barre des 3% du PIB, exigee par les regles europeennes. "Nos partenaires europeens nous observent. La credibilite de la France est en jeu", a-t-il declare.

Les oppositions de gauche ont denonce "un budget d'austerite qui sacrifie les services publics et les plus fragiles". Celles de droite ont critique l'augmentation des impots qu'elles jugent "contre-productive". La prochaine etape est l'examen par le Senat.`,
      imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
      featured: false,
      authorId: sophie.id,
      categoryId: economie.id,
      tagIds: [],
    },
    {
      title: "Immobilier : le marche repart apres dix-huit mois de crise",
      slug: "immobilier-marche-repart-apres-dix-huit-mois-crise",
      excerpt: "Les transactions immobilieres ont augmente de 12% au dernier trimestre, apres une longue periode de repli. La baisse des taux d'interet et le retour des acheteurs donnent des signes de rebond.",
      content: `Apres dix-huit mois difficiles marques par la hausse des taux d'interet et le recul des prix dans de nombreuses regions, le marche immobilier francais semble amorcer un rebond. Les chiffres publies par la Chambre des notaires de France font etat d'une hausse de 12% des transactions au cours du dernier trimestre, par rapport a la meme periode l'an passe.

Cette amelioration s'explique principalement par le recul des taux d'emprunt immobilier, qui sont passes d'un pic de 4,5% a environ 3,2% pour les credits sur vingt ans. Des taux toujours historiquement eleves par rapport aux annees 2010-2020, mais qui permettent a nouveau a certains menages d'acquerir.

A Paris, les prix ont recule d'environ 8% depuis leur pic, revenant sous la barre des 10 000 euros le metre carre en moyenne. En regions, les disparites sont importantes : les grandes metropoles regionales se stabilisent, tandis que certaines zones rurales continuent de subir une decote.

"Nous ne sommes pas encore revenus a un marche normal, mais la direction est bonne", estime un directeur d'une grande federation immobiliere. Les experts anticipent une poursuite progressive de la reprise en 2025.`,
      imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
      featured: false,
      authorId: sophie.id,
      categoryId: economie.id,
      tagIds: [],
    },

    // === CULTURE ===
    {
      title: "Festival de Cannes : la Palme d'or remise a un film francais pour la premiere fois depuis dix ans",
      slug: "festival-cannes-palme-or-remise-film-francais-premiere-fois-depuis-dix-ans",
      excerpt: "Le film 'Les Invisibles' du realisateur Antoine Garnier a remporte la Palme d'or au 77e Festival de Cannes. Une oeuvre sur la migration et la fraternite qui a bouleverse le jury.",
      content: `Le 77e Festival international du film de Cannes a vecu l'une de ses editions les plus emotionnelles. La Palme d'or a ete decernee a "Les Invisibles", le quatrieme long-metrage du realisateur francais Antoine Garnier, un film sur la migration clandestine et la solidarite humaine qui a provoque plusieurs ovations debout au Palais des festivals.

C'est la premiere fois depuis une decennie qu'un film francais remporte la recompense supreme. La presidente du jury, une grande actrice internationale, a declare au moment de la remise du prix : "Ce film nous a tous bouleverses. Il montre l'humanite dans toute sa complexite, avec une tendresse et une violence qui coexistent magnifiquement."

Antoine Garnier, visiblement emu, a dedicace sa Palme "a tous ceux qui n'ont pas de voix, a tous ceux qui traversent la Mediterranee au peril de leur vie". Son discours de quelques minutes a ete largement applaudi par le public et les professionnels du cinema.

Le film, tourne en partie avec des acteurs non professionnels issus de l'immigration, sortira en France dans six salles avant d'etre distribue nationalement. Des adaptations sont deja prevues pour une diffusion internationale.`,
      imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800',
      featured: true,
      authorId: jeanpierre.id,
      categoryId: culture.id,
      tagIds: [],
    },
    {
      title: "Le Louvre annonce sa plus grande exposition temporaire, consacree a la Renaissance italienne",
      slug: "louvre-annonce-plus-grande-exposition-temporaire-renaissance-italienne",
      excerpt: "Le musee du Louvre presentera du 15 mars au 15 juillet une exposition exceptionnelle reunissant plus de 200 oeuvres de la Renaissance italienne pretees par les plus grands musees du monde.",
      content: `Le musee du Louvre a devoile ce mardi les details de ce qui sera la plus grande exposition temporaire de son histoire. "Renaissance : l'eclosion du monde moderne" reunira du 15 mars au 15 juillet 214 oeuvres majeures de la Renaissance italienne, dont plusieurs n'ont jamais quitte leurs etablissements d'origine.

Parmi les pieces les plus attendues figurent plusieurs tableaux de Raphael prets par les Musees du Vatican, une serie exceptionnelle de dessins de Leonard de Vinci conserves habituellement a la Bibliotheque royale de Windsor et des sculptures de Michel-Ange issues du musee national de Florence.

"C'est le fruit de dix ans de negociations diplomatiques et de partenariats entre institutions", a explique la presidente du musee lors de la conference de presse. La mise en scene a ete confiee a un scenographe de renommee internationale qui promet un "voyage immersif" dans le Florence du XVe siecle.

Face a l'afflux attendu de visiteurs, le Louvre mettra en place une billetterie entierement numerique avec des creneaux horaires limites. La reservation sera obligatoire. Des nocturnes supplementaires sont prevues le vendredi et le samedi soir.`,
      imageUrl: 'https://images.unsplash.com/photo-1499678329028-101435549a4e?w=800',
      featured: false,
      authorId: jeanpierre.id,
      categoryId: culture.id,
      tagIds: [],
    },
    {
      title: "Prix Goncourt : le roman 'La Derniere Saison' de Clara Voisin couronne",
      slug: "prix-goncourt-roman-derniere-saison-clara-voisin-couronne",
      excerpt: "L'Academie Goncourt a attribue son prix a Clara Voisin pour son roman sur la memoire et l'identite. Une oeuvre saluee comme l'une des grandes decouvertes litteraires de l'annee.",
      content: `L'Academie Goncourt a attribue ce mardi son prix a Clara Voisin pour "La Derniere Saison", un roman de 380 pages publie aux editions Gallimard. Clara Voisin, 34 ans, est la plus jeune laureate du prix depuis plusieurs decennies.

"La Derniere Saison" raconte l'histoire d'une jeune femme qui revient dans la maison familiale bretonne apres le deces de sa grand-mere et decouvre dans les lettres et les journaux intimes des revelations sur l'histoire de sa famille pendant l'Occupation. Une plongee dans la memoire, l'identite et le poids du passe.

Le verdict a ete rendu apres un dernier vote parmi quatre finalistes. Le jury a salue "une ecriture d'une maturite etonnante, a la fois precise et poetique, qui sait traiter de sujets graves avec une legèrete toute en finesse".

Le roman, qui s'etait deja vendu a 45 000 exemplaires avant le verdict, va probablement franchir le cap du million de ventes dans les semaines a venir. Clara Voisin est en preparation d'un deuxieme roman.`,
      imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
      featured: false,
      authorId: jeanpierre.id,
      categoryId: culture.id,
      tagIds: [],
    },
    {
      title: "Notre-Dame de Paris : la cathedrale rouvre ses portes apres cinq ans de restauration",
      slug: "notre-dame-paris-cathedrale-rouvre-portes-apres-cinq-ans-restauration",
      excerpt: "Cinq ans apres l'incendie qui avait ravage sa fleche et une grande partie de son toit, Notre-Dame de Paris a rouvert ses portes au public. Une renaissance saluee dans le monde entier.",
      content: `Notre-Dame de Paris a vecu ce samedi une renaissance symbolique. Cinq ans, trois mois et quelques jours apres l'incendie devastateur qui avait choque la France et le monde entier, la cathedrale a rouvert ses portes, restauree, reinventee et plus belle que jamais selon ses visiteurs.

La ceremonie d'ouverture, presidee par les plus hautes autorites de l'Etat et en presence de dignitaires etrangers venus du monde entier, a ete suivie d'un premier office religieux. Des centaines de personnes avaient bivouaque la nuit precedente sur le parvis pour etre parmi les premiers a entrer.

Le chantier de restauration, qui a mobilise des milliers de compagnons, artisans et specialistes, a constitue un exploit technique et humain sans precedent. La nouvelle fleche, une reproduction fidele de celle de Viollet-le-Duc, domine a nouveau le ciel parisien.

Les grilles d'entree etaient decorees de milliers de dessins d'enfants venus de soixante-dix pays, un symbole de la dimension mondiale de cet edifce. "Notre-Dame n'appartient pas qu'aux Francais, elle appartient a l'humanite entiere", a declare l'archeveque de Paris lors de son homelie.`,
      imageUrl: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=800',
      featured: false,
      authorId: jeanpierre.id,
      categoryId: culture.id,
      tagIds: [],
    },
    {
      title: "Musique : l'artiste Aya Nakamura representera la France aux MTV Awards",
      slug: "musique-aya-nakamura-representera-france-mtv-awards",
      excerpt: "La chanteuse Aya Nakamura a ete selectionnee pour representer la scene musicale francaise aux MTV Europe Music Awards. Une consecration internationale pour l'artiste la plus streamee de France.",
      content: `La chanteuse franco-malienne Aya Nakamura a ete officiellement selectionnee pour representer la France a la prochaine edition des MTV Europe Music Awards qui se tiendra a Barcelone. C'est la premiere fois qu'une artiste de variete francophone est mise en avant par l'organisation americaine dans cette categorie.

Avec plus de 12 millions d'auditeurs mensuels sur Spotify et plusieurs tubes internationaux, Aya Nakamura est aujourd'hui l'artiste francophone la plus ecoutee dans le monde. Son dernier album a ete certifie double platine en France et s'est positionne dans les charts de nombreux pays africains, americains et europeens.

Cette nomination intervient dans un contexte de renouveau de la musique populaire francaise sur la scene internationale. Plusieurs artistes francais ont percé ces dernieres annees au niveau mondial, brisant partiellement la domination de l'anglais dans la pop culture.

"Je suis tellement fiere de ce moment. Je dedie cette reconnaissance a tous les artistes francophones qui se battent pour exister sur la scene internationale", a declare l'artiste dans un message video publie sur ses reseaux sociaux.`,
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
      featured: false,
      authorId: jeanpierre.id,
      categoryId: culture.id,
      tagIds: [],
    },
    {
      title: "Theatre : la Comedie-Francaise ouvre sa saison avec une mise en scene controversee de Moliere",
      slug: "theatre-comedie-francaise-ouvre-saison-mise-en-scene-controversee-moliere",
      excerpt: "La Comedie-Francaise ouvre sa nouvelle saison avec 'Le Misanthrope' dans une mise en scene contemporaine qui transpose l'action de Moliere dans le monde des reseaux sociaux.",
      content: `La Comedie-Francaise a choisi d'ouvrir sa saison avec une adaptation pour le moins audacieuse du "Misanthrope" de Moliere. Le metteur en scene Thibaut Peyre a transpose l'action dans le monde contemporain des reseaux sociaux et de la culture de l'annulation, suscitant a la fois l'enthousiasme et l'indignation.

Dans cette version, Alceste est un lanceur d'alerte sur Twitter, Celimene une influenceuse Instagram, et les scenes de salon se deroulent dans les couloirs d'une startup parisienne. Les alexandrins de Moliere sont preserves, ce qui cree un contraste saisissant avec les decors ultra-contemporains.

La presse est divisee. Une partie des critiques salue une mise en scene qui "donne une nouvelle jeunesse a un texte fondateur" et montre sa permanente actualite. D'autres estiment que cette transposition "trahit l'esprit du texte" et constitue un "exercice de style sans profondeur".

Le public, lui, est au rendez-vous : les representations jusqu'en janvier sont deja completes. La Comedie-Francaise a deja annonce une prolongation.`,
      imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
      featured: false,
      authorId: jeanpierre.id,
      categoryId: culture.id,
      tagIds: [],
    },

    // === SCIENCE ===
    {
      title: "Intelligence artificielle : un modele francais rivalise desormais avec les grandes IA americaines",
      slug: "intelligence-artificielle-modele-francais-rivalise-grandes-ia-americaines",
      excerpt: "Une startup francaise a presente un modele d'intelligence artificielle generative capable de rivaliser sur plusieurs benchmarks avec les grandes IA comme GPT-4 et Claude. Une percee historique.",
      content: `Une startup francaise, Lumina AI, a cree la surprise dans le milieu de l'intelligence artificielle en presentant un modele de langage de grande taille (LLM) capable de rivaliser avec les meilleurs modeles americains sur plusieurs benchmarks standardises. Un exploit qui redonne de l'espoir a la filiere IA europeenne.

Le modele, baptise "Helios-7B", a ete entraine sur un superordinateur finance en partie par l'Etat francais et des fonds europeens. Il se distingue notamment par ses capacites en francais et dans d'autres langues europeennes, domaine ou les modeles americains montrent souvent des lacunes.

"Nous prouvons que l'Europe peut jouer dans la cour des grands, pour peu qu'on lui en donne les moyens", a declare le cofondateur de Lumina AI lors d'une conference de presse a Paris. La startup, fondee par d'anciens chercheurs de l'INRIA et de l'Ecole Polytechnique, emploie 150 personnes.

La Commission europeenne a salue cette avancee, y voyant la confirmation de la pertinence de ses investissements dans la recherche en IA. Des discussions sont en cours pour etendre le partenariat a d'autres pays de l'Union.`,
      imageUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800',
      featured: true,
      authorId: sophie.id,
      categoryId: science.id,
      tagIds: [tags[4].id, tags[7].id],
    },
    {
      title: "Sante : une nouvelle therapie genique guerit des enfants atteints de leucemie",
      slug: "sante-nouvelle-therapie-genique-guerit-enfants-atteints-leucemie",
      excerpt: "Des chercheurs de l'hopital Necker ont annonce des resultats extraordinaires dans le traitement de leucemie aigue lymphoblastique chez l'enfant grace a une therapie genique innovante.",
      content: `Une equipe de chercheurs de l'hopital Necker-Enfants malades de Paris a publie dans la revue Nature Medicine des resultats qui bouleversent la prise en charge d'une forme de leucemie particulierement grave chez l'enfant. Sur un essai clinique portant sur 42 patients, 38 sont entres en remission complete apres un traitement unique par therapie genique.

Cette approche, appelee CAR-T allogeneique, consiste a modifier genetiquement des cellules immunitaires pour les rendre capables de reconnaître et de detruire les cellules cancereuses. La novateur ici est l'utilisation de cellules de donneurs, ce qui permet de traiter les patients en urgence sans attendre les semaines necessaires a la fabrication de cellules personnalisees.

Le professeur Stephane Blanchard, qui dirige l'equipe de recherche, a qualifie ces resultats de "saut quantique" dans le traitement des leucemies de l'enfant. "Pour la premiere fois, nous avons l'espoir de guerir des enfants qui n'avaient auparavant aucune option therapeutique", a-t-il declare.

L'Agence europeenne du medicament devrait examiner une demande d'autorisation de mise sur le marche d'ici la fin de l'annee. Le prix du traitement, qui pourrait atteindre plusieurs centaines de milliers d'euros, pose deja des questions sur son accessibilite.`,
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
      featured: false,
      authorId: sophie.id,
      categoryId: science.id,
      tagIds: [tags[6].id],
    },
    {
      title: "Espace : Ariane 6 reussit son premier lancement commercial avec succes",
      slug: "espace-ariane-6-reussit-premier-lancement-commercial-succes",
      excerpt: "Le lanceur europeen Ariane 6 a place avec succes quatre satellites commerciaux sur orbite lors de son premier vol commercial. Un moment cle pour l'independance spatiale europeenne.",
      content: `Ariane 6 a reussi son premier lancement commercial, marquant un tournant majeur pour l'industrie spatiale europeenne. La fusee a decollé avec succes du Centre spatial guyanais a Kourou et a place quatre satellites commerciaux sur leur orbite respective avec une precision de quelques dizaines de metres.

Ce lancement était très attendu apres plusieurs retards. Il consolide la position de l'Europe dans la competition spatiale mondiale et permet a ArianeGroup de remplir ses engagements envers ses clients commerciaux qui s'etaient inquietes des delais.

"C'est une etape fondamentale pour l'autonomie d'acces de l'Europe a l'espace", a declare le directeur general de l'Agence spatiale europeenne. "Avec Ariane 6, nous avons un lanceur moderne capable de repondre aux besoins du marche commercial et institutionnel pour les decennies a venir."

La prochaine etape sera l'homologation complete du lanceur apres une serie de vols supplementaires, puis la montee en cadence des lancements pour atteindre dix missions par an d'ici 2027. L'ESA a deja un carnet de commandes bien rempli.`,
      imageUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=800',
      featured: false,
      authorId: sophie.id,
      categoryId: science.id,
      tagIds: [tags[7].id],
    },
    {
      title: "Rechauffement climatique : 2024 confirmee comme l'annee la plus chaude jamais enregistree",
      slug: "rechauffement-climatique-2024-confirmee-annee-plus-chaude-jamais-enregistree",
      excerpt: "L'Organisation meteorologique mondiale a confirme que 2024 a ete l'annee la plus chaude depuis le debut des mesures instrumentales, depassant de 1,52°C la moyenne pre-industrielle.",
      content: `L'Organisation meteorologique mondiale (OMM) a publie son bilan climatique definitif pour l'annee 2024 : avec une temperature moyenne globale superieure de 1,52°C a la moyenne pre-industrielle, 2024 est desormais officiellement l'annee la plus chaude jamais enregistree depuis le debut des mesures systematiques en 1850.

Cette annonce est particulierement preoccupante car elle signifie que, pour la premiere fois sur une annee entiere, le seuil de 1,5°C fixe par l'Accord de Paris a ete franchi. Les climatologues s'empressent de preciser qu'un seul depassement ne signifie pas l'echec de l'Accord, celui-ci se referant a une tendance sur vingt ans.

En France, l'annee 2024 a ete marquee par plusieurs vagues de chaleur dont deux ont ete classees comme exceptionnelles, des inondations plus frequentes dans le nord du pays et un enneigement en forte baisse dans les massifs montagneux.

"Le signal climatique est desormais indiscutable et visible par tous dans leur vie quotidienne", commente le directeur d'un grand laboratoire de recherche climatique. "Nous payons le prix d'un siecle d'emissions sans precedent."`,
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      featured: false,
      authorId: marie.id,
      categoryId: science.id,
      tagIds: [tags[5].id],
    },
    {
      title: "Neurologie : une electrode cerebrale permet a un paralytique de retrouver l'usage de sa main",
      slug: "neurologie-electrode-cerebrale-permet-paralytique-retrouver-usage-main",
      excerpt: "Des chercheurs suisses et francais ont implante une electrode dans le cerveau d'un patient paralyse, lui permettant de controler sa main a travers un exosquelette. Une avancee spectaculaire.",
      content: `Une equipe de chercheurs franco-suisses a annonce une avancee spectaculaire dans la prise en charge des personnes paralysees. Un patient atteint de tetraplegie depuis cinq ans a retrouve la capacite de saisir des objets et d'effectuer des gestes precis grace a un dispositif combining electrode cerebrale et exosquelette de main.

L'interface cerveau-machine developpee par les equipes de l'EPFL (Ecole polytechnique federale de Lausanne) et du CHU de Grenoble intercepte les signaux nerveux dans le cortex moteur du patient et les transmets en temps reel au dispositif mecanique enveloppant sa main.

Le patient, qui a pris part a la conference de presse, a pu realiser plusieurs demonstrations devant les journalistes : saisir un verre d'eau, tourner une page, taper sur un clavier. "C'est comme si une partie de mon corps revenait a la vie. Je n'aurais jamais imagine cela possible il y a encore deux ans", a-t-il temoigne, visiblement emu.

Les chercheurs travaillent maintenant a la miniaturisation du dispositif et a son autonomisation pour permettre une utilisation hors du laboratoire. L'horizon commercial est estime a cinq a dix ans.`,
      imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
      featured: false,
      authorId: sophie.id,
      categoryId: science.id,
      tagIds: [tags[6].id, tags[7].id],
    },
    {
      title: "Biodiversite : un tiers des especes d'insectes menacees d'extinction en France",
      slug: "biodiversite-tiers-especes-insectes-menacees-extinction-france",
      excerpt: "Un rapport du Museum national d'Histoire naturelle revele que 34% des especes d'insectes recensees en France metropolitaine sont desormais menacees d'extinction.",
      content: `Le Museum national d'Histoire naturelle (MNHN) a publie un rapport alarmant sur l'etat de la biodiversite des insectes en France metropolitaine. Selon cette etude qui a mobilise 400 scientifiques pendant cinq ans, 34% des 35 000 especes d'insectes repertoriees sur le territoire national sont desormais considerees comme menacees d'extinction, contre 20% il y a vingt ans.

Les causes sont multiples et bien connues : utilisation intensive des pesticides agricoles, destruction des habitats naturels, urbanisation croissante, pollution lumineuse nocturne et rechauffement climatique. Les abeilles sauvages, les papillons et les coleopteres sont les groupes les plus touches.

"La disparition des insectes est un drame ecologique silencieux dont nous ne mesurons pas encore toutes les consequences", avertit la presidente du MNHN. "Les insectes sont la base de la chaine alimentaire et jouent un role irrempacable dans la pollinisation des cultures. Leur disparition nous concerne tous directement."

Le rapport formule quarante recommandations dont l'interdiction de certains pesticides neonicotinoïdes, la creation d'un reseau de corridors ecologiques et une reforme de la politique agricole commune pour integrer des obligations de preservation de la biodiversite.`,
      imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d1c?w=800',
      featured: false,
      authorId: marie.id,
      categoryId: science.id,
      tagIds: [tags[5].id],
    },

    // === INTERNATIONAL ===
    {
      title: "Ukraine : les pourparlers de paix progressent, un accord de cessez-le-feu possible",
      slug: "ukraine-pourparlers-paix-progressent-accord-cessez-le-feu-possible",
      excerpt: "Les negociations entre Kiev et Moscou, mediees par plusieurs pays europeens, semblent avancer vers un accord de cessez-le-feu. Les positions se rapprochent sur plusieurs points cles.",
      content: `Pour la premiere fois depuis le debut du conflit, des sources diplomatiques evoquent de serieux progres dans les negociations de paix entre l'Ukraine et la Russie. Des talks qui se deroulent dans un pays europeen neutre et qui sont facilites par plusieurs mediateurs europeens semblent avoir permis un rapprochement des positions sur certains points fondamentaux.

Selon des diplomates informes des discussions, les deux parties s'accorderaient sur le principe d'un cessez-le-feu supervise par des observateurs internationaux, sur un echange massif de prisonniers de guerre et sur des negociations subsequentes pour determiner le statut des territoires occupes.

Le president ukrainien a confirme indirectement ces informations lors d'une allocution, sans donner de details : "Des discussions serieuses sont en cours. Je ne veux pas compromettre leur issue, mais je peux dire que nous travaillons dur pour une paix juste."

La Russie n'a pas fait de declaration officielle, mais des sources proches du Kremlin ont confirme a plusieurs medias occidentaux que les negociations etaient "dans une phase avancee". La communaute internationale retient son souffle.`,
      imageUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800',
      featured: true,
      authorId: jeanpierre.id,
      categoryId: international.id,
      tagIds: [tags[3].id, tags[1].id],
    },
    {
      title: "Moyen-Orient : sommet d'urgence a Paris pour relancer les negociations de paix",
      slug: "moyen-orient-sommet-urgence-paris-relancer-negociations-paix",
      excerpt: "La France accueille un sommet diplomatique d'urgence reunissant les representants de vingt-deux pays et organisations internationales pour tenter de relancer le processus de paix.",
      content: `Paris est le centre du monde diplomatique ce mercredi avec la tenue d'un sommet d'urgence sur la situation au Moyen-Orient. Vingt-deux pays et organisations internationales, dont les Etats-Unis, la Chine, les pays arabes moderateurs et l'Union europeenne, se retrouvent au Quai d'Orsay pour tenter de relancer un processus de paix au point mort.

La France, qui assume une presidence tournante du Conseil de securite de l'ONU, a pris l'initiative d'organiser cette reunion apres les derniers episodes de violence qui ont fait craindre une escalade regionale.

Le ministre francais des Affaires etrangeres a ouvert les discussions en appelant a "un cessez-le-feu immediat et sans conditions" et a "une reprise des negociations sous egide internationale". "La France est prete a assumer ses responsabilites dans ce processus", a-t-il declare.

Les attentes sont mesurees. Plusieurs des participants ont signifie en amont qu'ils ne viendraient pas signer un accord mais qu'ils esperaient poser les bases d'un dialogue reanime. "Un sommet ne resout pas un conflit, mais il peut ouvrir des espaces de dialogue", resume un diplomate occidental sous couvert d'anonymat.`,
      imageUrl: 'https://images.unsplash.com/photo-1474546652694-a33dd8161d66?w=800',
      featured: false,
      authorId: jeanpierre.id,
      categoryId: international.id,
      tagIds: [tags[1].id],
    },
    {
      title: "Chine : la croissance economique ralentit, Pekin revoit ses objectifs a la baisse",
      slug: "chine-croissance-economique-ralentit-pekin-revoit-objectifs-baisse",
      excerpt: "La croissance du PIB chinois s'est etablie a 4,1% au dernier trimestre, sous l'objectif gouvernemental de 5%. Une deceleration qui inquiete les marches mondiaux.",
      content: `La deuxieme economie mondiale ralentit plus vite que prevu. Les statistiques officielles chinoises font etat d'une croissance du PIB de 4,1% au dernier trimestre, significativement en dessous de l'objectif gouvernemental de 5%. Ce ralentissement, attribue a la crise du secteur immobilier, a une demande interieure morose et a des tensions commerciales avec l'Occident, inquiete les economists mondiaux.

Le gouvernement chinois a annonce une serie de mesures de stimulation : reduction des taux d'interet, injection de liquidites dans le systeme bancaire et grands travaux d'infrastructure. Mais les analystes doutent que ces mesures soient suffisantes pour atteindre les objectifs de croissance a court terme.

"La Chine entre dans une nouvelle phase de son developpement economique, moins dependante des investissements massifs et de l'export. Cette transition est douloureuse mais necessaire", analyse un economiste specialiste de l'Asie.

Pour les economies europeennes et notamment francaise, ce ralentissement chinois n'est pas une bonne nouvelle : les exportations de produits de luxe et d'aeronautique vers la Chine pourraient etre affectees.`,
      imageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800',
      featured: false,
      authorId: jeanpierre.id,
      categoryId: international.id,
      tagIds: [],
    },
    {
      title: "Etats-Unis : les elections presidentielles s'annoncent comme les plus serrees depuis des decennies",
      slug: "etats-unis-elections-presidentielles-annoncent-plus-serrees-depuis-decennies",
      excerpt: "A quelques semaines des elections presidentielles americaines, les sondages montrent une course extremement serree entre les deux candidats, avec des Etats pivots qui peuvent basculer.",
      content: `La campagne presidientielle americaine entre dans sa phase finale dans un climat de tension extreme. Les derniers sondages nationaux donnent les deux candidats a moins de deux points de pourcentage d'ecart, une proximite qui fait redouter une nuit electorale longue et potentiellement contestee.

Tout se joue dans une poignee d'Etats pivot : Pennsylvanie, Michigan, Wisconsin, Arizona, Georgia et Nevada. C'est dans ces six Etats que l'election sera gagnee ou perdue. Les deux camps y consacrent des ressources considerables et les candidats y multiplient les meetings.

Les grands thèmes de la campagne sont l'economie et l'inflation, la politique migratoire et la securite interieure, ainsi que les deux guerres en cours en Ukraine et au Moyen-Orient. Sur ces sujets, les deux candidats proposent des visions radicalement differentes.

En Europe, et notamment en France, les chancelleries suivent l'evolution avec une inquietude non dissumulee. L'identite du futur president americain aura des consequences directes sur l'engagement de Washington dans l'OTAN, le soutien a l'Ukraine et les relations commerciales transatlantiques.`,
      imageUrl: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800',
      featured: false,
      authorId: jeanpierre.id,
      categoryId: international.id,
      tagIds: [],
    },
    {
      title: "G20 : sommet sous tension, la reforme de la gouvernance mondiale au coeur des debats",
      slug: "g20-sommet-sous-tension-reforme-gouvernance-mondiale-coeur-debats",
      excerpt: "Les dirigeants des vingt plus grandes economies mondiales se sont retrouves pour un sommet qui promet d'etre houleux. La reforme du FMI, la dette des pays pauvres et le changement climatique sont au programme.",
      content: `Le sommet du G20 qui s'est ouvert hier dans la capitale du pays hote reunira pendant deux jours les dirigeants des vingt plus grandes puissances economiques du monde. L'agenda est charge et les tensions diplomatiques sont palpables avant meme le debut des sessions plenieres.

Au coeur des debats : la reforme du Fonds monetaire international et de la Banque mondiale pour donner plus de poids aux pays emergents, la question de la dette des pays en developpement qui atteint des niveaux alarmants, et les engagements climatiques.

Le President francais portera la voix de l'Union europeenne sur la transition energetique, plaidant pour un "fonds vert international" mieux dote. Il rencontrera en marge du sommet plusieurs homologues pour discuter de la situation au Moyen-Orient.

Les ONG qui manifestent a l'exterieur du centre de conference reclament une taxation des super-riches a l'echelle mondiale et une annulation de la dette des pays les moins avances. Des revendications que certains gouvernements du G20 ont promise d'inscrire a l'agenda, sans grand espoir d'aboutir a des decisions concretes.`,
      imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800',
      featured: false,
      authorId: jeanpierre.id,
      categoryId: international.id,
      tagIds: [tags[1].id, tags[5].id],
    },
    {
      title: "Migration : l'UE adopte le nouveau Pacte sur la migration, un compromis douloureux",
      slug: "migration-ue-adopte-nouveau-pacte-migration-compromis-douloureux",
      excerpt: "Apres des annees de negociations tendues, les Etats membres de l'Union europeenne ont finalement adopte le nouveau Pacte sur la migration et l'asile. Un accord que personne n'est vraiment satisfait.",
      content: `L'Union europeenne a finalement reussi l'impossible : adopter un accord commun sur la gestion des migrations. Le nouveau Pacte sur la migration et l'asile a ete approuve par le Parlement europeen et le Conseil de l'UE apres des annees de negociations. Mais si tous les Etats membres l'ont ratifie, nombreux sont ceux qui le font "en serrant les dents".

Le texte prevoit un systeme de solidarite obligatoire entre Etats membres : ceux qui refusent d'accueillir des migrants devront soit contribuer financierement, soit apporter une aide operationnelle aux pays de premiere entree. Des procedures d'asile accelerees aux frontieres exterieures sont egalement prevues.

Les organisations de defense des droits de l'homme ont vivement critique l'accord, estimant qu'il "sacrifie les droits fondamentaux sur l'autel du compromis politique". Les pays du sud (Italie, Grece, Espagne) estiment quant a eux que la solidarite prevue est insuffisante. Les pays du nord (Pologne, Hongrie, Tcheque) ont voye leurs preferences pour une approche plus restrictive partiellement satisfaites.

La mise en oeuvre pratique sera un defi considerabl : construire les infrastructures necessaires, former les agents, etablir les cooperations avec les pays tiers. Un chantier pour les cinq prochaines annees au minimum.`,
      imageUrl: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=800',
      featured: false,
      authorId: jeanpierre.id,
      categoryId: international.id,
      tagIds: [tags[1].id],
    },
    {
      title: "Afrique : le Sahel face a l'expansion jihadiste, la communaute internationale alerte",
      slug: "afrique-sahel-face-expansion-jihadiste-communaute-internationale-alerte",
      excerpt: "Les groupes jihadistes etendent leur emprise dans la zone sahelo-saharienne malgre la presence militaire internationale. Une crise humanitaire et securitaire qui s'aggrave.",
      content: `La situation securitaire dans la zone du Sahel continue de se deteriorer. Selon le dernier rapport de l'ONU, les groupes armes jihadistes ont etendu leur presence a de nouvelles zones en un an, touchant desormais des regions jusqu'ici epargnees au Mali, au Niger, au Burkina Faso et dans les pays cotiers voisins.

Le retrait des forces militaires etrangeres de plusieurs de ces pays, conjugue a la montee en puissance de ces groupes armes, a cree un vide securitaire que les armees nationales peinent a combler. Les populations civiles sont les premieres victimes : villages incendies, deplacements de masse, blocages de l'aide humanitaire.

Sur le plan humanitaire, le Programme alimentaire mondial estime que 8 millions de personnes sont en situation d'insecurite alimentaire severe dans cette region. Les ecoles et les hopitaux ferment sous les menaces. Une generation d'enfants grandit sans acces a l'education.

La communaute internationale s'interroge sur les reponses a apporter. Les approches purement militaires ont montre leurs limites. Des voix s'elevent pour prioriser le developpement economique, la gouvernance et la lutte contre la corruption comme conditions du retablissement de la securite.`,
      imageUrl: 'https://images.unsplash.com/photo-1547469096-8b3f2e8a2aa5?w=800',
      featured: false,
      authorId: jeanpierre.id,
      categoryId: international.id,
      tagIds: [],
    },
    {
      title: "COP30 : les engagements restent insuffisants, la frustration monte parmi les pays vulnerables",
      slug: "cop30-engagements-restent-insuffisants-frustration-monte-pays-vulnerables",
      excerpt: "La trentieme conference des parties sur le climat s'est achevee avec un accord juge insuffisant par les pays les plus vulnerables au rechauffement climatique. Les scientifiques sont deçus.",
      content: `La trentieme Conference des parties sur le climat (COP30) qui s'est tenue au Bresil s'est achevee avec un accord qui laisse un gout amer. Si les negociateurs ont reussi a s'entendre sur un texte final, les pays les plus vulnerables au changement climatique et les organisations scientifiques ont exprime leur profonde deception.

Les engagements de reduction des emissions pris par les grandes puissances sont juges "tres insuffisants" pour maintenir le rechauffement sous la barre des 1,5°C. Un rapport du GIEC, presente en marge de la conference, estime que les politiques actuelles conduisent a un rechauffement de 2,7°C d'ici 2100.

Le contentieux sur le financement climatique est reste au coeur des tensions. Les pays en developpement reclament 1 000 milliards de dollars par an pour financer leur transition energetique et s'adapter aux changements climatiques. L'accord final prevoit un objectif de 300 milliards, loin du compte selon les pays du Sud.

"Nous venons signer notre sentence de mort", avait declare avec fracas le delegue d'un Etat insulaire du Pacifique lors de la derniere seance pleniere, sa declaration reprise en boucle par les medias du monde entier.`,
      imageUrl: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800',
      featured: false,
      authorId: marie.id,
      categoryId: international.id,
      tagIds: [tags[5].id, tags[1].id],
    },
  ];

  // Create articles
  let createdCount = 0;
  const now = new Date();

  for (let i = 0; i < articlesData.length; i++) {
    const { tagIds, ...articleFields } = articlesData[i];
    const publishedAt = new Date(now.getTime() - i * 4 * 60 * 60 * 1000); // every 4 hours

    const article = await prisma.article.create({
      data: {
        ...articleFields,
        status: 'published',
        views: Math.floor(Math.random() * 5000) + 100,
        publishedAt,
      },
    });

    if (tagIds && tagIds.length > 0) {
      await Promise.all(
        tagIds.map((tagId) =>
          prisma.articleTag.create({
            data: { articleId: article.id, tagId },
          })
        )
      );
    }

    createdCount++;
  }

  console.log(`Created ${createdCount} articles`);

  // Newsletter subscribers
  const subscribers = [
    'alice.martin@example.com',
    'bob.dupont@example.fr',
    'carol.bernard@example.com',
    'david.petit@example.fr',
    'emma.richard@example.com',
  ];

  for (const email of subscribers) {
    await prisma.newsletterSubscriber.create({
      data: {
        email,
        confirmedAt: new Date(),
      },
    });
  }

  console.log(`Created ${subscribers.length} newsletter subscribers`);
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
