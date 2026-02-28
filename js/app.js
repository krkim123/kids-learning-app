// SPA Router and initialization

const App = {
  currentProfile: null,
  currentScreen: 'splash',

  screens: ['splash', 'profile', 'home', 'learn', 'game-select', 'game', 'reward'],

  init() {
    // Initialize audio context on first user interaction
    document.addEventListener('click', () => {
      if (!SFX.ctx) SFX.init();
      if (SFX.ctx && SFX.ctx.state === 'suspended') SFX.ctx.resume();
    }, { once: true });

    document.addEventListener('touchstart', () => {
      if (!SFX.ctx) SFX.init();
      if (SFX.ctx && SFX.ctx.state === 'suspended') SFX.ctx.resume();
    }, { once: true });

    Speech.init();

    // Check for last profile
    const lastProfile = Storage.getGlobal('lastProfile');

    // Show splash then navigate
    this.showSplash(() => {
      if (lastProfile) {
        this.currentProfile = lastProfile;
        document.body.classList.add(`theme-${PROFILES[lastProfile].theme}`);
        this.navigate('home');
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
    // Hide all screens
    this.screens.forEach(s => {
      const el = document.getElementById(`screen-${s}`);
      if (el) el.classList.remove('active');
    });

    // Show target screen
    const target = document.getElementById(`screen-${screenId}`);
    if (target) {
      target.classList.add('active');
      this.currentScreen = screenId;
    }

    // Screen-specific initialization
    switch (screenId) {
      case 'profile':
        Profile.showSelection();
        break;
      case 'home':
        this.showHome();
        break;
      case 'reward':
        Reward.showRewardScreen();
        break;
    }
  },

  showScreen(screenId) {
    this.screens.forEach(s => {
      const el = document.getElementById(`screen-${s}`);
      if (el) el.classList.remove('active');
    });
    const target = document.getElementById(`screen-${screenId}`);
    if (target) target.classList.add('active');
    this.currentScreen = screenId;
  },

  showHome() {
    const profile = Profile.getCurrent();
    const progress = Storage.getProgress(this.currentProfile);
    const screen = document.getElementById('screen-home');

    // Calculate progress for each category
    const catProgress = {};
    Object.keys(CATEGORIES).forEach(catId => {
      const items = getDataForProfile(catId, this.currentProfile);
      const learned = (progress.learned[catId] || []).length;
      catProgress[catId] = { learned, total: items.length };
    });

    screen.innerHTML = `
      <div class="home-container">
        <div class="home-header">
          <button class="home-profile-btn" onclick="App.switchProfile()">
            ${profile.icon} ${profile.name}
          </button>
          <h1 class="home-title">요정 교실</h1>
          <button class="home-reward-btn" onclick="App.navigate('reward')" id="home-stars">
            ⭐ ${progress.stars}
          </button>
        </div>
        <div class="home-greeting">
          안녕, ${profile.name} ${profile.title}! 오늘도 열심히 배워볼까? 🌟
        </div>
        <div class="category-grid">
          ${Object.entries(CATEGORIES).map(([catId, cat]) => {
            const p = catProgress[catId];
            const pct = p.total > 0 ? Math.round(p.learned / p.total * 100) : 0;
            return `
              <div class="category-card" style="--cat-color: ${cat.color}">
                <div class="category-icon">${cat.icon}</div>
                <div class="category-name">${cat.name}</div>
                <div class="category-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: ${pct}%"></div>
                  </div>
                  <span class="progress-text">${p.learned}/${p.total}</span>
                </div>
                <div class="category-actions">
                  <button class="btn-learn" onclick="Learn.show('${catId}'); App.navigate('learn')">
                    📖 배우기
                  </button>
                  <button class="btn-game" onclick="Game.showSelection('${catId}')">
                    🎮 게임
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
        <div class="home-footer">
          <button class="btn-reward-box" onclick="App.navigate('reward')">
            🎁 보상함
          </button>
        </div>
      </div>
    `;
  },

  switchProfile() {
    // Clear theme
    document.body.classList.remove('theme-pink', 'theme-purple');
    this.currentProfile = null;
    this.navigate('profile');
  },
};

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
