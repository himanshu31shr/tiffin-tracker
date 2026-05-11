import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Dummy config for local emulator or real config for production
const firebaseConfig = {
  apiKey: "dummy-api-key",
  authDomain: "tiffin-tracker-0511.firebaseapp.com",
  projectId: "tiffin-tracker-0511",
  storageBucket: "tiffin-tracker-0511.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
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
