import {
    doc,
    setDoc,
    updateDoc,
    serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    uploadString,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';
import { auth, db, storage } from '../../firebase.js';
import { toggleAuthModal } from './modal.js';

export let cart = [];

function saveCartToLocal() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from storage if exists
const savedCart = JSON.parse(localStorage.getItem('cart'));
if (savedCart) {
    cart = savedCart;
}

export function addToCart(product) {
    const existing = cart.find((x) => x.id === product.id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCartToLocal();
    updateCartUI();
}

export function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

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

    if (checkoutBtn) {
        const user = auth.currentUser;
        if (!user) {
            checkoutBtn.textContent = 'Login to Checkout';
            checkoutBtn.style.backgroundColor = '#ff9800';
        } else {
            checkoutBtn.textContent = 'Checkout';
            checkoutBtn.style.backgroundColor = '';
        }
    }
}

async function blobUrlToDataURL(blobUrl) {
    const res = await fetch(blobUrl);
    const blob = await res.blob();

    return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

export async function checkout() {
    const user = auth.currentUser;

    // Strong login check
    if (!user) {
        alert('Please login first before checking out.');
        toggleAuthModal();
        return;
    }

    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    const existingCheckout = localStorage.getItem('checkoutItems');

    // If order already exists, check for new items
    if (existingCheckout) {
        const checkoutData = JSON.parse(existingCheckout);
        const existingOrderNumber = checkoutData.orderNumber;
        const existingItems = checkoutData.items;

        // Compare cart items with existing checkout items
        const newItems = [];

        for (const cartItem of cart) {
            const existingItem = existingItems.find((item) => item.id === cartItem.id);

            // If item doesn't exist in checkout or quantity increased
            if (!existingItem) {
                newItems.push(cartItem);
            } else if (cartItem.quantity > existingItem.quantity) {
                // Add the difference in quantity
                newItems.push({
                    ...cartItem,
                    quantity: cartItem.quantity - existingItem.quantity,
                });
            }
        }

        // If no new items, just redirect to cart page
        if (newItems.length === 0) {
            window.location.href = 'src/b/cartPage.html';
            return;
        }

        // Upload new item images
        const uploadedNewItems = [];

        for (const item of newItems) {
            let imageUrl = item.image;

            if (item.image && item.image.startsWith('blob:')) {
                const timestamp = Date.now();
                const storageRef = ref(storage, `orders/${existingOrderNumber}/${timestamp}_${item.id}.jpg`);

                const dataURL = await blobUrlToDataURL(item.image);
                await uploadString(storageRef, dataURL, 'data_url');
                imageUrl = await getDownloadURL(storageRef);
            }

            uploadedNewItems.push({
                ...item,
                imageUrl: imageUrl,
            });
        }

        // Merge existing items with new items
        const mergedItems = [...existingItems];

        for (const newItem of uploadedNewItems) {
            const existingIndex = mergedItems.findIndex((item) => item.id === newItem.id);

            if (existingIndex !== -1) {
                // Update quantity if item already exists
                mergedItems[existingIndex].quantity += newItem.quantity;
            } else {
                // Add new item
                mergedItems.push(newItem);
            }
        }

        // Calculate new total
        const newTotal = mergedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        try {
            // Update Firestore with merged items
            await updateDoc(doc(db, 'orders', existingOrderNumber), {
                items: mergedItems,
                totalAmount: newTotal,
                updatedAt: serverTimestamp(),
            });

            // Update localStorage
            localStorage.setItem(
                'checkoutItems',
                JSON.stringify({
                    orderNumber: existingOrderNumber,
                    items: mergedItems,
                }),
            );
            localStorage.setItem('checkoutTotal', newTotal.toFixed(2));

            saveCartToLocal();

            // Close modal and redirect
            const modal = document.getElementById('cartModal');
            if (modal) modal.style.display = 'none';

            window.location.href = 'src/b/cartPage.html';
        } catch (error) {
            console.error('Update Order Error:', error);
            alert('Something went wrong while updating your order. Try again.');
        }

        return;
    }

    // NEW ORDER - Original checkout logic
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Generate order number
    const now = new Date();
    const dateStr =
        now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
    const randomNum = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
    const orderNumber = `ORD-${dateStr}-${randomNum}`;

    try {
        // Upload images
        const uploadedItems = [];

        for (const item of cart) {
            let imageUrl = item.image;

            if (item.image && item.image.startsWith('blob:')) {
                const timestamp = Date.now();
                const storageRef = ref(storage, `orders/${orderNumber}/${timestamp}_${item.id}.jpg`);

                const dataURL = await blobUrlToDataURL(item.image);
                await uploadString(storageRef, dataURL, 'data_url');
                imageUrl = await getDownloadURL(storageRef);
            }

            uploadedItems.push({
                ...item,
                imageUrl: imageUrl,
            });
        }

        // Save order to Firestore
        await setDoc(doc(db, 'orders', orderNumber), {
            userId: user.uid,
            userEmail: user.email,
            orderNumber: orderNumber,
            items: uploadedItems,
            totalAmount: total,
            orderStatus: 'Pending',
            paymentStatus: 'Unpaid',
            createdAt: serverTimestamp(),
        });

        // Save items locally for cartPage
        localStorage.setItem(
            'checkoutItems',
            JSON.stringify({
                orderNumber: orderNumber,
                items: uploadedItems,
            }),
        );
        localStorage.setItem('checkoutTotal', total.toFixed(2));

        saveCartToLocal();

        // Close modal and redirect
        const modal = document.getElementById('cartModal');
        if (modal) modal.style.display = 'none';

        window.location.href = 'b/cartPage.html';
    } catch (error) {
        console.error('Checkout Error:', error);
        alert('Something went wrong while placing your order. Try again.');
    }
}

export function toggleCart() {
    const modal = document.getElementById('cartModal');
    if (!modal) return;

    console.log('modal', modal);
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';

    if (modal.style.display === 'block') {
        updateCartUI();
    }
}

// Listen to auth state changes and update UI
auth.onAuthStateChanged((user) => {
    updateCartUI();
});
