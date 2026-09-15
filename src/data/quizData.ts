import { QuizTopic } from '../types';

export const COLOMBIAN_QUIZ_TOPICS_ES: QuizTopic[] = [
  {
    id: 'quiz-adivina-senales',
    title: 'Quiz Visual: ¡Adivina la Señal de Tránsito!',
    description: 'Ronda interactiva de 10 preguntas visuales. Observa la señal oficial colombiana y adivina su significado exacto, código y restricción.',
    icon: 'Eye',
    questionCount: 10,
    durationMinutes: 8,
    questions: [
      {
        id: 1,
        category: 'Adivina la Señal Reglamentaria',
        question: 'Observa la señal octagonal roja con orla blanca. ¿Cuál es su significado y la acción obligatoria que debe realizar el conductor en Colombia?',
        options: [
          'Disminuir la velocidad y continuar sin detenerse si no vienen carros.',
          'Detener totalmente el vehículo antes de la línea de parada, verificar y reanudar solo cuando sea seguro.',
          'Ceder el paso únicamente a los vehículos que vengan por la izquierda.',
          'Acelerar para despejar rápido la intersección.'
        ],
        correctIndex: 1,
        explanation: 'La señal SR-01 (PARE) exige la detención TOTAL e inequívoca del vehículo. No basta con frenar a medias o pasar despacio.',
        legalReference: 'Art. 109 Ley 769 de 2002 - Código Nacional de Tránsito',
        signCode: 'SR-01',
        signType: 'sr-01',
        signHint: 'Es la única señal con forma de octágono en el Manual de Señalización Vial.'
      },
      {
        id: 2,
        category: 'Adivina la Señal Reglamentaria',
        question: 'Observa este triángulo invertido de borde rojo y fondo blanco. ¿Qué indica la señal SR-02?',
        options: [
          'Preferencia absoluta de vía para el conductor que la observa.',
          'Ceda el Paso: reducir la velocidad y detenerse si es necesario para dar prelación a otros vehículos o peatones.',
          'Fin de zona escolar.',
          'Curva peligrosa a la derecha.'
        ],
        correctIndex: 1,
        explanation: 'La señal SR-02 "Ceda el Paso" indica al conductor que no tiene la prelación y debe facilitar el paso al flujo vehicular preferente.',
        legalReference: 'Art. 110 Ley 769 de 2002',
        signCode: 'SR-02',
        signType: 'sr-02',
        signHint: 'Triángulo invertido reglamentario utilizado en incorporaciones y entradas a glorietas.'
      },
      {
        id: 3,
        category: 'Adivina el Límite Urbano',
        question: '¿Qué límite de velocidad impone esta señal circular reglamentaria según la Ley Julián Esteban en Colombia?',
        options: [
          'Límite de 50 km/h, velocidad máxima general en vías urbanas y carreteras municipales.',
          'Velocidad mínima obligatoria de 50 km/h en autopistas.',
          'Velocidad recomendada solo para transporte de carga pesada.',
          'Límite de velocidad exclusivo para motociclistas.'
        ],
        correctIndex: 0,
        explanation: 'La señal SR-30 (50) fija el límite máximo urbano en 50 km/h en todo el territorio colombiano conforme a la Ley 2251 de 2022.',
        legalReference: 'Ley 2251 de 2022 (Ley Julián Esteban) - Art. 106',
        signCode: 'SR-30 (50)',
        signType: 'sr-30-50',
        signHint: 'Círculo blanco con orla roja y el número 50 en el centro.'
      },
      {
        id: 4,
        category: 'Adivina la Zona Escolar',
        question: 'Observa esta señal circular con el número 30. ¿Dónde es de obligatorio cumplimiento este límite de 30 km/h?',
        options: [
          'Únicamente en vías rurales destapadas.',
          'En zonas escolares, residenciales, frentes a hospitales y terminales de pasajeros.',
          'Solo los días domingos y festivos.',
          'En vías rápidas de doble calzada.'
        ],
        correctIndex: 1,
        explanation: 'El límite de 30 km/h es mandatorio frente a escuelas, hospitales y zonas residenciales para proteger a los actores viales más vulnerables.',
        legalReference: 'Ley 2251 de 2022 - Parágrafo Art. 106',
        signCode: 'SR-30 (30)',
        signType: 'sr-30-30',
        signHint: 'Protege a niños, estudiantes y pacientes al reducir la distancia de frenado de los automotores.'
      },
      {
        id: 5,
        category: 'Adivina la Prohibición de Estacionamiento',
        question: '¿Qué prohíbe esta señal circular blanca con la letra P cruzada por una franja diagonal roja (SR-26)?',
        options: [
          'Prohibido el paso de peatones.',
          'Prohibido parquear o estacionar vehículos en el tramo señalizado.',
          'Zona de parqueo gratuito para taxis.',
          'Permitido parquear solo con luces de parqueo activas.'
        ],
        correctIndex: 1,
        explanation: 'La señal SR-26 prohíbe estacionar o abandonar el vehículo en la vía. Su desacato conlleva comparendo e inmovilización con grúa.',
        legalReference: 'Infracción C.02 - Resolución 3027 de 2010',
        signCode: 'SR-26',
        signType: 'sr-26',
        signHint: 'Letra P mayúscula con línea diagonal roja que la atraviesa a 45 grados.'
      },
      {
        id: 6,
        category: 'Adivina la Señal de Giro',
        question: 'Observa la señal SR-04. ¿Qué maniobra está prohibida para el conductor?',
        options: [
          'Prohibido girar a la derecha.',
          'Prohibido girar a la izquierda.',
          'Prohibido adelantar por la berma.',
          'Giro obligatorio a la izquierda.'
        ],
        correctIndex: 1,
        explanation: 'La señal SR-04 prohíbe virar hacia la izquierda en la intersección para prevenir accidentes y bloqueos de carril.',
        legalReference: 'Manual de Señalización Vial - Mintransporte',
        signCode: 'SR-04',
        signType: 'sr-04',
        signHint: 'Flecha negra apuntando a la izquierda tachada con línea diagonal roja.'
      },
      {
        id: 7,
        category: 'Adivina la Señal Preventiva de Reductor',
        question: 'Observa este rombo amarillo con una ondulación central. ¿Qué peligro advierte la señal SP-40?',
        options: [
          'Cruce de peatones cercano.',
          'Proximidad de un resalto o reductor de velocidad ("policía acostado") en la calzada.',
          'Puente angosto sin barandas.',
          'Pérdida de pavimento por deslizamiento.'
        ],
        correctIndex: 1,
        explanation: 'La señal SP-40 advierte sobre la existencia de un resalto físico en la vía para que el conductor desacelere oportunamente.',
        legalReference: 'Capítulo 2 Señales Preventivas - Mintransporte',
        signCode: 'SP-40',
        signType: 'sp-40',
        signHint: 'Rombo amarillo reflectivo con silueta de joroba o resalto de pavimento.'
      },
      {
        id: 8,
        category: 'Adivina la Señal Preventiva de Semáforo',
        question: '¿Qué le comunica al conductor este rombo amarillo con la silueta de un semáforo (SP-47)?',
        options: [
          'Que el semáforo siempre estará en luz verde.',
          'Proximidad de una intersección controlada por semáforos donde debe prepararse para detenerse.',
          'Venta de repuestos electrónicos para vehículos.',
          'Zona exclusiva para vehículos de emergencia con sirena.'
        ],
        correctIndex: 1,
        explanation: 'La señal SP-47 previene al conductor de la cercanía de semáforos, especialmente en curvas o vías rápidas donde la visibilidad es limitada.',
        legalReference: 'Manual de Señalización Vial de Colombia',
        signCode: 'SP-47',
        signType: 'sp-47',
        signHint: 'Silueta de caja de semáforo con sus tres luces circulares.'
      },
      {
        id: 9,
        category: 'Adivina la Señal Informativa de Asistencia Médica',
        question: 'Observa este rectángulo azul con una cruz roja sobre recuadro blanco. ¿Qué servicio informa la señal SI-01?',
        options: [
          'Estación de gasolina y combustible.',
          'Puesto de primeros auxilios, centro de salud u hospital.',
          'Zona de restaurantes típicos.',
          'Taller mecánico automotriz.'
        ],
        correctIndex: 1,
        explanation: 'La señal SI-01 identifica puestos de primeros auxilios, clínicas o centros hospitalarios próximos para atención médica.',
        legalReference: 'Capítulo 3 Señales Informativas - Mintransporte',
        signCode: 'SI-01',
        signType: 'si-01',
        signHint: 'Fondo azul característico de señales informativas con el símbolo universal de la cruz roja.'
      },
      {
        id: 10,
        category: 'Adivina la Señal Transitoria de Obras',
        question: '¿Qué situación especial en la vía indica este rombo de color naranja con un trabajador paleando (ST-01)?',
        options: [
          'Parque infantil y zona recreativa.',
          'Trabajos u obras temporales de mantenimiento y presencia de cuadrillas en la vía.',
          'Ruta turística ecológica de senderismo.',
          'Zona de acampada autorizada.'
        ],
        correctIndex: 1,
        explanation: 'Las señales ST de fondo naranja son de carácter transitorio y advierten peligros temporales por obras civiles o reparaciones en la vía.',
        legalReference: 'Capítulo 4 Señalización de Obras - Mintransporte',
        signCode: 'ST-01',
        signType: 'st-01',
        signHint: 'El color naranja brillante se reserva exclusivamente para obras temporales de construcción o mantenimiento.'
      }
    ]
  },
  {
    id: 'quiz-velocidad-ley2251',
    title: 'Quiz: Ley Julián Esteban y Velocidades',
    description: 'Pon a prueba tus conocimientos sobre la Ley 2251 de 2022 y los límites vigentes en Colombia en 10 preguntas completas.',
    icon: 'Gauge',
    questionCount: 10,
    durationMinutes: 8,
    questions: [
      {
        id: 101,
        category: 'Velocidad Urbana',
        question: '¿Cuál es la velocidad máxima permitida en vías urbanas según la Ley 2251 de 2022 en Colombia?',
        options: ['60 km/h', '50 km/h', '70 km/h', '80 km/h'],
        correctIndex: 1,
        explanation: 'La Ley 2251 fijó el límite urbano nacional en 50 km/h para disminuir fatalidades.',
        legalReference: 'Art. 106 Ley 769 de 2002',
        signCode: 'SR-30 (50)',
        signType: 'sr-30-50'
      },
      {
        id: 102,
        category: 'Zonas Escolares',
        question: 'En zonas escolares y frente a hospitales en horario diurno, ¿cuál es el límite máximo obligatorio?',
        options: ['40 km/h', '30 km/h', '20 km/h', '50 km/h'],
        correctIndex: 1,
        explanation: 'En zonas escolares, residenciales y médicas el límite es de 30 km/h sin excepción.',
        legalReference: 'Ley 2251 de 2022',
        signCode: 'SR-30 (30)',
        signType: 'sr-30-30'
      },
      {
        id: 103,
        category: 'Carreteras Nacionales Sencillas',
        question: 'En carreteras nacionales rurales de calzada sencilla en Colombia, ¿cuál es el límite general para vehículos particulares?',
        options: ['80 km/h', '90 km/h', '100 km/h', '120 km/h'],
        correctIndex: 1,
        explanation: 'El límite general en vías nacionales de calzada sencilla es de 90 km/h.',
        legalReference: 'Art. 107 Ley 769 de 2002'
      },
      {
        id: 104,
        category: 'Autopistas Doble Calzada',
        question: 'En vías rurales con calzadas separadas y doble carril por sentido, ¿cuál es la velocidad tope máxima en Colombia?',
        options: ['100 km/h', '120 km/h', '140 km/h', '110 km/h'],
        correctIndex: 1,
        explanation: 'El artículo 107 del Código Nacional permite hasta 120 km/h en vías de doble calzada si no tienen pasos peatonales a nivel y la señalización lo autoriza.',
        legalReference: 'Art. 107 Ley 769 de 2002 modificado por Ley 2251'
      },
      {
        id: 105,
        category: 'Sanción por Exceso',
        question: '¿Qué código de infracción corresponde a conducir a una velocidad superior a la máxima permitida?',
        options: ['Infracción A.01', 'Infracción C.29', 'Infracción D.02', 'Infracción B.01'],
        correctIndex: 1,
        explanation: 'La infracción C.29 sanciona el exceso de velocidad con 15 SMDLV.',
        legalReference: 'Resolución 3027 de 2010 - Mintransporte'
      },
      {
        id: 106,
        category: 'Fotodetección y Calibración',
        question: 'Para que una cámara de fotodetección (SAST) emita un comparendo válido por velocidad en Colombia, ¿qué requisito debe cumplir?',
        options: [
          'Debe estar escondida detrás de los árboles sin señalizar.',
          'Debe estar autorizada por la ANSV y señalizada con antelación visible en la vía.',
          'No requiere calibración técnica periódica.',
          'Solo puede operar de noche.'
        ],
        correctIndex: 1,
        explanation: 'Las cámaras deben contar con autorización del Ministerio/ANSV, estar señalizadas con la señal SI-27 y tener calibración metrológica al día.',
        legalReference: 'Ley 1843 de 2017 y Resolución 718 de 2018'
      },
      {
        id: 107,
        category: 'Transporte Público y Escolar',
        question: '¿Cuál es la velocidad máxima a la que puede transitar un vehículo de transporte escolar en zona urbana?',
        options: ['30 km/h', '40 km/h', '50 km/h', '60 km/h'],
        correctIndex: 0,
        explanation: 'Los vehículos de servicio especial escolar deben transitar a máximo 30 km/h en zonas escolares y residenciales.',
        legalReference: 'Decreto 431 de 2017 - Mintransporte'
      },
      {
        id: 108,
        category: 'Lluvia y Visibilidad Reducida',
        question: 'Cuando hay lluvia intensa, neblina o el pavimento está mojado, ¿qué dicta la norma colombiana sobre la velocidad?',
        options: [
          'Se puede mantener la velocidad máxima si el carro tiene frenos ABS.',
          'El conductor debe reducir la velocidad a la mitad o a una que permita detenerse con seguridad.',
          'Solo es obligatorio encender luces altas.',
          'No existe disposición legal al respecto.'
        ],
        correctIndex: 1,
        explanation: 'El conductor debe adecuar la velocidad a las condiciones climáticas y de visibilidad para prevenir hidroplaneo.',
        legalReference: 'Art. 106 Ley 769 de 2002'
      },
      {
        id: 109,
        category: 'Protección a Ciclistas',
        question: '¿Por qué la Ley Julián Esteban lleva el nombre de Julián Esteban Gómez?',
        options: [
          'Fue el primer ministro de transporte de Colombia.',
          'En homenaje al joven ciclista colombiano que falleció arrollado en la vía Zipaquirá-Cajicá, impulsando la ley de límites seguros.',
          'Fue un célebre abogado que redactó el Código de Tránsito.',
          'Es un piloto de automovilismo de carreras.'
        ],
        correctIndex: 1,
        explanation: 'La Ley 2251 honra la memoria de Julián Esteban Gómez para garantizar la vida de ciclistas, peatones y motociclistas.',
        legalReference: 'Exposición de Motivos Ley 2251 de 2022'
      },
      {
        id: 110,
        category: 'Velocidad Mínima',
        question: '¿Existe una velocidad mínima en vías rápidas o autopistas colombianas?',
        options: [
          'No, cualquiera puede ir a 5 km/h si lo desea.',
          'Sí, no se debe transitar a velocidad tan baja que entorpezca el tránsito libre y normal de los demás.',
          'Solo existe para camiones cisterna.',
          'Únicamente aplica en túneles.'
        ],
        correctIndex: 1,
        explanation: 'El Art. 108 del Código de Tránsito prohíbe transitar a una velocidad anormalmente reducida sin justificación.',
        legalReference: 'Art. 108 Ley 769 de 2002'
      }
    ]
  },
  {
    id: 'quiz-senales-colombianas',
    title: 'Quiz: Señalización Vial Oficial (SR, SP, SI, ST)',
    description: 'Evalúa tu capacidad de identificar códigos, formas, colores y normas del Manual de Señalización de Mintransporte.',
    icon: 'SlidersHorizontal',
    questionCount: 10,
    durationMinutes: 8,
    questions: [
      {
        id: 201,
        category: 'Señales Reglamentarias',
        question: '¿Qué forma geométrica y color caracterizan exclusivamente a la señal SR-01 PARE en Colombia?',
        options: [
          'Rombo amarillo con letras negras.',
          'Octágono de fondo rojo con orla y letras blancas.',
          'Círculo blanco con orla roja.',
          'Triángulo invertido azul.'
        ],
        correctIndex: 1,
        explanation: 'La señal SR-01 es la única octagonal en el manual colombiano, de fondo rojo con letras blancas.',
        legalReference: 'Manual de Señalización Vial - Mintransporte',
        signCode: 'SR-01',
        signType: 'sr-01'
      },
      {
        id: 202,
        category: 'Señales Preventivas',
        question: 'Las señales preventivas (código SP) tienen como forma y color predominante:',
        options: [
          'Círculo rojo con fondo blanco.',
          'Rombo de fondo amarillo con orla y símbolo negro.',
          'Rectángulo azul con orla blanca.',
          'Rectángulo naranja con letras blancas.'
        ],
        correctIndex: 1,
        explanation: 'Las preventivas son rombos amarillos con símbolos negros que advierten un peligro permanente en la vía.',
        legalReference: 'Capítulo 2 - Manual de Señalización Vial',
        signCode: 'SP-01',
        signType: 'sp-01'
      },
      {
        id: 203,
        category: 'Señales Transitorias',
        question: '¿Qué color de fondo identifica inequívocamente a las señales transitorias (ST) por obras en la vía?',
        options: ['Verde fluorescente', 'Naranja reflectivo', 'Rojo oscuro', 'Blanco reflectivo'],
        correctIndex: 1,
        explanation: 'El color naranja identifica zonas de obras, construcciones o mantenimiento temporal en vías.',
        legalReference: 'Capítulo 4 - Manual de Señalización Vial',
        signCode: 'ST-01',
        signType: 'st-01'
      },
      {
        id: 204,
        category: 'Señales Reglamentarias en Glorietas',
        question: '¿Qué indica una señal circular de fondo azul con tres flechas blancas en sentido antihorario (SR-42)?',
        options: [
          'Prohibido girar.',
          'Circulación giratoria obligatoria en glorieta / rotonda.',
          'Estacionamiento exclusivo para vehículos oficiales.',
          'Pista de carreras autorizada.'
        ],
        correctIndex: 1,
        explanation: 'La señal SR-42 indica el sentido de circulación giratorio obligatorio dentro de una rotonda.',
        legalReference: 'Manual de Señalización Vial - Mintransporte',
        signCode: 'SR-42',
        signType: 'sr-42'
      },
      {
        id: 205,
        category: 'Prohibición en U',
        question: 'Observa la señal SR-06 con una flecha en U tachada con franja roja. ¿Qué significa?',
        options: [
          'Prohibido el giro en U o retorno en ese punto de la vía.',
          'Permitido girar en U con precaución.',
          'Paso exclusivo para herraduras y carretas.',
          'Túnel en curva cerrado.'
        ],
        correctIndex: 0,
        explanation: 'La señal SR-06 prohíbe dar vuelta en U en 180 grados en la calzada por alto riesgo de choque.',
        legalReference: 'Manual de Señalización Vial',
        signCode: 'SR-06',
        signType: 'sr-06'
      },
      {
        id: 206,
        category: 'Señales Informativas',
        question: '¿Cuál es el color de fondo predominante de las señales de servicios generales e información turística (SI)?',
        options: ['Amarillo mostaza', 'Azul', 'Verde olivo', 'Rojo escarlata'],
        correctIndex: 1,
        explanation: 'Las señales de servicios generales utilizan fondo azul con recuadros blancos y pictogramas negros o rojos.',
        legalReference: 'Capítulo 3 Señales Informativas - Mintransporte',
        signCode: 'SI-05',
        signType: 'si-05'
      },
      {
        id: 207,
        category: 'Adivina la Señal Preventiva Escolar',
        question: 'Observa la señal preventiva SP-29 con la silueta de peatones en rombo amarillo. ¿Qué debe hacer el conductor?',
        options: [
          'Acelerar antes de que los niños crucen la calzada.',
          'Reducir la velocidad a máximo 30 km/h y ceder siempre el paso a escolares y peatones.',
          'Pitar continuamente para despejar la zona.',
          'Ignorar la señal si no se ven personas a simple vista.'
        ],
        correctIndex: 1,
        explanation: 'La señal SP-29 advierte la presencia de una zona escolar o cruce peatonal habitual; exige reducir la velocidad a 30 km/h y dar prelación total al peatón.',
        legalReference: 'Capítulo 2 Señales Preventivas - Mintransporte y Ley 2251',
        signCode: 'SP-29',
        signType: 'sp-29'
      },
      {
        id: 208,
        category: 'Señales de Prioridad de Paso',
        question: 'Entre una orden impartida por un agente de tránsito en vía y una señal reglamentaria fija (como un PARE o semáforo en rojo), ¿cuál prevalece?',
        options: [
          'La señal fija siempre prevalece sobre las personas.',
          'Las órdenes del agente o policía de tránsito prevalecen sobre cualquier otra señal.',
          'El semáforo tiene máxima prioridad.',
          'Prevalece la que decida el conductor.'
        ],
        correctIndex: 1,
        explanation: 'El Art. 111 de la Ley 769 establece la jerarquía de señales: primero las órdenes de los agentes de tránsito.',
        legalReference: 'Art. 111 Ley 769 de 2002'
      },
      {
        id: 209,
        category: 'Señal Preventiva de Ciclistas',
        question: 'Observa la señal SP-55 con la silueta de una bicicleta en rombo amarillo. ¿Qué debe hacer el conductor al verla?',
        options: [
          'Acelerar y pitar para que los ciclistas se salgan de la vía.',
          'Disminuir la velocidad, estar alerta ante la presencia de ciclistas y respetar el 1.5 metros de distancia.',
          'Invadir la ciclorruta contigua.',
          'Cerrar la ventanilla del carro.'
        ],
        correctIndex: 1,
        explanation: 'Advierte la presencia habitual de ciclistas en la calzada; el conductor debe extremar precauciones.',
        legalReference: 'Ley 1811 de 2016 y Manual de Señalización',
        signCode: 'SP-55',
        signType: 'sp-55'
      },
      {
        id: 210,
        category: 'Adivina la Prohibición de Motos',
        question: 'Observa la señal reglamentaria SR-28 (círculo rojo con motocicleta tachada). ¿Qué restricción impone?',
        options: [
          'Venta de motocicletas autorizada en la acera.',
          'Prohibida la circulación de motocicletas y mototriciclos en ese tramo vial.',
          'Obligación de usar casco únicamente a partir de esa señal.',
          'Carril exclusivo para motociclistas de alto cilindraje.'
        ],
        correctIndex: 1,
        explanation: 'La señal SR-28 prohíbe la circulación de motocicletas en la vía reglamentada para garantizar la seguridad o por restricciones de movilidad.',
        legalReference: 'Manual de Señalización Vial - Señales Reglamentarias SR',
        signCode: 'SR-28',
        signType: 'sr-28'
      }
    ]
  },
  {
    id: 'quiz-normas-alcoholemia',
    title: 'Quiz: Alcoholemia, Cascos y Documentos RUNT',
    description: 'Conoce los requisitos legales para circular en Colombia sin incurrir en comparendos ni inmovilizaciones en 10 preguntas.',
    icon: 'ShieldCheck',
    questionCount: 10,
    durationMinutes: 8,
    questions: [
      {
        id: 301,
        category: 'Alcoholemia Grado Cero',
        question: '¿A partir de qué grado de alcoholemia se suspende la licencia de conducción en Colombia?',
        options: [
          'Solo a partir de Grado 2.',
          'Desde Grado 0 (20 a 39 mg de etanol/100 ml de sangre total).',
          'Solo si supera los 100 mg.',
          'No hay suspensión en el primer comparendo.'
        ],
        correctIndex: 1,
        explanation: 'La Ley 1696 de 2013 castiga desde Grado Cero con suspensión de licencia por 1 año e inmovilización.',
        legalReference: 'Ley 1696 de 2013'
      },
      {
        id: 302,
        category: 'Motociclistas y Cascos',
        question: 'Según la Resolución 23385 de 2020 de Mintransporte, ¿qué acción está terminantemente prohibida con el celular al conducir moto?',
        options: [
          'Tener el celular guardado en el bolsillo del pantalón.',
          'Intercalar o meter el teléfono móvil dentro del casco junto al oído mientras se conduce.',
          'Usar intercomunicadores bluetooth certificados adosados al casco.',
          'Llevar el GPS en el soporte del manubrio.'
        ],
        correctIndex: 1,
        explanation: 'Está terminantemente prohibido alojar teléfonos entre la cabeza y el casco, ya que reduce la efectividad del casco y genera distracción fatal.',
        legalReference: 'Resolución 23385 de 2020'
      },
      {
        id: 303,
        category: 'Ciclistas y Distancia',
        question: '¿Cuál es la distancia lateral mínima que debe guardar un automóvil al adelantar a un ciclista en Colombia?',
        options: ['50 centímetros', '1.0 metro', '1.5 metros', '2.0 metros'],
        correctIndex: 2,
        explanation: 'La Ley 1811 de 2016 establece la distancia lateral mínima de 1.5 metros al rebasar a ciclistas.',
        legalReference: 'Ley 1811 de 2016'
      },
      {
        id: 304,
        category: 'Documentos Obligatorios',
        question: '¿Cuál de los siguientes documentos NO es obligatorio para circular en vehículo particular según la ley colombiana?',
        options: [
          'Licencia de Conducción vigente.',
          'Póliza de seguro Todo Riesgo privada y voluntaria.',
          'Seguro Obligatorio de Accidentes de Tránsito (SOAT).',
          'Certificado de Revisión Técnico-Mecánica (cuando aplique por antigüedad).'
        ],
        correctIndex: 1,
        explanation: 'El seguro Todo Riesgo es voluntario; los obligatorios por ley son SOAT, Licencia de Conducción, Licencia de Tránsito y Técnico-Mecánica.',
        legalReference: 'Art. 42 Ley 769 de 2002'
      },
      {
        id: 305,
        category: 'Negativa a Prueba de Alcoholemia',
        question: 'Si un conductor se rehúsa o niega a realizar la prueba de alcoholemia requerida por la autoridad de tránsito:',
        options: [
          'No pasa nada, se le deja ir porque es su derecho.',
          'Se le aplica la sanción máxima: cancelación definitiva de la licencia, multa de hasta 1440 SMDLV e inmovilización por 20 días.',
          'Solo se le cobra una multa pedagógica de 5 SMDLV.',
          'Se le da una espera de 24 horas para decidir.'
        ],
        correctIndex: 1,
        explanation: 'La Ley 1696 sanciona la negativa con las consecuencias del grado más severo: cancelación de licencia y multas millonarias.',
        legalReference: 'Art. 5 Ley 1696 de 2013'
      },
      {
        id: 306,
        category: 'Licencia Digital en RUNT',
        question: '¿Es válido presentar la licencia de conducción y la tarjeta de propiedad (licencia de tránsito) en formato digital consultado en el RUNT?',
        options: [
          'No, solo se acepta el plástico físico original.',
          'Sí, la Circular 20221010000601 de 2022 avala la consulta virtual en tiempo real ante las autoridades.',
          'Solo si se lleva una copia autenticada en notaría.',
          'Únicamente es válida de día.'
        ],
        correctIndex: 1,
        explanation: 'Mintransporte determinó que el ciudadano puede presentar los documentos en consulta digital oficial en la plataforma del RUNT.',
        legalReference: 'Circular 20221010000601 de 2022 - Mintransporte'
      },
      {
        id: 307,
        category: 'Chaleco Reflectivo en Motos',
        question: '¿En qué horario es obligatorio portar prenda o chaleco reflectivo para conductores de motocicleta y sus acompañantes en Colombia?',
        options: [
          'Las 24 horas del día.',
          'Entre las 18:00 (6:00 p.m.) y las 06:00 (6:00 a.m.) del día siguiente, o cuando la visibilidad sea escasa.',
          'Solo los días de lluvia.',
          'Solo en carreteras intermunicipales.'
        ],
        correctIndex: 1,
        explanation: 'El Código Nacional de Tránsito exige chaleco o chaqueta reflectiva entre las 6:00 p.m. y las 6:00 a.m.',
        legalReference: 'Art. 94 Ley 769 de 2002'
      },
      {
        id: 308,
        category: 'Vigencia de Licencia de Conducción',
        question: 'Para un conductor particular menor de 60 años en Colombia (categorías A o B), ¿cada cuántos años debe renovar su licencia?',
        options: ['Cada 3 años', 'Cada 5 años', 'Cada 10 años', 'No se renueva nunca'],
        correctIndex: 2,
        explanation: 'Para particulares menores de 60 años la vigencia es de 10 años; entre 60 y 80 años es de 5 años; y mayores de 80, cada año.',
        legalReference: 'Decreto Ley 019 de 2012'
      },
      {
        id: 309,
        category: 'Prelación en Glorietas',
        question: 'Al ingresar a una glorieta o rotonda en Colombia, ¿quién tiene la prelación de paso?',
        options: [
          'El vehículo que va a entrar a la glorieta.',
          'El vehículo que ya está circulando dentro de la glorieta.',
          'El vehículo que sea más grande o pesado.',
          'El vehículo que pite primero.'
        ],
        correctIndex: 1,
        explanation: 'El Art. 119 de la Ley 769 estipula que quien transita dentro de la glorieta tiene prelación sobre quien intenta ingresar.',
        legalReference: 'Art. 119 Ley 769 de 2002',
        signCode: 'SR-42',
        signType: 'sr-42'
      },
      {
        id: 310,
        category: 'Equipo de Carretera Obligatorio',
        question: '¿Cuál de los siguientes elementos forma parte del equipo de carretera reglamentario en Colombia?',
        options: [
          'Gato con capacidad para elevar el vehículo, cruceta, dos señales de carretera reflectivas, botiquín y extintor vigente.',
          'Nevera portátil y sombrilla de playa.',
          'Cámara de video frontal obligatoria.',
          'Rueda de repuesto de diferente tamaño no compatible.'
        ],
        correctIndex: 0,
        explanation: 'El Art. 30 de la Ley 769 enumera el equipo de prevención y seguridad obligatorio que todo vehículo debe portar.',
        legalReference: 'Art. 30 Ley 769 de 2002'
      }
    ]
  }
];

