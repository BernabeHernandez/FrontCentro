import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Box, CircularProgress, Alert } from '@mui/material';

const MisionView = () => {
  const [mision, setMision] = useState(null); // Estado para almacenar la misión
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [error, setError] = useState(null); // Estado para manejar errores

  // Obtener la misión al montar el componente
  useEffect(() => {
    const obtenerMision = async () => {
      try {
        const response = await axios.get('https://backendcentro.onrender.com/api/misionA/mision');
        if (response.data.length > 0) {
          setMision(response.data[0]); // Tomar la primera misión (asumiendo que solo hay una)
        } else {
          setError('No se encontró ninguna misión.');
        }
      } catch (error) {
        console.error('Error al obtener la misión:', error);
        setError('Error al cargar la misión. Por favor, inténtelo de nuevo más tarde.');
      } finally {
        setLoading(false); // Finalizar la carga
      }
    };

    obtenerMision();
  }, []);

  // Mostrar un spinner mientras se carga la misión
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

  // Mostrar la misión si se carga correctamente
  return (
    <Container>
      <Box mt={4} mb={4}>
        <Typography variant="h3" align="center" gutterBottom>
          Nuestra Misión
        </Typography>
        <Paper elevation={3} sx={{ padding: 4 }}>
          {mision ? (
            <>
              <Typography variant="h5" gutterBottom>
                {mision.titulo}
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                {mision.contenido}
              </Typography>
            </>
          ) : (
            <Typography variant="body1" align="center">
              No hay información disponible sobre la misión.
            </Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default MisionView;