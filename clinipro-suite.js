// CliniPro Suite API Integration
class CliniProAPI {
  constructor(baseURL = '/api') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('clinipro_token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error en la solicitud');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (data.token) {
      this.token = data.token;
      localStorage.setItem('clinipro_token', data.token);
      localStorage.setItem('clinipro_user', JSON.stringify(data.user));
    }
    
    return data;
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    this.token = null;
    localStorage.removeItem('clinipro_token');
    localStorage.removeItem('clinipro_user');
  }

  // Protocols
  async getProtocols(specialty = null) {
    const query = specialty ? `?specialty=${specialty}` : '';
    return this.request(`/protocols${query}`);
  }

  async getProtocol(id) {
    return this.request(`/protocols/${id}`);
  }

  async searchProtocols(query) {
    return this.request(`/protocols/search/${query}`);
  }

  async getSpecialties() {
    return this.request('/protocols/meta/specialties');
  }

  // Pharmacy
  async searchDrugs(query, category = null) {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category) params.append('category', category);
    return this.request(`/pharmacy/search?${params}`);
  }

  async getDrug(id) {
    return this.request(`/pharmacy/drugs/${id}`);
  }

  async checkInteractions(drugs) {
    return this.request('/pharmacy/interactions', {
      method: 'POST',
      body: JSON.stringify({ drugs })
    });
  }

  async getDrugCategories() {
    return this.request('/pharmacy/categories');
  }

  // Patients
  async getPatients(search = null, page = 1, limit = 10) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('page', page);
    params.append('limit', limit);
    return this.request(`/patients?${params}`);
  }

  async getPatient(id) {
    return this.request(`/patients/${id}`);
  }

  async createPatient(patientData) {
    return this.request('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData)
    });
  }

  async updatePatient(id, patientData) {
    return this.request(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patientData)
    });
  }

  async deletePatient(id) {
    return this.request(`/patients/${id}`, { method: 'DELETE' });
  }

  async getPatientStats() {
    return this.request('/patients/stats/overview');
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Global API instance
window.clinipro = new CliniProAPI();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeCliniProSuite();
});

async function initializeCliniProSuite() {
  console.log('🏥 CliniPro Suite Frontend Initialized');
  
  // Check if user is logged in
  const user = localStorage.getItem('clinipro_user');
  if (user) {
    console.log('✅ User logged in:', JSON.parse(user));
  }

  // Test API connectivity
  try {
    const health = await window.clinipro.healthCheck();
    console.log('✅ API Health:', health);
  } catch (error) {
    console.error('❌ API Connection failed:', error);
  }

  // Load enhanced features
  loadProtocolsIntegration();
  loadPharmacyIntegration();
  loadPatientsIntegration();
}

// Enhanced Protocols Integration
function loadProtocolsIntegration() {
  // Add protocols button to main navigation if not exists
  const nav = document.querySelector('nav');
  if (nav && !document.getElementById('btn-protocolos')) {
    const protocolsBtn = document.createElement('button');
    protocolsBtn.id = 'btn-protocolos';
    protocolsBtn.innerHTML = `
      <span class="material-symbols-outlined">description</span>
      Protocolos Médicos
    `;
    protocolsBtn.addEventListener('click', showProtocolsPanel);
    nav.appendChild(protocolsBtn);
  }
}

async function showProtocolsPanel() {
  try {
    // Hide other panels
    document.querySelectorAll('.panel').forEach(panel => panel.style.display = 'none');
    
    let panel = document.getElementById('panel-protocolos');
    if (!panel) {
      panel = createProtocolsPanel();
      document.querySelector('.app').appendChild(panel);
    }
    
    panel.style.display = 'block';
    
    // Load protocols data
    const protocols = await window.clinipro.getProtocols();
    const specialties = await window.clinipro.getSpecialties();
    
    renderProtocols(protocols, specialties);
  } catch (error) {
    console.error('Error loading protocols:', error);
    showNotification('Error al cargar protocolos médicos', 'error');
  }
}

