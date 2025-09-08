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
  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error);
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

module.exports = {
  pool,
  initializeDatabase,
  insertSampleData
};
