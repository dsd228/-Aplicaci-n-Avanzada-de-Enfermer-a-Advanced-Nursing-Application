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
  if (!pid) {
    wrap.innerHTML = '<p class="has-text-grey">Selecciona un paciente para ver los signos vitales.</p>';
    return;
  }
  const data = state.vitals[pid] || [];
  
  let html = `<div class="is-flex is-justify-content-space-between is-align-items-center mb-3">
    <span><strong>Registros:</strong> ${data.length}</span>
    <button class="button is-primary is-small" id="btn-add-vitals">
      <span class="icon is-small"><i class="fas fa-plus"></i></span>
      <span>Agregar Signos Vitales</span>
    </button>
  </div>`;
  
  html += `<table class="table is-striped is-narrow is-hoverable is-fullwidth">
    <thead><tr>
      <th>Fecha</th><th>Temp (${state.unit})</th><th>FC</th><th>PA</th><th>SpO₂</th><th>FR</th>
      <th>Dolor</th><th>GCS</th><th>Notas</th><th>Acciones</th>
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
      <td>
        <button class="button is-small is-info" data-action="edit-vital" data-id="${v.id}">
          <span class="icon is-small"><i class="fas fa-edit"></i></span>
        </button>
        <button class="button is-small is-danger ml-1" data-action="delete-vital" data-id="${v.id}">
          <span class="icon is-small"><i class="fas fa-trash"></i></span>
        </button>
      </td>
    </tr>`;
  });
  
  if (data.length === 0) {
    html += '<tr><td colspan="10" class="has-text-centered has-text-grey">No hay registros de signos vitales</td></tr>';
  }
  
  html += '</tbody></table>';
  wrap.innerHTML = html;
}

// -------------- Medicación --------------
function renderMeds(){
  const wrap = $('#meds-wrap');
  if (!wrap) return;
  const pid = state.currentPatientId;
  if (!pid) {
    wrap.innerHTML = '<p class="has-text-grey">Selecciona un paciente para ver los medicamentos.</p>';
    return;
  }
  const meds = state.meds[pid] || [];
  
  let html = `<div class="is-flex is-justify-content-space-between is-align-items-center mb-3">
    <span><strong>Medicamentos:</strong> ${meds.length}</span>
    <button class="button is-primary is-small" id="btn-add-meds">
      <span class="icon is-small"><i class="fas fa-plus"></i></span>
      <span>Agregar Medicamento</span>
    </button>
  </div>`;
  
  html += `<table class="table is-fullwidth is-hoverable">
    <thead><tr>
      <th>Fecha/Hora</th><th>Medicamento</th><th>Dosis</th><th>Vía</th><th>Frecuencia</th><th>Estado</th><th>Acciones</th>
    </tr></thead><tbody>`;
  
  meds.slice(-PAGE_SIZE).reverse().forEach(m=>{
    html += `<tr>
      <td>${fmtDate(m.at)} ${fmtTime(m.at)}</td>
      <td>${m.name}</td>
      <td>${m.dose}</td>
      <td>${m.route}</td>
      <td>${m.freq}</td>
      <td><span class="tag ${m.status === 'Administrado' ? 'is-success' : 'is-warning'}">${m.status}</span></td>
      <td>
        <button class="button is-small is-info" data-action="edit-med" data-id="${m.id}">
          <span class="icon is-small"><i class="fas fa-edit"></i></span>
        </button>
        <button class="button is-small is-danger ml-1" data-action="delete-med" data-id="${m.id}">
          <span class="icon is-small"><i class="fas fa-trash"></i></span>
        </button>
      </td>
    </tr>`;
  });
  
  if (meds.length === 0) {
    html += '<tr><td colspan="7" class="has-text-centered has-text-grey">No hay medicamentos registrados</td></tr>';
  }
  
  html += '</tbody></table>';
  wrap.innerHTML = html;
}

