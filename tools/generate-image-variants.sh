#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# CAMILO RIVERA — Portfolio 2026
# Génération des variantes responsive (480w / 800w) + dims.generated.js
#
# QUAND RELANCER CE SCRIPT : à chaque ajout d'œuvre dans
# images/paintings/, images/encres/ ou images/shooting/.
# Il est idempotent : les variantes déjà à jour sont ignorées, seuls
# les nouveaux fichiers (ou les originaux modifiés) sont ré-encodés.
# Le fichier js/dims.generated.js est toujours réécrit en entier.
#
# ─── AJOUTER UNE NOUVELLE ŒUVRE (workflow complet) ───
#   1. Déposer le fichier .webp dans images/<catégorie>/
#   2. Lancer CE script (génère les variantes 480w/800w + dims.generated.js)
#   3. Ajouter une entrée dans works.json (à la racine) — voir works.README.md
#
# SÉPARATION GÉNÉRÉ / CURATÉ :
#   - js/dims.generated.js (dimensions par fichier) = AUTO-GÉNÉRÉ ici.
#   - works.json (titres, ordre, techniques) = CURATÉ à la main. Les
#     dimensions n'y sont PAS dupliquées — elles restent dans dims.generated.js.
#
# Prérequis : cwebp (encodage WebP), sips (lecture des dimensions,
# outil natif macOS).
#
# Usage : ./tools/generate-image-variants.sh
# ═══════════════════════════════════════════════════════════════

set -euo pipefail

# Se placer à la racine du site (ce script vit dans tools/)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

CATEGORIES=("paintings" "encres" "shooting")
WIDTHS=(480 800)
QUALITY=78

DIMS_FILE="js/dims.generated.js"

created_count=0
skipped_count=0

# Accumulateur pour le bloc JS des dimensions (une ligne par image)
dims_lines=""

for category in "${CATEGORIES[@]}"; do
  dir="images/$category"
  [ -d "$dir" ] || continue

  # Boucle sur chaque .webp du dossier — gère les espaces/parenthèses
  # via un glob quoté (pas de `ls | while read`, ni de `find` non-null).
  for src in "$dir"/*.webp; do
    [ -e "$src" ] || continue

    filename="$(basename "$src")"
    stem="${filename%.webp}"

    # Ne pas retraiter une variante déjà générée comme si c'était un
    # original (sinon le glob *.webp l'attrape au run suivant et on
    # obtient des fichiers -480-800.webp en cascade). Une variante se
    # termine toujours par -480 ou -800.
    if [[ "$stem" =~ -(480|800)$ ]]; then
      continue
    fi

    # ── Dimensions de l'ORIGINAL (pour DIMS + décision d'upscale) ──
    src_width="$(sips -g pixelWidth "$src" | awk '/pixelWidth:/{print $2}')"
    src_height="$(sips -g pixelHeight "$src" | awk '/pixelHeight:/{print $2}')"

    dims_lines+="  '${category}/${filename}': [${src_width}, ${src_height}],
"

    # ── Variantes 480w / 800w ──
    for width in "${WIDTHS[@]}"; do
      variant="$dir/${stem}-${width}.webp"

      # Idempotence : on saute si la variante existe déjà et est plus
      # récente que la source (elle est donc déjà à jour).
      if [ -e "$variant" ] && [ "$variant" -nt "$src" ]; then
        skipped_count=$((skipped_count + 1))
        continue
      fi

      if [ "$src_width" -le "$width" ]; then
        # Pas d'upscale : on encode à la largeur native sous le nom suffixé.
        cwebp -q "$QUALITY" -resize "$src_width" 0 "$src" -o "$variant" >/dev/null 2>&1
      else
        cwebp -q "$QUALITY" -resize "$width" 0 "$src" -o "$variant" >/dev/null 2>&1
      fi

      created_count=$((created_count + 1))
    done
  done
done

# ── Écriture de js/dims.generated.js ──────────────────────────
{
  echo "// AUTO-GÉNÉRÉ par tools/generate-image-variants.sh — ne pas éditer à la main"
  echo "// Dimensions intrinsèques des images originales (clé = 'catégorie/fichier.webp')"
  echo "const DIMS = {"
  printf '%s' "$dims_lines"
  echo "};"
} > "$DIMS_FILE"

echo "Variantes générées/mises à jour : $created_count"
echo "Variantes déjà à jour (ignorées) : $skipped_count"
echo "Dimensions écrites dans : $DIMS_FILE"
