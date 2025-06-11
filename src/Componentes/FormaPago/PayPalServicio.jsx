import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Stack,
  useMediaQuery,
  useTheme,
  Alert,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import Swal from 'sweetalert2';
import axios from 'axios';
import jsPDF from 'jspdf';
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import logo from '../Imagenes/Logo_Circular.png';
import ReactDOM from 'react-dom/client';
import html2canvas from 'html2canvas';
import { FaUser, FaIdCard, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { QRCodeCanvas } from 'qrcode.react';
import Icono from '../Icono';

// Función para generar el QR
const generarQRComoImagen = async () => {
  try {
    const qrDiv = document.createElement('div');
    qrDiv.style.position = 'absolute';
    qrDiv.style.left = '-9999px';
    document.body.appendChild(qrDiv);
    const root = ReactDOM.createRoot(qrDiv);
    root.render(<QRCodeCanvas value="https://centrorehabilitacion-sepia.vercel.app" size={128} />);
    await new Promise(resolve => setTimeout(resolve, 100));
    const canvas = await html2canvas(qrDiv);
    document.body.removeChild(qrDiv);
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error al generar el QR:', error);
    throw new Error('No se pudo generar el código QR');
  }
};

// Función para generar el PDF
const generarPDF = async (usuario, usuarioId, fechaCita, hora, nombreServicio) => {
  try {
    const doc = new jsPDF();

    if (!usuarioId) {
      throw new Error('El id_usuario no está disponible');
    }

    console.log('Fecha recibida en generarPDF:', fechaCita);
    // Parsear la fecha como YYYY-MM-DD en zona horaria local
    const fechaParsed = parse(fechaCita, 'yyyy-MM-dd', new Date());
    const fechaFormateada = format(fechaParsed, "EEEE, d 'de' MMMM", { locale: es });
    console.log('Fecha formateada:', fechaFormateada);

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
      const root = ReactDOM.createRoot(div);
      root.render(<Icono icono={icono} color={color} />);
      await new Promise(resolve => setTimeout(resolve, 100));
      const canvas = await html2canvas(div);
      document.body.removeChild(div);
      return canvas.toDataURL('image/png');
    };

    const iconoUsuarioImg = await convertirIconoAImagen(FaUser, 'green');
    doc.addImage(iconoUsuarioImg, 'PNG', 10, 100, 10, 10);
    doc.text(`Paciente: ${usuario || 'Usuario desconocido'}`, 25, 108);

    const iconoIDImg = await convertirIconoAImagen(FaIdCard, 'blue');
    doc.addImage(iconoIDImg, 'PNG', 10, 115, 10, 10);
    doc.text(`ID de usuario: ${usuarioId}`, 25, 123);

    const iconoCalendarioImg = await convertirIconoAImagen(FaCalendarAlt, 'orange');
    doc.addImage(iconoCalendarioImg, 'PNG', 10, 130, 10, 10);
    doc.text(`Fecha: ${fechaFormateada}`, 25, 138);

    const iconoRelojImg = await convertirIconoAImagen(FaClock, 'purple');
    doc.addImage(iconoRelojImg, 'PNG', 10, 145, 10, 10);
    doc.text(`Hora: ${hora}`, 25, 153);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(`Servicio: ${nombreServicio}`, 25, 168);

    doc.setDrawColor(0, 128, 0);
    doc.setLineWidth(0.5);
    doc.line(10, 175, 200, 175);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 0, 0);
    doc.text("Importante", 10, 185);

    const iconoUbicacionImg = await convertirIconoAImagen(FaMapMarkerAlt, 'red');
    doc.addImage(iconoUbicacionImg, 'PNG', 10, 195, 10, 10);
    doc.setTextColor(0, 0, 0);
    doc.text('Calle Clavel, Col. Valle del Encinal, Huejutla, México', 25, 203);

    const iconoTelefonoImg = await convertirIconoAImagen(FaPhone, 'teal');
    doc.addImage(iconoTelefonoImg, 'PNG', 10, 210, 10, 10);
    doc.text('Teléfono: (+52) 771 162 8377', 25, 218);

    const iconoCorreoImg = await convertirIconoAImagen(FaEnvelope, 'blue');
    doc.addImage(iconoCorreoImg, 'PNG', 10, 225, 10, 10);
    doc.text('Correo: Ltfmariela@hotmail.com', 25, 233);

    doc.setDrawColor(0, 128, 0);
    doc.setLineWidth(0.5);
    doc.line(10, 240, 200, 240);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Aviso:", 10, 250);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text('- Por favor, preséntese 15 minutos antes de su cita.', 15, 260);
    doc.text('- En caso de cancelación, notificar con al menos 24 horas de anticipación.', 15, 270);
    doc.text('- No presentarse a la cita puede generar cargos adicionales.', 15, 280);

    const qrImage = await generarQRComoImagen();
    doc.addImage(qrImage, 'PNG', 150, 100, 50, 50);
    doc.setFontSize(10);
    doc.text('Escanea este código QR para más información:', 150, 95);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text('Términos y condiciones aplican. Consulta más detalles en nuestra página web.', 10, 295);

    doc.save("comprobante_cita.pdf");
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    throw new Error('No se pudo generar el comprobante de la cita');
  }
};

