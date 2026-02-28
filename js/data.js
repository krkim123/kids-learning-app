// Learning content data — Stages, Animals, Coloring, etc.

const SHAPE_ICONS = ['\u2605', '\u2606', '\u25CF', '\u25A0', '\u25B2', '\u25C6', '\u2665', '\u2666'];

const HANGUL_CONSONANT_CHARS = [
  '\u3131', '\u3132', '\u3134', '\u3137', '\u3138', '\u3139', '\u3141', '\u3142', '\u3143',
  '\u3145', '\u3146', '\u3147', '\u3148', '\u3149', '\u314A', '\u314B', '\u314C', '\u314D', '\u314E',
];

const HANGUL_CONSONANT_WORDS = [
  'giyeok', 'ssang-giyeok', 'nieun', 'digeut', 'ssang-digeut', 'rieul', 'mieum', 'bieup', 'ssang-bieup',
  'siot', 'ssang-siot', 'ieung', 'jieut', 'ssang-jieut', 'chieut', 'kieuk', 'tieut', 'pieup', 'hieut',
];

const HANGUL_CONSONANTS = HANGUL_CONSONANT_CHARS.map((char, idx) => ({
  char,
  word: HANGUL_CONSONANT_WORDS[idx],
  emoji: SHAPE_ICONS[idx % SHAPE_ICONS.length],
  pronunciation: HANGUL_CONSONANT_WORDS[idx],
  wordPronunciation: HANGUL_CONSONANT_WORDS[idx],
}));

const HANGUL_VOWEL_CHARS = [
  '\u314F', '\u3150', '\u3151', '\u3152', '\u3153', '\u3154', '\u3155', '\u3156', '\u3157', '\u3158', '\u3159',
  '\u315A', '\u315B', '\u315C', '\u315D', '\u315E', '\u315F', '\u3160', '\u3161', '\u3162', '\u3163',
];

const HANGUL_VOWEL_WORDS = [
  'a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i',
];

const HANGUL_VOWELS = HANGUL_VOWEL_CHARS.map((char, idx) => ({
  char,
  word: HANGUL_VOWEL_WORDS[idx],
  emoji: SHAPE_ICONS[(idx + 2) % SHAPE_ICONS.length],
  pronunciation: HANGUL_VOWEL_WORDS[idx],
  wordPronunciation: HANGUL_VOWEL_WORDS[idx],
}));

const HANGUL_SYLLABLE_CHARS = ['\uAC00', '\uB098', '\uB2E4', '\uB77C', '\uB9C8', '\uBC14', '\uC0AC', '\uC544', '\uC790', '\uD558'];
const HANGUL_SYLLABLE_WORDS = ['ga', 'na', 'da', 'ra', 'ma', 'ba', 'sa', 'a', 'ja', 'ha'];

const HANGUL_SYLLABLES = HANGUL_SYLLABLE_CHARS.map((char, idx) => ({
  char,
  word: HANGUL_SYLLABLE_WORDS[idx],
  emoji: SHAPE_ICONS[(idx + 4) % SHAPE_ICONS.length],
  pronunciation: HANGUL_SYLLABLE_WORDS[idx],
  wordPronunciation: HANGUL_SYLLABLE_WORDS[idx],
}));

const KOREAN_NUMBER_DIGITS = ['', 'il', 'i', 'sam', 'sa', 'o', 'yuk', 'chil', 'pal', 'gu'];

function toKoreanNumber(num) {
  if (num <= 0) return 'yeong';
  if (num < 10) return KOREAN_NUMBER_DIGITS[num];
  if (num === 10) return 'sip';

  const tens = Math.floor(num / 10);
  const ones = num % 10;
  const tensText = tens === 1 ? 'sip' : (KOREAN_NUMBER_DIGITS[tens] + 'sip');
  return ones === 0 ? tensText : (tensText + KOREAN_NUMBER_DIGITS[ones]);
}

const NUMBER_ICONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

const NUMBERS = Array.from({ length: 50 }, (_, idx) => {
  const value = idx + 1;
  const reading = toKoreanNumber(value);
  return {
    char: String(value),
    word: reading,
    emoji: NUMBER_ICONS[idx % NUMBER_ICONS.length],
    pronunciation: reading,
    wordPronunciation: reading,
  };
});

const ENGLISH_UPPER_WORDS = [
  'Apple', 'Bear', 'Cat', 'Dog', 'Elephant', 'Fish', 'Grape', 'Hat', 'Ice cream', 'Juice',
  'King', 'Lion', 'Moon', 'Nose', 'Orange', 'Penguin', 'Queen', 'Rabbit', 'Sun', 'Tiger',
  'Umbrella', 'Violin', 'Whale', 'Xylophone', 'Yogurt', 'Zebra',
];

const ENGLISH_LOWER_WORDS = [
  'ant', 'ball', 'cake', 'duck', 'egg', 'frog', 'gift', 'house', 'ink', 'jam', 'key', 'leaf',
  'milk', 'nest', 'owl', 'pizza', 'quilt', 'ring', 'star', 'train', 'ukulele', 'vase', 'watch', 'x-ray',
];

const ENGLISH_UPPER = ENGLISH_UPPER_WORDS.map((word, idx) => ({
  char: String.fromCharCode(65 + idx),
  word,
  emoji: SHAPE_ICONS[idx % SHAPE_ICONS.length],
  pronunciation: String.fromCharCode(65 + idx),
  wordPronunciation: word,
}));

const ENGLISH_LOWER = ENGLISH_LOWER_WORDS.map((word, idx) => ({
  char: String.fromCharCode(97 + idx),
  word,
  emoji: SHAPE_ICONS[(idx + 1) % SHAPE_ICONS.length],
  pronunciation: String.fromCharCode(97 + idx),
  wordPronunciation: word,
}));

