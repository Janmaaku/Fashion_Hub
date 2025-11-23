import { addDoc, collection, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { auth, db } from '../../firebase.js';

export let cart = [];

export function addToCart(product) {
    const existing = cart.find((x) => x.id === product.id);
    if (existing) existing.quantity++;
    else cart.push({ ...product, quantity: 1 });

    updateCartUI();
}

export function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');

    cartItems.innerHTML = '';
    let total = 0;
    let itemCount = 0;

    cart.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        itemCount += item.quantity;
        total += itemTotal;

        cartItems.innerHTML += `
            <div class="cart-item">
                <div><strong>${item.name}</strong><br>₱${item.price} × ${item.quantity}</div>
                <div>₱${itemTotal.toFixed(2)}</div>
            </div>
        `;
    });

    cartCount.textContent = itemCount;
    cartTotal.textContent = `Total: ₱${total.toFixed(2)}`;
}

export async function checkout() {
    const user = auth.currentUser;

    if (!user) {
        alert('Please login first before checking out.');
        return;
    }

    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    try {
        const orderRef = await addDoc(collection(db, 'orders'), {
            userId: user.uid,
            items: cart,
            totalAmount: total,
            orderStatus: 'Pending',
            paymentStatus: 'Unpaid',
            createdAt: serverTimestamp(),
        });

        console.log('Order saved with ID:', orderRef.id);

        // Fix image paths before saving
        const cleanedItems = cart.map((item) => ({
            ...item,
            image: item.image?.replace(/^src\/.*public\/|^src\/|^b\//, ''), // remove wrong prefixes
        }));

        // ⬇️ Save items to localStorage before clearing cart
        localStorage.setItem('checkoutItems', JSON.stringify(cleanedItems));
        localStorage.setItem('checkoutTotal', total.toFixed(2));

        // Clear cart
        cart.length = 0;
        updateCartUI();

        // Close modal
        document.getElementById('cartModal').style.display = 'none';

        // Redirect to cartPage.html
        window.location.href = 'src/b/cartPage.html';
    } catch (error) {
        console.error('Checkout Error:', error);
        alert('Something went wrong while placing your order. Try again.');
    }
}

export function toggleCart() {
    const modal = document.getElementById('cartModal');
    console.log('modal', modal);

    if (!modal) return;

    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}
