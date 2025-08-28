/* CareTrack Pro · Enfermería (vanilla JS + PWA + Bulma + Wikipedia search) */
const $ = (s)=>document.querySelector(s);
const fmtDate = (d)=> new Date(d).toLocaleDateString('es-AR');
const fmtTime = (d)=> new Date(d).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'});
const nowISO = ()=> new Date().toISOString();
const toF = (c)=> (c*9/5+32).toFixed(1);
const toC = (f)=> ((f-32)*5/9).toFixed(1);
const uid = ()=> crypto.randomUUID();

const DB_KEY = 'ctp_enf_v2';
const PAGE_SIZE = 5;

const state = {
  nurse:'',
  unit:'C',
  lang:'es',
  currentPatientId: null,
  patients: {},
  vitals: {},
  meds: {},
  notes: {},
  fluids: {},
  tasks: {},
  protocols: {},
  drugInteractions: {},
  calculations: {},
  pages: { vitals: 1, meds: 1 },
  audit: []
};

// -------------- Persistencia --------------
function saveDB(){ localStorage.setItem(DB_KEY, JSON.stringify(state)); }
function loadDB(){
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) Object.assign(state, JSON.parse(raw));
  } catch (error) {
    console.error("Error loading data from localStorage:", error);
    resetState();
  }
}

function resetState() {
  state.nurse = '';
  state.unit = 'C';
  state.lang = 'es';
  state.currentPatientId = null;
  state.patients = {};
  state.vitals = {};
  state.meds = {};
  state.notes = {};
  state.fluids = {};
  state.tasks = {};
  state.protocols = {};
  state.drugInteractions = {};
  state.calculations = {};
  state.pages = { vitals: 1, meds: 1 };
  state.audit = [];
}

function seed(){
  if(Object.keys(state.patients).length) return;
  const p1={id:'P-001',name:'María González',age:68,condition:'Diabetes tipo 2',allergies:'Penicilina'};
  const p2={id:'P-002',name:'José Pérez',age:75,condition:'Hipertensión',allergies:'Ibuprofeno'};
  state.patients[p1.id]=p1; state.patients[p2.id]=p2;
  state.currentPatientId=p1.id;
  state.vitals[p1.id]=[{id:uid(),at:nowISO(),tempC:36.8,hr:72,sys:120,dia:80,spo2:98,rr:16,pain:0,gcs:15,notes:'Ingreso'}];
  state.meds[p1.id]=[{id:uid(),at:nowISO(),date:nowISO(),time:'09:00',name:'Paracetamol',dose:'1 g',route:'Oral',freq:'c/8h',status:'Programado'}];
  state.notes[p1.id]=[{id:uid(),at:nowISO(),type:'condition',text:'Paciente estable.'}];
  state.fluids[p1.id]=[{id:uid(),at:nowISO(),in:500,out:200}];
  state.tasks[p1.id]=[{id:uid(),text:'Curación 18:00',done:false}];
  saveDB();
}

// -------------- Pacientes --------------
function renderPatientSelect(){
  const sel = $('#patient-select'); sel.innerHTML='';
  Object.values(state.patients).forEach(p=>{
    const opt=document.createElement('option');
    opt.value=p.id; opt.textContent=`${p.id} – ${p.name}`;
    sel.appendChild(opt);
  });
  if(state.currentPatientId) sel.value=state.currentPatientId;
}

// -------------- Signos Vitales --------------
function renderVitals(){
  const wrap = $('#vitals-wrap');
  if (!wrap) return;
  const pid = state.currentPatientId;
  const data = state.vitals[pid] || [];
  let html = `<table class="table is-striped is-narrow is-hoverable">
    <thead><tr>
      <th>Fecha</th><th>Temp (${state.unit})</th><th>FC</th><th>PA</th><th>SpO₂</th><th>FR</th>
      <th>Dolor</th><th>GCS</th><th>Notas</th>
    </tr></thead><tbody>`;
  data.slice(-PAGE_SIZE).reverse().forEach(v=>{
    html += `<tr>
      <td>${fmtDate(v.at)} ${fmtTime(v.at)}</td>
      <td>${state.unit==='C' ? v.tempC : toF(v.tempC)}</td>
      <td>${v.hr}</td>
      <td>${v.sys}/${v.dia}</td>
      <td>${v.spo2}</td>
      <td>${v.rr}</td>
      <td>${v.pain}</td>
      <td>${v.gcs}</td>
      <td>${v.notes||''}</td>
    </tr>`;
  });
  html += '</tbody></table>';
  wrap.innerHTML = html;
}

