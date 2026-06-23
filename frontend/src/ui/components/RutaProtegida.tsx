import React from 'react';
import { Navigate } from 'react-router-dom';
import { useDependencias } from '../../infrastructure/DependenciasContext';

interface PropiedadesRutaProtegida {
  children: React.ReactElement;
}

export const RutaProtegida: React.FC<PropiedadesRutaProtegida> = ({ children }) => {
  const { storageAutenticacion } = useDependencias();
  const token = storageAutenticacion.obtenerToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
