import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
const form = document.getElementById("login-form");
const message = document.getElementById("login-message");
onAuthStateChanged(auth, user => { if (user && user.emailVerified) location.href = "admin.html"; });
form.addEventListener("submit", async e => {
  e.preventDefault();
  message.classList.add("hidden");
  const button = form.querySelector("button");
  button.disabled = true; button.textContent = "Signing in…";
  try {
    const credential = await signInWithEmailAndPassword(auth, document.getElementById("email").value.trim(), document.getElementById("password").value);
    if (!credential.user.emailVerified) {
      await sendEmailVerification(credential.user);
      await signOut(auth);
      throw new Error("verification-required");
    }
    location.href = "admin.html";
  } catch(err) {
    message.textContent = err.message === "verification-required"
      ? "A verification email has been sent. Verify your email, then return here and sign in again."
      : "Login failed. Check your email and password, then try again.";
    message.classList.remove("hidden");
  } finally { button.disabled = false; button.textContent = "Sign in"; }
});
