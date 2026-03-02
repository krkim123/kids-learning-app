const KIDS_APP_BENCHMARK = [
  {
    id: 'pinkfong-hangul',
    name: '핑크퐁 가나다 한글',
    minAge: 3,
    maxAge: 7,
    subjects: ['hangul', 'reading', 'phonics'],
    pricing: 'mixed',
    summary: '자모·단어·따라쓰기 중심의 유아 한글 입문 학습 앱.',
    url: 'https://apps.apple.com/kr/app/%ED%95%91%ED%81%AC%ED%90%81-%EA%B0%80%EB%82%98%EB%8B%A4-%ED%95%9C%EA%B8%80/id1239679037',
  },
  {
    id: 'lingoani-hangul',
    name: '링고애니 한글 말놀이',
    minAge: 5,
    maxAge: 8,
    subjects: ['hangul', 'reading', 'speaking'],
    pricing: 'mixed',
    summary: '짧은 세션 기반의 한글 말놀이·듣기·읽기 훈련 앱.',
    url: 'https://apps.apple.com/kr/app/%EB%A7%81%EA%B3%A0%EC%95%A0%EB%8B%88-%ED%95%9C%EA%B8%80-%EB%A7%90%EB%86%80%EC%9D%B4-5-8%EC%84%B8/id1550870746',
  },
  {
    id: 'sojunghangeul',
    name: '소중한글 파닉스 앤 플레이',
    minAge: 4,
    maxAge: 8,
    subjects: ['hangul', 'phonics', 'reading'],
    pricing: 'mixed',
    summary: '한글 파닉스 원리와 놀이를 결합한 단계형 학습 앱.',
    url: 'https://apps.apple.com/us/app/sojunghangeul-phonics-play/id1372681786',
  },
  {
    id: 'dinolingo-korean',
    name: '다이노링고 코리안 포 키즈',
    minAge: 2,
    maxAge: 14,
    subjects: ['korean', 'reading', 'speaking', 'parent'],
    pricing: 'subscription',
    summary: '연령 폭이 넓고 부모 리포트 기능이 강한 한국어 학습 서비스.',
    url: 'https://dinolingo.com/learn-korean-for-kids/',
  },
  {
    id: 'gus-korean',
    name: '거스 온 더 고 코리안',
    minAge: 4,
    maxAge: 9,
    subjects: ['korean', 'reading', 'vocab'],
    pricing: 'paid',
    summary: '초기 학습자용 단어·문장 중심 게임형 한국어 학습 앱.',
    url: 'https://apps.apple.com/uy/app/gus-on-the-go-korean/id553962211',
  },
  {
    id: 'droplets-kids',
    name: '드롭렛츠',
    minAge: 7,
    maxAge: 16,
    subjects: ['korean', 'vocab', 'reading'],
    pricing: 'mixed',
    summary: '초단기 세션·스트릭·리마인더를 활용한 단어 반복 학습 앱.',
    url: 'https://apps.apple.com/us/app/droplets-drops-for-kids/id1479365744',
  },
  {
    id: 'drops-korean',
    name: '이지 코리안 러닝 게임즈',
    minAge: 7,
    maxAge: 8,
    subjects: ['korean', 'vocab', 'reading'],
    pricing: 'mixed',
    summary: '한국어 전용 단어·문장 훈련을 짧게 반복하는 학습 앱.',
    url: 'https://apps.apple.com/ge/app/easy-korean-learning-games/id1227950973',
  },
  {
    id: 'lingodeer',
    name: '링고디어',
    minAge: 4,
    maxAge: 8,
    subjects: ['korean', 'reading', 'writing', 'phonics'],
    pricing: 'mixed',
    summary: '문법·읽기·쓰기·필기 연습을 함께 제공하는 언어 학습 앱.',
    url: 'https://apps.apple.com/in/app/lingodeer-learn-languages/id1261193709',
  },
  {
    id: 'duolingo',
    name: '듀오링고',
    minAge: 4,
    maxAge: 8,
    subjects: ['korean', 'reading', 'vocab'],
    pricing: 'mixed',
    summary: '스트릭·리그·짧은 문제 루프로 습관 형성에 강한 학습 앱.',
    url: 'https://apps.apple.com/us/app/duolingo-language-lessons/id570060128',
  },
  {
    id: 'write-it-korean',
    name: '라이트 잇 코리안',
    minAge: 4,
    maxAge: 8,
    subjects: ['hangul', 'writing', 'phonics'],
    pricing: 'paid',
    summary: '필순·필기인식 중심으로 한글 쓰기 자동화를 돕는 앱.',
    url: 'https://apps.apple.com/us/app/write-it-korean/id1268225657',
  },
];

