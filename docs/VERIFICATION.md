# Vérification de la refonte

## 11 septembre 2026 — Hors cadre, branche `codex/art-digital`

La suite `tools/verify-hors-cadre.mjs` termine avec **20/20 groupes de contrôles** dans Chrome local. Elle couvre les 85 archives, les cinq suites de peinture, le zoom, les liens directs, le retour au lien d’origine, les flèches, le curseur au clavier et un glissement tactile envoyé au moteur du navigateur.

Les deux nouvelles pages ont été contrôlées en français et anglais à 320, 360, 390, 430, 768, 1024, 1440 et 1920 px : **32 compositions**, sans débordement de page ni de titre. Les six pages existantes du journal ont aussi été parcourues à 390 et 1440 px avec leur lien vers Hors cadre. La collection existante a été utilisée : filtre des encres, visionneuse, fermeture et passage de 12 à 24 œuvres.

Les deux nouveaux films ont réellement décodé des images dans le navigateur mobile émulé. Silence, choix de la source mobile, pause volontaire, arrêt hors écran et derrière la visionneuse, changement de langue, mouvement réduit et économie de données ont été vérifiés. Une panne réseau simulée affiche le poster et un message ; le bouton recharge ensuite le film avec succès. Une lecture demandée depuis les commandes reste possible lorsque seule une partie du fond est visible.

Trois audits axe WCAG 2 A/AA et 2.1 AA — accueil, nouveau chapitre et visionneuse — ne détectent aucune violation. Les pages et les suites natives restent utilisables sans JavaScript. Aucune erreur JavaScript, aucune requête vers un service extérieur et aucun téléchargement de fichier HEIC ou JPEG d’origine n’ont été observés dans ces parcours.

Les 250 fichiers WebP des nouvelles archives ont été inspectés : dimensions conformes au manifeste, variantes de largeur correcte et espace sRGB. Les quatre MP4 ont une seule piste H.264 à 24 images/s, sans audio, avec index de lecture placé avant les données. Les mesures de taille sont consignées dans `HORS-CADRE.md`.

Les validations statiques passent : 115 œuvres, 8 pages, 907 références locales, 199 archives utilisées, 583 images et variantes référencées. Syntaxe de `app.js`, `films.js`, `motion.js` et `art-digital.js`, puis `git diff --check`, sans erreur. Les nouveaux écrans et sections ont été relus visuellement dans les captures mobile et ordinateur.

Limites : émulation Chrome, sans iPhone physique ni Safari/Firefox. Les tailles de fichiers ne sont pas des mesures de vitesse sur un réseau mobile réel. Les audits automatisés ne constituent pas une certification. Aucun push, aucune fusion, aucune publication.

---

Contrôles exécutés le 10 septembre 2026 sur la branche `version-astra`, dans un navigateur Chromium local. Les formats mobiles ont été émulés avec événements tactiles.

## Texte brut de Camilo

Après le retour aux formulations brutes de Camilo, les titres et paragraphes de l’accueil, des matières et du premier film des carnets ont été vérifiés en français et anglais sur 320 × 568, 390 × 844, 844 × 390 et 1440 × 1000, soit 24 combinaisons. Aucun débordement horizontal ni texte dépassant l’écran, aucune erreur JavaScript. Les captures mobiles des trois passages ont été relues. Les paragraphes plus longs restent entiers et le titre d’accueil retrouve sa formulation antérieure.

Les validations du catalogue et du journal passent : 115 entrées, 7 pages, 663 références locales, aucune ancre manquante. La syntaxe de `js/app.js` et `git diff --check` passent également. La modification concerne les textes, leurs traductions et la suppression du fond ajouté au titre précédent ; les descriptions des films et leurs commandes sont conservées. Cette passe est locale, sans nouvel envoi sur GitHub.

## Transitions et interactions mobiles

