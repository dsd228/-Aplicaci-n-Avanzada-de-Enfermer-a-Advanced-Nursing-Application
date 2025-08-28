/* CareTrack Pro · Enfermería (vanilla JS + PWA) */
const $ = (s)=>document.querySelector(s);
const fmtDate = (d)=> new Date(d).toLocaleDateString('es-AR');
const fmtTime = (d)=> new Date(d).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'});
const nowISO = ()=> new Date().toISOString();
const toF = (c)=> (c*9/5+32).toFixed(1);
const toC = (f)=> ((f-32)*5/9).toFixed(1);
const uid = ()=> crypto.randomUUID(); // Use crypto.randomUUID for better UUIDs

const DB_KEY = 'ctp_enf_v2';
const PAGE_SIZE = 5;

// State Management:  Using a more structured approach
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
  audit: [] // {at, action, payload}
};

// Data Persistence
function saveDB(){ localStorage.setItem(DB_KEY, JSON.stringify(state)); }
function loadDB(){
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      Object.assign(state, JSON.parse(raw));
    }
  } catch (error) {
    console.error("Error loading data from localStorage:", error);
    // Handle the error gracefully, e.g., reset state to defaults
    resetState();
  }
}

// Reset State Function
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

// Seed Data (for initial setup)
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
  saveDB(); // Save the seeded data
}

// Audit Logging
function audit(action, payload){
  state.audit.push({at:nowISO(), action, payload});
  if(state.audit.length>500) state.audit.shift();
  saveDB(); // Save audit log on each action
}

/* ===== I18N (ES/EN) minimal ===== */
const I18N = {
  es:{ install: 'Instalar', export:'Exportar', import:'Importar', print:'Imprimir', nurse:'Profesional', patient:'Paciente', newPatient:'+ Nuevo paciente'},
  en:{ install: 'Install', export:'Export', import:'Import', print:'Print', nurse:'Nurse', patient:'Patient', newPatient:'+ New patient'}
};
function applyLang(){
  const i = I18N[state.lang];
  $('#btn-install')?.setAttribute('aria-label', i.install);
}

/* ===== Render: Patients ===== */
function renderPatientSelect(){
  const sel = $('#patient-select'); sel.innerHTML='';
  Object.values(state.patients).forEach(p=>{
    const opt=document.createElement('option'); opt.value=p.id; opt.textContent=`${p.id} – ${p.name}`; sel.appendChild(opt);
  });
  if(state.currentPatientId) sel.value=state.currentPatientId;
}
function renderPatientsTable(){
  const tb = $('#patients-tbody'); tb.innerHTML='';
  Object.values(state.patients).forEach(p=>{
    const tr=document.createElement('tr');
    tr.innerHTML = `<td>${p.id}</td><td>${p.name}</td><td>${p.age}</td><td>${p.condition}</td><td>${p.allergies||'—'}</td>
      <td><button class="btn small" data-act="set-patient" data-id="${p.id}">Seleccionar</button></td>`;
    tb.appendChild(tr);
  });
}