// -------------- Medicación --------------
function renderMeds(){
  const wrap = $('#meds-wrap');
  if (!wrap) return;
  const pid = state.currentPatientId;
  const meds = state.meds[pid] || [];
  let html = `<table class="table is-fullwidth is-hoverable">
    <thead><tr>
      <th>Fecha/Hora</th><th>Medicamento</th><th>Dosis</th><th>Vía</th><th>Frecuencia</th><th>Estado</th>
    </tr></thead><tbody>`;
  meds.slice(-PAGE_SIZE).reverse().forEach(m=>{
    html += `<tr>
      <td>${fmtDate(m.at)} ${fmtTime(m.at)}</td>
      <td>${m.name}</td>
      <td>${m.dose}</td>
      <td>${m.route}</td>
      <td>${m.freq}</td>
      <td>${m.status}</td>
    </tr>`;
  });
  html += '</tbody></table>';
  wrap.innerHTML = html;
}

// -------------- Notas --------------
function renderNotes(){
  const wrap = $('#notes-wrap');
  if (!wrap) return;
  const pid = state.currentPatientId;
  const notes = state.notes[pid] || [];
  let html = '<ul class="notification is-info">';
  notes.slice(-PAGE_SIZE).reverse().forEach(n=>{
    html += `<li><strong>${fmtDate(n.at)}</strong>: ${n.text}</li>`;
  });
  html += '</ul>';
  wrap.innerHTML = html;
}

// -------------- Balance Hídrico --------------
function renderFluids(){
  const wrap = $('#fluids-wrap');
  if (!wrap) return;
  const pid = state.currentPatientId;
  const fluids = state.fluids[pid] || [];
  let html = `<table class="table is-fullwidth is-hoverable">
    <thead><tr>
      <th>Fecha/Hora</th><th>Ingresos (ml)</th><th>Egresos (ml)</th>
    </tr></thead><tbody>`;
  fluids.slice(-PAGE_SIZE).reverse().forEach(f=>{
    html += `<tr>
      <td>${fmtDate(f.at)} ${fmtTime(f.at)}</td>
      <td>${f.in}</td>
      <td>${f.out}</td>
    </tr>`;
  });
  html += '</tbody></table>';
  wrap.innerHTML = html;
}

// -------------- Tareas --------------
function renderTasks(){
  const wrap = $('#tasks-wrap');
  if (!wrap) return;
  const pid = state.currentPatientId;
  const tasks = state.tasks[pid] || [];
  let html = '<ul class="box">';
  tasks.slice(-PAGE_SIZE).reverse().forEach(t=>{
    html += `<li>
      <label class="checkbox">
        <input type="checkbox" ${t.done?'checked':''} data-tid="${t.id}"> ${t.text}
      </label>
    </li>`;
  });
  html += '</ul>';
  wrap.innerHTML = html;
  // Wire up checkboxes
  wrap.querySelectorAll('input[type="checkbox"]').forEach(chk=>{
    chk.addEventListener('change', (e)=>{
      const id = e.target.getAttribute('data-tid');
      const task = tasks.find(t=>t.id===id);
      if(task){
        task.done = e.target.checked;
        saveDB();
        renderTasks();
      }
    });
  });
}

