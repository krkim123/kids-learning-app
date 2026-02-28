// Learning content data — Stages, Animals, Coloring, etc.

const HANGUL_CONSONANTS = [
  { char: 'ㄱ', word: '가방', emoji: '🎒', pronunciation: '기역', wordPronunciation: '가방' },
  { char: 'ㄴ', word: '나비', emoji: '🦋', pronunciation: '니은', wordPronunciation: '나비' },
  { char: 'ㄷ', word: '다리', emoji: '🌉', pronunciation: '디귿', wordPronunciation: '다리' },
  { char: 'ㄹ', word: '라면', emoji: '🍜', pronunciation: '리을', wordPronunciation: '라면' },
  { char: 'ㅁ', word: '마우스', emoji: '🖱️', pronunciation: '미음', wordPronunciation: '마우스' },
  { char: 'ㅂ', word: '바나나', emoji: '🍌', pronunciation: '비읍', wordPronunciation: '바나나' },
  { char: 'ㅅ', word: '사과', emoji: '🍎', pronunciation: '시옷', wordPronunciation: '사과' },
  { char: 'ㅇ', word: '아이스크림', emoji: '🍦', pronunciation: '이응', wordPronunciation: '아이스크림' },
  { char: 'ㅈ', word: '자동차', emoji: '🚗', pronunciation: '지읒', wordPronunciation: '자동차' },
  { char: 'ㅊ', word: '치즈', emoji: '🧀', pronunciation: '치읓', wordPronunciation: '치즈' },
  { char: 'ㅋ', word: '코끼리', emoji: '🐘', pronunciation: '키읔', wordPronunciation: '코끼리' },
  { char: 'ㅌ', word: '토끼', emoji: '🐰', pronunciation: '티읕', wordPronunciation: '토끼' },
  { char: 'ㅍ', word: '포도', emoji: '🍇', pronunciation: '피읖', wordPronunciation: '포도' },
  { char: 'ㅎ', word: '하마', emoji: '🦛', pronunciation: '히읗', wordPronunciation: '하마' },
];

const HANGUL_VOWELS = [
  { char: 'ㅏ', word: '아기', emoji: '👶', pronunciation: '아', wordPronunciation: '아기' },
  { char: 'ㅑ', word: '야구', emoji: '⚾', pronunciation: '야', wordPronunciation: '야구' },
  { char: 'ㅓ', word: '엄마', emoji: '👩', pronunciation: '어', wordPronunciation: '엄마' },
  { char: 'ㅕ', word: '여우', emoji: '🦊', pronunciation: '여', wordPronunciation: '여우' },
  { char: 'ㅗ', word: '오리', emoji: '🦆', pronunciation: '오', wordPronunciation: '오리' },
  { char: 'ㅛ', word: '요리', emoji: '🍳', pronunciation: '요', wordPronunciation: '요리' },
  { char: 'ㅜ', word: '우산', emoji: '☂️', pronunciation: '우', wordPronunciation: '우산' },
  { char: 'ㅠ', word: '유리', emoji: '🪟', pronunciation: '유', wordPronunciation: '유리' },
  { char: 'ㅡ', word: '으르렁', emoji: '🐯', pronunciation: '으', wordPronunciation: '으르렁' },
  { char: 'ㅣ', word: '이빨', emoji: '🦷', pronunciation: '이', wordPronunciation: '이빨' },
];

const NUMBERS = [
  { char: '1', word: '하나', emoji: '☝️', pronunciation: '일', wordPronunciation: '하나' },
  { char: '2', word: '둘', emoji: '✌️', pronunciation: '이', wordPronunciation: '둘' },
  { char: '3', word: '셋', emoji: '🌟', pronunciation: '삼', wordPronunciation: '셋' },
  { char: '4', word: '넷', emoji: '🍀', pronunciation: '사', wordPronunciation: '넷' },
  { char: '5', word: '다섯', emoji: '🖐️', pronunciation: '오', wordPronunciation: '다섯' },
  { char: '6', word: '여섯', emoji: '🎲', pronunciation: '육', wordPronunciation: '여섯' },
  { char: '7', word: '일곱', emoji: '🌈', pronunciation: '칠', wordPronunciation: '일곱' },
  { char: '8', word: '여덟', emoji: '🐙', pronunciation: '팔', wordPronunciation: '여덟' },
  { char: '9', word: '아홉', emoji: '🎯', pronunciation: '구', wordPronunciation: '아홉' },
  { char: '10', word: '열', emoji: '🔟', pronunciation: '십', wordPronunciation: '열' },
];

