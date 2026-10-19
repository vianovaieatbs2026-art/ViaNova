import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  MapPin,
  Crosshair,
  Search,
  RotateCcw,
  CheckCircle2,
  SlidersHorizontal,
  ExternalLink,
  Car,
  Layers,
  Compass,
  AlertTriangle,
  Loader2,
  X
} from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { searchMedellinAddresses, AddressSearchResult } from '../utils/addressSearch';

// Google Maps Platform API Key (provided by user & env)
const GOOGLE_MAPS_API_KEY =
  (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ||
  'AIzaSyAadWNX0HMHQXtXlvegmSOU_VXGRl6PCSE';

// Medellín, Antioquia Coordinates & Surrounding Zones
export const MEDELLIN_CENTER = { lat: 6.2476, lng: -75.5658 };

export interface ZoneItem {
  id: string;
  name: string;
  nameEn?: string;
  sector: string;
  sectorEn?: string;
  coords: { lat: number; lng: number };
  zoom: number;
  highlight: string;
  highlightEn?: string;
}

export const MEDELLIN_SURROUNDING_AREAS: ZoneItem[] = [
  {
    id: 'centro',
    name: 'Centro / Av. Oriental',
    nameEn: 'Downtown / Av. Oriental',
    sector: 'La Candelaria',
    sectorEn: 'La Candelaria',
    coords: { lat: 6.2486, lng: -75.5689 },
    zoom: 16,
    highlight: 'Eje comercial y administrativo de Medellín',
    highlightEn: 'Commercial & administrative hub of Medellín'
  },
  {
    id: 'el-poblado',
    name: 'El Poblado',
    nameEn: 'El Poblado',
    sector: 'Suroriente',
    sectorEn: 'Southeast',
    coords: { lat: 6.2085, lng: -75.5678 },
    zoom: 15,
    highlight: 'Milla de Oro, Calle 10 y Parque Lleras',
    highlightEn: 'Golden Mile, 10th St & Lleras Park'
  },
  {
    id: 'laureles',
    name: 'Laureles / Estadio',
    nameEn: 'Laureles / Stadium',
    sector: 'Occidente',
    sectorEn: 'West',
    coords: { lat: 6.25184, lng: -75.5898 },
    zoom: 16,
    highlight: 'Corredor Carrera 70 y Calle San Juan',
    highlightEn: 'Carrera 70 & San Juan Corridor'
  },
  {
    id: 'belen',
    name: 'Belén / Av. 80',
    nameEn: 'Belén / 80th Ave',
    sector: 'Suroccidente',
    sectorEn: 'Southwest',
    coords: { lat: 6.2312, lng: -75.6015 },
    zoom: 15,
    highlight: 'Corredor vial Av. 80 y Parque de Belén',
    highlightEn: 'Av. 80 road corridor & Belén Park'
  },
  {
    id: 'av-regional',
    name: 'Av. Regional (Río Medellín)',
    nameEn: 'Av. Regional (Medellín River)',
    sector: 'Corredor Norte-Sur',
    sectorEn: 'North-South Corridor',
    coords: { lat: 6.2401, lng: -75.5762 },
    zoom: 15,
    highlight: 'Eje estructurante multimodal del Valle de Aburrá',
    highlightEn: 'Multimodal corridor of Aburrá Valley'
  },
  {
    id: 'autopista-sur',
    name: 'Autopista Sur',
    nameEn: 'Autopista Sur (South Highway)',
    sector: 'Guayabal - Sur',
    sectorEn: 'Guayabal - South',
    coords: { lat: 6.2285, lng: -75.5795 },
    zoom: 15,
    highlight: 'Conexión con Itagüí, La Estrella y Envigado',
    highlightEn: 'Connection with Itagüí, La Estrella & Envigado'
  },
  {
    id: 'envigado',
    name: 'Envigado',
    nameEn: 'Envigado',
    sector: 'Sur Metropolitano',
    sectorEn: 'Southern Metro Area',
    coords: { lat: 6.1685, lng: -75.5842 },
    zoom: 15,
    highlight: 'Área Metropolitana del Valle de Aburrá',
    highlightEn: 'Aburrá Valley Metropolitan Area'
  },
  {
    id: 'bello',
    name: 'Bello',
    nameEn: 'Bello',
    sector: 'Norte Metropolitano',
    sectorEn: 'Northern Metro Area',
    coords: { lat: 6.3355, lng: -75.5583 },
    zoom: 15,
    highlight: 'Acceso norte Valle de Aburrá',
    highlightEn: 'Northern access to Aburrá Valley'
  },
  {
    id: 'itagui',
    name: 'Itagüí',
    nameEn: 'Itagüí',
    sector: 'Suroeste Metropolitano',
    sectorEn: 'Southwestern Metro Area',
    coords: { lat: 6.1725, lng: -75.6111 },
    zoom: 15,
    highlight: 'Centro industrial y comercial del sur',
    highlightEn: 'Southern industrial & commercial hub'
  }
];

export interface MedellinLandmark {
  name: string;
  coords: { lat: number; lng: number };
  zoom?: number;
  keywords: string[];
}

export const MEDELLIN_EXTENDED_LANDMARKS: MedellinLandmark[] = [
  // Avenidas y Corredores
  { name: 'Calle 44 (San Juan) con Cra 65', coords: { lat: 6.25184, lng: -75.5898 }, zoom: 17, keywords: ['san juan', 'calle 44', 'la 65', 'cra 65'] },
  { name: 'Carrera 70 (La 70), Laureles', coords: { lat: 6.2472, lng: -75.5891 }, zoom: 17, keywords: ['la 70', 'carrera 70', 'cra 70', 'bulevar 70'] },
  { name: 'Calle 10, El Poblado', coords: { lat: 6.2089, lng: -75.5684 }, zoom: 17, keywords: ['calle 10', '10 poblado'] },
  { name: 'Milla de Oro, Cra 43A (Av. El Poblado)', coords: { lat: 6.2045, lng: -75.5715 }, zoom: 17, keywords: ['milla de oro', 'carrera 43a', 'cra 43a', 'av el poblado'] },
  { name: 'Av. Las Vegas (Cra 48)', coords: { lat: 6.1982, lng: -75.5786 }, zoom: 16, keywords: ['las vegas', 'av las vegas', 'cra 48'] },
  { name: 'Av. Oriental (Cra 46)', coords: { lat: 6.2486, lng: -75.5660 }, zoom: 17, keywords: ['av oriental', 'oriental', 'cra 46', 'la playa'] },
  { name: 'Av. 80 (Corredor Occidental)', coords: { lat: 6.2312, lng: -75.6015 }, zoom: 16, keywords: ['la 80', 'av 80', 'avenida 80', 'cra 80'] },
  { name: 'Av. Regional (Eje del Río)', coords: { lat: 6.2401, lng: -75.5762 }, zoom: 16, keywords: ['av regional', 'regional', 'autopista norte'] },
  { name: 'Autopista Sur (Guayabal)', coords: { lat: 6.2285, lng: -75.5795 }, zoom: 16, keywords: ['autopista sur', 'guayabal'] },
  { name: 'Av. Nutibara, Laureles', coords: { lat: 6.2450, lng: -75.5940 }, zoom: 17, keywords: ['nutibara', 'av nutibara'] },
  { name: 'Av. Ferrocarril (Cra 57)', coords: { lat: 6.2470, lng: -75.5750 }, zoom: 17, keywords: ['ferrocarril', 'av ferrocarril'] },
  { name: 'Calle Colombia (Calle 50)', coords: { lat: 6.2519, lng: -75.5786 }, zoom: 17, keywords: ['calle colombia', 'calle 50'] },
  { name: 'Calle 33 (Av. 33)', coords: { lat: 6.2365, lng: -75.5890 }, zoom: 17, keywords: ['calle 33', 'av 33'] },

  // Sitios de Interés y Parques
  { name: 'Parque Lleras, El Poblado', coords: { lat: 6.2087, lng: -75.5676 }, zoom: 17, keywords: ['parque lleras', 'lleras'] },
  { name: 'Provenza, El Poblado', coords: { lat: 6.2095, lng: -75.5655 }, zoom: 17, keywords: ['provenza'] },
  { name: 'Parque Berrío, Centro de Medellín', coords: { lat: 6.2498, lng: -75.5683 }, zoom: 17, keywords: ['parque berrio', 'parque berrío', 'berrio', 'berrío'] },
  { name: 'Plaza Botero / Museo de Antioquia', coords: { lat: 6.2525, lng: -75.5685 }, zoom: 17, keywords: ['plaza botero', 'botero', 'museo de antioquia'] },
  { name: 'Centro Administrativo La Alpujarra', coords: { lat: 6.2445, lng: -75.5735 }, zoom: 17, keywords: ['alpujarra', 'la alpujarra', 'gobernacion', 'alcaldia'] },
  { name: 'Plaza Mayor Centro de Convenciones', coords: { lat: 6.2435, lng: -75.5765 }, zoom: 17, keywords: ['plaza mayor', 'caja de madera'] },
  { name: 'Parques del Río Medellín', coords: { lat: 6.2415, lng: -75.5775 }, zoom: 17, keywords: ['parques del rio', 'parques del río'] },
  { name: 'Estadio Atanasio Girardot', coords: { lat: 6.2568, lng: -75.5905 }, zoom: 17, keywords: ['estadio', 'atanasio', 'complejo deportivo'] },
  { name: 'Parque Explora', coords: { lat: 6.2705, lng: -75.5655 }, zoom: 17, keywords: ['parque explora', 'explora'] },
  { name: 'Jardín Botánico de Medellín', coords: { lat: 6.2710, lng: -75.5620 }, zoom: 17, keywords: ['jardin botanico', 'jardín botánico'] },
  { name: 'Parque de los Deseos / Planetario', coords: { lat: 6.2680, lng: -75.5650 }, zoom: 17, keywords: ['parque de los deseos', 'planetario'] },
  { name: 'Pueblito Paisa / Cerro Nutibara', coords: { lat: 6.2360, lng: -75.5800 }, zoom: 17, keywords: ['pueblito paisa', 'cerro nutibara', 'nutibara'] },
  { name: 'Cerro El Volador', coords: { lat: 6.2640, lng: -75.5850 }, zoom: 17, keywords: ['cerro el volador', 'el volador'] },
  { name: 'Museo de Arte Moderno (MAMM) / Ciudad del Río', coords: { lat: 6.2240, lng: -75.5740 }, zoom: 17, keywords: ['mamm', 'ciudad del rio', 'ciudad del río', 'arte moderno'] },
  { name: 'Parque de Boston', coords: { lat: 6.2480, lng: -75.5580 }, zoom: 17, keywords: ['boston', 'parque boston'] },
  { name: 'Parque de Bolívar / Catedral Metropolitana', coords: { lat: 6.2545, lng: -75.5645 }, zoom: 17, keywords: ['parque bolivar', 'parque bolívar', 'catedral metropolitana'] },

  // Universidades
  { name: 'Universidad de Antioquia (UdeA)', coords: { lat: 6.2675, lng: -75.5685 }, zoom: 17, keywords: ['udea', 'universidad de antioquia'] },
  { name: 'Universidad Pontificia Bolivariana (UPB)', coords: { lat: 6.2425, lng: -75.5905 }, zoom: 17, keywords: ['upb', 'bolivariana', 'universidad pontificia bolivariana'] },
  { name: 'Universidad EAFIT', coords: { lat: 6.2005, lng: -75.5785 }, zoom: 17, keywords: ['eafit', 'universidad eafit'] },
  { name: 'Universidad Nacional (Sede Medellín)', coords: { lat: 6.2615, lng: -75.5780 }, zoom: 17, keywords: ['unal', 'universidad nacional'] },
  { name: 'Universidad de Medellín (UdeM)', coords: { lat: 6.2315, lng: -75.6110 }, zoom: 17, keywords: ['udem', 'universidad de medellin', 'universidad de medellín'] },
  { name: 'Politécnico Jaime Isaza Cadavid', coords: { lat: 6.2115, lng: -75.5775 }, zoom: 17, keywords: ['politecnico', 'politécnico', 'jaime isaza'] },
  { name: 'ITM Robledo', coords: { lat: 6.2780, lng: -75.5880 }, zoom: 17, keywords: ['itm', 'itm robledo'] },

  // Centros Comerciales
  { name: 'Centro Comercial Santafé Medellín', coords: { lat: 6.1975, lng: -75.5740 }, zoom: 17, keywords: ['santafe', 'santafé', 'cc santafe'] },
  { name: 'Parque Comercial El Tesoro', coords: { lat: 6.1990, lng: -75.5590 }, zoom: 17, keywords: ['el tesoro', 'tesoro'] },
  { name: 'Centro Comercial Los Molinos', coords: { lat: 6.2330, lng: -75.6040 }, zoom: 17, keywords: ['los molinos', 'molinos'] },
  { name: 'Centro Comercial Oviedo', coords: { lat: 6.1995, lng: -75.5725 }, zoom: 17, keywords: ['oviedo', 'cc oviedo'] },
  { name: 'Centro Comercial Premium Plaza', coords: { lat: 6.2315, lng: -75.5720 }, zoom: 17, keywords: ['premium plaza'] },
  { name: 'Centro Comercial San Diego', coords: { lat: 6.2335, lng: -75.5695 }, zoom: 17, keywords: ['san diego', 'cc san diego'] },
  { name: 'Centro Comercial Unicentro', coords: { lat: 6.2405, lng: -75.5880 }, zoom: 17, keywords: ['unicentro'] },

  // Terminales y Aeropuertos
  { name: 'Aeropuerto Olaya Herrera', coords: { lat: 6.2195, lng: -75.5905 }, zoom: 17, keywords: ['olaya herrera', 'aeropuerto olaya', 'aeropuerto local'] },
  { name: 'Terminal del Norte', coords: { lat: 6.2735, lng: -75.5710 }, zoom: 17, keywords: ['terminal norte', 'terminal del norte'] },
  { name: 'Terminal del Sur', coords: { lat: 6.2140, lng: -75.5865 }, zoom: 17, keywords: ['terminal sur', 'terminal del sur'] },

  // Hospitales
  { name: 'Hospital General de Medellín', coords: { lat: 6.2300, lng: -75.5690 }, zoom: 17, keywords: ['hospital general'] },
  { name: 'Hospital San Vicente Fundación', coords: { lat: 6.2610, lng: -75.5640 }, zoom: 17, keywords: ['san vicente', 'hospital san vicente'] },
  { name: 'Hospital Pablo Tobón Uribe', coords: { lat: 6.2825, lng: -75.5875 }, zoom: 17, keywords: ['pablo tobon', 'pablo tobón', 'hospital pablo tobon'] },
  { name: 'Clínica Las Américas', coords: { lat: 6.2190, lng: -75.5940 }, zoom: 17, keywords: ['las americas', 'las américas', 'clinica las americas'] },

  // Estaciones del Metro
  { name: 'Estación Metro San Antonio', coords: { lat: 6.2470, lng: -75.5695 }, zoom: 17, keywords: ['metro san antonio', 'estacion san antonio', 'estación san antonio'] },
  { name: 'Estación Metro Poblado', coords: { lat: 6.2120, lng: -75.5775 }, zoom: 17, keywords: ['metro poblado', 'estacion poblado', 'estación poblado'] },
  { name: 'Estación Metro Estadio', coords: { lat: 6.2530, lng: -75.5875 }, zoom: 17, keywords: ['metro estadio', 'estacion estadio', 'estación estadio'] },
  { name: 'Estación Metro Suramericana', coords: { lat: 6.2520, lng: -75.5820 }, zoom: 17, keywords: ['metro suramericana', 'suramericana'] },
  { name: 'Estación Metro Floresta', coords: { lat: 6.2565, lng: -75.5975 }, zoom: 17, keywords: ['metro floresta', 'floresta'] },
  { name: 'Estación Metro San Javier', coords: { lat: 6.2525, lng: -75.6155 }, zoom: 17, keywords: ['metro san javier', 'san javier'] },
  { name: 'Estación Metro Industriales', coords: { lat: 6.2295, lng: -75.5755 }, zoom: 17, keywords: ['metro industriales', 'industriales'] },
  { name: 'Estación Metro Exposiciones', coords: { lat: 6.2365, lng: -75.5750 }, zoom: 17, keywords: ['metro exposiciones', 'exposiciones'] },
  { name: 'Estación Metro Alpujarra', coords: { lat: 6.2440, lng: -75.5720 }, zoom: 17, keywords: ['metro alpujarra'] },
  { name: 'Estación Metro Parque Berrío', coords: { lat: 6.2500, lng: -75.5680 }, zoom: 17, keywords: ['metro parque berrio', 'metro berrio'] },
  { name: 'Estación Metro Prado', coords: { lat: 6.2570, lng: -75.5660 }, zoom: 17, keywords: ['metro prado', 'prado'] },
  { name: 'Estación Metro Hospital', coords: { lat: 6.2630, lng: -75.5645 }, zoom: 17, keywords: ['metro hospital'] },
  { name: 'Estación Metro Universidad', coords: { lat: 6.2690, lng: -75.5665 }, zoom: 17, keywords: ['metro universidad'] },
  { name: 'Estación Metro Caribe', coords: { lat: 6.2780, lng: -75.5695 }, zoom: 17, keywords: ['metro caribe', 'caribe'] },
  { name: 'Estación Metro Aguacatala', coords: { lat: 6.1950, lng: -75.5815 }, zoom: 17, keywords: ['metro aguacatala', 'aguacatala'] },
  { name: 'Estación Metro Ayurá', coords: { lat: 6.1830, lng: -75.5855 }, zoom: 17, keywords: ['metro ayura', 'metro ayurá', 'ayura', 'ayurá'] },
  { name: 'Estación Metro Acevedo', coords: { lat: 6.3010, lng: -75.5615 }, zoom: 17, keywords: ['metro acevedo', 'acevedo'] },
  { name: 'Estación Metro Tricentenario', coords: { lat: 6.2905, lng: -75.5670 }, zoom: 17, keywords: ['metro tricentenario', 'tricentenario'] },
  { name: 'Estación Metro Madera', coords: { lat: 6.3160, lng: -75.5610 }, zoom: 17, keywords: ['metro madera', 'madera'] },
  { name: 'Estación Metro Bello', coords: { lat: 6.3335, lng: -75.5555 }, zoom: 17, keywords: ['metro bello'] },
  { name: 'Estación Metro Niquía', coords: { lat: 6.3385, lng: -75.5445 }, zoom: 17, keywords: ['metro niquia', 'metro niquía', 'niquia', 'niquía'] },

  // Comunas y Barrios de Medellín
  { name: 'El Poblado (Comuna 14)', coords: { lat: 6.2085, lng: -75.5678 }, zoom: 16, keywords: ['poblado', 'el poblado', 'comuna 14'] },
  { name: 'Laureles / Estadio (Comuna 11)', coords: { lat: 6.2443, lng: -75.5925 }, zoom: 16, keywords: ['laureles', 'comuna 11'] },
  { name: 'Centro / La Candelaria (Comuna 10)', coords: { lat: 6.2486, lng: -75.5689 }, zoom: 16, keywords: ['centro', 'la candelaria', 'comuna 10'] },
  { name: 'Belén (Comuna 16)', coords: { lat: 6.2312, lng: -75.6015 }, zoom: 16, keywords: ['belen', 'belén', 'comuna 16'] },
  { name: 'Guayabal (Comuna 15)', coords: { lat: 6.2155, lng: -75.5842 }, zoom: 16, keywords: ['guayabal', 'comuna 15'] },
  { name: 'Robledo (Comuna 7)', coords: { lat: 6.2750, lng: -75.5950 }, zoom: 16, keywords: ['robledo', 'comuna 7', 'pilarica'] },
  { name: 'Castilla (Comuna 5)', coords: { lat: 6.2920, lng: -75.5730 }, zoom: 16, keywords: ['castilla', 'comuna 5', 'santander'] },
  { name: 'Aranjuez (Comuna 4)', coords: { lat: 6.2810, lng: -75.5580 }, zoom: 16, keywords: ['aranjuez', 'comuna 4', 'san pedro'] },
  { name: 'Manrique (Comuna 3)', coords: { lat: 6.2650, lng: -75.5520 }, zoom: 16, keywords: ['manrique', 'comuna 3'] },
  { name: 'Buenos Aires (Comuna 9)', coords: { lat: 6.2380, lng: -75.5510 }, zoom: 16, keywords: ['buenos aires', 'comuna 9'] },
  { name: 'La América (Comuna 12)', coords: { lat: 6.2510, lng: -75.6020 }, zoom: 16, keywords: ['la america', 'la américa', 'comuna 12'] },
  { name: 'San Javier (Comuna 13)', coords: { lat: 6.2525, lng: -75.6155 }, zoom: 16, keywords: ['san javier', 'comuna 13'] },
  { name: 'Santa Cruz (Comuna 2)', coords: { lat: 6.2980, lng: -75.5520 }, zoom: 16, keywords: ['santa cruz', 'comuna 2'] },
  { name: 'Popular (Comuna 1)', coords: { lat: 6.2950, lng: -75.5450 }, zoom: 16, keywords: ['popular', 'comuna 1'] },
  { name: 'Doce de Octubre (Comuna 6)', coords: { lat: 6.3050, lng: -75.5780 }, zoom: 16, keywords: ['doce de octubre', 'comuna 6'] },
  { name: 'Villa Hermosa (Comuna 8)', coords: { lat: 6.2530, lng: -75.5420 }, zoom: 16, keywords: ['villa hermosa', 'comuna 8'] },
  { name: 'San Antonio de Prado', coords: { lat: 6.1850, lng: -75.6550 }, zoom: 15, keywords: ['san antonio de prado'] },
  { name: 'San Cristóbal', coords: { lat: 6.2780, lng: -75.6350 }, zoom: 15, keywords: ['san cristobal', 'san cristóbal'] },
  { name: 'Santa Elena', coords: { lat: 6.2100, lng: -75.5000 }, zoom: 15, keywords: ['santa elena'] },
  { name: 'Altavista', coords: { lat: 6.2250, lng: -75.6350 }, zoom: 15, keywords: ['altavista'] },
];

export function findMedellinPlace(query: string): { name: string; coords: { lat: number; lng: number }; zoom?: number } | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;

  // 1. Surrounding areas exact/partial
  for (const z of MEDELLIN_SURROUNDING_AREAS) {
    if (
      z.name.toLowerCase().includes(q) ||
      (z.nameEn && z.nameEn.toLowerCase().includes(q)) ||
      z.sector.toLowerCase().includes(q) ||
      (z.sectorEn && z.sectorEn.toLowerCase().includes(q)) ||
      z.id.includes(q)
    ) {
      return { name: z.name, coords: z.coords, zoom: z.zoom };
    }
  }

  // 2. Extended landmarks
  for (const lm of MEDELLIN_EXTENDED_LANDMARKS) {
    if (lm.keywords.some((kw) => q.includes(kw) || kw.includes(q))) {
      return { name: lm.name, coords: lm.coords, zoom: lm.zoom || 17 };
    }
  }

  // 3. Address / Street Grid Calculation (Calles & Carreras of Medellín)
  const streetMatch = parseMedellinStreetAddress(q);
  if (streetMatch) {
    return streetMatch;
  }

  return null;
}

