import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  TextField,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const AsignarRutina = () => {
  const BASE_URL = "https://backendcentro.onrender.com";

  const [usuarios, setUsuarios] = useState([]);
  const [categorias] = useState([
    { id: 1, nombre: "Cervical" },
    { id: 2, nombre: "Lumbar" },
    { id: 3, nombre: "General" },
  ]);
  const [rutinas, setRutinas] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [selectedRutina, setSelectedRutina] = useState("");
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Cargar usuarios
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/usuarios`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error al cargar usuarios: ${response.status} ${errorText}`);
        }
        const data = await response.json();
        setUsuarios(data);
      } catch (err) {
        console.error("Error fetching usuarios:", err.message);
        setError("Error al cargar la lista de usuarios");
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  // Cargar rutinas por categoría
  useEffect(() => {
    const fetchRutinas = async () => {
      if (selectedCategoria) {
        try {
          setLoading(true);
          const response = await fetch(`${BASE_URL}/api/rutinas/categoria/${selectedCategoria}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al cargar rutinas: ${response.status} ${errorText}`);
          }
          const data = await response.json();
          setRutinas(data);
        } catch (err) {
          console.error("Error fetching rutinas:", err.message);
          setError("Error al cargar las rutinas");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchRutinas();
  }, [selectedCategoria]);

  // Asignar rutina al usuario
  const handleAsignar = async () => {
    if (!selectedUsuario || !selectedRutina || !fechaInicio || !fechaFin) {
      setError("Por favor, selecciona usuario, rutina, fecha de inicio y fecha de fin.");
      setSuccess(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(`${BASE_URL}/api/asignaciones_rutinas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: Number(selectedUsuario),
          id_rutina: Number(selectedRutina),
          estado: "pendiente",
          fecha_inicio: dayjs(fechaInicio).format("YYYY-MM-DD"),
          fecha_fin: dayjs(fechaFin).format("YYYY-MM-DD"),
          progreso_actual: 0,
          duracion_total: 0,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al asignar rutina: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      setSuccess(`Rutina asignada correctamente. ID de asignación: ${data.id}`);

      // Limpiar selecciones
      setSelectedCategoria("");
      setSelectedRutina("");
      setRutinas([]);
      setFechaInicio(null);
      setFechaFin(null);
    } catch (err) {
      console.error("Error assigning rutina:", err.message);
      setError("Error al asignar la rutina");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ bgcolor: "white", p: 4, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h5" component="h1" align="center" gutterBottom>
            Asignar Rutina a Usuario
          </Typography>

          {loading && (
            <Box display="flex" justifyContent="center" my={2}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {/* Seleccionar Usuario */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Usuario</InputLabel>
            <Select
              value={selectedUsuario}
              onChange={(e) => setSelectedUsuario(e.target.value)}
              label="Usuario"
              disabled={loading}
            >
              <MenuItem value="">
                <em>Selecciona un usuario</em>
              </MenuItem>
              {usuarios.map((usuario) => (
                <MenuItem key={usuario.id} value={usuario.id}>
                  {usuario.nombre_completo} ({usuario.user})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Seleccionar Categoría */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={selectedCategoria}
              onChange={(e) => {
                setSelectedCategoria(e.target.value);
                setSelectedRutina("");
                setRutinas([]);
              }}
              label="Categoría"
              disabled={loading}
            >
              <MenuItem value="">
                <em>Selecciona una categoría</em>
              </MenuItem>
              {categorias.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Seleccionar Rutina */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Rutina</InputLabel>
            <Select
              value={selectedRutina}
              onChange={(e) => setSelectedRutina(e.target.value)}
              label="Rutina"
              disabled={loading || !selectedCategoria}
            >
              <MenuItem value="">
                <em>Selecciona una rutina</em>
              </MenuItem>
              {rutinas.map((rutina) => (
                <MenuItem key={rutina.id_rutina} value={rutina.id_rutina}>
                  {rutina.titulo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Seleccionar Fecha Inicio */}
          <DatePicker
            label="Fecha de inicio"
            value={fechaInicio}
            onChange={(newValue) => setFechaInicio(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 3 }} />}
          />

          {/* Seleccionar Fecha Fin */}
          <DatePicker
            label="Fecha de fin"
            value={fechaFin}
            onChange={(newValue) => setFechaFin(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 3 }} />}
          />

          {/* Botón de Asignar */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAsignar}
            disabled={loading || !selectedUsuario || !selectedRutina || !fechaInicio || !fechaFin}
            sx={{ py: 1.5 }}
          >
            Asignar Rutina
          </Button>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default AsignarRutina;
