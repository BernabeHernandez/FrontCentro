import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button, TextField, Modal, Box, Typography, useMediaQuery, useTheme } from '@mui/material';

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

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detectar si es móvil

    // Obtener los productos desde la API
    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        try {
            const response = await axios.get('https://backendcentro.onrender.com/api/productos');
            setProductos(response.data);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    };

    // Actualizar la cantidad de un producto
    const actualizarCantidad = async () => {
        if (isNaN(cantidadInput) || cantidadInput <= 0) {
            Swal.fire('Error', 'Por favor ingresa un número válido', 'error');
            return;
        }

        const cantidadNumerica = Number(cantidadInput);

        try {
            if (modalType === 'agregar') {
                await axios.put(`https://backendcentro.onrender.com/api/productos/agregar-cantidad/${productoId}`, { cantidad: cantidadNumerica });
                Swal.fire('Correcto', 'Cantidad agregada exitosamente', 'success');
            } else if (modalType === 'eliminar') {
                await axios.put(`https://backendcentro.onrender.com/api/productos/eliminar-cantidad/${productoId}`, { cantidad: cantidadNumerica });
                Swal.fire('Correcto', 'Cantidad eliminada exitosamente', 'success');
            }
            // Actualizar el estado local sin recargar la página
            setProductos((prevProductos) =>
                prevProductos.map((producto) =>
                    producto.id === productoId ? {
                        ...producto,
                        cantidad: modalType === 'agregar' ? producto.cantidad + cantidadNumerica : producto.cantidad - cantidadNumerica
                    } : producto
                )
            );
            setModalVisible(false);
            setCantidadInput(0);
            setProductoId(null);
        } catch (error) {
            Swal.fire('Error', 'Hubo un error al actualizar la cantidad', 'error');
            console.error('Error al actualizar cantidad:', error);
        }
    };

    // Manejar cambios en el formulario de edición
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Enviar el formulario de edición
    const handleSubmitEdit = async (e) => {
        e.preventDefault();
    
        // Cerrar el modal de edición antes de mostrar el cuadro de confirmación
        setEditandoProducto(null);
    
        // Mostrar el cuadro de confirmación de Swal
        const confirmUpdate = await Swal.fire({
            title: '¿Estás seguro de que deseas actualizar este producto?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, actualizar',
            cancelButtonText: 'No, cancelar',
        });
    
        if (confirmUpdate.isConfirmed) {
            try {
                const { nombre, descripcion, precio, cantidad, id_categoria } = formData;
    
                await axios.put(`https://backendcentro.onrender.com/api/productos/${editandoProducto.id}`, {
                    nombre,
                    descripcion,
                    precio,
                    cantidad,
                    id_categoria,
                });
    
                // Actualizar el estado local sin recargar la página
                setProductos((prevProductos) =>
                    prevProductos.map((producto) =>
                        producto.id === editandoProducto.id ? { ...producto, ...formData } : producto
                    )
                );
    
                setFormData({ nombre: '', descripcion: '', precio: '', cantidad: '', id_categoria: '' });
                Swal.fire('Actualizado', 'El producto ha sido actualizado correctamente.', 'success');
            } catch (error) {
                console.error('Error al editar el producto:', error);
                Swal.fire('Error', 'Hubo un problema al actualizar el producto.', 'error');
            }
        } else {
            // Si el usuario cancela, volver a abrir el modal de edición
            setEditandoProducto(editandoProducto);
        }
    };

    // Eliminar un producto
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
                    // Actualizar el estado local sin recargar la página
                    setProductos((prevProductos) => prevProductos.filter((producto) => producto.id !== id));
                    Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
                } catch (error) {
                    console.error('Error al eliminar el producto:', error);
                    Swal.fire('Error', 'Hubo un problema al eliminar el producto.', 'error');
                }
            }
        });
    };

    // Columnas del DataGrid
    const columns = [
        { field: 'nombre', headerName: 'Nombre', flex: 2, minWidth: 200, headerClassName: 'header-style' },
        { field: 'precio', headerName: 'Precio', flex: 1, minWidth: 100, type: 'number', headerClassName: 'header-style' },
        { field: 'cantidad', headerName: 'Cantidad', flex: 1, minWidth: 100, type: 'number', headerClassName: 'header-style' },
        {
            field: 'acciones',
            headerName: 'Acciones',
            flex: 2,
            minWidth: 300,
            headerClassName: 'header-style',
            renderCell: (params) => (
                <div>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => {
                            setModalType('agregar');
                            setProductoId(params.row.id);
                            setModalVisible(true);
                        }}
                        style={{ marginRight: 8 }}
                    >
                        Agregar
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            setModalType('eliminar');
                            setProductoId(params.row.id);
                            setModalVisible(true);
                        }}
                        style={{ marginRight: 8 }}
                    >
                        Quitar
                    </Button>
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={() => {
                            setEditandoProducto(params.row);
                            setFormData({
                                nombre: params.row.nombre,
                                descripcion: params.row.descripcion,
                                precio: params.row.precio,
                                cantidad: params.row.cantidad,
                                id_categoria: params.row.id_categoria,
                            });
                        }}
                        style={{ marginRight: 8 }}
                    >
                        Editar
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => eliminarProducto(params.row.id)}
                    >
                        Eliminar
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div style={{ height: 'calc(100vh - 64px)', width: '92%', padding: '16px', overflow: 'hidden' }}>
            <h1>Inventario de Productos</h1>

            {/* Modal para editar producto */}
            {editandoProducto && (
                <Modal open={Boolean(editandoProducto)} onClose={() => setEditandoProducto(null)}>
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: isMobile ? '90%' : 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                        <Typography variant="h6" component="h2">
                            Editar Producto
                        </Typography>
                        <form onSubmit={handleSubmitEdit}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleInputChange}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Descripción"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleInputChange}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Precio"
                                name="precio"
                                type="number"
                                value={formData.precio}
                                onChange={handleInputChange}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Cantidad"
                                name="cantidad"
                                type="number"
                                value={formData.cantidad}
                                onChange={handleInputChange}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                <Button type="submit" variant="contained" color="primary">Actualizar Producto</Button>
                                <Button variant="contained" color="secondary" onClick={() => setEditandoProducto(null)}>Cancelar</Button>
                            </Box>
                        </form>
                    </Box>
                </Modal>
            )}

            {/* DataGrid para mostrar los productos */}
            <div style={{ height: 'calc(100% - 64px)', width: '100%', overflow: 'auto' }}>
                <DataGrid
                    rows={productos}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    components={{ Toolbar: GridToolbar }}
                    disableSelectionOnClick
                    sx={{
                        '& .header-style': {
                            backgroundColor: '#1976d2',
                            color: 'white',
                        },
                        '& .MuiDataGrid-row:hover': {
                            backgroundColor: '#e3f2fd',
                        },
                    }}
                />
            </div>

            {/* Modal para agregar o eliminar cantidad */}
            <Modal open={modalVisible} onClose={() => setModalVisible(false)}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: isMobile ? '90%' : 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                    <Typography variant="h6" component="h2">
                        {modalType === 'agregar' ? 'Agregar cantidad' : 'Eliminar cantidad'}
                    </Typography>
                    <TextField
                        fullWidth
                        margin="normal"
                        type="number"
                        value={cantidadInput}
                        onChange={(e) => setCantidadInput(e.target.value)}
                        placeholder="Cantidad"
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button variant="contained" color="primary" onClick={actualizarCantidad}>
                            Confirmar
                        </Button>
                        <Button variant="contained" color="secondary" onClick={() => setModalVisible(false)}>
                            Cancelar
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default Inventario;