import React from 'react';

export const ModalWrapper: React.FC<{
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}> = ({ title, onClose, children, maxWidth = "max-w-3xl" }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm animate-fade-in"
    aria-modal="true"
    role="dialog"
    tabIndex={-1}
  >
    <div
      className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth} p-0 relative flex flex-col animate-scale-in`}
      style={{
        maxHeight: '92vh',
        minHeight: '0',
        border: '1.5px solid #e5e7eb',
        transition: 'box-shadow 0.2s',
      }}
    >
      <div className="flex items-center justify-between px-8 py-6 border-b bg-gradient-to-r from-blue-50 to-white sticky top-0 z-10 rounded-t-2xl">
        <h3 className="text-2xl font-extrabold text-blue-700 tracking-tight">{title}</h3>
        <button
          className="text-gray-400 hover:text-blue-700 text-3xl font-bold transition-colors rounded-full w-10 h-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={onClose}
          aria-label="Close modal"
          tabIndex={0}
        >
          &times;
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-8 bg-white rounded-b-2xl">
        {children}
      </div>
    </div>
    <style>
      {`
        .animate-fade-in {
          animation: fadeIn 0.25s ease;
        }
        .animate-scale-in {
          animation: scaleIn 0.22s cubic-bezier(.4,2,.3,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.96); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}
    </style>
  </div>
);