import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  CircularProgress,
  Fade,
  Button,
} from "@mui/material";
import { Receipt as ReceiptIcon, ShoppingCart as CartIcon, CalendarToday as CalendarIcon, Download as DownloadIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: "0 16px 32px rgba(0, 0, 0, 0.15)",
  border: "1px solid #e2e8f0",
  backgroundColor: "#ffffff",
  borderRadius: "20px",
  overflow: "hidden",
  marginBottom: "24px",
}));

const InvoiceCard = styled(Paper)(({ theme }) => ({
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
  padding: "32px",
  background: "linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
    transform: "translateY(-4px)",
  },
}));

const PaidBadge = styled(Box)(({ theme }) => ({
  display: "inline-block",
  padding: "6px 16px",
  border: "2px solid #16a34a",
  borderRadius: "8px",
  color: "#16a34a",
  fontSize: "14px",
  fontWeight: "700",
  marginLeft: "16px",
  backgroundColor: "rgba(22, 163, 74, 0.05)",
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: "16px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  backgroundColor: "#ffffff",
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: "12px",
  fontSize: "0.875rem",
  color: "#1e293b",
  borderBottom: "1px solid #e2e8f0",
}));

const CompanyInfo = () => (
  <Box sx={{ mb: 4, p: 3, backgroundColor: "#f1f5f9", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1e293b", mb: 2, fontSize: "1.25rem" }}>
      Centro de Rehabilitación Sepia
    </Typography>
    <Typography variant="body2" sx={{ color: "#475569", mb: 1, fontSize: "0.9rem" }}>
      Calle Clavel, Col. Valle del Encinal, Huejutla, Mexico
    </Typography>
    <Typography variant="body2" sx={{ color: "#475569", mb: 1, fontSize: "0.9rem" }}>
      Teléfono: 771 162 8377 / +52 1 771 162 8377
    </Typography>
    <Typography variant="body2" sx={{ color: "#475569", mb: 1, fontSize: "0.9rem" }}>
      Correo: Ltfmariela@hotmail.com
    </Typography>
    <Typography variant="body2" sx={{ color: "#475569", fontSize: "0.9rem" }}>
      <a href="https://centrorehabilitacion-sepia.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: "#4f46e5", textDecoration: "none", fontWeight: "500" }}>
        https://centrorehabilitacion-sepia.vercel.app
      </a>
    </Typography>
  </Box>
);

const Facturacion = () => {
  const { id } = useParams();
  const [productInvoices, setProductInvoices] = useState([]);
  const [serviceInvoices, setServiceInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const invoiceRefs = useRef({});

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const productResponse = await axios.get(
          `https://backendcentro.onrender.com/api/facturacion/productos/${id}`
        );
        setProductInvoices(productResponse.data);

        const serviceResponse = await axios.get(
          `https://backendcentro.onrender.com/api/facturacion/servicios/${id}`
        );
        setServiceInvoices(serviceResponse.data);
      } catch (error) {
        console.error("Error al cargar facturas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [id]);

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatearNumero = (valor) => {
    const numero = parseFloat(valor);
    return isNaN(numero) ? "0.00" : numero.toFixed(2);
  };

  const calculateProductTotal = (detalles) => {
    return detalles.reduce((total, detalle) => total + parseFloat(detalle.subtotal || 0), 0).toFixed(2);
  };

  const calculateServiceTotal = (invoice) => {
    return formatearNumero(invoice.precio || invoice.costo || 0);
  };

  const handleDownloadInvoice = async (invoiceId, type) => {
    const invoiceElement = invoiceRefs.current[`${type}-${invoiceId}`];
    if (invoiceElement) {
      try {
        const canvas = await html2canvas(invoiceElement, { scale: 2, backgroundColor: "#ffffff" });
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = `factura-${invoiceId}-${type}.png`;
        link.click();
      } catch (error) {
        console.error("Error al generar la captura de la factura:", error);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={700}>
      <Container maxWidth="lg" sx={{ py: 6, px: { xs: 2, sm: 4 } }}>
        <StyledCard>
          <CardContent sx={{ p: 5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4, borderBottom: "2px solid #e2e8f0", pb: 2 }}>
              <ReceiptIcon sx={{ width: 32, height: 32, color: "#4f46e5" }} />
              <Typography variant="h3" component="h1" sx={{ fontWeight: "bold", color: "#1e293b", fontSize: "2.25rem" }}>
                Facturación
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: "#64748b", mb: 5, fontSize: "1.1rem" }}>
              Historial detallado de facturas de productos y servicios
            </Typography>

            {/* Facturas de Productos */}
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
                <CartIcon sx={{ width: 28, height: 28, color: "#f59e0b" }} />
                <Typography variant="h5" component="h2" sx={{ fontWeight: "bold", color: "#1e293b", fontSize: "1.5rem" }}>
                  Facturas de Productos
                </Typography>
              </Box>
              {productInvoices.length === 0 ? (
                <Typography variant="body1" sx={{ color: "#64748b", textAlign: "center", py: 5, fontSize: "1rem" }}>
                  No hay facturas de productos disponibles.
                </Typography>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {productInvoices.map((invoice) => (
                    <InvoiceCard
                      key={invoice.id}
                      elevation={0}
                      ref={(el) => (invoiceRefs.current[`product-${invoice.id}`] = el)}
                    >
                      <CompanyInfo />
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b", fontSize: "1.25rem" }}>
                          Factura #{invoice.id} - {formatearFecha(invoice.fecha_venta)}
                        </Typography>
                        <PaidBadge>Pagado</PaidBadge>
                      </Box>
                      <Typography variant="body2" sx={{ color: "#64748b", mb: 1, fontSize: "0.9rem" }}>
                        Cliente: {invoice.nombre} {invoice.apellidopa} {invoice.apellidoma}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#64748b", mb: 1, fontSize: "0.9rem" }}>
                        Correo: {invoice.gmail}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#64748b", mb: 2, fontSize: "0.9rem" }}>
                        Método de Pago: {invoice.metodo_pago}
                      </Typography>
                      <Divider sx={{ my: 3, borderColor: "#e2e8f0" }} />
                      <StyledTableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <StyledTableCell sx={{ fontWeight: 600 }}>Producto</StyledTableCell>
                              <StyledTableCell sx={{ fontWeight: 600 }} align="right">Cantidad</StyledTableCell>
                              <StyledTableCell sx={{ fontWeight: 600 }} align="right">Precio Unitario</StyledTableCell>
                              <StyledTableCell sx={{ fontWeight: 600 }} align="right">Subtotal</StyledTableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {invoice.detalles.map((detalle) => (
                              <TableRow key={detalle.id}>
                                <StyledTableCell>{detalle.nombre_producto}</StyledTableCell>
                                <StyledTableCell align="right">{detalle.cantidad}</StyledTableCell>
                                <StyledTableCell align="right">${formatearNumero(detalle.precio)}</StyledTableCell>
                                <StyledTableCell align="right">${formatearNumero(detalle.subtotal)}</StyledTableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </StyledTableContainer>
                      <Divider sx={{ my: 3, borderColor: "#e2e8f0" }} />
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: "#1e293b", mb: 1, fontSize: "1rem" }}>
                          Subtotal: ${calculateProductTotal(invoice.detalles)}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: "#1e293b", fontSize: "1.1rem" }}>
                          Total: ${calculateProductTotal(invoice.detalles)}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 3, textAlign: "right" }}>
                        <Button
                          variant="contained"
                          startIcon={<DownloadIcon />}
                          sx={{
                            backgroundColor: "#4f46e5",
                            "&:hover": { backgroundColor: "#4338ca" },
                            borderRadius: "10px",
                            padding: "8px 24px",
                            textTransform: "none",
                            fontWeight: 600,
                          }}
                          onClick={() => handleDownloadInvoice(invoice.id, "product")}
                        >
                          Descargar Factura
                        </Button>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 3, textAlign: "center", color: "#4caf50", fontSize: "0.9rem" }}>
                        ¡Gracias por su compra! Apreciamos su preferencia.
                      </Typography>
                    </InvoiceCard>
                  ))}
                </Box>
              )}
            </Box>

            {/* Facturas de Servicios */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
                <CalendarIcon sx={{ width: 28, height: 28, color: "#16a34a" }} />
                <Typography variant="h5" component="h2" sx={{ fontWeight: "bold", color: "#1e293b", fontSize: "1.5rem" }}>
                  Facturas de Servicios
                </Typography>
              </Box>
              {serviceInvoices.length === 0 ? (
                <Typography variant="body1" sx={{ color: "#64748b", textAlign: "center", py: 5, fontSize: "1rem" }}>
                  No hay facturas de servicios disponibles.
                </Typography>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {serviceInvoices.map((invoice) => (
                    <InvoiceCard
                      key={invoice.id}
                      elevation={0}
                      ref={(el) => (invoiceRefs.current[`service-${invoice.id}`] = el)}
                    >
                      <CompanyInfo />
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b", fontSize: "1.25rem" }}>
                          Factura #{invoice.id} - {formatearFecha(invoice.fecha_cita)}
                        </Typography>
                        <PaidBadge>Pagado</PaidBadge>
                      </Box>
                      <Typography variant="body2" sx={{ color: "#64748b", mb: 1, fontSize: "0.9rem" }}>
                        Cliente: {invoice.nombre} {invoice.apellidopa} {invoice.apellidoma}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#64748b", mb: 1, fontSize: "0.9rem" }}>
                        Correo: {invoice.gmail}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#64748b", mb: 1, fontSize: "0.9rem" }}>
                        Servicio: {invoice.nombre_servicio}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#64748b", mb: 1, fontSize: "0.9rem" }}>
                        Hora: {invoice.hora_inicio} - {invoice.hora_fin}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#64748b", mb: 1, fontSize: "0.9rem" }}>
                        Método de Pago: {invoice.metodo_pago}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#64748b", mb: 1, fontSize: "0.9rem" }}>
                        Estado: {invoice.estado}
                      </Typography>
                      {invoice.observaciones && (
                        <>
                          <Divider sx={{ my: 3, borderColor: "#e2e8f0" }} />
                          <Typography variant="body1" sx={{ fontWeight: 500, color: "#1e293b", mb: 1, fontSize: "1rem" }}>
                            Observaciones:
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#64748b", fontSize: "0.9rem" }}>
                            {invoice.observaciones}
                          </Typography>
                        </>
                      )}
                      <Divider sx={{ my: 3, borderColor: "#e2e8f0" }} />
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: "#1e293b", mb: 1, fontSize: "1rem" }}>
                          Subtotal: ${calculateServiceTotal(invoice)}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: "#1e293b", fontSize: "1.1rem" }}>
                          Total: ${calculateServiceTotal(invoice)}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 3, textAlign: "right" }}>
                        <Button
                          variant="contained"
                          startIcon={<DownloadIcon />}
                          sx={{
                            backgroundColor: "#4f46e5",
                            "&:hover": { backgroundColor: "#4338ca" },
                            borderRadius: "10px",
                            padding: "8px 24px",
                            textTransform: "none",
                            fontWeight: 600,
                          }}
                          onClick={() => handleDownloadInvoice(invoice.id, "service")}
                        >
                          Descargar Factura
                        </Button>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 3, textAlign: "center", color: "#4caf50", fontSize: "0.9rem" }}>
                        ¡Gracias por su preferencia! Esperamos verle de nuevo.
                      </Typography>
                    </InvoiceCard>
                  ))}
                </Box>
              )}
            </Box>
          </CardContent>
        </StyledCard>
      </Container>
    </Fade>
  );
};

export default Facturacion;