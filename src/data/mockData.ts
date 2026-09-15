import { ExamQuestion, TrafficSign, RoadIncident } from '../types';

export const COLOMBIAN_TRAFFIC_SIGNS_ES: TrafficSign[] = [
  // ===================== REGLAMENTARIAS (SR - Fondo blanco/rojo/azul) =====================
  {
    id: 'sr-01',
    code: 'SR-01',
    name: 'PARE',
    category: 'reglamentaria',
    description: 'Obligación estricta de detener por completo la marcha del vehículo antes de la línea de parada o antes de ingresar a la intersección.',
    meaning: 'El conductor debe detener completamente el vehículo, verificar que no transiten peatones ni otros vehículos con prelación, y solo reiniciar la marcha cuando sea seguro.',
    colombianNorm: 'Art. 109 Ley 769 de 2002 (Código Nacional de Tránsito Terrestre)',
    finePenalty: 'Infracción C.02 - 30 SMDLV + inmovilización si aplica',
    shape: 'octagon',
    bgHex: '#ba1a1a',
    borderHex: '#ffffff',
    iconName: 'OctagonAlert'
  },
  {
    id: 'sr-02',
    code: 'SR-02',
    name: 'CEDA EL PASO',
    category: 'reglamentaria',
    description: 'Obligación de disminuir la velocidad y detenerse si fuere necesario para permitir el paso de vehículos o peatones con prelación.',
    meaning: 'Ceder el paso a los vehículos que circulan por la vía a la cual se aproxima o que ya circulan dentro de la glorieta.',
    colombianNorm: 'Art. 110 Ley 769 de 2002',
    finePenalty: 'Infracción C.03',
    shape: 'triangle',
    bgHex: '#ffffff',
    borderHex: '#ba1a1a',
    iconName: 'TriangleAlert'
  },
  {
    id: 'sr-30-50',
    code: 'SR-30 (50)',
    name: 'VELOCIDAD MÁXIMA 50 KM/H',
    category: 'reglamentaria',
    description: 'Límite máximo general de velocidad permitido en vías urbanas y carreteras municipales de Colombia.',
    meaning: 'Prohibido exceder los 50 km/h según la Ley Julián Esteban. Protege la vida de todos los actores viales en perímetros urbanos.',
    colombianNorm: 'Ley 2251 de 2022 (Ley Julián Esteban) - Art. 106',
    finePenalty: 'Infracción C.29 - Conducir a velocidad superior a la máxima permitida',
    shape: 'circle',
    bgHex: '#ffffff',
    borderHex: '#ba1a1a',
    iconName: 'Gauge'
  },
  {
    id: 'sr-30-30',
    code: 'SR-30 (30)',
    name: 'VELOCIDAD MÁXIMA 30 KM/H (ZONA ESCOLAR / RESIDENCIAL)',
    category: 'reglamentaria',
    description: 'Límite máximo obligatorio en zonas escolares, hospitales, áreas residenciales y centros comerciales.',
    meaning: 'Velocidad reducida obligatoria para garantizar la reacción inmediata y frenado seguro ante el cruce imprevisto de niños o peatones.',
    colombianNorm: 'Ley 2251 de 2022 - Art. 106 parágrafo',
    finePenalty: 'Infracción C.29',
    shape: 'circle',
    bgHex: '#ffffff',
    borderHex: '#ba1a1a',
    iconName: 'Gauge'
  },
  {
    id: 'sr-04',
    code: 'SR-04',
    name: 'PROHIBIDO GIRAR A LA IZQUIERDA',
    category: 'reglamentaria',
    description: 'Prohíbe a los conductores efectuar la maniobra de viraje hacia la izquierda en la intersección.',
    meaning: 'Previene choques de frente o laterales en vías de alto flujo donde no existe fase semafórica exclusiva de giro.',
    colombianNorm: 'Manual de Señalización Vial - Mintransporte',
    finePenalty: 'Infracción C.04',
    shape: 'circle',
    bgHex: '#ffffff',
    borderHex: '#ba1a1a',
    iconName: 'Undo2'
  },
  {
    id: 'sr-06',
    code: 'SR-06',
    name: 'PROHIBIDO GIRAR EN U',
    category: 'reglamentaria',
    description: 'Prohibición absoluta de realizar retorno o vuelta en 180 grados en la calzada.',
    meaning: 'Evita bloqueos de carril y situaciones de alto riesgo en corredores de alta velocidad o cruces angostos.',
    colombianNorm: 'Manual de Señalización Vial - Mintransporte',
    finePenalty: 'Infracción C.05',
    shape: 'circle',
    bgHex: '#ffffff',
    borderHex: '#ba1a1a',
    iconName: 'RotateCcw'
  },
  {
    id: 'sr-26',
    code: 'SR-26',
    name: 'PROHIBIDO PARQUEAR O ESTACIONAR',
    category: 'reglamentaria',
    description: 'Prohíbe estacionar el vehículo en el tramo de vía indicado.',
    meaning: 'El conductor no puede dejar el vehículo desatendido ni inmovilizado en la calzada o andén.',
    colombianNorm: 'Art. 112 Ley 769 de 2002',
    finePenalty: 'Infracción C.02 - Inmovilización con grúa',
    shape: 'circle',
    bgHex: '#ffffff',
    borderHex: '#ba1a1a',
    iconName: 'Ban'
  },
  {
    id: 'sr-28',
    code: 'SR-28',
    name: 'PROHIBIDO ADELANTAR',
    category: 'reglamentaria',
    description: 'Prohíbe la maniobra de adelantar a otro vehículo ocupando el carril de sentido contrario.',
    meaning: 'Señalizada en curvas, puentes, túneles, pasos a nivel y tramos con visibilidad reducida.',
    colombianNorm: 'Art. 73 Ley 769 de 2002',
    finePenalty: 'Infracción D.06 - Adelantar en sitios prohibidos',
    shape: 'circle',
    bgHex: '#ffffff',
    borderHex: '#ba1a1a',
    iconName: 'Car'
  },
  {
    id: 'sr-42',
    code: 'SR-42',
    name: 'CIRCULACIÓN EN GLORIETA (ROTONDA)',
    category: 'reglamentaria',
    description: 'Indica la obligación de circular en torno a la rotonda o glorieta en el sentido de las flechas (antihorario en Colombia).',
    meaning: 'Todo vehículo que ya se encuentra en el anillo circular tiene prelación de paso sobre el que va a ingresar.',
    colombianNorm: 'Art. 70 Ley 769 de 2002',
    finePenalty: 'Infracción C.03',
    shape: 'circle',
    bgHex: '#0052cc',
    borderHex: '#ffffff',
    iconName: 'RefreshCw'
  },
  {
    id: 'sr-38',
    code: 'SR-38',
    name: 'SENTIDO ÚNICO DE CIRCULACIÓN',
    category: 'reglamentaria',
    description: 'Indica la dirección obligatoria del flujo vehicular en la vía.',
    meaning: 'Prohibido transitar en contravía bajo ninguna circunstancia.',
    colombianNorm: 'Art. 109 Ley 769 de 2002',
    finePenalty: 'Infracción D.03 - Transitar en sentido contrario',
    shape: 'rectangle',
    bgHex: '#101c2d',
    borderHex: '#ffffff',
    iconName: 'ArrowRight'
  },

  // ===================== PREVENTIVAS (SP - Fondo amarillo / Rombo) =====================
  {
    id: 'sp-01',
    code: 'SP-01',
    name: 'CURVA PELIGROSA A LA DERECHA',
    category: 'preventiva',
    description: 'Advierte la proximidad de una curva pronunciada hacia la derecha.',
    meaning: 'Reduzca la velocidad antes de iniciar el trazado de la curva y conserve su carril sin invadir la calzada opuesta.',
    colombianNorm: 'Manual de Señalización Vial de Colombia',
    shape: 'diamond',
    bgHex: '#ffb703',
    borderHex: '#101c2d',
    iconName: 'CornerUpRight'
  },
  {
    id: 'sp-23',
    code: 'SP-23',
    name: 'RESALTO / REDUCTOR DE VELOCIDAD',
    category: 'preventiva',
    description: 'Advierte la proximidad de un reductor de velocidad en la vía.',
    meaning: 'Disminuir la velocidad a menos de 20 km/h para evitar pérdida de control y proteger la suspensión del vehículo.',
    colombianNorm: 'Manual de Señalización Vial - INVÍAS',
    shape: 'diamond',
    bgHex: '#ffb703',
    borderHex: '#101c2d',
    iconName: 'Activity'
  },
  {
    id: 'sp-33',
    code: 'SP-33',
    name: 'ZONA ESCOLAR',
    category: 'preventiva',
    description: 'Advierte la cercanía de colegios, escuelas o centros educativos.',
    meaning: 'Disminuya la velocidad a un máximo de 30 km/h y preste especial atención a niños cruzando la calle.',
    colombianNorm: 'Ley 769 de 2002 y Ley 2251 de 2022',
    shape: 'diamond',
    bgHex: '#ffb703',
    borderHex: '#101c2d',
    iconName: 'School'
  },
  {
    id: 'sp-39',
    code: 'SP-39',
    name: 'ZONA DE CICLISTAS',
    category: 'preventiva',
    description: 'Advierte la presencia habitual de ciclistas en la calzada o cruce de ciclorruta.',
    meaning: 'Conduzca con precaución y conserve la distancia obligatoria de 1.5 metros al rebasar a cualquier ciclista.',
    colombianNorm: 'Ley 1811 de 2016 (Ley Pro-Bici en Colombia)',
    shape: 'diamond',
    bgHex: '#ffb703',
    borderHex: '#101c2d',
    iconName: 'Bike'
  },
  {
    id: 'sp-46',
    code: 'SP-46',
    name: 'SEMÁFORO PRÓXIMO',
    category: 'preventiva',
    description: 'Advierte la aproximación a una intersección regulada por semáforos.',
    meaning: 'Prepárese para desacelerar y respetar la señal de detención luminosa.',
    colombianNorm: 'Manual de Señalización Vial de Colombia',
    shape: 'diamond',
    bgHex: '#ffb703',
    borderHex: '#101c2d',
    iconName: 'SlidersVertical'
  },
  {
    id: 'sp-55',
    code: 'SP-55',
    name: 'SUPERFICIE DESLIZANTE',
    category: 'preventiva',
    description: 'Advierte un tramo de pavimento que puede tornarse resbaloso por lluvia, humedad o asfalto pulido.',
    meaning: 'Evite maniobras bruscas de aceleración o frenado y aumente la distancia de seguimiento.',
    colombianNorm: 'Manual de Señalización Vial de Colombia',
    shape: 'diamond',
    bgHex: '#ffb703',
    borderHex: '#101c2d',
    iconName: 'ShieldAlert'
  },

  // ===================== INFORMATIVAS (SI - Fondo azul / Rectángulo) =====================
  {
    id: 'si-01',
    code: 'SI-01',
    name: 'PUESTO DE PRIMEROS AUXILIOS / HOSPITAL',
    category: 'informativa',
    description: 'Indica la ubicación o cercanía de un hospital, clínica o centro de atención médica de urgencias.',
    meaning: 'Guía de asistencia para emergencias médicas en la vía.',
    colombianNorm: 'Manual de Señalización Vial de Colombia',
    shape: 'rectangle',
    bgHex: '#0052cc',
    borderHex: '#ffffff',
    iconName: 'HeartPulse'
  },
  {
    id: 'si-02',
    code: 'SI-02',
    name: 'ESTACIÓN DE SERVICIO (COMBUSTIBLE)',
    category: 'informativa',
    description: 'Indica la proximidad de una estación de combustible y aprovisionamiento.',
    meaning: 'Facilita el repostaje de combustible y servicios conexos.',
    colombianNorm: 'Manual de Señalización Vial de Colombia',
    shape: 'rectangle',
    bgHex: '#0052cc',
    borderHex: '#ffffff',
    iconName: 'Fuel'
  },
  {
    id: 'si-10',
    code: 'SI-10',
    name: 'ESTACIONAMIENTO PERMITIDO (PARQUEADERO)',
    category: 'informativa',
    description: 'Indica un lugar debidamente autorizado y habilitado para el parqueo de vehículos.',
    meaning: 'Área segura de estacionamiento donde no se generan comparendos ni bloqueo de calzada.',
    colombianNorm: 'Manual de Señalización Vial de Colombia',
    shape: 'rectangle',
    bgHex: '#0052cc',
    borderHex: '#ffffff',
    iconName: 'ParkingCircle'
  },
  {
    id: 'si-24',
    code: 'SI-24',
    name: 'CICLORRUTA / CICLOVÍA',
    category: 'informativa',
    description: 'Indica el trazado de una vía exclusiva o preferente para bicicletas.',
    meaning: 'Espacio protegido para la movilidad en dos ruedas sin emisión de carbono.',
    colombianNorm: 'Ley 1811 de 2016 y Manual Mintransporte',
    shape: 'rectangle',
    bgHex: '#006476',
    borderHex: '#ffffff',
    iconName: 'Bike'
  },

  // ===================== TRANSITORIAS (ST - Fondo naranja / Rombo) =====================
  {
    id: 'st-01',
    code: 'ST-01',
    name: 'TRABAJOS EN LA VÍA (OBRAS)',
    category: 'transitoria',
    description: 'Advierte la presencia de obreros, maquinaria y labores de mantenimiento sobre la vía.',
    meaning: 'Reduzca drásticamente la velocidad, atienda las órdenes del personal de obra y esté atento a desvíos.',
    colombianNorm: 'Capítulo 4 Manual de Señalización Vial de Colombia',
    shape: 'diamond',
    bgHex: '#f77f00',
    borderHex: '#101c2d',
    iconName: 'HardHat'
  },
  {
    id: 'st-04',
    code: 'ST-04',
    name: 'BANDERILLERO',
    category: 'transitoria',
    description: 'Advierte la presencia de un operador de tránsito con bandera roja o paleta PARE/SIGA en la zona de obra.',
    meaning: 'Sus indicaciones son de estricto cumplimiento y tienen prevalencia sobre las demás señales.',
    colombianNorm: 'Manual de Señalización Vial de Colombia',
    shape: 'diamond',
    bgHex: '#f77f00',
    borderHex: '#101c2d',
    iconName: 'Flag'
  }
];

