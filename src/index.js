import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './contexts/AuthContext';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

// TODO: Replace "YOUR_CLIENT_ID" with your actual PayPal Client ID.
// You can get this from your PayPal Developer Dashboard.
const initialOptions = {
  "client-id": "AaIfSFzhvENaRdyJ4RHIjc2PBWvrNTiWVtqIcmEhBdkt4h_bRdz2ETq6KBwAuV1cXIKT0sFeEJsF0fL7",
  intent: "subscription",
  vault:true
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PayPalScriptProvider options={initialOptions}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </PayPalScriptProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app-main, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
