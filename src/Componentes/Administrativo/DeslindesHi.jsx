import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DeslindesHi = () => {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const obtenerHistorial = async () => {
      try {
        const respuesta = await axios.get('https://backendcentro.onrender.com/api/historialdeslindes');
        const datos = respuesta.data;

        const datosOrdenados = datos.sort((a, b) => {
          return parseFloat(b.version) - parseFloat(a.version); 
        });

        const datosActualizados = datosOrdenados.map((deslinde, indice) => {
          let estado = "No Vigente"; 
          if (deslinde.Estado === "eliminado") {
            estado = "Eliminado";  
          } else if (indice === 0) {
            estado = "Vigente";
          }
          return {
            ...deslinde,
            estado: estado,
          };
        });

        setHistorial(datosActualizados);
      } catch (error) {
        console.error('Error al obtener el historial de deslindes:', error);
      }
    };

    obtenerHistorial();
  }, []);

  const manejarMostrar = async (id) => {
    try {
      await axios.patch(`https://backendcentro.onrender.com/api/historialdeslindes/${id}`, { Estado: "activo" });
      setHistorial((prevHistorial) => 
        prevHistorial.map((deslinde) => 
          deslinde._id === id ? { ...deslinde, estado: "No vigente" } : deslinde
        )
      );
    } catch (error) {
      console.error('Error al actualizar el estado del deslinde:', error);
    }
  };

  return (
    <div style={estilos.contenedor}>
      <h1 style={estilos.titulo}>Historial de Deslindes</h1>

      {historial.length > 0 ? (
        <div style={estilos.contenedorTabla}>
          <table style={estilos.tabla}>
            <thead>
              <tr style={estilos.filaEncabezado}>
                <th style={estilos.celdaEncabezado}>Título</th>
                <th style={estilos.celdaEncabezado}>Fecha de Vigencia</th>
                <th style={estilos.celdaEncabezado}>Fecha de Creación</th>
                <th style={estilos.celdaEncabezado}>Versión</th>
                <th style={estilos.celdaEncabezado}>Estado</th>
                <th style={estilos.celdaEncabezado}>Contenido</th>
                <th style={estilos.celdaEncabezado}>Secciones</th>
                <th style={estilos.celdaEncabezado}>Acciones</th> 
              </tr>
            </thead>
            <tbody>
              {historial.map((deslinde, indice) => (
                <tr
                  key={deslinde._id}
                  style={{
                    ...estilos.filaTabla,
                    backgroundColor: indice % 2 === 0 ? '#f9fafb' : '#ffffff',
                  }}
                >
                  <td style={estilos.celdaTabla}>{deslinde.titulo}</td>
                  <td style={estilos.celdaTabla}>{deslinde.fechaVigencia}</td>
                  <td style={estilos.celdaTabla}>{new Date(deslinde.fechaCreacion).toISOString().split('T')[0]}</td>
                  <td style={estilos.celdaTabla}>{deslinde.version}</td>
                  <td style={estilos.celdaTabla}>
                    <span style={deslinde.estado === 'Vigente' ? estilos.vigente : deslinde.estado === 'No Vigente' ? estilos.noVigente : estilos.eliminado}>
                      {deslinde.estado}
                    </span>
                  </td>
                  <td style={estilos.celdaTabla}>{deslinde.contenido}</td>
                  <td style={estilos.celdaTabla}>
                    {deslinde.secciones && deslinde.secciones.length > 0 ? (
                      <ul style={estilos.listaSecciones}>
                        {deslinde.secciones.map((seccion, index) => (
                          <li key={index}>
                            <strong>{seccion.titulo}:</strong> {seccion.contenido}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span>No hay secciones</span>
                    )}
                  </td>
                  <td style={estilos.celdaTabla}>
                    {deslinde.estado === 'Eliminado' && (
                      <button 
                        style={estilos.botonMostrar} 
                        onClick={() => manejarMostrar(deslinde._id)}
                      >
                        Mostrar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No hay deslindes en el historial</p>
      )}
    </div>
  );
};

const estilos = {
  contenedor: {
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f4f7fa',
    borderRadius: '8px',
  },
  titulo: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '20px',
    textAlign: 'center',
  },
  contenedorTabla: {
    overflowX: 'auto',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  tabla: {
    width: '100%',
    borderCollapse: 'collapse',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginTop: '10px',
  },
  filaEncabezado: {
    backgroundColor: '#34495e',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  celdaEncabezado: {
    padding: '12px',
    textAlign: 'left',
    fontSize: '16px',
  },
  filaTabla: {
    transition: 'background-color 0.3s ease',
  },
  celdaTabla: {
    padding: '12px',
    fontSize: '15px',
    color: '#2c3e50',
    borderBottom: '1px solid #ecf0f1',
  },
  listaSecciones: {
    margin: 0,
    paddingLeft: '20px',
  },
  vigente: {
    color: 'green',
    fontWeight: 'bold',
  },
  noVigente: {
    color: 'red',
    fontWeight: 'bold',
  },
  eliminado: {
    color: 'gray',
    fontWeight: 'bold',
  },
  botonMostrar: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  '@media (max-width: 1200px)': { 
    contenedor: {
      padding: '15px',
    },
    titulo: {
      fontSize: '24px',
    },
    tabla: {
      marginTop: '15px',
    },
  },
  '@media (max-width: 768px)': { 
    contenedor: {
      padding: '15px',
    },
    titulo: {
      fontSize: '22px',
    },
    tabla: {
      marginTop: '10px',
    },
    celdaEncabezado: {
      fontSize: '14px',
    },
    celdaTabla: {
      fontSize: '14px',
    },
  },
  '@media (max-width: 480px)': { 
    contenedor: {
      padding: '10px',
    },
    titulo: {
      fontSize: '20px',
    },
    tabla: {
      fontSize: '14px',
      marginTop: '5px',
    },
    celdaEncabezado: {
      fontSize: '12px',
    },
    celdaTabla: {
      fontSize: '13px',
    },
    listaSecciones: {
      paddingLeft: '10px',
    },
  },
};

export default DeslindesHi;
