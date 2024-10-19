import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ReCAPTCHA from 'react-google-recaptcha';


import imagen1 from '../Imagenes/ImagenV1.jpg';
import imagen2 from '../Imagenes/Imge77.jpg';
import imagen3 from '../Imagenes/Image4.jpg';
import imagen4 from '../Imagenes//Image2.png';
import imagen5 from '../Imagenes/Imagen1.png';
import imagen6 from '../Imagenes/Image6.jpg';


const MySwal = withReactContent(Swal);

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  const images = [imagen1, imagen3, imagen4, imagen5];

  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLocked) {
      setErrorMessage('Tu cuenta está bloqueada tras 5 intentos fallidos. Inténtalo más tarde.');
      return;
    }

    if (!captchaToken) {
      setErrorMessage('Por favor, completa el CAPTCHA para continuar.');
      return;
    }

    try {
      const response = await axios.post('https://back-rq8v.onrender.com/api/login', {
        user: username,
        password: password,
        captchaToken,
      });

      const { tipo } = response.data;
      localStorage.setItem('usuario', JSON.stringify(response.data));
      let ruta = '/';
      let mensaje = 'Has iniciado sesión correctamente.';

      switch (tipo) {
        case "Cliente":
          ruta = '/cliente';
          break;
        case "Administrativo":
          ruta = '/admin';
          break;
        default:
          console.log('Tipo de usuario no reconocido:', tipo);
          setErrorMessage('Tipo de usuario desconocido');
          return;
      }

      MySwal.fire({
        position: 'center',
        icon: 'success',
        title: mensaje,
        showConfirmButton: false,
        timer: 2000,
        backdrop: true,
      }).then(() => {
        navigate(ruta);
      });

      setLoginAttempts(0);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setLoginAttempts(prev => {
          const newAttempts = prev + 1;
          let attemptsLeft = 5 - newAttempts;

          if (newAttempts >= 5) {
            setIsLocked(true);
            MySwal.fire({
              icon: 'error',
              title: 'Cuenta Bloqueada',
              text: 'Tu cuenta ha sido bloqueada tras 5 intentos fallidos. Intenta de nuevo más tarde.',
            });
            setErrorMessage('Tu cuenta ha sido bloqueada.');
          } else {
            MySwal.fire({
              icon: 'error',
              title: 'Inicio de Sesión Fallido',
              text: `Usuario o contraseña incorrectos. Intentos restantes: ${attemptsLeft}`,
            });
            setErrorMessage(`Intentos restantes: ${attemptsLeft}`);
          }
          return newAttempts;
        });
      } else if (error.response) {
        setErrorMessage('Error en el servidor: ' + error.response.data.error);
      } else {
        setErrorMessage('Error al iniciar sesión. Inténtalo de nuevo más tarde.');
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const estilos = {
    contenedorPrincipal: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '50vh',
      padding: '20px',
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
    carrusel: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '15px',
      height: '500px',
      backgroundColor: '#e0f7fa', 
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
      padding: '10px 15px', 
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      transition: 'background-color 0.3s ease',
      textDecoration: 'none',
      display: 'block',
      margin: '20px auto 0',
      width: '100%',
    },
    enlace: {
      color: '#00796b',
      textDecoration: 'none',
      marginTop: '10px', 
      display: 'block',
    },
    error: {
      color: 'red',
      marginTop: '10px',
    },
    captcha: {
      margin: '10px 0',
    },
    imagenCarrusel: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '10px',
    },
    
    '@media (max-width: 768px)': { // Tablets
      contenedorLogin: {
        flexDirection: 'column',
        maxWidth: '600px',
      },
      carrusel: {
        height: '300px',
      },
    },
    '@media (max-width: 480px)': { // Móviles
      contenedorLogin: {
        flexDirection: 'column',
        maxWidth: '100%',
        width: '100%',
      },
      carrusel: {
        height: '200px',
      },
      contenedorFormulario: {
        padding: '10px',
      },
      boton: {
        padding: '10px 15px',
        fontSize: '14px',
      },
    },
  };

  return (
    <div style={estilos.contenedorPrincipal}>
      <div style={estilos.contenedorLogin}>
        <div style={estilos.carrusel}>
          <img src={images[currentImage]} alt="Carrusel" style={estilos.imagenCarrusel} />
        </div>
        <div style={estilos.contenedorFormulario}>
          <h1 style={estilos.titulo}>Iniciar Sesión</h1>
          <form onSubmit={handleSubmit}>
            <div style={estilos.campo}>
              <label style={estilos.etiqueta}>&#128100; Usuario</label>
              <input
                type="text"
                placeholder="Usuario"
                style={estilos.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLocked}
              />
            </div>
            <div style={estilos.campo}>
              <label style={estilos.etiqueta}>&#128274; Contraseña</label>
              <input
                type="password"
                placeholder="Contraseña"
                style={estilos.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLocked}
              />
            </div>
            <div style={estilos.captcha}>
              <ReCAPTCHA
                sitekey="6Lc_u2EqAAAAAG8Jg_KW2Rf6qLF0mFY8j79Lifjk"
                onChange={onCaptchaChange}
              />
            </div>

            <button type="submit" style={estilos.boton} disabled={isLocked}>Iniciar Sesión</button>
            <Link to="/verificar_correo" style={estilos.enlace}>¿Olvidaste la contraseña?</Link>
            <Link to="/registro" style={estilos.enlace}>Regístrate</Link>
          </form>
          {errorMessage && <p style={estilos.error}>{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
}

export default Login;
