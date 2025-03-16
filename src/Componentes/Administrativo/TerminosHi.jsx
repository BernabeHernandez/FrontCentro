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

const TerminosHi = () => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  useEffect(() => {
    const obtenerHistorial = async () => {
      try {
        const respuesta = await axios.get('https://backendcentro.onrender.com/api/historialterminos');
        const datos = respuesta.data;

        const datosOrdenados = datos.sort((a, b) => {
          return parseFloat(b.version) - parseFloat(a.version);
        });

        const datosActualizados = datosOrdenados.map((termino, indice) => {
          let estado = "No Vigente";
          if (termino.estado === "eliminado") {
            estado = "Eliminado";
          } else if (indice === 0) {
            estado = "Vigente";
          }
          return {
            ...termino,
            estado: estado,
          };
        });

        setHistorial(datosActualizados);
      } catch (error) {
        setError('Error al obtener el historial de términos');
        console.error('Error al obtener el historial de términos:', error);
      } finally {
        setLoading(false);
      }
    };

    obtenerHistorial();
  }, []);

  const manejarMostrar = async (id) => {
    try {
      await axios.patch(`https://backendcentro.onrender.com/api/historialterminos/${id}`, { Estado: "activo" });
      setHistorial((prevHistorial) =>
        prevHistorial.map((termino) =>
          termino.id === id ? { ...termino, estado: "No vigente" } : termino
        )
      );
    } catch (error) {
      console.error('Error al actualizar el estado del término:', error);
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
          Historial de Términos y Condiciones
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
                    <Typography variant="body1">No hay términos en el historial</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedHistorial.map((termino, indice) => (
                  <StyledTableRow key={termino.id}>
                    <TableCell>{termino.titulo}</TableCell>
                    <TableCell>{termino.fechaVigencia}</TableCell>
                    <TableCell>{new Date(termino.fechaCreacion).toISOString().split('T')[0]}</TableCell>
                    <TableCell>{termino.version}</TableCell>
                    <TableCell>
                      <Chip
                        label={termino.estado}
                        color={
                          termino.estado === 'Vigente'
                            ? 'success'
                            : termino.estado === 'No Vigente'
                            ? 'error'
                            : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell>{termino.contenido}</TableCell>
                    <TableCell>
                      {termino.secciones && termino.secciones.length > 0 ? (
                        <List dense>
                          {termino.secciones.map((seccion, index) => (
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
                      {termino.estado === 'Eliminado' && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => manejarMostrar(termino.id)}
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

export default TerminosHi;