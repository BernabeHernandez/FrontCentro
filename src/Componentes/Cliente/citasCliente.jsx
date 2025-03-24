import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, addDays, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import jsPDF from 'jspdf';
import { useNavigate, useLocation } from 'react-router-dom'; // Agregamos useLocation
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import logo from '../Imagenes/Logo_Circular.png';
import ReactDOM from 'react-dom';
import html2canvas from 'html2canvas';
import { FaUser, FaIdCard, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { QRCodeCanvas } from 'qrcode.react';
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
  CircularProgress
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Icono from '../Icono';

const theme = createTheme({
  palette: {
    primary: {
      main: '#28a745',
    },
    secondary: {
      main: '#1976d2',
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});

const generarQRComoImagen = async () => {
  const qrDiv = document.createElement('div');
  qrDiv.style.position = 'absolute';
  qrDiv.style.left = '-9999px';
  document.body.appendChild(qrDiv);

  ReactDOM.render(<QRCodeCanvas value="https://tu-aplicacion.com" size={128} />, qrDiv);

  const canvas = await html2canvas(qrDiv);
  document.body.removeChild(qrDiv);

  return canvas.toDataURL('image/png');
};

const CitasCliente = () => {
  const [diasDisponibles, setDiasDisponibles] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [usuarioRegistrado, setUsuarioRegistrado] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nombreServicio, setNombreServicio] = useState(''); // Nuevo: para mostrar el nombre del servicio
  const navigate = useNavigate();
  const location = useLocation(); // Nuevo: para obtener el estado de navegación

  // Obtener el servicioId del estado de navegación
  const servicioId = location.state?.servicioId;

  // Verificar que el servicioId esté presente
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

  // Obtener el nombre del servicio
  useEffect(() => {
    const fetchNombreServicio = async () => {
      if (servicioId) {
        try {
          const response = await axios.get(`https://backendcentro.onrender.com/api/servicios/${servicioId}`);
          setNombreServicio(response.data.nombre);
        } catch (error) {
          console.error('Error al obtener el nombre del servicio:', error);
        }
      }
    };
    fetchNombreServicio();
  }, [servicioId]);

  const haPasadoLaFranja = (horaInicioFranja, fechaSeleccionada) => {
    if (!isToday(fechaSeleccionada)) return false;
    const ahora = new Date();
    const [horaFranja, minutosFranja] = horaInicioFranja.split(':').map(Number);
    const horaActual = ahora.getHours();
    const minutosActuales = ahora.getMinutes();
    return (horaActual > horaFranja || (horaActual === horaFranja && minutosActuales >= minutosFranja));
  };

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

  useEffect(() => {
    verificarUsuarioRegistrado();
  }, []);

  const getDiasDisponibles = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://backendcentro.onrender.com/api/citasC/dias-disponibles');
      const diasConHorario = response.data;
      const hoy = new Date();
      const diaActual = hoy.getDay();
      const horaActual = hoy.getHours();

      const horarioHoy = diasConHorario.find(dia => dia.dia.toLowerCase() === format(hoy, 'EEEE', { locale: es }).toLowerCase());
      const horaInicioHoy = parseInt(horarioHoy.hora_inicio.split(':')[0], 10);
      const horaFinHoy = parseInt(horarioHoy.hora_fin.split(':')[0], 10);

      const dentroDelHorario = horaActual >= horaInicioHoy && horaActual < horaFinHoy;

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
          hora_inicio: dia.hora_inicio,
          hora_fin: dia.hora_fin,
        };
      });

      setDiasDisponibles(diasConFechas);
    } catch (error) {
      console.error('Error al obtener los días disponibles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (usuarioRegistrado) getDiasDisponibles();
  }, [usuarioRegistrado]);

  const handleSelectDay = async (dia, fecha) => {
    setSelectedDay(dia);
    setLoading(true);
    try {
      const response = await axios.get(`https://backendcentro.onrender.com/api/citasC/franjas/${dia}`);
      setHorarios(response.data);
    } catch (error) {
      console.error('Error al obtener las franjas horarias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTime = (time, disponible) => {
    if (disponible) setSelectedTime(time);
  };

  const generarPDF = async () => {
    const doc = new jsPDF();
    const usuario = localStorage.getItem('usuario');
    const usuarioId = localStorage.getItem('usuario_id');

    if (!usuarioId) {
      console.error('El id_usuario no está disponible en localStorage.');
      return;
    }

    const diaSeleccionado = diasDisponibles.find(dia => dia.nombre === selectedDay);
    const fechaCita = format(diaSeleccionado.fecha, 'EEEE, d \'de\' MMMM', { locale: es });

    doc.addImage(logo, 'PNG', 80, 10, 50, 50);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 128, 0);
    doc.text("Centro de Rehabilitación Integral San Juan", 10, 75);
    doc.setDrawColor(0, 128, 0);
    doc.setLineWidth(0.5);
    doc.line(10, 80, 200, 80);
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text("Comprobante de Cita", 70, 90);

    const convertirIconoAImagen = async (icono, color) => {
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.left = '-9999px';
      document.body.appendChild(div);
      ReactDOM.render(<Icono icono={icono} color={color} />, div);
      const canvas = await html2canvas(div);
      document.body.removeChild(div);
      return canvas.toDataURL('image/png');
    };

    const iconoUsuarioImg = await convertirIconoAImagen(FaUser, 'green');
    doc.addImage(iconoUsuarioImg, 'PNG', 10, 100, 10, 10);
    doc.text(`Paciente: ${usuario}`, 25, 108);

    const iconoIDImg = await convertirIconoAImagen(FaIdCard, 'blue');
    doc.addImage(iconoIDImg, 'PNG', 10, 115, 10, 10);
    doc.text(`ID de Usuario: ${usuarioId}`, 25, 123);

    const iconoCalendarioImg = await convertirIconoAImagen(FaCalendarAlt, 'orange');
    doc.addImage(iconoCalendarioImg, 'PNG', 10, 130, 10, 10);
    doc.text(`Fecha: ${fechaCita}`, 25, 138);

    const iconoRelojImg = await convertirIconoAImagen(FaClock, 'purple');
    doc.addImage(iconoRelojImg, 'PNG', 10, 145, 10, 10);
    doc.text(`Hora: ${selectedTime}`, 25, 153);

    // Nuevo: Agregar el nombre del servicio al PDF
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(`Servicio: ${nombreServicio}`, 25, 168);

    doc.setDrawColor(0, 128, 0);
    doc.setLineWidth(0.5);
    doc.line(10, 175, 200, 175); // Ajustar la línea para dar espacio al nuevo texto

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 0, 0);
    doc.text("Importante", 10, 185); // Ajustar posición

    const iconoUbicacionImg = await convertirIconoAImagen(FaMapMarkerAlt, 'red');
    doc.addImage(iconoUbicacionImg, 'PNG', 10, 195, 10, 10); // Ajustar posición
    doc.setTextColor(0, 0, 0);
    doc.text('Calle Clavel, Col. Valle del Encinal, Huejutla, Mexico', 25, 203); // Ajustar posición

    const iconoTelefonoImg = await convertirIconoAImagen(FaPhone, 'teal');
    doc.addImage(iconoTelefonoImg, 'PNG', 10, 210, 10, 10); // Ajustar posición
    doc.text('Teléfono: (+51) 771 162 8377', 25, 218); // Ajustar posición

    const iconoCorreoImg = await convertirIconoAImagen(FaEnvelope, 'blue');
    doc.addImage(iconoCorreoImg, 'PNG', 10, 225, 10, 10); // Ajustar posición
    doc.text('Correo: Ltfmariela@hotmail.com', 25, 233); // Ajustar posición

    doc.setDrawColor(0, 128, 0);
    doc.setLineWidth(0.5);
    doc.line(10, 240, 200, 240); // Ajustar posición

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Aviso:", 10, 250); // Ajustar posición

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text('- Por favor, preséntese 15 minutos antes de su cita.', 15, 260); // Ajustar posición
    doc.text('- En caso de cancelación, notificar con al menos 24 horas de anticipación.', 15, 270); // Ajustar posición
    doc.text('- No presentarse a la cita puede generar cargos adicionales.', 15, 280); // Ajustar posición

    const qrImage = await generarQRComoImagen();
    doc.addImage(qrImage, 'PNG', 150, 100, 50, 50);
    doc.setFontSize(10);
    doc.text('Escanea este código QR para más información:', 150, 95);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text('Términos y condiciones aplican. Consulta más detalles en nuestra página web.', 10, 295); // Ajustar posición

    doc.save("comprobante_cita.pdf");
  };

  const actualizarHorariosLocalmente = (dia, horaInicio) => {
    setHorarios((prevHorarios) =>
      prevHorarios.map((horario) => ({
        ...horario,
        franjas: horario.franjas.map((franja) =>
          franja.hora_inicio === horaInicio ? { ...franja, disponible: false } : franja
        ),
      }))
    );
    setSelectedTime(null);
  };

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
          text: 'El usuario no está registrado. Por favor, regístrate.',
          confirmButtonText: 'Entendido',
        }).then(() => navigate('/login'));
        return;
      }

      if (selectedDay && selectedTime) {
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

        const horaFin = franjaSeleccionada.hora_fin;
        const diaSeleccionado = diasDisponibles.find(dia => dia.nombre === selectedDay);
        const fechaCita = format(diaSeleccionado.fecha, 'yyyy-MM-dd');

        const confirmacion = await Swal.fire({
          icon: 'question',
          title: 'Confirmar cita',
          text: `¿Deseas reservar la cita para ${nombreServicio} el ${format(diaSeleccionado.fecha, "EEEE, d 'de' MMMM", { locale: es })} a las ${selectedTime}?`,
          showCancelButton: true,
          confirmButtonText: 'Sí, reservar',
          cancelButtonText: 'No, cancelar',
          confirmButtonColor: '#28a745',
          cancelButtonColor: '#dc3545',
        });

        if (confirmacion.isConfirmed) {
          const reservaResponse = await axios.put('https://backendcentro.onrender.com/api/citasC/sacar-cita', {
            dia: selectedDay,
            horaInicio: selectedTime,
            horaFin: horaFin,
            usuario_id: usuarioId,
            fecha_cita: fechaCita,
            servicio_id: servicioId, // Nuevo: enviar el servicio_id
            estado: 'pendiente', // Nuevo: enviar el estado por defecto
          });

          actualizarHorariosLocalmente(selectedDay, selectedTime);

          Swal.fire({
            icon: 'success',
            title: 'Cita reservada',
            text: reservaResponse.data.message,
            confirmButtonText: 'Entendido',
          }).then(() => generarPDF());
        }
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Selección incompleta',
          text: 'Por favor selecciona un día y una hora para reservar la cita.',
          confirmButtonText: 'Entendido',
        });
      }
    } catch (error) {
      console.error('Error al reservar la cita:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al reservar la cita',
        text: 'Hubo un problema al reservar la cita. Por favor, intenta nuevamente.',
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
                      onClick={() => handleSelectDay(dia.nombre, dia.fecha)}
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: selectedDay === dia.nombre ? '2px solid #28a745' : '2px solid #e0e0e0',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 6px 18px rgba(0, 123, 255, 0.2)',
                          borderColor: '#28a745',
                        },
                        backgroundColor: selectedDay === dia.nombre ? '#e8f5e9' : '#fff',
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                          {format(dia.fecha, 'd')}
                        </Typography>
                        <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                          {format(dia.fecha, 'EEEE', { locale: es })}
                        </Typography>
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