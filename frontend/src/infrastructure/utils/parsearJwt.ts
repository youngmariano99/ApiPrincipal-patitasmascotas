export interface ClaimsUsuario {
  id: string;
  nombreCompleto: string;
  rol: string;
  sub: string; // El subject del JWT es el email
  exp: number;
}

/**
 * Decodifica de forma segura la carga útil (payload) de un token JWT.
 */
export const parsearJwt = (token: string): ClaimsUsuario | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};
