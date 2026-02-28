// localStorage wrapper with attendance, missions, XP, level tracking

const Storage = {
  PREFIX: 'fairy-classroom-',

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
      + (p.tracingComplete || 0) + (p.countingCorrect || 0);
    const att = this.getAttendance(profileId);
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
      categoryProgress: {
        hangul: getCategoryProgress('hangul', p),
        english: getCategoryProgress('english', p),
        number: getCategoryProgress('number', p),
      },
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
};
