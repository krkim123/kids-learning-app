// Optional game dispatch registry for app.js.
// app.js falls back to its local registry when this script is not loaded.
(function initGameRegistry(global) {
  if (!global || (global.GameRegistry && typeof global.GameRegistry.run === 'function')) return;

  const registry = {
    run(gameId, payload = {}) {
      if (!gameId) return false;
      const call = (method, ...args) => {
        if (!Game || typeof Game[method] !== 'function') return false;
        Game[method](...args);
        return true;
      };
      const handlers = {
        quiz: () => call('startQuiz', payload.categoryId || 'hangul'),
        'quiz-marathon': () => call('startQuizMarathon', payload.categoryId || 'hangul'),
        'quiz-infinite': () => call('startQuizInfinite', payload.categoryId || 'hangul'),
        'iq-camp-25d': () => call('startIQCamp25D'),
        matching: () => call('startMatching', payload.categoryId || 'hangul'),
        sound: () => call('startSound', payload.categoryId || 'hangul'),
        tracing: () => call('startTracing', payload.categoryId || 'hangul'),
        counting: () => call('startCounting'),
        'block-count-25d': () => call('startBlockCount25D'),
        'block-count-25d-infinite': () => call('startBlockCount25D', 'infinite'),
        'spatial-matrix-25d': () => call('startSpatialMatrix25D'),
        tower: () => call('startSkyTower', payload.categoryId || 'number'),
        times: () => call('startTimesTableQuiz'),
        shape3d: () => call('startShape3DMatch'),
        net3d: () => call('startShapeNetLab'),
        'shape-lab': () => call('startShapeBuilderLab'),
        'shape-move': () => call('startShapeMoveMatch'),
        'block-stack': () => call('startBlockStackLab'),
        'blocky-blast': () => call('startBlockyBlast'),
        'merge-numbers': () => call('startMergeNumbers'),
        'bubble-storm': () => call('startBubblePop', 'storm'),
        'bubble-charms': () => call('startBubblePop', 'charms'),
        'save-dogogo': () => call('startSaveDogogo'),
        'suika-merge': () => call('startSuikaMerge'),
        'brain-test-tricky': () => call('startBrainTestTricky'),
        'brain-test-stories': () => call('startBrainTestStories'),
        'brain-test-quests': () => call('startBrainTestQuests'),
        'monster-type': () => call('startMonsterTypeQuiz', payload.typeId || 'all'),
        choseong: () => call('startChoseongQuiz'),
        batchim: () => call('startBatchimQuiz'),
      };
      const runner = handlers[gameId];
      if (typeof runner !== 'function') return false;
      return runner() !== false;
    },
  };

  global.GameRegistry = registry;
})(typeof window !== 'undefined' ? window : undefined);
