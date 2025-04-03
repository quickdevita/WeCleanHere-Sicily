import { auth, db } from './firebase.js';  // Importa Firebase Auth e Firestore
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";  // Importa le funzioni per login e logout

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
    auth.onAuthStateChanged(user => {
        if (user) {
            showSection('home-section');
            document.getElementById('bottom-nav').style.display = 'block';
            loadUserProfile(user);
        } else {
            showSection('login-section');
            document.getElementById('bottom-nav').style.display = 'none';
        }
    });
}

// Funzione per caricare il profilo dell'utente da Firestore
async function loadUserProfile(user) {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        const userData = userSnap.data();
        document.getElementById('user-name').textContent = `${userData.nome} ${userData.cognome}` || 'Nome Cognome';
        
        // Mostra il tipo di profilo (Volontario o Sostenitore)
        document.getElementById('role').textContent = userData.ruolo ? userData.ruolo.charAt(0).toUpperCase() + userData.ruolo.slice(1) : 'Ruolo non definito';

        document.getElementById('pa-balance').textContent = userData.saldoPA ? `${userData.saldoPA} PA` : "0 PA";
        document.getElementById('badges').textContent = userData.badge ? userData.badge.join(", ") : "Nessun badge";
        document.getElementById('activities').innerHTML = userData.attivita ? userData.attivita.map(att => `<li>${att.tipo} - ${att.paGuadagnati} PA</li>`).join('') : "<li>Nessuna attività completata</li>";
    } else {
        console.log("Nessun documento trovato per l'utente");
    }
}

// Funzione per gestire il logout
function handleLogout() {
    signOut(auth).then(() => {
        document.getElementById('user-name').textContent = '';
        document.getElementById('pa-balance').textContent = '';
        document.getElementById('badges').textContent = '';
        document.getElementById('activities').innerHTML = '';
        document.getElementById('role').textContent = '';  // Resetta il ruolo durante il logout
        showSection('login-section');
        document.getElementById('bottom-nav').style.display = 'none';
    }).catch((error) => {
        console.error("Errore durante il logout: ", error);
    });
}

// Impostazione del menu di navigazione
document.getElementById('home-nav').addEventListener('click', () => showSection('home-section'));
document.getElementById('map-nav').addEventListener('click', () => {
    showSection('map-section');
    document.getElementById('bottom-nav').style.display = 'block';
    if (!map) {
        initMap();
    } else {
        setTimeout(() => map.invalidateSize(), 300);
    }
});
document.getElementById('profile-nav').addEventListener('click', () => {
    const user = auth.currentUser;
    user ? showSection('profile-section') : showSection('login-section');
});

// Funzione per inizializzare la mappa
function initMap() {
    if (!map) {
        map = L.map('map-container', { zoomControl: false }).setView([37.5, 13.5], 8);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    }
}

// Aggiungi evento per il logout
document.getElementById('logout-btn').addEventListener('click', handleLogout);

document.getElementById('register-link').addEventListener('click', () => showSection('register-section'));
document.getElementById('login-link').addEventListener('click', () => showSection('login-section'));

// Gestione della registrazione
document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Ottieni i dati dal modulo di registrazione
    const nome = document.getElementById('name').value;
    const cognome = document.getElementById('surname').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const dataNascita = document.getElementById('dob').value;
    const telefono = document.getElementById('phone').value;
    const citta = document.getElementById('city').value;
    const ruolo = document.getElementById('role').value;  // "volontario" o "sostenitore"

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Aggiungi i dati al Firestore
        await setDoc(doc(db, "users", user.uid), {
            nome,
            cognome,
            email,
            dataNascita,
            telefono,
            citta,
            ruolo,
            saldoPA: 0,  // Imposta il saldo iniziale
            attivita: [],
            badge: []
        });

        // Ritorna alla schermata di login
        showSection('login-section');
    } catch (error) {
        console.error("Errore durante la registrazione: ", error);
    }
});

// Gestione del login
document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        showSection('home-section');
        document.getElementById('bottom-nav').style.display = 'block';
    } catch (error) {
        console.error("Errore durante il login: ", error);
    }
});

// Controlla lo stato dell'utente al caricamento della pagina
window.onload = () => checkUserStatus();
