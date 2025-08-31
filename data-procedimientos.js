// data-procedimientos.js
// Procedimientos clínicos por categoría, con ejemplos reales y extensos

const PROCEDIMIENTOS = {
  higiene: [
    {
      titulo: 'Lavado de manos',
      desc: 'Prevención de infecciones. Usa agua y jabón o gel antiséptico, frota durante al menos 20 segundos. Es esencial antes y después de cada contacto con pacientes.',
      nivel: 'leve',
      img: 'https://img.freepik.com/foto-gratis/primer-plano-manos-lavandose_23-2148502858.jpg',
      credit: 'https://www.freepik.es/foto-gratis/primer-plano-manos-lavandose_23-2148502858.html'
    },
    {
      titulo: 'Uso correcto de guantes',
      desc: 'Colocar guantes limpios y retirarlos sin tocar la parte externa para evitar contaminación cruzada.',
      nivel: 'leve',
      img: 'https://img.freepik.com/foto-gratis/cerrar-manos-guantes-latex_1150-11187.jpg',
      credit: 'https://www.freepik.es/foto-gratis/cerrar-manos-guantes-latex_1150-11187.html'
    },
    {
      titulo: 'Desinfección de superficies',
      desc: 'Limpiar y desinfectar las superficies de trabajo y equipos médicos antes y después de cada uso.',
      nivel: 'moderate',
      img: 'https://img.freepik.com/foto-gratis/desinfectando-manos_23-2148493587.jpg',
      credit: 'https://www.freepik.es/foto-gratis/desinfectando-manos_23-2148493587.html'
    },
    {
      titulo: 'No lavado de manos',
      desc: 'Omitir el lavado de manos es una de las principales causas de infecciones nosocomiales.',
      nivel: 'fatal',
      img: 'https://img.freepik.com/foto-gratis/doctora-mascarilla-medica-guantes-latex-lavando-manos-clinica_1157-46487.jpg',
      credit: 'https://www.freepik.es/foto-gratis/doctora-mascarilla-medica-guantes-latex-lavando-manos-clinica_1157-46487.html'
    }
  ],
  farmaco: [
    {
      titulo: 'Administración oral segura',
      desc: 'Verificar los 5 correctos: paciente, medicamento, dosis, vía y hora. Documentar inmediatamente después.',
      nivel: 'leve',
      img: 'https://img.freepik.com/foto-gratis/medicamento-mano-pastilla_1157-46464.jpg',
      credit: 'https://www.freepik.es/foto-gratis/medicamento-mano-pastilla_1157-46464.html'
    },
    {
      titulo: 'Dosis incorrecta',
      desc: 'Una dosis excesiva o insuficiente puede ser fatal, especialmente con medicamentos de margen terapéutico estrecho.',
      nivel: 'fatal',
      img: 'https://img.freepik.com/foto-gratis/medicamento-pastillas_1157-46466.jpg',
      credit: 'https://www.freepik.es/foto-gratis/medicamento-pastillas_1157-46466.html'
    },
    {
      titulo: 'No verificar alergias',
      desc: 'Administrar medicamentos sin verificar alergias puede provocar reacciones graves.',
      nivel: 'moderate',
      img: 'https://img.freepik.com/foto-gratis/inyeccion-paciente-hospital_1157-46476.jpg',
      credit: 'https://www.freepik.es/foto-gratis/inyeccion-paciente-hospital_1157-46476.html'
    },
    {
      titulo: 'Dilución incorrecta de antibióticos',
      desc: 'La dilución incorrecta puede causar ineficacia o toxicidad.',
      nivel: 'moderate',
      img: 'https://img.freepik.com/foto-gratis/medico-preparando-inyeccion_1157-46468.jpg',
      credit: 'https://www.freepik.es/foto-gratis/medico-preparando-inyeccion_1157-46468.html'
    }
  ],
  curaciones: [
    {
      titulo: 'Curación de herida limpia',
      desc: 'Usar material estéril, limpiar con solución salina y cubrir con apósito adecuado.',
      nivel: 'leve',
      img: 'https://img.freepik.com/foto-gratis/curacion-herida-pierna_1157-46484.jpg',
      credit: 'https://www.freepik.es/foto-gratis/curacion-herida-pierna_1157-46484.html'
    },
    {
      titulo: 'No cambiar apósito infectado',
      desc: 'Mantener un apósito infectado puede causar sepsis.',
      nivel: 'fatal',
      img: 'https://img.freepik.com/foto-gratis/infeccion-piel-curacion_1157-46486.jpg',
      credit: 'https://www.freepik.es/foto-gratis/infeccion-piel-curacion_1157-46486.html'
    }
  ],
  emergencias: [
    {
      titulo: 'RCP básica correctamente aplicada',
      desc: 'Compresiones torácicas de calidad y ventilación adecuada según protocolo internacional.',
      nivel: 'leve',
      img: 'https://img.freepik.com/foto-gratis/primeros-auxilios-reanimacion-cardiopulmonar_1157-33804.jpg',
      credit: 'https://www.freepik.es/foto-gratis/primeros-auxilios-reanimacion-cardiopulmonar_1157-33804.html'
    },
    {
      titulo: 'No iniciar RCP en paro cardiorrespiratorio',
      desc: 'Omitir RCP en un paro cardiorrespiratorio resulta en muerte segura.',
      nivel: 'fatal',
      img: 'https://img.freepik.com/foto-gratis/equipo-medico-emergencia_1157-46488.jpg',
      credit: 'https://www.freepik.es/foto-gratis/equipo-medico-emergencia_1157-46488.html'
    }
  ],
  pediatria: [
    {
      titulo: 'Vacunación infantil completa',
      desc: 'Cumplir el calendario de vacunación nacional evita enfermedades graves como sarampión y polio.',
      nivel: 'leve',
      img: 'https://img.freepik.com/foto-gratis/enfermera-vacunando-nino_1157-46470.jpg',
      credit: 'https://www.freepik.es/foto-gratis/enfermera-vacunando-nino_1157-46470.html'
    },
    {
      titulo: 'No verificar alergias en niños',
      desc: 'Administrar medicamentos sin verificar alergias puede ser fatal en pediatría.',
      nivel: 'fatal',
      img: 'https://img.freepik.com/foto-gratis/nino-enfermo-mama_1157-46483.jpg',
      credit: 'https://www.freepik.es/foto-gratis/nino-enfermo-mama_1157-46483.html'
    }
  ],
  quirurgicos: [
    {
      titulo: 'Preparación prequirúrgica',
      desc: 'Asegurar ayuno, pruebas preoperatorias y consentimiento informado antes de la cirugía.',
      nivel: 'moderate',
      img: 'https://img.freepik.com/foto-gratis/equipo-cirugia-preparacion_1157-46490.jpg',
      credit: 'https://www.freepik.es/foto-gratis/equipo-cirugia-preparacion_1157-46490.html'
    },
    {
      titulo: 'Fallo en asepsia quirúrgica',
      desc: 'No cumplir con la asepsia y antisepsia puede causar infecciones graves postoperatorias.',
      nivel: 'fatal',
      img: 'https://img.freepik.com/foto-gratis/cirujano-operando_1157-46491.jpg',
      credit: 'https://www.freepik.es/foto-gratis/cirujano-operando_1157-46491.html'
    }
  ],
  obstetricia: [
    {
      titulo: 'Control prenatal regular',
      desc: 'Permite detectar y prevenir complicaciones maternas y fetales.',
      nivel: 'leve',
      img: 'https://img.freepik.com/foto-gratis/control-prenatal-embarazada_1157-46493.jpg',
      credit: 'https://www.freepik.es/foto-gratis/control-prenatal-embarazada_1157-46493.html'
    },
    {
      titulo: 'No monitorizar signos vitales en parto',
      desc: 'Omitir la monitorización puede causar desenlaces fatales.',
      nivel: 'fatal',
      img: 'https://img.freepik.com/foto-gratis/parto-cesarea-hospital_1157-46495.jpg',
      credit: 'https://www.freepik.es/foto-gratis/parto-cesarea-hospital_1157-46495.html'
    }
  ],
  oncologia: [
    {
      titulo: 'Quimioterapia segura',
      desc: 'Verificar dosis, vía e intervalos. Monitorizar efectos secundarios y neutropenia.',
      nivel: 'moderate',
      img: 'https://img.freepik.com/foto-gratis/paciente-oncologico-tratamiento_1157-46497.jpg',
      credit: 'https://www.freepik.es/foto-gratis/paciente-oncologico-tratamiento_1157-46497.html'
    },
    {
      titulo: 'No seguimiento postquimioterapia',
      desc: 'Omitir el control puede provocar complicaciones graves.',
      nivel: 'fatal',
      img: 'https://img.freepik.com/foto-gratis/complicaciones-oncologicas_1157-46498.jpg',
      credit: 'https://www.freepik.es/foto-gratis/complicaciones-oncologicas_1157-46498.html'
    }
  ],
  dermatologia: [
    {
      titulo: 'Biopsia cutánea',
      desc: 'Realizar bajo condiciones estériles y técnica adecuada para diagnóstico de lesiones.',
      nivel: 'moderate',
      img: 'https://img.freepik.com/foto-gratis/dermatologo-biopsia-piel_1157-46500.jpg',
      credit: 'https://www.freepik.es/foto-gratis/dermatologo-biopsia-piel_1157-46500.html'
    },
    {
      titulo: 'No tratar dermatitis severa',
      desc: 'Puede evolucionar a infección o complicaciones sistémicas.',
      nivel: 'fatal',
      img: 'https://img.freepik.com/foto-gratis/dermatitis-infeccion_1157-46501.jpg',
      credit: 'https://www.freepik.es/foto-gratis/dermatitis-infeccion_1157-46501.html'
    }
  ],
  oftalmologia: [
    {
      titulo: 'Aplicación correcta de colirios',
      desc: 'Evita contaminación y maximiza eficacia en tratamientos oculares.',
      nivel: 'leve',
      img: 'https://img.freepik.com/foto-gratis/aplicacion-colirio-ojo_1157-46503.jpg',
      credit: 'https://www.freepik.es/foto-gratis/aplicacion-colirio-ojo_1157-46503.html'
    },
    {
      titulo: 'No atender glaucoma agudo',
      desc: 'Puede causar ceguera irreversible.',
      nivel: 'fatal',
      img: 'https://img.freepik.com/foto-gratis/oftalmologo-paciente_1157-46504.jpg',
      credit: 'https://www.freepik.es/foto-gratis/oftalmologo-paciente_1157-46504.html'
    }
  ],
  psiquiatria: [
    {
      titulo: 'Evaluación de riesgo suicida',
      desc: 'Indispensable en pacientes con depresión o antecedentes psiquiátricos.',
      nivel: 'moderate',
      img: 'https://img.freepik.com/foto-gratis/psiquiatra-consulta_1157-46506.jpg',
      credit: 'https://www.freepik.es/foto-gratis/psiquiatra-consulta_1157-46506.html'
    },
    {
      titulo: 'No tratar episodio psicótico agudo',
      desc: 'Riesgo de daño a sí mismo y a otros.',
      nivel: 'fatal',
      img: 'https://img.freepik.com/foto-gratis/episodio-psicotico-hospital_1157-46507.jpg',
      credit: 'https://www.freepik.es/foto-gratis/episodio-psicotico-hospital_1157-46507.html'
    }
  ],
  nutricion: [
    {
      titulo: 'Evaluación nutricional completa',
      desc: 'Permite detectar desnutrición, obesidad y riesgo metabólico.',
      nivel: 'leve',
      img: 'https://img.freepik.com/foto-gratis/nutricionista-consulta_1157-46509.jpg',
      credit: 'https://www.freepik.es/foto-gratis/nutricionista-consulta_1157-46509.html'
    },
    {
      titulo: 'No identificar alergias alimentarias',
      desc: 'Puede causar anafilaxia o complicaciones graves.',
      nivel: 'fatal',
      img: 'https://img.freepik.com/foto-gratis/alergia-alimentaria-hospital_1157-46510.jpg',
      credit: 'https://www.freepik.es/foto-gratis/alergia-alimentaria-hospital_1157-46510.html'
    }
  ]
};
