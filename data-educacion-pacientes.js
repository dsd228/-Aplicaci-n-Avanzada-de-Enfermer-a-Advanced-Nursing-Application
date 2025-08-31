// data-educacion-pacientes.js
// Información integral para educación de pacientes y familiares (conceptos clave, autocuidado, comunicación, derechos, recursos, preguntas frecuentes)

const EDUCACION_PACIENTES_INFO = {
  general: {
    definicion: "La educación para pacientes y familiares busca empoderar a las personas en el manejo de su salud, mejorar la adherencia al tratamiento, reducir complicaciones y fomentar el autocuidado.",
    importancia: [
      "Mejora la calidad de vida y el pronóstico.",
      "Fomenta la autonomía y la toma de decisiones informadas.",
      "Reduce la ansiedad y el miedo ante enfermedades.",
      "Facilita la comunicación con el equipo de salud."
    ]
  },
  autocuidado: {
    recomendaciones: [
      "Conocer y entender tu diagnóstico.",
      "Seguir las indicaciones médicas y no suspender tratamientos sin consultar.",
      "Mantener hábitos saludables: dieta, ejercicio, higiene.",
      "Monitorear signos de alarma y consultar ante cambios.",
      "Gestionar emociones y buscar apoyo psicológico si es necesario."
    ]
  },
  comunicación: {
    consejos: [
      "Preparar preguntas antes de la consulta.",
      "Registrar síntomas, medicamentos y dudas en un cuaderno.",
      "Solicitar explicaciones claras y repetirlas para confirmar comprensión.",
      "Incluir familiares o cuidadores en la consulta cuando sea posible.",
      "Mantener contacto regular con el equipo de salud."
    ]
  },
  derechos: [
    "Acceso a información clara y completa sobre el diagnóstico y tratamiento.",
    "Confidencialidad y respeto.",
    "Participación activa en decisiones de salud.",
    "Recibir trato digno, sin discriminación.",
    "Solicitar segunda opinión médica."
  ],
  recursos: [
    { tipo: "Guía paciente OMS", url: "https://www.who.int/es/news-room/fact-sheets/detail/patient-rights" },
    { tipo: "Video educativo", url: "https://www.youtube.com/watch?v=pg1qL2qnQpM" },
    { tipo: "Material para familiares", url: "https://www.cdc.gov/spanish/healthy/patient-education.html" }
  ],
  preguntas_frecuentes: [
    {
      pregunta: "¿Qué debo preguntar en mi consulta médica?",
      respuesta: "Sobre el diagnóstico, opciones de tratamiento, efectos adversos, medidas de autocuidado y próximos pasos."
    },
    {
      pregunta: "¿Cómo puedo participar en mi tratamiento?",
      respuesta: "Informándote, preguntando dudas, siguiendo indicaciones y comunicando cualquier síntoma nuevo."
    },
    {
      pregunta: "¿Qué hacer si no entiendo lo que dice mi médico?",
      respuesta: "Solicita que te expliquen de otra forma, pide ejemplos o materiales escritos y no tengas miedo de preguntar varias veces."
    },
    {
      pregunta: "¿Cómo apoyar a un familiar enfermo?",
      respuesta: "Escúchalo, acompáñalo a consultas, ayúdalo con el tratamiento y busca apoyo profesional si lo necesita."
    },
    {
      pregunta: "¿Dónde encuentro información confiable?",
      respuesta: "En sitios oficiales de salud, hospitales y organizaciones reconocidas. Evita información sin respaldo científico."
    }
  ]
};
