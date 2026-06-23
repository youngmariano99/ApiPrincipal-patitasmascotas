import type { IClienteApi, OpcionesPeticion } from '../../domain/interfaces/IClienteApi';
import type { IStorageAutenticacion } from '../../domain/interfaces/IStorageAutenticacion';
import { CONFIGURACION_API } from '../config/configuracionApi';

/**
 * Adaptador del cliente HTTP que implementa la interfaz IClienteApi utilizando la API Fetch nativa.
 * Se encarga de formatear parámetros, procesar respuestas y adjuntar cabeceras JWT de forma segura.
 */
export class FetchApiClientAdapter implements IClienteApi {
  private readonly storageAutenticacion: IStorageAutenticacion;
  private readonly urlBase: string;

  /**
   * Instancia el adaptador inyectando el gestor de almacenamiento de tokens.
   * @param storageAutenticacion Gestor de tokens para adjuntar cabeceras de autorización.
   * @param urlBase Dirección URL del servidor de la API (opcional).
   */
  constructor(
    storageAutenticacion: IStorageAutenticacion,
    urlBase: string = CONFIGURACION_API.URL_BASE
  ) {
    this.storageAutenticacion = storageAutenticacion;
    this.urlBase = urlBase;
  }

  /**
   * Realiza una solicitud HTTP asíncrona hacia el backend de Spring Boot.
   * @template T Tipo del objeto de retorno esperado.
   * @param ruta Endpoint de destino (ej: /mascotas).
   * @param opciones Objeto opcional de configuración (método, datos de body, filtros y tokens).
   * @returns Promesa con los datos tipados de la respuesta.
   */
  async realizarPeticion<T>(ruta: string, opciones?: OpcionesPeticion): Promise<T> {
    const metodo = opciones?.metodo || 'GET';
    const requiereToken = opciones?.requiereToken ?? true;
    
    let url = `${this.urlBase}${ruta}`;
    
    if (opciones?.filtros) {
      const parametros = new URLSearchParams();
      Object.entries(opciones.filtros).forEach(([clave, valor]) => {
        if (valor !== undefined && valor !== null) {
          parametros.append(clave, String(valor));
        }
      });
      const queryStr = parametros.toString();
      if (queryStr) {
        url += `?${queryStr}`;
      }
    }

    const cabeceras: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (requiereToken) {
      const token = this.storageAutenticacion.obtenerToken();
      if (token) {
        cabeceras['Authorization'] = `Bearer ${token}`;
      }
    }

    const configuracion: RequestInit = {
      method: metodo,
      headers: cabeceras,
    };

    if (opciones?.datos) {
      configuracion.body = JSON.stringify(opciones.datos);
    }

    const respuesta = await fetch(url, configuracion);

    if (!respuesta.ok) {
      let mensajeError = 'Ha ocurrido un error al conectarse con el servidor.';
      try {
        const cuerpoError = await respuesta.json();
        mensajeError = cuerpoError.message || mensajeError;
      } catch {
        // En caso de que la respuesta no sea JSON
      }
      throw new Error(mensajeError);
    }

    if (respuesta.status === 204) {
      return {} as T;
    }

    return await respuesta.json() as T;
  }
}
