const express = require('express');
const cors = require('cors');
const path = require('path');
const { pool, initializeDatabase, insertSampleData, createDefaultAdmin } = require('./database');
const { sendVerificationCode, sendPasswordChangedConfirmation } = require('./emailService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Inicializar base de datos al arrancar
async function startServer() {
  try {
    await initializeDatabase();
    await createDefaultAdmin();
    await insertSampleData();
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error con la base de datos:', error.message);
    console.log('🔄 Iniciando servidor en modo fallback (sin base de datos)');
    
    // Iniciar servidor sin base de datos
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT} (modo fallback)`);
    });
  }
}

// Rutas API

// Función para verificar si la base de datos está disponible
async function isDatabaseAvailable() {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (error) {
    return false;
  }
}

// Crear un nuevo usuario
app.post('/api/users', async (req, res) => {
  try {
    if (!(await isDatabaseAvailable())) {
      return res.status(503).json({ error: 'Base de datos no disponible' });
    }
    
    const { name, email, phone, location, password, isAdmin } = req.body;
    
    // Verificar si el email ya existe
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    
    const result = await pool.query(
      'INSERT INTO users (name, email, phone, location, password, is_admin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, email, phone, location, password, isAdmin || false]
    );
    
    // No devolver la contraseña
    const user = result.rows[0];
    delete user.password;
    
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Login de usuario
app.post('/api/users/login', async (req, res) => {
  try {
    if (!(await isDatabaseAvailable())) {
      return res.status(503).json({ error: 'Base de datos no disponible' });
    }
    
    const { email, password } = req.body;
    
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    
    // No devolver la contraseña
    const user = result.rows[0];
    delete user.password;
    
    res.json(user);
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener todos los productos
app.get('/api/products', async (req, res) => {
  try {
    if (!(await isDatabaseAvailable())) {
      // Datos de prueba cuando la base de datos no está disponible
      const productosPrueba = [
        { id: 1, code: 'GL001', name: 'Galleta Leche', description: 'Deliciosa galleta con sabor a leche', price: 5000, stock: 50, weight: 100 },
        { id: 2, code: 'GL002', name: 'Galleta Carne', description: 'Galleta rica en proteínas de carne', price: 5500, stock: 30, weight: 100 },
        { id: 3, code: 'GL003', name: 'Galleta Pollo', description: 'Galleta con sabor a pollo natural', price: 5200, stock: 25, weight: 100 },
        { id: 4, code: 'GL004', name: 'Galleta Hígado', description: 'Galleta nutritiva con hígado', price: 5800, stock: 15, weight: 100 },
        { id: 5, code: 'GL005', name: 'Galleta Espinaca', description: 'Galleta verde con espinaca', price: 4800, stock: 40, weight: 100 },
        { id: 6, code: 'GL006', name: 'Galleta Zanahoria', description: 'Galleta naranja con zanahoria', price: 4900, stock: 35, weight: 100 },
        { id: 7, code: 'GL007', name: 'Galleta Avena', description: 'Galleta saludable con avena', price: 5100, stock: 20, weight: 100 },
        { id: 8, code: 'GL008', name: 'Galleta Mixta', description: 'Mezcla de sabores naturales', price: 5600, stock: 10, weight: 100 }
      ];
      return res.json(productosPrueba);
    }
    
    const result = await pool.query('SELECT * FROM products ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener un producto por ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear un nuevo producto
app.post('/api/products', async (req, res) => {
  try {
    const { code, name, description, price, stock, weight } = req.body;
    
    const result = await pool.query(
      'INSERT INTO products (code, name, description, price, stock, weight) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [code, name, description, price, stock, weight]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar un producto
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, description, price, stock, weight } = req.body;
    
    const result = await pool.query(
      'UPDATE products SET code = $1, name = $2, description = $3, price = $4, stock = $5, weight = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [code, name, description, price, stock, weight, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar un producto
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener todos los ingredientes
app.get('/api/ingredients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ingredients ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo ingredientes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear un nuevo ingrediente
app.post('/api/ingredients', async (req, res) => {
  try {
    const { name, type, quantity, unit } = req.body;
    
    const result = await pool.query(
      'INSERT INTO ingredients (name, type, quantity, unit) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, type, quantity, unit]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando ingrediente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener todos los pedidos
app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.*, 
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', oi.id,
                   'product_name', oi.product_name,
                   'price', oi.price,
                   'quantity', oi.quantity
                 )
               ) FILTER (WHERE oi.id IS NOT NULL), 
               '[]'
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo pedidos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear un nuevo pedido
app.post('/api/orders', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { clientName, clientEmail, clientPhone, clientLocation, items, total, paymentMethod } = req.body;
    
    // Crear el pedido
    const orderResult = await client.query(
      'INSERT INTO orders (client_name, client_email, client_phone, client_location, total, payment_method) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [clientName, clientEmail, clientPhone, clientLocation, total, paymentMethod]
    );
    
    const orderId = orderResult.rows[0].id;
    
    // Crear los items del pedido
    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES ($1, $2, $3, $4, $5)',
        [orderId, item.id, item.name, item.price, item.quantity]
      );
      
      // Actualizar stock del producto
      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.id]
      );
    }
    
    await client.query('COMMIT');
    res.status(201).json(orderResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creando pedido:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    client.release();
  }
});

// Actualizar estado de pedido
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando pedido:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Almacenamiento temporal para códigos de verificación (en memoria)
const verificationCodes = new Map();

// Enviar código de verificación por email
app.post('/api/auth/send-verification-code', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email es requerido' });
    }
    
    // Verificar si el email existe en la base de datos
    let userExists = false;
    
    if (await isDatabaseAvailable()) {
      // Verificar en base de datos real
      const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      userExists = result.rows.length > 0;
    } else {
      // Para desarrollo, aceptar cualquier email que termine en @gmail.com o @hotmail.com
      userExists = email.includes('@gmail.com') || email.includes('@hotmail.com') || email.includes('@outlook.com');
    }
    
    if (!userExists) {
      return res.status(404).json({ error: 'No existe una cuenta con este correo electrónico' });
    }
    
    // Generar código de verificación
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Guardar código en memoria con expiración (10 minutos)
    verificationCodes.set(email, {
      code: verificationCode,
      expires: Date.now() + (10 * 60 * 1000) // 10 minutos
    });
    
    // Enviar email
    const emailResult = await sendVerificationCode(email, verificationCode);
    
    if (emailResult.success) {
      res.json({ 
        success: true, 
        message: 'Código de verificación enviado exitosamente'
      });
    } else {
      res.status(500).json({ 
        error: 'Error enviando el código de verificación',
        details: emailResult.error
      });
    }
    
  } catch (error) {
    console.error('Error enviando código de verificación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Verificar código de verificación
app.post('/api/auth/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({ error: 'Email y código son requeridos' });
    }
    
    // Verificar código de verificación
    const storedCode = verificationCodes.get(email);
    
    if (!storedCode) {
      return res.status(400).json({ error: 'Código de verificación no encontrado o expirado' });
    }
    
    if (storedCode.expires < Date.now()) {
      verificationCodes.delete(email);
      return res.status(400).json({ error: 'Código de verificación expirado' });
    }
    
    if (storedCode.code !== code) {
      return res.status(400).json({ error: 'Código de verificación incorrecto' });
    }
    
    res.json({ 
      success: true, 
      message: 'Código verificado correctamente'
    });
    
  } catch (error) {
    console.error('Error verificando código:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Verificar código y cambiar contraseña
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    
    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    
    // Verificar código de verificación
    const storedCode = verificationCodes.get(email);
    
    if (!storedCode) {
      return res.status(400).json({ error: 'Código de verificación no encontrado o expirado' });
    }
    
    if (storedCode.expires < Date.now()) {
      verificationCodes.delete(email);
      return res.status(400).json({ error: 'Código de verificación expirado' });
    }
    
    if (storedCode.code !== code) {
      return res.status(400).json({ error: 'Código de verificación incorrecto' });
    }
    
    // Código válido, proceder con el cambio de contraseña
    let userName = email.split('@')[0]; // Nombre por defecto
    
    if (await isDatabaseAvailable()) {
      // Actualizar en base de datos real
      const result = await pool.query(
        'UPDATE users SET password = $1 WHERE email = $2 RETURNING name',
        [newPassword, email]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      userName = result.rows[0].name;
    }
    
    // Limpiar código usado
    verificationCodes.delete(email);
    
    // Enviar email de confirmación
    const emailResult = await sendPasswordChangedConfirmation(email, userName);
    
    res.json({ 
      success: true, 
      message: 'Contraseña actualizada exitosamente',
      emailSent: emailResult.success
    });
    
  } catch (error) {
    console.error('Error actualizando contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para servir la aplicación principal
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Iniciar servidor
startServer();
