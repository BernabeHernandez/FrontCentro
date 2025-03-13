import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

const Promociones = () => {
    const [promociones, setPromociones] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [descuento, setDescuento] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [estado, setEstado] = useState("activa");
    const [idServicio, setIdServicio] = useState("");
    const [idPromocion, setIdPromocion] = useState("");
    const [serviciosConPromocion, setServiciosConPromocion] = useState([]);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [promocionEditando, setPromocionEditando] = useState(null);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const promocionesResponse = await axios.get("https://backendcentro.onrender.com/api/promociones/listar");
            setPromociones(promocionesResponse.data);

            const serviciosResponse = await axios.get("https://backendcentro.onrender.com/api/promociones/servicios/listar");
            setServicios(serviciosResponse.data);

            const serviciosConPromocionResponse = await axios.get("https://backendcentro.onrender.com/api/promociones/servicios/con-promocion");
            setServiciosConPromocion(serviciosConPromocionResponse.data);
        } catch (error) {
            console.error("Error al cargar los datos:", error);
            Swal.fire('Error', 'Error al cargar datos', 'error');
        }
    };

    const crearPromocion = async () => {
        if (!titulo || !descripcion || descuento === "" || isNaN(descuento) || descuento <= 0 || !fechaInicio || !fechaFin || !estado) {
            Swal.fire('Error', 'Todos los campos deben ser llenados correctamente', 'warning');
            return;
        }

        const nuevaPromocion = {
            titulo,
            descripcion,
            descuento,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
            estado,
        };

        try {
            await axios.post("https://backendcentro.onrender.com/api/promociones/crear", nuevaPromocion);
            Swal.fire('Éxito', 'Promoción creada con éxito', 'success');
            resetForm();
            cargarDatos();
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Error al crear la promoción', 'error');
        }
    };

    const asignarServicio = async () => {
        if (!idPromocion || !idServicio) {
            Swal.fire('Error', 'Por favor seleccione una promoción y un servicio', 'warning');
            return;
        }

        const servicioData = {
            id_promocion: idPromocion,
            id_servicio: idServicio,
        };

        try {
            await axios.post("https://backendcentro.onrender.com/api/promociones/asignar-servicio", servicioData);
            Swal.fire('Éxito', 'Servicio asignado con éxito', 'success');
            setIdServicio("");
            setIdPromocion("");
            cargarDatos();
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Error al asignar servicio', 'error');
        }
    };

    const actualizarPromocion = async () => {
        if (!titulo || !descripcion || descuento === "" || isNaN(descuento) || descuento <= 0 || !fechaInicio || !fechaFin || !estado) {
            Swal.fire('Error', 'Todos los campos deben ser llenados correctamente', 'warning');
            return;
        }

        const promocionActualizada = {
            titulo,
            descripcion,
            descuento: descuento || 0,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
            estado,
        };

        try {
            await axios.put(`https://backendcentro.onrender.com/api/promociones/actualizar/${promocionEditando.id_promocion}`, promocionActualizada);
            Swal.fire('Éxito', 'Promoción actualizada con éxito', 'success');
            resetForm();
            cargarDatos();
            setModoEdicion(false);
        } catch (error) {
            console.error("Error al actualizar la promoción:", error);
            Swal.fire('Error', 'Error al actualizar la promoción', 'error');
        }
    };

    const eliminarPromocion = async (id) => {
        try {
            await axios.delete(`https://backendcentro.onrender.com/api/promociones/eliminar/${id}`);
            Swal.fire('Éxito', 'Promoción eliminada con éxito', 'success');
            cargarDatos();
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Error al eliminar la promoción', 'error');
        }
    };

    const actualizarPromocionServicio = async (id_servicio, id_promocion_nueva) => {
        if (!id_promocion_nueva) {
            Swal.fire('Error', 'Selecciona una promoción para asignar', 'warning');
            return;
        }

        console.log("Datos enviados al backend:", { id_servicio, id_promocion_nueva });

        try {
            await axios.put("https://backendcentro.onrender.com/api/promociones/servicios/actualizar-promocion", {
                id_servicio,
                id_promocion_nueva,
            });
            Swal.fire('Éxito', 'Promoción del servicio actualizada correctamente', 'success');
            cargarDatos();
        } catch (error) {
            console.error("Error al actualizar la promoción del servicio:", error);
            Swal.fire('Error', 'Error al actualizar la promoción del servicio', 'error');
        }
    };

    const quitarPromocionServicio = async (id_servicio) => {
        try {
            await axios.delete(`https://backendcentro.onrender.com/api/promociones/servicios/quitar-promocion/${id_servicio}`);
            Swal.fire('Éxito', 'Promoción quitada del servicio correctamente', 'success');
            cargarDatos();
        } catch (error) {
            console.error("Error al quitar la promoción del servicio:", error);
            Swal.fire('Error', 'Error al quitar la promoción del servicio', 'error');
        }
    };

    const resetForm = () => {
        setTitulo("");
        setDescripcion("");
        setDescuento("");
        setFechaInicio("");
        setFechaFin("");
        setEstado("activa");
        setModoEdicion(false);
        setPromocionEditando(null);
    };

    const cargarPromocionParaEditar = (promocion) => {
        setTitulo(promocion.titulo);
        setDescripcion(promocion.descripcion);
        setDescuento(promocion.descuento);
        setFechaInicio(promocion.fecha_inicio);
        setFechaFin(promocion.fecha_fin);
        setEstado(promocion.estado);
        setModoEdicion(true);
        setPromocionEditando(promocion);
    };

    const calcularPrecioConDescuento = (precio, descuento) => {
        const descuentoNumerico = parseFloat(descuento);
        if (isNaN(descuentoNumerico) || descuentoNumerico < 0) {
            console.error("Descuento no válido", descuento);
            return precio;
        }

        const precioNumerico = parseFloat(precio);
        if (isNaN(precioNumerico)) {
            console.error("Precio no válido", precio);
            return precio;
        }

        const precioConDescuento = precioNumerico * (1 - descuentoNumerico / 100);
        return precioConDescuento.toFixed(2);
    };

    return (
        
            <div style={styles.container}>
                <h2 style={styles.title}>Administrar Promociones</h2>
    
                {/* Formulario para crear o actualizar promoción */}
                <div style={styles.formContainer}>
                    <h3 style={styles.subtitle}>{modoEdicion ? "Actualizar Promoción" : "Crear Promoción"}</h3>
                    <input
                        type="text"
                        placeholder="Título"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        style={styles.input}
                    />
                    <textarea
                        placeholder="Descripción"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        style={styles.textarea}
                    />
                    <input
                        type="number"
                        placeholder="Descuento (%)"
                        value={descuento}
                        onChange={(e) => setDescuento(e.target.value)}
                        style={styles.input}
                    />
                    <input
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        style={styles.input}
                    />
                    <input
                        type="date"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                        style={styles.input}
                    />
                    <select value={estado} onChange={(e) => setEstado(e.target.value)} style={styles.select}>
                        <option value="activa">Activa</option>
                        <option value="inactiva">Inactiva</option>
                    </select>
                    {modoEdicion ? (
                        <button onClick={actualizarPromocion} style={styles.button}>Actualizar Promoción</button>
                    ) : (
                        <button onClick={crearPromocion} style={styles.button}>Crear Promoción</button>
                    )}
                    {modoEdicion && (
                        <button onClick={resetForm} className="btn-cancel">Cancelar Edición</button> // Cambiado a clase CSS.
                    )}
                </div>
    
                {/* Asignar servicio a una promoción */}
                <div style={styles.formContainer}>
                    <h3 style={styles.subtitle}>Asignar Servicio a Promoción</h3>
                    <select
                        value={idPromocion}
                        onChange={(e) => setIdPromocion(e.target.value)}
                        style={styles.select}
                    >
                        <option value="">Seleccione una Promoción</option>
                        {promociones.map((promo) => (
                            <option key={promo.id_promocion} value={promo.id_promocion}>
                                {promo.titulo}
                            </option>
                        ))}
                    </select>
    
                    <select
                        value={idServicio}
                        onChange={(e) => setIdServicio(e.target.value)}
                        style={styles.select}
                    >
                        <option value="">Seleccione un Servicio</option>
                        {servicios.map((servicio) => (
                            <option key={servicio.id} value={servicio.id}>
                                {servicio.nombre}
                            </option>
                        ))}
                    </select>
    
                    <button onClick={asignarServicio} style={styles.button}>Asignar Servicio</button>
                </div>
    
                {/* Listar promociones */}
                <div style={styles.tableContainer}>
                    <h3 style={styles.subtitle}>Promociones Actuales</h3>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Título</th>
                                <th style={styles.th}>Descripción</th>
                                <th style={styles.th}>Descuento (%)</th>
                                <th style={styles.th}>Estado</th>
                                <th style={styles.th}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promociones.map((promo) => (
                                <tr key={promo.id_promocion} style={styles.tr}>
                                    <td style={styles.td}>{promo.titulo}</td>
                                    <td style={styles.td}>{promo.descripcion}</td>
                                    <td style={styles.td}>{promo.descuento}</td>
                                    <td style={styles.td}>{promo.estado}</td>
                                    <td style={styles.td}>
                                        <button onClick={() => cargarPromocionParaEditar(promo)} style={styles.actionButton}>Actualizar</button>
                                        <button onClick={() => eliminarPromocion(promo.id_promocion)} style={styles.deleteButton}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
    
                {/* Listar Servicios con Promoción */}
                <div style={styles.tableContainer}>
                    <h3 style={styles.subtitle}>Servicios con Promoción</h3>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Servicio</th>
                                <th style={styles.th}>Promoción</th>
                                <th style={styles.th}>Precio Original</th>
                                <th style={styles.th}>Precio con Descuento</th>
                                <th style={styles.th}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {serviciosConPromocion.map((servicioPromo) => {
                                const precioConDescuento = calcularPrecioConDescuento(servicioPromo.precio, servicioPromo.descuento);
                                return (
                                    <tr key={servicioPromo.id} style={styles.tr}>
                                        <td style={styles.td}>{servicioPromo.nombre}</td>
                                        <td style={styles.td}>{servicioPromo.descripcion}</td>
                                        <td style={styles.td}>{servicioPromo.precio} $</td>
                                        <td style={styles.td}>{precioConDescuento} $</td>
                                        <td style={styles.td}>
                                            <select
                                                value={servicioPromo.id_promocion || ""}
                                                onChange={(e) => actualizarPromocionServicio(servicioPromo.id, e.target.value)}
                                                style={styles.select}
                                            >
                                                <option value="">Seleccione una Promoción</option>
                                                {promociones.map((promo) => (
                                                    <option key={promo.id_promocion} value={promo.id_promocion}>
                                                        {promo.titulo}
                                                    </option>
                                                ))}
                                            </select>
                                            <button onClick={() => quitarPromocionServicio(servicioPromo.id)} style={styles.deleteButton}>Quitar Promoción</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };
    
    const styles = {
        container: {
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
            maxWidth: '1200px',
            margin: '0 auto',
        },
        title: {
            textAlign: 'center',
            color: '#333',
            marginBottom: '20px',
        },
        subtitle: {
            color: '#555',
            marginBottom: '15px',
        },
        formContainer: {
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        input: {
            width: '100%',
            padding: '10px',
            margin: '10px 0',
            borderRadius: '5px',
            border: '1px solid #ccc',
        },
        textarea: {
            width: '100%',
            padding: '10px',
            margin: '10px 0',
            borderRadius: '5px',
            border: '1px solid #ccc',
            minHeight: '100px',
        },
        select: {
            width: '100%',
            padding: '10px',
            margin: '10px 0',
            borderRadius: '5px',
            border: '1px solid #ccc',
        },
        button: {
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
        },
        tableContainer: {
            marginBottom: '30px',
            overflowX: 'auto',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '20px',
        },
        th: {
            padding: '10px',
            textAlign: 'left',
            borderBottom: '1px solid #ddd',
            backgroundColor: '#f2f2f2',
        },
        td: {
            padding: '10px',
            borderBottom: '1px solid #ddd',
        },
        tr: {
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: '#f1f1f1',
            },
        },
        actionButton: {
            padding: '8px 16px',
            backgroundColor: '#ffc107',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '5px',
        },
        deleteButton: {
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
        },
    };
    
export default Promociones;