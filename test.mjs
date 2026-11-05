import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectTimecodes } from './main.mjs';
test('contrat et limite', () => {
  assert.equal(inspectTimecodes({ fps: 25, segments: [{ start: '00:00:01:00', end: '00:00:02:00' }] }).issues[0].frames, 25);
  assert.throws(() => inspectTimecodes({ fps: 0, segments: [] }));
});

