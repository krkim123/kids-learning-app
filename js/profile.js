// Dynamic profile system with age presets and parent page

const AGE_PRESETS = {
  toddler: {
    label: '3~4살 아기요정',
    quizChoices: 2,
    fontSize: 120,
    autoHint: true,
    autoSpeak: true,
    wrongRetry: true,
    matchingPairs: 2,
    countingMax: 5,
    canCombine: false,
    starsPerCorrect: 2,
    xpPerLearn: 2,
    xpPerGame: 5,
    speechRate: 0.6,
  },
  child: {
    label: '5~6살 꼬마요정',
    quizChoices: 4,
    fontSize: 80,
    autoHint: false,
    autoSpeak: false,
    wrongRetry: true,
    matchingPairs: 4,
    countingMax: 15,
    canCombine: true,
    starsPerCorrect: 2,
    xpPerLearn: 3,
    xpPerGame: 8,
    speechRate: 0.8,
  },
  older: {
    label: '7살+ 마법요정',
    quizChoices: 4,
    fontSize: 64,
    autoHint: false,
    autoSpeak: false,
    wrongRetry: false,
    matchingPairs: 6,
    countingMax: 30,
    canCombine: true,
    starsPerCorrect: 3,
    xpPerLearn: 4,
    xpPerGame: 10,
    speechRate: 0.9,
  },
};

const PROFILE_AVATARS = ['👸', '🧚', '🦄', '🐰', '🦁', '🐶', '🧑‍🚀', '⭐'];
const PROFILE_THEMES = ['pink', 'purple', 'blue', 'green'];
const MAX_PROFILES = 5;

