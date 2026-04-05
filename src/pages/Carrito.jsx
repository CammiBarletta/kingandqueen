import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../context/AppContext"; 


export default function Carrito() { 
  const { carrito, setCarrito, vaciarCarrito, eliminarDelCarrito, isAuthenticated } = useAppContext(); 
  const navigate = useNavigate();
  const quitarCantidad = (idProducto) => {
  const carritoActualizado = carrito.map(producto => {
      if (producto.id === idProducto) {
        const cantidadActual = producto.cantidad || 1;
        if (cantidadActual === 1) return null;
        return { ...producto, cantidad: cantidadActual - 1 };
      }
      return producto;
    }).filter(producto => producto !== null);
    setCarrito(carritoActualizado); // esto sigue funcionando igual
  };

  const agregarCantidad = (idProducto) => {
  const nuevoCarrito = carrito.map(producto => {
      if (producto.id === idProducto) {
        return { ...producto, cantidad: (producto.cantidad || 1) + 1 };
      }
      return producto;
    });
    setCarrito(nuevoCarrito); // esto sigue funcionando igual
  };

  const total = carrito.reduce((sum, item) => {
    const cantidad = item.cantidad || 1;
    return sum + (Number(item.precio) * cantidad);
  }, 0);
  const handlePagar = () => {
    if (!isAuthenticated) {
      navigate("/iniciarsesion", { state: { desde: "/carrito" } }); // ✅ le dice de dónde viene
    } else {
      navigate("/pagar"); // cuando tengas esa página
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
              <button className="btn btn-sm btn-danger" onClick={() => eliminarDelCarrito(item.id)}>✕</button> {/* ✅ botón eliminar producto */}
            </div>
          ))}
          <hr />
          <h5>Total: ${Number(total).toFixed(2)}</h5>
          <button className="btn btn-danger mt-2" onClick={vaciarCarrito}>
            Vaciar Carrito
          </button>
           <button className="btn" style={{ backgroundColor: "#4DB8C8", color: "white" }} onClick={handlePagar}>
              {/* cambia el texto según si está logueado o no */}
              {isAuthenticated ? "Pagar" : "Iniciar sesión para pagar"}
            </button>
        </>
      )}
    </div>
  );
}