const KIDS_APP_POLICY_LINKS = [
  {
    name: 'FTC 아동 개인정보 보호 규정 개정 (2025-01-16)',
    url: 'https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-finalizes-changes-childrens-privacy-rule-limiting-companies-ability-monetize-kids-data',
  },
  {
    name: '애플 앱스토어 심사 가이드라인',
    url: 'https://developer.apple.com/app-store/review/guidelines/',
  },
  {
    name: '애플 연령 등급 기준표',
    url: 'https://developer.apple.com/help/app-store-connect/reference/app-information/age-ratings-values-and-definitions',
  },
  {
    name: '구글 플레이 가족 정책',
    url: 'https://play.google.com/intl/en-GB/console/about/programs/families/',
  },
  {
    name: '가족용 자체 인증 광고 SDK 목록',
    url: 'https://support.google.com/googleplay/android-developer/answer/12955712?hl=en',
  },
  {
    name: 'AAP 미디어 사용 권고',
    url: 'https://www.healthychildren.org/English/family-life/Media/Pages/Where-We-Stand-TV-Viewing-Time.aspx',
  },
  {
    name: 'WHO 앉아 있는 시간 줄이고 더 놀기 (2-5세)',
    url: 'https://www.who.int/news/item/24-04-2019-to-grow-up-healthy-children-need-to-sit-less-and-play-more',
  },
];

const KIDS_APP_BLUEPRINT = [
  {
    title: '짧은 학습 루프',
    detail: '학습 미션은 3~7분 안에 끝나도록 짧게 설계하세요.',
  },
  {
    title: '연령 분리 화면',
    detail: '3~5세는 음성 중심, 6~8세는 퀘스트형 화면으로 분리하세요.',
  },
  {
    title: '적응형 난이도',
    detail: '최근 정답률을 기준으로 문제 난이도를 자동 조절하세요.',
  },
  {
    title: '보호자 대시보드',
    detail: '학습 시간, 약한 개념, 다음 추천 활동을 보여주세요.',
  },
  {
    title: '안전한 보상',
    detail: '확률형 유료 강화보다 꾸미기 보상과 배지를 우선하세요.',
  },
  {
    title: '아동 보호 타이머',
    detail: '일일/세션 제한과 휴식 알림을 보호자 승인 기반으로 적용하세요.',
  },
  {
    title: '음성 안전 제어',
    detail: '보호자가 음성/SFX 볼륨과 전체 음소거를 제어할 수 있게 하세요.',
  },
  {
    title: '오프라인 핵심',
    detail: '핵심 학습은 오프라인에서도 진행되고 진도는 나중에 동기화되게 하세요.',
  },
];

const HANGUL_LITERACY_STAGES = [
  {
    stage: '1단계: 구어·어휘 기반',
    detail: '듣기·말하기·생활 어휘를 충분히 확보해 읽기 준비도를 만듭니다.',
  },
  {
    stage: '2단계: 음운 인식',
    detail: '음절 쪼개기, 소리 합치기, 초성·종성 구분으로 소리 감각을 키웁니다.',
  },
  {
    stage: '3단계: 자모-음가 대응',
    detail: '자음·모음의 소리와 글자를 정확히 연결하고 기본 음절을 자동화합니다.',
  },
  {
    stage: '4단계: 해독 확장',
    detail: '받침·이중모음·겹받침을 포함한 낱말 읽기를 확장합니다.',
  },
  {
    stage: '5단계: 유창 읽기',
    detail: '반복 낭독으로 읽기 속도와 정확도를 함께 높입니다.',
  },
  {
    stage: '6단계: 쓰기·철자',
    detail: '필순, 받아쓰기, 맞춤법 기초를 통해 출력 능력을 강화합니다.',
  },
  {
    stage: '7단계: 이해·표현',
    detail: '짧은 글 읽고 요약/질문/의견 표현으로 문해 완성도를 높입니다.',
  },
];

const HANGUL_WEEKLY_PACING = [
  { band: '4~5세', session: '주 4회 · 회당 15~20분', total: '주 60~80분', focus: '소리놀이 50% · 자모노출 30% · 그림책 20%' },
  { band: '6~7세', session: '주 5회 · 회당 25~35분', total: '주 125~175분', focus: '해독 40% · 유창읽기 30% · 쓰기 20% · 어휘 10%' },
  { band: '8~9세', session: '주 5회 · 회당 35~45분', total: '주 175~225분', focus: '이해·유창성 45% · 어휘 25% · 쓰기·철자 30%' },
];

