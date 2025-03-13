import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faStoreAlt, faBank, faCashRegister } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../Navegacion/BreadcrumbsProductos';

const OpcionPago = () => {
  const { id } = useParams();
  const [metodoPago, setMetodoPago] = useState(null);

  const handleSeleccionarMetodo = (metodo) => {
    setMetodoPago(metodo);
  };

  const styles = {
    container: {
      padding: '3rem',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
    },
    titulo: {
      fontSize: '32px',
      fontWeight: '700',
      marginBottom: '20px',
      color: '#333',
    },
    descripcion: {
      fontSize: '18px',
      color: '#555',
      marginBottom: '40px',
    },
    opciones: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
      justifyItems: 'center',
    },
    tarjeta: {
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      textAlign: 'center',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer',
      width: '280px', // Establecer un ancho fijo para que las tarjetas tengan el mismo tamaño
      height: '150px', // Altura fija
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    tarjetaHover: {
      transform: 'scale(1.05)',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    },
    icono: {
      fontSize: '40px',
      marginBottom: '20px',
      color: '#007bff',
    },
    texto: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#333',
    },
    mensaje: {
      marginTop: '30px',
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#28a745',
    },
    mensajeHidden: {
      opacity: 0,
    },
  };

  const iconos = {
    OXXO: faStoreAlt,
    'Nueva tarjeta de crédito': faCreditCard,
    'Nueva tarjeta de débito': faCreditCard,
    'Transferencia SPEI': faBank,
    'Efectivo en puntos de pago': faCashRegister,
  };

  return (
    <div>
      <Breadcrumbs />
    
      <div style={styles.container}>
        <h1 style={styles.titulo}>Elige tu método de pago</h1>
        <p style={styles.descripcion}>
          Selecciona uno de los métodos de pago disponibles para completar tu compra.
        </p>

        <div style={styles.opciones}>
          {['OXXO', 'Nueva tarjeta de crédito', 'Nueva tarjeta de débito', 'Transferencia SPEI', 'Efectivo en puntos de pago'].map((metodo) => (
            <div
              key={metodo}
              style={{
                ...styles.tarjeta,
                ...(metodo === metodoPago ? styles.tarjetaHover : {}),
              }}
              onClick={() => handleSeleccionarMetodo(metodo)}
            >
              <FontAwesomeIcon icon={iconos[metodo]} style={styles.icono} />
              <p style={styles.texto}>{metodo}</p>
            </div>
          ))}
        </div>

        <div style={{ ...styles.mensaje, ...(metodoPago ? {} : styles.mensajeHidden) }}>
          Has seleccionado: <strong>{metodoPago}</strong>. ¡Procede con tu pago!
        </div>
      </div>
    </div>
  );
};

export default OpcionPago;
