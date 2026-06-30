'use client';
import { forwardRef, ReactNode, useRef, useEffect, useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface LazyVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  children: ReactNode;
}

export const LazyVideo = forwardRef<HTMLVideoElement, LazyVideoProps>(
  ({ children, ...props }, forwardedRef) => {
    const internalRef = useRef<HTMLVideoElement>(null);
    const [hasIntersected, setHasIntersected] = useState(false);

    // Track intersection
    const entry = useIntersectionObserver(internalRef, {
      freezeOnceVisible: true,
      rootMargin: '200px', // start loading before it completely enters the viewport
    });

    useEffect(() => {
      if (entry?.isIntersecting) {
        setHasIntersected(true);
      }
    }, [entry?.isIntersecting]);

    // Handle ref forwarding
    useEffect(() => {
      if (typeof forwardedRef === 'function') {
        forwardedRef(internalRef.current);
      } else if (forwardedRef) {
        forwardedRef.current = internalRef.current;
      }
    }, [forwardedRef, internalRef]);

    return (
      <video ref={internalRef} {...props}>
        {hasIntersected ? children : null}
      </video>
    );
  }
);

LazyVideo.displayName = 'LazyVideo';
