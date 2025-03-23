import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAuth } from './AuthContext';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Link as MuiLink,
  IconButton,
  InputAdornment,
  Grid,
  CssBaseline,
  Avatar,
  Box,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';

const MySwal = withReactContent(Swal);

// Tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#00796b', // Verde principal
    },
    secondary: {
      main: '#004d40', // Verde oscuro
    },

  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeLeft, setLockTimeLeft] = useState(0);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLocked) {
      MySwal.fire({
        icon: 'error',
        title: 'Cuenta Bloqueada',
        text: 'Tu cuenta está bloqueada temporalmente. Espera un momento para intentar de nuevo.',
      });
      return;
    }

    if (!captchaToken) {
      MySwal.fire({
        icon: 'warning',
        title: 'CAPTCHA Requerido',
        text: 'Por favor, completa el CAPTCHA para continuar.',
      });
      return;
    }

    try {
      const response = await axios.post('https://backendcentro.onrender.com/api/login', {
        user: username,
        password: password,
        captchaToken,
      });

      const { tipo, qrCodeUrl, message, id_usuario } = response.data;

      if (qrCodeUrl) {
        navigate('/codigo-mfa', {
          state: {
            qrCodeUrl,
            user: username,
            tipo,
            id: id_usuario,
          },
        });
        return;
      }

      localStorage.setItem('usuario', username);
      localStorage.setItem('usuario_id', id_usuario);

      login({ user: username, id: id_usuario, tipo });

      navigate('/citas');
    } catch (error) {
      if (error.response) {
        const { lockTimeLeft, attemptsLeft, error: serverError } = error.response.data;

        if (serverError === 'Usuario no encontrado') {
          MySwal.fire({
            icon: 'error',
            title: 'Usuario No Encontrado',
            text: 'El usuario ingresado no existe.',
          });

          MySwal.fire({
            icon: 'info',
            title: 'Intentos restantes: 0',
          });
        } else if (serverError === 'La cuenta no está verificada. Por favor, revisa tu correo para activar tu cuenta.') {
          MySwal.fire({
            icon: 'warning',
            title: 'Cuenta No Verificada',
            text: serverError,
          });
        } else if (serverError && serverError === 'Tu cuenta está permanentemente bloqueada. Por favor, contacta con el administrador.') {
          MySwal.fire({
            icon: 'error',
            title: 'Cuenta Bloqueada Permanentemente',
            text: serverError,
          });
        } else if (lockTimeLeft) {
          setIsLocked(true);
          setLockTimeLeft(lockTimeLeft);
        } else {
          const attempts = attemptsLeft || 0;
          MySwal.fire({
            icon: 'error',
            title: 'Usuario o Contraseña Incorrecta',
            text: `Intentos restantes: ${attempts}`,
          });
        }
      } else {
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al iniciar sesión. Inténtalo de nuevo más tarde.',
        });
      }
    }
  };

  const formatLockTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '90vh',
          background: theme.palette.background.default, // Fondo blanco
        }}
      >
        <Card
          elevation={6}
          sx={{
            width: '100%',
            padding: 3,
            borderRadius: 2,
            textAlign: 'center',
            backgroundColor: '#ffffff', // Fondo blanco
          }}
        >
          <Avatar
            sx={{
              margin: 'auto',
              backgroundColor: theme.palette.primary.main, // Azul principal
              width: 56,
              height: 56,
            }}
          >
            <LockOutlined fontSize="large" />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mt: 2, mb: 3, fontWeight: 'bold', color: theme.palette.primary.main }}>
            Iniciar Sesión
          </Typography>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                fullWidth
                label="Usuario"
                type="text"
                variant="outlined"
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                sx={{ mb: 2 }}
                autoComplete="username"
              />
              <TextField
                fullWidth
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <ReCAPTCHA
                sitekey="6LexEPMqAAAAAMbw4d8KeEwxa4kwlFWV6m2midhT"
                onChange={onCaptchaChange}
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  mb: 2,
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': { backgroundColor: '#00796b' }, 
                  padding: '10px',
                  fontWeight: 'bold',
                }}
                disabled={isLocked}
              >
                Iniciar Sesión
              </Button>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <MuiLink component={Link} to="/opcionrestaurarpassw" variant="body2" sx={{ color: theme.palette.primary.main }}>
                    ¿Olvidaste la contraseña?
                  </MuiLink>
                </Grid>
                <Grid item>
                  <MuiLink component={Link} to="/registro" variant="body2" sx={{ color: theme.palette.primary.main }}>
                    Regístrate
                  </MuiLink>
                </Grid>
              </Grid>
            </Box>
            {isLocked && (
              <Typography variant="body2" sx={{ color: 'red', mt: 2, textAlign: 'center' }}>
                Tiempo restante para desbloquear: {formatLockTime(lockTimeLeft)}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
}

export default Login;