// Adaptive IQ camp modes built on top of the core Game object.
// Focus domains: visuospatial working memory, non-verbal pattern reasoning.

(() => {
  if (typeof window === 'undefined' || !window.Game) return;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const CAMP_HINTS = [
    '연구 포인트: 짧은 집중 반복 + 난이도 적응이 작업기억 훈련 효율에 중요해요.',
    '연구 포인트: 공간 추론 훈련은 수학 학습 전이 가능성이 보고되었어요.',
    '주의: "지능 점수 급상승"보다 기초 인지기능/학습지속 개선을 목표로 설계했어요.',
  ];

  function buildCorsiSequence(span) {
    const length = clamp(Number(span) || 2, 2, 8);
    const seq = [];
    while (seq.length < length) {
      const next = randomInt(0, 8);
      if (seq.length && seq[seq.length - 1] === next) continue;
      seq.push(next);
    }
    return seq;
  }

  function buildMatrixRound(level = 1) {
    const maxValue = level >= 3 ? 7 : (level === 2 ? 6 : 5);
    const rulePool = level === 1 ? ['row-shift', 'col-shift'] : ['row-shift', 'col-shift', 'row-sum'];
    const rule = pick(rulePool);
    let hint = '행/열의 규칙을 찾으세요.';
    let grid = Array(9).fill(1);

    if (rule === 'row-sum') {
      hint = '각 행의 세 번째 칸은 앞 두 칸 규칙으로 만들어져요.';
      const rows = [];
      for (let r = 0; r < 3; r++) {
        const a = randomInt(1, maxValue - 2);
        const b = randomInt(1, maxValue - a);
        rows.push([a, b, Math.min(maxValue, a + b)]);
      }
      grid = rows.flat();
    } else if (rule === 'col-shift') {
      hint = '아래로 갈수록 같은 간격으로 값이 바뀌어요.';
      const step = randomInt(1, 2);
      const base = [randomInt(1, maxValue), randomInt(1, maxValue), randomInt(1, maxValue)];
      const rows = [];
      for (let r = 0; r < 3; r++) {
        rows.push(base.map((v) => ((v + (step * r) - 1) % maxValue) + 1));
      }
      grid = rows.flat();
    } else {
      hint = '오른쪽으로 갈수록 같은 간격으로 값이 바뀌어요.';
      const step = randomInt(1, 2);
      const rows = [];
      for (let r = 0; r < 3; r++) {
        const start = randomInt(1, maxValue);
        rows.push([
          start,
          ((start + step - 1) % maxValue) + 1,
          ((start + step * 2 - 1) % maxValue) + 1,
        ]);
      }
      grid = rows.flat();
    }

    const missingIndex = randomInt(0, 8);
    const correct = Number(grid[missingIndex]) || 1;
    const choices = new Set([correct]);
    while (choices.size < 4) {
      const candidate = clamp(correct + randomInt(-2, 2), 1, maxValue);
      choices.add(candidate);
    }

    return {
      type: 'matrix',
      hint,
      grid,
      missingIndex,
      correct,
      choices: Game._shuffle(Array.from(choices)),
    };
  }

  function renderStack(value) {
    const total = clamp(Number(value) || 1, 1, 9);
    const cubes = Array.from({ length: total }, (_, idx) => (
      `<span class="iq-cube" style="--iq-z:${idx}"></span>`
    )).join('');
    return `<span class="iq-stack">${cubes}</span>`;
  }

  Object.assign(Game, {
    // Backward compatibility routes from App.
    startQuizMarathon(categoryId = 'hangul') {
      this.clearTimers();
      if (categoryId === 'math') {
        this.startMathQuiz('mixed');
        while (this.quizQueue.length < 18) this.quizQueue.push(this.generateMathQuestion('mixed'));
      } else {
        this.startQuiz(categoryId);
        if (Array.isArray(this.items) && this.items.length) {
          while (this.quizQueue.length < 18) this.quizQueue.push(pick(this.items));
        }
      }
      this.quizGameType = 'quiz-marathon';
    },

    startQuizInfinite(categoryId = 'hangul') {
      this.clearTimers();
      if (categoryId === 'math') {
        this.startMathQuiz('mixed');
        while (this.quizQueue.length < 24) this.quizQueue.push(this.generateMathQuestion('mixed'));
      } else {
        this.startQuiz(categoryId);
        if (Array.isArray(this.items) && this.items.length) {
          while (this.quizQueue.length < 24) this.quizQueue.push(pick(this.items));
        }
      }
      this.quizGameType = 'quiz-infinite';
    },

    startBlockCount25D(mode = 'normal') {
      const rounds = mode === 'infinite' ? 14 : 10;
      this.startIQCamp25D({ forceMode: 'corsi', rounds, title: mode === 'infinite' ? '지능 부트캠프 무한' : '지능 부트캠프' });
    },

    startSpatialMatrix25D() {
      this.startIQCamp25D({ forceMode: 'matrix', rounds: 10, title: '2.5디 매트릭스 지능' });
    },

    startIQCamp25D(options = {}) {
      this.clearTimers();
      this.currentCategory = 'math';
      this.currentGame = options.forceMode === 'matrix'
        ? 'spatial-matrix-25d'
        : (options.forceMode === 'corsi' ? 'block-count-25d' : 'iq-camp-25d');

      this.iqCamp = {
        forceMode: options.forceMode || 'mix',
        title: options.title || '지능 부트캠프',
        rounds: clamp(Number(options.rounds) || 10, 6, 20),
        index: 0,
        span: clamp(Number(options.startSpan) || 2, 2, 6),
        streak: 0,
        score: 0,
        total: 0,
        history: [],
        locked: true,
        input: [],
        current: null,
      };

      this.showIQCampRound();
    },

    buildIQCampRound() {
      const state = this.iqCamp;
      const level = clamp(1 + Math.floor(state.index / 3), 1, 4);
      const mode = state.forceMode === 'mix'
        ? (state.index % 2 === 0 ? 'corsi' : 'matrix')
        : state.forceMode;

      if (mode === 'matrix') {
        return buildMatrixRound(level);
      }
      return {
        type: 'corsi',
        hint: '깜빡이는 순서를 그대로 눌러보세요.',
        sequence: buildCorsiSequence(state.span),
      };
    },

    showIQCampRound() {
      const state = this.iqCamp;
      if (!state) return;
      if (state.index >= state.rounds) {
        this.showIQCampResult();
        return;
      }

      state.current = this.buildIQCampRound();
      state.locked = true;
      state.input = [];

      const progressPct = (state.index / state.rounds) * 100;
      const round = state.current;
      const typeLabel = round.type === 'matrix' ? '패턴 추론' : '시공간 기억';

      let bodyHtml = '';
      if (round.type === 'matrix') {
        const cells = round.grid.map((value, idx) => {
          if (idx === round.missingIndex) return '<div class="iq-matrix-cell missing">?</div>';
          return `<div class="iq-matrix-cell">${renderStack(value)}</div>`;
        }).join('');

        bodyHtml = `
          <div class="iq-round-title" style="display:block;color:#4a356d;font-weight:900;font-size:1rem;text-align:center;">패턴 빈칸 채우기</div>
          <div class="iq-camp-hint">${round.hint}</div>
          <div class="iq-matrix-grid">${cells}</div>
          <div class="iq-matrix-choices">
            ${round.choices.map((choice) => `
              <button class="iq-matrix-choice" data-choice="${choice}" onclick="Game.selectIQCampMatrix(${choice}, ${round.correct}, this)">
                ${renderStack(choice)}
                <span class="iq-choice-label">${choice}</span>
              </button>
            `).join('')}
          </div>
        `;
      } else {
        const tiles = Array.from({ length: 9 }, (_, idx) => `
          <button class="iq-corsi-tile" data-idx="${idx}" onclick="Game.tapIQCampTile(${idx}, this)">
            <span>${idx + 1}</span>
          </button>
        `).join('');
        bodyHtml = `
          <div class="iq-round-title" style="display:block;color:#4a356d;font-weight:900;font-size:1rem;text-align:center;">순서 기억하기</div>
          <div class="iq-camp-hint">${round.hint}</div>
          <div class="iq-corsi-meta">현재 스팬 <strong>${state.span}</strong> · 입력 ${state.input.length}/${round.sequence.length}</div>
          <div class="iq-corsi-board">${tiles}</div>
        `;
      }

      const screen = document.getElementById('screen-game');
      screen.innerHTML = `
        <div class="iq-camp-container">
          <div class="learn-header">
            <button class="btn-back" onclick="Game.showSelection('math')">
              <span class="back-arrow">&larr;</span>
            </button>
            <h2 class="learn-title">${state.title}</h2>
            <span class="game-score">⭐ ${state.score} | ${state.index + 1}/${state.rounds}</span>
          </div>
          <div class="quiz-progress">
            <div class="quiz-progress-bar" style="width:${progressPct}%"></div>
          </div>
          <div class="iq-camp-type">${typeLabel}</div>
          ${bodyHtml}
        </div>
      `;
      App.showScreen('game');

      if (round.type === 'corsi') {
        this.playIQCampSequence(round.sequence);
      } else {
        state.locked = false;
      }
    },

    playIQCampSequence(sequence) {
      const state = this.iqCamp;
      if (!state) return;
      state.locked = true;
      const tiles = Array.from(document.querySelectorAll('.iq-corsi-tile'));
      let step = 0;
      const pulse = () => {
        if (step >= sequence.length) {
          state.locked = false;
          return;
        }
        const idx = sequence[step];
        const tile = tiles[idx];
        if (!tile) {
          step += 1;
          this.schedule(pulse, 160);
          return;
        }
        tile.classList.add('active');
        this.schedule(() => tile.classList.remove('active'), 380);
        step += 1;
        this.schedule(pulse, 520);
      };
      this.schedule(pulse, 420);
    },

    tapIQCampTile(index, button) {
      const state = this.iqCamp;
      if (!state || state.locked || state.current?.type !== 'corsi') return;
      const round = state.current;
      const target = round.sequence[state.input.length];

      if (Number(index) === Number(target)) {
        state.input.push(index);
        button.classList.add('correct');
        button.disabled = true;
        if (state.input.length >= round.sequence.length) {
          this.finishIQCampRound(true);
        }
        return;
      }

      button.classList.add('wrong');
      state.locked = true;
      this.finishIQCampRound(false);
    },

    selectIQCampMatrix(choice, correct, button) {
      const state = this.iqCamp;
      if (!state || state.locked || state.current?.type !== 'matrix') return;
      state.locked = true;
      const buttons = Array.from(document.querySelectorAll('.iq-matrix-choice'));
      const ok = Number(choice) === Number(correct);
      if (ok) {
        button.classList.add('correct');
      } else {
        button.classList.add('wrong');
        const correctBtn = buttons.find((node) => Number(node.dataset.choice) === Number(correct));
        if (correctBtn) correctBtn.classList.add('correct');
      }
      buttons.forEach((node) => { node.disabled = true; });
      this.finishIQCampRound(ok);
    },

    finishIQCampRound(success) {
      const state = this.iqCamp;
      if (!state) return;
      const profile = Profile.getCurrent();
      state.total += 1;
      state.history.push(success ? 1 : 0);
      state.history = state.history.slice(-12);

      if (success) {
        state.score += 1;
        state.streak += 1;
        Reward.addStars((profile?.starsPerCorrect || 1) + 1);
        Reward.addXP((profile?.xpPerGame || 1) + 4);
        SFX.play('correct');
        Daily.updateMissionProgress('iq-program');
      } else {
        state.streak = 0;
        SFX.play('wrong');
      }

      if (success && state.streak >= 2) {
        state.span = clamp(state.span + 1, 2, 8);
        state.streak = 0;
      } else if (!success) {
        state.span = clamp(state.span - 1, 2, 8);
      }

      state.index += 1;
      this.schedule(() => this.showIQCampRound(), success ? 850 : 1050);
    },

    showIQCampResult() {
      const state = this.iqCamp;
      if (!state) return;
      const accuracy = state.total > 0 ? Math.round((state.score / state.total) * 100) : 0;
      const message = accuracy >= 80
        ? '최고예요! 인지 부트캠프 클리어!'
        : (accuracy >= 60 ? '좋아요! 한 단계씩 성장 중이에요.' : '좋은 시작이에요. 내일 한 번 더 도전!');

      const screen = document.getElementById('screen-game');
      screen.innerHTML = `
        <div class="result-container iq-camp-result">
          <div class="result-stars">${'⭐'.repeat(Math.max(1, Math.min(10, state.score)))}</div>
          <h2 class="result-message">${message}</h2>
          <div class="result-score">${state.score} / ${state.total} (${accuracy}%)</div>
          <div class="iq-camp-summary">
            <div>최종 스팬: <strong>${state.span}</strong></div>
            <div>라운드 수: <strong>${state.rounds}</strong></div>
            <div>추천: <strong>${pick(CAMP_HINTS)}</strong></div>
          </div>
          <div class="result-buttons">
            <button class="btn-primary" onclick="Game.startIQCamp25D()">다시 하기 🔄</button>
            <button class="btn-secondary" onclick="Game.showSelection('math')">다른 게임 🎮</button>
            <button class="btn-secondary" onclick="App.navigate('home')">홈으로 🏠</button>
          </div>
        </div>
      `;
      SFX.play('celebrate');
    },
  });

  const originalRestart = typeof Game.restart === 'function' ? Game.restart.bind(Game) : null;
  Game.restart = function restartPatched(gameType) {
    if (gameType === 'quiz-marathon') return this.startQuizMarathon(this.currentCategory || 'math');
    if (gameType === 'quiz-infinite') return this.startQuizInfinite(this.currentCategory || 'math');
    if (gameType === 'iq-camp-25d') return this.startIQCamp25D();
    if (gameType === 'spatial-matrix-25d') return this.startSpatialMatrix25D();
    if (gameType === 'block-count-25d') return this.startBlockCount25D();
    if (gameType === 'block-count-25d-infinite') return this.startBlockCount25D('infinite');
    if (originalRestart) return originalRestart(gameType);
  };
})();
