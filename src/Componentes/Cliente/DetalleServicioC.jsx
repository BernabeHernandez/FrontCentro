import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BreadcrumbsServicios from '../Navegacion/BreadcrumbsServicios';
import { Container, Grid, Typography, Button, Box, Paper, Avatar } from '@mui/material';

const DetallesServicioC = () => {
  const [servicio, setServicio] = useState(null);
  const [productosRelacionados, setProductosRelacionados] = useState([]);
  const [mostrarProductos, setMostrarProductos] = useState(3);  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServicio = async () => {
      try {
        const response = await fetch(`https://backendcentro.onrender.com/api/servicios/${id}`);
        if (!response.ok) {
          throw new Error('Error al obtener el servicio');
        }
        const data = await response.json();
        setServicio(data);

        const categoriaId = data.categoria_id; 
        const responseProductos = await fetch(`https://backendcentro.onrender.com/api/servicios?categoriaId=${categoriaId}`);
        const productosRelacionadosData = await responseProductos.json();
        setProductosRelacionados(productosRelacionadosData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchServicio();
  }, [id]);

  if (!servicio) {
    return <Typography>Cargando servicio...</Typography>;
  }

  const handlePagoClick = () => {
    navigate('/cliente/CitasCliente');
  };

  const manejarProductoRelacionadoClick = (idProducto) => {
    const productosRestantes = productosRelacionados.filter(prod => prod.id !== idProducto);
    setProductosRelacionados(productosRestantes);
    navigate(`/cliente/detalle/${idProducto}`);
  };

  const mostrarMasProductos = () => {
    setMostrarProductos(mostrarProductos + 3);
  };

  const mostrarMenosProductos = () => {
    setMostrarProductos(mostrarProductos - 3);
  };

  return (
    <div>
      <BreadcrumbsServicios />
      <Container maxWidth="lg" sx={{ paddingY: 4 }}>
        <Grid container spacing={4}>
          {/* Columna izquierda */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Box sx={{ mb: 2 }}>
                <img src={servicio.imagen} alt={servicio.nombre} style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
                {servicio.nombre}
              </Typography>
              <Typography variant="body1" sx={{ color: '#555', mb: 2 }}>
                <strong>Descripción:</strong> {servicio.descripcion}
              </Typography>
              <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 'bold', mb: 2 }}>
                Precio: ${servicio.precio}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Categoría:</strong> {servicio.categoria_nombre}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handlePagoClick}
                sx={{ padding: '12px', fontSize: '18px', mt: 2 }}
              >
                Sacar cita
              </Button>
            </Paper>
          </Grid>

          {/* Columna derecha */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                Servicios Relacionados
              </Typography>
              <Box sx={{ mb: 2 }}>
                {productosRelacionados.slice(0, mostrarProductos).map((prod) => (
                  <Box
                    key={prod.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: 2,
                      cursor: 'pointer',
                      borderBottom: '1px solid #ddd',
                      paddingBottom: 1
                    }}
                    onClick={() => manejarProductoRelacionadoClick(prod.id)}
                  >
                    <Avatar alt={prod.nombre} src={prod.imagen} sx={{ width: 60, height: 60, marginRight: 2 }} />
                    <Typography variant="body1" sx={{ flexGrow: 1 }}>
                      {prod.nombre}
                    </Typography>
                  </Box>
                ))}
              </Box>
              {mostrarProductos < productosRelacionados.length && (
                <Typography
                  variant="body2"
                  sx={{ color: '#007bff', cursor: 'pointer', textAlign: 'center' }}
                  onClick={mostrarMasProductos}
                >
                  ➡️ Mostrar más
                </Typography>
              )}
              {mostrarProductos > 3 && (
                <Typography
                  variant="body2"
                  sx={{ color: '#007bff', cursor: 'pointer', textAlign: 'center' }}
                  onClick={mostrarMenosProductos}
                >
                  ⬅️ Mostrar menos
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default DetallesServicioC;
