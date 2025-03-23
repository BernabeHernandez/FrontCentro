import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';

const VerificacionUsuarioSMS = () => {
  const navigate = useNavigate();
  const [identificador, setIdentificador] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerificacion = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('https://backendcentro.onrender.com/api/recuperacionpreg/iniciar-recuperacion-sms', { identificador });
      if (response.data.success) {
        navigate('/validarcodigoSMS', { state: { identificador } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Verificación por SMS
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 3 }}>
        Ingresa tu correo o usuario para recibir un código por SMS
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
        <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 2, backgroundColor: '#00796b' }}>
          {loading ? <CircularProgress size={24} /> : 'Enviar Código'}
        </Button>
      </Box>
    </Container>
  );
};

export default VerificacionUsuarioSMS;