function createProtocolsPanel() {
  const panel = document.createElement('div');
  panel.id = 'panel-protocolos';
  panel.className = 'panel';
  panel.innerHTML = `
    <div class="panel-header">
      <h2>📋 Biblioteca de Protocolos Médicos</h2>
      <button class="btn-close" onclick="this.parentElement.parentElement.style.display='none'">✕</button>
    </div>
    
    <div class="protocols-controls">
      <div class="search-bar">
        <input type="text" id="protocols-search" placeholder="Buscar protocolo...">
        <button onclick="searchProtocols()" class="btn-primary">Buscar</button>
      </div>
      
      <div class="specialty-filter">
        <select id="specialty-filter">
          <option value="">Todas las especialidades</option>
        </select>
      </div>
    </div>
    
    <div id="protocols-list" class="protocols-grid">
      <!-- Protocols will be loaded here -->
    </div>
  `;
  
  return panel;
}

function renderProtocols(protocols, specialties) {
  // Render specialty filter options
  const specialtyFilter = document.getElementById('specialty-filter');
  if (specialtyFilter) {
    specialtyFilter.innerHTML = '<option value="">Todas las especialidades</option>';
    specialties.forEach(specialty => {
      const option = document.createElement('option');
      option.value = specialty.id;
      option.textContent = `${specialty.name} (${specialty.count})`;
      specialtyFilter.appendChild(option);
    });
  }

  // Render protocols
  const protocolsList = document.getElementById('protocols-list');
  if (protocolsList) {
    protocolsList.innerHTML = '';
    
    Object.entries(protocols).forEach(([specialtyKey, specialtyProtocols]) => {
      specialtyProtocols.forEach(protocol => {
        const protocolCard = createProtocolCard(protocol);
        protocolsList.appendChild(protocolCard);
      });
    });
  }
}

function createProtocolCard(protocol) {
  const card = document.createElement('div');
  card.className = 'protocol-card';
  card.innerHTML = `
    <div class="protocol-header">
      <h3>${protocol.title}</h3>
      <span class="protocol-specialty">${protocol.specialty}</span>
    </div>
    <p class="protocol-description">${protocol.description}</p>
    <div class="protocol-meta">
      <span>📄 ${protocol.pages} páginas</span>
      <span>📅 ${protocol.lastUpdate}</span>
      <span>📎 ${protocol.format}</span>
    </div>
    <div class="protocol-actions">
      <button onclick="viewProtocol('${protocol.id}')" class="btn-secondary">Ver detalles</button>
      <button onclick="downloadProtocol('${protocol.id}')" class="btn-primary">Descargar</button>
    </div>
  `;
  
  return card;
}

async function searchProtocols() {
  const query = document.getElementById('protocols-search').value;
  if (!query) return;
  
  try {
    const results = await window.clinipro.searchProtocols(query);
    renderSearchResults(results);
  } catch (error) {
    console.error('Error searching protocols:', error);
    showNotification('Error en la búsqueda', 'error');
  }
}

function renderSearchResults(results) {
  const protocolsList = document.getElementById('protocols-list');
  if (protocolsList) {
    protocolsList.innerHTML = '';
    
    if (results.length === 0) {
      protocolsList.innerHTML = '<p>No se encontraron protocolos.</p>';
      return;
    }
    
    results.forEach(protocol => {
      const protocolCard = createProtocolCard(protocol);
      protocolsList.appendChild(protocolCard);
    });
  }
}

async function viewProtocol(id) {
  try {
    const protocol = await window.clinipro.getProtocol(id);
    showProtocolDetails(protocol);
  } catch (error) {
    console.error('Error loading protocol details:', error);
    showNotification('Error al cargar detalles del protocolo', 'error');
  }
}