const ENGLISH = [
  { char: 'A', word: 'Apple', emoji: '🍎', pronunciation: '에이', wordPronunciation: 'Apple' },
  { char: 'B', word: 'Bear', emoji: '🐻', pronunciation: '비', wordPronunciation: 'Bear' },
  { char: 'C', word: 'Cat', emoji: '🐱', pronunciation: '씨', wordPronunciation: 'Cat' },
  { char: 'D', word: 'Dog', emoji: '🐶', pronunciation: '디', wordPronunciation: 'Dog' },
  { char: 'E', word: 'Elephant', emoji: '🐘', pronunciation: '이', wordPronunciation: 'Elephant' },
  { char: 'F', word: 'Fish', emoji: '🐟', pronunciation: '에프', wordPronunciation: 'Fish' },
  { char: 'G', word: 'Grape', emoji: '🍇', pronunciation: '지', wordPronunciation: 'Grape' },
  { char: 'H', word: 'Hat', emoji: '🎩', pronunciation: '에이치', wordPronunciation: 'Hat' },
  { char: 'I', word: 'Ice cream', emoji: '🍦', pronunciation: '아이', wordPronunciation: 'Ice cream' },
  { char: 'J', word: 'Juice', emoji: '🧃', pronunciation: '제이', wordPronunciation: 'Juice' },
  { char: 'K', word: 'King', emoji: '🤴', pronunciation: '케이', wordPronunciation: 'King' },
  { char: 'L', word: 'Lion', emoji: '🦁', pronunciation: '엘', wordPronunciation: 'Lion' },
  { char: 'M', word: 'Moon', emoji: '🌙', pronunciation: '엠', wordPronunciation: 'Moon' },
  { char: 'N', word: 'Nose', emoji: '👃', pronunciation: '엔', wordPronunciation: 'Nose' },
  { char: 'O', word: 'Orange', emoji: '🍊', pronunciation: '오', wordPronunciation: 'Orange' },
  { char: 'P', word: 'Penguin', emoji: '🐧', pronunciation: '피', wordPronunciation: 'Penguin' },
  { char: 'Q', word: 'Queen', emoji: '👸', pronunciation: '큐', wordPronunciation: 'Queen' },
  { char: 'R', word: 'Rabbit', emoji: '🐰', pronunciation: '알', wordPronunciation: 'Rabbit' },
  { char: 'S', word: 'Sun', emoji: '☀️', pronunciation: '에스', wordPronunciation: 'Sun' },
  { char: 'T', word: 'Tiger', emoji: '🐯', pronunciation: '티', wordPronunciation: 'Tiger' },
  { char: 'U', word: 'Umbrella', emoji: '☂️', pronunciation: '유', wordPronunciation: 'Umbrella' },
  { char: 'V', word: 'Violin', emoji: '🎻', pronunciation: '브이', wordPronunciation: 'Violin' },
  { char: 'W', word: 'Whale', emoji: '🐋', pronunciation: '더블유', wordPronunciation: 'Whale' },
  { char: 'X', word: 'Xylophone', emoji: '🎵', pronunciation: '엑스', wordPronunciation: 'Xylophone' },
  { char: 'Y', word: 'Yogurt', emoji: '🥛', pronunciation: '와이', wordPronunciation: 'Yogurt' },
  { char: 'Z', word: 'Zebra', emoji: '🦓', pronunciation: '지', wordPronunciation: 'Zebra' },
];

