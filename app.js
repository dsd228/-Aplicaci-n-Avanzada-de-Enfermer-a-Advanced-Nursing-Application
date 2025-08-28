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
  // Si quieres una tabla de pacientes, aquí podrías renderizarla usando Bulma
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

function renderVitals(){
  // Aquí podrías mostrar los signos vitales en un <table class="table is-striped"> usando Bulma
}

function renderMeds(){
  // Aquí podrías mostrar la medicación en una tabla Bulma
}

function renderNotes(){
  // Aquí podrías mostrar las notas en una lista Bulma
}

function renderFluids(){
  // Aquí podrías mostrar el balance hídrico en una tabla Bulma
}

function renderTasks(){
  // Aquí podrías mostrar las tareas en una lista/tarjeta Bulma
}

function renderAlerts(){
  // Aquí podrías mostrar alertas importantes
}

// Importar / Exportar
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
    } catch (error) {
      alert('Archivo inválido');
    }
  };
  reader.readAsText(file);
});

// ----------------- BUSQUEDA ESCUELA MEDICA (Wikipedia API pública) -----------------
async function searchWiki(term) {
  // Español por defecto
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
});

// ----------------- OTRAS FUNCIONES (Signos, Meds, etc.) -----------------
// Puedes implementar el resto de las funciones usando Bulma y el mismo patrón que arriba.

function wire(){
  // Aquí puedes poner listeners adicionales para los controles
  $('#patient-select')?.addEventListener('change', (e)=>{
    state.currentPatientId = e.target.value;
    saveDB();
    // renderVitals(), renderMeds(), etc.
  });
  $('#nurse-name')?.addEventListener('change', (e)=>{
    state.nurse = e.target.value;
    saveDB();
  });
  $('#btn-new-patient')?.addEventListener('click', ()=>{
    // Aquí podrías abrir un modal para nuevo paciente
    const name = prompt('Nombre completo del paciente:');
    if (name && name.trim().length > 1) {
      const id = 'P-' + String(Date.now()).slice(-6);
      state.patients[id] = {id, name, age: '', condition: '', allergies: ''};
      state.currentPatientId = id;
      saveDB();
      renderPatientSelect();
    }
  });
  $('#btn-print')?.addEventListener('click', ()=> window.print());
}

loadDB();
seed();
renderPatientSelect();
wire();
