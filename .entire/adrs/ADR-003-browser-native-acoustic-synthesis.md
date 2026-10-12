# ADR-003: Zero-Latency Browser-Native Acoustic Synthesis vs. Cloud Media Services

- **Status**: Accepted
- **Author**: S M Tahosin (@smtahosin)
- **Context**: Hacktoberfest 2026 Week 1 ("Touch Grass") — BreakPoint Architecture
- **Entire Checkpoint**: `cp_bp_03_audio_lockscreen` (`Entire-Checkpoint: 7c2840fe11a5b8823901b2a9d8234ea72085c13e`)

## Context and Problem Statement
BreakPoint features an acoustic briefing that speaks the developer's mission turnaround and return deadlines, accompanied by an ambient calming tone.
Traditional implementations stream pre-rendered MP3 files from external CDNs or call cloud TTS APIs (e.g. ElevenLabs, Google TTS).
However, cloud TTS calls require secret API tokens, incur bandwidth and network latency (delaying departure), and fail when the engineer is transitioning offline or walking outdoors.

## Decision
We implemented native client-side audio using browser APIs:
1. **Web Speech Synthesis API** (`window.speechSynthesis`):
   - Speaks mission briefing text dynamically matching the active blocker and duration.
   - Enforces speech queue cancellation (`cancel()`) before new utterances to prevent overlapping audio glitches.
   - Fallback voice selection: dynamically filters for natural English voices (Google US English, Samantha, Daniel) with default system voice fallback.
2. **Web Audio API** (`window.AudioContext`):
   - Generates a subtle 432 Hz sine oscillator drone with exponential gain envelope smoothing (`gainNode.linearRampToValueAtTime`) to avoid click/pop artifacts.
   - Ambient tone is labeled as an observational calming tone without making pseudoscientific medical claims.

## Trade-Offs Considered
| Dimension | Cloud TTS / Media Streaming | Browser-Native Web Speech & Audio API |
|---|---|---|
| **Latency to First Sound** | 800ms – 2,500ms | < 20ms |
| **Offline Capability** | Fails completely without internet | Works 100% offline |
| **API Costs & Rate Limits** | Pay-per-character, rate-limited | Zero cost, unlimited dispatches |
| **Data Privacy** | Spoken text sent to external cloud | Processed entirely on local audio hardware |

## Consequences
- Engineers can start their acoustic briefing with immediate playback.
- The interface provides full play, pause, and cancellation controls without freezing or audio deadlocks.
