import React from "react";
import { useNavigate } from "react-router-dom";
import error404Img from "../Componentes/Imagenes/404.webp"; 
const PaginaError404 = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.errorPage}>
   
      <div style={styles.errorContainer}>
   
        <img src={error404Img} alt="Error 404" style={styles.errorImage} />

      
        <h1 style={styles.errorTitle}>
          Página no encontrada.
        </h1>

        <p style={styles.errorMessage}>
          La página que buscas no está disponible. Verifica la URL o regresa al inicio.
        </p>
        <button
          onClick={() => navigate("/")}
          style={styles.backButton}
        >
          Regresar al Inicio
        </button>
      </div>

      <div style={styles.supportNote}>
        <p>
          Si necesitas ayuda, por favor{" "}
          <a
            href="mailto:support@centrorehabilitacion.com"
            style={styles.supportLink}
          >
            contacta con soporte.
          </a>
        </p>
      </div>
    </div>
  );
};

const styles = {
  errorPage: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#212121", // Fondo negro para todo el div
    color: "#ffffff", // Color de texto blanco
    padding: "2rem",
  },
  errorContainer: {
    backgroundColor: "#212121", // Fondo blanco para el contenedor de error
    padding: "2.5rem",
    borderRadius: "1rem",
   
    textAlign: "center",
    maxWidth: "450px",
    width: "100%",
  },
  errorImage: {
    width: "200px", // Tamaño de la imagen
    height: "200px", // Tamaño de la imagen
    marginBottom: "1.5rem",
  },
  errorTitle: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#4b5563", // Color del título
    marginBottom: "1rem",
  },
  errorMessage: {
    fontSize: "1.125rem",
    color: "#6b7280", // Color del mensaje de error
    marginBottom: "1.5rem",
  },
  backButton: {
    padding: "0.75rem 2rem",
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    fontSize: "1.125rem",
    fontWeight: "600",
    borderRadius: "9999px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease-in-out",
    border: "none",
    cursor: "pointer",
  },
  backButtonHover: {
    backgroundColor: "#2563eb",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
    transform: "scale(1.05)",
  },
  supportNote: {
    marginTop: "2rem",
    textAlign: "center",
    fontSize: "0.875rem",
    color: "#6b7280",
  },
  supportLink: {
    color: "#3b82f6",
    textDecoration: "underline",
  },
  supportLinkHover: {
    color: "#2563eb",
  },
};

export default PaginaError404;
