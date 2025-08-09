import React, { useState, useEffect, useRef } from "react";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Container, 
  Typography, 
  Divider, 
  CircularProgress,
  Stack,
  Fade,
  Slide,
  Zoom,
  useTheme,
  alpha,
  Paper,
  Chip,
  Avatar,
  useScrollTrigger,
  Fab
} from "@mui/material";
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
  KeyboardArrowUp,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Importación de imágenes
import imageForBlackBackground2 from "../Componentes/Imagenes/Rehabi.jpg";
import imageForBlackBackground3 from "../Componentes/Imagenes/Image2.png";
import imageForBlackBackground4 from "../Componentes/Imagenes/perfil1.jpg";
import imageForBlackBackground5 from "../Componentes/Imagenes/perfil2.jpg";
import imageForBlackBackground6 from "../Componentes/Imagenes/perfil3.jpg";

// Hook personalizado para detectar scroll con animaciones repetidas
const useScrollAnimation = (threshold = 0.3) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Animar cuando entra en vista y resetear cuando sale
        setIsVisible(entry.isIntersecting);
      },
      { 
        threshold,
        rootMargin: '-10% 0px -10% 0px' // Margen para activar antes de que sea completamente visible
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return [ref, isVisible];
};

// Componente de scroll hacia arriba
const ScrollTop = () => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Zoom in={trigger}>
      <Fab
        onClick={handleClick}
        color="primary"
        size="small"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #5a67d8 30%, #6b46c1 90%)',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        <KeyboardArrowUp />
      </Fab>
    </Zoom>
  );
};

// Componentes estilizados mejorados
const GradientHero = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(0,0,0,0.3), rgba(0,0,0,0.1))',
    zIndex: 1,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `url(${imageForBlackBackground3}) center/cover`,
    opacity: 0.55,
    filter: 'brightness(0.7) blur(1.5px)',
    zIndex: 0,
  },
}));

const FloatingCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-12px) scale(1.02)',
    boxShadow: theme.shadows[20],
  },
}));

const GradientSection = styled(Box)(({ theme, gradient }) => ({
  background: gradient || 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
  transition: 'background 0.8s ease-in-out',
  position: 'relative',
}));

const PulsingIcon = styled(Box)(({ theme, bgcolor }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 80,
  height: 80,
  borderRadius: '50%',
  background: bgcolor || theme.palette.primary.light,
  marginBottom: theme.spacing(2),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: '50%',
    background: 'inherit',
    opacity: 0.3,
    animation: 'pulse 2s infinite',
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(0.8)',
      opacity: 0.3,
    },
    '50%': {
      transform: 'scale(1.2)',
      opacity: 0.1,
    },
    '100%': {
      transform: 'scale(0.8)',
      opacity: 0.3,
    },
  },
  '& svg': {
    fontSize: '2rem',
    zIndex: 1,
  },
}));

// Componente mejorado para texto con mejor visibilidad
const VisibleText = styled(Typography)(({ theme }) => ({
  position: 'relative',
  zIndex: 10,
  '&.white-text': {
    color: '#ffffff !important',
    textShadow: '2px 2px 6px rgba(0,0,0,0.8)',
    fontWeight: 600,
  },
  '&.dark-text': {
    color: theme.palette.text.primary + ' !important',
    textShadow: '1px 1px 3px rgba(255,255,255,0.5)',
    fontWeight: 600,
  },
  '&.section-title': {
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 800,
  },
}));

