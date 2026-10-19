/**
 * Comprehensive Address & Place Search Engine for Medellín, Antioquia
 * Supports:
 * - Colombian street nomenclature (e.g., "Carrera 45 #12-34", "Calle 10 # 43A-50")
 * - Street intersections (e.g., "Calle 33 con Carrera 65", "San Juan con la 70")
 * - Landmarks, Comunas, Metro stations, corridors, shopping centers, parks, clinics
 * - Parallel geocoding via Photon and Nominatim with strict Medellín bounding box
 * - Multiple candidate disambiguation
 * - Clear Spanish error messages
 */

export interface AddressSearchResult {
  id: string;
  formattedAddress: string;
  coords: { lat: number; lng: number };
  zoom: number;
  sector?: string;
  details?: string;
  source: 'nomenclatura' | 'landmark' | 'photon' | 'nominatim' | 'geocoder';
}

// Bounding box for Medellín & Metropolitan Area
export const MEDELLIN_BBOX = {
  minLat: 6.05,
  maxLat: 6.45,
  minLng: -75.75,
  maxLng: -75.40
};

export function isWithinMedellin(lat: number, lng: number): boolean {
  return (
    lat >= MEDELLIN_BBOX.minLat &&
    lat <= MEDELLIN_BBOX.maxLat &&
    lng >= MEDELLIN_BBOX.minLng &&
    lng <= MEDELLIN_BBOX.maxLng
  );
}

