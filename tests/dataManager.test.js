// tests/dataManager.test.js - Tests for data management functions
import { state, saveDB, loadDB, seed, audit, addPatient } from '../modules/dataManager.js';

describe('Data Manager', () => {
  beforeEach(() => {
    // Reset state before each test
    Object.assign(state, {
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
      audit: []
    });
  });

  describe('State management', () => {
    test('should have initial state structure', () => {
      expect(state).toHaveProperty('nurse');
      expect(state).toHaveProperty('patients');
      expect(state).toHaveProperty('vitals');
      expect(state).toHaveProperty('meds');
      expect(state).toHaveProperty('notes');
      expect(state).toHaveProperty('fluids');
      expect(state).toHaveProperty('tasks');
      expect(state).toHaveProperty('audit');
    });
  });

  describe('Database operations', () => {
    test('saveDB should store state in localStorage', () => {
      state.nurse = 'Test Nurse';
      saveDB();
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'ctp_enf_v2',
        JSON.stringify(state)
      );
    });

    test('loadDB should restore state from localStorage', () => {
      const testData = {
        nurse: 'Restored Nurse',
        unit: 'F',
        patients: { 'P-001': { id: 'P-001', name: 'Test Patient' } }
      };
      
      localStorage.getItem.mockReturnValue(JSON.stringify(testData));
      
      loadDB();
      
      expect(localStorage.getItem).toHaveBeenCalledWith('ctp_enf_v2');
      expect(state.nurse).toBe('Restored Nurse');
      expect(state.unit).toBe('F');
      expect(state.patients).toEqual(testData.patients);
    });

    test('loadDB should handle missing data gracefully', () => {
      localStorage.getItem.mockReturnValue(null);
      
      const originalState = { ...state };
      loadDB();
      
      expect(state).toEqual(originalState);
    });
  });

  describe('Data seeding', () => {
    test('seed should create initial patients when empty', () => {
      expect(Object.keys(state.patients)).toHaveLength(0);
      
      seed();
      
      expect(Object.keys(state.patients)).toHaveLength(2);
      expect(state.patients['P-001']).toEqual({
        id: 'P-001',
        name: 'María González',
        age: 68,
        condition: 'Diabetes tipo 2',
        allergies: 'Penicilina'
      });
      expect(state.currentPatientId).toBe('P-001');
    });

    test('seed should not overwrite existing patients', () => {
      state.patients = { 'P-999': { id: 'P-999', name: 'Existing Patient' } };
      
      seed();
      
      expect(Object.keys(state.patients)).toHaveLength(1);
      expect(state.patients['P-999']).toBeDefined();
    });
  });

  describe('Audit logging', () => {
    test('audit should add entries to audit log', () => {
      audit('test_action', { testData: 'value' });
      
      expect(state.audit).toHaveLength(1);
      expect(state.audit[0]).toMatchObject({
        action: 'test_action',
        payload: { testData: 'value' }
      });
      expect(state.audit[0]).toHaveProperty('at');
    });

    test('audit should limit audit log size', () => {
      // Fill audit log beyond limit
      for (let i = 0; i < 505; i++) {
        audit(`action_${i}`, { index: i });
      }
      
      expect(state.audit).toHaveLength(500);
      expect(state.audit[0].payload.index).toBeGreaterThan(4);
    });
  });

  describe('Patient management', () => {
    test('addPatient should create new patient with valid data', () => {
      const patientData = {
        name: 'John Doe',
        age: 45,
        condition: 'Hypertension',
        allergies: 'None'
      };
      
      const result = addPatient(patientData);
      
      expect(result).toBeTruthy();
      expect(result.name).toBe('John Doe');
      expect(result.id).toMatch(/^P-\d+$/);
      expect(state.currentPatientId).toBe(result.id);
      expect(state.patients[result.id]).toEqual(result);
    });

    test('addPatient should reject invalid data', () => {
      const patientData = {
        name: ' ',  // Too short after trim
        age: 45
      };
      
      const result = addPatient(patientData);
      
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });

    test('addPatient should initialize empty arrays for patient data', () => {
      const patientData = { name: 'Test Patient' };
      
      const result = addPatient(patientData);
      
      expect(state.vitals[result.id]).toEqual([]);
      expect(state.meds[result.id]).toEqual([]);
      expect(state.notes[result.id]).toEqual([]);
      expect(state.fluids[result.id]).toEqual([]);
      expect(state.tasks[result.id]).toEqual([]);
    });

    test('addPatient should log audit entry', () => {
      const patientData = { name: 'Test Patient' };
      
      const result = addPatient(patientData);
      
      expect(state.audit).toHaveLength(1);
      expect(state.audit[0].action).toBe('patient_added');
      expect(state.audit[0].payload).toMatchObject({
        patientId: result.id,
        name: 'Test Patient'
      });
    });
  });
});