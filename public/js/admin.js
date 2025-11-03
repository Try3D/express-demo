// Admin panel JavaScript

let adminKey = '';
let products = [];
let categories = [];
let orders = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    const savedKey = localStorage.getItem('adminKey');
    if (savedKey) {
        adminKey = savedKey;
        checkAuth();
    }
});

// Authentication
async function login() {
    const key = document.getElementById('admin-key').value;
    if (!key) {
        showLoginError('Please enter admin key');
        return;
    }
    
    try {
        const response = await fetch('/api/admin/products', {
            headers: { 'X-Admin-Key': key }
        });
        
        if (response.ok) {
            adminKey = key;
            localStorage.setItem('adminKey', key);
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('admin-dashboard').style.display = 'block';
            await loadData();
        } else {
            showLoginError('Invalid admin key');
        }
    } catch (error) {
        showLoginError('Error connecting to server');
    }
}

function logout() {
    adminKey = '';
    localStorage.removeItem('adminKey');
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('admin-dashboard').style.display = 'none';
    document.getElementById('admin-key').value = '';
}

function showLoginError(message) {
    const errorEl = document.getElementById('login-error');
    errorEl.textContent = message;
    errorEl.style.display = 'block';
}

async function checkAuth() {
    try {
        const response = await fetch('/api/admin/products', {
            headers: { 'X-Admin-Key': adminKey }
        });
        
        if (response.ok) {
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('admin-dashboard').style.display = 'block';
            await loadData();
        } else {
            logout();
        }
    } catch (error) {
        logout();
    }
}

// Navigation
function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(el => {
        el.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.admin-nav button').forEach(el => {
        el.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(section + '-section').classList.add('active');
    document.getElementById(section + '-tab').classList.add('active');
    
    // Load data for the section
    if (section === 'products') loadProducts();
    else if (section === 'categories') loadCategories();
    else if (section === 'orders') loadOrders();
}

// Load all data
async function loadData() {
    await Promise.all([
        loadProducts(),
        loadCategories(),
        loadOrders()
    ]);
}

// Products management
async function loadProducts() {
    try {
        const response = await fetch('/api/admin/products', {
            headers: { 'X-Admin-Key': adminKey }
        });
        
        if (response.ok) {
            products = await response.json();
            displayProducts();
            updateProductCategorySelect();
        }
    } catch (error) {
        showStatus('Error loading products', 'error');
    }
}

function displayProducts() {
    const tbody = document.getElementById('products-list');
    tbody.innerHTML = products.map(product => `
        <tr>
            <td><img src="${product.imageUrl}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/50x50?text=No+Image'"></td>
            <td>${product.name}</td>
            <td>${product.categoryName || 'Unknown'}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>
                <button class="btn-danger" onclick="deleteProduct('${product.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

async function updateProductCategorySelect() {
    const select = document.getElementById('product-category');
    select.innerHTML = '<option value="">Select Category</option>' + 
        categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
}

// Product form handling
document.getElementById('product-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        price: parseFloat(document.getElementById('product-price').value),
        categoryId: parseInt(document.getElementById('product-category').value),
        stock: parseInt(document.getElementById('product-stock').value),
        imageUrl: document.getElementById('product-image').value || `https://via.placeholder.com/300x300?text=${encodeURIComponent(document.getElementById('product-name').value)}`
    };
    
    try {
        const response = await fetch('/api/admin/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Admin-Key': adminKey
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            showStatus('Product added successfully!', 'success');
            resetProductForm();
            await loadProducts();
        } else {
            const error = await response.json();
            showStatus('Error: ' + error.message, 'error');
        }
    } catch (error) {
        showStatus('Error adding product', 'error');
    }
});

function resetProductForm() {
    document.getElementById('product-form').reset();
}

async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
        const response = await fetch(`/api/admin/products/${productId}`, {
            method: 'DELETE',
            headers: { 'X-Admin-Key': adminKey }
        });
        
        if (response.ok) {
            showStatus('Product deleted successfully!', 'success');
            await loadProducts();
        } else {
            const error = await response.json();
            showStatus('Error: ' + error.message, 'error');
        }
    } catch (error) {
        showStatus('Error deleting product', 'error');
    }
}

// Categories management
async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        if (response.ok) {
            categories = await response.json();
            displayCategories();
            updateProductCategorySelect();
        }
    } catch (error) {
        showStatus('Error loading categories', 'error');
    }
}

function displayCategories() {
    const tbody = document.getElementById('categories-list');
    tbody.innerHTML = categories.map(category => `
        <tr>
            <td>${category.id}</td>
            <td>${category.name}</td>
            <td>${category.description || ''}</td>
            <td>
                <button class="btn-danger" onclick="deleteCategory(${category.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Category form handling
document.getElementById('category-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('category-name').value,
        description: document.getElementById('category-description').value
    };
    
    try {
        const response = await fetch('/api/admin/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Admin-Key': adminKey
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            showStatus('Category added successfully!', 'success');
            this.reset();
            await loadCategories();
        } else {
            const error = await response.json();
            showStatus('Error: ' + error.message, 'error');
        }
    } catch (error) {
        showStatus('Error adding category', 'error');
    }
});

async function deleteCategory(categoryId) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
        const response = await fetch(`/api/admin/categories/${categoryId}`, {
            method: 'DELETE',
            headers: { 'X-Admin-Key': adminKey }
        });
        
        if (response.ok) {
            showStatus('Category deleted successfully!', 'success');
            await loadCategories();
        } else {
            const error = await response.json();
            showStatus('Error: ' + error.message, 'error');
        }
    } catch (error) {
        showStatus('Error deleting category', 'error');
    }
}

// Orders management
async function loadOrders() {
    try {
        const response = await fetch('/api/admin/orders', {
            headers: { 'X-Admin-Key': adminKey }
        });
        
        if (response.ok) {
            orders = await response.json();
            displayOrders();
        }
    } catch (error) {
        showStatus('Error loading orders', 'error');
    }
}

function displayOrders() {
    const tbody = document.getElementById('orders-list');
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.id.substring(0, 8)}...</td>
            <td>${order.customerName}</td>
            <td>${order.customerEmail}</td>
            <td>$${order.totalAmount.toFixed(2)}</td>
            <td><span style="background: ${order.status === 'pending' ? '#ffa500' : '#28a745'}; color: white; padding: 0.3rem 0.8rem; border-radius: 1rem; font-size: 1.2rem;">${order.status}</span></td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td>${order.items.length} item(s)</td>
        </tr>
    `).join('');
}

// Utility functions
function showStatus(message, type) {
    const statusEl = document.getElementById('status-message');
    statusEl.innerHTML = `<div class="status-message status-${type}">${message}</div>`;
    
    setTimeout(() => {
        statusEl.innerHTML = '';
    }, 5000);
}