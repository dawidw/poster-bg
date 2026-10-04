---
name: poster-bg
description: Generate poster-style graphics and random backgrounds in the spirit of the Polish School of Posters and 60s/70s geometric modernism, plus Wojciech Fangor's soft op art (vibrating discs, simple rings, flowing dream waves). Use for "plakat", "tło w stylu polskiej szkoły plakatu", geometric or retro backgrounds, Fangor-like images, or random backgrounds. Outputs SVG.
argument-hint: "[--poster | --fangor | --ring | --dream] [--colors random] [--circle N] [--x N --y N] [--grain N] [--angle N] [--amp N --wavelength N --softness N] [--seed N] [--size WxH] [--palette name] [--motif name]"
---

# Poster backgrounds

Seeded SVG generator plus a style guide. Same motif + palette + seed always gives the same image, so a result can be reproduced or varied by changing only the seed. `scripts/gen.js` has no dependencies and also runs in the browser; the live Generator page at https://dawidw.github.io/poster-bg-skill/generator/ loads the same file.

## Invocation

Arguments arrive as `$ARGUMENTS`. Read them as flags:

| Flag | Meaning |
|---|---|
| `--poster` | random Polish-School poster motif (stripes, rings, mosaic, blob, diagonals, steps) with a matching palette |
| `--fangor` | Fangor's vibrating concentric discs (motif `fangor`, the "Random" style in the page) |
| `--ring` (alias `--soft`) | one simple soft ring with 3 to 5 inks on a flat ground (motif `ring`) |
| `--dream` | flowing wavy bands with soft edges, after Fangor's wave paintings (motif `dream`) |
| no flag | behave like `--poster` unless the request clearly describes Fangor |
| `--colors random` | harmonious random colors instead of a preset palette; seeded, so the same seed gives the same colors |
| `--circle N` | size multiplier 0.5 to 1.5 for `ring`, `fangor` and `dream` (zoom); random for `ring` when omitted |
| `--x N`, `--y N` | centre of the circle (or of the wave pattern) as a fraction of width and height, 0 to 1 |
| `--angle N` | rotation in degrees: the wave direction for `dream` (random when omitted), the tilt of the ellipses for `fangor` |
| `--amp N`, `--wavelength N`, `--softness N` | `dream` only: wave height, wave length and edge softness as multipliers (about 0.2 to 2.5, default 1) |
| `--grain N` | mosaic only: tiles across the width (5 to 30, default 11) |
| `--seed N`, `--size WxH` | fix the seed; size defaults to 1200x1600, e.g. `1440x900` or `1280x800` (the 16:10 card on the playground index) |
| `--motif m`, `--palette p` | pin one or both instead of random |
| `--n 3` | make several variants with different seeds |

Plain-language requests ("zrób 3 fangory, niebieskie") map to the same flags.

## Run it

```bash
node scripts/gen.js --dream --out bg.svg
node scripts/gen.js --ring --colors random --circle 1.2 --x 0.4 --y 0.6 --out bg.svg
node scripts/gen.js --motif mosaic --palette roger --grain 18 --out bg.svg
node scripts/gen.js --poster --seed 12 --size 1440x900 --out bg.svg
```

It prints `motif=… palette=… seed=… size=…` to stderr. Always report that line so the result can be reproduced. Save SVGs in the user's current directory as `poster-bg-<motif>-<palette>-<seed>.svg` unless told otherwise.

Motifs: `stripes`, `rings` (split disc and towers), `mosaic` (mirrored tiles), `blob` (halo behind torn-paper shape), `diagonals`, `steps`, `fangor`, `ring`, `dream`.

Palettes: poster motifs use `baron`, `zloto`, `roger`, `marek`, `brasilia`, `anima`, `wesoft`, `mazur`, `jesien`, `moda`, `cyrk`. `fangor` uses names starting `fangor`, `ring` uses `soft_*`, `dream` uses `dream_*`. Run the script with a bad palette name to list them all.

Palette shape: `paper`, `dark`, `light`, `accent`, `inks`. For `soft_*` the inks run from the centre out (hole, bands, halo); an optional `core` (0 to 1) makes the hole a solid disc. For `dream_*` the inks are the bands across the waves, optional `glow` lights the darkest band's edge and `soft` widens the blur.

## Choosing

- Pick the motif for the mood, the palette for the colour story. Do not pin both at random unless the user asked for random.
- One hot accent per composition. If a palette has many inks (`brasilia`), use them as flat fields, not as gradients.
- Keep type out of the generated image. If the user wants a title, add it afterwards as live text, large, overlapping the shapes.
- Do not recreate a specific existing poster. The motifs borrow ideas (flat ink, soft rings, waves), not compositions or lettering.

## Extending

- New palette: add an entry to `PALETTES`. Check that `light` reads on `dark` and `dark` reads on `paper`. Prefixes `fangor`, `soft_` and `dream_` are reserved for those motifs.
- New motif: add a function `(r, p, w, h, o) => ({ defs, body, bg? })` using only `r()` for randomness (always draw the same number of `r()` values, so options like `o.x` do not shift the rest of the picture), then register it in `MOTIFS`.
- Not built yet: misregistered second ink layer, halftone dot fields, rotated grids, a `--n` loop in the script itself.