- **Mouvement partagé** : onze contrôles ciblés passés. Pression envoyée comme événement tactile réel, réduction immédiate du bouton puis retour au repos, annulation par glissement, sélection rapide de plusieurs catégories, arrivée des fragments à l’approche de l’écran et filtre de réserve après un défilement de 1 600 pixels.
- **Visionneuses** : 27 contrôles ciblés passés sur les archives et la collection, sans erreur JavaScript. Suivi du doigt mesuré pendant le glissement, direction, rebond, annulation, deuxième doigt, zoom, changement de préférence système et locale, retour du focus et de la position de lecture. Les cas de toucher pendant fermeture, retour navigateur pendant fermeture et erreur réseau puis reprise sont également exécutés.
- **Navigation** : transitions entre documents réellement exécutées et mesurées pendant le mouvement. La découpe de la page suivante est animée ; le retour navigateur inverse le sens et retrouve la position de lecture. Avec le mouvement réduit, la transition est désactivée et la préférence reste active dans le chapitre suivant.
- **Petits écrans** : recontrôle sur 320 × 568, 390 × 844 et 844 × 390, en français et anglais. Les quatre centres des filtres de collection reçoivent le toucher. La barre de réserve mesure 88 pixels en portrait et 56 en paysage. Après filtrage, la première image revient vers y = 225 pixels en portrait et y = 234 en paysage. Aucun débordement horizontal. Le dernier filtre de réserve se rejoint en faisant défiler sa rangée.
- **Parcours existants** : les 17 contrôles de la collection et les 28 contrôles du journal ont été réexécutés. Quinze audits automatisés au total, sans anomalie ; les sept pages passent dans dix formats et deux langues, soit 140 combinaisons. Les films des carnets ont été réellement lus sur ordinateur et mobile ; pause, silence et interruption par la visionneuse passent.
- **Repli et repos** : les 73 fragments de réserve restent disponibles sans JavaScript. Aucune ressource extérieure ni animation permanente observée à l’accueil après stabilisation. Le réglage de mouvement réduit garde le filtrage immédiat, sans animation.
- **Réserve complète** : dix contrôles de parcours et deux audits supplémentaires passés après modification des filtres. Progression jusqu’aux 73 images, catégories, compteurs, anglais, adresses directes, clavier, fermeture et repli sans script ; aucune erreur JavaScript ni référence introuvable.

Les nouvelles feuilles et les nouveaux scripts sont inclus dans les sept pages. La syntaxe JavaScript et les références locales sont contrôlées ; aucune dépendance n’a été ajoutée.

```text
OK — 115 entrées, 230 variantes, aucun lien local manquant.
OK — 29 peintures, 26 encres, 60 photographies.
OK — ancres, identifiants, polices, dimensions et références des œuvres.
OK — 7 pages, 663 références locales, aucune ancre manquante.
OK — 114 archives utilisées, 333 images et variantes, descriptions FR et EN.
OK — crédits des caves, affiche de 2017, vidéos silencieuses sans source initiale.
```

Limites : essais dans Chromium avec émulation mobile, sans iPhone physique, Safari ni Firefox. Le contrôle de la fenêtre native n’a pas pu être effectué car le Mac est verrouillé. L’aperçu local est disponible sur le port 55329. L’envoi GitHub demandé auparavant reste suspendu conformément à la dernière instruction de Camilo.

Les sections ci-dessous documentent les passes précédentes.

## Réserve de 73 images et accrochages intenses

La dernière passe concerne le kraft et le ciel, les nouveaux collages, la réserve et la présentation plus chaotique demandée ensuite par Camilo. L’aperçu testé est local, sur le port 55329.

- **Contenu** : 73 nouvelles archives et 216 fichiers WebP, ajoutés aux 41 archives déjà présentes. Toutes les sources ont une entrée unique ; les fichiers originaux sont accessibles depuis l’agrandissement dans leur version web complète. Les fichiers fournis n’ont pas été modifiés.
- **Réserve** : 10 contrôles de parcours, deux audits automatisés sans anomalie. Les 73 images sont accessibles par progression ; chaque filtre retourne le nombre attendu. Catégorie dans l’adresse, rechargement, anglais, flèches du clavier, focus, retour à la position de lecture et adresse directe vers une image hors du premier lot ont été exécutés. Sans JavaScript, les 73 liens restent visibles.
- **Journal** : 28 contrôles de parcours, 12 audits automatisés sans anomalie, aucune erreur JavaScript. Les sept pages ont été examinées sur dix formats et dans les deux langues, soit 140 combinaisons. Aucun débordement horizontal ni titre tronqué détecté. Les audits des pages entières incluent les sections révélées sous le premier écran.
- **Collection** : nouvelle exécution des 17 contrôles, avec trois audits sans anomalie. Les filtres, le chargement progressif, les liens profonds, le retour arrière, le glissement tactile, le zoom et le repli réseau continuent de fonctionner après le changement de composition.
- **Accrochages** : 12 compositions examinées sur ordinateur et mobile, dont les carnets, les visages, les peintures, la collection et la réserve. Les captures d’ensemble des peintures ont été faites après leur décodage. Un échantillonnage des points de chaque lien, jusqu’aux seize premiers liens par composition, confirme que les images restent atteignables malgré les superpositions. Les légendes de la réserve sont au-dessus des images voisines.
- **Films** : la suite dédiée à l’accueil a terminé ses 23 contrôles et deux audits sans anomalie ; les deux films des carnets ont été relus dans la suite du journal après modification des accrochages, sur ordinateur et mobile. Lecture silencieuse, pause volontaire, arrêt hors écran et derrière la visionneuse vérifiés.
- **Mouvement** : toile d’accueil et ouverture du cadre du film mesurées à plusieurs positions de défilement sur ordinateur et mobile. Le réglage de réduction supprime ces transformations. Aucun fichier vidéo ni ressource externe demandé au chargement de l’accueil ; déplacement cumulé de mise en page observé à zéro dans les deux essais. Les transferts initiaux observés sont de 2 092 323 octets sur ordinateur et de 1 607 887 octets en émulation mobile. Il ne s’agit pas de mesures en réseau réel.

