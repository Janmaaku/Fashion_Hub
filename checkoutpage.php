<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Location: index.html');
    exit();
}

// Get cart data from session or POST
$cartItems = isset($_POST['cart_items']) ? json_decode($_POST['cart_items'], true) : [];
$cartTotal = isset($_POST['cart_total']) ? $_POST['cart_total'] : 0;
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checkout - Fashion Hub</title>
    <link rel="stylesheet" href="public/assets/css/landingpage.css">
    <link rel="stylesheet" href="public/assets/css/form.css">
    <style>
        .checkout-container {
            max-width: 1200px;
            margin: 100px auto 50px;
            padding: 0 20px;
            display: grid;
            grid-template-columns: 1fr 400px;
            gap: 30px;
        }

        .checkout-section {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .checkout-section h2 {
            margin-bottom: 20px;
            color: #333;
            border-bottom: 2px solid #ff6b6b;
            padding-bottom: 10px;
        }

        .form-section {
            margin-bottom: 30px;
        }

        .form-section h3 {
            color: #555;
            margin-bottom: 15px;
            font-size: 1.1rem;
        }

        .order-summary {
            position: sticky;
            top: 100px;
            height: fit-content;
        }

        .summary-item {
            display: flex;
            justify-content: space-between;
            padding: 15px 0;
            border-bottom: 1px solid #eee;
        }

        .summary-item img {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 5px;
            margin-right: 15px;
        }

        .item-details {
            flex: 1;
        }

        .item-name {
            font-weight: 500;
            margin-bottom: 5px;
        }

        .item-price {
            color: #ff6b6b;
            font-weight: bold;
        }

        .summary-totals {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 2px solid #333;
        }

        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 1rem;
        }

        .summary-row.total {
            font-size: 1.3rem;
            font-weight: bold;
            color: #ff6b6b;
            margin-top: 15px;
        }

        .payment-methods {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-top: 15px;
        }

        .payment-option {
            border: 2px solid #ddd;
            padding: 20px;
            border-radius: 8px;
            cursor: pointer;
            text-align: center;
            transition: all 0.3s;
        }

        .payment-option:hover {
            border-color: #ff6b6b;
            background: #fff5f5;
        }

        .payment-option input[type="radio"] {
            margin-right: 10px;
        }

        .payment-option.selected {
            border-color: #ff6b6b;
            background: #fff5f5;
        }

        .place-order-btn {
            width: 100%;
            padding: 15px;
            background: #ff6b6b;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            margin-top: 20px;
            transition: background 0.3s;
        }

        .place-order-btn:hover {
            background: #ff5252;
        }

        .place-order-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
        }

        @media (max-width: 968px) {
            .checkout-container {
                grid-template-columns: 1fr;
            }
            
            .order-summary {
                position: static;
            }
        }

        .loading {
            display: none;
            text-align: center;
            padding: 20px;
        }

        .loading.active {
            display: block;
        }

        .success-message {
            display: none;
            background: #4caf50;
            color: white;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            text-align: center;
        }

        .success-message.active {
            display: block;
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <div class="logo">Fashion Hub</div>
            <ul class="nav-links">
                <li><a href="index.html">Home</a></li>
                <li><a href="index.html#products">Shop</a></li>
                <li><a href="index.html#about">About</a></li>
            </ul>
        </nav>
    </header>

    <div class="checkout-container">
        <!-- Checkout Form -->
        <div class="checkout-section">
            <h2>Checkout</h2>
            
            <div id="successMessage" class="success-message">
                Order placed successfully! Redirecting...
            </div>

            <form id="checkoutForm">
                <!-- Shipping Information -->
                <div class="form-section">
                    <h3>Shipping Information</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label>First Name *</label>
                            <input type="text" name="firstName" required>
                        </div>
                        <div class="form-group">
                            <label>Last Name *</label>
                            <input type="text" name="lastName" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label>Phone Number *</label>
                        <input type="tel" name="phone" required>
                    </div>
                    <div class="form-group">
                        <label>Address *</label>
                        <input type="text" name="address" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>City *</label>
                            <input type="text" name="city" required>
                        </div>
                        <div class="form-group">
                            <label>Postal Code *</label>
                            <input type="text" name="postal" required>
                        </div>
                    </div>
                </div>

                <!-- Payment Method -->
                <div class="form-section">
                    <h3>Payment Method</h3>
                    <div class="payment-methods">
                        <label class="payment-option" onclick="selectPayment(this)">
                            <input type="radio" name="payment" value="cod" required>
                            <div>💵 Cash on Delivery</div>
                        </label>
                        <label class="payment-option" onclick="selectPayment(this)">
                            <input type="radio" name="payment" value="gcash" required>
                            <div>📱 GCash</div>
                        </label>
                        <label class="payment-option" onclick="selectPayment(this)">
                            <input type="radio" name="payment" value="card" required>
                            <div>💳 Credit/Debit Card</div>
                        </label>
                        <label class="payment-option" onclick="selectPayment(this)">
                            <input type="radio" name="payment" value="bank" required>
                            <div>🏦 Bank Transfer</div>
                        </label>
                    </div>
                </div>

                <button type="submit" class="place-order-btn" id="placeOrderBtn">
                    Place Order
                </button>
            </form>

            <div class="loading" id="loadingIndicator">
                <p>Processing your order...</p>
            </div>
        </div>

        <!-- Order Summary -->
        <div class="checkout-section order-summary">
            <h2>Order Summary</h2>
            <div id="orderItems"></div>
            <div class="summary-totals">
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span id="subtotal">₱0.00</span>
                </div>
                <div class="summary-row">
                    <span>Shipping:</span>
                    <span id="shipping">₱50.00</span>
                </div>
                <div class="summary-row total">
                    <span>Total:</span>
                    <span id="total">₱0.00</span>
                </div>
            </div>
        </div>
    </div>

  
</body>
</html>