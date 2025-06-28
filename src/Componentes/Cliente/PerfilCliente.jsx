import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  Chip,
  Divider,
  Paper,
  TextField,
  Button,
  Fade,
  CircularProgress,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  AccessTime as ClockIcon,
  CheckCircle as CheckCircleIcon,
  Warning as AlertCircleIcon,
  Edit,
  Save,
  Cancel,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  border: "none",
  backgroundColor: "white",
}));

const HeaderCard = styled(Card)(({ theme }) => ({
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  border: "none",
  backgroundColor: "white",
  overflow: "visible",
}));

const HeaderBackground = styled(Box)({
  backgroundColor: "white",
  height: "128px",
  borderBottom: "1px solid #f3f4f6",
});

const ProfileAvatar = styled(Avatar)({
  width: "128px",
  height: "128px",
  border: "4px solid white",
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  background: "linear-gradient(135deg, #4b5563 0%, #1f2937 100%)",
  fontSize: "24px",
  fontWeight: "bold",
});

const PendingCitaCard = styled(Paper)(({ theme }) => ({
  border: "1px solid #fcd34d",
  borderRadius: "12px",
  padding: "24px",
  background: "linear-gradient(90deg, #fffbeb 0%, #fefce8 100%)",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
}));

const CompletedCitaCard = styled(Paper)(({ theme }) => ({
  border: "1px solid #6ee7b7",
  borderRadius: "12px",
  padding: "24px",
  background: "linear-gradient(90deg, #ecfdf5 0%, #f0fdf4 100%)",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
}));

