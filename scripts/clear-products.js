const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function clearProducts() {
  try {
    console.log('🗑️ Eliminando todos los productos...');
    
    // Eliminar todos los productos
    const result = await pool.query('DELETE FROM products');
    
    console.log(`✅ ${result.rowCount} productos eliminados correctamente`);
    
    // Verificar que no quedan productos
    const remainingProducts = await pool.query('SELECT COUNT(*) FROM products');
    console.log(`📊 Productos restantes: ${remainingProducts.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error eliminando productos:', error);
  } finally {
    await pool.end();
  }
}

clearProducts();
