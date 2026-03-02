// Attendance, daily missions, and streak tracking

const Daily = {
  checkAttendance() {
    if (!App.currentProfile) return;
    const att = Storage.getAttendance(App.currentProfile);
    const today = Storage.today();
    const missions = Storage.getMissions(App.currentProfile);
    let usedFreezeToday = false;
    let gapDays = 0;
    const previousDate = att.lastDate || null;

    if (att.lastDate !== today) {
      if (!att.dates.includes(today)) att.dates.push(today);

      const yesterday = this._dateOffset(today, -1);
      gapDays = previousDate ? this._dateDiffDays(previousDate, today) : 0;
      if (att.lastDate === yesterday || att.dates.length === 1 || !att.lastDate) {
        att.streak = (att.streak || 0) + 1;
      } else if (gapDays === 2) {
        const freeze = this.getStreakFreezeState();
        if (freeze.count > 0) {
          freeze.count -= 1;
          freeze.usedTotal += 1;
          freeze.updatedAt = today;
          this.saveStreakFreezeState(freeze);
          att.streak = (att.streak || 0) + 1;
          usedFreezeToday = true;
        } else {
          att.streak = 1;
        }
      } else {
        att.streak = 1;
      }

      att.lastDate = today;
      att.stampShownToday = false;
      Storage.saveAttendance(App.currentProfile, att);
      this.maybeGrantComebackReward(previousDate, gapDays, today);

      this.generateMissions();
      setTimeout(() => this.showStampPopup(att), 800);
      if (usedFreezeToday) setTimeout(() => this.showStreakFreezePopup(), 1300);
    }
    if (missions.date !== today || !Array.isArray(missions.missions) || missions.missions.length === 0) {
      this.generateMissions();
    }

    Reward.checkBadges();
  },

  _dateOffset(dateStr, days) {
    const [year, month, day] = String(dateStr).split('-').map((n) => Number(n) || 0);
    const d = new Date(year, Math.max(0, month - 1), day);
    d.setDate(d.getDate() + days);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },

  _dateDiffDays(fromDateStr, toDateStr) {
    const parse = (value) => {
      const [year, month, day] = String(value || '').split('-').map((n) => Number(n) || 0);
      const d = new Date(Date.UTC(year, Math.max(0, month - 1), day));
      return Number.isFinite(d.getTime()) ? d : null;
    };
    const from = parse(fromDateStr);
    const to = parse(toDateStr);
    if (!from || !to) return 0;
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.max(0, Math.round((to.getTime() - from.getTime()) / oneDay));
  },

  _weekKey(dateStr = Storage.today()) {
    const [year, month, day] = String(dateStr || '').split('-').map((n) => Number(n) || 0);
    const date = new Date(Date.UTC(year, Math.max(0, month - 1), day));
    const dayOfWeek = date.getUTCDay(); // 0: 일요일
    const mondayShift = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    date.setUTCDate(date.getUTCDate() + mondayShift);
    const mondayYear = date.getUTCFullYear();
    const jan1 = new Date(Date.UTC(mondayYear, 0, 1));
    const days = Math.floor((date.getTime() - jan1.getTime()) / (24 * 60 * 60 * 1000));
    const week = Math.floor(days / 7) + 1;
    return `${mondayYear}-W${String(week).padStart(2, '0')}`;
  },

  _weeklyGoalMinutes(ageGroup = 'child') {
    if (ageGroup === 'toddler') return 60;
    if (ageGroup === 'older') return 120;
    return 90;
  },

  getStreakFreezeState() {
    const saved = Storage.get(App.currentProfile, 'streakFreeze', null) || {};
    const rawCount = Number(saved.count);
    return {
      count: Number.isFinite(rawCount)
        ? Math.max(0, Math.min(5, Math.round(rawCount)))
        : 1,
      usedTotal: Math.max(0, Number(saved.usedTotal) || 0),
      updatedAt: saved.updatedAt || null,
    };
  },

  saveStreakFreezeState(state) {
    const normalized = {
      count: Math.max(0, Math.min(5, Number(state?.count) || 0)),
      usedTotal: Math.max(0, Number(state?.usedTotal) || 0),
      updatedAt: state?.updatedAt || null,
    };
    Storage.set(App.currentProfile, 'streakFreeze', normalized);
  },

  grantStreakFreeze(amount = 1, maxCount = 3) {
    const freeze = this.getStreakFreezeState();
    const before = freeze.count;
    freeze.count = Math.min(maxCount, freeze.count + Math.max(0, Number(amount) || 0));
    freeze.updatedAt = Storage.today();
    this.saveStreakFreezeState(freeze);
    return Math.max(0, freeze.count - before);
  },

  getDailyChestState() {
    const saved = Storage.get(App.currentProfile, 'dailyChest', null) || {};
    return {
      lastOpenDate: saved.lastOpenDate || null,
      openCount: Math.max(0, Number(saved.openCount) || 0),
    };
  },

  saveDailyChestState(state) {
    Storage.set(App.currentProfile, 'dailyChest', {
      lastOpenDate: state?.lastOpenDate || null,
      openCount: Math.max(0, Number(state?.openCount) || 0),
    });
  },

  getComebackRewardState() {
    const saved = Storage.get(App.currentProfile, 'comebackReward', null) || {};
    return {
      lastRewardDate: saved.lastRewardDate || null,
      totalCount: Math.max(0, Number(saved.totalCount) || 0),
    };
  },

  saveComebackRewardState(state) {
    Storage.set(App.currentProfile, 'comebackReward', {
      lastRewardDate: state?.lastRewardDate || null,
      totalCount: Math.max(0, Number(state?.totalCount) || 0),
    });
  },

  getBenchmarkFeatureState() {
    const profile = Profile.getCurrent();
    const ageGroup = profile?.ageGroup || 'child';
    const weekly = Storage.getWeeklyUsage(App.currentProfile);
    const weeklyMinutes = weekly.reduce((sum, row) => sum + Math.max(0, Number(row.minutes) || 0), 0);
    const weeklyActiveDays = weekly.filter((row) => row.active).length;
    const weeklyGoalMin = this._weeklyGoalMinutes(ageGroup);
    const weeklyConsistencyGoalDays = 5;
    const weeklyPercent = Math.max(0, Math.min(100, Math.round((weeklyMinutes / weeklyGoalMin) * 100)));
    const chest = this.getDailyChestState();
    const freeze = this.getStreakFreezeState();
    const comeback = this.getComebackRewardState();
    const today = Storage.today();
    const weekKey = this._weekKey(today);
    return {
      freezeCount: freeze.count,
      freezeUsedTotal: freeze.usedTotal,
      comebackRewardCount: comeback.totalCount,
      weeklyMinutes,
      weeklyActiveDays,
      weeklyGoalMin,
      weeklyConsistencyGoalDays,
      weeklyPercent,
      weeklyGoalDone: weeklyMinutes >= weeklyGoalMin,
      weeklyConsistencyDone: weeklyActiveDays >= weeklyConsistencyGoalDays,
      chestOpenedToday: chest.lastOpenDate === today,
      chestOpenCount: chest.openCount,
      weekKey,
    };
  },

  maybeGrantComebackReward(previousDate, gapDays, today = Storage.today()) {
    if (!App.currentProfile) return false;
    if (!previousDate) return false;
    if (gapDays < 3) return false;

    const state = this.getComebackRewardState();
    if (state.lastRewardDate === today) return false;

    const stars = 8;
    const xp = 14;
    const freezeBonus = this.grantStreakFreeze(1, 3);
    Reward.addStars(stars);
    Reward.addXP(xp);

    state.lastRewardDate = today;
    state.totalCount += 1;
    this.saveComebackRewardState(state);

    const popup = document.createElement('div');
    popup.className = 'popup-overlay';
    popup.innerHTML = `
      <div class="popup-content">
        <div class="popup-sticker">🎉</div>
        <div class="popup-badge-name">복귀 보너스 지급!</div>
        <div class="popup-text">${gapDays - 1}일 쉬고 돌아와서 ⭐ +${stars} · 경험치 +${xp}${freezeBonus > 0 ? ` · 연속보호권 +${freezeBonus}` : ''}</div>
        <button class="btn-primary" onclick="this.closest('.popup-overlay').remove()">좋아요!</button>
      </div>
    `;
    document.body.appendChild(popup);
    SFX.play('celebrate');
    return true;
  },

  maybeGrantWeeklyGoalReward() {
    if (!App.currentProfile) return false;
    const feature = this.getBenchmarkFeatureState();
    if (!feature.weeklyGoalDone) return false;
    const rewardState = Storage.get(App.currentProfile, 'weeklyGoalReward', { weekKey: null }) || { weekKey: null };
    if (rewardState.weekKey === feature.weekKey) return false;
    rewardState.weekKey = feature.weekKey;
    Storage.set(App.currentProfile, 'weeklyGoalReward', rewardState);
    Reward.addStars(12);
    Reward.addXP(20);

    const popup = document.createElement('div');
    popup.className = 'popup-overlay';
    popup.innerHTML = `
      <div class="popup-content">
        <div class="popup-sticker">🏁</div>
        <div class="popup-badge-name">주간 목표 달성!</div>
        <div class="popup-text">이번 주 학습 목표를 달성했어요! ⭐ +12 · 경험치 +20</div>
        <button class="btn-primary" onclick="this.closest('.popup-overlay').remove()">좋아요!</button>
      </div>
    `;
    document.body.appendChild(popup);
    SFX.play('celebrate');
    return true;
  },

  maybeGrantWeeklyConsistencyReward() {
    if (!App.currentProfile) return false;
    const feature = this.getBenchmarkFeatureState();
    if (!feature.weeklyConsistencyDone) return false;

    const rewardState = Storage.get(App.currentProfile, 'weeklyConsistencyReward', { weekKey: null }) || { weekKey: null };
    if (rewardState.weekKey === feature.weekKey) return false;
    rewardState.weekKey = feature.weekKey;
    Storage.set(App.currentProfile, 'weeklyConsistencyReward', rewardState);

    const stars = 8;
    const xp = 12;
    const freezeBonus = this.grantStreakFreeze(1, 3);
    Reward.addStars(stars);
    Reward.addXP(xp);

    const popup = document.createElement('div');
    popup.className = 'popup-overlay';
    popup.innerHTML = `
      <div class="popup-content">
        <div class="popup-sticker">📅</div>
        <div class="popup-badge-name">주간 출석 챌린지 달성!</div>
        <div class="popup-text">최근 7일 중 ${feature.weeklyActiveDays}일 학습 완료! ⭐ +${stars} · 경험치 +${xp}${freezeBonus > 0 ? ` · 연속보호권 +${freezeBonus}` : ''}</div>
        <button class="btn-primary" onclick="this.closest('.popup-overlay').remove()">좋아요!</button>
      </div>
    `;
    document.body.appendChild(popup);
    SFX.play('celebrate');
    return true;
  },

  claimDailyChest() {
    if (!App.currentProfile) return;
    const today = Storage.today();
    const chest = this.getDailyChestState();
    if (chest.lastOpenDate === today) {
      const popup = document.createElement('div');
      popup.className = 'popup-overlay';
      popup.innerHTML = `
        <div class="popup-content">
          <div class="popup-sticker">📦</div>
          <div class="popup-badge-name">오늘 상자 수령 완료</div>
          <div class="popup-text">내일 다시 열 수 있어요.</div>
          <button class="btn-primary" onclick="this.closest('.popup-overlay').remove()">확인</button>
        </div>
      `;
      document.body.appendChild(popup);
      return;
    }

    const stars = 4 + Math.floor(Math.random() * 7); // 4~10
    const xp = 8 + Math.floor(Math.random() * 9); // 8~16
    const freezeBonus = Math.random() < 0.2 ? this.grantStreakFreeze(1, 3) : 0;

    Reward.addStars(stars);
    Reward.addXP(xp);
    chest.lastOpenDate = today;
    chest.openCount += 1;
    this.saveDailyChestState(chest);

    const popup = document.createElement('div');
    popup.className = 'popup-overlay';
    popup.innerHTML = `
      <div class="popup-content">
        <div class="popup-sticker">🎁</div>
        <div class="popup-badge-name">일일 보물상자 오픈!</div>
        <div class="popup-text">⭐ +${stars} · 경험치 +${xp}${freezeBonus > 0 ? ` · 연속보호권 +${freezeBonus}` : ''}</div>
        <button class="btn-primary" onclick="this.closest('.popup-overlay').remove()">좋아요!</button>
      </div>
    `;
    document.body.appendChild(popup);
    SFX.play('celebrate');

    if (App.currentScreen === 'home') App.showHome();
    if (App.currentScreen === 'attendance') this.showAttendancePage();
    if (App.currentScreen === 'reward' && window.Reward && typeof Reward.showRewardScreen === 'function') {
      Reward.showRewardScreen();
    }
  },

  showStreakFreezePopup() {
    const popup = document.createElement('div');
    popup.className = 'popup-overlay';
    popup.innerHTML = `
      <div class="popup-content">
        <div class="popup-sticker">🧊</div>
        <div class="popup-badge-name">연속보호권 사용됨</div>
        <div class="popup-text">하루 비웠지만 연속 학습 기록을 지켰어요.</div>
        <button class="btn-primary" onclick="this.closest('.popup-overlay').remove()">확인</button>
      </div>
    `;
    document.body.appendChild(popup);
  },

  showStampPopup(att) {
    if (att.stampShownToday) return;
    att.stampShownToday = true;
    Storage.saveAttendance(App.currentProfile, att);

    const profile = Profile.getCurrent();
    const milestoneRewards = { 3: 5, 7: 10, 14: 20, 30: 40 };
    const rewardStars = milestoneRewards[att.streak] || 0;

    let bonusText = '';
    if (rewardStars > 0) bonusText = `🔥 ${att.streak}일 연속! +${rewardStars}별`;
    else if (att.streak > 1) bonusText = `🔥 ${att.streak}일 연속 학습!`;

    if (rewardStars > 0) {
      Reward.addStars(rewardStars);
      const progress = Storage.getProgress(App.currentProfile);
      Reward.grantRandomSticker(progress);
      Storage.saveProgress(App.currentProfile, progress);

      const trackKey = 'streakTrackTier';
      const prevTier = Number(Storage.get(App.currentProfile, trackKey, 0)) || 0;
      if (att.streak > prevTier) Storage.set(App.currentProfile, trackKey, att.streak);
      Reward.checkBadges();
    }

    const popup = document.createElement('div');
    popup.className = 'popup-overlay';
    popup.innerHTML = `
      <div class="popup-content stamp-popup">
        <div class="stamp-icon">📅</div>
        <div class="stamp-title">출석 완료!</div>
        <div class="stamp-text">${profile.name}, 오늘도 반가워요 ✨</div>
        ${bonusText ? `<div class="stamp-bonus">${bonusText}</div>` : ''}
        <div class="stamp-streak">🔥 연속 ${att.streak}일</div>
        <button class="btn-primary" onclick="this.closest('.popup-overlay').remove()">시작하기</button>
      </div>
    `;
    document.body.appendChild(popup);
    setTimeout(() => {
      if (popup.parentNode) popup.remove();
    }, 8000);
  },

  _targetForAge(template, ageGroup) {
    const countIdx = ageGroup === 'toddler' ? 0 : (ageGroup === 'child' ? 1 : 2);
    return template.counts[Math.min(countIdx, template.counts.length - 1)];
  },

  _weightedPick(templates, ageGroup) {
    if (!templates.length) return null;
    const typeWeightsByAge = {
      toddler: {
        learn: 6,
        counting: 5,
        tracing: 5,
        coloring: 4,
        break: 4,
        tower: 2,
        shape3d: 1,
        net3d: 1,
        spatial: 1,
        'iq-program': 1,
        quiz: 2,
        matching: 2,
        'github-pack': 1,
        generated: 1,
      },
      child: {
        learn: 5,
        quiz: 4,
        matching: 4,
        counting: 3,
        tracing: 3,
        coloring: 2,
        break: 3,
        tower: 4,
        shape3d: 4,
        net3d: 4,
        spatial: 4,
        'iq-program': 4,
        'github-pack': 3,
        generated: 3,
      },
      older: {
        learn: 4,
        quiz: 5,
        matching: 3,
        counting: 3,
        tracing: 2,
        coloring: 2,
        break: 3,
        tower: 5,
        shape3d: 5,
        net3d: 5,
        spatial: 5,
        'iq-program': 5,
        'github-pack': 4,
        generated: 4,
      },
    };

    const typeWeights = typeWeightsByAge[ageGroup] || typeWeightsByAge.child;
    const weighted = templates.map((t) => {
      const base = typeWeights[t.type] || 1;
      return { t, w: Math.max(1, base) };
    });
    const total = weighted.reduce((sum, row) => sum + row.w, 0);
    let pick = Math.random() * total;
    for (const row of weighted) {
      pick -= row.w;
      if (pick <= 0) return row.t;
    }
    return weighted[weighted.length - 1].t;
  },

  generateMissions() {
    const today = Storage.today();
    const existing = Storage.getMissions(App.currentProfile);
    if (existing.date === today) return;

    const profile = Profile.getCurrent();
    const ageGroup = profile?.ageGroup || 'child';
    const progress = Storage.getProgress(App.currentProfile);
    const focusCategory =
      (window.App && typeof App.findWeakCategory === 'function')
        ? App.findWeakCategory(progress, ageGroup)
        : 'hangul';

    const templates = MISSION_TEMPLATES.filter((t) => t && Array.isArray(t.counts) && t.counts.length > 0);
    const selected = [];
    const used = new Set();

    // 1) Always try to include one focused learning mission.
    const focusLearningPool = templates.filter((t) => t.type === 'learn' && t.category === focusCategory);
    const focusLearning = this._weightedPick(focusLearningPool, ageGroup);
    if (focusLearning) {
      selected.push(focusLearning);
      used.add(focusLearning.id);
    }

    // 2) Include one practice mission.
    const practiceTypes = new Set(['quiz', 'matching', 'tracing', 'counting', 'tower', 'shape3d', 'net3d', 'spatial', 'iq-program', 'github-pack', 'generated']);
    const practicePool = templates.filter((t) => !used.has(t.id) && practiceTypes.has(t.type));
    const practice = this._weightedPick(practicePool, ageGroup);
    if (practice) {
      selected.push(practice);
      used.add(practice.id);
    }

    // 3) Include one wellness/creative mission when available.
    const wellnessPool = templates.filter((t) => !used.has(t.id) && (t.type === 'break' || t.type === 'coloring'));
    const wellness = this._weightedPick(wellnessPool, ageGroup);
    if (wellness) {
      selected.push(wellness);
      used.add(wellness.id);
    }

    // Fill up to 3 missions with weighted random picks.
    while (selected.length < 3) {
      const remain = templates.filter((t) => !used.has(t.id));
      if (!remain.length) break;
      const picked = this._weightedPick(remain, ageGroup);
      if (!picked) break;
      selected.push(picked);
      used.add(picked.id);
    }

    const missions = selected.slice(0, 3).map((t) => {
      const target = this._targetForAge(t, ageGroup);
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

  updateMissionProgress(type, category) {
    const data = Storage.getMissions(App.currentProfile);
    if (!data || !data.missions) return;

    let updated = false;
    data.missions.forEach((m) => {
      if (m.done) return;
      if (m.type === type && (!m.category || m.category === category)) {
        m.current = Math.min(m.current + 1, m.target);
        if (m.current >= m.target) {
          m.done = true;
          Reward.addStars(3);
        }
        updated = true;
      }
    });

    if (updated) {
      if (data.missions.every((m) => m.done) && !data.allComplete) {
        data.allComplete = true;
        Reward.addStars(10);
        const freezeBonus = this.grantStreakFreeze(1, 3);
        this.showAllMissionsCompletePopup(freezeBonus);
      }
      Storage.saveMissions(App.currentProfile, data);
    }
  },

  showAllMissionsCompletePopup(freezeBonus = 0) {
    const popup = document.createElement('div');
    popup.className = 'popup-overlay';
    popup.innerHTML = `
      <div class="popup-content">
        <div class="popup-sticker">🎁</div>
        <div class="popup-badge-name">오늘 미션 완료!</div>
        <div class="popup-text">오늘의 미션을 모두 끝냈어요! ⭐ +10${freezeBonus > 0 ? ` · 연속보호권 +${freezeBonus}` : ''}</div>
        <button class="btn-primary" onclick="this.closest('.popup-overlay').remove()">좋아요!</button>
      </div>
    `;
    document.body.appendChild(popup);
    SFX.play('celebrate');
  },

  showAttendancePage() {
    const att = Storage.getAttendance(App.currentProfile);
    const missions = Storage.getMissions(App.currentProfile);
    const feature = this.getBenchmarkFeatureState();
    const screen = document.getElementById('screen-attendance');

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    const streakNow = Number(att.streak) || 0;
    const streakMilestones = [3, 7, 14, 30];
    const nextStreak = streakMilestones.find((n) => n > streakNow) || null;
    const streakGuide = nextStreak
      ? `${nextStreak - streakNow}일 뒤 ${nextStreak}일 연속 보상`
      : '최고 연속 보상 구간 달성!';
    const featureSummary = feature.weeklyGoalDone && feature.weeklyConsistencyDone
      ? '이번 주 시간 목표와 출석 챌린지를 모두 달성했어요!'
      : feature.weeklyGoalDone
        ? '이번 주 시간 목표는 달성했어요. 출석 챌린지도 도전해요!'
        : feature.weeklyConsistencyDone
          ? '주간 출석 챌린지는 달성했어요. 시간 목표도 마무리해요!'
          : `이번 주 시간 목표까지 ${Math.max(0, feature.weeklyGoalMin - feature.weeklyMinutes)}분 남았어요`;

    let calendarHTML = '<div class="cal-header-row"><span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span></div>';
    calendarHTML += '<div class="cal-grid">';
    for (let i = 0; i < firstDay; i++) calendarHTML += '<span class="cal-empty"></span>';

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
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

    const missionHTML = (missions && missions.missions)
      ? missions.missions.map((m) => `
        <div class="mission-card ${m.done ? 'done' : ''}">
          <span class="mission-icon">${m.icon}</span>
          <div class="mission-info">
            <div class="mission-text">${m.text}</div>
            <div class="mission-progress-bar">
              <div class="mission-progress-fill" style="width:${Math.round((m.current / m.target) * 100)}%"></div>
            </div>
          </div>
          <span class="mission-status">${m.done ? '✅' : `${m.current}/${m.target}`}</span>
        </div>
      `).join('')
      : '<div class="mission-empty">오늘의 미션이 아직 없어요.</div>';

    screen.innerHTML = `
      <div class="attendance-container">
        <div class="learn-header">
          <button class="btn-back" onclick="App.navigate('home')">
            <span class="back-arrow">&larr;</span>
          </button>
          <h2 class="learn-title">출석부 & 미션</h2>
          <span></span>
        </div>

        <div class="streak-banner">
          <span class="streak-fire">🔥</span>
          <span class="streak-count">${att.streak || 0}일 연속 학습!</span>
          <span class="streak-fire">🔥</span>
        </div>
        <div class="attendance-summary">${streakGuide}</div>

        <div class="reward-section attendance-feature-pack">
          <h3 class="reward-section-title">🧠 인기 앱 기능팩</h3>
          <div class="attendance-feature-grid">
            <div class="attendance-feature-item">
              <span>연속보호권</span>
              <strong>🧊 ${feature.freezeCount}개</strong>
            </div>
            <div class="attendance-feature-item">
              <span>주간 학습 시간</span>
              <strong>${feature.weeklyMinutes}/${feature.weeklyGoalMin}분</strong>
            </div>
            <div class="attendance-feature-item">
              <span>주간 출석</span>
              <strong>${feature.weeklyActiveDays}/${feature.weeklyConsistencyGoalDays}일</strong>
            </div>
            <div class="attendance-feature-item">
              <span>복귀 보너스</span>
              <strong>🎉 ${feature.comebackRewardCount}회</strong>
            </div>
          </div>
          <div class="mission-progress-bar">
            <div class="mission-progress-fill" style="width:${feature.weeklyPercent}%"></div>
          </div>
          <div class="attendance-summary">
            ${featureSummary}
          </div>
          <button class="btn-secondary attendance-chest-btn" onclick="Daily.claimDailyChest()" ${feature.chestOpenedToday ? 'disabled' : ''}>
            ${feature.chestOpenedToday ? '오늘 보물상자 수령 완료' : '🎁 오늘 보물상자 열기'}
          </button>
        </div>

        <div class="reward-section">
          <h3 class="reward-section-title">📅 ${monthNames[month]} 출석부</h3>
          <div class="calendar-container">
            ${calendarHTML}
          </div>
          <div class="attendance-summary">
            이번 달 출석: ${att.dates.filter((d) => d.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)).length}일
          </div>
        </div>

        <div class="reward-section">
          <h3 class="reward-section-title">🎯 오늘의 미션</h3>
          <div class="missions-list">${missionHTML}</div>
          ${missions && missions.allComplete ? '<div class="missions-complete-banner">🎉 오늘의 미션 완료! 🎉</div>' : ''}
        </div>
      </div>
    `;
    App.showScreen('attendance');
  },
};
