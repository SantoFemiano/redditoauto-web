/**
 * simulator.js
 * Simulatore di finanziamento: piano di ammortamento + confronto durate.
 * Dipende da: calculator.js (calcolaRata)
 */

// ── Genera piano di ammortamento francese completo ────────────────────
function generaPianoAmmortamento(capitale, tassoAnnuo, mesi) {
  const r = tassoAnnuo / 12 / 100;
  const rata = calcolaRata(capitale, tassoAnnuo, mesi);
  const piano = [];
  let debitoResiduo = capitale;

  for (let i = 1; i <= mesi; i++) {
    const quotaInteressi = r === 0 ? 0 : debitoResiduo * r;
    const quotaCapitale  = rata - quotaInteressi;
    debitoResiduo        = Math.max(0, debitoResiduo - quotaCapitale);
    piano.push({
      mese:             i,
      rata:             rata,
      quotaCapitale:    quotaCapitale,
      quotaInteressi:   quotaInteressi,
      debitoResiduo:    debitoResiduo
    });
  }
  return piano;
}

// ── Calcola riepilogo per una durata ────────────────────────────────
function calcolaRiepilogo(capitale, tassoAnnuo, mesi) {
  const rata          = calcolaRata(capitale, tassoAnnuo, mesi);
  const totalePagato  = rata * mesi;
  const totInteressi  = totalePagato - capitale;
  const taeg          = tassoAnnuo; // semplificazione orientativa
  return { mesi, rata, totalePagato, totInteressi, taeg };
}

// ── Helpers ──────────────────────────────────────────────────────
const fmtEur = n => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const fmtEur0 = n => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

// ── Stato simulatore ─────────────────────────────────────────────
let simPiani    = {}; // { mesi: piano[] }
let simAttivo   = null;

// ── Render KPI cards di confronto ───────────────────────────────
function renderKpi(riepilogos) {
  const panel = document.getElementById('simKpiContent');
  const empty = document.getElementById('simEmpty');
  empty.classList.add('hidden');
  panel.classList.remove('hidden');

  // Trova rata minima per badge
  const rataMin = Math.min(...riepilogos.map(r => r.rata));
  const intMin  = Math.min(...riepilogos.map(r => r.totInteressi));

  panel.innerHTML = riepilogos.map(r => {
    const isBestRata  = Math.abs(r.rata - rataMin) < 0.01;
    const isBestInt   = Math.abs(r.totInteressi - intMin) < 0.01;
    return `
    <div class="kpi-card animate-in" data-mesi="${r.mesi}">
      <div class="kpi-header">
        <span class="kpi-badge">${r.mesi} mesi</span>
        ${isBestRata ? '<span class="kpi-tag tag-green">↓ rata più bassa</span>' : ''}
        ${isBestInt  ? '<span class="kpi-tag tag-blue">↓ meno interessi</span>' : ''}
      </div>
      <div class="kpi-row">
        <span class="kpi-label">Rata mensile</span>
        <span class="kpi-value">${fmtEur(r.rata)}</span>
      </div>
      <div class="kpi-row">
        <span class="kpi-label">Totale interessi</span>
        <span class="kpi-value kpi-warn">${fmtEur(r.totInteressi)}</span>
      </div>
      <div class="kpi-row">
        <span class="kpi-label">Totale pagato</span>
        <span class="kpi-value">${fmtEur0(r.totalePagato)}</span>
      </div>
      <button class="btn btn-ghost kpi-btn" onclick="mostraPiano(${r.mesi})">Vedi piano →</button>
    </div>
    `;
  }).join('');
}

// ── Render tab del piano ammortamento ───────────────────────────
function renderTabs(mesiList) {
  const group = document.getElementById('simTabGroup');
  group.innerHTML = mesiList.map(m =>
    `<button class="sim-tab" data-mesi="${m}" onclick="mostraPiano(${m})">${m} mesi</button>`
  ).join('');
}

// ── Mostra piano specifico nella tabella ─────────────────────────
function mostraPiano(mesi) {
  simAttivo = mesi;
  const piano = simPiani[mesi];
  if (!piano) return;

  // Aggiorna tab attivo
  document.querySelectorAll('.sim-tab').forEach(t => {
    t.classList.toggle('sim-tab--active', parseInt(t.dataset.mesi) === mesi);
  });

  // Aggiorna titolo
  document.getElementById('simTableTitle').textContent = `Piano di ammortamento — ${mesi} mesi`;

  // Popola tabella
  const tbody = document.getElementById('amortBody');
  tbody.innerHTML = piano.map(row => `
    <tr>
      <td class="col-mese">${row.mese}</td>
      <td>${fmtEur(row.rata)}</td>
      <td class="col-cap">${fmtEur(row.quotaCapitale)}</td>
      <td class="col-int">${fmtEur(row.quotaInteressi)}</td>
      <td class="col-res">${fmtEur(row.debitoResiduo)}</td>
    </tr>
  `).join('');

  // Scroll alla tabella su mobile
  if (window.innerWidth < 900) {
    document.getElementById('simTableCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ── Evento Simula ───────────────────────────────────────────────
document.getElementById('btnSimula').addEventListener('click', function () {
  const capitale  = parseFloat(document.getElementById('simCapitale').value) || 0;
  const tassoAnnuo = parseFloat(document.getElementById('simTasso').value) || 0;

  if (capitale <= 0) {
    alert('Inserisci l\'importo da finanziare.');
    document.getElementById('simCapitale').focus();
    return;
  }

  const checkboxes = document.querySelectorAll('.durate-check-group input[type="checkbox"]:checked');
  if (checkboxes.length === 0) {
    alert('Seleziona almeno una durata da confrontare.');
    return;
  }

  const durate = Array.from(checkboxes).map(c => parseInt(c.value)).sort((a, b) => a - b);

  simPiani = {};
  const riepilogos = [];

  durate.forEach(mesi => {
    simPiani[mesi] = generaPianoAmmortamento(capitale, tassoAnnuo, mesi);
    riepilogos.push(calcolaRiepilogo(capitale, tassoAnnuo, mesi));
  });

  renderKpi(riepilogos);
  renderTabs(durate);
  mostraPiano(durate[0]);

  // Precompila campi calcolatore se vuoti
  if (!document.getElementById('prezzoAuto').value) {
    document.getElementById('prezzoAuto').value = capitale;
  }
  if (!document.getElementById('tasso').value) {
    document.getElementById('tasso').value = tassoAnnuo;
  }
});

// ── Sincronizzazione: se l'utente calcola nel calcolatore, precompila il simulatore ──
document.getElementById('btnCalcola').addEventListener('click', function () {
  const p = parseFloat(document.getElementById('prezzoAuto').value) || 0;
  const a = parseFloat(document.getElementById('anticipo').value)   || 0;
  const t = parseFloat(document.getElementById('tasso').value)      || 0;
  const capitale = p - a;
  if (capitale > 0 && !document.getElementById('simCapitale').value) {
    document.getElementById('simCapitale').value  = capitale;
    document.getElementById('simTasso').value     = t;
  }
}, true); // capture: gira prima del handler in app.js
