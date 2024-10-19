import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import zxcvbn from "zxcvbn"; 
import Select from 'react-select';

const MySwal = withReactContent(Swal);

function FormularioRegistro() {
  const navigate = useNavigate();
  const [preguntas, setPreguntas] = useState([]);
  const [passwordStrength, setPasswordStrength] = useState(0); 
  const [passwordError, setPasswordError] = useState(""); 
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    tipo: "Cliente",
    correo: "",
    datos_cliente: {
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      telefono: "",
      pregunta: {
        _id: "",
        respuesta: "",
      },
    },
  });

  const [currentSection, setCurrentSection] = useState(1);

  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/preguntas");
        setPreguntas(response.data);
      } catch (error) {
        console.error("Error al cargar las preguntas:", error);
      }
    };

    fetchPreguntas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "password") {
      const strength = zxcvbn(value);
      setPasswordStrength(strength.score); 
      validatePassword(value); 
    }

    if (name === "datos_cliente.pregunta._id") {
      setFormData((prevData) => ({
        ...prevData,
        datos_cliente: {
          ...prevData.datos_cliente,
          pregunta: {
            _id: value,
            respuesta: prevData.datos_cliente.pregunta.respuesta,
          },
        },
      }));
    } else if (name === "datos_cliente.pregunta.respuesta") {
      setFormData((prevData) => ({
        ...prevData,
        datos_cliente: {
          ...prevData.datos_cliente,
          pregunta: {
            ...prevData.datos_cliente.pregunta,
            respuesta: value,
          },
        },
      }));
    } else if (name.startsWith("datos_cliente.")) {
      const fieldName = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        datos_cliente: {
          ...prevData.datos_cliente,
          [fieldName]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const commonPatterns = ["12345", "password", "qwerty", "abcdef"];
    let errorMessage = "";

    if (password.length < minLength) {
      errorMessage = `La contraseña debe tener al menos ${minLength} caracteres.`;
    }

    for (const pattern of commonPatterns) {
      if (password.includes(pattern)) {
        errorMessage = "Evita usar secuencias comunes como '12345' o 'password'.";
        break;
      }
    }

    setPasswordError(errorMessage);
  };

  const checkPasswordCompromised = async (password) => {
    const sha1 = require("js-sha1");
    const hash = sha1(password);
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);

    try {
      const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
      const compromised = response.data.includes(suffix.toUpperCase());
      return compromised;
    } catch (error) {
      console.error("Error al verificar la contraseña en HIBP:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordError) {
      MySwal.fire({
        icon: "error",
        title: "Contraseña débil",
        text: passwordError,
      });
      return;
    }

    const compromised = await checkPasswordCompromised(formData.password);
    if (compromised) {
      MySwal.fire({
        icon: "error",
        title: "Contraseña comprometida",
        text: "La contraseña que estás usando ha sido filtrada en el pasado. Por favor, elige otra.",
      });
      return;
    }

    const formDataWithPassword = {
      nombre: formData.datos_cliente.nombre,
      apellidopa: formData.datos_cliente.apellidoPaterno,
      apellidoma: formData.datos_cliente.apellidoMaterno,
      gmail: formData.correo,
      user: formData.username,
      telefono: formData.datos_cliente.telefono,
      password: formData.password,
      id_pregunta: formData.datos_cliente.pregunta._id,
      respuesta: formData.datos_cliente.pregunta.respuesta,
      tipo: formData.tipo,
    };

    try {
      await axios.post("http://localhost:5000/api/registro", formDataWithPassword);
      MySwal.fire({
        title: "Tu registro se realizó correctamente",
        text: "Por favor revisa tu correo para verificar tu cuenta.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      navigate("/verificar-correo");
      
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      MySwal.fire({
        icon: "error",
        title: "ERROR.",
        text: "No te pudiste registrar.",
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
      padding: "10px 15px",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
      marginTop: "20px",
      display: "inline-block",
      width: "48%",
    },
    botonAtras: {
      backgroundColor: "#f44336", // Rojo
      color: "white",
      float: "left",
    },
    botonSiguiente: {
      backgroundColor: "#4CAF50", // Verde
      color: "white",
      float: "right",
    },
    contenedorBotones: {
      clear: "both",
      marginTop: "20px",
      display: "flex",
      justifyContent: "space-between",
    },
  };

  // Formatear las preguntas para el select
  const opcionesPreguntas = preguntas.map(pregunta => ({
    value: pregunta.id,
    label: pregunta.pregunta,
  }));

  const handleNext = () => {
    if (currentSection < 3) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handleBack = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  return (
    <div style={estilos.contenedor}>
      <h1 style={estilos.titulo}>Registro</h1>
      <form onSubmit={handleSubmit} autoComplete="off">
        {currentSection === 1 && (
          <>
            <div style={estilos.campo}>
              <label style={estilos.etiqueta}><i className="fas fa-user"></i> Nombre</label>
              <input
                type="text"
                placeholder="Nombre"
                name="datos_cliente.nombre"
                style={estilos.input}
                value={formData.datos_cliente.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div style={estilos.campo}>
              <label style={estilos.etiqueta}><i className="fas fa-user"></i> Apellido Paterno</label>
              <input
                type="text"
                placeholder="Apellido Paterno"
                name="datos_cliente.apellidoPaterno"
                style={estilos.input}
                value={formData.datos_cliente.apellidoPaterno}
                onChange={handleChange}
                required
              />
            </div>
            <div style={estilos.campo}>
              <label style={estilos.etiqueta}><i className="fas fa-user"></i> Apellido Materno</label>
              <input
                type="text"
                placeholder="Apellido Materno"
                name="datos_cliente.apellidoMaterno"
                style={estilos.input}
                value={formData.datos_cliente.apellidoMaterno}
                onChange={handleChange}
                required
              />
            </div>
            <div style={estilos.campo}>
              <label style={estilos.etiqueta}><i className="fas fa-phone"></i> Teléfono</label>
              <input
                type="text"
                placeholder="Teléfono"
                name="datos_cliente.telefono"
                style={estilos.input}
                value={formData.datos_cliente.telefono}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}
        {currentSection === 2 && (
          <>
            <div style={estilos.campo}>
              <label style={estilos.etiqueta}><i className="fas fa-envelope"></i> Correo</label>
              <input
                type="email"
                placeholder="Correo"
                name="correo"
                style={estilos.input}
                value={formData.correo}
                onChange={handleChange}
                required
              />
            </div>
            <div style={estilos.campo}>
              <label style={estilos.etiqueta}><i className="fas fa-user"></i> Usuario</label>
              <input
                type="text"
                placeholder="Usuario"
                name="username"
                style={estilos.input}
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div style={estilos.campo}>
              <label style={estilos.etiqueta}><i className="fas fa-lock"></i> Contraseña</label>
              <input
                type="password"
                placeholder="Contraseña"
                name="password"
                style={estilos.input}
                value={formData.password}
                onChange={handleChange}
                required
              />
              {passwordStrength < 3 && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  La contraseña es débil.
                </p>
              )}
            </div>
            <div style={estilos.campo}>
              <label style={estilos.etiqueta}><i className="fas fa-question-circle"></i> Pregunta Secreta</label>
              <Select
                options={opcionesPreguntas}
                onChange={(option) => handleChange({ target: { name: "datos_cliente.pregunta._id", value: option.value } })}
                placeholder="Selecciona una pregunta"
                required
              />
            </div>
            <div style={estilos.campo}>
              <label style={estilos.etiqueta}><i className="fas fa-question"></i> Respuesta</label>
              <input
                type="text"
                placeholder="Respuesta"
                name="datos_cliente.pregunta.respuesta"
                style={estilos.input}
                value={formData.datos_cliente.pregunta.respuesta}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}
        <div style={estilos.contenedorBotones}>
          {currentSection > 1 && (
            <button
              type="button"
              style={{ ...estilos.boton, ...estilos.botonAtras }}
              onClick={handleBack}
            >
              <i className="fas fa-arrow-left"></i> Atras
            </button>
          )}
          {currentSection < 2 ? (
            <button
              type="button"
              style={{ ...estilos.boton, ...estilos.botonSiguiente }}
              onClick={handleNext}
            >
              <i className="fas fa-arrow-right"></i> Siguiente
            </button>
          ) : (
            <button
              type="submit"
              style={{ ...estilos.boton, ...estilos.botonSiguiente }}
            >
              <i className="fas fa-check"></i> Registrarse
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default FormularioRegistro;
