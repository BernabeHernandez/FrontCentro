import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Grid,
  Paper,
  Divider,
  Chip,
  Fade,
  Zoom,
  Container,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const Carrito = () => {
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarrito = async () => {
      try {
        const usuarioId = localStorage.getItem('usuario_id');
        if (!usuarioId) {
          Swal.fire({
            icon: 'warning',
            title: 'Sesión requerida',
            text: 'Inicia sesión para ver tu carrito',
            confirmButtonColor: '#1976d2',
          });
          return;
        }

        const response = await fetch(`https://backendcentro.onrender.com/api/carrito/carrito/${usuarioId}`);
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const textResponse = await response.text();
        console.log('Respuesta de la API:', textResponse);

        const data = JSON.parse(textResponse);
        const datosValidos = data.map(item => ({
          ...item,
          subtotal: item.subtotal ?? item.precio_carrito * item.cantidad_carrito ?? 0,
          precio_carrito: item.precio_carrito ?? item.precio ?? 0,
        }));
        setCarrito(datosValidos);
        calcularTotal(datosValidos);
      } catch (error) {
        console.error('Error al obtener o analizar la respuesta:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al obtener el carrito. Por favor, intenta de nuevo.',
          confirmButtonColor: '#d32f2f',
        });
      } finally {
        setLoading(false);
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
        background: '#ffffff',
        toast: true,
        position: 'top-end',
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
          title: '¡Actualizado!',
          text: 'Cantidad actualizada correctamente',
          timer: 1200,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
          background: '#4caf50',
          color: 'white',
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
    const result = await Swal.fire({
      title: '¿Eliminar producto?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#757575',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#ffffff',
      customClass: {
        popup: 'modern-popup',
      },
    });

    if (!result.isConfirmed) return;

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
          title: '¡Eliminado!',
          text: 'Producto eliminado del carrito',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
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
        text: 'Añade productos antes de continuar',
        confirmButtonColor: '#ff9800',
      });
      return;
    }

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
          html: `No hay suficiente stock de "<strong>${item.nombre}</strong>".<br/>
                 Solo quedan <strong>${producto.cantidad}</strong> unidades disponibles.<br/>
                 Has intentado comprar <strong>${item.cantidad_carrito}</strong> unidades.`,
          confirmButtonColor: '#d32f2f',
        });
        return;
      }
    }

    navigate('/cliente/metodo', { state: { carrito, total } });
  };

  const calcularDiasTranscurridos = (fechaAgregado) => {
    if (!fechaAgregado) return 0;
    const fecha = new Date(fechaAgregado);
    const ahora = new Date();
    const diferencia = ahora - fecha;
    return Math.floor(diferencia / (1000 * 60 * 60 * 24));
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(precio || 0);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography variant="h6" color="text.secondary">
          Cargando carrito...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh', py: 4 }}>
      <Container sx={{ maxWidth: '1400px !important', width: '100%' }}>
        <Fade in timeout={600}>
          <Box sx={{ mb: 4, textAlign: 'left' }}>
            <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
              Mi Carrito
            </Typography>
          </Box>
        </Fade>

        {carrito.length === 0 ? (
          <Zoom in timeout={800}>
            <Paper
              elevation={0}
              sx={{
                p: 6,
                textAlign: 'center',
                borderRadius: 3,
                background: 'white',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              }}
            >
              <CartIcon sx={{ fontSize: 80, color: '#e0e0e0', mb: 2 }} />
              <Typography variant="h5" color="text.secondary" gutterBottom>
                Tu carrito está vacío
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                ¡Explora nuestros productos y encuentra algo que te guste!
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/cliente/productos')}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                Ir de compras
              </Button>
            </Paper>
          </Zoom>
        ) : (
          <Grid container spacing={7}>
            <Grid item xs={12} lg={8}>
              {carrito.map((item, index) => {
                const diasTranscurridos = calcularDiasTranscurridos(item.fecha_agregado);
                return (
                  <Fade in timeout={600 + index * 100} key={item.id}>
                    <Paper
                      elevation={0}
                      sx={{
                        mb: 3,
                        borderRadius: 3,
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 140,
                              height: 140,
                              borderRadius: 2,
                              overflow: 'hidden',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative',
                            }}
                          >
                            <img
                              src={item.imagen}
                              alt={item.nombre}
                              style={{
                                width: '80%',
                                height: '80%',
                                objectFit: 'contain',
                                borderRadius: 8,
                              }}
                            />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography variant="body1" fontWeight="600" color="text.primary">
                                {item.nombre}
                              </Typography>
                              <IconButton
                                onClick={() => eliminarProducto(item.id)}
                                sx={{
                                  color: '#d32f2f',
                                  '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.1)', transform: 'scale(1.1)' },
                                  transition: 'all 0.2s',
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                              <Chip
                                icon={<CheckIcon />}
                                label={item.estado || 'Activo'}
                                size="small"
                                color="success"
                                variant="outlined"
                              />
                              {diasTranscurridos >= 5 && item.estado === 'activo' && (
                                <Chip
                                  icon={<WarningIcon />}
                                  label={`Se elimina en ${7 - diasTranscurridos} días`}
                                  size="small"
                                  color="warning"
                                  variant="filled"
                                />
                              )}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                Cantidad:
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f5f5f5', borderRadius: 2, p: 0.5 }}>
                                <IconButton
                                  size="small"
                                  onClick={() => actualizarCantidad(item.id, item.cantidad_carrito - 1)}
                                  sx={{ width: 32, height: 32, '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.1)' } }}
                                >
                                  <RemoveIcon fontSize="small" />
                                </IconButton>
                                <Typography variant="h6" sx={{ mx: 2, minWidth: 24, textAlign: 'center', fontWeight: 'bold' }}>
                                  {item.cantidad_carrito || 0}
                                </Typography>
                                <IconButton
                                  size="small"
                                  onClick={() => actualizarCantidad(item.id, item.cantidad_carrito + 1)}
                                  sx={{ width: 32, height: 32, '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.1)' } }}
                                >
                                  <AddIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  Precio unitario
                                </Typography>
                                <Typography variant="body1" color="primary" fontWeight="bold">
                                  {formatearPrecio(item.precio_carrito || item.precio)}
                                </Typography>
                              </Box>
                              <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="body2" color="text.secondary">
                                  Subtotal
                                </Typography>
                                <Typography variant="body1" fontWeight="bold" color="success.main">
                                  {formatearPrecio(item.subtotal || (item.precio_carrito || item.precio || 0) * item.cantidad_carrito)}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Paper>
                  </Fade>
                );
              })}
            </Grid>
            <Grid item xs={12} lg={4}>
              <Fade in timeout={1000}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    position: 'sticky',
                    top: 20,
                    background: 'white',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                    Resumen del pedido
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body1">Productos ({carrito.length})</Typography>
                      <Typography variant="body1">{formatearPrecio(total)}</Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                      <Typography variant="body1" fontWeight="bold">Total</Typography>
                      <Typography variant="body1" fontWeight="bold" color="primary">
                        {formatearPrecio(total)}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={realizarCompra}
                    sx={{
                      background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                      py: 1,
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      boxShadow: '0 8px 20px rgba(76, 175, 80, 0.3)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 25px rgba(76, 175, 80, 0.4)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Proceder al pago
                  </Button>
                </Paper>
              </Fade>
            </Grid>
          </Grid>
        )}
      </Container>

      <style jsx global>{`
        .modern-popup {
          border-radius: 16px !important;
        }
      `}</style>
    </Box>
  );
};

export default Carrito;