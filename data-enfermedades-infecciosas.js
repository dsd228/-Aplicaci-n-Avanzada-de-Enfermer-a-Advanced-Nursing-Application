// data-enfermedades-infecciosas.js
// Información integral sobre Enfermedades Infecciosas Comunes (definición, prevención, síntomas, diagnóstico, tratamiento, complicaciones, recursos, preguntas frecuentes)

const ENFERMEDADES_INFECCIOSAS_INFO = {
  general: {
    definicion: "Las enfermedades infecciosas son causadas por microorganismos como virus, bacterias, hongos y parásitos. Son responsables de gran parte de las consultas y hospitalizaciones.",
    importancia: [
      "Identificación temprana evita complicaciones y la transmisión.",
      "La prevención y el tratamiento adecuado salvan vidas.",
      "La educación reduce mitos y conductas de riesgo."
    ]
  },
  principales_enfermedades: [
    {
      nombre: "Resfriado común y gripe",
      agente: "Virus respiratorios (rinovirus, influenza)",
      sintomas: ["Fiebre", "Tos", "Congestión nasal", "Dolor de garganta", "Malestar general"],
      prevencion: ["Lavado frecuente de manos", "Cubrirse al toser/estornudar", "Evitar contacto con enfermos", "Vacuna antigripal anual"],
      tratamiento: ["Reposo", "Hidratación", "Medicamentos sintomáticos", "Consulta médica si fiebre alta o dificultad respiratoria"]
    },
    {
      nombre: "Gastroenteritis",
      agente: "Virus (rotavirus, norovirus), bacterias (E. coli, Salmonella)",
      sintomas: ["Diarrea", "Vómitos", "Dolor abdominal", "Fiebre"],
      prevencion: ["Lavado de manos", "Consumo de agua y alimentos seguros", "Higiene en la preparación de alimentos"],
      tratamiento: ["Reposo", "Hidratación oral", "Soluciones de rehidratación", "Consulta médica si diarrea sanguinolenta, fiebre alta o deshidratación"]
    },
    {
      nombre: "Infección urinaria",
      agente: "Bacterias (E. coli)",
      sintomas: ["Dolor o ardor al orinar", "Necesidad frecuente de orinar", "Orina turbia o con mal olor", "Dolor lumbar"],
      prevencion: ["Correcta higiene genital", "Evitar retener la orina", "Beber suficiente agua"],
      tratamiento: ["Antibióticos según indicación médica", "Hidratación", "Consulta médica ante fiebre o dolor intenso"]
    },
    {
      nombre: "Neumonía",
      agente: "Virus y bacterias (Streptococcus pneumoniae)",
      sintomas: ["Fiebre alta", "Tos con flema", "Dificultad respiratoria", "Dolor torácico"],
      prevencion: ["Vacunación (neumococo, influenza)", "Evitar el humo de tabaco", "Lavado de manos"],
      tratamiento: ["Antibióticos o antivirales según causa", "Oxigenoterapia si es necesario", "Hospitalización en casos graves"]
    },
    {
      nombre: "COVID-19",
      agente: "Coronavirus SARS-CoV-2",
      sintomas: ["Fiebre", "Tos seca", "Pérdida de olfato/gusto", "Dificultad respiratoria", "Fatiga"],
      prevencion: ["Vacunación", "Uso de mascarilla", "Distancia física", "Higiene de manos"],
      tratamiento: ["Reposo", "Hidratación", "Tratamiento sintomático", "Consulta médica ante dificultad respiratoria"]
    },
    {
      nombre: "Tuberculosis",
      agente: "Mycobacterium tuberculosis",
      sintomas: ["Tos persistente", "Fiebre vespertina", "Sudoración nocturna", "Pérdida de peso"],
      prevencion: ["Vacuna BCG", "Detección y tratamiento precoz", "Ventilación adecuada de ambientes"],
      tratamiento: ["Antituberculosos por 6 meses", "Supervisión médica", "Aislamiento durante fase contagiosa"]
    }
  ],
  complicaciones: [
    "Deshidratación severa y shock",
    "Neumonía grave y falla respiratoria",
    "Sepsis",
    "Daño renal o hepático",
    "Secuelas neurológicas"
  ],
  recursos: [
    { tipo: "Guía OMS enfermedades infecciosas", url: "https://www.who.int/es/news-room/fact-sheets/detail/infectious-diseases" },
    { tipo: "Material educativo CDC", url: "https://www.cdc.gov/spanish/infectiousdiseases/index.html" },
    { tipo: "Vacunas y prevención", url: "https://www.who.int/es/health-topics/vaccines-and-immunization" }
  ],
  alertas: [
    "Consulta urgente ante fiebre alta persistente, dificultad respiratoria, vómitos o diarrea incontrolable, alteración del estado de conciencia.",
    "No automedicarse con antibióticos.",
    "Aislamiento ante sospecha de enfermedades contagiosas.",
    "Completar esquemas de vacunación."
  ],
  preguntas_frecuentes: [
    {
      pregunta: "¿Cuándo debo consultar al médico por una infección?",
      respuesta: "Si tienes fiebre alta, dificultad respiratoria, dolor intenso, vómitos persistentes, sangrado, o si los síntomas no mejoran en 2-3 días."
    },
    {
      pregunta: "¿Por qué no debo tomar antibióticos sin receta?",
      respuesta: "El mal uso de antibióticos causa resistencia bacteriana y puede empeorar la enfermedad."
    },
    {
      pregunta: "¿Las vacunas son seguras?",
      respuesta: "Sí, las vacunas son seguras y efectivas para prevenir muchas enfermedades graves."
    },
    {
      pregunta: "¿Cómo prevenir infecciones en casa?",
      respuesta: "Lavado de manos frecuente, evitar compartir utensilios, desinfectar superficies, ventilar ambientes y mantener vacunas al día."
    },
    {
      pregunta: "¿Qué hago si tengo contacto con alguien con enfermedad contagiosa?",
      respuesta: "Monitorea tus síntomas, mantén higiene, consulta ante signos de enfermedad y sigue indicaciones de salud pública."
    }
  ]
};
