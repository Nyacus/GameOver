
import React, { useState } from 'react';

interface GroupSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (size: number) => void;
}

const GroupSizeModal: React.FC<GroupSizeModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(inputValue, 10);
    
    if (isNaN(num) || num <= 0) {
      setError('Por favor, introduce un número válido de personas.');
      return;
    }

    onConfirm(num);
    setInputValue('');
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Show erótico</h3>
        <p className="text-sm text-gray-600 mb-4">
          El precio de esta actividad es de 200€ por grupo. Introduce el número de personas para calcular el precio individual.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="groupSize" className="block text-sm font-medium text-gray-700 mb-1">
              Número de personas
            </label>
            <input
              type="number"
              id="groupSize"
              min="1"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0077F2]"
              placeholder="Ej: 10"
              value={inputValue}
              onChange={(e) => {
                  setInputValue(e.target.value);
                  setError('');
              }}
              autoFocus
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0077F2] text-white rounded-md font-bold hover:bg-blue-600"
            >
              Calcular y Añadir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupSizeModal;
