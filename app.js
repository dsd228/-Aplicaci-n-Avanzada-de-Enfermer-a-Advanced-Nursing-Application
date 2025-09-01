/* CareTrack Pro · Enfermería (vanilla JS + PWA) */
/**
 * Utility functions for DOM manipulation and data formatting
 */
const $ = (s) => document.querySelector(s);
const fmtDate = (d) => new Date(d).toLocaleDateString('es-AR');
const fmtTime = (d) => new Date(d).toLocaleTimeString('es-AR', {hour:'2-digit', minute:'2-digit'});
const nowISO = () => new Date().toISOString();

/**
 * Temperature conversion functions with validation
 * @param {number} c - Celsius temperature
 * @returns {string} Fahrenheit temperature
 */
const toF = (c) => {
  const celsius = parseFloat(c);
  if (!Number.isFinite(celsius)) return '0.0';
  return ((celsius * 9/5) + 32).toFixed(1);
};

/**
 * Convert Fahrenheit to Celsius with validation
 * @param {number} f - Fahrenheit temperature  
 * @returns {string} Celsius temperature
 */
const toC = (f) => {
  const fahrenheit = parseFloat(f);
  if (!Number.isFinite(fahrenheit)) return '0.0';
  return ((fahrenheit - 32) * 5/9).toFixed(1);
};
const uid = ()=> crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2,9);

const DB_KEY = 'ctp_enf_v2';
const PAGE_SIZE = 5;

const state = {
  nurse:'', unit:'C', lang:'es',
  currentPatientId:null,
  patients:{}, vitals:{}, meds:{}, notes:{}, fluids:{}, tasks:{},
  pages:{vitals:1, meds:1},
  audit:[] // {at, action, payload}
};

/**
 * Sanitize text input to prevent XSS attacks
 * @param {string} text - Input text to sanitize
 * @returns {string} Sanitized text
 */
function sanitizeInput(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

/**
 * Validate medical vital signs ranges
 * @param {object} vitals - Vital signs object
 * @returns {object} Validation result with isValid and errors
 */
function validateVitals(vitals) {
  const errors = [];
  const v = vitals;
  
  // Temperature validation (°C)
  if (v.tempC < 30 || v.tempC > 45) {
    errors.push('Temperatura fuera del rango válido (30-45°C)');
  }
  
  // Heart rate validation
  if (v.hr < 20 || v.hr > 250) {
    errors.push('Frecuencia cardíaca fuera del rango válido (20-250 lpm)');
  }
  
  // Blood pressure validation
  if (v.sys < 50 || v.sys > 300 || v.dia < 30 || v.dia > 200) {
    errors.push('Presión arterial fuera del rango válido');
  }
  
  // SpO2 validation
  if (v.spo2 < 50 || v.spo2 > 100) {
    errors.push('SpO₂ fuera del rango válido (50-100%)');
  }
  
  // Respiratory rate validation
  if (v.rr < 5 || v.rr > 60) {
    errors.push('Frecuencia respiratoria fuera del rango válido (5-60 rpm)');
  }
  
  // Pain scale validation
  if (v.pain !== null && (v.pain < 0 || v.pain > 10)) {
    errors.push('Escala de dolor fuera del rango válido (0-10)');
  }
  
  // GCS validation
  if (v.gcs !== null && (v.gcs < 3 || v.gcs > 15)) {
    errors.push('Escala de Glasgow fuera del rango válido (3-15)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// -------------- Persistencia --------------
/**
 * Save application state to localStorage with error handling
 */
function saveDB() {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
    alert('Error al guardar los datos. Verifique el espacio de almacenamiento.');
  }
}

/**
 * Load application state from localStorage with comprehensive error handling
 */
function loadDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const parsedData = JSON.parse(raw);
      // Validate the loaded data structure
      if (parsedData && typeof parsedData === 'object') {
        Object.assign(state, parsedData);
      } else {
        console.warn('Invalid data structure in localStorage, resetting to defaults');
        resetState();
      }
    }
  } catch (error) {
    console.error("Error loading data from localStorage:", error);
    alert('Error al cargar los datos guardados. Se reiniciará la aplicación.');
    resetState();
    saveDB(); // Save the reset state
  }
}