export const COLOMBIAN_TRAFFIC_SIGNS_EN: TrafficSign[] = [
  // ===================== REGULATORY (SR) =====================
  {
    id: 'sr-01',
    code: 'SR-01',
    name: 'STOP (PARE)',
    category: 'reglamentaria',
    description: 'Strict obligation to come to a complete stop before the stop line or intersection entry.',
    meaning: 'Drivers must come to a complete stop, yield to pedestrians and vehicles with right of way, and proceed only when safe.',
    colombianNorm: 'Art. 109 Law 769 of 2002 (National Ground Traffic Code)',
    finePenalty: 'Ticket C.02 - 30 SMDLV + vehicle impoundment if applicable',
    shape: 'octagon',
    bgHex: '#ba1a1a',
    borderHex: '#ffffff',
    iconName: 'OctagonAlert'
  },
  {
    id: 'sr-02',
    code: 'SR-02',
    name: 'YIELD (CEDA EL PASO)',
    category: 'reglamentaria',
    description: 'Obligation to slow down and stop if necessary to allow passage for vehicles or pedestrians with priority.',
    meaning: 'Yield to traffic already traveling on the roadway you are entering or inside a roundabout.',
    colombianNorm: 'Art. 110 Law 769 of 2002',
    finePenalty: 'Ticket C.03',
    shape: 'triangle',
    bgHex: '#ffffff',
    borderHex: '#ba1a1a',
    iconName: 'TriangleAlert'
  },
  {
    id: 'sr-30-50',
    code: 'SR-30 (50)',
    name: 'MAXIMUM SPEED 50 KM/H',
    category: 'reglamentaria',
    description: 'General maximum speed limit on urban streets and municipal roads in Colombia.',
    meaning: 'Exceeding 50 km/h is prohibited under the Julian Esteban Law to safeguard lives in urban areas.',
    colombianNorm: 'Law 2251 of 2022 (Julian Esteban Law) - Art. 106',
    finePenalty: 'Ticket C.29 - Driving above the maximum allowed speed',
    shape: 'circle',
    bgHex: '#ffffff',
    borderHex: '#ba1a1a',
    iconName: 'Gauge'
  },
  {
    id: 'sr-30-30',
    code: 'SR-30 (30)',
    name: 'MAXIMUM SPEED 30 KM/H (SCHOOL / RESIDENTIAL)',
    category: 'reglamentaria',
    description: 'Mandatory speed limit in school zones, hospital perimeters, residential neighborhoods, and shopping hubs.',
    meaning: 'Reduced speed mandatory to ensure prompt reaction and safe stopping distance for children and pedestrians.',
    colombianNorm: 'Law 2251 of 2022 - Art. 106 paragraph',
    finePenalty: 'Ticket C.29',
    shape: 'circle',
    bgHex: '#ffffff',
    borderHex: '#ba1a1a',
    iconName: 'Gauge'
  },
  {
    id: 'sr-04',
    code: 'SR-04',
    name: 'NO LEFT TURN',
    category: 'reglamentaria',
    description: 'Prohibits drivers from making a left turn at the intersection.',
    meaning: 'Prevents head-on and t-bone collisions on high-traffic corridors lacking dedicated left-turn light phases.',
    colombianNorm: 'Road Sign Manual - Ministry of Transport',
    finePenalty: 'Ticket C.04',
    shape: 'circle',
    bgHex: '#ffffff',
    borderHex: '#ba1a1a',
    iconName: 'Undo2'
  },
  {
    id: 'sr-06',
    code: 'SR-06',
    name: 'NO U-TURN',
    category: 'reglamentaria',
    description: 'Strict prohibition of reversing direction via a 180-degree turn.',
    meaning: 'Prevents lane blockages and dangerous conflict points on high-speed roads or tight intersections.',
    colombianNorm: 'Road Sign Manual - Ministry of Transport',
    finePenalty: 'Ticket C.05',
    shape: 'circle',
    bgHex: '#ffffff',
    borderHex: '#ba1a1a',
    iconName: 'RotateCcw'
  },
  {
    id: 'sr-26',
    code: 'SR-26',
    name: 'NO PARKING',
    category: 'reglamentaria',
    description: 'Prohibits parking any vehicle along the designated roadway segment.',
    meaning: 'Drivers cannot leave vehicles unattended or stopped on the travel lane or sidewalk.',
    colombianNorm: 'Art. 112 Law 769 of 2002',
    finePenalty: 'Ticket C.02 - Tow truck impoundment',
    shape: 'circle',
    bgHex: '#ffffff',
    borderHex: '#ba1a1a',
    iconName: 'Ban'
  },
  {
    id: 'sr-28',
    code: 'SR-28',
    name: 'NO OVERTAKING',
    category: 'reglamentaria',
    description: 'Prohibits overtaking another vehicle by entering oncoming traffic lanes.',
    meaning: 'Installed on curves, bridges, tunnels, railway crossings, and low-visibility road sections.',
    colombianNorm: 'Art. 73 Law 769 of 2002',
    finePenalty: 'Ticket D.06 - Overtaking in prohibited areas',
    shape: 'circle',
    bgHex: '#ffffff',
    borderHex: '#ba1a1a',
    iconName: 'Car'
  },
  {
    id: 'sr-42',
    code: 'SR-42',
    name: 'ROUNDABOUT CIRCULATION',
    category: 'reglamentaria',
    description: 'Indicates mandatory one-way circulation around a roundabout in the direction of the arrows (counterclockwise).',
    meaning: 'Vehicles already circulating inside the rotary ring hold right-of-way over vehicles wishing to enter.',
    colombianNorm: 'Art. 70 Law 769 of 2002',
    finePenalty: 'Ticket C.03',
    shape: 'circle',
    bgHex: '#0052cc',
    borderHex: '#ffffff',
    iconName: 'RefreshCw'
  },
  {
    id: 'sr-38',
    code: 'SR-38',
    name: 'ONE-WAY TRAFFIC',
    category: 'reglamentaria',
    description: 'Indicates mandatory traffic flow direction on the road.',
    meaning: 'Driving against the flow of traffic is strictly prohibited.',
    colombianNorm: 'Art. 109 Law 769 of 2002',
    finePenalty: 'Ticket D.03 - Driving in the opposite direction',
    shape: 'rectangle',
    bgHex: '#101c2d',
    borderHex: '#ffffff',
    iconName: 'ArrowRight'
  },

  // ===================== WARNING / PREVENTIVE (SP) =====================
  {
    id: 'sp-01',
    code: 'SP-01',
    name: 'SHARP RIGHT CURVE',
    category: 'preventiva',
    description: 'Alerts drivers to an approaching sharp right bend.',
    meaning: 'Reduce speed before entering the curve and maintain lane discipline without crossing into oncoming traffic.',
    colombianNorm: 'Colombian Road Sign Manual',
    shape: 'diamond',
    bgHex: '#ffb703',
    borderHex: '#101c2d',
    iconName: 'CornerUpRight'
  },
  {
    id: 'sp-23',
    code: 'SP-23',
    name: 'SPEED BUMP / SPEED REDUCER',
    category: 'preventiva',
    description: 'Warns of a speed hump or physical speed reducer ahead.',
    meaning: 'Slow down to below 20 km/h to maintain vehicle control and protect vehicle suspension.',
    colombianNorm: 'Road Sign Manual - INVIAS',
    shape: 'diamond',
    bgHex: '#ffb703',
    borderHex: '#101c2d',
    iconName: 'Activity'
  },
  {
    id: 'sp-33',
    code: 'SP-33',
    name: 'SCHOOL ZONE',
    category: 'preventiva',
    description: 'Warns of proximity to schools, colleges, or educational campuses.',
    meaning: 'Slow down to at most 30 km/h and watch closely for children crossing the road.',
    colombianNorm: 'Law 769 of 2002 & Law 2251 of 2022',
    shape: 'diamond',
    bgHex: '#ffb703',
    borderHex: '#101c2d',
    iconName: 'School'
  },
  {
    id: 'sp-39',
    code: 'SP-39',
    name: 'BICYCLE ZONE',
    category: 'preventiva',
    description: 'Warns of regular cyclists on the road or bike lane crossings.',
    meaning: 'Drive with caution and uphold the mandatory 1.5-meter minimum lateral clearance when overtaking any cyclist.',
    colombianNorm: 'Law 1811 of 2016 (Pro-Bike Law in Colombia)',
    shape: 'diamond',
    bgHex: '#ffb703',
    borderHex: '#101c2d',
    iconName: 'Bike'
  },
  {
    id: 'sp-46',
    code: 'SP-46',
    name: 'TRAFFIC SIGNAL AHEAD',
    category: 'preventiva',
    description: 'Alerts of an approaching traffic light controlled intersection.',
    meaning: 'Be prepared to decelerate and obey the stoplight signals.',
    colombianNorm: 'Colombian Road Sign Manual',
    shape: 'diamond',
    bgHex: '#ffb703',
    borderHex: '#101c2d',
    iconName: 'SlidersVertical'
  },
  {
    id: 'sp-55',
    code: 'SP-55',
    name: 'SLIPPERY ROAD SURFACE',
    category: 'preventiva',
    description: 'Warns of road pavement that can become slippery due to rain, moisture, or polished asphalt.',
    meaning: 'Avoid sudden acceleration or hard braking and increase your following distance.',
    colombianNorm: 'Colombian Road Sign Manual',
    shape: 'diamond',
    bgHex: '#ffb703',
    borderHex: '#101c2d',
    iconName: 'ShieldAlert'
  },

  // ===================== INFORMATIVE (SI) =====================
  {
    id: 'si-01',
    code: 'SI-01',
    name: 'FIRST AID STATION / HOSPITAL',
    category: 'informativa',
    description: 'Indicates the location or proximity of a hospital or emergency clinic.',
    meaning: 'Assistance guide for roadside medical emergencies.',
    colombianNorm: 'Colombian Road Sign Manual',
    shape: 'rectangle',
    bgHex: '#0052cc',
    borderHex: '#ffffff',
    iconName: 'HeartPulse'
  },
  {
    id: 'si-02',
    code: 'SI-02',
    name: 'SERVICE STATION (FUEL)',
    category: 'informativa',
    description: 'Indicates proximity to a fuel station and provisioning service.',
    meaning: 'Convenient refueling and vehicle care.',
    colombianNorm: 'Colombian Road Sign Manual',
    shape: 'rectangle',
    bgHex: '#0052cc',
    borderHex: '#ffffff',
    iconName: 'Fuel'
  },
  {
    id: 'si-10',
    code: 'SI-10',
    name: 'PARKING AREA PERMITTED',
    category: 'informativa',
    description: 'Indicates a legally authorized and designated area for vehicle parking.',
    meaning: 'Safe parking spot that will not incur tickets or obstruct roadway flow.',
    colombianNorm: 'Colombian Road Sign Manual',
    shape: 'rectangle',
    bgHex: '#0052cc',
    borderHex: '#ffffff',
    iconName: 'ParkingCircle'
  },
  {
    id: 'si-24',
    code: 'SI-24',
    name: 'BIKEWAY / CYCLE ROUTE',
    category: 'informativa',
    description: 'Indicates an exclusive or designated path for bicycles.',
    meaning: 'Protected space for zero-emission two-wheeled urban mobility.',
    colombianNorm: 'Law 1811 of 2016 and Ministry of Transport Manual',
    shape: 'rectangle',
    bgHex: '#006476',
    borderHex: '#ffffff',
    iconName: 'Bike'
  },

  // ===================== TEMPORARY WORK (ST) =====================
  {
    id: 'st-01',
    code: 'ST-01',
    name: 'ROADWORKS AHEAD',
    category: 'transitoria',
    description: 'Warns of road crews, heavy equipment, and active maintenance on the roadway.',
    meaning: 'Significantly reduce speed, obey road crew instructions, and watch for detours.',
    colombianNorm: 'Chapter 4 Colombian Road Sign Manual',
    shape: 'diamond',
    bgHex: '#f77f00',
    borderHex: '#101c2d',
    iconName: 'HardHat'
  },
  {
    id: 'st-04',
    code: 'ST-04',
    name: 'FLAGGER AHEAD',
    category: 'transitoria',
    description: 'Warns of a traffic controller with a flag or STOP/SLOW paddle in the work zone.',
    meaning: 'Flagger instructions are mandatory and override general road signs.',
    colombianNorm: 'Colombian Road Sign Manual',
    shape: 'diamond',
    bgHex: '#f77f00',
    borderHex: '#101c2d',
    iconName: 'Flag'
  }
];

