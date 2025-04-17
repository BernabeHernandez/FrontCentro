import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

import visaLogo from '../Imagenes/Visa_Logo.png';
import masterCardLogo from '../Imagenes/Mastercard-logo.svg.png';
import mercadoPagoLogo from '../Imagenes/mercado-pago.png';
import payPalLogo from '../Imagenes/Paypal_2014_logo.png';
import productImage from '../Imagenes/perfil2.jpg';

const OpcionPago = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedMethod, setSelectedMethod] = useState(null);

  const { carrito = [], total = 0 } = location.state || {};

  const paymentMethods = [
    {
      id: 'stripe',
      name: 'Tarjetas de crédito y débito',
      description: 'Visa, MasterCard, American Express y más...',
      logos: [visaLogo, masterCardLogo],
      route: '/mastercard',
    },
    {
      id: 'mercadopago',
      name: 'Mercado Pago',
      description:
        'Compra a través de Mercado Pago con tarjeta de crédito, tarjeta de débito, transferencias o dinero en cuenta.',
      logo: mercadoPagoLogo,
      route: '/mercadopago',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Compra el curso usando PayPal.',
      logo: payPalLogo,
      route: '/paypal',
    },
  ];

  const handleSelectMethod = (event) => {
    const methodId = event.target.value;
    setSelectedMethod(methodId);
    const selectedRoute = paymentMethods.find((method) => method.id === methodId)?.route;
    if (selectedRoute) {
      navigate(selectedRoute, {
        state: { carrito, total }, // Pasar carrito y total en el state
      });
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: 'auto',
        p: isMobile ? 2 : 4,
        bgcolor: '#f5f7fa',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Grid container spacing={isMobile ? 2 : 4}>
        {/* Sección de métodos de pago (izquierda) */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: 2,
              bgcolor: 'white',
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: theme.palette.text.primary,
                  mb: 3,
                }}
              >
                Método de pago
              </Typography>

              <RadioGroup value={selectedMethod} onChange={handleSelectMethod}>
                {paymentMethods.map((method) => (
                  <Box
                    key={method.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      mb: 2,
                      border: '1px solid',
                      borderColor:
                        selectedMethod === method.id
                          ? theme.palette.primary.main
                          : theme.palette.grey[300],
                      borderRadius: 2,
                      bgcolor: selectedMethod === method.id ? 'primary.light' : 'white',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: theme.palette.primary.light,
                        bgcolor: theme.palette.grey[50],
                      },
                    }}
                  >
                    <FormControlLabel
                      value={method.id}
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                          {method.id === 'stripe' ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                              {method.logos.map((logo, index) => (
                                <img
                                  key={index}
                                  src={logo}
                                  alt={index === 0 ? 'Visa' : 'MasterCard'}
                                  style={{
                                    height: 20,
                                    marginRight: index === 0 ? 8 : 0,
                                  }}
                                />
                              ))}
                            </Box>
                          ) : (
                            <img
                              src={method.logo}
                              alt={method.name}
                              style={{ height: 30, marginRight: 16 }}
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
                      }
                      sx={{ flexGrow: 1, m: 0 }}
                    />
                  </Box>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </Grid>

        {/* Sección de resumen de compra (derecha) */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: 2,
              bgcolor: 'white',
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: theme.palette.text.primary,
                  mb: 3,
                }}
              >
                Resumen de la compra
              </Typography>

              {carrito.length === 0 ? (
                <Typography variant="body1" color="textSecondary">
                  No hay productos en el carrito.
                </Typography>
              ) : (
                carrito.map((item) => (
                  <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <img
                      src={item.imagen || productImage}
                      alt={item.nombre}
                      style={{
                        width: 80,
                        height: 80, // Cuadrado para mayor consistencia
                        marginRight: 16,
                        objectFit: 'contain', // Mostrar imagen completa
                      }}
                    />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {item.nombre}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Cantidad: {item.cantidad_carrito}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Subtotal: ${(item.subtotal || item.precio_carrito * item.cantidad_carrito || 0).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                ))
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  Subtotal
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  ${total.toFixed(2)} MXN
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  Total
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  ${total.toFixed(2)} MXN
                </Typography>
              </Box>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OpcionPago;