const DumpMigration = {
  manifest: null,
  manifestError: null,

  normalizePath(path) {
    return (path || '').replace(/\\/g, '/');
  },

  escapeJsString(value) {
    return String(value ?? '')
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\r/g, '\\r')
      .replace(/\n/g, '\\n');
  },

  escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  async loadManifest() {
    if (this.manifest) return;

    if (window.__DUMP_MANIFEST__) {
      this.manifest = window.__DUMP_MANIFEST__;
      this.manifestError = null;
      return;
    }

    let lastError = null;
    const candidates = [
      'reference_import/dump_manifest.json',
      './reference_import/dump_manifest.json',
      new URL('reference_import/dump_manifest.json', window.location.href).toString(),
    ];

    for (const url of [...new Set(candidates)]) {
      try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`manifest HTTP ${response.status} at ${url}`);
        }
        this.manifest = await response.json();
        this.manifestError = null;
        window.__DUMP_MANIFEST__ = this.manifest;
        return;
      } catch (error) {
        lastError = error;
      }
    }

    this.manifestError = lastError || new Error('manifest fetch failed');
    console.error('[DumpMigration] Failed to load manifest:', this.manifestError);
  },

  getScreen() {
    return document.getElementById('screen-reference');
  },

  async showHub() {
    const screen = this.getScreen();
    if (!screen) return;

    screen.innerHTML = `
      <div class="dump-shell">
        <div class="dump-topbar">
          <button class="dump-btn" onclick="App.tabPlay()">Play</button>
          <div class="dump-title">Migrated Content</div>
          <span></span>
        </div>
        <div class="dump-loading">Loading migrated assets...</div>
      </div>
    `;

    await this.loadManifest();

    if (this.manifestError || !this.manifest) {
      const msg = this.escapeHtml(this.manifestError?.message || 'Unknown error');
      screen.innerHTML = `
        <div class="dump-shell">
          <div class="dump-topbar">
            <button class="dump-btn" onclick="App.tabPlay()">Play</button>
            <div class="dump-title">Migrated Content</div>
            <span></span>
          </div>
          <div class="dump-error">
            <h3>Manifest Load Failed</h3>
            <p>${msg}</p>
            <button class="dump-btn dump-btn-primary" onclick="DumpMigration.retryHub()">Retry</button>
          </div>
        </div>
      `;
      return;
    }

    const libCount = Array.isArray(this.manifest.lib) ? this.manifest.lib.length : 0;

    screen.innerHTML = `
      <div class="dump-shell">
        <div class="dump-topbar">
          <button class="dump-btn" onclick="App.tabPlay()">Play</button>
          <div class="dump-title">Migrated Content</div>
          <button class="dump-btn" onclick="DumpMigration.openRawDump()">Raw Dump</button>
        </div>

        <div class="dump-hub-grid">
          <button class="dump-card dump-card-main" onclick="DumpMigration.openMathModule()">
            <div class="dump-card-badge">RUN</div>
            <div class="dump-card-title">MATH Module</div>
            <div class="dump-card-desc">Launch migrated math module</div>
          </button>

          <button class="dump-card" onclick="DumpMigration.showLibPacks()">
            <div class="dump-card-badge">PACKS</div>
            <div class="dump-card-title">LIB Packs</div>
            <div class="dump-card-desc">${libCount} packs (images/audio)</div>
          </button>
        </div>
      </div>
    `;
  },

  retryHub() {
    this.manifest = null;
    this.manifestError = null;
    this.showHub();
  },

  async openMathModule() {
    if (!this.manifest) {
      await this.loadManifest();
      if (!this.manifest) return;
    }

    const launcher = 'reference_import/math_launcher.html';
    const fallback = this.normalizePath(
      this.manifest.math?.entry || this.manifest.math?.fallback || ''
    );
    this.renderFrame('MATH Module', launcher, fallback);
  },

  renderFrame(title, src, altSrc = '') {
    const screen = this.getScreen();
    if (!screen) return;

    const safeTitleHtml = this.escapeHtml(title);
    const safeTitleJs = this.escapeJsString(title);
    const safeSrcHtml = this.escapeHtml(src);
    const safeSrcJs = this.escapeJsString(src);
    const safeAltJs = this.escapeJsString(altSrc || '');
    const altBtn = altSrc
      ? `<button class="dump-btn" onclick="DumpMigration.renderFrame('${safeTitleJs}','${safeAltJs}')">Fallback</button>`
      : '<span></span>';

    screen.innerHTML = `
      <div class="dump-shell dump-shell-frame">
        <div class="dump-topbar">
          <button class="dump-btn" onclick="DumpMigration.showHub()">Hub</button>
          <div class="dump-title">${safeTitleHtml}</div>
          <div class="dump-topbar-actions">
            ${altBtn}
            <button class="dump-btn" onclick="window.open('${safeSrcJs}','_blank')">New Window</button>
          </div>
        </div>
        <div class="dump-frame-wrap">
          <iframe class="dump-frame" src="${safeSrcHtml}" loading="lazy" allowfullscreen></iframe>
        </div>
      </div>
    `;
  },

  async showLibPacks() {
    if (!this.manifest) {
      await this.loadManifest();
      if (!this.manifest) return;
    }

    const packs = Array.isArray(this.manifest.lib) ? this.manifest.lib : [];
    const cards = packs.map((pack) => {
      const thumb = this.normalizePath(pack.first_image || '');
      const audio = this.normalizePath(pack.first_audio || '');
      const packId = this.escapeHtml(pack.id);
      const packJs = this.escapeJsString(pack.id);
      const thumbTag = thumb
        ? `<img src="${this.escapeHtml(thumb)}" alt="LIB ${packId}" class="dump-pack-thumb">`
        : `<div class="dump-pack-thumb dump-pack-empty">No image</div>`;
      const audioTag = audio
        ? `<audio controls preload="none" src="${this.escapeHtml(audio)}"></audio>`
        : '<div class="dump-pack-meta">No audio</div>';

      return `
        <article class="dump-pack-card">
          <div class="dump-pack-head">
            <strong>LIB ${packId}</strong>
            <span>${pack.image_count} images / ${pack.audio_count} audio</span>
          </div>
          ${thumbTag}
          <div class="dump-pack-audio">${audioTag}</div>
          <button class="dump-btn dump-btn-primary" onclick="DumpMigration.showLibPack('${packJs}')">Open</button>
        </article>
      `;
    }).join('');

    const screen = this.getScreen();
    if (!screen) return;

    screen.innerHTML = `
      <div class="dump-shell">
        <div class="dump-topbar">
          <button class="dump-btn" onclick="DumpMigration.showHub()">Hub</button>
          <div class="dump-title">LIB Packs</div>
          <span></span>
        </div>
        <div class="dump-pack-grid">${cards || '<div class="dump-loading">No LIB packs.</div>'}</div>
      </div>
    `;
  },

  async showLibPack(id) {
    if (!this.manifest) {
      await this.loadManifest();
      if (!this.manifest) return;
    }

    const pack = (this.manifest.lib || []).find((item) => String(item.id) === String(id));
    if (!pack) {
      this.showLibPacks();
      return;
    }

    const images = (pack.images || []).map((p) => this.normalizePath(p));
    const audios = (pack.audios || []).map((p) => this.normalizePath(p));

    const imageCards = images.map((src, index) => `
      <figure class="dump-image-card">
        <img src="${this.escapeHtml(src)}" alt="LIB ${this.escapeHtml(pack.id)} image ${index + 1}">
        <figcaption>${index + 1}</figcaption>
      </figure>
    `).join('');

    const audioRows = audios.map((src, index) => `
      <div class="dump-audio-row">
        <span>Audio ${index + 1}</span>
        <audio controls preload="none" src="${this.escapeHtml(src)}"></audio>
      </div>
    `).join('');

    const screen = this.getScreen();
    if (!screen) return;

    screen.innerHTML = `
      <div class="dump-shell">
        <div class="dump-topbar">
          <button class="dump-btn" onclick="DumpMigration.showLibPacks()">List</button>
          <div class="dump-title">LIB ${this.escapeHtml(pack.id)}</div>
          <span></span>
        </div>
        <div class="dump-pack-detail">
          <div class="dump-section">
            <h3>Audio</h3>
            ${audioRows || '<div class="dump-pack-meta">No audio files.</div>'}
          </div>
          <div class="dump-section">
            <h3>Images</h3>
            <div class="dump-image-grid">${imageCards || '<div class="dump-pack-meta">No image files.</div>'}</div>
          </div>
        </div>
      </div>
    `;
  },

  openRawDump() {
    window.open('reference_import/raw_dump/', '_blank');
  },
};

window.DumpMigration = DumpMigration;
