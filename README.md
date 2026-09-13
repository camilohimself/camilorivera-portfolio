# Camilo Rivera — portfolio

Site personnel de Camilo Rivera, artiste peintre à Bramois, Valais.

Le site s’ouvre dans une encre bleue en mouvement, accompagnée de photographies personnelles. Le nouveau chapitre **Hors cadre** rapproche 84 archives : souvenirs, ateliers, écriture, lieux et cinq suites d’états de peinture à parcourir au doigt. Les photographies intimes se fondent dans une surface allant du papier à l’ombre : fragments agrandis, recadrés et partiellement hors écran. Une seconde encre animée devient un paysage en négatif. Les huit pages restent bilingues. La collection comprend 29 peintures, 26 encres et 60 photographies d’atelier ; le journal réunit maintenant 213 archives, dont les 73 fragments de la réserve et quinze feuilles de carnet photographiées le 13 septembre 2026.

Les deux nouveaux fonds vidéo sont recadrés et déformés avant encodage, en versions portrait et paysage, silencieuses. L’accueil affiche d’abord son image fixe, puis autorise la lecture 900 ms après le chargement de la page. La lecture automatique respecte le mouvement réduit et l’économie de données. Les lecteurs s’arrêtent hors écran, en arrière-plan et derrière la visionneuse ; les choix explicites de pause persistent pendant la visite.

Les 85 originaux de `PROJECT CAMILO2` restent hors du site et intacts. La photographie de chiffres raturés (`hc-75`) a été écartée à la demande de Camilo. Les 84 images retenues donnent 247 exports WebP, variantes comprises, pour 33,4 Mo ; les grandes images seules passent de 146,9 à 20,9 Mo. L’intégralité des petites variantes représente 3,30 Mo, chargés progressivement selon les cadres visités. Les vidéos mobiles pèsent 779 225 et 1 657 678 octets. Voir `docs/HORS-CADRE.md` pour la cartographie et les choix de production.

Les galeries forment des accrochages irréguliers : grands changements d’échelle, superpositions, rotations et passages du noir au rouge. Les images agrandies restent accessibles dans leurs proportions complètes.

Les autres pages du journal prolongent désormais les souvenirs par des traitements distincts : distances et silence dans les caves, écriture en marge des carnets, détail puis peinture entière, documents publics lisibles et présences personnelles décentrées. Le sommaire s’ouvre sur un fragment choisi et une citation de Camilo. Trois associations facultatives précèdent les 73 fragments de la réserve ; trois liens visuels font revenir les mains, les silhouettes et les reflets entre les pages. Aucune nouvelle image, vidéo ou dépendance de production. Voir `docs/REVERIE.md`.

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
- `journal/index.html` : fragment éditorial choisi, citation de Camilo et sommaire des six chapitres.
- `journal/carnets/index.html` : douze archives de carnets, quinze feuilles d’un même matin (13 septembre 2026) présentées en vingt pièces, dont cinq reprises agrandies, saturées, retournées ou en négatif par CSS uniquement, trois figures et deux films du geste.
- `journal/matieres/index.html` : vingt archives de peinture et trois photographies de pigments et d’outils.
- `journal/les-caves/index.html` : quatre photographies des anciennes caves Provins à St-Léonard, créditées à David Zuber, et hommage à Alban Reynard.
- `journal/traces/index.html` : cinq archives personnelles, dont l’affiche de La Tour Lombarde de 2017, et trois nouveaux fragments d’exposition.
- `journal/reserves/index.html` : les 73 nouvelles images, regroupées en figures, atelier, expositions et à-côtés ; liens directs et ouverture progressive par lots de seize.
- `journal/archives.json` : inventaire des sources, variantes, descriptions françaises et anglaises et crédits connus.
- `journal/hors-cadre/index.html` : nouveau chapitre, 85 liens d’archives présents sans JavaScript, cinq suites horizontales natives et dix-neuf feuilles supplémentaires dans un ensemble dépliable.
- `journal/hors-cadre/selection.json` et `media.json` : choix éditoriaux, correspondance avec les originaux, recadrages, descriptions FR/EN, crédit de la référence et dimensions des exports.
- `css/art-digital.css` et `js/art-digital.js` : ouverture de l’accueil, compositions de Hors cadre, zoom d’ambiance et commandes des suites de peinture. Ces deux fichiers ne sont chargés que par l’accueil et par Hors cadre.
- `css/reverie.css` : compositions propres aux six autres pages du journal, distance, marges, changements d’échelle et échos entre chapitres.
- `tools/prepare-hors-cadre.mjs` : préparation reproductible depuis le dossier original, avec ImageMagick, cwebp et FFmpeg. Aucun de ces outils n’est nécessaire au site publié. Les quatre films et leurs quatre images de repli déjà présents sont conservés tels quels ; le drapeau `--reencode-video` force leur réencodage.
- `tools/verify-hors-cadre.mjs` et `tools/verify-reverie.mjs` : parcours de navigateur facultatifs, l’un pour l’accueil et Hors cadre, l’autre pour les six pages du journal.
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

