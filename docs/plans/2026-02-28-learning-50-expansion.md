# Learning 50 Expansion Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 한글/영어/숫자 학습 콘텐츠를 카테고리별 50개로 확장하고, 단계/보상/게임 흐름이 깨지지 않도록 안정적으로 반영한다.

**Architecture:** 데이터 중심 확장(`js/data.js`)을 우선 적용하고, 단계 개수 증가에 맞춰 보상 판정(`js/reward.js`)의 하드코딩(3단계 고정)을 동적 구조로 변경한다. UI는 기존 화면/컴포넌트를 유지하고 데이터와 분할 규칙만 확장해 회귀 위험을 줄인다.

**Tech Stack:** Vanilla JS SPA, localStorage, Web Speech API, Service Worker cache versioning

---

## Scope / Assumption
- 범위: `한글`, `영어`, `숫자` 각 카테고리 학습 아이템 50개.
- 가정: "50개"는 총합 50이 아니라 카테고리별 50.
- 비범위: 색칠/보상 디자인 리뉴얼, 신규 게임 모드 추가.

### Task 1: 데이터 검증 스크립트 추가 (실패부터 고정)

**Files:**
- Create: `tools/validate-learning-content.mjs`
- Test: `tools/validate-learning-content.mjs`

**Step 1: 실패하는 검증 작성**
- `js/data.js`를 파싱해 아래를 강제 검증한다.
  - Hangul total == 50
  - English total == 50
  - Number total == 50
  - 각 카테고리 `stages` 합계 == 50

**Step 2: 실패 확인**
- Run: `node tools/validate-learning-content.mjs`
- Expected: FAIL (현재 값은 Hangul 24 / English 26 / Number 10)

**Step 3: 커밋**
```bash
git add tools/validate-learning-content.mjs
git commit -m "test: add failing validator for 50-item learning target"
```

### Task 2: 한글 50개 데이터 확장

**Files:**
- Modify: `js/data.js`
- Test: `tools/validate-learning-content.mjs`

**Step 1: 한글 아이템 50개 확정**
- 구성안:
  - 자음 19
  - 모음 21
  - 기초 음절 10
  - 합계 50
- 각 항목에 `char/word/emoji/pronunciation/wordPronunciation` 완성.

**Step 2: 최소 구현 반영**
- `HANGUL_CONSONANTS`, `HANGUL_VOWELS`, (필요 시) `HANGUL_SYLLABLES` 추가/확장.

**Step 3: 검증 실행**
- Run: `node tools/validate-learning-content.mjs`
- Expected: Hangul 50 PASS, others FAIL

**Step 4: 커밋**
```bash
git add js/data.js
git commit -m "feat: expand hangul learning dataset to 50 items"
```

### Task 3: 영어 50개 데이터 확장

**Files:**
- Modify: `js/data.js`
- Test: `tools/validate-learning-content.mjs`

**Step 1: 영어 50개 구조 확정**
- 권장안:
  - 대문자 A-Z (26)
  - 소문자 a-x (24)
  - 합계 50
- 기존 UI(큰 글자 표시) 호환을 위해 `char`는 짧은 토큰 유지.

**Step 2: 데이터 반영**
- `ENGLISH` 배열을 50개로 확장.

**Step 3: 검증 실행**
- Run: `node tools/validate-learning-content.mjs`
- Expected: Hangul/English PASS, Number FAIL

**Step 4: 커밋**
```bash
git add js/data.js
git commit -m "feat: expand english learning dataset to 50 items"
```

### Task 4: 숫자 50개 데이터 확장

**Files:**
- Modify: `js/data.js`
- Test: `tools/validate-learning-content.mjs`

**Step 1: 1~50 숫자 세트 작성**
- `NUMBERS`를 1~50으로 확장.
- `word`/`pronunciation`/`wordPronunciation`의 표기 일관성 유지.

**Step 2: 데이터 반영**
- `NUMBERS` 50개 반영.

**Step 3: 검증 실행**
- Run: `node tools/validate-learning-content.mjs`
- Expected: 전체 카테고리 50 PASS

**Step 4: 커밋**
```bash
git add js/data.js
git commit -m "feat: expand number learning dataset to 1-50"
```

### Task 5: 단계(스테이지) 재분할 5단계 x 10개

**Files:**
- Modify: `js/data.js`
- Test: `tools/validate-learning-content.mjs`

