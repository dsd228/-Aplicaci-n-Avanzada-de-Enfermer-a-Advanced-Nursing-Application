// data-alertas.js
// Alertas clínicas críticas, moderadas y leves

const ALERTAS = [
  {
    tipo: 'Higiene',
    nivel: 'fatal',
    mensaje: 'Nunca omitas el lavado de manos antes de tocar a un paciente. El riesgo de infecciones graves se multiplica.'
  },
  {
    tipo: 'Farmacología',
    nivel: 'moderate',
    mensaje: 'Verifica siempre la dosis y alergias antes de administrar fármacos. Errores pueden causar daño severo.'
  },
  {
    tipo: 'Educación',
    nivel: 'leve',
    mensaje: 'Educa al paciente en el uso correcto de inhaladores y dispositivos para evitar complicaciones leves.'
  },
  {
    tipo: 'Emergencia',
    nivel: 'fatal',
    mensaje: 'No demorar la atención en paro cardiorrespiratorio. Cada minuto cuenta para la supervivencia.'
  },
  {
    tipo: 'Cirugía',
    nivel: 'fatal',
    mensaje: 'Fallo en la asepsia quirúrgica puede causar infecciones postoperatorias graves y riesgo legal.'
  },
  {
    tipo: 'Pediatría',
    nivel: 'moderate',
    mensaje: 'Vacunación incompleta expone al niño a enfermedades prevenibles.'
  },
  {
    tipo: 'Oncología',
    nivel: 'moderate',
    mensaje: 'No monitorizar neutropenia en quimioterapia puede causar sepsis fatal.'
  },
  {
    tipo: 'Psiquiatría',
    nivel: 'fatal',
    mensaje: 'No evaluar riesgo suicida en paciente depresivo puede ser mortal.'
  }
];
