const fs = require('fs');

// Leer el archivo original
const contenido = fs.readFileSync('public/js/script-api.js', 'utf8');

// Mapeo de traducciones (revertir a inglés)
const traducciones = {
    // Variables globales
    'usuarioActual': 'currentUser',
    'esAdministrador': 'isAdmin', 
    'productos': 'products',
    'ingredientes': 'ingredients',
    'pedidos': 'orders',
    'carrito': 'cart',
    'URL_BASE_API': 'API_BASE',
    
    // Funciones principales
    'inicializarAplicacion': 'initializeApp',
    'configurarEventos': 'setupEventListeners',
    'cargarDatosDesdeAPI': 'loadDataFromAPI',
    'cargarDesdeLocalStorage': 'loadFromLocalStorage',
    'abrirModal': 'openModal',
    'cerrarModal': 'closeModal',
    
    // Funciones de autenticación
    'manejarInicioSesion': 'handleLogin',
    'manejarRegistro': 'handleRegister',
    'manejarCerrarSesion': 'handleLogout',
    
    // Funciones de productos
    'manejarAgregarProducto': 'handleAddProduct',
    'manejarBusquedaProductos': 'handleProductSearch',
    'manejarFiltroProductos': 'handleProductFilter',
    'manejarOrdenamientoProductos': 'handleProductSort',
    'limpiarFiltrosProductos': 'clearProductFilters',
    'cargarGrillaProductos': 'loadProductsGrid',
    'crearTarjetaProducto': 'createProductCard',
    'editarProducto': 'editProduct',
    'eliminarProducto': 'deleteProduct',
    
    // Funciones de ingredientes
    'manejarAgregarIngrediente': 'handleAddIngredient',
    'cargarGrillaIngredientes': 'loadIngredientsGrid',
    'crearTarjetaIngrediente': 'createIngredientCard',
    'editarIngrediente': 'editIngredient',
    'eliminarIngrediente': 'deleteIngredient',
    
    // Funciones de pedidos
    'manejarPago': 'handlePayment',
    'cargarGrillaPedidos': 'loadOrdersList',
    'crearTarjetaPedido': 'createOrderCard',
    'actualizarEstadoPedido': 'updateOrderStatus',
    
    // Funciones de catálogo
    'cargarGrillaCatalogo': 'loadCatalogGrid',
    'manejarFiltroCatalogo': 'handleCatalogFilter',
    'manejarOrdenamientoCatalogo': 'handleCatalogSort',
    
    // Funciones de UI
    'mostrarPanelUsuario': 'showUserPanel',
    'mostrarInterfazAdministrador': 'showAdminInterface',
    'mostrarInterfazCliente': 'showClientInterface',
    'cambiarSeccionAdmin': 'switchAdminSection',
    'cambiarSeccionCliente': 'switchClientSection',
    'mostrarNotificacion': 'showNotification',
    'reiniciarFormularioProducto': 'resetProductForm',
    
    // Variables locales comunes
    'respuesta': 'response',
    'usuario': 'user',
    'nuevoUsuario': 'newUser',
    'producto': 'product',
    'ingrediente': 'ingredient',
    'pedido': 'order',
    'correoElectronico': 'email',
    'contrasena': 'password',
    'nombre': 'name',
    'telefono': 'phone',
    'ubicacion': 'location',
    'confirmarContrasena': 'confirmPassword',
    'botonIniciarSesion': 'loginBtn',
    'botonRegistrarse': 'registerBtn',
    'botonCerrarSesion': 'logoutBtn',
    'botonAdministrador': 'adminBtn',
    'botonCliente': 'clientBtn',
    'botonAgregarProducto': 'addProductBtn',
    'botonAgregarIngrediente': 'addIngredientBtn',
    'botonPagarAhora': 'payNowBtn',
    'botonPagarEntrega': 'payOnDeliveryBtn',
    'buscarProductos': 'searchProducts',
    'filtroStock': 'stockFilter',
    'ordenarProductos': 'sortProducts',
    'botonLimpiarFiltros': 'clearFiltersBtn',
    'filtroDisponibilidad': 'availabilityFilter',
    'ordenarCatalogo': 'sortCatalog',
    'modalIniciarSesion': 'loginModal',
    'modalRegistrarse': 'registerModal',
    'modalAgregarProducto': 'addProductModal',
    'modalAgregarIngrediente': 'addIngredientModal',
    'modalPedido': 'orderModal',
    'formularioIniciarSesion': 'loginForm',
    'formularioRegistrarse': 'registerForm',
    'formularioAgregarProducto': 'addProductForm',
    'formularioAgregarIngrediente': 'addIngredientForm',
    'grillaCatalogo': 'catalogGrid',
    'grillaProductos': 'productsGrid',
    'grillaIngredientes': 'ingredientsGrid',
    'grillaPedidos': 'ordersGrid',
    'seccionInventario': 'inventarioSection',
    'seccionIngredientes': 'ingredientesSection',
    'seccionPedidos': 'pedidosSection',
    'seccionCatalogo': 'catalogoSection',
    'seccionPedidosCliente': 'pedidosClienteSection'
};

// Aplicar traducciones
let contenidoRevertido = contenido;

// Reemplazar en orden específico para evitar conflictos
Object.entries(traducciones).forEach(([espanol, ingles]) => {
    // Crear regex para reemplazar solo palabras completas
    const regex = new RegExp(`\\b${espanol}\\b`, 'g');
    contenidoRevertido = contenidoRevertido.replace(regex, ingles);
});

// Escribir el archivo revertido
fs.writeFileSync('public/js/script-api.js', contenidoRevertido, 'utf8');

console.log('✅ Variables revertidas a inglés exitosamente');