// Animals, Fruits, Vehicles for naming game
const WORD_GROUPS = {
  animals: {
    name: '동물', icon: '🐾',
    items: [
      { name: '강아지', emoji: '🐶', sound: '멍멍' },
      { name: '고양이', emoji: '🐱', sound: '야옹' },
      { name: '토끼', emoji: '🐰', sound: '깡충' },
      { name: '곰', emoji: '🐻', sound: '으르렁' },
      { name: '사자', emoji: '🦁', sound: '어흥' },
      { name: '코끼리', emoji: '🐘', sound: '뿌우' },
      { name: '원숭이', emoji: '🐵', sound: '끼끼' },
      { name: '펭귄', emoji: '🐧', sound: '삐약' },
      { name: '돌고래', emoji: '🐬', sound: '끼이' },
      { name: '나비', emoji: '🦋', sound: '팔랑' },
      { name: '오리', emoji: '🦆', sound: '꽥꽥' },
      { name: '닭', emoji: '🐔', sound: '꼬끼오' },
      { name: '돼지', emoji: '🐷', sound: '꿀꿀' },
      { name: '소', emoji: '🐮', sound: '음메' },
      { name: '말', emoji: '🐴', sound: '히힝' },
    ]
  },
  fruits: {
    name: '과일', icon: '🍎',
    items: [
      { name: '사과', emoji: '🍎' },
      { name: '바나나', emoji: '🍌' },
      { name: '포도', emoji: '🍇' },
      { name: '딸기', emoji: '🍓' },
      { name: '수박', emoji: '🍉' },
      { name: '오렌지', emoji: '🍊' },
      { name: '복숭아', emoji: '🍑' },
      { name: '체리', emoji: '🍒' },
      { name: '파인애플', emoji: '🍍' },
      { name: '키위', emoji: '🥝' },
    ]
  },
  vehicles: {
    name: '탈것', icon: '🚗',
    items: [
      { name: '자동차', emoji: '🚗' },
      { name: '버스', emoji: '🚌' },
      { name: '기차', emoji: '🚂' },
      { name: '비행기', emoji: '✈️' },
      { name: '배', emoji: '🚢' },
      { name: '자전거', emoji: '🚲' },
      { name: '소방차', emoji: '🚒' },
      { name: '경찰차', emoji: '🚓' },
      { name: '택시', emoji: '🚕' },
      { name: '헬리콥터', emoji: '🚁' },
    ]
  }
};