function showProtocolDetails(protocol) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>${protocol.title}</h2>
        <button onclick="this.closest('.modal').remove()" class="btn-close">✕</button>
      </div>
      <div class="modal-body">
        <div class="protocol-details">
          <div class="protocol-info">
            <p><strong>Especialidad:</strong> ${protocol.specialty}</p>
            <p><strong>Descripción:</strong> ${protocol.description}</p>
            <p><strong>Páginas:</strong> ${protocol.pages}</p>
            <p><strong>Última actualización:</strong> ${protocol.lastUpdate}</p>
          </div>
          ${protocol.content ? `
            <div class="protocol-content">
              <h3>Objetivos:</h3>
              <ul>
                ${protocol.content.objectives?.map(obj => `<li>${obj}</li>`).join('') || ''}
              </ul>
              
              <h3>Pasos del protocolo:</h3>
              <ol>
                ${protocol.content.steps?.map(step => `<li>${step}</li>`).join('') || ''}
              </ol>
            </div>
          ` : ''}
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="downloadProtocol('${protocol.id}')" class="btn-primary">Descargar PDF</button>
        <button onclick="this.closest('.modal').remove()" class="btn-secondary">Cerrar</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

async function downloadProtocol(id) {
  try {
    const result = await window.clinipro.request(`/protocols/download/${id}`);
    showNotification(result.message, 'success');
  } catch (error) {
    console.error('Error downloading protocol:', error);
    showNotification('Error al descargar protocolo', 'error');
  }
}

// Enhanced Pharmacy Integration  
function loadPharmacyIntegration() {
  // Add pharmacy button to main navigation if not exists
  const nav = document.querySelector('nav');
  if (nav && !document.getElementById('btn-farmacia')) {
    const pharmacyBtn = document.createElement('button');
    pharmacyBtn.id = 'btn-farmacia';
    pharmacyBtn.innerHTML = `
      <span class="material-symbols-outlined">medication</span>
      Farmacología Avanzada
    `;
    pharmacyBtn.addEventListener('click', showPharmacyPanel);
    nav.appendChild(pharmacyBtn);
  }
}

async function showPharmacyPanel() {
  try {
    // Hide other panels
    document.querySelectorAll('.panel').forEach(panel => panel.style.display = 'none');
    
    let panel = document.getElementById('panel-farmacia');
    if (!panel) {
      panel = createPharmacyPanel();
      document.querySelector('.app').appendChild(panel);
    }
    
    panel.style.display = 'block';
    
    // Load drug categories
    const categories = await window.clinipro.getDrugCategories();
    renderDrugCategories(categories);
  } catch (error) {
    console.error('Error loading pharmacy panel:', error);
    showNotification('Error al cargar módulo de farmacología', 'error');
  }
}

function createPharmacyPanel() {
  const panel = document.createElement('div');
  panel.id = 'panel-farmacia';
  panel.className = 'panel';
  panel.innerHTML = `
    <div class="panel-header">
      <h2>💊 Módulo de Farmacología Avanzada</h2>
      <button class="btn-close" onclick="this.parentElement.parentElement.style.display='none'">✕</button>
    </div>
    
    <div class="pharmacy-tabs">
      <button class="tab-btn active" onclick="showPharmacyTab('search')">Búsqueda de Medicamentos</button>
      <button class="tab-btn" onclick="showPharmacyTab('interactions')">Interacciones</button>
      <button class="tab-btn" onclick="showPharmacyTab('prescriptions')">Recetas Electrónicas</button>
    </div>
    
    <div id="pharmacy-search" class="pharmacy-tab active">
      <div class="search-controls">
        <div class="search-bar">
          <input type="text" id="drug-search" placeholder="Buscar medicamento...">
          <button onclick="searchDrugs()" class="btn-primary">Buscar</button>
        </div>
        <select id="drug-category">
          <option value="">Todas las categorías</option>
        </select>
      </div>
      <div id="drug-results" class="drug-grid"></div>
    </div>
    
    <div id="pharmacy-interactions" class="pharmacy-tab">
      <h3>Verificador de Interacciones Medicamentosas</h3>
      <div class="interaction-checker">
        <div id="drug-list">
          <input type="text" placeholder="Agregar medicamento..." class="drug-input">
          <button onclick="addDrugToChecker()" class="btn-secondary">Agregar</button>
        </div>
        <div id="selected-drugs"></div>
        <button onclick="checkDrugInteractions()" class="btn-primary">Verificar Interacciones</button>
        <div id="interaction-results"></div>
      </div>
    </div>
    
    <div id="pharmacy-prescriptions" class="pharmacy-tab">
      <h3>Generador de Recetas Electrónicas</h3>
      <div class="prescription-form">
        <p>Funcionalidad en desarrollo - Próximamente disponible</p>
      </div>
    </div>
  `;
  
  return panel;
}

