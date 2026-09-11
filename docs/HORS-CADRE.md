# Hors cadre — 11 septembre 2026

Travail local sur `codex/art-digital`, à partir de `8f6b0d3`. Aucune fusion, aucun push et aucune publication.

## Direction

L’encre devient un espace dans lequel entrent les archives. L’accueil remplace le décor de kraft et de ciel par un très gros plan animé de l’encre bleue fournie par Camilo. Les photographies de reflet et de souvenir restent des objets distincts, à ouvrir. La phrase d’accueil de Camilo est conservée.

Une nouvelle porte « Hors cadre » associe la main tachée et le visage barré. Le nouveau chapitre alterne des pages ivoire, des salles sombres et une surface vert pâle pour les états de peinture. L’écriture et les dessins proviennent des vraies archives ; aucune photographie ou écriture de remplacement n’a été générée.

Après le retour de Camilo, la section des visages abandonne le collage et le titre explicatif. « par bribes » devient un passage de souvenirs : neuf images mêlées au fond par des masques progressifs et des modes de fusion, zooms et cadrages décentrés. La composition mobile possède ses propres placements ; aucun mouvement, script, média ou filtre animé supplémentaire. Les liens, les descriptions bilingues et la visionneuse entière restent disponibles, avec un focus clavier non masqué. Les légendes ne s’affichent plus dans cette surface.

## Cartographie

L’accueil conduit directement à `/journal/hors-cadre/`. Le sommaire du journal possède une sixième entrée. Les carnets renvoient à l’encre en mouvement ; la matière aux cinq suites de peinture ; les traces aux visages ; les caves aux lieux ; la réserve au nouveau chapitre.

Dans Hors cadre :

- Ouverture : souvenir, reflet et visage dessiné.
- Les visages / par bribes : neuf photographies personnelles fondues dans un paysage de souvenirs.
- L’atelier : mains tachées, outils, table et peinture.
- L’écriture : carnet de figures à l’encre ; la photographie de chiffres raturés a été retirée.
- Le trait déborde : seconde encre en mouvement, en très gros plan et en négatif.
- Métamorphoses : cinq suites, 41 vues au total ; 8 gris, 5 bleus, 11 vues du ciel, 10 du passage et 7 éclats.
- Ailleurs : espace industriel, expositions, couloir, référence visuelle et reflet dans l’eau.
- Feuilles libres : 19 autres dessins, peintures et photographies, dans un ensemble dépliable.

Les 84 images retenues gardent leur identifiant `hc-01` à `hc-85`, sauf `hc-75`, sans renumérotation des liens existants. Chacune possède un lien `#fragment/hc-XX`, une description et une légende dans les deux langues. Les sources, dimensions et recadrages sont dans `journal/hors-cadre/media.json`. Les noms des suites sont éditoriaux, pas de nouveaux titres d’œuvres. Les dates et liens familiaux individuels non confirmés ne sont pas inventés. La référence issue d’Instagram reprend le compte visible dans la capture fournie, sans attribuer l’image à Camilo.

`IMG_1807.HEIC` (`hc-75`, chiffres et hachures sur papier quadrillé) est exclue de la page, de la sélection et du manifeste. Ses trois WebP sont retirés du site ; l’original source et l’historique Git permettent de les retrouver. L’outil de préparation suit la sélection et ne la réexportera donc plus.

## Images

Les originaux HEIC, JPEG et PNG du dossier fourni restent intacts. Les fichiers du site sont préparés directement depuis eux : orientation corrigée, conversion sRGB, métadonnées supprimées, intermédiaire PNG sans perte puis WebP q80. Largeur maximale 1600 px et hauteur maximale 1800 px, sans agrandissement. Variantes de 480 et 900 px lorsque la taille source le permet. Les interfaces de téléphone sont retirées des deux captures qui en contiennent.

| Ensemble | Octets |
| --- | ---: |
| 84 originaux retenus | 146 941 379 |
| 84 grandes images WebP | 20 871 076 |
| Grandes images et variantes, 247 fichiers | 33 436 062 |
| Une petite variante par image | 3 295 260 |

Les grandes images sont donc environ 86 % plus légères. Toutes les variantes ne sont pas téléchargées : `srcset` et `sizes` laissent le navigateur choisir. Le chargement est différé sous le premier écran ; les ensembles fermés restent légers. Les images de peinture et la visionneuse montrent les proportions complètes. Quelques cadrages de couverture utilisent `object-fit: cover`, avec accès à l’image entière.

## Vidéos

Deux crops propres à chaque écran sont réalisés dans les films source, suivis d’une déformation optique fixe (`lenscorrection`, k1 −0,19 et k2 0,06). Le navigateur ne calcule pas de distorsion WebGL. Un zoom CSS facultatif permet d’approcher davantage ; le déplacement au défilement est borné et mis à jour uniquement lorsqu’une scène est visible.

| Vidéo | Version | Dimensions | Durée | Octets |
| --- | --- | --- | --- | ---: |
| Encre bleue | Mobile | 432 × 720 | 10,04 s | 779 225 |
| Encre bleue | Ordinateur | 960 × 600 | 10,04 s | 1 475 431 |
| Encre noire | Mobile | 432 × 720 | 20 s | 1 657 678 |
| Encre noire | Ordinateur | 960 × 600 | 20 s | 2 573 087 |

Chaque fichier comporte une seule piste H.264, 24 images/s, format yuv420p, index `moov` avant `mdat`. Aucune piste audio ni image de couverture embarquée. Les deux versions mobiles réunies pèsent 2,44 Mo, contre 39,24 Mo pour les deux sources, soit environ 94 % de moins. Quatre posters WebP prennent le relais lorsque la lecture n’est pas disponible ou désirée.

Le chargement de l’accueil privilégie les images et le texte, puis attend 900 ms après l’événement `load` avant d’autoriser l’autoplay. Une action volontaire peut démarrer avant. Le choix de fichier est conservé après rotation ; les préférences de mouvement et de réseau, la visibilité du document, la visionneuse et la pause manuelle restent prioritaires. La reprise après erreur réinitialise le lecteur et ignore les anciennes promesses de lecture.

## Reproduction

Depuis `site-web`, avec ImageMagick, cwebp et FFmpeg disponibles :

```sh
node tools/prepare-hors-cadre.mjs '../PROJECT CAMILO2'
```

Les images déjà préparées sont conservées. `--reencode-video` recrée les quatre dérivés vidéo et leurs posters depuis les deux sources. Les outils de préparation ne sont pas des dépendances de production : le site reste statique.

Les validations structurelles sont celles du README. La suite `tools/verify-hors-cadre.mjs` attend un serveur local sur le port 8000, un module Playwright accessible via `PLAYWRIGHT_MODULE` et éventuellement le script axe via `AXE_PATH`. `ART_BASE_URL` permet de tester un autre serveur local.