const LICENSE_SAFE_RESOURCES = [
  { name: 'Heroicons (MIT)', type: '아이콘', license: '상업/수정 가능', url: 'https://heroicons.com/' },
  { name: 'Lucide (ISC)', type: '아이콘', license: '상업/수정 가능', url: 'https://lucide.dev/license' },
  { name: 'Bootstrap Icons (MIT)', type: '아이콘', license: '상업/수정 가능', url: 'https://icons.getbootstrap.com/' },
  { name: 'Material Symbols (Apache-2.0)', type: '아이콘', license: '상업/수정 가능', url: 'https://developers.google.com/fonts/docs/material_symbols' },
  { name: 'Kenney (CC0)', type: '게임 오브젝트/SFX', license: '출처표시 없이 사용 가능', url: 'https://kenney.nl/support' },
  { name: 'Pexels', type: '사진/영상', license: '상업 가능(원본 재판매 금지)', url: 'https://www.pexels.com/license/' },
  { name: 'Mixkit', type: '효과음/음악', license: '아이템별 확인 필요', url: 'https://mixkit.co/license/' },
  { name: 'Wikimedia Stroke Order', type: '한글 획순', license: '파일별 라이선스 확인 필수', url: 'https://commons.wikimedia.org/wiki/Commons:Stroke_Order_Project/Hangeul' },
];

const BENCHMARK_NAME_KO = {
  'Khan Academy Kids': '칸 아카데미 키즈',
  ABCmouse: '에이비씨마우스',
  Lingokids: '링고키즈',
  'PBS KIDS Games': '피비에스 키즈 게임즈',
  'Duolingo ABC': '듀오링고 에이비씨',
  HOMER: '호머',
  'Reading Eggs': '리딩 에그스',
  SplashLearn: '스플래시런',
  'Prodigy Math': '프로디지 수학',
  'Pok Pok': '포크포크',
  'Sago Mini School': '사고 미니 스쿨',
  codeSpark: '코드스파크',
  Boddle: '보들',
  Osmo: '오즈모',
  Starfall: '스타폴',
  'Montessori Preschool': '몬테소리 프리스쿨',
  'Toca Boca Jr': '토카 보카 주니어',
};

const BENCHMARK_SUMMARY_KO = {
  'Free curriculum-style app for reading, math, and social-emotional learning.': '읽기, 수학, 사회정서 영역을 무료로 제공하는 교과형 학습 앱.',
  'Large course map with leveled lessons for early childhood learners.': '유아 학습자를 위한 단계형 레슨과 큰 코스 맵을 제공해요.',
  'Play-based English learning with short sessions and songs.': '짧은 세션과 노래 중심의 놀이형 영어 학습 앱이에요.',
  'Large library of character-based educational mini games.': '캐릭터 중심의 교육 미니게임을 많이 제공해요.',
  'Short, phonics-first reading practice designed for early readers.': '초기 읽기 학습자를 위한 짧은 파닉스 중심 읽기 연습 앱이에요.',
  'Personalized learning paths across reading, math, and social skills.': '읽기, 수학, 사회성 영역에서 개인화 학습 경로를 제공해요.',
  'Structured phonics and reading progression with age-based programs.': '연령별 프로그램으로 파닉스와 읽기 단계를 체계적으로 제공해요.',
  'Curriculum-aligned math and reading drills with game mechanics.': '교과 연계 수학·읽기 훈련을 게임 방식으로 제공해요.',
  'RPG-style progression loop where math accuracy drives gameplay.': '수학 정답률이 진행도를 결정하는 역할수행형 학습 게임이에요.',
  'Low-stimulation Montessori-inspired toy-style digital playroom.': '자극을 낮춘 몬테소리 감성의 디지털 놀이방 앱이에요.',
  'Preschool-prep activities with lightweight independent UX.': '가벼운 독립 사용 경험으로 유치원 준비 활동을 제공해요.',
  'Game-based computational thinking and early coding concepts.': '게임 기반의 컴퓨팅 사고력과 기초 코딩 개념을 다뤄요.',
  'Avatar progression + quests + adaptive question bank.': '아바타 성장, 퀘스트, 적응형 문제은행을 함께 제공해요.',
  'Physical kit + app hybrid for hands-on and on-screen learning.': '실물 키트와 앱을 결합해 손활동과 화면 학습을 함께 제공해요.',
  'Classic phonics and foundational numeracy practice app.': '기초 파닉스와 기초 수 감각 연습에 강한 학습 앱이에요.',
  'Montessori-aligned activities with broad subject coverage.': '몬테소리 정렬 활동으로 폭넓은 과목을 학습할 수 있어요.',
  'Creative sandbox suite where exploration is rewarded over scoring.': '점수보다 탐색과 창의 활동을 강조하는 샌드박스형 앱이에요.',
};

