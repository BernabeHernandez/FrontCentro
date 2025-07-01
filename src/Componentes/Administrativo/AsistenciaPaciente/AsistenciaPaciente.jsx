"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import dayjs from "dayjs"
import "dayjs/locale/es"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Container,
  Grid,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material"
import {
  CheckCircle,
  Schedule,
  Person,
  MedicalServices,
  CalendarToday,
  Refresh,
  AccessTime,
  LocalHospital,
  PersonPin,
} from "@mui/icons-material"
import { styled } from "@mui/material/styles"

// Configurar dayjs en español
dayjs.locale("es")

// Styled components personalizados con tema verde
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
  },
}))

const DateButton = styled(Button)(({ theme, selected }) => ({
  minWidth: 120,
  height: 60,
  borderRadius: 12,
  textTransform: "none",
  fontWeight: selected ? 600 : 400,
  transition: "all 0.2s ease-in-out",
  ...(selected
    ? {
        background: "linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)",
        color: "white",
        boxShadow: "0 4px 15px rgba(46, 125, 50, 0.4)",
        "&:hover": {
          background: "linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)",
          transform: "translateY(-1px)",
        },
      }
    : {
        backgroundColor: "white",
        color: "#2e7d32",
        border: "2px solid #81c784",
        "&:hover": {
          backgroundColor: "#e8f5e8",
          color: "#1b5e20",
          transform: "translateY(-1px)",
        },
      }),
}))

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  "& .MuiTableHead-root": {
    backgroundColor: "#616161", // Header gris
    "& .MuiTableCell-head": {
      color: "white",
      fontWeight: 500,
      fontSize: "0.9rem",
      padding: "12px 16px",
    },
    // Evitar hover effect en el header
    "& .MuiTableRow-root:hover": {
      backgroundColor: "#616161 !important", // Mantener el color gris siempre
    },
  },
  "& .MuiTableBody-root": {
    "& .MuiTableRow-root:nth-of-type(even)": {
      backgroundColor: "#f1f8e9",
    },
    "& .MuiTableRow-root:hover": {
      backgroundColor: "#e8f5e8",
      transition: "background-color 0.2s ease",
    },
  },
}))