export const COLOMBIAN_TRAFFIC_SIGNS = COLOMBIAN_TRAFFIC_SIGNS_ES;

export function getTrafficSigns(language?: string): TrafficSign[] {
  if (language === 'en') {
    return COLOMBIAN_TRAFFIC_SIGNS_EN;
  }
  return COLOMBIAN_TRAFFIC_SIGNS_ES;
}

export const COLOMBIAN_EXAM_QUESTIONS_ES: ExamQuestion[] = [
  {
    id: 1,
    category: 'Límites de Velocidad (Ley 2251 de 2022)',
    licenseCategory: 'todas',
    question: 'En Colombia, de acuerdo con la Ley 2251 de 2022 (Ley Julián Esteban), ¿cuál es el límite máximo de velocidad en vías urbanas y carreteras municipales?',
    options: [
      '60 km/h para autos y 50 km/h para motos.',
      '50 km/h de manera general (salvo señalización expresa que fije un límite menor).',
      '70 km/h en avenidas principales.',
      '80 km/h si no hay tráfico pesado.'
    ],
    correctIndex: 1,
    explanation: 'La Ley 2251 de 2022 unificó y redujo la velocidad máxima en zonas urbanas a 50 km/h para reducir la severidad de los siniestros viales.',
    legalReference: 'Art. 106 Ley 769 de 2002 modificado por Ley 2251 de 2022'
  },
  {
    id: 2,
    category: 'Zonas Especiales de Protección',
    licenseCategory: 'todas',
    question: '¿Cuál es la velocidad máxima permitida en Colombia en zonas escolares, residenciales y de hospitales durante sus horarios de actividad?',
    options: [
      '40 km/h',
      '30 km/h',
      '20 km/h',
      '50 km/h con luces estacionarias'
    ],
    correctIndex: 1,
    explanation: 'El Código Nacional de Tránsito y la Ley 2251 establecen un límite máximo de 30 km/h en zonas escolares y residenciales.',
    legalReference: 'Art. 106 Parágrafo - Ley 769 de 2002'
  },
  {
    id: 3,
    category: 'Prelación de Paso en Glorietas (Rotondas)',
    licenseCategory: 'todas',
    question: 'Al llegar a una glorieta o rotonda en Colombia, ¿quién tiene la prelación de paso?',
    options: [
      'El vehículo que pretende entrar a la glorieta por la derecha.',
      'El vehículo que ya circula dentro de la glorieta.',
      'El vehículo de mayor cilindraje o transporte pesado.',
      'El vehículo que accione primero las luces de emergencia.'
    ],
    correctIndex: 1,
    explanation: 'El Artículo 70 de la Ley 769 de 2002 establece que en una glorieta, el vehículo que transita dentro de ella tiene prelación sobre el que intenta ingresar.',
    legalReference: 'Art. 70 Ley 769 de 2002'
  },
  {
    id: 4,
    category: 'Convivencia con Ciclistas (Ley 1811 de 2016)',
    licenseCategory: 'todas',
    question: 'Al adelantar a un ciclista en una vía colombiana, ¿cuál es la distancia lateral mínima obligatoria que debe mantener el conductor?',
    options: [
      '0.8 metros',
      '1.0 metro',
      '1.5 metros de separación lateral',
      '2.5 metros en carretera destapada'
    ],
    correctIndex: 2,
    explanation: 'La Ley 1811 de 2016 obliga a todo conductor a respetar una distancia lateral mínima de 1.5 metros para salvaguardar la vida del ciclista.',
    legalReference: 'Ley 1811 de 2016 (Ley Pro-Bici Colombia)'
  },
  {
    id: 5,
    category: 'Seguridad en Motocicletas (Resolución 23385 de 2020)',
    licenseCategory: 'A2',
    question: 'En Colombia, el uso del casco protector para motociclistas exige que:',
    options: [
      'Solo se use en carreteras nacionales.',
      'La cabeza esté totalmente inmersa en el casco, el sistema de retención esté abrochado bajo la mandíbula y no se use el celular dentro del casco.',
      'Se puede llevar desabrochado a menos de 30 km/h.',
      'Solo es obligatorio para el conductor y no para el acompañante.'
    ],
    correctIndex: 1,
    explanation: 'La Resolución 23385 de 2020 del Ministerio de Transporte reglamenta las condiciones obligatorias de uso seguro y abrochado del casco reglamentario certificado.',
    legalReference: 'Resolución 23385 de 2020 - Mintransporte'
  },
  {
    id: 6,
    category: 'Normativa de Alcoholemia (Ley 1696 de 2013)',
    licenseCategory: 'todas',
    question: 'En Colombia, la Ley 1696 de 2013 frente a la conducción bajo el efecto del alcohol establece:',
    options: [
      'Se permite hasta 0.5 gramos de alcohol sin sanción.',
      'Cero tolerancia: desde Grado Cero (20-39 mg/100ml) se aplican multas millonarias, suspensión de licencia e inmovilización.',
      'Solo se sanciona si ocurre un accidente.',
      'La sanción solo es pedagógica para conductores particulares.'
    ],
    correctIndex: 1,
    explanation: 'Colombia tiene una de las leyes de alcoholemia más estrictas de la región: el Grado 0 ya genera suspensión de licencia de 1 año e inmovilización.',
    legalReference: 'Ley 1696 de 2013'
  },
  {
    id: 7,
    category: 'Documentación Obligatoria en Vía',
    licenseCategory: 'todas',
    question: '¿Cuáles son los 4 documentos obligatorios que debe portar o tener vigentes en el RUNT todo conductor en Colombia?',
    options: [
      'Cédula, Pasaporte, Carné de Vacunación y Factura de compra.',
      'Licencia de Conducción, Licencia de Tránsito (Tarjeta de Propiedad), SOAT vigente y Certificado de Revisión Técnico-Mecánica.',
      'Solo la Licencia de Conducción.',
      'Tarjeta de crédito y póliza todo riesgo únicamente.'
    ],
    correctIndex: 1,
    explanation: 'La Ley 769 de 2002 exige Licencia de Conducción, Tarjeta de Propiedad, SOAT y Técnico-Mecánica vigentes en la plataforma RUNT.',
    legalReference: 'Art. 34 y 42 Ley 769 de 2002'
  },
  {
    id: 8,
    category: 'Prelación en Intersecciones no Señalizadas',
    licenseCategory: 'todas',
    question: 'En un cruce o intersección donde no hay semáforos ni señales de PARE o Ceda el Paso, ¿qué vehículo tiene la prelación?',
    options: [
      'El vehículo que circula a mayor velocidad.',
      'El vehículo que se aproxima por la derecha del otro conductor.',
      'El vehículo más pesado o de servicio público.',
      'El vehículo que hace sonar la bocina.'
    ],
    correctIndex: 1,
    explanation: 'En intersecciones no reguladas, la prelación pertenece al vehículo que transita por la derecha.',
    legalReference: 'Art. 70 Ley 769 de 2002'
  },
  {
    id: 9,
    category: 'Maniobra de Adelantamiento y Demarcación',
    licenseCategory: 'todas',
    question: 'Según el Artículo 73 del Código Nacional de Tránsito, ¿en cuál de las siguientes situaciones está ESTRICTAMENTE PROHIBIDO adelantar a otro vehículo?',
    options: [
      'En vías rectas con visibilidad despejada y línea blanca discontinua.',
      'En curvas pronunciadas, pendientes, túneles, pasos a nivel y puentes angostos.',
      'En autopistas de calzadas separadas con más de dos carriles por sentido.',
      'A vehículos que transitan a menos de 30 km/h en calzada plana.'
    ],
    correctIndex: 1,
    explanation: 'El Art. 73 prohíbe adelantar en curvas, cimas de pendientes, pasos a nivel, túneles, puentes y cuando haya línea continua central.',
    legalReference: 'Art. 73 Ley 769 de 2002',
    signCode: 'SR-28',
    signType: 'sr-28'
  },
  {
    id: 10,
    category: 'Conducción en Descenso y Freno de Motor',
    licenseCategory: 'todas',
    question: 'Al enfrentar una bajada o pendiente pronunciada en carretera (señalizada con SP-40), ¿cuál es la técnica segura recomendada?',
    options: [
      'Colocar la palanca de cambios en neutro ("rodada") para ahorrar combustible.',
      'Engranar una marcha baja y utilizar el freno de motor para no recalentar ni cristalizar los frenos de servicio.',
      'Mantener el pedal del freno presionado continuamente durante todo el descenso.',
      'Apagar el motor para enfriar el vehículo.'
    ],
    correctIndex: 1,
    explanation: 'El uso del freno de motor en marcha baja previene el recalentamiento de pastillas y la pérdida total de frenos (fading). Transitar en neutro está prohibido por el Art. 74.',
    legalReference: 'Art. 74 Ley 769 de 2002 y Manual de Conducción Defensiva',
    signCode: 'SP-40',
    signType: 'sp-40'
  },
  {
    id: 11,
    category: 'Protocolo de Emergencia PAS ante Siniestros',
    licenseCategory: 'todas',
    question: 'Si eres el primer conductor en presenciar un siniestro vial con heridos en carretera, ¿cuál es el orden correcto del protocolo internacional PAS?',
    options: [
      'Pelear, Acelerar, Salir.',
      'Proteger la zona (señalizar con conos/luces), Avisar a la línea de emergencias 123/#767, y Socorrer a las víctimas sin mover sus cuellos.',
      'Mover a los heridos inmediatamente sin asegurar la vía.',
      'Tomar fotos para redes sociales antes de avisar a las autoridades.'
    ],
    correctIndex: 1,
    explanation: 'El protocolo PAS (Proteger, Avisar, Socorrer) es la norma técnica de primeros auxilios viales para evitar nuevos choques en cadena y preservar vidas.',
    legalReference: 'Guía de Atención a Víctimas de Siniestros Viales - ANSV'
  },
  {
    id: 12,
    category: 'Distractores y Telefonía Móvil al Volante',
    licenseCategory: 'todas',
    question: '¿Qué sanción contempla la normativa colombiana para quien manipule dispositivos móviles o celulares mientras conduce?',
    options: [
      'No tiene sanción si se responde un mensaje rápido en un semáforo en rojo.',
      'Infracción C.38: Multa de 15 SMDLV y obligación de curso pedagógico.',
      'Amonestación verbal únicamente.',
      'Solo se sanciona en horarios nocturnos.'
    ],
    correctIndex: 1,
    explanation: 'La infracción C.38 sanciona el uso de celulares o equipos de comunicación sin manos libres mientras se conduce, incluso durante detenciones temporales en semáforos.',
    legalReference: 'Resolución 3027 de 2010 - Código de Infracciones Mintransporte'
  },
  {
    id: 13,
    category: 'Equipo Reglamentario de Prevención y Seguridad',
    licenseCategory: 'todas',
    question: 'De acuerdo con el Artículo 30 de la Ley 769, ¿cuáles elementos componen el equipo de prevención y seguridad obligatorio (kit de carretera)?',
    options: [
      'Solo una llanta de repuesto y linterna.',
      'Gato con capacidad, cruceta, 2 señales reflectivas de peligro (triángulos/conos), botiquín de primeros auxilios, extintor con fecha vigente, 2 tacos y caja de herramientas básica.',
      'Equipo de sonido de alta fidelidad y ambientador.',
      'Cuerda de remolque metálica sin tacos ni extintor.'
    ],
    correctIndex: 1,
    explanation: 'El Art. 30 detalla los 9 elementos mínimos exigibles en cualquier inspección vial por las autoridades de tránsito.',
    legalReference: 'Art. 30 Ley 769 de 2002'
  },
  {
    id: 14,
    category: 'Seguridad Infantil y Transporte de Menores',
    licenseCategory: 'todas',
    question: 'En Colombia, ¿bajo qué condiciones deben viajar los menores de 10 años en vehículos particulares según el Artículo 82?',
    options: [
      'En los brazos del copiloto adulto.',
      'Obligatoriamente en los asientos traseros, y los menores de 2 años en sillas de retención infantil (SRI) adecuadas a su peso y talla.',
      'En el asiento delantero si llevan el cinturón de adulto ajustado.',
      'En el baúl del vehículo si los asientos están ocupados.'
    ],
    correctIndex: 1,
    explanation: 'Por disposición del Art. 82, los menores de 10 años no pueden viajar en el asiento delantero bajo ninguna circunstancia por el riesgo letal del airbag en infantes.',
    legalReference: 'Art. 82 Ley 769 de 2002'
  },
  {
    id: 15,
    category: 'Seguridad en Calzada Mojada e Hidroplaneo',
    licenseCategory: 'todas',
    question: 'El fenómeno de "hidroplaneo" o aquaplaning se produce cuando los neumáticos pierden contacto con el asfalto flotando sobre una película de agua. ¿Qué debe hacer el conductor?',
    options: [
      'Frenar en seco a fondo y girar violentamente el volante.',
      'Mantener la calma, sujetar firmemente el volante en línea recta, desacelerar gradualmente sin frenar bruscamente y esperar que los neumáticos recuperen agarre.',
      'Acelerar para romper la tensión superficial del agua.',
      'Poner reversa inmediatamente.'
    ],
    correctIndex: 1,
    explanation: 'Frenar de golpe o volantear en hidroplaneo provoca trompos incontrolables; se debe soltar el acelerador con suavidad y sostener el volante recto.',
    legalReference: 'Manual de Técnicas de Conducción Defensiva - Mintransporte'
  },
  {
    id: 16,
    category: 'Sistemas Activos de Seguridad: Frenos ABS',
    licenseCategory: 'todas',
    question: '¿Cuál es la función principal del sistema de frenos antibloqueo (ABS) durante una frenada de emergencia extrema?',
    options: [
      'Bloquear las ruedas de inmediato para derrapar sobre la vía.',
      'Evitar que las ruedas se bloqueen, permitiendo al conductor mantener el control de la dirección del vehículo mientras frena.',
      'Aumentar la velocidad del motor para esquivar obstáculos.',
      'Desconectar automáticamente el cinturón de seguridad.'
    ],
    correctIndex: 1,
    explanation: 'El ABS modula la presión hidráulica milésimas de segundo para evitar el bloqueo, conservando la maniobrabilidad del volante durante la desaceleración.',
    legalReference: 'Resolución 3752 de 2015 Mintransporte (Sistemas de Seguridad Vehicular)'
  },
  {
    id: 17,
    category: 'Señales Reglamentarias de Estacionamiento',
    licenseCategory: 'todas',
    question: 'Observa la señal SR-26 (círculo rojo con una "E" atravesada por una barra diagonal roja). ¿Cuál es la diferencia entre "parquear" y "detenerse momentáneamente"?',
    options: [
      'Son exactamente lo mismo según la ley.',
      'Detenerse es la parada momentánea exclusiva para dejar o recoger pasajeros o carga sin abandonar el volante; parquear implica dejar el automotor desatendido.',
      'Parquear es solo de noche; detenerse es solo de día.',
      'La señal permite parquear hasta 2 horas si se encienden luces de parqueo.'
    ],
    correctIndex: 1,
    explanation: 'La señal SR-26 prohíbe el parqueo o estacionamiento. La detención momentánea para descenso de pasajeros no constituye parqueo si el conductor permanece y no obstaculiza.',
    legalReference: 'Art. 112 Ley 769 de 2002',
    signCode: 'SR-26',
    signType: 'sr-26'
  },
  {
    id: 18,
    category: 'Señales Luminosas: Semáforo en Amarillo',
    licenseCategory: 'todas',
    question: '¿Cuál es el significado normativo de la luz amarilla fija en el semáforo según el Artículo 118 del Código de Tránsito?',
    options: [
      'Acelerar a fondo para cruzar antes del rojo.',
      'Aviso de cambio a rojo; el conductor debe detenerse antes de la línea de parada, a menos que la cercanía al cruce haga peligrosa una frenada intempestiva.',
      'Permiso para girar en U sin precaución.',
      'El semáforo está dañado y se puede cruzar a velocidad libre.'
    ],
    correctIndex: 1,
    explanation: 'La luz amarilla advierte la inminencia del color rojo; obliga a la detención segura salvo que el vehículo ya haya ingresado a la intersección.',
    legalReference: 'Art. 118 Ley 769 de 2002'
  },
  {
    id: 19,
    category: 'Distancia de Seguridad entre Vehículos',
    licenseCategory: 'todas',
    question: 'Según el Artículo 108 de la Ley 769, ¿qué criterio temporal o de distancia debe guardar un vehículo respecto del que lo antecede en carretera seca a 60-80 km/h?',
    options: [
      'Pegarse a 1 metro para evitar que se metan otros carros.',
      'Mínimo 25 a 30 metros (equivalente a la regla de los 3 segundos de distancia de reacción y frenado).',
      '5 metros sin importar la velocidad.',
      'No se exige distancia si el carro tiene seguro contra todo riesgo.'
    ],
    correctIndex: 1,
    explanation: 'El Art. 108 establece distancias de seguimiento crecientes con la velocidad para garantizar tiempo suficiente de frenado ante imprevistos.',
    legalReference: 'Art. 108 Ley 769 de 2002'
  },
  {
    id: 20,
    category: 'Revisión Técnico-Mecánica y Emisiones',
    licenseCategory: 'todas',
    question: 'Para un vehículo particular nuevo matriculado en Colombia, ¿a partir de qué año debe realizar su primera Revisión Técnico-Mecánica?',
    options: [
      'A los 10 años de comprado.',
      'Al cumplir el quinto (5°) año contado a partir de la fecha de su matrícula (según la modificación de la Ley 2294 de 2023).',
      'Cada 6 meses desde el primer mes de compra.',
      'Solo si el vehículo bota humo visible.'
    ],
    correctIndex: 1,
    explanation: 'La Ley 2294 de 2023 fijó la primera revisión técnico-mecánica de particulares al quinto año de matrícula, y posteriormente cada año.',
    legalReference: 'Ley 2294 de 2023 y Art. 52 Ley 769 de 2002'
  },
  {
    id: 21,
    category: 'Uso Reglamentario de Luces en Carretera',
    licenseCategory: 'todas',
    question: 'En horas de la noche en carretera nacional, cuando un conductor con luces plenas o altas se aproxima a otro vehículo en sentido contrario a menos de 300 metros, ¿qué debe hacer?',
    options: [
      'Mantener las luces altas para ver mejor.',
      'Efectuar el cambio a luces bajas o medias para evitar deslumbrar o encandilar al otro conductor.',
      'Apagar totalmente las luces por 10 segundos.',
      'Encender las exploradoras auxiliares apuntando a los ojos del otro conductor.'
    ],
    correctIndex: 1,
    explanation: 'El Artículo 86 prohíbe deslumbrar a otros conductores con luces altas a menos de 300 metros o al circular detrás de otro vehículo.',
    legalReference: 'Art. 86 Ley 769 de 2002'
  },
  {
    id: 22,
    category: 'Prelación de Peatones y Pasos de Cebra',
    licenseCategory: 'todas',
    question: 'En un paso peatonal señalizado (paso de cebra o sendero) sin semáforo, ¿quién tiene la prelación absoluta de paso?',
    options: [
      'Los vehículos de servicio público colectivo.',
      'El peatón que se dispone a cruzar o se encuentra cruzando la calzada.',
      'El vehículo particular si va en línea recta.',
      'El conductor que haga cambio de luces primero.'
    ],
    correctIndex: 1,
    explanation: 'Los peatones son los usuarios más vulnerables del sistema vial; el Art. 57 y Art. 105 exigen al conductor detenerse por completo para darles paso.',
    legalReference: 'Art. 57 y 105 Ley 769 de 2002'
  },
  {
    id: 23,
    category: 'Vehículos de Emergencia en Misión',
    licenseCategory: 'todas',
    question: 'Ante la aproximación de una ambulancia, vehículo de bomberos o patrulla de policía con señales audibles (sirena) y visuales activadas, los demás conductores deben:',
    options: [
      'Acelerar para irse detrás de la ambulancia y evitar el trancón.',
      'Ceder el paso orillándose de inmediato al costado derecho de la calzada o deteniendo la marcha de forma segura.',
      'Ignorarlo si el semáforo está en verde para el particular.',
      'Hacer sonar la bocina para protestar.'
    ],
    correctIndex: 1,
    explanation: 'El Artículo 64 otorga prelación absoluta a los vehículos de emergencia en servicio activo; los conductores deben orillarse a la derecha.',
    legalReference: 'Art. 64 Ley 769 de 2002'
  },
  {
    id: 24,
    category: 'Zonas de Obra y Señalización Transitoria',
    licenseCategory: 'todas',
    question: 'Las señales transitorias (con fondo color naranja fluorescente, como la ST-01 Obras en la Vía) advierten intervenciones temporales. ¿Cuál es la conducta obligatoria?',
    options: [
      'Mantener la velocidad crucero habitual.',
      'Reducir la velocidad a máximo 30 km/h, estar alerta a maquinaria y trabajadores viales, y acatar las instrucciones de los bandereros.',
      'Adelantar a toda la fila por la berma.',
      'Girar en U inmediatamente.'
    ],
    correctIndex: 1,
    explanation: 'Las señales naranjas ST señalan obras y riesgos temporales con personal en la vía; la prudencia y reducción de velocidad son obligatorias.',
    legalReference: 'Capítulo 4 Señales Transitorias - Manual de Señalización Mintransporte',
    signCode: 'ST-01',
    signType: 'st-01'
  },
  {
    id: 25,
    category: 'Puntos Ciegos de Vehículos Pesados',
    licenseCategory: 'todas',
    question: 'Al circular cerca de un tractocamión, bus intermunicipal o vehículo de carga pesada, ¿cuál es la regla de oro sobre los puntos ciegos?',
    options: [
      'El conductor del camión siempre ve a todos los vehículos pequeños a su alrededor.',
      'Si tú no puedes ver la cara del conductor en los espejos retrovisores laterales del camión, él tampoco puede verte a ti en sus puntos ciegos.',
      'Los camiones no tienen puntos ciegos laterales.',
      'Es seguro ubicarse justo detrás del parachoques trasero a menos de 1 metro.'
    ],
    correctIndex: 1,
    explanation: 'Los vehículos de gran porte poseen cuatro grandes zonas no visibles (adelante, atrás y a ambos costados). Si no ves sus espejos, estás en zona de peligro letal.',
    legalReference: 'Guía de Conducción Segura en Entornos de Carga - ANSV'
  }
];