/**
 * Reset application state to defaults
 */
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
}

function audit(action, payload){ state.audit.push({at:nowISO(), action, payload}); if(state.audit.length>500) state.audit.shift(); }

/* ===== I18N (ES/EN) minimal ===== */
const I18N = {
  es:{ install: 'Instalar', export:'Exportar', import:'Importar', print:'Imprimir', nurse:'Profesional', patient:'Paciente', newPatient:'+ Nuevo paciente'},
  en:{ install: 'Install', export:'Export', import:'Import', print:'Print', nurse:'Nurse', patient:'Patient', newPatient:'+ New patient'}
};
function applyLang(){
  const i = I18N[state.lang];
  $('#btn-install')?.setAttribute('aria-label', i.install);
}

/* ===== Render: Patients ===== */
/**
 * Render patient selection dropdown with error handling
 */
function renderPatientSelect() {
  const sel = $('#patient-select');
  if (!sel) {
    console.warn('Patient select element not found');
    return;
  }
  
  sel.innerHTML = '';
  Object.values(state.patients).forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.id} – ${sanitizeInput(p.name)}`;
    sel.appendChild(opt);
  });
  
  if (state.currentPatientId) {
    sel.value = state.currentPatientId;
  }
}

/**
 * Render patients table with sanitized data
 */
function renderPatientsTable() {
  const tb = $('#patients-tbody');
  if (!tb) {
    console.warn('Patients table body not found');
    return;
  }
  
  tb.innerHTML = '';
  Object.values(state.patients).forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${sanitizeInput(p.id)}</td>
      <td>${sanitizeInput(p.name)}</td>
      <td>${sanitizeInput(p.age.toString())}</td>
      <td>${sanitizeInput(p.condition)}</td>
      <td>${sanitizeInput(p.allergies || '—')}</td>
      <td><button class="btn small" data-act="set-patient" data-id="${p.id}">Seleccionar</button></td>
    `;
    tb.appendChild(tr);
  });
}

/**
 * Enhanced EWS calculation with improved validation
 * @param {object} v - Vital signs object
 * @returns {number} Early Warning Score
 */
function calcEWS(v) {
  let s = 0;
  
  // Respiratory rate scoring
  if (v.rr <= 8 || v.rr >= 25) s += 3;
  else if (v.rr >= 21) s += 2;
  
  // SpO2 scoring
  if (v.spo2 < 91) s += 3;
  else if (v.spo2 <= 93) s += 2;
  else if (v.spo2 <= 95) s += 1;
  
  // Heart rate scoring
  if (v.hr <= 40 || v.hr >= 131) s += 3;
  else if (v.hr <= 50 || v.hr >= 111) s += 2;
  else if (v.hr >= 91) s += 1;
  
  // Systolic BP scoring
  if (v.sys <= 90 || v.sys >= 220) s += 3;
  else if (v.sys <= 100) s += 2;
  else if (v.sys <= 110) s += 1;
  
  // Temperature scoring
  const t = v.tempC;
  if (t <= 35.0 || t >= 39.1) s += 3;
  else if (t <= 36.0 || t >= 38.1) s += 1;
  
  return s;
}

/**
 * Render EWS chip with appropriate styling
 * @param {number} score - EWS score
 */
function renderEWS(score) {
  const chip = $('#ews-chip');
  if (!chip) return;
  
  chip.textContent = `EWS: ${score}`;
  chip.className = 'chip ' + (score >= 7 ? 'danger' : score >= 3 ? 'warn' : 'ok');
}

/**
 * Render vitals table with improved error handling and sanitization
 */
