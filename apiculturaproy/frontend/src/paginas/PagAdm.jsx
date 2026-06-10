import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import './PagAdm.css'; 

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [formulario, setFormulario] = useState({ nombre: '', categoria: 'miel_derivados', precio: '', stock: '' });

  const cargarProductos = async () => {
    try {
      const res = await fetch('http://localhost:3001/productos-admin');
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar productos", error);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const obtenerDatosGrafico = () => {
    const totales = { miel_derivados: 0, abejas: 0, herramientas_equipos: 0 };
    productos.forEach(p => {
      if (p.activo) {
        totales[p.categoria] += Number(p.precio) * Number(p.stock);
      }
    });
    return [
      { name: 'Miel y Derivados', 'Total (Bs.)': totales.miel_derivados },
      { name: 'Abejas y Familias', 'Total (Bs.)': totales.abejas },
      { name: 'Herramientas', 'Total (Bs.)': totales.herramientas_equipos }
    ];
  };

    const generarPDF = () => {
    try {
      const doc = new jsPDF();
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text("TIENDA DE APICULTURA BOLIVIANA ", 14, 20);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Reporte Oficial de Inventario - Fecha: ${new Date().toLocaleDateString()}`, 14, 27);
      doc.text("Manejo integral de colmenas, herramientas y derivados terapéuticos.", 14, 32);
    
      doc.setDrawColor(244, 196, 48);
      doc.setLineWidth(1);
      doc.line(14, 37, 196, 37);

      const filasTabla = productos.map(p => [
        p.id,
        p.nombre,
        p.categoria.replace('_', ' ').toUpperCase(),
        `Bs. ${Number(p.precio).toFixed(2)}`,
        `${p.stock} unidades`,
        p.activo ? "ACTIVO" : "OCULTO"
      ]);

      autoTable(doc, {
        startY: 45,
        head: [['ID', 'Nombre del Producto', 'Categoría', 'Precio', 'Stock', 'Estado']],
        body: filasTabla,
        headStyles: { 
          fillColor: [244, 196, 48], 
          textColor: [34, 34, 34]     
        },
        alternateRowStyles: { 
          fillColor: [245, 245, 245] 
        },
        margin: { top: 45 }
      });

      doc.save(`reporte_inventario_apicultura_${new Date().toISOString().slice(0,10)}.pdf`);
      
      Swal.fire('¡PDF Generado!', 'El reporte de inventario se descargó correctamente.', 'success');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al generar PDF ', 'Hubo un fallo interno en la librería del reporte.', 'error');
    }
  };


  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editando ? `http://localhost:3001/productos/${editando}` : 'http://localhost:3001/productos';
    const metodo = editando ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formulario)
      });
      const resultado = await res.json();

      if (res.ok) {
        Swal.fire('¡Éxito!', resultado.msg, 'success');
        setFormulario({ nombre: '', categoria: 'miel_derivados', precio: '', stock: '' });
        setEditando(null);
        cargarProductos();
      } else {
        Swal.fire('Error', resultado.error, 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo procesar la solicitud', 'error');
    }
  };

  const iniciarEdicion = (prod) => {
    setEditando(prod.id);
    setFormulario({ nombre: prod.nombre, categoria: prod.categoria, precio: prod.precio, stock: prod.stock });
  };

  const eliminarProducto = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/productos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        Swal.fire('Ocultado', 'Producto ocultado de la tienda con éxito', 'success');
        cargarProductos();
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo ocultar', 'error');
    }
  };

  const restaurarProducto = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/productos/restaurar/${id}`, { method: 'PUT' });
      const resultado = await res.json();
      if (res.ok) {
        Swal.fire('¡Restaurado!', resultado.msg, 'success');
        cargarProductos();
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo restaurar el producto', 'error');
    }
  };

  return (
    <div className="admin-container">
      
      <div className="admin-header">

        <button onClick={generarPDF} className="btn-pdf">
          Descargar Reporte PDF 
        </button>
      </div>

      <div className="chart-card">
        <h3>Valor Financiero del Inventario por Categoría (Bs.)</h3>
        <div className="chart-wrapper">
          <ResponsiveContainer>
            <BarChart data={obtenerDatosGrafico()} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`Bs. ${value.toFixed(2)}`, 'Capital Invertido']} />
              <Bar dataKey="Total (Bs.)" fill="#f4c430" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <h3>{editando ? 'Editar Producto ' : 'Agregar Nuevo Producto '}</h3>
        <div className="form-group">
          <input type="text" name="nombre" placeholder="Nombre" value={formulario.nombre} onChange={handleChange} required className="input-nombre" />
          
          <select name="categoria" value={formulario.categoria} onChange={handleChange}>
            <option value="miel_derivados">Miel y Derivados</option>
            <option value="abejas">Abejas y Familias</option>
            <option value="herramientas_equipos">Herramientas y Equipos</option>
          </select>

          <input type="number" step="0.01" name="precio" placeholder="Precio (Bs.)" value={formulario.precio} onChange={handleChange} required className="input-precio" />
          <input type="number" name="stock" placeholder="Stock" value={formulario.stock} onChange={handleChange} required className="input-stock" />
          
          <button type="submit" className="btn-submit">
            {editando ? 'Guardar Cambios' : 'Registrar'}
          </button>
          {editando && <button type="button" onClick={() => { setEditando(null); setFormulario({ nombre: '', categoria: 'miel_derivados', precio: '', stock: '' }); }} className="btn-cancel">Cancelar</button>}
        </div>
      </form>

      <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff', border: '1px solid #cccccc', fontFamily: 'Arial, sans-serif' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod) => (
            <tr key={prod.id} className={prod.activo ? "" : "row-hidden"} style={{ borderBottom: '1px solid #ddd' }}>
              <td>{prod.id}</td>
              <td>{prod.nombre}</td>
              <td>{prod.categoria.replace('_', ' ')}</td>
              <td>Bs. {prod.precio}</td>
              <td>{prod.stock} u.</td>
              <td className={prod.activo ? "status-active" : "status-hidden"}>
                {prod.activo ? 'Activo' : 'Oculto'}
              </td>
              <td>
                <div className="actions-group">
                  <button onClick={() => iniciarEdicion(prod)} style={{ cursor: 'pointer' }}>Editar</button>
                  {prod.activo ? (
                    <button onClick={() => eliminarProducto(prod.id)} className="btn-delete">Eliminar</button>
                  ) : (
                    <button onClick={() => restaurarProducto(prod.id)} className="btn-restore">Restaurar</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
