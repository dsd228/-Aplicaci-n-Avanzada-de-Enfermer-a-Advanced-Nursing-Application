// data-interacciones.js
// Interacciones medicamentosas por categoría, ejemplos reales y extensos

const INTERACCIONES = {
  cardio: [
    {
      comb: 'Warfarina + Ibuprofeno',
      nivel: 'fatal',
      desc: 'Aumenta el riesgo de hemorragia gastrointestinal y hemorragia intracraneal.',
      img: 'https://img.freepik.com/foto-gratis/medicamento-pastillas_1157-46466.jpg',
      credit: 'https://www.freepik.es/foto-gratis/medicamento-pastillas_1157-46466.html'
    },
    {
      comb: 'Enalapril + Espironolactona',
      nivel: 'moderate',
      desc: 'Puede provocar hiperkalemia severa, sobre todo en pacientes con insuficiencia renal.',
      img: 'https://img.freepik.com/foto-gratis/enalapril-medicamento_1157-46528.jpg',
      credit: 'https://www.freepik.es/foto-gratis/enalapril-medicamento_1157-46528.html'
    },
    {
      comb: 'Atenolol + Verapamilo',
      nivel: 'fatal',
      desc: 'Riesgo de bloqueo auriculoventricular y bradicardia grave.',
      img: 'https://img.freepik.com/foto-gratis/atenolol-medicamento_1157-46529.jpg',
      credit: 'https://www.freepik.es/foto-gratis/atenolol-medicamento_1157-46529.html'
    }
  ],
  infecciosas: [
    {
      comb: 'Ciprofloxacino + Teofilina',
      nivel: 'moderate',
      desc: 'Ciprofloxacino aumenta los niveles de teofilina, riesgo de intoxicación.',
      img: 'https://img.freepik.com/foto-gratis/ciprofloxacino-medicamento_1157-46530.jpg',
      credit: 'https://www.freepik.es/foto-gratis/ciprofloxacino-medicamento_1157-46530.html'
    },
    {
      comb: 'Rifampicina + Anticonceptivos orales',
      nivel: 'moderate',
      desc: 'Rifampicina disminuye la eficacia de los anticonceptivos, riesgo de embarazo no deseado.',
      img: 'https://img.freepik.com/foto-gratis/rifampicina-medicamento_1157-46531.jpg',
      credit: 'https://www.freepik.es/foto-gratis/rifampicina-medicamento_1157-46531.html'
    }
  ],
  geriatria: [
    {
      comb: 'Digoxina + Amiodarona',
      nivel: 'fatal',
      desc: 'Amiodarona eleva niveles de digoxina, riesgo de intoxicación cardiaca.',
      img: 'https://img.freepik.com/foto-gratis/digoxina-medicamento_1157-46532.jpg',
      credit: 'https://www.freepik.es/foto-gratis/digoxina-medicamento_1157-46532.html'
    },
    {
      comb: 'Aspirina + Clopidogrel',
      nivel: 'moderate',
      desc: 'Aumenta el riesgo de sangrado, especialmente en ancianos.',
      img: 'https://img.freepik.com/foto-gratis/clopidogrel-medicamento_1157-46533.jpg',
      credit: 'https://www.freepik.es/foto-gratis/clopidogrel-medicamento_1157-46533.html'
    }
  ],
  pediatria: [
    {
      comb: 'Paracetamol + Isoniazida',
      nivel: 'moderate',
      desc: 'Isoniazida puede aumentar la toxicidad hepática del paracetamol.',
      img: 'https://img.freepik.com/foto-gratis/paracetamol-medicamento_1157-46534.jpg',
      credit: 'https://www.freepik.es/foto-gratis/paracetamol-medicamento_1157-46534.html'
    },
    {
      comb: 'Azitromicina + Ciclosporina',
      nivel: 'fatal',
      desc: 'Azitromicina aumenta la concentración de ciclosporina, riesgo de nefrotoxicidad grave.',
      img: 'https://img.freepik.com/foto-gratis/azitromicina-medicamento_1157-46535.jpg',
      credit: 'https://www.freepik.es/foto-gratis/azitromicina-medicamento_1157-46535.html'
    }
  ],
  oncologia: [
    {
      comb: 'Metotrexato + AINEs',
      nivel: 'fatal',
      desc: 'Los AINEs aumentan la toxicidad del metotrexato, riesgo de mielosupresión y fallo renal.',
      img: 'https://img.freepik.com/foto-gratis/metotrexato-medicamento_1157-46536.jpg',
      credit: 'https://www.freepik.es/foto-gratis/metotrexato-medicamento_1157-46536.html'
    },
    {
      comb: 'Cisplatino + Gentamicina',
      nivel: 'fatal',
      desc: 'Ambos son nefrotóxicos y pueden provocar insuficiencia renal aguda.',
      img: 'https://img.freepik.com/foto-gratis/gentamicina-medicamento_1157-46537.jpg',
      credit: 'https://www.freepik.es/foto-gratis/gentamicina-medicamento_1157-46537.html'
    }
  ]
};
