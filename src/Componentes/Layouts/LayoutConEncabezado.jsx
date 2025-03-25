import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import EncabezadoPublico from '../Compartidos/EncabezadoPublico';
import EncabezadoAdministrativo from '../Compartidos/EncabezadoAdministrativo';
import EncabezadoCliente from '../Compartidos/EncabezadoCliente';
import PieDePaginaCliente from '../Compartidos/PieDePaginaCliente';
import PieDePaginaAdmin from '../Compartidos/PieDePaginaAdmin';
import PieDePagina from '../Compartidos/PieDePagina';
import { useTheme } from '../Temas/ThemeContext';
import { useAuth } from '../Autenticacion/AuthContext';
import { Box } from '@mui/material';

const LayoutConEncabezado = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { theme } = useTheme();

  let encabezado;
  let pieDePagina;

  if (location.pathname.startsWith('/admin')) {
    if (!user || user.tipo !== 'Administrador') {
      return <Navigate to="/login" replace />;
    }
    encabezado = <EncabezadoAdministrativo />;
    pieDePagina = <PieDePaginaAdmin />;
  } else if (location.pathname.startsWith('/cliente')) {
    if (!user || user.tipo !== 'Cliente') {
      return <Navigate to="/login" replace />;
    }
    encabezado = <EncabezadoCliente />;
    pieDePagina = <PieDePaginaCliente />;
  } else {
    encabezado = <EncabezadoPublico />;
    pieDePagina = <PieDePagina />;
  }

  // Para la sección administrativa, usamos un layout con barra lateral
  if (location.pathname.startsWith('/admin')) {
    return (
      <Box
        className={`layout-container ${theme}`}
        sx={{
          display: 'flex',
          flexDirection: 'column', // Mantenemos column en el nivel superior
          minHeight: '100vh',
          width: '100%',
          position: 'relative', // Para que la barra lateral se posicione correctamente
        }}
      >
        {/* Encabezado (Barra lateral para admin) */}
        {encabezado}

        {/* Contenido principal y pie de página */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            ml: { xs: 0, md: '250px' }, // Espacio para la barra lateral en desktop
            mt: { xs: 8, md: 0 }, // Espacio para el AppBar en móvil
          }}
        >
          <Box
            component="main"
            className="content"
            sx={{
              flexGrow: 1,
              backgroundColor: theme === 'dark' ? '#1d1d1d' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#000000',
              p: 3,
              overflowY: 'auto', // Permitir scroll en el contenido
            }}
          >
            {children}
          </Box>
          <Box
            component="footer"
            sx={{
              width: '100%',
              minHeight: 'var(--min-header-footer-height)',
              backgroundColor: theme === 'dark' ? '#d45d00' : '#d45d00',
              flexShrink: 0, // Evitar que el footer se encoja
            }}
          >
            {pieDePagina}
          </Box>
        </Box>

        <style>{`
          :root {
            --min-header-footer-height: 60px;
          }

          body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
          }
        `}</style>
      </Box>
    );
  }

  // Para las secciones de cliente y público, mantenemos el diseño original
  return (
    <div className={`layout-container ${theme}`}>
      <header>{encabezado}</header>
      <main className="content">{children}</main>
      <footer>{pieDePagina}</footer>

      <style>{`
        :root {
          --min-header-footer-height: 60px;
        }

        body, html {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
        }

        .layout-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .content {
          flex-grow: 1;
          backgroundColor: ${theme === 'dark' ? '#1d1d1d' : '#ffffff'};
          color: ${theme === 'dark' ? '#ffffff' : '#000000'};
        }

        header, footer {
          width: 100%;
          min-height: var(--min-header-footer-height);
          box-sizing: border-box;
          background-color: ${theme === 'dark' ? '#333' : '#FFA500'};
        }

        footer {
          background-color: ${theme === 'dark' ? '#d45d00' : '#d45d00'};
        }
      `}</style>
    </div>
  );
};

export default LayoutConEncabezado;