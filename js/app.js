/**
 * app.js
 * Controller principale — binding DOM, eventi, orchestrazione.
 * Dipende da: calculator.js, storage.js
 */

// ── Theme toggle ───────────────────────────────────────────
(function () {
  const root = document.documentElement;
  const btn = document.querySelector('[data-theme-toggle]');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let theme = prefersDark ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);

  function updateIcon(t) {
    if (!btn) return;
    btn.setAttribute('aria-label', t === 'dark' ? 'Passa alla modalità chiara' : 'Passa alla modalità scura');
    btn.innerHTML = t === 'dark'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
  updateIcon(theme);

  if (btn) {
    btn.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      updateIcon(theme);
    });
  }
})();

// ── Helpers DOM ────────────────────────────────────────────
const $ = id => document.getElementById(id);

function fmt(n) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

function getInputs() {
  return {
    prezzoAuto:          parseFloat($('prezzoAuto').value)          || 0,
    anticipo:            parseFloat($('anticipo').value)            || 0,
    durataMesi:          parseInt($('durataMesi').value)            || 36,
    tassoAnnuo:          parseFloat($('tasso').value)               || 0,
    kw:                  parseFloat($('kw').value)                  || 0,
    assicurazioneAnnua:  parseFloat($('assicurazione').value)       || 0,
    carburanteMensile:   parseFloat($('carburante').value)          || 0,
    manutenzioneMensile: parseFloat($('manutenzione').value)        || 0,
    percentuale:         parseInt($('percentualeReddito').value)    || 35
  };
}

function setInputs(dati) {
  if (!dati) return;
  if (dati.prezzoAuto)          $('prezzoAuto').value          = dati.prezzoAuto;
  if (dati.anticipo)            $('anticipo').value            = dati.anticipo;
  if (dati.durataMesi)          $('durataMesi').value          = dati.durataMesi;
  if (dati.tassoAnnuo !== undefined) $('tasso').value          = dati.tassoAnnuo;
  if (dati.kw)                  $('kw').value                  = dati.kw;
  if (dati.assicurazioneAnnua)  $('assicurazione').value       = dati.assicurazioneAnnua;
  if (dati.carburanteMensile)   $('carburante').value          = dati.carburanteMensile;
  if (dati.manutenzioneMensile) $('manutenzione').value        = dati.manutenzioneMensile;
  if (dati.percentuale) {
    $('percentualeReddito').value = dati.percentuale;
    $('percentualeLabel').textContent = dati.percentuale + '%';
  }
}

// ── Range slider live label ─────────────────────────────────
$('percentualeReddito').addEventListener('input', function () {
  $('percentualeLabel').textContent = this.value + '%';
});

// ── Calcola ─────────────────────────────────────────────────
$('btnCalcola').addEventListener('click', function () {
  const inputs = getInputs();

  if (!inputs.prezzoAuto || inputs.prezzoAuto <= 0) {
    alert('Inserisci il prezzo dell\'auto per continuare.');
    $('prezzoAuto').focus();
    return;
  }

  // Salva in localStorage
  salvaForm(inputs);

  // Calcoli
  const breakdown = calcolaCostoMensile(inputs);
  const stipendio = calcolaStipendioMinimo(breakdown.totaleMensile, inputs.percentuale);
  const giudizio  = valuta(breakdown.totaleMensile, inputs.percentuale);

  // Aggiorna risultato principale
  const valEl = $('valStipendio');
  valEl.textContent = fmt(stipendio);
  $('descStipendio').textContent =
    `Con il ${inputs.percentuale}% del reddito — costo totale mensile ${fmt(breakdown.totaleMensile)}`;
  valEl.classList.remove('animate-in');
  void valEl.offsetWidth; // reflow
  valEl.classList.add('animate-in');

  // Breakdown
  const lista = $('breakdownList');
  const voci = [
    { label: '🚗 Rata finanziamento',   value: breakdown.rata },
    { label: '📋 Bollo ACI (stimato)',   value: breakdown.bolloMensile },
    { label: '🛡️ Assicurazione',        value: breakdown.assicurazioneMensile },
    { label: '⛽ Carburante',            value: breakdown.carburante },
    { label: '🔧 Manutenzione',          value: breakdown.manutenzione },
  ].filter(v => v.value > 0);

  lista.innerHTML = voci.map(v =>
    `<li class="breakdown-item"><span class="label">${v.label}</span><span class="value">${fmt(v.value)}</span></li>`
  ).join('');

  if (voci.length === 0) {
    lista.innerHTML = '<li class="breakdown-item breakdown-placeholder">Nessun costo mensile inserito</li>';
  }

  $('breakdownTotal').innerHTML =
    `<span>Totale mensile</span><span>${fmt(breakdown.totaleMensile)}</span>`;

  // Verdict
  const cardVerdict = $('cardVerdict');
  cardVerdict.className = 'card verdict-card verdict-' + giudizio.livello;
  $('verdictText').textContent = giudizio.testo;

  // Scroll morbido su mobile
  if (window.innerWidth < 900) {
    $('resultsPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

// ── Reset ───────────────────────────────────────────────────
$('btnReset').addEventListener('click', function () {
  if (!confirm('Vuoi azzerare tutti i dati?')) return;
  resetForm();
  ['prezzoAuto','anticipo','tasso','kw','assicurazione','carburante','manutenzione'].forEach(id => $(id).value = '');
  $('durataMesi').value = 36;
  $('percentualeReddito').value = 35;
  $('percentualeLabel').textContent = '35%';
  $('valStipendio').textContent = '—';
  $('descStipendio').textContent = 'Inserisci i dati e calcola';
  $('breakdownList').innerHTML = '<li class="breakdown-item breakdown-placeholder">I dati appariranno dopo il calcolo</li>';
  $('breakdownTotal').innerHTML = '';
  const cardVerdict = $('cardVerdict');
  cardVerdict.className = 'card verdict-card';
  $('verdictText').textContent = '—';
});

// ── Ripristino dati salvati al caricamento ──────────────────
window.addEventListener('DOMContentLoaded', function () {
  const salvati = caricaForm();
  if (salvati) setInputs(salvati);
});