/* ===== Render: Vitals ===== */
function calcEWS(v){
  let s=0;
  if(v.rr<=8||v.rr>=25) s+=3; else if(v.rr>=21) s+=2;
  if(v.spo2<91) s+=3; else if(v.spo2<=93) s+=2; else if(v.spo2<=95) s+=1;
  if(v.hr<=40||v.hr>=131) s+=3; else if(v.hr<=50||v.hr>=111) s+=2; else if(v.hr>=91) s+=1;
  if(v.sys<=90||v.sys>=220) s+=3; else if(v.sys<=100) s+=2; else if(v.sys<=110) s+=1;
  const t=v.tempC; if(t<=35.0||t>=39.1) s+=3; else if(t<=36.0||t>=38.1) s+=1;
  return s;
}
function renderEWS(score){
  const chip = $('#ews-chip'); chip.textContent = `EWS: ${score}`;
  chip.className = 'chip ' + (score>=7?'danger': score>=3?'warn':'ok');
}
function renderVitals(){
  const pid = state.currentPatientId; if(!pid) return;
  const arr = (state.vitals[pid]||[]).slice().sort((a,b)=>b.at.localeCompare(a.at));
  const page = state.pages.vitals||1; const total=Math.max(1, Math.ceil(arr.length/PAGE_SIZE));
  state.pages.vitals = Math.min(page,total);
  const start=(state.pages.vitals-1)*PAGE_SIZE; const view=arr.slice(start,start+PAGE_SIZE);
  const tb = $('#vitals-tbody'); tb.innerHTML='';
  view.forEach(v=>{
    const d=new Date(v.at);
    const t = state.unit==='C'? `${v.tempC.toFixed(1)} °C` : `${toF(v.tempC)} °F`;
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${fmtDate(d)}</td><td>${fmtTime(d)}</td><td>${t}</td><td>${v.hr}</td><td>${v.sys}/${v.dia}</td><td>${v.spo2}</td><td>${v.rr}</td><td>${v.pain??'—'}</td><td>${v.gcs??'—'}</td><td>${v.notes||''}</td>`;
    tb.appendChild(tr);
  });
  $('#vitals-page').textContent=`Página ${state.pages.vitals} de ${Math.max(1,Math.ceil(arr.length/PAGE_SIZE))}`;
  $('#vitals-last').textContent = arr[0]? `Último: ${fmtDate(arr[0].at)} ${fmtTime(arr[0].at)}`: '';
  const latest = arr[0]; renderEWS(latest?calcEWS(latest):0);
  renderVitalsChart(arr.slice().reverse().slice(-20)); // last 20 for chart
}

/* Simple canvas chart for Temp trend (no deps) */
function renderVitalsChart(data){
  const c = $('#vitals-chart'); const ctx = c.getContext('2d');
  const W = c.width = c.clientWidth; const H = c.height = 120;
  ctx.clearRect(0,0,W,H);
  if(!data.length) return;
  const temps = data.map(v=> v.tempC);
  const min = Math.min(...temps) - 0.5, max = Math.max(...temps) + 0.5;
  const pad = 10;
  ctx.strokeStyle = '#dce1e5'; ctx.lineWidth=1;
  // grid
  for(let y=0;y<4;y++){ const yy = pad + (H-2*pad)*y/3; ctx.beginPath(); ctx.moveTo(pad,yy); ctx.lineTo(W-pad,yy); ctx.stroke(); }
  // line
  ctx.strokeStyle = '#1994e6'; ctx.lineWidth=2; ctx.beginPath();
  data.forEach((v,i)=>{
    const x = pad + (W-2*pad)*i/(data.length-1);
    const t = v.tempC;
    const y = H-pad - ( (t-min)/(max-min) )*(H-2*pad);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();
}

/* ===== Render: Meds ===== */
function renderMeds(){
  const pid = state.currentPatientId; if(!pid) return;
  const arr=(state.meds[pid]||[]).slice().sort((a,b)=> (b.date||b.at).localeCompare(a.date||a.at));
  const page=state.pages.meds||1; const total=Math.max(1,Math.ceil(arr.length/PAGE_SIZE));
  state.pages.meds=Math.min(page,total);
  const start=(state.pages.meds-1)*PAGE_SIZE; const view=arr.slice(start,start+PAGE_SIZE);
  const tb=$('#meds-tbody'); tb.innerHTML='';
  view.forEach(m=>{
    const d=new Date(m.date||m.at);
    const badge = m.status==='Administrado'?'ok': m.status==='Programado'?'warn':'danger';
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${fmtDate(d)}</td><td>${m.time||'—'}</td><td>${m.name}</td><td>${m.dose}</td><td>${m.route}</td><td>${m.freq}</td>
    <td><span class="chip ${badge}">${m.status}</span></td>
    <td><button class="btn small" data-act="toggle-med" data-id="${m.id}">Cambiar</button></td>`;
    tb.appendChild(tr);
  });
  $('#meds-page').textContent=`Página ${state.pages.meds} de ${Math.max(1,Math.ceil(arr.length/PAGE_SIZE))}`;
}

