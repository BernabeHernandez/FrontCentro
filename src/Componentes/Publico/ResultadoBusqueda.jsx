import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Breadcrumbs,
  Container,
  Skeleton,
  Fade,
  Pagination,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowForwardIos } from '@mui/icons-material';

// Styled Card similar a ProductosC.jsx
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
  },
  cursor: 'pointer',
  backgroundColor: '#fff',
  border: '1px solid #e5e7eb',
}));

const StyledPagination = styled(Pagination)(({ theme }) => ({
  '& .MuiPaginationItem-root': {
    borderRadius: '8px',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      color: '#fff',
    },
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  '& .MuiPaginationItem-previousNext': {
    backgroundColor: '#f3f4f6',
    color: theme.palette.grey[800],
    '&:hover': {
      backgroundColor: '#e5e7eb',
    },
  },
}));

const ResultadosBusqueda = () => {
  const [resultados, setResultados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [page, setPage] = useState(1);
  const resultadosPorPagina = 15;
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('https://backendcentro.onrender.com/api/buscar/categorias');
        setCategorias(response.data);
      } catch (err) {
        setError('Error al cargar las categorías.');
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    if (query) {
      setCategoriaSeleccionada('');
      fetchResultados();
    } else {
      setResultados([]);
    }
    // eslint-disable-next-line
  }, [query]);

  const fetchResultados = async () => {
    try {
      setLoading(true);
      let url = `https://backendcentro.onrender.com/api/buscar/search?query=${encodeURIComponent(query)}`;
      if (categoriaSeleccionada) {
        url += `&id_categoria=${categoriaSeleccionada}`;
      }
      const response = await axios.get(url);
      setResultados(response.data);
    } catch (err) {
      setError('Error al cargar los resultados de búsqueda.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      fetchResultados();
    }
    // eslint-disable-next-line
  }, [categoriaSeleccionada]);

  const handleCardClick = (tipo, id) => {
    if (tipo === 'producto') {
      navigate(`/detalles/${id}`);
    } else {
      navigate(`/detalle/${id}`);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Paginación de resultados
  const resultadosPaginados = resultados.slice(
    (page - 1) * resultadosPorPagina,
    page * resultadosPorPagina
  );

  return (
    <Fade in={true} timeout={700}>
      <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', py: 6 }}>
        <Container maxWidth="xl">
          {/* Breadcrumbs */}
          <Breadcrumbs
            aria-label="breadcrumb"
            separator={<ArrowForwardIos fontSize="small" />}
            sx={{ mb: 0.5 }}
          >
            <Typography
              color="text.primary"
              variant="h5"
              fontWeight="600"
              sx={{ color: '#1f2937' }}
            >
              Resultados para "{query}"
            </Typography>
          </Breadcrumbs>

          {/* Filtro de categorías */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
            <FormControl sx={{ minWidth: 240 }} size="medium">
              <InputLabel id="categoria-label">Buscar por Categoría</InputLabel>
              <Select
                labelId="categoria-label"
                id="categoria"
                value={categoriaSeleccionada}
                label="Buscar por Categoría"
                onChange={(e) => {
                  setCategoriaSeleccionada(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="">Todas las categorías</MenuItem>
                {categorias.map((categoria) => (
                  <MenuItem key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Grid de resultados */}
          {loading ? (
            <Grid container spacing={3}>
              {[...Array(resultadosPorPagina)].map((_, index) => (
                <Grid item key={index} xs={12} sm={6} md={4} lg={2.4}>
                  <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 4 }} />
                  <Skeleton variant="text" width="60%" sx={{ mt: 2, mx: 'auto' }} />
                  <Skeleton variant="text" width="40%" sx={{ mx: 'auto' }} />
                </Grid>
              ))}
            </Grid>
          ) : error ? (
            <Typography color="error" align="center" sx={{ mt: 4 }}>{error}</Typography>
          ) : resultados.length > 0 ? (
            <>
              <Grid container spacing={3}>
                {resultadosPaginados.map((item) => (
                  <Grid item key={`${item.tipo}-${item.id}`} xs={12} sm={6} md={4} lg={2.4}>
                    <StyledCard onClick={() => handleCardClick(item.tipo, item.id)}>
                      <CardMedia
                        component="img"
                        height="220"
                        image={item.imagen}
                        alt={item.nombre}
                        sx={{
                          objectFit: 'contain',
                          bgcolor: '#ffffff',
                          p: 3,
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      />
                      <CardContent sx={{ py: 3, px: 2 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight="600"
                          color="text.primary"
                          sx={{
                            height: 48,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            color: '#1f2937',
                          }}
                        >
                          {item.nombre}
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight="700"
                          sx={{ mt: 1.5, color: '#22c55e' }}
                        >
                          ${item.precio?.toFixed ? item.precio.toFixed(2) : item.precio}
                        </Typography>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          sx={{ mt: 2, borderRadius: 2, textTransform: 'none' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(item.tipo, item.id);
                          }}
                        >
                          Ver detalles
                        </Button>
                      </CardContent>
                    </StyledCard>
                  </Grid>
                ))}
              </Grid>
              {/* Paginación */}
              {resultados.length > resultadosPorPagina && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, pb: 3 }}>
                  <StyledPagination
                    count={Math.ceil(resultados.length / resultadosPorPagina)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    sx={{ '& .MuiPagination-ul': { gap: '4px' } }}
                  />
                </Box>
              )}
            </>
          ) : (
            <Typography align="center" sx={{ mt: 4 }}>
              No se encontraron resultados para "{query}" con la categoría seleccionada.
            </Typography>
          )}
        </Container>
      </Box>
    </Fade>
  );
};

export default ResultadosBusqueda;

