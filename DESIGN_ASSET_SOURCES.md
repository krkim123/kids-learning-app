# Design Asset Sources and Integration Guide

Last updated: 2026-02-28

## 0) Applied now in this project

Active pack file: `js/design-pack.js`

- Pack name: `openmoji-raw-pack-v1`
- Included now: 8 OpenMoji color SVG templates, custom palette, custom stickers
- Raw source folder: `assets/design-pack/raw/` (`openmoji-*-color.svg`)
- Generation command: `node tools/generate-design-pack-from-raw.mjs`
- Source usage for current pack: direct raw SVG conversion into app region data

## 1) Where to get cute design assets

Use these sources with license checks before shipping:

1. Storyset (Freepik)
- URL: https://storyset.com/
- Good for: kid-friendly scene illustrations (classroom, animals, fantasy)
- License note: free usage requires attribution; paid tiers remove attribution requirement.
- Policy reference: https://storyset.com/faqs

2. Freepik
- URL: https://www.freepik.com/
- Good for: stickers, characters, backgrounds, icons
- License note: free assets typically need attribution; premium allows usage without attribution.

3. Flaticon
- URL: https://www.flaticon.com/
- Good for: icon packs and sticker-like icon sets
- License note: free plan requires link/credit; premium plan removes attribution requirement.

4. Icons8 Ouch!
- URL: https://icons8.com/illustrations
- Good for: modern character illustration sets
- License note: free usage requires a backlink to Icons8; paid plans remove backlink requirement.

5. unDraw
- URL: https://undraw.co/illustrations
- Good for: fully editable SVG illustrations
- License note: free for personal/commercial use, attribution not required (custom unDraw license).
- Policy reference: https://undraw.co/license

6. DrawKit
- URL: https://www.drawkit.com/
- Good for: playful vector packs and UI illustrations
- License note: free illustration packs can be used commercially without required attribution.
- Policy reference: https://www.drawkit.com/license

7. LottieFiles
- URL: https://lottiefiles.com/
- Good for: lightweight character/celebration animations
- License note: free public animations are distributed under Lottie Simple License; verify asset-specific notes before release.
- Policy reference: https://lottiefiles.com/page/license
- Support note: https://help.lottiefiles.com/hc/en-us/articles/900000725843-What-licence-do-the-public-free-animations-fall-under

8. OpenMoji
- URL: https://openmoji.org/
- Good for: emoji-style icons/stickers
- License note: CC BY-SA 4.0 (attribution + share-alike obligations).
- Policy reference: https://openmoji.org/faq

9. Open Doodles
- URL: https://www.opendoodles.com/
- Good for: hand-drawn friendly characters
- License note: public domain (CC0).
- Policy reference: https://www.opendoodles.com/about

10. Canva Elements
- URL: https://www.canva.com/policies/content-license-agreement/
- Good for: quick backgrounds, decorative elements
- License note: one-design license model; do not redistribute raw elements as standalone assets.
- Policy reference: https://www.canva.com/policies/content-license-agreement-2023-03-06/

## 2) Recommended source mix for this project

Use this practical mix:

1. Main UI/scene illustrations: Storyset or DrawKit
2. Icon/sticker set: Flaticon + OpenMoji (or unDraw mini assets)
3. Motion effects: LottieFiles (small celebratory animations)
4. Fast fallback when license-sensitive: unDraw + Open Doodles

## 3) How to apply in this app (already wired)

This repository now supports a design-pack override for coloring assets.

1. Edit `js/design-pack.js`
- Fill `palette`, `stickers`, `coloringDesigns`.
- Keep arrays empty if you want to use built-in defaults.

2. Put downloaded originals in
- `assets/design-pack/raw/`

3. Save license/attribution proof in
- `assets/design-pack/licenses/`

4. Confirm load order in `index.html`
- `js/design-pack.js` is loaded before app modules.

5. Runtime behavior
- `js/coloring.js` uses `window.DESIGN_PACK` first.
- If no valid pack data is provided, it falls back to default constants from `js/data.js`.

## 4) SVG to coloring design conversion tip

For each coloring template:

1. Start with a simple SVG with closed shapes.
2. Split regions into distinct paths (body, eye, wing, etc.).
3. Copy each path `d` value into `coloringDesigns[].regions[]`.
4. Set a neutral `defaultColor` like `#f0f0f0`.
5. Use small path count first (5-10 regions) for touch performance.

## 5) Legal release checklist

Before release:

1. Verify each asset license at source URL.
2. Add required attributions (if free tier requires credit/link).
3. Do not ship or redistribute raw paid assets outside app usage scope.
4. Keep proof screenshots/receipts in `assets/design-pack/licenses/`.
5. Re-check terms when upgrading or changing subscription plans.
