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

const PoliticasHi = () => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  useEffect(() => {
    const obtenerHistorial = async () => {
      try {
        const respuesta = await axios.get('https://backendcentro.onrender.com/api/historialpoliticas');
        const datos = respuesta.data;

        const datosOrdenados = datos.sort((a, b) => {
          return parseFloat(b.version) - parseFloat(a.version);
        });

        const datosActualizados = datosOrdenados.map((politica, indice) => {
          let estado = "No Vigente";
          if (politica.estado === "eliminado") {
            estado = "Eliminado";
          } else if (indice === 0) {
            estado = "Vigente";
          }
          return {
            ...politica,
            estado: estado,
          };
        });

        setHistorial(datosActualizados);
      } catch (error) {
        setError('Error al obtener el historial de políticas');
        console.error('Error al obtener el historial de políticas:', error);
      } finally {
        setLoading(false);
      }
    };

    obtenerHistorial();
  }, []);

  const manejarMostrar = async (id) => {
    try {
      await axios.patch(`https://backendcentro.onrender.com/api/historialpoliticas/${id}`, { Estado: "activo" });
      setHistorial((prevHistorial) =>
        prevHistorial.map((politica) =>
          politica.id === id ? { ...politica, estado: "No vigente" } : politica
        )
      );
    } catch (error) {
      console.error('Error al actualizar el estado de la política:', error);
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
          Historial de Políticas
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
                    <Typography variant="body1">No hay políticas en el historial</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedHistorial.map((politica, indice) => (
                  <StyledTableRow key={politica.id}>
                    <TableCell>{politica.titulo}</TableCell>
                    <TableCell>{politica.fechaVigencia}</TableCell>
                    <TableCell>{new Date(politica.fechaCreacion).toISOString().split('T')[0]}</TableCell>
                    <TableCell>{politica.version}</TableCell>
                    <TableCell>
                      <Chip
                        label={politica.estado}
                        color={
                          politica.estado === 'Vigente'
                            ? 'success'
                            : politica.estado === 'No Vigente'
                            ? 'error'
                            : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell>{politica.contenido}</TableCell>
                    <TableCell>
                      {politica.secciones && politica.secciones.length > 0 ? (
                        <List dense>
                          {politica.secciones.map((seccion, index) => (
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
                      {politica.estado === 'Eliminado' && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => manejarMostrar(politica.id)}
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

export default PoliticasHi;