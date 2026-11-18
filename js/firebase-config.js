// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByea4IwklN7pG91iYS42rcfB8GzCxh6Ec",
  authDomain: "my-firebase-project-fc889.firebaseapp.com",
  projectId: "my-firebase-project-fc889",
  storageBucket: "my-firebase-project-fc889.firebasestorage.app",
  messagingSenderId: "29069307610",
  appId: "1:29069307610:web:1f9c28ba6453ecfbc53fe3",
  measurementId: "G-LB1963WCGD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
