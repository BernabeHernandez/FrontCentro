import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Container,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { useAuth } from './AuthContext';

const MySwal = withReactContent(Swal);

// Tema personalizado con verde (#00796b)
const theme = createTheme({
  palette: {
    primary: {
      main: '#00796b', // Verde principal
    },
    secondary: {
      main: '#757575', // Gris oscuro
    },
    background: {
      default: '#ffffff', // Fondo blanco
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function VerifyMFA({ onLoginSuccess }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const { qrCodeUrl, user, tipo: tipoUsuario, id } = location.state || {};

  const [mfaCode, setMfaCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [mfaCodeError, setMfaCodeError] = useState('');

  const handleMfaSubmit = async (e) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
      const response = await axios.post('https://backendcentro.onrender.com/api/login/verify-mfa', {
        user: user,
        token: mfaCode,
      });

      const { tipo, error } = response.data;

      if (error) {
        console.error('Error desde el servidor:', error);
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: error,
        });
        setIsVerifying(false);
        return;
      }

      // Guardar el nombre de usuario, id_usuario y rol en localStorage
      localStorage.setItem('usuario', user);
      localStorage.setItem('usuario_id', id); // Usar el id_usuario recibido desde location.state
      localStorage.setItem('rol', tipo);

      // Llamar a la función de login del contexto de autenticación
      login({ user, id, tipo });

      // Redirigir al usuario según su rol
      const ruta = tipo === 'Administrador' ? '/admin' : '/cliente';

      MySwal.fire({
        position: 'center',
        icon: 'success',
        title: 'Has iniciado sesión correctamente.',
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        navigate(ruta);
      });
    } catch (error) {
      console.error('Error verificando MFA:', error);
      MySwal.fire({
        icon: 'error',
        title: 'Error al verificar MFA',
        text: 'Código incorrecto. Intenta nuevamente.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleMfaCodeChange = (e) => {
    const value = e.target.value;

    if (/^\d{0,6}$/.test(value)) {
      setMfaCode(value);
      setMfaCodeError('');
    } else {
      setMfaCodeError('El código MFA debe ser solo numérico y tener 6 caracteres.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '90vh',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Card
          elevation={6}
          sx={{
            width: '100%',
            padding: 3,
            borderRadius: 2,
            textAlign: 'center',
            backgroundColor: '#ffffff',
          }}
        >
          <CardContent>
            <Typography component="h1" variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.primary.main }}>
              Verificación MFA
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: theme.palette.secondary.main }}>
              Escanea el código QR con tu aplicación de autenticación y escribe el código generado.
            </Typography>
            {qrCodeUrl && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <img src={qrCodeUrl} alt="Código QR" style={{ width: '200px', height: '200px' }} />
              </Box>
            )}
            <Box component="form" onSubmit={handleMfaSubmit} sx={{ width: '100%' }}>
              <TextField
                fullWidth
                label="Código MFA"
                variant="outlined"
                margin="normal"
                value={mfaCode}
                onChange={handleMfaCodeChange}
                required
                inputProps={{ maxLength: 6 }}
                error={!!mfaCodeError}
                helperText={mfaCodeError}
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isVerifying}
                sx={{
                  mt: 2,
                  mb: 2,
                  backgroundColor: theme.palette.primary.main, // Verde principal
                  '&:hover': { backgroundColor: '#004d40' }, // Verde más oscuro al hacer hover
                  padding: '10px',
                  fontWeight: 'bold',
                }}
              >
                {isVerifying ? <CircularProgress size={24} color="inherit" /> : 'Verificar Código'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
}

export default VerifyMFA;