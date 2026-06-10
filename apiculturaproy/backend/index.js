import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'apicultura'
});

const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.json({ msg: 'Servidor de la Apicultura funcionando en el puerto 3001' });
});

//CRUD para productos
app.post('/productos', async (req, res) => {
    const { nombre, categoria, precio, stock } = req.body;
    if (!nombre || !categoria || !precio || !stock) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    try {
        const query = 'INSERT INTO productos (nombre, categoria, precio, stock) VALUES (?, ?, ?, ?)';
        const [resultado] = await db.query(query, [nombre, categoria, precio, stock]);
        res.status(201).json({
            msg: 'Producto registrado exitosamente',
            id: resultado.insertId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/productos', async (req, res) => {
    try {
        const query = 'SELECT * FROM productos WHERE activo = true ORDER BY id ASC';
        const [productos] = await db.query(query);
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/productos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM productos WHERE id = ? AND activo = true';
        const [productos] = await db.query(query, [id]);

        if (productos.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado o inactivo' });
        }
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.put('/productos/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, categoria, precio, stock } = req.body;

    try {
        const query = 'UPDATE productos SET nombre = ?, categoria = ?, precio = ?, stock = ? WHERE id = ? AND activo = true';
        const [resultado] = await db.query(query, [nombre, categoria, precio, stock, id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado para actualizar' });
        }
        res.json({ msg: 'Producto actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/productos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'UPDATE productos SET activo = false WHERE id = ?';
        const [resultado] = await db.query(query, [id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ msg: 'Producto eliminado lógicamente del catálogo' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/productos/restaurar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'UPDATE productos SET activo = true WHERE id = ?';
        const [resultado] = await db.query(query, [id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado en la base de datos' });
        }
        
        res.json({ msg: 'Producto recuperado y activado en el catálogo exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//Get para admin
app.get('/productos-admin', async (req, res) => {
    try {
        const query = 'SELECT * FROM productos ORDER BY id ASC';
        const [productos] = await db.query(query);
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    try {
        const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ? AND activo = true', [email]);
        
        if (usuarios.length === 0) {
            return res.status(400).json({ error: 'El correo no existe o el usuario está inactivo' });
        }
        const usuario = usuarios[0];

        const coinciden = await bcrypt.compare(password, usuario.password);
        if (!coinciden) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        const ipCliente = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const navegador = req.headers['user-agent'] || 'Navegador Indefinido';

        const logQuery = 'INSERT INTO logs_acceso (usuario_id, rol, ip, evento, browser) VALUES (?, ?, ?, ?, ?)';
        await db.query(logQuery, [usuario.id, usuario.rol, ipCliente, 'ingreso', navegador]);

        res.json({
            msg: '¡Ingreso exitoso al sistema de apicultura!',
            usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// LOGOUT 
app.post('/logout', async (req, res) => {
    const { usuario_id } = req.body;

    if (!usuario_id) {
        return res.status(400).json({ error: 'Se requiere el ID del usuario para registrar la salida' });
    }

    try {
        const [usuarios] = await db.query('SELECT rol FROM usuarios WHERE id = ?', [usuario_id]);
        const rolUsuario = usuarios.length > 0 ? usuarios[0].rol : 'cliente';

        const ipCliente = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const navegador = req.headers['user-agent'] || 'Navegador Indefinido';

        const logQuery = 'INSERT INTO logs_acceso (usuario_id, rol, ip, evento, browser) VALUES (?, ?, ?, ?, ?)';
        await db.query(logQuery, [usuario_id, rolUsuario, ipCliente, 'salida', navegador]);

        res.json({ msg: 'Cierre de sesión registrado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// CONTRASEÑA
const evaluarFuerzaPassword = (password) => {
    let puntuacion = 0;
    if (password.length >= 8) puntuacion++;
    if (/[A-Z]/.test(password)) puntuacion++;
    if (/[0-9]/.test(password)) puntuacion++;
    if (/[@$!%*?&]/.test(password)) puntuacion++;
    if (puntuacion <= 2) return 'débil';
    if (puntuacion === 3) return 'intermedia';
    return 'fuerte'; 
};

//REGISTRO
app.post('/registrar', async (req, res) => {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos obligatorios deben llenarse' });
    }

    const fuerza = evaluarFuerzaPassword(password);
    if (fuerza === 'débil') {
        return res.status(400).json({ 
            error: 'Contraseña demasiado débil. Requisito: Mínimo 8 caracteres, una mayúscula, un número y un símbolo (@$!%*?&).' 
        });
    }

    try {
        const [existe] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (existe.length > 0) {
            return res.status(400).json({ error: 'Este correo electrónico ya está registrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);

        const tipoRol = rol || 'cliente';
        const query = 'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)';
        await db.query(query, [nombre, email, passwordEncriptada, tipoRol]);

        res.status(201).json({ 
            msg: 'Usuario registrado',
            fuerza_detectada: fuerza
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//INICIO DE SESIÓN Y LOGS
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    try {
        const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ? AND activo = true', [email]);
        if (usuarios.length === 0) {
            return res.status(400).json({ error: 'El correo no existe o el usuario está inactivo' });
        }

        const usuario = usuarios[0];
        const coinciden = await bcrypt.compare(password, usuario.password);
        if (!coinciden) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }
        const ipCliente = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const navegador = req.headers['user-agent'] || 'Navegador Indefinido';

        const logQuery = 'INSERT INTO logs_acceso (usuario_id, ip, evento, browser) VALUES (?, ?, ?, ?)';
        await db.query(logQuery, [usuario.id, ipCliente, 'ingreso', navegador]);

        res.json({
            msg: 'Ingreso exitoso al sistema de apicultura',
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                rol: usuario.rol
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//iniciar servidor
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
