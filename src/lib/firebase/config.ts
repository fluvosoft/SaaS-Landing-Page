// Firebase configuration
// This file will be populated with your Firebase project credentials

import { initializeApp, getApps } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';

// Firebase configuration object
// Replace these values with your Firebase project credentials
const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  databaseURL: import.meta.env.PUBLIC_FIREBASE_DATABASE_URL || '',
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID || '',
};

// Initialize Firebase (only if not already initialized)
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Realtime Database
export const db: Database = getDatabase(app);

export default app;
