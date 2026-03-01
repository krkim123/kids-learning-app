// Game modes: Quiz, Matching, Sound-Find, Tracing, Counting, 2.5D Tower

const COUNTING_BUDDIES = Object.freeze([
  {
    emoji: '🦄',
    name: '유니',
    cheers: ['유니랑 같이 세어 보자!', '천천히 하나씩 세면 쉬워!'],
  },
  {
    emoji: '🧸',
    name: '몽실이',
    cheers: ['몽실이가 응원할게!', '귀여운 친구들 몇 명인지 세어 볼까?'],
  },
  {
    emoji: '🐰',
    name: '토리',
    cheers: ['토리랑 또박또박 숫자 놀이하자!', '작은 목소리로 하나, 둘, 셋!'],
  },
  {
    emoji: '🐼',
    name: '콩이',
    cheers: ['콩이랑 함께 정답 찾자!', '잘 보고 차근차근 세어 보자!'],
  },
]);

const COUNTING_SCENES = Object.freeze([
  { id: 'forest-friends', title: '숲속 동물 친구들', icons: ['🐰', '🦊', '🦔', '🐿️', '🦉', '🐻', '🦝', '🦌'] },
  { id: 'ocean-friends', title: '바다 친구들', icons: ['🐠', '🐡', '🐬', '🐳', '🦀', '🐙', '🦑', '🪼'] },
  { id: 'fruit-basket', title: '과일 바구니', icons: ['🍎', '🍌', '🍇', '🍓', '🍊', '🍉', '🥝', '🍒'] },
  { id: 'toy-box', title: '장난감 상자', icons: ['🧸', '🪀', '🪁', '🧩', '🚗', '🚂', '🪅', '🎈'] },
  { id: 'space-trip', title: '우주 탐험대', icons: ['🚀', '🛸', '🪐', '⭐', '☄️', '🌙', '🛰️', '🌌'] },
  { id: 'garden-day', title: '정원 산책', icons: ['🌸', '🌼', '🌻', '🌷', '🦋', '🐞', '🌿', '🍀'] },
  { id: 'food-party', title: '간식 파티', icons: ['🍩', '🧁', '🍪', '🍭', '🍦', '🥨', '🍿', '🍫'] },
  { id: 'city-ride', title: '탈것 모험', icons: ['🚗', '🚌', '🚕', '🚒', '🚲', '🚄', '🚁', '🚢'] },
  { id: 'dino-zone', title: '공룡 탐험', icons: ['🦕', '🦖', '🌋', '🪨', '🌴', '🥚', '🦴', '🌈'] },
  { id: 'music-band', title: '음악 밴드', icons: ['🎵', '🎶', '🥁', '🎷', '🎸', '🎹', '🎺', '🎤'] },
  { id: 'weather-show', title: '날씨 극장', icons: ['☀️', '🌤️', '⛅', '🌧️', '⛈️', '🌈', '❄️', '💨'] },
  { id: 'farm-day', title: '농장 하루', icons: ['🐮', '🐷', '🐔', '🐑', '🐴', '🌾', '🥕', '🚜'] },
  { id: 'book-world', title: '동화책 나라', icons: ['📚', '📖', '🏰', '🧙', '🧚', '🛡️', '🧵', '🕯️'] },
  { id: 'sports-festa', title: '운동회 날', icons: ['⚽', '🏀', '🏐', '🎾', '🏸', '🥎', '🏓', '🏅'] },
  { id: 'kitchen-lab', title: '요리 실험실', icons: ['🍳', '🥣', '🥞', '🍝', '🍕', '🍱', '🥗', '🥛'] },
  { id: 'treasure-hunt', title: '보물찾기', icons: ['🗺️', '🧭', '🪙', '💎', '🔑', '📦', '🏝️', '⚓'] },
]);

const SHAPE_3D_LIBRARY = Object.freeze([
  {
    id: 'cube',
    name: '정육면체',
    emoji: '🧊',
    clue: '모든 면이 같은 정사각형 6개',
    netHint: '정사각형 6개가 십자 형태로 펼쳐짐',
    netVisual: '⬜⬜⬜\n  ⬜\n  ⬜',
  },
  {
    id: 'rect-prism',
    name: '직육면체',
    emoji: '📦',
    clue: '마주 보는 면의 크기가 같은 직사각형 6개',
    netHint: '직사각형 6개, 긴 면/짧은 면 조합',
    netVisual: '▭▭▭\n  ▭\n  ▭',
  },
  {
    id: 'cylinder',
    name: '원기둥',
    emoji: '🥫',
    clue: '윗면/아랫면은 원, 옆면은 직사각형',
    netHint: '원 2개 + 직사각형 1개',
    netVisual: '◯ ▭ ◯',
  },
  {
    id: 'cone',
    name: '원뿔',
    emoji: '🍦',
    clue: '밑면은 원, 옆면은 꼭짓점으로 모임',
    netHint: '원 1개 + 부채꼴 1개',
    netVisual: '◯ + ◔',
  },
  {
    id: 'sphere',
    name: '구',
    emoji: '⚽',
    clue: '모든 방향으로 둥글고 모서리가 없음',
    netHint: '전개도 없이 하나의 곡면',
    netVisual: '◯',
  },
  {
    id: 'tri-prism',
    name: '삼각기둥',
    emoji: '⛺',
    clue: '삼각형 2개와 직사각형 3개로 구성',
    netHint: '삼각형 2개 + 직사각형 3개',
    netVisual: '△ ▭ ▭ ▭ △',
  },
  {
    id: 'square-pyramid',
    name: '사각뿔',
    emoji: '🔺',
    clue: '밑면은 정사각형, 옆면은 삼각형 4개',
    netHint: '정사각형 1개 + 삼각형 4개',
    netVisual: '  △\n△ ◻ △\n  △',
  },
]);

const SHAPE_LAB_PIECES = Object.freeze({
  square: { id: 'square', name: '네모', icon: '🟦' },
  rect: { id: 'rect', name: '긴네모', icon: '🟪' },
  triangle: { id: 'triangle', name: '세모', icon: '🔺' },
  circle: { id: 'circle', name: '동그라미', icon: '🟠' },
});

const SHAPE_LAB_TARGETS = Object.freeze([
  { id: 'house', name: '집', visual: '🏠', recipe: { triangle: 1, square: 1 } },
  { id: 'rocket', name: '로켓', visual: '🚀', recipe: { triangle: 1, rect: 1, circle: 1 } },
  { id: 'car', name: '자동차', visual: '🚗', recipe: { rect: 1, square: 1, circle: 2 } },
  { id: 'tree', name: '나무', visual: '🌳', recipe: { triangle: 2, rect: 1 } },
  { id: 'boat', name: '배', visual: '⛵', recipe: { triangle: 1, rect: 1 } },
  { id: 'robot', name: '로봇', visual: '🤖', recipe: { square: 1, rect: 1, circle: 2 } },
  { id: 'icecream', name: '아이스크림', visual: '🍦', recipe: { triangle: 1, circle: 1 } },
  { id: 'castle', name: '성', visual: '🏰', recipe: { square: 2, triangle: 2, rect: 1 } },
]);

