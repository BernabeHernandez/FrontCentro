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
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const paypalButtons = useRef(null);
  const paypalScriptLoaded = useRef(false);
  const retryCount = useRef(0);
  const MAX_RETRIES = 2;
  const containerRef = useRef(null); // Referencia al contenedor

  const toggleItemExpansion = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const checkPopupBlocked = () => {
    console.log('Verificando bloqueo de ventanas emergentes');
    const popup = window.open('', '_blank', 'width=100,height=100');
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      setError('Por favor, permite ventanas emergentes para este sitio en la configuración de tu navegador.');
      Swal.fire({
        title: 'Ventanas emergentes bloqueadas',
        text: 'Para completar el pago, necesitas permitir ventanas emergentes para este sitio.',
        icon: 'warning',
        confirmButtonText: 'Entendido',
      });
      console.warn('Ventanas emergentes bloqueadas detectadas');
      return false;
    }
    popup.close();
    console.log('Ventanas emergentes permitidas');
    return true;
  };

  const monitorPopup = (popup, onClose) => {
    console.log('Monitoreando ventana emergente de PayPal');
    if (!popup) {
      console.warn('No se proporcionó una ventana emergente válida');
      onClose(0);
      return () => {};
    }
    let lastCheck = Date.now();
    const interval = setInterval(() => {
      if (popup.closed) {
        const timeElapsed = Date.now() - lastCheck;
        console.warn(`Ventana emergente cerrada detectada tras ${timeElapsed}ms`);
        onClose(timeElapsed);
        clearInterval(interval);
      }
      lastCheck = Date.now();
    }, 50);
    return () => clearInterval(interval);
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handlePostPayment = async (details) => {
    console.log('Procesando post-pago, details:', JSON.stringify(details, null, 2));
    try {
      let carritoData = JSON.parse(localStorage.getItem('carrito')) || [];
      console.log('Carrito desde localStorage:', JSON.stringify(carritoData, null, 2));
      const id_usuario = localStorage.getItem('usuario_id');
      console.log('ID usuario:', id_usuario);

      if (!carritoData.length && id_usuario) {
        console.log('Obteniendo carrito desde backend para usuario:', id_usuario);
        const response = await axios.get(`https://backendcentro.onrender.com/api/carrito/carrito/${id_usuario}`);
        carritoData = response.data;
        console.log('Carrito desde backend:', JSON.stringify(carritoData, null, 2));
      }

      if (!carritoData.length) {
        throw new Error('No se encontraron productos en el carrito.');
      }

      const productos = carritoData.map(item => ({
        id: item.id,
        cantidad: item.cantidad_carrito,
      }));
      console.log('Productos para /carrito/reducir-inventario:', JSON.stringify(productos, null, 2));

      const response = await axios.put(
        'https://backendcentro.onrender.com/api/carrito/carrito/reducir-inventario',
        { productos }
      );
      console.log('Respuesta de /carrito/reducir-inventario:', JSON.stringify(response.data, null, 2));

      Swal.fire({
        title: '¡Compra completada!',
        html: `
          <p>Gracias por tu compra ${details.payer.name.given_name}!</p>
          <p>${response.data.message}</p>
        `,
        icon: 'success',
        confirmButtonText: 'Ver mis compras',
      }).then(() => {
        localStorage.removeItem('carrito');
        console.log('Carrito eliminado de localStorage');
        navigate('/carrito');
      });
    } catch (error) {
      console.error('Error post-pago:', error);
      Swal.fire({
        title: 'Advertencia',
        text: 'El pago se completó pero hubo un problema al registrar tu compra. Por favor, contacta al soporte.',
        icon: 'warning',
      });
    }
  };

  const initializePayPalButton = () => {
    console.log('Inicializando botón de PayPal, paypal disponible:', !!window.paypal, 'total:', total, 'carrito:', carrito.length);
    if (!window.paypal || total <= 0 || carrito.length === 0) {
      console.warn('No se puede inicializar PayPal: SDK no cargado o datos inválidos');
      return;
    }

    const container = containerRef.current;
    if (!container) {
      console.error('Contenedor paypal-button-container no encontrado');
      setError('Error al cargar el botón de PayPal. Recarga la página.');
      return;
    }

    container.innerHTML = '';
    console.log('Contenedor limpiado');

    if (paypalButtons.current) {
      paypalButtons.current.close();
      paypalButtons.current = null;
      console.log('Botón PayPal anterior cerrado');
    }

    paypalButtons.current = window.paypal.Buttons({
      style: {
        color: 'gold',
        shape: 'pill',
        label: 'pay',
        layout: isMobile ? 'vertical' : 'horizontal',
        height: 45,
        tagline: false,
      },
      createOrder: (data, actions) => {
        console.log('Creando orden en PayPal, total:', total.toFixed(2));
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: total.toFixed(2),
              currency_code: 'MXN',
            },
            description: 'Compra en Centro de Rehabilitación Integral',
            custom_id: localStorage.getItem('usuario_id') || 'guest',
          }],
        });
      },
      onApprove: async (data, actions) => {
        try {
          setLoading(true);
          setError(null);
          console.log('Iniciando captura del pago, orderID:', data.orderID);

          if (!checkPopupBlocked()) return;

          // Advertencia inicial sobre extensiones
          await Swal.fire({
            title: 'Advertencia',
            text: 'Para completar el pago, asegúrate de no cerrar la ventana de PayPal y desactiva extensiones como Loom o herramientas de grabación.',
            icon: 'info',
            confirmButtonText: 'Entendido',
          });

          const attemptCapture = async () => {
            let popup = null;
            try {
              console.log('Abriendo ventana emergente dummy para monitoreo');
              popup = window.open('', '_blank');
              const cleanupMonitor = monitorPopup(popup, (timeElapsed) => {
                console.warn(`Cierre detectado tras ${timeElapsed}ms`);
              });

              console.log('Iniciando captura con actions.order.capture');
              await delay(1000);
              const details = await actions.order.capture();
              console.log('Pago capturado:', JSON.stringify(details, null, 2));
              cleanupMonitor();
              if (popup && !popup.closed) popup.close();
              return details;
            } catch (err) {
              console.error('Error en attemptCapture:', err);
              if (popup && !popup.closed) popup.close();
              if (err.message.includes('Window closed') || err.message.includes('postrobot_method')) {
                if (retryCount.current < MAX_RETRIES) {
                  retryCount.current += 1;
                  console.log(`Reintentando captura, intento ${retryCount.current}/${MAX_RETRIES}`);
                  Swal.fire({
                    title: 'Ventana cerrada',
                    text: `La ventana de PayPal se cerró inesperadamente. Reintentando (${retryCount.current}/${MAX_RETRIES})...`,
                    icon: 'warning',
                    timer: 2000,
                    showConfirmButton: false,
                  });
                  return attemptCapture();
                } else {
                  throw new Error('La ventana de PayPal se cerró demasiadas veces. Desactiva extensiones como Loom y prueba en modo incógnito o en otro navegador.');
                }
              }
              throw err;
            }
          };

          const details = await attemptCapture();

          await Swal.fire({
            title: '¡Pago exitoso!',
            text: 'Procesando tu compra...',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            allowOutsideClick: false,
          });

          await handlePostPayment(details);
        } catch (error) {
          console.error('Error en el pago:', error);
          let errorMsg = 'Ocurrió un error al procesar tu pago. Por favor, intenta de nuevo.';
          if (error.message.includes('Window closed') || error.message.includes('postrobot_method')) {
            errorMsg = 'La ventana de PayPal se cerró inesperadamente. Por favor, desactiva extensiones como Loom y prueba en modo incógnito o en otro navegador.';
          } else if (error.message.includes('secure browser')) {
            errorMsg = 'Problema con el navegador seguro de PayPal. Por favor, desactiva extensiones de grabación o prueba en otro navegador.';
          }
          setError(errorMsg);
          Swal.fire({
            title: 'Error',
            text: errorMsg,
            icon: 'error',
            confirmButtonText: 'Volver al inicio',
          }).then(() => {
            navigate('/');
          });
        } finally {
          setLoading(false);
          retryCount.current = 0;
        }
      },
      onCancel: () => {
        console.log('Pago cancelado por el usuario');
        setError('Has cancelado el proceso de pago');
        Swal.fire('Pago cancelado', 'Puedes intentar nuevamente cuando lo desees', 'info');
      },
      onError: (err) => {
        console.error('Error PayPal:', err);
        let errorMsg = 'Ocurrió un error con PayPal. Por favor, intenta de nuevo.';
        if (err.message.includes('popup_blocked')) {
          errorMsg = 'Por favor, permite ventanas emergentes para este sitio';
        } else if (err.message.includes('secure browser')) {
          errorMsg = 'Problema con el navegador seguro de PayPal. Por favor, desactiva extensiones de grabación o prueba en otro navegador.';
        }
        setError(errorMsg);
        Swal.fire({
          title: 'Error',
          text: errorMsg,
          icon: 'error',
          confirmButtonText: 'Volver al inicio',
        }).then(() => {
          navigate('/');
        });
      },
      onClick: () => {
        console.log('Botón PayPal clickeado');
        if (!checkPopupBlocked()) {
          return false;
        }
      },
    });

    if (paypalButtons.current.isEligible()) {
      console.log('Renderizando botón de PayPal');
      paypalButtons.current.render(containerRef.current).catch(err => {
        console.error('Error renderizando PayPal:', err);
        setError('No se pudo cargar el botón de PayPal. Recarga la página.');
      });
    } else {
      console.warn('PayPal no elegible en este navegador');
      setError('PayPal no está disponible en tu navegador');
    }
  };

  useEffect(() => {
    console.log('useEffect ejecutado, carrito:', JSON.stringify(carrito, null, 2), 'total:', total);
    if (!Array.isArray(carrito)) {
      setError('No se recibió información válida del carrito. Regresa e intenta de nuevo.');
      console.error('Carrito inválido:', carrito);
      return;
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    console.log('Carrito guardado en localStorage:', JSON.stringify(carrito, null, 2));

    if (!sdkLoaded && !paypalScriptLoaded.current) {
      paypalScriptLoaded.current = true;
      console.log('Cargando script de PayPal');

      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=Abr47HRyGorI1kKWNP_0LtDnm-fobtGYNCCcSkzl5p3176ruG0JwOYk8pWAe-IJWR2vYbGz8qzuBOCYg&currency=MXN&intent=capture&components=buttons';
      script.async = true;

      script.onload = () => {
        console.log('Script de PayPal cargado');
        setSdkLoaded(true);
      };
      script.onerror = () => {
        console.error('Error al cargar script de PayPal');
        setError('Error al cargar PayPal. Verifica tu conexión o el client-id.');
      };

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
        console.log('Script de PayPal removido');
        if (paypalButtons.current) {
          paypalButtons.current.close();
          console.log('Botón PayPal cerrado en cleanup de script');
        }
      };
    }
  }, []);

  useEffect(() => {
    if (sdkLoaded && containerRef.current) {
      initializePayPalButton();
    }
  }, [sdkLoaded, total, carrito, isMobile]);

  useEffect(() => {
    return () => {
      if (paypalButtons.current) {
        paypalButtons.current.close();
        console.log('Botón PayPal cerrado en cleanup de componente');
      }
    };
  }, []);

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

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
            <div
              id="paypal-button-container"
              ref={containerRef}
              style={{ width: isMobile ? '100%' : '300px' }}
            />
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