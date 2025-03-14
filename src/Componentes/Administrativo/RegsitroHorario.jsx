import { useState, useEffect } from "react";
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

const RegistroHorario = () => {
  const [newHorario, setNewHorario] = useState({
    dia: "",
    hora_inicio: "",
    hora_fin: "",
    intervalo: 30,
  });

  const [horarios, setHorarios] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchHorarios();
  }, []);

  const fetchHorarios = async () => {
    try {
      const response = await axios.get("https://backendcentro.onrender.com/api/citasAdmin/horarios");
      setHorarios(response.data);
    } catch (error) {
      setMensaje("Error al obtener horarios.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewHorario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    // Validación de intervalo
    if (newHorario.intervalo % 30 !== 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "La duración debe ser un múltiplo de 30 minutos (30, 60, 90, 120, etc.).",
      });
      return;
    }

    try {
      if (editandoId) {
        await axios.put(`https://backendcentro.onrender.com/api/citasAdmin/horarios/${editandoId}`, newHorario);
        Swal.fire({
          icon: "success",
          title: "Horario actualizado",
          text: "El horario se actualizó correctamente.",
        });
      } else {
        await axios.post("https://backendcentro.onrender.com/api/citasAdmin/horarios", newHorario);
        Swal.fire({
          icon: "success",
          title: "Horario registrado",
          text: "El horario se registró correctamente.",
        });
      }

      fetchHorarios();
      limpiarFormulario();
      setModalAbierto(false);
    } catch (error) {
      console.error("Error al registrar o actualizar el horario:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al procesar el horario.",
      });
    }
  };

  const handleEdit = (horario) => {
    setNewHorario({
      dia: horario.dia,
      hora_inicio: horario.hora_inicio,
      hora_fin: horario.hora_fin,
      intervalo: horario.intervalo,
    });
    setEditandoId(horario.id_horario);
    setModalAbierto(true);
  };

  const handleDelete = async (id) => {
    if (!id) {
      setMensaje("No se puede eliminar el horario, ID no válido.");
      return;
    }

    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
    });

    if (!confirmacion.isConfirmed) return;

    try {
      await axios.delete(`https://backendcentro.onrender.com/api/citasAdmin/horarios/${id}`);
      Swal.fire({
        icon: "success",
        title: "Horario eliminado",
        text: "El horario fue eliminado correctamente.",
      });
      setHorarios((prevHorarios) => prevHorarios.filter((horario) => horario.id_horario !== id));
    } catch (error) {
      console.error("Error al eliminar el horario:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al eliminar el horario.",
      });
    }
  };

  const limpiarFormulario = () => {
    setNewHorario({ dia: "", hora_inicio: "", hora_fin: "", intervalo: 30 });
    setEditandoId(null);
    setModalAbierto(false);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Registro de Horarios
      </Typography>

      {/* Botón para abrir el modal de registro */}
      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setModalAbierto(true)}
        >
          Agregar Horario
        </Button>
      </Box>

      {/* Modal para agregar o editar horario */}
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
            {editandoId ? "Editar Horario" : "Registrar Horario"}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControl fullWidth>
              <InputLabel>Día</InputLabel>
              <Select
                name="dia"
                value={newHorario.dia}
                onChange={handleChange}
                required
              >
                <MenuItem value="">Seleccione un día</MenuItem>
                {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((dia) => (
                  <MenuItem key={dia} value={dia}>{dia}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Hora Inicio"
              type="time"
              name="hora_inicio"
              value={newHorario.hora_inicio}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Hora Fin"
              type="time"
              name="hora_fin"
              value={newHorario.hora_fin}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Duración (minutos)"
              type="number"
              name="intervalo"
              value={newHorario.intervalo}
              onChange={handleChange}
              required
              fullWidth
              inputProps={{ min: 10 }}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                {editandoId ? "Actualizar" : "Registrar"}
              </Button>
              <Button
                type="button"
                variant="contained"
                color="secondary"
                onClick={limpiarFormulario}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Tabla de Horarios */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Día</TableCell>
              <TableCell>Inicio</TableCell>
              <TableCell>Fin</TableCell>
              <TableCell>Duración</TableCell>
              <TableCell>Disponible</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {horarios.length > 0 ? (
              horarios.map((horario) => (
                <TableRow key={horario.id_horario}>
                  <TableCell>{horario.dia}</TableCell>
                  <TableCell>{horario.hora_inicio}</TableCell>
                  <TableCell>{horario.hora_fin}</TableCell>
                  <TableCell>{horario.intervalo} min</TableCell>
                  <TableCell>{parseInt(horario.disponible) === 1 ? "Sí" : "No"}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Editar">
                        <IconButton
                          color="warning"
                          onClick={() => handleEdit(horario)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(horario.id_horario)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay horarios registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RegistroHorario;