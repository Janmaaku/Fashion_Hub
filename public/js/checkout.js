import { doc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from '../firebase.js';

// ✅ Exported function so it can be imported in main.js
export function loadCheckoutPage() {
    const cart = JSON.parse(localStorage.getItem('checkoutItems')) || [];
    const total = parseFloat(localStorage.getItem('checkoutTotal')) || 0;

    const cartContainer = document.getElementById('cartItemsContainer');
    const subtotalEl = document.getElementById('subtotalAmount');
    const shippingEl = document.getElementById('shippingAmount');
    const taxEl = document.getElementById('taxAmount');
    const totalEl = document.getElementById('orderTotal');

    if (!cartContainer) return; // Prevent running on non-checkout pages

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div style="padding: 40px; text-align: center; color: #6c757d;">
                No items found in your order.
            </div>`;
        return;
    }

    // Render Cart Items
    cart.items.forEach((item) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="item-image">
                ${
                    item.image
                        ? `<img src="/${item.image}" alt="${item.name}">`
                        : `
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                    <rect width="120" height="120" fill="#e9ecef"/>
                    <path d="M35 40h50v5h-50zM35 50h15v35h-15zM55 50h30v35h-30z" fill="#adb5bd"/>
                </svg>`
                }
            </div>

            <div class="item-details">
                <div class="item-name">${item.name}</div>
                ${item.variant ? `<div class="item-variant">${item.variant}</div>` : ''}
                <div class="item-price">₱${item.price.toFixed(2)}</div>
                <div class="stock-status">In stock</div>
            </div>

            <div class="quantity-selector">
                <select class="quantity-select" disabled>
                    <option value="${item.quantity}" selected>${item.quantity}</option>
                </select>
            </div>
        `;

        cartContainer.appendChild(itemDiv);
    });

    // Calculate amounts
    const subtotal = total;
    const shipping = 50.0;
    const tax = subtotal * 0.12; // 12% VAT
    const orderTotal = subtotal + shipping + tax;

    // Update summary
    subtotalEl.textContent = `₱${subtotal.toFixed(2)}`;
    shippingEl.textContent = `₱${shipping.toFixed(2)}`;
    taxEl.textContent = `₱${tax.toFixed(2)}`;
    totalEl.textContent = `₱${orderTotal.toFixed(2)}`;
}

export function initializePayNow() {
    const payBtn = document.getElementById('payNowBtn');

    if (!payBtn) return; // Only run on checkout page

    payBtn.addEventListener('click', async () => {
        const cart = JSON.parse(localStorage.getItem('checkoutItems')) || [];

        const orderNumber = cart.orderNumber;
        console.log('orderNumber', orderNumber);
        if (!orderNumber) {
            alert('No order found. Please checkout again.');
            return;
        }

        try {
            // Update Firestore order document
            const orderRef = doc(db, 'orders', orderNumber);

            await updateDoc(orderRef, {
                paymentStatus: 'Paid',
                orderStatus: 'In-transit',
                paymentDate: new Date(),
            });

            // Redirect to success page
            window.location.href = 'successPage.html';
        } catch (error) {
            console.error('Payment Update Error:', error);
            alert('Something went wrong while processing payment.');
        }
    });
}
