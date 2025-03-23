import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Box
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';

const OpcionesRestauracion = () => {
  const navigate = useNavigate();

  const opciones = [
    {
      id: 1,
      metodo: 'Por correo',
      descripcion: 'Recibe un codigo de restauración en tu email registrado',
      icono: <EmailIcon fontSize="large" />,
      ruta: '/verificar_correo'
    },
    {
      id: 2,
      metodo: 'Por SMS',
      descripcion: 'Recibe un código de verificación en tu número telefónico',
      icono: <PhoneIcon fontSize="large" />,
      ruta: '/verificarUserSMS'
    },
    {
      id: 3,
      metodo: 'Por pregunta secreta',
      descripcion: 'Responde tu pregunta de seguridad previamente configurada',
      icono: <LockIcon fontSize="large" />,
      ruta: '/verificacionUserp'
    }
  ];

  const manejarSeleccion = (ruta) => {
    navigate(ruta);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography 
        variant="h4" 
        component="h2" 
        align="center" 
        gutterBottom 
        sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}
      >
        Opciones de Restauración de Contraseña
      </Typography>
      
      <Grid container spacing={3}>
        {opciones.map((opcion) => (
          <Grid item xs={12} sm={4} key={opcion.id}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': { 
                  transform: 'translateY(-4px)',
                  boxShadow: 6 
                }
              }}
            >
              <CardActionArea 
                onClick={() => manejarSeleccion(opcion.ruta)}
                sx={{ p: 2 }}
              >
                <CardContent>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      textAlign: 'center'
                    }}
                  >
                    <Box sx={{ mb: 2, color: 'primary.main' }}>
                      {opcion.icono}
                    </Box>
                    <Typography 
                      variant="h6" 
                      component="div" 
                      sx={{ fontWeight: 'medium', mb: 1 }}
                    >
                      {opcion.metodo}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                    >
                      {opcion.descripcion}
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default OpcionesRestauracion;