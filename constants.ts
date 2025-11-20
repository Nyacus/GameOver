
import type { Option } from './types';

export const BASE_PRICE = 79;
export const ACCOMMODATION_PRICE = 20;

export const ACTIVITY_OPTIONS: Option[] = [
  { id: 'limusina', label: 'Paseo en limusina', value: 0 },
  { id: 'sin_actividad', label: 'Sin actividad -15 €', value: -15 },
  { id: 'boat_party', label: 'Boat Party +5 €', value: 5 },
  { id: 'multiaventura', label: 'Multiaventura náutica +3 €', value: 3 },
  { id: 'escape_room', label: 'Escape room', value: 0 },
  { id: 'paintball', label: 'Paintball +5 €', value: 5 },
  { id: 'karting', label: 'Karting +5 €', value: 5 },
  { id: 'humor_amarillo', label: 'Humor amarillo +8 €', value: 8 },
  { id: 'cata_vinos', label: 'Cata de vinos +10 €', value: 10 },
  { id: 'risoterapia', label: 'Risoterapia +5 €', value: 5 },
  { id: 'disco_2_copas', label: 'Entrada Disco y 2 copas', value: 0 },
  { id: 'botella_vip', label: 'Botella y entrada en VIP +10 €', value: 10 },
];

export const PAELLA_OPTIONS: Option[] = [
  { id: 'paella_budha', label: 'Paella en Budha Beach', value: 0 },
  { id: 'sin_paella', label: 'Sin paella -15 €', value: -15 },
  { id: 'paella_restaurante', label: 'Paella en restaurante +5 €', value: 5 },
  { id: 'paella_premium', label: 'Paella en Rte premium +15 €', value: 15 },
];

export const DINNER_OPTIONS: Option[] = [
  { id: 'cena_traviata', label: 'Cena en La Traviata', value: 0 },
  { id: 'sin_cena', label: 'Sin cena -15 €', value: -15 },
  { id: 'cena_bestias', label: 'Cena en Los Bestias +13 €', value: 13 },
  { id: 'cena_premium', label: 'Cena en Rte Premium +20 €', value: 20 },
];

export const EXTRA_ACTIVITY_OPTIONS: Option[] = [
  { id: 'sin_actividad_extra', label: 'Sin actividad extra', value: 0 },
  { id: 'show_erotico', label: 'Show erótico', value: 0 },
  { id: 'boat_party_extra', label: 'Boat Party +25 €', value: 25 },
  { id: 'multiaventura_extra', label: 'Multiaventura náutica +25 €', value: 25 },
  { id: 'escape_room_extra', label: 'Escape room +25 €', value: 25 },
  { id: 'paintball_extra', label: 'Paintball +25 €', value: 25 },
  { id: 'karting_extra', label: 'Karting +25 €', value: 25 },
  { id: 'humor_amarillo_extra', label: 'Humor amarillo +28 €', value: 28 },
  { id: 'cata_vinos_extra', label: 'Cata de vinos +30 €', value: 30 },
  { id: 'risoterapia_extra', label: 'Risoterapia +25 €', value: 25 },
  { id: 'disco_2_copas_extra', label: 'Entrada Disco y 2 copas +15 €', value: 15 },
  { id: 'botella_vip_extra', label: 'Botella y entrada en VIP +25 €', value: 25 },
];

export const ACCOMMODATION_OPTIONS: Option[] = [
    { 
        id: 'sin_alojamiento', 
        label: 'Sin alojamiento', 
        value: 0, 
        priceOneNight: 0, 
        priceTwoNights: 0 
    },
    { 
        id: 'bungalows', 
        label: 'Bungalows de madera', 
        value: 20, 
        priceOneNight: 20, 
        priceTwoNights: 35 // 20 + 15
    },
    { 
        id: 'apartamentos', 
        label: 'Apartamentos', 
        value: 30, 
        priceOneNight: 30, 
        priceTwoNights: 55 // 30 + 25
    },
    { 
        id: 'hotel', 
        label: 'Hotel ***', 
        value: 40, 
        priceOneNight: 40, 
        priceTwoNights: 75 // 40 + 35
    },
    { 
        id: 'chalet', 
        label: 'Chalet con piscina', 
        value: 50, 
        priceOneNight: 50, 
        priceTwoNights: 95 // 50 + 45
    },
];
