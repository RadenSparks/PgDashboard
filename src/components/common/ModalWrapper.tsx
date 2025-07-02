import React from 'react';

export const ModalWrapper: React.FC<{
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}> = ({ title, onClose, children, maxWidth = "max-w-2xl" }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className={`bg-white rounded-xl shadow-lg w-full ${maxWidth} p-0 relative flex flex-col`} style={{ maxHeight: '90vh', minHeight: 0 }}>
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h3 className="text-xl font-bold text-blue-700">{title}</h3>
        <button
          className="text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6">{children}</div>
    </div>
  </div>
);