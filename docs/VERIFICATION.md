# Vérification de la refonte

## 2 octobre 2026 — La goutte, la page de confidentialité et le crédit

Contrôles exécutés localement avec Chromium sans interface, piloté par Playwright 1.62 déjà présent sur le poste, sur la branche `claude/goutte-confidentialite` (partie de `claude/transitions-liquides`), servie par `python3 -m http.server`.

- **Parcours réels, 26 contrôles sur 26** : accueil sans aucune clé écrite au chargement ; message absent avant 1,5 s puis posé ; détail à quatre lignes, toutes « rien pour l’instant », lien vers `/confidentialite/` ; « Continuer » ne laisse que `cr-notice =vu` et le message ne revient pas sur les œuvres ; navigation avec le message ouvert : posé 250 ms après l’arrivée, sans chute, à la même position au pixel près (1026, 970) ; « Ne rien garder » ne laisse en local que `cr-notice =rien`, la langue choisie ensuite part en session et reste en anglais sur la page suivante ; carnets à 390 × 844 : boutons à 761 px, dock à 775 px ; page de confidentialité sans message, traduite (titre, goutte du titre, courriel, crédit), sans débordement à 1440 et 390 ; dix pages à 1440 × 1000 et 390 × 844 sans erreur JavaScript, sans ressource en erreur, sans débordement, avec crédit et message.
- **Police du titre** : Cormorant 32 px mesuré sur les neuf pages ; Hors cadre l’affichait d’abord en DM (règle `.journey-journal.art-digital :is(h1, h2, h3)`), corrigé.
- **Garde-fou vu en échec** : sans la classe `osom-credit` sur `journal/traces/`, `validate-journal.mjs` échoue (« crédit de scénographie »), puis repasse une fois le fichier rétabli.

Sorties des contrôles :

```text
$ node tools/validate-portfolio.mjs
OK — 115 entrées, 230 variantes, aucun lien local manquant sur 10 pages.
OK — 29 peintures, 26 encres, 60 photographies.
OK — navigation complète, ancres historiques, identifiants, polices, dimensions et références des œuvres.
OK — 759 sources responsive, couverture et catalogue accessibles sans script.
$ node tools/validate-journal.mjs
OK — 10 pages reliées sans script, 2231 références locales, aucune ancre manquante.
OK — 213 archives utilisées (129 du journal, 84 de Hors cadre), 625 images et variantes, descriptions FR et EN, 73 fragments et filtres déclarés.
OK — crédits des caves, hommage, affiche de 2017, deux films des carnets et vidéos configurées à la demande.
OK — ressources du voyage, références photo/souvenir/œuvre et absence des anciennes feuilles de présentation.
OK — aucun symbole ni emoji dans 38 fichiers servis ; 16 icônes SVG définies à l’identique sur les 10 pages.
OK — 10 cartes de partage JPEG 1200 × 630 sous 300 Ko, décrites ; icônes .ico, .svg et iOS sur chaque page.
OK — panneau de confidentialité, lien vers la déclaration et crédit de scénographie sur les 10 pages.
```

Limites : non vérifié dans Safari, Firefox ni sur un appareil réel.

## 1er octobre 2026 — Transitions en gouttes, mesures avant et après

Contrôles exécutés localement avec Chromium 151 sans interface, piloté par Playwright 1.62 déjà présent sur le poste, sans paquet ajouté au dépôt. Deux serveurs : la référence `b076117` (extraite par `git archive`) et la branche de travail. WebKit et Firefox ne sont pas installés pour Playwright : non vérifié dans WebKit, non vérifié dans Firefox.

**Méthode.** Les animations sont ralenties à 25 % par le protocole du navigateur (`Animation.setPlaybackRate`), puis figées pour chaque capture, environ toutes les 55 ms de temps d’animation. Le fond placé derrière les deux pages (`::view-transition`) est une sonde, injectée par le banc d’essai seulement : chaque image est capturée deux fois, sonde magenta puis verte. Un pixel où les deux captures diffèrent dans la direction magenta–vert n’appartient ni à l’ancienne ni à la nouvelle page : c’est le « fond nu ». Critère : aucune image où il dépasse 5 % de l’écran. Pour l’en-tête (64 premiers pixels) et pour l’écran entier, l’avancement de chaque image entre l’ancien état (0) et le nouveau (1) est calculé ; un saut de 1 entre deux images consécutives est une bascule sans état intermédiaire. Douze scénarios, à 390 × 844 et 1440 × 1000.

**Mesuré avant.**

- Accueil vers œuvres et œuvres vers accueil : aucune transition (la page des œuvres n’y adhérait pas) ; changement d’écran en une image (saut 1,00 et 0,97 à 1,00).
- Journal vers carnets, carnets vers caves, caves vers traces : 17,0 à 18,3 % d’écran en fond nu, sur 2 à 3 images par transition (l’ancienne page à 25 % d’opacité) ; en-tête jusqu’à 1,00 de saut.
- Retour du navigateur traces vers caves : 10,4 % (390) et 11,0 % (1440) de fond nu, sur 3 images.
- Index, visionneuse du journal, œuvre de la collection, à l’ouverture comme à la fermeture : aucune transition, saut de 1,00 sur l’écran.
- Sur 40 navigations sans banc d’essai (aller et retour, cinq trajets, deux formats), 24 transitions ; les 16 manquantes sont exactement les allers-retours entre l’accueil et les œuvres.

**Mesuré après.** Fond nu maximal, saut maximal de l’en-tête, saut maximal de l’écran :

