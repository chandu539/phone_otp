import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDA1UkaPqeAgLeJ3l2B4vop8a0Ng7dDMS4",
  authDomain: "phone-otp-337db.firebaseapp.com",
  projectId: "phone-otp-337db",
  storageBucket: "phone-otp-337db.firebasestorage.app",
  messagingSenderId: "543127952422",
  appId: "1:543127952422:web:5d7dd86a3d080dce055ae7",
  measurementId: "G-V6DREXK779"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);