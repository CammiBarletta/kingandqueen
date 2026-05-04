import { useNavigate } from "react-router-dom";
import { useCartContext } from '../context/CartContext';

export default function CartDrawer() {
  const {
    carrito,
    total,
    isDrawerOpen,
    cerrarDrawer,
    vaciarCarrito,
    eliminarDelCarrito,
    agregarCantidad,
    quitarCantidad,
  } = useCartContext();

  const navigate = useNavigate();

const handlePagar = () => {
  cerrarDrawer();
  navigate("/pagar");
};
  return (
    <>
      {/* Overlay oscuro detrás del drawer */}
      {isDrawerOpen && (
        <div
          onClick={cerrarDrawer}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1040,
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "420px",
        maxWidth: "100vw",
        height: "100vh",
        backgroundColor: "white",
        zIndex: 1050,
        transform: isDrawerOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s ease",
        display: "flex",
        flexDirection: "column",
        boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
      }}>

        {/* Header del drawer */}
        <div className="d-flex justify-content-between align-items-center p-3"
          style={{ borderBottom: "1px solid #eee" }}>
          <h5 className="mb-0 fw-bold"> Tu carrito</h5>
          <button
            onClick={cerrarDrawer}
            style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#666" }}
          >
            ✕
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          {carrito.length === 0 ? (
            <div className="text-center mt-5">
              <p style={{ fontSize: "3rem" }}>🐾</p>
              <p className="text-muted">Tu carrito está vacío</p>
              <button
                className="btn btn-sm"
                style={{ backgroundColor: "#4DB8C8", color: "white" }}
                onClick={cerrarDrawer}
              >
                Ver productos
              </button>
            </div>
          ) : (
            carrito.map((item) => (
              <div key={item.id}
                className="d-flex gap-3 mb-3 pb-3"
                style={{ borderBottom: "1px solid #f0f0f0" }}
              >
                {/* Imagen */}
                <img
                  src={item.avatar}
                  alt={item.nombre}
                  style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "8px" }}
                />

                {/* Info */}
                <div className="flex-grow-1">
                  <p className="fw-bold mb-1" style={{ fontSize: "0.9rem" }}>{item.nombre}</p>
                  <p className="text-muted mb-2" style={{ fontSize: "0.85rem" }}>
                    ${Number(item.precio).toLocaleString('es-AR')}
                  </p>

                  {/* Controles cantidad */}
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      style={{ width: "28px", height: "28px", padding: 0 }}
                      onClick={() => quitarCantidad(item.id)}
                    >
                      −
                    </button>
                    <span style={{ minWidth: "20px", textAlign: "center", fontWeight: "600" }}>
                      {item.cantidad || 1}
                    </span>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      style={{ width: "28px", height: "28px", padding: 0 }}
                      onClick={() => agregarCantidad(item.id)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Subtotal y eliminar */}
                <div className="d-flex flex-column align-items-end justify-content-between">
                  <button
                    onClick={() => eliminarDelCarrito(item.id)}
                    style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: "1rem" }}
                  >
                    🗑️
                  </button>
                  <span className="fw-bold" style={{ color: "#4DB8C8" }}>
                    ${(Number(item.precio) * (item.cantidad || 1)).toLocaleString('es-AR')}
                  </span>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Footer con total y botones */}
        {carrito.length > 0 && (
          <div style={{ borderTop: "1px solid #eee", padding: "16px" }}>
            <div className="d-flex justify-content-between mb-3">
              <span className="fw-bold">Total</span>
              <span className="fw-bold" style={{ color: "#4DB8C8", fontSize: "1.2rem" }}>
                ${total.toLocaleString('es-AR')}
              </span>
            </div>
           <button
            className="btn w-100 mb-2"
            style={{ backgroundColor: "#4DB8C8", color: "white", borderRadius: "8px" }}
            onClick={handlePagar}
              >
              Continuar con el pago →
            </button>
            <button
              className="btn btn-outline-secondary w-100 btn-sm"
              onClick={vaciarCarrito}
            >
              Vaciar carrito
            </button>
          </div>
        )}

      </div>
    </>
  );
}