function renderDrugCategories(categories) {
  const categorySelect = document.getElementById('drug-category');
  if (categorySelect) {
    categorySelect.innerHTML = '<option value="">Todas las categorías</option>';
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });
  }
}

function showPharmacyTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  // Update tab content
  document.querySelectorAll('.pharmacy-tab').forEach(tab => tab.classList.remove('active'));
  document.getElementById(`pharmacy-${tabName}`).classList.add('active');
}

async function searchDrugs() {
  const query = document.getElementById('drug-search').value;
  const category = document.getElementById('drug-category').value;
  
  if (!query && !category) return;
  
  try {
    const results = await window.clinipro.searchDrugs(query, category);
    renderDrugResults(results);
  } catch (error) {
    console.error('Error searching drugs:', error);
    showNotification('Error en la búsqueda de medicamentos', 'error');
  }
}

function renderDrugResults(drugs) {
  const resultsContainer = document.getElementById('drug-results');
  if (!resultsContainer) return;
  
  resultsContainer.innerHTML = '';
  
  if (drugs.length === 0) {
    resultsContainer.innerHTML = '<p>No se encontraron medicamentos.</p>';
    return;
  }
  
  drugs.forEach(drug => {
    const drugCard = createDrugCard(drug);
    resultsContainer.appendChild(drugCard);
  });
}

function createDrugCard(drug) {
  const card = document.createElement('div');
  card.className = 'drug-card';
  card.innerHTML = `
    <div class="drug-header">
      <h3>${drug.name}</h3>
      <span class="drug-category">${drug.category}</span>
    </div>
    <div class="drug-info">
      <p><strong>Nombre genérico:</strong> ${drug.genericName}</p>
      <p><strong>Presentación:</strong> ${drug.form} ${drug.strength}</p>
      <p><strong>Indicaciones:</strong> ${drug.indications.join(', ')}</p>
    </div>
    <div class="drug-actions">
      <button onclick="viewDrugDetails('${drug.id}')" class="btn-secondary">Ver detalles</button>
      <button onclick="addToPrescription('${drug.id}')" class="btn-primary">Agregar a receta</button>
    </div>
  `;
  
  return card;
}

async function viewDrugDetails(drugId) {
  try {
    const drug = await window.clinipro.getDrug(drugId);
    showDrugDetailsModal(drug);
  } catch (error) {
    console.error('Error loading drug details:', error);
    showNotification('Error al cargar detalles del medicamento', 'error');
  }
}

function showDrugDetailsModal(drug) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>${drug.name} (${drug.genericName})</h2>
        <button onclick="this.closest('.modal').remove()" class="btn-close">✕</button>
      </div>
      <div class="modal-body">
        <div class="drug-details">
          <div class="drug-section">
            <h3>Información General</h3>
            <p><strong>Nombres comerciales:</strong> ${drug.brandNames.join(', ')}</p>
            <p><strong>Categoría:</strong> ${drug.category}</p>
            <p><strong>Presentación:</strong> ${drug.form} ${drug.strength}</p>
          </div>
          
          <div class="drug-section">
            <h3>Indicaciones</h3>
            <ul>
              ${drug.indications.map(indication => `<li>${indication}</li>`).join('')}
            </ul>
          </div>
          
          <div class="drug-section">
            <h3>Dosificación</h3>
            <p><strong>Adultos:</strong> ${drug.dosage.adult}</p>
            <p><strong>Pediátrica:</strong> ${drug.dosage.pediatric}</p>
          </div>
          
          <div class="drug-section">
            <h3>Contraindicaciones</h3>
            <ul>
              ${drug.contraindications.map(contraindication => `<li>${contraindication}</li>`).join('')}
            </ul>
          </div>
          
          <div class="drug-section">
            <h3>Interacciones</h3>
            <p>Interactúa con: ${drug.interactions.join(', ')}</p>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button onclick="this.closest('.modal').remove()" class="btn-secondary">Cerrar</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

