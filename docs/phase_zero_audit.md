# BreakPoint ☀️ — Phase Zero Implementation Audit

**Date:** 2026-10-12  
**Target Category:** Best Use of Entire (Hacktoberfest 2026 Week 1: "Touch Grass")  
**Maintainer:** S M Tahosin ([@smtahosin](https://github.com/smtahosin))  
**Deployment Target:** [https://smtahosin.github.io/breakpoint](https://smtahosin.github.io/breakpoint)

---

## 1. Audit Matrix: Simulated vs. Production-Ready

| Subsystem | Current State | Defect / Limitation | Production Requirement |
| :--- | :--- | :--- | :--- |
| **Solar Engine** | Spencer approximation with hardcoded night fallback (`lux = 5000` or `42000`) | Night readings show fake daylight lux; UTC handling lacks explicit Julian century math; polar conditions unhandled. | Full deterministic NOAA Solar Position Algorithm (Julian day, equation of time, solar declination, true solar time). Explicit daytime/twilight/night categorization. Honest "Estimated daylight" (0–100,000 lux) with `< 1 lux` at night. |
| **Location & Privacy** | Single `navigator.geolocation` call with hardcoded San Francisco fallback | Fallback is silent; no manual coordinate picker; no clear privacy explanation in UI space. | Explicit location state handling (detecting, permitted, denied, timeout). Clean manual location picker (coordinates or standard cities). Zero external tracking APIs. |
| **Cognitive Lock & Duration** | Blocker and duration controls hardcoded in text on `/start` | Blocker selection and 15/20/30-minute duration pills not interactive in the dispatch form. | Interactive blocker selector (4 blockers) and duration selector (15, 20, 30 min) updating mission state, tactical card, audio script, and return deadlines. |
| **Physical Safety & Ethics** | Generic azimuth direction ("Walk towards 215° SW") | Compass bearing could mislead users to walk into roads/traffic; no warning against staring at sun; daytime advice at night. | Azimuth explicitly marked as astronomical solar reference only ("Do NOT look directly at sun; choose safe pedestrian path"). Nighttime missions switch to stargazing/ambient rest. |
| **Acoustic Audio Briefing** | Basic speech synthesis with 20s interval | Voices not awaited; no pause/cancel safety; no duration scaling for 15/30 min missions. | Robust speech synthesizer with explicit cancel, voice fallback, audio context suspension checks, matching active mission. |
| **Pocket Field Card** | Canvas draws hardcoded demo text and static lake image | Downloaded artifact did not dynamically reflect the selected blocker, custom duration, or live solar calculation. | Dynamic HTML5 canvas drawing active mission parameters (selected blocker, custom duration, real solar telemetry, return time, safe observation task). |
| **Offline & Base Path** | Static export works at root `/`, lacks Service Worker | GitHub Pages hosts at `/breakpoint/`; no offline caching of assets or fonts. | Service worker caching core shell and assets, supporting both local `/` and GitHub Pages `/breakpoint/` paths. |
| **Entire Integration** | Modal has hardcoded text summaries | No authentic `.entire/` checkpoint artifacts, no commit trailer records, no inspectable session manifest. | Genuine Entire session history captured in `.entire/` directory with checkpoints, manifest, commit trailers, and inspectable UI modal. |
| **Test Suite** | None (`npm test` does not exist) | No unit tests verifying solar accuracy, mission logic, or card generation. | Deterministic test suite verifying astronomical math across 6 reference coordinates, all 4 blockers, 3 durations, and safety boundaries. |

---

## 2. Immediate Action Plan

1. **Step 1: Production Solar Engine & Unit Tests**
   - Implement rigorous NOAA solar position equations in `src/lib/solar-engine.ts`.
   - Create deterministic test suite in `tests/solar-engine.test.ts`.
2. **Step 2: Mission Engine & Safety Protocol**
   - Implement `src/lib/cognitive-engine.ts` with all 4 blockers, 3 durations, safe optical tasks, and night handling.
   - Create tests in `tests/cognitive-engine.test.ts`.
3. **Step 3: Interactive UI Controls on `/start` (Preserving Design Freeze)**
   - Add blocker selector chips and 15/20/30m duration selector within existing UI layout.
   - Connect telemetry, location fallback, and dynamic tactical card.
4. **Step 4: Dynamic Pocket Card & Real Audio Briefing**
   - Update `src/lib/card-canvas.ts` to render active mission details.
   - Update `src/lib/audio-engine.ts` with robust voice handling and safety controls.
5. **Step 5: Offline Service Worker & GitHub Pages Support**
   - Implement `public/sw.js` and registration helper respecting `NEXT_PUBLIC_BASE_PATH`.
6. **Step 6: Entire-Native Integration**
   - Establish `.entire/` directory with session transcripts, checkpoint manifest, and architectural decision records.
   - Connect `EntireSessionModal.tsx` to the live manifest.
7. **Step 7: Full Verification & Visual Regression**
   - Run tests, build static export, verify desktop/mobile viewports, and capture final evidence.
