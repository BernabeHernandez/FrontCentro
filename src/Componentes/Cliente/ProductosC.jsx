import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Breadcrumbs from '../Navegacion/BreadcrumbsProductos';

const ProductosC = () => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('https://backendcentro.onrender.com/api/productos'); 
        if (!response.ok) {
          throw new Error('Error al obtener los productos');
        }
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error('Error:', error);
        navigate('/cliente/error500');
      }
    };
    fetchProductos();
  }, []);

  const styles = {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      padding: '2rem',
      justifyContent: 'center',
    },
    card: {
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#fff',
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer',
      alignItems: 'center',
      transition: 'transform 0.2s ease-in-out',
    },
    imagenContainer: {
      width: '100%',
      height: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9f9f9',
      borderRadius: '4px',
    },
    imagen: {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain', 
    },
    titulo: {
      fontSize: '14px',
      fontWeight: 'bold',
      margin: '8px 0',
      lineHeight: '1.2',
      height: '50px', 
      overflow: 'hidden', 
      textOverflow: 'ellipsis',
      textAlign: 'center',
    },
    precioActual: {
      color: '#d32f2f',
      fontSize: '16px',
      fontWeight: 'bold',
      marginTop: '8px',
    },
    cardHover: {
      transform: 'scale(1.05)',
    },
  };

  const handleProductoClick = (id) => {
    navigate(`/cliente/detalles/${id}`); 
  };

  return (
    <div>
      <Breadcrumbs /> 
      <div style={styles.container}>
        {productos.map((producto) => (
          <div
            key={producto.id}
            style={styles.card}
            onClick={() => handleProductoClick(producto.id)}
            onMouseOver={(e) => e.currentTarget.style.transform = styles.cardHover.transform}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={styles.imagenContainer}>
              <img src={producto.imagen} alt={producto.nombre} style={styles.imagen} />
            </div>
            <div style={styles.titulo}>{producto.nombre}</div>
            <div style={styles.precioActual}>${producto.precio}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductosC;
