import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

const Perfil = () => {
    const [perfil, setPerfil] = useState({
        nombreEmpresa: '',
        eslogan: '',
        logo: null,
        direccion: '',
        correo: '',
        telefono: '',
        redesSociales: {
            facebook: '',
            twitter: '',
            linkedin: '',
            instagram: ''
        }
    });
    const [perfiles, setPerfiles] = useState([]);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const fetchPerfiles = async () => {
            try {
                const response = await axios.get('https://backendcentro.onrender.com/api/perfil');
                setPerfiles(response.data);
            } catch (error) {
                console.error('Error al obtener perfiles:', error.message);
            }
        };
        fetchPerfiles();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'telefono') {
            if (/^\d*$/.test(value) && value.length <= 10) {
                setPerfil({
                    ...perfil,
                    [name]: value,
                });
            }
        } else if (name === 'nombreEmpresa' || name === 'eslogan') {
            const regex = /^[a-zA-Z0-9 ]*$/;
            if (regex.test(value) && value.length <= 50) {
                setPerfil({
                    ...perfil,
                    [name]: value,
                });
            }
        } else {
            setPerfil({
                ...perfil,
                [name]: value,
            });
        }
    };

    const handleSocialChange = (e) => {
        const { name, value } = e.target;
        setPerfil({
            ...perfil,
            redesSociales: {
                ...perfil.redesSociales,
                [name]: value,
            }
        });
    };

    const handleLogoChange = (e) => {
        setPerfil({
            ...perfil,
            logo: e.target.files[0],
        });
    };

    const validateUrls = () => {
        const urlPattern = /^(https:\/\/www\.(facebook|twitter|linkedin|instagram)\.com)\/?/;
        const { facebook, twitter, linkedin, instagram } = perfil.redesSociales;
        let errorMessage = "";

        if (facebook && !urlPattern.test(facebook)) {
            errorMessage = "La URL de Facebook no es válida. Debe comenzar con https://www.facebook.com.";
        } else if (twitter && !urlPattern.test(twitter)) {
            errorMessage = "La URL de Twitter no es válida. Debe comenzar con https://twitter.com.";
        } else if (linkedin && !urlPattern.test(linkedin)) {
            errorMessage = "La URL de LinkedIn no es válida. Debe comenzar con https://www.linkedin.com.";
        } else if (instagram && !urlPattern.test(instagram)) {
            errorMessage = "La URL de Instagram no es válida. Debe comenzar con https://instagram.com.";
        }

        return errorMessage;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredFields = ['eslogan', 'direccion', 'correo', 'telefono'];
        const socialFields = ['facebook', 'twitter', 'linkedin', 'instagram'];

        const allFieldsFilled = requiredFields.every(field => perfil[field]);
        const allSocialFieldsFilled = socialFields.every(field => perfil.redesSociales[field]);
        const isPhoneValid = /^\d{10}$/.test(perfil.telefono);

        const errorMessage = validateUrls();

        if (!allFieldsFilled || !allSocialFieldsFilled || !isPhoneValid) {
            let message = "Por favor, llena todos los campos";
            if (!isPhoneValid) {
                message = "El teléfono debe tener exactamente 10 dígitos numéricos.";
            }
            MySwal.fire({
                title: 'Error!',
                text: message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        if (errorMessage) {
            MySwal.fire({
                title: 'Error!',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        const formData = new FormData();
        formData.append('nombreEmpresa', perfil.nombreEmpresa);
        formData.append('eslogan', perfil.eslogan);
        formData.append('direccion', perfil.direccion);
        formData.append('correo', perfil.correo);
        formData.append('telefono', perfil.telefono);
        formData.append('facebook', perfil.redesSociales.facebook);
        formData.append('twitter', perfil.redesSociales.twitter);
        formData.append('linkedin', perfil.redesSociales.linkedin);
        formData.append('instagram', perfil.redesSociales.instagram);
        if (perfil.logo) {
            formData.append('logo', perfil.logo);
        }

        try {
            if (editingId) {
                await axios.put(`https://backendcentro.onrender.com/api/perfil/${editingId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                MySwal.fire({
                    title: 'Éxito!',
                    text: 'El perfil ha sido actualizado correctamente.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                await axios.post('https://backendcentro.onrender.com/api/perfil', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                MySwal.fire({
                    title: 'Éxito!',
                    text: 'El perfil ha sido creado correctamente.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            }

            setPerfil({
                nombreEmpresa: '',
                eslogan: '',
                logo: null,
                direccion: '',
                correo: '',
                telefono: '',
                redesSociales: {
                    facebook: '',
                    twitter: '',
                    linkedin: '',
                    instagram: ''
                }
            });
            setEditingId(null);
            const response = await axios.get('https://backendcentro.onrender.com/api/perfil');
            setPerfiles(response.data);
        } catch (error) {
            console.error('Error al guardar perfil:', error.message);
            MySwal.fire({
                title: 'Error!',
                text: 'No puedes guardar, no has hecho ningún cambio.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto después de eliminarlo.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`https://backendcentro.onrender.com/api/perfil/${id}`);
                setPerfiles(perfiles.filter(p => p._id !== id));
                Swal.fire(
                    'Eliminado!',
                    'El perfil ha sido eliminado.',
                    'success'
                );
            } catch (error) {
                console.error('Error al eliminar perfil:', error.message);
                Swal.fire(
                    'Error!',
                    'Hubo un problema al intentar eliminar el perfil.',
                    'error'
                );
            }
        }
    };


    const handleEdit = (perfil) => {
        setPerfil(perfil);
        setEditingId(perfil._id);
    };
    const handleCancel = () => {
        setPerfil({
            nombreEmpresa: '',
            eslogan: '',
            logo: null,
            direccion: '',
            correo: '',
            telefono: '',
            redesSociales: {
                facebook: '',
                twitter: '',
                linkedin: '',
                instagram: ''
            }
        });
        setEditingId(null);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Gestión de Perfil</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGrid}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Empresa</label>
                        <input
                            type="text"
                            name="nombreEmpresa"
                            placeholder="Nombre de la Empresa"
                            value={perfil.nombreEmpresa}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Eslogan</label>
                        <input
                            type="text"
                            name="eslogan"
                            placeholder="Eslogan"
                            value={perfil.eslogan}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Logo</label>
                        <input
                            type="file"
                            name="logo"
                            accept="image/*"
                            onChange={handleLogoChange}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Dirección</label>
                        <input
                            type="text"
                            name="direccion"
                            placeholder="Dirección"
                            value={perfil.direccion}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Correo</label>
                        <input
                            type="email"
                            name="correo"
                            placeholder="Correo"
                            value={perfil.correo}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Teléfono (10 dígitos)</label>
                        <input
                            type="text"
                            name="telefono"
                            placeholder="Teléfono"
                            value={perfil.telefono}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                </div>
                <h3>Redes Sociales</h3>
                <div style={styles.formGrid}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}><FaFacebook /> Facebook</label>
                        <input
                            type="url"
                            name="facebook"
                            value={perfil.redesSociales.facebook}
                            onChange={handleSocialChange}
                            placeholder="https://www.facebook.com"
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}><FaTwitter /> Twitter</label>
                        <input
                            type="url"
                            name="twitter"
                            value={perfil.redesSociales.twitter}
                            onChange={handleSocialChange}
                            placeholder="https://www.twitter.com"
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}><FaLinkedin /> LinkedIn</label>
                        <input
                            type="url"
                            name="linkedin"
                            value={perfil.redesSociales.linkedin}
                            onChange={handleSocialChange}
                            placeholder="https://www.linkedin.com"
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}><FaInstagram /> Instagram</label>
                        <input
                            type="url"
                            name="instagram"
                            value={perfil.redesSociales.instagram}
                            onChange={handleSocialChange}
                            placeholder="https://www.instagram.com"
                            style={styles.input}
                        />
                    </div>
                </div>
                <div style={styles.buttonGroup}>
                    <button type="submit" style={styles.editButton}>
                        {editingId ? "Actualizar Perfil" : "Crear Perfil"}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        style={styles.cancelButton}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
            <div style={styles.profileList}>
                <h2>Perfiles Guardados</h2>
                {perfiles.map((perfil) => (
                    <div key={perfil._id} style={styles.profileItem}>
                        {perfil.logo && (
                            <img
                                src={perfil.logo}
                                alt="Logo de la empresa"
                                style={{ width: '100px', height: 'auto', borderRadius: '8px' }}
                            />
                        )}
                        <p><strong>Nombre de la Empresa:</strong> {perfil.nombreEmpresa}</p>
                        <p><strong>Eslogan:</strong> {perfil.eslogan}</p>
                        <p><strong>Dirección:</strong> {perfil.direccion}</p>
                        <p><strong>Correo de la empresa:</strong> {perfil.correo}</p>
                        <p><strong>Teléfono:</strong> {perfil.telefono}</p>
                        <p><strong>Facebook:</strong> {perfil.redesSociales.facebook}</p>
                        <p><strong>Twitter:</strong> {perfil.redesSociales.twitter}</p>
                        <p><strong>LinkedIn:</strong> {perfil.redesSociales.linkedin}</p>
                        <p><strong>Instagram:</strong> {perfil.redesSociales.instagram}</p>
                        <button onClick={() => handleEdit(perfil)} style={styles.editButton}>Editar</button>
                        <button onClick={() => handleDelete(perfil._id)} style={styles.cancelButton}>Eliminar</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        margin: '0 auto',
        padding: '20px',
        maxWidth: '800px',
        borderRadius: '8px',
        backgroundColor: '#f4f4f9',
    },
    title: {
        textAlign: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        fontSize: '16px',
        color: '#333',
        marginBottom: '5px',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        width: '100%',
        boxSizing: 'border-box',
    },
    button: {
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '10px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '10px',
    },
    profileList: {
        marginTop: '30px',
    },
    profileItem: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '15px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    editButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '8px 16px',
        border: 'none',
        cursor: 'pointer',
        marginRight: '10px',
        borderRadius: '5px',
        marginTop: '10px',
    },
    cancelButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        padding: '8px 16px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '10px',
    },

    '@media screen and (max-width: 1200px)': {
        container: {
            maxWidth: '90%',
            padding: '15px',
        },
        formGrid: {
            gridTemplateColumns: '1fr 1fr',
        },
        title: {
            fontSize: '22px',
        },
    },
    '@media screen and (max-width: 900px)': {
        container: {
            maxWidth: '100%',
            padding: '10px',
        },
        formGrid: {
            gridTemplateColumns: '1fr',
        },
        label: {
            fontSize: '14px',
        },
        input: {
            fontSize: '14px',
        },
        title: {
            fontSize: '20px',
        },
        profileItem: {
            padding: '15px',
        },
        editButton: {
            padding: '8px 12px',
        },
        cancelButton: {
            padding: '8px 12px',
        },
    },
    '@media screen and (max-width: 600px)': {
        container: {
            maxWidth: '100%',
            padding: '5px',
        },
        formGrid: {
            gridTemplateColumns: '1fr',
        },
        label: {
            fontSize: '12px',
        },
        input: {
            fontSize: '12px',
        },
        title: {
            fontSize: '18px',
        },
        profileItem: {
            padding: '10px',
        },
        editButton: {
            padding: '8px 10px',
        },
        cancelButton: {
            padding: '8px 10px',
        },
    },
};

export default Perfil;
