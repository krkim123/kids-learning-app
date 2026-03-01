# 2026-03-01 Kids Learning Trend Alignment

## 목적
- 이 앱을 2026년 기준 아동 학습 트렌드(개인화, 짧은 세션, 안전한 AI/데이터, 메타인지)에 맞춰 계속 개선하기 위한 기준 문서.

## 확인한 최신 근거 (2025~2026 중심)
1. OECD, *Trends Shaping Education 2025* (2025-01-23)
- AI/디지털 전환은 교육 전반을 바꾸고 있으며, 장기적 설계(교사/학습자 역할 재설계)가 필요.

2. OECD, *Digital Education Outlook 2026* (2026-01 발행)
- GenAI는 수행 성능을 높일 수 있지만, 학습 설계 없이 쓰면 실제 학습으로 이어지지 않을 수 있음.
- 학습 파트너로 쓰되 '지름길 자동완성'이 되지 않도록 설계 필요.

3. UNICEF Innocenti, *Guidance on AI and Children v3.0* (2025-12)
- 아동 대상 AI/디지털 시스템은 안전, 프라이버시, 공정성, 설명가능성, 보호자 관점을 기본값으로 가져야 함.

4. UNESCO GEM Report, *Technology in education: A tool on whose terms?* (2023, 2025 업데이트 유지)
- 기술은 '대체'가 아니라 학습자 중심 학습을 '지원'해야 하며, 접근성/거버넌스/교사 준비가 핵심 조건.

5. WHO, *Guidelines on physical activity, sedentary behaviour and sleep for children under 5* (2019, 현재도 핵심 기준)
- 영유아/아동의 스크린 기반 좌식 시간 최소화와 신체활동/휴식 리듬이 중요.

## 이번 코드 반영 (this session)
대상 파일: `js/app.js`

1. 추천 루프 고도화
- `review` 타입 추가: 카테고리 진행률이 가장 낮은 영역을 자동 선택해 복습 카드 노출.
- 학습 루프에 약점 복습(Spaced practice) 단계를 포함.

2. 웰빙 리듬 반영
- `movement` 타입 추가: 추천 카드에 2분 움직임 브레이크를 포함.
- 브레이크 카운트와 Kid Guard 시간 위젯을 함께 업데이트.

3. 연령 루프 개선
- toddler/child/older 추천 템플릿에 복습/움직임 단계를 연령별로 배치.

## 아직 남은 우선순위
1. 부모 리포트에 "약점 카테고리/복습 권장" 섹션 추가.
2. 추천 클릭 로그 기반으로 다음날 루프 가중치 자동 조정.
3. AI 기능을 붙일 경우, 보호자 동의/로컬 우선/데이터 최소화 정책 문서화.

## 참고 링크
- https://www.oecd.org/en/publications/trends-shaping-education-2025_ee6587fd-en.html
- https://www.oecd.org/en/publications/oecd-digital-education-outlook-2026_062a7394-en.html
- https://www.unicef.org/innocenti/reports/policy-guidance-ai-children
- https://www.unesco.org/gem-report/en/publication/technology-education
- https://www.who.int/publications/i/item/9789241550536