export const COLOMBIAN_EXAM_QUESTIONS_EN: ExamQuestion[] = [
  {
    id: 1,
    category: 'Speed Limits (Law 2251 of 2022)',
    licenseCategory: 'todas',
    question: 'In Colombia, under Law 2251 of 2022 (Julian Esteban Law), what is the maximum speed limit on urban streets and municipal roads?',
    options: [
      '60 km/h for cars and 50 km/h for motorcycles.',
      '50 km/h generally (unless explicitly posted with a lower limit).',
      '70 km/h on main avenues.',
      '80 km/h if there is no heavy traffic.'
    ],
    correctIndex: 1,
    explanation: 'Law 2251 of 2022 lowered the national urban speed limit to 50 km/h to diminish road crash fatalities.',
    legalReference: 'Art. 106 Law 769 of 2002 as amended by Law 2251 of 2022'
  },
  {
    id: 2,
    category: 'Special Protection Zones',
    licenseCategory: 'todas',
    question: 'What is the maximum speed permitted in Colombia within school, residential, and hospital zones during active hours?',
    options: [
      '40 km/h',
      '30 km/h',
      '20 km/h',
      '50 km/h with hazard lights on'
    ],
    correctIndex: 1,
    explanation: 'The National Traffic Code and Law 2251 enforce a maximum speed of 30 km/h in school and residential zones.',
    legalReference: 'Art. 106 Paragraph - Law 769 of 2002'
  },
  {
    id: 3,
    category: 'Right of Way in Roundabouts',
    licenseCategory: 'todas',
    question: 'Upon arriving at a roundabout in Colombia, who has the right of way?',
    options: [
      'The vehicle attempting to enter the roundabout from the right.',
      'The vehicle already circulating inside the roundabout.',
      'The vehicle with larger engine displacement or heavy freight trucks.',
      'The vehicle that turns on emergency flashers first.'
    ],
    correctIndex: 1,
    explanation: 'Article 70 of Law 769 of 2002 provides that within a roundabout, the vehicle circulating inside holds priority over vehicles seeking entry.',
    legalReference: 'Art. 70 Law 769 of 2002'
  },
  {
    id: 4,
    category: 'Interactions with Cyclists (Law 1811 of 2016)',
    licenseCategory: 'todas',
    question: 'When overtaking a cyclist on a Colombian road, what is the mandatory minimum lateral distance a driver must maintain?',
    options: [
      '0.8 meters',
      '1.0 meter',
      '1.5 meters of lateral clearance',
      '2.5 meters on unpaved roads'
    ],
    correctIndex: 2,
    explanation: 'Law 1811 of 2016 obligates all drivers to keep a lateral distance of at least 1.5 meters to protect cyclist safety.',
    legalReference: 'Law 1811 of 2016 (Pro-Bike Law Colombia)'
  },
  {
    id: 5,
    category: 'Motorcycle Safety (Resolution 23385 of 2020)',
    licenseCategory: 'A2',
    question: 'In Colombia, the use of protective helmets for motorcyclists requires that:',
    options: [
      'It only be worn on national highways.',
      'The head is fully fitted within the helmet, retention straps are buckled beneath the chin, and mobile phones are not held inside the helmet.',
      'It may be unbuckled when riding below 30 km/h.',
      'It is only mandatory for the driver and optional for passengers.'
    ],
    correctIndex: 1,
    explanation: 'Resolution 23385 of 2020 by the Ministry of Transport sets mandatory conditions for the certified helmet fitment, buckle retention, and prohibits phones inside helmets.',
    legalReference: 'Resolution 23385 of 2020 - Ministry of Transport'
  },
  {
    id: 6,
    category: 'Breathalyzer & DUI Rules (Law 1696 of 2013)',
    licenseCategory: 'todas',
    question: 'In Colombia, Law 1696 of 2013 regarding driving under the influence of alcohol establishes:',
    options: [
      'Up to 0.5 grams of alcohol is permitted without sanction.',
      'Zero tolerance: starting from Grade Zero (20-39 mg/100ml), severe fines, license suspension, and vehicle impoundment apply.',
      'Sanctions are only applied if an accident happens.',
      'Sanctions are only pedagogical warnings for private drivers.'
    ],
    correctIndex: 1,
    explanation: 'Colombia applies strict zero tolerance: Grade 0 triggers a 1-year license suspension and immediate vehicle impoundment.',
    legalReference: 'Law 1696 of 2013'
  },
  {
    id: 7,
    category: 'Mandatory Road Documentation',
    licenseCategory: 'todas',
    question: 'What are the 4 mandatory documents every driver in Colombia must hold and have valid in the RUNT registry?',
    options: [
      'National ID, Passport, Vaccination Card, and Purchase Invoice.',
      'Driver’s License, Vehicle Registration Certificate (Tarjeta de Propiedad), Active SOAT Insurance, and Mechanical Inspection (RTM).',
      'Only the Driver’s License.',
      'Credit card and private comprehensive insurance policy only.'
    ],
    correctIndex: 1,
    explanation: 'Law 769 of 2002 mandates a valid Driver’s License, Vehicle Registration, SOAT, and Technical-Mechanical inspection certificate in the RUNT system.',
    legalReference: 'Art. 34 & 42 Law 769 of 2002'
  },
  {
    id: 8,
    category: 'Unmarked Intersections Priority',
    licenseCategory: 'todas',
    question: 'At an intersection where there are no traffic signals, STOP signs, or Yield signs, which vehicle has the right of way?',
    options: [
      'The vehicle traveling at higher speed.',
      'The vehicle approaching from the right side of the other driver.',
      'The heavier vehicle or public bus.',
      'The vehicle that honks its horn.'
    ],
    correctIndex: 1,
    explanation: 'In uncontrolled intersections, right-of-way belongs to the vehicle approaching from the right.',
    legalReference: 'Art. 70 Law 769 of 2002'
  }
];

