import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

// Firebase config (same as signup)
const firebaseConfig = {
  apiKey: "AIzaSyDGGnOfcAng_YjgGQSkvA9yVoiFNo5D5rg",
  authDomain: "trendwise-4841a.firebaseapp.com",
  projectId: "trendwise-4841a",
  storageBucket: "trendwise-4841a.appspot.com",
  messagingSenderId: "279602370612",
  appId: "1:279602370612:web:a13540161621bb24505261",
  measurementId: "G-8XF1RBTPV8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Login form submit
document.getElementById("submit").addEventListener("click", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
    window.location.href = "05_indexlogin.html"; // Redirect after login
  } catch (error) {
    alert("Login failed: " + error.message);
  }
});

// Show user info on auth state change
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User object:", user); // Debug

    document.querySelector('.right-panel p:nth-of-type(1)').innerHTML = `<strong>Name:</strong> ${user.displayName || "N/A"}`;
    document.querySelector('.right-panel p:nth-of-type(2)').innerHTML = `<strong>Email:</strong> ${user.email}`;
  } else {
    // User is signed out, you can redirect to login or clear UI
  }
});
