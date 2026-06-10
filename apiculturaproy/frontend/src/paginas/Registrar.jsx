import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

export default function Registrar() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [fuerza, setFuerza] = useState('débil');
  const passwordActual = watch('password', '');

  const evaluarFuerza = (pass) => {
    if (!pass) return 'débil';
    let puntos = 0;
    if (pass.length >= 8) puntos++;
    if (/[A-Z]/.test(pass)) puntos++;
    if (/[0-9]/.test(pass)) puntos++;
    if (/[@$!%*?&]/.test(pass)) puntos++;

    if (puntos <= 2) return 'débil';
    if (puntos === 3) return 'intermedia';
    return 'fuerte';
  };

  const handlePasswordChange = (e) => {
    const texto = e.target.value;
    setFuerza(evaluarFuerza(texto));
  };

  const onSubmit = async (data) => {
    if (fuerza === 'débil') {
      Swal.fire('Error', 'La contraseña es muy débil para registrarte', 'error');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resultado = await response.json();

      if (response.ok) {
        Swal.fire('¡Éxito!', resultado.msg, 'success');
      } else {
        Swal.fire('Error', resultado.error, 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    }
  };

  const colorBarra = fuerza === 'débil' ? 'red' : fuerza === 'intermedia' ? 'orange' : 'green';

  return (
    <div style={{ maxWidth: '400px',backgroundColor: '#f9f9f9', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Crear Cuenta</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Nombre Completo:</label>
          <input type="text" {...register('nombre', { required: true })} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
          {errors.nombre && <span style={{ color: 'red' }}>El nombre es obligatorio</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Correo Electrónico:</label>
          <input type="email" {...register('email', { required: true })} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
          {errors.email && <span style={{ color: 'red' }}>El correo es obligatorio</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Contraseña:</label>
          <input 
            type="password" 
            {...register('password', { required: true })} 
            onChangeCapture={handlePasswordChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }} 
          />
          {errors.password && <span style={{ color: 'red' }}>La contraseña es obligatoria</span>}
          
          <div style={{ marginTop: '10px' }}>
            <div style={{ height: '8px', width: '100%', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ 
                height: '100%', 
                width: fuerza === 'débil' ? '33%' : fuerza === 'intermedia' ? '66%' : '100%', 
                backgroundColor: colorBarra,
                transition: 'all 0.3s ease' 
              }}></div>
            </div>
            <p style={{ fontSize: '12px', margin: '5px 0 0 0', color: colorBarra, fontWeight: 'bold' }}>
              Fuerza: Contraseña {fuerza}
            </p>
          </div>
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#f4c430', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Registrarse
        </button>
      </form>
    </div>
  );
}