Dernières sorties des validations statiques :

```text
OK — 115 entrées, 230 variantes, aucun lien local manquant.
OK — 29 peintures, 26 encres, 60 photographies.
OK — ancres, identifiants, polices, dimensions et références des œuvres.
OK — 7 pages, 635 références locales, aucune ancre manquante.
OK — 114 archives utilisées, 333 images et variantes, descriptions FR et EN.
OK — crédits des caves, affiche de 2017, vidéos silencieuses sans source initiale.
```

La syntaxe de `app.js`, `journal.js`, `films.js` et `reserve.js`, ainsi que `git diff --check`, a été vérifiée sans erreur. Les contrôles sont ceux d’un site statique : aucun paquet installé et aucune compilation nécessaire.

Les limites précédentes restent applicables : pas d’iPhone physique, de Safari ou Firefox, ni de mesure sur le site publié. Le dernier contrôle dans la fenêtre native de l’app n’a pas pu être refait, le Mac étant verrouillé ; les parcours Chromium locaux ont été exécutés. Aucun envoi, aucune fusion et aucune publication.

Les sections suivantes conservent l’historique des vérifications précédentes.

## Contrôles du contenu

Sorties du validateur `node tools/validate-portfolio.mjs` :

```text
OK — 115 entrées, 230 variantes, aucun lien local manquant.
OK — 29 peintures, 26 encres, 60 photographies.
OK — ancres, identifiants, polices, dimensions et références des œuvres.
```

Les dimensions physiques des 115 images ont également été lues et comparées au fichier généré : aucun écart.

## Parcours exécutés

La suite de navigateur a terminé avec `COMPLETE 17 checks` :

- Affichage initial de douze œuvres et chargement progressif jusqu’au bout de la sélection, avec transfert du focus vers la suite.
- Filtres peintures, encres, atelier et ensemble des œuvres : compteurs et contenu conformes au catalogue.
- Préférence de mouvement conservée après rechargement.
- Visionneuse, métadonnées, navigation, agrandissement, déplacement dans l’image et lien de contact lié à l’œuvre.
- Navigation clavier maintenue dans la visionneuse.
- Repli de partage par lien sélectionnable lorsque le presse-papiers est indisponible.
- Fermeture avec retour à la position de lecture et au lien d’origine.
- Boutons précédent et suivant du navigateur.
- Accès direct à une œuvre et fermeture avec Échap.
- Lien mal formé traité sans erreur de script.
- Glissement tactile vers l’œuvre suivante, envoyé par le moteur d’entrée du navigateur.
- Traduction anglaise et préférence de langue conservée.
- Absence de débordement horizontal à 320, 360, 390, 430, 768, 1024, 1440 et 1920 pixels, dans les deux langues.
- Commandes de visionneuse visibles sur téléphone en orientation paysage.
- Réglage système de réduction des animations respecté.
- Page et premières images utilisables sans script.
- Panne simulée du catalogue : contenu de repli maintenu et bouton de reprise fonctionnel.

## Accessibilité

Trois audits automatisés WCAG 2 A/AA et 2.1 AA : accueil mobile, visionneuse mobile, atelier sur ordinateur. Zéro anomalie détectée dans ces audits. Cela ne constitue pas une certification d’accessibilité.

## Défilement et œuvre d’accueil