| Scénario | 390 × 844 | 1440 × 1000 |
| --- | --- | --- |
| Accueil vers œuvres | 0,0 % · — · 0,11 | 0,0 % · — · 0,15 |
| Œuvres vers accueil | 0,0 % · — · 0,18 | 0,0 % · — · 0,21 |
| Journal vers carnets | 0,0 % · 0,35 · 0,23 | 0,0 % · 0,43 · 0,20 |
| Carnets vers caves (en-tête noir) | 0,0 % · 0,33 · 0,14 | 0,0 % · 0,31 · 0,16 |
| Caves vers traces | 0,0 % · 0,31 · 0,14 | 0,0 % · 0,31 · 0,16 |
| Retour traces vers caves | 0,0 % · 0,41 · 0,14 | 0,0 % · 0,38 · 0,18 |
| Index, ouverture | 0,0 % · 0,28 · 0,11 | 0,0 % · 0,14 · 0,17 |
| Index, fermeture | 0,0 % · 0,36 · 0,11 | 0,0 % · 0,22 · 0,15 |
| Visionneuse, ouverture | 0,0 % · 0,71 · 0,17 | 0,1 % · 0,39 · 0,16 |
| Visionneuse, fermeture | 0,0 % · 0,68 · 0,16 | 0,0 % · 0,40 · 0,17 |
| Œuvre, ouverture | 0,0 % · 0,56 · 0,16 | 0,0 % · 0,42 · 0,17 |
| Œuvre, fermeture | 0,0 % · 0,64 · 0,16 | 0,0 % · 0,34 · 0,17 |

« — » : l’en-tête est identique avant et après, l’avancement n’y est pas défini. Les sauts d’en-tête de 0,56 à 0,71 sur les panneaux correspondent, à la relecture des planches, au bord de la goutte qui traverse la bande de 64 pixels entre deux images : bord adouci, pas de bascule.

- Mouvement réduit (préférence système simulée) : fondu de 180 ms, quatre à cinq images intermédiaires, fond nu 0,0 %, saut maximal 0,46 sur quatre scénarios et deux formats.
- Sur 60 navigations sans banc d’essai (mêmes trajets, trois fois), 60 transitions prêtes, aucune sautée.
- Point d’origine, stockage, repli : 24 contrôles sur 24. La clé `cr-drop` contient seulement `x`, `y`, `t` et `way` ; elle est absente du stockage après l’arrivée ; aucune autre clé de session ou locale n’apparaît. Le point relu correspond au clic à moins d’un pixel ; au clavier, au centre du lien. Le retour du navigateur referme vers le point d’ouverture enregistré dans l’entrée d’historique. Un lien vers un chapitre antérieur et œuvres vers accueil referment. Un geste vieux de plus de 3 secondes est ignoré (centre). Le réglage de mouvement du site donne un fondu. Sans `document.startViewTransition`, l’index s’ouvre en goutte sur le dialogue, se referme en goutte et rend le focus.
- Parcours de non-régression : 534 contrôles sur 534. Neuf pages, deux formats, deux langues : aucune erreur JavaScript, aucune ressource en erreur, aucun débordement, bascule du mouvement, index (ouverture, focus, Échap, retour du focus). Visionneuse du journal (flèche, zoom, Échap, focus rendu, fermeture par le retour du navigateur, page débloquée, lien direct), collection (filtre, lot suivant, œuvre, clavier, zoom, Échap, focus rendu, retour du navigateur, lien direct), collection et visionneuse de l’accueil, film d’entrée, suites de Hors cadre.

**Instrument.** Le banc d’essai fait parfois sauter la transition qu’il observe : l’ancienne page annonce une transition et la nouvelle n’en reçoit pas. Les mêmes trajets sans capture n’en sautent aucune (60 sur 60). Chaque mesure sautée a été rejouée, jusqu’à six fois par série ; le retour à 390 pixels a demandé plusieurs séries. L’écart aux deux pages (indicateur secondaire, blocs de 12 pixels) atteint 25 à 29 % entre les œuvres et l’accueil avant comme après : c’est le film d’entrée qui avance pendant la transition, non un fond nu.

Vidéos pour Camilo, hors du dépôt : quatre parcours en mobile et en ordinateur, au format WebM et MP4.

Sorties des contrôles :

```text
$ node tools/validate-portfolio.mjs
OK — 115 entrées, 230 variantes, aucun lien local manquant sur 9 pages.
OK — 29 peintures, 26 encres, 60 photographies.
OK — navigation complète, ancres historiques, identifiants, polices, dimensions et références des œuvres.
OK — 759 sources responsive, couverture et catalogue accessibles sans script.
$ node tools/validate-journal.mjs
OK — 9 pages reliées sans script, 2164 références locales, aucune ancre manquante.
OK — 213 archives utilisées (129 du journal, 84 de Hors cadre), 625 images et variantes, descriptions FR et EN, 73 fragments et filtres déclarés.
OK — crédits des caves, hommage, affiche de 2017, deux films des carnets et vidéos configurées à la demande.
OK — ressources du voyage, références photo/souvenir/œuvre et absence des anciennes feuilles de présentation.
OK — aucun symbole ni emoji dans 35 fichiers servis ; 16 icônes SVG définies à l’identique sur les 9 pages.
OK — 9 cartes de partage JPEG 1200 × 630 sous 300 Ko, décrites ; icônes .ico, .svg et iOS sur chaque page.
```

`node --check` passe sur les seize scripts de `js/` et les six outils de `tools/` ; `git diff --check` ne signale rien.

