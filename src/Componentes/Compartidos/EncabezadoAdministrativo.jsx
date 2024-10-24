import React, { useState, useRef, useEffect } from 'react';
import { HomeOutlined, UserOutlined, PhoneOutlined, AppstoreOutlined, LogoutOutlined, FileTextOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EncabezadoAdministrativo = () => {
  const [active, setActive] = useState('inicio');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEmpresaMenuOpen, setIsEmpresaMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState(''); 
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/perfilF');
        const data = response.data;
        setLogoUrl(`http://localhost:5000/images/${data.logo}`); 
      } catch (error) {
        console.error('Error al obtener datos del perfil:', error);
      }
    };
    fetchLogo();
  }, []);

  const handleClick = (option) => {
    setActive(option);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleEmpresaMenu = () => {
    setIsEmpresaMenuOpen(!isEmpresaMenuOpen);
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
      case "activity-log":
        navigate('/admin/activity-log');
        break;
      case "registro-password":
        navigate('/admin/registro-password');
        break;
      case "roles":
        navigate('/admin/roles');
        break;
      case "cerrarSesion":
        handleLogout(); // Cerrar sesión sin llamar al backend
        break;
      default:
        console.log("No se reconoce la acción del menú");
    }
  };

  const handleLogout = () => {
    console.log('Cerrando sesión...');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    navigate('/'); // Redirigir al usuario a la página de inicio
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

        .logo {
          display: flex;
          align-items: center;
        }

        .logo img {
          height: 50px; /* Ajusta la altura del logo */
          margin-right: 10px; /* Espaciado entre logo y título */
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

        .menu ul .dropdown-menu {
          display: none;
          position: absolute;
          background-color: var(--color-primary);
          list-style: none;
          padding: 12px;
          margin-top: 200px;
          border-radius: 5px;
        }

        .menu ul .dropdown-menu li {
          padding: 8.5px 12px;
          cursor: pointer;
          color: var(--color-secondary);
        }

        .menu ul .dropdown:hover .dropdown-menu {
          display: block;
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
            background-color: var(--color-mobile-bg);
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
            color: var(--color-mobile-text);
          }

          .mobile-menu-icon {
            display: flex; /* Asegúrate de que el ícono se muestre en móvil */
          }
        }
      `}</style>

      <header className="header">
        <div className="logo">
          {logoUrl && <img src={logoUrl} alt="Logo" />} {/* Mostrar logo aquí */}
          <h1>Centro de Rehabilitación Integral</h1>
        </div>
        <nav className={`menu ${isMobileMenuOpen ? 'menu-open' : ''}`} ref={menuRef}>
          <ul>
            <li className="dropdown">
              <span onMouseEnter={toggleEmpresaMenu}>
                <FileTextOutlined style={{ color: '#00B300', marginRight: '8px' }} />
                Datos de la Empresa
              </span>
              <ul className="dropdown-menu">
                <li onClick={() => { handleClick('perfil'); handleMenuClick('perfil'); }}>Perfil</li>
                <li onClick={() => { handleClick('terminos'); handleMenuClick('terminos'); }}>Términos</li>
                <li onClick={() => { handleClick('politicas'); handleMenuClick('politicas'); }}>Políticas</li>
                <li onClick={() => { handleClick('deslinde'); handleMenuClick('deslinde'); }}>Deslinde</li>
              </ul>
            </li>

            <li className="dropdown">
              <span>
                <AppstoreOutlined style={{ color: '#00B300', marginRight: '8px' }} />
                Registro de actividades
              </span>
              <ul className="dropdown-menu">
                <li onClick={() => { handleClick('activity-log'); handleMenuClick('activity-log'); }}>Registro de logeos</li>
                <li onClick={() => { handleClick('registro-password'); handleMenuClick('registro-password'); }}>Registro de Contraseña</li>
                <li onClick={() => { handleClick('activity-log'); handleMenuClick('activity-log'); }}>.</li>
                <li onClick={() => { handleClick('registro-password'); handleMenuClick('registro-password'); }}>.</li>
              </ul>
            </li>

            <li onClick={() => handleMenuClick('cerrarSesion')}>
              <LogoutOutlined style={{ color: '#00B300', marginRight: '8px' }} />
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
