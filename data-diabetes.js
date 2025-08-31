// data-diabetes.js
// Información integral y actualizada sobre Diabetes (prevención, diagnóstico, tratamiento, nutrición, ejercicio, complicaciones, mitos, alertas y recursos)

const DIABETES_INFO = {
  general: {
    definicion: "La diabetes es una enfermedad crónica caracterizada por niveles elevados de glucosa en sangre. Existen varios tipos, siendo los principales la diabetes tipo 1 (autoinmune, debut juvenil) y tipo 2 (relacionada con resistencia a la insulina y factores ambientales). También existen diabetes gestacional y otros tipos menos frecuentes.",
    estadisticas: "Más de 500 millones de personas viven con diabetes a nivel mundial. La prevalencia aumenta cada año. Con tratamiento y control adecuado, se puede prevenir la mayoría de complicaciones.",
    mitos: [
      "La diabetes no sólo afecta a personas mayores.",
      "No todos los diabéticos necesitan insulina.",
      "Comer azúcar no causa diabetes directamente.",
      "La diabetes puede controlarse y prevenir complicaciones con hábitos saludables.",
      "Las personas con diabetes pueden llevar una vida normal."
    ]
  },
  prevencion: {
    factores_riesgo: [
      "Sobrepeso y obesidad.",
      "Sedentarismo.",
      "Antecedentes familiares.",
      "Dieta alta en azúcares y grasas.",
      "Hipertensión arterial.",
      "Edad mayor de 45 años."
    ],
    estrategias: [
      "Mantener peso saludable.",
      "Realizar actividad física regularmente (al menos 150 min/semana).",
      "Alimentación balanceada, rica en fibra y baja en azúcares.",
      "Evitar tabaco y alcohol.",
      "Controlar presión arterial y colesterol."
    ],
    recursos: [
      { tipo: "Infografía", url: "https://www.who.int/es/news-room/fact-sheets/detail/diabetes" },
      { tipo: "Video", url: "https://www.youtube.com/watch?v=6J3EbpqOi0w" }
    ]
  },
  diagnostico: {
    criterios: [
      "Glucosa en ayunas ≥ 126 mg/dL.",
      "Glucosa postprandial (2h) ≥ 200 mg/dL.",
      "Hemoglobina glucosilada (HbA1c) ≥ 6.5%.",
      "Síntomas clásicos y glucosa casual ≥ 200 mg/dL.",
      "Test de tolerancia a la glucosa."
    ],
    recomendaciones: "Realizar control anual en personas de riesgo y al menos cada 3 años en adultos mayores de 45 años."
  },
  tratamiento: {
    esquemas: [
      "Tipo 1: Insulinoterapia intensiva, monitorización frecuente, educación y soporte.",
      "Tipo 2: Cambios de estilo de vida, metformina como primera línea, otros antidiabéticos orales (sulfonilureas, DPP-4, SGLT2), insulina si es necesario.",
      "Gestacional: Control estricto, dieta, insulina si no se logra objetivo.",
      "Individualizar el tratamiento según edad, comorbilidades y preferencias."
    ],
    adherencia: "El éxito depende de la constancia en el tratamiento, monitoreo regular y ajustes según evolución.",
    monitoreo: [
      "Autocontrol de glucosa capilar.",
      "HbA1c cada 3-6 meses.",
      "Monitoreo de presión arterial, lípidos y función renal.",
      "Evaluación de pies, ojos y función cardíaca."
    ],
    efectos_adversos: [
      "Hipoglucemia (bajada brusca de azúcar).",
      "Molestias gastrointestinales (metformina).",
      "Aumento de peso (insulina, sulfonilureas).",
      "Riesgo cardiovascular y renal."
    ]
  },
  complicaciones: {
    agudas: [
      "Hipoglucemia: sudor, temblor, confusión, pérdida de conciencia.",
      "Cetoacidosis diabética: dolor abdominal, vómitos, respiración rápida, coma.",
      "Estado hiperglucémico hiperosmolar."
    ],
    cronicas: [
      "Retinopatía diabética (ceguera).",
      "Nefropatía diabética (insuficiencia renal).",
      "Neuropatía periférica (dolor, pérdida de sensibilidad).",
      "Pie diabético (úlceras, amputaciones).",
      "Enfermedad cardiovascular (infarto, ACV)."
    ],
    signos_alarma: [
      "Visión borrosa.",
      "Heridas que no cicatrizan.",
      "Dolor o adormecimiento en pies y manos.",
      "Orina espumosa.",
      "Dolor torácico o dificultad para respirar."
    ]
  },
  nutricion_ejercicio: {
    dietas: [
      "Dieta rica en fibra, frutas, verduras, cereales integrales y proteínas magras.",
      "Evitar azúcares simples y grasas saturadas.",
      "Preferir el consumo de agua sobre bebidas azucaradas.",
      "Control de porciones y horarios fijos de comida."
    ],
    ejercicio: [
      "Ejercicio aeróbico (caminar, correr, nadar, bicicleta) y de fuerza.",
      "Al menos 150 minutos semanales.",
      "Ayuda a mejorar sensibilidad a la insulina y controlar peso.",
      "Consultar al médico antes de iniciar actividad intensa."
    ],
    menus_saludables: [
      {
        nombre: "Desayuno",
        ejemplo: "1 vaso de leche descremada, 1 rebanada de pan integral con queso fresco bajo en grasa, 1 fruta (manzana o pera), 1 cucharadita de semillas de chía."
      },
      {
        nombre: "Almuerzo",
        ejemplo: "Ensalada mixta (lechuga, tomate, zanahoria, pepino), 1 porción de pollo a la plancha, 1 taza de arroz integral, 1 fruta de postre."
      },
      {
        nombre: "Merienda",
        ejemplo: "Yogur descremado sin azúcar y frutos secos (nuez, almendra)."
      },
      {
        nombre: "Cena",
        ejemplo: "Pescado al horno, verduras salteadas (brócoli, calabacín, espinaca), 1 papa pequeña asada, agua o infusión sin azúcar."
      },
      {
        nombre: "Snacks opcionales",
        ejemplo: "Palitos de zanahoria, rodajas de pepino, 1 puñado de frutos secos sin sal."
      }
    ]
  },
  psicosocial: {
    apoyo: [
      "Educación continua y acompañamiento psicológico.",
      "Grupos de apoyo y asociaciones de diabéticos.",
      "Información y asesoría sobre derechos y acceso a tratamiento."
    ],
    derechos: [
      "Acceso a tratamiento y monitoreo.",
      "Confidencialidad y no discriminación.",
      "Derecho a una vida activa y plena."
    ]
  },
  recursos: [
    { tipo: "Guía paciente OMS", url: "https://www.who.int/es/news-room/fact-sheets/detail/diabetes" },
    { tipo: "Guía profesional", url: "https://www.idf.org/e-library/guidelines.html" }
  ],
  alertas: [
    "Consultar urgente ante síntomas de hipoglucemia o hiperglucemia.",
    "No suspender el tratamiento sin consultar al médico.",
    "Avisar siempre al equipo de salud antes de tomar nuevos medicamentos o suplementos.",
    "Revisar los pies diariamente."
  ],
  preguntas_frecuentes: [
    {
      pregunta: "¿Puedo comer frutas si tengo diabetes?",
      respuesta: "Sí, pero preferentemente frutas enteras y frescas, en porciones controladas. Evita jugos y frutas en almíbar."
    },
    {
      pregunta: "¿Qué hago si me da una hipoglucemia?",
      respuesta: "Consume rápidamente 15 g de carbohidratos de absorción rápida (ejemplo: 1 vaso de jugo, 3 caramelos, 2 sobres de azúcar), espera 15 minutos y vuelve a medir glucemia."
    },
    {
      pregunta: "¿El ejercicio es seguro para mí?",
      respuesta: "Sí, siempre que esté adaptado a tu condición y supervisado por el médico. El ejercicio regular mejora el control glucémico y tu salud general."
    },
    {
      pregunta: "¿Puedo tomar cualquier medicamento?",
      respuesta: "No, algunos medicamentos pueden alterar el control glucémico. Consulta siempre antes con tu equipo de salud."
    },
    {
      pregunta: "¿La diabetes es curable?",
      respuesta: "No, pero puede controlarse muy bien. Con buen tratamiento y hábitos saludables, puedes llevar una vida plena."
    }
  ]
};