const AsistenciaPaciente = () => {
  const [fechas, setFechas] = useState([])
  const [fechaSeleccionada, setFechaSeleccionada] = useState("")
  const [citas, setCitas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [confirmDialog, setConfirmDialog] = useState({ open: false, citaId: null, pacienteNombre: "" })

  useEffect(() => {
    generarProximos7Dias()
  }, [])

  useEffect(() => {
    if (fechaSeleccionada) {
      cargarCitasPorFecha(fechaSeleccionada)
    }
  }, [fechaSeleccionada])

  const generarProximos7Dias = () => {
    const hoy = dayjs()
    const dias = []
    for (let i = 0; i < 7; i++) {
      const fecha = hoy.add(i, "day").format("YYYY-MM-DD")
      dias.push(fecha)
    }
    setFechas(dias)
    setFechaSeleccionada(hoy.format("YYYY-MM-DD"))
  }

  const cargarCitasPorFecha = async (fecha) => {
    setLoading(true)
    setError("")
    try {
      const response = await axios.get(`https://backendcentro.onrender.com/api/asistencia/citas-por-fecha/${fecha}`)
      setCitas(response.data)
    } catch (error) {
      console.error("Error al cargar citas por fecha:", error)
      setError("Error al cargar las citas. Por favor, intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const abrirConfirmacion = (id, nombrePaciente) => {
    setConfirmDialog({ open: true, citaId: id, pacienteNombre: nombrePaciente })
  }

  const marcarAsistencia = async () => {
    try {
      await axios.put(`https://backendcentro.onrender.com/api/asistencia/marcar-asistencia/${confirmDialog.citaId}`)
      setSuccess("Asistencia marcada correctamente")
      cargarCitasPorFecha(fechaSeleccionada)
      setConfirmDialog({ open: false, citaId: null, pacienteNombre: "" })
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      console.error("Error al marcar asistencia:", error)
      setError("Hubo un error al marcar la asistencia")
      setConfirmDialog({ open: false, citaId: null, pacienteNombre: "" })
      setTimeout(() => setError(""), 3000)
    }
  }

  const cerrarConfirmacion = () => {
    setConfirmDialog({ open: false, citaId: null, pacienteNombre: "" })
  }

  const getEstadoChip = (estado) => {
    const config = {
      pendiente: {
        color: "warning",
        icon: <Schedule fontSize="small" sx={{ color: "#ff9800" }} />,
        label: "Pendiente",
        bgColor: "#fff3e0",
      },
      completada: {
        color: "success",
        icon: <CheckCircle fontSize="small" sx={{ color: "#4caf50" }} />,
        label: "Completada",
        bgColor: "#e8f5e8",
      },
      cancelada: {
        color: "error",
        icon: null,
        label: "Cancelada",
        bgColor: "#ffebee",
      },
    }

    const { color, icon, label } = config[estado] || { color: "default", icon: null, label: estado }

    return <Chip icon={icon} label={label} color={color} size="small" variant="filled" />
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <StyledCard>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
            <Box display="flex" alignItems="center" gap={2}>
              <CalendarToday sx={{ fontSize: 32, color: "#2e7d32" }} />
              <Typography variant="h4" component="h1" fontWeight={700} sx={{ color: "#2e7d32" }}>
                Control de Asistencia
              </Typography>
            </Box>
            <Tooltip title="Actualizar">
              <IconButton
                onClick={() => cargarCitasPorFecha(fechaSeleccionada)}
                sx={{
                  backgroundColor: "#4caf50",
                  color: "white",
                  "&:hover": { backgroundColor: "#2e7d32" },
                }}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>

          <Divider sx={{ mb: 4, borderColor: "#81c784" }} />

          {/* Selector de fechas */}
          <Box mb={4}>
            <Typography variant="h6" gutterBottom sx={{ color: "#424242", mb: 2 }}>
              Selecciona una fecha
            </Typography>
            <Grid container spacing={2}>
              {fechas.map((fecha) => (
                <Grid item key={fecha}>
                  <DateButton
                    selected={fecha === fechaSeleccionada}
                    onClick={() => setFechaSeleccionada(fecha)}
                    startIcon={<CalendarToday sx={{ color: fecha === fechaSeleccionada ? "white" : "#2e7d32" }} />}
                  >
                    <Box textAlign="center">
                      <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                        {dayjs(fecha).format("dddd")}
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {dayjs(fecha).format("DD/MM")}
                      </Typography>
                    </Box>
                  </DateButton>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Alertas */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccess("")}>
              {success}
            </Alert>
          )}

          {/* Título de la sección */}
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <MedicalServices sx={{ color: "#4caf50" }} />
            <Typography variant="h5" fontWeight={600} sx={{ color: "#2e7d32" }}>
              Citas del {dayjs(fechaSeleccionada).format("DD [de] MMMM [de] YYYY")}
            </Typography>
          </Box>

          {/* Contenido principal */}
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={8}>
              <Box textAlign="center">
                <CircularProgress size={60} thickness={4} sx={{ color: "#4caf50" }} />
                <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                  Cargando citas...
                </Typography>
              </Box>
            </Box>
          ) : citas.length === 0 ? (
            <Box textAlign="center" py={8}>
              <CalendarToday sx={{ fontSize: 80, color: "#81c784", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No hay citas programadas
              </Typography>
              <Typography variant="body1" color="text.disabled">
                No se encontraron citas para esta fecha.
              </Typography>
            </Box>
          ) : (
            <StyledTableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <PersonPin fontSize="small" sx={{ color: "#ff5722" }} />
                        Paciente
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <AccessTime fontSize="small" sx={{ color: "#ff9800" }} />
                        Horario
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <LocalHospital fontSize="small" sx={{ color: "#2196f3" }} />
                        Servicio
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                        <Schedule fontSize="small" sx={{ color: "#9c27b0" }} />
                        Estado
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                        <CheckCircle fontSize="small" sx={{ color: "#4caf50" }} />
                        Acción
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {citas.map((cita) => (
                    <TableRow key={cita.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Person sx={{ color: "#ff5722", fontSize: 20 }} />
                          <Typography variant="body1" fontWeight={500}>
                            {cita.nombre_paciente}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <AccessTime sx={{ color: "#ff9800", fontSize: 18 }} />
                          <Typography variant="body2" color="text.secondary">
                            {cita.hora_inicio} - {cita.hora_fin}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LocalHospital sx={{ color: "#2196f3", fontSize: 18 }} />
                          <Typography variant="body2" color="text.secondary">
                            {cita.nombre_servicio}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">{getEstadoChip(cita.estado)}</TableCell>
                      <TableCell align="center">
                        {cita.estado === "pendiente" ? (
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<CheckCircle />}
                            onClick={() => abrirConfirmacion(cita.id, cita.nombre_paciente)}
                            sx={{
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: 600,
                              px: 3,
                              backgroundColor: "#4caf50",
                              "&:hover": {
                                backgroundColor: "#2e7d32",
                                transform: "translateY(-1px)",
                                boxShadow: "0 4px 15px rgba(76, 175, 80, 0.4)",
                              },
                            }}
                          >
                            Marcar Asistencia
                          </Button>
                        ) : (
                          <Typography variant="body2" color="text.disabled" fontStyle="italic">
                            Completada
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>
          )}
          {/* Dialog de confirmación */}
          <Dialog
            open={confirmDialog.open}
            onClose={cerrarConfirmacion}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{
              sx: {
                borderRadius: 3,
                minWidth: 400,
              },
            }}
          >
            <DialogTitle
              id="alert-dialog-title"
              sx={{
                color: "#2e7d32",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CheckCircle sx={{ color: "#4caf50" }} />
              Confirmar Asistencia
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description" sx={{ fontSize: "1.1rem" }}>
                ¿Estás seguro de que deseas marcar la asistencia para{" "}
                <strong style={{ color: "#2e7d32" }}>{confirmDialog.pacienteNombre}</strong>?
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 1 }}>
              <Button
                onClick={cerrarConfirmacion}
                variant="outlined"
                sx={{
                  color: "#757575",
                  borderColor: "#bdbdbd",
                  "&:hover": {
                    borderColor: "#757575",
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={marcarAsistencia}
                variant="contained"
                startIcon={<CheckCircle />}
                sx={{
                  backgroundColor: "#4caf50",
                  "&:hover": {
                    backgroundColor: "#2e7d32",
                  },
                }}
                autoFocus
              >
                Confirmar Asistencia
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </StyledCard>
    </Container>
  )
}

export default AsistenciaPaciente
