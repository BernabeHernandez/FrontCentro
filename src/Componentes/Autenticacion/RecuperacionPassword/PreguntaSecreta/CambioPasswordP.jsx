import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  InputAdornment,
  IconButton
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import sha1 from 'crypto-js/sha1';

const CambioPasswordP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { identificador } = location.state || {};
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isCompromised, setIsCompromised] = useState(false);
  const [requirements, setRequirements] = useState({
    minLength: false,
    uppercase: false,
    number: false,
    specialChar: false
  });
  // Estados para controlar la visibilidad de las contraseñas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Funciones para alternar la visibilidad
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  // Validar la contraseña en tiempo real
  useEffect(() => {
    const validatePassword = async () => {
      const minLength = nuevaContrasena.length >= 8;
      const uppercase = /[A-Z]/.test(nuevaContrasena);
      const number = /\d/.test(nuevaContrasena);
      const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(nuevaContrasena);

      setRequirements({ minLength, uppercase, number, specialChar });

      // Calcular fuerza de la contraseña (0-100)
      let strength = 0;
      if (minLength) strength += 25;
      if (uppercase) strength += 25;
      if (number) strength += 25;
      if (specialChar) strength += 25;
      setPasswordStrength(strength);

      // Verificar si la contraseña está comprometida
      if (nuevaContrasena) {
        const hash = sha1(nuevaContrasena).toString().toUpperCase();
        const prefix = hash.substring(0, 5);
        const suffix = hash.substring(5);

        try {
          const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
          const hashes = response.data.split('\n');
          const isPwned = hashes.some((line) => {
            const [hashSuffix, count] = line.split(':');
            return hashSuffix === suffix && parseInt(count) > 0;
          });
          setIsCompromised(isPwned);
        } catch (err) {
          console.error('Error al verificar contraseña comprometida:', err);
        }
      } else {
        setIsCompromised(false);
      }
    };

    validatePassword();
  }, [nuevaContrasena]);

  // Determinar si todos los requisitos están cumplidos
  const allRequirementsMet =
    requirements.minLength &&
    requirements.uppercase &&
    requirements.number &&
    requirements.specialChar &&
    !isCompromised;

  const handleCambioContrasena = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (nuevaContrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }
    if (passwordStrength < 100) {
      setError('La contraseña no cumple con todos los requisitos');
      setLoading(false);
      return;
    }
    if (isCompromised) {
      setError('Esta contraseña ha sido comprometida anteriormente. Usa otra.');
      setLoading(false);
      return;
    }

    try {
      await axios.post('https://backendcentro.onrender.com/api/recuperacionpreg/cambiar-contrasena', {
        identificador,
        nuevaContrasena
      });
      setSuccess('Contraseña actualizada con éxito');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Cambiar Contraseña
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box component="form" onSubmit={handleCambioContrasena}>
        <TextField
          fullWidth
          type={showPassword ? 'text' : 'password'} // Cambia el tipo según el estado
          label="Nueva contraseña"
          value={nuevaContrasena}
          onChange={(e) => setNuevaContrasena(e.target.value)}
          margin="normal"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        {/* Medidor de fuerza (siempre visible) */}
        <LinearProgress
          variant="determinate"
          value={passwordStrength}
          sx={{
            mt: 1,
            mb: 2,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              backgroundColor:
                passwordStrength < 50 ? 'red' : passwordStrength < 75 ? 'orange' : 'green'
            }
          }}
        />
        <Typography variant="body2" align="center" sx={{ mb: 2 }}>
          Fortaleza: {passwordStrength}%
        </Typography>

        {/* Lista de requisitos (solo visible si hay algo incumplido) */}
        {!allRequirementsMet && (
          <List dense>
            {!requirements.minLength && (
              <ListItem>
                <ListItemIcon>
                  <CancelIcon color="error" />
                </ListItemIcon>
                <ListItemText primary="Mínimo 8 caracteres" />
              </ListItem>
            )}
            {!requirements.uppercase && (
              <ListItem>
                <ListItemIcon>
                  <CancelIcon color="error" />
                </ListItemIcon>
                <ListItemText primary="Al menos una mayúscula" />
              </ListItem>
            )}
            {!requirements.number && (
              <ListItem>
                <ListItemIcon>
                  <CancelIcon color="error" />
                </ListItemIcon>
                <ListItemText primary="Al menos un número" />
              </ListItem>
            )}
            {!requirements.specialChar && (
              <ListItem>
                <ListItemIcon>
                  <CancelIcon color="error" />
                </ListItemIcon>
                <ListItemText primary="Al menos un carácter especial" />
              </ListItem>
            )}
            {isCompromised && (
              <ListItem>
                <ListItemIcon>
                  <CancelIcon color="error" />
                </ListItemIcon>
                <ListItemText primary="Contraseña comprometida" />
              </ListItem>
            )}
          </List>
        )}

        <TextField
          fullWidth
          type={showConfirmPassword ? 'text' : 'password'} // Cambia el tipo según el estado
          label="Confirmar contraseña"
          value={confirmarContrasena}
          onChange={(e) => setConfirmarContrasena(e.target.value)}
          margin="normal"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={handleClickShowConfirmPassword}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading || passwordStrength < 100 || isCompromised}
          sx={{ mt: 2, backgroundColor: '#00796b' }}
        >
          {loading ? <CircularProgress size={24} /> : 'Actualizar'}
        </Button>
      </Box>
    </Container>
  );
};

export default CambioPasswordP;