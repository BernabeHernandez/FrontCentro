import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function SolicitarCodigo() {
    const [gmail, setGmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("https://backendcentro.onrender.com/api/codigo/forgot-password", { gmail });
            MySwal.fire({
                title: "Código enviado",
                text: "Por favor revisa tu correo electrónico para obtener el código de recuperación.",
                icon: "success",
            });
            navigate('/validar_codigo', { state: { email: gmail } });

        } catch (error) {
            if (error.response && error.response.status === 404) {
                MySwal.fire({
                    title: "Correo no registrado",
                    text: "El correo electrónico proporcionado no está registrado en nuestro sistema.",
                    icon: "error",
                });
            } else {
                MySwal.fire({
                    title: "Error",
                    text: "No se pudo enviar el correo de recuperación.",
                    icon: "error",
                });
            }
        }
    };

    const estilos = {
        contenedor: {
            textAlign: 'center',
            backgroundColor: '#e0f7fa',
            padding: '20px',
            borderRadius: '15px',
            maxWidth: '400px',
            margin: '40px auto',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        },
        titulo: {
            fontSize: '28px',
            marginBottom: '20px',
            color: '#004d40',
        },
        campo: {
            marginBottom: '15px',
            textAlign: 'center',
        },
        input: {
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #b2dfdb',
            fontSize: '16px',
            boxSizing: 'border-box',
        },
        boton: {
            backgroundColor: '#00796b',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease',
            display: 'block',
            margin: '20px auto 0',
            width: '100%',
        },
    };

    return (
        <div style={estilos.contenedor}>
            <h1 style={estilos.titulo}>Verificación de Correo</h1>
            <form onSubmit={handleSubmit}>
                <div style={estilos.campo}>
                    <input
                        type="email"
                        placeholder="Introduce tu correo electrónico"
                        value={gmail}
                        onChange={(e) => setGmail(e.target.value)}
                        required
                        style={estilos.input}
                    />
                </div>
                <button type="submit" style={estilos.boton}>Solicitar Código</button>
            </form>
        </div>
    );
}

export default SolicitarCodigo;
