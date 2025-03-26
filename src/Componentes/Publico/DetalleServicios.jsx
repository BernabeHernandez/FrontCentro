import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BreadcrumbsServicios from "../Navegacion/BreadcrumbsServicios";
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Chip,
  Rating,
  Skeleton,
  Fade,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { CalendarToday, ArrowForwardIos } from "@mui/icons-material";
import Carousel from "react-material-ui-carousel";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  boxShadow: `0 4px 20px rgba(0, 0, 0, 0.05)`,
  background: "linear-gradient(145deg, #ffffff 0%, #f5f7fa 100%)",
  border: "1px solid #e0e4e8",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 10,
  overflow: "hidden",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[6],
    cursor: "pointer",
  },
}));

const DetallesServicio = () => {
  const [servicio, setServicio] = useState(null);
  const [productosRelacionados, setProductosRelacionados] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServicio = async () => {
      try {
        const response = await fetch(`https://backendcentro.onrender.com/api/servicios/${id}`);
        if (!response.ok) throw new Error("Error al obtener el servicio");
        const data = await response.json();
        setServicio(data);

        const categoriaId = data.categoria_id;
        const responseProductos = await fetch(
          `https://backendcentro.onrender.com/api/servicios?categoriaId=${categoriaId}`
        );
        const productosRelacionadosData = await responseProductos.json();
        setProductosRelacionados(productosRelacionadosData);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchServicio();
  }, [id]);

  const handlePagoClick = () => {
    navigate("/CitasCliente", { state: { servicioId: id } });
  };

  const manejarProductoRelacionadoClick = (idProducto) => {
    const productosRestantes = productosRelacionados.filter((prod) => prod.id !== idProducto);
    setProductosRelacionados(productosRestantes);
    navigate(`/detalle/${idProducto}`);
  };

  if (!servicio) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
            <Skeleton variant="text" width="60%" sx={{ mt: 2 }} />
            <Skeleton variant="text" width="80%" height={100} sx={{ mt: 2 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="text" width="50%" sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Fade in={true} timeout={700}>
      <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh" }}>
        <BreadcrumbsServicios />
        <Container maxWidth="lg" sx={{ py: 5 }}>
          <Grid container spacing={4}>
            {/* Columna izquierda */}
            <Grid item xs={12} md={8}>
              <StyledPaper elevation={0}>
                <Box sx={{ mb: 3 }}>
                  <CardMedia
                    component="img"
                    image={servicio.imagen}
                    alt={servicio.nombre}
                    sx={{
                      height: { xs: 250, md: 400 },
                      objectFit: "cover",
                      borderRadius: 2,
                      bgcolor: "grey.100",
                    }}
                  />
                </Box>
                <Typography variant="h4" fontWeight="bold" color="text.primary" gutterBottom>
                  {servicio.nombre}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Rating value={4.5} precision={0.5} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    (4.5/5 - 85 reseñas)
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
                  {servicio.descripcion}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                  <Chip
                    label={`Categoría: ${servicio.categoria_nombre}`}
                    variant="outlined"
                    color="primary"
                    sx={{ fontWeight: "bold" }}
                  />
                  <Typography variant="h5" color="primary" fontWeight="bold">
                    ${servicio.precio.toFixed(2)}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CalendarToday />}
                  onClick={handlePagoClick}
                  sx={{
                    py: 1, // Reducido de 1.5 a 1
                    px: 3, // Añadido padding horizontal para equilibrio
                    fontSize: "1rem", // Reducido de 1.1rem a 1rem
                    borderRadius: 2,
                    boxShadow: "0 2px 10px rgba(25, 118, 210, 0.3)",
                    textTransform: "none",
                    width: "auto", // Cambiado de fullWidth a auto para un tamaño más natural
                    maxWidth: "200px", // Límite máximo para evitar que crezca demasiado
                  }}
                >
                  Sacar cita
                </Button>
              </StyledPaper>
            </Grid>

            {/* Columna derecha */}
            <Grid item xs={12} md={4}>
              <StyledPaper elevation={0}>
                <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
                  Servicios Relacionados
                </Typography>
                <Divider sx={{ mb: 2, borderColor: "primary.main", borderWidth: 1 }} />
                {productosRelacionados.length > 0 ? (
                  <Carousel
                    autoPlay={false}
                    navButtonsAlwaysVisible
                    animation="slide"
                    indicators={true}
                    navButtonsProps={{
                      style: { backgroundColor: "rgba(0, 0, 0, 0.6)", borderRadius: 50 },
                    }}
                  >
                    {productosRelacionados
                      .reduce((acc, prod, idx) => {
                        if (idx % 2 === 0) acc.push([]);
                        acc[acc.length - 1].push(prod);
                        return acc;
                      }, [])
                      .map((group, index) => (
                        <Box key={index} sx={{ px: 1 }}>
                          {group.map((prod) => (
                            <StyledCard
                              key={prod.id}
                              onClick={() => manejarProductoRelacionadoClick(prod.id)}
                              sx={{ mb: 2 }}
                            >
                              <CardMedia
                                component="img"
                                image={prod.imagen}
                                alt={prod.nombre}
                                sx={{
                                  height: 120,
                                  objectFit: "cover",
                                  bgcolor: "grey.100",
                                }}
                              />
                              <CardContent sx={{ py: 1 }}>
                                <Typography
                                  variant="body1"
                                  fontWeight="bold"
                                  color="text.primary"
                                  noWrap
                                >
                                  {prod.nombre}
                                </Typography>
                                <Typography variant="body2" color="primary" fontWeight="bold">
                                  ${prod.precio.toFixed(2)}
                                </Typography>
                              </CardContent>
                            </StyledCard>
                          ))}
                        </Box>
                      ))}
                  </Carousel>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
                    No hay servicios relacionados disponibles.
                  </Typography>
                )}
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    endIcon={<ArrowForwardIos />}
                    onClick={() => navigate("/servicios")}
                    sx={{
                      px: 3,
                      py: 1,
                      fontSize: "0.9rem",
                      borderRadius: 2,
                      borderWidth: 2,
                      "&:hover": { borderWidth: 2 },
                    }}
                  >
                    Ver todos los servicios
                  </Button>
                </Box>
              </StyledPaper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Fade>
  );
};

export default DetallesServicio;