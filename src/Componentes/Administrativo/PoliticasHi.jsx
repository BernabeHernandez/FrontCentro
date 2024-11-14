import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PoliticasHi = () => {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const obtenerHistorial = async () => {
      try {
        const respuesta = await axios.get('https://backendcentro.onrender.com/api/historialpoliticas');
        const datos = respuesta.data;

        const datosOrdenados = datos.sort((a, b) => {
          return parseFloat(b.version) - parseFloat(a.version); 
        });

        const datosActualizados = datosOrdenados.map((politica, indice) => {
          let estado = "No Vigente"; 
          if (politica.Estado === "eliminado") {
            estado = "Eliminado";  
          } else if (indice === 0) {
            estado = "Vigente";
          }
          return {
            ...politica,
            estado: estado,
          };
        });

        setHistorial(datosActualizados);
      } catch (error) {
        console.error('Error al obtener el historial de políticas:', error);
      }
    };

    obtenerHistorial();
  }, []);

  const manejarMostrar = async (id) => {
    try {
      await axios.patch(`https://backendcentro.onrender.com/api/historialpoliticas/${id}`, { Estado: "activo" });
      setHistorial((prevHistorial) => 
        prevHistorial.map((politica) => 
          politica._id === id ? { ...politica, estado: "No vigente" } : politica
        )
      );
    } catch (error) {
      console.error('Error al actualizar el estado de la política:', error);
    }
  };

  return (
    <div style={estilos.contenedor}>
      <h1 style={estilos.titulo}>Historial de Políticas</h1>

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
              {historial.map((politica, indice) => (
                <tr
                  key={politica._id}
                  style={{
                    ...estilos.filaTabla,
                    backgroundColor: indice % 2 === 0 ? '#f9fafb' : '#ffffff',
                  }}
                >
                  <td style={estilos.celdaTabla}>{politica.titulo}</td>
                  <td style={estilos.celdaTabla}>{politica.fechaVigencia}</td>
                  <td style={estilos.celdaTabla}>{new Date(politica.fechaCreacion).toISOString().split('T')[0]}</td>
                  <td style={estilos.celdaTabla}>{politica.version}</td>
                  <td style={estilos.celdaTabla}>
                    <span style={politica.estado === 'Vigente' ? estilos.vigente : politica.estado === 'No Vigente' ? estilos.noVigente : estilos.eliminado}>
                      {politica.estado}
                    </span>
                  </td>
                  <td style={estilos.celdaTabla}>{politica.contenido}</td>
                  <td style={estilos.celdaTabla}>
                    {politica.secciones && politica.secciones.length > 0 ? (
                      <ul style={estilos.listaSecciones}>
                        {politica.secciones.map((seccion, index) => (
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
                    {politica.estado === 'Eliminado' && (
                      <button 
                        style={estilos.botonMostrar} 
                        onClick={() => manejarMostrar(politica._id)}
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
        <p>No hay políticas en el historial</p>
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
    cursor: 'pointer',
    borderRadius: '5px',
    fontWeight: 'bold',
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

export default PoliticasHi;