const Game = {
  currentGame: null,
  currentCategory: null,
  items: [],
  score: 0,
  total: 0,
  quizGameType: 'quiz',
  mathQuestionMode: null,
  timers: new Set(),
  choiceEls: [],
  choiceByChar: new Map(),
  towerChoiceEls: [],
  tracingRect: null,
  tracingRaf: 0,
  tracingPendingPoint: null,
  tracingPointCount: 0,

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
    if (this._hintTimer) clearTimeout(this._hintTimer);
    this._hintTimer = null;
    if (this.tracingRaf) {
      cancelAnimationFrame(this.tracingRaf);
      this.tracingRaf = 0;
    }
  },

  showSelection(categoryId) {
    this.clearTimers();
    this.currentCategory = categoryId;
    const cat = CATEGORIES[categoryId];
    const profile = Profile.getCurrent();
    const screen = document.getElementById('screen-game-select');

    if (categoryId === 'math') {
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
            <button class="game-mode-card" onclick="Game.startQuiz('math')">
              <div class="game-mode-icon">+</div>
              <div>
                <div class="game-mode-name">연산 퀴즈</div>
                <div class="game-mode-desc">덧셈, 뺄셈, 곱셈, 나눗셈 문제 풀기</div>
              </div>
            </button>
            <button class="game-mode-card" onclick="Game.startTimesTableQuiz()">
              <div class="game-mode-icon">9×9</div>
              <div>
                <div class="game-mode-name">구구단 퀴즈</div>
                <div class="game-mode-desc">2단부터 9단까지 빠르게 연습하기</div>
              </div>
            </button>
            <button class="game-mode-card" onclick="Game.startTracing('math')">
              <div class="game-mode-icon">✏️</div>
              <div>
                <div class="game-mode-name">수식 따라쓰기</div>
                <div class="game-mode-desc">숫자와 기호를 손으로 써보기</div>
              </div>
            </button>
            <button class="game-mode-card" onclick="Game.startShape3DMatch()">
              <div class="game-mode-icon">🧊</div>
              <div>
                <div class="game-mode-name">3D 도형 맞추기</div>
                <div class="game-mode-desc">입체도형 특징을 보고 정답 고르기</div>
              </div>
            </button>
            <button class="game-mode-card" onclick="Game.startShapeNetLab()">
              <div class="game-mode-icon">🧩</div>
              <div>
                <div class="game-mode-name">3D 모형 해석</div>
                <div class="game-mode-desc">전개도 힌트로 입체도형 추론하기</div>
              </div>
            </button>
            <button class="game-mode-card" onclick="Game.startShapeBuilderLab()">
              <div class="game-mode-icon">🧱</div>
              <div>
                <div class="game-mode-name">도형 만들기 랩</div>
                <div class="game-mode-desc">조각을 조합해 목표 도형을 완성해요</div>
              </div>
            </button>
          </div>
        </div>
      `;
      App.showScreen('game-select');
      return;
    }

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
          <button class="game-mode-card" onclick="Game.startSkyTower('${categoryId}')">
            <div class="game-mode-icon">🏗️</div>
            <div>
              <div class="game-mode-name">2.5D 스카이 타워</div>
              <div class="game-mode-desc">${categoryId === 'number' ? '숫자/연산 정답으로 타워 쌓기' : (categoryId === 'english' ? '영어 글자 정답으로 타워 쌓기' : '한글 글자 정답으로 타워 쌓기')}</div>
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
    this.clearTimers();
    if (categoryId === 'math') {
      this.startMathQuiz('mixed');
      return;
    }

    this.currentCategory = categoryId;
    this.items = getAllCategoryItems(categoryId);
    this.score = 0;
    this.total = 0;
    this.quizGameType = 'quiz';
    this.mathQuestionMode = null;
    this.quizQueue = this._shuffle([...this.items]).slice(0, Math.min(10, this.items.length));
    this.quizIndex = 0;
    this.showQuizQuestion();
  },

  startTimesTableQuiz() {
    this.startMathQuiz('times');
  },

  startMathQuiz(mode = 'mixed') {
    this.clearTimers();
    this.currentCategory = 'math';
    this.score = 0;
    this.total = 0;
    this.quizGameType = mode === 'times' ? 'times' : 'quiz';
    this.mathQuestionMode = mode;
    this.quizQueue = Array.from({ length: 10 }, () => this.generateMathQuestion(mode));
    this.quizIndex = 0;
    this.showQuizQuestion();
  },

  generateMathQuestion(mode = 'mixed') {
    const profile = Profile.getCurrent();
    const ageGroup = profile.ageGroup;
    const opPool = mode === 'times'
      ? ['times']
      : (ageGroup === 'older'
        ? ['add', 'sub', 'mul', 'div', 'times']
        : (ageGroup === 'child' ? ['add', 'sub', 'mul', 'times'] : ['add', 'sub', 'times']));
    const op = opPool[Math.floor(Math.random() * opPool.length)];

    let a = 1;
    let b = 1;
    let answer = 1;
    let symbol = '+';
    let speakWord = '더하기';
    let emoji = '➕';

    if (op === 'add') {
      const max = ageGroup === 'older' ? 30 : (ageGroup === 'child' ? 20 : 10);
      a = Math.floor(Math.random() * max) + 1;
      b = Math.floor(Math.random() * max) + 1;
      answer = a + b;
      symbol = '+';
      speakWord = '더하기';
      emoji = '➕';
    } else if (op === 'sub') {
      const max = ageGroup === 'older' ? 30 : (ageGroup === 'child' ? 20 : 10);
      a = Math.floor(Math.random() * max) + 1;
      b = Math.floor(Math.random() * a) + 1;
      answer = a - b;
      symbol = '-';
      speakWord = '빼기';
      emoji = '➖';
    } else if (op === 'mul' || op === 'times') {
      const danMax = ageGroup === 'toddler' ? 5 : 9;
      a = Math.floor(Math.random() * (danMax - 1)) + 2;
      b = Math.floor(Math.random() * (ageGroup === 'older' ? 9 : 6)) + 1;
      answer = a * b;
      symbol = '×';
      speakWord = '곱하기';
      emoji = op === 'times' ? '🔢' : '✖️';
    } else {
      const divisorMax = ageGroup === 'older' ? 12 : (ageGroup === 'child' ? 9 : 5);
      b = Math.floor(Math.random() * (divisorMax - 1)) + 2;
      answer = Math.floor(Math.random() * (ageGroup === 'older' ? 12 : 9)) + 1;
      a = b * answer;
      symbol = '÷';
      speakWord = '나누기';
      emoji = '➗';
    }

    return {
      id: `mathq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      char: String(answer),
      word: `${a} ${symbol} ${b}`,
      emoji,
      pronunciation: `${a} ${speakWord} ${b}`,
      wordPronunciation: String(answer),
    };
  },

  buildMathChoices(correct, numChoices) {
    const answer = Number(correct.char);
    const choices = new Set([answer]);
    const maxChoice = this.mathQuestionMode === 'times' ? 81 : 99;
    const spread = this.mathQuestionMode === 'times' ? 10 : 7;

    while (choices.size < numChoices) {
      let candidate = answer + Math.floor(Math.random() * (spread * 2 + 1)) - spread;
      if (candidate < 0 || candidate > maxChoice) {
        candidate = Math.floor(Math.random() * (maxChoice + 1));
      }
      choices.add(candidate);
    }

    return this._shuffle(Array.from(choices).map(n => ({
      id: `math-choice-${n}`,
      char: String(n),
      emoji: '🔢',
    })));
  },

  showQuizQuestion() {
    if (this.quizIndex >= this.quizQueue.length) { this.showResult(this.quizGameType || 'quiz'); return; }
    const profile = Profile.getCurrent();
    const correct = this.quizQueue[this.quizIndex];
    const numChoices = profile.quizChoices;
    const isMathQuiz = this.currentCategory === 'math';
    let choices = [];
    if (isMathQuiz) {
      choices = this.buildMathChoices(correct, numChoices);
    } else {
      choices = [correct];
      const pool = this.items.filter(i => i.char !== correct.char);
      const shuffled = this._shuffle([...pool]);
      for (let i = 0; i < numChoices - 1 && i < shuffled.length; i++) choices.push(shuffled[i]);
      choices = this._shuffle(choices);
    }

    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="quiz-container">
        <div class="learn-header">
          <button class="btn-back" onclick="Game.showSelection('${this.currentCategory}')">
            <span class="back-arrow">&larr;</span>
          </button>
          <h2 class="learn-title">${isMathQuiz ? (this.quizGameType === 'times' ? '구구단 퀴즈' : '연산 퀴즈') : '글자 맞추기'}</h2>
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
    this.choiceEls = [...document.querySelectorAll('.quiz-choice')];
    this.choiceByChar = new Map(this.choiceEls.map((el) => [String(el.dataset.char), el]));

    if (profile.autoHint) {
      this._hintTimer = this.schedule(() => {
        const hint = document.getElementById('quiz-hint');
        if (hint) hint.style.display = 'block';
        const correctBtn = this.choiceByChar.get(String(correct.char))
          || document.querySelector(`[data-char="${correct.char}"]`);
        if (correctBtn) correctBtn.classList.add('hint-glow');
      }, 3000);
    }
  },

  checkQuizAnswer(selected, correct, btn) {
    clearTimeout(this._hintTimer);
    this._hintTimer = null;
    const profile = Profile.getCurrent();
    this.total++;
    const allBtns = this.choiceEls.length ? this.choiceEls : [...document.querySelectorAll('.quiz-choice')];
    if (selected === correct) {
      btn.classList.add('correct');
      this.score++;
      Reward.addStars(profile.starsPerCorrect);
      SFX.play('correct');
      const progress = Storage.getProgress(App.currentProfile);
      progress.quizCorrect = (progress.quizCorrect || 0) + 1;
      Storage.saveProgress(App.currentProfile, progress);
      Reward.addXP(profile.xpPerGame);
      Daily.updateMissionProgress('quiz');
      allBtns.forEach(b => b.disabled = true);
      this.schedule(() => { this.quizIndex++; this.showQuizQuestion(); }, 800);
    } else {
      btn.classList.add('wrong'); SFX.play('wrong');
      if (profile.wrongRetry) { btn.disabled = true; }
      else {
        allBtns.forEach(b => { b.disabled = true; if (String(b.dataset.char) === String(correct)) b.classList.add('correct'); });
        this.schedule(() => { this.quizIndex++; this.showQuizQuestion(); }, 1200);
      }
    }
  },

  // ===== MATCHING =====
  startMatching(categoryId) {
    this.clearTimers();
    this.currentCategory = categoryId;
    this.items = getAllCategoryItems(categoryId);
    this.score = 0; this.matchedPairs = 0; this.flippedCards = []; this.matchingLocked = false;
    const profile = Profile.getCurrent();
    const numPairs = Math.max(1, Math.min(profile.matchingPairs, this.items.length));
    const selected = this._shuffle([...this.items]).slice(0, numPairs);
    let cards = [];
    selected.forEach((item, i) => {
      cards.push({ id: `char-${i}`, pairId: i, display: item.char, type: 'char' });
      cards.push({ id: `emoji-${i}`, pairId: i, display: item.emoji, type: 'emoji' });
    });
    cards = this._shuffle(cards);
    this.matchingCards = cards;
    this.totalPairs = selected.length;
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
        this.schedule(() => {
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
            Storage.saveProgress(App.currentProfile, progress);
            Reward.addXP(Profile.getCurrent().xpPerGame);
            Daily.updateMissionProgress('matching');
            this.schedule(() => this.showResult('matching'), 600);
          }
        }, 400);
      } else {
        this.schedule(() => {
          a.btn.classList.remove('flipped'); b.btn.classList.remove('flipped');
          this.flippedCards = []; this.matchingLocked = false;
        }, 800);
      }
    }
  },

  // ===== SOUND FIND =====
  startSound(categoryId) {
    this.clearTimers();
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
    this.choiceEls = [...document.querySelectorAll('.quiz-choice')];
    this.choiceByChar = new Map(this.choiceEls.map((el) => [String(el.dataset.char), el]));
    this.schedule(() => this.playSoundHint(), 500);
    if (profile.autoHint) {
      this._hintTimer = this.schedule(() => {
        const correctBtn = this.choiceByChar.get(String(correct.char))
          || document.querySelector(`[data-char="${correct.char}"]`);
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
    this._hintTimer = null;
    const profile = Profile.getCurrent();
    this.total++;
    const allBtns = this.choiceEls.length ? this.choiceEls : [...document.querySelectorAll('.quiz-choice')];
    if (selected === correct) {
      btn.classList.add('correct'); this.score++;
      Reward.addStars(profile.starsPerCorrect); SFX.play('correct');
      const progress = Storage.getProgress(App.currentProfile);
      progress.soundCorrect = (progress.soundCorrect || 0) + 1;
      Storage.saveProgress(App.currentProfile, progress);
      Reward.addXP(profile.xpPerGame);
      allBtns.forEach(b => b.disabled = true);
      this.schedule(() => { this.soundIndex++; this.showSoundQuestion(); }, 800);
    } else {
      btn.classList.add('wrong'); SFX.play('wrong');
      if (profile.wrongRetry) { btn.disabled = true; }
      else {
        allBtns.forEach(b => { b.disabled = true; if (String(b.dataset.char) === String(correct)) b.classList.add('correct'); });
        this.schedule(() => { this.soundIndex++; this.showSoundQuestion(); }, 1200);
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
    this.clearTimers();
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
    const tracingBuddy = this.currentCategory === 'number' ? this.pickCountingBuddy() : null;
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
        ${tracingBuddy ? `
          <div class="counting-buddy tracing-buddy" aria-live="polite">
            <span class="counting-buddy-icon" aria-hidden="true">${tracingBuddy.emoji}</span>
            <div class="counting-buddy-text">
              <strong>${tracingBuddy.name}</strong>
              <span>${tracingBuddy.message}</span>
            </div>
          </div>
        ` : ''}
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
    this.schedule(() => {
      const canvas = document.getElementById('tracing-canvas');
      if (!canvas) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = Math.min(rect.width, 300);
      canvas.height = Math.min(rect.width, 300);
      this.tracingCanvas = canvas;
      this.tracingCtx = canvas.getContext('2d');
      const tracingThemeColors = {
        blue: '#0D47A1',
        green: '#1B5E20',
        purple: '#6A1B9A',
        pink: '#AD1457',
      };
      this.tracingCtx.strokeStyle = tracingThemeColors[profile.theme] || '#AD1457';
      this.tracingCtx.lineWidth = profile.ageGroup === 'toddler' ? 14 : 10;
      this.tracingCtx.lineCap = 'round';
      this.tracingCtx.lineJoin = 'round';
      this.tracingCtx.shadowColor = 'rgba(0, 0, 0, 0.18)';
      this.tracingCtx.shadowBlur = 1;
      this.tracingPoints = [];
      this.tracingPointCount = 0;
      this.tracingRect = canvas.getBoundingClientRect();
      this.tracingPendingPoint = null;
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
    if (this.tracingCanvas) this.tracingRect = this.tracingCanvas.getBoundingClientRect();
    const pos = this.getCanvasPos(e);
    this.tracingCtx.beginPath();
    this.tracingCtx.moveTo(pos.x, pos.y);
    this.tracingPointCount += 1;
  },

  tracingMove(e) {
    if (!this.isDrawing) return;
    this.tracingPendingPoint = this.getCanvasPos(e);
    if (this.tracingRaf) return;
    this.tracingRaf = requestAnimationFrame(() => {
      if (!this.tracingPendingPoint || !this.tracingCtx) {
        this.tracingRaf = 0;
        return;
      }
      const pos = this.tracingPendingPoint;
      this.tracingCtx.lineTo(pos.x, pos.y);
      this.tracingCtx.stroke();
      this.tracingPointCount += 1;
      this.tracingPendingPoint = null;
      this.tracingRaf = 0;
    });
  },

  tracingEnd() {
    this.isDrawing = false;
    this.tracingPendingPoint = null;
  },

  getCanvasPos(e) {
    const rect = this.tracingRect || this.tracingCanvas.getBoundingClientRect();
    return {
      x: (e.clientX || e.pageX) - rect.left,
      y: (e.clientY || e.pageY) - rect.top
    };
  },

  clearTracing() {
    if (this.tracingCtx) {
      this.tracingCtx.clearRect(0, 0, this.tracingCanvas.width, this.tracingCanvas.height);
      this.tracingPoints = [];
      this.tracingPointCount = 0;
    }
  },

  checkTracing() {
    // Simple check: if user drew enough points, consider it done
    const ageGroup = Profile.getCurrent().ageGroup;
    const minPoints = ageGroup === 'toddler' ? 15 : (ageGroup === 'child' ? 30 : 40);
    if (this.tracingPointCount >= minPoints) {
      this.score++;
      Reward.addStars(Profile.getCurrent().starsPerCorrect);
      SFX.play('correct');

      const progress = Storage.getProgress(App.currentProfile);
      progress.tracingComplete = (progress.tracingComplete || 0) + 1;
      Storage.saveProgress(App.currentProfile, progress);
      Reward.addXP(Profile.getCurrent().xpPerGame);
      Daily.updateMissionProgress('tracing');

      // Show success animation
      const area = document.querySelector('.tracing-area');
      if (area) area.classList.add('tracing-success');

      this.schedule(() => {
        this.tracingIndex++;
        this.showTracingChar();
      }, 1000);
    } else {
      // Not enough — encourage
      SFX.play('wrong');
      const area = document.querySelector('.tracing-area');
      if (area) {
        area.classList.add('tracing-shake');
        this.schedule(() => area.classList.remove('tracing-shake'), 500);
      }
    }
  },

  // ===== COUNTING =====
  countingQueue: [],
  countingIndex: 0,
  countedItems: 0,
  countingRecentSceneIds: [],
  countingRecentIcons: [],

  startCounting() {
    this.clearTimers();
    this.currentCategory = 'number';
    const profile = Profile.getCurrent();
    const max = profile.countingMax;
    this.score = 0; this.total = 0;
    this.countingQueue = [];
    this.countingRecentSceneIds = [];
    this.countingRecentIcons = [];
    for (let i = 0; i < 8; i++) {
      const count = Math.floor(Math.random() * max) + 1;
      const scene = this.pickCountingScene();
      const icons = this.createCountingIcons(scene, count);
      const buddy = this.pickCountingBuddy(scene);
      this.countingQueue.push({ count, icons, scene, buddy });
    }
    this.countingIndex = 0;
    this.showCountingQuestion();
  },

  showCountingQuestion() {
    if (this.countingIndex >= this.countingQueue.length) { this.showResult('counting'); return; }
    const profile = Profile.getCurrent();
    const q = this.countingQueue[this.countingIndex];
    const buddy = q.buddy || this.pickCountingBuddy();
    this.countedItems = 0;

    // Generate non-overlapping positions
    const positions = this.createCountingPositions(q.count);

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
        <div class="counting-buddy" aria-live="polite">
          <span class="counting-buddy-icon" aria-hidden="true">${buddy.emoji}</span>
          <div class="counting-buddy-text">
            <strong>${buddy.name}</strong>
            <span>${buddy.message}</span>
          </div>
        </div>
        <div class="counting-question">몇 개일까?</div>
        <div class="counting-scene">${q.scene?.title || '숫자 놀이터'}</div>
        <div class="counting-emoji-area" id="counting-area">
          ${positions.map((pos, i) => `
            <span class="counting-emoji" id="ce-${i}"
                  style="left:${pos.left}%;top:${pos.top}%"
                  onclick="Game.countItem(${i})">${q.icons?.[i] || COUNTING_EMOJIS[Math.floor(Math.random() * COUNTING_EMOJIS.length)]}</span>
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
      Storage.saveProgress(App.currentProfile, progress);
      Reward.addXP(Profile.getCurrent().xpPerGame);
      Daily.updateMissionProgress('counting');
      allBtns.forEach(b => b.disabled = true);
      this.schedule(() => { this.countingIndex++; this.showCountingQuestion(); }, 800);
    } else {
      btn.classList.add('wrong'); SFX.play('wrong');
      if (Profile.getCurrent().wrongRetry) { btn.disabled = true; }
      else {
        allBtns.forEach(b => { b.disabled = true; if (parseInt(b.textContent) === correct) b.classList.add('correct'); });
        this.schedule(() => { this.countingIndex++; this.showCountingQuestion(); }, 1200);
      }
    }
  },

  // ===== 2.5D SKY TOWER =====
  startSkyTower(categoryId = 'number') {
    this.clearTimers();
    const mode = CATEGORIES[categoryId] ? categoryId : 'number';
    this.currentCategory = mode;
    this.currentGame = 'tower';
    this.score = 0;
    this.total = 0;
    this.towerHeight = 0;
    this.towerLives = 3;
    this.towerCombo = 0;
    this.towerLatestHeight = 0;
    this.towerResultSaved = false;
    this.towerQueue = [];
    const rounds = 8;
    const ageGroup = Profile.getCurrent().ageGroup || 'child';
    for (let i = 0; i < rounds; i++) {
      this.towerQueue.push(this.generateTowerRound(ageGroup, mode));
    }
    this.towerIndex = 0;
    this.showTowerQuestion();
  },

  generateTowerRound(ageGroup = 'child', mode = 'number') {
    if (mode === 'hangul' || mode === 'english') {
      return this.generateTowerLanguageRound(mode);
    }
    const typePool = ageGroup === 'toddler'
      ? ['count', 'next']
      : (ageGroup === 'older' ? ['count', 'next', 'add', 'sub'] : ['count', 'next', 'add']);
    const type = typePool[Math.floor(Math.random() * typePool.length)];
    let answer = 1;
    let question = '';
    let emoji = '🔢';

    if (type === 'count') {
      const max = ageGroup === 'toddler' ? 8 : (ageGroup === 'child' ? 15 : 20);
      answer = Math.floor(Math.random() * max) + 1;
      question = `🍎 ${answer}개는 숫자로 얼마일까?`;
      emoji = '🍎';
    } else if (type === 'next') {
      const maxBase = ageGroup === 'toddler' ? 8 : (ageGroup === 'child' ? 20 : 40);
      const n = Math.floor(Math.random() * maxBase) + 1;
      answer = n + 1;
      question = `${n} 다음 숫자는?`;
      emoji = '➡️';
    } else if (type === 'sub') {
      const a = Math.floor(Math.random() * (ageGroup === 'older' ? 25 : 15)) + 6;
      const b = Math.floor(Math.random() * Math.min(9, a - 1)) + 1;
      answer = a - b;
      question = `${a} - ${b} = ?`;
      emoji = '➖';
    } else {
      const maxA = ageGroup === 'older' ? 20 : 12;
      const maxB = ageGroup === 'older' ? 12 : 9;
      const a = Math.floor(Math.random() * maxA) + 1;
      const b = Math.floor(Math.random() * maxB) + 1;
      answer = a + b;
      question = `${a} + ${b} = ?`;
      emoji = '➕';
    }

    return {
      answer: String(answer),
      question,
      emoji,
      choices: this.pickTowerChoices(String(answer)),
    };
  },

  generateTowerLanguageRound(mode = 'hangul') {
    const rawItems = getAllCategoryItems(mode).filter((item) => item && typeof item.char === 'string' && item.char.length > 0);
    const items = mode === 'english'
      ? rawItems.filter((item) => /^[A-Za-z]$/.test(item.char))
      : rawItems;
    if (!items.length) {
      return { answer: '1', question: '1 + 0 = ?', emoji: '➕', choices: ['1', '2', '3', '4'] };
    }
    const pick = items[Math.floor(Math.random() * items.length)];
    const answer = String(pick.char);
    const pool = mode === 'english'
      ? items.filter((item) => /^[A-Za-z]$/.test(item.char)).map((item) => item.char.toUpperCase())
      : items.map((item) => item.char);
    const normalizedAnswer = mode === 'english' ? answer.toUpperCase() : answer;
    const choices = this.pickTowerChoices(normalizedAnswer, pool);
    const label = mode === 'english' ? '영어' : '한글';
    return {
      answer: normalizedAnswer,
      question: `${label} 타워: ${pick.word}에 맞는 글자는?`,
      emoji: pick.emoji || (mode === 'english' ? '🔤' : '🔡'),
      choices,
    };
  },

  pickTowerChoices(answer, pool = null) {
    const profile = Profile.getCurrent();
    const choiceCount = Math.max(2, profile.quizChoices || 4);
    if (Array.isArray(pool) && pool.length > 1) {
      const set = new Set([String(answer)]);
      const shuffled = this._shuffle([...new Set(pool.map((v) => String(v)))]);
      shuffled.forEach((v) => {
        if (set.size < choiceCount) set.add(v);
      });
      return this._shuffle(Array.from(set));
    }

    const numericAnswer = Number(answer);
    const choices = new Set([String(answer)]);
    while (choices.size < choiceCount) {
      const delta = Math.floor(Math.random() * 7) - 3;
      const candidate = Math.max(0, numericAnswer + delta + (Math.random() < 0.3 ? Math.floor(Math.random() * 5) : 0));
      choices.add(String(candidate));
    }
    return this._shuffle(Array.from(choices));
  },

  renderTowerStack(height, maxHeight) {
    const rows = [];
    for (let i = 0; i < maxHeight; i++) {
      const level = i + 1;
      const built = i < height;
      const newest = built && level === this.towerLatestHeight;
      rows.push(`
        <div class="tower-block ${built ? 'built' : ''} ${newest ? 'newest' : ''}" style="--level:${level}; --max-level:${maxHeight}">
          <span>${built ? '⭐' : ''}</span>
        </div>
      `);
    }
    return rows.join('');
  },

  towerTitleByCategory() {
    if (this.currentCategory === 'hangul') return '2.5D 한글 타워';
    if (this.currentCategory === 'english') return '2.5D 영어 타워';
    return '2.5D 숫자 타워';
  },

  showTowerQuestion() {
    const maxRounds = this.towerQueue.length;
    if (this.towerIndex >= maxRounds || this.towerLives <= 0) {
      this.completeTowerSession();
      this.showResult('tower');
      return;
    }

    const round = this.towerQueue[this.towerIndex];
    this.towerCurrentRound = round;
    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="tower-game-container">
        <div class="learn-header">
          <button class="btn-back" onclick="Game.showSelection('${this.currentCategory}')">
            <span class="back-arrow">&larr;</span>
          </button>
          <h2 class="learn-title">${this.towerTitleByCategory()}</h2>
          <span class="game-score">⭐ ${this.score}</span>
        </div>

        <div class="tower-hud">
          <span>라운드 ${this.towerIndex + 1}/${maxRounds}</span>
          <span>생명 ${'❤️'.repeat(this.towerLives)}</span>
          <span>타워 ${this.towerHeight}층</span>
        </div>

        <div class="tower-combo-chip ${this.towerCombo >= 2 ? 'active' : ''}">
          콤보 x${Math.max(1, this.towerCombo)}
        </div>

        <div class="tower-scene" id="tower-scene">
          <div class="tower-sky"></div>
          <div class="tower-floor"></div>
          <div class="tower-stack">
            ${this.renderTowerStack(this.towerHeight, maxRounds)}
          </div>
        </div>

        <div class="tower-question-card">
          <div class="tower-question-emoji">${round.emoji}</div>
          <div class="tower-question-text">${round.question}</div>
        </div>

        <div class="tower-choices">
          ${round.choices.map((n, idx) => `
            <button class="tower-choice" onclick="Game.checkTowerAnswerByIndex(${idx}, this)">
              <span class="tower-choice-front">${n}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    App.showScreen('game');
    this.towerChoiceEls = [...document.querySelectorAll('.tower-choice')];
  },

  checkTowerAnswerByIndex(choiceIndex, btn) {
    const round = this.towerCurrentRound;
    if (!round) return;
    const selected = String(round.choices[choiceIndex]);
    const correct = String(round.answer);

    const allBtns = this.towerChoiceEls.length ? this.towerChoiceEls : [...document.querySelectorAll('.tower-choice')];
    allBtns.forEach((b) => { b.disabled = true; });
    this.total++;

    const scene = document.getElementById('tower-scene');

    if (selected === correct) {
      btn.classList.add('correct');
      this.score++;
      this.towerCombo = Math.max(1, (this.towerCombo || 0) + 1);
      this.towerHeight++;
      this.towerLatestHeight = this.towerHeight;
      Reward.addStars(Profile.getCurrent().starsPerCorrect + Math.min(3, this.towerCombo));
      SFX.play('correct');

      const progress = Storage.getProgress(App.currentProfile);
      progress.towerCorrect = (progress.towerCorrect || 0) + 1;
      Storage.saveProgress(App.currentProfile, progress);
      Reward.addXP(Profile.getCurrent().xpPerGame + 2 + Math.min(3, this.towerCombo));

      if (scene) {
        scene.classList.remove('shake');
        scene.classList.add('pop');
        this.schedule(() => scene.classList.remove('pop'), 260);
      }
    } else {
      btn.classList.add('wrong');
      this.towerCombo = 0;
      this.towerLives = Math.max(0, this.towerLives - 1);
      SFX.play('wrong');
      const right = Array.from(allBtns).find((b) => String(b.textContent.trim()) === correct);
      if (right) right.classList.add('correct');
      if (scene) {
        scene.classList.remove('pop');
        scene.classList.add('shake');
        this.schedule(() => scene.classList.remove('shake'), 360);
      }
    }

    this.schedule(() => {
      this.towerIndex++;
      this.showTowerQuestion();
    }, 900);
  },

  completeTowerSession() {
    if (this.towerResultSaved) return;
    this.towerResultSaved = true;
    const profile = Profile.getCurrent();
    const progress = Storage.getProgress(App.currentProfile);
    progress.towerPlays = (progress.towerPlays || 0) + 1;
    progress.towerBestHeight = Math.max(progress.towerBestHeight || 0, this.towerHeight || 0);
    if (this.towerHeight >= (this.towerQueue?.length || 0)) {
      progress.towerPerfectRuns = (progress.towerPerfectRuns || 0) + 1;
    }
    Storage.saveProgress(App.currentProfile, progress);
    Reward.addXP(Math.round((profile?.xpPerGame || 8) * 0.6));
    Daily.updateMissionProgress('tower', this.currentCategory);
    Reward.checkBadges();
  },

  // ===== 3D SHAPE IQ =====
  startShape3DMatch() {
    this.clearTimers();
    this.currentCategory = 'math';
    this.currentGame = 'shape3d';
    this.score = 0;
    this.total = 0;
    this.shape3DMode = 'match';
    this.shape3DQueue = Array.from({ length: 8 }, () => this.buildShape3DQuestion('match'));
    this.shape3DIndex = 0;
    this.showShape3DQuestion();
  },

  startShapeNetLab() {
    this.clearTimers();
    this.currentCategory = 'math';
    this.currentGame = 'net3d';
    this.score = 0;
    this.total = 0;
    this.shape3DMode = 'net';
    this.shape3DQueue = Array.from({ length: 8 }, () => this.buildShape3DQuestion('net'));
    this.shape3DIndex = 0;
    this.showShape3DQuestion();
  },

  startShapeBuilderLab() {
    this.clearTimers();
    this.currentCategory = 'math';
    this.currentGame = 'shape-lab';
    this.score = 0;
    this.total = 0;
    this.shapeLabQueue = Array.from({ length: 8 }, () => this.buildShapeLabQuestion());
    this.shapeLabIndex = 0;
    this.shapeLabSelected = {};
    this.shapeLabFeedback = '';
    this.shapeLabFeedbackType = '';
    this.shapeLabLocked = false;
    this.showShapeLabQuestion();
  },

  buildShapeLabQuestion() {
    const target = SHAPE_LAB_TARGETS[Math.floor(Math.random() * SHAPE_LAB_TARGETS.length)];
    const allPieceIds = Object.keys(SHAPE_LAB_PIECES);
    const traySet = new Set(Object.keys(target.recipe));

    while (traySet.size < Math.min(4, allPieceIds.length)) {
      const pickId = allPieceIds[Math.floor(Math.random() * allPieceIds.length)];
      traySet.add(pickId);
    }

    const stock = {};
    traySet.forEach((pieceId) => {
      const need = Number(target.recipe[pieceId]) || 0;
      stock[pieceId] = Math.max(1, need + 1 + Math.floor(Math.random() * 2));
    });

    return {
      targetId: target.id,
      targetName: target.name,
      targetVisual: target.visual,
      recipe: { ...target.recipe },
      tray: this._shuffle(Array.from(traySet)),
      stock,
    };
  },

  renderShapeLabRecipe(recipe, selected = null) {
    const rows = Object.entries(recipe).map(([pieceId, need]) => {
      const piece = SHAPE_LAB_PIECES[pieceId];
      const got = selected ? (Number(selected[pieceId]) || 0) : null;
      const suffix = selected ? `${got}/${need}` : `x${need}`;
      return `<span class="shape-lab-chip">${piece?.icon || '⬜'} ${piece?.name || pieceId} ${suffix}</span>`;
    });

    if (selected) {
      Object.entries(selected).forEach(([pieceId, used]) => {
        if ((Number(used) || 0) <= 0) return;
        if (Object.prototype.hasOwnProperty.call(recipe, pieceId)) return;
        const piece = SHAPE_LAB_PIECES[pieceId];
        rows.push(`<span class="shape-lab-chip is-extra">${piece?.icon || '⬜'} ${piece?.name || pieceId} +${used}</span>`);
      });
    }
    return rows.join('');
  },

  showShapeLabQuestion() {
    if (this.shapeLabIndex >= (this.shapeLabQueue?.length || 0)) {
      this.showResult('shape-lab');
      return;
    }

    const q = this.shapeLabQueue[this.shapeLabIndex];
    const selected = this.shapeLabSelected || {};
    const defaultHint = '도형 조각을 눌러서 목표 모양을 완성하세요.';
    const hint = this.shapeLabFeedback || defaultHint;
    const hintClass = this.shapeLabFeedbackType === 'ok'
      ? 'is-ok'
      : (this.shapeLabFeedbackType === 'fail' ? 'is-fail' : '');
    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="shape3d-container shape-lab-container">
        <div class="learn-header">
          <button class="btn-back" onclick="Game.showSelection('math')">
            <span class="back-arrow">&larr;</span>
          </button>
          <h2 class="learn-title">도형 만들기 랩</h2>
          <span class="game-score">⭐${this.score}</span>
        </div>
        <div class="quiz-progress">
          <div class="quiz-progress-bar" style="width:${(this.shapeLabIndex / this.shapeLabQueue.length) * 100}%"></div>
        </div>
        <div class="shape-lab-target">
          <div class="shape-lab-target-emoji">${q.targetVisual}</div>
          <div class="shape-lab-target-text">
            <strong>목표: ${q.targetName}</strong>
            <div class="shape-lab-chip-row">${this.renderShapeLabRecipe(q.recipe)}</div>
          </div>
        </div>
        <div class="shape-lab-feedback ${hintClass}">${hint}</div>
        <div class="shape-lab-tray">
          ${q.tray.map((pieceId) => {
            const piece = SHAPE_LAB_PIECES[pieceId];
            const used = Number(selected[pieceId]) || 0;
            const stock = Number(q.stock[pieceId]) || 0;
            const disabled = this.shapeLabLocked || used >= stock;
            return `
              <button class="shape-lab-piece" ${disabled ? 'disabled' : ''} onclick="Game.pickShapeLabPiece('${pieceId}')">
                <span class="shape-lab-piece-icon">${piece?.icon || '⬜'}</span>
                <span class="shape-lab-piece-name">${piece?.name || pieceId}</span>
                <span class="shape-lab-piece-count">${used}/${stock}</span>
              </button>
            `;
          }).join('')}
        </div>
        <div class="shape-lab-selected">
          <div class="shape-lab-selected-title">현재 조합</div>
          <div class="shape-lab-chip-row">${this.renderShapeLabRecipe(q.recipe, selected)}</div>
        </div>
        <div class="shape-lab-actions">
          <button class="btn-secondary" onclick="Game.resetShapeLabSelection()" ${this.shapeLabLocked ? 'disabled' : ''}>초기화</button>
          <button class="btn-primary" onclick="Game.submitShapeLabAnswer()" ${this.shapeLabLocked ? 'disabled' : ''}>완성 확인</button>
        </div>
      </div>
    `;
    App.showScreen('game');
  },

  pickShapeLabPiece(pieceId) {
    if (this.shapeLabLocked) return;
    const q = this.shapeLabQueue?.[this.shapeLabIndex];
    if (!q || !Object.prototype.hasOwnProperty.call(q.stock, pieceId)) return;
    const current = Number(this.shapeLabSelected?.[pieceId]) || 0;
    const stock = Number(q.stock[pieceId]) || 0;
    if (current >= stock) return;

    this.shapeLabSelected = { ...(this.shapeLabSelected || {}), [pieceId]: current + 1 };
    this.shapeLabFeedback = '';
    this.shapeLabFeedbackType = '';
    this.showShapeLabQuestion();
  },

  resetShapeLabSelection() {
    if (this.shapeLabLocked) return;
    this.shapeLabSelected = {};
    this.shapeLabFeedback = '';
    this.shapeLabFeedbackType = '';
    this.showShapeLabQuestion();
  },

  submitShapeLabAnswer() {
    if (this.shapeLabLocked) return;
    const q = this.shapeLabQueue?.[this.shapeLabIndex];
    if (!q) return;

    this.shapeLabLocked = true;
    this.total += 1;
    const selected = this.shapeLabSelected || {};
    const allPieceIds = Object.keys(SHAPE_LAB_PIECES);
    let isCorrect = true;
    for (const pieceId of allPieceIds) {
      const need = Number(q.recipe[pieceId]) || 0;
      const got = Number(selected[pieceId]) || 0;
      if (need !== got) {
        isCorrect = false;
        break;
      }
    }

    if (isCorrect) {
      const profile = Profile.getCurrent();
      this.score += 1;
      Reward.addStars((profile?.starsPerCorrect || 1) + 1);
      Reward.addXP((profile?.xpPerGame || 8) + 4);
      SFX.play('correct');

      const progress = Storage.getProgress(App.currentProfile);
      progress.shapeLabCorrect = (progress.shapeLabCorrect || 0) + 1;
      progress.shape3dCorrect = (progress.shape3dCorrect || 0) + 1;
      Storage.saveProgress(App.currentProfile, progress);
      Daily.updateMissionProgress('shape3d');

      this.shapeLabFeedback = '정답! 목표 도형을 정확히 만들었어요.';
      this.shapeLabFeedbackType = 'ok';
      this.showShapeLabQuestion();
      this.schedule(() => {
        this.shapeLabIndex += 1;
        this.shapeLabSelected = {};
        this.shapeLabFeedback = '';
        this.shapeLabFeedbackType = '';
        this.shapeLabLocked = false;
        this.showShapeLabQuestion();
      }, 760);
      return;
    }

    SFX.play('wrong');
    this.shapeLabFeedback = '조합이 달라요. 목표 레시피를 보고 다음 문제로 넘어갈게요.';
    this.shapeLabFeedbackType = 'fail';
    this.showShapeLabQuestion();
    this.schedule(() => {
      this.shapeLabIndex += 1;
      this.shapeLabSelected = {};
      this.shapeLabFeedback = '';
      this.shapeLabFeedbackType = '';
      this.shapeLabLocked = false;
      this.showShapeLabQuestion();
    }, 1100);
  },

  buildShape3DQuestion(mode = 'match') {
    const answerShape = SHAPE_3D_LIBRARY[Math.floor(Math.random() * SHAPE_3D_LIBRARY.length)];
    const promptPool = mode === 'net'
      ? [
        `전개도 힌트: ${answerShape.netHint}`,
        `이 전개도는 어떤 입체도형일까?\n${answerShape.netVisual}`,
      ]
      : [
        `${answerShape.clue}\n이 특징을 가진 입체도형은?`,
        `${answerShape.emoji} 와(과) 같은 도형 이름은?`,
      ];
    const prompt = promptPool[Math.floor(Math.random() * promptPool.length)];

    const choices = new Set([answerShape.id]);
    while (choices.size < 4) {
      const pick = SHAPE_3D_LIBRARY[Math.floor(Math.random() * SHAPE_3D_LIBRARY.length)];
      choices.add(pick.id);
    }
    const choiceObjects = this._shuffle(Array.from(choices)
      .map((id) => SHAPE_3D_LIBRARY.find((row) => row.id === id))
      .filter(Boolean));

    return {
      mode,
      answerId: answerShape.id,
      prompt,
      visual: mode === 'net' ? answerShape.netVisual : answerShape.emoji,
      choices: choiceObjects,
    };
  },

  showShape3DQuestion() {
    if (this.shape3DIndex >= (this.shape3DQueue?.length || 0)) {
      this.showResult(this.shape3DMode === 'net' ? 'net3d' : 'shape3d');
      return;
    }

    const q = this.shape3DQueue[this.shape3DIndex];
    const title = q.mode === 'net' ? '3D 모형 해석' : '3D 도형 맞추기';
    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="shape3d-container">
        <div class="learn-header">
          <button class="btn-back" onclick="Game.showSelection('math')">
            <span class="back-arrow">&larr;</span>
          </button>
          <h2 class="learn-title">${title}</h2>
          <span class="game-score">⭐ ${this.score}</span>
        </div>
        <div class="quiz-progress">
          <div class="quiz-progress-bar" style="width:${(this.shape3DIndex / this.shape3DQueue.length) * 100}%"></div>
        </div>
        <div class="shape3d-prompt">
          <div class="shape3d-visual">${q.visual || ''}</div>
          <div class="shape3d-text">${String(q.prompt || '').replace(/\n/g, '<br>')}</div>
        </div>
        <div class="shape3d-choices">
          ${q.choices.map((shape) => `
            <button class="shape3d-choice" onclick="Game.checkShape3DAnswer('${shape.id}', '${q.answerId}', this)">
              <span class="shape3d-choice-emoji">${shape.emoji}</span>
              <span class="shape3d-choice-name">${shape.name}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    App.showScreen('game');
  },

  checkShape3DAnswer(selectedId, correctId, btn) {
    const profile = Profile.getCurrent();
    const allBtns = [...document.querySelectorAll('.shape3d-choice')];
    this.total++;

    if (selectedId === correctId) {
      btn.classList.add('correct');
      this.score++;
      Reward.addStars(profile.starsPerCorrect + 1);
      Reward.addXP(profile.xpPerGame + 3);
      SFX.play('correct');

      const progress = Storage.getProgress(App.currentProfile);
      if (this.shape3DMode === 'net') {
        progress.net3dCorrect = (progress.net3dCorrect || 0) + 1;
        Daily.updateMissionProgress('net3d');
      } else {
        progress.shape3dCorrect = (progress.shape3dCorrect || 0) + 1;
        Daily.updateMissionProgress('shape3d');
      }
      Storage.saveProgress(App.currentProfile, progress);

      allBtns.forEach((b) => { b.disabled = true; });
      this.schedule(() => {
        this.shape3DIndex++;
        this.showShape3DQuestion();
      }, 800);
      return;
    }

    btn.classList.add('wrong');
    SFX.play('wrong');
    if (profile.wrongRetry) {
      btn.disabled = true;
      return;
    }

    allBtns.forEach((b) => { b.disabled = true; });
    const targetShape = SHAPE_3D_LIBRARY.find((row) => row.id === correctId);
    const correctBtn = allBtns.find((b) => b.querySelector('.shape3d-choice-name')?.textContent?.trim() === targetShape?.name);
    if (correctBtn) correctBtn.classList.add('correct');
    this.schedule(() => {
      this.shape3DIndex++;
      this.showShape3DQuestion();
    }, 1200);
  },

  // ===== RESULT =====
  showResult(gameType) {
    this.clearTimers();
    if (window.App && typeof App.completeActiveRecommendation === 'function') {
      App.completeActiveRecommendation();
    }
    const profile = Profile.getCurrent();
    const totalDisplay = gameType === 'matching'
      ? this.totalPairs
      : (gameType === 'tracing'
        ? this.tracingQueue.length
        : (gameType === 'tower' ? (this.towerQueue?.length || this.total || 1) : this.total));
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
      case 'times': this.startTimesTableQuiz(); break;
      case 'matching': this.startMatching(this.currentCategory); break;
      case 'sound': this.startSound(this.currentCategory); break;
      case 'tracing': this.startTracing(this.currentCategory); break;
      case 'counting': this.startCounting(); break;
      case 'tower': this.startSkyTower(this.currentCategory || 'number'); break;
      case 'shape3d': this.startShape3DMatch(); break;
      case 'net3d': this.startShapeNetLab(); break;
      case 'shape-lab': this.startShapeBuilderLab(); break;
    }
  },

  pickCountingScene() {
    const recent = new Set(this.countingRecentSceneIds.slice(-2));
    let candidates = COUNTING_SCENES.filter((scene) => !recent.has(scene.id));
    if (!candidates.length) candidates = COUNTING_SCENES;
    const scene = candidates[Math.floor(Math.random() * candidates.length)] || COUNTING_SCENES[0];
    this.countingRecentSceneIds.push(scene.id);
    this.countingRecentSceneIds = this.countingRecentSceneIds.slice(-6);
    return scene;
  },

  createCountingIcons(scene, count) {
    const pool = Array.isArray(scene?.icons) && scene.icons.length ? scene.icons : COUNTING_EMOJIS;
    const icons = [];
    for (let i = 0; i < count; i++) {
      const last = icons[icons.length - 1];
      let candidates = pool.filter((icon) => icon !== last);
      if (!candidates.length) candidates = pool;

      const globalRecent = this.countingRecentIcons.slice(-4);
      const lessUsed = candidates.filter((icon) => !globalRecent.includes(icon));
      const pickPool = lessUsed.length ? lessUsed : candidates;
      const icon = pickPool[Math.floor(Math.random() * pickPool.length)];
      icons.push(icon);
      this.countingRecentIcons.push(icon);
    }
    this.countingRecentIcons = this.countingRecentIcons.slice(-24);
    return icons;
  },

  createCountingPositions(count) {
    const cols = count <= 6 ? 3 : (count <= 10 ? 4 : 5);
    const rows = Math.max(1, Math.ceil(count / cols));
    const width = 76;
    const height = 62;
    const leftStart = 12;
    const topStart = 14;
    const cells = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const baseLeft = leftStart + ((col + 0.5) * width / cols);
        const baseTop = topStart + ((row + 0.5) * height / rows);
        const jitterLeft = (Math.random() - 0.5) * 4.5;
        const jitterTop = (Math.random() - 0.5) * 5;
        cells.push({
          left: Math.max(8, Math.min(90, baseLeft + jitterLeft)),
          top: Math.max(12, Math.min(80, baseTop + jitterTop)),
        });
      }
    }

    this._shuffle(cells);
    return cells.slice(0, count);
  },

  pickCountingBuddy(scene) {
    const base = COUNTING_BUDDIES[Math.floor(Math.random() * COUNTING_BUDDIES.length)];
    const defaultMessage = base.cheers[Math.floor(Math.random() * base.cheers.length)];
    const sceneMessage = scene?.title ? `${scene.title}에서 천천히 세어 보자!` : defaultMessage;
    const message = Math.random() < 0.45 ? sceneMessage : defaultMessage;
    return {
      emoji: base.emoji,
      name: base.name,
      message,
    };
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
    const soundOptions = window.App && typeof App.getSoundOptions === 'function'
      ? App.getSoundOptions()
      : { muteAll: false, sfxVolume: 100 };
    if (soundOptions.muteAll) return;
    const volumeScale = Math.max(0, Math.min(1, (Number(soundOptions.sfxVolume) || 0) / 100));
    if (volumeScale <= 0) return;
    const master = this.ctx.createGain();
    const now = this.ctx.currentTime;
    master.gain.setValueAtTime(volumeScale, now);
    master.connect(this.ctx.destination);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain); gain.connect(master);
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
          o.connect(g); g.connect(master);
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
          o.connect(g); g.connect(master);
          o.frequency.setValueAtTime(freq, now + i * 0.15);
          g.gain.setValueAtTime(0.25, now + i * 0.15);
          g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.2);
          o.start(now + i * 0.15); o.stop(now + i * 0.15 + 0.2);
        }); break;
    }
    setTimeout(() => {
      try { master.disconnect(); } catch {}
    }, 2000);
  },
};
