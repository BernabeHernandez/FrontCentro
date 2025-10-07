import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, IconButton, Typography, Collapse, Toolbar, AppBar
} from '@mui/material';
import {
  Home as HomeIcon, Logout as LogoutIcon, Description as FileTextIcon, AdminPanelSettings as TeamIcon, Menu as MenuIcon, ExpandMore, ExpandLess,
  ManageAccounts as AppsIcon, LocalShipping as DeliveryIcon, SupervisorAccount as PatientAssistIcon, Security as AuditIcon, BarChart as SalesReportIcon,
  Inventory as InventoryIcon, Category as CategoryIcon, LocalOffer as OfferIcon, History as HistoryIcon, Assignment as AssignmentIcon,
  ListAlt as ListAltIcon, Lock as LockIcon, Block as BlockIcon, Store as StoreIcon, MiscellaneousServices as MiscServicesIcon,
  Schedule as ScheduleIcon, EventAvailable as EventIcon, Description as DescriptionIcon, Visibility as VisibilityIcon, Info as InfoIcon,
  Receipt as ReceiptIcon, ShoppingCart as ShoppingCartIcon, People as PeopleIcon
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
      case "rutinas": navigate('/admin/rutinas'); break;
      case "historialclinico": navigate('/admin/historial'); break;
      case "ventas": navigate('/admin/ventas'); break;
      case "detalleventas": navigate('/admin/detalleventas'); break;
      case "detallecitas": navigate('/admin/detallecitas'); break;
      case "entregaproductos": navigate('/admin/entregaproductos'); break;
      case "asistenciapaciente": navigate('/admin/asistenciaPaciente'); break;
      case "prediccion-clasificacion": navigate('/admin/prediccion-clasificacion'); break;
      case "ruleta-premios": navigate('/admin/ruleta-premios'); break;
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
    { key: 'home', label: 'Inicio', icon: <HomeIcon sx={{ color: '#FF6F61', fontSize: 20 }} /> },
   
    {
      key: 'control',
      label: 'Productos y Servicios',
      icon: <AppsIcon sx={{ color: '#6B728E', fontSize: 20 }} />,
      subItems: [
        { key: 'productos', label: 'Productos', icon: <StoreIcon sx={{ color: '#4CAF50', fontSize: 18 }} /> },
        { key: 'inventarioproductos', label: 'Inventario de Productos', icon: <InventoryIcon sx={{ color: '#388E3C', fontSize: 18 }} /> },
        { key: 'servicios', label: 'Servicios', icon: <MiscServicesIcon sx={{ color: '#2196F3', fontSize: 18 }} /> },
        { key: 'inventarioservicios', label: 'Inventario de Servicios', icon: <InventoryIcon sx={{ color: '#1976D2', fontSize: 18 }} /> },
        { key: 'categoria', label: 'Categorías', icon: <CategoryIcon sx={{ color: '#FF9800', fontSize: 18 }} /> },
        { key: 'promociones', label: 'Promociones', icon: <OfferIcon sx={{ color: '#E91E63', fontSize: 18 }} /> },
        { key: 'rutinas', label: 'Rutinas', icon: <AssignmentIcon sx={{ color: '#00BCD4', fontSize: 18 }} /> },
        { key: 'ruleta-premios', label: 'Ruleta de Premios', icon: <AssignmentIcon sx={{ color: '#00BCD4', fontSize: 18 }} /> },
      ]
    },
    {
      key: 'horariosycitas',
      label: 'Horarios y Citas',
      icon: <ScheduleIcon sx={{ color: '#32cb8eff', fontSize: 20 }} />,
      subItems: [
        { key: 'registroHo', label: 'Registro Horario', icon: <ScheduleIcon sx={{ color: '#9C27B0', fontSize: 18 }} /> },
        { key: 'horariosDis', label: 'Citas del Día', icon: <EventIcon sx={{ color: '#00BCD4', fontSize: 18 }} /> },
        { key: 'detallecitas', label: 'Detalle Citas', icon: <EventIcon sx={{ color: '#FF9800', fontSize: 18 }} /> },
      ]
    },
    {
      key: 'pacientes',
      label: 'Pacientes',
      icon: <PatientAssistIcon sx={{ color: '#DC143C', fontSize: 20 }} />,
      subItems: [
        { key: 'asistenciapaciente', label: 'Asistencia de Pacientes', icon: <PatientAssistIcon sx={{ color: '#DC143C', fontSize: 18 }} /> },
        { key: 'historialclinico', label: 'Historial Clínico', icon: <HistoryIcon sx={{ color: '#795548', fontSize: 18 }} /> },
      ]
    },
    {
      key: 'ventas',
      label: 'Ventas',
      icon: <SalesReportIcon sx={{ color: '#FF69B4', fontSize: 20 }} />,
      subItems: [
        { key: 'ventas', label: 'Ventas', icon: <ShoppingCartIcon sx={{ color: '#4CAF50', fontSize: 18 }} /> },
        { key: 'detalleventas', label: 'Detalle de las Ventas', icon: <ReceiptIcon sx={{ color: '#607D8B', fontSize: 18 }} /> },
        { key: 'entregaproductos', label: 'Entrega de Productos', icon: <DeliveryIcon sx={{ color: '#3CB371', fontSize: 18 }} /> },
      ]
    },
     {
      key: 'empresa',
      label: 'Empresa',
      icon: <FileTextIcon sx={{ color: '#FFD700', fontSize: 20 }} />,
      subItems: [
        { key: 'perfil', label: 'Perfil', icon: <PeopleIcon sx={{ color: '#607D8B', fontSize: 18 }} /> },
        { key: 'terminos', label: 'Términos', icon: <DescriptionIcon sx={{ color: '#009688', fontSize: 18 }} /> },
        { key: 'politicas', label: 'Políticas', icon: <AssignmentIcon sx={{ color: '#FFC107', fontSize: 18 }} /> },
        { key: 'deslinde', label: 'Deslinde', icon: <InfoIcon sx={{ color: '#F44336', fontSize: 18 }} /> },
        { key: 'mision', label: 'Misión', icon: <VisibilityIcon sx={{ color: '#3F51B5', fontSize: 18 }} /> },
        { key: 'vision', label: 'Visión', icon: <VisibilityIcon sx={{ color: '#8BC34A', fontSize: 18 }} /> },
      ]
    },
    {
      key: 'actividades',
      label: 'Actividades y Seguridad',
      icon: <AuditIcon sx={{ color: '#00CED1', fontSize: 20 }} />,
      subItems: [
        { key: 'activity-log', label: 'Registro de Logeos', icon: <ListAltIcon sx={{ color: '#3F51B5', fontSize: 18 }} /> },
        { key: 'registro-password', label: 'Registro de Contraseña', icon: <LockIcon sx={{ color: '#FF5722', fontSize: 18 }} /> },
        { key: 'registro-sospechosos', label: 'Lista Negra', icon: <BlockIcon sx={{ color: '#9E9E9E', fontSize: 18 }} /> },
      ]
    },
    {
      key: 'administracion',
      label: 'Administración',
      icon: <TeamIcon sx={{ color: '#7B68EE', fontSize: 20 }} />,
      subItems: [
        { key: 'roles', label: 'Roles', icon: <TeamIcon sx={{ color: '#7B68EE', fontSize: 18 }} /> },
      ]
    },
    {
      key: 'otras',
      label: 'Otras opciones',
  icon: <SalesReportIcon sx={{ color: '#607D8B', fontSize: 20 }} />,
      subItems: [
  { key: 'prediccion-clasificacion', label: 'Predicción/Clasificación (si aplica)', icon: <SalesReportIcon sx={{ color: '#607D8B', fontSize: 18 }} /> },
      ]
    },
    { key: 'cerrarSesion', label: 'Cerrar Sesión', icon: <LogoutIcon sx={{ color: '#FF4500', fontSize: 20 }} /> },
  ];

  const drawerContent = (
    <Box
      sx={{
        width: 250,
        minWidth: 250,
        maxWidth: 250,
        backgroundColor: '#1A2526',
        color: '#FFFFFF',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden', // Oculta el scroll horizontal
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
                        pl: 4,
                        '&:hover': { backgroundColor: '#B0BEC5', color: '#000000' },
                        py: 0.5,
                        backgroundColor: selectedOption === subItem.key ? '#B0BEC5' : 'transparent',
                        color: selectedOption === subItem.key ? '#000000' : '#FFFFFF',
                      }}
                      onClick={() => handleMenuClick(subItem.key)}
                    >
                      <ListItemIcon sx={{ color: 'gray', minWidth: 32 }}>
                        {subItem.icon}
                      </ListItemIcon>
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
          minWidth: 250,
          maxWidth: 250,
          flexShrink: 0,
          overflowX: 'hidden',
          [`& .MuiDrawer-paper`]: { width: 250, minWidth: 250, maxWidth: 250, boxSizing: 'border-box', backgroundColor: '#1A2526', overflowX: 'hidden' },
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