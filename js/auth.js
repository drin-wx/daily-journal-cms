import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const form = document.getElementById("login-form");
const message = document.getElementById("login-message");

onAuthStateChanged(auth, user => {
  if (user && user.emailVerified) {
    location.href = "admin.html";
  }
});

form.addEventListener("submit", async e => {
  e.preventDefault();
  message.classList.add("hidden");
  const button = form.querySelector("button");
  button.disabled = true;
  button.textContent = "Signing in…";

  try {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const credential = await signInWithEmailAndPassword(auth, email, password);

    if (!credential.user.emailVerified) {
      await sendEmailVerification(credential.user);
      await signOut(auth);
      throw new Error("verification-required");
    }

    location.href = "admin.html";
  } catch (err) {
    console.error("Login error:", err);
    if (err.message === "verification-required") {
      message.textContent = "A verification email has been sent to your inbox. Please verify your email first, then sign in again.";
    } else if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
      message.textContent = "Invalid email or password. Please check your credentials.";
    } else if (err.code === "auth/operation-not-allowed") {
      message.textContent = "Email/Password sign-in is not enabled in your Firebase Console.";
    } else if (err.code === "auth/unauthorized-domain") {
      message.textContent = "This domain is not authorized in Firebase Authentication settings.";
    } else {
      message.textContent = `Login failed (${err.code || err.message}). Please try again.`;
    }
    message.classList.remove("hidden");
  } finally {
    button.disabled = false;
    button.textContent = "Sign in";
  }
});
