
import React from 'react';

interface PriceFooterProps {
  packPrice: number;
  accommodationPrice: number;
  totalPrice: number;
}

const PriceFooter: React.FC<PriceFooterProps> = ({ packPrice, accommodationPrice, totalPrice }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-[#0077F2] text-white p-4 z-10 max-w-lg mx-auto">
      <div className="flex justify-around items-center text-center">
        <div>
          <span className="text-5xl font-bold">{packPrice}</span>
          <p className="text-sm">Pack despedida</p>
        </div>
        <span className="text-4xl font-light">+</span>
        <div>
          <span className="text-5xl font-bold">{accommodationPrice}</span>
          <p className="text-sm">Alojamiento</p>
        </div>
        <span className="text-4xl font-light">=</span>
        <div>
          <span className="text-5xl font-bold">{totalPrice}</span>
          <p className="text-sm">€/persona</p>
        </div>
      </div>
    </footer>
  );
};

export default PriceFooter;