// Comprehensive database of landmarks, metro stations and areas in Medellín
export const MEDELLIN_DIRECTORY: {
  name: string;
  coords: { lat: number; lng: number };
  zoom: number;
  sector: string;
  keywords: string[];
}[] = [
  // Metro Stations (Line A)
  { name: 'Estación Niquía (Metro)', coords: { lat: 6.3375, lng: -75.5458 }, zoom: 17, sector: 'Bello', keywords: ['niquia', 'niquía', 'metro niquia'] },
  { name: 'Estación Bello (Metro)', coords: { lat: 6.3333, lng: -75.5564 }, zoom: 17, sector: 'Bello', keywords: ['metro bello', 'estacion bello'] },
  { name: 'Estación Madera (Metro)', coords: { lat: 6.3167, lng: -75.5608 }, zoom: 17, sector: 'Bello / Castilla', keywords: ['madera', 'metro madera'] },
  { name: 'Estación Acevedo (Metro / Metrocable K & P)', coords: { lat: 6.2997, lng: -75.5583 }, zoom: 17, sector: 'Castilla / Aranjuez', keywords: ['acevedo', 'metro acevedo'] },
  { name: 'Estación Tricentenario (Metro)', coords: { lat: 6.2897, lng: -75.5647 }, zoom: 17, sector: 'Castilla', keywords: ['tricentenario', 'metro tricentenario'] },
  { name: 'Estación Caribe (Terminal Norte)', coords: { lat: 6.2783, lng: -75.5694 }, zoom: 17, sector: 'Castilla', keywords: ['caribe', 'metro caribe', 'terminal norte', 'terminal del norte'] },
  { name: 'Estación Universidad (Metro / UdeA)', coords: { lat: 6.2694, lng: -75.5656 }, zoom: 17, sector: 'Sevilla / Aranjuez', keywords: ['universidad', 'udea', 'universidad de antioquia', 'jardin botanico', 'jardín botánico', 'parque explora'] },
  { name: 'Estación Hospital (Metro / Metrocable)', coords: { lat: 6.2628, lng: -75.5639 }, zoom: 17, sector: 'San Pedro / Sevilla', keywords: ['hospital', 'san vicente', 'clinica leon xiii'] },
  { name: 'Estación Prado (Metro)', coords: { lat: 6.2558, lng: -75.5658 }, zoom: 17, sector: 'Prado Centro', keywords: ['prado', 'metro prado', 'prado centro'] },
  { name: 'Estación Parque Berrío (Metro / Centro)', coords: { lat: 6.2497, lng: -75.5683 }, zoom: 17, sector: 'La Candelaria (Centro)', keywords: ['parque berrio', 'parque berrío', 'plaza botero', 'museo de antioquia', 'palacio de la cultura'] },
  { name: 'Estación San Antonio (Transferencia Metro A & B / Tranvía)', coords: { lat: 6.2472, lng: -75.5694 }, zoom: 17, sector: 'Centro', keywords: ['san antonio', 'metro san antonio', 'plaza san antonio'] },
  { name: 'Estación Alpujarra (Metro / Centro Administrativo)', coords: { lat: 6.2444, lng: -75.5714 }, zoom: 17, sector: 'La Alpujarra', keywords: ['alpujarra', 'la alpujarra', 'gobernacion', 'alcaldia de medellin', 'tribunales'] },
  { name: 'Estación Exposiciones (Metro / Plaza Mayor)', coords: { lat: 6.2375, lng: -75.5744 }, zoom: 17, sector: 'Calle 33', keywords: ['exposiciones', 'metro exposiciones', 'plaza mayor', 'caja de madera'] },
  { name: 'Estación Industriales (Metro / Metroplús)', coords: { lat: 6.2294, lng: -75.5767 }, zoom: 17, sector: 'Guayabal', keywords: ['industriales', 'metro industriales', 'bancolombia sede'] },
  { name: 'Estación Poblado (Metro / Calle 10)', coords: { lat: 6.2119, lng: -75.5778 }, zoom: 17, sector: 'El Poblado', keywords: ['estacion poblado', 'metro poblado', 'calle 10'] },
  { name: 'Estación Aguacatala (Metro / EAFIT Sur)', coords: { lat: 6.1953, lng: -75.5806 }, zoom: 17, sector: 'Aguacatala', keywords: ['aguacatala', 'metro aguacatala', 'eafit sur', 'av las vegas'] },
  { name: 'Estación Ayurá (Metro)', coords: { lat: 6.1839, lng: -75.5858 }, zoom: 17, sector: 'Envigado / Itagüí', keywords: ['ayura', 'ayurá', 'metro ayura'] },
  { name: 'Estación Envigado (Metro / Viva Envigado)', coords: { lat: 6.1739, lng: -75.5925 }, zoom: 17, sector: 'Envigado', keywords: ['metro envigado', 'viva envigado'] },
  { name: 'Estación Itagüí (Metro)', coords: { lat: 6.1644, lng: -75.6028 }, zoom: 17, sector: 'Itagüí', keywords: ['metro itagui', 'estacion itagui', 'mayorca'] },
  { name: 'Estación Sabaneta (Metro)', coords: { lat: 6.1517, lng: -75.6139 }, zoom: 17, sector: 'Sabaneta', keywords: ['metro sabaneta', 'parque sabaneta'] },
  { name: 'Estación La Estrella (Metro Sur)', coords: { lat: 6.1417, lng: -75.6250 }, zoom: 17, sector: 'La Estrella', keywords: ['la estrella', 'metro la estrella'] },

  // Metro Line B
  { name: 'Estación Cisneros (Metro B / Parque de las Luces)', coords: { lat: 6.2483, lng: -75.5742 }, zoom: 17, sector: 'Cisneros', keywords: ['cisneros', 'edificio vasquez', 'edificio carre', 'parque de las luces'] },
  { name: 'Estación Suramericana (Metro B / Colombia)', coords: { lat: 6.2533, lng: -75.5842 }, zoom: 17, sector: 'Suramericana', keywords: ['suramericana', 'metro suramericana', 'calle colombia'] },
  { name: 'Estación Estadio (Metro B / Cra 70)', coords: { lat: 6.2536, lng: -75.5897 }, zoom: 17, sector: 'Estadio / Laureles', keywords: ['estadio', 'metro estadio', 'cra 70', 'carrera 70', 'atanasio girardot', 'complejo deportivo'] },
  { name: 'Estación Floresta (Metro B / La 80)', coords: { lat: 6.2589, lng: -75.5986 }, zoom: 17, sector: 'La Floresta', keywords: ['floresta', 'metro floresta', 'parque de la floresta', 'la 80 con colombia'] },
  { name: 'Estación Santa Lucía (Metro B)', coords: { lat: 6.2561, lng: -75.6053 }, zoom: 17, sector: 'Santa Lucía', keywords: ['santa lucia', 'santa lucía', 'metro santa lucia'] },
  { name: 'Estación San Javier (Metro B / Metrocable J)', coords: { lat: 6.2525, lng: -75.6155 }, zoom: 17, sector: 'Comuna 13 / San Javier', keywords: ['san javier', 'comuna 13', 'escaleras electricas', 'escaleras eléctricas', 'graffitour', 'grafitour'] },

  // Key Landmarks, Universities, Parks & Medical
  { name: 'Parque Lleras (El Poblado)', coords: { lat: 6.2089, lng: -75.5678 }, zoom: 17, sector: 'El Poblado', keywords: ['parque lleras', 'lleras', 'zona rosa poblado'] },
  { name: 'Milla de Oro (Av. El Poblado)', coords: { lat: 6.2008, lng: -75.5728 }, zoom: 17, sector: 'El Poblado', keywords: ['milla de oro', 'san fernando plaza', 'banco de la republica'] },
  { name: 'Universidad EAFIT', coords: { lat: 6.2008, lng: -75.5786 }, zoom: 17, sector: 'El Poblado', keywords: ['eafit', 'universidad eafit'] },
  { name: 'Universidad Pontificia Bolivariana (UPB)', coords: { lat: 6.2425, lng: -75.5906 }, zoom: 17, sector: 'Laureles', keywords: ['upb', 'universidad pontificia bolivariana', 'circular primera', 'nutibara'] },
  { name: 'Universidad Nacional (Sede Medellín)', coords: { lat: 6.2617, lng: -75.5783 }, zoom: 17, sector: 'El Volador / Robledo', keywords: ['universidad nacional', 'unal', 'cerro el volador'] },
  { name: 'Parques del Río Medellín', coords: { lat: 6.2401, lng: -75.5762 }, zoom: 17, sector: 'Conquistadores', keywords: ['parques del rio', 'parques del río', 'autopista sur'] },
  { name: 'Plaza Botero & Museo de Antioquia', coords: { lat: 6.2522, lng: -75.5686 }, zoom: 17, sector: 'Centro', keywords: ['plaza botero', 'esculturas botero', 'museo de antioquia'] },
  { name: 'Parque de los Deseos & Planetario', coords: { lat: 6.2708, lng: -75.5650 }, zoom: 17, sector: 'Sevilla', keywords: ['parque de los deseos', 'planetario', 'casa de la musica'] },
  { name: 'Jardín Botánico Joaquín Antonio Uribe', coords: { lat: 6.2711, lng: -75.5628 }, zoom: 17, sector: 'Aranjuez', keywords: ['jardin botanico', 'jardín botánico', 'orquideorama'] },
  { name: 'Parque Explora', coords: { lat: 6.2714, lng: -75.5658 }, zoom: 17, sector: 'Sevilla', keywords: ['parque explora', 'acuario explora'] },
  { name: 'Pueblito Paisa (Cerro Nutibara)', coords: { lat: 6.2361, lng: -75.5803 }, zoom: 17, sector: 'Cerro Nutibara', keywords: ['pueblito paisa', 'cerro nutibara', 'mirador nutibara'] },
  { name: 'Aeropuerto Olaya Herrera', coords: { lat: 6.2203, lng: -75.5906 }, zoom: 16, sector: 'Guayabal', keywords: ['olaya herrera', 'aeropuerto olaya', 'aeropuerto local'] },
  { name: 'Terminal del Sur', coords: { lat: 6.2133, lng: -75.5889 }, zoom: 17, sector: 'Guayabal', keywords: ['terminal del sur', 'terminal sur'] },
  { name: 'Centro Comercial Santafé Medellín', coords: { lat: 6.1969, lng: -75.5739 }, zoom: 17, sector: 'El Poblado', keywords: ['santafe', 'santafé', 'cc santafe', 'centro comercial santafe'] },
  { name: 'Centro Comercial El Tesoro', coords: { lat: 6.1997, lng: -75.5583 }, zoom: 17, sector: 'El Poblado', keywords: ['el tesoro', 'cc el tesoro', 'parque comercial el tesoro'] },
  { name: 'Centro Comercial Premium Plaza', coords: { lat: 6.2308, lng: -75.5728 }, zoom: 17, sector: 'Calle 30', keywords: ['premium plaza', 'cc premium plaza'] },
  { name: 'Centro Comercial Unicentro Medellín', coords: { lat: 6.2394, lng: -75.5889 }, zoom: 17, sector: 'Laureles', keywords: ['unicentro', 'cc unicentro', 'bolivariana'] },
  { name: 'Centro Comercial Los Molinos', coords: { lat: 6.2333, lng: -75.6033 }, zoom: 17, sector: 'Belén', keywords: ['los molinos', 'cc los molinos', 'calle 30 con 80'] },
  { name: 'Clínica Las Américas', coords: { lat: 6.2178, lng: -75.5986 }, zoom: 17, sector: 'La 80 / Belén', keywords: ['clinica las americas', 'clínica las américas', 'las americas'] },
  { name: 'Hospital Pablo Tobón Uribe', coords: { lat: 6.2758, lng: -75.5897 }, zoom: 17, sector: 'Robledo', keywords: ['pablo tobon', 'hospital pablo tobon'] }
];

