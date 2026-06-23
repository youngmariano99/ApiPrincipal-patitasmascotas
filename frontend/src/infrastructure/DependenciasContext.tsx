import React, { createContext, useContext } from 'react';
import type { IClienteApi } from '../domain/interfaces/IClienteApi';
import type { IStorageAutenticacion } from '../domain/interfaces/IStorageAutenticacion';
import { FetchApiClientAdapter } from './adapters/FetchApiClientAdapter';
import { AutenticacionStorageAdapter } from './adapters/AutenticacionStorageAdapter';
import { LoggerEmpatico } from './logging/LoggerEmpatico';

interface ContenedorDependencias {
  clienteApi: IClienteApi;
  storageAutenticacion: IStorageAutenticacion;
  logger: LoggerEmpatico;
}

// Inicialización de las implementaciones concretas (Adapters)
const storageAutenticacion = new AutenticacionStorageAdapter();
const clienteApi = new FetchApiClientAdapter(storageAutenticacion);
const logger = LoggerEmpatico.obtenerInstancia();

const DependenciasContext = createContext<ContenedorDependencias>({
  clienteApi,
  storageAutenticacion,
  logger,
});

export const ProveedorDependencias: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <DependenciasContext.Provider value={{ clienteApi, storageAutenticacion, logger }}>
      {children}
    </DependenciasContext.Provider>
  );
};

export const useDependencias = () => useContext(DependenciasContext);
