// Learning content data for Korean consonants, vowels, numbers, and English alphabet

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

// Category definitions
const CATEGORIES = {
  'hangul-consonant': {
    id: 'hangul-consonant',
    name: '자음',
    icon: 'ㄱ',
    color: '#FF8A80',
    data: HANGUL_CONSONANTS,
    sobinRange: [0, 14],  // All
    dokyungRange: [0, 14], // All
  },
  'hangul-vowel': {
    id: 'hangul-vowel',
    name: '모음',
    icon: 'ㅏ',
    color: '#EA80FC',
    data: HANGUL_VOWELS,
    sobinRange: [0, 10],  // All
    dokyungRange: [0, 10], // All
  },
  'number': {
    id: 'number',
    name: '숫자',
    icon: '🔢',
    color: '#82B1FF',
    data: NUMBERS,
    sobinRange: [0, 5],   // 1~5
    dokyungRange: [0, 10], // 1~10
  },
  'english': {
    id: 'english',
    name: '영어',
    icon: '🔤',
    color: '#B9F6CA',
    data: ENGLISH,
    sobinRange: [0, 10],  // A~J
    dokyungRange: [0, 26], // A~Z
  },
};

// Sticker collections
const STICKERS = {
  flowers: ['🌸', '🌺', '🌻', '🌹', '🌷', '💐', '🌼', '🏵️', '💮', '🌿'],
  animals: ['🦄', '🐱', '🐰', '🦋', '🐬', '🐣', '🦜', '🐞', '🦊', '🐼'],
  fairy: ['✨', '🌟', '💫', '⭐', '🦋', '🧚', '👑', '💎', '🎀', '🌈'],
};

// Badge definitions
const BADGES = [
  { id: 'consonant-master', name: '자음 마스터', emoji: '🏅', condition: 'learn_all_consonants', description: '자음 14개 모두 학습' },
  { id: 'vowel-master', name: '모음 마스터', emoji: '🎖️', condition: 'learn_all_vowels', description: '모음 10개 모두 학습' },
  { id: 'hangul-master', name: '한글 박사', emoji: '🏆', condition: 'learn_all_hangul', description: '자음+모음 모두 학습' },
  { id: 'number-master', name: '숫자 박사', emoji: '🔢', condition: 'learn_all_numbers', description: '숫자 모두 학습' },
  { id: 'abc-champion', name: 'ABC 챔피언', emoji: '🅰️', condition: 'learn_all_english', description: '영어 알파벳 모두 학습' },
  { id: 'quiz-beginner', name: '퀴즈 새싹', emoji: '🌱', condition: 'quiz_10', description: '퀴즈 10문제 정답' },
  { id: 'quiz-king', name: '퀴즈 왕', emoji: '👑', condition: 'quiz_50', description: '퀴즈 50문제 정답' },
  { id: 'matching-star', name: '매칭 스타', emoji: '⭐', condition: 'matching_10', description: '짝맞추기 10회 완료' },
  { id: 'sound-finder', name: '소리 탐험가', emoji: '🔊', condition: 'sound_10', description: '소리찾기 10문제 정답' },
  { id: 'star-collector', name: '별 수집가', emoji: '💫', condition: 'stars_50', description: '별 50개 모으기' },
  { id: 'star-master', name: '별별 마스터', emoji: '🌟', condition: 'stars_200', description: '별 200개 모으기' },
  { id: 'sticker-lover', name: '스티커 수집왕', emoji: '🎨', condition: 'stickers_15', description: '스티커 15개 모으기' },
  { id: 'all-rounder', name: '만능 천재', emoji: '🎓', condition: 'all_categories', description: '모든 카테고리 학습 완료' },
];

function getDataForProfile(categoryId, profileId) {
  const cat = CATEGORIES[categoryId];
  if (!cat) return [];
  const range = profileId === 'sobin' ? cat.sobinRange : cat.dokyungRange;
  return cat.data.slice(range[0], range[1]);
}
