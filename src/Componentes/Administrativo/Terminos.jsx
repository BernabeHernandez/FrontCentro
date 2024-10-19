import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function Terminos() {
  const [terminos, setTerminos] = useState([]);
  const [termino, setTermino] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formVisible, setFormVisible] = useState(false); 

  useEffect(() => {
    fetchTerminos();
  }, []);

  const fetchTerminos = async () => {
    try {
      const response = await axios.get('https://back-rq8v.onrender.com/api/terminos');
      setTerminos(response.data);
    } catch (error) {
      console.error('Error al obtener términos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await updateTermino();
    } else {
      await createTermino();
    }
  };

  const createTermino = async () => {
    try {
      const response = await axios.post('https://back-rq8v.onrender.com/api/terminos', { termino });
      setTerminos([...terminos, response.data]);
      resetForm();
      MySwal.fire('Éxito', 'Término creado correctamente', 'success');
    } catch (error) {
      console.error('Error al crear término:', error);
      MySwal.fire('Error', 'No se pudo crear el término', 'error');
    }
  };

  const updateTermino = async () => {
    try {
      const response = await axios.put(`https://back-rq8v.onrender.com/api/terminos/${editId}`, { termino });
      setTerminos(terminos.map(t => (t.id === editId ? response.data : t)));
      resetForm();
      MySwal.fire('Éxito', 'Término actualizado correctamente', 'success');
    } catch (error) {
      console.error('Error al actualizar término:', error);
      MySwal.fire('Error', 'No se pudo actualizar el término', 'error');
    }
  };

  const deleteTermino = async (id) => {
    const confirm = await MySwal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`https://back-rq8v.onrender.com/api/terminos/${id}`);
        setTerminos(terminos.filter(t => t.id !== id));
        MySwal.fire('Éxito', 'Término eliminado correctamente', 'success');
      } catch (error) {
        console.error('Error al eliminar término:', error);
        MySwal.fire('Error', 'No se pudo eliminar el término', 'error');
      }
    }
  };

  const handleEdit = (termino) => {
    setTermino(termino.termino);
    setEditId(termino.id);
    setEditMode(true);
    setFormVisible(true); 
  };

  const resetForm = () => {
    setTermino('');
    setEditId(null);
    setEditMode(false);
    setFormVisible(false); 
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Términos y Condiciones</h1>

      <button onClick={() => setFormVisible(!formVisible)} style={styles.toggleFormButton}>
        {formVisible ? (
          <><i className="fas fa-eye-slash"></i> Ocultar Formulario</>
        ) : (
          <><i className="fas fa-plus"></i> Agregar Término</>
        )}
      </button>

      {formVisible && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <textarea
            placeholder="Escribe el término aquí..."
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
            required
            style={styles.textarea}
          />
          <div style={styles.buttonContainer}>
            <button type="submit" style={styles.submitButton}>
              {editMode ? (
                <><i className="fas fa-edit"></i> Actualizar</>
              ) : (
                <><i className="fas fa-plus-circle"></i> Crear</>
              )}
            </button>
            {editMode && (
              <button type="button" onClick={resetForm} style={styles.cancelButton}>
                <i className="fas fa-times"></i> Cancelar
              </button>
            )}
          </div>
        </form>
      )}

      {/* Contenedor de tabla con desplazamiento */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.tableHeaderCell}>Término</th>
              <th style={styles.tableHeaderCell}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {terminos.map(termino => (
              <tr key={termino.id} style={styles.tableRow}>
                <td style={styles.tableCell}>{termino.termino}</td>
                <td style={styles.tableCell}>
                  <div style={styles.actionButtonContainer}>
                    <button onClick={() => handleEdit(termino)} style={styles.editButton}>
                      <i className="fas fa-edit"></i> Editar
                    </button>
                    <button onClick={() => deleteTermino(termino.id)} style={styles.deleteButton}>
                      <i className="fas fa-trash-alt"></i> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        @media (max-width: 768px) {
          textarea {
            height: 80px;
          }

          table {
            font-size: 14px;
          }

          button {
            width: auto; // Cambiar a auto para el botón principal
            margin-bottom: 5px; // Espacio entre botones
          }

          .actionButtonContainer {
            flex-direction: column; /* Cambio a columna en móviles */
          }

          .editButton, .deleteButton {
            width: auto; /* Botones ocupan el ancho automático */
          }
        }

        @media (max-width: 480px) {
          h1 {
            font-size: 24px;
          }

          textarea {
            height: 60px;
          }

          button {
            font-size: 14px;
            padding: 5px 8px; // Reducir el tamaño del padding
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: 'auto',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5', 
    borderRadius: '10px', 
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
    marginBottom: '20px', 
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  toggleFormButton: {
    padding: '8px 12px', 
    backgroundColor: '#4caf50', 
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '20px',
    transition: 'background-color 0.3s',
  },
  form: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  textarea: {
    width: '100%',
    height: '100px',
    marginBottom: '10px',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #b2dfdb',
    resize: 'none',
    fontSize: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  submitButton: {
    padding: '8px 12px', 
    backgroundColor: '#4caf50', 
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    fontSize: '14px',
  },
  cancelButton: {
    padding: '8px 12px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    fontSize: '14px',
  },
  tableContainer: {
    maxHeight: '400px', 
    overflowY: 'auto', 
    marginTop: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', 
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
    backgroundColor: '#fff',
  },
  tableHeader: {
    backgroundColor: '#4caf50', 
    color: 'white',
  },
  tableHeaderCell: {
    padding: '10px',
    textAlign: 'left',
    borderBottom: '2px solid #4caf50', 
  },
  tableRow: {
    backgroundColor: '#c8e6c9', 
    '&:hover': {
      backgroundColor: '#c8e6c9', 
    },
  },
  tableCell: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
    textAlign: 'left',
    color: '#333', 
  },
  actionButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  editButton: {
    padding: '5px 10px',
    backgroundColor: '#ffa726',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#e53935',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Terminos;
