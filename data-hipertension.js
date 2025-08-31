// data-hipertension.js
// Información integral sobre Hipertensión arterial (prevención, diagnóstico, tratamiento, nutrición, ejercicio, complicaciones, mitos, alertas y recursos)

const HIPERTENSION_INFO = {
  general: {
    definicion: "La hipertensión arterial (HTA) es una enfermedad crónica caracterizada por la elevación persistente de la presión arterial por encima de los valores normales (≥140/90 mmHg). Es el principal factor de riesgo modificable para infarto, ACV y daño renal.",
    estadisticas: "Más de 1.2 mil millones de personas sufren de hipertensión en el mundo. La mayoría no presenta síntomas y no está diagnosticada.",
    mitos: [
      "La hipertensión no siempre produce síntomas.",
      "Solo las personas mayores tienen hipertensión.",
      "La sal no es el único factor que aumenta la presión.",
      "La hipertensión se puede controlar y prevenir complicaciones.",
      "No todos los medicamentos para la presión causan efectos adversos graves."
    ]
  },
  prevencion: {
    factores_riesgo: [
      "Sobrepeso y obesidad.",
      "Consumo excesivo de sal.",
      "Sedentarismo.",
      "Estrés crónico.",
      "Consumo de alcohol y tabaco.",
      "Antecedentes familiares."
    ],
    estrategias: [
      "Reducción de sal en la dieta (<5g/día).",
      "Actividad física regular (≥150 min/semana).",
      "Control del peso.",
      "Evitar tabaco y alcohol.",
      "Manejo del estrés.",
      "Monitoreo regular de la presión arterial."
    ],
    recursos: [
      { tipo: "Infografía", url: "https://www.who.int/es/news-room/fact-sheets/detail/hypertension" },
      { tipo: "Video", url: "https://www.youtube.com/watch?v=x0wA3JwJ3Ug" }
    ]
  },
  diagnostico: {
    criterios: [
      "Presión arterial en consulta ≥140/90 mmHg.",
      "Monitoreo ambulatorio de presión arterial (MAPA) o domiciliario.",
      "Evaluación de daño a órganos blanco (riñón, corazón, retina)."
    ],
    recomendaciones: "Monitorear presión al menos 1 vez al año en adultos y con mayor frecuencia en personas con factores de riesgo."
  },
  tratamiento: {
    esquemas: [
      "Cambios en el estilo de vida: dieta, ejercicio, reducción de sal, control de peso.",
      "Fármacos antihipertensivos: IECA, ARA II, diuréticos, calcioantagonistas, betabloqueantes.",
      "Individualizar el tratamiento según edad, comorbilidades y tolerancia."
    ],
    adherencia: "Tomar la medicación diariamente y acudir a controles médicos regulares.",
    monitoreo: [
      "Chequeo periódico de presión arterial.",
      "Evaluación de función renal, cardiaca y ocular.",
      "Control de lípidos y glucosa."
    ],
    efectos_adversos: [
      "Tos (IECA), hinchazón (calcioantagonistas), alteraciones electrolíticas (diuréticos).",
      "Fatiga, mareos y disfunción eréctil."
    ]
  },
  complicaciones: {
    agudas: [
      "Crisis hipertensiva (presión >180/120 mmHg, síntomas agudos: dolor de cabeza, visión borrosa, confusión, dolor torácico).",
      "Infarto agudo de miocardio.",
      "Accidente cerebrovascular (ACV)."
    ],
    cronicas: [
      "Insuficiencia renal.",
      "Cardiopatía hipertensiva (hipertrofia ventricular, insuficiencia cardíaca).",
      "Retinopatía hipertensiva.",
      "Aneurisma aórtico."
    ],
    signos_alarma: [
      "Dolor de cabeza intenso.",
      "Pérdida súbita de visión.",
      "Dolor torácico o dificultad para respirar.",
      "Edema en piernas o cara."
    ]
  },
  nutricion_ejercicio: {
    dietas: [
      "Dieta DASH (rica en frutas, verduras, lácteos bajos en grasa, cereales integrales, pescado y pollo).",
      "Reducción de sal (<5g/día).",
      "Evitar alimentos ultraprocesados, embutidos, enlatados.",
      "Limitar alcohol."
    ],
    ejercicio: [
      "Ejercicio aeróbico (caminar, correr, nadar, bicicleta) y de fuerza.",
      "Al menos 150 minutos semanales.",
      "Ayuda a controlar presión y peso.",
      "Consultar al médico antes de iniciar actividad intensa."
    ],
    menus_saludables: [
      {
        nombre: "Desayuno",
        ejemplo: "Avena con leche descremada, rodajas de plátano, nueces y 1 vaso de agua."
      },
      {
        nombre: "Almuerzo",
        ejemplo: "Filete de pollo a la plancha, ensalada de lechuga, tomate, aguacate, arroz integral y fruta de postre."
      },
      {
        nombre: "Merienda",
        ejemplo: "Yogur natural sin azúcar y frutos secos."
      },
      {
        nombre: "Cena",
        ejemplo: "Pescado al horno, verduras al vapor y papa asada."
      },
      {
        nombre: "Snacks opcionales",
        ejemplo: "Palitos de zanahoria, rodajas de pepino, frutas frescas."
      }
    ]
  },
  psicosocial: {
    apoyo: [
      "Educación continua y acompañamiento psicológico.",
      "Grupos de apoyo y asociaciones de hipertensos.",
      "Información y asesoría sobre derechos y acceso a tratamiento."
    ],
    derechos: [
      "Acceso a tratamiento y monitoreo.",
      "Confidencialidad y no discriminación.",
      "Derecho a una vida activa y plena."
    ]
  },
  recursos: [
    { tipo: "Guía paciente OMS", url: "https://www.who.int/es/news-room/fact-sheets/detail/hypertension" },
    { tipo: "Guía profesional", url: "https://www.escardio.org/Guidelines" }
  ],
  alertas: [
    "Consultar urgente ante síntomas de crisis hipertensiva, dolor torácico o alteraciones neurológicas.",
    "No suspender el tratamiento sin consultar al médico.",
    "Avisar siempre al equipo de salud antes de tomar nuevos medicamentos o suplementos.",
    "Monitorear la presión regularmente."
  ],
  preguntas_frecuentes: [
    {
      pregunta: "¿Puedo tomar sal si tengo hipertensión?",
      respuesta: "Debes reducir el consumo de sal al mínimo. Prefiere especias, hierbas y alimentos frescos."
    },
    {
      pregunta: "¿Qué ejercicio es mejor para la presión alta?",
      respuesta: "El ejercicio aeróbico regular, como caminar, nadar o andar en bicicleta, es el más recomendado."
    },
    {
      pregunta: "¿La hipertensión se cura?",
      respuesta: "No se cura, pero puede controlarse muy bien con tratamiento y hábitos saludables."
    },
    {
      pregunta: "¿Es necesario tomar medicamentos toda la vida?",
      respuesta: "La mayoría de los pacientes requiere tratamiento a largo plazo, pero en algunos casos leves puede controlarse sólo con cambios de hábitos."
    },
    {
      pregunta: "¿Puedo tomar otros medicamentos?",
      respuesta: "Algunos medicamentos pueden aumentar la presión. Consulta siempre antes con tu equipo de salud."
    }
  ]
};
