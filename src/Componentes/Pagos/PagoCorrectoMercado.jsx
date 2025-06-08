import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const PagoCorrectoMercado = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const processPayment = async () => {
      const queryParams = new URLSearchParams(location.search);
      const status = queryParams.get('status');

      if (status !== 'success') {
        Swal.fire({
          title: 'Pago no completado',
          text: 'El pago no se procesó correctamente. Estado: ' + status,
          icon: 'error',
          confirmButtonText: 'Volver al inicio',
          allowOutsideClick: false,
        }).then(() => {
          navigate('/');
        });
        return;
      }

      setProcessing(true);

      try {
        // Depuración: verificar el contenido de localStorage
        const carritoRaw = localStorage.getItem('carrito');
        console.log('Carrito en localStorage:', carritoRaw);

        const carrito = JSON.parse(carritoRaw) || [];
        if (!carrito.length) {
          // Intentar obtener el carrito desde el backend como respaldo
          const id_usuario = localStorage.getItem('usuario_id');
          if (!id_usuario) {
            throw new Error('No se encontró el ID del usuario. Por favor, inicia sesión nuevamente.');
          }

          const responseCarrito = await axios.get(`https://backendcentro.onrender.com/carrito/${id_usuario}`);
          const carritoBackend = responseCarrito.data;
          console.log('Carrito obtenido desde el backend:', carritoBackend);

          if (!carritoBackend.length) {
            throw new Error('No se encontraron productos en el carrito. Por favor, intenta realizar la compra nuevamente.');
          }

          localStorage.setItem('carrito', JSON.stringify(carritoBackend));
          carrito.push(...carritoBackend);
        }

        // Depuración: verificar el formato del carrito
        console.log('Carrito parseado:', carrito);

        // Validar que el carrito tenga los campos necesarios
        const carritoValido = carrito.every(item => item.id && item.cantidad_carrito > 0);
        if (!carritoValido) {
          throw new Error('El carrito contiene datos inválidos (falta id o cantidad_carrito).');
        }

        // Preparar los datos para la ruta /carrito/reducir-inventario
        const productos = carrito.map(item => ({
          id: item.id, // Usar item.id en lugar de item.id_producto
          cantidad: item.cantidad_carrito,
        }));

        console.log('Productos enviados a /carrito/reducir-inventario:', productos);

        // Llamar a la ruta para reducir inventario y registrar la venta
        const response = await axios.put('https://backendcentro.onrender.com/carrito/reducir-inventario', {
          productos,
        });

        // Mostrar mensaje de éxito
        Swal.fire({
          title: '¡Compra exitosa!',
          text: response.data.message,
          icon: 'success',
          confirmButtonText: 'Ir al carrito',
          allowOutsideClick: false,
        }).then(() => {
          // Limpiar el carrito en localStorage
          localStorage.removeItem('carrito');
          navigate('/carrito');
        });
      } catch (error) {
        console.error('Error al procesar la compra:', error);
        Swal.fire({
          title: 'Error',
          text: error.message || 'Ocurrió un error al procesar la compra. Por favor, intenta de nuevo.',
          icon: 'error',
          confirmButtonText: 'Volver al inicio',
          allowOutsideClick: false,
        }).then(() => {
          navigate('/');
        });
      } finally {
        setProcessing(false);
      }
    };

    processPayment();
  }, [navigate, location]);

  return null;
};

export default PagoCorrectoMercado;