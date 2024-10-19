import React, { useState, useEffect } from 'react';
import { Layout, Typography } from 'antd';
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Footer } = Layout;
const { Text } = Typography;

const PieDePagina = () => {
  const [datosEmpresa, setDatosEmpresa] = useState({
    redesSociales: {
      facebook: "",
      twitter: "",
      instagram: ""
    },
    telefonoContacto: "",
    emailContacto: "",
    direccion: ""
  });

  useEffect(() => {
    fetch('http://localhost:3001/api/datosEmpresa')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error fetching datosEmpresa: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Datos de datosEmpresa:', data);
        if (data.length > 0) {
          setDatosEmpresa(data[0]);
        }
      })
      .catch(error => {
        console.error('Error fetching datosEmpresa:', error);
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
            <a href={datosEmpresa.redesSociales.facebook} style={linkStyle} target="_blank" rel="noopener noreferrer">
              <FacebookOutlined style={{ ...iconStyle, color: '#2E8B57' }} /> Facebook
            </a>
            <a href={datosEmpresa.redesSociales.twitter} style={linkStyle} target="_blank" rel="noopener noreferrer">
              <TwitterOutlined style={{ ...iconStyle, color: '#2E8B57' }} /> Twitter
            </a>
            <a href={datosEmpresa.redesSociales.instagram} style={linkStyle} target="_blank" rel="noopener noreferrer">
              <InstagramOutlined style={{ ...iconStyle, color: '#2E8B57' }} /> Instagram
            </a>
          </div>
          <div>
            <h2 style={headerStyle}>Atención al cliente</h2>
            <p style={textStyle}><PhoneOutlined style={{ ...iconStyle, color: '#2E8B57' }} /> Teléfono: {datosEmpresa.telefonoContacto}</p>
            <p style={textStyle}><MailOutlined style={{ ...iconStyle, color: '#2E8B57' }} /> Correo electrónico: {datosEmpresa.emailContacto}</p>
            <p style={textStyle}><EnvironmentOutlined style={{ ...iconStyle, color: '#2E8B57' }} /> Ubicación: {datosEmpresa.direccion}</p>
          </div>
          <div>
            <h2 style={headerStyle}>Datos de la empresa</h2>
            <Link to="/empresa" style={linkStyle}>¿Quiénes Somos?</Link>
            <Link to="/privacidad" style={linkStyle}>Política de Privacidad</Link>
            <Link to="/preguntasFrecuentes" style={linkStyle}>Preguntas frecuentes</Link>
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
  marginRight: '5px'
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

export default PieDePagina;