export const COLOMBIAN_QUIZ_TOPICS_EN: QuizTopic[] = [
  {
    id: 'quiz-adivina-senales',
    title: 'Visual Quiz: Guess the Road Sign!',
    description: 'Interactive round of 10 visual questions. Look at the official Colombian road sign and guess its exact meaning, code, and restriction.',
    icon: 'Eye',
    questionCount: 10,
    durationMinutes: 8,
    questions: [
      {
        id: 1,
        category: 'Guess the Regulatory Sign',
        question: 'Look at the red octagon with white border. What is its meaning and mandatory driver action in Colombia?',
        options: [
          'Slow down and keep going if no cars are coming.',
          'Completely stop the vehicle before the stop line, verify safety, and resume only when clear.',
          'Yield only to vehicles arriving from the left.',
          'Accelerate to clear the intersection quickly.'
        ],
        correctIndex: 1,
        explanation: 'The SR-01 STOP (PARE) sign demands an absolute full stop. Rolling stops are illegal.',
        legalReference: 'Art. 109 Law 769 of 2002 - National Traffic Code',
        signCode: 'SR-01',
        signType: 'sr-01',
        signHint: 'It is the only octagonal sign in the Colombian road sign manual.'
      },
      {
        id: 2,
        category: 'Guess the Regulatory Sign',
        question: 'Look at this inverted triangle with red border and white center. What does the SR-02 sign indicate?',
        options: [
          'Absolute right-of-way for the driver seeing it.',
          'Yield (Ceda el Paso): slow down and stop if necessary to grant priority to other vehicles or pedestrians.',
          'End of school zone.',
          'Dangerous right curve.'
        ],
        correctIndex: 1,
        explanation: 'The SR-02 Yield sign informs the driver that they do not have right-of-way and must let other traffic proceed safely.',
        legalReference: 'Art. 110 Law 769 of 2002',
        signCode: 'SR-02',
        signType: 'sr-02',
        signHint: 'Inverted regulatory triangle placed at merges and roundabout entrances.'
      },
      {
        id: 3,
        category: 'Guess the Urban Speed Limit',
        question: 'What speed limit does this circular regulatory sign enforce under the Julian Esteban Law in Colombia?',
        options: [
          '50 km/h speed limit, general maximum in urban streets and municipal roads.',
          'Minimum mandatory speed of 50 km/h on expressways.',
          'Recommended speed for heavy freight transport only.',
          'Exclusive speed limit for motorcyclists.'
        ],
        correctIndex: 0,
        explanation: 'Sign SR-30 (50) sets the general urban speed limit to 50 km/h throughout Colombia pursuant to Law 2251 of 2022.',
        legalReference: 'Law 2251 of 2022 (Julian Esteban Law) - Art. 106',
        signCode: 'SR-30 (50)',
        signType: 'sr-30-50',
        signHint: 'White circle with red border and the number 50 centered.'
      },
      {
        id: 4,
        category: 'Guess the School Zone Limit',
        question: 'Look at this circular sign with number 30. Where is this 30 km/h speed limit mandatory?',
        options: [
          'Only on unpaved rural tracks.',
          'In school zones, residential areas, and hospital frontages.',
          'Only on Sundays and national holidays.',
          'On dual carriageway expressways.'
        ],
        correctIndex: 1,
        explanation: 'The 30 km/h limit is mandatory near schools, hospitals, and residential areas to safeguard vulnerable road users.',
        legalReference: 'Law 2251 of 2022 - Art. 106 Paragraph',
        signCode: 'SR-30 (30)',
        signType: 'sr-30-30',
        signHint: 'Protects children, students, and patients by drastically reducing braking distances.'
      },
      {
        id: 5,
        category: 'Guess the Parking Prohibition',
        question: 'What does this white circular sign with letter P crossed by a red diagonal stripe forbid (SR-26)?',
        options: [
          'Pedestrian crossing.',
          'No parking or stopping vehicles along the marked road section.',
          'Free parking area for taxis.',
          'Parking permitted with hazard lights active.'
        ],
        correctIndex: 1,
        explanation: 'Sign SR-26 prohibits parking or leaving a vehicle unattended on the road, punishable with fines and towing.',
        legalReference: 'Infringement C.02 - Resolution 3027 of 2010',
        signCode: 'SR-26',
        signType: 'sr-26',
        signHint: 'Capital letter P crossed by a red diagonal line at 45 degrees.'
      },
      {
        id: 6,
        category: 'Guess the Turn Prohibition',
        question: 'Look at sign SR-04. Which maneuver is strictly forbidden?',
        options: [
          'No right turn.',
          'No left turn.',
          'No overtaking on shoulder.',
          'Mandatory left turn.'
        ],
        correctIndex: 1,
        explanation: 'Sign SR-04 prohibits turning left at intersections to prevent head-on and lateral collisions.',
        legalReference: 'Road Sign Manual - Ministry of Transport',
        signCode: 'SR-04',
        signType: 'sr-04',
        signHint: 'Black curved arrow pointing left crossed by a red diagonal slash.'
      },
      {
        id: 7,
        category: 'Guess the Speed Hump Warning',
        question: 'Look at this yellow diamond with a hump silhouette. What hazard does sign SP-40 warn about?',
        options: [
          'Pedestrian crossing ahead.',
          'Proximity of a speed bump / speed hump ("resalto") on the roadway.',
          'Narrow bridge with no guardrails.',
          'Pavement collapse due to landslide.'
        ],
        correctIndex: 1,
        explanation: 'Sign SP-40 warns drivers of a speed hump ahead so they can decelerate safely.',
        legalReference: 'Chapter 2 Warning Signs - Ministry of Transport',
        signCode: 'SP-40',
        signType: 'sp-40',
        signHint: 'Reflective yellow diamond with a raised hump silhouette.'
      },
      {
        id: 8,
        category: 'Guess the Traffic Light Warning',
        question: 'What does this yellow diamond with a traffic light symbol indicate (SP-47)?',
        options: [
          'That the traffic signal will always remain green.',
          'Proximity of a signal-controlled intersection where you must be ready to stop.',
          'Electronics car parts sale shop.',
          'Exclusive lane for emergency sirens.'
        ],
        correctIndex: 1,
        explanation: 'Sign SP-47 alerts drivers of upcoming traffic lights, particularly on bends or fast corridors with limited sightlines.',
        legalReference: 'Colombia Road Sign Manual',
        signCode: 'SP-47',
        signType: 'sp-47',
        signHint: 'Vertical traffic light silhouette with red, yellow, and green circular lenses.'
      },
      {
        id: 9,
        category: 'Guess the Medical Service Sign',
        question: 'Look at this blue rectangle with a red cross on a white square. What service does sign SI-01 indicate?',
        options: [
          'Gas and petrol station.',
          'First aid station, health clinic, or hospital.',
          'Traditional food restaurants zone.',
          'Automotive repair garage.'
        ],
        correctIndex: 1,
        explanation: 'Sign SI-01 identifies first aid stations, clinics, or emergency hospital facilities.',
        legalReference: 'Chapter 3 Informative Signs - Ministry of Transport',
        signCode: 'SI-01',
        signType: 'si-01',
        signHint: 'Characteristic blue background with the universal red cross symbol.'
      },
      {
        id: 10,
        category: 'Guess the Road Works Sign',
        question: 'What temporary condition does this orange diamond with a construction worker silhouette indicate (ST-01)?',
        options: [
          'Children playground and recreational park.',
          'Temporary road maintenance or construction works and worker crews ahead.',
          'Ecological hiking trail.',
          'Authorized camping ground.'
        ],
        correctIndex: 1,
        explanation: 'Orange ST signs are temporary and warn of hazards due to road works and civil engineering maintenance.',
        legalReference: 'Chapter 4 Road Works Signage - Ministry of Transport',
        signCode: 'ST-01',
        signType: 'st-01',
        signHint: 'Vivid safety orange color reserved exclusively for temporary road construction or maintenance.'
      }
    ]
  },
  {
    id: 'quiz-velocidad-ley2251',
    title: 'Quiz: Julian Esteban Law & Speed Limits',
    description: 'Test your knowledge on Law 2251 of 2022 and active speed limits in Colombia across 10 complete questions.',
    icon: 'Gauge',
    questionCount: 10,
    durationMinutes: 8,
    questions: [
      {
        id: 101,
        category: 'Urban Speed',
        question: 'What is the maximum allowed speed on urban streets according to Law 2251 of 2022 in Colombia?',
        options: ['60 km/h', '50 km/h', '70 km/h', '80 km/h'],
        correctIndex: 1,
        explanation: 'Law 2251 established the national urban speed limit at 50 km/h to save lives.',
        legalReference: 'Art. 106 Law 769 of 2002',
        signCode: 'SR-30 (50)',
        signType: 'sr-30-50'
      },
      {
        id: 102,
        category: 'School Zones',
        question: 'In school zones and near hospitals during daytime, what is the mandatory maximum speed limit?',
        options: ['40 km/h', '30 km/h', '20 km/h', '50 km/h'],
        correctIndex: 1,
        explanation: 'In school, residential, and medical areas the speed limit is 30 km/h without exception.',
        legalReference: 'Law 2251 of 2022',
        signCode: 'SR-30 (30)',
        signType: 'sr-30-30'
      },
      {
        id: 103,
        category: 'National Highways',
        question: 'On single-carriageway rural national highways in Colombia, what is the general limit for private passenger vehicles?',
        options: ['80 km/h', '90 km/h', '100 km/h', '120 km/h'],
        correctIndex: 1,
        explanation: 'The general speed limit on single-carriageway national roads is 90 km/h.',
        legalReference: 'Art. 107 Law 769 of 2002'
      },
      {
        id: 104,
        category: 'Dual Carriageway Expressways',
        question: 'On rural highways with separated carriageways and multiple lanes per direction, what is the top maximum limit in Colombia?',
        options: ['100 km/h', '120 km/h', '140 km/h', '110 km/h'],
        correctIndex: 1,
        explanation: 'Article 107 permits up to 120 km/h on dual-carriageway roads without grade crossings when signposted.',
        legalReference: 'Art. 107 Law 769 amended by Law 2251'
      },
      {
        id: 105,
        category: 'Speeding Penalty',
        question: 'Which traffic ticket infringement code corresponds to speeding in Colombia?',
        options: ['Infringement A.01', 'Infringement C.29', 'Infringement D.02', 'Infringement B.01'],
        correctIndex: 1,
        explanation: 'Infringement C.29 penalizes driving over the speed limit with a fine of 15 SMDLV.',
        legalReference: 'Resolution 3027 of 2010 - Ministry of Transport'
      },
      {
        id: 106,
        category: 'Photo-radar Cameras',
        question: 'For a speed camera (SAST) ticket to be legally valid in Colombia, what requirement must be fulfilled?',
        options: [
          'It must be concealed behind trees without signage.',
          'It must be authorized by ANSV and preceded by clearly visible warning signs.',
          'It requires no periodic metrological calibration.',
          'It can only operate during night hours.'
        ],
        correctIndex: 1,
        explanation: 'Cameras must be approved by the transport ministry/ANSV, signposted in advance, and metrologically certified.',
        legalReference: 'Law 1843 of 2017 & Resolution 718 of 2018'
      },
      {
        id: 107,
        category: 'School Bus Speed',
        question: 'What is the maximum speed limit for school transport buses in urban areas?',
        options: ['30 km/h', '40 km/h', '50 km/h', '60 km/h'],
        correctIndex: 0,
        explanation: 'School buses must operate at a maximum of 30 km/h in school and residential zones.',
        legalReference: 'Decree 431 of 2017 - Ministry of Transport'
      },
      {
        id: 108,
        category: 'Rain & Wet Road Conditions',
        question: 'During heavy rain, fog, or when pavement is wet, what does Colombian traffic law require regarding speed?',
        options: [
          'You may maintain top speed if your car has ABS brakes.',
          'The driver must reduce speed appropriately to be able to stop safely.',
          'Only high beam headlights must be turned on.',
          'There is no legal regulation on wet conditions.'
        ],
        correctIndex: 1,
        explanation: 'Drivers must adjust speed to weather and road conditions to prevent hydroplaning and skidding.',
        legalReference: 'Art. 106 Law 769 of 2002'
      },
      {
        id: 109,
        category: 'Cyclist Protection Legacy',
        question: 'Why is the Julian Esteban Law named after Julian Esteban Gomez?',
        options: [
          'He was the first minister of transport of Colombia.',
          'In tribute to the young cyclist killed on the Zipaquira-Cajica road, prompting safer speed limit reforms.',
          'He was a prominent lawyer who drafted the traffic code.',
          'He is an automobile race driver.'
        ],
        correctIndex: 1,
        explanation: 'Law 2251 honors the memory of Julian Esteban Gomez to protect vulnerable cyclists and pedestrians.',
        legalReference: 'Explanatory Statement of Law 2251 of 2022'
      },
      {
        id: 110,
        category: 'Minimum Speed',
        question: 'Is there a minimum speed requirement on Colombian highways?',
        options: [
          'No, anyone can drive at 5 km/h if they want.',
          'Yes, drivers must not travel at an abnormally low speed that disrupts normal traffic flow.',
          'Only applies to fuel tanker trucks.',
          'Only applies in tunnels.'
        ],
        correctIndex: 1,
        explanation: 'Art. 108 forbids driving at an unreasonably low speed without justified reason.',
        legalReference: 'Art. 108 Law 769 of 2002'
      }
    ]
  },
  {
    id: 'quiz-senales-colombianas',
    title: 'Quiz: Official Road Signs (SR, SP, SI, ST)',
    description: 'Test your ability to identify codes, shapes, colors, and regulations from the Ministry of Transport Sign Manual in 10 questions.',
    icon: 'SlidersHorizontal',
    questionCount: 10,
    durationMinutes: 8,
    questions: [
      {
        id: 201,
        category: 'Regulatory Signs',
        question: 'What shape and colors characterize the SR-01 STOP (PARE) sign in Colombia?',
        options: [
          'Yellow diamond with black letters.',
          'Red octagon with white border and white letters.',
          'White circle with red border.',
          'Inverted blue triangle.'
        ],
        correctIndex: 1,
        explanation: 'The SR-01 STOP sign is the only octagonal sign in the Colombian manual, featuring a red background and white lettering.',
        legalReference: 'Road Sign Manual - Ministry of Transport',
        signCode: 'SR-01',
        signType: 'sr-01'
      },
      {
        id: 202,
        category: 'Warning / Preventive Signs',
        question: 'Preventive signs (code SP) have what predominant shape and color?',
        options: [
          'Red circle with white background.',
          'Yellow diamond with black border and symbol.',
          'Blue rectangle with white border.',
          'Orange rectangle with white letters.'
        ],
        correctIndex: 1,
        explanation: 'Preventive signs are yellow diamonds with black symbols that alert drivers of permanent hazards.',
        legalReference: 'Chapter 2 - Road Sign Manual',
        signCode: 'SP-01',
        signType: 'sp-01'
      },
      {
        id: 203,
        category: 'Temporary Signs',
        question: 'What background color identifies temporary signs (ST) for road works?',
        options: ['Fluorescent green', 'Reflective orange', 'Dark red', 'Reflective white'],
        correctIndex: 1,
        explanation: 'The color orange identifies construction, maintenance, and temporary detour zones.',
        legalReference: 'Chapter 4 - Road Sign Manual',
        signCode: 'ST-01',
        signType: 'st-01'
      },
      {
        id: 204,
        category: 'Roundabout Regulatory Signs',
        question: 'What does a circular blue sign with three white counter-clockwise arrows indicate (SR-42)?',
        options: [
          'No turning.',
          'Mandatory circular flow in roundabout.',
          'Exclusive parking for government vehicles.',
          'Authorized racing track.'
        ],
        correctIndex: 1,
        explanation: 'Sign SR-42 dictates mandatory counter-clockwise circulation within a roundabout.',
        legalReference: 'Road Sign Manual - Ministry of Transport',
        signCode: 'SR-42',
        signType: 'sr-42'
      },
      {
        id: 205,
        category: 'U-Turn Prohibition',
        question: 'Look at sign SR-06 with a U arrow crossed by a red slash. What does it mean?',
        options: [
          'No U-turns or 180-degree turns allowed at that road point.',
          'U-turns permitted with caution.',
          'Exclusive passage for horses and carts.',
          'Closed curve tunnel.'
        ],
        correctIndex: 0,
        explanation: 'Sign SR-06 strictly forbids 180-degree U-turns due to risk of side-impact collisions.',
        legalReference: 'Road Sign Manual',
        signCode: 'SR-06',
        signType: 'sr-06'
      },
      {
        id: 206,
        category: 'Informative Signs',
        question: 'What is the predominant background color of general service and tourism informative signs (SI)?',
        options: ['Mustard yellow', 'Blue', 'Olive green', 'Scarlet red'],
        correctIndex: 1,
        explanation: 'General service informative signs feature a blue background with white borders and pictograms.',
        legalReference: 'Chapter 3 Informative Signs - Ministry of Transport',
        signCode: 'SI-05',
        signType: 'si-05'
      },
      {
        id: 207,
        category: 'Horizontal Road Markings',
        question: 'In horizontal road pavement markings, what does a double solid yellow line in the center indicate?',
        options: [
          'Overtaking permitted in both directions.',
          'Strict prohibition of overtaking in both directions of travel.',
          '5-minute quick drop-off zone.',
          'Exclusive lane for electric scooters.'
        ],
        correctIndex: 1,
        explanation: 'A double solid yellow line prohibits overtaking and lane crossing for vehicles travelling in either direction.',
        legalReference: 'Chapter 5 Horizontal Markings - Ministry of Transport'
      },
      {
        id: 208,
        category: 'Hierarchy of Traffic Signs',
        question: 'Between an order given by a traffic officer on the road and a fixed traffic sign (like a red light or stop sign), which takes priority?',
        options: [
          'Fixed signs always take priority over people.',
          'Orders given by traffic police officers prevail over any other signal or sign.',
          'Traffic light signals have supreme priority.',
          'Whatever the driver chooses.'
        ],
        correctIndex: 1,
        explanation: 'Article 111 of Law 769 establishes that direct orders from traffic officers supersede all other signs.',
        legalReference: 'Art. 111 Law 769 of 2002'
      },
      {
        id: 209,
        category: 'Cyclists Warning Sign',
        question: 'Look at sign SP-55 with a bicycle silhouette on a yellow diamond. What must the driver do?',
        options: [
          'Accelerate and honk so cyclists clear the road.',
          'Slow down, remain alert for cyclists, and maintain at least 1.5 meters of passing distance.',
          'Drive into the bicycle lane.',
          'Close car windows.'
        ],
        correctIndex: 1,
        explanation: 'It warns of frequent cyclists on the road; drivers must exercise extra care and respect 1.5m clearance.',
        legalReference: 'Law 1811 of 2016 and Sign Manual',
        signCode: 'SP-55',
        signType: 'sp-55'
      },
      {
        id: 210,
        category: 'White vs Yellow Road Lines',
        question: 'What is the fundamental difference between longitudinal white lines and yellow lines in Colombia?',
        options: [
          'Yellow lines separate lanes in the same direction; white lines separate opposite directions.',
          'Yellow lines separate traffic flowing in opposite directions; white lines separate lanes in the same direction.',
          'There is no difference, purely decorative.',
          'White lines are only used on unpaved roads.'
        ],
        correctIndex: 1,
        explanation: 'Yellow lines separate opposing traffic flows, whereas white lines delineate lanes moving in the same direction.',
        legalReference: 'Road Sign Manual - Ministry of Transport'
      }
    ]
  },
  {
    id: 'quiz-normas-alcoholemia',
    title: 'Quiz: Alcohol Limits, Helmets & RUNT Documents',
    description: 'Learn the legal rules to drive safely in Colombia without tickets or impoundment across 10 thorough questions.',
    icon: 'ShieldCheck',
    questionCount: 10,
    durationMinutes: 8,
    questions: [
      {
        id: 301,
        category: 'Zero Grade Alcohol Limit',
        question: 'Starting from which blood alcohol grade is a driving license suspended in Colombia?',
        options: [
          'Only starting from Grade 2.',
          'From Grade 0 (20 to 39 mg of ethanol per 100 ml of blood).',
          'Only if exceeding 100 mg.',
          'No suspension on first ticket.'
        ],
        correctIndex: 1,
        explanation: 'Law 1696 of 2013 punishes from Grade Zero with a 1-year license suspension and vehicle impoundment.',
        legalReference: 'Law 1696 of 2013'
      },
      {
        id: 302,
        category: 'Motorcyclists & Helmets',
        question: 'According to Resolution 23385 of 2020 by the Ministry of Transport, what action is strictly forbidden with phones while riding a motorcycle?',
        options: [
          'Carrying a cell phone in your pocket.',
          'Wedging or inserting the mobile phone inside the helmet next to your ear while riding.',
          'Using certified Bluetooth intercoms attached to helmet shell.',
          'Mounting GPS onto handlebar holder.'
        ],
        correctIndex: 1,
        explanation: 'Lodging phones between the head and helmet is strictly prohibited because it compromises helmet shock absorption and causes fatal distractions.',
        legalReference: 'Resolution 23385 of 2020'
      },
      {
        id: 303,
        category: 'Cyclists & Safe Clearance',
        question: 'What is the mandatory minimum lateral distance a car must keep when overtaking a cyclist in Colombia?',
        options: ['50 centimeters', '1.0 meter', '1.5 meters', '2.0 meters'],
        correctIndex: 2,
        explanation: 'Law 1811 of 2016 mandates a minimum lateral clearance of 1.5 meters when passing cyclists.',
        legalReference: 'Law 1811 of 2016'
      },
      {
        id: 304,
        category: 'Mandatory Road Documents',
        question: 'Which of the following documents is NOT mandatory by law to drive a private passenger car in Colombia?',
        options: [
          'Valid Driving License.',
          'Private voluntary comprehensive collision insurance policy.',
          'Mandatory Traffic Accident Insurance (SOAT).',
          'Certificate of Mechanical Inspection (when required by vehicle age).'
        ],
        correctIndex: 1,
        explanation: 'Private collision insurance is optional; mandatory documents are SOAT, Driving License, Transit License, and Mechanical Inspection.',
        legalReference: 'Art. 42 Law 769 of 2002'
      },
      {
        id: 305,
        category: 'Refusing Breathalyzer Test',
        question: 'If a driver refuses to perform the breathalyzer / blood alcohol test requested by transit police:',
        options: [
          'Nothing happens, they are allowed to drive away.',
          'The maximum penalty applies: permanent license cancellation, fine up to 1440 SMDLV, and 20 days vehicle impoundment.',
          'Only a small pedagogical ticket of 5 SMDLV is issued.',
          'They are given a 24-hour grace period.'
        ],
        correctIndex: 1,
        explanation: 'Law 1696 penalizes refusal with the harshest legal consequences: cancellation of license and massive fines.',
        legalReference: 'Art. 5 Law 1696 of 2013'
      },
      {
        id: 306,
        category: 'Digital License on RUNT',
        question: 'Is it legally valid to present a driving license and vehicle registration card in digital format queried live on RUNT?',
        options: [
          'No, only the original plastic card is accepted.',
          'Yes, Circular 20221010000601 of 2022 validates live official digital verification before authorities.',
          'Only with a notarized photocopy.',
          'Only during daylight hours.'
        ],
        correctIndex: 1,
        explanation: 'The Ministry of Transport authorized citizens to present digital driving documents through official real-time RUNT consultation.',
        legalReference: 'Circular 20221010000601 of 2022'
      },
      {
        id: 307,
        category: 'Reflective Vest on Motorcycles',
        question: 'During what hours must motorcycle riders and passengers wear a reflective vest or garment in Colombia?',
        options: [
          '24 hours a day.',
          'Between 18:00 (6:00 PM) and 06:00 (6:00 AM) the next day, or when visibility is poor.',
          'Only during rainy weather.',
          'Only on intercity highways.'
        ],
        correctIndex: 1,
        explanation: 'The National Traffic Code mandates reflective vests or jackets between 6:00 PM and 6:00 AM.',
        legalReference: 'Art. 94 Law 769 of 2002'
      },
      {
        id: 308,
        category: 'License Renewal Frequency',
        question: 'For private drivers under 60 years old in Colombia (category A or B), how often must their license be renewed?',
        options: ['Every 3 years', 'Every 5 years', 'Every 10 years', 'Never expires'],
        correctIndex: 2,
        explanation: 'For private drivers under 60, license validity is 10 years; between 60 and 80 it is 5 years; over 80, every year.',
        legalReference: 'Decree Law 019 of 2012'
      },
      {
        id: 309,
        category: 'Roundabout Priority',
        question: 'When entering a roundabout in Colombia, who has right-of-way?',
        options: [
          'The vehicle entering the roundabout.',
          'The vehicle already circulating inside the roundabout.',
          'Whichever vehicle is larger or heavier.',
          'The vehicle that honks first.'
        ],
        correctIndex: 1,
        explanation: 'Article 119 stipulates that vehicles already within the roundabout have absolute priority over entering traffic.',
        legalReference: 'Art. 119 Law 769 of 2002',
        signCode: 'SR-42',
        signType: 'sr-42'
      },
      {
        id: 310,
        category: 'Mandatory Road Emergency Kit',
        question: 'Which of the following items is part of the legally required road emergency kit in Colombia?',
        options: [
          'Jack with vehicle lifting capacity, cross wrench, two reflective road signs, first aid kit, and valid fire extinguisher.',
          'Portable cooler and beach umbrella.',
          'Mandatory forward dashcam.',
          'Incompatible spare wheel of different size.'
        ],
        correctIndex: 0,
        explanation: 'Article 30 of Law 769 details the compulsory road safety equipment every motor vehicle must carry.',
        legalReference: 'Art. 30 Law 769 of 2002'
      }
    ]
  }
];

export function getQuizTopics(lang: string): QuizTopic[] {
  return lang === 'en' ? COLOMBIAN_QUIZ_TOPICS_EN : COLOMBIAN_QUIZ_TOPICS_ES;
}
