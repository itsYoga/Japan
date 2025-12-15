import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Config provided by user
const firebaseConfig = {
  apiKey: "REDACTED_API_KEY",
  authDomain: "japan-1d63a.firebaseapp.com",
  projectId: "japan-1d63a",
  storageBucket: "japan-1d63a.firebasestorage.app",
  messagingSenderId: "795363347874",
  appId: "1:795363347874:web:f5b0188226bc90d9b1f6fb",
  measurementId: "G-LWDR0WG8TL"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

export const logout = async () => {
  await signOut(auth);
};
