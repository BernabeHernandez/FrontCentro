import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import zxcvbn from "zxcvbn";
import sha1 from "js-sha1";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faPhone, faSignInAlt, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
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

function FormularioRegistro() {
  const navigate = useNavigate();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [passwordError, setPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    tipo: "Cliente",
    correo: "",
    datos_cliente: {
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      telefono: "",
    },
  });

  useEffect(() => {}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "password") {
      const strength = zxcvbn(value);
      setPasswordStrength(strength.score);
      validatePassword(value);
    }

    if (name.startsWith("datos_cliente.")) {
      const fieldName = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        datos_cliente: {
          ...prevData.datos_cliente,
          [fieldName]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errors = { ...formErrors };

    if (name === "datos_cliente.nombre" || name === "datos_cliente.apellidoPaterno" || name === "datos_cliente.apellidoMaterno") {
      const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{4,16}$/;
      if (!nameRegex.test(value)) {
        errors[name] = "Debe contener solo letras entre 4 a 16 caracteres.";
      } else {
        delete errors[name];
      }
    }

    if (name === "datos_cliente.telefono") {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(value)) {
        errors[name] = "Debe contener exactamente 10 dígitos.";
      } else {
        delete errors[name];
      }
    }

    if (name === "username") {
      const usernameRegex = /^[a-zA-Z0-9]{4,10}$/;
      if (!usernameRegex.test(value)) {
        errors[name] = "Debe contener entre 4 y 10 caracteres alfanuméricos.";
      } else {
        delete errors[name];
      }
    }

    if (name === "password") {
      const passwordRegex = /^.{8,15}$/;
      if (!passwordRegex.test(value)) {
        errors[name] = "Debe tener entre 8 a 15 caracteres.";
      } else {
        delete errors[name];
      }
    }

    setFormErrors(errors);
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const commonPatterns = ["12345", "password", "qwerty", "abcdef"];
    let errorMessage = "";

    if (password.length < minLength) {
      errorMessage = `La contraseña debe tener al menos ${minLength} caracteres.`;
    }

    for (const pattern of commonPatterns) {
      if (password.includes(pattern)) {
        errorMessage = "Evita usar secuencias comunes como '12345' o 'password'.";
        MySwal.fire({
          icon: "error",
          title: "Contraseña no válida",
          text: errorMessage,
        });
        break;
      }
    }

    setPasswordError(errorMessage);
  };

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const checkPasswordCompromised = async (password) => {
    const hash = sha1(password);
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);

    try {
      const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
      const compromised = response.data.includes(suffix.toUpperCase());
      return compromised;
    } catch (error) {
      console.error("Error al verificar la contraseña en HIBP:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValidForm = Object.keys(formErrors).length === 0;

    if (!isValidForm || passwordError) {
      MySwal.fire({
        icon: "error",
        title: "Errores en el formulario",
        text: passwordError || "Por favor, corrige los errores antes de continuar.",
      });
      return;
    }

    const isCompromised = await checkPasswordCompromised(formData.password);
    if (isCompromised) {
      MySwal.fire({
        icon: "error",
        title: "Contraseña comprometida",
        text: "Esta contraseña ha sido filtrada en brechas de datos. Por favor, elige otra.",
      });
      return;
    }

    const formDataWithPassword = {
      nombre: formData.datos_cliente.nombre,
      apellidopa: formData.datos_cliente.apellidoPaterno,
      apellidoma: formData.datos_cliente.apellidoMaterno,
      gmail: formData.correo,
      user: formData.username,
      telefono: formData.datos_cliente.telefono,
      password: formData.password,
      tipo: formData.tipo,
    };

    try {
      await axios.post("https://backendcentro.onrender.com/api/registro", formDataWithPassword);
      MySwal.fire({
        title: "Tu registro se realizó correctamente",
        text: "Por favor revisa tu correo para verificar tu cuenta.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      navigate("/verificar-correo");
    } catch (error) {
      console.error("Error al registrar el usuario:", error);

      if (error.response && error.response.data.error) {
        MySwal.fire({
          icon: "error",
          title: "ERROR.",
          text: error.response.data.error,
        });
      } else {
        navigate("/error400");
      }
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

  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="sm" // Cambiado a "sm" para que sea más pequeño
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "90vh",
          paddingTop: "80px", // Espacio para el encabezado
          paddingBottom: "80px", // Espacio para el pie de página
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
              <FontAwesomeIcon icon={faUser} style={{ marginRight: "10px" }} />
              Registro
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
              <TextField
                fullWidth
                label="Nombre"
                name="datos_cliente.nombre"
                value={formData.datos_cliente.nombre}
                onChange={handleChange}
                margin="normal"
                required
                error={!!formErrors["datos_cliente.nombre"]}
                helperText={formErrors["datos_cliente.nombre"]}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faUser} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Apellido Paterno"
                name="datos_cliente.apellidoPaterno"
                value={formData.datos_cliente.apellidoPaterno}
                onChange={handleChange}
                margin="normal"
                required
                error={!!formErrors["datos_cliente.apellidoPaterno"]}
                helperText={formErrors["datos_cliente.apellidoPaterno"]}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faUser} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Apellido Materno"
                name="datos_cliente.apellidoMaterno"
                value={formData.datos_cliente.apellidoMaterno}
                onChange={handleChange}
                margin="normal"
                required
                error={!!formErrors["datos_cliente.apellidoMaterno"]}
                helperText={formErrors["datos_cliente.apellidoMaterno"]}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faUser} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Teléfono"
                name="datos_cliente.telefono"
                value={formData.datos_cliente.telefono}
                onChange={handleChange}
                margin="normal"
                required
                inputProps={{ maxLength: 10 }}
                error={!!formErrors["datos_cliente.telefono"]}
                helperText={formErrors["datos_cliente.telefono"]}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faPhone} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Correo"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                margin="normal"
                required
                type="email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Usuario"
                name="username"
                value={formData.username}
                onChange={handleChange}
                margin="normal"
                required
                error={!!formErrors.username}
                helperText={formErrors.username}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faUser} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Contraseña"
                name="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
                type={passwordVisible ? "text" : "password"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faLock} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handlePasswordVisibility} edge="end">
                        <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={!!formErrors.password}
                helperText={formErrors.password}
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: theme.palette.primary.main,
                  "&:hover": { backgroundColor: "#004d40" },
                  padding: "10px",
                  fontWeight: "bold",
                }}
              >
                <FontAwesomeIcon icon={faSignInAlt} style={{ marginRight: "10px" }} />
                Registrar
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
}

export default FormularioRegistro;