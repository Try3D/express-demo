// Global variables
let products = [];
let categories = [];
let filteredProducts = [];
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

// Initialize app
document.addEventListener('DOMContentLoaded', async function() {
    await fetchCategories();
    await fetchProducts();
    displayCart();
    updateCartCount();
});

// Fetch products from API
async function fetchProducts() {
    try {
        showLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        
        products = await response.json();
        
        // Add category names to products
        products = products.map(product => {
            const category = categories.find(cat => cat.id === product.categoryId);
            return {
                ...product,
                categoryName: category ? category.name : 'Unknown'
            };
        });
        
        filteredProducts = [...products];
        displayProducts();
        showLoading(false);
    } catch (error) {
        showError('Error loading products: ' + error.message);
        showLoading(false);
    }
}

// Fetch categories from API
async function fetchCategories() {
    try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        
        categories = await response.json();
        updateCategoryFilter();
        return categories;
    } catch (error) {
        console.error('Error loading categories:', error);
        return [];
    }
}

// Display products in grid
function displayProducts() {
    const container = document.getElementById('products-list');
    
    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <p>No products found matching your criteria.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredProducts.map(product => `
        <div class="card">
            <div class="card__inner">
                <div class="card__media">
                    <img 
                        src="${product.imageUrl}" 
                        alt="${product.name}"
                        class="card__image"
                        loading="lazy"
                    >
                </div>
                <div class="card__content">
                    <h3 class="card__title">${product.name}</h3>
                    <div class="card__price">$${product.price.toFixed(2)}</div>
                    <div class="card__description">${product.description}</div>
                    <div class="card__actions">
                        <button 
                            class="btn" 
                            onclick="addToCart('${product.id}')"
                            ${product.stock === 0 ? 'disabled' : ''}
                        >
                            ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter products
function filterProducts() {
    const categoryFilter = document.getElementById('category-filter').value;
    const searchFilter = document.getElementById('search-filter').value.toLowerCase();
    
    filteredProducts = products.filter(product => {
        const matchesCategory = !categoryFilter || (product.categoryId && product.categoryId === parseInt(categoryFilter));
        const matchesSearch = !searchFilter || 
            (product.name && product.name.toLowerCase().includes(searchFilter)) || 
            (product.description && product.description.toLowerCase().includes(searchFilter)) ||
            (product.categoryName && product.categoryName.toLowerCase().includes(searchFilter));
        
        return matchesCategory && matchesSearch;
    });
    
    displayProducts();
}

// Update category filter dropdown
function updateCategoryFilter() {
    const select = document.getElementById('category-filter');
    select.innerHTML = '<option value="">All Categories</option>' + 
        categories.map(category => `<option value="${category.id}">${category.name}</option>`).join('');
}

// Shopping cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            alert('Cannot add more items. Stock limit reached.');
            return;
        }
    } else {
        cart.push({
            productId: productId,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: 1,
            maxStock: product.stock
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
    
    // Show success feedback
    showCartNotification('Added to cart!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.productId === productId);
    if (!item) return;
    
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    if (newQuantity > item.maxStock) {
        alert('Cannot exceed stock limit.');
        return;
    }
    
    item.quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartCount();
    }
}

function displayCart() {
    const container = document.getElementById('cart-items-list');
    const totalElement = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <p>Your cart is empty</p>
            </div>
        `;
        totalElement.textContent = '';
        return;
    }
    
    let total = 0;
    container.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        return `
            <div class="cart-item">
                <div class="cart-item__image">
                    <img src="${item.imageUrl}" alt="${item.name}">
                </div>
                <div class="cart-item__details">
                    <div class="cart-item__title">${item.name}</div>
                    <div class="cart-item__price">$${item.price.toFixed(2)} each</div>
                    <div class="cart-item__quantity">
                        <input 
                            type="number" 
                            value="${item.quantity}" 
                            min="1" 
                            max="${item.maxStock}" 
                            class="quantity-input"
                            onchange="updateQuantity('${item.productId}', parseInt(this.value))"
                        >
                        <button 
                            class="cart-item__remove" 
                            onclick="removeFromCart('${item.productId}')"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    totalElement.textContent = `Total: $${total.toFixed(2)}`;
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
    
    // Hide cart count if empty
    const cartCountElement = document.getElementById('cart-count');
    cartCountElement.style.display = count > 0 ? 'block' : 'none';
}

// Cart drawer functions
function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    drawer.classList.toggle('active');
    
    // Prevent body scroll when cart is open
    if (drawer.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// UI helper functions
function showLoading(show) {
    const loading = document.getElementById('products-loading');
    const productsList = document.getElementById('products-list');
    
    if (show) {
        loading.style.display = 'flex';
        productsList.style.display = 'none';
    } else {
        loading.style.display = 'none';
        productsList.style.display = 'grid';
    }
}

function showError(message) {
    const error = document.getElementById('products-error');
    error.textContent = message;
    error.style.display = 'flex';
}

function showCartNotification(message) {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: var(--color-success);
        color: white;
        padding: 1rem 2rem;
        border-radius: 0.4rem;
        z-index: 1001;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Close cart when clicking outside
document.addEventListener('click', function(event) {
    const drawer = document.getElementById('cart-drawer');
    const cartButton = document.querySelector('.header__icon--cart');
    
    if (drawer.classList.contains('active') && 
        !drawer.contains(event.target) && 
        !cartButton.contains(event.target)) {
        toggleCart();
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const drawer = document.getElementById('cart-drawer');
        if (drawer.classList.contains('active')) {
            toggleCart();
        }
    }
});