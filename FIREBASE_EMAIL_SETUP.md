# Configurazione Email Firebase - Guida Gratuita

Questa guida spiega come configurare le email di Firebase per evitare che finiscano in spam e personalizzarle.

## 1. Personalizzare i Template Email (GRATUITO)

### Passo 1: Accedi alla Firebase Console
1. Vai su https://console.firebase.google.com
2. Seleziona il tuo progetto
3. Vai su **Authentication** > **Templates**

### Passo 2: Personalizza il Template "Password reset"
1. Clicca su **Password reset**
2. Personalizza:
   - **Subject**: Es. "Reimposta la tua password - PH4.1"
   - **Body**: Personalizza il testo dell'email
   - **Action URL**: Lascia il default o personalizza

### Passo 3: Suggerimenti per evitare spam
- Usa un **subject line chiaro e professionale**
- Evita parole come "FREE", "URGENT", "CLICK HERE" in maiuscolo
- Includi informazioni sul tuo brand/app
- Aggiungi un testo che spiega perché l'utente ha ricevuto l'email

### Esempio di Template Personalizzato:
```
Subject: Reimposta la tua password per PH4.1

Ciao,

Hai richiesto di reimpostare la password per il tuo account PH4.1.

Clicca sul link qui sotto per reimpostare la password:
%LINK%

Se non hai richiesto questa email, puoi ignorarla in sicurezza.

Cordiali saluti,
Il team PH4.1
```

## 2. Configurare un Dominio Personalizzato (GRATUITO se hai già un dominio)

**Nota**: Questo richiede un dominio che possiedi già. Se non hai un dominio, puoi acquistarne uno (circa €10-15/anno) o saltare questo passaggio.

### Passo 1: Aggiungi dominio personalizzato in Firebase
1. Vai su **Authentication** > **Settings** > **Authorized domains**
2. Aggiungi il tuo dominio personalizzato

### Passo 2: Configura DNS (GRATUITO)
Per evitare spam, configura questi record DNS sul tuo dominio:

#### SPF Record (TXT):
```
v=spf1 include:_spf.google.com ~all
```

#### DKIM Record (se supportato da Firebase)
Firebase gestisce automaticamente DKIM per i domini personalizzati.

### Passo 3: Verifica
- Firebase ti fornirà istruzioni specifiche per la verifica
- Potrebbero volerci 24-48 ore per la propagazione DNS

## 3. Lingua delle Email

### ⚠️ Limitazione Firebase Auth
**Firebase Authentication non supporta template multi-lingua direttamente nella console.** Puoi avere solo UN template per tipo di email.

### Opzione A: Template Universale (GRATUITO - Consigliato)
Crea un template che funzioni per tutte le lingue usando inglese come base (più universale):

**Subject:**
```
Reset your password for %APP_NAME%
```

**Body:**
```html
<p>Hello / Ciao / Cześć,</p>

<p>Follow this link to reset your %APP_NAME% password for your %EMAIL% account.</p>
<p>Segui questo link per reimpostare la password del tuo account %APP_NAME%.</p>
<p>Kliknij w ten link, aby zresetować hasło do konta %APP_NAME%.</p>

<p><a href='%LINK%'>%LINK%</a></p>

<p>If you didn't ask to reset your password, you can ignore this email.</p>
<p>Se non hai richiesto il reset della password, puoi ignorare questa email.</p>
<p>Jeśli nie prosiłeś o reset hasła, możesz zignorować ten e-mail.</p>

<p>Thanks / Grazie / Dziękujemy,</p>
<p>Your %APP_NAME% team</p>
```

### Opzione B: Cloud Functions (GRATUITO - Più Professionale)
Usa Cloud Functions per inviare email personalizzate basate sulla lingua. Vedi sezione 4 per i dettagli.

## 4. Best Practices per Evitare Spam (GRATUITO)

1. **Subject Line**: 
   - Evita maiuscole eccessive
   - Sii specifico e professionale
   - Includi il nome dell'app

2. **Contenuto Email**:
   - Spiega chiaramente perché l'utente ha ricevuto l'email
   - Includi informazioni di contatto
   - Aggiungi un link per annullare la richiesta se non l'hanno fatta loro

3. **Frequenza**:
   - Limita le richieste di reset (già gestito da Firebase)
   - Non inviare email non richieste

4. **Lista di controllo pre-invio**:
   - ✅ Subject line professionale
   - ✅ Contenuto chiaro e utile
   - ✅ Link di unsubscribe (se applicabile)
   - ✅ Informazioni di contatto
   - ✅ Branding consistente

