import { RoadSafetyCampaign, SafetyResource } from '../types';

export const COLOMBIAN_ROAD_CAMPAIGNS: RoadSafetyCampaign[] = [
  {
    id: 'camp-01',
    title: 'Campaña: Velocidad Segura (Ley Julián Esteban)',
    slogan: 'Bájale a la prisa, súbele a la vida: 50 km/h en ciudad salva vidas',
    targetAudience: 'Conductores de automóviles, motos y transporte público',
    description: 'Iniciativa pedagógica nacional inspirada en la memoria de Julián Esteban Gómez y el enfoque de Visión Cero. Promueve el cumplimiento estricto del límite de 50 km/h en vías urbanas y 30 km/h en zonas escolares para reducir la probabilidad de muerte por atropellamiento en un 80%.',
    legalContext: 'Ley 2251 de 2022 y Código Nacional de Tránsito (Ley 769)',
    tips: [
      'Respeta el límite de 30 km/h al transitar frente a escuelas, colegios y hospitales.',
      'A 50 km/h la distancia de frenado permite reaccionar ante obstáculos imprevistos.',
      'Con lluvia, disminuye la velocidad en un 30% adicional para evitar el hidroplaneo.'
    ],
    bannerBg: 'from-amber-600 to-orange-700',
    badge: 'Prioridad Nacional'
  },
  {
    id: 'camp-02',
    title: 'Campaña: Casco Seguro y Abrochado',
    slogan: 'Tu cabeza no tiene repuesto. Usa casco certificado y bien abrochado',
    targetAudience: 'Motociclistas y acompañantes en todo el territorio colombiano',
    description: 'Campaña dirigida al actor vial con mayor tasa de siniestralidad en Colombia. Fomenta el uso de cascos reglamentarios con certificaciones ECE 22.05 / 22.06, DOT o NTC 4533, manteniendo la mentonera asegurada y prohibiendo el uso del celular entre la cabeza y el casco.',
    legalContext: 'Resolución 23385 de 2020 - Ministerio de Transporte',
    tips: [
      'Asegura la correa micrométrica o doble D bajo el mentón; un casco suelto sale despedido en el primer impacto.',
      'Utiliza prendas o chalecos reflectivos visibles entre las 6:00 p.m. y las 6:00 a.m.',
      'Reemplaza tu casco si ha sufrido un impacto severo o tras 5 años de vida útil.'
    ],
    bannerBg: 'from-blue-700 to-indigo-900',
    badge: 'Seguridad Motos'
  },
  {
    id: 'camp-03',
    title: 'Campaña: 1.5 Metros que Salvan Vidas',
    slogan: 'El ciclista es frágil. Deja 1.5 metros de distancia lateral al adelantar',
    targetAudience: 'Todos los conductores de vehículos a motor',
    description: 'Promoción del respeto y la sana convivencia con los ciclistas en carreteras y vías urbanas de Colombia. Enseña a esperar el momento oportuno de sobrepaso y mantener la separación mínima legal de un metro y medio.',
    legalContext: 'Ley 1811 de 2016 (Ley Pro-Bici en Colombia)',
    tips: [
      'No toques la bocina o pito pegado al ciclista; el susto puede provocar caídas.',
      'Espera hasta que el carril contrario esté completamente despejado antes de iniciar el rebase.',
      'Recuerda que el ciclista tiene derecho a ocupar el centro del carril cuando no haya ciclorruta.'
    ],
    bannerBg: 'from-emerald-700 to-teal-900',
    badge: 'Movilidad Sostenible'
  },
  {
    id: 'camp-04',
    title: 'Campaña: Cero Alcohol al Volante',
    slogan: 'Si tomas, no manejes. Entrega las llaves o pide conductor elegido',
    targetAudience: 'Conductores particulares y profesionales de todo el país',
    description: 'Sensibilización sobre la estricta Ley de Alcoholemia en Colombia. El alcohol reduce los reflejos y el campo visual desde el primer trago. La ley colombiana aplica sanciones drásticas desde el grado 0 (20 a 39 mg/100ml) con suspensión de licencia y multas severas.',
    legalContext: 'Ley 1696 de 2013 - Sanciones Penales y Administrativas',
    tips: [
      'Designa con anticipación a un conductor elegido antes de salir de fiesta.',
      'No confíes en remedios caseros; el alcohol permanece en la sangre por horas.',
      'Negarse a la prueba de alcoholemia genera la sanción máxima de Grado 3 con cancelación de licencia.'
    ],
    bannerBg: 'from-rose-700 to-red-900',
    badge: 'Cero Tolerancia'
  },
  {
    id: 'camp-05',
    title: 'Campaña: El Peatón es Primero',
    slogan: 'En el paso cebra y en cada esquina, el peatón tiene prelación absoluta',
    targetAudience: 'Conductores, ciclistas y peatones',
    description: 'Fomento de la pirámide de la movilidad urbana. Recuerda a los conductores la obligación de detener completamente el vehículo cuando una persona está cruzando por la cebra o en zonas peatonales autorizadas.',
    legalContext: 'Artículos 57 y 63 - Ley 769 de 2002',
    tips: [
      'Detén tu vehículo antes de la línea de parada, nunca encima de las líneas cebras.',
      'Sé paciente con adultos mayores, niños y personas con discapacidad visual o motriz.',
      'Como peatón, cruza siempre por los puentes peatonales, semáforos y pasos señalizados.'
    ],
    bannerBg: 'from-cyan-700 to-blue-900',
    badge: 'Pirámide Vial'
  },
  {
    id: 'camp-06',
    title: 'Campaña: Desconéctate al Conducir',
    slogan: 'Un segundo mirando el celular son 20 metros a ciegas en tu vehículo',
    targetAudience: 'Todos los conductores y motociclistas',
    description: 'Alerta sobre el peligro del uso de dispositivos móviles y manipulación de pantallas táctiles durante la conducción. Mirar un mensaje de texto a 50 km/h equivale a recorrer casi media cuadra con los ojos cerrados.',
    legalContext: 'Infracción C.38 - Código Nacional de Tránsito',
    tips: [
      'Configura tu ruta en el GPS antes de arrancar la marcha del vehículo.',
      'Utiliza sistemas manos libres solo para llamadas indispensables y breves.',
      'Si debes responder un mensaje urgente, estaciónate en un lugar seguro y autorizado.'
    ],
    bannerBg: 'from-purple-700 to-slate-900',
    badge: 'Conducción Atenta'
  }
];

