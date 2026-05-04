import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from "../context/AuthContext";

function RutaProtegida({ children, soloAdmin = false }) {
  const { usuario, cargando } = useAuthContext();
  const location = useLocation();

  if (cargando) return <div>Cargando...</div>;

if (!usuario) {
  return (
    <Navigate
      to="/iniciarsesion"
      state={{ desde: location.pathname }}
      replace
    />
  );
}

  if (soloAdmin && usuario.nombre !== "admin") {
    return <Navigate to="/productos" replace />;
  }

  return children;
}

export default RutaProtegida;