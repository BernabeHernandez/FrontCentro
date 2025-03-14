import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button, TextField, Modal, Box, Typography, useMediaQuery, useTheme } from '@mui/material';

const InventarioServicios = () => {
    const [servicios, setServicios] = useState([]);
    const [editandoServicio, setEditandoServicio] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        id_categoria: '',
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detectar si es móvil

    // Obtener los servicios desde la API
    useEffect(() => {
        fetchServicios();
    }, []);

    const fetchServicios = async () => {
        try {
            const response = await axios.get('https://backendcentro.onrender.com/api/servicios');
            setServicios(response.data);
        } catch (error) {
            console.error('Error al obtener los servicios:', error);
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
// Enviar el formulario de edición
const handleSubmitEdit = async (e) => {
    e.preventDefault();

    // Cerrar el modal de edición antes de mostrar el cuadro de confirmación
    setEditandoServicio(null);

    // Mostrar el cuadro de confirmación de Swal
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

            // Actualizar el estado local sin recargar la página
            setServicios((prevServicios) =>
                prevServicios.map((servicio) =>
                    servicio.id === editandoServicio.id ? { ...servicio, ...formData } : servicio
                )
            );

            setFormData({ nombre: '', descripcion: '', precio: '', id_categoria: '' });
            Swal.fire('Actualizado', 'El servicio ha sido actualizado correctamente', 'success');
        } catch (error) {
            console.error('Error al editar el servicio:', error);
            Swal.fire('Error', 'Hubo un problema al actualizar el servicio.', 'error');
        }
    } else {
        // Si el usuario cancela, volver a abrir el modal de edición
        setEditandoServicio(editandoServicio);
    }
};

    // Eliminar un servicio
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
                    // Actualizar el estado local sin recargar la página
                    setServicios((prevServicios) => prevServicios.filter((servicio) => servicio.id !== id));
                    Swal.fire('Eliminado', 'El servicio ha sido eliminado.', 'success');
                } catch (error) {
                    console.error('Error al eliminar el servicio:', error);
                    Swal.fire('Error', 'Hubo un problema al eliminar el servicio.', 'error');
                }
            }
        });
    };

    // Columnas del DataGrid
    const columns = [
        { field: 'nombre', headerName: 'Nombre', flex: 2, minWidth: 200, headerClassName: 'header-style' },
        { field: 'precio', headerName: 'Precio', flex: 1, minWidth: 100, type: 'number', headerClassName: 'header-style' },
        {
            field: 'acciones',
            headerName: 'Acciones',
            flex: 1,
            minWidth: 200,
            headerClassName: 'header-style',
            renderCell: (params) => (
                <div>
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={() => {
                            setEditandoServicio(params.row);
                            setFormData({
                                nombre: params.row.nombre,
                                descripcion: params.row.descripcion,
                                precio: params.row.precio,
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
                        onClick={() => eliminarServicio(params.row.id)}
                    >
                        Eliminar
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div style={{ height: 'calc(100vh - 64px)', width: '92%', padding: '16px', overflow: 'hidden' }}>
            <h1>Inventario de Servicios</h1>

            {/* Modal para editar servicio */}
            {editandoServicio && (
                <Modal open={Boolean(editandoServicio)} onClose={() => setEditandoServicio(null)}>
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: isMobile ? '90%' : 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                        <Typography variant="h6" component="h2">
                            Editar Servicio
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
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                <Button type="submit" variant="contained" color="primary">Actualizar Servicio</Button>
                                <Button variant="contained" color="secondary" onClick={() => setEditandoServicio(null)}>Cancelar</Button>
                            </Box>
                        </form>
                    </Box>
                </Modal>
            )}

            {/* DataGrid para mostrar los servicios */}
            <div style={{ height: 'calc(100% - 64px)', width: '100%', overflow: 'auto' }}>
                <DataGrid
                    rows={servicios}
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
        </div>
    );
};

export default InventarioServicios;