// -------------- Protocolos --------------
const protocolsData = {
  rcp: {
    title: "RCP - Reanimación Cardiopulmonar",
    steps: [
      "1. Verificar inconsciencia y ausencia de pulso",
      "2. Activar sistema de emergencias",
      "3. Posición correcta del paciente",
      "4. Compresiones torácicas: 30 compresiones a 100-120/min",
      "5. Vía aérea: inclinar cabeza, elevar mentón",
      "6. Ventilación: 2 ventilaciones de rescate",
      "7. Continuar ciclos 30:2 hasta llegada de ayuda",
      "8. Si disponible, usar DEA según instrucciones"
    ],
    notes: "Profundidad: 5-6 cm, permitir retroceso completo, minimizar interrupciones"
  },
  sepsis: {
    title: "Protocolo de Sepsis",
    steps: [
      "1. Identificar signos de alerta: fiebre, hipotensión, taquicardia",
      "2. Obtener cultivos (sangre, orina, esputo)",
      "3. Administrar antibióticos empíricos en primera hora",
      "4. Reposición hídrica agresiva (30ml/kg)",
      "5. Monitoreo continuo: PA, FC, diuresis",
      "6. Control de lactato sérico",
      "7. Considerar vasopresores si hipotensión persiste",
      "8. Reevaluación constante y ajuste de tratamiento"
    ],
    notes: "Tiempo es crítico: iniciar tratamiento dentro de la primera hora"
  },
  avc: {
    title: "ACV - Accidente Cerebrovascular",
    steps: [
      "1. Escala FAST: Facial droop, Arm weakness, Speech, Time",
      "2. Obtener hora exacta de inicio de síntomas",
      "3. Signos vitales estables",
      "4. Glicemia capilar inmediata",
      "5. TC de cráneo urgente",
      "6. Evaluación neurológica completa (NIHSS)",
      "7. Considerar trombolíticos si <4.5h",
      "8. Monitoreo neurológico estrecho"
    ],
    notes: "Ventana terapéutica limitada, actuación rápida es esencial"
  },
  dolor: {
    title: "Manejo del Dolor",
    steps: [
      "1. Evaluación inicial: escala 0-10",
      "2. Caracterizar tipo de dolor (agudo/crónico)",
      "3. Analgesicos según escalón OMS",
      "4. Monitoreo de efectividad cada 30-60 min",
      "5. Evaluar efectos adversos",
      "6. Medidas no farmacológicas",
      "7. Reevaluación continua",
      "8. Documentar respuesta al tratamiento"
    ],
    notes: "El dolor es el 5° signo vital, evaluación continua necesaria"
  },
  caidas: {
    title: "Prevención de Caídas",
    steps: [
      "1. Evaluación de riesgo (Morse Fall Scale)",
      "2. Identificar factores de riesgo",
      "3. Ambiente seguro: barandas, iluminación",
      "4. Calzado antideslizante",
      "5. Acompañamiento en deambulación",
      "6. Medicamentos: revisar sedantes/hipotensores",
      "7. Educación al paciente y familia",
      "8. Reevaluación periódica del riesgo"
    ],
    notes: "Prevención es clave, ambiente seguro y evaluación continua"
  },
  infecciones: {
    title: "Control de Infecciones",
    steps: [
      "1. Higiene de manos antes y después de contacto",
      "2. Uso apropiado de EPP",
      "3. Aislamiento según tipo de infección",
      "4. Limpieza y desinfección del ambiente",
      "5. Manejo seguro de material contaminado",
      "6. Educación a paciente y visitantes",
      "7. Monitoreo de signos de infección",
      "8. Reporte oportuno de casos"
    ],
    notes: "Precauciones estándar siempre, precauciones específicas según patógeno"
  }
};

function renderProtocols() {
  const wrap = $('#protocol-content');
  if (!wrap) return;
  
  const selected = $('#protocol-select').value;
  if (!selected) {
    wrap.innerHTML = '<p class="has-text-grey">Selecciona un protocolo para ver los pasos detallados.</p>';
    return;
  }
  
  const protocol = protocolsData[selected];
  if (!protocol) return;
  
  let html = `<div class="box">
    <h4 class="title is-5">${protocol.title}</h4>
    <div class="content">
      <ol>`;
  
  protocol.steps.forEach(step => {
    html += `<li class="mb-2">${step}</li>`;
  });
  
  html += `</ol>
      <div class="notification is-info is-light">
        <strong>Nota importante:</strong> ${protocol.notes}
      </div>
    </div>
  </div>`;
  
  wrap.innerHTML = html;
}

