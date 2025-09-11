// Global Variables
let currentUser = null;
let isAdmin = false;
let products = [];
let ingredients = [];
let orders = [];
let cart = [];

// Password recovery variables
let passwordRecoveryEmail = '';

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
    checkSavedSession();
});

function initializeApp() {
    // Los datos ahora se cargan desde la base de datos PostgreSQL
    // No necesitamos localStorage
}

// Funciones para persistencia de sesión
function saveSession(user) {
    localStorage.setItem('mordipets_session', JSON.stringify({
        user: user,
        isAdmin: user.isAdmin,
        timestamp: Date.now()
    }));
}

function loadSession() {
    const sessionData = localStorage.getItem('mordipets_session');
    if (sessionData) {
        const session = JSON.parse(sessionData);
        // Verificar que la sesión no sea muy antigua (24 horas)
        const maxAge = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
        if (Date.now() - session.timestamp < maxAge) {
            return session;
        } else {
            // Sesión expirada, limpiar
            clearSession();
        }
    }
    return null;
}

function clearSession() {
    localStorage.removeItem('mordipets_session');
    currentUser = null;
    isAdmin = false;
}

function checkSavedSession() {
    const session = loadSession();
    if (session) {
        currentUser = session.user;
        isAdmin = session.isAdmin;
        showUserPanel();
    }
}

function loadSampleData() {
    // Los datos se cargan desde la base de datos PostgreSQL
    // No necesitamos datos de muestra en localStorage
}

function loadPublicProducts() {
    const grid = document.getElementById('productosGrid');
    if (!grid) return;
    
    // Filtrar solo productos que tienen imágenes
    const productsWithImages = products.filter(product => {
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
        return imageMap[product.name];
    });
    
    if (productsWithImages.length === 0) {
        grid.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;"><h3>Próximamente más productos</h3><p>Estamos trabajando en traerte las mejores galletas para tu mascota</p></div>';
        return;
    }
    
    grid.innerHTML = '';
    productsWithImages.forEach(product => {
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
    
    // Login/Register buttons
    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', () => openModal(loginModal));
    }
    
    if (registerBtn && registerModal) {
        registerBtn.addEventListener('click', () => openModal(registerModal));
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
    document.getElementById('editProductForm').addEventListener('submit', handleEditProduct);
    document.getElementById('editIngredientForm').addEventListener('submit', handleEditIngredient);
    
    // Password recovery forms
    document.getElementById('forgotPasswordForm').addEventListener('submit', handleForgotPassword);
    document.getElementById('verifyCodeForm').addEventListener('submit', handleVerifyCode);
    document.getElementById('resetPasswordForm').addEventListener('submit', handleResetPassword);
    
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
    
    // Cart button
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', showCart);
    }
    
    // Add product button
    document.getElementById('addProductBtn').addEventListener('click', () => openModal(addProductModal));
    document.getElementById('addIngredientBtn').addEventListener('click', () => openModal(addIngredientModal));
    
    // Search functionality
    document.getElementById('searchProducts').addEventListener('input', handleSearch);
    
    // Order buttons
    document.getElementById('payNowBtn').addEventListener('click', () => handlePayment('online'));
    document.getElementById('payOnDeliveryBtn').addEventListener('click', () => handlePayment('delivery'));
    
    // Password recovery navigation links
    document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(document.getElementById('loginModal'));
        openModal(document.getElementById('forgotPasswordModal'));
    });
    
    document.getElementById('backToLoginLink').addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(document.getElementById('forgotPasswordModal'));
        openModal(document.getElementById('loginModal'));
    });
    
    document.getElementById('resendCodeLink').addEventListener('click', (e) => {
        e.preventDefault();
        sendVerificationCode(passwordRecoveryEmail);
    });
    
    document.getElementById('backToForgotLink').addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(document.getElementById('verifyCodeModal'));
        openModal(document.getElementById('forgotPasswordModal'));
    });
}

function openModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Por favor, completa todos los campos');
        return;
    }
    
    try {
        // Mostrar indicador de carga
        const submitBtn = document.querySelector('#loginForm button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Iniciando sesión...';
        submitBtn.disabled = true;
        
        // Llamar a la API del servidor
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Login exitoso
            currentUser = {
                id: result.id,
                name: result.name,
                email: result.email,
                phone: result.phone,
                location: result.location,
                isAdmin: result.is_admin
            };
            
            isAdmin = result.is_admin;
            
            // Guardar sesión
            saveSession(currentUser);
            
            closeModal(document.getElementById('loginModal'));
            showUserPanel();
            
            // Clear form
            document.getElementById('loginForm').reset();
            
            alert(`¡Bienvenido ${result.is_admin ? 'Administrador' : 'Cliente'}!`);
        } else {
            alert(`❌ Error: ${result.error}`);
        }
        
    } catch (error) {
        console.error('Error en login:', error);
        alert('❌ Error de conexión. Intenta nuevamente.');
    } finally {
        // Restaurar botón
        const submitBtn = document.querySelector('#loginForm button[type="submit"]');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

async function handleRegister(e) {
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
    
    if (!name || !email || !phone || !location || !password) {
        alert('Por favor, completa todos los campos');
        return;
    }
    
    try {
        // Mostrar indicador de carga
        const submitBtn = document.querySelector('#registerForm button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Registrando...';
        submitBtn.disabled = true;
        
        // Llamar a la API del servidor
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                phone: phone,
                location: location,
                password: password,
                isAdmin: false
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Usuario creado exitosamente
            closeModal(document.getElementById('registerModal'));
            
            // Clear form
            document.getElementById('registerForm').reset();
            
            alert('¡Registro exitoso! Ahora puedes iniciar sesión con tus credenciales.');
        } else {
            alert(`❌ Error: ${result.error}`);
        }
        
    } catch (error) {
        console.error('Error registrando usuario:', error);
        alert('❌ Error de conexión. Intenta nuevamente.');
    } finally {
        // Restaurar botón
        const submitBtn = document.querySelector('#registerForm button[type="submit"]');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function handleLogout() {
    // Limpiar sesión guardada
    clearSession();
    cart = [];
    
    // Hide both panels
    const adminPanel = document.getElementById('adminPanel');
    const clientPanel = document.getElementById('clientPanel');
    
    if (adminPanel) adminPanel.style.display = 'none';
    if (clientPanel) clientPanel.style.display = 'none';
    
    // Show login/register buttons
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    
    if (loginBtn) loginBtn.style.display = 'flex';
    if (registerBtn) registerBtn.style.display = 'flex';
    
    alert('Sesión cerrada exitosamente');
}

function showUserPanel() {
    // Hide login/register buttons
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    
    if (loginBtn) loginBtn.style.display = 'none';
    if (registerBtn) registerBtn.style.display = 'none';
    
    // Hide both panels first
    const adminPanel = document.getElementById('adminPanel');
    const clientPanel = document.getElementById('clientPanel');
    
    if (adminPanel) adminPanel.style.display = 'none';
    if (clientPanel) clientPanel.style.display = 'none';
    
    if (isAdmin) {
        if (adminPanel) {
            adminPanel.style.display = 'block';
            loadAdminData();
            // Scroll to admin panel
            adminPanel.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        if (clientPanel) {
            clientPanel.style.display = 'block';
            loadClientData();
            // Scroll to client panel
            clientPanel.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

async function loadAdminData() {
    await loadProductsFromAPI();
    await loadIngredientsFromAPI();
    await loadOrdersFromAPI();
    loadProductsGrid();
    loadIngredientsGrid();
    loadOrdersList();
}

async function loadClientData() {
    await loadProductsFromAPI();
    await loadOrdersFromAPI();
    loadCatalogGrid();
    loadClientOrders();
    updateCartCount();
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
                <div class="quantity-controls">
                    <button onclick="decreaseQuantity(${product.id})" class="quantity-btn">-</button>
                    <span id="qty-${product.id}" class="quantity-display">1</span>
                    <button onclick="increaseQuantity(${product.id})" class="quantity-btn">+</button>
                </div>
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
    const list = document.getElementById('clientOrdersList');
    if (!list) return;
    
    list.innerHTML = '';
    
    console.log('Total pedidos:', orders.length);
    console.log('Usuario actual:', currentUser?.email);
    
    const clientOrders = orders.filter(order => order.client_email === currentUser.email);
    
    console.log('Pedidos del cliente:', clientOrders.length);
    
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
                <span>${order.client_name || order.clientName}</span>
            </div>
            <div class="order-detail">
                <label>Email</label>
                <span>${order.client_email || order.clientEmail}</span>
            </div>
            <div class="order-detail">
                <label>Teléfono</label>
                <span>${order.client_phone || order.clientPhone || 'No especificado'}</span>
            </div>
            <div class="order-detail">
                <label>Ubicación</label>
                <span>${order.client_location || order.clientLocation || 'No especificado'}</span>
            </div>
            <div class="order-detail">
                <label>Fecha</label>
                <span>${new Date(order.created_at || order.date).toLocaleDateString()}</span>
            </div>
            <div class="order-detail">
                <label>Total</label>
                <span>$${order.total.toLocaleString('es-CO')}</span>
            </div>
            <div class="order-detail">
                <label>Método de Pago</label>
                <span>${order.payment_method === 'online' || order.paymentMethod === 'online' ? 'Pago Online' : 'Contraentrega'}</span>
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

async function handleAddProduct(e) {
    e.preventDefault();
    
    const productData = {
        code: document.getElementById('productCode').value,
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        weight: parseInt(document.getElementById('productWeight').value)
    };
    
    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });
        
        if (response.ok) {
            const newProduct = await response.json();
            products.push(newProduct);
            
            closeModal(document.getElementById('addProductModal'));
            loadProductsGrid();
            
            // Clear form
            document.getElementById('addProductForm').reset();
            
            alert('Producto añadido exitosamente');
        } else {
            const error = await response.json();
            alert(`❌ Error: ${error.error}`);
        }
    } catch (error) {
        console.error('Error agregando producto:', error);
        alert('❌ Error de conexión. Intenta nuevamente.');
    }
}

async function handleAddIngredient(e) {
    e.preventDefault();
    
    const ingredientData = {
        name: document.getElementById('ingredientName').value,
        type: document.getElementById('ingredientType').value,
        quantity: parseInt(document.getElementById('ingredientQuantity').value),
        unit: document.getElementById('ingredientUnit').value
    };
    
    try {
        const response = await fetch('/api/ingredients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ingredientData)
        });
        
        if (response.ok) {
            const newIngredient = await response.json();
            ingredients.push(newIngredient);
            
            closeModal(document.getElementById('addIngredientModal'));
            loadIngredientsGrid();
            
            // Clear form
            document.getElementById('addIngredientForm').reset();
            
            alert('Insumo añadido exitosamente');
        } else {
            const error = await response.json();
            alert(`❌ Error: ${error.error}`);
        }
    } catch (error) {
        console.error('Error agregando ingrediente:', error);
        alert('❌ Error de conexión. Intenta nuevamente.');
    }
}

function increaseQuantity(productId) {
    const qtyElement = document.getElementById(`qty-${productId}`);
    const currentQty = parseInt(qtyElement.textContent);
    const product = products.find(p => p.id === productId);
    
    if (product && currentQty < product.stock) {
        qtyElement.textContent = currentQty + 1;
    }
}

function decreaseQuantity(productId) {
    const qtyElement = document.getElementById(`qty-${productId}`);
    const currentQty = parseInt(qtyElement.textContent);
    
    if (currentQty > 1) {
        qtyElement.textContent = currentQty - 1;
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const qtyElement = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(qtyElement.textContent);
    
    if (product && product.stock >= quantity) {
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
        
        // Reset quantity
        qtyElement.textContent = '1';
        
        updateCartCount();
        alert(`${product.name} agregado al carrito (${quantity} unidades)`);
    } else {
        alert('No hay suficiente stock disponible');
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
    
    const orderData = {
        clientName: currentUser.name,
        clientEmail: currentUser.email,
        clientPhone: currentUser.phone,
        clientLocation: currentUser.location,
        items: [...cart],
        total: total,
        paymentMethod: method
    };
    
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        if (response.ok) {
            const newOrder = await response.json();
            orders.push(newOrder);
            
            // Clear cart
            cart = [];
            updateCartCount();
            
            closeModal(document.getElementById('orderModal'));
            
            if (method === 'online') {
                alert('Redirigiendo al sistema de pago...');
            } else {
                alert('Pedido realizado exitosamente. Te contactaremos para coordinar la entrega.');
            }
            
            // Reload client data
            loadClientData();
        } else {
            const error = await response.json();
            alert(`❌ Error: ${error.error}`);
        }
    } catch (error) {
        console.error('Error creando pedido:', error);
        alert('❌ Error de conexión. Intenta nuevamente.');
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
    console.log('Actualizando pedido:', orderId, 'a estado:', newStatus);
    
    try {
        const response = await fetch(`/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        console.log('Respuesta del servidor:', response.status);
        
        if (response.ok) {
            const updatedOrder = await response.json();
            console.log('Pedido actualizado:', updatedOrder);
            
            const orderIndex = orders.findIndex(o => o.id == orderId);
            if (orderIndex !== -1) {
                orders[orderIndex] = updatedOrder;
            }
            
            loadOrdersList();
            alert(`Estado del pedido actualizado a: ${newStatus}`);
        } else {
            const error = await response.json();
            console.error('Error del servidor:', error);
            alert(`❌ Error: ${error.error}`);
        }
    } catch (error) {
        console.error('Error actualizando pedido:', error);
        alert('❌ Error de conexión. Intenta nuevamente.');
    }
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Fill the edit form with product data
    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductCode').value = product.code;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductDescription').value = product.description;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductStock').value = product.stock;
    document.getElementById('editProductWeight').value = product.weight;
    
    // Open the edit modal
    openModal(document.getElementById('editProductModal'));
}

async function deleteProduct(productId) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                products = products.filter(p => p.id !== productId);
                loadProductsGrid();
                alert('Producto eliminado exitosamente');
            } else {
                const error = await response.json();
                alert(`❌ Error: ${error.error}`);
            }
        } catch (error) {
            console.error('Error eliminando producto:', error);
            alert('❌ Error de conexión. Intenta nuevamente.');
        }
    }
}

function editIngredient(ingredientId) {
    const ingredient = ingredients.find(i => i.id === ingredientId);
    if (!ingredient) return;
    
    // Fill the edit form with ingredient data
    document.getElementById('editIngredientId').value = ingredient.id;
    document.getElementById('editIngredientName').value = ingredient.name;
    document.getElementById('editIngredientType').value = ingredient.type;
    document.getElementById('editIngredientQuantity').value = ingredient.quantity;
    document.getElementById('editIngredientUnit').value = ingredient.unit;
    
    // Open the edit modal
    openModal(document.getElementById('editIngredientModal'));
}

async function deleteIngredient(ingredientId) {
    if (confirm('¿Estás seguro de que quieres eliminar este insumo?')) {
        try {
            const response = await fetch(`/api/ingredients/${ingredientId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                ingredients = ingredients.filter(i => i.id !== ingredientId);
                loadIngredientsGrid();
                alert('Insumo eliminado exitosamente');
            } else {
                const error = await response.json();
                alert(`❌ Error: ${error.error}`);
            }
        } catch (error) {
            console.error('Error eliminando ingrediente:', error);
            alert('❌ Error de conexión. Intenta nuevamente.');
        }
    }
}

// Funciones para cargar datos desde la API
async function loadProductsFromAPI() {
    try {
        const response = await fetch('/api/products');
        if (response.ok) {
            products = await response.json();
        }
    } catch (error) {
        console.error('Error cargando productos:', error);
    }
}

async function loadIngredientsFromAPI() {
    try {
        const response = await fetch('/api/ingredients');
        if (response.ok) {
            ingredients = await response.json();
        }
    } catch (error) {
        console.error('Error cargando ingredientes:', error);
    }
}

async function loadOrdersFromAPI() {
    try {
        const response = await fetch('/api/orders');
        if (response.ok) {
            orders = await response.json();
            console.log('Pedidos cargados:', orders);
        } else {
            console.error('Error en respuesta de pedidos:', response.status);
        }
    } catch (error) {
        console.error('Error cargando pedidos:', error);
    }
}

function showCart() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let cartContent = `
        <h3>Tu Carrito</h3>
        <div class="cart-items">
    `;
    
    cart.forEach(item => {
        cartContent += `
            <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
                <div>
                    <h4 style="margin: 0;">${item.name}</h4>
                    <p style="margin: 0; color: #666;">Cantidad: ${item.quantity}</p>
                </div>
                <div style="text-align: right;">
                    <p style="margin: 0; font-weight: bold;">$${(item.price * item.quantity).toLocaleString('es-CO')}</p>
                    <button onclick="removeFromCart(${item.id})" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Eliminar</button>
                </div>
            </div>
        `;
    });
    
    cartContent += `
        </div>
        <div class="cart-total" style="padding: 20px; background: #f8f9fa; margin-top: 20px; border-radius: 8px;">
            <h3 style="margin: 0; text-align: center;">Total: $${total.toLocaleString('es-CO')}</h3>
        </div>
        <div class="cart-actions" style="margin-top: 20px; text-align: center;">
            <button onclick="checkout()" class="btn-primary" style="margin-right: 10px;">Proceder al Pago</button>
            <button onclick="closeCart()" class="btn-secondary">Cerrar</button>
        </div>
    `;
    
    // Crear modal del carrito
    const cartModal = document.createElement('div');
    cartModal.id = 'cartModal';
    cartModal.className = 'modal';
    cartModal.style.display = 'block';
    cartModal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <span class="close" onclick="closeCart()">&times;</span>
            ${cartContent}
        </div>
    `;
    
    document.body.appendChild(cartModal);
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.remove();
    }
    document.body.style.overflow = 'auto';
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    showCart(); // Refrescar el carrito
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

async function checkout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const orderData = {
        clientName: currentUser.name,
        clientEmail: currentUser.email,
        clientPhone: currentUser.phone || 'No especificado',
        clientLocation: currentUser.location || 'No especificado',
        items: [...cart],
        total: total,
        paymentMethod: 'contraentrega'
    };
    
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        if (response.ok) {
            const newOrder = await response.json();
            orders.push(newOrder);
            
            // Clear cart
            cart = [];
            updateCartCount();
            closeCart();
            
            alert('¡Pedido realizado exitosamente! Te contactaremos para coordinar la entrega.');
            
            // Reload client data
            loadClientData();
        } else {
            const error = await response.json();
            alert(`❌ Error: ${error.error}`);
        }
    } catch (error) {
        console.error('Error creando pedido:', error);
        alert('❌ Error de conexión. Intenta nuevamente.');
    }
}

async function handleEditProduct(e) {
    e.preventDefault();
    
    const productId = parseInt(document.getElementById('editProductId').value);
    const productData = {
        code: document.getElementById('editProductCode').value,
        name: document.getElementById('editProductName').value,
        description: document.getElementById('editProductDescription').value,
        price: parseFloat(document.getElementById('editProductPrice').value),
        stock: parseInt(document.getElementById('editProductStock').value),
        weight: parseInt(document.getElementById('editProductWeight').value)
    };
    
    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });
        
        if (response.ok) {
            const updatedProduct = await response.json();
            const productIndex = products.findIndex(p => p.id === productId);
            if (productIndex !== -1) {
                products[productIndex] = updatedProduct;
            }
            
            closeModal(document.getElementById('editProductModal'));
            loadProductsGrid();
            
            // Clear form
            document.getElementById('editProductForm').reset();
            
            alert('Producto actualizado exitosamente');
        } else {
            const error = await response.json();
            alert(`❌ Error: ${error.error}`);
        }
    } catch (error) {
        console.error('Error actualizando producto:', error);
        alert('❌ Error de conexión. Intenta nuevamente.');
    }
}

async function handleEditIngredient(e) {
    e.preventDefault();
    
    const ingredientId = parseInt(document.getElementById('editIngredientId').value);
    const ingredientData = {
        name: document.getElementById('editIngredientName').value,
        type: document.getElementById('editIngredientType').value,
        quantity: parseInt(document.getElementById('editIngredientQuantity').value),
        unit: document.getElementById('editIngredientUnit').value
    };
    
    try {
        const response = await fetch(`/api/ingredients/${ingredientId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ingredientData)
        });
        
        if (response.ok) {
            const updatedIngredient = await response.json();
            const ingredientIndex = ingredients.findIndex(i => i.id === ingredientId);
            if (ingredientIndex !== -1) {
                ingredients[ingredientIndex] = updatedIngredient;
            }
            
            closeModal(document.getElementById('editIngredientModal'));
            loadIngredientsGrid();
            
            // Clear form
            document.getElementById('editIngredientForm').reset();
            
            alert('Insumo actualizado exitosamente');
        } else {
            const error = await response.json();
            alert(`❌ Error: ${error.error}`);
        }
    } catch (error) {
        console.error('Error actualizando ingrediente:', error);
        alert('❌ Error de conexión. Intenta nuevamente.');
    }
}

// Password Recovery Functions
function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('forgotEmail').value;
    
    if (!email) {
        alert('Por favor, ingresa tu correo electrónico');
        return;
    }
    
    // La verificación de email se hace en el servidor
    // No necesitamos verificar aquí
    
    passwordRecoveryEmail = email;
    sendVerificationCode(email);
}

async function sendVerificationCode(email) {
    try {
        // Mostrar indicador de carga
        const submitBtn = document.querySelector('#forgotPasswordForm button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        // Llamar a la API del servidor
        const response = await fetch('/api/auth/send-verification-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Mostrar mensaje de éxito
            alert(`✅ Código de verificación enviado a ${email}\n\nRevisa tu bandeja de entrada (y carpeta de spam) para obtener el código.`);
            
            // Close forgot password modal and open verification modal
            closeModal(document.getElementById('forgotPasswordModal'));
            openModal(document.getElementById('verifyCodeModal'));
            
            // Clear the email input
            document.getElementById('forgotEmail').value = '';
        } else {
            alert(`❌ Error: ${result.error}`);
        }
        
    } catch (error) {
        console.error('Error enviando código:', error);
        alert('❌ Error de conexión. Intenta nuevamente.');
    } finally {
        // Restaurar botón
        const submitBtn = document.querySelector('#forgotPasswordForm button[type="submit"]');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

async function handleVerifyCode(e) {
    e.preventDefault();
    
    const enteredCode = document.getElementById('verificationCode').value;
    
    if (!enteredCode) {
        alert('Por favor, ingresa el código de verificación');
        return;
    }
    
    try {
        // Mostrar indicador de carga
        const submitBtn = document.querySelector('#verifyCodeForm button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Verificando...';
        submitBtn.disabled = true;
        
        // Verificar código con el servidor
        const response = await fetch('/api/auth/verify-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: passwordRecoveryEmail,
                code: enteredCode
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Code is correct, proceed to reset password
            closeModal(document.getElementById('verifyCodeModal'));
            openModal(document.getElementById('resetPasswordModal'));
            
            // Clear the code input
            document.getElementById('verificationCode').value = '';
        } else {
            alert(`❌ Error: ${result.error}`);
        }
        
    } catch (error) {
        console.error('Error verificando código:', error);
        alert('❌ Error de conexión. Intenta nuevamente.');
    } finally {
        // Restaurar botón
        const submitBtn = document.querySelector('#verifyCodeForm button[type="submit"]');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

async function handleResetPassword(e) {
    e.preventDefault();
    
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;
    
    if (!newPassword || !confirmPassword) {
        alert('Por favor, completa todos los campos');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    try {
        // Mostrar indicador de carga
        const submitBtn = document.querySelector('#resetPasswordForm button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Actualizando...';
        submitBtn.disabled = true;
        
        // Llamar a la API del servidor
        const response = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: passwordRecoveryEmail,
                code: document.getElementById('verificationCode').value,
                newPassword: newPassword
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Close reset password modal and show success
            closeModal(document.getElementById('resetPasswordModal'));
            
            let successMessage = '¡Contraseña actualizada exitosamente! Ya puedes iniciar sesión con tu nueva contraseña.';
            if (result.emailSent) {
                successMessage += '\n\n📧 Se ha enviado un email de confirmación a tu correo.';
            }
            
            alert(successMessage);
            
            // Open login modal
            openModal(document.getElementById('loginModal'));
            
            // Clear all forms
            document.getElementById('forgotEmail').value = '';
            document.getElementById('verificationCode').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmNewPassword').value = '';
            
            // Reset variables
            passwordRecoveryEmail = '';
        } else {
            alert(`❌ Error: ${result.error}`);
        }
        
    } catch (error) {
        console.error('Error actualizando contraseña:', error);
        alert('❌ Error de conexión. Intenta nuevamente.');
    } finally {
        // Restaurar botón
        const submitBtn = document.querySelector('#resetPasswordForm button[type="submit"]');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}