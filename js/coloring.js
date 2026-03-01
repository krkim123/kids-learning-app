const EXTRA_COLORING_DESIGNS = [
  {
    id: "blank-studio",
    name: "자유 도안",
    emoji: "S",
    width: 720,
    height: 720,
    regions: [{ id: "base", path: "M0,0 L720,0 L720,720 L0,720 Z", defaultColor: "#FFFFFF" }],
  },
];

const STICKER_SHEET = { src: "assets/stickers/kids-sticker-sheet.png", cols: 8, rows: 12, cell: 96, thumb: 36 };

const STICKER_CATEGORIES = {
  toys: { label: "장난감", indices: [0, 1, 2, 3, 4, 5, 6, 7, 40, 41, 42, 43, 44, 45] },
  animals: { label: "동물", indices: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23] },
  nature: { label: "자연", indices: [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39] },
  places: { label: "장소", indices: [46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95] },
  scenes: { label: "풍경", indices: [56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79] },
};

const FALLBACK_STICKERS = ["*A*", "*B*", "*C*", "*D*", "*E*", "*F*", "*G*", "*H*"];

const BRUSH_TOOLS = [
  { id: "brush", icon: "붓", label: "붓" },
  { id: "marker", icon: "매", label: "매직" },
  { id: "rainbow", icon: "무", label: "무지개" },
  { id: "eraser", icon: "지", label: "지우개" },
];

const SHAPE_TOOLS = [
  { id: "shape-line", icon: "선", label: "선" },
  { id: "shape-rect", icon: "네", label: "네모" },
  { id: "shape-circle", icon: "원", label: "원" },
];

const DEFAULT_PALETTE = [
  "#FF6B6B",
  "#FF8E53",
  "#FFD93D",
  "#6BCB77",
  "#4ECDC4",
  "#4D96FF",
  "#8FA8FF",
  "#9B59B6",
  "#FF69B4",
  "#FF9ED6",
  "#8D6E63",
  "#FFFFFF",
  "#F5F5F5",
  "#BDBDBD",
  "#5C5C5C",
  "#1F2937",
];

const FILL_OPTIONS = [
  { id: "low", label: "약", dark: 98, grad: 98, tol: 18 },
  { id: "medium", label: "보통", dark: 132, grad: 74, tol: 34 },
  { id: "high", label: "강", dark: 164, grad: 54, tol: 56 },
];

const AI_PROMPTS = ["귀여운 공룡", "행복한 유니콘", "큰 로봇", "달콤한 컵케이크", "신나는 바닷가 풍경", "작은 마을"];
const OPENAI_KEY_STORAGE_KEY = "kids_coloring_openai_api_key";
const OPENAI_MODEL = "gpt-image-1";
const MAX_CUSTOM_DESIGNS = 40;
const AGE_DESIGN_KEYWORDS = {
  toddler: new Set(["cat", "dog", "rabbit", "bear", "fish", "butterfly", "flower", "balloon", "icecream", "star"]),
  child: new Set(["turtle", "tree", "house", "car", "bus", "cupcake", "rocket"]),
  older: new Set(["castle", "robot", "unicorn", "dino", "cloudtrain", "planet"]),
};
const AGE_SECTION_META = {
  toddler: { title: "3~4세 추천", subtitle: "큰 모양, 쉬운 선 중심" },
  child: { title: "5~6세 추천", subtitle: "기본 학습 + 관찰 중심" },
  older: { title: "7~8세 도전", subtitle: "복합 도형, 세부 묘사" },
};
const AGE_SECTION_ORDER = {
  toddler: ["toddler", "child", "older"],
  child: ["child", "toddler", "older"],
  older: ["older", "child", "toddler"],
};

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escJsValue(value) {
  return String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\r?\n/g, " ");
}

function uniq(items) {
  return Array.from(new Set(items));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function hexToRgba(hex) {
  if (typeof hex !== "string" || !hex.startsWith("#")) return null;
  const raw = hex.slice(1).trim();
  if (raw.length === 3) {
    const r = parseInt(raw[0] + raw[0], 16);
    const g = parseInt(raw[1] + raw[1], 16);
    const b = parseInt(raw[2] + raw[2], 16);
    if ([r, g, b].some(Number.isNaN)) return null;
    return { r, g, b, a: 255 };
  }
  if (raw.length === 6) {
    const r = parseInt(raw.slice(0, 2), 16);
    const g = parseInt(raw.slice(2, 4), 16);
    const b = parseInt(raw.slice(4, 6), 16);
    if ([r, g, b].some(Number.isNaN)) return null;
    return { r, g, b, a: 255 };
  }
  return null;
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("이미지 변환에 실패했습니다."));
    reader.readAsDataURL(blob);
  });
}

