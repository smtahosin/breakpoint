/**
 * BreakPoint Cognitive Engine
 * Deterministic mission generator for developer outdoor cognitive resets.
 * 
 * Translates developer engineering fatigue states and real astronomical telemetry
 * into structured, physically safe outdoor walk missions.
 */

import { SolarTelemetry } from './solar-engine';

export type CognitiveBlockerId = 'bug' | 'conflict' | 'leak' | 'burnout';
export type ResetDurationMinutes = 15 | 20 | 30;

export interface CognitiveBlocker {
  id: CognitiveBlockerId;
  label: string;
  shortLabel: string;
  iconName: string;
  defaultMinutes: ResetDurationMinutes;
  diffusePrompt: string;
  contextAdvice: string;
}

export const COGNITIVE_BLOCKERS: Record<CognitiveBlockerId, CognitiveBlocker> = {
  bug: {
    id: 'bug',
    label: 'Stuck on Complex Bug',
    shortLabel: 'Bug Blocker',
    iconName: 'Bug',
    defaultMinutes: 20,
    diffusePrompt: 'Hold the stack trace lightly in the back of your mind without forcing a fix. Observe distant motion to let associative memory discover the missing assumption.',
    contextAdvice: 'Tunnel-visioning on a single line of code blocks lateral problem solving. Walking outside releases working memory lock.'
  },
  conflict: {
    id: 'conflict',
    label: 'Merge Conflict Anxiety',
    shortLabel: 'Merge Anxiety',
    iconName: 'GitMerge',
    defaultMinutes: 15,
    diffusePrompt: 'Breathe slowly. Step back from the commit tree. Visualizing the broader architecture while walking reveals which branch abstractions truly matter.',
    contextAdvice: 'Merge conflicts trigger adrenaline and impatience. A 15-minute reset resets physiological cortisol levels.'
  },
  leak: {
    id: 'leak',
    label: 'Memory Leak Tunnel-Vision',
    shortLabel: 'Memory Leak',
    iconName: 'Cpu',
    defaultMinutes: 20,
    diffusePrompt: 'Look at distant tree branches or building outlines 30 to 50 meters away. Notice recurring spatial patterns to refresh your mental model of resource lifecycles.',
    contextAdvice: 'Prolonged profiler inspection causes ciliary eye fatigue. Natural depth focus restores spatial visualization.'
  },
  burnout: {
    id: 'burnout',
    label: 'Pre-Deploy Burnout',
    shortLabel: 'Deploy Burnout',
    iconName: 'ZapOff',
    defaultMinutes: 30,
    diffusePrompt: 'Completely disconnect from release checklists for the next 30 minutes. Focus entirely on physical steps, fresh air, and your immediate environment.',
    contextAdvice: 'Pre-deploy fatigue impairs judgment and leads to rushed hotfixes. Stepping away protects system stability.'
  }
};

export interface BreakMission {
  id: string;
  blocker: CognitiveBlocker;
  durationMinutes: ResetDurationMinutes;
  createdAt: string;
  returnTime: string;
  turnaroundTime: string;
  solarTelemetry: SolarTelemetry;
  steps: string[];
  audioScript: string;
  cardHeadline: string;
  observationTask: string;
  safetyNotice: string;
}

/**
 * Deterministically generates an outdoor reset mission.
 */
export function generateBreakMission(
  blockerId: CognitiveBlockerId = 'bug',
  durationMinutes: ResetDurationMinutes = 20,
  solar: SolarTelemetry,
  date: Date = new Date()
): BreakMission {
  const blocker = COGNITIVE_BLOCKERS[blockerId] || COGNITIVE_BLOCKERS.bug;

  // Calculate return timestamp
  const nowMs = date.getTime();
  const returnDate = new Date(nowMs + durationMinutes * 60 * 1000);
  const turnaroundDate = new Date(nowMs + Math.floor(durationMinutes / 2) * 60 * 1000);

  const formatClock = (d: Date) => {
    const hh = d.getHours().toString().padStart(2, '0');
    const mm = d.getMinutes().toString().padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const returnTimeStr = formatClock(returnDate);
  const turnaroundTimeStr = formatClock(turnaroundDate);
  const halfMins = Math.floor(durationMinutes / 2);

  // Generate safe observation task based on solar conditions
  let observationTask = '';
  if (solar.isDaylight) {
    observationTask = `Walk along any safe sidewalk or park. Astronomical sun azimuth is ${solar.azimuthFormatted} (never stare directly at the sun). Expand peripheral gaze to tree tops and distant architecture 20–50 meters away.`;
  } else if (solar.twilightState === 'civil_twilight') {
    observationTask = `Walk along a well-lit pedestrian route during twilight. Notice the sky gradient and distant horizon lights. Look 20–50 meters ahead to disengage monitor eye strain.`;
  } else {
    observationTask = `Night reset: Walk along a safe, well-lit path. Look at the open night sky, stars, or distant streetlights at least 30 meters away to release retinal tension.`;
  }

  // Tactical Steps for the Pocket Card & UI
  const steps = [
    'Close your laptop and step away from your desk',
    'Put your phone in your pocket (do not look at screens)',
    `Walk along a safe pedestrian route for ${halfMins} minutes out`,
    `At ${turnaroundTimeStr}, turn back and let your thoughts wander freely`,
    `Return at ${returnTimeStr} with relaxed working memory`
  ];

  // Spoken Audio Briefing (Concise, approx 18-22 seconds)
  const audioScript = `Initiating your ${durationMinutes}-minute outdoor reset for ${blocker.label}. Close your laptop and place your phone in your pocket. Step outside onto a safe pedestrian path. Remember: do not stare at the sun; look twenty to fifty meters ahead into the distance. Turn around at ${turnaroundTimeStr}. Your return time is ${returnTimeStr}. Let your thoughts drift freely.`;

  const safetyNotice = 'Safety first: Always observe local traffic, pedestrian signals, and environmental conditions. Never look directly into the sun.';

  return {
    id: `bp-mission-${Math.floor(nowMs / 1000)}`,
    blocker,
    durationMinutes,
    createdAt: date.toISOString(),
    returnTime: returnTimeStr,
    turnaroundTime: turnaroundTimeStr,
    solarTelemetry: solar,
    steps,
    audioScript,
    cardHeadline: `Your ${durationMinutes}-Minute Outdoor Reset`,
    observationTask,
    safetyNotice
  };
}
