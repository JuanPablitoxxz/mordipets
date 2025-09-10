// Variables globales
let usuarioActual = null;
let esAdministrador = false;
let productos = [];
let ingredientes = [];
let pedidos = [];
let carrito = [];

// URL base de la API
const URL_BASE_API = window.location.origin;

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    inicializarAplicacion();
    configurarEventos();
    cargarDatosDesdeAPI();
});

async function inicializarAplicacion() {
    // Cargar datos desde la API en lugar de localStorage
    await cargarDatosDesdeAPI();
}

async function cargarDatosDesdeAPI() {
    try {
        // Cargar productos
        const respuestaProductos = await fetch(`${URL_BASE_API}/api/products`);
        if (respuestaProductos.ok) {
            productos = await respuestaProductos.json();
        }

        // Cargar ingredientes
        const respuestaIngredientes = await fetch(`${URL_BASE_API}/api/ingredients`);
        if (respuestaIngredientes.ok) {
            ingredientes = await respuestaIngredientes.json();
        }

        // Cargar pedidos
        const respuestaPedidos = await fetch(`${URL_BASE_API}/api/orders`);
        if (respuestaPedidos.ok) {
            pedidos = await respuestaPedidos.json();
        }

        console.log('✅ Datos cargados desde la API');
        
        // Cargar productos en la sección pública
        cargarProductosPublicos();
    } catch (error) {
        console.error('❌ Error cargando datos desde la API:', error);
        // Fallback a localStorage si la API falla
        cargarDesdeLocalStorage();
        cargarProductosPublicos();
    }
}

function cargarDesdeLocalStorage() {
    // Fallback a localStorage si la API no está disponible
    const productosGuardados = localStorage.getItem('mordipets_productos');
    const ingredientesGuardados = localStorage.getItem('mordipets_ingredientes');
    const pedidosGuardados = localStorage.getItem('mordipets_pedidos');
    
    if (productosGuardados) {
        productos = JSON.parse(productosGuardados);
    }
    
    if (ingredientesGuardados) {
        ingredientes = JSON.parse(ingredientesGuardados);
    }
    
    if (pedidosGuardados) {
        pedidos = JSON.parse(pedidosGuardados);
    }
}

// Función para cargar productos en la sección pública
function cargarProductosPublicos() {
    const productosGrid = document.getElementById('productosGrid');
    if (!productosGrid) return;
    
    productosGrid.innerHTML = '';
    
    // Lista de todas las galletas disponibles con sus imágenes
    const galletasDisponibles = [
        { nombre: 'Galleta Leche', imagen: 'images/GalletasLechee.jpg' },
        { nombre: 'Galleta Carne', imagen: 'images/galletasCarne.jpg' },
        { nombre: 'Galleta Pollo', imagen: 'images/galletasPollo.jpg' },
        { nombre: 'Galleta Hígado', imagen: 'images/galletasHigado.jpg' },
        { nombre: 'Galleta Espinaca', imagen: 'images/galletasEspinaca.jpg' },
        { nombre: 'Galleta Zanahoria', imagen: 'images/galletasZanahoria.jpg' },
        { nombre: 'Galleta Avena', imagen: 'images/galletasAvena.jpg' },
        { nombre: 'Galleta Mixta', imagen: 'images/galletasMixtas.jpg' }
    ];
    
    galletasDisponibles.forEach(galleta => {
        const productoCard = crearTarjetaGalleta(galleta);
        productosGrid.appendChild(productoCard);
    });
}

// Función para crear tarjeta de galleta en la sección pública
function crearTarjetaGalleta(galleta) {
    const card = document.createElement('div');
    card.className = 'producto-card';
    
    card.innerHTML = `
        <img src="${galleta.imagen}" alt="${galleta.nombre}" class="producto-image" onerror="this.src='images/logo.jpg'">
        <div class="producto-info">
            <h3>${galleta.nombre}</h3>
            <p class="producto-description">Deliciosa galleta para tu mascota</p>
        </div>
    `;
    
    return card;
}

