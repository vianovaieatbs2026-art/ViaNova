export interface OfficialTrafficSign {
  id: string;
  code: string;
  name: string;
  section: 'reglamentarias' | 'preventivas' | 'informativas';
  description: string; // Exactly 1 line of official description
  visualKey: string;
  shapeHint: string;
  badgeColor: string;
}

export interface TrafficSignSectionConfig {
  id: 'reglamentarias' | 'preventivas' | 'informativas';
  number: string;
  name: string;
  ruleTitle: string;
  ruleSummary: string;
  visualTag: string;
  badgeClass: string;
  borderClass: string;
  bgLightClass: string;
  signs: OfficialTrafficSign[];
}

export const OFFICIAL_TRAFFIC_SECTIONS: TrafficSignSectionConfig[] = [
  {
    id: 'reglamentarias',
    number: '1',
    name: 'Reglamentarias',
    ruleTitle: 'Reglamentarias (circulares, fondo blanco y borde rojo)',
    ruleSummary: 'Son las que obligan.',
    visualTag: 'Circulares, fondo blanco y borde rojo (SR)',
    badgeClass: 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-900',
    borderClass: 'border-red-500/40 hover:border-red-500',
    bgLightClass: 'bg-red-50/50 dark:bg-red-950/20',
    signs: [
      {
        id: 'sr-01',
        code: 'SR-01',
        name: 'PARE',
        section: 'reglamentarias',
        description: 'Detención total y obligatoria del vehículo antes de la línea de parada o de ingresar a la intersección.',
        visualKey: 'sr-01 pare',
        shapeHint: 'Octogonal rojo con letras blancas',
        badgeColor: '#dc2626'
      },
      {
        id: 'sr-02',
        code: 'SR-02',
        name: 'CEDA EL PASO',
        section: 'reglamentarias',
        description: 'Disminuir la velocidad y detenerse si es necesario para permitir el paso preferente de vehículos o peatones.',
        visualKey: 'sr-02 ceda',
        shapeHint: 'Triángulo invertido blanco con borde rojo',
        badgeColor: '#dc2626'
      },
      {
        id: 'sr-30-30',
        code: 'SR-30',
        name: 'LÍMITE 30 KM/H',
        section: 'reglamentarias',
        description: 'Velocidad máxima permitida de 30 km/h en zonas residenciales, escolares y hospitales (Ley 2251 de 2022).',
        visualKey: 'sr-30 30 velocidad',
        shapeHint: 'Circular blanco con borde rojo y número 30',
        badgeColor: '#dc2626'
      },
      {
        id: 'sr-30-50',
        code: 'SR-30 (50)',
        name: 'LÍMITE 50 KM/H',
        section: 'reglamentarias',
        description: 'Límite máximo general de 50 km/h en vías urbanas y carreteras municipales de Colombia (Ley Julián Esteban).',
        visualKey: 'sr-30 50 velocidad',
        shapeHint: 'Circular blanco con borde rojo y número 50',
        badgeColor: '#dc2626'
      },
      {
        id: 'sr-26',
        code: 'SR-26',
        name: 'PROHIBIDO PARQUEAR',
        section: 'reglamentarias',
        description: 'Prohíbe a los conductores estacionar o dejar inmovilizado el vehículo en la calzada o andén.',
        visualKey: 'sr-26 parquear',
        shapeHint: 'Circular blanco con letra P y franja diagonal roja',
        badgeColor: '#dc2626'
      },
      {
        id: 'sr-04',
        code: 'SR-04',
        name: 'PROHIBIDO GIRAR A LA IZQUIERDA',
        section: 'reglamentarias',
        description: 'Prohíbe efectuar la maniobra de viraje hacia la izquierda en la intersección vial.',
        visualKey: 'sr-04 izquierda',
        shapeHint: 'Circular blanco con flecha hacia la izquierda tachada en rojo',
        badgeColor: '#dc2626'
      },
      {
        id: 'sr-06',
        code: 'SR-06',
        name: 'PROHIBIDO GIRAR EN U',
        section: 'reglamentarias',
        description: 'Prohíbe realizar giro en 180 grados o retorno en la calzada para evitar colisiones graves.',
        visualKey: 'sr-06 giro en u',
        shapeHint: 'Circular blanco con flecha en U tachada en rojo',
        badgeColor: '#dc2626'
      },
      {
        id: 'sr-28',
        code: 'SR-28',
        name: 'PROHIBIDO ADELANTAR',
        section: 'reglamentarias',
        description: 'Prohibición estricta de adelantar a otro vehículo ocupando el carril de sentido opuesto.',
        visualKey: 'sr-38 adelantar',
        shapeHint: 'Circular blanco con dos autos y diagonal roja',
        badgeColor: '#dc2626'
      },
      {
        id: 'sr-42',
        code: 'SR-42',
        name: 'CIRCULACIÓN EN GLORIETA',
        section: 'reglamentarias',
        description: 'Obliga a transitar en sentido antihorario con prelación absoluta de quien ya circula en la rotonda.',
        visualKey: 'sr-42 glorieta',
        shapeHint: 'Circular azul con tres flechas blancas continuas',
        badgeColor: '#0052cc'
      },
      {
        id: 'sr-38',
        code: 'SR-38',
        name: 'SENTIDO ÚNICO DE CIRCULACIÓN',
        section: 'reglamentarias',
        description: 'Indica la dirección obligatoria del flujo vehicular; prohíbe transitar en sentido contrario.',
        visualKey: 'sr-38',
        shapeHint: 'Rectangular negro con flecha blanca',
        badgeColor: '#1e293b'
      }
    ]
  },
  {
    id: 'preventivas',
    number: '2',
    name: 'Preventivas',
    ruleTitle: 'Preventivas (diamante amarillo)',
    ruleSummary: 'Avisan peligro.',
    visualTag: 'Rombo / Diamante amarillo con símbolos negros (SP)',
    badgeClass: 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900',
    borderClass: 'border-amber-500/40 hover:border-amber-500',
    bgLightClass: 'bg-amber-50/50 dark:bg-amber-950/20',
    signs: [
      {
        id: 'sp-01',
        code: 'SP-01',
        name: 'CURVA PELIGROSA',
        section: 'preventivas',
        description: 'Advierte la proximidad de una curva cerrada hacia la derecha que exige reducir velocidad.',
        visualKey: 'sp-01 curva',
        shapeHint: 'Diamante amarillo con trazo negro curvado',
        badgeColor: '#d97706'
      },
      {
        id: 'sp-33',
        code: 'SP-33',
        name: 'ZONA ESCOLAR',
        section: 'preventivas',
        description: 'Advierte la cercanía de colegios o centros educativos y presencia de niños cruzando la calle.',
        visualKey: 'sp-29 escolar peaton',
        shapeHint: 'Diamante amarillo con silueta escolar caminando',
        badgeColor: '#d97706'
      },
      {
        id: 'sp-44',
        code: 'SP-44',
        name: 'DESLIZAMIENTO',
        section: 'preventivas',
        description: 'Advierte peligro inminente de desprendimiento de tierra, lodo o caída de rocas sobre la vía.',
        visualKey: 'sp-44 deslizamiento derrumbe',
        shapeHint: 'Diamante amarillo con talud y rocas desprendiéndose',
        badgeColor: '#d97706'
      },
      {
        id: 'sp-23',
        code: 'SP-23',
        name: 'RESALTO / REDUCTOR DE VELOCIDAD',
        section: 'preventivas',
        description: 'Advierte la proximidad de un resalto en la calzada para obligar a desacelerar a menos de 20 km/h.',
        visualKey: 'sp-40 resalto',
        shapeHint: 'Diamante amarillo con resalto ondulado negro',
        badgeColor: '#d97706'
      },
      {
        id: 'sp-46',
        code: 'SP-46',
        name: 'SEMÁFORO PRÓXIMO',
        section: 'preventivas',
        description: 'Advierte la aproximación a una intersección vial controlada por señales de semáforo.',
        visualKey: 'sp-47 semaforo',
        shapeHint: 'Diamante amarillo con semáforo de tres luces',
        badgeColor: '#d97706'
      },
      {
        id: 'sp-39',
        code: 'SP-39',
        name: 'ZONA DE CICLISTAS',
        section: 'preventivas',
        description: 'Advierte la presencia habitual de ciclistas y la obligación de guardar 1.5 metros de distancia.',
        visualKey: 'sp-55 ciclista',
        shapeHint: 'Diamante amarillo con silueta de bicicleta',
        badgeColor: '#d97706'
      },
      {
        id: 'sp-33-doble',
        code: 'SP-33',
        name: 'DOBLE SENTIDO DE CIRCULACIÓN',
        section: 'preventivas',
        description: 'Advierte que la calzada cambia de un solo sentido a circulación en doble vía con tráfico en contra.',
        visualKey: 'sp-33 doble via',
        shapeHint: 'Diamante amarillo con flechas opuestas',
        badgeColor: '#d97706'
      }
    ]
  },
  {
    id: 'informativas',
    number: '3',
    name: 'Informativas',
    ruleTitle: 'Informativas (cuadradas azules o verdes)',
    ruleSummary: 'Dan información.',
    visualTag: 'Cuadradas o rectangulares azules o verdes con símbolos blancos (SI)',
    badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-900',
    borderClass: 'border-blue-500/40 hover:border-blue-500',
    bgLightClass: 'bg-blue-50/50 dark:bg-blue-950/20',
    signs: [
      {
        id: 'si-01',
        code: 'SI-01',
        name: 'PRIMEROS AUXILIOS / HOSPITAL',
        section: 'informativas',
        description: 'Informa la ubicación inmediata o cercanía de un puesto de primeros auxilios o centro hospitalario.',
        visualKey: 'si-01 hospital auxilios',
        shapeHint: 'Cuadrado azul con recuadro blanco y cruz roja',
        badgeColor: '#0052cc'
      },
      {
        id: 'si-03',
        code: 'SI-03',
        name: 'RUTA NACIONAL',
        section: 'informativas',
        description: 'Informa la numeración oficial y categoría de la carretera dentro de la Red Vial Nacional de Colombia.',
        visualKey: 'si-03 ruta nacional',
        shapeHint: 'Rectangular verde con escudo Colombia y número de ruta',
        badgeColor: '#15803d'
      },
      {
        id: 'si-18',
        code: 'SI-18',
        name: 'PARADERO DE TRANSPORTE PÚBLICO',
        section: 'informativas',
        description: 'Informa el sitio autorizado y reglamentario para el ascenso y descenso de pasajeros de buses.',
        visualKey: 'si-18 paradero bus',
        shapeHint: 'Cuadrado azul con silueta de autobús urbano',
        badgeColor: '#0052cc'
      },
      {
        id: 'si-02',
        code: 'SI-02',
        name: 'ESTACIÓN DE SERVICIO',
        section: 'informativas',
        description: 'Informa la cercanía o acceso a una estación de abastecimiento de combustible y gasolina.',
        visualKey: 'si-05 gasolina combustible',
        shapeHint: 'Cuadrado azul con surtidor de combustible',
        badgeColor: '#0052cc'
      },
      {
        id: 'si-10',
        code: 'SI-10',
        name: 'ESTACIONAMIENTO PERMITIDO',
        section: 'informativas',
        description: 'Informa la existencia de una zona o parqueadero legalmente habilitado para estacionar vehículos.',
        visualKey: 'si-10 estacionamiento',
        shapeHint: 'Cuadrado azul con letra P blanca',
        badgeColor: '#0052cc'
      },
      {
        id: 'si-24',
        code: 'SI-24',
        name: 'CICLORRUTA / CICLOVÍA',
        section: 'informativas',
        description: 'Informa la existencia o continuidad de un carril exclusivo para el tránsito en bicicleta.',
        visualKey: 'si-24 ciclorruta',
        shapeHint: 'Rectangular verde azulado con silueta de ciclista',
        badgeColor: '#006476'
      }
    ]
  }
];
