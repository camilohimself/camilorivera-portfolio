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