// Intelligent Street Address Grid Calculator for Medellín
export function parseMedellinStreetAddress(query: string): { name: string; coords: { lat: number; lng: number }; zoom: number } | null {
  const q = query.toLowerCase().replace(/#/g, ' ').replace(/no\.?/g, ' ').replace(/n°/g, ' ');

  // Look for Calle number and Carrera number
  const calleMatch = q.match(/(?:calle|cll|c\/e|cl)\s*(\d+)/i);
  const craMatch = q.match(/(?:carrera|cra|cr|kra|kr)\s*(\d+)/i);

  if (calleMatch && craMatch) {
    const calle = parseInt(calleMatch[1], 10);
    const cra = parseInt(craMatch[1], 10);
    // Medellín grid coordinate calibration:
    // Center intersection Calle 50 (Colombia) / Cra 50 (Palacé) ~ (6.2519, -75.5685)
    const lat = 6.2519 + (calle - 50) * 0.00105;
    const lng = -75.5685 - (cra - 50) * 0.00108;
    if (lat >= 6.13 && lat <= 6.35 && lng >= -75.67 && lng <= -75.50) {
      return {
        name: `Calle ${calle} con Carrera ${cra}`,
        coords: { lat, lng },
        zoom: 17
      };
    }
  } else if (calleMatch) {
    const calle = parseInt(calleMatch[1], 10);
    const lat = 6.2519 + (calle - 50) * 0.00105;
    if (lat >= 6.13 && lat <= 6.35) {
      return {
        name: `Calle ${calle}, Medellín`,
        coords: { lat, lng: -75.5750 },
        zoom: 16
      };
    }
  } else if (craMatch) {
    const cra = parseInt(craMatch[1], 10);
    const lng = -75.5685 - (cra - 50) * 0.00108;
    if (lng >= -75.67 && lng <= -75.50) {
      return {
        name: `Carrera ${cra}, Medellín`,
        coords: { lat: 6.2476, lng },
        zoom: 16
      };
    }
  }
  return null;
}

export interface MapMarkerPoint {
  id: string;
  title: string;
  description?: string;
  coords: { lat: number; lng: number };
  category?: 'incident' | 'traffic' | 'corridor' | 'user';
  severity?: 'alta' | 'media' | 'baja';
}

interface GoogleMapsLiveProps {
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  targetCoords?: { lat: number; lng: number } | null;
  targetZoom?: number;
  targetFormattedAddress?: string;
  targetDetails?: string;
  heightClass?: string;
  customMarkers?: MapMarkerPoint[];
  onMarkerClick?: (marker: MapMarkerPoint) => void;
  showSurroundingSelector?: boolean;
  showSearchBar?: boolean;
}

export const GoogleMapsLive: React.FC<GoogleMapsLiveProps> = ({
  initialCenter = MEDELLIN_CENTER,
  initialZoom = 14,
  targetCoords,
  targetZoom,
  targetFormattedAddress,
  targetDetails,
  heightClass = 'h-[520px] sm:h-[600px]',
  customMarkers = [],
  onMarkerClick,
  showSurroundingSelector = true,
  showSearchBar = true
}) => {
  const { language, t, themeMode } = useThemeLanguage();
  const isEn = language === 'en';

  // Live Camera state
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>(
    targetCoords || initialCenter
  );
  const [currentZoom, setCurrentZoom] = useState<number>(targetZoom || initialZoom);

  // Live GPS user location
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string>(
    isEn ? 'Medellín, Antioquia (Centered)' : 'Medellín, Antioquia (Centrado)'
  );
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  // Map Layer / Controls
  const [trafficEnabled, setTrafficEnabled] = useState<boolean>(true);
  const [mapTypeId, setMapTypeId] = useState<string>('roadmap'); // roadmap, satellite, terrain

  // Comprehensive Search input & disambiguation state
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);
  const [searchCandidates, setSearchCandidates] = useState<AddressSearchResult[] | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [activeFoundAddress, setActiveFoundAddress] = useState<string | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);

  // Reset loading state and ensure fallback timeout when language/theme changes
  useEffect(() => {
    setIframeLoaded(false);
    const safetyTimer = setTimeout(() => {
      setIframeLoaded(true);
    }, 2500);
    return () => clearTimeout(safetyTimer);
  }, [language, themeMode]);

  // Update status message when language changes
  useEffect(() => {
    if (!selectedZoneId) {
      setLocationStatus(
        isEn ? 'Medellín, Antioquia (Centered)' : 'Medellín, Antioquia (Centrado)'
      );
    } else {
      const zone = MEDELLIN_SURROUNDING_AREAS.find((z) => z.id === selectedZoneId);
      if (zone) {
        const zoneName = isEn && zone.nameEn ? zone.nameEn : zone.name;
        const zoneSector = isEn && zone.sectorEn ? zone.sectorEn : zone.sector;
        setLocationStatus(`${zoneName} (${zoneSector}) • Medellín, Antioquia`);
      }
    }
  }, [language, isEn, selectedZoneId]);

  // Automatic GPS Geolocation on mount
  const detectUserLocation = useCallback((forceCenter: boolean = true) => {
    if (!navigator.geolocation) {
      setLocationStatus(
        isEn
          ? 'Geolocation not available in this browser. View: Medellín, Antioquia.'
          : 'Geolocalización no disponible en este navegador. Vista: Medellín, Antioquia.'
      );
      return;
    }

    setIsLocating(true);
    setLocationStatus(
      isEn ? 'Locating your position in real time...' : 'Localizando tu posición en tiempo real...'
    );

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setUserLocation(coords);
        setIsLocating(false);

        if (forceCenter) {
          setCurrentCoords(coords);
          setCurrentZoom(16);
          setLocationStatus(
            isEn
              ? 'Live location detected • Medellín surrounding areas'
              : 'Ubicación actual detectada en vivo • Zonas aledañas de Medellín'
          );
          setSearchFeedback(
            isEn
              ? 'Located at your current position (Google Maps GPS)'
              : 'Ubicado en tu posición actual (Google Maps GPS)'
          );
          setTimeout(() => setSearchFeedback(null), 4000);

          // Tell map iframe to update
          iframeRef.current?.contentWindow?.postMessage(
            {
              type: 'SET_CENTER',
              coords,
              zoom: 16,
              userLocation: coords
            },
            '*'
          );
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation notice:', err.message);
        setCurrentCoords(MEDELLIN_CENTER);
        setCurrentZoom(14);
        setLocationStatus(
          isEn
            ? 'Medellín, Antioquia (Aburrá Valley) • Live coverage'
            : 'Medellín, Antioquia (Valle de Aburrá) • Cobertura en vivo'
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 9000,
        maximumAge: 30000
      }
    );
  }, [isEn]);

  // Sync external center and zoom props
  useEffect(() => {
    if (targetCoords) {
      setCurrentCoords(targetCoords);
      if (targetZoom) setCurrentZoom(targetZoom);
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: 'SET_CENTER',
          coords: targetCoords,
          zoom: targetZoom || 17
        },
        '*'
      );
    }
  }, [targetCoords?.lat, targetCoords?.lng, targetZoom]);

  useEffect(() => {
    if (initialCenter && !targetCoords) {
      setCurrentCoords(initialCenter);
      if (initialZoom) setCurrentZoom(initialZoom);
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: 'SET_CENTER',
          coords: initialCenter,
          zoom: initialZoom || 15
        },
        '*'
      );
    }
  }, [initialCenter?.lat, initialCenter?.lng, initialZoom, targetCoords]);

  // Handle Zone Selection
  const handleSelectZone = (zone: ZoneItem) => {
    setSelectedZoneId(zone.id);
    setCurrentCoords(zone.coords);
    setCurrentZoom(zone.zoom);
    const zName = isEn && zone.nameEn ? zone.nameEn : zone.name;
    const zSector = isEn && zone.sectorEn ? zone.sectorEn : zone.sector;
    setLocationStatus(`${zName} (${zSector}) • Medellín, Antioquia`);
    setSearchFeedback(isEn ? `Centered on ${zName}` : `Centrado en ${zName}`);
    setTimeout(() => setSearchFeedback(null), 3000);

    iframeRef.current?.contentWindow?.postMessage(
      {
        type: 'SET_CENTER',
        coords: zone.coords,
        zoom: zone.zoom,
        highlightZoneId: zone.id
      },
      '*'
    );
  };

  // Reset to full Medellín view
  const handleResetToMedellin = () => {
    setSelectedZoneId(null);
    setCurrentCoords(MEDELLIN_CENTER);
    setCurrentZoom(13);
    setLocationStatus(
      isEn ? 'Medellín, Antioquia • Metropolitan View' : 'Medellín, Antioquia • Vista Metropolitana'
    );
    setSearchFeedback(isEn ? 'Overview of Medellín' : 'Vista general de Medellín');
    setTimeout(() => setSearchFeedback(null), 3000);

    iframeRef.current?.contentWindow?.postMessage(
      {
        type: 'SET_CENTER',
        coords: MEDELLIN_CENTER,
        zoom: 13,
        highlightZoneId: null
      },
      '*'
    );
  };

  // Toggle Traffic Layer
  const handleToggleTraffic = () => {
    const nextVal = !trafficEnabled;
    setTrafficEnabled(nextVal);
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: 'SET_TRAFFIC',
        enabled: nextVal
      },
      '*'
    );
  };

  // Change Map Type
  const handleSelectMapType = (type: string) => {
    setMapTypeId(type);
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: 'SET_MAP_TYPE',
        mapTypeId: type
      },
      '*'
    );
  };

  // Handle Search Input in Medellín - Pans directly to the requested place or address
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawQuery = searchInput.trim();
    if (!rawQuery) return;

    const query = rawQuery.toLowerCase();
    setSearchFeedback(isEn ? `Locating «${rawQuery}» in Medellín...` : `Buscando «${rawQuery}» en Medellín...`);

    // 1. Instant match in comprehensive Medellín landmarks, avenues, and corridors
    const localMatch = findMedellinPlace(query);
    if (localMatch) {
      setCurrentCoords(localMatch.coords);
      setCurrentZoom(localMatch.zoom || 17);
      setLocationStatus(`📍 ${localMatch.name}`);
      setSearchFeedback(isEn ? `Located: ${localMatch.name}` : `Ubicado: ${localMatch.name}`);
      setTimeout(() => setSearchFeedback(null), 3500);

      iframeRef.current?.contentWindow?.postMessage(
        {
          type: 'SET_CENTER',
          coords: localMatch.coords,
          zoom: localMatch.zoom || 17,
          searchResultTitle: localMatch.name
        },
        '*'
      );
      return;
    }

    // 2. Request Geocoder execution directly inside the Google Maps iframe
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: 'GEOCODE_SEARCH',
        query: rawQuery
      },
      '*'
    );

    // 3. Fast Parallel Geocoding via Photon and Nominatim for any specific address or place
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const photonPromise = fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(rawQuery + ' Medellín Antioquia')}&lat=6.2476&lon=-75.5658&limit=1`,
        { signal: controller.signal }
      ).then(res => res.json()).catch(() => null);

      const nomQuery = `${rawQuery}, Medellín, Antioquia, Colombia`;
      const nominatimPromise = fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(nomQuery)}`,
        { headers: { 'Accept-Language': 'es' }, signal: controller.signal }
      ).then(res => res.json()).catch(() => null);

      const [photonData, nomData] = await Promise.all([photonPromise, nominatimPromise]);
      clearTimeout(timeoutId);

      let foundCoords: { lat: number; lng: number } | null = null;
      let foundName = rawQuery;

      if (photonData?.features?.[0]?.geometry?.coordinates) {
        const [lon, lat] = photonData.features[0].geometry.coordinates;
        if (lat >= 6.05 && lat <= 6.45 && lon >= -75.75 && lon <= -75.40) {
          foundCoords = { lat, lng: lon };
          foundName = photonData.features[0].properties?.name || rawQuery;
        }
      }

      if (!foundCoords && nomData && nomData.length > 0) {
        const lat = parseFloat(nomData[0].lat);
        const lon = parseFloat(nomData[0].lon);
        foundCoords = { lat, lng: lon };
        foundName = nomData[0].display_name.split(',').slice(0, 3).join(', ');
      }

      if (foundCoords) {
        setCurrentCoords(foundCoords);
        setCurrentZoom(17);
        setLocationStatus(`📍 ${foundName}`);
        setSearchFeedback(isEn ? `Located: ${foundName}` : `Ubicado: ${foundName}`);
        setTimeout(() => setSearchFeedback(null), 3500);

        iframeRef.current?.contentWindow?.postMessage(
          {
            type: 'SET_CENTER',
            coords: foundCoords,
            zoom: 17,
            searchResultTitle: foundName
          },
          '*'
        );
      }
    } catch (err) {
      console.warn('Geocoding fallback notice:', err);
    }
  };

  // Listen to messages from the map iframe
  useEffect(() => {
    const handleMsg = (event: MessageEvent) => {
      if (!event.data) return;
      if (event.data.type === 'MAP_READY') {
        setIframeLoaded(true);
      } else if (event.data.type === 'MARKER_CLICK') {
        const marker = event.data.marker;
        if (onMarkerClick && marker) {
          onMarkerClick(marker);
        }
      } else if (event.data.type === 'SEARCH_SUCCESS') {
        const { address, coords } = event.data;
        if (address) {
          setLocationStatus(`📍 ${address}`);
          setSearchFeedback(`📍 Ubicado: ${address}`);
          setTimeout(() => setSearchFeedback(null), 3500);
        }
        if (coords) {
          setCurrentCoords(coords);
        }
      }
    };

    window.addEventListener('message', handleMsg);
    return () => window.removeEventListener('message', handleMsg);
  }, [onMarkerClick]);

  // Construct isolated HTML payload for the Google Map iframe
  // This guarantees that Google Maps JavaScript API loads natively with language=en or language=es
  const iframeSrcDoc = useMemo(() => {
    const isDark = themeMode === 'dark';
    const lang = language === 'en' ? 'en' : 'es';

    const serializedZones = JSON.stringify(
      MEDELLIN_SURROUNDING_AREAS.map((z) => ({
        id: z.id,
        title: isEn && z.nameEn ? z.nameEn : z.name,
        sector: isEn && z.sectorEn ? z.sectorEn : z.sector,
        highlight: isEn && z.highlightEn ? z.highlightEn : z.highlight,
        coords: z.coords,
        zoom: z.zoom
      }))
    );

    const serializedCustomMarkers = JSON.stringify(customMarkers);

    const routeText = isEn ? 'Directions' : 'Ruta';
    const userLocTitle = isEn ? 'Your current location' : 'Tu ubicación actual';
    const userLocDesc = isEn
      ? 'Detected via Google Maps Geolocation in Medellín / Antioquia'
      : 'Detectada vía Google Maps Geolocation en Medellín / Antioquia';

    // Google Maps Dark Mode Style
    const darkMapStyle = isDark
      ? `[
          { "elementType": "geometry", "stylers": [{ "color": "#1e293b" }] },
          { "elementType": "labels.text.stroke", "stylers": [{ "color": "#0f172a" }] },
          { "elementType": "labels.text.fill", "stylers": [{ "color": "#cbd5e1" }] },
          { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#38bdf8" }] },
          { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#94a3b8" }] },
          { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#334155" }] },
          { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#1e293b" }] },
          { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#94a3b8" }] },
          { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#0284c7" }] },
          { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#1e293b" }] },
          { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#0f172a" }] }
        ]`
      : '[]';

    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Google Maps Live</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #map-canvas {
      width: 100%;
      height: 100%;
      overflow: hidden;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: ${isDark ? '#0f172a' : '#f8fafc'};
    }
    .custom-pulse-marker {
      position: relative;
      width: 22px;
      height: 22px;
    }
    .pulse-ring {
      position: absolute;
      top: -9px;
      left: -9px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(0, 82, 204, 0.45);
      animation: gmapPulse 1.8s infinite ease-out;
      pointer-events: none;
    }
    .pulse-core {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #0052cc;
      border: 2.5px solid #ffffff;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .pulse-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #fbbf24;
    }
    @keyframes gmapPulse {
      0% { transform: scale(0.5); opacity: 1; }
      100% { transform: scale(1.6); opacity: 0; }
    }
    .gm-style .gm-style-iw-c {
      border-radius: 16px !important;
      padding: 12px !important;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2) !important;
    }
    .info-box {
      font-size: 12px;
      color: #0f172a;
      max-width: 240px;
    }
    .info-title {
      font-weight: 800;
      font-size: 13px;
      margin-bottom: 4px;
      color: #0052cc;
    }
    .info-desc {
      font-size: 11px;
      color: #475569;
      margin-bottom: 8px;
      line-height: 1.4;
    }
    .info-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-weight: 700;
      color: #0052cc;
      text-decoration: none;
      font-size: 11px;
      border-top: 1px solid #e2e8f0;
      padding-top: 6px;
      width: 100%;
    }
    .info-btn:hover {
      text-decoration: underline;
    }
  </style>
  <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&language=${lang}&region=CO"></script>
