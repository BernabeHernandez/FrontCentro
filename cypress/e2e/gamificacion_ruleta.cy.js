describe('GamificacioRoleta E2E', () => {
    beforeEach(() => {
      // Configurar localStorage con un usuario autenticado
      cy.window().then((win) => {
        win.localStorage.clear();
        const user = {
          id: '125',
          tipo: 'Cliente',
        };
        win.localStorage.setItem('user', JSON.stringify(user));
        win.localStorage.setItem('usuario_id', '125');
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
      cy.wait(['@getElegibilidad', '@getPremios'], { timeout: 30000 }).then((interceptions) => {
        cy.log('Peticiones iniciales interceptadas:', interceptions);
      });
  
      // Hacer clic en el botón de girar
      cy.get('button').contains('Girar Ruleta', { timeout: 30000 }).click({ force: true });
  
      // Esperar la respuesta del giro con más tiempo
      cy.wait('@postGirar', { timeout: 15000 }).then((interception) => {
        cy.log('Petición de giro interceptada:', interception);
      });
  
      // Verificar el mensaje de victoria con más tiempo y depuración
      cy.get('h4', { timeout: 20000 })
        .contains('Ganaste 10% de descuento')
        .should('be.visible')
        .then(($el) => {
          cy.log('Elemento h4 encontrado:', $el.text());
        });
    });
  
    it('muestra error si no se puede girar', () => {
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
      cy.intercept('GET', '**/api/ruleta/elegibilidad/**', {
        body: { elegible: false },
      }).as('getNoElegible');
  
      cy.visit('/cliente/ruleta', { timeout: 60000 });
      cy.get('h1').contains('Ruleta de Premios', { timeout: 30000 }).should('be.visible');
  
      cy.wait('@getNoElegible', { timeout: 30000 }).then((interception) => {
        cy.log('Petición de elegibilidad:', interception);
      });
  
      cy.get('p').contains('No tienes giros disponibles por ahora.', { timeout: 30000 }).should('be.visible');
    });
  });