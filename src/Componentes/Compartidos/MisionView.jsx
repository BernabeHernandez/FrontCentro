import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Container,
  Avatar,
  ThemeProvider,
  createTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Shield, FileText } from 'lucide-react';

// Crear tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
    },
    secondary: {
      main: '#64748b',
    },
  },
  typography: {
    h1: {
      fontSize: '2.25rem',
      fontWeight: 700,
      marginBottom: '1rem',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
      marginBottom: '1rem',
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
      marginBottom: '0.5rem',
    },
  },
});

const sectionColors = {
  blue: { main: '#3b82f6', light: '#dbeafe', bg: '#eff6ff' },
  green: { main: '#10b981', light: '#d1fae5', bg: '#ecfdf5' },
  purple: { main: '#8b5cf6', light: '#e9d5ff', bg: '#f3e8ff' },
  orange: { main: '#f59e0b', light: '#fed7aa', bg: '#fff7ed' },
  red: { main: '#ef4444', light: '#fecaca', bg: '#fef2f2' },
  indigo: { main: '#6366f1', light: '#c7d2fe', bg: '#eef2ff' },
  pink: { main: '#ec4899', light: '#fbcfe8', bg: '#fdf2f8' },
  yellow: { main: '#eab308', light: '#fde68a', bg: '#fefce8' },
  teal: { main: '#14b8a6', light: '#99f6e4', bg: '#f0fdfa' },
  cyan: { main: '#06b6d4', light: '#a5f3fc', bg: '#ecfeff' },
  gray: { main: '#374151', light: '#d1d5db', bg: '#f9fafb' },
};

const Section = ({ children, color, icon, title }) => {
  const colorScheme = sectionColors[color];

  return (
    <Box sx={{ borderLeft: `4px solid ${colorScheme.main}`, pl: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Avatar
          sx={{
            bgcolor: colorScheme.bg,
            color: colorScheme.main,
            width: 40,
            height: 40,
          }}
        >
          {icon}
        </Avatar>
        <Typography variant="h3" sx={{ color: '#111827', fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      {children}
    </Box>
  );
};

const MisionView = () => {
  const [mision, setMision] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerMision = async () => {
      try {
        const response = await axios.get('https://backendcentro.onrender.com/api/misionA/mision');
        if (response.data.length > 0) {
          setMision(response.data[0]);
        } else {
          setError('No se encontró ninguna misión.');
        }
      } catch (error) {
        console.error('Error al obtener la misión:', error);
        setError('Error al cargar la misión. Por favor, inténtelo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    obtenerMision();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Box mt={4}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #dbeafe 0%, #c7d2fe 100%)',
          py: 6,
          px: 2,
        }}
      >
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  bgcolor: '#2563eb',
                  width: 64,
                  height: 64,
                }}
              >
                <FileText size={32} color="white" />
              </Avatar>
            </Box>
            <Typography variant="h1" sx={{ color: '#111827', mb: 2 }}>
              Nuestra Misión
            </Typography>
            <Typography variant="h6" sx={{ color: '#6b7280', maxWidth: '600px', mx: 'auto' }}>
              Centro de Rehabilitación Integral San Juan
            </Typography>
          </Box>

          {/* Main Content */}
          <Card
            elevation={8}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {mision ? (
                <Section
                  color="blue"
                  icon={<FileText size={20} />}
                  title={mision.titulo}
                >
                  <Typography sx={{ color: '#6b7280', mb: 2, lineHeight: 1.6 }}>
                    {mision.contenido}
                  </Typography>
                </Section>
              ) : (
                <Typography sx={{ color: '#6b7280', textAlign: 'center', mt: 4 }}>
                  No hay información disponible sobre la misión.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default MisionView;