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
  Breadcrumbs,
  Link,
  Stack,
} from "@mui/material";
import {
  ShoppingCart,
  ArrowForwardIos,
  Add,
  Remove,
  Inventory,
  Favorite,
  FavoriteBorder,
  Share,
  NavigateNext,
  Home,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Carousel from "react-material-ui-carousel";
import Swal from "sweetalert2";

const MainContainer = styled(Container)(({ theme }) => ({
  backgroundColor: "#fffffff",
  minHeight: "100vh",
  padding: theme.spacing(2, 0),
}));

const ProductCard = styled(Card)(({ theme }) => ({
  borderRadius: 8,
  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
  border: "1px solid #e6e6e6",
  backgroundColor: "white",
  marginBottom: theme.spacing(2),
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  backgroundColor: "white",
  borderRadius: 8,
  padding: theme.spacing(3),
  border: "1px solid #e6e6e6",
  marginBottom: theme.spacing(2),
}));

const ProductImage = styled("img")({
  width: "100%",
  height: "250px",
  objectFit: "contain",
  borderRadius: 4,
});

const PurchaseContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "white",
  padding: theme.spacing(3),
  borderRadius: 8,
  border: "1px solid #e6e6e6",
  position: "sticky",
  top: theme.spacing(2),
}));

const InfoContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "white",
  padding: theme.spacing(3),
  borderRadius: 8,
  border: "1px solid #e6e6e6",
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 6,
  textTransform: "none",
  fontSize: "16px",
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  "&.primary": {
    backgroundColor: "#25ae57ff",
    color: "white",
    "&:hover": {
      backgroundColor: "#218e49ff",
    },
  },
  "&.secondary": {
    backgroundColor: "#e6f7ff",
    color: "#25ae57ff",
    border: "1px solid #218e49ff",
    "&:hover": {
      backgroundColor: "#181f23ff",
    },
  },
}));

const StockChip = styled(Chip)(({ theme, available }) => ({
  backgroundColor: available ? "#e8f5e8" : "#ffebee",
  color: available ? "#2e7d32" : "#c62828",
  border: `1px solid ${available ? "#4caf50" : "#f44336"}`,
  fontWeight: 500,
  fontSize: "12px",
  height: 28,
}));

const RecommendationCard = styled(Card)(({ theme }) => ({
  borderRadius: 8,
  cursor: "pointer",
  transition: "all 0.2s ease",
  border: "1px solid #e6e6e6",
  "&:hover": {
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transform: "translateY(-2px)",
  },
}));

const QuantitySelector = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  border: "1px solid #e6e6e6",
  borderRadius: 6,
  backgroundColor: "white",
}));

