# Camilo Rivera — portfolio

Site personnel de Camilo Rivera, artiste peintre à Bramois, Valais.

La version `version-astra` réunit une galerie bilingue et un journal d’artiste en six pages. L’accueil met en scène Abstrait 996 parmi des fragments de carnet et d’atelier, du kraft déchiré et du ciel. Le journal accueille 114 images d’archives, dont les 73 fragments de la réserve, et deux films en complément du film de l’accueil. La collection comprend 29 peintures, 26 encres et 60 photographies d’atelier.

Les galeries forment des accrochages irréguliers : grands changements d’échelle, superpositions, rotations et passages du noir au rouge. Les images agrandies restent accessibles dans leurs proportions complètes.

Des réflexions confiées par Camilo nourrissent l’accueil (« La peinture, c’est quelque chose qui ne ment jamais. »), l’ouverture des peintures et le passage des carnets consacré au geste, du poignet au corps entier. Ses formulations, répétitions et hésitations sont conservées : seules la transcription, la grammaire et la ponctuation sont corrigées. Les titres peuvent reprendre des fragments de ses phrases. L’anglais suit cette même parole.

Le parcours mobile ajoute des transitions entre chapitres comme des feuilles tirées en travers, une réponse à la pression et une visionneuse qui suit le doigt. Les filtres prennent moins de hauteur et ramènent au début du nouvel accrochage. Le mouvement réduit supprime ces effets ; les liens et le défilement gardent leur comportement natif.

## Aperçu local

Le site est statique, sans dépendance ni compilation. Depuis la racine du dépôt :

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Puis ouvrir `http://127.0.0.1:8000`. Un serveur HTTP est nécessaire pour charger `works.json`.

## Contenu

- `works.json` : titres, ordre, techniques et métadonnées du catalogue. Les identifiants existants sont permanents.
- `index.html` : structure de la page, textes français et premier contenu accessible sans script.
- `css/style.css` : couleurs, typographie locale, compositions et comportements adaptatifs.
- `js/app.js` : galerie, traduction anglaise, visionneuse, historique, préférences et effets au défilement.
- `journal/index.html` : sommaire du journal, relié aux cinq chapitres.
- `journal/carnets/index.html` : douze archives de carnets, trois nouvelles figures et deux films du geste.
- `journal/matieres/index.html` : vingt archives de peinture et trois photographies de pigments et d’outils.
- `journal/les-caves/index.html` : quatre photographies des anciennes caves Provins à St-Léonard, créditées à David Zuber, et hommage à Alban Reynard.
- `journal/traces/index.html` : cinq archives personnelles, dont l’affiche de La Tour Lombarde de 2017, et trois nouveaux fragments d’exposition.
- `journal/reserves/index.html` : les 73 nouvelles images, regroupées en figures, atelier, expositions et à-côtés ; liens directs et ouverture progressive par lots de seize.
- `journal/archives.json` : inventaire des sources, variantes, descriptions françaises et anglaises et crédits connus.
- `css/journal.css` et `js/journal.js` : compositions, langues, préférences et visionneuse des archives.
- `css/intensity.css` : matières, ciel, papiers et contrastes communs aux sept pages du site.
- `css/accrochages.css` : grands formats, collages et chevauchements des galeries, adaptés au téléphone.
- `css/motion.css` et `js/motion.js` : transitions natives entre pages, réponse des boutons au toucher, repère mobile et entrées des fragments.
- `css/viewer-motion.css` et `js/viewer-motion.js` : glissement direct, retour élastique, changement directionnel et ouverture depuis la vignette, partagés par les deux visionneuses.
- `js/reserve.js` : filtres, progression et composition de la réserve ; adresse `?regard=atelier#inventaire`, par exemple.
- `images/reserve/` : 73 images préparées pour le web et leurs variantes ; les fichiers fournis restent inchangés.
- `images/matieres/kraft-ciel.webp` : fond décoratif, distinct des œuvres et des photographies d’archives.
- `js/films.js` : lecteur silencieux commun aux trois films.
- `js/dims.generated.js` : dimensions générées des images, à conserver comme fichier généré.
- `images/` et `fonts/` : ressources locales, sans téléchargement depuis un service tiers.
- `videos/geste-encre-mobile.mp4` et `videos/geste-encre-desktop.mp4` : film de 21,3 secondes, sans piste audio, en deux tailles. L’image de repli est `images/hero/geste-encre-poster.webp`.
- `videos/deux-figures-*.mp4` et `videos/encre-en-mouvement-*.mp4` : films des carnets en deux tailles, respectivement 32,6 et 16,83 secondes, sans piste audio. Leurs images de repli sont dans `images/journal/`.

Le filtre initial présente les peintures et encres dans l’ordre du catalogue. Les photos ont leur propre filtre. Douze images sont affichées à la fois ; la visionneuse permet de parcourir toute la catégorie choisie.

Dans la réserve, 37 figures, 15 photographies d’atelier, 14 images d’exposition et 7 à-côtés se répondent. Le filtre recalcule l’accrochage à partir des seules images retenues. Sans JavaScript, les 73 liens restent présents et utilisables.

Les commandes de partage proposent l’URL canonique de l’œuvre. La prise de contact ouvre un courrier avec la référence de l’œuvre, sans l’envoyer.

Les chapitres sont reliés par un sommaire, des liens de page précédente et suivante, et des liens vers la collection avec sa sélection déjà active : `?collection=paintings#gallery`, `?collection=encres#gallery` et `?collection=shooting#gallery`. Les photos du journal ont une adresse propre dans leur chapitre : `#fragment/<identifiant>`. Le bouton de copie conserve l’adresse de la version consultée, y compris pour un aperçu local. Les pages et les images restent accessibles sans JavaScript.

Les préférences de langue et de mouvement sont mémorisées localement. Si ce stockage est bloqué, le site continue de fonctionner. Le réglage système de réduction des animations est prioritaire.

Le film se trouve entre la collection et la présentation de l’atelier, à l’ancre `#geste`. Il démarre en silence lorsqu’au moins un quart de son cadre est visible et se met en pause hors écran, dans un onglet masqué ou derrière la visionneuse. Le bouton de pause conserve le choix pendant la visite. Aucun fichier vidéo n’est demandé au premier affichage de l’accueil. Avec une préférence de mouvement réduit, une économie de données ou un réseau annoncé en 2G, une image reste affichée et la lecture attend un geste volontaire. Le fichier mobile est également utilisé sur un réseau annoncé en 3G. Aucun changement de fichier en cours de lecture lors d’une rotation d’écran.

## Contrôles locaux

```sh
node --check js/app.js
node --check js/journal.js
node --check js/films.js
node --check js/reserve.js
node --check js/motion.js
node --check js/viewer-motion.js
node tools/validate-portfolio.mjs
node tools/validate-journal.mjs
git diff --check
```

Le validateur vérifie les références aux images, variantes et polices, les métadonnées du catalogue, les identifiants, les ancres et les liens locaux. Les interactions et le rendu demandent également des essais dans un navigateur.

Consulter `works.README.md` pour enrichir le catalogue et `docs/DECISIONS.md` pour les choix de cette refonte. `RAPPORT-PORTFOLIO-2026.md` décrit une version antérieure et reste un document historique.

## Publication

La configuration existante est conservée. Cette branche doit être revue avant toute fusion ou publication.
