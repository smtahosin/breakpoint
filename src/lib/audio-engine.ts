/**
 * BreakPoint Audio Engine
 * Client-side Web Speech API & Web Audio API acoustic dispatcher.
 * Delivers spoken instructions for the active mission with calming ambient acoustic tone.
 */

import { BreakMission } from './cognitive-engine';

export type AudioPlaybackState = 'idle' | 'playing' | 'paused' | 'error';

class BreakPointAudioEngine {
  private audioCtx: AudioContext | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private state: AudioPlaybackState = 'idle';
  private currentSeconds: number = 0;
  private totalSeconds: number = 20;
  private timerInterval: NodeJS.Timeout | null = null;
  private onStateChangeCb: ((state: AudioPlaybackState) => void) | null = null;
  private onTimeUpdateCb: ((curr: number, total: number) => void) | null = null;

  private initAudioContext(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      if (!this.audioCtx) {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtxClass) {
          this.audioCtx = new AudioCtxClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return true;
    } catch {
      return false;
    }
  }

  private startAmbientTone() {
    if (!this.audioCtx) return;
    try {
      this.stopAmbientTone();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Gentle natural 432 Hz harmonic
      osc.type = 'sine';
      osc.frequency.setValueAtTime(432, this.audioCtx.currentTime);

      // Low, safe volume level (ramp gently from 0.001 to 0.035)
      gain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.035, this.audioCtx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();

      this.ambientOsc = osc;
      this.ambientGain = gain;
    } catch {
      // AudioContext policy restrictions handled gracefully
    }
  }

  private stopAmbientTone() {
    if (this.ambientOsc && this.ambientGain && this.audioCtx) {
      try {
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.3);
        this.ambientOsc.stop(this.audioCtx.currentTime + 0.35);
      } catch {
        // Safe cleanup
      }
      this.ambientOsc = null;
      this.ambientGain = null;
    }
  }

  public playMissionBriefing(
    mission: BreakMission,
    onTimeUpdate?: (curr: number, total: number) => void,
    onStateChange?: (state: AudioPlaybackState) => void
  ) {
    if (typeof window === 'undefined') return;

    // Cancel any prior speech and tones immediately
    this.stop();

    this.onTimeUpdateCb = onTimeUpdate || null;
    this.onStateChangeCb = onStateChange || null;

    // Check SpeechSynthesis support
    if (!('speechSynthesis' in window)) {
      this.state = 'error';
      if (this.onStateChangeCb) this.onStateChangeCb('error');
      return;
    }

    this.initAudioContext();
    this.startAmbientTone();

    this.state = 'playing';
    this.currentSeconds = 0;
    this.totalSeconds = Math.max(18, Math.min(24, Math.round(mission.durationMinutes * 0.8 + 8)));

    if (this.onStateChangeCb) this.onStateChangeCb('playing');
    if (this.onTimeUpdateCb) this.onTimeUpdateCb(0, this.totalSeconds);

    const utterance = new SpeechSynthesisUtterance(mission.audioScript);
    utterance.rate = 0.94; // Calm, clear cadence
    utterance.pitch = 1.0;
    utterance.volume = 0.95;

    // Select preferred natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      this.stop();
    };

    utterance.onerror = (e) => {
      // If user canceled, don't trigger error
      if (e.error !== 'canceled') {
        this.stop();
      }
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);

    // Track progression timer
    this.timerInterval = setInterval(() => {
      this.currentSeconds += 1;
      if (this.onTimeUpdateCb) {
        this.onTimeUpdateCb(this.currentSeconds, this.totalSeconds);
      }
      if (this.currentSeconds >= this.totalSeconds) {
        this.stop();
      }
    }, 1000);
  }

  public stop() {
    this.state = 'idle';
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    this.stopAmbientTone();
    this.currentUtterance = null;
    this.currentSeconds = 0;

    if (this.onStateChangeCb) this.onStateChangeCb('idle');
    if (this.onTimeUpdateCb) this.onTimeUpdateCb(0, this.totalSeconds);
  }

  public getState(): AudioPlaybackState {
    return this.state;
  }
}

export const audioEngine = new BreakPointAudioEngine();
