// Web SpeechSynthesis API wrapper

const Speech = {
  supported: 'speechSynthesis' in window,
  speaking: false,

  speak(text, lang = 'ko-KR') {
    if (!this.supported) return;
    const soundOptions = window.App && typeof App.getSoundOptions === 'function'
      ? App.getSoundOptions()
      : { muteAll: false, speechVolume: 100 };
    if (soundOptions.muteAll) return;
    const volume = Math.max(0, Math.min(1, (Number(soundOptions.speechVolume) || 0) / 100));
    if (volume <= 0) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const profile = window.Profile ? Profile.getCurrent() : null;
    const s = {
      rate: profile?.speechRate || 0.8,
      pitch: 1.2,
    };

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = s.rate;
    utterance.pitch = s.pitch;
    utterance.volume = volume;

    // Try to find a matching voice
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
    if (matchingVoice) utterance.voice = matchingVoice;

    this.speaking = true;
    utterance.onend = () => { this.speaking = false; };
    utterance.onerror = () => { this.speaking = false; };

    window.speechSynthesis.speak(utterance);
  },

  speakKorean(text) {
    this.speak(text, 'ko-KR');
  },

  speakEnglish(text) {
    this.speak(text, 'en-US');
  },

  // Speak a learning item
  speakItem(item, category) {
    if (category === 'english') {
      // Say the letter in English, then the word
      this.speakEnglish(item.char);
      setTimeout(() => this.speakEnglish(item.word), 800);
    } else {
      // Korean: say the pronunciation, then the word
      this.speakKorean(item.pronunciation);
      setTimeout(() => this.speakKorean(item.wordPronunciation), 800);
    }
  },

  stop() {
    if (this.supported) {
      window.speechSynthesis.cancel();
      this.speaking = false;
    }
  },

  init() {
    // Pre-load voices
    if (this.supported && window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', () => {}, { once: true });
    }
  },
};
