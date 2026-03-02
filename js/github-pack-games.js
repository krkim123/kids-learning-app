(() => {
  if (typeof Game === 'undefined') return;

  const PLAYABLE_PACK_GAMES = [
    { id: 'educational-html-games', label: '웹 학습 게임', short: '수학 고르기', source: 'jkanev/educational-html-games' },
    { id: 'edukiz', label: '이모지 단어 맞추기', short: '단어 연결', source: 'timmalich/edukiz' },
    { id: 'natan-js', label: '참/거짓 수학', short: '정답 판별', source: 'ullenius/natan-js' },
    { id: 'spellie', label: '스펠리', short: '단어 추측', source: 'canadianveggie/spellie' },
    { id: 'simon-game', label: '사이먼', short: '순서 기억', source: 'Maheshbharambe45/Simon-game' },
    { id: 'memory', label: '메모리 카드', short: '짝 맞추기', source: 'taniarascia/memory' },
    { id: 'rapid-router', label: '래피드 라우터', short: '길 찾기 퍼즐', source: 'ocadotechnology/rapid-router' },
    { id: 'antura', label: '안투라', short: '단어 만들기', source: 'vgwb/Antura' },
    { id: 'breakout', label: '브레이크아웃', short: '벽돌 깨기', source: 'classic-open-source' },
    { id: 'snake', label: '스네이크', short: '스네이크 아케이드', source: 'classic-open-source' },
    { id: 'tictactoe', label: '틱택토', short: '엑스오 대결', source: 'classic-open-source' },
    { id: 'rps', label: '가위바위보', short: '토너먼트', source: 'classic-open-source' },
    { id: 'whack', label: '두더지 잡기', short: '두더지 스매시', source: 'classic-open-source' },
    { id: 'game2048', label: '2048', short: '숫자 합치기', source: 'classic-open-source' },
    { id: 'minesweeper', label: '지뢰찾기', short: '지뢰 탐색', source: 'classic-open-source' },
    { id: 'flappy', label: '플래피 버드', short: '하늘 날기', source: 'classic-open-source' },
    { id: 'pong', label: '퐁', short: '패들 대결', source: 'classic-open-source' },
    { id: 'invaders', label: '스페이스 인베이더', short: '외계인 슈팅', source: 'classic-open-source' },
  ];

  const EXTRA_GAME_NAMES = [
    'Asteroids',
    'Tetris',
    'Pac-Man',
    'Frogger',
    'Space Shooter',
    'Brick Breaker',
    'Bubble Shooter',
    'Match 3',
    'Connect Four',
    'Hangman',
    'Word Search',
    'Sudoku',
    'Nonogram',
    'Sliding Puzzle',
    'Jigsaw Puzzle',
    'Memory Match',
    'Simon Says',
    'Checkers',
    'Chess',
    'Reversi',
    'Othello',
    'Gomoku',
    'Dots and Boxes',
    'Battleship',
    'Mastermind',
    'Ludo',
    'Snakes and Ladders',
    'Uno Clone',
    'Solitaire',
    'Spider Solitaire',
    'FreeCell',
    'Minesweeper Clone',
    '2048 Clone',
    '15 Puzzle',
    'Sokoban',
    'Bomberman',
    'Tower Defense',
    'Idle Clicker',
    'Cookie Clicker Clone',
    'Platformer',
    'Endless Runner',
    'Flappy Clone',
    'Lunar Lander',
    'Racing 2D',
    'Drift Racer',
    'Kart Racer',
    'Pinball',
    'Air Hockey',
    'Table Tennis',
    'Basketball Shot',
    'Soccer Penalty',
    'Baseball Batting',
    'Bowling',
    'Golf Mini',
    'Darts',
    'Archery',
    'Fishing',
    'Farm Merge',
    'City Builder',
    'Restaurant Tycoon',
    'Zoo Tycoon',
    'Tower Stack',
    'Color Switch',
    'Helix Jump',
    'Crossy Road Clone',
    'Temple Runner',
    'Geometry Dash Clone',
    'Rhythm Tap',
    'Piano Tiles',
    'Dance Rhythm',
    'Trivia Quiz',
    'Math Quiz',
    'Spelling Bee',
    'Typing Speed',
    'Letter Connect',
    'Crossword',
    'Boggle',
    'Anagram',
    'Maze Escape',
    'Labyrinth Ball',
    'Pipe Connect',
    'Water Sort',
    'Block Puzzle',
    'Hex Puzzle',
    'Tangram',
    'Cut the Rope Clone',
    'Angry Birds Clone',
    'Catapult Siege',
    'Top Down Shooter',
    'Zombie Survival',
    'Stealth Puzzle',
    'Escape Room',
    'Hidden Object',
    'Spot the Difference',
    'Dress Up',
    'Cooking Game',
    'Doctor Game',
    'Pet Care',
    'Music Maker',
    'Paint by Number',
  ];

  const GENERATED_TEMPLATE_IDS = [
    'math-fact',
    'odd-emoji',
    'count-emoji',
    'word-mix',
    'color-word',
    'bigger-number',
    'pattern-next',
    'analogy',
    'shape-focus',
    'quick-logic',
    'tap-rush',
    'grid-hunt',
    'rhythm-hit',
  ];

  const GENERATED_PACK_GAMES = EXTRA_GAME_NAMES.map((name, idx) => ({
    id: `extra-${String(idx + 1).padStart(3, '0')}`,
    label: `생성 놀이 ${idx + 1}`,
    short: `놀이 ${idx + 1}`,
    source: `generated/${GENERATED_TEMPLATE_IDS[idx % GENERATED_TEMPLATE_IDS.length]}`,
    kind: 'generated',
    template: GENERATED_TEMPLATE_IDS[idx % GENERATED_TEMPLATE_IDS.length],
    seed: idx + 1,
  }));

  const PACK_GAMES = [...PLAYABLE_PACK_GAMES, ...GENERATED_PACK_GAMES];

  const TITLE_KO = {
    'Educational HTML Games': '웹 학습 게임',
    Edukiz: '이모지 단어 맞추기',
    'Natan JS': '참/거짓 수학',
    Spellie: '스펠리',
    'Simon Game': '사이먼',
    'Memory Cards': '메모리 카드',
    'Rapid Router': '래피드 라우터',
    Antura: '안투라',
    Breakout: '브레이크아웃',
    Snake: '스네이크',
    'Tic Tac Toe': '틱택토',
    'Rock Paper Scissors': '가위바위보',
    'Whack-a-Mole': '두더지 잡기',
    Minesweeper: '지뢰찾기',
    'Flappy Bird': '플래피 버드',
    Pong: '퐁',
    'Space Invaders': '스페이스 인베이더',
  };

  const EDUKIZ_POOL = [
    ['🐶', 'DOG'], ['🐱', 'CAT'], ['🐰', 'RABBIT'], ['🦁', 'LION'], ['🐸', 'FROG'],
    ['🐼', 'PANDA'], ['🍎', 'APPLE'], ['🍌', 'BANANA'], ['🍇', 'GRAPE'], ['🍓', 'BERRY'],
    ['🚗', 'CAR'], ['🚌', 'BUS'], ['🚲', 'BIKE'], ['🚂', 'TRAIN'],
  ];
  const SPELLIE_WORDS = ['APPLE', 'BRAIN', 'CLOUD', 'DREAM', 'FAIRY', 'GRAPE', 'HOUSE', 'LIGHT', 'MUSIC', 'SMILE', 'SPACE', 'STORY', 'WATER', 'WHALE'];
  const SIMON_COLORS = ['red', 'blue', 'green', 'yellow'];
  const MEMORY_EMOJIS = ['🐶', '🐱', '🐸', '🦄', '🚀', '🌈', '🍎', '🍓', '⭐', '🎈'];
  const ROUTER_LEVELS = [
    { size: 5, start: [0, 0], goal: [4, 4], limit: 12, walls: [[1, 1], [1, 2], [3, 3]] },
    { size: 5, start: [4, 0], goal: [0, 4], limit: 14, walls: [[3, 1], [2, 1], [2, 2], [1, 3]] },
    { size: 5, start: [2, 0], goal: [2, 4], limit: 10, walls: [[1, 1], [2, 1], [3, 1], [1, 3], [2, 3], [3, 3]] },
    { size: 6, start: [5, 0], goal: [0, 5], limit: 18, walls: [[4, 1], [4, 2], [3, 2], [2, 2], [1, 3], [1, 4], [2, 4], [3, 4]] },
  ];
  const ANTURA_WORDS = ['STAR', 'BOOK', 'FISH', 'MOON', 'TREE', 'APPLE', 'BREAD', 'SMILE', 'WATER', 'LIGHT'];
  const RPS_CHOICES = ['ROCK', 'PAPER', 'SCISSORS'];
  const GEN_EMOJIS = ['🐶', '🐱', '🐰', '🐼', '🐸', '🦁', '🐵', '🍎', '🍌', '🍇', '🍓', '🚗', '🚂', '🚌', '🚲', '⚽', '🎈', '⭐', '🌈', '🎵'];
  const GEN_WORDS = ['APPLE', 'BANANA', 'ORANGE', 'GRAPE', 'PUZZLE', 'SCHOOL', 'ROCKET', 'FLOWER', 'WATER', 'MUSIC', 'SMILE', 'BREAD', 'FAMILY', 'PLANET', 'BUTTON', 'MARKET', 'RABBIT', 'WINDOW', 'CASTLE', 'GARDEN'];
  const GEN_COLOR_PAIRS = [['빨강', 'RED'], ['파랑', 'BLUE'], ['초록', 'GREEN'], ['노랑', 'YELLOW'], ['보라', 'PURPLE'], ['주황', 'ORANGE'], ['검정', 'BLACK'], ['하양', 'WHITE']];
  const GEN_ANALOGIES = [
    ['CAT', 'KITTEN', 'DOG', 'PUPPY'],
    ['COW', 'CALF', 'HORSE', 'FOAL'],
    ['BIRD', 'NEST', 'BEE', 'HIVE'],
    ['FISH', 'WATER', 'BIRD', 'SKY'],
    ['SUN', 'DAY', 'MOON', 'NIGHT'],
    ['BOOK', 'READ', 'MUSIC', 'LISTEN'],
    ['CAR', 'ROAD', 'BOAT', 'SEA'],
    ['PEN', 'WRITE', 'BRUSH', 'PAINT'],
  ];
  const GEN_LOGIC_BANK = [
    { prompt: '다음 중 과일은?', options: ['APPLE', 'BUS', 'TABLE', 'CLOUD'], correct: 'APPLE' },
    { prompt: '다음 중 탈것은?', options: ['FLOWER', 'CAR', 'BREAD', 'RABBIT'], correct: 'CAR' },
    { prompt: '다음 중 동물은?', options: ['WINDOW', 'MOON', 'CAT', 'PENCIL'], correct: 'CAT' },
    { prompt: '다음 중 하늘에 있는 것은?', options: ['SUN', 'CHAIR', 'SHOE', 'CUP'], correct: 'SUN' },
    { prompt: '다음 중 먹을 수 있는 것은?', options: ['BANANA', 'BOOK', 'PILLOW', 'SOCK'], correct: 'BANANA' },
    { prompt: '다음 중 학교에서 쓰는 것은?', options: ['PEN', 'FISH', 'CLOUD', 'TRAIN'], correct: 'PEN' },
  ];
  const KID_MASCOTS = [
    { name: '별토끼 루미', icon: '🐰', cheers: ['좋아! 또 맞혀보자!', '와우! 반짝이는 정답!', '루미가 박수치는 중!'] },
    { name: '공룡 토비', icon: '🦖', cheers: ['쿵쿵! 멋진 선택!', '토비가 엄지척!', '대단해! 다음 라운드 가자!'] },
    { name: '우주고양이 네오', icon: '🐱', cheers: ['네오 레이더에 정답 포착!', '완벽한 컨트롤!', '우주급 플레이였어!'] },
    { name: '판다 모모', icon: '🐼', cheers: ['천천히도 좋아, 정확하게!', '모모가 응원 중이야!', '아주 잘하고 있어!'] },
    { name: '돌고래 핑', icon: '🐬', cheers: ['핑! 정답 물결이다!', '리듬이 좋아!', '한 번 더 도전!'] },
    { name: '강아지 코코', icon: '🐶', cheers: ['코코가 꼬리 흔드는 중!', '짠! 정답!', '집중력이 최고야!'] },
    { name: '유니콘 미리', icon: '🦄', cheers: ['반짝 콤보가 쌓인다!', '미리가 마법 가루를 뿌렸어!', '아주 화려한 플레이!'] },
    { name: '로봇 볼트', icon: '🤖', cheers: ['시스템 확인: 최고!', '볼트가 레벨업 체크!', '고속 정답 처리 완료!'] },
    { name: '여우 레인', icon: '🦊', cheers: ['레인이 힌트를 챙겼어!', '민첩한 선택!', '센스가 아주 좋아!'] },
    { name: '펭귄 퐁', icon: '🐧', cheers: ['퐁! 시원한 정답!', '지금 페이스 최고야!', '리듬 타고 클리어하자!'] },
    { name: '하마 둥', icon: '🦛', cheers: ['둥! 안정적인 플레이!', '천천히, 정확하게!', '실수해도 괜찮아!'] },
    { name: '부엉이 위즈', icon: '🦉', cheers: ['위즈가 지혜 점수 +1!', '똑똑한 선택이야!', '관찰력이 아주 좋다!'] },
  ];
  const GP_THEME_CLASSES = ['spark', 'rainbow', 'sunset', 'mint', 'ocean', 'candy'];

  function shuffle(arr) {
    const out = [...arr];
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function hashSeed(input) {
    const str = String(input || '');
    let out = 0;
    for (let i = 0; i < str.length; i += 1) out = (out * 31 + str.charCodeAt(i)) >>> 0;
    return out;
  }

  function pickMascot(seed) {
    return KID_MASCOTS[hashSeed(seed) % KID_MASCOTS.length];
  }

  function pickTheme(seed) {
    return GP_THEME_CLASSES[hashSeed(`${seed}-theme`) % GP_THEME_CLASSES.length];
  }

  function getMascotLine(st) {
    const mascot = st && st.mascot ? st.mascot : pickMascot('default');
    const feedback = st && st.feedback ? st.feedback : '';
    if (feedback) return feedback;
    return mascot.cheers[hashSeed(`${st?.id || 'game'}-${st?.round || 0}`) % mascot.cheers.length];
  }

  function hearts(n) {
    const full = '❤️'.repeat(Math.max(0, Math.min(5, n)));
    const empty = '🤍'.repeat(Math.max(0, 5 - Math.min(5, n)));
    return `${full}${empty}`;
  }

  function rewardByScore(score, total) {
    const ratio = total > 0 ? score / total : 1;
    const stars = Math.max(1, Math.round(ratio * 6));
    Reward.addStars(stars);
    Reward.addXP(stars * 3);
    return stars;
  }

  function header(title, rightText) {
    const localized = TITLE_KO[title] || title;
    const st = Game.githubPackState || null;
    if (st && !st.mascot) st.mascot = pickMascot(st.id || title);
    if (st && !st.theme) st.theme = pickTheme(st.id || title);
    const mascot = st && st.mascot ? st.mascot : pickMascot(title);
    const themeClass = st && st.theme ? `gp-theme-${st.theme}` : 'gp-theme-spark';
    const mascotLine = getMascotLine(st);
    return `
      <div class="learn-header">
        <button class="btn-back" onclick="Game.showGithubPack()"><span class="back-arrow">&larr;</span></button>
        <h2 class="learn-title">${escapeHtml(localized)}</h2>
        <span class="game-score">${escapeHtml(rightText || '')}</span>
      </div>
      <div class="gp-mascot-banner ${themeClass}">
        <div class="gp-mascot-icon">${mascot.icon}</div>
        <div class="gp-mascot-copy">
          <strong>${escapeHtml(mascot.name)}</strong>
          <span>${escapeHtml(mascotLine)}</span>
        </div>
      </div>
    `;
  }

  function progressBar(done, total) {
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    return `<div class="quiz-progress"><div class="quiz-progress-bar" style="width:${percent}%"></div></div>`;
  }

  function mcqHud(st) {
    return `
      <div class="gp-hud">
        <div class="gp-hud-pill"><strong>시간</strong><span>${st.timeLeft}초</span></div>
        <div class="gp-hud-pill"><strong>생명</strong><span>${hearts(st.lives)}</span></div>
        <div class="gp-hud-pill"><strong>콤보</strong><span>x${st.combo}</span></div>
      </div>
      <div class="gp-power-row">
        <button class="btn-secondary" onclick="Game._gpUseFifty()" ${st.power?.fiftyUsed ? 'disabled' : ''}>50:50</button>
        <button class="btn-secondary" onclick="Game._gpSkipQuestion()" ${st.power?.skipUsed ? 'disabled' : ''}>스킵 1회</button>
      </div>
    `;
  }

  function arcadeHud(st, extra = '') {
    return `
      <div class="gp-hud">
        <div class="gp-hud-pill"><strong>시간</strong><span>${st.timeLeft ?? 0}초</span></div>
        <div class="gp-hud-pill"><strong>생명</strong><span>${hearts(st.lives ?? 0)}</span></div>
        <div class="gp-hud-pill"><strong>콤보</strong><span>x${st.combo ?? 0}</span></div>
      </div>
      ${extra}
    `;
  }

  Game._gpStopRuntime = function _gpStopRuntime() {
    const st = this.githubPackState;
    if (!st) return;
    if (st.raf) cancelAnimationFrame(st.raf);
    if (st.interval) clearInterval(st.interval);
    if (st.interval2) clearInterval(st.interval2);
    if (Array.isArray(st.timers)) st.timers.forEach((id) => clearTimeout(id));
    if (st.keyHandler) window.removeEventListener('keydown', st.keyHandler);
  };

  Game.showGithubPack = function showGithubPack() {
    this._gpStopRuntime();
    const q = (this.githubPackQuery || '').trim().toLowerCase();
    const list = q
      ? PACK_GAMES.filter((g) => `${g.short} ${g.label} ${g.source}`.toLowerCase().includes(q))
      : PACK_GAMES;
    const screen = document.getElementById('screen-game-select');
    screen.innerHTML = `
      <div class="game-select-container github-pack-container">
        <div class="learn-header">
          <button class="btn-back" onclick="App.tabPlay()"><span class="back-arrow">&larr;</span></button>
          <h2 class="learn-title">깃허브 미니게임 팩</h2>
          <span></span>
        </div>
        <div class="github-pack-intro">오픈소스 스타일 미니게임 총 ${PACK_GAMES.length}종, 전부 앱에서 바로 플레이할 수 있어요.</div>
        <div class="github-pack-toolbar">
          <input
            class="github-pack-search"
            type="search"
            value="${escapeHtml(this.githubPackQuery || '')}"
            placeholder="게임 검색 (예: 벽돌깨기, 퍼즐, 레이싱)"
            oninput="Game.filterGithubPack(this.value)"
          />
          <button class="btn-secondary" onclick="Game.clearGithubPackFilter()">초기화</button>
        </div>
        <div class="github-pack-meta">현재 표시: ${list.length}개</div>
        <div class="github-pack-grid">
          ${list.map((g, i) => `
            <button class="github-pack-card ${g.kind === 'generated' ? 'generated' : 'playable'}" onclick="Game.startGithubPackGame('${g.id}')">
              <div class="github-pack-top">
                <span class="github-pack-badge">#${i + 1}</span>
                <span class="github-pack-source">${escapeHtml(g.kind === 'generated' ? '자동 생성' : '오픈소스')}</span>
              </div>
              <h3><span class="github-pack-mascot">${pickMascot(g.id).icon}</span>${escapeHtml(g.short)}</h3>
              <p>${escapeHtml(g.label)}</p>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    App.showScreen('game-select');
  };

  Game.filterGithubPack = function filterGithubPack(value) {
    this.githubPackQuery = value || '';
    this.showGithubPack();
  };

  Game.clearGithubPackFilter = function clearGithubPackFilter() {
    this.githubPackQuery = '';
    this.showGithubPack();
  };

  Game.startGithubPackGame = function startGithubPackGame(id) {
    this._gpStopRuntime();
    const generated = PACK_GAMES.find((g) => g.id === id && g.kind === 'generated');
    if (generated) return this._gpStartGeneratedPackGame(generated);

    switch (id) {
      case 'educational-html-games': return this._gpStartEducational();
      case 'edukiz': return this._gpStartEdukiz();
      case 'natan-js': return this._gpStartNatan();
      case 'spellie': return this._gpStartSpellie();
      case 'simon-game': return this._gpStartSimon();
      case 'memory': return this._gpStartMemory();
      case 'rapid-router': return this._gpStartRouter();
      case 'antura': return this._gpStartAntura();
      case 'breakout': return this._gpStartBreakout();
      case 'snake': return this._gpStartSnake();
      case 'tictactoe': return this._gpStartTicTacToe();
      case 'rps': return this._gpStartRPS();
      case 'whack': return this._gpStartWhack();
      case 'game2048': return this._gpStart2048();
      case 'minesweeper': return this._gpStartMinesweeper();
      case 'flappy': return this._gpStartFlappy();
      case 'pong': return this._gpStartPong();
      case 'invaders': return this._gpStartInvaders();
      default: return this.showGithubPack();
    }
  };

  Game._gpStartGeneratedPackGame = function _gpStartGeneratedPackGame(cfg) {
    if (cfg.template === 'tap-rush') return this._gpStartTapRush(cfg);
    if (cfg.template === 'grid-hunt') return this._gpStartGridHunt(cfg);
    if (cfg.template === 'rhythm-hit') return this._gpStartRhythmHit(cfg);

    const total = 10 + (cfg.seed % 4); // 10~13 rounds
    const timePerRound = 10 + (cfg.seed % 6);
    this._gpStartMcq(cfg.id, cfg.short, total, (st) => this._gpBuildGeneratedQuestion(cfg, st), { timePerRound, lives: 5 });
    if (this.githubPackState) {
      this.githubPackState.template = cfg.template || null;
      this.githubPackState.generated = true;
    }
  };

  Game._gpStartTapRush = function _gpStartTapRush(cfg) {
    const makeCells = () => Array.from({ length: 9 }, () => GEN_EMOJIS[randInt(0, GEN_EMOJIS.length - 1)]);
    const st = {
      id: cfg.id,
      kind: 'tap-rush',
      template: cfg.template || 'tap-rush',
      generated: true,
      title: cfg.short,
      mascot: pickMascot(cfg.id),
      theme: pickTheme(cfg.id),
      total: 18 + (cfg.seed % 10),
      score: 0,
      hits: 0,
      misses: 0,
      lives: 5,
      combo: 0,
      bestCombo: 0,
      timeLeft: 24 + (cfg.seed % 10),
      active: randInt(0, 8),
      cells: makeCells(),
      feedback: '반짝이는 타겟을 빠르게 눌러봐!',
    };
    this.githubPackState = st;
    this._gpRenderTapRush();

    st.interval = setInterval(() => {
      const cur = this.githubPackState;
      if (!cur || cur.kind !== 'tap-rush') return;
      cur.timeLeft -= 1;
      if (cur.timeLeft <= 0) return this._gpFinish(cur.title, `타임 업! 최고 콤보 x${cur.bestCombo}`);
      this._gpRenderTapRush();
    }, 1000);

    st.interval2 = setInterval(() => {
      const cur = this.githubPackState;
      if (!cur || cur.kind !== 'tap-rush') return;
      let next = randInt(0, 8);
      if (next === cur.active) next = (next + 1) % 9;
      cur.active = next;
      cur.cells = makeCells();
      this._gpRenderTapRush();
    }, 780);
  };

  Game._gpRenderTapRush = function _gpRenderTapRush() {
    const st = this.githubPackState;
    if (!st || st.kind !== 'tap-rush') return;
    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="quiz-container gp-shell gp-theme-${st.theme}">
        ${header(st.title, `성공 ${st.hits}/${st.total}`)}
        ${progressBar(st.hits, st.total)}
        ${arcadeHud(st, `<div class="gp-note">실수 ${st.misses}</div>`)}
        <div class="tap-rush-board">
          ${st.cells.map((emoji, idx) => `
            <button class="tap-rush-cell ${idx === st.active ? 'active' : ''}" onclick="Game._gpTapRushHit(${idx})">
              <span>${emoji}</span>
            </button>
          `).join('')}
        </div>
        <div class="gp-note">${escapeHtml(st.feedback)}</div>
      </div>
    `;
    App.showScreen('game');
  };

  Game._gpTapRushHit = function _gpTapRushHit(index) {
    const st = this.githubPackState;
    if (!st || st.kind !== 'tap-rush') return;

    if (index === st.active) {
      st.hits += 1;
      st.score = st.hits;
      st.combo += 1;
      st.bestCombo = Math.max(st.bestCombo, st.combo);
      st.feedback = `좋아! 콤보 x${st.combo}`;
      SFX.play('correct');
      if (st.hits >= st.total) return this._gpFinish(st.title, `클리어! 최고 콤보 x${st.bestCombo}`);
      let next = randInt(0, 8);
      if (next === st.active) next = (next + 2) % 9;
      st.active = next;
      st.cells = Array.from({ length: 9 }, () => GEN_EMOJIS[randInt(0, GEN_EMOJIS.length - 1)]);
    } else {
      st.misses += 1;
      st.combo = 0;
      st.lives = Math.max(0, st.lives - 1);
      st.feedback = '아쉽다! 반짝이는 칸을 노려봐.';
      SFX.play('wrong');
      if (st.lives <= 0) return this._gpFinish(st.title, `생명 소진! 성공 ${st.hits}`);
    }
    this._gpRenderTapRush();
  };

  Game._gpStartGridHunt = function _gpStartGridHunt(cfg) {
    const rounds = Array.from({ length: 6 + (cfg.seed % 3) }, (_, i) => 3 + ((i + cfg.seed) % 4));
    const st = {
      id: cfg.id,
      kind: 'grid-hunt',
      template: cfg.template || 'grid-hunt',
      generated: true,
      title: cfg.short,
      mascot: pickMascot(cfg.id),
      theme: pickTheme(cfg.id),
      roundPlan: rounds,
      roundIndex: 0,
      total: rounds.reduce((sum, n) => sum + n, 0),
      score: 0,
      lives: 5,
      combo: 0,
      bestCombo: 0,
      timeLeft: 45 + (cfg.seed % 10),
      target: '',
      remaining: 0,
      grid: [],
      feedback: '타겟 이모지를 모두 찾아보자!',
    };
    this.githubPackState = st;
    this._gpSetupGridHuntRound();

    st.interval = setInterval(() => {
      const cur = this.githubPackState;
      if (!cur || cur.kind !== 'grid-hunt') return;
      cur.timeLeft -= 1;
      if (cur.timeLeft <= 0) return this._gpFinish(cur.title, `시간 종료! 점수 ${cur.score}`);
      this._gpRenderGridHunt();
    }, 1000);
  };

  Game._gpSetupGridHuntRound = function _gpSetupGridHuntRound() {
    const st = this.githubPackState;
    if (!st || st.kind !== 'grid-hunt') return;
    if (st.roundIndex >= st.roundPlan.length) return this._gpFinish(st.title, `라운드 완료! 최고 콤보 x${st.bestCombo}`);

    const targetCount = st.roundPlan[st.roundIndex];
    const target = GEN_EMOJIS[randInt(0, GEN_EMOJIS.length - 1)];
    const others = GEN_EMOJIS.filter((x) => x !== target);
    const grid = Array.from({ length: 16 }, () => others[randInt(0, others.length - 1)]);
    shuffle(Array.from({ length: 16 }, (_, i) => i)).slice(0, targetCount).forEach((idx) => { grid[idx] = target; });
    st.grid = grid.map((v) => ({ v, cleared: false }));
    st.target = target;
    st.remaining = targetCount;
    st.feedback = `타겟 ${target} 를 ${targetCount}개 찾으세요!`;
    this._gpRenderGridHunt();
  };

  Game._gpRenderGridHunt = function _gpRenderGridHunt() {
    const st = this.githubPackState;
    if (!st || st.kind !== 'grid-hunt') return;
    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="quiz-container gp-shell gp-theme-${st.theme}">
        ${header(st.title, `라운드 ${Math.min(st.roundIndex + 1, st.roundPlan.length)}/${st.roundPlan.length}`)}
        ${progressBar(st.score, st.total)}
        ${arcadeHud(st, `<div class="gp-note">목표 ${st.target} x${st.remaining}</div>`)}
        <div class="grid-hunt-board">
          ${st.grid.map((cell, idx) => `
            <button class="grid-hunt-cell ${cell.cleared ? 'cleared' : ''}" onclick="Game._gpPickGridHunt(${idx})">
              <span>${cell.cleared ? '✨' : cell.v}</span>
            </button>
          `).join('')}
        </div>
        <div class="gp-note">${escapeHtml(st.feedback)}</div>
      </div>
    `;
    App.showScreen('game');
  };

  Game._gpPickGridHunt = function _gpPickGridHunt(index) {
    const st = this.githubPackState;
    if (!st || st.kind !== 'grid-hunt') return;
    const cell = st.grid[index];
    if (!cell || cell.cleared) return;

    if (cell.v === st.target) {
      cell.cleared = true;
      st.remaining -= 1;
      st.score += 1;
      st.combo += 1;
      st.bestCombo = Math.max(st.bestCombo, st.combo);
      st.feedback = `찾았다! 남은 개수 ${st.remaining}`;
      SFX.play('correct');
      if (st.remaining <= 0) {
        st.roundIndex += 1;
        st.timeLeft += 3;
        st.feedback = '라운드 클리어! 보너스 +3초';
        if (st.roundIndex >= st.roundPlan.length) return this._gpFinish(st.title, `완주 성공! 최고 콤보 x${st.bestCombo}`);
        setTimeout(() => this._gpSetupGridHuntRound(), 420);
        return;
      }
    } else {
      st.combo = 0;
      st.lives = Math.max(0, st.lives - 1);
      st.feedback = '이 칸은 타겟이 아니야!';
      SFX.play('wrong');
      if (st.lives <= 0) return this._gpFinish(st.title, `생명 소진! 점수 ${st.score}`);
    }
    this._gpRenderGridHunt();
  };

  Game._gpStartRhythmHit = function _gpStartRhythmHit(cfg) {
    const beatMs = 620 + ((cfg.seed % 4) * 60);
    const st = {
      id: cfg.id,
      kind: 'rhythm-hit',
      template: cfg.template || 'rhythm-hit',
      generated: true,
      title: cfg.short,
      mascot: pickMascot(cfg.id),
      theme: pickTheme(cfg.id),
      totalBeats: 20 + (cfg.seed % 10),
      total: (20 + (cfg.seed % 10)) * 2,
      score: 0,
      beat: 0,
      lives: 5,
      combo: 0,
      bestCombo: 0,
      perfect: 0,
      good: 0,
      miss: 0,
      timeLeft: Math.ceil(((20 + (cfg.seed % 10)) * beatMs) / 1000),
      beatMs,
      pulse: false,
      windowOpen: false,
      hitThisBeat: false,
      lastBeatAt: 0,
      feedback: '비트에 맞춰 탭하세요!',
    };
    this.githubPackState = st;
    this._gpRenderRhythmHit();

    st.interval2 = setInterval(() => this._gpRhythmStep(), beatMs);
  };

  Game._gpRhythmStep = function _gpRhythmStep() {
    const st = this.githubPackState;
    if (!st || st.kind !== 'rhythm-hit') return;

    if (st.beat > 0 && !st.hitThisBeat) {
      st.miss += 1;
      st.combo = 0;
      st.lives = Math.max(0, st.lives - 1);
      st.feedback = '박자를 놓쳤어! 다시 맞춰보자.';
      if (st.lives <= 0) return this._gpFinish(st.title, `리듬 종료! 완벽 ${st.perfect} / 좋음 ${st.good}`);
    }

    if (st.beat >= st.totalBeats) return this._gpFinish(st.title, `완주! 완벽 ${st.perfect} / 좋음 ${st.good}`);

    st.beat += 1;
    st.timeLeft = Math.ceil(((st.totalBeats - st.beat) * st.beatMs) / 1000);
    st.pulse = true;
    st.windowOpen = true;
    st.hitThisBeat = false;
    st.lastBeatAt = Date.now();
    this._gpRenderRhythmHit();

    if (!Array.isArray(st.timers)) st.timers = [];
    st.timers.push(setTimeout(() => {
      const cur = this.githubPackState;
      if (!cur || cur.kind !== 'rhythm-hit') return;
      cur.pulse = false;
      cur.windowOpen = false;
      this._gpRenderRhythmHit();
    }, Math.round(st.beatMs * 0.42)));
  };

  Game._gpTapRhythm = function _gpTapRhythm() {
    const st = this.githubPackState;
    if (!st || st.kind !== 'rhythm-hit') return;
    const now = Date.now();

    if (!st.windowOpen || st.hitThisBeat) {
      st.combo = 0;
      st.feedback = '지금은 탭 타이밍이 아니야!';
      return this._gpRenderRhythmHit();
    }

    const delta = Math.abs(now - st.lastBeatAt);
    const perfectWindow = Math.round(st.beatMs * 0.16);
    const goodWindow = Math.round(st.beatMs * 0.32);

    st.hitThisBeat = true;
    st.windowOpen = false;
    st.pulse = false;
    st.combo += 1;
    st.bestCombo = Math.max(st.bestCombo, st.combo);

    if (delta <= perfectWindow) {
      st.perfect += 1;
      st.score += 2;
      st.feedback = `PERFECT! 콤보 x${st.combo}`;
    } else if (delta <= goodWindow) {
      st.good += 1;
      st.score += 1;
      st.feedback = `GOOD! 콤보 x${st.combo}`;
    } else {
      st.miss += 1;
      st.combo = 0;
      st.lives = Math.max(0, st.lives - 1);
      st.feedback = '조금 늦거나 빨랐어!';
      if (st.lives <= 0) return this._gpFinish(st.title, `리듬 종료! 완벽 ${st.perfect} / 좋음 ${st.good}`);
    }
    SFX.play('correct');
    this._gpRenderRhythmHit();
  };

  Game._gpRenderRhythmHit = function _gpRenderRhythmHit() {
    const st = this.githubPackState;
    if (!st || st.kind !== 'rhythm-hit') return;
    st.timeLeft = Math.max(0, Math.ceil(((st.totalBeats - st.beat) * st.beatMs) / 1000));
    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="quiz-container gp-shell gp-theme-${st.theme}">
        ${header(st.title, `박자 ${st.beat}/${st.totalBeats}`)}
        ${progressBar(st.beat, st.totalBeats)}
        ${arcadeHud(st, `<div class="gp-note">완벽 ${st.perfect} | 좋음 ${st.good} | 실수 ${st.miss}</div>`)}
        <div class="rhythm-stage ${st.pulse ? 'pulse' : ''}">
          <div class="rhythm-ring"></div>
          <button class="rhythm-hit-btn ${st.windowOpen ? 'ready' : ''}" onclick="Game._gpTapRhythm()">탭</button>
        </div>
        <div class="gp-note">${escapeHtml(st.feedback)}</div>
      </div>
    `;
    App.showScreen('game');
  };

  Game._gpBuildGeneratedQuestion = function _gpBuildGeneratedQuestion(cfg, st) {
    const pick = (arr) => arr[randInt(0, arr.length - 1)];
    const level = Math.max(1, Math.floor((st?.round || 0) / 3) + 1);
    const numericChoices = (answer, spread = 8) => {
      const set = new Set([answer]);
      while (set.size < 4) set.add(Math.max(0, answer + randInt(-spread, spread)));
      const options = shuffle([...set].map((n) => String(n)));
      return { options, correct: options.indexOf(String(answer)) };
    };
    const scramble = (word) => {
      let attempt = word;
      while (attempt === word) attempt = shuffle(word.split('')).join('');
      return attempt;
    };

    switch (cfg.template) {
      case 'math-fact': {
        const op = pick(['+', '-', '×']);
        const a = op === '×' ? randInt(2, 5 + level * 2) : randInt(4, 18 + level * 6);
        const b = op === '×' ? randInt(2, 5 + level * 2) : (op === '-' ? randInt(1, Math.max(2, a - 1)) : randInt(1, 10 + level * 4));
        const answer = op === '+' ? a + b : (op === '-' ? a - b : a * b);
        const { options, correct } = numericChoices(answer, op === '×' ? 10 + level * 3 : 6 + level * 2);
        return { prompt: `${a} ${op} ${b} = ?`, options, correct };
      }
      case 'odd-emoji': {
        const base = pick(GEN_EMOJIS);
        let odd = pick(GEN_EMOJIS);
        while (odd === base) odd = pick(GEN_EMOJIS);
        const idx = randInt(0, 3);
        const row = [base, base, base, base];
        row[idx] = odd;
        return { prompt: `다른 하나를 고르세요: ${row.join(' ')}`, options: ['1', '2', '3', '4'], correct: idx };
      }
      case 'count-emoji': {
        const emoji = pick(GEN_EMOJIS);
        const count = randInt(4 + level, 9 + level * 2);
        const { options, correct } = numericChoices(count, 4 + level);
        return { prompt: `이모지가 몇 개일까요? ${emoji.repeat(count)}`, options, correct };
      }
      case 'word-mix': {
        const word = pick(GEN_WORDS.filter((w) => w.length >= 5));
        const mixed = scramble(word);
        const pool = shuffle(GEN_WORDS.filter((w) => w !== word));
        const options = shuffle([word, ...pool.slice(0, 3)]);
        return { prompt: `섞인 단어: ${mixed}`, sub: '정답 철자를 고르세요.', options, correct: options.indexOf(word) };
      }
      case 'color-word': {
        const [ko, en] = pick(GEN_COLOR_PAIRS);
        const others = shuffle(GEN_COLOR_PAIRS.map((x) => x[1]).filter((x) => x !== en)).slice(0, 3);
        const options = shuffle([en, ...others]);
        return { prompt: `${ko} 색의 영어 단어는?`, options, correct: options.indexOf(en) };
      }
      case 'bigger-number': {
        const nums = new Set();
        while (nums.size < 4) nums.add(randInt(10 + level * 5, 70 + level * 30));
        const options = shuffle([...nums].map((n) => String(n)));
        const answer = String(Math.max(...options.map((n) => Number(n))));
        return { prompt: '가장 큰 수를 고르세요.', options, correct: options.indexOf(answer) };
      }
      case 'pattern-next': {
        const mode = randInt(0, 2);
        let seq;
        let answer;
        if (mode === 0) {
          const start = randInt(1, 10 + level * 6);
          const step = randInt(2, 4 + level * 2);
          seq = [start, start + step, start + step * 2];
          answer = start + step * 3;
        } else if (mode === 1) {
          const start = randInt(2, 3 + level);
          seq = [start, start * 2, start * 4];
          answer = start * 8;
        } else {
          const start = randInt(20, 35 + level * 8);
          const step = randInt(2, 4 + level * 2);
          seq = [start, start - step, start - step * 2];
          answer = start - step * 3;
        }
        const { options, correct } = numericChoices(answer, 6 + level * 2);
        return { prompt: `다음 수열의 다음 값은? ${seq.join(', ')}, ?`, options, correct };
      }
      case 'analogy': {
        const [a, b, c, d] = pick(GEN_ANALOGIES);
        const others = shuffle(GEN_ANALOGIES.map((x) => x[3]).filter((x) => x !== d)).slice(0, 3);
        const options = shuffle([d, ...others]);
        return { prompt: `${a} : ${b} = ${c} : ?`, options, correct: options.indexOf(d) };
      }
      case 'shape-focus': {
        const shapes = shuffle(['🔺', '🔵', '🟩', '⭐', '❤️', '⬛']).slice(0, 4);
        const answer = pick(shapes);
        const bag = [];
        for (let i = 0; i < randInt(4, 6); i += 1) bag.push(answer);
        shapes.filter((s) => s !== answer).forEach((s) => {
          for (let i = 0; i < randInt(1, 3); i += 1) bag.push(s);
        });
        const line = shuffle(bag).join(' ');
        const options = shuffle([...shapes]);
        return { prompt: `가장 많이 나온 모양은? ${line}`, options, correct: options.indexOf(answer) };
      }
      case 'quick-logic':
      default: {
        const q = pick(GEN_LOGIC_BANK);
        const options = shuffle([...q.options]);
        return { prompt: q.prompt, options, correct: options.indexOf(q.correct) };
      }
    }
  };

  Game.restartGithubPackGame = function restartGithubPackGame() {
    if (!this.githubPackState || !this.githubPackState.id) return this.showGithubPack();
    return this.startGithubPackGame(this.githubPackState.id);
  };

  Game._gpFinish = function _gpFinish(title, message) {
    this._gpStopRuntime();
    const st = this.githubPackState || { score: 0, total: 1 };
    const stars = rewardByScore(st.score, st.total);
    if (window.Daily && typeof Daily.updateMissionProgress === 'function') {
      Daily.updateMissionProgress('github-pack');
      const templateKey = st.template || st.kind || null;
      if (templateKey) Daily.updateMissionProgress('generated', templateKey);
    }
    const titleKo = TITLE_KO[title] || title;
    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="result-container">
        <div class="result-stars">${'⭐'.repeat(Math.max(1, Math.min(10, stars)))}</div>
        <h2 class="result-message">${escapeHtml(titleKo)}</h2>
        <div class="result-score">${st.score} / ${st.total}</div>
        <p class="gp-finish-note">${escapeHtml(message || '')}</p>
        <div class="result-buttons">
          <button class="btn-primary" onclick="Game.restartGithubPackGame()">다시 하기</button>
          <button class="btn-secondary" onclick="Game.showGithubPack()">미니게임 목록</button>
          <button class="btn-secondary" onclick="App.navigate('home')">홈</button>
        </div>
      </div>
    `;
    App.showScreen('game');
    SFX.play('celebrate');
  };

  // MCQ base for games #1, #2, #3 and generated games
  Game._gpStartMcq = function _gpStartMcq(id, title, total, builder, opts = {}) {
    const timePerRound = Math.max(7, Math.min(30, Number(opts.timePerRound) || 14));
    this.githubPackState = {
      id,
      kind: 'mcq',
      title,
      total,
      score: 0,
      round: 0,
      builder,
      current: null,
      lives: Math.max(3, Math.min(5, Number(opts.lives) || 5)),
      combo: 0,
      bestCombo: 0,
      timePerRound,
      timeLeft: timePerRound,
      power: { fiftyUsed: false, skipUsed: false },
      hiddenOptions: [],
      feedback: '준비됐지? 신나게 시작해보자!',
      locked: false,
      mascot: pickMascot(id),
      theme: pickTheme(id),
    };
    this._gpStartMcqTimer();
    this._gpRenderMcq();
  };

  Game._gpStartMcqTimer = function _gpStartMcqTimer() {
    const st = this.githubPackState;
    if (!st || st.kind !== 'mcq') return;
    if (st.interval) clearInterval(st.interval);
    st.interval = setInterval(() => {
      const cur = this.githubPackState;
      if (!cur || cur.kind !== 'mcq' || cur.locked || !cur.current) return;
      cur.timeLeft -= 1;
      if (cur.timeLeft <= 0) return this._gpHandleMcqTimeout();
      this._gpRenderMcq();
    }, 1000);
  };

  Game._gpHandleMcqTimeout = function _gpHandleMcqTimeout() {
    const st = this.githubPackState;
    if (!st || st.kind !== 'mcq' || st.locked || !st.current) return;
    st.locked = true;
    st.combo = 0;
    st.lives = Math.max(0, st.lives - 1);
    st.feedback = '시간이 끝났어. 다음 문제에서 만회하자!';
    SFX.play('wrong');

    const buttons = [...document.querySelectorAll('.quiz-choice')];
    buttons.forEach((b) => { b.disabled = true; });
    if (buttons[st.current.correct]) buttons[st.current.correct].classList.add('correct');

    if (st.lives <= 0) {
      setTimeout(() => this._gpFinish(st.title, `최고 콤보 x${st.bestCombo}`), 620);
      return;
    }

    st.round += 1;
    st.current = null;
    st.hiddenOptions = [];
    setTimeout(() => this._gpRenderMcq(), 620);
  };

  Game._gpUseFifty = function _gpUseFifty() {
    const st = this.githubPackState;
    if (!st || st.kind !== 'mcq' || !st.current || st.power?.fiftyUsed) return;
    const wrong = st.current.options.map((_, i) => i).filter((i) => i !== st.current.correct);
    st.hiddenOptions = shuffle(wrong).slice(0, 2);
    st.power.fiftyUsed = true;
    st.feedback = '50:50 사용! 집중해서 골라봐.';
    this._gpRenderMcq();
  };

  Game._gpSkipQuestion = function _gpSkipQuestion() {
    const st = this.githubPackState;
    if (!st || st.kind !== 'mcq' || st.power?.skipUsed) return;
    st.power.skipUsed = true;
    st.combo = 0;
    st.feedback = '스킵 완료. 다음 문제로 이동!';
    st.round += 1;
    st.current = null;
    st.hiddenOptions = [];
    this._gpRenderMcq();
  };

  Game._gpRenderMcq = function _gpRenderMcq() {
    const st = this.githubPackState;
    if (st.round >= st.total) return this._gpFinish(st.title, `최고 콤보 x${st.bestCombo}`);
    if (st.lives <= 0) return this._gpFinish(st.title, `최고 콤보 x${st.bestCombo}`);
    if (!st.current) {
      st.current = st.builder(st);
      st.timeLeft = st.timePerRound;
      st.hiddenOptions = [];
      st.locked = false;
    }

    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="quiz-container gp-shell gp-theme-${st.theme || 'spark'}">
        ${header(st.title, `라운드 ${st.round + 1}/${st.total}`)}
        ${progressBar(st.round, st.total)}
        ${mcqHud(st)}
        <div class="gp-question-box">${escapeHtml(st.current.prompt)}</div>
        ${st.current.sub ? `<div class="gp-note">${escapeHtml(st.current.sub)}</div>` : ''}
        <div class="quiz-choices ${st.current.options.length <= 2 ? 'choices-2' : 'choices-4'}">
          ${st.current.options.map((opt, idx) => `
            <button class="quiz-choice ${st.hiddenOptions?.includes(idx) ? 'gp-hidden-choice' : ''}" onclick="Game._gpAnswerMcq(${idx}, this)" ${st.hiddenOptions?.includes(idx) ? 'disabled' : ''}>
              <span class="choice-char">${escapeHtml(opt)}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    App.showScreen('game');
  };

  Game._gpAnswerMcq = function _gpAnswerMcq(index, btn) {
    const st = this.githubPackState;
    if (!st || st.kind !== 'mcq' || st.locked || !st.current) return;
    st.locked = true;
    const buttons = [...document.querySelectorAll('.quiz-choice')];
    buttons.forEach((b) => { b.disabled = true; });
    const ok = index === st.current.correct;

    if (ok) {
      st.score += 1;
      st.combo += 1;
      st.bestCombo = Math.max(st.bestCombo, st.combo);
      st.feedback = `좋아! 콤보 x${st.combo}`;
      btn.classList.add('correct');
      SFX.play('correct');
    } else {
      st.combo = 0;
      st.lives = Math.max(0, st.lives - 1);
      st.feedback = '괜찮아! 다음 문제를 노려보자.';
      btn.classList.add('wrong');
      if (buttons[st.current.correct]) buttons[st.current.correct].classList.add('correct');
      SFX.play('wrong');
    }

    if (st.lives <= 0) {
      setTimeout(() => this._gpFinish(st.title, `최고 콤보 x${st.bestCombo}`), 520);
      return;
    }

    st.round += 1;
    st.current = null;
    st.hiddenOptions = [];
    setTimeout(() => this._gpRenderMcq(), 520);
  };

  Game._gpStartEducational = function _gpStartEducational() {
    this._gpStartMcq('educational-html-games', 'Educational HTML Games', 8, () => {
      const add = Math.random() < 0.5;
      const a = randInt(1, 12);
      const b = add ? randInt(1, 12) : randInt(1, a);
      const ans = add ? a + b : a - b;
      const op = add ? '+' : '-';
      const choices = [ans];
      while (choices.length < 4) {
        const n = Math.max(0, ans + randInt(-5, 5));
        if (!choices.includes(n)) choices.push(n);
      }
      const options = shuffle(choices).map(String);
      return { prompt: `${a} ${op} ${b} = ?`, options, correct: options.indexOf(String(ans)) };
    });
  };

  Game._gpStartEdukiz = function _gpStartEdukiz() {
    this._gpStartMcq('edukiz', 'Edukiz', 8, () => {
      const item = EDUKIZ_POOL[randInt(0, EDUKIZ_POOL.length - 1)];
      const wrong = shuffle(EDUKIZ_POOL.filter((x) => x[1] !== item[1])).slice(0, 3).map((x) => x[1]);
      const options = shuffle([item[1], ...wrong]);
      return { prompt: `${item[0]}는 무엇일까요?`, options, correct: options.indexOf(item[1]) };
    });
  };

  Game._gpStartNatan = function _gpStartNatan() {
    this._gpStartMcq('natan-js', 'Natan JS', 10, () => {
      const a = randInt(1, 20);
      const b = randInt(1, 20);
      const add = Math.random() < 0.5;
      const real = add ? a + b : a - b;
      let shown = real;
      let truth = true;
      if (Math.random() < 0.5) {
        truth = false;
        let delta = randInt(-4, 4);
        if (delta === 0) delta = 2;
        shown = real + delta;
      }
      const prompt = `${a} ${add ? '+' : '-'} ${b} = ${shown}`;
      const options = ['참', '거짓'];
      return { prompt, options, correct: truth ? 0 : 1 };
    });
  };

  // #4 Spellie
  Game._gpStartSpellie = function _gpStartSpellie() {
    this.githubPackState = {
      id: 'spellie',
      target: SPELLIE_WORDS[randInt(0, SPELLIE_WORDS.length - 1)],
      guesses: [],
      score: 0,
      total: 1,
      status: '5글자 단어를 입력해 보세요.',
    };
    this._gpRenderSpellie();
  };

  Game._gpSpellieStatus = function _gpSpellieStatus(word, target) {
    const out = Array(5).fill('absent');
    const count = {};
    for (let i = 0; i < 5; i += 1) count[target[i]] = (count[target[i]] || 0) + 1;
    for (let i = 0; i < 5; i += 1) {
      if (word[i] === target[i]) { out[i] = 'correct'; count[word[i]] -= 1; }
    }
    for (let i = 0; i < 5; i += 1) {
      if (out[i] === 'correct') continue;
      if (count[word[i]] > 0) { out[i] = 'present'; count[word[i]] -= 1; }
    }
    return out;
  };

  Game._gpRenderSpellie = function _gpRenderSpellie() {
    const st = this.githubPackState;
    const rows = [];
    for (let i = 0; i < 6; i += 1) {
      const g = st.guesses[i];
      rows.push(`
        <div class="spellie-row">
          ${Array.from({ length: 5 }).map((_, k) => {
            const ch = g ? g.word[k] : '';
            const cls = g ? ` ${g.state[k]}` : '';
            return `<div class="spellie-tile${cls}">${ch}</div>`;
          }).join('')}
        </div>
      `);
    }
    const locked = st.guesses.length >= 6 || st.score === 1;
    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="quiz-container gp-shell">
        ${header('Spellie', `시도 ${Math.min(st.guesses.length + 1, 6)}/6`)}
        <div class="spellie-board">${rows.join('')}</div>
        <div class="spellie-input-row">
          <input id="gp-spellie-input" class="spellie-input" maxlength="5" placeholder="ABCDE" ${locked ? 'disabled' : ''} />
          <button class="btn-primary" onclick="Game._gpSubmitSpellie()" ${locked ? 'disabled' : ''}>확인</button>
        </div>
        <div class="gp-note">${escapeHtml(st.status)}</div>
      </div>
    `;
    App.showScreen('game');
  };

  Game._gpSubmitSpellie = function _gpSubmitSpellie() {
    const st = this.githubPackState;
    const input = document.getElementById('gp-spellie-input');
    if (!input) return;
    const word = input.value.trim().toUpperCase().replace(/[^A-Z]/g, '');
    if (word.length !== 5) {
      st.status = '정확히 5글자를 입력해 주세요.';
      return this._gpRenderSpellie();
    }
    const state = this._gpSpellieStatus(word, st.target);
    st.guesses.push({ word, state });

    if (word === st.target) {
      st.score = 1;
      return this._gpFinish('Spellie', `정답! 단어는 ${st.target}였어요.`);
    }
    if (st.guesses.length >= 6) return this._gpFinish('Spellie', `기회 종료. 정답 단어는 ${st.target}였어요.`);
    st.status = '계속 도전해 보세요.';
    return this._gpRenderSpellie();
  };

  // #5 Simon
  Game._gpStartSimon = function _gpStartSimon() {
    this.githubPackState = {
      id: 'simon-game',
      sequence: [],
      round: 0,
      max: 5,
      idx: 0,
      score: 0,
      total: 5,
      lock: true,
      flash: '',
      msg: '순서를 기억하세요...',
    };
    this._gpRenderSimon();
    setTimeout(() => this._gpSimonNext(), 420);
  };

  Game._gpRenderSimon = function _gpRenderSimon() {
    const st = this.githubPackState;
    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="quiz-container gp-shell">
        ${header('Simon Game', `라운드 ${Math.max(1, st.round)}/${st.max}`)}
        <div class="gp-note">${escapeHtml(st.msg)}</div>
        <div class="simon-grid">
          ${SIMON_COLORS.map((c) => `<button class="simon-pad simon-${c}${st.flash === c ? ' active' : ''}" onclick="Game._gpSimonPress('${c}')"></button>`).join('')}
        </div>
      </div>
    `;
    App.showScreen('game');
  };

  Game._gpSimonNext = function _gpSimonNext() {
    const st = this.githubPackState;
    if (st.round >= st.max) return this._gpFinish('Simon Game', '기억력 도전 성공!');
    st.round += 1;
    st.sequence.push(SIMON_COLORS[randInt(0, SIMON_COLORS.length - 1)]);
    st.idx = 0;
    st.lock = true;
    st.msg = '순서를 기억하세요...';
    this._gpRenderSimon();
    const gap = 520;
    st.sequence.forEach((color, i) => {
      setTimeout(() => { st.flash = color; this._gpRenderSimon(); SFX.play('flip'); }, i * gap);
      setTimeout(() => { st.flash = ''; this._gpRenderSimon(); }, i * gap + 260);
    });
    setTimeout(() => { st.lock = false; st.msg = '내 차례'; this._gpRenderSimon(); }, st.sequence.length * gap + 100);
  };

  Game._gpSimonPress = function _gpSimonPress(color) {
    const st = this.githubPackState;
    if (st.lock) return;
    if (color !== st.sequence[st.idx]) return this._gpFinish('Simon Game', `라운드 ${st.round}에서 순서를 놓쳤어요.`);
    st.idx += 1;
    if (st.idx >= st.sequence.length) {
      st.score += 1;
      st.lock = true;
      st.msg = '좋아요! 다음 라운드...';
      this._gpRenderSimon();
      setTimeout(() => this._gpSimonNext(), 500);
    }
  };

  // #6 Memory
  Game._gpStartMemory = function _gpStartMemory() {
    const picked = shuffle(MEMORY_EMOJIS).slice(0, 6);
    const deck = shuffle([...picked.map((e, i) => ({ k: i, e, open: false, done: false })), ...picked.map((e, i) => ({ k: i, e, open: false, done: false }))]);
    this.githubPackState = { id: 'memory', deck, first: -1, lock: false, score: 0, total: 6 };
    this._gpRenderMemory();
  };

  Game._gpRenderMemory = function _gpRenderMemory() {
    const st = this.githubPackState;
    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="matching-container gp-shell">
        ${header('Memory Cards', `${st.score}/${st.total}`)}
        <div class="gp-memory-grid">
          ${st.deck.map((c, i) => `<button class="gp-memory-card${c.open || c.done ? ' open' : ''}${c.done ? ' done' : ''}" onclick="Game._gpFlipMemory(${i})"><span>${c.open || c.done ? c.e : '?'}</span></button>`).join('')}
        </div>
      </div>
    `;
    App.showScreen('game');
  };

  Game._gpFlipMemory = function _gpFlipMemory(i) {
    const st = this.githubPackState;
    const c = st.deck[i];
    if (!c || st.lock || c.open || c.done) return;
    c.open = true;
    if (st.first === -1) { st.first = i; return this._gpRenderMemory(); }
    const a = st.deck[st.first];
    st.lock = true;
    this._gpRenderMemory();
    if (a.k === c.k) {
      setTimeout(() => {
        a.done = true; c.done = true; st.score += 1; st.first = -1; st.lock = false;
        if (st.score >= st.total) this._gpFinish('Memory Cards', '모든 짝을 찾았어요!');
        else this._gpRenderMemory();
      }, 340);
    } else {
      setTimeout(() => { a.open = false; c.open = false; st.first = -1; st.lock = false; this._gpRenderMemory(); }, 620);
    }
  };

  // #7 Rapid Router
  Game._gpStartRouter = function _gpStartRouter() {
    this.githubPackState = { id: 'rapid-router', level: 0, score: 0, total: ROUTER_LEVELS.length, pos: [...ROUTER_LEVELS[0].start], step: 0, msg: '화살표로 목표 지점까지 이동하세요.' };
    this._gpRenderRouter();
  };

  Game._gpRenderRouter = function _gpRenderRouter() {
    const st = this.githubPackState;
    const lv = ROUTER_LEVELS[st.level];
    if (!lv) return this._gpFinish('Rapid Router', '길찾기 도전 완료!');
    const walls = new Set(lv.walls.map((p) => `${p[0]},${p[1]}`));
    const cells = [];
    for (let r = 0; r < lv.size; r += 1) {
      for (let c = 0; c < lv.size; c += 1) {
        let cls = 'router-cell';
        if (walls.has(`${r},${c}`)) cls += ' wall';
        if (r === lv.start[0] && c === lv.start[1]) cls += ' start';
        if (r === lv.goal[0] && c === lv.goal[1]) cls += ' goal';
        if (r === st.pos[0] && c === st.pos[1]) cls += ' player';
        cells.push(`<div class="${cls}"></div>`);
      }
    }
    const left = Math.max(0, lv.limit - st.step);
    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="quiz-container gp-shell">
        ${header('Rapid Router', `레벨 ${st.level + 1}/${st.total}`)}
        <div class="gp-note">${escapeHtml(st.msg)} 남은 이동: ${left}</div>
        <div class="router-board" style="grid-template-columns:repeat(${lv.size},1fr)">${cells.join('')}</div>
        <div class="router-controls">
          <button class="btn-secondary" onclick="Game._gpMoveRouter(-1,0)">위</button>
          <div class="router-controls-row">
            <button class="btn-secondary" onclick="Game._gpMoveRouter(0,-1)">왼쪽</button>
            <button class="btn-secondary" onclick="Game._gpMoveRouter(0,1)">오른쪽</button>
          </div>
          <button class="btn-secondary" onclick="Game._gpMoveRouter(1,0)">아래</button>
        </div>
      </div>
    `;
    App.showScreen('game');
  };

  Game._gpMoveRouter = function _gpMoveRouter(dr, dc) {
    const st = this.githubPackState;
    const lv = ROUTER_LEVELS[st.level];
    if (!lv) return;
    const nr = st.pos[0] + dr;
    const nc = st.pos[1] + dc;
    const walls = new Set(lv.walls.map((p) => `${p[0]},${p[1]}`));
    if (nr < 0 || nr >= lv.size || nc < 0 || nc >= lv.size || walls.has(`${nr},${nc}`)) {
      st.msg = '막힌 길이에요.';
      return this._gpRenderRouter();
    }
    st.pos = [nr, nc];
    st.step += 1;
    if (nr === lv.goal[0] && nc === lv.goal[1]) {
      st.score += 1;
      st.level += 1;
      if (ROUTER_LEVELS[st.level]) st.pos = [...ROUTER_LEVELS[st.level].start];
      st.step = 0;
      st.msg = '레벨 클리어!';
      return setTimeout(() => this._gpRenderRouter(), 360);
    }
    if (st.step > lv.limit) {
      st.level += 1;
      if (ROUTER_LEVELS[st.level]) st.pos = [...ROUTER_LEVELS[st.level].start];
      st.step = 0;
      st.msg = '이동 횟수를 모두 사용했어요. 다음 레벨로 이동합니다.';
      return setTimeout(() => this._gpRenderRouter(), 360);
    }
    st.msg = '계속 이동해 보세요.';
    return this._gpRenderRouter();
  };

  // #8 Antura
  Game._gpStartAntura = function _gpStartAntura() {
    this.githubPackState = { id: 'antura', words: shuffle(ANTURA_WORDS).slice(0, 5), round: 0, score: 0, total: 5, word: '', letters: [], used: [], typed: '', status: '단어를 완성하세요.' };
    this._gpLoadAnturaRound();
  };

  Game._gpLoadAnturaRound = function _gpLoadAnturaRound() {
    const st = this.githubPackState;
    if (st.round >= st.total) return this._gpFinish('Antura', '단어 만들기 완료!');
    st.word = st.words[st.round];
    st.letters = shuffle(st.word.split(''));
    st.used = [];
    st.typed = '';
    st.status = '목표 단어를 만들어 보세요.';
    return this._gpRenderAntura();
  };

  Game._gpRenderAntura = function _gpRenderAntura() {
    const st = this.githubPackState;
    const slots = st.word.split('').map((_, i) => st.typed[i] || '');
    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="quiz-container gp-shell">
        ${header('Antura', `라운드 ${st.round + 1}/${st.total}`)}
        <div class="gp-note">${escapeHtml(st.status)} 글자 수: ${st.word.length}</div>
        <div class="antura-slots">${slots.map((c) => `<div class="antura-slot">${escapeHtml(c)}</div>`).join('')}</div>
        <div class="antura-bank">
          ${st.letters.map((ch, i) => `<button class="antura-letter${st.used.includes(i) ? ' used' : ''}" onclick="Game._gpPickAntura(${i})" ${st.used.includes(i) ? 'disabled' : ''}>${escapeHtml(ch)}</button>`).join('')}
        </div>
        <div class="antura-actions">
          <button class="btn-secondary" onclick="Game._gpBackAntura()">한 글자 지우기</button>
          <button class="btn-secondary" onclick="Game._gpClearAntura()">전체 지우기</button>
          <button class="btn-primary" onclick="Game._gpCheckAntura()">확인</button>
        </div>
      </div>
    `;
    App.showScreen('game');
  };

  Game._gpPickAntura = function _gpPickAntura(i) {
    const st = this.githubPackState;
    if (st.used.includes(i) || st.typed.length >= st.word.length) return;
    st.used.push(i);
    st.typed += st.letters[i];
    this._gpRenderAntura();
  };

  Game._gpBackAntura = function _gpBackAntura() {
    const st = this.githubPackState;
    if (!st.used.length) return;
    st.used.pop();
    st.typed = st.typed.slice(0, -1);
    this._gpRenderAntura();
  };

  Game._gpClearAntura = function _gpClearAntura() {
    const st = this.githubPackState;
    st.used = [];
    st.typed = '';
    st.status = '다시 시도해 보세요.';
    this._gpRenderAntura();
  };

  Game._gpCheckAntura = function _gpCheckAntura() {
    const st = this.githubPackState;
    if (st.typed.length !== st.word.length) {
      st.status = `먼저 ${st.word.length}글자를 모두 사용하세요.`;
      return this._gpRenderAntura();
    }
    if (st.typed === st.word) {
      st.score += 1;
      st.round += 1;
      st.status = '정답이에요!';
      SFX.play('correct');
      return setTimeout(() => this._gpLoadAnturaRound(), 340);
    }
    st.status = '아직 아니에요. 다시 시도해 보세요.';
    SFX.play('wrong');
    st.used = [];
    st.typed = '';
    return this._gpRenderAntura();
  };

  // #9 Tic Tac Toe
  Game._gpStartTicTacToe = function _gpStartTicTacToe() {
    this.githubPackState = {
      id: 'tictactoe',
      board: Array(9).fill(''),
      score: 0,
      total: 1,
      msg: '내 차례 (X).',
      lock: false,
    };
    this._gpRenderTicTacToe();
  };

  Game._gpTicWinner = function _gpTicWinner(board) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[b] === board[c]) return board[a];
    }
    return '';
  };

  Game._gpRenderTicTacToe = function _gpRenderTicTacToe() {
    const st = this.githubPackState;
    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="quiz-container gp-shell">
        ${header('Tic Tac Toe', '엑스오 대결')}
        <div class="gp-note">${escapeHtml(st.msg)}</div>
        <div class="ttt-grid">
          ${st.board.map((v, i) => `
            <button class="ttt-cell" onclick="Game._gpPickTic(${i})" ${v || st.lock ? 'disabled' : ''}>${escapeHtml(v)}</button>
          `).join('')}
        </div>
      </div>
    `;
    App.showScreen('game');
  };

  Game._gpPickTic = function _gpPickTic(index) {
    const st = this.githubPackState;
    if (st.lock || st.board[index]) return;
    st.board[index] = 'X';
    let winner = this._gpTicWinner(st.board);
    if (winner === 'X') {
      st.score = 1;
      return this._gpFinish('Tic Tac Toe', '당신이 이겼어요.');
    }
    if (!st.board.includes('')) return this._gpFinish('Tic Tac Toe', '무승부예요.');

    st.lock = true;
    st.msg = '컴퓨터가 생각 중...';
    this._gpRenderTicTacToe();
    setTimeout(() => {
      const empty = st.board.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0);
      if (!empty.length) return this._gpFinish('Tic Tac Toe', '무승부예요.');
      const pick = empty[randInt(0, empty.length - 1)];
      st.board[pick] = 'O';
      winner = this._gpTicWinner(st.board);
      st.lock = false;
      if (winner === 'O') return this._gpFinish('Tic Tac Toe', '컴퓨터가 이겼어요.');
      if (!st.board.includes('')) return this._gpFinish('Tic Tac Toe', '무승부예요.');
      st.msg = '내 차례 (X).';
      return this._gpRenderTicTacToe();
    }, 420);
  };

  // #10 Rock Paper Scissors
  Game._gpStartRPS = function _gpStartRPS() {
    this.githubPackState = { id: 'rps', round: 0, score: 0, total: 7, msg: '손모양을 고르세요.' };
    this._gpRenderRPS();
  };

  Game._gpRenderRPS = function _gpRenderRPS() {
    const st = this.githubPackState;
    if (st.round >= st.total) return this._gpFinish('Rock Paper Scissors', '토너먼트 완료!');
    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="quiz-container gp-shell">
        ${header('Rock Paper Scissors', `라운드 ${st.round + 1}/${st.total}`)}
        <div class="gp-note">${escapeHtml(st.msg)} 점수: ${st.score}</div>
        <div class="rps-row">
          ${RPS_CHOICES.map((c) => `<button class="btn-secondary" onclick="Game._gpPickRPS('${c}')">${c === 'ROCK' ? '바위' : c === 'PAPER' ? '보' : '가위'}</button>`).join('')}
        </div>
      </div>
    `;
    App.showScreen('game');
  };

  Game._gpPickRPS = function _gpPickRPS(me) {
    const st = this.githubPackState;
    const ai = RPS_CHOICES[randInt(0, RPS_CHOICES.length - 1)];
    let result = '무승부';
    if (me === ai) st.score += 0.5;
    else if ((me === 'ROCK' && ai === 'SCISSORS') || (me === 'PAPER' && ai === 'ROCK') || (me === 'SCISSORS' && ai === 'PAPER')) {
      st.score += 1;
      result = '승리';
    } else result = '패배';
    const meLabel = me === 'ROCK' ? '바위' : me === 'PAPER' ? '보' : '가위';
    const aiLabel = ai === 'ROCK' ? '바위' : ai === 'PAPER' ? '보' : '가위';
    st.msg = `나: ${meLabel}, 컴퓨터: ${aiLabel} -> ${result}`;
    st.round += 1;
    setTimeout(() => this._gpRenderRPS(), 520);
  };

  // #11 Whack-a-Mole
  Game._gpStartWhack = function _gpStartWhack() {
    this.githubPackState = {
      id: 'whack',
      hits: 0,
      timeLeft: 20,
      total: 15,
      active: -1,
      msg: '두더지를 빠르게 눌러요.',
    };
    this._gpRenderWhack();
    const st = this.githubPackState;
    st.interval = setInterval(() => {
      st.active = randInt(0, 8);
      this._gpRenderWhack();
    }, 700);
    st.interval2 = setInterval(() => {
      st.timeLeft -= 1;
      if (st.timeLeft <= 0) {
        st.score = Math.min(st.hits, st.total);
        this._gpFinish('Whack-a-Mole', `성공 횟수: ${st.hits}`);
      } else this._gpRenderWhack();
    }, 1000);
  };

  Game._gpRenderWhack = function _gpRenderWhack() {
    const st = this.githubPackState;
    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="quiz-container gp-shell">
        ${header('Whack-a-Mole', `남은 시간 ${st.timeLeft}초`)}
        <div class="gp-note">성공 횟수: ${st.hits}</div>
        <div class="whack-grid">
          ${Array.from({ length: 9 }).map((_, i) => `
            <button class="whack-cell" onclick="Game._gpHitWhack(${i})">
              <span class="${st.active === i ? 'mole show' : 'mole'}">🐹</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    App.showScreen('game');
  };

  Game._gpHitWhack = function _gpHitWhack(index) {
    const st = this.githubPackState;
    if (st.active !== index) return;
    st.hits += 1;
    st.active = -1;
    SFX.play('correct');
    this._gpRenderWhack();
  };

  // #12 2048
  Game._gpStart2048 = function _gpStart2048() {
    const grid = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.githubPackState = { id: 'game2048', grid, score: 0, total: 512, msg: '같은 숫자를 합쳐보세요.' };
    this._gp2048Spawn();
    this._gp2048Spawn();
    this._gpRender2048();
  };

  Game._gp2048EmptyCells = function _gp2048EmptyCells() {
    const out = [];
    const st = this.githubPackState;
    for (let r = 0; r < 4; r += 1) for (let c = 0; c < 4; c += 1) if (!st.grid[r][c]) out.push([r, c]);
    return out;
  };

  Game._gp2048Spawn = function _gp2048Spawn() {
    const empty = this._gp2048EmptyCells();
    if (!empty.length) return;
    const [r, c] = empty[randInt(0, empty.length - 1)];
    this.githubPackState.grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  };

  Game._gp2048Slide = function _gp2048Slide(line) {
    const nums = line.filter((n) => n > 0);
    const out = [];
    let gain = 0;
    for (let i = 0; i < nums.length; i += 1) {
      if (nums[i] && nums[i] === nums[i + 1]) {
        const v = nums[i] * 2;
        out.push(v);
        gain += v;
        i += 1;
      } else out.push(nums[i]);
    }
    while (out.length < 4) out.push(0);
    return { out, gain };
  };

  Game._gp2048Move = function _gp2048Move(dir) {
    const st = this.githubPackState;
    let moved = false;
    let gain = 0;
    const old = st.grid.map((r) => [...r]);

    for (let i = 0; i < 4; i += 1) {
      let line = [];
      if (dir === 'left' || dir === 'right') {
        line = [...st.grid[i]];
        if (dir === 'right') line.reverse();
      } else {
        line = [st.grid[0][i], st.grid[1][i], st.grid[2][i], st.grid[3][i]];
        if (dir === 'down') line.reverse();
      }

      const s = this._gp2048Slide(line);
      gain += s.gain;
      let applied = [...s.out];
      if (dir === 'right' || dir === 'down') applied.reverse();

      if (dir === 'left' || dir === 'right') st.grid[i] = applied;
      else for (let r = 0; r < 4; r += 1) st.grid[r][i] = applied[r];
    }

    for (let r = 0; r < 4; r += 1) for (let c = 0; c < 4; c += 1) if (old[r][c] !== st.grid[r][c]) moved = true;
    if (!moved) return this._gpRender2048();

    st.score += gain;
    this._gp2048Spawn();
    const maxTile = Math.max(...st.grid.flat());
    if (maxTile >= st.total) {
      st.score = maxTile;
      return this._gpFinish('2048', `대단해요! ${maxTile} 타일에 도달했어요.`);
    }
    if (!this._gp2048CanMove()) {
      st.score = maxTile;
      return this._gpFinish('2048', `더 이상 이동할 수 없어요. 최고 타일: ${maxTile}.`);
    }
    return this._gpRender2048();
  };

  Game._gp2048CanMove = function _gp2048CanMove() {
    const st = this.githubPackState;
    if (this._gp2048EmptyCells().length) return true;
    for (let r = 0; r < 4; r += 1) for (let c = 0; c < 4; c += 1) {
      const v = st.grid[r][c];
      if (r + 1 < 4 && st.grid[r + 1][c] === v) return true;
      if (c + 1 < 4 && st.grid[r][c + 1] === v) return true;
    }
    return false;
  };

  Game._gpRender2048 = function _gpRender2048() {
    const st = this.githubPackState;
    const maxTile = Math.max(...st.grid.flat());
    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="quiz-container gp-shell">
        ${header('2048', `최고 ${maxTile}`)}
        <div class="gp-note">${escapeHtml(st.msg)}</div>
        <div class="grid2048">
          ${st.grid.flat().map((n) => `<div class="tile2048 v${n}">${n || ''}</div>`).join('')}
        </div>
        <div class="router-controls">
          <button class="btn-secondary" onclick="Game._gp2048Move('up')">위</button>
          <div class="router-controls-row">
            <button class="btn-secondary" onclick="Game._gp2048Move('left')">왼쪽</button>
            <button class="btn-secondary" onclick="Game._gp2048Move('right')">오른쪽</button>
          </div>
          <button class="btn-secondary" onclick="Game._gp2048Move('down')">아래</button>
        </div>
      </div>
    `;
    App.showScreen('game');
  };

  // #13 Minesweeper
  Game._gpStartMinesweeper = function _gpStartMinesweeper() {
    const size = 6;
    const mines = 8;
    const board = Array.from({ length: size * size }, () => ({ mine: false, adj: 0, open: false }));
    let placed = 0;
    while (placed < mines) {
      const i = randInt(0, board.length - 1);
      if (!board[i].mine) { board[i].mine = true; placed += 1; }
    }
    const dirs = [-1, 0, 1];
    for (let r = 0; r < size; r += 1) for (let c = 0; c < size; c += 1) {
      const idx = r * size + c;
      if (board[idx].mine) continue;
      let adj = 0;
      for (const dr of dirs) for (const dc of dirs) {
        if (!dr && !dc) continue;
        const nr = r + dr; const nc = c + dc;
        if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;
        if (board[nr * size + nc].mine) adj += 1;
      }
      board[idx].adj = adj;
    }
    this.githubPackState = { id: 'minesweeper', size, mines, board, opened: 0, score: 0, total: 1, msg: '안전한 칸을 모두 열어보세요.' };
    this._gpRenderMinesweeper();
  };

  Game._gpRevealMines = function _gpRevealMines() {
    const st = this.githubPackState;
    st.board.forEach((cell) => { if (cell.mine) cell.open = true; });
  };

  Game._gpOpenMineCell = function _gpOpenMineCell(index) {
    const st = this.githubPackState;
    const cell = st.board[index];
    if (!cell || cell.open) return;
    cell.open = true;
    if (!cell.mine) st.opened += 1;
  };

  Game._gpClickMinesweeper = function _gpClickMinesweeper(index) {
    const st = this.githubPackState;
    const cell = st.board[index];
    if (!cell || cell.open) return;
    if (cell.mine) {
      this._gpRevealMines();
      this._gpRenderMinesweeper();
      return this._gpFinish('Minesweeper', '앗! 지뢰를 밟았어요.');
    }

    const queue = [index];
    while (queue.length) {
      const cur = queue.pop();
      const c = st.board[cur];
      if (!c || c.open) continue;
      this._gpOpenMineCell(cur);
      if (c.adj !== 0) continue;
      const r = Math.floor(cur / st.size);
      const col = cur % st.size;
      for (let dr = -1; dr <= 1; dr += 1) for (let dc = -1; dc <= 1; dc += 1) {
        if (!dr && !dc) continue;
        const nr = r + dr; const nc = col + dc;
        if (nr < 0 || nr >= st.size || nc < 0 || nc >= st.size) continue;
        const ni = nr * st.size + nc;
        if (!st.board[ni].open && !st.board[ni].mine) queue.push(ni);
      }
    }

    const safeTotal = st.size * st.size - st.mines;
    if (st.opened >= safeTotal) {
      st.score = 1;
      this._gpRenderMinesweeper();
      return this._gpFinish('Minesweeper', '훌륭해요! 안전한 칸을 모두 열었어요.');
    }
    return this._gpRenderMinesweeper();
  };

  Game._gpRenderMinesweeper = function _gpRenderMinesweeper() {
    const st = this.githubPackState;
    const safeTotal = st.size * st.size - st.mines;
    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="quiz-container gp-shell">
        ${header('Minesweeper', `${st.opened}/${safeTotal}`)}
        <div class="gp-note">${escapeHtml(st.msg)}</div>
        <div class="mines-grid" style="grid-template-columns:repeat(${st.size},1fr)">
          ${st.board.map((cell, i) => `
            <button class="mine-cell ${cell.open ? 'open' : ''}" onclick="Game._gpClickMinesweeper(${i})" ${cell.open ? 'disabled' : ''}>
              ${cell.open ? (cell.mine ? '💣' : (cell.adj || '')) : ''}
            </button>
          `).join('')}
        </div>
      </div>
    `;
    App.showScreen('game');
  };

  // #14 Breakout
  Game._gpStartBreakout = function _gpStartBreakout() {
    const bricks = [];
    const rows = 5;
    const cols = 8;
    for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) bricks.push({ r, c, alive: true });
    this.githubPackState = {
      id: 'breakout',
      score: 0,
      total: rows * cols,
      lives: 3,
      w: 360,
      h: 260,
      paddleW: 70,
      paddleH: 10,
      paddleX: 145,
      ballX: 180,
      ballY: 180,
      ballR: 6,
      dx: 3.2,
      dy: -3.2,
      move: 0,
      bricks,
    };
    this._gpRenderBreakout();
    this._gpLoopBreakout();
  };

  Game._gpRenderBreakout = function _gpRenderBreakout() {
    const st = this.githubPackState;
    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="quiz-container gp-shell">
        ${header('Breakout', `벽돌 ${st.score}/${st.total} | 생명 ${st.lives}`)}
        <canvas id="gp-breakout-canvas" class="arcade-canvas" width="${st.w}" height="${st.h}"></canvas>
        <div class="arcade-controls">
          <button class="btn-secondary" onmousedown="Game._gpBreakoutMove(-1)" onmouseup="Game._gpBreakoutMove(0)" ontouchstart="Game._gpBreakoutMove(-1)" ontouchend="Game._gpBreakoutMove(0)">왼쪽</button>
          <button class="btn-secondary" onmousedown="Game._gpBreakoutMove(1)" onmouseup="Game._gpBreakoutMove(0)" ontouchstart="Game._gpBreakoutMove(1)" ontouchend="Game._gpBreakoutMove(0)">오른쪽</button>
        </div>
      </div>
    `;
    App.showScreen('game');
    const canvas = document.getElementById('gp-breakout-canvas');
    if (canvas) {
      canvas.onmousemove = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        st.paddleX = Math.max(0, Math.min(st.w - st.paddleW, x - st.paddleW / 2));
      };
    }
  };

  Game._gpBreakoutMove = function _gpBreakoutMove(dir) {
    const st = this.githubPackState;
    st.move = dir;
  };

  Game._gpLoopBreakout = function _gpLoopBreakout() {
    const st = this.githubPackState;
    const canvas = document.getElementById('gp-breakout-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    st.paddleX += st.move * 5;
    st.paddleX = Math.max(0, Math.min(st.w - st.paddleW, st.paddleX));

    st.ballX += st.dx;
    st.ballY += st.dy;

    if (st.ballX < st.ballR || st.ballX > st.w - st.ballR) st.dx *= -1;
    if (st.ballY < st.ballR) st.dy *= -1;

    if (st.ballY >= st.h - st.paddleH - st.ballR && st.ballY <= st.h - st.ballR && st.ballX >= st.paddleX && st.ballX <= st.paddleX + st.paddleW && st.dy > 0) {
      st.dy *= -1;
      const hit = (st.ballX - (st.paddleX + st.paddleW / 2)) / (st.paddleW / 2);
      st.dx = hit * 4;
    }

    const bw = 40; const bh = 14; const ox = 12; const oy = 20; const gx = 4; const gy = 4;
    for (const b of st.bricks) {
      if (!b.alive) continue;
      const x = ox + b.c * (bw + gx);
      const y = oy + b.r * (bh + gy);
      if (st.ballX >= x && st.ballX <= x + bw && st.ballY >= y && st.ballY <= y + bh) {
        b.alive = false;
        st.score += 1;
        st.dy *= -1;
        SFX.play('correct');
        break;
      }
    }

    if (st.ballY > st.h + 20) {
      st.lives -= 1;
      st.ballX = st.w / 2;
      st.ballY = st.h - 40;
      st.dx = 3.2 * (Math.random() < 0.5 ? -1 : 1);
      st.dy = -3.2;
      if (st.lives <= 0) return this._gpFinish('Breakout', `게임 종료. 깬 벽돌: ${st.score}.`);
    }
    if (st.score >= st.total) return this._gpFinish('Breakout', '모든 벽돌을 깼어요!');

    ctx.clearRect(0, 0, st.w, st.h);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, st.w, st.h);
    for (const b of st.bricks) {
      if (!b.alive) continue;
      const x = ox + b.c * (bw + gx);
      const y = oy + b.r * (bh + gy);
      ctx.fillStyle = `hsl(${(b.r * 50 + b.c * 8) % 360}, 75%, 62%)`;
      ctx.fillRect(x, y, bw, bh);
    }
    ctx.fillStyle = '#5c3a9b';
    ctx.fillRect(st.paddleX, st.h - st.paddleH - 6, st.paddleW, st.paddleH);
    ctx.beginPath();
    ctx.arc(st.ballX, st.ballY, st.ballR, 0, Math.PI * 2);
    ctx.fillStyle = '#ff4081';
    ctx.fill();

    st.raf = requestAnimationFrame(() => this._gpLoopBreakout());
  };

  // #15 Snake
  Game._gpStartSnake = function _gpStartSnake() {
    const size = 16;
    this.githubPackState = {
      id: 'snake',
      size,
      score: 0,
      total: 12,
      snake: [[8, 8], [7, 8], [6, 8]],
      dir: [1, 0],
      nextDir: [1, 0],
      food: [randInt(0, size - 1), randInt(0, size - 1)],
      msg: '먹이를 먹고 벽을 피하세요.',
    };
    this._gpRenderSnake();
    this.githubPackState.interval = setInterval(() => this._gpStepSnake(), 130);
  };

  Game._gpSnakeTurn = function _gpSnakeTurn(dir) {
    const st = this.githubPackState;
    const map = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
    const nd = map[dir];
    if (!nd) return;
    if (nd[0] === -st.dir[0] && nd[1] === -st.dir[1]) return;
    st.nextDir = nd;
  };

  Game._gpSnakeSpawnFood = function _gpSnakeSpawnFood() {
    const st = this.githubPackState;
    let p = [randInt(0, st.size - 1), randInt(0, st.size - 1)];
    while (st.snake.some((s) => s[0] === p[0] && s[1] === p[1])) p = [randInt(0, st.size - 1), randInt(0, st.size - 1)];
    st.food = p;
  };

  Game._gpStepSnake = function _gpStepSnake() {
    const st = this.githubPackState;
    st.dir = st.nextDir;
    const head = st.snake[0];
    const nh = [head[0] + st.dir[0], head[1] + st.dir[1]];
    if (nh[0] < 0 || nh[0] >= st.size || nh[1] < 0 || nh[1] >= st.size || st.snake.some((s) => s[0] === nh[0] && s[1] === nh[1])) {
      return this._gpFinish('Snake', `게임 종료. 먹은 먹이: ${st.score}.`);
    }
    st.snake.unshift(nh);
    if (nh[0] === st.food[0] && nh[1] === st.food[1]) {
      st.score += 1;
      SFX.play('correct');
      if (st.score >= st.total) return this._gpFinish('Snake', '멋진 스네이크 플레이!');
      this._gpSnakeSpawnFood();
    } else st.snake.pop();
    return this._gpDrawSnake();
  };

  Game._gpRenderSnake = function _gpRenderSnake() {
    const st = this.githubPackState;
    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="quiz-container gp-shell">
        ${header('Snake', `먹이 ${st.score}/${st.total}`)}
        <canvas id="gp-snake-canvas" class="arcade-canvas" width="320" height="320"></canvas>
        <div class="router-controls">
          <button class="btn-secondary" onclick="Game._gpSnakeTurn('up')">위</button>
          <div class="router-controls-row">
            <button class="btn-secondary" onclick="Game._gpSnakeTurn('left')">왼쪽</button>
            <button class="btn-secondary" onclick="Game._gpSnakeTurn('right')">오른쪽</button>
          </div>
          <button class="btn-secondary" onclick="Game._gpSnakeTurn('down')">아래</button>
        </div>
      </div>
    `;
    App.showScreen('game');
    this._gpDrawSnake();
  };

  Game._gpDrawSnake = function _gpDrawSnake() {
    const st = this.githubPackState;
    const c = document.getElementById('gp-snake-canvas');
    if (!c) return;
    const ctx = c.getContext('2d');
    const unit = c.width / st.size;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#ff80ab';
    ctx.fillRect(st.food[0] * unit, st.food[1] * unit, unit - 1, unit - 1);
    st.snake.forEach((p, i) => {
      ctx.fillStyle = i === 0 ? '#5e35b1' : '#7e57c2';
      ctx.fillRect(p[0] * unit, p[1] * unit, unit - 1, unit - 1);
    });
  };

  // #16 Flappy
  Game._gpStartFlappy = function _gpStartFlappy() {
    this.githubPackState = {
      id: 'flappy',
      score: 0,
      total: 10,
      w: 360,
      h: 260,
      birdY: 130,
      vy: 0,
      pipes: [],
      frame: 0,
      msg: '탭해서 날아오르세요.',
    };
    this._gpRenderFlappy();
    this._gpLoopFlappy();
  };

  Game._gpFlap = function _gpFlap() {
    const st = this.githubPackState;
    st.vy = -5.2;
  };

  Game._gpRenderFlappy = function _gpRenderFlappy() {
    const st = this.githubPackState;
    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="quiz-container gp-shell">
        ${header('Flappy Bird', `점수 ${st.score}/${st.total}`)}
        <canvas id="gp-flappy-canvas" class="arcade-canvas" width="${st.w}" height="${st.h}"></canvas>
        <div class="arcade-controls">
          <button class="btn-primary" onclick="Game._gpFlap()">날갯짓</button>
        </div>
      </div>
    `;
    App.showScreen('game');
  };

  Game._gpLoopFlappy = function _gpLoopFlappy() {
    const st = this.githubPackState;
    const c = document.getElementById('gp-flappy-canvas');
    if (!c) return;
    const ctx = c.getContext('2d');

    st.frame += 1;
    st.vy += 0.3;
    st.birdY += st.vy;

    if (st.frame % 90 === 0) {
      const gapY = randInt(60, 170);
      st.pipes.push({ x: st.w + 10, gapY, passed: false });
    }
    st.pipes.forEach((p) => { p.x -= 2.2; });
    st.pipes = st.pipes.filter((p) => p.x > -40);

    const birdX = 70;
    for (const p of st.pipes) {
      const hitX = birdX + 10 > p.x && birdX - 10 < p.x + 36;
      const hitY = st.birdY - 10 < p.gapY - 46 || st.birdY + 10 > p.gapY + 46;
      if (hitX && hitY) return this._gpFinish('Flappy Bird', `충돌! 점수: ${st.score}.`);
      if (!p.passed && p.x + 36 < birdX) { p.passed = true; st.score += 1; }
    }
    if (st.birdY < 0 || st.birdY > st.h) return this._gpFinish('Flappy Bird', `경계 밖으로 나갔어요. 점수: ${st.score}.`);
    if (st.score >= st.total) return this._gpFinish('Flappy Bird', '플래피 모드를 완전히 익혔어요!');

    ctx.fillStyle = '#e3f2fd';
    ctx.fillRect(0, 0, st.w, st.h);
    ctx.fillStyle = '#66bb6a';
    for (const p of st.pipes) {
      ctx.fillRect(p.x, 0, 36, p.gapY - 46);
      ctx.fillRect(p.x, p.gapY + 46, 36, st.h - (p.gapY + 46));
    }
    ctx.beginPath();
    ctx.arc(birdX, st.birdY, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#ffca28';
    ctx.fill();
    ctx.fillStyle = '#5d4037';
    ctx.fillText(`점수 ${st.score}`, 10, 18);

    st.raf = requestAnimationFrame(() => this._gpLoopFlappy());
  };

  // #17 Pong
  Game._gpStartPong = function _gpStartPong() {
    this.githubPackState = {
      id: 'pong',
      score: 0,
      total: 5,
      w: 360,
      h: 240,
      py: 100,
      ay: 100,
      bw: 8,
      bh: 8,
      bx: 180,
      by: 120,
      dx: 3,
      dy: 2.2,
      move: 0,
      aiScore: 0,
    };
    this._gpRenderPong();
    this._gpLoopPong();
  };

  Game._gpPongMove = function _gpPongMove(dir) {
    const st = this.githubPackState;
    st.move = dir;
  };

  Game._gpRenderPong = function _gpRenderPong() {
    const st = this.githubPackState;
    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="quiz-container gp-shell">
        ${header('Pong', `나 ${st.score} : ${st.aiScore} 컴퓨터`)}
        <canvas id="gp-pong-canvas" class="arcade-canvas" width="${st.w}" height="${st.h}"></canvas>
        <div class="arcade-controls">
          <button class="btn-secondary" onmousedown="Game._gpPongMove(-1)" onmouseup="Game._gpPongMove(0)" ontouchstart="Game._gpPongMove(-1)" ontouchend="Game._gpPongMove(0)">위</button>
          <button class="btn-secondary" onmousedown="Game._gpPongMove(1)" onmouseup="Game._gpPongMove(0)" ontouchstart="Game._gpPongMove(1)" ontouchend="Game._gpPongMove(0)">아래</button>
        </div>
      </div>
    `;
    App.showScreen('game');
  };

  Game._gpLoopPong = function _gpLoopPong() {
    const st = this.githubPackState;
    const c = document.getElementById('gp-pong-canvas');
    if (!c) return;
    const ctx = c.getContext('2d');
    const ph = 48;
    st.py += st.move * 4.5;
    st.py = Math.max(0, Math.min(st.h - ph, st.py));
    st.ay += ((st.by - ph / 2) - st.ay) * 0.08;
    st.ay = Math.max(0, Math.min(st.h - ph, st.ay));

    st.bx += st.dx;
    st.by += st.dy;
    if (st.by < 0 || st.by > st.h - st.bh) st.dy *= -1;

    if (st.bx <= 18 && st.by + st.bh >= st.py && st.by <= st.py + ph && st.dx < 0) st.dx *= -1;
    if (st.bx + st.bw >= st.w - 18 && st.by + st.bh >= st.ay && st.by <= st.ay + ph && st.dx > 0) st.dx *= -1;

    if (st.bx < -20) {
      st.aiScore += 1;
      st.bx = st.w / 2; st.by = st.h / 2; st.dx = 3;
    }
    if (st.bx > st.w + 20) {
      st.score += 1;
      st.bx = st.w / 2; st.by = st.h / 2; st.dx = -3;
    }
    if (st.score >= st.total || st.aiScore >= st.total) {
      return this._gpFinish('Pong', st.score > st.aiScore ? '경기 승리!' : '컴퓨터 승리.');
    }

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, st.w, st.h);
    ctx.fillStyle = '#7e57c2';
    ctx.fillRect(10, st.py, 8, ph);
    ctx.fillRect(st.w - 18, st.ay, 8, ph);
    ctx.fillStyle = '#ff4081';
    ctx.fillRect(st.bx, st.by, st.bw, st.bh);
    ctx.fillStyle = '#bdbdbd';
    for (let y = 0; y < st.h; y += 16) ctx.fillRect(st.w / 2 - 1, y, 2, 8);

    st.raf = requestAnimationFrame(() => this._gpLoopPong());
  };

  // #18 Space Invaders
  Game._gpStartInvaders = function _gpStartInvaders() {
    const aliens = [];
    const rows = 4;
    const cols = 8;
    for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) aliens.push({ x: 36 + c * 36, y: 30 + r * 24, alive: true });
    this.githubPackState = {
      id: 'invaders',
      w: 360,
      h: 280,
      aliens,
      score: 0,
      total: rows * cols,
      px: 170,
      move: 0,
      bullet: null,
      dir: 1,
      frame: 0,
    };
    this._gpRenderInvaders();
    this._gpLoopInvaders();
  };

  Game._gpInvaderMove = function _gpInvaderMove(dir) {
    const st = this.githubPackState;
    st.move = dir;
  };

  Game._gpInvaderShoot = function _gpInvaderShoot() {
    const st = this.githubPackState;
    if (!st.bullet) st.bullet = { x: st.px + 11, y: st.h - 34 };
  };

  Game._gpRenderInvaders = function _gpRenderInvaders() {
    const st = this.githubPackState;
    const screen = document.getElementById('screen-game');
    screen.innerHTML = `
      <div class="quiz-container gp-shell">
        ${header('Space Invaders', `외계인 ${st.score}/${st.total}`)}
        <canvas id="gp-invaders-canvas" class="arcade-canvas" width="${st.w}" height="${st.h}"></canvas>
        <div class="arcade-controls">
          <button class="btn-secondary" onmousedown="Game._gpInvaderMove(-1)" onmouseup="Game._gpInvaderMove(0)" ontouchstart="Game._gpInvaderMove(-1)" ontouchend="Game._gpInvaderMove(0)">왼쪽</button>
          <button class="btn-primary" onclick="Game._gpInvaderShoot()">발사</button>
          <button class="btn-secondary" onmousedown="Game._gpInvaderMove(1)" onmouseup="Game._gpInvaderMove(0)" ontouchstart="Game._gpInvaderMove(1)" ontouchend="Game._gpInvaderMove(0)">오른쪽</button>
        </div>
      </div>
    `;
    App.showScreen('game');
  };

  Game._gpLoopInvaders = function _gpLoopInvaders() {
    const st = this.githubPackState;
    const c = document.getElementById('gp-invaders-canvas');
    if (!c) return;
    const ctx = c.getContext('2d');
    st.frame += 1;

    st.px += st.move * 4.2;
    st.px = Math.max(6, Math.min(st.w - 30, st.px));

    if (st.frame % 20 === 0) {
      let hitEdge = false;
      st.aliens.forEach((a) => {
        if (!a.alive) return;
        a.x += st.dir * 8;
        if (a.x < 12 || a.x > st.w - 24) hitEdge = true;
      });
      if (hitEdge) {
        st.dir *= -1;
        st.aliens.forEach((a) => { if (a.alive) a.y += 10; });
      }
    }

    if (st.bullet) {
      st.bullet.y -= 7;
      if (st.bullet.y < -10) st.bullet = null;
      else {
        for (const a of st.aliens) {
          if (!a.alive) continue;
          if (st.bullet.x >= a.x && st.bullet.x <= a.x + 18 && st.bullet.y >= a.y && st.bullet.y <= a.y + 14) {
            a.alive = false;
            st.bullet = null;
            st.score += 1;
            SFX.play('correct');
            break;
          }
        }
      }
    }

    if (st.score >= st.total) return this._gpFinish('Space Invaders', '모든 외계인을 처치했어요!');
    if (st.aliens.some((a) => a.alive && a.y > st.h - 60)) return this._gpFinish('Space Invaders', '외계인이 기지에 도달했어요.');

    ctx.fillStyle = '#0b1020';
    ctx.fillRect(0, 0, st.w, st.h);
    st.aliens.forEach((a) => {
      if (!a.alive) return;
      ctx.fillStyle = '#80deea';
      ctx.fillRect(a.x, a.y, 18, 14);
    });
    ctx.fillStyle = '#ffee58';
    ctx.fillRect(st.px, st.h - 24, 24, 14);
    if (st.bullet) {
      ctx.fillStyle = '#ff80ab';
      ctx.fillRect(st.bullet.x, st.bullet.y, 3, 10);
    }

    st.raf = requestAnimationFrame(() => this._gpLoopInvaders());
  };
})();
