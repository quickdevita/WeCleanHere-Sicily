console.log("Firebase.js caricato!");  // Debug

// Importa le funzioni necessarie dagli SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";  // Aggiungi l'importazione di Firebase Auth
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";  // Importa Firestore

// Configurazione Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCqBWcT13bHY9TbwKgpKaEHVLaEMMfBYzg",
    authDomain: "wecleanhere-sicily.firebaseapp.com",
    projectId: "wecleanhere-sicily",
    storageBucket: "wecleanhere-sicily.firebasestorage.app",
    messagingSenderId: "497570727415",
    appId: "1:497570727415:web:f62649506602c441425af2",
    measurementId: "G-XVKQVN3CFZ"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inizializza l'autenticazione di Firebase
const auth = getAuth(app);

// Inizializza Firestore
const db = getFirestore(app);  // Crea l'istanza di Firestore

// Esporta i moduli necessari
export { auth, app, analytics, db };  // Esporta anche `db` per utilizzarlo altrove
