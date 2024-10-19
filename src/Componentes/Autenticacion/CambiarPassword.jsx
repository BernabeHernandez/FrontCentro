import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function CambiarPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state; // Recibe el email desde el estado

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar si las contraseñas coinciden
    if (newPassword !== confirmPassword) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden. Por favor, verifica e intenta nuevamente.',
      });
      return;
    }

    try {
      // Enviar nueva contraseña al backend
      const response = await axios.post('http://localhost:5000/api/cambio/reset-password', {
        email,
        newPassword,
      });

      if (response.data.success) {
        MySwal.fire({
          icon: 'success',
          title: 'Contraseña cambiada',
          text: 'Tu contraseña ha sido actualizada correctamente.',
        });

        // Redirigir al inicio de sesión
        navigate('/login');
      }
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al cambiar la contraseña. Inténtalo de nuevo.',
      });
    }
  };

  const estilos = {
    contenedor: {
      textAlign: 'center',
      backgroundColor: '#e0f7fa',
      padding: '20px',
      borderRadius: '15px',
      maxWidth: '400px',
      margin: '40px auto',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    },
    titulo: {
      fontSize: '28px',
      marginBottom: '20px',
      color: '#004d40',
    },
    campo: {
      marginBottom: '15px',
      textAlign: 'center',
    },
    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #b2dfdb',
      fontSize: '16px',
      boxSizing: 'border-box',
    },
    boton: {
      backgroundColor: '#00796b',
      color: 'white',
      border: 'none',
      padding: '12px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      transition: 'background-color 0.3s ease',
      display: 'block',
      margin: '20px auto 0',
      width: '100%',
    },
  };

  return (
    <div style={estilos.contenedor}>
      <h1 style={estilos.titulo}>Cambiar Contraseña</h1>
      <form onSubmit={handleSubmit}>
        <div style={estilos.campo}>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={estilos.input}
          />
        </div>
        <div style={estilos.campo}>
          <input
            type="password"
            placeholder="Confirmar nueva contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={estilos.input}
          />
        </div>
        <button type="submit" style={estilos.boton}>Cambiar Contraseña</button>
      </form>
    </div>
  );
}

export default CambiarPassword;
