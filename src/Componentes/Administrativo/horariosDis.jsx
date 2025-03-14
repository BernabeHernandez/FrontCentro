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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { CalendarToday, AccessTime, CheckCircle, Cancel } from "@mui/icons-material";

const HorariosDis = () => {
  const [diasDisponibles, setDiasDisponibles] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [citasDelDia, setCitasDelDia] = useState([]);
  const [loading, setLoading] = useState(false);

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
      setCitasDelDia(citasResponse.data);
    } catch (error) {
      console.error("Error al obtener las franjas horarias:", error);
      setHorarios([]);
      setCitasDelDia([]);
    } finally {
      setLoading(false);
    }
  };

  // Columnas para la tabla de citas
  const columns = [
    { field: "nombre", headerName: "Nombre", flex: 1 },
    { field: "apellidopa", headerName: "Apellido Paterno", flex: 1 },
    { field: "apellidoma", headerName: "Apellido Materno", flex: 1 },
    { field: "gmail", headerName: "Email", flex: 1 },
    { field: "telefono", headerName: "Teléfono", flex: 1 },
    {
      field: "fecha_cita",
      headerName: "Fecha de la Cita",
      flex: 1,
      valueFormatter: (params) =>
        params.value ? format(parseISO(params.value), "dd/MM/yyyy") : "Fecha no disponible",
    },
    { field: "hora_inicio", headerName: "Hora Inicio", flex: 1 },
    { field: "hora_fin", headerName: "Hora Fin", flex: 1 },
  ];

  return (
    <Box sx={{ padding: 3, maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        <CalendarToday sx={{ verticalAlign: "middle", marginRight: 1 }} />
        Horarios Disponibles
      </Typography>

      {/* Días disponibles */}
      <Paper sx={{ padding: 3, marginBottom: 3, borderRadius: 4, boxShadow: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", fontWeight: "bold", color: "success.main" }}>
          <CalendarToday sx={{ verticalAlign: "middle", marginRight: 1, fontSize: "1.5rem" }} />
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
                  padding: 3,
                  borderRadius: 3,
                  textTransform: "capitalize",
                  backgroundColor: selectedDay === dia.nombre ? "success.main" : "background.paper",
                  color: selectedDay === dia.nombre ? "#fff" : "text.primary",
                  border: selectedDay === dia.nombre ? "none" : "1px solid",
                  borderColor: "success.main",
                  transition: "all 0.3s ease",
                  boxShadow: selectedDay === dia.nombre ? 3 : 0,
                  "&:hover": {
                    backgroundColor: selectedDay === dia.nombre ? "success.dark" : "success.light",
                    color: selectedDay === dia.nombre ? "#fff" : "success.dark",
                    transform: "translateY(-2px)",
                    boxShadow: 4,
                  },
                }}
              >
                <Box textAlign="center">
                  <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
                    {format(dia.fecha, "d")}
                  </Typography>
                  <Typography variant="body1" component="div" sx={{ fontWeight: "medium" }}>
                    {format(dia.fecha, "EEEE", { locale: es })}
                  </Typography>
                  <Typography variant="caption" component="div" sx={{ color: selectedDay === dia.nombre ? "#fff" : "text.secondary" }}>
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
        <Paper sx={{ padding: 3, marginBottom: 3 }}>
          <Typography variant="h6" gutterBottom>
            <AccessTime sx={{ verticalAlign: "middle", marginRight: 1 }} />
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
                  <Typography variant="subtitle1" gutterBottom>
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
        <Paper sx={{ padding: 3 }}>
          <Typography variant="h6" gutterBottom>
            <CalendarToday sx={{ verticalAlign: "middle", marginRight: 1 }} />
            Citas para {selectedDay}:
          </Typography>
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={citasDelDia}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
              loading={loading}
            />
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default HorariosDis;