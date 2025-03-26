import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Fade,
  CircularProgress,
  Grid,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Person,
  Email,
  Phone,
  Badge,
  Edit,
  Save,
  Cancel,
} from "@mui/icons-material";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  background: "linear-gradient(145deg, #ffffff 0%, #f5f7fa 100%)",
  border: "1px solid #e0e4e8",
}));

const StyledField = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  borderRadius: 8,
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.grey[100],
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 8,
    backgroundColor: "#fff",
    "& fieldset": {
      borderColor: theme.palette.grey[300],
    },
    "&:hover fieldset": {
      borderColor: theme.palette.grey[500],
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const PerfilCliente = () => {
  const usuarioId = localStorage.getItem("usuario_id");
  const [perfil, setPerfil] = useState({
    nombre: "",
    apellidopa: "",
    apellidoma: "",
    gmail: "",
    user: "",
    telefono: "",
  });
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!usuarioId) {
      console.error("No se encontró el ID del usuario en localStorage");
      setLoading(false);
      return;
    }

    axios
      .get(`https://backendcentro.onrender.com/api/perfilcliente/${usuarioId}`)
      .then((response) => {
        setPerfil(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener el perfil:", error);
        setLoading(false);
      });
  }, [usuarioId]);

  const handleChange = (e) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!usuarioId) {
      Swal.fire("Error", "No se encontró el ID del usuario", "error");
      return;
    }

    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres guardar los cambios realizados?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "No, cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(`https://backendcentro.onrender.com/api/perfilcliente/${usuarioId}`, perfil)
          .then((response) => {
            setEditable(false);
            Swal.fire({
              title: "¡Éxito!",
              text: "Los datos del perfil se actualizaron correctamente.",
              icon: "success",
              confirmButtonText: "Aceptar",
            });
          })
          .catch((error) => {
            console.error("Error al actualizar el perfil:", error);
            Swal.fire({
              title: "Error",
              text: "Hubo un error al actualizar el perfil. Por favor, inténtalo de nuevo.",
              icon: "error",
              confirmButtonText: "Aceptar",
            });
          });
      }
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={700}>
      <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh", py: 6 }}>
        <Container maxWidth="md">
          <StyledPaper elevation={0}>
            <Typography
              variant="h4"
              fontWeight="bold"
              color="primary.main"
              textAlign="center"
              gutterBottom
            >
              Mi Perfil
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
              sx={{ mb: 4 }}
            >
              {perfil.nombre} {perfil.apellidopa} {perfil.apellidoma}
            </Typography>

            {!editable ? (
              <Box>
                <StyledField>
                  <Person sx={{ color: "#3498db", fontSize: 28 }} />
                  <Typography variant="body1" fontWeight="bold">
                    Nombre completo:
                  </Typography>
                  <Typography variant="body1">
                    {perfil.nombre} {perfil.apellidopa} {perfil.apellidoma}
                  </Typography>
                </StyledField>
                <StyledField>
                  <Email sx={{ color: "#1abc9c", fontSize: 28 }} />
                  <Typography variant="body1" fontWeight="bold">
                    Correo electrónico:
                  </Typography>
                  <Typography variant="body1">{perfil.gmail}</Typography>
                </StyledField>
                <StyledField>
                  <Badge sx={{ color: "#f39c12", fontSize: 28 }} />
                  <Typography variant="body1" fontWeight="bold">
                    Usuario:
                  </Typography>
                  <Typography variant="body1">{perfil.user}</Typography>
                </StyledField>
                <StyledField>
                  <Phone sx={{ color: "#e74c3c", fontSize: 28 }} />
                  <Typography variant="body1" fontWeight="bold">
                    Teléfono:
                  </Typography>
                  <Typography variant="body1">{perfil.telefono}</Typography>
                </StyledField>
              </Box>
            ) : (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <StyledField>
                      <Person sx={{ color: "#3498db", fontSize: 28 }} />
                      <StyledTextField
                        fullWidth
                        label="Nombre"
                        name="nombre"
                        value={perfil.nombre}
                        onChange={handleChange}
                        required
                      />
                    </StyledField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledField>
                      <Person sx={{ color: "#e67e22", fontSize: 28 }} />
                      <StyledTextField
                        fullWidth
                        label="Apellido Paterno"
                        name="apellidopa"
                        value={perfil.apellidopa}
                        onChange={handleChange}
                        required
                      />
                    </StyledField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledField>
                      <Person sx={{ color: "#9b59b6", fontSize: 28 }} />
                      <StyledTextField
                        fullWidth
                        label="Apellido Materno"
                        name="apellidoma"
                        value={perfil.apellidoma}
                        onChange={handleChange}
                        required
                      />
                    </StyledField>
                  </Grid>
                  <Grid item xs={12}>
                    <StyledField>
                      <Email sx={{ color: "#1abc9c", fontSize: 28 }} />
                      <StyledTextField
                        fullWidth
                        label="Correo Electrónico"
                        name="gmail"
                        type="email"
                        value={perfil.gmail}
                        onChange={handleChange}
                        required
                      />
                    </StyledField>
                  </Grid>
                  <Grid item xs={12}>
                    <StyledField>
                      <Badge sx={{ color: "#f39c12", fontSize: 28 }} />
                      <StyledTextField
                        fullWidth
                        label="Usuario"
                        name="user"
                        value={perfil.user}
                        onChange={handleChange}
                        required
                      />
                    </StyledField>
                  </Grid>
                  <Grid item xs={12}>
                    <StyledField>
                      <Phone sx={{ color: "#e74c3c", fontSize: 28 }} />
                      <StyledTextField
                        fullWidth
                        label="Teléfono"
                        name="telefono"
                        type="tel"
                        value={perfil.telefono}
                        onChange={handleChange}
                        required
                      />
                    </StyledField>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  startIcon={<Save />}
                  sx={{ mt: 3, borderRadius: 20, px: 4, textTransform: "none" }}
                >
                  Guardar Cambios
                </Button>
              </form>
            )}

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
              {!editable ? (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Edit />}
                  onClick={() => setEditable(true)}
                  sx={{ borderRadius: 20, px: 4, textTransform: "none" }}
                >
                  Editar Perfil
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Cancel />}
                  onClick={() => setEditable(false)}
                  sx={{ borderRadius: 20, px: 4, textTransform: "none" }}
                >
                  Cancelar
                </Button>
              )}
            </Box>
          </StyledPaper>
        </Container>
      </Box>
    </Fade>
  );
};

export default PerfilCliente;