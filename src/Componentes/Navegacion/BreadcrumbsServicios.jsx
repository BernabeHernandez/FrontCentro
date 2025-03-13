import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

const BreadcrumbsServicios = () => {
  const location = useLocation();
  const { id } = useParams(); 
  const paths = location.pathname.split('/').filter(path => path);

  let breadcrumbPaths = paths.map((path, index) => {
    let label = path.charAt(0).toUpperCase() + path.slice(1);

    if (path === 'servicios') {
      label = 'Servicios';
    }
    else if (path === 'detalle') {
      label = `Detalle del Servicio ${id || ''}`; 
    }
    else if (path === 'opcionpagos' || path === 'opcionpago') {
      label = 'Forma de Pago';
    }

    const url = '/' + paths.slice(0, index + 1).join('/');
    return { url, label };
  });

  if (breadcrumbPaths[0]?.url !== '/' && location.pathname !== '/') {
    breadcrumbPaths.unshift({ url: '/', label: 'Inicio' });
  }

  if (location.pathname.includes('/detalle') && !location.pathname.includes('/opcionpago')) {
    breadcrumbPaths = [
      { url: '/', label: 'Inicio' },
      { url: '/servicios', label: 'Servicios' },
      { url: `/detalle/${id}`, label: `Detalle del Servicio` },
    ];
  }

  if (location.pathname.includes('/opcionpagos') || location.pathname.includes('/opcionpago')) {
    breadcrumbPaths = [
      { url: '/', label: 'Inicio' },
      { url: '/servicios', label: 'Servicios' },
      { url: `/detalle/${id}`, label: `Detalle del Servicio` },
      { url: `/detalle/${id}/opcionpagos`, label: 'Forma de Pago' }, 
    ];
  }

  return (
    <nav>
      <ul style={{
        listStyle: 'none', 
        display: 'flex', 
        padding: 0, 
        margin: 0,
        alignItems: 'center', 
        flexWrap: 'wrap', 
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
      }}>
        {breadcrumbPaths.map((path, index) => (
          <li key={index} style={{ margin: 0 }}>
            {index === breadcrumbPaths.length - 1 ? (
              <span style={{ color: '#888', fontWeight: 'bold' }}>{path.label}</span> 
            ) : (
              <Link to={path.url} style={{ color: '#28a745', textDecoration: 'none', fontWeight: 'bold' }}>{path.label}</Link> 
            )}
            {index < breadcrumbPaths.length - 1 && (
              <span style={{ color: '#28a745', fontWeight: 'bold' }}> &gt; </span> 
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BreadcrumbsServicios;
