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
  InputAdornment,
  TablePagination,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Inventory,
  Build,
  Search,
  Numbers,
} from "@mui/icons-material";

const Categoria = () => {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editando, setEditando] = useState(null);
  const [productos, setProductos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredCategorias = categorias.filter((categoria) =>
    categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold", color: "#424242" }}>
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
          variant="outlined"
        />
        <TextField
          label="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
          fullWidth
          variant="outlined"
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            {editando ? "Actualizar" : "Agregar"}
          </Button>
          {editando && (
            <Button
              type="button"
              variant="outlined"
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
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#424242" }}>
            Elementos Relacionados a la Categoría: {categoriaSeleccionada.nombre}
          </Typography>
          <TableContainer component={Paper} sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderRadius: "12px", overflow: "hidden" }}>
            <Table sx={{ "& .MuiTableCell-root": { padding: "6px 8px", fontSize: "0.875rem" } }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "rgba(189, 189, 189, 0.2)" }}>
                  <TableCell sx={{ fontWeight: "bold", color: "#424242" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Numbers sx={{ mr: 1, color: "#f57c00", fontSize: "1.2rem" }} /> #
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#424242" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Inventory sx={{ mr: 1, color: "#0288d1", fontSize: "1.2rem" }} /> Nombre
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...productos, ...servicios].slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                  <TableRow key={item.id} sx={{ "&:hover": { backgroundColor: "#f5f5f5" }, height: "36px" }}>
                    <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{index + 1}</TableCell>
                    <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{item.nombre}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={[...productos, ...servicios].length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ backgroundColor: "rgba(189, 189, 189, 0.1)", fontSize: "0.875rem", padding: "4px" }}
            />
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
        <>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth={isMobile}
              variant="outlined"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "#757575" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: 400, borderRadius: 2 }}
            />
          </Box>
          <TableContainer component={Paper} sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderRadius: "12px", overflow: "hidden" }}>
            <Table sx={{ "& .MuiTableCell-root": { padding: "6px 8px", fontSize: "0.875rem" } }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "rgba(189, 189, 189, 0.2)" }}>
                  <TableCell sx={{ fontWeight: "bold", color: "#424242" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Numbers sx={{ mr: 1, color: "#f57c00", fontSize: "1.2rem" }} /> #
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#424242" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Inventory sx={{ mr: 1, color: "#0288d1", fontSize: "1.2rem" }} /> Nombre
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#424242" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Inventory sx={{ mr: 1, color: "#388e3c", fontSize: "1.2rem" }} /> Descripción
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#424242" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Build sx={{ mr: 1, color: "#7b1fa2", fontSize: "1.2rem" }} /> Acciones
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCategorias.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((categoria, index) => (
                  <TableRow
                    key={categoria.id}
                    onClick={() => manejarSeleccionCategoria(categoria)}
                    sx={{ "&:hover": { backgroundColor: "#f5f5f5" }, height: "36px", cursor: "pointer" }}
                  >
                    <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{index + 1}</TableCell>
                    <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{categoria.nombre}</TableCell>
                    <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{categoria.descripcion}</TableCell>
                    <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="Editar">
                          <IconButton
                            color="warning"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              manejarEdicion(categoria);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={(e) => manejarEliminacion(categoria.id, e)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredCategorias.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ backgroundColor: "rgba(189, 189, 189, 0.1)", fontSize: "0.875rem", padding: "4px" }}
            />
          </TableContainer>
        </>
      )}

      {/* Modal para editar categoría */}
      <Modal open={modalEditarAbierto} onClose={() => setModalEditarAbierto(false)}>
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
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#424242" }}>
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
              variant="outlined"
            />
            <TextField
              label="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              fullWidth
              variant="outlined"
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                Actualizar
              </Button>
              <Button
                type="button"
                variant="outlined"
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