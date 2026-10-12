'use client';

import React from 'react';
import Link from 'next/link';
import { Sun, FileText, Sparkles, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenEntireModal?: () => void;
}

export default function Footer({ onOpenEntireModal }: FooterProps) {
  return (
    <footer className="global-footer">
      <div className="page-container footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <Sun className="text-amber-500" size={20} color="#f59e0b" />
              <span>
                Break<span style={{ color: '#22c55e' }}>Point</span>
              </span>
            </Link>
            <p className="footer-tagline">
              The Developer&apos;s 20-Minute Cognitive Reset &amp; Sunlight Dispatcher.
              Built for Hacktoberfest 2026 Week 1 (&ldquo;Touch Grass&rdquo;).
            </p>
          </div>

          <div className="footer-links-group">
            <div className="footer-col">
              <span className="col-title">Navigation</span>
              <Link href="/">Home</Link>
              <Link href="/start">Start Reset</Link>
              <Link href="/field-card">Pocket Field Card</Link>
              <Link href="/science">Diffuse Mode Science</Link>
            </div>

            <div className="footer-col">
              <span className="col-title">Contest &amp; Architecture</span>
              <button
                type="button"
                className="entire-btn-link"
                onClick={onOpenEntireModal}
              >
                <Sparkles size={14} color="#22c55e" />
                <span>Entire Session Audit</span>
              </button>
              <a
                href="https://github.com/smtahosin/breakpoint"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>GitHub Repository</span>
                <ExternalLink size={12} />
              </a>
              <a
                href="https://dev.to/smtahosin"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>DEV Profile (@smtahosin)</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">
            &copy; 2026 BreakPoint. Created by S M Tahosin (<a href="https://github.com/smtahosin" target="_blank" rel="noopener noreferrer">@smtahosin</a>). Open source MIT License.
          </div>
          <div className="footer-badges">
            <span className="category-pill">
              Best Use of Entire &bull; Hacktoberfest 2026
            </span>
            <span className="offline-pill">
              100% Offline Ready
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .global-footer {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background: #04070c;
          padding: 60px 0 36px;
          margin-top: 80px;
        }

        .footer-inner {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .footer-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 40px;
          flex-wrap: wrap;
        }

        .footer-brand {
          max-width: 420px;
        }

        .footer-logo {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 1.25rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 12px;
        }

        .footer-tagline {
          color: #94a3b8;
          font-size: 0.875rem;
          line-height: 1.6;
        }

        .footer-links-group {
          display: flex;
          gap: 60px;
          flex-wrap: wrap;
        }

        .footer-col {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .col-title {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #64748b;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .footer-col :global(a),
        .footer-col :global(button) {
          color: #94a3b8;
          font-size: 0.875rem;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s;
          text-align: left;
        }

        .footer-col :global(a:hover),
        .footer-col :global(button:hover) {
          color: #ffffff;
        }

        .entire-btn-link {
          color: var(--accent-green) !important;
          font-weight: 600;
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 0.8125rem;
          color: #64748b;
          flex-wrap: wrap;
          gap: 16px;
        }

        .footer-copy a {
          color: #94a3b8;
          text-decoration: underline;
        }

        .footer-badges {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .category-pill {
          padding: 4px 10px;
          border-radius: 9999px;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.25);
          color: var(--accent-green-light);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .offline-pill {
          padding: 4px 10px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          font-size: 0.75rem;
        }
      `}</style>
    </footer>
  );
}
