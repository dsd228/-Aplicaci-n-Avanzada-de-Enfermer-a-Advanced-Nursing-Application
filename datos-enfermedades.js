// data-enfermedades.js
// Enfermedades y patologías por categoría, ejemplos reales y extensos

const ENFERMEDADES = {
  cronicas: [
    {
      titulo: 'Diabetes tipo 2',
      desc: 'Enfermedad crónica que afecta el metabolismo de la glucosa. Requiere control estricto de glucemia, dieta y ejercicio.',
      nivel: 'moderate',
      img: 'https://img.freepik.com/foto-gratis/glucometro-prueba-diabetes_1157-42123.jpg',
      credit: 'https://www.freepik.es/foto-gratis/glucometro-prueba-diabetes_1157-42123.html'
    },
    {
      titulo: 'Hipertensión arterial',
      desc: 'Elevación persistente de la presión arterial. Puede causar daño renal, cerebral y cardíaco si no se trata.',
      nivel: 'moderate',
      img: 'https://img.freepik.com/foto-gratis/presion-arterial-paciente_1157-46454.jpg',
      credit: 'https://www.freepik.es/foto-gratis/presion-arterial-paciente_1157-46454.html'
    },
    {
      titulo: 'Enfermedad renal crónica',
      desc: 'Pérdida progresiva de la función renal. Requiere seguimiento y control de factores de riesgo.',
      nivel: 'moderate',
      img: 'https://img.freepik.com/foto-gratis/consulta-nefrologia_1157-46512.jpg',
      credit: 'https://www.freepik.es/foto-gratis/consulta-nefrologia_1157-46512.html'
    },
    {
      titulo: 'No control de diabetes',
      desc: 'Puede llevar a complicaciones graves como coma diabético, retinopatía y nefropatía.',
      nivel: 'fatal',
      img: 'https://img.freepik.com/foto-gratis/paciente-diabetico-hospital_1157-46513.jpg',
      credit: 'https://www.freepik.es/foto-gratis/paciente-diabetico-hospital_1157-46513.html'
    }
  ],
  infecciosas: [
    {
      titulo: 'COVID-19',
      desc: 'Infección respiratoria causada por el coronavirus SARS-CoV-2. Puede provocar neumonía grave y síndrome de dificultad respiratoria aguda.',
      nivel: 'fatal',
      img: 'https://img.freepik.com/foto-gratis/paciente-covid-hospital_1157-46514.jpg',
      credit: 'https://www.freepik.es/foto-gratis/paciente-covid-hospital_1157-46514.html'
    },
    {
      titulo: 'Tuberculosis',
      desc: 'Enfermedad infecciosa causada por Mycobacterium tuberculosis. Requiere tratamiento prolongado y control de contactos.',
      nivel: 'moderate',
      img: 'https://img.freepik.com/foto-gratis/radiografia-torax-tuberculosis_1157-46515.jpg',
      credit: 'https://www.freepik.es/foto-gratis/radiografia-torax-tuberculosis_1157-46515.html'
    },
    {
      titulo: 'Gripe',
      desc: 'Infección viral aguda de vías respiratorias superiores. Puede ser grave en ancianos y niños.',
      nivel: 'leve',
      img: 'https://img.freepik.com/foto-gratis/paciente-gripe-consulta_1157-46516.jpg',
      credit: 'https://www.freepik.es/foto-gratis/paciente-gripe-consulta_1157-46516.html'
    }
  ],
  respiratorias: [
    {
      titulo: 'Asma bronquial',
      desc: 'Enfermedad inflamatoria crónica de la vía aérea. Se trata con broncodilatadores y corticosteroides inhalados.',
      nivel: 'moderate',
      img: 'https://img.freepik.com/foto-gratis/primer-plano-paciente-asmatica-usando-inhalador_23-2148488659.jpg',
      credit: 'https://www.freepik.es/foto-gratis/primer-plano-paciente-asmatica-usando-inhalador_23-2148488659.html'
    },
    {
      titulo: 'EPOC',
      desc: 'Enfermedad pulmonar obstructiva crónica, asociada a tabaquismo. Produce disnea progresiva y tos crónica.',
      nivel: 'moderate',
      img: 'https://img.freepik.com/foto-gratis/paciente-epoc-hospital_1157-46517.jpg',
      credit: 'https://www.freepik.es/foto-gratis/paciente-epoc-hospital_1157-46517.html'
    },
    {
      titulo: 'Neumonía',
      desc: 'Infección aguda del parénquima pulmonar. Puede ser grave si no se diagnostica y trata a tiempo.',
      nivel: 'fatal',
      img: 'https://img.freepik.com/foto-gratis/radiografia-neumonia_1157-46518.jpg',
      credit: 'https://www.freepik.es/foto-gratis/radiografia-neumonia_1157-46518.html'
    }
  ],
  cardiacas: [
    {
      titulo: 'Infarto agudo de miocardio',
      desc: 'Necrosis del músculo cardíaco por obstrucción coronaria. Atención inmediata, riesgo de muerte elevada.',
      nivel: 'fatal',
      img: 'https://img.freepik.com/foto-gratis/paciente-cardiologo_1157-46453.jpg',
      credit: 'https://www.freepik.es/foto-gratis/paciente-cardiologo_1157-46453.html'
    },
    {
      titulo: 'Arritmia cardíaca',
      desc: 'Alteración del ritmo cardíaco que puede ser benigna o potencialmente mortal.',
      nivel: 'moderate',
      img: 'https://img.freepik.com/foto-gratis/electrocardiograma-paciente-cama-hospital_1157-38985.jpg',
      credit: 'https://www.freepik.es/foto-gratis/electrocardiograma-paciente-cama-hospital_1157-38985.html'
    }
  ],
  neurologicas: [
    {
      titulo: 'Epilepsia',
      desc: 'Trastorno neurológico caracterizado por crisis convulsivas recurrentes. Requiere tratamiento anticonvulsivo.',
      nivel: 'moderate',
      img: 'https://img.freepik.com/foto-gratis/electroencefalograma-paciente_1157-46519.jpg',
      credit: 'https://www.freepik.es/foto-gratis/electroencefalograma-paciente_1157-46519.html'
    },
    {
      titulo: 'Accidente cerebrovascular',
      desc: 'Pérdida súbita de función neurológica por alteración vascular cerebral. Puede dejar secuelas graves o causar la muerte.',
      nivel: 'fatal',
      img: 'https://img.freepik.com/foto-gratis/paciente-neurologia-ictus_1157-46520.jpg',
      credit: 'https://www.freepik.es/foto-gratis/paciente-neurologia-ictus_1157-46520.html'
    }
  ],
  dermatologicas: [
    {
      titulo: 'Dermatitis atópica',
      desc: 'Enfermedad inflamatoria crónica de la piel. Prurito y lesiones eccematosas recurrentes.',
      nivel: 'leve',
      img: 'https://img.freepik.com/foto-gratis/dermatitis-infeccion_1157-46501.jpg',
      credit: 'https://www.freepik.es/foto-gratis/dermatitis-infeccion_1157-46501.html'
    },
    {
      titulo: 'Melanoma',
      desc: 'Cáncer de piel altamente agresivo. Diagnóstico precoz es clave para la supervivencia.',
      nivel: 'fatal',
      img: 'https://img.freepik.com/foto-gratis/biopsia-lesion-piel_1157-46521.jpg',
      credit: 'https://www.freepik.es/foto-gratis/biopsia-lesion-piel_1157-46521.html'
    }
  ],
  oncologicas: [
    {
      titulo: 'Cáncer de pulmón',
      desc: 'Tumor maligno que afecta al parénquima pulmonar. Muy agresivo, pronóstico reservado.',
      nivel: 'fatal',
      img: 'https://img.freepik.com/foto-gratis/tac-pulmones-cancer_1157-46522.jpg',
      credit: 'https://www.freepik.es/foto-gratis/tac-pulmones-cancer_1157-46522.html'
    },
    {
      titulo: 'Leucemia',
      desc: 'Neoplasia hematológica, requiere quimioterapia y seguimiento especializado.',
      nivel: 'moderate',
      img: 'https://img.freepik.com/foto-gratis/paciente-leucemia-hospital_1157-46523.jpg',
      credit: 'https://www.freepik.es/foto-gratis/paciente-leucemia-hospital_1157-46523.html'
    }
  ],
  psiquiatricas: [
    {
      titulo: 'Depresión mayor',
      desc: 'Trastorno del ánimo caracterizado por tristeza profunda y pérdida de interés. Puede llevar a riesgo suicida.',
      nivel: 'moderate',
      img: 'https://img.freepik.com/foto-gratis/psiquiatra-consulta_1157-46506.jpg',
      credit: 'https://www.freepik.es/foto-gratis/psiquiatra-consulta_1157-46506.html'
    },
    {
      titulo: 'Episodio psicótico agudo',
      desc: 'Desorganización del pensamiento y la conducta, puede requerir internación urgente.',
      nivel: 'fatal',
      img: 'https://img.freepik.com/foto-gratis/episodio-psicotico-hospital_1157-46507.jpg',
      credit: 'https://www.freepik.es/foto-gratis/episodio-psicotico-hospital_1157-46507.html'
    }
  ],
  gastrointestinales: [
    {
      titulo: 'Úlcera gástrica',
      desc: 'Lesión de la mucosa gástrica por desequilibrio entre factores agresivos y defensivos.',
      nivel: 'moderate',
      img: 'https://img.freepik.com/foto-gratis/endoscopia-ulcera-gastrica_1157-46524.jpg',
      credit: 'https://www.freepik.es/foto-gratis/endoscopia-ulcera-gastrica_1157-46524.html'
    },
    {
      titulo: 'Pancreatitis aguda',
      desc: 'Inflamación del páncreas, puede causar complicaciones sistémicas graves.',
      nivel: 'fatal',
      img: 'https://img.freepik.com/foto-gratis/ecografia-pancreatitis_1157-46525.jpg',
      credit: 'https://www.freepik.es/foto-gratis/ecografia-pancreatitis_1157-46525.html'
    }
  ],
  geneticas: [
    {
      titulo: 'Fibrosis quística',
      desc: 'Enfermedad genética que afecta la función pulmonar y digestiva. Requiere tratamiento multidisciplinario.',
      nivel: 'moderate',
      img: 'https://img.freepik.com/foto-gratis/paciente-fibrosis-quistica_1157-46526.jpg',
      credit: 'https://www.freepik.es/foto-gratis/paciente-fibrosis-quistica_1157-46526.html'
    },
    {
      titulo: 'Síndrome de Down',
      desc: 'Alteración cromosómica que produce discapacidad intelectual y rasgos físicos característicos.',
      nivel: 'leve',
      img: 'https://img.freepik.com/foto-gratis/paciente-sindrome-down_1157-46527.jpg',
      credit: 'https://www.freepik.es/foto-gratis/paciente-sindrome-down_1157-46527.html'
    }
  ]
};
