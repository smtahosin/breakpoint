'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Menu, X, ArrowRight } from 'lucide-react';
import GithubIcon from './GithubIcon';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Start', href: '/start' },
    { label: 'Field Card', href: '/field-card' },
    { label: 'Science', href: '/science' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="global-header">
      <div className="page-container header-inner">
        {/* Brand Logo */}
        <Link href="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="logo-sun-icon">
            <Sun className="sun-svg" size={24} />
          </div>
          <span className="brand-text">
            Break<span className="brand-accent">Point</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${active ? 'active' : ''}`}
              >
                {link.label}
                {active && <span className="active-indicator" />}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA & Social */}
        <div className="header-actions">
          <a
            href="https://github.com/smtahosin/breakpoint"
            target="_blank"
            rel="noopener noreferrer"
            className="github-btn"
            title="View on GitHub (@smtahosin)"
            aria-label="GitHub Repository"
          >
            <GithubIcon size={20} />
          </a>

          <Link href="/start" className="btn-get-started">
            <span>Get Started</span>
            <ArrowRight size={16} />
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <div className="mobile-nav-links">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`mobile-link ${active ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mobile-drawer-footer">
              <a
                href="https://github.com/smtahosin/breakpoint"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-github-link"
              >
                <GithubIcon size={18} />
                <span>smtahosin/breakpoint</span>
              </a>
              <Link
                href="/start"
                className="btn-primary w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Get Started</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}

    </header>
  );
}
