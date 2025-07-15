import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBCJkD1zEtO2JcEZDTmhTVqF6q-wKWik_s",
  authDomain: "tomflix-cf132.firebaseapp.com",
  projectId: "tomflix-cf132",
  storageBucket: "tomflix-cf132.firebasestorage.app",
  messagingSenderId: "880823212666",
  appId: "1:880823212666:web:b05246bc40339bd46e39c3",
  measurementId: "G-GEN2X2ZTM2"
};

// Initialize Firebase only on client side
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

if (typeof window !== 'undefined') {
  // Initialize Firebase only if it hasn't been initialized yet
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

export { auth, db, storage };
export default app;