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

const Mision = () => {
  const [misiones, setMisiones] = useState([]);
  const [mision, setMision] = useState({ id: '', titulo: '', contenido: '' });
  const [mensaje, setMensaje] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false); // Estado para controlar el modal de edición
  const [misionEditando, setMisionEditando] = useState({ id: '', titulo: '', contenido: '' }); // Estado para la misión en edición
  const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState(false); // Estado para controlar el modal de confirmación de eliminación
  const [idAEliminar, setIdAEliminar] = useState(null); // Estado para almacenar el ID de la misión a eliminar

  // Cargar todas las misiones al montar el componente
  useEffect(() => {
    obtenerMisiones();
  }, []);

  const obtenerMisiones = async () => {
    try {
      const response = await axios.get('https://backendcentro.onrender.com/api/misionA/mision');
      setMisiones(response.data);
    } catch (error) {
      console.error('Error al obtener las misiones:', error);
    }
  };

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setMision({ ...mision, [e.target.name]: e.target.value });
  };

  // Manejar cambios en los inputs del modal de edición
  const handleChangeEditar = (e) => {
    setMisionEditando({ ...misionEditando, [e.target.name]: e.target.value });
  };

  // Crear una nueva misión
  const crearMision = async () => {
    if (!mision.titulo || !mision.contenido) {
      setMensaje('Todos los campos son requeridos');
      setOpenSnackbar(true);
      return;
    }

    try {
      const nuevaMision = { titulo: mision.titulo, contenido: mision.contenido };
      await axios.post('https://backendcentro.onrender.com/api/misionA/mision', nuevaMision);
      setMensaje('Misión creada correctamente');
      setOpenSnackbar(true);
      setMision({ id: '', titulo: '', contenido: '' }); // Limpiar el formulario
      setMostrarFormulario(false); // Ocultar el formulario después de crear
      obtenerMisiones(); // Recargar misiones después de crear
    } catch (error) {
      console.error('Error al crear la misión:', error);
    }
  };

  // Actualizar una misión
  const actualizarMision = async () => {
    if (!misionEditando.titulo || !misionEditando.contenido) {
      setMensaje('Todos los campos son requeridos');
      setOpenSnackbar(true);
      return;
    }

    try {
      await axios.put(`https://backendcentro.onrender.com/api/misionA/mision/${misionEditando.id}`, misionEditando);
      setMensaje('Misión actualizada correctamente');
      setOpenSnackbar(true);
      setMostrarModalEditar(false); // Cerrar el modal después de actualizar
      obtenerMisiones(); // Recargar misiones después de actualizar
    } catch (error) {
      console.error('Error al actualizar la misión:', error);
    }
  };

  // Eliminar una misión por ID
  const eliminarMision = async (id) => {
    try {
      await axios.delete(`https://backendcentro.onrender.com/api/misionA/mision/${id}`);
      setMensaje('Misión eliminada correctamente');
      setOpenSnackbar(true);
      obtenerMisiones(); // Recargar misiones después de eliminar
    } catch (error) {
      console.error('Error al eliminar la misión:', error);
    }
  };

  // Abrir modal de edición
  const abrirModalEditar = (misionSeleccionada) => {
    setMisionEditando(misionSeleccionada);
    setMostrarModalEditar(true);
  };

  // Mostrar modal de confirmación para eliminar
  const mostrarConfirmacionEliminarMision = (id) => {
    setIdAEliminar(id); // Guardar el ID de la misión a eliminar
    setMostrarConfirmacionEliminar(true); // Mostrar el modal de confirmación
  };

  // Confirmar la eliminación
  const confirmarEliminacion = () => {
    eliminarMision(idAEliminar); // Ejecutar la eliminación
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
        Gestión de Misiones
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
          Crear Misión
        </Button>
      )}

      {/* Formulario para crear una misión */}
      {mostrarFormulario && (
        <Paper elevation={3} sx={{ padding: 2, marginBottom: 3 }}>
          <Typography variant="h5" gutterBottom>
            Crear Nueva Misión
          </Typography>
          <TextField
            label="Título"
            name="titulo"
            value={mision.titulo}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Contenido"
            name="contenido"
            value={mision.contenido}
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
            onClick={crearMision}
            sx={{ marginTop: 2, marginRight: 2 }}
          >
            Crear Misión
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setMision({ id: '', titulo: '', contenido: '' }); // Limpiar el formulario
              setMostrarFormulario(false); // Ocultar el formulario
            }}
            sx={{ marginTop: 2 }}
          >
            Cancelar
          </Button>
        </Paper>
      )}

      {/* Lista de misiones existentes */}
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Typography variant="h5" gutterBottom>
          Misiones Existentes
        </Typography>
        {misiones.length === 0 ? (
          <Typography>No hay misiones disponibles.</Typography>
        ) : (
          <List>
            {misiones.map((m) => (
              <ListItem key={m.id} secondaryAction={
                <>
                  <Tooltip title="Editar">
                    <IconButton onClick={() => abrirModalEditar(m)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton onClick={() => mostrarConfirmacionEliminarMision(m.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </>
              }>
                <ListItemText primary={m.titulo} secondary={m.contenido} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Modal para editar una misión */}
      <Modal
        open={mostrarModalEditar}
        onClose={() => setMostrarModalEditar(false)}
      >
        <Box sx={modalStyle}>
          <Typography variant="h5" gutterBottom>
            Editar Misión
          </Typography>
          <TextField
            label="Título"
            name="titulo"
            value={misionEditando.titulo}
            onChange={handleChangeEditar}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Contenido"
            name="contenido"
            value={misionEditando.contenido}
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
            onClick={actualizarMision}
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
            ¿Estás seguro de eliminar esta misión?
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

export default Mision;