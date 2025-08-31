// main.js: lógica principal y renderizado dinámico para SaludPro

// ========== DATOS ==========
/* Los datos se cargan desde archivos independientes:
   - data-procedimientos.js
   - data-enfermedades.js
   - data-interacciones.js
   - data-protocolos.js
   - data-galeria.js
   - data-educacion.js
*/

// ========== PANELES Y NAVEGACIÓN ==========

function showPanel(panelId) {
  document.querySelectorAll('.panel').forEach(p => p.style.display = 'none');
  document.getElementById('modalBackdrop').style.display = 'block';
  let panel = document.getElementById(panelId);
  if (panel) panel.style.display = 'flex';
  if (panelId === 'panel-procedimientos') renderProcedimientos('higiene');
  if (panelId === 'panel-enfermedades') renderEnfermedades('cronicas');
  if (panelId === 'panel-interacciones') renderInteracciones('cardio');
  if (panelId === 'panel-protocolos') renderProtocolos('emergencia');
  if (panelId === 'panel-galeria') renderGallery();
  if (panelId === 'panel-educacion') { renderEducacionGallery(); renderEduSearch(); }
  if (panelId === 'panel-alertas') renderAlertas();
  if (panelId === 'panel-perfil') renderPerfil();
  if (panelId === 'panel-contacto') renderContacto();
  if (panelId === 'panel-combinador') renderCombinador();
}

function closePanel() {
  document.querySelectorAll('.panel').forEach(p => p.style.display = 'none');
  document.getElementById('modalBackdrop').style.display = 'none';
}

// Menú principal
document.getElementById('btn-procedimientos').onclick = () => showPanel('panel-procedimientos');
document.getElementById('btn-enfermedades').onclick = () => showPanel('panel-enfermedades');
document.getElementById('btn-interacciones').onclick = () => showPanel('panel-interacciones');
document.getElementById('btn-combinador').onclick = () => showPanel('panel-combinador');
document.getElementById('btn-protocolos').onclick = () => showPanel('panel-protocolos');
document.getElementById('btn-alertas').onclick = () => showPanel('panel-alertas');
document.getElementById('btn-galeria').onclick = () => showPanel('panel-galeria');
document.getElementById('btn-educacion').onclick = () => showPanel('panel-educacion');
document.getElementById('btn-perfil').onclick = () => showPanel('panel-perfil');
document.getElementById('btn-contacto').onclick = () => showPanel('panel-contacto');

document.getElementById('modalBackdrop').onclick = closePanel;

// ========== RENDERIZADO DE PANEL DE PROCEDIMIENTOS ==========

function renderProcedimientos(subcat) {
  const panel = document.getElementById('panel-procedimientos');
  panel.innerHTML = `
    <button class="close-btn" title="Cerrar" onclick="closePanel()">&times;</button>
    <h2><span class="material-symbols-outlined">edit_note</span> Procedimientos Clínicos</h2>
    <div class="panel-nav">${Object.keys(PROCEDIMIENTOS).map(k =>
      `<button onclick="renderProcedimientos('${k}')" class="${k===subcat?'active':''}">${capitalize(k)}</button>`
    ).join('')}</div>
    <div id="procedimientos-content"></div>
    <div class="panel-warn moderate">
      <span class="material-symbols-outlined">warning</span>
      Saltar pasos de higiene puede provocar complicaciones graves y responsabilidad profesional.
    </div>
    <h3>Galería de procedimientos</h3>
    <div class="panel-gallery" id="procedimientos-gallery"></div>
  `;
  let html = '<ul style="margin:0; padding-left:20px">';
  (PROCEDIMIENTOS[subcat]||[]).forEach(p=>{
    const icon = p.nivel==='fatal'?'⛔':p.nivel==='moderate'?'⚠️':'✅';
    html += `<li class="${p.nivel}" style="margin:12px 0;"><b>${p.titulo}</b>: ${p.desc} <span>${icon}</span></li>`;
  });
  html += '</ul>';
  document.getElementById('procedimientos-content').innerHTML = html;

  let gal = '';
  (PROCEDIMIENTOS[subcat]||[]).forEach(p=>{
    gal += `<div class="panel-img-block ${p.nivel}">
      <img src="${p.img}" alt="${p.titulo}">
      <div class="panel-img-caption">${p.titulo}<br><small><a href="${p.credit}" target="_blank">Freepik</a></small></div>
    </div>`;
  });
  document.getElementById('procedimientos-gallery').innerHTML = gal;
}

