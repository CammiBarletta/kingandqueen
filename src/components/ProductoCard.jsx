import { Link } from "react-router-dom";
import { useCartContext } from "../context/CartContext";

export default function ProductoCard({ producto, isMobile = false }) {
  const { agregarAlCarrito } = useCartContext();

  const estilos = {
    card: {
      background: "white",
      border: "0.5px solid #e0e0e0",
      borderRadius: "12px",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      transition: "border-color 0.2s, transform 0.2s",
      height: "100%",
    },
    imagen: {
      width: "100%",
      height: isMobile ? "140px" : "190px",
      objectFit: "cover",
      display: "block",
    },
    cuerpo: {
      padding: isMobile ? "10px 12px" : "14px 16px",
      display: "flex",
      flexDirection: "column",
      flex: 1,
    },
    badge: {
      display: "inline-block",
      background: "#e8f8fb",
      color: "#0e7a8a",
      fontSize: isMobile ? "10px" : "11px",
      fontWeight: "500",
      padding: "3px 8px",
      borderRadius: "20px",
      marginBottom: "6px",
      alignSelf: "flex-start",
    },
    titulo: {
  fontSize: isMobile ? "13px" : "15px",
  fontWeight: "600",
  color: "#1a1a1a",
  margin: "0 0 5px",
  minHeight: isMobile ? "2.6em" : "3.9em",
  display: "-webkit-box",
  WebkitLineClamp: isMobile ? 2 : 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
},
  descripcion: {
  fontSize: isMobile ? "11px" : "13px",
  color: "#666",
  lineHeight: "1.4",
 minHeight: isMobile ? "2.8em" : "4.2em",
  flex: 1,
  margin: "0 0 10px",
  display: "-webkit-box",
  WebkitLineClamp: isMobile ? 2 : 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
},
    precio: {
      fontSize: isMobile ? "15px" : "18px",
      fontWeight: "700",
      color: "#0e7a8a",
      margin: "0 0 10px",
    },
    btnGhost: {
      background: "transparent",
      color: "#4DB8C8",
      border: "1px solid #4DB8C8",
      borderRadius: "8px",
      padding: isMobile ? "7px 0" : "8px 0",
      fontSize: isMobile ? "12px" : "13px",
      fontWeight: "500",
      cursor: "pointer",
      marginBottom: "6px",
      width: "100%",
      display: "block",
      textAlign: "center",
      textDecoration: "none",
      boxSizing: "border-box",
    },
    btnSolido: {
      background: "#4DB8C8",
      color: "white",
      border: "none",
      borderRadius: "8px",
      padding: isMobile ? "8px 0" : "9px 0",
      fontSize: isMobile ? "12px" : "13px",
      fontWeight: "500",
      cursor: "pointer",
      width: "100%",
    },
  };

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
        onError={e => { e.target.src = "https://placehold.co/400x300?text=Sin+imagen"; }}
      />

      <div style={estilos.cuerpo}>
        {producto.categoria && (
          <span style={estilos.badge}>{producto.categoria}</span>
        )}

        <h5 style={estilos.titulo}>{producto.nombre}</h5>

        {/* Descripción: se oculta en pantallas muy pequeñas (<360px) via inline */}
        {!isMobile && (
          <p style={estilos.descripcion}>{producto.descripcion}</p>
        )}

        <p style={estilos.precio}>
          ${Number(producto.precio).toLocaleString("es-AR")}
        </p>

        <Link
          to={`/productos/${producto.id}`}
          state={{ producto }}
          style={estilos.btnGhost}
        >
          {isMobile ? "Ver" : "Más info"}
        </Link>

        <button
          style={estilos.btnSolido}
          onClick={() => agregarAlCarrito(producto)}
          onMouseEnter={e => e.currentTarget.style.background = "#3aa5b5"}
          onMouseLeave={e => e.currentTarget.style.background = "#4DB8C8"}
        >
          {isMobile ? "+ Agregar" : "+ Agregar al carrito"}
        </button>
      </div>
    </div>
  );
}