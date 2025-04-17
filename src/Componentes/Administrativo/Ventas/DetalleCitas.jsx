import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, TextField, FormControl, InputLabel, Select, MenuItem,
  Box, Typography, CircularProgress, InputAdornment,
} from '@mui/material';
import {
  Person as PersonIcon, Email as EmailIcon, Phone as PhoneIcon,
  CalendarToday as CalendarIcon, AccessTime as TimeIcon, MedicalServices as ServiceIcon,
  AttachMoney as MoneyIcon, CheckCircle as StatusIcon, Create as CreateIcon,
  DoneAll as DoneIcon, Search as SearchIcon,
} from '@mui/icons-material';

const DetalleCitas = () => {
  const [citas, setCitas] = useState([]);
  const [citasFiltradas, setCitasFiltradas] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [filasPorPagina, setFilasPorPagina] = useState(10);
  const [filtros, setFiltros] = useState({
    fecha_cita: '',
    estado: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarCitas();
  }, []);

  useEffect(() => {
    filtrarCitas();
  }, [filtros, citas]);

  const cargarCitas = async () => {
    try {
      const response = await fetch('https://backendcentro.onrender.com/api/detallecitas/detallecitas');
      const datos = await response.json();
      setCitas(datos);
      setCitasFiltradas(datos);
    } catch (error) {
      console.error('Error al cargar citas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtrarCitas = () => {
    let resultado = [...citas];

    if (filtros.fecha_cita) {
      resultado = resultado.filter(cita =>
        new Date(cita.fecha_cita).toISOString().split('T')[0] === filtros.fecha_cita
      );
    }

    if (filtros.estado) {
      resultado = resultado.filter(cita => cita.estado === filtros.estado);
    }

    setCitasFiltradas(resultado);
    setPagina(0);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const manejarCambioPagina = (event, nuevaPagina) => {
    setPagina(nuevaPagina);
  };

  const manejarCambioFilasPorPagina = (event) => {
    setFilasPorPagina(parseInt(event.target.value, 10));
    setPagina(0);
  };

  const manejarCambioFiltro = (event) => {
    const { name, value } = event.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
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
        Detalle de Citas
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          variant="outlined"
          placeholder="Filtrar por fecha..."
          type="date"
          name="fecha_cita"
          value={filtros.fecha_cita}
          onChange={manejarCambioFiltro}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#757575' }} />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 250, borderRadius: 2 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Estado</InputLabel>
          <Select
            name="estado"
            value={filtros.estado}
            onChange={manejarCambioFiltro}
            label="Estado"
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="pendiente">Pendiente</MenuItem>
            <MenuItem value="completada">Completada</MenuItem>
            <MenuItem value="cancelada">Cancelada</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
        <Table sx={{ '& .MuiTableCell-root': { padding: '6px 8px', fontSize: '0.875rem' } }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(189, 189, 189, 0.2)' }}>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ mr: 1, color: '#0288d1', fontSize: '1.2rem' }} /> Usuario
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon sx={{ mr: 1, color: '#388e3c', fontSize: '1.2rem' }} /> Correo
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon sx={{ mr: 1, color: '#f57c00', fontSize: '1.2rem' }} /> Teléfono
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarIcon sx={{ mr: 1, color: '#0288d1', fontSize: '1.2rem' }} /> Fecha de Cita
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TimeIcon sx={{ mr: 1, color: '#388e3c', fontSize: '1.2rem' }} /> Hora de Inicio
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TimeIcon sx={{ mr: 1, color: '#f57c00', fontSize: '1.2rem' }} /> Hora de Fin
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ServiceIcon sx={{ mr: 1, color: '#0288d1', fontSize: '1.2rem' }} /> Servicio
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MoneyIcon sx={{ mr: 1, color: '#388e3c', fontSize: '1.2rem' }} /> Precio
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <StatusIcon sx={{ mr: 1, color: '#f57c00', fontSize: '1.2rem' }} /> Estado
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CreateIcon sx={{ mr: 1, color: '#0288d1', fontSize: '1.2rem' }} /> Creado
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DoneIcon sx={{ mr: 1, color: '#388e3c', fontSize: '1.2rem' }} /> Fecha Completada
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {citasFiltradas.length > 0 ? (
              citasFiltradas
                .slice(pagina * filasPorPagina, pagina * filasPorPagina + filasPorPagina)
                .map((cita) => (
                  <TableRow key={cita.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' }, height: '36px' }}>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{cita.nombre_usuario}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{cita.correo_usuario}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{cita.telefono_usuario}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{formatearFecha(cita.fecha_cita)}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{cita.hora_inicio}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{cita.hora_fin}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{cita.nombre_servicio}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>${parseFloat(cita.precio_servicio).toFixed(2)}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{cita.estado}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{new Date(cita.created_at).toLocaleString('es-ES')}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                      {cita.fecha_completada ? new Date(cita.fecha_completada).toLocaleString('es-ES') : '-'}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ borderBottom: '1px solid #e0e0e0', height: '36px' }}>
                  No hay citas disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={citasFiltradas.length}
          rowsPerPage={filasPorPagina}
          page={pagina}
          onPageChange={manejarCambioPagina}
          onRowsPerPageChange={manejarCambioFilasPorPagina}
          sx={{ backgroundColor: 'rgba(189, 189, 189, 0.1)', fontSize: '0.875rem', padding: '4px' }}
        />
      </TableContainer>
    </Box>
  );
};

export default DetalleCitas;