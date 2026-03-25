import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'international' }, update: {}, create: { name: 'International', slug: 'international', description: 'Actualités du monde entier', color: '#003189' } }),
    prisma.category.upsert({ where: { slug: 'politique' }, update: {}, create: { name: 'Politique', slug: 'politique', description: 'Vie politique française', color: '#D0021B' } }),
    prisma.category.upsert({ where: { slug: 'societe' }, update: {}, create: { name: 'Société', slug: 'societe', description: 'Société et culture', color: '#4A4A4A' } }),
    prisma.category.upsert({ where: { slug: 'economie' }, update: {}, create: { name: 'Économie', slug: 'economie', description: 'Économie et finance', color: '#2E7D32' } }),
    prisma.category.upsert({ where: { slug: 'culture' }, update: {}, create: { name: 'Culture', slug: 'culture', description: 'Culture et arts', color: '#6A1B9A' } }),
    prisma.category.upsert({ where: { slug: 'sciences' }, update: {}, create: { name: 'Sciences', slug: 'sciences', description: 'Sciences et technologies', color: '#0277BD' } }),
    prisma.category.upsert({ where: { slug: 'sport' }, update: {}, create: { name: 'Sport', slug: 'sport', description: 'Actualités sportives', color: '#F57F17' } }),
    prisma.category.upsert({ where: { slug: 'pixels' }, update: {}, create: { name: 'Pixels', slug: 'pixels', description: 'Numérique et jeux vidéo', color: '#00838F' } }),
  ]);

  const [catInt, catPol, catSoc, catEco, catCul, catSci, catSport, catPix] = categories;
  console.log('Categories created');

  // Users (admin + journalists)
  const hashedAdmin = await bcrypt.hash('Admin1234!', 10);
  const hashedJournalist = await bcrypt.hash('Journal1234!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@lemonde6.fr' },
    update: {},
    create: {
      email: 'admin@lemonde6.fr',
      name: 'Administrateur',
      password: hashedAdmin,
      role: 'admin',
      bio: 'Administrateur du site Le Monde6.',
      avatar: 'https://i.pravatar.cc/150?img=10',
    },
  });

  const jean = await prisma.user.upsert({
    where: { email: 'jean.dupont@lemonde6.fr' },
    update: {},
    create: {
      email: 'jean.dupont@lemonde6.fr',
      name: 'Jean Dupont',
      password: hashedJournalist,
      role: 'journalist',
      bio: 'Journaliste politique depuis 15 ans. Spécialiste des institutions françaises et de la vie parlementaire. Ancien correspondant à Bruxelles.',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
  });

  const marie = await prisma.user.upsert({
    where: { email: 'marie.martin@lemonde6.fr' },
    update: {},
    create: {
      email: 'marie.martin@lemonde6.fr',
      name: 'Marie Martin',
      password: hashedJournalist,
      role: 'journalist',
      bio: 'Grande reporter internationale. Elle a couvert les conflits en Ukraine, au Moyen-Orient et en Afrique subsaharienne. Prix Albert-Londres 2022.',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
  });

  const paul = await prisma.user.upsert({
    where: { email: 'paul.leroy@lemonde6.fr' },
    update: {},
    create: {
      email: 'paul.leroy@lemonde6.fr',
      name: 'Paul Leroy',
      password: hashedJournalist,
      role: 'journalist',
      bio: 'Correspondant économique à Bruxelles depuis 2018. Expert en politiques européennes, marchés financiers et économie numérique.',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
  });

  console.log('Users created');

  const now = new Date('2026-03-25');

  const articlesData = [
    {
      title: "Sommet européen : les dirigeants s'accordent sur un nouveau pacte de sécurité",
      slug: 'sommet-europeen-pacte-securite',
      excerpt: "Les vingt-sept États membres ont trouvé un accord historique pour renforcer la coopération militaire et la défense collective européenne.",
      content: `<p>Après deux jours de négociations intenses à Bruxelles, les dirigeants des vingt-sept États membres de l'Union européenne ont conclu un accord sur un nouveau pacte de sécurité collective, marquant un tournant historique dans la politique de défense européenne.</p>
<p>Le texte prévoit notamment la création d'un fonds commun de 100 milliards d'euros destiné à financer l'industrie de défense européenne sur les cinq prochaines années, ainsi qu'une coordination renforcée des renseignements militaires.</p>
<h2>Des négociations difficiles</h2>
<p>Les discussions ont été particulièrement ardues sur la question de la gouvernance du fonds. Plusieurs États, dont la France et l'Allemagne, ont défendu une approche intergouvernementale, tandis que la Commission européenne plaidait pour davantage d'intégration communautaire.</p>
<p>C'est finalement un compromis qui a été trouvé, avec un conseil de surveillance mixte composé à la fois de représentants des États membres et de la Commission.</p>
<h2>Une réponse aux défis géopolitiques</h2>
<p>Cet accord intervient dans un contexte de tensions accrues aux frontières de l'Europe, notamment en Ukraine et en mer de Chine méridionale. Les dirigeants européens ont unanimement salué cette avancée.</p>
<p>La signature formelle du traité aura lieu lors du prochain sommet de l'UE prévu à Madrid en juin.</p>`,
      image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&q=80',
      imageCaption: 'Les dirigeants européens réunis au Conseil européen à Bruxelles.',
      imageCredit: 'AFP / Getty Images',
      badge: 'EXCLUSIF',
      categoryId: catInt.id,
      authorId: marie.id,
      featured: true,
      views: 4250,
      daysAgo: 1,
    },
    {
      title: "Budget 2027 : le gouvernement annonce 20 milliards de coupes dans les dépenses",
      slug: 'budget-2027-coupes-depenses',
      excerpt: "Le Premier ministre a présenté un plan d'austérité pour réduire le déficit public à 3% du PIB, suscitant de vives oppositions.",
      content: `<p>Le gouvernement a dévoilé son plan pour le budget 2027, qui prévoit 20 milliards d'euros de réductions de dépenses publiques. Une annonce qui suscite déjà des protestations dans les rangs de la majorité et de l'opposition.</p>
<p>Le Premier ministre a justifié ces choix par la nécessité de respecter les engagements européens de la France et de retrouver la confiance des marchés financiers.</p>
<h2>Les principaux postes touchés</h2>
<p>Les coupes concerneront principalement les dépenses de fonctionnement de l'État, avec une réduction de 8 milliards d'euros, et les transferts aux collectivités territoriales, pour 6 milliards.</p>
<p>Le budget de l'éducation nationale sera épargné, conformément aux engagements du président de la République. En revanche, les ministères de la culture et de l'agriculture verront leurs crédits réduits.</p>
<h2>Réactions politiques</h2>
<p>À gauche, les partis d'opposition ont immédiatement dénoncé un "budget de classe" qui ferait peser l'effort sur les plus modestes. À droite, certains élus jugent les coupes insuffisantes.</p>`,
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
      imageCaption: 'La conférence de presse du Premier ministre à Matignon.',
      imageCredit: 'Reuters',
      badge: 'ANALYSE',
      categoryId: catPol.id,
      authorId: jean.id,
      featured: true,
      views: 2980,
      daysAgo: 2,
    },
    {
      title: "Intelligence artificielle : la France investit 5 milliards dans la recherche",
      slug: 'france-investit-ia-recherche',
      excerpt: "Emmanuel Macron annonce un plan massif pour positionner la France comme leader européen de l'intelligence artificielle.",
      content: `<p>Le président de la République a annoncé un investissement de 5 milliards d'euros dans la recherche sur l'intelligence artificielle, dans le cadre d'un plan national baptisé "France IA 2030".</p>
<p>L'objectif est de tripler le nombre de chercheurs français travaillant sur l'IA, de créer dix nouveaux instituts de recherche et d'attirer les meilleurs talents mondiaux dans ce domaine.</p>
<h2>Un enjeu de souveraineté</h2>
<p>Selon l'Élysée, cet investissement répond à un enjeu de souveraineté technologique. "Si l'Europe ne prend pas sa place dans la course à l'IA, ce sont d'autres qui décideront des règles du jeu", a déclaré le chef de l'État.</p>
<p>Le plan prévoit également la création d'un calculateur souverain de rang mondial, dont la puissance permettrait de concurrencer les infrastructures américaines et chinoises.</p>
<h2>Les partenaires industriels</h2>
<p>Une quinzaine d'entreprises françaises et européennes ont annoncé des investissements complémentaires, portant le total du plan à plus de 15 milliards d'euros.</p>`,
      image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
      imageCaption: "Présentation du plan France IA 2030 à l'Élysée.",
      imageCredit: 'Élysée / DICOM',
      badge: 'REPORTAGE',
      categoryId: catSci.id,
      authorId: paul.id,
      featured: true,
      views: 3560,
      daysAgo: 3,
    },
    {
      title: "Réforme des retraites : le Conseil constitutionnel valide les principales mesures",
      slug: 'reforme-retraites-conseil-constitutionnel',
      excerpt: "La réforme portant l'âge légal de départ à 64 ans est conforme à la Constitution, ont statué les Sages.",
      content: `<p>La décision du Conseil constitutionnel est tombée : la réforme des retraites, qui repousse l'âge légal de départ de 62 à 64 ans, est jugée conforme à la Constitution dans ses grandes lignes.</p>
<p>Les Sages ont néanmoins censuré deux cavaliers législatifs qui n'avaient pas leur place dans le texte budgétaire.</p>
<h2>Réactions politiques</h2>
<p>Le gouvernement a salué cette décision, y voyant une "validation démocratique" de sa réforme. À gauche, les partis d'opposition ont annoncé qu'ils continueraient à se battre contre cette réforme par tous les moyens constitutionnels.</p>
<p>Les syndicats ont immédiatement convoqué une nouvelle journée d'action nationale.</p>`,
      image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&q=80',
      imageCaption: 'Le Conseil constitutionnel, rue de Montpensier à Paris.',
      imageCredit: 'Conseil constitutionnel',
      badge: null,
      categoryId: catPol.id,
      authorId: jean.id,
      featured: false,
      views: 3100,
      daysAgo: 4,
    },
    {
      title: "Crise climatique : 2025 a été l'année la plus chaude jamais enregistrée",
      slug: 'crise-climatique-2025-annee-plus-chaude',
      excerpt: "Les données météorologiques confirment que 2025 a battu tous les records de température planétaire, dépassant le seuil de 1,5°C.",
      content: `<p>Les organismes météorologiques mondiaux ont confirmé que l'année 2025 a été la plus chaude jamais enregistrée depuis le début des relevés instrumentaux.</p>
<p>La température moyenne de la planète a dépassé de 1,6°C la moyenne de l'ère préindustrielle, franchissant pour la première fois le seuil symbolique de 1,5°C fixé par l'accord de Paris.</p>
<h2>Des conséquences concrètes</h2>
<p>En France, l'été 2025 a été marqué par six vagues de chaleur successives, dont trois avec des températures supérieures à 45°C dans le Sud. Le nombre de décès liés à la chaleur a atteint un niveau record.</p>
<p>Selon les climatologues, ce n'est malheureusement pas une anomalie mais l'illustration d'une tendance de fond qui va s'accentuer dans les décennies à venir.</p>
<h2>Appels à l'action</h2>
<p>Face à ces données alarmantes, le secrétaire général de l'ONU a appelé les gouvernements à "stopper d'urgence toute nouvelle exploitation d'énergies fossiles".</p>`,
      image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
      imageCaption: "Sécheresse en Camargue, conséquence du changement climatique.",
      imageCredit: 'Jean-Pierre Clatot / AFP',
      badge: 'ENQUETE',
      categoryId: catSci.id,
      authorId: marie.id,
      featured: false,
      views: 2890,
      daysAgo: 5,
    },
    {
      title: "Festival de Cannes : la Palme d'or décernée à un film japonais",
      slug: 'cannes-palme-or-film-japonais',
      excerpt: "Le jury a récompensé Hirokazu Kore-eda pour son film poétique sur la mémoire et la transmission entre générations.",
      content: `<p>C'est un film japonais qui a remporté la Palme d'or lors du Festival de Cannes. "Koe no Kioku" du réalisateur Hirokazu Kore-eda a ému aux larmes une grande partie du public et du jury présidé cette année par une cinéaste française.</p>
<p>Le jury a salué "un film d'une rare beauté formelle, qui explore avec une délicatesse infinie les liens entre génération et transmission, entre souvenir et identité".</p>
<h2>Un cinéaste au sommet</h2>
<p>Pour Kore-eda, c'est une deuxième Palme d'or après "Une affaire de famille" en 2018, ce qui en fait l'un des très rares cinéastes à avoir décroché deux fois la plus haute récompense cannoise.</p>
<p>Le Grand Prix a été décerné à un film brésilien, tandis que le Prix du jury est allé à une production franco-sénégalaise.</p>`,
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
      imageCaption: 'Le Palais des Festivals de Cannes lors de la cérémonie de clôture.',
      imageCredit: 'Valery Hache / AFP',
      badge: 'REPORTAGE',
      categoryId: catCul.id,
      authorId: marie.id,
      featured: false,
      views: 1250,
      daysAgo: 6,
    },
    {
      title: "Économie française : le chômage remonte à 8,2% au premier trimestre",
      slug: 'economie-chomage-remonte',
      excerpt: "L'INSEE publie des chiffres décevants sur l'emploi, avec une hausse pour le troisième trimestre consécutif.",
      content: `<p>Le taux de chômage en France a progressé de 0,3 point au premier trimestre 2026 pour s'établir à 8,2% de la population active, selon les données de l'INSEE.</p>
<p>Cette augmentation touche principalement les jeunes de moins de 25 ans, dont le taux de chômage atteint désormais 22,5%, et les travailleurs seniors en reconversion.</p>
<h2>Des causes multiples</h2>
<p>Les économistes pointent plusieurs facteurs : le ralentissement de la croissance mondiale, l'impact de la numérisation sur certains emplois peu qualifiés, et les effets tardifs de la hausse des taux d'intérêt sur l'investissement des entreprises.</p>
<h2>Les secteurs les plus touchés</h2>
<p>La construction et le commerce de détail sont les deux secteurs ayant le plus souffert. À l'inverse, les services numériques et la santé continuent de recruter activement.</p>`,
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
      imageCaption: "Agence Pôle emploi dans le centre de Paris.",
      imageCredit: 'Thomas Coex / AFP',
      badge: 'ANALYSE',
      categoryId: catEco.id,
      authorId: paul.id,
      featured: false,
      views: 920,
      daysAgo: 7,
    },
    {
      title: "Ligue des champions : le PSG s'impose face à Manchester City en demi-finale",
      slug: 'ldc-psg-manchester-city',
      excerpt: "Le club parisien se qualifie pour sa troisième finale de Ligue des champions après une prestation magistrale.",
      content: `<p>Le Paris Saint-Germain s'est qualifié pour la finale de la Ligue des champions en s'imposant face à Manchester City sur l'ensemble des deux matches (3-1, 2-0).</p>
<p>Au retour à l'Etihad Stadium, le PSG a réussi à tenir le score nul pendant 70 minutes avant que Kylian Mbappé ne scelle la qualification d'une frappe foudroyante dans la lucarne du gardien anglais.</p>
<h2>Une équipe collective</h2>
<p>Au-delà de l'individualité de son attaquant vedette, c'est bien la solidité collective du PSG qui a permis cette qualification. La défense parisienne a été quasiment irréprochable sur les deux matches.</p>
<p>La finale aura lieu à Munich le 31 mai. Le PSG affrontera soit le Real Madrid, soit le Bayern, les deux équipes se retrouvant dans l'autre demi-finale.</p>`,
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80',
      imageCaption: 'Le PSG fête sa qualification pour la finale de la Ligue des champions.',
      imageCredit: 'Franck Fife / AFP',
      badge: null,
      categoryId: catSport.id,
      authorId: jean.id,
      featured: false,
      views: 5200,
      daysAgo: 8,
    },
    {
      title: "Tensions en mer de Chine : Pékin et Washington au bord de la crise",
      slug: 'mer-chine-tensions-pekin-washington',
      excerpt: "Un incident naval dans le détroit de Taïwan a provoqué une escalade diplomatique sans précédent.",
      content: `<p>La situation en mer de Chine méridionale s'est brusquement tendue après qu'un destroyer américain et une frégate chinoise se sont frôlés dans le détroit de Taïwan, à quelques dizaines de mètres de distance.</p>
<p>Washington assure que son navire effectuait une "opération de liberté de navigation" dans des eaux internationales. Pékin dénonce une "intrusion provocatrice dans les eaux souveraines chinoises".</p>
<h2>Risque d'escalade</h2>
<p>Les analystes s'inquiètent d'une escalade involontaire. "La marge d'erreur est de plus en plus mince dans cette zone", avertit un expert en sécurité régionale.</p>
<p>Le département d'État américain a convoqué l'ambassadeur de Chine pour s'expliquer sur les manœuvres "dangereuses" de la marine chinoise.</p>`,
      image: 'https://images.unsplash.com/photo-1605170439002-90845e8c0137?w=800&q=80',
      imageCaption: 'Un destroyer de la marine américaine en mer de Chine méridionale.',
      imageCredit: 'US Navy',
      badge: 'EXCLUSIF',
      categoryId: catInt.id,
      authorId: marie.id,
      featured: true,
      views: 4850,
      daysAgo: 9,
    },
    {
      title: "Grève SNCF : le trafic perturbé jusqu'à vendredi dans toute la France",
      slug: 'greve-sncf-trafic-perturbe',
      excerpt: "Les syndicats de cheminots ont déclenché un mouvement de grève reconductible contre un projet de réorganisation.",
      content: `<p>Le trafic ferroviaire est fortement perturbé suite à un appel à la grève lancé par trois syndicats représentatifs à la SNCF. Selon la direction, un TGV sur quatre circule, et un train régional sur trois.</p>
<p>Les syndicats protestent contre un projet de réorganisation qui, selon eux, menace plusieurs centaines d'emplois de conduite et dénature les conditions de travail des cheminots.</p>
<h2>Des voyageurs bloqués</h2>
<p>Des milliers de voyageurs se retrouvent bloqués dans les grandes gares, notamment à Paris-Montparnasse et Lyon-Part-Dieu. La SNCF recommande de reporter les déplacements non urgents.</p>
<p>La direction de la SNCF a indiqué avoir saisi le médiateur du travail et proposé des réunions de négociation dès jeudi.</p>`,
      image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80',
      imageCaption: "Des voyageurs attendent sur le quai d'une gare parisienne.",
      imageCredit: 'Alain Jocard / AFP',
      badge: null,
      categoryId: catSoc.id,
      authorId: jean.id,
      featured: false,
      views: 2700,
      daysAgo: 10,
    },
    {
      title: "AI Act : ce que la loi européenne sur l'IA change pour les entreprises",
      slug: 'ai-act-loi-ia-entreprises-changements',
      excerpt: "Le règlement européen sur l'IA entre en vigueur. Les entreprises ont 18 mois pour se mettre en conformité.",
      content: `<p>Le règlement européen sur l'intelligence artificielle (AI Act) est officiellement entré en vigueur. Les entreprises ont 18 mois pour se conformer aux nouvelles règles, sous peine de lourdes amendes.</p>
<p>Le texte classe les systèmes d'IA en quatre niveaux de risque : interdit, à haut risque, à risque limité et à risque minimal.</p>
<h2>Des obligations concrètes</h2>
<p>Pour les systèmes à haut risque – qui incluent notamment les outils de recrutement, de crédit et les logiciels médicaux –, les entreprises devront documenter leurs données d'entraînement, garantir la supervision humaine et passer des audits réguliers.</p>
<p>Les amendes peuvent atteindre jusqu'à 30 millions d'euros ou 6% du chiffre d'affaires mondial pour les infractions les plus graves.</p>`,
      image: 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800&q=80',
      imageCaption: "Les nouvelles règles européennes concernent tous les systèmes d'IA commerciaux.",
      imageCredit: 'Shutterstock',
      badge: 'ANALYSE',
      categoryId: catPix.id,
      authorId: paul.id,
      featured: false,
      views: 1390,
      daysAgo: 11,
    },
    {
      title: "Logement : les loyers parisiens ont augmenté de 12% en deux ans",
      slug: 'loyers-parisiens-hausse',
      excerpt: "Malgré l'encadrement des loyers, les prix dans la capitale continuent de progresser, creusant la fracture sociale.",
      content: `<p>Une étude publiée par l'Observatoire des loyers de l'agglomération parisienne révèle que les loyers à Paris ont augmenté en moyenne de 12% sur les deux dernières années.</p>
<p>L'encadrement des loyers, pourtant en vigueur depuis plusieurs années, est contourné par de nombreux propriétaires qui profitent de la notion de "complément de loyer".</p>
<h2>Une crise structurelle</h2>
<p>Au-delà de Paris, c'est l'ensemble des grandes métropoles françaises qui connaît une tension locative sans précédent. Lyon, Bordeaux et Rennes affichent des hausses de loyers supérieures à 15% sur la période.</p>
<p>Selon les associations de locataires, des dizaines de milliers de ménages ont été contraints de quitter les centres-villes pour s'installer en périphérie.</p>`,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
      imageCaption: "Immeuble haussmannien dans le 7e arrondissement de Paris.",
      imageCredit: 'Lionel Bonaventure / AFP',
      badge: 'ENQUETE',
      categoryId: catSoc.id,
      authorId: marie.id,
      featured: false,
      views: 2340,
      daysAgo: 12,
    },
    {
      title: "Tour de France 2026 : le parcours officiel dévoilé",
      slug: 'tour-de-france-2026-parcours',
      excerpt: "La Grande Boucle 2026 débutera à Barcelone avec un tracé exigeant de 21 étapes traversant cinq massifs montagneux.",
      content: `<p>Amaury Sport Organisation a présenté le parcours officiel du Tour de France 2026. La course débutera à Barcelone le 4 juillet pour un Grand Départ à l'étranger, une tradition du Tour qui renforce son rayonnement international.</p>
<p>Le tracé comprend 21 étapes pour 3 450 kilomètres au total, avec un profil particulièrement montagneux cette année.</p>
<h2>Les étapes reines</h2>
<p>La 17e étape s'annonce comme la plus difficile : elle enchaînera cinq cols mythiques en une seule journée, dont le Galibier et l'Izoard. Les organisateurs l'ont surnommée "l'étape du siècle".</p>
<p>Le contre-la-montre final aura lieu à Paris, sur les Champs-Élysées, ce qui n'était plus arrivé depuis 2004.</p>`,
      image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&q=80',
      imageCaption: "Le peloton du Tour de France dans les Alpes.",
      imageCredit: 'Marco Bertorello / AFP',
      badge: null,
      categoryId: catSport.id,
      authorId: jean.id,
      featured: false,
      views: 860,
      daysAgo: 13,
    },
    {
      title: "ChatGPT-5 : les premiers utilisateurs partagent leurs impressions",
      slug: 'chatgpt-5-premiers-retours-utilisateurs',
      excerpt: "OpenAI a lancé GPT-5 avec des capacités de raisonnement améliorées. Les retours sont contrastés mais globalement positifs.",
      content: `<p>Deux semaines après son lancement, GPT-5 d'OpenAI suscite des réactions contrastées parmi ses utilisateurs. Les performances sur les tâches de raisonnement complexe sont nettement améliorées par rapport à la génération précédente.</p>
<p>Les développeurs saluent les progrès en matière de génération de code et de débogage, tandis que certains utilisateurs notent des régressions sur des tâches créatives.</p>
<h2>Ce qui change vraiment</h2>
<p>La principale innovation de GPT-5 réside dans sa capacité à "réfléchir" avant de répondre, en décomposant les problèmes complexes en sous-étapes. Cette approche, inspirée du raisonnement humain, se révèle particulièrement efficace pour les mathématiques et la logique formelle.</p>`,
      image: 'https://images.unsplash.com/photo-1679083216051-aa510a1a2c0e?w=800&q=80',
      imageCaption: "Interface de ChatGPT-5 sur un ordinateur portable.",
      imageCredit: 'OpenAI',
      badge: 'ANALYSE',
      categoryId: catPix.id,
      authorId: paul.id,
      featured: false,
      views: 3230,
      daysAgo: 14,
    },
    {
      title: "Inflation : le panier de la ménagère bondit de 4,2% sur un an",
      slug: 'inflation-panier-menagere-hausse',
      excerpt: "Les prix alimentaires repartent à la hausse en France, pénalisant en priorité les ménages les plus modestes.",
      content: `<p>L'inflation alimentaire est repartie à la hausse en France. Selon l'INSEE, les prix des produits alimentaires ont progressé de 4,2% sur un an, après une accalmie en 2025.</p>
<p>Cette accélération touche particulièrement les produits frais (+6,8%), les huiles et graisses (+8,1%) et les produits laitiers (+5,3%).</p>
<h2>Des ménages en difficulté</h2>
<p>Selon les associations caritatives, le nombre de personnes ayant recours à l'aide alimentaire a augmenté de 18% en un an. Les banques alimentaires peinent à répondre à cette demande croissante.</p>
<p>La grande distribution annonce de son côté un "bouclier qualité-prix" renforcé, avec 200 produits du quotidien dont les prix seront bloqués jusqu'à la fin de l'année.</p>`,
      image: 'https://images.unsplash.com/photo-1543168256-418811576931?w=800&q=80',
      imageCaption: "Rayons d'un supermarché en France.",
      imageCredit: 'Philippe Huguen / AFP',
      badge: null,
      categoryId: catEco.id,
      authorId: paul.id,
      featured: false,
      views: 1820,
      daysAgo: 15,
    },
    {
      title: "Guerre en Ukraine : Kyiv repousse une offensive majeure sur le front est",
      slug: 'ukraine-offensive-russe-front-est',
      excerpt: "L'armée ukrainienne affirme avoir repoussé une tentative de percée russe dans la région de Donetsk après des combats intenses.",
      content: `<p>L'état-major ukrainien a annoncé avoir repoussé une offensive russe de grande envergure sur le front est du pays, dans la région de Donetsk. Les combats ont duré plusieurs jours et auraient causé de lourdes pertes dans les rangs russes.</p>
<p>Cette offensive intervient après plusieurs semaines de relative accalmie sur le front, pendant lesquelles les deux camps procédaient à une réorganisation de leurs lignes.</p>
<h2>Une situation toujours volatile</h2>
<p>Les observateurs internationaux soulignent que si les forces ukrainiennes ont repoussé cette attaque, la situation demeure extrêmement tendue sur l'ensemble du front, long de plus de 1 200 kilomètres.</p>
<p>Les alliés occidentaux ont annoncé de nouveaux packages d'aide militaire pour soutenir l'effort de guerre ukrainien.</p>`,
      image: 'https://images.unsplash.com/photo-1643483713503-f2e6b5d9f9e5?w=800&q=80',
      imageCaption: "Soldats ukrainiens en position défensive dans la région de Donetsk.",
      imageCredit: 'Ukrainian Armed Forces',
      badge: 'REPORTAGE',
      categoryId: catInt.id,
      authorId: marie.id,
      featured: false,
      views: 2980,
      daysAgo: 16,
    },
    {
      title: "Médecine : une thérapie génique guérit 15 enfants atteints d'une maladie rare",
      slug: 'therapie-genique-enfants-maladie-rare',
      excerpt: "Des résultats spectaculaires dans le traitement de la myopathie de Duchenne ouvrent une nouvelle ère médicale.",
      content: `<p>Une équipe de chercheurs franco-américains a annoncé des résultats cliniques exceptionnels pour une nouvelle thérapie génique destinée à traiter la myopathie de Duchenne, une maladie génétique rare et invalidante qui touche principalement les garçons.</p>
<p>Sur les 15 enfants traités dans le cadre de cet essai clinique de phase 2, tous ont montré une amélioration significative de leur force musculaire six mois après le traitement.</p>
<h2>Un espoir pour les familles</h2>
<p>Pour les familles d'enfants atteints de cette maladie, ces résultats sont une lueur d'espoir. "C'est la première fois depuis le diagnostic que mon fils peut se lever seul de sa chaise", témoigne la mère d'un des participants.</p>
<p>La thérapie devrait faire l'objet d'une demande d'autorisation de mise sur le marché européen dans les 18 prochains mois.</p>`,
      image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80',
      imageCaption: "Laboratoire de recherche en thérapie génique.",
      imageCredit: 'Sebastian Kaulitzki / Shutterstock',
      badge: 'EXCLUSIF',
      categoryId: catSci.id,
      authorId: paul.id,
      featured: false,
      views: 3670,
      daysAgo: 17,
    },
    {
      title: "Crise agricole : des milliers d'agriculteurs manifestent à Paris",
      slug: 'crise-agricole-manifestations-paris',
      excerpt: "Plusieurs milliers d'agriculteurs ont envahi les boulevards parisiens pour protester contre les politiques agricoles.",
      content: `<p>Pour la troisième fois en six mois, des milliers d'agriculteurs ont convergé vers Paris avec leurs tracteurs pour manifester leur mécontentement face aux politiques agricoles nationales et européennes.</p>
<p>Les revendications portent notamment sur la simplification des normes environnementales, jugées trop contraignantes, et sur le renforcement des mesures de protection contre les importations à bas prix.</p>
<h2>Des blocages sur les routes</h2>
<p>Dès l'aube, des centaines de tracteurs ont bloqué plusieurs axes routiers en Île-de-France, provoquant d'importants embouteillages. La manifestation a rassemblé, selon les organisateurs, plus de 5 000 véhicules agricoles.</p>
<p>Le ministre de l'Agriculture a annoncé une réunion d'urgence avec les syndicats agricoles en fin de semaine.</p>`,
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80',
      imageCaption: "Tracteurs sur les Champs-Élysées lors de la manifestation agricole.",
      imageCredit: 'Christophe Ena / AP',
      badge: null,
      categoryId: catSoc.id,
      authorId: jean.id,
      featured: false,
      views: 1890,
      daysAgo: 18,
    },
    {
      title: "Startup Lumia lève 40 millions d'euros pour révolutionner le diagnostic médical",
      slug: 'startup-lumia-levee-fonds-medical',
      excerpt: "La jeune entreprise utilise l'IA pour détecter précocement plusieurs cancers avec un taux de réussite de 94%.",
      content: `<p>Lumia, startup parisienne fondée en 2022, annonce une levée de fonds de 40 millions d'euros en série B, menée par le fonds d'investissement européen Sofina et plusieurs fonds spécialisés dans la HealthTech.</p>
<p>L'entreprise développe une technologie basée sur l'intelligence artificielle permettant de détecter précocement plusieurs types de cancers à partir d'une simple prise de sang.</p>
<h2>Des résultats cliniques prometteurs</h2>
<p>En phase de tests cliniques, la technologie de Lumia affiche un taux de détection de 94% pour le cancer du poumon à un stade précoce, contre 60% pour les méthodes conventionnelles.</p>
<p>Les fonds levés permettront à la startup de déployer sa solution dans 50 établissements hospitaliers en France et en Allemagne dès l'année prochaine.</p>`,
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',
      imageCaption: "L'équipe de Lumia dans son laboratoire à Paris.",
      imageCredit: 'Lumia',
      badge: null,
      categoryId: catSci.id,
      authorId: paul.id,
      featured: false,
      views: 2150,
      daysAgo: 19,
    },
    {
      title: "Cyberattaque massive : une vingtaine d'hôpitaux français paralysés",
      slug: 'cyberattaque-hopitaux-france',
      excerpt: "Des groupes de hackers ont frappé simultanément plusieurs établissements hospitaliers avec un ransomware sophistiqué.",
      content: `<p>Une vague d'attaques de type ransomware a paralysé une vingtaine d'hôpitaux français dans la nuit de mercredi à jeudi. Les établissements touchés ont dû déprogrammer des opérations non urgentes et revenir aux procédures papier.</p>
<p>L'Agence nationale de la sécurité des systèmes d'information (ANSSI) a été immédiatement saisie et travaille à restaurer les systèmes compromis.</p>
<h2>Une attaque coordonnée</h2>
<p>Les experts en cybersécurité notent que la coordination et la sophistication de cette attaque laissent penser qu'elle a été orchestrée par un groupe criminel organisé, disposant de moyens importants.</p>
<p>Le ministre de la Santé a annoncé un plan d'urgence pour renforcer la cybersécurité des établissements de santé, avec un budget de 250 millions d'euros sur trois ans.</p>`,
      image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80',
      imageCaption: "Un technicien informatique tente de rétablir les systèmes hospitaliers.",
      imageCredit: 'Kenzo Tribouillard / AFP',
      badge: 'ENQUETE',
      categoryId: catPix.id,
      authorId: paul.id,
      featured: false,
      views: 2890,
      daysAgo: 20,
    },
    {
      title: "Le CAC 40 franchit pour la première fois les 10 000 points",
      slug: 'cac40-franchit-10000-points',
      excerpt: "L'indice phare de la bourse parisienne atteint un record historique, porté par les valeurs du luxe et la Tech.",
      content: `<p>Le CAC 40 a franchi pour la première fois de son histoire la barre symbolique des 10 000 points, porté par les valeurs du luxe et une embellie sur les marchés obligataires européens.</p>
<p>LVMH, Hermès et L'Oréal, qui représentent près de 30% du poids de l'indice, ont été les principales locomotives de cette hausse historique, affichant respectivement des gains de 3,2%, 2,8% et 2,1% sur la séance.</p>
<h2>Causes et perspectives</h2>
<p>Les analystes attribuent cette performance à la publication de résultats d'entreprises meilleurs que prévu, à une détente des tensions inflationnistes et à la perspective d'une baisse des taux directeurs de la BCE.</p>`,
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
      imageCaption: "Traders sur le parquet de la Bourse de Paris.",
      imageCredit: 'Eric Piermont / AFP',
      badge: null,
      categoryId: catEco.id,
      authorId: paul.id,
      featured: false,
      views: 3100,
      daysAgo: 21,
    },
    {
      title: "Proche-Orient : les négociations de paix reprennent à Genève",
      slug: 'proche-orient-negociations-paix-geneve',
      excerpt: "Sous l'égide des Nations unies, les parties au conflit se retrouvent autour d'une même table pour la première fois.",
      content: `<p>Des représentants de plusieurs pays du Proche-Orient se sont retrouvés à Genève pour une nouvelle session de négociations visant à aboutir à un cessez-le-feu durable et à jeter les bases d'un processus de paix.</p>
<p>La délégation américaine a déclaré que des "progrès significatifs" avaient été réalisés dans les discussions préliminaires, sans toutefois donner plus de détails.</p>
<h2>Un contexte diplomatique délicat</h2>
<p>Ces négociations interviennent dans un contexte particulièrement complexe, marqué par des tensions persistantes sur le terrain et des divergences profondes entre les parties sur les conditions d'un accord.</p>
<p>Le secrétaire général des Nations unies a appelé toutes les parties à "saisir cette fenêtre d'opportunité rare".</p>`,
      image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
      imageCaption: "La salle de conférence des Nations unies à Genève.",
      imageCredit: 'AFP',
      badge: 'REPORTAGE',
      categoryId: catInt.id,
      authorId: marie.id,
      featured: true,
      views: 4400,
      daysAgo: 22,
    },
    {
      title: "Exposition universelle 2030 : Paris officiellement désignée ville hôte",
      slug: 'expo-universelle-2030-paris-ville-hote',
      excerpt: "Le Bureau international des expositions a choisi Paris pour accueillir l'Exposition universelle 2030.",
      content: `<p>Le Bureau international des expositions (BIE) a officiellement désigné Paris comme ville hôte de l'Exposition universelle 2030. La capitale française l'a emporté face à des candidatures de Riyad, Busan et Rome.</p>
<p>L'événement, dont le thème sera "Les Voix pour la Planète", devrait accueillir plus de 80 millions de visiteurs sur six mois et générer plusieurs milliards d'euros de retombées économiques.</p>
<h2>Un projet d'envergure</h2>
<p>Les différents pavillons nationaux seront construits sur un site de 400 hectares dans la plaine de France. Le projet prévoit également la création de nouvelles infrastructures de transport.</p>`,
      image: 'https://images.unsplash.com/photo-1431274172761-fcdab704f78c?w=800&q=80',
      imageCaption: "La Tour Eiffel, symbole de Paris candidate à l'Expo 2030.",
      imageCredit: 'Christophe Boisvieux / Corbis',
      badge: null,
      categoryId: catInt.id,
      authorId: marie.id,
      featured: false,
      views: 1650,
      daysAgo: 23,
    },
    {
      title: "Élections municipales : les résultats du premier tour surprise",
      slug: 'elections-municipales-premier-tour-resultats',
      excerpt: "Les résultats du premier tour des élections municipales partielles révèlent une fragmentation du paysage politique.",
      content: `<p>Les résultats du premier tour des élections municipales partielles dans une quinzaine de communes ont confirmé la fragmentation du paysage politique français.</p>
<p>Dans plusieurs villes importantes, aucun candidat n'a réussi à dépasser la barre des 30%, annonçant des triangulaires ou quadrangulaires inédites au second tour.</p>
<h2>La gauche en tête dans les grandes villes</h2>
<p>Dans les grandes métropoles, les candidats de gauche ont globalement maintenu leurs positions, bénéficiant d'un fort ancrage local et d'une mobilisation électorale solide.</p>`,
      image: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&q=80',
      imageCaption: "Bureau de vote lors du premier tour des élections municipales.",
      imageCredit: 'Charly Triballeau / AFP',
      badge: null,
      categoryId: catPol.id,
      authorId: jean.id,
      featured: false,
      views: 2200,
      daysAgo: 24,
    },
    {
      title: "Santé mentale : la dépression touche désormais 15% des Français",
      slug: 'sante-mentale-depression-france',
      excerpt: "Une nouvelle étude révèle une hausse alarmante des troubles dépressifs en France, particulièrement chez les 18-35 ans.",
      content: `<p>Selon une étude publiée par Santé publique France, 15% de la population française souffre actuellement d'un trouble dépressif caractérisé, soit une augmentation de 4 points par rapport à 2020.</p>
<p>Cette hausse est particulièrement marquée chez les jeunes adultes de 18 à 35 ans, dont le taux de prévalence atteint 23%.</p>
<h2>Des causes multiples</h2>
<p>Les experts pointent une combinaison de facteurs : l'anxiété liée au contexte géopolitique et climatique, la précarité économique, et l'impact des réseaux sociaux sur l'image de soi.</p>
<p>Le gouvernement a annoncé un plan de renforcement de l'offre de soins en santé mentale, avec la création de 3 000 postes de psychologues conventionnés.</p>`,
      image: 'https://images.unsplash.com/photo-1510832842230-87253f48d74f?w=800&q=80',
      imageCaption: "Consultation en cabinet de psychologie.",
      imageCredit: 'Shutterstock',
      badge: 'ENQUETE',
      categoryId: catSoc.id,
      authorId: jean.id,
      featured: false,
      views: 3450,
      daysAgo: 25,
    },
    {
      title: "Rolland Garros 2026 : Alcaraz sacré pour la troisième année consécutive",
      slug: 'roland-garros-2026-alcaraz-sacre',
      excerpt: "L'Espagnol Carlos Alcaraz a dominé la finale face au Grec Stefanos Tsitsipas pour remporter son troisième Roland-Garros.",
      content: `<p>Carlos Alcaraz a remporté son troisième Roland-Garros consécutif en dominant le Grec Stefanos Tsitsipas en quatre sets (6-3, 6-7, 7-5, 6-1) lors d'une finale de haute voltige.</p>
<p>À 23 ans, l'Espagnol confirme sa domination sur la terre battue et s'inscrit dans la lignée des plus grands champions de ce tournoi.</p>
<h2>Une finale de haut niveau</h2>
<p>La finale a été marquée par un second set de très haute qualité, avec de nombreux échanges longs et spectaculaires. Tsitsipas a réussi à arracher ce set au tie-break après une heure et vingt minutes de jeu.</p>`,
      image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80',
      imageCaption: "Carlos Alcaraz soulève son troisième trophée Roland-Garros.",
      imageCredit: 'Thomas Samson / AFP',
      badge: null,
      categoryId: catSport.id,
      authorId: jean.id,
      featured: false,
      views: 4100,
      daysAgo: 26,
    },
    {
      title: "Musique : le retour surprise d'Adele avec un album folk",
      slug: 'musique-retour-adele-album-folk',
      excerpt: "La star britannique revient avec un album acoustique inattendu qui marque une rupture avec son style habituel.",
      content: `<p>Adele a créé la surprise en annonçant la sortie d'un album acoustique folk, rupture avec les grandes ballades orchestrées qui ont fait sa renommée. L'album, sobrement intitulé "Roots", est disponible depuis ce matin sur toutes les plateformes de streaming.</p>
<p>L'artiste britannique s'est entourée de musiciens traditionnels irlandais et gallois pour enregistrer cet album dans une grange du Pays de Galles.</p>
<h2>Une prise de risque artistique</h2>
<p>La chanteuse explique dans un communiqué que ce projet lui tenait à cœur depuis des années. "J'avais envie de revenir à une musique plus dépouillée, plus intime, loin des grandes productions."</p>`,
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
      imageCaption: "Adele lors de la séance photo pour son nouvel album.",
      imageCredit: 'Columbia Records',
      badge: null,
      categoryId: catCul.id,
      authorId: marie.id,
      featured: false,
      views: 5600,
      daysAgo: 27,
    },
    {
      title: "Nucléaire : EDF lance la construction de six nouveaux réacteurs EPR2",
      slug: 'nucleaire-edf-construction-epr2',
      excerpt: "Le premier coup de pioche pour les nouveaux réacteurs nucléaires a été donné à Penly, en Normandie.",
      content: `<p>EDF a officiellement lancé la construction de ses six nouveaux réacteurs nucléaires EPR2 avec le premier coup de pioche du chantier de Penly, en Normandie. Le projet représente un investissement total de 52 milliards d'euros.</p>
<p>Ces nouvelles centrales devront permettre à la France de maintenir sa capacité de production nucléaire alors que les vieux réacteurs arrivent en fin de vie dans les années 2030.</p>
<h2>Un chantier de grande envergure</h2>
<p>Le chantier de Penly emploiera jusqu'à 8 000 travailleurs au pic de construction, prévue pour 2027-2030. La première tranche devrait être mise en service avant 2035.</p>`,
      image: 'https://images.unsplash.com/photo-1615109398623-88346a601842?w=800&q=80',
      imageCaption: "Centrale nucléaire de Penly, en Seine-Maritime.",
      imageCredit: 'EDF Médiathèque',
      badge: null,
      categoryId: catEco.id,
      authorId: paul.id,
      featured: false,
      views: 2780,
      daysAgo: 28,
    },
    {
      title: "Jeux olympiques 2028 : la France envoie sa plus grande délégation à Los Angeles",
      slug: 'jeux-olympiques-2028-france-delegation-los-angeles',
      excerpt: "Le Comité national olympique a annoncé une délégation record de 450 athlètes pour les Jeux de Los Angeles.",
      content: `<p>Le Comité national olympique et sportif français (CNOSF) a annoncé une délégation de 450 athlètes pour les Jeux olympiques de Los Angeles 2028, la plus importante de l'histoire de la participation française aux Jeux d'été.</p>
<p>Fort du succès des Jeux de Paris 2024, la France vise un objectif de 35 médailles dont au moins 10 en or.</p>
<h2>Les sports phares</h2>
<p>La natation, la judo et l'escrime constitueront les principaux viviers de médailles français. Des espoirs sont également nourris en athlétisme, en cyclisme et en rugby à sept.</p>`,
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
      imageCaption: "Le drapeau français lors de la cérémonie d'ouverture des JO de Paris 2024.",
      imageCredit: 'Loic Venance / AFP',
      badge: null,
      categoryId: catSport.id,
      authorId: jean.id,
      featured: false,
      views: 1480,
      daysAgo: 29,
    },
    {
      title: "Littérature : le prix Goncourt attribué à une romancière de 29 ans",
      slug: 'prix-goncourt-romanciere-29-ans',
      excerpt: "Camille Marchand remporte le Goncourt pour son premier roman, une œuvre sur l'exil et l'identité.",
      content: `<p>Camille Marchand, 29 ans, a remporté le prix Goncourt pour son premier roman "La Terre des absents", publié aux éditions Gallimard. C'est l'une des plus jeunes lauréates de l'histoire du prix.</p>
<p>Le roman raconte le destin d'une famille franco-algérienne sur quatre générations, de la guerre d'Algérie à nos jours. L'académie a salué "une écriture d'une maturité et d'une puissance rares".</p>
<h2>Un parcours atypique</h2>
<p>Camille Marchand, fille d'un ouvrier et d'une institutrice, a grandi à Roubaix. Elle a écrit ce roman pendant sa thèse de doctorat en histoire coloniale.</p>`,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
      imageCaption: "Camille Marchand lors de la remise du Prix Goncourt au restaurant Drouant.",
      imageCredit: 'Bertrand Guay / AFP',
      badge: null,
      categoryId: catCul.id,
      authorId: marie.id,
      featured: false,
      views: 1890,
      daysAgo: 30,
    },
  ];

  for (let i = 0; i < articlesData.length; i++) {
    const d = articlesData[i];
    const publishedAt = new Date(now.getTime() - d.daysAgo * 24 * 60 * 60 * 1000);
    const readingTime = Math.ceil(d.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200);
    await prisma.article.upsert({
      where: { slug: d.slug },
      update: {},
      create: {
        title: d.title,
        slug: d.slug,
        excerpt: d.excerpt,
        content: d.content,
        image: d.image,
        imageCaption: d.imageCaption,
        imageCredit: d.imageCredit,
        badge: d.badge,
        status: 'published',
        featured: d.featured,
        views: d.views,
        readingTime,
        createdAt: publishedAt,
        updatedAt: publishedAt,
        authorId: d.authorId,
        categoryId: d.categoryId,
      },
    });
  }
  console.log(`${articlesData.length} articles created`);

  // Newsletter subscribers
  await prisma.newsletter.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: { email: 'test@example.com', subscribed: true, token: crypto.randomUUID() },
  });

  console.log('Seed done!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
