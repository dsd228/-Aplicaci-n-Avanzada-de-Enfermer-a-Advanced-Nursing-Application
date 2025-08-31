// data-protocolos.js
// Protocolos clínicos por área, ejemplos reales y extensos

const PROTOCOLOS = {
  emergencia: [
    {
      titulo: 'Protocolo RCP adulto',
      desc: 'Secuencia de compresiones torácicas y ventilaciones según guías internacionales. 30:2, uso de DEA, asegurar vía aérea.',
      img: 'https://img.freepik.com/foto-gratis/primeros-auxilios-reanimacion-cardiopulmonar_1157-33804.jpg',
      credit: 'https://www.freepik.es/foto-gratis/primeros-auxilios-reanimacion-cardiopulmonar_1157-33804.html'
    },
    {
      titulo: 'Protocolo de manejo de shock anafiláctico',
      desc: 'Administrar adrenalina IM, oxígeno, líquidos y monitorización continua. Transferencia a unidad de cuidados intensivos si es necesario.',
      img: 'https://img.freepik.com/foto-gratis/medico-preparando-inyeccion_1157-46468.jpg',
      credit: 'https://www.freepik.es/foto-gratis/medico-preparando-inyeccion_1157-46468.html'
    }
  ],
  pediatria: [
    {
      titulo: 'Protocolo de fiebre en lactantes',
      desc: 'Evaluación física completa, toma de hemocultivos, administración de antibióticos empíricos si hay riesgo de sepsis.',
      img: 'https://img.freepik.com/foto-gratis/enfermera-vacunando-nino_1157-46470.jpg',
      credit: 'https://www.freepik.es/foto-gratis/enfermera-vacunando-nino_1157-46470.html'
    },
    {
      titulo: 'Protocolo de bronquiolitis',
      desc: 'Oxígeno suplementario, hidratación, monitoreo de saturación y ventilación. Evitar antibióticos si no hay evidencia de infección bacteriana.',
      img: 'https://img.freepik.com/foto-gratis/primer-plano-paciente-asmatica-usando-inhalador_23-2148488659.jpg',
      credit: 'https://www.freepik.es/foto-gratis/primer-plano-paciente-asmatica-usando-inhalador_23-2148488659.html'
    }
  ],
  covid: [
    {
      titulo: 'Protocolo diagnóstico COVID-19',
      desc: 'PCR, antígenos, radiografía de tórax, aislamiento respiratorio, notificación obligatoria.',
      img: 'https://img.freepik.com/foto-gratis/paciente-covid-hospital_1157-46514.jpg',
      credit: 'https://www.freepik.es/foto-gratis/paciente-covid-hospital_1157-46514.html'
    },
    {
      titulo: 'Protocolo manejo grave COVID-19',
      desc: 'Oxígeno de alto flujo, soporte ventilatorio, corticoides, anticoagulación y monitorización en UCI.',
      img: 'https://img.freepik.com/foto-gratis/equipo-medico-emergencia_1157-46488.jpg',
      credit: 'https://www.freepik.es/foto-gratis/equipo-medico-emergencia_1157-46488.html'
    }
  ],
  traumatologia: [
    {
      titulo: 'Protocolo fractura expuesta',
      desc: 'Evaluar vascularización, cubrir herida, antibióticos de amplio espectro y traslado urgente a quirófano.',
      img: 'https://img.freepik.com/foto-gratis/curacion-herida-pierna_1157-46484.jpg',
      credit: 'https://www.freepik.es/foto-gratis/curacion-herida-pierna_1157-46484.html'
    }
  ],
  obstetricia: [
    {
      titulo: 'Protocolo trabajo de parto',
      desc: 'Monitorización materno-fetal, control de progresión, analgesia adecuada y manejo activo del alumbramiento.',
      img: 'https://img.freepik.com/foto-gratis/control-prenatal-embarazada_1157-46493.jpg',
      credit: 'https://www.freepik.es/foto-gratis/control-prenatal-embarazada_1157-46493.html'
    }
  ],
  infecciosas: [
    {
      titulo: 'Protocolo antibiótico empírico en sepsis',
      desc: 'Administración inmediata de antibióticos de amplio espectro, toma de hemocultivos y monitoreo intensivo.',
      img: 'https://img.freepik.com/foto-gratis/desinfectando-manos_23-2148493587.jpg',
      credit: 'https://www.freepik.es/foto-gratis/desinfectando-manos_23-2148493587.html'
    }
  ]
};
