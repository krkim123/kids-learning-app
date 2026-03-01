// Stage-based learning with hangul combination

const Learn = {
  currentCategory: null,
  currentStage: null,
  currentItems: [],
  currentIndex: 0,
  touchStartX: 0,
  touchStartY: 0,

  // Show stage selection for a category
  showStages(categoryId) {
    this.currentCategory = categoryId;
    const cat = CATEGORIES[categoryId];
    const progress = Storage.getProgress(App.currentProfile);
    const screen = document.getElementById('screen-category');

    screen.innerHTML = `
      <div class="category-detail-container">
        <div class="learn-header">
          <button class="btn-back" onclick="App.navigate('home')">
            <span class="back-arrow">&larr;</span>
          </button>
          <h2 class="learn-title" style="color:${cat.color}">${cat.icon} ${cat.name}</h2>
          <span></span>
        </div>

        <div class="stages-list">
          ${cat.stages.map(stage => {
            const unlocked = isStageUnlocked(categoryId, stage.id, progress);
            const sp = getStageProgress(categoryId, stage.id, progress);
            return `
              <button class="stage-card ${unlocked ? '' : 'locked'} ${sp.complete ? 'complete' : ''}"
                      onclick="${unlocked ? `Learn.show('${categoryId}', ${stage.id})` : ''}"
                      style="--stage-color: ${cat.color}">
                <div class="stage-left">
                  <div class="stage-number ${sp.complete ? 'done' : ''}">${sp.complete ? '✓' : stage.id}</div>
                  <div class="stage-info">
                    <div class="stage-name">${stage.name}</div>
                    <div class="stage-subtitle">${stage.subtitle}</div>
                  </div>
                </div>
                <div class="stage-right">
                  ${unlocked ? `
                    <div class="stage-progress-ring">
                      <svg viewBox="0 0 36 36" class="stage-ring-svg">
                        <path class="stage-ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                        <path class="stage-ring-fill" stroke-dasharray="${sp.percent}, 100"
                              style="stroke:${cat.color}"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                      </svg>
                      <span class="stage-ring-text">${sp.percent}%</span>
                    </div>
                  ` : '<div class="stage-lock">🔒</div>'}
                </div>
              </button>
            `;
          }).join('')}
        </div>

        ${categoryId === 'hangul' && Profile.getCurrent().canCombine ? `
          <div class="combine-section">
            <button class="stage-card combine-card" onclick="Learn.showCombine()" style="--stage-color: #FF69B4">
              <div class="stage-left">
                <div class="stage-number" style="background:#FF69B4">+</div>
                <div class="stage-info">
                  <div class="stage-name">한글 조합 놀이</div>
                  <div class="stage-subtitle">자음 + 모음 = 글자</div>
                </div>
              </div>
              <div class="stage-right">
                <div class="stage-lock" style="font-size:1.5rem">🎯</div>
              </div>
            </button>
          </div>
        ` : ''}

        <div class="stage-game-section">
          <h3 class="stage-section-title">🎮 ${cat.name} 게임</h3>
          <div class="stage-game-buttons">
            <button class="stage-game-btn" onclick="Game.showSelection('${categoryId}')">
              게임하기 🎮
            </button>
          </div>
        </div>
      </div>
    `;
    App.showScreen('category');
  },

  // Show learning cards for a specific stage
  show(categoryId, stageId) {
    this.currentCategory = categoryId;
    this.currentStage = stageId;
    this.currentItems = getStageItems(categoryId, stageId);
    this.currentIndex = 0;

    const profile = Profile.getCurrent();
    const cat = CATEGORIES[categoryId];
    const stage = cat.stages.find(s => s.id === stageId);
    const screen = document.getElementById('screen-learn');

    screen.innerHTML = `
      <div class="learn-container">
        <div class="learn-header">
          <button class="btn-back" onclick="Learn.showStages('${categoryId}')">
            <span class="back-arrow">&larr;</span>
          </button>
          <h2 class="learn-title">${cat.icon} ${stage.name}</h2>
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

    const cardArea = document.getElementById('learn-card-area');
    cardArea.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: true });
    cardArea.addEventListener('touchend', (e) => this.onTouchEnd(e), { passive: true });

    this.renderCard();
    this.renderDots();

    if (profile.autoSpeak) {
      setTimeout(() => this.speakCurrent(), 300);
    }
    App.showScreen('learn');
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

    const counter = document.getElementById('learn-counter');
    if (counter) counter.textContent = `${this.currentIndex + 1} / ${this.currentItems.length}`;

    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    if (prevBtn) prevBtn.disabled = this.currentIndex === 0;
    if (nextBtn) nextBtn.disabled = this.currentIndex === this.currentItems.length - 1;

    this.markLearned(item);
    this.updateDots();

    const card = document.getElementById('learn-card');
    card.classList.remove('card-enter');
    void card.offsetWidth;
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
    dots.forEach((dot, i) => dot.classList.toggle('active', i === this.currentIndex));
  },

  next() {
    if (this.currentIndex < this.currentItems.length - 1) {
      this.currentIndex++;
      this.renderCard();
      if (Profile.getCurrent().autoSpeak) setTimeout(() => this.speakCurrent(), 300);
    }
  },

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.renderCard();
      if (Profile.getCurrent().autoSpeak) setTimeout(() => this.speakCurrent(), 300);
    }
  },

  goTo(index) {
    this.currentIndex = index;
    this.renderCard();
    if (Profile.getCurrent().autoSpeak) setTimeout(() => this.speakCurrent(), 300);
  },

  speakCurrent() {
    const item = this.currentItems[this.currentIndex];
    Speech.speakItem(item, this.currentCategory);
  },

  markLearned(item) {
    const learnedKey = item?.id || item?.char;
    if (!learnedKey) return;
    const progress = Storage.getProgress(App.currentProfile);
    if (!progress.learned[this.currentCategory]) progress.learned[this.currentCategory] = [];
    if (!progress.learned[this.currentCategory].includes(learnedKey)) {
      progress.learned[this.currentCategory].push(learnedKey);
      const profile = Profile.getCurrent();
      Storage.saveProgress(App.currentProfile, progress);
      Reward.addXP(profile.xpPerLearn);
      Reward.checkBadges();
      Reward.checkLevelUp(progress);
      Daily.updateMissionProgress('learn', this.currentCategory);
    }
  },

  onTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
  },

  onTouchEnd(e) {
    const deltaX = e.changedTouches[0].clientX - this.touchStartX;
    const deltaY = e.changedTouches[0].clientY - this.touchStartY;
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) this.next(); else this.prev();
    }
  },

  // === Hangul Combination ===
  selectedConsonant: null,
  selectedVowel: null,

  showCombine() {
    this.selectedConsonant = null;
    this.selectedVowel = null;
    const screen = document.getElementById('screen-combine');

    screen.innerHTML = `
      <div class="combine-container">
        <div class="learn-header">
          <button class="btn-back" onclick="Learn.showStages('hangul')">
            <span class="back-arrow">&larr;</span>
          </button>
          <h2 class="learn-title">한글 조합 놀이</h2>
          <span></span>
        </div>

        <div class="combine-result-area" id="combine-result">
          <div class="combine-formula">
            <span class="combine-slot consonant-slot" id="consonant-slot">?</span>
            <span class="combine-plus">+</span>
            <span class="combine-slot vowel-slot" id="vowel-slot">?</span>
            <span class="combine-equals">=</span>
            <span class="combine-slot result-slot" id="result-slot">?</span>
          </div>
        </div>

        <div class="combine-section-label">자음을 골라요!</div>
        <div class="combine-grid consonant-grid" id="consonant-grid">
          ${HANGUL_COMBINE_CONSONANTS.map(c => `
            <button class="combine-btn" data-char="${c.char}" data-index="${c.index}"
                    onclick="Learn.selectConsonant(this, '${c.char}', ${c.index})">
              ${c.char}
            </button>
          `).join('')}
        </div>

        <div class="combine-section-label">모음을 골라요!</div>
        <div class="combine-grid vowel-grid" id="vowel-grid">
          ${HANGUL_COMBINE_VOWELS.map(v => `
            <button class="combine-btn" data-char="${v.char}" data-index="${v.index}"
                    onclick="Learn.selectVowel(this, '${v.char}', ${v.index})">
              ${v.char}
            </button>
          `).join('')}
        </div>
      </div>
    `;
    App.showScreen('combine');
  },

  selectConsonant(btn, char, index) {
    document.querySelectorAll('.consonant-grid .combine-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    this.selectedConsonant = { char, index };
    document.getElementById('consonant-slot').textContent = char;
    this.tryCombine();
  },

  selectVowel(btn, char, index) {
    document.querySelectorAll('.vowel-grid .combine-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    this.selectedVowel = { char, index };
    document.getElementById('vowel-slot').textContent = char;
    this.tryCombine();
  },

  tryCombine() {
    if (!this.selectedConsonant || !this.selectedVowel) return;
    const result = combineHangul(this.selectedConsonant.index, this.selectedVowel.index);
    const resultSlot = document.getElementById('result-slot');
    resultSlot.textContent = result;
    resultSlot.classList.add('combine-success');

    // Speak it
    Speech.speakKorean(result);
    SFX.play('correct');
    Reward.addStars(1);

    const progress = Storage.getProgress(App.currentProfile);
    progress.combineComplete = (progress.combineComplete || 0) + 1;
    Storage.saveProgress(App.currentProfile, progress);
    Reward.addXP(3);

    // Auto reset after 1.5s
    setTimeout(() => {
      resultSlot.classList.remove('combine-success');
      this.selectedConsonant = null;
      this.selectedVowel = null;
      document.getElementById('consonant-slot').textContent = '?';
      document.getElementById('vowel-slot').textContent = '?';
      document.getElementById('result-slot').textContent = '?';
      document.querySelectorAll('.combine-btn').forEach(b => b.classList.remove('selected'));
    }, 1500);
  },
};
