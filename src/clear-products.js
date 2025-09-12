const { pool } = require('./database');

async function clearAllProducts() {
  try {
    console.log('🗑️ Eliminando todos los productos de la base de datos...');
    
    // Eliminar todos los productos
    const result = await pool.query('DELETE FROM products');
    
    console.log(`✅ ${result.rowCount} productos eliminados correctamente`);
    
    // Verificar que no quedan productos
    const remainingProducts = await pool.query('SELECT COUNT(*) FROM products');
    console.log(`📊 Productos restantes: ${remainingProducts.rows[0].count}`);
    
    return { success: true, deletedCount: result.rowCount };
    
  } catch (error) {
    console.error('❌ Error eliminando productos:', error);
    return { success: false, error: error.message };
  }
}

// Si se ejecuta directamente, ejecutar la función
if (require.main === module) {
  clearAllProducts()
    .then(result => {
      if (result.success) {
        console.log('🎉 Proceso completado exitosamente');
        process.exit(0);
      } else {
        console.error('❌ Proceso falló');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { clearAllProducts };
