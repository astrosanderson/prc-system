'use client';

import { useEffect, useRef } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'default' | 'wide' | 'print';
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  variant = 'default',
}: ModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  /* Keyboard + scroll-lock */
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  /* Backdrop click */
  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === backdropRef.current) onClose();
  }

  const modalClass = [
    'kpp-modal',
    variant === 'wide'  ? 'kpp-modal--wide'  : '',
    variant === 'print' ? 'kpp-modal--print' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={`kpp-modal-backdrop${isOpen ? ' is-open' : ''}`}
      ref={backdropRef}
      onClick={handleBackdropClick}
      id={variant === 'print' ? 'modal-print' : undefined}
    >
      <div className={modalClass} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="kpp-modal-header">
          <h2 className="kpp-modal-title" id="modal-title">
            {title}
          </h2>
          <button className="kpp-modal-close" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>

        <div className="kpp-modal-body">{children}</div>

        {footer && <div className="kpp-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
