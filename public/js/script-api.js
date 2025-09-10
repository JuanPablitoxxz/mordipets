// Global Variables
let currentUser = null;
let isAdmin = false;
let products = [];
let ingredients = [];
let orders = [];
let cart = [];

// Sample data based on the Excel image
const sampleProducts = [
    { id: 1, code: '10', name: 'Galleta Leche x 1000 gr', price: 15500, stock: 25, weight: 1000, description: 'Deliciosas galletas de leche para perros' },
    { id: 2, code: '20', name: 'Galleta Carne x 1000 gr', price: 16000, stock: 30, weight: 1000, description: 'Galletas con sabor a carne' },
    { id: 3, code: '30', name: 'Galleta Pollo x 1000 gr', price: 15750, stock: 20, weight: 1000, description: 'Galletas de pollo nutritivas' },
    { id: 4, code: '40', name: 'Galleta Higado x 1000 gr', price: 17000, stock: 15, weight: 1000, description: 'Galletas de hígado ricas en hierro' },
    { id: 5, code: '50', name: 'Galleta Espinaca x 1000 gr', price: 16250, stock: 18, weight: 1000, description: 'Galletas con espinaca para perros' },
    { id: 6, code: '60', name: 'Galleta Zanahoria x 1000 gr', price: 15000, stock: 22, weight: 1000, description: 'Galletas de zanahoria saludables' },
    { id: 7, code: '70', name: 'Galleta Avena x 1000 gr', price: 14750, stock: 28, weight: 1000, description: 'Galletas de avena energéticas' },
    { id: 8, code: '80', name: 'Galleta Linaza x 1000 gr', price: 16500, stock: 12, weight: 1000, description: 'Galletas de linaza con omega-3' },
    { id: 9, code: '90', name: 'Galleta Monedita Leche x 1000 gr', price: 18000, stock: 20, weight: 1000, description: 'Galletas monedita de leche' },
    { id: 10, code: '100', name: 'Galleta Monedita Carne x 1000 gr', price: 18500, stock: 15, weight: 1000, description: 'Galletas monedita de carne' },
    { id: 11, code: '101', name: 'Galleta Mixta x 1000 gr', price: 17250, stock: 25, weight: 1000, description: 'Mezcla de sabores' },
    { id: 12, code: '102', name: 'Galleta Polvorosa x 1000 gr', price: 16750, stock: 18, weight: 1000, description: 'Galletas polvorosas especiales' },
    { id: 13, code: '103', name: 'Huesito 3/4 Paquete x2 X 85 grm', price: 8500, stock: 40, weight: 85, description: 'Huesitos pequeños para perros' },
    { id: 14, code: '104', name: 'Paquete pequeño x 12 unds X 35 gr', price: 12000, stock: 35, weight: 35, description: 'Paquete pequeño de galletas' },
    { id: 15, code: '105', name: 'Paquete x 8 Unds X 40 gr', price: 10500, stock: 30, weight: 40, description: 'Paquete de 8 galletas' }
];

const sampleIngredients = [
    { id: 1, name: 'Harina de Trigo', type: 'carbohidrato', quantity: 50, unit: 'kg' },
    { id: 2, name: 'Carne de Res', type: 'proteina', quantity: 25, unit: 'kg' },
    { id: 3, name: 'Leche en Polvo', type: 'proteina', quantity: 15, unit: 'kg' },
    { id: 4, name: 'Hígado de Pollo', type: 'proteina', quantity: 10, unit: 'kg' },
    { id: 5, name: 'Espinaca', type: 'vitamina', quantity: 8, unit: 'kg' },
    { id: 6, name: 'Zanahoria', type: 'vitamina', quantity: 12, unit: 'kg' },
    { id: 7, name: 'Avena', type: 'carbohidrato', quantity: 20, unit: 'kg' },
    { id: 8, name: 'Linaza', type: 'vitamina', quantity: 5, unit: 'kg' },
    { id: 9, name: 'Conservante Natural', type: 'conservante', quantity: 2, unit: 'kg' },
    { id: 10, name: 'Saborizante Carne', type: 'saborizante', quantity: 3, unit: 'lt' }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadSampleData();
    loadPublicProducts();
});