/* ===== Render: Notes ===== */
function renderNotes(){
  const pid=state.currentPatientId; if(!pid) return;
  const filter = $('#notes-filter').value;
  const arr=(state.notes[pid]||[]).slice().sort((a,b)=>b.at.localeCompare(a.at)).filter(n=> filter==='all' || n.type===filter);
  const ul=$('#notes-list'); ul.innerHTML='';
  arr.forEach(n=>{
    const li=document.createElement('li');
    li.innerHTML=`<span><b>${n.type}</b> — ${n.text}</span><span class="muted">${fmtDate(n.at)}</span>`;
    ul.appendChild(li);
  });
}

/* ===== Render: Fluids ===== */
function renderFluids(){
  const pid=state.currentPatientId; if(!pid) return;
  const arr=(state.fluids[pid]||[]).slice().sort((a,b)=>b.at.localeCompare(a.at));
  const ul=$('#fluid-list'); ul.innerHTML='';
  let net=0;
  arr.forEach(f=>{ net += (f.in||0)-(f.out||0);
    const li=document.createElement('li');
    li.innerHTML=`<span>${fmtDate(f.at)}</span><span>+${f.in||0} / -${f.out||0} ml</span>`;
    ul.appendChild(li);
  });
  $('#fluid-net').textContent=net;
}

/* ===== Render: Tasks ===== */
function renderTasks(){
  const pid=state.currentPatientId; if(!pid) return;
  const ul=$('#tasks-list'); ul.innerHTML='';
  (state.tasks[pid]||[]).forEach(t=>{
    const li=document.createElement('li');
    li.innerHTML=`<label><input type="checkbox" ${t.done?'checked':''} data-act="toggle-task" data-id="${t.id}"> ${t.text}</label>
    <button class="btn small" data-act="del-task" data-id="${t.id}">Eliminar</button>`;
    ul.appendChild(li);
  });
}

/* ===== Alerts ===== */
function renderAlerts(){
  const pid=state.currentPatientId; if(!pid) return;
  const ul=$('#alerts-list'); ul.innerHTML='';
  const v=(state.vitals[pid]||[]).slice().sort((a,b)=>b.at.localeCompare(a.at))[0];
  if(!v){ ul.innerHTML='<li class="muted">Sin registros</li>'; return; }
  const alerts=[];
  if(v.rr<=8||v.rr>=25) alerts.push({t:`Frecuencia respiratoria anormal (${v.rr} rpm)`, sev:'danger'});
  if(v.spo2<92) alerts.push({t:`SpO₂ baja (${v.spo2}%)`, sev:'danger'});
  if(v.hr<40||v.hr>130) alerts.push({t:`Frecuencia cardíaca anormal (${v.hr} lpm)`, sev:'danger'});
  if(v.sys<90||v.sys>220) alerts.push({t:`Presión arterial anormal (${v.sys}/${v.dia} mmHg)`, sev:'danger'});
  if(v.tempC<35||v.tempC>39) alerts.push({t:`Temperatura anormal (${v.tempC.toFixed(1)}°C)`, sev:'danger'});
  const ews = calcEWS(v); if(ews>=5) alerts.push({t:`EWS alto (${ews})`, sev:'danger'});
  if(!alerts.length) alerts.push({t:'Sin alertas. Paciente estable.', sev:'ok'});
  alerts.forEach(a=>{
    const li=document.createElement('li');
    const cls = a.sev==='danger'?'danger': a.sev==='warn'?'warn':'ok';
    li.innerHTML=`<span class="chip ${cls}">${cls.toUpperCase()}</span><span>${a.t}</span>`;
    ul.appendChild(li);
  });
}

