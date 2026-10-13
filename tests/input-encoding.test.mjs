import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const source = await readFile(new URL('../src/constants.js', import.meta.url), 'utf8');
const c = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

test('reject invalid ages, heights, and weights', () => {
  for (const value of ['', ' ', undefined, null, 'abc', Infinity, 0, -1]) {
    assert.equal(c.isValidNumericAnswer('HEIGHT_CM', value), false);
    assert.equal(c.isValidNumericAnswer('WEIGHT_KG', value), false);
  }
  for (const age of [17, 100, 35.5, '', Infinity]) assert.equal(c.isValidNumericAnswer('AGE_YEARS', age), false);
  for (const age of [18, 35, 99]) assert.equal(c.isValidNumericAnswer('AGE_YEARS', age), true);
  assert.throws(() => c.buildFeatureVector({AGE_YEARS: 45, HEIGHT_CM: 0, WEIGHT_KG: 70}));
});

test('unit conversions keep the same measurements', () => {
  const cm = c.feetInchesToCm(5, 10);
  assert.equal(cm, 177.8);
  const imperial = c.cmToFeetInches(cm);
  assert.deepEqual(imperial, {feet: 5, inches: 10});
  assert.ok(Math.abs(c.kgToLbs(c.lbsToKg(160)) - 160) <= 0.2);
  assert.ok(c.cmToFeetInches(182.87).inches < 12);
});

test('feature coding matches the training notebook', () => {
  assert.deepEqual(c.buildFeatureVector({GENHLTH: 3, AGE_YEARS: 45, SEXVAR: 1,
    HEIGHT_CM: 180, WEIGHT_KG: 81, EXERANY2: false, high_bp: true,
    high_chol: false, SMOKE100: false, diff_walk: true,
    stroke_history: false, angina_chd_history: true, heart_attack_history: false}),
    [3, 6, 1, 2500, 2, 1, 0, 2, 1, 0, 1, 0]);
  assert.equal(c.ageToAgeGroup(24), 1);
  assert.equal(c.ageToAgeGroup(25), 2);
  assert.equal(c.ageToAgeGroup(79), 12);
  assert.equal(c.ageToAgeGroup(80), 13);
});

test('calibration matches the saved model checks', () => {
  assert.ok(Math.abs(c.calibrateProbability(0.03680086135864258) - 0.021521104196266926) < 1e-8);
  assert.ok(Math.abs(c.calibrateProbability(0.9118542671203613) - 0.60360098616256) < 1e-8);
  assert.equal(c.RECOMMENDED_THRESHOLD, 0.04732862367687753);
});
