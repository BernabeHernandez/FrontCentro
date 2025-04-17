import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TablePagination,
} from '@mui/material';
import {
  Person,
  Email,
  Warning,
  Lock,
  LockOpen,
} from '@mui/icons-material';

const UserSospechosos = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchUsuariosSospechosos = async () => {
      try {
        const response = await axios.get('https://backendcentro.onrender.com/api/sospechoso');
        setUsuarios(response.data);
      } catch (err) {
        console.error('Error al obtener usuarios sospechosos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuariosSospechosos();
  }, []);

  const handleBloquearDesbloquear = async (userId, estadoBloqueo) => {
    try {
      const action = estadoBloqueo ? 'desbloquear' : 'bloquear';
      const response = await axios.patch(`https://backendcentro.onrender.com/api/sospechoso/${action}/${userId}`);
      const updatedUsuarios = usuarios.map(user =>
        user.id === userId ? { ...user, estadoBloqueo: response.data.estadoBloqueo } : user
      );
      setUsuarios(updatedUsuarios);
    } catch (err) {
      console.error('Error al realizar la acción:', err);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', padding: '50px 0' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#424242', textAlign: 'center', mb: 4 }}>
        Lista Negra
      </Typography>

      <TableContainer component={Paper} sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
        <Table sx={{ '& .MuiTableCell-root': { padding: '6px 8px', fontSize: '0.875rem' } }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(189, 189, 189, 0.2)' }}>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 1, color: '#0288d1', fontSize: '1.2rem' }} /> Usuario
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 1, color: '#388e3c', fontSize: '1.2rem' }} /> Nombre
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 1, color: '#f57c00', fontSize: '1.2rem' }} /> Apellido PA
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Warning sx={{ mr: 1, color: '#d32f2f', fontSize: '1.2rem' }} /> Intentos
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Email sx={{ mr: 1, color: '#0288d1', fontSize: '1.2rem' }} /> Correo
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Lock sx={{ mr: 1, color: '#7b1fa2', fontSize: '1.2rem' }} /> Acción
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.length > 0 ? (
              usuarios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                <TableRow
                  key={user.id}
                  sx={{
                    '&:hover': { backgroundColor: '#f5f5f5' },
                    height: '36px',
                    backgroundColor: user.IntentoSospechosos >= 10 ? 'rgba(63, 134, 0, 0.1)' : 'rgba(250, 173, 20, 0.1)',
                  }}
                >
                  <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{user.user}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{user.nombre}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{user.apellidopa}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{user.IntentoSospechosos}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{user.gmail}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                    <Button
                      variant="contained"
                      color={user.estadoBloqueo ? 'success' : 'error'}
                      size="small"
                      startIcon={user.estadoBloqueo ? <LockOpen /> : <Lock />}
                      onClick={() => handleBloquearDesbloquear(user.id, user.estadoBloqueo)}
                      sx={{ padding: '4px 8px', fontSize: '0.75rem' }}
                    >
                      {user.estadoBloqueo ? 'Desbloquear' : 'Bloquear'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ borderBottom: '1px solid #e0e0e0', height: '36px' }}>
                  No se encontraron usuarios sospechosos
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={usuarios.length}
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

export default UserSospechosos;