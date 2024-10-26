import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Perfil = () => {
    const [perfil, setPerfil] = useState({
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredFields = ['eslogan', 'direccion', 'correo', 'telefono'];
        const socialFields = ['facebook', 'twitter', 'linkedin', 'instagram'];

        const allFieldsFilled = requiredFields.every(field => perfil[field]);
        const allSocialFieldsFilled = socialFields.every(field => perfil.redesSociales[field]);

        const isPhoneValid = /^\d{10}$/.test(perfil.telefono);

        if (!allFieldsFilled || !allSocialFieldsFilled || !isPhoneValid) {
            let errorMessage = "Todos los campos son requeridos y el teléfono debe tener 10 dígitos.";
            if (!isPhoneValid) {
                errorMessage = "El teléfono debe tener exactamente 10 dígitos numéricos.";
            }
            alert(errorMessage);
            return;
        }

        const formData = new FormData();
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
            } else {
                await axios.post('https://backendcentro.onrender.com/api/perfil', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
           
            setPerfil({
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
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://backendcentro.onrender.com/api/perfil/${id}`);
            setPerfiles(perfiles.filter(p => p._id !== id));
        } catch (error) {
            console.error('Error al eliminar perfil:', error.message);
        }
    };

    const handleEdit = (perfil) => {
        setPerfil(perfil);
        setEditingId(perfil._id);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Gestión de Perfil</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGrid}>
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
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Facebook</label>
                        <input
                            type="text"
                            name="facebook"
                            placeholder="Facebook"
                            value={perfil.redesSociales.facebook}
                            onChange={handleSocialChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Twitter</label>
                        <input
                            type="text"
                            name="twitter"
                            placeholder="Twitter"
                            value={perfil.redesSociales.twitter}
                            onChange={handleSocialChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>LinkedIn</label>
                        <input
                            type="text"
                            name="linkedin"
                            placeholder="LinkedIn"
                            value={perfil.redesSociales.linkedin}
                            onChange={handleSocialChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Instagram</label>
                        <input
                            type="text"
                            name="instagram"
                            placeholder="Instagram"
                            value={perfil.redesSociales.instagram}
                            onChange={handleSocialChange}
                            required
                            style={styles.input}
                        />
                    </div>
                </div>
                <button type="submit" style={styles.submitButton}>
                    {editingId ? 'Actualizar Perfil' : 'Crear Perfil'}
                </button>
            </form>

            <h2 style={styles.title}>Perfiles Creados</h2>
            <ul style={styles.list}>
                {perfiles.map((p) => (
                    <li key={p._id} style={styles.listItem}>
                        <div style={styles.listContent}>
                            <img
                                src={`https://back-rq8v.onrender.com/uploads/${p.logo}`}
                                alt="Logo"
                                style={styles.logo}
                            />
                            <div style={styles.itemDetails}>
                                <h3 style={styles.itemTitle}>Eslogan: {p.eslogan}</h3>
                                <p><strong>Dirección:</strong> {p.direccion}</p>
                                <p><strong>Correo:</strong> {p.correo}</p>
                                <p><strong>Teléfono:</strong> {p.telefono}</p>
                                <div>
                                    <strong>Redes Sociales:</strong>
                                    <ul style={styles.socialList}>
                                        {p.redesSociales.facebook && <li>Facebook: {p.redesSociales.facebook}</li>}
                                        {p.redesSociales.twitter && <li>Twitter: {p.redesSociales.twitter}</li>}
                                        {p.redesSociales.linkedin && <li>LinkedIn: {p.redesSociales.linkedin}</li>}
                                        {p.redesSociales.instagram && <li>Instagram: {p.redesSociales.instagram}</li>}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div style={styles.buttonGroup}>
                            <button onClick={() => handleEdit(p)} style={styles.editButton}>Editar</button>
                            <button onClick={() => handleDelete(p._id)} style={styles.deleteButton}>Eliminar</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    title: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '20px',
    },
    form: {
        marginBottom: '40px',
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '35px', 
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    label: {
        marginBottom: '5px',
        fontWeight: 'bold',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        width: '100%',
    },
    submitButton: {
        padding: '10px 15px',
        fontSize: '16px',
        color: 'white',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        width: '100%',
        marginTop: '20px',
    },
    list: {
        listStyleType: 'none',
        padding: '0',
    },
    listItem: {
        marginBottom: '15px',
        padding: '10px',
        border: '1px solid #eee',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: 'column',
    },
    listContent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '100%',
    },
    logo: {
        width: '50px',
        height: '50px',
        marginRight: '10px',
    },
    itemDetails: {
        flex: 1,
    },
    itemTitle: {
        margin: '0',
        color: '#333',
    },
    socialList: {
        listStyleType: 'none',
        padding: '0',
    },
    buttonGroup: {
        marginTop: '10px',
    },
    editButton: {
        marginRight: '10px',
        padding: '5px 10px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    deleteButton: {
        padding: '5px 10px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    
    '@media (max-width: 600px)': {
        formGrid: {
            gridTemplateColumns: '1fr',
        },
        submitButton: {
            marginTop: '10px',
        },
        inputGroup: {
            marginBottom: '10px',
        },
        listContent: {
            flexDirection: 'column',
            alignItems: 'flex-start',
        },
        logo: {
            marginBottom: '10px',
        },
    },
};

export default Perfil;