- Mouvement de la toile d’accueil et ouverture du cadrage de la séquence de matière mesurés à plusieurs positions de défilement, sur ordinateur et mobile.
- La commande de réduction supprime ces transformations. Aucune animation ne reste active au repos après l’entrée en scène.
- Aucune requête externe ni vidéo téléchargée au chargement dans les deux essais locaux ; déplacement cumulé de mise en page observé à zéro. Ces observations locales ne préjugent pas des temps de chargement en production.
- Après le choix d’« Abstrait 996 », nouvelles captures sur ordinateur et mobile, validation des ressources et de la syntaxe. Le lien d’accueil a été ouvert dans l’aperçu : titre « Abstrait 996 », technique « Huile sur toile », position « 19 / 55 ». Fermeture et retour à l’accueil vérifiés.
- `node --check js/app.js` et `git diff --check` ont terminé avec le code de sortie 0, sans sortie d’erreur.

## Limites

- Pas d’essai sur un iPhone physique, Safari ou Firefox.
- Pas de message envoyé et pas d’ouverture effective d’une application de partage externe. Les liens générés et le repli de partage ont été vérifiés.
- Pas de mesure en réseau mobile réel ni de mesure sur le site publié.
- Aucun script TypeScript, lint ou compilation n’est déclaré : le dépôt est un site statique sans `package.json`. Les vérifications portent sur la syntaxe JavaScript, les ressources et le comportement dans le navigateur.
- Aucune fusion ni publication exécutée.

## Intégration du film à l’encre

La suite consacrée au film a terminé avec `TERMINÉ 23 contrôles`. La suite générale a ensuite été relancée et a terminé avec `COMPLETE 17 checks`.

- Lecture réellement décodée et observée au-delà de neuf secondes, sur les formats mobile et ordinateur. Sélection du fichier correspondant, propriétés de silence actives et aucune requête vidéo au premier affichage de l’accueil.
- Pause volontaire conservée après un aller-retour dans la page, pause hors écran, reprise au retour, arrêt derrière la visionneuse et reprise à sa fermeture.
- Réaction au changement de visibilité d’onglet vérifiée avec un événement simulé.
- Mouvement réduit : image fixe sans source vidéo chargée. Lecture explicite possible ; changement ultérieur de préférence système respecté. Traduire l’interface ne relance pas un film en pause et n’interrompt pas une lecture demandée.
- Économie de données et réseau 2G simulés : lecture seulement sur demande, avec fichier mobile. Refus de lecture automatique et erreur réseau simulés : image de repli conservée et nouvelle tentative fonctionnelle.
- Onze formats, de 320 × 568 à 1920 × 1080 pixels, dont un téléphone en paysage. Vérification dans les deux langues : pas de débordement horizontal, titre distinct du film et commandes d’au moins 44 pixels accessibles.
- Deux audits supplémentaires WCAG 2 A/AA et 2.1 AA sur la section vidéo : zéro anomalie détectée. Les trois audits de la suite générale restent également à zéro.
- Dévoilement du cadre au défilement mesuré sur ordinateur et téléphone ; réduction des mouvements vérifiée. Déplacement cumulé de mise en page observé à zéro et aucune vidéo téléchargée au premier affichage, dans les deux essais locaux.
- Dans l’aperçu intégré de l’app, lecture effective observée à 10,5 secondes, `muted: true`, `paused: false`, durée de 21,3 secondes et aucune erreur média.

Inspection des fichiers avec `ffprobe` :

| Fichier | Taille | Dimensions | Cadence | Pistes |
| --- | ---: | --- | --- | --- |
| `geste-encre-mobile.mp4` | 833 787 octets | 540 × 608 | 30 images/s | H.264 vidéo uniquement |
| `geste-encre-desktop.mp4` | 2 333 779 octets | 900 × 1014 | 30 images/s | H.264 vidéo uniquement |

Les deux fichiers durent 21,3 secondes. Le fichier fourni pesait 14 813 159 octets. La taille mobile est réduite d’environ 94 %. Aucun essai sur iPhone physique ni en réseau mobile réel ; ces limites restent applicables.

`node --check js/app.js`, `node tools/validate-portfolio.mjs` et `git diff --check` ont tous terminé avec le code de sortie 0 après cette intégration.

## Journal, archives et maillage interne

