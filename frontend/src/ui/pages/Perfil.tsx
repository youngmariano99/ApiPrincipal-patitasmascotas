import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDependencias } from '../../infrastructure/DependenciasContext';
import { User, LogOut, Info } from 'lucide-react';

import { parsearJwt } from '../../infrastructure/utils/parsearJwt';

export const Perfil: React.FC = () => {
  const { storageAutenticacion, logger } = useDependencias();
  const navigate = useNavigate();

  const manejarCierreSesion = () => {
    logger.loguearInformacion('Cerrando sesión de usuario');
    storageAutenticacion.eliminarToken();
    navigate('/login');
  };

  const tokenActivo = storageAutenticacion.obtenerToken();
  const usuario = tokenActivo ? parsearJwt(tokenActivo) : null;

  return (
    <div className="contenedor">
      <h1 style={{ marginBottom: '24px' }}>Mi Perfil</h1>

      <div className="tarjeta" style={{ textAlign: 'center', padding: '32px 16px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 128, 128, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          color: 'var(--color-primario)'
        }}>
          <User size={40} />
        </div>

        {usuario ? (
          <>
            <h2 style={{ fontSize: '22px' }}>{usuario.nombreCompleto} ({usuario.rol.replace('ROLE_', '').toLowerCase()})</h2>
            <p style={{ color: 'var(--color-texto-secundario)', fontSize: '16px', marginTop: '4px' }}>
              {usuario.sub}
            </p>
            <div style={{ 
              marginTop: '16px', 
              padding: '8px 12px', 
              backgroundColor: '#EDF7ED', 
              borderRadius: '8px', 
              color: '#1E4620',
              fontSize: '14px',
              display: 'inline-block',
              fontWeight: 600
            }}>
              Sesión Iniciada (Token Activo)
            </div>

            <button 
              onClick={manejarCierreSesion}
              className="boton-alerta"
              style={{ marginTop: '32px' }}
            >
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </button>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: '22px' }}>Invitado</h2>
            <p style={{ color: 'var(--color-texto-secundario)', fontSize: '16px', marginTop: '4px' }}>
              No has iniciado sesión en el portal de mascotas.
            </p>

            <button 
              onClick={() => navigate('/login')}
              className="boton-principal"
              style={{ marginTop: '32px' }}
            >
              <span>Iniciar Sesión</span>
            </button>
          </>
        )}
      </div>

      <div className="tarjeta" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <Info style={{ color: 'var(--color-secundario)', flexShrink: 0 }} />
        <div>
          <h4 style={{ fontSize: '16px' }}>Acerca de Patitas en Alerta</h4>
          <p style={{ fontSize: '14px', color: 'var(--color-texto-secundario)', marginTop: '4px' }}>
            Esta aplicación está diseñada para conectar vecinos y reportar mascotas extraviadas o heridas en tiempo real. 
            Todas las acciones críticas están optimizadas para su uso móvil con una sola mano.
          </p>
        </div>
      </div>
    </div>
  );
};
