import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Accordion, AccordionSummary, AccordionDetails,
  Typography, CircularProgress, Box, Link, Paper, Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const DetalleHistorial = () => {
  const { id } = useParams();
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:3302/api/historial-clinico/${id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setHistorial(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Box p={3}><CircularProgress /></Box>;
  if (!historial.length) return <Box p={3}><Typography>No hay historial para este paciente.</Typography></Box>;

  const citasAgrupadas = historial.reduce((acc, item) => {
    const citaId = item.cita_id;
    if (!acc[citaId]) {
      acc[citaId] = {
        fecha_cita: item.fecha_cita,
        hora_inicio: item.hora_inicio,
        hora_fin: item.hora_fin,
        estado: item.estado,
        archivos: []
      };
    }
    if (item.nombre_archivo) acc[citaId].archivos.push(item);
    return acc;
  }, {});

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Historial Clínico del Paciente</Typography>
      {Object.entries(citasAgrupadas).map(([citaId, cita]) => (
        <Accordion key={citaId} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box>
              <Typography variant="subtitle1">
                📅 {cita.fecha_cita} | 🕒 {cita.hora_inicio} - {cita.hora_fin}
              </Typography>
              <Chip label={cita.estado} color={cita.estado === 'confirmada' ? 'success' : 'warning'} size="small" sx={{ mt: 1 }} />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {cita.archivos.length > 0 ? (
              cita.archivos.map((archivo, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center' }} elevation={2}>
                  <Box mr={2}>
                    {archivo.tipo_archivo === 'pdf'
                      ? <PictureAsPdfIcon color="error" fontSize="large" />
                      : <InsertDriveFileIcon color="action" fontSize="large" />}
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">{archivo.nombre_archivo}</Typography>
                    <Typography variant="body2" color="textSecondary">{archivo.descripcion || 'Sin descripción'}</Typography>
                    <Typography variant="caption" display="block">Fecha subida: {new Date(archivo.fecha_subida).toLocaleDateString()}</Typography>
                    <Link href={archivo.ruta_archivo} target="_blank" underline="hover">Ver archivo</Link>
                  </Box>
                </Paper>
              ))
            ) : (
              <Typography variant="body2">No hay archivos para esta cita.</Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default DetalleHistorial;
