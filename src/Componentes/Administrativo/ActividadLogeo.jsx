import React, { useEffect, useState } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { message } from 'antd';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  Container,
  Grid,
  Pagination,
  Box,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const ActividadLogeo = () => {
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);

        const response = await fetch(`https://backendcentro.onrender.com/api/activity-log?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error('Error al cargar los registros');
        }
        const data = await response.json();
        setActivityLogs(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityLogs();
  }, [startDate, endDate]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleDateChange = (setter, value, validationMessage) => {
    if (validationMessage) {
      message.warning(validationMessage);
    } else {
      setter(value);
    }
  };

  const paginatedLogs = activityLogs.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Registro de Actividad de Logeos
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fecha de Inicio"
              type="date"
              value={startDate}
              onChange={(e) =>
                handleDateChange(
                  setStartDate,
                  e.target.value,
                  endDate && new Date(e.target.value) > new Date(endDate)
                    ? 'La fecha de inicio debe ser anterior a la fecha de fin.'
                    : null
                )
              }
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fecha de Fin"
              type="date"
              value={endDate}
              onChange={(e) =>
                handleDateChange(
                  setEndDate,
                  e.target.value,
                  startDate && new Date(e.target.value) < new Date(startDate)
                    ? 'La fecha de fin debe ser posterior a la fecha de inicio.'
                    : null
                )
              }
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acción</TableCell>
                  <TableCell>Fecha y Hora</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <InfoCircleOutlined style={{ fontSize: '50px', color: '#007bff' }} />
                      <Typography variant="body1">No hay datos disponibles.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLogs.map((log) => (
                    <StyledTableRow key={log._id}>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>
                        {log.status === 'success' ? (
                          <Box display="flex" alignItems="center">
                            <CheckCircleOutlined style={{ color: '#28a745', marginRight: '8px' }} />
                            {log.status}
                          </Box>
                        ) : (
                          <Box display="flex" alignItems="center">
                            <CloseCircleOutlined style={{ color: '#dc3545', marginRight: '8px' }} />
                            {log.status}
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>{log.reason}</TableCell>
                      <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                    </StyledTableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={Math.ceil(activityLogs.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="primary"
          />
        </Box>
      </Box>
    </Container>
  );
};

export default ActividadLogeo;