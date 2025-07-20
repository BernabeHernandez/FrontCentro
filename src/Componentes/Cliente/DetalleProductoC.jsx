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
  Chip,
  Rating,
  Fade,
  Skeleton,
  Container,
  Paper,
  IconButton,
} from "@mui/material";
import {
  ShoppingCart,
  ArrowForwardIos,
  Add,
  Remove,
  Inventory,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Carousel from "react-material-ui-carousel";
import Swal from "sweetalert2";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 10,
  overflow: "hidden",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[6],
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  boxShadow: `0 4px 20px rgba(0, 0, 0, 0.05)`,
  background: "linear-gradient(145deg, #ffffff 0%, #f5f7fa 100%)",
  border: "1px solid #e0e4e8",
}));

const StyledStockChip = styled(Chip)(({ theme, available }) => ({
  borderRadius: 16,
  fontWeight: "bold",
  backgroundColor: "white",
  border: `2px solid ${available ? theme.palette.success.main : theme.palette.error.main}`,
  color: available ? theme.palette.success.main : theme.palette.error.main,
  "& .MuiChip-icon": {
    color: available ? theme.palette.success.main : theme.palette.error.main,
  },
}));

const DetalleProductoC = () => {
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
        setProducto(data.producto);
        setProductosRelacionados(data.productosRelacionados || []);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchProducto();
  }, [id]);

  const handleCantidadChange = (delta) => {
    const newCantidad = Math.max(1, Math.min(cantidad + delta, producto.cantidad));
    setCantidad(newCantidad);
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
          title: "¡Añadido al carrito!",
          html: `
            <div style="display: flex; gap: 15px; align-items: center;">
              <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 6px;" />
              <div>
                <p style="font-weight: bold; font-size: 16px;">${producto.nombre}</p>
                <p style="font-size: 14px;">Cantidad: ${cantidad}</p>
                <p style="color: #1976d2; font-weight: bold;">$${(producto.precio * cantidad).toFixed(2)}</p>
              </div>
            </div>
          `,
          confirmButtonText: "Ir al carrito",
          showCancelButton: true,
          cancelButtonText: "Seguir comprando",
          customClass: {
            confirmButton: "custom-swal-confirm",
            cancelButton: "custom-swal-cancel",
          },
          buttonsStyling: false,
          didOpen: () => {
            const confirmButton = document.querySelector(".custom-swal-confirm");
            const cancelButton = document.querySelector(".custom-swal-cancel");

            confirmButton.style.backgroundColor = "#1976d2";
            confirmButton.style.color = "white";
            confirmButton.style.padding = "8px 20px";
            confirmButton.style.borderRadius = "8px";
            confirmButton.style.border = "none";
            confirmButton.style.fontSize = "16px";
            confirmButton.style.cursor = "pointer";
            confirmButton.style.transition = "background-color 0.3s";
            confirmButton.style.marginRight = "10px";
            confirmButton.onmouseover = () => (confirmButton.style.backgroundColor = "#1565c0");
            confirmButton.onmouseout = () => (confirmButton.style.backgroundColor = "#1976d2");

            cancelButton.style.backgroundColor = "transparent";
            cancelButton.style.color = "#1976d2";
            cancelButton.style.padding = "8px 20px";
            cancelButton.style.borderRadius = "8px";
            cancelButton.style.border = "2px solid #1976d2";
            cancelButton.style.fontSize = "16px";
            cancelButton.style.cursor = "pointer";
            cancelButton.style.transition = "all 0.3s";
            cancelButton.style.marginLeft = "10px";
            cancelButton.onmouseover = () => {
              cancelButton.style.backgroundColor = "#e3f2fd";
              cancelButton.style.borderColor = "#1565c0";
            };
            cancelButton.onmouseout = () => {
              cancelButton.style.backgroundColor = "transparent";
              cancelButton.style.borderColor = "#1976d2";
            };
          },
        }).then((result) => {
          if (result.isConfirmed) navigate("/cliente/carrito");
        });
      } else {
        throw new Error("Error al agregar al carrito");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No se pudo agregar el producto al carrito.",
        confirmButtonText: "Aceptar",
        customClass: {
          confirmButton: "custom-swal-confirm",
        },
        buttonsStyling: false,
        didOpen: () => {
          const confirmButton = document.querySelector(".custom-swal-confirm");
          confirmButton.style.backgroundColor = "#1976d2";
          confirmButton.style.color = "white";
          confirmButton.style.padding = "8px 20px";
          confirmButton.style.borderRadius = "8px";
          confirmButton.style.border = "none";
          confirmButton.style.fontSize = "16px";
          confirmButton.style.cursor = "pointer";
          confirmButton.style.transition = "background-color 0.3s";
          confirmButton.onmouseover = () => (confirmButton.style.backgroundColor = "#1565c0");
          confirmButton.onmouseout = () => (confirmButton.style.backgroundColor = "#1976d2");
        },
      });
    }
  };

  if (!producto) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" width="60%" sx={{ mb: 2 }} />
            <Skeleton variant="text" width="30%" sx={{ mb: 2 }} />
            <Skeleton variant="text" width="80%" height={80} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Fade in={true} timeout={700}>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <StyledPaper elevation={0}>
          <Grid container spacing={3} alignItems="center">
            {/* Imagen */}
            <Grid item xs={12} md={5}>
              <StyledCard>
                <CardMedia
                  component="img"
                  image={producto.imagen}
                  alt={producto.nombre}
                  sx={{
                    height: { xs: 250, md: 350 },
                    objectFit: "contain",
                    p: 3,
                    bgcolor: "grey.100",
                    borderRadius: 2,
                  }}
                />
              </StyledCard>
            </Grid>

            {/* Detalles */}
            <Grid item xs={12} md={7}>
              <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
                {producto.nombre}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Rating value={4.5} precision={0.5} readOnly size="small" />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  (4.5/5 - 128 reseñas)
                </Typography>
              </Box>
              <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mt: 2 }}>
                ${producto.precio.toFixed(2)}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2, lineHeight: 1.7, maxWidth: "90%" }}
              >
                {producto.descripcion}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <StyledStockChip
                  icon={<Inventory />}
                  label={`Stock: ${producto.cantidad}`}
                  available={producto.cantidad > 0}
                  size="small"
                />
              </Box>

              {/* Cantidad y Botón */}
              <Box sx={{ mt: 3, display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #e0e4e8",
                    borderRadius: 1,
                    bgcolor: "white",
                  }}
                >
                  <IconButton
                    onClick={() => handleCantidadChange(-1)}
                    disabled={cantidad <= 1}
                    size="small"
                  >
                    <Remove fontSize="small" />
                  </IconButton>
                  <TextField
                    value={cantidad}
                    inputProps={{ readOnly: true, style: { textAlign: "center" } }}
                    sx={{ width: 50, "& .MuiInputBase-input": { p: 1 } }}
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                  />
                  <IconButton
                    onClick={() => handleCantidadChange(1)}
                    disabled={cantidad >= producto.cantidad}
                    size="small"
                  >
                    <Add fontSize="small" />
                  </IconButton>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ShoppingCart />}
                  onClick={handleAgregarAlCarrito}
                  disabled={producto.cantidad === 0}
                  sx={{
                    py: 1,
                    px: 3,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1rem",
                    boxShadow: "0 2px 10px rgba(25, 118, 210, 0.3)",
                  }}
                >
                  Agregar al carrito
                </Button>
              </Box>
            </Grid>
          </Grid>
        </StyledPaper>

        {/* Recomendaciones */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h6" fontWeight="bold" align="center" color="text.primary">
            Recomendaciones para ti
          </Typography>
          <Divider
            sx={{
              my: 2,
              maxWidth: 150,
              mx: "auto",
              borderColor: "primary.main",
              borderWidth: 2,
            }}
          />
          {productosRelacionados.length > 0 ? (
            <Carousel
              autoPlay={false}
              navButtonsAlwaysVisible
              animation="slide"
              indicators={true}
              navButtonsProps={{
                style: { backgroundColor: "rgba(0, 0, 0, 0.6)", borderRadius: 50 },
              }}
              sx={{ mt: 3 }}
            >
              {productosRelacionados
                .reduce((acc, prod, idx) => {
                  if (idx % 3 === 0) acc.push([]);
                  acc[acc.length - 1].push(prod);
                  return acc;
                }, [])
                .map((group, index) => (
                  <Grid container spacing={2} key={index} sx={{ px: 2 }}>
                    {group.map((prod) => (
                      <Grid item xs={12} sm={4} key={prod.id}>
                        <StyledCard onClick={() => navigate(`/cliente/detalles/${prod.id}`)}>
                          <CardMedia
                            component="img"
                            image={prod.imagen}
                            alt={prod.nombre}
                            sx={{
                              height: 150,
                              objectFit: "contain",
                              p: 2,
                              bgcolor: "grey.100",
                            }}
                          />
                          <CardContent sx={{ textAlign: "center", py: 1 }}>
                            <Typography variant="body2" fontWeight="bold" noWrap>
                              {prod.nombre}
                            </Typography>
                            <Typography variant="body1" color="primary" fontWeight="bold">
                              ${prod.precio.toFixed(2)}
                            </Typography>
                          </CardContent>
                        </StyledCard>
                      </Grid>
                    ))}
                  </Grid>
                ))}
            </Carousel>
          ) : (
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 3 }}>
              No hay recomendaciones disponibles.
            </Typography>
          )}
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button
              variant="outlined"
              color="primary"
              endIcon={<ArrowForwardIos />}
              onClick={() => navigate("/cliente/productos")}
              sx={{
                px: 3,
                py: 1,
                fontSize: "0.9rem",
                borderRadius: 2,
                borderWidth: 2,
                "&:hover": { borderWidth: 2 },
              }}
            >
              Ver más productos
            </Button>
          </Box>
        </Box>
      </Container>
    </Fade>
  );
};

export default DetalleProductoC;