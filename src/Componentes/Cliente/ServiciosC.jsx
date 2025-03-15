import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import Breadcrumbs from '../Navegacion/BreadcrumbsServicios';

const ServiciosC = () => {
  const [servicios, setServicios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await fetch('https://backendcentro.onrender.com/api/servicios');
        if (!response.ok) {
          throw new Error('Error al obtener los servicios');
        }
        const data = await response.json();
        setServicios(data);
      } catch (error) {
        console.error('Error:', error);
        navigate('/cliente/error500');
      }
    };

    fetchServicios();
  }, []);

  const handleServicioClick = (id) => {
    navigate(`/cliente/detalle/${id}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumbs />

      <Grid container spacing={3} justifyContent="center">
        {servicios.map((servicio) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={servicio.id}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'scale(1.05)' },
                boxShadow: 3,
              }}
              onClick={() => handleServicioClick(servicio.id)}
            >
              <CardMedia
                component="img"
                height="200"
                image={servicio.imagen}
                alt={servicio.nombre}
                sx={{ objectFit: 'contain', bgcolor: '#f9f9f9' }}
              />
              <CardContent>
                <Typography variant="h6" component="div" align="center" sx={{ fontWeight: 'bold', height: '50px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {servicio.nombre}
                </Typography>
                <Typography variant="body1" color="error" align="center" sx={{ fontWeight: 'bold', mt: 1 }}>
                  ${servicio.precio}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ServiciosC;
