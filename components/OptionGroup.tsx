
import React from 'react';
import type { Option } from '../types';

interface OptionGroupProps {
  icon: React.ReactNode;
  title: string;
  options: Option[];
  selectedValues: string[];
  onSelect: (option: Option) => void;
}

const OptionButton: React.FC<{
  option: Option;
  isSelected: boolean;
  onClick: (option: Option) => void;
}> = ({ option, isSelected, onClick }) => {
  // Updated classes: added text-center to ensure text alignment
  const baseClasses = "w-full h-full min-h-[3.5rem] flex flex-col items-center justify-center text-center p-2 rounded-lg border text-sm transition-colors duration-200";
  const selectedClasses = "border-2 border-[#0077F2] bg-blue-50 text-[#0077F2] font-semibold shadow-sm";
  const unselectedClasses = "border-gray-300 bg-white text-gray-700 hover:border-gray-400";

  // Logic to split label and price
  // Looks for pattern like " +5 €" or " -15 €" at the end of the string
  const priceRegex = /\s([+-]\d+\s?€)$/;
  const match = option.label.match(priceRegex);
  
  let mainText = option.label;
  let priceText = null;

  if (match) {
    mainText = option.label.replace(priceRegex, ''); // Remove price from main text
    priceText = match[1]; // Extract price part
  }

  return (
    <button
      onClick={() => onClick(option)}
      className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
    >
      <span className="leading-tight">{mainText}</span>
      {priceText && <span className="block font-bold mt-0.5">{priceText}</span>}
    </button>
  );
};


const OptionGroup: React.FC<OptionGroupProps> = ({ icon, title, options, selectedValues, onSelect }) => {
  return (
    <section>
       <div className="flex items-center space-x-4 mb-4">
            <div className="text-[#0077F2] flex-shrink-0 w-8 h-8">{icon}</div>
            <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        </div>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <OptionButton
            key={option.id}
            option={option}
            isSelected={selectedValues.includes(option.id)}
            onClick={onSelect}
          />
        ))}
      </div>
    </section>
  );
};

export default OptionGroup;
