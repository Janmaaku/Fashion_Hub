import { displayProducts, products, filterProducts } from './products.js';
import { addToCart, checkout, toggleCart } from './cart.js';
import { switchAuth, handleLogin, handleRegister } from './auth.js';
import { moveCarousel, goToSlide } from './carousel.js';
import { toggleAuthModal } from './modal.js';
import { initializePayNow, loadCheckoutPage } from './checkout.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { auth } from '../../firebase.js';

// Expose functions to HTML
window.switchAuth = switchAuth;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.addToCart = (id) => addToCart(products.find((p) => p.id === id));
window.toggleCart = toggleCart;
window.toggleAuthModal = toggleAuthModal;
window.filterProducts = filterProducts;
window.moveCarousel = moveCarousel;
window.goToSlide = goToSlide;
window.checkout = checkout;

// Initial load
displayProducts(products);

// ✅ UPDATE NAV UI
export function updateUserUI() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const authBtn = document.getElementById('authBtn'); // FIXED SELECTOR
    const dropdown = document.getElementById('userDropdown');

    if (userData && userData.firstName) {
        // Show the user's name
        authBtn.textContent = userData.firstName;

        // Show/hide dropdown
        authBtn.onclick = (e) => {
            e.stopPropagation(); // Prevent closing immediately
            dropdown.classList.toggle('hidden');
        };

        // Logout
        document.getElementById('logoutBtn').onclick = () => {
            signOut(auth);
            localStorage.clear(); // optional
            location.reload(); // refresh UI
            localStorage.removeItem('userData');
            dropdown.classList.add('hidden');
            authBtn.textContent = '👤';
            authBtn.onclick = () => toggleAuthModal();
        };
    } else {
        // Default UI
        authBtn.textContent = '👤';
        authBtn.onclick = () => toggleAuthModal();
    }
}

// ✅ Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('userDropdown');
    const authBtn = document.getElementById('authBtn');

    if (!authBtn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add('hidden');
    }
});

// Run UI update at startup
document.addEventListener('DOMContentLoaded', () => {
    updateUserUI();
});

initializePayNow();

document.addEventListener('DOMContentLoaded', () => {
    const payNowBtn = document.getElementById('payNowBtn');
    loadCheckoutPage();

    if (payNowBtn) {
        payNowBtn.addEventListener('click', () => {
            initializePayNow(); // 🔥 Only runs on click
        });
    }
});
