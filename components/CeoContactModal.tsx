'use client';

import { useState, useEffect, useRef } from 'react';

type CeoContactModalProps = {
  onClose: () => void;
};

export default function CeoContactModal({ onClose }: CeoContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Click outside to close handler
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!message.trim()) {
      setError('Please write a message.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('message', message);

      const response = await fetch('/api/ceo-contact', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSuccess(true);
      } else {
        setError(result.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Ceo submit error:', err);
      setError('An error occurred. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container" ref={modalRef}>
        <button 
          className="modal-close-btn" 
          onClick={onClose} 
          aria-label="Close modal"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="modal-body">
          {!isSuccess ? (
            <>
              <h2 className="modal-title font-ethno">Message to CEO</h2>
              <p className="modal-subtitle font-mono">Send your feedback, partnership proposals, or inquiries directly to the executive office.</p>

              {error && (
                <div className="form-error-banner">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="ceoName" className="form-label">Full Name *</label>
                  <input
                    type="text"
                    id="ceoName"
                    className="form-input"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ceoEmail" className="form-label">Email Address *</label>
                  <input
                    type="email"
                    id="ceoEmail"
                    className="form-input"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '30px' }}>
                  <label htmlFor="ceoMessage" className="form-label">Message *</label>
                  <textarea
                    id="ceoMessage"
                    className="form-input form-textarea"
                    placeholder="Write your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn font-mono btn-primary" 
                  style={{ width: '100%', height: '48px' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'ROUTING MESSAGE...' : 'SEND TO CEO'}
                </button>
              </form>
            </>
          ) : (
            <div className="success-state">
              <div className="success-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h2 className="success-title font-ethno">Message Dispatched</h2>
              <p className="success-message font-mono">
                Your message has been securely transmitted and routed to the CEO's desk. We appreciate your communication.
              </p>
              <button 
                type="button" 
                className="btn font-mono btn-primary" 
                style={{ minWidth: '160px' }}
                onClick={onClose}
              >
                CLOSE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
