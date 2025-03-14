import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Box,
  Avatar,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const MySwal = withReactContent(Swal);

const Perfil = () => {
  const [perfil, setPerfil] = useState({
    nombreEmpresa: "",
    eslogan: "",
    logo: null,
    direccion: "",
    correo: "",
    telefono: "",
    redesSociales: {
      facebook: "",
      twitter: "",
      linkedin: "",
      instagram: "",
    },
  });
  const [perfiles, setPerfiles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const fetchPerfiles = async () => {
      try {
        const response = await axios.get("https://backendcentro.onrender.com/api/perfil");
        setPerfiles(response.data);
      } catch (error) {
        console.error("Error al obtener perfiles:", error.message);
      }
    };
    fetchPerfiles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "telefono") {
      if (/^\d*$/.test(value) && value.length <= 10) {
        setPerfil({
          ...perfil,
          [name]: value,
        });
      }
    } else if (name === "nombreEmpresa" || name === "eslogan") {
      const regex = /^[a-zA-Z0-9 ]*$/;
      if (regex.test(value) && value.length <= 50) {
        setPerfil({
          ...perfil,
          [name]: value,
        });
      }
    } else {
      setPerfil({
        ...perfil,
        [name]: value,
      });
    }
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setPerfil({
      ...perfil,
      redesSociales: {
        ...perfil.redesSociales,
        [name]: value,
      },
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPerfil({
        ...perfil,
        logo: file, // Guardar el archivo directamente
      });
      setLogoError(false);
    }
  };

  const validateUrls = () => {
    const urlPattern = /^(https:\/\/www\.(facebook|twitter|linkedin|instagram)\.com)\/?/;
    const { facebook, twitter, linkedin, instagram } = perfil.redesSociales;
    let errorMessage = "";

    if (facebook && !urlPattern.test(facebook)) {
      errorMessage = "La URL de Facebook no es válida. Debe comenzar con https://www.facebook.com.";
    } else if (twitter && !urlPattern.test(twitter)) {
      errorMessage = "La URL de Twitter no es válida. Debe comenzar con https://twitter.com.";
    } else if (linkedin && !urlPattern.test(linkedin)) {
      errorMessage = "La URL de LinkedIn no es válida. Debe comenzar con https://www.linkedin.com.";
    } else if (instagram && !urlPattern.test(instagram)) {
      errorMessage = "La URL de Instagram no es válida. Debe comenzar con https://instagram.com.";
    }

    return errorMessage;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que se haya cargado una imagen
    if (!perfil.logo) {
      setLogoError(true);
      MySwal.fire({
        title: "Error!",
        text: "Por favor, carga un logo antes de continuar.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const requiredFields = ["eslogan", "direccion", "correo", "telefono"];
    const socialFields = ["facebook", "twitter", "linkedin", "instagram"];

    const allFieldsFilled = requiredFields.every((field) => perfil[field]);
    const allSocialFieldsFilled = socialFields.every((field) => perfil.redesSociales[field]);
    const isPhoneValid = /^\d{10}$/.test(perfil.telefono);

    const errorMessage = validateUrls();

    if (!allFieldsFilled || !allSocialFieldsFilled || !isPhoneValid) {
      let message = "Por favor, llena todos los campos";
      if (!isPhoneValid) {
        message = "El teléfono debe tener exactamente 10 dígitos numéricos.";
      }
      MySwal.fire({
        title: "Error!",
        text: message,
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (errorMessage) {
      MySwal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const formData = new FormData();
    formData.append("nombreEmpresa", perfil.nombreEmpresa);
    formData.append("eslogan", perfil.eslogan);
    formData.append("direccion", perfil.direccion);
    formData.append("correo", perfil.correo);
    formData.append("telefono", perfil.telefono);
    formData.append("facebook", perfil.redesSociales.facebook);
    formData.append("twitter", perfil.redesSociales.twitter);
    formData.append("linkedin", perfil.redesSociales.linkedin);
    formData.append("instagram", perfil.redesSociales.instagram);
    if (perfil.logo) {
      formData.append("logo", perfil.logo); // Asegúrate de enviar el archivo
    }

    try {
      if (editingId) {
        await axios.put(`https://backendcentro.onrender.com/api/perfil/${editingId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        MySwal.fire({
          title: "Éxito!",
          text: "El perfil ha sido actualizado correctamente.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        await axios.post("https://backendcentro.onrender.com/api/perfil", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        MySwal.fire({
          title: "Éxito!",
          text: "El perfil ha sido creado correctamente.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }

      setPerfil({
        nombreEmpresa: "",
        eslogan: "",
        logo: null,
        direccion: "",
        correo: "",
        telefono: "",
        redesSociales: {
          facebook: "",
          twitter: "",
          linkedin: "",
          instagram: "",
        },
      });
      setEditingId(null);
      const response = await axios.get("https://backendcentro.onrender.com/api/perfil");
      setPerfiles(response.data);
    } catch (error) {
      console.error("Error al guardar perfil:", error.message);
      MySwal.fire({
        title: "Error!",
        text: "Hubo un problema al guardar el perfil. Por favor, verifica los datos.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto después de eliminarlo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://backendcentro.onrender.com/api/perfil/${id}`);
        setPerfiles(perfiles.filter((p) => p.id !== id));
        Swal.fire("Eliminado!", "El perfil ha sido eliminado.", "success");
      } catch (error) {
        console.error("Error al eliminar perfil:", error.message);
        Swal.fire("Error!", "Hubo un problema al intentar eliminar el perfil.", "error");
      }
    }
  };

  const handleEdit = (perfil) => {
    setPerfil(perfil);
    setEditingId(perfil.id);
  };

  const handleCancel = () => {
    setPerfil({
      nombreEmpresa: "",
      eslogan: "",
      logo: null,
      direccion: "",
      correo: "",
      telefono: "",
      redesSociales: {
        facebook: "",
        twitter: "",
        linkedin: "",
        instagram: "",
      },
    });
    setEditingId(null);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: "bold", color: "success.main" }}>
        Gestión de Perfil
      </Typography>

      <Paper sx={{ p: 3, mb: 3, borderRadius: 4, boxShadow: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre de la Empresa"
                name="nombreEmpresa"
                value={perfil.nombreEmpresa}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Eslogan"
                name="eslogan"
                value={perfil.eslogan}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handleLogoChange}
                  style={{ display: "none" }}
                  id="logo-upload"
                  required
                />
                <label htmlFor="logo-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    color="success"
                  >
                    Subir Logo
                  </Button>
                </label>
                {perfil.logo && (
                  <Avatar
                    src={URL.createObjectURL(perfil.logo)} // Mostrar la imagen seleccionada
                    alt="Logo de la empresa"
                    sx={{ width: 100, height: 100, mt: 2 }}
                  />
                )}
                {logoError && (
                  <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    Por favor, carga un logo.
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dirección"
                name="direccion"
                value={perfil.direccion}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Correo"
                name="correo"
                type="email"
                value={perfil.correo}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono (10 dígitos)"
                name="telefono"
                value={perfil.telefono}
                onChange={handleChange}
                required
                inputProps={{ maxLength: 10 }}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 3, mb: 2, color: "success.main" }}>
            Redes Sociales
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={<><FaFacebook /> Facebook</>}
                name="facebook"
                value={perfil.redesSociales.facebook}
                onChange={handleSocialChange}
                placeholder="https://www.facebook.com"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={<><FaTwitter /> Twitter</>}
                name="twitter"
                value={perfil.redesSociales.twitter}
                onChange={handleSocialChange}
                placeholder="https://www.twitter.com"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={<><FaLinkedin /> LinkedIn</>}
                name="linkedin"
                value={perfil.redesSociales.linkedin}
                onChange={handleSocialChange}
                placeholder="https://www.linkedin.com"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={<><FaInstagram /> Instagram</>}
                name="instagram"
                value={perfil.redesSociales.instagram}
                onChange={handleSocialChange}
                placeholder="https://www.instagram.com"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button type="submit" variant="contained" color="success">
              {editingId ? "Actualizar Perfil" : "Crear Perfil"}
            </Button>
            <Button type="button" onClick={handleCancel} variant="outlined" color="error">
              Cancelar
            </Button>
          </Box>
        </form>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ color: "success.main" }}>
          Perfiles Guardados
        </Typography>
        {perfiles.map((perfil) => (
          <Paper key={perfil.id} sx={{ p: 2, mb: 2, borderRadius: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                {perfil.logo && (
                  <Avatar
                    src={perfil.logo}
                    alt="Logo de la empresa"
                    sx={{ width: 100, height: 100 }}
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={9}>
                <Typography variant="body1">
                  <strong>Nombre de la Empresa:</strong> {perfil.nombreEmpresa}
                </Typography>
                <Typography variant="body1">
                  <strong>Eslogan:</strong> {perfil.eslogan}
                </Typography>
                <Typography variant="body1">
                  <strong>Dirección:</strong> {perfil.direccion}
                </Typography>
                <Typography variant="body1">
                  <strong>Correo:</strong> {perfil.correo}
                </Typography>
                <Typography variant="body1">
                  <strong>Teléfono:</strong> {perfil.telefono}
                </Typography>
                <Typography variant="body1">
                  <strong>Facebook:</strong> {perfil.redesSociales.facebook}
                </Typography>
                <Typography variant="body1">
                  <strong>Twitter:</strong> {perfil.redesSociales.twitter}
                </Typography>
                <Typography variant="body1">
                  <strong>LinkedIn:</strong> {perfil.redesSociales.linkedin}
                </Typography>
                <Typography variant="body1">
                  <strong>Instagram:</strong> {perfil.redesSociales.instagram}
                </Typography>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleEdit(perfil)}
              >
                Editar
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(perfil.id)}
              >
                Eliminar
              </Button>
            </Box>
          </Paper>
        ))}
      </Paper>
    </Container>
  );
};

export default Perfil;