Limites : Chromium seulement, fenêtres simulées, aucun téléphone ni Safari réels. La fluidité en temps réel n’est pas mesurée (les captures figent le temps) ; les vidéos sont enregistrées par le navigateur de test et peuvent saccader sans que le site en soit la cause. Le repli sans transitions de vue a été simulé en retirant l’API dans Chromium, pas observé dans un navigateur qui en est dépourvu. Aucun envoi distant, aucune fusion, aucun déploiement.

## 1er octobre 2026 — Icônes au trait à la place des symboles

Contrôles exécutés localement avec Chromium 151 sans interface, piloté par Playwright 1.62 déjà présent sur le poste, sans paquet ajouté au dépôt.

- **Polices** : fontTools lit la table des caractères des cinq `.woff2` : 222 à 231 glyphes, dont U+2191, U+2193 et U+00D7 ; U+2197, U+2192, U+2190, U+2194, U+2199, U+25B7 et U+2161 absents des cinq.
- **Recomptage** : avant, dans l’ensemble du dépôt, 311 U+2197, 89 U+00D7 (dont 79 dans la documentation et les outils), 27 U+2192, 15 U+2161, 14 U+2190, 12 U+2191, 11 U+2193, 5 U+2194, 5 U+25B7 et 1 U+2199. Après, dans les fichiers servis : aucun. Restent `js/app.js` (non chargé) et les fichiers Markdown et `tools/`.
- **Rendu** : recadrages avant/après de l’en-tête, des légendes, des liens de section, du pied de page, de l’index, des visionneuses, de la collection et des suites de Hors cadre, à 390 × 844 et 1440 × 1000, en français et en anglais. Les flèches gardent leur place ; l’en-tête de la collection se décale de 3 à 4 pixels, l’icône étant plus étroite que le glyphe de repli. Les croix de fermeture sont légèrement plus grandes qu’avant.
- **Parcours** : 526 contrôles sur 526 : neuf pages, deux formats, deux langues ; langue active, aucun débordement horizontal, aucun symbole dans le texte affiché, aucune icône sans définition ni dans un texte traduit ; bascule du bouton de mouvement (une seule icône visible) ; index ouvert, focus sur la fermeture, neuf flèches, fermeture par Échap et focus rendu au bouton. Visionneuse du journal (flèche droite, zoom, Échap, focus rendu, lien direct `#fragment/la-main`), collection filtrée (18 puis 29 peintures), œuvre (clavier, bouton suivant, zoom, Échap, focus rendu à une carte, lien direct `#oeuvre/abstrait-996`), collection et visionneuse de l’accueil, bascule du film d’entrée, suites d’états de Hors cadre. Aucune erreur JavaScript, aucune ressource en erreur.
- **Contrôle vu en échec** sur une copie jetable : une flèche ajoutée en `content` dans `css/journey-site.css`, un emoji (U+1F30A) en commentaire de `js/journey-nav.js`, un symbole modifié dans le bloc d’icônes d’une seule page, `js/app.js` rechargé par l’accueil. La copie rétablie repasse.

```text
AssertionError [ERR_ASSERTION]: css/journey-site.css:102 : symbole U+2197 ; utiliser une icône SVG
AssertionError [ERR_ASSERTION]: js/journey-nav.js:67 : symbole U+1F30A ; utiliser une icône SVG
AssertionError [ERR_ASSERTION]: journal/traces/index.html : définitions des icônes différentes de index.html
AssertionError [ERR_ASSERTION]: js/app.js est de nouveau chargé : le relire avant de le retirer de la liste
```

Sorties des contrôles :

```text
$ node tools/validate-portfolio.mjs
OK — 115 entrées, 230 variantes, aucun lien local manquant sur 9 pages.
OK — 29 peintures, 26 encres, 60 photographies.
OK — navigation complète, ancres historiques, identifiants, polices, dimensions et références des œuvres.
OK — 759 sources responsive, couverture et catalogue accessibles sans script.
$ node tools/validate-journal.mjs
OK — 9 pages reliées sans script, 2153 références locales, aucune ancre manquante.
OK — 213 archives utilisées (129 du journal, 84 de Hors cadre), 625 images et variantes, descriptions FR et EN, 73 fragments et filtres déclarés.
OK — crédits des caves, hommage, affiche de 2017, deux films des carnets et vidéos configurées à la demande.
OK — ressources du voyage, références photo/souvenir/œuvre et absence des anciennes feuilles de présentation.
OK — aucun symbole ni emoji dans 34 fichiers servis ; 16 icônes SVG définies à l’identique sur les 9 pages.
OK — 9 cartes de partage JPEG 1200 × 630 sous 300 Ko, décrites ; icônes .ico, .svg et iOS sur chaque page.
```

Le nombre de références locales passe de 1772 à 2153 : chaque `<use href="#…">` est une ancre vérifiée. `node --check` passe sur les quinze scripts de `js/` et les six outils de `tools/` ; `git diff --check` ne signale rien.

Limites : aucun iPhone ni Safari réel ; l’affichage en emoji sur iOS reste une déduction. Fenêtres simulées dans Chromium. Aucun envoi distant, aucune fusion, aucun déploiement.

## 1er octobre 2026 — Favicon et cartes de partage

