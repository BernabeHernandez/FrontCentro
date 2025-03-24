import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  MedicalServices as ServiceIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as StatusIcon,
  Create as CreateIcon,
  DoneAll as DoneIcon
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

  const manejarCambioPagina = (evento, nuevaPagina) => {
    setPagina(nuevaPagina);
  };

  const manejarCambioFilasPorPagina = (evento) => {
    setFilasPorPagina(parseInt(evento.target.value, 10));
    setPagina(0);
  };

  const manejarCambioFiltro = (evento) => {
    const { name, value } = evento.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Detalle de Citas</Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          label="Fecha de Cita"
          type="date"
          name="fecha_cita"
          value={filtros.fecha_cita}
          onChange={manejarCambioFiltro}
          InputLabelProps={{ shrink: true }}
          sx={{ width: 200 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
              <TableCell>
                <IconButton size="small" disabled>
                  <PersonIcon sx={{ color: '#4caf50' }} />
                </IconButton>
                Usuario
              </TableCell>
              <TableCell>
                <IconButton size="small" disabled>
                  <EmailIcon sx={{ color: '#f44336' }} />
                </IconButton>
                Correo
              </TableCell>
              <TableCell>
                <IconButton size="small" disabled>
                  <PhoneIcon sx={{ color: '#9c27b0' }} />
                </IconButton>
                Teléfono
              </TableCell>
              <TableCell>
                <IconButton size="small" disabled>
                  <CalendarIcon sx={{ color: '#ff9800' }} />
                </IconButton>
                Fecha de Cita
              </TableCell>
              <TableCell>
                <IconButton size="small" disabled>
                  <TimeIcon sx={{ color: '#2196f3' }} />
                </IconButton>
                Hora de Inicio
              </TableCell>
              <TableCell>
                <IconButton size="small" disabled>
                  <TimeIcon sx={{ color: '#2196f3' }} />
                </IconButton>
                Hora de Fin
              </TableCell>
              <TableCell>
                <IconButton size="small" disabled>
                  <ServiceIcon sx={{ color: '#e91e63' }} />
                </IconButton>
                Servicio
              </TableCell>
              <TableCell>
                <IconButton size="small" disabled>
                  <MoneyIcon sx={{ color: '#4caf50' }} />
                </IconButton>
                Precio
              </TableCell>
              <TableCell>
                <IconButton size="small" disabled>
                  <StatusIcon sx={{ color: '#ff5722' }} />
                </IconButton>
                Estado
              </TableCell>
              <TableCell>
                <IconButton size="small" disabled>
                  <CreateIcon sx={{ color: '#3f51b5' }} />
                </IconButton>
                Creado
              </TableCell>
              <TableCell>
                <IconButton size="small" disabled>
                  <DoneIcon sx={{ color: '#009688' }} />
                </IconButton>
                Fecha Completada
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {citasFiltradas
              .slice(pagina * filasPorPagina, pagina * filasPorPagina + filasPorPagina)
              .map((cita) => (
                <TableRow key={cita.id}>
              
                  <TableCell>{cita.nombre_usuario}</TableCell>
                  <TableCell>{cita.correo_usuario}</TableCell>
                  <TableCell>{cita.telefono_usuario}</TableCell>
                  <TableCell>{formatearFecha(cita.fecha_cita)}</TableCell>
                  <TableCell>{cita.hora_inicio}</TableCell>
                  <TableCell>{cita.hora_fin}</TableCell>
                  <TableCell>{cita.nombre_servicio}</TableCell>
                  <TableCell>${parseFloat(cita.precio_servicio).toFixed(2)}</TableCell>
                  <TableCell>{cita.estado}</TableCell>
                  <TableCell>{new Date(cita.created_at).toLocaleString('es-ES')}</TableCell>
                  <TableCell>
                    {cita.fecha_completada ? new Date(cita.fecha_completada).toLocaleString('es-ES') : '-'}
                  </TableCell>
                </TableRow>
              ))}
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
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </TableContainer>
    </Box>
  );
};

export default DetalleCitas;