const ObservationBox = styled(Box)({
  backgroundColor: "white",
  padding: "16px",
  borderRadius: "8px",
  border: "1px solid #f3f4f6",
  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  fontStyle: "italic",
});

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
  const [citasPendientes, setCitasPendientes] = useState([]);
  const [citasCompletadas, setCitasCompletadas] = useState([]);
  const navigate = useNavigate();

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

    axios
      .get(`https://backendcentro.onrender.com/api/citascompletaspendientes/pendientes/${usuarioId}`)
      .then((res) => setCitasPendientes(res.data))
      .catch((err) => console.error("Error al cargar citas pendientes", err));

    axios
      .get(`https://backendcentro.onrender.com/api/citascompletaspendientes/completadas/${usuarioId}`)
      .then((res) => setCitasCompletadas(res.data))
      .catch((err) => console.error("Error al cargar citas completadas", err));
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
          .then(() => {
            setEditable(false);
            Swal.fire("¡Éxito!", "Los datos del perfil se actualizaron correctamente.", "success");
          })
          .catch((error) => {
            console.error("Error al actualizar el perfil:", error);
            Swal.fire("Error", "Hubo un error al actualizar el perfil.", "error");
          });
      }
    });
  };

  const cancelarCita = (citaId) => {
    Swal.fire({
      title: "¿Cancelar esta cita?",
      text: "Esta acción no se puede deshacer. No se realizará reembolso. Para más información, consulta Atención al cliente en el Centro de Rehabilitación Integral SanJuan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(`http://localhost:3302/api/citascompletaspendientes/cancelar/${citaId}`)
          .then(() => {
            Swal.fire("Cancelada", "Tu cita ha sido cancelada.", "success");
            setCitasPendientes((prev) => prev.filter((c) => c.id !== citaId));
          })
          .catch((err) => {
            console.error("Error al cancelar la cita", err);
            Swal.fire("Error", "No se pudo cancelar la cita.", "error");
          });
      }
    });
  };

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name) => {
    const parts = name.split(" ").filter(part => part.length > 0);
    if (parts.length === 0) return "";
    return parts[0][0] + (parts[1] ? parts[1][0] : "");
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
      <Container maxWidth="lg" sx={{ p: 3, display: "flex", flexDirection: "column", gap: 4 }}>
        {/* Header del Perfil */}
        <HeaderCard>
          <HeaderBackground />
          <CardContent sx={{ position: "relative", pt: 0, pb: 3 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "center", sm: "flex-end" },
                gap: { xs: 2, sm: 3 },
                mt: -8,
              }}
            >
              <ProfileAvatar>{getInitials(`${perfil.nombre} ${perfil.apellidopa}`)}</ProfileAvatar>
              <Box sx={{ textAlign: { xs: "center", sm: "left" }, flex: 1 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", color: "#111827", mb: 1 }}>
                  {perfil.nombre} {perfil.apellidopa} {perfil.apellidoma}
                </Typography>
                <Typography variant="body1" sx={{ color: "#6b7280", mb: 2 }}>
                  Cliente activo
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </HeaderCard>

        {/* Información Personal */}
        <StyledCard>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <PersonIcon sx={{ width: 20, height: 20 }} />
              <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
                Información Personal
              </Typography>
            </Box>
            {!editable ? (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <PersonIcon sx={{ width: 20, height: 20, color: "#6366f1" }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: "#6b7280" }}>
                        Usuario
                      </Typography>
                      <Typography variant="h6" sx={{ color: "#111827" }}>
                        {perfil.user}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <EmailIcon sx={{ width: 20, height: 20, color: "#ef4444" }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: "#6b7280" }}>
                        Correo electrónico
                      </Typography>
                      <Typography variant="h6" sx={{ color: "#111827" }}>
                        {perfil.gmail}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <PhoneIcon sx={{ width: 20, height: 20, color: "#22c55e" }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: "#6b7280" }}>
                        Teléfono
                      </Typography>
                      <Typography variant="h6" sx={{ color: "#111827" }}>
                        {perfil.telefono}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            ) : (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      label="Nombre"
                      name="nombre"
                      value={perfil.nombre}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      label="Apellido Paterno"
                      name="apellidopa"
                      value={perfil.apellidopa}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      label="Apellido Materno"
                      name="apellidoma"
                      value={perfil.apellidoma}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      label="Correo Electrónico"
                      name="gmail"
                      type="email"
                      value={perfil.gmail}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      label="Usuario"
                      name="user"
                      value={perfil.user}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      label="Teléfono"
                      name="telefono"
                      type="tel"
                      value={perfil.telefono}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      startIcon={<Save />}
                      sx={{ borderRadius: 20, px: 4, textTransform: "none" }}
                    >
                      Guardar Cambios
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Cancel />}
                      onClick={() => setEditable(false)}
                      sx={{ borderRadius: 20, px: 4, textTransform: "none", ml: 2 }}
                    >
                      Cancelar
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
            {!editable && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Edit />}
                  onClick={() => setEditable(true)}
                  sx={{ borderRadius: 20, px: 4, textTransform: "none" }}
                >
                  Editar Perfil
                </Button>
              </Box>
            )}
          </CardContent>
        </StyledCard>

        {/* Citas Pendientes */}
        <StyledCard>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <AlertCircleIcon sx={{ width: 20, height: 20, color: "#f59e0b" }} />
              <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
                Citas Pendientes
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#6b7280", mb: 2 }}>
              Próximas citas programadas
            </Typography>
            {citasPendientes.length === 0 ? (
              <Typography variant="body1" sx={{ color: "#6b7280", textAlign: "center", py: 4 }}>
                No tienes citas pendientes.
              </Typography>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {citasPendientes.map((cita) => (
                  <PendingCitaCard key={cita.id} elevation={0}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "flex-start", sm: "center" },
                        justifyContent: "space-between",
                        gap: 2,
                      }}
                    >
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: "#111827" }}>
                            {cita.servicio}
                          </Typography>
                          <Chip
                            label={cita.estado}
                            variant="outlined"
                            sx={{
                              backgroundColor: "#fef3c7",
                              color: "#92400e",
                              borderColor: "#fcd34d",
                              px: 1.5,
                              py: 0.5,
                            }}
                          />
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <CalendarIcon sx={{ width: 16, height: 16, color: "#6b7280" }} />
                            <Typography variant="body2" sx={{ color: "#6b7280", textTransform: "capitalize" }}>
                              {formatearFecha(cita.fecha_cita)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <ClockIcon sx={{ width: 16, height: 16, color: "#6b7280" }} />
                            <Typography variant="body2" sx={{ color: "#6b7280" }}>
                              {cita.hora_inicio} - {cita.hora_fin}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => cancelarCita(cita.id)}
                      >
                        Cancelar cita
                      </Button>
                    </Box>
                  </PendingCitaCard>
                ))}
              </Box>
            )}
          </CardContent>
        </StyledCard>

        {/* Citas Completadas */}
        <StyledCard>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <CheckCircleIcon sx={{ width: 20, height: 20, color: "#22c55e" }} />
              <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
                Citas Completadas
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#6b7280", mb: 2 }}>
              Historial de citas realizadas
            </Typography>
            {citasCompletadas.length === 0 ? (
              <Typography variant="body1" sx={{ color: "#6b7280", textAlign: "center", py: 4 }}>
                Aún no tienes citas completadas.
              </Typography>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {citasCompletadas.map((cita) => (
                  <CompletedCitaCard key={cita.id} elevation={0}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: { xs: "flex-start", sm: "center" },
                          justifyContent: "space-between",
                          gap: 1,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: "#111827" }}>
                            {cita.servicio}
                          </Typography>
                          <Chip
                            label="completada"
                            variant="outlined"
                            sx={{
                              backgroundColor: "#d1fae5",
                              color: "#065f46",
                              borderColor: "#6ee7b7",
                              px: 1.5,
                              py: 0.5,
                            }}
                          />
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <CalendarIcon sx={{ width: 16, height: 16, color: "#6b7280" }} />
                          <Typography variant="body2" sx={{ color: "#6b7280", textTransform: "capitalize" }}>
                            {formatearFecha(cita.fecha_cita)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <ClockIcon sx={{ width: 16, height: 16, color: "#6b7280" }} />
                          <Typography variant="body2" sx={{ color: "#6b7280" }}>
                            {cita.hora_inicio} - {cita.hora_fin}
                          </Typography>
                        </Box>
                      </Box>
                      {cita.observaciones && (
                        <>
                          <Divider sx={{ my: 1 }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: "#374151", mb: 0.5 }}>
                              Observaciones:
                            </Typography>
                            <ObservationBox>
                              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                                {cita.observaciones}
                              </Typography>
                            </ObservationBox>
                          </Box>
                        </>
                      )}
                    </Box>
                  </CompletedCitaCard>
                ))}
              </Box>
            )}
          </CardContent>
        </StyledCard>

        {/* Botón de Facturación */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ReceiptIcon />}
            onClick={() => navigate(`/cliente/facturacion/${usuarioId}`)}
            sx={{ borderRadius: 20, px: 4, textTransform: "none" }}
          >
            Ver Facturación
          </Button>
        </Box>
      </Container>
    </Fade>
  );
};

export default PerfilCliente;