# Camilo Rivera — Espace intérieur

Site personnel bilingue de Camilo Rivera, artiste peintre à Bramois, Valais. La branche `version-astra` transpose l’ensemble du portfolio dans l’univers V01 : contrastes blanc/noir, couleurs liquides, grandes images et parcours entre œuvres et souvenirs.

Neuf pages composent le voyage : l’accueil, la collection, le journal, les carnets, la matière, les caves, les traces, la réserve et Hors cadre. Un index commun permet de changer de chemin. Le logo `cr.` et la typographie inversée accompagnent tout le site. Une dixième page, `/confidentialite/`, hors du voyage, dit ce que le site garde sur l’appareil du visiteur ; chaque pied de page la relie, avec le crédit « Scénographie : OSOM Labs ».

## Aperçu local

Le site est statique, sans dépendance ni compilation. Depuis la racine du dépôt :

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Ouvrir `http://127.0.0.1:8000/`. Un serveur HTTP est nécessaire au chargement des inventaires JSON. Le dossier `v01/` conserve la première exploration ; l’expérience complète est maintenant à la racine.

## Contenus conservés

- `works.json` : 115 entrées, dont 29 peintures, 26 encres et 60 photographies d’atelier. Identifiants et métadonnées existants inchangés.
- `journal/archives.json` : 129 souvenirs — les 114 d’origine et les quinze feuilles de carnet photographiées le 13 septembre 2026 —, leurs variantes, descriptions françaises et anglaises et crédits connus.
- `journal/hors-cadre/media.json` : les 84 photographies personnelles de Hors cadre, avec leurs recadrages, descriptions et dimensions d’export. La photographie `hc-75` reste écartée.
- `journal/reserves/` : 73 fragments, affichés progressivement par lots de seize et filtrables par regard.
- Les textes personnels du journal, la présentation de Camilo, les photographies des caves créditées à David Zuber, l’hommage à Alban Reynard et l’affiche de La Tour Lombarde sont conservés.
- Les trois films du geste sont rejoints par le film d’espace intérieur. Les fichiers sources fournis ne sont pas modifiés.

Les valeurs inconnues du catalogue restent vides. Les œuvres ouvertes sont montrées dans leurs proportions complètes, avec accès au fichier original web. La collection propose les œuvres, peintures, encres, photos d’atelier et souvenirs par lots de dix-huit.

## Parcours de l’accueil

L’accueil alterne six temps, dans un défilement vertical natif :

1. `#entree` : le film d’espace intérieur remplit l’écran sans voile dégradé. Le nom se compose en noir et blanc au-dessus de l’image ; des ouvertures fines dans les lettres laissent le film les traverser. Au défilement, le « o » de Camilo s’agrandit jusqu’à devenir un passage, puis une coulure blanche ouvre sur les œuvres. Le bouton « Voir les œuvres » conduit directement à la sélection.
2. `#oeuvres` : cinq œuvres dans une composition plus calme, avec « Abstrait 996 » en premier, puis quatre peintures et encres.
3. `#geste` : le film original du geste à l’encre et la parole de Camilo relient les œuvres à leur fabrication.
4. `#memoire` : six fragments de mémoire, accompagnés des liens vers les chapitres correspondants. Les portes du journal sont intégrées à ce passage, sans seconde galerie des mêmes images.
5. `#about` : le portrait et la présentation de Camilo.
6. `#contact` : la conversation et les chemins pour poursuivre la visite.

L’en-tête fixe conserve le monogramme `cr.`, l’accès direct à la collection et l’index. Les visiteurs peuvent suivre le voyage ou rejoindre les œuvres à tout moment. L’ancien déplacement horizontal de la rivière d’œuvres est supprimé ; les œuvres se regardent dans le fil vertical de la page.

## Ce que la branche reprend de `main`

La fusion du 1er octobre 2026 rejoint les neuf commits publiés sur `main` entre le 10 et le 13 septembre. Le rendu d’Astra reste la référence ; les contenus de `main` y prennent place :

- **Hors cadre** (`journal/hors-cadre/`) : sixième chapitre du journal, avec ses compositions, ses deux films d’encre et ses cinq suites de peinture. La page reçoit l’en-tête, l’index, la signature `cr.`, la palette et les caractères du voyage.
- **Les quinze feuilles des cahiers** (`#feuilles` dans les carnets) : vingt pièces éparpillées dans une chambre sombre, avec les traitements de `main` (détail agrandi, saturation, retournement, négatif) ; chaque lien ouvre la feuille entière.
- **Le maillage** : chapitres numérotés sur six, accès rapide sous l’ouverture du journal, entrée 06 du sommaire, passages vers Hors cadre, échos entre chapitres, parcours « dans le rouge » de la matière, trois rapprochements avant les 73 fragments de la réserve. Les chapitres se suivent des carnets à Hors cadre, qui ouvre ensuite sur la collection.
- **Les médias** : 377 visuels réencodés depuis les originaux et le film du geste réencodé, aux mêmes dimensions.

