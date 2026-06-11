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

## 📝 Note

I calcoli sono puramente orientativi e non costituiscono consulenza finanziaria.
