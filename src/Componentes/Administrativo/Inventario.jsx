import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  Button, TextField, Modal, Box, Typography, useMediaQuery, useTheme, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination,
  InputAdornment, IconButton
} from '@mui/material';
import { Inventory, MonetizationOn, Numbers, Build, Search, Add, Remove, Edit, Delete } from '@mui/icons-material';

const Inventario = () => {
  const [productos, setProductos] = useState([]);
  const [editandoProducto, setEditandoProducto] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    cantidad: '',
    id_categoria: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [cantidadInput, setCantidadInput] = useState(0);
  const [productoId, setProductoId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await axios.get('https://backendcentro.onrender.com/api/productos');
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  const actualizarCantidad = async () => {
    if (isNaN(cantidadInput) || cantidadInput <= 0) {
      Swal.fire('Error', 'Por favor ingresa un número válido', 'error');
      return;
    }
    const cantidadNumerica = Number(cantidadInput);
    try {
      if (modalType === 'agregar') {
        await axios.put(`https://backendcentro.onrender.com/api/productos/agregar-cantidad/${productoId}`, { cantidad: cantidadNumerica });
        Swal.fire('Correcto', 'Cantidad agregada exitosamente', 'success');
      } else {
        await axios.put(`https://backendcentro.onrender.com/api/productos/eliminar-cantidad/${productoId}`, { cantidad: cantidadNumerica });
        Swal.fire('Correcto', 'Cantidad eliminada exitosamente', 'success');
      }
      setProductos((prev) =>
        prev.map((p) =>
          p.id === productoId ? {
            ...p,
            cantidad: modalType === 'agregar' ? p.cantidad + cantidadNumerica : p.cantidad - cantidadNumerica
          } : p
        )
      );
      setModalVisible(false);
      setCantidadInput(0);
      setProductoId(null);
    } catch (error) {
      Swal.fire('Error', 'Hubo un error al actualizar la cantidad', 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setEditandoProducto(null);
    const confirmUpdate = await Swal.fire({
      title: '¿Estás seguro de que deseas actualizar este producto?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'No, cancelar',
    });
    if (confirmUpdate.isConfirmed) {
      try {
        await axios.put(`https://backendcentro.onrender.com/api/productos/${editandoProducto.id}`, formData);
        setProductos((prev) =>
          prev.map((p) => (p.id === editandoProducto.id ? { ...p, ...formData } : p))
        );
        setFormData({ nombre: '', descripcion: '', precio: '', cantidad: '', id_categoria: '' });
        Swal.fire('Actualizado', 'El producto ha sido actualizado correctamente.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Hubo un problema al actualizar el producto.', 'error');
      }
    } else {
      setEditandoProducto(editandoProducto);
    }
  };

  const eliminarProducto = (id) => {
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
          await axios.delete(`https://backendcentro.onrender.com/api/productos/${id}`);
          setProductos((prev) => prev.filter((p) => p.id !== id));
          Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
        } catch (error) {
          Swal.fire('Error', 'Hubo un problema al eliminar el producto.', 'error');
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

  const filteredProductos = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '16px', width: '92%', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#424242' }}>
        Inventario de Productos
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
            padding: '1px 1px', // Reducido aún más el padding vertical para filas más juntas
            fontSize: '0.875rem', // Tamaño de fuente más pequeño para mayor densidad
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
                  <Numbers sx={{ mr: 1, color: '#f57c00', fontSize: '1.2rem' }} /> Cantidad
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
            {filteredProductos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((producto) => (
              <TableRow 
                key={producto.id} 
                sx={{ 
                  '&:hover': { backgroundColor: '#f5f5f5' }, 
                  height: '36px' // Altura fija más pequeña para filas más compactas
                }}
              >
                <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{producto.nombre}</TableCell>
                <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>${producto.precio}</TableCell>
                <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{producto.cantidad}</TableCell>
                <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                  <IconButton
                    color="primary"
                    size="small" // Íconos más pequeños para ajustar al diseño compacto
                    onClick={() => {
                      setModalType('agregar');
                      setProductoId(producto.id);
                      setModalVisible(true);
                    }}
                  >
                    <Add fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    size="small"
                    onClick={() => {
                      setModalType('eliminar');
                      setProductoId(producto.id);
                      setModalVisible(true);
                    }}
                  >
                    <Remove fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="warning"
                    size="small"
                    onClick={() => {
                      setEditandoProducto(producto);
                      setFormData({
                        nombre: producto.nombre,
                        descripcion: producto.descripcion,
                        precio: producto.precio,
                        cantidad: producto.cantidad,
                        id_categoria: producto.id_categoria,
                      });
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => eliminarProducto(producto.id)}
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
          count={filteredProductos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ backgroundColor: 'rgba(189, 189, 189, 0.1)', fontSize: '0.875rem', padding: '4px' }}
        />
      </TableContainer>

      {/* Modal para editar producto */}
      {editandoProducto && (
        <Modal open={Boolean(editandoProducto)} onClose={() => setEditandoProducto(null)}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: isMobile ? '90%' : 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#424242' }}>Editar Producto</Typography>
            <form onSubmit={handleSubmitEdit}>
              <TextField fullWidth margin="normal" label="Nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} variant="outlined" />
              <TextField fullWidth margin="normal" label="Descripción" name="descripcion" value={formData.descripcion} onChange={handleInputChange} variant="outlined" />
              <TextField fullWidth margin="normal" label="Precio" name="precio" type="number" value={formData.precio} onChange={handleInputChange} variant="outlined" />
              <TextField fullWidth margin="normal" label="Cantidad" name="cantidad" type="number" value={formData.cantidad} onChange={handleInputChange} variant="outlined" />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button type="submit" variant="contained" color="primary">Actualizar</Button>
                <Button variant="outlined" color="secondary" onClick={() => setEditandoProducto(null)}>Cancelar</Button>
              </Box>
            </form>
          </Box>
        </Modal>
      )}

      {/* Modal para agregar o eliminar cantidad */}
      <Modal open={modalVisible} onClose={() => setModalVisible(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: isMobile ? '90%' : 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#424242' }}>
            {modalType === 'agregar' ? 'Agregar Cantidad' : 'Eliminar Cantidad'}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            type="number"
            value={cantidadInput}
            onChange={(e) => setCantidadInput(e.target.value)}
            placeholder="Cantidad"
            variant="outlined"
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={actualizarCantidad}>Confirmar</Button>
            <Button variant="outlined" color="secondary" onClick={() => setModalVisible(false)}>Cancelar</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Inventario;