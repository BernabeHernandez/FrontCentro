import React, { useState, useEffect } from 'react';
import { Layout, Typography } from 'antd';
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  FileProtectOutlined,
  LockOutlined,
  FileDoneOutlined,
} from '@ant-design/icons';
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
        backgroundColor: '#000000',
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
              <FacebookOutlined style={iconStyle} /> Facebook
            </a>
            <a href={datosEmpresa.redesSociales.twitter || '#'} style={linkStyle} target="_blank" rel="noopener noreferrer">
              <TwitterOutlined style={iconStyle} /> Twitter
            </a>
            <a href={datosEmpresa.redesSociales.instagram || '#'} style={linkStyle} target="_blank" rel="noopener noreferrer">
              <InstagramOutlined style={iconStyle} /> Instagram
            </a>
          </div>
          <div>
            <h2 style={headerStyle}>Atención al cliente</h2>
            <p style={textStyle}><PhoneOutlined style={iconStyle} /> Teléfono: {datosEmpresa.telefono || 'No disponible'}</p>
            <p style={textStyle}><MailOutlined style={iconStyle} /> Correo electrónico: {datosEmpresa.correo || 'No disponible'}</p>
            <p style={textStyle}><EnvironmentOutlined style={iconStyle} /> Ubicación: {datosEmpresa.direccion || 'No disponible'}</p>
          </div>
          <div>
            <h2 style={headerStyle}>Datos de la empresa</h2>
            <Link to="/admin/deslindes" style={linkStyle}><FileProtectOutlined style={iconStyle} /> Deslinde legal</Link>
            <Link to="/admin/politicass" style={linkStyle}><LockOutlined style={iconStyle} /> Política de Privacidad</Link>
            <Link to="/admin/terminos-condiciones" style={linkStyle}><FileDoneOutlined style={iconStyle} /> Términos y condiciones</Link>
          </div>
        </div>
      </Footer>
      <div style={{
        backgroundColor: '#333333',
        textAlign: 'center',
        padding: '20px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <Text style={{ color: '#ffffff', fontSize: '16px' }}>
          &copy; {new Date().getFullYear()} Centro de Rehabilitación Integral. Todos los derechos reservados.
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
  color: '#2E8B57',  
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