Les titres et compositions que `main` avait réécrits pour sa version « rêverie » (petits titres, titres masqués, tailles d’images) ne sont pas repris : les blocs communs gardent le rendu d’Astra. Le détail figure dans `docs/DECISIONS.md`.

## Architecture

- `index.html` : entrée vidéo, œuvres, geste, mémoire et passages vers les chapitres, présentation et contact.
- `oeuvres/index.html` : collection complète, navigation et visionneuse.
- `journal/` : sept pages reliées, avec leurs textes, images et films.
- `css/journey.css`, `journey-space.css`, `journey-site.css` : langage visuel commun et accueil.
- `css/journey-homepage.css` : séquence de l’accueil, scène d’entrée immersive, œuvres posées et souvenirs reliés aux chapitres.
- `css/hero-immersion.css` : scène du nom, passage au défilement, coulure blanche et présentation adaptée au mouvement réduit.
- `css/journey-journal.css`, `journey-catalogue.css` : compositions des chapitres, collection et visionneuses.
- `js/chromatic.js` : champs de couleur WebGL, palettes et variations entre chapitres ; fond CSS de repli.
- `js/journey-home.js`, `journey-scroll.js` : transformations liées au défilement natif.
- `js/hero-immersion.js` : composition du nom sur un calque transparent, passage par le « o » et liaison du premier écran au défilement.
- `js/journey-nav.js` : index partagé des neuf pages.
- `js/collection.js` : filtres, progression, visionneuse, zoom, glissement, historique et liens directs.
- `js/journey-preferences.js` : langue et mouvement de la collection ; l’accueil et le journal partagent les mêmes préférences.
- `js/journal.js`, `reserve.js`, `viewer-motion.js` : interactions des souvenirs et de la réserve.
- `js/films.js` : lecture silencieuse des films du geste, mise en pause hors écran et derrière une fenêtre ouverte.
- `css/motion.css`, `js/drop.js` : transitions en gouttes entre les pages et à l’ouverture des panneaux ; `js/drop.js` est chargé sans `defer` dans l’en-tête de chaque page.
- `js/motion.js` : réponses tactiles et entrées des fragments.
- `css/privacy-drop.css`, `js/privacy-drop.js` : la goutte qui dit ce que le site garde, à la première page de la visite, et la mise en page de `/confidentialite/`.
- `<svg class="svg-defs">`, en tête de chaque page : les seize icônes au trait du site, identiques sur les dix pages. Aucune flèche ni aucun symbole n’est écrit comme caractère.
- `journal/hors-cadre/index.html`, `css/art-digital.css`, `js/art-digital.js` : Hors cadre, ses films d’encre et ses suites de peinture. `selection.json` et `media.json` tracent les choix éditoriaux et les exports.
- `css/journey-journal.css`, fin de feuille : feuilles des cahiers, passages vers Hors cadre, échos, accès rapide, parcours dans le rouge et rapprochements.

Les anciennes feuilles de composition restent dans le dépôt pour l’historique, comme `css/reverie.css`, `css/intensity.css`, `css/accrochages.css` et `js/app.js` venus de `main`. Les pages actives utilisent les nouvelles compositions ; elles n’affichent plus les décors kraft/ciel. Les parcours `tools/verify-hors-cadre.mjs` et `tools/verify-reverie.mjs` décrivent la version de `main` et ne valident plus ce rendu.

## Partage et icônes

Chaque page déclare une carte de partage propre, lue par WhatsApp, iMessage, Signal, Telegram et les réseaux : `images/partage/<page>.jpg`, JPEG de 1200 × 630 pixels, entre 46 et 88 Ko. L’image de la page est posée au centre et le titre la traverse en noir et blanc inversé, comme le nom traverse le film à l’accueil ; le centre reste lisible quand une application recadre l’aperçu en carré. Les balises `og:image:width`, `og:image:height`, `og:image:type`, `og:image:alt` et `og:site_name` accompagnent la carte. `tools/generate-share-cards.mjs` la régénère (Playwright indiqué par `PLAYWRIGHT_MODULE`, rien n’est installé dans le dépôt).

Le favicon reprend le monogramme `cr.` de l’en-tête, tracé depuis `fonts/dm-sans-400.woff2` avec le même interlettrage : `favicon.svg` (inversé en mode sombre), `favicon.ico` (16, 32 et 48 pixels) et `apple-touch-icon.png` (180 pixels). `tools/generate-icons.py` les régénère (fontTools, brotli et ImageMagick du poste).

