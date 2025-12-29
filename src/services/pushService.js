// Push service scaffold (web + Capacitor/native)
// For web: requires Firebase Messaging setup and `public/firebase-messaging-sw.js`.
// For native: use Capacitor Push Notifications plugin and configure FCM.

import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { messaging } from './firebase';

export const requestWebPushToken = async (vapidKey) => {
  try {
    const m = getMessaging();
    const token = await getToken(m, { vapidKey });
    return token;
  } catch (err) {
    console.warn('Failed to get web push token', err);
    return null;
  }
};

export const onForegroundMessage = (callback) => {
  const m = getMessaging();
  onMessage(m, (payload) => {
    callback(payload);
  });
};

/*
Notes:
- To fully enable web push, create `public/firebase-messaging-sw.js` and configure firebase-messaging.
- For native apps (Capacitor), install `@capacitor/push-notifications` and follow platform setup.
*/