function renderVitals() {
  const pid = state.currentPatientId;
  if (!pid) return;
  
  const arr = (state.vitals[pid] || []).slice().sort((a, b) => b.at.localeCompare(a.at));
  const page = state.pages.vitals || 1;
  const total = Math.max(1, Math.ceil(arr.length / PAGE_SIZE));
  state.pages.vitals = Math.min(page, total);
  
  const start = (state.pages.vitals - 1) * PAGE_SIZE;
  const view = arr.slice(start, start + PAGE_SIZE);
  
  const tb = $('#vitals-tbody');
  if (!tb) {
    console.warn('Vitals table body not found');
    return;
  }
  
  tb.innerHTML = '';
  view.forEach(v => {
    const d = new Date(v.at);
    const t = state.unit === 'C' 
      ? `${v.tempC.toFixed(1)} °C` 
      : `${toF(v.tempC)} °F`;
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${fmtDate(d)}</td>
      <td>${fmtTime(d)}</td>
      <td>${t}</td>
      <td>${v.hr}</td>
      <td>${v.sys}/${v.dia}</td>
      <td>${v.spo2}</td>
      <td>${v.rr}</td>
      <td>${v.pain ?? '—'}</td>
      <td>${v.gcs ?? '—'}</td>
      <td>${sanitizeInput(v.notes || '')}</td>
    `;
    tb.appendChild(tr);
  });
  
  // Update pagination info
  const pageInfo = $('#vitals-page');
  if (pageInfo) {
    pageInfo.textContent = `Página ${state.pages.vitals} de ${Math.max(1, Math.ceil(arr.length / PAGE_SIZE))}`;
  }
  
  const lastInfo = $('#vitals-last');
  if (lastInfo) {
    lastInfo.textContent = arr[0] 
      ? `Último: ${fmtDate(arr[0].at)} ${fmtTime(arr[0].at)}` 
      : '';
  }
  
  const latest = arr[0];
  renderEWS(latest ? calcEWS(latest) : 0);
  renderVitalsChart(arr.slice().reverse().slice(-20)); // last 20 for chart
}

/**
 * Simple canvas chart for temperature trend with improved error handling
 * @param {Array} data - Array of vital signs data
 */
function renderVitalsChart(data) {
  const c = $('#vitals-chart');
  if (!c) {
    console.warn('Vitals chart canvas not found');
    return;
  }
  
  const ctx = c.getContext('2d');
  if (!ctx) {
    console.warn('Unable to get 2D context for vitals chart');
    return;
  }
  
  const W = c.width = c.clientWidth;
  const H = c.height = 120;
  ctx.clearRect(0, 0, W, H);
  
  if (!data.length) return;
  
  const temps = data.map(v => v.tempC).filter(t => Number.isFinite(t));
  if (temps.length === 0) return;
  
  const min = Math.min(...temps) - 0.5;
  const max = Math.max(...temps) + 0.5;
  const pad = 10;
  
  // Draw grid
  ctx.strokeStyle = '#dce1e5';
  ctx.lineWidth = 1;
  for (let y = 0; y < 4; y++) {
    const yy = pad + (H - 2 * pad) * y / 3;
    ctx.beginPath();
    ctx.moveTo(pad, yy);
    ctx.lineTo(W - pad, yy);
    ctx.stroke();
  }
  
  // Draw temperature line
  ctx.strokeStyle = '#1994e6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  
  data.forEach((v, i) => {
    if (!Number.isFinite(v.tempC)) return;
    
    const x = pad + (W - 2 * pad) * i / (data.length - 1);
    const t = v.tempC;
    const y = H - pad - ((t - min) / (max - min)) * (H - 2 * pad);
    
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  
  ctx.stroke();
}

/* ===== Render: Meds ===== */
function renderMeds(){
  const pid = state.currentPatientId; if(!pid) return;
  const arr=(state.meds[pid]||[]).slice().sort((a,b)=> (b.date||b.at).localeCompare(a.date||a.at));
  const page=state.pages.meds||1; const total=Math.max(1,Math.ceil(arr.length/PAGE_SIZE));
  state.pages.meds=Math.min(page,total);
  const start=(state.pages.meds-1)*PAGE_SIZE; const view=arr.slice(start,start+PAGE_SIZE);
  const tb=$('#meds-tbody'); tb.innerHTML='';
  view.forEach(m=>{
    const d=new Date(m.date||m.at);
    const badge = m.status==='Administrado'?'ok': m.status==='Programado'?'warn':'danger';
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${fmtDate(d)}</td><td>${m.time||'—'}</td><td>${m.name}</td><td>${m.dose}</td><td>${m.route}</td><td>${m.freq}</td>
    <td><span class="chip ${badge}">${m.status}</span></td>
    <td><button class="btn small" data-act="toggle-med" data-id="${m.id}">Cambiar</button></td>`;
    tb.appendChild(tr);
  });
  $('#meds-page').textContent=`Página ${state.pages.meds} de ${Math.max(1,Math.ceil(arr.length/PAGE_SIZE))}`;
}

