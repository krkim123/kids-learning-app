# 2026-02-28 키즈 학습앱 업그레이드 인터넷 조사 보고서

작성 기준일: 2026-02-28 (토)

## 1) 정책/안전 필수사항 (P0)

1. COPPA 2025 개정 반영
- FTC는 2025-01-16에 아동 데이터 수익화 제한, 개인정보 보유기간 제한, 타겟광고 관련 통제를 강화함.
- 의미: 13세 미만 대상 기능은 추적/프로파일링 최소화, 데이터 최소수집, 부모 통제 고지 강화가 필수.

2. Apple Kids Category 요구사항
- Apple 가이드라인의 Kids Category는 외부 링크/구매/계정 생성 흐름에서 보호자 게이트 등 아동 보호 맥락을 명시.
- 의미: 부모만 접근 가능한 설정/확장 동작(게이트) 구조가 필요.

3. Google Play Families 정책
- 가족 대상 앱은 광고/SDK/데이터 처리에서 Families 정책과 허용된 SDK 정책을 따라야 함.
- 의미: 아동 모드에서는 광고 SDK/행동기반 추적 의존 기능을 최소화하고 안전 모드 우선.

## 2) 학습·UX 근거 (P0~P1)

1. 짧은 세션 + 휴식 리듬
- AAP 권고: 2~5세는 하루 1시간 내외의 고품질 미디어 + 보호자 동반/코칭 맥락 강조.
- WHO 권고: 3~4세는 좌식 스크린 시간 1시간 이하 권장(적을수록 더 좋음).
- 의미: 앱 내에서 세션 제한, 일일 제한, 휴식 알림이 기본 제공되어야 함.

2. 고품질 콘텐츠형 앱의 공통 패턴
- Khan Academy Kids: 읽기/수학/사회정서 학습을 포함한 무료 학습 루프.
- Duolingo ABC: 3~8세 대상 짧은 읽기/파닉스 중심 루프.
- 의미: 3~8세는 “짧은 과제 + 즉시 피드백 + 반복” 구조가 핵심.

## 3) 그림/색칠 기능 벤치마크 (GitHub)

1. `react-sketch-canvas`
- 주요 기능: Undo/Redo, SVG/PNG/JPEG Export, Eraser, 이미지 백그라운드, 터치 친화.

2. `react-canvas-draw`
- 주요 기능: Undo/Erase, 브러시 지연(손떨림 완화), Save/Load Data URL.

의미:
- 현재 키즈 색칠앱은 최소한 Undo/Redo, 채우기, 브러시/지우개, 스티커, 내보내기, 가져오기, 격자/대칭, 터치 안정화가 필요.

## 4) 이번 세션 반영 사항 (실제 코드 적용)

### A. 아동 보호/부모 제어 추가
- 부모 페이지에 아동 보호 설정 추가:
  - 하루 사용 제한(분)
  - 연속 사용 제한(분)
  - 휴식 알림 간격(분)
  - 음성 볼륨(%)
  - 효과음 볼륨(%)
  - 전체 음소거
- 부모 게이트(암산 확인) 통과 후에만 연장/설정 변경 가능.

### B. 실사용 시간 가드 추가
- 앱 내부 Kid Guard 추가:
  - 사용 시간 누적(오늘 사용/총 사용/휴식 횟수)
  - 휴식 알림 오버레이
  - 연속 사용 제한 오버레이
  - 일일 제한 도달 오버레이
  - 부모 확인 후 시간 연장(+10/+15분)

### C. 오디오 안전 제어 연결
- `Speech`와 `SFX`를 부모 설정과 연동:
  - 전체 음소거 시 음성/효과음 출력 차단
  - 음성/효과음 볼륨 슬라이더 값 적용

### D. 홈/헤더 시각화
- 홈에 "오늘 사용 관리" 카드 추가(사용/남은/연속 시간)
- 헤더에 시간 상태 배지 추가(남은 시간 또는 사용 시간)

## 5) 다음 우선순위 (추가 구현 권장)

P1
1. 취침 시간 잠금(예: 21:00~07:00)
2. 과목별 약점 리포트(부모 대시보드)
3. 연령별 자동 추천 루프(3~4세/5~6세/7~8세)

P2
1. 오프라인 모드에서 학습/게임/색칠 전체 보장
2. 부모용 주간 리포트 내보내기(PDF/이미지)
3. 접근성 모드(고대비, 난독 친화 폰트, 큰 버튼 모드)

## 6) 참고 링크

정책/안전
- FTC COPPA 2025-01-16: https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-finalizes-changes-childrens-privacy-rule-limiting-companies-ability-monetize-kids-data
- Apple App Store Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Apple Age Ratings: https://developer.apple.com/help/app-store-connect/reference/app-information/age-ratings-values-and-definitions
- Google Play Families: https://support.google.com/googleplay/android-developer/answer/9893335?hl=en
- Google Play Families Ads SDK: https://support.google.com/googleplay/android-developer/answer/12955712?hl=en

건강/학습
- AAP(HealthyChildren): https://www.healthychildren.org/English/family-life/Media/Pages/Where-We-Stand-TV-Viewing-Time.aspx
- WHO(2019-04-24): https://www.who.int/news/item/24-04-2019-to-grow-up-healthy-children-need-to-sit-less-and-play-more
- Khan Academy Kids: https://www.khanacademy.org/kids
- Duolingo ABC (3~8세): https://blog.duolingo.com/a-good-read-building-duolingo-abc-for-android/

그림 기능 벤치마크
- react-sketch-canvas: https://github.com/vinothpandian/react-sketch-canvas
- react-canvas-draw: https://github.com/embiem/react-canvas-draw
