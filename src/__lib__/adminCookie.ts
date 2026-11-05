/** Nombre de la cookie que guarda el token de sesión del panel admin. */
export const ADMIN_COOKIE_NAME = 'mascaritas_admin';

/** Ocho horas: la misma caducidad por defecto que el token del backend. */
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 8;

/** Ruta (sin prefijo de idioma) donde se inicia sesión. */
export const ADMIN_LOGIN_SEGMENT = '/admin/login';
