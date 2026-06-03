import express from 'express';
import mysql from 'mysql2/promise';

const app = express();
app.use(express.json()); // Permite leer el body en formato JSON

// Configuración de la conexión a la Base de Datos
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'basededatos'
});

app.post('/categorias', async (req, res) => {
    const { nombre, descripcion } = req.body;
    if (!nombre) {
        return res.status(400).json({ error: 'El nombre es obligatorio' });
    }
    try {
        const query = 'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)';
        const [result] = await pool.query(query, [nombre, descripcion]);
     
        res.status(201).json({ 
            id: result.insertId, 
            nombre, 
            descripcion 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/categorias', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM categorias');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/categorias/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [categoriaRows] = await pool.query('SELECT * FROM categorias WHERE id = ?', [id]);
        
        if (categoriaRows.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        const categoria = categoriaRows[0];
        const [productosRows] = await pool.query('SELECT * FROM productos WHERE categoria_id = ?', [id]);
        categoria.productos = productosRows;

        res.json(categoria);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.patch('/categorias/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    try {
        const [categoriaRows] = await pool.query('SELECT * FROM categorias WHERE id = ?', [id]);
        if (categoriaRows.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        const categoriaActual = categoriaRows[0];
        const nuevoNombre = nombre !== undefined ? nombre : categoriaActual.nombre;
        const nuevaDescripcion = descripcion !== undefined ? descripcion : categoriaActual.descripcion;
        const query = 'UPDATE categorias SET nombre = ?, descripcion = ?, updatedAt = NOW() WHERE id = ?';
        await pool.query(query, [nuevoNombre, nuevaDescripcion, id]);
        res.json({ message: 'Categoría actualizada con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.delete('/categorias/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM productos WHERE categoria_id = ?', [id]);
        const [result] = await pool.query('DELETE FROM categorias WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.json({ message: 'Categoría y sus productos asociados eliminados correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Iniciar servidor
app.listen(3001, () => {
    console.log('Servidor corriendo en http://localhost:3001');
});
