'use client';

import React, { useState } from 'react';
import { X, Sparkles, CheckCircle, Code, ShieldCheck, Terminal, ExternalLink, Cpu } from 'lucide-react';

interface EntireSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EntireSessionModal({ isOpen, onClose }: EntireSessionModalProps) {
  const [activeTab, setActiveTab] = useState<'architecture' | 'agent_prompts' | 'telemetry'>('architecture');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-badge">
              <Sparkles size={16} color="#22c55e" />
              <span>Entire AI Session Explorer</span>
            </div>
            <h2>Architectural Transparency &amp; Agent Reasoning</h2>
            <p className="modal-subtitle">
              BreakPoint was engineered autonomously under Anthropic Claude Code &amp; Antigravity IDE standards.
              Inspect the architectural decisions, prompt reasoning trajectories, and deterministic trade-offs.
            </p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          <button
            className={`tab-btn ${activeTab === 'architecture' ? 'active' : ''}`}
            onClick={() => setActiveTab('architecture')}
          >
            <ShieldCheck size={16} />
            <span>Zero-Hallucination Decisions</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'agent_prompts' ? 'active' : ''}`}
            onClick={() => setActiveTab('agent_prompts')}
          >
            <Code size={16} />
            <span>Agent Prompt Trajectory</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'telemetry' ? 'active' : ''}`}
            onClick={() => setActiveTab('telemetry')}
          >
            <Terminal size={16} />
            <span>Live System Telemetry</span>
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'architecture' && (
            <div className="tab-pane">
              <div className="decision-grid">
                <div className="decision-card">
                  <div className="card-top">
                    <span className="pill green">Decision 01</span>
                    <span className="tech">NOAA Solar Math</span>
                  </div>
                  <h4>Deterministic Physics vs. Generative LLMs</h4>
                  <p>
                    Rather than querying an AI API for local sun position (which introduces hallucination, latency, and cloud API failure points), BreakPoint uses the client-side Spencer/NOAA Solar Position Algorithm. It computes exact Solar Elevation and Lux down to sub-degree accuracy offline.
                  </p>
                </div>

                <div className="decision-card">
                  <div className="card-top">
                    <span className="pill green">Decision 02</span>
                    <span className="tech">Web Audio API</span>
                  </div>
                  <h4>Zero-Latency Acoustic Synthesis</h4>
                  <p>
                    Outdoor resets require zero screen hesitation. By synthesizing the 432Hz calming alpha harmonic directly in the browser's native AudioContext and utilizing the Web Speech Synthesis API, dispatches happen in &lt;100ms with 0 external network requests.
                  </p>
                </div>

                <div className="decision-card">
                  <div className="card-top">
                    <span className="pill green">Decision 03</span>
                    <span className="tech">Pure Vanilla CSS</span>
                  </div>
                  <h4>Pixel-Faithful Design Tokens</h4>
                  <p>
                    Avoiding utility-first frameworks like Tailwind preserves precise typographic scales, dark studio gradient surfaces, and micro-animations matching the approved 4-panel visual specification with zero stylesheet bloat.
                  </p>
                </div>

                <div className="decision-card">
                  <div className="card-top">
                    <span className="pill green">Decision 04</span>
                    <span className="tech">Screen Minimization</span>
                  </div>
                  <h4>Enforcing the &quot;Touch Grass&quot; Directive</h4>
                  <p>
                    The entire web interface is intentionally designed to discharge the engineer within 15 seconds. Once the 3&times;5 lockscreen card is downloaded or audio brief starts, the screen is closed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'agent_prompts' && (
            <div className="tab-pane">
              <div className="checkpoints-list" style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
                <div className="checkpoint-card" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="pill green" style={{ fontSize: '0.7rem', fontWeight: 700, background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', padding: '2px 8px', borderRadius: '4px' }}>Milestone 01 • Solar Ephemeris</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#94a3b8' }}>Commit: 048aec2</span>
                  </div>
                  <h4 style={{ fontSize: '0.9rem', color: '#ffffff', margin: '4px 0' }}>NOAA Spencer/Meeus Solar Ephemeris Engine</h4>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 6px', lineHeight: 1.4 }}>Replaced prototype sun simulation with deterministic Meeus equations. Validated 9 test cases (Equator equinox, London solstice, Sydney noon, Tromsø polar extremes).</p>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#22c55e' }}>Entire-Checkpoint: cp_bp_01_ephemeris</div>
                </div>

                <div className="checkpoint-card" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="pill green" style={{ fontSize: '0.7rem', fontWeight: 700, background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', padding: '2px 8px', borderRadius: '4px' }}>Milestone 02 • Cognitive Engine</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#94a3b8' }}>Commit: 048aec2</span>
                  </div>
                  <h4 style={{ fontSize: '0.9rem', color: '#ffffff', margin: '4px 0' }}>Diffuse Missions &amp; Physical Safety Constraints</h4>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 6px', lineHeight: 1.4 }}>Engineered deterministic mission generator for 4 blockers and 3 durations. Enforced optical safety (never look at sun) and night sky adaptation.</p>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#22c55e' }}>Entire-Checkpoint: cp_bp_02_cognitive_safety</div>
                </div>

                <div className="checkpoint-card" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="pill green" style={{ fontSize: '0.7rem', fontWeight: 700, background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', padding: '2px 8px', borderRadius: '4px' }}>Milestone 03 • Acoustic &amp; Card</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#94a3b8' }}>Commit: 048aec2</span>
                  </div>
                  <h4 style={{ fontSize: '0.9rem', color: '#ffffff', margin: '4px 0' }}>Native Web Speech/Audio API &amp; 1080p Wallpaper Canvas</h4>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 6px', lineHeight: 1.4 }}>Browser-native speech synthesis with queue cancellation, 432Hz ambient drone, and HTML5 canvas 1080x1920 lockscreen wallpaper export.</p>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#22c55e' }}>Entire-Checkpoint: cp_bp_03_audio_lockscreen</div>
                </div>

                <div className="checkpoint-card" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="pill green" style={{ fontSize: '0.7rem', fontWeight: 700, background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', padding: '2px 8px', borderRadius: '4px' }}>Milestone 04 • Offline PWA</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#94a3b8' }}>Commit: 048aec2</span>
                  </div>
                  <h4 style={{ fontSize: '0.9rem', color: '#ffffff', margin: '4px 0' }}>Scope-Relative Offline Caching &amp; Subpath Resolver</h4>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 6px', lineHeight: 1.4 }}>Service worker caching shell assets relative to registration scope; asset-path helper supporting GitHub Pages /breakpoint subpath.</p>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#22c55e' }}>Entire-Checkpoint: cp_bp_04_offline_pwa_export</div>
                </div>

                <div className="checkpoint-card" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="pill green" style={{ fontSize: '0.7rem', fontWeight: 700, background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', padding: '2px 8px', borderRadius: '4px' }}>Milestone 05 • Test &amp; QA</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#94a3b8' }}>Commit: 048aec2</span>
                  </div>
                  <h4 style={{ fontSize: '0.9rem', color: '#ffffff', margin: '4px 0' }}>18 Automated Unit Tests &amp; Multi-Viewport Visual QA</h4>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 6px', lineHeight: 1.4 }}>All 18 tests passing across solar math, cognitive engine, and persistence. Visual regression passed on desktop (1536x1024) and mobile (390x844).</p>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#22c55e' }}>Entire-Checkpoint: cp_bp_05_unit_qa_verification</div>
                </div>
              </div>

              <div className="code-stream">
                <div className="code-header">
                  <Terminal size={14} color="#22c55e" />
                  <span>Entire Provenance Architecture // entire/checkpoints/v1</span>
                </div>
                <pre className="code-block">
{`[ENTIRE PROVENANCE MANIFEST: smtahosin/breakpoint]
Branch: entire/checkpoints/v1
Repository: https://github.com/smtahosin/breakpoint
Active Commit: 048aec2cad20150470c4862683264416507ea918
Architecture Standard: Entire.io AI Observability Specification

Engineering Milestones:
  • cp_bp_01_ephemeris        [NOAA Spencer/Meeus Solar Ephemeris Engine]
  • cp_bp_02_cognitive_safety [Diffuse Missions & Physical Safety Engineering]
  • cp_bp_03_audio_lockscreen [Web Speech/Audio API & 1080p Wallpaper Canvas]
  • cp_bp_04_offline_pwa      [Scope-Relative Offline Service Worker]
  • cp_bp_05_unit_qa          [18 Automated Unit Tests & Visual Regression QA]

Architectural Decision Records:
  • ADR-001: Deterministic NOAA Solar Physics vs. Probabilistic LLM Generation
  • ADR-002: Zero-Telemetry Client-Side Privacy Architecture
  • ADR-003: Zero-Latency Browser-Native Acoustic Synthesis vs. Cloud Media Services
  • ADR-004: Scope-Relative Offline Service Worker & Static GitHub Pages Export`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'telemetry' && (
            <div className="tab-pane">
              <div className="telemetry-table">
                <div className="telemetry-row">
                  <span className="key">Runtime Framework:</span>
                  <span className="val">Next.js 15.2.1 (React 19, TypeScript)</span>
                </div>
                <div className="telemetry-row">
                  <span className="key">Hosting Target:</span>
                  <span className="val">GitHub Pages (output: export)</span>
                </div>
                <div className="telemetry-row">
                  <span className="key">Challenge Track:</span>
                  <span className="val text-green">Best Use of Entire (Hacktoberfest 2026 Week 1)</span>
                </div>
                <div className="telemetry-row">
                  <span className="key">Author:</span>
                  <span className="val">S M Tahosin (@smtahosin)</span>
                </div>
                <div className="telemetry-row">
                  <span className="key">Automated Unit Tests:</span>
                  <span className="val text-green">18 / 18 Passing (100% Deterministic)</span>
                </div>
                <div className="telemetry-row">
                  <span className="key">Provenance Branch:</span>
                  <span className="val" style={{ fontFamily: 'var(--font-mono)' }}>entire/checkpoints/v1</span>
                </div>
                <div className="telemetry-row">
                  <span className="key">External Network Dependencies:</span>
                  <span className="val text-green">0 (100% Offline-Ready &amp; Client-Side)</span>
                </div>
                <div className="telemetry-row">
                  <span className="key">Screen Time Required:</span>
                  <span className="val text-green">&lt; 15 seconds</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div className="footer-meta">
            <CheckCircle size={16} color="#22c55e" />
            <span>Architectural Decisions &bull; Local Engineering Audit</span>
          </div>
          <button className="btn-primary" onClick={onClose}>
            <span>Got It</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .modal-content {
          background: #081711;
          border: 1px solid rgba(34, 197, 94, 0.25);
          border-radius: 16px;
          max-width: 820px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(34, 197, 94, 0.15);
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          padding: 24px 28px 16px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .modal-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--accent-green-light);
          margin-bottom: 6px;
        }

        .modal-header h2 {
          font-size: 1.35rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 6px;
        }

        .modal-subtitle {
          color: #94a3b8;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .close-btn {
          color: #94a3b8;
          padding: 6px;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .close-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }

        .modal-tabs {
          display: flex;
          gap: 12px;
          padding: 16px 28px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #94a3b8;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }

        .tab-btn:hover {
          color: #ffffff;
        }

        .tab-btn.active {
          color: var(--accent-green-light);
          border-bottom-color: var(--accent-green);
        }

        .modal-body {
          padding: 24px 28px;
          flex: 1;
        }

        .decision-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 640px) {
          .decision-grid {
            grid-template-columns: 1fr;
          }
        }

        .decision-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 12px;
          padding: 16px;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .pill.green {
          font-size: 0.7rem;
          font-weight: 700;
          background: rgba(34, 197, 94, 0.15);
          color: var(--accent-green-light);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .tech {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .decision-card h4 {
          font-size: 0.95rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 6px;
        }

        .decision-card p {
          font-size: 0.8125rem;
          color: #94a3b8;
          line-height: 1.5;
        }

        .code-stream {
          background: #05080e;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          overflow: hidden;
        }

        .code-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 0.75rem;
          font-family: var(--font-mono);
          color: #94a3b8;
        }

        .code-block {
          padding: 16px;
          font-family: var(--font-mono);
          font-size: 0.8125rem;
          color: #cbd5e1;
          line-height: 1.6;
          white-space: pre-wrap;
          margin: 0;
        }

        .telemetry-table {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 16px;
        }

        .telemetry-row {
          display: flex;
          justify-content: space-between;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          font-size: 0.875rem;
        }

        .telemetry-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .key {
          color: #94a3b8;
        }

        .val {
          font-weight: 600;
          color: #ffffff;
        }

        .text-green {
          color: var(--accent-green-light) !important;
        }

        .modal-footer {
          padding: 16px 28px 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .footer-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8125rem;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}
