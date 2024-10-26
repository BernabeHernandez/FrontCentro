import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faChartBar, faCog, faChartPie, faLifeRing, faBell } from '@fortawesome/free-solid-svg-icons';

const PaginaPrincipalAdministrativa = () => {
  const [visibleWidgets, setVisibleWidgets] = useState([]);
  const widgetsData = [
    { 
      title: 'Gestión de Usuarios', 
      description: 'Administra los usuarios registrados en el sistema.', 
      icon: faUsers, 
      color: '#2196F3' 
    },
    { 
      title: 'Informes', 
      description: 'Accede a los informes de actividad y desempeño.', 
      icon: faChartBar, 
      color: '#FFC107' 
    },
    { 
      title: 'Configuraciones', 
      description: 'Ajusta las configuraciones del sistema.', 
      icon: faCog, 
      color: '#4CAF50' 
    },
    { 
      title: 'Estadísticas', 
      description: 'Revisa las estadísticas de uso y rendimiento.', 
      icon: faChartPie, 
      color: '#FF5722' 
    },
    { 
      title: 'Soporte', 
      description: 'Accede a recursos y asistencia técnica.', 
      icon: faLifeRing, 
      color: '#9C27B0' 
    },
    { 
      title: 'Notificaciones', 
      description: 'Mantente al tanto de las actualizaciones del sistema.', 
      icon: faBell, 
      color: '#F44336' 
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleWidgets((prev) => {
        if (prev.length < widgetsData.length && prev.length < 12) { 
          return [...prev, widgetsData[prev.length]];
        }
        return [];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
   
        <h1>Panel Administrativo</h1>
  
      <Widgets>
        {visibleWidgets.map((widget, index) => (
          <Widget key={index}>
            <Icon color={widget.color}>
              <FontAwesomeIcon icon={widget.icon} size="2x" />
            </Icon>
            <h2 style={{ color: widget.color }}>{widget.title}</h2>
            <p>{widget.description}</p>
            <AnimatedButton>{`Ver ${widget.title}`}</AnimatedButton>
          </Widget>
        ))}
      </Widgets>
    </Container>
  );
};


const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5; 
  padding: 20px;
  min-height: 100vh; 
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 20px;

  h1 {
    font-size: 2.5rem;
    color: #00796b; 
    margin: 0; 
  }
`;

const Widgets = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap; 
  width: 100%;
  max-width: 1000px;
  margin-top: 20px;
`;

const Widget = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  flex: 1 1 250px; 
  min-height: 250px; 
  margin: 10px;
  animation: ${fadeIn} 0.5s ease-in-out; 
  transition: transform 0.3s;

  &:hover {
    animation: ${pulse} 1.5s infinite; 
  }

  h2 {
    margin: 10px 0; 
  }
`;

const Icon = styled.div`
  margin-bottom: 15px;
  color: ${(props) => props.color || '#000'}; 
`;

const AnimatedButton = styled.button`
  background-color: #00796b;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #005b52;
  }
`;

export default PaginaPrincipalAdministrativa;