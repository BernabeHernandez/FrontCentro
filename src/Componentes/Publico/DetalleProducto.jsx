import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  TextField,
  Divider,
} from "@mui/material";
import { ShoppingCart, ArrowForwardIos } from "@mui/icons-material";
import Swal from "sweetalert2";

const DetalleProducto = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [productosRelacionados, setProductosRelacionados] = useState([]);
  const [cantidad, setCantidad] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch(
          `https://backendcentro.onrender.com/api/productos/${id}`
        );
        if (!response.ok) throw new Error("Error al obtener el producto");
        const data = await response.json();
        setProducto(data);

        // Obtener productos relacionados
        const responseProductos = await fetch(
          `https://backendcentro.onrender.com/api/productos?categoriaId=${data.id_categoria}`
        );
        const productosRelacionadosData = await responseProductos.json();
        setProductosRelacionados(productosRelacionadosData);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchProducto();
  }, [id]);

  if (!producto) return <Typography>Cargando producto...</Typography>;

  const handleCantidadChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) setCantidad(value);
  };

  const handleAgregarAlCarrito = async () => {
    const usuarioId = localStorage.getItem("usuario_id");
    if (!usuarioId) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "https://backendcentro.onrender.com/api/carrito/carrito",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_usuario: usuarioId,
            id_producto: producto.id,
            cantidad,
          }),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Producto agregado al carrito",
          html: `
            <div style="display: flex; gap: 20px; align-items: center;">
              <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;" />
              <div>
                <p><strong>${producto.nombre}</strong></p>
                <p>Cantidad: ${cantidad}</p>
              </div>
            </div>
          `,
          confirmButtonText: "Ir al carrito",
          showCancelButton: true,
          cancelButtonText: "Seguir viendo",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/carrito");
          }
        });
      } else {
        throw new Error("Error al agregar al carrito");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al agregar el producto al carrito. Intenta de nuevo.",
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", p: 2 }}>
      <Grid container spacing={3}>
        {/* Imagen y Detalles */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardMedia
              component="img"
              image={producto.imagen}
              alt={producto.nombre}
              sx={{ height: 300, objectFit: "contain", p: 2 }}
            />
          </Card>
        </Grid>

        {/* Información del producto */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" fontWeight="bold">
            {producto.nombre}
          </Typography>
          <Typography variant="h6" color="error" fontWeight="bold">
            ${producto.precio}
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
            {producto.descripcion}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Stock disponible: {producto.cantidad}
          </Typography>

          {/* Selector de cantidad */}
          <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
            <TextField
              type="number"
              value={cantidad}
              onChange={handleCantidadChange}
              inputProps={{ min: 1 }}
              sx={{ width: 80, mr: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<ShoppingCart />}
              onClick={handleAgregarAlCarrito}
            >
              Agregar al carrito
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Productos Relacionados */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" fontWeight="bold">
          Productos Relacionados
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Grid container spacing={2}>
          {productosRelacionados.slice(0, 3).map((prod) => (
            <Grid item xs={12} sm={6} md={4} key={prod.id}>
              <Card
                sx={{ boxShadow: 2, cursor: "pointer" }}
                onClick={() => navigate(`/detalles/${prod.id}`)}
              >
                <CardMedia
                  component="img"
                  image={prod.imagen}
                  alt={prod.nombre}
                  sx={{ height: 140, objectFit: "contain", p: 2 }}
                />
                <CardContent>
                  <Typography variant="body1" fontWeight="bold">
                    {prod.nombre}
                  </Typography>
                  <Typography variant="body2" color="error">
                    ${prod.precio}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            endIcon={<ArrowForwardIos />}
            onClick={() => navigate("/productos")}
          >
            Ver más productos
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DetalleProducto;
