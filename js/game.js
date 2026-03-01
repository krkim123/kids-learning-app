// Game modes: Quiz, Matching, Sound-Find, Tracing, Counting, 2.5D Tower

const COUNTING_BUDDIES = Object.freeze([
  {
    emoji: '?쫫',
    name: '?좊땲',
    cheers: ['?좊땲??媛숈씠 ?몄뼱 蹂댁옄!', '泥쒖쿇???섎굹???몃㈃ ?ъ썙!'],
  },
  {
    emoji: '?㎏',
    name: '紐쎌떎??,
    cheers: ['紐쎌떎?닿? ?묒썝?좉쾶!', '洹?ъ슫 移쒓뎄??紐?紐낆씤吏 ?몄뼱 蹂쇨퉴?'],
  },
  {
    emoji: '?맧',
    name: '?좊━',
    cheers: ['?좊━???먮컯?먮컯 ?レ옄 ??댄븯??', '?묒? 紐⑹냼由щ줈 ?섎굹, ?? ??'],
  },
  {
    emoji: '?맻',
    name: '肄⑹씠',
    cheers: ['肄⑹씠???④퍡 ?뺣떟 李얠옄!', '??蹂닿퀬 李④렐李④렐 ?몄뼱 蹂댁옄!'],
  },
]);

