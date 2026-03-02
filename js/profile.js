// Dynamic profile system with age presets and parent page

const AGE_PRESETS = {
  toddler: {
    label: '3~4세 아기 요정',
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
    label: '5~6세 꼬마 요정',
    quizChoices: 4,
    fontSize: 80,
    autoHint: false,
    autoSpeak: false,
    wrongRetry: true,
    matchingPairs: 4,
    countingMax: 20,
    canCombine: true,
    starsPerCorrect: 2,
    xpPerLearn: 3,
    xpPerGame: 8,
    speechRate: 0.8,
  },
  older: {
    label: '7~8세 마법 요정',
    quizChoices: 4,
    fontSize: 64,
    autoHint: false,
    autoSpeak: false,
    wrongRetry: false,
    matchingPairs: 6,
    countingMax: 50,
    canCombine: true,
    starsPerCorrect: 3,
    xpPerLearn: 4,
    xpPerGame: 10,
    speechRate: 0.9,
  },
};

const PROFILE_AVATARS = ['🧒', '🧚', '🐶', '🐰', '🐼', '🦊', '🦁', '⭐'];
const PROFILE_THEMES = ['pink', 'purple', 'blue', 'green'];
const MAX_PROFILES = 5;

const Profile = {
  _initialized: false,
  PARENT_GATE_KEY: 'parentGateV2',
  PARENT_GATE_MAX_ATTEMPTS: 5,
  PARENT_GATE_LOCK_MS: 10 * 60 * 1000,

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
        icon: '🦊',
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
    if (typeof App.startKidGuard === 'function') App.startKidGuard();
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
            <button class="age-btn active" data-age="toddler" onclick="Profile.selectAge(this)">3~4세</button>
            <button class="age-btn" data-age="child" onclick="Profile.selectAge(this)">5~6세</button>
            <button class="age-btn" data-age="older" onclick="Profile.selectAge(this)">7~8세</button>
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

  _getParentGateState() {
    return Storage.getGlobal(this.PARENT_GATE_KEY, {
      pin: null,
      attempts: 0,
      lockUntil: 0,
    }) || { pin: null, attempts: 0, lockUntil: 0 };
  },

  _setParentGateState(state) {
    Storage.setGlobal(this.PARENT_GATE_KEY, {
      pin: state?.pin || null,
      attempts: Math.max(0, Number(state?.attempts) || 0),
      lockUntil: Math.max(0, Number(state?.lockUntil) || 0),
    });
  },

  _formatLockRemaining(lockUntil) {
    const remainMs = Math.max(0, lockUntil - Date.now());
    const remainMin = Math.ceil(remainMs / 60000);
    return remainMin > 0 ? `${remainMin}분` : '잠시 후';
  },

  openParentGate(onVerified) {
    const state = this._getParentGateState();
    const now = Date.now();

    if (state.lockUntil && now < state.lockUntil) {
      alert(`보호자 인증이 잠겨 있어요. ${this._formatLockRemaining(state.lockUntil)} 후 다시 시도해주세요.`);
      return false;
    }

    if (!state.pin) {
      const newPin = prompt('부모 PIN 4자리를 설정하세요');
      if (newPin === null) return false;
      const normalized = String(newPin).trim();
      if (!/^\d{4}$/.test(normalized)) {
        alert('PIN은 숫자 4자리여야 합니다.');
        return false;
      }

      const confirmPin = prompt('PIN을 다시 입력하세요');
      if (confirmPin === null) return false;
      if (String(confirmPin).trim() !== normalized) {
        alert('PIN 확인이 일치하지 않습니다.');
        return false;
      }

      state.pin = normalized;
      state.attempts = 0;
      state.lockUntil = 0;
      this._setParentGateState(state);
    }

    const input = prompt('부모 PIN 4자리를 입력하세요');
    if (input === null) return false;
    if (String(input).trim() !== state.pin) {
      state.attempts = (state.attempts || 0) + 1;
      if (state.attempts >= this.PARENT_GATE_MAX_ATTEMPTS) {
        state.attempts = 0;
        state.lockUntil = Date.now() + this.PARENT_GATE_LOCK_MS;
        this._setParentGateState(state);
        alert('보호자 인증이 10분 동안 잠겼습니다.');
      } else {
        this._setParentGateState(state);
        alert(`PIN이 올바르지 않습니다. (${state.attempts}/${this.PARENT_GATE_MAX_ATTEMPTS})`);
      }
      return false;
    }

    state.attempts = 0;
    state.lockUntil = 0;
    this._setParentGateState(state);

    if (typeof onVerified === 'function') {
      onVerified();
      return true;
    }
    this.showParentPage();
    return true;
  },

  verifyParentGate(onVerified) {
    return this.openParentGate(onVerified);
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
    const progress = Storage.getProgress(profile.id);
    const weekly = Storage.getWeeklyUsage(profile.id);
    const usage = Storage.getUsage(profile.id);
    const settings = Storage.getParentSettings(profile.id, profile.ageGroup || 'child');
    const level = stats.level || getLevelInfo(stats.xp || 0);
    const maxMinutes = Math.max(1, ...weekly.map((w) => Number(w.minutes) || 0));
    const usedMin = Math.floor((usage.secondsToday || 0) / 60);
    const remainMin = settings.dailyLimitMin > 0
      ? Math.max(0, settings.dailyLimitMin - usedMin)
      : null;
    const categoryRows = Object.entries(CATEGORIES).map(([catId, cat]) =>
      this._renderProgressRow(cat?.name || catId, stats.categoryProgress?.[catId])
    ).join('');
    const cognitiveRows = this._buildCognitiveRows(stats, progress, usage);
    const insights = this._buildParentInsights(stats, progress, usage, weekly, settings, remainMin);

    return `
      <div class="parent-profile-section">
        <div class="parent-profile-header">
          <span class="parent-avatar">${profile.icon || '🧚'}</span>
          <span class="parent-name">${this._escapeHtml(profile.name || 'Profile')}</span>
          <span class="parent-level">Lv.${level.level}</span>
        </div>

        <div class="parent-stats-grid">
          <div class="parent-stat"><div class="parent-stat-value">${stats.totalLearned}</div><div class="parent-stat-label">학습</div></div>
          <div class="parent-stat"><div class="parent-stat-value">${stats.totalGames}</div><div class="parent-stat-label">게임</div></div>
          <div class="parent-stat"><div class="parent-stat-value">${stats.stars}</div><div class="parent-stat-label">별</div></div>
          <div class="parent-stat"><div class="parent-stat-value">${stats.streak}</div><div class="parent-stat-label">연속일</div></div>
          <div class="parent-stat"><div class="parent-stat-value">${progress.towerPlays || 0}</div><div class="parent-stat-label">타워 플레이</div></div>
          <div class="parent-stat"><div class="parent-stat-value">${progress.towerBestHeight || 0}</div><div class="parent-stat-label">최고 타워층</div></div>
        </div>

        <div class="parent-category-progress">
          <h4>카테고리 진행률</h4>
          ${categoryRows}
        </div>

        <div class="parent-cognitive-card">
          <h4>인지 발달 프로필</h4>
          <div class="parent-cognitive-list">
            ${cognitiveRows}
          </div>
          <div class="parent-cognitive-actions">
            <button class="btn-secondary" onclick="Profile.startWeakDomainRoutine('${profile.id}')">약점영역 바로 훈련 시작</button>
          </div>
        </div>

        <div class="parent-weekly">
          <h4>최근 7일 활동</h4>
          <div class="parent-weekly-chart">
            ${weekly.map(d => `
              <div class="parent-weekly-bar">
                <div class="parent-bar-fill ${d.active ? 'active' : ''}" style="height:${d.active ? Math.max(14, Math.round((d.minutes / maxMinutes) * 100)) : 14}%" title="${d.minutes || 0}분"></div>
                <span class="parent-bar-label">${d.day}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="parent-usage-card">
          <div class="parent-usage-title">오늘 시간 관리</div>
          <div class="parent-usage-row">
            <span>사용</span>
            <strong>${usedMin}분</strong>
          </div>
          <div class="parent-usage-row">
            <span>제한</span>
            <strong>${settings.dailyLimitMin > 0 ? `${settings.dailyLimitMin}분` : '무제한'}</strong>
          </div>
          <div class="parent-usage-row">
            <span>남은 시간</span>
            <strong>${remainMin === null ? '무제한' : `${remainMin}분`}</strong>
          </div>
          <div class="parent-usage-row">
            <span>휴식 알림 횟수</span>
            <strong>${usage.breakCountToday || 0}</strong>
          </div>
        </div>

        <div class="parent-insight-card">
          <h4>이번 주 코칭 제안</h4>
          <ul class="parent-insight-list">
            ${insights.map((text) => `<li>${this._escapeHtml(text)}</li>`).join('')}
          </ul>
        </div>

        ${this._renderParentSettings(profile, settings)}

        <div class="parent-actions">
          <button class="btn-secondary parent-report-btn" onclick="Profile.exportWeeklyReport('${profile.id}')">주간 리포트 PDF</button>
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

  _clampPercent(value) {
    return Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  },

  _getCognitiveDomains(stats, progress, usage) {
    const cp = stats?.categoryProgress || {};
    const hangul = Number(cp.hangul?.percent) || 0;
    const english = Number(cp.english?.percent) || 0;
    const number = Number(cp.number?.percent) || 0;
    const math = Number(cp.math?.percent) || 0;
    const quiz = Number(progress?.quizCorrect) || 0;
    const monsterType = Number(progress?.monsterTypeCorrect) || 0;
    const sound = Number(progress?.soundCorrect) || 0;
    const tracing = Number(progress?.tracingComplete) || 0;
    const matching = Number(progress?.matchingComplete) || 0;
    const tower = Number(progress?.towerCorrect) || 0;
    const streak = Number(stats?.streak) || 0;
    const breakCount = Number(usage?.breakCountToday) || 0;

    const language = this._clampPercent((hangul * 0.45) + (english * 0.45) + (Math.min(quiz, 120) / 120 * 10));
    const memory = this._clampPercent((matching * 2.8) + (sound * 2.2) + (tracing * 1.8));
    const logic = this._clampPercent((math * 0.4) + (number * 0.33) + (Math.min(tower, 120) / 120 * 17) + (Math.min(monsterType, 120) / 120 * 10));
    const focus = this._clampPercent((Math.min(streak, 30) / 30 * 70) + (Math.min(breakCount, 6) / 6 * 30));

    return [
      { id: 'language', label: '언어 이해', value: language, hint: '읽기/듣기/단어 연결' },
      { id: 'memory', label: '기억력', value: memory, hint: '시각/청각 작업기억' },
      { id: 'logic', label: '논리 사고', value: logic, hint: '문제해결/수리추론' },
      { id: 'focus', label: '집중 조절', value: focus, hint: '지속집중/자기조절' },
    ];
  },

  _buildCognitiveRows(stats, progress, usage) {
    const rows = this._getCognitiveDomains(stats, progress, usage);
    return rows.map((row) => `
      <div class="parent-cognitive-row">
        <div class="parent-cognitive-head">
          <span class="parent-cognitive-label">${row.label}</span>
          <span class="parent-cognitive-value">${row.value}%</span>
        </div>
        <div class="parent-cognitive-bar">
          <div class="parent-cognitive-fill" style="width:${row.value}%"></div>
        </div>
        <div class="parent-cognitive-hint">${row.hint}</div>
      </div>
    `).join('');
  },

  getCognitiveDomainsForProfile(profileId) {
    const profile = this.getById(profileId);
    if (!profile) return [];
    const stats = Storage.getStats(profile.id);
    const progress = Storage.getProgress(profile.id);
    const usage = Storage.getUsage(profile.id);
    return this._getCognitiveDomains(stats, progress, usage);
  },

  getWeakCognitiveDomain(profileId) {
    const domains = this.getCognitiveDomainsForProfile(profileId);
    if (!Array.isArray(domains) || domains.length === 0) return null;
    return domains.reduce((min, row) => {
      if (!min) return row;
      return (Number(row?.value) || 0) < (Number(min?.value) || 0) ? row : min;
    }, null);
  },

  _safeDomIdKey(profileId, key) {
    const p = String(profileId || '').replace(/[^a-zA-Z0-9_-]/g, '-');
    const k = String(key || '').replace(/[^a-zA-Z0-9_-]/g, '-');
    return `parent-setting-${p}-${k}`;
  },

  _settingOutputText(key, value) {
    const n = Math.max(0, Number(value) || 0);
    if (
      key === 'speechVolume' ||
      key === 'sfxVolume' ||
      key === 'adaptiveLanguage' ||
      key === 'adaptiveMemory' ||
      key === 'adaptiveLogic' ||
      key === 'adaptiveFocus'
    ) return `${n}%`;
    if (n === 0) return '무제한';
    return `${n}분`;
  },

  _renderParentSettings(profile, settings) {
    const profileId = this._escapeJs(profile.id);
    const dailyInput = this._safeDomIdKey(profile.id, 'dailyLimitMin-input');
    const dailyValue = this._safeDomIdKey(profile.id, 'dailyLimitMin-value');
    const sessionInput = this._safeDomIdKey(profile.id, 'sessionLimitMin-input');
    const sessionValue = this._safeDomIdKey(profile.id, 'sessionLimitMin-value');
    const breakInput = this._safeDomIdKey(profile.id, 'breakEveryMin-input');
    const breakValue = this._safeDomIdKey(profile.id, 'breakEveryMin-value');
    const speechInput = this._safeDomIdKey(profile.id, 'speechVolume-input');
    const speechValue = this._safeDomIdKey(profile.id, 'speechVolume-value');
    const sfxInput = this._safeDomIdKey(profile.id, 'sfxVolume-input');
    const sfxValue = this._safeDomIdKey(profile.id, 'sfxVolume-value');
    const adaptiveLanguageInput = this._safeDomIdKey(profile.id, 'adaptiveLanguage-input');
    const adaptiveLanguageValue = this._safeDomIdKey(profile.id, 'adaptiveLanguage-value');
    const adaptiveMemoryInput = this._safeDomIdKey(profile.id, 'adaptiveMemory-input');
    const adaptiveMemoryValue = this._safeDomIdKey(profile.id, 'adaptiveMemory-value');
    const adaptiveLogicInput = this._safeDomIdKey(profile.id, 'adaptiveLogic-input');
    const adaptiveLogicValue = this._safeDomIdKey(profile.id, 'adaptiveLogic-value');
    const adaptiveFocusInput = this._safeDomIdKey(profile.id, 'adaptiveFocus-input');
    const adaptiveFocusValue = this._safeDomIdKey(profile.id, 'adaptiveFocus-value');
    const muteInput = this._safeDomIdKey(profile.id, 'muteAll-input');
    const bedtimeEnabledInput = this._safeDomIdKey(profile.id, 'bedtimeEnabled-input');
    const bedtimeStartInput = this._safeDomIdKey(profile.id, 'bedtimeStart-input');
    const bedtimeEndInput = this._safeDomIdKey(profile.id, 'bedtimeEnd-input');

    return `
      <div class="parent-settings">
        <h4>부모 설정 관리</h4>

        <div class="parent-setting-row">
          <label class="parent-setting-label">하루 최대 사용 시간</label>
          <div class="parent-setting-control">
            <input id="${dailyInput}" type="range" min="0" max="240" step="5" value="${settings.dailyLimitMin}"
                   oninput="Profile.previewParentSetting('${profileId}','dailyLimitMin',this.value)">
            <span id="${dailyValue}" class="parent-setting-value">${this._settingOutputText('dailyLimitMin', settings.dailyLimitMin)}</span>
          </div>
        </div>

        <div class="parent-setting-row">
          <label class="parent-setting-label">연속 사용 제한</label>
          <div class="parent-setting-control">
            <input id="${sessionInput}" type="range" min="0" max="120" step="5" value="${settings.sessionLimitMin}"
                   oninput="Profile.previewParentSetting('${profileId}','sessionLimitMin',this.value)">
            <span id="${sessionValue}" class="parent-setting-value">${this._settingOutputText('sessionLimitMin', settings.sessionLimitMin)}</span>
          </div>
        </div>

        <div class="parent-setting-row">
          <label class="parent-setting-label">휴식 알림 주기</label>
          <div class="parent-setting-control">
            <input id="${breakInput}" type="range" min="0" max="60" step="5" value="${settings.breakEveryMin}"
                   oninput="Profile.previewParentSetting('${profileId}','breakEveryMin',this.value)">
            <span id="${breakValue}" class="parent-setting-value">${this._settingOutputText('breakEveryMin', settings.breakEveryMin)}</span>
          </div>
        </div>

        <div class="parent-setting-row">
          <label class="parent-setting-label">맞춤 추천 가중치 · 언어</label>
          <div class="parent-setting-control">
            <input id="${adaptiveLanguageInput}" type="range" min="50" max="150" step="5" value="${settings.adaptiveWeights?.language || 100}"
                   oninput="Profile.previewParentSetting('${profileId}','adaptiveLanguage',this.value)">
            <span id="${adaptiveLanguageValue}" class="parent-setting-value">${this._settingOutputText('adaptiveLanguage', settings.adaptiveWeights?.language || 100)}</span>
          </div>
        </div>

        <div class="parent-setting-row">
          <label class="parent-setting-label">맞춤 추천 가중치 · 기억</label>
          <div class="parent-setting-control">
            <input id="${adaptiveMemoryInput}" type="range" min="50" max="150" step="5" value="${settings.adaptiveWeights?.memory || 100}"
                   oninput="Profile.previewParentSetting('${profileId}','adaptiveMemory',this.value)">
            <span id="${adaptiveMemoryValue}" class="parent-setting-value">${this._settingOutputText('adaptiveMemory', settings.adaptiveWeights?.memory || 100)}</span>
          </div>
        </div>

        <div class="parent-setting-row">
          <label class="parent-setting-label">맞춤 추천 가중치 · 논리</label>
          <div class="parent-setting-control">
            <input id="${adaptiveLogicInput}" type="range" min="50" max="150" step="5" value="${settings.adaptiveWeights?.logic || 100}"
                   oninput="Profile.previewParentSetting('${profileId}','adaptiveLogic',this.value)">
            <span id="${adaptiveLogicValue}" class="parent-setting-value">${this._settingOutputText('adaptiveLogic', settings.adaptiveWeights?.logic || 100)}</span>
          </div>
        </div>

        <div class="parent-setting-row">
          <label class="parent-setting-label">맞춤 추천 가중치 · 집중</label>
          <div class="parent-setting-control">
            <input id="${adaptiveFocusInput}" type="range" min="50" max="150" step="5" value="${settings.adaptiveWeights?.focus || 100}"
                   oninput="Profile.previewParentSetting('${profileId}','adaptiveFocus',this.value)">
            <span id="${adaptiveFocusValue}" class="parent-setting-value">${this._settingOutputText('adaptiveFocus', settings.adaptiveWeights?.focus || 100)}</span>
          </div>
        </div>

        <div class="parent-setting-row">
          <label class="parent-setting-label">취침 시간 잠금</label>
          <div class="parent-time-lock-row">
            <label class="parent-toggle-inline">
              <input id="${bedtimeEnabledInput}" type="checkbox" ${settings.bedtimeEnabled ? 'checked' : ''}>
              <span>사용</span>
            </label>
            <input id="${bedtimeStartInput}" class="parent-time-input" type="time" value="${settings.bedtimeStart || '21:00'}">
            <span>~</span>
            <input id="${bedtimeEndInput}" class="parent-time-input" type="time" value="${settings.bedtimeEnd || '07:00'}">
          </div>
        </div>

        <div class="parent-setting-row">
          <label class="parent-setting-label">음성 볼륨</label>
          <div class="parent-setting-control">
            <input id="${speechInput}" type="range" min="0" max="100" step="5" value="${settings.speechVolume}"
                   oninput="Profile.previewParentSetting('${profileId}','speechVolume',this.value)">
            <span id="${speechValue}" class="parent-setting-value">${this._settingOutputText('speechVolume', settings.speechVolume)}</span>
          </div>
        </div>

        <div class="parent-setting-row">
          <label class="parent-setting-label">효과음 볼륨</label>
          <div class="parent-setting-control">
            <input id="${sfxInput}" type="range" min="0" max="100" step="5" value="${settings.sfxVolume}"
                   oninput="Profile.previewParentSetting('${profileId}','sfxVolume',this.value)">
            <span id="${sfxValue}" class="parent-setting-value">${this._settingOutputText('sfxVolume', settings.sfxVolume)}</span>
          </div>
        </div>

        <label class="parent-toggle-row">
          <input id="${muteInput}" type="checkbox" ${settings.muteAll ? 'checked' : ''}>
          <span>전체 무음 (음성 + 효과음)</span>
        </label>

        <div class="parent-settings-actions">
          <button class="btn-secondary" onclick="Profile.saveParentSettings('${profileId}')">설정 저장</button>
          <button class="btn-secondary" onclick="Profile.resetParentSettings('${profileId}')">기본값 복원</button>
        </div>
      </div>
    `;
  },

  _buildParentInsights(stats, progress, usage, weekly, settings, remainMin) {
    const insights = [];
    const categoryEntries = Object.entries(stats.categoryProgress || {});
    const weakest = categoryEntries
      .map(([id, row]) => ({ id, percent: Number(row?.percent) || 0, learned: Number(row?.learned) || 0 }))
      .sort((a, b) => a.percent - b.percent)[0];

    if (weakest && CATEGORIES[weakest.id]) {
      const cat = CATEGORIES[weakest.id];
      insights.push(`${cat.name} 진행률이 ${weakest.percent}%예요. 이번 주 추천: ${cat.name} 10분 복습.`);
    }

    const totalMinutes = weekly.reduce((sum, day) => sum + (Number(day.minutes) || 0), 0);
    const avgMinutes = Math.round(totalMinutes / Math.max(1, weekly.length));
    if (avgMinutes < 20) {
      insights.push(`하루 평균 학습 시간이 ${avgMinutes}분이에요. 추천: 하루 20~30분 루틴 만들기.`);
    } else if (avgMinutes > 70) {
      insights.push(`하루 평균 ${avgMinutes}분 사용 중이에요. 추천: 30~40분 집중 후 5분 휴식 루틴.`);
    } else {
      insights.push(`하루 평균 ${avgMinutes}분으로 안정적이에요. 지금의 흐름을 유지해 보세요.`);
    }

    if (settings.dailyLimitMin > 0) {
      if (remainMin !== null && remainMin <= 10) {
        insights.push('오늘 남은 시간이 10분 이하예요. 짧은 복습 카드 1~2개만 진행하면 좋아요.');
      } else {
        insights.push(`하루 제한 ${settings.dailyLimitMin}분 설정이 적용 중이에요. 장기적으로 학습 균형 유지에 좋아요.`);
      }
    } else {
      insights.push('하루 사용 제한이 꺼져 있어요. 연령대에 맞춰 45~90분 제한을 권장해요.');
    }

    const domains = this._getCognitiveDomains(stats, progress, usage);
    const weakestDomain = [...domains].sort((a, b) => a.value - b.value)[0];
    if (weakestDomain) {
      insights.push(`${weakestDomain.label} 지표가 낮아요. 오늘은 ${weakestDomain.hint} 중심으로 10~15분 루틴을 추천해요.`);
    }

    return insights.slice(0, 3);
  },

  previewParentSetting(profileId, key, value) {
    const outputId = this._safeDomIdKey(profileId, `${key}-value`);
    const output = document.getElementById(outputId);
    if (!output) return;
    output.textContent = this._settingOutputText(key, value);
  },

  saveParentSettings(profileId) {
    const profile = this.getById(profileId);
    if (!profile) return;
    const getNum = (key) => {
      const input = document.getElementById(this._safeDomIdKey(profileId, `${key}-input`));
      return Number(input?.value) || 0;
    };
    const muteInput = document.getElementById(this._safeDomIdKey(profileId, 'muteAll-input'));
    const bedtimeEnabledInput = document.getElementById(this._safeDomIdKey(profileId, 'bedtimeEnabled-input'));
    const bedtimeStartInput = document.getElementById(this._safeDomIdKey(profileId, 'bedtimeStart-input'));
    const bedtimeEndInput = document.getElementById(this._safeDomIdKey(profileId, 'bedtimeEnd-input'));
    const settings = {
      dailyLimitMin: getNum('dailyLimitMin'),
      sessionLimitMin: getNum('sessionLimitMin'),
      breakEveryMin: getNum('breakEveryMin'),
      adaptiveWeights: {
        language: getNum('adaptiveLanguage'),
        memory: getNum('adaptiveMemory'),
        logic: getNum('adaptiveLogic'),
        focus: getNum('adaptiveFocus'),
      },
      speechVolume: getNum('speechVolume'),
      sfxVolume: getNum('sfxVolume'),
      muteAll: !!muteInput?.checked,
      bedtimeEnabled: !!bedtimeEnabledInput?.checked,
      bedtimeStart: String(bedtimeStartInput?.value || '21:00').trim(),
      bedtimeEnd: String(bedtimeEndInput?.value || '07:00').trim(),
    };
    Storage.saveParentSettings(profileId, settings, profile.ageGroup || 'child');
    if (window.App && typeof App.handleParentSettingsUpdated === 'function') {
      App.handleParentSettingsUpdated(profileId);
    }
    if (App.currentScreen === 'parent') this.showParentPage();
  },

  resetParentSettings(profileId) {
    const profile = this.getById(profileId);
    if (!profile) return;
    const defaults = Storage.getParentDefaults(profile.ageGroup || 'child');
    Storage.saveParentSettings(profileId, defaults, profile.ageGroup || 'child');
    if (window.App && typeof App.handleParentSettingsUpdated === 'function') {
      App.handleParentSettingsUpdated(profileId);
    }
    if (App.currentScreen === 'parent') this.showParentPage();
  },

  exportWeeklyReport(profileId) {
    const profile = this.getById(profileId);
    if (!profile) return;

    const stats = Storage.getStats(profile.id);
    const usage = Storage.getUsage(profile.id);
    const weeklyUsage = Storage.getWeeklyUsage(profile.id);
    const settings = Storage.getParentSettings(profile.id, profile.ageGroup || 'child');
    const totalMinutes = weeklyUsage.reduce((sum, day) => sum + (Number(day.minutes) || 0), 0);
    const avgMinutes = Math.round(totalMinutes / Math.max(1, weeklyUsage.length));
    const maxMinutes = Math.max(1, ...weeklyUsage.map((day) => Number(day.minutes) || 0));

    const bars = weeklyUsage.map((day) => {
      const width = Math.max(6, Math.round(((Number(day.minutes) || 0) / maxMinutes) * 100));
      return `
        <tr>
          <td>${this._escapeHtml(day.day)}</td>
          <td>${day.minutes || 0}분</td>
          <td>${day.breakCount || 0}</td>
          <td>
            <div style="background:#f1e6ff;border-radius:8px;height:10px;overflow:hidden;">
              <div style="height:10px;width:${width}%;background:linear-gradient(90deg,#ff7ac8,#8f9bff);"></div>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    const categories = Object.entries(CATEGORIES).map(([catId, cat]) => {
      const cp = stats.categoryProgress?.[catId] || { learned: 0, total: 0, percent: 0 };
      return `
      <tr>
        <td>${this._escapeHtml(cat?.name || catId)}</td>
        <td>${Number(cp?.learned) || 0} / ${Number(cp?.total) || 0}</td>
        <td>${Number(cp?.percent) || 0}%</td>
      </tr>
    `;
    }).join('');

    const html = `
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>주간 학습 리포트</title>
  <style>
    body { font-family: "Pretendard", "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", system-ui, -apple-system, sans-serif; margin: 24px; color: #2f2457; }
    h1 { margin: 0 0 8px 0; font-size: 24px; }
    .meta { color: #6d5c9b; margin-bottom: 18px; font-size: 13px; }
    .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin-bottom: 18px; }
    .card { border: 1px solid #e7ddff; border-radius: 10px; padding: 10px; background: #fbf9ff; }
    .k { font-size: 12px; color: #7d6cb2; }
    .v { font-size: 20px; font-weight: 700; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    th, td { border-bottom: 1px solid #efe8ff; padding: 8px 6px; text-align: left; font-size: 13px; }
    th { color: #6e5ca8; font-weight: 700; }
    .hint { font-size: 12px; color: #7d6cb2; margin-top: 8px; }
    @media print { body { margin: 12mm; } }
  </style>
</head>
<body>
  <h1>주간 학습 리포트</h1>
  <div class="meta">${this._escapeHtml(profile.name || '프로필')} · 생성 시각 ${this._escapeHtml(new Date().toLocaleString())}</div>

  <div class="grid">
    <div class="card"><div class="k">주간 총 학습 시간</div><div class="v">${totalMinutes}분</div></div>
    <div class="card"><div class="k">하루 평균</div><div class="v">${avgMinutes}분</div></div>
    <div class="card"><div class="k">오늘 학습 시간</div><div class="v">${Math.floor((usage.secondsToday || 0) / 60)}분</div></div>
    <div class="card"><div class="k">일일 제한 시간</div><div class="v">${settings.dailyLimitMin > 0 ? `${settings.dailyLimitMin}분` : '제한 없음'}</div></div>
  </div>

  <h3>최근 7일 사용 추이</h3>
  <table>
    <thead>
      <tr><th>요일</th><th>분</th><th>휴식 횟수</th><th>그래프</th></tr>
    </thead>
    <tbody>${bars}</tbody>
  </table>

  <h3>학습 진도</h3>
  <table>
    <thead>
      <tr><th>카테고리</th><th>학습 수</th><th>진행률</th></tr>
    </thead>
    <tbody>${categories}</tbody>
  </table>

  <div class="hint">취침 시간 잠금: ${settings.bedtimeEnabled ? `${settings.bedtimeStart} ~ ${settings.bedtimeEnd}` : '사용 안 함'}</div>
  <div class="hint">팁: 인쇄 창에서 "PDF로 저장"을 선택하면 돼요.</div>

  <script>window.addEventListener('load', () => setTimeout(() => window.print(), 250));</script>
</body>
</html>
    `;

    const popup = window.open('', '_blank');
    if (!popup) {
      alert('리포트를 내보내려면 팝업 허용이 필요해요.');
      return;
    }
    popup.document.open();
    popup.document.write(html);
    popup.document.close();
  },

  resetProfileData(profileId) {
    const p = this.getById(profileId);
    if (!p) return;
    if (!confirm(`${p.name} 프로필의 학습 데이터를 초기화할까요?`)) return;
    Storage.resetProfile(profileId);
    if (App.currentScreen === 'parent') this.showParentPage();
  },

  startWeakDomainRoutine(profileId) {
    const profile = this.getById(profileId);
    if (!profile || !window.App) return;

    if (App.currentProfile !== profile.id) {
      this._applyTheme(profile.theme);
      App.currentProfile = profile.id;
      Storage.setGlobal('lastProfile', profile.id);
      if (typeof App.startKidGuard === 'function') App.startKidGuard();
    }

    const progress = Storage.getProgress(profile.id);
    const usage = Storage.getUsage(profile.id);
    const steps = typeof App.getPriorityRecommendationSteps === 'function'
      ? App.getPriorityRecommendationSteps(profile, progress, usage)
      : [];
    if (!steps.length || typeof App.createRecommendationCard !== 'function') return;

    const card = App.createRecommendationCard(steps[0], progress);
    if (!card) return;

    App.recommendationCards = [card];
    if (typeof App.runRecommendation === 'function') {
      App.runRecommendation(0);
    }
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

  _escapeJs(text) {
    return String(text ?? '')
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\r?\n/g, ' ');
  },
};

