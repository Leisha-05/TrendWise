import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

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

document.getElementById("submit").addEventListener("click", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const name = document.getElementById("name").value.trim();

  if (!name) {
    alert("Please enter your name.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // IMPORTANT: wait for updateProfile to finish before redirecting
    await updateProfile(userCredential.user, { displayName: name });

    alert(`Welcome, ${name}! Your account has been created.`);
    window.location.href = "02_login.html";
  } catch (error) {
    alert("Error: " + error.message);
  }
});