/**
 * Parses Colombian street nomenclature with high precision for Medellín's urban coordinate grid
 */
export function parseColombianNomenclature(query: string): AddressSearchResult[] {
  const q = query.trim().toLowerCase();

  // Clean common noise
  const normalized = q
    .replace(/,/g, ' ')
    .replace(/colombia/g, '')
    .replace(/antioquia/g, '')
    .replace(/medell[ií]n/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Pattern 1: Exact address (e.g. "Carrera 45 # 12 - 34" or "Cra 45 #12-34" or "Calle 10 # 43A-50")
  const addressRegex = /(carrera|cra|cr|kra|kr|k|calle|cll|cl|c|circular|circ|diagonal|diag|dg|transversal|transv|tv|avenida|av)\s*([0-9]{1,3})\s*([a-z])?\s*(?:sur|este|norte|oeste)?\s*(?:#|no\.?|n°|num\.?|-|\s+)\s*([0-9]{1,3})\s*([a-z])?\s*(?:sur|este|norte|oeste)?\s*(?:-|\s*#\s*|\s+)\s*([0-9]{1,4})/i;

  const match = normalized.match(addressRegex);
  if (match) {
    const mainType = match[1].toLowerCase();
    const mainNum = parseInt(match[2], 10);
    const mainLetter = match[3] ? match[3].toUpperCase() : '';
    const crossNum = parseInt(match[4], 10);
    const crossLetter = match[5] ? match[5].toUpperCase() : '';
    const doorNum = parseInt(match[6], 10);

    const isMainCarrera = ['carrera', 'cra', 'cr', 'kra', 'kr', 'k', 'transversal', 'transv', 'tv'].some(p => mainType.startsWith(p));
    const isMainCalle = ['calle', 'cll', 'cl', 'c', 'circular', 'circ', 'diagonal', 'diag', 'dg', 'avenida', 'av'].some(p => mainType.startsWith(p));

    let calleVal = 50;
    let craVal = 50;

    if (isMainCarrera) {
      craVal = mainNum;
      calleVal = crossNum;
    } else {
      calleVal = mainNum;
      craVal = crossNum;
    }

    // Door offset in meters (approx 100 door units per block ~ 100 meters)
    const doorOffsetMeters = Math.min(doorNum, 100);
    const latDoorOffset = (doorOffsetMeters / 100) * 0.0008;
    const lngDoorOffset = (doorOffsetMeters / 100) * -0.0008;

    // Linear grid equation calibrated to Medellín:
    // Origin: Calle 50 / Cra 50 ~ (6.2519, -75.5685)
    // Lat: +0.00108 deg per Calle
    // Lng: -0.00109 deg per Carrera
    const calculatedLat = 6.2519 + (calleVal - 50) * 0.00108 + (isMainCarrera ? latDoorOffset : 0);
    const calculatedLng = -75.5685 - (craVal - 50) * 0.00109 + (isMainCalle ? lngDoorOffset : 0);

    if (isWithinMedellin(calculatedLat, calculatedLng)) {
      const mainPrefix = isMainCarrera ? 'Carrera' : 'Calle';
      const crossPrefix = isMainCarrera ? 'Calle' : 'Carrera';
      const formatted = `${mainPrefix} ${mainNum}${mainLetter} #${crossNum}${crossLetter}-${doorNum}, Medellín, Antioquia`;

      // Assign sector for context
      let sector = 'Medellín';
      if (calleVal <= 14) sector = 'El Poblado';
      else if (calleVal <= 24) sector = 'Poblado / Guayabal';
      else if (calleVal <= 35 && craVal >= 65) sector = 'Belén';
      else if (calleVal <= 35) sector = 'Guayabal / San Diego';
      else if (calleVal <= 48 && craVal >= 65) sector = 'Laureles / Estadio';
      else if (calleVal <= 58 && craVal <= 55) sector = 'La Candelaria (Centro)';
      else if (calleVal <= 58 && craVal >= 65) sector = 'Laureles / San Juan';
      else if (craVal >= 75 && calleVal >= 40) sector = 'San Javier / La América';
      else if (calleVal >= 65 && craVal <= 55) sector = 'Aranjuez / Manrique';
      else if (calleVal >= 65 && craVal >= 65) sector = 'Castilla / Robledo';

      return [{
        id: `nom-${calleVal}-${craVal}-${doorNum}`,
        formattedAddress: formatted,
        coords: { lat: calculatedLat, lng: calculatedLng },
        zoom: 18,
        sector,
        details: `Nomenclatura exacta en cuadrícula urbana • Sector ${sector}`,
        source: 'nomenclatura'
      }];
    }
  }

  // Pattern 2: Intersections (e.g. "Calle 33 con Carrera 65" or "Cra 70 con Circular 1")
  const intersectionRegex = /(?:calle|cll|cl|c)\s*(\d+).*?(?:con|y|esquina).*?(?:carrera|cra|cr|kra|kr|k)\s*(\d+)|(?:carrera|cra|cr|kra|kr|k)\s*(\d+).*?(?:con|y|esquina).*?(?:calle|cll|cl|c)\s*(\d+)/i;
  const interMatch = normalized.match(intersectionRegex);
  if (interMatch) {
    let calleNum = 50;
    let craNum = 50;
    if (interMatch[1] && interMatch[2]) {
      calleNum = parseInt(interMatch[1], 10);
      craNum = parseInt(interMatch[2], 10);
    } else if (interMatch[3] && interMatch[4]) {
      craNum = parseInt(interMatch[3], 10);
      calleNum = parseInt(interMatch[4], 10);
    }

    const calculatedLat = 6.2519 + (calleNum - 50) * 0.00108;
    const calculatedLng = -75.5685 - (craNum - 50) * 0.00109;

    if (isWithinMedellin(calculatedLat, calculatedLng)) {
      return [{
        id: `inter-${calleNum}-${craNum}`,
        formattedAddress: `Calle ${calleNum} con Carrera ${craNum}, Medellín, Antioquia`,
        coords: { lat: calculatedLat, lng: calculatedLng },
        zoom: 17,
        details: 'Intersección vial en Medellín',
        source: 'nomenclatura'
      }];
    }
  }

  return [];
}

/**
 * Searches curated landmarks, Metro stations and comunas
 */
export function searchMedellinDirectory(query: string): AddressSearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q || q.length < 2) return [];

  const matches: AddressSearchResult[] = [];

  for (const item of MEDELLIN_DIRECTORY) {
    const isDirectMatch =
      item.name.toLowerCase().includes(q) ||
      item.sector.toLowerCase().includes(q) ||
      item.keywords.some(kw => kw.includes(q) || q.includes(kw));

    if (isDirectMatch) {
      matches.push({
        id: `dir-${item.name.replace(/\s+/g, '-').toLowerCase()}`,
        formattedAddress: `${item.name}, Medellín, Antioquia`,
        coords: item.coords,
        zoom: item.zoom,
        sector: item.sector,
        details: `Lugar de interés en ${item.sector}`,
        source: 'landmark'
      });
    }
  }

  return matches;
}

