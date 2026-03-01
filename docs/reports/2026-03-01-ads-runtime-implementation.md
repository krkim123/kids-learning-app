# 2026-03-01 Ads Runtime Implementation

## 적용 범위
- `js/ads.js`: 광고 런타임 어댑터 구현
- `js/app.js`: 안전 지점 광고 호출 연결

## 구현 요약
1. 어댑터 자동 선택
- `capacitor-admob`: `window.Capacitor.Plugins.AdMob` 감지 시 사용
- `cordova-admob`: `window.admob` 감지 시 사용
- `web-debug`: 실제 광고 대신 디버그 배너(옵션)
- 그 외: no-op

2. 아동 안전 기본값
- `childDirected: true`
- `underAgeOfConsent: true`
- `nonPersonalizedOnly: true`
- `maxAdContentRating: G` 요청

3. 노출 위치
- 배너: `home`, `reward`, `parent` 화면만 허용
- 전면(interstitial): `reward-screen`, `parent-screen`, `routine-complete`만 허용

4. 빈도/캡
- 최소 간격: `minInterstitialGapMs` (기본 180000ms)
- 일일 캡: `maxInterstitialPerDay` (기본 8회)
- 로컬 통계 저장: `adsStats` (date/banner/interstitial/rewarded)

## 설정 방법
1. 기본(테스트 광고 ID)
- 별도 설정 없이 동작: Google 공식 테스트 ad unit 사용

2. 커스텀 설정 (런타임)
- `window.__FAIRY_ADS_CONFIG__` 주입 또는 `Storage.getGlobal('adsConfig')` 사용

예시:
```js
window.__FAIRY_ADS_CONFIG__ = {
  enabled: true,
  testing: false,
  allowInterstitial: true,
  minInterstitialGapMs: 240000,
  maxInterstitialPerDay: 6,
  webDebugBanner: false,
  adUnits: {
    android: {
      banner: 'ca-app-pub-xxxx/banner',
      interstitial: 'ca-app-pub-xxxx/interstitial',
      rewarded: 'ca-app-pub-xxxx/rewarded',
    },
    ios: {
      banner: 'ca-app-pub-yyyy/banner',
      interstitial: 'ca-app-pub-yyyy/interstitial',
      rewarded: 'ca-app-pub-yyyy/rewarded',
    },
  },
};
```

3. 디버그 배너(Web)
```js
window.__FAIRY_ADS_CONFIG__ = { webDebugBanner: true };
```

## 체크리스트
- 학습 진행 화면에 광고가 뜨지 않는지 확인
- 보상/부모 화면에서만 광고 노출되는지 확인
- interstitial 최소 간격/일일 캡이 지켜지는지 확인
- 아동 정책(COPPA/Families/Kids Category) 텍스트/동의 흐름 점검