Les six chapitres se lisent dans l’ordre annoncé par le sommaire : chacun porte une page précédente et une page suivante, des carnets à Hors cadre, qui ne boucle pas sur le premier mais ouvre la sortie vers la collection. L’accueil se termine sur un passage vers le journal, et Hors cadre renvoie vers les chapitres qui y conduisent. Ils sont aussi reliés par le sommaire, et des liens vers la collection avec sa sélection déjà active : `?collection=paintings#gallery`, `?collection=encres#gallery` et `?collection=shooting#gallery`. Les photos du journal ont une adresse propre dans leur chapitre : `#fragment/<identifiant>`. Le bouton de copie conserve l’adresse de la version consultée, y compris pour un aperçu local. Les pages et les images restent accessibles sans JavaScript.

Les préférences de langue et de mouvement sont mémorisées localement. Si ce stockage est bloqué, le site continue de fonctionner. Le réglage système de réduction des animations est prioritaire.

Le film du geste reste entre la collection et la présentation de l’atelier, à l’ancre `#geste`. Les lecteurs démarrent automatiquement en silence lorsqu’au moins un quart de leur cadre est visible. Une lecture volontaire reste active tant qu’une partie du cadre est visible. Ils se mettent en pause hors écran, dans un onglet masqué ou derrière la visionneuse. Le bouton de pause conserve le choix pendant la visite. Avec une préférence de mouvement réduit, une économie de données ou un réseau annoncé en 2G, une image reste affichée et la lecture attend un geste volontaire. Le fichier mobile est également utilisé sur un réseau annoncé en 3G. Aucun changement de fichier en cours de lecture lors d’une rotation d’écran.

## Contrôles locaux

```sh
node --check js/app.js
node --check js/journal.js
node --check js/films.js
node --check js/reserve.js
node --check js/motion.js
node --check js/viewer-motion.js
node --check js/art-digital.js
node --check js/dims.generated.js
node tools/validate-portfolio.mjs
node tools/validate-journal.mjs
git diff --check
```

Les deux parcours `tools/verify-*.mjs` demandent le serveur local sur le port 8000, Chrome stable installé, et le chemin du module Playwright dans `PLAYWRIGHT_MODULE` : aucune dépendance n’est installée dans le dépôt. Le chemin `AXE_PATH` est facultatif ; sans lui, le seul groupe d’audit d’accessibilité de `verify-reverie.mjs` échoue et les douze autres passent.

Le validateur vérifie les références aux images, variantes et polices, les métadonnées du catalogue, les identifiants, les ancres et les liens locaux. Les interactions et le rendu demandent également des essais dans un navigateur.

Consulter `works.README.md` pour enrichir le catalogue et `docs/DECISIONS.md` pour les choix de cette refonte. `RAPPORT-PORTFOLIO-2026.md` décrit une version antérieure et reste un document historique.

## Publication

La configuration existante est conservée. Cette branche doit être revue avant toute fusion ou publication.
