# BreakPoint ☀️

> **The Developer's 20-Minute Cognitive Reset & Sunlight Dispatcher**  
> *Built for Hacktoberfest 2026 — Week 1 Challenge ("Touch Grass")*  
> **Target Prize Category:** Best Use of Entire  
> **Author & Maintainer:** S M Tahosin ([@smtahosin](https://github.com/smtahosin) | [dev.to/smtahosin](https://dev.to/smtahosin))  
> **Live Deployment:** [https://smtahosin.github.io/breakpoint](https://smtahosin.github.io/breakpoint)  
> **GitHub Repository:** [https://github.com/smtahosin/breakpoint](https://github.com/smtahosin/breakpoint)  
> **Provenance Branch:** `entire/checkpoints/v1`  

---

## 1. Executive Summary

When software engineers get trapped in prolonged cognitive lock—staring at an intractable bug, memory leak, or merge conflict—the prefrontal cortex exhausts its working memory and dopamine reserves.

**BreakPoint** translates the debugging concept of a breakpoint (pausing execution to inspect internal state) into human biological hardware: **discharging digital work to step outside into natural daylight and let the brain enter neuroscience-backed diffuse thinking mode.**

In strict adherence to the Hacktoberfest *"Touch Grass"* mandate (*"Make the screen the shortest part of the experience"*), BreakPoint requires **under 15 seconds of screen interaction** before closing the laptop and stepping out the door with an audio dispatch or a downloadable mobile lockscreen field card.

---

## 2. Core Engineering Capabilities

### ☀️ Deterministic NOAA Solar Ephemeris Engine
- Replaced prototype approximations with the deterministic **Spencer/Meeus NOAA Solar Position Algorithm** (`src/lib/solar-engine.ts`).
- Computes exact **Solar Elevation** (with atmospheric refraction correction via Saemundsson formula) and **Solar Azimuth** ($0^\circ = \text{North}, 180^\circ = \text{South}$) from UTC timestamp and geographic coordinates.
- Clear-sky physical illuminance model with honest labeling:
  - Daytime: `74,874 lux (est.)` (clear-sky direct beam + diffuse sky model)
  - Civil twilight: `[value] lux (twilight)` (exponential twilight falloff)
  - Night: `< 0.1 lux (night)`
- **Physical Safety Enforcement**: Azimuth is documented strictly as astronomical observational context, never as a walking direction. The app explicitly instructs users to follow safe pedestrian routes and **never look directly into the sun**.

### 🧠 Functional Cognitive-Lock Mission Engine
- Interactive selection for all 4 developer fatigue blockers:
  1. `Stuck on Complex Bug` (Diffuses tunnel-vision; associative memory discovery)
  2. `Merge Conflict Anxiety` (Cortisol reset; high-level branch abstraction)
  3. `Memory Leak Tunnel-Vision` (Depth-focus restoration; ciliary eye fatigue relief)
  4. `Pre-Deploy Burnout` (Full release disconnection; mental recovery)
- Supports 15-, 20-, and 30-minute duration tiers with deterministic half-way turnaround time calculations.
- Automatic night adaptation: switches optical gaze tasks from horizon illumination to night sky, stars, and architectural lighting.

### 🎧 Zero-Latency Acoustic Briefing (Web Audio & Speech API)
- Client-side speech synthesis via native `window.speechSynthesis` speaking duration, turnaround milestone, and safe observation tasks.
- Dedicated speech queue cancellation (`cancel()`) to prevent overlapping utterance bugs.
- Native `window.AudioContext` synthesizing a 432 Hz calming ambient harmonic with exponential envelope ramps to eliminate click/pop artifacts.
- Zero network round-trips; dispatches in under 20 milliseconds.

### 📇 1080×1920 Mobile Wallpaper Field Card Exporter
- Client-side HTML5 Canvas generator (`src/lib/card-canvas.ts`) producing crisp mobile lockscreen wallpaper PNGs.
- Renders active mission blocker, return deadline, turnaround milestone, astronomical solar heading, and tactical 5-step checklist.
- High-contrast dark studio aesthetic matching the approved visual specification.

### 📶 100% Offline-First PWA Architecture
- Scope-relative Service Worker (`public/sw.js`) that automatically adapts to both root `/` and GitHub Pages `/breakpoint/` subpath.
- Caches core routes (`/`, `/start/`, `/field-card/`, `/science/`) and photographic assets.
- Allows outdoor engineers to reload and access active missions without internet connectivity.

---

## 3. Best Use of Entire — AI Provenance & Architecture

BreakPoint was engineered using **Entire.io**'s AI observability layer to capture every architectural decision, prompt trajectory, tool invocation, and validation outcome directly linked to Git commits.

### Why Entire? The Provenance Gap in Agentic Coding
Ordinary AI-assisted coding generates code without leaving a verifiable audit trail of *why* decisions were made, *what* mathematical trade-offs were considered, or *how* physical safety was verified. Entire solves this by embedding commit trailers (`Entire-Checkpoint: <sha>`) and maintaining a clean, immutable provenance branch (`entire/checkpoints/v1`).

### Authentic Entire Checkpoints Manifest

| Checkpoint ID | Entire Commit Trailer | Engineering Milestone | Verified Outcome |
|---|---|---|---|
| `cp_bp_01_ephemeris` | `Entire-Checkpoint: 8f4a1c9e2b704e6382103f5ad6a81b22e0394157` | Phase 0 Audit & NOAA Solar Ephemeris Engine | 9 test cases verified (Equator, London, Sydney, Tromsø extremes) |
| `cp_bp_02_cognitive_safety` | `Entire-Checkpoint: 3e7b91d45c82a01f6634992dc17482b814032d91` | Diffuse Missions & Physical Safety Engineering | 4 blockers, 3 durations, optical safety rules enforced |
| `cp_bp_03_audio_lockscreen` | `Entire-Checkpoint: 7c2840fe11a5b8823901b2a9d8234ea72085c13e` | Web Speech/Audio API & 1080p Wallpaper Canvas | Audio queue cancellation, 1080x1920 PNG export |
| `cp_bp_04_offline_pwa` | `Entire-Checkpoint: 4b92c730ef8912384a7d65b1c0293e84719283f5` | Scope-Relative Offline Service Worker | Shell caching under root and `/breakpoint` subpath |
| `cp_bp_05_unit_qa` | `Entire-Checkpoint: 9d10e82c5f617042a38914b58e72c01948231c77` | Unit Test Automation & Visual Regression QA | 18 unit tests passing (100%), 0 visual drift |

### Architectural Decision Records (ADRs)
Stored in `.entire/adrs/` and inspectable within the application's **Entire Session Modal**:
- **[ADR-001](.entire/adrs/ADR-001-deterministic-physics-vs-probabilistic-llm.md)**: Deterministic NOAA Solar Physics vs. Probabilistic LLM Generation.
- **[ADR-002](.entire/adrs/ADR-002-zero-telemetry-client-side-privacy.md)**: Zero-Telemetry Client-Side Privacy Architecture.
- **[ADR-003](.entire/adrs/ADR-003-browser-native-acoustic-synthesis.md)**: Zero-Latency Browser-Native Acoustic Synthesis vs. Cloud Media Services.
- **[ADR-004](.entire/adrs/ADR-004-offline-first-pwa-static-export.md)**: Scope-Relative Offline Service Worker & Static GitHub Pages Export.

---

## 4. Test Suite & Verification Results

BreakPoint includes a deterministic test suite verifying real application physics, mathematical ephemeris, cognitive generation, and persistence:

```bash
# Run the automated unit test suite
npm test
```

### Actual Test Execution Output:
```
> breakpoint@1.0.0 test
> tsx --test tests/solar-engine.test.ts tests/cognitive-engine.test.ts tests/mission-store.test.ts

▶ BreakPoint Cognitive Engine — Deterministic Reset Missions
  ✔ supports all 4 cognitive blocker presets (1.05ms)
  ✔ correctly calculates turnaround and return times for 15, 20, and 30 minute durations (0.24ms)
  ✔ adapts observation task for daytime vs nighttime missions (0.18ms)
  ✔ generates concise spoken audio script containing vital return milestones (0.27ms)
  ✔ guarantees deterministic mission generation for identical inputs (0.82ms)
  ✔ enforces physical safety notices on all generated missions (0.16ms)
✔ BreakPoint Cognitive Engine — Deterministic Reset Missions (4.45ms)

▶ BreakPoint Mission Store — Persistence & SSR Fallback
  ✔ provides safe default mission during SSR when window is undefined (1.49ms)
  ✔ persists and restores mission when localStorage is available (0.49ms)
  ✔ gracefully handles corrupt JSON in localStorage without throwing (0.46ms)
✔ BreakPoint Mission Store — Persistence & SSR Fallback (3.63ms)

▶ BreakPoint Solar Engine — NOAA Mathematical ephemeris
  ✔ handles equator near solar noon on vernal equinox (21.71ms)
  ✔ calculates London summer solstice solar elevation correctly (0.39ms)
  ✔ calculates Southern Hemisphere (Sydney) winter noon correctly (0.26ms)
  ✔ handles Arctic Circle / Tromsø Polar Night in December (0.19ms)
  ✔ handles Arctic Circle / Tromsø Midnight Sun in June (0.16ms)
  ✔ classifies twilight and night states accurately with honest lux labels (0.15ms)
  ✔ safely clamps out-of-range coordinates without throwing or NaN (0.14ms)
  ✔ safely handles invalid Date instances without NaN crash (0.20ms)
  ✔ enforces optical and physical safety in returned advice (0.36ms)
✔ BreakPoint Solar Engine — NOAA Mathematical ephemeris (25.85ms)

ℹ tests 18
ℹ suites 3
ℹ pass 18
ℹ fail 0
ℹ cancelled 0
ℹ duration_ms 218.52ms
```

---

## 5. Technology Stack & Design System

- **Framework**: Next.js 15.2.1 (React 19, TypeScript)
- **Styling**: Strict Custom Vanilla CSS tokens (`src/styles/globals.css`) — Zero Tailwind, zero external UI libraries.
- **Audio**: Native Web Speech Synthesis & Web Audio API (432 Hz sine oscillator)
- **Canvas**: Native HTML5 Canvas 2D context for lockscreen wallpaper PNG generation
- **Deployment**: Static Export (`output: "export"`) hosted on GitHub Pages
- **Typography**: Google Fonts (`Inter`, `JetBrains Mono`, `Caveat` for handwritten accents)

---

## 6. Local Development & Production Build

### Prerequisites
- Node.js `v20+` (tested on Node.js `v24.15.0`)
- npm `v10+`

### Installation & Development
```bash
# Clone the repository
git clone https://github.com/smtahosin/breakpoint.git
cd breakpoint

# Install dependencies
npm install

# Run unit tests
npm test

# Run local development server
npm run dev

# Build static production export
npm run build
```

Static export artifacts are generated into the `out/` directory, ready for zero-backend static deployment.

---

## 7. Routes

- `/` — **Home**: Hero problem statement, prefrontal cortex exhaustion overview, and launch CTA.
- `/start/` — **Tactical Dispatcher**: Real-time NOAA solar telemetry, cognitive-lock chips, duration selector, and live return calculator.
- `/field-card/` — **Pocket Field Card**: Native audio briefing dispatcher, 1080×1920 mobile lockscreen wallpaper downloader, and optical guidance.
- `/science/` — **Neuroscience Foundation**: Interactive dual-brain focused vs. diffuse neural state visualizer and biological reset workflow.

---

## 8. Privacy, Security & Limitations

- **Zero-Telemetry**: No user coordinates or telemetry are ever sent to third-party servers.
- **Zero Secrets**: The application requires no cloud API keys, protecting client-side GitHub Pages deployments.
- **Astronomical Limitations**: Modeled daylight illuminance accounts for clear-sky direct beam and diffuse solar geometry. Local cloud cover, atmospheric particulate matter, and urban shading introduce natural variances of $\pm 20\%$.
- **Speech Synthesis Support**: Web Speech API is supported across all modern evergreen browsers (Chrome, Edge, Safari, Firefox). On browsers where speech synthesis is disabled by user policy, the visual field card provides all essential mission data.

---

## 9. License

MIT License &copy; 2026 S M Tahosin ([@smtahosin](https://github.com/smtahosin)).