// Coloring designs — simple SVG regions
const COLORING_DESIGNS = [
  {
    id: 'star', name: '별', emoji: '⭐',
    width: 300, height: 300,
    regions: [
      { id: 'body', path: 'M150,20 L185,110 L280,110 L205,165 L230,260 L150,210 L70,260 L95,165 L20,110 L115,110 Z', defaultColor: '#f0f0f0' },
      { id: 'eye1', path: 'M120,120 A10,10 0 1,1 140,120 A10,10 0 1,1 120,120 Z', defaultColor: '#e0e0e0' },
      { id: 'eye2', path: 'M160,120 A10,10 0 1,1 180,120 A10,10 0 1,1 160,120 Z', defaultColor: '#e0e0e0' },
      { id: 'mouth', path: 'M130,155 Q150,175 170,155', defaultColor: '#e0e0e0', isStroke: true },
    ]
  },
  {
    id: 'flower', name: '꽃', emoji: '🌸',
    width: 300, height: 300,
    regions: [
      { id: 'petal1', path: 'M150,50 Q180,100 150,130 Q120,100 150,50 Z', defaultColor: '#f0f0f0' },
      { id: 'petal2', path: 'M200,90 Q190,140 150,130 Q160,80 200,90 Z', defaultColor: '#f0f0f0' },
      { id: 'petal3', path: 'M200,170 Q170,160 150,130 Q180,140 200,170 Z', defaultColor: '#f0f0f0' },
      { id: 'petal4', path: 'M150,210 Q120,160 150,130 Q180,160 150,210 Z', defaultColor: '#f0f0f0' },
      { id: 'petal5', path: 'M100,170 Q130,160 150,130 Q120,140 100,170 Z', defaultColor: '#f0f0f0' },
      { id: 'petal6', path: 'M100,90 Q110,140 150,130 Q140,80 100,90 Z', defaultColor: '#f0f0f0' },
      { id: 'center', path: 'M135,115 A15,15 0 1,1 165,115 A15,15 0 1,1 135,115 Z', defaultColor: '#e0e0e0' },
      { id: 'stem', path: 'M145,200 L155,200 L155,290 L145,290 Z', defaultColor: '#d0d0d0' },
    ]
  },
  {
    id: 'butterfly', name: '나비', emoji: '🦋',
    width: 300, height: 250,
    regions: [
      { id: 'wingTL', path: 'M150,125 Q100,50 50,80 Q30,130 150,125 Z', defaultColor: '#f0f0f0' },
      { id: 'wingTR', path: 'M150,125 Q200,50 250,80 Q270,130 150,125 Z', defaultColor: '#f0f0f0' },
      { id: 'wingBL', path: 'M150,125 Q80,140 60,190 Q110,200 150,125 Z', defaultColor: '#f0f0f0' },
      { id: 'wingBR', path: 'M150,125 Q220,140 240,190 Q190,200 150,125 Z', defaultColor: '#f0f0f0' },
      { id: 'body', path: 'M145,70 L155,70 L155,200 L145,200 Z', defaultColor: '#e0e0e0' },
      { id: 'dotL', path: 'M90,100 A12,12 0 1,1 114,100 A12,12 0 1,1 90,100 Z', defaultColor: '#d0d0d0' },
      { id: 'dotR', path: 'M186,100 A12,12 0 1,1 210,100 A12,12 0 1,1 186,100 Z', defaultColor: '#d0d0d0' },
    ]
  },
  {
    id: 'fish', name: '물고기', emoji: '🐟',
    width: 300, height: 200,
    regions: [
      { id: 'body', path: 'M60,100 Q150,20 240,100 Q150,180 60,100 Z', defaultColor: '#f0f0f0' },
      { id: 'tail', path: 'M240,100 L290,60 L290,140 Z', defaultColor: '#e0e0e0' },
      { id: 'eye', path: 'M100,90 A10,10 0 1,1 120,90 A10,10 0 1,1 100,90 Z', defaultColor: '#d0d0d0' },
      { id: 'fin', path: 'M130,100 Q150,140 170,100 Z', defaultColor: '#e0e0e0' },
      { id: 'stripe1', path: 'M160,60 Q165,100 160,140 L170,140 Q175,100 170,60 Z', defaultColor: '#e8e8e8' },
      { id: 'stripe2', path: 'M195,70 Q200,100 195,130 L205,130 Q210,100 205,70 Z', defaultColor: '#e8e8e8' },
    ]
  },
  {
    id: 'house', name: '집', emoji: '🏠',
    width: 300, height: 300,
    regions: [
      { id: 'roof', path: 'M30,140 L150,40 L270,140 Z', defaultColor: '#f0f0f0' },
      { id: 'wall', path: 'M60,140 L240,140 L240,280 L60,280 Z', defaultColor: '#e8e8e8' },
      { id: 'door', path: 'M125,200 L175,200 L175,280 L125,280 Z', defaultColor: '#e0e0e0' },
      { id: 'window1', path: 'M80,160 L115,160 L115,195 L80,195 Z', defaultColor: '#d0d0d0' },
      { id: 'window2', path: 'M185,160 L220,160 L220,195 L185,195 Z', defaultColor: '#d0d0d0' },
      { id: 'chimney', path: 'M200,40 L230,40 L230,100 L200,100 Z', defaultColor: '#e0e0e0' },
    ]
  },
  {
    id: 'heart', name: '하트', emoji: '❤️',
    width: 300, height: 280,
    regions: [
      { id: 'left', path: 'M150,250 Q30,170 30,100 Q30,40 90,40 Q150,40 150,100 Z', defaultColor: '#f0f0f0' },
      { id: 'right', path: 'M150,250 Q270,170 270,100 Q270,40 210,40 Q150,40 150,100 Z', defaultColor: '#f0f0f0' },
      { id: 'shine', path: 'M100,80 A15,15 0 1,1 130,80 A15,15 0 1,1 100,80 Z', defaultColor: '#e8e8e8' },
    ]
  }
];

const COLORING_PALETTE = [
  '#FF6B6B', '#FF8E53', '#FFD93D', '#6BCB77',
  '#4D96FF', '#9B59B6', '#FF69B4', '#FFFFFF',
];

