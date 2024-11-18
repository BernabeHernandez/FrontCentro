import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; 

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  console.log("Usuario actual:", user);
  console.log("Roles permitidos:", allowedRoles);

  if (!user || (allowedRoles && !allowedRoles.includes(user.tipo))) {
    console.warn("Acceso denegado: redirigiendo a /login");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
