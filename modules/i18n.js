// i18n.js - Internationalization support
import { $ } from './utilities.js';

export const I18N = {
  es: {
    install: 'Instalar',
    export: 'Exportar',
    import: 'Importar',
    print: 'Imprimir',
    nurse: 'Profesional',
    patient: 'Paciente',
    newPatient: '+ Nuevo paciente',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    temperature: 'Temperatura',
    heartRate: 'Frecuencia Cardíaca',
    bloodPressure: 'Presión Arterial',
    oxygen: 'Saturación O₂',
    respiratoryRate: 'Frecuencia Respiratoria',
    pain: 'Dolor',
    consciousness: 'Conciencia (GCS)',
    notes: 'Notas',
    medication: 'Medicación',
    tasks: 'Tareas',
    fluids: 'Balance Hídrico',
    alerts: 'Alertas'
  },
  en: {
    install: 'Install',
    export: 'Export',
    import: 'Import',
    print: 'Print',
    nurse: 'Nurse',
    patient: 'Patient',
    newPatient: '+ New patient',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    temperature: 'Temperature',
    heartRate: 'Heart Rate',
    bloodPressure: 'Blood Pressure',
    oxygen: 'O₂ Saturation',
    respiratoryRate: 'Respiratory Rate',
    pain: 'Pain',
    consciousness: 'Consciousness (GCS)',
    notes: 'Notes',
    medication: 'Medication',
    tasks: 'Tasks',
    fluids: 'Fluid Balance',
    alerts: 'Alerts'
  }
};

export const getCurrentLanguage = (state) => {
  return state.lang || 'es';
};

export const getText = (key, state) => {
  const lang = getCurrentLanguage(state);
  return I18N[lang]?.[key] || I18N.es[key] || key;
};

export const applyLang = (state) => {
  try {
    const lang = getCurrentLanguage(state);
    const translations = I18N[lang];

    if (!translations) {
      console.warn(`Language '${lang}' not supported, falling back to Spanish`);
      return;
    }

    // Apply aria-labels
    const installBtn = $('#btn-install');
    if (installBtn) {
      installBtn.setAttribute('aria-label', translations.install);
    }

    const exportBtn = $('#btn-export');
    if (exportBtn) {
      exportBtn.setAttribute('aria-label', translations.export);
    }

    const printBtn = $('#btn-print');
    if (printBtn) {
      printBtn.setAttribute('aria-label', translations.print);
    }

    // Update text content for elements with data-i18n attributes
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (translations[key]) {
        element.textContent = translations[key];
      }
    });

  } catch (error) {
    console.error('Error applying language:', error);
  }
};

export const setLanguage = (state, newLang) => {
  if (I18N[newLang]) {
    state.lang = newLang;
    applyLang(state);
  } else {
    console.warn(`Language '${newLang}' not supported`);
  }
};
