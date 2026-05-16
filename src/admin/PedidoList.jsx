import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const ESTADOS = ["pendiente", "confirmado", "enviado", "entregado", "cancelado"];

const COLORES_ESTADO = {
  pendiente:   "warning",
  confirmado:  "primary",
  enviado:     "info",
  entregado:   "success",
  cancelado:   "danger",
};

export default function PedidosList() {
  const [pedidos, setPedidos]     = useState([]);
  const [cargando, setCargando]   = useState(true);
  const [expandido, setExpandido] = useState(null); // id del pedido abierto

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        const q = query(collection(db, "pedidos"), orderBy("fecha", "desc"));
        const snap = await getDocs(q);
        setPedidos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        toast.error("Error al cargar pedidos");
        console.error(error);
      } finally {
        setCargando(false);
      }
    };
    cargarPedidos();
  }, []);

  const cambiarEstado = async (pedidoId, nuevoEstado) => {
    try {
      await updateDoc(doc(db, "pedidos", pedidoId), { estado: nuevoEstado });
      setPedidos(prev =>
        prev.map(p => p.id === pedidoId ? { ...p, estado: nuevoEstado } : p)
      );
      toast.success(`Estado actualizado a "${nuevoEstado}"`);
    } catch {
      toast.error("No se pudo actualizar el estado");
    }
  };

  const formatearFecha = (timestamp) => {
    if (!timestamp) return "—";
    const fecha = timestamp.toDate?.() ?? new Date(timestamp);
    return fecha.toLocaleDateString("es-AR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border" style={{ color: "#4DB8C8" }} />
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-4">

      {/* Header */}
      <div className="mb-4">
        <h1 className="h3 fw-semibold mb-1">Pedidos</h1>
        <p className="text-muted small mb-0">
          {pedidos.length} pedido{pedidos.length !== 1 ? "s" : ""} en total
        </p>
      </div>

      {/* Empty state */}
      {pedidos.length === 0 ? (
        <div className="text-center py-5">
          <p className="fs-1 mb-2">📭</p>
          <p className="fw-medium">Todavía no hay pedidos</p>
          <p className="text-muted small">Cuando un cliente confirme una compra, aparece acá.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {pedidos.map(pedido => (
            <div key={pedido.id} className="card shadow-sm">
              <div className="card-body">

                {/* Fila principal */}
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                  <div>
                    <span className="fw-bold" style={{ color: "#4DB8C8" }}>
                      #{pedido.numeroPedido}
                    </span>
                    <span className="text-muted small ms-2">
                      {formatearFecha(pedido.fecha)}
                    </span>
                    <div className="mt-1">
                      <small className="text-muted">
                         {pedido.usuario?.nombre} — {pedido.usuario?.email}
                      </small>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    {/* Badge estado */}
                    <span className={`badge bg-${COLORES_ESTADO[pedido.estado] || "secondary"}`}>
                      {pedido.estado}
                    </span>

                    {/* Total */}
                    <span className="fw-bold" style={{ color: "#2C2C2C" }}>
                      ${Number(pedido.total).toLocaleString("es-AR")}
                    </span>

                    {/* Cambiar estado */}
                    <select
                      className="form-select form-select-sm"
                      style={{ width: "140px" }}
                      value={pedido.estado}
                      onChange={(e) => cambiarEstado(pedido.id, e.target.value)}
                    >
                      {ESTADOS.map(e => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>

                    {/* Expandir */}
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setExpandido(expandido === pedido.id ? null : pedido.id)}
                    >
                      {expandido === pedido.id ? "▲ Ocultar" : "▼ Ver detalle"}
                    </button>
                  </div>
                </div>

                {/* Detalle expandible */}
                {expandido === pedido.id && (
                  <div className="mt-3 pt-3" style={{ borderTop: "1px solid #f0f0f0" }}>
                    <table className="table table-sm mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Producto</th>
                          <th>Precio unit.</th>
                          <th>Cantidad</th>
                          <th className="text-end">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pedido.productos?.map((p, i) => (
                          <tr key={i}>
                            <td>{p.nombre}</td>
                            <td>${Number(p.precio).toLocaleString("es-AR")}</td>
                            <td>{p.cantidad}</td>
                            <td className="text-end fw-medium">
                              ${Number(p.subtotal).toLocaleString("es-AR")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="3" className="text-end fw-bold">Total</td>
                          <td className="text-end fw-bold" style={{ color: "#4DB8C8" }}>
                            ${Number(pedido.total).toLocaleString("es-AR")}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}