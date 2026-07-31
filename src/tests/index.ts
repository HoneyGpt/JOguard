import { testRuleEngine } from './RuleEngine.test';
import { testStatisticsEngine } from './StatisticsEngine.test';

console.log('🧪 Running JOGuard Unit Test Suites...\n');

const rulePass = testRuleEngine();
const statsPass = testStatisticsEngine();

if (rulePass && statsPass) {
  console.log('\n✅ ALL UNIT TESTS PASSED SUCCESSFULLY!');
} else {
  console.error('\n❌ SOME UNIT TESTS FAILED!');
  process.exit(1);
}
