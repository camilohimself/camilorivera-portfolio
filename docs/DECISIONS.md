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
