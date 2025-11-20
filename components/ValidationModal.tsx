
import React from 'react';

interface ValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const ValidationModal: React.FC<ValidationModalProps> = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">¡Atención!</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="bg-[#0077F2] text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};

export default ValidationModal;
