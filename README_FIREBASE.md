Firebase setup and local emulator

1) Create a Firebase project at https://console.firebase.google.com

2) Create `.env.local` in the project root (do NOT commit) with the following keys:

REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

3) Install Firebase SDK:

```
npm install firebase
```

4) Run emulators locally (optional):

```
npx firebase emulators:start --only auth,firestore,storage
```

This project includes `firebase.json` configured for local emulators.
