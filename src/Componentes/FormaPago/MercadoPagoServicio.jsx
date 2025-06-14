import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Stack,
  useMediaQuery,
  useTheme,
  Alert,
  CircularProgress,
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
import { v4 as uuidv4 } from 'uuid';

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
    console.log('Iniciando generación de PDF con:', { usuario, usuarioId, fechaCita, hora, nombreServicio });
    const doc = new jsPDF();

    if (!usuarioId) {
      throw new Error('El id_usuario no está disponible');
    }

    console.log('Fecha recibida en generarPDF:', fechaCita);
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
    console.log('PDF generado exitosamente');
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
  if (partes.length >= 2) {
    return `${partes[0].padStart(2, '0')}:${partes[1].padStart(2, '0')}`;
  }
  return hora;
};

// Función para registrar la cita en la base de datos
const registrarCita = async (citaData, horarios, setHorarios) => {
  try {
    const { id_usuario, id_servicio, dia, fecha, hora, horaFin, archivos, descripciones } = citaData;
    console.log('Datos enviados a registrarCita:', {
      id_usuario,
      id_servicio,
      dia,
      fecha,
      hora,
      horaFin,
      archivos: archivos ? archivos.map(f => ({ name: f.name, type: f.type, size: f.size })) : [],
      descripciones,
    });

    const horaNormalizada = normalizarHora(hora);
    let horaFinNormalizada = normalizarHora(horaFin);

    console.log('Hora normalizada:', horaNormalizada);
    console.log('Hora fin normalizada:', horaFinNormalizada);
    console.log('Día:', dia);

    if (!horaFinNormalizada) {
      console.log(`Consultando franjas para ${dia} debido a horaFin faltante`);
      const responseHorarios = await axios.get(`http://localhost:3302/api/citasC/franjas/${dia}`);
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

    // Crear FormData para enviar datos y archivos
    const formData = new FormData();
    formData.append('dia', dia);
    formData.append('horaInicio', horaNormalizada);
    formData.append('horaFin', horaFinNormalizada);
    formData.append('usuario_id', id_usuario);
    formData.append('fecha_cita', fecha);
    formData.append('servicio_id', id_servicio);
    formData.append('estado', 'confirmada');

    // Agregar descripciones
    if (descripciones && Array.isArray(descripciones) && descripciones.length > 0) {
      console.log('Descripciones enviadas:', descripciones);
      formData.append('descripciones', JSON.stringify(descripciones));
    } else {
      console.log('No se enviaron descripciones');
    }

    // Agregar archivos
    if (archivos && Array.isArray(archivos) && archivos.length > 0) {
      archivos.forEach((file, index) => {
        console.log(`Agregando archivo ${index + 1}:`, { name: file.name, type: file.type, size: file.size });
        formData.append('archivos', file);
      });
    } else {
      console.log('No se enviaron archivos');
    }

    // Depurar contenido de FormData
    for (let [key, value] of formData.entries()) {
      console.log(`FormData entry: ${key} =`, value instanceof File ? { name: value.name, type: value.type, size: value.size } : value);
    }

    const reservaResponse = await axios.put('http://localhost:3302/api/citasC/sacar-cita', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).catch(error => {
      console.error('Error en la solicitud a /sacar-cita:', error);
      console.error('Detalles del error:', {
        message: error.message,
        code: error.code,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        } : null,
      });
      throw error;
    });

    console.log('Respuesta de registro de cita:', reservaResponse.data);

    actualizarHorariosLocalmente(horarios, setHorarios, dia, horaNormalizada);

    return reservaResponse.data.message;
  } catch (error) {
    console.error('Error al registrar la cita:', error);
    console.error('Detalles del error:', error.response?.data || error.message);
    throw new Error(`No se pudo registrar la cita: ${error.response?.data?.error || error.message}`);
  }
};

