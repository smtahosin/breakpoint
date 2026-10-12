'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Code2, Activity, CreditCard, Leaf, X, CheckCircle, ExternalLink } from 'lucide-react';
import { assetPath } from '../lib/asset-path';

export default function HomePage() {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  return (
    <div className="home-hero-section">
      <div className="page-container hero-container">
        {/* Left Column Content */}
        <div className="hero-content">
          {/* Pill Badge */}
          <div className="pill-badge">
            <span>The Developer&apos;s Reset</span>
          </div>

          {/* Main Title */}
          <h1 className="hero-title">
            Break<span className="text-green">Point</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            Step outside. Clear your mind.<br />
            Find better solutions.
          </p>

          {/* Feature Chips */}
          <div className="feature-chips-row">
            <div className="feature-chip">
              <Code2 size={16} className="chip-icon" />
              <span>Real Solar Data</span>
            </div>
            <div className="feature-chip">
              <Activity size={16} className="chip-icon" />
              <span>AI Audio Brief</span>
            </div>
            <div className="feature-chip">
              <CreditCard size={16} className="chip-icon" />
              <span>Pocket Card</span>
            </div>
            <div className="feature-chip">
              <Leaf size={16} className="chip-icon" />
              <span>20-Min Walk</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="cta-row">
            <Link href="/start" className="btn-primary">
              <span>Start Your Break</span>
              <ArrowRight size={18} />
            </Link>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowHowItWorks(true)}
            >
              <Play size={16} className="play-icon" />
              <span>See How It Works</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-number">20</div>
              <div className="stat-label">Minutes Outside</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-number">10&times;</div>
              <div className="stat-label">Brighter Natural Light</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-number heading">A Clearer Mind</div>
              <div className="stat-label">For Better Code</div>
            </div>
          </div>
        </div>

        {/* Right Photographic Visual & Cursive Callout */}
        <div className="hero-visual-col">
          <div className="hero-image-wrapper">
            <img
              src={assetPath('/images/hero-city-sunset.jpg')}
              alt="Developer with backpack taking a break outdoors facing city sunset"
              className="hero-image"
            />
            <div className="hero-gradient-overlay" />

            {/* Cursive Signature Callout */}
            <div className="callout-wrapper">
              <div className="cursive-callout-text">
                Better Code<br />
                Starts Outside
                <div className="cursive-underline" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "See How It Works" Walkthrough Modal */}
      {showHowItWorks && (
        <div className="video-modal-overlay" onClick={() => setShowHowItWorks(false)}>
          <div className="video-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="video-modal-header">
              <h3>How BreakPoint Resets Your Engineering Mind</h3>
              <button
                type="button"
                className="close-button"
                onClick={() => setShowHowItWorks(false)}
                aria-label="Close walkthrough"
              >
                <X size={20} />
              </button>
            </div>
            <div className="video-modal-body">
              <div className="workflow-steps">
                <div className="workflow-step">
                  <div className="step-badge">1</div>
                  <div className="step-info">
                    <h4>Detect Local Sun &amp; Retinal Lux</h4>
                    <p>Calculates solar elevation and daylight intensity to give your eyes the optical horizon distance needed to release screen tension.</p>
                  </div>
                </div>
                <div className="workflow-step">
                  <div className="step-badge">2</div>
                  <div className="step-info">
                    <h4>Generate 20-Second Audio Briefing</h4>
                    <p>A concise acoustic instruction plays into your earbuds telling you your walking azimuth heading and return deadline.</p>
                  </div>
                </div>
                <div className="workflow-step">
                  <div className="step-badge">3</div>
                  <div className="step-info">
                    <h4>Take the Pocket Field Card</h4>
                    <p>Download the high-contrast 3&times;5 lockscreen card, close your laptop, and walk for 20 minutes in natural daylight.</p>
                  </div>
                </div>
                <div className="workflow-step">
                  <div className="step-badge">4</div>
                  <div className="step-info">
                    <h4>Diffuse Mode Breakthrough</h4>
                    <p>While looking at the open horizon, your brain unlocks creative neural connections, dissolving the bug before you return.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="video-modal-footer">
              <Link
                href="/start"
                className="btn-primary"
                onClick={() => setShowHowItWorks(false)}
              >
                <span>Launch Your 20-Min Reset Now</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .home-hero-section {
          position: relative;
          min-height: calc(100vh - 72px);
          display: flex;
          align-items: center;
          padding: 24px 0 36px;
          overflow: hidden;
        }

        .hero-container {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 48px;
          align-items: center;
          width: 100%;
        }

        /* Left Column */
        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          z-index: 2;
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
          margin-bottom: 18px;
          backdrop-filter: blur(8px);
        }

        .hero-title {
          font-size: clamp(3rem, 5vw, 4.4rem);
          font-weight: 900;
          letter-spacing: -2px;
          line-height: 1.05;
          color: #ffffff;
          margin-bottom: 14px;
        }

        .text-green {
          color: var(--accent-green);
        }

        .hero-subtitle {
          font-size: 1.15rem;
          font-weight: 400;
          line-height: 1.45;
          color: #94a3b8;
          margin-bottom: 24px;
        }

        /* Feature Chips */
        .feature-chips-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 26px;
        }

        .feature-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: rgba(13, 20, 31, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          font-size: 0.8125rem;
          font-weight: 500;
          color: #cbd5e1;
          backdrop-filter: blur(6px);
        }

        .chip-icon {
          color: var(--accent-green);
        }

        /* CTA Row */
        .cta-row {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }

        .play-icon {
          fill: currentColor;
          color: #ffffff;
        }

        /* Stats Row */
        .stats-row {
          display: flex;
          align-items: center;
          gap: 32px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          width: 100%;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-number {
          font-size: 1.85rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
          letter-spacing: -0.5px;
        }

        .stat-number.heading {
          font-size: 1.35rem;
          font-weight: 700;
        }

        .stat-label {
          font-size: 0.8125rem;
          color: #94a3b8;
          font-weight: 500;
        }

        .stat-divider {
          width: 1px;
          height: 38px;
          background: rgba(255, 255, 255, 0.1);
        }

        /* Right Hero Visual */
        .hero-visual-col {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-image-wrapper {
          position: relative;
          width: 100%;
          max-width: 580px;
          aspect-ratio: 4 / 3.4;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.1);
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transform: scale(1.02);
          transition: transform 0.8s ease;
        }

        .hero-image-wrapper:hover .hero-image {
          transform: scale(1.05);
        }

        .hero-gradient-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(7, 10, 15, 0.1) 0%,
            rgba(7, 10, 15, 0.2) 60%,
            rgba(7, 10, 15, 0.75) 100%
          );
          pointer-events: none;
        }

        /* Cursive Callout */
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

        /* Modal */
        .video-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .video-modal-card {
          background: #090e17;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          max-width: 620px;
          width: 100%;
          padding: 28px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9);
        }

        .video-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .video-modal-header h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
        }

        .close-button {
          color: #94a3b8;
          padding: 4px;
        }

        .close-button:hover {
          color: #ffffff;
        }

        .workflow-steps {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .workflow-step {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 10px;
        }

        .step-badge {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(34, 197, 94, 0.2);
          color: var(--accent-green-light);
          font-weight: 700;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .step-info h4 {
          font-size: 0.95rem;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 4px;
        }

        .step-info p {
          font-size: 0.8125rem;
          color: #94a3b8;
          line-height: 1.45;
        }

        .video-modal-footer {
          display: flex;
          justify-content: flex-end;
        }

        /* Responsive */
        @media (max-width: 992px) {
          .hero-container {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .hero-visual-col {
            order: -1;
            max-width: 600px;
            margin: 0 auto;
          }

          .hero-content {
            align-items: center;
            text-align: center;
          }

          .feature-chips-row {
            justify-content: center;
          }

          .cta-row {
            justify-content: center;
          }

          .stats-row {
            justify-content: center;
          }
        }

        @media (max-width: 640px) {
          .stats-row {
            flex-direction: column;
            gap: 16px;
          }

          .stat-divider {
            display: none;
          }

          .stat-item {
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}
