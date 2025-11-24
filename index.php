<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fashion Hub - Your Style Destination</title>
 <link rel="stylesheet" href="public/assets/css/landingpage.css">
<link rel="stylesheet" href="public/assets/css/form.css">

</head>
<body>
    <!-- Header -->
    <header>
        <nav>
            <div class="logo">Fashion Hub</div>
            <ul class="nav-links">
                <li><a href="/Fashion_Hub/index.php" >Home</a></li>
                <li><a href="#" onclick="showSection('products')">Shop</a></li>
                <li><a href="#" onclick="showSection('about')">About</a></li>
            </ul>
            <div class="nav-icons">
            <button id="authBtn">👤</button>

           

            <button onclick="toggleCart()">
                🛒
                <span class="cart-badge" id="cartCount">0</span>
            </button>

               <div class="user-dropdown hidden" id="userDropdown">
                <ul class="dropdown-menu">
                    <li>
                        <a href="src/b/profile.html" class="dropdown-item" id="profileBtn">
                            <span class="icon">👤</span>
                            <span>Profile</span>
                        </a>
                    </li>
                    <li>
                        <button class="dropdown-item logout" id="logoutBtn">
                            <span class="icon">🚪</span>
                            <span>Sign Out</span>
                        </button>
                    </li>
                </ul>
            </div>
          </div>

        </nav>
        
        
    </header>

    <!-- Hero Carousel -->
    <div class="hero-carousel">
        <div class="carousel-container" id="carouselContainer">
            <div class="hero-slide slide-1">
                <h1>Welcome to Fashion Hub</h1>
                <p>Discover the latest trends in fashion</p>
                <button class="btn" onclick="showSection('products')">Shop Now</button>
            </div>
            <div class="hero-slide slide-2">
                <h1>Summer Collection 2024</h1>
                <p>Fresh styles for the season</p>
                <button class="btn" onclick="showSection('products')">Explore Collection</button>
            </div>
            <div class="hero-slide slide-3">
                <h1>Exclusive Deals</h1>
                <p>Up to 50% off on selected items</p>
                <button class="btn" onclick="showSection('products')">Shop Deals</button>
            </div>
        </div>
        
        <button class="carousel-arrow prev" onclick="moveCarousel(-1)">‹</button>
        <button class="carousel-arrow next" onclick="moveCarousel(1)">›</button>
        
        <div class="carousel-indicators">
            <button class="indicator active" onclick="goToSlide(0)"></button>
            <button class="indicator" onclick="goToSlide(1)"></button>
            <button class="indicator" onclick="goToSlide(2)"></button>
        </div>
    </div>

    <!-- Products Section -->
    <section class="products-section">
        <h2 class="section-title">Featured Products</h2>
        
        <div class="filters">
            <button class="filter-btn active" onclick="filterProducts('all')">All</button>
            <button class="filter-btn" onclick="filterProducts('men')">Men</button>
            <button class="filter-btn" onclick="filterProducts('women')">Women</button>
        </div>

        <div class="products-grid" id="productsGrid"></div>
    </section>

    <!-- Cart Modal -->
    <div class="modal" id="cartModal">
        <div class="modal-content">
            <span class="close-modal" onclick="toggleCart()">&times;</span>
            <h2>Shopping Cart</h2>
            <div class="cart-items" id="cartItems"></div>
            <div class="cart-total" id="cartTotal">Total: ₱0.00</div>
            <button class="btn" style="width: 100%; margin-top: 1rem;" onclick="checkout()">Checkout</button>
        </div>
    </div>

 
    <!-- Auth Modal -->
<div class="modal" id="authModal">
    <div class="modal-content auth-modal">
        <span class="close-modal" onclick="toggleAuthModal()">&times;</span>

        <div id="authTabs">
            <button class="auth-tab active" onclick="switchAuth('login')">Login</button>
            <button class="auth-tab" onclick="switchAuth('register')">Register</button>
        </div>

        <!-- LOGIN FORM -->
        <form class="auth-form" id="loginForm" onsubmit="handleLogin(event)">
            <h2>Sign In</h2>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="loginEmail" required>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="loginPassword" required>
            </div>
            <button type="submit" class="btn" style="width: 100%; margin-top: 0.5rem;">Login</button>
        </form>

        <!-- REGISTER FORM -->
        <form class="auth-form hidden" id="registerForm" onsubmit="handleRegister(event)">
            <h2>Create Account</h2>

            <div class="form-row">
                <div class="form-group">
                    <label>First Name</label>
                    <input type="text" id="regFirst" required>
                </div>

                <div class="form-group">
                    <label>Last Name</label>
                    <input type="text" id="regLast" required>
                </div>
            </div>

            <div class="form-group">
                <label>Date of Birth</label>
                <input type="date" id="regDob" required>
            </div>

            <div class="form-group">
                <label>Email</label>
                <input type="email" id="regEmail" required>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="regPassword" required>
                </div>

                <div class="form-group">
                    <label>Confirm Password</label>
                    <input type="password" id="regConfirm" required>
                </div>
            </div>

            <button type="submit" class="btn" style="width: 100%; margin-top: 0.5rem;">Register</button>
        </form>
    </div>
</div>

 
<!-- <script type="module" src="../../public/js/main.js"></script> -->
<script type="module" src="public/js/main.js"></script>

</body>
</html>