const MercadoPagoServicio = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();

  const { id_usuario, id_servicio, nombre_servicio, dia, fecha, hora, horaFin, precio, notas, archivos, descripciones } = location.state || {};

  const [error, setError] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processed, setProcessed] = useState(false);

  // Restaurar datos de sessionStorage si location.state está vacío
  useEffect(() => {
    if (!id_usuario || !id_servicio || !nombre_servicio || !dia || !fecha || !hora || !precio) {
      const storedData = sessionStorage.getItem('citaData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log('Restaurando datos de sessionStorage:', parsedData);
        navigate(location.pathname, { state: { ...parsedData, archivos, descripciones }, replace: true });
      } else {
        setError('Espera un momento... Estamos validando el pago');
      }
    }
  }, [id_usuario, id_servicio, nombre_servicio, dia, fecha, hora, precio, navigate, location.pathname, archivos, descripciones]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const status = query.get('status');
    const externalReference = query.get('external_reference');

    if (status && externalReference && !processed) {
      console.log('Procesando resultado de pago:', { status, externalReference });
      setProcessed(true);

      if (status === 'success' || status === 'approved') {
        try {
          let refData;
          try {
            refData = JSON.parse(decodeURIComponent(externalReference));
          } catch (parseError) {
            console.error('Error al parsear external_reference:', parseError);
            throw new Error('Formato de external_reference inválido');
          }
          console.log('Datos de external_reference:', refData);

          if (refData.tipo !== 'servicio') {
            console.error('Tipo de external_reference no es servicio:', refData.tipo);
            throw new Error('Tipo de pago inválido');
          }

          const { id_usuario, id_servicio, dia, fecha, hora, horaFin, nombreServicio } = refData;
          const citaData = { 
            id_usuario, 
            id_servicio, 
            dia, 
            fecha, 
            hora, 
            horaFin,
            archivos: location.state?.archivos || [],
            descripciones: location.state?.descripciones || [],
          };
          console.log('Validando citaData:', citaData);

          if (!id_usuario || !id_servicio || !dia || !fecha || !hora || !nombreServicio) {
            throw new Error('Faltan datos en external_reference para registrar la cita');
          }

          registrarCita(citaData, horarios, setHorarios)
            .then(() => {
              console.log('Cita registrada exitosamente');
              return generarPDF(
                localStorage.getItem('usuario') || 'Usuario',
                id_usuario,
                fecha,
                hora,
                nombreServicio
              );
            })
            .then(() => {
              console.log('PDF generado exitosamente');
              Swal.fire({
                icon: 'success',
                title: 'Pago Exitoso',
                text: `Cita confirmada para ${nombreServicio}. Comprobante generado.`,
                confirmButtonText: 'Aceptar',
              });
              sessionStorage.removeItem('citaData');
              navigate('/cliente/Citas', {
                state: { 
                  servicioId: id_servicio, 
                  nombre_servicio: nombreServicio, 
                  precio: refData.precio 
                },
                replace: true,
              });
            })
            .catch(error => {
              console.error('Error en el flujo de pago:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Ocurrió un error al confirmar la cita. Por favor, intenta nuevamente.',
                confirmButtonText: 'Aceptar',
              });
              sessionStorage.removeItem('citaData');
              navigate('/cliente/Citas', {
                state: { servicioId: id_servicio },
                replace: true,
              });
            });
        } catch (error) {
          console.error('Error al procesar el resultado del pago:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Error al procesar el pago.',
            confirmButtonText: 'Aceptar',
          });
          sessionStorage.removeItem('citaData');
          navigate('/cliente/Citas', {
            state: { servicioId: id_servicio },
            replace: true,
          });
        }
      } else {
        console.error('Estado del pago no es success:', status);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `El pago no se completó correctamente (estado: ${status}).`,
          confirmButtonText: 'Aceptar',
        });
        sessionStorage.removeItem('citaData');
        navigate('/cliente/Citas', {
          state: { servicioId: id_servicio },
          replace: true,
        });
      }
    }
  }, [location, navigate, id_usuario, id_servicio, nombre_servicio, dia, fecha, hora, horaFin, horarios, processed, archivos, descripciones]);

  const pagarConMercadoPago = async () => {
    try {
      setLoading(true);
      setError(null);

      if (precio <= 0) {
        throw new Error('El precio del servicio debe ser mayor a 0.');
      }

      const tempId = uuidv4();
      const servicio = {
        id_usuario,
        id_servicio,
        nombre: nombre_servicio,
        precio,
        dia,
        fecha,
        hora,
        horaFin,
        tempId,
        tipo: 'servicio',
        archivos: archivos ? archivos.map(file => ({ name: file.name, type: file.type })) : [],
        descripciones: descripciones || [],
      };
      console.log('Enviando datos a create_preference:', servicio);

      // Guardar datos en sessionStorage
      sessionStorage.setItem('citaData', JSON.stringify(servicio));

      const response = await axios.post('http://localhost:3302/api/mercadopago/pagar', {
        servicio,
      });

      console.log('Respuesta de create_preference:', response.data);

      const checkoutUrl = response.data.init_point;
      if (!checkoutUrl) {
        throw new Error('No se recibió una URL válida para iniciar el pago.');
      }

      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error al iniciar el pago:', error);
      console.error('Detalles del error:', error.response?.data);
      setError(error.message || 'Ocurrió un error al procesar el pago.');
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Ocurrió un error al procesar el pago.',
        confirmButtonText: 'Aceptar',
      });
      sessionStorage.removeItem('citaData');
      navigate('/cliente/Citas', { state: { servicioId: id_servicio } });
    }
  };

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

  const mercadoPagoButtonStyles = {
    backgroundColor: '#009ee3',
    color: '#fff',
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: '16px',
    padding: theme.spacing(1.5),
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: isMobile ? '100%' : '300px',
    height: '48px',
    '&:hover': { backgroundColor: '#0088cc' },
    '&:disabled': { backgroundColor: '#bdbdbd', color: '#fff' },
  };

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
            Pagar con Mercado Pago
          </Typography>
          <Box
            component="img"
            src="https://logospng.org/download/mercado-pago/logo-mercado-pago-256.png"
            alt="Mercado Pago"
            sx={{ height: '40px' }}
          />
        </Box>

        <Divider />

        <Box>
          <Typography variant="body1" color="text.secondary">
            Datos:
          </Typography>
          {precio > 0 ? (
            <Typography variant="h6" fontWeight="bold">
              ${parseFloat(precio).toFixed(2)} MXN
            </Typography>
          ) : (
            <Alert severity="warning">
              No se pudo cargar el monto total. Por favor, regresa e intenta de nuevo.
            </Alert>
          )}

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" fontWeight="medium">
              Detalles de la cita:
            </Typography>
            <Box sx={{ mt: 1 }}>
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
              {notas && (
                <Typography variant="body2">
                  Notas: {notas}
                </Typography>
              )}
              {archivos && archivos.length > 0 && (
                <Typography variant="body2">
                  Archivos: {archivos.length} archivo(s) cargado(s)
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            sx={mercadoPagoButtonStyles}
            disabled={precio <= 0 || loading}
            onClick={pagarConMercadoPago}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Pagar con Mercado Pago'}
          </Button>
        </Box>

        <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
          <SecurityIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="caption">Su pago está protegido con Mercado Pago.</Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default MercadoPagoServicio;