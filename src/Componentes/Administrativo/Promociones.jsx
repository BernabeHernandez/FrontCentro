import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Modal,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

const Promociones = () => {
  const [promociones, setPromociones] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [descuento, setDescuento] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estado, setEstado] = useState("activa");
  const [idServicio, setIdServicio] = useState("");
  const [idPromocion, setIdPromocion] = useState("");
  const [serviciosConPromocion, setServiciosConPromocion] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [promocionEditando, setPromocionEditando] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const promocionesResponse = await axios.get("https://backendcentro.onrender.com/api/promociones/listar");
      setPromociones(promocionesResponse.data);

      const serviciosResponse = await axios.get("https://backendcentro.onrender.com/api/promociones/servicios/listar");
      setServicios(serviciosResponse.data);

      const serviciosConPromocionResponse = await axios.get("https://backendcentro.onrender.com/api/promociones/servicios/con-promocion");
      setServiciosConPromocion(serviciosConPromocionResponse.data);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      Swal.fire("Error", "Error al cargar datos", "error");
    }
  };

  const crearPromocion = async () => {
    if (!titulo || !descripcion || descuento === "" || isNaN(descuento) || descuento <= 0 || !fechaInicio || !fechaFin || !estado) {
      Swal.fire("Error", "Todos los campos deben ser llenados correctamente", "warning");
      return;
    }

    const nuevaPromocion = {
      titulo,
      descripcion,
      descuento,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      estado,
    };

    try {
      await axios.post("https://backendcentro.onrender.com/api/promociones/crear", nuevaPromocion);
      Swal.fire("Éxito", "Promoción creada con éxito", "success");
      resetForm();
      cargarDatos();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error al crear la promoción", "error");
    }
  };

  const asignarServicio = async () => {
    if (!idPromocion || !idServicio) {
      Swal.fire("Error", "Por favor seleccione una promoción y un servicio", "warning");
      return;
    }

    const servicioData = {
      id_promocion: idPromocion,
      id_servicio: idServicio,
    };

    try {
      await axios.post("https://backendcentro.onrender.com/api/promociones/asignar-servicio", servicioData);
      Swal.fire("Éxito", "Servicio asignado con éxito", "success");
      setIdServicio("");
      setIdPromocion("");
      cargarDatos();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error al asignar servicio", "error");
    }
  };

  const actualizarPromocion = async () => {
    if (!titulo || !descripcion || descuento === "" || isNaN(descuento) || descuento <= 0 || !fechaInicio || !fechaFin || !estado) {
      Swal.fire("Error", "Todos los campos deben ser llenados correctamente", "warning");
      return;
    }

    const promocionActualizada = {
      titulo,
      descripcion,
      descuento: descuento || 0,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      estado,
    };

    try {
      await axios.put(`https://backendcentro.onrender.com/api/promociones/actualizar/${promocionEditando.id_promocion}`, promocionActualizada);
      Swal.fire("Éxito", "Promoción actualizada con éxito", "success");
      resetForm();
      cargarDatos();
      setModoEdicion(false);
      setModalAbierto(false);
    } catch (error) {
      console.error("Error al actualizar la promoción:", error);
      Swal.fire("Error", "Error al actualizar la promoción", "error");
    }
  };

  const eliminarPromocion = async (id) => {
    try {
      await axios.delete(`https://backendcentro.onrender.com/api/promociones/eliminar/${id}`);
      Swal.fire("Éxito", "Promoción eliminada con éxito", "success");
      cargarDatos();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error al eliminar la promoción", "error");
    }
  };

  const actualizarPromocionServicio = async (id_servicio, id_promocion_nueva) => {
    if (!id_promocion_nueva) {
      Swal.fire("Error", "Selecciona una promoción para asignar", "warning");
      return;
    }

    try {
      await axios.put("https://backendcentro.onrender.com/api/promociones/servicios/actualizar-promocion", {
        id_servicio,
        id_promocion_nueva,
      });
      Swal.fire("Éxito", "Promoción del servicio actualizada correctamente", "success");
      cargarDatos();
    } catch (error) {
      console.error("Error al actualizar la promoción del servicio:", error);
      Swal.fire("Error", "Error al actualizar la promoción del servicio", "error");
    }
  };

  const quitarPromocionServicio = async (id_servicio) => {
    try {
      await axios.delete(`https://backendcentro.onrender.com/api/promociones/servicios/quitar-promocion/${id_servicio}`);
      Swal.fire("Éxito", "Promoción quitada del servicio correctamente", "success");
      cargarDatos();
    } catch (error) {
      console.error("Error al quitar la promoción del servicio:", error);
      Swal.fire("Error", "Error al quitar la promoción del servicio", "error");
    }
  };

  const resetForm = () => {
    setTitulo("");
    setDescripcion("");
    setDescuento("");
    setFechaInicio("");
    setFechaFin("");
    setEstado("activa");
    setModoEdicion(false);
    setPromocionEditando(null);
    setModalAbierto(false);
  };

  const cargarPromocionParaEditar = (promocion) => {
    setTitulo(promocion.titulo);
    setDescripcion(promocion.descripcion);
    setDescuento(promocion.descuento);
    setFechaInicio(promocion.fecha_inicio);
    setFechaFin(promocion.fecha_fin);
    setEstado(promocion.estado);
    setModoEdicion(true);
    setPromocionEditando(promocion);
    setModalAbierto(true);
  };

  const calcularPrecioConDescuento = (precio, descuento) => {
    const descuentoNumerico = parseFloat(descuento);
    if (isNaN(descuentoNumerico) || descuentoNumerico < 0) {
      console.error("Descuento no válido", descuento);
      return precio;
    }

    const precioNumerico = parseFloat(precio);
    if (isNaN(precioNumerico)) {
      console.error("Precio no válido", precio);
      return precio;
    }

    const precioConDescuento = precioNumerico * (1 - descuentoNumerico / 100);
    return precioConDescuento.toFixed(2);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Administrar Promociones
      </Typography>

      {/* Botón para abrir el modal de registro */}
      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setModalAbierto(true)}
        >
          Agregar Promoción
        </Button>
      </Box>

      {/* Modal para agregar o editar promoción */}
      <Modal open={modalAbierto} onClose={() => setModalAbierto(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "90%" : 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            {modoEdicion ? "Editar Promoción" : "Crear Promoción"}
          </Typography>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Descuento (%)"
              type="number"
              value={descuento}
              onChange={(e) => setDescuento(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Fecha Inicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Fecha Fin"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                required
              >
                <MenuItem value="activa">Activa</MenuItem>
                <MenuItem value="inactiva">Inactiva</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={modoEdicion ? actualizarPromocion : crearPromocion}
              >
                {modoEdicion ? "Actualizar" : "Crear"}
              </Button>
              <Button
                type="button"
                variant="contained"
                color="secondary"
                onClick={resetForm}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Asignar servicio a una promoción */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h6" gutterBottom>
          Asignar Servicio a Promoción
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <FormControl fullWidth>
            <InputLabel>Promoción</InputLabel>
            <Select
              value={idPromocion}
              onChange={(e) => setIdPromocion(e.target.value)}
              required
            >
              <MenuItem value="">Seleccione una Promoción</MenuItem>
              {promociones.map((promo) => (
                <MenuItem key={promo.id_promocion} value={promo.id_promocion}>
                  {promo.titulo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Servicio</InputLabel>
            <Select
              value={idServicio}
              onChange={(e) => setIdServicio(e.target.value)}
              required
            >
              <MenuItem value="">Seleccione un Servicio</MenuItem>
              {servicios.map((servicio) => (
                <MenuItem key={servicio.id} value={servicio.id}>
                  {servicio.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={asignarServicio}
          >
            Asignar Servicio
          </Button>
        </Box>
      </Box>

      {/* Listar promociones */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h6" gutterBottom>
          Promociones Actuales
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Título</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Descuento (%)</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {promociones.map((promo) => (
                <TableRow key={promo.id_promocion}>
                  <TableCell>{promo.titulo}</TableCell>
                  <TableCell>{promo.descripcion}</TableCell>
                  <TableCell>{promo.descuento}</TableCell>
                  <TableCell>{promo.estado}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Editar">
                        <IconButton
                          color="warning"
                          onClick={() => cargarPromocionParaEditar(promo)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          color="error"
                          onClick={() => eliminarPromocion(promo.id_promocion)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Listar Servicios con Promoción */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Servicios con Promoción
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Servicio</TableCell>
                <TableCell>Promoción</TableCell>
                <TableCell>Precio Original</TableCell>
                <TableCell>Precio con Descuento</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {serviciosConPromocion.map((servicioPromo) => {
                const precioConDescuento = calcularPrecioConDescuento(servicioPromo.precio, servicioPromo.descuento);
                return (
                  <TableRow key={servicioPromo.id}>
                    <TableCell>{servicioPromo.nombre}</TableCell>
                    <TableCell>{servicioPromo.descripcion}</TableCell>
                    <TableCell>{servicioPromo.precio} $</TableCell>
                    <TableCell>{precioConDescuento} $</TableCell>
                    <TableCell>
                      <FormControl fullWidth>
                        <Select
                          value={servicioPromo.id_promocion || ""}
                          onChange={(e) => actualizarPromocionServicio(servicioPromo.id, e.target.value)}
                        >
                          <MenuItem value="">Seleccione una Promoción</MenuItem>
                          {promociones.map((promo) => (
                            <MenuItem key={promo.id_promocion} value={promo.id_promocion}>
                              {promo.titulo}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => quitarPromocionServicio(servicioPromo.id)}
                        sx={{ marginTop: 1 }}
                      >
                        Quitar Promoción
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Promociones;