export const COLOMBIAN_EXAM_QUESTIONS = COLOMBIAN_EXAM_QUESTIONS_ES;

export function getExamQuestions(language?: string): ExamQuestion[] {
  if (language === 'en') {
    return [
      ...COLOMBIAN_EXAM_QUESTIONS_EN,
      ...COLOMBIAN_EXAM_QUESTIONS_ES.slice(COLOMBIAN_EXAM_QUESTIONS_EN.length)
    ];
  }
  return COLOMBIAN_EXAM_QUESTIONS_ES;
}

export const COLOMBIAN_ROAD_INCIDENTS_ES: RoadIncident[] = [
  {
    id: 'inc-bog-01',
    title: 'Hueco profundo en carril exclusivo mixto',
    category: 'bache',
    location: 'Av. Caracas con Calle 53, Sentido Sur-Norte',
    city: 'Bogotá D.C.',
    lat: 4.64828,
    lng: -74.0684,
    description: 'Bache de gran profundidad que genera riesgo inminente de caída para motociclistas y ciclistas.',
    severity: 'alta',
    status: 'en_proceso',
    reportedAt: 'Hace 1 hora',
    authorName: 'Comunidad Vial Teusaquillo',
    upvotes: 24
  },
  {
    id: 'inc-med-02',
    title: 'Semáforo dañado en cruce peatonal',
    category: 'semaforo',
    location: 'Calle San Juan con Cra 65',
    city: 'Medellín',
    lat: 6.25184,
    lng: -75.5898,
    description: 'Semáforo intermitente en amarillo continuo. Alto riesgo para el paso de peatones hacia la estación.',
    severity: 'critica',
    status: 'reportado',
    reportedAt: 'Hace 30 minutos',
    authorName: 'Movilidad Poblado / Laureles',
    upvotes: 41
  },
  {
    id: 'inc-cali-03',
    title: 'Señal SR-01 PARE derribada por colisión',
    category: 'senal_caida',
    location: 'Av. Roosevelt con Calle 5ta',
    city: 'Cali',
    lat: 3.4352,
    lng: -76.5411,
    description: 'La señal reglamentaria de PARE está en el piso tras un roce vehicular nocturno. Conductores no frenan.',
    severity: 'alta',
    status: 'reportado',
    reportedAt: 'Hace 3 horas',
    authorName: 'Veeduría Ciudadana Valle',
    upvotes: 18
  },
  {
    id: 'inc-bar-04',
    title: 'Mantenimiento y demarcación de paso cebra',
    category: 'obras',
    location: 'Vía 40 con Calle 76',
    city: 'Barranquilla',
    lat: 11.0041,
    lng: -74.8070,
    description: 'Obras de señalización horizontal termoplástica finalizadas satisfactoriamente.',
    severity: 'baja',
    status: 'resuelto',
    reportedAt: 'Ayer',
    authorName: 'Secretaría de Tránsito y Seguridad Vial',
    upvotes: 56
  }
];

