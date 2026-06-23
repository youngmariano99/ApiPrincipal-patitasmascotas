// Interfaz para el cliente de API que realizará las peticiones HTTP
export interface OpcionesPeticion {
  metodo?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  datos?: any;
  requiereToken?: boolean;
  filtros?: Record<string, string | number | boolean | undefined>;
}

export interface IClienteApi {
  realizarPeticion<T>(ruta: string, opciones?: OpcionesPeticion): Promise<T>;
}
