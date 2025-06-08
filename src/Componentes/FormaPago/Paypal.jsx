import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  CircularProgress,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import Swal from 'sweetalert2';
import axios from 'axios';

const Paypal = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();

  const { carrito = [], total = 0 } = location.state || {};
  const [expandedItems, setExpandedItems] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const paypalButtonRef = useRef(null);

  const toggleItemExpansion = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handlePostPaymentOperations = async (paymentDetails) => {
    try {
      // Obtener el carrito desde localStorage
      const carritoRaw = localStorage.getItem('carrito');
      let carritoProcesar = JSON.parse(carritoRaw) || [];
      
      // Si no hay carrito en localStorage, intentar recuperarlo del backend
      if (!carritoProcesar.length) {
        const id_usuario = localStorage.getItem('usuario_id');
        if (!id_usuario) {
          throw new Error('No se encontró el ID del usuario. Por favor, inicia sesión nuevamente.');
        }

        const responseCarrito = await axios.get(`https://backendcentro.onrender.com/carrito/${id_usuario}`);
        carritoProcesar = responseCarrito.data;
        localStorage.setItem('carrito', JSON.stringify(carritoProcesar));
      }

      // Validar el carrito
      const carritoValido = carritoProcesar.every(item => item.id && item.cantidad_carrito > 0);
      if (!carritoValido) {
        throw new Error('El carrito contiene datos inválidos (falta id o cantidad_carrito).');
      }

      // Preparar datos para reducir inventario
      const productos = carritoProcesar.map(item => ({
        id: item.id,
        cantidad: item.cantidad_carrito,
      }));

      // Llamar a la ruta para reducir inventario
      const response = await axios.put('https://backendcentro.onrender.com/api/carrito/carrito/reducir-inventario', {
        productos,
      });

      // Mostrar mensaje de éxito
      Swal.fire({
        title: '¡Compra exitosa!',
        text: `Pago completado por ${paymentDetails.payer.name.given_name}. ${response.data.message}`,
        icon: 'success',
        confirmButtonText: 'Ir al carrito',
        allowOutsideClick: false,
      }).then(() => {
        localStorage.removeItem('carrito');
        navigate('/carrito');
      });
    } catch (error) {
      console.error('Error en operaciones post-pago:', error);
      Swal.fire({
        title: 'Advertencia',
        text: 'El pago se completó pero hubo un problema al actualizar el inventario. Por favor contacta al soporte.',
        icon: 'warning',
        confirmButtonText: 'Entendido'
      });
    }
  };

  const checkPopupBlocked = () => {
    const popup = window.open('', '_blank');
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      setError('Las ventanas emergentes están bloqueadas. Por favor, permite ventanas emergentes para este sitio.');
      return false;
    }
    popup.close();
    return true;
  };

  useEffect(() => {
    // Verificar si el carrito y el total son válidos
    if (!Array.isArray(carrito)) {
      setError('No se recibió información del carrito. Regresa e intenta de nuevo.');
      return;
    }

    // Guardar el carrito en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Verificar si el SDK de PayPal está cargado
    if (!window.paypal) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=Abr47HRyGorI1kKWNP_0LtDnm-fobtGYNCCcSkzl5p3176ruG0JwOYk8pWAe-IJWR2vYbGz8qzuBOCYg&currency=MXN&intent=capture&components=buttons`;
      script.async = true;
      
      script.onload = () => initializePayPalButton();
      script.onerror = () => setError('Error al cargar PayPal. Recarga la página.');
      
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    } else {
      initializePayPalButton();
    }

    function initializePayPalButton() {
      const container = document.getElementById('paypal-button-container');
      if (!container || total <= 0 || carrito.length === 0) return;

      container.innerHTML = '';
      
      if (paypalButtonRef.current) {
        paypalButtonRef.current.close();
        paypalButtonRef.current = null;
      }

      const button = window.paypal.Buttons({
        style: {
          color: 'gold',
          shape: 'pill',
          label: 'paypal',
          layout: isMobile ? 'vertical' : 'horizontal',
        },
        createOrder: (data, actions) => {
          const customId = localStorage.getItem('usuario_id') || 'unknown';
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: total.toFixed(2),
                currency_code: 'MXN',
              },
              description: 'Pago en Centro de Rehabilitación Integral',
              custom_id: customId,
            }],
          });
        },
        onApprove: async (data, actions) => {
          try {
            setLoading(true);
            setError(null);
            
            const details = await actions.order.capture();
            
            // Mostrar confirmación inmediata
            Swal.fire({
              title: '¡Pago exitoso!',
              text: `Gracias por tu pago ${details.payer.name.given_name}. Procesando tu compra...`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            
            // Manejar operaciones post-pago sin bloquear
            handlePostPaymentOperations(details);
            
          } catch (error) {
            console.error('Error al procesar el pago:', error);
            setError(error.message.includes('Window closed') ? 
              'No cierres la ventana de PayPal durante el pago' : 
              'Error al procesar el pago');
          } finally {
            setLoading(false);
          }
        },
        onCancel: () => {
          setError('Pago cancelado por el usuario');
        },
        onError: (err) => {
          console.error('Error PayPal:', err);
          setError(err.message.includes('popup_blocked') ? 
            'Permite ventanas emergentes para pagar con PayPal' : 
            'Error en el proceso de pago');
        },
        onClick: () => {
          if (!checkPopupBlocked()) {
            return false; // Previene que PayPal continúe
          }
          return true;
        }
      });

      if (button.isEligible()) {
        paypalButtonRef.current = button;
        button.render('#paypal-button-container').catch(err => {
          console.error('Error renderizando botón PayPal:', err);
          setError('Error al cargar PayPal. Recarga la página.');
        });
      } else {
        setError('PayPal no está disponible en tu navegador');
      }
    }

    return () => {
      if (paypalButtonRef.current) {
        paypalButtonRef.current.close();
        paypalButtonRef.current = null;
      }
    };
  }, [total, carrito, navigate, isMobile]);

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

        {error && <Alert severity="error">{error}</Alert>}

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

        <Box display="flex" justifyContent="center" mt={2}>
          {loading ? (
            <CircularProgress />
          ) : (
            <div id="paypal-button-container" style={{ width: isMobile ? '100%' : '300px' }} />
          )}
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