import { Link } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
 
const estilos = {
  card: {
    background: "white",
    border: "0.5px solid #e0e0e0",
    borderRadius: "12px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: "border-color 0.2s, transform 0.2s",
  },
  imagen: {
    width: "100%",
    height: "190px",
    objectFit: "cover",
    display: "block",
  },
  cuerpo: {
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  badge: {
    display: "inline-block",
    background: "#e8f8fb",
    color: "#0e7a8a",
    fontSize: "11px",
    fontWeight: "500",
    padding: "3px 9px",
    borderRadius: "20px",
    marginBottom: "8px",
    alignSelf: "flex-start",
  },
  titulo: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#1a1a1a",
    margin: "0 0 6px",
  },
  descripcion: {
    fontSize: "13px",
    color: "#666",
    lineHeight: "1.5",
    flex: 1,
    margin: "0 0 12px",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  precio: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#0e7a8a",
    margin: "0 0 12px",
  },
  btnGhost: {
    background: "transparent",
    color: "#4DB8C8",
    border: "1px solid #4DB8C8",
    borderRadius: "8px",
    padding: "8px 0",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    marginBottom: "8px",
    width: "100%",
  },
  btnSolido: {
    background: "#4DB8C8",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "9px 0",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    width: "100%",
  },
};
 
export default function ProductoCard({ producto }) {
  const { agregarAlCarrito } = useCartContext();
 
  return (
    <div
      style={estilos.card}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "#4DB8C8";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "#e0e0e0";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <img
     src={producto.imagen || producto.avatar}
  alt={producto.nombre}
  style={estilos.imagen}
  onError={e => { e.target.src = "https://placehold.co/400x300?text=Sin+imagen";
 }}
/>
      <div style={estilos.cuerpo}>
        {producto.categoria && (
          <span style={estilos.badge}>{producto.categoria}</span>
        )}
        <h5 style={estilos.titulo}>{producto.nombre}</h5>
        <p style={estilos.descripcion}>{producto.descripcion}</p>
        <p style={estilos.precio}>
          ${Number(producto.precio).toLocaleString("es-AR")}
        </p>
 <Link
  to={`/productos/${producto.id}`}
  state={{ producto }}
  style={{
    ...estilos.btnGhost,
    display: "block",
    textAlign: "center",
    textDecoration: "none",
    marginBottom: "8px",
    boxSizing: "border-box",
  }}
>
  Más info
</Link>
 
        <button
          style={estilos.btnSolido}
          onClick={() => agregarAlCarrito(producto)}
          onMouseEnter={e => e.currentTarget.style.background = "#3aa5b5"}
          onMouseLeave={e => e.currentTarget.style.background = "#4DB8C8"}
        >
          + Agregar al carrito
        </button>
      </div>
    </div>
  );
}