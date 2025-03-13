import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  // Obtener el usuario desde localStorage como respaldo
  const storedUser = localStorage.getItem('user');
  const usuario = storedUser ? JSON.parse(storedUser) : null;

  console.log("Usuario actual (contexto):", user);
  console.log("Usuario actual (localStorage):", usuario);
  console.log("Roles permitidos:", allowedRoles);

  // Verificar si el usuario está autenticado
  if (!user && !usuario) {
    console.warn("Acceso denegado: redirigiendo a /login (usuario no autenticado)");
    return <Navigate to="/login" replace />;
  }

  // Verificar si el rol del usuario está permitido
  const rol = user ? user.tipo : usuario.tipo;
  if (allowedRoles && !allowedRoles.includes(rol)) {
    console.warn("Acceso denegado: redirigiendo a /login (rol no permitido)");
    return <Navigate to="/login" replace />;
  }

  // Si el usuario está autenticado y tiene el rol permitido, renderizar los hijos
  return children;
};

export default ProtectedRoute;