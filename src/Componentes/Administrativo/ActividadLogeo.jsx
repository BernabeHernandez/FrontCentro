import React, { useEffect, useState } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { message } from 'antd';

const ActividadLogeo = () => {
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);

        const response = await fetch(`https://backendcentro.onrender.com/api/activity-log?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error('Error al cargar los registros');
        }
        const data = await response.json();
        setActivityLogs(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityLogs();
  }, [startDate, endDate]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="activity-log">
      <style>{`
        .activity-log {
          padding: 20px;
          max-width: 800px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          gap: 20px; 
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
          align-items: center; 
          margin-bottom: 20px;
          padding: 10px;
          border: 1px solid #ddd; 
          border-radius: 8px; 
          background-color: #fff; 
        }

        .filter-container label {
          margin-right: 10px; 
          font-weight: bold;
          color: #333; 
        }

        .filter-container input {
          padding: 8px;
          border: 1px solid #ccc; 
          border-radius: 4px; 
          width: 150px; 
        }

        
        body.dark-mode .filter-container label {
          color: #f9f9f9; 
        }

        .table-container {
          max-height: 400px; 
          overflow-y: auto; 
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #fff; 
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
          background-color: #007bff; 
          color: white;
          font-weight: bold;
        }

        tr:hover {
          background-color: #f1f1f1; 
        }

        .status-success {
          background-color: #d4edda; 
          color: #155724; 
        }

        .status-failed {
          background-color: #f8d7da; 
          color: #721c24; 
        }

        .status-icon {
          margin-right: 8px; 
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
            font-size: 14px; 
          }
        }
      `}</style>
      
      <h2>Registro de Actividad de Logeos</h2>
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
            {activityLogs.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  <InfoCircleOutlined className="no-data-icon" />
                  No hay datos disponibles.
                </td>
              </tr>
            ) : (
              activityLogs.map((log) => (
                <tr key={log._id} className={log.status === 'success' ? 'status-success' : 'status-failed'}>
                  <td>{log.user}</td>
                  <td>
                    {log.status === 'success' ? (
                      <span className="status-icon">
                        <CheckCircleOutlined />
                        {log.status}
                      </span>
                    ) : (
                      <span className="status-icon">
                        <CloseCircleOutlined />
                        {log.status}
                      </span>
                    )}
                  </td>
                  <td>{log.reason}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActividadLogeo;
