import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
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

function ValidarCodigo() {
  const [codigo, setCodigo] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://backendcentro.onrender.com/api/codigo/validar_codigo", { email, codigo });

      if (response.data.success) {
        MySwal.fire({
          icon: "success",
          title: "Código verificado",
          text: "El código es correcto. Puedes cambiar tu contraseña.",
        });

        navigate("/cambiar_password", { state: { email } });
      }
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Código incorrecto",
        text: "El código ingresado es incorrecto. Intenta nuevamente.",
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
                label="Código de 6 dígitos"
                type="text"
                placeholder="Introduce el código de 6 dígitos"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
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
                  padding: "12px",
                  fontWeight: "bold",
                }}
              >
                Validar Código
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
}

export default ValidarCodigo;