const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Función para inicializar las tablas
async function initializeDatabase() {
  try {
    // Crear tabla de usuarios
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        location VARCHAR(255),
        password VARCHAR(255),
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla de productos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        weight INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla de ingredientes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ingredients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        quantity INTEGER NOT NULL,
        unit VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla de pedidos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL,
        client_email VARCHAR(255) NOT NULL,
        client_phone VARCHAR(20),
        client_location VARCHAR(255),
        total DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        payment_status VARCHAR(50) DEFAULT 'pending',
        payment_reference VARCHAR(255),
        payment_transaction_id VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla de items de pedidos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        product_name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        quantity INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Base de datos inicializada correctamente');
    
    // Ejecutar migraciones para tablas existentes
    await runMigrations();
    
  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error);
  }
}

// Función para crear usuario admin por defecto
async function createDefaultAdmin() {
  try {
    // Verificar si ya existe un admin
    const adminCheck = await pool.query('SELECT COUNT(*) FROM users WHERE is_admin = true');
    if (adminCheck.rows[0].count > 0) {
      console.log('👤 El usuario admin ya existe');
      return;
    }

    // Crear usuario admin por defecto
    await pool.query(`
      INSERT INTO users (name, email, phone, location, password, is_admin) 
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      'Administrador Mordipets',
      'admin@mordipets.com',
      '3001234567',
      'Bogotá, Colombia',
      'admin123', // En producción, esto debería estar hasheado
      true
    ]);

    console.log('✅ Usuario admin creado: admin@mordipets.com / admin123');
  } catch (error) {
    console.error('❌ Error creando usuario admin:', error);
  }
}

// Función para crear usuarios de prueba
async function createTestUsers() {
  try {
    // Verificar si ya hay usuarios de prueba
    const userCount = await pool.query('SELECT COUNT(*) FROM users WHERE email LIKE $1', ['%test%']);
    if (userCount.rows[0].count > 0) {
      console.log('👥 Los usuarios de prueba ya existen');
      return;
    }

    // Crear usuarios de prueba
    const testUsers = [
      {
        name: 'Usuario Prueba 1',
        email: 'test1@gmail.com',
        phone: '3001234567',
        location: 'Bogotá, Colombia',
        password: 'test123',
        is_admin: false
      },
      {
        name: 'Usuario Prueba 2',
        email: 'test2@hotmail.com',
        phone: '3007654321',
        location: 'Medellín, Colombia',
        password: 'test123',
        is_admin: false
      },
      {
        name: 'Cliente VIP',
        email: 'cliente@outlook.com',
        phone: '3009876543',
        location: 'Cali, Colombia',
        password: 'cliente123',
        is_admin: false
      }
    ];

    for (const user of testUsers) {
      await pool.query(
        'INSERT INTO users (name, email, phone, location, password, is_admin) VALUES ($1, $2, $3, $4, $5, $6)',
        [user.name, user.email, user.phone, user.location, user.password, user.is_admin]
      );
    }

    console.log('✅ Usuarios de prueba creados correctamente');
    console.log('📧 Emails de prueba: test1@gmail.com, test2@hotmail.com, cliente@outlook.com');
    console.log('🔑 Contraseña: test123 (para test1 y test2), cliente123 (para cliente)');
  } catch (error) {
    console.error('❌ Error creando usuarios de prueba:', error);
  }
}

// Función para insertar datos de ejemplo
async function insertSampleData() {
  try {
    // Verificar si ya hay productos
    const productCount = await pool.query('SELECT COUNT(*) FROM products');
    if (productCount.rows[0].count > 0) {
      console.log('📦 Los datos de ejemplo ya existen');
      return;
    }

    // Insertar productos de ejemplo
    const sampleProducts = [
      { code: '10', name: 'Galleta Leche x 1000 gr', price: 15500, stock: 25, weight: 1000, description: 'Deliciosas galletas de leche para perros' },
      { code: '20', name: 'Galleta Carne x 1000 gr', price: 16000, stock: 30, weight: 1000, description: 'Galletas con sabor a carne' },
      { code: '30', name: 'Galleta Pollo x 1000 gr', price: 15750, stock: 20, weight: 1000, description: 'Galletas de pollo nutritivas' },
      { code: '40', name: 'Galleta Higado x 1000 gr', price: 17000, stock: 15, weight: 1000, description: 'Galletas de hígado ricas en hierro' },
      { code: '50', name: 'Galleta Espinaca x 1000 gr', price: 16250, stock: 18, weight: 1000, description: 'Galletas con espinaca para perros' },
      { code: '60', name: 'Galleta Zanahoria x 1000 gr', price: 15000, stock: 22, weight: 1000, description: 'Galletas de zanahoria saludables' },
      { code: '70', name: 'Galleta Avena x 1000 gr', price: 14750, stock: 28, weight: 1000, description: 'Galletas de avena energéticas' },
      { code: '80', name: 'Galleta Linaza x 1000 gr', price: 16500, stock: 12, weight: 1000, description: 'Galletas de linaza con omega-3' },
      { code: '90', name: 'Galleta Monedita Leche x 1000 gr', price: 18000, stock: 20, weight: 1000, description: 'Galletas monedita de leche' },
      { code: '100', name: 'Galleta Monedita Carne x 1000 gr', price: 18500, stock: 15, weight: 1000, description: 'Galletas monedita de carne' }
    ];

    for (const product of sampleProducts) {
      await pool.query(
        'INSERT INTO products (code, name, description, price, stock, weight) VALUES ($1, $2, $3, $4, $5, $6)',
        [product.code, product.name, product.description, product.price, product.stock, product.weight]
      );
    }

    // Insertar ingredientes de ejemplo
    const sampleIngredients = [
      { name: 'Harina de Trigo', type: 'carbohidrato', quantity: 50, unit: 'kg' },
      { name: 'Carne de Res', type: 'proteina', quantity: 25, unit: 'kg' },
      { name: 'Leche en Polvo', type: 'proteina', quantity: 15, unit: 'kg' },
      { name: 'Hígado de Pollo', type: 'proteina', quantity: 10, unit: 'kg' },
      { name: 'Espinaca', type: 'vitamina', quantity: 8, unit: 'kg' },
      { name: 'Zanahoria', type: 'vitamina', quantity: 12, unit: 'kg' },
      { name: 'Avena', type: 'carbohidrato', quantity: 20, unit: 'kg' },
      { name: 'Linaza', type: 'vitamina', quantity: 5, unit: 'kg' },
      { name: 'Conservante Natural', type: 'conservante', quantity: 2, unit: 'kg' },
      { name: 'Saborizante Carne', type: 'saborizante', quantity: 3, unit: 'lt' }
    ];

    for (const ingredient of sampleIngredients) {
      await pool.query(
        'INSERT INTO ingredients (name, type, quantity, unit) VALUES ($1, $2, $3, $4)',
        [ingredient.name, ingredient.type, ingredient.quantity, ingredient.unit]
      );
    }

    console.log('✅ Datos de ejemplo insertados correctamente');
  } catch (error) {
    console.error('❌ Error insertando datos de ejemplo:', error);
  }
}

// Función para ejecutar migraciones en tablas existentes
async function runMigrations() {
  try {
    console.log('🔄 Ejecutando migraciones...');
    
    // Verificar si las columnas de pago existen en la tabla orders
    const columnsCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'orders' 
      AND column_name IN ('payment_status', 'payment_reference', 'payment_transaction_id')
    `);
    
    const existingColumns = columnsCheck.rows.map(row => row.column_name);
    
    // Agregar columnas faltantes
    if (!existingColumns.includes('payment_status')) {
      console.log('➕ Agregando columna payment_status...');
      await pool.query(`
        ALTER TABLE orders 
        ADD COLUMN payment_status VARCHAR(50) DEFAULT 'pending'
      `);
    }
    
    if (!existingColumns.includes('payment_reference')) {
      console.log('➕ Agregando columna payment_reference...');
      await pool.query(`
        ALTER TABLE orders 
        ADD COLUMN payment_reference VARCHAR(255)
      `);
    }
    
    if (!existingColumns.includes('payment_transaction_id')) {
      console.log('➕ Agregando columna payment_transaction_id...');
      await pool.query(`
        ALTER TABLE orders 
        ADD COLUMN payment_transaction_id VARCHAR(255)
      `);
    }
    
    console.log('✅ Migraciones completadas correctamente');
    
  } catch (error) {
    console.error('❌ Error ejecutando migraciones:', error);
    // No lanzar error para no interrumpir el inicio del servidor
    console.log('⚠️ Continuando sin migraciones...');
  }
}

module.exports = {
  pool,
  initializeDatabase,
  insertSampleData,
  createDefaultAdmin,
  createTestUsers,
  runMigrations
};
