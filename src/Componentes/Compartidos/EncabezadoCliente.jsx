import React, { useState, useRef, useEffect } from 'react';
import { HomeOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EncabezadoCliente = () => {
  const [active, setActive] = useState('inicio');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [eslogan, setEslogan] = useState('');
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
      case "cerrarSesion":
        try {
         
          console.log('Cerrando sesión...');

         
          await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include', 
            headers: {
              'Content-Type': 'application/json',
            },
          });
          localStorage.removeItem('token'); 
          sessionStorage.removeItem('token'); 

          
          navigate('/');
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
        }
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
          --color-primary: #000000;
          --color-secondary: #FFFFFF;
          --color-hover: #A9DFBF;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 15px;
          background-color: var(--color-primary);
          color: var(--color-secondary);
        }
        .logo h1 {
          font-size: 1.2rem; 
          font-weight: bold;
          color: var(--color-secondary);
        }
          .logo img {
          width: 60px; 
          height: 10px; 
          border-radius: 50%; 
          margin-right: 10px; 
        }
          .logo {
          display: flex;
          align-items: center;
          flex: 1; 
        }

          .eslogan {
          display: flex;
          align-items: center;
          flex: 2; 
        }

        .menu ul {
          display: flex;
          gap: 15px;
          list-style-type: none;
          margin: 0;
          padding: 0;
        }

        .menu ul li {
          font-size: 1rem;
          cursor: pointer;
          padding: 8px 12px;
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
          background-color: var(--color-secondary);
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
            background-color: var(--color-primary);
            padding: 20px;
            transition: left 0.3s ease-in-out;
          }

          .menu.menu-open ul {
            display: flex;
            left: 0;
          }

          .mobile-menu-icon {
            display: flex;
          }
        }
      `}</style>
      


      <header className="header">
      <div className="logo">
          {logoUrl && (
            <img src={logoUrl} alt="Logo de la Empresa" style={{ height: '50px', marginRight: '10px' }} />
          )}
          <h3>{nombreEmpresa}</h3>
        </div>
        <div className='eslogan'>
          <h4>{eslogan}</h4>
        </div>
        <nav className={`menu ${isMobileMenuOpen ? 'menu-open' : ''}`} ref={menuRef}>
          <ul>
            <li className={active === 'perfil' ? 'active' : ''} onClick={() => { handleClick('perfil'); handleMenuClick('perfil'); }}>
              <HomeOutlined style={{ color: '#00B300', marginRight: '8px' }} />
              Home
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
