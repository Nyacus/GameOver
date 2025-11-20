
import React, { useState } from 'react';
import type { Option } from '../types';
import { CalendarIcon } from './icons';
import CalendarModal from './CalendarModal';

interface AccommodationSectionProps {
    icon: React.ReactNode;
    title: string;
    options: Option[];
    selectedOption: Option;
    onSelect: (option: Option) => void;
    date: string;
    onDateChange: (date: string, rawDate?: Date) => void;
    onValidationError: (message: string) => void;
    numberOfNights: 1 | 2;
    onNightsChange: (nights: 1 | 2) => void;
}

const AccommodationSection: React.FC<AccommodationSectionProps> = ({ 
    icon, 
    title, 
    options, 
    selectedOption, 
    onSelect, 
    date, 
    onDateChange,
    onValidationError,
    numberOfNights,
    onNightsChange
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  // Estado para guardar la opción que el usuario quería seleccionar antes de elegir fecha
  const [pendingOption, setPendingOption] = useState<Option | null>(null);
  
  const handleOptionClick = (option: Option) => {
    // Si selecciona "sin alojamiento", no obligamos a poner fecha
    if (option.id === 'sin_alojamiento') {
        onSelect(option);
        return;
    }

    // Si no hay fecha seleccionada y elige un alojamiento, guardamos la intención y abrimos calendario
    if (!date) {
        setPendingOption(option);
        setIsCalendarOpen(true);
        return;
    }
    
    onSelect(option);
  };

  const handleDateSelection = (dateString: string, rawDate: Date) => {
    // 1. Actualizar la fecha
    onDateChange(dateString, rawDate);
    
    // 2. Si había una opción pendiente (el usuario hizo clic en un hotel antes de tener fecha), la seleccionamos ahora automáticamente
    if (pendingOption) {
        onSelect(pendingOption);
        setPendingOption(null);
    }
  };

  const handleCloseCalendar = () => {
    setIsCalendarOpen(false);
    // Si cierra sin elegir fecha, limpiamos la opción pendiente
    setPendingOption(null);
  };

  return (
    <section className="mt-8">
        <div className="flex items-center space-x-4 mb-4">
            <div className="text-[#0077F2] flex-shrink-0 w-8 h-8">{icon}</div>
            <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        </div>
        
        {/* Selector de noches */}
        {date && (
            <div className="flex justify-center mb-4">
                <div className="inline-flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => onNightsChange(1)}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            numberOfNights === 1 
                            ? 'bg-white text-[#0077F2] shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        1 Noche
                    </button>
                    <button
                        onClick={() => onNightsChange(2)}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            numberOfNights === 2 
                            ? 'bg-white text-[#0077F2] shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        2 Noches
                    </button>
                </div>
            </div>
        )}

        <div className="grid grid-cols-2 gap-3">
            {/* Custom Date Picker Trigger */}
            <button
                onClick={() => setIsCalendarOpen(true)}
                className="relative col-span-1 w-full h-full min-h-[3.5rem] border border-gray-300 rounded-lg bg-white hover:border-[#0077F2] hover:text-[#0077F2] transition-all group flex items-center justify-center p-2"
            >
                {date ? (
                     <div className="flex flex-col items-center justify-center text-[#0077F2]">
                        <span className="font-bold text-sm leading-tight text-center">{date}</span>
                        <span className="text-xs mt-0.5 text-gray-500">Cambiar fecha</span>
                     </div>
                ) : (
                    <div className="text-gray-500 group-hover:text-[#0077F2] transition-colors flex flex-col items-center justify-center">
                         <CalendarIcon />
                         <span className="text-sm font-medium mt-1">Elegir fecha</span>
                    </div>
                )}
            </button>

            {options.map(option => {
                const isSelected = selectedOption.id === option.id;
                const baseClasses = "w-full h-full min-h-[3.5rem] flex flex-col items-center justify-center text-center p-2 rounded-lg border text-sm transition-colors duration-200 cursor-pointer";
                const selectedClasses = "border-2 border-[#0077F2] bg-blue-50 text-[#0077F2] font-semibold shadow-sm";
                const unselectedClasses = "border-gray-300 bg-white text-gray-700 hover:border-gray-400";

                const mainText = option.label;

                return (
                    <button 
                        key={option.id}
                        onClick={() => handleOptionClick(option)}
                        className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
                    >
                        <span className="leading-tight mb-1">{mainText}</span>
                        
                        {date && option.id !== 'sin_alojamiento' && (
                            <div className="flex flex-col text-xs space-y-0.5 mt-1 w-full">
                                <div className={`flex justify-between w-full px-2 ${numberOfNights === 1 ? 'font-bold' : 'opacity-70'}`}>
                                    <span>1 noche:</span>
                                    <span>{option.priceOneNight} €</span>
                                </div>
                                <div className={`flex justify-between w-full px-2 ${numberOfNights === 2 ? 'font-bold' : 'opacity-70'}`}>
                                    <span>2 noches:</span>
                                    <span>{option.priceTwoNights} €</span>
                                </div>
                            </div>
                        )}
                    </button>
                )
            })}
        </div>

        <CalendarModal 
            isOpen={isCalendarOpen}
            onClose={handleCloseCalendar}
            onSelectDate={handleDateSelection}
            message={pendingOption ? "Por favor, selecciona primero una fecha para reservar este alojamiento." : undefined}
        />
    </section>
  );
};

export default AccommodationSection;
