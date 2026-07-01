
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "interviewiq-38a4f.firebaseapp.com",
  projectId: "interviewiq-38a4f",
  storageBucket: "interviewiq-38a4f.firebasestorage.app",
  messagingSenderId: "648118399865",
  appId: "1:648118399865:web:461c1d08540e9453dbf5a8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export { auth, provider }