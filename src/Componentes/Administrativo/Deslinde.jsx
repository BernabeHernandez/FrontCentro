import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Deslinde = () => {
  const [deslindes, setDeslindes] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [fecha, setFecha] = useState('');
  const [subtitulos, setSubtitulos] = useState([{ titulo: '', contenido: '' }]);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState('');

  const apiUrl = 'https://back-rq8v.onrender.com/api/deslinde';

  useEffect(() => {
    fetchDeslindes();
  }, []);

  const fetchDeslindes = async () => {
    try {
      const response = await axios.get(apiUrl);
      setDeslindes(response.data);
    } catch (error) {
      console.error('Error al obtener deslindes:', error);
      MySwal.fire('Error', 'No se pudo obtener la lista de deslindes', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await updateDeslinde(currentId);
    } else {
      await createDeslinde();
    }
    resetForm();
    fetchDeslindes();
  };

  const createDeslinde = async () => {
    try {
      await axios.post(apiUrl, { titulo, contenido, fecha, subtitulos });
      MySwal.fire('Éxito', 'Se insertó correctamente', 'success');
    } catch (error) {
      console.error('Error al crear deslinde:', error);
      MySwal.fire('Error', 'No se pudo crear el deslinde', 'error');
    }
  };

  const updateDeslinde = async (id) => {
    try {
      await axios.put(`${apiUrl}/${id}`, { titulo, contenido, fecha, subtitulos });
      MySwal.fire('Éxito', 'Actualizado correctamente', 'success');
    } catch (error) {
      console.error('Error al actualizar deslinde:', error);
      MySwal.fire('Error', 'No se pudo actualizar el deslinde', 'error');
    }
  };

  const deleteDeslinde = async (id) => {
    const confirm = await MySwal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${apiUrl}/${id}`);
        MySwal.fire('Eliminado', 'Eliminado correctamente', 'success');
        fetchDeslindes();
      } catch (error) {
        console.error('Error al eliminar deslinde:', error);
        MySwal.fire('Error', 'No se pudo eliminar el deslinde', 'error');
      }
    }
  };

  const editDeslinde = (id, deslinde) => {
    setCurrentId(id);
    setTitulo(deslinde.titulo);
    setContenido(deslinde.contenido);
    setFecha(deslinde.fecha);
    setSubtitulos(deslinde.subtitulos || []);
    setEditMode(true);
  };

  const resetForm = () => {
    setTitulo('');
    setContenido('');
    setFecha('');
    setSubtitulos([{ titulo: '', contenido: '' }]);
    setEditMode(false);
    setCurrentId('');
  };

  const handleAddSubtitle = () => {
    setSubtitulos([...subtitulos, { titulo: '', contenido: '' }]);
  };

  const handleRemoveSubtitle = (index) => {
    const newSubtitles = subtitulos.filter((_, i) => i !== index);
    setSubtitulos(newSubtitles);
  };

  const handleSubtitleChange = (index, field, value) => {
    const newSubtitles = [...subtitulos];
    newSubtitles[index][field] = value;
    setSubtitulos(newSubtitles);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Gestión de Deslindes</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ingrese título"
          required
          style={styles.input}
        />
        <textarea
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          placeholder="Ingrese contenido"
          required
          style={styles.textarea}
        />
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
          style={styles.input}
        />
        
        {subtitulos.map((subtitle, index) => (
          <div key={index} style={styles.subtitle}>
            <div style={styles.subtitleInputContainer}>
              <input
                type="text"
                value={subtitle.titulo}
                onChange={(e) => handleSubtitleChange(index, 'titulo', e.target.value)}
                placeholder="Ingrese subtítulo"
                required
                style={styles.input}
              />
              <textarea
                value={subtitle.contenido}
                onChange={(e) => handleSubtitleChange(index, 'contenido', e.target.value)}
                placeholder="Ingrese contenido del subtítulo"
                required
                style={styles.textarea}
              />
            </div>
            <div style={styles.removeButtonContainer}>
              <button 
                type="button" 
                onClick={() => handleRemoveSubtitle(index)} 
                style={styles.removeButton}>
                Eliminar Subtítulo
              </button>
            </div>
          </div>
        ))}
        
        <button type="button" onClick={handleAddSubtitle} style={styles.addButton}>
          Agregar Subtítulo
        </button>

        <div style={styles.buttonContainer}>
          <button type="submit" style={styles.submitButton}>
            {editMode ? 'Actualizar' : 'Crear'}
          </button>
          {editMode && (
            <button type="button" onClick={resetForm} style={styles.cancelButton}>
              Cancelar
            </button>
          )}
        </div>
      </form>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.tableHeaderCell}>Título</th>
              <th style={styles.tableHeaderCell}>Contenido</th>
              <th style={styles.tableHeaderCell}>Fecha</th>
              <th style={styles.tableHeaderCell}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {deslindes.map((item) => (
              <tr key={item._id} style={styles.tableRow}>
                <td style={styles.tableCell}>{item.titulo}</td>
                <td style={styles.tableCell}>{item.contenido}</td>
                <td style={styles.tableCell}>{new Date(item.fecha).toLocaleDateString()}</td>
                <td style={styles.tableCell}>
                  <button onClick={() => editDeslinde(item._id, item)} style={styles.editButton}>
                    Editar
                  </button>
                  <button onClick={() => deleteDeslinde(item._id)} style={styles.deleteButton}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: 'auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  textarea: {
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  subtitle: {
    marginBottom: '15px',
  },
  subtitleInputContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  addButton: {
    padding: '10px 15px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '10px',
    alignSelf: 'flex-start', 
  },
  removeButton: {
    padding: '5px 10px', 
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  removeButtonContainer: {
    textAlign: 'center', 
    marginTop: '5px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  submitButton: {
    padding: '10px 15px',
    backgroundColor: '#4CAF50', 
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    flex: 1, 
    marginRight: '10px', 
  },
  cancelButton: {
    padding: '10px 15px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    flex: 1, 
  },
  tableContainer: {
    overflowX: 'auto', 
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  tableHeader: {
    backgroundColor: '#2196F3',
    color: 'white',
  },
  tableHeaderCell: {
    padding: '10px',
    textAlign: 'left',
    width: '25%', 
  },
  tableRow: {
    borderBottom: '1px solid #ccc',
  },
  tableCell: {
    padding: '10px',
    verticalAlign: 'top',
    color: '#333', 
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap', 
  },
  editButton: {
    padding: '5px 10px',
    backgroundColor: '#FFA500',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '5px',
  },
  '@media (max-width: 768px)': {
    tableCell: {
      fontSize: '12px', 
      display: 'block', 
    },
    input: {
      padding: '8px',
    },
    textarea: {
      padding: '8px',
    },
    buttonContainer: {
      flexDirection: 'column', 
    },
    submitButton: {
      marginRight: '0', 
      marginBottom: '10px',
    },
  },
};

export default Deslinde;
