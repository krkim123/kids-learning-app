// SPA Router — 12 screens, tab bar, header

const App = {
  currentProfile: null,
  currentScreen: 'splash',
  currentTab: 'home',

  screens: ['splash','profile','home','category','learn','game-select','game',
            'combine','coloring','reward','attendance','parent'],

  init() {
    // Audio context init
    const initAudio = () => {
      if (!SFX.ctx) SFX.init();
      if (SFX.ctx && SFX.ctx.state === 'suspended') SFX.ctx.resume();
    };
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('touchstart', initAudio, { once: true });

    Speech.init();

    const lastProfile = Storage.getGlobal('lastProfile');
    this.showSplash(() => {
      if (lastProfile) {
        this.currentProfile = lastProfile;
        document.body.classList.add(`theme-${PROFILES[lastProfile].theme}`);
        this.navigate('home');
        Daily.checkAttendance();
      } else {
        this.navigate('profile');
      }
    });
  },

  showSplash(callback) {
    this.showScreen('splash');
    const splash = document.getElementById('screen-splash');
    splash.innerHTML = `
      <div class="splash-content">
        <div class="splash-fairy">🧚‍♀️</div>
        <h1 class="splash-title">도경소빈의<br>요정 교실</h1>
        <div class="splash-sparkles">
          <span class="sparkle s1">✨</span>
          <span class="sparkle s2">⭐</span>
          <span class="sparkle s3">💫</span>
          <span class="sparkle s4">🌟</span>
        </div>
      </div>
    `;
    setTimeout(callback, 1500);
  },

  navigate(screenId) {
    // Map tab
    const tabMap = { home:'home', category:'home', learn:'home',
                     'game-select':'play', game:'play', combine:'play',
                     coloring:'play', reward:'reward', attendance:'home' };
    this.currentTab = tabMap[screenId] || 'home';

    switch (screenId) {
      case 'profile': Profile.showSelection(); break;
      case 'home': this.showHome(); break;
      case 'reward': Reward.showRewardScreen(); break;
      case 'attendance': Daily.showAttendancePage(); break;
    }

    this.showScreen(screenId);
  },

  showScreen(screenId) {
    this.screens.forEach(s => {
      const el = document.getElementById(`screen-${s}`);
      if (el) el.classList.remove('active');
    });
    const target = document.getElementById(`screen-${screenId}`);
    if (target) {
      target.classList.add('active');
      this.currentScreen = screenId;
    }

    // Show/hide tab bar
    const tabBar = document.getElementById('tab-bar');
    const header = document.getElementById('app-header');
    const noTabScreens = ['splash', 'profile'];
    const noHeaderScreens = ['splash', 'profile'];
    if (tabBar) tabBar.style.display = noTabScreens.includes(screenId) ? 'none' : 'flex';
    if (header) header.style.display = noHeaderScreens.includes(screenId) ? 'none' : 'flex';

    // Update header
    if (!noHeaderScreens.includes(screenId)) this.updateHeader();
    // Update tab bar active
    this.updateTabBar();
  },

  showHome() {
    const profile = Profile.getCurrent();
    const progress = Storage.getProgress(this.currentProfile);
    const att = Storage.getAttendance(this.currentProfile);
    const missions = Storage.getMissions(this.currentProfile);
    const lvl = getLevelInfo(progress.xp || 0);
    const screen = document.getElementById('screen-home');

    // Train carousel cards
    const trainCards = [];
    Object.entries(CATEGORIES).forEach(([catId, cat]) => {
      cat.stages.forEach(stage => {
        const sp = getStageProgress(catId, stage.id, progress);
        const unlocked = isStageUnlocked(catId, stage.id, progress);
        trainCards.push({
          catId, cat, stage, sp, unlocked,
          label: `${cat.icon} ${cat.name} ${stage.name}`,
        });
      });
    });

    // Today's recommended (incomplete & unlocked stages)
    const todayCards = trainCards
      .filter(c => c.unlocked && !c.sp.complete)
      .slice(0, 5);
    if (todayCards.length === 0) {
      // All done? Show first 3
      todayCards.push(...trainCards.slice(0, 3));
    }

    // Mission summary
    const missionCount = missions?.missions ? missions.missions.filter(m => m.done).length : 0;
    const missionTotal = missions?.missions ? missions.missions.length : 3;

    screen.innerHTML = `
      <div class="home-container">
        <!-- Today's Learning -->
        <div class="home-section">
          <h2 class="home-section-title">🌟 오늘 학습</h2>
          <div class="today-cards">
            ${todayCards.map(c => `
              <button class="today-card" onclick="${c.unlocked ? `Learn.show('${c.catId}', ${c.stage.id})` : ''}"
                      style="--card-accent: ${c.cat.color}">
                <div class="today-card-icon">${c.cat.icon}</div>
                <div class="today-card-info">
                  <div class="today-card-name">${c.cat.name} ${c.stage.name}</div>
                  <div class="today-card-sub">${c.stage.subtitle}</div>
                </div>
                <div class="today-card-badge ${c.sp.complete ? 'complete' : ''}">
                  ${c.sp.complete ? '✓' : `${c.sp.percent}%`}
                </div>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Mission Summary -->
        <div class="home-section">
          <button class="mission-summary-card" onclick="App.navigate('attendance')">
            <span class="mission-summary-icon">🎯</span>
            <span class="mission-summary-text">오늘의 미션 ${missionCount}/${missionTotal}</span>
            <span class="mission-summary-streak">🔥${att.streak || 0}일</span>
          </button>
        </div>

        <!-- Train Carousel -->
        <div class="home-section">
          <h2 class="home-section-title">🚂 학습 기차</h2>
          <div class="train-carousel">
            <div class="train-track"></div>
            <div class="train-cars" id="train-cars">
              ${trainCards.map(c => `
                <button class="train-car ${c.unlocked ? '' : 'locked'} ${c.sp.complete ? 'complete' : ''}"
                        onclick="${c.unlocked ? `Learn.show('${c.catId}', ${c.stage.id})` : ''}"
                        style="--roof-color: ${c.cat.color}">
                  <div class="train-roof"></div>
                  <div class="train-body">
                    <div class="train-emoji">${c.cat.icon}</div>
                    <div class="train-label">${c.cat.name}<br>${c.stage.name}</div>
                    ${c.sp.complete ? '<div class="train-badge">⭐</div>' : ''}
                    ${!c.unlocked ? '<div class="train-lock">🔒</div>' : ''}
                  </div>
                  <div class="train-wheels">
                    <span class="wheel"></span><span class="wheel"></span>
                  </div>
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Quick Play -->
        <div class="home-section">
          <h2 class="home-section-title">🎮 빠른 놀이</h2>
          <div class="quick-play-grid">
            <button class="quick-play-card" onclick="Coloring.showDesigns()" style="--qp-color:#FF69B4">
              <span class="qp-icon">🎨</span><span class="qp-name">색칠하기</span>
            </button>
            ${Profile.getCurrent().canCombine ? `
              <button class="quick-play-card" onclick="Learn.showCombine()" style="--qp-color:#AB47BC">
                <span class="qp-icon">🔤</span><span class="qp-name">한글 조합</span>
              </button>
            ` : ''}
            <button class="quick-play-card" onclick="Game.startCounting()" style="--qp-color:#66BB6A">
              <span class="qp-icon">🔢</span><span class="qp-name">숫자 세기</span>
            </button>
          </div>
        </div>

        <div class="home-bottom-spacer"></div>
      </div>
    `;

    // Setup long press on profile avatar for parent page
    setTimeout(() => {
      const avatarBtn = document.getElementById('header-avatar');
      if (avatarBtn) Profile.setupLongPress(avatarBtn);
    }, 100);
  },

  updateHeader() {
    const header = document.getElementById('app-header');
    if (!header || !this.currentProfile) return;
    const profile = Profile.getCurrent();
    const progress = Storage.getProgress(this.currentProfile);
    const att = Storage.getAttendance(this.currentProfile);
    const lvl = getLevelInfo(progress.xp || 0);
    const now = new Date();
    const dateStr = `${now.getMonth()+1}월 ${now.getDate()}일`;

    header.innerHTML = `
      <button class="header-left" id="header-avatar" onclick="App.switchProfile()">
        <span class="header-avatar-icon">${profile.icon}</span>
        <span class="header-name">${profile.name}</span>
      </button>
      <div class="header-center">
        <span class="header-date">${dateStr}</span>
        <span class="header-level">${lvl.icon} Lv.${lvl.level}</span>
      </div>
      <div class="header-right">
        <span class="header-stars">⭐ <span id="header-stars">${progress.stars}</span></span>
        <span class="header-streak">🔥${att.streak || 0}</span>
      </div>
    `;

    // Re-setup long press
    setTimeout(() => {
      const avatarBtn = document.getElementById('header-avatar');
      if (avatarBtn) Profile.setupLongPress(avatarBtn);
    }, 50);
  },

  updateTabBar() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === this.currentTab);
    });
  },

  switchProfile() {
    document.body.classList.remove('theme-pink', 'theme-purple');
    this.currentProfile = null;
    this.navigate('profile');
  },

  // Tab handlers
  tabHome() { this.navigate('home'); },
  tabHangul() { Learn.showStages('hangul'); },
  tabEnglish() { Learn.showStages('english'); },
  tabNumber() { Learn.showStages('number'); },
  tabPlay() {
    // Show a play menu screen
    const screen = document.getElementById('screen-game-select');
    screen.innerHTML = `
      <div class="game-select-container play-hub">
        <div class="play-hub-title">🎮 놀이터</div>
        <div class="game-mode-cards">
          ${Object.entries(CATEGORIES).map(([catId, cat]) => `
            <button class="game-mode-card" onclick="Game.showSelection('${catId}')">
              <div class="game-mode-icon">${cat.icon}</div>
              <div>
                <div class="game-mode-name">${cat.name} 게임</div>
                <div class="game-mode-desc">글자맞추기, 짝맞추기, 소리찾기, 따라쓰기</div>
              </div>
            </button>
          `).join('')}
          <button class="game-mode-card" onclick="Coloring.showDesigns()">
            <div class="game-mode-icon">🎨</div>
            <div>
              <div class="game-mode-name">색칠하기</div>
              <div class="game-mode-desc">예쁜 그림을 색칠해요</div>
            </div>
          </button>
          ${Profile.getCurrent().canCombine ? `
            <button class="game-mode-card" onclick="Learn.showCombine()">
              <div class="game-mode-icon">🔤</div>
              <div>
                <div class="game-mode-name">한글 조합 놀이</div>
                <div class="game-mode-desc">자음 + 모음 = 글자!</div>
              </div>
            </button>
          ` : ''}
          <button class="game-mode-card" onclick="Game.startCounting()">
            <div class="game-mode-icon">🔢</div>
            <div>
              <div class="game-mode-name">숫자 세기</div>
              <div class="game-mode-desc">이모지를 세어봐요</div>
            </div>
          </button>
        </div>
      </div>
    `;
    this.showScreen('game-select');
  },
  tabReward() { this.navigate('reward'); },
};

document.addEventListener('DOMContentLoaded', () => App.init());
