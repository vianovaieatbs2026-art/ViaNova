export interface OwlQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface OwlSimulationScenario {
  id: string;
  title: string;
  situation: string;
  options: {
    text: string;
    correct: boolean;
    feedback: string;
  }[];
}

export interface OwlTrafficSignConcept {
  id: string;
  category: 'Reglamentarias (Rojo)' | 'Preventivas (Amarillo)' | 'Informativas (Azul)' | 'Transitorias (Naranja)';
  code: string;
  name: string;
  meaning: string;
  driverAction: string;
  icon: string;
}

export interface OwlCampaignMessage {
  id: string;
  title: string;
  slogan: string;
  content: string;
  tip: string;
}

export const OWL_QUIZ_QUESTIONS: OwlQuizQuestion[] = [
  {
    id: 'quiz-1',
    question: '¿Cuál es la distancia lateral mínima obligatoria al adelantar a un ciclista en Colombia (Ley 2251)?',
    options: [
      '0.5 metros',
      '1.0 metro',
      '1.5 metros',
      '2.5 metros'
    ],
    correctIndex: 2,
    explanation: 'La Ley 2251 de 2022 (Ley Julián Esteban) establece que todo conductor debe mantener una distancia mínima de 1.5 metros respecto a los ciclistas para proteger sus vidas ante cualquier desbalance o corriente de aire.'
  },
  {
    id: 'quiz-2',
    question: '¿Cuál es el límite máximo de velocidad en vías urbanas en Colombia según la Ley Julián Esteban?',
    options: [
      '30 km/h en toda la ciudad',
      '50 km/h en vías urbanas y 30 km/h en zonas escolares y residenciales',
      '60 km/h en vías principales y 40 km/h en barrios',
      '80 km/h en autopistas urbanas'
    ],
    correctIndex: 1,
    explanation: 'El límite urbano general es de 50 km/h, y se reduce estrictamente a 30 km/h en zonas escolares, residenciales y con alta presencia de peatones vulnerables.'
  },
  {
    id: 'quiz-3',
    question: '¿Qué significa la luz amarilla continua en el semáforo vehicular?',
    options: [
      'Acelerar a fondo antes de que cambie a rojo',
      'Advertencia de cambio inminente a rojo; detenerse de manera segura si es posible sin frenar bruscamente',
      'Tiene el mismo valor que la luz verde',
      'Prioridad de paso exclusivo para motocicletas'
    ],
    correctIndex: 1,
    explanation: 'La luz amarilla advierte que la fase verde ha terminado. Si puedes frenar de forma segura sin provocar un choque por alcance, debes detenerte antes de la línea de pare.'
  },
  {
    id: 'quiz-4',
    question: '¿Cuál es la tasa de alcoholemia permitida al conducir en Colombia según la Ley 1696?',
    options: [
      '0.5 grados con advertencia',
      'Cero absoluto (0.00 mg/L en aire espirado)',
      'Una cerveza antes de iniciar viaje',
      'Hasta grado 1 sin inmovilización'
    ],
    correctIndex: 1,
    explanation: 'En Colombia rige la política de Cero Tolerancia al Alcohol (Ley 1696 de 2013). Incluso desde Grado Cero (20-39 mg de etanol/100 ml de sangre) se aplican fuertes multas, inmovilización y suspensión de licencia.'
  },
  {
    id: 'quiz-5',
    question: '¿Quién tiene siempre la máxima prioridad en la pirámide de la movilidad urbana?',
    options: [
      'El transporte de carga pesada',
      'El vehículo particular con placa par',
      'El peatón y las personas con movilidad reducida',
      'El transporte público masivo'
    ],
    correctIndex: 2,
    explanation: 'El peatón y las personas con movilidad reducida están en la cúspide de la pirámide de la movilidad. Todas las maniobras y diseños deben garantizar su paso seguro y prioritario.'
  }
];

