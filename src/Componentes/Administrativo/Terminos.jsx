import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Box,
  Tooltip, // Importar Tooltip aquí
} from '@mui/material';
import { Add, Edit, Delete, Remove, History } from '@mui/icons-material';

const MySwal = withReactContent(Swal);

const Terminos = () => {
  const [terminos, setTerminos] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [fechaVigencia, setFechaVigencia] = useState('');
  const [secciones, setSecciones] = useState([{ titulo: '', contenido: '' }]);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [fechaCreacion, setFechaCreacion] = useState('');
  const [version, setVersion] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const apiUrl = 'https://backendcentro.onrender.com/api/terminos';

  useEffect(() => {
    fetchTerminos();
  }, []);

  const fetchTerminos = async () => {
    try {
      const response = await axios.get(apiUrl);
      const terminosData = response.data;

      if (terminosData.length === 0) {
        setTerminos([]);
        return;
      }

      const maxVersionTermino = terminosData.reduce((maxTerm, currentTerm) => {
        return currentTerm.version > maxTerm.version ? currentTerm : maxTerm;
      });

      const updatedTerminos = terminosData.map(termino => ({
        ...termino,
        estado: termino.version === maxVersionTermino.version ? 'Vigente' : 'No Vigente',
      }));

      setTerminos(updatedTerminos);
    } catch (error) {
      console.error('Error al obtener términos:', error);
      MySwal.fire('Error', 'No se pudo obtener la lista de términos', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await updateTermino(currentId);
    } else {
      await createTermino();
    }
    resetForm();
    fetchTerminos();
  };

  const createTermino = async () => {
    try {
      await axios.post(apiUrl, { titulo, contenido, fechaVigencia, secciones });
      setSnackbarMessage('Término creado correctamente');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al crear término:', error);
      MySwal.fire('Error', 'No se pudo crear el término', 'error');
    }
  };

  const updateTermino = async (id) => {
    try {
      await axios.put(`${apiUrl}/${id}`, { titulo, contenido, fechaVigencia, secciones });
      setSnackbarMessage('Término actualizado correctamente');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al actualizar término:', error);
      MySwal.fire('Error', 'No se pudo actualizar el término', 'error');
    }
  };

  const deleteTermino = async (id) => {
    const confirm = await MySwal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${apiUrl}/${id}`);
        setSnackbarMessage('Término eliminado correctamente');
        setSnackbarOpen(true);
        fetchTerminos();
      } catch (error) {
        console.error('Error al eliminar término:', error);
        MySwal.fire('Error', 'No se pudo eliminar el término', 'error');
      }
    }
  };

  const deleteTerminoTabla = async (id) => {
    try {
      await axios.put(`${apiUrl}/eliminar-tabla/${id}`);
      setSnackbarMessage('Término marcado como eliminado en la tabla');
      setSnackbarOpen(true);
      fetchTerminos();
    } catch (error) {
      console.error('Error al eliminar término de la tabla:', error);
      MySwal.fire('Error', 'No se pudo eliminar el término de la tabla', 'error');
    }
  };

  const editTermino = (id, termino) => {
    setCurrentId(id);
    setTitulo(termino.titulo);
    setContenido(termino.contenido);
    setFechaVigencia(termino.fechaVigencia);
    setSecciones(termino.secciones || []);
    setFechaCreacion(termino.fechaCreacion);
    setVersion(termino.version);
    setEditMode(true);
    setOpenDialog(true);
  };

  const resetForm = () => {
    setTitulo('');
    setContenido('');
    setFechaVigencia('');
    setSecciones([{ titulo: '', contenido: '' }]);
    setEditMode(false);
    setCurrentId('');
    setFechaCreacion('');
    setVersion('');
    setOpenDialog(false);
  };

  const handleAddSection = () => {
    setSecciones([...secciones, { titulo: '', contenido: '' }]);
  };

  const handleRemoveSection = (index) => {
    const newSections = secciones.filter((_, i) => i !== index);
    setSecciones(newSections);
  };

  const handleSectionChange = (index, field, value) => {
    const newSections = [...secciones];
    newSections[index][field] = value;
    setSecciones(newSections);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mt: 4 }}>
        Gestión de Términos
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => setOpenDialog(true)}
        sx={{ mb: 4 }}
      >
        Agregar Término
      </Button>

      <Dialog open={openDialog} onClose={resetForm} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Editar Término' : 'Agregar Término'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Contenido"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            required
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Fecha de Vigencia"
            type="date"
            value={fechaVigencia}
            onChange={(e) => setFechaVigencia(e.target.value)}
            required
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />

          {secciones.map((section, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Subtítulo"
                value={section.titulo}
                onChange={(e) => handleSectionChange(index, 'titulo', e.target.value)}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Contenido del Subtítulo"
                value={section.contenido}
                onChange={(e) => handleSectionChange(index, 'contenido', e.target.value)}
                required
                multiline
                rows={2}
                sx={{ mb: 2 }}
              />
              <Button
                variant="outlined"
                color="error"
                startIcon={<Remove />}
                onClick={() => handleRemoveSection(index)}
              >
                Eliminar Sección
              </Button>
            </Box>
          ))}

          <Button
            variant="outlined"
            color="primary"
            startIcon={<Add />}
            onClick={handleAddSection}
            sx={{ mt: 2 }}
          >
            Agregar Sección
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetForm} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editMode ? 'Actualizar' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Contenido</TableCell>
              <TableCell>Fecha de Vigencia</TableCell>
              <TableCell>Fecha de Creación</TableCell>
              <TableCell>Versión</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {terminos.map((termino) => (
              <TableRow key={termino.id}>
                <TableCell>{termino.titulo}</TableCell>
                <TableCell>{termino.contenido}</TableCell>
                <TableCell>{new Date(termino.fechaVigencia).toISOString().split('T')[0]}</TableCell>
                <TableCell>{new Date(termino.fechaCreacion).toISOString().split('T')[0]}</TableCell>
                <TableCell>{termino.version}</TableCell>
                <TableCell>{termino.estado}</TableCell>
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton color="primary" onClick={() => editTermino(termino.id, termino)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton color="error" onClick={() => deleteTermino(termino.id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={termino.estado === 'Vigente' ? 'No se puede quitar' : 'Quitar de la tabla'}>
                    <span>
                      <IconButton
                        color="warning"
                        onClick={() => deleteTerminoTabla(termino.id)}
                        disabled={termino.estado === 'Vigente'}
                      >
                        <Remove />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        component={Link}
        to="/admin/historial-terminos"
        variant="contained"
        color="primary"
        startIcon={<History />}
        sx={{ mb: 4 }}
      >
        Ir al Historial
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default Terminos;