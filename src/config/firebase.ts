import { getApps, getApp, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCNZt4WXRw0fv3qdUui_XPQ7DjUQiBXvJU",
  authDomain: "dzialkizamniej-fa3d5.firebaseapp.com",
  projectId: "dzialkizamniej-fa3d5",
  storageBucket: "dzialkizamniej-fa3d5.firebasestorage.app",
  messagingSenderId: "822114607090",
  appId: "1:822114607090:web:00a77bc83ca8448e9f556b"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);

export const ADMIN_EMAIL = 'contact@mapmaker.online';