// Enhanced Patients Integration
function loadPatientsIntegration() {
  // Add patients button to main navigation if not exists
  const nav = document.querySelector('nav');
  if (nav && !document.getElementById('btn-pacientes-avanzado')) {
    const patientsBtn = document.createElement('button');
    patientsBtn.id = 'btn-pacientes-avanzado';
    patientsBtn.innerHTML = `
      <span class="material-symbols-outlined">groups</span>
      Gestión Avanzada de Pacientes
    `;
    patientsBtn.addEventListener('click', showAdvancedPatientsPanel);
    nav.appendChild(patientsBtn);
  }
}

async function showAdvancedPatientsPanel() {
  try {
    // Hide other panels
    document.querySelectorAll('.panel').forEach(panel => panel.style.display = 'none');
    
    let panel = document.getElementById('panel-pacientes-avanzado');
    if (!panel) {
      panel = createAdvancedPatientsPanel();
      document.querySelector('.app').appendChild(panel);
    }
    
    panel.style.display = 'block';
    
    // Load patients data
    const patientsData = await window.clinipro.getPatients();
    const stats = await window.clinipro.getPatientStats();
    
    renderAdvancedPatients(patientsData, stats);
  } catch (error) {
    console.error('Error loading patients panel:', error);
    showNotification('Error al cargar gestión de pacientes', 'error');
  }
}

function createAdvancedPatientsPanel() {
  const panel = document.createElement('div');
  panel.id = 'panel-pacientes-avanzado';
  panel.className = 'panel';
  panel.innerHTML = `
    <div class="panel-header">
      <h2>👥 Gestión Avanzada de Pacientes</h2>
      <button class="btn-close" onclick="this.parentElement.parentElement.style.display='none'">✕</button>
    </div>
    
    <div class="patients-dashboard">
      <div class="patients-stats" id="patients-stats">
        <!-- Stats will be loaded here -->
      </div>
      
      <div class="patients-controls">
        <div class="search-bar">
          <input type="text" id="patients-search" placeholder="Buscar paciente...">
          <button onclick="searchAdvancedPatients()" class="btn-primary">Buscar</button>
        </div>
        <button onclick="showNewPatientForm()" class="btn-success">+ Nuevo Paciente</button>
      </div>
      
      <div id="patients-list" class="patients-advanced-list">
        <!-- Patients will be loaded here -->
      </div>
      
      <div class="pagination" id="patients-pagination">
        <!-- Pagination will be loaded here -->
      </div>
    </div>
  `;
  
  return panel;
}

function renderAdvancedPatients(patientsData, stats) {
  // Render stats
  const statsContainer = document.getElementById('patients-stats');
  if (statsContainer) {
    statsContainer.innerHTML = `
      <div class="stat-card">
        <h3>${stats.totalPatients}</h3>
        <p>Total de Pacientes</p>
      </div>
      <div class="stat-card">
        <h3>${stats.averageAge} años</h3>
        <p>Edad Promedio</p>
      </div>
      <div class="stat-card">
        <h3>${stats.genderDistribution.femenino || 0}/${stats.genderDistribution.masculino || 0}</h3>
        <p>F/M Distribución</p>
      </div>
    `;
  }

  // Render patients list
  const patientsList = document.getElementById('patients-list');
  if (patientsList) {
    patientsList.innerHTML = '';
    
    patientsData.patients.forEach(patient => {
      const patientCard = createAdvancedPatientCard(patient);
      patientsList.appendChild(patientCard);
    });
  }

  // Render pagination
  const pagination = document.getElementById('patients-pagination');
  if (pagination) {
    pagination.innerHTML = `
      <span>Página ${patientsData.page} de ${patientsData.totalPages}</span>
      <span>(${patientsData.total} pacientes en total)</span>
    `;
  }
}

