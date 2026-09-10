# Décisions du portfolio

## 10 septembre 2026 — Refonte éditoriale et navigation mobile

- **Contexte** : nouvelle version du site personnel et du portfolio, avec carte blanche créative et priorité au défilement, aux animations, aux contrastes et au confort mobile.
- **Décision** : fond ivoire pour la collection, noir pour l’atelier, accent terre rouge pour les repères. Conservation des polices locales Cormorant Garamond et DM Sans, des images originales et des identifiants partagés `#oeuvre/<slug>`.
- **Pourquoi** : donner de l’espace aux œuvres, rendre le parcours lisible au pouce et faire du défilement une expérience progressive autour de la matière picturale.
- **Mouvement** : dévoilement des œuvres, déplacement léger de la toile d’accueil, séquence de matière fixe pendant une portion du défilement. Respect du réglage système de réduction des animations et commande de réduction persistante. Le défilement reste celui du navigateur.
- **Collection** : `works.json` reste la source des titres, de l’ordre et des métadonnées. Le filtre initial réunit peintures et encres ; les photographies sont accessibles dans le filtre atelier. Affichage par lots de douze, avec accès à l’ensemble de chaque catégorie dans la visionneuse. Les métadonnées inconnues restent absentes.
- **Visionneuse** : dialogue natif, retour du focus et de la position de lecture, navigation au clavier et par glissement tactile, zoom avec déplacement de l’image, liens de partage et de prise de contact propres à chaque œuvre.
- **Langues** : français par défaut et traduction anglaise de l’interface. Les titres d’œuvres restent ceux du catalogue. La préférence de langue est locale au navigateur.
- **Écarté** : nouvelle dépendance, curseur artificiel, vidéo téléchargée au premier affichage, chargement initial des 115 images et déclenchement automatique d’une publication.
- **Branche** : `version-astra`, nom demandé explicitement.
- **Tranché par** : mandat créatif de Camilo pour cette refonte ; mise en œuvre sur la branche de travail.

## 10 septembre 2026 — Œuvre d’accueil

- **Contexte et décision** : à la demande explicite de Camilo, « Abstrait 996 » devient l’œuvre mise en valeur à l’accueil.
- **Mise en œuvre** : image `IMG_0586.webp` et variantes locales, proportions originales de 1200 × 1231 pixels, légende et lien direct correspondants. L’image d’aperçu du site reprend également cette œuvre.
- **Branche** : `version-astra`.
- **Tranché par** : Camilo.

## 10 septembre 2026 — Film du geste à l’encre

- **Contexte** : Camilo fournit « VIDEO 1 .mp4 » et demande une intégration immersive, optimisée pour le mobile et obligatoirement silencieuse, avec liberté de recadrage.
- **Décision** : le film remplace la photographie de matière entre la collection et la présentation de l’atelier. Le titre « Tout commence par un geste. » accompagne le passage des œuvres terminées à leur création. « Abstrait 996 » reste l’œuvre d’accueil.
- **Composition** : fond sombre, texte et film côte à côte sur ordinateur ; texte au-dessus et commande au-dessous du film sur téléphone. Le cadre s’ouvre progressivement au défilement, sans texte superposé au dessin. Sur écran peu haut, la section reprend une hauteur naturelle pour garder toutes les commandes accessibles.
- **Média** : suppression des bandes noires par un recadrage fixe de 1080 × 1216 pixels, centré verticalement. Conservation des 21,3 secondes. Deux fichiers H.264 à 30 images par seconde, en 540 × 608 et 900 × 1014 pixels, avec index de lecture au début du fichier. La piste audio est supprimée ; les propriétés de lecture imposent aussi le silence et la lecture dans la page.
- **Chargement** : aucun fichier vidéo au premier affichage. Sélection d’une seule taille au premier démarrage ; pas de nouveau téléchargement lors d’une rotation d’écran. Pause hors champ, en arrière-plan et derrière la visionneuse.
- **Choix de visite** : pause explicite conservée pendant la visite. En mouvement réduit, économie de données ou connexion annoncée en 2G, l’image de repli reste fixe jusqu’à une demande de lecture. Une erreur de chargement conserve cette image et permet de réessayer. Interface et description disponibles en français et anglais.
- **Pourquoi** : mettre en valeur le processus de création, préserver le dessin sur les petits écrans et limiter le coût réseau et les décodages inutiles.
- **Écarté** : lecteur tiers, nouvelle dépendance, piste audio simplement masquée, lecture imposée aux visiteurs ayant choisi de réduire les animations et recadrage plein écran coupant la figure sur ordinateur.
- **Branche** : `version-astra`.
- **Tranché par** : demande et liberté créative accordées par Camilo ; composition et préparation des médias sur la branche de travail.

