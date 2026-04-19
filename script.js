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

// ❌ REMOVE Firebase Auth (you are not using it)
// import { getAuth } from "firebase-auth";
// const auth = getAuth();


// INIT
document.addEventListener('DOMContentLoaded', () => {

    if (document.querySelector('.login-container')) {
        initLogin();
    }

    if (document.querySelector('.dashboard-container')) {
        initDashboard();
    }
});


// ================= LOGIN =================
function initLogin() {

    const setupForm = document.getElementById('setup-form');
    const loginForm = document.getElementById('login-form');

    // CREATE MASTER PASSWORD (FIRST TIME)
    setupForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        const pass = document.getElementById('new-master').value;

        if (!pass) {
            alert("Enter password");
            return;
        }

        localStorage.setItem('masterPass', pass);

        alert("Vault Created!");
        window.location.reload(); // refresh to show login
    });

    // LOGIN
    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        const input = document.getElementById('master-password').value;
        const saved = localStorage.getItem('masterPass');

        if (!saved) {
            alert("First create account!");
            return;
        }

        if (input === saved) {
            window.location.href = "dashboard.html";
        } else {
            alert("Wrong password!");
        }
    });
}


// ================= DASHBOARD =================
function initDashboard() {

    const form = document.getElementById('password-form');
    const grid = document.getElementById('passwords-grid');
    const logoutBtn = document.getElementById('logout-btn');

    const userId = "local-user";

    // LOAD PASSWORDS
    const loadPasswords = async () => {
        try {
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
                    <p class="hidden-pass">••••••••</p>
                `;

                // COPY PASSWORD
                card.querySelector('.copy-btn').onclick = () => {
                    navigator.clipboard.writeText(data.password);
                    alert("Copied!");
                };

                // DELETE PASSWORD
                card.querySelector('.delete-btn').onclick = async () => {
                    await deleteDoc(doc(db, "passwords", d.id));
                    loadPasswords();
                };

                grid.appendChild(card);
            });

            console.log("Loaded:", snapshot.size);

        } catch (error) {
            console.error("Load error:", error);
        }
    };

    // SAVE PASSWORD
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const site = document.getElementById('site-name').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('site-password').value;

        if (!site || !username || !password) {
            alert("Fill all fields");
            return;
        }

        try {
            await addDoc(collection(db, "passwords"), {
                site,
                username,
                password,
                userId: userId
            });

            console.log("Saved ✅");

            form.reset();
            loadPasswords();

        } catch (error) {
            console.error("Save error:", error);
        }
    });

    // LOGOUT
    logoutBtn?.addEventListener('click', () => {
        window.location.href = "index.html";
    });

    loadPasswords();
}