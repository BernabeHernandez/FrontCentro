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
        // Obtener el carrito desde localStorage
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        if (!carrito.length) {
          throw new Error('No se encontraron productos en el carrito.');
        }

        // Preparar los datos para la ruta /carrito/reducir-inventario
        const productos = carrito.map(item => ({
          id: item.id_producto,
          cantidad: item.cantidad_carrito,
        }));

        // Llamar a la ruta para reducir inventario y registrar la venta
        const response = await axios.put('https://backendcentro.onrender.com/carrito/carrito/reducir-inventario', {
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

          navigate('/carrito');
        });
      } catch (error) {
        console.error('Error al procesar la compra:', error);
        Swal.fire({
          title: 'Error',
          text: error.response?.data?.message || 'Ocurrió un error al procesar la compra.',
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