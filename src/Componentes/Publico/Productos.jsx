import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardMedia, CardContent, Typography, Box, Breadcrumbs } from '@mui/material';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('https://backendcentro.onrender.com/api/productos');
        if (!response.ok) {
          throw new Error('Error al obtener los productos');
        }
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error('Error:', error);
        navigate('/error500');
      }
    };
    fetchProductos();
  }, []);

  const handleProductoClick = (id) => {
    navigate(`/detalles/${id}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Typography color="text.primary">Productos</Typography>
      </Breadcrumbs>

      {/* Grid de productos */}
      <Grid container spacing={3}>
        {productos.map((producto) => (
          <Grid item key={producto.id} xs={12} sm={6} md={4} lg={3}>
            <Card 
              sx={{ 
                cursor: 'pointer', 
                transition: 'transform 0.2s ease-in-out', 
                '&:hover': { transform: 'scale(1.05)' } 
              }}
              onClick={() => handleProductoClick(producto.id)}
            >
              {/* Imagen */}
              <CardMedia
                component="img"
                height="200"
                image={producto.imagen}
                alt={producto.nombre}
                sx={{ objectFit: 'contain', backgroundColor: '#f9f9f9' }}
              />
              {/* Contenido */}
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ height: 50, overflow: 'hidden' }}>
                  {producto.nombre}
                </Typography>
                <Typography variant="h6" color="error">
                  ${producto.precio}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Productos;
