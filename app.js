/* CareTrack Pro · Enfermería (vanilla JS + PWA) */
const $ = (s)=>document.querySelector(s);
const fmtDate = (d)=> new Date(d).toLocaleDateString('es-AR');
const fmtTime = (d)=> new Date(d).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'});
const nowISO = ()=> new Date().toISOString();
const toF = (c)=> (c*9/5+32).toFixed(1);
const toC = (f)=> ((f-32)*5/9).toFixed(1);
const uid = ()=> crypto.randomUUID();
// Cambia esto por la URL real de tu backend
const API_URL = 'https://<tu-heroku-o-backend>.herokuapp.com'; // ← pon aquí tu endpoint público

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

function saveDB(){ localStorage.setItem(DB_KEY, JSON.stringify(state)); }
function loadDB(){
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      Object.assign(state, JSON.parse(raw));
    }
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

function audit(action, payload){
  state.audit.push({at:nowISO(), action, payload});
  if(state.audit.length>500) state.audit.shift();
  saveDB();
}

const I18N = {
  es:{ install: 'Instalar', export:'Exportar', import:'Importar', print:'Imprimir', nurse:'Profesional', patient:'Paciente', newPatient:'+ Nuevo paciente'},
  en:{ install: 'Install', export:'Export', import:'Import', print:'Print', nurse:'Nurse', patient:'Patient', newPatient:'+ New patient'}
};
function applyLang(){
  const i = I18N[state.lang];
  $('#btn-install')?.setAttribute('aria-label', i.install);
}

function renderPatientSelect(){
  const sel = $('#patient-select'); sel.innerHTML='';
  Object.values(state.patients).forEach(p=>{
    const opt=document.createElement('option'); opt.value=p.id; opt.textContent=`${p.id} – ${p.name}`; sel.appendChild(opt);
  });
  if(state.currentPatientId) sel.value=state.currentPatientId;
}
function renderPatientsTable(){
  const tb = $('#patients-tbody'); tb.innerHTML='';
  Object.values(state.patients).forEach(p=>{
    const tr=document.createElement('tr');
    tr.innerHTML = `<td>${p.id}</td><td>${p.name}</td><td>${p.age}</td><td>${p.condition}</td><td>${p.allergies||'—'}</td>
      <td><button class="btn btn-futuristic small" data-act="set-patient" data-id="${p.id}">Seleccionar</button></td>`;
    tb.appendChild(tr);
  });
}

function calcEWS(v){
  let s=0;
  if(v.rr<=8||v.rr>=25) s+=3; else if(v.rr>=21) s+=2;
  if(v.spo2<91) s+=3; else if(v.spo2<=93) s+=2; else if(v.spo2<=95) s+=1;
  if(v.hr<=40||v.hr>=131) s+=3; else if(v.hr<=50||v.hr>=111) s+=2; else if(v.hr>=91) s+=1;
  if(v.sys<=90||v.sys>=220) s+=3; else if(v.sys<=100) s+=2; else if(v.sys<=110) s+=1;
  const t=v.tempC; if(t<=35.0||t>=39.1) s+=3; else if(t<=36.0||t>=38.1) s+=1;
  return s;
}
function renderEWS(score){
  const chip = $('#ews-chip'); chip.textContent = `EWS: ${score}`;
  chip.className = 'chip ' + (score>=7?'danger': score>=3?'warn':'ok');
}
function renderVitals(){
  // ... (same as before) ...
}

function renderVitalsChart(data){
  // ... (same as before) ...
}

function renderMeds(){
  // ... (same as before) ...
}

function renderNotes(){
  // ... (same as before) ...
}

function renderFluids(){
  // ... (same as before) ...
}

function renderTasks(){
  // ... (same as before) ...
}

function renderAlerts(){
  // ... (same as before) ...
}

// --- CORREGIDO: llamadas a la API usando API_URL ---
async function loadPatients() {
  try {
    const response = await fetch(`${API_URL}/patients`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const patients = await response.json();
    state.patients = patients;
    renderPatientSelect();
    renderPatientsTable();
  } catch (error) {
    console.error('Error loading patients:', error);
    alert('Error loading patients. Please try again.');
  }
}

// --- CORREGIDO: llamadas a la API usando API_URL ---
async function addVital(vitalData) {
  // ... (Input validation) ...
  try {
    const response = await fetch(`${API_URL}/vitals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vitalData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const newVital = await response.json();
    if (!state.vitals[state.currentPatientId]) state.vitals[state.currentPatientId] = [];
    state.vitals[state.currentPatientId].push(newVital);
    renderVitals();
  } catch (error) {
    console.error('Error adding vital:', error);
    alert('Error adding vital. Please try again.');
  }
}

async function searchSchool(query, type) {
  const url = 'https://www.medicinanet.com/busqueda?q=' + query; // Puedes seguir usando esta URL pública
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const html = await response.text();

    // **IMPORTANT:** This is a very basic example of parsing HTML.
    // You'll need to inspect the website's HTML structure and adjust the parsing logic accordingly.
    // Use a browser's developer tools to examine the HTML.

    // Example parsing (replace with your specific parsing logic)
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const results = [];

    const articleElements = doc.querySelectorAll('.result-item'); // Replace with the correct selector
    articleElements.forEach(element => {
      const title = element.querySelector('.result-title')?.textContent || 'N/A'; // Replace with the correct selector
      const description = element.querySelector('.result-description')?.textContent || 'N/A'; // Replace with the correct selector
      const link = element.querySelector('a')?.href || '#'; // Replace with the correct selector

      results.push({ type: type, name: title, description: description, source: link });
    });

    return results;

  } catch (error) {
    console.error("Error searching school:", error);
    return [];
  }
}

function renderSchoolResults(results) {
  const tbody = $('#school-tbody');
  tbody.innerHTML = '';

  results.forEach(result => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${result.type}</td><td>${result.name}</td><td>${result.description}</td><td><a href="${result.source}" target="_blank">${result.source}</a></td>`;
    tbody.appendChild(tr);
  });
}

function addMed(){
  // ... (same as before, corrige llamadas si usas API_URL) ...
}
function addNote(){
  // ... (same as before, corrige llamadas si usas API_URL) ...
}
function addFluid(){
  // ... (same as before, corrige llamadas si usas API_URL) ...
}
function addTask(){
  // ... (same as before, corrige llamadas si usas API_URL) ...
}

function wire(){
  // ... (Existing event listeners as before) ...
  $('#btn-school-search').addEventListener('click', async () => {
    const query = $('#school-search').value.trim();
    const type = $('#school-type').value;

    if (!query) {
      alert('Ingresa un término de búsqueda.');
      return;
    }

    const results = await searchSchool(query, type);
    renderSchoolResults(results);
  });
}

loadDB();
seed();
wire();
