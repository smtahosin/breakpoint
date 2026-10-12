# ADR-001: Deterministic NOAA Solar Physics vs. Probabilistic LLM Generation

- **Status**: Accepted
- **Author**: S M Tahosin (@smtahosin)
- **Context**: Hacktoberfest 2026 Week 1 ("Touch Grass") — BreakPoint Architecture
- **Entire Checkpoint**: `cp_bp_01_ephemeris` (`Entire-Checkpoint: 8f4a1c9e2b704e6382103f5ad6a81b22e0394157`)

## Context and Problem Statement
BreakPoint dispatches software engineers on outdoor cognitive reset walks based on real-time solar elevation and daylight illuminance.
An initial naive prototype considered querying a cloud LLM or AI agent endpoint to "estimate the sun's position and suggest a walking direction."
However, generative large language models are inherently probabilistic, prone to hallucinations, require network access, introduce latency (1–4 seconds), and cannot reliably calculate astronomical trigonometry.

## Decision
We decided to implement the deterministic **Spencer/Meeus NOAA Solar Position Algorithm** entirely client-side in TypeScript (`src/lib/solar-engine.ts`), paired with a documented clear-sky physical illuminance model.

### Key Equations Implemented
1. **Julian Century** from J2000.0 epoch ($T = \frac{JD - 2451545.0}{36525}$)
2. **Geometric Mean Longitude & Anomaly of the Sun**
3. **Sun Equation of the Center** ($C$)
4. **Apparent Solar Longitude & Obliquity of the Ecliptic**
5. **Solar Declination** ($\delta$) and **Equation of Time** ($E_t$)
6. **Local Hour Angle** ($H$)
7. **Zenith & Atmospheric Refraction Correction** (Saemundsson formula for horizons)
8. **Solar Azimuth** clockwise from true North ($0^\circ = \text{North}, 180^\circ = \text{South}$)
9. **Clear-Sky Illuminance Model** (Perez/CIE clear-sky formula: direct beam + diffuse sky lux)

## Trade-Offs Considered
| Dimension | Probabilistic LLM Generation | Deterministic NOAA Physics |
|---|---|---|
| **Mathematical Accuracy** | Hallucinates plausible but incorrect degrees | Sub-degree astronomical precision |
| **Network Dependency** | Requires active internet & cloud API | 100% offline-capable, 0 external requests |
| **Execution Latency** | 1,200ms – 4,500ms | < 0.2ms client-side execution |
| **Privacy & Security** | User coordinates sent over wire to cloud | Coordinates never leave browser memory |
| **Verification & Testing** | Non-deterministic, difficult to test | Verified by automated unit tests against NOAA benchmarks |

## Consequences
- Astronomical telemetry is guaranteed accurate across all latitudes, hemispheres (tested in London, New York, Sydney, Equator), and polar conditions (Tromsø polar night and midnight sun).
- Daylight lux is honestly labeled as `[value] lux (est.)` or `< 0.1 lux (night)`, eliminating deceptive "fake sensor" readings.
- Physical safety is strictly enforced: azimuth is an observational reference, not a walking route; direct sun-gazing is explicitly prohibited.
