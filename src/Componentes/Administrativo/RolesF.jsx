import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, CircularProgress, Chip, TablePagination,
  TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel,
} from '@mui/material';
import {
  Person, Email as EmailIcon, Phone as PhoneIcon, Badge as BadgeIcon,
  AdminPanelSettings, MedicalServices, DeliveryDining, Search as SearchIcon,
} from '@mui/icons-material';

const RolesF = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Todos');

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('https://backendcentro.onrender.com/api/roles');
        if (!response.ok) {
          throw new Error('Error al cargar los usuarios');
        }
        const data = await response.json();
        setUsuarios(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleFilterType = (event) => {
    setFilterType(event.target.value);
    setPage(0);
  };

  const filteredUsuarios = usuarios.filter((usuario) => {
    const matchesSearch = usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          usuario.gmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'Todos' || usuario.tipo === filterType;
    return matchesSearch && matchesType;
  });

  const paginatedUsuarios = filteredUsuarios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getChipProps = (tipo) => {
    switch (tipo) {
      case 'Cliente':
        return { icon: <Person />, color: 'success' };
      case 'Administrador':
        return { icon: <AdminPanelSettings />, color: 'warning' };
      case 'Terapeuta':
        return { icon: <MedicalServices />, color: 'primary' };
      case 'Repartidor':
        return { icon: <DeliveryDining />, color: 'secondary' };
      default:
        return { icon: <Person />, color: 'default' };
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '92%', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#424242', mb: 3 }}>
        Usuarios y Roles
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          variant="outlined"
          placeholder="Buscar por nombre o correo..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#757575' }} />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400, borderRadius: 2 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Tipo</InputLabel>
          <Select
            value={filterType}
            onChange={handleFilterType}
            label="Tipo"
          >
            <MenuItem value="Todos">Todos</MenuItem>
            <MenuItem value="Cliente">Cliente</MenuItem>
            <MenuItem value="Administrador">Administrador</MenuItem>
            <MenuItem value="Terapeuta">Terapeuta</MenuItem>
            <MenuItem value="Repartidor">Repartidor</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
        <Table sx={{ '& .MuiTableCell-root': { padding: '6px 8px', fontSize: '0.875rem' } }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(189, 189, 189, 0.2)' }}>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 1, color: '#0288d1', fontSize: '1.2rem' }} /> Nombre
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BadgeIcon sx={{ mr: 1, color: '#388e3c', fontSize: '1.2rem' }} /> Apellido Paterno
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BadgeIcon sx={{ mr: 1, color: '#f57c00', fontSize: '1.2rem' }} /> Apellido Materno
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon sx={{ mr: 1, color: '#0288d1', fontSize: '1.2rem' }} /> Correo Electrónico
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 1, color: '#388e3c', fontSize: '1.2rem' }} /> Usuario
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon sx={{ mr: 1, color: '#f57c00', fontSize: '1.2rem' }} /> Teléfono
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AdminPanelSettings sx={{ mr: 1, color: '#0288d1', fontSize: '1.2rem' }} /> Tipo
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MedicalServices sx={{ mr: 1, color: '#388e3c', fontSize: '1.2rem' }} /> Módulos de Acceso
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsuarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ borderBottom: '1px solid #e0e0e0', height: '36px' }}>
                  <Typography variant="body1">No se encontraron usuarios.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsuarios.map((usuario) => {
                const { icon, color } = getChipProps(usuario.tipo);
                return (
                  <TableRow key={usuario.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' }, height: '36px' }}>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{usuario.nombre}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{usuario.apellidopa}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{usuario.apellidoma}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{usuario.gmail}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{usuario.user}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{usuario.telefono}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                      <Chip label={usuario.tipo} icon={icon} color={color} size="small" />
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{usuario.modulos}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsuarios.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ backgroundColor: 'rgba(189, 189, 189, 0.1)', fontSize: '0.875rem', padding: '4px' }}
        />
      </TableContainer>
    </Box>
  );
};

export default RolesF;