const Profile = {
  _initialized: false,

  ensureInit() {
    if (this._initialized) return;
    this._initialized = true;
    this.migrateLegacyProfiles();
  },

  migrateLegacyProfiles() {
    const existing = Storage.getProfiles();
    if (existing.length > 0) return;

    const hasDokyungData = !!localStorage.getItem(`${Storage.PREFIX}dokyung-progress`);
    const hasSobinData = !!localStorage.getItem(`${Storage.PREFIX}sobin-progress`);
    const lastProfile = Storage.getGlobal('lastProfile');
    const hasLegacyLast = lastProfile === 'dokyung' || lastProfile === 'sobin';

    if (!hasDokyungData && !hasSobinData && !hasLegacyLast) return;

    const legacyProfiles = [
      {
        id: 'dokyung',
        name: '도경',
        ageGroup: 'child',
        icon: '👸',
        theme: 'pink',
      },
      {
        id: 'sobin',
        name: '소빈',
        ageGroup: 'toddler',
        icon: '🧚',
        theme: 'purple',
      },
    ];
    Storage.saveProfiles(legacyProfiles);
  },

  getAll() {
    this.ensureInit();
    return Storage.getProfiles();
  },

  getById(profileId) {
    return this.getAll().find(p => p.id === profileId) || null;
  },

  getCurrent() {
    this.ensureInit();
    const all = this.getAll();
    const currentId = window.App ? App.currentProfile : Storage.getGlobal('lastProfile');
    let profile = this.getById(currentId);
    if (!profile && all.length > 0) {
      profile = all[0];
      if (window.App) App.currentProfile = profile.id;
    }
    if (!profile) {
      profile = {
        id: 'guest',
        name: '게스트',
        ageGroup: 'child',
        icon: '🧚',
        theme: 'pink',
      };
    }
    return this._withPreset(profile);
  },

  _withPreset(profile) {
    const preset = AGE_PRESETS[profile.ageGroup] || AGE_PRESETS.child;
    return { ...preset, ...profile };
  },

  _applyTheme(theme) {
    document.body.classList.remove('theme-pink', 'theme-purple', 'theme-blue', 'theme-green');
    document.body.classList.add(`theme-${theme || 'pink'}`);
  },

  select(profileId) {
    const profile = this.getById(profileId);
    if (!profile) return;
    this._applyTheme(profile.theme);
    App.currentProfile = profile.id;
    Storage.setGlobal('lastProfile', profile.id);
    App.navigate('home');
    Daily.checkAttendance();
  },

  showSelection() {
    this.ensureInit();
    const profiles = this.getAll();
    const screen = document.getElementById('screen-profile');
    if (!screen) return;

    if (profiles.length === 0) {
      screen.innerHTML = `
        <div class="profile-select-container">
          <div class="profile-select-header">
            <div class="profile-select-fairy">🧚</div>
            <h2 class="profile-title">요정교실에 오신 걸 환영해요</h2>
          </div>
          ${this._renderCreateForm(true)}
        </div>
      `;
      App.showScreen('profile');
      return;
    }

    screen.innerHTML = `
      <div class="profile-select-container">
        <div class="profile-select-header">
          <div class="profile-select-fairy">🧚</div>
          <h2 class="profile-title">프로필을 선택해 주세요</h2>
        </div>
        <div class="profile-cards">
          ${profiles.map(p => this._renderProfileCard(p)).join('')}
          <button class="profile-card profile-add-card" onclick="Profile.toggleCreatePanel()">
            <div class="profile-avatar-ring pink-ring"><span class="profile-avatar">➕</span></div>
            <div class="profile-name">추가</div>
            <div class="profile-desc">새 프로필</div>
          </button>
        </div>
        <div id="profile-create-panel" class="profile-create-panel" style="display:none;">
          ${this._renderCreateForm(false)}
        </div>
      </div>
    `;
    App.showScreen('profile');
  },

  _renderProfileCard(profile) {
    const safeName = this._escapeHtml(profile.name || '프로필');
    const preset = AGE_PRESETS[profile.ageGroup] || AGE_PRESETS.child;
    const ringClass = profile.theme === 'purple' ? 'purple-ring' : 'pink-ring';
    return `
      <button class="profile-card" onclick="Profile.select('${profile.id}')">
        <div class="profile-avatar-ring ${ringClass}">
          <span class="profile-avatar">${profile.icon || '🧚'}</span>
        </div>
        <div class="profile-name">${safeName}</div>
        <div class="profile-desc">${preset.label}</div>
      </button>
    `;
  },

  _renderCreateForm(forceVisible) {
    return `
      <div class="profile-create-box ${forceVisible ? 'always' : ''}">
        <div class="profile-create-title">새 프로필 만들기</div>
        <div class="profile-form-row">
          <input id="new-profile-name" class="profile-input" maxlength="6" placeholder="이름 (최대 6자)" />
        </div>
        <div class="profile-form-row">
          <div class="profile-age-grid">
            <button class="age-btn active" data-age="toddler" onclick="Profile.selectAge(this)">3~4살</button>
            <button class="age-btn" data-age="child" onclick="Profile.selectAge(this)">5~6살</button>
            <button class="age-btn" data-age="older" onclick="Profile.selectAge(this)">7살+</button>
          </div>
        </div>
        <div class="profile-form-row">
          <div class="profile-avatar-grid">
            ${PROFILE_AVATARS.map((icon, idx) =>
              `<button class="avatar-btn ${idx === 0 ? 'active' : ''}" data-avatar="${icon}" onclick="Profile.selectAvatar(this)">${icon}</button>`
            ).join('')}
          </div>
        </div>
        <div class="profile-form-row">
          <div class="profile-theme-grid">
            ${PROFILE_THEMES.map((theme, idx) =>
              `<button class="theme-btn ${idx === 0 ? 'active' : ''}" data-theme="${theme}" onclick="Profile.selectTheme(this)">${theme}</button>`
            ).join('')}
          </div>
        </div>
        <div class="profile-form-row profile-form-actions">
          <button class="btn-primary" onclick="Profile.create()">저장</button>
        </div>
      </div>
    `;
  },

  toggleCreatePanel() {
    const panel = document.getElementById('profile-create-panel');
    if (!panel) return;
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  },

  selectAge(btn) {
    document.querySelectorAll('.age-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  },

  selectAvatar(btn) {
    document.querySelectorAll('.avatar-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  },

  selectTheme(btn) {
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  },

  create() {
    const profiles = this.getAll();
    if (profiles.length >= MAX_PROFILES) {
      alert(`프로필은 최대 ${MAX_PROFILES}개까지 만들 수 있어요.`);
      return;
    }

    const nameInput = document.getElementById('new-profile-name');
    const ageBtn = document.querySelector('.age-btn.active');
    const avatarBtn = document.querySelector('.avatar-btn.active');
    const themeBtn = document.querySelector('.theme-btn.active');

    const name = (nameInput?.value || '').trim();
    if (!name) {
      alert('이름을 입력해 주세요.');
      return;
    }

    const profile = {
      id: `p_${Date.now()}`,
      name: name.slice(0, 6),
      ageGroup: ageBtn?.dataset?.age || 'child',
      icon: avatarBtn?.dataset?.avatar || '🧚',
      theme: themeBtn?.dataset?.theme || 'pink',
    };

    Storage.upsertProfile(profile);
    this.select(profile.id);
  },

  setupLongPress(targetEl) {
    if (!targetEl || targetEl.dataset.parentBound === '1') return;
    targetEl.dataset.parentBound = '1';

    let timer = null;
    const start = () => {
      clearTimeout(timer);
      timer = setTimeout(() => this.openParentGate(), 3000);
    };
    const cancel = () => {
      if (timer) clearTimeout(timer);
      timer = null;
    };

    targetEl.addEventListener('touchstart', start, { passive: true });
    targetEl.addEventListener('touchend', cancel, { passive: true });
    targetEl.addEventListener('touchcancel', cancel, { passive: true });
    targetEl.addEventListener('mousedown', start);
    targetEl.addEventListener('mouseup', cancel);
    targetEl.addEventListener('mouseleave', cancel);
  },

  openParentGate() {
    const a = 12 + Math.floor(Math.random() * 18);
    const b = 11 + Math.floor(Math.random() * 17);
    const answer = String(a + b);
    const input = prompt(`부모 확인: ${a} + ${b} = ?`);
    if (input === null) return;
    if (input.trim() !== answer) {
      alert('정답이 아니에요.');
      return;
    }
    this.showParentPage();
  },

  showParentPage() {
    const profiles = this.getAll();
    const screen = document.getElementById('screen-parent');
    if (!screen) return;

    screen.innerHTML = `
      <div class="parent-container">
        <div class="learn-header parent-header">
          <button class="btn-back" onclick="App.navigate('home')">
            <span class="back-arrow">&larr;</span>
          </button>
          <h2 class="learn-title parent-title">부모 페이지</h2>
          <span></span>
        </div>
        ${profiles.map(p => this._renderParentProfile(p)).join('')}
      </div>
    `;
    App.showScreen('parent');
  },

  _renderParentProfile(profile) {
    const stats = Storage.getStats(profile.id);
    const weekly = Storage.getWeeklyActivity(profile.id);
    const level = stats.level || getLevelInfo(stats.xp || 0);
    const barHeight = weekly.some(w => w.active) ? 100 : 20;

    return `
      <div class="parent-profile-section">
        <div class="parent-profile-header">
          <span class="parent-avatar">${profile.icon || '🧚'}</span>
          <span class="parent-name">${this._escapeHtml(profile.name || '프로필')}</span>
          <span class="parent-level">Lv.${level.level}</span>
        </div>

        <div class="parent-stats-grid">
          <div class="parent-stat"><div class="parent-stat-value">${stats.totalLearned}</div><div class="parent-stat-label">학습</div></div>
          <div class="parent-stat"><div class="parent-stat-value">${stats.totalGames}</div><div class="parent-stat-label">게임</div></div>
          <div class="parent-stat"><div class="parent-stat-value">${stats.stars}</div><div class="parent-stat-label">별</div></div>
          <div class="parent-stat"><div class="parent-stat-value">${stats.streak}</div><div class="parent-stat-label">연속일</div></div>
        </div>

        <div class="parent-category-progress">
          <h4>카테고리 진행률</h4>
          ${this._renderProgressRow('한글', stats.categoryProgress.hangul)}
          ${this._renderProgressRow('영어', stats.categoryProgress.english)}
          ${this._renderProgressRow('숫자', stats.categoryProgress.number)}
        </div>

        <div class="parent-weekly">
          <h4>최근 7일 활동</h4>
          <div class="parent-weekly-chart">
            ${weekly.map(d => `
              <div class="parent-weekly-bar">
                <div class="parent-bar-fill ${d.active ? 'active' : ''}" style="height:${d.active ? barHeight : 20}%"></div>
                <span class="parent-bar-label">${d.day}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="parent-actions">
          <button class="btn-secondary parent-reset-btn" onclick="Profile.resetProfileData('${profile.id}')">학습 데이터 초기화</button>
          <button class="btn-secondary" onclick="Profile.deleteProfile('${profile.id}')">프로필 삭제</button>
        </div>
      </div>
    `;
  },

  _renderProgressRow(label, progress) {
    const safe = progress || { percent: 0 };
    return `
      <div class="parent-progress-row">
        <span class="parent-progress-label">${label}</span>
        <div class="parent-progress-bar">
          <div class="parent-progress-fill" style="width:${safe.percent || 0}%"></div>
        </div>
        <span class="parent-progress-text">${safe.percent || 0}%</span>
      </div>
    `;
  },

  resetProfileData(profileId) {
    const p = this.getById(profileId);
    if (!p) return;
    if (!confirm(`${p.name} 프로필의 학습 데이터를 초기화할까요?`)) return;
    Storage.resetProfile(profileId);
    if (App.currentScreen === 'parent') this.showParentPage();
  },

  deleteProfile(profileId) {
    const p = this.getById(profileId);
    if (!p) return;
    if (!confirm(`${p.name} 프로필을 삭제할까요?`)) return;
    Storage.deleteProfile(profileId);

    const all = this.getAll();
    if (all.length === 0) {
      App.currentProfile = null;
      this.showSelection();
      return;
    }

    if (App.currentProfile === profileId) {
      this.select(all[0].id);
      return;
    }

    if (App.currentScreen === 'parent') this.showParentPage();
  },

  _escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },
};
