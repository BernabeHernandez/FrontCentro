import { verificarElegibilidad, calcularPremio } from './GamificacioRoleta'; 

describe('GamificacioRoleta - Unit Tests', () => {
  test('Unit - Positiva: calcular correctamente premio para usuario elegible', () => {
    const usuarioId = '125';
    const elegible = true;
    const premios = [{ id: 1, porcentaje: 10 }, { id: 2, porcentaje: 20 }];
    const resultado = calcularPremio(usuarioId, elegible, premios);
    expect(resultado).toEqual({ indicePremio: 0, porcentaje: 10 });
  });

  test('Unit - Negativa: enviar usuario no elegible y verificar manejo de error', () => {
    const usuarioId = '125';
    const elegible = false;
    const premios = [{ id: 1, porcentaje: 10 }];
    expect(() => calcularPremio(usuarioId, elegible, premios)).toThrow('Usuario no elegible');
  });
});