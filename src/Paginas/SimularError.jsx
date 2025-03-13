import React, { useEffect } from 'react';

const SimularError = () => {
  useEffect(() => {
    throw new Error('Este es un error simulado para probar la página de error 500');
  }, []);

  return <div>Este componente nunca se mostrará debido al error.</div>;
};

export default SimularError;
