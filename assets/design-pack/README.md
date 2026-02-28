# Design Pack Workspace

Use this folder to manage third-party design assets safely.

## Folder layout

- `raw/`: original downloaded files (`.svg`, `.png`, `.json`, `.lottie`)
- `licenses/`: license text, receipts, attribution notes, screenshots

## Workflow

1. Download candidate assets into `raw/`.
2. Check license terms and put proof in `licenses/`.
3. Regenerate active pack from raw SVG files:
   - `node tools/generate-design-pack-from-raw.mjs`
4. Verify generated file:
   - `node --check js/design-pack.js`
5. Keep a source record (name + URL + license + date).

## Notes

- Do not commit raw paid-only files if redistribution is not allowed.
- Prefer SVG for scalability and smaller app size.
- Keep coloring templates simple for low-end mobile performance.
