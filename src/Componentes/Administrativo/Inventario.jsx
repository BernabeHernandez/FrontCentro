import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Inventario = () => {
    const [productos, setProductos] = useState([]);
    const [editandoProducto, setEditandoProducto] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        cantidad: '',
        id_categoria: '',
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState(''); // 'agregar' o 'eliminar'
    const [cantidadInput, setCantidadInput] = useState(0);
    const [productoId, setProductoId] = useState(null);

    // Función para obtener los productos desde la API
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get('https://backendcentro.onrender.com/api/productos');
                setProductos(response.data);
            } catch (error) {
                console.error('Error al obtener los productos:', error);
            }
        };

        fetchProductos();
    }, []);

    const actualizarCantidad = async () => {
        if (isNaN(cantidadInput) || cantidadInput <= 0) {
            Swal.fire('Error', 'Por favor ingresa un número válido', 'error');
            return;
        }

        const cantidadNumerica = Number(cantidadInput); // Asegúrate de convertirlo a número

        try {
            if (modalType === 'agregar') {
                await axios.put(`https://backendcentro.onrender.com/api/productos/agregar-cantidad/${productoId}`, { cantidad: cantidadNumerica });
                Swal.fire('Correcto', 'Cantidad agregada exitosamente', 'success');
            } else if (modalType === 'eliminar') {
                await axios.put(`https://backendcentro.onrender.com/api/productos/eliminar-cantidad/${productoId}`, { cantidad: cantidadNumerica });
                Swal.fire('Correcto', 'Cantidad eliminada exitosamente', 'success');
            }
            setProductos((prevProductos) =>
                prevProductos.map((producto) =>
                    producto.id === productoId ? {
                        ...producto,
                        cantidad: modalType === 'agregar' ? producto.cantidad + cantidadNumerica : producto.cantidad - cantidadNumerica
                    } : producto
                )
            );
            setModalVisible(false); // Cerrar el modal y limpiar
            setCantidadInput(0); // Limpiar el input
            setProductoId(null); // Limpiar el ID del producto
        } catch (error) {
            Swal.fire('Error', 'Hubo un error al actualizar la cantidad', 'error');
            console.error('Error al actualizar cantidad:', error);
        }
    };

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
    
        // Mostrar el cuadro de confirmación antes de actualizar
        Swal.fire({
            title: '¿Estás seguro de que deseas actualizar este producto?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, actualizar',
            cancelButtonText: 'No, cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const { nombre, descripcion, precio, cantidad, id_categoria } = formData;
    
                    // Actualizar el producto
                    await axios.put(`https://backendcentro.onrender.com/api/productos/${editandoProducto.id}`, {
                        nombre,
                        descripcion,
                        precio,
                        cantidad,
                        id_categoria,
                    });
    
                    setProductos((prevProductos) =>
                        prevProductos.map((producto) =>
                            producto.id === editandoProducto.id ? { ...producto, ...formData } : producto
                        )
                    );
    
                    setEditandoProducto(null);
                    setFormData({ nombre: '', descripcion: '', precio: '', cantidad: '', id_categoria: '' });
                    Swal.fire('Actualizado', 'El producto ha sido actualizado correctamente.', 'success');
                } catch (error) {
                    console.error('Error al editar el producto:', error);
                    Swal.fire('Error', 'Hubo un problema al actualizar el producto.', 'error');
                }
            }
        });
    };
    

    // Función para eliminar un producto con confirmación
    const eliminarProducto = (id) => {
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
                    await axios.delete(`https://backendcentro.onrender.com/api/productos/${id}`);
                    setProductos((prevProductos) => prevProductos.filter((producto) => producto.id !== id));
                    Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
                } catch (error) {
                    console.error('Error al eliminar el producto:', error);
                    Swal.fire('Error', 'Hubo un problema al eliminar el producto.', 'error');
                }
            }
        });
    };

    return (
        <div className="inventario-container">
            <h1>Inventario de Productos</h1>

            {editandoProducto && (
                <div className="edit-form-container">
                    <h2>Editar Producto</h2>
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
                        <label>
                            Cantidad:
                            <input
                                type="number"
                                name="cantidad"
                                value={formData.cantidad}
                                onChange={handleInputChange}
                                className="input-edit"
                            />
                        </label>
                        <div className="form-actions">
                            <button type="submit" className="btn-submit">Actualizar Producto</button>
                            <button type="button" onClick={() => setEditandoProducto(null)} className="btn-cancel">Cancelar</button>
                        </div>
                    </form>
                </div>
            )}

            <table className="inventario-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((producto) => (
                        <tr key={producto.id}>
                            <td>{producto.nombre}</td>
                            <td>${producto.precio}</td>
                            <td>{producto.cantidad}</td>
                            <td className="acciones">
                                <button
                                    className="btn-agregar"
                                    onClick={() => {
                                        setModalType('agregar');
                                        setProductoId(producto.id);
                                        setModalVisible(true);
                                    }}
                                >
                                    Agregar
                                </button>
                                <button
                                    className="btn-eliminar"
                                    onClick={() => {
                                        setModalType('eliminar');
                                        setProductoId(producto.id);
                                        setModalVisible(true);
                                    }}
                                >
                                    Quitar
                                </button>
                                <button
                                    className="btn-editar"
                                    onClick={() => {
                                        setEditandoProducto(producto);
                                        setFormData({
                                            nombre: producto.nombre,
                                            descripcion: producto.descripcion,
                                            precio: producto.precio,
                                            cantidad: producto.cantidad,
                                            id_categoria: producto.id_categoria,
                                        });
                                    }}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn-eliminar-producto"
                                    onClick={() => eliminarProducto(producto.id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal para agregar o eliminar cantidad */}
            {modalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{modalType === 'agregar' ? 'Agregar cantidad' : 'Eliminar cantidad'}</h3>
                        <input
                            type="number"
                            value={cantidadInput}
                            onChange={(e) => setCantidadInput(e.target.value)}
                            placeholder="Cantidad"
                            className="modal-input"
                        />
                        <div className="modal-actions">
                            <button className="btn-confirm" onClick={actualizarCantidad}>
                                Confirmar
                            </button>
                            <button className="btn-cancel" onClick={() => setModalVisible(false)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

                .modal-content,
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
                    .btn-confirm {
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
                    .btn-confirm {
                    background-color: #28a745;
                    color: white;
                }

                .btn-cancel {
                    background-color: #dc3545;
                    color: white;
                }

                .modal-actions {
                    display: flex;
                    justify-content: space-between;
                }

                .modal-overlay {
                    display: ${modalVisible ? 'flex' : 'none'};
                }

                .acciones {
                    display: flex;
                    gap: 10px;
                }

                .acciones button {
                    padding: 8px 16px;
                    border-radius: 5px;
                    cursor: pointer;
                    color: white;
                    border: none;
                }

                .btn-agregar {
                    background-color: #28a745;
                }

                .btn-eliminar {
                    background-color: #dc3545;
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
            `}</style>
        </div>
    );
};

export default Inventario;
