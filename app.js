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

// -------------- Idioma --------------
function applyLang(){
  // Basic language support - could be expanded with a translation object
  const isEnglish = state.lang === 'en';
  document.documentElement.lang = isEnglish ? 'en' : 'es';
  // For now, just update the language toggle state
  const langToggle = $('#lang-toggle');
  if (langToggle) langToggle.checked = isEnglish;
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

// -------------- Calculadoras Médicas --------------
function calculateBMI(weight, height) {
  if (!weight || !height || weight <= 0 || height <= 0) return null;
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  let category = '';
  if (bmi < 18.5) category = 'Bajo peso';
  else if (bmi < 25) category = 'Normal';
  else if (bmi < 30) category = 'Sobrepeso';
  else category = 'Obesidad';
  
  return {
    value: bmi.toFixed(1),
    category: category,
    color: bmi < 18.5 ? 'info' : bmi < 25 ? 'success' : bmi < 30 ? 'warning' : 'danger'
  };
}

function renderBMIResult(result) {
  const resultsDiv = $('#calc-results');
  if (!resultsDiv || !result) return;
  
  resultsDiv.className = `notification is-${result.color}`;
  resultsDiv.innerHTML = `
    <strong>IMC: ${result.value}</strong><br>
    Categoría: ${result.category}
  `;
  resultsDiv.style.display = 'block';
}

// -------------- Procedimientos --------------
const procedures = {
  handwashing: {
    title: 'Lavado de Manos',
    steps: [
      '1. Retirar joyas y relojes',
      '2. Abrir agua a temperatura moderada',
      '3. Aplicar jabón y frotar por 40-60 segundos',
      '4. Limpiar bajo las uñas',
      '5. Enjuagar con agua',
      '6. Secar con toalla desechable',
      '7. Cerrar grifo con la toalla'
    ]
  },
  vitals: {
    title: 'Toma de Signos Vitales',
    steps: [
      '1. Explicar el procedimiento al paciente',
      '2. Verificar que el paciente esté cómodo',
      '3. Temperatura: Colocar termómetro 3-5 min',
      '4. Pulso: Contar por 60 segundos en arteria radial',
      '5. Presión: Colocar manguito 2 cm sobre el pliegue',
      '6. Respiración: Observar y contar por 60 segundos',
      '7. Saturación: Colocar oxímetro en dedo índice',
      '8. Documentar todos los valores'
    ]
  },
  injection: {
    title: 'Administración Intramuscular',
    steps: [
      '1. Verificar orden médica y medicamento',
      '2. Higiene de manos',
      '3. Preparar medicamento en jeringa',
      '4. Verificar sitio de punción (muslo, brazo)',
      '5. Limpiar sitio con alcohol',
      '6. Insertar aguja en ángulo de 90°',
      '7. Aspirar para verificar no hay sangre',
      '8. Inyectar medicamento lentamente',
      '9. Retirar aguja y presionar con algodón',
      '10. Desechar material punzocortante'
    ]
  },
  catheter: {
    title: 'Colocación de Sonda Vesical',
    steps: [
      '1. Verificar orden médica',
      '2. Explicar procedimiento al paciente',
      '3. Posicionar al paciente (decúbito supino)',
      '4. Higiene de manos y colocar guantes estériles',
      '5. Limpiar área genital con antiséptico',
      '6. Lubricar sonda con gel estéril',
      '7. Insertar sonda hasta que fluya orina',
      '8. Inflar globo con agua estéril',
      '9. Conectar bolsa colectora',
      '10. Fijar sonda al muslo del paciente'
    ]
  }
};

function renderProcedureDetails(procedureKey) {
  const procedure = procedures[procedureKey];
  const detailsDiv = $('#procedure-details');
  if (!detailsDiv || !procedure) return;
  
  detailsDiv.innerHTML = `
    <h6 class="title is-6">${procedure.title}</h6>
    <ol class="content">
      ${procedure.steps.map(step => `<li>${step}</li>`).join('')}
    </ol>
  `;
  detailsDiv.style.display = 'block';
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

  // Tab navigation for Education section
  document.querySelectorAll('.tabs li').forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      // Remove active class from all tabs
      document.querySelectorAll('.tabs li').forEach(t => t.classList.remove('is-active'));
      // Add active class to clicked tab
      tab.classList.add('is-active');
      
      // Hide all tab contents
      document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');
      
      // Show selected tab content
      const tabId = tab.id.replace('tab-', '');
      const content = $(`#${tabId}-content`);
      if (content) content.style.display = 'block';
    });
  });

  // BMI Calculator
  $('#btn-calc-bmi')?.addEventListener('click', () => {
    const weight = parseFloat($('#calc-weight').value);
    const height = parseFloat($('#calc-height').value);
    const result = calculateBMI(weight, height);
    
    if (result) {
      renderBMIResult(result);
    } else {
      const resultsDiv = $('#calc-results');
      resultsDiv.className = 'notification is-danger';
      resultsDiv.innerHTML = 'Por favor ingresa valores válidos de peso y altura.';
      resultsDiv.style.display = 'block';
    }
  });

  // Procedure details
  document.querySelectorAll('.procedure-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const procedure = item.getAttribute('data-procedure');
      renderProcedureDetails(procedure);
    });
  });
}

function renderAll() {
  renderVitals();
  renderMeds();
  renderNotes();
  renderFluids();
  renderTasks();
}

loadDB();
seed();
renderPatientSelect();
renderAll();
wire();
