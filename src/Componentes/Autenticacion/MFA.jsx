import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuth } from './AuthContext'; 

const MySwal = withReactContent(Swal);

function VerificarCodigo() {
  const navigate = useNavigate();
  const { login } = useAuth();  
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!/^\d{6}$/.test(codigo)) {
      setError('Por favor ingresa un código de verificación válido (6 dígitos).');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://backendcentro.onrender.com/api/login/verificar_codigo', {
        codigo: codigo,
      });

      const { tipo, message } = response.data;

      if (message === "Código incorrecto o expirado") {
        MySwal.fire({
          icon: 'error',
          title: 'Código Incorrecto o Expirado',
          text: 'El código ingresado es incorrecto o ha expirado. Por favor, revisa tu correo e inténtalo nuevamente.',
        });
        setLoading(false);
        return;
      }

      login(response.data); 

      let ruta = '/';
      switch (tipo) {
        case "Cliente":
          ruta = '/cliente';
          break;
        case "Administrador":
          ruta = '/admin';
          break;
        default:
          console.log('Tipo de usuario no reconocido:', tipo);
          MySwal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Tipo de usuario desconocido',
          });
          setLoading(false);
          return;
      }

      MySwal.fire({
        position: 'center',
        icon: 'success',
        title: 'Verificación Exitosa',
        showConfirmButton: false,
        timer: 2000,
        backdrop: true,
      }).then(() => {
        navigate(ruta);
      });
    } catch (error) {
      console.error(error);
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Código incorrecto.',
      });
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '400px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', margin: '20px auto' }}>
      <h2 style={{ textAlign: 'center', color: '#00796b' }}>Verificar Código MFA</h2>
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>
            <small>{error}</small>
          </div>
        )}
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Ingresa el código de verificación"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
            maxLength={6}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              fontSize: '16px',
              border: '1px solid #ccc',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px 0',
            backgroundColor: '#00796b',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
          disabled={loading}
        >
          {loading ? 'Verificando...' : 'Verificar'}
        </button>
      </form>
    </div>
  );
}

export default VerificarCodigo;
