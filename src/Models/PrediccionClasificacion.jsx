import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Fade,
  Grow,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { styled } from '@mui/system';

// Definir el tema directamente en el componente
const theme = createTheme({
  palette: {
    primary: { main: '#616161' }, // Gris para botones
    success: { main: '#2e7d32', light: '#e8f5e9' }, // Verde para éxito
    error: { main: '#d32f2f', light: '#ffebee' }, // Rojo para errores
    warning: { main: '#facc15' }, // Amarillo para animación highlight
  },
});

// Estilos personalizados para replicar animaciones
const ResultContainer = styled(Paper)(({ theme, error }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  borderLeft: `4px solid ${error ? theme.palette.error.main : theme.palette.success.main}`,
  backgroundColor: error ? theme.palette.error.light : theme.palette.success.light,
  transition: 'border-color 1.5s ease-in-out',
  '&.highlight': {
    animation: `highlight 1.5s ease-in-out`,
    '@keyframes highlight': {
      '0%': { borderColor: theme.palette.success.main },
      '50%': { borderColor: theme.palette.warning.main },
      '100%': { borderColor: theme.palette.success.main },
    },
  },
}));

function PrediccionClasificacion() {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    hora_inicio: '',
    nombre_x: '',
    apellidopa: '',
    apellidoma: '',
    nombre_y: '',
  });
  // Estado para las opciones de las categorías
  const [categories, setCategories] = useState({
    hora_inicio: [],
    nombre_x: [],
    apellidopa: [],
    apellidoma: [],
    nombre_y: [],
  });
  // Estados para manejar el resultado, error y estado de carga
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cargar las categorías al montar el componente
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://backendmodelos.onrender.com/get_categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
        setError('No se pudieron cargar las categorías.');
      }
    };
    fetchCategories();
  }, []);

  // Manejar cambios en los inputs del formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await axios.post('https://backendmodelos.onrender.com/predict', {
        hora_inicio: formData.hora_inicio,
        nombre_x: formData.nombre_x,
        apellidopa: formData.apellidopa,
        apellidoma: formData.apellidoma,
        nombre_y: formData.nombre_y,
      }, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        transformRequest: [(data) => {
          const params = new URLSearchParams();
          for (const key in data) {
            params.append(key, data[key]);
          }
          return params;
        }],
      });

      setResult(response.data.prediction);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Error en la solicitud.');
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          bgcolor: '#f5f5f5',
          p: 2,
        }}
      >
        <Fade in timeout={500}>
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: '#424242',
              textTransform: 'uppercase',
              letterSpacing: 1.2,
              mt: 2,
            }}
          >
            Predicción de Asistencia a Citas
          </Typography>
        </Fade>

        <Grow in timeout={700}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              maxWidth: 500,
              width: '100%',
              bgcolor: '#fff',
              borderRadius: 2,
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              },
            }}
          >
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Hora de Inicio */}
              <TextField
                select
                label="Hora de Inicio"
                name="hora_inicio"
                value={formData.hora_inicio}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                sx={{ bgcolor: '#fafafa' }}
              >
                <MenuItem value="" disabled>
                  Selecciona una hora
                </MenuItem>
                {categories.hora_inicio.map((hora) => (
                  <MenuItem key={hora} value={hora}>
                    {hora}
                  </MenuItem>
                ))}
              </TextField>

              {/* Nombre */}
              <TextField
                select
                label="Nombre"
                name="nombre_x"
                value={formData.nombre_x}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                sx={{ bgcolor: '#fafafa' }}
              >
                <MenuItem value="" disabled>
                  Selecciona un nombre
                </MenuItem>
                {categories.nombre_x.map((nombre) => (
                  <MenuItem key={nombre} value={nombre}>
                    {nombre}
                  </MenuItem>
                ))}
              </TextField>

              {/* Apellido Paterno */}
              <TextField
                select
                label="Apellido Paterno"
                name="apellidopa"
                value={formData.apellidopa}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                sx={{ bgcolor: '#fafafa' }}
              >
                <MenuItem value="" disabled>
                  Selecciona un apellido
                </MenuItem>
                {categories.apellidopa.map((apellido) => (
                  <MenuItem key={apellido} value={apellido}>
                    {apellido}
                  </MenuItem>
                ))}
              </TextField>

              {/* Apellido Materno */}
              <TextField
                select
                label="Apellido Materno"
                name="apellidoma"
                value={formData.apellidoma}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                sx={{ bgcolor: '#fafafa' }}
              >
                <MenuItem value="" disabled>
                  Selecciona un apellido
                </MenuItem>
                {categories.apellidoma.map((apellido) => (
                  <MenuItem key={apellido} value={apellido}>
                    {apellido}
                  </MenuItem>
                ))}
              </TextField>

              {/* Servicio */}
              <TextField
                select
                label="Servicio"
                name="nombre_y"
                value={formData.nombre_y}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                sx={{ bgcolor: '#fafafa' }}
              >
                <MenuItem value="" disabled>
                  Selecciona un servicio
                </MenuItem>
                {categories.nombre_y.map((servicio) => (
                  <MenuItem key={servicio} value={servicio}>
                    {servicio}
                  </MenuItem>
                ))}
              </TextField>

              {/* Botón de enviar */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  py: 1.5,
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  bgcolor: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                    transform: 'scale(1.05)',
                    transition: 'transform 0.2s ease-in-out',
                  },
                }}
              >
                Predecir
              </Button>
            </Box>
          </Paper>
        </Grow>

        {/* Contenedor de resultados */}
        {loading && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={32} />
            <Typography variant="body1" color="textSecondary">
              Procesando...
            </Typography>
          </Box>
        )}

        {(result || error) && (
          <Fade in timeout={500}>
            <ResultContainer elevation={3} error={error} className={error ? '' : 'highlight'}>
              <Typography
                variant="h6"
                align="center"
                sx={{
                  fontWeight: 'bold',
                  color: error ? theme.palette.error.main : theme.palette.success.main,
                  mb: 1,
                }}
              >
                {error ? 'Error' : 'Resultado de la Predicción'}
              </Typography>
              <Typography variant="body1" align="center" sx={{ fontWeight: 'medium' }}>
                {error || result}
              </Typography>
            </ResultContainer>
          </Fade>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default PrediccionClasificacion;