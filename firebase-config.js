import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC-XszEU4WQvC4fXCBXb_MbRIlMz57xIHw",
  authDomain: "master-vault-a6240.firebaseapp.com",
  projectId: "master-vault-a6240",
  storageBucket: "master-vault-a6240.firebasestorage.app",
  messagingSenderId: "319823266506",
  appId: "1:319823266506:web:b710f88dc0ace4bb82aa33",
  measurementId: "G-VLZ73XB3VT"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
