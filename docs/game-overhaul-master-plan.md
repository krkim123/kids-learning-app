# Kids Game Overhaul Master Plan

## Goal
- Upgrade all 118 games with premium visual quality, mascot-driven feedback, and deeper gameplay loops suitable for kids.
- Keep performance stable on mobile devices while improving engagement.

## Current Status (Started)
- [x] 118-game unified hub enabled.
- [x] Mascot system added to game sessions.
- [x] Premium UI baseline applied (theme classes, HUD, combo/life/time display, animated card feel).
- [x] MCQ engine upgraded with timer, combo, lives, 50:50, and skip.
- [x] Generated 100-game pack moved to in-app playable mode.

## Phase A: Visual & Character System (In Progress)
- [x] Mascot roster and per-game mascot assignment.
- [x] Theme variants (`spark`, `rainbow`, `sunset`, `mint`, `ocean`, `candy`).
- [ ] Character art pack v2 (custom SVG sprites, success/fail poses).
- [ ] Screen transition and reward animation pack.

## Phase B: Gameplay Depth
- [x] Adaptive difficulty in generated quiz templates.
- [x] Add non-MCQ template modes:
  - [x] Reaction mode (`tap-rush`)
  - [x] Grid target hunt (`grid-hunt`)
  - [x] Rhythm tap mode (`rhythm-hit`)
  - [ ] Endless challenge mode
- [ ] Template-level boss rounds and milestone rewards.

## Phase C: Progression & Retention
- [x] Daily quest hooks for each game template.
- [x] Streak bonus visual effects and unlock tracks.
- [ ] Character unlocks and cosmetic badges.
- [ ] Per-child difficulty profile (easy/normal/challenge).

## Phase D: QA and Performance
- [ ] 60fps target for arcade canvas games on mid-range mobile.
- [ ] Touch target/accessibility audit.
- [ ] Offline/PWA cache validation for updated assets.
- [ ] Regression test checklist for all game families.

## Immediate Next Sprint Tasks
1. Implement 3 non-MCQ generated game modes and map 100 generated games by mode.
2. Add sprite-based character expressions and context-sensitive lines.
3. Rework result screen with celebratory scene and collectible drops.
4. Ship mobile polish pass (safe-area, font scaling, tap feedback latency).
