# RedditoAuto 🚗

> **Quanto ti costa davvero quella macchina?**  
> Calcola il reddito netto mensile minimo per permetterti l'auto che desideri — rata, bollo, assicurazione e carburante in un colpo solo.

🔗 **[Demo live → redditoauto.netlify.app](https://redditoauto.netlify.app/)**

---

## ✨ Funzionalità

### 🧮 Calcolatore reddito
- Inserisci prezzo auto, anticipo, durata e tasso di finanziamento
- Stima automatica del bollo ACI in base ai kW del veicolo
- Calcolo del costo mensile totale (rata + bollo + assicurazione + carburante + manutenzione)
- Slider configurabile per la **regola del 35%** (percentuale massima del reddito da destinare all'auto)
- Valutazione finale con giudizio di sostenibilità

### 📊 Simulatore di finanziamento
- Piano di ammortamento completo (metodo francese)
- Confronto multi-durata (24 / 36 / 48 / 60 / 72 mesi) in un'unica vista
- KPI riassuntivi per ogni durata: rata mensile, totale interessi, costo complessivo
- Tabella interattiva con quota capitale, quota interessi e debito residuo mese per mese

### 🎨 UX & Accessibilità
- Dark mode con toggle persistente
- Accessibilità: markup semantico HTML5, `aria-live`, `aria-label`, skip link
- Persistenza dati via `localStorage` — i valori vengono salvati tra le sessioni
- Layout responsive per desktop e mobile

---

## 🚀 Tech Stack

| Layer | Tecnologia |
|-------|------------|
| Frontend | HTML5 · CSS3 · JavaScript Vanilla (zero dipendenze) |
| Hosting | [Netlify](https://netlify.com) — deploy automatico da GitHub |
| Persistenza | `localStorage` (client-side) |

---

## 📐 Struttura progetto

```
redditoauto-web/
├── index.html          # Struttura HTML semantica dell'app
├── css/
│   └── style.css       # Design system + dark mode + responsive
├── js/
│   ├── calculator.js   # Logica di calcolo pura (testabile)
│   ├── storage.js      # Gestione localStorage
│   ├── app.js          # Controller DOM + gestione eventi
│   └── simulator.js    # Simulatore piano ammortamento
├── netlify.toml        # Configurazione Netlify
└── README.md
```

---

## 🧮 Formule utilizzate

### Rata mensile — Ammortamento francese (quota costante)
```
R = C × [r(1+r)^n] / [(1+r)^n − 1]
```
dove `C` = capitale finanziato, `r` = tasso mensile (annuo/12), `n` = numero rate

### Bollo ACI stimato
- €2.58/kW per i primi 100 kW
- €3.87/kW per ogni kW eccedente i 100

### Stipendio netto minimo
```
Stipendio = Costo mensile totale / (% reddito / 100)
```

---

## ▶️ Avvio in locale

Nessuna dipendenza, nessun build step. Basta aprire il file direttamente:

```bash
git clone https://github.com/SantoFemiano/redditoauto-web.git
cd redditoauto-web
open index.html   # oppure usa Live Server in VS Code
```

---

## 📝 Note

I calcoli sono puramente orientativi e non costituiscono consulenza finanziaria. Il simulatore utilizza il metodo di ammortamento francese a tasso fisso.

---

*Progetto sviluppato da [Santo Femiano](https://github.com/SantoFemiano)*
