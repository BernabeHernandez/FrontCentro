import React, { useState } from "react";
import { FaShoppingCart, FaUndo, FaQuestionCircle, FaUserShield, FaHeadset, FaSearch } from "react-icons/fa";

const Ayuda = () => {
  const [showFAQ, setShowFAQ] = useState(false);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Centro de Ayuda</h1>
      <p style={styles.description}>
        Aquí encontrarás respuestas a preguntas frecuentes y asistencia sobre nuestros servicios.
      </p>
      <div style={styles.searchContainer}>
        <input type="text" placeholder="¿Con qué podemos ayudarte?" style={styles.input} />
        <button style={styles.button}><FaSearch /> Buscar</button>
      </div>
      <div style={styles.faqContainer}>
        <div style={styles.faqItem}>
          <h2 style={{ ...styles.question, color: "#FF5733" }}><FaShoppingCart /> Compras</h2>
          <p style={styles.answer}>
            Administrar y cancelar compras, pagar, seguir envíos, modificar, reclamar o cancelar compras.
          </p>
        </div>
        <div style={styles.faqItem}>
          <h2 style={{ ...styles.question, color: "#33A1FF" }}><FaUndo /> Devoluciones y reembolsos</h2>
          <p style={styles.answer}>
            Devolver un producto o consultar por reintegros de dinero de una compra.
          </p>
        </div>
        <div style={styles.faqItem} onClick={() => setShowFAQ(!showFAQ)}>
          <h2 style={{ ...styles.question, color: "#FFC300" }}><FaQuestionCircle /> Preguntas Frecuentes</h2>
          {showFAQ && (
            <div style={styles.faqContent}>
             <p><strong>¿Cómo agendo una cita?</strong> Para agendar una cita, dirígete a la sección de servicios, selecciona el servicio deseado y haz clic en "Sacar cita". Luego, elige el día y la hora disponibles para completar la reserva.</p>

              <p><strong>¿Cuáles son los métodos de pago aceptados?</strong> Aceptamos tarjetas de crédito/débito, transferencias bancarias y pagos en efectivo.</p>
              <p><strong>¿Puedo cancelar o modificar una cita?</strong> Sí, contáctanos con al menos 24 horas de anticipación.</p>
            </div>
          )}
        </div>
        <div style={styles.faqItem}>
          <h2 style={{ ...styles.question, color: "#28A745" }}><FaUserShield /> Ayuda sobre tu cuenta</h2>
          <p style={styles.answer}>Perfil, seguridad y acceso a la cuenta.</p>
        </div>
        <div style={styles.faqItem}>
          <h2 style={{ ...styles.question, color: "#8E44AD" }}><FaHeadset /> ¿Necesitas más ayuda?</h2>
          <p style={styles.answer}>Contáctanos.</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: "1.1rem",
    color: "#555",
    marginBottom: "20px",
  },
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    width: "70%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    padding: "10px 20px",
    fontSize: "1rem",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  faqContainer: {
    textAlign: "left",
    marginTop: "20px",
  },
  faqItem: {
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "10px",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    transition: "background-color 0.3s ease, color 0.3s ease",
    cursor: "pointer",
  },
  faqContent: {
    marginTop: "10px",
    paddingLeft: "10px",
    fontSize: "1rem",
    color: "#666",
  },
  question: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "color 0.3s ease",
  },
  answer: {
    fontSize: "1rem",
    color: "#666",
  },
};

export default Ayuda;
