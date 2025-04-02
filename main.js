import { auth } from './firebase.js';  // Importa Firebase Auth
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";  // Importa la funzione per il logout

let map; // Variabile globale per la mappa

// Funzione per mostrare la sezione selezionata
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Funzione per visualizzare la schermata di login se l'utente non è loggato
function checkUserStatus() {
    const user = auth.currentUser;
    if (user) {
        // Se l'utente è loggato, mostra la barra di navigazione e le altre sezioni
        showSection('home-section');
        document.getElementById('bottom-nav').style.display = 'block';  // Mostra la barra di navigazione
        loadUserProfile(user);
    } else {
        // Se l'utente non è loggato, nasconde la barra di navigazione e mostra solo il login
        showSection('login-section');
        document.getElementById('bottom-nav').style.display = 'none';  // Nascondi la barra di navigazione
    }
}

// Funzione per caricare il profilo dell'utente
function loadUserProfile(user) {
    // Mostra le informazioni dell'utente, come nome, saldo PA, etc.
    document.getElementById('user-name').textContent = user.displayName || 'Nome Cognome';
    document.getElementById('username').textContent = user.email || '@nomeutente';
    document.getElementById('pa-balance').textContent = "0 PA";  // Esegui il recupero del saldo PA da Firestore o altre fonti se necessario
    document.getElementById('badges').textContent = "Badge1, Badge2";  // Esegui il recupero dei badge da Firestore o altre fonti
    document.getElementById('activities').innerHTML = "<li>Attività 1 - 100 PA</li><li>Attività 2 - 50 PA</li>";  // Esegui il recupero delle attività
}

// Funzione per gestire il logout
function handleLogout() {
    signOut(auth).then(() => {
        // Pulisce i dati del profilo e mostra la schermata di login
        document.getElementById('user-name').textContent = '';
        document.getElementById('username').textContent = '';
        document.getElementById('pa-balance').textContent = '';
        document.getElementById('badges').textContent = '';
        document.getElementById('activities').innerHTML = '';
        
        showSection('login-section');  // Mostra la schermata di login dopo il logout
        document.getElementById('bottom-nav').style.display = 'none';  // Nascondi la barra di navigazione dopo il logout
    }).catch((error) => {
        console.error("Errore durante il logout: ", error);
    });
}

// Impostazione del menu di navigazione
document.getElementById('home-nav').addEventListener('click', () => {
    showSection('home-section');
});

document.getElementById('map-nav').addEventListener('click', () => {
    showSection('map-section');
    initMap(); // Inizializza la mappa solo se non esiste già
});

document.getElementById('profile-nav').addEventListener('click', () => {
    const user = auth.currentUser;
    if (user) {
        showSection('profile-section');
    } else {
        showSection('login-section'); // Se non loggato, mostra la schermata di login
    }
});

// Funzione per inizializzare la mappa OpenStreetMap
function initMap() {
    if (!map) { // Verifica se la mappa esiste già
        map = L.map('map-container', { zoomControl: false }).setView([37.5, 13.5], 8);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    }
}

// Aggiungi evento per il logout
document.getElementById('logout-btn').addEventListener('click', handleLogout);

// Controlla lo stato dell'utente quando la pagina è caricata
window.onload = () => {
    checkUserStatus();
};