/* ===== Render: Notes ===== */
function renderNotes(){
  const pid=state.currentPatientId; if(!pid) return;
  const filter = $('#notes-filter').value;
  const arr=(state.notes[pid]||[]).slice().sort((a,b)=>b.at.localeCompare(a.at)).filter(n=> filter==='all' || n.type===filter);
  const ul=$('#notes-list'); ul.innerHTML='';
  arr.forEach(n=>{
    const li=document.createElement('li');
    li.innerHTML=`<span><b>${n.type}</b> — ${n.text}</span><span class="muted">${fmtDate(n.at)}</span>`;
    ul.appendChild(li);
  });
}

/* ===== Render: Fluids ===== */
function renderFluids(){
  const pid=state.currentPatientId; if(!pid) return;
  const arr=(state.fluids[pid]||[]).slice().sort((a,b)=>b.at.localeCompare(a.at));
  const ul=$('#fluid-list'); ul.innerHTML='';
  let net=0;
  arr.forEach(f=>{ net += (f.in||0)-(f.out||0);
    const li=document.createElement('li');
    li.innerHTML=`<span>${fmtDate(f.at)}</span><span>+${f.in||0} / -${f.out||0} ml</span>`;
    ul.appendChild(li);
  });
  $('#fluid-net').textContent=net;
}

/* ===== Render: Tasks ===== */
function renderTasks(){
  const pid=state.currentPatientId; if(!pid) return;
  const ul=$('#tasks-list'); ul.innerHTML='';
  (state.tasks[pid]||[]).forEach(t=>{
    const li=document.createElement('li');
    li.innerHTML=`<label><input type="checkbox" ${t.done?'checked':''} data-act="toggle-task" data-id="${t.id}"> ${t.text}</label>
    <button class="btn small" data-act="del-task" data-id="${t.id}">Eliminar</button>`;
    ul.appendChild(li);
  });
}

/* ===== Alerts ===== */
function renderAlerts(){
  const pid=state.currentPatientId; if(!pid) return;
  const ul=$('#alerts-list'); ul.innerHTML='';
  const v=(state.vitals[pid]||[]).slice().sort((a,b)=>b.at.localeCompare(a.at))[0];
  if(!v){ ul.innerHTML='<li class="muted">Sin registros</li>'; return; }
  const alerts=[];
  if(v.tempC>=38) alerts.push({t:`Fiebre ${v.tempC.toFixed(1)}°C`, sev:'warn'});
  if(v.tempC<=35) alerts.push({t:`Hipotermia ${v.tempC.toFixed(1)}°C`, sev:'danger'});
  if(v.spo2<92) alerts.push({t:`SpO₂ baja (${v.spo2}%)`, sev:'danger'});
  if(v.rr>24) alerts.push({t:`Taquipnea (${v.rr} rpm)`, sev:'warn'});
  if(v.hr>120) alerts.push({t:`Taquicardia (${v.hr} lpm)`, sev:'warn'});
  if(v.sys<90) alerts.push({t:`Hipotensión (PAS ${v.sys} mmHg)`, sev:'danger'});
  const ews = calcEWS(v); if(ews>=5) alerts.push({t:`EWS alto (${ews})`, sev:'danger'});
  if(!alerts.length) alerts.push({t:'Sin alertas. Paciente estable.', sev:'ok'});
  alerts.forEach(a=>{
    const li=document.createElement('li');
    const cls = a.sev==='danger'?'danger': a.sev==='warn'?'warn':'ok';
    li.innerHTML=`<span class="chip ${cls}">${cls.toUpperCase()}</span><span>${a.t}</span>`;
    ul.appendChild(li);
  });
}

