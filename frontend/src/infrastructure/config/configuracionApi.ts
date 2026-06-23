// Configuración centralizada de las conexiones a la API
export const CONFIGURACION_API = {
  URL_BASE: 'http://localhost:8080/api/v1',
  ENDPOINTS: {
    AUTENTICACION: {
      LOGIN: '/auth/login',
    },
    MASCOTAS: '/mascotas',
    PRODUCTOS: '/productos',
  },
};
