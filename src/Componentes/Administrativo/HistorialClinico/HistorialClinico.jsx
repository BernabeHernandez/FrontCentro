import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  CircularProgress,
  TextField,
  InputAdornment,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate } from "react-router-dom";

const HistorialClinico = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://backendcentro.onrender.com/api/historial-clinico/pacientes")
      .then((res) => res.json())
      .then((data) => {
        setPacientes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener pacientes:", err);
        setLoading(false);
      });
  }, []);

  const pacientesFiltrados = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return pacientes;

    return pacientes.filter((p) => {
      const nombreCompleto = `${p.nombre} ${p.apellidopa} ${p.apellidoma}`.toLowerCase();
      return nombreCompleto.includes(term);
    });
  }, [search, pacientes]);

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        bgcolor: "background.default",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        pt: 6,
        pb: 6,
        px: 2,
        overflowX: "hidden", // sin scroll horizontal
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: 700,
          borderRadius: 3,
          p: 4,
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh", // para que no crezca demasiado en vertical
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 4,
            color: "text.primary",
            fontWeight: "bold",
            fontSize: 28,
            userSelect: "none",
          }}
        >
          <PeopleIcon color="primary" sx={{ fontSize: 36 }} />
          <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary">
            Pacientes
          </Typography>
        </Box>

        {/* Search box */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar paciente por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
              transition: "box-shadow 0.3s ease-in-out",
            },
            "& .MuiOutlinedInput-root:hover": {
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />

        {/* Contenido: loading o lista */}
        {loading ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress color="primary" size={60} />
          </Box>
        ) : pacientesFiltrados.length === 0 ? (
          <Typography
            variant="h6"
            color="text.secondary"
            align="center"
            sx={{ mt: 6, flexGrow: 1 }}
          >
            No se encontraron pacientes que coincidan con la búsqueda.
          </Typography>
        ) : (
          <List
            sx={{
              overflowY: "auto",
              maxHeight: "calc(90vh - 160px)", // espacio para header y buscador
            }}
          >
            {pacientesFiltrados.map((p) => {
              const initials = `${p.nombre.charAt(0)}${p.apellidopa.charAt(0)}`.toUpperCase();
              return (
                <ListItemButton
                  key={p.id}
                  onClick={() => navigate(`/admin/detallehistorial/${p.id}`)}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    boxShadow: "0 1px 5px rgba(0, 0, 0, 0.08)",
                    transition: "background-color 0.25s ease",
                    "&:hover": {
                      bgcolor: "primary.main",
                      color: "common.white",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      "& .MuiAvatar-root": {
                        bgcolor: "primary.dark",
                        color: "common.white",
                      },
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        fontWeight: "bold",
                        fontSize: 18,
                        width: 46,
                        height: 46,
                      }}
                      aria-label="avatar-paciente"
                    >
                      {initials}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${p.nombre} ${p.apellidopa} ${p.apellidoma}`}
                    secondary={`ID: ${p.id}`}
                    primaryTypographyProps={{ fontWeight: "medium" }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default HistorialClinico;
