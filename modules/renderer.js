// renderer.js - UI rendering functions
import { $, fmtDate, fmtTime, toF, PAGE_SIZE, handleError } from './utilities.js';
import { getText } from './i18n.js';

// Patient rendering functions
export const renderPatientSelect = (state) => {
  try {
    const sel = $('#patient-select');
    if (!sel) return;
    
    sel.innerHTML = '';
    Object.values(state.patients).forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = `${p.id} – ${p.name}`;
      sel.appendChild(opt);
    });
    
    if (state.currentPatientId) {
      sel.value = state.currentPatientId;
    }
  } catch (error) {
    handleError(error, 'Patient select rendering');
  }
};

export const renderPatientsTable = (state) => {
  try {
    const tb = $('#patients-tbody');
    if (!tb) return;
    
    tb.innerHTML = '';
    Object.values(state.patients).forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.age || '—'}</td>
        <td>${p.condition || '—'}</td>
        <td>${p.allergies || '—'}</td>
        <td>
          <button class="btn small" data-act="set-patient" data-id="${p.id}" aria-label="${getText('selectPatient', state)}">
            ${getText('select', state) || 'Seleccionar'}
          </button>
        </td>
      `;
      tb.appendChild(tr);
    });
  } catch (error) {
    handleError(error, 'Patients table rendering');
  }
};

// EWS (Early Warning Score) calculation and rendering
export const calcEWS = (v) => {
  let score = 0;
  
  // Respiratory rate
  if (v.rr <= 8 || v.rr >= 25) score += 3;
  else if (v.rr >= 21) score += 2;
  
  // SpO2
  if (v.spo2 < 91) score += 3;
  else if (v.spo2 <= 93) score += 2;
  else if (v.spo2 <= 95) score += 1;
  
  // Heart rate
  if (v.hr <= 40 || v.hr >= 131) score += 3;
  else if (v.hr <= 50 || v.hr >= 111) score += 2;
  else if (v.hr >= 91) score += 1;
  
  // Systolic BP
  if (v.sys <= 90 || v.sys >= 220) score += 3;
  else if (v.sys <= 100) score += 2;
  else if (v.sys <= 110) score += 1;
  
  // Temperature
  const temp = v.tempC;
  if (temp <= 35.0 || temp >= 39.1) score += 3;
  else if (temp <= 36.0 || temp >= 38.1) score += 1;
  
  return score;
};

export const renderEWS = (score) => {
  try {
    const chip = $('#ews-chip');
    if (!chip) return;
    
    chip.textContent = `EWS: ${score}`;
    chip.className = 'chip ' + (score >= 7 ? 'danger' : score >= 3 ? 'warn' : 'ok');
  } catch (error) {
    handleError(error, 'EWS rendering');
  }
};

// Vitals rendering
export const renderVitals = (state) => {
  try {
    const wrap = $('#vitals-wrap');
    if (!wrap) return;
    
    const pid = state.currentPatientId;
    const data = state.vitals[pid] || [];
    
    let html = `
      <table class="table is-striped is-narrow is-hoverable" role="table" aria-label="${getText('vitalsTable', state)}">
        <thead>
          <tr>
            <th scope="col">Fecha</th>
            <th scope="col">Temp (${state.unit})</th>
            <th scope="col">FC</th>
            <th scope="col">PA</th>
            <th scope="col">SpO₂</th>
            <th scope="col">FR</th>
            <th scope="col">Dolor</th>
            <th scope="col">GCS</th>
            <th scope="col">Notas</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    data.slice(-PAGE_SIZE).reverse().forEach(v => {
      const tempDisplay = state.unit === 'C' ? v.tempC : toF(v.tempC);
      const ewsScore = calcEWS(v);
      
      html += `
        <tr>
          <td>${fmtDate(v.at)} ${fmtTime(v.at)}</td>
          <td>${tempDisplay}°${state.unit}</td>
          <td>${v.hr}</td>
          <td>${v.sys}/${v.dia}</td>
          <td>${v.spo2}%</td>
          <td>${v.rr}</td>
          <td>${v.pain}/10</td>
          <td>${v.gcs}/15</td>
          <td>${v.notes || '—'}</td>
        </tr>
      `;
    });
    
    html += '</tbody></table>';
    wrap.innerHTML = html;
    
    // Update EWS if there's data
    if (data.length > 0) {
      const latestVital = data[data.length - 1];
      renderEWS(calcEWS(latestVital));
    }
  } catch (error) {
    handleError(error, 'Vitals rendering');
  }
};

