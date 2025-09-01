/* CareTrack Pro · Enfermería (vanilla JS + PWA) */
const uid = ()=> crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2,9);
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
/**
 * Utility function for debouncing frequent function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Cache for DOM elements to reduce lookups
 */
const domCache = new Map();

/**
 * Cached DOM element selector with fallback
 * @param {string} selector - CSS selector
 * @returns {Element|null} DOM element
 */
function getCached(selector) {
  if (!domCache.has(selector)) {
    domCache.set(selector, document.querySelector(selector));
  }
  return domCache.get(selector);
}

/**
 * Clear DOM cache when elements might have changed
 */
function clearDOMCache() {
  domCache.clear();
}

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
/**
 * Render medications table with improved error handling and sanitization
 */
function renderMeds() {
  const pid = state.currentPatientId;
  if (!pid) return;
  
  const arr = (state.meds[pid] || []).slice().sort((a, b) => 
    (b.date || b.at).localeCompare(a.date || a.at)
  );
  const page = state.pages.meds || 1;
  const total = Math.max(1, Math.ceil(arr.length / PAGE_SIZE));
  state.pages.meds = Math.min(page, total);
  
  const start = (state.pages.meds - 1) * PAGE_SIZE;
  const view = arr.slice(start, start + PAGE_SIZE);
  
  const tb = $('#meds-tbody');
  if (!tb) {
    console.warn('Medications table body not found');
    return;
  }
  
  tb.innerHTML = '';
  view.forEach(m => {
    const d = new Date(m.date || m.at);
    const badge = m.status === 'Administrado' ? 'ok' : 
                  m.status === 'Programado' ? 'warn' : 'danger';
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${fmtDate(d)}</td>
      <td>${sanitizeInput(m.time || '—')}</td>
      <td>${sanitizeInput(m.name)}</td>
      <td>${sanitizeInput(m.dose)}</td>
      <td>${sanitizeInput(m.route)}</td>
      <td>${sanitizeInput(m.freq)}</td>
      <td><span class="chip ${badge}">${sanitizeInput(m.status)}</span></td>
      <td><button class="btn small" data-act="toggle-med" data-id="${m.id}">Cambiar</button></td>
    `;
    tb.appendChild(tr);
  });
  
  const pageInfo = $('#meds-page');
  if (pageInfo) {
    pageInfo.textContent = `Página ${state.pages.meds} de ${Math.max(1, Math.ceil(arr.length / PAGE_SIZE))}`;
  }
}

/* ===== Render: Notes ===== */
/**
 * Render notes list with improved error handling and sanitization
 */
function renderNotes() {
  const pid = state.currentPatientId;
  if (!pid) return;
  
  const filterElement = $('#notes-filter');
  const filter = filterElement ? filterElement.value : 'all';
  
  const arr = (state.notes[pid] || [])
    .slice()
    .sort((a, b) => b.at.localeCompare(a.at))
    .filter(n => filter === 'all' || n.type === filter);
  
  const ul = $('#notes-list');
  if (!ul) {
    console.warn('Notes list element not found');
    return;
  }
  
  ul.innerHTML = '';
  arr.forEach(n => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span><b>${sanitizeInput(n.type)}</b> — ${sanitizeInput(n.text)}</span>
      <span class="muted">${fmtDate(n.at)}</span>
    `;
    ul.appendChild(li);
  });
}

/* ===== Render: Fluids ===== */
/**
 * Render fluid balance with improved error handling
 */
