// utilities.js - Helper functions and constants
export const $ = (s) => document.querySelector(s);
export const $$ = (s) => document.querySelectorAll(s);

export const fmtDate = (d) => new Date(d).toLocaleDateString('es-AR');
export const fmtTime = (d) => new Date(d).toLocaleTimeString('es-AR', {hour:'2-digit', minute:'2-digit'});
export const nowISO = () => new Date().toISOString();
export const toF = (c) => (c * 9/5 + 32).toFixed(1);
export const toC = (f) => ((f - 32) * 5/9).toFixed(1);
export const uid = () => Math.random().toString(36).slice(2, 9);

export const DB_KEY = 'ctp_enf_v2';
export const PAGE_SIZE = 5;

// Error handling utilities
export const handleError = (error, context = 'Unknown') => {
  console.error(`Error in ${context}:`, error);
  
  // For user-facing errors, show a friendly message
  if (error.message && error.message.includes('storage')) {
    alert('Error accessing local storage. Please try refreshing the page.');
  } else if (error.message && error.message.includes('parse')) {
    alert('Error processing data. The data may be corrupted.');
  } else {
    alert(`An error occurred in ${context}. Please try again.`);
  }
};

export const safeJSONParse = (str, fallback = null) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    handleError(error, 'JSON parsing');
    return fallback;
  }
};

export const safeLocalStorageGet = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? safeJSONParse(item, fallback) : fallback;
  } catch (error) {
    handleError(error, 'Local storage access');
    return fallback;
  }
};

export const safeLocalStorageSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    handleError(error, 'Local storage save');
    return false;
  }
};