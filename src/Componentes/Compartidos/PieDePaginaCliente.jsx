import React, { useState, useEffect } from 'react';
import { Layout, Typography } from 'antd';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  Gavel as GavelIcon,
  Lock as LockIcon,
  Description as DescriptionIcon,
  Lightbulb as LightbulbIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const { Footer } = Layout;
const { Text } = Typography;

const PieDePaginaAdmin = () => {
  const [datosEmpresa, setDatosEmpresa] = useState({
    redesSociales: {
      facebook: "",
      twitter: "",
      instagram: ""
    },
    telefono: "",
    correo: "",
    direccion: ""
  });

  useEffect(() => {
    fetch('https://backendcentro.onrender.com/api/perfilF')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error fetching perfil: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Datos del perfil:', data);
        setDatosEmpresa({
          redesSociales: data.redesSociales || {
            facebook: "",
            twitter: "",
            instagram: ""
          },
          telefono: data.telefono || "",
          correo: data.correo || "",
          direccion: data.direccion || ""
        });
      })
      .catch(error => {
        console.error('Error fetching perfil:', error);
      });
  }, []);

  return (
    <Layout>
      <Footer style={{
        backgroundColor: '#1A2526', // Mismo color que el encabezado
        textAlign: 'center',
        padding: '40px 20px',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          width: '100%',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div>
            <h2 style={headerStyle}>Síguenos en nuestras redes sociales</h2>
            <a href={datosEmpresa.redesSociales.facebook || '#'} style={linkStyle} target="_blank" rel="noopener noreferrer">
              <FacebookIcon style={{ ...iconStyle, color: '#3B5998' }} /> Facebook
            </a>
            <a href={datosEmpresa.redesSociales.twitter || '#'} style={linkStyle} target="_blank" rel="noopener noreferrer">
              <TwitterIcon style={{ ...iconStyle, color: '#1DA1F2' }} /> Twitter
            </a>
            <a href={datosEmpresa.redesSociales.instagram || '#'} style={linkStyle} target="_blank" rel="noopener noreferrer">
              <InstagramIcon style={{ ...iconStyle, color: '#E1306C' }} /> Instagram
            </a>
          </div>
          <div>
            <h2 style={headerStyle}>Atención al cliente</h2>
            <p style={textStyle}>
              <PhoneIcon style={{ ...iconStyle, color: '#FF6F61' }} /> Teléfono: {datosEmpresa.telefono || 'No disponible'}
            </p>
            <p style={textStyle}>
              <EmailIcon style={{ ...iconStyle, color: '#FFD700' }} /> Correo electrónico: {datosEmpresa.correo || 'No disponible'}
            </p>
            <p style={textStyle}>
              <LocationOnIcon style={{ ...iconStyle, color: '#00CED1' }} /> Ubicación: {datosEmpresa.direccion || 'No disponible'}
            </p>
            <Link to="/chats" style={linkStyle}>
              <VisibilityIcon style={{ ...iconStyle, color: '#00B300' }} /> Chat Box
            </Link>
          </div>
          
          <div>
            <h2 style={headerStyle}>Datos de la empresa</h2>
            <Link to="/cliente/deslindes" style={linkStyle}>
              <GavelIcon style={{ ...iconStyle, color: '#7B68EE' }} /> Deslinde legal
            </Link>
            <Link to="/cliente/politicass" style={linkStyle}>
              <LockIcon style={{ ...iconStyle, color: '#FF4500' }} /> Política de Privacidad
            </Link>
            <Link to="/cliente/terminos-condiciones" style={linkStyle}>
              <DescriptionIcon style={{ ...iconStyle, color: '#6B728E' }} /> Términos y condiciones
            </Link>
            <Link to="/cliente/misionview" style={linkStyle}>
              <LightbulbIcon style={{ ...iconStyle, color: '#FF69B4' }} /> Misión
            </Link>
            <Link to="/cliente/visionview" style={linkStyle}>
              <VisibilityIcon style={{ ...iconStyle, color: '#00B300' }} /> Visión
            </Link>
          </div>
        </div>
      </Footer>
      <div style={{
        backgroundColor: '#1A2526', // Mismo color que el encabezado
        textAlign: 'center',
        padding: '20px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <Text style={{ color: '#ffffff', fontSize: '16px' }}>
          © {new Date().getFullYear()} Centro de Rehabilitación Integral. Todos los derechos reservados.
        </Text>
      </div>
    </Layout>
  );
};

const linkStyle = {
  color: '#ffffff',
  fontSize: '16px',
  display: 'block',
  marginBottom: '10px',
  textDecoration: 'none'
};

const iconStyle = {
  fontSize: '18px',
  marginRight: '5px',
};

const textStyle = {
  color: '#ffffff',
  fontSize: '16px',
  marginBottom: '10px'
};

const headerStyle = {
  color: '#ffffff',
  fontSize: '18px',
  marginBottom: '10px',
};

export default PieDePaginaAdmin;