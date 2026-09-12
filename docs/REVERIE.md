# Le journal, par échos — 11 septembre 2026

Camilo valide huit pistes : prolonger l’approche onirique dans les autres pages, avec un bénéfice réel pour la lecture et une priorité mobile. Travail sur `codex/art-digital`, après `8f8acdd`.

## Composition

- **Les caves** : les quatre photographies de David Zuber restent dans leur ordre. La lumière d’ouverture est visible dans l’image entière. Le mur est approché, la salle suivante se tient à distance, le couloir retrouve une grande largeur. Le texte sur la disparition du bâtiment vient désormais après cette traversée, puis l’hommage à Alban Reynard sur une surface calme. Aucun lieu, récit ou crédit inventé.
- **Les carnets** : la véritable photographie de mots manuscrits reste ouvrable, mais entre dans la marge. La silhouette `un-trait` forme un verso décoratif atténué et masqué aux technologies d’assistance. Le nœud d’encre est placé comme une rémanence derrière une figure nette. Plusieurs titres éditoriaux sont remplacés par des intitulés simples ; les deux réflexions originales de Camilo restent intégrales.
- **La matière** : `le-rouge-revient` est montré d’abord en gros plan, puis en entier. Le même fichier assure que le détail appartient réellement à cette peinture. Un lien natif permet de rejoindre directement l’ensemble. Aucun défilement forcé, aucune animation à attendre, aucune altération des couleurs. La peinture sombre est désormais présentée entière et sans grand titre superposé.
- **Les traces** : l’affiche de 2017, les dates, le lieu et les noms restent lisibles. Le miroir est petit, adapté à sa définition de 150 × 150 px. Le portrait à la main tendue déborde de la marge, tandis que la présence à la fenêtre garde une échelle intime. La visionneuse restitue les images entières.
- **La réserve** : trois rapprochements de trois images, ouverts avec des éléments `details` natifs, précèdent l’inventaire. Ombre / silhouette / figure ; main / outil / trace ; œuvres dans des lieux. Les rapprochements sont explicitement visuels, pas chronologiques. L’inventaire conserve ses 73 fragments, ses catégories et son chargement progressif.
- **Le sommaire** : une seule image choisie (`au-bout-du-stylo`) accompagne un extrait exact de la réflexion de Camilo sur le geste. Un lien rejoint cette réflexion, un autre rejoint le film. La sélection ne change pas au hasard. Six liens directs complètent le sommaire illustré existant.
- **Les passages** : trois vrais liens visuels mènent des carnets à l’ombre photographiée, de la matière aux mains tachées de Hors cadre, puis des traces au portrait dans les reflets. Ils n’inventent pas de relation biographique entre les documents.
- **La voix et le silence** : les grands titres ne ponctuent plus systématiquement chaque groupe. Les invitations de navigation sont plus compactes. Les formulations personnelles de Camilo, leurs hésitations et répétitions ne sont pas réécrites.

## Technique et limites

`css/reverie.css` est chargé seulement dans les six pages concernées et ses règles sont rattachées à la classe `reverie`. L’accueil et Hors cadre gardent leur composition. Le HTML de ces pages est remis en lignes pour faciliter les prochaines interventions.

Tous les médias sont des WebP existants avec dimensions, descriptions FR/EN, `srcset`, `sizes` et chargement différé, sauf l’image d’ouverture prioritaire. Aucun réencodage, média généré, son, shader, canevas ou nouvelle boucle d’animation. Les masques et recadrages sont uniquement des choix de présentation ; les liens conservent les fichiers entiers. Les figures de la réserve sont composées verticalement sur téléphone et leurs légendes peuvent revenir à la ligne.

Les vérifications ont révélé une transition native rejetée en ouvrant un WebP sans JavaScript. Les transitions de page sont désormais désactivées dans ce mode, où les liens restent ordinaires. Avec JavaScript, les promesses d’une transition décorative annulée sont traitées explicitement ; cela ne bloque jamais la navigation. Ce correctif partagé et son numéro de version sont les seuls changements sur l’accueil et Hors cadre.

La citation d’ouverture ne constitue pas une nouvelle entrée datée du journal : c’est un fragment éditorial choisi dans une réflexion déjà présente. Les séquences de la réserve n’ajoutent pas de nouveaux éléments à l’inventaire ni aux manifestes. Les crédits de David Zuber accompagnent également sa photographie lorsqu’elle réapparaît dans une association.

## Vérification reproductible

Depuis `site-web`, lancer le serveur statique et les validateurs du README. `tools/verify-reverie.mjs` utilise les mêmes variables que `tools/verify-hors-cadre.mjs` : `PLAYWRIGHT_MODULE`, `AXE_PATH`, éventuellement `ART_BASE_URL`.

La suite contrôle les six pages en FR/EN sur huit largeurs, les liens éditoriaux, les faits conservés, les associations au toucher et au clavier, les filtres, la navigation sans JavaScript, les audits axe et les erreurs de navigation. L’émulation Chrome ne remplace pas un test sur téléphone physique ou Safari.
