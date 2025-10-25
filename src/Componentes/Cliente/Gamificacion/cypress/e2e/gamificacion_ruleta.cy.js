describe('GamificacioRoleta E2E', () => {
    beforeEach(() => {
      cy.intercept('GET', 'https://backendcentro.onrender.com/api/ruleta/elegibilidad/*', { body: { elegible: true } });
      cy.intercept('GET', 'https://backendcentro.onrender.com/api/ruleta/premios', {
        body: [
          { id: 1, porcentaje: 10 },
          { id: 2, porcentaje: 20 },
        ],
      });
      cy.intercept('POST', 'https://backendcentro.onrender.com/api/ruleta/girar/*', { body: { indicePremio: 0, porcentaje: 10 } });
    });
  
    it('gira ruleta y muestra premio', () => {
      cy.visit('http://localhost:3000/gamificacion'); // Ajusta la ruta
      cy.get('button').contains('Girar Ruleta').click();
      cy.get('h4').contains('Ganaste 10% de descuento').should('exist');
    });
  
    it('muestra error si no se puede girar', () => {
      cy.intercept('POST', 'https://backendcentro.onrender.com/api/ruleta/girar/*', {
        statusCode: 500,
        body: { error: 'No se pudo registrar el premio' },
      });
      cy.visit('http://localhost:3000/gamificacion');
      cy.get('button').contains('Girar Ruleta').click();
      cy.get('p').contains('No se pudo registrar el premio').should('exist');
    });
  });