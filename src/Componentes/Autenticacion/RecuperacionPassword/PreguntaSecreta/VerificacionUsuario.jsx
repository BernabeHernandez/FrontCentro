import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const VerificacionUsuario = () => {
  const navigate = useNavigate();
  const [identificador, setIdentificador] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerificacion = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('https://backendcentro.onrender.com/api/recuperacionpreg/verificar-usuario', { identificador });
      if (response.data.success) {
        navigate('/respuestaPregunta', { state: { identificador } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Usuario o correo no encontrado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Verificación de Usuario
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 3 }}>
        Ingresa tu correo electrónico o nombre de usuario
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleVerificacion}>
        <TextField
          fullWidth
          label="Correo o Usuario"
          value={identificador}
          onChange={(e) => setIdentificador(e.target.value)}
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
    </Container>
  );
};

export default VerificacionUsuario;