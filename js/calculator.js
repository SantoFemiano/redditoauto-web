/**
 * calculator.js
 * Logica pura di calcolo — nessun DOM, nessun side effect.
 * Tutte le funzioni sono esportabili e testabili in isolamento.
 */

/**
 * Calcola la rata mensile del finanziamento (formula francese).
 * @param {number} capitale  Importo finanziato (prezzo - anticipo)
 * @param {number} tassoAnnuo  Tasso annuo in percentuale (es. 7.5)
 * @param {number} mesi  Durata in mesi
 * @returns {number} rata mensile
 */
function calcolaRata(capitale, tassoAnnuo, mesi) {
  if (capitale <= 0 || mesi <= 0) return 0;
  const r = tassoAnnuo / 12 / 100;
  if (r === 0) return capitale / mesi;
  return (capitale * r * Math.pow(1 + r, mesi)) / (Math.pow(1 + r, mesi) - 1);
}

/**
 * Stima il bollo ACI basato sulla potenza in kW.
 * Aliquota media nazionale: €2.58/kW (primi 100 kW) + €3.87/kW oltre 100 kW.
 * @param {number} kw potenza del veicolo
 * @returns {number} bollo annuo stimato
 */
function stimaBolloAnnuo(kw) {
  if (!kw || kw <= 0) return 0;
  const soglia = 100;
  const aliquotaBase = 2.58;
  const aliquotaExtra = 3.87;
  if (kw <= soglia) return kw * aliquotaBase;
  return soglia * aliquotaBase + (kw - soglia) * aliquotaExtra;
}

/**
 * Calcola il costo totale mensile dell'auto.
 * @param {Object} params
 * @returns {Object} breakdown dettagliato
 */
function calcolaCostoMensile({ prezzoAuto, anticipo, durataMesi, tassoAnnuo, kw, assicurazioneAnnua, carburanteMensile, manutenzioneMensile }) {
  const capitale = Math.max(0, prezzoAuto - (anticipo || 0));
  const rata = calcolaRata(capitale, tassoAnnuo || 0, durataMesi);
  const bolloMensile = stimaBolloAnnuo(kw) / 12;
  const assicurazioneMensile = (assicurazioneAnnua || 0) / 12;
  const carburante = carburanteMensile || 0;
  const manutenzione = manutenzioneMensile || 0;

  const totaleMensile = rata + bolloMensile + assicurazioneMensile + carburante + manutenzione;

  return {
    rata,
    bolloMensile,
    assicurazioneMensile,
    carburante,
    manutenzione,
    totaleMensile
  };
}

/**
 * Calcola lo stipendio netto mensile minimo.
 * @param {number} costoMensile  Costo mensile totale auto
 * @param {number} percentuale  % max del reddito da dedicare all'auto (es. 35)
 * @returns {number} stipendio netto mensile consigliato
 */
function calcolaStipendioMinimo(costoMensile, percentuale) {
  if (percentuale <= 0) return 0;
  return costoMensile / (percentuale / 100);
}

/**
 * Restituisce un giudizio testuale basato sul rapporto costo/stipendio.
 * @param {number} costoMensile
 * @param {number} stipendio  Stipendio che l'utente dichiara (opzionale)
 * @param {number} percentuale
 * @returns {{ livello: string, testo: string }}
 */
function valuta(costoMensile, percentuale) {
  if (percentuale <= 25) return { livello: 'ok', testo: 'Ottima scelta! Dedicherai meno del 25% del reddito all\'auto: una situazione finanziariamente solida.' };
  if (percentuale <= 35) return { livello: 'ok', testo: 'Nella soglia consigliata. Rientri nella regola del 35%: l\'auto è sostenibile per la tua situazione.' };
  if (percentuale <= 45) return { livello: 'warn', testo: 'Attenzione: stai dedicando tra il 35% e il 45% del reddito. Valuta se ci sono margini per ridurre l\'anticipo o la durata.' };
  return { livello: 'ko', testo: 'Rischio elevato: oltre il 45% del reddito per l\'auto può compromettere la tua liquidità mensile. Considera un\'auto meno costosa o un anticipo più alto.' };
}
