import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Container,
  Box,
  CircularProgress,
  Chip,
  Pagination,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Person, AdminPanelSettings, MedicalServices, DeliveryDining, Search } from '@mui/icons-material';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const RolesF = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(1); // Resetear a la primera página al buscar
  };

  const handleFilterType = (event) => {
    setFilterType(event.target.value);
    setPage(1); // Resetear a la primera página al filtrar
  };

  const filteredUsuarios = usuarios.filter((usuario) => {
    const matchesSearch = usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          usuario.gmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'Todos' || usuario.tipo === filterType;
    return matchesSearch && matchesType;
  });

  const paginatedUsuarios = filteredUsuarios.slice((page - 1) * rowsPerPage, page * rowsPerPage);

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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Usuarios y Roles
        </Typography>

        {/* Filtros y búsqueda */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar por nombre o correo"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Select
            value={filterType}
            onChange={handleFilterType}
            variant="outlined"
            sx={{ minWidth: '150px' }}
          >
            <MenuItem value="Todos">Todos</MenuItem>
            <MenuItem value="Cliente">Cliente</MenuItem>
            <MenuItem value="Administrador">Administrador</MenuItem>
            <MenuItem value="Terapeuta">Terapeuta</MenuItem>
            <MenuItem value="Repartidor">Repartidor</MenuItem>
          </Select>
        </Box>

        {/* Tabla de usuarios */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Apellido Paterno</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Apellido Materno</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Correo Electrónico</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Usuario</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Teléfono</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Módulos de Acceso</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsuarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body1">No se encontraron usuarios.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsuarios.map((usuario) => {
                  const { icon, color } = getChipProps(usuario.tipo);
                  return (
                    <StyledTableRow key={usuario.id}>
                      <TableCell>{usuario.nombre}</TableCell>
                      <TableCell>{usuario.apellidopa}</TableCell>
                      <TableCell>{usuario.apellidoma}</TableCell>
                      <TableCell>{usuario.gmail}</TableCell>
                      <TableCell>{usuario.user}</TableCell>
                      <TableCell>{usuario.telefono}</TableCell>
                      <TableCell>
                        <Chip
                          label={usuario.tipo}
                          icon={icon}
                          color={color}
                        />
                      </TableCell>
                      <TableCell>{usuario.modulos}</TableCell>
                    </StyledTableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Paginación */}
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={Math.ceil(filteredUsuarios.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="primary"
          />
        </Box>
      </Box>
    </Container>
  );
};

export default RolesF;