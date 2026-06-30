"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';

export default function MobileMenu({ isCareer }: { isCareer?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const overlayContent = (
    <div className="mobile-menu-overlay">
      <div className="mobile-menu-header">
        <Link href="/" className="logo" onClick={toggleMenu}>
          <img src="https://res.cloudinary.com/dq9x4mk1y/image/upload/v1782734333/spaceborn_assets/spaceborn-transparent-logo.png" alt="Spaceborn" />
        </Link>
        <button className="close-menu" onClick={toggleMenu} aria-label="Close menu">✕</button>
      </div>
          <ul className="mobile-nav-links">
            {isCareer ? (
              <>
                <li><Link href="/" onClick={toggleMenu}>HOME</Link></li>
                <li><Link href="/#simulation" onClick={toggleMenu}>SIMULATION</Link></li>
                <li><Link href="/#platforms" onClick={toggleMenu}>PLATFORMS</Link></li>
                <li><Link href="/career" onClick={toggleMenu}>CAREER</Link></li>
              </>
            ) : (
              <>
                <li><Link href="/#releases" onClick={toggleMenu}>upcoming releases</Link></li>
                <li><Link href="/#platforms" onClick={toggleMenu}>platforms</Link></li>
                <li><Link href="/#simulation" onClick={toggleMenu}>simulation</Link></li>
                <li><Link href="/#systems" onClick={toggleMenu}>systems</Link></li>
                <li><Link href="/#thoth" onClick={toggleMenu}>thoth</Link></li>
                <li><a href="https://khonsu.in" target="_blank" rel="noopener noreferrer" onClick={toggleMenu}>khonsu</a></li>
                <li><Link href="/#simulators-hub" onClick={toggleMenu}>company</Link></li>
              </>
            )}
          </ul>
    </div>
  );

  return (
    <>
      <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
        <span className="hamburger-line" />
        <span className="hamburger-line" />
        <span className="hamburger-line" />
      </button>
      {isOpen && mounted && createPortal(overlayContent, document.body)}
    </>
  );
}
