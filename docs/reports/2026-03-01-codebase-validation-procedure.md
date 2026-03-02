# Codebase Validation Procedure (2026-03-01)

## Scope
- Project root: `C:\Users\zagan\Desktop\kids-learning-app`
- Runtime: `node v24.13.1`

## 1) Syntax Checks (`node --check`)

### Targets
- `js/*.js`
- `service-worker.js`
- `tools/*.mjs`
- `reference_import/*.js`

### PowerShell command (re-runnable)
```powershell
$targets = @()
$targets += Get-ChildItem -Path js -Filter *.js | Select-Object -ExpandProperty FullName
$targets += Get-Item service-worker.js | Select-Object -ExpandProperty FullName
$targets += Get-ChildItem -Path tools -Filter *.mjs | Select-Object -ExpandProperty FullName
$targets += Get-ChildItem -Path reference_import -Filter *.js | Select-Object -ExpandProperty FullName
foreach ($t in $targets) { node --check "$t" }
```

### Result (this run)
- `CHECKED_COUNT=23`
- `FAILED_COUNT=0`

## 2) Static Search Regression Points (`rg`)

### A. Recommendation loop and adaptive routing
```powershell
rg -n "completeActiveRecommendation\s*\(|runBrainMaterial\s*\(|runIqPlaylist\s*\(|getPriorityRecommendationSteps\s*\(|getWeakDomain\s*\(|selectWeightedWeakDomain\s*\(" js/app.js -S
```
Expected:
- `completeActiveRecommendation(...)` exists
- priority/weak-domain route methods exist

### B. Parent cognitive profile linkage
```powershell
rg -n "getCognitiveDomainsForProfile\s*\(|_buildCognitiveRows\s*\(|getWeakCognitiveDomain\s*\(|startWeakDomainRoutine\s*\(" js/profile.js -S
```
Expected:
- cognitive rows builder and weak-domain fast trigger exist

### C. Reward/timer/bedtime/report persistence wiring
```powershell
rg -n "clearTimers\s*\(|Reward\.addXP\(|adaptiveWeights\s*:|bedtimeEnabled|exportWeeklyReport\s*\(" js/game.js js/storage.js js/profile.js js/app.js -S
```
Expected:
- timer cleanup hooks exist
- XP reward calls exist
- bedtime and adaptive weight fields exist in storage/profile/app
- weekly report export action exists

### Result (this run)
- A/B/C: all expected symbols matched.

## 3) Existing automated validators

### A. Learning content validator
```powershell
node tools/validate-learning-content.mjs
```
Result:
- Most checks PASS
- `FAIL | brain routes are valid | value=6`

Observed invalid route gameIds:
- `spatial-matrix-25d`
- `iq-camp-25d`
- `shape-lab`

Interpretation:
- `tools/validate-learning-content.mjs` whitelist does not include these route IDs, so content/schema validation currently fails by design mismatch.

### B. Runtime smoke validator
```powershell
node tools/smoke-runtime-check.mjs
```
Result:
- PASS (all checks passed)

## 4) Manual Test Checklist (P0)

### A. Recommendation loop
1. Home entry after profile selection shows "오늘의 학습" cards.
2. First recommendation opens mapped feature without JS error.
3. Return to Home and verify recommendation order/progress updates.

### B. Bedtime lock / parent unlock
1. Parent page: enable bedtime lock for current time range.
2. Confirm lock overlay appears on Home.
3. Click `Parent unlock (+30m)` and pass parent gate.
4. Confirm temporary unlock is applied.

### C. Weekly report export
1. Parent page: click `주간 리포트 PDF`.
2. Print dialog opens.
3. Preview includes weekly total, 7-day usage rows, category progress, bedtime lock status.

### D. Cognitive weak-domain routine
1. Parent page cognitive section renders domain rows.
2. Click `약점영역 바로 훈련 시작`.
3. Verify mapped routine launches and returns cleanly.

### E. Game timer/resource cleanup
1. Start/exit each game family at least once (`quiz`, `matching`, `tower`, `block-count-25d`).
2. Ensure no duplicate timers, stuck overlays, or repeated audio after exit.

## 5) Current gate summary
- Syntax gate: PASS
- Static regression symbol gate: PASS
- Runtime smoke gate: PASS
- Learning content strict validator: FAIL (route whitelist drift, 6 items)
