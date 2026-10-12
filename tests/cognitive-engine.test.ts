import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateBreakMission,
  COGNITIVE_BLOCKERS,
  CognitiveBlockerId,
  ResetDurationMinutes
} from '../src/lib/cognitive-engine.ts';
import { calculateSolarTelemetry } from '../src/lib/solar-engine.ts';

describe('BreakPoint Cognitive Engine — Deterministic Reset Missions', () => {
  const mockDaySolar = calculateSolarTelemetry(23.8103, 90.4125, new Date('2026-05-15T06:00:00Z'));
  const mockNightSolar = calculateSolarTelemetry(23.8103, 90.4125, new Date('2026-05-15T18:00:00Z'));

  it('supports all 4 cognitive blocker presets', () => {
    const blockerKeys: CognitiveBlockerId[] = ['bug', 'conflict', 'leak', 'burnout'];
    for (const key of blockerKeys) {
      const blocker = COGNITIVE_BLOCKERS[key];
      assert.ok(blocker, `Blocker ${key} must exist`);
      assert.ok(blocker.label.length > 0);
      assert.ok(blocker.diffusePrompt.length > 0);
      assert.ok(blocker.contextAdvice.length > 0);

      const mission = generateBreakMission(key, 20, mockDaySolar, new Date('2026-05-15T10:00:00Z'));
      assert.equal(mission.blocker.id, key);
      assert.ok(mission.audioScript.includes(blocker.label));
    }
  });

  it('correctly calculates turnaround and return times for 15, 20, and 30 minute durations', () => {
    const fixedTime = new Date('2026-05-15T14:10:00Z'); // 14:10 UTC

    const durations: ResetDurationMinutes[] = [15, 20, 30];
    const expectedTurnaroundMinutes = [7, 10, 15];
    const expectedReturnMinutes = [25, 30, 40];

    durations.forEach((duration, idx) => {
      const mission = generateBreakMission('bug', duration, mockDaySolar, fixedTime);
      assert.equal(mission.durationMinutes, duration);

      const expReturnMin = expectedReturnMinutes[idx];
      const expTurnMin = 10 + expectedTurnaroundMinutes[idx];

      const retMm = mission.returnTime.split(':')[1];
      const turnMm = mission.turnaroundTime.split(':')[1];

      assert.equal(retMm, expReturnMin.toString().padStart(2, '0'));
      assert.equal(turnMm, expTurnMin.toString().padStart(2, '0'));
    });
  });

  it('adapts observation task for daytime vs nighttime missions', () => {
    const dayMission = generateBreakMission('bug', 20, mockDaySolar, new Date());
    assert.ok(dayMission.observationTask.includes('Walk along any safe sidewalk or park'));
    assert.ok(dayMission.observationTask.includes('never stare directly at the sun'));
    assert.ok(dayMission.observationTask.includes('peripheral gaze'));

    const nightMission = generateBreakMission('bug', 20, mockNightSolar, new Date());
    assert.ok(nightMission.observationTask.includes('Night reset: Walk along a safe, well-lit path'));
    assert.ok(nightMission.observationTask.includes('open night sky, stars'));
  });

  it('generates concise spoken audio script containing vital return milestones', () => {
    const fixedTime = new Date('2026-05-15T09:00:00Z');
    const mission = generateBreakMission('conflict', 15, mockDaySolar, fixedTime);

    assert.ok(mission.audioScript.includes('15-minute outdoor reset'));
    assert.ok(mission.audioScript.includes('Merge Conflict Anxiety'));
    assert.ok(mission.audioScript.includes('do not stare at the sun'));
    assert.ok(mission.audioScript.includes('Turn around at'));
    assert.ok(mission.audioScript.includes('return time is'));
    // Ensure brevity: < 500 characters so Web Speech completes in ~20s
    assert.ok(mission.audioScript.length < 450, `Audio script too long: ${mission.audioScript.length} chars`);
  });

  it('guarantees deterministic mission generation for identical inputs', () => {
    const date = new Date('2026-05-15T10:00:00Z');
    const m1 = generateBreakMission('leak', 20, mockDaySolar, date);
    const m2 = generateBreakMission('leak', 20, mockDaySolar, date);

    assert.equal(m1.returnTime, m2.returnTime);
    assert.equal(m1.turnaroundTime, m2.turnaroundTime);
    assert.equal(m1.audioScript, m2.audioScript);
    assert.equal(m1.observationTask, m2.observationTask);
    assert.deepEqual(m1.steps, m2.steps);
  });

  it('enforces physical safety notices on all generated missions', () => {
    const mission = generateBreakMission('burnout', 30, mockDaySolar, new Date());
    assert.ok(mission.safetyNotice.includes('Safety first'));
    assert.ok(mission.safetyNotice.includes('pedestrian'));
    assert.ok(mission.safetyNotice.includes('Never look directly into the sun'));
  });
});
