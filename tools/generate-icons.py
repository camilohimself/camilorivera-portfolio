"""Icônes du site depuis le monogramme « cr. » de l’en-tête.

Le tracé vient de fonts/dm-sans-400.woff2, avec les réglages de .signature
dans css/journey.css : interlettrage −0,12 em, point décalé de 3 px pour 37 px.
Produit favicon.svg (clair, et sombre selon la préférence du système),
apple-touch-icon.png et favicon.ico.

Outils du poste, absents du site publié : Python 3 avec fontTools et brotli,
ImageMagick 7 (magick).  Usage : python3 tools/generate-icons.py
"""
import pathlib
import subprocess
import tempfile

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
WHITE, BLACK = '#f7f7f2', '#111210'  # --white et --black de css/journey.css
TRACKING = -0.12                      # letter-spacing de .signature
DOT_OFFSET = 3 / 37                   # margin-left de .signature-dot, en em


def monogram():
    font = TTFont(ROOT / 'fonts/dm-sans-400.woff2')
    upm = font['head'].unitsPerEm
    glyphs, cmap = font.getGlyphSet(), font.getBestCmap()
    x, placed = 0.0, []
    for char in 'cr.':
        if char == '.':
            x += DOT_OFFSET * upm
        name = cmap[ord(char)]
        placed.append((name, x))
        x += glyphs[name].width + TRACKING * upm
    bounds = BoundsPen(glyphs)
    for name, dx in placed:
        glyphs[name].draw(TransformPen(bounds, (1, 0, 0, 1, dx, 0)))
    return glyphs, placed, bounds.bounds


def path_data(glyphs, placed, scale, tx, ty):
    pen = SVGPathPen(glyphs, ntos=lambda v: f'{v:.2f}'.rstrip('0').rstrip('.'))
    for name, dx in placed:
        # Les polices montent vers le haut ; le SVG descend : y est retourné.
        glyphs[name].draw(TransformPen(pen, (scale, 0, 0, -scale, tx + dx * scale, ty)))
    return pen.getCommands()


def svg(size, padding, radius, dark_mode):
    glyphs, placed, (xmin, ymin, xmax, ymax) = monogram()
    scale = (size - 2 * padding) / (xmax - xmin)
    tx = padding - xmin * scale
    ty = size / 2 + (ymin + ymax) / 2 * scale  # centrage optique sur la boîte des lettres
    d = path_data(glyphs, placed, scale, tx, ty)
    theme = ''
    if dark_mode:
        theme = (f'<style>rect{{fill:{WHITE}}}path{{fill:{BLACK}}}'
                 f'@media (prefers-color-scheme:dark){{rect{{fill:{BLACK}}}path{{fill:{WHITE}}}}}</style>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}">{theme}'
            f'<rect width="{size}" height="{size}" rx="{radius}" fill="{WHITE}"/>'
            f'<path fill="{BLACK}" d="{d}"/></svg>\n')


def render(svg_text, size, out):
    with tempfile.NamedTemporaryFile('w', suffix='.svg', delete=False) as tmp:
        tmp.write(svg_text)
    subprocess.run(['magick', '-background', 'none', '-density', '600', tmp.name,
                    '-resize', f'{size}x{size}', '-strip', str(out)], check=True)
    pathlib.Path(tmp.name).unlink()


if __name__ == '__main__':
    (ROOT / 'favicon.svg').write_text(svg(64, 9, 12, dark_mode=True), encoding='utf-8')
    # iOS arrondit lui-même les angles : l’icône reste pleine.
    render(svg(180, 30, 0, dark_mode=False), 180, ROOT / 'apple-touch-icon.png')
    with tempfile.TemporaryDirectory() as tmp:
        sizes = []
        for size in (16, 32, 48):
            png = pathlib.Path(tmp) / f'{size}.png'
            render(svg(64, 9 if size > 16 else 6, 12, dark_mode=False), size, png)
            sizes.append(str(png))
        subprocess.run(['magick', *sizes, str(ROOT / 'favicon.ico')], check=True)
    print('favicon.svg, apple-touch-icon.png et favicon.ico écrits')
