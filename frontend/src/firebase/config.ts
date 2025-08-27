import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6ZT_Qoa6W5mKZHr8qrs066t3RtFZ4DZ4",
  authDomain: "thirdeye-d8a11.firebaseapp.com",
  projectId: "thirdeye-d8a11",
  storageBucket: "thirdeye-d8a11.firebasestorage.app",
  messagingSenderId: "401477335470",
  appId: "1:401477335470:web:a022dcc2eaddc08439303f",
  measurementId: "G-SSXX23NJP5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, analytics };