/* ===== Actions ===== */
/**
 * Add new vital signs record with comprehensive validation
 */
function addVital() {
  const pid = state.currentPatientId;
  if (!pid) return alert('Seleccioná un paciente');
  
  const unitC = !$('#unit-toggle').checked;
  let temp = parseFloat($('#v-temp').value);
  
  if (!Number.isFinite(temp)) {
    return alert('Temperatura inválida');
  }
  
  const v = {
    id: uid(),
    at: nowISO(),
    tempC: unitC ? temp : parseFloat(toC(temp)),
    hr: +($('#v-hr').value || 0),
    sys: +($('#v-sys').value || 0),
    dia: +($('#v-dia').value || 0),
    spo2: +($('#v-spo2').value || 0),
    rr: +($('#v-rr').value || 0),
    pain: $('#v-pain').value ? +$('#v-pain').value : null,
    gcs: $('#v-gcs').value ? +$('#v-gcs').value : null,
    notes: sanitizeInput($('#v-notes').value || '')
  };
  
  // Validate vital signs
  const validation = validateVitals(v);
  if (!validation.isValid) {
    alert('Errores de validación:\n' + validation.errors.join('\n'));
    return;
  }
  
  // Additional critical value check
  if (v.spo2 && v.spo2 < 80) {
    if (!confirm('SpO₂ críticamente baja (' + v.spo2 + '%). ¿Confirmar registro?')) {
      return;
    }
  }
  
  (state.vitals[pid] ??= []).push(v);
  audit('add_vital', {pid, v});
  saveDB();
  renderVitals();
  renderAlerts();
  
  // Clear form fields
  ['v-temp','v-hr','v-sys','v-dia','v-spo2','v-rr','v-pain','v-gcs','v-notes']
    .forEach(id => {
      const element = $('#' + id);
      if (element) element.value = '';
    });
}
/**
 * Add new medication record with validation and sanitization
 */
function addMed() {
  const pid = state.currentPatientId;
  if (!pid) return alert('Seleccioná un paciente');
  
  const name = sanitizeInput($('#m-name').value || '');
  const dose = sanitizeInput($('#m-dose').value || '');
  const freq = sanitizeInput($('#m-freq').value || '');
  
  if (!name || !dose || !freq) {
    return alert('Completá medicamento, dosis y frecuencia');
  }
  
  const m = {
    id: uid(),
    at: nowISO(),
    date: nowISO(),
    time: $('#m-time').value || '',
    name: name,
    dose: dose,
    route: $('#m-route').value,
    freq: freq,
    status: $('#m-status').value
  };
  
  (state.meds[pid] ??= []).push(m);
  audit('add_med', {pid, m});
  saveDB();
  renderMeds();
  
  // Clear form fields
  ['m-name','m-dose','m-freq'].forEach(id => {
    const element = $('#' + id);
    if (element) element.value = '';
  });
}

/**
 * Add new note with sanitization
 */
