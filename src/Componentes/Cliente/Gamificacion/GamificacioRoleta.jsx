"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Card, CardContent, Box, Typography, Paper } from "@mui/material"
import { AutoAwesome as SparklesIcon, CardGiftcard as GiftIcon, Home as HomeIcon } from "@mui/icons-material"
import axios from "axios"

export default function GamificacioRoleta() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [winner, setWinner] = useState(null)
  const [hasSpun, setHasSpun] = useState(false)
  const [eligible, setEligible] = useState(null)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const usuarioId = typeof window !== 'undefined'
    ? (localStorage.getItem('usuario_id') || localStorage.getItem('id'))
    : null

  useEffect(() => {
    let isMounted = true
    const fetchEligibility = async () => {
      try {
        if (!usuarioId) {
          setEligible(false)
          return
        }
        const resp = await axios.get(`https://backendcentro.onrender.com/api/ruleta/elegibilidad/${usuarioId}`)
        if (isMounted) setEligible(!!resp.data?.elegible)
      } catch (e) {
        if (isMounted) {
          setEligible(false)
          setError("No se pudo verificar elegibilidad. Intenta más tarde.")
        }
      }
    }
    fetchEligibility()
    return () => { isMounted = false }
  }, [usuarioId])

  const prizes = [
    { id: 1, discount: 2, color: "#8B5CF6" }, // purple
    { id: 2, discount: 4, color: "#EC4899" }, // pink
    { id: 3, discount: 6, color: "#3B82F6" }, // blue
    { id: 4, discount: 8, color: "#14B8A6" }, // teal
    { id: 5, discount: 10, color: "#10B981" }, // green
    { id: 6, discount: 12, color: "#F59E0B" }, // amber
    { id: 7, discount: 14, color: "#F97316" }, // orange
    { id: 8, discount: 16, color: "#EF4444" }, // red
    { id: 9, discount: 18, color: "#6366F1" }, // indigo
    { id: 10, discount: 20, color: "#A855F7" }, // violet
  ]

  const spinWheel = () => {
    if (isSpinning || !eligible) return

    setIsSpinning(true)
    setWinner(null)
    setHasSpun(true)

    const randomPrizeIndex = Math.floor(Math.random() * prizes.length)
    const segmentAngle = 360 / prizes.length
    // Ajustar el ángulo para que apunte al centro del segmento seleccionado
    const targetAngle = segmentAngle * randomPrizeIndex + segmentAngle / 2
    const spins = 5 + Math.random() * 3
    // Rotar la ruleta al ángulo del segmento seleccionado, sumando giros completos
    const finalRotation = rotation + spins * 360 + targetAngle

    setRotation(finalRotation)

    setTimeout(async () => {
      setIsSpinning(false)
      const premio = prizes[randomPrizeIndex]
      setWinner(premio)

      try {
        if (!usuarioId) {
          setEligible(false)
          return
        }
        await axios.post(`https://backendcentro.onrender.com/api/ruleta/girar/${usuarioId}`, {
          porcentaje: premio.discount,
        })
        setEligible(false)
        
        setTimeout(() => {
          navigate('/cliente/')
        }, 3000)
      } catch (e) {
        setEligible(false)
        setError(e?.response?.data?.error || "No se pudo registrar el premio")
      }
    }, 5000)
  }

  const handleGirarDespues = () => {
    navigate('/cliente/')
  }

  const createSegmentPath = (index, total) => {
    const angle = (2 * Math.PI) / total
    const startAngle = angle * index
    const endAngle = startAngle + angle
    const radius = 180
    const innerRadius = 0

    const x1 = 200 + radius * Math.cos(startAngle)
    const y1 = 200 + radius * Math.sin(startAngle)
    const x2 = 200 + radius * Math.cos(endAngle)
    const y2 = 200 + radius * Math.sin(endAngle)

    const largeArc = angle > Math.PI ? 1 : 0

    return `M 200 200 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f5f5 0%, #e3f2fd 50%, #f5f5f5 100%)",
        padding: 2,
      }}
    >
      <Card
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 672,
          overflow: "hidden",
          border: "2px solid",
          borderColor: "primary.light",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          padding: 4,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          backdropFilter: "blur(8px)",
        }}
      >
        <CardContent>
          {/* Header */}
          <Box sx={{ marginBottom: 4, textAlign: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, marginBottom: 1 }}>
              <SparklesIcon sx={{ fontSize: 32, color: "primary.main" }} />
              <Typography variant="h3" component="h1" sx={{ fontWeight: "bold", color: "text.primary" }}>
                Ruleta de Premios
              </Typography>
              <SparklesIcon sx={{ fontSize: 32, color: "primary.main" }} />
            </Box>
            <Typography variant="h6" sx={{ color: "text.secondary" }}>
              ¡Gira la ruleta y gana descuentos increíbles!
            </Typography>
          </Box>

          <Box
            sx={{
              position: "relative",
              marginX: "auto",
              marginBottom: 4,
              display: "flex",
              height: 420,
              width: "100%",
              maxWidth: 420,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Pointer */}
            <Box
              sx={{
                position: "absolute",
                left: "50%",
                top: 16,
                zIndex: 20,
                transform: "translateX(-50%)",
              }}
            >
              <Box
                sx={{
                  width: 0,
                  height: 0,
                  borderLeft: "20px solid transparent",
                  borderRight: "20px solid transparent",
                  borderTop: "40px solid",
                  borderTopColor: "primary.main",
                  filter: "drop-shadow(0 20px 25px rgba(0, 0, 0, 0.15))",
                }}
              />
            </Box>

            <Box sx={{ position: "relative", height: 400, width: 400 }}>
              <svg
                viewBox="0 0 400 400"
                style={{
                  height: "100%",
                  width: "100%",
                  filter: "drop-shadow(0 20px 25px rgba(0, 0, 0, 0.15))",
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning ? "transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
                }}
              >
                {/* Outer ring */}
                <circle cx="200" cy="200" r="195" fill="none" stroke="#1976d2" strokeWidth="4" opacity="0.3" />

                {/* Prize segments */}
                {prizes.map((prize, index) => {
                  const angle = (360 / prizes.length) * index
                  const segmentAngle = 360 / prizes.length
                  const textAngle = angle + segmentAngle / 2
                  const textRadius = 130

                  return (
                    <g key={prize.id}>
                      {/* Segment */}
                      <path
                        d={createSegmentPath(index, prizes.length)}
                        fill={prize.color}
                        stroke="white"
                        strokeWidth="2"
                      />

                      {/* Text */}
                      <g transform={`rotate(${textAngle} 200 200)`}>
                        <text
                          x="200"
                          y={200 - textRadius}
                          textAnchor="middle"
                          fill="white"
                          fontSize="32"
                          fontWeight="bold"
                          style={{ filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))" }}
                        >
                          {prize.discount}%
                        </text>
                        <text
                          x="200"
                          y={200 - textRadius + 24}
                          textAnchor="middle"
                          fill="white"
                          fontSize="12"
                          fontWeight="600"
                          opacity="0.9"
                        >
                          OFF
                        </text>
                      </g>
                    </g>
                  )
                })}

                {/* Center circle */}
                <circle cx="200" cy="200" r="45" fill="white" stroke="#1976d2" strokeWidth="4" />
              </svg>

              {/* Center icon */}
              <Box
                sx={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <GiftIcon sx={{ fontSize: 40, color: "primary.main" }} />
              </Box>
            </Box>
          </Box>

          {/* Elegibility / Error */}
          {eligible === false && !winner && (
            <Paper elevation={0} sx={{ mb: 2, p: 2, textAlign: 'center', bgcolor: '#fff7f7', borderRadius: 2 }}>
              <Typography variant="body2" color="error.main">
                No tienes giros disponibles por ahora.
              </Typography>
            </Paper>
          )}

          {error && (
            <Paper elevation={0} sx={{ mb: 2, p: 2, textAlign: 'center', bgcolor: '#fffaf0', borderRadius: 2 }}>
              <Typography variant="body2" color="warning.main">{error}</Typography>
            </Paper>
          )}

          {/* Winner Display */}
          {winner && (
            <Paper
              elevation={3}
              sx={{
                marginBottom: 3,
                borderRadius: 3,
                background: "linear-gradient(90deg, #1976d2 0%, #9c27b0 100%)",
                padding: 3,
                textAlign: "center",
                animation: "fadeIn 0.5s ease-in-out",
                "@keyframes fadeIn": {
                  from: { opacity: 0, transform: "scale(0.9)" },
                  to: { opacity: 1, transform: "scale(1)" },
                },
              }}
            >
              <Typography variant="h6" sx={{ marginBottom: 1, fontWeight: 600, color: "white" }}>
                🎉 ¡Felicidades! 🎉
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "white" }}>
                Ganaste {winner.discount}% de descuento
              </Typography>
            </Paper>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5 }}>
            <Button
              onClick={spinWheel}
              disabled={isSpinning || eligible === false || eligible === null || hasSpun}
              variant="contained"
              size="large"
              fullWidth
              sx={{
                flex: 1,
                background: "linear-gradient(90deg, #1976d2 0%, #9c27b0 100%)",
                fontSize: "1.125rem",
                fontWeight: 600,
                padding: "12px 24px",
                boxShadow: 3,
                transition: "all 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 6,
                },
                "&:disabled": {
                  opacity: 0.5,
                },
              }}
              startIcon={
                isSpinning ? (
                  <Box
                    sx={{
                      display: "inline-block",
                      width: 20,
                      height: 20,
                      border: "2px solid white",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                      "@keyframes spin": {
                        to: { transform: "rotate(360deg)" },
                      },
                    }}
                  />
                ) : (
                  <SparklesIcon />
                )
              }
            >
              {eligible === null ? "Cargando..." : isSpinning ? "Girando..." : eligible && !hasSpun ? "Girar Ruleta" : "Sin giros"}
            </Button>

            <Button
              onClick={handleGirarDespues}
              variant="outlined"
              size="large"
              fullWidth
              sx={{
                flex: 1,
                borderWidth: 2,
                fontSize: "1.125rem",
                fontWeight: 600,
                padding: "12px 24px",
                transition: "all 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  borderWidth: 2,
                },
              }}
              startIcon={<HomeIcon />}
            >
              Girar después
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}