</head>
<body>
  <div id="map-canvas"></div>
  <script>
    var map;
    var trafficLayer;
    var markers = [];
    var userMarker = null;
    var searchMarker = null;
    var infoWindow = null;
    var initialCoords = { lat: ${currentCoords.lat}, lng: ${currentCoords.lng} };
    var initialZoom = ${currentZoom};
    var zones = ${serializedZones};
    var customMarkersData = ${serializedCustomMarkers};
    var isTrafficOn = ${trafficEnabled};
    var currentMapTypeId = '${mapTypeId}';

    function initMap() {
      try {
        var mapOptions = {
          center: initialCoords,
          zoom: initialZoom,
          mapTypeId: currentMapTypeId,
          styles: ${darkMapStyle},
          gestureHandling: 'greedy',
          zoomControl: true,
          streetViewControl: true,
          mapTypeControl: false,
          fullscreenControl: false,
          scaleControl: true
        };

        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        infoWindow = new google.maps.InfoWindow();

        // Traffic Layer
        trafficLayer = new google.maps.TrafficLayer();
        if (isTrafficOn) {
          trafficLayer.setMap(map);
        }

        // Add Zone Markers
        zones.forEach(function(zone) {
          var marker = new google.maps.Marker({
            position: zone.coords,
            map: map,
            title: zone.title + ' (' + zone.sector + ')',
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 7,
              fillColor: '#0052cc',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2
            }
          });

          marker.addListener('click', function() {
            var content = '<div class="info-box">' +
              '<div class="info-title">' + zone.title + '</div>' +
              '<div class="info-desc">' + zone.sector + ' • ' + zone.highlight + '</div>' +
              '<a class="info-btn" href="https://www.google.com/maps/dir/?api=1&destination=' + zone.coords.lat + ',' + zone.coords.lng + '&hl=${lang}" target="_blank" rel="noopener">' +
              '<span>' + '${routeText}' + '</span> &rarr;</a>' +
              '</div>';

            infoWindow.setContent(content);
            infoWindow.open(map, marker);

            window.parent.postMessage({
              type: 'MARKER_CLICK',
              marker: {
                id: zone.id,
                title: zone.title,
                description: zone.sector + ' • ' + zone.highlight,
                coords: zone.coords,
                category: 'corridor'
              }
            }, '*');
          });

          markers.push(marker);
        });

        // Add Custom Incident Markers
        customMarkersData.forEach(function(cm) {
          var color = cm.severity === 'alta' ? '#e11d48' : cm.severity === 'media' ? '#f59e0b' : '#10b981';
          var marker = new google.maps.Marker({
            position: cm.coords,
            map: map,
            title: cm.title,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: color,
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2
            }
          });

          marker.addListener('click', function() {
            var content = '<div class="info-box">' +
              '<div class="info-title" style="color: ' + color + ';">' + cm.title + '</div>' +
              (cm.description ? '<div class="info-desc">' + cm.description + '</div>' : '') +
              '<a class="info-btn" href="https://www.google.com/maps/dir/?api=1&destination=' + cm.coords.lat + ',' + cm.coords.lng + '&hl=${lang}" target="_blank" rel="noopener">' +
              '<span>' + '${routeText}' + '</span> &rarr;</a>' +
              '</div>';

            infoWindow.setContent(content);
            infoWindow.open(map, marker);

            window.parent.postMessage({
              type: 'MARKER_CLICK',
              marker: cm
            }, '*');
          });

          markers.push(marker);
        });

        // Notify parent that map is ready
        window.parent.postMessage({ type: 'MAP_READY' }, '*');
      } catch (err) {
        console.error('Map init error:', err);
      }
    }

    // Handle messages from parent window
    window.addEventListener('message', function(event) {
      if (!event.data || !map) return;
      var data = event.data;

      if (data.type === 'SET_CENTER') {
        if (data.coords) {
          map.panTo(data.coords);
        }
        if (data.zoom) {
          map.setZoom(data.zoom);
        }
        if (data.searchResultTitle && data.coords) {
          if (!searchMarker) {
            searchMarker = new google.maps.Marker({
              map: map,
              animation: google.maps.Animation.DROP,
              icon: {
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                scale: 6,
                fillColor: '#ef4444',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2
              }
            });
          }
          searchMarker.setPosition(data.coords);
          searchMarker.setTitle(data.searchResultTitle);

          var content = '<div class="info-box">' +
            '<div class="info-title" style="color: #ef4444;">📍 ' + data.searchResultTitle + '</div>' +
            '<div class="info-desc">Ubicación encontrada en Medellín</div>' +
            '<a class="info-btn" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(data.searchResultTitle + ', Medellín') + '" target="_blank" rel="noopener">' +
            '<span>Abrir en Google Maps</span> &rarr;</a>' +
            '</div>';
          infoWindow.setContent(content);
          infoWindow.open(map, searchMarker);
        }
        if (data.userLocation) {
          updateUserLocationMarker(data.userLocation);
        }
      } else if (data.type === 'GEOCODE_SEARCH') {
        try {
          var geocoder = new google.maps.Geocoder();
          var q = data.query || '';
          if (!q.toLowerCase().includes('medell') && !q.toLowerCase().includes('colombia')) {
            q += ', Medellín, Antioquia, Colombia';
          }
          geocoder.geocode({
            address: q,
            componentRestrictions: { country: 'CO' },
            bounds: new google.maps.LatLngBounds(
              new google.maps.LatLng(6.12, -75.67),
              new google.maps.LatLng(6.36, -75.48)
            )
          }, function(results, status) {
            if (status === 'OK' && results && results[0]) {
              var loc = results[0].geometry.location;
              var coords = { lat: loc.lat(), lng: loc.lng() };
              map.panTo(coords);
              map.setZoom(17);

              if (!searchMarker) {
                searchMarker = new google.maps.Marker({
                  map: map,
                  animation: google.maps.Animation.DROP,
                  icon: {
                    path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                    scale: 6,
                    fillColor: '#ef4444',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2
                  }
                });
              }
              searchMarker.setPosition(loc);
              searchMarker.setTitle(results[0].formatted_address);

              var content = '<div class="info-box">' +
                '<div class="info-title" style="color: #ef4444;">📍 ' + results[0].formatted_address + '</div>' +
                '<div class="info-desc">Ubicación encontrada en Medellín</div>' +
                '<a class="info-btn" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(results[0].formatted_address) + '" target="_blank" rel="noopener">' +
                '<span>Abrir en Google Maps</span> &rarr;</a>' +
                '</div>';
              infoWindow.setContent(content);
              infoWindow.open(map, searchMarker);

              window.parent.postMessage({
                type: 'SEARCH_SUCCESS',
                address: results[0].formatted_address,
                coords: coords
              }, '*');
            }
          });
        } catch(e) {
          console.warn('Geocoder error:', e);
        }
      } else if (data.type === 'SET_MAP_TYPE') {
        map.setMapTypeId(data.mapTypeId);
      } else if (data.type === 'SET_TRAFFIC') {
        if (data.enabled) {
          if (!trafficLayer) trafficLayer = new google.maps.TrafficLayer();
          trafficLayer.setMap(map);
        } else {
          if (trafficLayer) trafficLayer.setMap(null);
        }
      }
    });

    function updateUserLocationMarker(coords) {
      if (!userMarker) {
        userMarker = new google.maps.Marker({
          position: coords,
          map: map,
          title: '${userLocTitle}',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: '#2563eb',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3
          }
        });

        userMarker.addListener('click', function() {
          var content = '<div class="info-box">' +
            '<div class="info-title">${userLocTitle}</div>' +
            '<div class="info-desc">${userLocDesc}</div>' +
            '</div>';
          infoWindow.setContent(content);
          infoWindow.open(map, userMarker);
        });
      } else {
        userMarker.setPosition(coords);
      }
    }

    // Start map once script loads with polling fallback
    function tryInitMap(attempts) {
      if (map) return;
      if (window.google && window.google.maps) {
        initMap();
      } else if (attempts < 25) {
        setTimeout(function() { tryInitMap(attempts + 1); }, 120);
      } else {
        window.parent.postMessage({ type: 'MAP_READY' }, '*');
      }
    }

    if (window.google && window.google.maps) {
      initMap();
    } else {
      window.addEventListener('load', function() { tryInitMap(0); });
      tryInitMap(0);
    }
  </script>
