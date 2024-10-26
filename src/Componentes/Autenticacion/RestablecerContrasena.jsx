import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function RestablecerContrasena() {
    const [formData, setFormData] = useState({
        gmail: "",
        resetCode: "",
        newPassword: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("https://backendcentro.onrender.com/api/cambio/reset-password", formData);
            MySwal.fire({
                title: "Contraseña restablecida",
                text: "Tu contraseña ha sido cambiada correctamente.",
                icon: "success",
            });
        } catch (error) {
            MySwal.fire({
                title: "Error",
                text: "Hubo un problema al restablecer tu contraseña.",
                icon: "error",
            });
        }
    };

    return (
        <div>
            <h2>Restablecer Contraseña</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Correo electrónico:</label>
                    <input
                        type="email"
                        value={formData.gmail}
                        onChange={(e) => setFormData({ ...formData, gmail: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Código de recuperación:</label>
                    <input
                        type="text"
                        value={formData.resetCode}
                        onChange={(e) => setFormData({ ...formData, resetCode: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Nueva contraseña:</label>
                    <input
                        type="password"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        required
                    />
                </div>
                <button type="submit">Restablecer Contraseña</button>
            </form>
        </div>
    );
}

export default RestablecerContrasena;
