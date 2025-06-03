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
  List,
  ListItem,
  ListItemText,
  Link,
  CircularProgress,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';

const MercadoPago = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  const { carrito = [], total = 0 } = location.state || {};
  const [expandedItems, setExpandedItems] = useState({});
  const [loading, setLoading] = useState(false);

  const toggleItemExpansion = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

const pagarConMercadoPago = async () => {
  try {
    setLoading(true);
    console.log('Carrito enviado:', carrito); // Depuración
    const response = await fetch('https://backendcentro.onrender.com/pagos/create_preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ carrito }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error del servidor:', errorData);
      throw new Error(errorData.error || 'Error en la respuesta del servidor');
    }

    const data = await response.json();
    console.log('Respuesta de Mercado Pago:', data); // Depuración

    if (data.sandbox_init_point) {
      window.location.href = data.sandbox_init_point;
    } else {
      alert('No se pudo generar la preferencia de pago');
    }
  } catch (error) {
    console.error('Error al procesar el pago:', error);
    alert(`Error al intentar pagar con Mercado Pago: ${error.message}`);
  } finally {
    setLoading(false);
  }
};


  const containerStyles = {
    maxWidth: isMobile ? '100%' : '650px',
    margin: 'auto',
    marginTop: '10mm',
    marginBottom: '10mm',
    padding: theme.spacing(3),
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
  };

  const mercadoPagoButtonStyles = {
    backgroundColor: '#009ee3',
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
      backgroundColor: '#0088cc',
    },
    '&:disabled': {
      backgroundColor: '#bdbdbd',
      color: '#fff',
    },
  };

  return (
    <Paper elevation={3} sx={containerStyles}>
      <Stack spacing={0}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" fontWeight="bold" color="primary">
            Pagar con Mercado Pago
          </Typography>
          <Box
            component="img"
            src="https://logospng.org/download/mercado-pago/logo-mercado-pago-256.png"
            alt="Mercado Pago Logo"
            sx={{ height: '80px' }}
          />
        </Box>

        <Divider />

        <Box>
          <Typography variant="body1" color="text.secondary">
            Monto del servicio:
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

          {carrito.length > 0 ? (
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary" fontWeight="medium">
                Detalles del pago:
              </Typography>
              <List dense>
                {carrito.map((item) => (
                  <ListItem key={item.id} disablePadding sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            sx={{
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: expandedItems[item.id] ? 'unset' : 2,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {item.nombre} (x{item.cantidad_carrito})
                          </Typography>
                        }
                        secondary={`Subtotal: $${(item.subtotal || item.precio_carrito * item.cantidad_carrito || 0).toFixed(2)
                          } MXN`}
                        primaryTypographyProps={{ component: 'div' }}
                        secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                      />
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" mt={2}>
              No hay ítems para mostrar.
            </Typography>
          )}
        </Box>

        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            sx={mercadoPagoButtonStyles}
            disabled={total === 0 || carrito.length === 0 || loading}
            onClick={pagarConMercadoPago}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Pagar'}
          </Button>
        </Box>

        <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
          <SecurityIcon fontSize="small" color="action" sx={{ mr: 1 }} />
          <Typography variant="caption" color="text.secondary">
            Su pago está protegido con Mercado Pago
          </Typography>
        </Box>

        <Box display="flex" justifyContent="center">
          <Box
            component="img"
            src="https://logospng.org/download/mercado-pago/logo-mercado-pago-256.png"
            alt="Mercado Pago Accepted"
            sx={{ height: '50px' }}
          />
        </Box>
      </Stack>
    </Paper>
  );
};

export default MercadoPago;
