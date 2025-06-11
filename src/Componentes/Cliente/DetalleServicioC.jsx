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
  display: "flex",
  flexDirection: "column",
  height: "100%", // Asegurar que ocupe toda la altura disponible
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

const DetallesServicioC = () => {
  const [servicio, setServicio] = useState(null);
  const [productosRelacionados, setProductosRelacionados] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServicio = async () => {
      try {
        // Obtener servicios con promociones
        const response = await fetch(
          `https://backendcentro.onrender.com/api/serviciosConDes/todos-con-y-sin-descuento`
        );
        if (!response.ok) throw new Error("Error al obtener los servicios");
        const serviciosData = await response.json();
        
        // Filtrar el servicio por id
        const servicioEncontrado = serviciosData.find(
          (serv) => serv.id === parseInt(id)
        );
        if (!servicioEncontrado) throw new Error("Servicio no encontrado");
        setServicio(servicioEncontrado);

        // Obtener servicios relacionados por categoría
        const categoriaId = servicioEncontrado.id_categoria;
        const responseProductos = await fetch(
          `https://backendcentro.onrender.com/api/servicios?categoriaId=${categoriaId}`
        );
        if (!responseProductos.ok) throw new Error("Error al obtener servicios relacionados");
        const productosRelacionadosData = await responseProductos.json();
        // Excluir el servicio actual de los relacionados
        const productosFiltrados = productosRelacionadosData.filter(
          (prod) => prod.id !== parseInt(id)
        );
        setProductosRelacionados(productosFiltrados);
      } catch (error) {
        console.error("Error:", error);
        navigate("/cliente/error404"); // Redirigir a una página de error si no se encuentra el servicio
      }
    };

    fetchServicio();
  }, [id, navigate]);

  const handlePagoClick = () => {
    // Pasar el precio correcto (con descuento si aplica) y el nombre del servicio
    const precioFinal = servicio.tiene_promocion
      ? parseFloat(servicio.promocion.precio_con_descuento)
      : parseFloat(servicio.precio_original);
    navigate("/cliente/CitasCliente", {
      state: { servicioId: id, precio: precioFinal, nombre_servicio: servicio.nombre },
    });
  };

  const manejarProductoRelacionadoClick = (idProducto) => {
    navigate(`/cliente/detalle/${idProducto}`);
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

  // Determinar el precio a mostrar
  const precioFinal = servicio.tiene_promocion
    ? parseFloat(servicio.promocion.precio_con_descuento)
    : parseFloat(servicio.precio_original);

  return (
    <Fade in={true} timeout={700}>
      <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh", pb: { xs: 8, md: 10 } }}>
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
                <Box sx={{ flexGrow: 1 }}> {/* Contenedor flexible para el contenido */}
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
                  <Box sx={{ mb: 2 }}>
                    {servicio.tiene_promocion ? (
                      <>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textDecoration: "line-through", display: "inline", mr: 1 }}
                        >
                          ${parseFloat(servicio.precio_original).toFixed(2)}
                        </Typography>
                        <Typography
                          variant="h5"
                          color="primary"
                          fontWeight="bold"
                          sx={{ display: "inline" }}
                        >
                          ${precioFinal.toFixed(2)} ({servicio.promocion.descuento}% OFF)
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="h5" color="primary" fontWeight="bold">
                        ${precioFinal.toFixed(2)}
                      </Typography>
                    )}
                  </Box>
                  {servicio.tiene_promocion && (
                    <Chip
                      label={`Promoción: ${servicio.promocion.promocion_titulo}`}
                      color="secondary"
                      size="small"
                      sx={{ mb: 2 }}
                    />
                  )}
                </Box>
                <Box sx={{ mt: "auto" }}> {/* Alinear el botón en la parte inferior */}
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CalendarToday />}
                    onClick={handlePagoClick}
                    sx={{
                      py: 1.5,
                      px: 3,
                      fontSize: "1rem",
                      borderRadius: 2,
                      boxShadow: "0 2px 10px rgba(25, 118, 210, 0.3)",
                      textTransform: "none",
                      width: "100%", // Ajuste para consistencia
                      maxWidth: "250px",
                    }}
                  >
                    Sacar cita
                  </Button>
                </Box>
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
                    onClick={() => navigate("/cliente/servicios")}
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

export default DetallesServicioC;