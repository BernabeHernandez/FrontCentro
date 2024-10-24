import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import zxcvbn from "zxcvbn";
import sha1 from "js-sha1";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faPhone, faSignInAlt } from "@fortawesome/free-solid-svg-icons";

const MySwal = withReactContent(Swal);

function FormularioRegistro() {
    const navigate = useNavigate();
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [formErrors, setFormErrors] = useState({});
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
        },
    });

    useEffect(() => {
       
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "password") {
            const strength = zxcvbn(value);
            setPasswordStrength(strength.score);
            validatePassword(value);
        }

        if (name.startsWith("datos_cliente.")) {
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

        validateField(name, value); // Validación en cada cambio de campo
    };

    const validateField = (name, value) => {
        let errors = { ...formErrors };

        // Validación de nombre y apellidos (solo letras y longitud entre 4-15)
        if (name === "datos_cliente.nombre" || name === "datos_cliente.apellidoPaterno" || name === "datos_cliente.apellidoMaterno") {
            const nameRegex = /^[a-zA-Z]{4,15}$/;
            if (!nameRegex.test(value)) {
                errors[name] = "Debe contener solo letras y entre 4 y 15 caracteres.";
            } else {
                delete errors[name];
            }
        }

        // Validación de teléfono (10 dígitos)
        if (name === "datos_cliente.telefono") {
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(value)) {
                errors[name] = "Debe contener exactamente 10 dígitos.";
            } else {
                delete errors[name];
            }
        }

        // Validación de usuario (solo letras y números, entre 4 y 15 caracteres)
        if (name === "username") {
            const usernameRegex = /^[a-zA-Z0-9]{4,15}$/;
            if (!usernameRegex.test(value)) {
                errors[name] = "Debe contener entre 4 y 15 caracteres alfanuméricos.";
            } else {
                delete errors[name];
            }
        }

        // Validación de contraseña (longitud entre 6-15 caracteres)
        if (name === "password") {
            const passwordRegex = /^.{6,15}$/;
            if (!passwordRegex.test(value)) {
                errors[name] = "Debe tener entre 6 y 15 caracteres.";
            } else {
                delete errors[name];
            }
        }

        setFormErrors(errors);
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

        // Revisar si hay errores en el formulario
        const isValidForm = Object.keys(formErrors).length === 0;

        // Si el formulario no es válido, mostrar mensaje de error
        if (!isValidForm || passwordError) {
            MySwal.fire({
                icon: "error",
                title: "Errores en el formulario",
                text: "Por favor, corrige los errores antes de continuar.",
            });
            return;
        }

        const isCompromised = await checkPasswordCompromised(formData.password);
        if (isCompromised) {
            MySwal.fire({
                icon: "error",
                title: "Contraseña comprometida",
                text: "Esta contraseña ha sido filtrada en brechas de datos. Por favor, elige otra.",
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
        
            if (error.response && error.response.data.error) {
                MySwal.fire({
                    icon: "error",
                    title: "ERROR.",
                    text: error.response.data.error, 
                });
            } else {
                MySwal.fire({
                    icon: "error",
                    title: "ERROR.",
                    text: "No te pudiste registrar.",
                });
            }
        }
    }
        

    const getPasswordStrengthText = (strength) => {
        switch (strength) {
            case 0:
            case 1:
                return "Débil";
            case 2:
                return "Media";
            case 3:
                return "Fuerte";
            case 4:
                return "Muy Fuerte";
            default:
                return "";
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
            marginTop: "30px",
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
            backgroundColor: "#4CAF50", // Verde
            color: "white",
            border: "none",
            marginTop: "20px",
            width: "100%",
        },
        mensajeError: {
            color: "red",
            marginTop: "10px",
        },
        medidor: {
            marginTop: "10px",
            fontWeight: "bold",
            color: passwordStrength < 2 ? "red" : passwordStrength < 3 ? "orange" : "green",
        },
    };

    return (
        <div style={estilos.contenedor}>
            <h2 style={estilos.titulo}>Registro</h2>
            <form onSubmit={handleSubmit}>
                <div style={estilos.campo}>
                    <label style={estilos.etiqueta}>
                        <FontAwesomeIcon icon={faUser} /> Nombre
                    </label>
                    <input
                        type="text"
                        name="datos_cliente.nombre"
                        value={formData.datos_cliente.nombre}
                        onChange={handleChange}
                        style={estilos.input}
                        placeholder="Ingresa tu nombre"
                        required
                    />
                    {formErrors["datos_cliente.nombre"] && (
                        <p style={estilos.mensajeError}>{formErrors["datos_cliente.nombre"]}</p>
                    )}
                </div>
                <div style={estilos.campo}>
                    <label style={estilos.etiqueta}>
                        <FontAwesomeIcon icon={faUser} /> Apellido Paterno
                    </label>
                    <input
                        type="text"
                        name="datos_cliente.apellidoPaterno"
                        value={formData.datos_cliente.apellidoPaterno}
                        onChange={handleChange}
                        style={estilos.input}
                        placeholder="Ingresa tu apellido paterno"
                        required
                    />
                    {formErrors["datos_cliente.apellidoPaterno"] && (
                        <p style={estilos.mensajeError}>{formErrors["datos_cliente.apellidoPaterno"]}</p>
                    )}
                </div>
                <div style={estilos.campo}>
                    <label style={estilos.etiqueta}>
                        <FontAwesomeIcon icon={faUser} /> Apellido Materno
                    </label>
                    <input
                        type="text"
                        name="datos_cliente.apellidoMaterno"
                        value={formData.datos_cliente.apellidoMaterno}
                        onChange={handleChange}
                        style={estilos.input}
                        placeholder="Ingresa tu apellido materno"
                        required
                    />
                    {formErrors["datos_cliente.apellidoMaterno"] && (
                        <p style={estilos.mensajeError}>{formErrors["datos_cliente.apellidoMaterno"]}</p>
                    )}
                </div>
                <div style={estilos.campo}>
                    <label style={estilos.etiqueta}>
                        <FontAwesomeIcon icon={faPhone} /> Teléfono
                    </label>
                    <input
                        type="text"
                        name="datos_cliente.telefono"
                        value={formData.datos_cliente.telefono}
                        onChange={handleChange}
                        style={estilos.input}
                        placeholder="Ingresa tu teléfono"
                        required
                        maxLength="10" // Limita a 10 caracteres
                        onKeyPress={(e) => {
                            // Permitir solo números
                            if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                            }
                        }}
                    />

                    {formErrors["datos_cliente.telefono"] && (
                        <p style={estilos.mensajeError}>{formErrors["datos_cliente.telefono"]}</p>
                    )}
                </div>
                <div style={estilos.campo}>
                    <label style={estilos.etiqueta}>
                        <FontAwesomeIcon icon={faEnvelope} /> Correo
                    </label>
                    <input
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        style={estilos.input}
                        placeholder="Ingresa tu correo electrónico"
                        required
                    />
                </div>
                <div style={estilos.campo}>
                    <label style={estilos.etiqueta}>
                        <FontAwesomeIcon icon={faUser} /> Usuario
                    </label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        style={estilos.input}
                        placeholder="Ingresa tu usuario"
                        required
                    />
                    {formErrors.username && (
                        <p style={estilos.mensajeError}>{formErrors.username}</p>
                    )}
                </div>
                <div style={estilos.campo}>
                    <label style={estilos.etiqueta}>
                        <FontAwesomeIcon icon={faLock} /> Contraseña
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        style={estilos.input}
                        placeholder="Crea una contraseña"
                        required
                    />
                    {passwordStrength > 0 && (
                        <p style={estilos.medidor}>
                            Fuerza de la contraseña: {getPasswordStrengthText(passwordStrength)}
                        </p>
                    )}
                    {formErrors.password && (
                        <p style={estilos.mensajeError}>{formErrors.password}</p>
                    )}
                </div>
                <button type="submit" style={estilos.boton}>
                    <FontAwesomeIcon icon={faSignInAlt} /> Registrar
                </button>
            </form>
        </div>
    );
}

export default FormularioRegistro;
