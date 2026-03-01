import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const appPath = path.join(root, 'js', 'app.js');
const gamePath = path.join(root, 'js', 'game.js');
const profilePath = path.join(root, 'js', 'profile.js');
const storagePath = path.join(root, 'js', 'storage.js');
const dataPath = path.join(root, 'js', 'data.js');

const appSource = fs.readFileSync(appPath, 'utf8');
const gameSource = fs.readFileSync(gamePath, 'utf8');
const profileSource = fs.readFileSync(profilePath, 'utf8');
const storageSource = fs.readFileSync(storagePath, 'utf8');
const dataSource = fs.readFileSync(dataPath, 'utf8');

const ctx = { console };
vm.createContext(ctx);
vm.runInContext(
  `
${dataSource}
globalThis.__SMOKE_DATA__ = {
  hasBrainLibrary: typeof BRAIN_DEVELOPMENT_LIBRARY !== 'undefined' && Array.isArray(BRAIN_DEVELOPMENT_LIBRARY),
  brainLibraryCount: (BRAIN_DEVELOPMENT_LIBRARY || []).length,
  hasIqPlaylist: typeof IQ_GAME_PLAYLIST !== 'undefined' && Array.isArray(IQ_GAME_PLAYLIST),
  iqPlaylistCount: (IQ_GAME_PLAYLIST || []).length,
  missionTypes: [...new Set((MISSION_TEMPLATES || []).map((m) => m.type))],
};
`,
  ctx,
  { filename: 'data.js' },
);

const checks = [
  ['app has completeActiveRecommendation', /completeActiveRecommendation\s*\(/.test(appSource)],
  ['app has brain materials routing', /runBrainMaterial\s*\(/.test(appSource) && /runIqPlaylist\s*\(/.test(appSource)],
  ['app has adaptive recommendation priority', /getPriorityRecommendationSteps\s*\(/.test(appSource) && /getWeakDomain\s*\(/.test(appSource)],
  ['app has weighted weak-domain selector', /selectWeightedWeakDomain\s*\(/.test(appSource)],
  ['app links parent cognitive profile', /Profile\.getCognitiveDomainsForProfile\s*\(/.test(appSource)],
  ['game has timer cleanup', /clearTimers\s*\(\)\s*\{/.test(gameSource)],
  ['game uses addXP', /Reward\.addXP\(/.test(gameSource)],
  ['profile has cognitive rows', /_buildCognitiveRows\s*\(/.test(profileSource)],
  ['profile exposes weak cognitive domain', /getWeakCognitiveDomain\s*\(/.test(profileSource)],
  ['profile has quick weak-routine trigger', /startWeakDomainRoutine\s*\(/.test(profileSource)],
  ['storage has adaptiveWeights defaults', /adaptiveWeights\s*:\s*\{/.test(storageSource)],
  ['data has brain library', ctx.__SMOKE_DATA__.hasBrainLibrary === true],
  ['data brain library size >= 6', ctx.__SMOKE_DATA__.brainLibraryCount >= 6],
  ['data has IQ playlist', ctx.__SMOKE_DATA__.hasIqPlaylist === true],
  ['data IQ playlist size >= 4', ctx.__SMOKE_DATA__.iqPlaylistCount >= 4],
  ['mission has tower type', ctx.__SMOKE_DATA__.missionTypes.includes('tower')],
  ['mission has github-pack type', ctx.__SMOKE_DATA__.missionTypes.includes('github-pack')],
];

const failed = checks.filter(([, pass]) => !pass);

console.log('Runtime smoke check');
for (const [name, pass] of checks) {
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${name}`);
}

if (failed.length > 0) {
  process.exit(1);
}
