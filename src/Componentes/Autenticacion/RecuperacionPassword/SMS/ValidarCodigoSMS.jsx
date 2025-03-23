import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';

const ValidarCodigoSMS = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { identificador } = location.state || {};
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleValidarCodigo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('https://backendcentro.onrender.com/api/recuperacionpreg/validar-codigo-sms', { identificador, codigo });
      if (response.data.success) {
        navigate('/cambiopasswordP', { state: { identificador } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al validar el código');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Validar Código SMS
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 3 }}>
        Ingresa el código que recibiste por SMS
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleValidarCodigo}>
        <TextField
          fullWidth
          label="Código de verificación"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 2, backgroundColor: '#00796b' }}>
          {loading ? <CircularProgress size={24} /> : 'Validar'}
        </Button>
      </Box>
    </Container>
  );
};

export default ValidarCodigoSMS;