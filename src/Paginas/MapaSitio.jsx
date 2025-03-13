import React, { useState } from 'react';
import mapaClaro from '../Componentes/Imagenes/MapWhite.png'; 
import mapaOscuro from '../Componentes/Imagenes/MapBlack.png';

const MapaSitio = () => {
  const [modoOscuro, setModoOscuro] = useState(false);

  const toggleModoOscuro = () => {
    setModoOscuro(!modoOscuro);
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  };

  const imagenContainerStyle = {
    backgroundColor: modoOscuro ? 'black' : 'transparent', 
    padding: modoOscuro ? '10px' : '0', 
    borderRadius: '10px',
  };

  const imagenStyle = {
    width: '100%',
  height: 'auto',
  borderRadius: '10px',
  transition: 'all 0.3s ease',
  objectFit: 'cover',
  };

  const botonStyle = {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  };

  const botonHoverStyle = {
    ...botonStyle,
    backgroundColor: '#0056b3',
  };

  return (
    <div style={containerStyle}>
      <div style={imagenContainerStyle}>
        <img
          src={modoOscuro ? mapaOscuro : mapaClaro}
          alt="Mapa del Sitio"
          style={imagenStyle}
        />
      </div>

      <button
        style={botonStyle}
        onClick={toggleModoOscuro}
        onMouseEnter={(e) => e.target.style.backgroundColor = botonHoverStyle.backgroundColor}
        onMouseLeave={(e) => e.target.style.backgroundColor = botonStyle.backgroundColor}
      >
        Cambiar a {modoOscuro ? 'modo claro' : 'modo oscuro'}
      </button>
    </div>
  );
};

export default MapaSitio;
