# Mordipets - Galletas para Perros 🐕

Aplicación web completa para la gestión y venta de galletas para perros, desarrollada con Node.js, Express, PostgreSQL y una interfaz web moderna.

## 🏗️ Estructura del Proyecto

```
mordipets/
├── public/                 # Archivos públicos del frontend
│   ├── css/               # Hojas de estilo
│   │   └── styles.css
│   ├── images/            # Imágenes de la web
│   │   └── logo.jpg
│   ├── js/                # JavaScript del frontend
│   │   ├── script-api.js  # Script principal con API
│   │   └── script.js      # Script original (backup)
│   └── index.html         # Página principal
├── src/                   # Código del servidor
│   ├── server.js          # Servidor Express
│   └── database.js        # Configuración de PostgreSQL
├── scripts/               # Scripts de utilidad
│   ├── *.sh              # Scripts de instalación
│   ├── *.bat             # Scripts de Windows
│   ├── *.py              # Scripts de Python
│   └── mordipets*        # Scripts específicos
├── docs/                  # Documentación
│   └── requisitos-mordipets.html
├── package.json           # Dependencias y scripts
├── Dockerfile            # Configuración de Docker
├── render.yaml           # Configuración de Render
├── vercel.json           # Configuración de Vercel
└── README.md             # Este archivo
```

## 🚀 Características

### Para Administradores
- ✅ Gestión completa de productos
- ✅ Gestión de ingredientes e insumos
- ✅ Administración de pedidos
- ✅ Control de inventario en tiempo real
- ✅ Panel de administración intuitivo

### Para Clientes
- ✅ Catálogo de productos
- ✅ Sistema de carrito de compras
- ✅ Proceso de pedidos
- ✅ Historial de compras
- ✅ Búsqueda de productos

### Técnicas
- ✅ Base de datos PostgreSQL
- ✅ API REST completa
- ✅ Interfaz responsive
- ✅ Autenticación de usuarios
- ✅ Despliegue en Railway

## 🛠️ Instalación y Configuración

### Requisitos
- Node.js 18+
- PostgreSQL
- npm o yarn

### Instalación Local
```bash
# Clonar el repositorio
git clone https://github.com/JuanPablitoxxz/mordipets.git
cd mordipets

# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env
# Editar .env con tu configuración de base de datos

# Iniciar el servidor
npm start
```

### Variables de Entorno
```env
DATABASE_URL=postgresql://usuario:password@host:puerto/database
NODE_ENV=production
PORT=3000
```

## 🗄️ Base de Datos

### Tablas Principales
- **users**: Usuarios del sistema (admin/clientes)
- **products**: Catálogo de productos
- **ingredients**: Insumos e ingredientes
- **orders**: Pedidos realizados
- **order_items**: Items de cada pedido

### Usuario Admin por Defecto
- **Email**: admin@mordipets.com
- **Contraseña**: admin123

## 🌐 Despliegue

### Railway (Recomendado)
1. Conectar repositorio de GitHub
2. Crear servicio PostgreSQL
3. Configurar variable `DATABASE_URL`
4. Desplegar automáticamente

### Render
1. Conectar repositorio
2. Configurar build y start commands
3. Agregar base de datos PostgreSQL
4. Configurar variables de entorno

### Vercel
1. Conectar repositorio
2. Configurar vercel.json
3. Desplegar automáticamente

## 📱 Uso de la Aplicación

### Registro de Clientes
1. Hacer clic en "Registrarse"
2. Completar formulario
3. Acceso automático como cliente

### Login de Administradores
1. Hacer clic en "Iniciar Sesión"
2. Usar credenciales de admin
3. Acceso al panel de administración

### Gestión de Productos (Admin)
1. Ir a "Inventario"
2. Agregar/editar/eliminar productos
3. Controlar stock y precios

### Realizar Pedidos (Cliente)
1. Explorar catálogo
2. Agregar productos al carrito
3. Proceder al checkout
4. Seleccionar método de pago

## 🛡️ Seguridad

- Contraseñas almacenadas en base de datos
- Validación de formularios
- Autenticación por email
- Roles de usuario (admin/cliente)

## 🔧 Desarrollo

### Scripts Disponibles
```bash
npm start      # Iniciar servidor de producción
npm run dev    # Iniciar servidor de desarrollo
npm run build  # Build del proyecto
```

### Estructura de API
```
GET    /api/products      # Obtener productos
POST   /api/products      # Crear producto
PUT    /api/products/:id  # Actualizar producto
DELETE /api/products/:id  # Eliminar producto

GET    /api/ingredients   # Obtener ingredientes
POST   /api/ingredients   # Crear ingrediente

GET    /api/orders        # Obtener pedidos
POST   /api/orders        # Crear pedido
PUT    /api/orders/:id/status # Actualizar estado

POST   /api/users         # Registrar usuario
POST   /api/users/login   # Login de usuario
```

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles.

## 👨‍💻 Autor

**JuanPablitoxxz**
- GitHub: [@JuanPablitoxxz](https://github.com/JuanPablitoxxz)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

---

🐕 **Mordipets** - Galletas para Perros de Calidad Premium