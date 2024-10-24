// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Asegúrate de que esto sea correcto

const PrivateRoute = ({ children }) => {
  const { user } = useAuth(); // Suponiendo que tienes un contexto de autenticación

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
