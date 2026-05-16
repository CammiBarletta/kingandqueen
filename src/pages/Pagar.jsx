// Pagar.jsx
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from '../context/AuthContext';
import { useCartContext } from '../context/CartContext';
import { enviarMailPedido } from "../services/emailService";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Pagar() {
  const { usuario } = useAuthContext();
  const { carrito, total, vaciarCarritoSilencioso, enviarPedidoPorWhatsapp, generarNumeroPedido } = useCartContext();
  const navigate = useNavigate();
  const [procesando, setProcesando] = useState(false);
  const [telefono, setTelefono] = useState("");
  const [errorTelefono, setErrorTelefono] = useState("");
 
  if (!usuario) return <Navigate to="/iniciarsesion" replace />;

  if (carrito.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <p className="fs-5 mb-3">No tenés productos en el carrito.</p>
        <button
          className="btn"
          style={{ backgroundColor: "#4DB8C8", color: "white" }}
          onClick={() => navigate("/productos")}
        >
          Ver productos
        </button>
      </div>
    );
  }
const confirmarCompra = async () => {
  setProcesando(true);
  try {
    const numeroPedido = generarNumeroPedido();

    const pedidoData = {
      numeroPedido,
      fecha: new Date(),
      estado: "pendiente",
      usuario: {
        uid: usuario.uid,
        nombre: usuario.nombre,
        email: usuario.email,
      },
      productos: carrito.map(item => ({
        id: item.id,
        nombre: item.nombre,
        precio: Number(item.precio),
        cantidad: item.cantidad || 1,
        subtotal: Number(item.precio) * (item.cantidad || 1),
        imagen: item.imagen || item.avatar || "",
      })),
      total,
    };

    // 🔥 1 Guardar en Firestore
    await addDoc(collection(db, "pedidos"), {
      ...pedidoData,
      fecha: serverTimestamp(),
    });

    // 🔥 2 Enviar email automático
    await enviarMailPedido(pedidoData);

    // 🔥 3 WhatsApp
    enviarPedidoPorWhatsapp(numeroPedido);

    // 🔥 4 Limpiar carrito
    vaciarCarritoSilencioso();

    toast.success(`¡Pedido ${numeroPedido} enviado!`);
    navigate("/productos");

  } catch (error) {
    console.error(error);
    toast.error("Hubo un error al procesar el pedido.");
  } finally {
    setProcesando(false);
  }
};
  
  return (
    <div className="container mt-4 mb-5" style={{ maxWidth: "680px" }}>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ color: "#2C2C2C", fontWeight: "700" }}>
            Resumen de tu compra
          </h2>
          <p className="text-muted small mb-0">
            Revisá tu pedido antes de confirmar
          </p>
        </div>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate("/carrito")}
        >
          ← Volver al carrito
        </button>
      </div>

      {/* Datos del comprador */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-3" style={{ color: "#4DB8C8" }}>
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
             Productos
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
                {/* ✅ imagen unificada + fallback */}
                <img
                  src={producto.imagen || producto.avatar}
                  alt={producto.nombre}
                  onError={(e) => {
                    e.target.src = "https://placehold.co/80x80?text=Sin+imagen";
                  }}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    flexShrink: 0,
                  }}
                />
                <div className="flex-grow-1">
                  <p className="fw-bold mb-1">{producto.nombre}</p>
                  <p className="text-muted mb-1" style={{ fontSize: "0.85rem" }}>
                    ${precioUnitario.toLocaleString("es-AR")} por unidad
                  </p>
                  <p className="mb-0 text-muted" style={{ fontSize: "0.85rem" }}>
                    Cantidad: {cantidad}
                  </p>
                </div>
                <div className="text-end">
                  <p className="fw-bold mb-0" style={{ color: "#4DB8C8" }}>
                    ${subtotal.toLocaleString("es-AR")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Total */}
      <div className="card mb-4 shadow-sm border-0" style={{ backgroundColor: "#f8fffe" }}>
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0">Total a pagar</h5>
            <small className="text-muted">El pago se coordina por WhatsApp</small>
          </div>
          <h3 className="mb-0 fw-bold" style={{ color: "#4DB8C8" }}>
            ${total.toLocaleString("es-AR")}
          </h3>
        </div>
      </div>

      {/* Aviso */}
      <div className="alert alert-info d-flex gap-2 align-items-start mb-4" style={{ fontSize: "0.88rem" }}>
        <span>ℹ️</span>
        <span>
          Al confirmar, se abrirá WhatsApp con el detalle de tu pedido.
          Coordinamos el pago y el envío por ese medio.
        </span>
      </div>

      {/* Botón confirmar */}
      <button
        className="btn w-100 py-3"
        style={{
          backgroundColor: procesando ? "#ccc" : "#21924a",
          color: "white",
          borderRadius: "8px",
          fontSize: "1rem",
          fontWeight: "600",
        }}
        onClick={confirmarCompra}
        disabled={procesando}
      >
        {procesando
          ? "Procesando..."
          : "✅ Confirmar y enviar pedido por WhatsApp"}
      </button>

    </div>
  );
}