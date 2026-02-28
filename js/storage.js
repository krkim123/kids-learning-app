// localStorage wrapper for profile-based data persistence

const Storage = {
  PREFIX: 'fairy-classroom-',

  _key(profileId, key) {
    return `${this.PREFIX}${profileId}-${key}`;
  },

  get(profileId, key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(this._key(profileId, key));
      return raw !== null ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set(profileId, key, value) {
    try {
      localStorage.setItem(this._key(profileId, key), JSON.stringify(value));
    } catch {
      // localStorage full or unavailable
    }
  },

  // Global settings (not per-profile)
  getGlobal(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(this.PREFIX + key);
      return raw !== null ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  setGlobal(key, value) {
    try {
      localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
    } catch {
      // localStorage full or unavailable
    }
  },

  // Get full profile progress
  getProgress(profileId) {
    return this.get(profileId, 'progress', {
      learned: {},        // { 'hangul-consonant': ['ㄱ','ㄴ',...], ... }
      stars: 0,
      stickers: [],       // ['🌸', '🦄', ...]
      badges: [],         // ['consonant-master', ...]
      quizCorrect: 0,
      matchingComplete: 0,
      soundCorrect: 0,
    });
  },

  saveProgress(profileId, progress) {
    this.set(profileId, 'progress', progress);
  },
};
