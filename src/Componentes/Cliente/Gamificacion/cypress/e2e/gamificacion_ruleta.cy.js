describe('GamificacioRoleta E2E', () => {
    beforeEach(() => {
      // Configurar localStorage
      cy.window().then((win) => {
        win.localStorage.clear();
        win.localStorage.setItem('usuario_id', '125');
        win.localStorage.setItem('id', '125');
      });
  
      // Interceptar peticiones HTTP
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
  
      // Visitar la página con más tiempo de espera
      cy.visit('/cliente/ruleta', { timeout: 60000 });
  
      // Esperar a que el componente se renderice
      cy.get('h1').contains('Ruleta de Premios', { timeout: 30000 }).should('be.visible');
    });
  
    it('gira ruleta y muestra premio', () => {
      // Esperar peticiones iniciales
      cy.wait(['@getElegibilidad', '@getPremios'], { timeout: 30000 }).then((interceptions) => {
        cy.log('Peticiones interceptadas:', interceptions);
      });
  
      // Hacer clic en el botón de girar
      cy.get('button').contains('Girar Ruleta', { timeout: 30000 }).click({ force: true });
  
      // Esperar la respuesta del giro
      cy.wait('@postGirar', { timeout: 30000 });
  
      // Verificar el mensaje de victoria (después de la animación)
      cy.get('h4').contains('Ganaste 10% de descuento', { timeout: 30000 }).should('be.visible');
    });
  
    it('muestra error si no se puede girar', () => {
      // Mockear error en el giro
      cy.intercept('POST', '**/api/ruleta/girar/**', {
        statusCode: 500,
        body: { error: 'No se pudo registrar el premio' },
      }).as('postGirarError');
  
      cy.wait(['@getElegibilidad', '@getPremios'], { timeout: 30000 }).then((interceptions) => {
        cy.log('Peticiones interceptadas:', interceptions);
      });
  
      cy.get('button').contains('Girar Ruleta', { timeout: 30000 }).click({ force: true });
      cy.wait('@postGirarError', { timeout: 30000 });
  
      cy.get('p').contains('No se pudo registrar el premio', { timeout: 30000 }).should('be.visible');
    });
  
    it('muestra mensaje de no elegible', () => {
      // Mockear no elegible
      cy.intercept('GET', '**/api/ruleta/elegibilidad/**', {
        body: { elegible: false },
      }).as('getNoElegible');
  
      // Recargar para aplicar el nuevo mock
      cy.visit('/cliente/ruleta', { timeout: 60000 });
      cy.get('h1').contains('Ruleta de Premios', { timeout: 30000 }).should('be.visible');
  
      cy.wait('@getNoElegible', { timeout: 30000 }).then((interception) => {
        cy.log('Petición de elegibilidad:', interception);
      });
  
      cy.get('p').contains('No tienes giros disponibles por ahora.', { timeout: 30000 }).should('be.visible');
    });
  });