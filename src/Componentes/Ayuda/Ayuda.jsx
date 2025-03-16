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

const Ayuda = () => {
  const [showFAQ, setShowFAQ] = useState(false);

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: "center" }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
          Centro de Ayuda
        </Typography>
        <Typography variant="body1" sx={{ color: "#555", mb: 4 }}>
          Aquí encontrarás respuestas a preguntas frecuentes y asistencia sobre nuestros servicios.
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="¿Con qué podemos ayudarte?"
            sx={{ maxWidth: "500px" }}
          />
          <Button variant="contained" color="primary" startIcon={<Search />}>
            Buscar
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 3, borderRadius: "12px", backgroundColor: "#f9f9f9" }}>
          <List>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <ListItemIcon>
                  <ShoppingCart sx={{ color: "#FF5733" }} />
                </ListItemIcon>
                <Typography variant="h6" sx={{ color: "#FF5733" }}>
                  Compras
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" sx={{ color: "#666" }}>
                  Administrar y cancelar compras, pagar, seguir envíos, modificar, reclamar o cancelar compras.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <ListItemIcon>
                  <Undo sx={{ color: "#33A1FF" }} />
                </ListItemIcon>
                <Typography variant="h6" sx={{ color: "#33A1FF" }}>
                  Devoluciones y reembolsos
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" sx={{ color: "#666" }}>
                  Devolver un producto o consultar por reintegros de dinero de una compra.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={showFAQ} onChange={() => setShowFAQ(!showFAQ)}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <ListItemIcon>
                  <HelpOutline sx={{ color: "#FFC300" }} />
                </ListItemIcon>
                <Typography variant="h6" sx={{ color: "#FFC300" }}>
                  Preguntas Frecuentes
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" sx={{ color: "#666" }}>
                  <strong>¿Cómo agendo una cita?</strong> Para agendar una cita, dirígete a la sección de servicios, selecciona el servicio deseado y haz clic en "Sacar cita". Luego, elige el día y la hora disponibles para completar la reserva.
                </Typography>
                <Typography variant="body1" sx={{ color: "#666", mt: 2 }}>
                  <strong>¿Cuáles son los métodos de pago aceptados?</strong> Aceptamos tarjetas de crédito/débito, transferencias bancarias y pagos en efectivo.
                </Typography>
                <Typography variant="body1" sx={{ color: "#666", mt: 2 }}>
                  <strong>¿Puedo cancelar o modificar una cita?</strong> Sí, contáctanos con al menos 24 horas de anticipación.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <ListItemIcon>
                  <Security sx={{ color: "#28A745" }} />
                </ListItemIcon>
                <Typography variant="h6" sx={{ color: "#28A745" }}>
                  Ayuda sobre tu cuenta
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" sx={{ color: "#666" }}>
                  Perfil, seguridad y acceso a la cuenta.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <ListItemIcon>
                  <Headset sx={{ color: "#8E44AD" }} />
                </ListItemIcon>
                <Typography variant="h6" sx={{ color: "#8E44AD" }}>
                  ¿Necesitas más ayuda?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" sx={{ color: "#666" }}>
                  Contáctanos.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default Ayuda;