// -------------- Notas --------------
function renderNotes(){
  const wrap = $('#notes-wrap');
  if (!wrap) return;
  const pid = state.currentPatientId;
  if (!pid) {
    wrap.innerHTML = '<p class="has-text-grey">Selecciona un paciente para ver las notas.</p>';
    return;
  }
  const notes = state.notes[pid] || [];
  
  let html = `<div class="is-flex is-justify-content-space-between is-align-items-center mb-3">
    <span><strong>Notas:</strong> ${notes.length}</span>
    <button class="button is-primary is-small" id="btn-add-notes">
      <span class="icon is-small"><i class="fas fa-plus"></i></span>
      <span>Agregar Nota</span>
    </button>
  </div>`;
  
  if (notes.length === 0) {
    html += '<div class="notification is-light">No hay notas de enfermería registradas</div>';
  } else {
    html += '<div class="content">';
    notes.slice(-PAGE_SIZE).reverse().forEach(n=>{
      html += `<div class="notification is-info is-light">
        <div class="is-flex is-justify-content-space-between is-align-items-start">
          <div>
            <strong>${fmtDate(n.at)} ${fmtTime(n.at)}</strong>: ${n.text}
          </div>
          <div>
            <button class="button is-small is-info" data-action="edit-note" data-id="${n.id}">
              <span class="icon is-small"><i class="fas fa-edit"></i></span>
            </button>
            <button class="button is-small is-danger ml-1" data-action="delete-note" data-id="${n.id}">
              <span class="icon is-small"><i class="fas fa-trash"></i></span>
            </button>
          </div>
        </div>
      </div>`;
    });
    html += '</div>';
  }
  
  wrap.innerHTML = html;
}

// -------------- Balance Hídrico --------------
function renderFluids(){
  const wrap = $('#fluids-wrap');
  if (!wrap) return;
  const pid = state.currentPatientId;
  if (!pid) {
    wrap.innerHTML = '<p class="has-text-grey">Selecciona un paciente para ver el balance hídrico.</p>';
    return;
  }
  const fluids = state.fluids[pid] || [];
  
  let html = `<div class="is-flex is-justify-content-space-between is-align-items-center mb-3">
    <span><strong>Registros:</strong> ${fluids.length}</span>
    <button class="button is-primary is-small" id="btn-add-fluids">
      <span class="icon is-small"><i class="fas fa-plus"></i></span>
      <span>Agregar Balance</span>
    </button>
  </div>`;
  
  html += `<table class="table is-fullwidth is-hoverable">
    <thead><tr>
      <th>Fecha/Hora</th><th>Ingresos (ml)</th><th>Egresos (ml)</th><th>Balance</th><th>Acciones</th>
    </tr></thead><tbody>`;
  
  fluids.slice(-PAGE_SIZE).reverse().forEach(f=>{
    const balance = f.in - f.out;
    html += `<tr>
      <td>${fmtDate(f.at)} ${fmtTime(f.at)}</td>
      <td class="has-text-success"><strong>+${f.in}</strong></td>
      <td class="has-text-danger"><strong>-${f.out}</strong></td>
      <td class="${balance >= 0 ? 'has-text-success' : 'has-text-danger'}"><strong>${balance > 0 ? '+' : ''}${balance}</strong></td>
      <td>
        <button class="button is-small is-info" data-action="edit-fluid" data-id="${f.id}">
          <span class="icon is-small"><i class="fas fa-edit"></i></span>
        </button>
        <button class="button is-small is-danger ml-1" data-action="delete-fluid" data-id="${f.id}">
          <span class="icon is-small"><i class="fas fa-trash"></i></span>
        </button>
      </td>
    </tr>`;
  });
  
  if (fluids.length === 0) {
    html += '<tr><td colspan="5" class="has-text-centered has-text-grey">No hay registros de balance hídrico</td></tr>';
  }
  
  html += '</tbody></table>';
  wrap.innerHTML = html;
}