## 4. Email Multi-lingua con Cloud Functions (GRATUITO)

Se vuoi email completamente personalizzate per lingua, puoi usare Cloud Functions. Firebase offre **2 milioni di invocazioni gratuite al mese**, più che sufficienti per la maggior parte delle app.

### Setup Cloud Functions per Email Personalizzate

#### Passo 1: Installa Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

#### Passo 2: Inizializza Functions
```bash
firebase init functions
# Scegli JavaScript o TypeScript
```

#### Passo 3: Installa dipendenze
```bash
cd functions
npm install nodemailer
npm install firebase-admin
```

#### Passo 4: Crea la Function
Crea `functions/index.js`:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
admin.initializeApp();

// Configura il transporter (usa SMTP di Firebase o un servizio esterno)
const transporter = nodemailer.createTransport({
  service: 'gmail', // o altro servizio
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.password,
  },
});

// Template email per lingua
const emailTemplates = {
  EN: {
    subject: 'Reset your password for PH4.1',
    body: (link) => `
      <p>Hello,</p>
      <p>Follow this link to reset your PH4.1 password:</p>
      <p><a href="${link}">${link}</a></p>
      <p>If you didn't ask to reset your password, you can ignore this email.</p>
      <p>Thanks,<br>Your PH4.1 team</p>
    `
  },
  IT: {
    subject: 'Reimposta la tua password per PH4.1',
    body: (link) => `
      <p>Ciao,</p>
      <p>Segui questo link per reimpostare la password di PH4.1:</p>
      <p><a href="${link}">${link}</a></p>
      <p>Se non hai richiesto il reset della password, puoi ignorare questa email.</p>
      <p>Grazie,<br>Il team PH4.1</p>
    `
  },
  PL: {
    subject: 'Resetuj hasło dla PH4.1',
    body: (link) => `
      <p>Cześć,</p>
      <p>Kliknij w ten link, aby zresetować hasło do PH4.1:</p>
      <p><a href="${link}">${link}</a></p>
      <p>Jeśli nie prosiłeś o reset hasła, możesz zignorować ten e-mail.</p>
      <p>Dziękujemy,<br>Zespół PH4.1</p>
    `
  }
};

// HTTP Function per inviare email di reset
exports.sendPasswordResetEmail = functions.https.onCall(async (data, context) => {
  const { email, lang = 'EN', resetLink } = data;
  
  if (!email || !resetLink) {
    throw new functions.https.HttpsError('invalid-argument', 'Email and resetLink are required');
  }

  const template = emailTemplates[lang] || emailTemplates.EN;

  const mailOptions = {
    from: 'noreply@yourdomain.com',
    to: email,
    subject: template.subject,
    html: template.body(resetLink),
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send email');
  }
});
```

#### Passo 5: Deploy
```bash
firebase deploy --only functions
```

#### Passo 6: Modifica il codice frontend
Dovrai modificare `AuthContext.jsx` per chiamare la Cloud Function invece di `sendPasswordResetEmail` diretto.

**Nota**: Questa soluzione richiede:
- Configurazione SMTP (puoi usare Gmail, SendGrid gratuito, ecc.)
- Deploy delle Cloud Functions
- Modifica del codice frontend

**Vantaggi**:
- ✅ Email completamente personalizzate per lingua
- ✅ Controllo totale sul contenuto
- ✅ Gratuito fino a 2M invocazioni/mese

### Opzione C: Usa il Template Default con Link Localizzato
Il codice già implementato passa `lang` nell'URL. L'email sarà in inglese, ma quando l'utente clicca il link, arriva alla tua app nella lingua corretta.

## 5. Monitoraggio

1. Controlla le statistiche in Firebase Console > Authentication > Templates
2. Monitora i tassi di consegna
3. Chiedi feedback agli utenti se le email finiscono in spam

## Note Importanti

- **Dominio personalizzato**: Richiede un dominio che possiedi (circa €10-15/anno se non ce l'hai)
- **SPF/DKIM**: Gratuito ma richiede accesso alle impostazioni DNS del dominio
- **Template personalizzati**: Completamente gratuito
- **Lingua**: Gestita automaticamente dal codice, ma puoi personalizzare i template nella console

## Soluzioni Alternative a Pagamento

Se le email continuano a finire in spam nonostante queste configurazioni, considera:
- **SendGrid** (piano gratuito disponibile, poi a pagamento)
- **Mailgun** (piano gratuito disponibile, poi a pagamento)
- **AWS SES** (molto economico, circa $0.10 per 1000 email)

Queste soluzioni richiedono integrazione nel codice e configurazione aggiuntiva.