// Función para actualizar horarios localmente
const actualizarHorariosLocalmente = (horarios, setHorarios, dia, horaInicio) => {
  setHorarios(prevHorarios =>
    prevHorarios.map(horario => ({
      ...horario,
      franjas: horario.franjas.map(franja =>
        franja.hora_inicio === horaInicio ? { ...franja, disponible: false } : franja
      ),
    }))
  );
};

// Normalizar hora para comparación
const normalizarHora = hora => {
  if (!hora) return '';
  const partes = hora.trim().split(':');
  return partes.length >= 2 ? `${partes[0].padStart(2, '0')}:${partes[1].padStart(2, '0')}` : hora;
};

// Función para registrar la cita en la base de datos
const registrarCita = async (citaData, horarios, setHorarios) => {
  try {
    const { id_usuario, id_servicio, dia, fecha, hora, horaFin } = citaData;

    const horaNormalizada = normalizarHora(hora);
    console.log('Hora normalizada:', hora);
    console.log('Día:', dia);
    console.log('Hora fin recibida:', horaFin);

    let horaFinNormalizada = normalizarHora(horaFin);

    if (!horaFinNormalizada) {
      console.log(`Consultando franjas para ${dia} debido a horaFin faltante`);
      const responseHorarios = await axios.get(`https://backendcentro.onrender.com/api/citasC/franjas/${dia}`);
      const horariosData = responseHorarios.data;
      console.log('Respuesta de la API de franjas:', horariosData);

      const franjaSeleccionada = horariosData
        .flatMap(horario => horario.franjas)
        .find(franja => normalizarHora(franja.hora_inicio) === horaNormalizada);

      if (!franjaSeleccionada) {
        throw new Error(`Franja horaria ${horaNormalizada} no encontrada para el día ${dia}`);
      }

      console.log('Franja encontrada:', franjaSeleccionada);
      horaFinNormalizada = normalizarHora(franjaSeleccionada.hora_fin);
    }

    const reservaResponse = await axios.put('https://backendcentro.onrender.com/api/citasC/sacar-cita', {
      dia,
      horaInicio: horaNormalizada,
      horaFin: horaFinNormalizada,
      usuario_id: id_usuario,
      fecha_cita: fecha,
      servicio_id: id_servicio,
      estado: 'confirmada',
    });
    console.log('Respuesta de registro de cita:', reservaResponse.data);

    actualizarHorariosLocalmente(horarios, setHorarios, dia, horaNormalizada);

    return reservaResponse.data.message;
  } catch (error) {
    console.error('Error al registrar la cita:', error);
    throw new Error(`No se pudo registrar la cita: ${error.response?.data?.message || error.message}`);
  }
};

