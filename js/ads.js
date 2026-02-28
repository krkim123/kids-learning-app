// Lightweight ad wrapper.
// Web(PWA): no-op. Native(Capacitor): integrate AdMob later.

const Ads = {
  initialized: false,
  lastInterstitialAt: 0,
  minInterstitialGapMs: 180000, // 3 minutes
  enabled: false,

  init() {
    // Keep web version ad-free by default.
    this.initialized = true;
    this.enabled = this._isNative();
  },

  showBanner(slot) {
    if (!this.enabled) return;
    // Native integration point.
    // slot examples: "home", "result"
    void slot;
  },

  hideBanner() {
    if (!this.enabled) return;
  },

  maybeShowInterstitial(reason) {
    if (!this.enabled) return;
    const now = Date.now();
    if (now - this.lastInterstitialAt < this.minInterstitialGapMs) return;
    this.lastInterstitialAt = now;
    void reason;
  },

  _isNative() {
    return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  }
};
