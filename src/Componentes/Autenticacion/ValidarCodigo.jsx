import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function ValidarCodigo() {
  const [codigo, setCodigo] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state; 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://backendcentro.onrender.com/api/codigo/validar_codigo', { email, codigo });

      if (response.data.success) {
        MySwal.fire({
          icon: 'success',
          title: 'Código verificado',
          text: 'El código es correcto. Puedes cambiar tu contraseña.',
        });

        navigate('/cambiar_password', { state: { email } });
      }
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Código incorrecto',
        text: 'El código ingresado es incorrecto. Intenta nuevamente.',
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
      <h1 style={estilos.titulo}>Verificar Código</h1>
      <form onSubmit={handleSubmit}>
        <div style={estilos.campo}>
        <input
        type="text"
        placeholder="Código de 6 dígitos"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        required
        style={estilos.input}
        maxLength="6" 
        onKeyPress={(e) => {
            if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
            }
        }}
    />
        </div>
        <button type="submit" style={estilos.boton}>Validar Código</button>
      </form>
    </div>
  );
}

export default ValidarCodigo;
