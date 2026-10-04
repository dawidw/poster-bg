---
name: poster-bg
description: Generate poster-style graphics and random backgrounds in the spirit of the Polish School of Posters and 60s/70s geometric modernism, plus Wojciech Fangor's soft op art (vibrating discs, simple rings, flowing dream waves). Use for "plakat", "tło w stylu polskiej szkoły plakatu", geometric or retro backgrounds, Fangor-like images, or random backgrounds. Outputs SVG.
argument-hint: "[--poster | --fangor | --ring | --dream] [--colors random] [--circle N] [--x N --y N] [--grain N] [--angle N] [--amp N --wavelength N --softness N] [--seed N] [--size WxH] [--palette name] [--motif name]"
---

# Poster backgrounds

Seeded SVG generator plus a style guide. Same motif + palette + seed always gives the same image, so a result can be reproduced or varied by changing only the seed. `scripts/gen.js` has no dependencies and also runs in the browser; the live Generator page at https://studyofspace.gallery/generator/ loads the same file.

## Invocation

Arguments arrive as `$ARGUMENTS`. Read them as flags:

| Flag | Meaning |
|---|---|
| `--poster` | random poster-family motif with a matching palette |
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

Motifs: `stripes`, `rings` (split disc and towers), `mosaic` (mirrored tiles), `blob` (halo behind torn-paper shape), `diagonals`, `steps`, `fangor`, `ring`, `squares` (nested soft squares, Fangor and Stanczak), `dream`, `stripewave` (Stanczak style wavy stripes), `scope` (oscillogram), `stripedisc` (stripes and a disc), `construct` (constructivist composition), `cutout` (Lenica paper cut-outs), `bars` (rhythm bars), `rotor` (multiply and rotate), `sunburst` (rays and rings), `outline` (outlined stains), `halftone`, `moire`, `letters` (block letters), `unism` (fine bands with one modulation).

Palettes (77): poster motifs (everything except the Fangor family) use `baron`, `zloto`, `roger`, `marek`, `brasilia`, `anima`, `wesoft`, `mazur`, `jesien`, `moda`, `cyrk`, `zamecznik`, `stanczak`, `konstruktywizm`, `lenica`, `jazz`, `mlodozeniec`, `bauhaus`, `kobalt`, `pastel`, `neon`, `ocean`, `forest`, `sepia`, `mono`, `pop`, `lato`. `fangor` uses `fangor_sunset`, `fangor_mint`, `fangor_mono`, `fangor_fire`, `fangor_ice`, `fangor_mauve`, `fangor_acid`, `fangor_earth`, `fangor`, `fangor_blue`, `fangor_green`; `ring` and `squares` use `soft_flame`, `soft_tricolor`, `soft_violet`, `soft_orchard`, `soft_candy`, `soft_navy`, `soft_cobalt`, `soft_ochre`, `soft_orchid`, `soft_redcore`, `soft_lagoon`, `soft_ember`, `soft_mono`, `soft_blush`, `soft_lilac`, `soft_sunset`, `soft_ice`, `soft_moss`, `soft_cherry`, `soft_gold`, `soft_ink`, `soft_twilight`, `soft_peach` (inks run from the centre out: hole, bands, halo); `dream` uses `dream_navy`, `dream_sun`, `dream_flag`, `dream_azure`, `dream_spectrum`, `dream_candy`, `dream_lagoon`, `dream_rose`, `dream_sunset`, `dream_ocean`, `dream_forest`, `dream_pop`, `dream_mono`, `dream_peach`, `dream_ember`, `dream_ice`.

Palette shape: `paper`, `dark`, `light`, `accent`, `inks`. For `soft_*` the inks run from the centre out (hole, bands, halo); an optional `core` (0 to 1) makes the hole a solid disc. For `dream_*` the inks are the bands across the waves, optional `glow` lights the darkest band's edge and `soft` widens the blur.

Every motif has its own settings (the same sliders the generator page shows), passed as `--key value`:

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
| `squares` | `--round` 0 to 0.5, `--hole` 0.04 to 0.45, `--soft` 0.2 to 2.5 |
| every poster motif | `--misreg` 0 to 6 (off-register print) |
| every motif | `--speckle` 0 to 3 (paper grain) |

For `dream` the wave settings are `--amp`, `--wavelength` and `--softness` (see above). Option keys never clash with `--size`, `--seed`, `--out`, `--motif` or `--palette`.

## Choosing

- Pick the motif for the mood, the palette for the colour story. Do not pin both at random unless the user asked for random.
- One hot accent per composition. If a palette has many inks (`brasilia`), use them as flat fields, not as gradients.
- Keep type out of the generated image. If the user wants a title, add it afterwards as live text, large, overlapping the shapes.
- Do not recreate a specific existing poster. The motifs borrow ideas (flat ink, soft rings, waves), not compositions or lettering.

## Extending

- New palette: add an entry to `PALETTES`. Check that `light` reads on `dark` and `dark` reads on `paper`. Prefixes `fangor`, `soft_` and `dream_` are reserved for those motifs.
- New motif: add a function `(r, p, w, h, o) => ({ defs, body, bg? })` using only `r()` for randomness (always draw the same number of `r()` values, so options like `o.x` do not shift the rest of the picture), then register it in `MOTIFS`.
- Not built yet: misregistered second ink layer, halftone dot fields, rotated grids, a `--n` loop in the script itself.
