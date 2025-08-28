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
