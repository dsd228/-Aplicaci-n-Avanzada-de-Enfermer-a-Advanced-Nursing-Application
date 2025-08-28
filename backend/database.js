const sqlite3 = require('sqlite3').verbose();

let db;

function init() {
  db = new sqlite3.Database('caretrack.db', (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the database.');
      db.run(`
        CREATE TABLE IF NOT EXISTS patients (
          id TEXT PRIMARY KEY,
          name TEXT,
          age INTEGER,
          condition TEXT,
          allergies TEXT
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS vitals (
          id TEXT PRIMARY KEY,
          patientId TEXT,
          at TEXT,
          tempC REAL,
          hr INTEGER,
          sys INTEGER,
          dia INTEGER,
          spo2 INTEGER,
          rr INTEGER,
          pain INTEGER,
          gcs INTEGER,
          notes TEXT
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS meds (
          id TEXT PRIMARY KEY,
          patientId TEXT,
          at TEXT,
          date TEXT,
          time TEXT,
          name TEXT,
          dose TEXT,
          route TEXT,
          freq TEXT,
          status TEXT
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS notes (
          id TEXT PRIMARY KEY,
          patientId TEXT,
          at TEXT,
          type TEXT,
          text TEXT
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS fluids (
          id TEXT PRIMARY KEY,
          patientId TEXT,
          at TEXT,
          in INTEGER,
          out INTEGER
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          patientId TEXT,
          text TEXT,
          done INTEGER
        )
      `);
    }
  });
}

function getPatients() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM patients', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function addPatient(patient) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO patients (id, name, age, condition, allergies) VALUES (?, ?, ?, ?, ?)',
      [patient.id, patient.name, patient.age, patient.condition, patient.allergies],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
  });
}

function getVitals(patientId) {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM vitals WHERE patientId = ? ORDER BY at DESC', [patientId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function addVital(vital) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO vitals (id, patientId, at, tempC, hr, sys, dia, spo2, rr, pain, gcs, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [vital.id, vital.patientId, vital.at, vital.tempC, vital.hr, vital.sys, vital.dia, vital.spo2, vital.rr, vital.pain, vital.gcs, vital.notes],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
  });
}

// Implement similar functions for meds, notes, fluids, and tasks
// ... (addMed, getMeds, addNote, getNotes, addFluid, getFluids, addTask, getTasks) ...

module.exports = { init, getPatients, addPatient, getVitals, addVital };
