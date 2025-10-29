import { useEffect, useState } from "react"
import { Box, CircularProgress, Fade, Typography } from "@mui/material"
import { styled, keyframes } from "@mui/material/styles"

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`

const SplashContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  zIndex: 9999,
  overflow: "hidden",
  transition: "opacity 0.6s ease-out",
}))

const LogoContainer = styled(Box)({
  animation: `${pulse} 2s ease-in-out infinite`,
  marginBottom: "2rem",
})

const BackgroundCircle = styled(Box)(({ delay = 0 }) => ({
  position: "absolute",
  borderRadius: "50%",
  background: "rgba(255, 255, 255, 0.1)",
  animation: `${pulse} 3s ease-in-out infinite`,
  animationDelay: `${delay}s`,
}))

const SplashScreen = ({ onFinish, duration = 3000 }) => {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
      setTimeout(() => onFinish?.(), 600)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onFinish])

  return (
    <Fade in={show} timeout={600}>
      <SplashContainer>
        <BackgroundCircle delay={0} sx={{ width: { xs: "200px", sm: "300px", md: "400px" }, height: { xs: "200px", sm: "300px", md: "400px" }, top: "-10%", right: "-5%" }} />
        <BackgroundCircle delay={1} sx={{ width: { xs: "150px", sm: "250px", md: "350px" }, height: { xs: "150px", sm: "250px", md: "350px" }, bottom: "-10%", left: "-5%" }} />
        <BackgroundCircle delay={0.5} sx={{ width: { xs: "100px", sm: "150px", md: "200px" }, height: { xs: "100px", sm: "150px", md: "200px" }, top: "50%", left: "10%" }} />

        <LogoContainer>
          <Box
            component="img"
            src="/logo.png"
            alt="Logo Centro de Rehabilitación"
            sx={{
              width: { xs: 90, sm: 110, md: 130 },
              height: { xs: 90, sm: 110, md: 130 },
              borderRadius: "50%",        
              objectFit: "cover",
              background: "white",
              p: 0.5,
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              border: "4px solid rgba(255, 255, 255, 0.3)",
            }}
          />
        </LogoContainer>

        <Typography 
          variant="h4" 
          sx={{ 
            color: "white", 
            fontWeight: 600, 
            mb: 1, 
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" }, 
            px: 2 
          }}
        >
          Centro de Rehabilitación Integral San Juan
        </Typography>

        <Typography 
          variant="body1" 
          sx={{ 
            color: "rgba(255, 255, 255, 0.9)", 
            mb: 4, 
            fontSize: { xs: "0.875rem", sm: "1rem" }, 
            px: 2 
          }}
        >
          Cargando...
        </Typography>

        <CircularProgress size={50} thickness={4} sx={{ color: "white", mb: 2 }} />

        <Typography 
          variant="caption" 
          sx={{ 
            position: "absolute", 
            bottom: { xs: 20, sm: 30 }, 
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: { xs: "0.75rem", sm: "0.875rem" }
          }}
        >
          © 2025 Centro de Rehabilitación Integral San Juan. Todos los derechos reservados.
        </Typography>
      </SplashContainer>
    </Fade>
  )
}

export default SplashScreen