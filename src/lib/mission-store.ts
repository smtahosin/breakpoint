/**
 * BreakPoint Mission Store
 * Client-side session and local persistence for active developer reset missions.
 * Zero-backend, zero-telemetry, 100% offline-ready.
 */

import { calculateSolarTelemetry, SolarTelemetry } from './solar-engine';
import { generateBreakMission, BreakMission, CognitiveBlockerId, ResetDurationMinutes } from './cognitive-engine';

const STORAGE_KEY = 'breakpoint_active_mission_v1';

export function getStoredMission(): BreakMission {
  if (typeof window === 'undefined') {
    const defaultSolar = calculateSolarTelemetry();
    return generateBreakMission('bug', 20, defaultSolar);
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as BreakMission;
      if (parsed && parsed.steps && parsed.blocker) {
        return parsed;
      }
    }
  } catch {
    // Local storage unavailable or corrupt
  }

  // Fallback to fresh generation
  const solar = calculateSolarTelemetry();
  const mission = generateBreakMission('bug', 20, solar);
  saveStoredMission(mission);
  return mission;
}

export function saveStoredMission(mission: BreakMission): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mission));
    window.dispatchEvent(new CustomEvent('breakpoint_mission_updated', { detail: mission }));
  } catch {
    // Storage quota or private browsing limitation
  }
}

export function createAndSaveMission(
  blockerId: CognitiveBlockerId,
  durationMinutes: ResetDurationMinutes,
  solar: SolarTelemetry
): BreakMission {
  const mission = generateBreakMission(blockerId, durationMinutes, solar, new Date());
  saveStoredMission(mission);
  return mission;
}
