/**
 * storage.js
 * Gestione persistenza dati tramite localStorage.
 * Salva e ripristina i valori del form tra le sessioni.
 */

const STORAGE_KEY = 'redditoauto_v1';

/**
 * Salva i valori del form in localStorage.
 * @param {Object} dati
 */
function salvaForm(dati) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dati));
  } catch (e) {
    // Storage non disponibile (es. modalità privata con blocco) — nessun crash
    console.warn('RedditoAuto: localStorage non disponibile.', e);
  }
}

/**
 * Carica i valori salvati dal localStorage.
 * @returns {Object|null}
 */
function caricaForm() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('RedditoAuto: errore nel caricamento dati salvati.', e);
    return null;
  }
}

/**
 * Cancella i dati salvati.
 */
function resetForm() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('RedditoAuto: errore nel reset dati.', e);
  }
}
