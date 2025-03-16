import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Box, CircularProgress, Alert } from '@mui/material';

const VisionView = () => {
  const [vision, setVision] = useState(null); // Estado para almacenar la visión
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [error, setError] = useState(null); // Estado para manejar errores

  // Obtener la visión al montar el componente
  useEffect(() => {
    const obtenerVision = async () => {
      try {
        const response = await axios.get('https://backendcentro.onrender.com/api/visionA/vision');
        if (response.data.length > 0) {
          setVision(response.data[0]); // Tomar la primera visión (asumiendo que solo hay una)
        } else {
          setError('No se encontró ninguna visión.');
        }
      } catch (error) {
        console.error('Error al obtener la visión:', error);
        setError('Error al cargar la visión. Por favor, inténtelo de nuevo más tarde.');
      } finally {
        setLoading(false); // Finalizar la carga
      }
    };

    obtenerVision();
  }, []);

  // Mostrar un spinner mientras se carga la visión
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Mostrar un mensaje de error si ocurre un problema
  if (error) {
    return (
      <Container>
        <Box mt={4}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  // Mostrar la visión si se carga correctamente
  return (
    <Container>
      <Box mt={4} mb={4}>
        <Typography variant="h3" align="center" gutterBottom>
          Nuestra Visión
        </Typography>
        <Paper elevation={3} sx={{ padding: 4 }}>
          {vision ? (
            <>
              <Typography variant="h5" gutterBottom>
                {vision.titulo}
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                {vision.contenido}
              </Typography>
            </>
          ) : (
            <Typography variant="body1" align="center">
              No hay información disponible sobre la visión.
            </Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default VisionView;