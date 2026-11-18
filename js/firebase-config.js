import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyByea4IwklN7pG91iYS42rcfB8GzCxh6Ec",
  authDomain: "my-firebase-project-fc889.firebaseapp.com",
  projectId: "my-firebase-project-fc889",
  storageBucket: "my-firebase-project-fc889.firebasestorage.app",
  messagingSenderId: "29069307610",
  appId: "1:29069307610:web:1f9c28ba6453ecfbc53fe3",
  measurementId: "G-LB1963WCGD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
