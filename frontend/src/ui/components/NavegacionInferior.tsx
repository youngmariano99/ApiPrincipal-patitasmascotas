import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, User } from 'lucide-react';

export const NavegacionInferior: React.FC = () => {
  return (
    <nav className="navegacion-inferior">
      <NavLink 
        to="/" 
        className={({ isActive }) => `nav-item ${isActive ? 'activo' : ''}`}
      >
        <Heart />
        <span>Mascotas</span>
      </NavLink>

      <NavLink 
        to="/perfil" 
        className={({ isActive }) => `nav-item ${isActive ? 'activo' : ''}`}
      >
        <User />
        <span>Mi Perfil</span>
      </NavLink>
    </nav>
  );
};
