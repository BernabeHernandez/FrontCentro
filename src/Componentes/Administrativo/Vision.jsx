import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Snackbar,
  Alert,
  Modal,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Vision = () => {
  const [visiones, setVisiones] = useState([]);
  const [vision, setVision] = useState({ id: '', titulo: '', contenido: '' });
  const [mensaje, setMensaje] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false); // Estado para controlar el modal de edición
  const [visionEditando, setVisionEditando] = useState({ id: '', titulo: '', contenido: '' }); // Estado para la visión en edición
  const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState(false); // Estado para controlar el modal de confirmación de eliminación
  const [idAEliminar, setIdAEliminar] = useState(null); // Estado para almacenar el ID de la visión a eliminar

  // Cargar todas las visiones al montar el componente
  useEffect(() => {
    obtenerVisiones();
  }, []);

  const obtenerVisiones = async () => {
    try {
      const response = await axios.get('https://backendcentro.onrender.com/api/visionA/vision');
      setVisiones(response.data);
    } catch (error) {
      console.error('Error al obtener las visiones:', error);
    }
  };

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setVision({ ...vision, [e.target.name]: e.target.value });
  };

  // Manejar cambios en los inputs del modal de edición
  const handleChangeEditar = (e) => {
    setVisionEditando({ ...visionEditando, [e.target.name]: e.target.value });
  };

  // Crear una nueva visión
  const crearVision = async () => {
    if (!vision.titulo || !vision.contenido) {
      setMensaje('Todos los campos son requeridos');
      setOpenSnackbar(true);
      return;
    }

    try {
      const nuevaVision = { titulo: vision.titulo, contenido: vision.contenido };
      await axios.post('https://backendcentro.onrender.com/api/visionA/vision', nuevaVision);
      setMensaje('Visión creada correctamente');
      setOpenSnackbar(true);
      setVision({ id: '', titulo: '', contenido: '' }); // Limpiar el formulario
      setMostrarFormulario(false); // Ocultar el formulario después de crear
      obtenerVisiones(); // Recargar visiones después de crear
    } catch (error) {
      console.error('Error al crear la visión:', error);
    }
  };

  // Actualizar una visión
  const actualizarVision = async () => {
    if (!visionEditando.titulo || !visionEditando.contenido) {
      setMensaje('Todos los campos son requeridos');
      setOpenSnackbar(true);
      return;
    }

    try {
      await axios.put(`https://backendcentro.onrender.com/api/visionA/vision/${visionEditando.id}`, visionEditando);
      setMensaje('Visión actualizada correctamente');
      setOpenSnackbar(true);
      setMostrarModalEditar(false); // Cerrar el modal después de actualizar
      obtenerVisiones(); // Recargar visiones después de actualizar
    } catch (error) {
      console.error('Error al actualizar la visión:', error);
    }
  };

  // Eliminar una visión por ID
  const eliminarVision = async (id) => {
    try {
      await axios.delete(`https://backendcentro.onrender.com/api/visionA/vision/${id}`);
      setMensaje('Visión eliminada correctamente');
      setOpenSnackbar(true);
      obtenerVisiones(); // Recargar visiones después de eliminar
    } catch (error) {
      console.error('Error al eliminar la visión:', error);
    }
  };

  // Abrir modal de edición
  const abrirModalEditar = (visionSeleccionada) => {
    setVisionEditando(visionSeleccionada);
    setMostrarModalEditar(true);
  };

  // Mostrar modal de confirmación para eliminar
  const mostrarConfirmacionEliminarVision = (id) => {
    setIdAEliminar(id); // Guardar el ID de la visión a eliminar
    setMostrarConfirmacionEliminar(true); // Mostrar el modal de confirmación
  };

  // Confirmar la eliminación
  const confirmarEliminacion = () => {
    eliminarVision(idAEliminar); // Ejecutar la eliminación
    setMostrarConfirmacionEliminar(false); // Cerrar el modal de confirmación
  };

  // Cancelar la eliminación
  const cancelarEliminacion = () => {
    setMostrarConfirmacionEliminar(false); // Cerrar el modal de confirmación
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Estilos para el modal
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Gestión de Visiones
      </Typography>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {mensaje}
        </Alert>
      </Snackbar>

      {/* Botón para mostrar el formulario de creación */}
      {!mostrarFormulario && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setMostrarFormulario(true)}
          sx={{ marginBottom: 3 }}
        >
          Crear Visión
        </Button>
      )}

      {/* Formulario para crear una visión */}
      {mostrarFormulario && (
        <Paper elevation={3} sx={{ padding: 2, marginBottom: 3 }}>
          <Typography variant="h5" gutterBottom>
            Crear Nueva Visión
          </Typography>
          <TextField
            label="Título"
            name="titulo"
            value={vision.titulo}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Contenido"
            name="contenido"
            value={vision.contenido}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            required
          />
          <Button
            variant="contained"
            color="primary"
            onClick={crearVision}
            sx={{ marginTop: 2, marginRight: 2 }}
          >
            Crear Visión
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setVision({ id: '', titulo: '', contenido: '' }); // Limpiar el formulario
              setMostrarFormulario(false); // Ocultar el formulario
            }}
            sx={{ marginTop: 2 }}
          >
            Cancelar
          </Button>
        </Paper>
      )}

      {/* Lista de visiones existentes */}
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Typography variant="h5" gutterBottom>
          Visiones Existentes
        </Typography>
        {visiones.length === 0 ? (
          <Typography>No hay visiones disponibles.</Typography>
        ) : (
          <List>
            {visiones.map((v) => (
              <ListItem key={v.id} secondaryAction={
                <>
                  <Tooltip title="Editar">
                    <IconButton onClick={() => abrirModalEditar(v)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton onClick={() => mostrarConfirmacionEliminarVision(v.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </>
              }>
                <ListItemText primary={v.titulo} secondary={v.contenido} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Modal para editar una visión */}
      <Modal
        open={mostrarModalEditar}
        onClose={() => setMostrarModalEditar(false)}
      >
        <Box sx={modalStyle}>
          <Typography variant="h5" gutterBottom>
            Editar Visión
          </Typography>
          <TextField
            label="Título"
            name="titulo"
            value={visionEditando.titulo}
            onChange={handleChangeEditar}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Contenido"
            name="contenido"
            value={visionEditando.contenido}
            onChange={handleChangeEditar}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            required
          />
          <Button
            variant="contained"
            color="primary"
            onClick={actualizarVision}
            sx={{ marginTop: 2, marginRight: 2 }}
          >
            Guardar Cambios
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setMostrarModalEditar(false)}
            sx={{ marginTop: 2 }}
          >
            Cancelar
          </Button>
        </Box>
      </Modal>

      {/* Modal de confirmación para eliminar */}
      <Modal
        open={mostrarConfirmacionEliminar}
        onClose={cancelarEliminacion}
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            ¿Estás seguro de eliminar esta visión?
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={confirmarEliminacion}
            sx={{ marginRight: 2 }}
          >
            Sí
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={cancelarEliminacion}
          >
            No
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default Vision;