function PaginaPrincipalCliente() {
  const [mision, setMision] = useState("");
  const [vision, setVision] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  // Refs para animaciones mejoradas
  const [heroRef, heroVisible] = useScrollAnimation(0.1);
  const [servicesRef, servicesVisible] = useScrollAnimation(0.3);
  const [aboutRef, aboutVisible] = useScrollAnimation(0.3);
  const [testimonialsRef, testimonialsVisible] = useScrollAnimation(0.3);
  const [missionRef, missionVisible] = useScrollAnimation(0.3);
  const [locationRef, locationVisible] = useScrollAnimation(0.3);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const misionResponse = await axios.get("https://backendcentro.onrender.com/api/misionA/mision");
        const visionResponse = await axios.get("https://backendcentro.onrender.com/api/visionA/vision");

        const misionData = misionResponse.data;
        const visionData = visionResponse.data;

        if (Array.isArray(misionData) && misionData.length > 0) {
          setMision(misionData[0].contenido);
        } else {
          setMision("Información no disponible");
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

  const services = [
    {
      title: "Terapias Físicas",
      description: "Tratamientos especializados para recuperar la movilidad y funcionalidad corporal.",
      icon: <Favorite sx={{ color: "#0d9488" }} />,
      color: "#14b8a6",
      gradient: "linear-gradient(135deg, #f0fdfa, #ccfbf1)",
    },
    {
      title: "Fisioterapia",
      description: "Técnicas manuales y ejercicios terapéuticos para aliviar el dolor y mejorar la función.",
      icon: <People sx={{ color: "#0284c7" }} />,
      color: "#0ea5e9",
      gradient: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
    },
    {
      title: "Terapia Dermatofuncional",
      description: "Tratamientos para mejorar la salud y apariencia de la piel y tejidos.",
      icon: <CalendarMonth sx={{ color: "#d97706" }} />,
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #fffbeb, #fef3c7)",
    },
    {
      title: "Vendaje Neuromuscular",
      description: "Técnica terapéutica para estabilizar músculos y articulaciones facilitando su recuperación.",
      icon: <EmojiEvents sx={{ color: "#0d9488" }} />,
      color: "#14b8a6",
      gradient: "linear-gradient(135deg, #f0fdfa, #ccfbf1)",
    },
    {
      title: "Limpieza Facial",
      description: "Tratamientos profesionales para mantener la piel saludable y radiante.",
      icon: <Star sx={{ color: "#0284c7" }} />,
      color: "#0ea5e9",
      gradient: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
    },
    {
      title: "Productos de Limpieza Facial",
      description: "Productos profesionales para el cuidado de la piel disponibles en nuestro centro.",
      icon: <ShoppingBag sx={{ color: "#d97706" }} />,
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #fffbeb, #fef3c7)",
    },
  ];

  const testimonials = [
    {
      name: "Alex Martinez",
      role: "Paciente de Fisioterapia",
      text: "Después de mi accidente, pensé que nunca volvería a caminar normalmente. Gracias al equipo de San Juan, he recuperado mi movilidad y mi independencia.",
      image: imageForBlackBackground4,
      color: "#14b8a6",
    },
    {
      name: "Angela Rodriguez",
      role: "Paciente de Terapia Física",
      text: "El apoyo y la dedicación de los terapeutas ha sido fundamental en mi recuperación. Su enfoque personalizado ha marcado la diferencia en mi proceso.",
      image: imageForBlackBackground5,
      color: "#0ea5e9",
    },
    {
      name: "Cristian Lopez",
      role: "Paciente de Limpieza Facial",
      text: "Los tratamientos faciales son excelentes. Mi piel luce radiante y saludable. Además, los productos que me recomendaron son perfectos para mi tipo de piel.",
      image: imageForBlackBackground6,
      color: "#f59e0b",
    },
  ];

  return (
    <Box component="main" sx={{ overflow: 'hidden' }}>
      <ScrollTop />
      
      {/* Hero Section */}
      <GradientHero ref={heroRef}>
        <Container sx={{ position: 'relative', zIndex: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <Fade in={heroVisible} timeout={1000}>
            <Box sx={{
              background: 'rgba(0,0,0,0.45)',
              borderRadius: 6,
              px: { xs: 2, md: 6 },
              py: { xs: 2, md: 4 },
              boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
              mb: 2,
              display: 'inline-block',
            }}>
              <VisibleText
                variant="h1"
                className="white-text"
                sx={{
                  fontFamily: 'Montserrat, Poppins, Arial',
                  fontSize: { xs: "2.2rem", md: "3.5rem", lg: "4.5rem" },
                  fontWeight: 900,
                  letterSpacing: 1.5,
                  mb: 2,
                  lineHeight: 1.1,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
                  opacity: heroVisible ? 1 : 0,
                  transition: 'all 0.8s ease-in-out',
                }}
              >
                Centro de Rehabilitación Integral SanJuan
              </VisibleText>
              <Divider sx={{ my: 2, background: 'rgba(255,255,255,0.3)' }} />
              <VisibleText
                variant="h5"
                className="white-text"
                sx={{
                  fontFamily: 'Poppins, Arial',
                  fontSize: { xs: "1.1rem", md: "1.6rem" },
                  fontWeight: 500,
                  lineHeight: 1.5,
                  textAlign: 'center',
                  letterSpacing: 0.5,
                  mb: 2,
                  transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                  opacity: heroVisible ? 1 : 0,
                  transition: 'all 0.8s ease-in-out 0.2s',
                }}
              >
                Tu bienestar y recuperación, nuestra prioridad.<br />
                <span style={{ fontWeight: 400, fontSize: '1.1em', opacity: 0.95 }}>
                  Atención profesional y humana para cada etapa de tu rehabilitación.
                </span>
              </VisibleText>
            </Box>
          </Fade>
          <Zoom in={heroVisible} timeout={1500}>
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                mt: 2,
                px: 2,
                py: 1,
                fontFamily: 'Montserrat, Poppins, Arial',
                fontSize: { xs: '1.1rem', md: '1.35rem' },
                fontWeight: 700,
                letterSpacing: 1,
                color: '#ff6b6b',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: 3,
                cursor: 'pointer',
                textShadow: '1px 1px 8px rgba(0,0,0,0.18)',
                transition: 'all 0.2s',
                boxShadow: '0 2px 12px rgba(255,107,107,0.08)',
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'scale(1)' : 'scale(0.8)',
                '&:hover': {
                  color: '#feca57',
                  background: 'rgba(255,255,255,0.18)',
                  textDecoration: 'underline',
                  boxShadow: '0 4px 24px rgba(255,107,107,0.18)',
                },
              }}
              onClick={() => navigate('/cliente/servicios')}
            >
              CONOCE NUESTROS SERVICIOS
            </Box>
          </Zoom>
        </Container>
      </GradientHero>

      {/* Services Section */}
      <GradientSection 
        ref={servicesRef}
        gradient="linear-gradient(180deg, #373b2cff 0%, #297552ff 100%)"
        sx={{ py: 10 }}
      >
        <Container>
          <Fade in={servicesVisible} timeout={800}>
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Chip
                label="Servicios Especializados"
                sx={{
                  mb: 2,
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  transform: servicesVisible ? 'translateY(0)' : 'translateY(20px)',
                  opacity: servicesVisible ? 1 : 0,
                  transition: 'all 0.6s ease-in-out',
                }}
              />
              <VisibleText
                variant="h2"
                className="white-text"
                sx={{
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  fontWeight: 800,
                  mb: 3,
                  transform: servicesVisible ? 'translateY(0)' : 'translateY(30px)',
                  opacity: servicesVisible ? 1 : 0,
                  transition: 'all 0.8s ease-in-out 0.2s',
                }}
              >
                Nuestros Servicios
              </VisibleText>
              <VisibleText 
                variant="h6" 
                className="white-text"
                sx={{ 
                  maxWidth: 600, 
                  mx: "auto", 
                  lineHeight: 1.6,
                  opacity: 0.9,
                  transform: servicesVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.8s ease-in-out 0.4s',
                }}
              >
                Ofrecemos una amplia gama de servicios terapéuticos personalizados para satisfacer tus necesidades específicas
              </VisibleText>
            </Box>
          </Fade>

          <Stack spacing={4}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
              {services.slice(0, 3).map((service, index) => (
                <Slide 
                  key={index}
                  direction="up" 
                  in={servicesVisible} 
                  timeout={800 + index * 200}
                >
                  <FloatingCard
                    sx={{
                      flex: 1,
                      background: service.gradient,
                      border: "none",
                      borderRadius: 4,
                      position: 'relative',
                      transform: servicesVisible ? 'translateY(0)' : 'translateY(50px)',
                      opacity: servicesVisible ? 1 : 0,
                      transition: `all 0.8s ease-in-out ${0.6 + index * 0.2}s`,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: service.color,
                        borderRadius: '16px 16px 0 0',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3, height: "100%" }}>
                      <PulsingIcon bgcolor={alpha(service.color, 0.2)}>
                        {service.icon}
                      </PulsingIcon>
                      
                      <VisibleText variant="h6" className="dark-text" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {service.title}
                      </VisibleText>
                      
                      <VisibleText variant="body2" className="dark-text" sx={{ mb: 2, opacity: 0.8 }}>
                        {service.description}
                      </VisibleText>
                      
                      <Button
                        endIcon={<ArrowForward />}
                        sx={{
                          color: service.color,
                          fontWeight: 600,
                          "&:hover": {
                            backgroundColor: alpha(service.color, 0.1),
                            transform: 'translateX(4px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        Saber más
                      </Button>
                    </CardContent>
                  </FloatingCard>
                </Slide>
              ))}
            </Stack>
            
            <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
              {services.slice(3, 6).map((service, index) => (
                <Slide 
                  key={index + 3}
                  direction="up" 
                  in={servicesVisible} 
                  timeout={1200 + index * 200}
                >
                  <FloatingCard
                    sx={{
                      flex: 1,
                      background: service.gradient,
                      border: "none",
                      borderRadius: 4,
                      position: 'relative',
                      transform: servicesVisible ? 'translateY(0)' : 'translateY(50px)',
                      opacity: servicesVisible ? 1 : 0,
                      transition: `all 0.8s ease-in-out ${1.0 + index * 0.2}s`,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: service.color,
                        borderRadius: '16px 16px 0 0',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3, height: "100%" }}>
                      <PulsingIcon bgcolor={alpha(service.color, 0.2)}>
                        {service.icon}
                      </PulsingIcon>
                      
                      <VisibleText variant="h6" className="dark-text" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {service.title}
                      </VisibleText>
                      
                      <VisibleText variant="body2" className="dark-text" sx={{ mb: 2, opacity: 0.8 }}>
                        {service.description}
                      </VisibleText>
                      
                      <Button
                        endIcon={<ArrowForward />}
                        sx={{
                          color: service.color,
                          fontWeight: 600,
                          "&:hover": {
                            backgroundColor: alpha(service.color, 0.1),
                            transform: 'translateX(4px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        Saber más
                      </Button>
                    </CardContent>
                  </FloatingCard>
                </Slide>
              ))}
            </Stack>
          </Stack>
        </Container>
      </GradientSection>

      {/* Why Choose Us Section */}
      <GradientSection 
        ref={aboutRef}
        gradient="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
        sx={{ py: 10 }}
      >
        <Container>
          <Stack direction={{ xs: "column", lg: "row" }} spacing={8} alignItems="center">
            <Slide direction="right" in={aboutVisible} timeout={1000}>
              <Box sx={{ flex: 1 }}>
                <Paper
                  elevation={20}
                  sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    transform: aboutVisible ? 'scale(1)' : 'scale(0.9)',
                    opacity: aboutVisible ? 1 : 0,
                    transition: 'all 0.8s ease-in-out',
                  }}
                >
                  <img
                    src={imageForBlackBackground2}
                    alt="Equipo médico"
                    style={{
                      width: "100%",
                      height: "500px",
                      objectFit: "cover",
                    }}
                  />
                </Paper>
              </Box>
            </Slide>
            
            <Slide direction="left" in={aboutVisible} timeout={1200}>
              <Box sx={{ flex: 1 }}>
                <Chip
                  label="Nuestra Diferencia"
                  sx={{
                    mb: 2,
                    background: "linear-gradient(45deg, #0ea5e9, #0284c7)",
                    color: "white",
                    fontWeight: 600,
                    transform: aboutVisible ? 'translateX(0)' : 'translateX(-30px)',
                    opacity: aboutVisible ? 1 : 0,
                    transition: 'all 0.6s ease-in-out',
                  }}
                />
                <VisibleText
                  variant="h2"
                  className="section-title"
                  sx={{
                    fontSize: { xs: "2.5rem", md: "3rem" },
                    fontWeight: 800,
                    mb: 3,
                    transform: aboutVisible ? 'translateX(0)' : 'translateX(-30px)',
                    opacity: aboutVisible ? 1 : 0,
                    transition: 'all 0.8s ease-in-out 0.2s',
                  }}
                >
                  ¿Por qué elegirnos?
                </VisibleText>
                <VisibleText 
                  variant="h6" 
                  className="dark-text" 
                  sx={{ 
                    mb: 4, 
                    lineHeight: 1.6,
                    opacity: 0.8,
                    transform: aboutVisible ? 'translateX(0)' : 'translateX(-30px)',
                    transition: 'all 0.8s ease-in-out 0.4s',
                  }}
                >
                  En Centro de Rehabilitación Integral San Juan nos distinguimos por un enfoque 
                  centrado en el paciente, con un equipo de profesionales altamente calificados 
                  y tecnología de vanguardia.
                </VisibleText>

                <Stack spacing={3}>
                  {[
                    {
                      title: "Equipo Especializado",
                      desc: "Profesionales con amplia experiencia en rehabilitación.",
                      color: "#14b8a6",
                    },
                    {
                      title: "Instalaciones Modernas",
                      desc: "Equipamiento de última generación para una rehabilitación efectiva.",
                      color: "#0ea5e9",
                    },
                    {
                      title: "Atención Personalizada",
                      desc: "Planes de tratamiento adaptados a las necesidades de cada paciente.",
                      color: "#f59e0b",
                    },
                    {
                      title: "Citas en Línea",
                      desc: "Sistema de agendamiento de citas fácil y conveniente.",
                      color: "#8b5cf6",
                    },
                  ].map((item, index) => (
                    <Fade key={index} in={aboutVisible} timeout={1400 + index * 200}>
                      <Stack 
                        direction="row" 
                        spacing={2} 
                        alignItems="flex-start"
                        sx={{
                          transform: aboutVisible ? 'translateX(0)' : 'translateX(-20px)',
                          opacity: aboutVisible ? 1 : 0,
                          transition: `all 0.6s ease-in-out ${0.6 + index * 0.1}s`,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 50,
                            height: 50,
                            background: `linear-gradient(135deg, ${item.color}, ${alpha(item.color, 0.7)})`,
                          }}
                        >
                          <CheckCircle sx={{ color: "white" }} />
                        </Avatar>
                        <Box>
                          <VisibleText variant="h6" className="dark-text" sx={{ fontWeight: 'bold' }}>
                            {item.title}
                          </VisibleText>
                          <VisibleText variant="body1" className="dark-text" sx={{ opacity: 0.8 }}>
                            {item.desc}
                          </VisibleText>
                        </Box>
                      </Stack>
                    </Fade>
                  ))}
                </Stack>
              </Box>
            </Slide>
          </Stack>
        </Container>
      </GradientSection>

      {/* Testimonials Section */}
      <GradientSection 
        ref={testimonialsRef}
        gradient="linear-gradient(180deg, #1e293b 0%, #334155 100%)"
        sx={{ py: 10 }}
      >
        <Container>
          <Fade in={testimonialsVisible} timeout={800}>
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Chip
                label="Experiencias"
                sx={{
                  mb: 2,
                  background: "linear-gradient(45deg, #f59e0b, #d97706)",
                  color: "white",
                  fontWeight: 600,
                  transform: testimonialsVisible ? 'translateY(0)' : 'translateY(20px)',
                  opacity: testimonialsVisible ? 1 : 0,
                  transition: 'all 0.6s ease-in-out',
                }}
              />
              <VisibleText
                variant="h2"
                className="white-text"
                sx={{
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  fontWeight: 800,
                  mb: 3,
                  transform: testimonialsVisible ? 'translateY(0)' : 'translateY(30px)',
                  opacity: testimonialsVisible ? 1 : 0,
                  transition: 'all 0.8s ease-in-out 0.2s',
                }}
              >
                Testimonios
              </VisibleText>
              <VisibleText 
                variant="h6" 
                className="white-text"
                sx={{ 
                  maxWidth: 600, 
                  mx: "auto", 
                  lineHeight: 1.6,
                  opacity: 0.9,
                  transform: testimonialsVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.8s ease-in-out 0.4s',
                }}
              >
                Conoce las experiencias de nuestros pacientes que han recuperado su calidad de vida
              </VisibleText>
            </Box>
          </Fade>

          <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Zoom key={index} in={testimonialsVisible} timeout={1000 + index * 300}>
                <Card
                  sx={{
                    flex: 1,
                    background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${alpha(testimonial.color, 0.3)}`,
                    borderRadius: 4,
                    transform: testimonialsVisible ? 'translateY(0)' : 'translateY(50px)',
                    opacity: testimonialsVisible ? 1 : 0,
                    transition: `all 0.8s ease-in-out ${0.6 + index * 0.2}s`,
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: `0 20px 40px ${alpha(testimonial.color, 0.2)}`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                      <Avatar
                        src={testimonial.image}
                        alt={testimonial.name}
                        sx={{
                          width: 60,
                          height: 60,
                          border: `3px solid ${testimonial.color}`,
                        }}
                      />
                      <Box>
                        <VisibleText variant="h6" className="white-text" sx={{ fontWeight: 'bold' }}>
                          {testimonial.name}
                        </VisibleText>
                        <Typography variant="body2" sx={{ color: testimonial.color, fontWeight: 600 }}>
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Stack>
                    
                    <Stack direction="row" spacing={0.5} sx={{ mb: 2 }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} sx={{ color: "#fbbf24", fontSize: 20 }} />
                      ))}
                    </Stack>
                    
                    <VisibleText 
                      variant="body1" 
                      className="white-text"
                      sx={{ 
                        fontStyle: "italic", 
                        lineHeight: 1.6,
                        opacity: 0.95,
                      }}
                    >
                      "{testimonial.text}"
                    </VisibleText>
                  </CardContent>
                </Card>
              </Zoom>
            ))}
          </Stack>
        </Container>
      </GradientSection>

      {/* Mission and Vision Section */}
      <GradientSection 
        ref={missionRef}
        gradient="linear-gradient(135deg, #1a1918ff 0%, #fcb69f 100%)"
        sx={{ py: 10 }}
      >
        <Container>
          <Fade in={missionVisible} timeout={800}>
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Chip
                label="Nuestros Valores"
                sx={{
                  mb: 2,
                  background: "linear-gradient(45deg, #0284c7, #0284c7)",
                  color: "white",
                  fontWeight: 600,
                  transform: missionVisible ? 'translateY(0)' : 'translateY(20px)',
                  opacity: missionVisible ? 1 : 0,
                  transition: 'all 0.6s ease-in-out',
                }}
              />
              <VisibleText
                variant="h2"
                className="section-title"
                sx={{
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  fontWeight: 800,
                  mb: 3,
                  color: '#fff !important',
                  textShadow: '2px 2px 12px rgba(0,0,0,0.35)',
                  WebkitTextFillColor: 'white',
                  background: 'none',
                  transform: missionVisible ? 'translateY(0)' : 'translateY(30px)',
                  opacity: missionVisible ? 1 : 0,
                  transition: 'all 0.8s ease-in-out 0.2s',
                }}
              >
                Misión y Visión
              </VisibleText>
              <VisibleText 
                variant="h6" 
                className="dark-text"
                sx={{ 
                  maxWidth: 600, 
                  mx: "auto", 
                  lineHeight: 1.6,
                  opacity: 0.8,
                  transform: missionVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.8s ease-in-out 0.4s',
                }}
              >
                Conoce los principios que guían nuestro trabajo diario
              </VisibleText>
            </Box>
          </Fade>

          <Stack direction={{ xs: "column", md: "row" }} spacing={6}>
            <Slide direction="right" in={missionVisible} timeout={1000}>
              <Card
                sx={{
                  flex: 1,
                  background: "linear-gradient(135deg, #e0f7fa 0%, #ccfbf1 60%, #14b8a6 100%)",
                  border: "none",
                  borderRadius: 4,
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: '0 4px 32px rgba(20,184,166,0.10)',
                  transform: missionVisible ? 'scale(1)' : 'scale(0.95)',
                  opacity: missionVisible ? 1 : 0,
                  transition: 'all 0.8s ease-in-out',
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 6,
                    background: "linear-gradient(90deg, #14b8a6, #0d9488)",
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <VisibleText 
                    variant="h3" 
                    sx={{ 
                      fontSize: "2rem", 
                      fontWeight: 800, 
                      mb: 3, 
                      color: "#115e59 !important",
                      textShadow: 'none',
                    }}
                  >
                    Misión
                  </VisibleText>
                  {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                      <CircularProgress sx={{ color: "#14b8a6" }} />
                    </Box>
                  ) : error ? (
                    <VisibleText variant="body1" sx={{ color: "error.main !important" }}>
                      {error}
                    </VisibleText>
                  ) : (
                    <VisibleText 
                      variant="body1" 
                      sx={{ 
                        color: "#0f766e !important", 
                        lineHeight: 1.8,
                        fontSize: "1.1rem",
                        textShadow: 'none',
                      }}
                    >
                      {typeof mision === "object" ? "Información no disponible" : mision}
                    </VisibleText>
                  )}
                </CardContent>
              </Card>
            </Slide>

            <Slide direction="left" in={missionVisible} timeout={1200}>
              <Card
                sx={{
                  flex: 1,
                  background: "linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 60%, #0ea5e9 100%)",
                  border: "none",
                  borderRadius: 4,
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: '0 4px 32px rgba(14,165,233,0.10)',
                  transform: missionVisible ? 'scale(1)' : 'scale(0.95)',
                  opacity: missionVisible ? 1 : 0,
                  transition: 'all 0.8s ease-in-out 0.2s',
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 6,
                    background: "linear-gradient(90deg, #62e90eff, #0284c7)",
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <VisibleText 
                    variant="h3" 
                    sx={{ 
                      fontSize: "2rem", 
                      fontWeight: 800, 
                      mb: 3, 
                      color: "#075985 !important",
                      textShadow: 'none',
                    }}
                  >
                    Visión
                  </VisibleText>
                  {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                      <CircularProgress sx={{ color: "#0ea5e9" }} />
                    </Box>
                  ) : error ? (
                    <VisibleText variant="body1" sx={{ color: "error.main !important" }}>
                      {error}
                    </VisibleText>
                  ) : (
                    <VisibleText 
                      variant="body1" 
                      sx={{ 
                        color: "#0369a1 !important", 
                        lineHeight: 1.8,
                        fontSize: "1.1rem",
                        textShadow: 'none',
                      }}
                    >
                      {typeof vision === "object" ? "Información no disponible" : vision}
                    </VisibleText>
                  )}
                </CardContent>
              </Card>
            </Slide>
          </Stack>
        </Container>
      </GradientSection>

      {/* Location and Hours Section */}
      <GradientSection 
        ref={locationRef}
        gradient="linear-gradient(135deg, #191a1dff 0%, #c2e9fb 100%)"
        sx={{ py: 10 }}
      >
        <Container>
          <Fade in={locationVisible} timeout={800}>
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Chip
                label="Información Práctica"
                sx={{
                  mb: 2,
                  background: "linear-gradient(45deg, #f59e0b, #d97706)",
                  color: "white",
                  fontWeight: 600,
                  transform: locationVisible ? 'translateY(0)' : 'translateY(20px)',
                  opacity: locationVisible ? 1 : 0,
                  transition: 'all 0.6s ease-in-out',
                }}
              />
              <VisibleText
                variant="h2"
                className="section-title"
                sx={{
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  fontWeight: 800,
                  mb: 3,
                  color: '#fff !important',
                  textShadow: '2px 2px 12px rgba(0,0,0,0.35)',
                  WebkitTextFillColor: 'white',
                  background: 'none',
                  transform: locationVisible ? 'translateY(0)' : 'translateY(30px)',
                  opacity: locationVisible ? 1 : 0,
                  transition: 'all 0.8s ease-in-out 0.2s',
                }}
              >
                Ubicación y Horarios
              </VisibleText>
              <VisibleText 
                variant="h6" 
                className="dark-text"
                sx={{ 
                  maxWidth: 600, 
                  mx: "auto", 
                  lineHeight: 1.6,
                  opacity: 0.8,
                  transform: locationVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.8s ease-in-out 0.4s',
                }}
              >
                Estamos ubicados en un lugar accesible y contamos con horarios flexibles para tu comodidad
              </VisibleText>
            </Box>
          </Fade>

          <Stack direction={{ xs: "column", lg: "row" }} spacing={6}>
            <Zoom in={locationVisible} timeout={1000}>
              <Paper
                elevation={10}
                sx={{
                  flex: 1,
                  borderRadius: 4,
                  overflow: "hidden",
                  transform: locationVisible ? 'scale(1)' : 'scale(0.9)',
                  opacity: locationVisible ? 1 : 0,
                  transition: 'all 0.8s ease-in-out',
                  "&::before": {
                    content: '""',
                    display: "block",
                    height: 6,
                    background: "linear-gradient(90deg, #14b8a6, #0d9488)",
                  },
                }}
              >
                <Box sx={{ p: 4 }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                    <LocationOn sx={{ color: "#14b8a6", fontSize: 30 }} />
                    <VisibleText variant="h5" className="dark-text" sx={{ fontWeight: 'bold' }}>
                      Nuestra Ubicación
                    </VisibleText>
                  </Stack>
                  <VisibleText variant="body1" className="dark-text" sx={{ mb: 3, opacity: 0.8 }}>
                    Clavel, Aviación Civil, 43000 Huejutla de Reyes, Hgo.
                  </VisibleText>
                  <Box
                    sx={{
                      height: 300,
                      borderRadius: 2,
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
                    />
                  </Box>
                </Box>
              </Paper>
            </Zoom>

            <Zoom in={locationVisible} timeout={1200}>
              <Paper
                elevation={10}
                sx={{
                  flex: 1,
                  borderRadius: 4,
                  overflow: "hidden",
                  transform: locationVisible ? 'scale(1)' : 'scale(0.9)',
                  opacity: locationVisible ? 1 : 0,
                  transition: 'all 0.8s ease-in-out 0.2s',
                  "&::before": {
                    content: '""',
                    display: "block",
                    height: 6,
                    background: "linear-gradient(90deg, #f59e0b, #d97706)",
                  },
                }}
              >
                <Box sx={{ p: 4 }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                    <AccessTime sx={{ color: "#f59e0b", fontSize: 30 }} />
                    <VisibleText variant="h5" className="dark-text" sx={{ fontWeight: 'bold' }}>
                      Horario de Atención
                    </VisibleText>
                  </Stack>

                  <Stack spacing={2} sx={{ mb: 4 }}>
                    {[
                      { day: "Lunes - Viernes", hours: "8:00 AM - 8:00 PM" },
                      { day: "Sábado", hours: "9:00 AM - 2:00 PM" },
                      { day: "Domingo", hours: "Cerrado" },
                    ].map((schedule, index) => (
                      <Fade key={index} in={locationVisible} timeout={1400 + index * 200}>
                        <Paper
                          elevation={2}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            background: alpha("#f59e0b", 0.1),
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transform: locationVisible ? 'translateX(0)' : 'translateX(20px)',
                            opacity: locationVisible ? 1 : 0,
                            transition: `all 0.6s ease-in-out ${0.8 + index * 0.1}s`,
                          }}
                        >
                          <VisibleText variant="subtitle1" className="dark-text" sx={{ fontWeight: 600 }}>
                            {schedule.day}
                          </VisibleText>
                          <Chip
                            label={schedule.hours}
                            sx={{
                              background: "linear-gradient(45deg, #f59e0b, #d97706)",
                              color: "white",
                              fontWeight: 600,
                            }}
                          />
                        </Paper>
                      </Fade>
                    ))}
                  </Stack>

                  <Divider sx={{ my: 3 }} />

                  <Box>
                    <VisibleText variant="h6" className="dark-text" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Agenda tu cita
                    </VisibleText>
                    <VisibleText variant="body1" className="dark-text" sx={{ mb: 3, opacity: 0.8 }}>
                      Puedes agendar tu cita directamente desde nuestra aplicación en los días disponibles.
                    </VisibleText>
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      onClick={() => navigate('/cliente/servicios')}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        background: "linear-gradient(45deg, #f59e0b, #d97706)",
                        transform: locationVisible ? 'translateY(0)' : 'translateY(10px)',
                        opacity: locationVisible ? 1 : 0,
                        transition: 'all 0.8s ease-in-out 1.2s',
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 25px rgba(245, 158, 11, 0.3)",
                        },
                      }}
                    >
                      Agendar Cita
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Zoom>
          </Stack>
        </Container>
      </GradientSection>
    </Box>
  );
}

export default PaginaPrincipalCliente;