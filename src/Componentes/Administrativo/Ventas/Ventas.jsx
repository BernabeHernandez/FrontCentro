import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, TextField, Box, Typography, CircularProgress,
  Modal, Button, Table as DetailTable, TableHead as DetailTableHead,
  TableRow as DetailTableRow, TableCell as DetailTableCell, TableBody as DetailTableBody
} from '@mui/material';
import {
  Receipt, Payment, CalendarToday, Person, Badge, Email, Visibility
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
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
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, color: '#424242', fontWeight: 'bold' }}>
        Gestión de Ventas
      </Typography>
      <TextField
        label="Filtrar por Nombre, Apellido o Gmail"
        variant="outlined"
        fullWidth
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        sx={{ mb: 3, backgroundColor: 'white' }}
      />
      <TableContainer component={Paper} sx={{ boxShadow: 3, backgroundColor: '#e0e0e0' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#616161' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                <Receipt sx={{ verticalAlign: 'middle', mr: 1, color: '#ffca28' }} /> ID Venta
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                <Payment sx={{ verticalAlign: 'middle', mr: 1, color: '#4caf50' }} /> ID Pago
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                <CalendarToday sx={{ verticalAlign: 'middle', mr: 1, color: '#42a5f5' }} /> Fecha Venta
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                <Person sx={{ verticalAlign: 'middle', mr: 1, color: '#ab47bc' }} /> Nombre
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                <Badge sx={{ verticalAlign: 'middle', mr: 1, color: '#ef5350' }} /> Apellido Paterno
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                <Email sx={{ verticalAlign: 'middle', mr: 1, color: '#26a69a' }} /> Gmail
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVentas
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((venta) => (
                <TableRow
                  key={venta.id}
                  hover
                  onClick={() => handleRowClick(venta)}
                  sx={{ 
                    cursor: 'pointer', 
                    '&:hover': { backgroundColor: '#bdbdbd' },
                    backgroundColor: '#eeeeee'
                  }}
                >
                  <TableCell>{venta.id}</TableCell>
                  <TableCell>{venta.id_pago}</TableCell>
                  <TableCell>{new Date(venta.fecha_venta).toLocaleDateString()}</TableCell>
                  <TableCell>{venta.nombre}</TableCell>
                  <TableCell>{venta.apellidopa}</TableCell>
                  <TableCell>{venta.gmail}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredVentas.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
          sx={{ color: '#424242' }}
        />
        <Button
          variant="contained"
          startIcon={<Visibility />}
          onClick={() => navigate('/admin/detalleventas')}
          sx={{ 
            backgroundColor: '#424242', 
            '&:hover': { backgroundColor: '#616161' },
            textTransform: 'none',
            fontWeight: 'bold'
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
            <DetailTableHead sx={{ backgroundColor: '#616161' }}>
              <DetailTableRow>
                <DetailTableCell sx={{ color: 'white' }}>Producto</DetailTableCell>
                <DetailTableCell sx={{ color: 'white' }}>Cantidad</DetailTableCell>
                <DetailTableCell sx={{ color: 'white' }}>Precio</DetailTableCell>
                <DetailTableCell sx={{ color: 'white' }}>Subtotal</DetailTableCell>
              </DetailTableRow>
            </DetailTableHead>
            <DetailTableBody>
              {detalleVentas.map((detalle) => (
                <DetailTableRow key={detalle.id}>
                  <DetailTableCell>{detalle.nombre_producto}</DetailTableCell>
                  <DetailTableCell>{detalle.cantidad}</DetailTableCell>
                  <DetailTableCell>${detalle.precio}</DetailTableCell>
                  <DetailTableCell>${detalle.subtotal}</DetailTableCell>
                </DetailTableRow>
              ))}
            </DetailTableBody>
          </DetailTable>
          <Button
            variant="contained"
            onClick={handleCloseModal}
            sx={{ mt: 2, backgroundColor: '#424242', '&:hover': { backgroundColor: '#616161' } }}
          >
            Cerrar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Ventas;