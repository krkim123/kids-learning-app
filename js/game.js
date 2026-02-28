// 5 game modes: Quiz, Matching, Sound-Find, Tracing, Counting

const Game = {
  currentGame: null,
  currentCategory: null,
  items: [],
  score: 0,
  total: 0,

  showSelection(categoryId) {
    this.currentCategory = categoryId;
    const cat = CATEGORIES[categoryId];
    const profile = Profile.getCurrent();
    const screen = document.getElementById('screen-game-select');

    screen.innerHTML = `
      <div class="game-select-container">
        <div class="learn-header">
          <button class="btn-back" onclick="Learn.showStages('${categoryId}')">
            <span class="back-arrow">&larr;</span>
          </button>
          <h2 class="learn-title">${cat.icon} ${cat.name} 게임</h2>
          <span></span>
        </div>
        <div class="game-mode-cards">
          <button class="game-mode-card" onclick="Game.startQuiz('${categoryId}')">
            <div class="game-mode-icon">❓</div>
            <div>
              <div class="game-mode-name">글자 맞추기</div>
              <div class="game-mode-desc">그림 보고 글자 고르기</div>
            </div>
          </button>
          <button class="game-mode-card" onclick="Game.startMatching('${categoryId}')">
            <div class="game-mode-icon">🃏</div>
            <div>
              <div class="game-mode-name">짝 맞추기</div>
              <div class="game-mode-desc">카드 뒤집어서 짝 찾기</div>
            </div>
          </button>
          <button class="game-mode-card" onclick="Game.startSound('${categoryId}')">
            <div class="game-mode-icon">🔊</div>
            <div>
              <div class="game-mode-name">소리 찾기</div>
              <div class="game-mode-desc">소리 듣고 글자 찾기</div>
            </div>
          </button>
          <button class="game-mode-card" onclick="Game.startTracing('${categoryId}')">
            <div class="game-mode-icon">✏️</div>
            <div>
              <div class="game-mode-name">따라쓰기</div>
              <div class="game-mode-desc">손가락으로 글자 따라 그리기</div>
            </div>
          </button>
          ${categoryId === 'number' ? `
            <button class="game-mode-card" onclick="Game.startCounting()">
              <div class="game-mode-icon">🔢</div>
              <div>
                <div class="game-mode-name">숫자 세기</div>
                <div class="game-mode-desc">이모지 세고 숫자 맞추기</div>
              </div>
            </button>
          ` : ''}
        </div>
      </div>
    `;
    App.showScreen('game-select');
  },

  // ===== QUIZ =====
  startQuiz(categoryId) {
    this.currentCategory = categoryId;
    this.items = getAllCategoryItems(categoryId);
    this.score = 0;
    this.total = 0;
    this.quizQueue = this._shuffle([...this.items]).slice(0, Math.min(10, this.items.length));
    this.quizIndex = 0;
    this.showQuizQuestion();
  },

  showQuizQuestion() {
    if (this.quizIndex >= this.quizQueue.length) { this.showResult('quiz'); return; }
    const profile = Profile.getCurrent();
    const correct = this.quizQueue[this.quizIndex];
    const numChoices = profile.quizChoices;
    let choices = [correct];
    const pool = this.items.filter(i => i.char !== correct.char);
    const shuffled = this._shuffle([...pool]);
    for (let i = 0; i < numChoices - 1 && i < shuffled.length; i++) choices.push(shuffled[i]);
    choices = this._shuffle(choices);

    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="quiz-container">
        <div class="learn-header">
          <button class="btn-back" onclick="Game.showSelection('${this.currentCategory}')">
            <span class="back-arrow">&larr;</span>
          </button>
          <h2 class="learn-title">글자 맞추기</h2>
          <span class="game-score">⭐ ${this.score}</span>
        </div>
        <div class="quiz-progress">
          <div class="quiz-progress-bar" style="width:${(this.quizIndex/this.quizQueue.length)*100}%"></div>
        </div>
        <div class="quiz-question">
          <div class="quiz-emoji">${correct.emoji}</div>
          <div class="quiz-word">${correct.word}</div>
        </div>
        <div class="quiz-choices ${numChoices===2?'choices-2':'choices-4'}">
          ${choices.map(c => `
            <button class="quiz-choice" data-char="${c.char}" onclick="Game.checkQuizAnswer('${c.char.replace(/'/g,"\\'")}','${correct.char.replace(/'/g,"\\'")}',this)">
              <span class="choice-char" style="font-size:${profile.fontSize*0.6}px">${c.char}</span>
            </button>
          `).join('')}
        </div>
        ${profile.autoHint ? '<div class="quiz-hint" id="quiz-hint" style="display:none">💡 반짝이는 것이 정답이에요!</div>' : ''}
      </div>
    `;
    App.showScreen('game');

    if (profile.autoHint) {
      this._hintTimer = setTimeout(() => {
        const hint = document.getElementById('quiz-hint');
        if (hint) hint.style.display = 'block';
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
      btn.classList.add('correct');
      this.score++;
      Reward.addStars(profile.starsPerCorrect);
      SFX.play('correct');
      const progress = Storage.getProgress(App.currentProfile);
      progress.quizCorrect = (progress.quizCorrect || 0) + 1;
      progress.xp = (progress.xp || 0) + profile.xpPerGame;
      Storage.saveProgress(App.currentProfile, progress);
      Daily.updateMissionProgress('quiz');
      allBtns.forEach(b => b.disabled = true);
      setTimeout(() => { this.quizIndex++; this.showQuizQuestion(); }, 800);
    } else {
      btn.classList.add('wrong'); SFX.play('wrong');
      if (profile.wrongRetry) { btn.disabled = true; }
      else {
        allBtns.forEach(b => { b.disabled = true; if (b.dataset.char === correct) b.classList.add('correct'); });
        setTimeout(() => { this.quizIndex++; this.showQuizQuestion(); }, 1200);
      }
    }
  },

  // ===== MATCHING =====
  startMatching(categoryId) {
    this.currentCategory = categoryId;
    this.items = getAllCategoryItems(categoryId);
    this.score = 0; this.matchedPairs = 0; this.flippedCards = []; this.matchingLocked = false;
    const profile = Profile.getCurrent();
    const numPairs = profile.matchingPairs;
    const selected = this._shuffle([...this.items]).slice(0, numPairs);
    let cards = [];
    selected.forEach((item, i) => {
      cards.push({ id: `char-${i}`, pairId: i, display: item.char, type: 'char' });
      cards.push({ id: `emoji-${i}`, pairId: i, display: item.emoji, type: 'emoji' });
    });
    cards = this._shuffle(cards);
    this.matchingCards = cards;
    this.totalPairs = numPairs;
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
            <span class="back-arrow">&larr;</span>
          </button>
          <h2 class="learn-title">짝 맞추기</h2>
          <span class="game-score">⭐ ${this.score}</span>
        </div>
        <div class="matching-grid cols-${cols}" id="matching-grid">
          ${this.matchingCards.map((card, i) => `
            <button class="matching-card" data-index="${i}" data-pair="${card.pairId}" onclick="Game.flipCard(${i},this)">
              <div class="matching-card-inner">
                <div class="matching-card-front">?</div>
                <div class="matching-card-back" style="font-size:${card.type==='char'?profile.fontSize*0.5:40}px">${card.display}</div>
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    App.showScreen('game');
  },

  flipCard(index, btn) {
    if (this.matchingLocked || btn.classList.contains('flipped') || btn.classList.contains('matched')) return;
    btn.classList.add('flipped'); SFX.play('flip');
    this.flippedCards.push({ index, btn, pairId: this.matchingCards[index].pairId });
    if (this.flippedCards.length === 2) {
      this.matchingLocked = true;
      const [a, b] = this.flippedCards;
      if (a.pairId === b.pairId) {
        setTimeout(() => {
          a.btn.classList.add('matched'); b.btn.classList.add('matched');
          this.matchedPairs++; this.score++;
          Reward.addStars(Profile.getCurrent().starsPerCorrect);
          SFX.play('correct');
          const scoreEl = document.querySelector('.game-score');
          if (scoreEl) scoreEl.textContent = `⭐ ${this.score}`;
          this.flippedCards = []; this.matchingLocked = false;
          if (this.matchedPairs === this.totalPairs) {
            const progress = Storage.getProgress(App.currentProfile);
            progress.matchingComplete = (progress.matchingComplete || 0) + 1;
            progress.xp = (progress.xp || 0) + Profile.getCurrent().xpPerGame;
            Storage.saveProgress(App.currentProfile, progress);
            Daily.updateMissionProgress('matching');
            setTimeout(() => this.showResult('matching'), 600);
          }
        }, 400);
      } else {
        setTimeout(() => {
          a.btn.classList.remove('flipped'); b.btn.classList.remove('flipped');
          this.flippedCards = []; this.matchingLocked = false;
        }, 800);
      }
    }
  },

  // ===== SOUND FIND =====
  startSound(categoryId) {
    this.currentCategory = categoryId;
    this.items = getAllCategoryItems(categoryId);
    this.score = 0; this.total = 0;
    this.soundQueue = this._shuffle([...this.items]).slice(0, Math.min(10, this.items.length));
    this.soundIndex = 0;
    this.showSoundQuestion();
  },

  showSoundQuestion() {
    if (this.soundIndex >= this.soundQueue.length) { this.showResult('sound'); return; }
    const profile = Profile.getCurrent();
    const correct = this.soundQueue[this.soundIndex];
    const numChoices = profile.quizChoices;
    let choices = [correct];
    const pool = this.items.filter(i => i.char !== correct.char);
    const shuffled = this._shuffle([...pool]);
    for (let i = 0; i < numChoices - 1 && i < shuffled.length; i++) choices.push(shuffled[i]);
    choices = this._shuffle(choices);

    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="sound-container">
        <div class="learn-header">
          <button class="btn-back" onclick="Game.showSelection('${this.currentCategory}')">
            <span class="back-arrow">&larr;</span>
          </button>
          <h2 class="learn-title">소리 찾기</h2>
          <span class="game-score">⭐ ${this.score}</span>
        </div>
        <div class="quiz-progress">
          <div class="quiz-progress-bar" style="width:${(this.soundIndex/this.soundQueue.length)*100}%"></div>
        </div>
        <div class="sound-prompt">
          <button class="btn-play-sound" onclick="Game.playSoundHint()">
            🔊<br><span class="sound-label">소리 듣기</span>
          </button>
        </div>
        <div class="quiz-choices ${numChoices===2?'choices-2':'choices-4'}">
          ${choices.map(c => `
            <button class="quiz-choice" data-char="${c.char}" onclick="Game.checkSoundAnswer('${c.char.replace(/'/g,"\\'")}','${correct.char.replace(/'/g,"\\'")}',this)">
              <span class="choice-char" style="font-size:${profile.fontSize*0.6}px">${c.char}</span>
              <span class="choice-emoji">${c.emoji}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    App.showScreen('game');
    setTimeout(() => this.playSoundHint(), 500);
    if (profile.autoHint) {
      this._hintTimer = setTimeout(() => {
        const correctBtn = document.querySelector(`[data-char="${correct.char}"]`);
        if (correctBtn) correctBtn.classList.add('hint-glow');
      }, 3000);
    }
  },

  playSoundHint() {
    const correct = this.soundQueue[this.soundIndex];
    if (this.currentCategory === 'english') Speech.speakEnglish(correct.char);
    else Speech.speakKorean(correct.pronunciation);
  },

  checkSoundAnswer(selected, correct, btn) {
    clearTimeout(this._hintTimer);
    const profile = Profile.getCurrent();
    this.total++;
    const allBtns = document.querySelectorAll('.quiz-choice');
    if (selected === correct) {
      btn.classList.add('correct'); this.score++;
      Reward.addStars(profile.starsPerCorrect); SFX.play('correct');
      const progress = Storage.getProgress(App.currentProfile);
      progress.soundCorrect = (progress.soundCorrect || 0) + 1;
      progress.xp = (progress.xp || 0) + profile.xpPerGame;
      Storage.saveProgress(App.currentProfile, progress);
      allBtns.forEach(b => b.disabled = true);
      setTimeout(() => { this.soundIndex++; this.showSoundQuestion(); }, 800);
    } else {
      btn.classList.add('wrong'); SFX.play('wrong');
      if (profile.wrongRetry) { btn.disabled = true; }
      else {
        allBtns.forEach(b => { b.disabled = true; if (b.dataset.char === correct) b.classList.add('correct'); });
        setTimeout(() => { this.soundIndex++; this.showSoundQuestion(); }, 1200);
      }
    }
  },

  // ===== TRACING (Canvas) =====
  tracingQueue: [],
  tracingIndex: 0,
  tracingCanvas: null,
  tracingCtx: null,
  isDrawing: false,
  tracingPoints: [],

  startTracing(categoryId) {
    this.currentCategory = categoryId;
    const chars = TRACING_CHARS[categoryId] || [];
    this.tracingQueue = this._shuffle([...chars]).slice(0, Math.min(5, chars.length));
    this.tracingIndex = 0;
    this.score = 0;
    this.showTracingChar();
  },

  showTracingChar() {
    if (this.tracingIndex >= this.tracingQueue.length) { this.showResult('tracing'); return; }
    const char = this.tracingQueue[this.tracingIndex];
    const profile = Profile.getCurrent();
    const screen = document.getElementById('screen-game');

    screen.innerHTML = `
      <div class="tracing-container">
        <div class="learn-header">
          <button class="btn-back" onclick="Game.showSelection('${this.currentCategory}')">
            <span class="back-arrow">&larr;</span>
          </button>
          <h2 class="learn-title">따라쓰기</h2>
          <span class="game-score">⭐ ${this.score} | ${this.tracingIndex+1}/${this.tracingQueue.length}</span>
        </div>
        <div class="tracing-area">
          <div class="tracing-char-bg" id="tracing-char-bg">${char}</div>
          <canvas id="tracing-canvas" width="300" height="300"></canvas>
        </div>
        <div class="tracing-buttons">
          <button class="btn-secondary" onclick="Game.clearTracing()">지우기 🗑️</button>
          <button class="btn-primary" onclick="Game.checkTracing()">완성! ✨</button>
        </div>
      </div>
    `;
    App.showScreen('game');

    // Setup canvas
    setTimeout(() => {
      const canvas = document.getElementById('tracing-canvas');
      if (!canvas) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = Math.min(rect.width, 300);
      canvas.height = Math.min(rect.width, 300);
      this.tracingCanvas = canvas;
      this.tracingCtx = canvas.getContext('2d');
      this.tracingCtx.strokeStyle = profile.theme === 'blue' ? '#42A5F5' :
        (profile.theme === 'green' ? '#66BB6A' :
        (profile.theme === 'purple' ? '#AB47BC' : '#FF69B4'));
      this.tracingCtx.lineWidth = profile.ageGroup === 'toddler' ? 12 : 8;
      this.tracingCtx.lineCap = 'round';
      this.tracingCtx.lineJoin = 'round';
      this.tracingPoints = [];
      this.isDrawing = false;

      canvas.addEventListener('mousedown', (e) => this.tracingStart(e));
      canvas.addEventListener('mousemove', (e) => this.tracingMove(e));
      canvas.addEventListener('mouseup', () => this.tracingEnd());
      canvas.addEventListener('touchstart', (e) => { e.preventDefault(); this.tracingStart(e.touches[0]); }, { passive: false });
      canvas.addEventListener('touchmove', (e) => { e.preventDefault(); this.tracingMove(e.touches[0]); }, { passive: false });
      canvas.addEventListener('touchend', () => this.tracingEnd());
    }, 100);
  },

  tracingStart(e) {
    this.isDrawing = true;
    const pos = this.getCanvasPos(e);
    this.tracingCtx.beginPath();
    this.tracingCtx.moveTo(pos.x, pos.y);
    this.tracingPoints.push(pos);
  },

  tracingMove(e) {
    if (!this.isDrawing) return;
    const pos = this.getCanvasPos(e);
    this.tracingCtx.lineTo(pos.x, pos.y);
    this.tracingCtx.stroke();
    this.tracingPoints.push(pos);
  },

  tracingEnd() {
    this.isDrawing = false;
  },

  getCanvasPos(e) {
    const rect = this.tracingCanvas.getBoundingClientRect();
    return {
      x: (e.clientX || e.pageX) - rect.left,
      y: (e.clientY || e.pageY) - rect.top
    };
  },

  clearTracing() {
    if (this.tracingCtx) {
      this.tracingCtx.clearRect(0, 0, this.tracingCanvas.width, this.tracingCanvas.height);
      this.tracingPoints = [];
    }
  },

  checkTracing() {
    // Simple check: if user drew enough points, consider it done
    const ageGroup = Profile.getCurrent().ageGroup;
    const minPoints = ageGroup === 'toddler' ? 15 : (ageGroup === 'child' ? 30 : 40);
    if (this.tracingPoints.length >= minPoints) {
      this.score++;
      Reward.addStars(Profile.getCurrent().starsPerCorrect);
      SFX.play('correct');

      const progress = Storage.getProgress(App.currentProfile);
      progress.tracingComplete = (progress.tracingComplete || 0) + 1;
      progress.xp = (progress.xp || 0) + Profile.getCurrent().xpPerGame;
      Storage.saveProgress(App.currentProfile, progress);
      Daily.updateMissionProgress('tracing');

      // Show success animation
      const area = document.querySelector('.tracing-area');
      if (area) area.classList.add('tracing-success');

      setTimeout(() => {
        this.tracingIndex++;
        this.showTracingChar();
      }, 1000);
    } else {
      // Not enough — encourage
      SFX.play('wrong');
      const area = document.querySelector('.tracing-area');
      if (area) {
        area.classList.add('tracing-shake');
        setTimeout(() => area.classList.remove('tracing-shake'), 500);
      }
    }
  },

  // ===== COUNTING =====
  countingQueue: [],
  countingIndex: 0,
  countedItems: 0,

  startCounting() {
    this.currentCategory = 'number';
    const profile = Profile.getCurrent();
    const max = profile.countingMax;
    this.score = 0; this.total = 0;
    this.countingQueue = [];
    for (let i = 0; i < 8; i++) {
      const count = Math.floor(Math.random() * max) + 1;
      const emoji = COUNTING_EMOJIS[Math.floor(Math.random() * COUNTING_EMOJIS.length)];
      this.countingQueue.push({ count, emoji });
    }
    this.countingIndex = 0;
    this.showCountingQuestion();
  },

  showCountingQuestion() {
    if (this.countingIndex >= this.countingQueue.length) { this.showResult('counting'); return; }
    const profile = Profile.getCurrent();
    const q = this.countingQueue[this.countingIndex];
    this.countedItems = 0;

    // Generate random positions for emojis
    const positions = [];
    for (let i = 0; i < q.count; i++) {
      positions.push({
        left: 15 + Math.random() * 65,
        top: 10 + Math.random() * 60,
      });
    }

    // Generate answer choices
    const max = profile.countingMax;
    let choices = [q.count];
    while (choices.length < Math.min(profile.quizChoices, max)) {
      const n = Math.floor(Math.random() * max) + 1;
      if (!choices.includes(n)) choices.push(n);
    }
    choices = this._shuffle(choices);

    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="counting-container">
        <div class="learn-header">
          <button class="btn-back" onclick="Game.showSelection('number')">
            <span class="back-arrow">&larr;</span>
          </button>
          <h2 class="learn-title">숫자 세기</h2>
          <span class="game-score">⭐ ${this.score} | ${this.countingIndex+1}/${this.countingQueue.length}</span>
        </div>
        <div class="counting-question">몇 개일까?</div>
        <div class="counting-emoji-area" id="counting-area">
          ${positions.map((pos, i) => `
            <span class="counting-emoji" id="ce-${i}"
                  style="left:${pos.left}%;top:${pos.top}%"
                  onclick="Game.countItem(${i})">${q.emoji}</span>
          `).join('')}
          <div class="counting-counter" id="counting-counter">0</div>
        </div>
        <div class="counting-choices">
          ${choices.map(n => `
            <button class="counting-choice" onclick="Game.checkCounting(${n},${q.count},this)">
              ${n}
            </button>
          `).join('')}
        </div>
      </div>
    `;
    App.showScreen('game');
  },

  countItem(index) {
    const el = document.getElementById(`ce-${index}`);
    if (!el || el.classList.contains('counted')) return;
    el.classList.add('counted');
    this.countedItems++;
    const counter = document.getElementById('counting-counter');
    if (counter) counter.textContent = this.countedItems;
    SFX.play('flip');
  },

  checkCounting(selected, correct, btn) {
    this.total++;
    const allBtns = document.querySelectorAll('.counting-choice');
    if (selected === correct) {
      btn.classList.add('correct');
      this.score++;
      Reward.addStars(Profile.getCurrent().starsPerCorrect);
      SFX.play('correct');
      const progress = Storage.getProgress(App.currentProfile);
      progress.countingCorrect = (progress.countingCorrect || 0) + 1;
      progress.xp = (progress.xp || 0) + Profile.getCurrent().xpPerGame;
      Storage.saveProgress(App.currentProfile, progress);
      Daily.updateMissionProgress('counting');
      allBtns.forEach(b => b.disabled = true);
      setTimeout(() => { this.countingIndex++; this.showCountingQuestion(); }, 800);
    } else {
      btn.classList.add('wrong'); SFX.play('wrong');
      if (Profile.getCurrent().wrongRetry) { btn.disabled = true; }
      else {
        allBtns.forEach(b => { b.disabled = true; if (parseInt(b.textContent) === correct) b.classList.add('correct'); });
        setTimeout(() => { this.countingIndex++; this.showCountingQuestion(); }, 1200);
      }
    }
  },

  // ===== RESULT =====
  showResult(gameType) {
    const profile = Profile.getCurrent();
    const totalDisplay = gameType === 'matching' ? this.totalPairs : (gameType === 'tracing' ? this.tracingQueue.length : this.total);
    const messages = this.score >= totalDisplay * 0.8
      ? ['대단해요! 🌟', '최고예요! 👑', '멋져요! ✨']
      : this.score >= totalDisplay * 0.5
        ? ['잘했어요! 😊', '좋아요! 💪']
        : ['다시 해볼까요? 💫', '괜찮아요! 🌈'];
    const msg = messages[Math.floor(Math.random() * messages.length)];
    Reward.checkBadges();

    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="result-container">
        <div class="result-stars">${'⭐'.repeat(Math.min(this.score, 10))}</div>
        <h2 class="result-message">${msg}</h2>
        <div class="result-score">${this.score} / ${totalDisplay}</div>
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
      case 'tracing': this.startTracing(this.currentCategory); break;
      case 'counting': this.startCounting(); break;
    }
  },

  _shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },
};