**Step 1: 각 카테고리 stages 재설계**
- `CATEGORIES.hangul.stages`: 1~5단계, 각 10개
- `CATEGORIES.english.stages`: 1~5단계, 각 10개
- `CATEGORIES.number.stages`: 1~5단계, 각 10개(1~10, 11~20, ...)

**Step 2: subtitle 구간 표기 업데이트**
- 예: `41 ~ 50`처럼 구간이 명확히 보이게 수정.

**Step 3: 검증 실행**
- Run: `node tools/validate-learning-content.mjs`
- Expected: 카테고리 총합 및 stage 분할 PASS

**Step 4: 커밋**
```bash
git add js/data.js
git commit -m "feat: repartition learning stages into 5x10 per category"
```

### Task 6: 보상 판정의 하드코딩 제거

**Files:**
- Modify: `js/reward.js`
- Modify: `js/data.js`

**Step 1: 실패 조건 정의**
- 현재 `hangul_s3 / english_s3 / number_s3`가 3단계 완료에 고정되어 있어 확장 후 의미가 어긋남.

**Step 2: 최소 구현**
- `Reward.checkBadges()`에서 마스터 조건을 마지막 단계 기준으로 판정하도록 변경.
- 방법 예시:
  - `const lastStageId = CATEGORIES[catId].stages[CATEGORIES[catId].stages.length - 1].id`
  - 해당 stage 완료 여부로 마스터 배지 판정

**Step 3: 문자열/설명 정합성 보정**
- `BADGES` 설명 문구를 "마지막 단계 완료"로 수정.

**Step 4: 커밋**
```bash
git add js/reward.js js/data.js
git commit -m "refactor: make master badge checks dynamic to last stage"
```

### Task 7: 숫자 게임 난이도 안전장치 조정

**Files:**
- Modify: `js/profile.js`
- Modify: `js/game.js`

**Step 1: 난이도 상한 재설계**
- `countingMax`는 화면 밀집도를 고려해 연령별 상한 유지/조정(예: 5 / 15 / 30).
- 학습 데이터 50개와 카운팅 게임(화면에 이모지 뿌리기)을 분리 운영.

**Step 2: 최소 구현**
- `AGE_PRESETS`의 `countingMax` 조정.
- 필요 시 `Game.startCounting()`에 시각적 상한 캡 도입.

**Step 3: 커밋**
```bash
git add js/profile.js js/game.js
git commit -m "tune: rebalance counting difficulty after number dataset expansion"
```

### Task 8: 통합 검증 및 회귀 체크

**Files:**
- Verify: `js/data.js`
- Verify: `js/learn.js`
- Verify: `js/game.js`
- Verify: `js/reward.js`
- Verify: `service-worker.js`

**Step 1: 문법 검증**
```bash
node --check js/data.js
node --check js/learn.js
node --check js/game.js
node --check js/reward.js
node --check js/profile.js
```

**Step 2: 데이터 검증**
```bash
node tools/validate-learning-content.mjs
```
Expected:
- hangul = 50
- english = 50
- number = 50
- stages per category total = 50

**Step 3: 수동 핵심 경로 검증**
- 프로필 진입 -> 홈 -> 카테고리별 5단계 노출 확인
- 각 카테고리 Stage 1 진입 카드 10개 확인
- Stage 완료 후 다음 단계 언락 확인
- 게임 선택(퀴즈/소리찾기/매칭/숫자세기) 정상 동작 확인
- 보상 화면(배지/진행률) 깨짐 없음 확인

**Step 4: 캐시 버전 갱신**
- `service-worker.js`의 `CACHE_NAME` 1회 증가

**Step 5: 최종 커밋**
```bash
git add js/data.js js/reward.js js/profile.js js/game.js tools/validate-learning-content.mjs service-worker.js
git commit -m "feat: expand hangul english number learning to 50 items each"
```

## Acceptance Criteria
- 한글/영어/숫자 학습 데이터가 각각 정확히 50개다.
- 카테고리당 5단계, 단계당 10개 구성이 보인다.
- 기존 프로필 데이터(localStorage)가 손실되지 않는다.
- 스테이지 진입/언락/퀴즈/보상 흐름에 런타임 오류가 없다.

## Risks
- 데이터 확장 시 중복 `char`가 있으면 학습 완료 판정이 꼬일 수 있음.
- 영어 소문자 확장 시 발음/표기 일관성 검수 필요.
- 숫자 세기 게임은 50 직접 카운팅을 허용하면 UI 과밀 가능.
