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

const Deslinde = () => {
  const [deslindes, setDeslindes] = useState([]);
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

  const apiUrl = 'https://backendcentro.onrender.com/api/deslinde';

  useEffect(() => {
    fetchDeslindes();
  }, []);

  const fetchDeslindes = async () => {
    try {
      const response = await axios.get(apiUrl);
      const deslindesData = response.data;

      if (deslindesData.length === 0) {
        setDeslindes([]);
        return;
      }

      const maxVersionDeslinde = deslindesData.reduce((maxDes, currentDes) => {
        return currentDes.version > maxDes.version ? currentDes : maxDes;
      });

      const updatedDeslindes = deslindesData.map((deslinde) => ({
        ...deslinde,
        estado: deslinde.version === maxVersionDeslinde.version ? 'Vigente' : 'No Vigente',
      }));

      setDeslindes(updatedDeslindes);
    } catch (error) {
      console.error('Error al obtener deslindes:', error);
      MySwal.fire('Error', 'No se pudo obtener la lista de deslindes', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await updateDeslinde(currentId);
    } else {
      await createDeslinde();
    }
    resetForm();
    fetchDeslindes();
  };

  const createDeslinde = async () => {
    try {
      await axios.post(apiUrl, { titulo, contenido, fechaVigencia, secciones });
      setSnackbarMessage('Deslinde creado correctamente');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al crear deslinde:', error);
      MySwal.fire('Error', 'No se pudo crear el deslinde', 'error');
    }
  };

  const updateDeslinde = async (id) => {
    try {
      await axios.put(`${apiUrl}/${id}`, { titulo, contenido, fechaVigencia, secciones });
      setSnackbarMessage('Deslinde actualizado correctamente');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al actualizar deslinde:', error);
      MySwal.fire('Error', 'No se pudo actualizar el deslinde', 'error');
    }
  };

  const deleteDeslinde = async (id) => {
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
        setSnackbarMessage('Deslinde eliminado correctamente');
        setSnackbarOpen(true);
        fetchDeslindes();
      } catch (error) {
        console.error('Error al eliminar deslinde:', error);
        MySwal.fire('Error', 'No se pudo eliminar el deslinde', 'error');
      }
    }
  };

  const eliminarDeslindeDeLaTabla = async (id) => {
    try {
      await axios.put(`${apiUrl}/eliminar-tabla/${id}`);
      setSnackbarMessage('Deslinde marcado como eliminado en la tabla');
      setSnackbarOpen(true);
      fetchDeslindes();
    } catch (error) {
      console.error('Error al eliminar deslinde de la tabla:', error);
      MySwal.fire('Error', 'No se pudo eliminar el deslinde de la tabla', 'error');
    }
  };

  const editDeslinde = (id, deslinde) => {
    setCurrentId(id);
    setTitulo(deslinde.titulo);
    setContenido(deslinde.contenido);
    setFechaVigencia(deslinde.fechaVigencia);
    setSecciones(deslinde.secciones || []);
    setFechaCreacion(deslinde.fechaCreacion);
    setVersion(deslinde.version);
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
        Gestión de Deslindes
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => setOpenDialog(true)}
        sx={{ mb: 4 }}
      >
        Agregar Deslinde
      </Button>

      <Dialog open={openDialog} onClose={resetForm} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Editar Deslinde' : 'Agregar Deslinde'}</DialogTitle>
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
            {deslindes.map((deslinde) => (
              <TableRow key={deslinde.id}>
                <TableCell>{deslinde.titulo}</TableCell>
                <TableCell>{deslinde.contenido}</TableCell>
                <TableCell>{new Date(deslinde.fechaVigencia).toISOString().split('T')[0]}</TableCell>
                <TableCell>
                  {deslinde.fechaCreacion && !isNaN(new Date(deslinde.fechaCreacion))
                    ? new Date(deslinde.fechaCreacion).toISOString().split('T')[0]
                    : 'Fecha no válida'}
                </TableCell>
                <TableCell>{deslinde.version}</TableCell>
                <TableCell>{deslinde.estado}</TableCell>
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton color="primary" onClick={() => editDeslinde(deslinde.id, deslinde)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton color="error" onClick={() => deleteDeslinde(deslinde.id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={deslinde.estado === 'Vigente' ? 'No se puede quitar' : 'Quitar de la tabla'}>
                    <span>
                      <IconButton
                        color="warning"
                        onClick={() => eliminarDeslindeDeLaTabla(deslinde.id)}
                        disabled={deslinde.estado === 'Vigente'}
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
        to="/admin/historial-deslindes"
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

export default Deslinde;