// Medication rendering
export const renderMeds = (state) => {
  try {
    const wrap = $('#meds-wrap');
    if (!wrap) return;
    
    const pid = state.currentPatientId;
    const data = state.meds[pid] || [];
    
    let html = `
      <table class="table is-striped is-narrow is-hoverable" role="table" aria-label="${getText('medicationTable', state)}">
        <thead>
          <tr>
            <th scope="col">Fecha/Hora</th>
            <th scope="col">Medicamento</th>
            <th scope="col">Dosis</th>
            <th scope="col">Vía</th>
            <th scope="col">Frecuencia</th>
            <th scope="col">Estado</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    data.slice(-PAGE_SIZE).reverse().forEach(m => {
      const statusClass = m.status === 'Administrado' ? 'success' : 
                         m.status === 'Omitido' ? 'danger' : 'warning';
      
      html += `
        <tr>
          <td>${fmtDate(m.at)} ${m.time || '—'}</td>
          <td>${m.name}</td>
          <td>${m.dose}</td>
          <td>${m.route}</td>
          <td>${m.freq}</td>
          <td><span class="tag ${statusClass}">${m.status}</span></td>
        </tr>
      `;
    });
    
    html += '</tbody></table>';
    wrap.innerHTML = html;
  } catch (error) {
    handleError(error, 'Medication rendering');
  }
};

// Notes rendering
export const renderNotes = (state) => {
  try {
    const wrap = $('#notes-wrap');
    if (!wrap) return;
    
    const pid = state.currentPatientId;
    const data = state.notes[pid] || [];
    
    let html = `<div class="notes-list" role="list" aria-label="${getText('notesList', state)}">`;
    
    data.slice(-PAGE_SIZE).reverse().forEach(note => {
      html += `
        <div class="note-item" role="listitem">
          <div class="note-header">
            <span class="note-type">${note.type || 'General'}</span>
            <span class="note-time">${fmtDate(note.at)} ${fmtTime(note.at)}</span>
          </div>
          <div class="note-text">${note.text}</div>
        </div>
      `;
    });
    
    html += '</div>';
    wrap.innerHTML = html;
  } catch (error) {
    handleError(error, 'Notes rendering');
  }
};

// Fluids rendering
export const renderFluids = (state) => {
  try {
    const wrap = $('#fluids-wrap');
    if (!wrap) return;
    
    const pid = state.currentPatientId;
    const data = state.fluids[pid] || [];
    
    let html = `
      <table class="table is-striped is-narrow is-hoverable" role="table" aria-label="${getText('fluidsTable', state)}">
        <thead>
          <tr>
            <th scope="col">Fecha</th>
            <th scope="col">Entrada (ml)</th>
            <th scope="col">Salida (ml)</th>
            <th scope="col">Balance</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    let totalIn = 0, totalOut = 0;
    
    data.slice(-PAGE_SIZE).reverse().forEach(f => {
      const balance = f.in - f.out;
      totalIn += f.in;
      totalOut += f.out;
      
      html += `
        <tr>
          <td>${fmtDate(f.at)} ${fmtTime(f.at)}</td>
          <td>${f.in}</td>
          <td>${f.out}</td>
          <td class="${balance >= 0 ? 'has-text-success' : 'has-text-danger'}">${balance > 0 ? '+' : ''}${balance}</td>
        </tr>
      `;
    });
    
    const totalBalance = totalIn - totalOut;
    html += `
        <tr class="is-selected">
          <td><strong>Total</strong></td>
          <td><strong>${totalIn}</strong></td>
          <td><strong>${totalOut}</strong></td>
          <td class="${totalBalance >= 0 ? 'has-text-success' : 'has-text-danger'}">
            <strong>${totalBalance > 0 ? '+' : ''}${totalBalance}</strong>
          </td>
        </tr>
      </tbody></table>
    `;
    
    wrap.innerHTML = html;
  } catch (error) {
    handleError(error, 'Fluids rendering');
  }
};

// Tasks rendering
export const renderTasks = (state) => {
  try {
    const wrap = $('#tasks-wrap');
    if (!wrap) return;
    
    const pid = state.currentPatientId;
    const data = state.tasks[pid] || [];
    
    let html = `<div class="tasks-list" role="list" aria-label="${getText('tasksList', state)}">`;
    
    data.forEach(task => {
      html += `
        <div class="task-item ${task.done ? 'completed' : ''}" role="listitem">
          <input type="checkbox" ${task.done ? 'checked' : ''} 
                 data-task-id="${task.id}" 
                 aria-label="Mark task as ${task.done ? 'incomplete' : 'complete'}">
          <span class="task-text">${task.text}</span>
        </div>
      `;
    });
    
    html += '</div>';
    wrap.innerHTML = html;
  } catch (error) {
    handleError(error, 'Tasks rendering');
  }
};

// Alerts rendering
export const renderAlerts = (state) => {
  try {
    const wrap = $('#alerts-wrap');
    if (!wrap) return;
    
    const pid = state.currentPatientId;
    const vitals = state.vitals[pid] || [];
    
    if (vitals.length === 0) {
      wrap.innerHTML = '<p>No hay datos de signos vitales.</p>';
      return;
    }
    
    const latest = vitals[vitals.length - 1];
    const alerts = [];
    
    // Check for critical values
    if (latest.tempC > 39.0 || latest.tempC < 36.0) {
      alerts.push({
        type: 'danger',
        message: `Temperatura anormal: ${latest.tempC}°C`
      });
    }
    
    if (latest.hr > 120 || latest.hr < 50) {
      alerts.push({
        type: 'danger',
        message: `Frecuencia cardíaca anormal: ${latest.hr} lpm`
      });
    }
    
    if (latest.sys > 180 || latest.sys < 90) {
      alerts.push({
        type: 'danger',
        message: `Presión arterial sistólica anormal: ${latest.sys} mmHg`
      });
    }
    
    if (latest.spo2 < 95) {
      alerts.push({
        type: 'warning',
        message: `Saturación de oxígeno baja: ${latest.spo2}%`
      });
    }
    
    let html = '';
    if (alerts.length === 0) {
      html = '<div class="alert success">Todos los signos vitales están dentro de los rangos normales.</div>';
    } else {
      alerts.forEach(alert => {
        html += `<div class="alert ${alert.type}" role="alert">${alert.message}</div>`;
      });
    }
    
    wrap.innerHTML = html;
  } catch (error) {
    handleError(error, 'Alerts rendering');
  }
};