// -------------- Tareas --------------
function renderTasks(){
  const wrap = $('#tasks-wrap');
  if (!wrap) return;
  const pid = state.currentPatientId;
  if (!pid) {
    wrap.innerHTML = '<p class="has-text-grey">Selecciona un paciente para ver las tareas.</p>';
    return;
  }
  const tasks = state.tasks[pid] || [];
  
  let html = `<div class="is-flex is-justify-content-space-between is-align-items-center mb-3">
    <span><strong>Tareas:</strong> ${tasks.length}</span>
    <button class="button is-primary is-small" id="btn-add-tasks">
      <span class="icon is-small"><i class="fas fa-plus"></i></span>
      <span>Agregar Tarea</span>
    </button>
  </div>`;
  
  if (tasks.length === 0) {
    html += '<div class="notification is-light">No hay tareas registradas</div>';
  } else {
    html += '<div class="box">';
    tasks.slice(-PAGE_SIZE).reverse().forEach(t=>{
      html += `<div class="is-flex is-justify-content-space-between is-align-items-center mb-2">
        <label class="checkbox">
          <input type="checkbox" ${t.done?'checked':''} data-tid="${t.id}"> 
          <span class="${t.done ? 'has-text-grey-light' : ''}">${t.text}</span>
        </label>
        <div>
          <button class="button is-small is-info" data-action="edit-task" data-id="${t.id}">
            <span class="icon is-small"><i class="fas fa-edit"></i></span>
          </button>
          <button class="button is-small is-danger ml-1" data-action="delete-task" data-id="${t.id}">
            <span class="icon is-small"><i class="fas fa-trash"></i></span>
          </button>
        </div>
      </div>`;
    });
    html += '</div>';
  }
  
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

// -------------- Modal Functions and CRUD Operations --------------

// Vital Signs CRUD
function openVitalsModal(id = null) {
  const pid = state.currentPatientId;
  if (!pid) {
    alert('Selecciona un paciente primero');
    return;
  }
  
  const isEdit = id !== null;
  const vital = isEdit ? state.vitals[pid]?.find(v => v.id === id) : null;
  
  const tempC = vital?.tempC || '';
  const hr = vital?.hr || '';
  const sys = vital?.sys || '';
  const dia = vital?.dia || '';
  const spo2 = vital?.spo2 || '';
  const rr = vital?.rr || '';
  const pain = vital?.pain || '';
  const gcs = vital?.gcs || '';
  const notes = vital?.notes || '';
  
  const formData = prompt(`${isEdit ? 'Editar' : 'Agregar'} Signos Vitales (separados por comas):
Temperatura °C, FC (bpm), PAS, PAD, SpO2 (%), FR, Dolor (0-10), GCS, Notas

Ejemplo: 36.8, 72, 120, 80, 98, 16, 0, 15, Paciente estable`, 
    `${tempC}, ${hr}, ${sys}, ${dia}, ${spo2}, ${rr}, ${pain}, ${gcs}, ${notes}`);
  
  if (formData) {
    const parts = formData.split(',').map(p => p.trim());
    if (parts.length >= 8) {
      const newVital = {
        id: isEdit ? id : uid(),
        at: isEdit ? vital.at : nowISO(),
        tempC: parseFloat(parts[0]) || 36.5,
        hr: parseInt(parts[1]) || 70,
        sys: parseInt(parts[2]) || 120,
        dia: parseInt(parts[3]) || 80,
        spo2: parseInt(parts[4]) || 98,
        rr: parseInt(parts[5]) || 16,
        pain: parseInt(parts[6]) || 0,
        gcs: parseInt(parts[7]) || 15,
        notes: parts[8] || ''
      };
      
      if (!state.vitals[pid]) state.vitals[pid] = [];
      
      if (isEdit) {
        const index = state.vitals[pid].findIndex(v => v.id === id);
        if (index !== -1) state.vitals[pid][index] = newVital;
      } else {
        state.vitals[pid].push(newVital);
      }
      
      saveDB();
      renderVitals();
    } else {
      alert('Formato incorrecto. Asegúrate de completar todos los campos.');
    }
  }
}

function editVital(id) {
  openVitalsModal(id);
}

function deleteVital(id) {
  if (confirm('¿Estás seguro de eliminar este registro de signos vitales?')) {
    const pid = state.currentPatientId;
    if (state.vitals[pid]) {
      state.vitals[pid] = state.vitals[pid].filter(v => v.id !== id);
      saveDB();
      renderVitals();
    }
  }
}

// Medications CRUD
function openMedsModal(id = null) {
  const pid = state.currentPatientId;
  if (!pid) {
    alert('Selecciona un paciente primero');
    return;
  }
  
  const isEdit = id !== null;
  const med = isEdit ? state.meds[pid]?.find(m => m.id === id) : null;
  
  const name = med?.name || '';
  const dose = med?.dose || '';
  const route = med?.route || '';
  const freq = med?.freq || '';
  const status = med?.status || 'Programado';
  
  const formData = prompt(`${isEdit ? 'Editar' : 'Agregar'} Medicamento (separados por comas):
Medicamento, Dosis, Vía, Frecuencia, Estado

Ejemplo: Paracetamol, 1g, Oral, c/8h, Programado`, 
    `${name}, ${dose}, ${route}, ${freq}, ${status}`);
  
  if (formData) {
    const parts = formData.split(',').map(p => p.trim());
    if (parts.length >= 4) {
      const newMed = {
        id: isEdit ? id : uid(),
        at: isEdit ? med.at : nowISO(),
        date: nowISO(),
        time: new Date().toLocaleTimeString('es-AR', {hour:'2-digit', minute:'2-digit'}),
        name: parts[0] || 'Medicamento',
        dose: parts[1] || '1 dosis',
        route: parts[2] || 'Oral',
        freq: parts[3] || 'c/8h',
        status: parts[4] || 'Programado'
      };
      
      if (!state.meds[pid]) state.meds[pid] = [];
      
      if (isEdit) {
        const index = state.meds[pid].findIndex(m => m.id === id);
        if (index !== -1) state.meds[pid][index] = newMed;
      } else {
        state.meds[pid].push(newMed);
      }
      
      saveDB();
      renderMeds();
    } else {
      alert('Formato incorrecto. Completa al menos: Medicamento, Dosis, Vía, Frecuencia.');
    }
  }
}

function editMed(id) {
  openMedsModal(id);
}

function deleteMed(id) {
  if (confirm('¿Estás seguro de eliminar este medicamento?')) {
    const pid = state.currentPatientId;
    if (state.meds[pid]) {
      state.meds[pid] = state.meds[pid].filter(m => m.id !== id);
      saveDB();
      renderMeds();
    }
  }
}

// Notes CRUD
function openNotesModal(id = null) {
  const pid = state.currentPatientId;
  if (!pid) {
    alert('Selecciona un paciente primero');
    return;
  }
  
  const isEdit = id !== null;
  const note = isEdit ? state.notes[pid]?.find(n => n.id === id) : null;
  
  const noteText = prompt(`${isEdit ? 'Editar' : 'Agregar'} Nota de Enfermería:`, note?.text || '');
  
  if (noteText && noteText.trim()) {
    const newNote = {
      id: isEdit ? id : uid(),
      at: isEdit ? note.at : nowISO(),
      type: 'nursing',
      text: noteText.trim()
    };
    
    if (!state.notes[pid]) state.notes[pid] = [];
    
    if (isEdit) {
      const index = state.notes[pid].findIndex(n => n.id === id);
      if (index !== -1) state.notes[pid][index] = newNote;
    } else {
      state.notes[pid].push(newNote);
    }
    
    saveDB();
    renderNotes();
  }
}

function editNote(id) {
  openNotesModal(id);
}

function deleteNote(id) {
  if (confirm('¿Estás seguro de eliminar esta nota?')) {
    const pid = state.currentPatientId;
    if (state.notes[pid]) {
      state.notes[pid] = state.notes[pid].filter(n => n.id !== id);
      saveDB();
      renderNotes();
    }
  }
}

// Fluids CRUD
function openFluidsModal(id = null) {
  const pid = state.currentPatientId;
  if (!pid) {
    alert('Selecciona un paciente primero');
    return;
  }
  
  const isEdit = id !== null;
  const fluid = isEdit ? state.fluids[pid]?.find(f => f.id === id) : null;
  
  const inAmount = fluid?.in || '';
  const outAmount = fluid?.out || '';
  
  const formData = prompt(`${isEdit ? 'Editar' : 'Agregar'} Balance Hídrico (separados por coma):
Ingresos (ml), Egresos (ml)

Ejemplo: 500, 200`, 
    `${inAmount}, ${outAmount}`);
  
  if (formData) {
    const parts = formData.split(',').map(p => p.trim());
    if (parts.length >= 2) {
      const newFluid = {
        id: isEdit ? id : uid(),
        at: isEdit ? fluid.at : nowISO(),
        in: parseInt(parts[0]) || 0,
        out: parseInt(parts[1]) || 0
      };
      
      if (!state.fluids[pid]) state.fluids[pid] = [];
      
      if (isEdit) {
        const index = state.fluids[pid].findIndex(f => f.id === id);
        if (index !== -1) state.fluids[pid][index] = newFluid;
      } else {
        state.fluids[pid].push(newFluid);
      }
      
      saveDB();
      renderFluids();
    } else {
      alert('Formato incorrecto. Ingresa: Ingresos, Egresos');
    }
  }
}

function editFluid(id) {
  openFluidsModal(id);
}

function deleteFluid(id) {
  if (confirm('¿Estás seguro de eliminar este registro de balance hídrico?')) {
    const pid = state.currentPatientId;
    if (state.fluids[pid]) {
      state.fluids[pid] = state.fluids[pid].filter(f => f.id !== id);
      saveDB();
      renderFluids();
    }
  }
}

// Tasks CRUD
function openTasksModal(id = null) {
  const pid = state.currentPatientId;
  if (!pid) {
    alert('Selecciona un paciente primero');
    return;
  }
  
  const isEdit = id !== null;
  const task = isEdit ? state.tasks[pid]?.find(t => t.id === id) : null;
  
  const taskText = prompt(`${isEdit ? 'Editar' : 'Agregar'} Tarea:`, task?.text || '');
  
  if (taskText && taskText.trim()) {
    const newTask = {
      id: isEdit ? id : uid(),
      text: taskText.trim(),
      done: isEdit ? task.done : false
    };
    
    if (!state.tasks[pid]) state.tasks[pid] = [];
    
    if (isEdit) {
      const index = state.tasks[pid].findIndex(t => t.id === id);
      if (index !== -1) state.tasks[pid][index] = newTask;
    } else {
      state.tasks[pid].push(newTask);
    }
    
    saveDB();
    renderTasks();
  }
}

function editTask(id) {
  openTasksModal(id);
}

function deleteTask(id) {
  if (confirm('¿Estás seguro de eliminar esta tarea?')) {
    const pid = state.currentPatientId;
    if (state.tasks[pid]) {
      state.tasks[pid] = state.tasks[pid].filter(t => t.id !== id);
      saveDB();
      renderTasks();
    }
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

  // CRUD Event Listeners
  $('#btn-add-vitals')?.addEventListener('click', () => openVitalsModal());
  $('#btn-add-meds')?.addEventListener('click', () => openMedsModal());
  $('#btn-add-notes')?.addEventListener('click', () => openNotesModal());
  $('#btn-add-fluids')?.addEventListener('click', () => openFluidsModal());
  $('#btn-add-tasks')?.addEventListener('click', () => openTasksModal());

  // Delegated event listeners for dynamic buttons
  document.addEventListener('click', (e) => {
    const action = e.target.closest('[data-action]')?.getAttribute('data-action');
    const id = e.target.closest('[data-action]')?.getAttribute('data-id');
    
    if (action && id) {
      switch (action) {
        case 'edit-vital':
          editVital(id);
          break;
        case 'delete-vital':
          deleteVital(id);
          break;
        case 'edit-med':
          editMed(id);
          break;
        case 'delete-med':
          deleteMed(id);
          break;
        case 'edit-note':
          editNote(id);
          break;
        case 'delete-note':
          deleteNote(id);
          break;
        case 'edit-fluid':
          editFluid(id);
          break;
        case 'delete-fluid':
          deleteFluid(id);
          break;
        case 'edit-task':
          editTask(id);
          break;
        case 'delete-task':
          deleteTask(id);
          break;
      }
    }
  });

  // Medical School Enhanced Features
  
  // Tab switching
  document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const targetTab = e.target.closest('[data-tab]').getAttribute('data-tab');
      
      // Update active tab
      document.querySelectorAll('[data-tab]').forEach(t => t.classList.remove('is-active'));
      e.target.closest('[data-tab]').classList.add('is-active');
      
      // Show corresponding content
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('is-active');
        content.style.display = 'none';
      });
      
      const targetContent = document.getElementById(`tab-${targetTab}`);
      if (targetContent) {
        targetContent.classList.add('is-active');
        targetContent.style.display = 'block';
      }
    });
  });

  // BMI Calculator
  $('#btn-calc-bmi')?.addEventListener('click', () => {
    const weight = parseFloat($('#calc-weight').value);
    const height = parseFloat($('#calc-height').value);
    const resultDiv = $('#bmi-result');
    
    if (weight && height) {
      const heightM = height / 100;
      const bmi = weight / (heightM * heightM);
      let category = '';
      let color = '';
      
      if (bmi < 18.5) {
        category = 'Bajo peso';
        color = 'is-info';
      } else if (bmi < 25) {
        category = 'Peso normal';
        color = 'is-success';
      } else if (bmi < 30) {
        category = 'Sobrepeso';
        color = 'is-warning';
      } else {
        category = 'Obesidad';
        color = 'is-danger';
      }
      
      resultDiv.innerHTML = `
        <div class="notification ${color}">
          <strong>IMC: ${bmi.toFixed(1)}</strong><br>
          Categoría: ${category}
        </div>
      `;
    } else {
      resultDiv.innerHTML = '<div class="notification is-warning">Ingresa peso y altura válidos</div>';
    }
  });

  // Pediatric Dose Calculator
  $('#btn-calc-pediatric')?.addEventListener('click', () => {
    const childWeight = parseFloat($('#calc-child-weight').value);
    const adultDose = parseFloat($('#calc-adult-dose').value);
    const resultDiv = $('#pediatric-result');
    
    if (childWeight && adultDose) {
      // Clark's rule: Child dose = (Child weight in kg / 70 kg) × Adult dose
      const pediatricDose = (childWeight / 70) * adultDose;
      
      resultDiv.innerHTML = `
        <div class="notification is-info">
          <strong>Dosis Pediátrica: ${pediatricDose.toFixed(1)} mg</strong><br>
          <small>Calculado usando la regla de Clark. Siempre verificar con el médico.</small>
        </div>
      `;
    } else {
      resultDiv.innerHTML = '<div class="notification is-warning">Ingresa peso del niño y dosis del adulto</div>';
    }
  });

  // Drug Interactions Checker
  $('#btn-check-interactions')?.addEventListener('click', () => {
    const drug1 = $('#drug1').value.toLowerCase().trim();
    const drug2 = $('#drug2').value.toLowerCase().trim();
    const resultDiv = $('#interactions-result');
    
    if (drug1 && drug2) {
      // Simple interaction database
      const interactions = {
        'warfarina+aspirina': { level: 'danger', message: 'ALTO RIESGO: Aumenta significativamente el riesgo de sangrado' },
        'digoxina+furosemida': { level: 'warning', message: 'PRECAUCIÓN: Puede aumentar toxicidad de digoxina por pérdida de potasio' },
        'litio+ibuprofeno': { level: 'warning', message: 'PRECAUCIÓN: Puede aumentar los niveles de litio en sangre' },
        'metformina+alcohol': { level: 'danger', message: 'ALTO RIESGO: Puede causar acidosis láctica' },
        'paracetamol+alcohol': { level: 'warning', message: 'PRECAUCIÓN: Aumenta riesgo de hepatotoxicidad' }
      };
      
      const key1 = `${drug1}+${drug2}`;
      const key2 = `${drug2}+${drug1}`;
      
      const interaction = interactions[key1] || interactions[key2];
      
      if (interaction) {
        const colorClass = interaction.level === 'danger' ? 'is-danger' : 'is-warning';
        resultDiv.innerHTML = `
          <div class="notification ${colorClass}">
            <strong>⚠️ INTERACCIÓN DETECTADA</strong><br>
            ${interaction.message}
          </div>
        `;
      } else {
        resultDiv.innerHTML = `
          <div class="notification is-success">
            <strong>✅ No se encontraron interacciones conocidas</strong><br>
            Entre ${drug1} y ${drug2}. Siempre consultar con farmacéutico.
          </div>
        `;
      }
    } else {
      resultDiv.innerHTML = '<div class="notification is-warning">Ingresa ambos medicamentos</div>';
    }
  });

  // Emergency Protocols
  document.querySelectorAll('[data-protocol]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const protocol = e.target.getAttribute('data-protocol');
      const resultDiv = $('#protocol-result');
      
      const protocols = {
        rcp: `
          <div class="notification is-danger">
            <strong>🫀 RCP ADULTO</strong><br>
            1. Verificar respuesta y respiración<br>
            2. Llamar al 911 y conseguir DEA<br>
            3. Compresiones: 30 compresiones + 2 ventilaciones<br>
            4. Frecuencia: 100-120 compresiones/min<br>
            5. Profundidad: 5-6 cm<br>
            6. Permitir retroceso completo del tórax
          </div>
        `,
        shock: `
          <div class="notification is-danger">
            <strong>🩸 MANEJO DE SHOCK</strong><br>
            1. ABC (Vía aérea, respiración, circulación)<br>
            2. Control de hemorragias<br>
            3. Acceso IV de gran calibre x2<br>
            4. Cristaloides: 1-2L rápido<br>
            5. Elevar extremidades<br>
            6. Monitoreo continuo de signos vitales
          </div>
        `,
        anafilaxia: `
          <div class="notification is-warning">
            <strong>🚨 ANAFILAXIA</strong><br>
            1. Epinefrina IM inmediata (0.3-0.5mg)<br>
            2. Llamar al 911<br>
            3. Posición supina con piernas elevadas<br>
            4. O₂ de alto flujo<br>
            5. IV con cristaloides<br>
            6. Corticoides: Metilprednisolona 125mg IV
          </div>
        `,
        convulsiones: `
          <div class="notification is-warning">
            <strong>⚡ MANEJO DE CONVULSIONES</strong><br>
            1. Proteger de lesiones (no sujetar)<br>
            2. Posición lateral de seguridad<br>
            3. Cronometrar duración<br>
            4. Si >5min: Lorazepam 2-4mg IV<br>
            5. Verificar glucemia<br>
            6. Buscar causas reversibles
          </div>
        `
      };
      
      resultDiv.innerHTML = protocols[protocol] || '<div class="notification is-info">Protocolo no encontrado</div>';
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