- Monogramme tracé depuis `fonts/dm-sans-400.woff2` (unités de 1 000, avances 572, 370 et 198, interlettrage −0,12 em, point décalé de 3/37 em). Rendu relu à 256, 32 et 16 pixels et en icône iOS de 180 pixels : « c » et « r » se touchent comme dans l’en-tête.
- Neuf cartes générées, toutes en 1200 × 630, de 46,2 Ko (traces) à 85,7 Ko (accueil). Relues une à une ; la carte d’accueil est passée sur une ligne et l’image réduite de 340 à 286 pixels de large après une première relecture, le nom étant trop couvert par le dessin.
- Servies localement : `favicon.ico` en `image/x-icon`, `favicon.svg` en `image/svg+xml`, `apple-touch-icon.png` en `image/png`, cartes en `image/jpeg`, réponses 200. Les neuf pages se chargent sans erreur à 390 × 844 et 1440 × 1000.
- `node tools/validate-journal.mjs` contrôle désormais, pour chaque page, une carte JPEG de 1200 × 630 sous 300 Ko, ses dimensions, son type et sa description déclarés, le nom du site, l’adresse partagée égale à l’adresse canonique et les trois icônes. Le contrôle a été vu échouer sur une copie jetable : carte réduite à 800 × 420, nom du site retiré.

```text
OK — 9 cartes de partage JPEG 1200 × 630 sous 300 Ko, décrites ; icônes .ico, .svg et iOS sur chaque page.
```

Limites : aucun partage réel n’a été fait vers WhatsApp, iMessage ou un réseau ; le rendu des aperçus dépend de chaque application et de son cache. Le favicon n’a pas été observé dans un onglet de navigateur réel, ni en mode sombre.

## 1er octobre 2026 — Intégration de `main` dans `version-astra`

Contrôles exécutés localement avec Chromium sans interface, piloté par Playwright déjà présent sur le poste, sans paquet ajouté au dépôt. Trois serveurs locaux : la référence (`abcba58`), la même référence munie des images de `main` pour neutraliser les réencodages, et l’intégration. Captures à 320 × 568, 390 × 844, 844 × 390 et 1440 × 1000, en français et en anglais, horloge figée et films arrêtés sur la même image (6 s).

- **Héros** : 37 positions de défilement (0 à 1,8 écran, pas de 0,05) par format et par langue, soit 296 captures. Comparées à la référence munie des images de `main` : 296 identiques au pixel près. Le nom initial, l’agrandissement du O, sa sortie, la coulure et l’arrivée de la première peinture sont donc inchangés. Contre la référence brute, les écarts se limitent à l’intérieur d’« Abstrait 996 », dont le fichier `IMG_0586.webp` a été réencodé sur `main` (`2942756`) aux mêmes dimensions.
- **Accueil et collection** : 196 captures pleine fenêtre, hauteurs de page identiques dans les huit combinaisons. Douze captures diffèrent. Les trois plus marquées ont été examinées : écarts dans l’image du film du geste, sur un bord du champ WebGL et dans des tracés fins. Deux captures successives de la référence diffèrent dans cinq de ces mêmes vues. La comparaison géométrique ci-dessous ne relève aucun écart sur ces deux pages.
- **Géométrie des huit pages** : position, taille et styles calculés de chaque élément, mesurés relativement à leur bloc, transformations neutralisées, dans les quatre formats et les deux langues. Tous les blocs communs sont identiques, sauf les changements voulus : numérotation `0X / 06`, page précédente des carnets (le sommaire) et page suivante des traces (la réserve), libellés et entrée 06 du sommaire. Aucun style calculé ne change : les modifications de `main` dans `style.css` et `motion.css` n’atteignent pas les pages d’Astra.
- **Écart corrigé** : l’alternance haut/bas du défilement comptait les photographies insérées par `main` ; le parcours dans le rouge (une photographie) et les rapprochements (neuf) inversaient toutes les images suivantes de la matière et de la réserve. `js/journey-scroll.js` les ignore désormais ; la comparaison géométrique et les captures confirment le retour au rendu de référence.
- **Parcours complet de l’intégration** : neuf pages, quatre formats, deux langues, 72 parcours et 1 128 captures. Aucun débordement horizontal, aucune erreur JavaScript ni ressource manquante ; seuls des avertissements de performance du pilote WebGL apparaissent.
- **Interactions** (65 essais réussis sur 67) : collection filtrée par `?collection=paintings#gallery` (18 sur 29), lot suivant (29), visionneuse au clavier, flèche droite, zoom, Échap et retour du focus, lien direct `#oeuvre/abstrait-996` ; anciennes ancres `#mouvement`, `#gallery`, `#journal`, `#hors-cadre`, `#oeuvres`, `#about` ; film d’entrée en version mobile à 390 et ordinateur à 1440, silencieux au départ, pause volontaire conservée après un aller-retour, reprise, arrêt hors écran ; mouvement réduit sans source vidéo et entrée d’un écran ; visionneuses des carnets, des feuilles, de la réserve, des rapprochements et de Hors cadre (ouverture, suivante, zoom, fermeture, focus rendu au lien) ; liens directs `#fragment/la-main`, `#fragment/fusain-et-ocre`, `#fragment/hc-08` ; réserve `?regard=atelier` (15) ; rapprochements dépliables ; index à neuf entrées à 390 × 844, 844 × 390 et 1440 × 1000, dernière entrée visible, fermeture et focus ; textes anglais des blocs ajoutés et de Hors cadre.
- **Les deux essais en échec** : `#seuil` mène dans la section contact, mais la fin de page l’empêche de remonter sous l’en-tête, comme `#contact`. Le film du geste à 390 pixels est resté une fois en pause au retour, après un enchaînement pause, aller-retour, reprise, sortie d’écran. Rejoué trois fois sur chaque version, le même arrêt se produit une fois sur trois sur la référence et aucune fois sur l’intégration : le comportement existait déjà et n’est pas corrigé dans cette passe.
- **Lisibilité** : la chambre des feuilles passe du ton gris au ton violet après relecture des captures à 320 et 390 pixels, où la prose devenait illisible sur les zones grises.

Sorties des contrôles :