const COUNTING_SCENES = Object.freeze([
  { id: 'forest-friends', title: '?뀁냽 ?숇Ъ 移쒓뎄??, icons: ['?맧', '?쫲', '?쫽', '?맾截?, '?쫱', '?맶', '?쬆', '?쫵'] },
  { id: 'ocean-friends', title: '諛붾떎 移쒓뎄??, icons: ['?맆', '?맇', '?맟', '?맫', '??', '?릻', '?쫺', '?ぜ'] },
  { id: 'fruit-basket', title: '怨쇱씪 諛붽뎄??, icons: ['?뜋', '?뜉', '?뜃', '?뜐', '?뜇', '?뜆', '?쪤', '?뜏'] },
  { id: 'toy-box', title: '?λ궃媛??곸옄', icons: ['?㎏', '??', '?챳', '?㎥', '?슅', '?쉨', '?챸', '?럥'] },
  { id: 'space-trip', title: '?곗＜ ?먰뿕?', icons: ['??', '?쎑', '?첃', '狩?, '?꾬툘', '?뙔', '?쎇截?, '?뙆'] },
  { id: 'garden-day', title: '?뺤썝 ?곗콉', icons: ['?뙵', '?뙹', '?뙸', '?뙴', '?쫳', '?맄', '?뙼', '??'] },
  { id: 'food-party', title: '媛꾩떇 ?뚰떚', icons: ['?뜦', '?쭅', '?뜧', '?뜭', '?뜣', '?ⅷ', '?띅', '?뜪'] },
  { id: 'city-ride', title: '?덇쾬 紐⑦뿕', icons: ['?슅', '?쉶', '?슃', '?쉾', '?슩', '?쉪', '?쉧', '?슓'] },
  { id: 'dino-zone', title: '怨듬！ ?먰뿕', icons: ['?쫾', '?쫿', '?뙅', '?え', '?뙱', '?쪡', '?┫', '?뙂'] },
  { id: 'music-band', title: '?뚯븙 諛대뱶', icons: ['?렦', '?렧', '?쪇', '?렩', '?렪', '?렫', '?렭', '?렎'] },
  { id: 'weather-show', title: '?좎뵪 洹뱀옣', icons: ['?截?, '?뙟截?, '??, '?뙢截?, '?덌툘', '?뙂', '?꾬툘', '?뮜'] },
  { id: 'farm-day', title: '?띿옣 ?섎（', icons: ['?맢', '?맰', '?릶', '?릲', '?맭', '?뙻', '?쪜', '?슌'] },
  { id: 'book-world', title: '?숉솕梨??섎씪', icons: ['?뱴', '?뱰', '?룿', '?쭥', '?쭦', '?썳截?, '?㏊', '?빉截?] },
  { id: 'sports-festa', title: '?대룞????, icons: ['??, '??', '?룓', '?렱', '?뤈', '?쪔', '?룗', '?룆'] },
  { id: 'kitchen-lab', title: '?붾━ ?ㅽ뿕??, icons: ['?뜵', '?ⅲ', '?쪥', '?뜚', '?뜒', '?뜳', '?쪞', '?쪢'] },
  { id: 'treasure-hunt', title: '蹂대Ъ李얘린', icons: ['?뿺截?, '?㎛', '?첌', '?뭿', '?뵎', '?벀', '?룤截?, '??] },
]);

const SHAPE_3D_LIBRARY = Object.freeze([
  {
    id: 'cube',
    name: '?뺤쑁硫댁껜',
    emoji: '?쭒',
    clue: '紐⑤뱺 硫댁씠 媛숈? ?뺤궗媛곹삎 6媛?,
    netHint: '?뺤궗媛곹삎 6媛쒓? ??옄 ?뺥깭濡??쇱퀜吏?,
    netVisual: '燧쒋쵚燧?n  燧?n  燧?,
  },
  {
    id: 'rect-prism',
    name: '吏곸쑁硫댁껜',
    emoji: '?벀',
    clue: '留덉＜ 蹂대뒗 硫댁쓽 ?ш린媛 媛숈? 吏곸궗媛곹삎 6媛?,
    netHint: '吏곸궗媛곹삎 6媛? 湲?硫?吏㏃? 硫?議고빀',
    netVisual: '??뼪??n  ??n  ??,
  },
  {
    id: 'cylinder',
    name: '?먭린??,
    emoji: '??',
    clue: '?쀫㈃/?꾨옯硫댁? ?? ?녿㈃? 吏곸궗媛곹삎',
    netHint: '??2媛?+ 吏곸궗媛곹삎 1媛?,
    netVisual: '??????,
  },
  {
    id: 'cone',
    name: '?먮퓭',
    emoji: '?뜣',
    clue: '諛묐㈃? ?? ?녿㈃? 瑗?쭞?먯쑝濡?紐⑥엫',
    netHint: '??1媛?+ 遺梨꾧섦 1媛?,
    netVisual: '??+ ??,
  },
  {
    id: 'sphere',
    name: '援?,
    emoji: '??,
    clue: '紐⑤뱺 諛⑺뼢?쇰줈 ?κ?怨?紐⑥꽌由ш? ?놁쓬',
    netHint: '?꾧컻???놁씠 ?섎굹??怨〓㈃',
    netVisual: '??,
  },
  {
    id: 'tri-prism',
    name: '?쇨컖湲곕뫁',
    emoji: '??,
    clue: '?쇨컖??2媛쒖? 吏곸궗媛곹삎 3媛쒕줈 援ъ꽦',
    netHint: '?쇨컖??2媛?+ 吏곸궗媛곹삎 3媛?,
    netVisual: '??????????,
  },
  {
    id: 'square-pyramid',
    name: '?ш컖肉?,
    emoji: '?뵼',
    clue: '諛묐㈃? ?뺤궗媛곹삎, ?녿㈃? ?쇨컖??4媛?,
    netHint: '?뺤궗媛곹삎 1媛?+ ?쇨컖??4媛?,
    netVisual: '  ??n??????n  ??,
  },
]);

const BLOCK_COUNT_25D_LIBRARY = Object.freeze((() => {
  const POSITIONS = Array.from({ length: 16 }, (_, i) => ({
    gx: i % 4,
    gy: Math.floor(i / 4),
  }));

  function seededRandom(seed) {
    let state = seed >>> 0;
    return () => {
      state = (state * 1664525 + 1013904223) >>> 0;
      return state / 0x100000000;
    };
  }

  function randomInt(rand, min, max) {
    return Math.floor(rand() * (max - min + 1)) + min;
  }

  function pickUniquePositions(rand, count) {
    const pool = [...POSITIONS];
    const picked = [];
    for (let i = 0; i < count && pool.length; i++) {
      const index = randomInt(rand, 0, pool.length - 1);
      picked.push(pool.splice(index, 1)[0]);
    }
    return picked;
  }

  function buildHeights(rand, stackCount, targetCount, maxHeight) {
    const heights = Array.from({ length: stackCount }, () => 1);
    let remaining = Math.max(0, targetCount - stackCount);
    let safety = 0;
    while (remaining > 0 && safety < 1000) {
      const index = randomInt(rand, 0, stackCount - 1);
      if (heights[index] < maxHeight) {
        heights[index] += 1;
        remaining -= 1;
      }
      safety += 1;
    }
    return heights;
  }

  function challengeMeta(index) {
    if (index < 30) return { tier: 'toddler', min: 2, max: 8, maxHeight: 3, minStacks: 2, maxStacks: 4 };
    if (index < 70) return { tier: 'child', min: 4, max: 14, maxHeight: 4, minStacks: 3, maxStacks: 5 };
    return { tier: 'older', min: 6, max: 20, maxHeight: 5, minStacks: 3, maxStacks: 6 };
  }

  const rows = [];
  for (let i = 0; i < 100; i++) {
    const rand = seededRandom(90210 + i * 7919);
    const meta = challengeMeta(i);
    const targetCount = randomInt(rand, meta.min, meta.max);
    const stackCount = Math.min(
      randomInt(rand, meta.minStacks, meta.maxStacks),
      targetCount
    );
    const positions = pickUniquePositions(rand, stackCount);
    const heights = buildHeights(rand, stackCount, targetCount, meta.maxHeight);
    const stacks = positions.map((position, idx) => ({
      gx: position.gx,
      gy: position.gy,
      h: heights[idx],
    }));

    rows.push({
      id: `block-25d-${i + 1}`,
      tier: meta.tier,
      title: `2.5D 釉붾줉 ?쇱쫹 ${i + 1}`,
      targetCount,
      stacks,
    });
  }
  return rows;
})());

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
  quizInfiniteLives: 0,
  blockCountMode: 'normal',
  blockCountLives: 0,
  quizInfiniteCombo: 0,
  quizInfiniteBestCombo: 0,
  quizInfiniteSessionBest: 0,
  blockCountCombo: 0,
  blockCountBestCombo: 0,
  blockCountSessionBest: 0,

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

  recordWrongAttempt(categoryId, targetKey) {
    const category = CATEGORIES[categoryId] ? categoryId : (this.currentCategory || 'hangul');
    const key = String(targetKey ?? '').trim();
    if (!key) return;
    const progress = Storage.getProgress(App.currentProfile);
    const stats = progress.wrongStats && typeof progress.wrongStats === 'object' ? progress.wrongStats : {};
    const bucket = stats[category] && typeof stats[category] === 'object'
      ? stats[category]
      : { total: 0, items: {} };
    bucket.total = Math.max(0, Number(bucket.total) || 0) + 1;
    const items = bucket.items && typeof bucket.items === 'object' ? bucket.items : {};
    items[key] = Math.max(0, Number(items[key]) || 0) + 1;
    bucket.items = items;
    stats[category] = bucket;
    progress.wrongStats = stats;
    Storage.saveProgress(App.currentProfile, progress);
  },

  getComboRecord(modeId) {
    const progress = Storage.getProgress(App.currentProfile);
    const comboRecords = progress.comboRecords && typeof progress.comboRecords === 'object'
      ? progress.comboRecords
      : {};
    return Math.max(0, Number(comboRecords[modeId]) || 0);
  },

  updateComboRecord(modeId, comboValue) {
    const nextValue = Math.max(0, Number(comboValue) || 0);
    const progress = Storage.getProgress(App.currentProfile);
    const comboRecords = progress.comboRecords && typeof progress.comboRecords === 'object'
      ? { ...progress.comboRecords }
      : {};
    const current = Math.max(0, Number(comboRecords[modeId]) || 0);
    if (nextValue <= current) return current;
    comboRecords[modeId] = nextValue;
    progress.comboRecords = comboRecords;
    Storage.saveProgress(App.currentProfile, progress);
    return nextValue;
  },

  getComboRankLabel(bestCombo) {
    const score = Math.max(0, Number(bestCombo) || 0);
    if (score >= 60) return 'S+';
    if (score >= 40) return 'S';
    if (score >= 25) return 'A';
    if (score >= 15) return 'B';
    if (score >= 8) return 'C';
    return 'D';
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
            <h2 class="learn-title">${cat.icon} ${cat.name} 寃뚯엫</h2>
            <span></span>
          </div>
          <div class="game-mode-cards">
            <button class="game-mode-card" onclick="Game.startQuiz('math')">
              <div class="game-mode-icon">+</div>
              <div>
                <div class="game-mode-name">?곗궛 ?댁쫰</div>
                <div class="game-mode-desc">?㏃뀍, 類꾩뀍, 怨깆뀍, ?섎닓??臾몄젣 ?湲?/div>
              </div>
            </button>
            <button class="game-mode-card" onclick="Game.startQuizMarathon('math')">
              <div class="game-mode-icon">?뱴</div>
              <div>
                <div class="game-mode-name">?щ윭 ?댁쫰 ?湲?/div>
                <div class="game-mode-desc">20臾몄젣 ?곗냽 ???吏묒쨷 ?덈젴</div>
              </div>
            </button>
            <button class="game-mode-card" onclick="Game.startQuizInfinite('math')">
              <div class="game-mode-icon">??/div>
              <div>
                <div class="game-mode-name">臾댄븳紐⑤뱶</div>
                <div class="game-mode-desc">紐⑹닲 3媛쒕줈 怨꾩냽 ?꾩쟾</div>
              </div>
            </button>
            <button class="game-mode-card" onclick="Game.startTimesTableQuiz()">
              <div class="game-mode-icon">9횞9</div>
              <div>
                <div class="game-mode-name">援ш뎄???댁쫰</div>
                <div class="game-mode-desc">2?⑤???9?④퉴吏 鍮좊Ⅴ寃??곗뒿?섍린</div>
              </div>
            </button>
            <button class="game-mode-card" onclick="Game.startTracing('math')">
              <div class="game-mode-icon">?륅툘</div>
              <div>
                <div class="game-mode-name">?섏떇 ?곕씪?곌린</div>
                <div class="game-mode-desc">?レ옄? 湲고샇瑜??먯쑝濡??⑤낫湲?/div>
              </div>
            </button>
            <button class="game-mode-card" onclick="Game.startShape3DMatch()">
              <div class="game-mode-icon">?쭒</div>
              <div>
                <div class="game-mode-name">3D ?꾪삎 留욎텛湲?/div>
                <div class="game-mode-desc">?낆껜?꾪삎 ?뱀쭠??蹂닿퀬 ?뺣떟 怨좊Ⅴ湲?/div>
              </div>
            </button>
            <button class="game-mode-card" onclick="Game.startShapeNetLab()">
              <div class="game-mode-icon">?㎥</div>
              <div>
                <div class="game-mode-name">3D 紐⑦삎 ?댁꽍</div>
                <div class="game-mode-desc">?꾧컻???뚰듃濡??낆껜?꾪삎 異붾줎?섍린</div>
              </div>
            </button>
            <button class="game-mode-card" onclick="Game.startSpatialMatrix25D()">
              <div class="game-mode-icon">🧠</div>
              <div>
                <div class="game-mode-name">2.5D 매트릭스 IQ</div>
                <div class="game-mode-desc">행/열 규칙으로 빈칸 패턴 완성</div>
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
          <h2 class="learn-title">${cat.icon} ${cat.name} 寃뚯엫</h2>
          <span></span>
        </div>
        <div class="game-mode-cards">
          <button class="game-mode-card" onclick="Game.startQuiz('${categoryId}')">
            <div class="game-mode-icon">??/div>
            <div>
              <div class="game-mode-name">湲??留욎텛湲?/div>
              <div class="game-mode-desc">洹몃┝ 蹂닿퀬 湲??怨좊Ⅴ湲?/div>
            </div>
          </button>
          <button class="game-mode-card" onclick="Game.startQuizMarathon('${categoryId}')">
            <div class="game-mode-icon">?뱴</div>
            <div>
              <div class="game-mode-name">?щ윭 ?댁쫰 ?湲?/div>
              <div class="game-mode-desc">20臾몄젣 ?곗냽 ???吏묒쨷 ?덈젴</div>
            </div>
          </button>
          <button class="game-mode-card" onclick="Game.startQuizInfinite('${categoryId}')">
            <div class="game-mode-icon">??/div>
            <div>
              <div class="game-mode-name">臾댄븳紐⑤뱶</div>
              <div class="game-mode-desc">紐⑹닲 3媛쒕줈 怨꾩냽 ?꾩쟾</div>
            </div>
          </button>
          <button class="game-mode-card" onclick="Game.startMatching('${categoryId}')">
            <div class="game-mode-icon">?깗</div>
            <div>
              <div class="game-mode-name">吏?留욎텛湲?/div>
              <div class="game-mode-desc">移대뱶 ?ㅼ쭛?댁꽌 吏?李얘린</div>
            </div>
          </button>
          <button class="game-mode-card" onclick="Game.startSound('${categoryId}')">
            <div class="game-mode-icon">?뵄</div>
            <div>
              <div class="game-mode-name">?뚮━ 李얘린</div>
              <div class="game-mode-desc">?뚮━ ?ｊ퀬 湲??李얘린</div>
            </div>
          </button>
          <button class="game-mode-card" onclick="Game.startTracing('${categoryId}')">
            <div class="game-mode-icon">?륅툘</div>
            <div>
              <div class="game-mode-name">?곕씪?곌린</div>
              <div class="game-mode-desc">?먭??쎌쑝濡?湲???곕씪 洹몃━湲?/div>
            </div>
          </button>
          <button class="game-mode-card" onclick="Game.startSkyTower('${categoryId}')">
            <div class="game-mode-icon">?룛截?/div>
            <div>
              <div class="game-mode-name">2.5D ?ㅼ뭅?????/div>
              <div class="game-mode-desc">${categoryId === 'number' ? '?レ옄/?곗궛 ?뺣떟?쇰줈 ????볤린' : (categoryId === 'english' ? '?곸뼱 湲???뺣떟?쇰줈 ????볤린' : '?쒓? 湲???뺣떟?쇰줈 ????볤린')}</div>
            </div>
          </button>
          ${categoryId === 'number' ? `
            <button class="game-mode-card" onclick="Game.startCounting()">
              <div class="game-mode-icon">?뵢</div>
              <div>
                <div class="game-mode-name">?レ옄 ?멸린</div>
                <div class="game-mode-desc">?대え吏 ?멸퀬 ?レ옄 留욎텛湲?/div>
              </div>
            </button>
            <button class="game-mode-card" onclick="Game.startBlockCount25D()">
              <div class="game-mode-icon">?㎟</div>
              <div>
                <div class="game-mode-name">2.5D 釉붾줉 ?멸린</div>
                <div class="game-mode-desc">?낆껜 釉붾줉 珥?媛쒖닔 留욎텛湲?(100臾몄젣)</div>
              </div>
            </button>
            <button class="game-mode-card" onclick="Game.startBlockCount25D('infinite')">
              <div class="game-mode-icon">??/div>
              <div>
                <div class="game-mode-name">釉붾줉 臾댄븳紐⑤뱶</div>
                <div class="game-mode-desc">2.5D 釉붾줉 ?멸린 ?앷퉴吏 ?꾩쟾</div>
              </div>
            </button>
            <button class="game-mode-card" onclick="Game.startSpatialMatrix25D()">
              <div class="game-mode-icon">🧠</div>
              <div>
                <div class="game-mode-name">2.5D 매트릭스 IQ</div>
                <div class="game-mode-desc">행/열 패턴 빈칸 규칙 찾기</div>
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
    this.quizInfiniteLives = 0;
    this.quizInfiniteCombo = 0;
    this.quizInfiniteBestCombo = 0;
    this.quizInfiniteSessionBest = 0;
    this.quizQueue = this.buildQuizQueue(this.items, 10);
    this.quizIndex = 0;
    this.showQuizQuestion();
  },

  startQuizMarathon(categoryId) {
    this.clearTimers();
    if (categoryId === 'math') {
      this.startMathQuiz('mixed', 20, 'quiz-marathon');
      return;
    }
    const safeCategory = CATEGORIES[categoryId] ? categoryId : 'hangul';
    this.currentCategory = safeCategory;
    this.items = getAllCategoryItems(safeCategory);
    this.score = 0;
    this.total = 0;
    this.quizGameType = 'quiz-marathon';
    this.mathQuestionMode = null;
    this.quizInfiniteLives = 0;
    this.quizInfiniteCombo = 0;
    this.quizInfiniteBestCombo = 0;
    this.quizInfiniteSessionBest = 0;
    this.quizQueue = this.buildQuizQueue(this.items, 20);
    this.quizIndex = 0;
    this.showQuizQuestion();
  },

  startQuizInfinite(categoryId) {
    this.clearTimers();
    if (categoryId === 'math') {
      this.startMathQuiz('mixed', 200, 'quiz-infinite');
      this.quizInfiniteLives = 3;
      return;
    }
    const safeCategory = CATEGORIES[categoryId] ? categoryId : 'hangul';
    this.currentCategory = safeCategory;
    this.items = getAllCategoryItems(safeCategory);
    this.score = 0;
    this.total = 0;
    this.quizGameType = 'quiz-infinite';
    this.mathQuestionMode = null;
    this.quizInfiniteLives = 3;
    this.quizInfiniteCombo = 0;
    this.quizInfiniteSessionBest = 0;
    this.quizInfiniteBestCombo = this.getComboRecord('quiz-infinite');
    this.quizQueue = this.buildQuizQueue(this.items, 200);
    this.quizIndex = 0;
    this.showQuizQuestion();
  },

  buildQuizQueue(items, targetSize = 10) {
    const source = Array.isArray(items) ? items.filter(Boolean) : [];
    const size = Math.max(1, Number(targetSize) || 10);
    if (!source.length) return [];
    const queue = [];
    while (queue.length < size) {
      const shuffled = this._shuffle([...source]);
      for (let i = 0; i < shuffled.length && queue.length < size; i++) {
        queue.push(shuffled[i]);
      }
      if (source.length === 1) break;
    }
    return queue.slice(0, size);
  },

  startTimesTableQuiz() {
    this.startMathQuiz('times');
  },

  startMathQuiz(mode = 'mixed', rounds = 10, gameType = null) {
    this.clearTimers();
    this.currentCategory = 'math';
    this.score = 0;
    this.total = 0;
    this.quizGameType = gameType || (mode === 'times' ? 'times' : 'quiz');
    this.mathQuestionMode = mode;
    this.quizInfiniteLives = this.quizGameType === 'quiz-infinite' ? 3 : 0;
    this.quizInfiniteCombo = 0;
    this.quizInfiniteSessionBest = 0;
    this.quizInfiniteBestCombo = this.quizGameType === 'quiz-infinite'
      ? this.getComboRecord('quiz-infinite')
      : 0;
    const quizRounds = Math.max(1, Number(rounds) || 10);
    this.quizQueue = Array.from({ length: quizRounds }, () => this.generateMathQuestion(mode));
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
    let speakWord = '?뷀븯湲?;
    let emoji = '??;

    if (op === 'add') {
      const max = ageGroup === 'older' ? 30 : (ageGroup === 'child' ? 20 : 10);
      a = Math.floor(Math.random() * max) + 1;
      b = Math.floor(Math.random() * max) + 1;
      answer = a + b;
      symbol = '+';
      speakWord = '?뷀븯湲?;
      emoji = '??;
    } else if (op === 'sub') {
      const max = ageGroup === 'older' ? 30 : (ageGroup === 'child' ? 20 : 10);
      a = Math.floor(Math.random() * max) + 1;
      b = Math.floor(Math.random() * a) + 1;
      answer = a - b;
      symbol = '-';
      speakWord = '鍮쇨린';
      emoji = '??;
    } else if (op === 'mul' || op === 'times') {
      const danMax = ageGroup === 'toddler' ? 5 : 9;
      a = Math.floor(Math.random() * (danMax - 1)) + 2;
      b = Math.floor(Math.random() * (ageGroup === 'older' ? 9 : 6)) + 1;
      answer = a * b;
      symbol = '횞';
      speakWord = '怨깊븯湲?;
      emoji = op === 'times' ? '?뵢' : '?뽳툘';
    } else {
      const divisorMax = ageGroup === 'older' ? 12 : (ageGroup === 'child' ? 9 : 5);
      b = Math.floor(Math.random() * (divisorMax - 1)) + 2;
      answer = Math.floor(Math.random() * (ageGroup === 'older' ? 12 : 9)) + 1;
      a = b * answer;
      symbol = '첨';
      speakWord = '?섎늻湲?;
      emoji = '??;
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
      emoji: '?뵢',
    })));
  },

  showQuizQuestion() {
    const isInfiniteQuiz = this.quizGameType === 'quiz-infinite';
    if (isInfiniteQuiz && this.quizInfiniteLives <= 0) {
      this.showResult('quiz-infinite');
      return;
    }

    if (this.quizIndex >= this.quizQueue.length) {
      if (isInfiniteQuiz) {
        if (this.currentCategory === 'math') {
          const refillSize = Math.max(50, this.quizQueue.length || 200);
          this.quizQueue = Array.from({ length: refillSize }, () => this.generateMathQuestion(this.mathQuestionMode || 'mixed'));
        } else {
          const refillSize = Math.max(50, this.quizQueue.length || 200);
          this.quizQueue = this.buildQuizQueue(this.items, refillSize);
        }
        this.quizIndex = 0;
      } else {
        this.showResult(this.quizGameType || 'quiz');
        return;
      }
    }

    if (!this.quizQueue.length) {
      this.showResult(this.quizGameType || 'quiz');
      return;
    }

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
    const quizTitle = isMathQuiz
      ? (this.quizGameType === 'times'
        ? '援ш뎄???댁쫰'
        : (this.quizGameType === 'quiz-marathon'
          ? '?섑븰 留덈씪??
          : (this.quizGameType === 'quiz-infinite' ? '?섑븰 臾댄븳紐⑤뱶' : '?곗궛 ?댁쫰')))
      : (this.quizGameType === 'quiz-marathon'
        ? '?щ윭 ?댁쫰 ?湲?
        : (this.quizGameType === 'quiz-infinite' ? '?댁쫰 臾댄븳紐⑤뱶' : '湲??留욎텛湲?));
    const quizProgress = isInfiniteQuiz
      ? ((this.total % 20) / 20) * 100
      : (this.quizIndex / Math.max(1, this.quizQueue.length)) * 100;
    const quizScoreLabel = isInfiniteQuiz
      ? `狩?${this.score} | ?ㅿ툘 ${this.quizInfiniteLives} | ?뵦 x${this.quizInfiniteCombo} | ?룇 x${this.quizInfiniteBestCombo}`
      : `狩?${this.score}`;
    screen.innerHTML = `
      <div class="quiz-container">
        <div class="learn-header">
          <button class="btn-back" onclick="Game.showSelection('${this.currentCategory}')">
            <span class="back-arrow">&larr;</span>
          </button>
          <h2 class="learn-title">${quizTitle}</h2>
          <span class="game-score">${quizScoreLabel}</span>
        </div>
        <div class="quiz-progress">
          <div class="quiz-progress-bar" style="width:${quizProgress}%"></div>
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
        ${profile.autoHint ? '<div class="quiz-hint" id="quiz-hint" style="display:none">?뮕 諛섏쭩?대뒗 寃껋씠 ?뺣떟?댁뿉??</div>' : ''}
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
      if (this.quizGameType === 'quiz-infinite') {
        this.quizInfiniteCombo += 1;
        this.quizInfiniteSessionBest = Math.max(this.quizInfiniteSessionBest, this.quizInfiniteCombo);
        if (this.quizInfiniteCombo > this.quizInfiniteBestCombo) {
          this.quizInfiniteBestCombo = this.quizInfiniteCombo;
          this.updateComboRecord('quiz-infinite', this.quizInfiniteBestCombo);
        }
      }
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
      this.recordWrongAttempt(this.currentCategory, correct);
      if (this.quizGameType === 'quiz-infinite') {
        this.quizInfiniteCombo = 0;
        this.quizInfiniteLives = Math.max(0, (this.quizInfiniteLives || 0) - 1);
        allBtns.forEach((b) => {
          b.disabled = true;
          if (String(b.dataset.char) === String(correct)) b.classList.add('correct');
        });
        if (this.quizInfiniteLives <= 0) {
          this.schedule(() => this.showResult('quiz-infinite'), 900);
        } else {
          this.schedule(() => { this.quizIndex++; this.showQuizQuestion(); }, 1100);
        }
        return;
      }
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
          <h2 class="learn-title">吏?留욎텛湲?/h2>
          <span class="game-score">狩?${this.score}</span>
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
          if (scoreEl) scoreEl.textContent = `狩?${this.score}`;
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
          <h2 class="learn-title">?뚮━ 李얘린</h2>
          <span class="game-score">狩?${this.score}</span>
        </div>
        <div class="quiz-progress">
          <div class="quiz-progress-bar" style="width:${(this.soundIndex/this.soundQueue.length)*100}%"></div>
        </div>
        <div class="sound-prompt">
          <button class="btn-play-sound" onclick="Game.playSoundHint()">
            ?뵄<br><span class="sound-label">?뚮━ ?ｊ린</span>
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
      this.recordWrongAttempt(this.currentCategory, correct);
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
          <h2 class="learn-title">?곕씪?곌린</h2>
          <span class="game-score">狩?${this.score} | ${this.tracingIndex+1}/${this.tracingQueue.length}</span>
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
          <button class="btn-secondary" onclick="Game.clearTracing()">吏?곌린 ?뿊截?/button>
          <button class="btn-primary" onclick="Game.checkTracing()">?꾩꽦! ??/button>
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
      // Not enough ??encourage
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
  blockCountQueue: [],
  blockCountIndex: 0,

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

  startBlockCount25D(mode = 'normal') {
    this.clearTimers();
    this.currentCategory = 'number';
    this.blockCountMode = mode === 'infinite' ? 'infinite' : 'normal';
    this.currentGame = this.blockCountMode === 'infinite' ? 'block-count-25d-infinite' : 'block-count-25d';
    this.score = 0;
    this.total = 0;
    this.blockCountLives = this.blockCountMode === 'infinite' ? 3 : 0;
    this.blockCountCombo = 0;
    this.blockCountSessionBest = 0;
    this.blockCountBestCombo = this.blockCountMode === 'infinite'
      ? this.getComboRecord('block-count-25d-infinite')
      : 0;
    const profile = Profile.getCurrent();
    const ageGroup = profile?.ageGroup || 'child';
    const allowedTiers = ageGroup === 'toddler'
      ? new Set(['toddler'])
      : (ageGroup === 'child' ? new Set(['toddler', 'child']) : new Set(['child', 'older']));
    const pool = BLOCK_COUNT_25D_LIBRARY.filter((row) => allowedTiers.has(row.tier));
    const shuffled = this._shuffle([...pool]);
    const queueSize = this.blockCountMode === 'infinite'
      ? Math.max(10, Math.min(shuffled.length, 30))
      : 10;
    this.blockCountQueue = shuffled.slice(0, queueSize);
    this.blockCountIndex = 0;
    this.showBlockCountQuestion();
  },

  showBlockCountQuestion() {
    const isInfiniteMode = this.blockCountMode === 'infinite';
    if (isInfiniteMode && this.blockCountLives <= 0) {
      this.showResult('block-count-25d-infinite');
      return;
    }
    if (this.blockCountIndex >= this.blockCountQueue.length) {
      if (isInfiniteMode) {
        const profile = Profile.getCurrent();
        const ageGroup = profile?.ageGroup || 'child';
        const allowedTiers = ageGroup === 'toddler'
          ? new Set(['toddler'])
          : (ageGroup === 'child' ? new Set(['toddler', 'child']) : new Set(['child', 'older']));
        const pool = BLOCK_COUNT_25D_LIBRARY.filter((row) => allowedTiers.has(row.tier));
        const shuffled = this._shuffle([...pool]);
        const queueSize = Math.max(10, Math.min(shuffled.length, 30));
        this.blockCountQueue = shuffled.slice(0, queueSize);
        this.blockCountIndex = 0;
      } else {
        this.showResult('block-count-25d');
        return;
      }
    }
    const profile = Profile.getCurrent();
    const challenge = this.blockCountQueue[this.blockCountIndex];
    const correct = Number(challenge?.targetCount) || 1;
    const choices = this.buildBlockCountChoices(correct, profile.countingMax || 20, profile.quizChoices || 4);
    const blockTitle = isInfiniteMode ? '2.5D 釉붾줉 臾댄븳紐⑤뱶' : '2.5D 釉붾줉 ?멸린';
    const blockScoreLabel = isInfiniteMode
      ? `狩?${this.score} | ?ㅿ툘 ${this.blockCountLives} | ?뵦 x${this.blockCountCombo} | ?룇 x${this.blockCountBestCombo}`
      : `狩?${this.score} | ${this.blockCountIndex + 1}/${this.blockCountQueue.length}`;

    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="counting-container block-count-container">
        <div class="learn-header">
          <button class="btn-back" onclick="Game.showSelection('number')">
            <span class="back-arrow">&larr;</span>
          </button>
          <h2 class="learn-title">${blockTitle}</h2>
          <span class="game-score">${blockScoreLabel}</span>
        </div>
        <div class="counting-question">釉붾줉??珥?紐?媛쒖씪源?</div>
        <div class="counting-scene">${challenge?.title || '2.5D 釉붾줉 ?쇱쫹'}</div>
        <div class="block-scene">
          ${this.renderBlockStacks(challenge)}
        </div>
        <div class="counting-choices">
          ${choices.map((n) => `
            <button class="counting-choice" onclick="Game.checkBlockCount(${n}, ${correct}, this)">
              ${n}
            </button>
          `).join('')}
        </div>
      </div>
    `;
    App.showScreen('game');
  },

  renderBlockStacks(challenge) {
    const stacks = Array.isArray(challenge?.stacks) ? challenge.stacks : [];
    return stacks.map((stack, stackIndex) => {
      const cubes = Array.from({ length: Math.max(1, Number(stack.h) || 1) }, (_, z) => `
        <span class="iso-cube" style="--z:${z}" aria-hidden="true"></span>
      `).join('');
      return `
        <div class="iso-stack" style="--gx:${Number(stack.gx) || 0}; --gy:${Number(stack.gy) || 0}" data-stack="${stackIndex}">
          ${cubes}
        </div>
      `;
    }).join('');
  },

  buildBlockCountChoices(correct, maxBase, choiceBase) {
    const max = Math.max(correct + 2, Number(maxBase) || 20);
    const choiceCount = Math.max(2, Number(choiceBase) || 4);
    const choices = new Set([correct]);
    while (choices.size < choiceCount) {
      const delta = Math.floor(Math.random() * 7) - 3;
      let candidate = correct + delta;
      if (candidate < 1 || candidate > max) {
        candidate = Math.floor(Math.random() * max) + 1;
      }
      choices.add(candidate);
    }
    return this._shuffle(Array.from(choices));
  },

  checkBlockCount(selected, correct, btn) {
    this.total++;
    const allBtns = document.querySelectorAll('.counting-choice');
    if (selected === correct) {
      btn.classList.add('correct');
      this.score++;
      if (this.blockCountMode === 'infinite') {
        this.blockCountCombo += 1;
        this.blockCountSessionBest = Math.max(this.blockCountSessionBest, this.blockCountCombo);
        if (this.blockCountCombo > this.blockCountBestCombo) {
          this.blockCountBestCombo = this.blockCountCombo;
          this.updateComboRecord('block-count-25d-infinite', this.blockCountBestCombo);
        }
      }
      Reward.addStars(Profile.getCurrent().starsPerCorrect);
      SFX.play('correct');
      const progress = Storage.getProgress(App.currentProfile);
      progress.blockCount25dCorrect = (progress.blockCount25dCorrect || 0) + 1;
      Storage.saveProgress(App.currentProfile, progress);
      Reward.addXP(Profile.getCurrent().xpPerGame);
      Daily.updateMissionProgress('counting');
      allBtns.forEach((b) => { b.disabled = true; });
      this.schedule(() => {
        this.blockCountIndex++;
        this.showBlockCountQuestion();
      }, 800);
      return;
    }

    btn.classList.add('wrong');
    SFX.play('wrong');
    this.recordWrongAttempt('number', correct);
    if (this.blockCountMode === 'infinite') {
      this.blockCountCombo = 0;
      this.blockCountLives = Math.max(0, (this.blockCountLives || 0) - 1);
      allBtns.forEach((b) => {
        b.disabled = true;
        if (parseInt(b.textContent, 10) === correct) b.classList.add('correct');
      });
      if (this.blockCountLives <= 0) {
        this.schedule(() => this.showResult('block-count-25d-infinite'), 900);
      } else {
        this.schedule(() => {
          this.blockCountIndex++;
          this.showBlockCountQuestion();
        }, 1100);
      }
      return;
    }
    if (Profile.getCurrent().wrongRetry) {
      btn.disabled = true;
      return;
    }
    allBtns.forEach((b) => {
      b.disabled = true;
      if (parseInt(b.textContent, 10) === correct) b.classList.add('correct');
    });
    this.schedule(() => {
      this.blockCountIndex++;
      this.showBlockCountQuestion();
    }, 1200);
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
          <h2 class="learn-title">?レ옄 ?멸린</h2>
          <span class="game-score">狩?${this.score} | ${this.countingIndex+1}/${this.countingQueue.length}</span>
        </div>
        <div class="counting-buddy" aria-live="polite">
          <span class="counting-buddy-icon" aria-hidden="true">${buddy.emoji}</span>
          <div class="counting-buddy-text">
            <strong>${buddy.name}</strong>
            <span>${buddy.message}</span>
          </div>
        </div>
        <div class="counting-question">紐?媛쒖씪源?</div>
        <div class="counting-scene">${q.scene?.title || '?レ옄 ??댄꽣'}</div>
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
      this.recordWrongAttempt('number', correct);
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
    let emoji = '?뵢';

    if (type === 'count') {
      const max = ageGroup === 'toddler' ? 8 : (ageGroup === 'child' ? 15 : 20);
      answer = Math.floor(Math.random() * max) + 1;
      question = `?뜋 ${answer}媛쒕뒗 ?レ옄濡??쇰쭏?쇨퉴?`;
      emoji = '?뜋';
    } else if (type === 'next') {
      const maxBase = ageGroup === 'toddler' ? 8 : (ageGroup === 'child' ? 20 : 40);
      const n = Math.floor(Math.random() * maxBase) + 1;
      answer = n + 1;
      question = `${n} ?ㅼ쓬 ?レ옄??`;
      emoji = '?∽툘';
    } else if (type === 'sub') {
      const a = Math.floor(Math.random() * (ageGroup === 'older' ? 25 : 15)) + 6;
      const b = Math.floor(Math.random() * Math.min(9, a - 1)) + 1;
      answer = a - b;
      question = `${a} - ${b} = ?`;
      emoji = '??;
    } else {
      const maxA = ageGroup === 'older' ? 20 : 12;
      const maxB = ageGroup === 'older' ? 12 : 9;
      const a = Math.floor(Math.random() * maxA) + 1;
      const b = Math.floor(Math.random() * maxB) + 1;
      answer = a + b;
      question = `${a} + ${b} = ?`;
      emoji = '??;
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
      return { answer: '1', question: '1 + 0 = ?', emoji: '??, choices: ['1', '2', '3', '4'] };
    }
    const pick = items[Math.floor(Math.random() * items.length)];
    const answer = String(pick.char);
    const pool = mode === 'english'
      ? items.filter((item) => /^[A-Za-z]$/.test(item.char)).map((item) => item.char.toUpperCase())
      : items.map((item) => item.char);
    const normalizedAnswer = mode === 'english' ? answer.toUpperCase() : answer;
    const choices = this.pickTowerChoices(normalizedAnswer, pool);
    const label = mode === 'english' ? '?곸뼱' : '?쒓?';
    return {
      answer: normalizedAnswer,
      question: `${label} ??? ${pick.word}??留욌뒗 湲?먮뒗?`,
      emoji: pick.emoji || (mode === 'english' ? '?뵥' : '?뵡'),
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
          <span>${built ? '狩? : ''}</span>
        </div>
      `);
    }
    return rows.join('');
  },

  towerTitleByCategory() {
    if (this.currentCategory === 'hangul') return '2.5D ?쒓? ???;
    if (this.currentCategory === 'english') return '2.5D ?곸뼱 ???;
    return '2.5D ?レ옄 ???;
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
          <span class="game-score">狩?${this.score}</span>
        </div>

        <div class="tower-hud">
          <span>?쇱슫??${this.towerIndex + 1}/${maxRounds}</span>
          <span>?앸챸 ${'?ㅿ툘'.repeat(this.towerLives)}</span>
          <span>???${this.towerHeight}痢?/span>
        </div>

        <div class="tower-combo-chip ${this.towerCombo >= 2 ? 'active' : ''}">
          肄ㅻ낫 x${Math.max(1, this.towerCombo)}
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

  buildShape3DQuestion(mode = 'match') {
    const answerShape = SHAPE_3D_LIBRARY[Math.floor(Math.random() * SHAPE_3D_LIBRARY.length)];
    const promptPool = mode === 'net'
      ? [
        `?꾧컻???뚰듃: ${answerShape.netHint}`,
        `???꾧컻?꾨뒗 ?대뼡 ?낆껜?꾪삎?쇨퉴?\n${answerShape.netVisual}`,
      ]
      : [
        `${answerShape.clue}\n???뱀쭠??媛吏??낆껜?꾪삎??`,
        `${answerShape.emoji} ?(怨? 媛숈? ?꾪삎 ?대쫫??`,
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
    const title = q.mode === 'net' ? '3D 紐⑦삎 ?댁꽍' : '3D ?꾪삎 留욎텛湲?;
    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="shape3d-container">
        <div class="learn-header">
          <button class="btn-back" onclick="Game.showSelection('math')">
            <span class="back-arrow">&larr;</span>
          </button>
          <h2 class="learn-title">${title}</h2>
          <span class="game-score">狩?${this.score}</span>
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

  // ===== 2.5D SPATIAL MATRIX IQ =====
  startSpatialMatrix25D() {
    this.clearTimers();
    this.currentCategory = 'math';
    this.currentGame = 'spatial-matrix-25d';
    this.score = 0;
    this.total = 0;
    this.spatialMatrixIndex = 0;
    this.spatialMatrixQueue = Array.from({ length: 10 }, (_, idx) => this.buildSpatialMatrixQuestion(idx));
    this.showSpatialMatrixQuestion();
  },

  buildSpatialMatrixQuestion(seed = 0) {
    const level = seed < 4 ? 1 : (seed < 8 ? 2 : 3);
    const rulePool = level === 1
      ? ['row-shift', 'col-shift']
      : (level === 2 ? ['row-shift', 'col-shift', 'row-sum'] : ['row-sum', 'row-shift', 'col-shift']);
    const rule = rulePool[Math.floor(Math.random() * rulePool.length)];
    const maxValue = level >= 3 ? 6 : 5;
    let grid = Array(9).fill(1);
    let hint = '행과 열의 규칙을 찾아 빈칸을 완성해요.';

    if (rule === 'row-sum') {
      hint = '각 행의 세 번째 칸은 앞의 두 칸 규칙으로 만들어져요.';
      const rows = [];
      for (let r = 0; r < 3; r++) {
        const a = Math.floor(Math.random() * (maxValue - 2)) + 1;
        const b = Math.floor(Math.random() * (maxValue - a)) + 1;
        const c = Math.min(maxValue, a + b);
        rows.push([a, b, c]);
      }
      grid = rows.flat();
    } else if (rule === 'col-shift') {
      hint = '아래로 갈수록 같은 규칙으로 값이 이동해요.';
      const step = Math.random() < 0.5 ? 1 : 2;
      const base = [
        Math.floor(Math.random() * maxValue) + 1,
        Math.floor(Math.random() * maxValue) + 1,
        Math.floor(Math.random() * maxValue) + 1,
      ];
      const rows = [];
      for (let r = 0; r < 3; r++) {
        rows.push(base.map((v) => ((v + (step * r) - 1) % maxValue) + 1));
      }
      grid = rows.flat();
    } else {
      hint = '오른쪽으로 갈수록 같은 간격으로 값이 바뀌어요.';
      const step = Math.random() < 0.5 ? 1 : 2;
      const rows = [];
      for (let r = 0; r < 3; r++) {
        const start = Math.floor(Math.random() * maxValue) + 1;
        rows.push([
          start,
          ((start + step - 1) % maxValue) + 1,
          ((start + step * 2 - 1) % maxValue) + 1,
        ]);
      }
      grid = rows.flat();
    }

    const missingIndex = Math.floor(Math.random() * 9);
    const correct = Number(grid[missingIndex]) || 1;
    const choices = this.buildSpatialMatrixChoices(correct, maxValue);
    return {
      grid,
      missingIndex,
      correct,
      choices,
      hint,
      level,
    };
  },

  buildSpatialMatrixChoices(correct, maxValue = 6) {
    const limit = Math.max(3, Number(maxValue) || 6);
    const choices = new Set([correct]);
    while (choices.size < 4) {
      const jitter = Math.floor(Math.random() * 5) - 2;
      let candidate = correct + jitter;
      if (candidate < 1 || candidate > limit) {
        candidate = Math.floor(Math.random() * limit) + 1;
      }
      choices.add(candidate);
    }
    return this._shuffle(Array.from(choices));
  },

  renderMatrixCubeTile(value, tone = 'normal') {
    const total = Math.max(1, Number(value) || 1);
    const cubes = Array.from({ length: total }, (_, idx) => `
      <span class="matrix-mini-cube" style="--cube-z:${idx}" aria-hidden="true"></span>
    `).join('');
    return `<span class="matrix-mini-stack ${tone}">${cubes}</span>`;
  },

  showSpatialMatrixQuestion() {
    if (this.spatialMatrixIndex >= (this.spatialMatrixQueue?.length || 0)) {
      this.showResult('spatial-matrix-25d');
      return;
    }

    const q = this.spatialMatrixQueue[this.spatialMatrixIndex];
    const cells = q.grid.map((value, idx) => {
      if (idx === q.missingIndex) {
        return `
          <div class="spatial-matrix-cell missing">
            <span class="spatial-matrix-missing">?</span>
          </div>
        `;
      }
      return `<div class="spatial-matrix-cell">${this.renderMatrixCubeTile(value)}</div>`;
    }).join('');

    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="spatial-matrix-container">
        <div class="learn-header">
          <button class="btn-back" onclick="Game.showSelection('math')">
            <span class="back-arrow">&larr;</span>
          </button>
          <h2 class="learn-title">2.5D 매트릭스 IQ</h2>
          <span class="game-score">⭐ ${this.score} | ${this.spatialMatrixIndex + 1}/${this.spatialMatrixQueue.length}</span>
        </div>
        <div class="quiz-progress">
          <div class="quiz-progress-bar" style="width:${(this.spatialMatrixIndex / this.spatialMatrixQueue.length) * 100}%"></div>
        </div>
        <div class="spatial-matrix-hint">${q.hint}</div>
        <div class="spatial-matrix-grid">${cells}</div>
        <div class="spatial-matrix-choices">
          ${q.choices.map((choice) => `
            <button class="spatial-matrix-choice" data-choice="${choice}" onclick="Game.checkSpatialMatrixChoice(${choice}, ${q.correct}, this)">
              ${this.renderMatrixCubeTile(choice, 'choice')}
            </button>
          `).join('')}
        </div>
      </div>
    `;
    App.showScreen('game');
  },

  checkSpatialMatrixChoice(selected, correct, btn) {
    const profile = Profile.getCurrent();
    const allBtns = [...document.querySelectorAll('.spatial-matrix-choice')];
    this.total++;
    if (selected === correct) {
      btn.classList.add('correct');
      this.score++;
      Reward.addStars(profile.starsPerCorrect + 1);
      Reward.addXP(profile.xpPerGame + 4);
      SFX.play('correct');

      const progress = Storage.getProgress(App.currentProfile);
      progress.spatialMatrixCorrect = (progress.spatialMatrixCorrect || 0) + 1;
      Storage.saveProgress(App.currentProfile, progress);
      Daily.updateMissionProgress('spatial');

      allBtns.forEach((b) => { b.disabled = true; });
      this.schedule(() => {
        this.spatialMatrixIndex++;
        this.showSpatialMatrixQuestion();
      }, 850);
      return;
    }

    btn.classList.add('wrong');
    SFX.play('wrong');
    this.recordWrongAttempt('math', correct);
    if (profile.wrongRetry) {
      btn.disabled = true;
      return;
    }
    allBtns.forEach((b) => { b.disabled = true; });
    const correctBtn = allBtns.find((node) => Number(node.dataset.choice) === Number(correct));
    if (correctBtn) correctBtn.classList.add('correct');
    this.schedule(() => {
      this.spatialMatrixIndex++;
      this.showSpatialMatrixQuestion();
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
      ? ['??⑦빐?? ?뙚', '理쒓퀬?덉슂! ?몣', '硫뗭졇?? ??]
      : this.score >= totalDisplay * 0.5
        ? ['?섑뻽?댁슂! ?삃', '醫뗭븘?? ?뮞']
        : ['?ㅼ떆 ?대낵源뚯슂? ?뮟', '愿쒖갖?꾩슂! ?뙂'];
    const msg = messages[Math.floor(Math.random() * messages.length)];
    let comboMetaHtml = '';
    if (gameType === 'quiz-infinite') {
      const personalBest = Math.max(this.quizInfiniteBestCombo, this.getComboRecord('quiz-infinite'));
      const sessionBest = Math.max(0, Number(this.quizInfiniteSessionBest) || 0);
      const rank = this.getComboRankLabel(personalBest);
      comboMetaHtml = `
        <div class="result-meta">?뵦 ?대쾲 理쒓퀬 肄ㅻ낫 x${sessionBest}</div>
        <div class="result-meta">?룇 媛쒖씤 理쒓퀬 x${personalBest} 쨌 ??겕 ${rank}</div>
      `;
    } else if (gameType === 'block-count-25d-infinite') {
      const personalBest = Math.max(this.blockCountBestCombo, this.getComboRecord('block-count-25d-infinite'));
      const sessionBest = Math.max(0, Number(this.blockCountSessionBest) || 0);
      const rank = this.getComboRankLabel(personalBest);
      comboMetaHtml = `
        <div class="result-meta">?뵦 ?대쾲 理쒓퀬 肄ㅻ낫 x${sessionBest}</div>
        <div class="result-meta">?룇 媛쒖씤 理쒓퀬 x${personalBest} 쨌 ??겕 ${rank}</div>
      `;
    }
    Reward.checkBadges();

    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="result-container">
        <div class="result-stars">${'狩?.repeat(Math.min(this.score, 10))}</div>
        <h2 class="result-message">${msg}</h2>
        <div class="result-score">${this.score} / ${totalDisplay}</div>
        ${comboMetaHtml}
        <div class="result-buttons">
          <button class="btn-primary" onclick="Game.restart('${gameType}')">?ㅼ떆 ?섍린 ?봽</button>
          <button class="btn-secondary" onclick="Game.showSelection('${this.currentCategory}')">?ㅻⅨ 寃뚯엫 ?렜</button>
          <button class="btn-secondary" onclick="App.navigate('home')">?덉쑝濡??룧</button>
        </div>
      </div>
    `;
    SFX.play('celebrate');
  },

  restart(gameType) {
    switch (gameType) {
      case 'quiz': this.startQuiz(this.currentCategory); break;
      case 'quiz-marathon': this.startQuizMarathon(this.currentCategory); break;
      case 'quiz-infinite': this.startQuizInfinite(this.currentCategory); break;
      case 'times': this.startTimesTableQuiz(); break;
      case 'matching': this.startMatching(this.currentCategory); break;
      case 'sound': this.startSound(this.currentCategory); break;
      case 'tracing': this.startTracing(this.currentCategory); break;
      case 'counting': this.startCounting(); break;
      case 'block-count-25d': this.startBlockCount25D(); break;
      case 'block-count-25d-infinite': this.startBlockCount25D('infinite'); break;
      case 'spatial-matrix-25d': this.startSpatialMatrix25D(); break;
      case 'tower': this.startSkyTower(this.currentCategory || 'number'); break;
      case 'shape3d': this.startShape3DMatch(); break;
      case 'net3d': this.startShapeNetLab(); break;
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
    const sceneMessage = scene?.title ? `${scene.title}?먯꽌 泥쒖쿇???몄뼱 蹂댁옄!` : defaultMessage;
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


