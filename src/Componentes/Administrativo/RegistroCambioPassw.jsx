import React, { useEffect, useState } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { message } from 'antd';

const RegistroCambioPassw = () => {
  const [changeLogs, setChangeLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchChangeLogs = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);

        const response = await fetch(`https://back-rq8v.onrender.com/api/registro-password?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error('Error al cargar los registros');
        }
        const data = await response.json();
        setChangeLogs(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchChangeLogs();
  }, [startDate, endDate]);


  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="change-log">
      <style>{`
        .change-log {
          padding: 20px;
          max-width: 800px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          gap: 20px; /* Espacio entre el contenido */
          margin: auto auto 40px;
        }

        h2 {
          text-align: center;
          color: #333;
          margin-bottom: 20px;
        }

        .filter-container {
          display: flex;
          justify-content: space-between;
          align-items: center; /* Alinear verticalmente */
          margin-bottom: 20px;
          padding: 10px;
          border: 1px solid #ddd; /* Bordes para resaltar la sección */
          border-radius: 8px; /* Bordes redondeados */
          background-color: #fff; /* Fondo blanco para el filtro */
        }

        .filter-container label {
          margin-right: 10px; /* Espacio entre la etiqueta y el campo de fecha */
          font-weight: bold;
          color: #333; /* Color por defecto */
        }

        .filter-container input {
          padding: 8px;
          border: 1px solid #ccc; /* Bordes para los campos de entrada */
          border-radius: 4px; /* Bordes redondeados */
          width: 150px; /* Ancho fijo para los campos de fecha */
        }

        /* Estilos para modo oscuro */
        body.dark-mode .filter-container label {
          color: #f9f9f9; /* Color claro para modo oscuro */
        }

        .table-container {
          max-height: 400px; /* Altura máxima para el deslizador */
          overflow-y: auto; /* Permitir desplazamiento vertical */
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #fff; /* Fondo blanco para la tabla */
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        th {
          background-color: #007bff; /* Color de fondo para los encabezados */
          color: white;
          font-weight: bold;
        }

        tr:hover {
          background-color: #f1f1f1; /* Color de fondo en hover */
        }

        .status-success {
          background-color: #d4edda; /* Fondo verde claro para "success" */
          color: #155724; /* Color de texto verde oscuro */
        }

        .status-failed {
          background-color: #f8d7da; /* Fondo rojo claro para "failed" */
          color: #721c24; /* Color de texto rojo oscuro */
        }

        .status-icon {
          margin-right: 8px; /* Espacio entre el ícono y el texto */
        }

        .no-data {
          text-align: center;
          color: #888;
          margin-top: 20px;
        }

        .no-data-icon {
          font-size: 50px;
          color: #007bff;
        }

        @media (max-width: 600px) {
          table {
            font-size: 14px; /* Tamaño de fuente para dispositivos pequeños */
          }
        }
      `}</style>
      
      <h2>Registro de Cambio de Contraseña</h2>
      <div className="filter-container">
        <div>
          <label htmlFor="start-date">Inicio:</label>
          <input 
            type="date" 
            id="start-date"
            value={startDate} 
            onChange={(e) => {
              const selectedDate = e.target.value;
              setStartDate(selectedDate);
              if (endDate && new Date(selectedDate) > new Date(endDate)) {
                setEndDate('');
                message.warning('La fecha de inicio debe ser anterior a la fecha de fin.');
              }
            }} 
          />
        </div>
        <div>
          <label htmlFor="end-date">Fin:</label>
          <input 
            type="date" 
            id="end-date"
            value={endDate} 
            onChange={(e) => {
              const selectedDate = e.target.value;
              if (startDate && new Date(selectedDate) < new Date(startDate)) {
                message.warning('La fecha de fin debe ser posterior a la fecha de inicio.');
              } else {
                setEndDate(selectedDate);
              }
            }} 
          />
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Estado</th>
              <th>Acción</th>
              <th>Fecha y Hora</th>
            </tr>
          </thead>
          <tbody>
            {changeLogs.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  <InfoCircleOutlined className="no-data-icon" />
                  No hay datos disponibles.
                </td>
              </tr>
            ) : (
              changeLogs.map((log) => (
                <tr key={log._id} className={log.estado === 'Exitoso' ? 'status-success' : 'status-failed'}>
                  <td>{log.usuario}</td>
                  <td>
                    <span className="status-icon">
                      {log.estado === 'Exitoso' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                      {log.estado}
                    </span>
                  </td>
                  <td>{log.razon}</td>
                  <td>{new Date(log.fechaHora).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegistroCambioPassw;