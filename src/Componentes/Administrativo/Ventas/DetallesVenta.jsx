import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, TextField, Box, Typography, CircularProgress,
  Button, InputAdornment,
} from '@mui/material';
import {
  ShoppingCart, AttachMoney, ProductionQuantityLimits, Receipt, Storefront,
  MonetizationOn, Person, Badge, Email, CalendarToday, PictureAsPdf, Search,
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const DetallesVentas = () => {
  const [detalleVentas, setDetalleVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchDetalleVentas();
  }, []);

  const fetchDetalleVentas = async () => {
    try {
      const response = await fetch('https://backendcentro.onrender.com/api/ventas/detalle-ventas');
      const data = await response.json();
      setDetalleVentas(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching detalle ventas:', error);
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredDetalleVentas = detalleVentas.filter(detalle =>
    detalle.nombre_producto.toLowerCase().includes(filter.toLowerCase()) ||
    String(detalle.id_venta).includes(filter) ||
    detalle.nombre.toLowerCase().includes(filter.toLowerCase()) ||
    detalle.apellidopa.toLowerCase().includes(filter.toLowerCase()) ||
    detalle.gmail.toLowerCase().includes(filter.toLowerCase())
  );

  const productSales = detalleVentas.reduce((acc, detalle) => {
    acc[detalle.nombre_producto] = (acc[detalle.nombre_producto] || 0) + detalle.cantidad;
    return acc;
  }, {});

  const totalSales = Object.values(productSales).reduce((sum, qty) => sum + qty, 0);
  const sortedProducts = Object.entries(productSales).sort((a, b) => b[1] - a[1]);
  const topProducts = sortedProducts.slice(0, 3);
  const leastSoldProduct = sortedProducts[sortedProducts.length - 1] || ['Sin datos', 0];

  const getPercentage = (quantity) => totalSales ? (quantity / totalSales * 100).toFixed(1) : 0;

  const generateTablePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Reporte de Detalles de Ventas Filtrados', 14, 22);
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total de registros: ${filteredDetalleVentas.length}`, 14, 38);

    const tableData = filteredDetalleVentas.map(detalle => [
      detalle.id,
      detalle.id_venta,
      detalle.nombre_producto,
      detalle.cantidad,
      `$${detalle.precio}`,
      `$${detalle.subtotal}`,
      detalle.nombre,
      detalle.apellidopa,
      detalle.gmail,
      new Date(detalle.fecha_venta).toLocaleDateString()
    ]);

    autoTable(doc, {
      startY: 45,
      head: [['ID', 'ID Venta', 'Producto', 'Cantidad', 'Precio', 'Subtotal', 'Nombre', 'Apellido', 'Gmail', 'Fecha Venta']],
      body: tableData,
      theme: 'striped',
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [97, 97, 97], textColor: [255, 255, 255] },
    });

    doc.save('Reporte_Detalles_Ventas_Filtrados.pdf');
  };

  const generateWidgetsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Reporte de Productos Más y Menos Vendidos', 14, 22);
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total de unidades vendidas: ${totalSales}`, 14, 38);

    const widgetData = [
      ['Más Vendido', topProducts[0]?.[0] || 'N/A', topProducts[0]?.[1] || 0, `${getPercentage(topProducts[0]?.[1] || 0)}%`],
      ['Segundo Más Vendido', topProducts[1]?.[0] || 'N/A', topProducts[1]?.[1] || 0, `${getPercentage(topProducts[1]?.[1] || 0)}%`],
      ['Tercer Más Vendido', topProducts[2]?.[0] || 'N/A', topProducts[2]?.[1] || 0, `${getPercentage(topProducts[2]?.[1] || 0)}%`],
      ['Menos Vendido', leastSoldProduct[0], leastSoldProduct[1], `${getPercentage(leastSoldProduct[1])}%`]
    ];

    autoTable(doc, {
      startY: 45,
      head: [['Categoría', 'Producto', 'Unidades Vendidas', 'Porcentaje']],
      body: widgetData,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [97, 97, 97], textColor: [255, 255, 255] },
      columnStyles: { 0: { fontStyle: 'bold' } }
    });

    doc.save('Reporte_Productos_Vendidos.pdf');
  };

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
        Detalle de Ventas
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField
          variant="outlined"
          placeholder="Filtrar por Producto, ID Venta, Nombre, Apellido o Gmail..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#757575' }} />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400, borderRadius: 2 }}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<PictureAsPdf />}
            onClick={generateTablePDF}
            sx={{ bgcolor: '#0288d1', '&:hover': { bgcolor: '#0277bd' } }}
          >
            PDF Tabla
          </Button>
          <Button
            variant="contained"
            startIcon={<PictureAsPdf />}
            onClick={generateWidgetsPDF}
            sx={{ bgcolor: '#0288d1', '&:hover': { bgcolor: '#0277bd' } }}
          >
            PDF Widgets
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper} sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
        <Table sx={{ '& .MuiTableCell-root': { padding: '6px 8px', fontSize: '0.875rem' } }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(189, 189, 189, 0.2)' }}>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Receipt sx={{ mr: 1, color: '#0288d1', fontSize: '1.2rem' }} /> ID
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Storefront sx={{ mr: 1, color: '#388e3c', fontSize: '1.2rem' }} /> ID Venta
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ShoppingCart sx={{ mr: 1, color: '#f57c00', fontSize: '1.2rem' }} /> Producto
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ProductionQuantityLimits sx={{ mr: 1, color: '#0288d1', fontSize: '1.2rem' }} /> Cantidad
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AttachMoney sx={{ mr: 1, color: '#388e3c', fontSize: '1.2rem' }} /> Precio
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MonetizationOn sx={{ mr: 1, color: '#f57c00', fontSize: '1.2rem' }} /> Subtotal
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 1, color: '#0288d1', fontSize: '1.2rem' }} /> Nombre
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Badge sx={{ mr: 1, color: '#388e3c', fontSize: '1.2rem' }} /> Apellido
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Email sx={{ mr: 1, color: '#f57c00', fontSize: '1.2rem' }} /> Gmail
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarToday sx={{ mr: 1, color: '#0288d1', fontSize: '1.2rem' }} /> Fecha Venta
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDetalleVentas.length > 0 ? (
              filteredDetalleVentas
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((detalle) => (
                  <TableRow
                    key={detalle.id}
                    sx={{ '&:hover': { backgroundColor: '#f5f5f5' }, height: '36px' }}
                  >
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{detalle.id}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{detalle.id_venta}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{detalle.nombre_producto}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{detalle.cantidad}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>${detalle.precio}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>${detalle.subtotal}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{detalle.nombre}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{detalle.apellidopa}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{detalle.gmail}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                      {new Date(detalle.fecha_venta).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ borderBottom: '1px solid #e0e0e0', height: '36px' }}>
                  No hay datos disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredDetalleVentas.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ backgroundColor: 'rgba(189, 189, 189, 0.1)', fontSize: '0.875rem', padding: '4px' }}
        />
      </TableContainer>

      {/* Widgets Circulares */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 3 }}>
        <Paper
          sx={{
            p: 2, borderRadius: '50%', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', bgcolor: '#ffffff',
            width: 180, height: 180, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', border: '2px solid #ffd700', transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': { transform: 'scale(1.08)', boxShadow: '0 12px 32px rgba(0,0,0,0.2)' }
          }}
        >
          <Typography variant="subtitle2" sx={{ color: '#424242', fontWeight: 'bold', mb: 1 }}>
            Más Vendido
          </Typography>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" value={getPercentage(topProducts[0]?.[1] || 0)} size={100} thickness={6} sx={{ color: '#ffd700', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
            <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" sx={{ color: '#424242', fontWeight: 'bold' }}>{getPercentage(topProducts[0]?.[1] || 0)}%</Typography>
            </Box>
          </Box>
          <Typography variant="caption" sx={{ mt: 1, color: '#757575', fontWeight: 'medium' }}>{topProducts[0]?.[1] || 0} unidades</Typography>
        </Paper>
        <Paper
          sx={{
            p: 2, borderRadius: '50%', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', bgcolor: '#ffffff',
            width: 180, height: 180, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', border: '2px solid #c0c0c0', transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': { transform: 'scale(1.08)', boxShadow: '0 12px 32px rgba(0,0,0,0.2)' }
          }}
        >
          <Typography variant="subtitle2" sx={{ color: '#424242', fontWeight: 'bold', mb: 1 }}>
            Segundo Más Vendido
          </Typography>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" value={getPercentage(topProducts[1]?.[1] || 0)} size={100} thickness={6} sx={{ color: '#c0c0c0', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
            <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" sx={{ color: '#424242', fontWeight: 'bold' }}>{getPercentage(topProducts[1]?.[1] || 0)}%</Typography>
            </Box>
          </Box>
          <Typography variant="caption" sx={{ mt: 1, color: '#757575', fontWeight: 'medium' }}>{topProducts[1]?.[1] || 0} unidades</Typography>
        </Paper>
        <Paper
          sx={{
            p: 2, borderRadius: '50%', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', bgcolor: '#ffffff',
            width: 180, height: 180, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', border: '2px solid #cd7f32', transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': { transform: 'scale(1.08)', boxShadow: '0 12px 32px rgba(0,0,0,0.2)' }
          }}
        >
          <Typography variant="subtitle2" sx={{ color: '#424242', fontWeight: 'bold', mb: 1 }}>
            Tercer Más Vendido
          </Typography>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" value={getPercentage(topProducts[2]?.[1] || 0)} size={100} thickness={6} sx={{ color: '#cd7f32', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
            <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" sx={{ color: '#424242', fontWeight: 'bold' }}>{getPercentage(topProducts[2]?.[1] || 0)}%</Typography>
            </Box>
          </Box>
          <Typography variant="caption" sx={{ mt: 1, color: '#757575', fontWeight: 'medium' }}>{topProducts[2]?.[1] || 0} unidades</Typography>
        </Paper>
        <Paper
          sx={{
            p: 2, borderRadius: '50%', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', bgcolor: '#ffffff',
            width: 180, height: 180, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', border: '2px solid #ef5350', transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': { transform: 'scale(1.08)', boxShadow: '0 12px 32px rgba(0,0,0,0.2)' }
          }}
        >
          <Typography variant="subtitle2" sx={{ color: '#424242', fontWeight: 'bold', mb: 1 }}>
            Menos Vendido
          </Typography>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" value={getPercentage(leastSoldProduct[1])} size={100} thickness={6} sx={{ color: '#ef5350', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
            <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" sx={{ color: '#424242', fontWeight: 'bold' }}>{getPercentage(leastSoldProduct[1])}%</Typography>
            </Box>
          </Box>
          <Typography variant="caption" sx={{ mt: 1, color: '#757575', fontWeight: 'medium' }}>{leastSoldProduct[1] || 0} unidades</Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default DetallesVentas;