function createAdvancedPatientCard(patient) {
  const card = document.createElement('div');
  card.className = 'patient-advanced-card';
  card.innerHTML = `
    <div class="patient-header">
      <div class="patient-info">
        <h3>${patient.name}</h3>
        <p>${patient.id} • ${patient.age} años • ${patient.gender}</p>
      </div>
      <div class="patient-status">
        <span class="status-badge ${patient.lastVisit ? 'active' : 'inactive'}">
          ${patient.lastVisit ? 'Activo' : 'Inactivo'}
        </span>
      </div>
    </div>
    
    <div class="patient-details">
      <p><strong>Diagnóstico:</strong> ${patient.condition}</p>
      <p><strong>Alergias:</strong> ${patient.allergies || 'Ninguna'}</p>
      <p><strong>Contacto:</strong> ${patient.phone} • ${patient.email}</p>
      ${patient.lastVisit ? `<p><strong>Última visita:</strong> ${new Date(patient.lastVisit).toLocaleDateString()}</p>` : ''}
    </div>
    
    <div class="patient-actions">
      <button onclick="viewAdvancedPatient('${patient.id}')" class="btn-secondary">Ver expediente</button>
      <button onclick="editPatient('${patient.id}')" class="btn-primary">Editar</button>
      <button onclick="scheduleAppointment('${patient.id}')" class="btn-success">Agendar cita</button>
    </div>
  `;
  
  return card;
}

async function searchAdvancedPatients() {
  const query = document.getElementById('patients-search').value;
  
  try {
    const patientsData = await window.clinipro.getPatients(query);
    const stats = await window.clinipro.getPatientStats();
    renderAdvancedPatients(patientsData, stats);
  } catch (error) {
    console.error('Error searching patients:', error);
    showNotification('Error en la búsqueda de pacientes', 'error');
  }
}

// Utility functions
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 24px;
    border-radius: 8px;
    color: white;
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;
  
  // Set background color based on type
  const colors = {
    success: '#10b981',
    error: '#dc2626',
    warning: '#f59e0b',
    info: '#3b82f6'
  };
  notification.style.backgroundColor = colors[type] || colors.info;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add CSS for new components
const additionalCSS = `
  .panel {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 1000;
  }
  
  .panel-header {
    background: var(--glass);
    padding: 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .btn-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: var(--muted);
  }
  
  .protocols-grid, .drug-grid, .patients-advanced-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px;
  }
  
  .protocol-card, .drug-card, .patient-advanced-card {
    background: var(--glass);
    border: var(--border);
    border-radius: var(--card-radius);
    padding: 20px;
    transition: var(--transition);
  }
  
  .protocol-card:hover, .drug-card:hover, .patient-advanced-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow);
  }
  
  .tab-btn {
    padding: 12px 24px;
    border: none;
    background: var(--glass-2);
    cursor: pointer;
    border-radius: 8px 8px 0 0;
    margin-right: 4px;
  }
  
  .tab-btn.active {
    background: var(--accent);
    color: white;
  }
  
  .pharmacy-tab {
    display: none;
    padding: 20px;
  }
  
  .pharmacy-tab.active {
    display: block;
  }
  
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  }
  
  .modal-content {
    background: var(--glass);
    border-radius: var(--card-radius);
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    width: 90%;
  }
  
  .modal-header, .modal-footer {
    padding: 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .modal-footer {
    border-bottom: none;
    border-top: 1px solid var(--border);
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .patients-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .stat-card {
    background: var(--glass);
    border: var(--border);
    border-radius: var(--card-radius);
    padding: 20px;
    text-align: center;
  }
  
  .stat-card h3 {
    font-size: 2rem;
    margin: 0;
    color: var(--accent);
  }
  
  .status-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
  }
  
  .status-badge.active {
    background: var(--success);
    color: white;
  }
  
  .status-badge.inactive {
    background: var(--muted);
    color: white;
  }
  
  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); }
    to { transform: translateX(100%); }
  }
`;

// Inject additional CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);

console.log('✅ CliniPro Suite API Integration loaded successfully');