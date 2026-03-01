// Dedicated 2.5D block counting mode override.
// This keeps IQ camp intact while making block-count routes truly quantity-based.

(() => {
  if (typeof window === 'undefined' || !window.Game) return;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  Object.assign(Game, {
    startBlockCount25D(mode = 'normal') {
      this.clearTimers();
      this.currentCategory = 'math';
      this.currentGame = mode === 'infinite' ? 'block-count-25d-infinite' : 'block-count-25d';
      this.score = 0;
      this.total = 0;

      this.blockCount25D = {
        mode,
        rounds: mode === 'infinite' ? 16 : 10,
        index: 0,
        locked: false,
        round: null,
      };

      this.showBlockCount25DRound();
    },

    buildBlockCount25DRound(index = 0) {
      const level = clamp(1 + Math.floor(index / 3), 1, 6);
      const cells = clamp(4 + Math.floor(level / 2) + randomInt(0, 2), 4, 9);
      const maxHeight = clamp(2 + Math.floor(level / 2), 2, 5);
      const columns = [];

      for (let i = 0; i < cells; i += 1) {
        const shouldExist = Math.random() > 0.2 || columns.length < 2;
        columns.push(shouldExist ? randomInt(1, maxHeight) : 0);
      }

      const total = Math.max(1, columns.reduce((acc, value) => acc + Number(value || 0), 0));
      const choices = new Set([total]);
      while (choices.size < 4) {
        const candidate = clamp(total + randomInt(-4, 4), 1, total + 8);
        choices.add(candidate);
      }

      return {
        columns,
        total,
        choices: this._shuffle(Array.from(choices)),
        hint: '쌓인 블록을 모두 더해서 총 몇 개인지 고르세요.',
      };
    },

    renderBlockCount25DColumn(height = 0, colorSeed = 0) {
      if (!height) {
        return '<div class="block25d-column is-empty"><span class="block25d-empty">·</span></div>';
      }
      const cubes = Array.from({ length: height }, (_, idx) => (
        `<span class="block25d-cube" style="--cube-z:${idx};--cube-hue:${(colorSeed * 31) % 360}"></span>`
      )).join('');
      return `<div class="block25d-column">${cubes}</div>`;
    },

    showBlockCount25DRound() {
      const state = this.blockCount25D;
      if (!state) return;
      if (state.index >= state.rounds) {
        this.showResult(this.currentGame);
        return;
      }

      state.round = this.buildBlockCount25DRound(state.index);
      state.locked = false;
      const round = state.round;
      const progressPct = (state.index / state.rounds) * 100;
      const columnsHtml = round.columns
        .map((height, idx) => this.renderBlockCount25DColumn(height, idx + 1))
        .join('');

      const screen = document.getElementById('screen-game');
      screen.innerHTML = `
        <div class="block25d-container">
          <div class="learn-header">
            <button class="btn-back" onclick="Game.showSelection('math')">
              <span class="back-arrow">&larr;</span>
            </button>
            <h2 class="learn-title">2.5D 블록 세기</h2>
            <span class="game-score">⭐${this.score} | ${state.index + 1}/${state.rounds}</span>
          </div>
          <div class="quiz-progress">
            <div class="quiz-progress-bar" style="width:${progressPct}%"></div>
          </div>
          <div class="block25d-hint">${round.hint}</div>
          <div class="block25d-board">${columnsHtml}</div>
          <div class="block25d-choices">
            ${round.choices.map((choice) => `
              <button class="block25d-choice" onclick="Game.checkBlockCount25DAnswer(${choice}, ${round.total}, this)">
                ${choice}
              </button>
            `).join('')}
          </div>
        </div>
      `;
      App.showScreen('game');
    },

    checkBlockCount25DAnswer(choice, correct, button) {
      const state = this.blockCount25D;
      if (!state || state.locked) return;
      state.locked = true;

      const profile = Profile.getCurrent();
      const ok = Number(choice) === Number(correct);
      this.total += 1;

      const buttons = Array.from(document.querySelectorAll('.block25d-choice'));
      buttons.forEach((node) => { node.disabled = true; });

      if (ok) {
        button.classList.add('correct');
        this.score += 1;
        Reward.addStars((profile?.starsPerCorrect || 1) + 1);
        Reward.addXP((profile?.xpPerGame || 1) + 3);
        SFX.play('correct');

        const progress = Storage.getProgress(App.currentProfile);
        progress.blockCount25dCorrect = (progress.blockCount25dCorrect || 0) + 1;
        Storage.saveProgress(App.currentProfile, progress);
        Daily.updateMissionProgress('spatial');
      } else {
        button.classList.add('wrong');
        const correctBtn = buttons.find((node) => Number(node.textContent.trim()) === Number(correct));
        if (correctBtn) correctBtn.classList.add('correct');
        SFX.play('wrong');
      }

      state.index += 1;
      this.schedule(() => this.showBlockCount25DRound(), ok ? 760 : 1020);
    },
  });
})();

