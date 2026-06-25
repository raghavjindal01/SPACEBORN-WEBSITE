'use client';

import { useState } from 'react';
import Link from 'next/link';
import CeoContactModal from './CeoContactModal';

type FooterProps = {
  isHome?: boolean;
};

export default function Footer({ isHome = false }: FooterProps) {
  const [isCeoModalOpen, setIsCeoModalOpen] = useState(false);

  const footerContent = (
    <>
      <div className="footer-social-group">
        <a 
          href="https://www.linkedin.com/company/spaceborn-future/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="linkedin-link" 
          aria-label="Spaceborn LinkedIn"
        >
          <img src="/assets/linkedin-icon.png" alt="LinkedIn Logo" />
        </a>
        <button 
          onClick={() => setIsCeoModalOpen(true)} 
          className="ceo-contact-btn font-mono"
          type="button"
        >
          CONTACT OUR CEO
        </button>
      </div>

      <ul className="footer-nav">
        <li><Link href="/career">CAREERS</Link></li>
        {isHome ? (
          <li><a href="#releases">UPDATES</a></li>
        ) : (
          <li><Link href="/#releases">UPDATES</Link></li>
        )}
        <li><a href="#">PRIVACY POLICY</a></li>
        <li><Link href="/partners">PARTNERS</Link></li>
      </ul>

      <span className="footer-copyright">
        COPYRIGHT © 2026 SPACEBORN
      </span>

      {isCeoModalOpen && (
        <CeoContactModal onClose={() => setIsCeoModalOpen(false)} />
      )}
    </>
  );

  if (isHome) {
    return (
      <footer className="footer-fixed">
        {footerContent}
      </footer>
    );
  }

  return (
    <footer className="simulators-scroll-section footer-wrapper-responsive">
      <div className="footer-fixed" style={{ borderTop: 'none' }}>
        {footerContent}
      </div>
    </footer>
  );
}
