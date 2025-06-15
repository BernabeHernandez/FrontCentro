import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, addDays, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faUpload } from '@fortawesome/free-solid-svg-icons';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Paper,
  Divider,
  Chip,
  CircularProgress,
  Input,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#28a745' },
    secondary: { main: '#1976d2' },
  },
  typography: { fontFamily: 'Poppins, sans-serif' },
});

const CitasCliente = () => {
  const [diasDisponibles, setDiasDisponibles] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [usuarioRegistrado, setUsuarioRegistrado] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nombreServicio, setNombreServicio] = useState('');
  const [precioServicio, setPrecioServicio] = useState(null);
  const [archivos, setArchivos] = useState([]); // Estado para los archivos subidos
  const navigate = useNavigate();
  const location = useLocation();
  const servicioId = location.state?.servicioId;

  // Validar servicioId
  useEffect(() => {
    if (!servicioId) {
      Swal.fire({
        icon: 'warning',
        title: 'Servicio no seleccionado',
        text: 'Por favor selecciona un servicio antes de reservar una cita.',
        confirmButtonText: 'Entendido',
      }).then(() => navigate('/cliente/servicios'));
    }
  }, [servicioId, navigate]);

  // Cargar datos del servicio
  useEffect(() => {
    const fetchServicioData = async () => {
      if (servicioId) {
        try {
          if (location.state?.precio !== undefined) {
            setPrecioServicio(location.state.precio);
            setNombreServicio(location.state?.nombre_servicio || '');
          } else {
            const response = await axios.get(`https://backendcentro.onrender.com/api/servicios/${servicioId}`);
            setNombreServicio(response.data.nombre);
            setPrecioServicio(response.data.precio || 0);
          }
        } catch (error) {
          console.error('Error al obtener los datos del servicio:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cargar la información del servicio.',
            confirmButtonText: 'Entendido',
          });
        }
      }
    };
    fetchServicioData();
  }, [servicioId, location.state?.precio, location.state?.nombre_servicio]);

  // Verificar usuario registrado
  useEffect(() => {
    const verificarUsuarioRegistrado = async () => {
      try {
        const usuario = localStorage.getItem('usuario');
        if (!usuario) {
          setUsuarioRegistrado(false);
          Swal.fire({
            icon: 'warning',
            title: 'Acceso restringido',
            text: 'Necesitas iniciar sesión o registrarte para reservar una cita.',
            confirmButtonText: 'Entendido',
          }).then(() => navigate('/login'));
          return;
        }
        const response = await axios.get(`https://backendcentro.onrender.com/api/login/verificar-usuario/${usuario}`);
        if (response.data.existe) {
          setUsuarioRegistrado(true);
          if (response.data.usuario && response.data.usuario.id) {
            setUsuarioId(response.data.usuario.id);
            localStorage.setItem('usuario_id', response.data.usuario.id);
          }
        } else {
          setUsuarioRegistrado(false);
          Swal.fire({
            icon: 'warning',
            title: 'Usuario no registrado',
            text: 'El usuario no está registrado. Por favor, regístrate.',
            confirmButtonText: 'Entendido',
          }).then(() => navigate('/login'));
        }
      } catch (error) {
        console.error('Error al verificar el usuario:', error);
        setUsuarioRegistrado(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al verificar tu cuenta. Por favor, intenta nuevamente.',
          confirmButtonText: 'Entendido',
        }).then(() => navigate('/login'));
      }
    };
    verificarUsuarioRegistrado();
  }, [navigate]);

  // Obtener días disponibles
  useEffect(() => {
    const getDiasDisponibles = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://backendcentro.onrender.com/api/citasC/dias-disponibles');
        const diasConHorario = response.data;
        if (!Array.isArray(diasConHorario) || diasConHorario.length === 0) {
          throw new Error('No se encontraron días disponibles');
        }

        const hoy = new Date();
        const diaActual = hoy.getDay();
        const horaActual = hoy.getHours();

        const horarioHoy = diasConHorario.find(dia => dia.dia.toLowerCase() === format(hoy, 'EEEE', { locale: es }).toLowerCase());
        let dentroDelHorario = false;
        if (horarioHoy && typeof horarioHoy.hora_inicio === 'string' && typeof horarioHoy.hora_fin === 'string') {
          const horaInicioHoy = parseInt(horarioHoy.hora_inicio.split(':')[0], 10);
          const horaFinHoy = parseInt(horarioHoy.hora_fin.split(':')[0], 10);
          dentroDelHorario = horaActual >= horaInicioHoy && horaActual < horaFinHoy;
        }

        let diasDisponiblesAjustados = dentroDelHorario
          ? diasConHorario.slice(diaActual - 1).concat(diasConHorario.slice(0, diaActual - 1))
          : diasConHorario.slice(diaActual).concat(diasConHorario.slice(0, diaActual));

        const diasConFechas = diasDisponiblesAjustados.map((dia, index) => {
          const fecha = addDays(hoy, index);
          const nombreDia = format(fecha, 'EEEE', { locale: es }).toLowerCase();
          return {
            nombre: nombreDia,
            fecha: fecha,
            fechaFormateada: format(fecha, "EEEE, d 'de' MMMM", { locale: es }),
            hora_inicio: dia.hora_inicio || '00:00',
            hora_fin: dia.hora_fin || '23:59',
            disponible: dia.disponible || 0
          };
        });

        setDiasDisponibles(diasConFechas);
      } catch (error) {
        console.error('Error al obtener los días disponibles:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los días disponibles. Por favor, intenta nuevamente.',
          confirmButtonText: 'Entendido',
        });
      } finally {
        setLoading(false);
      }
    };
    if (usuarioRegistrado) getDiasDisponibles();
  }, [usuarioRegistrado]);

  // Seleccionar día
  const handleSelectDay = async (dia, fecha, disponible) => {
    if (disponible === 0) return;
    setSelectedDay(dia);
    setLoading(true);
    try {
      const response = await axios.get(`https://backendcentro.onrender.com/api/citasC/franjas/${dia}`);
      setHorarios(response.data);
    } catch (error) {
      console.error('Error al obtener las franjas horarias:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar las franjas horarias.',
        confirmButtonText: 'Entendido',
      });
    } finally {
      setLoading(false);
    }
  };

  // Seleccionar hora
  const handleSelectTime = (time, disponible) => {
    if (disponible) setSelectedTime(time);
  };

  // Verificar si la franja ha pasado
  const haPasadoLaFranja = (horaInicioFranja, fechaSeleccionada) => {
    if (!isToday(fechaSeleccionada)) return false;
    const ahora = new Date();
    const [horaFranja, minutosFranja] = horaInicioFranja.split(':').map(Number);
    const horaActual = ahora.getHours();
    const minutosActuales = ahora.getMinutes();
    return (horaActual > horaFranja || (horaActual === horaFranja && minutosActuales >= minutosFranja));
  };

  // Manejar la selección de archivos
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setArchivos([...archivos, ...files]);
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];

    const validFiles = files.filter(file => validImageTypes.includes(file.type));
    const invalidFiles = files.filter(file => !validImageTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Archivos no válidos',
        text: 'Solo se permiten imágenes (JPEG, PNG, GIF, BMP, WebP). Los archivos no válidos serán ignorados.',
        confirmButtonText: 'Entendido',
      });
    }

    if (validFiles.length > 0) {
      setArchivos([...archivos, ...validFiles]);
    }
  };

  // Eliminar un archivo de la lista
  const handleRemoveFile = (index) => {
    setArchivos(archivos.filter((_, i) => i !== index));
  };

  // Manejar la acción de sacar cita
  const handleSacarCita = async () => {
    const usuario = localStorage.getItem('usuario');
    if (!usuario || !usuarioId) {
      Swal.fire({
        icon: 'warning',
        title: 'Acceso restringido',
        text: 'Necesitas iniciar sesión o registrarte para reservar una cita.',
        confirmButtonText: 'Entendido',
      }).then(() => navigate('/login'));
      return;
    }

    try {
      const response = await axios.get(`https://backendcentro.onrender.com/api/login/verificar-usuario/${usuario}`);
      if (!response.data.existe) {
        Swal.fire({
          icon: 'warning',
          title: 'Usuario no registrado',
          text: 'El usuario no está взрослых. Por favor, regístrate.',
          confirmButtonText: 'Entendido',
        }).then(() => navigate('/login'));
        return;
      }

      if (selectedDay && selectedTime && precioServicio !== null) {
        const franjaSeleccionada = horarios
          .flatMap(horario => horario.franjas)
          .find(franja => franja.hora_inicio === selectedTime);

        if (!franjaSeleccionada) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se encontró la franja horaria seleccionada.',
            confirmButtonText: 'Entendido',
          });
          return;
        }

        // Validar disponibilidad de la franja
        try {
          const responseHorarios = await axios.get(`https://backendcentro.onrender.com/api/citasC/franjas/${selectedDay}`);
          const horariosData = responseHorarios.data;
          const franjaValida = horariosData
            .flatMap(horario => horario.franjas)
            .find(franja => franja.hora_inicio === selectedTime && franja.disponible);

          if (!franjaValida) {
            Swal.fire({
              icon: 'error',
              title: 'Franja no disponible',
              text: 'La franja horaria seleccionada ya no está disponible. Por favor, elige otra.',
              confirmButtonText: 'Entendido',
            });
            setSelectedTime(null);
            setHorarios(horariosData);
            return;
          }
        } catch (error) {
          console.error('Error al validar la franja horaria:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo validar la franja horaria. Por favor, intenta nuevamente.',
            confirmButtonText: 'Entendido',
          });
          return;
        }

        const diaSeleccionado = diasDisponibles.find(dia => dia.nombre === selectedDay);
        const fechaCita = format(diaSeleccionado.fecha, 'yyyy-MM-dd');

        if (!nombreServicio || nombreServicio.trim() === '') {
          Swal.fire({
            icon: 'warning',
            title: 'Datos incompletos',
            text: 'El nombre del servicio no está disponible. Por favor, intenta de nuevo.',
            confirmButtonText: 'Entendido',
          });
          return;
        }

        const confirmacion = await Swal.fire({
          icon: 'question',
          title: 'Confirmar cita',
          text: `¿Deseas reservar la cita para ${nombreServicio} el ${format(diaSeleccionado.fecha, "EEEE, d 'de' MMMM", { locale: es })} a las ${selectedTime}?${archivos.length > 0 ? ` Se subirán ${archivos.length} archivo(s).` : ''}`,
          showCancelButton: true,
          confirmButtonText: 'Sí, reservar',
          cancelButtonText: 'No, cancelar',
          confirmButtonColor: '#28a745',
          cancelButtonColor: '#dc3545',
        });

        if (confirmacion.isConfirmed) {
          // Subir archivos si los hay
          if (archivos.length > 0) {
            try {
              const formData = new FormData();
              archivos.forEach((file) => {
                formData.append('archivos', file);
              });
              formData.append('usuario_id', usuarioId);
              formData.append('descripcion', 'Archivos subidos para cita');

              await axios.post('https://backendcentro.onrender.com/api/citasC/guardar-archivos', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
              });
            } catch (error) {
              console.error('Error al subir archivos:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron subir los archivos. Por favor, intenta nuevamente.',
                confirmButtonText: 'Entendido',
              });
              return;
            }
          }

          // Proceder con la navegación original
          navigate('/cliente/metodoServicios', {
            state: {
              id_usuario: usuarioId,
              id_servicio: servicioId,
              nombre_servicio: nombreServicio,
              dia: selectedDay,
              fecha: fechaCita,
              hora: selectedTime,
              horaFin: franjaSeleccionada.hora_fin,
              precio: precioServicio,
              notas: null,
            },
          });
        }
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Selección incompleta',
          text: 'Por favor selecciona un día, una hora y asegúrate de que el servicio esté cargado.',
          confirmButtonText: 'Entendido',
        });
      }
    } catch (error) {
      console.error('Error al procesar la cita:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al procesar la cita. Por favor, intenta nuevamente.',
        confirmButtonText: 'Entendido',
      });
    }
  };

  if (!usuarioRegistrado) return null;

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, background: 'linear-gradient(135deg, #f9f9f9, #e6f3ff)' }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <FontAwesomeIcon icon={faCalendarAlt} /> Reserva tu cita {nombreServicio ? `para ${nombreServicio}` : ''}
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FontAwesomeIcon icon={faCalendarAlt} /> Días disponibles
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={2}>
                {diasDisponibles.map((dia, index) => (
                  <Grid item xs={12} sm={6} md={2} key={index}>
                    <Card
                      onClick={dia.disponible === 1 ? () => handleSelectDay(dia.nombre, dia.fecha, dia.disponible) : undefined}
                      sx={{
                        cursor: dia.disponible === 1 ? 'pointer' : 'not-allowed',
                        transition: 'all 0.3s ease',
                        border: selectedDay === dia.nombre ? '2px solid #28a745' : '2px solid #e0e0e0',
                        backgroundColor: dia.disponible === 0 ? '#f5f5f5' : selectedDay === dia.nombre ? '#e8f5e9' : '#fff',
                        opacity: dia.disponible === 0 ? 0.6 : 1,
                        '&:hover': dia.disponible === 1 && {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 6px 18px rgba(0, 123, 255, 0.2)',
                          borderColor: '#28a745',
                        },
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                          {format(dia.fecha, 'd')}
                        </Typography>
                        <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                          {format(dia.fecha, 'EEEE', { locale: es })}
                        </Typography>
                        {dia.disponible === 0 && (
                          <Typography variant="body2" sx={{ color: '#d32f2f', mt: 1 }}>
                            No disponible
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          {selectedDay && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FontAwesomeIcon icon={faClock} /> Horarios disponibles para {selectedDay}
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              ) : horarios.length === 0 ? (
                <Typography>No hay horarios disponibles para este día.</Typography>
              ) : (
                <Grid container spacing={2}>
                  {horarios.map((horario) => (
                    <Grid item xs={12} key={horario.id_horario}>
                      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          {`${horario.hora_inicio} - ${horario.hora_fin}`}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                          {horario.franjas.map((franja) => {
                            const diaSeleccionado = diasDisponibles.find(dia => dia.nombre === selectedDay);
                            const franjaPasada = haPasadoLaFranja(franja.hora_inicio, diaSeleccionado.fecha);
                            const disponible = franja.disponible && !franjaPasada;

                            return (
                              <Chip
                                key={franja.id_franja}
                                label={`${franja.hora_inicio} - ${franja.hora_fin}`}
                                onClick={() => handleSelectTime(franja.hora_inicio, disponible)}
                                color={disponible ? 'primary' : 'default'}
                                variant={selectedTime === franja.hora_inicio ? 'filled' : 'outlined'}
                                disabled={!disponible}
                                sx={{
                                  height: 40,
                                  fontSize: '1.1rem',
                                  padding: '8px 16px',
                                  borderRadius: '20px',
                                  transition: 'all 0.3s ease',
                                  '&:hover': disponible ? { backgroundColor: '#28a745', color: '#fff' } : {},
                                }}
                              />
                            );
                          })}
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}

          {/* Sección para subir archivos */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'red', fontStyle: 'italic' }}>
              <FontAwesomeIcon icon={faUpload} /> Subir imágenes (opcional). Si cuenta con resultados de estudios o radiografías, súbalos aquí; si no, no es necesario. (Solo Imágenes, Fotos, o Capturas de pantalla)
            </Typography>
            <Input
              type="file"
              inputProps={{ accept: 'image/*', multiple: true }}
              onChange={handleFileChange}
              sx={{ mb: 2 }}
            />
            {archivos.length > 0 && (
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Archivos seleccionados:
                </Typography>
                <List>
                  {archivos.map((file, index) => (
                    <ListItem key={index} secondaryAction={
                      <Button color="error" onClick={() => handleRemoveFile(index)}>
                        Eliminar
                      </Button>
                    }>
                      <ListItemText primary={file.name} secondary={`${(file.size / 1024).toFixed(2)} KB`} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSacarCita}
              startIcon={<FontAwesomeIcon icon={faCalendarAlt} />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 18px rgba(0, 123, 255, 0.3)',
                },
              }}
            >
              Sacar Cita
            </Button>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default CitasCliente;