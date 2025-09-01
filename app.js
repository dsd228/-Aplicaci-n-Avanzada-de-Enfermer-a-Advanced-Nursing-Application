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
  audit: [],
  // New state for enhanced features
  navigationHistory: [],
  currentPage: 'dashboard',
  notifications: [],
  searchResults: [],
  accessibility: {
    theme: 'light',
    reduceMotion: false,
    fontSize: 1,
    focusVisible: true
  },
  cache: {}
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

// -------------- Enhanced Features Implementation --------------

// Navigation System with Breadcrumbs and History
const navigationSystem = {
  init() {
    this.setupBreadcrumbs();
    this.setupNavigationHistory();
    this.loadNavigationHistory();
  },

  addToHistory(page, title, icon) {
    const timestamp = nowISO();
    const historyItem = { page, title, icon, timestamp };
    
    // Remove duplicate if exists
    state.navigationHistory = state.navigationHistory.filter(item => item.page !== page);
    
    // Add to beginning of array
    state.navigationHistory.unshift(historyItem);
    
    // Keep only last 50 items
    if (state.navigationHistory.length > 50) {
      state.navigationHistory = state.navigationHistory.slice(0, 50);
    }
    
    state.currentPage = page;
    saveDB();
    this.updateBreadcrumbs(page, title, icon);
    this.renderNavigationHistory();
  },

  updateBreadcrumbs(page, title, icon) {
    const breadcrumb = $('#breadcrumb-nav');
    if (breadcrumb) {
      breadcrumb.innerHTML = `
        <span class="breadcrumb-item" onclick="navigationSystem.navigateTo('dashboard', 'Dashboard', 'dashboard')">
          <span class="material-symbols-outlined">dashboard</span>
          Dashboard
        </span>
        ${page !== 'dashboard' ? `
        <span class="breadcrumb-item active">
          <span class="material-symbols-outlined">${icon}</span>
          ${title}
        </span>` : ''}
      `;
    }
  },

  navigateTo(page, title, icon) {
    this.addToHistory(page, title, icon);
    if (page === 'dashboard') {
      closePanel();
      $('#dashboard').scrollIntoView({ behavior: 'smooth' });
    } else {
      showPanel(page);
    }
  },

  setupBreadcrumbs() {
    // Update existing navigation buttons to use the new system
    const navButtons = {
      'btn-dashboard': { page: 'dashboard', title: 'Dashboard', icon: 'dashboard' },
      'btn-pacientes': { page: 'pacientes', title: 'Pacientes', icon: 'group' },
      'btn-signos': { page: 'signos', title: 'Signos Vitales', icon: 'monitoring' },
      'btn-historia': { page: 'historia', title: 'Historia Clínica', icon: 'description' },
      'btn-interacciones': { page: 'interacciones', title: 'Interacciones', icon: 'warning' },
      'btn-combinador': { page: 'combinador', title: 'Combinador', icon: 'science' },
      'btn-calculadoras': { page: 'calculadoras', title: 'Calculadoras', icon: 'calculate' },
      'btn-educacion': { page: 'educacion', title: 'Educación', icon: 'menu_book' }
    };

    Object.entries(navButtons).forEach(([btnId, config]) => {
      const btn = $(`#${btnId}`);
      if (btn) {
        btn.addEventListener('click', () => {
          this.navigateTo(config.page, config.title, config.icon);
        });
      }
    });
  },

  setupNavigationHistory() {
    $('#btn-nav-history')?.addEventListener('click', () => {
      this.renderNavigationHistory();
      showPanel('nav-history');
    });
  },

  renderNavigationHistory() {
    const historyContainer = $('#navigation-history');
    if (!historyContainer) return;

    const today = new Date().toDateString();
    const week = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toDateString();

    let html = '';
    const groupedHistory = this.groupHistoryByDate(state.navigationHistory);

    Object.entries(groupedHistory).forEach(([date, items]) => {
      html += `<div class="history-group">
        <h4 class="history-date">${this.formatDate(date)}</h4>`;
      
      items.forEach(item => {
        html += `
          <div class="history-item" onclick="navigationSystem.navigateTo('${item.page}', '${item.title}', '${item.icon}')">
            <div class="history-icon">
              <span class="material-symbols-outlined">${item.icon}</span>
            </div>
            <div class="history-content">
              <div class="history-title">${item.title}</div>
              <div class="history-time">${fmtTime(item.timestamp)}</div>
            </div>
          </div>
        `;
      });
      
      html += '</div>';
    });

    historyContainer.innerHTML = html || '<p>No hay historial de navegación</p>';
  },

  groupHistoryByDate(history) {
    const groups = {};
    history.forEach(item => {
      const date = new Date(item.timestamp).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(item);
    });
    return groups;
  },

  formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    
    if (dateString === today) return 'Hoy';
    if (dateString === yesterday) return 'Ayer';
    return date.toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' });
  },

  loadNavigationHistory() {
    this.renderNavigationHistory();
    // Initialize with dashboard
    if (!state.currentPage) {
      this.addToHistory('dashboard', 'Dashboard', 'dashboard');
    }
  }
};

