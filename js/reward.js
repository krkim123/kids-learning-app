// Star, sticker, badge, XP, and level reward system

const Reward = {
  addStars(count) {
    const progress = Storage.getProgress(App.currentProfile);
    const oldStars = progress.stars;
    progress.stars += count;

    // Check for new sticker (every 10 stars)
    const oldTens = Math.floor(oldStars / 10);
    const newTens = Math.floor(progress.stars / 10);
    if (newTens > oldTens) {
      const gainedStickers = [];
      for (let tier = oldTens + 1; tier <= newTens; tier++) {
        const newSticker = this.grantRandomSticker(progress);
        if (newSticker) gainedStickers.push(newSticker);
      }
      gainedStickers.forEach((sticker) => this.showStickerPopup(sticker));
    }

    Storage.saveProgress(App.currentProfile, progress);
    this.updateStarDisplay();
    SFX.play('star');
    this.showFloatingStar();
  },

  addXP(amount) {
    const progress = Storage.getProgress(App.currentProfile);
    progress.xp = (progress.xp || 0) + amount;
    Storage.saveProgress(App.currentProfile, progress);
    this.checkLevelUp(progress);
  },

  grantRandomSticker(progress) {
    const allStickers = [...STICKERS.flowers, ...STICKERS.animals, ...STICKERS.fairy, ...(STICKERS.tower || [])];
    const available = allStickers.filter(s => !progress.stickers.includes(s));
    if (available.length === 0) return null;
    const sticker = available[Math.floor(Math.random() * available.length)];
    progress.stickers.push(sticker);
    return sticker;
  },

  checkLevelUp(progress) {
    if (!progress) progress = Storage.getProgress(App.currentProfile);
    const xp = progress.xp || 0;
    const oldLevel = Storage.get(App.currentProfile, 'lastLevel', 1);
    const newLevelInfo = getLevelInfo(xp);
    if (newLevelInfo.level > oldLevel) {
      Storage.set(App.currentProfile, 'lastLevel', newLevelInfo.level);
      this.showLevelUpPopup(newLevelInfo);
    }
  },

  checkBadges() {
    const progress = Storage.getProgress(App.currentProfile);
    const att = Storage.getAttendance(App.currentProfile);
    const newBadges = [];
    const lvl = getLevelInfo(progress.xp || 0);
    const lastHangulStage = CATEGORIES.hangul.stages[CATEGORIES.hangul.stages.length - 1]?.id || 3;
    const lastEnglishStage = CATEGORIES.english.stages[CATEGORIES.english.stages.length - 1]?.id || 3;
    const lastNumberStage = CATEGORIES.number.stages[CATEGORIES.number.stages.length - 1]?.id || 3;
    const lastMathStage = CATEGORIES.math?.stages[CATEGORIES.math.stages.length - 1]?.id || 3;

    BADGES.forEach(badge => {
      if (progress.badges.includes(badge.id)) return;
      let earned = false;
      switch (badge.condition) {
        case 'hangul_s1': earned = getStageProgress('hangul', 1, progress).complete; break;
        case 'hangul_s2': earned = getStageProgress('hangul', 2, progress).complete; break;
        case 'hangul_s3': earned = getStageProgress('hangul', lastHangulStage, progress).complete; break;
        case 'english_s1': earned = getStageProgress('english', 1, progress).complete; break;
        case 'english_s3': earned = getStageProgress('english', lastEnglishStage, progress).complete; break;
        case 'number_s3': earned = getStageProgress('number', lastNumberStage, progress).complete; break;
        case 'math_s3': earned = getStageProgress('math', lastMathStage, progress).complete; break;
        case 'quiz_10': earned = (progress.quizCorrect || 0) >= 10; break;
        case 'quiz_50': earned = (progress.quizCorrect || 0) >= 50; break;
        case 'matching_10': earned = (progress.matchingComplete || 0) >= 10; break;
        case 'sound_10': earned = (progress.soundCorrect || 0) >= 10; break;
        case 'tracing_10': earned = (progress.tracingComplete || 0) >= 10; break;
        case 'tower_3': earned = (progress.towerPlays || 0) >= 3; break;
        case 'tower_10': earned = (progress.towerPlays || 0) >= 10; break;
        case 'tower_best_8': earned = (progress.towerBestHeight || 0) >= 8; break;
        case 'streak_3': earned = (att.streak || 0) >= 3; break;
        case 'streak_7': earned = (att.streak || 0) >= 7; break;
        case 'streak_14': earned = (att.streak || 0) >= 14; break;
        case 'streak_30': earned = (att.streak || 0) >= 30; break;
        case 'stars_50': earned = progress.stars >= 50; break;
        case 'stars_200': earned = progress.stars >= 200; break;
        case 'stickers_15': earned = (progress.stickers || []).length >= 15; break;
        case 'level_5': earned = lvl.level >= 5; break;
        case 'level_10': earned = lvl.level >= 10; break;
        case 'all_stages':
          earned = Object.keys(CATEGORIES).every(catId =>
            CATEGORIES[catId].stages.every(s => getStageProgress(catId, s.id, progress).complete)
          );
          break;
      }
      if (earned) { progress.badges.push(badge.id); newBadges.push(badge); }
    });

    if (newBadges.length > 0) {
      Storage.saveProgress(App.currentProfile, progress);
      newBadges.forEach(badge => this.showBadgePopup(badge));
    }
  },

  showRewardScreen() {
    const progress = Storage.getProgress(App.currentProfile);
    const profile = Profile.getCurrent();
    const lvl = getLevelInfo(progress.xp || 0);
    const screen = document.getElementById('screen-reward');

    const stickerAll = [...STICKERS.flowers, ...STICKERS.animals, ...STICKERS.fairy, ...(STICKERS.tower || [])];

    screen.innerHTML = `
      <div class="reward-container">
        <div class="learn-header">
          <button class="btn-back" onclick="App.navigate('home')">
            <span class="back-arrow">&larr;</span>
          </button>
          <h2 class="learn-title">${profile.name}의 보상함</h2>
          <span></span>
        </div>

        <!-- Level -->
        <div class="reward-section level-section">
          <div class="level-display">
            <div class="level-icon-big">${lvl.icon}</div>
            <div class="level-info">
              <div class="level-name-big">Lv.${lvl.level} ${lvl.name}</div>
              <div class="level-xp-bar">
                <div class="level-xp-fill" style="width:${lvl.level < 20 ? Math.round(lvl.currentXpInLevel / lvl.xpForNext * 100) : 100}%"></div>
              </div>
              <div class="level-xp-text">XP: ${progress.xp || 0} ${lvl.level < 20 ? `/ ${LEVEL_SYSTEM[lvl.level].xpNeeded}` : '(MAX)'}</div>
            </div>
          </div>
        </div>

        <!-- Stars -->
        <div class="reward-section">
          <h3 class="reward-section-title">⭐ 내 별: ${progress.stars}개</h3>
          <div class="star-counter-big">
            ${'⭐'.repeat(Math.min(progress.stars, 20))}
            ${progress.stars > 20 ? `<span class="more-stars">+${progress.stars - 20}</span>` : ''}
          </div>
        </div>

        <!-- Stickers -->
        <div class="reward-section">
          <h3 class="reward-section-title">🎨 스티커 컬렉션 (${progress.stickers.length}/${stickerAll.length})</h3>
          <div class="sticker-grid">
            ${stickerAll.map(s => `
              <div class="sticker-slot ${progress.stickers.includes(s) ? 'collected' : 'locked'}">
                ${progress.stickers.includes(s) ? s : '❓'}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Badges -->
        <div class="reward-section">
          <h3 class="reward-section-title">🏅 배지 (${progress.badges.length}/${BADGES.length})</h3>
          <div class="badge-grid">
            ${BADGES.map(b => `
              <div class="badge-slot ${progress.badges.includes(b.id) ? 'earned' : 'locked'}">
                <div class="badge-icon">${progress.badges.includes(b.id) ? b.emoji : '🔒'}</div>
                <div class="badge-name">${b.name}</div>
                <div class="badge-desc">${b.description}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    App.showScreen('reward');
  },

  showFloatingStar() {
    const star = document.createElement('div');
    star.className = 'floating-star';
    star.textContent = '⭐';
    star.style.left = Math.random() * 80 + 10 + '%';
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 1000);
  },

  showStickerPopup(sticker) {
    const popup = document.createElement('div');
    popup.className = 'popup-overlay';
    popup.innerHTML = `
      <div class="popup-content sticker-popup">
        <div class="popup-sticker">${sticker}</div>
        <div class="popup-text">새 스티커를 받았어요!</div>
        <button class="btn-primary" onclick="this.closest('.popup-overlay').remove()">좋아요! 🎉</button>
      </div>
    `;
    document.body.appendChild(popup);
    setTimeout(() => { if (popup.parentNode) popup.remove(); }, 5000);
  },

  showBadgePopup(badge) {
    setTimeout(() => {
      const popup = document.createElement('div');
      popup.className = 'popup-overlay';
      popup.innerHTML = `
        <div class="popup-content badge-popup">
          <div class="popup-badge">${badge.emoji}</div>
          <div class="popup-badge-name">${badge.name}</div>
          <div class="popup-text">${badge.description}</div>
          <button class="btn-primary" onclick="this.closest('.popup-overlay').remove()">우와! 🎊</button>
        </div>
      `;
      document.body.appendChild(popup);
      setTimeout(() => { if (popup.parentNode) popup.remove(); }, 6000);
    }, 500);
  },

  showLevelUpPopup(levelInfo) {
    SFX.play('levelup');
    setTimeout(() => {
      const popup = document.createElement('div');
      popup.className = 'popup-overlay levelup-overlay';
      popup.innerHTML = `
        <div class="popup-content levelup-popup">
          <div class="levelup-sparkles">✨🌟✨</div>
          <div class="levelup-icon">${levelInfo.icon}</div>
          <div class="levelup-title">레벨 업!</div>
          <div class="levelup-level">Lv.${levelInfo.level}</div>
          <div class="levelup-name">${levelInfo.name}</div>
          <button class="btn-primary" onclick="this.closest('.popup-overlay').remove()">와! 🎉</button>
        </div>
      `;
      document.body.appendChild(popup);
      setTimeout(() => { if (popup.parentNode) popup.remove(); }, 8000);
    }, 300);
  },

  updateStarDisplay() {
    const el = document.getElementById('header-stars');
    if (el) {
      const progress = Storage.getProgress(App.currentProfile);
      el.textContent = progress.stars;
    }
  },
};
