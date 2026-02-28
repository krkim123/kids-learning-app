// Profile management for Dokyung and Sobin

const PROFILES = {
  dokyung: {
    id: 'dokyung',
    name: '도경',
    age: 6,
    theme: 'pink',
    icon: '👸',       // Princess
    title: '공주님',
    quizChoices: 4,
    matchingPairs: 4,  // 4 pairs = 8 cards
    fontSize: 80,
    touchSize: 48,
    autoHint: false,
    autoSpeak: false,  // Touch to hear
    wrongRetry: true,
    starsPerCorrect: 1,
  },
  sobin: {
    id: 'sobin',
    name: '소빈',
    age: 3,
    theme: 'purple',
    icon: '🧚',       // Fairy
    title: '꽃요정',
    quizChoices: 2,
    matchingPairs: 2,  // 2 pairs = 4 cards
    fontSize: 120,
    touchSize: 60,
    autoHint: true,    // Auto hint after 3s
    autoSpeak: true,   // Auto speak on card change
    wrongRetry: false, // Show answer immediately
    starsPerCorrect: 2,
  },
};

const Profile = {
  showSelection() {
    const screen = document.getElementById('screen-profile');
    screen.innerHTML = `
      <div class="profile-select-container">
        <h1 class="profile-title">누구야? 🌟</h1>
        <div class="profile-cards">
          <button class="profile-card profile-dokyung" onclick="Profile.select('dokyung')">
            <div class="profile-avatar">👸</div>
            <div class="profile-name">도경</div>
            <div class="profile-desc">공주님 (6살)</div>
          </button>
          <button class="profile-card profile-sobin" onclick="Profile.select('sobin')">
            <div class="profile-avatar">🧚</div>
            <div class="profile-name">소빈</div>
            <div class="profile-desc">꽃요정 (3살)</div>
          </button>
        </div>
      </div>
    `;
  },

  select(profileId) {
    App.currentProfile = profileId;
    Storage.setGlobal('lastProfile', profileId);

    // Apply theme
    document.body.classList.remove('theme-pink', 'theme-purple');
    document.body.classList.add(`theme-${PROFILES[profileId].theme}`);

    // Add selection animation
    const card = document.querySelector(`.profile-${profileId}`);
    if (card) {
      card.classList.add('selected');
      setTimeout(() => App.navigate('home'), 400);
    } else {
      App.navigate('home');
    }
  },

  getCurrent() {
    return PROFILES[App.currentProfile] || PROFILES.dokyung;
  },
};
