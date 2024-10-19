import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaEdit, FaTrash } from 'react-icons/fa'; 

const MySwal = withReactContent(Swal);

function Deslinde() {
  const [deslindes, setDeslindes] = useState([]);
  const [deslinde, setDeslindeInput] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formVisible, setFormVisible] = useState(false); 

  useEffect(() => {
    fetchDeslindes();
  }, []);

  const fetchDeslindes = async () => {
    try {
      const response = await axios.get('https://back-rq8v.onrender.com/api/deslinde');
      setDeslindes(response.data);
    } catch (error) {
      console.error('Error al obtener deslindes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await updateDeslinde();
    } else {
      await createDeslinde();
    }
  };

  const createDeslinde = async () => {
    try {
      const response = await axios.post('https://back-rq8v.onrender.com/api/deslinde', { deslinde });
      setDeslindes([...deslindes, response.data]);
      resetForm();
      MySwal.fire('Éxito', 'Deslinde creado correctamente', 'success');
    } catch (error) {
      console.error('Error al crear deslinde:', error);
      MySwal.fire('Error', 'No se pudo crear el deslinde', 'error');
    }
  };

  const updateDeslinde = async () => {
    try {
      const response = await axios.put(`https://back-rq8v.onrender.com/api/deslinde/${editId}`, { deslinde });
      setDeslindes(deslindes.map(d => (d.id === editId ? response.data : d)));
      resetForm();
      MySwal.fire('Éxito', 'Deslinde actualizado correctamente', 'success');
    } catch (error) {
      console.error('Error al actualizar deslinde:', error);
      MySwal.fire('Error', 'No se pudo actualizar el deslinde', 'error');
    }
  };

  const deleteDeslinde = async (id) => {
    const confirm = await MySwal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4caf50', 
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`https://back-rq8v.onrender.com/api/deslinde/${id}`);
        setDeslindes(deslindes.filter(d => d.id !== id));
        MySwal.fire('Éxito', 'Deslinde eliminado correctamente', 'success');
      } catch (error) {
        console.error('Error al eliminar deslinde:', error);
        MySwal.fire('Error', 'No se pudo eliminar el deslinde', 'error');
      }
    }
  };

  const handleEdit = (d) => {
    setDeslindeInput(d.deslinde);
    setEditId(d.id);
    setEditMode(true);
    setFormVisible(true); 
  };

  const resetForm = () => {
    setDeslindeInput('');
    setEditId(null);
    setEditMode(false);
    setFormVisible(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Deslindes</h1>

      <button onClick={() => setFormVisible(!formVisible)} style={styles.toggleFormButton}>
        {formVisible ? 'Ocultar Formulario' : 'Agregar Deslinde'}
      </button>

      {formVisible && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <textarea
            placeholder="Escribe el deslinde aquí..."
            value={deslinde}
            onChange={(e) => setDeslindeInput(e.target.value)}
            required
            style={styles.textarea}
          />
          <div style={styles.buttonContainer}>
            <button type="submit" style={styles.submitButton}>
              {editMode ? 'Actualizar Deslinde' : 'Crear Deslinde'}
            </button>
            {editMode && (
              <button type="button" onClick={resetForm} style={styles.cancelButton}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      )}

    
        <div style={styles.scrollContainer}> 
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableHeaderCell}>Deslinde</th>
                <th style={styles.tableHeaderCell}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {deslindes.map(d => (
                <tr key={d.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{d.deslinde}</td>
                  <td style={styles.tableCell}>
                    <div style={styles.actionButtonContainer}>
                      <button onClick={() => handleEdit(d)} style={styles.editButton}>
                        <FaEdit style={styles.icon} /> Editar
                      </button>
                      <button onClick={() => deleteDeslinde(d.id)} style={styles.deleteButton}>
                        <FaTrash style={styles.icon} /> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
       
      </div>

      <div style={styles.footerSpacer} /> 


      <style>{`
        @media (max-width: 768px) {
          textarea {
            height: 80px;
          }

          table {
            font-size: 14px;
          }

          button {
            width: 100%;
            margin-bottom: 10px;
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
    marginBottom: '40px', 
  },
  title: {
    textAlign: 'center',
    color: 'black', 
    margin: '0 0 20px 0', 
  },
  toggleFormButton: {
    padding: '10px 15px',
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
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center', 
    gap: '10px',
  },
  submitButton: {
    padding: '8px 15px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    fontSize: '14px',
  },
  cancelButton: {
    padding: '8px 15px',
    backgroundColor: '#e53935',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    fontSize: '14px',
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    padding: '10px', 
    marginBottom: '30px',
  },
  scrollContainer: {
    maxHeight: '300px', 
    overflowY: 'auto',
    maxHeight: '400px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  tableHeader: {
    backgroundColor: '#4caf50', 
    color: 'white',
  },
  tableHeaderCell: {
    padding: '10px',
    textAlign: 'left',
    borderBottom: '2px solid #388e3c',
  },
  tableRow: {
    backgroundColor: '#c8e6c9', 
    '&:hover': {
      backgroundColor: '#a5d6a7',
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
    display: 'flex', 
    alignItems: 'center',
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#e53935', 
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex', 
    alignItems: 'center',
  },
  icon: {
    marginRight: '5px', 
  },
  footerSpacer: {
    marginTop: '10px', 
  },
  footer: {
    textAlign: 'center',
    marginTop: '40px',
    padding: '50px',
    backgroundColor: '#f1f1f1',
  },
  footerText: {
    color: '#555',
  },
};

export default Deslinde;
