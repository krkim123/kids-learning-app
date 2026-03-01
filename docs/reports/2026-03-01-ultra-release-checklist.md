# Ultra Release Checklist (Kids Learning App)

Date: 2026-03-01

## 1) Static Checks

Run:

```bash
node --check js/*.js
node tools/validate-learning-content.mjs
node tools/smoke-runtime-check.mjs
```

Pass criteria:

- No syntax errors in any `js/*.js`.
- Learning dataset validation passes.
- Runtime smoke checks pass for recommendation flow, cognitive library, and IQ playlist wiring.

## 2) Manual Product Smoke (P0)

1. App launches and home renders without blank state.
2. Recommended loop cards open expected content.
3. Game recommendation is marked complete only after result screen.
4. 2.5D Tower works in `number`, `hangul`, `english`.
5. Daily missions always exist for today (including recovery from empty mission data).
6. Reward stars crossing multiple 10-star boundaries grants multiple stickers.
7. Parent page shows cognitive profile bars and updates after play.
8. IQ routine cards route to playable content.
9. Brain development cards route to playable content.
10. No console runtime errors during 10+ continuous interactions.

## 3) Quality Gates

- Critical bugs: 0
- Data corruption bugs: 0
- Reward duplication/loss bugs: 0
- Recommendation pointer mismatch: 0

## 4) Post-Release Monitoring (first 24h)

Track:

- Session duration trend (too low = engagement issue, too high = guardrail issue).
- Daily mission completion rate.
- Tower completion/fail ratio.
- Parent page revisit rate.
- Error logs (if telemetry connected).