function renderFluids() {
  const pid = state.currentPatientId;
  if (!pid) return;
  
  const arr = (state.fluids[pid] || []).slice().sort((a, b) => b.at.localeCompare(a.at));
  
  const ul = $('#fluid-list');
  if (!ul) {
    console.warn('Fluid list element not found');
    return;
  }
  
  ul.innerHTML = '';
  let net = 0;
  
  arr.forEach(f => {
    net += (f.in || 0) - (f.out || 0);
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${fmtDate(f.at)}</span>
      <span>+${f.in || 0} / -${f.out || 0} ml</span>
    `;
    ul.appendChild(li);
  });
  
  const netElement = $('#fluid-net');
  if (netElement) {
    netElement.textContent = net;
  }
}

/* ===== Render: Tasks ===== */
/**
 * Render task list with improved error handling and sanitization
 */
function renderTasks() {
  const pid = state.currentPatientId;
  if (!pid) return;
  
  const ul = $('#tasks-list');
  if (!ul) {
    console.warn('Tasks list element not found');
    return;
  }
  
  ul.innerHTML = '';
  (state.tasks[pid] || []).forEach(t => {
    const li = document.createElement('li');
    li.innerHTML = `
      <label>
        <input type="checkbox" ${t.done ? 'checked' : ''} 
               data-act="toggle-task" data-id="${t.id}"> 
        ${sanitizeInput(t.text)}
      </label>
      <button class="btn small" data-act="del-task" data-id="${t.id}">Eliminar</button>
    `;
    ul.appendChild(li);
  });
}

/* ===== Alerts ===== */
/**
 * Render medical alerts based on latest vital signs with improved validation
 */
function renderAlerts() {
  const pid = state.currentPatientId;
  if (!pid) return;
  
  const ul = $('#alerts-list');
  if (!ul) {
    console.warn('Alerts list element not found');
    return;
  }
  
  ul.innerHTML = '';
  const v = (state.vitals[pid] || [])
    .slice()
    .sort((a, b) => b.at.localeCompare(a.at))[0];
  
  if (!v) {
    ul.innerHTML = '<li class="muted">Sin registros</li>';
    return;
  }
  
  const alerts = [];
  
  // Temperature alerts
  if (v.tempC >= 38) alerts.push({
    t: `Fiebre ${v.tempC.toFixed(1)}°C`, 
    sev: v.tempC >= 39 ? 'danger' : 'warn'
  });
  if (v.tempC <= 35) alerts.push({
    t: `Hipotermia ${v.tempC.toFixed(1)}°C`, 
    sev: 'danger'
  });
  
  // Oxygen saturation alerts
  if (v.spo2 < 92) alerts.push({
    t: `SpO₂ baja (${v.spo2}%)`, 
    sev: v.spo2 < 85 ? 'danger' : 'warn'
  });
  
  // Respiratory rate alerts
  if (v.rr > 24 || v.rr < 12) alerts.push({
    t: v.rr > 24 ? `Taquipnea (${v.rr} rpm)` : `Bradipnea (${v.rr} rpm)`, 
    sev: v.rr > 30 || v.rr < 10 ? 'danger' : 'warn'
  });
  
  // Heart rate alerts
  if (v.hr > 120 || v.hr < 50) alerts.push({
    t: v.hr > 120 ? `Taquicardia (${v.hr} lpm)` : `Bradicardia (${v.hr} lpm)`, 
    sev: v.hr > 150 || v.hr < 40 ? 'danger' : 'warn'
  });
  
  // Blood pressure alerts
  if (v.sys < 90 || v.sys > 180) alerts.push({
    t: v.sys < 90 ? `Hipotensión (PAS ${v.sys} mmHg)` : `Hipertensión (PAS ${v.sys} mmHg)`, 
    sev: v.sys < 80 || v.sys > 200 ? 'danger' : 'warn'
  });
  
  // EWS alert
  const ews = calcEWS(v);
  if (ews >= 5) alerts.push({
    t: `EWS alto (${ews})`, 
    sev: ews >= 7 ? 'danger' : 'warn'
  });
  
  // Pain alert
  if (v.pain && v.pain >= 7) alerts.push({
    t: `Dolor severo (${v.pain}/10)`, 
    sev: v.pain >= 9 ? 'danger' : 'warn'
  });
  
  // GCS alert
  if (v.gcs && v.gcs <= 12) alerts.push({
    t: `GCS bajo (${v.gcs}/15)`, 
    sev: v.gcs <= 8 ? 'danger' : 'warn'
  });
  
  if (!alerts.length) {
    alerts.push({t: 'Sin alertas. Paciente estable.', sev: 'ok'});
  }
  
  alerts.forEach(a => {
    const li = document.createElement('li');
    const cls = a.sev === 'danger' ? 'danger' : a.sev === 'warn' ? 'warn' : 'ok';
    li.innerHTML = `
      <span class="chip ${cls}">${cls.toUpperCase()}</span>
      <span>${sanitizeInput(a.t)}</span>
    `;
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
/**
 * Wire up event handlers with improved error handling and debouncing
 */
function wire() {
  // Create debounced save function
  const debouncedSave = debounce(saveDB, 300);
  
  // Patient management
  const newPatientBtn = $('#btn-new-patient');
  if (newPatientBtn) {
    newPatientBtn.addEventListener('click', () => {
      const titleElement = $('#patient-modal-title');
      if (titleElement) titleElement.textContent = 'Nuevo paciente';
      
      ['p-id','p-name','p-age','p-cond','p-allerg'].forEach(id => {
        const element = $('#' + id);
        if (element) element.value = '';
      });
      
      const modal = $('#patient-modal');
      if (modal && modal.showModal) modal.showModal();
    });
  }
  
  const savePatientBtn = $('#patient-modal-save');
  if (savePatientBtn) {
    savePatientBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const idEl = $('#p-id');
      const nameEl = $('#p-name');
      const ageEl = $('#p-age');
      const condEl = $('#p-cond');
      const allergEl = $('#p-allerg');
      
      if (!idEl || !nameEl || !ageEl || !condEl) {
        alert('Faltan elementos del formulario');
        return;
      }
      
      const p = {
        id: sanitizeInput(idEl.value.trim()),
        name: sanitizeInput(nameEl.value.trim()),
        age: +(ageEl.value) || 0,
        condition: sanitizeInput(condEl.value.trim()),
        allergies: sanitizeInput(allergEl.value.trim())
      };
      
      if (!p.id || !p.name || !p.age || !p.condition) {
        alert('Completá todos los campos obligatorios');
        return;
      }
      
      state.patients[p.id] = p;
      state.currentPatientId = p.id;
      audit('save_patient', p);
      saveDB();
      renderPatientSelect();
      renderPatientsTable();
      renderAll();
      
      const modal = $('#patient-modal');
      if (modal && modal.close) modal.close();
    });
  }
  
  const editPatientBtn = $('#btn-edit-patient');
  if (editPatientBtn) {
    editPatientBtn.addEventListener('click', () => {
      const p = state.patients[state.currentPatientId];
      if (!p) return alert('Seleccioná un paciente');
      
      const titleElement = $('#patient-modal-title');
      if (titleElement) titleElement.textContent = 'Editar paciente';
      
      const elements = {
        'p-id': p.id,
        'p-name': p.name,
        'p-age': p.age,
        'p-cond': p.condition,
        'p-allerg': p.allergies || ''
      };
      
      Object.entries(elements).forEach(([id, value]) => {
        const element = $('#' + id);
        if (element) element.value = value;
      });
      
      const modal = $('#patient-modal');
      if (modal && modal.showModal) modal.showModal();
    });
  }
  
  const patientSelect = $('#patient-select');
  if (patientSelect) {
    patientSelect.addEventListener('change', (e) => {
      state.currentPatientId = e.target.value;
      saveDB();
      renderAll();
    });
  }

  // Vital signs
  const addVitalBtn = $('#btn-add-vital');
  if (addVitalBtn) addVitalBtn.addEventListener('click', addVital);
  
  const clearVitalBtn = $('#btn-clear-vital');
  if (clearVitalBtn) {
    clearVitalBtn.addEventListener('click', () => {
      ['v-temp','v-hr','v-sys','v-dia','v-spo2','v-rr','v-pain','v-gcs','v-notes'].forEach(id => {
        const element = $('#' + id);
        if (element) element.value = '';
      });
    });
  }
  
  const vitalsPrev = $('#vitals-prev');
  if (vitalsPrev) {
    vitalsPrev.addEventListener('click', () => {
      state.pages.vitals = Math.max(1, (state.pages.vitals || 1) - 1);
      renderVitals();
    });
  }
  
  const vitalsNext = $('#vitals-next');
  if (vitalsNext) {
    vitalsNext.addEventListener('click', () => {
      state.pages.vitals = (state.pages.vitals || 1) + 1;
      renderVitals();
    });
  }

  // Medications
  const addMedBtn = $('#btn-add-med');
  if (addMedBtn) addMedBtn.addEventListener('click', addMed);
  
  const medsPrev = $('#meds-prev');
  if (medsPrev) {
    medsPrev.addEventListener('click', () => {
      state.pages.meds = Math.max(1, (state.pages.meds || 1) - 1);
      renderMeds();
    });
  }
  
  const medsNext = $('#meds-next');
  if (medsNext) {
    medsNext.addEventListener('click', () => {
      state.pages.meds = (state.pages.meds || 1) + 1;
      renderMeds();
    });
  }

  // Global click handler for data actions
  document.addEventListener('click', (e) => {
    const act = e.target.getAttribute('data-act');
    if (!act) return;
    
    const pid = state.currentPatientId;
    const id = e.target.dataset.id;
    
    switch (act) {
      case 'set-patient':
        state.currentPatientId = id;
        saveDB();
        renderPatientSelect();
        renderAll();
        break;
        
      case 'toggle-med':
        if (!pid) return;
        const m = (state.meds[pid] || []).find(x => x.id === id);
        if (!m) return;
        
        m.status = m.status === 'Programado' ? 'Administrado' : 
                   m.status === 'Administrado' ? 'Omitido' : 'Programado';
        audit('toggle_med', {pid, id, status: m.status});
        saveDB();
        renderMeds();
        break;
        
      case 'toggle-task':
        if (!pid) return;
        const t = (state.tasks[pid] || []).find(x => x.id === id);
        if (t) {
          t.done = !t.done;
          audit('toggle_task', {pid, id, done: t.done});
          saveDB();
          renderTasks();
        }
        break;
        
      case 'del-task':
        if (!pid) return;
        state.tasks[pid] = (state.tasks[pid] || []).filter(x => x.id !== id);
        audit('del_task', {pid, id});
        saveDB();
        renderTasks();
        break;
    }
  });

  // Notes and other functionality
  const addNoteBtn = $('#btn-add-note');
  if (addNoteBtn) addNoteBtn.addEventListener('click', addNote);
  
  const notesFilter = $('#notes-filter');
  if (notesFilter) notesFilter.addEventListener('change', renderNotes);

  const addFluidBtn = $('#btn-add-fluid');
  if (addFluidBtn) addFluidBtn.addEventListener('click', addFluid);

  // Settings with debounced saving
  const unitToggle = $('#unit-toggle');
  if (unitToggle) {
    unitToggle.addEventListener('change', (e) => {
      state.unit = e.target.checked ? 'F' : 'C';
      const tempLabel = $('#lbl-temp-unit');
      if (tempLabel) tempLabel.textContent = e.target.checked ? '°F' : '°C';
      debouncedSave();
      renderVitals();
    });
  }
  
  const langToggle = $('#lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('change', (e) => {
      state.lang = e.target.checked ? 'en' : 'es';
      debouncedSave();
      applyLang();
    });
  }

  // Export functionality
  const exportBtn = $('#btn-export');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      try {
        const a = document.createElement('a');
        a.download = 'caretrack_pro.json';
        a.href = 'data:application/json,' + encodeURIComponent(JSON.stringify(state));
        a.click();
      } catch (error) {
        console.error('Export failed:', error);
        alert('Error al exportar los datos');
      }
    });
  }
  
  // Import functionality
  const importFile = $('#import-file');
  if (importFile) {
    importFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const fr = new FileReader();
      fr.onload = () => {
        try {
          const obj = JSON.parse(fr.result);
          if (obj && typeof obj === 'object') {
            Object.assign(state, obj);
            saveDB();
            renderAll();
            alert('Datos importados correctamente');
          } else {
            alert('Archivo inválido: estructura incorrecta');
          }
        } catch (error) {
          console.error('Import failed:', error);
          alert('Archivo inválido: no se pudo parsear JSON');
        }
      };
      fr.readAsText(file);
    });
  }
  
  // Print functionality
  const printBtn = $('#btn-print');
  if (printBtn) printBtn.addEventListener('click', () => window.print());
}

/* ===== PWA install ===== */
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('PWA install prompt available');
  e.preventDefault();
  deferredPrompt = e;
  const btn = $('#btn-install');
  if (btn) btn.hidden = false;
});

const installBtn = $('#btn-install');
if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) {
      console.warn('No install prompt available');
      return;
    }
    
    try {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      console.log('PWA install choice:', choice.outcome);
      deferredPrompt = null;
      installBtn.hidden = true;
    } catch (error) {
      console.error('PWA install failed:', error);
    }
  });
}

// Register service worker with error handling
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('Service Worker registered successfully:', registration.scope);
      })
      .catch(error => {
        console.warn('Service Worker registration failed:', error);
      });
  });
}

/* ===== Boot ===== */
/**
 * Initialize application with error handling
 */
function initializeApp() {
  try {
    loadDB();
    seed();
    wire();
    
    // Initial render
    renderPatientSelect();
    renderPatientsTable();
    renderVitals();
    renderMeds();
    renderNotes();
    renderFluids();
    renderTasks();
    renderAlerts();
    
    // Initialize form values
    const nurseNameInput = $('#nurse-name');
    if (nurseNameInput) {
      nurseNameInput.value = state.nurse || '';
      
      // Add debounced nurse name input handler
      const debouncedNurseSave = debounce((value) => {
        state.nurse = sanitizeInput(value);
        saveDB();
      }, 500);
      
      nurseNameInput.addEventListener('input', (e) => {
        debouncedNurseSave(e.target.value);
      });
    }
    
    const unitToggle = $('#unit-toggle');
    if (unitToggle) {
      unitToggle.checked = state.unit === 'F';
    }
    
    const tempLabel = $('#lbl-temp-unit');
    if (tempLabel) {
      tempLabel.textContent = state.unit === 'F' ? '°F' : '°C';
    }
    
    applyLang();
    
    console.log('CareTrack Pro initialized successfully');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    alert('Error al inicializar la aplicación. Recargue la página.');
  }
}

// Initialize the application
initializeApp();