/**
 * Helper to compute distance in meters
 */
function distanceMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const dLat = (b.lat - a.lat) * 111320;
  const dLng = (b.lng - a.lng) * 40075000 * Math.cos((a.lat * Math.PI) / 180) / 360;
  return Math.sqrt(dLat * dLat + dLng * dLng);
}

/**
 * Multi-Source Geocoder for Medellín with Candidate Gathering
 */
export async function searchMedellinAddresses(rawQuery: string): Promise<AddressSearchResult[]> {
  const query = rawQuery.trim();
  if (!query) return [];

  const candidates: AddressSearchResult[] = [];

  // 1. Direct Colombian Street Nomenclature Parser
  const nomMatches = parseColombianNomenclature(query);
  candidates.push(...nomMatches);

  // 2. Curated Directory Search (Metro, Landmarks, Comunas)
  const dirMatches = searchMedellinDirectory(query);
  candidates.push(...dirMatches);

  // 3. Parallel external geocoding (Photon & Nominatim)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const cleanQuery = query.replace(/[#]/g, ' ');
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(cleanQuery + ' Medellín Antioquia')}&lat=6.2476&lon=-75.5658&limit=5`;
    const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(cleanQuery + ', Medellín, Antioquia, Colombia')}`;

    const [photonRes, nomRes] = await Promise.all([
      fetch(photonUrl, { signal: controller.signal }).then(r => r.json()).catch(() => null),
      fetch(nomUrl, { headers: { 'Accept-Language': 'es' }, signal: controller.signal }).then(r => r.json()).catch(() => null)
    ]);

    clearTimeout(timeoutId);

    // Process Photon
    if (photonRes?.features && Array.isArray(photonRes.features)) {
      for (const feat of photonRes.features) {
        if (feat.geometry?.coordinates) {
          const [lon, lat] = feat.geometry.coordinates;
          if (isWithinMedellin(lat, lon)) {
            const props = feat.properties || {};
            const title = props.name || props.street || query;
            const sector = props.district || props.city || 'Medellín';
            const formatted = `${title}, ${sector}, Medellín, Antioquia`;

            candidates.push({
              id: `photon-${lat.toFixed(4)}-${lon.toFixed(4)}`,
              formattedAddress: formatted,
              coords: { lat, lng: lon },
              zoom: 17,
              sector,
              details: props.city ? `Ubicación en ${props.city}` : 'Resultado georreferenciado',
              source: 'photon'
            });
          }
        }
      }
    }

    // Process Nominatim
    if (nomRes && Array.isArray(nomRes)) {
      for (const item of nomRes) {
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        if (isWithinMedellin(lat, lon)) {
          const cleanDisplay = item.display_name.split(',').slice(0, 3).join(', ');
          candidates.push({
            id: `nom-${lat.toFixed(4)}-${lon.toFixed(4)}`,
            formattedAddress: `${cleanDisplay}, Medellín, Antioquia`,
            coords: { lat, lng: lon },
            zoom: 17,
            details: 'OpenStreetMap Geocoder',
            source: 'nominatim'
          });
        }
      }
    }
  } catch (err) {
    console.warn('Address search external fetch error:', err);
  }

  // Deduplicate candidates that are closer than 40 meters
  const deduplicated: AddressSearchResult[] = [];
  for (const cand of candidates) {
    const isDuplicate = deduplicated.some(
      existing => distanceMeters(existing.coords, cand.coords) < 45
    );
    if (!isDuplicate) {
      deduplicated.push(cand);
    }
  }

  // Prioritize exact nomenclature or exact landmark matches first
  deduplicated.sort((a, b) => {
    if (a.source === 'nomenclatura' && b.source !== 'nomenclatura') return -1;
    if (b.source === 'nomenclatura' && a.source !== 'nomenclatura') return 1;
    if (a.source === 'landmark' && b.source !== 'landmark') return -1;
    if (b.source === 'landmark' && a.source !== 'landmark') return 1;
    return 0;
  });

  return deduplicated.slice(0, 6);
}
