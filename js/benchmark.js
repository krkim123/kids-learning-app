const KIDS_APP_BENCHMARK = [
  {
    id: 'khan-kids',
    name: 'Khan Academy Kids',
    minAge: 2,
    maxAge: 8,
    subjects: ['reading', 'math', 'sel'],
    pricing: 'free',
    summary: 'Free curriculum-style app for reading, math, and social-emotional learning.',
    url: 'https://www.khanacademy.org/kids',
  },
  {
    id: 'abcmouse',
    name: 'ABCmouse',
    minAge: 2,
    maxAge: 8,
    subjects: ['reading', 'math', 'science', 'arts'],
    pricing: 'subscription',
    summary: 'Large course map with leveled lessons for early childhood learners.',
    url: 'https://www.abcmouse.com/',
  },
  {
    id: 'lingokids',
    name: 'Lingokids',
    minAge: 2,
    maxAge: 8,
    subjects: ['english', 'reading', 'sel'],
    pricing: 'mixed',
    summary: 'Play-based English learning with short sessions and songs.',
    url: 'https://www.lingokids.com/',
  },
  {
    id: 'pbs-kids',
    name: 'PBS KIDS Games',
    minAge: 2,
    maxAge: 8,
    subjects: ['reading', 'math', 'science', 'creativity'],
    pricing: 'free',
    summary: 'Large library of character-based educational mini games.',
    url: 'https://pbskids.org/apps/pbs-kids-games.html',
  },
  {
    id: 'duolingo-abc',
    name: 'Duolingo ABC',
    minAge: 3,
    maxAge: 8,
    subjects: ['reading', 'english'],
    pricing: 'free',
    summary: 'Short, phonics-first reading practice designed for early readers.',
    url: 'https://blog.duolingo.com/a-good-read-building-duolingo-abc-for-android/',
  },
  {
    id: 'homer',
    name: 'HOMER',
    minAge: 2,
    maxAge: 8,
    subjects: ['reading', 'math', 'sel'],
    pricing: 'subscription',
    summary: 'Personalized learning paths across reading, math, and social skills.',
    url: 'https://learnwithhomer.com/',
  },
  {
    id: 'reading-eggs',
    name: 'Reading Eggs',
    minAge: 3,
    maxAge: 8,
    subjects: ['reading', 'phonics'],
    pricing: 'subscription',
    summary: 'Structured phonics and reading progression with age-based programs.',
    url: 'https://readingeggs.com/',
  },
  {
    id: 'splashlearn',
    name: 'SplashLearn',
    minAge: 4,
    maxAge: 10,
    subjects: ['math', 'reading'],
    pricing: 'mixed',
    summary: 'Curriculum-aligned math and reading drills with game mechanics.',
    url: 'https://www.splashlearn.com/',
  },
  {
    id: 'prodigy-math',
    name: 'Prodigy Math',
    minAge: 6,
    maxAge: 12,
    subjects: ['math'],
    pricing: 'mixed',
    summary: 'RPG-style progression loop where math accuracy drives gameplay.',
    url: 'https://www.prodigygame.com/main-en/math/',
  },
  {
    id: 'pok-pok',
    name: 'Pok Pok',
    minAge: 2,
    maxAge: 8,
    subjects: ['creativity', 'logic', 'open-play'],
    pricing: 'subscription',
    summary: 'Low-stimulation Montessori-inspired toy-style digital playroom.',
    url: 'https://playpokpok.com/',
  },
  {
    id: 'sago-mini-school',
    name: 'Sago Mini School',
    minAge: 2,
    maxAge: 5,
    subjects: ['reading', 'math', 'creativity'],
    pricing: 'subscription',
    summary: 'Preschool-prep activities with lightweight independent UX.',
    url: 'https://sagomini.com/en/school/',
  },
  {
    id: 'codespark',
    name: 'codeSpark',
    minAge: 4,
    maxAge: 10,
    subjects: ['coding', 'logic'],
    pricing: 'subscription',
    summary: 'Game-based computational thinking and early coding concepts.',
    url: 'https://code-spark.org/',
  },
  {
    id: 'boddle',
    name: 'Boddle',
    minAge: 5,
    maxAge: 11,
    subjects: ['math', 'reading'],
    pricing: 'mixed',
    summary: 'Avatar progression + quests + adaptive question bank.',
    url: 'https://www.boddlelearning.com/',
  },
  {
    id: 'osmo',
    name: 'Osmo',
    minAge: 3,
    maxAge: 10,
    subjects: ['math', 'reading', 'creativity'],
    pricing: 'mixed',
    summary: 'Physical kit + app hybrid for hands-on and on-screen learning.',
    url: 'https://www.playosmo.com/',
  },
  {
    id: 'starfall',
    name: 'Starfall',
    minAge: 4,
    maxAge: 10,
    subjects: ['reading', 'math'],
    pricing: 'mixed',
    summary: 'Classic phonics and foundational numeracy practice app.',
    url: 'https://www.starfall.com/',
  },
  {
    id: 'montessori-preschool',
    name: 'Montessori Preschool',
    minAge: 3,
    maxAge: 7,
    subjects: ['reading', 'math', 'coding'],
    pricing: 'mixed',
    summary: 'Montessori-aligned activities with broad subject coverage.',
    url: 'https://www.edokiclub.com/apps/montessori-preschool/',
  },
  {
    id: 'toca-boca-jr',
    name: 'Toca Boca Jr',
    minAge: 2,
    maxAge: 6,
    subjects: ['creativity', 'open-play'],
    pricing: 'subscription',
    summary: 'Creative sandbox suite where exploration is rewarded over scoring.',
    url: 'https://tocaboca.com/app/toca-boca-jr/',
  },
];

