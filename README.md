# Kids Learning App (요정 교실)

유아/초등 저학년 대상의 학습 + 게임 통합 앱입니다.  
한글, 영어, 숫자, 수학 학습과 2.5D 타워/미니게임/IQ 루틴을 한 화면 흐름으로 제공합니다.

## 주요 기능

- 연령별 난이도 자동 적용 (`toddler`, `child`, `older`)
- 학습 카테고리: 한글, 영어, 숫자, 수학
- 게임 모드: 퀴즈, 짝맞추기, 소리 찾기, 따라쓰기, 숫자세기
- 2.5D 타워 모드: 숫자/한글/영어
- 추천 루프: 홈에서 오늘 할 루틴 카드 자동 생성
- 일일 미션 + 출석 + 연속 학습(streak)
- 보상 시스템: 별, 스티커, 배지, 레벨(XP)
- 부모 페이지: 사용시간/주간 그래프/카테고리 진행률/인지 발달 프로필
- PWA 설치 지원

## 이번 리모델링 핵심

- 성능 최적화:
  - 게임 루프 타이머 정리(`schedule/clearTimers`)
  - 트레이싱 입력 루프 최적화(`requestAnimationFrame`, rect 캐시)
  - 선택지 버튼 DOM 캐시로 반복 탐색 감소
  - CSS 페인트 비용 절감(`transition: all` 축소, reduced-motion 대응)
- 품질 개선:
  - 스티커 다중 임계값 지급 누락 버그 수정
  - 추천 카드 완료 시점 수정(클릭 즉시 완료 → 실제 게임 완료 시 완료)
  - 일일 미션 복구 로직 + 날짜 오프셋 안정화
- 콘텐츠 확장:
  - `BRAIN_DEVELOPMENT_LIBRARY` (인지 발달 추천 코스)
  - `IQ_GAME_PLAYLIST` (IQ 향상 루틴)
  - 부모 페이지 인지 발달 프로필 바 추가

## 실행

정적 웹앱이므로 `index.html`을 브라우저로 열면 실행됩니다.

## 검증 명령

```bash
node --check js/*.js
node tools/validate-learning-content.mjs
node tools/smoke-runtime-check.mjs
```

추가 릴리즈 체크리스트:

- `docs/reports/2026-03-01-ultra-release-checklist.md`

## 프로젝트 구조

- `js/` 앱 로직
- `css/` 스타일
- `tools/` 검증/유틸 스크립트
- `docs/reports/` 운영 및 점검 문서
