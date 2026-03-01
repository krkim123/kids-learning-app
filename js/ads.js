// Ads runtime wrapper for free+ads monetization.
// - Native (Capacitor/Cordova): real AdMob bridge when plugin exists.
// - Web/PWA: no real ads by default (optional debug banner only).

const Ads = {
  initialized: false,
  enabled: false,
  adapter: 'none',
  currentBannerSlot: '',
  lastInterstitialAt: 0,
  minInterstitialGapMs: 180000,
  config: null,
  debugBannerEl: null,
  capInterstitialQueue: Promise.resolve(),

  init() {
    this.config = this._loadConfig();
    this.enabled = !!this.config.enabled;
    this.minInterstitialGapMs = Math.max(60000, Number(this.config.minInterstitialGapMs) || 180000);

    if (!this.enabled) {
      this.adapter = 'none';
      this.initialized = true;
      return;
    }

    if (this._hasCapacitorAdMob()) this.adapter = 'capacitor-admob';
    else if (this._hasCordovaAdMob()) this.adapter = 'cordova-admob';
    else if (this.config.webDebugBanner) this.adapter = 'web-debug';
    else this.adapter = 'none';

    this._ensureDailyStats();
    this._configureNetwork();
    this.initialized = true;
  },

  showBanner(slot) {
    if (!this.enabled || !slot) return;
    if (!this._isAllowedBannerSlot(slot)) return;
    if (this.currentBannerSlot === slot) return;

    if (this.adapter === 'capacitor-admob') {
      const plugin = this._getCapacitorAdMob();
      if (!plugin || typeof plugin.showBanner !== 'function') return;
      const adId = this._resolveAdUnitId('banner', slot);
      const options = {
        adId,
        adSize: 'BANNER',
        position: 'BOTTOM_CENTER',
        isTesting: !!this.config.testing,
      };
      Promise.resolve(plugin.showBanner(options)).catch(() => {});
      this.currentBannerSlot = slot;
      this._recordStats('banner');
      return;
    }

    if (this.adapter === 'cordova-admob') {
      const admob = window.admob;
      try {
        if (admob?.banner?.show) {
          admob.banner.show({
            id: this._resolveAdUnitId('banner', slot),
            isTesting: !!this.config.testing,
            overlap: false,
            position: 'bottom',
          });
          this.currentBannerSlot = slot;
          this._recordStats('banner');
        }
      } catch (_) {
        // no-op
      }
      return;
    }

    if (this.adapter === 'web-debug') {
      this._showDebugBanner(slot);
      this.currentBannerSlot = slot;
      this._recordStats('banner');
    }
  },

  hideBanner() {
    if (!this.enabled) return;

    if (this.adapter === 'capacitor-admob') {
      const plugin = this._getCapacitorAdMob();
      if (!plugin) return;
      if (typeof plugin.hideBanner === 'function') Promise.resolve(plugin.hideBanner()).catch(() => {});
      if (typeof plugin.removeBanner === 'function') Promise.resolve(plugin.removeBanner()).catch(() => {});
      this.currentBannerSlot = '';
      return;
    }

    if (this.adapter === 'cordova-admob') {
      try {
        if (window.admob?.banner?.hide) window.admob.banner.hide();
      } catch (_) {
        // no-op
      }
      this.currentBannerSlot = '';
      return;
    }

    if (this.adapter === 'web-debug') {
      this._hideDebugBanner();
      this.currentBannerSlot = '';
    }
  },

  maybeShowInterstitial(reason) {
    if (!this.enabled || !this.config.allowInterstitial) return;
    if (!this._isAllowedInterstitialReason(reason)) return;
    if (!this._canShowInterstitial()) return;

    this.capInterstitialQueue = this.capInterstitialQueue
      .then(() => this._showInterstitialByAdapter())
      .then((shown) => {
        if (!shown) return;
        this.lastInterstitialAt = Date.now();
        this._recordStats('interstitial');
      })
      .catch(() => {});
  },

  getStatsSnapshot() {
    const stats = this._ensureDailyStats();
    return {
      date: stats.date,
      banner: stats.banner,
      interstitial: stats.interstitial,
      rewarded: stats.rewarded,
      adapter: this.adapter,
      enabled: this.enabled,
    };
  },

  _loadConfig() {
    const defaults = {
      enabled: true,
      testing: true,
      webDebugBanner: false,
      allowInterstitial: true,
      minInterstitialGapMs: 180000,
      maxInterstitialPerDay: 8,
      // Child safety defaults
      childDirected: true,
      underAgeOfConsent: true,
      nonPersonalizedOnly: true,
      adUnits: {
        android: {
          banner: 'ca-app-pub-3940256099942544/6300978111',
          interstitial: 'ca-app-pub-3940256099942544/1033173712',
          rewarded: 'ca-app-pub-3940256099942544/5224354917',
        },
        ios: {
          banner: 'ca-app-pub-3940256099942544/2934735716',
          interstitial: 'ca-app-pub-3940256099942544/4411468910',
          rewarded: 'ca-app-pub-3940256099942544/1712485313',
        },
      },
    };

    const fromStorage = this._loadStoredConfig();
    const fromWindow = (window.__FAIRY_ADS_CONFIG__ && typeof window.__FAIRY_ADS_CONFIG__ === 'object')
      ? window.__FAIRY_ADS_CONFIG__
      : {};
    const merged = {
      ...defaults,
      ...fromStorage,
      ...fromWindow,
      adUnits: {
        ...defaults.adUnits,
        ...(fromStorage.adUnits || {}),
        ...(fromWindow.adUnits || {}),
      },
    };
    return merged;
  },

  _loadStoredConfig() {
    try {
      if (window.Storage && typeof Storage.getGlobal === 'function') {
        return Storage.getGlobal('adsConfig', {}) || {};
      }
      const raw = localStorage.getItem('fairy-classroom-ads-config');
      return raw ? JSON.parse(raw) : {};
    } catch (_) {
      return {};
    }
  },

  _saveStoredStats(stats) {
    try {
      if (window.Storage && typeof Storage.setGlobal === 'function') {
        Storage.setGlobal('adsStats', stats);
        return;
      }
      localStorage.setItem('fairy-classroom-ads-stats', JSON.stringify(stats));
    } catch (_) {
      // no-op
    }
  },

  _loadStoredStats() {
    try {
      if (window.Storage && typeof Storage.getGlobal === 'function') {
        return Storage.getGlobal('adsStats', null);
      }
      const raw = localStorage.getItem('fairy-classroom-ads-stats');
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  },

  _today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },

  _ensureDailyStats() {
    const today = this._today();
    const current = this._loadStoredStats();
    if (current && current.date === today) return current;
    const fresh = { date: today, banner: 0, interstitial: 0, rewarded: 0 };
    this._saveStoredStats(fresh);
    return fresh;
  },

  _recordStats(kind) {
    const stats = this._ensureDailyStats();
    if (kind === 'banner') stats.banner += 1;
    else if (kind === 'interstitial') stats.interstitial += 1;
    else if (kind === 'rewarded') stats.rewarded += 1;
    this._saveStoredStats(stats);
  },

  _canShowInterstitial() {
    const now = Date.now();
    if (now - this.lastInterstitialAt < this.minInterstitialGapMs) return false;
    const stats = this._ensureDailyStats();
    const maxDaily = Math.max(0, Number(this.config.maxInterstitialPerDay) || 0);
    if (maxDaily > 0 && stats.interstitial >= maxDaily) return false;
    return true;
  },

  _isAllowedBannerSlot(slot) {
    return ['home', 'reward', 'parent'].includes(String(slot));
  },

  _isAllowedInterstitialReason(reason) {
    return ['reward-screen', 'parent-screen', 'routine-complete'].includes(String(reason));
  },

  _showInterstitialByAdapter() {
    if (this.adapter === 'capacitor-admob') {
      return this._showCapacitorInterstitial();
    }
    if (this.adapter === 'cordova-admob') {
      return this._showCordovaInterstitial();
    }
    if (this.adapter === 'web-debug') {
      return Promise.resolve(false);
    }
    return Promise.resolve(false);
  },

  _showCapacitorInterstitial() {
    const plugin = this._getCapacitorAdMob();
    if (!plugin) return Promise.resolve(false);
    const adId = this._resolveAdUnitId('interstitial');
    const options = { adId, isTesting: !!this.config.testing };

    const prepare = typeof plugin.prepareInterstitial === 'function'
      ? Promise.resolve(plugin.prepareInterstitial(options)).catch(() => null)
      : Promise.resolve(null);

    return prepare.then(() => {
      if (typeof plugin.showInterstitial === 'function') {
        return Promise.resolve(plugin.showInterstitial()).then(() => true).catch(() => false);
      }
      return false;
    });
  },

  _showCordovaInterstitial() {
    return new Promise((resolve) => {
      try {
        const admob = window.admob;
        if (!admob?.interstitial) return resolve(false);
        if (typeof admob.interstitial.show === 'function') {
          if (typeof admob.interstitial.load === 'function') {
            admob.interstitial.load({
              id: this._resolveAdUnitId('interstitial'),
              isTesting: !!this.config.testing,
            });
          }
          admob.interstitial.show();
          return resolve(true);
        }
      } catch (_) {
        return resolve(false);
      }
      return resolve(false);
    });
  },

  _configureNetwork() {
    if (this.adapter !== 'capacitor-admob') return;
    const plugin = this._getCapacitorAdMob();
    if (!plugin) return;

    const requestCfg = {
      maxAdContentRating: 'G',
      tagForChildDirectedTreatment: !!this.config.childDirected,
      tagForUnderAgeOfConsent: !!this.config.underAgeOfConsent,
    };
    if (typeof plugin.setRequestConfiguration === 'function') {
      Promise.resolve(plugin.setRequestConfiguration(requestCfg)).catch(() => {});
    }
    if (typeof plugin.initialize === 'function') {
      const initCfg = {
        initializeForTesting: !!this.config.testing,
        requestTrackingAuthorization: false,
        testingDevices: this.config.testing ? ['EMULATOR'] : [],
      };
      Promise.resolve(plugin.initialize(initCfg)).catch(() => {});
    }
  },

  _getCapacitorAdMob() {
    return window.Capacitor?.Plugins?.AdMob || null;
  },

  _hasCapacitorAdMob() {
    return !!this._getCapacitorAdMob();
  },

  _hasCordovaAdMob() {
    return !!(window.admob && (window.admob.banner || window.admob.interstitial));
  },

  _platform() {
    const fromCap = window.Capacitor?.getPlatform?.();
    if (fromCap === 'ios' || fromCap === 'android') return fromCap;
    const ua = navigator.userAgent || '';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
    return 'android';
  },

  _resolveAdUnitId(kind) {
    const platform = this._platform();
    return this.config?.adUnits?.[platform]?.[kind]
      || this.config?.adUnits?.android?.[kind]
      || '';
  },

  _showDebugBanner(slot) {
    this._ensureDebugBannerEl();
    if (!this.debugBannerEl) return;
    this.debugBannerEl.textContent = `AD DEBUG • ${slot} • banner`;
    this.debugBannerEl.style.display = 'flex';
  },

  _hideDebugBanner() {
    if (!this.debugBannerEl) return;
    this.debugBannerEl.style.display = 'none';
  },

  _ensureDebugBannerEl() {
    if (this.debugBannerEl || !document?.body) return;
    const el = document.createElement('div');
    el.id = 'ads-debug-banner';
    el.style.position = 'fixed';
    el.style.left = '0';
    el.style.right = '0';
    el.style.bottom = '0';
    el.style.height = '42px';
    el.style.display = 'none';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.background = 'rgba(21, 33, 80, 0.92)';
    el.style.color = '#fff';
    el.style.fontSize = '12px';
    el.style.fontWeight = '700';
    el.style.zIndex = '9999';
    document.body.appendChild(el);
    this.debugBannerEl = el;
  },

  _isNative() {
    return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  },
};
