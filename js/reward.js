// Star, sticker, and badge reward system

const Reward = {
  addStars(count) {
    const progress = Storage.getProgress(App.currentProfile);
    const oldStars = progress.stars;
    progress.stars += count;

    // Check for new sticker (every 10 stars)
    const oldTens = Math.floor(oldStars / 10);
    const newTens = Math.floor(progress.stars / 10);
    if (newTens > oldTens) {
      const newSticker = this.grantRandomSticker(progress);
      if (newSticker) {
        this.showStickerPopup(newSticker);
      }
    }

    Storage.saveProgress(App.currentProfile, progress);
    this.updateStarDisplay();
    SFX.play('star');

    // Show floating star animation
    this.showFloatingStar();
  },

  grantRandomSticker(progress) {
    const allStickers = [...STICKERS.flowers, ...STICKERS.animals, ...STICKERS.fairy];
    const available = allStickers.filter(s => !progress.stickers.includes(s));
    if (available.length === 0) return null;
    const sticker = available[Math.floor(Math.random() * available.length)];
    progress.stickers.push(sticker);
    return sticker;
  },

  checkBadges() {
    const progress = Storage.getProgress(App.currentProfile);
    const profile = Profile.getCurrent();
    const newBadges = [];

    BADGES.forEach(badge => {
      if (progress.badges.includes(badge.id)) return;

      let earned = false;
      switch (badge.condition) {
        case 'learn_all_consonants':
          earned = (progress.learned['hangul-consonant'] || []).length >= 14;
          break;
        case 'learn_all_vowels':
          earned = (progress.learned['hangul-vowel'] || []).length >= 10;
          break;
        case 'learn_all_hangul':
          earned = (progress.learned['hangul-consonant'] || []).length >= 14
            && (progress.learned['hangul-vowel'] || []).length >= 10;
          break;
        case 'learn_all_numbers': {
          const needed = profile.id === 'sobin' ? 5 : 10;
          earned = (progress.learned['number'] || []).length >= needed;
          break;
        }
        case 'learn_all_english': {
          const needed = profile.id === 'sobin' ? 10 : 26;
          earned = (progress.learned['english'] || []).length >= needed;
          break;
        }
        case 'quiz_10': earned = (progress.quizCorrect || 0) >= 10; break;
        case 'quiz_50': earned = (progress.quizCorrect || 0) >= 50; break;
        case 'matching_10': earned = (progress.matchingComplete || 0) >= 10; break;
        case 'sound_10': earned = (progress.soundCorrect || 0) >= 10; break;
        case 'stars_50': earned = progress.stars >= 50; break;
        case 'stars_200': earned = progress.stars >= 200; break;
        case 'stickers_15': earned = (progress.stickers || []).length >= 15; break;
        case 'all_categories': {
          const numNeeded = profile.id === 'sobin' ? 5 : 10;
          const engNeeded = profile.id === 'sobin' ? 10 : 26;
          earned = (progress.learned['hangul-consonant'] || []).length >= 14
            && (progress.learned['hangul-vowel'] || []).length >= 10
            && (progress.learned['number'] || []).length >= numNeeded
            && (progress.learned['english'] || []).length >= engNeeded;
          break;
        }
      }

      if (earned) {
        progress.badges.push(badge.id);
        newBadges.push(badge);
      }
    });

    if (newBadges.length > 0) {
      Storage.saveProgress(App.currentProfile, progress);
      newBadges.forEach(badge => this.showBadgePopup(badge));
    }
  },

  showRewardScreen() {
    const progress = Storage.getProgress(App.currentProfile);
    const profile = Profile.getCurrent();
    const screen = document.getElementById('screen-reward');

    screen.innerHTML = `
      <div class="reward-container">
        <div class="learn-header">
          <button class="btn-back" onclick="App.navigate('home')">
            <span class="back-arrow">←</span>
          </button>
          <h2 class="learn-title">${profile.name}의 보상함</h2>
          <span></span>
        </div>

        <div class="reward-section">
          <h3 class="reward-section-title">⭐ 내 별: ${progress.stars}개</h3>
          <div class="star-counter-big">
            ${'⭐'.repeat(Math.min(progress.stars, 20))}
            ${progress.stars > 20 ? `<span class="more-stars">+${progress.stars - 20}</span>` : ''}
          </div>
        </div>

        <div class="reward-section">
          <h3 class="reward-section-title">🎨 스티커 컬렉션 (${progress.stickers.length}/30)</h3>
          <div class="sticker-grid">
            ${[...STICKERS.flowers, ...STICKERS.animals, ...STICKERS.fairy].map(s => `
              <div class="sticker-slot ${progress.stickers.includes(s) ? 'collected' : 'locked'}">
                ${progress.stickers.includes(s) ? s : '❓'}
              </div>
            `).join('')}
          </div>
        </div>

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

  updateStarDisplay() {
    const el = document.getElementById('home-stars');
    if (el) {
      const progress = Storage.getProgress(App.currentProfile);
      el.textContent = `⭐ ${progress.stars}`;
    }
  },
};