L’accueil et les cinq nouvelles pages ont été parcourus et capturés en 390 × 844 et 1440 × 1000 pixels. Le premier parcours termine avec 13 contrôles et 12 audits automatisés, sans erreur JavaScript ni anomalie d’accessibilité détectée. Aucun fichier vidéo n’est chargé au premier affichage de ces six pages.

La suite d’interactions du journal termine avec 26 contrôles et 10 audits supplémentaires, tous sans anomalie détectée :

- Agrandissement des archives, clavier, zoom, maintien du focus, glissement tactile réel et lien propre à chaque image.
- Copie par lien sélectionnable lorsque le presse-papiers est refusé, puis retour au même emplacement et au même lien après fermeture. Retour arrière et avant du navigateur, et accès direct à une photographie des caves avec son crédit.
- Page suivante, langue et préférence de mouvement conservées entre les chapitres.
- Renvois vers les encres, les peintures et les photographies d’atelier : filtres sélectionnés et compteurs 26, 29 et 60 vérifiés après chargement.
- Cent combinaisons examinées : cinq pages, dix formats, deux langues. Largeurs de 320 à 1920 pixels, dont 844 × 390 en paysage. Aucun titre coupé au bord de l’écran ni débordement horizontal détecté.
- Commandes de la visionneuse accessibles à 320 × 568, 844 × 390 et 1440 × 1000.
- Lecture réelle des deux nouveaux films, en versions mobile et ordinateur ; fichier adapté, silence, pause volontaire, arrêt derrière une image agrandie et reprise à sa fermeture.
- Sommaire, chapitres et images utilisables sans JavaScript.
- Mouvement réduit et économie de données simulée : aucun chargement automatique et lecture explicite fonctionnelle.

Les audits des pages entières ont été exécutés avec tous les contenus révélés. Les légendes sur fond ocre ont été renforcées et les couleurs du bouton vidéo ne se fondent plus l’une dans l’autre pendant son changement d’état. La position de lecture est enregistrée avant l’ouverture de la visionneuse pour que le retour du navigateur ne ramène pas en haut de page.

Les suites de la collection et du film d’accueil ont également été relancées : 17 et 23 contrôles validés, avec leurs cinq audits sans anomalie. Cela représente 79 contrôles de parcours dans les quatre suites, plus les mesures du mouvement au défilement et les validations statiques. Les audits automatisés restent des vérifications limitées, pas une certification.

Le lecteur des deux nouveaux films a aussi été utilisé dans le navigateur intégré de l’application. Le premier a été observé à 7,99 secondes sur 32,6 secondes ; le second à 7,16 secondes sur 16,83 secondes, avec `muted: true`, `volume: 0`, `readyState: 4` et aucune erreur média. Le premier se trouvait en pause après avoir quitté son cadre ; le second était en lecture.

Inspection des nouveaux fichiers :

| Film | Version | Taille | Dimensions | Durée |
| --- | --- | ---: | --- | --- |
| Deux figures | Mobile | 2 076 377 octets | 640 × 598 | 32,6 s |
| Deux figures | Ordinateur | 4 165 015 octets | 1000 × 934 | 32,6 s |
| Encre en mouvement | Mobile | 1 012 158 octets | 540 × 684 | 16,83 s |
| Encre en mouvement | Ordinateur | 2 527 865 octets | 900 × 1140 | 16,83 s |

Les six fichiers utilisés par les trois films ont été inspectés : une seule piste, vidéo H.264, 30 images par seconde. Le dernier photogramme exporté de « Deux figures » montre le dessin et exclut le carton final. Les sources fournies n’ont pas été modifiées.

Sorties du validateur du journal :

```text
OK — 6 pages, 384 références locales, aucune ancre manquante.
OK — 41 archives utilisées, 117 images et variantes, descriptions FR et EN.
OK — crédits des caves, affiche de 2017, vidéos silencieuses sans source initiale.
```

Les noms et le contexte des caves proviennent des informations fournies par Camilo. Le nom de l’exposition, les deux artistes et les dates de 2017 ont été lus sur l’affiche fournie. Les proportions, la syntaxe des scripts, les liens et les références accessibles des pages ont été vérifiés. Les mesures locales de l’accueil indiquent zéro déplacement cumulé de mise en page et aucune requête externe ; les temps locaux ne sont pas des mesures de production.

Les limites restent les mêmes : pas d’iPhone physique, pas de réseau mobile réel, pas d’essai dans les applications Safari et Firefox, et aucune fusion, aucun envoi distant ni publication. Les pages restent sur la branche locale `version-astra`.