function addNote() {
  const pid = state.currentPatientId;
  if (!pid) return alert('Seleccioná un paciente');
  
  const text = sanitizeInput($('#note-text').value || '');
  if (!text) return;
  
  const type = $('#note-type').value;
  const n = {
    id: uid(),
    at: nowISO(),
    type: type,
    text: text
  };
  
  (state.notes[pid] ??= []).push(n);
  audit('add_note', {pid, n});
  saveDB();
  renderNotes();
  
  const noteElement = $('#note-text');
  if (noteElement) noteElement.value = '';
}
/**
 * Add fluid balance record with validation
 */
function addFluid() {
  const pid = state.currentPatientId;
  if (!pid) return alert('Seleccioná un paciente');
  
  const fin = +($('#f-in').value || 0);
  const fout = +($('#f-out').value || 0);
  
  // Validate fluid values
  if (fin < 0 || fout < 0) {
    return alert('Los valores de fluidos no pueden ser negativos');
  }
  
  if (fin > 10000 || fout > 10000) {
    return alert('Valores de fluidos excesivamente altos (máximo 10000ml)');
  }
  
  const f = {
    id: uid(),
    at: nowISO(),
    in: fin,
    out: fout
  };
  
  (state.fluids[pid] ??= []).push(f);
  audit('add_fluid', {pid, f});
  saveDB();
  renderFluids();
  
  // Clear form fields
  const finElement = $('#f-in');
  const foutElement = $('#f-out');
  if (finElement) finElement.value = '';
  if (foutElement) foutElement.value = '';
}

/**
 * Add task with sanitization
 */
function addTask() {
  const pid = state.currentPatientId;
  if (!pid) return alert('Seleccioná un paciente');
  
  const text = sanitizeInput($('#task-text').value || '');
  if (!text) return;
  
  const t = {
    id: uid(),
    text: text,
    done: false
  };
  
  (state.tasks[pid] ??= []).push(t);
  audit('add_task', {pid, t});
  saveDB();
  renderTasks();
  
  const taskElement = $('#task-text');
  if (taskElement) taskElement.value = '';
}