// Hangul combination data (consonant + vowel = syllable)
const HANGUL_COMBINE_CONSONANTS = [
  { char: 'ㄱ', index: 0 }, { char: 'ㄴ', index: 2 }, { char: 'ㄷ', index: 3 },
  { char: 'ㄹ', index: 5 }, { char: 'ㅁ', index: 6 }, { char: 'ㅂ', index: 7 },
  { char: 'ㅅ', index: 9 }, { char: 'ㅇ', index: 11 }, { char: 'ㅈ', index: 12 },
  { char: 'ㅎ', index: 18 },
];

const HANGUL_COMBINE_VOWELS = [
  { char: 'ㅏ', index: 0 }, { char: 'ㅑ', index: 2 }, { char: 'ㅓ', index: 4 },
  { char: 'ㅕ', index: 6 }, { char: 'ㅗ', index: 8 }, { char: 'ㅛ', index: 12 },
  { char: 'ㅜ', index: 13 }, { char: 'ㅠ', index: 17 }, { char: 'ㅡ', index: 18 },
  { char: 'ㅣ', index: 20 },
];

function combineHangul(consonantIndex, vowelIndex) {
  return String.fromCharCode(0xAC00 + (consonantIndex * 21 + vowelIndex) * 28);
}

// Category definitions with stages
const CATEGORIES = {
  hangul: {
    id: 'hangul', name: '한글', icon: '📖', color: '#FF8A65', tabIcon: '📖',
    stages: [
      { id: 1, name: '1단계', subtitle: 'ㄱ ~ ㅁ', items: HANGUL_CONSONANTS.slice(0, 5) },
      { id: 2, name: '2단계', subtitle: 'ㅂ ~ ㅈ', items: HANGUL_CONSONANTS.slice(5, 9) },
      { id: 3, name: '3단계', subtitle: 'ㅊ ~ ㅎ + 모음', items: [...HANGUL_CONSONANTS.slice(9), ...HANGUL_VOWELS] },
    ]
  },
  english: {
    id: 'english', name: '영어', icon: '🔤', color: '#42A5F5', tabIcon: '🔤',
    stages: [
      { id: 1, name: '1단계', subtitle: 'A ~ I', items: ENGLISH.slice(0, 9) },
      { id: 2, name: '2단계', subtitle: 'J ~ R', items: ENGLISH.slice(9, 18) },
      { id: 3, name: '3단계', subtitle: 'S ~ Z', items: ENGLISH.slice(18) },
    ]
  },
  number: {
    id: 'number', name: '숫자', icon: '🔢', color: '#66BB6A', tabIcon: '🔢',
    stages: [
      { id: 1, name: '1단계', subtitle: '1 ~ 3', items: NUMBERS.slice(0, 3) },
      { id: 2, name: '2단계', subtitle: '4 ~ 7', items: NUMBERS.slice(3, 7) },
      { id: 3, name: '3단계', subtitle: '8 ~ 10', items: NUMBERS.slice(7) },
    ]
  }
};

// Level system
const LEVEL_SYSTEM = [
  { level: 1, name: '새싹', icon: '🌱', xpNeeded: 0 },
  { level: 2, name: '풀잎', icon: '🌿', xpNeeded: 30 },
  { level: 3, name: '꽃봉오리', icon: '🌷', xpNeeded: 80 },
  { level: 4, name: '꽃', icon: '🌸', xpNeeded: 150 },
  { level: 5, name: '무지개', icon: '🌈', xpNeeded: 250 },
  { level: 6, name: '나비', icon: '🦋', xpNeeded: 380 },
  { level: 7, name: '별', icon: '⭐', xpNeeded: 550 },
  { level: 8, name: '달', icon: '🌙', xpNeeded: 750 },
  { level: 9, name: '태양', icon: '☀️', xpNeeded: 1000 },
  { level: 10, name: '왕관', icon: '👑', xpNeeded: 1300 },
  { level: 11, name: '보석', icon: '💎', xpNeeded: 1650 },
  { level: 12, name: '마법사', icon: '🧙', xpNeeded: 2050 },
  { level: 13, name: '유니콘', icon: '🦄', xpNeeded: 2500 },
  { level: 14, name: '용', icon: '🐉', xpNeeded: 3000 },
  { level: 15, name: '요정 공주', icon: '🧚‍♀️', xpNeeded: 3600 },
  { level: 16, name: '마법 공주', icon: '👸', xpNeeded: 4300 },
  { level: 17, name: '별의 여왕', icon: '🌟', xpNeeded: 5100 },
  { level: 18, name: '무지개 여왕', icon: '🏆', xpNeeded: 6000 },
  { level: 19, name: '우주 여왕', icon: '🚀', xpNeeded: 7000 },
  { level: 20, name: '전설의 요정', icon: '✨', xpNeeded: 8500 },
];

