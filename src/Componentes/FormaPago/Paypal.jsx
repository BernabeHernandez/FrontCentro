import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Stack,
  useMediaQuery,
  useTheme,
  Alert,
  List,
  ListItem,
  ListItemText,
  Link,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import Swal from 'sweetalert2';

const Paypal = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  const { carrito = [], total = 0 } = location.state || {};

  const [expandedItems, setExpandedItems] = useState({});
  const paypalButtonRef = useRef(null); // To store the PayPal button instance

  const toggleItemExpansion = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
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

  useEffect(() => {
    if (window.paypal && total > 0 && carrito.length > 0) {
      // Clear the container to prevent duplicate buttons
      const container = document.getElementById('paypal-button-container');
      if (container) {
        container.innerHTML = ''; // Clear any existing buttons
      }

      // Destroy the previous PayPal button instance if it exists
      if (paypalButtonRef.current) {
        paypalButtonRef.current.close();
        paypalButtonRef.current = null;
      }

      // Create and render the PayPal button
      const button = window.paypal.Buttons({
        style: {
          color: 'gold',
          shape: 'pill',
          label: 'paypal',
          layout: 'horizontal',
        },
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: total.toFixed(2),
                currency_code: 'MXN',
              },
              description: 'Pago en Centro de Rehabilitación Integral',
            }],
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            Swal.fire({
              title: 'Pago Completado',
              text: `Pago completado por ${details.payer.name.given_name}`,
              icon: 'success',
              confirmButtonText: 'OK',
            });
          });
        },
        onError: (err) => {
          console.error('Error en el pago con PayPal:', err);
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al procesar el pago.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        },
      });

      // Store the button instance
      paypalButtonRef.current = button;

      // Render the button
      button.render('#paypal-button-container');
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (paypalButtonRef.current) {
        paypalButtonRef.current.close();
        paypalButtonRef.current = null;
      }
      const container = document.getElementById('paypal-button-container');
      if (container) {
        container.innerHTML = ''; // Clear the container on cleanup
      }
    };
  }, [total, carrito]);

  return (
    <Paper elevation={3} sx={containerStyles}>
      <Stack spacing={1}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" fontWeight="bold" color="primary">
            Pagar con PayPal
          </Typography>
          <Box
            component="img"
            src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
            alt="PayPal Logo"
            sx={{ height: '40px' }}
          />
        </Box>

        <Divider />

        <Box>
          <Typography variant="body1" color="text.secondary">Total:</Typography>
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
                        secondary={`Subtotal: $${(
                          item.subtotal || item.precio_carrito * item.cantidad_carrito || 0
                        ).toFixed(2)} MXN`}
                        primaryTypographyProps={{ component: 'div' }}
                        secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                      />
                    </Box>
                    {item.nombre.length > 50 && (
                      <Link
                        component="button"
                        variant="caption"
                        onClick={() => toggleItemExpansion(item.id)}
                        sx={{ mt: 0.5, color: theme.palette.primary.main }}
                      >
                        {expandedItems[item.id] ? 'Ver menos' : 'Ver más'}
                      </Link>
                    )}
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

        {/* Contenedor del botón de PayPal */}
        <Box display="flex" justifyContent="center" mt={2}>
          <div id="paypal-button-container" style={{ width: isMobile ? '100%' : '300px' }} />
        </Box>

        <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
          <SecurityIcon fontSize="small" color="action" sx={{ mr: 1 }} />
          <Typography variant="caption" color="text.secondary">
            Su pago está protegido con PayPal
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default Paypal;