const DumpMigration = {
  manifest: null,
  manifestError: null,
  rufflePromise: null,

  normalizePath(path) {
    return (path || '').replace(/\\/g, '/');
  },

  basename(path) {
    const clean = this.normalizePath(path || '');
    const parts = clean.split('/');
    return parts[parts.length - 1] || clean;
  },

  isAudioPath(path) {
    return /\.(mp3|wav|ogg|m4a)$/i.test(path || '');
  },

  parseTrailingNumber(name) {
    const m = String(name || '').match(/(\d+)(?=\.swf$)/i);
    return m ? Number(m[1]) : null;
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

  resolveRelativePath(baseDir, relativePath) {
    const base = this.normalizePath(baseDir || '');
    const relative = this.normalizePath(relativePath || '').trim();
    if (!relative) return '';
    if (/^(?:[a-z]+:)?\/\//i.test(relative) || relative.startsWith('/')) return relative;

    const baseParts = base.split('/').filter(Boolean);
    const relParts = relative.split('/').filter(Boolean);
    const stack = [...baseParts];

    relParts.forEach((part) => {
      if (part === '.') return;
      if (part === '..') {
        if (stack.length > 0) stack.pop();
        return;
      }
      stack.push(part);
    });

    return stack.join('/');
  },

  getSciPackRoot(xmlPath) {
    const clean = this.normalizePath(xmlPath || '').split('#')[0].split('?')[0];
    const parts = clean.split('/');
    if (parts.length >= 2 && parts[parts.length - 2].toLowerCase() === 'xml') {
      return parts.slice(0, -2).join('/');
    }
    return parts.slice(0, -1).join('/');
  },

  resolveSciAssetPath(xmlPath, rawPath) {
    const target = this.normalizePath(rawPath || '').trim();
    if (!target) return '';
    if (/^(?:[a-z]+:)?\/\//i.test(target) || target.startsWith('/')) return target;

    const xmlDir = this.normalizePath(xmlPath || '').replace(/\/[^/]*$/, '');
    if (target.startsWith('./') || target.startsWith('../')) {
      return this.resolveRelativePath(xmlDir, target);
    }

    const packRoot = this.getSciPackRoot(xmlPath);
    return this.resolveRelativePath(packRoot, target);
  },

  async parseSciXml(xmlPath) {
    const response = await fetch(xmlPath, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`XML HTTP ${response.status}`);
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'application/xml');
    if (doc.querySelector('parsererror')) {
      throw new Error('XML parse failed');
    }

    const swf = Array.from(doc.querySelectorAll('contents > swf'))
      .map((node) => (node.textContent || '').trim())
      .filter(Boolean)
      .map((p) => this.resolveSciAssetPath(xmlPath, p));

    const soundKeys = ['main', 'play', 'fanfare', 'fail', 'wa'];
    const sounds = soundKeys
      .map((key) => {
        const node = doc.querySelector(`sound > ${key}`);
        const path = (node?.textContent || '').trim();
        if (!path) return null;
        return {
          key,
          path: this.resolveSciAssetPath(xmlPath, path),
        };
      })
      .filter(Boolean);

    return { swf, sounds };
  },

  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`script load failed: ${src}`));
      document.head.appendChild(script);
    });
  },

  async ensureRuffle() {
    if (window.RufflePlayer?.newest) return;
    if (this.rufflePromise) {
      await this.rufflePromise;
      return;
    }

    const sources = [
      'reference_import/vendor/ruffle/ruffle.js',
      'https://unpkg.com/@ruffle-rs/ruffle',
      'https://cdn.jsdelivr.net/npm/@ruffle-rs/ruffle',
    ];

    this.rufflePromise = (async () => {
      let lastError = null;
      for (const src of sources) {
        try {
          await this.loadScript(src);
          if (window.RufflePlayer?.newest) return;
        } catch (error) {
          lastError = error;
        }
      }
      throw lastError || new Error('Ruffle load failed');
    })();

    await this.rufflePromise;
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
    const uniqueCandidates = [...new Set(candidates)];

    for (const url of uniqueCandidates) {
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
    const sciCount = Array.isArray(this.manifest.sci) ? this.manifest.sci.length : 0;

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

          <button class="dump-card" onclick="DumpMigration.showSciPacks()">
            <div class="dump-card-badge">PACKS</div>
            <div class="dump-card-title">SCI Packs</div>
            <div class="dump-card-desc">${sciCount} packs (XML + SWF + audio)</div>
          </button>
        </div>
      </div>
    `;
  },

  retryHub() {
    this.manifest = null;
    this.manifestError = null;
    this.rufflePromise = null;
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

  async showSciPacks() {
    if (!this.manifest) {
      await this.loadManifest();
      if (!this.manifest) return;
    }

    const packs = Array.isArray(this.manifest.sci) ? this.manifest.sci : [];
    const cards = packs.map((pack) => {
      const audio = this.normalizePath(pack.first_audio || '');
      const packId = this.escapeHtml(pack.id);
      const packJs = this.escapeJsString(pack.id);

      return `
        <article class="dump-pack-card">
          <div class="dump-pack-head">
            <strong>SCI ${packId}</strong>
            <span>${pack.content_count} assets / ${pack.xml_count} XML / ${pack.swf_count || 0} SWF</span>
          </div>
          <div class="dump-pack-meta">Primary XML: ${this.escapeHtml(this.basename(pack.first_xml || '-') || '-')}</div>
          <div class="dump-pack-audio">
            ${audio ? `<audio controls preload="none" src="${this.escapeHtml(audio)}"></audio>` : '<div class="dump-pack-meta">No audio</div>'}
          </div>
          <div class="dump-pack-meta">XML is parsed into a playable list (not raw XML text).</div>
          <button class="dump-btn dump-btn-primary" onclick="DumpMigration.showSciPack('${packJs}')">Open</button>
        </article>
      `;
    }).join('');

    const screen = this.getScreen();
    if (!screen) return;

    screen.innerHTML = `
      <div class="dump-shell">
        <div class="dump-topbar">
          <button class="dump-btn" onclick="DumpMigration.showHub()">Hub</button>
          <div class="dump-title">SCI Packs</div>
          <span></span>
        </div>
        <div class="dump-pack-grid">${cards || '<div class="dump-loading">No SCI packs.</div>'}</div>
      </div>
    `;
  },

  async showSciPack(id, selectedXml = '') {
    if (!this.manifest) {
      await this.loadManifest();
      if (!this.manifest) return;
    }

    const pack = (this.manifest.sci || []).find((item) => String(item.id) === String(id));
    if (!pack) {
      this.showSciPacks();
      return;
    }

    const contents = (pack.contents || []).map((p) => this.normalizePath(p));
    const xmlFiles = (pack.xml || []).map((p) => this.normalizePath(p));
    const selected = this.normalizePath(selectedXml || xmlFiles[0] || '');
    const swfFromManifest = (pack.swf || []).map((p) => this.normalizePath(p));

    let parsedXml = null;
    let parseError = '';
    if (selected) {
      try {
        parsedXml = await this.parseSciXml(selected);
      } catch (error) {
        parseError = error?.message || 'XML parse failed';
      }
    }

    const packJs = this.escapeJsString(pack.id);
    const xmlRows = xmlFiles.map((src) => {
      const xmlJs = this.escapeJsString(src);
      const isActive = src === selected ? 'active' : '';
      return `
        <button class="dump-chip ${isActive}" onclick="DumpMigration.showSciPack('${packJs}','${xmlJs}')">
          ${this.escapeHtml(this.basename(src) || 'xml')}
        </button>
      `;
    }).join('');

    const manifestSwfByName = new Map(swfFromManifest.map((src) => [this.basename(src), src]));
    const manifestSwfByNameLower = new Map(
      swfFromManifest.map((src) => [this.basename(src).toLowerCase(), src])
    );
    const xmlSwfRefs = parsedXml?.swf || [];
    const missingSwfRefs = [];
    const autoFixedSwfRefs = [];
    const usedSwfPath = new Set();
    const swfList = [];

    if (xmlSwfRefs.length > 0) {
      xmlSwfRefs.forEach((src) => {
        const name = this.basename(src);
        let resolved = '';
        if (swfFromManifest.length > 0) {
          resolved = manifestSwfByName.get(name) || manifestSwfByNameLower.get(name.toLowerCase()) || '';
        } else {
          resolved = src;
        }
        if (!resolved) {
          missingSwfRefs.push(name);
          return;
        }
        if (usedSwfPath.has(resolved)) return;
        usedSwfPath.add(resolved);
        swfList.push(resolved);
      });
    }

    // Auto-fix unresolved XML SWF refs using remaining SWF files from manifest.
    if (missingSwfRefs.length > 0 && swfFromManifest.length > 0) {
      const unresolved = [...missingSwfRefs];
      missingSwfRefs.length = 0;

      unresolved.forEach((missingName) => {
        const candidates = swfFromManifest.filter((src) => !usedSwfPath.has(src));
        if (candidates.length === 0) {
          missingSwfRefs.push(missingName);
          return;
        }

        const missingNum = this.parseTrailingNumber(missingName);
        let picked = '';

        if (missingNum !== null) {
          picked = candidates.find((src) => this.parseTrailingNumber(this.basename(src)) === missingNum) || '';
        }

        if (!picked) {
          picked = candidates.find((src) => /^contents\.swf$/i.test(this.basename(src))) || '';
        }

        if (!picked) {
          picked = candidates[0];
        }

        if (!picked) {
          missingSwfRefs.push(missingName);
          return;
        }

        usedSwfPath.add(picked);
        swfList.push(picked);
        autoFixedSwfRefs.push(`${missingName} -> ${this.basename(picked)}`);
      });
    }

    swfFromManifest.forEach((src) => {
      if (usedSwfPath.has(src)) return;
      usedSwfPath.add(src);
      swfList.push(src);
    });

    const firstPlayableSwf = swfList[0] || '';
    const quickRunBtn = firstPlayableSwf
      ? `<button class="dump-btn dump-btn-primary" onclick="DumpMigration.playSciSwf('${packJs}','${this.escapeJsString(firstPlayableSwf)}','Play 1')">Quick Run</button>`
      : '';

    const swfRows = swfList.map((src, index) => {
      const srcJs = this.escapeJsString(src);
      const label = `Play ${index + 1}`;
      const labelJs = this.escapeJsString(label);
      return `
        <div class="dump-file-row">
          <span>${label} - ${this.escapeHtml(this.basename(src) || 'swf')}</span>
          <div class="dump-file-actions">
            <button class="dump-btn dump-btn-primary" onclick="DumpMigration.playSciSwf('${packJs}','${srcJs}','${labelJs}')">Run</button>
            <a href="${this.escapeHtml(src)}" target="_blank" rel="noopener">Open SWF</a>
          </div>
        </div>
      `;
    }).join('');

    const contentAudio = contents.filter((src) => this.isAudioPath(src));
    const manifestAudioByName = new Map(contentAudio.map((src) => [this.basename(src), src]));
    const manifestAudioByNameLower = new Map(
      contentAudio.map((src) => [this.basename(src).toLowerCase(), src])
    );
    const xmlSoundRefs = parsedXml?.sounds || [];
    const missingSoundRefs = [];
    const parsedSounds = [];

    xmlSoundRefs.forEach((item) => {
      const name = this.basename(item.path);
      let resolved = '';
      if (contentAudio.length > 0) {
        resolved = manifestAudioByName.get(name) || manifestAudioByNameLower.get(name.toLowerCase()) || '';
      } else {
        resolved = item.path;
      }
      if (!resolved) {
        missingSoundRefs.push(`${item.key}:${name}`);
        return;
      }
      parsedSounds.push({ ...item, path: resolved });
    });

    const soundLabel = {
      main: 'Main BGM',
      play: 'Play BGM',
      fanfare: 'Success FX',
      fail: 'Fail FX',
      wa: 'Answer FX',
    };
    const parsedSoundRows = parsedSounds.map((item) => `
      <div class="dump-file-row">
        <span>${this.escapeHtml(soundLabel[item.key] || item.key)} - ${this.escapeHtml(this.basename(item.path) || item.path)}</span>
        <audio controls preload="none" src="${this.escapeHtml(item.path)}"></audio>
      </div>
    `).join('');

    const parsedSoundSet = new Set(parsedSounds.map((item) => item.path));
    const fallbackSoundRows = contentAudio
      .filter((src) => !parsedSoundSet.has(src))
      .map((src, index) => `
        <div class="dump-file-row">
          <span>Extra audio ${index + 1} - ${this.escapeHtml(this.basename(src) || src)}</span>
          <audio controls preload="none" src="${this.escapeHtml(src)}"></audio>
        </div>
      `).join('');

    const rawRows = contents.map((src, index) => {
      const fileName = this.escapeHtml(this.basename(src) || `content-${index + 1}`);
      const isAudio = this.isAudioPath(src);
      return `
        <div class="dump-file-row">
          <span>${fileName}</span>
          ${isAudio
            ? `<audio controls preload="none" src="${this.escapeHtml(src)}"></audio>`
            : `<a href="${this.escapeHtml(src)}" target="_blank" rel="noopener">Open</a>`}
        </div>
      `;
    }).join('');

    const verifyRows = `
      <div class="dump-kv"><span>XML SWF refs</span><strong>${xmlSwfRefs.length}</strong></div>
      <div class="dump-kv"><span>Playable SWF</span><strong>${swfList.length}</strong></div>
      <div class="dump-kv"><span>Auto-fixed SWF refs</span><strong>${autoFixedSwfRefs.length}</strong></div>
      <div class="dump-kv"><span>Missing SWF refs</span><strong>${missingSwfRefs.length}</strong></div>
      <div class="dump-kv"><span>XML sound refs</span><strong>${xmlSoundRefs.length}</strong></div>
      <div class="dump-kv"><span>Mapped sounds</span><strong>${parsedSounds.length}</strong></div>
      <div class="dump-kv"><span>Missing sound refs</span><strong>${missingSoundRefs.length}</strong></div>
    `;

    const missingItems = [
      ...autoFixedSwfRefs.map((item) => `AUTO-FIX: ${item}`),
      ...missingSwfRefs.map((name) => `SWF: ${name}`),
      ...missingSoundRefs.map((name) => `SOUND: ${name}`),
    ];
    const missingList = missingItems.length
      ? `<ul class="dump-warn-list">${missingItems.map((item) => `<li>${this.escapeHtml(item)}</li>`).join('')}</ul>`
      : `<div class="dump-pack-meta">No missing XML references detected.</div>`;

    const parseNotice = parseError
      ? `<div class="dump-pack-meta dump-note">XML parse failed: ${this.escapeHtml(parseError)}. Fallback to manifest list.</div>`
      : (selected ? `<div class="dump-pack-meta dump-note">Parsed XML: ${this.escapeHtml(this.basename(selected) || selected)}</div>` : '');

    const screen = this.getScreen();
    if (!screen) return;

    screen.innerHTML = `
      <div class="dump-shell">
        <div class="dump-topbar">
          <button class="dump-btn" onclick="DumpMigration.showSciPacks()">List</button>
          <div class="dump-title">SCI ${this.escapeHtml(pack.id)}</div>
          <div class="dump-topbar-actions">${quickRunBtn}</div>
        </div>
        <div class="dump-pack-detail">
          <div class="dump-section">
            <h3>XML Select</h3>
            <div class="dump-chip-row">${xmlRows || '<div class="dump-pack-meta">No XML files.</div>'}</div>
            ${parseNotice}
          </div>
          <div class="dump-section">
            <h3>Mapping Verification</h3>
            <div class="dump-verify-grid">${verifyRows}</div>
            ${missingList}
          </div>
          <div class="dump-section">
            <h3>Playable SWF</h3>
            <div class="dump-pack-meta">Only executable SWF files are listed from XML + manifest mapping.</div>
            <div class="dump-file-list">${swfRows || '<div class="dump-pack-meta">No SWF files.</div>'}</div>
          </div>
          <div class="dump-section">
            <h3>Sound</h3>
            <div class="dump-file-list">
              ${parsedSoundRows || ''}
              ${fallbackSoundRows || ''}
              ${(!parsedSoundRows && !fallbackSoundRows) ? '<div class="dump-pack-meta">No audio files.</div>' : ''}
            </div>
          </div>
          <div class="dump-section">
            <h3>Raw Assets</h3>
            <div class="dump-file-list">${rawRows || '<div class="dump-pack-meta">No assets.</div>'}</div>
          </div>
        </div>
      </div>
    `;
  },

  async playSciSwf(packId, swfPath, label = 'SWF Run') {
    const packJs = this.escapeJsString(packId);
    const safePath = this.normalizePath(swfPath || '');
    const safePathHtml = this.escapeHtml(safePath);

    const screen = this.getScreen();
    if (!screen) return;

    screen.innerHTML = `
      <div class="dump-shell dump-shell-frame">
        <div class="dump-topbar">
          <button class="dump-btn" onclick="DumpMigration.showSciPack('${packJs}')">List</button>
          <div class="dump-title">${this.escapeHtml(`SCI ${packId} - ${label}`)}</div>
          <span></span>
        </div>
        <div class="dump-frame-wrap">
          <div id="dump-swf-player" class="dump-player-mount">
            <div class="dump-loading">Preparing SWF player...</div>
          </div>
        </div>
        <div class="dump-pack-meta" style="padding: 0 12px 12px;">
          Source file:
          <a href="${safePathHtml}" target="_blank" rel="noopener">${this.escapeHtml(this.basename(safePath) || safePath)}</a>
        </div>
      </div>
    `;

    const playerRoot = document.getElementById('dump-swf-player');
    if (!playerRoot) return;

    try {
      await this.ensureRuffle();
      if (!window.RufflePlayer?.newest) {
        throw new Error('Ruffle init failed');
      }

      const ruffle = window.RufflePlayer.newest();
      const player = ruffle.createPlayer();
      player.style.width = '100%';
      player.style.height = '100%';
      playerRoot.innerHTML = '';
      playerRoot.appendChild(player);
      player.load({
        url: safePath,
        autoplay: 'on',
        allowScriptAccess: true,
      });
    } catch (error) {
      const message = this.escapeHtml(error?.message || 'SWF playback failed');
      playerRoot.innerHTML = `
        <div class="dump-error">
          <h3>SWF Playback Failed</h3>
          <p>${message}</p>
          <p class="dump-pack-meta">If runtime loading is blocked, open raw SWF directly.</p>
          <a class="dump-btn dump-btn-primary" href="${safePathHtml}" target="_blank" rel="noopener">Open Raw SWF</a>
        </div>
      `;
    }
  },

  openRawDump() {
    window.open('reference_import/raw_dump/', '_blank');
  },
};

window.DumpMigration = DumpMigration;
