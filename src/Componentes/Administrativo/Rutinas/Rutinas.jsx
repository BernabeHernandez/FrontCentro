"use client"

import { useState, useEffect } from "react"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Chip,
  Alert,
  AlertTitle,
  Typography,
  Box,
  Grid,
  IconButton,
  CircularProgress,
  Snackbar,
  Paper,
  Divider,
  Container,
  Stack,
} from "@mui/material"
import {
  Delete as Trash2,
  Edit,
  Add as Plus,
  Image as ImageIcon,
  Close as X,
  CloudUpload,
} from "@mui/icons-material"

export default function Rutinas() {
  const [rutinas, setRutinas] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRutina, setEditingRutina] = useState(null)
  const [loading, setLoading] = useState(false)
  const [backendConnected, setBackendConnected] = useState(null)
  const [useLocalMode, setUseLocalMode] = useState(false)
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
  pasos: [], // [{ nombre, descripcion, tiempo_estimado, repeticiones, descanso, imagen }]
  })
  const [imageFiles, setImageFiles] = useState([])
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })

  const API_BASE_URL = "https://backendcentro.onrender.com/api/rutinas"

  const showToast = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity })
  }

  const verificarConexionBackend = async () => {
    try {
      console.log("[v0] Intentando conectar a:", API_BASE_URL)
      const controller = new AbortController()
      const response = await fetch(API_BASE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      })
      console.log("[v0] Respuesta del backend:", response.status, response.statusText)
      setBackendConnected(response.ok)
      return response.ok
    } catch (error) {
      console.log("[v0] Error específico de conexión:", {
        name: error.name,
        message: error.message,
        cause: error.cause,
      })

      let errorMessage = "Error desconocido"
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        errorMessage = "El servidor no está disponible o hay un problema de CORS"
      } else if (error.name === "AbortError") {
        errorMessage = "Timeout - el servidor tardó demasiado en responder"
      } else if (error.message.includes("NetworkError")) {
        errorMessage = "Error de red - verifica que el servidor esté corriendo"
      }

      console.log("[v0] Diagnóstico:", errorMessage)
      setBackendConnected(false)
      return false
    }
  }

  const cargarRutinas = async () => {
    try {
      setLoading(true)

      const isConnected = await verificarConexionBackend()

      if (isConnected && !useLocalMode) {
        const response = await fetch(API_BASE_URL)
        if (!response.ok) throw new Error("Error al cargar rutinas")
        const data = await response.json()
        setRutinas(data)
      } else {
        const localRutinas = localStorage.getItem("rutinas-local")
        if (localRutinas) {
          setRutinas(JSON.parse(localRutinas))
        } else {
          setRutinas([])
        }
        setUseLocalMode(true)
      }
    } catch (error) {
      console.error("[v0] Error cargando rutinas:", error)
      setUseLocalMode(true)
      const localRutinas = localStorage.getItem("rutinas-local")
      if (localRutinas) {
        setRutinas(JSON.parse(localRutinas))
      } else {
        setRutinas([])
      }

      if (!useLocalMode) {
        showToast("No se pudo conectar al backend. Usando almacenamiento local.", "info")
      }
    } finally {
      setLoading(false)
    }
  }

  const guardarEnLocal = (nuevasRutinas) => {
    localStorage.setItem("rutinas-local", JSON.stringify(nuevasRutinas))
    setRutinas(nuevasRutinas)
  }
  

  useEffect(() => {
    cargarRutinas()
  }, [])

  const agregarPaso = () => {
    setFormData((prev) => ({
      ...prev,
      pasos: [
        ...prev.pasos,
        {
          nombre: "",
          descripcion: "",
          tiempo_estimado: "",
          repeticiones: "",
          descanso: "",
          imagen: null,
        },
      ],
    }))
    setImageFiles((prev) => [...prev, null])
  }

  const eliminarPaso = (index) => {
    setFormData((prev) => ({
      ...prev,
      pasos: prev.pasos.filter((_, i) => i !== index),
    }))
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const actualizarPaso = (index, campo, valor) => {
    setFormData((prev) => ({
      ...prev,
      pasos: prev.pasos.map((paso, i) => (i === index ? { ...paso, [campo]: valor } : paso)),
    }))
  }

  const manejarImagenPaso = (index, file) => {
    if (file) {
      const newImageFiles = [...imageFiles]
      newImageFiles[index] = file
      setImageFiles(newImageFiles)

      const reader = new FileReader()
      reader.onload = (e) => {
        actualizarPaso(index, "imagen", e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const guardarRutina = async () => {
    if (!formData.titulo.trim() || !formData.descripcion.trim()) {
      showToast("Por favor completa el título y la descripción", "error")
      return
    }

    if (formData.pasos.length === 0) {
      showToast("Debe agregar al menos un paso a la rutina", "error")
      return
    }

    // Validar campos de pasos
    for (const paso of formData.pasos) {
      if (!paso.nombre.trim()) {
        showToast("Cada paso debe tener un nombre", "error")
        return
      }
    }

    try {
      setLoading(true)

      if (useLocalMode || !backendConnected) {
        const rutinaNueva = {
          ...formData,
          id_rutina: editingRutina ? editingRutina.id_rutina : Date.now(),
          fechaCreacion: editingRutina ? editingRutina.fechaCreacion : new Date().toISOString(),
        }

        let nuevasRutinas
        if (editingRutina) {
          nuevasRutinas = rutinas.map((r) => (r.id_rutina === editingRutina.id_rutina ? rutinaNueva : r))
        } else {
          nuevasRutinas = [...rutinas, rutinaNueva]
        }
        guardarEnLocal(nuevasRutinas)
      } else {
        const formDataToSend = new FormData()
        formDataToSend.append("titulo", formData.titulo)
        formDataToSend.append("descripcion", formData.descripcion)

        // Mapear los pasos a la nueva estructura
        const pasosParaEnviar = formData.pasos.map((paso) => ({
          nombre: paso.nombre,
          descripcion: paso.descripcion,
          tiempo_estimado: paso.tiempo_estimado,
          repeticiones: paso.repeticiones,
          descanso: paso.descanso,
        }))
        formDataToSend.append("pasos", JSON.stringify(pasosParaEnviar))

        imageFiles.forEach((file, index) => {
          if (file) {
            formDataToSend.append("imagenes", file)
          }
        })

        let response
        if (editingRutina) {
          response = await fetch(`${API_BASE_URL}/${editingRutina.id_rutina}`, {
            method: "PUT",
            body: formDataToSend,
          })
        } else {
          response = await fetch(API_BASE_URL, {
            method: "POST",
            body: formDataToSend,
          })
        }

        if (!response.ok) throw new Error("Error al guardar rutina")
        await cargarRutinas()
      }

      showToast(editingRutina ? "Rutina actualizada correctamente" : "Rutina creada correctamente", "success")
      resetearFormulario()
    } catch (error) {
      console.error("[v0] Error guardando rutina:", error)
      showToast("No se pudo guardar la rutina", "error")
    } finally {
      setLoading(false)
    }
  }

  const eliminarRutina = async (id) => {
    try {
      setLoading(true)

      if (useLocalMode || !backendConnected) {
        const nuevasRutinas = rutinas.filter((r) => r.id_rutina !== id)
        guardarEnLocal(nuevasRutinas)
      } else {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) throw new Error("Error al eliminar rutina")
        await cargarRutinas()
      }

      showToast("La rutina ha sido eliminada correctamente", "success")
    } catch (error) {
      console.error("[v0] Error eliminando rutina:", error)
      showToast("No se pudo eliminar la rutina", "error")
    } finally {
      setLoading(false)
    }
  }

  const editarRutina = (rutina) => {
    setEditingRutina(rutina)
    setFormData({
      titulo: rutina.titulo,
      descripcion: rutina.descripcion,
      pasos: (rutina.pasos || []).map((paso) => ({
        nombre: paso.nombre || "",
        descripcion: paso.descripcion || "",
        tiempo_estimado: paso.tiempo_estimado || "",
        repeticiones: paso.repeticiones || "",
        descanso: paso.descanso || "",
        imagen: paso.imagen || null,
      })),
    })
    setImageFiles(new Array(rutina.pasos?.length || 0).fill(null))
    setIsDialogOpen(true)
  }

  const resetearFormulario = () => {
    setFormData({
      titulo: "",
      descripcion: "",
      pasos: [],
    })
    setImageFiles([])
    setEditingRutina(null)
    setIsDialogOpen(false)
  }

  const toggleModoLocal = () => {
    setUseLocalMode(!useLocalMode)
    cargarRutinas()
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {backendConnected === false && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle>Conexión Backend</AlertTitle>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="body2">
                No se pudo conectar al backend en {API_BASE_URL}.
                {useLocalMode ? " Usando modo local." : " Cambiando a modo local..."}
              </Typography>
             
            </Box>
            <Button variant="outlined" size="small" onClick={() => cargarRutinas()} sx={{ ml: 2 }}>
              Reintentar
            </Button>
          </Box>
        </Alert>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Typography variant="h3" component="h1" fontWeight="bold">
              Rutinas de Rehabilitación
            </Typography>
        
          </Box>
          <Typography variant="body1" color="text.secondary">
            Gestiona las rutinas de ejercicios para pacientes
            {useLocalMode && " (Modo local - datos guardados en el navegador)"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
         

          <Button
            variant="contained"
            startIcon={<Plus />}
            onClick={() => {
              resetearFormulario()
              setIsDialogOpen(true)
            }}
            disabled={loading}
          >
            Nueva Rutina
          </Button>
        </Box>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && rutinas.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: "center" }}>
          <ImageIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" fontWeight="600" sx={{ mb: 1 }}>
            No hay rutinas creadas
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Comienza creando tu primera rutina de rehabilitación para tus pacientes.
          </Typography>
          <Button variant="contained" startIcon={<Plus />} onClick={() => setIsDialogOpen(true)}>
            Crear Primera Rutina
          </Button>
        </Paper>
      ) : (
        !loading && (
          <Grid container spacing={3}>
            {rutinas.map((rutina) => (
              <Grid item xs={12} md={6} lg={4} key={rutina.id_rutina}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column", "&:hover": { boxShadow: 4 } }}>
                  <CardHeader
                    title={
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" component="h3" sx={{ mb: 0.5 }}>
                            {rutina.titulo}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Creada el {new Date(rutina.fechaCreacion || Date.now()).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Chip label={`${rutina.pasos?.length || 0} pasos`} size="small" color="default" />
                      </Box>
                    }
                  />

                  <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
                      {rutina.descripcion}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
                        Pasos:
                      </Typography>
                      <Stack spacing={0.5}>
                        {rutina.pasos?.slice(0, 3).map((paso, index) => (
                          <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                bgcolor: "primary.light",
                                color: "primary.main",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                              }}
                            >
                              {index + 1}
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                            >
                              {paso.nombre}
                            </Typography>
                          </Box>
                        ))}
                        {rutina.pasos?.length > 3 && (
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 3 }}>
                            +{rutina.pasos.length - 3} pasos más
                          </Typography>
                        )}
                      </Stack>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        onClick={() => editarRutina(rutina)}
                        variant="outlined"
                        size="small"
                        startIcon={<Edit />}
                        sx={{ flex: 1 }}
                        disabled={loading}
                      >
                        Editar
                      </Button>
                      <IconButton onClick={() => eliminarRutina(rutina.id_rutina)} color="error" disabled={loading}>
                        <Trash2 />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )
      )}

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { maxHeight: "90vh" },
        }}
      >
        <Box sx={{ p: 3 }}>
          <DialogTitle sx={{ p: 0, mb: 2 }}>
            <Typography variant="h5" component="h2">
              {editingRutina ? "Editar Rutina" : "Crear Nueva Rutina"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {editingRutina
                ? "Modifica los datos de la rutina"
                : "Completa la información para crear una nueva rutina de rehabilitación"}
            </Typography>
          </DialogTitle>

          <DialogContent sx={{ p: 0 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Título de la Rutina"
                value={formData.titulo}
                onChange={(e) => setFormData((prev) => ({ ...prev, titulo: e.target.value }))}
                placeholder="Ej: Rutina de fortalecimiento de rodilla"
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Descripción General"
                value={formData.descripcion}
                onChange={(e) => setFormData((prev) => ({ ...prev, descripcion: e.target.value }))}
                placeholder="Describe el objetivo y beneficios de esta rutina..."
              />

              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6" component="h3">
                    Pasos de la Rutina
                  </Typography>
                  <Button onClick={agregarPaso} variant="outlined" size="small" startIcon={<Plus />}>
                    Agregar Paso
                  </Button>
                </Box>

                {formData.pasos.length === 0 ? (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 4,
                      textAlign: "center",
                      borderStyle: "dashed",
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      No hay pasos agregados. Haz clic en "Agregar Paso" para comenzar.
                    </Typography>
                  </Paper>
                ) : (
                  <Stack spacing={2}>
                    {formData.pasos.map((paso, index) => (
                      <Paper
                        key={index}
                        variant="outlined"
                        sx={{
                          p: 2,
                          borderLeft: 4,
                          borderLeftColor: "primary.main",
                        }}
                      >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                          <Typography variant="h6" component="h4">
                            Paso {index + 1}
                          </Typography>
                          <IconButton onClick={() => eliminarPaso(index)} color="error" size="small">
                            <X />
                          </IconButton>
                        </Box>

                        <Stack spacing={2}>
                          <TextField
                            fullWidth
                            label="Nombre del Paso"
                            value={paso.nombre}
                            onChange={(e) => actualizarPaso(index, "nombre", e.target.value)}
                            placeholder="Ej: Flexión de rodilla"
                          />

                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Descripción"
                            value={paso.descripcion}
                            onChange={(e) => actualizarPaso(index, "descripcion", e.target.value)}
                            placeholder="Describe cómo realizar este paso..."
                          />

                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                fullWidth
                                label="Tiempo estimado (min)"
                                value={paso.tiempo_estimado}
                                onChange={(e) => actualizarPaso(index, "tiempo_estimado", e.target.value)}
                                placeholder="Ej: 10"
                                type="number"
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                fullWidth
                                label="Repeticiones"
                                value={paso.repeticiones}
                                onChange={(e) => actualizarPaso(index, "repeticiones", e.target.value)}
                                placeholder="Ej: 15"
                                type="number"
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                fullWidth
                                label="Descanso (seg)"
                                value={paso.descanso}
                                onChange={(e) => actualizarPaso(index, "descanso", e.target.value)}
                                placeholder="Ej: 30"
                                type="number"
                              />
                            </Grid>
                          </Grid>

                          <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                              Imagen del Paso
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <Button variant="outlined" component="label" startIcon={<CloudUpload />} sx={{ flex: 1 }}>
                                Subir Imagen
                                <input
                                  type="file"
                                  accept="image/*"
                                  hidden
                                  onChange={(e) => manejarImagenPaso(index, e.target.files[0])}
                                />
                              </Button>
                              {paso.imagen && (
                                <Box
                                  component="img"
                                  src={paso.imagen || "/placeholder.svg"}
                                  alt={`Paso ${index + 1}`}
                                  sx={{
                                    width: 64,
                                    height: 64,
                                    objectFit: "cover",
                                    borderRadius: 1,
                                    border: 1,
                                    borderColor: "divider",
                                  }}
                                />
                              )}
                            </Box>
                          </Box>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </Box>
            </Stack>
          </DialogContent>

          <Divider sx={{ my: 2 }} />

          <DialogActions sx={{ p: 0, justifyContent: "flex-end", gap: 1 }}>
            <Button onClick={resetearFormulario} disabled={loading} variant="outlined">
              Cancelar
            </Button>
            <Button onClick={guardarRutina} disabled={loading} variant="contained">
              {loading ? "Guardando..." : editingRutina ? "Actualizar Rutina" : "Crear Rutina"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}
