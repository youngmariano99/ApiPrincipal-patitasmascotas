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
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [esRegistro, setEsRegistro] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errorUsuario, setErrorUsuario] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const manejarEnvio = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setCargando(true);
    setErrorUsuario(null);
    setMensajeExito(null);

    try {
      if (esRegistro) {
        logger.loguearInformacion('Intentando registrar nuevo usuario', { email });
        await clienteApi.realizarPeticion<{ mensaje: string }>(
          '/auth/registro',
          {
            metodo: 'POST',
            datos: { email, password, nombreCompleto, telefono },
            requiereToken: false,
          }
        );
        setMensajeExito('¡Cuenta creada con éxito! Ya podés iniciar sesión.');
        setEsRegistro(false);
        setPassword('');
      } else {
        logger.loguearInformacion('Intentando iniciar sesión', { email });
        
        const respuesta = await clienteApi.realizarPeticion<{ token: string }>(
          CONFIGURACION_API.ENDPOINTS.AUTENTICACION.LOGIN,
          {
            metodo: 'POST',
            datos: { email, password },
            requiereToken: false,
          }
        );

        if (respuesta.token) {
          storageAutenticacion.guardarToken(respuesta.token);
          logger.loguearInformacion('Inicio de sesión exitoso. Redirigiendo...');
          navigate('/');
        } else {
          throw new Error('Respuesta inválida del servidor');
        }
      }
    } catch (error) {
      const operacion = esRegistro ? 'Fallo en el registro' : 'Fallo en la autenticación';
      const mensaje = logger.loguearError(error, operacion);
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
            {esRegistro ? 'Registrá tu cuenta para empezar.' : 'Inicia sesión para cuidar y reportar tus mascotas.'}
          </p>
        </div>

        {errorUsuario && (
          <div className="alerta-mensaje error">
            <ShieldAlert style={{ flexShrink: 0 }} />
            <span>{errorUsuario}</span>
          </div>
        )}

        {mensajeExito && (
          <div className="alerta-mensaje exito">
            <span>{mensajeExito}</span>
          </div>
        )}

        <form onSubmit={manejarEnvio}>
          {esRegistro && (
            <>
              <div className="grupo-formulario">
                <label className="etiqueta-formulario" htmlFor="nombreCompleto">Nombre Completo</label>
                <input
                  id="nombreCompleto"
                  type="text"
                  className="campo-entrada"
                  placeholder="Ej: Juan Pérez"
                  value={nombreCompleto}
                  onChange={(e) => setNombreCompleto(e.target.value)}
                  required
                />
              </div>

              <div className="grupo-formulario">
                <label className="etiqueta-formulario" htmlFor="telefono">Teléfono</label>
                <input
                  id="telefono"
                  type="tel"
                  className="campo-entrada"
                  placeholder="Ej: 1122334455"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                />
              </div>
            </>
          )}

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
            {cargando ? (esRegistro ? 'Registrando...' : 'Ingresando...') : (esRegistro ? 'Registrarse' : 'Ingresar')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            onClick={() => {
              setEsRegistro(!esRegistro);
              setErrorUsuario(null);
              setMensajeExito(null);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-primario)',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: 600
            }}
          >
            {esRegistro ? '¿Ya tenés cuenta? Iniciá Sesión' : '¿No tenés cuenta? Registrate acá'}
          </button>
        </div>
      </div>
    </div>
  );
};
