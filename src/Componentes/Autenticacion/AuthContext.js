import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Inicializar el estado del usuario desde localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Función para iniciar sesión
  const login = (userData) => {
    setUser(userData); // Actualizar el estado del usuario
    localStorage.setItem('user', JSON.stringify(userData)); // Guardar en localStorage
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null); // Limpiar el estado del usuario
    localStorage.removeItem('user'); // Eliminar de localStorage
  };

  // Sincronizar el estado de autenticación entre pestañas/ventanas
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'user') {
        const storedUser = localStorage.getItem('user');
        setUser(storedUser ? JSON.parse(storedUser) : null);
      }
    };

    // Escuchar cambios en localStorage
    window.addEventListener('storage', handleStorageChange);

    // Limpiar el listener al desmontar el componente
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);