// ========== RENDERIZADO DE PANEL DE ENFERMEDADES ==========
function renderEnfermedades(subcat) {
  const panel = document.getElementById('panel-enfermedades');
  
  // Error handling: Check if ENFERMEDADES data is available
  if (typeof ENFERMEDADES === 'undefined') {
    panel.innerHTML = `
      <button class="close-btn" title="Cerrar" onclick="closePanel()">&times;</button>
      <h2><span class="material-symbols-outlined">vaccines</span> Enfermedades y Patologías</h2>
      <div class="notif fatal">
        <span class="material-symbols-outlined">error</span>
        Error: No se pudieron cargar los datos de enfermedades. Por favor, recarga la página.
      </div>
    `;
    return;
  }

  panel.innerHTML = `
    <button class="close-btn" title="Cerrar" onclick="closePanel()">&times;</button>
    <h2><span class="material-symbols-outlined">vaccines</span> Enfermedades y Patologías</h2>
    <div class="panel-nav">${Object.keys(ENFERMEDADES).map(k =>
      `<button onclick="renderEnfermedades('${k}')" class="${k===subcat?'active':''}">${capitalize(k)}</button>`
    ).join('')}</div>
    <div id="enfermedades-content"></div>
    <h3>Galería de patologías</h3>
    <div class="panel-gallery" id="enfermedades-gallery"></div>
  `;
  
  let html = '<ul style="margin:0; padding-left:20px">';
  const diseases = ENFERMEDADES[subcat] || [];
  
  if (diseases.length === 0) {
    html += '<li style="color: #666; font-style: italic;">No hay enfermedades disponibles en esta categoría.</li>';
  } else {
    diseases.forEach(e=>{
      const icon = e.nivel==='fatal'?'⛔':e.nivel==='moderate'?'⚠️':'✅';
      html += `<li class="${e.nivel}" style="margin:12px 0;"><b>${e.titulo}</b>: ${e.desc} <span>${icon}</span></li>`;
    });
  }
  html += '</ul>';
  document.getElementById('enfermedades-content').innerHTML = html;

  let gal = '';
  diseases.forEach(e=>{
    gal += `<div class="panel-img-block ${e.nivel}">
      <img src="${e.img}" alt="${e.titulo}" onerror="this.style.display='none'">
      <div class="panel-img-caption">${e.titulo}<br><small><a href="${e.credit}" target="_blank">Freepik</a></small></div>
    </div>`;
  });
  document.getElementById('enfermedades-gallery').innerHTML = gal;
}

// ========== RENDERIZADO DE PANEL DE INTERACCIONES ==========
function renderInteracciones(subcat) {
  const panel = document.getElementById('panel-interacciones');
  panel.innerHTML = `
    <button class="close-btn" title="Cerrar" onclick="closePanel()">&times;</button>
    <h2><span class="material-symbols-outlined">warning</span> Interacciones Medicamentosas</h2>
    <div class="panel-nav">${Object.keys(INTERACCIONES).map(k =>
      `<button onclick="renderInteracciones('${k}')" class="${k===subcat?'active':''}">${capitalize(k)}</button>`
    ).join('')}</div>
    <div id="interacciones-content"></div>
    <h3>Ejemplos visuales de interacciones</h3>
    <div class="panel-gallery" id="interacciones-gallery"></div>
  `;
  let html = '<ul style="margin:0; padding-left:20px">';
  (INTERACCIONES[subcat]||[]).forEach(i=>{
    const icon = i.nivel==='fatal'?'⛔':'⚠️';
    html += `<li class="${i.nivel}" style="margin:12px 0;"><b>${i.comb}</b>: ${i.desc} <span>${icon}</span></li>`;
  });
  html += '</ul>';
  document.getElementById('interacciones-content').innerHTML = html;

  let gal = '';
  (INTERACCIONES[subcat]||[]).forEach(i=>{
    gal += `<div class="panel-img-block ${i.nivel}">
      <img src="${i.img}" alt="${i.comb}">
      <div class="panel-img-caption">${i.comb}<br><small><a href="${i.credit}" target="_blank">Freepik</a></small></div>
    </div>`;
  });
  document.getElementById('interacciones-gallery').innerHTML = gal;
}

