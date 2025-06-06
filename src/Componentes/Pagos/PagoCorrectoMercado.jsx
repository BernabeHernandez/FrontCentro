import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';

const PagoCorrectoMercado = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get('status');

    if (status === 'success') {
      Swal.fire({
        title: '¡Pago exitoso!',
        text: 'Tu pago se completó correctamente.',
        icon: 'success',
        confirmButtonText: 'Ir al carrito',
        allowOutsideClick: false,
      }).then(() => {
        navigate('/carrito');
      });
    } else {
      navigate('/'); // O redirige a otra página si el estado no es success
    }
  }, [navigate, location]);

  return null;
};

export default PagoCorrectoMercado;