// -------------- Combinación de Medicamentos --------------
const drugInteractionsData = {
  // Common drug interactions database
  'paracetamol-warfarina': {
    severity: 'moderate',
    description: 'El paracetamol puede potenciar el efecto anticoagulante de la warfarina.',
    recommendation: 'Monitorear INR más frecuentemente. Considerar dosis menores de paracetamol.'
  },
  'aspirina-warfarina': {
    severity: 'major',
    description: 'Riesgo significativo de hemorragia por efecto aditivo anticoagulante.',
    recommendation: 'Evitar combinación. Si es necesario, monitoreo estricto y ajuste de dosis.'
  },
  'ibuprofeno-warfarina': {
    severity: 'major',
    description: 'Los AINEs aumentan el riesgo de sangrado con anticoagulantes.',
    recommendation: 'Evitar combinación. Preferir paracetamol para analgesia.'
  },
  'digoxina-furosemida': {
    severity: 'moderate',
    description: 'La furosemida puede causar hipopotasemia, aumentando toxicidad por digoxina.',
    recommendation: 'Monitorear niveles de potasio y digoxina. Suplementar potasio si necesario.'
  },
  'atenolol-insulina': {
    severity: 'moderate',
    description: 'Los beta-bloqueantes pueden enmascarar síntomas de hipoglicemia.',
    recommendation: 'Monitoreo glucémico más frecuente. Educar sobre síntomas atípicos.'
  },
  'omeprazol-clopidogrel': {
    severity: 'moderate',
    description: 'El omeprazol puede reducir la efectividad antiagregante del clopidogrel.',
    recommendation: 'Considerar pantoprazol como alternativa al omeprazol.'
  }
};

function checkDrugInteractions() {
  const drug1 = $('#drug1').value.toLowerCase().trim();
  const drug2 = $('#drug2').value.toLowerCase().trim();
  const resultDiv = $('#interactions-result');
  
  if (!drug1 || !drug2) {
    resultDiv.innerHTML = '<p class="has-text-danger">Por favor, ingresa ambos medicamentos.</p>';
    return;
  }
  
  if (drug1 === drug2) {
    resultDiv.innerHTML = '<p class="has-text-warning">Has ingresado el mismo medicamento dos veces.</p>';
    return;
  }
  
  // Check for interactions (both directions)
  const key1 = `${drug1}-${drug2}`;
  const key2 = `${drug2}-${drug1}`;
  
  const interaction = drugInteractionsData[key1] || drugInteractionsData[key2];
  
  if (interaction) {
    const severityClass = interaction.severity === 'major' ? 'is-danger' : 
                         interaction.severity === 'moderate' ? 'is-warning' : 'is-info';
    
    resultDiv.innerHTML = `
      <div class="notification ${severityClass}">
        <h5 class="title is-6">
          <span class="icon"><i class="fas fa-exclamation-triangle"></i></span>
          Interacción ${interaction.severity === 'major' ? 'GRAVE' : 'MODERADA'} detectada
        </h5>
        <p><strong>Descripción:</strong> ${interaction.description}</p>
        <p><strong>Recomendación:</strong> ${interaction.recommendation}</p>
      </div>
    `;
  } else {
    resultDiv.innerHTML = `
      <div class="notification is-success">
        <h5 class="title is-6">
          <span class="icon"><i class="fas fa-check-circle"></i></span>
          No se encontraron interacciones conocidas
        </h5>
        <p>No se encontraron interacciones documentadas entre <strong>${drug1}</strong> y <strong>${drug2}</strong>.</p>
        <p class="is-size-7 mt-2"><em>Nota: Esta base de datos contiene las interacciones más comunes. Siempre consultar fuentes adicionales para medicamentos menos comunes.</em></p>
      </div>
    `;
  }
}

