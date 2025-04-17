import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, TextField, Box, Typography, CircularProgress,
  Modal, Button, Table as DetailTable, TableHead as DetailTableHead,
  TableRow as DetailTableRow, TableCell as DetailTableCell, TableBody as DetailTableBody,
  InputAdornment,
} from '@mui/material';
import {
  Receipt, Payment, CalendarToday, Person, Badge, Email, Visibility,
  Inventory, Numbers, MonetizationOn, Search,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 600 },
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [detalleVentas, setDetalleVentas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchVentas = async () => {
    try {
      const response = await fetch('https://backendcentro.onrender.com/api/ventas/ventas');
      const data = await response.json();
      setVentas(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching ventas:', error);
      setLoading(false);
    }
  };

  const fetchDetalleVenta = async (idVenta) => {
    try {
      const response = await fetch(`https://backendcentro.onrender.com/api/ventas/detalle-ventas/${idVenta}`);
      const data = await response.json();
      setDetalleVentas(data);
      setOpenModal(true);
    } catch (error) {
      console.error('Error fetching detalle ventas:', error);
    }
  };

  const handleRowClick = (venta) => {
    setSelectedVenta(venta);
    fetchDetalleVenta(venta.id);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedVenta(null);
    setDetalleVentas([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredVentas = ventas.filter(venta =>
    venta.nombre.toLowerCase().includes(filter.toLowerCase()) ||
    venta.apellidopa.toLowerCase().includes(filter.toLowerCase()) ||
    venta.gmail.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '92%', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#424242', mb: 3 }}>
        Gestión de Ventas
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Filtrar por Nombre, Apellido o Gmail..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: '#757575' }} />
            </InputAdornment>
          ),
        }}
        sx={{ maxWidth: 400, borderRadius: 2, mb: 3 }}
      />
      <TableContainer component={Paper} sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
        <Table sx={{ '& .MuiTableCell-root': { padding: '6px 8px', fontSize: '0.875rem' } }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(189, 189, 189, 0.2)' }}>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Receipt sx={{ mr: 1, color: '#0288d1', fontSize: '1.2rem' }} /> ID Venta
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Payment sx={{ mr: 1, color: '#388e3c', fontSize: '1.2rem' }} /> ID Pago
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarToday sx={{ mr: 1, color: '#f57c00', fontSize: '1.2rem' }} /> Fecha Venta
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 1, color: '#0288d1', fontSize: '1.2rem' }} /> Nombre
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Badge sx={{ mr: 1, color: '#388e3c', fontSize: '1.2rem' }} /> Apellido Paterno
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Email sx={{ mr: 1, color: '#f57c00', fontSize: '1.2rem' }} /> Gmail
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVentas
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((venta) => (
                <TableRow
                  key={venta.id}
                  onClick={() => handleRowClick(venta)}
                  sx={{
                    '&:hover': { backgroundColor: '#f5f5f5' },
                    height: '36px',
                    cursor: 'pointer',
                  }}
                >
                  <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{venta.id}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{venta.id_pago}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                    {new Date(venta.fecha_venta).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{venta.nombre}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{venta.apellidopa}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{venta.gmail}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredVentas.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ backgroundColor: 'rgba(189, 189, 189, 0.1)', fontSize: '0.875rem', padding: '4px' }}
        />
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="contained"
          startIcon={<Visibility />}
          onClick={() => navigate('/admin/detalleventas')}
          sx={{
            backgroundColor: '#0288d1',
            '&:hover': { backgroundColor: '#0277bd' },
            textTransform: 'none',
            fontWeight: 'bold',
          }}
        >
          Ver Detalles de la Venta
        </Button>
      </Box>

      {/* Modal para mostrar detalles de la venta */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={styleModal}>
          <Typography variant="h6" gutterBottom sx={{ color: '#424242', fontWeight: 'bold' }}>
            Detalle de la Venta #{selectedVenta?.id}
          </Typography>
          <DetailTable>
            <DetailTableHead>
              <DetailTableRow sx={{ backgroundColor: 'rgba(189, 189, 189, 0.2)' }}>
                <DetailTableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Inventory sx={{ mr: 1, color: '#0288d1', fontSize: '1.2rem' }} /> Producto
                  </Box>
                </DetailTableCell>
                <DetailTableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Numbers sx={{ mr: 1, color: '#388e3c', fontSize: '1.2rem' }} /> Cantidad
                  </Box>
                </DetailTableCell>
                <DetailTableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MonetizationOn sx={{ mr: 1, color: '#f57c00', fontSize: '1.2rem' }} /> Precio
                  </Box>
                </DetailTableCell>
                <DetailTableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MonetizationOn sx={{ mr: 1, color: '#0288d1', fontSize: '1.2rem' }} /> Subtotal
                  </Box>
                </DetailTableCell>
              </DetailTableRow>
            </DetailTableHead>
            <DetailTableBody>
              {detalleVentas.map((detalle) => (
                <DetailTableRow key={detalle.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' }, height: '36px' }}>
                  <DetailTableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{detalle.nombre_producto}</DetailTableCell>
                  <DetailTableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{detalle.cantidad}</DetailTableCell>
                  <DetailTableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>${detalle.precio}</DetailTableCell>
                  <DetailTableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>${detalle.subtotal}</DetailTableCell>
                </DetailTableRow>
              ))}
            </DetailTableBody>
          </DetailTable>
          <Button
            variant="contained"
            onClick={handleCloseModal}
            sx={{ mt: 2, backgroundColor: '#0288d1', '&:hover': { backgroundColor: '#0277bd' } }}
          >
            Cerrar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Ventas;