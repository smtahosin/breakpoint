'use client';

import React, { useState, useEffect } from 'react';
import {
  Download,
  FileText,
  Play,
  Pause,
  Volume2,
  Share2,
  Wind,
  Compass,
  Brain,
  Sun,
  X,
  Printer,
  ShieldAlert,
  Clock,
  Navigation
} from 'lucide-react';
import { audioEngine, AudioPlaybackState } from '../../lib/audio-engine';
import { downloadPocketFieldCard } from '../../lib/card-canvas';
import { getStoredMission } from '../../lib/mission-store';
import { BreakMission } from '../../lib/cognitive-engine';
import { assetPath } from '../../lib/asset-path';

export default function FieldCardPage() {
  const [mission, setMission] = useState<BreakMission>(() => getStoredMission());
  const [playbackState, setPlaybackState] = useState<AudioPlaybackState>('idle');
  const [audioSeconds, setAudioSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(20);
  const [activeTip, setActiveTip] = useState<'breathing' | 'mindset' | 'focus' | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  useEffect(() => {
    // Sync active mission on mount or updates
    const active = getStoredMission();
    setMission(active);

    const handleMissionUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<BreakMission>;
      if (customEvent.detail) {
        setMission(customEvent.detail);
      }
    };

    window.addEventListener('breakpoint_mission_updated', handleMissionUpdate);
    return () => {
      window.removeEventListener('breakpoint_mission_updated', handleMissionUpdate);
      audioEngine.stop();
    };
  }, []);

  // Audio Play / Pause handler
  const toggleAudio = () => {
    if (playbackState === 'playing') {
      audioEngine.stop();
      setPlaybackState('idle');
      setAudioSeconds(0);
    } else {
      audioEngine.playMissionBriefing(
        mission,
        (curr, total) => {
          setAudioSeconds(curr);
          setTotalSeconds(total);
        },
        (state) => {
          setPlaybackState(state);
          if (state === 'idle') setAudioSeconds(0);
        }
      );
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadPocketFieldCard(mission);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="field-card-page-wrapper">
      <div className="page-container field-card-grid">
        {/* Left Column Content */}
        <div className="field-card-content">
          {/* Pill Badge */}
          <div className="pill-badge">
            <span>Take It With You</span>
          </div>

          {/* Heading */}
          <h1 className="field-card-title">
            Your Pocket<br />
            Field Card
          </h1>

          {/* Subtitle */}
          <p className="field-card-subtitle">
            A simple guide for your {mission.durationMinutes}-minute outdoor reset ({mission.blocker.label}). Save it on your phone or print it.
          </p>

          {/* Action Buttons */}
          <div className="action-buttons-row">
            <button
              type="button"
              className="btn-primary"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              <Download size={18} />
              <span>{isDownloading ? 'Exporting 1080p...' : 'Download Card'}</span>
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowPdfModal(true)}
            >
              <FileText size={18} />
              <span>View PDF</span>
            </button>
          </div>

          {/* "Your Audio Brief" Card */}
          <div className="audio-brief-card">
            <div className="audio-card-header">
              <span className="audio-title">Your Audio Brief &bull; {mission.durationMinutes}-Min Dispatch</span>
              <span className="return-deadline-badge">Return: {mission.returnTime}</span>
            </div>

            <div className="audio-player-row">
              {/* Play/Pause Button */}
              <button
                type="button"
                className={`audio-play-btn ${playbackState === 'playing' ? 'playing' : ''}`}
                onClick={toggleAudio}
                aria-label={playbackState === 'playing' ? 'Pause audio brief' : 'Play audio brief'}
              >
                {playbackState === 'playing' ? <Pause size={18} /> : <Play size={18} className="translate-x-0.5" />}
              </button>

              {/* Dynamic Waveform Visualizer */}
              <div className="waveform-container">
                <div className="waveform-bars">
                  {[24, 45, 60, 30, 80, 50, 90, 65, 40, 75, 55, 85, 45, 95, 60, 70, 35, 50, 80, 60, 45, 30, 70, 50].map((height, i) => (
                    <div
                      key={i}
                      className={`waveform-bar ${playbackState === 'playing' ? 'active' : ''}`}
                      style={{
                        height: playbackState === 'playing' ? `${Math.max(15, (height * ((audioSeconds % 4) + 1)) % 100)}%` : `${height}%`,
                        animationDelay: `${i * 0.05}s`
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Time display & controls */}
              <div className="audio-meta">
                <span className="audio-time">
                  {formatTime(audioSeconds)} / {formatTime(totalSeconds)}
                </span>
                <Volume2 size={16} className="audio-icon" />
                <button
                  type="button"
                  className="audio-icon-btn"
                  onClick={handleDownload}
                  title="Export audio brief card wallpaper"
                  aria-label="Export audio brief card"
                >
                  <Share2 size={16} className="audio-icon" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Guidance Pill Tags */}
          <div className="guidance-pills-row">
            <button
              type="button"
              className={`guide-pill ${activeTip === 'breathing' ? 'active' : ''}`}
              onClick={() => setActiveTip(activeTip === 'breathing' ? null : 'breathing')}
            >
              <Wind size={15} />
              <span>Breathing Guide</span>
            </button>

            <button
              type="button"
              className={`guide-pill ${activeTip === 'mindset' ? 'active' : ''}`}
              onClick={() => setActiveTip(activeTip === 'mindset' ? null : 'mindset')}
            >
              <Compass size={15} />
              <span>Mindset Reset</span>
            </button>

            <button
              type="button"
              className={`guide-pill ${activeTip === 'focus' ? 'active' : ''}`}
              onClick={() => setActiveTip(activeTip === 'focus' ? null : 'focus')}
            >
              <Brain size={15} />
              <span>Focus Techniques</span>
            </button>
          </div>

          {/* Tip Drawer */}
          {activeTip && (
            <div className="tip-box">
              {activeTip === 'breathing' && (
                <p>
                  <strong>Physiological Sigh:</strong> Two quick inhales through the nose, followed by one long, slow exhale through the mouth. Repeat 3 times to immediately normalize heart-rate variability and cortisol.
                </p>
              )}
              {activeTip === 'mindset' && (
                <p>
                  <strong>Cognitive Disengagement ({mission.blocker.label}):</strong> {mission.blocker.diffusePrompt}
                </p>
              )}
              {activeTip === 'focus' && (
                <p>
                  <strong>Panoramic Gaze:</strong> {mission.observationTask}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right Photographic Visual: Hand Holding Tactile Field Card */}
        <div className="field-card-visual-col">
          <div className="hand-card-wrapper">
            {/* The tactile card mockup */}
            <div className="tactile-card-render">
              {/* Card Header */}
              <div className="card-top-row">
                <Sun size={20} color="#f59e0b" />
                <div className="card-brand-title">
                  Break<span style={{ color: '#22c55e' }}>Point</span>
                </div>
              </div>
              <div className="card-category-label">
                {mission.blocker.shortLabel.toUpperCase()} &bull; {mission.durationMinutes}M RESET
              </div>

              {/* Landscape lake painting */}
              <div className="card-lake-art">
                <img
                  src={assetPath('/images/field-card-lake.jpg')}
                  alt="Peaceful nature landscape for pocket field card"
                  className="lake-img"
                />
              </div>

              {/* The 5 Dynamic Steps */}
              <div className="field-card-steps">
                {mission.steps.map((step, idx) => (
                  <div key={idx} className="field-step-row">
                    <div className="num-badge">{idx + 1}</div>
                    <div className="step-desc">{step}</div>
                  </div>
                ))}
              </div>

              {/* Card Bottom Signature */}
              <div className="field-card-bottom-cursive">
                Same Problem. Brighter Perspective.
              </div>
            </div>

            {/* Realistic hand background image */}
            <img
              src={assetPath('/images/field-card-holding.jpg')}
              alt="Hand holding BreakPoint pocket field card outdoors"
              className="holding-hand-bg"
            />
          </div>
        </div>
      </div>

      {/* PDF Printable Modal */}
      {showPdfModal && (
        <div className="pdf-modal-overlay" onClick={() => setShowPdfModal(false)}>
          <div className="pdf-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="pdf-modal-header">
              <div className="pdf-title-wrap">
                <FileText size={20} color="#22c55e" />
                <h3>BreakPoint 3&times;5 Field Card (Printable Sheet)</h3>
              </div>
              <button
                type="button"
                className="close-btn"
                onClick={() => setShowPdfModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="pdf-modal-body">
              <div className="printable-card-preview">
                <div className="print-header">
                  <Sun size={24} color="#f59e0b" />
                  <h2>BreakPoint // POCKET FIELD CARD</h2>
                  <span>{mission.blocker.label.toUpperCase()} &bull; {mission.durationMinutes}-MINUTE RESET</span>
                </div>
                <div className="print-telemetry-row">
                  <span><strong>Sun Elevation:</strong> {mission.solarTelemetry.elevationFormatted}</span>
                  <span><strong>Daylight Est.:</strong> {mission.solarTelemetry.luxLabel}</span>
                  <span><strong>Return Time:</strong> {mission.returnTime}</span>
                </div>
                <div className="print-steps">
                  {mission.steps.map((st, i) => (
                    <p key={i}><strong>{i + 1}.</strong> {st}</p>
                  ))}
                  <p><strong>Observation Task:</strong> {mission.observationTask}</p>
                </div>
                <div className="print-footer">
                  <em>&ldquo;Same Problem. Brighter Perspective.&rdquo; &bull; smtahosin.github.io/breakpoint</em>
                </div>
              </div>
            </div>

            <div className="pdf-modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => window.print()}
              >
                <Printer size={16} />
                <span>Print Document</span>
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleDownload}
              >
                <Download size={16} />
                <span>Download Wallpaper PNG</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .field-card-page-wrapper {
          position: relative;
          min-height: calc(100vh - 72px);
          display: flex;
          align-items: center;
          padding: 24px 0 36px;
        }

        .field-card-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 48px;
          align-items: center;
          width: 100%;
        }

        /* Left Column */
        .field-card-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          max-width: 560px;
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
          margin-bottom: 16px;
        }

        .field-card-title {
          font-size: clamp(2.6rem, 4.2vw, 3.8rem);
          font-weight: 900;
          letter-spacing: -1.5px;
          line-height: 1.1;
          color: #ffffff;
          margin-bottom: 12px;
        }

        .field-card-subtitle {
          font-size: 1.05rem;
          color: #94a3b8;
          line-height: 1.45;
          margin-bottom: 20px;
        }

        /* Action Buttons */
        .action-buttons-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }

        /* Audio Brief Card */
        .audio-brief-card {
          width: 100%;
          background: rgba(13, 20, 31, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          padding: 14px 18px;
          margin-bottom: 18px;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.6);
        }

        .audio-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .audio-title {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .return-deadline-badge {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--accent-green-light);
          background: rgba(34, 197, 94, 0.15);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .audio-player-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .audio-play-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--accent-green);
          color: #04210f;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4);
        }

        .audio-play-btn:hover {
          background: var(--accent-green-light);
          transform: scale(1.05);
        }

        .waveform-container {
          flex: 1;
          height: 38px;
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          padding: 0 8px;
        }

        .waveform-bars {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 100%;
          gap: 3px;
        }

        .waveform-bar {
          width: 3px;
          background: #475569;
          border-radius: 2px;
          transition: height 0.15s ease, background-color 0.2s;
        }

        .waveform-bar.active {
          background: var(--accent-green);
          box-shadow: 0 0 6px rgba(34, 197, 94, 0.6);
        }

        .audio-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .audio-time {
          font-family: var(--font-mono);
          font-size: 0.8125rem;
          color: #94a3b8;
        }

        .audio-icon {
          color: #64748b;
          transition: color 0.2s;
        }

        .audio-icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          padding: 4px;
          cursor: pointer;
          border-radius: 4px;
        }

        .audio-icon-btn:hover .audio-icon {
          color: #ffffff;
        }

        /* Guidance Pills */
        .guidance-pills-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .guide-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          font-size: 0.8125rem;
          font-weight: 500;
          color: #94a3b8;
          transition: all 0.2s;
        }

        .guide-pill:hover,
        .guide-pill.active {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.25);
        }

        .guide-pill.active {
          border-color: var(--accent-green);
          color: var(--accent-green-light);
        }

        .tip-box {
          width: 100%;
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.25);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 0.8125rem;
          color: #cbd5e1;
          line-height: 1.5;
        }

        /* Right Column Hand Visual */
        .field-card-visual-col {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hand-card-wrapper {
          position: relative;
          width: 100%;
          max-width: 580px;
          aspect-ratio: 4 / 3.4;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .holding-hand-bg {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Tactile Card Overlay */
        .tactile-card-render {
          position: absolute;
          width: 250px;
          background: rgba(15, 23, 42, 0.94);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 18px;
          padding: 16px 14px 14px;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(14px);
          z-index: 10;
        }

        .card-top-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .card-brand-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: #ffffff;
        }

        .card-category-label {
          text-align: center;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 2px;
          color: #4ade80;
          margin-bottom: 8px;
        }

        .card-lake-art {
          width: 100%;
          height: 95px;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .lake-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .field-card-steps {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 10px;
        }

        .field-step-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .num-badge {
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

        .step-desc {
          font-size: 0.68rem;
          color: #e2e8f0;
          font-weight: 500;
          line-height: 1.2;
        }

        .field-card-bottom-cursive {
          font-family: var(--font-script);
          font-size: 1.15rem;
          font-weight: 700;
          color: #38bdf8;
          text-align: center;
          padding-top: 2px;
        }

        /* PDF Modal */
        .pdf-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .pdf-modal-box {
          background: #090e17;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          max-width: 580px;
          width: 100%;
          padding: 24px;
        }

        .pdf-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .pdf-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pdf-title-wrap h3 {
          font-size: 1.05rem;
          color: #ffffff;
          font-weight: 700;
        }

        .close-btn {
          color: #94a3b8;
          padding: 4px;
        }

        .close-btn:hover {
          color: #ffffff;
        }

        .printable-card-preview {
          background: #ffffff;
          color: #0f172a;
          border-radius: 10px;
          padding: 24px;
          margin-bottom: 20px;
        }

        .print-header {
          text-align: center;
          margin-bottom: 12px;
          border-bottom: 2px solid #0f172a;
          padding-bottom: 8px;
        }

        .print-header h2 {
          font-size: 1.15rem;
          font-weight: 800;
          margin-top: 4px;
        }

        .print-header span {
          font-size: 0.7rem;
          font-family: var(--font-mono);
          letter-spacing: 1px;
          color: #15803d;
          font-weight: 700;
        }

        .print-telemetry-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #475569;
          padding-bottom: 10px;
          margin-bottom: 10px;
          border-bottom: 1px dashed #cbd5e1;
        }

        .print-steps {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 0.8125rem;
          line-height: 1.4;
          margin-bottom: 16px;
        }

        .print-footer {
          text-align: center;
          font-size: 0.75rem;
          color: #64748b;
          border-top: 1px solid #e2e8f0;
          padding-top: 10px;
        }

        .pdf-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        @media (max-width: 992px) {
          .field-card-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .field-card-visual-col {
            order: -1;
            max-width: 600px;
            margin: 0 auto;
          }

          .field-card-content {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