const ENGLISH = [...ENGLISH_UPPER, ...ENGLISH_LOWER];

const HANGUL_ALL = [...HANGUL_CONSONANTS, ...HANGUL_VOWELS, ...HANGUL_SYLLABLES];

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
    id: 'hangul', name: '\uD55C\uAE00', icon: '\uD83D\uDD24', color: '#FF8A65', tabIcon: '\uD83D\uDD24',
    stages: [
      { id: 1, name: '1\uB2E8\uACC4', subtitle: '1 ~ 10', items: HANGUL_ALL.slice(0, 10) },
      { id: 2, name: '2\uB2E8\uACC4', subtitle: '11 ~ 20', items: HANGUL_ALL.slice(10, 20) },
      { id: 3, name: '3\uB2E8\uACC4', subtitle: '21 ~ 30', items: HANGUL_ALL.slice(20, 30) },
      { id: 4, name: '4\uB2E8\uACC4', subtitle: '31 ~ 40', items: HANGUL_ALL.slice(30, 40) },
      { id: 5, name: '5\uB2E8\uACC4', subtitle: '41 ~ 50', items: HANGUL_ALL.slice(40, 50) },
    ]
  },
  english: {
    id: 'english', name: '\uC601\uC5B4', icon: '\uD83D\uDD20', color: '#42A5F5', tabIcon: '\uD83D\uDD20',
    stages: [
      { id: 1, name: '1\uB2E8\uACC4', subtitle: 'A ~ J', items: ENGLISH.slice(0, 10) },
      { id: 2, name: '2\uB2E8\uACC4', subtitle: 'K ~ T', items: ENGLISH.slice(10, 20) },
      { id: 3, name: '3\uB2E8\uACC4', subtitle: 'U ~ d', items: ENGLISH.slice(20, 30) },
      { id: 4, name: '4\uB2E8\uACC4', subtitle: 'e ~ n', items: ENGLISH.slice(30, 40) },
      { id: 5, name: '5\uB2E8\uACC4', subtitle: 'o ~ x', items: ENGLISH.slice(40, 50) },
    ]
  },
  number: {
    id: 'number', name: '\uC22B\uC790', icon: '\uD83D\uDD22', color: '#66BB6A', tabIcon: '\uD83D\uDD22',
    stages: [
      { id: 1, name: '1\uB2E8\uACC4', subtitle: '1 ~ 10', items: NUMBERS.slice(0, 10) },
      { id: 2, name: '2\uB2E8\uACC4', subtitle: '11 ~ 20', items: NUMBERS.slice(10, 20) },
      { id: 3, name: '3\uB2E8\uACC4', subtitle: '21 ~ 30', items: NUMBERS.slice(20, 30) },
      { id: 4, name: '4\uB2E8\uACC4', subtitle: '31 ~ 40', items: NUMBERS.slice(30, 40) },
      { id: 5, name: '5\uB2E8\uACC4', subtitle: '41 ~ 50', items: NUMBERS.slice(40, 50) },
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
  { id: 'hangul-stage1', name: 'Hangul Starter', emoji: 'H1', condition: 'hangul_s1', description: 'Hangul stage 1 complete' },
  { id: 'hangul-stage2', name: 'Hangul Bloom', emoji: 'H2', condition: 'hangul_s2', description: 'Hangul stage 2 complete' },
  { id: 'hangul-master', name: 'Hangul Master', emoji: 'HM', condition: 'hangul_s3', description: 'Hangul final stage complete' },
  { id: 'english-stage1', name: 'ABC Starter', emoji: 'E1', condition: 'english_s1', description: 'English stage 1 complete' },
  { id: 'english-master', name: 'ABC Champion', emoji: 'EM', condition: 'english_s3', description: 'English final stage complete' },
  { id: 'number-master', name: 'Number Master', emoji: 'NM', condition: 'number_s3', description: 'Number final stage complete' },
  { id: 'quiz-beginner', name: 'Quiz Starter', emoji: 'Q1', condition: 'quiz_10', description: '10 quiz answers correct' },
  { id: 'quiz-king', name: 'Quiz King', emoji: 'QK', condition: 'quiz_50', description: '50 quiz answers correct' },
  { id: 'matching-star', name: 'Matching Star', emoji: 'M*', condition: 'matching_10', description: '10 matching clears' },
  { id: 'sound-finder', name: 'Sound Finder', emoji: 'SF', condition: 'sound_10', description: '10 sound answers correct' },
  { id: 'tracing-star', name: 'Tracing Star', emoji: 'TS', condition: 'tracing_10', description: '10 tracing clears' },
  { id: 'streak-3', name: '3-Day Streak', emoji: 'S3', condition: 'streak_3', description: '3-day learning streak' },
  { id: 'streak-7', name: '7-Day Streak', emoji: 'S7', condition: 'streak_7', description: '7-day learning streak' },
  { id: 'star-collector', name: 'Star Collector', emoji: 'SC', condition: 'stars_50', description: 'Collect 50 stars' },
  { id: 'star-master', name: 'Star Master', emoji: 'SM', condition: 'stars_200', description: 'Collect 200 stars' },
  { id: 'sticker-lover', name: 'Sticker Lover', emoji: 'SL', condition: 'stickers_15', description: 'Collect 15 stickers' },
  { id: 'level-5', name: 'Level 5', emoji: 'L5', condition: 'level_5', description: 'Reach level 5' },
  { id: 'level-10', name: 'Level 10', emoji: 'L10', condition: 'level_10', description: 'Reach level 10' },
  { id: 'all-rounder', name: 'All Rounder', emoji: 'AR', condition: 'all_stages', description: 'Complete all stages' },
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