function getLevelInfo(xp) {
  let lvl = LEVEL_SYSTEM[0];
  for (let i = LEVEL_SYSTEM.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_SYSTEM[i].xpNeeded) { lvl = LEVEL_SYSTEM[i]; break; }
  }
  const nextLvl = LEVEL_SYSTEM[Math.min(lvl.level, LEVEL_SYSTEM.length - 1)];
  const currentXpInLevel = xp - lvl.xpNeeded;
  const xpForNext = (lvl.level < 20) ? nextLvl.xpNeeded - lvl.xpNeeded : 1;
  return { ...lvl, currentXpInLevel, xpForNext, totalXp: xp };
}

// Daily mission templates
const MISSION_TEMPLATES = [
  { id: 'learn_hangul', text: '한글 자음 {n}개 배우기', icon: '📖', category: 'hangul', type: 'learn', counts: [2, 3, 5] },
  { id: 'learn_english', text: '영어 알파벳 {n}개 배우기', icon: '🔤', category: 'english', type: 'learn', counts: [2, 3, 5] },
  { id: 'learn_number', text: '숫자 {n}개 배우기', icon: '🔢', category: 'number', type: 'learn', counts: [1, 2, 3] },
  { id: 'quiz', text: '퀴즈 {n}문제 풀기', icon: '❓', type: 'quiz', counts: [3, 5, 7] },
  { id: 'tracing', text: '따라쓰기 {n}개 완성하기', icon: '✏️', type: 'tracing', counts: [1, 2, 3] },
  { id: 'coloring', text: '색칠하기 {n}개 완성하기', icon: '🎨', type: 'coloring', counts: [1, 1, 2] },
  { id: 'counting', text: '숫자 세기 {n}문제 풀기', icon: '🔢', type: 'counting', counts: [2, 3, 5] },
  { id: 'matching', text: '짝맞추기 {n}판 완료하기', icon: '🃏', type: 'matching', counts: [1, 2, 3] },
];

// Counting game emojis
const COUNTING_EMOJIS = ['🍎', '🍌', '🍇', '🌟', '🦋', '🐶', '🎈', '🌸', '🍪', '🐟'];

// Sticker collections
const STICKERS = {
  flowers: ['🌸', '🌺', '🌻', '🌹', '🌷', '💐', '🌼', '🏵️', '💮', '🌿'],
  animals: ['🦄', '🐱', '🐰', '🦋', '🐬', '🐣', '🦜', '🐞', '🦊', '🐼'],
  fairy: ['✨', '🌟', '💫', '⭐', '🦋', '🧚', '👑', '💎', '🎀', '🌈'],
};

