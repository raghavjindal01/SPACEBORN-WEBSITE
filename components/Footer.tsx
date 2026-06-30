'use client';

import Link from 'next/link';

type FooterProps = {
  isHome?: boolean;
};

export default function Footer({ isHome = false }: FooterProps) {
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
          <img src="https://res.cloudinary.com/dq9x4mk1y/image/upload/v1782734290/spaceborn_assets/linkedin-icon.png" alt="LinkedIn Logo" />
        </a>
        <a 
          href="mailto:adarshkumar@spaceborn.in" 
          className="ceo-contact-btn font-mono"
          style={{ textDecoration: 'none', display: 'inline-block' }}
        >
          CONTACT OUR CEO
        </a>
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
