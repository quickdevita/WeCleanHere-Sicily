// Importazione Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-analytics.js";

// Configurazione Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBDnDVpqLDwfCZSkkwKXxImMl0Yoajtr4Y",
    authDomain: "wecleansicily.firebaseapp.com",
    projectId: "wecleansicily",
    storageBucket: "wecleansicily.firebasestorage.app",
    messagingSenderId: "810749768712",
    appId: "1:810749768712:web:d6551fa8d408baf5288dbd",
    measurementId: "G-BZ54KPSBD1"
};

// Inizializzazione di Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Funzione per mostrare una sezione specifica
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Funzione di registrazione dell'utente
async function registerUser() {
    const firstname = document.getElementById('register-firstname').value;
    const lastname = document.getElementById('register-lastname').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Salvataggio dei dati utente nel Firestore
        await setDoc(doc(db, "users", user.uid), {
            firstname: firstname,
            lastname: lastname,
            email: email,
            userType: 'volunteer' // Puoi aggiungere una logica per scegliere tra 'volunteer' o 'supporter'
        });

        alert("Registrazione completata!");
        loginUser(); // Dopo la registrazione, fai il login automaticamente
    } catch (error) {
        console.error("Errore nella registrazione: ", error);
        alert('Errore nella registrazione: ' + error.message); // Mostra l'errore all'utente
    }
}

// Funzione di login
async function loginUser() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Recupera i dati dell'utente dal Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();

            // Salva i dati dell'utente nel localStorage
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('userData', JSON.stringify(userData));

            showProfile(userData); // Mostra il profilo dell'utente
            showSection('home-section'); // Mostra la home
            document.getElementById('bottom-nav').style.display = 'block'; // Mostra la barra di navigazione
        } else {
            alert("Nessun dato trovato per l'utente");
        }
    } catch (error) {
        console.error("Errore nel login: ", error);
        alert('Errore nel login: ' + error.message); // Mostra l'errore all'utente
    }
}

// Funzione per visualizzare il profilo
function showProfile(userData) {
    document.getElementById('user-name').textContent = `${userData.firstname} ${userData.lastname}`;
    document.getElementById('username').textContent = `@${userData.firstname.toLowerCase()}`;
    document.getElementById('pa-balance').textContent = userData.paBalance || "0 PA"; // Aggiungi la logica per i punti PA
    document.getElementById('badges').textContent = userData.badges.join(', ') || "Nessun badge"; // Aggiungi logica per i badge
    showSection('profile-section');
}

// Funzione per controllare se l'utente è loggato
function checkUserLogin() {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn === 'true') {
        const userData = JSON.parse(localStorage.getItem('userData'));
        showProfile(userData); // Mostra il profilo
        showSection('home-section'); // Mostra la home
        document.getElementById('bottom-nav').style.display = 'block'; // Mostra la barra di navigazione
    } else {
        showSection('login-section'); // Mostra la sezione di login
        document.getElementById('bottom-nav').style.display = 'none'; // Nascondi la barra di navigazione
    }
}

// Funzione per inizializzare la mappa OpenStreetMap
function initMap() {
    const map = L.map('map-container', {
        zoomControl: false // Disabilita i controlli di zoom predefiniti
    }).setView([37.5, 13.5], 8); // Coordinata della Sicilia

    // Aggiungi il layer della mappa OSM
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

// Eventi per la navigazione
document.getElementById('home-nav').addEventListener('click', () => {
    showSection('home-section');
});

document.getElementById('map-nav').addEventListener('click', () => {
    showSection('map-section');
    initMap();  // Funzione per inizializzare la mappa
});

document.getElementById('profile-nav').addEventListener('click', () => {
    showSection('profile-section');
});

// Eventi per il login e la registrazione
document.getElementById('login-btn').addEventListener('click', loginUser);
document.getElementById('register-btn').addEventListener('click', registerUser);

// Gestione della navigazione tra login e registrazione
document.getElementById('go-to-register').addEventListener('click', () => {
    showSection('register-section');
});

document.getElementById('go-to-login').addEventListener('click', () => {
    showSection('login-section');
});

// Verifica se l'utente è loggato al caricamento della pagina
window.addEventListener('DOMContentLoaded', checkUserLogin);
