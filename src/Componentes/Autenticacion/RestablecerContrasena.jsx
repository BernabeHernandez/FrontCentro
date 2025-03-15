import React, { useState } from "react";
import axios from "axios";
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

function RestablecerContrasena() {
  const [formData, setFormData] = useState({
    gmail: "",
    resetCode: "",
    newPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://backendcentro.onrender.com/api/cambio/reset-password", formData);
      MySwal.fire({
        title: "Contraseña restablecida",
        text: "Tu contraseña ha sido cambiada correctamente.",
        icon: "success",
      });
    } catch (error) {
      MySwal.fire({
        title: "Error",
        text: "Hubo un problema al restablecer tu contraseña.",
        icon: "error",
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
          minHeight: "calc(100vh - 64px)", // Ajusta el espacio para el encabezado y pie de página
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
              Restablecer Contraseña
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
              <TextField
                fullWidth
                label="Correo electrónico"
                type="email"
                value={formData.gmail}
                onChange={(e) => setFormData({ ...formData, gmail: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Código de recuperación"
                type="text"
                value={formData.resetCode}
                onChange={(e) => setFormData({ ...formData, resetCode: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Nueva contraseña"
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                margin="normal"
                required
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
                Restablecer Contraseña
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
}

export default RestablecerContrasena;