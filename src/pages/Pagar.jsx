import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../context/AuthContext';
import { useCartContext } from '../context/CartContext';

export default function Pagar() {
  const { usuario, cerrarSesion } = useAuthContext();
  const { carrito, total, vaciarCarrito, enviarPedidoPorWhatsapp } = useCartContext();
  const navigate = useNavigate();

  // Guard clause — si no hay usuario redirigí al login
  if (!usuario) {
    navigate("/iniciarsesion");
    return null;
  }

  // Si el carrito está vacío redirigí a productos
  if (carrito.length === 0) {
    navigate("/productos");
    return null;
  }

  const confirmarCompra = () => {
    enviarPedidoPorWhatsapp(); // abre WhatsApp con el pedido
    vaciarCarrito();           // limpia el carrito
    navigate("/productos");    // vuelve a productos
  };

  const manejarCerrarSesion = () => {
    vaciarCarrito();
    cerrarSesion();
    navigate("/");
  };

  return (
    <div className="container mt-4 mb-5">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: "#2C2C2C" }}>Resumen de tu compra</h2>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={manejarCerrarSesion}
        >
          Cerrar sesión
        </button>
      </div>

      {/* Datos del usuario */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title" style={{ color: "#4DB8C8" }}>
             Datos del comprador
          </h5>
          <p className="mb-1"><strong>Nombre:</strong> {usuario.nombre}</p>
          <p className="mb-0"><strong>Email:</strong> {usuario.email}</p>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-3" style={{ color: "#4DB8C8" }}>
            🛒 Productos
          </h5>
          {carrito.map((producto) => {
            const cantidad = Number(producto.cantidad || 1);
            const precioUnitario = Number(producto.precio || 0);
            const subtotal = cantidad * precioUnitario;

            return (
              <div
                key={producto.id}
                className="d-flex align-items-center gap-3 mb-3 pb-3"
                style={{ borderBottom: "1px solid #f0f0f0" }}
              >
                <img
                  src={producto.avatar}
                  alt={producto.nombre}
                  style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
                />
                <div className="flex-grow-1">
                  <p className="fw-bold mb-1">{producto.nombre}</p>
                  <p className="text-muted mb-1" style={{ fontSize: "0.85rem" }}>
                    Precio unitario: ${precioUnitario.toLocaleString('es-AR')}
                  </p>
                  <p className="mb-0" style={{ fontSize: "0.85rem" }}>
                    Cantidad: {cantidad}
                  </p>
                </div>
                <div className="text-end">
                  <p className="fw-bold mb-0" style={{ color: "#4DB8C8" }}>
                    ${subtotal.toLocaleString('es-AR')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Total */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Total a pagar</h5>
          <h4 className="mb-0 fw-bold" style={{ color: "#4DB8C8" }}>
            ${total.toLocaleString('es-AR')}
          </h4>
        </div>
      </div>

      {/* Botones */}
      <div className="d-flex gap-2 flex-wrap">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/carrito")}
        >
          ← Volver al carrito
        </button>
        <button
          className="btn flex-grow-1"
          style={{ backgroundColor: "#21924a", color: "white", borderRadius: "8px" }}
          onClick={confirmarCompra}
        >
           Confirmar y enviar pedido por WhatsApp
        </button>
      </div>

    </div>
  );
}