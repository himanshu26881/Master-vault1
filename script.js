import { db, auth } from './firebase-config.js';

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
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";


// INIT
document.addEventListener('DOMContentLoaded', () => {

    if (document.querySelector('.login-container')) {
        initLogin();
    }

    if (document.querySelector('.dashboard-container')) {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                initDashboard(user);
            } else {
                window.location.href = "index.html";
            }
        });
    }
});


// ================= LOGIN =================
function initLogin() {

    const signupForm = document.getElementById('setup-form');
    const loginForm = document.getElementById('login-form');
    const forgotBtn = document.getElementById('forgot-btn');

    // SIGNUP
    signupForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('new-master').value;

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Account Created ✅");
            window.location.href = "dashboard.html";
        } catch (err) {
            alert(err.message);
        }
    });

    // LOGIN
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email-login').value;
        const password = document.getElementById('master-password').value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "dashboard.html";
        } catch (err) {
            alert("Login Failed: " + err.message);
        }
    });

    // 🔥 FORGOT PASSWORD
    forgotBtn?.addEventListener('click', async () => {
        const email = prompt("Enter your registered email:");

        if (!email) return;

        try {
            await sendPasswordResetEmail(auth, email);
            alert("Password reset link sent to your email 📩");
        } catch (err) {
            alert(err.message);
        }
    });
}


// ================= DASHBOARD =================
function initDashboard(user) {

    const form = document.getElementById('password-form');
    const grid = document.getElementById('passwords-grid');
    const logoutBtn = document.getElementById('logout-btn');

    const loadPasswords = async () => {
        const q = query(collection(db, "passwords"), where("userId", "==", user.uid));
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

            card.querySelector('.copy-btn').onclick = () => {
                navigator.clipboard.writeText(data.password);
                alert("Copied!");
            };

            card.querySelector('.delete-btn').onclick = async () => {
                await deleteDoc(doc(db, "passwords", d.id));
                loadPasswords();
            };

            grid.appendChild(card);
        });
    };

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const site = document.getElementById('site-name').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('site-password').value;

        await addDoc(collection(db, "passwords"), {
            site,
            username,
            password,
            userId: user.uid
        });

        form.reset();
        loadPasswords();
    });

    logoutBtn?.addEventListener('click', () => {
        signOut(auth);
    });

    loadPasswords();
}
