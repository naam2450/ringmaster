
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

// These values should be replaced with your actual Firebase project configuration
// from the Firebase Console: Project Settings -> General -> Your Apps
const firebaseConfig = {
  apiKey: "AIzaSyC2QKo1pblRV3CmZ83eK26xQ-JBOWxHTyU",
  authDomain: "proto-portfolio-wf.firebaseapp.com",
  projectId: "proto-portfolio-wf",
  storageBucket: "proto-portfolio-wf.firebasestorage.app",
  messagingSenderId: "15202950927",
  appId: "1:15202950927:web:39d94372bfd9e1e848e87a"
};

// Check if configuration is still at placeholders
export const isFirebaseConfigured = 
  firebaseConfig.projectId !== "YOUR_PROJECT_ID" && 
  firebaseConfig.apiKey !== "YOUR_API_KEY";

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
}

export { db };