// -------------- Calculadora Médica --------------
function renderCalculatorInputs() {
  const calcType = $('#calc-type').value;
  const inputsDiv = $('#calc-inputs');
  const resultDiv = $('#calc-result');
  
  resultDiv.innerHTML = '';
  
  if (!calcType) {
    inputsDiv.innerHTML = '<p class="has-text-grey">Selecciona un tipo de cálculo.</p>';
    return;
  }
  
  let html = '';
  
  switch (calcType) {
    case 'bmi':
      html = `
        <div class="field">
          <label class="label">Peso (kg)</label>
          <input id="weight" class="input" type="number" step="0.1" placeholder="70">
        </div>
        <div class="field">
          <label class="label">Altura (cm)</label>
          <input id="height" class="input" type="number" placeholder="170">
        </div>
        <button id="btn-calc-bmi" class="button is-primary">Calcular IMC</button>
      `;
      break;
    case 'dosage':
      html = `
        <div class="field">
          <label class="label">Peso del paciente (kg)</label>
          <input id="patient-weight" class="input" type="number" step="0.1" placeholder="70">
        </div>
        <div class="field">
          <label class="label">Dosis por kg (mg/kg)</label>
          <input id="dose-per-kg" class="input" type="number" step="0.1" placeholder="10">
        </div>
        <div class="field">
          <label class="label">Concentración disponible (mg/ml)</label>
          <input id="concentration" class="input" type="number" step="0.1" placeholder="50">
        </div>
        <button id="btn-calc-dosage" class="button is-primary">Calcular Dosis</button>
      `;
      break;
    case 'iv-flow':
      html = `
        <div class="field">
          <label class="label">Volumen total (ml)</label>
          <input id="total-volume" class="input" type="number" placeholder="1000">
        </div>
        <div class="field">
          <label class="label">Tiempo de infusión (horas)</label>
          <input id="infusion-time" class="input" type="number" step="0.1" placeholder="8">
        </div>
        <div class="field">
          <label class="label">Factor de goteo (gotas/ml)</label>
          <input id="drop-factor" class="input" type="number" placeholder="20">
        </div>
        <button id="btn-calc-iv-flow" class="button is-primary">Calcular Goteo</button>
      `;
      break;
    case 'surface-area':
      html = `
        <div class="field">
          <label class="label">Peso (kg)</label>
          <input id="sa-weight" class="input" type="number" step="0.1" placeholder="70">
        </div>
        <div class="field">
          <label class="label">Altura (cm)</label>
          <input id="sa-height" class="input" type="number" placeholder="170">
        </div>
        <button id="btn-calc-surface-area" class="button is-primary">Calcular ASC</button>
      `;
      break;
    case 'gfr':
      html = `
        <div class="field">
          <label class="label">Creatinina sérica (mg/dl)</label>
          <input id="creatinine" class="input" type="number" step="0.01" placeholder="1.2">
        </div>
        <div class="field">
          <label class="label">Edad (años)</label>
          <input id="age" class="input" type="number" placeholder="65">
        </div>
        <div class="field">
          <label class="label">Peso (kg)</label>
          <input id="gfr-weight" class="input" type="number" step="0.1" placeholder="70">
        </div>
        <div class="field">
          <label class="label">Sexo</label>
          <div class="control">
            <label class="radio">
              <input type="radio" name="gender" value="male" checked> Masculino
            </label>
            <label class="radio">
              <input type="radio" name="gender" value="female"> Femenino
            </label>
          </div>
        </div>
        <button id="btn-calc-gfr" class="button is-primary">Calcular FG</button>
      `;
      break;
  }
  
  inputsDiv.innerHTML = html;
}

function calculateBMI() {
  const weight = parseFloat($('#weight').value);
  const height = parseFloat($('#height').value);
  const resultDiv = $('#calc-result');
  
  if (!weight || !height || weight <= 0 || height <= 0) {
    resultDiv.innerHTML = '<p class="has-text-danger">Por favor, ingresa valores válidos.</p>';
    return;
  }
  
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  
  let category, categoryClass;
  if (bmi < 18.5) {
    category = 'Bajo peso';
    categoryClass = 'is-info';
  } else if (bmi < 25) {
    category = 'Normal';
    categoryClass = 'is-success';
  } else if (bmi < 30) {
    category = 'Sobrepeso';
    categoryClass = 'is-warning';
  } else {
    category = 'Obesidad';
    categoryClass = 'is-danger';
  }
  
  resultDiv.innerHTML = `
    <div class="notification ${categoryClass}">
      <h5 class="title is-6">Resultado IMC</h5>
      <p><strong>IMC:</strong> ${bmi.toFixed(1)} kg/m²</p>
      <p><strong>Categoría:</strong> ${category}</p>
    </div>
  `;
}

