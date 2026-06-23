import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDependencias } from '../../infrastructure/DependenciasContext';
import { CONFIGURACION_API } from '../../infrastructure/config/configuracionApi';
import { ShieldAlert } from 'lucide-react';

export const Login: React.FC = () => {
  const { clienteApi, storageAutenticacion, logger } = useDependencias();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [errorUsuario, setErrorUsuario] = useState<string | null>(null);

  const manejarEnvio = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setCargando(true);
    setErrorUsuario(null);

    try {
      logger.loguearInformacion('Intentando iniciar sesión', { email });
      
      const respuesta = await clienteApi.realizarPeticion<{ token: string }>(
        CONFIGURACION_API.ENDPOINTS.AUTENTICACION.LOGIN,
        {
          metodo: 'POST',
          datos: { email, password },
          requiereToken: false, // El login no requiere token
        }
      );

      if (respuesta.token) {
        storageAutenticacion.guardarToken(respuesta.token);
        logger.loguearInformacion('Inicio de sesión exitoso. Redirigiendo...');
        navigate('/');
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (error) {
      const mensaje = logger.loguearError(error, 'Fallo en la autenticación');
      setErrorUsuario(mensaje);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="contenedor" style={{ justifyContent: 'center', minHeight: 'calc(100vh - 72px)' }}>
      <div className="tarjeta" style={{ padding: '32px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img 
            src="/PatitasEnAlerta.png" 
            alt="Logo Patitas en Alerta" 
            style={{ width: '96px', height: '96px', objectFit: 'contain', marginBottom: '16px', borderRadius: '24px' }} 
          />
          <h1 style={{ fontSize: '28px', color: 'var(--color-primario)' }}>Patitas en Alerta</h1>
          <p style={{ color: 'var(--color-texto-secundario)', marginTop: '8px' }}>
            Inicia sesión para cuidar y reportar tus mascotas.
          </p>
        </div>

        {errorUsuario && (
          <div className="alerta-mensaje error">
            <ShieldAlert style={{ flexShrink: 0 }} />
            <span>{errorUsuario}</span>
          </div>
        )}

        <form onSubmit={manejarEnvio}>
          <div className="grupo-formulario">
            <label className="etiqueta-formulario" htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              className="campo-entrada"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grupo-formulario" style={{ marginBottom: '32px' }}>
            <label className="etiqueta-formulario" htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className="campo-entrada"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="boton-principal"
            disabled={cargando}
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
};
