const axios = require('axios');

const BASE_URL = 'https://pagina-galletas-production.up.railway.app';

async function clearProductsViaAPI() {
  try {
    console.log('🗑️ Eliminando productos via API...');
    
    const response = await axios.post(`${BASE_URL}/api/admin/clear-products`);
    
    if (response.data.success) {
      console.log('✅', response.data.message);
    } else {
      console.error('❌ Error:', response.data.error);
    }
    
  } catch (error) {
    console.error('❌ Error en la petición:', error.response?.data || error.message);
  }
}

clearProductsViaAPI();