## 10 septembre 2026 — Journal d’artiste et pages reliées

- **Contexte** : Camilo souhaite un journal intime, un assemblage de pages, d’affiches et de photographies, comme un journal déchiré de peintre. Il fournit ses archives et autorise explicitement la création de pages et de maillage interne.
- **Décision** : créer un sommaire et quatre chapitres autonomes : les carnets, la matière, les caves et les traces. L’accueil devient une porte d’entrée composée de papiers superposés, tout en gardant Abstrait 996 comme œuvre principale. La collection existante reste accessible.
- **Composition** : ivoire et papier quadrillé pour les traces d’exposition, ocre pour certaines pages de carnet, noir pour les films et les caves. Les feuilles, photographies et peintures ont des proportions et des positions variées. Les grands titres, les marges, les bandes de papier et les changements de fond rythment le parcours. Le défilement reste natif.
- **Liens** : navigation principale et mobile, sommaire, chapitre précédent et suivant, renvois des peintures aux caves et retour vers la collection filtrée. Chaque image agrandie du journal possède un lien `#fragment/<identifiant>` dans sa page.
- **Archives** : 41 sources conservées en lecture seule, réparties en 12 images de carnets, 20 peintures, 4 photographies des caves et 5 traces personnelles. Création de 117 fichiers WebP en comptant les variantes. Conversion des profils colorimétriques des photographies vers sRGB avant export. Les deux petites images de 150 et 320 pixels restent de petits fragments et ne sont pas agrandies artificiellement.
- **Informations confirmées** : exploration avec le photographe David Zuber dans les anciennes caves Provins à St-Léonard, bâtiment aujourd’hui détruit. L’hommage reprend le sens donné par Camilo : Alban Reynard a inspiré ce projet fou. Aucun décès ni aucune date de prise de vue n’est déduit. L’affiche atteste l’exposition de Camilo Rivera et Sabine Leyat Filliez à La Tour Lombarde, à St-Séverin / Conthey, du 2 juin au 2 juillet 2017. Les autres dates et titres inconnus ne sont pas inventés.
- **Films** : deux séquences supplémentaires dans les carnets, avec suppression des pistes audio. La première est arrêtée à 32,6 secondes, avant son carton final ; la seconde dure 16,83 secondes. Deux tailles par film, à 30 images par seconde, avec démarrage progressif. Le lecteur existant est partagé avec l’accueil, pour conserver une seule gestion de la pause, du mouvement réduit, du réseau et de la visibilité.
- **Lecture** : interface française et anglaise, préférences conservées entre les pages, agrandissement accessible au clavier et au doigt, retour à la même position après fermeture. Les titres, les liens et les images restent utilisables sans script. La position de lecture est enregistrée dans l’historique avant de verrouiller l’arrière-plan de la visionneuse.
- **Écarté** : dates reconstituées, nouveaux titres d’œuvres, téléchargement de toutes les archives à l’accueil, modification des fichiers sources, nouvelle dépendance et publication automatique.
- **Branche** : `version-astra`.
- **Tranché par** : liberté créative et création de pages autorisées par Camilo ; composition et navigation élaborées dans ce cadre.
