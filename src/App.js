import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LayoutConEncabezado from './Componentes/Layouts/LayoutConEncabezado';
import PaginaPrincipal from './Paginas/PaginaPrincipal';
import PaginaPrincipalAdministrativa from './Paginas/PaginaPrincipalAdministrativa';
import PaginaPrincipalCliente from './Paginas/PaginaPrincipalCliente';
import Login from './Componentes/Autenticacion/Login';
import Registro from './Componentes/Autenticacion/Registro';
import Politicas from './Componentes/Administrativo/Politicas';
import Terminos from './Componentes/Administrativo/Terminos';
import Perfil from './Componentes/Administrativo/Perfil';
import Deslinde from './Componentes/Administrativo/Deslinde';
import { ThemeProvider, useTheme } from './Componentes/Temas/ThemeContext'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import ValidarCodigo from './Componentes/Autenticacion/ValidarCodigo';
import CambiarPassword from './Componentes/Autenticacion/CambiarPassword';
import SolicitarCodigo from './Componentes/Autenticacion/SolicitarCodigo';
import VerificarCorreo from './Componentes/Autenticacion/VerificarCorreo';

const ThemeToggleButton = () => {
  const { toggleTheme, theme } = useTheme();
  
  return (
    <button 
      onClick={toggleTheme} 
      style={{ 
        marginLeft: 'auto', 
        background: 'none', 
        border: 'none', 
        cursor: 'pointer', 
        padding: '10px',
        fontSize: '1.2rem', 
        verticalAlign: 'middle', 
        lineHeight: '1.5', 
        display: 'flex', 
        alignItems: 'center', 
      }}
      aria-label="Toggle theme"
    >
      <FontAwesomeIcon 
        icon={theme === 'dark' ? faSun : faMoon} 
        style={{ color: theme === 'dark' ? 'yellow' : 'black' }}
      />
      <style>{`
        /* Estilos responsivos */
        @media (max-width: 768px) {
          button {
            font-size: 1.3rem; /* Tamaño más pequeño para pantallas móviles */
          }
        }

        @media (max-width: 480px) {
          button {
            font-size: 1.1rem; /* Tamaño aún más pequeño para pantallas muy pequeñas */
          }
        }
      `}</style>
    </button>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <LayoutConEncabezado>
        <ThemeToggleButton />
        <Routes>
          <Route path="/" element={<PaginaPrincipal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/admin" element={<PaginaPrincipalAdministrativa />} />
          <Route path="/cliente" element={<PaginaPrincipalCliente />} />
          <Route path="/admin/politicas" element={<Politicas />} />
          <Route path="/admin/terminos" element={<Terminos />} />
          <Route path="/admin/perfil" element={<Perfil />} />
          <Route path="/admin/deslinde" element={<Deslinde />} />
          <Route path="/verificar_correo" element={<SolicitarCodigo />} />
          <Route path="/validar_codigo" element={<ValidarCodigo />} />
          <Route path="/cambiar_password" element={<CambiarPassword />} />
          <Route path="/verificar-correo" element={<VerificarCorreo />} />
        </Routes>
      </LayoutConEncabezado>
    </ThemeProvider>
  );
};

export default App;