// Función para crear tarjeta de producto en la sección pública (mantenida para compatibilidad)
function crearTarjetaProductoPublico(producto) {
    const card = document.createElement('div');
    card.className = 'producto-card';
    
    // Mapeo de imágenes de productos
    const imagenesProductos = {
        'Galleta Leche': 'images/GalletasLechee.jpg',
        'Galleta Carne': 'images/galletasCarne.jpg',
        'Galleta Pollo': 'images/galletasPollo.jpg',
        'Galleta Hígado': 'images/galletasHigado.jpg',
        'Galleta Espinaca': 'images/galletasEspinaca.jpg',
        'Galleta Zanahoria': 'images/galletasZanahoria.jpg',
        'Galleta Avena': 'images/galletasAvena.jpg',
        'Galleta Mixta': 'images/galletasMixtas.jpg'
    };
    
    const imagenSrc = imagenesProductos[producto.name] || 'images/logo.jpg';
    
    card.innerHTML = `
        <img src="${imagenSrc}" alt="${producto.name}" class="producto-image" onerror="this.src='images/logo.jpg'">
        <div class="producto-info">
            <h3>${producto.name}</h3>
            <p class="producto-description">${producto.description || 'Deliciosa galleta para tu mascota'}</p>
        </div>
    `;
    
    return card;
}

// Función para agregar producto al carrito desde la sección pública
function agregarAlCarritoPublico(productoId) {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;
    
    if (producto.stock === 0) {
        alert('Este producto está agotado');
        return;
    }
    
    // Verificar si el usuario está logueado
    if (!usuarioActual) {
        alert('Debes iniciar sesión para agregar productos al carrito');
        document.getElementById('loginBtn').click();
        return;
    }
    
    // Agregar al carrito
    const itemExistente = carrito.find(item => item.id === productoId);
    if (itemExistente) {
        itemExistente.quantity += 1;
    } else {
        carrito.push({
            id: producto.id,
            name: producto.name,
            price: producto.price,
            quantity: 1
        });
    }
    
    alert(`${producto.name} agregado al carrito`);
}

// Función para manejar el formulario de contacto
async function manejarContacto(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('contactoNombre').value;
    const correo = document.getElementById('contactoEmail').value;
    const telefono = document.getElementById('contactoTelefono').value;
    const asunto = document.getElementById('contactoAsunto').value;
    const mensaje = document.getElementById('contactoMensaje').value;
    
    if (!nombre || !correo || !asunto || !mensaje) {
        alert('Por favor, completa todos los campos obligatorios');
        return;
    }
    
    try {
        // Simular envío del formulario (en una aplicación real, esto enviaría a un servidor)
        const datosContacto = {
            nombre,
            correo,
            telefono,
            asunto,
            mensaje,
            fecha: new Date().toISOString()
        };
        
        // Guardar en localStorage como ejemplo
        const contactos = JSON.parse(localStorage.getItem('mordipets_contactos') || '[]');
        contactos.push(datosContacto);
        localStorage.setItem('mordipets_contactos', JSON.stringify(contactos));
        
        alert('¡Mensaje enviado exitosamente! Te contactaremos pronto.');
        
        // Limpiar formulario
        document.getElementById('contactoForm').reset();
        
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        alert('Error al enviar el mensaje. Inténtalo de nuevo.');
    }
}

