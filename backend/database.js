const sqlite3 = require('sqlite3').verbose();

let db;

function init() {
  db = new sqlite3.Database('caretrack.db', (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the database.');
      
      // Users table for authentication and role management
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT NOT NULL,
          role TEXT NOT NULL,
          specialty TEXT,
          license_number TEXT,
          phone TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          is_active INTEGER DEFAULT 1,
          two_factor_secret TEXT,
          two_factor_enabled INTEGER DEFAULT 0
        )
      `);

      // Enhanced patients table
      db.run(`
        CREATE TABLE IF NOT EXISTS patients (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          age INTEGER,
          gender TEXT,
          date_of_birth TEXT,
          condition TEXT,
          allergies TEXT,
          emergency_contact TEXT,
          emergency_phone TEXT,
          blood_type TEXT,
          insurance_info TEXT,
          assigned_professional TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (assigned_professional) REFERENCES users(id)
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
          notes TEXT,
          recorded_by TEXT,
          FOREIGN KEY (patientId) REFERENCES patients(id),
          FOREIGN KEY (recorded_by) REFERENCES users(id)
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
          status TEXT,
          prescribed_by TEXT,
          administered_by TEXT,
          FOREIGN KEY (patientId) REFERENCES patients(id),
          FOREIGN KEY (prescribed_by) REFERENCES users(id),
          FOREIGN KEY (administered_by) REFERENCES users(id)
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS notes (
          id TEXT PRIMARY KEY,
          patientId TEXT,
          at TEXT,
          type TEXT,
          text TEXT,
          created_by TEXT,
          FOREIGN KEY (patientId) REFERENCES patients(id),
          FOREIGN KEY (created_by) REFERENCES users(id)
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS fluids (
          id TEXT PRIMARY KEY,
          patientId TEXT,
          at TEXT,
          fluid_in INTEGER,
          fluid_out INTEGER,
          recorded_by TEXT,
          FOREIGN KEY (patientId) REFERENCES patients(id),
          FOREIGN KEY (recorded_by) REFERENCES users(id)
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          patientId TEXT,
          text TEXT,
          done INTEGER,
          assigned_to TEXT,
          created_by TEXT,
          due_date TEXT,
          priority TEXT DEFAULT 'medium',
          FOREIGN KEY (patientId) REFERENCES patients(id),
          FOREIGN KEY (assigned_to) REFERENCES users(id),
          FOREIGN KEY (created_by) REFERENCES users(id)
        )
      `);
      
      // Medical Records table for EMR
      db.run(`
        CREATE TABLE IF NOT EXISTS medical_records (
          id TEXT PRIMARY KEY,
          patientId TEXT NOT NULL,
          consultation_date TEXT NOT NULL,
          diagnosis TEXT,
          treatment TEXT,
          symptoms TEXT,
          examination_findings TEXT,
          prescriptions TEXT,
          follow_up_date TEXT,
          created_by TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (patientId) REFERENCES patients(id),
          FOREIGN KEY (created_by) REFERENCES users(id)
        )
      `);
      
      // Notifications table for automation
      db.run(`
        CREATE TABLE IF NOT EXISTS notifications (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          patient_id TEXT,
          type TEXT NOT NULL,
          title TEXT NOT NULL,
          message TEXT NOT NULL,
          scheduled_for TEXT,
          sent_at TEXT,
          read_at TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (patient_id) REFERENCES patients(id)
        )
      `);
      
      // Audit logs for security
      db.run(`
        CREATE TABLE IF NOT EXISTS audit_logs (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          action TEXT NOT NULL,
          resource_type TEXT NOT NULL,
          resource_id TEXT,
          details TEXT,
          ip_address TEXT,
          timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
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
    db.run('INSERT INTO patients (id, name, age, gender, date_of_birth, condition, allergies, emergency_contact, emergency_phone, blood_type, insurance_info, assigned_professional) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [patient.id, patient.name, patient.age, patient.gender, patient.date_of_birth, patient.condition, patient.allergies, patient.emergency_contact, patient.emergency_phone, patient.blood_type, patient.insurance_info, patient.assigned_professional],
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
    db.run('INSERT INTO vitals (id, patientId, at, tempC, hr, sys, dia, spo2, rr, pain, gcs, notes, recorded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [vital.id, vital.patientId, vital.at, vital.tempC, vital.hr, vital.sys, vital.dia, vital.spo2, vital.rr, vital.pain, vital.gcs, vital.notes, vital.recorded_by],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
  });
}

// User management functions
function createUser(user) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO users (id, email, password, name, role, specialty, license_number, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [user.id, user.email, user.password, user.name, user.role, user.specialty, user.license_number, user.phone],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
  });
}

function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ? AND is_active = 1', [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function getUserById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ? AND is_active = 1', [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function updateUser(id, updates) {
  return new Promise((resolve, reject) => {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);
    
    db.run(`UPDATE users SET ${fields} WHERE id = ?`, values, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
}

function getAllUsers(role = null) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT id, email, name, role, specialty, license_number, phone, created_at FROM users WHERE is_active = 1';
    let params = [];
    
    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }
    
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Medical Records functions
function createMedicalRecord(record) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO medical_records (id, patientId, consultation_date, diagnosis, treatment, symptoms, examination_findings, prescriptions, follow_up_date, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [record.id, record.patientId, record.consultation_date, record.diagnosis, record.treatment, record.symptoms, record.examination_findings, record.prescriptions, record.follow_up_date, record.created_by],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(record);
        }
      });
  });
}

function getMedicalRecords(patientId) {
  return new Promise((resolve, reject) => {
    db.all('SELECT mr.*, u.name as doctor_name FROM medical_records mr LEFT JOIN users u ON mr.created_by = u.id WHERE mr.patientId = ? ORDER BY mr.consultation_date DESC', [patientId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Notifications functions
function createNotification(notification) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO notifications (id, user_id, patient_id, type, title, message, scheduled_for) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [notification.id, notification.user_id, notification.patient_id, notification.type, notification.title, notification.message, notification.scheduled_for],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(notification);
        }
      });
  });
}

function getUserNotifications(userId, unreadOnly = false) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT n.*, p.name as patient_name FROM notifications n LEFT JOIN patients p ON n.patient_id = p.id WHERE n.user_id = ?';
    let params = [userId];
    
    if (unreadOnly) {
      query += ' AND n.read_at IS NULL';
    }
    
    query += ' ORDER BY n.created_at DESC LIMIT 50';
    
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Audit log functions
function createAuditLog(log) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, details, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [log.id, log.user_id, log.action, log.resource_type, log.resource_id, log.details, log.ip_address],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(log);
        }
      });
  });
}

module.exports = { 
  init, 
  getPatients, 
  addPatient, 
  getVitals, 
  addVital,
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  getAllUsers,
  createMedicalRecord,
  getMedicalRecords,
  createNotification,
  getUserNotifications,
  createAuditLog
};
