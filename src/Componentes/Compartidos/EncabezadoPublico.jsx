import React, { useState, useRef, useEffect } from 'react';
import { HomeOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const EncabezadoPublico = () => {
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
      case "home":
        navigate('/');
        break;
      case "login":
        navigate('/login');
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
           padding: 20px 15px; 
          background-color: var(--color-primary);
          color: var(--color-secondary);
        }

        .logo h1 {
          font-size: 1.2rem; 
          font-weight: bold;
          color: var(--color-secondary);
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
            display: flex;
          }
        }
      `}</style>

      <header className="header">
        <div className="logo">
          <h1>Centro de Rehabilitación Integral</h1>
        </div>
        <nav className={`menu ${isMobileMenuOpen ? 'menu-open' : ''}`} ref={menuRef}>
          <ul>
          <li className={active === 'home' ? 'active' : ''} onClick={() => { handleClick('home'); handleMenuClick('home'); }}>
              <HomeOutlined style={{ color: '#00B300' }} />
              Home
            </li>

            <li className={active === 'login' ? 'active' : ''} onClick={() => { handleClick('login'); handleMenuClick('login'); }}>
              <LoginOutlined style={{ color: '#00B300' }} />
              Iniciar sesión
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

export default EncabezadoPublico;
