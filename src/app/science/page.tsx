'use client';

import React, { useState } from 'react';
import {
  Brain,
  Code2,
  Footprints,
  Lightbulb,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { assetPath } from '../../lib/asset-path';

export default function SciencePage() {
  const [activeSide, setActiveSide] = useState<'both' | 'focused' | 'diffuse'>('both');

  return (
    <div className="science-page-wrapper">
      <div className="page-container science-grid">
        {/* Left Column Content */}
        <div className="science-content">
          {/* Pill Badge */}
          <div className="pill-badge">
            <span>The Science Behind It</span>
          </div>

          {/* Heading */}
          <h1 className="science-title">
            From Focused<br />
            to <span className="text-green">Diffuse Mode</span>
          </h1>

          {/* Subtitle */}
          <p className="science-subtitle">
            Stepping outside helps your brain make better connections and unlock creative solutions.
          </p>

          {/* Dual-Brain Cognitive Comparison Card */}
          <div className="brain-dual-card">
            {/* Left: Focused Mode Column */}
            <div
              className={`mode-column left ${activeSide === 'focused' ? 'highlight' : ''}`}
              onClick={() => setActiveSide(activeSide === 'focused' ? 'both' : 'focused')}
            >
              <h3 className="mode-heading">Focused Mode</h3>
              <ul className="mode-bullets">
                <li>Analytical thinking</li>
                <li>Deep work</li>
                <li>Solving problems</li>
              </ul>
              <div className="mode-subnote">Tight prefrontal cortex loops</div>
            </div>

            {/* Center: Dual Brain Neural Graphic */}
            <div className="brain-center-graphic">
              <div className="brain-visual-container">
                {/* SVG Brain Representation with Left Analytical & Right Diffuse Neon Glow */}
                <svg
                  viewBox="0 0 200 160"
                  className="brain-svg"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <radialGradient id="diffuseGlow" cx="70%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                      <stop offset="60%" stopColor="#15803d" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#052e16" stopOpacity="0" />
                    </radialGradient>
                    <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Diffuse mode background aura */}
                  <ellipse cx="130" cy="80" rx="50" ry="45" fill="url(#diffuseGlow)" />

                  {/* Left Hemisphere (Focused / Analytical Grayscale Wireframe) */}
                  <path
                    d="M 96 25 C 75 24 50 35 40 55 C 32 70 34 95 42 110 C 50 125 70 135 96 135 Z"
                    stroke="#64748b"
                    strokeWidth="2.5"
                    fill="rgba(100, 116, 139, 0.08)"
                  />
                  {/* Left internal grid / analytical circuits */}
                  <path d="M 55 55 Q 75 60 96 55" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
                  <path d="M 45 80 Q 70 85 96 80" stroke="#475569" strokeWidth="1.5" />
                  <path d="M 52 105 Q 75 100 96 110" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
                  <circle cx="65" cy="78" r="3" fill="#94a3b8" />
                  <circle cx="80" cy="62" r="2.5" fill="#94a3b8" />
                  <circle cx="75" cy="102" r="3" fill="#94a3b8" />

                  {/* Center Dividing Fissure */}
                  <line x1="99" y1="20" x2="99" y2="140" stroke="#334155" strokeWidth="2" strokeDasharray="4 2" />

                  {/* Right Hemisphere (Diffuse / Creative Neon Green Glow) */}
                  <path
                    d="M 104 25 C 125 24 150 35 160 55 C 168 70 166 95 158 110 C 150 125 130 135 104 135 Z"
                    stroke="#22c55e"
                    strokeWidth="2.5"
                    fill="rgba(34, 197, 94, 0.15)"
                    filter="url(#glowFilter)"
                  />
                  {/* Right glowing synapses and branching connections */}
                  <path d="M 104 55 Q 125 45 145 60" stroke="#4ade80" strokeWidth="2" />
                  <path d="M 104 80 Q 130 70 155 85" stroke="#22c55e" strokeWidth="2.2" />
                  <path d="M 104 110 Q 125 120 148 102" stroke="#4ade80" strokeWidth="2" />
                  <circle cx="135" cy="52" r="3.5" fill="#4ade80" filter="url(#glowFilter)" />
                  <circle cx="145" cy="85" r="4" fill="#22c55e" filter="url(#glowFilter)" />
                  <circle cx="125" cy="115" r="3.5" fill="#4ade80" filter="url(#glowFilter)" />
                  <circle cx="120" cy="70" r="2.5" fill="#86efac" />
                </svg>
              </div>
            </div>

            {/* Right: Diffuse Mode Column */}
            <div
              className={`mode-column right ${activeSide === 'diffuse' ? 'highlight' : ''}`}
              onClick={() => setActiveSide(activeSide === 'diffuse' ? 'both' : 'diffuse')}
            >
              <h3 className="mode-heading green">Diffuse Mode</h3>
              <ul className="mode-bullets green">
                <li>Creative thinking</li>
                <li>New connections</li>
                <li>Breakthrough ideas</li>
              </ul>
              <div className="mode-subnote green">Broad associative neural rest</div>
            </div>
          </div>

          {/* Bottom 3-Step Process Flow (Exact match to reference panel 4) */}
          <div className="process-flow-row">
            {/* Step 1 */}
            <div className="flow-step">
              <div className="flow-icon-circle">
                <Code2 size={18} />
              </div>
              <span className="flow-label">Stuck on a problem</span>
            </div>

            <div className="flow-arrow">
              <ArrowRight size={18} />
            </div>

            {/* Step 2 */}
            <div className="flow-step">
              <div className="flow-icon-circle active">
                <Footprints size={18} />
              </div>
              <span className="flow-label">Take a 20-min walk</span>
            </div>

            <div className="flow-arrow">
              <ArrowRight size={18} />
            </div>

            {/* Step 3 */}
            <div className="flow-step">
              <div className="flow-icon-circle glow">
                <Lightbulb size={18} />
              </div>
              <span className="flow-label">Fresh perspective</span>
            </div>
          </div>
        </div>

        {/* Right Mountain Summit Photographic Visual */}
        <div className="science-visual-col">
          <div className="mountain-image-wrapper">
            <img
              src={assetPath('/images/mountain-summit-diffuse.jpg')}
              alt="Developer resting on mountain summit rock looking at clouds"
              className="mountain-image"
            />
            <div className="mountain-gradient-overlay" />

            {/* Cursive Signature Callout */}
            <div className="callout-wrapper">
              <div className="cursive-callout-text">
                A Clearer Mind<br />
                Builds a Better You.
                <div className="cursive-underline" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .science-page-wrapper {
          position: relative;
          min-height: calc(100vh - 72px);
          display: flex;
          align-items: center;
          padding: 24px 0 36px;
        }

        .science-grid {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 48px;
          align-items: center;
          width: 100%;
        }

        /* Left Column */
        .science-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          max-width: 580px;
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

        .science-title {
          font-size: clamp(2.6rem, 4.2vw, 3.8rem);
          font-weight: 900;
          letter-spacing: -1.5px;
          line-height: 1.1;
          color: #ffffff;
          margin-bottom: 12px;
        }

        .text-green {
          color: var(--accent-green);
        }

        .science-subtitle {
          font-size: 1.05rem;
          color: #94a3b8;
          line-height: 1.45;
          margin-bottom: 20px;
        }

        /* Brain Dual Card */
        .brain-dual-card {
          width: 100%;
          background: rgba(13, 20, 31, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 18px;
          display: grid;
          grid-template-columns: 1fr 1.2fr 1fr;
          gap: 12px;
          align-items: center;
          margin-bottom: 24px;
          box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.6);
        }

        .mode-column {
          display: flex;
          flex-direction: column;
          gap: 6px;
          cursor: pointer;
          padding: 8px;
          border-radius: 10px;
          transition: background-color 0.2s;
        }

        .mode-column:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        .mode-heading {
          font-size: 0.95rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 4px;
        }

        .mode-heading.green {
          color: var(--accent-green);
        }

        .mode-bullets {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .mode-bullets li {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .mode-bullets.green li {
          color: #86efac;
        }

        .mode-subnote {
          font-size: 0.65rem;
          color: #64748b;
          margin-top: 4px;
        }

        .mode-subnote.green {
          color: #4ade80;
        }

        .brain-center-graphic {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brain-visual-container {
          width: 100%;
          max-width: 190px;
        }

        .brain-svg {
          width: 100%;
          height: auto;
          display: block;
        }

        /* Process Flow Row */
        .process-flow-row {
          display: flex;
          align-items: center;
          gap: 16px;
          width: 100%;
          padding-top: 10px;
        }

        .flow-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-align: center;
          flex: 1;
        }

        .flow-icon-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          transition: all 0.3s ease;
        }

        .flow-icon-circle.active {
          background: rgba(34, 197, 94, 0.15);
          border-color: rgba(34, 197, 94, 0.4);
          color: var(--accent-green-light);
        }

        .flow-icon-circle.glow {
          background: rgba(245, 158, 11, 0.15);
          border-color: rgba(245, 158, 11, 0.4);
          color: #facc15;
          box-shadow: 0 0 15px rgba(245, 158, 11, 0.3);
        }

        .flow-label {
          font-size: 0.75rem;
          color: #cbd5e1;
          font-weight: 500;
        }

        .flow-arrow {
          color: #475569;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 22px;
        }

        /* Right Visual Column */
        .science-visual-col {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mountain-image-wrapper {
          position: relative;
          width: 100%;
          max-width: 580px;
          aspect-ratio: 4 / 3.4;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.1);
        }

        .mountain-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .mountain-gradient-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(7, 10, 15, 0.1) 0%,
            rgba(7, 10, 15, 0.25) 60%,
            rgba(7, 10, 15, 0.8) 100%
          );
        }

        /* Callout */
        .callout-wrapper {
          position: absolute;
          bottom: 24px;
          right: 28px;
          z-index: 5;
        }

        .cursive-callout-text {
          font-family: var(--font-script);
          font-size: 2.2rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.15;
          text-shadow: 0 3px 12px rgba(0, 0, 0, 0.9);
          transform: rotate(-3deg);
          text-align: right;
        }

        .cursive-underline {
          width: 100%;
          height: 4px;
          background: var(--accent-green);
          border-radius: 2px;
          margin-top: 4px;
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.6);
        }

        @media (max-width: 992px) {
          .science-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .science-visual-col {
            order: -1;
            max-width: 600px;
            margin: 0 auto;
          }

          .science-content {
            max-width: 100%;
          }
        }

        @media (max-width: 600px) {
          .brain-dual-card {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .brain-center-graphic {
            margin: 12px 0;
          }
        }
      `}</style>
    </div>
  );
}
