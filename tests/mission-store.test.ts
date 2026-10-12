import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { getStoredMission, saveStoredMission, createAndSaveMission } from '../src/lib/mission-store';
import { calculateSolarTelemetry } from '../src/lib/solar-engine';
import { generateBreakMission } from '../src/lib/cognitive-engine';

describe('BreakPoint Mission Store — Persistence & SSR Fallback', () => {
  const solar = calculateSolarTelemetry(23.8103, 90.4125, new Date('2026-05-15T06:00:00Z'));

  it('provides safe default mission during SSR when window is undefined', () => {
    // In node environment without browser window
    const mission = getStoredMission();
    assert.ok(mission);
    assert.ok(mission.id);
    assert.equal(mission.blocker.id, 'bug');
    assert.equal(mission.durationMinutes, 20);
    assert.ok(mission.steps.length > 0);
  });

  it('persists and restores mission when localStorage is available', () => {
    // Mock minimal localStorage and window
    const store: Record<string, string> = {};
    const mockLocalStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, val: string) => { store[key] = val; },
      removeItem: (key: string) => { delete store[key]; }
    };

    (globalThis as any).window = {
      dispatchEvent: () => true
    };
    (globalThis as any).localStorage = mockLocalStorage;

    try {
      const created = createAndSaveMission('burnout', 30, solar);
      assert.equal(created.blocker.id, 'burnout');
      assert.equal(created.durationMinutes, 30);

      // Verify retrieval
      const restored = getStoredMission();
      assert.equal(restored.id, created.id);
      assert.equal(restored.blocker.id, 'burnout');
      assert.equal(restored.durationMinutes, 30);
      assert.equal(restored.returnTime, created.returnTime);
    } finally {
      delete (globalThis as any).window;
      delete (globalThis as any).localStorage;
    }
  });

  it('gracefully handles corrupt JSON in localStorage without throwing', () => {
    const mockLocalStorage = {
      getItem: () => '{ corrupt json ...',
      setItem: () => {},
      removeItem: () => {}
    };

    (globalThis as any).window = { dispatchEvent: () => true };
    (globalThis as any).localStorage = mockLocalStorage;

    try {
      const mission = getStoredMission();
      assert.ok(mission);
      assert.equal(mission.blocker.id, 'bug'); // Returns safe fresh fallback
    } finally {
      delete (globalThis as any).window;
      delete (globalThis as any).localStorage;
    }
  });
});
