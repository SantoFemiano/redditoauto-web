# RedditoAuto Web 🚗

Calcolatore di sostenibilità economica per l'acquisto di un'auto.
Inserted i dettagli del veicolo e scopri il reddito netto mensile minimo per permettertela senza stress.

## 🚀 Tech Stack

- **Frontend**: HTML5 + CSS3 + JavaScript Vanilla (zero dipendenze)
- **Hosting**: [Netlify](https://netlify.com) — deploy automatico da GitHub
- **Persistenza**: `localStorage` (dati salvati nel browser)

## 📐 Struttura progetto

```
redditoauto-web/
├── index.html          # Struttura HTML dell'app
├── css/
│   └── style.css       # Design system + stili
├── js/
│   ├── calculator.js   # Logica di calcolo pura (testabile)
│   ├── storage.js      # Gestione localStorage
│   └── app.js          # Controller DOM + eventi
├── netlify.toml        # Configurazione Netlify
└── README.md
```

## 🧮 Formule utilizzate

### Rata mensile (metodo francese)
```
R = C × [r(1+r)^n] / [(1+r)^n − 1]
```
dove `C` = capitale, `r` = tasso mensile, `n` = numero rate

### Bollo ACI stimato
- €2.58/kW per i primi 100 kW
- €3.87/kW per i kW eccedenti i 100

### Stipendio netto minimo
```
Stipendio = Costo mensile totale / (% reddito / 100)
```

## ▶️ Deploy su Netlify

1. Fai il fork/clone di questa repo
2. Vai su [netlify.com](https://netlify.com) → **Add new site → Import from Git**
3. Seleziona questa repo
4. Build command: **lascia vuoto**
5. Publish directory: **`.`**
6. Clicca **Deploy**

Ogni push su `main` triggera automaticamente un nuovo deploy.

## 📝 Note

I calcoli sono puramente orientativi e non costituiscono consulenza finanziaria.
