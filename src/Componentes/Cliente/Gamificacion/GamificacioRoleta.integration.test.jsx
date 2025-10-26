import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { server } from '../../setupTests';
import { rest } from 'msw';
import GamificacioRoleta from './GamificacioRoleta';

describe('GamificacioRoleta - Integration Tests', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: { getItem: jest.fn(() => JSON.stringify({ id: '125', tipo: 'Cliente' })) },
      writable: true,
    });
    jest.useFakeTimers();
    server.listen(); 
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    server.resetHandlers();
    server.close(); 
  });

  test('Integration - Positiva: registrar premio correctamente en backend', async () => {
    server.use(
      rest.post('https://backendcentro.onrender.com/api/ruleta/girar/:id', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ indicePremio: 0, porcentaje: 10 }));
      })
    );

    render(
      <MemoryRouter>
        <GamificacioRoleta />
      </MemoryRouter>
    );

    const button = await screen.findByText('Girar Ruleta');
    fireEvent.click(button);
    jest.advanceTimersByTime(5500); 
    expect(await screen.findByText('Ganaste 10% de descuento')).toBeInTheDocument();
  });

  test('Integration - Negativa: simular fallo del servidor y verificar mensaje de error', async () => {
    server.use(
      rest.post('https://backendcentro.onrender.com/api/ruleta/girar/:id', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'No se pudo registrar el premio' }));
      })
    );

    render(
      <MemoryRouter>
        <GamificacioRoleta />
      </MemoryRouter>
    );

    const button = await screen.findByText('Girar Ruleta');
    fireEvent.click(button);
    jest.advanceTimersByTime(5500); 
    expect(await screen.findByText('No se pudo registrar el premio')).toBeInTheDocument();
  });
});