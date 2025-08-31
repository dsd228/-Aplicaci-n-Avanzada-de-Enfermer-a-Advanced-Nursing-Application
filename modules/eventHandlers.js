// eventHandlers.js - Event handling and user interactions
import { $, handleError, safeJSONParse } from './utilities.js';
import { state, saveDB, addPatient, audit } from './dataManager.js';
import { setLanguage } from './i18n.js';
import { renderPatientSelect, renderVitals, renderMeds, renderNotes, renderFluids, renderTasks, renderAlerts, renderPatientsTable } from './renderer.js';

// Main render function
export const renderAll = () => {
  try {
    renderPatientSelect(state);
    renderPatientsTable(state);
    renderVitals(state);
    renderMeds(state);
    renderNotes(state);
    renderFluids(state);
    renderTasks(state);
    renderAlerts(state);
    
    // Update UI elements
    const nurseInput = $('#nurse-name');
    if (nurseInput) {
      nurseInput.value = state.nurse || '';
    }
    
    const unitToggle = $('#unit-toggle');
    if (unitToggle) {
      unitToggle.checked = state.unit === 'F';
    }
    
    const tempLabel = $('#lbl-temp-unit');
    if (tempLabel) {
      tempLabel.textContent = state.unit === 'F' ? '°F' : '°C';
    }
  } catch (error) {
    handleError(error, 'Render all');
  }
};

// Patient management events
export const handlePatientSelect = (event) => {
  try {
    state.currentPatientId = event.target.value;
    audit('patient_selected', { patientId: state.currentPatientId });
    saveDB();
    renderAll();
  } catch (error) {
    handleError(error, 'Patient selection');
  }
};

export const handleNewPatient = () => {
  try {
    const name = prompt('Nombre completo del paciente:');
    if (name && name.trim().length > 1) {
      const patient = addPatient({ name: name.trim() });
      if (patient) {
        renderPatientSelect(state);
        renderAll();
      }
    }
  } catch (error) {
    handleError(error, 'New patient creation');
  }
};

export const handleNurseNameChange = (event) => {
  try {
    state.nurse = event.target.value;
    saveDB();
  } catch (error) {
    handleError(error, 'Nurse name update');
  }
};

// Settings events
export const handleUnitToggle = (event) => {
  try {
    state.unit = event.target.checked ? 'F' : 'C';
    saveDB();
    renderVitals(state);
    
    const tempLabel = $('#lbl-temp-unit');
    if (tempLabel) {
      tempLabel.textContent = state.unit === 'F' ? '°F' : '°C';
    }
  } catch (error) {
    handleError(error, 'Unit toggle');
  }
};

export const handleLanguageToggle = (event) => {
  try {
    const newLang = event.target.checked ? 'en' : 'es';
    setLanguage(state, newLang);
    saveDB();
  } catch (error) {
    handleError(error, 'Language toggle');
  }
};

