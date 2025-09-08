// Global Variables
let currentUser = null;
let isAdmin = false;
let products = [];
let ingredients = [];
let orders = [];
let cart = [];

// API Base URL
const API_BASE = window.location.origin;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadDataFromAPI();
});

async function initializeApp() {
    // Load data from API instead of localStorage
    await loadDataFromAPI();
}

async function loadDataFromAPI() {
    try {
        // Load products
        const productsResponse = await fetch(`${API_BASE}/api/products`);
        if (productsResponse.ok) {
            products = await productsResponse.json();
        }

        // Load ingredients
        const ingredientsResponse = await fetch(`${API_BASE}/api/ingredients`);
        if (ingredientsResponse.ok) {
            ingredients = await ingredientsResponse.json();
        }

        // Load orders
        const ordersResponse = await fetch(`${API_BASE}/api/orders`);
        if (ordersResponse.ok) {
            orders = await ordersResponse.json();
        }

        console.log('✅ Datos cargados desde la API');
    } catch (error) {
        console.error('❌ Error cargando datos desde la API:', error);
        // Fallback to localStorage if API fails
        loadFromLocalStorage();
    }
}

function loadFromLocalStorage() {
    // Fallback to localStorage if API is not available
    const savedProducts = localStorage.getItem('mordipets_products');
    const savedIngredients = localStorage.getItem('mordipets_ingredients');
    const savedOrders = localStorage.getItem('mordipets_orders');
    
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }
    
    if (savedIngredients) {
        ingredients = JSON.parse(savedIngredients);
    }
    
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    }
}

function setupEventListeners() {
    // Modal controls
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const addProductModal = document.getElementById('addProductModal');
    const addIngredientModal = document.getElementById('addIngredientModal');
    const orderModal = document.getElementById('orderModal');
    
    // Login/Register buttons
    loginBtn.addEventListener('click', () => openModal(loginModal));
    registerBtn.addEventListener('click', () => openModal(registerModal));
    
    // Close modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    
    // Forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('addProductForm').addEventListener('submit', handleAddProduct);
    document.getElementById('addIngredientForm').addEventListener('submit', handleAddIngredient);
    
    // Admin navigation
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchAdminSection(e.target.dataset.section);
        });
    });
    
    // Client navigation
    document.querySelectorAll('.client-nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchClientSection(e.target.dataset.section);
        });
    });
    
    // Logout buttons
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('clientLogoutBtn').addEventListener('click', handleLogout);
    
    // Add product button
    document.getElementById('addProductBtn').addEventListener('click', () => openModal(addProductModal));
    document.getElementById('addIngredientBtn').addEventListener('click', () => openModal(addIngredientModal));
    
    // Search functionality
    document.getElementById('searchProducts').addEventListener('input', handleSearch);
    
    // Order buttons
    document.getElementById('payNowBtn').addEventListener('click', () => handlePayment('online'));
    document.getElementById('payOnDeliveryBtn').addEventListener('click', () => handlePayment('delivery'));
}

function openModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const isAdminCheck = document.getElementById('isAdmin').checked;
    
    // Simple validation (in a real app, this would be server-side)
    if (email && password) {
        currentUser = {
            email: email,
            name: email.split('@')[0],
            isAdmin: isAdminCheck
        };
        
        isAdmin = isAdminCheck;
        
        closeModal(document.getElementById('loginModal'));
        showUserPanel();
        
        // Clear form
        document.getElementById('loginForm').reset();
    } else {
        alert('Por favor, completa todos los campos');
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const location = document.getElementById('regLocation').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }
    
    if (name && email && phone && location && password) {
        currentUser = {
            name: name,
            email: email,
            phone: phone,
            location: location,
            isAdmin: false
        };
        
        isAdmin = false;
        
        closeModal(document.getElementById('registerModal'));
        showUserPanel();
        
        // Clear form
        document.getElementById('registerForm').reset();
        
        alert('¡Registro exitoso! Bienvenido a Mordipets');
    } else {
        alert('Por favor, completa todos los campos');
    }
}

