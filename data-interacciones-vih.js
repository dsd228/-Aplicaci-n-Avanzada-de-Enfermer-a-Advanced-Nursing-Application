// data-interacciones-vih.js
// Estructura para mostrar información ampliada al tocar/clickear cada imagen/ítem

const INTERACCIONES_VIH = [
  {
    id: "tri-zevuvir",
    nombre: "Tri-zevuvir (Emtricitabina, Tenofovir alafenamida, Dolutegravir)",
    imagen: "tri-zevuvir.png", // Cambia por tu ruta real
    resumen: "Tratamiento antirretroviral combinado para VIH-1. Atención a interacciones.",
    info: `
      Dolutegravir es un inhibidor de integrasa, Emtricitabina y Tenofovir son inhibidores de la transcriptasa inversa.
      Administrar una vez al día vía oral. No fraccionar ni combinar sin supervisión médica.
      ⚠️ Requiere especial atención a interacciones medicamentosas.
    `,
    interacciones: [
      {
        combinacion: "Tri-zevuvir + Dofetilida, Flecainida, Propafenona",
        imagen: "tri-zevuvir-antiarritmicos.png",
        descripcion: `
          Dolutegravir puede aumentar los niveles de estos antiarrítmicos, riesgo de arritmias graves y muerte súbita.
          **Contraindicado absolutamente.**
          ⛔ No combinar nunca.
        `
      },
      {
        combinacion: "Tri-zevuvir + Rifampicina, Rifabutina",
        imagen: "tri-zevuvir-rifampicina.png",
        descripcion: `
          Disminuye significativamente los niveles de dolutegravir, pérdida de eficacia y riesgo de resistencia.
          **Evitar combinación; si es imprescindible, ajustar dosis y monitorizar carga viral.**
          ⛔
        `
      },
      {
        combinacion: "Tri-zevuvir + Metformina",
        imagen: "tri-zevuvir-metformina.png",
        descripcion: `
          Aumento del riesgo de acidosis láctica, especialmente en pacientes con disfunción renal.
          **Monitorizar glucosa y función renal; ajustar dosis de metformina si es necesario.**
          ⚠️
        `
      },
      // ...agrega aquí todas las demás combinaciones, cada una con imagen y descripción
    ]
  },
  {
    id: "ritonavir-simvastatina",
    nombre: "Ritonavir + Simvastatina",
    imagen: "ritonavir-simvastatina.png",
    resumen: "Riesgo extremo de rabdomiolisis y daño muscular.",
    info: `
      Ritonavir aumenta enormemente los niveles de simvastatina.
      **Usar preferentemente pravastatina o rosuvastatina.**
      ⛔
    `
  },
  {
    id: "lopinavir-amiodarona",
    nombre: "Lopinavir/ritonavir + Amiodarona",
    imagen: "lopinavir-amiodarona.png",
    resumen: "Riesgo de arritmias graves.",
    info: `
      Riesgo de arritmias cardíacas graves por alteración de metabolismo hepático de amiodarona.
      ⛔
    `
  },
  // ...continúa con el resto de combinaciones
];
