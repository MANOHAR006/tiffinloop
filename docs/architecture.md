# Architecture

Single static app in `app/`: `index.html`, `logic.js`, `data.json`.
No server, no dependencies. Open `index.html` or serve with `python3 -m http.server`.

- `data.json` is generated from `../tiffinloop_seed/*.csv` by `scripts/build_data.py`. Raw values kept; normalization happens at runtime so reviewers can see it.
- `logic.js` holds all decisions: `normCity()`, `normStatus()`, `parseDate()`, dropout detection, backup scoring, notify simulation, event log in localStorage.
- Two screens via tabs: Ops Tool and Leadership.
