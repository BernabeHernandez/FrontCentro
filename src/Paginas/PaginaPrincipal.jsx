import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, Paper, Fade, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumbs from '../Componentes/Navegacion/BreadcrumbsProductos';
import product1 from "../Componentes/Imagenes/Image2.png";
import imageForBlackBackground1 from "../Componentes/Imagenes/fht6.jpg";
import imageForBlackBackground2 from "../Componentes/Imagenes/347317299795.jpg";
import imageForBlackBackground3 from "../Componentes/Imagenes/SL_0210121_40570_75.jpg";

const sections = [
  { id: 1, title: 'Centro de Rehabilitación Integral San Juan', description: 'Nos dedicamos a mejorar tu bienestar físico y mental...', backgroundImage: product1 },
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sections.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box>
      <Breadcrumbs />
      
      {/* Carrusel */}
      <Box sx={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
        <AnimatePresence>
          {sections.map((section, index) => (
            index === currentIndex && (
              <Fade in key={section.id} timeout={1000}>
                <Box
                  sx={{
                    position: 'absolute', width: '100%', height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundImage: `url(${section.backgroundImage})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    color: '#fff', textAlign: 'center', px: 3, py: 5,
                    '&::before': { content: '""', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', bgcolor: 'rgba(0,0,0,0.5)' }
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 2, maxWidth: '800px' }}>
                    <Typography variant={isSmallScreen ? "h4" : "h2"} fontWeight="bold" gutterBottom>
                      {section.title}
                    </Typography>
                    <Typography variant="body1">{section.description}</Typography>
                  </Box>
                </Box>
              </Fade>
            )
          ))}
        </AnimatePresence>
      </Box>

      {/* Sección de información */}
      <Container sx={{ py: 5 }}>
        <Grid container spacing={4}>
          {/* Horario de Atención */}
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: 'grey.900', color: 'white' }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom align="center">Horario de Atención</Typography>
                <Grid container spacing={2} justifyContent="center">
                  {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day) => (
                    <Grid item key={day} xs={6} sm={4}>
                      <Paper sx={{ p: 2, bgcolor: 'grey.800', color: 'white', textAlign: 'center' }}>
                        <Typography variant="subtitle1">{day}</Typography>
                        <Typography variant="body2">8:00 AM - 6:00 PM</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Ubicación */}
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: 'grey.900', color: 'white' }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom align="center">Ubicación</Typography>
                <Box sx={{ width: '100%', height: '300px', borderRadius: 2, overflow: 'hidden' }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d930.3116289179378!2d-98.40923193041279!3d21.14258569878345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d726976bcbeec9%3A0x46764bc322c8c614!2sCiber%20Melas!5e0!3m2!1ses!2smx!4v1740551723799!5m2!1ses!2smx"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
