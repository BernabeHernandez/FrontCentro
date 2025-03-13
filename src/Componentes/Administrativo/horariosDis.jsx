import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, addDays, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const HorariosDis = () => {
  const [diasDisponibles, setDiasDisponibles] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [citasDelDia, setCitasDelDia] = useState([]);

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
  
      console.log("Días disponibles ajustados:", diasDisponiblesAjustados); // Verifica los días ajustados
  
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
    getDiasDisponibles();
  }, []);

  const handleSelectDay = async (dia, fecha) => {
    console.log("Día seleccionado en frontend:", dia); // Verifica el día
    console.log("Fecha seleccionada en frontend:", fecha); // Verifica la fecha
  
    setSelectedDay(dia);
  
    try {
      const response = await axios.get(`https://backendcentro.onrender.com/api/citasC/franjas/${dia}`);
      console.log("Franjas horarias recibidas:", response.data); // Verifica la respuesta del backend
      setHorarios(response.data);
  
      const fechaFormateada = format(fecha, 'yyyy-MM-dd');
      const citasResponse = await axios.get(`https://backendcentro.onrender.com/api/citasC/citas-del-dia/${fechaFormateada}`);
      console.log("Citas del día:", citasResponse.data); // Verifica las citas recibidas
      setCitasDelDia(citasResponse.data);
    } catch (error) {
      console.error('Error al obtener las franjas horarias:', error);
      setHorarios([]);
      setCitasDelDia([]);
    }
  };


  return (
    <div className="container">
      <h1 className="title">
        <FontAwesomeIcon icon={faCalendarAlt} /> Horarios Disponibles
      </h1>

      <div className="section">
        <h3>
          <FontAwesomeIcon icon={faCalendarAlt} /> Días disponibles:
        </h3>
        <div className="days-grid">
          {diasDisponibles.map((dia, index) => (
            <div
              key={index}
              onClick={() => handleSelectDay(dia.nombre, dia.fecha)}
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
                        className={`time-button ${franja.disponible ? 'available' : 'unavailable'}`}
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

      {citasDelDia.length > 0 && (
        <div className="citas-section">
          <h3>
            <FontAwesomeIcon icon={faCalendarAlt} /> Citas para {selectedDay}:
          </h3>
          <div className="table-container">
            <table className="citas-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido Paterno</th>
                  <th>Apellido Materno</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Fecha de la Cita</th>
                  <th>Hora Inicio</th>
                  <th>Hora Fin</th>
                </tr>
              </thead>
              <tbody>
                {citasDelDia.map((cita) => {
                  const fechaCitaFormateada = cita.fecha_cita
                    ? format(parseISO(cita.fecha_cita), "dd/MM/yyyy")
                    : "Fecha no disponible";

                  return (
                    <tr key={cita.id}>
                      <td>{cita.nombre}</td>
                      <td>{cita.apellidopa}</td>
                      <td>{cita.apellidoma}</td>
                      <td>{cita.gmail}</td>
                      <td>{cita.telefono}</td>
                      <td>{fechaCitaFormateada}</td>
                      <td>{cita.hora_inicio}</td>
                      <td>{cita.hora_fin}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style jsx>{`
        .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(135deg, #f9f9f9, #e6f3ff);
          border-radius: 20px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
        .title {
          text-align: center;
          color: #333;
          font-size: 28px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section h3 {
          color: #444;
          font-size: 22px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .days-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 15px;
        }
        .day-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 15px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
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
          font-size: 24px;
          font-weight: bold;
        }
        .day-name {
          font-size: 14px;
          text-transform: capitalize;
        }
        .times-container {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
        }
        .time-group {
          flex: 1 1 100%;
          margin-bottom: 15px;
        }
        .time-group h4 {
          color: #666;
          font-size: 16px;
          margin-bottom: 10px;
        }
        .time-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .time-button {
          margin: 4px;
          padding: 10px 16px;
          border: 2px solid transparent;
          border-radius: 8px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
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
        .time-button .icon {
          font-size: 14px;
        }
        .citas-section {
          margin-top: 30px;
          padding: 15px;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .table-container {
          overflow-x: auto; /* Permitir desplazamiento horizontal en pantallas pequeñas */
        }
        .citas-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 600px; /* Ancho mínimo para la tabla */
        }
        .citas-table th, .citas-table td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        .citas-table th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        .citas-table tr:hover {
          background-color: #f9f9f9;
        }

        /* Estilos responsivos */
        @media (max-width: 768px) {
          .title {
            font-size: 24px;
          }
          .section h3 {
            font-size: 20px;
          }
          .day-box {
            padding: 10px;
          }
          .day-number {
            font-size: 20px;
          }
          .day-name {
            font-size: 12px;
          }
          .time-button {
            padding: 8px 12px;
            font-size: 10px;
          }
          .citas-table th, .citas-table td {
            padding: 8px;
          }
        }

        @media (max-width: 480px) {
          .title {
            font-size: 20px;
          }
          .section h3 {
            font-size: 18px;
          }
          .days-grid {
            grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
          }
          .day-box {
            padding: 8px;
          }
          .day-number {
            font-size: 18px;
          }
          .day-name {
            font-size: 10px;
          }
          .time-button {
            padding: 6px 10px;
            font-size: 8px;
          }
          .citas-table th, .citas-table td {
            padding: 6px;
          }
        }
      `}</style>
    </div>
  );
};

export default HorariosDis;