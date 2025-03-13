import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Importamos SweetAlert2

const RegistroHorario = () => {
  const [newHorario, setNewHorario] = useState({
    dia: "",
    hora_inicio: "",
    hora_fin: "",
    intervalo: 30,
  });

  const [horarios, setHorarios] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    fetchHorarios();
  }, []);

  const fetchHorarios = async () => {
    try {
      const response = await axios.get("https://backendcentro.onrender.com/api/citasAdmin/horarios");
      setHorarios(response.data);
    } catch (error) {
      setMensaje("Error al obtener horarios.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewHorario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    // Validación de intervalo
    if (newHorario.intervalo % 30 !== 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "La duración debe ser un múltiplo de 30 minutos (30, 60, 90, 120, etc.).",
      });
      return;
    }

    try {
      if (editandoId) {
        await axios.put(`https://backendcentro.onrender.com/api/citasAdmin/horarios/${editandoId}`, newHorario);
        Swal.fire({
          icon: "success",
          title: "Horario actualizado",
          text: "El horario se actualizó correctamente.",
        });
      } else {
        await axios.post("https://backendcentro.onrender.com/api/citasAdmin/horarios", newHorario);
        Swal.fire({
          icon: "success",
          title: "Horario registrado",
          text: "El horario se registró correctamente.",
        });
      }

      fetchHorarios();
      limpiarFormulario();
    } catch (error) {
      console.error("Error al registrar o actualizar el horario:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al procesar el horario.",
      });
    }
  };

  const handleEdit = (horario) => {
    setNewHorario({
      dia: horario.dia,
      hora_inicio: horario.hora_inicio,
      hora_fin: horario.hora_fin,
      intervalo: horario.intervalo,
    });
    setEditandoId(horario.id_horario);
  };

  const handleDelete = async (id) => {
    if (!id) {
      setMensaje("No se puede eliminar el horario, ID no válido.");
      return;
    }

    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
    });

    if (!confirmacion.isConfirmed) return;

    try {
      await axios.delete(`https://backendcentro.onrender.com/api/citasAdmin/horarios/${id}`);
      Swal.fire({
        icon: "success",
        title: "Horario eliminado",
        text: "El horario fue eliminado correctamente.",
      });
      setHorarios((prevHorarios) => prevHorarios.filter((horario) => horario.id_horario !== id));
    } catch (error) {
      console.error("Error al eliminar el horario:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al eliminar el horario.",
      });
    }
  };

  const limpiarFormulario = () => {
    setNewHorario({ dia: "", hora_inicio: "", hora_fin: "", intervalo: 30 });
    setEditandoId(null);
  };

  return (
    <div className="inventario-container">
      {/* Formulario */}
      <div className="edit-form-container">
        <h1>{editandoId ? "Editar Horario" : "Registro de Horario"}</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Día:
            <select
              name="dia"
              value={newHorario.dia}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un día</option>
              {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((dia) => (
                <option key={dia} value={dia}>{dia}</option>
              ))}
            </select>
          </label>
          <label>
            Hora Inicio:
            <input
              type="time"
              name="hora_inicio"
              value={newHorario.hora_inicio}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Hora Fin:
            <input
              type="time"
              name="hora_fin"
              value={newHorario.hora_fin}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Duración (minutos):
            <input
              type="number"
              name="intervalo"
              value={newHorario.intervalo}
              onChange={handleChange}
              min={10}
              required
            />
          </label>
          <div className="form-actions">
            <button type="submit" className="btn-submit">
              {editandoId ? "Actualizar" : "Registrar"}
            </button>
            {editandoId && (
              <button type="button" onClick={limpiarFormulario} className="btn-cancel">
                Cancelar
              </button>
            )}
          </div>
        </form>
        {mensaje && <p className="mensaje-error">{mensaje}</p>}
      </div>

      {/* Tabla de Horarios */}
      <div>
        <h1>Horarios Registrados</h1>
        <table className="inventario-table">
          <thead>
            <tr>
              <th>Día</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Duración</th>
              <th>Disponible</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {horarios.length > 0 ? (
              horarios.map((horario) => (
                <tr key={horario.id_horario}>
                  <td>{horario.dia}</td>
                  <td>{horario.hora_inicio}</td>
                  <td>{horario.hora_fin}</td>
                  <td>{horario.intervalo} min</td>
                  <td>{parseInt(horario.disponible) === 1 ? "Sí" : "No"}</td>
                  <td className="acciones">
                    <button
                      onClick={() => handleEdit(horario)}
                      className="btn-editar"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDelete(horario.id_horario)}
                      className="btn-eliminar-producto"
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No hay horarios registrados.</td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      <style jsx>{`
        .inventario-container {
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        h1 {
          text-align: center;
          margin-bottom: 20px;
        }

        .edit-form-container {
          background: white;
          padding: 30px;
          border-radius: 8px;
          width: 300px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin: 0 auto 20px;
        }

        input, select {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border-radius: 5px;
          border: 1px solid #ccc;
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }

        .btn-submit,
        .btn-cancel {
          padding: 10px;
          margin: 5px;
          border-radius: 5px;
          border: none;
          cursor: pointer;
        }

        .btn-submit {
          background-color: #28a745;
          color: white;
        }

        .btn-cancel {
          background-color: #dc3545;
          color: white;
        }

        .acciones {
          display: flex;
          gap: 10px;
          text-align: right;
        }

        .acciones button {
          padding: 8px 16px;
          border-radius: 5px;
          cursor: pointer;
          color: white;
          border: none;
        }

        .btn-editar {
          background-color: #ffc107;
        }

        .btn-eliminar-producto {
          background-color: #dc3545;
        }

        .inventario-table {
          width: 100%;
          border-collapse: collapse;
        }

        .inventario-table th,
        .inventario-table td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        .inventario-table tr {
          border-bottom: 2px solid #ddd;
        }

        .inventario-table th {
          background-color: #f2f2f2;
        }

        .inventario-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }

        .inventario-table tr:hover {
          background-color: #f1f1f1;
        }

        .mensaje-error {
          color: red;
          text-align: center;
        }
         
        select[name="dia"] {
         width: 107%; 
          }
      `}</style>
    </div>
  );
};

export default RegistroHorario;