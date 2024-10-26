import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function VerificarCorreo() {
  const [verificationCode, setVerificationCode] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!verificationCode) {
      MySwal.fire({
        icon: "error",
        title: "Código requerido",
        text: "Por favor introduce el código de verificación.",
      });
      return;
    }

    try {
      const response = await axios.get(`https://backendcentro.onrender.com/api/registro/verify/${verificationCode}`);
      MySwal.fire({
        icon: "success",
        title: "Verificación exitosa",
        text: response.data.message,
      });
      navigate("/login");
    } catch (error) {
      console.error("Error al verificar el código:", error.response || error);
      MySwal.fire({
        icon: "error",
        title: "Error de verificación",
        text: error.response?.data?.error || "Ocurrió un error al verificar el código.",
      });
    }


  };


  const estilos = {
    contenedor: {
      textAlign: "left",
      backgroundColor: "#e0f7fa",
      padding: "15px",
      borderRadius: "15px",
      maxWidth: "400px",
      width: "90%",
      margin: "auto",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      marginTop: '30px',
    },
    titulo: {
      fontSize: "28px",
      marginBottom: "20px",
      color: "#004d40",
      textAlign: "center",
    },
    campo: {
      marginBottom: "15px",
      textAlign: "left",
    },
    etiqueta: {
      display: "block",
      marginBottom: "5px",
      fontWeight: "bold",
      color: "#00695c",
    },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #b2dfdb",
      fontSize: "16px",
      boxSizing: "border-box",
    },
    boton: {
      backgroundColor: "#00796b",
      color: "white",
      padding: "10px 15px",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
      marginTop: "20px",
      display: "block",
      width: "100%",
    },
  };

  return (
    <div style={estilos.contenedor}>
      <h1 style={estilos.titulo}>Verificar Código</h1>
      <form onSubmit={handleSubmit}>
        <div style={estilos.campo}>
          <label style={estilos.etiqueta}></label>
          <input
            type="text"
            placeholder="Introduce tu código"
            name="verificationCode"
            style={estilos.input}
            value={verificationCode}
            onChange={handleChange}
            required
            maxLength="6" 
            onKeyPress={(e) => {
            
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />

        </div>
        <button type="submit" style={estilos.boton}>Verificar</button>
      </form>
    </div>
  );
}

export default VerificarCorreo;
