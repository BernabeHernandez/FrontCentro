import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuth } from './AuthContext'; 

const MySwal = withReactContent(Swal);

function VerifyMFA({ onLoginSuccess }) {
  const location = useLocation();  
  const navigate = useNavigate(); 
  const { login } = useAuth(); 

  const { qrCodeUrl, user, tipo: tipoUsuario } = location.state || {}; 


  const [mfaCode, setMfaCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [mfaCodeError, setMfaCodeError] = useState('');

  const handleMfaSubmit = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
  
    try {
      const response = await axios.post('https://backendcentro.onrender.com/api/login/verify-mfa', {
        user: user,
        token: mfaCode,
      });
  
      const { tipo, error } = response.data;
  
      if (error) {
        console.error("Error desde el servidor:", error);
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: error,
        });
        setIsVerifying(false);
        return;
      }
  
      login({ tipo }); 
      const ruta = tipo === 'Administrador' ? '/admin' : '/cliente';
  
      MySwal.fire({
        position: 'center',
        icon: 'success',
        title: 'Has iniciado sesión correctamente.',
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        navigate(ruta);
      });
    } catch (error) {
      console.error('Error verificando MFA:', error);
      MySwal.fire({
        icon: 'error',
        title: 'Error al verificar MFA',
        text: 'Código incorrecto. Intenta nuevamente.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleMfaCodeChange = (e) => {
    const value = e.target.value;
    
    if (/^\d{0,6}$/.test(value)) {
      setMfaCode(value);
      setMfaCodeError('');
    } else {
      setMfaCodeError('El código MFA debe ser solo numérico y tener 6 caracteres.');
    }
  };

  return (
    <div style={estilos.contenedor}>
      <h2 style={estilos.titulo}>Verificación MFA</h2>
      <p style={estilos.descripcion}>
        Escanea el código QR con tu aplicación de autenticación y escribe el código generado.
      </p>
      {qrCodeUrl && <img src={qrCodeUrl} alt="Código QR" style={estilos.qrCode} />}
      <form onSubmit={handleMfaSubmit} style={estilos.formulario}>
        <label style={estilos.etiqueta}>Código MFA:</label>
        <input
          type="text"
          value={mfaCode}
          onChange={handleMfaCodeChange}
          style={estilos.input}
          required
          maxLength="6"
        />
        {mfaCodeError && <p style={{ color: 'red' }}>{mfaCodeError}</p>}
        <button type="submit" style={estilos.boton} disabled={isVerifying}>
          {isVerifying ? 'Verificando...' : 'Verificar Código'}
        </button>
      </form>
    </div>
  );
}

const estilos = {
  contenedor: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f7f9fc',
    borderRadius: '10px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    margin: 'auto',
  },
  titulo: {
    fontSize: '24px',
    marginBottom: '10px',
    color: '#333',
  },
  descripcion: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '20px',
    textAlign: 'center',
  },
  qrCode: {
    width: '200px',
    height: '200px',
    marginBottom: '20px',
  },
  formulario: {
    width: '100%',
  },
  etiqueta: {
    display: 'block',
    marginBottom: '5px',
    color: '#333',
    fontWeight: 'bold',
  },
  input: {
    width: '95%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  boton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },

  '@media (max-width: 768px)': {
    contenedor: {
      padding: '15px',
      maxWidth: '90%',
    },
    titulo: {
      fontSize: '20px',
    },
    descripcion: {
      fontSize: '14px',
    },
    qrCode: {
      width: '150px',
      height: '150px',
    },
    input: {
      fontSize: '14px',
      padding: '8px',
    },
    boton: {
      fontSize: '14px',
      padding: '8px',
    },
  },

  '@media (max-width: 480px)': {
    contenedor: {
      padding: '10px',
      maxWidth: '100%',
    },
    titulo: {
      fontSize: '18px',
    },
    descripcion: {
      fontSize: '12px',
    },
    qrCode: {
      width: '120px',
      height: '120px',
    },
    input: {
      fontSize: '12px',
      padding: '6px',
    },
    boton: {
      fontSize: '12px',
      padding: '6px',
    },
  },
};

export default VerifyMFA;
