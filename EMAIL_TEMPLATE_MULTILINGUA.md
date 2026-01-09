# Template Email Multi-lingua per Firebase

## Soluzione Consigliata: Template Universale

Poiché Firebase Auth supporta solo UN template per tipo di email, la soluzione più semplice è creare un template che funzioni per tutte le lingue.

### Template Consigliato per Password Reset

**Oggetto Email:**
```
Reset your password for %APP_NAME% / Reimposta password per %APP_NAME% / Resetuj hasło dla %APP_NAME%
```

**Messaggio HTML:**
```html
<p>Hello / Ciao / Cześć,</p>

<p>You have requested to reset your password for your %APP_NAME% account (%EMAIL%).</p>
<p>Hai richiesto di reimpostare la password per il tuo account %APP_NAME% (%EMAIL%).</p>
<p>Poprosiłeś o zresetowanie hasła do konta %APP_NAME% (%EMAIL%).</p>

<p>Click the link below to reset your password:</p>
<p>Clicca sul link qui sotto per reimpostare la password:</p>
<p>Kliknij w link poniżej, aby zresetować hasło:</p>

<p><a href='%LINK%' style='color: #1976d2; text-decoration: none; font-weight: bold;'>%LINK%</a></p>

<p>If you didn't request this password reset, you can safely ignore this email.</p>
<p>Se non hai richiesto questo reset password, puoi ignorare questa email in sicurezza.</p>
<p>Jeśli nie prosiłeś o reset hasła, możesz bezpiecznie zignorować ten e-mail.</p>

<p>Thanks / Grazie / Dziękujemy,</p>
<p>Your %APP_NAME% team</p>
```

### Template Alternativo (Più Breve)

Se preferisci un template più corto:

**Oggetto:**
```
Reset password %APP_NAME% / Reimposta password %APP_NAME% / Resetuj hasło %APP_NAME%
```

**Messaggio:**
```html
<p>Hello / Ciao / Cześć,</p>

<p>Reset your password: <a href='%LINK%'>%LINK%</a></p>
<p>Reimposta password: <a href='%LINK%'>%LINK%</a></p>
<p>Resetuj hasło: <a href='%LINK%'>%LINK%</a></p>

<p>If you didn't request this, ignore this email.</p>
<p>Se non l'hai richiesto, ignora questa email.</p>
<p>Jeśli nie prosiłeś, zignoruj ten e-mail.</p>

<p>%APP_NAME%</p>
```

## Come Applicare il Template

1. Vai su Firebase Console > Authentication > Templates
2. Clicca su "Password reset"
3. Copia e incolla il template sopra nel campo "Message"
4. Personalizza l'oggetto come preferisci
5. Salva

## Vantaggi di Questa Soluzione

- ✅ **Gratuito** - Nessun costo aggiuntivo
- ✅ **Semplice** - Nessuna configurazione complessa
- ✅ **Funziona subito** - Applicabile immediatamente
- ✅ **Accessibile** - Gli utenti vedono la loro lingua

## Svantaggi

- ⚠️ Email più lunghe (ma più chiare)
- ⚠️ Non completamente localizzato (ma funzionale)

## Alternativa: Cloud Functions

Se vuoi email completamente localizzate, vedi la sezione 4 di `FIREBASE_EMAIL_SETUP.md` per usare Cloud Functions (gratuito fino a 2M invocazioni/mese).





