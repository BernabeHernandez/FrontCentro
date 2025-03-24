import React, { useState, useRef, useEffect } from 'react';
import { AppstoreOutlined, LogoutOutlined, HomeOutlined, FileTextOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EncabezadoAdministrativo = () => {
  const [active, setActive] = useState('inicio');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [logoUrl, setLogoUrl] = useState('');
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [eslogan, setEslogan] = useState('');
  const navigate = useNavigate();
  const menuRef = useRef(null);

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

  const handleClick = (option) => {
    setActive(option);
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const handleMenuClick = (key) => {
    setIsMobileMenuOpen(false); // Cierra el menú móvil
    setOpenDropdown(null); // Cierra cualquier menú desplegable abierto

    switch (key) {
      case "politicas":
        navigate('/admin/politicas');
        break;
      case "home":
        navigate('/admin/');
        break;
      case "terminos":
        navigate('/admin/terminos');
        break;
      case "mision":
        navigate('/admin/mision');
        break;
      case "vision":
        navigate('/admin/vision');
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
      case "registro-sospechosos":
        navigate('/admin/registro-sospechosos');
        break;
      case "productos":
        navigate('/admin/productos');
        break;
      case "inventarioproductos":
        navigate('/admin/inventario');
        break;
      case "servicios":
        navigate('/admin/servicios');
        break;
      case "inventarioservicios":
        navigate('/admin/inventarioser');
        break;
      case "categoria":
        navigate('/admin/categoria');
        break;
      case "registroHo":
        navigate('/admin/registroH');
        break;
      case "horariosDis":
        navigate('/admin/horariosD');
        break;
      case "promociones":
        navigate('/admin/promociones');
        break;
        case "ventas":
          navigate('/admin/ventas');
          break;
          case "detalleventas":
            navigate('/admin/detalleventas');
            break;
            case "detallecitas":
              navigate('/admin/detallecitas');
              break;
      case "cerrarSesion":
        handleLogout();
        break;
      default:
        console.log("No se reconoce la acción del menú");
    }
  };

  const handleLogout = () => {
    console.log('Cerrando sesión...');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    navigate('/');
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMobileMenuOpen(false);
      setOpenDropdown(null);
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
          --color-mobile-bg: #000000; 
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
          position: relative;
          flex-wrap: wrap; 
        }

        .logo {
          display: flex;
          align-items: center;
          flex: 1; 
        }


        .logo img {
         width: 61%; 
          height: 10px; 
          border-radius: 50%; 
        }
          


        .logo h1 {
          font-size: 1.5rem; 
          font-weight: bold;
          color: var(--color-secondary);
        }
          .eslogan {
          display: flex;
          align-items: center;
          flex: 2; 
        }

        .menu {
          flex: 2; 
          display: flex;
          justify-content: flex-end; 
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
          transition: background-color 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
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
          display: ${openDropdown ? 'block' : 'none'};
          position: absolute;
          left: 0; 
          top: 100%; 
          background-color: var(--color-primary);
          list-style: none;
          padding: 12px;
          margin-top: 10px; 
          border-radius: 5px;
          z-index: 10; 
        }

       .menu ul .dropdown-menu li {
          white-space: nowrap; 
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 250px; 
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
            left: 0; 
            width: 70%; 
            height: 100%;
            background-color: var(--color-mobile-bg); 
            padding: 20px;
            transition: left 0.3s ease-in-out;
            box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
              z-index: 1000;
          }
               .menu ul .dropdown-menu {
    position: static; /* Cambia la posición a estática para que no se superponga */
    width: 100%; /* Asegura que el menú desplegable ocupe todo el ancho disponible */
    margin-top: 0; /* Elimina el margen superior para que no se vea separado */
    background-color: var(--color-mobile-bg); /* Fondo del menú desplegable */
    border-radius: 0; /* Elimina el borde redondeado */
  }

   .menu ul .dropdown-menu li {
    padding: 10px 20px; /* Ajusta el padding para que sea consistente */
    border-bottom: 1px solid var(--color-hover); /* Añade un borde inferior para separar los elementos */
  }

          .menu.menu-open ul {
            display: flex;
              z-index: 1000;
          }

          .menu ul li {
            padding: 15px 20px; 
          }
        .logo h1 { 
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
        <div>
        </div>


        <nav className={`menu ${isMobileMenuOpen ? 'menu-open' : ''}`} ref={menuRef}>
          <ul>
            <li onClick={() => handleMenuClick('home')}>
              <HomeOutlined style={{ color: '#00B300', marginRight: '8px' }} />
              Home
            </li>

            <li className="dropdown" onClick={() => toggleDropdown('control')}>
              <span>
                <AppstoreOutlined style={{ color: '#00B300', marginRight: '8px' }} />
                Control
              </span>
              {openDropdown === 'control' && (
                <ul className="dropdown-menu">
                  <li onClick={() => { handleClick('productos'); handleMenuClick('productos'); }}>Productos</li>
                  <li onClick={() => { handleClick('inventarioproductos'); handleMenuClick('inventarioproductos'); }}>Inventario de Productos</li>
                  <li onClick={() => { handleClick('servicios'); handleMenuClick('servicios'); }}>Servicios</li>
                  <li onClick={() => { handleClick('inventarioservicios'); handleMenuClick('inventarioservicios'); }}>Inventario de Servicios</li>
                  <li onClick={() => { handleClick('categoria'); handleMenuClick('categoria'); }}>Categorias</li>
                  <li onClick={() => { handleClick('registroHo'); handleMenuClick('registroHo'); }}>Registro Horario</li>
                  <li onClick={() => { handleClick('horariosDis'); handleMenuClick('horariosDis'); }}>Disponibilidad</li>
                  <li onClick={() => { handleClick('promociones'); handleMenuClick('promociones'); }}>Promociones</li>
                </ul>
              )}
            </li>


            <li className="dropdown" onClick={() => toggleDropdown('empresa')}>
              <span>
                <FileTextOutlined style={{ color: '#00B300', marginRight: '8px' }} />
                Datos de la Empresa
              </span>
              {openDropdown === 'empresa' && (
                <ul className="dropdown-menu">
                  <li onClick={() => { handleClick('perfil'); handleMenuClick('perfil'); }}>Perfil</li>
                  <li onClick={() => { handleClick('terminos'); handleMenuClick('terminos'); }}>Términos</li>
                  <li onClick={() => { handleClick('politicas'); handleMenuClick('politicas'); }}>Políticas</li>
                  <li onClick={() => { handleClick('deslinde'); handleMenuClick('deslinde'); }}>Deslinde</li>
                  <li onClick={() => { handleClick('mision'); handleMenuClick('mision'); }}>Mision</li>
                  <li onClick={() => { handleClick('vision'); handleMenuClick('vision'); }}>Vision</li>
                </ul>
              )}
            </li>

            <li className="dropdown" onClick={() => toggleDropdown('actividades')}>
              <span>
                <AppstoreOutlined style={{ color: '#00B300', marginRight: '8px' }} />
                Registro de actividades
              </span>
              {openDropdown === 'actividades' && (
                <ul className="dropdown-menu">
                  <li onClick={() => { handleClick('activity-log'); handleMenuClick('activity-log'); }}>Registro de logeos</li>
                  <li onClick={() => { handleClick('registro-password'); handleMenuClick('registro-password'); }}>Registro de Contraseña</li>
                  <li onClick={() => { handleClick('registro-sospechosos'); handleMenuClick('registro-sospechosos'); }}>Lista negra</li>
                </ul>
              )}
            </li>

            <li className="dropdown" onClick={() => toggleDropdown('ventasa')}>
              <span>
                <AppstoreOutlined style={{ color: '#00B300', marginRight: '8px' }} />
                Reporte de Ventas
              </span>
              {openDropdown === 'ventasa' && (
                <ul className="dropdown-menu">
                  <li onClick={() => { handleClick('ventas'); handleMenuClick('ventas'); }}>Ventas</li>
                  <li onClick={() => { handleClick('detalleventas'); handleMenuClick('detalleventas'); }}>Detalle de las ventas</li>
                  <li onClick={() => { handleClick('detallecitas'); handleMenuClick('detallecitas'); }}>Detalle citas</li>
                </ul>
              )}
            </li>

            <li onClick={() => handleMenuClick('roles')}>
              <TeamOutlined style={{ color: '#00B300', marginRight: '8px' }} />
              Roles
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
