describe('GamificacioRoleta E2E', () => {
    beforeEach(() => {
      // Mock localStorage
      cy.window().then((win) => {
        win.localStorage.setItem('usuario_id', '125');
      });
  
      // Mock peticiones HTTP
      cy.intercept('GET', 'https://backendcentro.onrender.com/api/ruleta/elegibilidad/*', {
        body: { elegible: true },
      }).as('getElegibilidad');
      cy.intercept('GET', 'https://backendcentro.onrender.com/api/ruleta/premios', {
        body: [
          { id: 1, porcentaje: 10 },
          { id: 2, porcentaje: 20 },
        ],
      }).as('getPremios');
      cy.intercept('POST', 'https://backendcentro.onrender.com/api/ruleta/girar/*', {
        body: { indicePremio: 0, porcentaje: 10 },
      }).as('postGirar');
    });
  
    it('gira ruleta y muestra premio', () => {
      cy.visit('/gamificacion'); // Usa la ruta relativa con baseUrl
      cy.wait(['@getElegibilidad', '@getPremios']);
      cy.get('button').contains('Girar Ruleta').click();
      cy.wait('@postGirar');
      cy.get('h4').contains('Ganaste 10% de descuento').should('be.visible');
    });
  
    it('muestra error si no se puede girar', () => {
      cy.intercept('POST', 'https://backendcentro.onrender.com/api/ruleta/girar/*', {
        statusCode: 500,
        body: { error: 'No se pudo registrar el premio' },
      }).as('postGirarError');
      cy.visit('/gamificacion');
      cy.wait(['@getElegibilidad', '@getPremios']);
      cy.get('button').contains('Girar Ruleta').click();
      cy.wait('@postGirarError');
      cy.get('p').contains('No se pudo registrar el premio').should('be.visible');
    });
  
    it('muestra mensaje de no elegible', () => {
      cy.intercept('GET', 'https://backendcentro.onrender.com/api/ruleta/elegibilidad/*', {
        body: { elegible: false },
      }).as('getNoElegible');
      cy.visit('/gamificacion');
      cy.wait('@getNoElegible');
      cy.get('p').contains('No tienes giros disponibles por ahora.').should('be.visible');
    });
  });