// Global Search System
const searchSystem = {
  init() {
    this.setupSearchInput();
    this.setupSearchResults();
  },

  setupSearchInput() {
    const searchInput = $('#global-search');
    const clearBtn = $('#clear-search');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length > 0) {
          clearBtn.style.display = 'block';
          if (query.length >= 2) {
            this.performSearch(query);
          }
        } else {
          clearBtn.style.display = 'none';
          this.clearResults();
        }
      });

      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const query = e.target.value.trim();
          if (query) {
            this.performSearch(query);
            this.showSearchResults();
          }
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        this.clearResults();
      });
    }
  },

  async performSearch(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();

    // Search in patients
    Object.values(state.patients).forEach(patient => {
      if (patient.name.toLowerCase().includes(lowerQuery) || 
          patient.id.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'patient',
          title: patient.name,
          content: `ID: ${patient.id} - ${patient.condition || 'Sin condición específica'}`,
          meta: 'Paciente',
          action: () => navigationSystem.navigateTo('pacientes', 'Pacientes', 'group')
        });
      }
    });

    // Search in medications
    Object.values(state.meds).flat().forEach(med => {
      if (med.name.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'medication',
          title: med.name,
          content: `Dosis: ${med.dose} - Vía: ${med.route}`,
          meta: 'Medicación',
          action: () => navigationSystem.navigateTo('signos', 'Signos Vitales', 'monitoring')
        });
      }
    });

    // Search in notes
    Object.values(state.notes).flat().forEach(note => {
      if (note.text.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'note',
          title: 'Nota clínica',
          content: note.text.substring(0, 100) + (note.text.length > 100 ? '...' : ''),
          meta: `${fmtDate(note.at)}`,
          action: () => navigationSystem.navigateTo('historia', 'Historia Clínica', 'description')
        });
      }
    });

    // Search in application features
    const features = [
      { name: 'Dashboard', keywords: ['dashboard', 'inicio', 'principal'], page: 'dashboard', icon: 'dashboard' },
      { name: 'Pacientes', keywords: ['pacientes', 'patients'], page: 'pacientes', icon: 'group' },
      { name: 'Signos Vitales', keywords: ['signos', 'vitales', 'vital signs'], page: 'signos', icon: 'monitoring' },
      { name: 'Historia Clínica', keywords: ['historia', 'historial', 'clinical'], page: 'historia', icon: 'description' },
      { name: 'Interacciones', keywords: ['interacciones', 'interactions'], page: 'interacciones', icon: 'warning' },
      { name: 'Calculadoras', keywords: ['calculadoras', 'calcular'], page: 'calculadoras', icon: 'calculate' },
      { name: 'Educación', keywords: ['educacion', 'education'], page: 'educacion', icon: 'menu_book' }
    ];

    features.forEach(feature => {
      if (feature.keywords.some(keyword => keyword.includes(lowerQuery))) {
        results.push({
          type: 'feature',
          title: feature.name,
          content: `Acceder a la sección ${feature.name}`,
          meta: 'Función de la aplicación',
          action: () => navigationSystem.navigateTo(feature.page, feature.name, feature.icon)
        });
      }
    });

    state.searchResults = results;
    this.renderSearchResults(query, results);
  },

  renderSearchResults(query, results) {
    const summary = $('#search-summary');
    const resultsContainer = $('#search-results');

    if (summary) {
      summary.innerHTML = `Búsqueda: "${query}" - ${results.length} resultado(s) encontrado(s)`;
    }

    if (resultsContainer) {
      if (results.length === 0) {
        resultsContainer.innerHTML = `
          <div class="search-result-item">
            <div class="search-result-title">Sin resultados</div>
            <div class="search-result-content">No se encontraron resultados para "${query}"</div>
          </div>
        `;
      } else {
        resultsContainer.innerHTML = results.map(result => `
          <div class="search-result-item" onclick="searchSystem.executeAction(${results.indexOf(result)})">
            <div class="search-result-title">${result.title}</div>
            <div class="search-result-content">${result.content}</div>
            <div class="search-result-meta">
              <span>${result.meta}</span>
              <span>${result.type}</span>
            </div>
          </div>
        `).join('');
      }
    }
  },

  executeAction(index) {
    const result = state.searchResults[index];
    if (result && result.action) {
      result.action();
      closePanel();
    }
  },

  showSearchResults() {
    showPanel('search-results');
  },

  clearResults() {
    state.searchResults = [];
    const summary = $('#search-summary');
    const resultsContainer = $('#search-results');
    
    if (summary) summary.innerHTML = '';
    if (resultsContainer) resultsContainer.innerHTML = '';
  },

  setupSearchResults() {
    // Setup is handled in other functions
  }
};

