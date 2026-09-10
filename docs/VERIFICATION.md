# Vérification de la refonte

Contrôles exécutés le 10 septembre 2026 sur la branche `version-astra`, dans un navigateur Chromium local. Les formats mobiles ont été émulés avec événements tactiles.

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
