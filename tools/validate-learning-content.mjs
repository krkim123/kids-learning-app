import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const dataPath = path.join(projectRoot, 'js', 'data.js');
const dataSource = fs.readFileSync(dataPath, 'utf8');

const context = { console };
vm.createContext(context);

const wrapped = `
${dataSource}
;globalThis.__LEARNING_VALIDATION__ = (() => {
  const allHangul = (typeof HANGUL_ALL !== 'undefined')
    ? HANGUL_ALL
    : [...HANGUL_CONSONANTS, ...HANGUL_VOWELS];

  const itemsByCategory = {
    hangul: CATEGORIES.hangul.stages.flatMap((stage) => stage.items),
    english: CATEGORIES.english.stages.flatMap((stage) => stage.items),
    number: CATEGORIES.number.stages.flatMap((stage) => stage.items),
  };

  const stageSizes = {
    hangul: CATEGORIES.hangul.stages.map((stage) => stage.items.length),
    english: CATEGORIES.english.stages.map((stage) => stage.items.length),
    number: CATEGORIES.number.stages.map((stage) => stage.items.length),
  };

  return {
    totals: {
      hangul: allHangul.length,
      english: ENGLISH.length,
      number: NUMBERS.length,
    },
    stageTotals: {
      hangul: itemsByCategory.hangul.length,
      english: itemsByCategory.english.length,
      number: itemsByCategory.number.length,
    },
    stageSizes,
    stageSizeSums: {
      hangul: stageSizes.hangul.reduce((sum, n) => sum + n, 0),
      english: stageSizes.english.reduce((sum, n) => sum + n, 0),
      number: stageSizes.number.reduce((sum, n) => sum + n, 0),
    },
    uniqueChars: {
      hangul: new Set(itemsByCategory.hangul.map((item) => item.char)).size,
      english: new Set(itemsByCategory.english.map((item) => item.char)).size,
      number: new Set(itemsByCategory.number.map((item) => item.char)).size,
    },
    cognitive: {
      brainLibraryCount: (typeof BRAIN_DEVELOPMENT_LIBRARY !== 'undefined' && Array.isArray(BRAIN_DEVELOPMENT_LIBRARY))
        ? BRAIN_DEVELOPMENT_LIBRARY.length
        : 0,
      iqPlaylistCount: (typeof IQ_GAME_PLAYLIST !== 'undefined' && Array.isArray(IQ_GAME_PLAYLIST))
        ? IQ_GAME_PLAYLIST.length
        : 0,
      brainAgeCoverage: ['toddler', 'child', 'older'].map((age) => ({
        age,
        count: (BRAIN_DEVELOPMENT_LIBRARY || []).filter((row) => (row.ageGroups || []).includes(age)).length,
      })),
      invalidRoutes: [
        ...(BRAIN_DEVELOPMENT_LIBRARY || []).map((row) => row.action || {}),
        ...(IQ_GAME_PLAYLIST || []).map((row) => row.route || {}),
      ].filter((route) => {
        if (!route || !route.type) return true;
        if (route.type === 'game') return !['quiz', 'matching', 'sound', 'tracing', 'counting', 'tower', 'times', 'shape3d', 'net3d'].includes(route.gameId);
        return !['coloring', 'github-pack', 'benchmark', 'reference', 'learn'].includes(route.type);
      }).length,
    },
  };
})();
`;

vm.runInContext(wrapped, context, { filename: 'data.js' });
const report = context.__LEARNING_VALIDATION__;

const checks = [
  ['hangul total is at least 50', report.totals.hangul >= 50, report.totals.hangul],
  ['english total is at least 50', report.totals.english >= 50, report.totals.english],
  ['number total is at least 50', report.totals.number >= 50, report.totals.number],
  ['hangul stage total matches stage sizes', report.stageTotals.hangul === report.stageSizeSums.hangul, `${report.stageTotals.hangul}/${report.stageSizeSums.hangul}`],
  ['english stage total matches stage sizes', report.stageTotals.english === report.stageSizeSums.english, `${report.stageTotals.english}/${report.stageSizeSums.english}`],
  ['number stage total matches stage sizes', report.stageTotals.number === report.stageSizeSums.number, `${report.stageTotals.number}/${report.stageSizeSums.number}`],
  ['hangul has at least 5 stages', report.stageSizes.hangul.length >= 5, report.stageSizes.hangul.length],
  ['english has at least 5 stages', report.stageSizes.english.length >= 5, report.stageSizes.english.length],
  ['number has at least 5 stages', report.stageSizes.number.length >= 5, report.stageSizes.number.length],
  ['hangul stage sizes are positive', report.stageSizes.hangul.every((n) => n > 0), report.stageSizes.hangul.join(',')],
  ['english stage sizes are positive', report.stageSizes.english.every((n) => n > 0), report.stageSizes.english.join(',')],
  ['number stage sizes are positive', report.stageSizes.number.every((n) => n > 0), report.stageSizes.number.join(',')],
  ['hangul chars are at least 50 unique', report.uniqueChars.hangul >= 50, report.uniqueChars.hangul],
  ['english chars are at least 50 unique', report.uniqueChars.english >= 50, report.uniqueChars.english],
  ['number chars are at least 50 unique', report.uniqueChars.number >= 50, report.uniqueChars.number],
  ['brain library has at least 6 items', report.cognitive.brainLibraryCount >= 6, report.cognitive.brainLibraryCount],
  ['IQ playlist has at least 4 items', report.cognitive.iqPlaylistCount >= 4, report.cognitive.iqPlaylistCount],
  ['brain library covers toddler', report.cognitive.brainAgeCoverage.find((a) => a.age === 'toddler')?.count > 0, JSON.stringify(report.cognitive.brainAgeCoverage)],
  ['brain library covers child', report.cognitive.brainAgeCoverage.find((a) => a.age === 'child')?.count > 0, JSON.stringify(report.cognitive.brainAgeCoverage)],
  ['brain library covers older', report.cognitive.brainAgeCoverage.find((a) => a.age === 'older')?.count > 0, JSON.stringify(report.cognitive.brainAgeCoverage)],
  ['brain routes are valid', report.cognitive.invalidRoutes === 0, report.cognitive.invalidRoutes],
];

const failed = checks.filter(([, pass]) => !pass);

console.log('Learning content validation');
for (const [name, pass, value] of checks) {
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${name} | value=${value}`);
}

if (failed.length > 0) {
  process.exit(1);
}