```text
$ node tools/validate-portfolio.mjs
OK — 115 entrées, 230 variantes, aucun lien local manquant sur 9 pages.
OK — 29 peintures, 26 encres, 60 photographies.
OK — navigation complète, ancres historiques, identifiants, polices, dimensions et références des œuvres.
OK — 759 sources responsive, couverture et catalogue accessibles sans script.
$ node tools/validate-journal.mjs
OK — 9 pages reliées sans script, 1772 références locales, aucune ancre manquante.
OK — 213 archives utilisées (129 du journal, 84 de Hors cadre), 625 images et variantes, descriptions FR et EN, 73 fragments et filtres déclarés.
OK — crédits des caves, hommage, affiche de 2017, deux films des carnets et vidéos configurées à la demande.
OK — ressources du voyage, références photo/souvenir/œuvre et absence des anciennes feuilles de présentation.
```

`node --check` passe sur les quinze scripts de `js/` et les cinq outils `.mjs` de `tools/`. `git diff --check` ne signale rien.

Limites : fenêtres simulées dans Chromium, sans téléphone physique ni Safari ou Firefox. Les captures neutralisent le temps ; la fluidité réelle et le réseau mobile ne sont pas mesurés. La lecture automatique est forcée par une option du navigateur de test. Les préférences système de mouvement réduit et d’économie de données ne sont pas simulées : le réglage du site a été utilisé. Les parcours `tools/verify-hors-cadre.mjs` et `tools/verify-reverie.mjs` de `main` n’ont pas été exécutés : ils décrivent la version précédente. Aucun envoi distant, aucune fusion vers `main`, aucun déploiement.

## 1er octobre 2026 — Raccord plus court après le O

Le passage immobilisé occupe désormais 160svh sur ordinateur et 155svh sur mobile, au lieu de 210svh et 195svh. L’ouverture du O suit la hauteur réelle de la scène ; la section peut donc commencer à sortir pendant la fin de son agrandissement. La coulure est déclenchée plus tôt et limitée à 40 % de la scène, pour ne pas couvrir tout l’écran avant l’arrivée des œuvres. L’espace avant le titre et la première peinture est resserré.

Contrôles exécutés dans le navigateur intégré :

- À 1219 × 998, après environ 0,68 écran de défilement, le sommet des œuvres est à 918 pixels et son titre à 982 pixels : la section entre déjà à la fin du passage. À 0,90 écran, le titre et le début de la peinture sont visibles, tandis que le film reste présent au-dessus de la coulure. Aller-retour dans la transition relu visuellement.
- À 390 × 844, après environ 0,72 écran, les œuvres commencent à 701 pixels et leur titre à 801 pixels. Aucun débordement horizontal. L’accès direct aux œuvres les place à 70 pixels sous le haut de la fenêtre ; le film est alors arrêté hors écran.
- Le réglage réduit conserve une entrée et une scène de 844 pixels, sans longueur supplémentaire. Le mouvement normal est rétabli et l’aperçu laissé à l’entrée.
- `node --check js/hero-immersion.js` et `git diff --check` passent. Les deux validateurs passent également : 115 entrées, 114 archives, 8 pages, 1101 références locales et aucune ancre manquante.

Limites : contrôles sur fenêtres simulées, sans appareil physique ni nouvelle vérification séparée Safari/Firefox. Aucun envoi distant, fusion ou déploiement.

## 1er octobre 2026 — Le nom devient le passage

Cette passe remplace le voile du héros par une composition noire et blanche du nom devant le film, puis par une traversée du « o » au défilement. Le reste du parcours et les fichiers médias sont inchangés.

- Entrée relue dans le navigateur intégré à 320 × 568, 390 × 844, 763 × 998, 844 × 390 et 1440 × 1000. Un contrôle supplémentaire à 1024 × 768 confirme que le nom et les commandes tiennent aussi dans la hauteur disponible. Les boîtes des trois parties du nom restent dans la largeur de l’écran et aucun débordement horizontal n’a été observé. Les commandes restent dans l’écran, y compris en paysage. Français relu sur téléphone et anglais sur petit écran et ordinateur.
- Passage natif observé à plusieurs positions : nom entier à l’entrée, autres lettres écartées, « o » agrandi à environ 41 % de progression, puis film traversé par la coulure blanche lors de la sortie. Le défilement au clavier a aussi été exécuté. Les rubans s’effacent tôt et ne coupent pas le « o » pendant son agrandissement.
- Le lien « Voir les œuvres » rejoint la sélection sous l’en-tête. Une correction réserve la hauteur du passage dès le début du document : après rechargement à `#oeuvres`, la mesure reste identique avant/après (`scrollY: 1576`, sommet de section à environ 70 pixels sur une fenêtre de 390 × 844).
- Lecture silencieuse observée avec le fichier ordinateur et sur téléphone ; pause volontaire par la commande et sur la surface du film, reprise, arrêt hors écran et arrêt à l’ouverture de l’index vérifiés. Le canvas utilise le film déjà présent, sans nouveau lecteur ni nouveau fichier vidéo.
- Mouvement réduit choisi dans le site puis rechargement : entrée de 844 pixels dans une fenêtre de 844 pixels de haut, scène en position relative, vidéo arrêtée sans source affectée, nom composé fixe. Lecture volontaire ensuite possible. Le réglage normal et le français sont rétablis après les essais.
- Aucun avertissement ni erreur dans les journaux consultés. `node --check js/hero-immersion.js`, `node --check js/journey-home.js` et `git diff --check` terminent avec le code de sortie 0.

Sorties des deux validateurs :