// Data import/export events
export const handleExport = () => {
  try {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `caretrack-pro-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
    audit('data_exported', { timestamp: new Date().toISOString() });
  } catch (error) {
    handleError(error, 'Data export');
  }
};

export const handleImport = (event) => {
  try {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const importedData = safeJSONParse(e.target.result);
        if (!importedData) {
          throw new Error('Invalid file format');
        }
        
        // Validate imported data structure
        const requiredFields = ['patients', 'vitals', 'meds', 'notes', 'fluids', 'tasks'];
        const missingFields = requiredFields.filter(field => !importedData.hasOwnProperty(field));
        
        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }
        
        // Confirm import
        const confirmImport = confirm('¿Está seguro de que desea importar estos datos? Esto reemplazará todos los datos actuales.');
        if (!confirmImport) return;
        
        Object.assign(state, importedData);
        saveDB();
        renderPatientSelect(state);
        renderAll();
        
        audit('data_imported', { timestamp: new Date().toISOString() });
        alert('Datos importados exitosamente');
      } catch (error) {
        handleError(error, 'Data import processing');
      }
    };
    
    reader.onerror = function() {
      handleError(new Error('File reading failed'), 'File reading');
    };
    
    reader.readAsText(file);
  } catch (error) {
    handleError(error, 'Data import');
  }
};

export const handlePrint = () => {
  try {
    window.print();
    audit('report_printed', { timestamp: new Date().toISOString() });
  } catch (error) {
    handleError(error, 'Print');
  }
};

// Task management events
export const handleTaskToggle = (event) => {
  try {
    if (event.target.type !== 'checkbox') return;
    
    const taskId = event.target.getAttribute('data-task-id');
    const pid = state.currentPatientId;
    
    if (!pid || !taskId) return;
    
    const tasks = state.tasks[pid] || [];
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
      task.done = event.target.checked;
      audit('task_updated', { 
        patientId: pid, 
        taskId: taskId, 
        completed: task.done 
      });
      saveDB();
    }
  } catch (error) {
    handleError(error, 'Task toggle');
  }
};

// Generic click handler for data attributes
export const handleDataAction = (event) => {
  try {
    const action = event.target.getAttribute('data-act');
    const id = event.target.getAttribute('data-id');
    
    switch (action) {
      case 'set-patient':
        if (id) {
          state.currentPatientId = id;
          audit('patient_selected', { patientId: id });
          saveDB();
          renderAll();
        }
        break;
      
      default:
        console.warn(`Unknown action: ${action}`);
    }
  } catch (error) {
    handleError(error, 'Data action handling');
  }
};

// PWA install handling
export const setupPWAInstall = () => {
  let deferredPrompt = null;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const btn = $('#btn-install');
    if (btn) {
      btn.hidden = false;
    }
  });
  
  const installBtn = $('#btn-install');
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      
      try {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
          audit('pwa_installed', { timestamp: new Date().toISOString() });
        }
        
        deferredPrompt = null;
        installBtn.hidden = true;
      } catch (error) {
        handleError(error, 'PWA installation');
      }
    });
  }
};

// Service worker registration
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('./sw.js');
        console.log('ServiceWorker registration successful:', registration.scope);
      } catch (error) {
        console.log('ServiceWorker registration failed:', error);
      }
    });
  }
};

// Wire up all event listeners
export const wireEventHandlers = () => {
  try {
    // Patient management
    const patientSelect = $('#patient-select');
    if (patientSelect) {
      patientSelect.addEventListener('change', handlePatientSelect);
    }
    
    const newPatientBtn = $('#btn-new-patient');
    if (newPatientBtn) {
      newPatientBtn.addEventListener('click', handleNewPatient);
    }
    
    const nurseInput = $('#nurse-name');
    if (nurseInput) {
      nurseInput.addEventListener('input', handleNurseNameChange);
    }
    
    // Settings
    const unitToggle = $('#unit-toggle');
    if (unitToggle) {
      unitToggle.addEventListener('change', handleUnitToggle);
    }
    
    const langToggle = $('#lang-toggle');
    if (langToggle) {
      langToggle.addEventListener('change', handleLanguageToggle);
    }
    
    // Data management
    const exportBtn = $('#btn-export');
    if (exportBtn) {
      exportBtn.addEventListener('click', handleExport);
    }
    
    const importFile = $('#import-file');
    if (importFile) {
      importFile.addEventListener('change', handleImport);
    }
    
    const printBtn = $('#btn-print');
    if (printBtn) {
      printBtn.addEventListener('click', handlePrint);
    }
    
    // Task management - delegate to document for dynamic content
    document.addEventListener('change', (event) => {
      if (event.target.matches('[data-task-id]')) {
        handleTaskToggle(event);
      }
    });
    
    // Generic data action handler
    document.addEventListener('click', (event) => {
      if (event.target.hasAttribute('data-act')) {
        handleDataAction(event);
      }
    });
    
    // PWA setup
    setupPWAInstall();
    registerServiceWorker();
    
  } catch (error) {
    handleError(error, 'Event handler setup');
  }
};