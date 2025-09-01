/* SaludPro · Sistema Integral de Gestión Clínica */
const $ = (s)=>document.querySelector(s);
const fmtDate = (d)=> new Date(d).toLocaleDateString('es-AR');
const fmtTime = (d)=> new Date(d).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'});
const nowISO = ()=> new Date().toISOString();
const toF = (c)=> (c*9/5+32).toFixed(1);
const toC = (f)=> ((f-32)*5/9).toFixed(1);
const uid = ()=> crypto.randomUUID();

const DB_KEY = 'saludpro_v2';
const PAGE_SIZE = 5;
const API_BASE = 'http://localhost:3000';

// Authentication and user management
let currentUser = null;
let authToken = null;

const state = {
  currentPatientId: null,
  patients: {},
  vitals: {},
  meds: {},
  notes: {},
  fluids: {},
  tasks: {},
  medicalRecords: {},
  pages: { vitals: 1, meds: 1 },
  notifications: [],
  users: {}
};

// Initialize authentication
function initAuth() {
  authToken = localStorage.getItem('authToken');
  const userStr = localStorage.getItem('currentUser');
  
  if (authToken && userStr) {
    currentUser = JSON.parse(userStr);
    updateUserProfile();
  } else {
    // Redirect to login if no authentication
    window.location.href = 'login.html';
    return false;
  }
  
  return true;
}

function updateUserProfile() {
  if (!currentUser) return;
  
  const userProfile = $('#userProfile');
  if (userProfile) {
    const avatar = userProfile.querySelector('.avatar');
    const nameDiv = userProfile.querySelector('div > div:first-child');
    const roleDiv = userProfile.querySelector('div > div:last-child');
    
    if (avatar) avatar.textContent = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
    if (nameDiv) nameDiv.textContent = currentUser.name;
    if (roleDiv) roleDiv.textContent = getRoleDisplayName(currentUser.role);
  }
}

function getRoleDisplayName(role) {
  const roleNames = {
    'admin': 'Administrador',
    'medico': 'Médico',
    'enfermero': 'Enfermero/a',
    'nutricionista': 'Nutricionista',
    'fisioterapeuta': 'Fisioterapeuta',
    'psiquiatra': 'Psiquiatra'
  };
  return roleNames[role] || role;
}

function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

// API helper function with authentication
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      ...options.headers
    },
    ...options
  };
  
  try {
    const response = await fetch(url, config);
    
    if (response.status === 401) {
      // Token expired or invalid
      logout();
      return null;
    }
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// -------------- Persistencia (ahora con API) --------------
async function saveDB() {
  // Data now persists through API calls, no localStorage needed for main data
  // Keep minimal state in localStorage for UI preferences
  localStorage.setItem(DB_KEY, JSON.stringify({
    currentPatientId: state.currentPatientId,
    pages: state.pages
  }));
}

function loadDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      state.currentPatientId = data.currentPatientId;
      state.pages = data.pages || { vitals: 1, meds: 1 };
    }
  } catch (error) {
    console.error("Error loading UI state from localStorage:", error);
  }
}

function resetState() {
  state.currentPatientId = null;
  state.patients = {};
  state.vitals = {};
  state.meds = {};
  state.notes = {};
  state.fluids = {};
  state.tasks = {};
  state.medicalRecords = {};
  state.pages = { vitals: 1, meds: 1 };
  state.notifications = [];
  saveDB();
}

// Load data from API
async function loadPatients() {
  try {
    const patients = await apiRequest('/patients');
    state.patients = {};
    patients.forEach(p => {
      state.patients[p.id] = p;
    });
    renderPatientSelect();
  } catch (error) {
    console.error('Error loading patients:', error);
  }
}

async function loadVitals(patientId) {
  if (!patientId) return;
  try {
    const vitals = await apiRequest(`/vitals/${patientId}`);
    state.vitals[patientId] = vitals;
    renderVitals();
  } catch (error) {
    console.error('Error loading vitals:', error);
  }
}

async function loadMedicalRecords(patientId) {
  if (!patientId) return;
  try {
    const records = await apiRequest(`/medical-records/${patientId}`);
    state.medicalRecords[patientId] = records;
  } catch (error) {
    console.error('Error loading medical records:', error);
  }
}

async function loadNotifications() {
  try {
    const notifications = await apiRequest('/notifications');
    state.notifications = notifications;
    updateNotificationBadge();
  } catch (error) {
    console.error('Error loading notifications:', error);
  }
}

function updateNotificationBadge() {
  const unreadCount = state.notifications.filter(n => !n.read_at).length;
  const badge = $('#notification-badge');
  if (badge) {
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? 'block' : 'none';
  }
}