```text
OK — 115 entrées, 230 variantes, aucun lien local manquant sur 8 pages.
OK — 29 peintures, 26 encres, 60 photographies.
OK — navigation complète, ancres historiques, identifiants, polices, dimensions et références des œuvres.
OK — 403 sources responsive, couverture et catalogue accessibles sans script.
OK — 8 pages reliées sans script, 1101 références locales, aucune ancre manquante.
OK — 114 archives utilisées, 333 images et variantes, descriptions FR et EN, 73 fragments et filtres déclarés.
OK — crédits des caves, hommage, affiche de 2017, deux films des carnets et vidéos configurées à la demande.
OK — ressources du voyage, références photo/souvenir/œuvre et absence des anciennes feuilles de présentation.
```

Limites : fenêtres simulées, aucun téléphone physique ni mesure de fluidité sur appareil peu puissant. Pas d’essai séparé Safari/Firefox, de panne canvas forcée, de navigation sans script ni de nouvel audit d’accessibilité automatique dans cette passe. La préférence système et l’économie de données n’ont pas été simulées ; le réglage de mouvement du site a été utilisé. Aucune compilation ni commande de lint n’est déclarée dans ce site statique sans `package.json`. Aucun envoi distant, fusion ou déploiement.

## 1er octobre 2026 — Nouveau rythme de la page d’accueil

L’accueil suit désormais six sections : film d’entrée, œuvres, geste, mémoire et chemins du journal, présentation, contact. Les essais ci-dessous concernent cette nouvelle organisation ; les comptes rendus suivants restent l’historique des versions antérieures.

- Rendu examiné dans le navigateur intégré à 320 × 568, 390 × 844, 763 × 998 et 1440 × 1000. Les largeurs du document et des titres ont aussi été contrôlées à 844 × 390. Aucun débordement horizontal détecté. Français et anglais contrôlés à 320, 844 et 1440 pixels.
- Le lien « Voir les œuvres » rejoint la première sélection sous l’en-tête fixe. « Abstrait 996 » ouvre sa visionneuse et retrouve le focus après fermeture. La photographie « La main » s’agrandit toujours ; son lien adjacent ouvre réellement le chapitre des traces.
- Les six fragments de mémoire ont chacun leur lien de chapitre. Les cinq identifiants de souvenirs et les six identifiants d’œuvres déjà présents dans l’accueil sont conservés ; le fragment « Le rouge revient » est ajouté à la composition.
- Lecture réelle du film d’entrée observée avec la version mobile à 390 pixels et la version ordinateur à 1440 pixels, sans son. Pause explicite, retour à l’entrée sans reprise intempestive, reprise volontaire et arrêt hors écran vérifiés. Le film du geste est ensuite observé en lecture tandis que celui du héros reste arrêté.
- Réduction des mouvements par le bouton du site, puis rechargement : héros arrêté et aucune source vidéo affectée. Lecture volontaire ensuite possible. Retour au mouvement normal et au français effectué à la fin des essais.
- Voile de contraste ajouté derrière le nom après inspection : les détails du film rendaient initialement les caractères inversés difficiles à lire. Nom et commandes relus sur petit écran et ordinateur. Les commandes du film mesurent au moins 44 pixels de haut à 320 pixels.
- Aucun message d’erreur ou avertissement dans les journaux consultés. `node --check js/journey-home.js` et `git diff --check` terminent avec le code de sortie 0.

Les deux nouveaux fichiers du héros ont été inspectés : 313 images, 24 images par seconde, 13,041667 secondes, H.264 yuv420p et index de lecture en tête. La piste AAC est identique à celle du fichier fourni. La version ordinateur pèse 3 800 047 octets (740 × 1000), la version mobile 1 848 689 octets (540 × 730). Le fichier source reste inchangé. Comparaison visuelle réalisée sur un photogramme à six secondes.

Sorties des validateurs après les modifications :

```text
OK — 115 entrées, 230 variantes, aucun lien local manquant sur 8 pages.
OK — 29 peintures, 26 encres, 60 photographies.
OK — navigation complète, ancres historiques, identifiants, polices, dimensions et références des œuvres.
OK — 403 sources responsive, couverture et catalogue accessibles sans script.
OK — 8 pages reliées sans script, 1099 références locales, aucune ancre manquante.
OK — 114 archives utilisées, 333 images et variantes, descriptions FR et EN, 73 fragments et filtres déclarés.
OK — crédits des caves, hommage, affiche de 2017, deux films des carnets et vidéos configurées à la demande.
OK — ressources du voyage, références photo/souvenir/œuvre et absence des anciennes feuilles de présentation.
```

Limites : dimensions simulées, sans appareil physique ni essai séparé dans Safari ou Firefox. Le mouvement réduit a été testé avec le réglage du site ; les préférences système, l’économie de données et les refus réseau n’ont pas été simulés pour cette passe. Aucun nouvel audit automatique d’accessibilité ni mesure de performance en réseau réel. Site statique sans `package.json` : aucune compilation, suite TypeScript ou commande de lint à exécuter. Aucun envoi distant, fusion ou déploiement.

## 1er octobre 2026 — Vidéo de fond de la section 03

Le film remplit la section sur toute sa largeur et au moins une hauteur d’écran. Lecture automatique silencieuse à partir de 20 % de section visible ; arrêt hors écran, onglet masqué ou fenêtre ouverte. La surface du film et le bouton visible partagent la commande pause/reprise. Une pause volontaire reste mémorisée pendant la visite. Mouvement réduit et économie de données attendent une lecture volontaire.

