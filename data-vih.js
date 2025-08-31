// data-vih.js
// Información integral y actualizada sobre VIH/SIDA (prevención, etapas, tratamiento, vida, nutrición, ejercicio, mitos, alertas y recursos)

const VIH_INFO = {
  general: {
    definicion: "El VIH (Virus de la Inmunodeficiencia Humana) es un virus que ataca el sistema inmunitario, debilitando las defensas y predisponiendo a infecciones y cánceres oportunistas. El SIDA es la etapa avanzada, cuando aparecen estas complicaciones.",
    estadisticas: "Más de 38 millones de personas viven con VIH en el mundo. Con tratamiento adecuado, la esperanza de vida es prácticamente igual a la población general.",
    mitos: [
      "El VIH no se transmite por contacto casual (besos, abrazos, compartir cubiertos).",
      "No se adquiere por picaduras de insectos.",
      "Las personas con VIH pueden tener hijos sanos con control médico.",
      "El tratamiento permite una vida normal.",
      "El VIH no es sinónimo de SIDA."
    ]
  },
  prevencion: {
    metodos: [
      "Uso correcto y constante del preservativo en todas las relaciones sexuales.",
      "Profilaxis pre-exposición (PrEP) indicada en personas con alto riesgo, se toma diariamente y reduce el riesgo de adquirir VIH.",
      "Profilaxis post-exposición (PEP) disponible hasta 72h después de una situación de riesgo para evitar la infección.",
      "Prevención de transmisión vertical (madre a hijo) mediante TARV en embarazo, parto y lactancia.",
      "Evitar compartir agujas y jeringas.",
      "Promover educación sexual, testeo regular y reducción de estigma."
    ],
    recursos: [
      { tipo: "Infografía", url: "https://www.who.int/es/news-room/fact-sheets/detail/hiv-aids" },
      { tipo: "Video", url: "https://www.youtube.com/watch?v=2zW3E85N9Sg" }
    ]
  },
  diagnostico: {
    pruebas: [
      "Pruebas rápidas de anticuerpos (resultado en minutos).",
      "ELISA y Western Blot: confirmación de diagnóstico.",
      "PCR para carga viral: útil para diagnóstico temprano y control de tratamiento.",
      "Ventana inmunológica: el test puede ser negativo durante las primeras 2-4 semanas tras la exposición."
    ],
    recomendaciones: "Testeo regular en personas sexualmente activas, embarazadas y quienes hayan tenido prácticas de riesgo."
  },
  tratamiento: {
    esquemas: [
      "Terapia antirretroviral combinada (TARV), actualmente se recomienda iniciar tratamiento inmediatamente tras el diagnóstico.",
      "Tri-zevuvir: Emtricitabina 200mg, Tenofovir alafenamida 25mg, Dolutegravir 50mg.",
      "Otros esquemas: Abacavir, Lamivudina, Efavirenz, Ritonavir, Atazanavir, Darunavir, entre otros."
    ],
    adherencia: "Tomar la medicación diaria, sin saltar dosis, es clave para evitar resistencias y mantener la carga viral indetectable.",
    monitoreo: [
      "Carga viral indetectable = no transmisible (U=U).",
      "Conteo de linfocitos CD4 para evaluar inmunidad.",
      "Control de función renal y hepática."
    ],
    efectos_adversos: [
      "Molestias digestivas, fatiga, alteraciones hepáticas o renales.",
      "Cambios en lípidos o glucosa, riesgo cardiovascular.",
      "Toxicidad ósea (tenofovir)."
    ]
  },
  etapas: {
    primoinfeccion: "Síntomas similares a gripe (fiebre, dolor de garganta, ganglios inflamados), dura 1-2 semanas y suele pasar desapercibida.",
    latencia: "Etapa asintomática, puede durar más de 10 años si no se trata. El virus sigue replicándose y dañando el sistema inmune.",
    sida: "Definido por infecciones oportunistas graves (neumonía, toxoplasmosis, tuberculosis) o conteo CD4 menor a 200 células/mm³.",
    promedio_vida: "Con TARV y control adecuado, los pacientes pueden vivir más de 30 años tras el diagnóstico, y la expectativa de vida es similar a la población general."
  },
  nutricion_ejercicio: {
    dietas: [
      "Seguir una dieta equilibrada, rica en frutas, verduras, proteínas magras y cereales integrales.",
      "Evitar grasas saturadas y azúcar en exceso.",
      "Mantener peso adecuado, evitar obesidad y desnutrición.",
      "Suplementar micronutrientes si hay déficit (vitamina D, calcio, hierro)."
    ],
    ejercicio: [
      "Ejercicio aeróbico y de fuerza, al menos 150 minutos semanales.",
      "Adaptar el tipo de ejercicio al estado físico y comorbilidades.",
      "El ejercicio mejora la inmunidad, el ánimo y previene comorbilidades."
    ]
  },
  psicosocial: {
    apoyo: [
      "Acompañamiento psicológico y psiquiátrico si es necesario.",
      "Grupos de apoyo, asociaciones y ONGs.",
      "Información y educación sobre el diagnóstico y tratamiento."
    ],
    derechos: [
      "Confidencialidad total del diagnóstico.",
      "No discriminación laboral ni educativa.",
      "Acceso universal y gratuito al tratamiento en la mayoría de países.",
      "Derecho a formar pareja y tener hijos con asesoría médica."
    ]
  },
  recursos: [
    { tipo: "Guía paciente OMS", url: "https://www.who.int/es/news-room/fact-sheets/detail/hiv-aids" },
    { tipo: "Guía profesional", url: "https://www.cdc.gov/hiv/spanish/basics/index.html" }
  ],
  alertas: [
    "Consulta urgente si fiebre persistente, pérdida de peso rápida, sudores nocturnos, dificultad respiratoria o lesiones en piel.",
    "Ante exposición accidental (salpicadura, pinchazo, relación sexual sin protección), acudir en menos de 72h para PEP.",
    "Nunca suspender el tratamiento sin consultar al médico.",
    "Avisar siempre al equipo de salud antes de tomar nuevos medicamentos o suplementos."
  ]
};

// Puedes complementar con links oficiales, imágenes y materiales educativos para pacientes y profesionales.
// Deja espacio para agregar noticias, actualizaciones y enlaces a recursos locales.
