import React from "react";
import { useNavigate } from "react-router-dom";
import error400Img from "../Componentes/Imagenes/error400.webp"; // Asegúrate de tener la imagen en esta ruta

const PaginaError400 = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.errorPage}>
      <div style={styles.errorContainer}>
        <img src={error400Img} alt="Error 400" style={styles.errorIcon} />
        <h2 style={styles.errorCode}>Error 400</h2>
        <h1 style={styles.errorTitle}>
          ¡Vaya! Algo salió mal.
        </h1>
        <p style={styles.errorMessage}>
          La solicitud enviada es inválida. Verifica los datos ingresados e intenta nuevamente.
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
            href="mailto:bernaf.p.2004@gmail.com"
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
    padding: "2rem",
    backgroundColor: "#212121", // Fondo oscuro
  },
  errorContainer: {
    backgroundColor: "#212121",
    padding: "2.5rem",
    borderRadius: "1rem",
    textAlign: "center",
    maxWidth: "450px",
    width: "100%",
  },
  errorIcon: {
    width: "150px", // Ajusta el tamaño de la imagen
    height: "150px", // Ajusta el tamaño de la imagen
    marginBottom: "1rem",
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
    color: "#4b5563",
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

export default PaginaError400;
