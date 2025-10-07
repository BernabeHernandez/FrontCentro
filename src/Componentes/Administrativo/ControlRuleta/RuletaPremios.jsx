import { useEffect, useState } from "react"
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Container,
  Card,
  CardContent,
  CardActions,
  Divider,
  Chip,
  IconButton,
  InputAdornment,
} from "@mui/material"
import {
  EmojiEvents as TrophyIcon,
  Save as SaveIcon,
  Percent as PercentIcon,
  Casino as CasinoIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material"
import axios from "axios"

const RuletaPremios = () => {
  const [premios, setPremios] = useState([])
  const [loading, setLoading] = useState(true)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
  const [savingId, setSavingId] = useState(null)

  // Obtener premios de la API
  const fetchPremios = async () => {
    try {
      setLoading(true)
      const res = await axios.get("https://backendcentro.onrender.com/api/ruleta-premios")
      setPremios(res.data)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setSnackbar({ open: true, message: "Error al cargar premios", severity: "error" })
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPremios()
  }, [])

  // Actualizar premio
  const handleUpdate = async (id, porcentaje) => {
    try {
      setSavingId(id)
      await axios.put("https://backendcentro.onrender.com/api/ruleta-premios", { id, porcentaje: Number.parseFloat(porcentaje) })
      setSnackbar({ open: true, message: "Premio actualizado exitosamente", severity: "success" })
      fetchPremios()
    } catch (error) {
      console.error(error)
      setSnackbar({ open: true, message: "Error al actualizar premio", severity: "error" })
    } finally {
      setSavingId(null)
    }
  }

  // Calcular total de porcentajes
  const totalPorcentaje = premios.reduce((sum, p) => sum + Number.parseFloat(p.porcentaje || 0), 0)

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: 2,
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Cargando premios...
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,rgb(255, 255, 255) 0%,rgb(253, 252, 254) 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Paper
          elevation={8}
          sx={{
            p: 4,
            mb: 4,
            background: "linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)",
            borderRadius: 3,
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: 2,
                  p: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CasinoIcon sx={{ fontSize: 40, color: "white" }} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="text.primary">
                  Configuración de Premios
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Administra los porcentajes de probabilidad de cada premio
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={fetchPremios}
              sx={{
                bgcolor: "primary.main",
                color: "white",
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Box>

          <Divider sx={{ my: 3 }} />
        </Paper>

        {/* Grid de Premios */}
        <Grid container spacing={3}>
          {premios.map((premio, index) => (
            <Grid item xs={12} sm={6} md={4} key={premio.id}>
              <Card
                elevation={6}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 12,
                  },
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                {/* Card Header con color */}
                <Box
                  sx={{
                    background: `linear-gradient(135deg, ${getGradientColors(index)})`,
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TrophyIcon sx={{ color: "white", fontSize: 28 }} />
                    <Typography variant="h6" fontWeight="bold" color="white">
                      Premio {premio.id}
                    </Typography>
                  </Box>
                  <Chip
                    label={`${premio.porcentaje}%`}
                    size="small"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.3)",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <TextField
                    label="Porcentaje de Probabilidad"
                    type="number"
                    value={premio.porcentaje}
                    onChange={(e) => {
                      const newValue = e.target.value
                      setPremios((prev) => prev.map((p) => (p.id === premio.id ? { ...p, porcentaje: newValue } : p)))
                    }}
                    fullWidth
                    variant="outlined"
                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <PercentIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                    Ingresa un valor entre 0 y 100
                  </Typography>
                </CardContent>

                <Divider />

                <CardActions sx={{ p: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={savingId === premio.id ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    onClick={() => handleUpdate(premio.id, premio.porcentaje)}
                    disabled={savingId === premio.id}
                    sx={{
                      background: `linear-gradient(135deg, ${getGradientColors(index)})`,
                      fontWeight: "bold",
                      py: 1.5,
                      "&:hover": {
                        opacity: 0.9,
                      },
                    }}
                  >
                    {savingId === premio.id ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          elevation={6}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

// Función auxiliar para generar colores de gradiente
const getGradientColors = (index) => {
  const gradients = [
    "#667eea 0%, #764ba2 100%",
    "#f093fb 0%, #f5576c 100%",
    "#4facfe 0%, #00f2fe 100%",
    "#43e97b 0%, #38f9d7 100%",
    "#fa709a 0%, #fee140 100%",
    "#30cfd0 0%, #330867 100%",
    "#a8edea 0%, #fed6e3 100%",
    "#ff9a9e 0%, #fecfef 100%",
    "#ffecd2 0%, #fcb69f 100%",
  ]
  return gradients[index % gradients.length]
}

export default RuletaPremios
