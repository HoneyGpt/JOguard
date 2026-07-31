import { StatisticsEngine } from '../engines/StatisticsEngine';
import { DEFAULT_STATS } from '../constants/storageKeys';

/**
 * Unit Test Suite for StatisticsEngine
 */
export function testStatisticsEngine() {
  const engine = new StatisticsEngine();
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      passed++;
    } else {
      failed++;
      console.error(`❌ TEST FAILED: ${testName}`);
    }
  }

  const initial = { ...DEFAULT_STATS };
  const updated = engine.computeUpdatedStats(initial, 5, 3);

  assert(updated.adsBlockedTotal === 5, 'Ads blocked increment');
  assert(updated.trackersBlockedTotal === 3, 'Trackers blocked increment');
  assert(updated.bandwidthSavedBytes > 0, 'Bandwidth saved byte accumulation');
  assert(updated.estimatedTimeSavedMs > 0, 'Estimated time saved accumulation');

  console.log(`StatisticsEngine Tests Complete: ${passed} passed, ${failed} failed`);
  return failed === 0;
}