// Simple SFX using Web Audio API
const SFX = {
  ctx: null,
  init() {
    try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch {}
  },
  play(type) {
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain); gain.connect(this.ctx.destination);
    const now = this.ctx.currentTime;
    switch (type) {
      case 'correct':
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.1);
        osc.frequency.setValueAtTime(784, now + 0.2);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now); osc.stop(now + 0.4); break;
      case 'wrong':
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.setValueAtTime(180, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now); osc.stop(now + 0.3); break;
      case 'flip':
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now); osc.stop(now + 0.1); break;
      case 'celebrate':
        [523,587,659,698,784,880,988,1047].forEach((freq, i) => {
          const o = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          o.connect(g); g.connect(this.ctx.destination);
          o.frequency.setValueAtTime(freq, now + i * 0.1);
          g.gain.setValueAtTime(0.2, now + i * 0.1);
          g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.15);
          o.start(now + i * 0.1); o.stop(now + i * 0.1 + 0.15);
        }); break;
      case 'star':
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(1100, now + 0.05);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now); osc.stop(now + 0.2); break;
      case 'levelup':
        [523,659,784,1047,784,1047,1319].forEach((freq, i) => {
          const o = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          o.connect(g); g.connect(this.ctx.destination);
          o.frequency.setValueAtTime(freq, now + i * 0.15);
          g.gain.setValueAtTime(0.25, now + i * 0.15);
          g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.2);
          o.start(now + i * 0.15); o.stop(now + i * 0.15 + 0.2);
        }); break;
    }
  },
};
