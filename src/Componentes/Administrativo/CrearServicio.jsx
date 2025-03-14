import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";

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

  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: "40px auto",
        padding: 3,
        backgroundColor: "white",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Crear Servicio
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Nombre del Servicio"
          name="nombre"
          value={formData.nombre}
          onChange={handleInputChange}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Descripción"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleInputChange}
          required
          margin="normal"
          multiline
          rows={4}
        />
        <TextField
          fullWidth
          label="Precio"
          name="precio"
          type="number"
          value={formData.precio}
          onChange={handleInputChange}
          required
          margin="normal"
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Categoría</InputLabel>
          <Select
            name="id_categoria"
            value={formData.id_categoria}
            onChange={handleInputChange}
            label="Categoría"
          >
            <MenuItem value="">Seleccione una categoría</MenuItem>
            {loadingCategorias ? (
              <MenuItem disabled>
                <CircularProgress size={20} />
              </MenuItem>
            ) : (
              categorias.map((categoria) => (
                <MenuItem key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" required>
          <input
            type="file"
            id="imagen"
            name="imagen"
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />
          <label htmlFor="imagen">
            <Button
              variant="outlined"
              component="span"
              fullWidth
              startIcon={<CloudUploadIcon />}
              sx={{
                padding: 2,
                borderStyle: "dashed",
                borderColor: "primary.main",
                "&:hover": {
                  borderColor: "primary.dark",
                },
              }}
            >
              Subir Imagen
            </Button>
          </label>
          {imagen && (
            <Typography variant="body2" sx={{ marginTop: 1, textAlign: "center" }}>
              {imagen.name}
            </Typography>
          )}
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          Crear Servicio
        </Button>
      </form>
    </Box>
  );
};

export default CrearServicio;