"use client"

import { useState, useEffect } from "react"
import { Paper, TextField, InputAdornment, Typography, Box, Avatar, IconButton } from "@mui/material"
import { Search, Phone, ChevronRight, Person } from "@mui/icons-material"
import { useNavigate } from "react-router-dom" // Import useNavigate

const HistorialClinicoListaUs = ({ onSelectPatient }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [pacientes, setPacientes] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate() // Initialize useNavigate

  useEffect(() => {
    fetch("https://backendcentro.onrender.com/api/historial-clinico/pacientes")
      .then((res) => res.json())
      .then((data) => {
        setPacientes(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error al obtener pacientes:", err)
        setLoading(false)
      })
  }, [])

  const filteredPacientes = pacientes.filter((paciente) => {
    const matchesSearch = paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "#ffffff",
          padding: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Person sx={{ fontSize: 48, color: "#6b7280" }} />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#ffffff",
        padding: 3,
      }}
    >
      <Box sx={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Header de la sección */}
        <Box sx={{ marginBottom: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "#10b981",
              marginBottom: 1,
            }}
          >
            Historial Clínico
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748b" }}>
            Gestiona y consulta los historiales médicos de tus pacientes
          </Typography>
        </Box>

        {/* Barra de búsqueda */}
        <Box sx={{ marginBottom: 3 }}>
          <TextField
            fullWidth
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#6b7280" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "48px",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
                "& fieldset": {
                  borderColor: "#cbd5e1",
                },
                "&:hover fieldset": {
                  borderColor: "#34d399",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#34d399",
                },
              },
            }}
          />
        </Box>

        {/* Lista de pacientes */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filteredPacientes.map((paciente, index) => (
            <Paper
              key={paciente.id}
              elevation={1}
              sx={{
                padding: 3,
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "1px solid #cbd5e1",
                "&:hover": {
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  borderColor: "#34d399",
                },
              }}
              onClick={() => navigate(`/admin/detallehistorial/${paciente.id}`)} // Navigate with ID
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={paciente.avatar || "/placeholder.svg?height=60&width=60"}
                    alt={paciente.nombre}
                    sx={{
                      width: 64,
                      height: 64,
                      border: "2px solid #cbd5e1",
                      backgroundColor: getAvatarColor(index),
                    }}
                  />

                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ marginBottom: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "600",
                          color: "#1e3a8a",
                        }}
                      >
                        {paciente.nombre}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Phone sx={{ fontSize: 16, color: "#f97316" }} />
                        <Typography variant="body2" sx={{ color: "#f97316" }}>
                          {paciente.telefono}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Phone sx={{ fontSize: 16, color: "#8b5cf6" }} />
                        <Typography variant="body2" sx={{ color: "#8b5cf6" }}>
                          {paciente.gmail}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton>
                    <ChevronRight sx={{ color: "#34d399" }} />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>

        {filteredPacientes.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              paddingY: 6,
            }}
          >
            <Box
              sx={{
                width: 96,
                height: 96,
                margin: "0 auto 16px",
                backgroundColor: "#e0e7ff",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Person sx={{ fontSize: 48, color: "#1e3a8a" }} />
            </Box>
            <Typography variant="h6" sx={{ color: "#64748b", marginBottom: 1 }}>
              No se encontraron pacientes
            </Typography>
            <Typography variant="body2" sx={{ color: "#94a3b8" }}>
              Intenta ajustar los filtros de búsqueda
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

// Function to assign different colors to avatars based on index
const getAvatarColor = (index) => {
  const colors = ["#fef08a", "#fca5a5", "#c4b5fd", "#6ee7b7", "#93c5fd"];
  return colors[index % colors.length]
}

export default HistorialClinicoListaUs