function initializeApp() {
    // Load data from localStorage if available
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

function loadSampleData() {
    if (products.length === 0) {
        products = [...sampleProducts];
        saveToLocalStorage('mordipets_products', products);
    }
    
    if (ingredients.length === 0) {
        ingredients = [...sampleIngredients];
        saveToLocalStorage('mordipets_ingredients', ingredients);
    }
}

function loadPublicProducts() {
    const grid = document.getElementById('productosGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createPublicProductCard(product);
        grid.appendChild(productCard);
    });
}

function createPublicProductCard(product) {
    const card = document.createElement('div');
    card.className = 'producto-card';
    
    const stockClass = product.stock > 10 ? 'stock' : product.stock > 0 ? 'stock low' : 'stock out';
    const stockText = product.stock > 0 ? `${product.stock} disponibles` : 'Agotadas';
    
    card.innerHTML = `
        <div class="producto-image">
            <img src="images/${product.name.toLowerCase().replace(/\s+/g, '')}.jpg" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <div class="product-placeholder" style="display:none;">🍪</div>
        </div>
        <div class="producto-info">
            <h4>${product.name}</h4>
            <p class="producto-description">${product.description}</p>
            <div class="producto-stock ${stockClass}">${stockText}</div>
        </div>
    `;
    
    return card;
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
    if (loginBtn) loginBtn.addEventListener('click', () => openModal(loginModal));
    if (registerBtn) registerBtn.addEventListener('click', () => openModal(registerModal));
    
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
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const addProductForm = document.getElementById('addProductForm');
    const addIngredientForm = document.getElementById('addIngredientForm');
    
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    if (addProductForm) addProductForm.addEventListener('submit', handleAddProduct);
    if (addIngredientForm) addIngredientForm.addEventListener('submit', handleAddIngredient);
    
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
    const logoutBtn = document.getElementById('logoutBtn');
    const clientLogoutBtn = document.getElementById('clientLogoutBtn');
    
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (clientLogoutBtn) clientLogoutBtn.addEventListener('click', handleLogout);
    
    // Add product button
    const addProductBtn = document.getElementById('addProductBtn');
    const addIngredientBtn = document.getElementById('addIngredientBtn');
    
    if (addProductBtn) addProductBtn.addEventListener('click', () => openModal(addProductModal));
    if (addIngredientBtn) addIngredientBtn.addEventListener('click', () => openModal(addIngredientModal));
    
    // Search functionality
    const searchProducts = document.getElementById('searchProducts');
    if (searchProducts) searchProducts.addEventListener('input', handleSearch);
    
    // Order buttons
    const payNowBtn = document.getElementById('payNowBtn');
    const payOnDeliveryBtn = document.getElementById('payOnDeliveryBtn');
    
    if (payNowBtn) payNowBtn.addEventListener('click', () => handlePayment('online'));
    if (payOnDeliveryBtn) payOnDeliveryBtn.addEventListener('click', () => handlePayment('delivery'));
}

function openModal(modal) {
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modal) {
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const isAdminCheck = document.getElementById('isAdmin') ? document.getElementById('isAdmin').checked : false;
    
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
    
    const adminPanel = document.getElementById('adminPanel');
    const clientPanel = document.getElementById('clientPanel');
    
    if (adminPanel) adminPanel.style.display = 'none';
    if (clientPanel) clientPanel.style.display = 'none';
    
    // Show login/register buttons
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    
    if (loginBtn) loginBtn.style.display = 'flex';
    if (registerBtn) registerBtn.style.display = 'flex';
}

function showUserPanel() {
    // Hide login/register buttons
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    
    if (loginBtn) loginBtn.style.display = 'none';
    if (registerBtn) registerBtn.style.display = 'none';
    
    if (isAdmin) {
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) adminPanel.style.display = 'block';
        loadAdminData();
    } else {
        const clientPanel = document.getElementById('clientPanel');
        if (clientPanel) clientPanel.style.display = 'block';
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
    if (!grid) return;
    
    grid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product, true);
        grid.appendChild(productCard);
    });
}

