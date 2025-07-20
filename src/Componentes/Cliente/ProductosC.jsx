import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Breadcrumbs,
  Container,
  Skeleton,
  Fade,
  Pagination,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ArrowForwardIos, ShoppingCart } from "@mui/icons-material";

// Enhanced styling for the Card component
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  overflow: "hidden",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
  },
  cursor: "pointer",
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
}));

// Enhanced pagination styling
const StyledPagination = styled(Pagination)(({ theme }) => ({
  "& .MuiPaginationItem-root": {
    borderRadius: "8px",
    fontWeight: 500,
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
      color: "#fff",
    },
  },
  "& .Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
    fontWeight: 600,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  "& .MuiPaginationItem-previousNext": {
    backgroundColor: "#f3f4f6",
    color: theme.palette.grey[800],
    "&:hover": {
      backgroundColor: "#e5e7eb",
    },
  },
}));

const ProductosC = () => {
  const [productos, setProductos] = useState([]);
  const [page, setPage] = useState(1);
  const productosPorPagina = 15;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch("https://backendcentro.onrender.com/api/productos");
        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("Error:", error);
        navigate("/cliente/error500");
      }
    };
    fetchProductos();
  }, [navigate]);

  const handleProductoClick = (id) => {
    navigate(`/cliente/detalles/${id}`);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const productosPaginados = productos.slice(
    (page - 1) * productosPorPagina,
    page * productosPorPagina
  );

  return (
    <Fade in={true} timeout={700}>
      <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh", py: 6 }}>
        <Container maxWidth="xl">
          {/* Breadcrumbs */}
          <Breadcrumbs
            aria-label="breadcrumb"
            separator={<ArrowForwardIos fontSize="small" />}
            sx={{ mb: 4 }}
          >
            <Typography
              color="text.primary"
              variant="h5"
              fontWeight="600"
              sx={{ color: "#1f2937" }}
            >
              Productos
            </Typography>
          </Breadcrumbs>

          {/* Grid de productos */}
          {productos.length === 0 ? (
            <Grid container spacing={3}>
              {[...Array(productosPorPagina)].map((_, index) => (
                <Grid item key={index} xs={12} sm={6} md={4} lg={2.4}>
                  <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 4 }} />
                  <Skeleton variant="text" width="60%" sx={{ mt: 2, mx: "auto" }} />
                  <Skeleton variant="text" width="40%" sx={{ mx: "auto" }} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <>
              <Grid container spacing={3}>
                {productosPaginados.map((producto) => (
                  <Grid item key={producto.id} xs={12} sm={6} md={4} lg={2.4}>
                    <StyledCard onClick={() => handleProductoClick(producto.id)}>
                      <CardMedia
                        component="img"
                        height="220"
                        image={producto.imagen}
                        alt={producto.nombre}
                        sx={{
                          objectFit: "contain",
                          bgcolor: "#ffffff", // White background for images
                          p: 3,
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      />
                      <CardContent sx={{ py: 3, px: 2 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight="600"
                          color="text.primary"
                          sx={{
                            height: 48,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            color: "#1f2937",
                          }}
                        >
                          {producto.nombre}
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight="700"
                          sx={{ mt: 1.5, color: "#22c55e" }} // Green price
                        >
                          ${producto.precio.toFixed(2)}
                        </Typography>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          startIcon={<ShoppingCart />}
                          sx={{ mt: 2, borderRadius: 2, textTransform: "none" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductoClick(producto.id);
                          }}
                        >
                          Ver detalles
                        </Button>
                      </CardContent>
                    </StyledCard>
                  </Grid>
                ))}
              </Grid>

              {/* Paginación */}
              {productos.length > productosPorPagina && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 5, pb: 3 }}>
                  <StyledPagination
                    count={Math.ceil(productos.length / productosPorPagina)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    sx={{ "& .MuiPagination-ul": { gap: "4px" } }}
                  />
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>
    </Fade>
  );
};

export default ProductosC;