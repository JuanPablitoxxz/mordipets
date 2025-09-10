// Global Variables
let currentUser = null;
let isAdmin = false;
let products = [];
let ingredients = [];
let orders = [];
let cart = [];

// Sample data - Solo productos con imágenes disponibles
const sampleProducts = [
    { id: 1, code: '10', name: 'Galleta Leche x 1000 gr', price: 15500, stock: 25, weight: 1000, description: 'Deliciosas galletas de leche para perros' },
    { id: 2, code: '20', name: 'Galleta Carne x 1000 gr', price: 16000, stock: 30, weight: 1000, description: 'Galletas con sabor a carne' },
    { id: 3, code: '30', name: 'Galleta Pollo x 1000 gr', price: 15750, stock: 20, weight: 1000, description: 'Galletas de pollo nutritivas' },
    { id: 4, code: '40', name: 'Galleta Higado x 1000 gr', price: 17000, stock: 15, weight: 1000, description: 'Galletas de hígado ricas en hierro' },
    { id: 5, code: '50', name: 'Galleta Espinaca x 1000 gr', price: 16250, stock: 18, weight: 1000, description: 'Galletas con espinaca para perros' },
    { id: 6, code: '60', name: 'Galleta Zanahoria x 1000 gr', price: 15000, stock: 22, weight: 1000, description: 'Galletas de zanahoria saludables' },
    { id: 7, code: '70', name: 'Galleta Avena x 1000 gr', price: 14750, stock: 28, weight: 1000, description: 'Galletas de avena energéticas' },
    { id: 8, code: '101', name: 'Galleta Mixta x 1000 gr', price: 17250, stock: 25, weight: 1000, description: 'Mezcla de sabores' }
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
    
    // Mapeo exacto de productos a imágenes disponibles
    const imageMap = {
        'Galleta Leche x 1000 gr': 'GalletasLechee.jpg',
        'Galleta Carne x 1000 gr': 'galletasCarne.jpg',
        'Galleta Pollo x 1000 gr': 'galletasPollo.jpg',
        'Galleta Higado x 1000 gr': 'galletasHigado.jpg',
        'Galleta Espinaca x 1000 gr': 'galletasEspinaca.jpg',
        'Galleta Zanahoria x 1000 gr': 'galletasZanahoria.jpg',
        'Galleta Avena x 1000 gr': 'galletasAvena.jpg',
        'Galleta Mixta x 1000 gr': 'galletasMixtas.jpg'
    };
    
    const imageName = imageMap[product.name] || 'galletasMixtas.jpg';
    
    card.innerHTML = `
        <div class="producto-image">
            <img src="images/${imageName}" alt="${product.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
        </div>
        <div class="producto-info" style="padding: 15px;">
            <h4 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #333;">${product.name}</h4>
            <p class="producto-description" style="margin: 0; font-size: 14px; color: #666; line-height: 1.4;">${product.description}</p>
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
    
    console.log('Login button found:', loginBtn);
    console.log('Register button found:', registerBtn);
    console.log('Login modal found:', loginModal);
    console.log('Register modal found:', registerModal);
    
    // Login/Register buttons
    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', () => {
            console.log('Login button clicked');
            openModal(loginModal);
        });
    }
    
    if (registerBtn && registerModal) {
        registerBtn.addEventListener('click', () => {
            console.log('Register button clicked');
            openModal(registerModal);
        });
    }
    
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
    
    // Simple validation (in a real app, this would be server-side)
    if (email && password) {
        // Check if it's admin login (simple check)
        const isAdminCheck = email === 'admin@mordipets.com' || email === 'admin@admin.com';
        
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
        
        alert(`¡Bienvenido ${isAdminCheck ? 'Administrador' : 'Cliente'}!`);
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
    console.log('showUserPanel called, isAdmin:', isAdmin);
    console.log('currentUser:', currentUser);
    
    // Hide login/register buttons
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    console.log('Login button:', loginBtn);
    console.log('Register button:', registerBtn);
    
    if (loginBtn) loginBtn.style.display = 'none';
    if (registerBtn) registerBtn.style.display = 'none';
    
    if (isAdmin) {
        console.log('Showing admin panel');
        const adminPanel = document.getElementById('adminPanel');
        console.log('Admin panel element:', adminPanel);
        if (adminPanel) {
            adminPanel.classList.remove('hidden');
            loadAdminData();
        }
    } else {
        console.log('Showing client panel');
        const clientPanel = document.getElementById('clientPanel');
        console.log('Client panel element:', clientPanel);
        if (clientPanel) {
            clientPanel.classList.remove('hidden');
            loadClientData();
        }
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
    
    const clientOrders = orders.filter(order => order.clientEmail === currentUser.email);
    
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
                <span>${order.clientName}</span>
            </div>
            <div class="order-detail">
                <label>Fecha</label>
                <span>${new Date(order.date).toLocaleDateString()}</span>
            </div>
            <div class="order-detail">
                <label>Total</label>
                <span>$${order.total.toLocaleString('es-CO')}</span>
            </div>
            <div class="order-detail">
                <label>Método de Pago</label>
                <span>${order.paymentMethod === 'online' ? 'Pago Online' : 'Contraentrega'}</span>
            </div>
        </div>
        <div class="order-items">
            <h5>Productos:</h5>
            ${order.items.map(item => `
                <div class="order-item">
                    <span>${item.name} x${item.quantity}</span>
                    <span>$${(item.price * item.quantity).toLocaleString('es-CO')}</span>
                </div>
            `).join('')}
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
        
        // Update stock
        product.stock -= 1;
        saveToLocalStorage('mordipets_products', products);
        
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

function handlePayment(method) {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const newOrder = {
        id: Date.now(),
        clientName: currentUser.name,
        clientEmail: currentUser.email,
        clientPhone: currentUser.phone,
        clientLocation: currentUser.location,
        items: [...cart],
        total: total,
        paymentMethod: method,
        status: 'pending',
        date: new Date().toISOString()
    };
    
    orders.push(newOrder);
    saveToLocalStorage('mordipets_orders', orders);
    
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
    // In a real application, this would open an edit modal
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
    // In a real application, this would open an edit modal
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