function handleLogout() {
    currentUser = null;
    isAdmin = false;
    cart = [];
    
    document.getElementById('adminPanel').classList.add('hidden');
    document.getElementById('clientPanel').classList.add('hidden');
    
    // Show login/register buttons
    document.getElementById('loginBtn').style.display = 'flex';
    document.getElementById('registerBtn').style.display = 'flex';
}

function showUserPanel() {
    // Hide login/register buttons
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('registerBtn').style.display = 'none';
    
    if (isAdmin) {
        document.getElementById('adminPanel').classList.remove('hidden');
        loadAdminData();
    } else {
        document.getElementById('clientPanel').classList.remove('hidden');
        loadClientData();
    }
}

function loadAdminData() {
    loadProductsGrid();
    loadIngredientsGrid();
    loadOrdersList();
}

function loadClientData() {
    loadCatalogGrid();
    loadClientOrders();
}

function loadProductsGrid() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product, true);
        grid.appendChild(productCard);
    });
}

function loadIngredientsGrid() {
    const grid = document.getElementById('ingredientsGrid');
    grid.innerHTML = '';
    
    ingredients.forEach(ingredient => {
        const ingredientCard = createIngredientCard(ingredient);
        grid.appendChild(ingredientCard);
    });
}

function loadCatalogGrid() {
    const grid = document.getElementById('catalogGrid');
    grid.innerHTML = '';
    
    products.forEach(product => {
        if (product.stock > 0) {
            const catalogCard = createProductCard(product, false);
            grid.appendChild(catalogCard);
        }
    });
}

function createProductCard(product, isAdmin = false) {
    const card = document.createElement('div');
    card.className = isAdmin ? 'product-card' : 'catalog-card';
    
    const stockClass = product.stock > 10 ? 'stock' : product.stock > 0 ? 'stock low' : 'stock out';
    const stockText = product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock';
    
    card.innerHTML = `
        <h4>${product.name}</h4>
        <div class="product-info">
            <span class="price">$${product.price.toLocaleString('es-CO')}</span>
            <span class="${stockClass}">${stockText}</span>
        </div>
        <p><strong>Código:</strong> ${product.code}</p>
        <p><strong>Peso:</strong> ${product.weight} gr</p>
        <p>${product.description}</p>
        <div class="${isAdmin ? 'product-actions' : 'catalog-actions'}">
            ${isAdmin ? `
                <button class="btn-small btn-edit" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-small btn-delete" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            ` : `
                <button class="btn-small btn-add-to-cart" onclick="addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                    <i class="fas fa-cart-plus"></i> Agregar al Carrito
                </button>
            `}
        </div>
    `;
    
    return card;
}

function createIngredientCard(ingredient) {
    const card = document.createElement('div');
    card.className = 'ingredient-card';
    
    const typeColors = {
        'proteina': '#e74c3c',
        'carbohidrato': '#f39c12',
        'vitamina': '#27ae60',
        'mineral': '#3498db',
        'conservante': '#9b59b6',
        'saborizante': '#e67e22'
    };
    
    card.innerHTML = `
        <h4>${ingredient.name}</h4>
        <div class="ingredient-info">
            <span style="background: ${typeColors[ingredient.type]}; color: white; padding: 4px 12px; border-radius: 15px; font-size: 12px; font-weight: 600;">
                ${ingredient.type.toUpperCase()}
            </span>
            <span class="stock">${ingredient.quantity} ${ingredient.unit}</span>
        </div>
        <div class="product-actions">
            <button class="btn-small btn-edit" onclick="editIngredient(${ingredient.id})">
                <i class="fas fa-edit"></i> Editar
            </button>
            <button class="btn-small btn-delete" onclick="deleteIngredient(${ingredient.id})">
                <i class="fas fa-trash"></i> Eliminar
            </button>
        </div>
    `;
    
    return card;
}

function loadOrdersList() {
    const list = document.getElementById('ordersList');
    list.innerHTML = '';
    
    if (orders.length === 0) {
        list.innerHTML = '<p class="text-center">No hay pedidos registrados</p>';
        return;
    }
    
    orders.forEach(order => {
        const orderCard = createOrderCard(order);
        list.appendChild(orderCard);
    });
}

