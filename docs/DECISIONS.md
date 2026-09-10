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
