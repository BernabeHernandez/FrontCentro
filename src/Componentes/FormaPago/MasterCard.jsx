import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Stack,
  useMediaQuery,
  useTheme,
  Alert,
  TextField,
  InputAdornment,
  Grid,
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SecurityIcon from '@mui/icons-material/Security';
import visaLogo from '../Imagenes/Visa_Logo.png'; // Asumo que tienes estos assets
import masterCardLogo from '../Imagenes/Mastercard-logo.svg.png';

const MasterCard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  // Obtener total desde location.state
  const { total = 0 } = location.state || {};

  // Estado para los campos del formulario
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
  });

  // Estado para errores del formulario
  const [errors, setErrors] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
  });

  // Manejar cambios en los campos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));

    // Validaciones básicas
    let error = '';
    if (name === 'cardNumber') {
      const cleanValue = value.replace(/\D/g, '');
      if (cleanValue.length > 16) return;
      if (cleanValue.length < 16 && value.length > 0) error = 'El número debe tener 16 dígitos';
    }
    if (name === 'cardHolder' && value.length > 0 && !/^[a-zA-Z\s]*$/.test(value)) {
      error = 'Solo letras y espacios';
    }
    if (name === 'expiry') {
      const cleanValue = value.replace(/\D/g, '');
      if (cleanValue.length > 4) return;
      if (cleanValue.length < 4 && value.length > 0) error = 'Formato MMAA (ej. 1225)';
    }
    if (name === 'cvv') {
      const cleanValue = value.replace(/\D/g, '');
      if (cleanValue.length > 4) return;
      if (cleanValue.length < 3 && value.length > 0) error = 'El CVV debe tener 3 o 4 dígitos';
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Formatear número de tarjeta (XXXX XXXX XXXX XXXX)
  const formatCardNumber = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue
      .replace(/(\d{4})/g, '$1 ')
      .trim()
      .slice(0, 19);
  };

  // Formatear fecha de expiración (MM/AA)
  const formatExpiry = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length >= 3) {
      return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`;
    }
    return cleanValue;
  };

  // Estilos para el contenedor principal
  const containerStyles = {
    maxWidth: isMobile ? '100%' : '450px',
    margin: 'auto',
    marginTop: '10mm', // 1cm arriba
    marginBottom: '10mm', // 1cm abajo
    padding: theme.spacing(3),
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
  };

  // Estilo para el botón de pagar
  const payButtonStyles = {
    backgroundColor: '#1976d2', // Azul profesional
    color: '#fff',
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: '16px',
    padding: theme.spacing(1.5),
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
    height: '48px',
    '&:hover': {
      backgroundColor: '#1565c0',
    },
    '&:disabled': {
      backgroundColor: '#bdbdbd',
      color: '#fff',
    },
  };

  return (
    <Paper elevation={3} sx={containerStyles}>
      <Stack spacing={2}>
        {/* Encabezado */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" fontWeight="bold" color="primary">
            
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Box component="img" src={visaLogo} alt="Visa" sx={{ height: '20px' }} />
            <Box component="img" src={masterCardLogo} alt="MasterCard" sx={{ height: '20px' }} />
          </Box>
        </Box>

        <Divider />

        {/* Detalles del pago */}
        <Box>
          <Typography variant="body1" color="text.secondary">
            Total:
          </Typography>
          {total > 0 ? (
            <Typography variant="h6" fontWeight="bold">
              ${total.toFixed(2)} MXN
            </Typography>
          ) : (
            <Alert severity="warning">
              No se pudo cargar el monto. Por favor, regresa e intenta de nuevo.
            </Alert>
          )}
          <Typography variant="body2" color="text.secondary" mt={2}>
            Pago al Centro de Rehabilitación Integral San Juan
          </Typography>
        </Box>

        {/* Formulario de tarjeta */}
        <Box>
          <Typography variant="body1" fontWeight="medium" mb={2}>
            Detalles de la tarjeta
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Número de tarjeta"
                name="cardNumber"
                value={formatCardNumber(cardDetails.cardNumber)}
                onChange={handleInputChange}
                error={!!errors.cardNumber}
                helperText={errors.cardNumber}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CreditCardIcon color="action" />
                    </InputAdornment>
                  ),
                  inputProps: { maxLength: 19 },
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre del titular"
                name="cardHolder"
                value={cardDetails.cardHolder}
                onChange={handleInputChange}
                error={!!errors.cardHolder}
                helperText={errors.cardHolder}
                inputProps={{ maxLength: 50 }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Fecha de expiración (MM/AA)"
                name="expiry"
                value={formatExpiry(cardDetails.expiry)}
                onChange={handleInputChange}
                error={!!errors.expiry}
                helperText={errors.expiry}
                inputProps={{ maxLength: 5 }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="CVV"
                name="cvv"
                value={cardDetails.cvv}
                onChange={handleInputChange}
                error={!!errors.cvv}
                helperText={errors.cvv}
                inputProps={{ maxLength: 4 }}
                type="password"
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Botón de pagar centrado */}
        <Box display="flex" justifyContent="center">
          <Button
            sx={payButtonStyles}
            disabled={
              total === 0 ||
              !cardDetails.cardNumber ||
              !cardDetails.cardHolder ||
              !cardDetails.expiry ||
              !cardDetails.cvv ||
              Object.values(errors).some((error) => error)
            }
          >
            Pagar ahora
          </Button>
        </Box>

        {/* Nota de seguridad */}
        <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
          <SecurityIcon fontSize="small" color="action" sx={{ mr: 1 }} />
          <Typography variant="caption" color="text.secondary">
            Su pago está protegido
          </Typography>
        </Box>

        {/* Logos de tarjetas */}
        <Box display="flex" justifyContent="center" gap={2}>
          <Box component="img" src={visaLogo} alt="Visa" sx={{ height: '15px' }} />
          <Box component="img" src={masterCardLogo} alt="MasterCard" sx={{ height: '15px' }} />
        </Box>
      </Stack>
    </Paper>
  );
};

export default MasterCard;