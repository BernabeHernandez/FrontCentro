import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const { id } = useParams(); 
  const paths = location.pathname.split('/').filter(path => path);

  let breadcrumbPaths = paths.map((path, index) => {
    let label = path.charAt(0).toUpperCase() + path.slice(1);

    if (path === 'productos') {
      label = 'Productos';
    } else if (path === 'detalles' || path === 'detalle') {
      label = 'Detalle del Producto'; 
    } else if (path === 'opcionpago') {
      label = 'Forma de Pago';
    }

    const url = '/' + paths.slice(0, index + 1).join('/');
    return { url, label };
  });

  if (breadcrumbPaths[0]?.url !== '/' && location.pathname !== '/') {
    breadcrumbPaths.unshift({ url: '/', label: 'Inicio' });
  }

  if (location.pathname.includes('/detalles') && location.pathname.includes('/opcionpago')) {
    breadcrumbPaths = [
      { url: '/', label: 'Inicio' },
      { url: '/productos', label: 'Productos' },
      { url: `/detalles/${id}`, label: 'Detalle del Producto' }, 
      { url: `/detalles/${id}/opcionpago`, label: 'Forma de Pago' },
    ];
  }

  if (location.pathname.includes('/detalles') && !location.pathname.includes('/opcionpago')) {
    breadcrumbPaths = [
      { url: '/', label: 'Inicio' },
      { url: '/productos', label: 'Productos' },
      { url: `/detalles/${id}`, label: 'Detalle del Producto' },
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

export default Breadcrumbs;