export const COLOMBIAN_ROAD_INCIDENTS_EN: RoadIncident[] = [
  {
    id: 'inc-bog-01',
    title: 'Deep pothole in mixed bus/car lane',
    category: 'bache',
    location: 'Av. Caracas with Calle 53, South-North Direction',
    city: 'Bogotá D.C.',
    description: 'Dangerous pothole posing immediate fall risk for motorcyclists and cyclists.',
    severity: 'alta',
    status: 'en_proceso',
    reportedAt: '1 hour ago',
    authorName: 'Teusaquillo Road Community',
    upvotes: 24
  },
  {
    id: 'inc-med-02',
    title: 'Malfunctioning traffic light at pedestrian crossing',
    category: 'semaforo',
    location: 'Calle San Juan with Cra 65',
    city: 'Medellín',
    description: 'Traffic light stuck in flashing yellow. High hazard for pedestrians crossing toward station.',
    severity: 'critica',
    status: 'reportado',
    reportedAt: '30 minutes ago',
    authorName: 'Laureles / Poblado Mobility',
    upvotes: 41
  },
  {
    id: 'inc-cali-03',
    title: 'SR-01 STOP sign knocked down by collision',
    category: 'senal_caida',
    location: 'Av. Roosevelt with Calle 5ta',
    city: 'Cali',
    description: 'STOP sign is lying on the ground following night accident. Drivers are failing to stop.',
    severity: 'alta',
    status: 'reportado',
    reportedAt: '3 hours ago',
    authorName: 'Valle Civic Watchdog',
    upvotes: 18
  },
  {
    id: 'inc-bar-04',
    title: 'Maintenance and repainting of zebra crossing',
    category: 'obras',
    location: 'Vía 40 with Calle 76',
    city: 'Barranquilla',
    description: 'Thermoplastic road marking works completed successfully.',
    severity: 'baja',
    status: 'resuelto',
    reportedAt: 'Yesterday',
    authorName: 'Transit and Road Safety Authority',
    upvotes: 56
  }
];

export const COLOMBIAN_ROAD_INCIDENTS = COLOMBIAN_ROAD_INCIDENTS_ES;

export function getRoadIncidents(language?: string): RoadIncident[] {
  if (language === 'en') {
    return COLOMBIAN_ROAD_INCIDENTS_EN;
  }
  return COLOMBIAN_ROAD_INCIDENTS_ES;
}
