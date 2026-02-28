// Learning card mode - swipe through cards with pronunciation

const Learn = {
  currentCategory: null,
  currentItems: [],
  currentIndex: 0,
  touchStartX: 0,
  touchStartY: 0,

  show(categoryId) {
    this.currentCategory = categoryId;
    this.currentItems = getDataForProfile(categoryId, App.currentProfile);
    this.currentIndex = 0;

    const profile = Profile.getCurrent();
    const cat = CATEGORIES[categoryId];
    const screen = document.getElementById('screen-learn');

    screen.innerHTML = `
      <div class="learn-container">
        <div class="learn-header">
          <button class="btn-back" onclick="App.navigate('home')">
            <span class="back-arrow">←</span>
          </button>
          <h2 class="learn-title">${cat.name}</h2>
          <span class="learn-counter" id="learn-counter">1 / ${this.currentItems.length}</span>
        </div>
        <div class="learn-card-area" id="learn-card-area">
          <div class="learn-card" id="learn-card" style="--card-color: ${cat.color}">
            <div class="learn-card-inner" id="learn-card-inner"></div>
          </div>
        </div>
        <div class="learn-nav">
          <button class="btn-nav btn-prev" id="btn-prev" onclick="Learn.prev()">◀</button>
          <button class="btn-sound" onclick="Learn.speakCurrent()">🔊</button>
          <button class="btn-nav btn-next" id="btn-next" onclick="Learn.next()">▶</button>
        </div>
        <div class="learn-dots" id="learn-dots"></div>
      </div>
    `;

    // Setup touch/swipe
    const cardArea = document.getElementById('learn-card-area');
    cardArea.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: true });
    cardArea.addEventListener('touchend', (e) => this.onTouchEnd(e), { passive: true });

    this.renderCard();
    this.renderDots();

    // Auto-speak for Sobin
    if (profile.autoSpeak) {
      setTimeout(() => this.speakCurrent(), 300);
    }
  },

  renderCard() {
    const item = this.currentItems[this.currentIndex];
    const profile = Profile.getCurrent();
    const inner = document.getElementById('learn-card-inner');

    inner.innerHTML = `
      <div class="card-emoji">${item.emoji}</div>
      <div class="card-char" style="font-size: ${profile.fontSize}px">${item.char}</div>
      <div class="card-word">${item.word}</div>
      <div class="card-pronunciation">[${item.pronunciation}]</div>
    `;

    // Update counter
    const counter = document.getElementById('learn-counter');
    if (counter) counter.textContent = `${this.currentIndex + 1} / ${this.currentItems.length}`;

    // Update nav buttons
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    if (prevBtn) prevBtn.disabled = this.currentIndex === 0;
    if (nextBtn) nextBtn.disabled = this.currentIndex === this.currentItems.length - 1;

    // Mark as learned
    this.markLearned(item.char);

    // Update dots
    this.updateDots();

    // Card entrance animation
    const card = document.getElementById('learn-card');
    card.classList.remove('card-enter');
    void card.offsetWidth; // force reflow
    card.classList.add('card-enter');
  },

  renderDots() {
    const dots = document.getElementById('learn-dots');
    dots.innerHTML = this.currentItems.map((_, i) =>
      `<span class="dot ${i === this.currentIndex ? 'active' : ''}" onclick="Learn.goTo(${i})"></span>`
    ).join('');
  },

  updateDots() {
    const dots = document.querySelectorAll('#learn-dots .dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentIndex);
    });
  },

  next() {
    if (this.currentIndex < this.currentItems.length - 1) {
      this.currentIndex++;
      this.renderCard();
      if (Profile.getCurrent().autoSpeak) {
        setTimeout(() => this.speakCurrent(), 300);
      }
    }
  },

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.renderCard();
      if (Profile.getCurrent().autoSpeak) {
        setTimeout(() => this.speakCurrent(), 300);
      }
    }
  },

  goTo(index) {
    this.currentIndex = index;
    this.renderCard();
    if (Profile.getCurrent().autoSpeak) {
      setTimeout(() => this.speakCurrent(), 300);
    }
  },

  speakCurrent() {
    const item = this.currentItems[this.currentIndex];
    Speech.speakItem(item, this.currentCategory);
  },

  markLearned(char) {
    const progress = Storage.getProgress(App.currentProfile);
    if (!progress.learned[this.currentCategory]) {
      progress.learned[this.currentCategory] = [];
    }
    if (!progress.learned[this.currentCategory].includes(char)) {
      progress.learned[this.currentCategory].push(char);
      Storage.saveProgress(App.currentProfile, progress);
      Reward.checkBadges();
    }
  },

  onTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
  },

  onTouchEnd(e) {
    const deltaX = e.changedTouches[0].clientX - this.touchStartX;
    const deltaY = e.changedTouches[0].clientY - this.touchStartY;

    // Only handle horizontal swipes (not vertical scrolling)
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) this.next();
      else this.prev();
    }
  },
};
