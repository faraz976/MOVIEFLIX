import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { FirebaseSettings } from '../types';

export const DEFAULT_FIREBASE_SETTINGS: FirebaseSettings = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || '',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'movieflix-demo.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'movieflix-demo',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'movieflix-demo.appspot.com',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.VITE_FIREBASE_APP_ID || '',
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

export function initFirebase(config: FirebaseSettings = DEFAULT_FIREBASE_SETTINGS) {
  if (!config.apiKey || config.apiKey === 'MY_FIREBASE_API_KEY') {
    // Config not filled yet, return null for graceful local storage fallback
    return { app: null, auth: null, db: null };
  }

  try {
    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApp();
    }
    auth = getAuth(app);
    db = getFirestore(app);
    return { app, auth, db };
  } catch (error) {
    console.warn('Firebase initialization warning:', error);
    return { app: null, auth: null, db: null };
  }
}

export function getFirebaseInstance() {
  return initFirebase();
}
