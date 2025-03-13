import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResultadosBusqueda = () => {
  const [resultados, setResultados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('https://backendcentro.onrender.com/api/buscar/categorias');
        setCategorias(response.data);
      } catch (err) {
        setError('Error al cargar las categorías.');
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    if (query) {
      setCategoriaSeleccionada(''); 
      fetchResultados(); 
    } else {
      setResultados([]); 
    }
  }, [query]);

  const fetchResultados = async () => {
    try {
      setLoading(true);
      let url = `https://backendcentro.onrender.com/api/buscar/search?query=${encodeURIComponent(query)}`;
      
      if (categoriaSeleccionada) {
        url += `&id_categoria=${categoriaSeleccionada}`;
      }

      const response = await axios.get(url);
      setResultados(response.data);
    } catch (err) {
      setError('Error al cargar los resultados de búsqueda.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      fetchResultados();
    }
  }, [categoriaSeleccionada]);

  const handleCardClick = (tipo, id) => {
    if (tipo === 'producto') {
      navigate(`/detalles/${id}`); 
    } else {
      navigate(`/detalle/${id}`);
    }
  };

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
      padding: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#fff',
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer',
      alignItems: 'center',
      transition: 'transform 0.2s ease-in-out',
      maxHeight: '400px', // Aumentado para que haya más espacio
      overflow: 'hidden',
    },
    imagen: {
      width: '100%', // Imagen toma el 100% del ancho de la tarjeta
      height: '200px', // Limitar la altura para mantener consistencia
      objectFit: 'contain', // Ajuste para que la imagen se vea bien sin recorte
      borderRadius: '4px',
      marginBottom: '8px',
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
    resultadosHeader: {
      textAlign: 'center',
      marginBottom: '20px',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#333',
    },
    filtroContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: '20px',
      alignItems: 'center',
      backgroundColor: '#f4f4f4',
      padding: '10px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    filtroSelect: {
      padding: '12px 20px',
      fontSize: '1rem',
      borderRadius: '8px',
      border: '1px solid #ddd',
      backgroundColor: '#fff',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'border 0.3s ease, box-shadow 0.3s ease',
    },
  };

  if (loading) return <p>Cargando resultados...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 style={styles.resultadosHeader}>Resultados para "{query}"</h2>

      <div style={styles.filtroContainer}>
        <label htmlFor="categoria" style={{ marginRight: '10px', fontWeight: 'bold' }}>Buscar por Categorías:</label>
        <select
          id="categoria"
          style={styles.filtroSelect}
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.container}>
        {resultados.length > 0 ? (
          resultados.map((item) => (
            <div
              key={`${item.tipo}-${item.id}`}
              style={styles.card}
              onClick={() => handleCardClick(item.tipo, item.id)}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {item.imagen && <img src={item.imagen} alt={item.nombre} style={styles.imagen} />}
              <div style={styles.titulo}>{item.nombre}</div>
              <div style={styles.precioActual}>${item.precio}</div>
            </div>
          ))
        ) : (
          <p>No se encontraron resultados para "{query}" con la categoría seleccionada.</p>
        )}
      </div>
    </div>
  );
};

export default ResultadosBusqueda;
