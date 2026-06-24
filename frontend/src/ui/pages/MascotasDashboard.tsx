import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDependencias } from '../../infrastructure/DependenciasContext';
import { CONFIGURACION_API } from '../../infrastructure/config/configuracionApi';
import type { Mascota, MascotaRequest } from '../../domain/interfaces/Modelos';
import { ShieldAlert, Trash2, Edit, Plus, Info, RefreshCw, X } from 'lucide-react';
import { parsearJwt } from '../../infrastructure/utils/parsearJwt';

export const MascotasDashboard: React.FC = () => {
  const { clienteApi, storageAutenticacion, logger } = useDependencias();
  const navigate = useNavigate();

  // Estados
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [cargando, setCargando] = useState(false);
  const [errorUsuario, setErrorUsuario] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [mostrarSoloMisMascotas, setMostrarSoloMisMascotas] = useState(false);

  // Estados para formulario
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('CANINO');
  const [estadoAdopcion, setEstadoAdopcion] = useState('CON_DUENO');
  const [nivelEnergia, setNivelEnergia] = useState('MEDIO');
  const [tamano, setTamano] = useState('MEDIANO');
  const [color, setColor] = useState('');
  const [raza, setRaza] = useState('');

  // ID del Usuario actual cargado dinámicamente del token
  const token = storageAutenticacion.obtenerToken();
  const usuarioLogueado = token ? parsearJwt(token) : null;
  const usuarioIdActual = usuarioLogueado?.id || '11111111-2222-3333-4444-555555555555';

  const cargarMascotas = useCallback(async () => {
    setCargando(true);
    setErrorUsuario(null);
    try {
      const token = storageAutenticacion.obtenerToken();
      if (!token) {
        navigate('/login');
        return;
      }

      logger.loguearInformacion('Cargando mascotas desde el servidor', { mostrarSoloMisMascotas });
      
      const filtros = mostrarSoloMisMascotas ? { duenoId: usuarioIdActual } : undefined;
      const datos = await clienteApi.realizarPeticion<Mascota[]>(
        CONFIGURACION_API.ENDPOINTS.MASCOTAS,
        {
          metodo: 'GET',
          requiereToken: true,
          filtros,
        }
      );
      setMascotas(datos);
    } catch (error) {
      const mensaje = logger.loguearError(error, 'Error al cargar mascotas');
      setErrorUsuario(mensaje);
    } finally {
      setCargando(false);
    }
  }, [clienteApi, storageAutenticacion, navigate, logger, mostrarSoloMisMascotas]);

  useEffect(() => {
    cargarMascotas();
  }, [cargarMascotas]);

  const limpiarFormulario = () => {
    setNombre('');
    setEspecie('CANINO');
    setEstadoAdopcion('CON_DUENO');
    setNivelEnergia('MEDIO');
    setTamano('MEDIANO');
    setColor('');
    setRaza('');
    setEditandoId(null);
  };

  const abrirModalCrear = () => {
    limpiarFormulario();
    setMostrarModal(true);
  };

  const abrirModalEditar = (mascota: Mascota) => {
    setEditandoId(mascota.id);
    setNombre(mascota.nombre);
    setEspecie(mascota.especie);
    setEstadoAdopcion(mascota.estadoAdopcion);
    setNivelEnergia(mascota.nivelEnergia);
    setTamano(mascota.tamano);

    try {
      const caracteristicasObj = JSON.parse(mascota.caracteristicas);
      setColor(caracteristicasObj.color || '');
      setRaza(caracteristicasObj.raza || '');
    } catch {
      setColor('');
      setRaza('');
    }

    setMostrarModal(true);
  };

  const guardarMascota = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorUsuario(null);
    setMensajeExito(null);

    const caracteristicasJson = JSON.stringify({ color, raza });
    const payload: MascotaRequest = {
      usuarioId: usuarioIdActual,
      nombre,
      especie,
      estadoAdopcion,
      nivelEnergia,
      tamano,
      caracteristicas: caracteristicasJson,
    };

    try {
      if (editandoId) {
        logger.loguearInformacion('Modificando mascota', { editandoId, payload });
        await clienteApi.realizarPeticion<Mascota>(
          `${CONFIGURACION_API.ENDPOINTS.MASCOTAS}/${editandoId}`,
          {
            metodo: 'PUT',
            datos: payload,
            requiereToken: true,
          }
        );
        setMensajeExito(`¡Los datos de ${nombre} fueron actualizados correctamente!`);
      } else {
        logger.loguearInformacion('Registrando nueva mascota', payload);
        await clienteApi.realizarPeticion<Mascota>(
          CONFIGURACION_API.ENDPOINTS.MASCOTAS,
          {
            metodo: 'POST',
            datos: payload,
            requiereToken: true,
          }
        );
        setMensajeExito(`¡Registramos a ${nombre} con éxito en el sistema!`);
      }
      setMostrarModal(false);
      limpiarFormulario();
      cargarMascotas();
    } catch (error) {
      const mensaje = logger.loguearError(error, 'Error al guardar mascota');
      setErrorUsuario(mensaje);
    }
  };

  const eliminarMascota = async (id: string, nombreMascota: string) => {
    if (!window.confirm(`¿Estás seguro de que querés eliminar a ${nombreMascota}?`)) {
      return;
    }

    setErrorUsuario(null);
    setMensajeExito(null);

    try {
      logger.loguearInformacion('Eliminando mascota (Soft Delete)', { id });
      await clienteApi.realizarPeticion<void>(
        `${CONFIGURACION_API.ENDPOINTS.MASCOTAS}/${id}`,
        {
          metodo: 'DELETE',
          requiereToken: true,
        }
      );
      setMensajeExito(`Se eliminó a ${nombreMascota} del listado.`);
      cargarMascotas();
    } catch (error) {
      const mensaje = logger.loguearError(error, 'Error al eliminar mascota');
      setErrorUsuario(mensaje);
    }
  };

  return (
    <div className="contenedor">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px' }}>Mis Mascotas</h1>
        <button className="boton-principal" onClick={abrirModalCrear} style={{ width: 'auto', height: '48px', padding: '0 16px' }}>
          <Plus size={20} />
          <span>Agregar</span>
        </button>
      </div>

      {errorUsuario && (
        <div className="alerta-mensaje error">
          <ShieldAlert />
          <span>{errorUsuario}</span>
        </div>
      )}

      {mensajeExito && (
        <div className="alerta-mensaje exito">
          <span>{mensajeExito}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <button
          className={`boton-secundario ${mostrarSoloMisMascotas ? 'activo' : ''}`}
          onClick={() => setMostrarSoloMisMascotas(!mostrarSoloMisMascotas)}
          style={{ 
            height: '44px', 
            fontSize: '15px', 
            backgroundColor: mostrarSoloMisMascotas ? 'rgba(0, 128, 128, 0.1)' : 'transparent',
            borderColor: mostrarSoloMisMascotas ? 'var(--color-primario)' : 'var(--color-borde)',
            color: mostrarSoloMisMascotas ? 'var(--color-primario)' : 'var(--color-texto-secundario)'
          }}
        >
          {mostrarSoloMisMascotas ? 'Mostrar Todas' : 'Ver solo mis mascotas'}
        </button>
        <button 
          onClick={cargarMascotas} 
          className="boton-secundario" 
          style={{ width: '44px', height: '44px', padding: 0 }}
          title="Recargar lista"
        >
          <RefreshCw size={18} className={cargando ? 'anim-spin' : ''} />
        </button>
      </div>

      {cargando && mascotas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-texto-secundario)' }}>
          Cargando listado...
        </div>
      ) : mascotas.length === 0 ? (
        <div className="tarjeta" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-texto-secundario)' }}>
          <Info size={40} style={{ margin: '0 auto 16px', color: 'var(--color-primario)' }} />
          <p style={{ fontWeight: 600 }}>No hay mascotas registradas.</p>
          <p style={{ fontSize: '15px', marginTop: '4px' }}>Hacé clic en Agregar para registrar la primera.</p>
        </div>
      ) : (
        <div>
          {mascotas.map((mascota) => {
            let desc = mascota.caracteristicas;
            try {
              const carac = JSON.parse(mascota.caracteristicas);
              desc = `Color: ${carac.color || 'No especificado'} | Raza: ${carac.raza || 'Mestizo'}`;
            } catch {
              // no es JSON
            }

            return (
              <div className="tarjeta" key={mascota.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', color: 'var(--color-primario)' }}>{mascota.nombre}</h3>
                    <p style={{ fontSize: '15px', color: 'var(--color-texto-secundario)' }}>
                      {mascota.especie === 'CANINO' ? '🐶 Perro' : mascota.especie === 'FELINO' ? '🐱 Gato' : '🐾 Otro'} • {mascota.tamano}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => abrirModalEditar(mascota)}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-secundario)' }}
                      title="Editar"
                    >
                      <Edit size={20} />
                    </button>
                    <button 
                      onClick={() => eliminarMascota(mascota.id, mascota.nombre)}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-alerta)' }}
                      title="Eliminar"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--color-borde)', paddingTop: '10px', fontSize: '15px' }}>
                  <p><strong>Estado:</strong> {mascota.estadoAdopcion === 'CON_DUENO' ? 'Con Dueño' : mascota.estadoAdopcion === 'EN_TRANSITO' ? 'En Tránsito' : 'Adoptable'}</p>
                  <p><strong>Energía:</strong> {mascota.nivelEnergia}</p>
                  <p><strong>Características:</strong> {desc}</p>
                  {mascota.nombreDueno && <p style={{ fontSize: '13px', color: 'var(--color-texto-secundario)', marginTop: '4px' }}>Dueño: {mascota.nombreDueno}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal / Formulario de Creación/Edición */}
      {mostrarModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1100, padding: '16px'
        }}>
          <div className="tarjeta" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>{editandoId ? 'Editar Mascota' : 'Registrar Mascota'}</h2>
              <button onClick={() => setMostrarModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={guardarMascota}>
              <div className="grupo-formulario">
                <label className="etiqueta-formulario">Nombre</label>
                <input type="text" className="campo-entrada" value={nombre} onChange={e => setNombre(e.target.value)} required placeholder="Ej: Firulais" />
              </div>

              <div className="grupo-formulario">
                <label className="etiqueta-formulario">Especie</label>
                <select className="campo-entrada" value={especie} onChange={e => setEspecie(e.target.value)}>
                  <option value="CANINO">Canino</option>
                  <option value="FELINO">Felino</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>

              <div className="grupo-formulario">
                <label className="etiqueta-formulario">Estado</label>
                <select className="campo-entrada" value={estadoAdopcion} onChange={e => setEstadoAdopcion(e.target.value)}>
                  <option value="CON_DUENO">Con Dueño</option>
                  <option value="EN_TRANSITO">En Tránsito</option>
                  <option value="ADOPTABLE">Adoptable</option>
                </select>
              </div>

              <div className="grupo-formulario">
                <label className="etiqueta-formulario">Nivel de Energía</label>
                <select className="campo-entrada" value={nivelEnergia} onChange={e => setNivelEnergia(e.target.value)}>
                  <option value="BAJO">Bajo</option>
                  <option value="MEDIO">Medio</option>
                  <option value="ALTO">Alto</option>
                </select>
              </div>

              <div className="grupo-formulario">
                <label className="etiqueta-formulario">Tamaño</label>
                <select className="campo-entrada" value={tamano} onChange={e => setTamano(e.target.value)}>
                  <option value="CHICO">Chico</option>
                  <option value="MEDIANO">Mediano</option>
                  <option value="GRANDE">Grande</option>
                </select>
              </div>

              <div className="grupo-formulario">
                <label className="etiqueta-formulario">Color</label>
                <input type="text" className="campo-entrada" value={color} onChange={e => setColor(e.target.value)} placeholder="Ej: Marrón y negro" />
              </div>

              <div className="grupo-formulario" style={{ marginBottom: '24px' }}>
                <label className="etiqueta-formulario">Raza</label>
                <input type="text" className="campo-entrada" value={raza} onChange={e => setRaza(e.target.value)} placeholder="Ej: Mestizo o Siames" />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" className="boton-secundario" onClick={() => setMostrarModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="boton-principal">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
