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
  audit: []
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

// -------------- Búsqueda Avanzada de Medicamentos --------------

// Función para buscar información de medicamentos desde múltiples fuentes
async function searchDrugInfo(term, type) {
  const results = {
    wikipedia: null,
    drugInfo: null,
    prices: null
  };

  // 1. Búsqueda en Wikipedia (información general)
  try {
    const wikiUrl = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`;
    const wikiResponse = await fetch(wikiUrl);
    if (wikiResponse.ok) {
      const wikiData = await wikiResponse.json();
      results.wikipedia = {
        title: wikiData.title,
        extract: wikiData.extract,
        url: wikiData.content_urls?.desktop?.page || `https://es.wikipedia.org/wiki/${encodeURIComponent(term)}`,
        image: wikiData.thumbnail?.source || null
      };
    }
  } catch (error) {
    console.warn('Wikipedia search failed:', error);
  }

  // 2. Información farmacológica simulada (en una implementación real, esto sería una API real)
  if (type === 'medicamento') {
    results.drugInfo = generateDrugInfo(term);
    results.prices = generatePriceInfo(term);
  }

  return results;
}

// Función para generar información farmacológica simulada
function generateDrugInfo(drugName) {
  const commonDrugs = {
    'paracetamol': {
      genericName: 'Paracetamol',
      brandNames: ['Tylenol', 'Panadol', 'Acetaminofén'],
      dosage: '500mg-1000mg cada 6-8 horas',
      indication: 'Analgésico y antipirético',
      contraindications: 'Insuficiencia hepática grave',
      sideEffects: 'Raras: erupciones cutáneas, trastornos hematológicos',
      category: 'Analgésico no opioide'
    },
    'ibuprofeno': {
      genericName: 'Ibuprofeno',
      brandNames: ['Advil', 'Motrin', 'Brufen'],
      dosage: '200mg-400mg cada 6-8 horas',
      indication: 'Antiinflamatorio, analgésico y antipirético',
      contraindications: 'Úlcera péptica activa, insuficiencia renal grave',
      sideEffects: 'Molestias gastrointestinales, mareos',
      category: 'AINE (Antiinflamatorio no esteroideo)'
    },
    'amoxicilina': {
      genericName: 'Amoxicilina',
      brandNames: ['Amoxil', 'Clamoxyl'],
      dosage: '250mg-500mg cada 8 horas',
      indication: 'Antibiótico de amplio espectro',
      contraindications: 'Alergia a penicilinas',
      sideEffects: 'Diarrea, náuseas, erupciones cutáneas',
      category: 'Antibiótico betalactámico'
    }
  };

  const normalizedName = drugName.toLowerCase().trim();
  return commonDrugs[normalizedName] || {
    genericName: drugName,
    brandNames: ['Consultar vademécum'],
    dosage: 'Consultar prospecto médico',
    indication: 'Consultar información médica especializada',
    contraindications: 'Consultar contraindicaciones específicas',
    sideEffects: 'Consultar efectos adversos específicos',
    category: 'Consultar clasificación farmacológica'
  };
}

// Función para generar información de precios simulada
function generatePriceInfo(drugName) {
  const basePrice = Math.floor(Math.random() * 50) + 10; // Precio base entre 10-60
  return {
    averagePrice: `$${basePrice}.00 - $${basePrice + 20}.00`,
    sources: [
      { pharmacy: 'Farmacia del Ahorro', price: `$${basePrice}.00` },
      { pharmacy: 'Farmacias Similares', price: `$${basePrice + 5}.00` },
      { pharmacy: 'Farmacia San Pablo', price: `$${basePrice + 10}.00` }
    ],
    lastUpdated: new Date().toLocaleDateString('es-ES'),
    note: 'Precios aproximados. Consultar en farmacia para precio exacto.'
  };
}

function renderDrugSearchResults(results, searchTerm) {
  const resultsWrap = $('#school-results');
  if (!resultsWrap) return;

  let html = '';
  
  if (!results.wikipedia && !results.drugInfo) {
    html = '<p class="has-text-danger">No se encontró información para el término buscado.</p>';
  } else {
    html = '<div class="drug-results">';
    
    // Información farmacológica
    if (results.drugInfo) {
      html += `
        <div class="box drug-info-card">
          <h4 class="title is-5">📋 Información Farmacológica</h4>
          <div class="content">
            <p><strong>Nombre genérico:</strong> ${results.drugInfo.genericName}</p>
            <p><strong>Nombres comerciales:</strong> ${results.drugInfo.brandNames.join(', ')}</p>
            <p><strong>Categoría:</strong> ${results.drugInfo.category}</p>
            <p><strong>Dosificación:</strong> ${results.drugInfo.dosage}</p>
            <p><strong>Indicaciones:</strong> ${results.drugInfo.indication}</p>
            <p><strong>Contraindicaciones:</strong> ${results.drugInfo.contraindications}</p>
            <p><strong>Efectos adversos:</strong> ${results.drugInfo.sideEffects}</p>
          </div>
        </div>
      `;
    }

    // Información de precios
    if (results.prices) {
      html += `
        <div class="box price-info-card">
          <h4 class="title is-5">💰 Información de Precios</h4>
          <div class="content">
            <p><strong>Rango de precios:</strong> ${results.prices.averagePrice}</p>
            <div class="pharmacy-prices">
              <h6 class="subtitle is-6">Precios por farmacia:</h6>
              <ul>
                ${results.prices.sources.map(source => 
                  `<li>${source.pharmacy}: ${source.price}</li>`
                ).join('')}
              </ul>
            </div>
            <p class="is-size-7 has-text-grey"><em>${results.prices.note}</em></p>
            <p class="is-size-7">Última actualización: ${results.prices.lastUpdated}</p>
          </div>
        </div>
      `;
    }

    // Información de Wikipedia
    if (results.wikipedia) {
      html += `
        <div class="box wikipedia-card">
          <h4 class="title is-5">📚 Información General (Wikipedia)</h4>
          <div class="content">
            <strong>${results.wikipedia.title}</strong>
            <p>${results.wikipedia.extract}</p>
            ${results.wikipedia.image ? `<figure class="image is-128x128"><img src="${results.wikipedia.image}" alt="${results.wikipedia.title}"></figure>` : ''}
            <p><a href="${results.wikipedia.url}" target="_blank" class="button is-link is-small">Ver más en Wikipedia</a></p>
          </div>
        </div>
      `;
    }

    html += '</div>';
  }

  resultsWrap.innerHTML = html;
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
    resultsWrap.innerHTML = '<p class="has-text-info">🔍 Buscando información completa...</p>';

    if (!query) {
      resultsWrap.innerHTML = '<p class="has-text-danger">Por favor, ingresa un término de búsqueda.</p>';
      return;
    }
    
    try {
      const results = await searchDrugInfo(query, type);
      renderDrugSearchResults(results, query);
    } catch (error) {
      console.error('Search error:', error);
      resultsWrap.innerHTML = '<p class="has-text-danger">Error al buscar información. Inténtalo de nuevo.</p>';
    }
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
