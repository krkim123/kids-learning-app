(function initExtraPuzzleModes(global) {
  if (!global || !global.Game) return;
  const Game = global.Game;

  const BLOCKY_PIECE_TEMPLATES = [
    { id: "dot", color: "#ff6f91", cells: [[0, 0]] },
    { id: "line2h", color: "#ff9671", cells: [[0, 0], [0, 1]] },
    { id: "line2v", color: "#ffc75f", cells: [[0, 0], [1, 0]] },
    { id: "line3h", color: "#f9f871", cells: [[0, 0], [0, 1], [0, 2]] },
    { id: "line3v", color: "#4cd97b", cells: [[0, 0], [1, 0], [2, 0]] },
    { id: "square2", color: "#4db6ff", cells: [[0, 0], [0, 1], [1, 0], [1, 1]] },
    { id: "l3", color: "#7b8bff", cells: [[0, 0], [1, 0], [1, 1]] },
    { id: "l4", color: "#c07cff", cells: [[0, 0], [1, 0], [2, 0], [2, 1]] },
    { id: "t4", color: "#ff7dc8", cells: [[0, 1], [1, 0], [1, 1], [1, 2]] },
  ];

  const BUBBLE_PALETTES = {
    storm: ["#65c9ff", "#8a7bff", "#ff8d8d", "#ffd166", "#5ad79f"],
    charms: ["#ff66a8", "#ffd166", "#6cc4ff", "#9d7dff", "#66d1ad"],
  };

  const SUIKA_CHAIN = ["🍒", "🍓", "🍊", "🍎", "🍐", "🍑", "🍍", "🍈", "🍉"];
  const DIR4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  const BRAIN_LEVELS = {
    tricky: [
      {
        type: "title-click",
        title: "1단계: 숨은 정답",
        prompt: "아래 버튼은 전부 가짜입니다. 제목을 눌러 통과하세요.",
      },
      {
        type: "tap-target",
        title: "2단계: 빠른 반응",
        prompt: "전구를 5번 눌러 켜세요.",
        targetLabel: "💡",
        targetCount: 5,
      },
      {
        type: "hold",
        title: "3단계: 길게 누르기",
        prompt: "버튼을 1.3초 이상 길게 눌러 잠금을 해제하세요.",
        holdMs: 1300,
        holdLabel: "길게 누르기",
      },
      {
        type: "slider",
        title: "4단계: 눈금 맞추기",
        prompt: "슬라이더 값을 정확히 73으로 맞추세요.",
        min: 0,
        max: 100,
        target: 73,
        tolerance: 0,
      },
      {
        type: "sequence",
        title: "5단계: 순서 함정",
        prompt: "2 → 4 → 1 → 3 순서로 눌러주세요.",
        buttons: ["1", "2", "3", "4"],
        order: ["2", "4", "1", "3"],
      },
      {
        type: "choice",
        title: "6단계: 마지막 선택",
        prompt: "헷갈리는 문제를 만났을 때 가장 좋은 행동은?",
        options: ["감으로 누르기", "문제를 다시 읽기", "넘어가기"],
        correctIndex: 1,
        explain: "함정 문제일수록 문장을 다시 읽는 게 핵심입니다.",
      },
    ],
    stories: [
      {
        type: "drag-match",
        title: "이야기 1: 문 열기",
        prompt: "열쇠를 올바른 문에 드래그하세요.",
        items: [
          { id: "key", label: "🗝️ 열쇠" },
          { id: "coin", label: "🪙 동전" },
        ],
        zones: [{ id: "door", label: "🚪 잠긴 문", accept: "key" }],
      },
      {
        type: "toggle",
        title: "이야기 2: 불 켜기",
        prompt: "세 개의 스위치를 모두 ON으로 만드세요.",
        labels: ["전등A", "전등B", "전등C"],
        target: [true, true, true],
      },
      {
        type: "sequence",
        title: "이야기 3: 발자국 추적",
        prompt: "왼쪽부터 발자국 순서 1 → 2 → 3을 맞추세요.",
        buttons: ["👣1", "👣2", "👣3"],
        order: ["👣1", "👣2", "👣3"],
      },
      {
        type: "hold",
        title: "이야기 4: 밧줄 고정",
        prompt: "밧줄을 1.5초 이상 눌러 고정하세요.",
        holdMs: 1500,
        holdLabel: "🪢 밧줄 잡기",
      },
      {
        type: "drag-match",
        title: "이야기 5: 식물 살리기",
        prompt: "물과 햇빛을 올바른 대상에 각각 배치하세요.",
        items: [
          { id: "water", label: "💧 물" },
          { id: "sun", label: "☀️ 햇빛" },
        ],
        zones: [
          { id: "plant", label: "🪴 식물", accept: "water" },
          { id: "solar", label: "🔋 태양 패널", accept: "sun" },
        ],
      },
      {
        type: "choice",
        title: "이야기 6: 출구 선택",
        prompt: "복도 끝에 두 문이 있을 때 먼저 해야 할 일은?",
        options: ["바로 뛰어가기", "표지/단서 확인", "눈감고 걷기"],
        correctIndex: 1,
        explain: "상황 확인이 우선입니다.",
      },
    ],
    quests: [
      {
        type: "drag-match",
        title: "퀘스트 1: 지도 활성화",
        prompt: "나침반을 지도 위 슬롯에 드래그하세요.",
        items: [
          { id: "compass", label: "🧭 나침반" },
          { id: "apple", label: "🍎 사과" },
        ],
        zones: [{ id: "map", label: "🗺️ 지도", accept: "compass" }],
      },
      {
        type: "tap-target",
        title: "퀘스트 2: 봉인 해제",
        prompt: "룬 버튼을 4번 탭하세요.",
        targetLabel: "🔮",
        targetCount: 4,
      },
      {
        type: "slider",
        title: "퀘스트 3: 에너지 조절",
        prompt: "에너지 슬라이더를 50으로 맞추세요.",
        min: 0,
        max: 100,
        target: 50,
        tolerance: 0,
      },
      {
        type: "sequence",
        title: "퀘스트 4: 룬 순서",
        prompt: "△ → ○ → □ 순서로 누르세요.",
        buttons: ["△", "○", "□"],
        order: ["△", "○", "□"],
      },
      {
        type: "title-click",
        title: "퀘스트 5: 보이지 않는 스위치",
        prompt: "스위치는 제목에 숨겨져 있어요. 제목을 눌러 진행하세요.",
      },
      {
        type: "hold",
        title: "퀘스트 6: 포털 유지",
        prompt: "포털 버튼을 1.2초 유지하세요.",
        holdMs: 1200,
        holdLabel: "🌀 포털 유지",
      },
    ],
  };

  function appRef() {
    if (typeof App !== "undefined" && App) return App;
    if (global.App) return global.App;
    return null;
  }

  function showGameScreen() {
    const app = appRef();
    if (app && typeof app.showScreen === "function") app.showScreen("game");
  }

  function backToPlay() {
    const app = appRef();
    if (app && typeof app.tabPlay === "function") app.tabPlay();
  }

  function safeSchedule(game, fn, delay) {
    if (game && typeof game.schedule === "function") {
      game.schedule(fn, delay);
      return;
    }
    setTimeout(fn, delay);
  }

  function safeResult(game, gameType) {
    if (game && typeof game.showResult === "function") {
      game.showResult(gameType);
      return;
    }
    backToPlay();
  }

  function rewardCorrect(profile, starsBonus = 1, xpBonus = 2) {
    if (typeof Reward === "undefined") return;
    Reward.addStars((profile?.starsPerCorrect || 1) + starsBonus);
    Reward.addXP((profile?.xpPerGame || 8) + xpBonus);
  }

  function extraHeader(title, score) {
    return `
      <div class="learn-header">
        <button class="btn-back" onclick="App.tabPlay()"><span class="back-arrow">&larr;</span></button>
        <h2 class="learn-title">${title}</h2>
        <span class="game-score">점수 ${score}</span>
      </div>
    `;
  }

  function renderChoiceButtons(options, handlerName) {
    return `
      <div class="brain-test-options">
        ${options.map((text, idx) => `<button class="brain-test-option" onclick="${handlerName}(${idx})">${text}</button>`).join("")}
      </div>
    `;
  }

  function setText(id, text) {
    const node = document.getElementById(id);
    if (node) node.textContent = text;
  }

  Object.assign(Game, {
    startQuizMarathon(categoryId) {
      this.startQuiz(categoryId || this.currentCategory || "hangul");
    },

    startQuizInfinite(categoryId) {
      this.startQuiz(categoryId || this.currentCategory || "hangul");
    },

    ensureExtraMathCards() {
      const screen = document.getElementById("screen-game-select");
      const wrap = screen?.querySelector(".game-mode-cards");
      if (!wrap) return;
      if (wrap.querySelector('[data-extra-mode="brain-quests"]')) return;

      const cards = [
        { k: "blocky", i: "🟥", n: "블록 블라스트", d: "블록 배치로 가로/세로 줄 지우기", o: "Game.startBlockyBlast()" },
        { k: "merge", i: "🔢", n: "숫자 머지 러시", d: "숫자를 놓고 연쇄 머지로 성장시키기", o: "Game.startMergeNumbers()" },
        { k: "storm", i: "🫧", n: "버블 스톰", d: "클러스터를 터뜨려 파도 버티기", o: "Game.startBubblePop('storm')" },
        { k: "charms", i: "💎", n: "버블 참스", d: "보석 버블 콤보로 목표 점수 달성", o: "Game.startBubblePop('charms')" },
        { k: "dog", i: "🐶", n: "세이브 도고고", d: "벽을 배치해 벌의 침입 차단", o: "Game.startSaveDogogo()" },
        { k: "suika", i: "🍉", n: "수박 머지 드롭", d: "과일을 떨어뜨려 합치고 진화시키기", o: "Game.startSuikaMerge()" },
        { k: "brain-tricky", i: "🧠", n: "브레인 테스트", d: "트릭 조작 퍼즐", o: "Game.startBrainTestTricky()" },
        { k: "brain-stories", i: "📖", n: "브레인 테스트 2", d: "상황형 조작 퍼즐", o: "Game.startBrainTestStories()" },
        { k: "brain-quests", i: "🧭", n: "브레인 테스트 3", d: "퀘스트형 조작 퍼즐", o: "Game.startBrainTestQuests()" },
      ];

      cards.forEach((card) => {
        const btn = document.createElement("button");
        btn.className = "game-mode-card";
        btn.dataset.extraMode = card.k;
        btn.setAttribute("onclick", card.o);
        btn.innerHTML = `
          <div class="game-mode-icon">${card.i}</div>
          <div>
            <div class="game-mode-name">${card.n}</div>
            <div class="game-mode-desc">${card.d}</div>
          </div>
        `;
        wrap.appendChild(btn);
      });
    },

    showArcadeResult(title, success, message, detail, restartCall) {
      if (window.App && typeof App.completeActiveRecommendation === "function") {
        App.completeActiveRecommendation();
      }
      this.playJuice(success ? "win" : "line");
      const screen = document.getElementById("screen-game");
      screen.innerHTML = `
        <div class="result-container">
          <div class="result-stars">${success ? "⭐⭐⭐" : "⭐"}</div>
          <h2 class="result-message">${message}</h2>
          <div class="result-score">점수 ${this.score}</div>
          <div class="brain-test-subhint">${title} · ${detail}</div>
          <div class="result-buttons">
            <button class="btn-primary" onclick="${restartCall}">다시 하기 🔄</button>
            <button class="btn-secondary" onclick="App.tabPlay()">다른 게임 🎮</button>
            <button class="btn-secondary" onclick="App.navigate('home')">홈으로 🏠</button>
          </div>
        </div>
      `;
      showGameScreen();
    },

    fxKey(row, col) {
      return `${row},${col}`;
    },

    setFxCells(name, cells) {
      this[name] = new Set((cells || []).map(([r, c]) => this.fxKey(r, c)));
    },

    hasFxCell(name, row, col) {
      return !!this[name]?.has(this.fxKey(row, col));
    },

    clearFxCells(name) {
      this[name] = null;
    },

    triggerShake(kind = "soft") {
      this.fxShakeKind = kind;
      this.fxShakeAt = Date.now();
    },

    triggerFlash(kind = "warm") {
      this.fxFlashKind = kind;
      this.fxFlashAt = Date.now();
    },

    getShakeClass() {
      if (!this.fxShakeAt) return "";
      const elapsed = Date.now() - this.fxShakeAt;
      if (elapsed > 340) {
        this.fxShakeAt = 0;
        return "";
      }
      return this.fxShakeKind === "hard" ? "fx-shake-hard" : "fx-shake-soft";
    },

    getActiveContainer() {
      return document.querySelector("#screen-game .shape3d-container");
    },

    playJuice(kind = "tap") {
      const el = this.getActiveContainer();
      const gsapRef = window.gsap;
      const confettiRef = window.confetti;
      const animeRef = window.anime;

      if (el && gsapRef) {
        if (kind === "win") {
          gsapRef.fromTo(el, { scale: 0.97 }, { scale: 1, duration: 0.28, ease: "back.out(2.4)" });
        } else if (kind === "smash" || kind === "line") {
          gsapRef.fromTo(el, { x: -2 }, { x: 2, duration: 0.06, ease: "power1.inOut", repeat: 4, yoyo: true });
        } else {
          gsapRef.fromTo(el, { scale: 0.992 }, { scale: 1, duration: 0.14, ease: "power2.out" });
        }
      }

      if (el && typeof animeRef === "function" && kind !== "win") {
        if (typeof animeRef.remove === "function") animeRef.remove(el);
        animeRef({
          targets: el,
          filter: ["brightness(1.02)", "brightness(1)"],
          duration: 180,
          easing: "easeOutQuad",
        });
      }

      if (typeof navigator !== "undefined" && navigator.vibrate) {
        if (kind === "win") navigator.vibrate([24, 18, 42]);
        else if (kind === "smash") navigator.vibrate(20);
        else if (kind === "line" || kind === "merge") navigator.vibrate(14);
      }

      if (typeof confettiRef === "function") {
        if (kind === "win") {
          confettiRef({ particleCount: 90, spread: 75, origin: { y: 0.62 } });
        } else if (kind === "line") {
          confettiRef({ particleCount: 28, spread: 48, origin: { y: 0.68 } });
        }
      }

      if (typeof window.SFX !== "undefined" && typeof SFX.play === "function") {
        if (kind === "win") SFX.play("celebrate");
        else if (kind === "smash") SFX.play("wrong");
        else SFX.play("correct");
      }
    },

    showComboBadge(text) {
      this.fxComboText = text;
      this.fxComboAt = Date.now();
      safeSchedule(this, () => { this.fxComboText = ""; }, 760);
    },

    addFxFloat(text, tone = "score") {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const x = Math.round(20 + Math.random() * 60);
      const y = Math.round(50 + Math.random() * 26);
      this.fxFloats = [...(this.fxFloats || []), { id, text, tone, x, y }].slice(-6);
      safeSchedule(this, () => {
        this.fxFloats = (this.fxFloats || []).filter((it) => it.id !== id);
      }, 880);
    },

    renderFxLayer() {
      const floats = (this.fxFloats || [])
        .map((it) => `<div class="game-fx-float ${it.tone}" style="left:${it.x}%;top:${it.y}%">${it.text}</div>`)
        .join("");
      const combo = this.fxComboText
        ? `<div class="game-fx-combo">${this.fxComboText}</div>`
        : "";
      const flash = this.fxFlashAt && (Date.now() - this.fxFlashAt < 240)
        ? `<div class="game-fx-flash ${this.fxFlashKind || "warm"}"></div>`
        : "";
      return `<div class="game-fx-layer">${flash}${floats}${combo}</div>`;
    },

    getBlockyPieceBounds(cells) {
      let h = 0;
      let w = 0;
      (cells || []).forEach(([r, c]) => {
        h = Math.max(h, r + 1);
        w = Math.max(w, c + 1);
      });
      return { w, h };
    },

    pickBlockyPiece() {
      const tpl = BLOCKY_PIECE_TEMPLATES[Math.floor(Math.random() * BLOCKY_PIECE_TEMPLATES.length)] || BLOCKY_PIECE_TEMPLATES[0];
      const { w, h } = this.getBlockyPieceBounds(tpl.cells);
      return { ...tpl, w, h };
    },

    refillBlockyHand() {
      this.blockyHand = Array.from({ length: 3 }, () => this.pickBlockyPiece());
      this.blockySelected = 0;
    },

    canPlaceBlockyPiece(piece, row, col) {
      if (!piece) return false;
      return (piece.cells || []).every(([dr, dc]) => {
        const r = row + dr;
        const c = col + dc;
        if (r < 0 || c < 0 || r >= this.blockyRows || c >= this.blockyCols) return false;
        return !this.blockyBoard[r][c];
      });
    },

    blockyLineClearBonus() {
      const fullRows = [];
      const fullCols = [];
      for (let r = 0; r < this.blockyRows; r += 1) {
        if (this.blockyBoard[r].every(Boolean)) fullRows.push(r);
      }
      for (let c = 0; c < this.blockyCols; c += 1) {
        let ok = true;
        for (let r = 0; r < this.blockyRows; r += 1) {
          if (!this.blockyBoard[r][c]) {
            ok = false;
            break;
          }
        }
        if (ok) fullCols.push(c);
      }
      if (!fullRows.length && !fullCols.length) return 0;

      fullRows.forEach((r) => {
        for (let c = 0; c < this.blockyCols; c += 1) this.blockyBoard[r][c] = 0;
      });
      fullCols.forEach((c) => {
        for (let r = 0; r < this.blockyRows; r += 1) this.blockyBoard[r][c] = 0;
      });
      return (fullRows.length * 12) + (fullCols.length * 12);
    },

    hasBlockyAnyMove() {
      return (this.blockyHand || []).some((piece) => {
        if (!piece) return false;
        for (let r = 0; r < this.blockyRows; r += 1) {
          for (let c = 0; c < this.blockyCols; c += 1) {
            if (this.canPlaceBlockyPiece(piece, r, c)) return true;
          }
        }
        return false;
      });
    },

    selectBlockyPiece(index) {
      if (!this.blockyHand?.[index]) return;
      this.blockySelected = index;
      this.blockyHint = "보드 빈칸을 눌러 블록을 배치하세요.";
      this.renderBlockyBlastBoard();
    },

    placeBlockyPieceAt(row, col) {
      const piece = this.blockyHand?.[this.blockySelected];
      if (!piece) {
        this.blockyHint = "먼저 사용할 블록을 선택하세요.";
        this.renderBlockyBlastBoard();
        return;
      }
      if (!this.canPlaceBlockyPiece(piece, row, col)) {
        this.blockyHint = "여기에는 블록을 둘 수 없어요.";
        this.renderBlockyBlastBoard();
        return;
      }

      const placed = [];
      (piece.cells || []).forEach(([dr, dc]) => {
        const rr = row + dr;
        const cc = col + dc;
        this.blockyBoard[rr][cc] = piece.color;
        placed.push([rr, cc]);
      });
      this.playJuice("tap");
      this.setFxCells("blockyPlacedFx", placed);
      this.score += (piece.cells || []).length;
      this.blockyMoves += 1;
      this.blockyHand[this.blockySelected] = null;
      this.addFxFloat(`+${(piece.cells || []).length}`, "score");

      const bonus = this.blockyLineClearBonus();
      if (bonus > 0) {
        this.score += bonus;
        this.playJuice("line");
        this.triggerShake("soft");
        this.triggerFlash("warm");
        this.showComboBadge("LINE CLEAR");
        this.addFxFloat(`라인 +${bonus}`, "bonus");
      }

      if (this.blockyHand.every((p) => !p)) {
        this.refillBlockyHand();
      } else if (!this.blockyHand[this.blockySelected]) {
        this.blockySelected = this.blockyHand.findIndex(Boolean);
      }

      if (this.score >= this.blockyTargetScore) {
        this.showArcadeResult("🟥 블록 블라스트", true, "라인 클리어 성공!", `목표 ${this.blockyTargetScore}점 달성 · ${this.blockyMoves}턴`, "Game.startBlockyBlast()");
        return;
      }
      if (!this.hasBlockyAnyMove()) {
        this.showArcadeResult("🟥 블록 블라스트", false, "놓을 곳이 없어 종료!", `최종 ${this.score}점 · ${this.blockyMoves}턴`, "Game.startBlockyBlast()");
        return;
      }

      this.blockyHint = bonus > 0 ? `라인 정리 보너스 +${bonus}` : "좋아요! 다음 블록을 배치하세요.";
      this.renderBlockyBlastBoard();
    },

    renderBlockyMiniPiece(piece) {
      if (!piece) return `<div class="blocky-hand-empty">사용 완료</div>`;
      const on = new Set((piece.cells || []).map(([r, c]) => `${r},${c}`));
      const dots = [];
      for (let r = 0; r < piece.h; r += 1) {
        for (let c = 0; c < piece.w; c += 1) {
          const active = on.has(`${r},${c}`) ? " on" : "";
          dots.push(`<span class="blocky-mini-cell${active}" style="${active ? `--piece-color:${piece.color};` : ""}"></span>`);
        }
      }
      return `<div class="blocky-mini-grid" style="--w:${piece.w};--h:${piece.h};--piece-color:${piece.color};">${dots.join("")}</div>`;
    },

    renderBlockyBlastBoard() {
      const shake = this.getShakeClass();
      const boardHtml = this.blockyBoard
        .map((row, r) => `<div class="blocky-row">${row
          .map((v, c) => {
            const placedFx = this.hasFxCell("blockyPlacedFx", r, c) ? " fx-drop" : "";
            return `<button class="blocky-cell${v ? " filled" : ""}${placedFx}" style="${v ? `--cell-color:${v}` : ""}" onclick="Game.placeBlockyPieceAt(${r}, ${c})"></button>`;
          })
          .join("")}</div>`)
        .join("");
      const handHtml = (this.blockyHand || [])
        .map((piece, idx) => `<button class="blocky-hand-piece ${this.blockySelected === idx ? "active" : ""} ${piece ? "" : "used"}" onclick="Game.selectBlockyPiece(${idx})"><div class="blocky-hand-icon">블록 ${idx + 1}</div>${this.renderBlockyMiniPiece(piece)}</button>`)
        .join("");

      document.getElementById("screen-game").innerHTML = `
        <div class="shape3d-container blocky-blast-container ${shake}">
          ${extraHeader("🟥 블록 블라스트", this.score)}
          <div class="shape3d-meta-row"><span>목표 ${this.blockyTargetScore}점</span><span>턴 ${this.blockyMoves}</span></div>
          <div class="shape-move-feedback">${this.blockyHint || ""}</div>
          <div class="blocky-board">${boardHtml}</div>
          <div class="blocky-hand">${handHtml}</div>
          <div class="blocky-actions">
            <button class="btn-secondary" onclick="Game.startBlockyBlast()">새 게임</button>
          </div>
          ${this.renderFxLayer()}
        </div>
      `;
      showGameScreen();
      this.clearFxCells("blockyPlacedFx");
    },

    startBlockyBlast() {
      this.clearTimers?.();
      this.currentCategory = "math";
      this.currentGame = "blocky-blast";
      this.score = 0;
      this.blockyRows = 8;
      this.blockyCols = 8;
      this.blockyBoard = Array.from({ length: this.blockyRows }, () => Array(this.blockyCols).fill(0));
      this.blockyTargetScore = 120;
      this.blockyMoves = 0;
      this.blockyHint = "아래 블록을 선택한 뒤 보드를 눌러 배치하세요.";
      this.fxFloats = [];
      this.fxShakeAt = 0;
      this.refillBlockyHand();
      this.renderBlockyBlastBoard();
    },

    pickMergeSpawnValue() {
      return Math.random() < 0.68 ? 2 : 4;
    },

    getMergeColorStyle(value) {
      const p = Math.max(1, Math.log2(value || 2));
      const h = (p * 33) % 360;
      const s = 72;
      const l = Math.max(34, 66 - (p * 3));
      return `--merge-h:${h};--merge-s:${s}%;--merge-l:${l}%`;
    },

    findMergeGroups() {
      const visited = Array.from({ length: this.mergeRows }, () => Array(this.mergeCols).fill(false));
      const groups = [];
      for (let r = 0; r < this.mergeRows; r += 1) {
        for (let c = 0; c < this.mergeCols; c += 1) {
          const value = this.mergeBoard[r][c];
          if (!value || visited[r][c]) continue;
          const q = [[r, c]];
          visited[r][c] = true;
          const cells = [];
          while (q.length) {
            const [cr, cc] = q.shift();
            cells.push([cr, cc]);
            DIR4.forEach(([dr, dc]) => {
              const nr = cr + dr;
              const nc = cc + dc;
              if (nr < 0 || nc < 0 || nr >= this.mergeRows || nc >= this.mergeCols) return;
              if (visited[nr][nc]) return;
              if (this.mergeBoard[nr][nc] !== value) return;
              visited[nr][nc] = true;
              q.push([nr, nc]);
            });
          }
          if (cells.length >= 2) groups.push({ value, cells });
        }
      }
      return groups;
    },

    resolveMergeNumbers() {
      let chain = 0;
      let gained = 0;
      const anchors = [];
      while (true) {
        const groups = this.findMergeGroups();
        if (!groups.length) break;
        chain += 1;
        groups.forEach((group) => {
          const anchor = [...group.cells].sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]))[0];
          group.cells.forEach(([r, c]) => { this.mergeBoard[r][c] = 0; });
          const next = group.value * 2;
          this.mergeBoard[anchor[0]][anchor[1]] = next;
          anchors.push(anchor);
          this.mergeBestValue = Math.max(this.mergeBestValue, next);
          gained += next + (group.cells.length * 2);
        });
      }
      return { chain, gained, anchors };
    },

    hasMergeEmptyCell() {
      return this.mergeBoard.some((row) => row.some((v) => !v));
    },

    checkMergeEndState() {
      if (this.mergeBestValue >= this.mergeTargetValue) {
        this.showArcadeResult("🔢 숫자 머지 러시", true, "초고수 머지 성공!", `최고 타일 ${this.mergeBestValue} · ${this.mergeMoves}턴`, "Game.startMergeNumbers()");
        return true;
      }
      if (!this.hasMergeEmptyCell() && this.findMergeGroups().length === 0) {
        this.showArcadeResult("🔢 숫자 머지 러시", false, "보드가 가득 찼어요!", `최고 타일 ${this.mergeBestValue} · 점수 ${this.score}`, "Game.startMergeNumbers()");
        return true;
      }
      return false;
    },

    rerollMergeNext() {
      if (this.mergeRerolls <= 0) {
        this.mergeHint = "리롤 횟수를 모두 사용했어요.";
        this.renderMergeBoard();
        return;
      }
      this.mergeRerolls -= 1;
      this.mergeNextValue = this.pickMergeSpawnValue();
      this.mergeHint = "다음 숫자를 다시 뽑았어요.";
      this.renderMergeBoard();
    },

    handleMergeCell(row, col) {
      if (this.mergeBoard[row]?.[col]) {
        this.mergeHint = "빈 칸을 눌러 숫자를 배치하세요.";
        this.renderMergeBoard();
        return;
      }
      const value = this.mergeNextValue;
      this.mergeBoard[row][col] = value;
      this.playJuice("tap");
      this.setFxCells("mergeSpawnFx", [[row, col]]);
      this.mergeMoves += 1;
      this.score += value;
      this.mergeBestValue = Math.max(this.mergeBestValue, value);
      this.mergeNextValue = this.pickMergeSpawnValue();
      this.addFxFloat(`+${value}`, "score");

      const merged = this.resolveMergeNumbers();
      this.score += merged.gained;
      if (merged.gained > 0) {
        this.setFxCells("mergeBurstFx", merged.anchors || []);
        this.playJuice("merge");
        this.triggerShake("soft");
        this.triggerFlash("cool");
        this.showComboBadge(`x${Math.max(2, merged.chain)} MERGE`);
        this.addFxFloat(`머지 +${merged.gained}`, "bonus");
      }
      this.mergeHint = merged.chain > 0 ? `연쇄 ${merged.chain}콤보!` : "좋아요! 다음 숫자를 배치해보세요.";

      if (this.checkMergeEndState()) return;
      this.renderMergeBoard();
    },

    renderMergeCell(row, col) {
      const v = this.mergeBoard[row][col];
      if (!v) return `<button class="merge-cell" onclick="Game.handleMergeCell(${row}, ${col})"></button>`;
      const spawnFx = this.hasFxCell("mergeSpawnFx", row, col) ? " fx-drop" : "";
      const burstFx = this.hasFxCell("mergeBurstFx", row, col) ? " fx-merge" : "";
      return `<button class="merge-cell filled${spawnFx}${burstFx}" style="${this.getMergeColorStyle(v)}">${v}</button>`;
    },

    renderMergeBoard() {
      const shake = this.getShakeClass();
      const rows = this.mergeBoard.map((row, r) => `<div class="merge-row">${row.map((_, c) => this.renderMergeCell(r, c)).join("")}</div>`).join("");
      document.getElementById("screen-game").innerHTML = `
        <div class="shape3d-container merge-numbers-container ${shake}">
          ${extraHeader("🔢 숫자 머지 러시", this.score)}
          <div class="shape3d-meta-row"><span>목표 ${this.mergeTargetValue}</span><span>최고 ${this.mergeBestValue}</span></div>
          <div class="shape-move-feedback">${this.mergeHint || ""}</div>
          <div class="merge-grid">${rows}</div>
          <div class="suika-side-panel">
            <div class="suika-fruit-chip">다음 숫자 <strong>${this.mergeNextValue}</strong></div>
            <div class="suika-fruit-chip">리롤 ${this.mergeRerolls}</div>
          </div>
          <div class="blocky-actions">
            <button class="btn-secondary" onclick="Game.rerollMergeNext()">다음 숫자 리롤</button>
            <button class="btn-secondary" onclick="Game.startMergeNumbers()">새 게임</button>
          </div>
          ${this.renderFxLayer()}
        </div>
      `;
      showGameScreen();
      this.clearFxCells("mergeSpawnFx");
      this.clearFxCells("mergeBurstFx");
    },

    startMergeNumbers() {
      this.clearTimers?.();
      this.currentCategory = "math";
      this.currentGame = "merge-numbers";
      this.score = 0;
      this.mergeRows = 6;
      this.mergeCols = 6;
      this.mergeBoard = Array.from({ length: this.mergeRows }, () => Array(this.mergeCols).fill(0));
      this.mergeTargetValue = 128;
      this.mergeBestValue = 2;
      this.mergeRerolls = 3;
      this.mergeMoves = 0;
      this.mergeNextValue = this.pickMergeSpawnValue();
      this.mergeHint = "빈 칸을 눌러 숫자를 놓고 같은 수를 합치세요.";
      this.fxFloats = [];
      this.fxShakeAt = 0;
      this.renderMergeBoard();
    },

    bubbleRandomValue() {
      const palette = BUBBLE_PALETTES[this.bubbleMode] || BUBBLE_PALETTES.storm;
      return Math.floor(Math.random() * palette.length) + 1;
    },

    bubbleColorByValue(value) {
      const palette = BUBBLE_PALETTES[this.bubbleMode] || BUBBLE_PALETTES.storm;
      return palette[Math.max(0, Math.min(palette.length - 1, Number(value || 1) - 1))];
    },

    findBubbleGroup(row, col) {
      const target = this.bubbleBoard[row]?.[col];
      if (!target) return [];
      const visited = new Set([`${row},${col}`]);
      const q = [[row, col]];
      const cells = [];
      while (q.length) {
        const [cr, cc] = q.shift();
        cells.push([cr, cc]);
        DIR4.forEach(([dr, dc]) => {
          const nr = cr + dr;
          const nc = cc + dc;
          const key = `${nr},${nc}`;
          if (nr < 0 || nc < 0 || nr >= this.bubbleRows || nc >= this.bubbleCols) return;
          if (visited.has(key)) return;
          if (this.bubbleBoard[nr][nc] !== target) return;
          visited.add(key);
          q.push([nr, nc]);
        });
      }
      return cells;
    },

    bubbleCollapse() {
      for (let c = 0; c < this.bubbleCols; c += 1) {
        const stack = [];
        for (let r = this.bubbleRows - 1; r >= 0; r -= 1) {
          const v = this.bubbleBoard[r][c];
          if (v) stack.push(v);
        }
        let idx = 0;
        for (let r = this.bubbleRows - 1; r >= 0; r -= 1) {
          this.bubbleBoard[r][c] = stack[idx++] || 0;
        }
      }
    },

    bubbleHasRemovableGroup(minSize) {
      const visited = Array.from({ length: this.bubbleRows }, () => Array(this.bubbleCols).fill(false));
      for (let r = 0; r < this.bubbleRows; r += 1) {
        for (let c = 0; c < this.bubbleCols; c += 1) {
          const base = this.bubbleBoard[r][c];
          if (!base || visited[r][c]) continue;
          const q = [[r, c]];
          visited[r][c] = true;
          let size = 0;
          while (q.length) {
            const [cr, cc] = q.shift();
            size += 1;
            DIR4.forEach(([dr, dc]) => {
              const nr = cr + dr;
              const nc = cc + dc;
              if (nr < 0 || nc < 0 || nr >= this.bubbleRows || nc >= this.bubbleCols) return;
              if (visited[nr][nc]) return;
              if (this.bubbleBoard[nr][nc] !== base) return;
              visited[nr][nc] = true;
              q.push([nr, nc]);
            });
          }
          if (size >= minSize) return true;
        }
      }
      return false;
    },

    shuffleBubbleBoard() {
      const vals = [];
      for (let r = 0; r < this.bubbleRows; r += 1) {
        for (let c = 0; c < this.bubbleCols; c += 1) {
          if (this.bubbleBoard[r][c]) vals.push(this.bubbleBoard[r][c]);
        }
      }
      vals.sort(() => Math.random() - 0.5);
      let idx = 0;
      for (let r = 0; r < this.bubbleRows; r += 1) {
        for (let c = 0; c < this.bubbleCols; c += 1) {
          this.bubbleBoard[r][c] = idx < vals.length ? vals[idx++] : 0;
        }
      }
    },

    addBubblePressureRow() {
      const overflow = this.bubbleBoard[this.bubbleRows - 1].some((v) => v > 0);
      const newRow = Array.from({ length: this.bubbleCols }, () => this.bubbleRandomValue());
      for (let r = this.bubbleRows - 1; r > 0; r -= 1) {
        this.bubbleBoard[r] = [...this.bubbleBoard[r - 1]];
      }
      this.bubbleBoard[0] = newRow;
      return overflow;
    },

    checkBubbleEndState() {
      const minSize = this.bubbleMode === "charms" ? 2 : 3;
      const filled = this.bubbleBoard.flat().filter(Boolean).length;
      if (this.score >= this.bubbleTargetScore) {
        this.showArcadeResult(this.bubbleMode === "charms" ? "💎 버블 참스" : "🫧 버블 스톰", true, "버블 콤보 성공!", `남은 턴 ${this.bubbleTurnsLeft} · 제거 ${this.bubblePopped}개`, `Game.startBubblePop('${this.bubbleMode}')`);
        return true;
      }
      if (filled === 0) {
        this.showArcadeResult(this.bubbleMode === "charms" ? "💎 버블 참스" : "🫧 버블 스톰", true, "보드를 전부 비웠어요!", `완전 클리어 · 점수 ${this.score}`, `Game.startBubblePop('${this.bubbleMode}')`);
        return true;
      }
      if (this.bubbleTurnsLeft <= 0) {
        this.showArcadeResult(this.bubbleMode === "charms" ? "💎 버블 참스" : "🫧 버블 스톰", false, "턴이 모두 소진됐어요!", `목표 ${this.bubbleTargetScore}점 / 현재 ${this.score}점`, `Game.startBubblePop('${this.bubbleMode}')`);
        return true;
      }
      if (!this.bubbleHasRemovableGroup(minSize) && this.bubbleShuffleCharges <= 0) {
        this.showArcadeResult(this.bubbleMode === "charms" ? "💎 버블 참스" : "🫧 버블 스톰", false, "더 이상 터뜨릴 묶음이 없어요!", "셔플 기회 소진", `Game.startBubblePop('${this.bubbleMode}')`);
        return true;
      }
      return false;
    },

    shuffleBubbleManually() {
      if (this.bubbleBusy) return;
      if (this.bubbleShuffleCharges <= 0) {
        this.bubbleHint = "셔플 기회를 모두 사용했어요.";
        this.renderBubbleBoard();
        return;
      }
      this.bubbleShuffleCharges -= 1;
      this.shuffleBubbleBoard();
      this.bubbleHint = "버블을 다시 섞었어요.";
      this.renderBubbleBoard();
    },

    handleBubbleCell(row, col) {
      if (this.bubbleBusy) return;
      const value = this.bubbleBoard[row]?.[col];
      if (!value) return;
      const minSize = this.bubbleMode === "charms" ? 2 : 3;
      const group = this.findBubbleGroup(row, col);
      this.bubbleTurnsLeft -= 1;

      if (group.length >= minSize) {
        this.bubbleBusy = true;
        this.playJuice("tap");
        this.setFxCells("bubblePopFx", group);
        this.triggerShake("soft");
        this.triggerFlash("cool");
        if (group.length >= 5) this.showComboBadge(`${group.length} POP`);
        this.renderBubbleBoard();
        safeSchedule(this, () => {
          group.forEach(([r, c]) => {
            this.bubbleBoard[r][c] = 0;
          });
          this.bubbleCombo = (this.bubbleCombo || 0) + 1;
          const gained = group.length * (2 + Math.min(4, this.bubbleCombo));
          this.score += gained;
          this.bubblePopped += group.length;
          this.bubbleHint = `${group.length}개 팝! +${gained}`;
          this.playJuice(group.length >= 5 ? "line" : "merge");
          this.addFxFloat(`+${gained}`, "bonus");
          this.bubbleCollapse();

          if (this.bubbleMode === "storm" && this.bubbleTurnsLeft > 0 && this.bubbleTurnsLeft % 3 === 0) {
            const overflow = this.addBubblePressureRow();
            this.bubbleWaveFx = true;
            if (overflow) {
              this.bubbleBusy = false;
              if (this.checkBubbleEndState()) return;
              this.showArcadeResult("🫧 버블 스톰", false, "파도가 밀려와 보드가 넘쳤어요!", `점수 ${this.score} · 제거 ${this.bubblePopped}개`, "Game.startBubblePop('storm')");
              return;
            }
          }

          this.bubbleBusy = false;
          if (this.checkBubbleEndState()) return;
          this.renderBubbleBoard();
        }, 170);
        return;
      } else {
        this.bubbleCombo = 0;
        this.bubbleHint = `최소 ${minSize}개 이상 연결해야 터져요.`;
      }

      if (this.bubbleMode === "storm" && this.bubbleTurnsLeft > 0 && this.bubbleTurnsLeft % 3 === 0) {
        const overflow = this.addBubblePressureRow();
        this.bubbleWaveFx = true;
        if (overflow) {
          if (this.checkBubbleEndState()) return;
          this.showArcadeResult("🫧 버블 스톰", false, "파도가 밀려와 보드가 넘쳤어요!", `점수 ${this.score} · 제거 ${this.bubblePopped}개`, "Game.startBubblePop('storm')");
          return;
        }
      }

      if (this.checkBubbleEndState()) return;
      this.renderBubbleBoard();
    },

    renderBubbleBoard() {
      const title = this.bubbleMode === "charms" ? "💎 버블 참스" : "🫧 버블 스톰";
      const shake = this.getShakeClass();
      const waveFx = this.bubbleWaveFx ? " fx-wave" : "";
      const disabled = this.bubbleBusy ? "disabled" : "";
      const rows = this.bubbleBoard
        .map((row, r) => `<div class="bubble-row ${r % 2 ? "odd" : ""}">${row
          .map((v, c) => {
            const popFx = this.hasFxCell("bubblePopFx", r, c) ? " fx-pop" : "";
            return `<button class="bubble-cell ${v ? "filled" : ""}${popFx}" ${disabled} style="${v ? `--bubble-color:${this.bubbleColorByValue(v)}` : ""}" onclick="Game.handleBubbleCell(${r}, ${c})"></button>`;
          })
          .join("")}</div>`)
        .join("");

      document.getElementById("screen-game").innerHTML = `
        <div class="shape3d-container bubble-pop-container ${shake}${waveFx}">
          ${extraHeader(title, this.score)}
          <div class="shape3d-meta-row"><span>목표 ${this.bubbleTargetScore}점</span><span>남은 턴 ${this.bubbleTurnsLeft}</span></div>
          <div class="shape-move-feedback">${this.bubbleHint || ""}</div>
          <div class="bubble-board">${rows}</div>
          <div class="suika-side-panel">
            <div class="suika-fruit-chip">셔플 ${this.bubbleShuffleCharges}</div>
            <div class="suika-fruit-chip">제거 ${this.bubblePopped}개</div>
          </div>
          <div class="blocky-actions">
            <button class="btn-secondary" onclick="Game.shuffleBubbleManually()">셔플</button>
            <button class="btn-secondary" onclick="Game.startBubblePop('${this.bubbleMode}')">새 게임</button>
          </div>
          ${this.renderFxLayer()}
        </div>
      `;
      showGameScreen();
      this.clearFxCells("bubblePopFx");
      this.bubbleWaveFx = false;
    },

    startBubblePop(mode = "storm") {
      const m = mode === "charms" ? "charms" : "storm";
      this.clearTimers?.();
      this.currentCategory = "math";
      this.currentGame = m === "charms" ? "bubble-charms" : "bubble-storm";
      this.score = 0;
      this.bubbleMode = m;
      this.bubbleRows = 8;
      this.bubbleCols = 8;
      this.bubbleTurnsLeft = m === "charms" ? 20 : 18;
      this.bubbleTargetScore = m === "charms" ? 150 : 170;
      this.bubbleShuffleCharges = 2;
      this.bubblePopped = 0;
      this.bubbleCombo = 0;
      this.bubbleBusy = false;
      this.bubbleWaveFx = false;
      this.bubbleBoard = Array.from({ length: this.bubbleRows }, () => Array.from({ length: this.bubbleCols }, () => this.bubbleRandomValue()));
      this.bubbleHint = "같은 색 버블 묶음을 눌러 터뜨리세요.";
      this.fxFloats = [];
      this.fxShakeAt = 0;

      const minSize = m === "charms" ? 2 : 3;
      let safety = 0;
      while (!this.bubbleHasRemovableGroup(minSize) && safety < 6) {
        this.shuffleBubbleBoard();
        safety += 1;
      }
      this.renderBubbleBoard();
    },

    saveDogKey(row, col) {
      return `${row},${col}`;
    },

    isSaveDogWall(row, col) {
      return this.saveDogWalls.has(this.saveDogKey(row, col));
    },

    isSaveDogBee(row, col) {
      return (this.saveDogBees || []).some((b) => b.r === row && b.c === col);
    },

    spawnSaveDogBees(count) {
      for (let i = 0; i < count; i += 1) {
        let tries = 0;
        while (tries < 20) {
          const col = Math.floor(Math.random() * this.saveDogCols);
          const row = 0;
          if (!this.isSaveDogWall(row, col) && !this.isSaveDogBee(row, col)) {
            this.saveDogBees.push({ r: row, c: col });
            break;
          }
          tries += 1;
        }
      }
    },

    nextSaveDogBeePos(bee) {
      const target = this.saveDogDog;
      const choices = DIR4
        .map(([dr, dc]) => ({ r: bee.r + dr, c: bee.c + dc }))
        .filter((p) => p.r >= 0 && p.c >= 0 && p.r < this.saveDogRows && p.c < this.saveDogCols)
        .filter((p) => !this.isSaveDogWall(p.r, p.c));

      if (!choices.length) return bee;
      const ranked = choices
        .map((p) => ({ ...p, d: Math.abs(p.r - target.r) + Math.abs(p.c - target.c), w: Math.random() }))
        .sort((a, b) => (a.d - b.d) || (a.w - b.w));
      return { r: ranked[0].r, c: ranked[0].c };
    },

    checkSaveDogEnd() {
      const reached = this.saveDogBees.some((b) => b.r === this.saveDogDog.r && b.c === this.saveDogDog.c);
      if (reached) {
        this.showArcadeResult("🐶 세이브 도고고", false, "강아지가 위험에 빠졌어요!", `웨이브 ${this.saveDogWave}에서 실패`, "Game.startSaveDogogo()");
        return true;
      }
      if (this.saveDogWave >= this.saveDogMaxWave) {
        this.showArcadeResult("🐶 세이브 도고고", true, "완벽 방어 성공!", `${this.saveDogMaxWave} 웨이브 생존`, "Game.startSaveDogogo()");
        return true;
      }
      return false;
    },

    advanceSaveDogWave() {
      const prev = this.saveDogBees.map((b) => [b.r, b.c]);
      this.saveDogBees = this.saveDogBees.map((bee) => this.nextSaveDogBeePos(bee));
      const unique = {};
      this.saveDogBees.forEach((b) => { unique[this.saveDogKey(b.r, b.c)] = b; });
      this.saveDogBees = Object.values(unique);
      const moved = this.saveDogBees
        .map((b) => [b.r, b.c])
        .filter(([r, c]) => !prev.some((p) => p[0] === r && p[1] === c));
      this.setFxCells("saveDogBeeFx", moved);
      this.playJuice("tap");
      this.triggerShake("soft");

      if (this.checkSaveDogEnd()) return;

      const spawn = Math.min(4, 1 + Math.floor(this.saveDogWave / 3));
      this.spawnSaveDogBees(spawn);
      if (this.checkSaveDogEnd()) return;

      this.score += 1;
      this.addFxFloat("+1 생존", "score");
      this.saveDogWave += 1;
      this.saveDogWallBudget = Math.min(5, 2 + Math.floor(this.saveDogWave / 3));
      this.saveDogHint = "벽을 추가 배치하고 다음 이동을 누르세요.";
      this.renderSaveDogBoard();
    },

    handleSaveDogCell(row, col) {
      if (row === this.saveDogDog.r && col === this.saveDogDog.c) return;
      if (this.isSaveDogBee(row, col)) {
        this.saveDogHint = "벌이 있는 칸에는 벽을 둘 수 없어요.";
        this.renderSaveDogBoard();
        return;
      }
      const key = this.saveDogKey(row, col);
      if (this.saveDogWalls.has(key)) {
        this.saveDogWalls.delete(key);
        this.saveDogWallBudget += 1;
        this.saveDogHint = "벽을 회수했어요.";
        this.renderSaveDogBoard();
        return;
      }
      if (this.saveDogWallBudget <= 0) {
        this.saveDogHint = "이번 웨이브 벽 배치 횟수를 모두 사용했어요.";
        this.renderSaveDogBoard();
        return;
      }
      this.saveDogWalls.add(key);
      this.saveDogWallBudget -= 1;
      this.setFxCells("saveDogWallFx", [[row, col]]);
      this.playJuice("tap");
      this.triggerFlash("warm");
      this.addFxFloat("벽 설치", "bonus");
      this.saveDogHint = "방어벽 배치 완료.";
      this.renderSaveDogBoard();
    },

    renderSaveDogCell(row, col) {
      const isDog = row === this.saveDogDog.r && col === this.saveDogDog.c;
      if (isDog) return `<button class="save-dog-cell dog">🐶</button>`;
      if (this.isSaveDogBee(row, col)) {
        const fx = this.hasFxCell("saveDogBeeFx", row, col) ? " fx-drop" : "";
        return `<button class="save-dog-cell bee${fx}">🐝</button>`;
      }
      if (this.isSaveDogWall(row, col)) {
        const fx = this.hasFxCell("saveDogWallFx", row, col) ? " fx-drop" : "";
        return `<button class="save-dog-cell wall${fx}" onclick="Game.handleSaveDogCell(${row}, ${col})">🧱</button>`;
      }
      return `<button class="save-dog-cell" onclick="Game.handleSaveDogCell(${row}, ${col})"></button>`;
    },

    renderSaveDogBoard() {
      const shake = this.getShakeClass();
      const board = Array.from({ length: this.saveDogRows }, (_, r) => `<div class="save-dog-row">${Array.from({ length: this.saveDogCols }, (_, c) => this.renderSaveDogCell(r, c)).join("")}</div>`).join("");
      document.getElementById("screen-game").innerHTML = `
        <div class="shape3d-container save-dogogo-container ${shake}">
          ${extraHeader("🐶 세이브 도고고", this.score)}
          <div class="shape3d-meta-row"><span>웨이브 ${this.saveDogWave}/${this.saveDogMaxWave}</span><span>남은 벽 ${this.saveDogWallBudget}</span></div>
          <div class="shape-move-feedback">${this.saveDogHint || ""}</div>
          <div class="save-dog-board">${board}</div>
          <div class="suika-side-panel">
            <div class="suika-fruit-chip">벌 ${this.saveDogBees.length}마리</div>
            <div class="suika-fruit-chip">강아지 방어중</div>
          </div>
          <div class="blocky-actions">
            <button class="btn-primary" onclick="Game.advanceSaveDogWave()">벌 이동 ▶</button>
            <button class="btn-secondary" onclick="Game.startSaveDogogo()">새 게임</button>
          </div>
          ${this.renderFxLayer()}
        </div>
      `;
      showGameScreen();
      this.clearFxCells("saveDogBeeFx");
      this.clearFxCells("saveDogWallFx");
    },

    startSaveDogogo() {
      this.clearTimers?.();
      this.currentCategory = "math";
      this.currentGame = "save-dogogo";
      this.score = 0;
      this.saveDogRows = 8;
      this.saveDogCols = 11;
      this.saveDogDog = { r: 6, c: 5 };
      this.saveDogWalls = new Set();
      this.saveDogBees = [];
      this.saveDogWave = 1;
      this.saveDogMaxWave = 10;
      this.saveDogWallBudget = 3;
      this.saveDogHint = "벽을 배치한 뒤 벌 이동을 눌러 강아지를 지키세요.";
      this.fxFloats = [];
      this.fxShakeAt = 0;
      this.spawnSaveDogBees(2);
      this.renderSaveDogBoard();
    },

    getSuikaFruitInfo(level) {
      const idx = Math.max(0, Math.min(SUIKA_CHAIN.length - 1, Number(level || 1) - 1));
      const colors = ["#ff6b6b", "#ff4f7a", "#ff9f43", "#ffd93d", "#ff5e57", "#7ed957", "#ff8fa3", "#f7b731", "#66bb6a"];
      return {
        level: idx + 1,
        emoji: SUIKA_CHAIN[idx],
        color: colors[idx] || "#8bc34a",
      };
    },

    pickSuikaLevel() {
      const roll = Math.random();
      if (roll < 0.5) return 1;
      if (roll < 0.8) return 2;
      if (roll < 0.95) return 3;
      return 4;
    },

    applySuikaGravity() {
      for (let col = 0; col < this.suikaCols; col += 1) {
        const stack = [];
        for (let row = this.suikaRows - 1; row >= 0; row -= 1) {
          const v = this.suikaBoard[row][col];
          if (v > 0) stack.push(v);
        }
        let idx = 0;
        for (let row = this.suikaRows - 1; row >= 0; row -= 1) {
          this.suikaBoard[row][col] = stack[idx++] || 0;
        }
      }
    },

    findSuikaMergeGroups() {
      const visited = Array.from({ length: this.suikaRows }, () => Array(this.suikaCols).fill(false));
      const groups = [];
      const dirs = [
        [1, 0], [-1, 0], [0, 1], [0, -1],
      ];

      for (let r = 0; r < this.suikaRows; r += 1) {
        for (let c = 0; c < this.suikaCols; c += 1) {
          const level = this.suikaBoard[r][c];
          if (!level || visited[r][c]) continue;

          const q = [[r, c]];
          visited[r][c] = true;
          const cells = [];
          while (q.length) {
            const [cr, cc] = q.shift();
            cells.push([cr, cc]);
            dirs.forEach(([dr, dc]) => {
              const nr = cr + dr;
              const nc = cc + dc;
              if (nr < 0 || nc < 0 || nr >= this.suikaRows || nc >= this.suikaCols) return;
              if (visited[nr][nc]) return;
              if (this.suikaBoard[nr][nc] !== level) return;
              visited[nr][nc] = true;
              q.push([nr, nc]);
            });
          }
          if (cells.length >= 2) groups.push({ level, cells });
        }
      }
      return groups;
    },

    resolveSuikaMerges() {
      let chain = 0;
      let gained = 0;
      const anchors = [];
      while (true) {
        const groups = this.findSuikaMergeGroups();
        if (!groups.length) break;
        chain += 1;
        groups.forEach((group) => {
          const sorted = [...group.cells].sort((a, b) => {
            if (b[0] !== a[0]) return b[0] - a[0];
            return a[1] - b[1];
          });
          const anchor = sorted[0];
          sorted.slice(1).forEach(([r, c]) => {
            this.suikaBoard[r][c] = 0;
          });
          const nextLevel = Math.min(SUIKA_CHAIN.length, group.level + 1);
          this.suikaBoard[anchor[0]][anchor[1]] = nextLevel;
          anchors.push(anchor);
          this.suikaBestLevel = Math.max(this.suikaBestLevel, nextLevel);
          gained += nextLevel * 3 + group.cells.length;
        });
        this.applySuikaGravity();
      }
      return { chain, gained, anchors };
    },

    setSuikaTool(tool) {
      this.suikaTool = tool === "smash" ? "smash" : "drop";
      this.showSuikaMergeBoard();
    },

    holdSuikaFruit() {
      if (!this.suikaCanHold) {
        this.suikaHint = "이번 턴에는 이미 보관을 사용했어요.";
        this.showSuikaMergeBoard();
        return;
      }
      if (!this.suikaHoldLevel) {
        this.suikaHoldLevel = this.suikaNextLevel;
        this.suikaNextLevel = this.pickSuikaLevel();
      } else {
        const tmp = this.suikaHoldLevel;
        this.suikaHoldLevel = this.suikaNextLevel;
        this.suikaNextLevel = tmp;
      }
      this.suikaCanHold = false;
      this.suikaHint = "보관 과일을 교체했어요.";
      this.showSuikaMergeBoard();
    },

    useSuikaSmashAt(row, col) {
      if (this.suikaSmashCharges <= 0) {
        this.suikaHint = "스매시 충전이 없어요.";
        this.showSuikaMergeBoard();
        return;
      }
      if (!this.suikaBoard[row]?.[col]) {
        this.suikaHint = "과일이 있는 칸을 눌러서 제거하세요.";
        this.showSuikaMergeBoard();
        return;
      }
      this.setFxCells("suikaSmashFx", [[row, col]]);
      this.suikaBoard[row][col] = 0;
      this.suikaSmashCharges -= 1;
      this.playJuice("smash");
      this.triggerShake("hard");
      this.triggerFlash("warm");
      this.showComboBadge("SMASH!");
      this.addFxFloat("스매시!", "bonus");
      this.applySuikaGravity();
      const merged = this.resolveSuikaMerges();
      this.score += merged.gained;
      this.suikaHint = "스매시 사용! 막힌 과일을 제거했어요.";
      this.suikaTool = "drop";
      if (this.checkSuikaEndState()) return;
      this.showSuikaMergeBoard();
    },

    handleSuikaCell(row, col) {
      if (this.suikaTool === "smash") this.useSuikaSmashAt(row, col);
    },

    checkSuikaEndState() {
      if (this.suikaBestLevel >= this.suikaTargetLevel) {
        this.finishSuikaMerge(true);
        return true;
      }

      const topFilled = this.suikaBoard[0].every((v) => v > 0);
      if (topFilled) {
        this.finishSuikaMerge(false);
        return true;
      }
      return false;
    },

    dropSuikaInColumn(col) {
      let row = -1;
      for (let r = this.suikaRows - 1; r >= 0; r -= 1) {
        if (!this.suikaBoard[r][col]) {
          row = r;
          break;
        }
      }
      if (row < 0) {
        this.suikaHint = "이 열은 가득 찼어요. 다른 열을 선택하세요.";
        this.showSuikaMergeBoard();
        return;
      }

      const dropLevel = this.suikaNextLevel;
      this.suikaBoard[row][col] = dropLevel;
      this.playJuice("tap");
      this.setFxCells("suikaDropFx", [[row, col]]);
      this.suikaMoves += 1;
      this.suikaCanHold = true;
      this.suikaNextLevel = this.pickSuikaLevel();
      this.suikaBestLevel = Math.max(this.suikaBestLevel, dropLevel);
      this.addFxFloat(`+${dropLevel}`, "score");

      const merged = this.resolveSuikaMerges();
      this.score += dropLevel + merged.gained;
      if (merged.gained > 0) {
        this.setFxCells("suikaMergeFx", merged.anchors || []);
        this.playJuice("merge");
        this.triggerShake("soft");
        this.triggerFlash("cool");
        this.showComboBadge(`x${Math.max(2, merged.chain)} CHAIN`);
        this.addFxFloat(`연쇄 +${merged.gained}`, "bonus");
      }

      if (merged.chain > 0) {
        this.suikaHint = `연쇄 ${merged.chain}콤보!`;
      } else {
        this.suikaHint = "좋아요! 다음 드롭을 준비하세요.";
      }

      if (this.checkSuikaEndState()) return;

      this.showSuikaMergeBoard();
    },

    finishSuikaMerge(success) {
      if (window.App && typeof App.completeActiveRecommendation === "function") {
        App.completeActiveRecommendation();
      }
      const best = this.getSuikaFruitInfo(this.suikaBestLevel);
      const msg = success ? "대성공! 목표 수박 단계 도달!" : "보드가 가득 찼어요. 다시 도전!";
      const screen = document.getElementById("screen-game");
      screen.innerHTML = `
        <div class="result-container">
          <div class="result-stars">${success ? "⭐⭐⭐" : "⭐"}</div>
          <h2 class="result-message">${msg}</h2>
          <div class="result-score">점수 ${this.score}</div>
          <div class="brain-test-subhint">최고 과일 ${best.emoji} Lv.${this.suikaBestLevel} · 드롭 ${this.suikaMoves}회</div>
          <div class="result-buttons">
            <button class="btn-primary" onclick="Game.startSuikaMerge()">다시 하기 🔄</button>
            <button class="btn-secondary" onclick="App.tabPlay()">다른 게임 🎮</button>
            <button class="btn-secondary" onclick="App.navigate('home')">홈으로 🏠</button>
          </div>
        </div>
      `;
      showGameScreen();
    },

    renderSuikaCell(row, col) {
      const v = this.suikaBoard[row][col];
      if (!v) return `<button class="suika-cell" onclick="Game.handleSuikaCell(${row}, ${col})"></button>`;
      const f = this.getSuikaFruitInfo(v);
      const dropFx = this.hasFxCell("suikaDropFx", row, col) ? " fx-drop" : "";
      const mergeFx = this.hasFxCell("suikaMergeFx", row, col) ? " fx-merge" : "";
      const smashFx = this.hasFxCell("suikaSmashFx", row, col) ? " fx-pop" : "";
      return `<button class="suika-cell filled${dropFx}${mergeFx}${smashFx}" style="--fruit-color:${f.color}" onclick="Game.handleSuikaCell(${row}, ${col})">${f.emoji}</button>`;
    },

    showSuikaMergeBoard() {
      const shake = this.getShakeClass();
      const next = this.getSuikaFruitInfo(this.suikaNextLevel);
      const hold = this.suikaHoldLevel ? this.getSuikaFruitInfo(this.suikaHoldLevel) : null;
      const target = this.getSuikaFruitInfo(this.suikaTargetLevel);
      const screen = document.getElementById("screen-game");
      screen.innerHTML = `
        <div class="shape3d-container suika-container ${shake}">
          ${extraHeader("🍉 수박 머지 드롭", this.score)}
          <div class="shape3d-meta-row">
            <span>목표 ${target.emoji} Lv.${this.suikaTargetLevel}</span>
            <span>최고 Lv.${this.suikaBestLevel}</span>
            <span>스매시 ${this.suikaSmashCharges}</span>
          </div>
          <div class="shape-move-feedback">${this.suikaHint || ""}</div>
          <div class="suika-top-controls">${Array.from({ length: this.suikaCols }, (_, c) => `<button class="suika-drop-btn" onclick="Game.dropSuikaInColumn(${c})">${c + 1}열</button>`).join("")}</div>
          <div class="suika-board">${this.suikaBoard.map((row, r) => `<div class="suika-row">${row.map((_, c) => this.renderSuikaCell(r, c)).join("")}</div>`).join("")}</div>
          <div class="suika-side-panel">
            <div class="suika-fruit-chip">다음 ${next.emoji} Lv.${this.suikaNextLevel}</div>
            <div class="suika-fruit-chip">보관 ${hold ? `${hold.emoji} Lv.${this.suikaHoldLevel}` : "비어있음"}</div>
          </div>
          <div class="blocky-actions">
            <button class="btn-secondary ${this.suikaTool === "drop" ? "active" : ""}" onclick="Game.setSuikaTool('drop')">드롭</button>
            <button class="btn-secondary ${this.suikaTool === "smash" ? "active" : ""}" onclick="Game.setSuikaTool('smash')">스매시</button>
            <button class="btn-secondary" onclick="Game.holdSuikaFruit()">보관</button>
            <button class="btn-secondary" onclick="Game.startSuikaMerge()">새 게임</button>
          </div>
          ${this.renderFxLayer()}
        </div>
      `;
      showGameScreen();
      this.clearFxCells("suikaDropFx");
      this.clearFxCells("suikaMergeFx");
      this.clearFxCells("suikaSmashFx");
    },

    startSuikaMerge() {
      this.clearTimers?.();
      this.currentCategory = "math";
      this.currentGame = "suika-merge";
      this.score = 0;
      this.suikaRows = 8;
      this.suikaCols = 6;
      this.suikaBoard = Array.from({ length: this.suikaRows }, () => Array(this.suikaCols).fill(0));
      this.suikaNextLevel = this.pickSuikaLevel();
      this.suikaHoldLevel = 0;
      this.suikaCanHold = true;
      this.suikaBestLevel = 1;
      this.suikaTargetLevel = 9;
      this.suikaSmashCharges = 2;
      this.suikaTool = "drop";
      this.suikaMoves = 0;
      this.suikaHint = "열 버튼으로 과일을 떨어뜨리고 같은 과일을 합치세요.";
      this.fxFloats = [];
      this.fxShakeAt = 0;
      this.showSuikaMergeBoard();
    },

    getBrainTestTrickyLevels() {
      return BRAIN_LEVELS.tricky.slice();
    },

    getBrainTestStoryLevels() {
      return BRAIN_LEVELS.stories.slice();
    },

    getBrainTestQuestLevels() {
      return BRAIN_LEVELS.quests.slice();
    },

    startBrainTestTricky() {
      this.startBrainTestByMode("tricky", "brain-test-tricky");
    },

    startBrainTestStories() {
      this.startBrainTestByMode("stories", "brain-test-stories");
    },

    startBrainTestQuests() {
      this.startBrainTestByMode("quests", "brain-test-quests");
    },

    startBrainTestByMode(mode, gameKey) {
      this.clearTimers?.();
      this.currentCategory = "math";
      this.currentGame = gameKey;
      this.score = 0;
      this.brainTestMode = mode;
      this.brainTestLevels =
        mode === "tricky"
          ? this.getBrainTestTrickyLevels()
          : mode === "stories"
            ? this.getBrainTestStoryLevels()
            : this.getBrainTestQuestLevels();
      this.total = this.brainTestLevels.length;
      this.brainTestIndex = 0;
      this.brainTestHint = "단서를 읽고 조작하세요.";
      this.brainTapCount = 0;
      this.brainSequenceStep = 0;
      this.brainSliderValue = 0;
      this.brainDragItem = "";
      this.brainDragSolved = {};
      this.brainToggleState = [];
      this.brainHoldDone = false;
      this.stopBrainHold();
      this.renderBrainTestLevel();
    },

    nextBrainTestLevel() {
      this.brainTestIndex += 1;
      if (this.brainTestIndex >= (this.brainTestLevels?.length || 0)) {
        safeResult(this, this.currentGame);
        return;
      }
      this.brainTapCount = 0;
      this.brainSequenceStep = 0;
      this.brainSliderValue = 0;
      this.brainDragItem = "";
      this.brainDragSolved = {};
      this.brainToggleState = [];
      this.brainHoldDone = false;
      this.stopBrainHold();
      this.renderBrainTestLevel();
    },

    passBrainLevel(message) {
      const profile = typeof Profile !== "undefined" ? Profile.getCurrent() : null;
      this.score += 1;
      rewardCorrect(profile, 1, 3);
      this.brainTestHint = message || "정답!";
      this.playJuice("line");
      this.triggerFlash("cool");
      this.renderBrainTestLevel();
      safeSchedule(this, () => this.nextBrainTestLevel(), 700);
    },

    failBrainLevel(message) {
      this.brainTestHint = message || "다시 시도해보세요.";
      this.playJuice("smash");
      this.renderBrainTestLevel();
    },

    submitBrainTestAnswer(index) {
      const level = this.brainTestLevels?.[this.brainTestIndex];
      if (!level || level.type !== "choice") return;
      if (index === level.correctIndex) {
        this.passBrainLevel(level.explain || "정답!");
        return;
      }
      this.failBrainLevel("아쉽지만 오답입니다. 단서를 다시 확인하세요.");
    },

    completeBrainTitleClick() {
      const level = this.brainTestLevels?.[this.brainTestIndex];
      if (!level || level.type !== "title-click") return;
      this.passBrainLevel("숨은 스위치를 정확히 찾았어요!");
    },

    tapBrainTarget() {
      const level = this.brainTestLevels?.[this.brainTestIndex];
      if (!level || level.type !== "tap-target") return;
      this.brainTapCount = (this.brainTapCount || 0) + 1;
      if (this.brainTapCount >= (level.targetCount || 3)) {
        this.passBrainLevel("연속 탭 성공!");
        return;
      }
      this.brainTestHint = `${this.brainTapCount}/${level.targetCount}회`;
      this.renderBrainTestLevel();
    },

    startBrainHold() {
      const level = this.brainTestLevels?.[this.brainTestIndex];
      if (!level || level.type !== "hold" || this.brainHoldDone) return;
      if (this.brainHoldTimer) return;

      const need = level.holdMs || 1200;
      const holdMode = this.brainTestMode;
      const holdIndex = this.brainTestIndex;
      const holdGame = this.currentGame;
      this.brainHoldRunId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const runId = this.brainHoldRunId;
      this.brainHoldStartedAt = Date.now();
      this.brainHoldTimer = setInterval(() => {
        if (
          this.brainHoldRunId !== runId
          || this.brainTestMode !== holdMode
          || this.brainTestIndex !== holdIndex
          || this.currentGame !== holdGame
        ) {
          this.stopBrainHold();
          return;
        }
        const elapsed = Date.now() - this.brainHoldStartedAt;
        const pct = Math.max(0, Math.min(100, Math.round((elapsed / need) * 100)));
        const fill = document.getElementById("brain-hold-fill");
        if (fill) fill.style.width = `${pct}%`;
        setText("brain-hold-label", `${pct}%`);

        if (elapsed >= need) {
          this.stopBrainHold();
          this.brainHoldDone = true;
          this.passBrainLevel("길게 누르기 성공!");
        }
      }, 50);
    },

    stopBrainHold() {
      if (this.brainHoldTimer) {
        clearInterval(this.brainHoldTimer);
        this.brainHoldTimer = null;
      }
      this.brainHoldRunId = null;
    },

    endBrainHold() {
      const level = this.brainTestLevels?.[this.brainTestIndex];
      if (!level || level.type !== "hold" || this.brainHoldDone) return;
      this.stopBrainHold();
      this.brainTestHint = "조금 더 길게 눌러야 해요.";
      this.renderBrainTestLevel();
    },

    selectBrainItem(itemId) {
      const level = this.brainTestLevels?.[this.brainTestIndex];
      if (!level || level.type !== "drag-match") return;
      this.brainDragItem = itemId;
      const item = (level.items || []).find((it) => it.id === itemId);
      this.brainTestHint = item ? `${item.label} 선택됨. 맞는 슬롯을 눌러주세요.` : "아이템을 선택했어요.";
      this.renderBrainTestLevel();
    },

    startBrainDrag(itemId) {
      this.selectBrainItem(itemId);
    },

    dropBrainItem(zoneId) {
      const level = this.brainTestLevels?.[this.brainTestIndex];
      if (!level || level.type !== "drag-match") return;
      if (!this.brainDragItem) {
        this.brainTestHint = "먼저 위의 아이템을 선택하세요.";
        this.renderBrainTestLevel();
        return;
      }

      const zone = (level.zones || []).find((z) => z.id === zoneId);
      if (!zone) return;

      if (zone.accept !== this.brainDragItem) {
        this.failBrainLevel("잘못된 매칭입니다. 단서를 다시 보세요.");
        return;
      }

      this.brainDragSolved = { ...(this.brainDragSolved || {}), [zoneId]: this.brainDragItem };
      this.brainDragItem = "";

      const allSolved = (level.zones || []).every((z) => this.brainDragSolved[z.id] === z.accept);
      if (allSolved) {
        this.passBrainLevel("드래그 매칭 성공!");
        return;
      }
      this.brainTestHint = "좋아요! 남은 슬롯도 맞춰보세요.";
      this.renderBrainTestLevel();
    },

    pressBrainSequence(value) {
      const level = this.brainTestLevels?.[this.brainTestIndex];
      if (!level || level.type !== "sequence") return;

      const expected = (level.order || [])[this.brainSequenceStep];
      if (value !== expected) {
        this.brainSequenceStep = 0;
        this.failBrainLevel("순서가 틀렸어요. 처음부터 다시!");
        return;
      }

      this.brainSequenceStep += 1;
      if (this.brainSequenceStep >= (level.order || []).length) {
        this.passBrainLevel("순서 퍼즐 성공!");
        return;
      }
      this.brainTestHint = `진행 ${this.brainSequenceStep}/${level.order.length}`;
      this.renderBrainTestLevel();
    },

    updateBrainSlider(value) {
      this.brainSliderValue = Number(value || 0);
      setText("brain-slider-value", String(this.brainSliderValue));
    },

    confirmBrainSlider() {
      const level = this.brainTestLevels?.[this.brainTestIndex];
      if (!level || level.type !== "slider") return;
      const diff = Math.abs((this.brainSliderValue || 0) - level.target);
      const tol = level.tolerance ?? 0;
      if (diff <= tol) {
        this.passBrainLevel("정확한 눈금 맞추기 성공!");
        return;
      }
      this.failBrainLevel(`값이 달라요. 목표 ${level.target}`);
    },

    toggleBrainSwitch(index) {
      const level = this.brainTestLevels?.[this.brainTestIndex];
      if (!level || level.type !== "toggle") return;
      if (!Array.isArray(this.brainToggleState) || this.brainToggleState.length !== level.labels.length) {
        this.brainToggleState = level.labels.map(() => false);
      }
      this.brainToggleState[index] = !this.brainToggleState[index];

      const target = level.target || level.labels.map(() => true);
      const solved = target.every((v, i) => v === this.brainToggleState[i]);
      if (solved) {
        this.passBrainLevel("스위치 조합 성공!");
        return;
      }
      this.brainTestHint = "조합을 계속 맞춰보세요.";
      this.renderBrainTestLevel();
    },

    renderBrainAction(level) {
      if (level.type === "choice") {
        return renderChoiceButtons(level.options || [], "Game.submitBrainTestAnswer");
      }

      if (level.type === "title-click") {
        return `
          <div class="brain-test-options">
            <button class="brain-test-option" onclick="Game.submitBrainTestAnswer(0)">가짜 버튼 A</button>
            <button class="brain-test-option" onclick="Game.submitBrainTestAnswer(1)">가짜 버튼 B</button>
            <button class="brain-test-option" onclick="Game.submitBrainTestAnswer(2)">가짜 버튼 C</button>
          </div>
          <div class="brain-test-subhint">힌트: 제목을 눌러야 통과됩니다.</div>
        `;
      }

      if (level.type === "tap-target") {
        return `
          <div class="brain-test-target-wrap">
            <button class="brain-test-target" onclick="Game.tapBrainTarget()">${level.targetLabel || "탭"}</button>
            <div class="brain-test-subhint">${this.brainTapCount || 0}/${level.targetCount || 3}회</div>
          </div>
        `;
      }

      if (level.type === "hold") {
        return `
          <div class="brain-hold-wrap">
            <button class="brain-hold-btn"
              onpointerdown="Game.startBrainHold()"
              onpointerup="Game.endBrainHold()"
              onpointercancel="Game.endBrainHold()"
              onpointerleave="Game.endBrainHold()">${level.holdLabel || "길게 누르기"}</button>
            <div class="brain-hold-progress"><div id="brain-hold-fill" class="brain-hold-fill"></div></div>
            <div id="brain-hold-label" class="brain-test-subhint">0%</div>
          </div>
        `;
      }

      if (level.type === "drag-match") {
        const items = (level.items || [])
          .map((it) => {
            const selected = this.brainDragItem === it.id ? " selected" : "";
            return `<button class="brain-drag-item${selected}" draggable="true" ondragstart="Game.startBrainDrag('${it.id}')" onclick="Game.selectBrainItem('${it.id}')">${it.label}</button>`;
          })
          .join("");
        const zones = (level.zones || [])
          .map((zone) => {
            const solvedId = (this.brainDragSolved || {})[zone.id];
            const solvedItem = (level.items || []).find((it) => it.id === solvedId);
            const text = solvedItem ? `✅ ${solvedItem.label}` : zone.label;
            return `<button class="brain-drop-zone" ondragover="event.preventDefault()" ondrop="Game.dropBrainItem('${zone.id}')" onclick="Game.dropBrainItem('${zone.id}')">${text}</button>`;
          })
          .join("");
        return `<div class="brain-drag-grid">${items}</div><div class="brain-drop-grid">${zones}</div>`;
      }

      if (level.type === "sequence") {
        const buttons = (level.buttons || [])
          .map((v) => `<button class="brain-test-option" onclick="Game.pressBrainSequence('${v}')">${v}</button>`)
          .join("");
        return `
          <div class="brain-test-options">${buttons}</div>
          <div class="brain-test-subhint">진행 ${this.brainSequenceStep || 0}/${(level.order || []).length}</div>
        `;
      }

      if (level.type === "slider") {
        const value = Number(this.brainSliderValue || level.min || 0);
        return `
          <div class="brain-slider-wrap">
            <input class="brain-slider" type="range" min="${level.min}" max="${level.max}" value="${value}" oninput="Game.updateBrainSlider(this.value)" />
            <div class="brain-test-subhint">현재 값: <strong id="brain-slider-value">${value}</strong></div>
            <button class="brain-test-option" onclick="Game.confirmBrainSlider()">값 확인</button>
          </div>
        `;
      }

      if (level.type === "toggle") {
        if (!Array.isArray(this.brainToggleState) || this.brainToggleState.length !== level.labels.length) {
          this.brainToggleState = level.labels.map(() => false);
        }
        return `
          <div class="brain-toggle-grid">
            ${(level.labels || [])
              .map((label, i) => {
                const on = !!this.brainToggleState[i];
                return `<button class="brain-toggle-btn ${on ? "on" : ""}" onclick="Game.toggleBrainSwitch(${i})">${label}: ${on ? "ON" : "OFF"}</button>`;
              })
              .join("")}
          </div>
        `;
      }

      return "";
    },

    renderBrainTestLevel() {
      const level = this.brainTestLevels?.[this.brainTestIndex];
      if (!level) return;

      const titleMap = {
        tricky: "🧠 브레인 테스트",
        stories: "📖 브레인 테스트 2",
        quests: "🧭 브레인 테스트 3",
      };
      const gameTitle = titleMap[this.brainTestMode] || "🧠 브레인 테스트";
      const actionHtml = this.renderBrainAction(level);

      document.getElementById("screen-game").innerHTML = `
        <div class="shape3d-container brain-test-container">
          <div class="learn-header">
            <button class="btn-back" onclick="Game.stopBrainHold(); App.tabPlay()"><span class="back-arrow">&larr;</span></button>
            <h2 class="learn-title brain-test-title ${level.type === "title-click" ? "clickable" : ""}" ${level.type === "title-click" ? 'onclick="Game.completeBrainTitleClick()"' : ""}>${gameTitle}</h2>
            <span class="game-score">점수 ${this.score}</span>
          </div>
          <div class="shape3d-meta-row"><span>스테이지 ${this.brainTestIndex + 1}/${this.brainTestLevels.length}</span><span>${level.title}</span></div>
          <div class="brain-test-question">${level.prompt}</div>
          ${actionHtml}
          <div class="brain-test-hint">${this.brainTestHint || ""}</div>
        </div>
      `;
      showGameScreen();
    },
  });

  const originalShowSelection = typeof Game.showSelection === "function" ? Game.showSelection.bind(Game) : null;
  if (originalShowSelection) {
    Game.showSelection = function patchedShowSelection(categoryId) {
      originalShowSelection(categoryId);
      if (categoryId === "math") this.ensureExtraMathCards();
    };
  }

  const originalRestart = typeof Game.restart === "function" ? Game.restart.bind(Game) : null;
  Game.restart = function patchedRestart(gameType) {
    switch (gameType) {
      case "brain-test-tricky":
        this.startBrainTestTricky();
        return;
      case "brain-test-stories":
        this.startBrainTestStories();
        return;
      case "brain-test-quests":
        this.startBrainTestQuests();
        return;
      case "blocky-blast":
        this.startBlockyBlast();
        return;
      case "merge-numbers":
        this.startMergeNumbers();
        return;
      case "bubble-storm":
        this.startBubblePop("storm");
        return;
      case "bubble-charms":
        this.startBubblePop("charms");
        return;
      case "save-dogogo":
        this.startSaveDogogo();
        return;
      case "suika-merge":
        this.startSuikaMerge();
        return;
      default:
        if (originalRestart) originalRestart(gameType);
    }
  };
})(typeof window !== "undefined" ? window : undefined);
