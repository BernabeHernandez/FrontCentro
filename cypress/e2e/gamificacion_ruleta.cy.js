describe('GamificacioRoleta E2E', () => {
    beforeEach(() => {
      // Mock localStorage
      cy.window().then((win) => {
        win.localStorage.setItem('usuario_id', '123');
      });
  
      // Interceptar TODAS las peticiones al backend (con ** para cualquier origen)
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
  
      // Visitar la ruta correcta
      cy.visit('/cliente/ruleta', { timeout: 15000 });
    });
  
    it('gira ruleta y muestra premio', () => {
      // Esperar a que carguen elegibilidad y premios
      cy.wait('@getElegibilidad', { timeout: 10000 });
      cy.wait('@getPremios', { timeout: 10000 });
  
      // Hacer clic en el botón "Girar Ruleta"
      cy.contains('button', 'Girar Ruleta', { timeout: 10000 })
        .should('be.visible')
        .click({ force: true });
  
      // Esperar la respuesta del giro
      cy.wait('@postGirar', { timeout: 10000 });
  
      // Verificar el mensaje de victoria
      cy.contains('Ganaste 10% de descuento', { timeout: 15000 })
        .should('be.visible');
    });
  
    it('muestra error si no se puede girar', () => {
      cy.intercept('POST', '**/api/ruleta/girar/**', {
        statusCode: 500,
        body: { error: 'No se pudo registrar el premio' },
      }).as('postGirarError');
  
      cy.wait('@getElegibilidad');
      cy.wait('@getPremios');
  
      cy.contains('button', 'Girar Ruleta').click({ force: true });
      cy.wait('@postGirarError');
  
      cy.contains('No se pudo registrar el premio').should('be.visible');
    });
  
    it('muestra mensaje de no elegible', () => {
      cy.intercept('GET', '**/api/ruleta/elegibilidad/**', {
        body: { elegible: false },
      }).as('getNoElegible');
  
      // Recargar para aplicar el nuevo mock
      cy.reload();
      cy.wait('@getNoElegible');
  
      cy.contains('No tienes giros disponibles por ahora.').should('be.visible');
    });
  });