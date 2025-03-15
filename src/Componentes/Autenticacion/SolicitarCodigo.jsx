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

function SolicitarCodigo() {
  const [gmail, setGmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://backendcentro.onrender.com/api/codigo/forgot-password", { gmail });
      MySwal.fire({
        title: "Código enviado",
        text: "Por favor revisa tu correo electrónico para obtener el código de recuperación.",
        icon: "success",
      });
      navigate("/validar_codigo", { state: { email: gmail } });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        MySwal.fire({
          title: "Correo no registrado",
          text: "El correo electrónico proporcionado no está registrado en nuestro sistema.",
          icon: "error",
        });
      } else {
        MySwal.fire({
          title: "Error",
          text: "No se pudo enviar el correo de recuperación.",
          icon: "error",
        });
      }
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
              Verificación de Correo
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
              <TextField
                fullWidth
                label="Correo Electrónico"
                type="email"
                placeholder="Introduce tu correo electrónico"
                value={gmail}
                onChange={(e) => setGmail(e.target.value)}
                margin="normal"
                required
                InputProps={{
                  inputProps: {
                    style: { textAlign: "center" }, // Centrar el texto del input
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
                  padding: "12px",
                  fontWeight: "bold",
                }}
              >
                Solicitar Código
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
}

export default SolicitarCodigo;