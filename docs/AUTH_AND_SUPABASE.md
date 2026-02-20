# Autenticazione e Supabase – guida dopo il refactor

## Cosa è stato fatto in progetto

- **Login**: solo tramite provider OAuth (Google, Facebook). Nessun campo email/password.
- **Primo accesso**: senza token si viene reindirizzati a `/login`; dopo il login si va alla home. Con token si accede alle pagine protette.
- **Logout**: esce dalla sessione e reindirizza a `/login`, stato locale azzerato.
- **Cambio / recupero password**: rimosso (accesso solo OAuth).
- **Cancellazione account**: chiamata all’edge function `admin-delete-account`; solo in caso di successo vengono eseguiti logout e redirect. Errori mostrati in Settings.
- **Foto profilo in Settings**: uso di `avatar_url` / `picture` / `image` da `user_metadata` con fallback e gestione errore di caricamento immagine.
- **Premium / Top Baker**: invariato; `subscriptionTier` viene da `public.users` e realtime; le pagine (ricette, contatti, ecc.) usano già questo valore.

## Cosa fare in Supabase (Dashboard)

### 1. Authentication > Providers

- Abilita **Google** e **Facebook** (e altri che vuoi).
- Configura le credenziali (Client ID / Secret) per ciascun provider.
- **Instagram**: Supabase **non** offre “Login with Instagram” come provider OAuth. Per un login “social” in più puoi usare solo i provider supportati (es. Apple, Discord, GitHub).

### 2. Authentication > URL Configuration

- **Site URL**: la URL della tua app (es. `https://tuodominio.com` o `http://localhost:3000` in sviluppo).
- **Redirect URLs**: aggiungi almeno:
  - `https://tuodominio.com/login` (produzione web)
  - `http://localhost:3000/login` (sviluppo)
  - Per app Capacitor (Android/iOS): aggiungi l’URL di deep link se ne usi uno (es. `it.marcobiasone://login`). Per configurarlo vedi sotto “App mobile”.

### 3. Cosa puoi disattivare / ignorare

- **Email (password)**: puoi lasciare “Email” attivo solo se ti serve per altro (es. magic link in futuro). Per il login non è più usato.
- **Recover password / Reset password**: non serve più; puoi ignorare o disattivare il flusso “Forgot password” dall’UI (è già stato rimosso dall’app).
- **Conferma email**: con OAuth spesso non è obbligatoria; configura come preferisci.

## Database

La struttura che hai indicato va bene:

- `users` (id, email, subscriptiontier, paypalsubscriptionid) – nessuna modifica necessaria.
- Tabelle collegate (`admin_messages`, `calendar_events`, `legal_acceptances`, `notes`) con `user_id` – l’edge function `admin-delete-account` le pulisce prima di cancellare l’utente.

Non servono colonne aggiuntive per il solo login OAuth. Se in futuro vorrai “display name” o “avatar URL” in DB (oltre a `user_metadata`), si può aggiungere.

## Edge functions

- **admin-delete-account**: elimina i dati dalle tabelle dipendenti, poi la riga in `public.users`, poi l’utente in Auth. Errori restituiti in modo esplicito; l’app mostra il messaggio in caso di fallimento.
- **paypal-confirm-subscription** / **paypal-cancel-subscription** / **paypal-webhook**: nessuna modifica richiesta per il refactor auth; continuano a usare il token dell’utente (session) e la tabella `users`.

Assicurati che le variabili d’ambiente delle edge function (Supabase URL, service role key, PayPal, ecc.) siano impostate nel progetto Supabase.

## App mobile (Capacitor – Android / iOS)

Per OAuth in app native:

1. **Redirect**: in Supabase, in **Redirect URLs**, aggiungi l’URL di ritorno dell’app (custom scheme o universal link), es. `it.marcobiasone://login`.
2. **Capacitor**: configura lo stesso scheme (es. in `capacitor.config.ts` o nei progetti nativi) in modo che il browser OAuth possa tornare nell’app.
3. Nel codice, il redirect usato è `window.location.origin + '/login'`. In web è la pagina web; in app, se usi una WebView con origin uguale allo scheme, funziona lo stesso. In alternativa si può usare un plugin (es. Capgo Social Login) o gestire il ritorno OAuth con deep link manuale.

Dopo aver configurato lo scheme e le redirect URL in Supabase, il flusso login/logout e l’uso di “premium baker” / “top baker” restano gli stessi.

## Riepilogo flusso

1. Utente non loggato → reindirizzato a `/login` → sceglie Google o Facebook → redirect OAuth → dopo il ritorno, sessione attiva e redirect a `/`.
2. Utente loggato → può usare tutte le pagine; in Settings vede il tier (Free / Top Baker / Premium Baker) e la foto da OAuth.
3. Logout → pulsante Logout in Settings → logout Supabase + clear stato → redirect a `/login`.
4. Cancellazione account → modale in Settings → chiamata a `admin-delete-account` → in successo logout e redirect a `/login`; in errore messaggio in pagina.
