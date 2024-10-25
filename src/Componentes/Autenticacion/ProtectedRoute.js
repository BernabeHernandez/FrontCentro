// Componentes/Autenticacion/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Asegúrate de que la ruta sea correcta

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth(); // Obtén el usuario del contexto de autenticación

  // Verifica si el usuario está autenticado y tiene el rol adecuado
  if (!user || (allowedRoles && !allowedRoles.includes(user.tipo))) {
    return <Navigate to="/login" replace />; // Redirige si no está autenticado o no tiene el rol adecuado
  }

  return children; // Renderiza el contenido si está autorizado
};

export default ProtectedRoute;
