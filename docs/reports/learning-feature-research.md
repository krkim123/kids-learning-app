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

## 2026-03-01 추가 반영: IQ 부트캠프(적응형) 프로그램

### 구현 내용
- 신규 프로그램형 게임: `IQ 부트캠프 (iq-camp-25d)`
  - 라운드별로 `시공간 순서기억(Corsi 유사)`과 `패턴 추론(Matrix 유사)`을 교차 구성
  - 연속 정답 시 스팬(span) 증가, 오답 시 스팬 감소(난이도 자동 조정)
  - 세션 결과에 정확도/최종 스팬을 제공해 부모가 성장 추이를 확인 가능
- 홈/추천/IQ 루틴/미션에 프로그램 연결

### 근거 논문 매핑
1. 학교 기반 EF 개입의 개선 가능성(실증)
- https://pubmed.ncbi.nlm.nih.gov/40438827/
- 설계 반영: 짧은 세션 반복 + 난이도 적응

2. 미취학 아동 EF 개입 메타분석(효과 크기와 조건 확인)
- https://pubmed.ncbi.nlm.nih.gov/39367162/
- 설계 반영: 연령 맞춤(짧고 명확한 규칙), 과도한 과제 복잡도 회피

3. 건강 아동/청소년 컴퓨터 작업기억 훈련(근접 전이 중심)
- https://pubmed.ncbi.nlm.nih.gov/38817256/
- 설계 반영: "IQ 급상승" 과장 금지, 작업기억/학습 지속성 개선 지표 중심

4. 공간 인지 훈련의 수학 학습 전이 가능성
- https://www.nature.com/articles/s41562-021-01118-4
- https://www.frontiersin.org/articles/10.3389/fpsyg.2017.02043/full
- 설계 반영: 패턴/공간 추론 과제를 프로그램 핵심 축으로 유지

### 검증 원칙
- 앱 내 카피는 치료/의학적 효능 표현을 피하고, 학습 습관/인지 기초 훈련으로 한정
- 성과 지표는 정답률, 라운드 완료율, 유지율(재방문), 스팬 변화로 운영
