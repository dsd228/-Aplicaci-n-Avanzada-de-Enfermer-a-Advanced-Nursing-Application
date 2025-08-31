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
  (ENFERMEDADES[subcat]||[]).forEach(e=>{
    const icon = e.nivel==='fatal'?'⛔':e.nivel==='moderate'?'⚠️':'✅';
    html += `<li class="${e.nivel}" style="margin:12px 0;"><b>${e.titulo}</b>: ${e.desc} <span>${icon}</span></li>`;
  });
  html += '</ul>';
  document.getElementById('enfermedades-content').innerHTML = html;

  let gal = '';
  (ENFERMEDADES[subcat]||[]).forEach(e=>{
    gal += `<div class="panel-img-block ${e.nivel}">
      <img src="${e.img}" alt="${e.titulo}">
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
    
    <div class="panel-warn leve" style="margin-bottom: 16px;">
      <span class="material-symbols-outlined">info</span>
      Centro de recursos educativos para profesionales de enfermería y educación de pacientes.
    </div>
    
    <div class="search-box">
      <input id="eduSearchBox" placeholder="Buscar recurso, tip, video, protocolo..." style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
      <small style="color: #666; display: block; margin-top: 4px;">
        💡 Busca términos como: higiene, autocuidado, comunicación, derechos, medicamentos, etc.
      </small>
    </div>
    
    <div id="educacion-content" style="margin: 16px 0;"></div>
    
    <div id="education-quick-access" style="margin: 16px 0;">
      <h4 style="color: #1976d2; margin: 0 0 12px 0;">🚀 Acceso Rápido</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">
        <button onclick="searchEducationalTopic('autocuidado')" style="padding: 6px 12px; background: #e3f2fd; border: 1px solid #1976d2; border-radius: 16px; color: #1976d2; cursor: pointer; font-size: 0.9em;">💡 Autocuidado</button>
        <button onclick="searchEducationalTopic('comunicación')" style="padding: 6px 12px; background: #e3f2fd; border: 1px solid #1976d2; border-radius: 16px; color: #1976d2; cursor: pointer; font-size: 0.9em;">💬 Comunicación</button>
        <button onclick="searchEducationalTopic('higiene')" style="padding: 6px 12px; background: #e3f2fd; border: 1px solid #1976d2; border-radius: 16px; color: #1976d2; cursor: pointer; font-size: 0.9em;">🧼 Higiene</button>
        <button onclick="searchEducationalTopic('derechos')" style="padding: 6px 12px; background: #e3f2fd; border: 1px solid #1976d2; border-radius: 16px; color: #1976d2; cursor: pointer; font-size: 0.9em;">⚖️ Derechos</button>
        <button onclick="clearEducationalSearch()" style="padding: 6px 12px; background: #f5f5f5; border: 1px solid #999; border-radius: 16px; color: #666; cursor: pointer; font-size: 0.9em;">🔄 Limpiar</button>
      </div>
    </div>
    
    <h3>📚 Recursos destacados</h3>
    <div class="panel-gallery" id="educacion-gallery"></div>
    
    <div id="wikiSummary" class="wiki-summary" style="margin-top: 16px;"></div>
    
    <div class="panel-warn moderate" style="margin-top: 20px;">
      <span class="material-symbols-outlined">verified</span>
      Todos los recursos han sido validados por profesionales de enfermería. Para información específica de pacientes, siempre consulte con el equipo médico.
    </div>
  `;
  
  let html = '';
  EDUCACION.forEach(img=>{
    html += `<div class="panel-img-block">
      <img src="${img.src}" alt="${img.caption}" onerror="handleImageError(this)">
      <div class="panel-img-caption">${img.caption}<br><small><a href="${img.credit}" target="_blank">Freepik</a></small></div>
    </div>`;
  });
  document.getElementById('educacion-gallery').innerHTML = html;
}

function searchEducationalTopic(topic) {
  const searchBox = document.getElementById('eduSearchBox');
  if (searchBox) {
    searchBox.value = topic;
    searchBox.dispatchEvent(new Event('input'));
  }
}

function clearEducationalSearch() {
  const searchBox = document.getElementById('eduSearchBox');
  const contentDiv = document.getElementById('educacion-content');
  const wikiDiv = document.getElementById('wikiSummary');
  
  if (searchBox) searchBox.value = '';
  if (contentDiv) contentDiv.innerHTML = '';
  if (wikiDiv) wikiDiv.innerHTML = '';
}

function handleImageError(img) {
  img.onerror = null; // Prevent infinite loop
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik04NSA2MEwxMTUgOTBMODUgMTIwSDU1TDg1IDkwTDU1IDYwSDg1WiIgZmlsbD0iIzk5OTk5OSIvPgo8dGV4dCB4PSIxMDAiIHk9IjEzNSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbWFnZW4gbm8gZGlzcG9uaWJsZTwvdGV4dD4KPC9zdmc+';
  img.alt = 'Imagen no disponible - Contenido educativo';
  img.title = 'No se pudo cargar la imagen, pero el contenido educativo sigue disponible';
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
    
    // First search local content
    const localResults = searchLocalEducationalContent(q);
    
    document.getElementById('educacion-content').innerHTML = `<div style="color: #555; font-style: italic;">Buscando información sobre "${q}"...</div>`;
    
    // Show local results if available
    if (localResults.length > 0) {
      displayLocalEducationalResults(localResults, q);
    }
    
    // Try Wikipedia as fallback/supplement
    fetch(`https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`)
      .then(r => r.ok ? r.json() : Promise.reject(new Error('No encontrado')))
      .then(data => {
        if (data && data.extract) {
          const currentContent = document.getElementById('wikiSummary').innerHTML;
          document.getElementById('wikiSummary').innerHTML = currentContent +
            `<div style="margin-top: 16px; padding: 12px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #1976d2;">
              <b>📖 Información adicional de Wikipedia:</b><br>
              ${data.extract.substring(0, 300)}...<br>
              <a href="https://es.wikipedia.org/wiki/${encodeURIComponent(q)}" target="_blank" style="color: #1976d2;">Leer más en Wikipedia</a>
            </div>`;
        }
      })
      .catch((error) => {
        // Enhanced error handling
        console.warn('Wikipedia search failed:', error);
        if (localResults.length === 0) {
          document.getElementById('wikiSummary').innerHTML = 
            `<div style="padding: 12px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; color: #856404;">
              <span style="font-size: 1.2em;">⚠️</span> 
              <b>Información no disponible en línea</b><br>
              No se pudo conectar con fuentes externas. La información mostrada arriba proviene de nuestra base de conocimientos local.
              <br><br>
              <small>💡 <i>Tip: Verifica tu conexión a internet o intenta más tarde para acceder a contenido adicional.</i></small>
            </div>`;
        }
      });
  };
}