const BenchmarkCatalog = {
  filters: {
    age: 'all',
    subject: 'all',
    pricing: 'all',
  },
  defaultAgeFilter: 'all',

  ageOptions: [
    { id: 'all', label: '전체 연령' },
    { id: '3-5', label: '3-5세' },
    { id: '6-8', label: '6-8세' },
  ],

  subjectOptions: [
    { id: 'all', label: '전체 과목' },
    { id: 'hangul', label: '한글' },
    { id: 'korean', label: '한국어' },
    { id: 'reading', label: '읽기' },
    { id: 'writing', label: '쓰기' },
    { id: 'phonics', label: '파닉스' },
    { id: 'math', label: '수학' },
    { id: 'english', label: '영어' },
    { id: 'speaking', label: '말하기' },
    { id: 'vocab', label: '어휘' },
    { id: 'parent', label: '부모기능' },
  ],

  pricingOptions: [
    { id: 'all', label: '전체 요금' },
    { id: 'free', label: '무료' },
    { id: 'paid', label: '유료(1회)' },
    { id: 'mixed', label: '부분유료' },
    { id: 'subscription', label: '구독형' },
  ],

  getScreen() {
    return document.getElementById('screen-benchmark');
  },

  getCurrentProfileId() {
    if (window.App && App.currentProfile) return App.currentProfile;
    if (window.Storage) return Storage.getGlobal('lastProfile');
    return null;
  },

  getDefaultAgeFilter() {
    if (!window.Profile) return 'all';
    const profile = Profile.getCurrent();
    if (!profile) return 'all';
    if (profile.ageGroup === 'toddler') return '3-5';
    if (profile.ageGroup === 'child') return '6-8';
    if (profile.ageGroup === 'older') return '6-8';
    return 'all';
  },

  getAgeLabel(ageFilterId) {
    const option = this.ageOptions.find((item) => item.id === ageFilterId);
    return option ? option.label : '전체 연령';
  },

  initializeFilters() {
    this.defaultAgeFilter = this.getDefaultAgeFilter();
    this.filters = {
      age: this.defaultAgeFilter,
      subject: 'all',
      pricing: 'all',
    };
  },

  showHub() {
    const screen = this.getScreen();
    if (!screen) return;
    this.initializeFilters();
    const autoAgeLabel = this.getAgeLabel(this.defaultAgeFilter);

    screen.innerHTML = `
      <div class="benchmark-shell">
        <div class="benchmark-topbar">
          <button class="benchmark-btn" onclick="App.navigate('home')">뒤로</button>
          <div class="benchmark-title">키즈 앱 연구소</div>
          <button class="benchmark-btn" onclick="App.navigate('reference')">자료실</button>
        </div>

        <section class="benchmark-hero">
          <div class="benchmark-hero-kicker">3-8세 학습 앱 리서치</div>
          <h2>검증된 시장 패턴으로 앱을 설계하세요</h2>
          <p>연령, 과목, 요금 조건으로 실제 앱을 비교해 핵심 기능을 정리하세요.</p>
        </section>

        <section class="benchmark-filters">
          <div class="benchmark-filter-group">
            <div class="benchmark-filter-label">
              연령 <span class="benchmark-auto-chip">자동: ${this.escapeHtml(autoAgeLabel)}</span>
            </div>
            <div class="benchmark-chip-row" id="benchmark-filter-age"></div>
          </div>
          <div class="benchmark-filter-group">
            <div class="benchmark-filter-label">과목</div>
            <div class="benchmark-chip-row" id="benchmark-filter-subject"></div>
          </div>
          <div class="benchmark-filter-group">
            <div class="benchmark-filter-label">요금</div>
            <div class="benchmark-chip-row" id="benchmark-filter-pricing"></div>
          </div>
        </section>

        <section class="benchmark-results">
          <div class="benchmark-results-head">
            <div class="benchmark-results-main">
              <strong id="benchmark-result-count">앱 목록</strong>
              <span id="benchmark-check-count" class="benchmark-check-count">0개 선택</span>
            </div>
            <div class="benchmark-head-actions">
              <button class="benchmark-btn" onclick="BenchmarkCatalog.clearChecklist()">선택 초기화</button>
              <button class="benchmark-btn benchmark-btn-primary" onclick="BenchmarkCatalog.resetFilters()">필터 초기화</button>
            </div>
          </div>
          <div class="benchmark-app-grid" id="benchmark-app-grid"></div>
        </section>

        <section class="benchmark-blueprint">
          <h3>핵심 제품 설계</h3>
          <div class="benchmark-blueprint-grid">
            ${KIDS_APP_BLUEPRINT.map((item) => `
              <article class="benchmark-note-card">
                <h4>${this.escapeHtml(item.title)}</h4>
                <p>${this.escapeHtml(item.detail)}</p>
              </article>
            `).join('')}
          </div>
        </section>

        <section class="benchmark-blueprint">
          <h3>한글 문해 학습 단계</h3>
          <div class="benchmark-blueprint-grid">
            ${HANGUL_LITERACY_STAGES.map((item) => `
              <article class="benchmark-note-card">
                <h4>${this.escapeHtml(item.stage)}</h4>
                <p>${this.escapeHtml(item.detail)}</p>
              </article>
            `).join('')}
          </div>
        </section>

        <section class="benchmark-blueprint">
          <h3>연령별 주간 페이싱</h3>
          <div class="benchmark-blueprint-grid">
            ${HANGUL_WEEKLY_PACING.map((item) => `
              <article class="benchmark-note-card">
                <h4>${this.escapeHtml(item.band)} 권장</h4>
                <p>${this.escapeHtml(item.session)} · ${this.escapeHtml(item.total)}</p>
                <p>${this.escapeHtml(item.focus)}</p>
              </article>
            `).join('')}
          </div>
        </section>

        <section class="benchmark-policy">
          <h3>라이선스 안전 리소스</h3>
          <div class="benchmark-link-list">
            ${LICENSE_SAFE_RESOURCES.map((item) => `
              <a class="benchmark-link-item" href="${this.escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">
                ${this.escapeHtml(item.name)} · ${this.escapeHtml(item.type)} · ${this.escapeHtml(item.license)}
              </a>
            `).join('')}
          </div>
          <p class="benchmark-link-note">다른 앱의 그림/캐릭터를 그대로 복제하지 말고, 라이선스 허용 리소스로 재구성하세요.</p>
        </section>

        <section class="benchmark-policy">
          <h3>정책 점검표</h3>
          <div class="benchmark-link-list">
            ${KIDS_APP_POLICY_LINKS.map((item) => `
              <a class="benchmark-link-item" href="${this.escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">
                ${this.escapeHtml(item.name)}
              </a>
            `).join('')}
          </div>
        </section>
      </div>
    `;

    this.renderFilterRows();
    this.renderResults();
  },

  renderFilterRows() {
    this.renderFilterRow('age', this.ageOptions, 'benchmark-filter-age');
    this.renderFilterRow('subject', this.subjectOptions, 'benchmark-filter-subject');
    this.renderFilterRow('pricing', this.pricingOptions, 'benchmark-filter-pricing');
  },

  renderFilterRow(filterKey, options, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = options.map((option) => `
      <button class="benchmark-chip ${this.filters[filterKey] === option.id ? 'active' : ''}"
              onclick="BenchmarkCatalog.setFilter('${filterKey}', '${option.id}')">
        ${this.escapeHtml(option.label)}
      </button>
    `).join('');
  },

  setFilter(filterKey, optionId) {
    this.filters[filterKey] = optionId;
    this.renderFilterRows();
    this.renderResults();
  },

  resetFilters() {
    this.filters = {
      age: this.defaultAgeFilter || this.getDefaultAgeFilter(),
      subject: 'all',
      pricing: 'all',
    };
    this.renderFilterRows();
    this.renderResults();
  },

  renderResults() {
    const list = this.getFilteredApps();
    const checklistMap = this.getChecklistMap();
    const pickedInViewCount = list.filter((app) => !!checklistMap[app.id]).length;
    const pickedTotalCount = Object.keys(checklistMap).length;
    const countNode = document.getElementById('benchmark-result-count');
    const checkNode = document.getElementById('benchmark-check-count');
    const gridNode = document.getElementById('benchmark-app-grid');
    if (!gridNode || !countNode) return;

    countNode.textContent = `${list.length}개 앱이 조건에 맞아요`;
    if (checkNode) {
      checkNode.textContent = `현재 화면 ${pickedInViewCount}개 / 전체 선택 ${pickedTotalCount}개`;
    }

    if (list.length === 0) {
      gridNode.innerHTML = `
        <div class="benchmark-empty">
          <h4>조건에 맞는 결과가 없어요</h4>
          <p>필터를 초기화하거나 연령/주제를 넓혀서 다시 찾아보세요.</p>
        </div>
      `;
      return;
    }

    gridNode.innerHTML = list.map((app) => `
      <article class="benchmark-app-card">
        <div class="benchmark-app-head">
          <h4>${this.escapeHtml(this.getDisplayName(app.name))}</h4>
          <span class="benchmark-price-tag">${this.escapeHtml(this.getPricingLabel(app.pricing))}</span>
        </div>
        <div class="benchmark-meta">
          <span>연령 ${app.minAge}-${app.maxAge}세</span>
          <span>${this.escapeHtml(app.subjects.map((s) => this.getSubjectLabel(s)).join(', '))}</span>
        </div>
        <p class="benchmark-summary">${this.escapeHtml(this.getDisplaySummary(app.summary))}</p>
        <div class="benchmark-card-actions">
          <button class="benchmark-btn benchmark-btn-primary" onclick="window.open('${this.escapeHtml(app.url)}', '_blank', 'noopener,noreferrer')">
            앱 열기
          </button>
          <button class="benchmark-btn benchmark-check-btn ${checklistMap[app.id] ? 'active' : ''}" onclick="BenchmarkCatalog.toggleChecklist('${app.id}')">
            ${checklistMap[app.id] ? '선택됨' : '내 앱 참고로 선택'}
          </button>
        </div>
      </article>
    `).join('');
  },

  getChecklistMap() {
    const profileId = this.getCurrentProfileId();
    if (!profileId || !window.Storage) return {};
    const map = Storage.get(profileId, 'benchmark-checklist', {});
    if (!map || typeof map !== 'object' || Array.isArray(map)) return {};
    return map;
  },

  saveChecklistMap(map) {
    const profileId = this.getCurrentProfileId();
    if (!profileId || !window.Storage) return;
    Storage.set(profileId, 'benchmark-checklist', map);
  },

  toggleChecklist(appId) {
    const current = this.getChecklistMap();
    const next = { ...current };
    if (next[appId]) {
      delete next[appId];
    } else {
      next[appId] = true;
    }
    this.saveChecklistMap(next);
    this.renderResults();
  },

  clearChecklist() {
    this.saveChecklistMap({});
    this.renderResults();
  },

  getFilteredApps() {
    return KIDS_APP_BENCHMARK.filter((app) => (
      this.matchesAge(app) &&
      this.matchesSubject(app) &&
      this.matchesPricing(app)
    ));
  },

  matchesAge(app) {
    if (this.filters.age === 'all') return true;

    if (this.filters.age === '3-5') {
      return app.minAge <= 5 && app.maxAge >= 3;
    }

    if (this.filters.age === '6-8') {
      return app.minAge <= 8 && app.maxAge >= 6;
    }

    return true;
  },

  matchesSubject(app) {
    if (this.filters.subject === 'all') return true;
    return app.subjects.includes(this.filters.subject);
  },

  matchesPricing(app) {
    if (this.filters.pricing === 'all') return true;
    return app.pricing === this.filters.pricing;
  },

  getDisplayName(name) {
    return BENCHMARK_NAME_KO[name] || name;
  },

  getDisplaySummary(summary) {
    return BENCHMARK_SUMMARY_KO[summary] || summary;
  },

  getSubjectLabel(subject) {
    const labels = {
      hangul: '한글',
      korean: '한국어',
      reading: '읽기',
      writing: '쓰기',
      phonics: '파닉스',
      math: '수학',
      english: '영어',
      speaking: '말하기',
      vocab: '어휘',
      parent: '부모기능',
    };
    return labels[subject] || subject;
  },

  getPricingLabel(pricing) {
    if (pricing === 'free') return '무료';
    if (pricing === 'paid') return '유료(1회)';
    if (pricing === 'mixed') return '부분유료';
    if (pricing === 'subscription') return '구독형';
    return '알 수 없음';
  },

  escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },
};

window.BenchmarkCatalog = BenchmarkCatalog;
