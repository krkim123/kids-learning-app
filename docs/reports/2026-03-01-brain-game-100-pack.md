# 2026-03-01 머리좋아지는 게임 100개 확장 보고

## 적용 목표
- 2.5D 블록을 보고 개수 세는 게임 추가
- 여러 퀴즈를 연속으로 푸는 모드 추가
- IQ/두뇌 추천 코스에 신규 모드 연결

## 구현 내용
- `js/game.js`
  - `BLOCK_COUNT_25D_LIBRARY` 생성 (총 100개 문제)
    - 난이도 계층: toddler / child / older
    - 문제별 블록 스택 좌표 + 높이 기반 2.5D 퍼즐
  - 신규 모드 추가:
    - `Game.startBlockCount25D()` (2.5D 블록 세기)
    - `Game.startQuizMarathon()` (20문제 연속 퀴즈)
  - 선택 화면에 신규 버튼 추가:
    - `여러 퀴즈 풀기`
    - `2.5D 블록 세기`
  - 재시작 라우팅 추가:
    - `quiz-marathon`
    - `block-count-25d`

- `css/style.css`
  - 2.5D 블록 장면 스타일 추가:
    - `.block-scene`, `.iso-stack`, `.iso-cube`

- `js/app.js`
  - 라우트 실행 추가:
    - `quiz-marathon`
    - `block-count-25d`
  - 추천 카드 실행 경로에도 동일 반영

- `js/data.js`
  - 두뇌 발달 코스 2건 추가:
    - `block-25d-spatial`
    - `quiz-marathon`
  - IQ 플레이리스트 2건 추가:
    - `iq-quiz-marathon`
    - `iq-block25d`

- `tools/validate-learning-content.mjs`
  - 허용 게임 ID 확장:
    - `quiz-marathon`
    - `block-count-25d`

## 검증 결과
- 문법 체크 통과:
  - `node --check js/game.js js/app.js js/data.js tools/validate-learning-content.mjs`
- 런타임 스모크 통과:
  - `node tools/smoke-runtime-check.mjs`
- 학습 콘텐츠 검증 통과:
  - `node tools/validate-learning-content.mjs`
- 추가 확인:
  - `BLOCK_COUNT_25D_LIBRARY.length === 100`
  - `Game.startQuizMarathon`/`Game.startBlockCount25D` 함수 존재 확인
