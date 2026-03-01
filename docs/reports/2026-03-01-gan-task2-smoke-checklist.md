# GAN Plan Task 2 Smoke Checklist (2026-03-01)

## Automated checks performed

1. Local server smoke
- Command: `python -m http.server 8765` (job mode) + `Invoke-WebRequest http://127.0.0.1:8765/index.html`
- Result: `HTTP 200`, content length `3994`

2. Syntax checks
- Command:
  - `node --check js/app.js`
  - `node --check js/profile.js`
  - `node --check js/storage.js`
- Result: PASS

3. Feature wiring presence checks
- Verified references:
  - `App.runRecommendation(...)`
  - `Profile.exportWeeklyReport(...)`
  - `Storage.getWeeklyUsage(...)`
  - bedtime setting keys (`bedtimeEnabled`, `bedtimeStart`, `bedtimeEnd`)
- Result: PASS (all references found)

## Blocker for full browser automation

- `playwright-cli` installation/execution failed in current environment:
  - PowerShell execution policy blocks `npx.ps1`
  - `cmd /c npx ...` then fails with `EACCES` while fetching `@playwright/cli`
- Therefore full click-driven headless UI automation was not executed.

## Manual QA checklist (run in browser)

### A. Recommendation loop
1. Open app and enter a profile.
2. On Home, confirm "오늘 학습" cards are shown.
3. Click first card and confirm it opens the mapped feature (learn/game/coloring).
4. Return Home and confirm recommendation order/progress changes.

Expected:
- Cards launch without JS errors.
- Daily loop state advances.

### B. Bedtime lock
1. Open Parent page (long press avatar + parent gate).
2. Enable Bedtime lock and set a range including current time.
3. Return Home and verify overlay appears with bedtime message.
4. Click "Parent unlock (+30m)" and pass parent gate.
5. Verify lock is lifted temporarily.

Expected:
- Lock blocks usage during bedtime.
- Parent unlock grants temporary access.

### C. Weekly PDF report
1. Parent page -> click `Weekly Report PDF`.
2. Confirm popup opens and print dialog appears.
3. In print preview, verify:
   - Total weekly time
   - 7-day usage table (minutes, breaks, bars)
   - Category progress table
   - Bedtime lock status hint

Expected:
- Report renders without blank sections.
- Save as PDF works from print dialog.
