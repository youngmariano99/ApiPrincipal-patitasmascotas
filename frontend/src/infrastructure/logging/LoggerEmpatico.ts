/**
 * Servicio centralizado de registro de eventos (Logger) que traduce errores técnicos
 * a descripciones amigables en idioma local (voseo argentino) para contención de usuarios.
 * Implementa el patrón de diseño Singleton.
 */
export class LoggerEmpatico {
  private static instancia: LoggerEmpatico;

  private constructor() {}

  /**
   * Obtiene la instancia única del LoggerEmpatico.
   * @returns Instancia única global.
   */
  public static obtenerInstancia(): LoggerEmpatico {
    if (!LoggerEmpatico.instancia) {
      LoggerEmpatico.instancia = new LoggerEmpatico();
    }
    return LoggerEmpatico.instancia;
  }

  /**
   * Registra información de desarrollo o eventos rutinarios en la consola.
   * @param mensaje Mensaje descriptivo de la acción.
   * @param contexto Datos opcionales adicionales (payloads, parámetros).
   */
  loguearInformacion(mensaje: string, contexto?: any): void {
    console.log(`%c[INFO] ℹ️ ${mensaje}`, 'color: #008080; font-weight: bold;', contexto || '');
  }

  /**
   * Registra una advertencia o fallo no-crítico.
   * @param mensaje Detalle de la advertencia.
   * @param contexto Datos opcionales adicionales.
   */
  loguearAdvertencia(mensaje: string, contexto?: any): void {
    console.warn(`%c[WARN] ⚠️ ${mensaje}`, 'color: #C44601; font-weight: bold;', contexto || '');
  }

  /**
   * Registra un error crítico y retorna un mensaje empático apto para mostrar en la interfaz de usuario.
   * @param errorOriginal Objeto o mensaje de error arrojado por la excepción.
   * @param mensajeContexto Mensaje que describe qué acción falló.
   * @returns String con el mensaje amigable y empático traducido.
   */
  loguearError(errorOriginal: any, mensajeContexto: string): string {
    const mensajeErrorRaw = errorOriginal instanceof Error ? errorOriginal.message : String(errorOriginal);
    
    // Traductor Empático de Errores para contener al usuario
    let mensajeEmpatico = 'Algo no salió como esperábamos, pero no te preocupes, ya estamos trabajando para solucionarlo.';

    if (mensajeErrorRaw.includes('Failed to fetch') || mensajeErrorRaw.includes('NetworkError') || mensajeErrorRaw.includes('fetch')) {
      mensajeEmpatico = 'Parece que tenés problemas de conexión a internet. Guardamos tus datos locales para intentar de nuevo cuando vuelvas a tener señal.';
    } else if (
      mensajeErrorRaw.includes('401') || 
      mensajeErrorRaw.includes('Unauthorized') || 
      mensajeErrorRaw.includes('forbidden') || 
      mensajeErrorRaw.includes('403') ||
      mensajeErrorRaw.includes('JWT')
    ) {
      mensajeEmpatico = 'Tu sesión expiró o necesitas iniciar sesión nuevamente para realizar esta acción.';
    } else if (mensajeErrorRaw.includes('404') || mensajeErrorRaw.includes('not found') || mensajeErrorRaw.includes('no encontrado')) {
      mensajeEmpatico = 'No pudimos encontrar el registro solicitado. Por favor, verificá e intentá nuevamente.';
    } else if (mensajeErrorRaw.includes('already exists') || mensajeErrorRaw.includes('duplicado') || mensajeErrorRaw.includes('409')) {
      mensajeEmpatico = 'Estos datos ya se encuentran cargados en el sistema.';
    } else if (
      mensajeErrorRaw.includes('contraseña') || 
      mensajeErrorRaw.includes('password') || 
      mensajeErrorRaw.includes('Bad credentials') || 
      mensajeErrorRaw.includes('400')
    ) {
      mensajeEmpatico = 'Los datos de acceso no coinciden con nuestros registros. Verificá tu correo y contraseña e intentá de nuevo.';
    }

    console.error(
      `%c[ERROR] 🛑 ${mensajeContexto}\n%cDetalle Técnico: ${mensajeErrorRaw}\n%cMensaje Empático: ${mensajeEmpatico}`,
      'color: #C44601; font-weight: bold;',
      'color: #888;',
      'color: #0073E6; font-style: italic; font-weight: bold;'
    );

    return mensajeEmpatico;
  }
}
export const logger = LoggerEmpatico.obtenerInstancia();
