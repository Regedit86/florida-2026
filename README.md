# Florida e Cayman 2026

Pagina del viaggio collegata al foglio Google `CostiViaggio`. Chi entra con un account Google che ha accesso al foglio vede il programma e può aggiornare pagamenti e dettagli: le modifiche vanno direttamente nel foglio, quindi tutti vedono gli stessi dati.

Il foglio resta **privato**. Nel codice della pagina non c'è nessun dato: codici, importi e note arrivano solo dopo il login e restano salvati sul dispositivo per l'uso offline. Il tasto "Esci" li cancella.

## File

- `index.html`: la pagina (configurazione in cima allo script: `CLIENT_ID`, `SHEET_ID`, `SHEET_NAME`)
- `sw.js`: tiene in cache la pagina per l'uso offline

## 1. Pubblicare su GitHub Pages

1. Crea un repository (anche pubblico va bene: nel codice non ci sono dati), es. `florida-2026`.
2. Carica `index.html` e `sw.js` nella radice.
3. Settings → Pages → Source: *Deploy from a branch*, branch `main`, cartella `/ (root)`.
4. L'indirizzo sarà `https://<tuo-utente>.github.io/florida-2026/`.

## 2. Creare il login Google (una volta, circa 10 minuti)

1. Vai su <https://console.cloud.google.com/> e crea un progetto (es. "Florida 2026").
2. **API e servizi → Libreria** → cerca **Google Sheets API** → Abilita.
3. **API e servizi → Schermata consenso OAuth** (Google Auth Platform):
   - Tipo utente: **Esterno**
   - Nome app: "Florida 2026", email di supporto: la tua
   - Ambiti: aggiungi `https://www.googleapis.com/auth/spreadsheets`
   - **Utenti di test**: aggiungi la tua Gmail e quella di chi deve usare la pagina (es. Elena). Lascia l'app in modalità *Test*: così non serve la verifica di Google.
4. **API e servizi → Credenziali → Crea credenziali → ID client OAuth**:
   - Tipo: **Applicazione web**
   - Origini JavaScript autorizzate: `https://<tuo-utente>.github.io` (senza percorso e senza `/` finale)
   - Crea e copia l'**ID client** (finisce con `.apps.googleusercontent.com`).
5. In `index.html` sostituisci `INSERISCI-CLIENT-ID.apps.googleusercontent.com` con l'ID client e ricarica il file su GitHub.

L'ID client non è un segreto: può stare nel codice pubblico. Funziona solo dall'origine autorizzata e solo per gli utenti di test.

## 3. Condividere

Condividi il foglio Google (come **Editor**) con le Gmail che hai messo tra gli utenti di test. Chi ha solo accesso in lettura vede la pagina ma non può salvare modifiche.

Al primo accesso Google mostra l'avviso "Google non ha verificato questa app": tocca *Continua*. È normale per un'app in modalità Test.

## Come la pagina legge il foglio

Legge `CostiViaggio!A1:L120`. Regole:

- una riga con la **data** in colonna A apre un nuovo giorno; le righe sotto senza data appartengono allo stesso giorno
- le righe con "Totale…" in colonna F vengono saltate (i totali li ricalcola la pagina)
- la riga "SPESE GENERALI…" in colonna A apre le spese generali; "RIEPILOGO…" chiude; "Contanti" (colonna C) con il valore in D viene aggiunto al totale
- colonna D (Voce): un orario all'inizio (`8:30 …`) diventa l'orario; `Alloggio Luogo - Nome - Booking` viene diviso in tipo, nome e piattaforma; `Volo A–B` diventa `A → B`
- colonna K (Note): i link vengono mostrati come tasto **Mappa**; "cancellazione gratuita fino al gg/mm" finisce nelle scadenze di "Da sistemare"
- lo **stato** (Pagato, Parziale, Da pagare) la pagina lo calcola da Importo totale e Importo pagato, come la formula del foglio

Dalla pagina si possono modificare Voce, Importo totale, Importo pagato, Chi, Codice e Note. Prima di scrivere la pagina controlla che la riga contenga ancora la stessa voce: se nel frattempo qualcuno ha inserito righe nel foglio, ricarica i dati invece di scrivere nel posto sbagliato.

Le 5 notti alle Cayman (righe uguali in giorni consecutivi) vengono mostrate come un unico blocco; la modifica da quel blocco agisce sulla prima riga. Quando avete l'alloggio, conviene aggiornare il foglio direttamente.

Per **aggiungere** una voce nuova (es. un'escursione), inseriscila nel foglio: la pagina la mostra al prossimo "Aggiorna".
