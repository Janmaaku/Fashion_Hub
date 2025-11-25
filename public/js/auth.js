import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

import { doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { updateUserUI } from './main.js';
import { auth, db } from '../firebase.js';

// Switch Login/Register Tabs
export function switchAuth(type) {
    document.querySelectorAll('.auth-tab').forEach((btn) => btn.classList.remove('active'));

    if (type === 'login') {
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('registerForm').classList.add('hidden');
        document.querySelectorAll('.auth-tab')[0].classList.add('active');
    } else {
        document.getElementById('registerForm').classList.remove('hidden');
        document.getElementById('loginForm').classList.add('hidden');
        document.querySelectorAll('.auth-tab')[1].classList.add('active');
    }
}

// Handle Login
export async function handleLogin(event) {
    event.preventDefault();

    const email = loginEmail.value;
    const password = loginPassword.value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch user document
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return alert('User data not found in Firestore!');
        }

        const userData = userSnap.data();

        // Store ALL user info in localStorage
        localStorage.setItem(
            'userData',
            JSON.stringify({
                uid: user.uid,
                ...userData,
            }),
        );

        // Redirect user based on role
        if (userData.userRole === 0) {
            window.location.href = 'index.html';
        } else if (userData.userRole === 1) {
            window.location.href = 'src/a/adminDashboard.html';
        } else {
            alert('Unknown user role. Please contact support.');
        }
        toggleAuthModal();
    } catch (err) {
        alert('Login Failed: ' + err.message);
    }
}

// Handle Register
export async function handleRegister(event) {
    event.preventDefault();

    const first = regFirst.value;
    const last = regLast.value;
    const dob = regDob.value;
    const email = regEmail.value;
    const password = regPassword.value;
    const confirm = regConfirm.value;

    if (password !== confirm) return alert('Passwords do NOT match!');

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('userCredential', userCredential);
        const user = userCredential.user;

        const userData = {
            firstName: first,
            lastName: last,
            dob: dob,
            email: email,
            userRole: 0, // 👈 DEFAULT: normal user
            createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, 'users', user.uid), userData);

        // Store ALL info in localStorage
        localStorage.setItem(
            'userData',
            JSON.stringify({
                uid: user.uid,
                ...userData,
            }),
        );

        updateUserUI();
        toggleAuthModal();

        // 🚀 Redirect based on userRole
        if (userData.userRole === 0) {
            window.location.href = 'index.php';
        } else if (userData.userRole === 1) {
            window.location.href = 'src/a/adminDashboard.html';
        } else {
            alert('Unknown user role. Please contact support.');
        }
    } catch (err) {
        alert('Registration Failed: ' + err.message);
    }
}
