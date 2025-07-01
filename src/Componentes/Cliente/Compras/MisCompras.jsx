"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  Container,
  Paper,
  Avatar,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material"
import { ShoppingBag, CalendarToday, Payment, LocalShipping, ShoppingCart, Receipt } from "@mui/icons-material"

const MisCompras = () => {
  const { idUsuario } = useParams()
  const [agrupadas, setAgrupadas] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`https://backendcentro.onrender.com/api/cliente/misCompras/${idUsuario}`)
        const data = res.data

        const agrupadasPorVenta = data.reduce((acc, item) => {
          if (!acc[item.id_venta]) {
            acc[item.id_venta] = {
              fecha_venta: item.fecha_venta,
              metodo_pago: item.metodo_pago,
              estado_entrega: item.estado_entrega,
              productos: [],
            }
          }
          acc[item.id_venta].productos.push(item)
          return acc
        }, {})

        setAgrupadas(agrupadasPorVenta)
      } catch (error) {
        console.error("Error al obtener las compras:", error)
        setError("Error al cargar las compras. Por favor, intenta nuevamente.")
      } finally {
        setLoading(false)
      }
    }

    fetchCompras()
  }, [idUsuario])

  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case "entregado":
        return "success"
      case "en camino":
      case "enviado":
        return "warning"
      case "pendiente":
        return "warning"
      case "cancelado":
        return "error"
      default:
        return "default"
    }
  }

  const getEstadoIcon = (estado) => {
    switch (estado?.toLowerCase()) {
      case "entregado":
        return <LocalShipping />
      case "en camino":
      case "enviado":
        return <LocalShipping />
      case "pendiente":
        return <Receipt />
      default:
        return <ShoppingCart />
    }
  }

  const calcularTotalVenta = (productos) => {
    return productos.reduce((total, producto) => total + Number.parseFloat(producto.subtotal || 0), 0)
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "success.main",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <ShoppingBag fontSize="large" />
          Mis Compras
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Historial completo de tus pedidos
        </Typography>
      </Box>

      {Object.keys(agrupadas).length === 0 ? (
        <Paper
          elevation={2}
          sx={{
            p: 6,
            textAlign: "center",
            backgroundColor: "grey.50",
          }}
        >
          <ShoppingCart sx={{ fontSize: 80, color: "grey.400", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tienes compras registradas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cuando realices tu primera compra, aparecerá aquí
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {Object.entries(agrupadas).map(([idVenta, datos]) => (
            <Grid item xs={12} key={idVenta}>
              <Card
                elevation={3}
                sx={{
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    elevation: 6,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Header de la venta */}
                  <Box sx={{ mb: 3 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      flexWrap="wrap"
                      gap={2}
                    >
                      <Box>
                        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: "bold" }}>
                          Compra #{idVenta}
                        </Typography>
                        <Stack direction="row" spacing={3} flexWrap="wrap" sx={{ mt: 1 }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <CalendarToday fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {new Date(datos.fecha_venta).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                      <Chip
                        icon={getEstadoIcon(datos.estado_entrega)}
                        label={datos.estado_entrega}
                        color={getEstadoColor(datos.estado_entrega)}
                        variant="filled"
                        sx={{ fontWeight: "medium" }}
                      />
                    </Stack>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* Lista de productos */}
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "medium", mb: 2 }}>
                    Productos ({datos.productos.length})
                  </Typography>

                  <List disablePadding>
                    {datos.productos.map((producto, idx) => (
                      <React.Fragment key={idx}>
                        <ListItem
                          disablePadding
                          sx={{
                            py: 2,
                            backgroundColor: idx % 2 === 0 ? "transparent" : "grey.50",
                            borderRadius: 1,
                            mb: 1,
                          }}
                        >
                          <Avatar
                            sx={{
                              mr: 2,
                              bgcolor: "success.light", // Cambiar de "primary.light" a "success.light"
                              width: 48,
                              height: 48,
                            }}
                          >
                            <ShoppingBag />
                          </Avatar>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                                {producto.nombre_producto}
                              </Typography>
                            }
                            secondary={
                              <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Cantidad: <strong>{producto.cantidad}</strong>
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Precio: <strong>${Number.parseFloat(producto.precio).toFixed(2)}</strong>
                                </Typography>
                                <Typography variant="body2" color="success.main" sx={{ fontWeight: "bold" }}>
                                  Subtotal: ${Number.parseFloat(producto.subtotal).toFixed(2)}
                                </Typography>
                              </Stack>
                            }
                          />
                        </ListItem>
                      </React.Fragment>
                    ))}
                  </List>

                  <Divider sx={{ my: 2 }} />

                  {/* Total de la venta */}
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="h6" color="success.main" sx={{ fontWeight: "bold" }}>
                      Total: ${calcularTotalVenta(datos.productos).toFixed(2)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default MisCompras
