// Profile management with avatar system and parent page

const PROFILES = {
  dokyung: {
    id: 'dokyung',
    name: '도경',
    age: 6,
    theme: 'pink',
    icon: '👸',
    title: '공주님',
    avatar: '👸',
    quizChoices: 4,
    matchingPairs: 4,
    fontSize: 80,
    touchSize: 48,
    autoHint: false,
    autoSpeak: false,
    wrongRetry: true,
    starsPerCorrect: 1,
    xpPerLearn: 3,
    xpPerGame: 5,
    countingMax: 10,
    tracingGuides: 'few',      // fewer guide dots
    canCombine: true,          // hangul combination unlocked
  },
  sobin: {
    id: 'sobin',
    name: '소빈',
    age: 3,
    theme: 'purple',
    icon: '🧚',
    title: '꽃요정',
    avatar: '🧚',
    quizChoices: 2,
    matchingPairs: 2,
    fontSize: 120,
    touchSize: 60,
    autoHint: true,
    autoSpeak: true,
    wrongRetry: false,
    starsPerCorrect: 2,
    xpPerLearn: 5,
    xpPerGame: 8,
    countingMax: 3,
    tracingGuides: 'many',     // more guide dots + auto advance
    canCombine: false,         // hangul combination locked
  },
};

const Profile = {
  showSelection() {
    const screen = document.getElementById('screen-profile');
    screen.innerHTML = `
      <div class="profile-select-container">
        <div class="profile-select-header">
          <div class="profile-select-fairy">🧚‍♀️</div>
          <h1 class="profile-title">누가 배우러 왔나요?</h1>
        </div>
        <div class="profile-cards">
          <button class="profile-card profile-dokyung" onclick="Profile.select('dokyung')">
            <div class="profile-avatar-ring pink-ring">
              <div class="profile-avatar">👸</div>
            </div>
            <div class="profile-name">도경</div>
            <div class="profile-desc">공주님 (6살)</div>
            <div class="profile-badge-preview">🌟 배우기 대장!</div>
          </button>
          <button class="profile-card profile-sobin" onclick="Profile.select('sobin')">
            <div class="profile-avatar-ring purple-ring">
              <div class="profile-avatar">🧚</div>
            </div>
            <div class="profile-name">소빈</div>
            <div class="profile-desc">꽃요정 (3살)</div>
            <div class="profile-badge-preview">✨ 귀여운 요정!</div>
          </button>
        </div>
      </div>
    `;
  },

  select(profileId) {
    App.currentProfile = profileId;
    Storage.setGlobal('lastProfile', profileId);
    document.body.classList.remove('theme-pink', 'theme-purple');
    document.body.classList.add(`theme-${PROFILES[profileId].theme}`);

    const card = document.querySelector(`.profile-${profileId}`);
    if (card) {
      card.classList.add('selected');
      setTimeout(() => {
        App.navigate('home');
        Daily.checkAttendance();
      }, 400);
    } else {
      App.navigate('home');
      Daily.checkAttendance();
    }
  },

  getCurrent() {
    return PROFILES[App.currentProfile] || PROFILES.dokyung;
  },

  // Parent page — 3 second long press to enter
  showParentPage() {
    const screen = document.getElementById('screen-parent');
    const profiles = ['dokyung', 'sobin'];

    screen.innerHTML = `
      <div class="parent-container">
        <div class="parent-header">
          <button class="btn-back" onclick="App.navigate('home')">
            <span class="back-arrow">&larr;</span>
          </button>
          <h2 class="parent-title">학습 현황</h2>
          <span></span>
        </div>

        ${profiles.map(pid => {
          const p = PROFILES[pid];
          const stats = Storage.getStats(pid);
          const weekly = Storage.getWeeklyActivity(pid);
          const maxBar = 1; // boolean bar

          return `
            <div class="parent-profile-section">
              <div class="parent-profile-header">
                <span class="parent-avatar">${p.icon}</span>
                <span class="parent-name">${p.name} ${p.title}</span>
                <span class="parent-level">${stats.level.icon} Lv.${stats.level.level}</span>
              </div>

              <div class="parent-stats-grid">
                <div class="parent-stat">
                  <div class="parent-stat-value">${stats.totalLearned}</div>
                  <div class="parent-stat-label">학습한 글자</div>
                </div>
                <div class="parent-stat">
                  <div class="parent-stat-value">${stats.totalGames}</div>
                  <div class="parent-stat-label">게임 점수</div>
                </div>
                <div class="parent-stat">
                  <div class="parent-stat-value">${stats.daysAttended}</div>
                  <div class="parent-stat-label">출석일</div>
                </div>
                <div class="parent-stat">
                  <div class="parent-stat-value">${stats.streak}일</div>
                  <div class="parent-stat-label">연속학습</div>
                </div>
              </div>

              <div class="parent-category-progress">
                <h4>카테고리별 진행률</h4>
                ${Object.entries(stats.categoryProgress).map(([catId, cp]) => `
                  <div class="parent-progress-row">
                    <span class="parent-progress-label">${CATEGORIES[catId].icon} ${CATEGORIES[catId].name}</span>
                    <div class="parent-progress-bar">
                      <div class="parent-progress-fill" style="width:${cp.percent}%;background:${CATEGORIES[catId].color}"></div>
                    </div>
                    <span class="parent-progress-text">${cp.percent}%</span>
                  </div>
                `).join('')}
              </div>

              <div class="parent-weekly">
                <h4>최근 7일 학습</h4>
                <div class="parent-weekly-chart">
                  ${weekly.map(w => `
                    <div class="parent-weekly-bar">
                      <div class="parent-bar-fill ${w.active ? 'active' : ''}" style="height:${w.active ? '100%' : '15%'}"></div>
                      <div class="parent-bar-label">${w.day}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          `;
        }).join('')}

        <div class="parent-actions">
          <button class="btn-secondary parent-reset-btn" onclick="Profile.confirmReset()">
            데이터 초기화
          </button>
        </div>
      </div>
    `;
    App.showScreen('parent');
  },

  confirmReset() {
    const popup = document.createElement('div');
    popup.className = 'popup-overlay';
    popup.innerHTML = `
      <div class="popup-content">
        <div class="popup-sticker">⚠️</div>
        <div class="popup-text">정말 모든 진도를 초기화할까요?</div>
        <div style="display:flex;gap:8px">
          <button class="btn-secondary" onclick="this.closest('.popup-overlay').remove()" style="flex:1">취소</button>
          <button class="btn-primary" onclick="Profile.resetAll()" style="flex:1;background:#EF5350">초기화</button>
        </div>
      </div>
    `;
    document.body.appendChild(popup);
  },

  resetAll() {
    Storage.resetProfile('dokyung');
    Storage.resetProfile('sobin');
    document.querySelectorAll('.popup-overlay').forEach(p => p.remove());
    Profile.showParentPage();
  },

  // Long press handler setup
  setupLongPress(element) {
    let timer = null;
    const start = () => { timer = setTimeout(() => Profile.showParentPage(), 3000); };
    const cancel = () => { if (timer) clearTimeout(timer); };
    element.addEventListener('mousedown', start);
    element.addEventListener('touchstart', start, { passive: true });
    element.addEventListener('mouseup', cancel);
    element.addEventListener('mouseleave', cancel);
    element.addEventListener('touchend', cancel);
    element.addEventListener('touchcancel', cancel);
  },
};
