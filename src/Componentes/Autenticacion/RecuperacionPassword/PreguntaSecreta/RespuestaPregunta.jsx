import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const RespuestaPregunta = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { identificador } = location.state || {};
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!identificador) {
      navigate('/restaurar/verificacion');
      return;
    }
    const obtenerPregunta = async () => {
      try {
        const response = await axios.post('https://backendcentro.onrender.com/api/recuperacionpreg/obtener-pregunta', { identificador });
        setPregunta(response.data.pregunta);
      } catch (err) {
        setError('Error al obtener la pregunta');
      }
    };
    obtenerPregunta();
  }, [identificador, navigate]);

  const handleVerificarRespuesta = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('https://backendcentro.onrender.com/api/recuperacionpreg/verificar-respuesta', {
        identificador,
        respuesta
      });
      if (response.data.success) {
        navigate('/cambiopasswordP', { state: { identificador } });
      }
    } catch (err) {
      setError('Respuesta incorrecta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Respuesta a Pregunta Secreta
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {pregunta ? (
        <>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Pregunta: {pregunta}
          </Typography>
          <Box component="form" onSubmit={handleVerificarRespuesta}>
            <TextField
              fullWidth
              label="Tu respuesta"
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ mt: 2, backgroundColor: '#00796b' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Verificar'}
            </Button>
          </Box>
        </>
      ) : (
        <CircularProgress />
      )}
    </Container>
  );
};

export default RespuestaPregunta;