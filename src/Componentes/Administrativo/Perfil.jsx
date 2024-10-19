import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function Perfil() {
  const [perfiles, setPerfiles] = useState([]);
  const [mision, setMision] = useState('');
  const [vision, setVision] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    fetchPerfiles();
  }, []);

  const fetchPerfiles = async () => {
    try {
      const response = await axios.get('https://back-rq8v.onrender.com/api/perfil');
      setPerfiles(response.data);
    } catch (error) {
      console.error('Error al obtener perfiles:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await updatePerfil();
    } else {
      await createPerfil();
    }
  };

  const createPerfil = async () => {
    try {
      const response = await axios.post('https://back-rq8v.onrender.com/api/perfil', { mision, vision });
      setPerfiles([...perfiles, response.data]);
      resetForm();
      MySwal.fire('Éxito', 'Perfil creado correctamente', 'success');
    } catch (error) {
      console.error('Error al crear perfil:', error);
      MySwal.fire('Error', 'No se pudo crear el perfil', 'error');
    }
  };

  const updatePerfil = async () => {
    try {
      const response = await axios.put(`https://back-rq8v.onrender.com/api/perfil/${editId}`, { mision, vision });
      setPerfiles(perfiles.map(p => (p.id === editId ? response.data : p)));
      resetForm();
      MySwal.fire('Éxito', 'Perfil actualizado correctamente', 'success');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      MySwal.fire('Error', 'No se pudo actualizar el perfil', 'error');
    }
  };

  const deletePerfil = async (id) => {
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
        await axios.delete(`https://back-rq8v.onrender.com/api/perfil/${id}`);
        setPerfiles(perfiles.filter(p => p.id !== id));
        MySwal.fire('Éxito', 'Perfil eliminado correctamente', 'success');
      } catch (error) {
        console.error('Error al eliminar perfil:', error);
        MySwal.fire('Error', 'No se pudo eliminar el perfil', 'error');
      }
    }
  };

  const handleEdit = (perfil) => {
    setMision(perfil.mision);
    setVision(perfil.vision);
    setEditId(perfil.id);
    setEditMode(true);
    setFormVisible(true);
  };

  const resetForm = () => {
    setMision('');
    setVision('');
    setEditId(null);
    setEditMode(false);
    setFormVisible(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Perfil de la Empresa</h1>

      <button onClick={() => setFormVisible(!formVisible)} style={styles.toggleFormButton}>
        {formVisible ? 'Ocultar Formulario' : 'Agregar Perfil'}
      </button>

      {formVisible && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <textarea
            placeholder="Escribe la misión aquí..."
            value={mision}
            onChange={(e) => setMision(e.target.value)}
            required
            style={styles.textarea}
          />
          <textarea
            placeholder="Escribe la visión aquí..."
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            required
            style={styles.textarea}
          />
          <div style={styles.buttonContainer}>
            <button type="submit" style={styles.submitButton}>
              {editMode ? 'Actualizar Perfil' : 'Crear Perfil'}
            </button>
            {editMode && (
              <button type="button" onClick={resetForm} style={styles.cancelButton}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      )}

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.tableHeaderCell}>Misión</th>
              <th style={styles.tableHeaderCell}>Visión</th>
              <th style={styles.tableHeaderCell}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {perfiles.map(perfil => (
              <tr key={perfil.id} style={styles.tableRow}>
                <td style={styles.tableCell}>{perfil.mision}</td>
                <td style={styles.tableCell}>{perfil.vision}</td>
                <td style={styles.tableCell}>
                  <div style={styles.actionButtonContainer}>
                    <button onClick={() => handleEdit(perfil)} style={styles.editButton}>
                      <i className="fa fa-edit" aria-hidden="true"></i> Editar
                    </button>
                    <button onClick={() => deletePerfil(perfil.id)} style={styles.deleteButton}>
                      <i className="fa fa-trash" aria-hidden="true"></i> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Espacio entre la tabla y el pie de página */}
      <div style={styles.footerSpacer}></div>
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
    backgroundColor: '#f5f5f5', // Fondo suave
    borderRadius: '10px', // Esquinas redondeadas
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Sombra sutil
    marginBottom: '40px',
  },
  title: {
    textAlign: 'center',
    color: '#333',
  },
  toggleFormButton: {
    padding: '10px 15px',
    backgroundColor: '#4caf50', // Color verde
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
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  submitButton: {
    padding: '8px 15px',
    backgroundColor: '#4caf50', // Color verde
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    fontSize: '14px',
  },
  cancelButton: {
    padding: '8px 15px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    fontSize: '14px',
  },
  tableContainer: {
    maxHeight: '350px', 
    overflowY: 'auto', 
    marginTop: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', 
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#4caf50', // Color igual al de "Políticas"
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
      backgroundColor: '#f1f1f1',
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
    justifyContent: 'flex-start',
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
    gap: '5px',
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
    gap: '5px',
  },
  footerSpacer: {
    height: '20px', // Altura del espacio entre la tabla y el pie de página
  },
  footer: {
    textAlign: 'center',
    padding: '10px',
    backgroundColor: '#f1f1f1',
    borderRadius: '8px',
    marginTop: '20px',
    fontSize: '12px',
  },
  footerText: {
    color: '#666',
  },
};

export default Perfil;