function searchLocalEducationalContent(query) {
  const results = [];
  const q = query.toLowerCase();
  
  // Search in EDUCACION array
  EDUCACION.forEach(item => {
    if (item.caption.toLowerCase().includes(q)) {
      results.push({
        type: 'resource',
        title: item.caption,
        content: `Recurso educativo disponible: ${item.caption}`,
        source: 'Galería Educativa',
        image: item.src,
        credit: item.credit
      });
    }
  });
  
  // Search in patient education content if available
  if (typeof EDUCACION_PACIENTES_INFO !== 'undefined') {
    // Search in FAQs
    EDUCACION_PACIENTES_INFO.preguntas_frecuentes.forEach(faq => {
      if (faq.pregunta.toLowerCase().includes(q) || faq.respuesta.toLowerCase().includes(q)) {
        results.push({
          type: 'faq',
          title: faq.pregunta,
          content: faq.respuesta,
          source: 'Preguntas Frecuentes'
        });
      }
    });
    
    // Search in recommendations
    if (q.includes('autocuidado') || q.includes('cuidado')) {
      results.push({
        type: 'recommendation',
        title: 'Recomendaciones de Autocuidado',
        content: EDUCACION_PACIENTES_INFO.autocuidado.recomendaciones.join('<br>• '),
        source: 'Guía de Autocuidado'
      });
    }
    
    if (q.includes('comunicación') || q.includes('hablar') || q.includes('médico')) {
      results.push({
        type: 'communication',
        title: 'Consejos de Comunicación',
        content: EDUCACION_PACIENTES_INFO.comunicación.consejos.join('<br>• '),
        source: 'Guía de Comunicación'
      });
    }
    
    if (q.includes('derecho') || q.includes('paciente')) {
      results.push({
        type: 'rights',
        title: 'Derechos del Paciente',
        content: EDUCACION_PACIENTES_INFO.derechos.join('<br>• '),
        source: 'Derechos y Responsabilidades'
      });
    }
  }
  
  return results;
}

function displayLocalEducationalResults(results, query) {
  const contentDiv = document.getElementById('educacion-content');
  const wikiDiv = document.getElementById('wikiSummary');
  
  if (results.length === 0) {
    contentDiv.innerHTML = `<div style="color: #666;">No se encontraron resultados locales para "${query}"</div>`;
    return;
  }
  
  let html = `<div style="margin-bottom: 16px;">
    <h4 style="color: #1976d2; margin: 0 0 12px 0;">
      🎯 Resultados encontrados (${results.length})
    </h4>
  </div>`;
  
  results.forEach(result => {
    const icon = result.type === 'faq' ? '❓' : 
                result.type === 'resource' ? '📚' :
                result.type === 'recommendation' ? '💡' :
                result.type === 'communication' ? '💬' : '⚖️';
    
    html += `
      <div style="margin-bottom: 16px; padding: 16px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #1976d2;">
        <h5 style="margin: 0 0 8px 0; color: #1976d2;">
          ${icon} ${result.title}
        </h5>
        <p style="margin: 0 0 8px 0; line-height: 1.5;">• ${result.content}</p>
        <small style="color: #666; font-style: italic;">Fuente: ${result.source}</small>
        ${result.image ? `<br><small style="color: #999;">📷 <a href="${result.credit}" target="_blank">Ver recurso visual</a></small>` : ''}
      </div>
    `;
  });
  
  contentDiv.innerHTML = html;
  wikiDiv.innerHTML = ''; // Clear wiki content initially
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
