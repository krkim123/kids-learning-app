// SVG Coloring — pick a design, choose colors, tap regions to fill

const Coloring = {
  currentDesign: null,
  currentColors: {},  // { regionId: '#color' }
  selectedColor: COLORING_PALETTE[0],

  showDesigns() {
    const screen = document.getElementById('screen-coloring');
    const gallery = Storage.getGallery(App.currentProfile);

    screen.innerHTML = `
      <div class="coloring-select-container">
        <div class="learn-header">
          <button class="btn-back" onclick="App.navigate('home')">
            <span class="back-arrow">&larr;</span>
          </button>
          <h2 class="learn-title">🎨 색칠하기</h2>
          <span></span>
        </div>

        <div class="coloring-designs-grid">
          ${COLORING_DESIGNS.map(d => `
            <button class="coloring-design-card" onclick="Coloring.start('${d.id}')">
              <div class="design-emoji">${d.emoji}</div>
              <div class="design-name">${d.name}</div>
              ${gallery.some(g => g.designId === d.id) ? '<span class="design-done-badge">✓</span>' : ''}
            </button>
          `).join('')}
        </div>

        ${gallery.length > 0 ? `
          <div class="gallery-section">
            <h3 class="reward-section-title">🖼️ 내 작품 (${gallery.length})</h3>
            <div class="gallery-grid">
              ${gallery.slice(-6).map((g, i) => {
                const design = COLORING_DESIGNS.find(d => d.id === g.designId);
                return `
                  <div class="gallery-item">
                    <div class="gallery-mini-svg">${design ? design.emoji : '🎨'}</div>
                    <div class="gallery-date">${g.date ? g.date.slice(5) : ''}</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
    App.showScreen('coloring');
  },

  start(designId) {
    const design = COLORING_DESIGNS.find(d => d.id === designId);
    if (!design) return;
    this.currentDesign = design;
    this.currentColors = {};
    design.regions.forEach(r => { this.currentColors[r.id] = r.defaultColor; });
    this.selectedColor = COLORING_PALETTE[0];
    this.render();
  },

  render() {
    const design = this.currentDesign;
    const screen = document.getElementById('screen-coloring');

    screen.innerHTML = `
      <div class="coloring-container">
        <div class="learn-header">
          <button class="btn-back" onclick="Coloring.showDesigns()">
            <span class="back-arrow">&larr;</span>
          </button>
          <h2 class="learn-title">${design.emoji} ${design.name}</h2>
          <span></span>
        </div>

        <div class="coloring-canvas-area">
          <svg viewBox="0 0 ${design.width} ${design.height}" class="coloring-svg" id="coloring-svg">
            ${design.regions.map(r => {
              if (r.isStroke) {
                return `<path d="${r.path}" fill="none" stroke="${this.currentColors[r.id]}"
                         stroke-width="4" stroke-linecap="round"
                         data-region="${r.id}" onclick="Coloring.fillRegion('${r.id}')"/>`;
              }
              return `<path d="${r.path}" fill="${this.currentColors[r.id]}"
                       stroke="#999" stroke-width="2"
                       data-region="${r.id}" onclick="Coloring.fillRegion('${r.id}')"
                       class="coloring-region"/>`;
            }).join('')}
          </svg>
        </div>

        <div class="coloring-palette" id="coloring-palette">
          ${COLORING_PALETTE.map(c => `
            <button class="palette-color ${this.selectedColor === c ? 'selected' : ''}"
                    style="background:${c};${c === '#FFFFFF' ? 'border:2px solid #ddd' : ''}"
                    onclick="Coloring.selectColor('${c}')">
            </button>
          `).join('')}
        </div>

        <div class="coloring-actions">
          <button class="btn-secondary" onclick="Coloring.resetColors()">다시 칠하기 🗑️</button>
          <button class="btn-primary" onclick="Coloring.save()">완성! ✨</button>
        </div>
      </div>
    `;
  },

  selectColor(color) {
    this.selectedColor = color;
    document.querySelectorAll('.palette-color').forEach(el => {
      el.classList.toggle('selected', el.style.background === color || el.style.backgroundColor === color);
    });
    // Re-render palette selection indicators
    const palette = document.getElementById('coloring-palette');
    if (palette) {
      palette.querySelectorAll('.palette-color').forEach(btn => {
        const btnColor = btn.style.background || btn.style.backgroundColor;
        btn.classList.toggle('selected', btnColor.includes(color.toLowerCase()) || btn.getAttribute('onclick').includes(color));
      });
    }
    // Simple approach: just re-render
    this.render();
  },

  fillRegion(regionId) {
    this.currentColors[regionId] = this.selectedColor;
    const path = document.querySelector(`[data-region="${regionId}"]`);
    if (path) {
      const region = this.currentDesign.regions.find(r => r.id === regionId);
      if (region && region.isStroke) {
        path.setAttribute('stroke', this.selectedColor);
      } else {
        path.setAttribute('fill', this.selectedColor);
      }
      // Little animation
      path.style.transition = 'transform 0.2s';
      path.style.transform = 'scale(1.05)';
      setTimeout(() => { path.style.transform = ''; }, 200);
    }
    SFX.play('flip');
  },

  resetColors() {
    this.currentDesign.regions.forEach(r => {
      this.currentColors[r.id] = r.defaultColor;
    });
    this.render();
  },

  save() {
    const gallery = Storage.getGallery(App.currentProfile);
    gallery.push({
      designId: this.currentDesign.id,
      colors: { ...this.currentColors },
      date: Storage.today(),
    });
    Storage.saveGallery(App.currentProfile, gallery);

    // Update progress
    const progress = Storage.getProgress(App.currentProfile);
    progress.coloringComplete = (progress.coloringComplete || 0) + 1;
    progress.xp = (progress.xp || 0) + Profile.getCurrent().xpPerGame;
    Storage.saveProgress(App.currentProfile, progress);
    Reward.addStars(3);
    Daily.updateMissionProgress('coloring');

    // Show completion popup
    SFX.play('celebrate');
    const popup = document.createElement('div');
    popup.className = 'popup-overlay';
    popup.innerHTML = `
      <div class="popup-content">
        <div class="popup-sticker">${this.currentDesign.emoji}</div>
        <div class="popup-badge-name">작품 완성!</div>
        <div class="popup-text">${this.currentDesign.name} 색칠을 완성했어요!</div>
        <button class="btn-primary" onclick="this.closest('.popup-overlay').remove(); Coloring.showDesigns()">좋아요! 🎨</button>
      </div>
    `;
    document.body.appendChild(popup);
  },
};
