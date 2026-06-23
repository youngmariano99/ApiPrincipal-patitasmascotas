import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ProveedorDependencias } from './infrastructure/DependenciasContext';
import { RutaProtegida } from './ui/components/RutaProtegida';
import { NavegacionInferior } from './ui/components/NavegacionInferior';
import { Login } from './ui/pages/Login';
import { MascotasDashboard } from './ui/pages/MascotasDashboard';
import { Perfil } from './ui/pages/Perfil';

const ContenedorNavegacion: React.FC = () => {
  const localizacion = useLocation();
  const ocultarNavegacion = localizacion.pathname === '/login';

  return (
    <>
      <Routes>
        <Route 
          path="/" 
          element={
            <RutaProtegida>
              <MascotasDashboard />
            </RutaProtegida>
          } 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
      {!ocultarNavegacion && <NavegacionInferior />}
    </>
  );
};

export const App: React.FC = () => {
  return (
    <ProveedorDependencias>
      <BrowserRouter>
        <ContenedorNavegacion />
      </BrowserRouter>
    </ProveedorDependencias>
  );
};

export default App;
