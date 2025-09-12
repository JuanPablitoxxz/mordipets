const axios = require('axios');

const BASE_URL = 'https://pagina-galletas-production.up.railway.app';

async function testAPI() {
  console.log('🧪 Probando API de productos e insumos...\n');
  
  try {
    // Probar crear un producto
    console.log('1. Probando crear producto...');
    const productData = {
      code: 'TEST001',
      name: 'Producto de Prueba',
      description: 'Descripción del producto de prueba',
      price: 10000,
      stock: 5,
      weight: 500
    };
    
    const productResponse = await axios.post(`${BASE_URL}/api/products`, productData);
    console.log('✅ Producto creado:', productResponse.data);
    
    // Probar crear un insumo
    console.log('\n2. Probando crear insumo...');
    const ingredientData = {
      name: 'Insumo de Prueba',
      type: 'proteina',
      quantity: 10,
      unit: 'kg'
    };
    
    const ingredientResponse = await axios.post(`${BASE_URL}/api/ingredients`, ingredientData);
    console.log('✅ Insumo creado:', ingredientResponse.data);
    
    // Probar obtener productos
    console.log('\n3. Probando obtener productos...');
    const productsResponse = await axios.get(`${BASE_URL}/api/products`);
    console.log('✅ Productos obtenidos:', productsResponse.data.length, 'productos');
    
    // Probar obtener insumos
    console.log('\n4. Probando obtener insumos...');
    const ingredientsResponse = await axios.get(`${BASE_URL}/api/ingredients`);
    console.log('✅ Insumos obtenidos:', ingredientsResponse.data.length, 'insumos');
    
    console.log('\n🎉 Todas las pruebas pasaron correctamente!');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
  }
}

testAPI();
