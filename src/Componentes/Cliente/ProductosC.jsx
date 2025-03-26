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

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  overflow: "hidden",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
  cursor: "pointer",
  backgroundColor: "#fff",
}));

const StyledPagination = styled(Pagination)(({ theme }) => ({
  "& .MuiPaginationItem-root": {
    borderRadius: "8px",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
      color: "#fff",
    },
  },
  "& .Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  "& .MuiPaginationItem-previousNext": {
    backgroundColor: theme.palette.grey[200],
    color: theme.palette.grey[800],
    "&:hover": {
      backgroundColor: theme.palette.grey[400],
    },
  },
}));

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [page, setPage] = useState(1);
  const productosPorPagina = 10; // Ajustado para 5 por fila en 2 filas por página
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
    window.scrollTo({ top: 0, behavior: "smooth" }); // Desplaza al inicio de la página
  };

  // Calcular productos a mostrar en la página actual
  const productosPaginados = productos.slice(
    (page - 1) * productosPorPagina,
    page * productosPorPagina
  );

  return (
    <Fade in={true} timeout={700}>
      <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh", py: 5 }}>
        <Container maxWidth="xl">
          {/* Breadcrumbs */}
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4 }}>
            <Typography color="text.primary" variant="h6" fontWeight="bold">
              Productos
            </Typography>
          </Breadcrumbs>

          {/* Grid de productos */}
          {productos.length === 0 ? (
            <Grid container spacing={3}>
              {[...Array(productosPorPagina)].map((_, index) => (
                <Grid item key={index} xs={12} sm={6} md={4} lg={2.4}>
                  <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
                  <Skeleton variant="text" width="60%" sx={{ mt: 1 }} />
                  <Skeleton variant="text" width="40%" />
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
                        height="200"
                        image={producto.imagen}
                        alt={producto.nombre}
                        sx={{
                          objectFit: "contain",
                          bgcolor: "#f5f7fa",
                          p: 2,
                        }}
                      />
                      <CardContent sx={{ py: 2 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          color="text.primary"
                          sx={{ height: 50, overflow: "hidden", textOverflow: "ellipsis" }}
                        >
                          {producto.nombre}
                        </Typography>
                        <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mt: 1 }}>
                          ${producto.precio.toFixed(2)}
                        </Typography>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          startIcon={<ShoppingCart />}
                          sx={{ mt: 2, borderRadius: 2, textTransform: "none" }}
                          onClick={(e) => {
                            e.stopPropagation(); // Evita que el click en el botón active el Card
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
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <StyledPagination
                    count={Math.ceil(productos.length / productosPorPagina)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
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

export default Productos;