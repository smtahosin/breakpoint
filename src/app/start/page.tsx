'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sun,
  Compass,
  MapPin,
  Crosshair,
  Sparkles,
  Lock,
  ArrowRight,
  Footprints,
  Ruler,
  Zap,
  Activity,
  CheckCircle2,
  Bug,
  GitMerge,
  Cpu,
  ZapOff
} from 'lucide-react';
import { assetPath } from '../../lib/asset-path';
import { calculateSolarTelemetry, SolarTelemetry } from '../../lib/solar-engine';
import {
  generateBreakMission,
  BreakMission,
  CognitiveBlockerId,
  ResetDurationMinutes,
  COGNITIVE_BLOCKERS
} from '../../lib/cognitive-engine';
import { createAndSaveMission, getStoredMission } from '../../lib/mission-store';

const PRESET_CITIES = [
  { name: 'San Francisco, CA', lat: 37.7749, lon: -122.4194 },
  { name: 'London, UK', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503 },
  { name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093 },
  { name: 'Dhaka, Bangladesh', lat: 23.8103, lon: 90.4125 }
];

export default function StartPage() {
  const router = useRouter();

  // Active state
  const [selectedBlocker, setSelectedBlocker] = useState<CognitiveBlockerId>('bug');
  const [selectedDuration, setSelectedDuration] = useState<ResetDurationMinutes>(20);
  const [locationName, setLocationName] = useState('Detect my location');
  const [locationStatus, setLocationStatus] = useState<'idle' | 'locating' | 'granted' | 'denied'>('idle');
  const [coords, setCoords] = useState<{ lat: number; lon: number }>({ lat: 23.8103, lon: 90.4125 });
  const [telemetry, setTelemetry] = useState<SolarTelemetry>(calculateSolarTelemetry());
  const [activeMission, setActiveMission] = useState<BreakMission | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Recalculate solar telemetry on coordinate or time change
  useEffect(() => {
    const updatedTelemetry = calculateSolarTelemetry(coords.lat, coords.lon, new Date());
    setTelemetry(updatedTelemetry);
    const mission = generateBreakMission(selectedBlocker, selectedDuration, updatedTelemetry, new Date());
    setActiveMission(mission);
  }, [coords, selectedBlocker, selectedDuration]);

  // Request browser geolocation on user intent
  const handleDetectLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationStatus('denied');
      setLocationName('Manual GPS Fallback (23.8° N, 90.4° E)');
      return;
    }

    setLocationStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lon: longitude });
        setLocationName(`Current GPS (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`);
        setLocationStatus('granted');
      },
      (err) => {
        // Honest permission handling
        setLocationStatus('denied');
        setLocationName('San Francisco, CA (Default)');
        setCoords({ lat: 37.7749, lon: -122.4194 });
      },
      { timeout: 7000, enableHighAccuracy: false }
    );
  };

  const handleSelectCity = (city: typeof PRESET_CITIES[0]) => {
    setCoords({ lat: city.lat, lon: city.lon });
    setLocationName(city.name);
    setLocationStatus('granted');
  };

  const handleGenerateBreak = () => {
    setIsGenerating(true);
    const mission = createAndSaveMission(selectedBlocker, selectedDuration, telemetry);
    setTimeout(() => {
      router.push('/field-card');
    }, 350);
  };

  return (
    <div className="start-page-wrapper">
      <div className="page-container start-grid">
        {/* Left Interactive Dispatch Column */}
        <div className="start-content">
          {/* Pill Badge */}
          <div className="pill-badge">
            <span>{selectedDuration}-Minute Reset</span>
          </div>

          {/* Heading */}
          <h1 className="start-title">
            Ready for a<br />
            Break<span className="text-green">Point</span> ?
          </h1>

          {/* Subtitle */}
          <p className="start-subtitle">
            Get your personalized outdoor walk plan in 15 seconds.
          </p>

          {/* Cognitive Lock Selector */}
          <div className="control-group">
            <span className="control-label">Select Your Blocker</span>
            <div className="blocker-chips-grid">
              <button
                type="button"
                className={`blocker-chip ${selectedBlocker === 'bug' ? 'active' : ''}`}
                onClick={() => setSelectedBlocker('bug')}
              >
                <Bug size={14} className="blocker-icon red" />
                <span>Complex Bug</span>
              </button>

              <button
                type="button"
                className={`blocker-chip ${selectedBlocker === 'conflict' ? 'active' : ''}`}
                onClick={() => setSelectedBlocker('conflict')}
              >
                <GitMerge size={14} className="blocker-icon amber" />
                <span>Merge Conflict</span>
              </button>

              <button
                type="button"
                className={`blocker-chip ${selectedBlocker === 'leak' ? 'active' : ''}`}
                onClick={() => setSelectedBlocker('leak')}
              >
                <Cpu size={14} className="blocker-icon blue" />
                <span>Memory Leak</span>
              </button>

              <button
                type="button"
                className={`blocker-chip ${selectedBlocker === 'burnout' ? 'active' : ''}`}
                onClick={() => setSelectedBlocker('burnout')}
              >
                <ZapOff size={14} className="blocker-icon purple" />
                <span>Deploy Burnout</span>
              </button>
            </div>
          </div>

          {/* Duration Selector */}
          <div className="control-group">
            <span className="control-label">Break Duration</span>
            <div className="duration-pills-row">
              {([15, 20, 30] as ResetDurationMinutes[]).map((mins) => (
                <button
                  key={mins}
                  type="button"
                  className={`duration-pill ${selectedDuration === mins ? 'active' : ''}`}
                  onClick={() => setSelectedDuration(mins)}
                >
                  <span>{mins} Minutes</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location Box */}
          <div className="location-box-group">
            <div className="location-header-row">
              <label className="input-label" htmlFor="location-input">Your Location</label>
              {locationStatus === 'denied' && (
                <span className="location-warning">Location denied &bull; using fallback</span>
              )}
            </div>
            <div className="location-input-wrapper">
              <MapPin size={18} className="pin-icon" />
              <input
                id="location-input"
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="location-input"
                placeholder="Enter city or coordinates..."
              />
              <button
                type="button"
                className={`gps-target-btn ${locationStatus === 'locating' ? 'locating' : ''}`}
                onClick={handleDetectLocation}
                title="Detect current GPS coordinates"
                aria-label="Detect GPS coordinates"
              >
                <Crosshair size={18} />
              </button>
            </div>

            {/* Quick city selectors */}
            <div className="preset-cities-row">
              {PRESET_CITIES.slice(0, 4).map((city) => (
                <button
                  key={city.name}
                  type="button"
                  className="preset-city-btn"
                  onClick={() => handleSelectCity(city)}
                >
                  {city.name.split(',')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Telemetry Metric Cards */}
          <div className="telemetry-cards-row">
            {/* Sun Elevation */}
            <div className="telemetry-card">
              <Sun size={20} className="telemetry-icon sun" />
              <div className="telemetry-val">{telemetry.elevationFormatted}</div>
              <div className="telemetry-lbl">Sun Elevation</div>
            </div>

            {/* Daylight Intensity */}
            <div className="telemetry-card">
              <Zap size={20} className="telemetry-icon lux" />
              <div className="telemetry-val">{telemetry.luxLabel}</div>
              <div className="telemetry-lbl">Daylight Intensity</div>
            </div>

            {/* Visual Distance */}
            <div className="telemetry-card">
              <Ruler size={20} className="telemetry-icon dist" />
              <div className="telemetry-val">20–50 m</div>
              <div className="telemetry-lbl">Visual Distance</div>
            </div>
          </div>

          {/* Big CTA Button */}
          <button
            type="button"
            className="btn-primary w-full generate-cta"
            onClick={handleGenerateBreak}
            disabled={isGenerating}
          >
            <Sparkles size={18} />
            <span>{isGenerating ? 'Synthesizing Mission...' : 'Generate My Break'}</span>
            <ArrowRight size={18} />
          </button>

          {/* Security & Offline Guarantee */}
          <div className="offline-guarantee">
            <Lock size={14} className="lock-icon" />
            <span>100% offline-ready &bull; Zero server tracking &bull; No account required</span>
          </div>
        </div>

        {/* Right Tactical Card Floating on Nature Trail Background */}
        <div className="start-visual-col">
          <div className="forest-image-container">
            <img
              src={assetPath('/images/forest-trail-walk.jpg')}
              alt="Developer walking in peaceful natural forest trail"
              className="forest-bg-img"
            />
            <div className="forest-overlay" />

            {/* Floating Tactical Card (Dynamic to selected duration & mission) */}
            <div className="floating-tactical-card">
              <div className="card-header-tactical">
                <div className="reset-badge-icon">
                  <Footprints size={18} color="#22c55e" />
                </div>
                <div className="card-header-text">
                  <h3>Your {selectedDuration}-Minute</h3>
                  <h2>Outdoor Reset</h2>
                </div>
              </div>

              {/* Dynamic Steps List */}
              <div className="tactical-steps-list">
                {activeMission ? (
                  activeMission.steps.map((step, idx) => (
                    <div key={idx} className="tactical-step-item">
                      <div className="step-circle">{idx + 1}</div>
                      <div className="step-text">{step}</div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="tactical-step-item">
                      <div className="step-circle">1</div>
                      <div className="step-text">Close your laptop</div>
                    </div>
                    <div className="tactical-step-item">
                      <div className="step-circle">2</div>
                      <div className="step-text">Put your phone away</div>
                    </div>
                    <div className="tactical-step-item">
                      <div className="step-circle">3</div>
                      <div className="step-text">Listen to the audio brief</div>
                    </div>
                    <div className="tactical-step-item">
                      <div className="step-circle">4</div>
                      <div className="step-text">Walk in natural daylight</div>
                    </div>
                    <div className="tactical-step-item">
                      <div className="step-circle">5</div>
                      <div className="step-text">Come back with a clearer mind</div>
                    </div>
                  </>
                )}
              </div>

              {/* Bottom Green Audio Squiggle */}
              <div className="card-waveform-squiggle">
                <svg width="100%" height="24" viewBox="0 0 200 24" fill="none">
                  <path
                    d="M0 12 Q 25 18, 50 12 T 100 12 T 150 6 T 200 12"
                    stroke="#22c55e"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Bottom Right Cursive Script */}
            <div className="start-cursive-callout">
              <div className="cursive-text">
                Same Problem.<br />
                Brighter Perspective.
              </div>
              <div className="cursive-line" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .start-page-wrapper {
          position: relative;
          min-height: calc(100vh - 72px);
          display: flex;
          align-items: center;
          padding: 24px 0 36px;
          background: radial-gradient(circle at 75% 35%, rgba(34, 197, 94, 0.12), transparent 60%);
        }

        .start-grid {
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          gap: 48px;
          align-items: center;
          width: 100%;
        }

        /* Left Column */
        .start-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          max-width: 540px;
        }

        .pill-badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          font-size: 0.8125rem;
          font-weight: 500;
          color: #94a3b8;
          margin-bottom: 14px;
        }

        .start-title {
          font-size: clamp(2.6rem, 4.2vw, 3.8rem);
          font-weight: 900;
          letter-spacing: -1.5px;
          line-height: 1.1;
          color: #ffffff;
          margin-bottom: 10px;
        }

        .text-green {
          color: var(--accent-green);
        }

        .start-subtitle {
          font-size: 1.05rem;
          color: #94a3b8;
          line-height: 1.45;
          margin-bottom: 18px;
        }

        /* Controls */
        .control-group {
          width: 100%;
          margin-bottom: 14px;
        }

        .control-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .blocker-chips-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .blocker-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(8, 22, 17, 0.85);
          border: 1px solid rgba(34, 197, 94, 0.18);
          border-radius: 8px;
          font-size: 0.8125rem;
          font-weight: 500;
          color: #d1fae5;
          cursor: pointer;
          transition: all 0.2s;
        }

        .blocker-chip:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .blocker-chip.active {
          background: rgba(34, 197, 94, 0.12);
          border-color: var(--accent-green);
          color: #ffffff;
          box-shadow: 0 0 12px rgba(34, 197, 94, 0.25);
        }

        .blocker-icon.red { color: #f87171; }
        .blocker-icon.amber { color: #fbbf24; }
        .blocker-icon.blue { color: #60a5fa; }
        .blocker-icon.purple { color: #c084fc; }

        .duration-pills-row {
          display: flex;
          gap: 8px;
        }

        .duration-pill {
          flex: 1;
          padding: 7px 12px;
          background: rgba(8, 22, 17, 0.85);
          border: 1px solid rgba(34, 197, 94, 0.18);
          border-radius: 8px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #a7f3d0;
          text-align: center;
          transition: all 0.2s;
        }

        .duration-pill:hover {
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.2);
        }

        .duration-pill.active {
          background: rgba(34, 197, 94, 0.12);
          border-color: var(--accent-green);
          color: var(--accent-green-light);
        }

        /* Location Input */
        .location-box-group {
          width: 100%;
          margin-bottom: 14px;
        }

        .location-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .input-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .location-warning {
          font-size: 0.7rem;
          color: #f59e0b;
        }

        .location-input-wrapper {
          display: flex;
          align-items: center;
          background: rgba(8, 22, 17, 0.88);
          border: 1px solid rgba(34, 197, 94, 0.22);
          border-radius: 10px;
          padding: 3px 8px 3px 14px;
          transition: border-color 0.2s;
        }

        .location-input-wrapper:focus-within {
          border-color: var(--accent-green);
          box-shadow: 0 0 0 1px var(--accent-green);
        }

        .pin-icon {
          color: #94a3b8;
          margin-right: 10px;
          flex-shrink: 0;
        }

        .location-input {
          flex: 1;
          background: none;
          border: none;
          color: #ffffff;
          font-family: inherit;
          font-size: 0.875rem;
          padding: 8px 0;
          outline: none;
        }

        .gps-target-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          color: #94a3b8;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .gps-target-btn:hover {
          color: var(--accent-green);
          background: rgba(255, 255, 255, 0.08);
        }

        .gps-target-btn.locating {
          animation: spin 1s linear infinite;
          color: var(--accent-green);
        }

        .preset-cities-row {
          display: flex;
          gap: 6px;
          margin-top: 6px;
          flex-wrap: wrap;
        }

        .preset-city-btn {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          padding: 2px 8px;
          font-size: 0.7rem;
          color: #94a3b8;
          transition: all 0.2s;
        }

        .preset-city-btn:hover {
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.2);
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        /* Telemetry Cards */
        .telemetry-cards-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          width: 100%;
          margin-bottom: 20px;
        }

        .telemetry-card {
          background: rgba(8, 22, 17, 0.85);
          border: 1px solid rgba(34, 197, 94, 0.18);
          border-radius: 12px;
          padding: 12px 10px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
        }

        .telemetry-icon.sun { color: #f59e0b; }
        .telemetry-icon.lux { color: #facc15; }
        .telemetry-icon.dist { color: #38bdf8; }

        .telemetry-val {
          font-size: 1.05rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
        }

        .telemetry-lbl {
          font-size: 0.7rem;
          color: #94a3b8;
          font-weight: 500;
        }

        /* Generate CTA Button */
        .generate-cta {
          font-size: 1.05rem;
          padding: 14px 28px;
          margin-bottom: 12px;
        }

        .offline-guarantee {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 2px;
        }

        .lock-icon {
          color: #64748b;
        }

        /* Right Visual Column */
        .start-visual-col {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .forest-image-container {
          position: relative;
          width: 100%;
          max-width: 580px;
          aspect-ratio: 4 / 3.4;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.1);
        }

        .forest-bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .forest-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(5, 13, 10, 0.1) 0%,
            rgba(5, 13, 10, 0.3) 60%,
            rgba(5, 13, 10, 0.85) 100%
          );
        }

        /* Floating Tactical Card */
        .floating-tactical-card {
          position: absolute;
          top: 32px;
          right: 28px;
          width: 260px;
          background: rgba(6, 18, 14, 0.94);
          border: 1px solid rgba(34, 197, 94, 0.35);
          border-radius: 14px;
          padding: 16px 14px 12px;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.8), 0 0 25px rgba(34, 197, 94, 0.2);
          backdrop-filter: blur(12px);
          z-index: 10;
        }

        .card-header-tactical {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .reset-badge-icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: rgba(34, 197, 94, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-header-text h3 {
          font-size: 0.68rem;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .card-header-text h2 {
          font-size: 0.82rem;
          font-weight: 700;
          color: #ffffff;
        }

        .tactical-steps-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 10px;
        }

        .tactical-step-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .step-circle {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 700;
          color: #ffffff;
          flex-shrink: 0;
        }

        .step-text {
          font-size: 0.72rem;
          color: #e2e8f0;
          font-weight: 500;
          line-height: 1.25;
        }

        .card-waveform-squiggle {
          padding-top: 4px;
        }

        /* Bottom Right Cursive Callout */
        .start-cursive-callout {
          position: absolute;
          bottom: 24px;
          right: 28px;
          z-index: 5;
        }

        .cursive-text {
          font-family: var(--font-script);
          font-size: 2.1rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.15;
          text-shadow: 0 3px 12px rgba(0, 0, 0, 0.9);
          transform: rotate(-3deg);
          text-align: right;
        }

        .cursive-line {
          width: 100%;
          height: 3px;
          background: var(--accent-green);
          border-radius: 2px;
          margin-top: 4px;
        }

        @media (max-width: 992px) {
          .start-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .start-visual-col {
            order: -1;
            max-width: 600px;
            margin: 0 auto;
          }

          .start-content {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
