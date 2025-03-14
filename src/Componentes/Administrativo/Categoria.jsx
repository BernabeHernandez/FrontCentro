import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Modal,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Close as CloseIcon } from "@mui/icons-material";

const Categoria = () => {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editando, setEditando] = useState(null);
  const [productos, setProductos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
      title: `¿Estás seguro de que deseas ${editando ? "actualizar" : "agregar"} esta categoría?`,
      text: `Esta acción ${editando ? "no se puede deshacer" : ""}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Sí, ${editando ? "actualizar" : "agregar"}`,
      cancelButtonText: "No, cancelar",
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
            `La categoría ha sido ${editando ? "actualizada" : "agregada"} correctamente.`,
            "success"
          );
        } catch (error) {
          console.error("Error al guardar categoría", error);
          Swal.fire("Error", "Hubo un problema al guardar la categoría.", "error");
        }
      }
    });
  };

  const manejarEdicion = (categoria) => {
    setNombre(categoria.nombre);
    setDescripcion(categoria.descripcion);
    setEditando(categoria.id);
    setModalEditarAbierto(true);
  };

  const manejarEliminacion = async (id, e) => {
    e.stopPropagation();
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
          await axios.delete(`https://backendcentro.onrender.com/api/categoria/${id}`);
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
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Gestión de Categorías
      </Typography>

      {/* Formulario para agregar o editar categoría */}
      <Box
        component="form"
        onSubmit={manejarEnvio}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 500,
          margin: "0 auto",
          marginBottom: 4,
        }}
      >
        <TextField
          label="Nombre de la categoría"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
          fullWidth
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            {editando ? "Actualizar" : "Agregar"}
          </Button>
          {editando && (
            <Button
              type="button"
              variant="contained"
              color="secondary"
              onClick={() => {
                setNombre("");
                setDescripcion("");
                setEditando(null);
              }}
            >
              Cancelar
            </Button>
          )}
        </Box>
      </Box>

      {/* Mostrar productos y servicios de la categoría seleccionada */}
      {categoriaSeleccionada && (
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h5" gutterBottom>
            Elementos Relacionados a la Categoría: {categoriaSeleccionada.nombre}
          </Typography>
          <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Nombre</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...productos, ...servicios].map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.nombre}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="contained"
            color="error"
            onClick={() => setCategoriaSeleccionada(null)}
            sx={{ marginTop: 2 }}
            startIcon={<CloseIcon />}
          >
            Cerrar
          </Button>
        </Box>
      )}

      {/* Tabla de categorías */}
      {!categoriaSeleccionada && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categorias.map((categoria, index) => (
                <TableRow
                  key={categoria.id}
                  onClick={() => manejarSeleccionCategoria(categoria)}
                  sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" } }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{categoria.nombre}</TableCell>
                  <TableCell>{categoria.descripcion}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Editar">
                        <IconButton
                          color="warning"
                          onClick={(e) => {
                            e.stopPropagation();
                            manejarEdicion(categoria);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          color="error"
                          onClick={(e) => manejarEliminacion(categoria.id, e)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal para editar categoría */}
      <Modal
        open={modalEditarAbierto}
        onClose={() => setModalEditarAbierto(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "90%" : 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Editar Categoría
          </Typography>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              manejarEnvio(e);
              setModalEditarAbierto(false);
            }}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Nombre de la categoría"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              fullWidth
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                Actualizar
              </Button>
              <Button
                type="button"
                variant="contained"
                color="secondary"
                onClick={() => setModalEditarAbierto(false)}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Categoria;