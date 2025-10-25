describe('GamificacioRoleta E2E', () => {
    beforeEach(() => {
      // Mock localStorage
      cy.window().then((win) => {
        win.localStorage.setItem('usuario_id', '123');
      });
  
      // Mock peticiones HTTP
      cy.intercept('GET', '**/api/ruleta/elegibilidad/**', {
        body: { elegible: true },
      }).as('getElegibilidad');
      cy.intercept('GET', '**/api/ruleta/premios', {
        body: [
          { id: 1, porcentaje: 10 },
          { id: 2, porcentaje: 20 },
        ],
      }).as('getPremios');
      cy.intercept('POST', '**/api/ruleta/girar/**', {
        body: { indicePremio: 0, porcentaje: 10 },
      }).as('postGirar');
  
      // Visita la página
      cy.visit('/cliente/ruleta', { timeout: 10000 });
    });
  
    it('gira ruleta y muestra premio', () => {
      cy.wait(['@getElegibilidad', '@getPremios'], { timeout: 10000 }).then((interceptions) => {
        // Depuración: Mostrar las peticiones interceptadas
        cy.log('Peticiones interceptadas:', interceptions);
      });
      cy.get('button').contains('Girar Ruleta', { timeout: 10000 }).click();
      cy.wait('@postGirar', { timeout: 10000 });
      cy.get('h4').contains('Ganaste 10% de descuento', { timeout: 10000 }).should('be.visible');
    });
  
    it('muestra error si no se puede girar', () => {
      cy.intercept('POST', '**/api/ruleta/girar/**', {
        statusCode: 500,
        body: { error: 'No se pudo registrar el premio' },
      }).as('postGirarError');
      cy.wait(['@getElegibilidad', '@getPremios'], { timeout: 10000 }).then((interceptions) => {
        cy.log('Peticiones interceptadas:', interceptions);
      });
      cy.get('button').contains('Girar Ruleta', { timeout: 10000 }).click();
      cy.wait('@postGirarError', { timeout: 10000 });
      cy.get('p').contains('No se pudo registrar el premio', { timeout: 10000 }).should('be.visible');
    });
  
    it('muestra mensaje de no elegible', () => {
      cy.intercept('GET', '**/api/ruleta/elegibilidad/**', {
        body: { elegible: false },
      }).as('getNoElegible');
      cy.wait('@getNoElegible', { timeout: 10000 }).then((interception) => {
        cy.log('Petición de elegibilidad:', interception);
      });
      cy.get('p').contains('No tienes giros disponibles por ahora.', { timeout: 10000 }).should('be.visible');
    });
  });