function loadClientOrders() {
    const list = document.getElementById('clientOrdersList');
    list.innerHTML = '';
    
    const clientOrders = orders.filter(order => order.client_email === currentUser.email);
    
    if (clientOrders.length === 0) {
        list.innerHTML = '<p class="text-center">No tienes pedidos registrados</p>';
        return;
    }
    
    clientOrders.forEach(order => {
        const orderCard = createOrderCard(order);
        list.appendChild(orderCard);
    });
}

function createOrderCard(order) {
    const card = document.createElement('div');
    card.className = 'order-card';
    
    const statusClass = `status-${order.status}`;
    const statusText = {
        'pending': 'Pendiente',
        'confirmed': 'Confirmado',
        'delivered': 'Entregado'
    };
    
    card.innerHTML = `
        <div class="order-header">
            <span class="order-id">Pedido #${order.id}</span>
            <span class="order-status ${statusClass}">${statusText[order.status]}</span>
        </div>
        <div class="order-details">
            <div class="order-detail">
                <label>Cliente</label>
                <span>${order.client_name}</span>
            </div>
            <div class="order-detail">
                <label>Fecha</label>
                <span>${new Date(order.created_at).toLocaleDateString()}</span>
            </div>
            <div class="order-detail">
                <label>Total</label>
                <span>$${order.total.toLocaleString('es-CO')}</span>
            </div>
            <div class="order-detail">
                <label>Método de Pago</label>
                <span>${order.payment_method === 'online' ? 'Pago Online' : 'Contraentrega'}</span>
            </div>
        </div>
        <div class="order-items">
            <h5>Productos:</h5>
            ${order.items ? order.items.map(item => `
                <div class="order-item">
                    <span>${item.product_name} x${item.quantity}</span>
                    <span>$${(item.price * item.quantity).toLocaleString('es-CO')}</span>
                </div>
            `).join('') : ''}
        </div>
        ${isAdmin ? `
            <div class="order-actions mt-20">
                <button class="btn-small btn-edit" onclick="updateOrderStatus(${order.id}, 'confirmed')">
                    <i class="fas fa-check"></i> Confirmar
                </button>
                <button class="btn-small btn-delete" onclick="updateOrderStatus(${order.id}, 'delivered')">
                    <i class="fas fa-truck"></i> Marcar Entregado
                </button>
            </div>
        ` : ''}
    `;
    
    return card;
}

async function handleAddProduct(e) {
    e.preventDefault();
    
    const newProduct = {
        code: document.getElementById('productCode').value,
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        weight: parseInt(document.getElementById('productWeight').value)
    };
    
    try {
        const response = await fetch(`${API_BASE}/api/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProduct)
        });
        
        if (response.ok) {
            const createdProduct = await response.json();
            products.push(createdProduct);
            
            closeModal(document.getElementById('addProductModal'));
            loadProductsGrid();
            
            // Clear form
            document.getElementById('addProductForm').reset();
            
            alert('Producto añadido exitosamente');
        } else {
            throw new Error('Error al crear producto');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al añadir el producto');
    }
}

async function handleAddIngredient(e) {
    e.preventDefault();
    
    const newIngredient = {
        name: document.getElementById('ingredientName').value,
        type: document.getElementById('ingredientType').value,
        quantity: parseInt(document.getElementById('ingredientQuantity').value),
        unit: document.getElementById('ingredientUnit').value
    };
    
    try {
        const response = await fetch(`${API_BASE}/api/ingredients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newIngredient)
        });
        
        if (response.ok) {
            const createdIngredient = await response.json();
            ingredients.push(createdIngredient);
            
            closeModal(document.getElementById('addIngredientModal'));
            loadIngredientsGrid();
            
            // Clear form
            document.getElementById('addIngredientForm').reset();
            
            alert('Insumo añadido exitosamente');
        } else {
            throw new Error('Error al crear ingrediente');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al añadir el insumo');
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product && product.stock > 0) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }
        
        alert(`${product.name} agregado al carrito`);
    }
}

