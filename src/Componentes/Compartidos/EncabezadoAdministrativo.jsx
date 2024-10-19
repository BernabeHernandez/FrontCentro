import React, { useState, useRef, useEffect } from 'react';
import { HomeOutlined, UserOutlined, PhoneOutlined, AppstoreOutlined, LogoutOutlined, FileTextOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const EncabezadoAdministrativo = () => {
  const [active, setActive] = useState('inicio');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null); 

  const handleClick = (option) => {
    setActive(option);
    setIsMobileMenuOpen(false); 
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClick = (key) => {
    switch (key) {
      case "politicas":
        navigate('/admin/politicas');
        break;
      case "terminos":
        navigate('/admin/terminos');
        break;
      case "perfil":
        navigate('/admin/perfil');
        break;
      case "deslinde":
        navigate('/admin/deslinde');
        break;
      case "quienesSomos":
        navigate('/admin/informacion/lista-quienes-somos');
        break;
      case "misionVision":
        navigate('/admin/informacion/mision-vision-lista');
        break;
      case "politicasPrivacidad":
        navigate('/admin/informacion/politicas-privacidad-lista');
        break;
      case "preguntasFrecuentes":
        navigate('/admin/preguntas-frecuentes');
        break;
      case "asignarIOT":
        navigate('/admin/asignar-IOT');
        break;
      case "cerrarSesion":
        console.log('Cerrando sesión...');
        navigate('/');
        break;
      default:
        console.log("No se reconoce la acción del menú");
    }
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <style>{`
        :root {
          --color-primary: #000000; /* Encabezado negro */
          --color-secondary: #FFFFFF; /* Blanco */
          --color-highlight: #4682B4; /* Azul */
          --color-hover: #A9DFBF; /* Verde claro */
          --color-mobile-bg: #2E8B57; /* Verde para el menú móvil */
          --color-mobile-text: #FFFFFF; /* Color blanco para el texto del menú móvil */
          --color-icon: #00B300; /* Verde brillante para los iconos */
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 15px; /* Grosor del encabezado ajustado */
          background-color: var(--color-primary);
          color: var(--color-secondary);
        }

        .logo h1 {
          font-size: 1.5rem; /* Tamaño de la fuente del logo */
          font-weight: bold;
          color: var(--color-secondary);
        }

        .menu ul {
          display: flex;
          gap: 15px; /* Espacio entre las opciones */
          list-style-type: none;
          margin: 0;
          padding: 0;
        }

        .menu ul li {
          font-size: 1rem; /* Tamaño de la fuente del menú */
          cursor: pointer;
          padding: 8px 12px; /* Padding de las opciones del menú */
          color: var(--color-secondary);
          transition: background-color 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .menu ul li:hover {
          background-color: var(--color-hover);
          border-radius: 5px;
        }

        .menu ul li.active {
          background-color: var(--color-highlight);
          border-radius: 5px;
        }

        .mobile-menu-icon {
          display: none;
          cursor: pointer;
          flex-direction: column;
          gap: 4px;
        }

        .hamburger {
          width: 25px;
          height: 3px;
          background-color: var(--color-secondary);
          transition: background-color 0.3s ease;
        }

        @media (max-width: 768px) {
          .menu ul {
            display: none;
            flex-direction: column;
            position: fixed;
            top: 0;
            left: -100%;
            width: 70%;
            height: 100%;
            background-color: var(--color-mobile-bg); /* Color de fondo del menú móvil actualizado */
            padding: 20px;
            transition: left 0.3s ease-in-out;
            box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
          }

          .menu.menu-open ul {
            display: flex;
            left: 0;
          }

          .menu ul li {
            padding: 20px;
            border-bottom: 1px solid var(--color-hover);
            text-align: left;
            color: var(--color-mobile-text); /* Color blanco para el texto del menú móvil */
          }

          .mobile-menu-icon {
            display: flex; /* Asegúrate de que el ícono se muestre en móvil */
          }
        }
      `}</style>

      <header className="header">
        <div className="logo">
          <h1>Centro de Rehabilitación Integral</h1>
        </div>
        <nav className={`menu ${isMobileMenuOpen ? 'menu-open' : ''}`} ref={menuRef}>
          <ul>
            <li className={active === 'politicas' ? 'active' : ''} onClick={() => { handleClick('politicas'); handleMenuClick('politicas'); }}>
              <FileTextOutlined style={{ color: '#00B300' }} /> 
              Políticas
            </li>
            <li className={active === 'terminos' ? 'active' : ''} onClick={() => { handleClick('terminos'); handleMenuClick('terminos'); }}>
              <AppstoreOutlined style={{ color: '#00B300' }} /> 
              Términos
            </li>
            <li className={active === 'perfil' ? 'active' : ''} onClick={() => { handleClick('perfil'); handleMenuClick('perfil'); }}>
              <UserOutlined style={{ color: '#00B300' }} /> 
              Perfil
            </li>
            <li className={active === 'deslinde' ? 'active' : ''} onClick={() => { handleClick('deslinde'); handleMenuClick('deslinde'); }}>
              <PhoneOutlined style={{ color: '#00B300' }} /> 
              Deslinde
            </li>
            <li className={active === 'asignarIOT' ? 'active' : ''} onClick={() => { handleClick('asignarIOT'); handleMenuClick('asignarIOT'); }}>
              <InfoCircleOutlined style={{ color: '#00B300' }} /> 
              ...
            </li>
            <li className={active === 'cerrarSesion' ? 'active' : ''} onClick={() => { handleClick('cerrarSesion'); handleMenuClick('cerrarSesion'); }}>
              <LogoutOutlined style={{ color: '#00B300' }} />
              Cerrar Sesión
            </li>
          </ul>
        </nav>
        <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
          <div className="hamburger"></div>
          <div className="hamburger"></div>
          <div className="hamburger"></div>
        </div>
      </header>
    </>
  );
};

export default EncabezadoAdministrativo;