/* ===== Actions ===== */
function addVital(){
  const pid=state.currentPatientId; if(!pid) return alert('Seleccioná un paciente');
  const unitC = !$('#unit-toggle').checked;
  let temp = parseFloat($('#v-temp').value);
  if(!Number.isFinite(temp)) return alert('Temperatura inválida');
  const v = {
    id:uid(), at:nowISO(), tempC: unitC? temp : parseFloat(toC(temp)),
    hr:+($('#v-hr').value||0), sys:+($('#v-sys').value||0), dia:+($('#v-dia').value||0),
    spo2:+($('#v-spo2').value||0), rr:+($('#v-rr').value||0),
    pain: $('#v-pain').value? +$('#v-pain').value : null,
    gcs: $('#v-gcs').value? +$('#v-gcs').value : null,
    notes: $('#v-notes').value.trim()
  };
  if(v.spo2 && v.spo2<80) return alert('SpO₂ demasiado baja');
  (state.vitals[pid]??=([])).push(v);
  audit('add_vital',{pid,v}); saveDB();
  renderVitals(); renderAlerts();
  ['v-temp','v-hr','v-sys','v-dia','v-spo2','v-rr','v-pain','v-gcs','v-notes'].forEach(id=>$('#'+id).value='');
}
function addMed(){
  const pid=state.currentPatientId; if(!pid) return alert('Seleccioná un paciente');
  const m={ id:uid(), at:nowISO(), date:nowISO(), time:$('#m-time').value||'', name:$('#m-name').value.trim(), dose:$('#m-dose').value.trim(), route:$('#m-route').value, freq:$('#m-freq').value.trim(), status:$('#m-status').value };
  if(!m.name||!m.dose||!m.route||!m.freq) return alert('Completá medicamento, dosis, vía y frecuencia');
  (state.meds[pid]??=([])).push(m); audit('add_med',{pid,m}); saveDB(); renderMeds();
  ['m-name','m-dose','m-freq'].forEach(id=>$('#'+id).value='');
}
function addNote(){
  const pid=state.currentPatientId; if(!pid) return alert('Seleccioná un paciente');
  const text=$('#note-text').value.trim(); if(!text) return;
  const type=$('#note-type').value;
  const n={id:uid(), at:nowISO(), type, text};
  (state.notes[pid]??=([])).push(n); audit('add_note',{pid,n}); saveDB(); renderNotes(); $('#note-text').value='';
}
function addFluid(){
  const pid=state.currentPatientId; if(!pid) return alert('Seleccioná un paciente');
  const fin=+($('#f-in').value||0), fout=+($('#f-out').value||0);
  const f={id:uid(), at:nowISO(), in:fin, out:fout};
  (state.fluids[pid]??=([])).push(f); audit('add_fluid',{pid,f}); saveDB(); renderFluids(); $('#f-in').value=''; $('#f-out').value='';
}
function addTask(){
  const pid=state.currentPatientId; if(!pid) return alert('Seleccioná un paciente');
  const text=$('#task-text').value.trim(); if(!text) return;
  const t={id:uid(), text, done:false};
  (state.tasks[pid]??=([])).push(t); audit('add_task',{pid,t}); saveDB(); renderTasks(); $('#task-text').value='';
}

/* ===== Events (delegation) ===== */
function wire(){
  $('#btn-new-patient').addEventListener('click', ()=>{
    $('#patient-modal-title').textContent='Nuevo paciente';
    ['p-id','p-name','p-age','p-cond','p-allerg'].forEach(id=>$('#'+id).value='');
    $('#patient-modal').showModal();
  });
  $('#patient-modal-save').addEventListener('click', (e)=>{
    e.preventDefault();
    const p={ id:$('#p-id').value.trim(), name:$('#p-name').value.trim(), age:+$('#p-age').value||0, condition:$('#p-cond').value.trim(), allergies:$('#p-allerg').value.trim() };
    if(!p.id||!p.name||!p.age||!p.condition) return;
    state.patients[p.id]=p; state.currentPatientId=p.id; audit('save_patient',p); saveDB();
    renderPatientSelect(); renderPatientsTable(); renderAll(); $('#patient-modal').close();
  });
  $('#btn-edit-patient').addEventListener('click', ()=>{
    const p=state.patients[state.currentPatientId]; if(!p) return alert('Seleccioná un paciente');
    $('#patient-modal-title').textContent='Editar paciente';
    $('#p-id').value=p.id; $('#p-name').value=p.name; $('#p-age').value=p.age; $('#p-cond').value=p.condition; $('#p-allerg').value=p.allergies||'';
    $('#patient-modal').showModal();
  });
  $('#patient-select').addEventListener('change', (e)=>{ state.currentPatientId=e.target.value; saveDB(); renderAll(); });

  $('#btn-add-vital').addEventListener('click', addVital);
  $('#btn-clear-vital').addEventListener('click', ()=>{ ['v-temp','v-hr','v-sys','v-dia','v-spo2','v-rr','v-pain','v-gcs','v-notes'].forEach(id=>
