import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaUser, FaEnvelope, FaPhone, FaAddressCard, FaUserAlt } from 'react-icons/fa';

const PerfilCliente = () => {
  const usuarioId = localStorage.getItem('usuario_id');
  const [perfil, setPerfil] = useState({
    nombre: '',
    apellidopa: '',
    apellidoma: '',
    gmail: '',
    user: '',
    telefono: ''
  });
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (!usuarioId) {
      console.error('No se encontró el ID del usuario en localStorage');
      setLoading(false);
      return;
    }

    axios.get(`https://backendcentro.onrender.com/api/perfilcliente/${usuarioId}`)
      .then(response => {
        setPerfil(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener el perfil:', error);
        setLoading(false);
      });
  }, [usuarioId]);

  const handleChange = (e) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!usuarioId) {
      setMensaje('No se encontró el ID del usuario');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres guardar los cambios realizados?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(`https://backendcentro.onrender.com/api/perfilcliente/${usuarioId}`, perfil)
          .then(response => {
            setEditable(false); // Deshabilitar la edición después de actualizar
            Swal.fire({
              title: '¡Éxito!',
              text: 'Los datos del perfil se actualizaron correctamente.',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
          })
          .catch(error => {
            console.error('Error al actualizar el perfil:', error);
            Swal.fire({
              title: 'Error',
              text: 'Hubo un error al actualizar el perfil. Por favor, inténtalo de nuevo.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          });
      }
    });
  };

  if (loading) return <p>Cargando perfil...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>{perfil.nombre}</h2>
      {mensaje && <p style={styles.mensaje}>{mensaje}</p>}
      <div style={styles.dataContainer}>
        {!editable ? (
          <div style={styles.info}>
            <div style={styles.field}>
              <FaUserAlt style={{ ...styles.icon, color: '#3498db' }} />
              <strong>Nombre:</strong> {perfil.nombre} {perfil.apellidopa} {perfil.apellidoma}
            </div>
            <div style={styles.field}>
              <FaEnvelope style={{ ...styles.icon, color: '#1abc9c' }} />
              <strong>Correo Electrónico:</strong> {perfil.gmail}
            </div>
            <div style={styles.field}>
              <FaAddressCard style={{ ...styles.icon, color: '#f39c12' }} />
              <strong>Usuario:</strong> {perfil.user}
            </div>
            <div style={styles.field}>
              <FaPhone style={{ ...styles.icon, color: '#e74c3c' }} />
              <strong>Teléfono:</strong> {perfil.telefono}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <FaUserAlt style={{ ...styles.icon, color: '#3498db' }} />
              <label>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={perfil.nombre}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <FaUser style={{ ...styles.icon, color: '#e67e22' }} />
              <label>Apellido Paterno:</label>
              <input
                type="text"
                name="apellidopa"
                value={perfil.apellidopa}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <FaUserAlt style={{ ...styles.icon, color: '#9b59b6' }} />
              <label>Apellido Materno:</label>
              <input
                type="text"
                name="apellidoma"
                value={perfil.apellidoma}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <FaEnvelope style={{ ...styles.icon, color: '#1abc9c' }} />
              <label>Correo Electrónico:</label>
              <input
                type="email"
                name="gmail"
                value={perfil.gmail}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <FaAddressCard style={{ ...styles.icon, color: '#f39c12' }} />
              <label>Usuario:</label>
              <input
                type="text"
                name="user"
                value={perfil.user}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <FaPhone style={{ ...styles.icon, color: '#e74c3c' }} />
              <label>Teléfono:</label>
              <input
                type="tel"
                name="telefono"
                value={perfil.telefono}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.updateButton}>Actualizar Perfil</button>
          </form>
        )}
      </div>
      <div style={styles.buttonsContainer}>
        {!editable ? (
          <button onClick={() => setEditable(true)} style={styles.editButton}>Editar</button>
        ) : (
          <button onClick={() => setEditable(false)} style={styles.cancelButton}>Cancelar</button>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    boxSizing: 'border-box',
  },
  header: {
    textAlign: 'center',
    fontSize: '2em',
    marginBottom: '20px',
    color: '#2c3e50',
  },
  dataContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
  },
  field: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
    fontSize: '1.1em',
    flexWrap: 'wrap',
  },
  icon: {
    marginRight: '10px',
    fontSize: '1.5em',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    fontSize: '1em',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    width: '30%',
    marginTop: '15px',
    fontSize: '1em',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block',
  },
  mensaje: {
    textAlign: 'center',
    color: 'green',
    fontSize: '1.1em',
    marginBottom: '15px',
  },
  editButton: {
    padding: '10px 20px',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    width: '30%',
    fontSize: '1.1em',
    marginTop: '15px',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    width: '30%',
    fontSize: '1.1em',
   
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block',
  },
  updateButton: {
    padding: '10px 20px',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    width: '30%',
    fontSize: '1.1em',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginTop: '20px',
  },
};

export default PerfilCliente;