const Coloring = {
  currentDesign: null,
  currentColors: {},
  selectedColor: "#FF6B6B",
  drawMode: "fill",
  brushSize: 14,
  brushOpacity: 1,
  stickerSize: 44,
  shapeFill: false,
  rainbowHue: 0,
  fillSensitivity: "medium",
  mirrorEnabled: false,
  showGrid: false,
  canvasBackground: "#FFFFFF",
  customDesignCounter: 0,
  stickerCategory: "toys",
  selectedStickerId: "",
  aiDesigns: [],
  spriteDesigns: null,
  _stickerLibrary: null,
  aiSettingsLoaded: false,
  openaiApiKey: "",
  aiStatus: "",
  aiBusy: false,
  stickerSheetImage: null,
  stickerSheetReady: false,
  stickerSheetError: false,
  stickerSheetPromise: null,
  canvas: null,
  ctx: null,
  templateCanvas: null,
  templateCtx: null,
  boundaryMap: null,
  boundaryW: 0,
  boundaryH: 0,
  isDrawing: false,
  lastPoint: null,
  shapeStart: null,
  shapeSnapshot: null,
  history: [],
  redoStack: [],
  lastStateKey: "",

  ensureAISettingsLoaded() {
    if (this.aiSettingsLoaded) return;
    this.aiSettingsLoaded = true;
    try {
      this.openaiApiKey = String(localStorage.getItem(OPENAI_KEY_STORAGE_KEY) || "").trim();
    } catch (_err) {
      this.openaiApiKey = "";
    }
  },

  getMaskedApiKey() {
    if (!this.openaiApiKey) return "미설정";
    if (this.openaiApiKey.length <= 10) return "설정됨";
    return `${this.openaiApiKey.slice(0, 4)}...${this.openaiApiKey.slice(-4)}`;
  },

  setAIStatus(message) {
    this.aiStatus = String(message || "");
    this.refreshAIStatusUI();
  },

  refreshAIStatusUI() {
    const status = document.getElementById("coloring-ai-status");
    if (status) {
      status.textContent = this.aiStatus || (this.openaiApiKey ? `OpenAI 키: ${this.getMaskedApiKey()}` : "OpenAI 키가 없어 로컬 도안을 사용해요.");
    }
    const button = document.getElementById("coloring-ai-generate-btn");
    if (button) {
      button.disabled = this.aiBusy;
      button.textContent = this.aiBusy ? "생성 중..." : "만들기";
    }
  },

  saveOpenAIKeyFromInput() {
    const input = document.getElementById("coloring-openai-key");
    const value = input && typeof input.value === "string" ? input.value.trim() : "";
    this.openaiApiKey = value;
    try {
      if (value) localStorage.setItem(OPENAI_KEY_STORAGE_KEY, value);
      else localStorage.removeItem(OPENAI_KEY_STORAGE_KEY);
    } catch (_err) {
      // ignore
    }
    this.setAIStatus(value ? `OpenAI 키 저장 완료: ${this.getMaskedApiKey()}` : "OpenAI 키를 삭제했어요.");
  },

  clearOpenAIKey() {
    this.openaiApiKey = "";
    const input = document.getElementById("coloring-openai-key");
    if (input) input.value = "";
    try {
      localStorage.removeItem(OPENAI_KEY_STORAGE_KEY);
    } catch (_err) {
      // ignore
    }
    this.setAIStatus("OpenAI 키를 삭제했고 로컬 도안을 사용해요.");
  },

  getDesignPack() {
    return window.DESIGN_PACK && typeof window.DESIGN_PACK === "object" ? window.DESIGN_PACK : null;
  },

  getBaseDesigns() {
    const pack = this.getDesignPack();
    const fromPack = pack && Array.isArray(pack.coloringDesigns) ? pack.coloringDesigns : [];
    const legacy = typeof COLORING_DESIGNS !== "undefined" && Array.isArray(COLORING_DESIGNS) ? COLORING_DESIGNS : [];
    return [...fromPack, ...legacy, ...EXTRA_COLORING_DESIGNS];
  },

  buildSpriteDesigns() {
    if (this.spriteDesigns) return this.spriteDesigns;
    const total = STICKER_SHEET.cols * STICKER_SHEET.rows;
    const indices = uniq(Object.values(STICKER_CATEGORIES).flatMap((c) => c.indices)).filter((x) => x >= 0 && x < total);
    const idxToCategory = {};
    Object.entries(STICKER_CATEGORIES).forEach(([id, cfg]) => cfg.indices.forEach((idx) => (idxToCategory[idx] = id)));
    this.spriteDesigns = indices.map((sheetIndex, i) => ({
      id: `sprite-${sheetIndex}`,
      name: `${STICKER_CATEGORIES[idxToCategory[sheetIndex]]?.label || "스티커"} ${i + 1}`,
      emoji: "D",
      kind: "sprite-bitmap",
      sheetIndex,
      previewSheetIndex: sheetIndex,
      width: 720,
      height: 720,
      regions: [],
    }));
    return this.spriteDesigns;
  },

  getDesigns(options = {}) {
    const includeSprite = Boolean(options.includeSprite);
    const map = new Map();
    const source = [...this.getBaseDesigns(), ...(includeSprite ? this.buildSpriteDesigns() : []), ...this.aiDesigns];
    source.forEach((design) => {
      if (design && design.id) map.set(design.id, design);
    });
    return Array.from(map.values());
  },

  getDesignById(id) {
    return this.getDesigns().find((design) => design.id === id) || null;
  },

  isBitmapDesign(design = this.currentDesign) {
    return Boolean(design && (design.kind === "sprite-bitmap" || design.kind === "image-bitmap"));
  },

  registerExternalDesign(meta) {
    if (!meta || !meta.id) return null;
    const existing = this.getDesignById(meta.id);
    if (existing) return existing;
    const design = {
      id: meta.id,
      name: meta.name || "복원 도안",
      emoji: meta.emoji || "D",
      kind: meta.kind || "sprite-bitmap",
      sheetIndex: Number.isInteger(meta.sheetIndex) ? meta.sheetIndex : 0,
      previewSheetIndex: Number.isInteger(meta.previewSheetIndex) ? meta.previewSheetIndex : meta.sheetIndex,
      sourceImage: meta.sourceImage || "",
      previewSrc: meta.previewSrc || meta.sourceImage || "",
      width: meta.width || 720,
      height: meta.height || 720,
      prompt: meta.prompt || "",
      regions: [],
    };
    this.aiDesigns.unshift(design);
    this.aiDesigns = this.aiDesigns.slice(0, 24);
    return design;
  },

  serializeDesignMeta(design) {
    if (!design || !this.isBitmapDesign(design)) return null;
    return {
      id: design.id,
      name: design.name || "비트맵 도안",
      emoji: design.emoji || "D",
      kind: design.kind || "sprite-bitmap",
      sheetIndex: Number.isInteger(design.sheetIndex) ? design.sheetIndex : 0,
      previewSheetIndex: Number.isInteger(design.previewSheetIndex) ? design.previewSheetIndex : design.sheetIndex,
      sourceImage: design.sourceImage || "",
      previewSrc: design.previewSrc || "",
      width: design.width || 720,
      height: design.height || 720,
      prompt: design.prompt || "",
    };
  },

  getPalette() {
    const pack = this.getDesignPack();
    const packPalette = pack && Array.isArray(pack.palette) ? pack.palette : [];
    const legacyPalette = typeof COLORING_PALETTE !== "undefined" && Array.isArray(COLORING_PALETTE) ? COLORING_PALETTE : [];
    return uniq([...packPalette, ...legacyPalette, ...DEFAULT_PALETTE]);
  },

  getFillConfig() {
    return FILL_OPTIONS.find((option) => option.id === this.fillSensitivity) || FILL_OPTIONS[1];
  },

  buildStickerLibrary() {
    if (this._stickerLibrary) return this._stickerLibrary;
    const library = {};
    Object.entries(STICKER_CATEGORIES).forEach(([id, cfg]) => {
      library[id] = cfg.indices.map((index, i) => ({ id: `${id}-${index}`, kind: "sheet", sheetIndex: index, name: `${cfg.label} ${i + 1}` }));
    });
    library.emoji = FALLBACK_STICKERS.map((value, i) => ({ id: `emoji-${i}`, kind: "emoji", value, name: `스티커 ${i + 1}` }));
    this._stickerLibrary = library;
    return library;
  },

  getStickerCategories() {
    const library = this.buildStickerLibrary();
    return Object.keys(library).map((id) => ({ id, label: STICKER_CATEGORIES[id]?.label || "이모지" }));
  },

  getCurrentStickerList() {
    const library = this.buildStickerLibrary();
    return library[this.stickerCategory] && library[this.stickerCategory].length ? library[this.stickerCategory] : library.toys || library.emoji || [];
  },

  getSelectedSticker() {
    const list = this.getCurrentStickerList();
    if (!list.length) return null;
    return list.find((sticker) => sticker.id === this.selectedStickerId) || list[0];
  },

  async ensureStickerSheetLoaded() {
    if (this.stickerSheetReady && this.stickerSheetImage) return true;
    if (this.stickerSheetError) return false;
    if (this.stickerSheetPromise) return this.stickerSheetPromise;
    this.stickerSheetPromise = new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        this.stickerSheetImage = image;
        this.stickerSheetReady = true;
        resolve(true);
      };
      image.onerror = () => {
        this.stickerSheetError = true;
        resolve(false);
      };
      image.src = STICKER_SHEET.src;
    }).finally(() => {
      this.stickerSheetPromise = null;
    });
    return this.stickerSheetPromise;
  },

  renderDesignPreview(design) {
    if (design.previewSrc) return `<img class="design-preview-img" src="${design.previewSrc}" alt="design" loading="lazy">`;
    const index = Number.isInteger(design.previewSheetIndex) ? design.previewSheetIndex : Number.isInteger(design.sheetIndex) ? design.sheetIndex : null;
    if (index !== null) {
      const col = index % STICKER_SHEET.cols;
      const row = Math.floor(index / STICKER_SHEET.cols);
      const cell = 52;
      const totalW = STICKER_SHEET.cols * cell;
      const totalH = STICKER_SHEET.rows * cell;
      return `<div class="design-sheet-thumb"><img src="${STICKER_SHEET.src}" alt="sprite" loading="lazy" style="width:${totalW}px;height:${totalH}px;left:${-(col * cell)}px;top:${-(row * cell)}px;"></div>`;
    }
    return `<div class="design-emoji">${esc(design.emoji || "D")}</div>`;
  },

  renderDesignCard(design) {
    const isBitmap = design.kind === "sprite-bitmap" || design.kind === "image-bitmap";
    return `<button class="coloring-design-card ${isBitmap ? "ai-card" : ""}" onclick="Coloring.start('${escJsValue(design.id)}')">${this.renderDesignPreview(design)}<div class="design-name">${esc(design.name || "도안")}</div></button>`;
  },

  getCurrentAgeGroup() {
    const profile = window.Profile && typeof Profile.getCurrent === "function" ? Profile.getCurrent() : null;
    const ageGroup = profile?.ageGroup;
    return ageGroup === "toddler" || ageGroup === "child" || ageGroup === "older" ? ageGroup : "child";
  },

  getAgeBucketForDesign(design) {
    if (!design || !design.id) return "child";
    const id = String(design.id).toLowerCase();

    if (id.startsWith("kids-")) {
      const key = id.split("-")[1] || "";
      if (AGE_DESIGN_KEYWORDS.toddler.has(key)) return "toddler";
      if (AGE_DESIGN_KEYWORDS.child.has(key)) return "child";
      if (AGE_DESIGN_KEYWORDS.older.has(key)) return "older";
    }

    if (id.startsWith("openmoji-")) {
      if (id.includes("rabbit") || id.includes("balloon")) return "toddler";
      if (id.includes("rocket") || id.includes("turtle") || id.includes("whale")) return "child";
      if (id.includes("castle")) return "older";
    }

    if (design.kind === "image-bitmap") return "older";
    if (design.kind === "sprite-bitmap") return "child";

    const regionCount = Array.isArray(design.regions) ? design.regions.length : 0;
    if (regionCount > 0) {
      if (regionCount <= 6) return "toddler";
      if (regionCount <= 10) return "child";
      return "older";
    }
    return "child";
  },

  buildAgeGroups(designs) {
    const groups = { toddler: [], child: [], older: [] };
    designs.forEach((design) => {
      const bucket = this.getAgeBucketForDesign(design);
      groups[bucket] = groups[bucket] || [];
      groups[bucket].push(design);
    });
    return groups;
  },

  renderAgeSectionCards(designs) {
    if (!designs.length) return "";
    const ageGroup = this.getCurrentAgeGroup();
    const order = AGE_SECTION_ORDER[ageGroup] || AGE_SECTION_ORDER.child;
    const groups = this.buildAgeGroups(designs);
    const used = new Set();
    const sectionHtml = order
      .map((bucket, index) => {
        const meta = AGE_SECTION_META[bucket] || { title: bucket, subtitle: "" };
        let candidates = (groups[bucket] || []).filter((design) => !used.has(design.id));
        if (!candidates.length) {
          candidates = designs.filter((design) => !used.has(design.id));
        }
        const picks = candidates;
        picks.forEach((design) => used.add(design.id));
        if (!picks.length) return "";
        return `<section class="coloring-age-section"><div class="coloring-age-head"><h3 class="coloring-section-title">${esc(meta.title)}${index === 0 ? ' <span class="coloring-age-badge">현재 추천</span>' : ""}</h3>${meta.subtitle ? `<p class="coloring-section-subtitle">${esc(meta.subtitle)}</p>` : ""}<p class="coloring-section-count">${picks.length}개 도안</p></div><div class="coloring-designs-grid">${picks.map((design) => this.renderDesignCard(design)).join("")}</div></section>`;
      })
      .join("");
    return sectionHtml;
  },

  showDesigns() {
    this.ensureAISettingsLoaded();
    const screen = document.getElementById("screen-coloring");
    if (!screen) return;
    const designs = this.getDesigns();
    const gallery = Storage.getGallery(App.currentProfile);
    const recent = gallery.slice().reverse().slice(0, 12);
    const promptChips = AI_PROMPTS.map((prompt) => `<button class="coloring-prompt-chip" onclick="Coloring.generateAIDesign('${escJsValue(prompt)}')"><span>AI</span><span>${esc(prompt)}</span></button>`).join("");
    const ageSections = this.renderAgeSectionCards(designs);
    const recentHtml = recent
      .map((item, idx) => {
        const sourceIndex = gallery.length - 1 - idx;
        const design = this.getDesignById(item.designId);
        const thumb = item.drawing
          ? `<img class="gallery-drawing-thumb" src="${item.drawing}" alt="저장된 그림" loading="lazy">`
          : design?.previewSrc
            ? `<img class="gallery-mini-thumb" src="${design.previewSrc}" alt="도안" loading="lazy">`
            : `<div class="gallery-mini-svg">${esc(design?.emoji || "D")}</div>`;
        return `<button class="gallery-item" onclick="Coloring.loadFromGallery(${sourceIndex})">${thumb}<div class="gallery-date">${item.date ? item.date.slice(5, 10) : ""}</div></button>`;
      })
      .join("");

    const statusLine = this.aiStatus || (this.openaiApiKey ? `OpenAI 키: ${this.getMaskedApiKey()}` : "OpenAI 키가 없어 로컬 도안을 사용해요.");
    screen.innerHTML = `<div class="coloring-select-container"><div class="learn-header"><button class="btn-back" onclick="App.navigate('home')"><span class="back-arrow">&larr;</span></button><h2 class="learn-title">색칠 놀이</h2><span></span></div><div class="coloring-pro-banner">OpenAI 키를 넣으면 AI 도안을 만들 수 있어요.</div><div class="coloring-hero-card"><div class="coloring-hero-title">AI 도안 만들기</div><div class="coloring-ai-key-row"><input id="coloring-openai-key" class="coloring-prompt-input" type="password" placeholder="OpenAI API 키 (sk-...)" value="${esc(this.openaiApiKey)}"><button class="coloring-mini-btn" onclick="Coloring.saveOpenAIKeyFromInput()">키 저장</button><button class="coloring-mini-btn" onclick="Coloring.clearOpenAIKey()">삭제</button></div><div id="coloring-ai-status" class="coloring-ai-status">${esc(statusLine)}</div><div class="coloring-hero-actions"><input id="coloring-ai-input" class="coloring-prompt-input" type="text" maxlength="80" placeholder="예: 공원에 있는 귀여운 공룡"><button id="coloring-ai-generate-btn" class="coloring-mini-btn" onclick="Coloring.generateAIDesignFromInput()" ${this.aiBusy ? "disabled" : ""}>${this.aiBusy ? "생성 중..." : "만들기"}</button></div><div class="coloring-prompt-grid">${promptChips}</div></div>${ageSections}${recent.length ? `<div class="gallery-section"><h3 class="reward-section-title">저장한 작품 (${gallery.length})</h3><div class="gallery-grid">${recentHtml}</div></div>` : ""}</div>`;
    App.showScreen("coloring");
    this.refreshAIStatusUI();
    this.injectDesignLibraryControls();
  },

  async generateAIDesignFromInput() {
    const input = document.getElementById("coloring-ai-input");
    const prompt = input && typeof input.value === "string" ? input.value.trim() : "";
    await this.generateAIDesign(prompt || "귀여운 캐릭터");
  },

  pickVectorDesignForPrompt(promptText) {
    const prompt = String(promptText || "").toLowerCase();
    const pool = this.getBaseDesigns().filter((design) => Array.isArray(design.regions) && design.regions.length > 0 && String(design.id || "").startsWith("kids-"));
    if (!pool.length) return null;
    const pick = (list) => (list.length ? list[Math.floor(Math.random() * list.length)] : null);

    const byKeys = (keys) => pool.filter((design) => {
      const id = String(design.id || "").toLowerCase();
      return keys.some((key) => id.includes(`kids-${key}-`));
    });

    if (/(dino|dragon|monster|공룡|용|괴물)/.test(prompt)) return pick(byKeys(["dino", "robot", "planet"])) || pick(pool);
    if (/(robot|space|rocket|planet|로봇|우주|로켓|행성)/.test(prompt)) return pick(byKeys(["robot", "rocket", "planet", "cloudtrain"])) || pick(pool);
    if (/(house|castle|village|town|집|성|마을|도시)/.test(prompt)) return pick(byKeys(["house", "castle", "tree", "car", "bus"])) || pick(pool);
    if (/(beach|ocean|sea|dolphin|whale|바다|해변|돌고래|고래)/.test(prompt)) return pick(byKeys(["fish", "turtle", "star", "balloon"])) || pick(pool);
    if (/(forest|tree|nature|flower|rainbow|숲|나무|자연|꽃|무지개)/.test(prompt)) return pick(byKeys(["tree", "flower", "butterfly", "rabbit"])) || pick(pool);
    return pick(pool);
  },

  createFallbackAIDesign(promptText) {
    const prompt = String(promptText || "").trim();
    const source = this.pickVectorDesignForPrompt(prompt) || this.getBaseDesigns().find((design) => Array.isArray(design.regions) && design.regions.length > 0) || null;
    if (!source) {
      return {
        id: `ai-local-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
        name: `로컬 추천: ${(prompt || "캐릭터").slice(0, 24)}`,
        emoji: "AI",
        width: 320,
        height: 320,
        prompt,
        regions: [{ id: "region-1", path: "M0,0 L320,0 L320,320 L0,320 Z", defaultColor: "#f0f0f0" }],
      };
    }
    return {
      ...source,
      id: `ai-local-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
      name: `추천 도안: ${(prompt || source.name || "캐릭터").slice(0, 24)}`,
      prompt,
      regions: (source.regions || []).map((region, index) => ({ ...region, id: `region-${index + 1}` })),
    };
  },

  async requestOpenAIImage(promptText) {
    const prompt = String(promptText || "").trim();
    if (!this.openaiApiKey) throw new Error("OpenAI 키가 없어요.");
    const fullPrompt = [
      "Create a children coloring-book line art image.",
      `Subject: ${prompt}.`,
      "Requirements: black outline only, thick clean lines, white background, no color fill, no shading, centered composition, kid-friendly shapes.",
    ].join(" ");

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        prompt: fullPrompt,
        size: "1024x1024",
        n: 1,
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI 요청 실패 (${response.status}): ${errorText.slice(0, 200)}`);
    }

    const payload = await response.json();
    const item = Array.isArray(payload?.data) ? payload.data[0] : null;
    if (!item) throw new Error("OpenAI 응답에 이미지가 없어요.");

    let dataUrl = "";
    if (typeof item.b64_json === "string" && item.b64_json) {
      dataUrl = `data:image/png;base64,${item.b64_json}`;
    } else if (typeof item.url === "string" && item.url) {
      const remote = await fetch(item.url);
      if (!remote.ok) throw new Error(`이미지 다운로드 실패 (${remote.status}).`);
      const blob = await remote.blob();
      dataUrl = await blobToDataUrl(blob);
    } else {
      throw new Error("OpenAI 이미지 응답에 b64_json/url이 없어요.");
    }

    return {
      id: `ai-openai-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
      name: `OpenAI: ${prompt.slice(0, 24)}`,
      emoji: "AI",
      kind: "image-bitmap",
      sourceImage: dataUrl,
      previewSrc: dataUrl,
      width: 720,
      height: 720,
      prompt,
      regions: [],
    };
  },

  async generateAIDesign(promptText) {
    if (this.aiBusy) return;
    this.aiBusy = true;
    this.setAIStatus("AI 도안을 만드는 중...");
    try {
      const prompt = String(promptText || "").trim() || "귀여운 캐릭터";
      let design = null;
      if (this.openaiApiKey) {
        try {
          design = await this.requestOpenAIImage(prompt);
          this.setAIStatus("OpenAI 도안을 만들었어요.");
        } catch (error) {
          this.setAIStatus(`OpenAI 생성 실패, 로컬 도안을 사용했어요. (${error?.message || "알 수 없음"})`);
        }
      }
      if (!design) design = this.createFallbackAIDesign(prompt);
      this.aiDesigns.unshift(design);
      this.aiDesigns = this.aiDesigns.slice(0, 24);
      this.start(design.id);
    } finally {
      this.aiBusy = false;
      this.refreshAIStatusUI();
    }
  },

  start(designId, options = {}) {
    const design = this.getDesignById(designId);
    if (!design) return;
    this.currentDesign = design;
    this.currentColors = {};
    (design.regions || []).forEach((region) => {
      this.currentColors[region.id] = region.defaultColor || "#f0f0f0";
    });
    this.drawMode = "fill";
    this.brushSize = 14;
    this.brushOpacity = 1;
    this.stickerSize = 44;
    this.shapeFill = false;
    this.rainbowHue = 0;
    this.fillSensitivity = "medium";
    this.mirrorEnabled = false;
    this.showGrid = false;
    this.canvasBackground = "#FFFFFF";
    this.stickerCategory = "toys";
    this.selectedStickerId = "";
    this.selectedColor = this.getPalette()[0] || "#FF6B6B";
    this.isDrawing = false;
    this.lastPoint = null;
    this.shapeStart = null;
    this.shapeSnapshot = null;
    this.boundaryMap = null;
    this.boundaryW = 0;
    this.boundaryH = 0;
    this.renderStudio();
    const stickerList = this.getCurrentStickerList();
    this.selectedStickerId = stickerList[0]?.id || "";
    this.renderStickerPanel();
    const saved = options.savedState || null;
    if (saved) this.applySavedState(saved, () => this.resetHistoryWithCurrentState());
    else this.resetHistoryWithCurrentState();
    void this.ensureStickerSheetLoaded().then(async () => {
      this.renderStickerPanel();
      await this.prepareBitmapTemplate();
    });
  },

  startRandom() {
    const designs = this.getDesigns();
    if (!designs.length) return;
    this.start(designs[Math.floor(Math.random() * designs.length)].id);
  },

  nextDesign() {
    const designs = this.getDesigns();
    if (!this.currentDesign || !designs.length) return;
    const index = designs.findIndex((design) => design.id === this.currentDesign.id);
    this.start(designs[index >= 0 ? (index + 1) % designs.length : 0].id);
  },

  loadFromGallery(index) {
    const gallery = Storage.getGallery(App.currentProfile);
    const item = gallery[index];
    if (!item) return;
    if (!this.getDesignById(item.designId) && item.designMeta) this.registerExternalDesign(item.designMeta);
    if (!this.getDesignById(item.designId) && Number.isInteger(item.sheetIndex)) {
      this.registerExternalDesign({
        id: item.designId,
        name: item.designName || "복원 도안",
        kind: "sprite-bitmap",
        sheetIndex: item.sheetIndex,
        previewSheetIndex: item.sheetIndex,
        width: 720,
        height: 720,
      });
    }
    this.start(item.designId, { savedState: item });
  },

  triggerImportDesignPicker() {
    const input = document.getElementById("coloring-import-input");
    if (input) input.click();
  },

  importDesignFromFile(event) {
    const input = event?.target;
    const file = input?.files && input.files[0] ? input.files[0] : null;
    if (!file) return;
    if (!file.type || !file.type.startsWith("image/")) {
      this.showToast("이미지 파일만 가져올 수 있어요.");
      input.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      if (!dataUrl.startsWith("data:image/")) {
        this.showToast("이미지를 읽지 못했어요.");
        input.value = "";
        return;
      }
      this.customDesignCounter += 1;
      const design = {
        id: `user-image-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
        name: `내 이미지 ${this.customDesignCounter}`,
        emoji: "IMG",
        kind: "image-bitmap",
        sourceImage: dataUrl,
        previewSrc: dataUrl,
        width: 720,
        height: 720,
        prompt: "user upload",
        regions: [],
      };
      this.aiDesigns.unshift(design);
      this.aiDesigns = this.aiDesigns.slice(0, MAX_CUSTOM_DESIGNS);
      input.value = "";
      this.showToast("이미지 도안을 추가했어요.");
      this.start(design.id);
    };
    reader.onerror = () => {
      this.showToast("이미지 읽기에 실패했어요.");
      input.value = "";
    };
    reader.readAsDataURL(file);
  },

  injectDesignLibraryControls() {
    const hero = document.querySelector(".coloring-hero-card");
    if (!hero || document.getElementById("coloring-import-input")) return;
    hero.insertAdjacentHTML(
      "beforeend",
      `<div class="coloring-hero-import"><button class="coloring-mini-btn" type="button" onclick="Coloring.triggerImportDesignPicker()">이미지 도안 가져오기</button><input id="coloring-import-input" class="coloring-upload-input" type="file" accept="image/*"></div>`,
    );
    const input = document.getElementById("coloring-import-input");
    if (input) {
      input.addEventListener("change", (event) => this.importDesignFromFile(event));
    }
  },

  getMirrorPoint(point) {
    if (!this.canvas || !point) return point;
    return {
      x: clamp(this.canvas.width - point.x - 1, 0, this.canvas.width - 1),
      y: clamp(point.y, 0, this.canvas.height - 1),
    };
  },

  toggleMirror() {
    this.mirrorEnabled = !this.mirrorEnabled;
    this.refreshAdvancedControls();
  },

  toggleGrid() {
    this.showGrid = !this.showGrid;
    this.updateGridOverlay();
    this.refreshAdvancedControls();
  },

  setCanvasBackground(color) {
    if (typeof color !== "string" || !color.startsWith("#")) return;
    this.canvasBackground = color;
    const stack = document.getElementById("coloring-canvas-stack");
    if (stack) stack.style.backgroundColor = this.canvasBackground;
    const svg = document.getElementById("coloring-svg-root");
    if (svg) svg.style.background = this.canvasBackground;
    if (this.isBitmapDesign()) void this.prepareBitmapTemplate();
  },

  setBrushOpacity(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return;
    this.brushOpacity = clamp(Math.round(n) / 100, 0.1, 1);
    const label = document.getElementById("brush-opacity-value");
    if (label) label.textContent = `${Math.round(this.brushOpacity * 100)}%`;
  },

  ensureGridOverlay() {
    const stack = document.getElementById("coloring-canvas-stack");
    if (!stack) return;
    let overlay = document.getElementById("coloring-grid-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "coloring-grid-overlay";
      overlay.className = "coloring-grid-overlay";
      stack.appendChild(overlay);
    }
    this.updateGridOverlay();
  },

  updateGridOverlay() {
    const overlay = document.getElementById("coloring-grid-overlay");
    if (!overlay || !this.canvas) return;
    const gridStep = Math.max(16, Math.round(this.canvas.width / 24));
    overlay.style.backgroundSize = `${gridStep}px ${gridStep}px`;
    overlay.style.display = this.showGrid ? "block" : "none";
  },

  injectAdvancedControls() {
    const chipRow = document.querySelector(".tool-chip-row");
    if (chipRow && !document.getElementById("mode-picker-btn")) {
      chipRow.insertAdjacentHTML("beforeend", `<button id="mode-picker-btn" class="tool-btn ${this.drawMode === "picker" ? "active" : ""}" data-mode="picker" onclick="Coloring.setMode('picker')">스 스포이드</button>`);
    }
    const toolbar = document.querySelector(".coloring-toolbar");
    if (toolbar && !document.getElementById("brush-opacity-slider")) {
      toolbar.insertAdjacentHTML(
        "beforeend",
        `<div class="tool-title">브러시 투명도</div><div class="brush-opacity-row"><input id="brush-opacity-slider" type="range" min="10" max="100" step="5" value="${Math.round(this.brushOpacity * 100)}" oninput="Coloring.setBrushOpacity(this.value)"><span class="brush-size-value" id="brush-opacity-value">${Math.round(this.brushOpacity * 100)}%</span></div><div class="advanced-controls-row"><button id="mirror-toggle-btn" class="tool-btn ${this.mirrorEnabled ? "active" : ""}" onclick="Coloring.toggleMirror()">대칭 그리기</button><button id="grid-toggle-btn" class="tool-btn ${this.showGrid ? "active" : ""}" onclick="Coloring.toggleGrid()">격자</button><button class="tool-btn" onclick="Coloring.downloadArtwork('png')">PNG 저장</button><button class="tool-btn" onclick="Coloring.downloadArtwork('jpg')">JPG 저장</button></div><div class="tool-title">배경색</div><div class="background-row"><input id="canvas-bg-input" class="canvas-bg-input" type="color" value="${this.canvasBackground}" oninput="Coloring.setCanvasBackground(this.value)"></div>`,
      );
    }
    this.ensureGridOverlay();
    this.setCanvasBackground(this.canvasBackground);
    this.refreshAdvancedControls();
  },

  refreshAdvancedControls() {
    const mirrorBtn = document.getElementById("mirror-toggle-btn");
    if (mirrorBtn) mirrorBtn.classList.toggle("active", this.mirrorEnabled);
    const gridBtn = document.getElementById("grid-toggle-btn");
    if (gridBtn) gridBtn.classList.toggle("active", this.showGrid);
    const pickerBtn = document.getElementById("mode-picker-btn");
    if (pickerBtn) pickerBtn.classList.toggle("active", this.drawMode === "picker");
    const bgInput = document.getElementById("canvas-bg-input");
    if (bgInput && bgInput.value !== this.canvasBackground) bgInput.value = this.canvasBackground;
  },

  renderModeButton(mode, icon, label) {
    return `<button class="tool-btn ${this.drawMode === mode ? "active" : ""}" data-mode="${mode}" onclick="Coloring.setMode('${mode}')">${icon} ${label}</button>`;
  },

  renderRegionsSVG(design) {
    return (design.regions || [])
      .map((region) => {
        const color = this.currentColors[region.id] || region.defaultColor || "#f0f0f0";
        if (region.isStroke) {
          return `<path class="coloring-region" data-region-id="${region.id}" d="${region.path}" fill="none" stroke="${color}" stroke-width="${region.strokeWidth || 4}" stroke-linecap="round" stroke-linejoin="round"></path>`;
        }
        return `<path class="coloring-region" data-region-id="${region.id}" d="${region.path}" fill="${color}" stroke="rgba(110,96,145,0.45)" stroke-width="1"></path>`;
      })
      .join("");
  },

  renderStudio() {
    const screen = document.getElementById("screen-coloring");
    if (!screen || !this.currentDesign) return;
    const design = this.currentDesign;
    const palette = this.getPalette();
    const bitmap = this.isBitmapDesign(design);
    const fillButtons = FILL_OPTIONS.map((option) => `<button class="tool-btn ${option.id === this.fillSensitivity ? "active" : ""}" data-fill-sensitivity="${option.id}" onclick="Coloring.setFillSensitivity('${option.id}')">${option.label}</button>`).join("");
    screen.innerHTML = `<div class="coloring-container ${bitmap ? "bitmap-mode" : ""}"><div class="learn-header"><button class="btn-back" onclick="Coloring.showDesigns()"><span class="back-arrow">&larr;</span></button><h2 class="learn-title">${esc(design.name || "도안")}</h2><button class="btn-secondary" onclick="Coloring.saveArtwork()">저장</button></div><div class="coloring-toolbar pro-toolbar"><div class="tool-title">모드</div><div class="tool-chip-row">${this.renderModeButton("fill", "채", "채우기")}${BRUSH_TOOLS.map((tool) => this.renderModeButton(tool.id, tool.icon, tool.label)).join("")}${SHAPE_TOOLS.map((tool) => this.renderModeButton(tool.id, tool.icon, tool.label)).join("")}</div><div class="tool-title">붓 크기</div><div class="brush-size-row"><input id="brush-size-slider" type="range" min="2" max="60" value="${this.brushSize}" oninput="Coloring.setBrushSize(this.value)"><span class="brush-size-value" id="brush-size-value">${this.brushSize}px</span></div><div class="shape-options" id="shape-options" style="display:${this.isShapeMode(this.drawMode) ? "flex" : "none"}"><button class="tool-btn ${this.shapeFill ? "active" : ""}" onclick="Coloring.toggleShapeFill()">${this.shapeFill ? "채우기 켜짐" : "채우기 꺼짐"}</button></div><div class="tool-title" id="fill-sensitivity-title" style="display:${bitmap ? "block" : "none"}">채우기 옵션</div><div class="fill-sensitivity-row" id="fill-sensitivity-row" style="display:${bitmap ? "flex" : "none"}">${fillButtons}</div><div class="tool-title">색상 팔레트</div><div class="coloring-palette">${palette.map((color) => `<button class="palette-color ${color === this.selectedColor ? "selected" : ""}" data-color="${color}" style="background:${color}" onclick="Coloring.setColor('${color.replace(/'/g, "\\'")}')"></button>`).join("")}</div><div class="coloring-actions"><button class="tool-btn" id="undo-btn" onclick="Coloring.undo()">되돌리기</button><button class="tool-btn" id="redo-btn" onclick="Coloring.redo()">다시하기</button><button class="tool-btn" onclick="Coloring.clearArtwork()">지우기</button><button class="tool-btn" onclick="Coloring.startRandom()">랜덤</button><button class="tool-btn" onclick="Coloring.nextDesign()">다음</button></div></div><div class="coloring-canvas-area"><div class="coloring-canvas-stack" id="coloring-canvas-stack"><canvas id="coloring-template-canvas" class="coloring-template-canvas"></canvas><svg id="coloring-svg-root" class="coloring-svg coloring-svg-pro" viewBox="0 0 ${design.width} ${design.height}" preserveAspectRatio="xMidYMid meet">${this.renderRegionsSVG(design)}</svg><canvas id="coloring-draw-canvas" class="coloring-draw-canvas"></canvas></div></div></div>`;
    this.setupCanvas();
    this.bindRegionEvents();
    this.updateToolSelection();
    this.updateCanvasInteractivity();
    this.refreshUndoRedoButtons();
    this.injectAdvancedControls();
    void this.prepareBitmapTemplate();
  },

  renderStickerPanel() {
    const categoryRow = document.getElementById("sticker-category-row");
    const picker = document.getElementById("sticker-picker");
    if (!categoryRow || !picker) return;
    categoryRow.innerHTML = this.getStickerCategories().map((category) => `<button class="sticker-cat-btn ${category.id === this.stickerCategory ? "active" : ""}" onclick="Coloring.setStickerCategory('${category.id}')">${esc(category.label)}</button>`).join("");
    const stickers = this.getCurrentStickerList();
    if (!this.selectedStickerId && stickers.length) this.selectedStickerId = stickers[0].id;
    picker.innerHTML = stickers.map((sticker, i) => `<button class="sticker-btn ${sticker.id === this.selectedStickerId ? "active" : ""}" onclick="Coloring.selectStickerByIndex(${i})" title="${esc(sticker.name)}">${this.renderStickerVisual(sticker)}</button>`).join("");
  },

  renderStickerVisual(sticker) {
    if (sticker.kind === "sheet" && !this.stickerSheetError) {
      const col = sticker.sheetIndex % STICKER_SHEET.cols;
      const row = Math.floor(sticker.sheetIndex / STICKER_SHEET.cols);
      const totalW = STICKER_SHEET.cols * STICKER_SHEET.thumb;
      const totalH = STICKER_SHEET.rows * STICKER_SHEET.thumb;
      const left = -(col * STICKER_SHEET.thumb);
      const top = -(row * STICKER_SHEET.thumb);
      return `<span class="sticker-sheet-thumb"><img src="${STICKER_SHEET.src}" alt="sticker" loading="lazy" style="width:${totalW}px;height:${totalH}px;left:${left}px;top:${top}px;"></span>`;
    }
    return `<span class="sticker-emoji-thumb">${esc(sticker.value || "*")}</span>`;
  },

  setupCanvas() {
    this.canvas = document.getElementById("coloring-draw-canvas");
    this.templateCanvas = document.getElementById("coloring-template-canvas");
    if (!this.canvas || !this.currentDesign) return;
    this.canvas.width = this.currentDesign.width;
    this.canvas.height = this.currentDesign.height;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.templateCanvas) {
      this.templateCanvas.width = this.currentDesign.width;
      this.templateCanvas.height = this.currentDesign.height;
      this.templateCtx = this.templateCanvas.getContext("2d");
      this.templateCtx.clearRect(0, 0, this.templateCanvas.width, this.templateCanvas.height);
    }
    this.canvas.addEventListener("pointerdown", (event) => this.onPointerDown(event));
    this.canvas.addEventListener("pointermove", (event) => this.onPointerMove(event));
    this.canvas.addEventListener("pointerup", (event) => this.onPointerUp(event));
    this.canvas.addEventListener("pointercancel", (event) => this.onPointerUp(event));
    this.canvas.addEventListener("pointerleave", (event) => this.onPointerUp(event));
    this.setCanvasBackground(this.canvasBackground);
    this.ensureGridOverlay();
  },

  bindRegionEvents() {
    document.querySelectorAll("#coloring-svg-root .coloring-region").forEach((element) => {
      element.addEventListener("click", () => {
        if (this.drawMode !== "fill" || this.isBitmapDesign()) return;
        const regionId = element.dataset.regionId;
        if (!regionId) return;
        this.currentColors[regionId] = this.selectedColor;
        this.updateRegionColors();
        this.saveState();
      });
    });
  },

  async loadImageElement(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("이미지를 불러오지 못했어요."));
      image.src = src;
    });
  },

  async prepareBitmapTemplate() {
    if (!this.templateCanvas || !this.templateCtx || !this.currentDesign) return;
    const svg = document.getElementById("coloring-svg-root");
    if (!this.isBitmapDesign()) {
      this.boundaryMap = null;
      this.boundaryW = 0;
      this.boundaryH = 0;
      this.templateCanvas.style.display = "none";
      if (svg) svg.style.display = "";
      return;
    }
    this.templateCanvas.style.display = "";
    if (svg) svg.style.display = "none";
    this.templateCtx.clearRect(0, 0, this.templateCanvas.width, this.templateCanvas.height);
    this.templateCtx.fillStyle = this.canvasBackground || "#FFFFFF";
    this.templateCtx.fillRect(0, 0, this.templateCanvas.width, this.templateCanvas.height);

    if (this.currentDesign.kind === "sprite-bitmap") {
      const loaded = await this.ensureStickerSheetLoaded();
      if (!loaded || !this.stickerSheetImage) return;
      const index = Number.isInteger(this.currentDesign.sheetIndex) ? this.currentDesign.sheetIndex : 0;
      const sx = (index % STICKER_SHEET.cols) * STICKER_SHEET.cell;
      const sy = Math.floor(index / STICKER_SHEET.cols) * STICKER_SHEET.cell;
      const targetSize = Math.floor(Math.min(this.templateCanvas.width, this.templateCanvas.height) * 0.78);
      const dx = Math.floor((this.templateCanvas.width - targetSize) / 2);
      const dy = Math.floor((this.templateCanvas.height - targetSize) / 2);
      this.templateCtx.imageSmoothingEnabled = true;
      this.templateCtx.drawImage(this.stickerSheetImage, sx, sy, STICKER_SHEET.cell, STICKER_SHEET.cell, dx, dy, targetSize, targetSize);
    } else if (this.currentDesign.sourceImage) {
      try {
        const image = await this.loadImageElement(this.currentDesign.sourceImage);
        const targetSize = Math.floor(Math.min(this.templateCanvas.width, this.templateCanvas.height) * 0.84);
        const dx = Math.floor((this.templateCanvas.width - targetSize) / 2);
        const dy = Math.floor((this.templateCanvas.height - targetSize) / 2);
        this.templateCtx.imageSmoothingEnabled = true;
        this.templateCtx.drawImage(image, dx, dy, targetSize, targetSize);
      } catch (_err) {
        return;
      }
    } else {
      return;
    }

    const imageData = this.templateCtx.getImageData(0, 0, this.templateCanvas.width, this.templateCanvas.height);
    const config = this.getFillConfig();
    const boundaryMap = this.buildBoundaryMap(imageData, config.dark, config.grad);
    this.boundaryMap = boundaryMap;
    this.boundaryW = this.templateCanvas.width;
    this.boundaryH = this.templateCanvas.height;
    const pixels = imageData.data;
    for (let i = 0; i < boundaryMap.length; i += 1) {
      const offset = i * 4;
      if (boundaryMap[i]) {
        pixels[offset] = 18;
        pixels[offset + 1] = 18;
        pixels[offset + 2] = 18;
        pixels[offset + 3] = 255;
      } else {
        pixels[offset] = 255;
        pixels[offset + 1] = 255;
        pixels[offset + 2] = 255;
        pixels[offset + 3] = 255;
      }
    }
    this.templateCtx.putImageData(imageData, 0, 0);
  },

  buildBoundaryMap(imageData, darkThreshold, gradientThreshold) {
    const { width, height, data } = imageData;
    const map = new Uint8Array(width * height);
    const luminance = (offset) => 0.299 * data[offset] + 0.587 * data[offset + 1] + 0.114 * data[offset + 2];
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const index = y * width + x;
        const offset = index * 4;
        if (data[offset + 3] < 16) continue;
        const value = luminance(offset);
        const right = x + 1 < width ? index + 1 : index;
        const down = y + 1 < height ? index + width : index;
        const gradient = Math.abs(value - luminance(right * 4)) + Math.abs(value - luminance(down * 4));
        if (value < darkThreshold || gradient > gradientThreshold) map[index] = 1;
      }
    }
    const dilated = new Uint8Array(map);
    for (let y = 1; y < height - 1; y += 1) {
      for (let x = 1; x < width - 1; x += 1) {
        const index = y * width + x;
        if (!map[index]) continue;
        dilated[index - width - 1] = 1;
        dilated[index - width] = 1;
        dilated[index - width + 1] = 1;
        dilated[index - 1] = 1;
        dilated[index + 1] = 1;
        dilated[index + width - 1] = 1;
        dilated[index + width] = 1;
        dilated[index + width + 1] = 1;
      }
    }
    return dilated;
  },

  setMode(mode) {
    this.drawMode = mode;
    this.updateToolSelection();
    this.updateCanvasInteractivity();
    this.refreshAdvancedControls();
  },

  setColor(color) {
    this.selectedColor = color;
    document.querySelectorAll(".palette-color").forEach((button) => button.classList.toggle("selected", button.dataset.color === color));
  },

  setBrushSize(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return;
    this.brushSize = clamp(Math.round(n), 2, 60);
    this.stickerSize = Math.max(24, Math.round(this.brushSize * 2.2));
    const label = document.getElementById("brush-size-value");
    if (label) label.textContent = `${this.brushSize}px`;
  },

  toggleShapeFill() {
    this.shapeFill = !this.shapeFill;
    const row = document.getElementById("shape-options");
    if (!row) return;
    const button = row.querySelector(".tool-btn");
    if (!button) return;
    button.classList.toggle("active", this.shapeFill);
    button.textContent = this.shapeFill ? "채우기 켜짐" : "채우기 꺼짐";
  },

  setFillSensitivity(level) {
    if (!FILL_OPTIONS.some((option) => option.id === level)) return;
    this.fillSensitivity = level;
    document.querySelectorAll("[data-fill-sensitivity]").forEach((button) => button.classList.toggle("active", button.getAttribute("data-fill-sensitivity") === level));
    if (this.isBitmapDesign()) void this.prepareBitmapTemplate();
  },

  setStickerCategory(categoryId) {
    const library = this.buildStickerLibrary();
    if (!library[categoryId]) return;
    this.stickerCategory = categoryId;
    this.selectedStickerId = this.getCurrentStickerList()[0]?.id || "";
    this.renderStickerPanel();
  },

  selectStickerByIndex(index) {
    const sticker = this.getCurrentStickerList()[index];
    if (!sticker) return;
    this.selectedStickerId = sticker.id;
    this.renderStickerPanel();
  },

  updateToolSelection() {
    document.querySelectorAll(".tool-btn[data-mode]").forEach((button) => button.classList.toggle("active", button.dataset.mode === this.drawMode));
    const shapeOptions = document.getElementById("shape-options");
    if (shapeOptions) shapeOptions.style.display = this.isShapeMode(this.drawMode) ? "flex" : "none";
  },

  updateCanvasInteractivity() {
    if (!this.canvas) return;
    this.canvas.style.pointerEvents = this.drawMode === "fill" && !this.isBitmapDesign() ? "none" : "auto";
  },

  isShapeMode(mode) {
    return typeof mode === "string" && mode.startsWith("shape-");
  },

  isBrushMode(mode) {
    return BRUSH_TOOLS.some((tool) => tool.id === mode);
  },

  getCanvasPoint(event) {
    if (!this.canvas) return { x: 0, y: 0 };
    const rect = this.canvas.getBoundingClientRect();
    const sx = this.canvas.width / (rect.width || 1);
    const sy = this.canvas.height / (rect.height || 1);
    return {
      x: clamp((event.clientX - rect.left) * sx, 0, this.canvas.width - 1),
      y: clamp((event.clientY - rect.top) * sy, 0, this.canvas.height - 1),
    };
  },

  onPointerDown(event) {
    if (!this.canvas || !this.ctx) return;
    if (this.drawMode === "fill") {
      if (!this.isBitmapDesign()) return;
      event.preventDefault();
      if (!this.boundaryMap) {
        void this.prepareBitmapTemplate();
        this.showToast("도안을 불러오는 중이에요. 잠시만 기다려 주세요.");
        return;
      }
      const point = this.getCanvasPoint(event);
      const changedMain = this.bucketFillAt(point);
      let changedMirror = false;
      if (this.mirrorEnabled) {
        const mirrorPoint = this.getMirrorPoint(point);
        changedMirror = this.bucketFillAt(mirrorPoint);
      }
      if (changedMain || changedMirror) this.saveState();
      return;
    }
    if (this.drawMode === "picker") {
      event.preventDefault();
      const point = this.getCanvasPoint(event);
      void this.pickColorAtPoint(point);
      return;
    }
    event.preventDefault();
    const point = this.getCanvasPoint(event);
    if (this.drawMode === "sticker") {
      void this.placeSticker(point).then((ok) => {
        if (ok) this.saveState();
      });
      return;
    }
    if (this.isShapeMode(this.drawMode)) {
      this.isDrawing = true;
      this.shapeStart = point;
      this.shapeSnapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      return;
    }
    if (!this.isBrushMode(this.drawMode)) return;
    this.isDrawing = true;
    this.lastPoint = point;
    this.drawSegment(point, point);
  },

  onPointerMove(event) {
    if (!this.isDrawing || !this.canvas || !this.ctx) return;
    event.preventDefault();
    const point = this.getCanvasPoint(event);
    if (this.isShapeMode(this.drawMode)) {
      if (this.shapeSnapshot) this.ctx.putImageData(this.shapeSnapshot, 0, 0);
      this.drawShape(this.shapeStart, point, true);
      return;
    }
    this.drawSegment(this.lastPoint, point);
    this.lastPoint = point;
  },

  onPointerUp(event) {
    if (!this.isDrawing || !this.canvas || !this.ctx) return;
    event.preventDefault();
    const point = this.getCanvasPoint(event);
    if (this.isShapeMode(this.drawMode)) {
      if (this.shapeSnapshot) this.ctx.putImageData(this.shapeSnapshot, 0, 0);
      this.drawShape(this.shapeStart, point, false);
      this.shapeSnapshot = null;
      this.shapeStart = null;
    }
    this.isDrawing = false;
    this.lastPoint = null;
    this.saveState();
  },

  bucketFillAt(point) {
    if (!this.ctx || !this.canvas || !this.boundaryMap) return false;
    const width = this.canvas.width;
    const height = this.canvas.height;
    if (this.boundaryW !== width || this.boundaryH !== height) return false;
    const startX = Math.floor(point.x);
    const startY = Math.floor(point.y);
    const startIndex = startY * width + startX;
    if (this.boundaryMap[startIndex]) return false;
    const fill = hexToRgba(this.selectedColor);
    if (!fill) return false;
    const imageData = this.ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    const startOffset = startIndex * 4;
    const target = { r: pixels[startOffset], g: pixels[startOffset + 1], b: pixels[startOffset + 2], a: pixels[startOffset + 3] };
    if (Math.abs(target.r - fill.r) < 2 && Math.abs(target.g - fill.g) < 2 && Math.abs(target.b - fill.b) < 2 && target.a > 245) return false;
    const tolerance = this.getFillConfig().tol;
    const visited = new Uint8Array(width * height);
    const queue = [startIndex];
    let head = 0;
    let changed = 0;
    while (head < queue.length) {
      const index = queue[head++];
      if (visited[index]) continue;
      visited[index] = 1;
      if (this.boundaryMap[index]) continue;
      const offset = index * 4;
      const current = { r: pixels[offset], g: pixels[offset + 1], b: pixels[offset + 2], a: pixels[offset + 3] };
      if (!this.fillColorMatch(current, target, tolerance)) continue;
      pixels[offset] = fill.r;
      pixels[offset + 1] = fill.g;
      pixels[offset + 2] = fill.b;
      pixels[offset + 3] = 255;
      changed += 1;
      const x = index % width;
      const y = Math.floor(index / width);
      if (x > 0) queue.push(index - 1);
      if (x < width - 1) queue.push(index + 1);
      if (y > 0) queue.push(index - width);
      if (y < height - 1) queue.push(index + width);
    }
    if (!changed) return false;
    this.ctx.putImageData(imageData, 0, 0);
    return true;
  },

  fillColorMatch(current, target, tolerance) {
    if (target.a < 12) return current.a < 12;
    return (
      Math.abs(current.r - target.r) <= tolerance &&
      Math.abs(current.g - target.g) <= tolerance &&
      Math.abs(current.b - target.b) <= tolerance &&
      Math.abs(current.a - target.a) <= Math.max(20, tolerance)
    );
  },

  toHexColor(r, g, b) {
    const ch = (n) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
    return `#${ch(r)}${ch(g)}${ch(b)}`.toUpperCase();
  },

  async renderCompositeCanvas() {
    if (!this.canvas || !this.currentDesign) return null;
    const output = document.createElement("canvas");
    output.width = this.canvas.width;
    output.height = this.canvas.height;
    const outCtx = output.getContext("2d");
    outCtx.fillStyle = this.canvasBackground || "#FFFFFF";
    outCtx.fillRect(0, 0, output.width, output.height);

    if (this.isBitmapDesign()) {
      if (this.templateCanvas) outCtx.drawImage(this.templateCanvas, 0, 0, output.width, output.height);
    } else {
      const svg = document.getElementById("coloring-svg-root");
      if (svg) {
        let url = "";
        try {
          const xml = new XMLSerializer().serializeToString(svg);
          const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
          url = URL.createObjectURL(blob);
          const image = await this.loadImageElement(url);
          outCtx.drawImage(image, 0, 0, output.width, output.height);
        } catch (_err) {
          // ignore
        } finally {
          if (url) URL.revokeObjectURL(url);
        }
      }
    }
    outCtx.drawImage(this.canvas, 0, 0, output.width, output.height);
    return output;
  },

  async pickColorAtPoint(point) {
    const composite = await this.renderCompositeCanvas();
    if (!composite) return;
    const ctx = composite.getContext("2d");
    const x = clamp(Math.floor(point.x), 0, composite.width - 1);
    const y = clamp(Math.floor(point.y), 0, composite.height - 1);
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const picked = this.toHexColor(pixel[0], pixel[1], pixel[2]);
    this.setColor(picked);
    this.showToast(`색상 선택: ${picked}`);
  },

  async downloadArtwork(format = "png") {
    const canvas = await this.renderCompositeCanvas();
    if (!canvas) {
      this.showToast("저장에 실패했어요.");
      return;
    }
    const ext = format === "jpg" ? "jpg" : "png";
    const mime = ext === "jpg" ? "image/jpeg" : "image/png";
    const quality = ext === "jpg" ? 0.92 : undefined;
    const dataUrl = canvas.toDataURL(mime, quality);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `kids-art-${Date.now()}.${ext}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    this.showToast(`${ext.toUpperCase()} 파일로 저장했어요.`);
  },

  drawSegment(start, end) {
    if (!start || !end || !this.ctx) return;
    if (this.drawMode === "rainbow") this.rainbowHue = (this.rainbowHue + 8) % 360;
    this.ctx.save();
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    const alphaBase = (this.drawMode === "marker" ? 0.38 : 1) * this.brushOpacity;
    if (this.drawMode === "eraser") {
      this.ctx.globalCompositeOperation = "destination-out";
      this.ctx.strokeStyle = "#000000";
      this.ctx.lineWidth = this.brushSize * 1.8;
      this.ctx.globalAlpha = this.brushOpacity;
      this.ctx.beginPath();
      this.ctx.moveTo(start.x, start.y);
      this.ctx.lineTo(end.x, end.y);
      this.ctx.stroke();
      if (this.mirrorEnabled) {
        const mirrorStart = this.getMirrorPoint(start);
        const mirrorEnd = this.getMirrorPoint(end);
        this.ctx.beginPath();
        this.ctx.moveTo(mirrorStart.x, mirrorStart.y);
        this.ctx.lineTo(mirrorEnd.x, mirrorEnd.y);
        this.ctx.stroke();
      }
      this.ctx.restore();
      return;
    }
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.strokeStyle = this.drawMode === "rainbow" ? `hsl(${this.rainbowHue}, 92%, 58%)` : this.selectedColor;
    this.ctx.lineWidth = this.drawMode === "marker" ? this.brushSize * 2 : this.brushSize;
    this.ctx.globalAlpha = alphaBase;
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.stroke();
    if (this.mirrorEnabled) {
      const mirrorStart = this.getMirrorPoint(start);
      const mirrorEnd = this.getMirrorPoint(end);
      this.ctx.beginPath();
      this.ctx.moveTo(mirrorStart.x, mirrorStart.y);
      this.ctx.lineTo(mirrorEnd.x, mirrorEnd.y);
      this.ctx.stroke();
    }
    this.ctx.restore();
  },

  drawShape(start, end, preview) {
    if (!this.ctx || !start || !end) return;
    const mode = this.drawMode;
    const drawOne = (from, to) => {
      const left = Math.min(from.x, to.x);
      const top = Math.min(from.y, to.y);
      const width = Math.abs(to.x - from.x);
      const height = Math.abs(to.y - from.y);
      if (mode === "shape-line") {
        this.ctx.beginPath();
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
      } else if (mode === "shape-rect") {
        this.ctx.beginPath();
        this.ctx.rect(left, top, width, height);
      } else if (mode === "shape-circle") {
        this.ctx.beginPath();
        this.ctx.ellipse((from.x + to.x) / 2, (from.y + to.y) / 2, Math.max(1, width / 2), Math.max(1, height / 2), 0, 0, Math.PI * 2);
      }
      if (mode !== "shape-line" && this.shapeFill) {
        this.ctx.save();
        this.ctx.globalAlpha = (preview ? 0.25 : 0.35) * this.brushOpacity;
        this.ctx.fillStyle = this.selectedColor;
        this.ctx.fill();
        this.ctx.restore();
      }
      this.ctx.stroke();
    };
    this.ctx.save();
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.strokeStyle = this.selectedColor;
    this.ctx.lineWidth = Math.max(2, this.brushSize * 0.6);
    this.ctx.globalAlpha = (preview ? 0.75 : 1) * this.brushOpacity;
    drawOne(start, end);
    if (this.mirrorEnabled) {
      drawOne(this.getMirrorPoint(start), this.getMirrorPoint(end));
    }
    this.ctx.restore();
  },

  async placeSticker(point) {
    if (!this.ctx) return false;
    const sticker = this.getSelectedSticker();
    if (!sticker) return false;
    if (sticker.kind === "sheet") return this.placeSheetSticker(sticker, point);
    return this.placeTextSticker(sticker.value || "*", point);
  },

  async placeSheetSticker(sticker, point) {
    if (!this.stickerSheetReady) {
      const loaded = await this.ensureStickerSheetLoaded();
      if (!loaded) return this.placeTextSticker("*", point);
    }
    if (!this.ctx || !this.stickerSheetImage) return false;
    const index = clamp(sticker.sheetIndex, 0, STICKER_SHEET.cols * STICKER_SHEET.rows - 1);
    const sx = (index % STICKER_SHEET.cols) * STICKER_SHEET.cell;
    const sy = Math.floor(index / STICKER_SHEET.cols) * STICKER_SHEET.cell;
    const size = Math.max(28, Math.round(this.stickerSize * 1.15));
    const x = point.x - size / 2;
    const y = point.y - size / 2;
    this.ctx.save();
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.globalAlpha = this.brushOpacity;
    this.ctx.shadowBlur = Math.max(4, this.brushSize * 0.5);
    this.ctx.shadowColor = "rgba(55,37,94,0.28)";
    this.ctx.drawImage(this.stickerSheetImage, sx, sy, STICKER_SHEET.cell, STICKER_SHEET.cell, x, y, size, size);
    if (this.mirrorEnabled) {
      const mirror = this.getMirrorPoint(point);
      this.ctx.drawImage(this.stickerSheetImage, sx, sy, STICKER_SHEET.cell, STICKER_SHEET.cell, mirror.x - size / 2, mirror.y - size / 2, size, size);
    }
    this.ctx.restore();
    return true;
  },

  placeTextSticker(text, point) {
    if (!this.ctx) return false;
    this.ctx.save();
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.font = `${this.stickerSize}px "Segoe UI", sans-serif`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.shadowBlur = 8;
    this.ctx.shadowColor = "rgba(60,45,110,0.22)";
    this.ctx.globalAlpha = this.brushOpacity;
    this.ctx.fillStyle = this.selectedColor;
    this.ctx.fillText(String(text || "*"), point.x, point.y);
    if (this.mirrorEnabled) {
      const mirror = this.getMirrorPoint(point);
      this.ctx.fillText(String(text || "*"), mirror.x, mirror.y);
    }
    this.ctx.restore();
    return true;
  },

  updateRegionColors() {
    document.querySelectorAll("#coloring-svg-root .coloring-region").forEach((element) => {
      const regionId = element.dataset.regionId;
      if (!regionId) return;
      const region = (this.currentDesign?.regions || []).find((entry) => entry.id === regionId);
      if (!region) return;
      const color = this.currentColors[regionId] || region.defaultColor || "#f0f0f0";
      if (region.isStroke) element.setAttribute("stroke", color);
      else element.setAttribute("fill", color);
    });
  },

  captureState() {
    return { colors: { ...this.currentColors }, drawing: this.canvas ? this.canvas.toDataURL("image/png") : "" };
  },

  computeStateKey(state) {
    return `${JSON.stringify(state.colors)}|${state.drawing.length}:${state.drawing.slice(-24)}`;
  },

  resetHistoryWithCurrentState() {
    const current = this.captureState();
    const key = this.computeStateKey(current);
    this.history = [{ ...current, _key: key }];
    this.redoStack = [];
    this.lastStateKey = key;
    this.refreshUndoRedoButtons();
  },

  saveState() {
    const current = this.captureState();
    const key = this.computeStateKey(current);
    if (key === this.lastStateKey) return;
    this.history.push({ ...current, _key: key });
    if (this.history.length > 80) this.history.shift();
    this.redoStack = [];
    this.lastStateKey = key;
    this.refreshUndoRedoButtons();
  },

  applyState(state) {
    if (!state) return;
    this.currentColors = { ...state.colors };
    this.updateRegionColors();
    this.restoreDrawingFromDataURL(state.drawing);
    this.lastStateKey = state._key || this.computeStateKey(state);
  },

  restoreDrawingFromDataURL(url) {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (!url) return;
    const image = new Image();
    image.onload = () => {
      if (!this.ctx || !this.canvas) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
    };
    image.src = url;
  },

  applySavedState(saved, done) {
    if (!saved) {
      if (done) done();
      return;
    }
    const regionIds = new Set((this.currentDesign?.regions || []).map((region) => region.id));
    if (saved.colors && typeof saved.colors === "object") {
      Object.entries(saved.colors).forEach(([id, color]) => {
        if (regionIds.has(id)) this.currentColors[id] = color;
      });
      this.updateRegionColors();
    }
    if (saved.drawing && this.ctx && this.canvas) {
      const image = new Image();
      image.onload = () => {
        if (!this.ctx || !this.canvas) {
          if (done) done();
          return;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
        if (done) done();
      };
      image.onerror = () => {
        if (done) done();
      };
      image.src = saved.drawing;
      return;
    }
    if (done) done();
  },

  undo() {
    if (this.history.length <= 1) return;
    const current = this.history.pop();
    this.redoStack.push(current);
    this.applyState(this.history[this.history.length - 1]);
    this.refreshUndoRedoButtons();
  },

  redo() {
    if (!this.redoStack.length) return;
    const state = this.redoStack.pop();
    this.history.push(state);
    this.applyState(state);
    this.refreshUndoRedoButtons();
  },

  refreshUndoRedoButtons() {
    const undoBtn = document.getElementById("undo-btn");
    const redoBtn = document.getElementById("redo-btn");
    if (undoBtn) undoBtn.disabled = this.history.length <= 1;
    if (redoBtn) redoBtn.disabled = this.redoStack.length === 0;
  },

  clearArtwork() {
    if (!this.currentDesign) return;
    (this.currentDesign.regions || []).forEach((region) => {
      this.currentColors[region.id] = region.defaultColor || "#f0f0f0";
    });
    this.updateRegionColors();
    if (this.ctx && this.canvas) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.resetHistoryWithCurrentState();
  },

  saveArtwork() {
    if (!this.currentDesign || !this.canvas) return;
    const gallery = Storage.getGallery(App.currentProfile);
    const item = {
      id: Date.now(),
      designId: this.currentDesign.id,
      designName: this.currentDesign.name || "도안",
      designMeta: this.serializeDesignMeta(this.currentDesign),
      sheetIndex: Number.isInteger(this.currentDesign.sheetIndex) ? this.currentDesign.sheetIndex : null,
      colors: { ...this.currentColors },
      drawing: this.canvas.toDataURL("image/png"),
      date: new Date().toISOString(),
    };
    gallery.push(item);
    while (gallery.length > 180) gallery.shift();
    Storage.saveGallery(App.currentProfile, gallery);

    const progress = Storage.getProgress(App.currentProfile);
    progress.coloringComplete = (progress.coloringComplete || 0) + 1;
    Storage.saveProgress(App.currentProfile, progress);
    if (window.Reward && typeof Reward.addXP === "function") {
      Reward.addXP(Profile.getCurrent()?.xpPerGame || 8);
    }

    if (window.Reward && typeof Reward.addStars === "function") {
      Reward.addStars(Profile.getCurrent()?.starsPerCorrect || 2);
      Reward.checkBadges();
    }
    if (window.Daily && typeof Daily.updateMissionProgress === "function") {
      Daily.updateMissionProgress("coloring");
    }
    this.showSaveToast();
  },

  showSaveToast() {
    this.showToast("갤러리에 저장했어요!");
  },

  showToast(message) {
    const toast = document.createElement("div");
    toast.className = "save-toast";
    toast.textContent = message || "";
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 220);
    }, 1300);
  },
};

if (typeof window !== "undefined") {
  window.Coloring = Coloring;
}
