// Interfaz para el almacenamiento del token de autenticación
export interface IStorageAutenticacion {
  obtenerToken(): string | null;
  guardarToken(token: string): void;
  eliminarToken(): void;
}
