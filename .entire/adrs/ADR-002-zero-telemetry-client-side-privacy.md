# ADR-002: Zero-Telemetry Client-Side Privacy Architecture

- **Status**: Accepted
- **Author**: S M Tahosin (@smtahosin)
- **Context**: Hacktoberfest 2026 Week 1 ("Touch Grass") — BreakPoint Architecture
- **Entire Checkpoint**: `cp_bp_02_cognitive_safety` (`Entire-Checkpoint: 3e7b91d45c82a01f6634992dc17482b814032d91`)

## Context and Problem Statement
BreakPoint calculates astronomical solar elevation based on user latitude and longitude.
Sending user geolocation coordinates to backend analytics, tracking services, or external reverse-geocoding APIs creates unacceptable privacy liabilities and requires secret API keys that cannot be securely hosted on public static GitHub Pages.

## Decision
We adopted a strict **Zero-Telemetry, Client-Side Privacy Architecture**:
1. Geolocation is requested solely via the browser's native `navigator.geolocation.getCurrentPosition` API upon explicit user interaction ("Use My Real-Time Location").
2. Coordinates are stored in local component memory and never transmitted over any network socket.
3. If permission is denied, timed out, or unavailable, the application provides an immediate manual city selector (San Francisco, New York, London, Tokyo, Sydney, Dhaka) without breaking or showing simulated fake telemetry.
4. Active reset missions are stored exclusively in `localStorage` under key `breakpoint_active_mission_v1`.
5. Zero external analytics scripts, trackers, or cookies are loaded.

## Trade-Offs Considered
| Dimension | Centralized Server Backend | Zero-Telemetry Static Architecture |
|---|---|---|
| **Privacy Risk** | High (storing user location history) | Zero (coordinates never leave device) |
| **API Keys & Secrets** | Requires backend proxy & API key management | Zero secrets needed; 100% static GitHub Pages compatible |
| **Failure Modes** | Network failure breaks application | Works seamlessly offline and with denied permissions |
| **Operational Cost** | Server hosting & maintenance | Free, immutable static hosting via GitHub Pages |

## Consequences
- The application remains fully functional even when the user denies location access.
- Static export (`output: 'export'`) runs anywhere without requiring backend infrastructure.
