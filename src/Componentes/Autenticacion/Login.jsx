import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ReCAPTCHA from 'react-google-recaptcha';
import { useAuth } from './AuthContext'; 

import imagen1 from '../Imagenes/ImagenV1.jpg';
import imagen3 from '../Imagenes/Image4.jpg';
import imagen4 from '../Imagenes/Image2.png';
import imagen5 from '../Imagenes/Imagen1.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';  

const MySwal = withReactContent(Swal);

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeLeft, setLockTimeLeft] = useState(0);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const images = [imagen1, imagen3, imagen4, imagen5];

  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLocked) {
        MySwal.fire({
            icon: 'error',
            title: 'Cuenta Bloqueada',
            text: 'Tu cuenta está bloqueada temporalmente. Espera un momento para intentar de nuevo.',
        });
        return;
    }

    if (!captchaToken) {
        MySwal.fire({
            icon: 'warning',
            title: 'CAPTCHA Requerido',
            text: 'Por favor, completa el CAPTCHA para continuar.',
        });
        return;
    }

    try {
        const response = await axios.post('https://backendcentro.onrender.com/api/login', {
            user: username,
            password: password,
            captchaToken,
        });

        const { tipo, qrCodeUrl, message } = response.data;

        if (qrCodeUrl) {
            
            navigate('/codigo-mfa', { state: { qrCodeUrl, user: username, tipo } });
            return;
        }

        
    } catch (error) {
      if (error.response) {
        const { lockTimeLeft, attemptsLeft, error: serverError } = error.response.data;
  
        
        if (serverError === 'Usuario no encontrado') {
          MySwal.fire({
            icon: 'error',
            title: 'Usuario No Encontrado',
            text: 'El usuario ingresado no existe.',
          });
          
          MySwal.fire({
            icon: 'info',
            title: 'Intentos restantes: 0',
          });
        } else if (serverError === 'La cuenta no está verificada. Por favor, revisa tu correo para activar tu cuenta.') {
          MySwal.fire({
            icon: 'warning',
            title: 'Cuenta No Verificada',
            text: serverError,
          });
        } else if (serverError && serverError === 'Tu cuenta está permanentemente bloqueada. Por favor, contacta con el administrador.') {
          MySwal.fire({
            icon: 'error',
            title: 'Cuenta Bloqueada Permanentemente',
            text: serverError,
          });
        } else if (lockTimeLeft) {
          setIsLocked(true);
          setLockTimeLeft(lockTimeLeft);
        } else {
          
          const attempts = attemptsLeft || 0;
          MySwal.fire({
            icon: 'error',
            title: 'Usuario o Contraseña Incorrecta',
            text: `Intentos restantes: ${attempts}`,
          });
        }
      } else {
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al iniciar sesión. Inténtalo de nuevo más tarde.',
        });
      }
    }
  };


  
  

  useEffect(() => {
    const interval = setInterval(() => {
      if (isLocked && lockTimeLeft > 0) {
        setLockTimeLeft(prev => {
          const newTime = prev - 1;
          return newTime;
        });
      } else if (lockTimeLeft === 0) {
        setIsLocked(false);
      }
    }, 1000); 

    return () => clearInterval(interval);
  }, [isLocked, lockTimeLeft]);

  const formatLockTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  const estilos = {
    contenedorPrincipal: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '5vh',
      padding: '55px',
      backgroundColor: '#ffffff',
    },
    contenedorLogin: {
      backgroundColor: '#fff',
      borderRadius: '15px',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      maxWidth: '900px',
      width: '100%',
      overflow: 'hidden',
      flexDirection: 'row',
    },
    contenedorFormulario: {
      flex: 1,
      padding: '20px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      backgroundColor: '#e0f7fa',
    },
    titulo: {
      fontSize: '24px',
      marginBottom: '10px',
      color: '#004d40',
    },
    campo: {
      marginBottom: '10px',
      textAlign: 'center',
    },
    etiqueta: {
      display: 'block',
      marginBottom: '5px',
      textAlign: 'left',
      fontWeight: 'bold',
      color: '#00695c',
    },
    input: {
      width: '100%',
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #b2dfdb',
      fontSize: '16px',
      boxSizing: 'border-box',
    },
    boton: {
      backgroundColor: '#00796b',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '10px 15px',
      fontSize: '16px',
      cursor: 'pointer',
    },
    enlace: {
      display: 'block',
      marginTop: '10px',
      textDecoration: 'none',
      color: '#00796b',
    },
    error: {
      color: 'red',
    },
    temporizador: {
      color: 'red',
      marginTop: '10px',
    },
    imagen: {
      flex: 1,
      backgroundImage: `url(${images[currentImage]})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '350px',
    },
    icono: {
      position: 'absolute',
      top: '50%',
      right: '10px',
      transform: 'translateY(-50%)',
      cursor: 'pointer',
    },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000); 

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div style={estilos.contenedorPrincipal}>
      <div style={estilos.contenedorLogin}>
        <div style={estilos.imagen}></div>
        <div style={estilos.contenedorFormulario}>
          <h2 style={estilos.titulo}>Iniciar Sesión</h2>
          <form onSubmit={handleSubmit}>
            <div style={estilos.campo}>
              <label style={estilos.etiqueta}>Usuario:</label>
              <input
                type="text"
                style={estilos.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div style={estilos.campo}>
              <label style={estilos.etiqueta}>Contraseña:</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  style={estilos.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div
                  style={estilos.icono}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>
            <ReCAPTCHA
              sitekey="6Lc_u2EqAAAAAG8Jg_KW2Rf6qLF0mFY8j79Lifjk" 
              onChange={onCaptchaChange}
              style={{ marginBottom: '10px' }}
            />
            <button type="submit" style={estilos.boton} disabled={isLocked}>
              Iniciar Sesión
            </button>
            <Link to="/verificar_correo" style={estilos.enlace}>¿Olvidaste la contraseña?</Link>
            <Link to="/registro" style={estilos.enlace}>Regístrate</Link>
          </form>
          {isLocked && (
            <p style={estilos.temporizador}>
              Tiempo restante para desbloquear: {formatLockTime(lockTimeLeft)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
