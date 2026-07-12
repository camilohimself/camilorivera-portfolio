# works.json — la source de vérité de la galerie

`works.json` est un **tableau ordonné** : l'ordre du tableau = l'ordre d'affichage
de la galerie. Pour **recurater** l'ordre, il suffit de réordonner les entrées du
tableau (aucun code à toucher). `js/app.js` fait `fetch('works.json')` au chargement
et construit la galerie dans cet ordre.

## Schéma d'une entrée

```json
{
  "slug": "abstrait-007",
  "file": "lejaune.webp",
  "category": "paintings",
  "title": "Abstrait 007",
  "technique": "Huile sur toile",
  "year": null,
  "dimensions": null,
  "available": null
}
```

- `slug` — identifiant stable, utilisé dans les deep-links `#oeuvre/<slug>`.
  **Ne jamais changer un slug existant** : des liens partagés en dépendent.
  Conventions : `abstrait-NNN` (peintures), `encre-NNN` (encres),
  `atelier-NN` (atelier, séquentiel 01-60).
- `file` — nom du fichier `.webp` dans `images/<category>/`.
- `category` — `paintings` | `encres` | `shooting`.
- `title` — « Abstrait NNN » / « Encre NNN » pour les œuvres ; `null` pour l'atelier
  (les photos de l'atelier ne sont pas des œuvres titrées).
- `technique` — « Huile sur toile » | « Encre de Chine » | « Atelier ».
- `year`, `dimensions`, `available` — `null` aujourd'hui. L'UI n'affiche ces champs
  que s'ils sont renseignés (rendu conditionnel déjà en place). L'artiste les
  complétera plus tard sans changer une ligne de code.

## Ajouter une nouvelle œuvre

1. **Déposer** le fichier `.webp` (largeur ~1200px) dans `images/<category>/`.
2. **Lancer** `tools/generate-image-variants.sh` (génère les variantes 480w/800w
   et régénère `js/dims.generated.js`).
3. **Ajouter** une entrée dans `works.json`, à la position d'affichage voulue.
   - Choisir un `slug` unique dans sa série. Un `NNN` aléatoire à 3 chiffres
     convient (ex. `abstrait-742`) ; vérifier qu'il n'est pas déjà pris.

## Séparation généré / curaté

- **Généré (auto)** : `js/dims.generated.js` (dimensions par fichier) via
  `tools/generate-image-variants.sh`. Ne pas éditer à la main.
- **Curaté (humain)** : `works.json` (titres, ordre, techniques, métadonnées).
  Les dimensions ne sont **pas** dupliquées ici — elles vivent dans `dims.generated.js`.
