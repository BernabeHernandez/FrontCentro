import React, { useEffect, useState } from 'react';
import { message } from 'antd';
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

const TerminosF = () => {
  const [termino, setTermino] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTerminos = async () => {
      try {
        const response = await fetch('https://backendcentro.onrender.com/api/terminos/ultimo');
        if (!response.ok) {
          throw new Error('Error al cargar los términos');
        }
        const data = await response.json();
        setTermino(data);
      } catch (err) {
        setError(err.message);
        message.error('Error al cargar los términos');
      } finally {
        setLoading(false);
      }
    };

    fetchTerminos();
  }, []);

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
          Error: {error}
        </Typography>
      </Box>
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
              {termino.titulo || 'Términos y Condiciones'}
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
            {/* Introduction */}
            <Box sx={{ bgcolor: '#374151', color: 'white', p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <FileText size={24} style={{ marginTop: '4px', flexShrink: 0 }} />
                <Box>
                  <Typography variant="h2" sx={{ color: 'white', mb: 2 }}>
                    Introducción
                  </Typography>
                  <Typography sx={{ color: '#d1d5db', lineHeight: 1.6 }}>
                    {termino.contenido}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <CardContent sx={{ p: 4 }}>
              {termino.secciones && termino.secciones.length > 0 ? (
                termino.secciones.map((section, index) => (
                  <Section
                    key={index}
                    color={Object.keys(sectionColors)[index % Object.keys(sectionColors).length]}
                    icon={<FileText size={20} />}
                    title={`${index + 1}. ${section.titulo}`}
                  >
                    <Typography sx={{ color: '#6b7280', mb: 2, lineHeight: 1.6 }}>
                      {section.contenido}
                    </Typography>
                  </Section>
                ))
              ) : (
                <Typography sx={{ color: '#6b7280', textAlign: 'center', mt: 4 }}>
                  No hay secciones disponibles.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default TerminosF;