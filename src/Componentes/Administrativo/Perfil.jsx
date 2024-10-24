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
                const response = await axios.get('http://localhost:5000/api/perfil');
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
                await axios.put(`http://localhost:5000/api/perfil/${editingId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                await axios.post('http://localhost:5000/api/perfil', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            // Reiniciar el formulario
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
            const response = await axios.get('http://localhost:5000/api/perfil');
            setPerfiles(response.data);
        } catch (error) {
            console.error('Error al guardar perfil:', error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/perfil/${id}`);
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
        <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
            <h1 style={{ color: '#333' }}>Gestión de Perfil</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input
                        type="text"
                        name="eslogan"
                        placeholder="Eslogan"
                        value={perfil.eslogan}
                        onChange={handleChange}
                        required
                        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    <input
                        type="file"
                        name="logo"
                        accept="image/*"
                        onChange={handleLogoChange}
                        required
                        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    <input
                        type="text"
                        name="direccion"
                        placeholder="Dirección"
                        value={perfil.direccion}
                        onChange={handleChange}
                        required
                        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    <input
                        type="email"
                        name="correo"
                        placeholder="Correo"
                        value={perfil.correo}
                        onChange={handleChange}
                        required
                        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    <input
                        type="text"
                        name="telefono"
                        placeholder="Teléfono (10 dígitos)"
                        value={perfil.telefono}
                        onChange={handleChange}
                        required
                        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    <input
                        type="text"
                        name="facebook"
                        placeholder="Facebook"
                        value={perfil.redesSociales.facebook}
                        onChange={handleSocialChange}
                        required
                        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    <input
                        type="text"
                        name="twitter"
                        placeholder="Twitter"
                        value={perfil.redesSociales.twitter}
                        onChange={handleSocialChange}
                        required
                        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    <input
                        type="text"
                        name="linkedin"
                        placeholder="LinkedIn"
                        value={perfil.redesSociales.linkedin}
                        onChange={handleSocialChange}
                        required
                        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    <input
                        type="text"
                        name="instagram"
                        placeholder="Instagram"
                        value={perfil.redesSociales.instagram}
                        onChange={handleSocialChange}
                        required
                        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px', margin: '10px 0', border: 'none', borderRadius: '4px', backgroundColor: '#4CAF50', color: 'white', cursor: 'pointer' }}>
                    {editingId ? 'Actualizar Perfil' : 'Crear Perfil'}
                </button>
            </form>

            <h2 style={{ color: '#333' }}>Perfiles Creados</h2>
            <ul style={{ listStyleType: 'none', padding: '0' }}>
                {perfiles.map((p) => (
                    <li key={p._id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px', alignItems: 'center' }}>
                            <img
                                src={`http://localhost:5000/uploads/${p.logo}`}
                                alt="Logo"
                                style={{ width: '100px', height: 'auto', borderRadius: '4px' }}
                            />
                            <div>
                                <h3 style={{ margin: '0' }}>Eslogan: {p.eslogan}</h3>
                                <p><strong>Dirección:</strong> {p.direccion}</p>
                                <p><strong>Correo:</strong> {p.correo}</p>
                                <p><strong>Teléfono:</strong> {p.telefono}</p>
                                <div>
                                    <strong>Redes Sociales:</strong>
                                    <ul style={{ listStyleType: 'none', padding: '0' }}>
                                        {p.redesSociales.facebook && <li>Facebook: {p.redesSociales.facebook}</li>}
                                        {p.redesSociales.twitter && <li>Twitter: {p.redesSociales.twitter}</li>}
                                        {p.redesSociales.linkedin && <li>LinkedIn: {p.redesSociales.linkedin}</li>}
                                        {p.redesSociales.instagram && <li>Instagram: {p.redesSociales.instagram}</li>}
                                    </ul>
                                </div>
                                <button onClick={() => handleEdit(p)} style={{ margin: '5px', padding: '5px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Editar</button>
                                <button onClick={() => handleDelete(p._id)} style={{ margin: '5px', padding: '5px', backgroundColor: '#F44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Eliminar</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Perfil;
