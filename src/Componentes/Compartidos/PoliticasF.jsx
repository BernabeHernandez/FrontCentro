import React, { useEffect, useState } from 'react';
import { message } from 'antd'; 

const PoliticasF = () => {
  const [politica, setPolitica] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPoliticas = async () => {
      try {
        const response = await fetch('https://backendcentro.onrender.com/api/politica/ultimo');
        if (!response.ok) {
          throw new Error('Error al cargar las políticas');
        }
        const data = await response.json();
        setPolitica(data);
      } catch (err) {
        setError(err.message);
        message.error('Error al cargar las políticas');
      } finally {
        setLoading(false);
      }
    };

    fetchPoliticas();
  }, []);

  if (loading) {
    return <div style={styles.loadingMessage}>Cargando políticas...</div>;
  }

  if (error) {
    return <div style={styles.errorMessage}>Error: {error}</div>;
  }

  return (
    <div style={styles.politicasContainer}>
      <h2 style={styles.politicasTitle}>{politica.titulo}</h2>
      <p style={styles.politicasContent}>{politica.contenido}</p>
      
      {politica.secciones && politica.secciones.length > 0 ? (
        politica.secciones.map((section, index) => (
          <div key={index} style={styles.section}>
            <h3 style={styles.sectionTitle}>{section.titulo}</h3>
            <p style={styles.sectionContent}>{section.contenido}</p>
          </div>
        ))
      ) : (
        <p style={styles.noDataMessage}>No hay secciones disponibles.</p>
      )}
    </div>
  );
};


const styles = {
  politicasContainer: {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden', 
  },
  politicasTitle: {
    fontSize: '2rem',
    color: '#333',
    textAlign: 'center',
    marginBottom: '20px',
    borderBottom: '2px solid #007bff',
    paddingBottom: '10px',
  },
  politicasContent: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: '#555',
    margin: '15px 0',
    wordWrap: 'break-word', 
  },
  section: {
    marginTop: '20px',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#007bff',
    margin: '10px 0',
  },
  sectionContent: {
    fontSize: '1.1rem',
    lineHeight: '1.4',
    color: '#555',
    wordWrap: 'break-word',
  },
  loadingMessage: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#007bff',
  },
  errorMessage: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#ff4d4f',
  },
  noDataMessage: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#007bff',
  },
};

export default PoliticasF;
