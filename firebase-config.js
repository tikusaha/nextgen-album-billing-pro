/*
  NextGen Album Billing Pro - Firebase Cloud Database Config
  ---------------------------------------------------------
  1) Create a Firebase project.
  2) Create a Web App in Firebase.
  3) Copy your Firebase config below.
  4) Set businessId to a unique id for your business.

  Important: This file contains Firebase public config, NOT a secret key.
  Do not put GitHub Personal Access Tokens or private keys in frontend code.
*/

window.NGAB_FIREBASE_CONFIG = {
  enabled: false, // change to true after adding your real Firebase config
  businessId: "nextgen-album-billing-pro",
  firebaseConfig: {
    apiKey: "PASTE_FIREBASE_API_KEY",
    authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
    projectId: "PASTE_PROJECT_ID",
    storageBucket: "PASTE_PROJECT_ID.appspot.com",
    messagingSenderId: "PASTE_SENDER_ID",
    appId: "PASTE_APP_ID"
  }
};