const PayPalServicio = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();

  const { id_usuario, id_servicio, nombre_servicio, dia, fecha, hora, horaFin, precio, horario } = location.state || {};

  const paypalButtonRef = useRef(null);
  const [error, setError] = useState(null);
  const [horarios, setHorarios] = useState([]);

  useEffect(() => {
    console.log('Datos recibidos en PayPalServicio:', location.state);
    if (!id_usuario || !id_servicio || !nombre_servicio || !dia || !fecha || !hora || !precio) {
      setError('Faltan datos para procesar el pago. Por favor, regresa e intenta de nuevo.');
    }
  }, [id_usuario, id_servicio, nombre_servicio, dia, fecha, hora, horaFin, precio, horario]);

  const containerStyles = {
    maxWidth: isMobile ? '100%' : '650px',
    margin: 'auto',
    marginTop: '2rem',
    marginBottom: '2rem',
    padding: theme.spacing(3),
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
  };

  useEffect(() => {
    if (window.paypal && precio && precio > 0 && !error) {
      const container = document.getElementById('paypal-button-container');
      if (container) {
        container.innerHTML = '';
      }

      if (paypalButtonRef.current) {
        paypalButtonRef.current.close();
        paypalButtonRef.current = null;
      }

      const button = window.paypal.Buttons({
        style: {
          color: 'gold',
          shape: 'pill',
          label: 'paypal',
          layout: 'horizontal',
        },
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: parseFloat(precio).toFixed(2),
                currency_code: 'MXN',
              },
              description: `Pago de cita para ${nombre_servicio} el ${fecha} a las ${hora}`,
            }],
          });
        },
        onApprove: async (data, actions) => {
          try {
            const details = await actions.order.capture();
            const citaData = {
              id_usuario,
              id_servicio,
              dia,
              fecha,
              hora,
              horaFin,
            };

            const mensaje = await registrarCita(citaData, horarios, setHorarios);

            await generarPDF(
              localStorage.getItem('usuario') || 'Usuario',
              id_usuario,
              fecha,
              hora,
              nombre_servicio
            );

            Swal.fire({
              title: 'Pago Exitoso',
              text: `Cita confirmada para ${nombre_servicio}. Comprobante generado.`,
              icon: 'success',
              confirmButtonText: 'Aceptar',
            });

            navigate('/cliente/CitasCliente', {
              state: {
                servicioId: id_servicio,
              },
            });
          } catch (error) {
            console.error('Error en el flujo de pago:', error);
            Swal.fire({
              title: 'Error',
              text: error.message || 'Ocurrió un error al confirmar la cita. Por favor, intenta nuevamente.',
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });

            navigate('/cliente/CitasCliente', {
              state: {
                servicioId: id_servicio,
              },
            });
          }
        },
        onError: (err) => {
          console.error('Error en el pago con PayPal:', err);
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al procesar el pago con PayPal.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });

          navigate('/cliente/CitasCliente', {
            state: {
              servicioId: id_servicio,
            },
          });
        },
      });

      paypalButtonRef.current = button;
      button.render('#paypal-button-container');
    }

    return () => {
      if (paypalButtonRef.current) {
        paypalButtonRef.current.close();
        paypalButtonRef.current = null;
      }
      const container = document.getElementById('paypal-button-container');
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [precio, error, id_usuario, id_servicio, nombre_servicio, dia, fecha, hora, horaFin, horario, navigate, horarios]);

  if (error) {
    return (
      <Paper elevation={3} sx={containerStyles}>
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={containerStyles}>
      <Stack spacing={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" fontWeight="bold" color="primary">
            Pagar con PayPal
          </Typography>
          <Box
            component="img"
            src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
            alt="PayPal"
            sx={{ height: '40px' }}
          />
        </Box>

        <Divider />

        <Box>
          <Typography variant="body1" color="text.secondary">Datos:</Typography>
          {precio > 0 ? (
            <Typography variant="h6" fontWeight="bold">
              ${parseFloat(precio).toFixed(2)} MXN
            </Typography>
          ) : (
            <Alert severity="warning">
              No se pudo cargar el monto total. Por favor, regresa e intenta de nuevo.
            </Alert>
          )}

          <Box mt={2}>
            <Typography variant="body2" color="text.secondary" fontWeight="medium">
              Detalles de la cita:
            </Typography>
            <Box sx={{mt: 1}}>
              <Typography variant="body2">
                Servicio: {nombre_servicio || 'No especificado'}
              </Typography>
              <Typography variant="body2">
                Día: {dia || 'No especificado'}
              </Typography>
              <Typography variant="body2">
                Fecha: {fecha || 'No especificada'}
              </Typography>
              <Typography variant="body2">
                Hora: {hora || 'No especificada'}
              </Typography>
              {horario && (
                <Typography variant="body2">
                  Notas: {horario}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Box display="flex" justifyContent="center" mt={2}>
          <div id="paypal-button-container" style={{ width: isMobile ? '100%' : '300px' }} />
        </Box>

        <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
          <SecurityIcon fontSize="small" color="action" sx={{ mr: 1 }} />
          <Typography variant="caption">Su pago está protegido con PayPal.</Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default PayPalServicio;