// Enhanced seeding with API calls
async function seed() {
  // Check if patients already exist
  await loadPatients();
  if (Object.keys(state.patients).length > 0) return;
  
  try {
    // Create sample patients
    const p1 = {
      id: 'P-001',
      name: 'María González',
      age: 68,
      gender: 'F',
      date_of_birth: '1955-03-15',
      condition: 'Diabetes tipo 2',
      allergies: 'Penicilina',
      emergency_contact: 'Juan González (hijo)',
      emergency_phone: '+54 9 11 2345-6789',
      blood_type: 'O+',
      insurance_info: 'OSDE Plan 210',
      assigned_professional: currentUser.id
    };
    
    const p2 = {
      id: 'P-002',
      name: 'José Pérez',
      age: 75,
      gender: 'M',
      date_of_birth: '1948-08-22',
      condition: 'Hipertensión',
      allergies: 'Ibuprofeno',
      emergency_contact: 'María Pérez (esposa)',
      emergency_phone: '+54 9 11 3456-7890',
      blood_type: 'A+',
      insurance_info: 'Swiss Medical',
      assigned_professional: currentUser.id
    };
    
    await apiRequest('/patients', {
      method: 'POST',
      body: JSON.stringify(p1)
    });
    
    await apiRequest('/patients', {
      method: 'POST',
      body: JSON.stringify(p2)
    });
    
    // Reload patients after creation
    await loadPatients();
    
    if (Object.keys(state.patients).length > 0) {
      state.currentPatientId = Object.keys(state.patients)[0];
      saveDB();
      
      // Create sample vital signs
      const vital = {
        id: uid(),
        patientId: state.currentPatientId,
        at: nowISO(),
        tempC: 36.8,
        hr: 72,
        sys: 120,
        dia: 80,
        spo2: 98,
        rr: 16,
        pain: 0,
        gcs: 15,
        notes: 'Ingreso - Signos vitales estables'
      };
      
      await apiRequest('/vitals', {
        method: 'POST',
        body: JSON.stringify(vital)
      });
    }
    
  } catch (error) {
    console.error('Error seeding data:', error);
  }
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

// Enhanced wire function with new features
function wire(){
  $('#patient-select')?.addEventListener('change', async (e)=>{
    state.currentPatientId = e.target.value;
    saveDB();
    await loadVitals(state.currentPatientId);
    await loadMedicalRecords(state.currentPatientId);
    renderAll();
  });

  $('#btn-new-patient')?.addEventListener('click', ()=>{
    showPatientForm();
  });

  $('#btn-logout')?.addEventListener('click', logout);

  $('#btn-print')?.addEventListener('click', ()=> window.print());

  $('#btn-export')?.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saludpro-export-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  $('#btn-import')?.addEventListener('change', (e)=>{
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        Object.assign(state, data);
        saveDB();
        renderPatientSelect();
        renderAll();
      } catch (error) {
        alert('Archivo inválido');
      }
    };
    reader.readAsText(file);
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

  // Add logout button to user profile
  const userProfile = $('#userProfile');
  if (userProfile) {
    userProfile.addEventListener('click', () => {
      const menu = document.createElement('div');
      menu.innerHTML = `
        <div style="position: absolute; top: 100%; right: 0; background: white; border: 1px solid #dadce0; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 1000;">
          <button onclick="show2FASetup()" style="padding: 12px 16px; border: none; background: none; width: 100%; text-align: left; cursor: pointer;">Configurar 2FA</button>
          <button onclick="logout()" style="padding: 12px 16px; border: none; background: none; width: 100%; text-align: left; cursor: pointer; color: #ea4335;">Cerrar Sesión</button>
        </div>
      `;
      document.body.appendChild(menu);
      
      setTimeout(() => {
        document.addEventListener('click', function removeMenu() {
          document.body.removeChild(menu);
          document.removeEventListener('click', removeMenu);
        });
      }, 100);
    });
  }
}

// Enhanced patient form
function showPatientForm(patient = null) {
  const isEdit = !!patient;
  const title = isEdit ? 'Editar Paciente' : 'Nuevo Paciente';
  
  const modal = document.createElement('div');
  modal.className = 'modal is-active';
  modal.innerHTML = `
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">${title}</p>
        <button class="delete" onclick="this.closest('.modal').remove()"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Nombre Completo</label>
          <div class="control">
            <input class="input" type="text" id="patient-name" value="${patient?.name || ''}" required>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <div class="field">
              <label class="label">Edad</label>
              <div class="control">
                <input class="input" type="number" id="patient-age" value="${patient?.age || ''}" min="0" max="120">
              </div>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <label class="label">Género</label>
              <div class="control">
                <div class="select is-fullwidth">
                  <select id="patient-gender">
                    <option value="">Seleccionar...</option>
                    <option value="M" ${patient?.gender === 'M' ? 'selected' : ''}>Masculino</option>
                    <option value="F" ${patient?.gender === 'F' ? 'selected' : ''}>Femenino</option>
                    <option value="X" ${patient?.gender === 'X' ? 'selected' : ''}>No binario</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="field">
          <label class="label">Fecha de Nacimiento</label>
          <div class="control">
            <input class="input" type="date" id="patient-dob" value="${patient?.date_of_birth || ''}">
          </div>
        </div>
        <div class="field">
          <label class="label">Condición Médica</label>
          <div class="control">
            <textarea class="textarea" id="patient-condition" placeholder="Diagnósticos principales...">${patient?.condition || ''}</textarea>
          </div>
        </div>
        <div class="field">
          <label class="label">Alergias</label>
          <div class="control">
            <textarea class="textarea" id="patient-allergies" placeholder="Alergias conocidas...">${patient?.allergies || ''}</textarea>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <div class="field">
              <label class="label">Contacto de Emergencia</label>
              <div class="control">
                <input class="input" type="text" id="patient-emergency-contact" value="${patient?.emergency_contact || ''}" placeholder="Nombre y relación">
              </div>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <label class="label">Teléfono de Emergencia</label>
              <div class="control">
                <input class="input" type="tel" id="patient-emergency-phone" value="${patient?.emergency_phone || ''}" placeholder="+54 9 11 1234-5678">
              </div>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <div class="field">
              <label class="label">Tipo de Sangre</label>
              <div class="control">
                <div class="select is-fullwidth">
                  <select id="patient-blood-type">
                    <option value="">Seleccionar...</option>
                    <option value="A+" ${patient?.blood_type === 'A+' ? 'selected' : ''}>A+</option>
                    <option value="A-" ${patient?.blood_type === 'A-' ? 'selected' : ''}>A-</option>
                    <option value="B+" ${patient?.blood_type === 'B+' ? 'selected' : ''}>B+</option>
                    <option value="B-" ${patient?.blood_type === 'B-' ? 'selected' : ''}>B-</option>
                    <option value="AB+" ${patient?.blood_type === 'AB+' ? 'selected' : ''}>AB+</option>
                    <option value="AB-" ${patient?.blood_type === 'AB-' ? 'selected' : ''}>AB-</option>
                    <option value="O+" ${patient?.blood_type === 'O+' ? 'selected' : ''}>O+</option>
                    <option value="O-" ${patient?.blood_type === 'O-' ? 'selected' : ''}>O-</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <label class="label">Información de Seguro</label>
              <div class="control">
                <input class="input" type="text" id="patient-insurance" value="${patient?.insurance_info || ''}" placeholder="Obra social / Prepaga">
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" onclick="savePatient(${isEdit ? `'${patient?.id}'` : 'null'})">${isEdit ? 'Actualizar' : 'Crear'} Paciente</button>
        <button class="button" onclick="this.closest('.modal').remove()">Cancelar</button>
      </footer>
    </div>
  `;
  
  document.body.appendChild(modal);
}

async function savePatient(patientId = null) {
  const isEdit = !!patientId;
  
  const patientData = {
    name: $('#patient-name').value.trim(),
    age: parseInt($('#patient-age').value) || null,
    gender: $('#patient-gender').value,
    date_of_birth: $('#patient-dob').value,
    condition: $('#patient-condition').value.trim(),
    allergies: $('#patient-allergies').value.trim(),
    emergency_contact: $('#patient-emergency-contact').value.trim(),
    emergency_phone: $('#patient-emergency-phone').value.trim(),
    blood_type: $('#patient-blood-type').value,
    insurance_info: $('#patient-insurance').value.trim(),
    assigned_professional: currentUser.id
  };
  
  if (!patientData.name) {
    alert('El nombre del paciente es requerido');
    return;
  }
  
  if (!isEdit) {
    patientData.id = 'P-' + Date.now().toString().slice(-6);
  }
  
  try {
    if (isEdit) {
      // Update patient (would need PUT endpoint)
      alert('Funcionalidad de edición pendiente de implementar');
    } else {
      await apiRequest('/patients', {
        method: 'POST',
        body: JSON.stringify(patientData)
      });
      
      await loadPatients();
      state.currentPatientId = patientData.id;
      saveDB();
      renderAll();
    }
    
    document.querySelector('.modal').remove();
  } catch (error) {
    alert('Error al guardar paciente: ' + error.message);
  }
}

// 2FA Setup
function show2FASetup() {
  // Implementation for 2FA setup would go here
  alert('Configuración de 2FA pendiente de implementar');
}

async function renderAll() {
  renderVitals();
  renderMeds();
  renderNotes();
  renderFluids();
  renderTasks();
}

// Enhanced initialization
async function init() {
  // Check authentication first
  if (!initAuth()) return;
  
  // Load UI state
  loadDB();
  
  // Load initial data
  await loadPatients();
  await loadNotifications();
  
  // Seed if necessary
  await seed();
  
  // Initialize UI
  renderPatientSelect();
  renderAll();
  wire();
  
  // Load data for current patient
  if (state.currentPatientId) {
    await loadVitals(state.currentPatientId);
    await loadMedicalRecords(state.currentPatientId);
    renderAll();
  }
}

// Start the application
init();
