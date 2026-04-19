import { db } from './firebase-config.js';

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

import {
    getAuth,
    signOut
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

const auth = getAuth();

// INIT
document.addEventListener('DOMContentLoaded', () => {

    if (document.querySelector('.login-container')) {
        initLogin();
    }

    if (document.querySelector('.dashboard-container')) {
        initDashboard();
    }
});


// ================= LOGIN (FIXED SIMPLE SYSTEM) =================
function initLogin() {

    const setupForm = document.getElementById('setup-form');
    const loginForm = document.getElementById('login-form');

    // FIRST TIME SETUP
    setupForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        const pass = document.getElementById('new-master').value;

        localStorage.setItem('masterPass', pass);

        alert("Vault Created!");
        document.getElementById('setup-section').classList.add('hidden');
        document.getElementById('login-section').classList.remove('hidden');
    });

    // LOGIN
    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        const input = document.getElementById('master-password').value;
        const saved = localStorage.getItem('masterPass');

        if (input === saved) {
            window.location.href = "dashboard.html";
        } else {
            alert("Wrong password!");
        }
    });
}


// ================= DASHBOARD (FIXED) =================
function initDashboard() {

    const form = document.getElementById('password-form');
    const grid = document.getElementById('passwords-grid');
    const logoutBtn = document.getElementById('logout-btn');

    const userId = "local-user"; // simple system (no firebase auth)

    // LOAD PASSWORDS
    const loadPasswords = async () => {

        const q = query(collection(db, "passwords"), where("userId", "==", userId));
        const snapshot = await getDocs(q);

        grid.innerHTML = "";

        snapshot.forEach((d) => {
            const data = d.data();

            const card = document.createElement('div');
            card.className = "password-card";

            card.innerHTML = `
                <div class="card-header">
                    <h4>${data.site}</h4>
                    <div>
                        <button class="icon-btn copy-btn">📋</button>
                        <button class="icon-btn delete-btn">🗑️</button>
                    </div>
                </div>

                <p>${data.username}</p>
                <p>••••••••</p>
            `;

            // COPY
            card.querySelector('.copy-btn').onclick = () => {
                navigator.clipboard.writeText(data.password);
                alert("Copied!");
            };

            // DELETE
            card.querySelector('.delete-btn').onclick = async () => {
                await deleteDoc(doc(db, "passwords", d.id));
                loadPasswords();
            };

            grid.appendChild(card);
        });
    };

    // SAVE PASSWORD
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const site = document.getElementById('site-name').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('site-password').value;

        await addDoc(collection(db, "passwords"), {
            site,
            username,
            password,
            userId: userId
        });

        form.reset();
        loadPasswords();
    });

    // LOGOUT
    logoutBtn?.addEventListener('click', () => {
        window.location.href = "index.html";
    });

    loadPasswords();
}