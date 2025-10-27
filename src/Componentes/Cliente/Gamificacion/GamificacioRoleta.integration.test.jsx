import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GamificacioRoleta from './GamificacioRoleta';


jest.mock('axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  }
}));

import axios from 'axios';

describe('GamificacioRoleta - Integration Tests', () => {
  
  beforeEach(() => {
   
    jest.useFakeTimers();
    
    const mockLocalStorage = {
      getItem: jest.fn((key) => {
        if (key === 'usuario_id' || key === 'id') {
          return '125';
        }
        return null;
      }),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
      configurable: true,
    });

    // Reset de mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });


  describe('Pruebas Esenciales', () => {
    
    test('Integration - Positiva: registrar premio correctamente en backend', async () => {
      axios.get
        .mockResolvedValueOnce({ data: { elegible: true } })
        .mockResolvedValueOnce({ data: [{ id: 1, porcentaje: 10 }] });

      axios.post.mockResolvedValueOnce({
        data: { indicePremio: 0, porcentaje: 10 }
      });

      render(
        <MemoryRouter>
          <GamificacioRoleta />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Girar Ruleta/i)).toBeInTheDocument();
      });

      const button = screen.getByText(/Girar Ruleta/i);
      
      await act(async () => {
        fireEvent.click(button);
      });

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'https://backendcentro.onrender.com/api/ruleta/girar/125'
        );
      });
    });

    test('Integration - Negativa: usuario no elegible no puede girar', async () => {
      axios.get
        .mockResolvedValueOnce({ data: { elegible: false } })
        .mockResolvedValueOnce({ data: [{ id: 1, porcentaje: 10 }] });

      render(
        <MemoryRouter>
          <GamificacioRoleta />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/No tienes giros disponibles/i)).toBeInTheDocument();
      });

      const button = screen.getByText(/Sin giros/i);
      expect(button).toBeDisabled();
    });

    test('Integration - Flujo completo: verificar elegibilidad -> girar -> registrar', async () => {
      axios.get
        .mockResolvedValueOnce({ data: { elegible: true } })
        .mockResolvedValueOnce({ data: [{ id: 1, porcentaje: 25 }] });

      axios.post.mockResolvedValueOnce({
        data: { indicePremio: 0, porcentaje: 25 }
      });

      render(
        <MemoryRouter>
          <GamificacioRoleta />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledTimes(2);
      });

      await waitFor(() => {
        expect(screen.getByText(/Girar Ruleta/i)).toBeInTheDocument();
      });

      const button = screen.getByText(/Girar Ruleta/i);
      
      await act(async () => {
        fireEvent.click(button);
      });

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });
    });
  });


  describe('Pruebas Adicionales', () => {
    
    test('Integration - Negativa: simular fallo del servidor', async () => {
      axios.get
        .mockResolvedValueOnce({ data: { elegible: true } })
        .mockResolvedValueOnce({ data: [{ id: 1, porcentaje: 10 }] });

      axios.post.mockRejectedValueOnce({
        response: {
          status: 500,
          data: { error: 'No se pudo registrar el premio' }
        }
      });

      render(
        <MemoryRouter>
          <GamificacioRoleta />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Girar Ruleta/i)).toBeInTheDocument();
      });

      const button = screen.getByText(/Girar Ruleta/i);
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/No se pudo registrar el premio/i)).toBeInTheDocument();
      });
    });

    test('Integration - Negativa: error al cargar premios', async () => {
      axios.get
        .mockResolvedValueOnce({ data: { elegible: true } })
        .mockRejectedValueOnce(new Error('Network error'));

      render(
        <MemoryRouter>
          <GamificacioRoleta />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/No se pudieron cargar los premios/i)).toBeInTheDocument();
      });
    });

    test('Integration - Negativa: usuario sin autenticar', async () => {
      window.localStorage.getItem = jest.fn(() => null);

      axios.get.mockResolvedValueOnce({ data: [{ id: 1, porcentaje: 10 }] });

      render(
        <MemoryRouter>
          <GamificacioRoleta />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Sin giros/i)).toBeInTheDocument();
      });

      const button = screen.getByText(/Sin giros/i);
      expect(button).toBeDisabled();
    });
  });
});