// Notification System
const notificationSystem = {
  init() {
    this.setupNotificationPanel();
    this.setupToastNotifications();
    this.initializeNotifications();
  },

  setupNotificationPanel() {
    $('#btn-notifications')?.addEventListener('click', () => {
      this.renderNotifications();
      showPanel('notifications');
    });

    // Filter buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-btn') && e.target.dataset.filter) {
        this.filterNotifications(e.target.dataset.filter);
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
      }
    });

    $('#mark-all-read')?.addEventListener('click', () => {
      state.notifications.forEach(n => n.read = true);
      saveDB();
      this.updateNotificationBadge();
      this.renderNotifications();
      this.showToast('success', 'Notificaciones marcadas como leídas');
    });

    $('#clear-notifications')?.addEventListener('click', () => {
      state.notifications = [];
      saveDB();
      this.updateNotificationBadge();
      this.renderNotifications();
      this.showToast('info', 'Notificaciones eliminadas');
    });
  },

  addNotification(type, title, message, urgent = false) {
    const notification = {
      id: uid(),
      type,
      title,
      message,
      urgent,
      timestamp: nowISO(),
      read: false
    };

    state.notifications.unshift(notification);
    
    // Keep only last 100 notifications
    if (state.notifications.length > 100) {
      state.notifications = state.notifications.slice(0, 100);
    }

    saveDB();
    this.updateNotificationBadge();

    if (urgent) {
      this.showToast('error', title, message);
    }
  },

  renderNotifications() {
    const container = $('#notifications-list');
    if (!container) return;

    const notifications = state.notifications.filter(n => !n.filtered);
    
    if (notifications.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: var(--on-surface-variant);">No hay notificaciones</p>';
      return;
    }

    container.innerHTML = notifications.map(notification => `
      <div class="notification-item ${notification.type} ${notification.read ? 'read' : ''}" data-id="${notification.id}">
        <div class="notification-icon">
          <span class="material-symbols-outlined">${this.getNotificationIcon(notification.type)}</span>
        </div>
        <div class="notification-content">
          <div class="notification-title">${notification.title}</div>
          <div class="notification-message">${notification.message}</div>
          <div class="notification-time">${this.getRelativeTime(notification.timestamp)}</div>
        </div>
        <button class="notification-action" onclick="notificationSystem.markAsRead('${notification.id}')">
          <span class="material-symbols-outlined">${notification.read ? 'check' : 'mark_email_read'}</span>
        </button>
      </div>
    `).join('');
  },

  filterNotifications(filter) {
    state.notifications.forEach(notification => {
      if (filter === 'all') {
        notification.filtered = false;
      } else {
        notification.filtered = notification.type !== filter;
      }
    });
    this.renderNotifications();
  },

  markAsRead(id) {
    const notification = state.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      saveDB();
      this.updateNotificationBadge();
      this.renderNotifications();
    }
  },

  updateNotificationBadge() {
    const badge = $('#notification-count');
    const unreadCount = state.notifications.filter(n => !n.read).length;
    
    if (badge) {
      badge.textContent = unreadCount;
      badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
  },

  getNotificationIcon(type) {
    const icons = {
      urgent: 'emergency',
      info: 'info',
      system: 'update',
      success: 'check_circle',
      warning: 'warning',
      error: 'error'
    };
    return icons[type] || 'notifications';
  },

  getRelativeTime(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  },

  // Toast Notifications
  setupToastNotifications() {
    // Create toast container if it doesn't exist
    if (!$('#toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
  },

  showToast(type, title, message = '', duration = 5000) {
    const toastContainer = $('#toast-container');
    if (!toastContainer) return;

    const toastId = uid();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.dataset.id = toastId;

    toast.innerHTML = `
      <div class="toast-icon">
        <span class="material-symbols-outlined">${this.getNotificationIcon(type)}</span>
      </div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-message">${message}</div>` : ''}
      </div>
      <button class="toast-close" onclick="notificationSystem.closeToast('${toastId}')">
        <span class="material-symbols-outlined">close</span>
      </button>
    `;

    toastContainer.appendChild(toast);

    // Auto-remove after duration
    setTimeout(() => {
      this.closeToast(toastId);
    }, duration);
  },

  closeToast(toastId) {
    const toast = document.querySelector(`[data-id="${toastId}"]`);
    if (toast) {
      toast.style.transform = 'translateX(100%)';
      toast.style.opacity = '0';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }
  },

  initializeNotifications() {
    // Add some sample notifications if none exist
    if (state.notifications.length === 0) {
      this.addNotification('urgent', 'Paciente en estado crítico', 'María González (ID: P-001) requiere atención inmediata en UCI', true);
      this.addNotification('info', 'Recordatorio de medicación', '3 pacientes tienen medicación pendiente para las 14:00');
      this.addNotification('system', 'Actualización del sistema', 'Nueva versión disponible con mejoras de seguridad');
    }
    this.updateNotificationBadge();
  }
};

// Accessibility System
const accessibilitySystem = {
  init() {
    this.setupAccessibilityPanel();
    this.loadAccessibilitySettings();
    this.applyAccessibilitySettings();
  },

  setupAccessibilityPanel() {
    $('#btn-accessibility')?.addEventListener('click', () => {
      this.renderAccessibilityOptions();
      showPanel('accessibility');
    });

    // Theme selection
    document.addEventListener('change', (e) => {
      if (e.target.name === 'theme') {
        state.accessibility.theme = e.target.value;
        this.applyTheme(e.target.value);
        saveDB();
      }
    });

    // Toggle options
    $('#reduce-motion')?.addEventListener('change', (e) => {
      state.accessibility.reduceMotion = e.target.checked;
      this.applyMotionSettings();
      saveDB();
    });

    $('#focus-visible')?.addEventListener('change', (e) => {
      state.accessibility.focusVisible = e.target.checked;
      this.applyFocusSettings();
      saveDB();
    });

    // Font size slider
    $('#font-size')?.addEventListener('input', (e) => {
      state.accessibility.fontSize = parseFloat(e.target.value);
      this.applyFontSize();
      this.updateFontSizeDisplay();
      saveDB();
    });

    // Apply and reset buttons
    $('#apply-accessibility')?.addEventListener('click', () => {
      this.applyAccessibilitySettings();
      notificationSystem.showToast('success', 'Configuración aplicada', 'Los cambios de accesibilidad han sido guardados');
      closePanel();
    });

    $('#reset-accessibility')?.addEventListener('click', () => {
      this.resetAccessibilitySettings();
      this.renderAccessibilityOptions();
      notificationSystem.showToast('info', 'Configuración restablecida', 'Se han restaurado los valores por defecto');
    });
  },

  renderAccessibilityOptions() {
    // Update form values to match current state
    const themeInputs = document.querySelectorAll('input[name="theme"]');
    themeInputs.forEach(input => {
      input.checked = input.value === state.accessibility.theme;
    });

    const reduceMotionInput = $('#reduce-motion');
    if (reduceMotionInput) {
      reduceMotionInput.checked = state.accessibility.reduceMotion;
    }

    const focusVisibleInput = $('#focus-visible');
    if (focusVisibleInput) {
      focusVisibleInput.checked = state.accessibility.focusVisible;
    }

    const fontSizeInput = $('#font-size');
    if (fontSizeInput) {
      fontSizeInput.value = state.accessibility.fontSize;
    }

    this.updateFontSizeDisplay();
  },

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  },

  applyMotionSettings() {
    if (state.accessibility.reduceMotion) {
      document.documentElement.setAttribute('data-motion', 'reduced');
    } else {
      document.documentElement.removeAttribute('data-motion');
    }
  },

  applyFocusSettings() {
    if (state.accessibility.focusVisible) {
      document.documentElement.style.setProperty('--focus-outline', '2px solid var(--roles-primary-primary)');
    } else {
      document.documentElement.style.setProperty('--focus-outline', 'none');
    }
  },

  applyFontSize() {
    document.documentElement.style.fontSize = `${state.accessibility.fontSize}rem`;
  },

  updateFontSizeDisplay() {
    const display = document.querySelector('.range-value');
    if (display) {
      display.textContent = `${Math.round(state.accessibility.fontSize * 100)}%`;
    }
  },

  applyAccessibilitySettings() {
    this.applyTheme(state.accessibility.theme);
    this.applyMotionSettings();
    this.applyFocusSettings();
    this.applyFontSize();
  },

  resetAccessibilitySettings() {
    state.accessibility = {
      theme: 'light',
      reduceMotion: false,
      fontSize: 1,
      focusVisible: true
    };
    this.applyAccessibilitySettings();
    saveDB();
  },

  loadAccessibilitySettings() {
    // Settings are loaded with the rest of the state
  }
};

// Quick Actions System
const quickActionsSystem = {
  init() {
    this.setupQuickActions();
    this.setupKeyboardShortcuts();
  },

  setupQuickActions() {
    $('#quick-new-patient')?.addEventListener('click', () => {
      const name = prompt('Nombre completo del paciente:');
      if (name && name.trim().length > 1) {
        const id = 'P-' + String(Date.now()).slice(-6);
        state.patients[id] = {id, name, age: '', condition: '', allergies: ''};
        state.currentPatientId = id;
        saveDB();
        renderPatientSelect();
        renderAll();
        notificationSystem.showToast('success', 'Paciente creado', `${name} ha sido agregado al sistema`);
        navigationSystem.navigateTo('pacientes', 'Pacientes', 'group');
      }
    });

    $('#quick-emergency')?.addEventListener('click', () => {
      notificationSystem.addNotification('urgent', 'Alerta de Emergencia', 'Emergencia reportada por el usuario', true);
      notificationSystem.showToast('error', 'Emergencia Activada', 'Se ha registrado una alerta de emergencia');
    });

    $('#quick-notes')?.addEventListener('click', () => {
      const note = prompt('Nota rápida:');
      if (note && note.trim() && state.currentPatientId) {
        if (!state.notes[state.currentPatientId]) {
          state.notes[state.currentPatientId] = [];
        }
        state.notes[state.currentPatientId].push({
          id: uid(),
          text: note.trim(),
          at: nowISO()
        });
        saveDB();
        renderNotes();
        notificationSystem.showToast('success', 'Nota guardada', 'La nota ha sido agregada al historial del paciente');
      }
    });
  },

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = $('#global-search');
        if (searchInput) {
          searchInput.focus();
        }
      }

      // Ctrl/Cmd + N for new patient
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        $('#quick-new-patient')?.click();
      }

      // Escape to close panels
      if (e.key === 'Escape') {
        closePanel();
      }

      // Ctrl/Cmd + H for navigation history
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        $('#btn-nav-history')?.click();
      }
    });
  }
};

// Cache System Enhancement
const cacheSystem = {
  init() {
    this.setupCache();
    this.optimizeServiceWorker();
  },

  setupCache() {
    // Enhance existing localStorage with better caching strategies
    const originalSaveDB = window.saveDB;
    window.saveDB = function() {
      try {
        // Create a backup before saving
        const backup = localStorage.getItem(DB_KEY + '_backup');
        if (backup) {
          localStorage.setItem(DB_KEY + '_backup_old', backup);
        }
        localStorage.setItem(DB_KEY + '_backup', localStorage.getItem(DB_KEY) || '{}');
        
        // Save the current state
        originalSaveDB.call(this);
        
        // Update cache timestamp
        state.cache.lastUpdated = nowISO();
      } catch (error) {
        console.error('Error saving to cache:', error);
        notificationSystem.showToast('error', 'Error de guardado', 'No se pudo guardar la información');
      }
    };
  },

  optimizeServiceWorker() {
    // Register service worker if not already registered
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
          notificationSystem.addNotification('system', 'Cache optimizado', 'El sistema de cache ha sido actualizado');
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }
  },

  clearCache() {
    localStorage.removeItem(DB_KEY + '_backup');
    localStorage.removeItem(DB_KEY + '_backup_old');
    state.cache = {};
    saveDB();
    notificationSystem.showToast('info', 'Cache limpiado', 'Los datos en cache han sido eliminados');
  }
};

// Initialize all enhanced systems
function initializeEnhancedFeatures() {
  navigationSystem.init();
  searchSystem.init();
  notificationSystem.init();
  accessibilitySystem.init();
  quickActionsSystem.init();
  cacheSystem.init();
  
  // Show welcome toast
  setTimeout(() => {
    notificationSystem.showToast('info', '¡Bienvenido!', 'Sistema mejorado cargado correctamente');
  }, 1000);
}

// Initialize enhanced features after DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeEnhancedFeatures);
} else {
  initializeEnhancedFeatures();
}
