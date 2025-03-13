import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Categoria = () => {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editando, setEditando] = useState(null);
  const [productos, setProductos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  useEffect(() => {
    obtenerCategorias();
  }, []);

  const obtenerCategorias = async () => {
    try {
      const response = await axios.get("https://backendcentro.onrender.com/api/categoria");
      setCategorias(response.data);
    } catch (error) {
      console.error("Error al obtener categorías", error);
    }
  };

  const obtenerProductosYServicios = async (idCategoria) => {
    try {
      const response = await axios.get(`https://backendcentro.onrender.com/api/categoria/${idCategoria}/categorias-relacionadas`);
      const { productos, servicios } = response.data;
      setProductos(productos);
      setServicios(servicios);
    } catch (error) {
      console.error("Error al obtener productos y servicios", error);
    }
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: `¿Estás seguro de que deseas ${editando ? 'actualizar' : 'agregar'} esta categoría?`,
      text: `Esta acción ${editando ? 'no se puede deshacer' : ''}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Sí, ${editando ? 'actualizar' : 'agregar'}`,
      cancelButtonText: 'No, cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (editando) {
            await axios.put(`https://backendcentro.onrender.com/api/categoria/${editando}`, { nombre, descripcion });
          } else {
            await axios.post("https://backendcentro.onrender.com/api/categoria", { nombre, descripcion });
          }

          setNombre("");
          setDescripcion("");
          setEditando(null);
          obtenerCategorias();
          Swal.fire(
            editando ? "Actualizada" : "Agregada",
            `La categoría ha sido ${editando ? 'actualizada' : 'agregada'} correctamente.`,
            "success"
          );
        } catch (error) {
          console.error("Error al guardar categoría", error);
          Swal.fire("Error", "Hubo un problema al guardar la categoría.", "error");
        }
      }
    });
  };

  const manejarEdicion = (categoria, e) => {
    e.stopPropagation(); // Evitar que el clic se propague y active la selección de categoría
    setNombre(categoria.nombre);
    setDescripcion(categoria.descripcion);
    setEditando(categoria.id);
  };

  const manejarEliminacion = async (id, e) => {
    e.stopPropagation(); // Evitar que el clic se propague y active la selección de categoría
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3302/api/categoria/${id}`);
          obtenerCategorias();
          Swal.fire("Eliminada", "La categoría ha sido eliminada.", "success");
        } catch (error) {
          console.error("Error al eliminar categoría", error);
          Swal.fire("Error", "Hubo un problema al eliminar la categoría.", "error");
        }
      }
    });
  };

  const manejarSeleccionCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria);
    obtenerProductosYServicios(categoria.id);
  };

  return (
    <div className="inventario-container">
      <h1>Gestión de Categorías</h1>

      {/* Formulario para agregar o editar categoría */}
      <div className="edit-form-container">
        <form onSubmit={manejarEnvio} className="edit-form">
          <input
            className="input"
            placeholder="Nombre de la categoría"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            className="input"
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
          <div className="form-actions">
            <button type="submit" className="btn-submit">
              {editando ? "Actualizar" : "Agregar"}
            </button>
            {editando && (
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  setNombre("");
                  setDescripcion("");
                  setEditando(null);
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Mostrar productos y servicios de la categoría seleccionada */}
      {categoriaSeleccionada && (
        <div className="tabla-relacionada">
          <h2>Elementos Relacionados a la Categoría: {categoriaSeleccionada.nombre}</h2>
          <div className="tabla-scrollable">
            <table className="inventario-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                </tr>
              </thead>
              <tbody>
                {[...productos, ...servicios].map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.nombre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn-cerrar" onClick={() => setCategoriaSeleccionada(null)}>
            Cerrar
          </button>
        </div>
      )}

      {/* Tabla de categorías */}
      {!categoriaSeleccionada && (
        <table className="inventario-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria, index) => (
              <tr key={categoria.id} onClick={() => manejarSeleccionCategoria(categoria)} style={{ cursor: 'pointer' }}>
                <td>{index + 1}</td>
                <td>{categoria.nombre}</td>
                <td>{categoria.descripcion}</td>
                <td className="acciones">
                  <button onClick={(e) => manejarEdicion(categoria, e)} className="btn-editar">
                    Editar
                  </button>
                  <button onClick={(e) => manejarEliminacion(categoria.id, e)} className="btn-eliminar">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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
          margin-bottom: 20px;
        }

        .edit-form {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .input {
          width: 30%;
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
        .btn-cancel,
        .btn-confirm {
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

        .btn-confirm {
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
        }

        .acciones button {
          padding: 8px 16px;
          border-radius: 5px;
          cursor: pointer;
          color: white;
          border: none;
        }

        .btn-agregar {
          background-color: #28a745;
        }

        .btn-eliminar {
          background-color: #dc3545;
        }

        .btn-editar {
          background-color: #ffc107;
        }

        .inventario-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
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

        .tabla-relacionada {
          margin-top: 20px;
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        }

        .tabla-scrollable {
          max-height: 400px;
          overflow-y: auto;
        }

        .btn-cerrar {
          background-color: #dc3545;
          color: white;
          padding: 10px 20px;
          margin-top: 10px;
          border-radius: 5px;
          border: none;
          cursor: pointer;
        }

        .btn-cerrar:hover {
          background-color: #c82333;
        }
      `}</style>
    </div>
  );
};

export default Categoria;