function loadIngredientsGrid() {
    const grid = document.getElementById('ingredientsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    ingredients.forEach(ingredient => {
        const ingredientCard = createIngredientCard(ingredient);
        grid.appendChild(ingredientCard);
    });
}

function loadCatalogGrid() {
    const grid = document.getElementById('catalogGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    products.forEach(product => {
        const catalogCard = createProductCard(product, false);
        grid.appendChild(catalogCard);
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
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="decreaseQuantity(${product.id})">-</button>
                    <input type="number" class="quantity-input" id="qty-${product.id}" value="1" min="1" max="${product.stock}">
                    <button class="quantity-btn" onclick="increaseQuantity(${product.id})">+</button>
                </div>
                <button class="btn-small btn-add-to-cart" onclick="addToCartWithQuantity(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
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
    if (!list) return;
    
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
    console.log('=== loadClientOrders START ===');
    
    const list = document.getElementById('clientOrdersList');
    console.log('clientOrdersList element:', list);
    
    if (!list) {
        console.log('❌ clientOrdersList element not found!');
        return;
    }
    
    list.innerHTML = '';
    
    // Get client orders from localStorage
    const clientOrders = getClientOrders();
    console.log('clientOrders found:', clientOrders);
    
    if (clientOrders.length === 0) {
        console.log('No client orders found, creating sample orders...');
        createSampleOrders();
        const newClientOrders = getClientOrders();
        console.log('New client orders after creating samples:', newClientOrders);
        
        if (newClientOrders.length === 0) {
            list.innerHTML = '<p class="text-center">No tienes pedidos registrados</p>';
            return;
        }
        
        newClientOrders.forEach(order => {
            console.log('Processing orders:', newClientOrders.length);
            console.log('Creating card for order', order.id, ':', order);
            const orderCard = createOrderCard(order);
            list.appendChild(orderCard);
        });
    } else {
        clientOrders.forEach(order => {
            console.log('Processing orders:', clientOrders.length);
            console.log('Creating card for order', order.id, ':', order);
            const orderCard = createOrderCard(order);
            list.appendChild(orderCard);
        });
    }
    
    console.log('=== loadClientOrders END ===');
}

function getClientOrders() {
    console.log('Getting client orders for:', currentUser?.email);
    
    try {
        const allOrders = JSON.parse(localStorage.getItem('mordipets_orders') || '[]');
        console.log('All orders from localStorage:', allOrders);
        
        const clientOrders = allOrders.filter(order => {
            console.log('Comparing', order.client_email || order.clientEmail, 'with', currentUser?.email);
            return (order.client_email || order.clientEmail) === currentUser?.email;
        });
        
        console.log('Filtered client orders:', clientOrders);
        return clientOrders;
    } catch (error) {
        console.error('Error parsing orders from localStorage:', error);
        return [];
    }
}

function createSampleOrders() {
    if (!currentUser) return;
    
    const sampleOrders = [
        {
            id: 1,
            client_name: currentUser.name,
            client_email: currentUser.email,
            total: 45000,
            status: 'pending',
            payment_method: 'online',
            created_at: new Date().toISOString(),
            items: [
                { product_id: 1, product_name: 'Galleta Leche x 1000 gr', quantity: 2, price: 15500 },
                { product_id: 2, product_name: 'Galleta Carne x 1000 gr', quantity: 1, price: 16000 }
            ]
        },
        {
            id: 2,
            client_name: currentUser.name,
            client_email: currentUser.email,
            total: 30000,
            status: 'confirmed',
            payment_method: 'contraentrega',
            created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            items: [
                { product_id: 3, product_name: 'Galleta Pollo x 1000 gr', quantity: 2, price: 15000 }
            ]
        }
    ];
    
    // Save to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('mordipets_orders') || '[]');
    const newOrders = [...existingOrders, ...sampleOrders];
    localStorage.setItem('mordipets_orders', JSON.stringify(newOrders));
    
    // Update global orders array
    orders = newOrders;
}

function createOrderCard(order) {
    console.log('createOrderCard called with order:', order);
    
    const card = document.createElement('div');
    card.className = 'order-card';
    
    const statusClass = `status-${order.status}`;
    const statusText = {
        'pending': 'Pendiente',
        'confirmed': 'Aceptado',
        'delivered': 'Entregado'
    };
    
    const orderDate = new Date(order.created_at || order.date);
    const clientName = order.client_name || order.clientName;
    const clientEmail = order.client_email || order.clientEmail;
    const paymentMethod = order.payment_method || order.paymentMethod;
    
    card.innerHTML = `
        <div class="order-header">
            <span class="order-id">Pedido #${order.id}</span>
            <span class="order-status ${statusClass}">${statusText[order.status] || 'Desconocido'}</span>
        </div>
        <div class="order-details">
            <div class="order-detail">
                <label>Cliente</label>
                <span>${clientName}</span>
            </div>
            <div class="order-detail">
                <label>Fecha</label>
                <span>${orderDate.toLocaleDateString()}</span>
            </div>
            <div class="order-detail">
                <label>Total</label>
                <span>$${order.total.toLocaleString('es-CO')}</span>
            </div>
            <div class="order-detail">
                <label>Método de Pago</label>
                <span>${paymentMethod === 'online' ? 'Pago Online' : 'Contraentrega'}</span>
            </div>
        </div>
        <div class="order-items">
            <h5>Productos:</h5>
            ${order.items.map(item => `
                <div class="order-item">
                    <span>${item.product_name || item.name} x${item.quantity}</span>
                    <span>$${((item.price || 0) * item.quantity).toLocaleString('es-CO')}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    return card;
}

function handleAddProduct(e) {
    e.preventDefault();
    
    const newProduct = {
        id: Date.now(),
        code: document.getElementById('productCode').value,
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        weight: parseInt(document.getElementById('productWeight').value)
    };
    
    products.push(newProduct);
    saveToLocalStorage('mordipets_products', products);
    
    closeModal(document.getElementById('addProductModal'));
    loadProductsGrid();
    
    // Clear form
    document.getElementById('addProductForm').reset();
    
    alert('Producto añadido exitosamente');
}

function handleAddIngredient(e) {
    e.preventDefault();
    
    const newIngredient = {
        id: Date.now(),
        name: document.getElementById('ingredientName').value,
        type: document.getElementById('ingredientType').value,
        quantity: parseInt(document.getElementById('ingredientQuantity').value),
        unit: document.getElementById('ingredientUnit').value
    };
    
    ingredients.push(newIngredient);
    saveToLocalStorage('mordipets_ingredients', ingredients);
    
    closeModal(document.getElementById('addIngredientModal'));
    loadIngredientsGrid();
    
    // Clear form
    document.getElementById('addIngredientForm').reset();
    
    alert('Insumo añadido exitosamente');
}

function increaseQuantity(productId) {
    const input = document.getElementById(`qty-${productId}`);
    if (input) {
        const max = parseInt(input.getAttribute('max'));
        const current = parseInt(input.value);
        if (current < max) {
            input.value = current + 1;
        }
    }
}

function decreaseQuantity(productId) {
    const input = document.getElementById(`qty-${productId}`);
    if (input) {
        const current = parseInt(input.value);
        if (current > 1) {
            input.value = current - 1;
        }
    }
}

function addToCartWithQuantity(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const quantityInput = document.getElementById(`qty-${productId}`);
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    
    if (product.stock < quantity) {
        alert('No hay suficiente stock disponible');
        return;
    }
    
    if (!currentUser) {
        alert('Debes iniciar sesión para agregar productos al carrito');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity
        });
    }
    
    // Update stock
    product.stock -= quantity;
    saveToLocalStorage('mordipets_products', products);
    
    updateCartDisplay();
    alert(`${product.name} (${quantity} unidades) agregado al carrito`);
}