// ========== RENDERIZADO DE PANEL DE PROTOCOLOS ==========
function renderProtocolos(subcat) {
  const panel = document.getElementById('panel-protocolos');
  panel.innerHTML = `
    <button class="close-btn" title="Cerrar" onclick="closePanel()">&times;</button>
    <h2><span class="material-symbols-outlined">article</span> Protocolos Clínicos</h2>
    <div class="panel-nav">${Object.keys(PROTOCOLOS).map(k =>
      `<button onclick="renderProtocolos('${k}')" class="${k===subcat?'active':''}">${capitalize(k)}</button>`
    ).join('')}</div>
    <div id="protocolos-content"></div>
    <h3>Galería de protocolos</h3>
    <div class="panel-gallery" id="protocolos-gallery"></div>
  `;
  let html = '<ul style="margin:0; padding-left:20px">';
  (PROTOCOLOS[subcat]||[]).forEach(p=>{
    html += `<li style="margin:12px 0;"><b>${p.titulo}</b>: ${p.desc}</li>`;
  });
  html += '</ul>';
  document.getElementById('protocolos-content').innerHTML = html;

  let gal = '';
  (PROTOCOLOS[subcat]||[]).forEach(p=>{
    gal += `<div class="panel-img-block">
      <img src="${p.img}" alt="${p.titulo}">
      <div class="panel-img-caption">${p.titulo}<br><small><a href="${p.credit}" target="_blank">Freepik</a></small></div>
    </div>`;
  });
  document.getElementById('protocolos-gallery').innerHTML = gal;
}

// ========== RENDERIZADO DE PANEL DE ALERTAS ==========
function renderAlertas() {
  const panel = document.getElementById('panel-alertas');
  panel.innerHTML = `
    <button class="close-btn" title="Cerrar" onclick="closePanel()">&times;</button>
    <h2><span class="material-symbols-outlined">notifications</span> Alertas Críticas</h2>
    <div id="alertas-content"></div>
    <div class="panel-warn fatal">
      <span class="material-symbols-outlined">block</span>
      ¡Alerta máxima! Verifica siempre las alertas institucionales y farmacológicas antes de intervenir.
    </div>
  `;
  document.getElementById('alertas-content').innerHTML = ALERTAS.map(a =>
    `<div class="notif ${a.nivel}">
      <span class="material-symbols-outlined">${a.nivel==="fatal"?"block":"warning"}</span>
      [${a.tipo}] ${a.mensaje}
    </div>`
  ).join('');
}

// ========== RENDERIZADO DE PANEL DE GALERÍA ==========
function renderGallery() {
  const panel = document.getElementById('panel-galeria');
  panel.innerHTML = `
    <button class="close-btn" title="Cerrar" onclick="closePanel()">&times;</button>
    <h2><span class="material-symbols-outlined">photo_library</span> Galería Educativa Clínica</h2>
    <div class="panel-gallery" id="galleryGrid"></div>
    <div class="panel-warn fatal">
      <span class="material-symbols-outlined">block</span>
      Nunca realices prácticas inseguras sin supervisión, pueden ser fatales para el paciente.
    </div>
  `;
  let html = '';
  GALERIA.forEach(img=>{
    html += `<div class="panel-img-block ${img.nivel}">
      <div class="level-badge">${img.nivel==='fatal'?'F':img.nivel==='moderate'?'M':'L'}</div>
      <img src="${img.src}" alt="${img.caption}">
      <div class="panel-img-caption">${img.caption}<br><small><a href="${img.credit}" target="_blank">Freepik</a></small></div>
    </div>`;
  });
  document.getElementById('galleryGrid').innerHTML = html;
}

// ========== RENDERIZADO DE PANEL DE EDUCACIÓN ==========
function renderEducacionGallery() {
  const panel = document.getElementById('panel-educacion');
  panel.innerHTML = `
    <button class="close-btn" title="Cerrar" onclick="closePanel()">&times;</button>
    <h2><span class="material-symbols-outlined">menu_book</span> Recursos Educativos</h2>
    <div class="search-box"><input id="eduSearchBox" placeholder="Buscar recurso, tip, video, protocolo..."></div>
    <div id="educacion-content"></div>
    <h3>Recursos destacados</h3>
    <div class="panel-gallery" id="educacion-gallery"></div>
    <div id="wikiSummary" class="wiki-summary"></div>
  `;
  let html = '';
  EDUCACION.forEach(img=>{
    html += `<div class="panel-img-block">
      <img src="${img.src}" alt="${img.caption}">
      <div class="panel-img-caption">${img.caption}<br><small><a href="${img.credit}" target="_blank">Freepik</a></small></div>
    </div>`;
  });
  document.getElementById('educacion-gallery').innerHTML = html;
}

