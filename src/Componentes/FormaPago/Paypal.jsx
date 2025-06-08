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

  useEffect(() => {
    // Verificar si el carrito y el total son válidos
    if (!Array.isArray(carrito) || carrito.length === 0) {
      setError('No se recibió información del carrito. Regresa e intenta de nuevo.');
      console.error('location.state inválido:', JSON.stringify(location.state, null, 2));
      return;
    }

    // Depuración: verificar el carrito recibido
    console.log('Carrito recibido en Paypal:', JSON.stringify(carrito, null, 2));

    // Guardar el carrito en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    console.log('Carrito guardado en localStorage desde Paypal:', JSON.stringify(carrito, null, 2));

    // Configurar el botón de PayPal
    if (window.paypal && total > 0 && carrito.length > 0) {
      console.log('Inicializando botón de PayPal, total:', total);
      const container = document.getElementById('paypal-button-container');
      if (container) {
        container.innerHTML = ''; // Limpiar contenedor
      }

      if (paypalButtonRef.current) {
        paypalButtonRef.current.close();
        paypalButtonRef.current = null;
      }

      const button = window.paypal.Buttons({
        style: {
          color: 'gold',
          shape: 'pill',
          label: 'paypal',
          layout: 'horizontal',
        },
        createOrder: (data, actions) => {
          console.log('Creando orden en PayPal, total:', total);
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

            console.log('Iniciando captura del pago, orderID:', data.orderID);
            const details = await actions.order.capture();
            console.log('Pago capturado:', JSON.stringify(details, null, 2));

            // Obtener el carrito desde localStorage
            const carritoRaw = localStorage.getItem('carrito');
            console.log('Carrito en localStorage:', carritoRaw);

            let carritoProcesar = JSON.parse(carritoRaw) || [];
            if (!carritoProcesar.length) {
              const id_usuario = localStorage.getItem('usuario_id');
              if (!id_usuario) {
                throw new Error('No se encontró el ID del usuario. Por favor, inicia sesión nuevamente.');
              }

              console.log('Obteniendo carrito desde el backend para usuario:', id_usuario);
              const responseCarrito = await axios.get(`https://backendcentro.onrender.com/carrito/${id_usuario}`);
              carritoProcesar = responseCarrito.data;
              console.log('Carrito obtenido desde el backend:', JSON.stringify(carritoProcesar, null, 2));

              if (!carritoProcesar.length) {
                throw new Error('No se encontraron productos en el carrito. Por favor, intenta realizar la compra nuevamente.');
              }

              localStorage.setItem('carrito', JSON.stringify(carritoProcesar));
            }

            // Validar el carrito
            const carritoValido = carritoProcesar.every(item => item.id && item.cantidad_carrito > 0);
            if (!carritoValido) {
              throw new Error('El carrito contiene datos inválidos (falta id o cantidad_carrito).');
            }

            // Preparar datos para /carrito/reducir-inventario
            const productos = carritoProcesar.map(item => ({
              id: item.id,
              cantidad: item.cantidad_carrito,
            }));

            console.log('Productos enviados a /carrito/reducir-inventario:', JSON.stringify(productos, null, 2));

            // Llamar a la ruta
            const response = await axios.put('https://backendcentro.onrender.com/api/carrito/carrito/reducir-inventario', {
              productos,
            });
            console.log('Respuesta de /carrito/reducir-inventario:', response.data);

            // Mostrar mensaje de éxito
            Swal.fire({
              title: '¡Compra exitosa!',
              text: `Pago completado por ${details.payer.name.given_name}. ${response.data.message}`,
              icon: 'success',
              confirmButtonText: 'Ir al carrito',
              allowOutsideClick: false,
            }).then(() => {
              localStorage.removeItem('carrito');
              console.log('Carrito eliminado de localStorage');
              navigate('/carrito');
            });
          } catch (error) {
            console.error('Error al procesar la compra:', error);
            let errorMessage = 'Ocurrió un error al procesar la compra. Por favor, intenta de nuevo.';
            if (error.message.includes('Window closed before response')) {
              errorMessage = 'La ventana de PayPal se cerró antes de completar el pago. Por favor, intenta de nuevo sin cerrar la ventana.';
            }
            setError(errorMessage);
            Swal.fire({
              title: 'Error',
              text: errorMessage,
              icon: 'error',
              confirmButtonText: 'Volver al inicio',
              allowOutsideClick: false,
            }).then(() => {
              navigate('/');
            });
          } finally {
            setLoading(false);
          }
        },
        onError: (err) => {
          console.error('Error en el pago con PayPal:', err);
          let errorMessage = 'Ocurrió un error al procesar el pago.';
          if (err.message && err.message.includes('Window closed before response')) {
            errorMessage = 'La ventana de PayPal se cerró antes de completar el pago. Por favor, intenta de nuevo sin cerrar la ventana.';
          } else if (err.message && err.message.includes('popup_blocked')) {
            errorMessage = 'El navegador bloqueó la ventana de PayPal. Por favor, permite las ventanas emergentes para este sitio e intenta de nuevo.';
          }
          setError(errorMessage);
          Swal.fire({
            title: 'Error',
            text: errorMessage,
            icon: 'error',
            confirmButtonText: 'Volver al inicio',
          }).then(() => {
            navigate('/');
          });
        },
        onClick: () => {
          console.log('Botón de PayPal clickeado, verificando ventanas emergentes');
          if (!window.open) {
            setError('Las ventanas emergentes están bloqueadas. Por favor, permite las ventanas emergentes para este sitio.');
            Swal.fire({
              title: 'Error',
              text: 'Las ventanas emergentes están bloqueadas. Por favor, permite las ventanas emergentes para este sitio.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        },
      });

      paypalButtonRef.current = button;
      console.log('Renderizando botón de PayPal');
      button.render('#paypal-button-container').catch(err => {
        console.error('Error al renderizar el botón de PayPal:', err);
        setError('No se pudo cargar el botón de PayPal. Por favor, recarga la página.');
      });
    } else {
      console.warn('PayPal SDK no cargado o carrito/total inválidos:', { paypal: !!window.paypal, total, carritoLength: carrito.length });
    }

    // Cleanup
    return () => {
      if (paypalButtonRef.current) {
        paypalButtonRef.current.close();
        paypalButtonRef.current = null;
      }
      const container = document.getElementById('paypal-button-container');
      if (container) {
        container.innerHTML = '';
      }
      console.log('Limpiando botón de PayPal');
    };
  }, [total, carrito, navigate]);

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