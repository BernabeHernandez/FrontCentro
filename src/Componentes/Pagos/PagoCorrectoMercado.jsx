import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';

const PagoCorrectoMercado = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get('status');

    const carrito = location.state?.carrito || JSON.parse(localStorage.getItem('carrito')) || [];

    const registrarVenta = async () => {
      try {
        const response = await fetch('https://backendcentro.onrender.com/api/carrito/reducir-inventario', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productos: carrito }), // 💡 Este nombre debe coincidir con el esperado en el backend
        });

        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(errorBody.message || 'Error al registrar la venta');
        }

      } catch (error) {
        console.error('Error al registrar venta:', error);
      }
    };

    if (status === 'success') {
      registrarVenta().finally(() => {
        Swal.fire({
          title: '¡Pago exitoso!',
          text: 'Tu pago se completó correctamente.',
          icon: 'success',
          confirmButtonText: 'Ir al carrito',
          allowOutsideClick: false,
        }).then(() => {
          navigate('/carrito');
        });
      });
    } else {
      navigate('/');
    }
  }, [navigate, location]);

  return null;
};

export default PagoCorrectoMercado;