export const OWL_SIMULATION_SCENARIOS: OwlSimulationScenario[] = [
  {
    id: 'sim-1',
    title: '🌧️ Lluvia torrencial y riesgo de hidroplaneo',
    situation: 'Vas conduciendo a 60 km/h en vía rápida y comienza un fuerte aguacero. Notas que las llantas pierden contacto momentáneo con el asfalto (hidroplaneo). ¿Qué acción tomas?',
    options: [
      {
        text: 'Frenar bruscamente en seco y girar rápido el timón hacia la berma.',
        correct: false,
        feedback: '¡Peligro! Frenar en seco sobre película de agua bloquea las llantas y provoca un trompo incontrolable.'
      },
      {
        text: 'Soltar gradualmente el acelerador, mantener firme la dirección y evitar frenadas bruscas hasta recuperar tracción.',
        correct: true,
        feedback: '¡Excelente decisión! Al soltar el acelerador permites que el labrado de las llantas vuelva a evacuar el agua y recupere el agarre con el asfalto sin desestabilizar el vehículo.'
      },
      {
        text: 'Acelerar para salir rápido de la zona encharcada.',
        correct: false,
        feedback: 'Acelerar aumenta exponencialmente el grosor de la cuña de agua bajo la llanta y causa pérdida total del control.'
      }
    ]
  },
  {
    id: 'sim-2',
    title: '🚑 Vehículo de emergencia con sirena encendida',
    situation: 'Vas por el carril central y por el retrovisor ves acercarse una ambulancia con sirenas y luces de emergencia encendidas.',
    options: [
      {
        text: 'Seguir a tu velocidad habitual porque vas en tu carril.',
        correct: false,
        feedback: 'Incorrecto. Los vehículos de emergencia tienen prioridad absoluta y cada segundo cuenta para salvar una vida.'
      },
      {
        text: 'Señalar con las direccionales, orillarte de inmediato a la derecha de forma segura y despejar el carril.',
        correct: true,
        feedback: '¡Perfecto! El Código Nacional de Tránsito exige que todo conductor ceda el paso orillándose hacia el costado derecho para abrir un corredor de vida libre.'
      },
      {
        text: 'Acelerar para ir delante de la ambulancia abriéndole camino.',
        correct: false,
        feedback: 'Muy peligroso. Obstruyes la visibilidad de la ambulancia y generas un riesgo severo de colisión en intersecciones.'
      }
    ]
  },
  {
    id: 'sim-3',
    title: '🚶 Peatón cruzando en zona escolar sin demarcación',
    situation: 'Circulas por una vía cercana a un colegio. Un estudiante cruza la calzada a 25 metros de distancia fuera del paso de cebra.',
    options: [
      {
        text: 'Tocar el claxon con insistencia para que se apure o retroceda.',
        correct: false,
        feedback: 'El claxon asusta al peatón, especialmente a niños, pudiendo provocar que tropiece o corra en una dirección imprevista.'
      },
      {
        text: 'Reducir la velocidad de inmediato a menos de 30 km/h, detenerte con suavidad y cederle el paso.',
        correct: true,
        feedback: '¡Muy bien! En zonas escolares los peatones tienen máxima protección legal y humana. Reducir a 30 km/h disminuye el riesgo de fatalidad en más de un 80%.'
      },
      {
        text: 'Adelantar por el carril contrario para esquivarlo sin frenar.',
        correct: false,
        feedback: 'Extremadamente riesgoso: invade el carril contrario y expone al peatón a un punto ciego fatal.'
      }
    ]
  }
];

export const OWL_TRAFFIC_SIGNS: OwlTrafficSignConcept[] = [
  {
    id: 'sign-sr-01',
    category: 'Reglamentarias (Rojo)',
    code: 'SR-01 (PARE)',
    name: 'Señal de Pare',
    meaning: 'Obligación estricta de detener totalmente la marcha del vehículo antes de la línea de detención.',
    driverAction: 'Detén el vehículo por completo a 0 km/h, mira a ambos lados, cede el paso y reanuda solo cuando la vía esté 100% despejada.',
    icon: '🛑'
  },
  {
    id: 'sign-sr-02',
    category: 'Reglamentarias (Rojo)',
    code: 'SR-02 (CEDA EL PASO)',
    name: 'Ceda el Paso',
    meaning: 'Indica prioridad para los vehículos que circulan por la vía a la que te vas a incorporar.',
    driverAction: 'Reduce la marcha con anticipación y detén el vehículo si viene algún actor vial en la vía principal.',
    icon: '🔻'
  },
  {
    id: 'sign-sp-29',
    category: 'Preventivas (Amarillo)',
    code: 'SP-29 (ZONA ESCOLAR)',
    name: 'Zona Escolar',
    meaning: 'Advierte la proximidad de un centro educativo con alta afluencia de niños y jóvenes.',
    driverAction: 'Reduce la velocidad inmediatamente a máximo 30 km/h y mantén máxima atención a peatones.',
    icon: '🚸'
  },
  {
    id: 'sign-sp-33',
    category: 'Preventivas (Amarillo)',
    code: 'SP-33 (SUPERFICIE DESLIZANTE)',
    name: 'Superficie Deslizante',
    meaning: 'Advierte un tramo de vía donde el asfalto puede perder adherencia por agua, barro o aceite.',
    driverAction: 'Evita aceleraciones o frenadas bruscas, aumenta la distancia de seguridad al doble y sujeta firme el volante.',
    icon: '⚠️'
  },
  {
    id: 'sign-si-01',
    category: 'Informativas (Azul)',
    code: 'SI-01 (PRIMEROS AUXILIOS)',
    name: 'Puesto de Primeros Auxilios',
    meaning: 'Informa la ubicación cercana de un centro médico, hospital o posta de salud.',
    driverAction: 'Ten presente este punto de auxilio en caso de emergencia médica vial durante tu viaje.',
    icon: '🏥'
  },
  {
    id: 'sign-st-01',
    category: 'Transitorias (Naranja)',
    code: 'ST-01 (OBRAS EN LA VÍA)',
    name: 'Trabajos en la Vía',
    meaning: 'Advierte presencia de maquinaria, trabajadores o reducción de carriles por obras viales.',
    driverAction: 'Disminuye la velocidad, respeta a los señalizadores o paleteros y atiende los desvíos habilitados.',
    icon: '🚧'
  }
];