function configurarEventos() {
    // Controles de modales
    const botonIniciarSesion = document.getElementById('loginBtn');
    const botonRegistrarse = document.getElementById('registerBtn');
    const modalIniciarSesion = document.getElementById('loginModal');
    const modalRegistrarse = document.getElementById('registerModal');
    const modalAgregarProducto = document.getElementById('addProductModal');
    const modalAgregarIngrediente = document.getElementById('addIngredientModal');
    const modalPedido = document.getElementById('orderModal');
    
    // Botones de inicio de sesión y registro
    botonIniciarSesion.addEventListener('click', () => abrirModal(modalIniciarSesion));
    botonRegistrarse.addEventListener('click', () => abrirModal(modalRegistrarse));
    
    // Cerrar modales
    document.querySelectorAll('.close').forEach(botonCerrar => {
        botonCerrar.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            cerrarModal(modal);
        });
    });
    
    // Cerrar modales al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            cerrarModal(e.target);
        }
    });
    
    // Formularios
    document.getElementById('loginForm').addEventListener('submit', manejarInicioSesion);
    document.getElementById('registerForm').addEventListener('submit', manejarRegistro);
    document.getElementById('contactoForm').addEventListener('submit', manejarContacto);
    document.getElementById('addProductForm').addEventListener('submit', handleAddProduct);
    document.getElementById('addIngredientForm').addEventListener('submit', handleAddIngredient);
    
    // Navegación de administrador
    document.querySelectorAll('.admin-nav-btn').forEach(boton => {
        boton.addEventListener('click', (e) => {
            switchAdminSection(e.target.dataset.section);
        });
    });
    
    // Navegación de cliente
    document.querySelectorAll('.client-nav-btn').forEach(boton => {
        boton.addEventListener('click', (e) => {
            switchClientSection(e.target.dataset.section);
        });
    });
    
    // Botones de cerrar sesión
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('clientLogoutBtn').addEventListener('click', handleLogout);
    
    // Botón agregar producto
    document.getElementById('addProductBtn').addEventListener('click', () => abrirModal(modalAgregarProducto));
    document.getElementById('addIngredientBtn').addEventListener('click', () => abrirModal(modalAgregarIngrediente));
    
    // Funcionalidad de búsqueda
    document.getElementById('searchProducts').addEventListener('input', handleProductSearch);
    
    // Funcionalidad de filtros
    document.getElementById('stockFilter').addEventListener('change', handleProductFilter);
    document.getElementById('sortProducts').addEventListener('change', handleProductSort);
    document.getElementById('clearFiltersBtn').addEventListener('click', clearProductFilters);
    
    // Funcionalidad de filtros del catálogo
    document.getElementById('availabilityFilter').addEventListener('change', handleCatalogFilter);
    document.getElementById('sortCatalog').addEventListener('change', handleCatalogSort);
    
    // Botones de pedido
    document.getElementById('payNowBtn').addEventListener('click', () => handlePayment('online'));
    document.getElementById('payOnDeliveryBtn').addEventListener('click', () => handlePayment('delivery'));
    
    // Navegación suave para enlaces del menú
    document.querySelectorAll('.nav-link').forEach(enlace => {
        enlace.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = enlace.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function abrirModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function cerrarModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

async function manejarInicioSesion(e) {
    e.preventDefault();
    
    const correoElectronico = document.getElementById('loginEmail').value;
    const contrasena = document.getElementById('loginPassword').value;
    
    if (correoElectronico && contrasena) {
        try {
            // Intentar con la API primero
            const respuesta = await fetch(`${URL_BASE_API}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: correoElectronico,
                    password: contrasena
                })
            });
            
            if (respuesta.ok) {
                const usuario = await respuesta.json();
                
                usuarioActual = {
                    id: usuario.id,
                    name: usuario.name,
                    email: usuario.email,
                    phone: usuario.phone,
                    location: usuario.location,
                    isAdmin: usuario.is_admin
                };
                
                esAdministrador = usuario.is_admin;
                
                cerrarModal(document.getElementById('loginModal'));
                showUserPanel();
                
                // Limpiar formulario
                document.getElementById('loginForm').reset();
                
                alert(`¡Bienvenido ${usuario.name}!`);
            } else {
                const error = await respuesta.json();
                alert(`Error al iniciar sesión: ${error.error || 'Credenciales incorrectas'}`);
            }
        } catch (error) {
            console.error('Error con la API:', error);
            
            // Fallback: verificar credenciales por defecto
            if (correoElectronico === 'admin@mordipets.com' && contrasena === 'admin123') {
                // Usuario administrador por defecto
                usuarioActual = {
                    id: 1,
                    name: 'Administrador',
                    email: 'admin@mordipets.com',
                    phone: '123456789',
                    location: 'Madrid, Cundinamarca',
                    isAdmin: true
                };
                
                esAdministrador = true;
                
                cerrarModal(document.getElementById('loginModal'));
                showUserPanel();
                
                // Limpiar formulario
                document.getElementById('loginForm').reset();
                
                alert('¡Bienvenido Administrador!');
            } else if (correoElectronico === 'cliente@test.com' && contrasena === 'cliente123') {
                // Usuario cliente de prueba
                usuarioActual = {
                    id: 2,
                    name: 'Cliente Prueba',
                    email: 'cliente@test.com',
                    phone: '987654321',
                    location: 'Madrid, Cundinamarca',
                    isAdmin: false
                };
                
                esAdministrador = false;
                
                cerrarModal(document.getElementById('loginModal'));
                showUserPanel();
                
                // Limpiar formulario
                document.getElementById('loginForm').reset();
                
                alert('¡Bienvenido Cliente!');
            } else {
                alert('Credenciales incorrectas. Usa:\nAdmin: admin@mordipets.com / admin123\nCliente: cliente@test.com / cliente123');
            }
        }
    } else {
        alert('Por favor, completa todos los campos');
    }
}

async function manejarRegistro(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('regName').value;
    const correoElectronico = document.getElementById('regEmail').value;
    const telefono = document.getElementById('regPhone').value;
    const ubicacion = document.getElementById('regLocation').value;
    const contrasena = document.getElementById('regPassword').value;
    const confirmarContrasena = document.getElementById('regConfirmPassword').value;
    
    if (contrasena !== confirmarContrasena) {
        alert('Las contraseñas no coinciden');
        return;
    }
    
    if (nombre && correoElectronico && telefono && ubicacion && contrasena) {
        try {
            // Crear usuario en la base de datos
            const respuesta = await fetch(`${URL_BASE_API}/api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: nombre,
                    email: correoElectronico,
                    phone: telefono,
                    location: ubicacion,
                    password: contrasena,
                    isAdmin: false
                })
            });
            
            if (response.ok) {
                const newUser = await response.json();
                
                currentUser = {
                    id: newUser.id,
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
                const error = await response.json();
                alert(`Error al registrarse: ${error.error || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al registrarse. Inténtalo de nuevo.');
        }
    } else {
        alert('Por favor, completa todos los campos');
    }
}

function handleLogout() {
    usuarioActual = null;
    esAdministrador = false;
    carrito = [];
    
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('clientPanel').style.display = 'none';
    
    // Show main content sections
    document.getElementById('productos').style.display = 'block';
    document.getElementById('nosotros').style.display = 'block';
    document.getElementById('contacto').style.display = 'block';
    
    // Show login/register buttons
    document.getElementById('loginBtn').style.display = 'flex';
    document.getElementById('registerBtn').style.display = 'flex';
}

function showUserPanel() {
    // Hide login/register buttons
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('registerBtn').style.display = 'none';
    
    // Hide main content sections
    document.getElementById('productos').style.display = 'none';
    document.getElementById('nosotros').style.display = 'none';
    document.getElementById('contacto').style.display = 'none';
    
    if (esAdministrador) {
        document.getElementById('adminPanel').style.display = 'block';
        loadAdminData();
    } else {
        document.getElementById('clientPanel').style.display = 'block';
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
        const catalogCard = createProductCard(product, false);
        grid.appendChild(catalogCard);
    });
}

function createProductCard(product, isAdmin = false) {
    const card = document.createElement('div');
    card.className = isAdmin ? 'product-card' : 'catalog-card';
    
    // Para admin: mostrar stock exacto
    // Para cliente: mostrar estado más amigable
    let stockClass, stockText;
    
    if (isAdmin) {
        stockClass = product.stock > 10 ? 'stock' : product.stock > 0 ? 'stock low' : 'stock out';
        stockText = product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock';
    } else {
        // Para clientes: mostrar estado más amigable
        if (product.stock > 10) {
            stockClass = 'stock';
            stockText = 'Disponible';
        } else if (product.stock > 0) {
            stockClass = 'stock low';
            stockText = 'Pocas unidades';
        } else {
            stockClass = 'stock out';
            stockText = 'Agotada';
        }
    }
    
    // Agregar clase especial para productos agotados en el catálogo
    if (!isAdmin && product.stock === 0) {
        card.classList.add('out-of-stock');
    }
    
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
                    <i class="fas fa-cart-plus"></i> ${product.stock === 0 ? 'Agotada' : 'Agregar al Carrito'}
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
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const isEditing = submitBtn.dataset.productId;
    
    const productData = {
        code: document.getElementById('productCode').value,
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        weight: parseInt(document.getElementById('productWeight').value)
    };
    
    try {
        let response;
        if (isEditing) {
            // Update existing product
            response = await fetch(`${API_BASE}/api/products/${isEditing}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });
        } else {
            // Create new product
            response = await fetch(`${API_BASE}/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });
        }
        
        if (response.ok) {
            const updatedProduct = await response.json();
            
            if (isEditing) {
                // Update existing product in array
                const index = products.findIndex(p => p.id === parseInt(isEditing));
                if (index !== -1) {
                    products[index] = updatedProduct;
                }
                alert('Producto actualizado exitosamente');
            } else {
                // Add new product to array
                products.push(updatedProduct);
                alert('Producto añadido exitosamente');
            }
            
            closeModal(document.getElementById('addProductModal'));
            loadProductsGrid();
            
            // Reset form and button
            document.getElementById('addProductForm').reset();
            resetProductForm();
        } else {
            throw new Error(isEditing ? 'Error al actualizar producto' : 'Error al crear producto');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(isEditing ? 'Error al actualizar el producto' : 'Error al añadir el producto');
    }
}

function resetProductForm() {
    const modal = document.getElementById('addProductModal');
    const title = modal.querySelector('h2');
    const submitBtn = modal.querySelector('button[type="submit"]');
    
    title.textContent = 'Añadir Nuevo Producto';
    submitBtn.textContent = 'Añadir Producto';
    delete submitBtn.dataset.productId;
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
    
    // Show/hide sections with animation
    document.querySelectorAll('.admin-section').forEach(sec => {
        sec.classList.add('hidden');
    });
    
    const targetSection = document.getElementById(`${section}Section`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        
        // Add loading state and refresh data
        showSectionLoading(section);
        
        // Load section-specific data
        setTimeout(() => {
            loadSectionData(section);
            hideSectionLoading(section);
        }, 300);
    }
}

function showSectionLoading(section) {
    const targetSection = document.getElementById(`${section}Section`);
    if (targetSection) {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'section-loading';
        loadingDiv.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Cargando ${section}...</span>
            </div>
        `;
        targetSection.appendChild(loadingDiv);
    }
}

function hideSectionLoading(section) {
    const targetSection = document.getElementById(`${section}Section`);
    if (targetSection) {
        const loadingDiv = targetSection.querySelector('.section-loading');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }
}

function loadSectionData(section) {
    switch(section) {
        case 'inventario':
            loadProductsGrid();
            break;
        case 'insumos':
            loadIngredientsGrid();
            break;
        case 'pedidos':
            loadOrdersList();
            break;
    }
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

function handleProductSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(card => {
        const productName = card.querySelector('h4').textContent.toLowerCase();
        const productCode = card.querySelector('p').textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || productCode.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function handleProductFilter(e) {
    const filterValue = e.target.value;
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(card => {
        const stockElement = card.querySelector('.stock');
        const stockText = stockElement.textContent.toLowerCase();
        
        let shouldShow = true;
        
        switch(filterValue) {
            case 'in-stock':
                shouldShow = !stockText.includes('sin stock') && !stockText.includes('stock bajo');
                break;
            case 'low-stock':
                shouldShow = stockText.includes('stock bajo');
                break;
            case 'out-of-stock':
                shouldShow = stockText.includes('sin stock');
                break;
            case 'all':
            default:
                shouldShow = true;
                break;
        }
        
        card.style.display = shouldShow ? 'block' : 'none';
    });
}

function handleProductSort(e) {
    const sortValue = e.target.value;
    const grid = document.getElementById('productsGrid');
    const cards = Array.from(grid.querySelectorAll('.product-card'));
    
    cards.sort((a, b) => {
        switch(sortValue) {
            case 'name':
                return a.querySelector('h4').textContent.localeCompare(b.querySelector('h4').textContent);
            case 'price':
                const priceA = parseFloat(a.querySelector('.price').textContent.replace(/[^0-9.-]+/g, ''));
                const priceB = parseFloat(b.querySelector('.price').textContent.replace(/[^0-9.-]+/g, ''));
                return priceA - priceB;
            case 'stock':
                const stockA = parseInt(a.querySelector('.stock').textContent.replace(/[^0-9]+/g, '') || 0);
                const stockB = parseInt(b.querySelector('.stock').textContent.replace(/[^0-9]+/g, '') || 0);
                return stockB - stockA;
            case 'date':
                // For now, just return 0 since we don't have date info
                return 0;
            default:
                return 0;
        }
    });
    
    // Re-append sorted cards
    cards.forEach(card => grid.appendChild(card));
}

function clearProductFilters() {
    // Reset search input
    document.getElementById('searchProducts').value = '';
    
    // Reset filter selects
    document.getElementById('stockFilter').value = 'all';
    document.getElementById('sortProducts').value = 'name';
    
    // Show all products
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        card.style.display = 'block';
    });
    
    // Reload products grid to reset order
    loadProductsGrid();
}

function handleCatalogFilter(e) {
    const filterValue = e.target.value;
    const cards = document.querySelectorAll('.catalog-card');
    
    cards.forEach(card => {
        const stockElement = card.querySelector('.stock');
        const stockText = stockElement.textContent.toLowerCase();
        
        let shouldShow = true;
        
        switch(filterValue) {
            case 'available':
                shouldShow = stockText.includes('disponible');
                break;
            case 'low-stock':
                shouldShow = stockText.includes('pocas unidades');
                break;
            case 'out-of-stock':
                shouldShow = stockText.includes('agotada');
                break;
            case 'all':
            default:
                shouldShow = true;
                break;
        }
        
        card.style.display = shouldShow ? 'block' : 'none';
    });
}

function handleCatalogSort(e) {
    const sortValue = e.target.value;
    const grid = document.getElementById('catalogGrid');
    const cards = Array.from(grid.querySelectorAll('.catalog-card'));
    
    cards.sort((a, b) => {
        switch(sortValue) {
            case 'name':
                return a.querySelector('h4').textContent.localeCompare(b.querySelector('h4').textContent);
            case 'price':
                const priceA = parseFloat(a.querySelector('.price').textContent.replace(/[^0-9.-]+/g, ''));
                const priceB = parseFloat(b.querySelector('.price').textContent.replace(/[^0-9.-]+/g, ''));
                return priceA - priceB;
            case 'availability':
                const stockA = a.querySelector('.stock').textContent.toLowerCase();
                const stockB = b.querySelector('.stock').textContent.toLowerCase();
                
                // Disponible primero, luego pocas unidades, luego agotadas
                if (stockA.includes('disponible') && !stockB.includes('disponible')) return -1;
                if (!stockA.includes('disponible') && stockB.includes('disponible')) return 1;
                if (stockA.includes('pocas') && stockB.includes('agotada')) return -1;
                if (stockA.includes('agotada') && stockB.includes('pocas')) return 1;
                return 0;
            default:
                return 0;
        }
    });
    
    // Re-append sorted cards
    cards.forEach(card => grid.appendChild(card));
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
    const product = products.find(p => p.id === productId);
    if (!product) {
        alert('Producto no encontrado');
        return;
    }
    
    // Fill the form with existing data
    document.getElementById('productCode').value = product.code;
    document.getElementById('productName').value = product.name;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productWeight').value = product.weight;
    
    // Change form title and button
    const modal = document.getElementById('addProductModal');
    const title = modal.querySelector('h2');
    const submitBtn = modal.querySelector('button[type="submit"]');
    
    title.textContent = 'Editar Producto';
    submitBtn.textContent = 'Actualizar Producto';
    
    // Store the product ID for updating
    submitBtn.dataset.productId = productId;
    
    // Open modal
    openModal(modal);
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
