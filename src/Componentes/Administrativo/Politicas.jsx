import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Politicas = () => {
  const [politicas, setPoliticas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [fechaVigencia, setFechaVigencia] = useState('');
  const [secciones, setSecciones] = useState([{ titulo: '', contenido: '' }]);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState('');

  const apiUrl = 'https://back-rq8v.onrender.com/api/politicas';

  useEffect(() => {
    fetchPoliticas();
  }, []);

  const fetchPoliticas = async () => {
    try {
      const response = await axios.get(apiUrl);
      setPoliticas(response.data);
    } catch (error) {
      console.error('Error al obtener políticas:', error);
      MySwal.fire('Error', 'No se pudo obtener la lista de políticas', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await updatePolitica(currentId);
    } else {
      await createPolitica();
    }
    resetForm();
    fetchPoliticas();
  };

  const createPolitica = async () => {
    try {
      await axios.post(apiUrl, { titulo, contenido, fechaVigencia, secciones });
      MySwal.fire('Éxito', 'Se insertó correctamente', 'success');
    } catch (error) {
      console.error('Error al crear política:', error);
      MySwal.fire('Error', 'No se pudo crear la política', 'error');
    }
  };

  const updatePolitica = async (id) => {
    try {
      await axios.put(`${apiUrl}/${id}`, { titulo, contenido, fechaVigencia, secciones });
      MySwal.fire('Éxito', 'Actualizado correctamente', 'success');
    } catch (error) {
      console.error('Error al actualizar política:', error);
      MySwal.fire('Error', 'No se pudo actualizar la política', 'error');
    }
  };

  const deletePolitica = async (id) => {
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
        fetchPoliticas();
      } catch (error) {
        console.error('Error al eliminar política:', error);
        MySwal.fire('Error', 'No se pudo eliminar la política', 'error');
      }
    }
  };

  const editPolitica = (id, politica) => {
    setCurrentId(id);
    setTitulo(politica.titulo);
    setContenido(politica.contenido);
    setFechaVigencia(politica.fechaVigencia);
    setSecciones(politica.secciones || []);
    setEditMode(true);
  };

  const resetForm = () => {
    setTitulo('');
    setContenido('');
    setFechaVigencia('');
    setSecciones([{ titulo: '', contenido: '' }]);
    setEditMode(false);
    setCurrentId('');
  };

  const handleAddSection = () => {
    setSecciones([...secciones, { titulo: '', contenido: '' }]);
  };

  const handleRemoveSection = (index) => {
    const newSections = secciones.filter((_, i) => i !== index);
    setSecciones(newSections);
  };

  const handleSectionChange = (index, field, value) => {
    const newSections = [...secciones];
    newSections[index][field] = value;
    setSecciones(newSections);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Gestión de Políticas</h1>
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
          value={fechaVigencia}
          onChange={(e) => setFechaVigencia(e.target.value)}
          required
          style={styles.input}
        />
        
        {secciones.map((section, index) => (
          <div key={index} style={styles.section}>
            <div style={styles.sectionInputContainer}>
              <input
                type="text"
                value={section.titulo}
                onChange={(e) => handleSectionChange(index, 'titulo', e.target.value)}
                placeholder="Ingrese subtítulo"
                required
                style={styles.input}
              />
              <textarea
                value={section.contenido}
                onChange={(e) => handleSectionChange(index, 'contenido', e.target.value)}
                placeholder="Ingrese contenido del subtítulo"
                required
                style={styles.textarea}
              />
            </div>
            <div style={styles.removeButtonContainer}>
              <button 
                type="button" 
                onClick={() => handleRemoveSection(index)} 
                style={styles.removeButton}>
                Eliminar Sección
              </button>
            </div>
          </div>
        ))}
        
        <button type="button" onClick={handleAddSection} style={styles.addButton}>
          Agregar Sección
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
              <th style={styles.tableHeaderCell}>Fecha de Vigencia</th>
              <th style={styles.tableHeaderCell}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {politicas.map((item) => (
              <tr key={item._id} style={styles.tableRow}>
                <td style={styles.tableCell}>{item.titulo}</td>
                <td style={styles.tableCell}>{item.contenido}</td>
                <td style={styles.tableCell}>{item.fechaVigencia}</td>
                <td style={styles.tableCell}>
                  <button onClick={() => editPolitica(item._id, item)} style={styles.editButton}>
                    Editar
                  </button>
                  <button onClick={() => deletePolitica(item._id)} style={styles.deleteButton}>
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
  section: {
    marginBottom: '15px',
  },
  sectionInputContainer: {
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

export default Politicas;