function calculateDosage() {
  const weight = parseFloat($('#patient-weight').value);
  const dosePerKg = parseFloat($('#dose-per-kg').value);
  const concentration = parseFloat($('#concentration').value);
  const resultDiv = $('#calc-result');
  
  if (!weight || !dosePerKg || !concentration || weight <= 0 || dosePerKg <= 0 || concentration <= 0) {
    resultDiv.innerHTML = '<p class="has-text-danger">Por favor, ingresa valores válidos.</p>';
    return;
  }
  
  const totalDose = weight * dosePerKg;
  const volume = totalDose / concentration;
  
  resultDiv.innerHTML = `
    <div class="notification is-info">
      <h5 class="title is-6">Resultado Cálculo de Dosis</h5>
      <p><strong>Dosis total:</strong> ${totalDose.toFixed(1)} mg</p>
      <p><strong>Volumen a administrar:</strong> ${volume.toFixed(2)} ml</p>
    </div>
  `;
}

function calculateIVFlow() {
  const volume = parseFloat($('#total-volume').value);
  const time = parseFloat($('#infusion-time').value);
  const dropFactor = parseFloat($('#drop-factor').value);
  const resultDiv = $('#calc-result');
  
  if (!volume || !time || !dropFactor || volume <= 0 || time <= 0 || dropFactor <= 0) {
    resultDiv.innerHTML = '<p class="has-text-danger">Por favor, ingresa valores válidos.</p>';
    return;
  }
  
  const mlPerHour = volume / time;
  const mlPerMin = mlPerHour / 60;
  const dropsPerMin = mlPerMin * dropFactor;
  
  resultDiv.innerHTML = `
    <div class="notification is-info">
      <h5 class="title is-6">Resultado Velocidad de Goteo</h5>
      <p><strong>ml/hora:</strong> ${mlPerHour.toFixed(1)} ml/h</p>
      <p><strong>ml/minuto:</strong> ${mlPerMin.toFixed(2)} ml/min</p>
      <p><strong>Gotas/minuto:</strong> ${Math.round(dropsPerMin)} gotas/min</p>
    </div>
  `;
}

function calculateSurfaceArea() {
  const weight = parseFloat($('#sa-weight').value);
  const height = parseFloat($('#sa-height').value);
  const resultDiv = $('#calc-result');
  
  if (!weight || !height || weight <= 0 || height <= 0) {
    resultDiv.innerHTML = '<p class="has-text-danger">Por favor, ingresa valores válidos.</p>';
    return;
  }
  
  // Fórmula de Mosteller: √(altura[cm] × peso[kg] / 3600)
  const bsa = Math.sqrt((height * weight) / 3600);
  
  resultDiv.innerHTML = `
    <div class="notification is-info">
      <h5 class="title is-6">Resultado Área Superficie Corporal</h5>
      <p><strong>ASC:</strong> ${bsa.toFixed(2)} m²</p>
      <p class="is-size-7 mt-2"><em>Fórmula de Mosteller utilizada</em></p>
    </div>
  `;
}

function calculateGFR() {
  const creatinine = parseFloat($('#creatinine').value);
  const age = parseFloat($('#age').value);
  const weight = parseFloat($('#gfr-weight').value);
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const resultDiv = $('#calc-result');
  
  if (!creatinine || !age || !weight || creatinine <= 0 || age <= 0 || weight <= 0) {
    resultDiv.innerHTML = '<p class="has-text-danger">Por favor, ingresa valores válidos.</p>';
    return;
  }
  
  // Fórmula de Cockcroft-Gault
  let gfr = ((140 - age) * weight) / (72 * creatinine);
  if (gender === 'female') {
    gfr *= 0.85;
  }
  
  let interpretation, categoryClass;
  if (gfr >= 90) {
    interpretation = 'Normal o alto';
    categoryClass = 'is-success';
  } else if (gfr >= 60) {
    interpretation = 'Levemente disminuido';
    categoryClass = 'is-info';
  } else if (gfr >= 30) {
    interpretation = 'Moderadamente disminuido';
    categoryClass = 'is-warning';
  } else {
    interpretation = 'Severamente disminuido';
    categoryClass = 'is-danger';
  }
  
  resultDiv.innerHTML = `
    <div class="notification ${categoryClass}">
      <h5 class="title is-6">Resultado Filtrado Glomerular</h5>
      <p><strong>FG estimado:</strong> ${gfr.toFixed(1)} ml/min/1.73m²</p>
      <p><strong>Interpretación:</strong> ${interpretation}</p>
      <p class="is-size-7 mt-2"><em>Fórmula de Cockcroft-Gault utilizada</em></p>
    </div>
  `;
}

