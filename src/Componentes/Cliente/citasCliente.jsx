import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import logo from '../Imagenes/Logo_Circular.png';
import Icono from '../Icono';
import ReactDOM from 'react-dom';
import html2canvas from 'html2canvas';
import { FaUser, FaIdCard, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { QRCodeCanvas } from 'qrcode.react';

const generarQRComoImagen = async () => {
  const qrDiv = document.createElement('div');
  qrDiv.style.position = 'absolute';
  qrDiv.style.left = '-9999px';
  document.body.appendChild(qrDiv);

  // Renderizar el código QR en el div usando QRCodeCanvas
  ReactDOM.render(<QRCodeCanvas value="https://tu-aplicacion.com" size={128} />, qrDiv);

  // Convertir el div a imagen usando html2canvas
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
  const [usuarioId, setUsuarioId] = useState(null); // Nuevo estado para el id_usuario
  const navigate = useNavigate();

  // Verificar si el usuario está registrado
  const verificarUsuarioRegistrado = async () => {
    try {
      const usuario = localStorage.getItem('usuario'); // Obtener el nombre de usuario desde localStorage
      if (!usuario) {
        setUsuarioRegistrado(false); // No hay usuario en localStorage

        // Mostrar mensaje con SweetAlert2 y redirigir al login
        Swal.fire({
          icon: 'warning',
          title: 'Acceso restringido',
          text: 'Necesitas iniciar sesión o registrarte para reservar una cita.',
          confirmButtonText: 'Entendido',
        }).then(() => {
          navigate('/login'); // Redirigir al login después de cerrar el mensaje
        });

        return;
      }

      // Verificar si el usuario existe en la base de datos
      const response = await axios.get(`https://backendcentro.onrender.com/api/login/verificar-usuario/${usuario}`);
      if (response.data.existe) {
        setUsuarioRegistrado(true); // El usuario existe en la base de datos

        // Verificar si la respuesta contiene el id_usuario
        if (response.data.usuario && response.data.usuario.id) {
          setUsuarioId(response.data.usuario.id); // Guardar el id_usuario en el estado
          localStorage.setItem('usuario_id', response.data.usuario.id); // Guardar el id_usuario en localStorage
        } else {
          console.error('El id_usuario no está disponible en la respuesta del backend.');
        }
      } else {
        setUsuarioRegistrado(false); // El usuario no está registrado

        // Mostrar mensaje con SweetAlert2 y redirigir al login
        Swal.fire({
          icon: 'warning',
          title: 'Usuario no registrado',
          text: 'El usuario no está registrado. Por favor, regístrate.',
          confirmButtonText: 'Entendido',
        }).then(() => {
          navigate('/login'); // Redirigir al login después de cerrar el mensaje
        });
      }
    } catch (error) {
      console.error('Error al verificar el usuario:', error);
      setUsuarioRegistrado(false); // Error al verificar el usuario

      // Mostrar mensaje con SweetAlert2 y redirigir al login
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al verificar tu cuenta. Por favor, intenta nuevamente.',
        confirmButtonText: 'Entendido',
      }).then(() => {
        navigate('/login'); // Redirigir al login después de cerrar el mensaje
      });
    }
  };

  useEffect(() => {
    verificarUsuarioRegistrado();
  }, []);

  const getDiasDisponibles = async () => {
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

      let diasDisponiblesAjustados;
      if (dentroDelHorario) {
        diasDisponiblesAjustados = diasConHorario.slice(diaActual - 1).concat(diasConHorario.slice(0, diaActual - 1));
      } else {
        diasDisponiblesAjustados = diasConHorario.slice(diaActual).concat(diasConHorario.slice(0, diaActual));
      }

      const diasConFechas = diasDisponiblesAjustados.map((dia, index) => {
        const fecha = addDays(hoy, index); 
        const nombreDia = format(fecha, 'EEEE', { locale: es }).toLowerCase(); // Genera el nombre del día a partir de la fecha
        return {
          nombre: nombreDia, // Usa el nombre del día generado
          fecha: fecha, 
          fechaFormateada: format(fecha, "EEEE, d 'de' MMMM", { locale: es }), 
          hora_inicio: dia.hora_inicio,
          hora_fin: dia.hora_fin,
        };
      });

      setDiasDisponibles(diasConFechas);
    } catch (error) {
      console.error('Error al obtener los días disponibles:', error);
    }
  };

  useEffect(() => {
    if (usuarioRegistrado) {
      getDiasDisponibles();
    }
  }, [usuarioRegistrado]);

  const handleSelectDay = async (dia) => {
    setSelectedDay(dia);

    try {
      const response = await axios.get(`https://backendcentro.onrender.com/api/citasC/franjas/${dia}`);
      setHorarios(response.data);
    } catch (error) {
      console.error('Error al obtener las franjas horarias:', error);
    }
  };

  const handleSelectTime = (time, disponible) => {
    if (disponible) {
      setSelectedTime(time);
    }
  };

  const generarPDF = async () => {
    const doc = new jsPDF();
    const usuario = localStorage.getItem('usuario');
    const usuarioId = localStorage.getItem('usuario_id');
  
    if (!usuarioId) {
      console.error('El id_usuario no está disponible en localStorage.');
      return;
    }
  
    // Obtener la fecha seleccionada
    const diaSeleccionado = diasDisponibles.find(dia => dia.nombre === selectedDay);
    const fechaCita = format(diaSeleccionado.fecha, 'EEEE, d \'de\' MMMM', { locale: es });
  
    // Agregar el logo en la parte superior
    doc.addImage(logo, 'PNG', 80, 10, 50, 50); // Centrar el logo en la parte superior
  
    // Encabezado: Nombre del centro
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 128, 0); // Verde
    doc.text("Centro de Rehabilitación Integral San Juan", 10, 75);
  
    // Línea decorativa debajo del encabezado
    doc.setDrawColor(0, 128, 0); // Verde
    doc.setLineWidth(0.5);
    doc.line(10, 80, 200, 80);
  
    // Título del comprobante
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0); // Negro
    doc.text("Comprobante de Cita", 70, 90);
  
    // Función para convertir un icono a imagen
    const convertirIconoAImagen = async (icono, color) => {
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.left = '-9999px';
      document.body.appendChild(div);
  
      // Renderizar el icono en el div
      ReactDOM.render(<Icono icono={icono} color={color} />, div);
  
      // Convertir el div a imagen usando html2canvas
      const canvas = await html2canvas(div);
      document.body.removeChild(div);
  
      return canvas.toDataURL('image/png');
    };
  
    // Convertir y agregar los iconos al PDF
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
  
    // Línea decorativa
    doc.setDrawColor(0, 128, 0); // Verde
    doc.setLineWidth(0.5);
    doc.line(10, 160, 200, 160);
  
    // Sección "Importante"
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 0, 0); // Rojo
    doc.text("Importante", 10, 170);
  
    const iconoUbicacionImg = await convertirIconoAImagen(FaMapMarkerAlt, 'red');
    doc.addImage(iconoUbicacionImg, 'PNG', 10, 180, 10, 10);
    doc.setTextColor(0, 0, 0); // Negro
    doc.text('Calle Clavel, Col. Valle del Encinal, Huejutla, Mexico', 25, 188);
  
    const iconoTelefonoImg = await convertirIconoAImagen(FaPhone, 'teal');
    doc.addImage(iconoTelefonoImg, 'PNG', 10, 195, 10, 10);
    doc.text('Teléfono: (+51) 771 162 8377', 25, 203);
  
    // Icono de correo
    const iconoCorreoImg = await convertirIconoAImagen(FaEnvelope, 'blue'); // Usar FaEnvelope para el correo
    doc.addImage(iconoCorreoImg, 'PNG', 10, 210, 10, 10);
    doc.text('Correo: Ltfmariela@hotmail.com', 25, 218);
  
    // Línea decorativa
    doc.setDrawColor(0, 128, 0); // Verde
    doc.setLineWidth(0.5);
    doc.line(10, 225, 200, 225);
  
    // Sección "Aviso"
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0); // Negro
    doc.text("Aviso:", 10, 235);
  
    // Texto del aviso
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text('- Por favor, preséntese 15 minutos antes de su cita.', 15, 245);
    doc.text('- En caso de cancelación, notificar con al menos 24 horas de anticipación.', 15, 255);
    doc.text('- No presentarse a la cita puede generar cargos adicionales.', 15, 265);
  
    // Generar y agregar el código QR al PDF
    const qrImage = await generarQRComoImagen(); // Generar el código QR
    doc.addImage(qrImage, 'PNG', 150, 100, 50, 50); // Ajusta la posición y el tamaño del QR
    doc.setFontSize(10);
    doc.text('Escanea este código QR para más información:', 150, 95);
  
    // Pie de página
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0); // Negro
    doc.text('Términos y condiciones aplican. Consulta más detalles en nuestra página web.', 10, 280);
  
    // Guardar el archivo PDF
    doc.save("comprobante_cita.pdf");
  };
    
  const handleSacarCita = async () => {
    // Verificar si el usuario está autenticado
    const usuario = localStorage.getItem('usuario');
    if (!usuario || !usuarioId) {
      Swal.fire({
        icon: 'warning',
        title: 'Acceso restringido',
        text: 'Necesitas iniciar sesión o registrarte para reservar una cita.',
        confirmButtonText: 'Entendido',
      }).then(() => {
        navigate('/login');
      });
      return;
    }

    // Verificar si el usuario existe en la base de datos
    try {
      const response = await axios.get(`https://backendcentro.onrender.com/api/login/verificar-usuario/${usuario}`);
      if (!response.data.existe) {
        Swal.fire({
          icon: 'warning',
          title: 'Usuario no registrado',
          text: 'El usuario no está registrado. Por favor, regístrate.',
          confirmButtonText: 'Entendido',
        }).then(() => {
          navigate('/login');
        });
        return;
      }

      // Si el usuario está autenticado y existe en la base de datos, proceder con la reserva
      if (selectedDay && selectedTime) {
        const franjaSeleccionada = horarios
          .flatMap(horario => horario.franjas)
          .find(franja => franja.hora_inicio === selectedTime);
  
        if (!franjaSeleccionada) {
          Swal.fire({
            icon: 'error', // Icono de error
            title: 'Error', // Título del mensaje
            text: 'No se encontró la franja horaria seleccionada.', // Mensaje de error
            confirmButtonText: 'Entendido', // Texto del botón
          });
          return; // Detener la ejecución si no se encuentra la franja horaria
        }
  
        const horaFin = franjaSeleccionada.hora_fin;
  
        // Obtener la fecha seleccionada
        const diaSeleccionado = diasDisponibles.find(dia => dia.nombre === selectedDay);
        const fechaCita = format(diaSeleccionado.fecha, 'yyyy-MM-dd'); // Formato YYYY-MM-DD
  
        // Enviar la solicitud de reserva al backend
        const reservaResponse = await axios.put('https://backendcentro.onrender.com/api/citasC/sacar-cita', {
          dia: selectedDay,
          horaInicio: selectedTime,
          horaFin: horaFin,
          usuario_id: usuarioId,
          fecha_cita: fechaCita, // Enviar la fecha seleccionada al backend
        });
  
        // Mostrar mensaje de éxito con SweetAlert2
        Swal.fire({
          icon: 'success', // Icono de éxito
          title: 'Cita reservada', // Título del mensaje
          text: reservaResponse.data.message, // Mensaje de éxito desde el backend
          confirmButtonText: 'Entendido', // Texto del botón
        }).then(() => {
          generarPDF(); // Generar el PDF después de reservar la cita
        });
      } else {
        // Mostrar mensaje si no se seleccionó un día o una hora
        Swal.fire({
          icon: 'warning', // Icono de advertencia
          title: 'Selección incompleta', // Título del mensaje
          text: 'Por favor selecciona un día y una hora para reservar la cita.', // Mensaje de advertencia
          confirmButtonText: 'Entendido', // Texto del botón
        });
      }
    } catch (error) {
      console.error('Error al reservar la cita:', error);
  
      // Mostrar mensaje de error con SweetAlert2
      Swal.fire({
        icon: 'error', // Icono de error
        title: 'Error al reservar la cita', // Título del mensaje
        text: 'Hubo un problema al reservar la cita. Por favor, intenta nuevamente.', // Mensaje de error
        confirmButtonText: 'Entendido', // Texto del botón
      });
    }
  };

  if (!usuarioRegistrado) {
    return null; // No renderizar nada si el usuario no está registrado
  }

  return (
    <div className="container">
      <h1 className="title">
        <FontAwesomeIcon icon={faCalendarAlt} /> Reserva tu cita
      </h1>

      <div className="section">
        <h3>
          <FontAwesomeIcon icon={faCalendarAlt} /> Días disponibles:
        </h3>
        <div className="days-grid">
          {diasDisponibles.map((dia, index) => (
            <div
              key={index}
              onClick={() => handleSelectDay(dia.nombre)}
              className={`day-box ${selectedDay === dia.nombre ? 'selected' : ''}`}
            >
              <div className="day-number">{format(dia.fecha, 'd')}</div>
              <div className="day-name">{format(dia.fecha, 'EEEE', { locale: es })}</div>
            </div>
          ))}
        </div>
      </div>

      {selectedDay && (
        <div className="section">
          <h3>
            <FontAwesomeIcon icon={faClock} /> Horarios disponibles para {selectedDay}:
          </h3>
          {horarios.length === 0 ? (
            <p>No hay horarios disponibles para este día.</p>
          ) : (
            <div className="times-container">
              {horarios.map((horario) => (
                <div key={horario.id_horario} className="time-group">
                  <h4>{`${horario.hora_inicio} - ${horario.hora_fin}`}</h4>
                  <div className="time-buttons">
                    {horario.franjas.map((franja) => (
                      <button
                        key={franja.id_franja}
                        onClick={() => handleSelectTime(franja.hora_inicio, franja.disponible)}
                        className={`time-button ${franja.disponible ? 'available' : 'unavailable'} ${selectedTime === franja.hora_inicio ? 'selected' : ''}`}
                        disabled={!franja.disponible}
                      >
                        {franja.hora_inicio} - {franja.hora_fin}
                        {franja.disponible ? (
                          <FontAwesomeIcon icon={faCheckCircle} className="icon" />
                        ) : (
                          <FontAwesomeIcon icon={faTimesCircle} className="icon" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="section">
        <button onClick={handleSacarCita} className="submit-button">
          <FontAwesomeIcon icon={faCalendarAlt} /> Sacar Cita
        </button>
      </div>

      <style jsx>{`
        .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 30px;
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(135deg, #f9f9f9, #e6f3ff);
          border-radius: 20px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
        .title {
          text-align: center;
          color: #333;
          font-size: 32px;
          margin-bottom: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .section {
          margin-bottom: 40px;
        }
        .section h3 {
          color: #444;
          font-size: 24px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .days-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 20px;
        }
        .day-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          border: 2px solid #e0e0e0;
          border-radius: 15px;
          cursor: pointer;
          background-color: #fff;
          transition: all 0.3s ease;
        }
        .day-box:hover {
          border-color: #28a745;
          transform: translateY(-5px);
          box-shadow: 0 6px 18px rgba(0, 123, 255, 0.2);
        }
        .day-box.selected {
          border-color: #28a745;
          background-color: #28a745;
          color: #fff;
        }
        .day-number {
          font-size: 28px;
          font-weight: bold;
        }
        .day-name {
          font-size: 16px;
          text-transform: capitalize;
        }
        .times-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }
        .time-group {
          flex: 1 1 100%;
          margin-bottom: 20px;
        }
        .time-group h4 {
          color: #666;
          font-size: 18px;
          margin-bottom: 15px;
        }
        .time-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .time-button {
          margin: 5px;
          padding: 12px 20px;
          border: 2px solid transparent;
          border-radius: 10px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .time-button.available {
          border-color: #28a745;
          color: #28a745;
          background-color: rgba(40, 167, 69, 0.1);
        }
        .time-button.available:hover {
          background-color: #28a745;
          color: #fff;
        }
        .time-button.unavailable {
          border-color: #dc3545;
          color: #dc3545;
          background-color: rgba(220, 53, 69, 0.1);
          cursor: not-allowed;
        }
        .time-button.selected {
          border-color: #28a745;
          background-color: #28a745;
          color: #fff;
        }
        .time-button .icon {
          font-size: 16px;
        }
        .submit-button {
          width: 20%;
          padding: 18px;
          background: linear-gradient(135deg,rgb(69, 214, 103),rgb(95, 194, 120));
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
           margin: 0 auto;
        }
        .submit-button:hover {
          background: linear-gradient(135deg, #28a745, #28a745);
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0, 123, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default CitasCliente;
