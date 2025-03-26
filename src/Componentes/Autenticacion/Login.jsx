import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuth } from "./AuthContext";
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Fade,
  Avatar,
  InputAdornment,
  IconButton,
  Grid,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { LockOutlined, Visibility, VisibilityOff, Login as LoginIcon, ArrowForward } from "@mui/icons-material";
import imageForBlackBackground6 from "../Imagenes/confident-doctor-posing-2273895-removebg-preview.png"; // Imagen importada

const MySwal = withReactContent(Swal);

// Tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: "#0288d1", // Azul neón
    },
    secondary: {
      main: "#0277bd", // Azul oscuro
    },
    background: {
      default: "#e0e0e0", // Fondo gris claro
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif', // Tipografía bonita para el título
      fontWeight: 700,
    },
    h6: {
      fontFamily: '"Lora", "Roboto", "Helvetica", "Arial", sans-serif', // Tipografía elegante para la descripción
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body1: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  },
});

const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 400,
  padding: theme.spacing(3),
  borderRadius: 8,
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  background: "#ffffff", // Fondo blanco puro como MongoDB Atlas
  border: "none",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 8,
    backgroundColor: "#fff",
    "& fieldset": {
      borderColor: theme.palette.grey[300],
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
  "& .MuiInputLabel-root": {
    color: theme.palette.grey[600],
  },
  "& .MuiInputBase-input": {
    color: theme.palette.text.primary,
  },
}));

const InfoBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  background: "transparent", // Fondo transparente para integrarse con el fondo oscuro
  maxWidth: 600,
  display: "flex",
  flexDirection: "row", // Texto e imagen lado a lado
  alignItems: "center",
  gap: theme.spacing(3),
}));

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeLeft, setLockTimeLeft] = useState(0);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isLocked && lockTimeLeft > 0) {
      const timer = setInterval(() => {
        setLockTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
    if (lockTimeLeft === 0) setIsLocked(false);
  }, [isLocked, lockTimeLeft]);

  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLocked) {
      MySwal.fire({
        icon: "error",
        title: "Cuenta Bloqueada",
        text: "Tu cuenta está bloqueada temporalmente. Espera un momento para intentar de nuevo.",
      });
      return;
    }

    if (!captchaToken) {
      MySwal.fire({
        icon: "warning",
        title: "CAPTCHA Requerido",
        text: "Por favor, completa el CAPTCHA para continuar.",
      });
      return;
    }

    try {
      const response = await axios.post("https://backendcentro.onrender.com/api/login", {
        user: username,
        password: password,
        captchaToken,
      });

      const { tipo, qrCodeUrl, message, id_usuario } = response.data;

      if (qrCodeUrl) {
        navigate("/codigo-mfa", {
          state: {
            qrCodeUrl,
            user: username,
            tipo,
            id: id_usuario,
          },
        });
        return;
      }

      localStorage.setItem("usuario", username);
      localStorage.setItem("usuario_id", id_usuario);

      login({ user: username, id: id_usuario, tipo });

      navigate("/citas");
    } catch (error) {
      if (error.response) {
        const { lockTimeLeft, attemptsLeft, error: serverError } = error.response.data;

        if (serverError === "Usuario no encontrado") {
          MySwal.fire({
            icon: "error",
            title: "Usuario No Encontrado",
            text: "El usuario ingresado no existe.",
          });
          MySwal.fire({
            icon: "info",
            title: "Intentos restantes: 0",
          });
        } else if (
          serverError ===
          "La cuenta no está verificada. Por favor, revisa tu correo para activar tu cuenta."
        ) {
          MySwal.fire({
            icon: "warning",
            title: "Cuenta No Verificada",
            text: serverError,
          });
        } else if (
          serverError ===
          "Tu cuenta está permanentemente bloqueada. Por favor, contacta con el administrador."
        ) {
          MySwal.fire({
            icon: "error",
            title: "Cuenta Bloqueada Permanentemente",
            text: serverError,
          });
        } else if (lockTimeLeft) {
          setIsLocked(true);
          setLockTimeLeft(lockTimeLeft);
        } else {
          const attempts = attemptsLeft || 0;
          MySwal.fire({
            icon: "error",
            title: "Usuario o Contraseña Incorrecta",
            text: `Intentos restantes: ${attempts}`,
          });
        }
      } else {
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: "Error al iniciar sesión. Inténtalo de nuevo más tarde.",
        });
      }
    }
  };

  const handleNavigate = () => {
    navigate("/about"); // Redirige a la ruta "/about"
  };

  const formatLockTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Fade in={true} timeout={700}>
        <Box
          sx={{
            minHeight: "100vh",
            background: "#1a2525", // Fondo oscuro como MongoDB Atlas
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 4,
          }}
        >
          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
            <Grid container spacing={4} alignItems="center" justifyContent="center">
              {/* Formulario de Login */}
              <Grid item xs={12} md={6}>
                <StyledCard elevation={0}>
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Avatar
                      sx={{
                        margin: "auto",
                        bgcolor: "primary.main",
                        width: 60,
                        height: 60,
                      }}
                    >
                      <LockOutlined fontSize="large" />
                    </Avatar>
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      color="primary.main"
                      sx={{ mt: 2 }}
                    >
                      Iniciar Sesión
                    </Typography>
                  </Box>

                  <CardContent>
                    <Box component="form" onSubmit={handleSubmit}>
                      <StyledTextField
                        fullWidth
                        label="Usuario"
                        type="text"
                        variant="outlined"
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        autoComplete="username"
                      />
                      <StyledTextField
                        fullWidth
                        label="Contraseña"
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                        <ReCAPTCHA
                          sitekey="6LexEPMqAAAAAMbw4d8KeEwxa4kwlFWV6m2midhT"
                          onChange={onCaptchaChange}
                        />
                      </Box>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        startIcon={<LoginIcon />}
                        sx={{
                          mt: 3,
                          mb: 2,
                          borderRadius: 20,
                          py: 1.5,
                          textTransform: "none",
                          fontWeight: "bold",
                          "&:hover": {
                            bgcolor: "primary.dark",
                          },
                        }}
                        disabled={isLocked}
                      >
                        Iniciar Sesión
                      </Button>
                      <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
                        <Grid item>
                          <Typography variant="body2">
                            <Link
                              to="/opcionrestaurarpassw"
                              style={{ color: theme.palette.primary.main, textDecoration: "none" }}
                            >
                              ¿Olvidaste la contraseña?
                            </Link>
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="body2">
                            <Link
                              to="/registro"
                              style={{ color: theme.palette.primary.main, textDecoration: "none" }}
                            >
                              Regístrate
                            </Link>
                          </Typography>
                        </Grid>
                      </Grid>
                      {isLocked && (
                        <Typography
                          variant="body2"
                          sx={{ color: "error.main", mt: 2, textAlign: "center" }}
                        >
                          Tiempo restante para desbloquear: {formatLockTime(lockTimeLeft)}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </StyledCard>
              </Grid>

              {/* Sección de información como MongoDB Atlas */}
              <Grid item xs={12} md={6}>
                <InfoBox>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h3"
                      color="#ffffff" // Blanco como en MongoDB Atlas
                      gutterBottom
                    >
                      Centro de Rehabilitación Integral San Juan
                    </Typography>
                    <Typography
                      variant="h6"
                      color="#e0e0e0" // Gris claro para el texto
                      paragraph
                    >
                      Gestiona tus citas y accede a servicios especializados para tu recuperación física y mental, todo desde un solo lugar.
                    </Typography>
                    <Typography
                      variant="body1"
                      color="primary.main"
                      onClick={handleNavigate}
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        cursor: "pointer",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Conoce más sobre nosotros <ArrowForward sx={{ ml: 1, fontSize: 16 }} />
                    </Typography>
                  </Box>
                  <Box
                    component="img"
                    src={imageForBlackBackground6}
                    alt="Centro de Rehabilitación Integral San Juan"
                    sx={{
                      width: 300, // Imagen más grande
                      height: 500,
                      objectFit: "cover",
                      borderRadius: 8,
                      flexShrink: 0,
                    }}
                  />
                </InfoBox>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Fade>
    </ThemeProvider>
  );
}

export default Login;