export const COLOMBIAN_SAFETY_RESOURCES: SafetyResource[] = [
  {
    id: 'rec-01',
    title: 'Manual de Señalización Vial de Colombia (Mintransporte & INVÍAS)',
    type: 'manual',
    format: 'PDF',
    fileSize: '14.2 MB',
    description: 'Documento técnico oficial con las especificaciones geométricas, colores, códigos (SR, SP, SI, ST) y criterios de instalación de señales verticales y horizontales en las carreteras de Colombia.',
    author: 'Ministerio de Transporte / Instituto Nacional de Vías (INVÍAS)',
    category: 'Señalización y Normativa'
  },
  {
    id: 'rec-02',
    title: 'Código Nacional de Tránsito Terrestre (Ley 769 de 2002 compilada)',
    type: 'ley',
    format: 'PDF',
    fileSize: '4.8 MB',
    description: 'Texto legal completo con todas sus modificaciones vigentes (incluyendo Ley 2251, Ley 1811 y Ley 1696), deberes, derechos, infracciones, sanciones y procedimientos viales.',
    author: 'Congreso de la República de Colombia',
    category: 'Leyes y Normativa'
  },
  {
    id: 'rec-03',
    title: 'Guía de Trámites RUNT y Licencias de Conducción (A2, B1, C1)',
    type: 'guia',
    format: 'INTERACTIVO',
    fileSize: 'Guía Web',
    description: 'Paso a paso para inscribirse en el RUNT, examen médico en CRC, horas teóricas y prácticas en CEA y expedición del pase por primera vez o renovación.',
    author: 'Registro Único Nacional de Tránsito (RUNT)',
    category: 'Trámites y Licencias'
  },
  {
    id: 'rec-04',
    title: 'Guía de Primeros Auxilios y Protocolo PAS ante Siniestros Viales',
    type: 'guia',
    format: 'PDF',
    fileSize: '3.1 MB',
    description: 'Protocolo de emergencia: Proteger, Avisar (Línea 123 / #767 Policía de Tránsito) y Socorrer. Instrucciones de no mover heridos salvo peligro de fuego y asegurar la escena vial con conos y luces.',
    author: 'Agencia Nacional de Seguridad Vial (ANSV)',
    category: 'Emergencias Viales'
  },
  {
    id: 'rec-05',
    title: 'Formato de Inspección Preoperacional Diaria de Vehículos y Motos',
    type: 'formato',
    format: 'DOC',
    fileSize: '850 KB',
    description: 'Lista de chequeo para verificar antes de iniciar la marcha: niveles de líquidos (frenos, aceite, refrigerante), presión y labrado de llantas, luces, equipo de carretera y documentación.',
    author: 'ViaNova Colombia - Educación Vial',
    category: 'Mantenimiento Preventivo'
  },
  {
    id: 'rec-06',
    title: 'Infografía Resumen: Nuevos Límites de Velocidad Ley Julián Esteban',
    type: 'infografia',
    format: 'PDF',
    fileSize: '2.4 MB',
    description: 'Póster gráfico de alta resolución ilustrando los límites de 30, 50, 90 y 120 km/h según el tipo de vía y zona en el territorio nacional.',
    author: 'Agencia Nacional de Seguridad Vial (ANSV)',
    category: 'Infografías y Gráficos'
  }
];
