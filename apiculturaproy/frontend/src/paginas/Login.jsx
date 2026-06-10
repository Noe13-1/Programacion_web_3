import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom'; 
import Swal from 'sweetalert2';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate(); 
  const [captchaTexto, setCaptchaTexto] = useState('');

  const generarCaptchaTexto = () => {
    const caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let resultado = '';
    for (let i = 0; i < 5; i++) {
      resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    setCaptchaTexto(resultado);
  };

  useEffect(() => {
    generarCaptchaTexto();
  }, []);

  const onSubmit = async (data) => {
    if (data.captchaUsuario !== captchaTexto) {
      Swal.fire('CAPTCHA Incorrecto', 'El código de seguridad no coincide.', 'error');
      generarCaptchaTexto();
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const resultado = await response.json();

      if (response.ok) {
        localStorage.setItem('usuario', JSON.stringify(resultado.usuario));
        
        Swal.fire({
          title: '¡Ingreso Exitoso!',
        });
//redireccion
        setTimeout(() => {
          if (resultado.usuario.rol === 'administrador') {
            window.location.href = '/admin'; 
          } else {
            window.location.href = '/';
          }
        }, 1500);


      } else {
        Swal.fire('Error de Ingreso', resultado.error, 'error');
        generarCaptchaTexto();
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '30px', border: '1px solid #ccc', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginTop: '0', color: '#333' }}>Apicultura Boliviana</h2>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>Inicia sesión para ingresar al sistema</p>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Correo Electrónico:</label>
            <input type="email" {...register('email', { required: true })} style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} />
            {errors.email && <span style={{ color: 'red', fontSize: '12px' }}>El correo es requerido</span>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Contraseña:</label>
            <input type="password" {...register('password', { required: true })} style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} />
            {errors.password && <span style={{ color: 'red', fontSize: '12px' }}>La contraseña es requerida</span>}
          </div>

          {/* CAPTCHA ALFANUMÉRICO */}
          <div style={{ marginBottom: '20px', padding: '15px', background: '#f9f9f9', border: '1px solid #ddd', borderRadius: '6px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#555', fontSize: '13px' }}>Verificación de Seguridad </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
              <div style={{ background: '#333', color: '#f4c430', padding: '8px 15px', fontSize: '20px', fontWeight: 'bold', letterSpacing: '4px', fontStyle: 'italic', borderRadius: '4px', userSelect: 'none', textDecoration: 'line-through' }}>
                {captchaTexto}
              </div>
              <button type="button" onClick={generarCaptchaTexto} style={{ background: 'none', border: 'none', color: '#0066cc', cursor: 'pointer', fontSize: '12px' }}>Cambiar</button>
            </div>
            <input type="text" placeholder="Copia el código de arriba" {...register('captchaUsuario', { required: true })} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} />
            {errors.captchaUsuario && <span style={{ color: 'red', fontSize: '12px' }}>El código es obligatorio</span>}
          </div>

          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#f4c430', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
            Ingresar al Sistema
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#555' }}>
          ¿No tienes una cuenta? <Link to="/registrar" style={{ color: '#0066cc', textDecoration: 'none', fontWeight: 'bold' }}>Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}
