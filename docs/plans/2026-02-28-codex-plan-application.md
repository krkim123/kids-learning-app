# Codex Plan Application for Kids App

> **Assumption:** 사용자 요청의 `랄플랜/간플랜`을 `장기 릴리즈 플랜 + 단기 실행 플랜`으로 해석해 적용.

**Goal:** 방금 구현한 3개 기능(취침잠금, 주간 PDF, 연령별 추천루프)을 안정화하고 다음 릴리즈까지 운영 가능한 개발 루프를 만든다.

**Architecture:** 기능 완성 후 안정화 우선 전략. `Storage/App/Profile` 경계(데이터/정책/UI)를 유지하면서 회귀 테스트, 문자열 정합성, 부모 제어 UX를 단계적으로 고정한다.

**Tech Stack:** Vanilla JS SPA, localStorage, popup-print PDF, service worker

---

## 1) RAL Plan (장기 릴리즈 플랜, 1~2주)

### Track A: 안정성
- A1. 문자열 인코딩/표시 깨짐 전수 정리 (`js/*.js`, `index.html`)
- A2. `App` 오버레이 상태 전환 회귀 테스트 체크리스트 정착
- A3. `Storage` 일별 스냅샷 데이터 무결성 검증 스크립트 추가

### Track B: 부모 기능 고도화
- B1. 취침잠금 예외 정책(주말/특정 요일) 추가
- B2. PDF 리포트 항목 확장(미션 달성률, 카테고리별 최근 7일 변화)
- B3. 리포트 생성 실패 시 대체 다운로드 UX 추가

### Track C: 추천 루프 개선
- C1. 루프 소진 시 “복습 모드”와 “도전 모드” 분기
- C2. 연령+최근 오답 기반 추천 가중치 도입
- C3. 추천 카드 클릭 로그를 리포트에 반영

---

## 2) GAN Plan (단기 실행 플랜, 오늘 바로)

### Task 1: 정적 검증
**Files:** verify only
- `js/app.js`
- `js/profile.js`
- `js/storage.js`

**Run**
```bash
node --check js/app.js
node --check js/profile.js
node --check js/storage.js
```

### Task 2: 수동 핵심 흐름 점검
**Scope:**
- 홈 추천카드 클릭 -> 학습/게임 진입
- 취침잠금 시간대 -> 오버레이 노출
- 부모 인증 -> 잠금 해제(+30m)
- 부모 페이지 -> Weekly Report PDF 버튼 -> 인쇄창

### Task 3: 다음 커밋 단위 준비
**Commit unit candidates:**
- `feat(parent): bedtime lock + weekly pdf + recommendation loop`
- `fix(ui): recover malformed closing tags and bedtime remaining label sync`

---

## 3) Definition of Done
- 취침잠금/해제/일일제한/연속제한 오버레이가 충돌 없이 동작한다.
- Weekly Report PDF가 최소 7일 사용량/휴식횟수/카테고리 진행률을 출력한다.
- 추천 루프 상태가 날짜 경계에서 정상 롤오버된다.
- 주요 JS 문법 체크가 모두 통과한다.
