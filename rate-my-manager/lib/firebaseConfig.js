import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider} from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDFzFFsmdqwLUoEaPSTcTp77Dd7TGdOO1U",
  authDomain: "ratemymanager-8e003.firebaseapp.com",
  projectId: "ratemymanager-8e003",
  storageBucket: "ratemymanager-8e003.firebasestorage.app",
  messagingSenderId: "901655084349",
  appId: "1:901655084349:web:1ead99f81dc3a465f21954",
  measurementId: "G-QD7WX8106P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getFirestore(app);
export const googleProvider = new GoogleAuthProvider(app).addScope('email');
export default app;