import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Grid,
  List,
  ListItem,
  ListItemText,
  Link,
  Divider,
  TextField,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { styled } from '@mui/material/styles';

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 'bold',
  color: theme.palette.primary.main,
}));

const ClinicalHistory = () => {
  const { id } = useParams();
  const [historial, setHistorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState({}); // Estado booleano para modo edición por cita_id
  const [tempObservaciones, setTempObservaciones] = useState({}); // Estado para texto temporal

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://backendcentro.onrender.com/api/historial-clinico/${id}`);
        if (!response.ok) throw new Error('Error al obtener el historial');
        const data = await response.json();
        console.log('Datos crudos del backend:', data); // Depuración
        setHistorial(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setError('Error al cargar el historial clínico');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchHistory();
  }, [id]);

  // Función para manejar la descarga usando fetch
  const handleDownload = async (url, fileName) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al obtener el archivo');
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName || 'archivo_descargado';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Error al descargar el archivo:', err);
    }
  };

  // Guardar observaciones
  const handleSaveObservaciones = async (citaId) => {
    const observaciones = tempObservaciones[citaId] || null; // Usar null si el texto está vacío
    try {
      const response = await fetch(`https://backendcentro.onrender.com/api/historial-clinico/cita/${citaId}/observaciones`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ observaciones }),
      });
      if (!response.ok) throw new Error('Error al guardar observaciones');
      const updatedHistorial = historial.map(item =>
        item.cita_id === citaId ? { ...item, observaciones } : item
      );
      setHistorial(updatedHistorial);
      setEditMode({ ...editMode, [citaId]: false });
      setTempObservaciones({ ...tempObservaciones, [citaId]: undefined });
    } catch (err) {
      console.error('Error al guardar observaciones:', err);
      setError('Error al guardar observaciones');
    }
  };

  // Eliminar observaciones
  const handleDeleteObservaciones = async (citaId) => {
    try {
      const response = await fetch(`https://backendcentro.onrender.com/api/historial-clinico/cita/${citaId}/observaciones`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar observaciones');
      const updatedHistorial = historial.map(item =>
        item.cita_id === citaId ? { ...item, observaciones: null } : item
      );
      setHistorial(updatedHistorial);
      setEditMode({ ...editMode, [citaId]: false });
      setTempObservaciones({ ...tempObservaciones, [citaId]: undefined });
    } catch (err) {
      console.error('Error al eliminar observaciones:', err);
      setError('Error al eliminar observaciones');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!historial || historial.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No hay historial clínico para este paciente.
        </Typography>
      </Container>
    );
  }

  // Procesar datos para evitar duplicados
  const personalInfo = historial[0] || {};
  const citas = [...new Map(
    historial.filter(d => d.cita_id).map(item => [item.cita_id, item])
  ).values()];
  const archivos = [...new Map(
    historial
      .filter(d => d.nombre_archivo && d.fecha_subida)
      .map(item => [`${item.nombre_archivo}-${item.fecha_subida}`, item])
  ).values()];
  console.log('Archivos procesados:', archivos); // Depuración

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Historial Clínico
      </Typography>

      {/* Sección de Información Personal */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <SectionTitle variant="h6">Información Personal</SectionTitle>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Nombre:</strong> {personalInfo.paciente || 'No disponible'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Teléfono:</strong> {personalInfo.telefono || 'No disponible'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Correo:</strong> {personalInfo.gmail || 'No disponible'}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Sección de Citas */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <SectionTitle variant="h6">Citas completadas</SectionTitle>
        {citas.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Hora</TableCell>
                  <TableCell>Servicio</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Observaciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {citas.map(cita => (
                  <TableRow key={cita.cita_id}>
                    <TableCell>
                      {cita.fecha_cita
                        ? new Date(cita.fecha_cita).toLocaleDateString('es-ES')
                        : 'No disponible'}
                    </TableCell>
                    <TableCell>
                      {cita.hora_inicio && cita.hora_fin
                        ? `${cita.hora_inicio.slice(0, 5)} - ${cita.hora_fin.slice(0, 5)}`
                        : 'No disponible'}
                    </TableCell>
                    <TableCell>
                      {cita.servicio || 'No disponible'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={cita.estado || 'Desconocido'}
                        color="success"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {editMode[cita.cita_id] ? (
                        <>
                          <TextField
                            value={tempObservaciones[cita.cita_id] || cita.observaciones || ''}
                            onChange={(e) => setTempObservaciones({
                              ...tempObservaciones,
                              [cita.cita_id]: e.target.value,
                            })}
                            fullWidth
                            size="small"
                            multiline
                            rows={2}
                            sx={{ mb: 1 }}
                          />
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleSaveObservaciones(cita.cita_id)}
                            sx={{ mr: 1 }}
                          >
                            Guardar
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              setEditMode({ ...editMode, [cita.cita_id]: false });
                              setTempObservaciones({ ...tempObservaciones, [cita.cita_id]: undefined });
                            }}
                          >
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <>
                          <Typography>{cita.observaciones || 'Sin observaciones'}</Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setEditMode({
                              ...editMode,
                              [cita.cita_id]: true
                            })}
                            sx={{ mt: 1 }}
                          >
                            Editar
                          </Button>
                          {cita.observaciones && (
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleDeleteObservaciones(cita.cita_id)}
                              sx={{ mt: 1, ml: 1 }}
                            >
                              Eliminar
                            </Button>
                          )}
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography color="text.secondary">No hay citas completadas registradas</Typography>
        )}
      </Paper>

      {/* Sección de Archivos */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <SectionTitle variant="h6">Archivos</SectionTitle>
        {archivos.length > 0 ? (
          <List>
            {archivos.map((archivo, index) => (
              <React.Fragment key={`${archivo.nombre_archivo}-${archivo.fecha_subida}`}>
                <ListItem sx={{ alignItems: 'flex-start' }}>
                  {archivo.tipo_archivo?.toLowerCase() === 'pdf' ? (
                    <PictureAsPdfIcon color="error" sx={{ mr: 2, mt: 1 }} />
                  ) : (
                    <InsertDriveFileIcon color="action" sx={{ mr: 2, mt: 1 }} />
                  )}
                  <ListItemText
                    primary={
                      <Link href={archivo.ruta_archivo} target="_blank" rel="noopener" underline="hover">
                        {archivo.nombre_archivo || 'Archivo sin nombre'}
                      </Link>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {archivo.descripcion || 'Sin descripción'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Subido el{' '}
                          {archivo.fecha_subida
                            ? new Date(archivo.fecha_subida).toLocaleDateString('es-ES')
                            : 'No disponible'} | Tipo: {archivo.tipo_archivo || 'IMG'}
                        </Typography>
                      </>
                    }
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleDownload(archivo.ruta_archivo, archivo.nombre_archivo)}
                    sx={{ mt: 0.5 }}
                  >
                    Descargar
                  </Button>
                </ListItem>
                {index < archivos.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography color="text.secondary">No hay archivos registrados</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default ClinicalHistory;