Une application peut garder l’ancien aperçu d’une adresse déjà partagée pendant un temps ; les nouveaux partages lisent les nouvelles balises.

## Navigation et mouvement

L’index, les liens entre chapitres et les retours vers la collection permettent une lecture libre. Les adresses `?collection=paintings#gallery`, `?collection=encres#gallery`, `?collection=shooting#gallery` et `?collection=memories#gallery` sélectionnent la collection. Les œuvres et souvenirs ont des liens directs. Les anciens liens de l’accueil restent pris en charge : `#mouvement` rejoint désormais l’entrée vidéo, `#gallery` les œuvres, `#journal` et `#hors-cadre` la mémoire, `#seuil` le contact. La réserve conserve `?regard=atelier#inventaire`.

Les préférences FR/EN et de mouvement sont mémorisées localement (`cr-language`, `cr-motion`) quand le visiteur les change, jamais au chargement. Avec « Ne rien garder », elles ne vivent que dans l’onglet (stockage de session). La réponse au message de confidentialité est gardée dans `cr-notice`. Le réglage système de réduction des animations est prioritaire.

Chaque page s’ouvre dans une goutte née au point du clic et se referme vers lui au retour ; l’index, les visionneuses et la collection de l’accueil font de même depuis leur bouton. Pour passer ce point d’une page à l’autre, `js/drop.js` écrit au départ une seule clé de session, `cr-drop` (position relative du geste, heure, sens), et la supprime à l’arrivée ; le point d’ouverture d’une page reste ensuite attaché à son entrée d’historique. En mouvement réduit, un fondu de 180 ms remplace la goutte. Détails dans `docs/DECISIONS.md`. Les champs liquides se stabilisent au repos et s’arrêtent hors écran, dans un onglet masqué ou derrière une fenêtre. Le défilement reste natif.

L’entrée reste temporairement ancrée à l’écran pendant le passage à travers le nom ; avancer ou remonter dans la page fait évoluer la même composition. Le monogramme `cr.`, les commandes du film et l’accès aux œuvres restent disponibles. Le nom dessiné sur canvas complète un véritable titre `h1`, conservé pour l’accessibilité et comme repli si le rendu n’est pas disponible. Le calque transparent révèle la vidéo existante sans second lecteur ni second décodage. En mouvement réduit, l’entrée occupe un seul écran et la transformation liée au défilement disparaît. Ce travail concerne uniquement l’entrée de l’accueil : ordre des sections, catalogue et photographies de souvenirs restent inchangés.

Les films se lancent sans son lorsqu’ils entrent dans l’écran. Le film d’espace intérieur occupe tout le fond du premier écran et démarre à l’arrivée : un clic sur la vidéo ou sa commande permet de le mettre en pause et de le relancer. Une pause volontaire est conservée pendant la visite, même après un aller-retour dans la page. En mouvement réduit ou économie de données, la lecture attend un geste volontaire.

La vidéo d’entrée dispose de deux fichiers adaptés à l’écran : `videos/espace-interieur-desktop.mp4` (740 × 1000 pixels, 3 800 047 octets) et `videos/espace-interieur-mobile.mp4` (540 × 730 pixels, 1 848 689 octets). La source est affectée à la première lecture. Ces versions conservent les 313 images à 24 images par seconde, les 13,041667 secondes et la piste audio du fichier fourni ; le lecteur impose le silence. Les originaux restent inchangés.

Les commandes de contact ouvrent un courrier avec la référence sans l’envoyer. Les liens des images et des chapitres restent utilisables sans JavaScript ; les fonds CSS remplacent WebGL si nécessaire.

## Contrôles locaux

```sh
node tools/validate-portfolio.mjs
node tools/validate-journal.mjs
node --check js/chromatic.js
node --check js/collection.js
node --check js/journey-home.js
node --check js/hero-immersion.js
node --check js/journey-nav.js
node --check js/journey-scroll.js
node --check js/journey-preferences.js
node --check js/films.js
node --check js/motion.js
node --check js/drop.js
node --check js/art-digital.js
git diff --check
```

Les validateurs contrôlent les inventaires, ressources, identifiants et liens locaux. Les interactions et le rendu doivent également être examinés dans un navigateur. Les essais réellement exécutés et leurs limites figurent dans `docs/VERIFICATION.md` ; les choix de conception dans `docs/DECISIONS.md`.

Consulter `works.README.md` pour enrichir le catalogue. `RAPPORT-PORTFOLIO-2026.md` documente une version antérieure.

## Publication

Travail local sur `version-astra`, qui contient désormais `main`. Aucun envoi, fusion vers `main` ou déploiement n’est effectué par cette intégration.