// -------------- Escuela Médica (Wikipedia) --------------
async function searchWiki(term) {
  const apiUrl = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("No encontrado en Wikipedia");
    const data = await response.json();
    return {
      title: data.title,
      extract: data.extract,
      url: data.content_urls?.desktop?.page || `https://es.wikipedia.org/wiki/${encodeURIComponent(term)}`,
      image: data.thumbnail?.source || null
    };
  } catch (error) {
    return null;
  }
}

function renderSchoolResults(result) {
  const resultsWrap = $('#school-results');
  if (!resultsWrap) return;
  if (result) {
    resultsWrap.innerHTML = `
      <div class="box">
        <strong>${result.title}</strong>
        <p>${result.extract}</p>
        ${result.image ? `<figure class="image is-128x128"><img src="${result.image}" alt="${result.title}"></figure>` : ''}
        <p><a href="${result.url}" target="_blank">Ver más en Wikipedia</a></p>
      </div>
    `;
  } else {
    resultsWrap.innerHTML = '<p class="has-text-danger">No se encontró información en Wikipedia.</p>';
  }
}

// -------------- Acciones y Wireup --------------
function wire(){
  $('#patient-select')?.addEventListener('change', (e)=>{
    state.currentPatientId = e.target.value;
    saveDB();
    renderAll();
  });

  $('#nurse-name')?.addEventListener('change', (e)=>{
    state.nurse = e.target.value;
    saveDB();
  });

  $('#btn-new-patient')?.addEventListener('click', ()=>{
    const name = prompt('Nombre completo del paciente:');
    if (name && name.trim().length > 1) {
      const id = 'P-' + String(Date.now()).slice(-6);
      state.patients[id] = {id, name, age: '', condition: '', allergies: ''};
      state.currentPatientId = id;
      saveDB();
      renderPatientSelect();
      renderAll();
    }
  });

  $('#btn-print')?.addEventListener('click', ()=> window.print());

  $('#btn-export')?.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'caretrackpro-backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  $('#import-file')?.addEventListener('change', (ev)=>{
    const file = ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        Object.assign(state, JSON.parse(e.target.result));
        saveDB();
        renderPatientSelect();
        renderAll();
      } catch (error) {
        alert('Archivo inválido');
      }
    };
    reader.readAsText(file);
  });

  $('#unit-toggle')?.addEventListener('change', (e)=>{
    state.unit = e.target.checked ? 'F' : 'C';
    saveDB();
    renderVitals();
  });

  $('#lang-toggle')?.addEventListener('change', (e)=>{
    state.lang = e.target.checked ? 'en' : 'es';
    saveDB();
    applyLang();
  });

  $('#btn-school-search')?.addEventListener('click', async () => {
    const query = $('#school-search').value.trim();
    const type = $('#school-type').value;
    const resultsWrap = $('#school-results');
    resultsWrap.innerHTML = '<p>Buscando...</p>';

    if (!query) {
      resultsWrap.innerHTML = '<p class="has-text-danger">Ingresa un término de búsqueda.</p>';
      return;
    }
    const result = await searchWiki(query);
    renderSchoolResults(result);
  });

  // Event listeners for new modules
  $('#protocol-select')?.addEventListener('change', renderProtocols);
  
  $('#btn-check-interactions')?.addEventListener('click', checkDrugInteractions);
  
  $('#calc-type')?.addEventListener('change', renderCalculatorInputs);
  
  // Calculator button event listeners will be added dynamically
  document.addEventListener('click', (e) => {
    if (e.target.id === 'btn-calc-bmi') calculateBMI();
    if (e.target.id === 'btn-calc-dosage') calculateDosage();
    if (e.target.id === 'btn-calc-iv-flow') calculateIVFlow();
    if (e.target.id === 'btn-calc-surface-area') calculateSurfaceArea();
    if (e.target.id === 'btn-calc-gfr') calculateGFR();
  });
}

function renderAll() {
  renderVitals();
  renderMeds();
  renderNotes();
  renderFluids();
  renderTasks();
  renderProtocols();
  renderCalculatorInputs();
}

loadDB();
seed();
renderPatientSelect();
renderAll();
wire();