const KIDS_APP_POLICY_LINKS = [
  {
    name: 'FTC COPPA Rule Update (2025-01-16)',
    url: 'https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-finalizes-changes-childrens-privacy-rule-limiting-companies-ability-monetize-kids-data',
  },
  {
    name: 'Apple App Store Review Guidelines',
    url: 'https://developer.apple.com/app-store/review/guidelines/',
  },
  {
    name: 'Apple Age Ratings Reference',
    url: 'https://developer.apple.com/help/app-store-connect/reference/app-information/age-ratings-values-and-definitions',
  },
  {
    name: 'Google Play Families Policy',
    url: 'https://play.google.com/intl/en-GB/console/about/programs/families/',
  },
  {
    name: 'Families Self-Certified Ads SDKs',
    url: 'https://support.google.com/googleplay/android-developer/answer/12955712?hl=en',
  },
];

const KIDS_APP_BLUEPRINT = [
  {
    title: 'Short Learning Loop',
    detail: 'Design every learning mission to complete in 3-7 minutes.',
  },
  {
    title: 'Age-Split UX',
    detail: 'Use low-text audio-first UX for ages 3-5 and quest UI for ages 6-8.',
  },
  {
    title: 'Adaptive Difficulty',
    detail: 'Raise or lower question difficulty using recent answer accuracy.',
  },
  {
    title: 'Parent Dashboard',
    detail: 'Track time, weak concepts, and next recommended activities.',
  },
  {
    title: 'Safe Rewards',
    detail: 'Prefer cosmetic rewards and badges over random paid power-ups.',
  },
  {
    title: 'Offline Core',
    detail: 'Keep core practice playable offline with local progress sync.',
  },
];

