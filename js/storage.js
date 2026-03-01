// localStorage wrapper with attendance, missions, XP, level tracking

const Storage = {
  PREFIX: 'fairy-classroom-',
  PARENT_SETTINGS_DEFAULTS: {
    toddler: {
      dailyLimitMin: 45,
      sessionLimitMin: 15,
      breakEveryMin: 10,
      adaptiveWeights: {
        language: 100,
        memory: 100,
        logic: 100,
        focus: 100,
      },
      speechVolume: 100,
      sfxVolume: 70,
      muteAll: false,
      bedtimeEnabled: false,
      bedtimeStart: '21:00',
      bedtimeEnd: '07:00',
    },
    child: {
      dailyLimitMin: 60,
      sessionLimitMin: 20,
      breakEveryMin: 15,
      adaptiveWeights: {
        language: 100,
        memory: 100,
        logic: 100,
        focus: 100,
      },
      speechVolume: 100,
      sfxVolume: 75,
      muteAll: false,
      bedtimeEnabled: false,
      bedtimeStart: '21:30',
      bedtimeEnd: '07:00',
    },
    older: {
      dailyLimitMin: 90,
      sessionLimitMin: 30,
      breakEveryMin: 20,
      adaptiveWeights: {
        language: 100,
        memory: 100,
        logic: 100,
        focus: 100,
      },
      speechVolume: 100,
      sfxVolume: 80,
      muteAll: false,
      bedtimeEnabled: false,
      bedtimeStart: '22:00',
      bedtimeEnd: '07:00',
    },
  },

  _key(profileId, key) {
    return `${this.PREFIX}${profileId}-${key}`;
  },

  get(profileId, key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(this._key(profileId, key));
      return raw !== null ? JSON.parse(raw) : defaultValue;
    } catch { return defaultValue; }
  },

  set(profileId, key, value) {
    try { localStorage.setItem(this._key(profileId, key), JSON.stringify(value)); }
    catch { /* localStorage full or unavailable */ }
  },

  getGlobal(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(this.PREFIX + key);
      return raw !== null ? JSON.parse(raw) : defaultValue;
    } catch { return defaultValue; }
  },

  setGlobal(key, value) {
    try { localStorage.setItem(this.PREFIX + key, JSON.stringify(value)); }
    catch { /* localStorage full */ }
  },

  getProfiles() {
    const profiles = this.getGlobal('profiles', []);
    return Array.isArray(profiles) ? profiles : [];
  },

  saveProfiles(profiles) {
    this.setGlobal('profiles', Array.isArray(profiles) ? profiles : []);
  },

  upsertProfile(profile) {
    const profiles = this.getProfiles();
    const idx = profiles.findIndex(p => p.id === profile.id);
    if (idx >= 0) profiles[idx] = profile;
    else profiles.push(profile);
    this.saveProfiles(profiles);
    return profile;
  },

  deleteProfile(profileId) {
    const profiles = this.getProfiles().filter(p => p.id !== profileId);
    this.saveProfiles(profiles);
    this.resetProfile(profileId);
    const lastProfile = this.getGlobal('lastProfile');
    if (lastProfile === profileId) this.setGlobal('lastProfile', null);
  },

  // Full profile progress
  getProgress(profileId) {
    return this.get(profileId, 'progress', {
      learned: {},          // { hangul: ['ㄱ','ㄴ',...], english: ['A','B',...], ... }
      stars: 0,
      xp: 0,
      stickers: [],
      badges: [],
      quizCorrect: 0,
      matchingComplete: 0,
      soundCorrect: 0,
      tracingComplete: 0,
      countingCorrect: 0,
      coloringComplete: 0,
      combineComplete: 0,
      towerPlays: 0,
      towerBestHeight: 0,
      towerPerfectRuns: 0,
      towerCorrect: 0,
      shape3dCorrect: 0,
      net3dCorrect: 0,
    });
  },

  saveProgress(profileId, progress) {
    this.set(profileId, 'progress', progress);
  },

  // Attendance
  getAttendance(profileId) {
    return this.get(profileId, 'attendance', {
      dates: [],       // ['2026-02-28', '2026-02-27', ...]
      streak: 0,
      lastDate: null,
      stampShownToday: false,
    });
  },

  saveAttendance(profileId, attendance) {
    this.set(profileId, 'attendance', attendance);
  },

  // Daily missions
  getMissions(profileId) {
    return this.get(profileId, 'missions', {
      date: null,      // '2026-02-28'
      missions: [],    // [{ id, text, icon, target, current, done }, ...]
      allComplete: false,
    });
  },

  saveMissions(profileId, missions) {
    this.set(profileId, 'missions', missions);
  },

  // Coloring gallery
  getGallery(profileId) {
    return this.get(profileId, 'gallery', []);
    // [{ designId, colors: { regionId: color }, date }]
  },

  saveGallery(profileId, gallery) {
    this.set(profileId, 'gallery', gallery);
  },

  getParentDefaults(ageGroup = 'child') {
    return { ...(this.PARENT_SETTINGS_DEFAULTS[ageGroup] || this.PARENT_SETTINGS_DEFAULTS.child) };
  },

  normalizeParentSettings(settings, ageGroup = 'child') {
    const defaults = this.getParentDefaults(ageGroup);
    const raw = settings && typeof settings === 'object' ? settings : {};
    const rawWeights = raw.adaptiveWeights && typeof raw.adaptiveWeights === 'object'
      ? raw.adaptiveWeights
      : {};
    const clamp = (value, min, max, fallback) => {
      const num = Number(value);
      if (!Number.isFinite(num)) return fallback;
      return Math.max(min, Math.min(max, Math.round(num)));
    };
    const timeString = (value, fallback) => {
      const text = String(value || '').trim();
      return /^([01]\d|2[0-3]):[0-5]\d$/.test(text) ? text : fallback;
    };
    return {
      dailyLimitMin: clamp(raw.dailyLimitMin, 0, 240, defaults.dailyLimitMin),
      sessionLimitMin: clamp(raw.sessionLimitMin, 0, 120, defaults.sessionLimitMin),
      breakEveryMin: clamp(raw.breakEveryMin, 0, 60, defaults.breakEveryMin),
      adaptiveWeights: {
        language: clamp(rawWeights.language, 50, 150, defaults.adaptiveWeights.language),
        memory: clamp(rawWeights.memory, 50, 150, defaults.adaptiveWeights.memory),
        logic: clamp(rawWeights.logic, 50, 150, defaults.adaptiveWeights.logic),
        focus: clamp(rawWeights.focus, 50, 150, defaults.adaptiveWeights.focus),
      },
      speechVolume: clamp(raw.speechVolume, 0, 100, defaults.speechVolume),
      sfxVolume: clamp(raw.sfxVolume, 0, 100, defaults.sfxVolume),
      muteAll: !!raw.muteAll,
      bedtimeEnabled: !!raw.bedtimeEnabled,
      bedtimeStart: timeString(raw.bedtimeStart, defaults.bedtimeStart),
      bedtimeEnd: timeString(raw.bedtimeEnd, defaults.bedtimeEnd),
    };
  },

  getParentSettings(profileId, ageGroup = 'child') {
    const saved = this.get(profileId, 'parentSettings', null);
    return this.normalizeParentSettings(saved, ageGroup);
  },

  saveParentSettings(profileId, settings, ageGroup = 'child') {
    this.set(profileId, 'parentSettings', this.normalizeParentSettings(settings, ageGroup));
  },

  getUsageHistory(profileId) {
    const raw = this.get(profileId, 'usageHistory', {});
    if (!raw || typeof raw !== 'object') return {};
    const history = {};
    Object.entries(raw).forEach(([date, item]) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
      const seconds = Math.max(0, Number(item?.seconds) || 0);
      const breakCount = Math.max(0, Math.round(Number(item?.breakCount) || 0));
      history[date] = { seconds, breakCount };
    });
    return history;
  },

  saveUsageHistory(profileId, history) {
    this.set(profileId, 'usageHistory', history && typeof history === 'object' ? history : {});
  },

  snapshotUsageDay(profileId, usage) {
    const date = typeof usage?.date === 'string' ? usage.date : '';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
    const history = this.getUsageHistory(profileId);
    history[date] = {
      seconds: Math.max(0, Number(usage?.secondsToday) || 0),
      breakCount: Math.max(0, Math.round(Number(usage?.breakCountToday) || 0)),
    };

    // Keep recent history only.
    const keys = Object.keys(history).sort();
    const maxDays = 120;
    if (keys.length > maxDays) {
      keys.slice(0, keys.length - maxDays).forEach((key) => delete history[key]);
    }
    this.saveUsageHistory(profileId, history);
  },

  getUsage(profileId) {
    const today = this.today();
    const base = {
      date: today,
      secondsToday: 0,
      totalSeconds: 0,
      breakCountToday: 0,
    };
    const usage = this.get(profileId, 'usage', base);
    if (!usage || typeof usage !== 'object') return base;
    if (usage.date !== today) {
      this.snapshotUsageDay(profileId, usage);
      const rolled = {
        ...usage,
        date: today,
        secondsToday: 0,
        breakCountToday: 0,
      };
      this.set(profileId, 'usage', rolled);
      this.snapshotUsageDay(profileId, rolled);
      return rolled;
    }
    const normalized = {
      date: today,
      secondsToday: Number(usage.secondsToday) || 0,
      totalSeconds: Number(usage.totalSeconds) || 0,
      breakCountToday: Number(usage.breakCountToday) || 0,
    };
    this.snapshotUsageDay(profileId, normalized);
    return normalized;
  },

  saveUsage(profileId, usage) {
    const normalized = {
      date: typeof usage?.date === 'string' ? usage.date : this.today(),
      secondsToday: Math.max(0, Number(usage?.secondsToday) || 0),
      totalSeconds: Math.max(0, Number(usage?.totalSeconds) || 0),
      breakCountToday: Math.max(0, Math.round(Number(usage?.breakCountToday) || 0)),
    };
    this.set(profileId, 'usage', normalized);
    this.snapshotUsageDay(profileId, normalized);
  },

  addUsageSeconds(profileId, deltaSeconds) {
    const delta = Math.max(0, Number(deltaSeconds) || 0);
    if (delta <= 0) return this.getUsage(profileId);
    const usage = this.getUsage(profileId);
    usage.secondsToday += delta;
    usage.totalSeconds += delta;
    this.saveUsage(profileId, usage);
    return usage;
  },

  incrementBreakCount(profileId) {
    const usage = this.getUsage(profileId);
    usage.breakCountToday += 1;
    this.saveUsage(profileId, usage);
    return usage;
  },

  // Today's date string
  today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  },

  // Get total learning time (approximation based on activity count)
  getStats(profileId) {
    const p = this.getProgress(profileId);
    const totalLearned = Object.values(p.learned).reduce((s, arr) => s + arr.length, 0);
    const totalGames = (p.quizCorrect || 0) + (p.matchingComplete || 0) + (p.soundCorrect || 0)
      + (p.tracingComplete || 0) + (p.countingCorrect || 0) + (p.towerPlays || 0);
    const att = this.getAttendance(profileId);
    const categoryProgress = Object.keys(CATEGORIES).reduce((acc, categoryId) => {
      acc[categoryId] = getCategoryProgress(categoryId, p);
      return acc;
    }, {});
    return {
      totalLearned,
      totalGames,
      stars: p.stars,
      xp: p.xp,
      level: getLevelInfo(p.xp || 0),
      daysAttended: att.dates.length,
      streak: att.streak,
      stickers: p.stickers.length,
      badges: p.badges.length,
      categoryProgress,
    };
  },

  // Reset all data for a profile
  resetProfile(profileId) {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(`${this.PREFIX}${profileId}-`)) keys.push(k);
    }
    keys.forEach(k => localStorage.removeItem(k));
  },

  // Get recent 7 days activity for bar chart
  getWeeklyActivity(profileId) {
    const att = this.getAttendance(profileId);
    const result = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      const dayNames = ['일','월','화','수','목','금','토'];
      result.push({
        date: dateStr,
        day: dayNames[d.getDay()],
        active: att.dates.includes(dateStr),
      });
    }
    return result;
  },

  getWeeklyUsage(profileId) {
    const history = this.getUsageHistory(profileId);
    const todayUsage = this.getUsage(profileId);
    const today = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      const saved = history[dateStr];
      const seconds = dateStr === todayUsage.date
        ? Math.max(0, Number(todayUsage.secondsToday) || 0)
        : Math.max(0, Number(saved?.seconds) || 0);
      const breakCount = dateStr === todayUsage.date
        ? Math.max(0, Number(todayUsage.breakCountToday) || 0)
        : Math.max(0, Number(saved?.breakCount) || 0);
      result.push({
        date: dateStr,
        day: dayNames[d.getDay()],
        seconds,
        minutes: Math.round(seconds / 60),
        breakCount,
        active: seconds > 0,
      });
    }
    return result;
  },
};
