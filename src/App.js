
import React from 'react';
import LayoutConEncabezado from './Componentes/Layouts/LayoutConEncabezado';
import { AuthProvider } from './Componentes/Autenticacion/AuthContext';
import ErrorBoundary from './Paginas/Error505Global';
import PaginaError500j from './Paginas/PaginaError500';
import AppRouter from './routes/AppRouter';
import ScrollToTop from './Componentes/ScrollToTop';


const App = () => {
  return (
    <AuthProvider>
      <LayoutConEncabezado>
        <ErrorBoundary fallback={<PaginaError500j />}>
          <ScrollToTop />
          <AppRouter />
        </ErrorBoundary>
      </LayoutConEncabezado>
    </AuthProvider>
  );
};

export default App;
