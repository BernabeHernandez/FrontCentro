import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import {
  Typography,
  Container,
  Box,
  CircularProgress,
  Paper,
} from '@mui/material';

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
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
          <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ color: '#333', borderBottom: '2px solid #007bff', pb: 2 }}>
            {politica.titulo}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#555', my: 2 }}>
            {politica.contenido}
          </Typography>

          {politica.secciones && politica.secciones.length > 0 ? (
            politica.secciones.map((section, index) => (
              <Box key={index} sx={{ mt: 4 }}>
                <Typography variant="h5" component="h3" sx={{ color: '#007bff', mb: 2 }}>
                  {section.titulo}
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: '1.4', color: '#555' }}>
                  {section.contenido}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body1" align="center" sx={{ fontSize: '1.2rem', color: '#007bff', mt: 4 }}>
              No hay secciones disponibles.
            </Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default PoliticasF;