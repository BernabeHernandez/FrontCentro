import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
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

function VerificarCorreo() {
  const [verificationCode, setVerificationCode] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!verificationCode) {
      MySwal.fire({
        icon: "error",
        title: "Código requerido",
        text: "Por favor introduce el código de verificación.",
      });
      return;
    }

    try {
      const response = await axios.get(`https://backendcentro.onrender.com/api/registro/verify/${verificationCode}`);
      MySwal.fire({
        icon: "success",
        title: "Verificación exitosa",
        text: response.data.message,
      });
      navigate("/login");
    } catch (error) {
      console.error("Error al verificar el código:", error.response || error);
      MySwal.fire({
        icon: "error",
        title: "Error de verificación",
        text: error.response?.data?.error || "Ocurrió un error al verificar el código.",
      });
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
              Verificar Código
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
              <TextField
                fullWidth
                label="Código de Verificación"
                name="verificationCode"
                value={verificationCode}
                onChange={handleChange}
                margin="normal"
                required
                inputProps={{ maxLength: 6 }}
                InputProps={{
                  inputProps: {
                    pattern: "[0-9]*", // Solo permite números
                  },
                }}
              />
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
                Verificar
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
}

export default VerificarCorreo;