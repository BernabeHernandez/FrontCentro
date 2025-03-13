import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const Carrito = () => {
    const [carrito, setCarrito] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchCarrito = async () => {
            try {
                const usuarioId = localStorage.getItem('usuario_id');
                if (!usuarioId) {
                    alert('Inicia sesión para ver tu carrito');
                    return;
                }

                const response = await fetch(`https://backendcentro.onrender.com/api/carrito/carrito/${usuarioId}`);
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.statusText}`);
                }

                const textResponse = await response.text();
                console.log('Respuesta de la API:', textResponse);

                const data = JSON.parse(textResponse);
                setCarrito(data);
                calcularTotal(data);
            } catch (error) {
                console.error("Error al obtener o analizar la respuesta:", error);
                alert('Hubo un error al obtener el carrito. Por favor, intenta de nuevo.');
            }
        };

        fetchCarrito();
    }, []);

    const calcularTotal = (carrito) => {
        const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad_carrito), 0);
        setTotal(total);
    };

    const actualizarCantidad = async (id_producto, nuevaCantidad) => {
        const usuarioId = localStorage.getItem('usuario_id');
        if (nuevaCantidad < 1) {
            Swal.fire({
                icon: 'error',
                title: 'Cantidad no válida',
                text: 'La cantidad no puede ser menor a 1.',
                timer: 1500, // Se cierra automáticamente después de 2 segundos
                showConfirmButton: false, // Elimina el botón de OK
            });
            return;
        }
    
        try {
            const response = await fetch('https://backendcentro.onrender.com/api/carrito/carrito', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_usuario: usuarioId, id_producto, cantidad: nuevaCantidad })
            });
    
            if (response.ok) {
                const nuevoCarrito = carrito.map(item =>
                    item.id === id_producto ? { ...item, cantidad_carrito: nuevaCantidad } : item
                );
                setCarrito(nuevoCarrito);
                calcularTotal(nuevoCarrito);
                Swal.fire({
                    icon: 'success',
                    title: 'Cantidad actualizada',
                    text: 'La cantidad del producto se ha actualizado correctamente.',
                    timer: 600, // Se cierra automáticamente después de 2 segundos
                    showConfirmButton: false, // Elimina el botón de OK
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar',
                    text: 'Hubo un problema al actualizar la cantidad del producto.',
                    timer: 600, // Se cierra automáticamente después de 2 segundos
                    showConfirmButton: false, // Elimina el botón de OK
                });
            }
        } catch (error) {
            console.error('Error al actualizar la cantidad:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar la cantidad debido a un error.',
                timer: 600, // Se cierra automáticamente después de 2 segundos
                showConfirmButton: false, // Elimina el botón de OK
            });
        }
    };
    
    

    const eliminarProducto = async (id_producto) => {
        const usuarioId = localStorage.getItem('usuario_id');
        try {
            const response = await fetch('https://backendcentro.onrender.com/api/carrito/carrito', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_usuario: usuarioId, id_producto })
            });
    
            if (response.ok) {
                const nuevoCarrito = carrito.filter(item => item.id !== id_producto);
                setCarrito(nuevoCarrito);
                calcularTotal(nuevoCarrito);
                Swal.fire({
                    icon: 'success',
                    title: 'Producto eliminado',
                    text: 'El producto ha sido eliminado del carrito.',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al eliminar el producto del carrito.',
                });
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al eliminar',
                text: 'No se pudo eliminar el producto debido a un error.',
            });
        }
    };
    

    const realizarCompra = async () => {
        if (carrito.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Carrito vacío',
                text: 'El carrito está vacío. Añade productos antes de continuar.',
            });
            return;
        }
    
        // Verificar si alguna cantidad sobrepasa el stock disponible
        for (let item of carrito) {
            const responseStock = await fetch(`https://backendcentro.onrender.com/api/productos/${item.id}`);
            if (!responseStock.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al verificar el stock',
                    text: 'Hubo un error al verificar el stock del producto.',
                });
                return;
            }
    
            const producto = await responseStock.json();
            if (item.cantidad_carrito > producto.cantidad) {
                Swal.fire({
                    icon: 'error',
                    title: '¡Stock insuficiente!',
                    html: `No hay suficiente stock de "<strong>${item.nombre}</strong>". Solo quedan <strong>${producto.cantidad}</strong> unidades disponibles. Has intentado comprar <strong>${item.cantidad_carrito}</strong> unidades.`,
                });                
                return;
            }
        }
    
        // Si todo está bien, proceder con la compra
        try {
            const response = await fetch('https://backendcentro.onrender.com/api/carrito/carrito/reducir-inventario', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productos: carrito.map(item => ({ id: item.id, cantidad: item.cantidad_carrito })) })
            });
    
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Compra realizada con éxito',
                    text: 'Tu compra ha sido procesada correctamente.',
                    timer: 1500, // Se cierra automáticamente después de 1.5 segundos
                    showConfirmButton: false, // Elimina el botón de OK
                });
            } else {
                const errorData = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Error al procesar la compra',
                    text: errorData.message || 'Hubo un error al actualizar el inventario.',
                });
            }
        } catch (error) {
            console.error('Error al realizar la compra:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al procesar la compra. Intenta nuevamente.',
            });
        }
    };
    
    return (
        <div className="carrito-container">
            <h1 className="titulo">Mi Carrito</h1>
            <div className="carrito-header">
                <span className="agregados">Agregados ({carrito.length})</span>
                <span className="guardados">Guardados (0)</span>
            </div>

            {carrito.length === 0 ? (
                <p className="carrito-vacio">Tu carrito está vacío</p>
            ) : (
                <div className="carrito-content">
                    <div className="productos-lista">
                        {carrito.map((item) => (
                            <div key={item.id} className="producto-item">
                                <h3 className="producto-nombre">{item.nombre}</h3>
                                <div className="producto-detalle">
                                    <div className="imagen-contenedor">
                                        <img src={item.imagen} alt={item.nombre} className="producto-imagen" />
                                    </div>
                                    <div className="producto-info">
                                        <div className="producto-cantidad">
                                            <p>Cantidad:</p>
                                            <button 
                                                onClick={() => actualizarCantidad(item.id, item.cantidad_carrito - 1)}
                                                className="btn-cantidad"
                                            >
                                                -
                                            </button>
                                            <span>{item.cantidad_carrito}</span>
                                            <button 
                                                onClick={() => actualizarCantidad(item.id, item.cantidad_carrito + 1)}
                                                className="btn-cantidad"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="precio-info">
                                            <p>Precio:</p>
                                            <p className="precio-actual">${item.precio.toFixed(2)}</p>
                                            <p className="precio-anterior">${(item.precio * 1.1).toFixed(2)}</p>
                                        </div>
                                        <div className="producto-acciones">
                                            <button 
                                                onClick={() => eliminarProducto(item.id)} 
                                                className="btn-eliminar"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="resumen-compra">
                        <h3>Resumen de compra</h3>
                        <div className="resumen-detalle">
                            <p>Subtotal ({carrito.length} productos):</p>
                            <p>${total.toFixed(2)}</p>
                        </div>
                        <div className="resumen-total">
                            <p>Total:</p>
                            <p>${total.toFixed(2)}</p>
                        </div>
                        <button onClick={realizarCompra} className="btn-continuar">
                            Continuar
                        </button>
                    </div>
                </div>
            )}

            <style>
                {`
                .carrito-container {
                    padding: 20px;
                    background-color: #f9f9f9;
                    min-height: 100vh;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .titulo {
                    font-size: 2rem;
                    margin-bottom: 20px;
                    color: #333;
                    font-weight: bold;
                }

                .carrito-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                    font-size: 1.1rem;
                    color: #555;
                }

                .carrito-vacio {
                    text-align: center;
                    color: #777;
                    font-size: 1.2rem;
                }

                .carrito-content {
                    display: flex;
                    gap: 20px;
                }

                .productos-lista {
                    flex: 2;
                }

                .producto-item {
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    margin-bottom: 20px;
                }

                .producto-nombre {
                    font-size: 1.2rem;
                    color: #333;
                    margin-bottom: 10px;
                }

                .producto-detalle {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .imagen-contenedor {
                    width: 120px;
                    height: 120px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    overflow: hidden;
                }

                .producto-imagen {
                    width: 40%;
                    height: 90%;
                   
                }

                .producto-info {
                    flex: 1;
                }

                .producto-cantidad {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 10px;
                }

                .producto-cantidad p {
                    margin: 0;
                    font-size: 0.9rem;
                    color: #555;
                }

                .btn-cantidad {
                    background-color: #1dd1a1;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 5px;
                    cursor: pointer;
                }

                .precio-info {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 10px;
                }

                .precio-info p {
                    margin: 0;
                    font-size: 0.9rem;
                    color: #555;
                }

                .precio-actual {
                    font-size: 1.1rem;
                    color: #333;
                    font-weight: bold;
                }

                .precio-anterior {
                    font-size: 0.9rem;
                    color: #777;
                    text-decoration: line-through;
                }

                .producto-acciones {
                    display: flex;
                    gap: 10px;
                }

                .btn-eliminar {
                    background-color: #ff6b6b;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 5px;
                    cursor: pointer;
                }

                .resumen-compra {
                    flex: 1;
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

                .resumen-compra h3 {
                    font-size: 1.2rem;
                    color: #333;
                    margin-bottom: 10px;
                }

                .resumen-detalle {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                    font-size: 0.9rem;
                    color: #555;
                }

                .resumen-total {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 10px;
                    font-size: 1.1rem;
                    color: #333;
                    font-weight: bold;
                }

                .btn-continuar {
                    background-color: #3498db;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 5px;
                    cursor: pointer;
                    width: 100%;
                    font-size: 1.2rem;
                    margin-top: 10px;
                }

                /* Responsividad */
                @media (max-width: 768px) {
                    .carrito-content {
                        flex-direction: column;
                    }

                    .resumen-compra {
                        order: -1;
                    }
                }
                `}
            </style>
        </div>
    );
};

export default Carrito;