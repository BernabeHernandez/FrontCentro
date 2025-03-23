"use client"

import { useState, useEffect } from "react"
import { styled } from "@mui/material/styles"
import axios from "axios"
import { Box, Button, Card, CardContent, Container, Grid, Typography, Divider, CircularProgress } from "@mui/material"
import {
  Favorite,
  People,
  CalendarMonth,
  EmojiEvents,
  AccessTime,
  LocationOn,
  ArrowForward,
  CheckCircle,
  Star,
  ShoppingBag,
} from "@mui/icons-material"

// Importación de imágenes
import product1 from "../Componentes/Imagenes/Image2.png"
import imageForBlackBackground1 from "../Componentes/Imagenes/fht6.jpg"
import imageForBlackBackground2 from "../Componentes/Imagenes/Rehabi.jpg"
import imageForBlackBackground3 from "../Componentes/Imagenes/Image2.png"
import imageForBlackBackground4 from "../Componentes/Imagenes/perfil1.jpg"
import imageForBlackBackground5 from "../Componentes/Imagenes/perfil2.jpg"
import imageForBlackBackground6 from "../Componentes/Imagenes/perfil3.jpg"

// Componentes estilizados
const StyledButton = styled(Button)(({ theme, variant, color }) => ({
  textTransform: "none",
  fontWeight: 600,
  borderRadius: "0.375rem",
  padding: "0.625rem 1.25rem",
  fontSize: "1rem",
  ...(variant === "contained" &&
    color === "amber" && {
      backgroundColor: "#fbbf24",
      color: "#0c4a6e",
      "&:hover": {
        backgroundColor: "#f59e0b",
      },
    }),
  ...(variant === "outlined" &&
    color === "white" && {
      border: "1px solid white",
      color: "white",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
      },
    }),
  ...(variant === "contained" &&
    color === "primary" && {
      backgroundColor: "#f59e0b",
      color: "white",
      "&:hover": {
        backgroundColor: "#d97706",
      },
    }),
}))

const CategoryTag = styled(Box)(({ theme, bgcolor, color }) => ({
  display: "inline-block",
  padding: "0.25rem 0.75rem",
  borderRadius: "9999px",
  backgroundColor: bgcolor || "#ccfbf1",
  color: color || "#0f766e",
  fontSize: "0.875rem",
  fontWeight: 500,
  marginBottom: "0.75rem",
}))

const IconWrapper = styled(Box)(({ theme, bgcolor }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "3rem",
  height: "3rem",
  borderRadius: "9999px",
  backgroundColor: bgcolor || "#ccfbf1",
  marginBottom: "1rem",
  transition: "background-color 0.2s",
  "& svg": {
    fontSize: "1.5rem",
  },
}))

