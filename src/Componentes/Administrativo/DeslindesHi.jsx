import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
  Button,
  Pagination,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const DeslindesHi = () => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  useEffect(() => {
    const obtenerHistorial = async () => {
      try {
        const respuesta = await axios.get('https://backendcentro.onrender.com/api/historialdeslindes');
        const datos = respuesta.data;

        const datosOrdenados = datos.sort((a, b) => {
          return parseFloat(b.version) - parseFloat(a.version);
        });

        const datosActualizados = datosOrdenados.map((deslinde, indice) => {
          let estado = "No Vigente";
          if (deslinde.estado === "eliminado") {
            estado = "Eliminado";
          } else if (indice === 0) {
            estado = "Vigente";
          }
          return {
            ...deslinde,
            estado: estado,
          };
        });

        setHistorial(datosActualizados);
      } catch (error) {
        setError('Error al obtener el historial de deslindes');
        console.error('Error al obtener el historial de deslindes:', error);
      } finally {
        setLoading(false);
      }
    };

    obtenerHistorial();
  }, []);

  const manejarMostrar = async (id) => {
    try {
      await axios.patch(`https://backendcentro.onrender.com/api/historialdeslindes/${id}`, { Estado: "activo" });
      setHistorial((prevHistorial) =>
        prevHistorial.map((deslinde) =>
          deslinde.id === id ? { ...deslinde, estado: "No vigente" } : deslinde
        )
      );
    } catch (error) {
      console.error('Error al actualizar el estado del deslinde:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedHistorial = historial.slice((page - 1) * rowsPerPage, page * rowsPerPage);

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
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Historial de Deslindes
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Título</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Fecha de Vigencia</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Fecha de Creación</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Versión</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Contenido</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Secciones</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedHistorial.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body1">No hay deslindes en el historial</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedHistorial.map((deslinde, indice) => (
                  <StyledTableRow key={deslinde.id}>
                    <TableCell>{deslinde.titulo}</TableCell>
                    <TableCell>{deslinde.fechaVigencia}</TableCell>
                    <TableCell>{new Date(deslinde.fechaCreacion).toISOString().split('T')[0]}</TableCell>
                    <TableCell>{deslinde.version}</TableCell>
                    <TableCell>
                      <Chip
                        label={deslinde.estado}
                        color={
                          deslinde.estado === 'Vigente'
                            ? 'success'
                            : deslinde.estado === 'No Vigente'
                            ? 'error'
                            : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell>{deslinde.contenido}</TableCell>
                    <TableCell>
                      {deslinde.secciones && deslinde.secciones.length > 0 ? (
                        <List dense>
                          {deslinde.secciones.map((seccion, index) => (
                            <ListItem key={index}>
                              <ListItemText
                                primary={seccion.titulo}
                                secondary={seccion.contenido}
                              />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography variant="body2">No hay secciones</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {deslinde.estado === 'Eliminado' && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => manejarMostrar(deslinde.id)}
                        >
                          Mostrar
                        </Button>
                      )}
                    </TableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={Math.ceil(historial.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="primary"
          />
        </Box>
      </Box>
    </Container>
  );
};

export default DeslindesHi;