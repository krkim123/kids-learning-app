// Three game modes: Quiz, Matching, Sound-Find

const Game = {
  currentGame: null,
  currentCategory: null,
  items: [],
  score: 0,
  total: 0,

  showSelection(categoryId) {
    this.currentCategory = categoryId;
    const cat = CATEGORIES[categoryId];
    const screen = document.getElementById('screen-game-select');

    screen.innerHTML = `
      <div class="game-select-container">
        <div class="learn-header">
          <button class="btn-back" onclick="App.navigate('home')">
            <span class="back-arrow">←</span>
          </button>
          <h2 class="learn-title">${cat.name} 게임</h2>
          <span></span>
        </div>
        <div class="game-mode-cards">
          <button class="game-mode-card" onclick="Game.startQuiz('${categoryId}')">
            <div class="game-mode-icon">❓</div>
            <div class="game-mode-name">글자 맞추기</div>
            <div class="game-mode-desc">그림 보고 글자 고르기</div>
          </button>
          <button class="game-mode-card" onclick="Game.startMatching('${categoryId}')">
            <div class="game-mode-icon">🃏</div>
            <div class="game-mode-name">짝 맞추기</div>
            <div class="game-mode-desc">카드 뒤집어서 짝 찾기</div>
          </button>
          <button class="game-mode-card" onclick="Game.startSound('${categoryId}')">
            <div class="game-mode-icon">🔊</div>
            <div class="game-mode-name">소리 찾기</div>
            <div class="game-mode-desc">소리 듣고 글자 찾기</div>
          </button>
        </div>
      </div>
    `;
    App.navigate('game-select');
  },

  // ===== QUIZ =====
  startQuiz(categoryId) {
    this.currentCategory = categoryId;
    this.items = getDataForProfile(categoryId, App.currentProfile);
    this.score = 0;
    this.total = 0;
    this.quizQueue = this._shuffle([...this.items]).slice(0, Math.min(10, this.items.length));
    this.quizIndex = 0;
    App.navigate('game');
    this.showQuizQuestion();
  },

  showQuizQuestion() {
    if (this.quizIndex >= this.quizQueue.length) {
      this.showResult('quiz');
      return;
    }

    const profile = Profile.getCurrent();
    const correct = this.quizQueue[this.quizIndex];
    const numChoices = profile.quizChoices;

    // Build choices: correct + random wrong answers
    let choices = [correct];
    const pool = this.items.filter(i => i.char !== correct.char);
    const shuffled = this._shuffle([...pool]);
    for (let i = 0; i < numChoices - 1 && i < shuffled.length; i++) {
      choices.push(shuffled[i]);
    }
    choices = this._shuffle(choices);

    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="quiz-container">
        <div class="learn-header">
          <button class="btn-back" onclick="Game.showSelection('${this.currentCategory}')">
            <span class="back-arrow">←</span>
          </button>
          <h2 class="learn-title">글자 맞추기</h2>
          <span class="game-score">⭐ ${this.score}</span>
        </div>
        <div class="quiz-progress">
          <div class="quiz-progress-bar" style="width: ${(this.quizIndex / this.quizQueue.length) * 100}%"></div>
        </div>
        <div class="quiz-question">
          <div class="quiz-emoji">${correct.emoji}</div>
          <div class="quiz-word">${correct.word}</div>
        </div>
        <div class="quiz-choices ${numChoices === 2 ? 'choices-2' : 'choices-4'}">
          ${choices.map(c => `
            <button class="quiz-choice" data-char="${c.char}" onclick="Game.checkQuizAnswer('${c.char}', '${correct.char}', this)">
              <span class="choice-char" style="font-size: ${profile.fontSize * 0.6}px">${c.char}</span>
            </button>
          `).join('')}
        </div>
        ${profile.autoHint ? '<div class="quiz-hint" id="quiz-hint" style="display:none">💡 정답은 반짝이고 있어요!</div>' : ''}
      </div>
    `;

    // Auto hint for Sobin after 3 seconds
    if (profile.autoHint) {
      this._hintTimer = setTimeout(() => {
        const hint = document.getElementById('quiz-hint');
        if (hint) hint.style.display = 'block';
        // Highlight correct answer
        const correctBtn = document.querySelector(`[data-char="${correct.char}"]`);
        if (correctBtn) correctBtn.classList.add('hint-glow');
      }, 3000);
    }
  },

  checkQuizAnswer(selected, correct, btn) {
    clearTimeout(this._hintTimer);
    const profile = Profile.getCurrent();
    this.total++;

    const allBtns = document.querySelectorAll('.quiz-choice');

    if (selected === correct) {
      // Correct!
      btn.classList.add('correct');
      this.score++;
      Reward.addStars(profile.starsPerCorrect);
      SFX.play('correct');

      // Update progress
      const progress = Storage.getProgress(App.currentProfile);
      progress.quizCorrect = (progress.quizCorrect || 0) + 1;
      Storage.saveProgress(App.currentProfile, progress);

      allBtns.forEach(b => b.disabled = true);
      setTimeout(() => {
        this.quizIndex++;
        this.showQuizQuestion();
      }, 800);
    } else {
      // Wrong
      btn.classList.add('wrong');
      SFX.play('wrong');

      if (profile.wrongRetry) {
        // Dokyung: disable wrong, allow retry
        btn.disabled = true;
      } else {
        // Sobin: show correct immediately
        allBtns.forEach(b => {
          b.disabled = true;
          if (b.dataset.char === correct) b.classList.add('correct');
        });
        setTimeout(() => {
          this.quizIndex++;
          this.showQuizQuestion();
        }, 1200);
      }
    }
  },

  // ===== MATCHING =====
  startMatching(categoryId) {
    this.currentCategory = categoryId;
    this.items = getDataForProfile(categoryId, App.currentProfile);
    this.score = 0;
    this.matchedPairs = 0;
    this.flippedCards = [];
    this.matchingLocked = false;

    const profile = Profile.getCurrent();
    const numPairs = profile.matchingPairs;

    // Pick random items for pairs
    const selected = this._shuffle([...this.items]).slice(0, numPairs);

    // Create card pairs: char card + emoji card
    let cards = [];
    selected.forEach((item, i) => {
      cards.push({ id: `char-${i}`, pairId: i, display: item.char, type: 'char' });
      cards.push({ id: `emoji-${i}`, pairId: i, display: item.emoji, type: 'emoji' });
    });
    cards = this._shuffle(cards);
    this.matchingCards = cards;
    this.totalPairs = numPairs;

    App.navigate('game');
    this.renderMatching();
  },

  renderMatching() {
    const profile = Profile.getCurrent();
    const cols = this.totalPairs <= 2 ? 2 : 4;
    const screen = document.getElementById('screen-game');

    screen.innerHTML = `
      <div class="matching-container">
        <div class="learn-header">
          <button class="btn-back" onclick="Game.showSelection('${this.currentCategory}')">
            <span class="back-arrow">←</span>
          </button>
          <h2 class="learn-title">짝 맞추기</h2>
          <span class="game-score">⭐ ${this.score}</span>
        </div>
        <div class="matching-grid cols-${cols}" id="matching-grid">
          ${this.matchingCards.map((card, i) => `
            <button class="matching-card" data-index="${i}" data-pair="${card.pairId}" onclick="Game.flipCard(${i}, this)">
              <div class="matching-card-inner">
                <div class="matching-card-front">?</div>
                <div class="matching-card-back" style="font-size: ${card.type === 'char' ? profile.fontSize * 0.5 : 40}px">
                  ${card.display}
                </div>
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  },

  flipCard(index, btn) {
    if (this.matchingLocked) return;
    if (btn.classList.contains('flipped') || btn.classList.contains('matched')) return;

    btn.classList.add('flipped');
    SFX.play('flip');
    this.flippedCards.push({ index, btn, pairId: this.matchingCards[index].pairId });

    if (this.flippedCards.length === 2) {
      this.matchingLocked = true;
      const [a, b] = this.flippedCards;

      if (a.pairId === b.pairId) {
        // Match!
        setTimeout(() => {
          a.btn.classList.add('matched');
          b.btn.classList.add('matched');
          this.matchedPairs++;
          this.score++;
          const profile = Profile.getCurrent();
          Reward.addStars(profile.starsPerCorrect);
          SFX.play('correct');

          // Update score display
          const scoreEl = document.querySelector('.game-score');
          if (scoreEl) scoreEl.textContent = `⭐ ${this.score}`;

          this.flippedCards = [];
          this.matchingLocked = false;

          if (this.matchedPairs === this.totalPairs) {
            // All matched!
            const progress = Storage.getProgress(App.currentProfile);
            progress.matchingComplete = (progress.matchingComplete || 0) + 1;
            Storage.saveProgress(App.currentProfile, progress);
            setTimeout(() => this.showResult('matching'), 600);
          }
        }, 400);
      } else {
        // No match
        setTimeout(() => {
          a.btn.classList.remove('flipped');
          b.btn.classList.remove('flipped');
          this.flippedCards = [];
          this.matchingLocked = false;
        }, 800);
      }
    }
  },

  // ===== SOUND FIND =====
  startSound(categoryId) {
    this.currentCategory = categoryId;
    this.items = getDataForProfile(categoryId, App.currentProfile);
    this.score = 0;
    this.total = 0;
    this.soundQueue = this._shuffle([...this.items]).slice(0, Math.min(10, this.items.length));
    this.soundIndex = 0;
    App.navigate('game');
    this.showSoundQuestion();
  },

  showSoundQuestion() {
    if (this.soundIndex >= this.soundQueue.length) {
      this.showResult('sound');
      return;
    }

    const profile = Profile.getCurrent();
    const correct = this.soundQueue[this.soundIndex];
    const numChoices = profile.quizChoices;

    let choices = [correct];
    const pool = this.items.filter(i => i.char !== correct.char);
    const shuffled = this._shuffle([...pool]);
    for (let i = 0; i < numChoices - 1 && i < shuffled.length; i++) {
      choices.push(shuffled[i]);
    }
    choices = this._shuffle(choices);

    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="sound-container">
        <div class="learn-header">
          <button class="btn-back" onclick="Game.showSelection('${this.currentCategory}')">
            <span class="back-arrow">←</span>
          </button>
          <h2 class="learn-title">소리 찾기</h2>
          <span class="game-score">⭐ ${this.score}</span>
        </div>
        <div class="quiz-progress">
          <div class="quiz-progress-bar" style="width: ${(this.soundIndex / this.soundQueue.length) * 100}%"></div>
        </div>
        <div class="sound-prompt">
          <button class="btn-play-sound" onclick="Game.playSoundHint()">
            🔊<br><span class="sound-label">소리 듣기</span>
          </button>
        </div>
        <div class="quiz-choices ${numChoices === 2 ? 'choices-2' : 'choices-4'}">
          ${choices.map(c => `
            <button class="quiz-choice" data-char="${c.char}" onclick="Game.checkSoundAnswer('${c.char}', '${correct.char}', this)">
              <span class="choice-char" style="font-size: ${profile.fontSize * 0.6}px">${c.char}</span>
              <span class="choice-emoji">${c.emoji}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    // Auto play sound
    setTimeout(() => this.playSoundHint(), 500);

    // Auto hint for Sobin
    if (profile.autoHint) {
      this._hintTimer = setTimeout(() => {
        const correctBtn = document.querySelector(`[data-char="${correct.char}"]`);
        if (correctBtn) correctBtn.classList.add('hint-glow');
      }, 3000);
    }
  },

  playSoundHint() {
    const correct = this.soundQueue[this.soundIndex];
    if (this.currentCategory === 'english') {
      Speech.speakEnglish(correct.char);
    } else {
      Speech.speakKorean(correct.pronunciation);
    }
  },

  checkSoundAnswer(selected, correct, btn) {
    clearTimeout(this._hintTimer);
    const profile = Profile.getCurrent();
    this.total++;

    const allBtns = document.querySelectorAll('.quiz-choice');

    if (selected === correct) {
      btn.classList.add('correct');
      this.score++;
      Reward.addStars(profile.starsPerCorrect);
      SFX.play('correct');

      const progress = Storage.getProgress(App.currentProfile);
      progress.soundCorrect = (progress.soundCorrect || 0) + 1;
      Storage.saveProgress(App.currentProfile, progress);

      allBtns.forEach(b => b.disabled = true);
      setTimeout(() => {
        this.soundIndex++;
        this.showSoundQuestion();
      }, 800);
    } else {
      btn.classList.add('wrong');
      SFX.play('wrong');

      if (profile.wrongRetry) {
        btn.disabled = true;
      } else {
        allBtns.forEach(b => {
          b.disabled = true;
          if (b.dataset.char === correct) b.classList.add('correct');
        });
        setTimeout(() => {
          this.soundIndex++;
          this.showSoundQuestion();
        }, 1200);
      }
    }
  },

  // ===== RESULT =====
  showResult(gameType) {
    const profile = Profile.getCurrent();
    const screen = document.getElementById('screen-game');

    const messages = this.score >= this.total * 0.8
      ? ['대단해요! 🌟', '최고예요! 👑', '멋져요! ✨']
      : this.score >= this.total * 0.5
        ? ['잘했어요! 😊', '좋아요! 💪']
        : ['다시 해볼까요? 💫', '괜찮아요! 🌈'];
    const msg = messages[Math.floor(Math.random() * messages.length)];

    Reward.checkBadges();

    screen.innerHTML = `
      <div class="result-container">
        <div class="result-stars">${'⭐'.repeat(Math.min(this.score, 10))}</div>
        <h2 class="result-message">${msg}</h2>
        <div class="result-score">${this.score} / ${gameType === 'matching' ? this.totalPairs : this.total}</div>
        <div class="result-buttons">
          <button class="btn-primary" onclick="Game.restart('${gameType}')">다시 하기 🔄</button>
          <button class="btn-secondary" onclick="Game.showSelection('${this.currentCategory}')">다른 게임 🎮</button>
          <button class="btn-secondary" onclick="App.navigate('home')">홈으로 🏠</button>
        </div>
      </div>
    `;

    SFX.play('celebrate');
  },

  restart(gameType) {
    switch (gameType) {
      case 'quiz': this.startQuiz(this.currentCategory); break;
      case 'matching': this.startMatching(this.currentCategory); break;
      case 'sound': this.startSound(this.currentCategory); break;
    }
  },

  // ===== UTILS =====
  _shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },
};

// Simple SFX using Web Audio API (no external files needed)
const SFX = {
  ctx: null,

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      // Web Audio not supported
    }
  },

  play(type) {
    if (!this.ctx) return;

    // Resume context if suspended (mobile browsers require user gesture)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    const now = this.ctx.currentTime;

    switch (type) {
      case 'correct':
        osc.frequency.setValueAtTime(523, now);       // C5
        osc.frequency.setValueAtTime(659, now + 0.1); // E5
        osc.frequency.setValueAtTime(784, now + 0.2); // G5
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;

      case 'wrong':
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.setValueAtTime(180, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;

      case 'flip':
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;

      case 'celebrate':
        // Play a little celebration melody
        [523, 587, 659, 698, 784, 880, 988, 1047].forEach((freq, i) => {
          const o = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          o.connect(g);
          g.connect(this.ctx.destination);
          o.frequency.setValueAtTime(freq, now + i * 0.1);
          g.gain.setValueAtTime(0.2, now + i * 0.1);
          g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.15);
          o.start(now + i * 0.1);
          o.stop(now + i * 0.1 + 0.15);
        });
        break;

      case 'star':
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(1100, now + 0.05);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
    }
  },
};
