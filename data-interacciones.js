// data-interacciones.js
// Interacciones medicamentosas por categoría, ejemplos reales y extensos

const INTERACCIONES = {
  cardio: [
    {
      comb: 'Warfarina + Ibuprofeno',
      nivel: 'fatal',
      desc: 'Aumenta el riesgo de hemorragia gastrointestinal y hemorragia intracraneal. Se debe evitar esta combinación o monitorizar estrechamente.',
      img: 'https://img.freepik.com/foto-gratis/medicamento-pastillas_1157-46466.jpg',
      credit: 'https://www.freepik.es/foto-gratis/medicamento-pastillas_1157-46466.html'
    },
    {
      comb: 'Enalapril + Espironolactona',
      nivel: 'moderate',
      desc: 'Puede provocar hiperkalemia severa, sobre todo en pacientes con insuficiencia renal. Se recomienda monitorización frecuente de potasio y función renal.',
      img: 'https://img.freepik.com/foto-gratis/enalapril-medicamento_1157-46528.jpg',
      credit: 'https://www.freepik.es/foto-gratis/enalapril-medicamento_1157-46528.html'
    },
    {
      comb: 'Atenolol + Verapamilo',
      nivel: 'fatal',
      desc: 'Riesgo de bloqueo auriculoventricular y bradicardia grave. Evitar o monitorizar ECG y signos vitales.',
      img: 'https://img.freepik.com/foto-gratis/atenolol-medicamento_1157-46529.jpg',
      credit: 'https://www.freepik.es/foto-gratis/atenolol-medicamento_1157-46529.html'
    }
  ],
  infecciosas: [
    {
      comb: 'Ciprofloxacino + Teofilina',
      nivel: 'moderate',
      desc: 'Ciprofloxacino aumenta los niveles de teofilina, riesgo de intoxicación. Monitorizar niveles plasmáticos y síntomas.',
      img: 'https://img.freepik.com/foto-gratis/ciprofloxacino-medicamento_1157-46530.jpg',
      credit: 'https://www.freepik.es/foto-gratis/ciprofloxacino-medicamento_1157-46530.html'
    },
    {
      comb: 'Rifampicina + Anticonceptivos orales',
      nivel: 'moderate',
      desc: 'Rifampicina disminuye la eficacia de los anticonceptivos, riesgo de embarazo no deseado. Se recomienda método alternativo.',
      img: 'https://img.freepik.com/foto-gratis/rifampicina-medicamento_1157-46531.jpg',
      credit: 'https://www.freepik.es/foto-gratis/rifampicina-medicamento_1157-46531.html'
    }
  ],
  geriatria: [
    {
      comb: 'Digoxina + Amiodarona',
      nivel: 'fatal',
      desc: 'Amiodarona eleva niveles de digoxina, riesgo de intoxicación cardiaca. Monitorizar estrechamente y ajustar dosis.',
      img: 'https://img.freepik.com/foto-gratis/digoxina-medicamento_1157-46532.jpg',
      credit: 'https://www.freepik.es/foto-gratis/digoxina-medicamento_1157-46532.html'
    },
    {
      comb: 'Aspirina + Clopidogrel',
      nivel: 'moderate',
      desc: 'Aumenta el riesgo de sangrado, especialmente en ancianos. Vigilar signos de sangrado y ajustar dosis si es necesario.',
      img: 'https://img.freepik.com/foto-gratis/clopidogrel-medicamento_1157-46533.jpg',
      credit: 'https://www.freepik.es/foto-gratis/clopidogrel-medicamento_1157-46533.html'
    }
  ],
  pediatria: [
    {
      comb: 'Paracetamol + Isoniazida',
      nivel: 'moderate',
      desc: 'Isoniazida puede aumentar la toxicidad hepática del paracetamol. Vigilar función hepática y evitar uso prolongado.',
      img: 'https://img.freepik.com/foto-gratis/paracetamol-medicamento_1157-46534.jpg',
      credit: 'https://www.freepik.es/foto-gratis/paracetamol-medicamento_1157-46534.html'
    },
    {
      comb: 'Azitromicina + Ciclosporina',
      nivel: 'fatal',
      desc: 'Azitromicina aumenta la concentración de ciclosporina, riesgo de nefrotoxicidad grave. Monitorizar niveles y función renal.',
      img: 'https://img.freepik.com/foto-gratis/azitromicina-medicamento_1157-46535.jpg',
      credit: 'https://www.freepik.es/foto-gratis/azitromicina-medicamento_1157-46535.html'
    }
  ],
  oncologia: [
    {
      comb: 'Metotrexato + AINEs',
      nivel: 'fatal',
      desc: 'Los AINEs aumentan la toxicidad del metotrexato, riesgo de mielosupresión y fallo renal. Evitar combinación y monitorizar función renal y hematológica.',
      img: 'https://img.freepik.com/foto-gratis/metotrexato-medicamento_1157-46536.jpg',
      credit: 'https://www.freepik.es/foto-gratis/metotrexato-medicamento_1157-46536.html'
    },
    {
      comb: 'Cisplatino + Gentamicina',
      nivel: 'fatal',
      desc: 'Ambos son nefrotóxicos y pueden provocar insuficiencia renal aguda. Evitar combinación y realizar controles estrictos.',
      img: 'https://img.freepik.com/foto-gratis/gentamicina-medicamento_1157-46537.jpg',
      credit: 'https://www.freepik.es/foto-gratis/gentamicina-medicamento_1157-46537.html'
    }
  ],
  vih: [
    // INFORMACIÓN COMPLETA DE TRI-ZEVUVIR Y PRINCIPALES INTERACCIONES
    {
      comb: 'Tri-zevuvir (Emtricitabina 200mg, Tenofovir alafenamida 25mg, Dolutegravir 50mg)',
      nivel: 'info',
      desc: 'Tratamiento antirretroviral combinado para pacientes con VIH-1. Requiere especial atención a las interacciones medicamentosas. Dolutegravir es un inhibidor de integrasa, Emtricitabina y Tenofovir son inhibidores de la transcriptasa inversa. Administrar una vez al día vía oral, no fraccionar ni combinar con otros antirretrovirales sin supervisión médica.'
    },
    {
      comb: 'Tri-zevuvir + Dofetilida, Flecainida, Propafenona',
      nivel: 'fatal',
      desc: 'Dolutegravir puede aumentar los niveles de estos antiarrítmicos, riesgo de arritmias graves y muerte súbita. Contraindicado absolutamente.',
      img: 'https://img.freepik.com/foto-gratis/pastillas-cardiacas_1157-46543.jpg',
      credit: 'https://www.freepik.es/foto-gratis/pastillas-cardiacas_1157-46543.html'
    },
    {
      comb: 'Tri-zevuvir + Rifampicina, Rifabutina',
      nivel: 'fatal',
      desc: 'Disminuye significativamente los niveles de dolutegravir, pérdida de eficacia antirretroviral y riesgo de resistencia. Evitar combinación; si es imprescindible, ajustar dosis y monitorizar carga viral.',
      img: 'https://img.freepik.com/foto-gratis/antibioticos-medicamento_1157-46544.jpg',
      credit: 'https://www.freepik.es/foto-gratis/antibioticos-medicamento_1157-46544.html'
    },
    {
      comb: 'Tri-zevuvir + Metformina',
      nivel: 'moderate',
      desc: 'Aumento del riesgo de acidosis láctica, especialmente en pacientes con disfunción renal. Monitorizar glucosa y función renal; ajustar dosis de metformina si es necesario.',
      img: 'https://img.freepik.com/foto-gratis/metformina-medicamento_1157-46545.jpg',
      credit: 'https://www.freepik.es/foto-gratis/metformina-medicamento_1157-46545.html'
    },
    {
      comb: 'Tri-zevuvir + Antiácidos (Aluminio, Magnesio)',
      nivel: 'moderate',
      desc: 'Reducen la absorción de dolutegravir. Administrar antiácidos con al menos 2-4 horas de separación para evitar pérdida de eficacia.',
      img: 'https://img.freepik.com/foto-gratis/antiacidos-medicamento_1157-46546.jpg',
      credit: 'https://www.freepik.es/foto-gratis/antiacidos-medicamento_1157-46546.html'
    },
    {
      comb: 'Tri-zevuvir + Estatinas (Simvastatina, Lovastatina)',
      nivel: 'moderate',
      desc: 'Aumento del riesgo de miopatía y rabdomiólisis. Se recomienda evitar el uso conjunto o monitorizar síntomas musculares y CK.',
      img: 'https://img.freepik.com/foto-gratis/estatinas-medicamento_1157-46547.jpg',
      credit: 'https://www.freepik.es/foto-gratis/estatinas-medicamento_1157-46547.html'
    },
    {
      comb: 'Tri-zevuvir + Paracetamol, Ibuprofeno',
      nivel: 'leve',
      desc: 'Generalmente seguros con monitoreo adecuado y función renal conservada. Vigilar síntomas de toxicidad.',
      img: 'https://img.freepik.com/foto-gratis/paracetamol-medicamento_1157-46534.jpg',
      credit: 'https://www.freepik.es/foto-gratis/paracetamol-medicamento_1157-46534.html'
    },
    // PRINCIPALES INTERACCIONES DE ANTIRRETROVIRALES
    {
      comb: 'Ritonavir + Simvastatina',
      nivel: 'fatal',
      desc: 'Ritonavir (potenciador de antirretrovirales) aumenta enormemente los niveles de simvastatina, riesgo de rabdomiolisis y daño muscular extremo. Usar preferentemente pravastatina o rosuvastatina.',
      img: 'https://img.freepik.com/foto-gratis/ritonavir-medicamento_1157-46538.jpg',
      credit: 'https://www.freepik.es/foto-gratis/ritonavir-medicamento_1157-46538.html'
    },
    {
      comb: 'Lopinavir/ritonavir + Amiodarona',
      nivel: 'fatal',
      desc: 'Riesgo de arritmias cardíacas graves por alteración de metabolismo hepático de amiodarona, potencial prolongación de QT.',
      img: 'https://img.freepik.com/foto-gratis/medicamento-pastillas_1157-46466.jpg',
      credit: 'https://www.freepik.es/foto-gratis/medicamento-pastillas_1157-46466.html'
    },
    {
      comb: 'Efavirenz + Voriconazol',
      nivel: 'moderate',
      desc: 'Efavirenz reduce los niveles de voriconazol (antifúngico), disminuyendo su eficacia y aumentando riesgo de infecciones fúngicas. Ajustar dosis y monitorizar niveles si se usan juntos.',
      img: 'https://img.freepik.com/foto-gratis/efavirenz-medicamento_1157-46539.jpg',
      credit: 'https://www.freepik.es/foto-gratis/efavirenz-medicamento_1157-46539.html'
    },
    {
      comb: 'Tenofovir + Adefovir',
      nivel: 'fatal',
      desc: 'Ambos pueden causar toxicidad renal sinérgica, riesgo de insuficiencia renal aguda. Evitar combinación y monitorizar función renal.',
      img: 'https://img.freepik.com/foto-gratis/tenofovir-medicamento_1157-46540.jpg',
      credit: 'https://www.freepik.es/foto-gratis/tenofovir-medicamento_1157-46540.html'
    },
    {
      comb: 'Nevirapina + Ketoconazol',
      nivel: 'moderate',
      desc: 'Nevirapina disminuye los niveles de ketoconazol, reduciendo efectividad antifúngica. Ketoconazol puede aumentar toxicidad hepática de nevirapina. Monitorizar función hepática y ajustar dosis.',
      img: 'https://img.freepik.com/foto-gratis/ketoconazol-medicamento_1157-46541.jpg',
      credit: 'https://www.freepik.es/foto-gratis/ketoconazol-medicamento_1157-46541.html'
    },
    {
      comb: 'Zidovudina + Rifampicina',
      nivel: 'moderate',
      desc: 'Rifampicina disminuye los niveles plasmáticos de zidovudina, reduciendo su eficacia en el tratamiento de VIH. Monitorizar carga viral y ajustar dosis según necesidad.',
      img: 'https://img.freepik.com/foto-gratis/zidovudina-medicamento_1157-46542.jpg',
      credit: 'https://www.freepik.es/foto-gratis/zidovudina-medicamento_1157-46542.html'
    },
    {
      comb: 'Tri-zevuvir + Hierba de San Juan (Hypericum perforatum)',
      nivel: 'fatal',
      desc: 'Hierba de San Juan reduce los niveles de dolutegravir y tenofovir alafenamida, riesgo alto de fracaso virológico y resistencia. Contraindicado cualquier suplemento con Hypericum.',
      img: 'https://img.freepik.com/foto-gratis/hierba-san-juan_1157-46548.jpg',
      credit: 'https://www.freepik.es/foto-gratis/hierba-san-juan_1157-46548.html'
    }
  ]
};

