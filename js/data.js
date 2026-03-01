// Learning content data ??Stages, Animals, Coloring, etc.

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
  if (num === 100) return 'baek';
  if (num > 100) return String(num);

  const tens = Math.floor(num / 10);
  const ones = num % 10;
  const tensText = tens === 1 ? 'sip' : (KOREAN_NUMBER_DIGITS[tens] + 'sip');
  return ones === 0 ? tensText : (tensText + KOREAN_NUMBER_DIGITS[ones]);
}

const NUMBER_ICONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

const NUMBERS = Array.from({ length: 100 }, (_, idx) => {
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

const HANGUL_COMBO_CHARS = [
  '\uAC00', '\uAC70', '\uACE0', '\uAD6C', '\uAE30',
  '\uB098', '\uB108', '\uB178', '\uB204', '\uB2C8',
  '\uB2E4', '\uB354', '\uB3C4', '\uB450', '\uB514',
  '\uB9C8', '\uBA38', '\uBAA8', '\uBB34', '\uBBF8',
];

const HANGUL_COMBO_WORDS = [
  'ga', 'geo', 'go', 'gu', 'gi',
  'na', 'neo', 'no', 'nu', 'ni',
  'da', 'deo', 'do', 'du', 'di',
  'ma', 'meo', 'mo', 'mu', 'mi',
];

const HANGUL_COMBO_PRACTICE = HANGUL_COMBO_CHARS.map((char, idx) => ({
  id: `hangul-combo-${idx + 1}`,
  char,
  word: HANGUL_COMBO_WORDS[idx],
  emoji: SHAPE_ICONS[(idx + 3) % SHAPE_ICONS.length],
  pronunciation: HANGUL_COMBO_WORDS[idx],
  wordPronunciation: HANGUL_COMBO_WORDS[idx],
}));

const ENGLISH_BASIC_WORDS = [
  { word: 'cat', korean: '\uACE0\uC591\uC774', emoji: '\uD83D\uDC31' },
  { word: 'dog', korean: '\uAC15\uC544\uC9C0', emoji: '\uD83D\uDC36' },
  { word: 'sun', korean: '\uD0DC\uC591', emoji: '\u2600\uFE0F' },
  { word: 'moon', korean: '\uB2EC', emoji: '\uD83C\uDF19' },
  { word: 'star', korean: '\uBCC4', emoji: '\u2B50' },
  { word: 'book', korean: '\uCC45', emoji: '\uD83D\uDCD6' },
  { word: 'pen', korean: '\uD39C', emoji: '\uD83D\uDD8A\uFE0F' },
  { word: 'car', korean: '\uCC28', emoji: '\uD83D\uDE97' },
  { word: 'bus', korean: '\uBC84\uC2A4', emoji: '\uD83D\uDE8C' },
  { word: 'tree', korean: '\uB098\uBB34', emoji: '\uD83C\uDF33' },
  { word: 'water', korean: '\uBB3C', emoji: '\uD83D\uDCA7' },
  { word: 'milk', korean: '\uC6B0\uC720', emoji: '\uD83E\uDD5B' },
  { word: 'rice', korean: '\uBC25', emoji: '\uD83C\uDF5A' },
  { word: 'bread', korean: '\uBE75', emoji: '\uD83C\uDF5E' },
  { word: 'fish', korean: '\uBB3C\uACE0\uAE30', emoji: '\uD83D\uDC1F' },
  { word: 'bird', korean: '\uC0C8', emoji: '\uD83D\uDC26' },
  { word: 'apple', korean: '\uC0AC\uACFC', emoji: '\uD83C\uDF4E' },
  { word: 'banana', korean: '\uBC14\uB098\uB098', emoji: '\uD83C\uDF4C' },
  { word: 'grape', korean: '\uD3EC\uB3C4', emoji: '\uD83C\uDF47' },
  { word: 'orange', korean: '\uC624\uB80C\uC9C0', emoji: '\uD83C\uDF4A' },
  { word: 'happy', korean: '\uAE30\uC068', emoji: '\uD83D\uDE0A' },
  { word: 'sad', korean: '\uC2AC\uD514', emoji: '\uD83D\uDE22' },
  { word: 'big', korean: '\uD070', emoji: '\uD83D\uDC18' },
  { word: 'small', korean: '\uC791\uC740', emoji: '\uD83D\uDC1C' },
  { word: 'red', korean: '\uBE68\uAC15', emoji: '\uD83D\uDD34' },
  { word: 'blue', korean: '\uD30C\uB791', emoji: '\uD83D\uDD35' },
  { word: 'green', korean: '\uCD08\uB85D', emoji: '\uD83D\uDFE2' },
  { word: 'yellow', korean: '\uB178\uB791', emoji: '\uD83D\uDFE1' },
  { word: 'one', korean: '\uD558\uB098', emoji: '1' },
  { word: 'two', korean: '\uB458', emoji: '2' },
];

const ENGLISH_BASICS = ENGLISH_BASIC_WORDS.map((item, idx) => ({
  id: `english-word-${idx + 1}`,
  char: item.word.toUpperCase(),
  word: item.korean,
  emoji: item.emoji,
  pronunciation: item.word,
  wordPronunciation: item.word,
}));

const ENGLISH_ALL = [...ENGLISH, ...ENGLISH_BASICS];
const HANGUL_ALL = [...HANGUL_CONSONANTS, ...HANGUL_VOWELS, ...HANGUL_SYLLABLES, ...HANGUL_COMBO_PRACTICE];

function makeMathItems(mode, lessons, symbol, speakWord, emoji) {
  return lessons.map((lesson, idx) => {
    const [a, b] = lesson;
    let answer = 0;
    if (mode === 'add') answer = a + b;
    else if (mode === 'sub') answer = a - b;
    else if (mode === 'mul' || mode === 'table') answer = a * b;
    else if (mode === 'div') answer = Math.floor(a / b);
    return {
      id: `math-${mode}-${idx + 1}`,
      char: String(answer),
      word: `${a} ${symbol} ${b}`,
      emoji,
      pronunciation: `${a} ${speakWord} ${b}`,
      wordPronunciation: String(answer),
    };
  });
}

const MATH_ADD = makeMathItems(
  'add',
  [[1, 1], [2, 1], [2, 2], [3, 2], [4, 2], [4, 3], [5, 3], [6, 3], [6, 4], [7, 4], [8, 4], [9, 4]],
  '+',
  '\uB354\uD558\uAE30',
  '\u2795'
);

const MATH_SUB = makeMathItems(
  'sub',
  [[2, 1], [4, 2], [6, 3], [8, 4], [10, 5], [12, 6], [14, 7], [16, 8], [18, 9], [20, 10], [22, 11], [24, 12]],
  '-',
  '\uBE7C\uAE30',
  '\u2796'
);

const MATH_MUL = makeMathItems(
  'mul',
  [[1, 2], [1, 3], [2, 2], [1, 5], [2, 3], [1, 7], [2, 4], [3, 3], [2, 5], [1, 11], [3, 4], [2, 6]],
  '\u00D7',
  '\uACF1\uD558\uAE30',
  '\u2716\uFE0F'
);

const MATH_DIV = makeMathItems(
  'div',
  [[2, 2], [4, 2], [6, 2], [8, 2], [10, 2], [12, 2], [14, 2], [16, 2], [18, 2], [20, 2], [22, 2], [24, 2]],
  '\u00F7',
  '\uB098\uB204\uAE30',
  '\u2797'
);

const MATH_TABLE_LESSONS = [];
for (let dan = 2; dan <= 9; dan++) {
  for (let num = 1; num <= 4; num++) {
    MATH_TABLE_LESSONS.push([dan, num]);
  }
}
const MATH_TABLE = makeMathItems('table', MATH_TABLE_LESSONS, '\u00D7', '\uACF1\uD558\uAE30', '\uD83D\uDD22');

// Animals, Fruits, Vehicles for naming game
const WORD_GROUPS = {
  animals: {
    name: '\uB3D9\uBB3C', icon: '\uD83D\uDC3E',
    items: [
      { name: '\uAC15\uC544\uC9C0', emoji: '\uD83D\uDC36', sound: '\uBA4D\uBA4D' },
      { name: '\uACE0\uC591\uC774', emoji: '\uD83D\uDC31', sound: '\uC57C\uC639' },
      { name: '\uD1A0\uB07C', emoji: '\uD83D\uDC30', sound: '\uAE61\uAE61' },
      { name: '\uACE0\uC2B4\uB3C4\uCE58', emoji: '\uD83E\uDD94', sound: '\uCF54\uCF54' },
      { name: '\uC0AC\uC790', emoji: '\uD83E\uDD81', sound: '\uC5B4\uD765' },
      { name: '\uCF54\uB07C\uB9AC', emoji: '\uD83D\uDC18', sound: '\uBFCC\uC6B0' },
      { name: '\uC6D0\uC22D\uC774', emoji: '\uD83D\uDC35', sound: '\uC6B0\uD0A4' },
      { name: '\uD310\uB2E4', emoji: '\uD83D\uDC3C', sound: '\uBB40\uCCB0' },
      { name: '\uB3CC\uACE0\uB798', emoji: '\uD83D\uDC2C', sound: '\uC1E0\uC1E0' },
      { name: '\uB098\uBE44', emoji: '\uD83E\uDD8B', sound: '\uD314\uB791' },
      { name: '\uC624\uB9AC', emoji: '\uD83E\uDD86', sound: '\uAFE5\uAFE5' },
      { name: '\uACE0\uB798', emoji: '\uD83D\uDC0B', sound: '\uBF80\uC6B0' },
      { name: '\uB3FC\uC9C0', emoji: '\uD83D\uDC37', sound: '\uAFCD\uAFCD' },
      { name: '\uC591', emoji: '\uD83D\uDC11', sound: '\uBA54\uC5D0' },
      { name: '\uB9D0', emoji: '\uD83D\uDC34', sound: '\uD788\uD799' },
    ]
  },
  fruits: {
    name: '\uACFC\uC77C', icon: '\uD83C\uDF4E',
    items: [
      { name: '\uC0AC\uACFC', emoji: '\uD83C\uDF4E' },
      { name: '\uBC14\uB098\uB098', emoji: '\uD83C\uDF4C' },
      { name: '\uD3EC\uB3C4', emoji: '\uD83C\uDF47' },
      { name: '\uB538\uAE30', emoji: '\uD83C\uDF53' },
      { name: '\uC218\uBC15', emoji: '\uD83C\uDF49' },
      { name: '\uC624\uB80C\uC9C0', emoji: '\uD83C\uDF4A' },
      { name: '\uBCF5\uC22D\uC544', emoji: '\uD83C\uDF51' },
      { name: '\uCCB4\uB9AC', emoji: '\uD83C\uDF52' },
      { name: '\uD30C\uC778\uC560\uD50C', emoji: '\uD83C\uDF4D' },
      { name: '\uD0A4\uC704', emoji: '\uD83E\uDD5D' },
    ]
  },
  vehicles: {
    name: '\uD0C8\uAC83', icon: '\uD83D\uDE97',
    items: [
      { name: '\uC790\uB3D9\uCC28', emoji: '\uD83D\uDE97' },
      { name: '\uBC84\uC2A4', emoji: '\uD83D\uDE8C' },
      { name: '\uAE30\uCC28', emoji: '\uD83D\uDE86' },
      { name: '\uBE44\uD589\uAE30', emoji: '\u2708\uFE0F' },
      { name: '\uBC30', emoji: '\uD83D\uDEA2' },
      { name: '\uC790\uC804\uAC70', emoji: '\uD83D\uDEB2' },
      { name: '\uC18C\uBC29\uCC28', emoji: '\uD83D\uDE92' },
      { name: '\uACBD\uCC30\uCC28', emoji: '\uD83D\uDE93' },
      { name: '\uD0DD\uC2DC', emoji: '\uD83D\uDE95' },
      { name: '\uD5EC\uB9AC\uCF65\uD130', emoji: '\uD83D\uDE81' },
    ]
  }
};

// Coloring designs ??simple SVG regions
const COLORING_DESIGNS = [
  {
    id: 'star', name: '\uBCC4', emoji: '\u2B50',
    width: 300, height: 300,
    regions: [
      { id: 'body', path: 'M150,20 L185,110 L280,110 L205,165 L230,260 L150,210 L70,260 L95,165 L20,110 L115,110 Z', defaultColor: '#f0f0f0' },
      { id: 'eye1', path: 'M120,120 A10,10 0 1,1 140,120 A10,10 0 1,1 120,120 Z', defaultColor: '#e0e0e0' },
      { id: 'eye2', path: 'M160,120 A10,10 0 1,1 180,120 A10,10 0 1,1 160,120 Z', defaultColor: '#e0e0e0' },
      { id: 'mouth', path: 'M130,155 Q150,175 170,155', defaultColor: '#e0e0e0', isStroke: true },
    ]
  },
  {
    id: 'flower', name: '\uAF43', emoji: '\uD83C\uDF38',
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
    id: 'butterfly', name: '\uB098\uBE44', emoji: '\uD83E\uDD8B',
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
    id: 'fish', name: '\uBB3C\uACE0\uAE30', emoji: '\uD83D\uDC1F',
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
    id: 'house', name: '\uC9D1', emoji: '\uD83C\uDFE0',
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
    id: 'heart', name: '\uD558\uD2B8', emoji: '\u2764\uFE0F',
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
  { char: '\u3131', index: 0 }, { char: '\u3134', index: 2 }, { char: '\u3137', index: 3 },
  { char: '\u3139', index: 5 }, { char: '\u3141', index: 6 }, { char: '\u3142', index: 7 },
  { char: '\u3145', index: 9 }, { char: '\u3147', index: 11 }, { char: '\u3148', index: 12 },
  { char: '\u314E', index: 18 },
];

const HANGUL_COMBINE_VOWELS = [
  { char: '\u314F', index: 0 }, { char: '\u3151', index: 2 }, { char: '\u3153', index: 4 },
  { char: '\u3155', index: 6 }, { char: '\u3157', index: 8 }, { char: '\u315B', index: 12 },
  { char: '\u315C', index: 13 }, { char: '\u3160', index: 17 }, { char: '\u3161', index: 18 },
  { char: '\u3163', index: 20 },
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
      { id: 6, name: '6\uB2E8\uACC4', subtitle: '51 ~ 60 (\uC870\uD569)', items: HANGUL_ALL.slice(50, 60) },
      { id: 7, name: '7\uB2E8\uACC4', subtitle: '61 ~ 70 (\uC870\uD569)', items: HANGUL_ALL.slice(60, 70) },
    ]
  },
  english: {
    id: 'english', name: '\uC601\uC5B4', icon: '\uD83D\uDD20', color: '#42A5F5', tabIcon: '\uD83D\uDD20',
    stages: [
      { id: 1, name: '1\uB2E8\uACC4', subtitle: 'A ~ J', items: ENGLISH_ALL.slice(0, 10) },
      { id: 2, name: '2\uB2E8\uACC4', subtitle: 'K ~ T', items: ENGLISH_ALL.slice(10, 20) },
      { id: 3, name: '3\uB2E8\uACC4', subtitle: 'U ~ d', items: ENGLISH_ALL.slice(20, 30) },
      { id: 4, name: '4\uB2E8\uACC4', subtitle: 'e ~ n', items: ENGLISH_ALL.slice(30, 40) },
      { id: 5, name: '5\uB2E8\uACC4', subtitle: 'o ~ x', items: ENGLISH_ALL.slice(40, 50) },
      { id: 6, name: '6\uB2E8\uACC4', subtitle: '\uAE30\uCD08 \uB2E8\uC5B4 1', items: ENGLISH_ALL.slice(50, 60) },
      { id: 7, name: '7\uB2E8\uACC4', subtitle: '\uAE30\uCD08 \uB2E8\uC5B4 2', items: ENGLISH_ALL.slice(60, 70) },
      { id: 8, name: '8\uB2E8\uACC4', subtitle: '\uAE30\uCD08 \uB2E8\uC5B4 3', items: ENGLISH_ALL.slice(70, 80) },
    ]
  },
  number: {
    id: 'number', name: '\uC22B\uC790', icon: '\uD83D\uDD22', color: '#66BB6A', tabIcon: '\uD83D\uDD22',
    stages: [
      { id: 1, name: '1\uB2E8\uACC4', subtitle: '1 ~ 20', items: NUMBERS.slice(0, 20) },
      { id: 2, name: '2\uB2E8\uACC4', subtitle: '21 ~ 40', items: NUMBERS.slice(20, 40) },
      { id: 3, name: '3\uB2E8\uACC4', subtitle: '41 ~ 60', items: NUMBERS.slice(40, 60) },
      { id: 4, name: '4\uB2E8\uACC4', subtitle: '61 ~ 80', items: NUMBERS.slice(60, 80) },
      { id: 5, name: '5\uB2E8\uACC4', subtitle: '81 ~ 100', items: NUMBERS.slice(80, 100) },
    ]
  },
  math: {
    id: 'math', name: '\uC218\uD559', icon: '\uD83E\uDDEE', color: '#FFA726', tabIcon: '\uD83E\uDDEE',
    stages: [
      { id: 1, name: '1\uB2E8\uACC4', subtitle: '\uB367\uC148 \uAE30\uCD08', items: MATH_ADD },
      { id: 2, name: '2\uB2E8\uACC4', subtitle: '\uBE84\uC148 \uAE30\uCD08', items: MATH_SUB },
      { id: 3, name: '3\uB2E8\uACC4', subtitle: '\uACF1\uC148 \uAE30\uCD08', items: MATH_MUL },
      { id: 4, name: '4\uB2E8\uACC4', subtitle: '\uB098\uB217\uC148 \uAE30\uCD08', items: MATH_DIV },
      { id: 5, name: '5\uB2E8\uACC4', subtitle: '\uAD6C\uAD6C\uB2E8 \uAE30\uCD08', items: MATH_TABLE },
    ]
  }
};

// Level system
const LEVEL_SYSTEM = [
  { level: 1, name: '\uC0C8\uC2F9', icon: '\uD83C\uDF31', xpNeeded: 0 },
  { level: 2, name: '\uC787\uC0C8', icon: '\uD83C\uDF3F', xpNeeded: 30 },
  { level: 3, name: '\uAF43\uC2F9\uC774', icon: '\uD83C\uDF3C', xpNeeded: 80 },
  { level: 4, name: '\uAF43', icon: '\uD83C\uDF38', xpNeeded: 150 },
  { level: 5, name: '\uBB34\uC9C0\uAC1C', icon: '\uD83C\uDF08', xpNeeded: 250 },
  { level: 6, name: '\uB098\uBE44', icon: '\uD83E\uDD8B', xpNeeded: 380 },
  { level: 7, name: '\uBCC4', icon: '\u2B50', xpNeeded: 550 },
  { level: 8, name: '\uB2EC', icon: '\uD83C\uDF19', xpNeeded: 750 },
  { level: 9, name: '\uD0DC\uC591', icon: '\u2600\uFE0F', xpNeeded: 1000 },
  { level: 10, name: '\uC740\uD558\uC218', icon: '\uD83C\uDF0C', xpNeeded: 1300 },
  { level: 11, name: '\uBCF4\uC11D', icon: '\uD83D\uDC8E', xpNeeded: 1650 },
  { level: 12, name: '\uB9C8\uBC95\uBD09', icon: '\uD83E\uDE84', xpNeeded: 2050 },
  { level: 13, name: '\uC720\uB2C8\uCF58', icon: '\uD83E\uDD84', xpNeeded: 2500 },
  { level: 14, name: '\uC6A9', icon: '\uD83D\uDC32', xpNeeded: 3000 },
  { level: 15, name: '\uC694\uC815 \uACF5\uC8FC', icon: '\uD83E\uDDDA\u200D\u2640\uFE0F', xpNeeded: 3600 },
  { level: 16, name: '\uB9C8\uBC95 \uACF5\uC8FC', icon: '\uD83D\uDC78', xpNeeded: 4300 },
  { level: 17, name: '\uBCC4\uC758 \uC218\uD638\uC790', icon: '\uD83C\uDF20', xpNeeded: 5100 },
  { level: 18, name: '\uBB34\uC9C0\uAC1C \uC218\uD638\uC790', icon: '\uD83C\uDF08', xpNeeded: 6000 },
  { level: 19, name: '\uC6B0\uC8FC \uC218\uD638\uC790', icon: '\uD83D\uDE80', xpNeeded: 7000 },
  { level: 20, name: '\uC804\uC124\uC758 \uC694\uC815', icon: '\uD83E\uDDDD', xpNeeded: 8500 },
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
  { id: 'learn_hangul', text: '\uD55C\uAE00 \uAE00\uC790 {n}\uAC1C \uBC30\uC6B0\uAE30', icon: '\uD83D\uDD24', category: 'hangul', type: 'learn', counts: [2, 3, 5] },
  { id: 'learn_english', text: '\uC601\uC5B4 \uC54C\uD30C\uBCB3 {n}\uAC1C \uBC30\uC6B0\uAE30', icon: '\uD83D\uDD20', category: 'english', type: 'learn', counts: [2, 3, 5] },
  { id: 'learn_number', text: '\uC22B\uC790 {n}\uAC1C \uBC30\uC6B0\uAE30', icon: '\uD83D\uDD22', category: 'number', type: 'learn', counts: [1, 2, 3] },
  { id: 'learn_math', text: '\uc218\ud559 \uc2dd {n}\uac1c \ubc30\uc6b0\uae30', icon: '\ud83e\uddee', category: 'math', type: 'learn', counts: [1, 2, 3] },
  { id: 'quiz', text: '\uD034\uC988 {n}\uBB38\uC81C \uD480\uAE30', icon: '\u2753', type: 'quiz', counts: [3, 5, 7] },
  { id: 'tracing', text: '\uB530\uB77C\uC4F0\uAE30 {n}\uAC1C \uC644\uC131\uD558\uAE30', icon: '\u270D\uFE0F', type: 'tracing', counts: [1, 2, 3] },
  { id: 'coloring', text: '\uC0C9\uCE60\uD558\uAE30 {n}\uAC1C \uC644\uC131\uD558\uAE30', icon: '\uD83C\uDFA8', type: 'coloring', counts: [1, 1, 2] },
  { id: 'movement_break', text: '\uC6C0\uC9C1\uC784 \uC26C\uAE30 {n}\uD68C', icon: '\uD83E\uDDD8', type: 'break', counts: [1, 1, 2] },
  { id: 'counting', text: '\uC22B\uC790 \uC138\uAE30 {n}\uBB38\uC81C \uD480\uAE30', icon: '\uD83D\uDD22', type: 'counting', counts: [2, 3, 5] },
  { id: 'matching', text: '\uC9DD\uB9DE\uCD94\uAE30 {n}\uD310 \uC644\uB8CC\uD558\uAE30', icon: '\uD83E\uDDE9', type: 'matching', counts: [1, 2, 3] },
  { id: 'tower_play', text: '2.5D \uD0C0\uC6CC {n}\uD68C \uD50C\uB808\uC774', icon: '\uD83C\uDFD7\uFE0F', type: 'tower', counts: [1, 2, 3] },
  { id: 'shape3d_play', text: '3D 도형 맞추기 {n}회 성공', icon: '🧊', type: 'shape3d', counts: [1, 2, 3] },
  { id: 'net3d_play', text: '3D 모형 해석 {n}회 성공', icon: '🧩', type: 'net3d', counts: [1, 2, 3] },
  { id: 'github_pack_play', text: 'Mini game {n}회 플레이', icon: '🕹️', type: 'github-pack', counts: [1, 2, 3] },
  { id: 'tap_rush_finish', text: 'Tap Rush {n}회 완료', icon: '⚡', type: 'generated', category: 'tap-rush', counts: [1, 2, 3] },
  { id: 'grid_hunt_finish', text: 'Grid Hunt {n}회 완료', icon: '🎯', type: 'generated', category: 'grid-hunt', counts: [1, 2, 3] },
  { id: 'rhythm_hit_finish', text: 'Rhythm Hit {n}회 완료', icon: '🎵', type: 'generated', category: 'rhythm-hit', counts: [1, 2, 3] },
];

// Curated cognition resources for parent-guided learning routines
const BRAIN_DEVELOPMENT_LIBRARY = [
  {
    id: 'lang-pattern',
    icon: '🧠',
    title: 'Language Pattern Play',
    description: 'Sound-letter matching and pattern spotting to strengthen verbal working memory.',
    focus: 'language-memory',
    ageGroups: ['toddler', 'child', 'older'],
    action: { type: 'game', gameId: 'sound', categoryId: 'hangul' },
  },
  {
    id: 'visual-span',
    icon: '👀',
    title: 'Visual Span Builder',
    description: 'Short visual-memory rounds to train attention span and recall speed.',
    focus: 'visual-memory',
    ageGroups: ['child', 'older'],
    action: { type: 'github-pack' },
  },
  {
    id: 'logic-tower',
    icon: '🏗️',
    title: 'Logic Tower Challenge',
    description: 'Step-by-step question solving with instant feedback and combo rewards.',
    focus: 'logic',
    ageGroups: ['child', 'older'],
    action: { type: 'game', gameId: 'tower', categoryId: 'number' },
  },
  {
    id: 'exec-control',
    icon: '🎯',
    title: 'Executive Control Drill',
    description: 'Rule-switching and inhibitory-control mini games for cognitive flexibility.',
    focus: 'executive-control',
    ageGroups: ['child', 'older'],
    action: { type: 'benchmark' },
  },
  {
    id: 'spatial-reasoning',
    icon: '🧩',
    title: 'Spatial Reasoning Lab',
    description: 'Pattern blocks and matching tasks to improve visuospatial intelligence.',
    focus: 'spatial',
    ageGroups: ['toddler', 'child', 'older'],
    action: { type: 'game', gameId: 'matching', categoryId: 'number' },
  },
  {
    id: 'creative-focus',
    icon: '🎨',
    title: 'Creative Focus Studio',
    description: 'Calm coloring sessions for sustained attention and emotional regulation.',
    focus: 'focus-regulation',
    ageGroups: ['toddler', 'child', 'older'],
    action: { type: 'coloring' },
  },
];

// IQ-oriented micro game routes for quick daily cycles
const IQ_GAME_PLAYLIST = [
  { id: 'iq-quiz', icon: '❓', title: 'Fast Quiz', subtitle: 'Reasoning speed', route: { type: 'game', gameId: 'quiz', categoryId: 'math' } },
  { id: 'iq-count', icon: '🔢', title: 'Count Sprint', subtitle: 'Numeracy accuracy', route: { type: 'game', gameId: 'counting', categoryId: 'number' } },
  { id: 'iq-tower', icon: '🏙️', title: 'Sky Tower', subtitle: 'Working memory', route: { type: 'game', gameId: 'tower', categoryId: 'english' } },
  { id: 'iq-shape3d', icon: '🧊', title: '3D Shape Match', subtitle: 'Spatial intelligence', route: { type: 'game', gameId: 'shape3d', categoryId: 'math' } },
  { id: 'iq-net3d', icon: '🧩', title: '3D Net Lab', subtitle: 'Model interpretation', route: { type: 'game', gameId: 'net3d', categoryId: 'math' } },
  { id: 'iq-pack', icon: '🕹️', title: 'Brain Pack', subtitle: '118 mini games', route: { type: 'github-pack' } },
];

// Counting game emojis
const COUNTING_EMOJIS = ['\uD83C\uDF4E', '\uD83C\uDF4C', '\uD83C\uDF47', '\u2B50', '\uD83E\uDD8B', '\uD83D\uDC36', '\uD83D\uDCA1', '\uD83C\uDF38', '\uD83D\uDC99', '\uD83D\uDC1F'];

// Sticker collections
const STICKERS = {
  flowers: ['\uD83C\uDF38', '\uD83C\uDF3A', '\uD83C\uDF37', '\uD83C\uDF39', '\uD83C\uDF3C', '\uD83C\uDF3B', '\uD83C\uDF3F', '\uD83C\uDF40', '\uD83C\uDF41', '\uD83C\uDF44'],
  animals: ['\uD83E\uDD84', '\uD83D\uDC31', '\uD83D\uDC30', '\uD83E\uDD8B', '\uD83D\uDC2C', '\uD83D\uDC36', '\uD83E\uDD81', '\uD83D\uDC3B', '\uD83D\uDC2F', '\uD83D\uDC18'],
  fairy: ['\uD83E\uDDDA\u200D\u2640\uFE0F', '\uD83C\uDF20', '\uD83D\uDCAB', '\u2B50', '\uD83E\uDD8B', '\uD83E\uDDDA\u200D\u2640\uFE0F', '\uD83C\uDF0C', '\uD83D\uDC8E', '\uD83D\uDE80', '\uD83C\uDF08'],
  tower: ['\uD83C\uDFD7\uFE0F', '\uD83C\uDFDB\uFE0F', '\uD83C\uDFE2', '\uD83C\uDFD9\uFE0F', '\uD83D\uDDFA\uFE0F', '\uD83C\uDFF0', '\uD83C\uDF0D', '\uD83C\uDF89'],
};

// Badge definitions
const BADGES = [
  { id: 'hangul-stage1', name: 'Hangul Starter', emoji: 'H1', condition: 'hangul_s1', description: 'Hangul stage 1 complete' },
  { id: 'hangul-stage2', name: 'Hangul Bloom', emoji: 'H2', condition: 'hangul_s2', description: 'Hangul stage 2 complete' },
  { id: 'hangul-master', name: 'Hangul Master', emoji: 'HM', condition: 'hangul_s3', description: 'Hangul final stage complete' },
  { id: 'english-stage1', name: 'ABC Starter', emoji: 'E1', condition: 'english_s1', description: 'English stage 1 complete' },
  { id: 'english-master', name: 'ABC Champion', emoji: 'EM', condition: 'english_s3', description: 'English final stage complete' },
  { id: 'number-master', name: 'Number Master', emoji: 'NM', condition: 'number_s3', description: 'Number final stage complete' },
  { id: 'math-master', name: 'Math Hero', emoji: 'MH', condition: 'math_s3', description: 'Math final stage complete' },
  { id: 'quiz-beginner', name: 'Quiz Starter', emoji: 'Q1', condition: 'quiz_10', description: '10 quiz answers correct' },
  { id: 'quiz-king', name: 'Quiz King', emoji: 'QK', condition: 'quiz_50', description: '50 quiz answers correct' },
  { id: 'matching-star', name: 'Matching Star', emoji: 'M*', condition: 'matching_10', description: '10 matching clears' },
  { id: 'sound-finder', name: 'Sound Finder', emoji: 'SF', condition: 'sound_10', description: '10 sound answers correct' },
  { id: 'tracing-star', name: 'Tracing Star', emoji: 'TS', condition: 'tracing_10', description: '10 tracing clears' },
  { id: 'tower-rookie', name: 'Tower Rookie', emoji: 'TR', condition: 'tower_3', description: 'Play tower 3 times' },
  { id: 'tower-architect', name: 'Tower Architect', emoji: 'TA', condition: 'tower_10', description: 'Play tower 10 times' },
  { id: 'tower-skyline', name: 'Skyline Builder', emoji: 'SB', condition: 'tower_best_8', description: 'Reach 8-floor tower' },
  { id: 'streak-3', name: '3-Day Streak', emoji: 'S3', condition: 'streak_3', description: '3-day learning streak' },
  { id: 'streak-7', name: '7-Day Streak', emoji: 'S7', condition: 'streak_7', description: '7-day learning streak' },
  { id: 'streak-14', name: '14-Day Streak', emoji: 'S14', condition: 'streak_14', description: '14-day learning streak' },
  { id: 'streak-30', name: '30-Day Streak', emoji: 'S30', condition: 'streak_30', description: '30-day learning streak' },
  { id: 'star-collector', name: 'Star Collector', emoji: 'SC', condition: 'stars_50', description: 'Collect 50 stars' },
  { id: 'star-master', name: 'Star Master', emoji: 'SM', condition: 'stars_200', description: 'Collect 200 stars' },
  { id: 'sticker-lover', name: 'Sticker Lover', emoji: 'SL', condition: 'stickers_15', description: 'Collect 15 stickers' },
  { id: 'level-5', name: 'Level 5', emoji: 'L5', condition: 'level_5', description: 'Reach level 5' },
  { id: 'level-10', name: 'Level 10', emoji: 'L10', condition: 'level_10', description: 'Reach level 10' },
  { id: 'all-rounder', name: 'All Rounder', emoji: 'AR', condition: 'all_stages', description: 'Complete all stages' },
];

// Tracing guide points for characters
const TRACING_CHARS = {
  hangul: ['\u3131', '\u3134', '\u3137', '\u3139', '\u3141', '\u3142', '\u3145', '\u3147', '\u3148', '\u314E',
           '\u314F', '\u3151', '\u3153', '\u3155', '\u3157', '\u315C'],
  english: ['A','B','C','D','E','F','G','H','I','J','K','L','M',
            'N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
  number: ['1','2','3','4','5','6','7','8','9','10'],
  math: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '\u00d7', '\u00f7', '='],
};

// Helper functions
function getItemKey(item) {
  return item?.id || item?.char;
}

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
  return prevStage.items.every(item => learned.includes(getItemKey(item)));
}

function getStageProgress(categoryId, stageId, progress) {
  const stage = CATEGORIES[categoryId]?.stages.find(s => s.id === stageId);
  if (!stage) return { learned: 0, total: 0, percent: 0, complete: false };
  const learnedKeys = progress.learned[categoryId] || [];
  const learned = stage.items.filter(item => learnedKeys.includes(getItemKey(item))).length;
  const total = stage.items.length;
  return { learned, total, percent: total > 0 ? Math.round(learned / total * 100) : 0, complete: learned >= total };
}

function getCategoryProgress(categoryId, progress) {
  const cat = CATEGORIES[categoryId];
  if (!cat) return { learned: 0, total: 0, percent: 0 };
  const allItems = getAllCategoryItems(categoryId);
  const learnedKeys = progress.learned[categoryId] || [];
  const learned = allItems.filter(item => learnedKeys.includes(getItemKey(item))).length;
  const total = allItems.length;
  return { learned, total, percent: total > 0 ? Math.round(learned / total * 100) : 0 };
}
