import React, { useEffect, useRef } from 'react';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const Modal: React.FC<ModalProps> = ({ onClose, children, title }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true">
      <div
        ref={ref}
        className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-full w-[95vw] md:w-auto max-h-[90vh] overflow-y-auto scrollbar-none focus:outline-none"
        tabIndex={-1}
        aria-label={title || 'Modal'}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Sticky header/title/close */}
        <div className="sticky top-0 z-10 bg-white/90 dark:bg-gray-900/90 rounded-t-2xl flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          {title && <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold focus:outline-none ml-auto"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className="px-6 pb-6 pt-2">{children}</div>
      </div>
      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}; 