import type { IStorageAutenticacion } from '../../domain/interfaces/IStorageAutenticacion';

/**
 * Adaptador que gestiona el almacenamiento persistente del token de sesión
 * utilizando la API de localStorage del navegador.
 */
export class AutenticacionStorageAdapter implements IStorageAutenticacion {
  private readonly CLAVE_TOKEN = 'patitas_token_autenticacion';

  /**
   * Recupera el token JWT almacenado en el navegador.
   * @returns El token como string, o null si no se encuentra.
   */
  obtenerToken(): string | null {
    return localStorage.getItem(this.CLAVE_TOKEN);
  }

  /**
   * Guarda el token JWT en el almacenamiento persistente.
   * @param token Token de acceso a registrar.
   */
  guardarToken(token: string): void {
    localStorage.setItem(this.CLAVE_TOKEN, token);
  }

  /**
   * Remueve el token de sesión registrado en el navegador.
   */
  eliminarToken(): void {
    localStorage.removeItem(this.CLAVE_TOKEN);
  }
}
