import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import {
  Typography,
  Container,
  Box,
  CircularProgress,
  Paper,
} from '@mui/material';

const TerminosF = () => {
  const [termino, setTermino] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTerminos = async () => {
      try {
        const response = await fetch('https://backendcentro.onrender.com/api/terminos/ultimo');
        if (!response.ok) {
          throw new Error('Error al cargar los términos');
        }
        const data = await response.json();
        setTermino(data);
      } catch (err) {
        setError(err.message);
        message.error('Error al cargar los términos');
      } finally {
        setLoading(false);
      }
    };

    fetchTerminos();
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
            {termino.titulo}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#555', my: 2 }}>
            {termino.contenido}
          </Typography>

          {termino.secciones && termino.secciones.length > 0 ? (
            termino.secciones.map((section, index) => (
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

export default TerminosF;