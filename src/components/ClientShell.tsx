'use client';

import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import EntireSessionModal from './EntireSessionModal';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [isEntireModalOpen, setIsEntireModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
      const swUrl = `${basePath}/sw.js`;
      navigator.serviceWorker
        .register(swUrl, { scope: `${basePath}/` })
        .catch(() => {});
    }
  }, []);

  return (
    <div className="site-wrapper">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <Footer onOpenEntireModal={() => setIsEntireModalOpen(true)} />
      <EntireSessionModal
        isOpen={isEntireModalOpen}
        onClose={() => setIsEntireModalOpen(false)}
      />

      <style jsx>{`
        .site-wrapper {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .main-content {
          flex: 1;
        }
      `}</style>
    </div>
  );
}
