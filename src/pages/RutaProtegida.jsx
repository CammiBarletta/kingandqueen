import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from "../context/AuthContext";

function RutaProtegida({ children, soloAdmin = false }) {
  const { usuario, cargando } = useAuthContext();
  const location = useLocation();

  if (cargando) return (
    <div className="d-flex justify-content-center mt-5">
      <div className="spinner-border" style={{ color: "#4DB8C8" }} />
    </div>
  );

  if (!usuario) {
    return (
      <Navigate
        to="/iniciarsesion"
        state={{ desde: location.pathname }}
        replace
      />
    );
  }

  if (soloAdmin && !usuario.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RutaProtegida;