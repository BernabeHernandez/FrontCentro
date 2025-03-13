import React from "react";
import { useNavigate } from "react-router-dom";
import error500Img from "../Componentes/Imagenes/500.webp"; // Imagen de error 500

const PaginaError500j = () => {
    
  const navigate = useNavigate();

  return (
    <div style={styles.errorPage}>
      <div style={styles.errorContainer}>
        <img
          src={error500Img}
          alt="Imagen de error 500, el servidor encontró un problema."
          style={styles.errorImage}
        />

        <h2 style={styles.errorCode}>Error 500</h2>

        <h1 style={styles.errorTitle}>¡Ups! Algo salió mal en el servidor.</h1>

        <p style={styles.errorMessage}>
          Hemos tenido un problema en el servidor. Por favor, intenta más tarde o regresa al inicio.
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
          Si el problema persiste, por favor{" "}
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
    backgroundColor: "#212121",
    padding: "2rem",
  },
  errorContainer: {
    backgroundColor: "#212121",
    padding: "2.5rem",
    borderRadius: "1rem",
    textAlign: "center",
    maxWidth: "450px",
    width: "100%",
  },
  errorImage: {
    width: "200px",
    height: "200px",
    marginBottom: "1.5rem",
  },
  errorCode: {
    fontSize: "2rem",
    fontWeight: "500",
    color: "#f87171",
    marginBottom: "1.5rem",
  },
  errorTitle: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#f87171",
    marginBottom: "1rem",
  },
  errorMessage: {
    fontSize: "1.125rem",
    color: "#6b7280",
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
};

export default PaginaError500j;
