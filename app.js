/* CareTrack Pro · Enfermería (modular vanilla JS + PWA) */
import { handleError } from './modules/utilities.js';
import { state, loadDB, seed } from './modules/dataManager.js';
import { applyLang } from './modules/i18n.js';
import { wireEventHandlers } from './modules/eventHandlers.js';
import { renderAll } from './modules/eventHandlers.js';

// Application initialization
function initializeApp() {
  try {
    // Load data and set up initial state
    loadDB();
    seed();

    // Set up event handlers
    wireEventHandlers();

    // Initial render
    renderAll();

    // Apply language settings
    applyLang(state);

    console.log('CareTrack Pro initialized successfully');
  } catch (error) {
    handleError(error, 'Application initialization');
  }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
