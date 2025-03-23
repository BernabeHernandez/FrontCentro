import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Avatar,
  Divider,
  LinearProgress,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  CircularProgress,
  Badge,
  Fade,
  Zoom,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Healing as HealingIcon,
  People as PeopleIcon,
  Event as EventIcon,
  BarChart as BarChartIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  LocalHospital as LocalHospitalIcon,
  Psychology as PsychologyIcon,
  FitnessCenter as FitnessCenterIcon,
  CalendarToday as CalendarTodayIcon,
  Assignment as AssignmentIcon,
  Group as GroupIcon,
  HealthAndSafety as HealthAndSafetyIcon,
  SentimentSatisfied as SentimentSatisfiedIcon,
  MonitorHeart as MonitorHeartIcon,
  Spa as SpaIcon,
  DirectionsRun as DirectionsRunIcon,
  ExpandMore as ExpandMoreIcon,
  Medication as MedicationIcon,
  VolunteerActivism as VolunteerActivismIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';

const HomeAdministrativa = () => {
  // Animaciones personalizadas
  const pulse = keyframes`
    0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
    70% { box-shadow: 0 0 0 15px rgba(76, 175, 80, 0); }
    100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
  `;

  const glow = keyframes`
    0% { filter: brightness(100%); }
    50% { filter: brightness(130%); }
    100% { filter: brightness(100%); }
  `;

  const rotate = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  `;

  // Componentes estilizados
  const RehabCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, #ffffff 0%, #e8f5e9 100%)',
    borderRadius: 25,
    border: '2px solid rgba(76, 175, 80, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.03)',
      boxShadow: '0 0 25px rgba(76, 175, 80, 0.4)',
      animation: `${pulse} 1.5s infinite`,
    },
  }));

  const FancyPaper = styled(Paper)(({ theme }) => ({
    background: 'linear-gradient(45deg, #f5f7fa 0%, #bbdefb 100%)',
    borderRadius: 30,
    padding: theme.spacing(3),
    boxShadow: '0 0 20px rgba(76, 175, 80, 0.2)',
    border: '1px solid rgba(76, 175, 80, 0.1)',
  }));

  const NeonChip = styled(Chip)(({ theme }) => ({
    background: 'linear-gradient(45deg, #4caf50, #81c784)',
    color: 'white',
    fontWeight: 'bold',
    boxShadow: '0 0 10px rgba(76, 175, 80, 0.5)',
  }));

  // Estado para interacciones
  const [hoveredStat, setHoveredStat] = useState(null);
  const [monitoringActive, setMonitoringActive] = useState(false);

  // Paleta de colores
  const colors = {
    primary: '#4caf50', // Verde bienestar
    secondary: '#0288d1', // Azul serenidad
    accent: '#f06292', // Rosa empatía
    background: '#f0f4f8', // Fondo suave
    cardBg: '#ffffff',
    textPrimary: '#212121',
    textSecondary: '#757575',
    highlight: '#ffca28', // Amarillo para detalles
  };

  return (
    <Box sx={{ p: 5, backgroundColor: '#B0BEC5', minHeight: '100vh' }}>
      <Grid container spacing={4}>
        {/* Estadísticas clave con más detalles */}
        <Grid item xs={12} md={3}>
          <RehabCard
            onMouseEnter={() => setHoveredStat('patients')}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <CardContent>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: colors.primary,
                    width: 60,
                    height: 60,
                    animation: hoveredStat === 'patients' ? `${glow} 2s infinite` : 'none',
                  }}
                >
                  <PeopleIcon sx={{ fontSize: 35 }} />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ color: colors.textSecondary }}>
                    Pacientes Activos
                  </Typography>
                  <Fade in={true} timeout={1500}>
                    <Typography
                      variant="h3"
                      fontWeight="bold"
                      sx={{ color: colors.textPrimary }}
                    >
                      178
                    </Typography>
                  </Fade>
                  <LinearProgress
                    variant="determinate"
                    value={82}
                    sx={{
                      mt: 2,
                      height: 12,
                      borderRadius: 5,
                      bgcolor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': { bgcolor: colors.primary, boxShadow: '0 0 10px rgba(76, 175, 80, 0.5)' },
                    }}
                  />
                  <NeonChip label="+5% esta semana" size="small" sx={{ mt: 1 }} />
                </Box>
              </Stack>
            </CardContent>
          </RehabCard>
        </Grid>

        <Grid item xs={12} md={3}>
          <RehabCard
            onMouseEnter={() => setHoveredStat('sessions')}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <CardContent>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: colors.secondary,
                    width: 60,
                    height: 60,
                    animation: hoveredStat === 'sessions' ? `${glow} 2s infinite` : 'none',
                  }}
                >
                  <PsychologyIcon sx={{ fontSize: 35 }} />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ color: colors.textSecondary }}>
                    Sesiones Diarias
                  </Typography>
                  <Fade in={true} timeout={1500}>
                    <Typography
                      variant="h3"
                      fontWeight="bold"
                      sx={{ color: colors.textPrimary }}
                    >
                      45
                    </Typography>
                  </Fade>
                  <LinearProgress
                    variant="determinate"
                    value={70}
                    sx={{
                      mt: 2,
                      height: 12,
                      borderRadius: 5,
                      bgcolor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': { bgcolor: colors.secondary, boxShadow: '0 0 10px rgba(2, 136, 209, 0.5)' },
                    }}
                  />
                  <NeonChip label="Estable" size="small" sx={{ mt: 1, background: colors.secondary }} />
                </Box>
              </Stack>
            </CardContent>
          </RehabCard>
        </Grid>

        <Grid item xs={12} md={3}>
          <RehabCard
            onMouseEnter={() => setHoveredStat('recovery')}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <CardContent>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: colors.accent,
                    width: 60,
                    height: 60,
                    animation: hoveredStat === 'recovery' ? `${glow} 2s infinite` : 'none',
                  }}
                >
                  <HealthAndSafetyIcon sx={{ fontSize: 35 }} />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ color: colors.textSecondary }}>
                    Tasa de Recuperación
                  </Typography>
                  <Fade in={true} timeout={1500}>
                    <Typography
                      variant="h3"
                      fontWeight="bold"
                      sx={{ color: colors.textPrimary }}
                    >
                      89%
                    </Typography>
                  </Fade>
                  <LinearProgress
                    variant="determinate"
                    value={89}
                    sx={{
                      mt: 2,
                      height: 12,
                      borderRadius: 5,
                      bgcolor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': { bgcolor: colors.accent, boxShadow: '0 0 10px rgba(240, 98, 146, 0.5)' },
                    }}
                  />
                  <NeonChip label="+3% mensual" size="small" sx={{ mt: 1, background: colors.accent }} />
                </Box>
              </Stack>
            </CardContent>
          </RehabCard>
        </Grid>

        <Grid item xs={12} md={3}>
          <RehabCard
            onMouseEnter={() => setHoveredStat('staff')}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <CardContent>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: colors.highlight,
                    width: 60,
                    height: 60,
                    animation: hoveredStat === 'staff' ? `${glow} 2s infinite` : 'none',
                  }}
                >
                  <GroupIcon sx={{ fontSize: 35 }} />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ color: colors.textSecondary }}>
                    Equipo Activo
                  </Typography>
                  <Fade in={true} timeout={1500}>
                    <Typography
                      variant="h3"
                      fontWeight="bold"
                      sx={{ color: colors.textPrimary }}
                    >
                      38
                    </Typography>
                  </Fade>
                  <LinearProgress
                    variant="determinate"
                    value={95}
                    sx={{
                      mt: 2,
                      height: 12,
                      borderRadius: 5,
                      bgcolor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': { bgcolor: colors.highlight, boxShadow: '0 0 10px rgba(255, 202, 40, 0.5)' },
                    }}
                  />
                  <NeonChip label="Completo" size="small" sx={{ mt: 1, background: colors.highlight }} />
                </Box>
              </Stack>
            </CardContent>
          </RehabCard>
        </Grid>

        {/* Progreso detallado de programas */}
        <Grid item xs={12} md={6}>
          <FancyPaper>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ color: colors.textPrimary, mb: 2 }}
            >
              Progreso de Programas de Rehabilitación
            </Typography>
            <Divider sx={{ mb: 3, bgcolor: colors.primary }} />
            <Stack spacing={4}>
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ color: colors.textSecondary, fontWeight: 'bold' }}>
                    Rehabilitación Física
                  </Typography>
                  <NeonChip label="82% Completado" size="small" />
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={82}
                  sx={{
                    mt: 1,
                    height: 15,
                    borderRadius: 5,
                    bgcolor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': { bgcolor: colors.primary, boxShadow: '0 0 10px rgba(76, 175, 80, 0.5)' },
                  }}
                />
                <Typography variant="caption" sx={{ color: colors.textSecondary, mt: 1 }}>
                  45 pacientes en curso
                </Typography>
              </Box>
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ color: colors.textSecondary, fontWeight: 'bold' }}>
                    Terapia Psicológica
                  </Typography>
                  <NeonChip label="68% Completado" size="small" sx={{ background: colors.secondary }} />
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={68}
                  sx={{
                    mt: 1,
                    height: 15,
                    borderRadius: 5,
                    bgcolor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': { bgcolor: colors.secondary, boxShadow: '0 0 10px rgba(2, 136, 209, 0.5)' },
                  }}
                />
                <Typography variant="caption" sx={{ color: colors.textSecondary, mt: 1 }}>
                  32 sesiones activas
                </Typography>
              </Box>
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ color: colors.textSecondary, fontWeight: 'bold' }}>
                    Reintegración Social
                  </Typography>
                  <NeonChip label="91% Completado" size="small" sx={{ background: colors.accent }} />
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={91}
                  sx={{
                    mt: 1,
                    height: 15,
                    borderRadius: 5,
                    bgcolor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': { bgcolor: colors.accent, boxShadow: '0 0 10px rgba(240, 98, 146, 0.5)' },
                  }}
                />
                <Typography variant="caption" sx={{ color: colors.textSecondary, mt: 1 }}>
                  18 pacientes en transición
                </Typography>
              </Box>
            </Stack>
          </FancyPaper>
        </Grid>

        {/* Notificaciones con más detalles */}
        <Grid item xs={12} md={6}>
          <FancyPaper>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ color: colors.textPrimary, mb: 2 }}
            >
              Notificaciones del Sistema
            </Typography>
            <Divider sx={{ mb: 3, bgcolor: colors.primary }} />
            <Stack spacing={3}>
              <Zoom in={true} timeout={1000}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <IconButton sx={{ bgcolor: colors.primary, color: 'white', '&:hover': { bgcolor: '#388e3c' } }}>
                    <NotificationsIcon />
                  </IconButton>
                  <Box>
                    <Typography sx={{ color: colors.textSecondary, fontWeight: 'medium' }}>
                      Nueva cita confirmada - Paciente #245
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#9e9e9e' }}>
                      Hace 10 minutos | Sala 3
                    </Typography>
                  </Box>
                </Stack>
              </Zoom>
              <Zoom in={true} timeout={1200}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <IconButton sx={{ bgcolor: colors.secondary, color: 'white', '&:hover': { bgcolor: '#01579b' } }}>
                    <LocalHospitalIcon />
                  </IconButton>
                  <Box>
                    <Typography sx={{ color: colors.textSecondary, fontWeight: 'medium' }}>
                      Paciente #198 dado de alta
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#9e9e9e' }}>
                      Hace 45 minutos | Dr. López
                    </Typography>
                  </Box>
                </Stack>
              </Zoom>
              <Zoom in={true} timeout={1400}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <IconButton sx={{ bgcolor: colors.accent, color: 'white', '&:hover': { bgcolor: '#d81b60' } }}>
                    <EventIcon />
                  </IconButton>
                  <Box>
                    <Typography sx={{ color: colors.textSecondary, fontWeight: 'medium' }}>
                      Taller de yoga programado
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#9e9e9e' }}>
                      Hace 1 hora | 15:00 hoy
                    </Typography>
                  </Box>
                </Stack>
              </Zoom>
            </Stack>
          </FancyPaper>
        </Grid>

        {/* Calendario de actividades expandido */}
        <Grid item xs={12} md={6}>
          <FancyPaper>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ color: colors.textPrimary, mb: 2 }}
            >
              Calendario de Actividades
            </Typography>
            <Divider sx={{ mb: 3, bgcolor: colors.primary }} />
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Hora</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actividad</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Responsable</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Sala</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>08:30</TableCell>
                  <TableCell>Terapia Física Grupal</TableCell>
                  <TableCell>Ft. Ana Morales</TableCell>
                  <TableCell>Sala 1</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>10:00</TableCell>
                  <TableCell>Sesión Psicológica Individual</TableCell>
                  <TableCell>Psic. Laura Díaz</TableCell>
                  <TableCell>Consultorio B</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>14:00</TableCell>
                  <TableCell>Taller de Reintegración</TableCell>
                  <TableCell>Lic. Juan Pérez</TableCell>
                  <TableCell>Sala 3</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>16:00</TableCell>
                  <TableCell>Clase de Meditación</TableCell>
                  <TableCell>Instr. Carla Gómez</TableCell>
                  <TableCell>Sala 2</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </FancyPaper>
        </Grid>

        {/* Indicadores de bienestar detallados */}
        <Grid item xs={12} md={6}>
          <FancyPaper>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ color: colors.textPrimary, mb: 2 }}
            >
              Indicadores de Bienestar
            </Typography>
            <Divider sx={{ mb: 3, bgcolor: colors.primary }} />
            <Stack spacing={4}>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar sx={{ bgcolor: colors.primary, width: 50, height: 50 }}>
                  <SentimentSatisfiedIcon sx={{ fontSize: 30 }} />
                </Avatar>
                <Box flexGrow={1}>
                  <Typography sx={{ color: colors.textSecondary }}>
                    Satisfacción de Pacientes
                  </Typography>
                  <Slider
                    value={94}
                    min={0}
                    max={100}
                    disabled
                    sx={{ color: colors.primary }}
                  />
                  <Typography variant="caption" sx={{ color: colors.textPrimary }}>
                    94% - Excelente
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar sx={{ bgcolor: colors.secondary, width: 50, height: 50 }}>
                  <FitnessCenterIcon sx={{ fontSize: 30 }} />
                </Avatar>
                <Box flexGrow={1}>
                  <Typography sx={{ color: colors.textSecondary }}>
                    Progreso Físico Promedio
                  </Typography>
                  <Slider
                    value={87}
                    min={0}
                    max={100}
                    disabled
                    sx={{ color: colors.secondary }}
                  />
                  <Typography variant="caption" sx={{ color: colors.textPrimary }}>
                    87% - Muy Bueno
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar sx={{ bgcolor: colors.accent, width: 50, height: 50 }}>
                  <PsychologyIcon sx={{ fontSize: 30 }} />
                </Avatar>
                <Box flexGrow={1}>
                  <Typography sx={{ color: colors.textSecondary }}>
                    Estabilidad Emocional
                  </Typography>
                  <Slider
                    value={90}
                    min={0}
                    max={100}
                    disabled
                    sx={{ color: colors.accent }}
                  />
                  <Typography variant="caption" sx={{ color: colors.textPrimary }}>
                    90% - Óptimo
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </FancyPaper>
        </Grid>

        {/* Monitoreo en tiempo real */}
        <Grid item xs={12} md={4}>
          <RehabCard>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: colors.textPrimary }}>
                  Monitoreo en Tiempo Real
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={monitoringActive}
                      onChange={(e) => setMonitoringActive(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={monitoringActive ? 'Activo' : 'Inactivo'}
                />
              </Stack>
              <Divider sx={{ mb: 3, bgcolor: colors.primary }} />
              <Stack spacing={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <MonitorHeartIcon sx={{ fontSize: 40, color: colors.primary }} />
                  <Box>
                    <Typography sx={{ color: colors.textSecondary }}>
                      Ritmo Cardíaco Promedio
                    </Typography>
                    <Typography variant="h5" sx={{ color: colors.textPrimary }}>
                      72 bpm
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <DirectionsRunIcon sx={{ fontSize: 40, color: colors.secondary }} />
                  <Box>
                    <Typography sx={{ color: colors.textSecondary }}>
                      Actividad Física Diaria
                    </Typography>
                    <Typography variant="h5" sx={{ color: colors.textPrimary }}>
                      45 min
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
              {monitoringActive && (
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <CircularProgress
                    size={60}
                    sx={{ color: colors.primary, animation: `${rotate} 2s linear infinite` }}
                  />
                  <Typography variant="caption" sx={{ color: colors.textSecondary, mt: 1 }}>
                    Actualizando datos...
                  </Typography>
                </Box>
              )}
            </CardContent>
          </RehabCard>
        </Grid>

        {/* Historial reciente extendido */}
        <Grid item xs={12} md={8}>
          <FancyPaper>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ color: colors.textPrimary, mb: 2 }}
            >
              Historial Reciente
            </Typography>
            <Divider sx={{ mb: 3, bgcolor: colors.primary }} />
            <Stack spacing={3}>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar sx={{ bgcolor: colors.primary, width: 50, height: 50 }}>
                  <LocalHospitalIcon />
                </Avatar>
                <Box>
                  <Typography sx={{ color: colors.textSecondary }}>
                    Paciente #278 ingresado - Programa Físico
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#9e9e9e' }}>
                    Hace 12 minutos | Sala 1
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar sx={{ bgcolor: colors.secondary, width: 50, height: 50 }}>
                  <PsychologyIcon />
                </Avatar>
                <Box>
                  <Typography sx={{ color: colors.textSecondary }}>
                    Sesión psicológica completada - Paciente #192
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#9e9e9e' }}>
                    Hace 30 minutos | Consultorio A
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar sx={{ bgcolor: colors.accent, width: 50, height: 50 }}>
                  <HealthAndSafetyIcon />
                </Avatar>
                <Box>
                  <Typography sx={{ color: colors.textSecondary }}>
                    Alta médica procesada - Paciente #165
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#9e9e9e' }}>
                    Hace 1 hora | Dr. Ramírez
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar sx={{ bgcolor: colors.highlight, width: 50, height: 50 }}>
                  <MedicationIcon />
                </Avatar>
                <Box>
                  <Typography sx={{ color: colors.textSecondary }}>
                    Medicación administrada - Paciente #234
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#9e9e9e' }}>
                    Hace 2 horas | Enfermera Soto
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </FancyPaper>
        </Grid>

        {/* Recursos y estadísticas adicionales */}
        <Grid item xs={12} md={4}>
          <RehabCard>
            <CardContent>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: colors.textPrimary, mb: 2 }}
              >
                Recursos Disponibles
              </Typography>
              <Divider sx={{ mb: 3, bgcolor: colors.primary }} />
              <Stack spacing={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <FitnessCenterIcon sx={{ fontSize: 35, color: colors.primary }} />
                  <Typography sx={{ color: colors.textSecondary }}>
                    6 Salas de Fisioterapia
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <PsychologyIcon sx={{ fontSize: 35, color: colors.secondary }} />
                  <Typography sx={{ color: colors.textSecondary }}>
                    4 Consultorios Psicológicos
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <SpaIcon sx={{ fontSize: 35, color: colors.accent }} />
                  <Typography sx={{ color: colors.textSecondary }}>
                    2 Áreas de Relajación
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </RehabCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <RehabCard>
            <CardContent>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: colors.textPrimary, mb: 2 }}
              >
                Próximos Eventos
              </Typography>
              <Divider sx={{ mb: 3, bgcolor: colors.primary }} />
              <Stack spacing={3}>
                <Box>
                  <Typography sx={{ color: colors.textSecondary, fontWeight: 'medium' }}>
                    Taller de Mindfulness
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#9e9e9e' }}>
                    23 Mar 2025 - 09:00 AM | Sala 2
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: colors.textSecondary, fontWeight: 'medium' }}>
                    Día de Integración Familiar
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#9e9e9e' }}>
                    26 Mar 2025 - 14:00 PM | Área Externa
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: colors.textSecondary, fontWeight: 'medium' }}>
                    Sesión de Evaluación Grupal
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#9e9e9e' }}>
                    28 Mar 2025 - 11:00 AM | Sala 3
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </RehabCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <RehabCard>
            <CardContent>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: colors.textPrimary, mb: 2 }}
              >
                Contacto de Emergencia
              </Typography>
              <Divider sx={{ mb: 3, bgcolor: colors.primary }} />
              <Stack spacing={2}>
                <Typography sx={{ color: colors.textSecondary }}>
                  Teléfono: (123) 456-7890
                </Typography>
                <Typography sx={{ color: colors.textSecondary }}>
                  Email: emergencia@rehabintegral.com
                </Typography>
                <Typography sx={{ color: colors.textSecondary }}>
                  Línea 24/7: (987) 654-3210
                </Typography>
              </Stack>
            </CardContent>
          </RehabCard>
        </Grid>

        {/* Panel de métricas avanzadas */}
        <Grid item xs={12} md={6}>
          <FancyPaper>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ color: colors.textPrimary, mb: 2 }}
            >
              Métricas Avanzadas
            </Typography>
            <Divider sx={{ mb: 3, bgcolor: colors.primary }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <AssessmentIcon sx={{ fontSize: 40, color: colors.primary }} />
                  <Box>
                    <Typography sx={{ color: colors.textSecondary }}>
                      Evaluaciones Completadas
                    </Typography>
                    <Typography variant="h5" sx={{ color: colors.textPrimary }}>
                      124
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <VolunteerActivismIcon sx={{ fontSize: 40, color: colors.secondary }} />
                  <Box>
                    <Typography sx={{ color: colors.textSecondary }}>
                      Voluntarios Activos
                    </Typography>
                    <Typography variant="h5" sx={{ color: colors.textPrimary }}>
                      15
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <MedicationIcon sx={{ fontSize: 40, color: colors.accent }} />
                  <Box>
                    <Typography sx={{ color: colors.textSecondary }}>
                      Medicamentos Dispensados
                    </Typography>
                    <Typography variant="h5" sx={{ color: colors.textPrimary }}>
                      89
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <TrendingUpIcon sx={{ fontSize: 40, color: colors.highlight }} />
                  <Box>
                    <Typography sx={{ color: colors.textSecondary }}>
                      Mejora General
                    </Typography>
                    <Typography variant="h5" sx={{ color: colors.textPrimary }}>
                      92%
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </FancyPaper>
        </Grid>

        {/* Acordeones con información adicional */}
        <Grid item xs={12} md={6}>
          <FancyPaper>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ color: colors.textPrimary, mb: 2 }}
            >
              Detalles del Centro
            </Typography>
            <Divider sx={{ mb: 3, bgcolor: colors.primary }} />
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ color: colors.textSecondary }}>
                  Protocolos de Seguridad
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ color: colors.textSecondary }}>
                  - Evacuación revisada el 15/03/2025<br />
                  - Equipos de emergencia en todas las salas<br />
                  - Personal capacitado en primeros auxilios
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ color: colors.textSecondary }}>
                  Inventario Médico
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ color: colors.textSecondary }}>
                  - 50 kits de fisioterapia<br />
                  - 20 equipos de monitoreo<br />
                  - Medicamentos básicos al 100%
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ color: colors.textSecondary }}>
                  Estadísticas Mensuales
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ color: colors.textSecondary }}>
                  - Altas: 25 pacientes<br />
                  - Ingresos: 30 pacientes<br />
                  - Sesiones: 450 horas
                </Typography>
              </AccordionDetails>
            </Accordion>
          </FancyPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomeAdministrativa;