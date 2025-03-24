"use client"

import { useState } from "react"
import { styled } from "@mui/material/styles"
import {
  Avatar,
  Badge as MuiBadge,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Typography,
} from "@mui/material"
import {
  AccessTime as ClockIcon,
  Add as PlusIcon,
  ArrowDownward as ArrowDownIcon,
  ArrowUpward as ArrowUpIcon,
  Assessment as BarChartIcon,
  Assignment as FileTextIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  ChevronRight as ChevronRightIcon,
  Description as DocumentIcon,
  EmojiEvents as AwardIcon,
  Favorite as HeartIcon,
  Group as UsersIcon,
  InsertChart as PieChartIcon,
  Message as MessageIcon,
  Notifications as BellIcon,
  Person as UserIcon,
  ShowChart as TrendingUpIcon,
  Timeline as ActivityIcon,
  Whatshot as ZapIcon,
} from "@mui/icons-material"
import { createTheme, ThemeProvider } from "@mui/material/styles"

// Crear un tema personalizado para mantener los colores similares a la versión Tailwind
const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
      light: "#757de8",
      dark: "#002984",
      contrastText: "#fff",
    },
    secondary: {
      main: "#f50057",
      light: "#ff4081",
      dark: "#c51162",
      contrastText: "#fff",
    },
    success: {
      main: "#4caf50",
      light: "#81c784",
      dark: "#388e3c",
    },
    warning: {
      main: "#ff9800",
      light: "#ffb74d",
      dark: "#f57c00",
    },
    error: {
      main: "#f44336",
      light: "#e57373",
      dark: "#d32f2f",
    },
    info: {
      main: "#2196f3",
      light: "#64b5f6",
      dark: "#1976d2",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem",
    },
    body2: {
      fontSize: "0.875rem",
    },
    caption: {
      fontSize: "0.75rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.05)",
        },
      },
    },
  },
})

// Componentes estilizados personalizados
const StyledBadge = styled(MuiBadge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 3,
    padding: "0 4px",
  },
}))

const BorderCard = styled(Card)(({ theme, bordercolor }) => ({
  position: "relative",
  overflow: "visible",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: bordercolor || theme.palette.primary.main,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
}))

const GradientCard = styled(Card)(({ theme, colors }) => ({
  background: `linear-gradient(135deg, ${colors.light} 0%, ${colors.main} 100%)`,
  color: colors.text,
  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
}))

const IconBox = styled(Box)(({ theme, bgcolor }) => ({
  backgroundColor: bgcolor || theme.palette.primary.light,
  borderRadius: "50%",
  padding: theme.spacing(1.5),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}))

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  "& .MuiTab-root": {
    textTransform: "none",
    minWidth: 100,
    fontWeight: 500,
  },
}))

const CalendarDay = styled(Box)(({ theme, istoday, iscurrentmonth, hasappointments }) => ({
  aspectRatio: "1/1",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 8,
  cursor: iscurrentmonth === "true" ? "pointer" : "default",
  backgroundColor: istoday === "true" ? theme.palette.primary.main : "transparent",
  color:
    istoday === "true"
      ? theme.palette.primary.contrastText
      : iscurrentmonth === "true"
        ? theme.palette.text.primary
        : theme.palette.text.disabled,
  "&:hover": {
    backgroundColor: iscurrentmonth === "true" && istoday !== "true" ? theme.palette.action.hover : undefined,
  },
}))

const DonutChart = styled(Box)(({ theme, size, color, thickness }) => ({
  width: size,
  height: size,
  borderRadius: "50%",
  border: `${thickness}px solid ${color}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}))

const BarChart = styled(Box)(({ theme, height, color }) => ({
  width: "100%",
  height: `${height}%`,
  backgroundColor: color,
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
  transition: "all 0.3s ease",
  "&:hover": {
    filter: "brightness(0.9)",
  },
}))

// Componente principal
function HomeAdmin() {
  // Estados
  const [tabValue, setTabValue] = useState("dashboard")
  const [periodMenuAnchor, setPeriodMenuAnchor] = useState(null)

  // Obtener fecha actual en español
  const currentDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Capitalizar primera letra de la fecha
  const formattedDate = currentDate.charAt(0).toUpperCase() + currentDate.slice(1)

  // Manejadores de eventos
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handlePeriodMenuOpen = (event) => {
    setPeriodMenuAnchor(event.currentTarget)
  }

  const handlePeriodMenuClose = () => {
    setPeriodMenuAnchor(null)
  }

  // Renderizado
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Sección de bienvenida con fecha y estadísticas rápidas */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" color="primary" gutterBottom>
                Centro de Rehabilitación Integral San Juan
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formattedDate}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1.5 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<BellIcon />}
                endIcon={<StyledBadge badgeContent={5} color="secondary" />}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  Notificaciones
                </Box>
              </Button>

              <Button
                variant="outlined"
                size="small"
                startIcon={<MessageIcon />}
                endIcon={<StyledBadge badgeContent={3} color="secondary" />}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  Mensajes
                </Box>
              </Button>

              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  border: 2,
                  borderColor: 'primary.main'
                }}
                alt="Admin"
                src="/placeholder.svg?height=40&width=40"
              >
                AD
              </Avatar>
            </Grid>
          </Grid>

          {/* Tarjetas de estadísticas rápidas */}
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <GradientCard colors={{ light: '#e3f2fd', main: '#bbdefb', text: '#1565c0' }}>
                <CardContent sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'inherit' }}>
                      Pacientes Totales
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, my: 0.5 }}>
                      1,248
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#4caf50' }}>
                      <ArrowUpIcon sx={{ fontSize: 14, mr: 0.5 }} />
                      <Typography variant="caption">12% este mes</Typography>
                    </Box>
                  </Box>
                  <IconBox bgcolor="#e3f2fd">
                    <UsersIcon sx={{ color: '#1565c0' }} />
                  </IconBox>
                </CardContent>
              </GradientCard>
            </Grid>

            <Grid item xs={6} md={3}>
              <GradientCard colors={{ light: '#e8f5e9', main: '#c8e6c9', text: '#2e7d32' }}>
                <CardContent sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'inherit' }}>
                      Citas Hoy
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, my: 0.5 }}>
                      24
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#4caf50' }}>
                      <ArrowUpIcon sx={{ fontSize: 14, mr: 0.5 }} />
                      <Typography variant="caption">8% vs ayer</Typography>
                    </Box>
                  </Box>
                  <IconBox bgcolor="#e8f5e9">
                    <CalendarIcon sx={{ color: '#2e7d32' }} />
                  </IconBox>
                </CardContent>
              </GradientCard>
            </Grid>

            <Grid item xs={6} md={3}>
              <GradientCard colors={{ light: '#f3e5f5', main: '#e1bee7', text: '#6a1b9a' }}>
                <CardContent sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'inherit' }}>
                      Tasa de Éxito
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, my: 0.5 }}>
                      92%
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#4caf50' }}>
                      <ArrowUpIcon sx={{ fontSize: 14, mr: 0.5 }} />
                      <Typography variant="caption">5% vs anterior</Typography>
                    </Box>
                  </Box>
                  <IconBox bgcolor="#f3e5f5">
                    <TrendingUpIcon sx={{ color: '#6a1b9a' }} />
                  </IconBox>
                </CardContent>
              </GradientCard>
            </Grid>

            <Grid item xs={6} md={3}>
              <GradientCard colors={{ light: '#fff8e1', main: '#ffecb3', text: '#ff8f00' }}>
                <CardContent sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'inherit' }}>
                      Ocupación
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, my: 0.5 }}>
                      78%
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#f44336' }}>
                      <ArrowDownIcon sx={{ fontSize: 14, mr: 0.5 }} />
                      <Typography variant="caption">3% disponible</Typography>
                    </Box>
                  </Box>
                  <IconBox bgcolor="#fff8e1">
                    <ActivityIcon sx={{ color: '#ff8f00' }} />
                  </IconBox>
                </CardContent>
              </GradientCard>
            </Grid>
          </Grid>
        </Box>

        {/* Contenido principal con pestañas */}
        <Box sx={{ mb: 4 }}>
          <StyledTabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{ maxWidth: { md: 400 }, mb: 2 }}
          >
            <Tab label="Dashboard" value="dashboard" />
            <Tab label="Pacientes" value="pacientes" />
            <Tab label="Citas" value="citas" />
            <Tab label="Reportes" value="reportes" />
          </StyledTabs>

          {tabValue === 'dashboard' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Contenido principal del dashboard */}
              <Grid container spacing={3}>
                {/* Columna izquierda */}
                <Grid item xs={12} lg={8} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Próximas citas */}
                  <BorderCard bordercolor={theme.palette.primary.main}>
                    <CardHeader
                      title={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="h6">Próximas Citas</Typography>
                        </Box>
                      }
                      subheader="Citas programadas para hoy"
                      action={
                        <Button
                          variant="text"
                          size="small"
                          endIcon={<ChevronRightIcon />}
                        >
                          Ver todas
                        </Button>
                      }
                      sx={{
                        pb: 1,
                        bgcolor: 'action.hover',
                        '& .MuiCardHeader-action': { m: 0 }
                      }}
                    />
                    <CardContent sx={{ p: 0 }}>
                      {[
                        {
                          name: 'María Rodríguez',
                          therapy: 'Fisioterapia',
                          time: '10:00',
                          status: 'Confirmada',
                          statusColor: 'primary',
                          avatar: 'MR'
                        },
                        {
                          name: 'Juan López',
                          therapy: 'Terapia Ocupacional',
                          time: '11:30',
                          status: 'Pendiente',
                          statusColor: 'default',
                          avatar: 'JL'
                        },
                        {
                          name: 'Ana Ramírez',
                          therapy: 'Evaluación',
                          time: '13:15',
                          status: 'Nueva',
                          statusColor: 'secondary',
                          avatar: 'AR'
                        },
                        {
                          name: 'Luis Sánchez',
                          therapy: 'Fisioterapia',
                          time: '15:45',
                          status: 'Confirmada',
                          statusColor: 'primary',
                          avatar: 'LS'
                        }
                      ].map((appointment, i) => (
                        <Box
                          key={i}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 2,
                            '&:hover': { bgcolor: 'action.hover' },
                            borderBottom: i < 3 ? 1 : 0,
                            borderColor: 'divider'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar alt={appointment.name} src={`/placeholder.svg?height=40&width=40&text=${i + 1}`}>
                              {appointment.avatar}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2">{appointment.name}</Typography>
                              <Typography variant="body2" color="text.secondary">{appointment.therapy}</Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <MuiBadge
                              sx={{
                                '& .MuiBadge-badge': {
                                  position: 'static',
                                  transform: 'none',
                                  borderRadius: 1,
                                  padding: '4px 8px',
                                  height: 'auto',
                                  bgcolor: appointment.statusColor === 'default' ? 'background.paper' : undefined,
                                  border: appointment.statusColor === 'default' ? 1 : 0,
                                  borderColor: 'divider'
                                }
                              }}
                              badgeContent={appointment.status}
                              color={appointment.statusColor === 'default' ? 'default' : appointment.statusColor}
                            />
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="subtitle2">{appointment.time}</Typography>
                              <Typography variant="body2" color="text.secondary">Hoy</Typography>
                            </Box>
                            <IconButton size="small" sx={{ ml: 1 }}>
                              <ChevronRightIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      ))}
                    </CardContent>
                  </BorderCard>

                  {/* Progreso de tratamientos */}
                  <Card>
                    <CardHeader
                      title={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TrendingUpIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="h6">Progreso de Tratamientos</Typography>
                        </Box>
                      }
                      subheader="Progreso de pacientes por tipo de terapia"
                      action={
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handlePeriodMenuOpen}
                        >
                          Este Mes
                        </Button>
                      }
                    />
                    <Menu
                      anchorEl={periodMenuAnchor}
                      open={Boolean(periodMenuAnchor)}
                      onClose={handlePeriodMenuClose}
                    >
                      <MenuItem onClick={handlePeriodMenuClose}>Esta Semana</MenuItem>
                      <MenuItem onClick={handlePeriodMenuClose}>Este Mes</MenuItem>
                      <MenuItem onClick={handlePeriodMenuClose}>Este Año</MenuItem>
                    </Menu>
                    <CardContent>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {[
                          { name: 'Fisioterapia', progress: 85, total: 48, completed: 41, color: '#2196f3' },
                          { name: 'Terapia Ocupacional', progress: 72, total: 36, completed: 26, color: '#4caf50' },
                          { name: 'Terapia del Habla', progress: 90, total: 20, completed: 18, color: '#ff9800' },
                          { name: 'Psicología', progress: 65, total: 30, completed: 19, color: '#9c27b0' },
                        ].map((item, i) => (
                          <Box key={i} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Box
                                    sx={{
                                      width: 12,
                                      height: 12,
                                      borderRadius: '50%',
                                      bgcolor: item.color,
                                      mr: 1
                                    }}
                                  />
                                  <Typography variant="subtitle2">{item.name}</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  {item.completed} de {item.total} completados
                                </Typography>
                              </Box>
                              <Typography variant="h6" fontWeight="bold">{item.progress}%</Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={item.progress}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: 'action.hover',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: item.color
                                }
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>

                  {/* Vista de calendario */}
                  <Card>
                    <CardHeader
                      title={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="h6">Calendario de Citas</Typography>
                        </Box>
                      }
                      subheader="Vista mensual de citas programadas"
                      action={
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Button variant="outlined" size="small">Hoy</Button>
                          <IconButton size="small">
                            <ChevronRightIcon sx={{ transform: 'rotate(180deg)' }} />
                          </IconButton>
                          <IconButton size="small">
                            <ChevronRightIcon />
                          </IconButton>
                        </Box>
                      }
                    />
                    <CardContent>
                      <Grid container spacing={0.5} sx={{ mb: 1 }}>
                        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, i) => (
                          <Grid item xs={12 / 7} key={i}>
                            <Typography
                              variant="body2"
                              align="center"
                              color="text.secondary"
                              fontWeight="medium"
                              sx={{ py: 0.5 }}
                            >
                              {day}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                      <Grid container spacing={0.5}>
                        {Array.from({ length: 35 }, (_, i) => {
                          const day = i - 2; // Offset para comenzar el mes en el día correcto
                          const isCurrentMonth = day >= 1 && day <= 30;
                          const isToday = day === 15;
                          const hasAppointments = [3, 8, 12, 15, 19, 22, 27].includes(day);

                          return (
                            <Grid item xs={12 / 7} key={i}>
                              <CalendarDay
                                istoday={isToday ? 'true' : 'false'}
                                iscurrentmonth={isCurrentMonth ? 'true' : 'false'}
                                hasappointments={hasAppointments ? 'true' : 'false'}
                              >
                                {isCurrentMonth && (
                                  <>
                                    <Typography variant="body2">{day}</Typography>
                                    {hasAppointments && (
                                      <Box
                                        sx={{
                                          width: 6,
                                          height: 6,
                                          borderRadius: '50%',
                                          mt: 0.5,
                                          bgcolor: isToday ? 'primary.contrastText' : 'primary.main'
                                        }}
                                      />
                                    )}
                                  </>
                                )}
                              </CalendarDay>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Columna derecha */}
                <Grid item xs={12} lg={4} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Distribución de pacientes */}
                  <BorderCard bordercolor="#2196f3">
                    <CardHeader
                      title={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PieChartIcon sx={{ mr: 1, color: '#2196f3' }} />
                          <Typography variant="h6">Distribución de Pacientes</Typography>
                        </Box>
                      }
                      subheader="Por tipo de terapia"
                      sx={{
                        pb: 1,
                        bgcolor: 'action.hover',
                        '& .MuiCardHeader-action': { m: 0 }
                      }}
                    />
                    <CardContent>
                      <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {[
                          { name: 'Fisioterapia', value: 45, color: '#2196f3' },
                          { name: 'Terapia Ocupacional', value: 25, color: '#4caf50' },
                          { name: 'Terapia del Habla', value: 15, color: '#ff9800' },
                          { name: 'Psicología', value: 10, color: '#9c27b0' },
                          { name: 'Otros', value: 5, color: '#9e9e9e' },
                        ].map((item, i) => (
                          <Box key={i} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    bgcolor: item.color,
                                    mr: 1
                                  }}
                                />
                                <Typography variant="body2">{item.name}</Typography>
                              </Box>
                              <Typography variant="subtitle2" fontWeight="medium">{item.value}%</Typography>
                            </Box>
                            <Box sx={{ width: '100%', height: 8, bgcolor: 'action.hover', borderRadius: 4, overflow: 'hidden' }}>
                              <Box
                                sx={{
                                  height: '100%',
                                  width: `${item.value}%`,
                                  bgcolor: item.color
                                }}
                              />
                            </Box>
                          </Box>
                        ))}
                      </Box>

                      {/* Gráfico tipo donut */}
                      <Box sx={{ position: 'relative', mt: 3, display: 'flex', justifyContent: 'center' }}>
                        <DonutChart size={128} color="#2196f3" thickness={8}>
                          <DonutChart size={96} color="#4caf50" thickness={8}>
                            <DonutChart size={64} color="#ff9800" thickness={8}>
                              <DonutChart size={32} color="#9c27b0" thickness={4}>
                                <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#9e9e9e' }} />
                              </DonutChart>
                            </DonutChart>
                          </DonutChart>
                        </DonutChart>
                        <Box
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h5" fontWeight="bold">1,248</Typography>
                            <Typography variant="caption" color="text.secondary">Pacientes</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </BorderCard>

                  {/* Actividad reciente */}
                  <BorderCard bordercolor="#4caf50">
                    <CardHeader
                      title={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ActivityIcon sx={{ mr: 1, color: '#4caf50' }} />
                          <Typography variant="h6">Actividad Reciente</Typography>
                        </Box>
                      }
                      subheader="Últimas actualizaciones"
                      sx={{
                        pb: 1,
                        bgcolor: 'action.hover',
                        '& .MuiCardHeader-action': { m: 0 }
                      }}
                    />
                    <CardContent sx={{ p: 0 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {[
                          { icon: UserIcon, text: 'Nuevo paciente registrado', time: 'Hace 10 minutos', color: '#2196f3' },
                          { icon: CalendarIcon, text: 'Cita reprogramada', time: 'Hace 45 minutos', color: '#ff9800' },
                          { icon: FileTextIcon, text: 'Informe actualizado', time: 'Hace 2 horas', color: '#4caf50' },
                          { icon: MessageIcon, text: 'Nuevo mensaje recibido', time: 'Hace 3 horas', color: '#9c27b0' },
                          { icon: CheckCircleIcon, text: 'Terapia completada', time: 'Hace 5 horas', color: '#00bcd4' },
                        ].map((item, i) => (
                          <Box
                            key={i}
                            sx={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 2,
                              p: 2,
                              '&:hover': { bgcolor: 'action.hover' },
                              borderBottom: i < 4 ? 1 : 0,
                              borderColor: 'divider'
                            }}
                          >
                            <Box
                              sx={{
                                bgcolor: 'action.hover',
                                p: 1,
                                borderRadius: '50%',
                                color: item.color
                              }}
                            >
                              <item.icon fontSize="small" />
                            </Box>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">{item.text}</Typography>
                              <Typography variant="caption" color="text.secondary">{item.time}</Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </BorderCard>

                  {/* Personal disponible */}
                  <BorderCard bordercolor="#9c27b0">
                    <CardHeader
                      title={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <UsersIcon sx={{ mr: 1, color: '#9c27b0' }} />
                          <Typography variant="h6">Personal Disponible</Typography>
                        </Box>
                      }
                      subheader="Terapeutas disponibles hoy"
                      sx={{
                        pb: 1,
                        bgcolor: 'action.hover',
                        '& .MuiCardHeader-action': { m: 0 }
                      }}
                    />
                    <CardContent sx={{ p: 0 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {[
                          { name: 'Dr. Carlos Méndez', role: 'Fisioterapeuta', status: 'Disponible', avatar: 'CM' },
                          { name: 'Dra. Laura Vega', role: 'Terapeuta Ocupacional', status: 'En sesión', avatar: 'LV' },
                          { name: 'Lic. Roberto Díaz', role: 'Psicólogo', status: 'Disponible', avatar: 'RD' },
                          { name: 'Dra. Sofía Torres', role: 'Fonoaudióloga', status: 'Ausente', avatar: 'ST' },
                        ].map((staff, i) => (
                          <Box
                            key={i}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              p: 2,
                              '&:hover': { bgcolor: 'action.hover' },
                              borderBottom: i < 3 ? 1 : 0,
                              borderColor: 'divider'
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar alt={staff.name} src={`/placeholder.svg?height=40&width=40&text=${staff.avatar}`}>
                                {staff.avatar}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2">{staff.name}</Typography>
                                <Typography variant="caption" color="text.secondary">{staff.role}</Typography>
                              </Box>
                            </Box>
                            <MuiBadge
                              sx={{
                                '& .MuiBadge-badge': {
                                  position: 'static',
                                  transform: 'none',
                                  borderRadius: 1,
                                  padding: '4px 8px',
                                  height: 'auto',
                                  bgcolor: staff.status === 'Disponible'
                                    ? '#e8f5e9'
                                    : staff.status === 'En sesión'
                                      ? 'background.paper'
                                      : '#f5f5f5',
                                  color: staff.status === 'Disponible'
                                    ? '#2e7d32'
                                    : staff.status === 'En sesión'
                                      ? 'text.primary'
                                      : 'text.secondary',
                                  border: staff.status === 'En sesión' ? 1 : 0,
                                  borderColor: 'divider'
                                }
                              }}
                              badgeContent={staff.status}
                            />
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </BorderCard>
                </Grid>
              </Grid>

              {/* Acciones rápidas */}
              <Card>
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ZapIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6">Acciones Rápidas</Typography>
                    </Box>
                  }
                  subheader="Tareas comunes"
                />
                <CardContent>
                  <Grid container spacing={2}>
                    {[
                      { icon: UserIcon, text: 'Nuevo Paciente', color: '#2196f3', bgColor: '#e3f2fd' },
                      { icon: CalendarIcon, text: 'Agendar Cita', color: '#4caf50', bgColor: '#e8f5e9' },
                      { icon: FileTextIcon, text: 'Crear Informe', color: '#ff9800', bgColor: '#fff3e0' },
                      { icon: MessageIcon, text: 'Enviar Mensaje', color: '#9c27b0', bgColor: '#f3e5f5' },
                      { icon: UsersIcon, text: 'Ver Terapeutas', color: '#3f51b5', bgColor: '#e8eaf6' },
                      { icon: BarChartIcon, text: 'Estadísticas', color: '#e91e63', bgColor: '#fce4ec' },
                      { icon: HeartIcon, text: 'Seguimiento', color: '#f44336', bgColor: '#ffebee' },
                      { icon: ClockIcon, text: 'Horarios', color: '#00bcd4', bgColor: '#e0f7fa' },
                      { icon: AwardIcon, text: 'Certificados', color: '#ffc107', bgColor: '#fff8e1' },
                      { icon: ActivityIcon, text: 'Tratamientos', color: '#009688', bgColor: '#e0f2f1' },
                      { icon: DocumentIcon, text: 'Documentos', color: '#607d8b', bgColor: '#eceff1' },
                      { icon: CheckCircleIcon, text: 'Completados', color: '#009688', bgColor: '#e0f2f1' },
                    ].map((item, i) => (
                      <Grid item xs={6} sm={4} md={3} lg={2} key={i}>
                        <Button
                          variant="outlined"
                          fullWidth
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.5,
                            py: 3,
                            px: 1,
                            height: 'auto',
                            bgcolor: item.bgColor,
                            color: item.color,
                            borderColor: 'transparent',
                            '&:hover': {
                              bgcolor: item.bgColor,
                              filter: 'brightness(0.95)',
                              borderColor: 'transparent',
                            }
                          }}
                        >
                          <item.icon sx={{ fontSize: 32 }} />
                          <Typography variant="caption" fontWeight="medium">{item.text}</Typography>
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>

              {/* Tasas de éxito y evolución mensual */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <BorderCard bordercolor="#ff9800">
                    <CardHeader
                      title={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CheckCircleIcon sx={{ mr: 1, color: '#ff9800' }} />
                          <Typography variant="h6">Tasa de Éxito por Tratamiento</Typography>
                        </Box>
                      }
                      subheader="Porcentaje de tratamientos exitosos"
                      sx={{
                        pb: 1,
                        bgcolor: 'action.hover',
                        '& .MuiCardHeader-action': { m: 0 }
                      }}
                    />
                    <CardContent>
                      <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {[
                          { name: 'Rehabilitación Motora', rate: 94, patients: 156, color: '#2196f3' },
                          { name: 'Terapia de Lenguaje', rate: 89, patients: 78, color: '#4caf50' },
                          { name: 'Terapia Cognitiva', rate: 92, patients: 104, color: '#ff9800' },
                          { name: 'Rehabilitación Post-Quirúrgica', rate: 96, patients: 132, color: '#9c27b0' },
                        ].map((item, i) => (
                          <Box key={i} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    bgcolor: item.color,
                                    mr: 1
                                  }}
                                />
                                <Typography variant="subtitle2">{item.name}</Typography>
                              </Box>
                              <Typography variant="h6" fontWeight="bold">{item.rate}%</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">
                                Pacientes tratados: {item.patients}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Último mes
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={item.rate}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: 'action.hover',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: item.color
                                }
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </BorderCard>
                </Grid>

                <Grid item xs={12} md={6}>
                  <BorderCard bordercolor="#009688">
                    <CardHeader
                      title={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TrendingUpIcon sx={{ mr: 1, color: '#009688' }} />
                          <Typography variant="h6">Evolución Mensual</Typography>
                        </Box>
                      }
                      subheader="Pacientes atendidos en los últimos meses"
                      sx={{
                        pb: 1,
                        bgcolor: 'action.hover',
                        '& .MuiCardHeader-action': { m: 0 }
                      }}
                    />
                    <CardContent>
                      <Box sx={{ height: 250, display: 'flex', alignItems: 'flex-end', gap: 1, pt: 3 }}>
                        {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map((month, i) => {
                          const height = [60, 45, 70, 65, 75, 85, 80, 90, 95, 88, 92, 98][i];
                          return (
                            <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flex: 1 }}>
                              <BarChart
                                height={height}
                                color="#009688"
                                sx={{
                                  backgroundImage: 'linear-gradient(to top, #009688, #4db6ac)',
                                  '&:hover': {
                                    backgroundImage: 'linear-gradient(to top, #00796b, #009688)',
                                  }
                                }}
                              />
                              <Typography variant="caption" fontWeight="medium">{month}</Typography>
                            </Box>
                          );
                        })}
                      </Box>
                    </CardContent>
                  </BorderCard>
                </Grid>
              </Grid>

              {/* Sección inferior con widgets adicionales */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <BorderCard bordercolor="#3f51b5">
                    <CardHeader
                      title={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AwardIcon sx={{ mr: 1, color: '#3f51b5' }} />
                          <Typography variant="h6">Mejores Terapeutas</Typography>
                        </Box>
                      }
                      subheader="Basado en evaluaciones de pacientes"
                      action={
                        <Button
                          variant="text"
                          size="small"
                          endIcon={<ChevronRightIcon />}
                        >
                          Ver todos
                        </Button>
                      }
                      sx={{
                        pb: 1,
                        bgcolor: 'action.hover',
                        '& .MuiCardHeader-action': { m: 0 }
                      }}
                    />
                    <CardContent sx={{ p: 0 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {[
                          { name: 'Dra. Laura Vega', role: 'Terapeuta Ocupacional', rating: 4.9, patients: 128, avatar: 'LV' },
                          { name: 'Dr. Carlos Méndez', role: 'Fisioterapeuta', rating: 4.8, patients: 156, avatar: 'CM' },
                          { name: 'Lic. Roberto Díaz', role: 'Psicólogo', rating: 4.7, patients: 92, avatar: 'RD' },
                        ].map((therapist, i) => (
                          <Box
                            key={i}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              p: 2,
                              '&:hover': { bgcolor: 'action.hover' },
                              borderBottom: i < 2 ? 1 : 0,
                              borderColor: 'divider'
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box sx={{ position: 'relative' }}>
                                <Avatar
                                  alt={therapist.name}
                                  src={`/placeholder.svg?height=48&width=48&text=${therapist.avatar}`}
                                  sx={{ width: 48, height: 48 }}
                                >
                                  {therapist.avatar}
                                </Avatar>
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    bottom: -4,
                                    right: -4,
                                    bgcolor: '#3f51b5',
                                    color: 'white',
                                    width: 20,
                                    height: 20,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 12,
                                    fontWeight: 'bold'
                                  }}
                                >
                                  {i + 1}
                                </Box>
                              </Box>
                              <Box>
                                <Typography variant="subtitle2">{therapist.name}</Typography>
                                <Typography variant="body2" color="text.secondary">{therapist.role}</Typography>
                              </Box>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Typography variant="h6" fontWeight="bold">{therapist.rating}</Typography>
                                <Typography variant="h6" color="warning.main">★</Typography>
                              </Box>
                              <Typography variant="caption" color="text.secondary">
                                {therapist.patients} pacientes
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </BorderCard>
                </Grid>

                <Grid item xs={12} md={4}>
                  <BorderCard bordercolor="#00bcd4">
                    <CardHeader
                      title={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <BellIcon sx={{ mr: 1, color: '#00bcd4' }} />
                          <Typography variant="h6">Recordatorios</Typography>
                        </Box>
                      }
                      subheader="Tareas pendientes para hoy"
                      sx={{
                        pb: 1,
                        bgcolor: 'action.hover',
                        '& .MuiCardHeader-action': { m: 0 }
                      }}
                    />
                    <CardContent sx={{ p: 0 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {[
                          { text: 'Llamar a pacientes para confirmar citas', time: '10:30 AM', priority: 'Alta' },
                          { text: 'Actualizar informes de progreso', time: '13:00 PM', priority: 'Media' },
                          { text: 'Revisar inventario de suministros', time: '15:30 PM', priority: 'Baja' },
                          { text: 'Reunión con el equipo médico', time: '17:00 PM', priority: 'Alta' },
                        ].map((reminder, i) => (
                          <Box
                            key={i}
                            sx={{
                              p: 2,
                              '&:hover': { bgcolor: 'action.hover' },
                              borderBottom: i < 3 ? 1 : 0,
                              borderColor: 'divider'
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography variant="subtitle2">{reminder.text}</Typography>
                              <MuiBadge
                                sx={{
                                  ml: 1,
                                  '& .MuiBadge-badge': {
                                    position: 'static',
                                    transform: 'none',
                                    borderRadius: 1,
                                    padding: '4px 8px',
                                    height: 'auto',
                                  }
                                }}
                                badgeContent={reminder.priority}
                                color={
                                  reminder.priority === 'Alta'
                                    ? 'error'
                                    : reminder.priority === 'Media'
                                      ? 'primary'
                                      : 'default'
                                }
                              />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                              <ClockIcon sx={{ fontSize: 14, mr: 0.5 }} />
                              <Typography variant="body2">{reminder.time}</Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: 'action.hover',
                        borderTop: 1,
                        borderColor: 'divider'
                      }}
                    >
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<PlusIcon />}
                      >
                        Agregar Recordatorio
                      </Button>
                    </Box>
                  </BorderCard>
                </Grid>
              </Grid>
            </Box>
          )}

          {tabValue === 'pacientes' && (
            <Card>
              <CardHeader
                title="Gestión de Pacientes"
                subheader="Administre la información de los pacientes"
              />
              <CardContent>
                <Typography>Contenido de la pestaña de pacientes...</Typography>
              </CardContent>
            </Card>
          )}

          {tabValue === 'citas' && (
            <Card>
              <CardHeader
                title="Gestión de Citas"
                subheader="Administre las citas programadas"
              />
              <CardContent>
                <Typography>Contenido de la pestaña de citas...</Typography>
              </CardContent>
            </Card>
          )}

          {tabValue === 'reportes' && (
            <Card>
              <CardHeader
                title="Reportes y Estadísticas"
                subheader="Visualice datos importantes del centro"
              />
              <CardContent>
                <Typography>Contenido de la pestaña de reportes...</Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default HomeAdmin