Contrôles exécutés dans le navigateur intégré : démarrage sans clic, silence initial, pause sur la vidéo, reprise au clavier et via le bouton, maintien de la pause après sortie/retour, arrêt hors écran et reprise automatique lorsque le visiteur n’avait pas mis en pause. Rendu examiné à 390 × 844, 763 × 998 et 1440 × 1000 ; la vidéo remplit le cadre et aucun débordement horizontal observé. Aucune erreur dans les journaux consultés. Les conditions système de réduction des animations et d’économie de données n’ont pas été simulées pour cette passe ; aucun appareil physique testé.

## 1er octobre 2026 — Site complet, espace intérieur

Contrôles exécutés localement sur `version-astra`, dans le navigateur intégré, à `http://127.0.0.1:8000/`. Cette passe concerne les huit pages du site complet. Les comptes rendus plus bas décrivent les versions antérieures.

- Les huit pages ont été chargées en français et en anglais à 320 × 568 et 1440 × 1000, soit 32 combinaisons. Aucun débordement horizontal du document, aucune boîte de titre hors écran et aucune image déjà chargée en erreur dans ces contrôles. Les premières vues et plusieurs scènes intérieures ont également été examinées à 390 × 844 et dans la fenêtre normale de l’aperçu.
- Contrastes et superposition des textes/photos corrigés dans les chambres du journal et l’ouverture de la collection. Les photos de couverture, carnets, matières, traces, réserve et les œuvres agrandies ont été relues visuellement.
- Collection : filtres peintures et souvenirs, lot suivant de 18 à 36, visionneuse, image suivante, zoom, fermeture Échap, retour du focus à la carte et lien direct vers `#fragment/la-main` exécutés. L’ancien lien d’accueil `?collection=paintings#gallery` ouvre bien 18 peintures sur 29 ; les deux fermetures successives rendent la page puis le focus au logo.
- Réserve : filtre atelier (15 sur 15), retour à tout (16 sur 73), progression (32 sur 73), ouverture d’une archive, zoom, image suivante et fermeture exécutés.
- Index partagé : ouverture sur mobile, huit liens présents, fermeture et navigation réelle vers l’accueil. Langue et mouvement réduit conservés entre journal et accueil ; le réglage réduit désactive la rivière horizontale liée au scroll.
- Les quatre films ont été chargés et leur lecture observée : progression du temps, fichiers valides, silence initial. Les deux films des carnets ont été lus sur grand écran ; les deux films de l’accueil ont été contrôlés à 390 pixels. Le film des carnets se met en pause à l’ouverture de l’index.
- Les cartes du catalogue utilisent maintenant les variantes 480/800/1200 pixels ; les visionneuses gardent le fichier entier. Les sources responsive ont été constatées dans le document chargé.
- Aucune erreur ou alerte JavaScript dans les journaux consultés pendant ces parcours. Syntaxe des onze scripts actifs et des deux validateurs contrôlée avec `node --check`. `git diff --check` sans erreur.

Sorties des validateurs :

```text
OK — 115 entrées, 230 variantes, aucun lien local manquant sur 8 pages.
OK — 29 peintures, 26 encres, 60 photographies.
OK — navigation complète, ancres historiques, identifiants, polices, dimensions et références des œuvres.
OK — 400 sources responsive, couverture et catalogue accessibles sans script.
OK — 8 pages reliées sans script, 1095 références locales, aucune ancre manquante.
OK — 114 archives utilisées, 333 images et variantes, descriptions FR et EN, 73 fragments et filtres déclarés.
OK — crédits des caves, hommage, affiche de 2017, deux films des carnets et vidéos configurées à la demande.
OK — ressources du voyage, références photo/souvenir/œuvre et absence des anciennes feuilles de présentation.
```

Limites : tailles de fenêtre simulées, sans téléphone physique ni validation Safari/Firefox séparée. Pas de mesure de performance sur réseau mobile réel, pas de test de partage vers une application externe. Le glissement tactile de la nouvelle collection reste à essayer sur appareil physique. La navigation sans JavaScript est contrôlée statiquement par les liens HTML, pas par une session de navigateur dédiée. Ce site statique ne dispose pas de compilation, TypeScript ou scripts npm. Aucun paquet installé, aucune fusion, aucun envoi et aucun déploiement.

## 13 septembre 2026 — Quinze feuilles d’un même matin

Quinze HEIC convertis en WebP avec orientation EXIF appliquée (quatorze en 1350 × 1800, une en 1800 × 1350), variantes 480 et 900 : 45 fichiers, 6 258 780 octets, dont 712 Ko chargés au plus sur mobile et 1952 Ko sur ordinateur pour toute la section. `node tools/validate-journal.mjs`, après report des commits sur `main` : 8 pages, 976 références locales, 213 archives utilisées, 625 images et variantes, descriptions FR et EN. `node --check js/journal.js` et `git diff --check` sans erreur. Contrôle Playwright en local : à 1440 px la section `#feuilles` compte vingt liens `data-photo`, la page trente identifiants uniques, la visionneuse annonce « 13 / 30 » sur le fusain en négatif, aucune erreur console, aucune requête en échec, aucun débordement horizontal ; à 390 px, vingt et une pièces révélées, aucun débordement.

## 11 septembre 2026 — Le journal, par échos

`tools/verify-reverie.mjs` passe **13/13 groupes** et la suite de non-régression `tools/verify-hors-cadre.mjs` repasse **21/21 groupes** sur le code final.

Les six pages concernées sont vérifiées en FR/EN à 320, 360, 390, 430, 700, 768, 1440 et 1920 px : **96 compositions** sans débordement de page, titre, texte principal ou légende d’association. Douze audits axe, un par page et par langue, ne signalent aucune violation WCAG A/AA. Les associations ouvertes sont incluses dans ces audits. Les captures des compositions clés ont été relues à 390 et 1440 px.