</body>
</html>`;
  }, [
    language,
    themeMode,
    isEn,
    currentCoords.lat,
    currentCoords.lng,
    currentZoom,
    trafficEnabled,
    mapTypeId,
    customMarkers
  ]);

  return (
    <div className="w-full space-y-3 font-sans">
      {/* Surrounding Areas Selector Chips (Zonas Aledañas de Medellín) */}
      {showSurroundingSelector && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-200 shrink-0 text-xs flex items-center gap-1.5">
            <SlidersHorizontal size={13} className="text-[#0052cc] dark:text-sky-400" />
            {t('map_zones_label', 'Zonas de Medellín:')}
          </span>

          {MEDELLIN_SURROUNDING_AREAS.map((zone) => {
            const isSelected = selectedZoneId === zone.id;
            const displayName = isEn && zone.nameEn ? zone.nameEn : zone.name;
            const displaySector = isEn && zone.sectorEn ? zone.sectorEn : zone.sector;

            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => handleSelectZone(zone)}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0052cc] text-white font-bold shadow-md ring-2 ring-blue-400/40 scale-102'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                title={`${displayName} (${displaySector})`}
              >
                <MapPin size={12} className={isSelected ? 'text-amber-300' : 'text-slate-400'} />
                <span>{displayName}</span>
                {isSelected && <CheckCircle2 size={12} className="text-emerald-300 ml-0.5" />}
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleResetToMedellin}
            className="px-2.5 py-1.5 rounded-xl bg-slate-200/90 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
            title={t('map_all_medellin', 'Todo Medellín')}
          >
            <RotateCcw size={12} />
            <span>{t('map_all_medellin', 'Todo Medellín')}</span>
          </button>
        </div>
      )}

      {/* Google Maps Container */}
      <div
        id="google-maps-canvas-box"
        className={`relative w-full ${heightClass} rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-md transition-all`}
      >
        {/* Floating Top Left Search Bar */}
        {showSearchBar && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 w-[calc(100%-24px)] sm:w-[420px] max-w-full">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 dark:border-slate-700/80 p-1.5 flex items-center gap-1.5 transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-[#0052cc] dark:text-sky-400 shrink-0">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t(
                  'map_search_placeholder',
                  'Buscar calle o zona en Medellín (ej. El Poblado, Laureles, Av. 80)...'
                )}
                className="flex-1 bg-transparent border-0 outline-none text-xs sm:text-sm text-slate-800 dark:text-white placeholder-slate-400"
              />
              <button
                type="submit"
                id="btn-buscar-mapa-live"
                className="px-3.5 py-1.5 rounded-xl bg-[#0052cc] hover:bg-[#0047b3] text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs flex items-center gap-1.5"
              >
                <Search size={13} />
                <span>{t('map_search_btn', 'Buscar')}</span>
              </button>
            </form>

            {/* Notification Badge */}
            {searchFeedback && (
              <div className="mt-2 bg-[#0052cc] text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg border border-blue-400/50 flex items-center gap-2 animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>{searchFeedback}</span>
              </div>
            )}
          </div>
        )}

        {/* Floating Top Right Controls (Traffic Toggle + Map Types) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex flex-col items-end gap-2">
          {/* Layer and Traffic Buttons */}
          <div className="flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl p-1 shadow-lg border border-slate-200/90 dark:border-slate-700/80">
            <button
              type="button"
              onClick={handleToggleTraffic}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                trafficEnabled
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={
                isEn
                  ? 'Google Maps real-time traffic layer'
                  : 'Capa de tráfico en tiempo real de Google Maps'
              }
            >
              <Car size={13} />
              <span>{t('map_traffic_btn', 'Tráfico')}</span>
            </button>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5" />

            <button
              type="button"
              onClick={() => handleSelectMapType('roadmap')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                mapTypeId === 'roadmap'
                  ? 'bg-[#0052cc] text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isEn ? 'Standard map view' : 'Vista de mapa estándar'}
            >
              {t('map_type_roadmap', 'Mapa')}
            </button>
            <button
              type="button"
              onClick={() => handleSelectMapType('satellite')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                mapTypeId === 'satellite'
                  ? 'bg-[#0052cc] text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isEn ? 'Satellite photographic view' : 'Vista satelital fotográfica'}
            >
              {t('map_type_satellite', 'Satélite')}
            </button>
            <button
              type="button"
              onClick={() => handleSelectMapType('terrain')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                mapTypeId === 'terrain'
                  ? 'bg-[#0052cc] text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isEn ? 'Topographic terrain view' : 'Vista de relieve topográfico'}
            >
              {t('map_type_terrain', 'Relieve')}
            </button>
          </div>
        </div>

        {/* Floating Bottom Left Status Pill */}
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl p-2 px-3 shadow-lg border border-slate-200/90 dark:border-slate-700/80 flex items-center gap-2 max-w-[calc(100%-24px)] text-xs">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-slate-800 dark:text-slate-100 truncate">
            {locationStatus}
          </span>
          {trafficEnabled && (
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-md hidden sm:inline shrink-0">
              {t('map_traffic_live', 'Tráfico en vivo')}
            </span>
          )}
        </div>

        {/* Loading Indicator before iframe executes */}
        {!iframeLoaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-xs transition-opacity">
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0052cc] animate-ping" />
              <span>{t('map_loading', 'Cargando Google Maps en vivo...')}</span>
            </div>
          </div>
        )}

        {/* ============= Isolated Google Maps Iframe with Native Dynamic Language Reload ============= */}
        <iframe
          key={`gmap-frame-${language}-${themeMode}`}
          ref={iframeRef}
          srcDoc={iframeSrcDoc}
          title="Google Maps Medellín Live"
          className="w-full h-full border-0 block bg-slate-100 dark:bg-slate-900"
          loading="lazy"
          allow="geolocation"
        />
      </div>
    </div>
  );
};
