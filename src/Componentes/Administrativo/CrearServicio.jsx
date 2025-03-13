import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const CrearServicio = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    id_categoria: "",
  });
  const [imagen, setImagen] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch("https://backendcentro.onrender.com/api/servicios/categoria");
        if (response.ok) {
          const data = await response.json();
          setCategorias(data);
        } else {
          throw new Error("Error al cargar las categorías.");
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar las categorías.",
          icon: "error",
        });
      } finally {
        setLoadingCategorias(false);
      }
    };
    fetchCategorias();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setImagen(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataWithImage = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataWithImage.append(key, formData[key]);
    });
    if (imagen) {
      formDataWithImage.append("imagen", imagen);
    }

    try {
      const response = await fetch("https://backendcentro.onrender.com/api/servicios", {
        method: "POST",
        body: formDataWithImage,
      });

      if (response.ok) {
        Swal.fire({
          title: "Servicio creado",
          text: "El servicio se ha creado exitosamente.",
          icon: "success",
        });
        setFormData({
          nombre: "",
          descripcion: "",
          precio: "",
          id_categoria: "",
        });
        setImagen(null);
      } else {
        Swal.fire({
          title: "Error",
          text: "No se pudo crear el servicio.",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al enviar el formulario.",
        icon: "error",
      });
    }
  };

  const estilos = {
    contenedor: {
      textAlign: "center",
      backgroundColor: "#e0f7fa",
      padding: "20px",
      borderRadius: "15px",
      maxWidth: "500px",
      margin: "40px auto",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    },
    titulo: {
      fontSize: "28px",
      marginBottom: "20px",
      color: "#004d40",
    },
    campo: {
      marginBottom: "15px",
      textAlign: "left",
    },
    input: {
      width: "100%",
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid #b2dfdb",
      fontSize: "16px",
      boxSizing: "border-box",
    },
    boton: {
      backgroundColor: "#00796b",
      color: "white",
      border: "none",
      padding: "12px 20px",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "bold",
      transition: "background-color 0.3s ease",
      display: "block",
      margin: "20px auto 0",
      width: "100%",
    },
  };

  return (
    <div style={estilos.contenedor}>
      <h1 style={estilos.titulo}>Crear Servicio</h1>
      <form onSubmit={handleSubmit}>
        <div style={estilos.campo}>
          <label htmlFor="nombre">Nombre del Servicio</label>
          <input
            style={estilos.input}
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
          />
        </div>

        <div style={estilos.campo}>
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            style={estilos.input}
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        <div style={estilos.campo}>
          <label htmlFor="precio">Precio</label>
          <input
            style={estilos.input}
            type="number"
            id="precio"
            name="precio"
            value={formData.precio}
            onChange={handleInputChange}
            required
          />
        </div>

        <div style={estilos.campo}>
          <label htmlFor="id_categoria">Categoría</label>
          {loadingCategorias ? (
            <p>Cargando categorías...</p>
          ) : (
            <select
              style={estilos.input}
              id="id_categoria"
              name="id_categoria"
              value={formData.id_categoria}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          )}
        </div>

        <div style={estilos.campo}>
          <label htmlFor="imagen">Imagen</label>
          <input
            style={estilos.input}
            type="file"
            id="imagen"
            name="imagen"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        <button style={estilos.boton} type="submit">
          Crear Servicio
        </button>
      </form>
    </div>
  );
};

export default CrearServicio;
