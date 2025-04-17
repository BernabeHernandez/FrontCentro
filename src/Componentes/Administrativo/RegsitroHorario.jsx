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
  FormControlLabel,
  Switch,
  InputAdornment,
  TablePagination,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory,
  AccessTime,
  Timelapse,
  CheckCircle,
  Build,
  Search,
} from "@mui/icons-material";

const RegistroHorario = () => {
  const [newHorario, setNewHorario] = useState({
    dia: "",
    hora_inicio: "",
    hora_fin: "",
    intervalo: 30,
    disponible: true,
  });
  const [horarios, setHorarios] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

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
      [name]: name === "disponible" ? e.target.checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (newHorario.intervalo % 30 !== 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "La duración debe ser un múltiplo de 30 minutos (30, 60, 90, 120, etc.).",
      });
      return;
    }

    try {
      const horarioData = {
        ...newHorario,
        disponible: newHorario.disponible ? 1 : 0,
      };

      if (editandoId) {
        await axios.put(`https://backendcentro.onrender.com/api/citasAdmin/horarios/${editandoId}`, horarioData);
        Swal.fire({
          icon: "success",
          title: "Horario actualizado",
          text: "El horario se actualizó correctamente.",
        });
      } else {
        await axios.post("https://backendcentro.onrender.com/api/citasAdmin/horarios", horarioData);
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
      disponible: parseInt(horario.disponible) === 1,
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
    setNewHorario({ dia: "", hora_inicio: "", hora_fin: "", intervalo: 30, disponible: true });
    setEditandoId(null);
    setModalAbierto(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredHorarios = horarios.filter((horario) =>
    horario.dia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold", color: "#424242" }}>
        Registro de Horarios
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <TextField
          fullWidth={isMobile}
          variant="outlined"
          placeholder="Buscar por día..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "#757575" }} />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400, borderRadius: 2 }}
        />
        <Button variant="contained" color="primary" onClick={() => setModalAbierto(true)}>
          Agregar Horario
        </Button>
      </Box>

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
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#424242" }}>
            {editandoId ? "Editar Horario" : "Registrar Horario"}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControl fullWidth>
              <InputLabel>Día</InputLabel>
              <Select name="dia" value={newHorario.dia} onChange={handleChange} required>
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
              variant="outlined"
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
              variant="outlined"
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
              variant="outlined"
            />
            <FormControlLabel
              control={<Switch checked={newHorario.disponible} onChange={handleChange} name="disponible" />}
              label="Disponible"
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                {editandoId ? "Actualizar" : "Registrar"}
              </Button>
              <Button type="button" variant="outlined" color="secondary" onClick={limpiarFormulario}>
                Cancelar
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      <TableContainer component={Paper} sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderRadius: "12px", overflow: "hidden" }}>
        <Table sx={{ "& .MuiTableCell-root": { padding: "6px 8px", fontSize: "0.875rem" } }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgba(189, 189, 189, 0.2)" }}>
              <TableCell sx={{ fontWeight: "bold", color: "#424242" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Inventory sx={{ mr: 1, color: "#0288d1", fontSize: "1.2rem" }} /> Día
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#424242" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <AccessTime sx={{ mr: 1, color: "#388e3c", fontSize: "1.2rem" }} /> Inicio
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#424242" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <AccessTime sx={{ mr: 1, color: "#f57c00", fontSize: "1.2rem" }} /> Fin
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#424242" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Timelapse sx={{ mr: 1, color: "#0288d1", fontSize: "1.2rem" }} /> Duración
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#424242" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CheckCircle sx={{ mr: 1, color: "#388e3c", fontSize: "1.2rem" }} /> Disponible
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#424242" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Build sx={{ mr: 1, color: "#7b1fa2", fontSize: "1.2rem" }} /> Acciones
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredHorarios.length > 0 ? (
              filteredHorarios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((horario) => (
                <TableRow key={horario.id_horario} sx={{ "&:hover": { backgroundColor: "#f5f5f5" }, height: "36px" }}>
                  <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{horario.dia}</TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{horario.hora_inicio}</TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{horario.hora_fin}</TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{horario.intervalo} min</TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>
                    {parseInt(horario.disponible) === 1 ? "Sí" : "No"}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Editar">
                        <IconButton color="warning" size="small" onClick={() => handleEdit(horario)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton color="error" size="small" onClick={() => handleDelete(horario.id_horario)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ borderBottom: "1px solid #e0e0e0", height: "36px" }}>
                  No hay horarios registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredHorarios.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ backgroundColor: "rgba(189, 189, 189, 0.1)", fontSize: "0.875rem", padding: "4px" }}
        />
      </TableContainer>
    </Box>
  );
};

export default RegistroHorario;