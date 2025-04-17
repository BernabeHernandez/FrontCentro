import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  Button, TextField, Modal, Box, Typography, useMediaQuery, useTheme, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination,
  InputAdornment, IconButton
} from '@mui/material';
import { Inventory, MonetizationOn, Build, Search, Edit, Delete } from '@mui/icons-material';

const InventarioServicios = () => {
  const [servicios, setServicios] = useState([]);
  const [editandoServicio, setEditandoServicio] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    id_categoria: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    try {
      const response = await axios.get('https://backendcentro.onrender.com/api/servicios');
      setServicios(response.data);
    } catch (error) {
      console.error('Error al obtener los servicios:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setEditandoServicio(null);
    const confirmUpdate = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas actualizar este servicio?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'No, cancelar',
    });
    if (confirmUpdate.isConfirmed) {
      try {
        const { nombre, descripcion, precio, id_categoria } = formData;
        await axios.put(`https://backendcentro.onrender.com/api/servicios/${editandoServicio.id}`, {
          nombre,
          descripcion,
          precio,
          id_categoria,
        });
        setServicios((prevServicios) =>
          prevServicios.map((servicio) =>
            servicio.id === editandoServicio.id ? { ...servicio, ...formData } : servicio
          )
        );
        setFormData({ nombre: '', descripcion: '', precio: '', id_categoria: '' });
        Swal.fire('Actualizado', 'El servicio ha sido actualizado correctamente', 'success');
      } catch (error) {
        console.error('Error al editar el servicio:', error);
        Swal.fire('Error', 'Hubo un problema al actualizar el servicio.', 'error');
      }
    } else {
      setEditandoServicio(editandoServicio);
    }
  };

  const eliminarServicio = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://backendcentro.onrender.com/api/servicios/${id}`);
          setServicios((prevServicios) => prevServicios.filter((servicio) => servicio.id !== id));
          Swal.fire('Eliminado', 'El servicio ha sido eliminado.', 'success');
        } catch (error) {
          console.error('Error al eliminar el servicio:', error);
          Swal.fire('Error', 'Hubo un problema al eliminar el servicio.', 'error');
        }
      }
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredServicios = servicios.filter((servicio) =>
    servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '16px', width: '92%', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#424242' }}>
        Inventario de Servicios
      </Typography>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth={isMobile}
          variant="outlined"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#757575' }} />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400, borderRadius: 2 }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
        <Table sx={{ 
          '& .MuiTableCell-root': { 
            padding: '6px 8px', 
            fontSize: '0.875rem', 
          } 
        }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(189, 189, 189, 0.2)' }}>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Inventory sx={{ mr: 1, color: '#0288d1', fontSize: '1.2rem' }} /> Nombre
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MonetizationOn sx={{ mr: 1, color: '#388e3c', fontSize: '1.2rem' }} /> Precio
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Build sx={{ mr: 1, color: '#7b1fa2', fontSize: '1.2rem' }} /> Acciones
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredServicios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((servicio) => (
              <TableRow 
                key={servicio.id} 
                sx={{ 
                  '&:hover': { backgroundColor: '#f5f5f5' }, 
                  height: '36px' 
                }}
              >
                <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{servicio.nombre}</TableCell>
                <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>${servicio.precio}</TableCell>
                <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                  <IconButton
                    color="warning"
                    size="small"
                    onClick={() => {
                      setEditandoServicio(servicio);
                      setFormData({
                        nombre: servicio.nombre,
                        descripcion: servicio.descripcion,
                        precio: servicio.precio,
                        id_categoria: servicio.id_categoria,
                      });
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => eliminarServicio(servicio.id)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredServicios.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ backgroundColor: 'rgba(189, 189, 189, 0.1)', fontSize: '0.875rem', padding: '4px' }}
        />
      </TableContainer>

      {/* Modal para editar servicio */}
      {editandoServicio && (
        <Modal open={Boolean(editandoServicio)} onClose={() => setEditandoServicio(null)}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: isMobile ? '90%' : 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#424242' }}>Editar Servicio</Typography>
            <form onSubmit={handleSubmitEdit}>
              <TextField fullWidth margin="normal" label="Nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} variant="outlined" />
              <TextField fullWidth margin="normal" label="Descripción" name="descripcion" value={formData.descripcion} onChange={handleInputChange} variant="outlined" />
              <TextField fullWidth margin="normal" label="Precio" name="precio" type="number" value={formData.precio} onChange={handleInputChange} variant="outlined" />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button type="submit" variant="contained" color="primary">Actualizar</Button>
                <Button variant="outlined" color="secondary" onClick={() => setEditandoServicio(null)}>Cancelar</Button>
              </Box>
            </form>
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default InventarioServicios;