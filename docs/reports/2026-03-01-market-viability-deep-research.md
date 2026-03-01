> Note (2026-03-01): 이 문서는 유료 구독 가설 기준입니다.
> 무료+광고 모델 기준 최신안은 `2026-03-01-free-ads-monetization-plan.md`를 참고하세요.

# 2026-03-01 Market Viability Deep Research (Kids Learning App)

## 질문
- "이 앱이 실제로 사람들이 쓰고 돈을 낼 수 있는가?"

## 결론 (2026-03-01 기준)
- **판정: 조건부 가능 (Conditional Go)**
- 이유: 시장 수요와 지불 사례는 이미 충분히 존재하지만, 초기 제품이 실제 결제로 이어지려면 **2주 유지율/루틴 완주율/부모 결제 가치 체감**을 수치로 증명해야 함.
- 즉, 지금은 "아이디어 검증" 단계는 통과했고, "유료 전환 검증" 단계로 가야 함.

## 객관 근거 요약
1. 경쟁 제품은 이미 유료 구독이 일반적
- Lingokids: 월 **$13.49**, 연 **$77.99**
- ABCmouse: 연 **$45/년** 프로모션 가격 노출
- Prodigy: Core/Plus/Ultra 연 **$74.95 / $99.95 / $129.95**

2. 대규모 사용자 기반 존재
- Lingokids Google Play: **10M+ downloads**
- Prodigy Google Play: **5M+ downloads**

3. 교육/미디어 카테고리의 구독 전환 난이도는 높음
- RevenueCat 2025: 교육/미디어는 상대적으로 trial→paid 전환이 낮은 축으로 보고
- 해석: "사람들이 돈을 전혀 안 냄"이 아니라, **결제 전환 UX 설계가 성패를 좌우**

4. 구매 여건은 보수적
- Deloitte 2025 BTS 조사: 평균 지출 하락, **83%가 재정 상태 동일/악화** 응답
- 해석: 가격 민감도가 커져서, 첫 1~2주 내 체감 성과를 못 주면 이탈 가능성 큼

5. 아동 서비스는 규제/스토어 정책 준수가 필수
- FTC COPPA, Google Play Families, Apple Kids Category 모두 데이터/광고/추적 제약을 명시
- 해석: 기능보다 먼저 **정책 준수 기본값**을 제품 내장해야 배포/확장 가능

## 우리 앱 기준 상용화 게이트 (객관 기준)
- 7일 활성일수: **4일 이상**
- 7일 평균 학습시간: **15분 이상/일**
- 루틴 완주: **하루 2개 이상**
- 2주 유지율 프록시: **70% 이상**
- 미션 달성률: **70% 이상**
- 위 5개 중 **4개 이상 충족 시 유료 파일럿(30가정) 진행**

## 30일 검증 실험 설계 (판매 가능성 확인용)
1. 대상/가격
- 보호자 30가정, 2개 가격군 A/B
- A: 월 9,900원, B: 월 7,900원 (연간 선결제 할인 옵션 별도)

2. 퍼널
- 설치 -> 1일차 완료 -> 7일차 재방문 -> 14일차 유지 -> 결제 전환

3. 합격선
- D7 retained user rate >= 35%
- D14 retained user rate >= 25%
- trial -> paid >= 8~12% (초기 소규모 기준)
- 환불/불만 주요 원인 상위 3개 해결 가능

4. 실패 시 피벗
- 학습 콘텐츠 추가보다 먼저: 온보딩 단순화, 부모 리포트 강화, 결제 직전 신뢰요소(성과 리포트) 강화

## 이번 세션 반영 사항
대상 파일:
- `js/app.js`
- `css/style.css`

반영 내용:
1. 홈 화면에 **"상용화 검증 스코어" 카드** 추가
- 7일 활성, 일평균 학습시간, 루틴 완료, 2주 유지율 프록시를 즉시 표시
- 점수에 따라 `추가 개선 필요 / 파일럿 검증 단계 / 조건부 상용화 가능` 상태 표시

2. 부모/운영자가 바로 확인 가능한 실험 가이드 추가
- 카드 탭 시 30일 검증 체크리스트 알림 제공

## 리스크 및 필수 대응
1. COPPA/스토어 정책 미준수 리스크
- 데이터 최소 수집, 추적/광고 정책, 부모 동의 플로우 명확화 필요

2. 결제 가치 전달 실패
- "학습 시간"이 아니라 "학습 성과"(예: 약점 감소, 반복 복습 완료율)를 부모 화면에 주간 리포트로 제공해야 함

3. 가격 저항
- 첫 14일은 낮은 진입장벽 + 성과 증거 제공 후 결제 제안 구조가 유리

## 최종 답변
- **팔릴 가능성은 있다.**
- 단, "만들면 팔린다"가 아니라 **14일 유지/성과 지표를 먼저 증명해야만** 유료 전환이 현실화된다.
- 현재 단계에서 가장 중요한 일은 기능 확장보다 **검증 퍼널 운영**이다.

## 참고 링크
- Lingokids pricing: https://lingokids.com/app/pricing/
- Lingokids Google Play: https://play.google.com/store/apps/details?id=es.monkimun.lingokids
- ABCmouse pricing: https://www.abcmouse.com/abt/homepage
- Prodigy membership pricing: https://www.prodigygame.com/main-en/parents-memberships/
- Prodigy Google Play: https://play.google.com/store/apps/details?id=com.prodigygame.prodigy
- RevenueCat 2025 report: https://www.revenuecat.com/state-of-subscription-apps-2025/
- FTC COPPA overview: https://www.ftc.gov/business-guidance/privacy-security/childrens-privacy
- Google Play Families Policy: https://support.google.com/googleplay/android-developer/answer/9893335
- Apple App Store Kids Category: https://developer.apple.com/app-store/review/guidelines/#kids-category
- Deloitte back-to-school 2025: https://www2.deloitte.com/us/en/pages/consumer-business/articles/back-to-school-survey.html
- Common Sense Census (children media use): https://www.commonsensemedia.org/research/the-common-sense-census-media-use-by-kids-age-zero-to-eight-2020
- Duolingo Form 10-K (paid subscriber scale reference): https://www.sec.gov/ixviewer/ix.html?doc=/Archives/edgar/data/1562088/000156208824000017/duol-20231231.htm


