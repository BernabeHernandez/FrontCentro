import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Button, Card, CardContent, Typography, Box, IconButton, Grid } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

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
        // Verificar que los datos tengan las propiedades esperadas
        const datosValidos = data.map(item => ({
          ...item,
          subtotal: item.subtotal ?? item.precio_carrito * item.cantidad_carrito ?? 0, // Calcular subtotal si no está definido
          precio_carrito: item.precio_carrito ?? item.precio ?? 0, // Usar precio si precio_carrito no está definido
        }));
        setCarrito(datosValidos);
        calcularTotal(datosValidos);
      } catch (error) {
        console.error('Error al obtener o analizar la respuesta:', error);
        alert('Hubo un error al obtener el carrito. Por favor, intenta de nuevo.');
      }
    };

    fetchCarrito();
  }, []);

  const calcularTotal = (carrito) => {
    const totalCalculado = carrito.reduce((acc, item) => acc + (item.subtotal || item.precio_carrito * item.cantidad_carrito || 0), 0);
    setTotal(totalCalculado);
  };

  const actualizarCantidad = async (id_producto, nuevaCantidad) => {
    const usuarioId = localStorage.getItem('usuario_id');
    if (nuevaCantidad < 1) {
      Swal.fire({
        icon: 'error',
        title: 'Cantidad no válida',
        text: 'La cantidad no puede ser menor a 1.',
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const response = await fetch('https://backendcentro.onrender.com/api/carrito/carrito', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: usuarioId, id_producto, cantidad: nuevaCantidad }),
      });

      if (response.ok) {
        const nuevoCarrito = carrito.map(item =>
          item.id === id_producto
            ? { ...item, cantidad_carrito: nuevaCantidad, subtotal: (item.precio_carrito || 0) * nuevaCantidad }
            : item
        );
        setCarrito(nuevoCarrito);
        calcularTotal(nuevoCarrito);
        Swal.fire({
          icon: 'success',
          title: 'Cantidad actualizada',
          text: 'La cantidad del producto se ha actualizado correctamente.',
          timer: 600,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: 'Hubo un problema al actualizar la cantidad del producto.',
          timer: 600,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error('Error al actualizar la cantidad:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar la cantidad debido a un error.',
        timer: 600,
        showConfirmButton: false,
      });
    }
  };

  const eliminarProducto = async (id_producto) => {
    const usuarioId = localStorage.getItem('usuario_id');
    try {
      const response = await fetch('https://backendcentro.onrender.com/api/carrito/carrito', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: usuarioId, id_producto }),
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
        body: JSON.stringify({ productos: carrito.map(item => ({ id: item.id, cantidad: item.cantidad_carrito })) }),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Compra realizada con éxito',
          text: 'Tu compra ha sido procesada correctamente.',
          timer: 1500,
          showConfirmButton: false,
        });
        setCarrito([]); // Limpiar el carrito después de la compra
        setTotal(0);
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

  // Calcular días transcurridos desde que se agregó el producto
  const calcularDiasTranscurridos = (fechaAgregado) => {
    if (!fechaAgregado) return 0;
    const fecha = new Date(fechaAgregado);
    const ahora = new Date();
    const diferencia = ahora - fecha;
    return Math.floor(diferencia / (1000 * 60 * 60 * 24));
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Mi Carrito
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <Typography variant="h6">Agregados ({carrito.length})</Typography>
        <Typography variant="h6">Guardados (0)</Typography>
      </Box>

      {carrito.length === 0 ? (
        <Typography variant="body1" color="textSecondary" align="center">
          Tu carrito está vacío
        </Typography>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            {carrito.map((item) => {
              const diasTranscurridos = calcularDiasTranscurridos(item.fecha_agregado);
              return (
                <Card key={item.id} sx={{ marginBottom: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box
                        sx={{
                          width: 120,
                          height: 120,
                          overflow: 'hidden',
                          borderRadius: 1,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          style={{
                            width: '50%',
                            height: '100%',
                          }}
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6">{item.nombre}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Estado: {item.estado || 'Desconocido'}
                        </Typography>
                        {diasTranscurridos >= 5 && item.estado === 'activo' && (
                          <Typography variant="body2" color="error">
                            Este producto será eliminado en {7 - diasTranscurridos} días.
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center', marginY: 1 }}>
                          <IconButton onClick={() => actualizarCantidad(item.id, item.cantidad_carrito - 1)}>
                            <RemoveIcon />
                          </IconButton>
                          <Typography variant="body1">{item.cantidad_carrito || 0}</Typography>
                          <IconButton onClick={() => actualizarCantidad(item.id, item.cantidad_carrito + 1)}>
                            <AddIcon />
                          </IconButton>
                        </Box>
                        <Typography variant="body1">
                          Precio unitario: ${(item.precio_carrito || item.precio || 0).toFixed(2)}
                        </Typography>
                        <Typography variant="body1">
                          Subtotal: ${(item.subtotal || (item.precio_carrito || item.precio || 0) * item.cantidad_carrito || 0).toFixed(2)}
                        </Typography>
                        <Button
                          onClick={() => eliminarProducto(item.id)}
                          color="error"
                          startIcon={<DeleteIcon />}
                        >
                          Eliminar
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ padding: 2 }}>
              <Typography variant="h6" gutterBottom>
                Resumen
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <Typography variant="body1">Total</Typography>
                <Typography variant="body1">${(total || 0).toFixed(2)}</Typography>
              </Box>
              <Button variant="contained" color="primary" fullWidth onClick={realizarCompra}>
                Realizar compra
              </Button>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Carrito;