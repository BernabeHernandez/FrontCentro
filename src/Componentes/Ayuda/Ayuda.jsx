import React, { useState } from "react";
import {
  Typography,
  Container,
  Box,
  TextField,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Fade,
} from "@mui/material";
import {
  ShoppingCart,
  Undo,
  HelpOutline,
  Security,
  Headset,
  Search,
} from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  background: "linear-gradient(145deg, #ffffff 0%, #f5f7fa 100%)",
  border: "1px solid #e0e4e8",
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  borderRadius: 8,
  marginBottom: theme.spacing(1),
  "&:before": {
    display: "none",
  },
  "&.Mui-expanded": {
    margin: theme.spacing(1, 0),
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  borderRadius: 8,
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.grey[100],
  },
}));

const Ayuda = () => {
  const [showFAQ, setShowFAQ] = useState(false);

  return (
    <Fade in={true} timeout={700}>
      <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh", py: 6 }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              Centro de Ayuda
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 4, maxWidth: "600px", mx: "auto" }}>
              Encuentra respuestas a tus preguntas frecuentes y obtén asistencia sobre nuestros servicios de manera rápida y sencilla.
            </Typography>

            {/* Barra de búsqueda */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 6 }}>
              <TextField
                variant="outlined"
                placeholder="¿Con qué podemos ayudarte?"
                sx={{
                  maxWidth: "500px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "24px",
                    backgroundColor: "#fff",
                  },
                }}
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<Search />}
                sx={{ borderRadius: "24px", px: 4, py: 1.5, textTransform: "none" }}
              >
                Buscar
              </Button>
            </Box>
          </Box>

          {/* Contenido principal */}
          <StyledPaper elevation={0}>
            <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
              Temas de Ayuda
            </Typography>
            <Divider sx={{ mb: 3, borderColor: "primary.main", borderWidth: 1 }} />

            <List>
              <StyledAccordion>
                <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <ListItemIcon>
                    <ShoppingCart sx={{ color: "#FF5733" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="h6" sx={{ color: "#FF5733" }}>
                        Compras
                      </Typography>
                    }
                  />
                </StyledAccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" color="text.secondary">
                    Administra y cancela compras, paga, sigue envíos, modifica, reclama o cancela tus pedidos fácilmente.
                  </Typography>
                </AccordionDetails>
              </StyledAccordion>

              <StyledAccordion>
                <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <ListItemIcon>
                    <Undo sx={{ color: "#33A1FF" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="h6" sx={{ color: "#33A1FF" }}>
                        Devoluciones y reembolsos
                      </Typography>
                    }
                  />
                </StyledAccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" color="text.secondary">
                    Aprende cómo devolver un producto o consulta sobre reintegros de dinero de tus compras.
                  </Typography>
                </AccordionDetails>
              </StyledAccordion>

              <StyledAccordion expanded={showFAQ} onChange={() => setShowFAQ(!showFAQ)}>
                <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <ListItemIcon>
                    <HelpOutline sx={{ color: "#FFC300" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="h6" sx={{ color: "#FFC300" }}>
                        Preguntas Frecuentes
                      </Typography>
                    }
                  />
                </StyledAccordionSummary>
                <AccordionDetails>
                  <Box>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      <strong>¿Cómo agendo una cita?</strong> Dirígete a la sección de servicios, selecciona el servicio deseado y haz clic en "Sacar cita". Luego, elige el día y la hora disponibles para completar la reserva.
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                      <strong>¿Cuáles son los métodos de pago aceptados?</strong> Aceptamos tarjetas de crédito/débito, transferencias bancarias y pagos en efectivo.
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                      <strong>¿Puedo cancelar o modificar una cita?</strong> Sí, contáctanos con al menos 24 horas de anticipación.
                    </Typography>
                  </Box>
                </AccordionDetails>
              </StyledAccordion>

              <StyledAccordion>
                <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <ListItemIcon>
                    <Security sx={{ color: "#28A745" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="h6" sx={{ color: "#28A745" }}>
                        Ayuda sobre tu cuenta
                      </Typography>
                    }
                  />
                </StyledAccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" color="text.secondary">
                    Gestiona tu perfil, mejora la seguridad y resuelve problemas de acceso a tu cuenta.
                  </Typography>
                </AccordionDetails>
              </StyledAccordion>

              <StyledAccordion>
                <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <ListItemIcon>
                    <Headset sx={{ color: "#8E44AD" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="h6" sx={{ color: "#8E44AD" }}>
                        ¿Necesitas más ayuda?
                      </Typography>
                    }
                  />
                </StyledAccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    Estamos aquí para ayudarte. Contáctanos a través de nuestro formulario o llámanos directamente.
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 2, borderRadius: "20px", textTransform: "none" }}
                  >
                    Contactar soporte
                  </Button>
                </AccordionDetails>
              </StyledAccordion>
            </List>
          </StyledPaper>
        </Container>
      </Box>
    </Fade>
  );
};

export default Ayuda;