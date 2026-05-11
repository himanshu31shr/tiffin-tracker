import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Dummy config for local emulator or real config for production
const firebaseConfig = {
  apiKey: "AIzaSyDGUJ_UKgfQtar8S_5vYQXiLUyf1JcI1Ag",
  authDomain: "tiffin-tracker-0511.firebaseapp.com",
  projectId: "tiffin-tracker-0511",
  storageBucket: "tiffin-tracker-0511.firebasestorage.app",
  messagingSenderId: "868946374771",
  appId: "1:868946374771:web:6c9485337d426f2fcd3a06"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();

// Use emulators if running locally in dev mode
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, 'localhost', 8080);
  console.log("Firebase Emulators Connected");
}
