import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Registrar from './paginas/Registrar';
import Login from './paginas/Login';
import AdminProductos from './paginas/PagAdm';
import './App.css';

function InicioCliente() {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ margin: '5px 0', padding: '30px', background: '#62d100', borderRadius: '8px',borderColor:'#04a901',borderWidth:'5px',borderStyle:'solid', color: '#000000', fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>Bienvenidos a la Apicultura Boliviana</h1>
      <p style={{ fontSize: '18px', color: '#000000', lineHeight: '1.6', background: '#ffffff' }}>
        En nuestra empresa, el respeto por las abejas y la naturaleza es el núcleo de todo lo que hacemos. Para garantizar una miel 100% pura y orgánica, seguimos un método de recolección tradicional que preserva intactas todas las propiedades terapéuticas, enzimas y vitaminas que las abejas depositan en cada celda.
      </p>
      <div style={{ margin: '30px 0', borderRadius: '8px', color: '#333', fontWeight: 'bold' }}>
        <video width="100%" height="auto" controls loop autoPlay muted>
          <source src="../public/video.mp4" type="video/mp4" />
          Tu navegador no soporta el elemento de video.
        </video>
      </div>

    </div>
  );
}
function ProductosCliente() {
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');

  useEffect(() => {
    fetch('http://localhost:3001/productos')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error("Error al cargar el catálogo", err));
  }, []);

  const productosFiltrados = categoriaSeleccionada === 'todas'
    ? productos
    : productos.filter(p => p.categoria === categoriaSeleccionada);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
        <button onClick={() => setCategoriaSeleccionada('todas')} style={{ padding: '8px 15px', background: categoriaSeleccionada === 'todas' ? '#f4c430' : '#eee', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Todos</button>
        <button onClick={() => setCategoriaSeleccionada('miel_derivados')} style={{ padding: '8px 15px', background: categoriaSeleccionada === 'miel_derivados' ? '#f4c430' : '#eee', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Miel y Derivados</button>
        <button onClick={() => setCategoriaSeleccionada('abejas')} style={{ padding: '8px 15px', background: categoriaSeleccionada === 'abejas' ? '#f4c430' : '#eee', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Abejas y Familias</button>
        <button onClick={() => setCategoriaSeleccionada('herramientas_equipos')} style={{ padding: '8px 15px', background: categoriaSeleccionada === 'herramientas_equipos' ? '#f4c430' : '#eee', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Herramientas</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {/*productos*/}
        {productosFiltrados.map(prod => (
          <div key={prod.id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ height: '180px', backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: '1px solid #eee' }}>
              <img 
                src={`/${prod.id}.jpg`} 
                alt={prod.nombre}
                onError={(e) => { e.target.style.display = 'none'; }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ padding: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', background: '#eaeaea', padding: '3px 8px', borderRadius: '10px', fontWeight: 'bold', color: '#555' }}>
                  {prod.categoria.replace('_', ' ')}
                </span>
                <h3 style={{ margin: '10px 0 5px 0', fontSize: '18px', color: '#222' }}>{prod.nombre}</h3>
              </div>

              <div style={{ marginTop: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1b4d3e' }}>Bs. {prod.precio}</span>
                  <span style={{ fontSize: '12px', color: prod.stock > 0 ? 'green' : 'red', fontWeight: 'bold' }}>
                    {prod.stock > 0 ? `${prod.stock} disponibles` : 'Agotado'}
                  </span>
                </div>
                <button style={{ width: '100%', padding: '10px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '4px', marginTop: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Comprar Producto
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
function ContactosCliente() {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ margin: '5px 0', padding: '30px', background: '#62d100', borderRadius: '8px',borderColor:'#04a901',borderWidth:'5px',borderStyle:'solid', color: '#000000', fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>Contáctanos</h2>
      
      <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9', textAlign: 'left' }}>
        <p> Ubicación: El Alto, Bolivia</p>
        <p> Teléfono / WhatsApp: +591 12345678</p>
        <p> Correo Corporativo: contacto@gmail.com</p>
        <p> Horarios de Atención: Lunes a Viernes de 08:00 a 16:00</p>
      </div>
    </div>
  );
}

export default function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(() => {
    const datosUser = localStorage.getItem('usuario');
    return datosUser ? JSON.parse(datosUser) : null;
  });
  const cerrarSesion = async () => {
    if (usuarioLogueado) {
      try {
        await fetch('http://localhost:3001/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usuario_id: usuarioLogueado.id }),
        });
      } catch (error) {
        console.error("Error al registrar el log de salida", error);
      }
    }
    
    localStorage.removeItem('usuario');
    setUsuarioLogueado(null);
    window.location.href = '/login';
  };


  const rutaActual = window.location.pathname;
  const esPaginaLogin = rutaActual === '/login';

  return (
    <Router>
      {!esPaginaLogin && (
        <nav style={{ padding: '15px', backgroundColor: '#333', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Inicio</Link>
            <Link to="/productos" style={{ color: '#fff', textDecoration: 'none' }}>Productos</Link>
            <Link to="/contactos" style={{ color: '#fff', textDecoration: 'none' }}>Contactos</Link>
            {/*si es administrador */}
            {usuarioLogueado?.rol === 'administrador' && (
              <Link to="/admin" style={{ color: '#f4c430', textDecoration: 'none', fontWeight: 'bold', marginLeft: '10px' }}>Panel Admin</Link>
            )}
          </div>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            {usuarioLogueado ? (
              <>
                <span style={{ color: '#a9e159' }}>Hola, {usuarioLogueado.nombre} ({usuarioLogueado.rol})</span>
                <button onClick={cerrarSesion} style={{ padding: '5px 10px', backgroundColor: '#d9534f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Salir</button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
                <Link to="/registrar" style={{ color: '#fff', textDecoration: 'none' }}>Registrar</Link>
              </>
            )}
          </div>
        </nav>
      )}

      <Routes>
        {/* Rutas del cliente */}
        <Route path="/" element={<InicioCliente />} />
        <Route path="/productos" element={<ProductosCliente />} />
        <Route path="/contactos" element={<ContactosCliente />} />
        
        {/* Pantallas de acceso */}
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Registrar />} />

        {/* Ruta del Admin */}
        <Route 
          path="/admin" 
          element={
            usuarioLogueado?.rol === 'administrador' 
              ? <AdminProductos /> 
              : <Navigate to="/login" />
          } 
        />
      </Routes>
    </Router>
  );
}
