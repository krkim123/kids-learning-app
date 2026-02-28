// Attendance, daily missions, and streak tracking

const Daily = {
  // Check attendance on app start
  checkAttendance() {
    if (!App.currentProfile) return;
    const att = Storage.getAttendance(App.currentProfile);
    const today = Storage.today();

    if (att.lastDate !== today) {
      // New day!
      if (!att.dates.includes(today)) {
        att.dates.push(today);
      }

      // Calculate streak
      const yesterday = this._dateOffset(today, -1);
      if (att.lastDate === yesterday || att.dates.length === 1) {
        att.streak = (att.streak || 0) + 1;
      } else if (att.lastDate !== today) {
        att.streak = 1;
      }

      att.lastDate = today;
      att.stampShownToday = false;
      Storage.saveAttendance(App.currentProfile, att);

      // Generate new daily missions
      this.generateMissions();

      // Show attendance stamp popup
      setTimeout(() => this.showStampPopup(att), 800);
    }

    // Check badge for streak
    Reward.checkBadges();
  },

  _dateOffset(dateStr, days) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  },

  showStampPopup(att) {
    if (att.stampShownToday) return;
    att.stampShownToday = true;
    Storage.saveAttendance(App.currentProfile, att);

    const profile = Profile.getCurrent();
    let bonusText = '';
    if (att.streak === 3) bonusText = '🎉 3일 연속! 보너스 스티커!';
    else if (att.streak === 7) bonusText = '🏆 7일 연속! 특별 배지!';
    else if (att.streak > 1) bonusText = `🔥 ${att.streak}일 연속 학습!`;

    // Grant bonus for milestones
    if (att.streak === 3 || att.streak === 7) {
      const progress = Storage.getProgress(App.currentProfile);
      progress.stars += 5;
      const sticker = Reward.grantRandomSticker(progress);
      Storage.saveProgress(App.currentProfile, progress);
    }

    const popup = document.createElement('div');
    popup.className = 'popup-overlay';
    popup.innerHTML = `
      <div class="popup-content stamp-popup">
        <div class="stamp-icon">📅</div>
        <div class="stamp-title">출석 도장!</div>
        <div class="stamp-text">${profile.name}, 오늘도 왔구나!</div>
        ${bonusText ? `<div class="stamp-bonus">${bonusText}</div>` : ''}
        <div class="stamp-streak">🔥 연속 ${att.streak}일</div>
        <button class="btn-primary" onclick="this.closest('.popup-overlay').remove()">시작하기! ✨</button>
      </div>
    `;
    document.body.appendChild(popup);
    setTimeout(() => { if (popup.parentNode) popup.remove(); }, 8000);
  },

  // Generate 3 daily missions
  generateMissions() {
    const today = Storage.today();
    const existing = Storage.getMissions(App.currentProfile);
    if (existing.date === today) return; // Already generated today

    const profile = Profile.getCurrent();
    // Pick 3 random mission types
    const templates = [...MISSION_TEMPLATES];
    const shuffled = templates.sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, 3);

    const missions = picked.map(t => {
      // Pick a count based on profile difficulty
      const countIdx = profile.ageGroup === 'toddler' ? 0 : (profile.ageGroup === 'child' ? 1 : 2);
      const target = t.counts[Math.min(countIdx, t.counts.length - 1)];
      return {
        id: t.id,
        text: t.text.replace('{n}', target),
        icon: t.icon,
        type: t.type,
        category: t.category || null,
        target,
        current: 0,
        done: false,
      };
    });

    Storage.saveMissions(App.currentProfile, {
      date: today,
      missions,
      allComplete: false,
    });
  },

  // Update mission progress
  updateMissionProgress(type, category) {
    const data = Storage.getMissions(App.currentProfile);
    if (!data || !data.missions) return;

    let updated = false;
    data.missions.forEach(m => {
      if (m.done) return;
      if (m.type === type && (!m.category || m.category === category)) {
        m.current = Math.min(m.current + 1, m.target);
        if (m.current >= m.target) {
          m.done = true;
          // Bonus stars for mission completion
          Reward.addStars(3);
        }
        updated = true;
      }
    });

    if (updated) {
      // Check all complete
      if (data.missions.every(m => m.done) && !data.allComplete) {
        data.allComplete = true;
        Reward.addStars(10);
        this.showAllMissionsCompletePopup();
      }
      Storage.saveMissions(App.currentProfile, data);
    }
  },

  showAllMissionsCompletePopup() {
    const popup = document.createElement('div');
    popup.className = 'popup-overlay';
    popup.innerHTML = `
      <div class="popup-content">
        <div class="popup-sticker">🎯</div>
        <div class="popup-badge-name">일일 미션 완료!</div>
        <div class="popup-text">오늘의 미션을 모두 완료했어요! ⭐+10</div>
        <button class="btn-primary" onclick="this.closest('.popup-overlay').remove()">대단해! 🎉</button>
      </div>
    `;
    document.body.appendChild(popup);
    SFX.play('celebrate');
  },

  // Show attendance page
  showAttendancePage() {
    const att = Storage.getAttendance(App.currentProfile);
    const missions = Storage.getMissions(App.currentProfile);
    const profile = Profile.getCurrent();
    const screen = document.getElementById('screen-attendance');

    // Build calendar for current month
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthNames = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

    let calendarHTML = '<div class="cal-header-row"><span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span></div>';
    calendarHTML += '<div class="cal-grid">';
    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) calendarHTML += '<span class="cal-empty"></span>';
    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const isToday = dateStr === Storage.today();
      const attended = att.dates.includes(dateStr);
      calendarHTML += `
        <span class="cal-day ${isToday ? 'today' : ''} ${attended ? 'attended' : ''}">
          ${d}
          ${attended ? '<span class="cal-star">⭐</span>' : ''}
        </span>
      `;
    }
    calendarHTML += '</div>';

    // Missions
    const missionHTML = (missions && missions.missions) ? missions.missions.map(m => `
      <div class="mission-card ${m.done ? 'done' : ''}">
        <span class="mission-icon">${m.icon}</span>
        <div class="mission-info">
          <div class="mission-text">${m.text}</div>
          <div class="mission-progress-bar">
            <div class="mission-progress-fill" style="width:${Math.round(m.current/m.target*100)}%"></div>
          </div>
        </div>
        <span class="mission-status">${m.done ? '✅' : `${m.current}/${m.target}`}</span>
      </div>
    `).join('') : '<div class="mission-empty">오늘의 미션이 아직 없어요</div>';

    screen.innerHTML = `
      <div class="attendance-container">
        <div class="learn-header">
          <button class="btn-back" onclick="App.navigate('home')">
            <span class="back-arrow">&larr;</span>
          </button>
          <h2 class="learn-title">출석부 & 미션</h2>
          <span></span>
        </div>

        <!-- Streak -->
        <div class="streak-banner">
          <span class="streak-fire">🔥</span>
          <span class="streak-count">${att.streak || 0}일 연속 학습!</span>
          <span class="streak-fire">🔥</span>
        </div>

        <!-- Calendar -->
        <div class="reward-section">
          <h3 class="reward-section-title">📅 ${monthNames[month]} 출석부</h3>
          <div class="calendar-container">
            ${calendarHTML}
          </div>
          <div class="attendance-summary">
            이번 달 출석: ${att.dates.filter(d => d.startsWith(`${year}-${String(month+1).padStart(2,'0')}`)).length}일
          </div>
        </div>

        <!-- Daily Missions -->
        <div class="reward-section">
          <h3 class="reward-section-title">🎯 오늘의 미션</h3>
          <div class="missions-list">
            ${missionHTML}
          </div>
          ${missions && missions.allComplete ? '<div class="missions-complete-banner">🎉 오늘의 미션 완료! 🎉</div>' : ''}
        </div>
      </div>
    `;
    App.showScreen('attendance');
  },
};
