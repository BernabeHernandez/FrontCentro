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
  Tooltip,
} from '@mui/material';
import { Add, Edit, Delete, Remove, History } from '@mui/icons-material';

const MySwal = withReactContent(Swal);

const Politicas = () => {
  const [politicas, setPoliticas] = useState([]);
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

  const apiUrl = 'https://backendcentro.onrender.com/api/politicas';

  useEffect(() => {
    fetchPoliticas();
  }, []);

  const fetchPoliticas = async () => {
    try {
      const response = await axios.get(apiUrl);
      const politicasData = response.data;

      if (politicasData.length === 0) {
        setPoliticas([]);
        return;
      }

      const maxVersionPolitica = politicasData.reduce((maxPol, currentPol) => {
        return currentPol.version > maxPol.version ? currentPol : maxPol;
      });

      const updatedPoliticas = politicasData.map((politica) => ({
        ...politica,
        estado: politica.version === maxVersionPolitica.version ? 'Vigente' : 'No Vigente',
      }));

      setPoliticas(updatedPoliticas);
    } catch (error) {
      console.error('Error al obtener políticas:', error);
      MySwal.fire('Error', 'No se pudo obtener la lista de políticas', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await updatePolitica(currentId);
    } else {
      await createPolitica();
    }
    resetForm();
    fetchPoliticas();
  };

  const createPolitica = async () => {
    try {
      await axios.post(apiUrl, { titulo, contenido, fechaVigencia, secciones });
      setSnackbarMessage('Política creada correctamente');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al crear política:', error);
      MySwal.fire('Error', 'No se pudo crear la política', 'error');
    }
  };

  const updatePolitica = async (id) => {
    try {
      await axios.put(`${apiUrl}/${id}`, { titulo, contenido, fechaVigencia, secciones });
      setSnackbarMessage('Política actualizada correctamente');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al actualizar política:', error);
      MySwal.fire('Error', 'No se pudo actualizar la política', 'error');
    }
  };

  const deletePolitica = async (id) => {
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
        setSnackbarMessage('Política eliminada correctamente');
        setSnackbarOpen(true);
        fetchPoliticas();
      } catch (error) {
        console.error('Error al eliminar política:', error);
        MySwal.fire('Error', 'No se pudo eliminar la política', 'error');
      }
    }
  };

  const eliminarPoliticaDeLaTabla = async (id) => {
    try {
      await axios.put(`${apiUrl}/eliminar-tabla/${id}`);
      setSnackbarMessage('Política marcada como eliminada en la tabla');
      setSnackbarOpen(true);
      fetchPoliticas();
    } catch (error) {
      console.error('Error al eliminar política de la tabla:', error);
      MySwal.fire('Error', 'No se pudo eliminar la política de la tabla', 'error');
    }
  };

  const editPolitica = (id, politica) => {
    setCurrentId(id);
    setTitulo(politica.titulo);
    setContenido(politica.contenido);
    setFechaVigencia(politica.fechaVigencia);
    setSecciones(politica.secciones || []);
    setFechaCreacion(politica.fechaCreacion);
    setVersion(politica.version);
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
        Gestión de Políticas
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => setOpenDialog(true)}
        sx={{ mb: 4 }}
      >
        Agregar Política
      </Button>

      <Dialog open={openDialog} onClose={resetForm} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Editar Política' : 'Agregar Política'}</DialogTitle>
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
            {politicas.map((politica) => (
              <TableRow key={politica.id}>
                <TableCell>{politica.titulo}</TableCell>
                <TableCell>{politica.contenido}</TableCell>
                <TableCell>{new Date(politica.fechaVigencia).toISOString().split('T')[0]}</TableCell>
                <TableCell>
                  {politica.fechaCreacion && !isNaN(new Date(politica.fechaCreacion))
                    ? new Date(politica.fechaCreacion).toISOString().split('T')[0]
                    : 'Fecha no válida'}
                </TableCell>
                <TableCell>{politica.version}</TableCell>
                <TableCell>{politica.estado}</TableCell>
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton color="primary" onClick={() => editPolitica(politica.id, politica)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton color="error" onClick={() => deletePolitica(politica.id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={politica.estado === 'Vigente' ? 'No se puede quitar' : 'Quitar de la tabla'}>
                    <span>
                      <IconButton
                        color="warning"
                        onClick={() => eliminarPoliticaDeLaTabla(politica.id)}
                        disabled={politica.estado === 'Vigente'}
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
        to="/admin/historial-politicas"
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

export default Politicas;