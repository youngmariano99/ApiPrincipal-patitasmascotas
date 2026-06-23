import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AutenticacionStorageAdapter } from '../infrastructure/adapters/AutenticacionStorageAdapter';
import { LoggerEmpatico } from '../infrastructure/logging/LoggerEmpatico';
import { FetchApiClientAdapter } from '../infrastructure/adapters/FetchApiClientAdapter';

describe('AutenticacionStorageAdapter', () => {
  let adaptador: AutenticacionStorageAdapter;

  beforeEach(() => {
    adaptador = new AutenticacionStorageAdapter();
    localStorage.clear();
  });

  it('debe guardar y obtener el token de localStorage', () => {
    adaptador.guardarToken('mi-token-secreto');
    expect(adaptador.obtenerToken()).toBe('mi-token-secreto');
  });

  it('debe eliminar el token de localStorage', () => {
    adaptador.guardarToken('mi-token-secreto');
    adaptador.eliminarToken();
    expect(adaptador.obtenerToken()).toBeNull();
  });
});

describe('LoggerEmpatico', () => {
  let logger: LoggerEmpatico;

  beforeEach(() => {
    logger = LoggerEmpatico.obtenerInstancia();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('debe traducir un error de red a un mensaje empatico', () => {
    const errorRed = new Error('Failed to fetch');
    const mensaje = logger.loguearError(errorRed, 'Llamada fallida');
    expect(mensaje).toContain('problemas de conexión');
  });

  it('debe traducir credenciales invalidas a un mensaje empatico', () => {
    const errorCreds = new Error('Bad credentials');
    const mensaje = logger.loguearError(errorCreds, 'Login fallido');
    expect(mensaje).toContain('datos de acceso no coinciden');
  });
});

describe('FetchApiClientAdapter', () => {
  let cliente: FetchApiClientAdapter;
  let mockStorage: any;

  beforeEach(() => {
    mockStorage = {
      obtenerToken: vi.fn().mockReturnValue('mi-token-mock'),
      guardarToken: vi.fn(),
      eliminarToken: vi.fn(),
    };
    cliente = new FetchApiClientAdapter(mockStorage, 'http://api.mock.com');
    
    // Mock global fetch usando la API nativa de Vitest
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ resultado: 'exito' }),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('debe realizar peticiones GET inyectando el token JWT por defecto', async () => {
    const respuesta = await cliente.realizarPeticion<any>('/mascotas');
    
    expect(respuesta).toEqual({ resultado: 'exito' });
    expect(fetch).toHaveBeenCalledWith(
      'http://api.mock.com/mascotas',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Authorization': 'Bearer mi-token-mock',
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('debe permitir llamadas sin token si requiereToken es falso', async () => {
    await cliente.realizarPeticion<any>('/productos', { requiereToken: false });
    
    expect(fetch).toHaveBeenCalledWith(
      'http://api.mock.com/productos',
      expect.objectContaining({
        headers: expect.not.objectContaining({
          'Authorization': 'Bearer mi-token-mock',
        }),
      })
    );
  });

  it('debe formatear los query params correctamente', async () => {
    await cliente.realizarPeticion<any>('/mascotas', { filtros: { duenoId: 'abc' } });
    
    expect(fetch).toHaveBeenCalledWith(
      'http://api.mock.com/mascotas?duenoId=abc',
      expect.any(Object)
    );
  });
});
