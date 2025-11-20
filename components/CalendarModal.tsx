
import React, { useState, useEffect } from 'react';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (formattedDate: string, rawDate: Date) => void;
  message?: string;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose, onSelectDate, message }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Reset to current month when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentDate(new Date());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    // 0 = Domingo, 1 = Lunes, ...
    // Queremos que la semana empiece en Lunes (0)
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isWeekend = (day: number) => {
    const dateToCheck = new Date(year, month, day);
    const dayOfWeek = dateToCheck.getDay();
    // 5 = Viernes, 6 = Sábado, 0 = Domingo
    return dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;
  };

  const handleDateClick = (day: number) => {
    if (!isWeekend(day)) return;

    const selectedDate = new Date(year, month, day);
    const dayOfWeek = selectedDate.getDay(); // 0-6 (Sun-Sat)
    
    let friday = new Date(selectedDate);
    let sunday = new Date(selectedDate);

    // Calculate Friday and Sunday based on clicked day
    if (dayOfWeek === 5) { // Friday
        sunday.setDate(selectedDate.getDate() + 2);
    } else if (dayOfWeek === 6) { // Saturday
        friday.setDate(selectedDate.getDate() - 1);
        sunday.setDate(selectedDate.getDate() + 1);
    } else if (dayOfWeek === 0) { // Sunday
        friday.setDate(selectedDate.getDate() - 2);
    }

    // Format: "Del 3 al 5 de julio"
    const monthName = monthNames[month].toLowerCase();
    const formattedString = `Del ${friday.getDate()} al ${sunday.getDate()} de ${monthName}`;
    
    // Devolvemos tanto el texto formateado como el objeto Date del viernes
    onSelectDate(formattedString, friday);
    onClose();
  };

  const renderDays = () => {
    const totalDays = getDaysInMonth(year, month);
    const startDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Empty cells for days before start of month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }

    // Day cells
    for (let day = 1; day <= totalDays; day++) {
      const weekend = isWeekend(day);
      const baseClasses = "h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium transition-colors";
      const availableClasses = "bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer font-bold border border-green-200";
      const disabledClasses = "text-gray-300 cursor-default";

      days.push(
        <div 
          key={day} 
          className="flex justify-center items-center py-1"
        >
            <button
                onClick={() => handleDateClick(day)}
                disabled={!weekend}
                className={`${baseClasses} ${weekend ? availableClasses : disabledClasses}`}
            >
            {day}
            </button>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Optional Message for Context */}
        {message && (
             <div className="bg-amber-50 border-b border-amber-100 px-4 py-3 flex items-start space-x-2">
                <span className="material-symbols-rounded text-amber-500 text-lg mt-0.5">info</span>
                <p className="text-sm text-amber-800 font-medium leading-snug">{message}</p>
             </div>
        )}

        {/* Header */}
        <div className="bg-[#0077F2] text-white p-4 flex justify-between items-center">
          <button onClick={handlePrevMonth} className="hover:bg-blue-600 p-1 rounded">
            <span className="material-symbols-rounded">chevron_left</span>
          </button>
          <span className="font-bold text-lg capitalize">{monthNames[month]} {year}</span>
          <button onClick={handleNextMonth} className="hover:bg-blue-600 p-1 rounded">
            <span className="material-symbols-rounded">chevron_right</span>
          </button>
        </div>

        {/* Week days header */}
        <div className="grid grid-cols-7 gap-1 p-2 text-center border-b text-xs font-bold text-gray-500 uppercase">
          <div>L</div>
          <div>M</div>
          <div>X</div>
          <div>J</div>
          <div>V</div>
          <div>S</div>
          <div>D</div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 p-4">
          {renderDays()}
        </div>
        
        <div className="bg-gray-50 px-4 py-3 text-center text-xs text-gray-500">
            Selecciona cualquier día verde (Vie-Sab-Dom) para reservar el fin de semana.
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
