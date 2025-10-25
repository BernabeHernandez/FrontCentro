import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { server } from '../../setupTests';
import { rest } from 'msw';
import GamificacioRoleta from './GamificacioRoleta';

describe('GamificacioRoleta Integración', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: { getItem: jest.fn(() => '125') },
      writable: true,
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('gira ruleta y muestra premio', async () => {
    render(
      <MemoryRouter>
        <GamificacioRoleta />
      </MemoryRouter>
    );
    const button = await screen.findByText('Girar Ruleta');
    fireEvent.click(button);
    jest.advanceTimersByTime(5500); // Avanza 5.5s para la animación y el mensaje
    expect(await screen.findByText('Ganaste 10% de descuento')).toBeInTheDocument();
  });

  test('maneja error al girar ruleta', async () => {
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
    expect(await screen.findByText('No se pudo registrar el premio')).toBeInTheDocument();
  });
});