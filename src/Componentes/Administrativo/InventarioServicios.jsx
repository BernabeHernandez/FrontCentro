import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const InventarioServicios = () => {
    const [servicios, setServicios] = useState([]);
    const [editandoServicio, setEditandoServicio] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        id_categoria: '',
    });

    // Función para obtener los servicios desde la API
    useEffect(() => {
        const fetchServicios = async () => {
            try {
                const response = await axios.get('https://backendcentro.onrender.com/api/servicios');
                setServicios(response.data);
            } catch (error) {
                console.error('Error al obtener los servicios:', error);
            }
        };

        fetchServicios();
    }, []);

    // Función para manejar el formulario de edición
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();

        // Confirmación antes de actualizar
        const confirmUpdate = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas actualizar este servicio?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, actualizar',
            cancelButtonText: 'No, cancelar',
        });

        if (confirmUpdate.isConfirmed) {
            try {
                const { nombre, descripcion, precio, id_categoria } = formData;

                await axios.put(`https://backendcentro.onrender.com/api/servicios/${editandoServicio.id}`, {
                    nombre,
                    descripcion,
                    precio,
                    id_categoria,
                });

                setServicios((prevServicios) =>
                    prevServicios.map((servicio) =>
                        servicio.id === editandoServicio.id ? { ...servicio, ...formData } : servicio
                    )
                );

                setEditandoServicio(null);
                setFormData({ nombre: '', descripcion: '', precio: '', id_categoria: '' });
                Swal.fire('Actualizado', 'El servicio ha sido actualizado correctamente', 'success');
            } catch (error) {
                console.error('Error al editar el servicio:', error);
                Swal.fire('Error', 'Hubo un problema al actualizar el servicio.', 'error');
            }
        }
    };

    // Función para eliminar un servicio con confirmación
    const eliminarServicio = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'No, cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`https://backendcentro.onrender.com/api/servicios/${id}`);
                    setServicios((prevServicios) => prevServicios.filter((servicio) => servicio.id !== id));
                    Swal.fire('Eliminado', 'El servicio ha sido eliminado.', 'success');
                } catch (error) {
                    console.error('Error al eliminar el servicio:', error);
                    Swal.fire('Error', 'Hubo un problema al eliminar el servicio.', 'error');
                }
            }
        });
    };

    return (
        <div className="inventario-container">
            <h1>Inventario de Servicios</h1>

            {editandoServicio && (
                <div className="edit-form-container">
                    <h2>Editar Servicio</h2>
                    <form onSubmit={handleSubmitEdit}>
                        <label>
                            Nombre:
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                className="input-edit"
                            />
                        </label>
                        <label>
                            Descripción:
                            <input
                                type="text"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleInputChange}
                                className="input-edit"
                            />
                        </label>
                        <label>
                            Precio:
                            <input
                                type="number"
                                name="precio"
                                value={formData.precio}
                                onChange={handleInputChange}
                                className="input-edit"
                            />
                        </label>
                        <div className="form-actions">
                            <button type="submit" className="btn-submit">Actualizar Servicio</button>
                            <button type="button" onClick={() => setEditandoServicio(null)} className="btn-cancel">Cancelar</button>
                        </div>
                    </form>
                </div>
            )}

            <table className="inventario-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {servicios.map((servicio) => (
                        <tr key={servicio.id}>
                            <td>{servicio.nombre}</td>
                            <td>${servicio.precio}</td>
                            <td className="acciones">
                                <button
                                    className="btn-editar"
                                    onClick={() => {
                                        setEditandoServicio(servicio);
                                        setFormData({
                                            nombre: servicio.nombre,
                                            descripcion: servicio.descripcion,
                                            precio: servicio.precio,
                                            id_categoria: servicio.id_categoria,
                                        });
                                    }}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn-eliminar-producto"
                                    onClick={() => eliminarServicio(servicio.id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <style jsx>{`
                .inventario-container {
                    padding: 20px;
                    font-family: Arial, sans-serif;
                }

                h1 {
                    text-align: center;
                    margin-bottom: 20px;
                }

                .edit-form-container,
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }

                .edit-form-container form {
                    background: white;
                    padding: 30px;
                    border-radius: 8px;
                    width: 300px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

                input {
                    width: 100%;
                    padding: 10px;
                    margin: 10px 0;
                    border-radius: 5px;
                    border: 1px solid #ccc;
                }

                .form-actions {
                    display: flex;
                    justify-content: space-between;
                    gap: 10px;
                }

                .btn-submit,
                .btn-cancel {
                    padding: 10px;
                    margin: 5px;
                    border-radius: 5px;
                    border: none;
                    cursor: pointer;
                }

                .btn-submit {
                    background-color: #28a745;
                    color: white;
                }

                .btn-cancel {
                    background-color: #dc3545;
                    color: white;
                }

                .acciones {
                    display: flex;
                    gap: 10px;
                    text-align: right;
                }

                .acciones button {
                    padding: 8px 16px;
                    border-radius: 5px;
                    cursor: pointer;
                    color: white;
                    border: none;
                }

                .btn-editar {
                    background-color: #ffc107;
                }

                .btn-eliminar-producto {
                    background-color: #dc3545;
                }

                .inventario-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .inventario-table th,
                .inventario-table td {
                     padding: 10px;
                     text-align: left;
                     border-bottom: 1px solid #ddd;
                }

                .inventario-table tr {
                    border-bottom: 2px solid #ddd;
                }

                .inventario-table th {
                    background-color: #f2f2f2;
                }

                .inventario-table tr:nth-child(even) {
                    background-color: #f9f9f9;
                }

                .inventario-table tr:hover {
                    background-color: #f1f1f1;
                }
                    .inventario-table th:nth-child(1),
                    .inventario-table td:nth-child(1) {
                     width: 80%; 
                }

                .inventario-table th:nth-child(2),
                .inventario-table td:nth-child(2) 
                {
                  width: 20%; 
                }

                .inventario-table th:nth-child(3),
                .inventario-table td:nth-child(3) 
                {
                   width: 10%;
                }

             
                }
            `}</style>
        </div>
    );
};

export default InventarioServicios;
