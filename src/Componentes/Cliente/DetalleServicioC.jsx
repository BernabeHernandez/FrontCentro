import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BreadcrumbsServicios from '../Navegacion/BreadcrumbsServicios';

const DetallesServicioC = () => {
  const [servicio, setServicio] = useState(null);
  const [productosRelacionados, setProductosRelacionados] = useState([]);
  const [mostrarProductos, setMostrarProductos] = useState(3);  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServicio = async () => {
      try {
        const response = await fetch(`https://backendcentro.onrender.com/api/servicios/${id}`);
        if (!response.ok) {
          throw new Error('Error al obtener el servicio');
        }
        const data = await response.json();
        setServicio(data);

        const categoriaId = data.categoria_id; 
        const responseProductos = await fetch(`https://backendcentro.onrender.com/api/servicios?categoriaId=${categoriaId}`);
        const productosRelacionadosData = await responseProductos.json();
        setProductosRelacionados(productosRelacionadosData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchServicio();
  }, [id]);

  if (!servicio) {
    return <p>Cargando servicio...</p>;
  }

  const handlePagoClick = () => {
    navigate('/cliente/CitasCliente');
  };

  const manejarProductoRelacionadoClick = (idProducto) => {
    const productosRestantes = productosRelacionados.filter(prod => prod.id !== idProducto);
    setProductosRelacionados(productosRestantes);
    navigate(`/detalle/${idProducto}`);
  };

  const styles = {
    container: {
      padding: '1rem',
      maxWidth: '1100px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#fff',
      borderRadius: '8px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
    },
    leftColumn: {
      flex: 2,
      minWidth: '300px',
    },
    rightColumn: {
      flex: 1,
      minWidth: '250px',
      borderLeft: '1px solid #ddd',
      paddingLeft: '20px',
    },
    imagen: {
      width: '100%',
      height: '300px',
      objectFit: 'cover',
      borderRadius: '8px',
    },
    titulo: {
      fontSize: '22px',
      fontWeight: 'bold',
      margin: '16px 0',
      color: '#333',
      textAlign: 'start',
    },
    descripcion: {
      fontSize: '16px',
      color: '#555',
      marginBottom: '16px',
      lineHeight: '1.6',
    },
    precio: {
      fontSize: '20px',
      color: '#d32f2f',
      fontWeight: 'bold',
      marginBottom: '16px',
    },
    detalles: {
      fontSize: '16px',
      color: '#333',
      marginBottom: '16px',
    },
    boton: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '18px',
      transition: 'background-color 0.3s',
      textAlign: 'center',
      maxWidth: '150px',
    },
    botonHover: {
      backgroundColor: '#0056b3',
    },
    productosRelacionadosContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    productoRelacionado: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '12px',
      cursor: 'pointer',
      borderBottom: '1px solid #ddd',
      paddingBottom: '8px',
    },
    productoImagen: {
      width: '60px',
      height: '60px',
      marginRight: '10px',
      borderRadius: '8px',
      objectFit: 'contain',
    },
    flecha: {
      cursor: 'pointer',
      fontSize: '16px',
      color: '#007bff',
      marginTop: '10px',
      textAlign: 'center',
    },
  };

  const mostrarMasProductos = () => {
    setMostrarProductos(mostrarProductos + 3);
  };

  const mostrarMenosProductos = () => {
    setMostrarProductos(mostrarProductos - 3);
  };

  return (
    <div>
      <BreadcrumbsServicios />
      <div style={styles.container}>
        <div style={styles.leftColumn}>
          <img src={servicio.imagen} alt={servicio.nombre} style={styles.imagen} />
          <h1 style={styles.titulo}>{servicio.nombre}</h1>
          <p><strong>Descripción:</strong></p>
          <p style={styles.descripcion}>{servicio.descripcion}</p>
          <p style={styles.precio}>Precio: ${servicio.precio}</p>
          <div style={styles.detalles}>
            <p>Categoría: {servicio.categoria_nombre}</p>
          </div>
          <button
            style={styles.boton}
            onMouseOver={(e) => e.target.style.backgroundColor = styles.botonHover.backgroundColor}
            onMouseOut={(e) => e.target.style.backgroundColor = styles.boton.backgroundColor}
            onClick={handlePagoClick}
          >
            Sacar cita
          </button>
        </div>

        <div style={styles.rightColumn}>
          <h2>Servicios Relacionados</h2>
          <div style={styles.productosRelacionadosContainer}>
            {productosRelacionados.slice(0, mostrarProductos).map((prod) => (
              <div key={prod.id} style={styles.productoRelacionado} onClick={() => manejarProductoRelacionadoClick(prod.id)}>
                <img src={prod.imagen} alt={prod.nombre} style={styles.productoImagen} />
                <p>{prod.nombre}</p>
              </div>
            ))}
          </div>
          {mostrarProductos < productosRelacionados.length && (
            <span style={styles.flecha} onClick={mostrarMasProductos}>➡️ Mostrar más</span>
          )}
          {mostrarProductos > 3 && (
            <span style={styles.flecha} onClick={mostrarMenosProductos}>⬅️ Mostrar menos</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetallesServicioC;
