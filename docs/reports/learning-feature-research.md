# 학습 기능 업데이트 근거 메모 (2026-03-01)

## 적용한 기능
- 오답 기반 복습 버튼 추가 (`홈 > 오답 복습`): 최근 오답이 많은 영역을 바로 퀴즈로 재진입
- 오답 통계 누적 (`progress.wrongStats`): 카테고리별 오답 횟수 기반 약점 우선 추천
- 두뇌 발달 추천 코스 확장
  - `간격 반복 복습` (spaced-repetition)
  - `집중-억제 조절 루틴` (self-regulation)

## 반영 근거 (요약)
1. 간격 반복(Spacing)과 분산 학습은 아동의 기억/일반화 성능 향상에 일관된 이점
- https://pubmed.ncbi.nlm.nih.gov/22616822/
- https://pubmed.ncbi.nlm.nih.gov/24805305/
- https://pubmed.ncbi.nlm.nih.gov/18835602/

2. 아동 학습에서 인출 연습(Retrieval practice)과 힌트 기반 인출은 장기 기억 유지에 도움
- https://pubmed.ncbi.nlm.nih.gov/39321321/

3. 유아 집행기능(EF) 개입은 효과 크기는 작거나 과제별 차이가 있으나, 짧은 루틴형 반복 개입의 실용성 존재
- https://pubmed.ncbi.nlm.nih.gov/41491942/
- https://pubmed.ncbi.nlm.nih.gov/32964771/

4. 짧은 휴식/눈 휴식(20-20-20 등)과 신체 활동 병행은 유아 화면 학습 피로 관리에 유리
- https://www.healthychildren.org/English/health-issues/conditions/eyes/Pages/What-Too-Much-Screen-Time-Does-to-Your-Childs-Eyes.aspx

## 구현 메모
- 연구 결과를 그대로 "의학적 치료"로 사용하지 않고, 앱 내 학습 UX(복습 루프/루틴 추천/짧은 휴식 권장)에만 적용.
- 개인 맞춤은 오답 통계 + 기존 진도/연령 추천 로직을 결합해 과도한 난이도 상승을 방지.

## 2026-03-01 추가 반영: 2.5D/3D 지능 루틴 확장

### 새로 추가한 학습/게임
- `2.5D 매트릭스 IQ` (`spatial-matrix-25d`)
  - 행/열 규칙 완성형 패턴 추론
  - 시공간 작업기억 + 비언어 추론 중심
- 기존 2.5D/3D 계열(`블록 세기`, `3D 도형`, `3D 전개도`)과 함께 IQ 루틴에 통합

### 객관 검증 출처(앱 내 링크 노출)
- Harvard Center on the Developing Child (Executive Function)
- Nature Human Behaviour 2021 (spatial cognition training and math transfer)
- Journal of Intelligence 2023 (children spatial ability measurement)
- AAP Pediatrics (Media and Young Minds)
- Frontiers in Psychology 2017 (spatial training and math outcomes)

### UX 리팩토링 원칙
- 주요 카드 컴포넌트에 2.5D depth/shadow 계층을 공통 적용
- 단순 평면 카드 대신 눌림/부상 상태가 분명한 입체 인터랙션으로 통일
- 아동 사용성 유지 위해 과한 모션 대신 짧은 반응형 변형 중심으로 제한
