'use client';

import { X } from 'lucide-react';
import { ReactNode, useEffect } from 'react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export default function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const widths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-soot/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`bg-plaster-surface rounded-3xl border border-soot/12 shadow-2xl w-full ${widths[size]} max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200`}
        onClick={e => e.stopPropagation()}
      >
        {title ? (
          <div className="flex items-center justify-between px-6 py-4 border-b border-soot/10 sticky top-0 bg-plaster-surface/95 backdrop-blur-sm z-10">
            <h3 className="text-xl font-normal text-soot tracking-tight font-serif-display">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-soot/8 transition-colors text-moss hover:text-soot focus:outline-none focus:ring-2 focus:ring-soot/20"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-soot/8 transition-colors text-moss hover:text-soot focus:outline-none focus:ring-2 focus:ring-soot/20"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
