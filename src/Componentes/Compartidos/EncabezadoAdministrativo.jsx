import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, IconButton, Typography, Collapse, Toolbar, AppBar
} from '@mui/material';
import {
  Home as HomeIcon, Logout as LogoutIcon, Description as FileTextIcon, AdminPanelSettings  as TeamIcon, Menu as MenuIcon, ExpandMore, ExpandLess,
  ManageAccounts as AppsIcon, LocalShipping as DeliveryIcon,   SupervisorAccount as PatientAssistIcon, Security as AuditIcon, BarChart    as SalesReportIcon
} from '@mui/icons-material';

const EncabezadoAdministrativo = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState([]);
  const [logoUrl, setLogoUrl] = useState('');
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [eslogan, setEslogan] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await axios.get('https://backendcentro.onrender.com/api/perfilF');
        const data = response.data;
        setLogoUrl(data.logo);
        setNombreEmpresa(data.nombreEmpresa);
        setEslogan(data.eslogan);
      } catch (error) {
        console.error('Error al obtener datos del perfil:', error);
      }
    };

    fetchPerfil();
    const intervalId = setInterval(fetchPerfil, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handleMenuClick = (key) => {
    setSelectedOption(key);

    switch (key) {
      case "home": navigate('/admin/'); break;
      case "politicas": navigate('/admin/politicas'); break;
      case "terminos": navigate('/admin/terminos'); break;
      case "mision": navigate('/admin/mision'); break;
      case "vision": navigate('/admin/vision'); break;
      case "perfil": navigate('/admin/perfil'); break;
      case "deslinde": navigate('/admin/deslinde'); break;
      case "activity-log": navigate('/admin/activity-log'); break;
      case "registro-password": navigate('/admin/registro-password'); break;
      case "roles": navigate('/admin/roles'); break;
      case "registro-sospechosos": navigate('/admin/registro-sospechosos'); break;
      case "productos": navigate('/admin/productos'); break;
      case "inventarioproductos": navigate('/admin/inventario'); break;
      case "servicios": navigate('/admin/servicios'); break;
      case "inventarioservicios": navigate('/admin/inventarioser'); break;
      case "categoria": navigate('/admin/categoria'); break;
      case "registroHo": navigate('/admin/registroH'); break;
      case "horariosDis": navigate('/admin/horariosD'); break;
      case "promociones": navigate('/admin/promociones'); break;
      case "historialclinico": navigate('/admin/historial'); break;
      case "ventas": navigate('/admin/ventas'); break;
      case "detalleventas": navigate('/admin/detalleventas'); break;
      case "detallecitas": navigate('/admin/detallecitas'); break;
      case "entregaproductos": navigate('/admin/entregaproductos'); break;
      case "asistenciapaciente": navigate('/admin/asistenciaPaciente'); break;
      case "cerrarSesion": handleLogout(); break;
      default: console.log("No se reconoce la acción del menú");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleDropdownClick = (menu) => {
    setOpenDropdowns((prev) =>
      prev.includes(menu)
        ? prev.filter((item) => item !== menu)
        : [...prev, menu]
    );
  };

  const menuItems = [
    { key: 'home', label: 'Home', icon: <HomeIcon sx={{ color: '#FF6F61', fontSize: 20 }} /> },
    {
      key: 'control',
      label: 'Control',
      icon: <AppsIcon sx={{ color: '#6B728E', fontSize: 20 }} />,
      subItems: [
        { key: 'productos', label: 'Productos' },
        { key: 'inventarioproductos', label: 'Inventario de Productos' },
        { key: 'servicios', label: 'Servicios' },
        { key: 'inventarioservicios', label: 'Inventario de Servicios' },
        { key: 'categoria', label: 'Categorías' },
        { key: 'registroHo', label: 'Registro Horario' },
        { key: 'horariosDis', label: 'Disponibilidad' },
        { key: 'promociones', label: 'Promociones' },
        { key: 'historialclinico', label: 'Historial Clinico' },
      ]
    },
    {
      key: 'empresa',
      label: 'Datos de la Empresa',
      icon: <FileTextIcon sx={{ color: '#FFD700', fontSize: 20 }} />,
      subItems: [
        { key: 'perfil', label: 'Perfil' },
        { key: 'terminos', label: 'Términos' },
        { key: 'politicas', label: 'Políticas' },
        { key: 'deslinde', label: 'Deslinde' },
        { key: 'mision', label: 'Misión' },
        { key: 'vision', label: 'Visión' },
      ]
    },
    {
      key: 'actividades',
      label: 'Registro de Actividades',
      icon: <AuditIcon sx={{ color: '#00CED1', fontSize: 20 }} />,
      subItems: [
        { key: 'activity-log', label: 'Registro de Logeos' },
        { key: 'registro-password', label: 'Registro de Contraseña' },
        { key: 'registro-sospechosos', label: 'Lista Negra' },
      ]
    },
    {
      key: 'ventasa',
      label: 'Reporte de Ventas',
      icon: <SalesReportIcon sx={{ color: '#FF69B4', fontSize: 20 }} />,
      subItems: [
        { key: 'ventas', label: 'Ventas' },
        { key: 'detalleventas', label: 'Detalle de las Ventas' },
        { key: 'detallecitas', label: 'Detalle Citas' },
      ]
    },
    { key: 'roles', label: 'Roles', icon: <TeamIcon sx={{ color: '#7B68EE', fontSize: 20 }} /> },
    { key: 'entregaproductos', label: 'Entrega de Productos', icon: <DeliveryIcon sx={{ color: '#3CB371', fontSize: 20 }} /> },
    { key: 'asistenciapaciente', label: 'Asistencia de Pacientes', icon: <PatientAssistIcon sx={{ color: '#DC143C', fontSize: 20 }} /> },
    { key: 'cerrarSesion', label: 'Cerrar Sesión', icon: <LogoutIcon sx={{ color: '#FF4500', fontSize: 20 }} /> },
  
  ];

  const drawerContent = (
    <Box
      sx={{
        width: 250,
        backgroundColor: '#1A2526',
        color: '#FFFFFF',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        '-ms-overflow-style': 'none',
        'scrollbar-width': 'none',
      }}
    >
      {/* Logo y Nombre */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          pt: { xs: 8, md: 2 },
          overflow: 'hidden',
        }}
      >
        {logoUrl && (
          <img src={logoUrl} alt="Logo" style={{ height: 70, width: 70, borderRadius: '50%', marginBottom: 10 }} />
        )}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            fontFamily: "'Poppins', sans-serif",
            fontSize: { xs: '1.1rem', md: '1.25rem' },
          }}
        >
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: '#A9DFBF',
            fontFamily: "'Roboto', sans-serif",
            fontStyle: 'italic',
          }}
        >
          {eslogan || 'Eslogan aquí'}
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: '#A9DFBF' }} />

      {/* Menú */}
      <List sx={{ overflow: 'hidden' }}>
        {menuItems.map((item) => (
          <React.Fragment key={item.key}>
            <ListItem
              button
              onClick={() => item.subItems ? handleDropdownClick(item.key) : handleMenuClick(item.key)}
              sx={{
                '&:hover': { backgroundColor: '#B0BEC5', color: '#000000' },
                py: 0.5,
                pl: 2, // Alineación uniforme para las opciones principales
                backgroundColor: selectedOption === item.key ? '#B0BEC5' : 'transparent',
                color: selectedOption === item.key ? '#000000' : '#FFFFFF',
              }}
            >
              <ListItemIcon sx={{ color: selectedOption === item.key ? '#000000' : 'inherit', minWidth: 36 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  fontSize: '0.9rem',
                }}
              />
              {item.subItems && (openDropdowns.includes(item.key) ? <ExpandLess /> : <ExpandMore />)}
            </ListItem>
            {item.subItems && (
              <Collapse in={openDropdowns.includes(item.key)} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ overflow: 'hidden' }}>
                  {item.subItems.map((subItem) => (
                    <ListItem
                      button
                      key={subItem.key}
                      sx={{
                        pl: 4, // Reducimos la indentación para mejor alineación
                        '&:hover': { backgroundColor: '#B0BEC5', color: '#000000' },
                        py: 0.5,
                        backgroundColor: selectedOption === subItem.key ? '#B0BEC5' : 'transparent',
                        color: selectedOption === subItem.key ? '#000000' : '#FFFFFF',
                      }}
                      onClick={() => handleMenuClick(subItem.key)}
                    >
                      <ListItemText
                        primary={subItem.label}
                        primaryTypographyProps={{
                          fontFamily: "'Roboto', sans-serif",
                          fontWeight: 400,
                          fontSize: '0.85rem',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* AppBar para el botón hamburguesa en móvil */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#1A2526',
          display: { xs: 'block', md: 'none' },
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleMobileMenu}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 'bold',
              fontSize: { xs: '1.1rem', md: '1.25rem' },
            }}
          >
            {nombreEmpresa || 'Empresa'}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer para Desktop (permanente) */}
      <Drawer
        variant="permanent"
        sx={{
          width: 250,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 250, boxSizing: 'border-box', backgroundColor: '#1A2526' },
          display: { xs: 'none', md: 'block' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Drawer para Móvil (temporal) */}
      <Drawer
        variant="temporary"
        open={isMobileMenuOpen}
        onClose={toggleMobileMenu}
        sx={{
          display: { xs: 'block', md: 'none' },
          [`& .MuiDrawer-paper`]: { width: 250, boxSizing: 'border-box', backgroundColor: '#1A2526' },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default EncabezadoAdministrativo;