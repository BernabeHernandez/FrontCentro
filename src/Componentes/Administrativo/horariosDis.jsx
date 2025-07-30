import React, { useState, useEffect } from "react";
import axios from "axios";
import { format, addDays, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  TextField,
} from "@mui/material";
import {
  CalendarToday,
  AccessTime,
  CheckCircle,
  Cancel,
  Person,
  Email,
  Phone,
  Event,
  Search,
  Build,
  Info, // Añadido para corregir el error de 'Info' is not defined
} from "@mui/icons-material";
import { styled } from '@mui/system';

const HorariosDis = () => {
  const [diasDisponibles, setDiasDisponibles] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [citasDelDia, setCitasDelDia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const getDiasDisponibles = async () => {
    try {
      const response = await axios.get("https://backendcentro.onrender.com/api/citasC/dias-disponibles");
      const diasConHorario = response.data;
      const hoy = new Date();
      const diaActual = hoy.getDay();
      const horaActual = hoy.getHours();

      const horarioHoy = diasConHorario.find(
        (dia) => dia.dia.toLowerCase() === format(hoy, "EEEE", { locale: es }).toLowerCase()
      );
      const horaInicioHoy = parseInt(horarioHoy.hora_inicio.split(":")[0], 10);
      const horaFinHoy = parseInt(horarioHoy.hora_fin.split(":")[0], 10);

      const dentroDelHorario = horaActual >= horaInicioHoy && horaActual < horaFinHoy;

      let diasDisponiblesAjustados;
      if (dentroDelHorario) {
        diasDisponiblesAjustados = diasConHorario.slice(diaActual - 1).concat(diasConHorario.slice(0, diaActual - 1));
      } else {
        diasDisponiblesAjustados = diasConHorario.slice(diaActual).concat(diasConHorario.slice(0, diaActual));
      }

      const diasConFechas = diasDisponiblesAjustados.map((dia, index) => {
        const fecha = addDays(hoy, index);
        const nombreDia = format(fecha, "EEEE", { locale: es }).toLowerCase();
        return {
          nombre: nombreDia,
          fecha: fecha,
          fechaFormateada: format(fecha, "EEEE, d 'de' MMMM", { locale: es }),
          hora_inicio: dia.hora_inicio,
          hora_fin: dia.hora_fin,
        };
      });

      setDiasDisponibles(diasConFechas);
    } catch (error) {
      console.error("Error al obtener los días disponibles:", error);
    }
  };

  useEffect(() => {
    getDiasDisponibles();
  }, []);



  const handleSelectDay = async (dia, fecha) => {
    setSelectedDay(dia);
    setLoading(true);

    try {
      const response = await axios.get(`https://backendcentro.onrender.com/api/citasC/franjas/${dia}`);
      setHorarios(response.data);

      const fechaFormateada = format(fecha, "yyyy-MM-dd");
      const citasResponse = await axios.get(`https://backendcentro.onrender.com/api/citasC/citas-del-dia/${fechaFormateada}`);

      // Obtener predicciones para cada cita
      const citasConPrediccion = await Promise.all(citasResponse.data.map(async (cita) => {
        const data = {
          edad: cita.edad || 0,
          mes: cita.mes || '',
          dia: cita.dia || '',
          hora_inicio: cita.hora_inicio || '',
          servicio: cita.servicio || '',
          total_citas: cita.total_citas || 0,
          total_canceladas: cita.total_canceladas || 0,
          total_completadas: cita.total_completadas || 0,
          total_pendientes: cita.total_pendientes || 0
        };

        try {
          const predictionResponse = await axios.post('https://backendmodelos.onrender.com/predict', data, {
            headers: { 'Content-Type': 'application/json' }
          });
          return { ...cita, prediccion: predictionResponse.data.prediction };
        } catch (error) {
          console.error(`Error al predecir para cita ${cita.id_cita}:`, error);
          return { ...cita, prediccion: 'Error en predicción' };
        }
      }));

      setCitasDelDia(citasConPrediccion);
    } catch (error) {
      console.error("Error al obtener las franjas horarias o citas:", error);
      setHorarios([]);
      setCitasDelDia([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCitas = citasDelDia.filter((cita) =>
    cita.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cita.apellidopa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cita.apellidoma.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold", color: "#424242", display: "flex", alignItems: "center" }}>
        <CalendarToday sx={{ mr: 1 }} />
        Horarios Disponibles
      </Typography>

      {/* Días disponibles */}
      <Paper sx={{ padding: 3, marginBottom: 3, borderRadius: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", fontWeight: "bold", color: "#388e3c" }}>
          <CalendarToday sx={{ mr: 1, fontSize: "1.5rem" }} />
          Días disponibles:
        </Typography>
        <Grid container spacing={2}>
          {diasDisponibles.map((dia, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Button
                fullWidth
                variant={selectedDay === dia.nombre ? "contained" : "outlined"}
                onClick={() => handleSelectDay(dia.nombre, dia.fecha)}
                sx={{
                  padding: "16px",
                  borderRadius: "12px",
                  textTransform: "capitalize",
                  background: selectedDay === dia.nombre
                    ? "linear-gradient(45deg, #388e3c 30%, #66bb6a 90%)"
                    : "linear-gradient(45deg, #ffffff 30%, #f5f5f5 90%)",
                  color: selectedDay === dia.nombre ? "#fff" : "#424242",
                  border: "2px solid #388e3c",
                  transition: "all 0.3s ease",
                  boxShadow: selectedDay === dia.nombre ? "0 6px 12px rgba(56, 142, 60, 0.3)" : "0 2px 4px rgba(0,0,0,0.1)",
                  "&:hover": {
                    background: selectedDay === dia.nombre
                      ? "linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)"
                      : "linear-gradient(45deg, #e8f5e9 30%, #c8e6c9 90%)",
                    transform: "translateY(-3px)",
                    boxShadow: "0 8px 16px rgba(56, 142, 60, 0.2)",
                  },
                }}
              >
                <Box textAlign="center">
                  <Typography variant="h5" component="div" sx={{ fontWeight: "bold", letterSpacing: "1px" }}>
                    {format(dia.fecha, "d")}
                  </Typography>
                  <Typography variant="body1" component="div" sx={{ fontWeight: "medium", textTransform: "capitalize" }}>
                    {format(dia.fecha, "EEEE", { locale: es })}
                  </Typography>
                  <Typography variant="caption" component="div" sx={{ color: selectedDay === dia.nombre ? "#e8f5e9" : "#757575", fontStyle: "italic" }}>
                    {`${dia.hora_inicio} - ${dia.hora_fin}`}
                  </Typography>
                </Box>
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Horarios disponibles */}
      {selectedDay && (
        <Paper sx={{ padding: 3, marginBottom: 3, borderRadius: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", fontWeight: "bold", color: "#424242" }}>
            <AccessTime sx={{ mr: 1 }} />
            Horarios disponibles para {selectedDay}:
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : horarios.length === 0 ? (
            <Typography>No hay horarios disponibles para este día.</Typography>
          ) : (
            <Grid container spacing={2}>
              {horarios.map((horario) => (
                <Grid item xs={12} key={horario.id_horario}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "medium" }}>
                    {`${horario.hora_inicio} - ${horario.hora_fin}`}
                  </Typography>
                  <Grid container spacing={1}>
                    {horario.franjas.map((franja) => (
                      <Grid item key={franja.id_franja}>
                        <Button
                          variant={franja.disponible ? "outlined" : "contained"}
                          color={franja.disponible ? "success" : "error"}
                          disabled={!franja.disponible}
                          startIcon={franja.disponible ? <CheckCircle /> : <Cancel />}
                          sx={{
                            textTransform: "none",
                            borderRadius: 2,
                            padding: "6px 12px",
                          }}
                        >
                          {`${franja.hora_inicio} - ${franja.hora_fin}`}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      )}

      {/* Citas del día */}
      {citasDelDia.length > 0 && (
        <Paper sx={{ padding: 3, borderRadius: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", fontWeight: "bold", color: "#424242" }}>
            <CalendarToday sx={{ mr: 1 }} />
            Citas para {selectedDay}:
          </Typography>
          <Box sx={{ mb: 2 }}>
            <TextField
              variant="outlined"
              placeholder="Buscar por nombre o apellido..."
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

          {/* Tabla con scroll horizontal */}
          <Box sx={{
            width: '100%',
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f1f1f1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#888',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: '#555',
              },
            },
          }}>
                         <TableContainer sx={{
               borderRadius: "12px",
               overflow: "hidden",
               minWidth: 1400, // Aumentado para asegurar que todas las columnas sean visibles
             }}>
                             <Table sx={{ "& .MuiTableCell-root": { padding: "6px 8px", fontSize: "0.875rem", textAlign: "center" } }}>
                <TableHead>
                                     <TableRow sx={{ backgroundColor: "rgba(189, 189, 189, 0.2)" }}>
                     <TableCell sx={{ fontWeight: "bold", color: "#424242", textAlign: "center" }}>
                       <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                         <Person sx={{ mr: 1, color: "#0288d1", fontSize: "1.2rem" }} /> Nombre
                       </Box>
                     </TableCell>
                     <TableCell sx={{ fontWeight: "bold", color: "#424242", textAlign: "center" }}>
                       <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                         <Person sx={{ mr: 1, color: "#388e3c", fontSize: "1.2rem" }} /> Apellido Paterno
                       </Box>
                     </TableCell>
                     <TableCell sx={{ fontWeight: "bold", color: "#424242", textAlign: "center" }}>
                       <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                         <Person sx={{ mr: 1, color: "#f57c00", fontSize: "1.2rem" }} /> Apellido Materno
                       </Box>
                     </TableCell>
                     <TableCell sx={{ fontWeight: "bold", color: "#424242", textAlign: "center" }}>
                       <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                         <Info sx={{ mr: 1, color: "#f57c00", fontSize: "1.2rem" }} /> Edad
                       </Box>
                     </TableCell>
                     <TableCell sx={{ fontWeight: "bold", color: "#424242", textAlign: "center" }}>
                       <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                         <AccessTime sx={{ mr: 1, color: "#0288d1", fontSize: "1.2rem" }} /> Inicio
                       </Box>
                     </TableCell>
                     <TableCell sx={{ fontWeight: "bold", color: "#424242", textAlign: "center" }}>
                       <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                         <Build sx={{ mr: 1, color: "#0288d1", fontSize: "1.2rem" }} /> Servicio
                       </Box>
                     </TableCell>
                     <TableCell sx={{ fontWeight: "bold", color: "#424242", textAlign: "center" }}>
                       <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                         <Event sx={{ mr: 1, color: "#388e3c", fontSize: "1.2rem" }} /> Mes
                       </Box>
                     </TableCell>
                     <TableCell sx={{ fontWeight: "bold", color: "#424242", textAlign: "center" }}>
                       <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                         <Event sx={{ mr: 1, color: "#0288d1", fontSize: "1.2rem" }} /> Día
                       </Box>
                     </TableCell>
                     <TableCell sx={{ fontWeight: "bold", color: "#424242", textAlign: "center" }}>
                       <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                         <Info sx={{ mr: 1, color: "#388e3c", fontSize: "1.2rem" }} /> Total Citas
                       </Box>
                     </TableCell>
                     <TableCell sx={{ fontWeight: "bold", color: "#424242", textAlign: "center" }}>
                       <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                         <CheckCircle sx={{ mr: 1, color: "#388e3c", fontSize: "1.2rem" }} /> Completadas
                       </Box>
                     </TableCell>
                     <TableCell sx={{ fontWeight: "bold", color: "#424242", textAlign: "center" }}>
                       <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                         <Cancel sx={{ mr: 1, color: "#d32f2f", fontSize: "1.2rem" }} /> Canceladas
                       </Box>
                     </TableCell>
                     <TableCell sx={{ fontWeight: "bold", color: "#424242", textAlign: "center" }}>
                       <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                         <AccessTime sx={{ mr: 1, color: "#f57c00", fontSize: "1.2rem" }} /> Pendientes
                       </Box>
                     </TableCell>

                     <TableCell sx={{ fontWeight: "bold", color: "#424242", minWidth: 120, textAlign: "center" }}>
                       <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                         <Info sx={{ mr: 1, color: "#0288d1", fontSize: "1.2rem" }} /> Predicción
                       </Box>
                     </TableCell>
                    
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCitas.length > 0 ? (
                    filteredCitas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((cita) => (
                      <TableRow key={cita.id} sx={{ "&:hover": { backgroundColor: "#f5f5f5" }, height: "36px" }}>
                        <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{cita.nombre}</TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{cita.apellidopa}</TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{cita.apellidoma}</TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{cita.edad}</TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{cita.hora_inicio}</TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{cita.servicio}</TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{cita.mes}</TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{cita.dia}</TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{cita.total_citas}</TableCell>

                        <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{cita.total_completadas}</TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{cita.total_canceladas}</TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{cita.total_pendientes}</TableCell>

                                                 <TableCell sx={{ borderBottom: "1px solid #e0e0e0", minWidth: 120 }}>{cita.prediccion}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={13} align="center" sx={{ borderBottom: "1px solid #e0e0e0", height: "36px" }}>
                        No hay citas para este día.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 20]}
                component="div"
                count={filteredCitas.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ backgroundColor: "rgba(189, 189, 189, 0.1)", fontSize: "0.875rem", padding: "4px" }}
              />
            </TableContainer>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default HorariosDis;