Contrôles fonctionnels : six liens directs du sommaire ; fragment choisi stable ; texte original de Camilo ; manuscrit ouvrable ; ordre des quatre photographies des caves, crédits et hommage ; correspondance du gros plan avec l’image entière ; affiche, dates et noms conservés ; neuf images d’associations ouvertes au toucher avec retour au lien d’origine ; fermeture d’une association au clavier ; 73 éléments d’inventaire, filtres et passage de 16 à 32 éléments ; trois liens visuels entre les pages. Sans JavaScript, les associations natives s’ouvrent, l’inventaire entier est visible et un lien accède directement au WebP.

Un rejet de transition native a été reproduit en ouvrant un WebP sans JavaScript. Le mode sans script n’active plus ces transitions décoratives ; avec script, les promesses des transitions annulées sont traitées. Un test d’annulation explicite et le parcours réel sans script passent. Aucun rejet JavaScript, service externe ou fichier original HEIC/JPEG/TIFF observé dans la suite finale.

Validations statiques : 115 œuvres, 8 pages, 942 références locales, 198 archives utilisées et 580 fichiers/variantes référencés. Syntaxe de `js/motion.js` et du test, puis `git diff --check`, sans erreur. Aucun nouveau fichier image ou vidéo ; la nouvelle feuille de composition est limitée aux six pages. L’accueil et Hors cadre ne reçoivent que le correctif partagé de navigation.

Limites : Chrome local, formats mobiles et toucher émulés ; aucun iPhone physique ni audit Safari/Firefox. Les audits automatisés ne constituent pas une certification d’accessibilité. Travail local sur `codex/art-digital`.

## 11 septembre 2026 — Révision des souvenirs et retrait de la photo erronée

La suite navigateur passe **21/21 groupes** après mise à jour des attentes à 84 archives. Nouveau contrôle : les neuf souvenirs gardent chacun une surface présente dans le cadre à 320, 390, 700, 768 et 1440 px, avec masque et transparence ; les neuf liens s’ouvrent à la touche Entrée et la visionneuse se ferme avec Échap sur mobile émulé. Les vérifications existantes FR/EN, sans JavaScript, vidéo, navigation et les trois audits axe restent verts.

Les captures de la surface entière ont été relues à 390 et 1440 px, ainsi que le carnet désormais seul. La composition mobile coupe volontairement les images, sans débordement horizontal de la page. Les effets réutilisent les WebP existants ; `sizes` suit les nouvelles largeurs. Aucun nouveau média ni animation continue.

La photo de chiffres raturés `hc-75` est absente du HTML, de la sélection, du manifeste et du répertoire d’exports. Ses trois WebP restent récupérables dans l’historique Git ; l’original source est intact. Validations statiques : 115 œuvres, 8 pages, 905 références locales, 198 archives utilisées et 580 fichiers/variantes référencés. Syntaxe du test et `git diff --check` passent.

Vérifications sous Chrome local avec émulation mobile ; pas de test sur iPhone physique ou Safari. Modifications locales uniquement sur `codex/art-digital`.

## 11 septembre 2026 — Hors cadre, branche `codex/art-digital`

La suite `tools/verify-hors-cadre.mjs` termine avec **20/20 groupes de contrôles** dans Chrome local. Elle couvre les 85 archives, les cinq suites de peinture, le zoom, les liens directs, le retour au lien d’origine, les flèches, le curseur au clavier et un glissement tactile envoyé au moteur du navigateur.

Les deux nouvelles pages ont été contrôlées en français et anglais à 320, 360, 390, 430, 768, 1024, 1440 et 1920 px : **32 compositions**, sans débordement de page ni de titre. Les six pages existantes du journal ont aussi été parcourues à 390 et 1440 px avec leur lien vers Hors cadre. La collection existante a été utilisée : filtre des encres, visionneuse, fermeture et passage de 12 à 24 œuvres.

Les deux nouveaux films ont réellement décodé des images dans le navigateur mobile émulé. Silence, choix de la source mobile, pause volontaire, arrêt hors écran et derrière la visionneuse, changement de langue, mouvement réduit et économie de données ont été vérifiés. Une panne réseau simulée affiche le poster et un message ; le bouton recharge ensuite le film avec succès. Une lecture demandée depuis les commandes reste possible lorsque seule une partie du fond est visible.

Trois audits axe WCAG 2 A/AA et 2.1 AA — accueil, nouveau chapitre et visionneuse — ne détectent aucune violation. Les pages et les suites natives restent utilisables sans JavaScript. Aucune erreur JavaScript, aucune requête vers un service extérieur et aucun téléchargement de fichier HEIC ou JPEG d’origine n’ont été observés dans ces parcours.

Les 250 fichiers WebP des nouvelles archives ont été inspectés : dimensions conformes au manifeste, variantes de largeur correcte et espace sRGB. Les quatre MP4 ont une seule piste H.264 à 24 images/s, sans audio, avec index de lecture placé avant les données. Les mesures de taille sont consignées dans `HORS-CADRE.md`.

Les validations statiques passent : 115 œuvres, 8 pages, 907 références locales, 199 archives utilisées, 583 images et variantes référencées. Syntaxe de `app.js`, `films.js`, `motion.js` et `art-digital.js`, puis `git diff --check`, sans erreur. Les nouveaux écrans et sections ont été relus visuellement dans les captures mobile et ordinateur.

Limites : émulation Chrome, sans iPhone physique ni Safari/Firefox. Les tailles de fichiers ne sont pas des mesures de vitesse sur un réseau mobile réel. Les audits automatisés ne constituent pas une certification. Aucun push, aucune fusion, aucune publication.

## Historique — 10 septembre 2026

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
