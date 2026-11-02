import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateNextReview,
  validateCoordinates,
  validateEmail,
  evaluateWorkflowTrigger,
} from './engine.js';

test('calculateNextReview handles "again" (failed recall)', () => {
  const card = { interval: 6, repetitions: 2, easeFactor: 2.5 };
  const result = calculateNextReview(card, 'again');
  assert.equal(result.interval, 1);
  assert.equal(result.repetitions, 0);
  assert.equal(result.nextReviewDays, 1);
  assert.ok(result.easeFactor < 2.5);
});

test('calculateNextReview advances repetitions on "good"', () => {
  const card = { interval: 1, repetitions: 1, easeFactor: 2.5 };
  const result = calculateNextReview(card, 'good');
  assert.equal(result.interval, 6);
  assert.equal(result.repetitions, 2);
  assert.equal(result.nextReviewDays, 6);
});

test('validateCoordinates correctly detects out of bound values', () => {
  assert.equal(validateCoordinates(45.12, 12.54).isValid, true);
  assert.equal(validateCoordinates(95.0, 10.0).isValid, false);
  assert.equal(validateCoordinates(10.0, 185.0).isValid, false);
  assert.equal(validateCoordinates('abc', 10.0).isValid, false);
});

test('validateEmail validates format', () => {
  assert.equal(validateEmail('test@mindmesh.ai'), true);
  assert.equal(validateEmail('invalid-email'), false);
  assert.equal(validateEmail(''), false);
});

test('evaluateWorkflowTrigger matches active triggers', () => {
  const workflow = { trigger: 'NOTE_CREATED', active: true };
  assert.equal(evaluateWorkflowTrigger(workflow, { type: 'NOTE_CREATED' }), true);
  assert.equal(evaluateWorkflowTrigger(workflow, { type: 'MEETING_RECORDED' }), false);

  const inactiveWorkflow = { trigger: 'NOTE_CREATED', active: false };
  assert.equal(evaluateWorkflowTrigger(inactiveWorkflow, { type: 'NOTE_CREATED' }), false);
});
