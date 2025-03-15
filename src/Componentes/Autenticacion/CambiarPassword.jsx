import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import zxcvbn from "zxcvbn";
import sha1 from "js-sha1";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  InputAdornment,
  LinearProgress,
  ThemeProvider,
  createTheme,
} from "@mui/material";

const MySwal = withReactContent(Swal);

// Tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: "#00796b", // Verde principal
    },
    secondary: {
      main: "#757575", // Gris oscuro
    },
    background: {
      default: "#ffffff", // Fondo blanco
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function CambiarPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordError, setPasswordError] = useState("");
  const [passwordHistoryError, setPasswordHistoryError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state;

  useEffect(() => {
    MySwal.fire({
      icon: "info",
      title: "Aviso importante",
      text: "Las contraseñas anteriormente utilizadas no se pueden volver a utilizar, ni la actual. Se requiere un cambio de contraseña.",
    });
  }, []);

  const validatePasswordStrength = (password) => {
    const strength = zxcvbn(password);
    setPasswordStrength(strength.score);
    validateCommonPatterns(password);
  };

  const validateCommonPatterns = (password) => {
    const minLength = 8;
    const commonPatterns = ["12345", "password", "qwerty", "abcdef"];
    let errorMessage = "";

    if (password.length < minLength) {
      errorMessage = `La contraseña debe tener al menos ${minLength} caracteres.`;
    }

    for (const pattern of commonPatterns) {
      if (password.includes(pattern)) {
        errorMessage = "Evita usar secuencias comunes como '12345' o 'password'.";
        break;
      }
    }

    setPasswordError(errorMessage);
  };

  const checkPasswordHistory = async (password) => {
    try {
      const response = await axios.post("https://backendcentro.onrender.com/api/cambio/check-password-history", {
        email,
        password,
      });

      if (response.data.success === false) {
        console.log("Contraseña ya utilizada. Mostrando alerta.");
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: "La contraseña ya se utilizó anteriormente. Prueba con otra.",
        });
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error al verificar el historial de contraseñas:", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "La contraseña ya se utilizó anteriormente. Prueba con otra.",
      });
      return false;
    }
  };

  const checkPasswordCompromised = async (password) => {
    const hash = sha1(password);
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);

    try {
      const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
      return response.data.includes(suffix.toUpperCase());
    } catch (error) {
      console.error("Error al verificar la contraseña en HIBP:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden. Por favor, verifica e intenta nuevamente.",
      });
      return;
    }

    if (newPassword.length < 6 || newPassword.length > 15) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "La contraseña debe tener entre 6 y 15 caracteres.",
      });
      return;
    }

    if (passwordError) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: passwordError,
      });
      return;
    }

    const isCompromised = await checkPasswordCompromised(newPassword);
    if (isCompromised) {
      MySwal.fire({
        icon: "error",
        title: "Contraseña comprometida",
        text: "Esta contraseña ha sido filtrada en brechas de datos. Por favor, elige otra.",
      });
      return;
    }

    const isPasswordValid = await checkPasswordHistory(newPassword);
    if (!isPasswordValid) {
      return;
    }

    try {
      const response = await axios.post("https://backendcentro.onrender.com/api/cambio/reset-password", {
        email,
        newPassword,
      });

      if (response.data.success) {
        MySwal.fire({
          icon: "success",
          title: "Contraseña cambiada",
          text: "Tu contraseña ha sido actualizada correctamente.",
        });
        navigate("/login");
      } else {
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: "La contraseña ya se está utilizando actualmente. Prueba con otra.",
        });
      }
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "La contraseña ya se está utilizando actualmente. Prueba con otra.",
      });
    }
  };

  const getPasswordStrengthText = (strength) => {
    switch (strength) {
      case 0:
      case 1:
        return "Débil";
      case 2:
        return "Media";
      case 3:
        return "Fuerte";
      case 4:
        return "Muy Fuerte";
      default:
        return "";
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === "new") {
      setShowNewPassword(!showNewPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(70vh - 64px)", // Ajusta el espacio para el encabezado y pie de página
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Card
          elevation={6}
          sx={{
            width: "100%",
            padding: 4,
            borderRadius: 2,
            textAlign: "center",
            backgroundColor: "#ffffff",
          }}
        >
          <CardContent>
            <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: "bold", color: theme.palette.primary.main }}>
              Cambiar Contraseña
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
              <TextField
                fullWidth
                label="Nueva Contraseña"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  validatePasswordStrength(e.target.value);
                }}
                margin="normal"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => togglePasswordVisibility("new")} edge="end">
                        <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {passwordStrength > 0 && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(passwordStrength / 4) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#e0f2f1",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor:
                          passwordStrength < 2
                            ? "#f44336" // Rojo para contraseña débil
                            : passwordStrength < 3
                            ? "#ff9800" // Naranja para contraseña media
                            : "#4caf50", // Verde para contraseña fuerte
                      },
                    }}
                  />
                  <Typography variant="body2" sx={{ mt: 1, color: theme.palette.secondary.main }}>
                    Fuerza de la contraseña: {getPasswordStrengthText(passwordStrength)}
                  </Typography>
                </Box>
              )}
              <TextField
                fullWidth
                label="Confirmar Nueva Contraseña"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="normal"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => togglePasswordVisibility("confirm")} edge="end">
                        <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {passwordHistoryError && (
                <Typography variant="body2" sx={{ color: "red", mt: 2 }}>
                  {passwordHistoryError}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: theme.palette.primary.main,
                  "&:hover": { backgroundColor: "#004d40" },
                  padding: "12px",
                  fontWeight: "bold",
                }}
              >
                Cambiar Contraseña
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
}

export default CambiarPassword;