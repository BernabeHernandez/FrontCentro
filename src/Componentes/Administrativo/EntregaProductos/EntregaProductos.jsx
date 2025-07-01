"use client"

import { useEffect, useState } from "react"
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Chip,
  Avatar,
  Divider,
  Alert,
  Snackbar,
  Container,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import {
  LocalShipping,
  Person,
  Email,
  Phone,
  CheckCircle,
  Cancel,
  ShoppingCart,
  CalendarToday,
  Inventory,
  Search,
  FilterList,
} from "@mui/icons-material"
import axios from "axios"

const EntregaProductos = () => {
  const [ventas, setVentas] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  const [filtroTexto, setFiltroTexto] = useState("")
  const [tipoFiltro, setTipoFiltro] = useState("todos")

  useEffect(() => {
    cargarVentasPendientes()
  }, [])

  const cargarVentasPendientes = async () => {
    try {
      const response = await axios.get("https://backendcentro.onrender.com/api/entrega/ventas-pendientes")
      setVentas(response.data)
    } catch (error) {
      console.error("Error al cargar ventas pendientes:", error)
      setSnackbar({
        open: true,
        message: "Error al cargar las ventas pendientes",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const abrirConfirmacion = (ventaId) => {
    setVentaSeleccionada(ventaId)
    setDialogOpen(true)
  }

  const cerrarConfirmacion = () => {
    setDialogOpen(false)
    setVentaSeleccionada(null)
  }

  const confirmarEntrega = async () => {
    if (!ventaSeleccionada) return

    try {
      await axios.put(`https://backendcentro.onrender.com/api/entrega/marcar-entregado/${ventaSeleccionada}`)
      setSnackbar({
        open: true,
        message: "Venta marcada como entregada correctamente",
        severity: "success",
      })
      cargarVentasPendientes()
      cerrarConfirmacion()
    } catch (error) {
      console.error("Error al marcar entrega:", error)
      setSnackbar({
        open: true,
        message: "Error al marcar la venta como entregada",
        severity: "error",
      })
    }
  }

  const calcularTotal = (detalle) => {
    return detalle.reduce((total, item) => total + (Number(item.subtotal) || 0), 0)
  }

  const filtrarVentas = (ventas) => {
    if (!filtroTexto.trim()) return ventas

    return ventas.filter((venta) => {
      const nombreCompleto =
        `${venta.usuario.nombre} ${venta.usuario.apellidopa} ${venta.usuario.apellidoma}`.toLowerCase()
      const correo = venta.usuario.gmail.toLowerCase()
      const telefono = venta.usuario.telefono.toLowerCase()
      const textoBusqueda = filtroTexto.toLowerCase()

      switch (tipoFiltro) {
        case "nombre":
          return nombreCompleto.includes(textoBusqueda)
        case "correo":
          return correo.includes(textoBusqueda)
        case "telefono":
          return telefono.includes(textoBusqueda)
        case "todos":
        default:
          return (
            nombreCompleto.includes(textoBusqueda) || correo.includes(textoBusqueda) || telefono.includes(textoBusqueda)
          )
      }
    })
  }

  const cerrarSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Cargando ventas pendientes...
        </Typography>
      </Box>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4, px: 2 }}>
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold", color: "success.main" }}>
          <LocalShipping sx={{ mr: 2, fontSize: 40, verticalAlign: "middle" }} />
          Entrega de Productos
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Gestiona las ventas pendientes de entrega
        </Typography>
      </Box>

      {/* Sección de Filtros */}
      <Card sx={{ mb: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ color: "success.main", display: "flex", alignItems: "center" }}>
          <FilterList sx={{ mr: 1 }} />
          Filtros de Búsqueda
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Buscar..."
              variant="outlined"
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              placeholder="Ingresa nombre, correo o teléfono"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filtrar por</InputLabel>
              <Select value={tipoFiltro} label="Filtrar por" onChange={(e) => setTipoFiltro(e.target.value)}>
                <MenuItem value="todos">Todos los campos</MenuItem>
                <MenuItem value="nombre">Nombre del cliente</MenuItem>
                <MenuItem value="correo">Correo electrónico</MenuItem>
                <MenuItem value="telefono">Teléfono</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setFiltroTexto("")
                setTipoFiltro("todos")
              }}
              sx={{ height: "56px" }}
            >
              Limpiar
            </Button>
          </Grid>
        </Grid>
        {filtroTexto && (
          <Box sx={{ mt: 2 }}>
            <Chip
              label={`${filtrarVentas(ventas).length} resultado(s) encontrado(s)`}
              color="primary"
              variant="outlined"
            />
          </Box>
        )}
      </Card>

      {filtrarVentas(ventas).length === 0 ? (
        <Card sx={{ textAlign: "center", py: 6 }}>
          <CardContent>
            <Inventory sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              {filtroTexto ? "No se encontraron resultados" : "No hay ventas pendientes"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {filtroTexto
                ? "Intenta con otros términos de búsqueda o limpia los filtros."
                : "Todas las ventas han sido entregadas o no hay pedidos pendientes."}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filtrarVentas(ventas).map((venta) => (
            <Grid item xs={12} key={venta.venta_id}>
              <Card elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
                <Box sx={{ bgcolor: "grey.600", color: "white", p: 2 }}>
                  <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
                    <ShoppingCart sx={{ mr: 1 }} />
                    Venta #{venta.venta_id}
                    <Chip label="PENDIENTE" size="small" sx={{ ml: 2, bgcolor: "warning.main", color: "white" }} />
                  </Typography>
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <CalendarToday sx={{ mr: 1, fontSize: 16 }} />
                    {new Date(venta.fecha_venta).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Typography>
                </Box>

                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom sx={{ color: "success.main", mb: 2 }}>
                        Información del Cliente
                      </Typography>

                      <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                        <Avatar sx={{ bgcolor: "primary.main", mr: 2, width: 32, height: 32 }}>
                          <Person />
                        </Avatar>
                        <Typography variant="body1">
                          {venta.usuario.nombre} {venta.usuario.apellidopa} {venta.usuario.apellidoma}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                        <Avatar sx={{ bgcolor: "info.main", mr: 2, width: 32, height: 32 }}>
                          <Email />
                        </Avatar>
                        <Typography variant="body2" color="text.secondary">
                          {venta.usuario.gmail}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                        <Avatar sx={{ bgcolor: "success.main", mr: 2, width: 32, height: 32 }}>
                          <Phone />
                        </Avatar>
                        <Typography variant="body2" color="text.secondary">
                          {venta.usuario.telefono}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom sx={{ color: "success.main", mb: 2 }}>
                        Detalles del Pedido
                      </Typography>

                      <TableContainer component={Paper} elevation={1}>
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ bgcolor: "grey.100" }}>
                              <TableCell sx={{ fontWeight: "bold" }}>Producto</TableCell>
                              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                Cant.
                              </TableCell>
                              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                                Precio
                              </TableCell>
                              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                                Subtotal
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {venta.detalle.map((item, index) => (
                              <TableRow key={index} hover>
                                <TableCell>{item.nombre_producto}</TableCell>
                                <TableCell align="center">
                                  <Chip label={item.cantidad} size="small" color="primary" variant="outlined" />
                                </TableCell>
                                <TableCell align="right">${Number(item.precio || 0).toFixed(2)}</TableCell>
                                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                                  ${Number(item.subtotal || 0).toFixed(2)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>

                      <Box sx={{ mt: 2, p: 2, bgcolor: "success.50", borderRadius: 1 }}>
                        <Typography variant="h6" align="right" sx={{ color: "success.main" }}>
                          Total: ${calcularTotal(venta.detalle).toFixed(2)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <Box sx={{ textAlign: "center" }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<CheckCircle />}
                      onClick={() => abrirConfirmacion(venta.venta_id)}
                      sx={{
                        bgcolor: "success.main",
                        "&:hover": { bgcolor: "success.dark" },
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                      }}
                    >
                      Marcar como Entregado
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog de Confirmación */}
      <Dialog open={dialogOpen} onClose={cerrarConfirmacion} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
          <CheckCircle sx={{ fontSize: 48, color: "success.main", mb: 1 }} />
          <Typography variant="h5" component="div">
            Confirmar Entrega
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: "center", fontSize: "1.1rem" }}>
            ¿Estás seguro de que deseas marcar esta venta como entregada?
            <br />
            <strong>Esta acción no se puede deshacer.</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3, gap: 2 }}>
          <Button onClick={cerrarConfirmacion} variant="outlined" startIcon={<Cancel />} sx={{ px: 3 }}>
            Cancelar
          </Button>
          <Button
            onClick={confirmarEntrega}
            variant="contained"
            startIcon={<CheckCircle />}
            sx={{
              bgcolor: "success.main",
              "&:hover": { bgcolor: "success.dark" },
              px: 3,
            }}
          >
            Confirmar Entrega
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={cerrarSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={cerrarSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default EntregaProductos
