import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

const firebaseConfig = {
    apiKey: 'AIzaSyCJ8FO5oQbScKVgkq9i3aHljVVyW1cEqow',
    authDomain: 'fashion-hub-2ae46.firebaseapp.com',
    projectId: 'fashion-hub-2ae46',
    storageBucket: 'fashion-hub-2ae46.appspot.com', // ← FIXED
    messagingSenderId: '802064083370',
    appId: '1:802064083370:web:892a75f7f3ffa53e0523d3',
    measurementId: 'G-7JSEJYJ16Z',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
