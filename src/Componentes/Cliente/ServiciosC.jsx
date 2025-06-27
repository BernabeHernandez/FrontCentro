import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Container,
  Skeleton,
  Fade,
  Pagination,
  Button,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { CalendarToday } from "@mui/icons-material";
import Breadcrumbs from "../Navegacion/BreadcrumbsServicios";

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
  minHeight: "460px",
  display: "flex",
  flexDirection: "column",
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

const ServiciosC = () => {
  const [servicios, setServicios] = useState([]);
  const [page, setPage] = useState(1);
  const serviciosPorPagina = 10; 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await fetch("https://backendcentro.onrender.com/api/serviciosConDes/todos-con-y-sin-descuento");
        if (!response.ok) {
          throw new Error(`Error al obtener los servicios: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Datos recibidos del backend:", data); 
        setServicios(data);
      } catch (error) {
        console.error("Error:", error);
        navigate("/cliente/error500");
      }
    };

    fetchServicios();
  }, [navigate]);

  const handleServicioClick = (id) => {
    navigate(`/cliente/detalle/${id}`);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const serviciosPaginados = servicios.slice(
    (page - 1) * serviciosPorPagina,
    page * serviciosPorPagina
  );

  return (
    <Fade in={true} timeout={700}>
      <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh", py: 5 }}>
        <Container maxWidth="xl">
          <Breadcrumbs sx={{ mb: 4 }} />
          <Typography variant="h4" fontWeight="bold" color="text.primary" gutterBottom>
            Servicios Disponibles
          </Typography>

          {servicios.length === 0 ? (
            <Grid container spacing={3}>
              {[...Array(serviciosPorPagina)].map((_, index) => (
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
                {serviciosPaginados.map((servicio) => (
                  <Grid item key={servicio.id} xs={12} sm={6} md={4} lg={2.4}>
                    <StyledCard onClick={() => handleServicioClick(servicio.id)}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={servicio.imagen}
                        alt={servicio.nombre}
                        sx={{
                          objectFit: "cover",
                          bgcolor: "#f5f7fa",
                          p: 2,
                        }}
                      />
                      <CardContent sx={{ py: 2 }}>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="text.primary"
                          sx={{ height: 50, overflow: "hidden", textOverflow: "ellipsis" }}
                        >
                          {servicio.nombre}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {servicio.tiene_promocion ? (
                            <>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ textDecoration: "line-through" }}
                              >
                                ${servicio.precio_original}
                              </Typography>
                              <Typography variant="h6" color="primary" fontWeight="bold">
                                ${servicio.promocion?.precio_con_descuento} ({servicio.promocion?.descuento}% OFF)
                              </Typography>
                              <Chip
                                label={`Promoción: ${servicio.promocion?.promocion_titulo}`}
                                color="secondary"
                                size="small"
                                sx={{ mt: 1 }}
                              />
                            </>
                          ) : (
                            <Typography variant="h6" color="primary" fontWeight="bold">
                              ${servicio.precio_original}
                            </Typography>
                          )}
                        </Box>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          startIcon={<CalendarToday />}
                          sx={{ mt: 2, borderRadius: 2, textTransform: "none" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleServicioClick(servicio.id);
                          }}
                        >
                          Ver detalles
                        </Button>
                      </CardContent>
                    </StyledCard>
                  </Grid>
                ))}
              </Grid>

              {servicios.length > serviciosPorPagina && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <StyledPagination
                    count={Math.ceil(servicios.length / serviciosPorPagina)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
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

export default ServiciosC;