function renderEduSearch() {
  const input = document.getElementById('eduSearchBox');
  if (!input) return;
  input.oninput = function(e) {
    const q = e.target.value.trim();
    if (q.length < 3) {
      document.getElementById('educacion-content').innerHTML = '';
      document.getElementById('wikiSummary').innerHTML = '';
      return;
    }
    document.getElementById('educacion-content').innerHTML = `<div style="color: #555; font-style: italic;">Buscando información sobre "${q}"...</div>`;
    fetch(`https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`)
      .then(r => r.ok ? r.json() : Promise.reject(new Error('No encontrado')))
      .then(data => {
        if (data && data.extract) {
          document.getElementById('wikiSummary').innerHTML =
            `<b>Información de Wikipedia:</b> ${data.extract.substring(0, 300)}...<br>
            <a href="https://es.wikipedia.org/wiki/${encodeURIComponent(q)}" target="_blank">Leer más en Wikipedia</a>`;
        } else {
          document.getElementById('wikiSummary').innerHTML = 'No se encontró información disponible sobre este tema.';
        }
      })
      .catch(() => {
        document.getElementById('wikiSummary').innerHTML = 'No se encontró información disponible sobre este tema. Intente con otra búsqueda.';
      });
  };
}

// ========== PANEL PERFIL ==========
function renderPerfil() {
  const panel = document.getElementById('panel-perfil');
  panel.innerHTML = `
    <button class="close-btn" title="Cerrar" onclick="closePanel()">&times;</button>
    <h2><span class="material-symbols-outlined">person</span> Perfil Profesional</h2>
    <form id="perfil-form">
      <label>Nombre: <input type="text" id="perfil-nombre"></label><br>
      <label>Apellido: <input type="text" id="perfil-apellido"></label><br>
      <label>Especialidad: <input type="text" id="perfil-esp"></label><br>
      <label>Registro profesional: <input type="text" id="perfil-reg"></label><br>
      <label>Correo electrónico: <input type="email" id="perfil-mail"></label><br>
      <label>Teléfono: <input type="text" id="perfil-tel"></label><br>
      <label>Institución: <input type="text" id="perfil-inst"></label><br>
      <label>Foto de perfil: <input type="file" id="perfil-foto"></label><br>
      <label>Preferencias notificación: <select id="perfil-notif"><option value="email">Email</option><option value="sms">SMS</option><option value="ninguno">Ninguno</option></select></label><br>
      <button type="button" id="perfil-save">Guardar</button>
    </form>
    <div id="perfil-res"></div>
  `;
  document.getElementById('perfil-save').onclick = function() {
    const nombre = document.getElementById('perfil-nombre').value;
    const apellido = document.getElementById('perfil-apellido').value;
    const esp = document.getElementById('perfil-esp').value;
    const reg = document.getElementById('perfil-reg').value;
    const mail = document.getElementById('perfil-mail').value;
    const tel = document.getElementById('perfil-tel').value;
    const inst = document.getElementById('perfil-inst').value;
    const notif = document.getElementById('perfil-notif').value;
    let resumen = `<div class="notif leve">Perfil guardado:<br>
      Nombre: ${nombre} ${apellido}<br>
      Especialidad: ${esp}<br>
      Registro: ${reg}<br>
      Email: ${mail}<br>
      Teléfono: ${tel}<br>
      Institución: ${inst}<br>
      Notificaciones: ${notif}</div>`;
    document.getElementById('perfil-res').innerHTML = resumen;
  };
}

// ========== PANEL CONTACTO ==========
function renderContacto() {
  const panel = document.getElementById('panel-contacto');
  panel.innerHTML = `
    <button class="close-btn" title="Cerrar" onclick="closePanel()">&times;</button>
    <h2><span class="material-symbols-outlined">contact_mail</span> Contacto</h2>
    <form id="contacto-form">
      <label>Nombre: <input type="text" id="contacto-nombre"></label><br>
      <label>Email: <input type="email" id="contacto-email"></label><br>
      <label>Asunto: <input type="text" id="contacto-asunto"></label><br>
      <label>Mensaje:<br><textarea id="contacto-msg" rows="4" style="width:100%"></textarea></label><br>
      <label>Adjuntar archivo (opcional): <input type="file" id="contacto-archivo"></label><br>
      <button type="button" id="contacto-send">Enviar</button>
    </form>
    <div id="contacto-res"></div>
  `;
  document.getElementById('contacto-send').onclick = function() {
    const nombre = document.getElementById('contacto-nombre').value;
    const email = document.getElementById('contacto-email').value;
    const asunto = document.getElementById('contacto-asunto').value;
    const msg = document.getElementById('contacto-msg').value;
    if (!nombre || !email || !msg) {
      document.getElementById('contacto-res').innerHTML = '<div class="notif fatal">Por favor, completa todos los campos.</div>';
      return;
    }
    document.getElementById('contacto-res').innerHTML = `<div class="notif leve">¡Gracias, ${nombre}! Tu mensaje ha sido enviado.</div>`;
  };
}