function updateCartDisplay() {
    const cartButton = document.querySelector('.cart-button');
    if (cartButton) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartButton.innerHTML = `<i class="fas fa-shopping-cart"></i> Ver Carrito (${totalItems})`;
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
}

function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
        }
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
                    <div class="item-info">
                        <span class="item-name">${item.name}</span>
                        <span class="item-price">$${item.price.toLocaleString('es-CO')} c/u</span>
                    </div>
                    <div class="item-controls">
                        <button class="btn-small btn-remove" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateCartQuantity(${item.id}, parseInt(this.value))">
                    </div>
                    <div class="item-total">$${(item.price * item.quantity).toLocaleString('es-CO')}</div>
                </div>
            `).join('')}
        </div>
        <div class="order-total">
            <strong>Total: $${total.toLocaleString('es-CO')}</strong>
        </div>
    `;
    
    openModal(document.getElementById('orderModal'));
}

function handlePayment(method) {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    if (!currentUser) {
        alert('Debes iniciar sesión para realizar un pedido');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const newOrder = {
        id: Date.now(),
        client_name: currentUser.name,
        client_email: currentUser.email,
        client_phone: currentUser.phone,
        client_location: currentUser.location,
        items: [...cart],
        total: total,
        payment_method: method,
        status: 'pending',
        created_at: new Date().toISOString()
    };
    
    // Save to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('mordipets_orders') || '[]');
    const updatedOrders = [...existingOrders, newOrder];
    localStorage.setItem('mordipets_orders', JSON.stringify(updatedOrders));
    
    // Update global orders array
    orders = updatedOrders;
    
    // Clear cart
    cart = [];
    updateCartDisplay();
    
    closeModal(document.getElementById('orderModal'));
    
    if (method === 'online') {
        alert('Redirigiendo al sistema de pago...');
    } else {
        alert('Pedido realizado exitosamente. Te contactaremos para coordinar la entrega.');
    }
    
    // Reload client data
    loadClientData();
}

function switchAdminSection(section) {
    // Update navigation
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`[data-section="${section}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    // Show/hide sections
    document.querySelectorAll('.admin-section').forEach(sec => {
        sec.classList.add('hidden');
    });
    const targetSection = document.getElementById(`${section}Section`);
    if (targetSection) targetSection.classList.remove('hidden');
}

function switchClientSection(section) {
    console.log('=== switchClientSection START ===');
    console.log('Switching to section:', section);
    
    // Update navigation
    document.querySelectorAll('.client-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`[data-section="${section}"]`);
    console.log('Active button found:', activeBtn);
    if (activeBtn) activeBtn.classList.add('active');
    
    // Show/hide sections
    document.querySelectorAll('.client-section').forEach(sec => {
        sec.style.display = 'none';
    });
    const targetSection = document.getElementById(`${section}Section`);
    console.log('Target section found:', targetSection);
    if (targetSection) {
        targetSection.style.display = 'block';
        console.log('Target section displayed');
        
        // Load client orders if switching to pedidosCliente
        if (section === 'pedidosCliente') {
            console.log('Loading client orders...');
            loadClientOrders();
        }
    }
    
    console.log('=== switchClientSection END ===');
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

function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        saveToLocalStorage('mordipets_orders', orders);
        loadOrdersList();
        alert(`Estado del pedido actualizado a: ${newStatus}`);
    }
}

function editProduct(productId) {
    alert('Funcionalidad de edición en desarrollo');
}

function deleteProduct(productId) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        products = products.filter(p => p.id !== productId);
        saveToLocalStorage('mordipets_products', products);
        loadProductsGrid();
        alert('Producto eliminado exitosamente');
    }
}

function editIngredient(ingredientId) {
    alert('Funcionalidad de edición en desarrollo');
}

function deleteIngredient(ingredientId) {
    if (confirm('¿Estás seguro de que quieres eliminar este insumo?')) {
        ingredients = ingredients.filter(i => i.id !== ingredientId);
        saveToLocalStorage('mordipets_ingredients', ingredients);
        loadIngredientsGrid();
        alert('Insumo eliminado exitosamente');
    }
}

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Add cart button to client panel
document.addEventListener('DOMContentLoaded', function() {
    const clientHeader = document.querySelector('.client-header');
    if (clientHeader) {
        const cartButton = document.createElement('button');
        cartButton.className = 'btn-primary cart-button';
        cartButton.innerHTML = '<i class="fas fa-shopping-cart"></i> Ver Carrito';
        cartButton.onclick = showOrderModal;
        clientHeader.appendChild(cartButton);
    }
});