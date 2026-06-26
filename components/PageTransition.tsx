'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 450); // Matches the css transition timing
    return () => clearTimeout(timer);
  }, [pathname]);



  return (
    <div className={`page-transition-container ${isTransitioning ? 'page-is-transitioning' : ''}`}>
      {children}
    </div>
  );
}