const DetalleProductoC = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [productosRelacionados, setProductosRelacionados] = useState([]);
  const [cantidad, setCantidad] = useState(1);
  const [favorito, setFavorito] = useState(false);
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
                <p style="color: #3483fa; font-weight: bold;">$${(producto.precio * cantidad).toFixed(2)}</p>
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

            if (confirmButton) {
              confirmButton.style.backgroundColor = "#3483fa";
              confirmButton.style.color = "white";
              confirmButton.style.padding = "8px 20px";
              confirmButton.style.borderRadius = "8px";
              confirmButton.style.border = "none";
              confirmButton.style.fontSize = "16px";
              confirmButton.style.cursor = "pointer";
              confirmButton.style.transition = "background-color 0.3s";
              confirmButton.style.marginRight = "10px";
              confirmButton.onmouseover = () => (confirmButton.style.backgroundColor = "#2968c8");
              confirmButton.onmouseout = () => (confirmButton.style.backgroundColor = "#3483fa");
            }

            if (cancelButton) {
              cancelButton.style.backgroundColor = "transparent";
              cancelButton.style.color = "#3483fa";
              cancelButton.style.padding = "8px 20px";
              cancelButton.style.borderRadius = "8px";
              cancelButton.style.border = "2px solid #3483fa";
              cancelButton.style.fontSize = "16px";
              cancelButton.style.cursor = "pointer";
              cancelButton.style.transition = "all 0.3s";
              cancelButton.style.marginLeft = "10px";
              cancelButton.onmouseover = () => {
                cancelButton.style.backgroundColor = "#e6f7ff";
                cancelButton.style.borderColor = "#2968c8";
              };
              cancelButton.onmouseout = () => {
                cancelButton.style.backgroundColor = "transparent";
                cancelButton.style.borderColor = "#3483fa";
              };
            }
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
          if (confirmButton) {
            confirmButton.style.backgroundColor = "#3483fa";
            confirmButton.style.color = "white";
            confirmButton.style.padding = "8px 20px";
            confirmButton.style.borderRadius = "8px";
            confirmButton.style.border = "none";
            confirmButton.style.fontSize = "16px";
            confirmButton.style.cursor = "pointer";
            confirmButton.style.transition = "background-color 0.3s";
            confirmButton.onmouseover = () => (confirmButton.style.backgroundColor = "#2968c8");
            confirmButton.onmouseout = () => (confirmButton.style.backgroundColor = "#3483fa");
          }
        },
      });
    }
  };

  if (!producto) {
    return (
      <MainContainer maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={450} sx={{ borderRadius: 2, mb: 2 }} />
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </MainContainer>
    );
  }

  return (
    <Fade in={true} timeout={600}>
      <MainContainer sx={{ maxWidth: "1200px !important", width: "100%" }}>
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{ mb: 3, color: "#666" }}
        >
          <Link
            underline="hover"
            sx={{ display: "flex", alignItems: "center", cursor: "pointer", color: "#3483fa" }}
            onClick={() => navigate("/cliente")}
          >
            <Home sx={{ mr: 0.5, fontSize: 16 }} />
            Inicio
          </Link>
          <Link
            underline="hover"
            sx={{ cursor: "pointer", color: "#3483fa" }}
            onClick={() => navigate("/cliente/productos")}
          >
            Productos
          </Link>
          <Typography color="text.primary" fontSize="14px">
            {producto.nombre}
          </Typography>
        </Breadcrumbs>

        <Grid container spacing={3}>
          {/* Columna izquierda - Imagen y descripción */}
          <Grid item xs={12} md={8}>
            {/* Imagen principal */}
            <ImageContainer>
              <ProductImage src={producto.imagen} alt={producto.nombre} />
            </ImageContainer>

            {/* Descripción del producto */}
            <InfoContainer>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Descripción
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.6 }}
              >
                {producto.descripcion}
              </Typography>
            </InfoContainer>
          </Grid>

          {/* Columna derecha - Precio y compra */}
          <Grid item xs={12} md={4}>
            <PurchaseContainer>
              {/* Stock */}
              <StockChip
                icon={<Inventory />}
                label={producto.cantidad > 0 ? `Stock: ${producto.cantidad} unidades` : "Sin stock"}
                available={producto.cantidad > 0}
                sx={{ mb: 3 }}
              />

              {/* Título del producto */}
              <Typography
                variant="h5"
                fontWeight="400"
                color="text.primary"
                sx={{ mb: 2, lineHeight: 1.3 }}
              >
                {producto.nombre}
              </Typography>

              {/* Rating */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Rating value={4.5} precision={0.5} readOnly size="small" />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  (4.5)
                </Typography>
              </Box>

              {/* Precio */}
              <Typography
                variant="h4"
                fontWeight="300"
                color="text.primary"
                sx={{ mb: 1 }}
              >
                ${producto.precio.toFixed(2)}
              </Typography>

              <Divider sx={{ my: 3 }} />

              {/* Cantidad */}
              <Typography variant="body2" fontWeight="600" sx={{ mb: 2 }}>
                Cantidad:
              </Typography>

              <QuantitySelector sx={{ mb: 3, width: "fit-content" }}>
                <IconButton
                  onClick={() => handleCantidadChange(-1)}
                  disabled={cantidad <= 1}
                  size="small"
                  sx={{ borderRadius: "6px 0 0 6px" }}
                >
                  <Remove fontSize="small" />
                </IconButton>
                <TextField
                  value={cantidad}
                  inputProps={{
                    readOnly: true,
                    style: {
                      textAlign: "center",
                      padding: "8px 16px",
                      border: "none",
                      minWidth: "50px"
                    }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { border: "none" },
                      borderRadius: 0,
                    },
                  }}
                  size="small"
                />
                <IconButton
                  onClick={() => handleCantidadChange(1)}
                  disabled={cantidad >= producto.cantidad}
                  size="small"
                  sx={{ borderRadius: "0 6px 6px 0" }}
                >
                  <Add fontSize="small" />
                </IconButton>
              </QuantitySelector>

              {/* Total */}
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Total: <strong>${(producto.precio * cantidad).toFixed(2)}</strong>
              </Typography>

              {/* Botones de acción */}
              <Stack spacing={2}>
                <ActionButton
                  variant="contained"
                  className="primary"
                  startIcon={<ShoppingCart />}
                  onClick={handleAgregarAlCarrito}
                  disabled={producto.cantidad === 0}
                  fullWidth
                >
                  Agregar al carrito
                </ActionButton>
              </Stack>
            </PurchaseContainer>
          </Grid>
        </Grid>

        {/* Productos relacionados */}
        {productosRelacionados.length > 0 && (
          <Box sx={{ mt: 5 }}>
            <Typography variant="h6" fontWeight="600" color="green" sx={{ mb: 3 }}>
              Quienes compraron este producto también compraron
            </Typography>


            <Grid container spacing={2}>
              {productosRelacionados.slice(0, 4).map((prod) => (
                <Grid item xs={6} sm={4} md={3} key={prod.id}>
                  <RecommendationCard
                    onClick={() => navigate(`/cliente/detalles/${prod.id}`)}
                  >
                    <CardMedia
                      component="img"
                      image={prod.imagen}
                      alt={prod.nombre}
                      sx={{
                        height: 150,
                        objectFit: "contain",
                        p: 2,
                        bgcolor: "white",
                      }}
                    />
                    <CardContent sx={{ p: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "14px",
                          lineHeight: 1.3,
                          height: "2.6em",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          mb: 1
                        }}
                      >
                        {prod.nombre}
                      </Typography>
                      <Typography
                        variant="h6"
                        color="text.primary"
                        fontWeight="300"
                        sx={{ fontSize: "18px" }}
                      >
                        ${prod.precio.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </RecommendationCard>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Button
                variant="outlined"
                endIcon={<ArrowForwardIos />}
                onClick={() => navigate("/cliente/productos")}
                sx={{
                  borderColor: "#3483fa",
                  color: "#3483fa",
                  textTransform: "none",
                  borderRadius: 2,
                  px: 3,
                  "&:hover": {
                    borderColor: "#2968c8",
                    backgroundColor: "#f0f7ff",
                  },
                }}
              >
                Ver más productos
              </Button>
            </Box>
          </Box>
        )}
      </MainContainer>
    </Fade>
  );
};

export default DetalleProductoC;