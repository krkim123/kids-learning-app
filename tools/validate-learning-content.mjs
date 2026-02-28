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
    uniqueChars: {
      hangul: new Set(itemsByCategory.hangul.map((item) => item.char)).size,
      english: new Set(itemsByCategory.english.map((item) => item.char)).size,
      number: new Set(itemsByCategory.number.map((item) => item.char)).size,
    },
  };
})();
`;

vm.runInContext(wrapped, context, { filename: 'data.js' });
const report = context.__LEARNING_VALIDATION__;

const checks = [
  ['hangul total is 50', report.totals.hangul === 50, report.totals.hangul],
  ['english total is 50', report.totals.english === 50, report.totals.english],
  ['number total is 50', report.totals.number === 50, report.totals.number],
  ['hangul stage total is 50', report.stageTotals.hangul === 50, report.stageTotals.hangul],
  ['english stage total is 50', report.stageTotals.english === 50, report.stageTotals.english],
  ['number stage total is 50', report.stageTotals.number === 50, report.stageTotals.number],
  ['hangul has 5 stages', report.stageSizes.hangul.length === 5, report.stageSizes.hangul.length],
  ['english has 5 stages', report.stageSizes.english.length === 5, report.stageSizes.english.length],
  ['number has 5 stages', report.stageSizes.number.length === 5, report.stageSizes.number.length],
  ['hangul stage sizes are all 10', report.stageSizes.hangul.every((n) => n === 10), report.stageSizes.hangul.join(',')],
  ['english stage sizes are all 10', report.stageSizes.english.every((n) => n === 10), report.stageSizes.english.join(',')],
  ['number stage sizes are all 10', report.stageSizes.number.every((n) => n === 10), report.stageSizes.number.join(',')],
  ['hangul chars are unique', report.uniqueChars.hangul === 50, report.uniqueChars.hangul],
  ['english chars are unique', report.uniqueChars.english === 50, report.uniqueChars.english],
  ['number chars are unique', report.uniqueChars.number === 50, report.uniqueChars.number],
];

const failed = checks.filter(([, pass]) => !pass);

console.log('Learning content validation');
for (const [name, pass, value] of checks) {
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${name} | value=${value}`);
}

if (failed.length > 0) {
  process.exit(1);
}
