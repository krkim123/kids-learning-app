// SPA Router - 12 screens, tab bar, header

const App = {
  currentProfile: null,
  currentScreen: 'splash',
  currentTab: 'home',
  recommendationCards: [],
  recommendationLoopLength: 0,
  routineCards: [],
  routineState: {
    active: false,
    index: 0,
    completed: 0,
    total: 0,
    startedAt: 0,
  },
  deferredInstallPrompt: null,
  timers: new Set(),
  activeRecommendation: null,
  homeBrainMaterials: [],
  homeIqPlaylist: [],
  homeIqResearchSources: [],
  kidGuard: {
    timerId: null,
    lastTickAt: 0,
    sessionStartedAt: 0,
    breakPromptAt: 0,
    sessionExtraMinutes: 0,
    dailyExtraMinutes: 0,
    bedtimeUnlockUntil: 0,
    overlayReason: '',
  },

  screens: ['splash','profile','home','category','learn','game-select','game',
            'combine','coloring','reward','attendance','parent','benchmark','reference'],

  schedule(fn, ms) {
    const id = setTimeout(() => {
      this.timers.delete(id);
      fn();
    }, ms);
    this.timers.add(id);
    return id;
  },

  clearTimers() {
    this.timers.forEach((id) => clearTimeout(id));
    this.timers.clear();
  },

  init() {
    // Audio context init
    const initAudio = () => {
      if (!SFX.ctx) SFX.init();
      if (SFX.ctx && SFX.ctx.state === 'suspended') SFX.ctx.resume();
    };
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('touchstart', initAudio, { once: true });

    Speech.init();
    if (window.Ads) Ads.init();
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
      if (this.currentScreen === 'home') this.showHome();
    });
    window.addEventListener('appinstalled', () => {
      this.deferredInstallPrompt = null;
      if (this.currentScreen === 'home') this.showHome();
    });

    const lastProfile = Storage.getGlobal('lastProfile');
    this.showSplash(() => {
      if (lastProfile) {
        const last = Profile.getById(lastProfile);
        if (last) {
          this.currentProfile = lastProfile;
          document.body.classList.add(`theme-${last.theme || 'pink'}`);
          this.navigate('home');
          Daily.checkAttendance();
          this.startKidGuard();
        } else {
          this.navigate('profile');
        }
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
        <div class="splash-fairy">🧚</div>
        <h1 class="splash-title">요정 교실</h1>
        <div class="splash-sparkles">
          <span class="sparkle s1">✨</span>
          <span class="sparkle s2">⭐</span>
          <span class="sparkle s3">🌟</span>
          <span class="sparkle s4">💫</span>
        </div>
      </div>
    `;
    this.schedule(callback, 1500);
  },

  navigate(screenId) {
    this.clearTimers();
    if (window.Game && typeof Game.clearTimers === 'function') {
      Game.clearTimers();
    }
    if (screenId !== 'game' && this.activeRecommendation && this.currentScreen === 'game') {
      this.activeRecommendation = null;
    }

    // Map tab
    const tabMap = { home:'home', category:'home', learn:'home',
                     'game-select':'play', game:'play', combine:'play',
                     coloring:'play', benchmark:'play', reward:'reward', attendance:'home',
                     reference:'play' };
    this.currentTab = tabMap[screenId] || 'home';

    switch (screenId) {
      case 'profile': Profile.showSelection(); break;
      case 'home': this.showHome(); break;
      case 'reward': Reward.showRewardScreen(); break;
      case 'attendance': Daily.showAttendancePage(); break;
      case 'benchmark': if (window.BenchmarkCatalog) BenchmarkCatalog.showHub(); break;
      case 'reference': if (window.DumpMigration) DumpMigration.showHub(); break;
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
    const noTabScreens = ['splash', 'profile', 'benchmark'];
    const noHeaderScreens = ['splash', 'profile', 'benchmark'];
    if (tabBar) tabBar.style.display = noTabScreens.includes(screenId) ? 'none' : 'flex';
    if (header) header.style.display = noHeaderScreens.includes(screenId) ? 'none' : 'flex';

    // Update header
    if (!noHeaderScreens.includes(screenId)) this.updateHeader();
    // Update tab bar active
    this.updateTabBar();

    // Ads policy: banner only on non-learning screens.
    if (window.Ads) {
      if (screenId === 'home') Ads.showBanner('home');
      else if (screenId === 'reward') Ads.showBanner('reward');
      else if (screenId === 'parent') Ads.showBanner('parent');
      else Ads.hideBanner();

      // Interstitial only at safe transition points.
      if (screenId === 'reward') Ads.maybeShowInterstitial('reward-screen');
      else if (screenId === 'parent') Ads.maybeShowInterstitial('parent-screen');
    }

    this.tickKidGuard();
  },

  showHome() {
    const profile = Profile.getCurrent();
    const progress = Storage.getProgress(this.currentProfile);
    const att = Storage.getAttendance(this.currentProfile);
    const missions = Storage.getMissions(this.currentProfile);
    const usage = this.getTodayUsage();
    const settings = this.getParentSettings();
    const lvl = getLevelInfo(progress.xp || 0);
    const screen = document.getElementById('screen-home');
    const usedMin = Math.floor((usage.secondsToday || 0) / 60);
    const dailyLimit = settings.dailyLimitMin > 0
      ? settings.dailyLimitMin + (this.kidGuard.dailyExtraMinutes || 0)
      : 0;
    const remainMin = dailyLimit > 0 ? Math.max(0, dailyLimit - usedMin) : null;
    const sessionMin = this.getSessionElapsedMinutes();

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

    const recommendation = this.getRecommendationCards(profile, progress);
    const todayCards = recommendation.cards;
    this.recommendationCards = todayCards;
    this.recommendationLoopLength = recommendation.loopLength;
    const brainMaterials = this.getBrainMaterials(profile?.ageGroup || 'child');
    const iqPlaylist = this.getIqPlaylist();
    const iqResearchSources = this.getIqResearchSources();
    this.homeBrainMaterials = brainMaterials;
    this.homeIqPlaylist = iqPlaylist;
    this.homeIqResearchSources = iqResearchSources;

    const missionCount = missions?.missions ? missions.missions.filter(m => m.done).length : 0;
    const missionTotal = missions?.missions ? missions.missions.length : 3;
    const wrongReview = this.getWrongReviewSummary(progress, profile?.ageGroup || 'child');
    const commercial = this.getCommercialValidationSnapshot({
      profileId: this.currentProfile,
      missionCount,
      missionTotal,
      todayCards,
    });
    const wrongReviewCard = wrongReview.total > 0 ? `
      <div class="home-section">
        <button class="mission-summary-card" onclick="App.startWrongReview()">
          <span class="mission-summary-icon">🧩</span>
          <span class="mission-summary-text">오답 복습 ${wrongReview.total}회</span>
          <span class="mission-summary-streak">${wrongReview.label}</span>
        </button>
      </div>
    ` : '';
    const installCard = this.deferredInstallPrompt ? `
      <div class="home-section">
        <button class="install-app-card" onclick="App.promptInstall()">
          <span class="install-app-icon">📲</span>
          <span class="install-app-text">
            <strong>앱 설치하기</strong>
            <small>홈 화면에 설치하면 더 빠르고 안정적으로 실행돼요</small>
          </span>
          <span class="install-app-cta">설치</span>
        </button>
      </div>
    ` : '';
    const commercialCard = `
      <div class="home-section">
        <button class="market-proof-card" onclick="App.showCommercialValidationGuide()">
          <div class="market-proof-header">
            <span class="market-proof-title">📊 광고 수익화 검증</span>
            <span class="market-proof-badge ${commercial.gradeClass}">${commercial.gradeLabel}</span>
          </div>
          <div class="market-proof-grid">
            <div class="market-proof-item">
              <strong>${commercial.activeDays7}/7일</strong>
              <span>7일 활성 (목표 4+)</span>
            </div>
            <div class="market-proof-item">
              <strong>${commercial.avgMinutes7}분</strong>
              <span>일평균 학습 (목표 15+)</span>
            </div>
            <div class="market-proof-item">
              <strong>${commercial.routineDone}/${commercial.routineTotal}</strong>
              <span>오늘 루틴 완료 (목표 2+)</span>
            </div>
            <div class="market-proof-item">
              <strong>${commercial.retentionProxy}%</strong>
              <span>2주 유지율 프록시 (목표 70%+)</span>
            </div>
          </div>
          <div class="market-proof-tip">${commercial.nextAction}</div>
        </button>
      </div>
    `;

    screen.innerHTML = `
      <div class="home-container">
        <div class="home-section">
          <h2 class="home-section-title">🌟 오늘 학습 추천</h2>
          <p class="today-loop-meta">추천 루틴 ${recommendation.pointer + 1}/${recommendation.loopLength}회차 · ${recommendation.loopLabel}</p>
          <div class="today-cards">
            ${todayCards.map((c, idx) => `
              <button class="today-card" onclick="App.runRecommendation(${idx})"
                      style="--card-accent: ${c.color || 'var(--primary)'}">
                <div class="today-card-icon">${c.icon || '🎯'}</div>
                <div class="today-card-info">
                  <div class="today-card-name">${c.title}</div>
                  <div class="today-card-sub">${c.subtitle || ''}</div>
                </div>
                <div class="today-card-badge ${c.complete ? 'complete' : ''}">
                  ${c.badge || ''}
                </div>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="home-section">
          <button class="mission-summary-card" onclick="App.navigate('attendance')">
            <span class="mission-summary-icon">🎯</span>
            <span class="mission-summary-text">오늘 미션 ${missionCount}/${missionTotal}</span>
            <span class="mission-summary-streak">🔥${att.streak || 0}일</span>
          </button>
        </div>
        ${wrongReviewCard}
        ${installCard}
        ${commercialCard}

        <div class="home-section">
          <h2 class="home-section-title">🧠 지능 발달 추천 코스</h2>
          <div class="today-cards">
            ${brainMaterials.map((item, idx) => `
              <button class="today-card" onclick="App.runBrainMaterial(${idx})">
                <div class="today-card-icon">${item.icon}</div>
                <div class="today-card-info">
                  <div class="today-card-name">${item.title}</div>
                  <div class="today-card-sub">${item.description}</div>
                </div>
                <div class="today-card-badge">${item.focus}</div>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="home-section">
          <h2 class="home-section-title">⚡ IQ 향상 게임 루틴</h2>
          <div class="quick-play-grid">
            ${iqPlaylist.map((item, idx) => `
              <button class="quick-play-card" onclick="App.runIqPlaylist(${idx})" style="--qp-color:#5C6BC0">
                <span class="qp-icon" style="position:relative;z-index:2;color:#4f3b72;">${item.icon || '🎮'}</span>
                <span class="qp-name" style="position:relative;z-index:2;color:#4f3b72;display:block;font-size:0.82rem;font-weight:800;line-height:1.28;">${item.title || 'IQ 게임'}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="home-section">
          <h2 class="home-section-title">🔬 IQ 검증 근거</h2>
          <div class="iq-research-list">
            ${iqResearchSources.map((item, idx) => `
              <button class="iq-research-card" onclick="App.openIqResearch(${idx})">
                <div class="iq-research-title">${item.title}</div>
                <div class="iq-research-sub">${(item.domains || []).join(' · ')}</div>
                <div class="iq-research-url">${item.url}</div>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="home-section">
          <div class="kidtime-card">
            <div class="kidtime-title">오늘 학습 시간 관리</div>
            <div class="kidtime-grid">
              <div class="kidtime-item">
                <span class="kidtime-label">사용 시간</span>
                <strong id="home-kidtime-used">${usedMin}분</strong>
              </div>
              <div class="kidtime-item">
                <span class="kidtime-label">남은 시간</span>
                <strong id="home-kidtime-remaining">${remainMin === null ? '무제한' : `${remainMin}분`}</strong>
              </div>
              <div class="kidtime-item">
                <span class="kidtime-label">현재 세션</span>
                <strong id="home-kidtime-session">${sessionMin}분</strong>
              </div>
            </div>
            <div class="kidtime-sub">권장: 30분 학습 후 3~5분 쉬면 집중력이 더 좋아져요.</div>
          </div>
        </div>

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
                    ${c.sp.complete ? '<div class="train-badge">✅</div>' : ''}
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

        <div class="home-section">
          <h2 class="home-section-title">🚀 빠른 실행</h2>
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
            <button class="quick-play-card" onclick="Game.startSkyTower('hangul')" style="--qp-color:#8E67D8">
              <span class="qp-icon">🏗️</span><span class="qp-name">한글 타워</span>
            </button>
            <button class="quick-play-card" onclick="Game.startSkyTower('english')" style="--qp-color:#4E8DF0">
              <span class="qp-icon">🧱</span><span class="qp-name">영어 타워</span>
            </button>
            <button class="quick-play-card" onclick="Game.startSkyTower()" style="--qp-color:#5A67D8">
              <span class="qp-icon">🏙️</span><span class="qp-name">2.5D 숫자 타워</span>
            </button>
            <button class="quick-play-card" onclick="Game.startQuiz('math')" style="--qp-color:#FFA726">
              <span class="qp-icon">❓</span><span class="qp-name">수학 퀴즈</span>
            </button>
            <button class="quick-play-card" onclick="Game.startShape3DMatch()" style="--qp-color:#26A69A">
              <span class="qp-icon">🧊</span><span class="qp-name">3D 도형 맞추기</span>
            </button>
            <button class="quick-play-card" onclick="Game.startShapeNetLab()" style="--qp-color:#7E57C2">
              <span class="qp-icon">🧩</span><span class="qp-name">3D 모형 해석</span>
            </button>
            <button class="quick-play-card" onclick="Game.startShapeBuilderLab()" style="--qp-color:#4DB6AC">
              <span class="qp-icon">🧱</span><span class="qp-name">도형 만들기 랩</span>
            </button>
            <button class="quick-play-card" onclick="Game.startIQCamp25D()" style="--qp-color:#3F88C5">
              <span class="qp-icon">🧠</span><span class="qp-name">IQ 부트캠프</span>
            </button>
            <button class="quick-play-card" onclick="Game.startSpatialMatrix25D()" style="--qp-color:#5D8ACF">
              <span class="qp-icon">🧠</span><span class="qp-name">2.5D 매트릭스 IQ</span>
            </button>
            <button class="quick-play-card" onclick="Game.showGithubPack()" style="--qp-color:#5C6BC0">
              <span class="qp-icon">🕹️</span><span class="qp-name">IQ 게임 118+</span>
            </button>
            <button class="quick-play-card" onclick="App.navigate('benchmark')" style="--qp-color:#7E57C2">
              <span class="qp-icon">LAB</span><span class="qp-name">AI 벤치마크</span>
            </button>
            <button class="quick-play-card" onclick="App.navigate('reference')" style="--qp-color:#4DB6AC">
              <span class="qp-icon">📚</span><span class="qp-name">학습 콘텐츠</span>
            </button>
          </div>
        </div>

        <div class="home-bottom-spacer"></div>
      </div>
    `;

    const avatarBtn = document.getElementById('header-avatar');
    if (avatarBtn) Profile.setupLongPress(avatarBtn);
  },

  ensureHeaderShell() {
    const header = document.getElementById('app-header');
    if (!header) return null;
    if (!header.querySelector('#header-avatar')) {
      header.innerHTML = `
        <button class="header-left" id="header-avatar" onclick="App.switchProfile()">
          <span class="header-avatar-icon" id="header-avatar-icon"></span>
          <span class="header-name" id="header-name"></span>
        </button>
        <div class="header-center">
          <span class="header-date" id="header-date"></span>
          <span class="header-level" id="header-level"></span>
        </div>
        <div class="header-right">
          <span class="header-time" id="header-time"></span>
          <span class="header-stars">⭐ <span id="header-stars">0</span></span>
          <span class="header-streak" id="header-streak"></span>
        </div>
      `;
    }
    return header;
  },

  patchHeaderFields(profile, progress, att, timeText, lvl, dateStr) {
    const avatarIcon = document.getElementById('header-avatar-icon');
    if (avatarIcon) avatarIcon.textContent = profile?.icon || '🧒';
    const nameEl = document.getElementById('header-name');
    if (nameEl) nameEl.textContent = profile?.name || '친구';
    const dateEl = document.getElementById('header-date');
    if (dateEl) dateEl.textContent = dateStr;
    const levelEl = document.getElementById('header-level');
    if (levelEl) levelEl.textContent = `${lvl.icon} Lv.${lvl.level}`;
    const timeEl = document.getElementById('header-time');
    if (timeEl) timeEl.textContent = `⏰ ${timeText}`;
    const starEl = document.getElementById('header-stars');
    if (starEl) starEl.textContent = progress.stars;
    const streakEl = document.getElementById('header-streak');
    if (streakEl) streakEl.textContent = `🔥${att.streak || 0}일`;

    const avatarBtn = document.getElementById('header-avatar');
    if (avatarBtn) Profile.setupLongPress(avatarBtn);
  },

  updateHeader() {
    if (!this.currentProfile) return;
    const header = this.ensureHeaderShell();
    if (!header) return;
    const profile = Profile.getCurrent();
    const progress = Storage.getProgress(this.currentProfile);
    const att = Storage.getAttendance(this.currentProfile);
    const usage = this.getTodayUsage();
    const settings = this.getParentSettings();
    const usedMin = Math.floor((usage.secondsToday || 0) / 60);
    const dailyLimit = settings.dailyLimitMin > 0
      ? settings.dailyLimitMin + (this.kidGuard.dailyExtraMinutes || 0)
      : 0;
    const remaining = dailyLimit > 0 ? Math.max(0, dailyLimit - usedMin) : null;
    const timeText = remaining === null ? `${usedMin}분 사용` : `${remaining}분 남음`;
    const lvl = getLevelInfo(progress.xp || 0);
    const now = new Date();
    const dateStr = `${now.getMonth() + 1}월 ${now.getDate()}일`;
    this.patchHeaderFields(profile, progress, att, timeText, lvl, dateStr);
  },
  updateTabBar() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === this.currentTab);
    });
  },

  switchProfile() {
    this.activeRecommendation = null;
    this.stopKidGuard();
    document.body.classList.remove('theme-pink', 'theme-purple', 'theme-blue', 'theme-green');
    this.currentProfile = null;
    this.navigate('profile');
  },

  getParentSettings(profileId = this.currentProfile) {
    if (!profileId || !window.Storage) {
      return {
        dailyLimitMin: 0,
        sessionLimitMin: 0,
        breakEveryMin: 0,
        adaptiveWeights: {
          language: 100,
          memory: 100,
          logic: 100,
          focus: 100,
        },
        speechVolume: 100,
        sfxVolume: 80,
        muteAll: false,
        bedtimeEnabled: false,
        bedtimeStart: '21:00',
        bedtimeEnd: '07:00',
      };
    }
    const profile = window.Profile && typeof Profile.getById === 'function'
      ? Profile.getById(profileId)
      : null;
    const ageGroup = profile?.ageGroup || 'child';
    return Storage.getParentSettings(profileId, ageGroup);
  },

  getSoundOptions(profileId = this.currentProfile) {
    const settings = this.getParentSettings(profileId);
    return {
      muteAll: !!settings.muteAll,
      speechVolume: Math.max(0, Math.min(100, Number(settings.speechVolume) || 0)),
      sfxVolume: Math.max(0, Math.min(100, Number(settings.sfxVolume) || 0)),
    };
  },

  getBrainMaterials(ageGroup = 'child') {
    const all = (typeof BRAIN_DEVELOPMENT_LIBRARY !== 'undefined' && Array.isArray(BRAIN_DEVELOPMENT_LIBRARY))
      ? BRAIN_DEVELOPMENT_LIBRARY
      : [];
    return all
      .filter((row) => Array.isArray(row.ageGroups) && row.ageGroups.includes(ageGroup))
      .slice(0, 10);
  },

  getIqPlaylist() {
    const rows = (typeof IQ_GAME_PLAYLIST !== 'undefined' && Array.isArray(IQ_GAME_PLAYLIST))
      ? IQ_GAME_PLAYLIST
      : [];
    return rows.slice(0, 12);
  },

  getIqResearchSources() {
    const rows = (typeof IQ_RESEARCH_SOURCES !== 'undefined' && Array.isArray(IQ_RESEARCH_SOURCES))
      ? IQ_RESEARCH_SOURCES
      : [];
    return rows.slice(0, 8);
  },

  runRouteAction(route) {
    if (!route || !route.type) return;
    if (route.type === 'coloring') {
      Coloring.showDesigns();
      return;
    }
    if (route.type === 'github-pack') {
      Game.showGithubPack();
      return;
    }
    if (route.type === 'benchmark') {
      this.navigate('benchmark');
      return;
    }
    if (route.type === 'reference') {
      this.navigate('reference');
      return;
    }
    if (route.type === 'wrong-review') {
      this.startWrongReview();
      return;
    }
    if (route.type === 'learn') {
      Learn.show(route.categoryId, route.stageId || 1);
      return;
    }
    if (route.type === 'game') {
      if (route.gameId === 'quiz') return Game.startQuiz(route.categoryId || 'hangul');
      if (route.gameId === 'quiz-marathon') return Game.startQuizMarathon(route.categoryId || 'hangul');
      if (route.gameId === 'quiz-infinite') return Game.startQuizInfinite(route.categoryId || 'hangul');
      if (route.gameId === 'iq-camp-25d') return Game.startIQCamp25D();
      if (route.gameId === 'matching') return Game.startMatching(route.categoryId || 'hangul');
      if (route.gameId === 'sound') return Game.startSound(route.categoryId || 'hangul');
      if (route.gameId === 'tracing') return Game.startTracing(route.categoryId || 'hangul');
      if (route.gameId === 'counting') return Game.startCounting();
      if (route.gameId === 'block-count-25d') return Game.startBlockCount25D();
      if (route.gameId === 'block-count-25d-infinite') return Game.startBlockCount25D('infinite');
      if (route.gameId === 'spatial-matrix-25d') return Game.startSpatialMatrix25D();
      if (route.gameId === 'tower') return Game.startSkyTower(route.categoryId || 'number');
      if (route.gameId === 'times') return Game.startTimesTableQuiz();
      if (route.gameId === 'shape3d') return Game.startShape3DMatch();
      if (route.gameId === 'net3d') return Game.startShapeNetLab();
      if (route.gameId === 'shape-lab') return Game.startShapeBuilderLab();
    }
  },

  runBrainMaterial(index) {
    const row = this.homeBrainMaterials[index];
    if (!row) return;
    this.runRouteAction(row.action);
  },

  runIqPlaylist(index) {
    const row = this.homeIqPlaylist[index];
    if (!row) return;
    this.runRouteAction(row.route);
  },

  openIqResearch(index) {
    const row = this.homeIqResearchSources?.[index];
    if (!row?.url) return;
    window.open(row.url, '_blank', 'noopener,noreferrer');
  },

  getTodayUsage(profileId = this.currentProfile) {
    if (!profileId || !window.Storage) {
      return { date: '', secondsToday: 0, totalSeconds: 0, breakCountToday: 0 };
    }
    return Storage.getUsage(profileId);
  },

  getCommercialValidationSnapshot({ profileId, missionCount = 0, missionTotal = 0, todayCards = [] } = {}) {
    const cards = Array.isArray(todayCards) ? todayCards : [];
    const fallback = {
      activeDays7: 0,
      avgMinutes7: 0,
      routineDone: cards.filter((row) => row?.complete).length,
      routineTotal: cards.length,
      retentionProxy: 0,
      missionRate: missionTotal > 0 ? Math.round((missionCount / missionTotal) * 100) : 0,
      gradeLabel: '데이터 수집 중',
      gradeClass: 'is-low',
      nextAction: '최소 14일 사용 데이터를 쌓은 뒤 상용화 판단을 진행하세요.',
    };
    if (!profileId || !window.Storage) return fallback;

    const weeklyUsage = Storage.getWeeklyUsage(profileId);
    const activeDays7 = weeklyUsage.filter((row) => row.active).length;
    const totalMinutes7 = weeklyUsage.reduce((sum, row) => sum + Math.max(0, Number(row.minutes) || 0), 0);
    const avgMinutes7 = weeklyUsage.length > 0 ? Math.round(totalMinutes7 / weeklyUsage.length) : 0;
    const routineDone = cards.filter((row) => row?.complete).length;
    const routineTotal = cards.length;
    const missionRate = missionTotal > 0 ? Math.round((missionCount / missionTotal) * 100) : 0;
    const retentionProxy = this.getRetentionProxy(profileId);

    const score = [
      activeDays7 >= 4,
      avgMinutes7 >= 15,
      routineDone >= 2,
      retentionProxy >= 70,
      missionRate >= 70,
    ].filter(Boolean).length;

    let gradeLabel = '광고 수익화 준비 부족';
    let gradeClass = 'is-low';
    let nextAction = '재방문 빈도와 광고 노출 가능한 체류 시간을 먼저 올리세요.';

    if (score >= 4) {
      gradeLabel = '광고 수익화 가능 구간';
      gradeClass = 'is-high';
      nextAction = '무료 배포를 확장하고 DAU x 일노출 x eCPM을 주간 추적하세요.';
    } else if (score >= 2) {
      gradeLabel = '광고 실험 단계';
      gradeClass = 'is-mid';
      nextAction = '홈/리워드 체류를 늘리고 주당 활성일을 먼저 5일 이상으로 올리세요.';
    }

    return {
      activeDays7,
      avgMinutes7,
      routineDone,
      routineTotal,
      retentionProxy,
      missionRate,
      gradeLabel,
      gradeClass,
      nextAction,
    };
  },

  getRetentionProxy(profileId = this.currentProfile) {
    if (!profileId || !window.Storage) return 0;
    const history = Storage.getUsageHistory(profileId);
    const todayUsage = Storage.getUsage(profileId);
    const today = new Date();
    const readSeconds = (offsetDays) => {
      const d = new Date(today);
      d.setDate(d.getDate() - offsetDays);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (key === todayUsage.date) return Math.max(0, Number(todayUsage.secondsToday) || 0);
      return Math.max(0, Number(history[key]?.seconds) || 0);
    };
    let currentActive = 0;
    let prevActive = 0;
    for (let i = 0; i < 7; i++) {
      if (readSeconds(i) > 0) currentActive += 1;
    }
    for (let i = 7; i < 14; i++) {
      if (readSeconds(i) > 0) prevActive += 1;
    }
    if (prevActive === 0) return currentActive > 0 ? 100 : 0;
    return Math.max(0, Math.min(200, Math.round((currentActive / prevActive) * 100)));
  },

  showCommercialValidationGuide() {
    alert([
      '무료+광고 검증 체크 (30일)',
      '1) 7일 활성 4일+',
      '2) 일평균 학습 15분+',
      '3) 2주 유지율 프록시 70%+',
      '4) 오늘 루틴 완료 2개+',
      '5) 미션 달성률 70%+',
      '',
      '위 5개 중 4개 이상이면 광고 트래픽 확장 실험 진행',
      '수익 공식: DAU x (유저당 일노출) x eCPM / 1000',
    ].join('\n'));
  },

  getRecommendationTemplates(ageGroup = 'child') {
    const templates = {
      toddler: [
        { type: 'learn', categoryId: 'hangul' },
        { type: 'game', gameId: 'counting' },
        { type: 'game', categoryId: 'hangul', gameId: 'tower' },
        { type: 'movement' },
        { type: 'learn', categoryId: 'number' },
        { type: 'game', categoryId: 'hangul', gameId: 'tracing' },
        { type: 'coloring' },
        { type: 'review' },
        { type: 'game', categoryId: 'hangul', gameId: 'quiz' },
      ],
      child: [
        { type: 'learn', categoryId: 'hangul' },
        { type: 'learn', categoryId: 'english' },
        { type: 'game', categoryId: 'english', gameId: 'quiz' },
        { type: 'review' },
        { type: 'game', categoryId: 'math', gameId: 'iq-camp-25d' },
        { type: 'game', categoryId: 'math', gameId: 'shape3d' },
        { type: 'game', categoryId: 'math', gameId: 'spatial-matrix-25d' },
        { type: 'game', categoryId: 'hangul', gameId: 'tower' },
        { type: 'game', categoryId: 'number', gameId: 'counting' },
        { type: 'game', categoryId: 'number', gameId: 'tower' },
        { type: 'movement' },
        { type: 'learn', categoryId: 'math' },
        { type: 'game', categoryId: 'math', gameId: 'net3d' },
        { type: 'game', categoryId: 'math', gameId: 'quiz' },
        { type: 'coloring' },
      ],
      older: [
        { type: 'game', categoryId: 'math', gameId: 'times' },
        { type: 'learn', categoryId: 'math' },
        { type: 'review' },
        { type: 'game', categoryId: 'math', gameId: 'iq-camp-25d' },
        { type: 'game', categoryId: 'math', gameId: 'shape3d' },
        { type: 'game', categoryId: 'math', gameId: 'spatial-matrix-25d' },
        { type: 'learn', categoryId: 'english' },
        { type: 'game', categoryId: 'english', gameId: 'tower' },
        { type: 'game', categoryId: 'english', gameId: 'matching' },
        { type: 'game', categoryId: 'math', gameId: 'net3d' },
        { type: 'game', categoryId: 'math', gameId: 'quiz' },
        { type: 'game', categoryId: 'number', gameId: 'tower' },
        { type: 'movement' },
        { type: 'game', categoryId: 'number', gameId: 'counting' },
        { type: 'coloring' },
      ],
    };
    return templates[ageGroup] || templates.child;
  },

  getRecommendationLoopLabel(ageGroup = 'child') {
    if (ageGroup === 'toddler') return '3~4세 맞춤 루틴';
    if (ageGroup === 'older') return '7~8세 맞춤 루틴';
    return '5~6세 맞춤 루틴';
  },

  getRecommendationState(profileId, ageGroup, loopLength) {
    const today = Storage.today();
    const base = {
      date: today,
      pointer: 0,
      completed: [],
    };
    if (!profileId) return base;
    const saved = Storage.get(profileId, 'recommendationLoop', base);
    const state = saved && typeof saved === 'object' ? saved : base;
    const length = Math.max(1, Number(loopLength) || 1);

    if (state.date !== today) {
      const seed = (new Date().getDay() + ageGroup.length) % length;
      const rolled = {
        date: today,
        pointer: (Number(state.pointer) + seed + 1) % length,
        completed: [],
      };
      Storage.set(profileId, 'recommendationLoop', rolled);
      return rolled;
    }

    const normalized = {
      date: today,
      pointer: Math.max(0, Number(state.pointer) || 0) % length,
      completed: Array.isArray(state.completed) ? state.completed.slice(0, length * 3) : [],
    };
    Storage.set(profileId, 'recommendationLoop', normalized);
    return normalized;
  },

  saveRecommendationState(profileId, nextState) {
    if (!profileId) return;
    Storage.set(profileId, 'recommendationLoop', nextState);
  },

  findRecommendedStage(categoryId, progress) {
    const cat = CATEGORIES[categoryId];
    if (!cat) return null;
    const unlocked = cat.stages.find((stage) => {
      if (!isStageUnlocked(categoryId, stage.id, progress)) return false;
      const stageProgress = getStageProgress(categoryId, stage.id, progress);
      return !stageProgress.complete;
    });
    if (unlocked) {
      return {
        stage: unlocked,
        progress: getStageProgress(categoryId, unlocked.id, progress),
      };
    }
    const fallback = cat.stages.find((stage) => isStageUnlocked(categoryId, stage.id, progress)) || cat.stages[0];
    if (!fallback) return null;
    return {
      stage: fallback,
      progress: getStageProgress(categoryId, fallback.id, progress),
    };
  },

  getWrongReviewSummary(progress, ageGroup = 'child') {
    const stats = progress?.wrongStats && typeof progress.wrongStats === 'object' ? progress.wrongStats : {};
    const candidates = this.getRecommendationCategoryPool(ageGroup);
    let pickedId = null;
    let pickedCount = 0;
    candidates.forEach((categoryId) => {
      const bucket = stats[categoryId];
      const total = Math.max(0, Number(bucket?.total) || 0);
      if (total > pickedCount) {
        pickedId = categoryId;
        pickedCount = total;
      }
    });
    return {
      id: pickedId,
      total: pickedCount,
      label: pickedId && CATEGORIES[pickedId] ? CATEGORIES[pickedId].name : '약점 훈련',
    };
  },

  findWeakCategory(progress, ageGroup = 'child') {
    const wrongSummary = this.getWrongReviewSummary(progress, ageGroup);
    if (wrongSummary.id) return wrongSummary.id;
    const pools = {
      toddler: ['hangul', 'number'],
      child: ['hangul', 'english', 'number', 'math'],
      older: ['math', 'english', 'number', 'hangul'],
    };
    const candidates = pools[ageGroup] || pools.child;
    let picked = null;
    let pickedPercent = Infinity;
    candidates.forEach((categoryId) => {
      if (!CATEGORIES[categoryId]) return;
      const cp = getCategoryProgress(categoryId, progress);
      const percent = Math.max(0, Number(cp?.percent) || 0);
      if (percent < pickedPercent) {
        picked = categoryId;
        pickedPercent = percent;
      }
    });
    return picked || candidates[0] || 'hangul';
  },

  startWrongReview() {
    const profile = Profile.getCurrent();
    const progress = Storage.getProgress(this.currentProfile);
    const summary = this.getWrongReviewSummary(progress, profile?.ageGroup || 'child');
    const categoryId = summary.id || this.findWeakCategory(progress, profile?.ageGroup || 'child');
    if (!categoryId) return;
    if (window.Game && typeof Game.startQuiz === 'function') {
      Game.startQuiz(categoryId);
    }
  },

  getRecommendationCategoryPool(ageGroup = 'child') {
    const pools = {
      toddler: ['hangul', 'number'],
      child: ['hangul', 'english', 'number', 'math'],
      older: ['math', 'english', 'number', 'hangul'],
    };
    return pools[ageGroup] || pools.child;
  },

  getRecommendationCategoryScores(progress, ageGroup = 'child') {
    const candidates = this.getRecommendationCategoryPool(ageGroup);
    return candidates
      .filter((categoryId) => !!CATEGORIES[categoryId])
      .map((categoryId) => {
        const cp = getCategoryProgress(categoryId, progress);
        return {
          id: categoryId,
          percent: Math.max(0, Number(cp?.percent) || 0),
        };
      })
      .sort((a, b) => a.percent - b.percent);
  },

  getRecommendationDomainWeights(settings) {
    const raw = settings?.adaptiveWeights && typeof settings.adaptiveWeights === 'object'
      ? settings.adaptiveWeights
      : {};
    const clamp = (value) => {
      const n = Number(value);
      if (!Number.isFinite(n)) return 100;
      return Math.max(50, Math.min(150, Math.round(n)));
    };
    return {
      language: clamp(raw.language),
      memory: clamp(raw.memory),
      logic: clamp(raw.logic),
      focus: clamp(raw.focus),
    };
  },

  selectWeightedWeakDomain(domainRows, weights) {
    if (!Array.isArray(domainRows) || domainRows.length === 0) return null;
    const safeWeights = weights || this.getRecommendationDomainWeights(null);
    const normalized = domainRows
      .filter((row) => row && typeof row.id === 'string')
      .map((row) => {
        const rawScore = Math.max(0, Number(row.score) || Number(row.value) || 0);
        const weight = safeWeights[row.id] || 100;
        const adjusted = rawScore * (100 / weight);
        return {
          id: row.id,
          score: rawScore,
          adjusted,
        };
      });
    if (normalized.length === 0) return null;
    return normalized.sort((a, b) => a.adjusted - b.adjusted)[0];
  },

  getWeakDomain(progress, usage, ageGroup = 'child', settings = null) {
    const categoryScores = this.getRecommendationCategoryScores(progress, ageGroup)
      .reduce((acc, row) => {
        acc[row.id] = row.percent;
        return acc;
      }, {});

    const hangul = categoryScores.hangul || 0;
    const english = categoryScores.english || 0;
    const number = categoryScores.number || 0;
    const math = categoryScores.math || 0;
    const quiz = Math.max(0, Number(progress?.quizCorrect) || 0);
    const matching = Math.max(0, Number(progress?.matchingComplete) || 0);
    const sound = Math.max(0, Number(progress?.soundCorrect) || 0);
    const tracing = Math.max(0, Number(progress?.tracingComplete) || 0);
    const towerCorrect = Math.max(0, Number(progress?.towerCorrect) || 0);
    const streak = Math.max(0, Number(Storage.getAttendance(this.currentProfile)?.streak) || 0);
    const breakCount = Math.max(0, Number(usage?.breakCountToday) || 0);

    const clamp = (value) => Math.max(0, Math.min(100, Math.round(value)));
    const language = clamp((hangul * 0.5) + (english * 0.4) + (Math.min(quiz, 150) / 150 * 10));
    const memory = clamp((Math.min(matching, 80) / 80 * 45) + (Math.min(sound, 80) / 80 * 35) + (Math.min(tracing, 60) / 60 * 20));
    const logic = clamp((number * 0.35) + (math * 0.45) + (Math.min(towerCorrect, 150) / 150 * 20));
    const focus = clamp((Math.min(streak, 21) / 21 * 70) + (Math.min(breakCount, 8) / 8 * 30));
    const domainWeights = this.getRecommendationDomainWeights(settings);
    return this.selectWeightedWeakDomain([
      { id: 'language', score: language },
      { id: 'memory', score: memory },
      { id: 'logic', score: logic },
      { id: 'focus', score: focus },
    ], domainWeights);
  },

  getAdaptiveReviewCopy(ageGroup = 'child', categoryName = '') {
    const presets = {
      toddler: {
        title: `${categoryName} 약점 보강`,
        subtitle: '짧고 반복적으로 익혀요',
        badge: '맞춤',
      },
      child: {
        title: `${categoryName} 약점 보강`,
        subtitle: '자주 틀린 부분부터 채워요',
        badge: '맞춤',
      },
      older: {
        title: `${categoryName} 집중 복습`,
        subtitle: '핵심 개념을 압축해서 복습해요',
        badge: '맞춤',
      },
    };
    return presets[ageGroup] || presets.child;
  },

  getAdaptiveDomainStep(ageGroup = 'child', weakDomainId = 'logic', weakCategory = 'hangul') {
    const byAge = {
      toddler: {
        language: { type: 'game', gameId: 'sound', categoryId: 'hangul', title: '언어 감각 루틴', subtitle: '소리와 글자 연결하기', badge: '맞춤' },
        memory: { type: 'game', gameId: 'matching', categoryId: 'number', title: '기억력 루틴', subtitle: '같은 카드 빠르게 찾기', badge: '맞춤' },
        logic: { type: 'game', gameId: 'counting', categoryId: 'number', title: '논리 기초 루틴', subtitle: '수량을 세며 사고력 키우기', badge: '맞춤' },
        focus: { type: 'movement', title: '집중 리셋 루틴', subtitle: '2분 몸풀기 후 다시 시작', badge: '휴식' },
      },
      child: {
        language: { type: 'game', gameId: 'sound', categoryId: weakCategory === 'english' ? 'english' : 'hangul', title: '언어 강화 루틴', subtitle: '소리-문자 매칭으로 언어 집중', badge: '맞춤' },
        memory: { type: 'game', gameId: 'matching', categoryId: weakCategory === 'number' ? 'number' : 'english', title: '기억력 강화 루틴', subtitle: '작업기억 트레이닝', badge: '맞춤' },
        logic: { type: 'game', gameId: weakCategory === 'math' ? 'net3d' : 'tower', categoryId: weakCategory === 'math' ? 'math' : 'number', title: '논리 강화 루틴', subtitle: '문제 해결 순서 훈련', badge: '맞춤' },
        focus: { type: 'movement', title: '집중 조절 루틴', subtitle: '짧은 휴식으로 다시 몰입', badge: '휴식' },
      },
      older: {
        language: { type: 'game', gameId: 'quiz', categoryId: weakCategory === 'hangul' ? 'hangul' : 'english', title: '언어 응용 루틴', subtitle: '빠른 문제풀이로 언어 추론', badge: '맞춤' },
        memory: { type: 'game', gameId: 'matching', categoryId: 'english', title: '기억력 응용 루틴', subtitle: '시각 기억 + 반응 속도', badge: '맞춤' },
        logic: { type: 'game', gameId: weakCategory === 'math' ? 'shape3d' : 'tower', categoryId: weakCategory === 'math' ? 'math' : 'number', title: '논리 응용 루틴', subtitle: '수리 추론 집중 훈련', badge: '맞춤' },
        focus: { type: 'movement', title: '집중 회복 루틴', subtitle: '짧은 리셋 후 고난도 학습', badge: '휴식' },
      },
    };

    const agePlan = byAge[ageGroup] || byAge.child;
    return agePlan[weakDomainId] || agePlan.logic;
  },

  getPriorityRecommendationSteps(profile, progress, usage) {
    const ageGroup = profile?.ageGroup || 'child';
    const rankedCategories = this.getRecommendationCategoryScores(progress, ageGroup);
    const weakCategory = rankedCategories[0]?.id || this.findWeakCategory(progress, ageGroup);
    const settings = this.getParentSettings(this.currentProfile);
    const domainWeights = this.getRecommendationDomainWeights(settings);
    const parentDomains = (window.Profile && typeof Profile.getCognitiveDomainsForProfile === 'function')
      ? Profile.getCognitiveDomainsForProfile(this.currentProfile)
      : [];
    const weakDomain = Array.isArray(parentDomains) && parentDomains.length > 0
      ? this.selectWeightedWeakDomain(parentDomains.map((row) => ({ id: row.id, score: row.value })), domainWeights)
      : this.getWeakDomain(progress, usage, ageGroup, settings);
    const steps = [];

    if (weakCategory && CATEGORIES[weakCategory]) {
      const cat = CATEGORIES[weakCategory];
      const reviewCopy = this.getAdaptiveReviewCopy(ageGroup, cat.name);
      steps.push({
        type: 'review',
        categoryId: weakCategory,
        title: reviewCopy.title,
        subtitle: reviewCopy.subtitle,
        badge: reviewCopy.badge,
        advancePointer: false,
      });
    }

    if (weakDomain?.id) {
      const domainStep = this.getAdaptiveDomainStep(ageGroup, weakDomain.id, weakCategory);
      steps.push({
        ...domainStep,
        advancePointer: false,
      });
    }

    return steps.slice(0, 2);
  },

  createRecommendationCard(step, progress) {
    if (!step || typeof step !== 'object') return null;
    const advancePointer = step.advancePointer !== false;
    if (step.type === 'review') {
      const profile = Profile.getCurrent();
      const categoryId = step.categoryId || this.findWeakCategory(progress, profile?.ageGroup || 'child');
      const cat = CATEGORIES[categoryId];
      const target = this.findRecommendedStage(categoryId, progress);
      if (!cat || !target?.stage) return null;
      return {
        key: `review:${categoryId}:${target.stage.id}`,
        kind: 'review',
        categoryId,
        stageId: target.stage.id,
        icon: cat.icon,
        color: cat.color,
        title: step.title || `${cat.name} 복습`,
        subtitle: step.subtitle || '반복해서 익혀요',
        badge: step.badge || `${target.progress.percent}%`,
        complete: target.progress.complete,
        advancePointer,
      };
    }

    if (step.type === 'learn') {
      const cat = CATEGORIES[step.categoryId];
      const target = this.findRecommendedStage(step.categoryId, progress);
      if (!cat || !target?.stage) return null;
      return {
        key: `learn:${step.categoryId}:${target.stage.id}`,
        kind: 'learn',
        categoryId: step.categoryId,
        stageId: target.stage.id,
        icon: cat.icon,
        color: cat.color,
        title: step.title || `${cat.name} ${target.stage.name}`,
        subtitle: step.subtitle || `${target.stage.subtitle}`,
        badge: step.badge || (target.progress.complete ? '완료' : `${target.progress.percent}%`),
        complete: target.progress.complete,
        advancePointer,
      };
    }

    if (step.type === 'coloring') {
      return {
        key: 'play:coloring',
        kind: 'coloring',
        icon: '🎨',
        color: '#FF69B4',
        title: step.title || '색칠하기',
        subtitle: step.subtitle || '색칠하며 집중해요',
        badge: step.badge || '놀이',
        complete: false,
        advancePointer,
      };
    }

    if (step.type === 'movement') {
      return {
        key: 'habit:movement-break',
        kind: 'movement',
        icon: '🤸',
        color: '#4DB6AC',
        title: step.title || '몸풀기 리셋',
        subtitle: step.subtitle || '2분 움직임 쉬기',
        badge: step.badge || '2m',
        complete: false,
        advancePointer,
      };
    }

    if (step.type === 'game') {
      const cat = step.categoryId ? CATEGORIES[step.categoryId] : null;
      const map = {
        quiz: { title: '퀴즈', subtitle: '문제를 빠르게 풀어요', badge: '게임' },
        'quiz-infinite': { title: '퀴즈 무한모드', subtitle: '목숨 3개로 끝없이 도전', badge: '∞' },
        'iq-camp-25d': { title: 'IQ 부트캠프', subtitle: '기억+패턴 적응형 훈련', badge: 'LAB' },
        matching: { title: '짝맞추기', subtitle: '같은 그림 찾기', badge: '게임' },
        sound: { title: '소리찾기', subtitle: '소리와 글자를 연결해요', badge: '게임' },
        tracing: { title: '따라쓰기', subtitle: '글자를 따라 그려요', badge: '연습' },
        counting: { title: '숫자세기', subtitle: '수량을 정확히 세요', badge: '연습' },
        'block-count-25d': { title: '2.5D 블록 세기', subtitle: '입체 블록 수량 추론', badge: '3D' },
        'block-count-25d-infinite': { title: '블록 무한모드', subtitle: '2.5D 블록을 끝없이 세요', badge: '∞' },
        'spatial-matrix-25d': { title: '2.5D 매트릭스 IQ', subtitle: '패턴 빈칸을 완성해요', badge: 'IQ' },
        tower: { title: '2.5D 타워', subtitle: '정답을 맞히고 타워를 쌓아요', badge: '신규' },
        times: { title: '구구단', subtitle: '곱셈 연습 모드', badge: '9x9' },
        shape3d: { title: '3D 도형 맞추기', subtitle: '입체도형 공간 추론', badge: '3D' },
        net3d: { title: '3D 모형 해석', subtitle: '전개도에서 입체 해석', badge: 'IQ' },
        'shape-lab': { title: '도형 만들기 랩', subtitle: '도형 조각 조합 훈련', badge: 'LAB' },
      };
      const info = map[step.gameId];
      if (!info) return null;
      return {
        key: `play:${step.gameId}:${step.categoryId || 'number'}`,
        kind: 'game',
        gameId: step.gameId,
        categoryId: step.categoryId || 'number',
        icon: cat?.icon || '🎮',
        color: cat?.color || '#7E57C2',
        title: step.title || `${cat?.name || '학습'} ${info.title}`,
        subtitle: step.subtitle || info.subtitle,
        badge: step.badge || info.badge,
        complete: false,
        advancePointer,
      };
    }

    return null;
  },

  getRecommendationCards(profile, progress) {
    const loop = this.getRecommendationTemplates(profile?.ageGroup || 'child');
    const loopLength = loop.length;
    const state = this.getRecommendationState(this.currentProfile, profile?.ageGroup || 'child', loopLength);
    const seen = new Set();
    const cards = [];
    const maxCards = 5;
    const usage = this.getTodayUsage(this.currentProfile);
    const prioritySteps = this.getPriorityRecommendationSteps(profile, progress, usage);

    for (let i = 0; i < prioritySteps.length && cards.length < maxCards; i++) {
      const card = this.createRecommendationCard(prioritySteps[i], progress);
      if (!card) continue;
      if (seen.has(card.key)) continue;
      if (state.completed.includes(card.key)) continue;
      seen.add(card.key);
      cards.push(card);
    }

    for (let i = 0; i < loopLength * 2 && cards.length < maxCards; i++) {
      const step = loop[(state.pointer + i) % loopLength];
      const card = this.createRecommendationCard(step, progress);
      if (!card) continue;
      if (seen.has(card.key)) continue;
      if (state.completed.includes(card.key)) continue;
      seen.add(card.key);
      cards.push(card);
    }

    // If all tasks were completed today, loop again from current pointer.
    if (cards.length === 0) {
      for (let i = 0; i < loopLength && cards.length < maxCards; i++) {
        const step = loop[(state.pointer + i) % loopLength];
        const card = this.createRecommendationCard(step, progress);
        if (!card || seen.has(card.key)) continue;
        seen.add(card.key);
        cards.push(card);
      }
    }

    return {
      cards,
      pointer: state.pointer,
      loopLength,
      loopLabel: this.getRecommendationLoopLabel(profile?.ageGroup || 'child'),
    };
  },

  getRoutineProgressMeta() {
    const state = this.routineState || {};
    const total = Math.max(0, Number(state.total) || 0);
    const completed = Math.max(0, Math.min(total, Number(state.completed) || 0));
    const active = !!state.active && total > 0 && completed < total;
    const nextCard = active ? this.routineCards[Number(state.index) || 0] : null;
    return { active, total, completed, nextCard };
  },

  startDailyRoutine() {
    const profile = Profile.getCurrent();
    const progress = Storage.getProgress(this.currentProfile);
    const recommendation = this.getRecommendationCards(profile, progress);
    const queue = (recommendation.cards || []).slice(0, 4);
    if (!queue.length) return;

    this.routineCards = queue.map((card) => ({ ...card }));
    this.routineState = {
      active: true,
      index: 0,
      completed: 0,
      total: this.routineCards.length,
      startedAt: Date.now(),
    };

    this.runNextRoutineStep();
    if (this.currentScreen === 'home') this.showHome();
  },

  stopDailyRoutine() {
    this.routineCards = [];
    this.routineState = {
      active: false,
      index: 0,
      completed: 0,
      total: 0,
      startedAt: 0,
    };
    if (this.currentScreen === 'home') this.showHome();
  },

  finishDailyRoutine() {
    if (window.Reward && typeof Reward.addXP === 'function') Reward.addXP(20);
    if (window.Reward && typeof Reward.addStars === 'function') Reward.addStars(3);
    this.stopDailyRoutine();
    alert('오늘 루틴 완료! 보너스 XP와 별을 받았어요.');
    if (window.Ads) Ads.maybeShowInterstitial('routine-complete');
  },

  runNextRoutineStep() {
    const meta = this.getRoutineProgressMeta();
    if (!meta.active) return;
    if (!meta.nextCard) {
      this.finishDailyRoutine();
      return;
    }
    this.runRecommendationCard(meta.nextCard);
  },

  markRoutineProgress(card) {
    const meta = this.getRoutineProgressMeta();
    if (!meta.active || !card) return;

    let idx = Number(this.routineState.index) || 0;
    const expected = this.routineCards[idx];
    if (!expected || expected.key !== card.key) {
      const found = this.routineCards.findIndex((row, rowIdx) => rowIdx >= idx && row.key === card.key);
      if (found < 0) return;
      idx = found;
    }

    const nextCompleted = Math.max(Number(this.routineState.completed) || 0, idx + 1);
    const nextIndex = idx + 1;
    this.routineState.completed = Math.min(this.routineCards.length, nextCompleted);
    this.routineState.index = nextIndex;

    if (nextIndex >= this.routineCards.length) {
      this.finishDailyRoutine();
      return;
    }

    if (this.currentScreen === 'home') this.showHome();
  },

  runRecommendationCard(card) {
    if (!card) return;
    this.activeRecommendation = card.kind === 'game' ? card : null;
    if (card.kind !== 'game') this.consumeRecommendation(card);

    if (card.kind === 'learn') {
      Learn.show(card.categoryId, card.stageId);
      return;
    }
    if (card.kind === 'review') {
      Learn.show(card.categoryId, card.stageId);
      return;
    }
    if (card.kind === 'coloring') {
      Coloring.showDesigns();
      return;
    }
    if (card.kind === 'movement') {
      this.startMovementBreak();
      return;
    }
    if (card.kind === 'game') {
      if (card.gameId === 'counting') {
        Game.startCounting();
        return;
      }
      if (card.gameId === 'iq-camp-25d') {
        Game.startIQCamp25D();
        return;
      }
      if (card.gameId === 'block-count-25d') {
        Game.startBlockCount25D();
        return;
      }
      if (card.gameId === 'block-count-25d-infinite') {
        Game.startBlockCount25D('infinite');
        return;
      }
      if (card.gameId === 'spatial-matrix-25d') {
        Game.startSpatialMatrix25D();
        return;
      }
      if (card.gameId === 'tower') {
        Game.startSkyTower(card.categoryId || 'number');
        return;
      }
      if (card.gameId === 'times') {
        Game.startTimesTableQuiz();
        return;
      }
      if (card.gameId === 'shape3d') {
        Game.startShape3DMatch();
        return;
      }
      if (card.gameId === 'net3d') {
        Game.startShapeNetLab();
        return;
      }
      if (card.gameId === 'shape-lab') {
        Game.startShapeBuilderLab();
        return;
      }
      if (card.gameId === 'quiz') {
        Game.startQuiz(card.categoryId);
        return;
      }
      if (card.gameId === 'quiz-marathon') {
        Game.startQuizMarathon(card.categoryId);
        return;
      }
      if (card.gameId === 'quiz-infinite') {
        Game.startQuizInfinite(card.categoryId);
        return;
      }
      if (card.gameId === 'matching') {
        Game.startMatching(card.categoryId);
        return;
      }
      if (card.gameId === 'sound') {
        Game.startSound(card.categoryId);
        return;
      }
      if (card.gameId === 'tracing') {
        Game.startTracing(card.categoryId);
      }
    }
  },

  runRecommendation(index) {
    const card = this.recommendationCards[index];
    if (!card) return;
    this.runRecommendationCard(card);
  },

  startMovementBreak() {
    if (this.currentProfile && window.Storage && typeof Storage.incrementBreakCount === 'function') {
      Storage.incrementBreakCount(this.currentProfile);
    }
    if (window.Daily && typeof Daily.updateMissionProgress === 'function') {
      Daily.updateMissionProgress('break');
    }
    this.kidGuard.breakPromptAt = Date.now();
    alert('2분 움직임 시간! 잠깐 스트레칭하고 다시 시작해요 🤸');
    this.refreshKidTimeWidgets();
  },

  async promptInstall() {
    const promptEvent = this.deferredInstallPrompt;
    if (!promptEvent) return;
    try {
      await promptEvent.prompt();
      await promptEvent.userChoice;
    } catch (_) {
      // Ignore and keep browsing flow.
    } finally {
      this.deferredInstallPrompt = null;
      if (this.currentScreen === 'home') this.showHome();
    }
  },

  consumeRecommendation(card) {
    if (!this.currentProfile || !card) return;
    const profile = Profile.getCurrent();
    const loop = this.getRecommendationTemplates(profile?.ageGroup || 'child');
    const loopLength = Math.max(1, Number(this.recommendationLoopLength) || loop.length || 1);
    const state = this.getRecommendationState(this.currentProfile, profile?.ageGroup || 'child', loopLength);
    const completed = Array.isArray(state.completed) ? state.completed.slice() : [];
    if (!completed.includes(card.key)) completed.push(card.key);
    const nextPointer = card.advancePointer === false
      ? state.pointer
      : (state.pointer + 1) % loopLength;
    const next = {
      date: state.date,
      pointer: nextPointer,
      completed,
    };
    this.saveRecommendationState(this.currentProfile, next);
    this.markRoutineProgress(card);
  },

  completeActiveRecommendation() {
    if (!this.activeRecommendation) return;
    this.consumeRecommendation(this.activeRecommendation);
    this.activeRecommendation = null;
  },

  startKidGuard() {
    this.stopKidGuard();
    if (!this.currentProfile) return;
    const now = Date.now();
    this.kidGuard.lastTickAt = now;
    this.kidGuard.sessionStartedAt = now;
    this.kidGuard.breakPromptAt = now;
    this.kidGuard.sessionExtraMinutes = 0;
    this.kidGuard.dailyExtraMinutes = 0;
    this.kidGuard.bedtimeUnlockUntil = 0;
    this.kidGuard.overlayReason = '';
    this.kidGuard.timerId = setInterval(() => this.tickKidGuard(), 15000);
    this.tickKidGuard();
  },

  stopKidGuard() {
    if (this.kidGuard.timerId) {
      clearInterval(this.kidGuard.timerId);
    }
    this.kidGuard.timerId = null;
    this.kidGuard.lastTickAt = 0;
    this.kidGuard.sessionStartedAt = 0;
    this.kidGuard.breakPromptAt = 0;
    this.kidGuard.sessionExtraMinutes = 0;
    this.kidGuard.dailyExtraMinutes = 0;
    this.kidGuard.bedtimeUnlockUntil = 0;
    this.hideKidGuardOverlay();
  },

  isKidGuardTrackableScreen(screenId = this.currentScreen) {
    return !['splash', 'profile', 'parent', 'benchmark', 'reference'].includes(screenId);
  },

  getSessionElapsedMinutes() {
    if (!this.kidGuard.sessionStartedAt) return 0;
    const elapsed = ((Date.now() - this.kidGuard.sessionStartedAt) / 60000) - (this.kidGuard.sessionExtraMinutes || 0);
    return Math.max(0, Math.floor(elapsed));
  },

  timeToMinutes(clock) {
    const text = String(clock || '').trim();
    const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(text);
    if (!match) return null;
    return Number(match[1]) * 60 + Number(match[2]);
  },

  isBedtimeWindowActive(settings, nowDate = new Date()) {
    if (!settings?.bedtimeEnabled) return false;
    const start = this.timeToMinutes(settings.bedtimeStart);
    const end = this.timeToMinutes(settings.bedtimeEnd);
    if (start === null || end === null || start === end) return false;
    const current = nowDate.getHours() * 60 + nowDate.getMinutes();
    if (start < end) {
      return current >= start && current < end;
    }
    return current >= start || current < end;
  },

  isBedtimeLocked(settings) {
    if (!this.isBedtimeWindowActive(settings)) return false;
    return Date.now() >= (this.kidGuard.bedtimeUnlockUntil || 0);
  },

  refreshKidTimeWidgets() {
    const usage = this.getTodayUsage();
    const settings = this.getParentSettings();
    const usedMin = Math.floor((usage.secondsToday || 0) / 60);
    const dailyLimit = settings.dailyLimitMin > 0
      ? settings.dailyLimitMin + (this.kidGuard.dailyExtraMinutes || 0)
      : 0;
    const remainMin = dailyLimit > 0 ? Math.max(0, dailyLimit - usedMin) : null;
    const remainText = this.isBedtimeLocked(settings)
      ? '취침 잠금 중'
      : (remainMin === null ? `${usedMin}분 사용` : `${remainMin}분 남음`);

    const headerTime = document.getElementById('header-time');
    if (headerTime) headerTime.textContent = `⏰ ${remainText}`;

    const usedEl = document.getElementById('home-kidtime-used');
    if (usedEl) usedEl.textContent = `${usedMin}분`;
    const remainEl = document.getElementById('home-kidtime-remaining');
    if (remainEl) {
      const remainLabel = this.isBedtimeLocked(settings)
        ? '취침 잠금 중'
        : (remainMin === null ? '무제한' : `${remainMin}분`);
      remainEl.textContent = remainLabel;
    }
    const sessionEl = document.getElementById('home-kidtime-session');
    if (sessionEl) sessionEl.textContent = `${this.getSessionElapsedMinutes()}분`;
  },

  tickKidGuard() {
    if (!this.currentProfile || document.hidden) return;
    const now = Date.now();
    if (!this.kidGuard.lastTickAt) this.kidGuard.lastTickAt = now;
    const deltaSeconds = Math.max(0, Math.floor((now - this.kidGuard.lastTickAt) / 1000));
    this.kidGuard.lastTickAt = now;

    const settings = this.getParentSettings();

    if (!this.isKidGuardTrackableScreen()) {
      this.refreshKidTimeWidgets();
      return;
    }

    if (deltaSeconds > 0 && !this.isBedtimeLocked(settings)) {
      Storage.addUsageSeconds(this.currentProfile, Math.min(deltaSeconds, 30));
    }
    const usage = this.getTodayUsage();
    this.enforceKidGuard(settings, usage);
    this.refreshKidTimeWidgets();
  },

  enforceKidGuard(settings, usage) {
    if (this.isBedtimeLocked(settings)) {
      this.showKidGuardOverlay('bedtime', settings, usage);
      return;
    }
    if (this.kidGuard.overlayReason === 'bedtime') {
      this.hideKidGuardOverlay();
    }

    const usedMin = (usage.secondsToday || 0) / 60;
    const dailyLimit = settings.dailyLimitMin > 0
      ? settings.dailyLimitMin + (this.kidGuard.dailyExtraMinutes || 0)
      : 0;
    if (dailyLimit > 0 && usedMin >= dailyLimit) {
      this.showKidGuardOverlay('daily', settings, usage);
      return;
    }
    if (this.kidGuard.overlayReason === 'daily') {
      this.hideKidGuardOverlay();
    }

    const sessionElapsed = ((Date.now() - this.kidGuard.sessionStartedAt) / 60000) - (this.kidGuard.sessionExtraMinutes || 0);
    if (settings.sessionLimitMin > 0 && sessionElapsed >= settings.sessionLimitMin) {
      this.showKidGuardOverlay('session', settings, usage);
      return;
    }
    if (this.kidGuard.overlayReason === 'session') {
      this.hideKidGuardOverlay();
    }

    const sinceBreak = (Date.now() - this.kidGuard.breakPromptAt) / 60000;
    if (settings.breakEveryMin > 0 && sinceBreak >= settings.breakEveryMin) {
      this.showKidGuardOverlay('break', settings, usage);
      return;
    }
    if (this.kidGuard.overlayReason === 'break') {
      this.hideKidGuardOverlay();
    }
  },

  showKidGuardOverlay(reason, settings, usage) {
    if (this.kidGuard.overlayReason === reason) return;
    this.kidGuard.overlayReason = reason;

    const bedtimeRange = `${settings.bedtimeStart || '21:00'} ~ ${settings.bedtimeEnd || '07:00'}`;
    const config = {
      break: {
        title: '휴식 시간',
        desc: `${settings.breakEveryMin}분 학습해서 잠깐 쉬어요.`,
        primaryText: '확인',
      },
      session: {
        title: '연속 사용 제한',
        desc: `연속 ${settings.sessionLimitMin}분 사용했어요.`,
        primaryText: '확인',
      },
      daily: {
        title: '오늘 사용량 도달',
        desc: `오늘 ${Math.floor((usage.secondsToday || 0) / 60)}분 사용 / 제한 ${settings.dailyLimitMin + (this.kidGuard.dailyExtraMinutes || 0)}분`,
        primaryText: '',
      },
      bedtime: {
        title: '취침 시간 잠금',
        desc: `취침 시간(${bedtimeRange})에는 잠금 상태입니다.`,
        primaryText: '',
      },
    }[reason] || {
      title: '휴식 알림',
      desc: '잠깐 쉬고 다시 시작해요.',
      primaryText: '확인',
    };

    let overlay = document.getElementById('kid-guard-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'kid-guard-overlay';
      overlay.className = 'kid-guard-overlay';
      document.body.appendChild(overlay);
    }

    const secondaryLabel = reason === 'daily'
      ? '부모 확인 (+15분)'
      : (reason === 'session'
        ? '부모 확인 (+10분)'
        : (reason === 'bedtime' ? '부모 해제 (+30분)' : '부모 확인'));
    overlay.innerHTML = `
      <div class="kid-guard-card">
        <h3>${config.title}</h3>
        <p>${config.desc}</p>
        <div class="kid-guard-buttons">
          ${config.primaryText ? `<button class="btn-primary" onclick="App.acknowledgeKidBreak()">${config.primaryText}</button>` : ''}
          <button class="btn-secondary" onclick="App.parentOverrideKidGuard('${reason}')">${secondaryLabel}</button>
        </div>
      </div>
    `;
  },

  hideKidGuardOverlay() {
    const overlay = document.getElementById('kid-guard-overlay');
    if (overlay) overlay.remove();
    this.kidGuard.overlayReason = '';
  },

  acknowledgeKidBreak() {
    if (!this.currentProfile) return;
    Storage.incrementBreakCount(this.currentProfile);
    this.kidGuard.breakPromptAt = Date.now();
    if (this.kidGuard.overlayReason === 'session') {
      this.kidGuard.sessionStartedAt = Date.now();
      this.kidGuard.sessionExtraMinutes = 0;
    }
    this.hideKidGuardOverlay();
    this.refreshKidTimeWidgets();
  },

  parentOverrideKidGuard(reason) {
    if (!window.Profile || typeof Profile.verifyParentGate !== 'function') return;
    Profile.verifyParentGate(() => {
      const now = Date.now();
      if (reason === 'daily') this.kidGuard.dailyExtraMinutes += 15;
      else if (reason === 'session') this.kidGuard.sessionExtraMinutes += 10;
      else if (reason === 'bedtime') this.kidGuard.bedtimeUnlockUntil = now + (30 * 60 * 1000);
      this.kidGuard.breakPromptAt = now;
      this.kidGuard.lastTickAt = now;
      this.hideKidGuardOverlay();
      this.tickKidGuard();
      this.refreshKidTimeWidgets();
    });
  },

  handleParentSettingsUpdated(profileId) {
    if (profileId !== this.currentProfile) return;
    const now = Date.now();
    this.kidGuard.lastTickAt = now;
    this.kidGuard.breakPromptAt = now;
    this.kidGuard.sessionStartedAt = now;
    this.kidGuard.sessionExtraMinutes = 0;
    this.kidGuard.dailyExtraMinutes = 0;
    this.kidGuard.bedtimeUnlockUntil = 0;
    this.hideKidGuardOverlay();
    this.tickKidGuard();
    if (this.currentScreen === 'home') this.showHome();
    else this.refreshKidTimeWidgets();
  },

  // Tab handlers
  tabHome() { this.navigate('home'); },
  tabHangul() { Learn.showStages('hangul'); },
  tabEnglish() { Learn.showStages('english'); },
  tabNumber() { Learn.showStages('number'); },
  tabPlay() {
    const screen = document.getElementById('screen-game-select');
    screen.innerHTML = `
      <div class="game-select-container play-hub">
        <div class="play-hub-hero">
          <div class="play-hub-title">🚀 IQ & 플레이 허브</div>
          <div class="play-hub-subtitle">기초 학습부터 3D 공간지각, 2.5D 타워, IQ 미니게임 118+까지</div>
          <div class="play-hub-tags">
            <span class="play-hub-tag">NEW 3D 도형</span>
            <span class="play-hub-tag">NEW 2.5D 타워</span>
            <span class="play-hub-tag">보상 연동</span>
          </div>
        </div>
        <div class="game-mode-cards">
          ${Object.entries(CATEGORIES).map(([catId, cat]) => `
            <button class="game-mode-card" onclick="Game.showSelection('${catId}')">
              <div class="game-mode-icon">${cat.icon}</div>
              <div>
                <div class="game-mode-name">${cat.name} 게임</div>
                <div class="game-mode-desc">${catId === 'math' ? '덧셈, 뺄셈, 곱셈, 나눗셈 + 구구단' : '퀴즈, 짝맞추기, 소리 찾기, 따라쓰기'}</div>
              </div>
            </button>
          `).join('')}
          <button class="game-mode-card" onclick="Coloring.showDesigns()">
            <div class="game-mode-icon">🎨</div>
            <div>
              <div class="game-mode-name">색칠하기</div>
              <div class="game-mode-desc">직접 색칠하고 자유롭게 꾸며요</div>
            </div>
          </button>
          ${Profile.getCurrent().canCombine ? `
            <button class="game-mode-card" onclick="Learn.showCombine()">
              <div class="game-mode-icon">🔤</div>
              <div>
                <div class="game-mode-name">한글 조합 놀이</div>
                <div class="game-mode-desc">자음 + 모음을 조합해 글자를 만들어요</div>
              </div>
            </button>
          ` : ''}
          <button class="game-mode-card" onclick="Game.startCounting()">
            <div class="game-mode-icon">🔢</div>
            <div>
              <div class="game-mode-name">숫자 세기</div>
              <div class="game-mode-desc">사물을 세고 숫자 감각을 키워요</div>
            </div>
          </button>
          <button class="game-mode-card" onclick="Game.startShape3DMatch()">
            <div class="game-mode-icon">🧊</div>
            <div>
              <div class="game-mode-name">3D 도형 맞추기</div>
              <div class="game-mode-desc">입체도형 특징을 보고 정답 도형을 고르기</div>
            </div>
          </button>
          <button class="game-mode-card" onclick="Game.startShapeNetLab()">
            <div class="game-mode-icon">🧩</div>
            <div>
              <div class="game-mode-name">3D 모형 해석</div>
              <div class="game-mode-desc">전개도 힌트로 어떤 입체인지 추론하기</div>
            </div>
          </button>
          <button class="game-mode-card" onclick="Game.startShapeBuilderLab()">
            <div class="game-mode-icon">🧱</div>
            <div>
              <div class="game-mode-name">도형 만들기 랩</div>
              <div class="game-mode-desc">조각을 조합해 목표 도형을 완성하기</div>
            </div>
          </button>
          <button class="game-mode-card" onclick="Game.startIQCamp25D()">
            <div class="game-mode-icon">🧠</div>
            <div>
              <div class="game-mode-name">IQ 부트캠프 (적응형)</div>
              <div class="game-mode-desc">시공간 기억 + 패턴 추론을 번갈아 훈련</div>
            </div>
          </button>
          <button class="game-mode-card" onclick="Game.startSpatialMatrix25D()">
            <div class="game-mode-icon">🧠</div>
            <div>
              <div class="game-mode-name">2.5D 매트릭스 IQ</div>
              <div class="game-mode-desc">행·열 규칙으로 빈칸 패턴 완성</div>
            </div>
          </button>

          <button class="game-mode-card" onclick="Game.startSkyTower()">
            <div class="game-mode-icon">🏙️</div>
            <div>
              <div class="game-mode-name">2.5D 숫자 타워</div>
              <div class="game-mode-desc">정답을 맞히면 건물이 높아져요</div>
            </div>
          </button>
          <button class="game-mode-card" onclick="Game.startSkyTower('hangul')">
            <div class="game-mode-icon">🏗️</div>
            <div>
              <div class="game-mode-name">2.5D 한글 타워</div>
              <div class="game-mode-desc">한글 정답으로 타워를 완성해요</div>
            </div>
          </button>
          <button class="game-mode-card" onclick="Game.startSkyTower('english')">
            <div class="game-mode-icon">🧱</div>
            <div>
              <div class="game-mode-name">2.5D 영어 타워</div>
              <div class="game-mode-desc">영어 단어 정답으로 타워를 쌓아요</div>
            </div>
          </button>

          <button class="game-mode-card" onclick="Game.showGithubPack()">
            <div class="game-mode-icon">GH</div>
            <div>
              <div class="game-mode-name">IQ 미니게임 118+</div>
              <div class="game-mode-desc">반응속도, 기억력, 논리, 퍼즐 게임 모음</div>
            </div>
          </button>

          <button class="game-mode-card" onclick="App.navigate('benchmark')">
            <div class="game-mode-icon">LAB</div>
            <div>
              <div class="game-mode-name">AI 벤치마크</div>
              <div class="game-mode-desc">3~8세 학습/인지 테스트 리포트</div>
            </div>
          </button>

          <button class="game-mode-card" onclick="App.navigate('reference')">
            <div class="game-mode-icon">📚</div>
            <div>
              <div class="game-mode-name">학습 콘텐츠</div>
              <div class="game-mode-desc">도해 자료와 학습 모듈을 한 번에 보기</div>
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


