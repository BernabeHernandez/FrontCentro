import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  CircularProgress,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';

const MercadoPago = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();

  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [expandedItems, setExpandedItems] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verifica si location.state existe
    if (!location.state || !Array.isArray(location.state.carrito)) {
      setError('No se recibió información del carrito. Regresa e intenta de nuevo.');
      console.error('location.state inválido:', location.state);
      return;
    }
    setCarrito(location.state.carrito);
    setTotal(location.state.total || 0);
  }, [location.state]);

  const toggleItemExpansion = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

const pagarConMercadoPago = async () => {
  try {
    setLoading(true);
    setError(null);

    // 🔍 Validación: precios y cantidades mayores a cero
    const carritoValido = carrito.every((item) => {
      const precio = Number(item.precio_carrito);
      const cantidad = Number(item.cantidad_carrito);
      return (
        !isNaN(precio) &&
        !isNaN(cantidad) &&
        precio > 0 &&
        cantidad > 0
      );
    });

    if (!carritoValido) {
      throw new Error("Uno o más productos tienen precio o cantidad inválida (deben ser mayores a 0).");
    }

    const response = await fetch('https://backendcentro.onrender.com/api/pagos/create_preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ carrito }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('Respuesta MP:', data);

    const checkoutUrl = data.init_point;
    if (!checkoutUrl) {
      throw new Error("No se recibió una URL válida para iniciar el pago.");
    }

    window.location.href = checkoutUrl;
  } catch (error) {
    console.error('Error en el pago:', error);
    setError(error.message || 'Ocurrió un error al procesar el pago.');
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
    '&:hover': { backgroundColor: '#0088cc' },
    '&:disabled': { backgroundColor: '#bdbdbd', color: '#fff' },
  };

  return (
    <Paper elevation={3} sx={containerStyles}>
      <Stack spacing={2}>
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

        {error && <Alert severity="error">{error}</Alert>}

        <Box>
          <Typography variant="body1" color="text.secondary">
            Monto del servicio:
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            ${total.toFixed(2)} MXN
          </Typography>

          {carrito.length > 0 ? (
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary" fontWeight="medium">
                Detalles del pago:
              </Typography>
              <List dense>
                {carrito.map((item, index) => (
                  <ListItem
                    key={item.id || index}
                    disablePadding
                    sx={{ flexDirection: 'column', alignItems: 'flex-start' }}
                  >
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
                        secondary={`Subtotal: $${(
                          item.subtotal ||
                          (item.precio_carrito ?? 0) * (item.cantidad_carrito ?? 0)
                        ).toFixed(2)} MXN`}
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
      </Stack>
    </Paper>
  );
};

export default MercadoPago;
