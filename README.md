# Camilo Rivera — portfolio

Site personnel de Camilo Rivera, artiste peintre à Bramois, Valais.

La version `version-astra` propose une galerie éditoriale bilingue, un parcours animé au défilement, une navigation mobile en bas d’écran et une visionneuse accessible. La collection comprend 29 peintures, 26 encres et 60 photographies d’atelier.

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
- `js/dims.generated.js` : dimensions générées des images, à conserver comme fichier généré.
- `images/` et `fonts/` : ressources locales, sans téléchargement depuis un service tiers.

Le filtre initial présente les peintures et encres dans l’ordre du catalogue. Les photos ont leur propre filtre. Douze images sont affichées à la fois ; la visionneuse permet de parcourir toute la catégorie choisie.

Les commandes de partage proposent l’URL canonique de l’œuvre. La prise de contact ouvre un courrier avec la référence de l’œuvre, sans l’envoyer.

Les préférences de langue et de mouvement sont mémorisées localement. Si ce stockage est bloqué, le site continue de fonctionner. Le réglage système de réduction des animations est prioritaire.

## Contrôles locaux

```sh
node --check js/app.js
node tools/validate-portfolio.mjs
git diff --check
```

Le validateur vérifie les références aux images, variantes et polices, les métadonnées du catalogue, les identifiants, les ancres et les liens locaux. Les interactions et le rendu demandent également des essais dans un navigateur.

Consulter `works.README.md` pour enrichir le catalogue et `docs/DECISIONS.md` pour les choix de cette refonte. `RAPPORT-PORTFOLIO-2026.md` décrit une version antérieure et reste un document historique.

## Publication

La configuration existante est conservée. Cette branche doit être revue avant toute fusion ou publication.
