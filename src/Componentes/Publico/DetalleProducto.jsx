import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../Navegacion/BreadcrumbsProductos';
import { CheckCircle } from 'react-feather';
import Swal from 'sweetalert2';


const DetalleProducto = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [productosRelacionados, setProductosRelacionados] = useState([]);
  const [mostrarProductos, setMostrarProductos] = useState(3);
  const [cantidad, setCantidad] = useState(1);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const navigate = useNavigate();

  // Declaración de estilos al principio
  const styles = {
    container: {
      padding: '1rem',
      maxWidth: '1100px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#fff',
      borderRadius: '8px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
    },
    leftColumn: {
      flex: 2,
      minWidth: '300px',
    },
    rightColumn: {
      flex: 1,
      minWidth: '250px',
      borderLeft: '1px solid #ddd',
      paddingLeft: '20px',
    },
    imagenContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      maxHeight: '300px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      overflow: 'hidden',
    },
    imagen: {
      maxWidth: '14%',
      maxHeight: '14%',
   
    },
    titulo: {
      fontSize: '22px',
      fontWeight: 'bold',
      margin: '16px 0',
      color: '#333',
      textAlign: 'start',
    },
    descripcion: {
      fontSize: '16px',
      color: '#555',
      marginBottom: '16px',
      lineHeight: '1.6',
    },
    precio: {
      fontSize: '20px',
      color: '#d32f2f',
      fontWeight: 'bold',
      textAlign: 'start',
    },
    detalles: {
      fontSize: '16px',
      color: '#333',
      marginBottom: '16px',
      textAlign: 'start',
    },
    boton: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '18px',
      transition: 'background-color 0.3s',
      textAlign: 'center',
      maxWidth: '200px',
    },
    botonHover: {
      backgroundColor: '#0056b3',
    },
    cantidadContainer: {
      display: 'flex',
      alignItems: 'center',
      margin: '16px 0',
    },
    cantidadSelector: {
      width: '60px',
      padding: '8px',
      fontSize: '16px',
      textAlign: 'center',
      marginRight: '10px',
      borderRadius: '5px',
      border: '1px solid #ddd',
    },
    cantidadInput: {
      width: '60px',
      padding: '8px',
      fontSize: '16px',
      textAlign: 'center',
      marginRight: '10px',
      borderRadius: '5px',
      border: '1px solid #ddd',
      display: cantidad > 5 ? 'inline-block' : 'none',
    },
    productosRelacionadosContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    productoRelacionado: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '12px',
      cursor: 'pointer',
      borderBottom: '1px solid #ddd',
      paddingBottom: '8px',
    },
    productoImagen: {
      width: '60px',
      height: '60px',
      marginRight: '10px',
      borderRadius: '8px',
      objectFit: 'contain',
    },
    flecha: {
      cursor: 'pointer',
      fontSize: '16px',
      color: '#007bff',
      marginTop: '10px',
      textAlign: 'center',
    },
    confirmacionContainer: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      textAlign: 'center',
      width: '450px', // Aumenté el ancho del recuadro
    },
    confirmacionHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      marginBottom: '20px',
    },
    confirmacionIcono: {
      color: '#28a745',
    },
    confirmacionProducto: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      marginBottom: '20px',
    },
    confirmacionImagen: {
      width: '120px', // Aumenté el tamaño de la imagen
      height: '120px',
      objectFit: 'cover',
      borderRadius: '8px',
    },
    confirmacionInfo: {
      textAlign: 'left',
    },
    confirmacionNombre: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333',
    },
    confirmacionCantidad: {
      fontSize: '14px',
      color: '#555',
    },
    confirmacionPrecio: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#d32f2f',
    },
    confirmacionAcciones: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    confirmacionBoton: {
      padding: '10px 20px',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
    },
    continuarCompra: {
      backgroundColor: '#007bff',
      color: '#fff',
    },
    seguirViendo: {
      backgroundColor: 'transparent',
      color: '#007bff',
      textDecoration: 'underline',
    },
  };

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch(`https://backendcentro.onrender.com/api/productos/${id}`);
        if (!response.ok) {
          throw new Error('Error al obtener el producto');
        }
        const data = await response.json();
        setProducto(data);

        const categoriaId = data.id_categoria;
        const responseProductos = await fetch(`https://backendcentro.onrender.com/api/productos?categoriaId=${categoriaId}`);
        const productosRelacionadosData = await responseProductos.json();
        setProductosRelacionados(productosRelacionadosData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchProducto();
  }, [id]);

  if (!producto) {
    return <p>Cargando producto...</p>;
  }

  const handleCantidadChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setCantidad(value);
    }
  };

  const handleAgregarAlCarrito = async () => {
    const usuarioId = localStorage.getItem('usuario_id');
    if (!usuarioId) {
      navigate('/login');
      return;
    }
  
    try {
      const response = await fetch('https://backendcentro.onrender.com/api/carrito/carrito', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: usuarioId,
          id_producto: producto.id,
          cantidad,
        }),
      });
  
      if (response.ok) {
        // Mostrar la confirmación con SweetAlert2
        Swal.fire({
          icon: 'success',
          title: 'Producto agregado al carrito',
          html: `
            <div style="display: flex; gap: 20px; align-items: center;">
              <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;" />
              <div>
                <p><strong>${producto.nombre}</strong></p>
                <p>Cantidad: ${cantidad}</p>
              </div>
            </div>
          `,
          confirmButtonText: 'Ir al carrito',
          showCancelButton: true,
          cancelButtonText: 'Seguir viendo', // Añadido el botón 'Seguir viendo'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/carrito');
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.close(); // Cerrar el Swal al hacer clic en 'Seguir viendo'
          }
        });
      } else {
        const errorData = await response.json();
        if (errorData.error && errorData.error === 'Cantidad solicitada excede el stock disponible') {
          Swal.fire({
            icon: 'error',
            title: 'Stock insuficiente',
            text: `Solo hay ${errorData.stockDisponible} unidades disponibles.`, // Usar stockDisponible de la respuesta
          });
        } else {
          throw new Error('Error al agregar al carrito');
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al agregar el producto al carrito. Intenta de nuevo.',
      });
    }
  };
  
  

  const descripcionSeparada = producto.descripcion.split('.').map((parrafo, index) => (
    <p key={index} style={styles.descripcion}>{parrafo.trim()}.</p>
  ));

  const mostrarMasProductos = () => {
    setMostrarProductos(mostrarProductos + 3);
  };

  const mostrarMenosProductos = () => {
    setMostrarProductos(mostrarProductos - 3);
  };

  const manejarProductoRelacionadoClick = (idProducto) => {
    navigate(`/detalles/${idProducto}`);
  };

  return (
    <div>
      <Breadcrumbs />
      <div style={styles.container}>
        <div style={styles.leftColumn}>
          <div style={styles.imagenContainer}>
            <img src={producto.imagen} alt={producto.nombre} style={styles.imagen} />
          </div>
          <h1 style={styles.titulo}>{producto.nombre}</h1>
          <p><strong>Descripción:</strong></p>
          {descripcionSeparada}
          <p style={styles.precio}>Precio: ${producto.precio}</p>
          <div style={styles.detalles}>
            <p>Stock: {producto.cantidad}</p>
            <p>Descuento: {producto.descuento || 'Sin descuento'}</p>
          </div>
          
          <div style={styles.cantidadContainer}>
            <select 
              style={styles.cantidadSelector} 
              value={cantidad} 
              onChange={(e) => setCantidad(parseInt(e.target.value))}
            >
              {[...Array(6).keys()].map(i => (
                <option key={i} value={i + 1}>{i + 1}</option>
              ))}
            </select>
            {cantidad > 5 && (
              <input
                style={styles.cantidadInput}
                type="number"
                value={cantidad}
                onChange={handleCantidadChange}
                min="1"
              />
            )}
          </div>
          <button
            style={styles.boton}
            onMouseOver={(e) => e.target.style.backgroundColor = styles.botonHover.backgroundColor}
            onMouseOut={(e) => e.target.style.backgroundColor = styles.boton.backgroundColor}
            onClick={handleAgregarAlCarrito}
          >
            Agregar al carrito
          </button>
        </div>

        <div style={styles.rightColumn}>
          <h2>Productos Relacionados</h2>
          <div style={styles.productosRelacionadosContainer}>
            {productosRelacionados.slice(0, mostrarProductos).map((prod) => (
              <div key={prod.id} style={styles.productoRelacionado} onClick={() => manejarProductoRelacionadoClick(prod.id)}>
                <img src={prod.imagen} alt={prod.nombre} style={styles.productoImagen} />
                <p>{prod.nombre}</p>
              </div>
            ))}
          </div>
          {mostrarProductos < productosRelacionados.length && (
            <span style={styles.flecha} onClick={mostrarMasProductos}>➡️ Mostrar más</span>
          )}
          {mostrarProductos > 3 && (
            <span style={styles.flecha} onClick={mostrarMenosProductos}>⬅️ Mostrar menos</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;