// data-emergencia.js
// Información integral y actualizada sobre Protocolos de Emergencia hospitalaria y comunitaria (conceptos, pasos, primeros auxilios, manejo de situaciones críticas, recursos y preguntas frecuentes)

const EMERGENCIA_INFO = {
  general: {
    definicion: "Los protocolos de emergencia son procedimientos estructurados para actuar rápidamente ante situaciones críticas de salud o accidentes, minimizando daños y salvando vidas.",
    importancia: [
      "Permiten respuestas rápidas y efectivas.",
      "Reducen complicaciones, mortalidad y secuelas.",
      "Facilitan el trabajo coordinado entre personal de salud y comunidad.",
      "Brindan confianza y orden ante el caos."
    ]
  },
  tipos_emergencia: [
    "Paro cardíaco (PCR)",
    "Infarto agudo de miocardio",
    "ACV (accidente cerebrovascular)",
    "Trauma y fracturas",
    "Hemorragias masivas",
    "Convulsiones",
    "Shock anafiláctico",
    "Dificultad respiratoria/aguda",
    "Intoxicaciones",
    "Quemaduras",
    "Accidentes eléctricos",
    "Emergencias pediátricas",
    "Emergencias obstétricas"
  ],
  pasos_generales: [
    "Mantener la calma y evaluar la seguridad de la escena.",
    "Solicitar ayuda (activación del sistema de emergencias 911/local).",
    "Valorar estado de consciencia y respiración.",
    "Iniciar maniobras de primeros auxilios según necesidad.",
    "No abandonar al paciente hasta que llegue ayuda profesional.",
    "Informar claramente sobre lo ocurrido."
  ],
  primeros_auxilios: [
    {
      nombre: "Paro cardíaco (PCR)",
      pasos: [
        "Confirmar inconsciencia y ausencia de respiración.",
        "Solicitar ayuda y desfibrilador externo automático (DEA).",
        "Iniciar RCP (compresiones torácicas: 100-120/min, profundidad 5-6 cm).",
        "Desfibrilar si hay DEA disponible.",
        "Continuar hasta llegada de profesionales o recuperación."
      ]
    },
    {
      nombre: "Infarto agudo de miocardio",
      pasos: [
        "Solicitar ayuda inmediata.",
        "Sentar al paciente y mantenerlo tranquilo.",
        "Administrar aspirina (160-325 mg si no contraindicado).",
        "Monitorear pulso y respiración.",
        "Preparar para traslado urgente."
      ]
    },
    {
      nombre: "ACV",
      pasos: [
        "Solicitar ayuda inmediata.",
        "No administrar alimentos ni bebidas.",
        "Colocar en posición segura.",
        "Monitorear signos vitales.",
        "Traslado urgente a centro especializado."
      ]
    },
    {
      nombre: "Convulsiones",
      pasos: [
        "No sujetar ni poner objetos en la boca.",
        "Proteger la cabeza y despejar el entorno.",
        "Colocar de costado tras el episodio.",
        "Solicitar ayuda si dura >5 min o hay lesiones."
      ]
    },
    {
      nombre: "Hemorragias",
      pasos: [
        "Presionar directamente sobre la herida con tela limpia.",
        "Elevar la zona afectada si es posible.",
        "No retirar objetos incrustados.",
        "Solicitar ayuda profesional."
      ]
    },
    {
      nombre: "Shock anafiláctico",
      pasos: [
        "Solicitar ayuda inmediata.",
        "Administrar adrenalina IM si está disponible.",
        "Colocar al paciente en posición supina.",
        "Monitorear respiración y pulso."
      ]
    },
    {
      nombre: "Trauma y fracturas",
      pasos: [
        "No movilizar la zona afectada.",
        "Inmovilizar si es posible.",
        "Controlar hemorragias.",
        "Solicitar traslado urgente."
      ]
    },
    {
      nombre: "Quemaduras",
      pasos: [
        "Enfriar la zona con agua corriente (no hielo) por varios minutos.",
        "Cubrir con tela limpia sin apretar.",
        "No aplicar cremas ni remedios caseros.",
        "Solicitar ayuda si es extensa o afecta cara/genitales."
      ]
    },
    {
      nombre: "Intoxicaciones",
      pasos: [
        "Retirar la fuente de intoxicación si es seguro.",
        "No inducir el vómito salvo indicación médica.",
        "Solicitar ayuda y dar información sobre el tóxico."
      ]
    }
  ],
  manejo_hospitalario: [
    "Triángulo de seguridad y clasificación (triage).",
    "Evaluación rápida ABCDE (Aire, Breathing, Circulation, Disability, Exposure).",
    "Monitoreo constante de signos vitales.",
    "Uso de protocolos internacionales (ACLS, ATLS, PALS según edad y situación).",
    "Documentación precisa y comunicación efectiva con el equipo.",
    "Activación de equipos multidisciplinarios cuando corresponde."
  ],
  recursos: [
    { tipo: "Guía primeros auxilios Cruz Roja", url: "https://www.cruzroja.es/cre_web/prevencion-salud/primeros-auxilios" },
    { tipo: "Video RCP", url: "https://www.youtube.com/watch?v=ZyPp06s1Rvc" },
    { tipo: "Protocolo ACLS", url: "https://www.heart.org/es/health-topics/cardiac-arrest/acls" }
  ],
  alertas: [
    "No dejar nunca solo a un paciente grave.",
    "Solicitar ayuda profesional ante cualquier duda.",
    "No administrar medicamentos sin indicación médica.",
    "No movilizar pacientes con posible trauma grave.",
    "Actualizar capacitaciones regularmente."
  ],
  preguntas_frecuentes: [
    {
      pregunta: "¿Qué hago si alguien pierde el conocimiento?",
      respuesta: "Verifica respiración y pulso, solicita ayuda, inicia RCP si es necesario y sigue instrucciones del operador de emergencia."
    },
    {
      pregunta: "¿Es seguro usar un DEA?",
      respuesta: "Sí, los DEA están diseñados para ser seguros y fáciles de usar por cualquier persona siguiendo las instrucciones."
    },
    {
      pregunta: "¿Debo mover a una persona accidentada?",
      respuesta: "Solo si corre peligro inmediato (fuego, colapso), de lo contrario, inmoviliza y espera ayuda profesional."
    },
    {
      pregunta: "¿Qué hago ante una convulsión?",
      respuesta: "Protege la cabeza, despeja el entorno, no metas nada en la boca, coloca de costado tras el episodio y solicita ayuda si dura más de 5 minutos."
    },
    {
      pregunta: "¿Cómo reconozco una emergencia?",
      respuesta: "Dificultad para respirar, dolor torácico intenso, pérdida de conciencia, hemorragia intensa, convulsiones, quemaduras extensas, intoxicaciones o trauma grave."
    }
  ]
};
