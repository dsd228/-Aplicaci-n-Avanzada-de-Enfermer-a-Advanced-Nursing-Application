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

// ... (Implement other database functions: getVitals, addVital, etc.) ...

module.exports = { init, getPatients, addPatient };