// ========== PANEL COMBINADOR ==========
function renderCombinador() {
  const panel = document.getElementById('panel-combinador');
  panel.innerHTML = `
    <button class="close-btn" title="Cerrar" onclick="closePanel()">&times;</button>
    <h2><span class="material-symbols-outlined">science</span> Combinador de Medicamentos</h2>
    <select id="combCategoria">
      <option value="todos">Todas las categorías</option>
      ${Object.keys(INTERACCIONES).map(k=>`<option value="${k}">${capitalize(k)}</option>`).join('')}
    </select>
    <input id="medA" placeholder="Medicamento A">
    <input id="medB" placeholder="Medicamento B">
    <button id="checkComb"><span class="material-symbols-outlined">search</span> Verificar Interacción</button>
    <div id="comb-result" class="comb-result" style="margin-top:16px;"></div>
    <details>
      <summary><span class="material-symbols-outlined">arrow_right</span>Lista completa de interacciones críticas</summary>
      <div id="all-inter-list" style="margin-top:8px"></div>
    </details>
  `;
  document.getElementById('checkComb').onclick = function() {
    const cat = document.getElementById('combCategoria').value;
    const a = document.getElementById('medA').value.trim();
    const b = document.getElementById('medB').value.trim();
    if (!a || !b) {
      document.getElementById('comb-result').innerHTML = `<div style="color:#d93025;font-weight:500;">Por favor, ingrese dos medicamentos para verificar</div>`;
      return;
    }
    const res = buscarInteraccionCat(cat, a, b);
    if (res.length === 0) {
      document.getElementById('comb-result').innerHTML = `<div style="color:#2d8943;font-weight:500;background:#e6f4ea;padding:8px 16px;border-radius:8px;border:1px solid #ceead6;">No se detectaron interacciones graves en la base local. Consulte siempre con farmacología.</div>`;
      return;
    }
    document.getElementById('comb-result').innerHTML = res.map(r=>
      `<div class="${r.nivel}" style="padding:8px 16px;margin-bottom:8px;border-radius:8px;background:${r.nivel==='fatal'?'#fee':r.nivel==='moderate'?'#fffbe6':'#e6f4ea'};border:1px solid ${r.nivel==='fatal'?'#f9d6d5':r.nivel==='moderate'?'#ffe58f':'#ceead6'};">
        <span>${r.nivel==='fatal'?'⛔':'⚠️'}</span>
        <b>${r.comb}</b>: ${r.desc}<br><small><a href="${r.credit}" target="_blank">Freepik</a></small>
      </div>`
    ).join('');
  };
  renderAllInterList();
}

function buscarInteraccionCat(categoria, a, b) {
  let arr = categoria === "todos"
    ? Object.values(INTERACCIONES).flat()
    : INTERACCIONES[categoria] || [];
  const aLower = a.toLowerCase().trim();
  const bLower = b.toLowerCase().trim();
  return arr.filter(i => {
    const combLower = i.comb.toLowerCase();
    return (combLower.includes(aLower) && combLower.includes(bLower));
  });
}

function renderAllInterList() {
  let arr = Object.values(INTERACCIONES).flat();
  document.getElementById('all-inter-list').innerHTML =
    arr.map(i => {
      const icon = i.nivel === 'fatal' ? '⛔' : '⚠️';
      return `<div class="${i.nivel}" style="padding:6px 12px;margin-bottom:6px;border-radius:8px;background:${i.nivel==='fatal'?'#fee':'#fffbe6'};border-left:4px solid ${i.nivel==='fatal'?'#d93025':'#f29900'};">
        <span>${icon}</span>
        <b>${i.comb}</b>: ${i.desc}<br><small><a href="${i.credit}" target="_blank">Freepik</a></small>
      </div>`;
    }).join('');
}

// ========== GALERÍA PRINCIPAL (HOME) ==========
function renderHomeGallery() {
  let html = '';
  GALERIA.slice(0,6).forEach(img=>{
    html += `<div class="img-block ${img.nivel}">
      <div class="level-badge">${img.nivel==='fatal'?'F':img.nivel==='moderate'?'M':'L'}</div>
      <img src="${img.src}" alt="${img.caption}">
      <div class="img-caption">${img.caption}<br><small><a href="${img.credit}" target="_blank">Freepik</a></small></div>
    </div>`;
  });
  document.getElementById('home-gallery').innerHTML = html;
}

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

// ========== INICIO ==========
document.addEventListener('DOMContentLoaded', function() {
  renderHomeGallery();
});
