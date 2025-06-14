import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

import visaLogo from '../Imagenes/Visa_Logo.png';
import masterCardLogo from '../Imagenes/Mastercard-logo.svg.png';
import mercadoPagoLogo from '../Imagenes/mercado-pago.png';
import payPalLogo from '../Imagenes/Paypal_2014_logo.png';

const MetodoPagoServicios = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedMethod, setSelectedMethod] = useState(null);

  // Datos de la cita recibidos por navegación
  const {
    id_usuario,
    id_servicio,
    nombre_servicio,
    dia,
    fecha,
    hora,
    horaFin,
    precio,
    notas,
    archivos,
    descripciones,
  } = location.state || {};

  // Validar datos recibidos
  useEffect(() => {
    console.log('Datos recibidos en MetodoPagoServicios:', {
      id_usuario,
      id_servicio,
      nombre_servicio,
      dia,
      fecha,
      hora,
      horaFin,
      precio,
      archivos: archivos ? archivos.map(f => ({ name: f.name, type: f.type })) : [],
      descripciones,
    });
    const missingFields = [];
    if (!id_usuario) missingFields.push('ID de usuario');
    if (!id_servicio) missingFields.push('ID del servicio');
    if (!nombre_servicio) missingFields.push('Nombre del servicio');
    if (!dia) missingFields.push('Día');
    if (!fecha) missingFields.push('Fecha');
    if (!hora) missingFields.push('Hora');
    if (!horaFin) missingFields.push('Hora de fin');
    if (!precio) {
      missingFields.push('Precio');
    }

    if (missingFields.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Datos incompletos',
        text: `Faltan los siguientes datos para procesar el pago: ${missingFields.join(', ')}. Por favor, regresa e intenta de nuevo.`,
        confirmButtonText: 'Aceptar',
      }).then(() => navigate('/cliente/Citas', { state: 'citas' }));
    }
  }, [id_usuario, id_servicio, nombre_servicio, dia, fecha, hora, navigate, precio ]);

  const paymentMethods = [
    {
      id: 'stripe',
      name: 'Tarjetas de crédito y débito',
      description: 'Visa, MasterCard, American Express y más...',
      logos: [visaLogo, masterCardLogo],
      route: '/cliente/pago-servicio/stripe',
    },
    {
      id: 'mercadopago',
      name: 'Mercado Pago',
      description: 'Paga con tarjeta, débito o transferencia.',
      logo: mercadoPagoLogo,
      route: '/cliente/pago-servicio',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Paga fácilmente con tu cuenta PayPal.',
      logo: payPalLogo,
      route: '/cliente/pago-servicio/paypal',
    },
  ];

  const handleSelectMethod = (event) => {
    const methodId = event.target.value;
    setSelectedMethod(methodId);
    const selectedRoute = metodoPagoServicio.find((m) => m.id === methodId)?.route;

    if (selectedRoute) {
      console.log('Navegando a método de pago:', selectedRoute,', {');
      console.log('Navegando método de pago:', {
 id_usuario,
        id_servicio,
        nombre_servicio,
        dia,
        fecha,
        dia,
        hora,
        horaFin,
        precio,
        notas,
        archivos: archivos ? archivos.map(f => ({ nombre: f.nombre, tipo: f.tipo })) : [],
        descripciones,
      });
      navigate(selectedRoute, {
        state: {
          id_usuario,
          id_usuario,
          id_servicio,
          nombreServicio,
          dia,
          fecha,
          hora,
          horaFin,
          precio,
          notas,
          archivos,
          descripciones,
        },
      });
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 'rem',
        mx: 'auto',
        p: isMobile ? 2 : 4,
        bgcolor: '#f5f7fa',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Grid container spacing={isMobile ? 2 : 4}>
        {/* Métodos de pago */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2, boxShadow: 2, bgcolor: 'white' }}>
              <CardContent>
                <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 3 }}>
                  Selecciona un método de pago
                </Typography>

                <RadioGroup
                  aria-label="Métodos de pago"
                  value={selectedMethod}
                  onChange={handleSelectMethod}
                >
                  {paymentMethods.map((method) => (
                    <Box
                      key={method.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        mb: 2,
                        border: '1px solid',
                        borderColor: selectedMethod === method.id ? theme.palette.primary.main : theme.grey[300],
                        borderRadius: 2,
                        bgcolor: selectedMethod === method.id ? 'primary.light' : 'white',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: theme.palette.primary.light,
                          bgcolor: theme.grey[50],
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                          {method.id === 'stripe' ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                              {method.logos.map((logo, index) => (
                                <img
                                  key={index}
                                  src={logo}
                                  alt="Logo tarjeta"
                                  style={{ height: 20, marginRight: 8 }}
                                  onError={(e) => (e.target.src = '/path/to/fallback-image.jpg')}
                                />
                              ))}
                            </Box>
                          ) : (
                            <img
                              src={method.logo}
                              alt={method.name}
                              style={{ height: 30, marginRight: 16 }}
                              onError={(e) => (e.target.src = '/path/to/fallback-image.jpg')}
                            />
                          )}
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                              {method.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {method.description}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </Grid>

        {/* Resumen de la cita */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2, boxShadow: 2, bgcolor: 'white' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Resumen de la cita
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {nombre_servicio || 'Servicio no especificado'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Día: {dia || 'No especificado'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Fecha: {fecha || 'No especificada'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Hora: {hora || 'No especificada'} - {horaFin || 'No especificada'}
                  </Typography>
                  {notas && (
                    <Typography variant="body2" color="textSecondary">
                      Notas: {notas}
                    </Typography>
                  )}
                  {archivos && archivos.length > 0 && (
                    <Typography variant="body2" color="textSecondary">
                      Archivos: {archivos.length} archivo(s)
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Total a pagar
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    ${isNaN(parseFloat(precio)) ? '0.00' : parseFloat(precio).toFixed(2)} MXN
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
      </Grid>
    </Box>
  );
};

export default MetodoPagoServicios;