function showOrderModal() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    const orderSummary = document.getElementById('orderSummary');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    orderSummary.innerHTML = `
        <h3>Resumen del Pedido</h3>
        <div class="order-items">
            ${cart.map(item => `
                <div class="order-item">
                    <span>${item.name} x${item.quantity}</span>
                    <span>$${(item.price * item.quantity).toLocaleString('es-CO')}</span>
                </div>
            `).join('')}
        </div>
        <div class="order-total">
            <strong>Total: $${total.toLocaleString('es-CO')}</strong>
        </div>
    `;
    
    openModal(document.getElementById('orderModal'));
}

async function handlePayment(method) {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const newOrder = {
        clientName: currentUser.name,
        clientEmail: currentUser.email,
        clientPhone: currentUser.phone,
        clientLocation: currentUser.location,
        items: [...cart],
        total: total,
        paymentMethod: method
    };
    
    try {
        const response = await fetch(`${API_BASE}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newOrder)
        });
        
        if (response.ok) {
            const createdOrder = await response.json();
            orders.push(createdOrder);
            
            // Clear cart
            cart = [];
            
            closeModal(document.getElementById('orderModal'));
            
            if (method === 'online') {
                alert('Redirigiendo al sistema de pago...');
            } else {
                alert('Pedido realizado exitosamente. Te contactaremos para coordinar la entrega.');
            }
            
            // Reload client data
            loadClientData();
        } else {
            throw new Error('Error al crear pedido');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al realizar el pedido');
    }
}

function switchAdminSection(section) {
    // Update navigation
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // Show/hide sections
    document.querySelectorAll('.admin-section').forEach(sec => {
        sec.classList.add('hidden');
    });
    document.getElementById(`${section}Section`).classList.remove('hidden');
}

function switchClientSection(section) {
    // Update navigation
    document.querySelectorAll('.client-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // Show/hide sections
    document.querySelectorAll('.client-section').forEach(sec => {
        sec.classList.add('hidden');
    });
    document.getElementById(`${section}Section`).classList.remove('hidden');
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.catalog-card');
    
    cards.forEach(card => {
        const productName = card.querySelector('h4').textContent.toLowerCase();
        if (productName.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        const response = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (response.ok) {
            const updatedOrder = await response.json();
            const orderIndex = orders.findIndex(o => o.id === orderId);
            if (orderIndex !== -1) {
                orders[orderIndex] = updatedOrder;
            }
            
            loadOrdersList();
            alert(`Estado del pedido actualizado a: ${newStatus}`);
        } else {
            throw new Error('Error al actualizar pedido');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al actualizar el estado del pedido');
    }
}

function editProduct(productId) {
    // In a real application, this would open an edit modal
    alert('Funcionalidad de edición en desarrollo');
}

async function deleteProduct(productId) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        try {
            const response = await fetch(`${API_BASE}/api/products/${productId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                products = products.filter(p => p.id !== productId);
                loadProductsGrid();
                alert('Producto eliminado exitosamente');
            } else {
                throw new Error('Error al eliminar producto');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar el producto');
        }
    }
}

function editIngredient(ingredientId) {
    // In a real application, this would open an edit modal
    alert('Funcionalidad de edición en desarrollo');
}

async function deleteIngredient(ingredientId) {
    if (confirm('¿Estás seguro de que quieres eliminar este insumo?')) {
        try {
            const response = await fetch(`${API_BASE}/api/ingredients/${ingredientId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                ingredients = ingredients.filter(i => i.id !== ingredientId);
                loadIngredientsGrid();
                alert('Insumo eliminado exitosamente');
            } else {
                throw new Error('Error al eliminar ingrediente');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar el insumo');
        }
    }
}

// Add cart functionality to client panel
document.addEventListener('DOMContentLoaded', function() {
    // Add cart button to client panel
    const clientHeader = document.querySelector('.client-header');
    if (clientHeader) {
        const cartButton = document.createElement('button');
        cartButton.className = 'btn-primary';
        cartButton.innerHTML = '<i class="fas fa-shopping-cart"></i> Ver Carrito';
        cartButton.onclick = showOrderModal;
        clientHeader.appendChild(cartButton);
    }
});