const BenchmarkCatalog = {
  filters: {
    age: 'all',
    subject: 'all',
    pricing: 'all',
  },
  defaultAgeFilter: 'all',

  ageOptions: [
    { id: 'all', label: 'All ages' },
    { id: '3-5', label: 'Age 3-5' },
    { id: '6-8', label: 'Age 6-8' },
  ],

  subjectOptions: [
    { id: 'all', label: 'All subjects' },
    { id: 'reading', label: 'Reading' },
    { id: 'math', label: 'Math' },
    { id: 'english', label: 'English' },
    { id: 'coding', label: 'Coding' },
    { id: 'creativity', label: 'Creativity' },
  ],

  pricingOptions: [
    { id: 'all', label: 'All pricing' },
    { id: 'free', label: 'Free' },
    { id: 'mixed', label: 'Mixed' },
    { id: 'subscription', label: 'Subscription' },
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
    return option ? option.label : 'All ages';
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
          <button class="benchmark-btn" onclick="App.navigate('home')">Back</button>
          <div class="benchmark-title">Kids App Lab</div>
          <button class="benchmark-btn" onclick="App.navigate('reference')">Dump Hub</button>
        </div>

        <section class="benchmark-hero">
          <div class="benchmark-hero-kicker">3-8 Learning Game Research</div>
          <h2>Build your app using proven market patterns</h2>
          <p>Filter real products by age, subject, and pricing to plan your MVP roadmap.</p>
        </section>

        <section class="benchmark-filters">
          <div class="benchmark-filter-group">
            <div class="benchmark-filter-label">
              Age <span class="benchmark-auto-chip">Auto: ${this.escapeHtml(autoAgeLabel)}</span>
            </div>
            <div class="benchmark-chip-row" id="benchmark-filter-age"></div>
          </div>
          <div class="benchmark-filter-group">
            <div class="benchmark-filter-label">Subject</div>
            <div class="benchmark-chip-row" id="benchmark-filter-subject"></div>
          </div>
          <div class="benchmark-filter-group">
            <div class="benchmark-filter-label">Pricing</div>
            <div class="benchmark-chip-row" id="benchmark-filter-pricing"></div>
          </div>
        </section>

        <section class="benchmark-results">
          <div class="benchmark-results-head">
            <div class="benchmark-results-main">
              <strong id="benchmark-result-count">Apps</strong>
              <span id="benchmark-check-count" class="benchmark-check-count">0 picked</span>
            </div>
            <div class="benchmark-head-actions">
              <button class="benchmark-btn" onclick="BenchmarkCatalog.clearChecklist()">Clear picks</button>
              <button class="benchmark-btn benchmark-btn-primary" onclick="BenchmarkCatalog.resetFilters()">Reset</button>
            </div>
          </div>
          <div class="benchmark-app-grid" id="benchmark-app-grid"></div>
        </section>

        <section class="benchmark-blueprint">
          <h3>MVP Blueprint</h3>
          <div class="benchmark-blueprint-grid">
            ${KIDS_APP_BLUEPRINT.map((item) => `
              <article class="benchmark-note-card">
                <h4>${this.escapeHtml(item.title)}</h4>
                <p>${this.escapeHtml(item.detail)}</p>
              </article>
            `).join('')}
          </div>
        </section>

        <section class="benchmark-policy">
          <h3>Policy Checklist</h3>
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

    countNode.textContent = `${list.length} apps matched`;
    if (checkNode) {
      checkNode.textContent = `${pickedInViewCount} in view / ${pickedTotalCount} picked`;
    }

    if (list.length === 0) {
      gridNode.innerHTML = `
        <div class="benchmark-empty">
          <h4>No result for this filter combo</h4>
          <p>Try resetting filters or broadening age/subject scope.</p>
        </div>
      `;
      return;
    }

    gridNode.innerHTML = list.map((app) => `
      <article class="benchmark-app-card">
        <div class="benchmark-app-head">
          <h4>${this.escapeHtml(app.name)}</h4>
          <span class="benchmark-price-tag">${this.escapeHtml(this.getPricingLabel(app.pricing))}</span>
        </div>
        <div class="benchmark-meta">
          <span>Age ${app.minAge}-${app.maxAge}</span>
          <span>${this.escapeHtml(app.subjects.join(', '))}</span>
        </div>
        <p class="benchmark-summary">${this.escapeHtml(app.summary)}</p>
        <div class="benchmark-card-actions">
          <button class="benchmark-btn benchmark-btn-primary" onclick="window.open('${this.escapeHtml(app.url)}', '_blank', 'noopener,noreferrer')">
            Open source
          </button>
          <button class="benchmark-btn benchmark-check-btn ${checklistMap[app.id] ? 'active' : ''}" onclick="BenchmarkCatalog.toggleChecklist('${app.id}')">
            ${checklistMap[app.id] ? 'Picked' : 'Pick for my app'}
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

  getPricingLabel(pricing) {
    if (pricing === 'free') return 'Free';
    if (pricing === 'mixed') return 'Mixed';
    if (pricing === 'subscription') return 'Subscription';
    return 'Unknown';
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