// Badge definitions
const BADGES = [
  { id: 'hangul-stage1', name: '한글 새싹', emoji: '🌱', condition: 'hangul_s1', description: '한글 1단계 완료' },
  { id: 'hangul-stage2', name: '한글 꽃잎', emoji: '🌸', condition: 'hangul_s2', description: '한글 2단계 완료' },
  { id: 'hangul-master', name: '한글 박사', emoji: '🏆', condition: 'hangul_s3', description: '한글 3단계 완료' },
  { id: 'english-stage1', name: 'ABC 새싹', emoji: '🅰️', condition: 'english_s1', description: '영어 1단계 완료' },
  { id: 'english-master', name: 'ABC 챔피언', emoji: '🏅', condition: 'english_s3', description: '영어 3단계 완료' },
  { id: 'number-master', name: '숫자 박사', emoji: '🔢', condition: 'number_s3', description: '숫자 3단계 완료' },
  { id: 'quiz-beginner', name: '퀴즈 새싹', emoji: '🌱', condition: 'quiz_10', description: '퀴즈 10문제 정답' },
  { id: 'quiz-king', name: '퀴즈 왕', emoji: '👑', condition: 'quiz_50', description: '퀴즈 50문제 정답' },
  { id: 'matching-star', name: '매칭 스타', emoji: '🃏', condition: 'matching_10', description: '짝맞추기 10회 완료' },
  { id: 'sound-finder', name: '소리 탐험가', emoji: '🔊', condition: 'sound_10', description: '소리찾기 10문제 정답' },
  { id: 'tracing-star', name: '따라쓰기 스타', emoji: '✏️', condition: 'tracing_10', description: '따라쓰기 10회 완료' },
  { id: 'streak-3', name: '3일 연속!', emoji: '🔥', condition: 'streak_3', description: '3일 연속 학습' },
  { id: 'streak-7', name: '일주일 연속!', emoji: '💪', condition: 'streak_7', description: '7일 연속 학습' },
  { id: 'star-collector', name: '별 수집가', emoji: '💫', condition: 'stars_50', description: '별 50개 모으기' },
  { id: 'star-master', name: '별별 마스터', emoji: '🌟', condition: 'stars_200', description: '별 200개 모으기' },
  { id: 'sticker-lover', name: '스티커 수집왕', emoji: '🎨', condition: 'stickers_15', description: '스티커 15개 모으기' },
  { id: 'level-5', name: '무지개 등급', emoji: '🌈', condition: 'level_5', description: '레벨 5 달성' },
  { id: 'level-10', name: '왕관 등급', emoji: '👑', condition: 'level_10', description: '레벨 10 달성' },
  { id: 'all-rounder', name: '만능 천재', emoji: '🎓', condition: 'all_stages', description: '모든 단계 완료' },
];

// Tracing guide points for characters
const TRACING_CHARS = {
  hangul: ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅎ',
           'ㅏ', 'ㅓ', 'ㅗ', 'ㅜ', 'ㅡ', 'ㅣ'],
  english: ['A','B','C','D','E','F','G','H','I','J','K','L','M',
            'N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
  number: ['1','2','3','4','5','6','7','8','9','10'],
};

// Helper functions
function getStageItems(categoryId, stageId) {
  const cat = CATEGORIES[categoryId];
  if (!cat) return [];
  const stage = cat.stages.find(s => s.id === stageId);
  return stage ? stage.items : [];
}

function getAllCategoryItems(categoryId) {
  const cat = CATEGORIES[categoryId];
  if (!cat) return [];
  return cat.stages.reduce((all, s) => [...all, ...s.items], []);
}

function isStageUnlocked(categoryId, stageId, progress) {
  if (stageId === 1) return true;
  const cat = CATEGORIES[categoryId];
  if (!cat) return false;
  const prevStage = cat.stages.find(s => s.id === stageId - 1);
  if (!prevStage) return false;
  const learned = progress.learned[categoryId] || [];
  return prevStage.items.every(item => learned.includes(item.char));
}

function getStageProgress(categoryId, stageId, progress) {
  const stage = CATEGORIES[categoryId]?.stages.find(s => s.id === stageId);
  if (!stage) return { learned: 0, total: 0, percent: 0, complete: false };
  const learned = (progress.learned[categoryId] || []).filter(
    char => stage.items.some(item => item.char === char)
  ).length;
  const total = stage.items.length;
  return { learned, total, percent: total > 0 ? Math.round(learned / total * 100) : 0, complete: learned >= total };
}

function getCategoryProgress(categoryId, progress) {
  const cat = CATEGORIES[categoryId];
  if (!cat) return { learned: 0, total: 0, percent: 0 };
  const allItems = getAllCategoryItems(categoryId);
  const learned = (progress.learned[categoryId] || []).length;
  const total = allItems.length;
  return { learned, total, percent: total > 0 ? Math.round(learned / total * 100) : 0 };
}
