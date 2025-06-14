import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItemButton, ListItemText, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HistorialClinico = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3302/api/historial-clinico/pacientes')
      .then(res => res.json())
      .then(data => {
        setPacientes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al obtener pacientes:', err);
        setLoading(false);
      });
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Pacientes</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {pacientes.map(p => (
            <ListItemButton key={p.id} onClick={() => navigate(`/admin/detallehistorial/${p.id}`)}>
              <ListItemText primary={`${p.nombre} ${p.apellidopa} ${p.apellidoma}`} />
            </ListItemButton>
          ))}
        </List>
      )}
    </Box>
  );
};

export default HistorialClinico;