const ServiceCard = styled(Card)(({ theme, bordercolor }) => ({
  border: "none",
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  borderRadius: "0.5rem",
  overflow: "hidden",
  transition: "box-shadow 0.2s",
  "&:hover": {
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  "& .MuiCardContent-root": {
    padding: "1.5rem",
  },
  "&::before": {
    content: '""',
    display: "block",
    height: "0.25rem",
    backgroundColor: bordercolor || "#14b8a6",
    width: "100%",
  },
}))

const GradientBox = styled(Box)(({ theme, from, to }) => ({
  background: `linear-gradient(to bottom, ${from || "#f0f9ff"}, ${to || "white"})`,
  padding: "4rem 0",
}))

const ProfileImage = styled(Box)(({ theme, bordercolor }) => ({
  position: "relative",
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  overflow: "hidden",
  border: `2px solid ${bordercolor || "#2dd4bf"}`,
  marginRight: "1rem",
}))

const RatingStars = styled(Box)(({ theme }) => ({
  display: "flex",
  marginBottom: "0.75rem",
  "& svg": {
    color: "#fbbf24",
    fontSize: "1rem",
  },
}))

const StyledLink = styled("a")({
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
})

const ResponsiveImage = styled("img")({
  maxWidth: "100%",
  height: "auto",
  display: "block",
})

function PaginaPrincipalCliente() {
  const [mision, setMision] = useState("")
  const [vision, setVision] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const misionResponse = await axios.get("https://backendcentro.onrender.com/api/misionA/mision");
        const visionResponse = await axios.get("https://backendcentro.onrender.com/api/visionA/vision");
  
        // Extraer los datos
        const misionData = misionResponse.data;
        const visionData = visionResponse.data;
  
        // Asegurar que los datos sean arrays y extraer el contenido
        if (Array.isArray(misionData) && misionData.length > 0) {
          setMision(misionData[0].contenido); // Acceder al primer objeto y obtener "contenido"
        } else {
          setMision("Información no disponible"); // Manejo de error si el array está vacío
        }
  
        if (Array.isArray(visionData) && visionData.length > 0) {
          setVision(visionData[0].contenido);
        } else {
          setVision("Información no disponible");
        }
  
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error al cargar los datos. Por favor, intente nuevamente más tarde.");
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <Box component="main" sx={{ display: "flex", flexDirection: "column" }}>
      {/* Hero Section */}
      <Box sx={{ position: "relative", height: { xs: "500px", md: "600px" }, overflow: "hidden" }}>
  {/* Capa de superposición para mejorar la legibilidad del texto */}
  <Box
    sx={{
      position: "absolute",
      inset: 0,
      background: "linear-gradient(to right, rgba(27, 28, 28, 0.8), rgba(30, 30, 30, 0.7))",
      zIndex: 10,
    }}
  />
  
  {/* Imagen de fondo */}
  {imageForBlackBackground3 && (
    <Box sx={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0 }}>
      <img
        src={imageForBlackBackground3}
        alt="Centro de Rehabilitación"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </Box>
  )}

  {/* Contenido encima de la imagen */}
  <Container
    sx={{
      position: "relative",
      zIndex: 20,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      px: { xs: 2, sm: 4 },
      textAlign: "center",
    }}
  >
    <Typography
      variant="h1"
      sx={{
        fontSize: { xs: "2.25rem", md: "3rem", lg: "3.75rem" },
        fontWeight: 700,
        color: "white",
        mb: 2,
      }}
    >
      Centro de Rehabilitación Integral San Juan
    </Typography>
    <Typography
      variant="h5"
      sx={{
        fontSize: { xs: "1.25rem", md: "1.5rem" },
        color: "rgba(255, 255, 255, 0.9)",
        maxWidth: "32rem",
        mb: 4,
        mx: "auto",
      }}
    >
      Especialistas en rehabilitación física y tratamientos terapéuticos para mejorar tu calidad de vida.
    </Typography>
  </Container>
</Box>


      {/* Services Section */}
      <GradientBox from="#f0f9ff" to="white">
        <Container>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <CategoryTag bgcolor="#ccfbf1" color="#0f766e">
              Servicios Especializados
            </CategoryTag>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: "2rem", md: "2.5rem" }, fontWeight: 700, mb: 2, color: "#0c4a6e" }}
            >
              Nuestros Servicios
            </Typography>
            <Typography variant="body1" sx={{ color: "#0369a1", maxWidth: "32rem", mx: "auto" }}>
              Ofrecemos una amplia gama de servicios terapéuticos personalizados para satisfacer tus necesidades
              específicas.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6} lg={4}>
              <ServiceCard bordercolor="#14b8a6">
                <CardContent>
                  <IconWrapper bgcolor="#ccfbf1">
                    <Favorite sx={{ color: "#0d9488" }} />
                  </IconWrapper>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#0c4a6e" }}>
                    Terapias Físicas
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#0369a1", mb: 2 }}>
                    Tratamientos especializados para recuperar la movilidad y funcionalidad corporal.
                  </Typography>
                  <StyledLink
                    href="#"
                    sx={{
                      color: "#0d9488",
                      fontWeight: 500,
                      "&:hover": { color: "#0f766e" },
                    }}
                  >
                    Saber más <ArrowForward sx={{ ml: 0.5, fontSize: "1rem" }} />
                  </StyledLink>
                </CardContent>
              </ServiceCard>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <ServiceCard bordercolor="#0ea5e9">
                <CardContent>
                  <IconWrapper bgcolor="#e0f2fe">
                    <People sx={{ color: "#0284c7" }} />
                  </IconWrapper>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#0c4a6e" }}>
                    Fisioterapia
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#0369a1", mb: 2 }}>
                    Técnicas manuales y ejercicios terapéuticos para aliviar el dolor y mejorar la función.
                  </Typography>
                  <StyledLink
                    href="#"
                    sx={{
                      color: "#0284c7",
                      fontWeight: 500,
                      "&:hover": { color: "#0369a1" },
                    }}
                  >
                    Saber más <ArrowForward sx={{ ml: 0.5, fontSize: "1rem" }} />
                  </StyledLink>
                </CardContent>
              </ServiceCard>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <ServiceCard bordercolor="#f59e0b">
                <CardContent>
                  <IconWrapper bgcolor="#fef3c7">
                    <CalendarMonth sx={{ color: "#d97706" }} />
                  </IconWrapper>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#0c4a6e" }}>
                    Terapia Dermatofuncional
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#0369a1", mb: 2 }}>
                    Tratamientos para mejorar la salud y apariencia de la piel y tejidos.
                  </Typography>
                  <StyledLink
                    href="#"
                    sx={{
                      color: "#d97706",
                      fontWeight: 500,
                      "&:hover": { color: "#b45309" },
                    }}
                  >
                    Saber más <ArrowForward sx={{ ml: 0.5, fontSize: "1rem" }} />
                  </StyledLink>
                </CardContent>
              </ServiceCard>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <ServiceCard bordercolor="#14b8a6">
                <CardContent>
                  <IconWrapper bgcolor="#ccfbf1">
                    <EmojiEvents sx={{ color: "#0d9488" }} />
                  </IconWrapper>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#0c4a6e" }}>
                    Vendaje Neuromuscular
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#0369a1", mb: 2 }}>
                    Técnica terapéutica para estabilizar músculos y articulaciones facilitando su recuperación.
                  </Typography>
                  <StyledLink
                    href="#"
                    sx={{
                      color: "#0d9488",
                      fontWeight: 500,
                      "&:hover": { color: "#0f766e" },
                    }}
                  >
                    Saber más <ArrowForward sx={{ ml: 0.5, fontSize: "1rem" }} />
                  </StyledLink>
                </CardContent>
              </ServiceCard>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <ServiceCard bordercolor="#0ea5e9">
                <CardContent>
                  <IconWrapper bgcolor="#e0f2fe">
                    <Star sx={{ color: "#0284c7" }} />
                  </IconWrapper>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#0c4a6e" }}>
                    Limpieza Facial
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#0369a1", mb: 2 }}>
                    Tratamientos profesionales para mantener la piel saludable y radiante.
                  </Typography>
                  <StyledLink
                    href="#"
                    sx={{
                      color: "#0284c7",
                      fontWeight: 500,
                      "&:hover": { color: "#0369a1" },
                    }}
                  >
                    Saber más <ArrowForward sx={{ ml: 0.5, fontSize: "1rem" }} />
                  </StyledLink>
                </CardContent>
              </ServiceCard>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <ServiceCard
                bordercolor="#f59e0b"
                sx={{ background: "linear-gradient(to bottom right, #fffbeb, #fef3c7)" }}
              >
                <CardContent>
                  <IconWrapper bgcolor="#fde68a">
                    <ShoppingBag sx={{ color: "#d97706" }} />
                  </IconWrapper>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#0c4a6e" }}>
                    Productos de Limpieza Facial
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#0369a1", mb: 2 }}>
                    Productos profesionales para el cuidado de la piel disponibles en nuestro centro.
                  </Typography>
                  <StyledLink
                    href="#"
                    sx={{
                      color: "#d97706",
                      fontWeight: 500,
                      "&:hover": { color: "#b45309" },
                    }}
                  >
                    Ver productos <ArrowForward sx={{ ml: 0.5, fontSize: "1rem" }} />
                  </StyledLink>
                </CardContent>
              </ServiceCard>
            </Grid>
          </Grid>
        </Container>
      </GradientBox>

      {/* Why Choose Us */}
      <Box sx={{ py: 8, bgcolor: "white" }}>
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} lg={6}>
              <Box sx={{ position: "relative", width: "100%", height: { xs: "300px", sm: "400px", md: "500px" } }}>
                <img
                  src={imageForBlackBackground2 || "/placeholder.svg"}
                  alt="Equipo médico"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "0.5rem",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} lg={6}>
              <CategoryTag bgcolor="#ccfbf1" color="#0f766e">
                Nuestra Diferencia
              </CategoryTag>
              <Typography
                variant="h2"
                sx={{ fontSize: { xs: "2rem", md: "2.5rem" }, fontWeight: 700, mb: 3, color: "#0c4a6e" }}
              >
                ¿Por qué elegirnos?
              </Typography>
              <Typography variant="body1" sx={{ color: "#0369a1", mb: 4 }}>
                En Centro de Rehabilitación Integral San Juan nos distinguimos por un enfoque centrado en el paciente,
                con un equipo de profesionales altamente calificados y tecnología de vanguardia.
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  {
                    title: "Equipo Especializado",
                    desc: "Profesionales con amplia experiencia en rehabilitación.",
                  },
                  {
                    title: "Instalaciones Modernas",
                    desc: "Equipamiento de última generación para una rehabilitación efectiva.",
                  },
                  {
                    title: "Atención Personalizada",
                    desc: "Planes de tratamiento adaptados a las necesidades de cada paciente.",
                  },
                  {
                    title: "Citas en Línea",
                    desc: "Sistema de agendamiento de citas fácil y conveniente.",
                  },
                ].map((item, index) => (
                  <Box key={index} sx={{ display: "flex", gap: 1.5 }}>
                    <CheckCircle sx={{ color: "#14b8a6", mt: 0.5, flexShrink: 0 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#0c4a6e", fontSize: "1.125rem" }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#0369a1" }}>
                        {item.desc}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <GradientBox from="white" to="#f0f9ff">
        <Container>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <CategoryTag bgcolor="#fef3c7" color="#92400e">
              Experiencias
            </CategoryTag>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: "2rem", md: "2.5rem" }, fontWeight: 700, mb: 2, color: "#0c4a6e" }}
            >
              Testimonios
            </Typography>
            <Typography variant="body1" sx={{ color: "#0369a1", maxWidth: "32rem", mx: "auto" }}>
              Conoce las experiencias de nuestros pacientes que han recuperado su calidad de vida.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                name: "Alex Martinez",
                role: "Paciente de Fisioterapia",
                borderColor: "#2dd4bf",
                text: "Después de mi accidente, pensé que nunca volvería a caminar normalmente. Gracias al equipo de San Juan, he recuperado mi movilidad y mi independencia.",
                image: imageForBlackBackground4,
              },
              {
                name: "Angela Rodriguez",
                role: "Paciente de Terapia Física",
                borderColor: "#38bdf8",
                text: "El apoyo y la dedicación de los terapeutas ha sido fundamental en mi recuperación. Su enfoque personalizado ha marcado la diferencia en mi proceso.",
                image: imageForBlackBackground5,
              },
              {
                name: "Cristian Lopez",
                role: "Paciente de Limpieza Facial",
                borderColor: "#fbbf24",
                text: "Los tratamientos faciales son excelentes. Mi piel luce radiante y saludable. Además, los productos que me recomendaron son perfectos para mi tipo de piel.",
                image: imageForBlackBackground6,
              },
            ].map((testimonial, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card sx={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", border: "none", bgcolor: "white" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <ProfileImage bordercolor={testimonial.borderColor}>
                        <img
                          src={testimonial.image || "/placeholder.svg"}
                          alt="Paciente"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </ProfileImage>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0c4a6e" }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#0284c7" }}>
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                    <RatingStars>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} />
                      ))}
                    </RatingStars>
                    <Typography variant="body2" sx={{ fontStyle: "italic", color: "#0369a1" }}>
                      "{testimonial.text}"
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </GradientBox>

      {/* Mission and Vision */}
      <Box sx={{ py: 8, bgcolor: "white" }}>
        <Container>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <CategoryTag bgcolor="#e0f2fe" color="#075985">
              Nuestros Valores
            </CategoryTag>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: "2rem", md: "2.5rem" }, fontWeight: 700, mb: 2, color: "#0c4a6e" }}
            >
              Misión y Visión
            </Typography>
            <Typography variant="body1" sx={{ color: "#0369a1", maxWidth: "32rem", mx: "auto" }}>
              Conoce los principios que guían nuestro trabajo diario.
            </Typography>
          </Box>

          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  background: "linear-gradient(to bottom right, #f0fdfa, #ccfbf1)",
                  overflow: "hidden",
                  position: "relative",
                  minHeight: "300px",
                  "&::before": {
                    content: '""',
                    display: "block",
                    height: "0.5rem",
                    backgroundColor: "#14b8a6",
                    width: "100%",
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h3" sx={{ fontSize: "1.875rem", fontWeight: 700, mb: 3, color: "#115e59" }}>
                    Misión
                  </Typography>
                  {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "150px" }}>
                      <CircularProgress color="primary" />
                    </Box>
                  ) : error ? (
                    <Typography variant="body1" sx={{ color: "error.main" }}>
                      {error}
                    </Typography>
                  ) : (
                    <Typography variant="body1" sx={{ color: "#0f766e" }}>
                      {typeof mision === "object" ? "Información no disponible" : mision}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  background: "linear-gradient(to bottom right, #f0f9ff, #e0f2fe)",
                  overflow: "hidden",
                  position: "relative",
                  minHeight: "300px",
                  "&::before": {
                    content: '""',
                    display: "block",
                    height: "0.5rem",
                    backgroundColor: "#0ea5e9",
                    width: "100%",
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h3" sx={{ fontSize: "1.875rem", fontWeight: 700, mb: 3, color: "#075985" }}>
                    Visión
                  </Typography>
                  {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "150px" }}>
                      <CircularProgress color="primary" />
                    </Box>
                  ) : error ? (
                    <Typography variant="body1" sx={{ color: "error.main" }}>
                      {error}
                    </Typography>
                  ) : (
                    <Typography variant="body1" sx={{ color: "#0369a1" }}>
                      {typeof vision === "object" ? "Información no disponible" : vision}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Location and Hours */}
      <GradientBox from="#f0f9ff" to="white">
        <Container>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <CategoryTag bgcolor="#fef3c7" color="#92400e">
              Información Práctica
            </CategoryTag>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: "2rem", md: "2.5rem" }, fontWeight: 700, mb: 2, color: "#0c4a6e" }}
            >
              Ubicación y Horarios
            </Typography>
            <Typography variant="body1" sx={{ color: "#0369a1", maxWidth: "32rem", mx: "auto" }}>
              Estamos ubicados en un lugar accesible y contamos con horarios flexibles para tu comodidad.
            </Typography>
          </Box>

          <Grid container spacing={6}>
            <Grid item xs={12} lg={6}>
              <Card
                sx={{
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  border: "none",
                  borderTop: "4px solid #14b8a6",
                  borderRadius: "0.5rem",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      fontWeight: 700,
                      mb: 2,
                      color: "#0c4a6e",
                    }}
                  >
                    <LocationOn sx={{ color: "#14b8a6", mr: 1 }} />
                    Nuestra Ubicación
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#0369a1", mb: 2 }}>
                  Clavel, Aviación Civil, 43000 Huejutla de Reyes, Hgo.
                  </Typography>
                  <Box
                    sx={{
                      height: "300px",
                      borderRadius: "0.5rem",
                      overflow: "hidden",
                    }}
                  >
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d930.3116289179378!2d-98.40923193041279!3d21.14258569878345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d726976bcbeec9%3A0x46764bc322c8c614!2sCiber%20Melas!5e0!3m2!1ses!2smx!4v1740551723799!5m2!1ses!2smx"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                    ></iframe>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Card
                sx={{
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  border: "none",
                  borderTop: "4px solid #f59e0b",
                  borderRadius: "0.5rem",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      fontWeight: 700,
                      mb: 2,
                      color: "#0c4a6e",
                    }}
                  >
                    <AccessTime sx={{ color: "#f59e0b", mr: 1 }} />
                    Horario de Atención
                  </Typography>

                  {[
                    { day: "Lunes - Viernes", hours: "8:00 AM - 8:00 PM" },
                    { day: "Sábado", hours: "9:00 AM - 2:00 PM" },
                    { day: "Domingo", hours: "Cerrado" },
                  ].map((schedule, index, array) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: index < array.length - 1 ? "1px solid #fef3c7" : "none",
                        pb: index < array.length - 1 ? 1.5 : 0,
                        mb: 2,
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 500, color: "#0c4a6e" }}>
                        {schedule.day}
                      </Typography>
                      <Box
                        sx={{
                          bgcolor: "#fffbeb",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "9999px",
                          color: "#0369a1",
                        }}
                      >
                        {schedule.hours}
                      </Box>
                    </Box>
                  ))}

                  <Divider sx={{ my: 3, borderColor: "#fef3c7" }} />

                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#0c4a6e" }}>
                      Agenda tu cita
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#0369a1", mb: 2 }}>
                      Puedes agendar tu cita directamente desde nuestra aplicación en los dias disponibles.
                    </Typography>
                    <StyledButton variant="contained" color="primary" fullWidth>
                      Agendar Cita
                    </StyledButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </GradientBox>
    </Box>
  )
}

export default PaginaPrincipalCliente

