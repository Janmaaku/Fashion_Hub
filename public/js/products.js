export const products = [
    { id: 1, name: 'Classic T-Shirt', price: 29.99, category: 'men', image: 'assets/img/products/f1.jpg' },
    { id: 2, name: 'Summer Dress', price: 49.99, category: 'women', image: 'assets/img/products/f2.jpg' },
    { id: 3, name: 'Denim Jeans', price: 59.99, category: 'men', image: 'assets/img/products/f3.jpg' },
    { id: 4, name: 'Leather Jacket', price: 129.99, category: 'women', image: 'assets/img/products/f4.jpg' },
    { id: 5, name: 'Sneakers', price: 79.99, category: 'accessories', image: 'assets/img/products/f5.jpg' },
    { id: 6, name: 'Handbag', price: 89.99, category: 'accessories', image: 'assets/img/products/f6.jpg' },
    { id: 7, name: 'Polo Shirt', price: 39.99, category: 'men', image: 'assets/img/products/f7.jpg' },
    { id: 8, name: 'Sunglasses', price: 149.99, category: 'accessories', image: 'assets/img/products/f8.jpg' },
];

// ✅ DEFAULT PARAMETER FIX
export function displayProducts(productsToShow = products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.innerHTML = '';

    productsToShow.forEach((product) => {
        grid.innerHTML += `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>₱${product.price.toFixed(2)}</p>
                    <button class="product-addcart" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        `;
    });
}

export function filterProducts(category) {
    if (category === 'all') displayProducts(products);
    else displayProducts(products.filter((p) => p.category === category));
}
