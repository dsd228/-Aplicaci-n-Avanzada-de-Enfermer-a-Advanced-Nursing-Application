// dataManager.js - State management and persistence
import { DB_KEY, nowISO, uid, handleError, safeLocalStorageGet, safeLocalStorageSet } from './utilities.js';

export const state = {
  nurse: '',
  unit: 'C',
  lang: 'es',
  currentPatientId: null,
  patients: {},
  vitals: {},
  meds: {},
  notes: {},
  fluids: {},
  tasks: {},
  pages: { vitals: 1, meds: 1 },
  audit: [] // {at, action, payload}
};

export const saveDB = () => {
  try {
    const success = safeLocalStorageSet(DB_KEY, state);
    if (!success) {
      throw new Error('Failed to save data to local storage');
    }
  } catch (error) {
    handleError(error, 'Database save');
  }
};

export const loadDB = () => {
  try {
    const data = safeLocalStorageGet(DB_KEY, {});
    if (data && typeof data === 'object') {
      Object.assign(state, data);
    }
  } catch (error) {
    handleError(error, 'Database load');
  }
};

export const seed = () => {
  if (Object.keys(state.patients).length) return;
  
  try {
    const p1 = {
      id: 'P-001',
      name: 'María González',
      age: 68,
      condition: 'Diabetes tipo 2',
      allergies: 'Penicilina'
    };
    const p2 = {
      id: 'P-002',
      name: 'José Pérez',
      age: 75,
      condition: 'Hipertensión',
      allergies: 'Ibuprofeno'
    };
    
    state.patients[p1.id] = p1;
    state.patients[p2.id] = p2;
    state.currentPatientId = p1.id;
    
    state.vitals[p1.id] = [{
      id: uid(),
      at: nowISO(),
      tempC: 36.8,
      hr: 72,
      sys: 120,
      dia: 80,
      spo2: 98,
      rr: 16,
      pain: 0,
      gcs: 15,
      notes: 'Ingreso'
    }];
    
    state.meds[p1.id] = [{
      id: uid(),
      at: nowISO(),
      date: nowISO(),
      time: '09:00',
      name: 'Paracetamol',
      dose: '1 g',
      route: 'Oral',
      freq: 'c/8h',
      status: 'Programado'
    }];
    
    state.notes[p1.id] = [{
      id: uid(),
      at: nowISO(),
      type: 'condition',
      text: 'Paciente estable.'
    }];
    
    state.fluids[p1.id] = [{
      id: uid(),
      at: nowISO(),
      in: 500,
      out: 200
    }];
    
    state.tasks[p1.id] = [{
      id: uid(),
      text: 'Curación 18:00',
      done: false
    }];
    
    saveDB();
  } catch (error) {
    handleError(error, 'Data seeding');
  }
};

export const audit = (action, payload) => {
  try {
    state.audit.push({ at: nowISO(), action, payload });
    if (state.audit.length > 500) {
      state.audit.shift();
    }
    saveDB();
  } catch (error) {
    handleError(error, 'Audit logging');
  }
};

// Patient management functions
export const addPatient = (patientData) => {
  try {
    if (!patientData.name || patientData.name.trim().length < 2) {
      throw new Error('Patient name is required and must be at least 2 characters long');
    }
    
    const id = 'P-' + String(Date.now()).slice(-6);
    const patient = {
      id,
      name: patientData.name.trim(),
      age: patientData.age || '',
      condition: patientData.condition || '',
      allergies: patientData.allergies || ''
    };
    
    state.patients[id] = patient;
    state.currentPatientId = id;
    
    // Initialize empty arrays for this patient
    state.vitals[id] = [];
    state.meds[id] = [];
    state.notes[id] = [];
    state.fluids[id] = [];
    state.tasks[id] = [];
    
    audit('patient_added', { patientId: id, name: patient.name });
    saveDB();
    
    return patient;
  } catch (error) {
    handleError(error, 'Add patient');
    return null;
  }
};