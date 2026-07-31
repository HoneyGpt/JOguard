import { RuleEngine } from '../engines/RuleEngine';

/**
 * Unit Test Suite for RuleEngine
 */
export function testRuleEngine() {
  const engine = new RuleEngine();
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

  // Test 1: Ad URL Matching
  assert(engine.isAdUrl('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'), 'Ad URL matching googlesyndication');
  assert(!engine.isAdUrl('https://example.com/regular-script.js'), 'Non-ad URL ignored');

  // Test 2: Tracker URL Matching
  assert(engine.isTrackerUrl('https://www.google-analytics.com/analytics.js'), 'Tracker domain matching google-analytics');
  assert(engine.isTrackerUrl('https://connect.facebook.net/en_US/fbevents.js'), 'Tracker domain matching facebook pixel');

  // Test 3: Domain Whitelisting
  assert(engine.isWhitelisted('news.example.com', ['example.com']), 'Whitelisting matches subdomain');
  assert(!engine.isWhitelisted('otherdomain.com', ['example.com']), 'Whitelisting rejects non-matched domain');

  console.log(`RuleEngine Tests Complete: ${passed} passed, ${failed} failed`);
  return failed === 0;
}
