const express = require('express');
const cors = require('cors');
const path = require('path');
const { pool, initializeDatabase, insertSampleData, createDefaultAdmin } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

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
    console.error('❌ Error iniciando servidor:', error);
  }
}

// Rutas API

// Crear un nuevo usuario
app.post('/api/users', async (req, res) => {
  try {
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

// Ruta para servir la aplicación principal
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
startServer();
