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
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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
  const [files, setFiles] = useState([]); // Estado para los archivos seleccionados
  const [descriptions, setDescriptions] = useState([]); // Estado para las descripciones
  const [error, setError] = useState(null);

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
  } = location.state || {};

  // Validar datos recibidos
  useEffect(() => {
    console.log('Datos recibidos en MetodoPagoServicios:', location.state);
    const missingFields = [];
    if (!id_usuario) missingFields.push('ID de usuario');
    if (!id_servicio) missingFields.push('ID del servicio');
    if (!nombre_servicio) missingFields.push('Nombre del servicio');
    if (!dia) missingFields.push('Día');
    if (!fecha) missingFields.push('Fecha');
    if (!hora) missingFields.push('Hora');
    if (!horaFin) missingFields.push('Hora de fin');
    if (!precio) missingFields.push('Precio');

    if (missingFields.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Datos incompletos',
        text: `Faltan los siguientes datos para procesar el pago: ${missingFields.join(', ')}. Por favor, regresa e intenta de nuevo.`,
        confirmButtonText: 'Entendido',
      }).then(() =>
        navigate('/cliente/CitasCliente', { state: { servicioId: id_servicio || location.state?.servicioId } })
      );
    }
  }, [id_usuario, id_servicio, nombre_servicio, dia, fecha, hora, horaFin, precio, navigate]);

  // Manejar la selección de archivos
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validFiles = selectedFiles.filter((file) => {
      if (!validTypes.includes(file.type)) {
        setError(`El archivo ${file.name} no es válido. Solo se aceptan imágenes (JPEG, PNG) o PDFs.`);
        return false;
      }
      if (file.size > maxSize) {
        setError(`El archivo ${file.name} excede el tamaño máximo de 5MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length + files.length > 10) {
      setError('No puedes subir más de 10 archivos.');
      return;
    }

    setFiles([...files, ...validFiles]);
    setDescriptions([...descriptions, ...Array(validFiles.length).fill('')]);
    setError(null);
  };

  // Manejar cambios en las descripciones
  const handleDescriptionChange = (index, value) => {
    const newDescriptions = [...descriptions];
    newDescriptions[index] = value;
    setDescriptions(newDescriptions);
  };

  // Eliminar un archivo seleccionado
  const handleRemoveFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newDescriptions = descriptions.filter((_, i) => i !== index);
    setFiles(newFiles);
    setDescriptions(newDescriptions);
  };

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
      route: '/cliente/pago-servicio/mercadopago',
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
    const selectedRoute = paymentMethods.find((m) => m.id === methodId)?.route;

    if (selectedRoute) {
      navigate(selectedRoute, {
        state: {
          id_usuario,
          id_servicio,
          nombre_servicio,
          dia,
          fecha,
          hora,
          horaFin,
          precio,
          notas,
          files, // Pasar los archivos
          descriptions, // Pasar las descripciones
        },
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
        {/* Métodos de pago */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 2, bgcolor: 'white' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
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
                      borderColor:
                        selectedMethod === method.id ? theme.palette.primary.main : theme.palette.grey[300],
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
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}
                          aria-label={`Seleccionar ${method.name}`}
                        >
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
                      }
                      sx={{ flexGrow: 1, m: 0 }}
                    />
                  </Box>
                ))}
              </RadioGroup>

              {/* Campo para subir archivos */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Subir archivos (opcional)
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Puedes subir hasta 10 archivos (imágenes JPEG/PNG o PDFs, máximo 5MB cada uno).
                </Typography>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mb: 2 }}
                >
                  Seleccionar archivos
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={handleFileChange}
                  />
                </Button>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
                {files.length > 0 && (
                  <Box>
                    {files.map((file, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 2,
                          p: 1,
                          border: '1px solid',
                          borderColor: theme.palette.grey[300],
                          borderRadius: 1,
                        }}
                      >
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2">{file.name}</Typography>
                          <TextField
                            label="Descripción (opcional)"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={descriptions[index]}
                            onChange={(e) => handleDescriptionChange(index, e.target.value)}
                            sx={{ mt: 1 }}
                          />
                        </Box>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleRemoveFile(index)}
                          sx={{ ml: 2 }}
                        >
                          Eliminar
                        </Button>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
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
                  Hora: {hora || 'No especificada'}
                </Typography>
                {notas && (
                  <Typography variant="body2" color="textSecondary">
                    Notas: {notas}
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