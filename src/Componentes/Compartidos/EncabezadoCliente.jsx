import React, { useState, useRef, useEffect } from 'react';
import {
  HomeOutlined, LogoutOutlined, UserOutlined, ShoppingCartOutlined, AppstoreOutlined, SearchOutlined
  , QuestionCircleOutlined, ShoppingOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EncabezadoCliente = () => {
  const [active, setActive] = useState('inicio');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [eslogan, setEslogan] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [logoUrl, setLogoUrl] = useState('');

  const handleClick = (option) => {
    setActive(option);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await axios.get('https://backendcentro.onrender.com/api/perfilF');
        const data = response.data;

        setLogoUrl(data.logo);
        setNombreEmpresa(data.nombreEmpresa);
        setEslogan(data.eslogan);
      } catch (error) {
        console.error('Error al obtener datos del perfil:', error);
      }
    };

    fetchPerfil();
    const intervalId = setInterval(fetchPerfil, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handleMenuClick = async (key) => {
    switch (key) {
      case "home":
        navigate('/cliente/');
        break;
      case "productos":
        navigate('/cliente/productos');
        break;
      case "carrito":
        navigate('/cliente/carrito');
        break;
      case "servicios":
        navigate('/cliente/servicios');
        break;
      case "perfilUsuario":
        navigate('/cliente/perfilUsuario');
        break;
      case "cerrarSesion":
        try {
          console.log('Cerrando sesión...');
          // Eliminar datos del usuario de localStorage
          localStorage.removeItem('user'); // Eliminar el usuario
          localStorage.removeItem('token'); // Eliminar el token (si lo tienes)

          // Eliminar datos de sessionStorage (si los usas)
          sessionStorage.removeItem('token');

          // Redirigir al usuario a la página de inicio
          navigate('/');
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
        }
        break;
      default:
        console.log("No se reconoce la acción del menú");
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      navigate(`/cliente/resultados?query=${encodeURIComponent(searchQuery)}`);
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
          --color-primary: #000000; 
          --color-secondary: #FFFFFF; 
          --color-highlight: #4682B4; 
          --color-hover: #A9DFBF; 
          --color-mobile-bg: #333333; 
          --color-mobile-text: #FFFFFF;
          --color-icon: #00B300; 
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 5px 7px; 
          background-color: var(--color-primary);
          color: var(--color-secondary);
        }

        .logo h1 {
          font-size: 1.2rem; 
          font-weight: bold;
          color: var(--color-secondary);
        }

        .logo img {
          width: 61%; 
          height: 10px; 
          border-radius: 50%; 
        }

        .logo {
          display: flex;
          align-items: center;
          flex: 1; 
        }

        .eslogan {
          display: flex;
          align-items: center;
          flex: 0.5; 
        }

        .menu ul {
          display: flex;
          gap: 1px; 
          list-style-type: none;
          margin: 0;
          padding: 0;
        }

        .menu ul li {
          font-size: 1rem; 
          cursor: pointer;
          padding: 8px 12px; 
          color: var(--color-secondary);
          transition: background-color 0.3s ease, color 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .menu ul li:hover {
          background-color: var(--color-hover);
          border-radius: 5px;
        }

        .menu ul li.active {
          background-color: #A9DFBF;
          border-radius: 5px;
        }

        .search-container {
          flex: 0.9; 
          display: flex;
          align-items: center;
          margin-left: -250px; 
        }

        .search-input {
          width: 80%;
          padding: 4px;
          font-size: 0.9rem;
          border-radius: 25px;
          border: 2px solid var(--color-secondary);
          outline: none;
          margin-right: 1px;
        }

        .search-button {
          background-color: var(--color-black);
          border: none;
          padding: 10px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
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
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 0;
            left: -100%;
            width: 70%;
            height: 100%;
            background-color: var( --color-primary); 
            padding: 20px;
            transition: left 0.3s ease-in-out;
            box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
          }

          .menu.menu-open ul {
            left: 0;
              z-index: 1000;
          }

          .menu ul li {
            padding: 20px;
            border-bottom: 1px solid var(--color-hover);
            text-align: left;
            color: var(--color-mobile-text); 
          }

          .mobile-menu-icon {
            display: flex;
          }
        }
      `}</style>



      <header className="header">
        <div className="logo">
          {logoUrl && (
            <img src={logoUrl} alt="Logo de la Empresa" style={{ height: '75px', width: '75px', marginRight: '10px' }} />
          )}
        </div>
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar producto o servicio"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="search-button" onClick={handleSearch}>
            <SearchOutlined style={{ color: '#FFFFFF', fontSize: '18px' }} />
          </button>
        </div>
        <nav className={`menu ${isMobileMenuOpen ? 'menu-open' : ''}`} ref={menuRef}>
          <ul>
            <li className={active === 'home' ? 'active' : ''} onClick={() => { handleClick('home'); handleMenuClick('home'); }}>
              <HomeOutlined style={{ color: '#00B300', marginRight: '8px' }} />
              Home
            </li>
            <li className={active === 'servicios' ? 'active' : ''} onClick={() => { handleClick('servicios'); handleMenuClick('servicios'); }}>
              <AppstoreOutlined style={{ color: '#00B300' }} />
              Servicios
            </li>
            <li className={active === 'productos' ? 'active' : ''} onClick={() => { handleClick('productos'); handleMenuClick('productos'); }}>
              < ShoppingOutlined style={{ color: '#00B300' }} />
              Productos
            </li>

            <li className={active === 'carrito' ? 'active' : ''} onClick={() => { handleClick('carrito'); handleMenuClick('carrito'); }}>
              <ShoppingCartOutlined style={{ color: '#00B300' }} />
              Carrito
            </li>

            <li className={active === 'perfilUsuario' ? 'active' : ''} onClick={() => { handleClick('perfilUsuario'); handleMenuClick('perfilUsuario'); }}>
              <QuestionCircleOutlined style={{ color: '#00B300' }} />
              Perfil
            </li>
            <li className={active === 'cerrarSesion' ? 'active' : ''} onClick={() => { handleClick('cerrarSesion'); handleMenuClick('cerrarSesion'); }}>
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

export default EncabezadoCliente;