/* ===== Events (delegation) ===== */
function wire(){
  $('#btn-new-patient').addEventListener('click', ()=>{
    $('#patient-modal-title').textContent='Nuevo paciente';
    ['p-id','p-name','p-age','p-cond','p-allerg'].forEach(id=>$('#'+id).value='');
    $('#patient-modal').showModal();
  });
  $('#patient-modal-save').addEventListener('click', (e)=>{
    e.preventDefault();
    const p={ id:$('#p-id').value.trim(), name:$('#p-name').value.trim(), age:+$('#p-age').value||0, condition:$('#p-cond').value.trim(), allergies:$('#p-allerg').value.trim() };
    if(!p.id||!p.name||!p.age||!p.condition) return;
    state.patients[p.id]=p; state.currentPatientId=p.id; audit('save_patient',p); saveDB();
    renderPatientSelect(); renderPatientsTable(); renderAll(); $('#patient-modal').close();
  });
  $('#btn-edit-patient').addEventListener('click', ()=>{
    const p=state.patients[state.currentPatientId]; if(!p) return alert('Seleccioná un paciente');
    $('#patient-modal-title').textContent='Editar paciente';
    $('#p-id').value=p.id; $('#p-name').value=p.name; $('#p-age').value=p.age; $('#p-cond').value=p.condition; $('#p-allerg').value=p.allergies||'';
    $('#patient-modal').showModal();
  });
  $('#patient-select').addEventListener('change', (e)=>{ state.currentPatientId=e.target.value; saveDB(); renderAll(); });

  $('#btn-add-vital').addEventListener('click', addVital);
  $('#btn-clear-vital').addEventListener('click', ()=>{ ['v-temp','v-hr','v-sys','v-dia','v-spo2','v-rr','v-pain','v-gcs','v-notes'].forEach(id=>$('#'+id).value=''); });
  $('#vitals-prev').addEventListener('click', ()=>{ state.pages.vitals=Math.max(1,(state.pages.vitals||1)-1); renderVitals(); });
  $('#vitals-next').addEventListener('click', ()=>{ state.pages.vitals=(state.pages.vitals||1)+1; renderVitals(); });

  $('#btn-add-med').addEventListener('click', addMed);
  $('#meds-prev').addEventListener('click', ()=>{ state.pages.meds=Math.max(1,(state.pages.meds||1)-1); renderMeds(); });
  $('#meds-next').addEventListener('click', ()=>{ state.pages.meds=(state.pages.meds||1)+1; renderMeds(); });

  document.addEventListener('click', (e)=>{
    const act = e.target.getAttribute('data-act'); if(!act) return;
    if(act==='set-patient'){ state.currentPatientId=e.target.dataset.id; saveDB(); renderPatientSelect(); renderAll(); }
    if(act==='toggle-med'){ const pid=state.currentPatientId; const id=e.target.dataset.id; const m=(state.meds[pid]||[]).find(x=>x.id===id); if(!m) return; m.status = m.status==='Programado'?'Administrado': m.status==='Administrado'?'Omitido':'Programado'; audit('toggle_med',{pid,id,status:m.status}); saveDB(); renderMeds(); }
    if(act==='toggle-task'){ const pid=state.currentPatientId; const id=e.target.dataset.id; const t=(state.tasks[pid]||[]).find(x=>x.id===id); if(t){ t.done=!t.done; audit('toggle_task',{pid,id,done:t.done}); saveDB(); renderTasks(); } }
    if(act==='del-task'){ const pid=state.currentPatientId; const id=e.target.dataset.id; state.tasks[pid]=(state.tasks[pid]||[]).filter(x=>x.id!==id); audit('del_task',{pid,id}); saveDB(); renderTasks(); }
  });

  $('#btn-add-note').addEventListener('click', addNote);
  $('#notes-filter').addEventListener('change', renderNotes);

  $('#btn-add-fluid').addEventListener('click', addFluid);

  $('#unit-toggle').addEventListener('change', (e)=>{ state.unit = e.target.checked? 'F':'C'; $('#lbl-temp-unit').textContent = e.target.checked? '°F':'°C'; saveDB(); renderVitals(); });
  $('#lang-toggle').addEventListener('change', (e)=>{ state.lang = e.target.checked? 'en':'es'; saveDB(); applyLang(); });

  $('#btn-export').addEventListener('click', ()=>{
    const a=document.createElement('a'); a.download='caretrack_pro.json';
    a.href='data:application/json,'+encodeURIComponent(JSON.stringify(state)); a.click();
  });
  $('#import-file').addEventListener('change', (e)=>{
    const file=e.target.files[0]; if(!file) return; const fr=new FileReader(); fr.onload=()=>{ try{ const obj=JSON.parse(fr.result); Object.assign(state,obj); saveDB(); renderAll(); }catch(err){ alert('Archivo inválido'); } }; fr.readAsText(file);
  });
  $('#btn-print').addEventListener('click', ()=> window.print());
}

/* ===== PWA install ===== */
let deferredPrompt=null;
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault(); deferredPrompt=e; const btn=$('#btn-install'); if(btn) btn.hidden=false;
});
$('#btn-install')?.addEventListener('click', async ()=>{
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt=null;
  $('#btn-install').hidden=true;
});

if('serviceWorker' in navigator){ window.addEventListener('load', ()=> navigator.serviceWorker.register('./sw.js')); }

/* ===== Boot ===== */
loadDB(); seed(); wire(); (function renderAll(){ 
  renderPatientSelect(); renderPatientsTable(); renderVitals(); renderMeds(); renderNotes(); renderFluids(); renderTasks(); renderAlerts();
  $('#nurse-name').value=state.nurse||''; $('#unit-toggle').checked = state.unit==='F'; $('#lbl-temp-unit').textContent = state.unit==='F'? '°F':'°C';
  applyLang();
})(); 
$('#nurse-name').addEventListener('input', (e)=>{ state.nurse=e.target.value; saveDB(); });