export const OWL_ROAD_EDUCATION_TOPICS = [
  {
    id: 'edu-1',
    title: 'Ley 2251 de 2022 (Ley Julián Esteban)',
    summary: 'Establece límites de velocidad seguros para salvar vidas: 50 km/h en zonas urbanas y 30 km/h en zonas escolares y residenciales.',
    keyRule: 'A 30 km/h, la probabilidad de supervivencia de un peatón atropellado es del 90%; a 60 km/h, es menor al 10%.'
  },
  {
    id: 'edu-2',
    title: 'Distancia de Seguridad y Adelantamiento a Ciclistas',
    summary: 'El ciclista es un actor vial vulnerable sin carrocería de protección. La ley exige mínimo 1.5 metros de distancia lateral al rebasarlo.',
    keyRule: 'Nunca toques el claxon pegado al ciclista; disminuye la velocidad y espera el momento seguro para adelantar cambiando de carril.'
  },
  {
    id: 'edu-3',
    title: 'Cinturón de Seguridad y Sistemas de Retención Infantil',
    summary: 'El uso del cinturón es obligatorio en todos los asientos (delanteros y traseros). Reduce en un 50% el riesgo de muerte en choques.',
    keyRule: 'Los menores de 10 años deben viajar siempre en el asiento trasero y con su silla de retención homologada.'
  },
  {
    id: 'edu-4',
    title: 'Revisión Técnico-Mecánica y Equipo de Carretera',
    summary: 'Obligatoriedad de mantener en óptimo estado frenos, luces, dirección y llantas (profundidad mínima de labrado de 1.6 mm).',
    keyRule: 'Llevar siempre gato, cruceta, 2 señales reflectivas triangulares, botiquín al día, extintor vigente y linterna.'
  }
];

export const OWL_CAMPAIGNS: OwlCampaignMessage[] = [
  {
    id: 'camp-1',
    title: 'La Vida es Primero',
    slogan: 'En la vía, ningún afán vale una vida.',
    content: 'ViaNova promueve que llegar un minuto más tarde es infinitamente mejor que no llegar. Respeta los semáforos y los pasos peatonales.',
    tip: '💡 Antes de arrancar en verde, espera 2 segundos para verificar que ningún vehículo se haya pasado en rojo tardío.'
  },
  {
    id: 'camp-2',
    title: 'Comparte la Vía con el Ciclista',
    slogan: '1.5 metros de distancia: una línea que salva vidas.',
    content: 'Detrás de cada ciclista hay un padre, una madre, un hijo o un amigo. Dales su espacio vital reglamentario de 1.5 metros.',
    tip: '💡 Al abrir la puerta del vehículo estacionado, utiliza la técnica holandesa (abre con la mano contraria) para mirar hacia atrás y evitar choques.'
  },
  {
    id: 'camp-3',
    title: 'Cero Alcohol al Volante',
    slogan: 'Si tomaste, entrega las llaves. La fiesta termina bien cuando todos llegan seguros.',
    content: 'El alcohol altera los reflejos, la visión periférica y el cálculo de distancias desde el primer sorbo.',
    tip: '💡 Designa siempre un conductor sobrio o programa transporte formal con antelación.'
  }
];