// RECOMENDACIONES GENERALES PARA PERSONAL DE SALUD SOBRE PACIENTES CON VIH Y ANTIRRETROVIRALES
const INFO_VIH = [
  {
    tema: 'Consulta de Interacciones',
    recomendacion: 'Antes de prescribir cualquier medicamento a pacientes con VIH, siempre consultar bases de datos actualizadas sobre interacciones medicamentosas (ej. Liverpool HIV interactions, Medscape, UpToDate).'
  },
  {
    tema: 'Vigilancia y Educación',
    recomendacion: 'Educar a pacientes sobre riesgos de automedicación y uso de suplementos/herbales. Vigilar y preguntar activamente sobre todos los medicamentos y productos naturales que consuman.'
  },
  {
    tema: 'Monitorización',
    recomendacion: 'Monitorizar función renal, hepática, ECG y parámetros hematológicos regularmente en pacientes bajo tratamiento antirretroviral combinado, especialmente si hay comorbilidades o polifarmacia.'
  },
  {
    tema: 'Evitar combinaciones peligrosas',
    recomendacion: 'Evitar combinaciones de antirretrovirales con medicamentos que prolongan QT, potencian toxicidad renal/hepática o afectan el metabolismo hepático. Consultar siempre si hay duda.'
  },
  {
    tema: 'Ajuste y seguimiento',
    recomendacion: 'Ajustar dosis según función renal/hepática y realizar seguimiento estrecho en pacientes polimedicados o en quienes se agregue/retire algún fármaco habitual.'
  }
];
