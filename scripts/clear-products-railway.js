const axios = require('axios');

const BASE_URL = 'https://pagina-galletas-production.up.railway.app';

async function clearProducts() {
  try {
    console.log('🗑️ Obteniendo productos existentes...');
    
    // Obtener todos los productos
    const response = await axios.get(`${BASE_URL}/api/products`);
    const products = response.data;
    
    console.log(`📊 Encontrados ${products.length} productos`);
    
    // Eliminar cada producto
    for (const product of products) {
      try {
        await axios.delete(`${BASE_URL}/api/products/${product.id}`);
        console.log(`✅ Eliminado: ${product.name}`);
      } catch (error) {
        console.error(`❌ Error eliminando ${product.name}:`, error.response?.data || error.message);
      }
    }
    
    console.log('🎉 Proceso de eliminación completado');
    
  } catch (error) {
    console.error('❌ Error en el proceso:', error.response?.data || error.message);
  }
}

clearProducts();
