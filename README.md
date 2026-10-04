# Study of Space

The repo and the Claude Code skill are called `poster-bg`; the site is **Study of Space**, named after the 1958 installation by Wojciech Fangor and Stanisław Zamecznik.

Seeded SVG backgrounds in the spirit of the Polish School of Posters, 60s/70s geometric modernism and Wojciech Fangor's soft op art. One dependency-free generator (`poster-bg/scripts/gen.js`), a [Claude Code](https://claude.com/claude-code) skill that drives it, and a standalone dark generator page.

**[Open the generator](https://studyofspace.gallery/generator/)**

**[Visit the site](https://studyofspace.gallery/)**

The same motif, palette and seed always give the same image, so any result can be reproduced or varied by changing only the seed.

### Polish School motifs (`--poster`)

| | | |
|---|---|---|
| ![Stripes, baron](examples/poster-stripes-baron.svg) | ![Rings, brasilia](examples/poster-rings-brasilia.svg) | ![Mosaic, roger](examples/poster-mosaic-roger.svg) |
| `stripes` · `baron` | `rings` · `brasilia` | `mosaic` · `roger` |
| ![Blob, marek](examples/poster-blob-marek.svg) | ![Diagonals, anima](examples/poster-diagonals-anima.svg) | ![Steps, wesoft](examples/poster-steps-wesoft.svg) |
| `blob` · `marek` | `diagonals` · `anima` | `steps` · `wesoft` |

### Op art, constructivism and Zamecznik

| | | |
|---|---|---|
| ![Squares](examples/squares.svg) | ![Wavy stripes](examples/stripewave.svg) | ![Oscillogram](examples/scope.svg) |
| `squares` · `soft_orchid` | `stripewave` · `stanczak` | `scope` · `zamecznik` |
| ![Stripes and disc](examples/stripedisc.svg) | ![Constructivist](examples/construct.svg) | ![Cut-out](examples/cutout.svg) |
| `stripedisc` · `zamecznik` | `construct` · `konstruktywizm` | `cutout` · `lenica` |
| ![Rhythm bars](examples/bars.svg) | ![Multiply and rotate](examples/rotor.svg) | ![Sunburst](examples/sunburst.svg) |
| `bars` · `jazz` | `rotor` · `zamecznik` | `sunburst` · `cyrk` |
| ![Outlined stains](examples/outline.svg) | ![Halftone](examples/halftone.svg) | ![Moire](examples/moire.svg) |
| `outline` · `mlodozeniec` | `halftone` · `stanczak` | `moire` · `zamecznik` |
| ![Block letters](examples/letters.svg) | ![Unism](examples/unism.svg) | |
| `letters` · `jazz` | `unism` · `zamecznik` | |

Women artists:

| | | |
|---|---|---|
| ![Organic rhythm](examples/jarema.svg) | ![Election constructivism](examples/blok.svg) | ![Spatial planes](examples/planes.svg) |
| `jarema` · `jarema` | `blok` · `blok` | `planes` · `kobro` |
| ![Wooden relief](examples/relief.svg) | ![Woven strips](examples/weave.svg) | |
| `relief` · `golkowska` | `weave` · `abakan` | |

### Fangor styles (`--fangor`, `--ring`, `--dream`)

| | | |
|---|---|---|
| ![Dream, navy](examples/dream-navy.svg) | ![Dream, flag](examples/dream-flag.svg) | ![Dream, spectrum](examples/dream-spectrum.svg) |
| `dream` · `dream_navy` · seed 2 | `dream` · `dream_flag` · seed 8 | `dream` · `dream_spectrum` · seed 5 |
| ![Dream, azure](examples/dream-azure.svg) | ![Dream, sun](examples/dream-sun.svg) | ![Dream, candy](examples/dream-candy.svg) |
| `dream` · `dream_azure` · seed 3 | `dream` · `dream_sun` · seed 5 | `dream` · `dream_candy` · seed 11 |
| ![Fangor, blue](examples/fangor-blue.svg) | ![Ring, orchid](examples/ring-orchid.svg) | ![Ring, flame](examples/ring-flame.svg) |
| `fangor` · `fangor_blue` | `ring` · `soft_orchid` | `ring` · `soft_flame` |

### Color presets

83 palettes in four groups. A few of the Dream ones:

| | | |
|---|---|---|
| ![Ocean](examples/palette-ocean.svg) | ![Pop](examples/palette-pop.svg) | ![Sunset](examples/palette-sunset.svg) |
| `dream_ocean` | `dream_pop` | `dream_sunset` |
| ![Ember](examples/palette-ember.svg) | ![Forest](examples/palette-forest.svg) | ![Ice](examples/palette-ice.svg) |
| `dream_ember` | `dream_forest` | `dream_ice` |

## Use it from the command line

Needs Node, nothing else.

```bash
node poster-bg/scripts/gen.js --dream --out waves.svg
node poster-bg/scripts/gen.js --ring --colors random --circle 1.2 --x 0.4 --y 0.6 --out ring.svg
node poster-bg/scripts/gen.js --motif mosaic --palette roger --grain 18 --out mosaic.svg
node poster-bg/scripts/gen.js --poster --seed 12 --size 1440x900 --out poster.svg
```

It prints `motif=… palette=… seed=… size=…` to stderr, which is the recipe for reproducing the image.

| Flag | Meaning |
|---|---|
| `--poster` | random Polish-School motif (any of the non-Fangor motifs below) |
| `--fangor` | Fangor's vibrating concentric discs |
| `--ring` | one simple soft ring, 3 to 5 inks |
| `--dream` | flowing wavy bands with soft edges |
| `--motif m`, `--palette p` | pin a motif and/or a palette |
| `--colors random` | harmonious random colors (seeded) |
| `--seed N`, `--size WxH` | seed and size (default 1200x1600) |
| `--circle N`, `--x N`, `--y N` | size (0.5 to 1.5) and centre (0 to 1) for `ring`, `fangor`, `dream` |
| `--angle N` | rotation in degrees: wave direction for `dream`, tilt of the ellipses for `fangor` |
| `--amp N`, `--wavelength N`, `--softness N` | `dream` only: wave height, length and edge softness (about 0.2 to 2.5) |
| `--grain N` | mosaic tiles across the width (5 to 30) |

Every motif has its own settings, the same ones the generator page shows as sliders. Pass them as `--key value` (for `dream` the wave flags are `--amp`, `--wavelength` and `--softness` above).

| Motif | Settings (flag, range) |
|---|---|
| `stripes` | `--height` 0.4 to 2.5, `--solid` 0 to 1, `--jitter` 0 to 4, `--angle` 0 to 180 |
| `rings` | `--disc` 0.5 to 1.6, `--towers` 0.3 to 1.6, `--x` 0 to 1, `--y` 0 to 1, `--bowl` 0 to 1 |
| `mosaic` | `--skip` 0 to 0.85, `--accents` 0 to 0.5, `--tile` 0.5 to 1.6, `--tilt` 0 to 4 |
| `blob` | `--scale` 0.5 to 1.8, `--count` 1 to 8, `--edge` 0 to 2, `--halo` 0.3 to 2.2, `--x` 0 to 1, `--y` 0 to 1 |
| `diagonals` | `--cols` 2 to 10, `--fill` 0.3 to 1, `--accents` 0 to 0.6, `--square` 0.3 to 0.95 |
| `steps` | `--count` 3 to 14, `--width` 0.3 to 0.98, `--base` 0.5 to 0.97, `--height` 0.4 to 1.7, `--mix` 0 to 1 |
| `fangor` | `--rings` 3 to 14, `--squash` 0.4 to 1.2, `--centre` 0.02 to 0.4, `--spread` 0.3 to 0.8, `--echo` 0 to 0.6 |
| `ring` | `--hole` 0.02 to 0.6, `--blend` 0.005 to 0.16, `--spread` 0.45 to 0.9, `--halo` 0.03 to 0.3 |
| `dream` | `--ripple` 0 to 0.7, `--variety` 0 to 2.2, `--shift` 0 to 6.28 |
| `stripewave` | `--width` 0.5 to 2.5, `--amp` 0.2 to 3, `--wave` 0.5 to 2, `--drift` 0 to 0.8, `--angle` 0 to 360 |
| `scope` | `--lines` 3 to 30, `--freq` 6 to 80, `--amp` 0.2 to 2.5, `--weight` 0.4 to 3, `--rings` 0 to 1 |
| `stripedisc` | `--width` 0.5 to 2.5, `--disc` 0.4 to 1.8, `--bars` 0 to 12, `--x` 0 to 1, `--y` 0 to 1 |
| `construct` | `--grid` 3 to 14, `--count` 2 to 20, `--thick` 0.4 to 2.5, `--disc` 0.4 to 2, `--accent` 0 to 0.5 |
| `cutout` | `--count` 2 to 14, `--jag` 0 to 1.5, `--scale` 0.5 to 1.6 |
| `bars` | `--count` 4 to 48, `--rhythm` 0.1 to 1.6, `--gap` 0 to 1.2, `--mirror` 0 to 1 |
| `rotor` | `--copies` 4 to 64, `--tilt` -70 to 70, `--form` 0 to 2, `--length` 0.08 to 0.5, `--inner` 0.02 to 0.3, `--x` 0 to 1, `--y` 0 to 1 |
| `sunburst` | `--rays` 6 to 72, `--rings` 1 to 10, `--twist` -2 to 2, `--x` 0 to 1, `--y` 0 to 1 |
| `outline` | `--count` 1 to 10, `--thick` 0.3 to 3, `--offset` 0 to 3, `--wobble` 0 to 1.5 |
| `halftone` | `--spacing` 0.012 to 0.08, `--angle` 0 to 90, `--field` 0 to 2, `--gain` 0.4 to 1.8, `--duo` 0 to 1 |
| `moire` | `--spacing` 0.004 to 0.03, `--diff` 0.3 to 20, `--mode` 0 to 2, `--angle` 0 to 180, `--weight` 0.4 to 2, `--duo` 0 to 1 |
| `letters` | `--word` 0 to 7, `--layout` 0 to 2, `--scale` 0.4 to 1.4, `--gap` 0 to 0.4, `--bars` 0 to 6, `--angle` 0 to 360, `--x` 0 to 1, `--y` 0 to 1 |
| `unism` | `--lines` 16 to 140, `--field` 0 to 3, `--contrast` 0.4 to 1.6, `--angle` 0 to 180, `--duo` 0 to 1 |
| `jarema` | `--count` 3 to 16, `--flow` 0 to 1.6, `--wobble` 0 to 2, `--scale` 0.5 to 1.6 |
| `blok` | `--angle` -45 to 45, `--bars` 0 to 8, `--disc` 0.5 to 2, `--tiles` 0 to 1 |
| `planes` | `--count` 2 to 14, `--spread` 0.3 to 1.8, `--scale` 0.5 to 1.6 |
| `relief` | `--grid` 4 to 16, `--amp` 0.3 to 1.8, `--rhythm` 0.3 to 2.2 |
| `weave` | `--strips` 3 to 24, `--sway` 0 to 2, `--texture` 0.4 to 2.5 |
| `squares` | `--round` 0 to 0.5, `--hole` 0.04 to 0.45, `--soft` 0.2 to 2.5 |
| every poster motif | `--misreg` 0 to 6 (off-register print) |
| every motif | `--speckle` 0 to 3 (paper grain) |

There are 83 palettes in four groups (poster, `fangor_*`, `soft_*` for ring and squares, `dream_*`). Run the script with an unknown palette name to list all motifs and palettes.

## Use it as a Claude Code skill

Copy the skill folder into your skills directory:

```bash
cp -R poster-bg ~/.claude/skills/
```

Then in Claude Code: `/poster-bg --dream`, or just ask for "three blue Fangor rings". The skill reports the recipe line so you can reproduce a result.

## Generator page

`generator/index.html` is a standalone dark UI: one motif list grouped by the artist who inspired it, sliders for every motif, a palette with editable and removable colors, random colors, seed, size presets, mosaic granularity, history, SVG and PNG export, a button that copies the matching CLI command, and a floating bar at the bottom with Random motif, colors and seed buttons plus Randomize all.

It loads `gen.js` with a relative path, so serve the repository root, for example:

```bash
python3 -m http.server
# then open http://localhost:8000/generator/
```

Live: <https://studyofspace.gallery/generator/>. The landing page is at <https://studyofspace.gallery/>.

## How it works

Every motif is a function `(r, palette, w, h, options) → { defs, body }` built from plain SVG shapes and gradients, driven by a seeded random generator. There are no filters: even the soft edges of `dream` come from stacks of translucent strokes, so the output imports into design tools as ordinary vectors.

New palettes are one entry in `PALETTES`; new motifs are one function registered in `MOTIFS` (see the skill's "Extending" section).

## Roadmap

Candidate motifs from the Polish poster tradition (oscillogram, stripes with a disc, multiply and rotate, cut-outs and more) are collected in [docs/motif-research.md](docs/motif-research.md).

## Portraits

The ASCII portraits on the landing page (`portraits/ascii.js`) are made from photos on Wikimedia Commons. Each card credits the photographer and the license. Photos under CC BY-SA (Wanda Gołkowska by Jan Chwałczyk, Magdalena Abakanowicz by Kontrola, Jan Młodożeniec by Piotr Młodożeniec) give an ASCII version that stays under CC BY-SA too; the rest are public domain on Commons. The code itself is MIT.

## Credits

Inspired by the Polish School of Posters and by the paintings of Wojciech Fangor. These are styles and techniques, not copies of any particular work.

MIT licensed.
