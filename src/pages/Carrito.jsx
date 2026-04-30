import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';
import { useAuthContext } from "../context/AuthContext";

export default function Carrito() {
  const { 
    carrito, 
    total,
    vaciarCarrito,
    eliminarDelCarrito,
    agregarCantidad,
    quitarCantidad,

  } = useCartContext();
  
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  const handlePagar = () => {
    if (!isAuthenticated) {
      navigate("/iniciarsesion", { state: { desde: "/carrito" } });
    } else {
      navigate("/pagar");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Carrito de Compras</h2>
      <hr />
      {carrito.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <>
          {carrito.map((item) => (
            <div key={item.id} className="d-flex align-items-center gap-3 mb-2">
              <span>{item.nombre}</span>
              <span>${Number(item.precio).toFixed(2)}</span>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => quitarCantidad(item.id)}>-</button>
              <span>{item.cantidad || 1}</span>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => agregarCantidad(item.id)}>+</button>
              <button className="btn btn-sm btn-danger" onClick={() => eliminarDelCarrito(item.id)}>✕</button>
            </div>
          ))}
          <hr />
          <h5>Total: ${Number(total).toFixed(2)}</h5>
          <div className="d-flex gap-2 mt-2">
            <button className="btn btn-danger" onClick={vaciarCarrito}>
              Vaciar Carrito
            </button>
            <button
              className="btn"
              style={{ backgroundColor: "#4DB8C8", color: "white" }}
              onClick={handlePagar}
            >
              {isAuthenticated ? "Pagar" : "Iniciar sesión para pagar"}
            </button>
           
          </div>
        </>
      )}
    </div>
  );
}