
import React, { useState, useEffect, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import type { Option } from './types';
import {
  BASE_PRICE,
  ACTIVITY_OPTIONS,
  PAELLA_OPTIONS,
  DINNER_OPTIONS,
  EXTRA_ACTIVITY_OPTIONS,
  ACCOMMODATION_OPTIONS,
} from './constants';
import {
  CameraIcon,
  ActivityIcon,
  VipCardIcon,
  TshirtIcon,
  PaellaIcon,
  PartyIcon,
  DinnerIcon,
  DrinksIcon,
  TicketIcon,
  ExtraActivityIcon,
  BedIcon,
} from './components/icons';

import Header from './components/Header';
import InfoSection from './components/InfoSection';
import OptionGroup from './components/OptionGroup';
import PriceFooter from './components/PriceFooter';
import ValidationModal from './components/ValidationModal';
import AccommodationSection from './components/AccommodationSection';
import GroupSizeModal from './components/GroupSizeModal';

// ----------------------------------------------------------------------
// IMPORTANTE: Sustituye esta URL por la de tu hoja publicada en CSV
// Archivo -> Compartir -> Publicar en la web -> Formato Coma-separated values (.csv)
// ----------------------------------------------------------------------
const GOOGLE_SHEET_CSV_URL: string = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT2RFh-9D1iv6roADsnGnWiizHkjAytSCxfq6fQMnfVQLxMfIz52fJriXncKwuMtQVmApIoq8GADtrY/pub?gid=0&single=true&output=csv";

const LOGO_URL = "https://i.imgur.com/DZ04yVD.png";
const FOOTER_URL = "https://i.imgur.com/M8hULX7.png";

const App: React.FC = () => {
  const [selectedActivity, setSelectedActivity] = useState<Option>(ACTIVITY_OPTIONS[0]);
  const [selectedPaella, setSelectedPaella] = useState<Option>(PAELLA_OPTIONS[0]);
  const [selectedDinner, setSelectedDinner] = useState<Option>(DINNER_OPTIONS[0]);
  const [selectedExtraActivities, setSelectedExtraActivities] = useState<Option[]>([EXTRA_ACTIVITY_OPTIONS[0]]);
  
  // Estado para las opciones de alojamiento (pueden cambiar según el CSV)
  const [currentAccommodationOptions, setCurrentAccommodationOptions] = useState<Option[]>(ACCOMMODATION_OPTIONS);
  
  const [selectedAccommodation, setSelectedAccommodation] = useState<Option>(ACCOMMODATION_OPTIONS[0]);
  const [accommodationDate, setAccommodationDate] = useState<string>('');
  const [accommodationRawDate, setAccommodationRawDate] = useState<Date | null>(null);
  const [numberOfNights, setNumberOfNights] = useState<1 | 2>(1);
  
  // Mapa de precios: Clave "DD/MM/AAAA" -> Valores
  const [pricingMap, setPricingMap] = useState<Record<string, any> | null>(null);

  // Precios calculados
  const [servicesPrice, setServicesPrice] = useState<number>(BASE_PRICE);
  const [accommodationPrice, setAccommodationPrice] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(BASE_PRICE);
  
  // Modales
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  
  // Modal Show Erótico
  const [isGroupModalOpen, setIsGroupModalOpen] = useState<boolean>(false);
  const [eroticShowPrice, setEroticShowPrice] = useState<number | null>(null);

  // 1. Cargar datos de Google Sheets al iniciar
  useEffect(() => {
    if (GOOGLE_SHEET_CSV_URL === "PEGAR_AQUI_TU_URL_DE_GOOGLE_SHEETS_CSV") {
        console.warn("No se ha configurado la URL de Google Sheets.");
        return;
    }

    // Añadimos un timestamp (&t=Date.now()) para evitar que el navegador guarde en caché el CSV antiguo
    const bustCacheUrl = `${GOOGLE_SHEET_CSV_URL}&t=${Date.now()}`;

    fetch(bustCacheUrl)
      .then(response => response.text())
      .then(csvText => {
        const rows = csvText.split('\n').slice(1); // Saltar cabecera
        const map: Record<string, any> = {};

        rows.forEach(row => {
          // CSV format esperado: Fecha, Bung1, Bung2, Apt1, Apt2, Hotel1, Hotel2, Chalet1, Chalet2
          // Usamos una expresión regular para separar por comas respetando comillas si las hubiera
          const cols = row.split(',').map(c => c.trim());
          
          if (cols.length >= 9) {
            const dateKey = cols[0]; // Fecha (Viernes)
            
            // Función auxiliar para limpiar símbolos de moneda y parsear
            const parsePrice = (val: string) => {
                if (!val) return 0;
                const num = parseFloat(val.replace(/[^\d.,]/g, '').replace(',', '.'));
                return isNaN(num) ? 0 : num;
            };

            map[dateKey] = {
              bungalows: { 1: parsePrice(cols[1]), 2: parsePrice(cols[2]) },
              apartamentos: { 1: parsePrice(cols[3]), 2: parsePrice(cols[4]) },
              hotel: { 1: parsePrice(cols[5]), 2: parsePrice(cols[6]) },
              chalet: { 1: parsePrice(cols[7]), 2: parsePrice(cols[8]) },
            };
          }
        });
        setPricingMap(map);
        console.log("Precios cargados correctamente:", Object.keys(map).length, "fechas.");
      })
      .catch(error => console.error("Error cargando precios:", error));
  }, []);

  // 2. Actualizar opciones de alojamiento cuando cambia la fecha
  useEffect(() => {
    if (!accommodationRawDate || !pricingMap) {
        // Si no hay fecha o no hay mapa de precios, usar los base
        setCurrentAccommodationOptions(ACCOMMODATION_OPTIONS);
        return;
    }

    // Formatear fecha a DD/MM/AAAA para buscar en el mapa
    const day = String(accommodationRawDate.getDate()).padStart(2, '0');
    const month = String(accommodationRawDate.getMonth() + 1).padStart(2, '0');
    const year = accommodationRawDate.getFullYear();
    const dateKey = `${day}/${month}/${year}`;

    const pricesForDate = pricingMap[dateKey];

    if (pricesForDate) {
        const updatedOptions = ACCOMMODATION_OPTIONS.map(opt => {
            if (opt.id === 'sin_alojamiento') return opt;
            
            const newPrices = pricesForDate[opt.id];
            if (newPrices) {
                return {
                    ...opt,
                    priceOneNight: newPrices[1],
                    priceTwoNights: newPrices[2],
                    // Actualizamos el 'value' base temporalmente al de 1 noche para consistencia visual inicial
                    value: newPrices[1] 
                };
            }
            return opt;
        });
        setCurrentAccommodationOptions(updatedOptions);
    } else {
        // Si la fecha no está en el Excel, volver a precios base
        setCurrentAccommodationOptions(ACCOMMODATION_OPTIONS);
    }

  }, [accommodationRawDate, pricingMap]);


  useEffect(() => {
    // Calcular solo el pack de servicios
    const activityPrice = selectedActivity.value;
    const paellaPrice = selectedPaella.value;
    const dinnerPrice = selectedDinner.value;
    const extraActivityPrice = selectedExtraActivities.reduce((acc, curr) => acc + curr.value, 0);
    
    const calculatedServicesPrice = BASE_PRICE + activityPrice + paellaPrice + dinnerPrice + extraActivityPrice;
    setServicesPrice(calculatedServicesPrice);

    // Calcular precio alojamiento usando las opciones ACTUALES (que pueden tener precio modificado)
    // Buscamos la opción seleccionada dentro de las opciones actuales para obtener su precio actualizado
    const currentOptionData = currentAccommodationOptions.find(o => o.id === selectedAccommodation.id) || selectedAccommodation;

    let currentAccPrice = currentOptionData.value;
    if (numberOfNights === 2 && currentOptionData.priceTwoNights !== undefined) {
        currentAccPrice = currentOptionData.priceTwoNights;
    } else if (numberOfNights === 1 && currentOptionData.priceOneNight !== undefined) {
        currentAccPrice = currentOptionData.priceOneNight;
    }
    
    setAccommodationPrice(currentAccPrice);
    setTotalPrice(calculatedServicesPrice + currentAccPrice);

  }, [selectedActivity, selectedPaella, selectedDinner, selectedExtraActivities, selectedAccommodation, numberOfNights, currentAccommodationOptions]);

  const createSelectHandler = useCallback((
    setter: React.Dispatch<React.SetStateAction<Option>>, 
    currentState: Option, 
    dependencies: { name: string; state: Option }[]
  ) => (option: Option) => {
    
    const isTryingToExclude = option.value < 0;
    if (!isTryingToExclude) {
      setter(option);
      return;
    }

    const excludedCount = dependencies.filter(dep => dep.state.value < 0).length;

    if (excludedCount >= 2) {
      const remainingServices = dependencies.filter(dep => dep.state.value >= 0).map(d => d.name);
      const message = `No puedes excluir este servicio. Debes mantener al menos una de las siguientes opciones: Actividad, Paella o Cena. Actualmente tienes: ${remainingServices.join(', ')}.`;
      setModalMessage(message);
      setIsModalOpen(true);
    } else {
      setter(option);
    }
  }, []);


  const handleActivitySelect = createSelectHandler(setSelectedActivity, selectedActivity, [
    { name: 'Paella', state: selectedPaella },
    { name: 'Cena', state: selectedDinner },
  ]);

  const handlePaellaSelect = createSelectHandler(setSelectedPaella, selectedPaella, [
    { name: 'Actividad', state: selectedActivity },
    { name: 'Cena', state: selectedDinner },
  ]);

  const handleDinnerSelect = createSelectHandler(setSelectedDinner, selectedDinner, [
    { name: 'Actividad', state: selectedActivity },
    { name: 'Paella', state: selectedPaella },
  ]);

  const handleExtraActivitySelect = (option: Option) => {
    if (option.id === 'sin_actividad_extra') {
        setSelectedExtraActivities([option]);
        setEroticShowPrice(null); // Resetear si limpian todo
        return;
    }

    // Lógica especial para Show Erótico
    if (option.id === 'show_erotico') {
        const isSelected = selectedExtraActivities.some(p => p.id === 'show_erotico');
        if (!isSelected) {
            // Si no está seleccionado, abrimos el modal para calcular precio
            setIsGroupModalOpen(true);
            return; 
        }
        // Si ya está seleccionado, dejamos que el código de abajo lo deseleccione (toggle)
    }

    setSelectedExtraActivities(prev => {
        const withoutNone = prev.filter(p => p.id !== 'sin_actividad_extra');
        const isSelected = withoutNone.some(p => p.id === option.id);
        
        let newSelection;
        if (isSelected) {
            newSelection = withoutNone.filter(p => p.id !== option.id);
            if (option.id === 'show_erotico') {
                setEroticShowPrice(null); // Limpiar precio si se deselecciona
            }
        } else {
            newSelection = [...withoutNone, option];
        }

        if (newSelection.length === 0) {
             return [EXTRA_ACTIVITY_OPTIONS[0]];
        }
        return newSelection;
    });
  };

  const handleGroupSizeConfirm = (size: number) => {
    setIsGroupModalOpen(false);
    const pricePerPerson = Math.ceil(200 / size);
    setEroticShowPrice(pricePerPerson);

    // Creamos una opción modificada con el precio calculado
    const eroticOption = EXTRA_ACTIVITY_OPTIONS.find(o => o.id === 'show_erotico');
    if (eroticOption) {
        const newOption = {
            ...eroticOption,
            value: pricePerPerson,
            label: `Show erótico +${pricePerPerson} €`
        };
        
        // Añadimos a la selección
        setSelectedExtraActivities(prev => {
            const withoutNone = prev.filter(p => p.id !== 'sin_actividad_extra');
            return [...withoutNone, newOption];
        });
    }
  };

  const handleAccommodationError = (message: string) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };
  
  const handleDateChange = (dateString: string, rawDate?: Date) => {
    setAccommodationDate(dateString);
    if (rawDate) {
        setAccommodationRawDate(rawDate);
    }
    setNumberOfNights(1);
  };

  // Helper to load images for PDF
  const loadImage = (url: string): Promise<HTMLImageElement | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.warn(`Failed to load image for PDF: ${url}`);
        resolve(null);
      };
      img.src = url;
    });
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    const marginX = 20;
    
    // Load Images
    const [logoImg, footerImg] = await Promise.all([
        loadImage(LOGO_URL),
        loadImage(FOOTER_URL)
    ]);

    // --- HEADER ---
    // Fondo Azul
    const headerHeight = 45; 
    doc.setFillColor(0, 119, 242); // #0077F2
    doc.rect(0, 0, 210, headerHeight, 'F');

    let cursorY = 8;

    // Image (Logo) Centered
    if (logoImg) {
        const maxLogoHeight = 18; 
        const imgRatio = logoImg.width / logoImg.height;
        const finalHeight = maxLogoHeight;
        const finalWidth = finalHeight * imgRatio;
        
        const xPos = (210 - finalWidth) / 2;
        
        doc.addImage(logoImg, 'PNG', xPos, cursorY, finalWidth, finalHeight, undefined, 'FAST');
        cursorY += finalHeight + 6;
    } else {
        cursorY += 20;
    }

    // Title
    doc.setTextColor(255, 255, 255); // Texto Blanco
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text('Presupuesto Despedida Gandía', 105, cursorY, { align: 'center' });
    
    cursorY += 8;
    
    // Dates Line: [Fecha despedida] --------------- [Fecha presupuesto]
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    
    // Fecha Despedida (Izquierda)
    const fechaDespedida = accommodationDate ? accommodationDate : "Fecha por determinar";
    doc.text(`Fecha despedida: ${fechaDespedida}`, 20, cursorY);

    // Fecha Presupuesto (Derecha)
    const fechaPresupuesto = new Date().toLocaleDateString('es-ES');
    doc.text(`Fecha presupuesto: ${fechaPresupuesto}`, 190, cursorY, { align: 'right' });

    // Start content below header
    cursorY = headerHeight + 10;

    // --- CONTENT LIST ---
    const items = [
        {
            title: "Fotografía de grupo 360º.",
            desc: "Cuando llegues a Gandía te obsequiremos con una foto muy original.",
        },
        {
            title: "Actividad incluida en el pack:",
            desc: selectedActivity.label,
        },
        {
            title: "App/Tarjeta VIP.",
            desc: "App para identificarte y descuentos en locales.",
        },
        {
            title: "Camiseta novio/a.",
            desc: "Regalo de camiseta en Budha Beach para firmas.",
        },
        {
            title: "Paella en la playa:",
            desc: selectedPaella.label,
        },
        {
            title: "Fiesta Tardeo en Budha Beach.",
            desc: "Cervezas 1€ y copas con descuento todo el día.",
        },
        {
            title: "Cena en restaurante:",
            desc: selectedDinner.label,
        },
        {
            title: "Descuento copas Zona Pubs.",
            desc: "Descuento en copas (1€ menos).",
        },
        {
            title: "Descuento entrada Disco o VIP Disco.",
            desc: "Entrada anticipada o VIP económicos sin cola.",
        },
        {
            title: "Actividades y servicios extra:",
            desc: selectedExtraActivities.map(e => e.label).join(', '),
            isExtras: true
        },
        {
            title: "Alojamiento:",
            desc: `${currentAccommodationOptions.find(o => o.id === selectedAccommodation.id)?.label || selectedAccommodation.label}${accommodationDate ? ` - ${accommodationDate} (${numberOfNights === 1 ? '1 noche' : '2 noches'})` : ''}`,
        }
    ];

    const drawItem = (item: any) => {
        // NO Page Break check to ensure single page

        // Omitir extras si no hay ninguno seleccionado
        if (item.isExtras && selectedExtraActivities.length === 1 && selectedExtraActivities[0].id === 'sin_actividad_extra') {
            return;
        }

        // Draw Bullet
        doc.setFillColor(0, 119, 242);
        doc.circle(25, cursorY - 1, 1.5, 'F'); // Adjusted X and radius

        // Title
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10); // Reduced font size
        doc.text(item.title, 32, cursorY);

        // Description
        doc.setTextColor(80, 80, 80); 
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9); // Reduced font size
        
        // Wider text area
        const descLines = doc.splitTextToSize(item.desc, 165); 
        doc.text(descLines, 32, cursorY + 4);

        // Increment Y (Tighter spacing)
        const descHeight = descLines.length * 4; // Tighter leading
        cursorY += Math.max(10, descHeight + 7); // Reduced minimum height and padding
    };

    items.forEach(drawItem);

    // --- SUMMARY FOOTER (Compact) ---
    // Ensure some spacing
    cursorY += 5;

    const summaryHeight = 38; // Compact height
    // Draw box
    doc.setFillColor(245, 250, 255); // Very light blue
    doc.setDrawColor(0, 119, 242);
    doc.rect(marginX, cursorY, 170, summaryHeight, 'FD'); // Fill and Draw border

    let summaryY = cursorY + 8;
    
    // Services
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Pack Servicios:", 30, summaryY);
    doc.text(`${servicesPrice} €`, 170, summaryY, { align: 'right' });
    
    summaryY += 7;
    
    // Accommodation
    doc.text("Alojamiento:", 30, summaryY);
    doc.text(`${accommodationPrice} €`, 170, summaryY, { align: 'right' });

    summaryY += 10;

    // Total
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 119, 242);
    doc.text("TOTAL POR PERSONA:", 30, summaryY);
    doc.text(`${totalPrice} €`, 170, summaryY, { align: 'right' });

    // --- FOOTER WITH BLUE BG AND IMAGE (Fixed Bottom) ---
    const footerHeight = 30;
    const footerY = 297 - footerHeight; // A4 page height is 297mm
    
    // Background
    doc.setFillColor(0, 119, 242); // #0077F2
    doc.rect(0, footerY, 210, footerHeight, 'F');

    // Draw Footer Image Centered
    if (footerImg) {
        const maxImgHeight = 18;
        const imgRatio = footerImg.width / footerImg.height;
        const finalHeight = maxImgHeight;
        const finalWidth = finalHeight * imgRatio;
        
        const xPos = (210 - finalWidth) / 2;
        const yPos = footerY + (footerHeight - finalHeight) / 2;
        
        doc.addImage(footerImg, 'PNG', xPos, yPos, finalWidth, finalHeight, undefined, 'FAST');
    }

    // Legal Text (White on Blue)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255); // White text
    // Placing it at the very bottom edge of the blue footer
    doc.text("* Presupuesto informativo sujeto a disponibilidad.", 105, footerY + footerHeight - 2, { align: 'center' });

    doc.save('presupuesto-despedida.pdf');
  };
  
  // Preparar opciones dinámicas para renderizar (actualizando el label/valor del show erótico si está calculado)
  const dynamicExtraOptions = EXTRA_ACTIVITY_OPTIONS.map(opt => {
    if (opt.id === 'show_erotico' && eroticShowPrice !== null) {
        return {
            ...opt,
            value: eroticShowPrice,
            label: `Show erótico +${eroticShowPrice} €`
        };
    }
    return opt;
  });

  return (
    <div className="bg-white max-w-lg mx-auto min-h-screen">
      <Header />
      <main className="pb-40">
        <div className="p-4 sm:p-6 space-y-8">
            <InfoSection
              icon={<CameraIcon />}
              title="Fotografía de grupo 360º."
              description="Cuando llegues a Gandía te obsequiremos con una foto muy original."
            />
            <OptionGroup
              icon={<ActivityIcon />}
              title="Actividad incluida en el pack:"
              options={ACTIVITY_OPTIONS}
              selectedValues={[selectedActivity.id]}
              onSelect={handleActivitySelect}
            />
            <InfoSection
              icon={<VipCardIcon />}
              title="App/Tarjeta VIP."
              description="App que te servirá para identificarte y aprovecharte de descuentos en los locales colaboradores."
            />
            <InfoSection
              icon={<TshirtIcon />}
              title="Camiseta novio/a."
              description="Al llegar al Buldha os obsequiarán con una camiseta para que se la firméis todos/as al novio/a."
            />
            <OptionGroup
              icon={<PaellaIcon />}
              title="Paella en la playa:"
              options={PAELLA_OPTIONS}
              selectedValues={[selectedPaella.id]}
              onSelect={handlePaellaSelect}
            />
             <InfoSection
              icon={<PartyIcon />}
              title="Fiesta Tardeo en Budha Beach."
              description="Cervezas a 1€ hasta la comida y cubatas -1€ todo el día con la Tarjeta VIP"
            />
            <OptionGroup
              icon={<DinnerIcon />}
              title="Cena en restaurante:"
              options={DINNER_OPTIONS}
              selectedValues={[selectedDinner.id]}
              onSelect={handleDinnerSelect}
            />
            <InfoSection
              icon={<DrinksIcon />}
              title="Descuento copas Zona Pubs."
              description="Descuento copas, 1€ mas baratas."
            />
            <InfoSection
              icon={<TicketIcon />}
              title="Descuento entrada Disco o VIP Disco."
              description="Entrada anticipada o VIP mas económicos, ambos con derecho a no hacer cola en la puerta."
            />
        </div>
        <div className='bg-gray-50 p-4 sm:p-6 mt-8'>
            <OptionGroup
                icon={<ExtraActivityIcon />}
                title="Actividades y servicios extra:"
                options={dynamicExtraOptions}
                selectedValues={selectedExtraActivities.map(o => o.id)}
                onSelect={handleExtraActivitySelect}
            />
            <AccommodationSection
                icon={<BedIcon />}
                title="Alojamiento:"
                options={currentAccommodationOptions} // Usamos las opciones con precios dinámicos
                selectedOption={selectedAccommodation}
                onSelect={setSelectedAccommodation}
                date={accommodationDate}
                onDateChange={handleDateChange}
                onValidationError={handleAccommodationError}
                numberOfNights={numberOfNights}
                onNightsChange={setNumberOfNights}
            />
        </div>

        <div className="p-6 mt-4 mb-8">
            <button
                onClick={generatePDF}
                className="w-full border-2 border-green-500 bg-green-50 text-green-600 hover:bg-green-100 font-bold py-4 px-6 rounded-xl shadow-sm transform transition hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-3"
            >
                <span className="material-symbols-rounded text-3xl">picture_as_pdf</span>
                <span className="text-lg">Descargar Presupuesto PDF</span>
            </button>
        </div>

      </main>
      <PriceFooter
        packPrice={servicesPrice}
        accommodationPrice={accommodationPrice}
        totalPrice={totalPrice}
      />
      <ValidationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={modalMessage}
      />
      <GroupSizeModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onConfirm={handleGroupSizeConfirm}
      />
    </div>
  );
};

export default App;
