import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Terminos = () => {
  const [terminos, setTerminos] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [fechaVigencia, setFechaVigencia] = useState('');
  const [secciones, setSecciones] = useState([{ titulo: '', contenido: '' }]);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState('');

  const apiUrl = 'http://localhost:5000/api/terminos';

  useEffect(() => {
    fetchTerminos();
  }, []);

  const fetchTerminos = async () => {
    try {
      const response = await axios.get(apiUrl);
      setTerminos(response.data);
    } catch (error) {
      console.error('Error al obtener términos:', error);
      MySwal.fire('Error', 'No se pudo obtener la lista de términos', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await updateTermino(currentId);
    } else {
      await createTermino();
    }
    resetForm();
    fetchTerminos();
  };

  const createTermino = async () => {
    try {
      await axios.post(apiUrl, { titulo, contenido, fechaVigencia, secciones });
      MySwal.fire('Éxito', 'Se insertó correctamente', 'success');
    } catch (error) {
      console.error('Error al crear término:', error);
      MySwal.fire('Error', 'No se pudo crear el término', 'error');
    }
  };

  const updateTermino = async (id) => {
    try {
      await axios.put(`${apiUrl}/${id}`, { titulo, contenido, fechaVigencia, secciones });
      MySwal.fire('Éxito', 'Actualizado correctamente', 'success');
    } catch (error) {
      console.error('Error al actualizar término:', error);
      MySwal.fire('Error', 'No se pudo actualizar el término', 'error');
    }
  };

  const deleteTermino = async (id) => {
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
        fetchTerminos();
      } catch (error) {
        console.error('Error al eliminar término:', error);
        MySwal.fire('Error', 'No se pudo eliminar el término', 'error');
      }
    }
  };

  const editTermino = (id, termino) => {
    setCurrentId(id);
    setTitulo(termino.titulo);
    setContenido(termino.contenido);
    setFechaVigencia(termino.fechaVigencia);
    setSecciones(termino.secciones || []);
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
      <h1 style={styles.title}>Gestión de Términos</h1>
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
            {editMode ? 'Actualizar Término' : 'Agregar Término'}
          </button>
          {editMode && (
            <button type="button" onClick={resetForm} style={styles.cancelButton}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h2 style={styles.subTitle}>Lista de Términos</h2>
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
            {terminos.map((termino) => (
              <tr key={termino._id} style={styles.tableRow}>
                <td style={styles.tableCell}>{termino.titulo}</td>
                <td style={styles.tableCell}>{termino.contenido}</td>
                <td style={styles.tableCell}>{new Date(termino.fechaVigencia).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => editTermino(termino._id, termino)} style={styles.editButton}>
                    Editar
                  </button>
                  <button onClick={() => deleteTermino(termino._id)} style={styles.deleteButton}>
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

// Estilos para el componente
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
    alignSelf: 'flex-start', // Alinear a la izquierda
  },
  removeButton: {
    padding: '5px 10px', // Botón pequeño
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  removeButtonContainer: {
    textAlign: 'center', // Centrar el contenedor del botón
    marginTop: '5px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  submitButton: {
    padding: '10px 15px',
    backgroundColor: '#4CAF50', // Color verde
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    flex: 1, // Asegura que el botón ocupe el mismo espacio
    marginRight: '10px', // Espacio entre botones
  },
  cancelButton: {
    padding: '10px 15px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    flex: 1, // Asegura que el botón ocupe el mismo espacio
  },
  tableContainer: {
    overflowX: 'auto', // Permitir desplazamiento en la tabla
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
    width: '25%', // Ancho fijo para la columna
  },
  tableRow: {
    borderBottom: '1px solid #ccc',
  },
  tableCell: {
    padding: '10px',
    verticalAlign: 'top',
    color: '#333', // Ajustado para modo oscuro
    maxWidth: '200px', // Ancho máximo para evitar el movimiento
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap', // Evitar salto de línea
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
      fontSize: '12px', // Cambiar el tamaño de fuente para dispositivos móviles
      display: 'block', // Cambiar a bloque para mejor visualización
    },
    input: {
      padding: '8px',
    },
    textarea: {
      padding: '8px',
    },
    buttonContainer: {
      flexDirection: 'column', // Cambiar a columna para botones en móviles
    },
    submitButton: {
      marginRight: '0', // Quitar margen a la derecha
      marginBottom: '10px', // Añadir margen inferior
    },
  },
};

export default Terminos;
