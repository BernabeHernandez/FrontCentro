import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Breadcrumbs from '../Navegacion/BreadcrumbsServicios';

const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await fetch('https://backendcentro.onrender.com/api/servicios'); 
        if (!response.ok) {
          throw new Error('Error al obtener los servicios');
        }
        const data = await response.json();
        setServicios(data);
      } catch (error) {
        console.error('Error:', error);
        navigate('/error500');
      }
    };

    fetchServicios();
  }, []);

  const styles = {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',  // Responsividad
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
      transition: 'transform 0.2s ease-in-out',  // Efecto hover
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
      objectFit: 'contain',  // Evita recorte de imagen
    },
    titulo: {
      fontSize: '14px',
      fontWeight: 'bold',
      margin: '8px 0',
      lineHeight: '1.2',
      height: '50px', 
      overflow: 'hidden', 
      textOverflow: 'ellipsis',
      textAlign: 'center',  // Alineación centrada
    },
    precioActual: {
      color: '#d32f2f',
      fontSize: '16px',
      fontWeight: 'bold',
      marginTop: '8px',
      textAlign: 'center',
    },
    cardHover: {
      transform: 'scale(1.05)',  // Efecto hover
    },
  };

  const handleServicioClick = (id) => {
    navigate(`/detalle/${id}`); 
  };

  return (
    <div>
      <Breadcrumbs /> 

      <div style={styles.container}>
        {servicios.map((servicio) => (
          <div
            key={servicio.id}
            style={styles.card}
            onClick={() => handleServicioClick(servicio.id)}
            onMouseOver={(e) => e.currentTarget.style.transform = styles.cardHover.transform}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={styles.imagenContainer}>
              <img src={servicio.imagen} alt={servicio.nombre} style={styles.imagen} />
            </div>
            <div style={styles.titulo}>{servicio.nombre}</div>
            <div style={styles.precioActual}>${servicio.precio}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Servicios;
